"""Suitcase wall, original photo: cases flip one by one to black & white,
then pop into bright colours, then back to the original. Loops on a beat.

Per-case masks come from SAM (label map .npy at any scale), plus a few
hand rectangles for big trunks SAM missed.

usage: python anim_suitcases.py <photo> <labels.npy> <out_dir>
"""
import os
import subprocess
import sys
import wave

import cv2
import numpy as np
from PIL import Image

SRC, LAB, OUT = sys.argv[1:4]
FPS, BPM = 30, 120
BEAT = 60 / BPM
DUR = 16 * BEAT  # 8 s
N = int(FPS * DUR)
rng = np.random.default_rng(5)
os.makedirs(OUT, exist_ok=True)

img = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32) / 255
H0, W0 = img.shape[:2]
lab = np.load(LAB)
ls = W0 / lab.shape[1]
# trunks SAM left out, in label-map pixels
extra = [(565, 635, 885, 765), (0, 445, 270, 630), (0, 0, 50, 135), (858, 330, 920, 345)]
for x0, y0, x1, y1 in extra:
    reg = lab[y0:y1, x0:x1]
    reg[reg == 0] = lab.max() + 1
lab = cv2.resize(lab.astype(np.int32), (W0, H0), interpolation=cv2.INTER_NEAREST)
K = lab.max()

lum = img @ np.array([0.3, 0.55, 0.15], np.float32)
bw = np.dstack([lum] * 3)
PALETTE = ["#FF2E93", "#2F55D4", "#D6F03C", "#FF6A1A", "#7FD3F7", "#9B5CFF"]


def hexc(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255


shade = np.clip(0.38 + lum * 1.35, 0, 1.15)[..., None]
pops = [np.clip(hexc(c) * shade, 0, 1) for c in PALETTE]
STATES = [img, bw] + pops  # 0 original, 1 b&w, 2.. colours

# schedule on a 1/8-note grid: everyone goes grey, a third pop to colour, all return
step = BEAT / 2
ids = np.arange(1, K + 1)
t_bw = rng.choice(np.arange(1, 9), K) * step            # 0.5 .. 4.5 beats
pop_ids = set(rng.choice(ids, int(K * 0.45), replace=False).tolist())
t_pop = rng.choice(np.arange(10, 16), K) * step
pop_col = rng.integers(0, len(PALETTE), K) + 2
t_back = rng.choice(np.arange(18, 30), K) * step          # back to original before the loop


def state_at(t):
    s = np.zeros(K + 1, np.int32)
    for i in range(K):
        st = 0
        if t >= t_bw[i]:
            st = 1
        if (i + 1) in pop_ids and t >= t_pop[i]:
            st = pop_col[i]
        if t >= t_back[i]:
            st = 0
        s[i + 1] = st
    return s


def render(t, box, size):
    x0, y0, cw, ch = box
    sel = state_at(t)[lab[y0:y0 + ch, x0:x0 + cw]]
    out = np.zeros((ch, cw, 3), np.float32)
    for k in np.unique(sel):
        m = sel == k
        out[m] = STATES[k][y0:y0 + ch, x0:x0 + cw][m]
    return cv2.resize(out, size, interpolation=cv2.INTER_AREA)


# ---------------------------------------------------------------- sound: soft beat + a tick per flip
SR = 44100
mix = np.zeros(int(SR * DUR))


def add(sig, at, g):
    i = int(at * SR) % len(mix)
    n = min(len(sig), len(mix) - i)
    mix[i:i + n] += sig[:n] * g


def tt(d):
    return np.arange(int(d * SR)) / SR


def kick():
    t = tt(0.3)
    return np.tanh(2 * np.sin(2 * np.pi * np.cumsum(48 + 90 * np.exp(-t / 0.03)) / SR)) * np.exp(-t / 0.13)


def tick(f):
    t = tt(0.05)
    return np.sin(2 * np.pi * f * t) * np.exp(-t / 0.012)


def hat():
    t = tt(0.04)
    return np.diff(rng.standard_normal(len(t) + 1)) * np.exp(-t / 0.008)


for b in range(16):
    add(kick(), b * BEAT, 0.5)
    add(hat(), b * BEAT + BEAT / 2, 0.12)
events = {}
for arr in (t_bw, t_back):
    for t in arr:
        events[round(t, 3)] = events.get(round(t, 3), 0) + 1
for i in range(K):
    if (i + 1) in pop_ids:
        events[round(t_pop[i], 3)] = events.get(round(t_pop[i], 3), 0) + 1
for t, n in events.items():
    if t < DUR:
        add(tick(900 + 160 * min(n, 6)), t, 0.18 + 0.03 * min(n, 6))
mix /= np.max(np.abs(mix)) / 0.8
wav = os.path.join(OUT, "_suitcases.wav")
with wave.open(wav, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())


def encode(name, box, size):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{size[0]}x{size[1]}",
                          "-r", str(FPS), "-i", "-", "-i", wav, "-c:v", "libx264", "-crf", "17", "-pix_fmt", "yuv420p",
                          "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", os.path.join(OUT, name)],
                         stdin=subprocess.PIPE)
    for i in range(N):
        p.stdin.write((np.clip(render(i / FPS, box, size), 0, 1) * 255).astype(np.uint8).tobytes())
    p.stdin.close()
    p.wait()
    print("saved", name, flush=True)


cw34 = int(H0 * 3 / 4)
encode("suitcases-3x4.mp4", ((W0 - cw34) // 2, 0, cw34, H0), (1080, 1440))
cw43 = int(H0 * 4 / 3)
encode("suitcases-4x3.mp4", ((W0 - cw43) // 2, 0, cw43, H0), (1440, 1080))
os.remove(wav)
