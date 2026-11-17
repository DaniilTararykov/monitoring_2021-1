"""Creative takes on the clean beanie photos. Every image keeps its original size and framing.

A glint   : the silver (pins, chain, rings, rose) catches the light: small 4-point star glints on the brightest
            metal highlights.
B ink     : white hand-drawn punk doodles around the beanie and the rose (stars, sparks, a loop).
C flash   : street shots as if lit by an on-camera flash at dusk: face lifted, edges dropped, fine grain.
D echo    : the profile against the wall leaves two fading silhouette echoes behind him, like movement.

usage: python beanie_creative.py <clean_dir> <out_dir>
"""
import math
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC, OUT = sys.argv[1:3]
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(11)
K = 2576 / 2000  # positions below were read off 2000-wide previews


def load(n):
    return np.asarray(Image.open(os.path.join(SRC, n + ".jpg")).convert("RGB"))


def save(a, n):
    Image.fromarray(a).save(os.path.join(OUT, n + ".jpg"), quality=96, subsampling=0)
    print("saved", n, a.shape[1], "x", a.shape[0])


# ---------------------------------------------------------------- A glint
def star(d, x, y, r, a):
    w = max(1, r // 14)
    for ang, rr in ((0, r), (math.pi / 2, r), (math.pi / 4, r * 0.45), (3 * math.pi / 4, r * 0.45)):
        dx, dy = math.cos(ang) * rr, math.sin(ang) * rr
        d.line([(x - dx, y - dy), (x + dx, y + dy)], fill=(255, 255, 255, a), width=w)


def glint(n, count, boxes):
    im = load(n)
    H, W = im.shape[:2]
    L = cv2.cvtColor(im, cv2.COLOR_RGB2LAB)[..., 0].astype(np.float32)
    bl = cv2.blur(L, (61, 61))
    roi = np.zeros_like(L, bool)
    for x0, y0, x1, y1 in boxes:                             # only where the silver is (pins, chain, rings, rose)
        roi[int(y0 * K):int(y1 * K), int(x0 * K):int(x1 * K)] = True
    hot = ((L - bl > 70) & (L > 175) & (bl < 150) & roi).astype(np.uint8)   # a bright point on dark cloth = metal
    n_c, lab, stats, cent = cv2.connectedComponentsWithStats(hot)
    cand = sorted(range(1, n_c), key=lambda i: -stats[i, cv2.CC_STAT_AREA])
    picked = []
    for i in cand:
        cx, cy = cent[i]
        if all(math.hypot(cx - px, cy - py) > W * 0.05 for px, py, _ in picked):
            picked.append((cx, cy, stats[i, cv2.CC_STAT_AREA]))
        if len(picked) == count:
            break
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    for k, (x, y, area) in enumerate(picked):
        r = int(W * (0.016 + 0.02 * (1 - k / max(1, len(picked)))))
        star(d, x, y, r, 255)
        d.ellipse([x - r * 0.08, y - r * 0.08, x + r * 0.08, y + r * 0.08], fill=(255, 255, 255, 255))
    glow = lay.filter(ImageFilter.GaussianBlur(W / 260))
    out = Image.fromarray(im).convert("RGBA")
    out.alpha_composite(glow)
    out.alpha_composite(lay)
    save(np.asarray(out.convert("RGB")), n + "-glint")


# ---------------------------------------------------------------- B ink
def jit(pts, a):
    return [(x + rng.normal(0, a), y + rng.normal(0, a)) for x, y in pts]


def line(d, pts, w):
    d.line(pts, fill=(255, 255, 255, 255), width=w, joint="curve")
    for x, y in (pts[0], pts[-1]):
        d.ellipse([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill=(255, 255, 255, 255))


def doodle_star(d, x, y, r, w):
    pts = [(x + (r if i % 2 == 0 else r * 0.38) * math.cos(-math.pi / 2 + i * math.pi / 5),
            y + (r if i % 2 == 0 else r * 0.38) * math.sin(-math.pi / 2 + i * math.pi / 5)) for i in range(11)]
    line(d, jit(pts, r * 0.04), w)


def spark(d, x, y, r, ang, w):
    for k in (-1, 0, 1):
        a = ang + k * 0.45
        line(d, jit([(x + math.cos(a) * r * 0.45, y + math.sin(a) * r * 0.45), (x + math.cos(a) * r, y + math.sin(a) * r)], r * 0.02), w)


def ink(n, head, rose=None, sparks=True):
    im = load(n)
    H, W = im.shape[:2]
    S = 2
    lay = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    w = int(W * 0.0055 * S)
    hx, hy, hr = [v * K * S for v in head]                  # top of the beanie, its half-width
    if sparks:
        spark(d, hx + hr * 1.05, hy + hr * 0.1, hr * 0.7, -math.pi / 4, w)
    doodle_star(d, hx - hr * 1.35, hy + hr * 0.15, hr * 0.28, w)
    doodle_star(d, hx + hr * 1.3, hy - hr * 0.2, hr * 0.2, w)
    for k in range(3):                                        # little dots of a dotted orbit
        a = math.pi * (1.05 + k * 0.12)
        rr = hr * 1.55
        d.ellipse([hx + math.cos(a) * rr - w, hy + hr * 0.6 + math.sin(a) * rr * 0.5 - w,
                   hx + math.cos(a) * rr + w, hy + hr * 0.6 + math.sin(a) * rr * 0.5 + w], fill=(255, 255, 255, 255))
    if rose:
        rx, ry, rh = [v * K * S for v in rose]
        loop = [(rx + rh * 0.38 * math.cos(t), ry + rh * 0.62 * math.sin(t)) for t in np.linspace(-1.2, 2 * math.pi - 0.9, 70)]
        line(d, jit(loop, rh * 0.01), w)
    lay = lay.resize((W, H), Image.LANCZOS)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sh.putalpha(lay.split()[3].filter(ImageFilter.GaussianBlur(W / 500)).point(lambda v: int(v * 0.35)))
    out = Image.fromarray(im).convert("RGBA")
    out.alpha_composite(sh, (int(W / 600), int(W / 450)))
    out.alpha_composite(lay)
    save(np.asarray(out.convert("RGB")), n + "-ink")


# ---------------------------------------------------------------- C flash
def flash(n, face):
    im = load(n).astype(np.float32) / 255
    H, W = im.shape[:2]
    fx, fy = face[0] * K, face[1] * K
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.hypot(xx - fx, (yy - fy) * 1.15) / (W * 0.55)
    gain = 1.18 - 0.42 * np.clip(r, 0, 1) ** 1.6              # flash falls off from the face
    x = np.clip(im * gain[..., None], 0, 1)
    x = np.clip((x - 0.5) * 1.08 + 0.5, 0, 1)               # a little punch
    x += rng.normal(0, 0.012, (H, W, 1)).astype(np.float32)
    save((np.clip(x, 0, 1) * 255).astype(np.uint8), n + "-flash")


# ---------------------------------------------------------------- D echo
def echo(n, step, opac=(0.42, 0.22)):
    im = load(n).astype(np.float32)
    out = im.copy()
    for k, o in enumerate(opac, 1):
        sh = np.roll(im, int(step * K * k), axis=1)
        sh[:, : int(step * K * k)] = im[:, : int(step * K * k)]
        out = out * (1 - o) + np.minimum(out, sh) * o           # darken: only his dark silhouette prints on the wall
    out = np.minimum(out, im * 0 + 255)
    save(np.clip(out, 0, 255).astype(np.uint8), n + "-echo")


glint("APC_0799", 6, [(380, 0, 1090, 680)])                              # the beanie
glint("APC_0741", 5, [(760, 110, 1300, 560), (680, 540, 820, 900)])       # beanie pins, rings on the hand
glint("APC_0795", 5, [(1170, 30, 1360, 560), (1120, 600, 1250, 760), (600, 950, 700, 1125)])  # rose, rings
ink("APC_0738", (1010, 150, 260))
ink("APC_0688", (945, 95, 150), rose=(1063, 540, 120), sparks=False)
flash("APC_0744", (1000, 660))
flash("APC_0723", (960, 330))
echo("APC_0775", 150)
echo("APC_0788", 130)
