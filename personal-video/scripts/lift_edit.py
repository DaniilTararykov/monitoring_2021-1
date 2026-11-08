""""Same lift, different man": original photos, no filter, no text.

1 reels-same-lift.mp4 (1080x1920): every lift selfie face-locked (eyes levelled,
  same size, same spot); outfits cut on the beat, lift "ding" at both ends.
2 lift-log/ carousel (1080x1350): a 3x3 cover of the outfits, then the photos
  cropped consistently around him.

usage: python lift_edit.py <photos_dir> <eyes.json> <out_dir>
"""
import json
import os
import subprocess
import sys
import wave

import cv2
import numpy as np
from PIL import Image

SRC, EYES, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
eyes = json.load(open(EYES))
rng = np.random.default_rng(3)


def load(n):
    return np.asarray(Image.open(os.path.join(SRC, n)).convert("RGB")).astype(np.float32) / 255


def eye(n):
    x0, y0, x1, y1 = eyes[n]["eyes"][0]
    return np.array([(x0 + x1) / 2, (y0 + y1) / 2]), np.hypot(x1 - x0, y1 - y0), np.degrees(np.arctan2(y1 - y0, x1 - x0))


def save(path, x):
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(path, quality=95)
    print("saved", os.path.basename(path), flush=True)


# ---------------------------------------------------------------- face-locked frame
def locked(n, W, H, at, D, punch=1.0):
    """The photo rotated/scaled so the eyes sit at `at`, D px apart; gaps get a soft blurred fill."""
    img = load(n)
    c, d, ang = eye(n)
    s = D / d * punch
    M = cv2.getRotationMatrix2D((float(c[0]), float(c[1])), ang, s)
    M[:, 2] += [at[0] - c[0], at[1] - c[1]]
    fg = cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT)
    a = cv2.warpAffine(np.ones(img.shape[:2], np.float32), M, (W, H), flags=cv2.INTER_LINEAR)
    if a.min() < 0.999:
        ih, iw = img.shape[:2]
        cs = max(W / iw, H / ih)
        bg = cv2.resize(img, (int(iw * cs) + 1, int(ih * cs) + 1), interpolation=cv2.INTER_AREA)
        y0, x0 = (bg.shape[0] - H) // 2, (bg.shape[1] - W) // 2
        bg = cv2.GaussianBlur(bg[y0:y0 + H, x0:x0 + W], (0, 0), 40) * 0.8
        a = cv2.GaussianBlur(a, (0, 0), 2)
        fg = fg * a[..., None] + bg * (1 - a[..., None])
    return fg


# ---------------------------------------------------------------- 1 reels
FPS, BPM = 30, 124
BEAT = 60 / BPM
ORDER = ["05.jpg", "08.jpg", "09.jpg", "14.jpg", "10.jpg", "13.jpg", "03.jpg", "07.jpg", "11.jpg", "04.jpg"]
W, H = 1080, 1920
AT, D = (540, 760), 150
# beats per shot: a held intro, one beat each, a long last look
beats = [2] + [1] * (len(ORDER) - 2) + [3]
starts = np.cumsum([0] + beats[:-1]) * BEAT
DUR = sum(beats) * BEAT

frames = {}
for n in ORDER:
    frames[n] = [locked(n, W, H, AT, D, 1 + 0.05 * np.exp(-k / 2.5)) for k in range(6)]  # small punch-in on the cut
print("frames ready", flush=True)

SR = 44100
mix = np.zeros(int(SR * DUR) + SR)


def add(sig, at, g):
    i = int(at * SR)
    n = min(len(sig), len(mix) - i)
    mix[i:i + n] += sig[:n] * g


def tt(d):
    return np.arange(int(d * SR)) / SR


def ding(f):
    t = tt(1.6)
    return sum(np.sin(2 * np.pi * f * k * t) * a for k, a in ((1, 1), (2.01, 0.35), (3.02, 0.12))) * np.exp(-t / 0.55) * np.minimum(1, t / 0.004)


def kick():
    t = tt(0.3)
    return np.tanh(2 * np.sin(2 * np.pi * np.cumsum(48 + 100 * np.exp(-t / 0.03)) / SR)) * np.exp(-t / 0.12)


def clap():
    t = tt(0.18)
    return np.convolve(rng.standard_normal(len(t)), [1, -0.9], "same") * (np.exp(-t / 0.012) + 0.4 * np.exp(-t / 0.06))


def hat():
    t = tt(0.04)
    return np.diff(rng.standard_normal(len(t) + 1)) * np.exp(-t / 0.008)


def bass(f, d):
    t = tt(d)
    return np.tanh(1.6 * np.sin(2 * np.pi * f * t)) * np.exp(-t / 0.2) * np.minimum(1, t / 0.005)


add(ding(659.3), 0.02, 0.35)
add(ding(523.3), 0.30, 0.35)
total_beats = sum(beats)
notes = [41, 41, 44, 39]
for b in range(2, total_beats - 2):
    at = b * BEAT
    add(kick(), at, 0.55)
    add(hat(), at + BEAT / 2, 0.12)
    if b % 2:
        add(clap(), at, 0.22)
    add(bass(440 * 2 ** ((notes[(b // 2) % 4] - 69) / 12), BEAT * 0.45), at + BEAT / 2, 0.25)
end = (total_beats - 2) * BEAT
add(kick(), end, 0.6)
add(ding(659.3), end + 0.05, 0.35)
add(ding(523.3), end + 0.33, 0.35)
mix = mix[: int(SR * DUR)]
mix /= np.max(np.abs(mix)) / 0.85
wav = os.path.join(OUT, "_lift.wav")
with wave.open(wav, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())

p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                      "-i", "-", "-i", wav, "-c:v", "libx264", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac",
                      "-b:a", "160k", "-shortest", "-movflags", "+faststart", os.path.join(OUT, "reels-same-lift.mp4")],
                     stdin=subprocess.PIPE)
N = int(DUR * FPS)
for i in range(N):
    t = i / FPS
    k = int(np.searchsorted(starts, t, side="right") - 1)
    local = int((t - starts[k]) * FPS)
    fr = frames[ORDER[k]][min(local, 5)] if k > 0 else frames[ORDER[k]][5]
    p.stdin.write((np.clip(fr, 0, 1) * 255).astype(np.uint8).tobytes())
p.stdin.close()
p.wait()
os.remove(wav)
print("saved reels-same-lift.mp4", flush=True)


# ---------------------------------------------------------------- 2 carousel
def natural(n, W, H, eye_y=0.36, zoom=1.0):
    """Cover-crop (no fill) around him: eyes on the same line, as close to centre as the photo allows."""
    img = load(n)
    c, d, _ = eye(n)
    ih, iw = img.shape[:2]
    s = max(W / iw, H / ih) * zoom
    r = cv2.resize(img, (int(iw * s + 0.5), int(ih * s + 0.5)), interpolation=cv2.INTER_AREA)
    x0 = int(np.clip(c[0] * s - W / 2, 0, r.shape[1] - W))
    y0 = int(np.clip(c[1] * s - H * eye_y, 0, r.shape[0] - H))
    return r[y0:y0 + H, x0:x0 + W]


LOG = os.path.join(OUT, "lift-log")
os.makedirs(LOG, exist_ok=True)
GRID = ["05.jpg", "08.jpg", "14.jpg", "09.jpg", "04.jpg", "13.jpg", "03.jpg", "07.jpg", "10.jpg"]
cw, ch = 1080 // 3, 1350 // 3
cover = np.zeros((1350, 1080, 3), np.float32)
for i, n in enumerate(GRID):
    c, d, _ = eye(n)
    img = load(n)
    z = max(1.0, 22 / (d * max(cw / img.shape[1], ch / img.shape[0])))  # bring tiny faces closer
    cover[(i // 3) * ch:(i // 3 + 1) * ch, (i % 3) * cw:(i % 3 + 1) * cw] = natural(n, cw, ch, 0.34, min(z, 2.2))
save(os.path.join(LOG, "01-cover.jpg"), cover)
for j, n in enumerate(["05.jpg", "08.jpg", "14.jpg", "09.jpg", "13.jpg", "10.jpg", "03.jpg", "07.jpg", "04.jpg"]):
    save(os.path.join(LOG, f"{j + 2:02d}.jpg"), natural(n, 1080, 1350, 0.33))
