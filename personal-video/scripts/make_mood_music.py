"""Slow moody music beds for the music-only cuts (src/moods.json).

Dark lo-fi at the cut's BPM: soft electric piano, warm pad, sub bass,
a quiet kick/rim/hat groove and vinyl crackle. One track per variant,
sized to its shot list; drums enter at `drumsFromBeat`, everything fades
over the last `fadeOutBeats`.

usage: python make_mood_music.py <moods.json> <out_dir>
"""
import json
import os
import sys
import wave

import numpy as np

SR = 44100
cfg = json.load(open(sys.argv[1]))
out_dir = sys.argv[2]
beat = 60 / cfg["bpm"]

# Am9 - Fmaj9 - Cmaj7 - Em7, one bar each
CHORDS = [
    (33, [57, 60, 64, 67, 71]),
    (29, [53, 57, 60, 64, 67]),
    (36, [55, 60, 64, 67, 71]),
    (28, [55, 59, 62, 64, 67]),
]


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def keys(f, dur):
    t = t_axis(dur)
    env = np.minimum(1, t / 0.01) * np.exp(-t / 1.6)
    tone = np.sin(2 * np.pi * f * t) + 0.18 * np.sin(4 * np.pi * f * t) * np.exp(-t * 3)
    return tone * env * (1 + 0.1 * np.sin(2 * np.pi * 4 * t))


def pad(freqs, dur, rng):
    t = t_axis(dur)
    env = np.minimum(1, t / 1.0) * np.minimum(1, (dur - t) / 0.8)
    s = sum(np.sin(2 * np.pi * f * d * t + rng.uniform(0, 6)) for f in freqs for d in (0.996, 1.004))
    return s * env / (2 * len(freqs))


def sub(f, dur):
    t = t_axis(dur)
    return np.sin(2 * np.pi * f * t) * np.minimum(1, t / 0.02) * np.exp(-t / 1.2)


def kick():
    t = t_axis(0.4)
    f = 42 + 70 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16)


def rim(rng):
    t = t_axis(0.12)
    n = np.diff(rng.standard_normal(len(t) + 1))
    return (0.5 * n * np.exp(-t / 0.015) + np.sin(2 * np.pi * 1700 * t) * np.exp(-t / 0.01))


def hat(rng):
    t = t_axis(0.04)
    return np.diff(rng.standard_normal(len(t) + 1)) * np.exp(-t / 0.008)


def render(v):
    rng = np.random.default_rng(11)
    beats = sum(s["beats"] for s in v["shots"])
    dur = beats * beat
    n = int(dur * SR) + 1
    mix = np.zeros((n, 2))

    def add(sig, at, pan=0.0, gain=1.0):
        i = int(at * SR)
        if i >= n:
            return
        sig = sig[: n - i] * gain
        mix[i:i + len(sig), 0] += sig * np.cos((pan + 1) * np.pi / 4) * np.sqrt(2)
        mix[i:i + len(sig), 1] += sig * np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)

    bar = 4 * beat
    for b in range(int(np.ceil(beats / 4))):
        at = b * bar
        root, notes = CHORDS[b % 4]
        add(pad([midi(x) for x in notes[:3]], bar + 0.6, rng), at, gain=0.16)
        add(sub(midi(root), bar), at, gain=0.3)
        for k, x in enumerate(notes):
            add(keys(midi(x), 3.0), at + k * 0.03, pan=(k - 2) * 0.2, gain=0.06)
        # a soft melodic answer on beat 3
        add(keys(midi(notes[-1] + 12), 1.5), at + 2.5 * beat, pan=0.3, gain=0.04)
        for i in range(8):
            t = at + i * beat / 2
            beat_i = t / beat
            if beat_i < v["drumsFromBeat"] or beat_i >= beats - 1:
                continue
            if i in (0, 5):
                add(kick(), t, gain=0.5)
            if i in (2, 6):
                add(rim(rng), t, pan=-0.1, gain=0.12)
            add(hat(rng), t + (0.06 * beat if i % 2 else 0), pan=0.3, gain=0.05)

    crackle = (rng.random(n) < 30 / SR) * rng.uniform(0.2, 1, n)
    crackle = np.convolve(crackle, np.exp(-np.arange(60) / 8), mode="same") * 0.05
    mix += crackle[:, None]

    time = np.arange(n) / SR
    fade_out = np.clip((dur - time) / (v["fadeOutBeats"] * beat), 0, 1)
    mix *= np.minimum(1, time / 0.3)[:, None] * fade_out[:, None]
    mix = np.tanh(mix * 1.3) / 1.3
    mix /= np.max(np.abs(mix)) / 0.85

    path = os.path.join(out_dir, f"music_{v['id']}.wav")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mix * 32767).astype(np.int16).tobytes())
    print(v["id"], round(dur, 2), "s ->", path)


os.makedirs(out_dir, exist_ok=True)
for v in cfg["variants"]:
    render(v)
