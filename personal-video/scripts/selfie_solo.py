"""Selfie on its own: three clean concepts, original colours, no filter, no text.

usage: python selfie_solo.py <selfie.jpg> <out_dir>
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

SRC, OUT = sys.argv[1:3]
os.makedirs(OUT, exist_ok=True)
img = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32) / 255
H0, W0 = img.shape[:2]
FACE = (1314, 930)  # face centre, image px


def crop(cx, cy, w, h):
    x0 = int(np.clip(cx - w / 2, 0, W0 - w))
    y0 = int(np.clip(cy - h / 2, 0, H0 - h))
    return img[y0:y0 + h, x0:x0 + w]


def fit(a, size):
    return cv2.resize(a, size, interpolation=cv2.INTER_AREA)


def save(name, x):
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, name), quality=95)
    print("saved", name, flush=True)


def sample(px, py, r=25):
    return img[py - r:py + r, px - r:px + r].reshape(-1, 3).mean(0)


# colours picked from the photo itself: red wall, shutter brown, green doors, brick, stone, skin
SWATCH = [sample(1224, 130), sample(1362, 260), sample(1950, 900), sample(150, 1050), sample(2300, 1500), sample(1150, 1000)]
WALL = sample(2050, 300)


# ---------------------------------------------------------------- 1 stamp
def stamp(W, H, name):
    bg = np.ones((H, W, 3), np.float32) * WALL
    sw = int(min(W, H * 0.8) * 0.74)
    sh = int(sw * 1.25)
    border, hole = int(sw * 0.06), int(sw * 0.022)
    photo = fit(crop(*FACE, int(H0 * 0.8), int(H0 * 1.0)), (sw - 2 * border, sh - 2 * border))
    card = np.ones((sh, sw, 3), np.float32) * np.array([0.975, 0.965, 0.945])
    card[border:-border, border:-border] = photo
    a = Image.new("L", (sw, sh), 255)
    d = ImageDraw.Draw(a)
    step = hole * 2.6
    for x in np.arange(step / 2, sw, step):
        d.ellipse([x - hole, -hole, x + hole, hole], fill=0)
        d.ellipse([x - hole, sh - hole, x + hole, sh + hole], fill=0)
    for y in np.arange(step / 2, sh, step):
        d.ellipse([-hole, y - hole, hole, y + hole], fill=0)
        d.ellipse([sw - hole, y - hole, sw + hole, y + hole], fill=0)
    a = np.asarray(a, np.float32) / 255
    pad = 60
    card = cv2.copyMakeBorder(card, pad, pad, pad, pad, cv2.BORDER_CONSTANT)
    a = cv2.copyMakeBorder(a, pad, pad, pad, pad, cv2.BORDER_CONSTANT)
    M = cv2.getRotationMatrix2D((card.shape[1] / 2, card.shape[0] / 2), -4, 1)
    M[:, 2] += [W / 2 - card.shape[1] / 2, H / 2 - card.shape[0] / 2]
    c = cv2.warpAffine(card, M, (W, H), flags=cv2.INTER_CUBIC)
    al = cv2.warpAffine(a, M, (W, H), flags=cv2.INTER_LINEAR)
    shadow = np.roll(np.roll(cv2.GaussianBlur(al, (0, 0), 18), 18, 0), 12, 1) * 0.35
    out = bg * (1 - shadow[..., None])
    out = out * (1 - al[..., None]) + c * al[..., None]
    save(name, out)


# ---------------------------------------------------------------- 2 palette
def palette(W, H, name):
    paper = np.array([0.965, 0.955, 0.94])
    out = np.ones((H, W, 3), np.float32) * paper
    m = int(W * 0.055)
    chip_h = int(H * 0.11)
    ph = H - 3 * m - chip_h
    pw = W - 2 * m
    out[m:m + ph, m:m + pw] = fit(crop(FACE[0], FACE[1] - 60, min(W0, int(H0 * pw / ph)), H0) if pw / ph < W0 / H0
                                  else crop(FACE[0], FACE[1], W0, int(W0 * ph / pw)), (pw, ph))
    n = len(SWATCH)
    gap = int(m * 0.4)
    cw = (pw - gap * (n - 1)) / n
    y0 = m + ph + m
    for i, c in enumerate(SWATCH):
        x0 = int(m + i * (cw + gap))
        out[y0:y0 + chip_h, x0:int(x0 + cw)] = c
    save(name, out)


# ---------------------------------------------------------------- 3 triptych
def triptych(W, H, name):
    paper = np.array([0.965, 0.955, 0.94])
    out = np.ones((H, W, 3), np.float32) * paper
    full = fit(crop(FACE[0], FACE[1], min(W0, int(H0 * W / H * 1.0)), H0) if W / H < W0 / H0
               else crop(FACE[0], FACE[1], W0, int(W0 * H / W)), (W, H))
    m = int(W * 0.05)
    gap = int(W * 0.025)
    sw = (W - 2 * m - 2 * gap) // 3
    shifts = [0, int(H * 0.04), -int(H * 0.025)]
    for i in range(3):
        x = m + i * (sw + gap)
        y0, y1 = m + shifts[i], H - m + shifts[i]
        sy0, sy1 = max(0, y0), min(H, y1)
        out[sy0:sy1, x:x + sw] = full[sy0 - shifts[i]:sy1 - shifts[i], x:x + sw]
    save(name, out)


for fn, tag in ((stamp, "stamp"), (palette, "palette"), (triptych, "triptych")):
    fn(1080, 1440, f"{tag}-3x4.jpg")
    fn(1440, 1080, f"{tag}-4x3.jpg")
