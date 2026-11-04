"""More camp / minimal / grunge concepts for the Venice portrait and suitcases. No text.

usage: python venice_camp2.py <venice_dir> <masks_dir> <out_dir> [W H]
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

SRC, MASKS, OUT = sys.argv[1:4]
W, H = (int(sys.argv[4]), int(sys.argv[5])) if len(sys.argv) > 5 else (1080, 1440)
rng = np.random.default_rng(12)
os.makedirs(OUT, exist_ok=True)


def hexc(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255


PINK, INK = hexc("#FF2E93"), hexc("#1A1817")


def load(n):
    return np.asarray(Image.open(os.path.join(SRC, n + ".jpg")).convert("RGB")).astype(np.float32) / 255


def lum(x):
    return x @ np.array([0.3, 0.55, 0.15], np.float32)


def xerox(x, k=6.0, mid=0.45):
    return np.interp(1 / (1 + np.exp(-(lum(x) - mid) * k)), [0, 1], [0.06, 0.96])


def cover(img, w, h, cx=0.5, cy=0.5, zoom=1.0):
    ih, iw = img.shape[:2]
    s = max(w / iw, h / ih) * zoom
    r = cv2.resize(img, (round(iw * s), round(ih * s)), interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC)
    rh, rw = r.shape[:2]
    x0 = int(np.clip(cx * rw - w / 2, 0, rw - w))
    y0 = int(np.clip(cy * rh - h / 2, 0, rh - h))
    return r[y0:y0 + h, x0:x0 + w]


def paper(color, amt=0.035):
    n = cv2.resize(rng.standard_normal((H // 60, W // 60)).astype(np.float32), (W, H), interpolation=cv2.INTER_CUBIC)
    f = cv2.resize(rng.standard_normal((H // 3, W // 3)).astype(np.float32), (W, H))
    return np.clip(np.ones((H, W, 3), np.float32) * hexc(color) * (1 + amt * n[..., None] + 0.02 * f[..., None]), 0, 1)


def grain(x, amt=0.04):
    n = cv2.resize(rng.standard_normal((int(H / 1.4), int(W / 1.4))).astype(np.float32), (W, H))
    return np.clip(x + n[..., None] * amt, 0, 1)


def speckle(x, n=600):
    layer = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(layer)
    for _ in range(n):
        cx, cy, r = rng.uniform(0, W), rng.uniform(0, H), rng.uniform(0.4, 1.8)
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=int(rng.uniform(90, 255)))
    for _ in range(4):
        cx = rng.uniform(0, W)
        d.line([(cx, 0), (cx + rng.uniform(-8, 8), H)], fill=int(rng.uniform(25, 60)), width=1)
    return x * (1 - np.asarray(layer, np.float32)[..., None] / 255 * 0.7)


def smooth_noise(h, w, scale):
    n = cv2.resize(rng.standard_normal((max(2, h // scale), max(2, w // scale))).astype(np.float32), (w, h), interpolation=cv2.INTER_CUBIC)
    return n / (n.std() + 1e-6)


def over(base, layer, a):
    return base * (1 - a[..., None]) + layer * a[..., None]


def save(name, x):
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, name), quality=95)
    print("saved", name, flush=True)


por = load("v7")
pm = cv2.resize(cv2.imread(os.path.join(MASKS, "v7_birefnet-portrait.png"), 0), (por.shape[1], por.shape[0])).astype(np.float32) / 255
kp = por.shape[1] / 2000            # display px -> image px (portrait)
lug = load("v5")
kl = lug.shape[1] / 2000            # display px -> image px (suitcases)
FACE = (1020 / 2000, 700 / 1494)     # face centre as fractions


# ---------------------------------------------------------------- 1 torn window
def torn_window():
    """Flat pink paper with a hand-torn hole; only the face shows through."""
    photo = cover(por, W, H, *FACE, zoom=1.25)
    yy, xx = np.mgrid[0:H, 0:W]
    cx, cy = W * 0.5, H * 0.47
    ang = np.arctan2(yy - cy, xx - cx)
    rad = np.hypot((xx - cx) / 1.0, (yy - cy) / 1.25)
    wob = 1 + 0.06 * np.sin(ang * 3 + 1) + 0.035 * np.sin(ang * 7 + 2) + 0.012 * smooth_noise(H, W, 6)
    R = W * 0.36
    hole = (rad < R * wob).astype(np.float32)
    rim = (rad < R * wob + 18 + 8 * smooth_noise(H, W, 5)).astype(np.float32)
    out = paper("#FF2E93")
    out = over(out, paper("#F4F0E8", 0.02), rim)
    inner = cv2.GaussianBlur(1 - hole, (0, 0), 14) * hole * 0.6
    out = over(out, photo * (1 - inner[..., None]), cv2.GaussianBlur(hole, (0, 0), 0.8))
    sh = np.clip(cv2.GaussianBlur(rim, (0, 0), 10) - rim, 0, 1)
    out = out * (1 - 0.25 * np.roll(sh, 6, 0)[..., None])
    save("05-torn-window.jpg", speckle(grain(out, 0.035), 500))


# ---------------------------------------------------------------- 2 halftone
def halftone():
    """Big black halftone dots on hot pink."""
    g = lum(cover(por, W, H, *FACE, zoom=1.15))
    g = np.clip((g - 0.08) / 0.75, 0, 1)
    S = 2
    im = Image.new("L", (W * S, H * S), 0)
    d = ImageDraw.Draw(im)
    cell = 15
    a = np.deg2rad(45)
    ca, sa = np.cos(a), np.sin(a)
    rng_ = int(max(W, H) * 1.5 / cell)
    for i in range(-rng_, rng_):
        for j in range(-rng_, rng_):
            x = (i * ca - j * sa) * cell + W / 2
            y = (i * sa + j * ca) * cell + H / 2
            if 0 <= x < W and 0 <= y < H:
                r = (1 - g[int(y), int(x)]) ** 0.9 * cell * 0.72
                if r > 0.6:
                    d.ellipse([(x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S], fill=255)
    dots = np.asarray(im.resize((W, H), Image.LANCZOS), np.float32) / 255
    out = over(paper("#FF2E93", 0.02), INK, dots)
    save("06-halftone.jpg", speckle(grain(out, 0.03), 400))


# ---------------------------------------------------------------- 3 mirror twins
def mirror():
    """Level the tilted head and mirror one half: an uncanny perfect symmetry."""
    ex, ey = 1090 * kp, 720 * kp  # between the eyes
    M = cv2.getRotationMatrix2D((ex, ey), 12, 1)
    rot = cv2.warpAffine(por, M, (por.shape[1], por.shape[0]), borderMode=cv2.BORDER_REFLECT)
    sym = rot.copy()
    x = int(ex)
    w = min(x, rot.shape[1] - x)
    sym[:, x:x + w] = rot[:, x - w:x][:, ::-1]
    out = cover(sym, W, H, x / sym.shape[1], 0.5, zoom=1.12)
    out = np.clip(0.03 + out * 0.95, 0, 1)
    g = lum(out)[..., None]
    out = g + (out - g) * 0.85
    save("07-mirror.jpg", speckle(grain(out, 0.035), 400))


# ---------------------------------------------------------------- 4 sticker
def sticker_layer(img, a, border):
    b = (a > 0.5).astype(np.uint8)
    rim = cv2.dilate(b, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (border * 2 + 1, border * 2 + 1)))
    rim = cv2.GaussianBlur(rim.astype(np.float32), (0, 0), 1.2)
    rgb = over(np.ones_like(img) * hexc("#FBF9F4"), img, a)
    return rgb, rim


def place(out, rgb, a, cx, cy, rot, s):
    h, w = a.shape
    M = cv2.getRotationMatrix2D((w / 2, h / 2), rot, s)
    M[:, 2] += [cx - w / 2, cy - h / 2]
    lay = cv2.warpAffine(rgb, M, (W, H))
    al = cv2.warpAffine(a, M, (W, H))
    sh = np.roll(np.roll(cv2.GaussianBlur(al, (0, 0), 12), 14, 0), 10, 1) * 0.4
    sh[:14] = 0
    sh[:, :10] = 0
    out = out * (1 - sh[..., None])
    return over(out, lay, al)


def sticker():
    """Him as a die-cut sticker, plus a tiny suitcase sticker."""
    ys, xs = np.where(pm > 0.5)
    pad = 80
    y0, x0, x1 = max(0, ys.min() - pad), max(0, xs.min() - pad), min(por.shape[1], xs.max() + pad)
    img = cv2.copyMakeBorder(por[y0:, x0:x1], pad, pad, pad, pad, cv2.BORDER_CONSTANT)
    a = cv2.copyMakeBorder(pm[y0:, x0:x1], pad, pad, pad, pad, cv2.BORDER_CONSTANT)
    rgb, rim = sticker_layer(img, a, 34)
    out = paper("#C4553A")
    s = W * 1.15 / img.shape[1]
    out = place(out, rgb, rim, W * 0.5, H * 0.6, -5, s)
    case = lug[int(455 * kl):int(548 * kl), int(1052 * kl):int(1402 * kl)]
    case = cv2.copyMakeBorder(case, 40, 40, 40, 40, cv2.BORDER_CONSTANT)
    ca = np.zeros(case.shape[:2], np.float32)
    ca[40:-40, 40:-40] = 1
    crgb, crim = sticker_layer(case, ca, 22)
    out = place(out, crgb, crim, W * 0.76, H * 0.16, 14, W * 0.42 / case.shape[1])
    save("08-sticker.jpg", speckle(grain(out, 0.03), 400))


# ---------------------------------------------------------------- 5 suitcase head
def suitcase_head():
    """Camp surreal: his head swapped for an old trunk, on flat pink."""
    yy, xx = np.mgrid[0:por.shape[0], 0:por.shape[1]]
    head = (((xx - 1020 * kp) / (370 * kp)) ** 2 + ((yy - 610 * kp) / (430 * kp)) ** 2) < 1
    body = pm * (1 - head)
    s = W * 1.7 / por.shape[1]
    img = cv2.resize(por, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    a = cv2.resize(body, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    ox, oy = int((W - img.shape[1]) / 2), H - img.shape[0]
    out = paper("#FF2E93", 0.03)
    lay = np.zeros((H, W, 3), np.float32)
    al = np.zeros((H, W), np.float32)
    ys0, xs0 = max(0, oy), max(0, ox)
    lay[ys0:, xs0:xs0 + img.shape[1]] = img[ys0 - oy:, xs0 - ox:xs0 - ox + min(img.shape[1], W - xs0)][:, :W - xs0]
    al[ys0:, xs0:xs0 + a.shape[1]] = a[ys0 - oy:, xs0 - ox:][:, :W - xs0]
    sh = np.roll(np.roll(cv2.GaussianBlur(al, (0, 0), 14), 12, 0), 10, 1) * 0.35
    sh[:12] = 0
    out = over(out * (1 - sh[..., None]), lay, al)
    # trunk as the head, tilted like his
    t = lug[int(645 * kl):int(950 * kl), int(1078 * kl):int(1678 * kl)]
    tw = int(780 * kp * s)
    t = cv2.resize(t, (tw, int(tw * t.shape[0] / t.shape[1])), interpolation=cv2.INTER_AREA)
    th = t.shape[0]
    neck_x, neck_y = ox + 1010 * kp * s, oy + 1020 * kp * s
    M = cv2.getRotationMatrix2D((tw / 2, th), -10, 1)
    M[:, 2] += [neck_x - tw / 2, neck_y - th + 30]
    tl = cv2.warpAffine(t, M, (W, H))
    ta = cv2.warpAffine(np.ones((th, tw), np.float32), M, (W, H))
    sh = np.roll(np.roll(cv2.GaussianBlur(ta, (0, 0), 16), 16, 0), 12, 1) * 0.4
    out = over(out * (1 - sh[..., None]), tl, ta)
    save("09-suitcase-head.jpg", speckle(grain(out, 0.03), 400))


# ---------------------------------------------------------------- 6 printed trunk
def printed_trunk():
    """His face screen-printed in black onto the pink trunk; the rest photocopied."""
    tx0, ty0, tx1, ty1 = [int(v * kl) for v in (1098, 952, 1668, 1242)]
    base = np.dstack([xerox(lug, 6.0, 0.4)] * 3) * hexc("#EEE9DF")
    tr = np.zeros(lug.shape[:2], np.float32)
    tr[ty0:ty1, tx0:tx1] = 1
    tr = cv2.GaussianBlur(tr, (0, 0), 1.5)
    pinkt = np.clip(PINK * np.clip(0.5 + lum(lug) * 1.6, 0, 1.25)[..., None], 0, 1)
    base = over(base, pinkt, tr)
    # face print
    fw, fh = int((tx1 - tx0) * 0.5), int((ty1 - ty0) * 0.92)
    f = cover(por, fw, fh, *FACE, zoom=1.0)
    g = 1 / (1 + np.exp(-(lum(f) - 0.42) * 9))
    ink = (1 - g) * (rng.random(g.shape) > 0.12)
    ink = cv2.GaussianBlur(ink.astype(np.float32), (0, 0), 0.7)
    px, py = int((tx0 + tx1) / 2 - fw / 2), int((ty0 + ty1) / 2 - fh / 2)
    region = base[py:py + fh, px:px + fw]
    base[py:py + fh, px:px + fw] = region * (1 - 0.88 * ink[..., None])
    out = cover(base, W, H, ((tx0 + tx1) / 2) / lug.shape[1], 0.5)
    save("10-printed-trunk.jpg", speckle(grain(out, 0.04), 600))


for fn in (torn_window, halftone, mirror, sticker, suitcase_head, printed_trunk):
    fn()
