"""Energetic gym bed for the GRWM cuts (src/grwm.json).

House-style loop at the cut's BPM: four-on-the-floor kick, off-beat hats,
claps on 2 and 4, rolling sub bass and minor chord stabs. Filtered intro
until `dropBeat`, one beat of near-silence before the last segment, then a
final hit and a short tail.

usage: python make_gym_music.py <grwm.json> <out.wav>
"""
import json
import sys
import wave

import numpy as np

SR = 44100
cfg = json.load(open(sys.argv[1]))
beat = 60 / cfg["bpm"]
beats = sum(s["beats"] for s in cfg["segments"])
drop = 3
final = beats - cfg["segments"][-1]["beats"]
dur = beats * beat + 0.6
N = int(dur * SR)
mix = np.zeros((N, 2))
rng = np.random.default_rng(9)

# Am - F - C - G
CHORDS = [(45, [57, 60, 64, 69]), (41, [57, 60, 65, 69]), (36, [55, 60, 64, 67]), (43, [55, 59, 62, 67])]


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


def t_axis(d):
    return np.arange(int(d * SR)) / SR


def add(sig, at, pan=0.0, gain=1.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    mix[i:i + len(sig), 0] += sig * np.cos((pan + 1) * np.pi / 4) * np.sqrt(2)
    mix[i:i + len(sig), 1] += sig * np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)


def kick():
    t = t_axis(0.35)
    return np.tanh(2 * np.sin(2 * np.pi * np.cumsum(45 + 110 * np.exp(-t / 0.025)) / SR)) * np.exp(-t / 0.14)


def clap():
    t = t_axis(0.22)
    n = np.convolve(rng.standard_normal(len(t)), [1, -0.85], mode="same")
    env = sum(np.exp(-np.maximum(t - o, 0) / 0.01) * (t >= o) for o in (0, 0.012, 0.024)) + 0.6 * np.exp(-t / 0.07)
    return n * env


def hat(open_=False):
    t = t_axis(0.18 if open_ else 0.05)
    return np.diff(rng.standard_normal(len(t) + 1)) * np.exp(-t / (0.05 if open_ else 0.01))


def stab(notes, d=0.22, bright=1.0):
    t = t_axis(d)
    s = 0
    for n in notes:
        f = midi(n)
        ph = 2 * np.pi * f * t
        saw = sum(np.sin(k * ph) / k for k in range(1, 7)) * bright + np.sin(ph) * (1 - bright)
        s = s + saw
    return s * np.exp(-t / 0.08) * np.minimum(1, t / 0.003) / len(notes)


def sub(f, d):
    t = t_axis(d)
    return np.tanh(1.8 * np.sin(2 * np.pi * f * t)) * np.minimum(1, t / 0.004) * np.exp(-t / 0.18)


for b in range(beats):
    at = b * beat
    root, notes = CHORDS[(b // 4) % 4]
    intro = b < drop
    if b == final - 1:
        continue  # breath before the last shot
    if not intro:
        add(kick(), at, gain=0.6)
        add(hat(), at + beat / 2, pan=0.3, gain=0.12)
        add(hat(), at + beat / 4, pan=-0.3, gain=0.05)
        add(hat(), at + 3 * beat / 4, pan=-0.3, gain=0.05)
        if b % 2 == 1:
            add(clap(), at, gain=0.25)
        add(sub(midi(root), beat * 0.4), at + beat / 2, gain=0.3)
    add(stab(notes, bright=0.3 if intro else 1.0), at + (beat / 2 if b % 2 else 0), pan=0.15, gain=0.09)
    if b % 4 == 3:
        add(stab([n + 12 for n in notes[1:]], d=0.15), at + 3 * beat / 4, pan=-0.2, gain=0.06)

# final hit
add(kick(), final * beat, gain=0.7)
add(stab(CHORDS[0][1] + [81], d=1.2, bright=0.8), final * beat, gain=0.14)

time = np.arange(N) / SR
mix *= np.clip((dur - time) / 1.2, 0, 1)[:, None]
mix = np.tanh(mix * 1.3) / 1.3
mix /= np.max(np.abs(mix)) / 0.88
with wave.open(sys.argv[2], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("gym bed", round(dur, 2), "s")
