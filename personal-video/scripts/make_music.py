"""Procedural lo-fi music bed that follows the edit (src/edit.json).

Warm electric-piano chords, soft bass and a light groove, with a build
into the reveal, a hard stop before the lock click and a soft outro.
The bed ducks under the voice-over using public/vo/words.json.

usage: python make_music.py <edit.json> <words.json> <out.wav>
"""
import json
import sys
import wave

import numpy as np

SR = 44100
rng = np.random.default_rng(3)
edit = json.load(open(sys.argv[1]))
words = json.load(open(sys.argv[2]))
m = edit["music"]
beat = 60 / m["bpm"]
N = int(m["end"] * SR)
mix = np.zeros((N, 2))


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


def add(sig, at, pan=0.0, gain=1.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    mix[i:i + len(sig), 0] += sig * np.cos((pan + 1) * np.pi / 4) * np.sqrt(2)
    mix[i:i + len(sig), 1] += sig * np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)


def ep_note(f, dur, bright=0.0):
    t = np.arange(int(dur * SR)) / SR
    env = np.minimum(1, t / 0.006) * np.exp(-t / 1.1)
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.6 * t)
    partials = [(1, 1.0), (2, 0.28 + 0.3 * bright), (3, 0.06 + 0.2 * bright), (4, 0.03 + 0.12 * bright)]
    tone = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (k - 1) * 1.5) for k, a in partials)
    bell = 0.12 * np.sin(2 * np.pi * f * 7 * t) * np.exp(-t / 0.05)
    return (tone + bell) * env * trem


def bass_note(f, dur):
    t = np.arange(int(dur * SR)) / SR
    env = np.minimum(1, t / 0.01) * np.exp(-t / 0.7)
    return np.tanh(1.6 * np.sin(2 * np.pi * f * t)) * env


def kick():
    t = np.arange(int(0.35 * SR)) / SR
    f = 45 + 85 * np.exp(-t / 0.035)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)


def snare():
    t = np.arange(int(0.25 * SR)) / SR
    n = rng.standard_normal(len(t))
    n = np.convolve(n, [1, -0.6], mode="same")
    return (0.7 * n * np.exp(-t / 0.06) + 0.4 * np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.04))


def hat(open_=False):
    t = np.arange(int((0.25 if open_ else 0.05) * SR)) / SR
    n = np.diff(rng.standard_normal(len(t) + 1))
    return n * np.exp(-t / (0.08 if open_ else 0.012))


def pad(freqs, dur):
    t = np.arange(int(dur * SR)) / SR
    env = np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 1.5)
    s = sum(np.sin(2 * np.pi * f * d * t + rng.uniform(0, 6)) for f in freqs for d in (0.997, 1.003))
    return s * env / (2 * len(freqs))


# Dm9 - G13 - Cmaj9 - Am9, one bar each
chords = [
    (38, [62, 65, 69, 72, 76]),
    (43, [59, 64, 65, 69, 71]),
    (36, [60, 64, 67, 71, 74]),
    (45, [60, 64, 67, 69, 71]),
]
bar = 4 * beat


def section(t):
    if t < m["keysFrom"]:
        return None
    if m["silenceFrom"] <= t < m["silenceTo"]:
        return None
    if t >= m["outroFrom"]:
        return "outro"
    if t >= m["buildFrom"]:
        return "build"
    if t >= m["drumsFrom"]:
        return "groove"
    return "intro"


# Musical grid starts on the first keys downbeat.
t0 = m["keysFrom"]
bar_i = 0
while True:
    bstart = t0 + bar_i * bar
    if bstart >= m["end"]:
        break
    root, notes = chords[bar_i % 4]
    sec = section(bstart)
    for b in range(4):
        for half in (0, 0.5):
            t = bstart + (b + half) * beat
            s = section(t)
            if s is None or t >= m["end"]:
                continue
            build_p = np.clip((t - m["buildFrom"]) / (m["silenceFrom"] - m["buildFrom"]), 0, 1) if s == "build" else 0
            room = m["silenceFrom"] - t
            # keys: comp on beat 1 and the "and" of 2 and 4
            if s != "outro" and (b, half) in [(0, 0), (1, 0.5), (3, 0.5)]:
                for k, n in enumerate(notes):
                    add(ep_note(midi(n), min(2.2, room if room > 0 else 2.2), bright=build_p), t + k * 0.012,
                        pan=(k - 2) * 0.18, gain=0.07)
            if s in ("groove", "build"):
                if half == 0 and b in (0, 2) or (b, half) == (1, 0.5):
                    add(kick(), t, gain=0.55)
                if half == 0 and b in (1, 3):
                    add(snare(), t, gain=0.22)
                swing = 0.08 * beat if half else 0
                add(hat(open_=(b, half) == (3, 0.5)), t + swing, pan=0.35, gain=0.1 + 0.05 * build_p)
                if s == "build" and build_p > 0.5:
                    add(hat(), t + 0.25 * beat, pan=-0.3, gain=0.08)
                if half == 0 and b in (0, 2):
                    add(bass_note(midi(root), min(beat * 1.8, room if room > 0 else 9)), t, gain=0.22)
    if sec == "outro" and bstart < m["end"] - 1:
        for k, n in enumerate(notes):
            add(ep_note(midi(n), 3.0), bstart + k * 0.05, pan=(k - 2) * 0.2, gain=0.06)
        add(pad([midi(n) for n in notes[:3]], min(bar + 1.0, m["end"] - bstart)), bstart, gain=0.18)
    bar_i += 1

# Snare roll into the stop.
roll_end = m["silenceFrom"]
for i in range(16):
    t = roll_end - beat * 2 + i * beat / 8
    add(snare(), t, gain=0.05 + 0.012 * i)

# Hard cut at the silence, gentle fade at the end.
time = np.arange(N) / SR
gate = np.ones(N)
gate[(time >= m["silenceFrom"]) & (time < m["silenceTo"])] = 0
fade_out = np.clip((m["end"] - time) / 2.5, 0, 1)
fade_in = np.clip((time - m["keysFrom"]) / 0.4, 0, 1)

# Duck under the voice-over.
duck = np.ones(N)
for v in edit["vo"]:
    info = words.get(v["id"])
    if not info:
        continue
    a, b = int((v["at"] - 0.1) * SR), int((v["at"] + info["dur"] + 0.15) * SR)
    duck[max(a, 0):min(b, N)] = 0.45
k = int(0.08 * SR)
duck = np.convolve(duck, np.ones(k) / k, mode="same")

mix *= (gate * fade_out * fade_in * duck)[:, None]
mix = np.tanh(mix * 1.4) / 1.4
mix /= np.max(np.abs(mix)) / 0.8

pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[3], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("music", m["end"], "s")
