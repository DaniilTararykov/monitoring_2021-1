"""Atmosphere and light, as if made on set: one idea per photo, original colours, original size.

0699 snowfall caught by the flash      0715 light painting wrapped round him   0723 street fog, lamps glowing
0738 through a rainy window            0741 frosted glass                      0775 venetian-blind light (noir)
0780 a giant shadow of the silver rose 0788 three lights, three shadows        0795 a shaft of light with dust

usage: python beanie_atmos.py <src_dir> <mask_dir> <out_dir>
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

SRC, MC, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(8)


def load(n):
    x = np.asarray(Image.open(os.path.join(SRC, n + ".jpg")).convert("RGB")).astype(np.float32) / 255
    a = np.asarray(Image.open(os.path.join(MC, n + ".png")).convert("L")).astype(np.float32) / 255
    return x, cv2.GaussianBlur(a, (0, 0), 0.8)


def save(x, n, tag):
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, f"{n}-{tag}.jpg"),
                                                                    quality=96, subsampling=0)
    print(n, tag, x.shape[1], "x", x.shape[0], flush=True)


def lum(x):
    return x @ np.array([0.3, 0.59, 0.11], np.float32)


def dots(H, W, n, rmin, rmax, blur, alpha):
    im = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(im)
    for _ in range(n):
        x, y, r = rng.uniform(0, W), rng.uniform(0, H), rng.uniform(rmin, rmax)
        d.ellipse([x - r, y - r, x + r, y + r], fill=int(255 * alpha * rng.uniform(0.6, 1)))
    a = np.asarray(im, np.float32) / 255
    return cv2.GaussianBlur(a, (0, 0), blur) if blur else a


def snow(n):
    x, a = load(n)
    H, W = a.shape
    far = dots(H, W, 2600, 1.2, 2.6, 0.8, 0.75)
    k = np.zeros((9, 1), np.float32); k[:] = 1 / 9
    mid = cv2.filter2D(dots(H, W, 500, 3, 6, 1.2, 0.9), -1, k)               # falling: a short vertical streak
    near = dots(H, W, 60, 10, 26, 6, 0.85)                                   # close to the lens, out of focus
    out = x * 0.9                                                            # a darker, colder evening
    out = out + (1 - out) * (far * (1 - a))[..., None] * 0.9                 # far flakes behind him
    out = out + (1 - out) * mid[..., None] * 0.9
    out = out + (1 - out) * near[..., None] * 0.75
    save(out, n, "snow")


def light_painting(n, cx, top, bot, rx):
    x, a = load(n)
    H, W = a.shape
    core_f, core_b = Image.new("L", (W, H), 0), Image.new("L", (W, H), 0)
    df, db = ImageDraw.Draw(core_f), ImageDraw.Draw(core_b)
    t = np.linspace(0, 2.6 * 2 * np.pi, 1400)
    xs = cx * W + rx * W * np.cos(t) + W * 0.006 * np.sin(t * 7.3)          # a hand-held torch wobbles
    ys = top * H + (bot - top) * H * t / t.max() + H * 0.075 * np.sin(t)    # the ellipse of a ring seen from front
    front = np.sin(t) > 0
    for i in range(len(t) - 1):
        (df if front[i] else db).line([(xs[i], ys[i]), (xs[i + 1], ys[i + 1])], fill=255, width=max(4, W // 380))
    cf, cb = [np.asarray(c, np.float32) / 255 for c in (core_f, core_b)]
    cb = cb * (1 - a)                                                        # the back of the loop goes behind him
    colour = np.array([1.0, 0.42, 0.22], np.float32)
    out = x * 0.82
    for c in (cb, cf):
        glow = cv2.GaussianBlur(c, (0, 0), W / 160)[..., None] * colour * 1.6 + cv2.GaussianBlur(c, (0, 0), W / 600)[..., None] * colour
        out = 1 - (1 - out) * (1 - np.clip(glow, 0, 1))
        out = np.maximum(out, cv2.GaussianBlur(c, (0, 0), 1.2)[..., None] * np.array([1.0, 0.92, 0.85]))
    save(out, n, "light-painting")


def fog(n, vx, vy):
    x, a = load(n)
    H, W = a.shape
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    dist = np.hypot((xx - vx * W) / W, (yy - vy * H) / H * 1.2)
    f = np.clip(0.18 + 0.75 * np.exp(-dist / 0.33), 0, 0.88) * (1 - a)   # thick far away, thin up close
    sky = np.array([0.80, 0.82, 0.85], np.float32)
    out = x * (1 - f[..., None]) + sky * f[..., None]
    hot = np.clip((lum(x) - 0.78) / 0.22, 0, 1) * (1 - a)                    # lamps and windows bloom in the fog
    out = 1 - (1 - out) * (1 - cv2.GaussianBlur(hot, (0, 0), W / 90)[..., None] * np.array([1, 0.85, 0.6]) * 0.7)
    save(out, n, "fog")


def rainy_window(n):
    x, a = load(n)
    H, W = a.shape
    soft = cv2.GaussianBlur(x, (0, 0), 1.6)                                  # focus is on him, past the glass
    out = soft * 0.9
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    small = cv2.GaussianBlur(x, (0, 0), 4)
    for _ in range(330):
        r = rng.choice([rng.uniform(4, 10), rng.uniform(10, 26)], p=[0.75, 0.25]) * W / 2576
        cx, cy = rng.uniform(0, W), rng.uniform(0, H)
        if abs(cx - W * 0.5) < W * 0.13 and H * 0.25 < cy < H * 0.75 and rng.random() < 0.7:
            continue                                                         # keep most of the face clear
        x0, x1, y0, y1 = int(max(0, cx - r - 2)), int(min(W, cx + r + 3)), int(max(0, cy - r * 1.3 - 2)), int(min(H, cy + r * 1.3 + 3))
        px, py = xx[y0:y1, x0:x1], yy[y0:y1, x0:x1]
        d = np.hypot((px - cx) / r, (py - cy) / (r * 1.25))
        m = np.clip((1 - d) * r, 0, 1)
        if m.max() == 0:
            continue
        sx = np.clip(cx - (px - cx) * 6, 0, W - 1).astype(np.float32)        # a drop is a tiny lens: the world upside down
        sy = np.clip(cy - (py - cy) * 6, 0, H - 1).astype(np.float32)
        lens = cv2.remap(small, sx, sy, cv2.INTER_LINEAR) * 1.08
        rim = np.clip(1 - np.abs(d - 0.85) * 6, 0, 1) * (py > cy)
        lens = lens * (1 - rim[..., None] * 0.45)
        hl = np.clip(1 - np.hypot((px - cx + r * 0.35) / (r * 0.22), (py - cy + r * 0.45) / (r * 0.16)), 0, 1)
        lens = lens + hl[..., None] * 0.7
        out[y0:y1, x0:x1] = out[y0:y1, x0:x1] * (1 - m[..., None]) + lens * m[..., None]
    save(out, n, "rainy-window")


def frost(n):
    x, a = load(n)
    H, W = a.shape
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.hypot((xx - W * 0.5) / W, (yy - H * 0.55) / H * 0.55)
    noise = sum(cv2.resize(rng.random((H // s + 1, W // s + 1)).astype(np.float32), (W, H)) / k
                for s, k in ((160, 1), (60, 2), (20, 4), (6, 8)))
    noise /= 1 + 1 / 2 + 1 / 4 + 1 / 8
    f = np.clip((r - 0.24 + (noise - 0.5) * 0.22) / 0.12, 0, 1)             # frost from the edges, clear in the middle
    crystals = cv2.resize(rng.random((H // 2, W // 2)).astype(np.float32), (W, H))
    crystals = np.clip((crystals - 0.5) * 3, 0, 1) * f
    frosted = cv2.GaussianBlur(x, (0, 0), 14) * 0.7 + 0.32 + crystals[..., None] * 0.12
    out = x * (1 - f[..., None]) + frosted * f[..., None]
    save(out, n, "frost")


def blinds(n):
    x, a = load(n)
    H, W = a.shape
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    ang = np.radians(-28)
    u = xx * np.sin(ang) + yy * np.cos(ang)
    u = u + a * H * 0.035                                                    # he is nearer the window: the stripes shift on him
    stripe = 0.5 + 0.5 * np.sin(u / (H * 0.055) * 2 * np.pi)
    stripe = cv2.GaussianBlur(np.clip((stripe - 0.42) * 6, 0, 1), (0, 0), 2.5)
    light = 0.38 + 0.82 * stripe
    out = x * light[..., None] * np.array([1.04, 1.0, 0.94], np.float32)[None, None, :] ** stripe[..., None]
    save(out, n, "blinds")


def rose_shadow(n, sil_path):
    x, a = load(n)
    H, W = a.shape
    sil = (cv2.imread(sil_path, 0) > 127).astype(np.float32)               # the brooch's outline (assets/)
    h = int(H * 1.05)
    w = int(sil.shape[1] * h / sil.shape[0])
    sil = cv2.resize(sil, (w, h))
    sh = np.zeros((H, W), np.float32)
    x0, y0 = int(W * 0.6), int(-H * 0.06)
    sh[max(0, y0):min(H, y0 + h), x0:min(W, x0 + w)] = sil[:min(H, y0 + h) - max(0, y0), :min(W, x0 + w) - x0]
    M = np.float32([[1, -0.12, H * 0.06], [0, 1, 0]])                       # the light comes from a little to the left
    sh = cv2.GaussianBlur(cv2.warpAffine(sh, M, (W, H)), (0, 0), W / 260) * (1 - a)
    save(x * (1 - 0.62 * sh[..., None]), n, "rose-shadow")


def three_shadows(n):
    x, a = load(n)
    H, W = a.shape
    sh = np.zeros_like(a)
    for dx, shear, o in ((-0.17, 0.22, 0.45), (0.15, -0.2, 0.4), (0.0, 0.0, 0.3)):
        M = np.float32([[1.05, shear, W * dx - shear * H], [0, 1.02, H * 0.01]])   # sheared from the bottom of the frame
        s = cv2.GaussianBlur(cv2.warpAffine(a, M, (W, H)), (0, 0), W / 300)
        sh = 1 - (1 - sh) * (1 - s * o)
    sh = sh * (1 - a)
    save(x * (1 - sh[..., None]), n, "three-shadows")


def light_shaft(n):
    x, a = load(n)
    H, W = a.shape
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    ang = np.radians(35)
    v = (xx - W * 0.62) * np.cos(ang) - (yy - H * 0.35) * np.sin(ang)       # distance across the beam
    beam = np.clip(1 - np.abs(v) / (W * 0.13), 0, 1) ** 1.5
    beam = cv2.GaussianBlur(beam, (0, 0), W / 120)
    out = x * (0.38 + 0.85 * beam[..., None])
    out = 1 - (1 - out) * (1 - beam[..., None] * np.array([0.28, 0.25, 0.2], np.float32))
    dust = dots(H, W, 900, 1.0, 3.2, 0.7, 1.0) + dots(H, W, 60, 5, 12, 4, 0.8)
    out = out + (dust * beam)[..., None] * np.array([1.0, 0.95, 0.85], np.float32) * 0.8
    save(out, n, "light-shaft")


snow("APC_0699")
light_painting("APC_0715", 0.505, 0.33, 0.8, 0.17)
fog("APC_0723", 0.62, 0.3)
rainy_window("APC_0738")
frost("APC_0741")
blinds("APC_0775")
rose_shadow("APC_0780", os.path.join(os.path.dirname(__file__), "..", "assets", "rose_silhouette.png"))
three_shadows("APC_0788")
light_shaft("APC_0795")
