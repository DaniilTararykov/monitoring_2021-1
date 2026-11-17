"""Viral, in-camera looking takes: one per photo, original colours, original size, no cut-outs.

0699 shutter drag (flash + slow shutter ghost)   0715 fisheye lens           0723 2000s digicam + date stamp
0738 prism filter in front of the lens           0741 double exposure (two close-ups)
0775 film light leak                             0780 red gel light          0788 zoom-during-exposure
0795 star filter on the silver

usage: python beanie_viral.py <src_dir> <out_dir>
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SRC, OUT = sys.argv[1:3]
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(17)


def load(n):
    return np.asarray(Image.open(os.path.join(SRC, n + ".jpg")).convert("RGB")).astype(np.float32) / 255


def save(x, n, tag):
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, f"{n}-{tag}.jpg"),
                                                                    quality=96, subsampling=0)
    print(n, tag, x.shape[1], "x", x.shape[0], flush=True)


def grain(x, s):
    return x + rng.normal(0, s, x.shape[:2] + (1,)).astype(np.float32)


def warp(x, M):
    H, W = x.shape[:2]
    return cv2.warpAffine(x, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)


def shutter_drag(n):
    x = load(n)
    H, W = x.shape[:2]
    acc = np.zeros_like(x)
    k = 14
    for i in range(k):                                    # the camera keeps moving after the flash fired
        t = (i + 1) / k
        M = cv2.getRotationMatrix2D((W / 2, H), -2.2 * t, 1.0)
        M[0, 2] += W * 0.09 * t
        M[1, 2] -= H * 0.01 * t
        acc += warp(x, M)
    ghost = acc / k
    out = np.maximum(x * 0.55 + ghost * 0.55, x * 0.8) * 1.05
    save(grain(out, 0.012), n, "shutter-drag")


def fisheye(n):
    x = load(n)
    H, W = x.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    nx, ny = (xx - W / 2) / (W / 2), (yy - H / 2) / (W / 2)
    r2 = nx * nx + ny * ny
    f = 0.82 * (1 + 0.32 * r2)                            # barrel, scaled so no empty corners
    mx, my = W / 2 + nx * f * W / 2, H / 2 + ny * f * W / 2
    out = cv2.remap(x, mx, my, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    v = 1 - 0.35 * np.clip(r2 / 1.3, 0, 1) ** 1.5
    save(grain(out * v[..., None], 0.01), n, "fisheye")


def digicam(n, stamp="11 17 '26"):
    x = load(n)
    H, W = x.shape[:2]
    y = np.clip(x * 1.12 + 0.02, 0, 1)                    # little sensor, hot flash, crisp
    y = np.clip((y - 0.5) * 1.1 + 0.5, 0, 1)
    y = y + (y - cv2.GaussianBlur(y, (0, 0), 1.5)) * 0.6
    sh = np.clip(1 - y.mean(2, keepdims=True) / 0.4, 0, 1)
    y = y + sh * np.array([-0.01, 0.01, 0.03], np.float32)
    im = Image.fromarray((np.clip(y, 0, 1) * 255).astype(np.uint8)).convert("RGBA")
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf", int(H * 0.05))
    lay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    tw = d.textlength(stamp, font=font)
    pos = (W - tw - W * 0.045, H - H * 0.1)
    d.text(pos, stamp, font=font, fill=(255, 140, 40, 235))
    glow = lay.filter(ImageFilter.GaussianBlur(H / 250))
    im.alpha_composite(glow)
    im.alpha_composite(lay)
    save(grain(np.asarray(im.convert("RGB")).astype(np.float32) / 255, 0.016), n, "digicam")


def prism(n):
    x = load(n)
    H, W = x.shape[:2]
    out = x.copy()
    for side in (0, 1):                                   # a refracted, mirrored copy along both edges
        w = int(W * 0.36)
        src = x[:, :w] if side == 0 else x[:, W - w:]
        ref = cv2.GaussianBlur(np.ascontiguousarray(src[:, ::-1]), (0, 0), 1.2)
        ref = np.roll(ref, int(H * 0.04) * (1 if side else -1), 0)
        a = np.linspace(0.85, 0, w)[None, :, None] if side == 0 else np.linspace(0, 0.85, w)[None, :, None]
        region = out[:, :w] if side == 0 else out[:, W - w:]
        region[:] = region * (1 - a) + ref * a
    tint = np.zeros_like(x)                               # faint rainbow fringe of the glass
    tint[..., 0] = np.roll(x[..., 0], int(W * 0.004), 1)
    tint[..., 1] = x[..., 1]
    tint[..., 2] = np.roll(x[..., 2], -int(W * 0.004), 1)
    edge = np.clip(np.abs(np.linspace(-1, 1, W)) * 1.6 - 0.6, 0, 1)[None, :, None]
    out = out * (1 - edge) + tint * edge * 0.5 + out * edge * 0.5
    save(grain(out, 0.01), n, "prism")


def double_exposure(n, other, shift):
    """two close-ups on one frame: the second face drifts in from the side, like an in-camera double exposure"""
    x, o = load(n), load(other)
    H, W = x.shape[:2]
    o = cv2.resize(o, (W, H), interpolation=cv2.INTER_AREA)
    o = cv2.warpAffine(o, np.float32([[1, 0, shift * W], [0, 1, 0]]), (W, H), borderMode=cv2.BORDER_REFLECT)
    out = np.maximum(x, o) * 0.5 + (x + o) * 0.25
    save(grain(out, 0.014), n, "double-exposure")


def light_leak(n):
    x = load(n)
    H, W = x.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32) / W
    leak = np.zeros_like(x)
    for cx, cy, r, col in ((1.05, 0.1, 0.35, (1.0, 0.35, 0.1)), (1.0, 0.45, 0.22, (1.0, 0.12, 0.08)),
                           (-0.05, 0.55, 0.18, (1.0, 0.55, 0.2))):
        g = np.exp(-((xx - cx) ** 2 + (yy - cy * H / W) ** 2) / (2 * r * r))
        leak += g[..., None] * np.array(col, np.float32)
    out = 1 - (1 - x) * (1 - np.clip(leak, 0, 1) * 0.85)
    save(grain(out, 0.018), n, "light-leak")


def red_gel(n):
    x = load(n)
    H, W = x.shape[:2]
    g = np.clip(np.linspace(-0.2, 1.0, W), 0, 1)[None, :, None] ** 1.3   # a red lamp from the right
    red = np.array([1.0, 0.12, 0.15], np.float32)
    lit = x * (1 - g * 0.55) + (x * red * 1.6) * g * 0.55
    out = 1 - (1 - lit) * (1 - red * g * 0.18)
    save(grain(out, 0.012), n, "red-gel")


def zoom_exposure(n, cx, cy):
    x = load(n)
    H, W = x.shape[:2]
    acc = np.zeros_like(x)
    k = 16
    for i in range(k):
        s = 1 + 0.09 * i / (k - 1)
        acc += warp(x, np.float32([[s, 0, cx * W * (1 - s)], [0, s, cy * H * (1 - s)]]))
    out = x * 0.5 + (acc / k) * 0.55
    save(grain(out, 0.012), n, "zoom-exposure")


def star_filter(n):
    x = load(n)
    H, W = x.shape[:2]
    L = x.mean(2)
    hot = np.clip((L - 0.82) / 0.18, 0, 1) * (cv2.blur(L, (51, 51)) < 0.6)
    hot = cv2.resize(hot.astype(np.float32), (W // 2, H // 2), interpolation=cv2.INTER_AREA)
    ln = int(W * 0.05)
    star = np.zeros_like(hot)
    for ang in (30, 120, 75, 165):                       # a 4-point cross screen, slightly rotated
        k = np.zeros((2 * ln + 1, 2 * ln + 1), np.float32)
        cv2.line(k, (ln, ln), (int(ln + ln * np.cos(np.radians(ang))), int(ln + ln * np.sin(np.radians(ang)))), 1, 1)
        cv2.line(k, (ln, ln), (int(ln - ln * np.cos(np.radians(ang))), int(ln - ln * np.sin(np.radians(ang)))), 1, 1)
        k *= np.exp(-np.hypot(*np.mgrid[-ln:ln + 1, -ln:ln + 1]) / (ln * 0.35))
        star += cv2.filter2D(hot, -1, k)
    star = cv2.resize(star / max(star.max(), 1e-6), (W, H), interpolation=cv2.INTER_CUBIC)
    out = x + np.clip(star * 2.0, 0, 1)[..., None] * np.array([1.0, 0.98, 0.95], np.float32)
    save(grain(out, 0.01), n, "star-filter")


shutter_drag("APC_0699")
fisheye("APC_0715")
digicam("APC_0723")
prism("APC_0738")
double_exposure("APC_0741", "APC_0738", 0.3)
light_leak("APC_0775")
red_gel("APC_0780")
zoom_exposure("APC_0788", 0.49, 0.2)
star_filter("APC_0795")
