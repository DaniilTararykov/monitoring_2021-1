"""Bright, upbeat bed for the quick "cute reveal" cut (src/cute.json).

Major-key pop loop at the cut's BPM: plucky keys on eighths, bass, soft
four-on-the-floor kick, claps on 2 and 4, shaker and a small glockenspiel
hook. Drops to keys only for the first beat of the "after" shot so the
reveal lands, then fades out.

usage: python make_cute_music.py <cute.json> <out_dir>
"""
import json
import os
import sys
import wave

import numpy as np

SR = 44100
cfg = json.load(open(sys.argv[1]))
beat = 60 / cfg["bpm"]
beats = cfg["hook"]["beats"] + sum(s["beats"] for s in cfg["shots"])
reveal_beat = beats - cfg["shots"][-1]["beats"]
dur = beats * beat
N = int(dur * SR) + 1
mix = np.zeros((N, 2))
rng = np.random.default_rng(5)

# Fmaj7 - G6 - Em7 - Am7 (IV - V - iii - vi in C)
CHORDS = [(41, [65, 69, 72, 76]), (43, [67, 71, 74, 76]), (40, [64, 67, 71, 74]), (45, [64, 67, 69, 72])]
MELODY = [84, 81, 79, 81, 83, 79, 76, 79]


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


def pluck(f, d=0.35):
    t = t_axis(d)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t / 0.12) * np.minimum(1, t / 0.003)


def glock(f):
    t = t_axis(0.8)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 8)) * np.exp(-t / 0.35)


def bass(f, d):
    t = t_axis(d)
    return np.tanh(1.5 * np.sin(2 * np.pi * f * t)) * np.exp(-t / 0.25) * np.minimum(1, t / 0.005)


def kick():
    t = t_axis(0.3)
    return np.sin(2 * np.pi * np.cumsum(48 + 90 * np.exp(-t / 0.03)) / SR) * np.exp(-t / 0.1)


def clap():
    t = t_axis(0.2)
    n = rng.standard_normal(len(t))
    env = sum(np.exp(-np.maximum(t - o, 0) / 0.012) * (t >= o) for o in (0, 0.01, 0.02)) + np.exp(-t / 0.08) * 0.5
    return np.convolve(n, [1, -0.8], mode="same") * env


def shaker():
    t = t_axis(0.05)
    return np.diff(rng.standard_normal(len(t) + 1)) * np.exp(-t / 0.012)


for b in range(int(beats)):
    at = b * beat
    bar, pos = divmod(b, 4)
    root, notes = CHORDS[bar % 4]
    reveal_drop = b == reveal_beat
    for half in (0, 0.5):
        t = at + half * beat
        for k, n in enumerate(notes[1:] if half else notes[:3]):
            add(pluck(midi(n)), t + k * 0.008, pan=(k - 1) * 0.3, gain=0.07)
        if not reveal_drop:
            add(bass(midi(root), beat * 0.45), t, gain=0.22)
            add(shaker(), t, pan=0.4, gain=0.06)
            add(shaker(), t + beat / 4, pan=0.4, gain=0.04)
    if b >= 1 and not reveal_drop:
        add(kick(), at, gain=0.45)
        if pos in (1, 3):
            add(clap(), at, pan=-0.1, gain=0.18)
    if b >= 2 and b % 2 == 0:
        add(glock(midi(MELODY[(b // 2) % len(MELODY)])), at, pan=0.2, gain=0.09)

time = np.arange(N) / SR
mix *= np.clip((dur - time) / (1.5 * beat), 0, 1)[:, None]
mix = np.tanh(mix * 1.2) / 1.2
mix /= np.max(np.abs(mix)) / 0.85

os.makedirs(sys.argv[2], exist_ok=True)
path = os.path.join(sys.argv[2], f"music_{cfg['id']}.wav")
with wave.open(path, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print(cfg["id"], round(dur, 2), "s ->", path)
