"""High-fashion campaign for the beanie set. Original size and framing, original colours of the photos.

Concept "NOIR, AW26": the campaign is already on the street. The torn-poster wall gets fly-posted with his own
campaign posters (his face, the silver rose), torn and pasted like real wheat-paste; on the street a giant
Bodoni masthead sits behind him like a magazine cover; the remaining frames carry only the small campaign mark.

usage: python beanie_campaign.py <src_dir> <mask_dir> <font_dir> <out_dir> [BRAND]
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC, MC, FD, OUT = sys.argv[1:5]
BRAND = sys.argv[5] if len(sys.argv) > 5 else "NOIR"
SEASON = "AUTUMN WINTER 2026"
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(26)


def font(size, wght=500, italic=False):
    f = ImageFont.truetype(os.path.join(FD, "BodoniModa-Italic.ttf" if italic else "BodoniModa.ttf"), int(size))
    f.set_variation_by_axes([wght, 96 if size > 120 else 11])
    return f


def load(n):
    x = np.asarray(Image.open(os.path.join(SRC, n + ".jpg")).convert("RGB")).astype(np.float32) / 255
    a = np.asarray(Image.open(os.path.join(MC, n + ".png")).convert("L")).astype(np.float32) / 255
    return x, a


def save(x, n, tag):
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, f"{n}-{tag}.jpg"),
                                                                    quality=96, subsampling=0)
    print(n, tag, x.shape[1], "x", x.shape[0], flush=True)


def split(x, a):
    """his pixels with the old background colour taken out of the soft edge, and the background without him"""
    H, W = a.shape
    s = 4
    band = cv2.dilate((a > 0.02).astype(np.uint8), np.ones((15, 15), np.uint8))
    small = cv2.resize((x * 255).astype(np.uint8), (W // s, H // s), interpolation=cv2.INTER_AREA)
    bg = cv2.inpaint(small, cv2.resize(band, (W // s, H // s), interpolation=cv2.INTER_NEAREST), 3, cv2.INPAINT_NS)
    bg = cv2.resize(bg, (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255
    e = (a > 0.02) & (a < 0.98)
    fg = x.copy()
    fg[e] = np.clip((x[e] - (1 - a[e, None]) * bg[e]) / np.maximum(a[e, None], 0.15), 0, 1)
    return fg, np.where(band[..., None] > 0, bg, x)


def put_back(newbg, fg, a):
    am = cv2.GaussianBlur(a, (0, 0), 0.7)[..., None]
    return newbg * (1 - am) + fg * am


def bw(x):
    g = x @ np.array([0.3, 0.59, 0.11], np.float32)
    g = np.clip((g - 0.04) / 0.9, 0, 1)
    return 0.6 * g * g * (3 - 2 * g) + 0.4 * g


# ---------------------------------------------------------------- the posters
def poster(kind, w, h):
    """a printed campaign poster: black-and-white photo, Bodoni masthead, season line"""
    if kind == "face":
        x, _ = load("APC_0738")
        crop = x[0:1449, 690:690 + 966]
    else:
        x, _ = load("APC_0795")
        crop = x[0:1449, 1180:1180 + 966]
    g = bw(cv2.resize(crop, (w, h), interpolation=cv2.INTER_AREA))
    im = Image.fromarray((g * 255).astype(np.uint8)).convert("RGB")
    d = ImageDraw.Draw(im)
    f = font(w * 0.3, 500)
    tw = d.textlength(BRAND, font=f)
    d.text(((w - tw) / 2, h * 0.035), BRAND, font=f, fill=(250, 248, 244))
    f2 = font(w * 0.032, 400, italic=True)
    tw = d.textlength(SEASON, font=f2)
    d.text(((w - tw) / 2, h * 0.93), SEASON, font=f2, fill=(250, 248, 244))
    return np.asarray(im).astype(np.float32) / 255


def torn_alpha(w, h, tear=0.0):
    """paper edge: slightly ragged all round, and optionally a big tear with a ragged line"""
    a = np.ones((h, w), np.float32)
    n = cv2.resize(rng.random((h // 6 + 1, w // 6 + 1)).astype(np.float32), (w, h))
    edge = int(min(w, h) * 0.012)
    yy, xx = np.mgrid[0:h, 0:w]
    dist = np.minimum.reduce([xx, w - 1 - xx, yy, h - 1 - yy]).astype(np.float32)
    a[dist < edge * (0.4 + n)] = 0
    if tear:
        line = h * (1 - tear) + h * 0.06 * np.cumsum(rng.normal(0, 1, w)) / np.sqrt(w) * 3
        line = cv2.GaussianBlur(line.reshape(1, -1).astype(np.float32), (0, 0), 3).ravel()
        a[yy > line[None, :]] = 0
    return cv2.GaussianBlur(a, (0, 0), 0.8)


def paste_posters(bg, places, scale):
    """wheat-paste: the paper follows the wall (its light and bumps), with soft wrinkles"""
    H, W = bg.shape[:2]
    wall = bg @ np.array([0.3, 0.59, 0.11], np.float32)
    light = cv2.GaussianBlur(wall, (0, 0), W / 25)
    light = light / np.median(light)
    bump = wall - cv2.GaussianBlur(wall, (0, 0), 4)
    out = bg.copy()
    pw, ph = int(560 * scale), int(840 * scale)
    for kind, x0, y0, ang, tear in places:
        p = poster(kind, pw, ph)
        al = torn_alpha(pw, ph, tear)
        wr = cv2.resize(rng.normal(0, 1, (ph // 40 + 2, pw // 40 + 2)).astype(np.float32), (pw, ph))
        p = np.clip(p * (1 + 0.05 * wr[..., None]), 0, 1)
        M = cv2.getRotationMatrix2D((pw / 2, ph / 2), ang, 1.0)
        M[0, 2] += x0 * W
        M[1, 2] += y0 * H
        P = cv2.warpAffine(p, M, (W, H))
        A = cv2.warpAffine(al, M, (W, H))[..., None]
        P = np.clip(P * np.clip(light, 0.6, 1.3)[..., None] + bump[..., None] * 0.8, 0, 1)
        out = out * (1 - A) + P * A
    return out


def posters(n, places, scale):
    x, a = load(n)
    fg, bg = split(x, a)
    out = put_back(paste_posters(bg, places, scale), fg, a)
    save(out + rng.normal(0, 0.008, out.shape[:2] + (1,)).astype(np.float32), n, "campaign-posters")


# ---------------------------------------------------------------- masthead behind him
def masthead(n, size, y, colour, spread=None):
    """spread: letter centres as fractions of the width, so his head falls between letters, not on one"""
    x, a = load(n)
    fg, bg = split(x, a)
    H, W = a.shape
    im = Image.fromarray((bg * 255).astype(np.uint8))
    d = ImageDraw.Draw(im)
    f = font(H * size, 600)
    if spread:
        for ch, cx in zip(BRAND, spread):
            d.text((cx * W - d.textlength(ch, font=f) / 2, H * y), ch, font=f, fill=colour)
    else:
        tw = d.textlength(BRAND, font=f)
        d.text(((W - tw) / 2, H * y), BRAND, font=f, fill=colour)
    f2 = font(H * 0.024, 400, italic=True)
    tw = d.textlength(SEASON, font=f2)
    d.text(((W - tw) / 2, H * 0.93), SEASON, font=f2, fill=(250, 248, 244))
    nb = np.asarray(im).astype(np.float32) / 255
    save(put_back(nb, fg, a), n, "campaign-masthead")


# ---------------------------------------------------------------- the small campaign mark only
def mark(n, colour=(250, 248, 244)):
    x, _ = load(n)
    H, W = x.shape[:2]
    im = Image.fromarray((x * 255).astype(np.uint8))
    d = ImageDraw.Draw(im)
    f = font(H * 0.075, 600)
    tw = d.textlength(BRAND, font=f)
    d.text(((W - tw) / 2, H * 0.83), BRAND, font=f, fill=colour)
    f2 = font(H * 0.022, 400, italic=True)
    tw = d.textlength(SEASON, font=f2)
    d.text(((W - tw) / 2, H * 0.93), SEASON, font=f2, fill=colour)
    save(np.asarray(im).astype(np.float32) / 255, n, "campaign")


posters("APC_0788", [("face", -0.06, 0.02, -1.2, 0), ("rose", 0.165, 0.0, 0.8, 0.35),   # bare wall behind his head
                     ("rose", 0.625, 0.01, 1.1, 0), ("face", 0.845, 0.04, -0.8, 0.5)], 1.0)
posters("APC_0780", [("face", -0.07, -0.05, 0.9, 0), ("rose", 0.64, -0.03, -0.7, 0.3)], 1.45)   # bare wall behind him
posters("APC_0775", [("rose", 0.02, -0.1, -0.6, 0), ("face", 0.68, -0.08, 0.7, 0.25)], 1.75)
masthead("APC_0715", 0.3, -0.03, (12, 12, 14), spread=(0.12, 0.32, 0.69, 0.88))
masthead("APC_0738", 0.42, -0.08, (14, 13, 14))
mark("APC_0699")
mark("APC_0723")
mark("APC_0741")
mark("APC_0795")
