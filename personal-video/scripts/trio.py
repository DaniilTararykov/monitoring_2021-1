"""Ten creative takes on the three-friends lift selfie. No text.

usage: python trio.py <photo> <out_dir>
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
FACES = [(837, 412), (1391, 502), (1906, 747)]  # left friend, him, her
PHONE = (927, 940)
rng = np.random.default_rng(9)


def hexc(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255


def crop(cx, cy, w, h, src=img):
    hh, ww = src.shape[:2]
    if w > ww or h > hh:
        s = max(w / ww, h / hh)
        src = cv2.resize(src, (int(ww * s) + 1, int(hh * s) + 1), interpolation=cv2.INTER_CUBIC)
        cx, cy, hh, ww = cx * s, cy * s, src.shape[0], src.shape[1]
    x0 = int(np.clip(cx - w / 2, 0, ww - w))
    y0 = int(np.clip(cy - h / 2, 0, hh - h))
    return src[y0:y0 + h, x0:x0 + w]


def fit(a, w, h):
    return cv2.resize(a, (w, h), interpolation=cv2.INTER_AREA if a.shape[1] > w else cv2.INTER_CUBIC)


def paper(c, w, h):
    n = cv2.resize(rng.standard_normal((h // 60, w // 60)).astype(np.float32), (w, h), interpolation=cv2.INTER_CUBIC)
    return np.clip(np.ones((h, w, 3), np.float32) * hexc(c) * (1 + 0.02 * n[..., None]), 0, 1)


def shadowed(base, layer, a, dx=10, dy=14, blur=16, o=0.35):
    sh = np.roll(np.roll(cv2.GaussianBlur(a, (0, 0), blur), dy, 0), dx, 1) * o
    sh[:dy] = 0
    sh[:, :dx] = 0
    base = base * (1 - sh[..., None])
    return base * (1 - a[..., None]) + layer * a[..., None]


def lum(x):
    return x @ np.array([0.3, 0.55, 0.15], np.float32)


def save(n, x):
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, n), quality=95)
    print("saved", n, flush=True)


W, H = 1080, 1440
WALL = img[300:900, 0:250].reshape(-1, 3).mean(0)


# 1 tight 3:4 crop, the three of them filling the frame
def v01():
    save("01-tight.jpg", fit(crop(1290, 724, 1087, 1449), W, H))


# 2 photobooth strip: three faces stacked on cream
def v02():
    out = paper("#F3EEE6", W, H)
    sw, sh = 460, 400
    x = (W - sw) // 2
    for i, (cx, cy) in enumerate(FACES):
        out[60 + i * (sh + 30):60 + i * (sh + 30) + sh, x:x + sw] = fit(crop(cx, cy + 60, 520, 452), sw, sh)
    strip = np.zeros((H, W), np.float32)
    strip[40:60 + 3 * sh + 2 * 30 + 20, x - 20:x + sw + 20] = 1
    base = paper("#C23A2B", W, H)
    out = shadowed(base, np.where(strip[..., None] > 0, out, base), strip)
    M = cv2.getRotationMatrix2D((W / 2, H / 2), -3, 1)
    save("02-photobooth.jpg", cv2.warpAffine(out, M, (W, H), borderMode=cv2.BORDER_REFLECT))


# 3 polaroid on lift red
def v03():
    out = np.ones((H, W, 3), np.float32) * WALL
    pw, ph = 860, 1040
    pic = fit(crop(1370, 640, 1400, 1300), 780, 724)
    card = np.ones((ph, pw, 3), np.float32) * np.array([0.97, 0.96, 0.94])
    card[40:40 + 724, 40:820] = pic
    pad = 80
    card = cv2.copyMakeBorder(card, pad, pad, pad, pad, cv2.BORDER_CONSTANT)
    a = np.zeros(card.shape[:2], np.float32)
    a[pad:-pad, pad:-pad] = 1
    M = cv2.getRotationMatrix2D((card.shape[1] / 2, card.shape[0] / 2), 4, 1)
    M[:, 2] += [W / 2 - card.shape[1] / 2, H / 2 - card.shape[0] / 2]
    save("03-polaroid.jpg", shadowed(out, cv2.warpAffine(card, M, (W, H)), cv2.warpAffine(a, M, (W, H)), blur=20, o=0.45))


# 4 contact sheet 2x2: the whole moment, then each face
def v04():
    out = np.ones((H, W, 3), np.float32) * 0.07
    g, cw, ch = 16, (W - 48) // 2, (H - 48) // 2
    tiles = [crop(1300, 724, 1288, 1449)] + [crop(cx, cy + 40, 620, 697) for cx, cy in FACES]
    for i, t in enumerate(tiles):
        x, y = g + (i % 2) * (cw + g), g + (i // 2) * (ch + g)
        out[y:y + ch, x:x + cw] = fit(t, cw, ch)
    save("04-contact-sheet.jpg", out)


# 5 red pop: black & white, only the lift's red stays
def v05():
    a = crop(1288, 724, 1932, 1449)
    hsv = cv2.cvtColor((a * 255).astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
    red = (((hsv[..., 0] < 12) | (hsv[..., 0] > 165)) & (hsv[..., 1] > 110) & (hsv[..., 2] > 60)).astype(np.float32)
    red = cv2.GaussianBlur(cv2.morphologyEx(red, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)), (0, 0), 2)
    g = np.dstack([lum(a)] * 3)
    save("05-red-pop-4x3.jpg", fit(g * (1 - red[..., None]) + a * red[..., None], 1440, 1080))


# 6 triptych: three vertical strips, one face each, slightly offset
def v06():
    out = paper("#F3EEE6", W, H)
    m, gap = 50, 22
    sw = (W - 2 * m - 2 * gap) // 3
    for i, (cx, cy) in enumerate(FACES):
        off = [0, -50, 40][i]
        sh = H - 2 * m - 60
        out[m + 30 + off:m + 30 + off + sh, m + i * (sw + gap):m + i * (sw + gap) + sw] = fit(crop(cx, cy + 250, int(sw * 1.7), int(sh * 1.7)), sw, sh)
    save("06-triptych.jpg", out)


# 7 echo: motion ghosts trailing to the left, like the lift is moving
def v07():
    a = fit(crop(1300, 724, 1087, 1449), W, H)
    out = a.copy()
    for k, o in ((60, 0.25), (120, 0.15), (180, 0.08)):
        out = out * (1 - o) + np.roll(a, -k, axis=1) * o
    save("07-echo.jpg", np.clip(out * 0.9 + a * 0.1, 0, 1))


# 8 zoom burst on his face (radial blur), friends sharp at the edges
def v08():
    a = fit(crop(1300, 724, 1087, 1449), W, H)
    s = W / 1087
    cx, cy = (1391 - (1300 - 543)) * s, (502 - 0) * s
    acc = np.zeros_like(a)
    n = 14
    for i in range(n):
        z = 1 + 0.012 * i
        M = cv2.getRotationMatrix2D((cx, cy), 0, z)
        acc += cv2.warpAffine(a, M, (W, H), borderMode=cv2.BORDER_REFLECT)
    acc /= n
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.clip(np.hypot(xx - cx, yy - cy) / 650, 0, 1)[..., None]
    save("08-zoom-burst.jpg", a * (1 - d) + acc * d)


# 9 halftone pink (camp)
def v09():
    g = np.clip((lum(fit(crop(1300, 724, 1087, 1449), W, H)) - 0.08) / 0.8, 0, 1)
    S, cell = 2, 14
    im = Image.new("L", (W * S, H * S), 0)
    d = ImageDraw.Draw(im)
    for y in np.arange(cell / 2, H, cell):
        for x in np.arange(cell / 2 + (cell / 2 if int(y / cell) % 2 else 0), W, cell):
            r = (1 - g[int(y), min(W - 1, int(x))]) * cell * 0.7
            if r > 0.6:
                d.ellipse([(x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S], fill=255)
    dots = np.asarray(im.resize((W, H), Image.LANCZOS), np.float32)[..., None] / 255
    save("09-halftone.jpg", paper("#FF2E93", W, H) * (1 - dots) + hexc("#1A1817") * dots)


# 10 cut-out phone: the phone becomes a window onto the whole photo, the rest goes flat red
def v10():
    a = fit(crop(1300, 724, 1087, 1449), W, H)
    s = W / 1087
    x0, y0 = int((560 - 757) * s + 0), 0
    px0, py0, px1, py1 = [int(v * s) for v in (380 - (1300 - 543), 700, 1440 - (1300 - 543), 1200)]
    px0 = max(0, int((380 - 757) * s))
    px0, px1 = int((400 - 757) * s), int((1460 - 757) * s)
    px0 = max(0, px0)
    m = np.zeros((H, W), np.float32)
    cv2.rectangle(m, (px0, int(700 * s)), (px1, int(1190 * s)), 1, -1)
    m = cv2.GaussianBlur(m, (0, 0), 1)
    g = np.dstack([lum(a)] * 3)
    duo = hexc("#1A1817") * (1 - g) + hexc("#E2342B") * g
    save("10-phone-window.jpg", duo * (1 - m[..., None]) + a * m[..., None])


for f in (v01, v02, v03, v04, v05, v06, v07, v08, v09, v10):
    f()
