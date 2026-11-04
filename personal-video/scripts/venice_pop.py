"""Venice, no text: "out of frame" slides and a seamless swipe panorama.

Each photo sits in a white-bordered frame on a flat Venetian colour, and its
subject (dome, head, face, gondolier, trunk, plate & glass) breaks out of the
frame. The same cards are then laid across one long canvas cut into 5 slides.

usage: python venice_pop.py <venice_dir> <masks_dir> <out_dir>
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image

SRC, MASKS, OUT = sys.argv[1:4]
W, H = 1080, 1350
rng = np.random.default_rng(11)


def hexc(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255


def load(n):
    return np.asarray(Image.open(os.path.join(SRC, n + ".jpg")).convert("RGB")).astype(np.float32) / 255


def mask_file(name, shape):
    m = cv2.imread(os.path.join(MASKS, name), 0).astype(np.float32) / 255
    return cv2.resize(m, (shape[1], shape[0]))


def component(m, pick="largest"):
    b = (m > 0.5).astype(np.uint8)
    n, lab, st, cen = cv2.connectedComponentsWithStats(b)
    if n <= 1:
        return m
    idx = np.arange(1, n)
    if pick == "largest":
        k = idx[np.argmax(st[1:, cv2.CC_STAT_AREA])]
        keep = lab == k
    elif pick == "rightmost":
        big = idx[st[1:, cv2.CC_STAT_AREA] > st[1:, cv2.CC_STAT_AREA].max() * 0.2]
        k = big[np.argmax(cen[big, 0])]
        keep = lab == k
    else:  # all large
        keep = np.isin(lab, idx[st[1:, cv2.CC_STAT_AREA] > 2000])
    keep = cv2.dilate(keep.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0
    return m * keep


def land_mask(img):
    """Everything below the skyline: per column, the first sustained non-sky run."""
    hsv = cv2.cvtColor((img * 255).astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32) / 255
    solid = ((hsv[..., 2] < 0.66) | (hsv[..., 1] > 0.22)).astype(np.float32)
    run = cv2.blur(solid, (1, 25), anchor=(0, 0))  # fraction solid in the next 25 rows
    h, w = solid.shape
    first = np.argmax(run > 0.9, axis=0).astype(np.float32)
    first[(run > 0.9).sum(0) == 0] = h
    first = cv2.medianBlur(first.reshape(1, -1).astype(np.float32), 5).ravel()
    land = (np.arange(h)[:, None] >= first[None, :]).astype(np.float32)
    return cv2.GaussianBlur(land, (0, 0), 1.0)


def grade(img):
    img = 0.03 + img * 0.94
    g = img.mean(axis=2, keepdims=True)
    img = g + (img - g) * 0.92
    return np.clip(img * np.array([1.02, 1.0, 0.96]), 0, 1)


def grain(img, amt=0.02):
    n = cv2.GaussianBlur(rng.standard_normal(img.shape[:2]).astype(np.float32), (0, 0), 0.6)
    return np.clip(img + n[..., None] * amt, 0, 1)


def card(img, m, scale, ox, oy, rect, size, border=14, rot=0.0, above=None):
    """Render a framed photo whose masked subject pops out of the frame.

    The photo, scaled by `scale`, has its top-left at (ox, oy) on a canvas of
    `size`; `rect` (x0, y0, x1, y1) is the frame window in canvas pixels.
    Returns (rgb, alpha, shadow_alpha) on that canvas.
    """
    cw, ch = size
    im = cv2.resize(grade(img), None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    mm = cv2.resize(m, (im.shape[1], im.shape[0]), interpolation=cv2.INTER_AREA)
    P = np.zeros((ch, cw, 3), np.float32)
    M = np.zeros((ch, cw), np.float32)
    has = np.zeros((ch, cw), np.float32)
    x0, y0 = max(0, ox), max(0, oy)
    x1, y1 = min(cw, ox + im.shape[1]), min(ch, oy + im.shape[0])
    P[y0:y1, x0:x1] = im[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    M[y0:y1, x0:x1] = mm[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    has[y0:y1, x0:x1] = 1
    rx0, ry0, rx1, ry1 = rect
    if above is not None:  # extra subject that may only rise above the frame
        ab = cv2.resize(above, (im.shape[1], im.shape[0]), interpolation=cv2.INTER_AREA)
        A = np.zeros((ch, cw), np.float32)
        A[y0:y1, x0:x1] = ab[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
        A[ry0:] = 0
        A[:, :rx0] = 0
        A[:, rx1:] = 0
        M = np.clip(M + A, 0, 1)
    R = np.zeros((ch, cw), np.float32)
    R[ry0:ry1, rx0:rx1] = 1
    Bd = np.zeros((ch, cw), np.float32)
    Bd[ry0 - border:ry1 + border, rx0 - border:rx1 + border] = 1
    pa = np.clip(R + M * (1 - R), 0, 1) * has
    a = np.maximum(Bd, pa)
    rgb = np.ones((ch, cw, 3), np.float32) * 0.975
    rgb = rgb * (1 - pa[..., None]) + P * pa[..., None]
    if rot:
        Mx = cv2.getRotationMatrix2D(((rx0 + rx1) / 2, (ry0 + ry1) / 2), rot, 1)
        rgb = cv2.warpAffine(rgb, Mx, (cw, ch), flags=cv2.INTER_LINEAR)
        a = cv2.warpAffine(a, Mx, (cw, ch), flags=cv2.INTER_LINEAR)
    sh = cv2.GaussianBlur(a, (0, 0), 16)
    sh = np.roll(np.roll(sh, 14, 0), 8, 1) * 0.42
    return rgb, a, sh


def compose(bg, layers):
    out = bg.copy()
    for rgb, a, sh in layers:
        out = out * (1 - sh[..., None])
        out = out * (1 - a[..., None]) + rgb * a[..., None]
    return out


def flat(color, size=(W, H)):
    c = hexc(color)
    n = cv2.resize(rng.standard_normal((size[1] // 80, size[0] // 80)).astype(np.float32), size, interpolation=cv2.INTER_CUBIC)
    return np.ones((size[1], size[0], 3), np.float32) * c * (1 + 0.015 * n[..., None])


def save(name, img):
    Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, name), quality=94)
    print("saved", name, flush=True)


# ------------------------------------------------------------------ subjects
v1 = load("v1"); v1m = land_mask(v1)
# only the skyline above the frame, plus the two boats below it
boats = component(mask_file("v1_general.png", v1.shape), "all")
v3 = load("v3"); v3m = component(mask_file("v3_birefnet-portrait.png", v3.shape), "rightmost")
v4 = load("v4"); v4m = component(mask_file("v4_general.png", v4.shape), "largest")
v5 = load("v5")
v6 = load("v6"); v6m = component(mask_file("v6_general.png", v6.shape), "all")
v7 = load("v7"); v7m = component(mask_file("v7_birefnet-portrait.png", v7.shape), "largest")


# ------------------------------------------------------------------ cards
# (image, pop mask, scale, ox, oy, frame rect, above-mask) for a 1080x1350 slide
SPEC = {
    "dome": (v1, boats, 1600 / v1.shape[1], -260, 0, (60, 520, 1020, 1020), v1m, "#8FB3B0"),
    "head": (v7, v7m, 1250 / v7.shape[1], -95, 330, (110, 640, 970, 1240), None, "#D9A441"),
    "face": (v3, v3m, 1500 / v3.shape[1], -560, 160, (90, 300, 760, 1150), None, "#E7A69A"),
    "gondolier": (v4, v4m, 1.16, -1058, -800, (140, 560, 940, 1240), None, "#1F6B5C"),
    "plate": (v6, v6m, 1350 / v6.shape[1], -80, 270, (150, 330, 930, 900), None, "#4F7F9E"),
}
TRUNK = (1300 / v5.shape[1], -110, 250, (90, 300, 990, 1180), "#C4553A")


def place(spec, size, X, Y, k=1.0, rot=0.0):
    img, m, s, ox, oy, (rx0, ry0, rx1, ry1), above = spec[:7]
    rect = (int(X), int(Y), int(X + (rx1 - rx0) * k), int(Y + (ry1 - ry0) * k))
    return card(img, m, s * k, int(X + (ox - rx0) * k), int(Y + (oy - ry0) * k), rect, size, rot=rot, above=above)


def trunk_card(size, X, Y, k=1.0):
    s, ox, oy, (rx0, ry0, rx1, ry1), _ = TRUNK
    scale = s * k
    ox, oy = int(X + (ox - rx0) * k), int(Y + (oy - ry0) * k)
    rect = (int(X), int(Y), int(X + (rx1 - rx0) * k), int(Y + (ry1 - ry0) * k))
    h, w = v5.shape[:2]
    q = w / 2000
    tx0, ty0, tx1, ty1 = [int(v * q) for v in (1098, 952, 1668, 1242)]
    base = card(v5, np.zeros(v5.shape[:2], np.float32), scale, ox, oy, rect, size)
    t = cv2.resize(grade(v5[ty0:ty1, tx0:tx1]), None, fx=scale * 1.4, fy=scale * 1.4, interpolation=cv2.INTER_AREA)
    th, tw = t.shape[:2]
    cx = ox + (tx0 + tx1) / 2 * scale + 90 * k
    cy = oy + (ty0 + ty1) / 2 * scale + 150 * k
    px, py = int(cx - tw / 2), int(cy - th / 2)
    rgb = np.zeros((size[1], size[0], 3), np.float32)
    a = np.zeros((size[1], size[0]), np.float32)
    x1, y1 = min(size[0], px + tw), min(size[1], py + th)
    rgb[py:y1, px:x1] = t[:y1 - py, :x1 - px]
    a[py:y1, px:x1] = 1
    sh = np.roll(np.roll(cv2.GaussianBlur(a, (0, 0), 26), 34, 0), 20, 1) * 0.65
    return [base, (rgb, a, sh)]


# ------------------------------------------------------------------ direction 1: out of frame
os.makedirs(os.path.join(OUT, "out-of-frame"), exist_ok=True)
order = ["dome", "head", "face", "gondolier", "trunk", "plate"]
for i, name in enumerate(order):
    if name == "trunk":
        img = compose(flat(TRUNK[4]), trunk_card((W, H), TRUNK[3][0], TRUNK[3][1]))
    else:
        sp = SPEC[name]
        img = compose(flat(sp[7]), [place(sp, (W, H), sp[5][0], sp[5][1])])
    save(os.path.join("out-of-frame", f"{i + 1:02d}-{name}.jpg"), grain(img))


# ------------------------------------------------------------------ direction 2: seamless swipe
PW = W * 5
L = [
    place(SPEC["dome"], (PW, H), 170, 560, k=1.12, rot=-1.5),        # across seam 1
    place(SPEC["head"], (PW, H), 1700, 720, k=0.78, rot=2),          # across seam 2
    place(SPEC["face"], (PW, H), 2420, 150, k=0.62, rot=-2),
    place(SPEC["plate"], (PW, H), 2560, 840, k=0.7, rot=2.5),
    place(SPEC["gondolier"], (PW, H), 3420, 640, k=0.72, rot=-1.5),  # slide 4
]
L += trunk_card((PW, H), 4120, 420, k=0.9)                           # across seam 4
pano = grain(compose(flat("#EDE6DA", (PW, H)), L))
os.makedirs(os.path.join(OUT, "seamless"), exist_ok=True)
save(os.path.join("seamless", "00-full-panorama.jpg"), pano)
for i in range(5):
    save(os.path.join("seamless", f"{i + 1:02d}.jpg"), pano[:, i * W:(i + 1) * W])
