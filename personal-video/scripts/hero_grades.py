"""Four clean, text-free edits of one portrait.

usage: python hero_grades.py <photo> <person_mask> <out_dir>
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image

SRC, MASK, OUT = sys.argv[1:4]
img = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32) / 255
H, W = img.shape[:2]
m = cv2.resize(cv2.imread(MASK, 0), (W, H)).astype(np.float32) / 255
m = cv2.GaussianBlur(m, (0, 0), 1.5)
rng = np.random.default_rng(4)
yy, xx = np.mgrid[0:H, 0:W]


def curve(x, pts):
    xs, ys = zip(*pts)
    return np.interp(x, xs, ys)


def sharpen(x, amt=0.35, r=1.6):
    return np.clip(x + (x - cv2.GaussianBlur(x, (0, 0), r)) * amt, 0, 1)


def grain(x, amt, size=1.0):
    n = rng.standard_normal((int(H / size), int(W / size))).astype(np.float32)
    n = cv2.resize(n, (W, H))
    lum = x.mean(axis=2, keepdims=True)
    return np.clip(x + n[..., None] * amt * (0.6 + 0.8 * lum * (1 - lum) * 2), 0, 1)


def vignette(x, k=0.3, cx=0.5, cy=0.42):
    d = np.sqrt(((xx / W - cx) / 0.75) ** 2 + ((yy / H - cy) / 0.85) ** 2)
    return x * (1 - k * np.clip(d, 0, 1)[..., None] ** 2.2)


def sat(x, s):
    g = x.mean(axis=2, keepdims=True)
    return np.clip(g + (x - g) * s, 0, 1)


def save(name, x):
    os.makedirs(OUT, exist_ok=True)
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, name), quality=95)
    print("saved", name)


base = sharpen(img)

# 1 film: warm shadows, creamy highlights, soft roll-off
x = curve(base, [(0, 0.06), (0.25, 0.2), (0.6, 0.66), (1, 0.94)])
x = sat(x, 0.8)
x = x * np.array([1.05, 1.0, 0.9]) + np.array([0.03, 0.012, -0.02]) * (1 - x.mean(axis=2, keepdims=True))
x = vignette(x, 0.28)
save("01-film.jpg", grain(x, 0.03, 1.3))

# 2 noir: red-filter black & white, deep blacks
g = base @ np.array([0.5, 0.38, 0.12], np.float32)
g = curve(g, [(0, 0.0), (0.12, 0.04), (0.45, 0.42), (0.8, 0.86), (1, 0.97)])
x = np.dstack([g] * 3) * np.array([1.0, 0.985, 0.96])
x = vignette(x, 0.38)
save("02-noir.jpg", grain(x, 0.045, 1.5))

# 3 gallery: cool walls, skin kept warm, quiet contrast
x = curve(base, [(0, 0.03), (0.3, 0.27), (0.7, 0.72), (1, 0.97)])
cool = x * np.array([0.9, 0.99, 1.08])
x = cool * (1 - m[..., None]) + sat(x, 0.92) * m[..., None]
x = sat(x, 0.7)
x = vignette(x, 0.22)
save("03-gallery.jpg", grain(x, 0.022))

# 4 flash: subject lifted, room dropped, hard shadow thrown on the wall
dx, dy = 46, 22
sh = np.zeros_like(m)
sh[dy:, dx:] = m[:-dy, :-dx]
sh = cv2.GaussianBlur(sh, (0, 0), 6) * (1 - m)
floor = (yy > 1080).astype(np.float32)
room = img * 0.82
room = room * (1 - 0.55 * sh[..., None] * (1 - floor[..., None]))
subj = curve(base, [(0, 0.0), (0.2, 0.2), (0.6, 0.68), (1, 1.0)]) * 1.04
x = room * (1 - m[..., None]) + subj * m[..., None]
# flash falloff from the camera
d = np.sqrt(((xx - W * 0.52) / W) ** 2 + ((yy - H * 0.38) / H) ** 2)
x = x * (1.08 - 0.45 * np.clip(d, 0, 1) ** 1.6)[..., None]
x = sat(x, 0.9) * np.array([1.01, 1.0, 0.98])
save("04-flash.jpg", grain(x, 0.025))
