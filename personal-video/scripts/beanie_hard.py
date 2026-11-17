"""Second beanie set: a proper grade for every photo, then the hard creative (red wall, smeared city).
Every image keeps its original size and framing.

usage: python beanie_hard.py <src_dir> <out_dir> <mask_dir> [mask <name>]
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image

SRC, OUT, MC = sys.argv[1:4]
rng = np.random.default_rng(3)


def mask(n):
    p = os.path.join(MC, n + ".png")
    if not os.path.exists(p):
        from rembg import new_session, remove
        remove(Image.open(os.path.join(SRC, n + ".jpg")), session=new_session("birefnet-portrait"),
               only_mask=True).save(p)
    return np.asarray(Image.open(p).convert("L")).astype(np.float32) / 255


if len(sys.argv) > 5 and sys.argv[4] == "mask":  # one segmentation per process (the model is heavy)
    mask(sys.argv[5])
    sys.exit()


def load(n):
    return np.asarray(Image.open(os.path.join(SRC, n + ".jpg")).convert("RGB")).astype(np.float32) / 255


def save(x, folder, n):
    os.makedirs(os.path.join(OUT, folder), exist_ok=True)
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, folder, n + ".jpg"),
                                                                    quality=96, subsampling=0)
    print(folder, n, x.shape[1], "x", x.shape[0], flush=True)


def lum(x):
    return x @ np.array([0.3, 0.59, 0.11], np.float32)


def over(b, t, a):
    return b * (1 - a[..., None]) + t * a[..., None]


def grain(x, s):
    return x + rng.normal(0, s, x.shape[:2] + (1,)).astype(np.float32)


def grade(x):
    """the base look: neutral whites, deep but open blacks, filmic contrast, a touch of clarity,
    cool shadows / neutral highlights, skin kept warm, blues calmed down"""
    lab = cv2.cvtColor((x * 255).astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
    neutral = (np.hypot(A - 128, B - 128) < 12) & (L > 70)
    A -= (np.median(A[neutral]) - 128) * 0.85
    B -= (np.median(B[neutral]) - 129) * 0.85
    l = L / 255
    p1, p99 = np.percentile(l, [1, 99.6])
    l = np.clip((l - p1) / (p99 - p1), 0, 1)
    l = 0.6 * (l * l * (3 - 2 * l)) + 0.4 * l                # filmic S
    l = 0.03 + l * 0.95                                       # open blacks, soft top
    base = cv2.GaussianBlur(l, (0, 0), l.shape[1] / 120)
    l = np.clip(l + (l - base) * 0.15, 0, 1)                   # a little clarity
    L[:] = l * 255
    sh = np.clip(1 - l / 0.45, 0, 1)                          # cool the shadows a little
    A -= 1.5 * sh
    B -= 4.0 * sh
    blue = np.clip((128 - B) / 20, 0, 1)                      # calm the blue tones (sky, wall flecks)
    A[:] = 128 + (A - 128) * (0.95 - 0.25 * blue)
    B[:] = 128 + (B - 128) * (0.95 - 0.35 * blue)
    return cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB).astype(np.float32) / 255


def red_wall(n, x, m):
    """the wall becomes deep crimson with hard contrast; he stays graded, the silver catches the light"""
    g = lum(x)
    t = np.clip((g - 0.25) / 0.7, 0, 1) ** 1.3
    deep, mid, hot = np.array([0.10, 0.0, 0.02]), np.array([0.62, 0.02, 0.08]), np.array([1.0, 0.33, 0.33])
    wall = np.where(t[..., None] < 0.6, deep + (mid - deep) * (t[..., None] / 0.6),
                    mid + (hot - mid) * ((t[..., None] - 0.6) / 0.4))
    H, W = g.shape
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    v = 1 - 0.55 * np.clip(np.hypot((xx - W / 2) / W, (yy - H / 2) / H) * 1.5, 0, 1) ** 1.8
    wall = wall * v[..., None]
    person = np.clip((x - 0.5) * 1.12 + 0.48, 0, 1)
    out = over(wall, person, cv2.GaussianBlur(m, (0, 0), 1.0))
    save(grain(out, 0.022), "2-red-wall", n)


def smear(n, x, m, red=False):
    """the city tears sideways into streaks, black-and-white (or blood red); he stays sharp and in colour"""
    H, W = m.shape
    bg = 1 - np.clip(cv2.GaussianBlur(m, (0, 0), 3) * 1.4, 0, 1)
    k = np.zeros((1, int(W * 0.16)), np.float32)
    k[:] = 1 / k.size
    num = cv2.filter2D(x * bg[..., None], -1, k, borderType=cv2.BORDER_REPLICATE)
    den = cv2.filter2D(np.dstack([bg] * 3), -1, k, borderType=cv2.BORDER_REPLICATE)
    sm = num / np.maximum(den, 1e-3)
    g = lum(sm)
    g = np.clip((g - 0.5) * 1.5 + 0.45, 0, 1)
    if red:  # the same crimson as the red wall
        t = g[..., None]
        deep, mid, hot = np.array([0.08, 0.0, 0.02]), np.array([0.62, 0.02, 0.08]), np.array([0.95, 0.28, 0.28])
        city = np.where(t < 0.6, deep + (mid - deep) * (t / 0.6), mid + (hot - mid) * ((t - 0.6) / 0.4))
    else:
        city = np.dstack([g] * 3)
    d = W * 0.012                                             # a hard double edge in the streaks (no wrap-round)
    ghost = cv2.warpAffine(city.astype(np.float32), np.float32([[1, 0, d], [0, 1, 0]]), (W, H),
                           borderMode=cv2.BORDER_REPLICATE)
    city = np.clip(city * 0.78 + ghost * 0.32, 0, 1)
    person = np.clip((x - 0.5) * 1.12 + 0.48, 0, 1)
    out = over(city, person, cv2.GaussianBlur(m, (0, 0), 1.0))
    save(grain(out, 0.022), "3-smeared-city-red" if red else "3-smeared-city", n)


WALL = ["APC_0775", "APC_0780", "APC_0788", "APC_0795"]
STREET = ["APC_0699", "APC_0715", "APC_0723", "APC_0738", "APC_0741"]
for n in WALL + STREET:
    x = grade(load(n))
    save(x, "1-graded", n)
    if n in WALL:
        red_wall(n, x, mask(n))
    else:
        mm = mask(n)
        smear(n, x, mm)
        smear(n, x, mm, red=True)
