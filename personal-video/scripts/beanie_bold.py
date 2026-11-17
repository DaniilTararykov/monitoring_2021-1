"""Bold influencer takes on the clean beanie photos. Every image keeps its original size and framing.

A cutout : the background becomes one flat bold colour (cherry / cobalt), he stays in colour with a thick white
           sticker edge and a hard shadow.
B speed  : the street turns black-and-white and smears sideways, he stays sharp and in colour.
C chrome : hard black-and-white, crushed blacks, the silver glows, heavy grain, a touch of RGB split.
D red    : the torn-paper wall turns deep red, he stays as he is.
E burst  : zoom-burst blur around the face, the face stays sharp.

usage: python beanie_bold.py <clean_dir> <out_dir> <mask_cache_dir>
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image

SRC, OUT, MC = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
os.makedirs(MC, exist_ok=True)
rng = np.random.default_rng(5)
K = 2576 / 2000
_sess = None


def load(n):
    return np.asarray(Image.open(os.path.join(SRC, n + ".jpg")).convert("RGB")).astype(np.float32) / 255


def mask(n):
    p = os.path.join(MC, n + ".png")
    if not os.path.exists(p):
        global _sess
        from rembg import new_session, remove
        _sess = _sess or new_session("birefnet-portrait")
        remove(Image.open(os.path.join(SRC, n + ".jpg")), session=_sess, only_mask=True).save(p)
    return np.asarray(Image.open(p).convert("L")).astype(np.float32) / 255


def save(x, n):
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, n + ".jpg"), quality=96, subsampling=0)
    print("saved", n, x.shape[1], "x", x.shape[0], flush=True)


def hexc(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255


def lum(x):
    return x @ np.array([0.3, 0.59, 0.11], np.float32)


def over(b, t, a):
    return b * (1 - a[..., None]) + t * a[..., None]


def grain(x, s):
    return x + rng.normal(0, s, x.shape[:2] + (1,)).astype(np.float32)


def fill_blur(x, bg, fn):
    """blur the background only: the person's pixels do not smear into it"""
    num = fn(x * bg[..., None])
    den = fn(np.dstack([bg] * 3))
    return num / np.maximum(den, 1e-3)


def cutout(n, colour):
    x, m = load(n), mask(n)
    H, W = m.shape
    hard = (m > 0.5).astype(np.uint8)
    rim = cv2.dilate(hard, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(W * 0.018) | 1,) * 2))
    rim = cv2.GaussianBlur(rim.astype(np.float32), (0, 0), 1.2)
    c = hexc(colour)
    bg = np.ones_like(x) * c * (0.92 + 0.16 * np.linspace(1, 0, H)[:, None, None])      # a soft top-to-bottom falloff
    d = W * 0.012                                             # shift the shadow without wrapping round the frame
    sh = cv2.warpAffine(cv2.GaussianBlur(rim, (0, 0), W / 300), np.float32([[1, 0, d], [0, 1, d]]), (W, H))
    bg = bg * (1 - 0.45 * sh[..., None])
    out = over(bg, np.ones_like(x), rim)
    person = np.clip((x - 0.5) * 1.12 + 0.5, 0, 1)
    out = over(out, person, cv2.GaussianBlur(m, (0, 0), 0.8))
    save(grain(out, 0.012), n + "-cutout")


def speed(n):
    x, m = load(n), mask(n)
    W = m.shape[1]
    bg = 1 - np.clip(cv2.GaussianBlur(m, (0, 0), 3) * 1.3, 0, 1)
    k = np.zeros((1, int(W * 0.09)), np.float32)
    k[:] = 1 / k.size
    sm = fill_blur(x, bg, lambda a: cv2.filter2D(a, -1, k))
    g = lum(sm)[..., None]
    sm = np.clip((np.repeat(g, 3, 2) - 0.5) * 1.25 + 0.47, 0, 1)
    person = np.clip((x - 0.5) * 1.1 + 0.5, 0, 1)
    save(grain(over(sm, person, cv2.GaussianBlur(m, (0, 0), 1.0)), 0.016), n + "-speed")


def chrome(n):
    x = load(n)
    H, W = x.shape[:2]
    g = lum(x)
    g = np.clip((g - 0.06) / 0.86, 0, 1)
    g = 0.55 * g * g * (3 - 2 * g) + 0.45 * g                 # hard but not burnt: skin keeps its texture
    hi = np.clip((g - 0.86) / 0.14, 0, 1) * (cv2.blur(g, (41, 41)) < 0.55)   # small bright points on dark = silver
    g = np.clip(g + cv2.GaussianBlur(hi.astype(np.float32), (0, 0), W / 250) * 0.45, 0, 1)   # the silver blooms
    out = np.dstack([g] * 3)
    s = int(W * 0.0025)                                        # a slight RGB split
    out[..., 0] = np.roll(g, s, 1)
    out[..., 2] = np.roll(g, -s, 1)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    v = 1 - 0.35 * np.clip(np.hypot((xx - W / 2) / W, (yy - H / 2) / H) * 1.6, 0, 1) ** 2
    save(grain(out * v[..., None], 0.035), n + "-chrome")


def red_wall(n):
    x, m = load(n), mask(n)
    g = lum(x)[..., None]
    deep, light = hexc("#3a0610"), hexc("#e2384a")
    wall = deep + (light - deep) * np.clip((g - 0.15) / 0.85, 0, 1) ** 1.1
    save(grain(over(wall, x, cv2.GaussianBlur(m, (0, 0), 1.0)), 0.012), n + "-red")


def burst(n, face):
    x, m = load(n), mask(n)
    H, W = m.shape
    fx, fy = face[0] * K, face[1] * K
    bg = 1 - np.clip(cv2.GaussianBlur(m, (0, 0), 3) * 1.3, 0, 1)

    def zoom(a):
        acc = np.zeros_like(a)
        for k in range(16):
            s = 1 + 0.10 * k / 15
            M = np.float32([[s, 0, fx * (1 - s)], [0, s, fy * (1 - s)]])
            acc += cv2.warpAffine(a, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        return acc / 16

    z = fill_blur(x, bg, zoom)
    z = np.clip((z - 0.5) * 1.15 + 0.5, 0, 1)
    save(grain(over(z, x, cv2.GaussianBlur(m, (0, 0), 1.2)), 0.014), n + "-burst")


if len(sys.argv) > 4:  # mask only, one photo per process (the segmentation model is heavy)
    mask(sys.argv[4])
    sys.exit()
if os.environ.get("ONLY_CHROME"):
    for n in ("APC_0799", "APC_0795", "APC_0741"):
        chrome(n)
    sys.exit()
cutout("APC_0775", "#b3122a")
cutout("APC_0780", "#1d3fd6")
cutout("APC_0738", "#b3122a")
speed("APC_0688")
speed("APC_0723")
chrome("APC_0799")
chrome("APC_0795")
chrome("APC_0741")
red_wall("APC_0788")
burst("APC_0744", (1000, 650))
