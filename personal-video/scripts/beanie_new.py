"""New looks for the second beanie set (built on the graded photos). Original size and framing.

flash    : paparazzi at night: the world goes dark blue, he is hit by a hard on-camera flash; on the wall his own
           hard flash shadow falls beside him.
negative : the world turns into a film negative, he stays positive.
sort     : pixel-sorting: the background melts down in vertical streaks, he stays untouched.
print    : zine print: the background becomes black halftone dots on paper, he stays in full colour.

usage: python beanie_new.py <graded_dir> <mask_dir> <out_dir>
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

SRC, MC, OUT = sys.argv[1:4]
rng = np.random.default_rng(9)
WALL = {"APC_0775", "APC_0780", "APC_0788", "APC_0795"}


def load(n):
    x = np.asarray(Image.open(os.path.join(SRC, n + ".jpg")).convert("RGB")).astype(np.float32) / 255
    m = np.asarray(Image.open(os.path.join(MC, n + ".png")).convert("L")).astype(np.float32) / 255
    return x, m


def save(x, folder, n):
    os.makedirs(os.path.join(OUT, folder), exist_ok=True)
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, folder, n + ".jpg"),
                                                                    quality=96, subsampling=0)


def lum(x):
    return x @ np.array([0.3, 0.59, 0.11], np.float32)


def over(b, t, a):
    return b * (1 - a[..., None]) + t * a[..., None]


def grain(x, s):
    return x + rng.normal(0, s, x.shape[:2] + (1,)).astype(np.float32)


def flash(n, x, m):
    H, W = m.shape
    ys, xs = np.nonzero(m > 0.5)
    cx, cy = xs.mean(), ys.mean()
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    fall = np.clip(1 - np.hypot((xx - cx) / W, (yy - cy) / H) * 1.25, 0, 1) ** 1.6
    night = x * np.array([0.42, 0.52, 0.85], np.float32)            # dusk turns to night, blue
    if n in WALL:                                                    # the wall is close: the flash reaches it
        lit = night * (0.35 + 1.25 * fall[..., None]) + x * 0.45 * fall[..., None]
        d = int(W * 0.035)
        sh = cv2.warpAffine(m, np.float32([[1, 0, d], [0, 1, int(d * 0.4)]]), (W, H))
        sh = cv2.GaussianBlur(sh, (0, 0), W / 900)                  # a hard flash shadow
        bg = lit * (1 - 0.82 * sh[..., None])
    else:                                                            # the street is far: it stays in the night
        bg = night * (0.3 + 0.35 * fall[..., None])
        hot = np.clip((lum(x) - 0.82) / 0.18, 0, 1)                  # lamps and windows bloom
        bg += cv2.GaussianBlur(hot, (0, 0), W / 200)[..., None] * np.array([1.0, 0.8, 0.55]) * 0.5
    person = np.clip(x * 1.28 + 0.03, 0, 1)                           # flash: brighter, harder, a little warm
    person = np.clip((person - 0.5) * 1.18 + 0.5, 0, 1) * np.array([1.03, 1.0, 0.96], np.float32)
    save(grain(over(bg, person, cv2.GaussianBlur(m, (0, 0), 1.0)), 0.02), "flash", n)


def negative(n, x, m):
    """invert only true background: the area behind him is first filled with the surrounding background,
    so the dark edge of the coat never turns into a bright halo"""
    H, W = m.shape
    band = cv2.dilate((m > 0.05).astype(np.uint8), np.ones((9, 9), np.uint8))
    s = 4
    small = cv2.resize((x * 255).astype(np.uint8), (W // s, H // s), interpolation=cv2.INTER_AREA)
    sm = cv2.resize(band, (W // s, H // s), interpolation=cv2.INTER_NEAREST)
    fill = cv2.inpaint(small, sm, 3, cv2.INPAINT_NS)
    fill = cv2.resize(fill, (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255
    bgsrc = np.where(band[..., None] > 0, fill, x)
    neg = 1 - bgsrc
    neg = np.clip((neg - 0.5) * 1.15 + 0.5, 0, 1) * np.array([1.0, 0.92, 0.85], np.float32)
    save(grain(over(neg, x, cv2.GaussianBlur(m, (0, 0), 1.0)), 0.018), "negative", n)


def pixel_sort(n, x, m):
    H, W = m.shape
    L = lum(x)
    bg = cv2.dilate((m > 0.2).astype(np.uint8), np.ones((9, 9), np.uint8)) == 0
    sel = bg & (L > 0.22) & (L < 0.92)
    out = x.copy()
    for c in range(W):
        col = sel[:, c]
        if not col.any():
            continue
        e = np.flatnonzero(np.diff(np.r_[0, col.astype(np.int8), 0]))
        for s, t in zip(e[::2], e[1::2]):
            if t - s > 12:
                idx = s + np.argsort(-L[s:t, c], kind="stable")      # bright drips down
                out[s:t, c] = x[idx, c]
    save(grain(out, 0.012), "sort", n)


def halftone(n, x, m):
    H, W = m.shape
    cell = max(10, W // 170)
    L = cv2.GaussianBlur(lum(x), (0, 0), cell / 3)
    paper = Image.new("L", (W, H), 255)
    d = ImageDraw.Draw(paper)
    for y in range(cell // 2, H, cell):
        for xx in range(cell // 2 + (cell // 2 if (y // cell) % 2 else 0), W, cell):
            r = (1 - L[y, min(xx, W - 1)]) ** 0.9 * cell * 0.62
            if r > 0.6:
                d.ellipse([xx - r, y - r, xx + r, y + r], fill=20)
    ink = np.asarray(paper, np.float32)[..., None] / 255
    bg = np.array([0.95, 0.93, 0.88], np.float32) * ink + np.array([0.06, 0.05, 0.06], np.float32) * (1 - ink)
    save(grain(over(bg, x, cv2.GaussianBlur(m, (0, 0), 1.0)), 0.01), "print", n)


for n in sorted(f[:-4] for f in os.listdir(SRC)):
    x, m = load(n)
    for fn in (flash, negative, pixel_sort, halftone):
        if os.environ.get("ONLY") in (None, fn.__name__):
            fn(n, x, m)
    print("done", n, flush=True)
