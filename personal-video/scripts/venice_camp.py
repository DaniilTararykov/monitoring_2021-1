"""Camp / minimal / grunge edits of the Venice portrait and the suitcase wall. No text.

usage: python venice_camp.py <venice_dir> <masks_dir> <out_dir>
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

SRC, MASKS, OUT = sys.argv[1:4]
W, H = 1080, 1350
rng = np.random.default_rng(8)
os.makedirs(OUT, exist_ok=True)
PINK = np.array([255, 46, 147], np.float32) / 255


def hexc(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255


def load(n):
    return np.asarray(Image.open(os.path.join(SRC, n + ".jpg")).convert("RGB")).astype(np.float32) / 255


def lum(x):
    return x @ np.array([0.3, 0.55, 0.15], np.float32)


def xerox(x, k=6.0, mid=0.45):
    g = 1 / (1 + np.exp(-(lum(x) - mid) * k))
    return np.interp(g, [0, 1], [0.06, 0.96])


def crop45(img, cx, cw):
    h, w = img.shape[:2]
    ch = int(cw * 5 / 4)
    if ch > h:
        ch = h
        cw = int(ch * 4 / 5)
    x0 = int(np.clip(cx - cw / 2, 0, w - cw))
    y0 = (h - ch) // 2
    return x0, y0, cw, ch


def cut(arr, box, size=(W, H)):
    x0, y0, cw, ch = box
    return cv2.resize(arr[y0:y0 + ch, x0:x0 + cw], size, interpolation=cv2.INTER_AREA)


def grain(x, amt=0.045):
    h, w = x.shape[:2]
    n = cv2.resize(rng.standard_normal((int(h / 1.4), int(w / 1.4))).astype(np.float32), (w, h))
    return np.clip(x + n[..., None] * amt, 0, 1)


def speckle(x, n=600):
    h, w = x.shape[:2]
    layer = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(layer)
    for _ in range(n):
        cx, cy, r = rng.uniform(0, w), rng.uniform(0, h), rng.uniform(0.4, 1.8)
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=int(rng.uniform(90, 255)))
    for _ in range(5):
        cx = rng.uniform(0, w)
        d.line([(cx, 0), (cx + rng.uniform(-8, 8), h)], fill=int(rng.uniform(25, 60)), width=1)
    s = np.asarray(layer, np.float32)[..., None] / 255
    return x * (1 - s * 0.7)


def paper_tone(g, paper="#EEE9DF"):
    return np.dstack([g] * 3) * hexc(paper)


def pinkify(x):
    shade = np.clip(0.5 + lum(x) * 1.6, 0, 1.25)[..., None]
    return np.clip(PINK * shade, 0, 1)


def save(name, x):
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, name), quality=95)
    print("saved", name, flush=True)


# ---------------------------------------------------------------- inputs
por = load("v7")
pm = cv2.resize(cv2.imread(os.path.join(MASKS, "v7_birefnet-portrait.png"), 0), (por.shape[1], por.shape[0])).astype(np.float32) / 255
lug = load("v5")
k5 = lug.shape[1] / 2000  # display px -> image px for the suitcase photo


# ---------------------------------------------------------------- 1 pink city
def pink_city():
    """Photocopied him; every red Venetian wall turns hot pink."""
    box = crop45(por, por.shape[1] * 0.52, por.shape[1])
    img, m = cut(por, box), cut(pm, box)
    hsv = cv2.cvtColor((img * 255).astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
    hue, s, v = hsv[..., 0], hsv[..., 1] / 255, hsv[..., 2] / 255
    red = (((hue < 14) | (hue > 168)) & (s > 0.28) & (v > 0.22)).astype(np.float32)
    red = cv2.morphologyEx(red, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    red = cv2.GaussianBlur(red, (0, 0), 2.0) * (1 - m)
    out = paper_tone(xerox(img, 5.5, 0.47))
    out = out * (1 - red[..., None]) + pinkify(img) * red[..., None]
    save("01-pink-city.jpg", speckle(grain(out), 700))


# ---------------------------------------------------------------- 2 three of me
def three_of_me():
    """Three tilted copies of the same face, a chorus line on flat Venetian red."""
    ys, xs = np.where(pm > 0.5)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    face, fm = por[y0:y1, x0:x1], pm[y0:y1, x0:x1]
    bg = np.ones((H, W, 3), np.float32) * hexc("#B8392B")
    n = cv2.resize(rng.standard_normal((H // 60, W // 60)).astype(np.float32), (W, H), interpolation=cv2.INTER_CUBIC)
    out = bg * (1 + 0.04 * n[..., None])
    for cx, by, s, rot in [(240, 860, 0.3, 16), (840, 860, 0.3, -16), (540, 1350, 0.6, 0)]:
        f = cv2.resize(face, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        a = cv2.resize(fm, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        h, w = a.shape
        M = cv2.getRotationMatrix2D((w / 2, h), rot, 1)
        M[:, 2] += [cx - w / 2, by - h]
        fw = cv2.warpAffine(f, M, (W, H))
        aw = cv2.warpAffine(a, M, (W, H))
        sh = np.roll(np.roll(cv2.GaussianBlur(aw, (0, 0), 14), 16, 0), 12, 1) * 0.35
        sh[:16] = 0
        out = out * (1 - sh[..., None])
        out = out * (1 - aw[..., None]) + fw * aw[..., None]
    save("02-three-of-me.jpg", speckle(grain(out, 0.035), 400))


# ---------------------------------------------------------------- 3 the pink one
PINK_CASE = (1052, 455, 1402, 548)       # orange case in the middle (display px)
TRUNK = (1098, 952, 1668, 1242)          # light trunk


def rect_mask(shape, r, feather=1.5):
    m = np.zeros(shape[:2], np.float32)
    x0, y0, x1, y1 = [int(v * k5) for v in r]
    m[y0:y1, x0:x1] = 1
    return cv2.GaussianBlur(m, (0, 0), feather)


def lug_box():
    return crop45(lug, lug.shape[1] * 0.6, int(lug.shape[0] * 0.8))


def the_pink_one():
    """All luggage photocopied grey; one case is hot pink."""
    m = rect_mask(lug.shape, PINK_CASE)
    out = paper_tone(xerox(lug, 6.0, 0.4))
    out = out * (1 - m[..., None]) + pinkify(lug) * m[..., None]
    box = lug_box()
    save("03-the-pink-one.jpg", speckle(grain(cut(out, box)), 700))


# ---------------------------------------------------------------- 4 stowaway
def stowaway():
    """He peeks out from behind the pink trunk."""
    m = rect_mask(lug.shape, TRUNK)
    out = paper_tone(xerox(lug, 6.0, 0.4))
    out = out * (1 - m[..., None]) + pinkify(lug) * m[..., None]
    # his head, scaled to the trunk, hidden below the trunk's top edge
    ys, xs = np.where(pm > 0.5)
    y0, x0, x1 = ys.min(), xs.min(), xs.max()
    face, fm = por[y0:, x0:x1], pm[y0:, x0:x1]
    tx0, ty0, tx1, ty1 = [int(v * k5) for v in TRUNK]
    s = (tx1 - tx0) * 0.8 / face.shape[1]
    f = cv2.resize(face, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    a = cv2.resize(fm, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    h, w = a.shape
    px = int((tx0 + tx1) / 2 - w / 2 + (tx1 - tx0) * 0.08)
    py = int(ty0 - h * 0.45)
    layer = np.zeros_like(out)
    al = np.zeros(out.shape[:2], np.float32)
    yb, xb = min(out.shape[0], py + h), min(out.shape[1], px + w)
    layer[py:yb, px:xb] = f[:yb - py, :xb - px]
    al[py:yb, px:xb] = a[:yb - py, :xb - px]
    al[ty0 + 6:] = 0  # behind the trunk lid
    sh = np.roll(cv2.GaussianBlur(al, (0, 0), 10), 10, 1) * 0.4
    out = out * (1 - sh[..., None])
    out = out * (1 - al[..., None]) + layer * al[..., None]
    box = crop45(lug, (tx0 + tx1) / 2, int(lug.shape[0] * 0.8))
    save("04-stowaway.jpg", speckle(grain(cut(out, box)), 700))


for fn in (pink_city, three_of_me, the_pink_one, stowaway):
    fn()
