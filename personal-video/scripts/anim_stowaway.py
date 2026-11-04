"""Animated "stowaway": he peeks out of the pink trunk, looks around, ducks. Loops.

usage: python anim_stowaway.py <venice_dir> <masks_dir> <out.mp4>
"""
import os
import subprocess
import sys
import wave

import cv2
import numpy as np
from PIL import Image, ImageDraw

SRC, MASKS, OUT = sys.argv[1:4]
W, H, FPS, DUR = 1080, 1350, 30, 7.0
N = int(FPS * DUR)
rng = np.random.default_rng(8)
PINK = np.array([255, 46, 147], np.float32) / 255
PAPER = np.array([0xEE, 0xE9, 0xDF], np.float32) / 255


def load(n):
    return np.asarray(Image.open(os.path.join(SRC, n + ".jpg")).convert("RGB")).astype(np.float32) / 255


def lum(x):
    return x @ np.array([0.3, 0.55, 0.15], np.float32)


def xerox(x, k=6.0, mid=0.4):
    return np.interp(1 / (1 + np.exp(-(lum(x) - mid) * k)), [0, 1], [0.06, 0.96])


def pinkify(x):
    return np.clip(PINK * np.clip(0.5 + lum(x) * 1.6, 0, 1.25)[..., None], 0, 1)


def dirt(seed):
    """One frame of photocopier dust and grain (cycled for a boiling texture)."""
    r = np.random.default_rng(seed)
    layer = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(layer)
    for _ in range(650):
        cx, cy, rad = r.uniform(0, W), r.uniform(0, H), r.uniform(0.4, 1.8)
        d.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=int(r.uniform(90, 255)))
    for _ in range(4):
        cx = r.uniform(0, W)
        d.line([(cx, 0), (cx + r.uniform(-8, 8), H)], fill=int(r.uniform(25, 60)), width=1)
    s = np.asarray(layer, np.float32)[..., None] / 255
    g = cv2.resize(r.standard_normal((int(H / 1.4), int(W / 1.4))).astype(np.float32), (W, H))[..., None]
    return s, g


# ---------------------------------------------------------------- static layers
lug = load("v5")
k5 = lug.shape[1] / 2000
tx0, ty0, tx1, ty1 = [int(v * k5) for v in (1098, 952, 1668, 1242)]
trunk = np.zeros(lug.shape[:2], np.float32)
trunk[ty0:ty1, tx0:tx1] = 1
trunk = cv2.GaussianBlur(trunk, (0, 0), 1.5)
base = np.dstack([xerox(lug)] * 3) * PAPER
base = base * (1 - trunk[..., None]) + pinkify(lug) * trunk[..., None]
cw = int(lug.shape[0] * 0.8)
ch = int(cw * 5 / 4)
x0 = int(np.clip((tx0 + tx1) / 2 - cw / 2, 0, lug.shape[1] - cw))
y0 = (lug.shape[0] - ch) // 2
sc = W / cw
base = cv2.resize(base[y0:y0 + ch, x0:x0 + cw], (W, H), interpolation=cv2.INTER_AREA)
TX0, TX1, TOP = (tx0 - x0) * sc, (tx1 - x0) * sc, int((ty0 - y0) * sc)

por = load("v7")
pm = cv2.resize(cv2.imread(os.path.join(MASKS, "v7_birefnet-portrait.png"), 0), (por.shape[1], por.shape[0])).astype(np.float32) / 255
ys, xs = np.where(pm > 0.5)
face, fm = por[ys.min():, xs.min():xs.max()], pm[ys.min():, xs.min():xs.max()]
s = (TX1 - TX0) * 0.8 / face.shape[1]
face = cv2.resize(face, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
fm = cv2.resize(fm, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
fh, fw = fm.shape
PAD = 120
face = cv2.copyMakeBorder(face, PAD, PAD, PAD, PAD, cv2.BORDER_CONSTANT)
fm = cv2.copyMakeBorder(fm, PAD, PAD, PAD, PAD, cv2.BORDER_CONSTANT)
FCX = (TX0 + TX1) / 2 + (TX1 - TX0) * 0.08
PEEK = TOP - fh * 0.45      # head top when peeking
HIDE = TOP + 8              # fully behind the lid
DIRT = [dirt(i) for i in range(3)]


def ease_out_back(t):
    c = 1.9
    return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2


def ease_in(t):
    return t * t


def pose(t):
    """(head top y, rotation deg, x offset) at time t (seconds)."""
    def rise(a, b):
        return HIDE + (PEEK - HIDE) * ease_out_back(np.clip((t - a) / (b - a), 0, 1))

    def duck(a, b, y):
        return y + (HIDE - y) * ease_in(np.clip((t - a) / (b - a), 0, 1))

    if t < 1.0:
        return HIDE, 0, 0
    if t < 3.0:                       # peek, look left, look right
        y = rise(1.0, 1.45)
        rot = 0
        if t > 1.7:
            rot = 7 * np.sin(np.clip((t - 1.7) / 1.0, 0, 1) * 2 * np.pi)
        return duck(2.75, 2.95, y), rot, 0
    if t < 3.6:
        return HIDE, 0, 0
    if t < 6.6:                       # second peek, slower, suspicious tilt
        y = HIDE + (PEEK + 30 - HIDE) * ease_out_back(np.clip((t - 3.6) / 0.6, 0, 1))
        rot = -9 * np.clip((t - 4.3) / 0.4, 0, 1)
        return duck(6.2, 6.4, y), rot, 0
    return HIDE, 0, 0


def frame(i):
    t = i / FPS
    y, rot, dx = pose(t)
    M = cv2.getRotationMatrix2D((PAD + fw / 2, PAD + fh), rot, 1)
    M[:, 2] += [FCX - PAD - fw / 2 + dx, y - PAD]
    lay = cv2.warpAffine(face, M, (W, H))
    al = cv2.warpAffine(fm, M, (W, H))
    al[TOP + 4:] = 0
    sh = np.roll(cv2.GaussianBlur(al, (0, 0), 10), 10, 1) * 0.4
    out = base * (1 - sh[..., None])
    out = out * (1 - al[..., None]) + lay * al[..., None]
    sp, g = DIRT[(i // 3) % 3]
    out = np.clip(out + g * 0.045, 0, 1) * (1 - sp * 0.7)
    return (out * 255).astype(np.uint8)


# ---------------------------------------------------------------- sound
SR = 44100
mix = np.zeros(int(SR * DUR))


def add(sig, at, gain):
    i = int(at * SR)
    sig = sig[: len(mix) - i]
    mix[i:i + len(sig)] += sig * gain


def tt(d):
    return np.arange(int(d * SR)) / SR


def boing(d=0.35, f0=180, f1=520):
    t = tt(d)
    f = f0 + (f1 - f0) * (1 - np.exp(-t / 0.05)) + 30 * np.sin(2 * np.pi * 14 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)


def slide_down(d=0.25):
    t = tt(d)
    f = 700 * np.exp(-t / 0.08) + 120
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.1)


def thud():
    t = tt(0.25)
    return np.tanh(3 * np.sin(2 * np.pi * np.cumsum(60 + 80 * np.exp(-t / 0.02)) / SR)) * np.exp(-t / 0.07)


def tick():
    t = tt(0.04)
    return rng.standard_normal(len(t)) * np.exp(-t / 0.006)


add(boing(), 1.0, 0.5)
for a in (1.75, 2.25):
    add(tick(), a, 0.25)
add(slide_down(), 2.75, 0.45)
add(thud(), 2.95, 0.6)
add(boing(0.5, 140, 380), 3.6, 0.45)
add(tick(), 4.3, 0.25)
add(slide_down(), 6.2, 0.45)
add(thud(), 6.4, 0.6)
# quiet room tone so it never goes fully silent
mix += np.convolve(rng.standard_normal(len(mix)), np.ones(40) / 40, "same") * 0.03
mix /= np.max(np.abs(mix)) / 0.8
wav = OUT.replace(".mp4", ".wav")
with wave.open(wav, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())

# ---------------------------------------------------------------- encode
p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                      "-i", "-", "-i", wav, "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac",
                      "-b:a", "160k", "-shortest", "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
for i in range(N):
    p.stdin.write(frame(i).tobytes())
p.stdin.close()
p.wait()
os.remove(wav)
print("saved", OUT)
