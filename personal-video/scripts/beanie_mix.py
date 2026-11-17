"""One different creative idea per photo, on a minimal grade. Original size and framing.

grade (all): white balance moved half way to neutral, a gentle stretch of the tones, nothing else.
0699 smeared city b&w   0715 zoom burst        0723 paparazzi night flash
0738 city in negative   0741 zine halftone     0775 red wall
0780 pixel sort         0788 silhouette echo   0795 spotlight on the rose

usage: python beanie_mix.py <src_dir> <mask_dir> <out_dir>
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

SRC, MC, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(21)
K = 2576 / 2000


def lum(x):
    return x @ np.array([0.3, 0.59, 0.11], np.float32)


def over(b, t, a):
    return b * (1 - a[..., None]) + t * a[..., None]


def grain(x, s):
    return x + rng.normal(0, s, x.shape[:2] + (1,)).astype(np.float32)


def grade(x8):
    lab = cv2.cvtColor(x8, cv2.COLOR_RGB2LAB).astype(np.float32)
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
    neutral = (np.hypot(A - 128, B - 128) < 12) & (L > 70)
    A -= (np.median(A[neutral]) - 128) * 0.5
    B -= (np.median(B[neutral]) - 129) * 0.5
    p0, p1 = np.percentile(L, [0.5, 99.8])
    L[:] = 0.6 * L + 0.4 * np.clip((L - p0) / (p1 - p0), 0, 1) * 255
    return cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB).astype(np.float32) / 255


def load(n):
    x = grade(np.asarray(Image.open(os.path.join(SRC, n + ".jpg")).convert("RGB")))
    m = np.asarray(Image.open(os.path.join(MC, n + ".png")).convert("L")).astype(np.float32) / 255
    return x, m


def save(x, n, tag):
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, f"{n}-{tag}.jpg"),
                                                                    quality=96, subsampling=0)
    print(n, tag, x.shape[1], "x", x.shape[0], flush=True)


def soft(m, s=1.0):
    return cv2.GaussianBlur(m, (0, 0), s)


def bgfill(x, m, grow=9):
    """the background with the area behind him filled in from around (so effects never pick up his edge)"""
    H, W = m.shape
    band = cv2.dilate((m > 0.05).astype(np.uint8), np.ones((grow, grow), np.uint8))
    s = 4
    small = cv2.resize((x * 255).astype(np.uint8), (W // s, H // s), interpolation=cv2.INTER_AREA)
    fill = cv2.inpaint(small, cv2.resize(band, (W // s, H // s), interpolation=cv2.INTER_NEAREST), 3, cv2.INPAINT_NS)
    fill = cv2.resize(fill, (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255
    return np.where(band[..., None] > 0, fill, x)


def smear_bw(n):
    x, m = load(n)
    W = m.shape[1]
    k = np.ones((1, int(W * 0.14)), np.float32) / int(W * 0.14)
    sm = cv2.filter2D(bgfill(x, m, 25), -1, k, borderType=cv2.BORDER_REPLICATE)
    g = np.clip((lum(sm) - 0.5) * 1.4 + 0.47, 0, 1)
    save(grain(over(np.dstack([g] * 3), x, soft(m)), 0.015), n, "smeared-city")


def zoom_burst(n, face):
    x, m = load(n)
    H, W = m.shape
    fx, fy = face[0] * K, face[1] * K
    b = bgfill(x, m, 25)
    acc = np.zeros_like(b)
    for i in range(18):
        s = 1 + 0.12 * i / 17
        acc += cv2.warpAffine(b, np.float32([[s, 0, fx * (1 - s)], [0, s, fy * (1 - s)]]), (W, H),
                              borderMode=cv2.BORDER_REFLECT)
    save(grain(over(acc / 18, x, soft(m)), 0.012), n, "zoom-burst")


def night_flash(n):
    x, m = load(n)
    H, W = m.shape
    ys, xs = np.nonzero(m > 0.5)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    fall = np.clip(1 - np.hypot((xx - xs.mean()) / W, (yy - ys.mean()) / H) * 1.3, 0, 1) ** 1.5
    bg = x * np.array([0.4, 0.5, 0.82], np.float32) * (0.32 + 0.35 * fall[..., None])
    hot = np.clip((lum(x) - 0.8) / 0.2, 0, 1)
    bg += cv2.GaussianBlur(hot, (0, 0), W / 220)[..., None] * np.array([1.0, 0.8, 0.55]) * 0.45
    person = np.clip((x * 1.25 + 0.02 - 0.5) * 1.15 + 0.5, 0, 1) * np.array([1.03, 1.0, 0.96], np.float32)
    save(grain(over(bg, person, soft(m)), 0.02), n, "night-flash")


def negative(n):
    x, m = load(n)
    neg = np.clip((1 - bgfill(x, m) - 0.5) * 1.12 + 0.5, 0, 1) * np.array([1.0, 0.93, 0.86], np.float32)
    save(grain(over(neg, x, soft(m)), 0.015), n, "negative-city")


def halftone(n):
    x, m = load(n)
    H, W = m.shape
    cell = max(10, W // 160)
    L = cv2.GaussianBlur(lum(bgfill(x, m)), (0, 0), cell / 3)
    paper = Image.new("L", (W, H), 255)
    d = ImageDraw.Draw(paper)
    for y in range(cell // 2, H, cell):
        for xx in range(cell // 2 + (cell // 2 if (y // cell) % 2 else 0), W, cell):
            r = (1 - L[y, min(xx, W - 1)]) ** 0.9 * cell * 0.62
            if r > 0.6:
                d.ellipse([xx - r, y - r, xx + r, y + r], fill=20)
    ink = np.asarray(paper, np.float32)[..., None] / 255
    bg = np.array([0.95, 0.93, 0.88], np.float32) * ink + np.array([0.06, 0.05, 0.06], np.float32) * (1 - ink)
    save(grain(over(bg, x, soft(m)), 0.01), n, "zine-print")


def red_wall(n):
    x, m = load(n)
    t = (np.clip((lum(x) - 0.25) / 0.7, 0, 1) ** 1.3)[..., None]
    deep, mid, hot = np.array([0.10, 0.0, 0.02]), np.array([0.62, 0.02, 0.08]), np.array([1.0, 0.33, 0.33])
    wall = np.where(t < 0.6, deep + (mid - deep) * (t / 0.6), mid + (hot - mid) * ((t - 0.6) / 0.4))
    H, W = m.shape
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    v = 1 - 0.5 * np.clip(np.hypot((xx - W / 2) / W, (yy - H / 2) / H) * 1.5, 0, 1) ** 1.8
    save(grain(over(wall * v[..., None], x, soft(m)), 0.018), n, "red-wall")


def pixel_sort(n):
    x, m = load(n)
    H, W = m.shape
    L = lum(x)
    sel = (cv2.dilate((m > 0.2).astype(np.uint8), np.ones((9, 9), np.uint8)) == 0) & (L > 0.22) & (L < 0.92)
    out = x.copy()
    for c in range(W):
        e = np.flatnonzero(np.diff(np.r_[0, sel[:, c].astype(np.int8), 0]))
        for s, t in zip(e[::2], e[1::2]):
            if t - s > 12:
                out[s:t, c] = x[s + np.argsort(-L[s:t, c], kind="stable"), c]
    save(grain(out, 0.01), n, "pixel-sort")


def echo(n, step):
    x, m = load(n)
    H, W = m.shape
    out = x.copy()
    for k, o in ((2, 0.2), (1, 0.38)):                         # far echo first, then the near one
        d = step * K * k
        sx = cv2.warpAffine(x, np.float32([[1, 0, d], [0, 1, 0]]), (W, H), borderMode=cv2.BORDER_REPLICATE)
        sm = cv2.warpAffine(m, np.float32([[1, 0, d], [0, 1, 0]]), (W, H))
        out = over(out, sx, sm * o)
    save(grain(over(out, x, soft(m)), 0.01), n, "echo")


def spotlight(n, cx, cy):
    x, m = load(n)
    H, W = m.shape
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.hypot((xx - cx * K) / W, (yy - cy * K) / H * 0.75)
    gain = 0.22 + 0.95 * np.clip(1 - r / 0.42, 0, 1) ** 1.4
    save(grain(x * gain[..., None], 0.014), n, "spotlight")


smear_bw("APC_0699")
zoom_burst("APC_0715", (920, 200))
night_flash("APC_0723")
negative("APC_0738")
halftone("APC_0741")
red_wall("APC_0775")
pixel_sort("APC_0780")
echo("APC_0788", 140)
spotlight("APC_0795", 1260, 420)
