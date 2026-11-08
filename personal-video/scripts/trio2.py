"""Ten more takes on the trio lift selfie, kept at the photo's own size. No text.

usage: python trio2.py <photo> <people_mask> <out_dir>
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

SRC, MASK, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
img = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32) / 255
H, W = img.shape[:2]
m = cv2.resize(cv2.imread(MASK, 0), (W, H)).astype(np.float32) / 255
FACES = [(837, 412, 200), (1391, 502, 260), (1906, 747, 230)]  # x, y, radius
rng = np.random.default_rng(4)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def hexc(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255


def lum(x):
    return x @ np.array([0.3, 0.55, 0.15], np.float32)


def over(b, l, a):
    return b * (1 - a[..., None]) + l * a[..., None]


def faces_mask(scale=1.0, feather=60):
    f = np.zeros((H, W), np.float32)
    for x, y, r in FACES:
        f = np.maximum(f, np.clip(1 - (np.hypot(xx - x, (yy - y) * 0.85) - r * scale) / feather, 0, 1))
    return f


def save(n, x):
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, n), quality=95)
    print("saved", n, flush=True)


# 1 fisheye: skate-video barrel lens
def fisheye():
    cx, cy = W / 2, H / 2
    nx, ny = (xx - cx) / cx, (yy - cy) / cx
    r = np.sqrt(nx ** 2 + ny ** 2)
    k = 1 + 0.32 * r ** 2
    mx, my = (cx + nx / k * cx * 1.0).astype(np.float32), (cy + ny / k * cx * 1.0).astype(np.float32)
    # zoom so no empty corners
    z = 0.97
    mx, my = cx + (mx - cx) * z, cy + (my - cy) * z
    out = cv2.remap(img, mx.astype(np.float32), my.astype(np.float32), cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    vig = 1 - 0.55 * np.clip(r / 1.2, 0, 1)[..., None] ** 3
    save("11-fisheye.jpg", out * vig)


# 2 spotlight: the lift goes dark, three soft spots on the faces
def spotlight():
    f = faces_mask(1.2, 220)
    save("12-spotlight.jpg", img * (0.18 + 0.82 * f[..., None]))


# 3 stickers: the three of them cut out with a white border on flat lift red
def stickers():
    b = (m > 0.5).astype(np.uint8)
    rim = cv2.GaussianBlur(cv2.dilate(b, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (61, 61))).astype(np.float32), (0, 0), 1.5)
    bg = np.ones_like(img) * img[300:900, 0:250].reshape(-1, 3).mean(0)
    layer = over(np.ones_like(img) * 0.97, img, cv2.GaussianBlur(m, (0, 0), 1))
    sh = np.roll(np.roll(cv2.GaussianBlur(rim, (0, 0), 20), -24, 0), 18, 1) * 0.4
    sh[-24:] = 0
    save("13-sticker.jpg", over(bg * (1 - sh[..., None]), layer, rim))


# 4 reverse censor: everything pixelated except the faces
def reverse_censor():
    px = cv2.resize(cv2.resize(img, (W // 48, H // 48), interpolation=cv2.INTER_AREA), (W, H), interpolation=cv2.INTER_NEAREST)
    f = faces_mask(1.05, 4)
    save("14-reverse-censor.jpg", over(px, img, f))


# 5 glitch: RGB split and shifted slices
def glitch():
    out = img.copy()
    out[..., 0] = np.roll(img[..., 0], 18, 1)
    out[..., 2] = np.roll(img[..., 2], -18, 1)
    for _ in range(9):
        y0 = int(rng.uniform(0, H - 60))
        h = int(rng.uniform(10, 60))
        out[y0:y0 + h] = np.roll(out[y0:y0 + h], int(rng.uniform(-120, 120)), 1)
    save("15-glitch.jpg", out)


# 6 portrait mode: the lift melts into a heavy blur, the three of them stay sharp
def mirror():
    bg = cv2.GaussianBlur(img, (0, 0), 28)
    save("16-portrait-blur.jpg", over(bg, img, cv2.GaussianBlur(m, (0, 0), 2)))


# 7 double exposure: a big ghost of his face over the scene
def double():
    x, y, r = FACES[1]
    ghost = cv2.resize(img[y - 430:y + 430, x - 760:x + 760], (W, H), interpolation=cv2.INTER_CUBIC)
    out = 1 - (1 - img) * (1 - ghost * 0.45)  # screen
    save("17-double-exposure.jpg", out)


# 8 the people stay, the lift turns into a hot-pink flat
def pink_lift():
    a = cv2.GaussianBlur(m, (0, 0), 1.2)
    bg = np.ones_like(img) * hexc("#FF2E93") * (0.55 + 0.6 * lum(img)[..., None])
    save("18-pink-lift.jpg", over(np.clip(bg, 0, 1), img, a))


# 9 the people in black & white, the lift keeps its colours
def bw_people():
    a = cv2.GaussianBlur(m, (0, 0), 1.2)
    save("19-bw-people.jpg", over(img, np.dstack([lum(img)] * 3), a))


# 10 halftone dots in the background only
def dots_bg():
    g = lum(img)
    S, cell = 1, 16
    im = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(im)
    for y in np.arange(cell / 2, H, cell):
        for x in np.arange(cell / 2, W, cell):
            r = (1 - g[int(y), int(x)]) * cell * 0.62
            if r > 0.5:
                d.ellipse([x - r, y - r, x + r, y + r], fill=255)
    dots = np.asarray(im, np.float32)[..., None] / 255
    bg = np.ones_like(img) * hexc("#F3EEE6") * (1 - dots) + hexc("#C23A2B") * dots
    save("20-dots-background.jpg", over(bg, img, cv2.GaussianBlur(m, (0, 0), 1.2)))


for f in (fisheye, spotlight, stickers, reverse_censor, glitch, mirror, double, pink_lift, bw_people, dots_bg):
    f()
