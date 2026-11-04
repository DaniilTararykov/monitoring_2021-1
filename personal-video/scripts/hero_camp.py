"""Camp / minimal / grunge concepts for the phone portrait. No text.

usage: python hero_camp.py <photo> <person_mask> <out_dir>
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

SRC, MASK, OUT = sys.argv[1:4]
img = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32) / 255
H, W = img.shape[:2]
m = cv2.resize(cv2.imread(MASK, 0), (W, H)).astype(np.float32) / 255
rng = np.random.default_rng(21)
yy, xx = np.mgrid[0:H, 0:W]
os.makedirs(OUT, exist_ok=True)


def hexc(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255


def lum(x):
    return x @ np.array([0.3, 0.55, 0.15], np.float32)


def curve(x, pts):
    xs, ys = zip(*pts)
    return np.interp(x, xs, ys)


def grain(x, amt=0.04, size=1.4):
    n = cv2.resize(rng.standard_normal((int(H / size), int(W / size))).astype(np.float32), (W, H))
    return np.clip(x + n[..., None] * amt, 0, 1)


def speckle(x, n=500, dark=True):
    """Photocopier dust."""
    layer = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(layer)
    for _ in range(n):
        cx, cy, r = rng.uniform(0, W), rng.uniform(0, H), rng.uniform(0.4, 1.8)
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=int(rng.uniform(90, 255)))
    for _ in range(6):
        cx = rng.uniform(0, W)
        d.line([(cx, 0), (cx + rng.uniform(-8, 8), H)], fill=int(rng.uniform(25, 60)), width=1)
    s = np.asarray(layer, np.float32)[..., None] / 255
    return x * (1 - s * 0.7) if dark else x + (1 - x) * s * 0.7


def paper(color, amt=0.03):
    c = hexc(color)
    n = cv2.resize(rng.standard_normal((H // 60, W // 60)).astype(np.float32), (W, H), interpolation=cv2.INTER_CUBIC)
    f = cv2.resize(rng.standard_normal((H // 3, W // 3)).astype(np.float32), (W, H))
    return np.clip(np.ones((H, W, 3), np.float32) * c * (1 + amt * n[..., None] + 0.02 * f[..., None]), 0, 1)


def xerox(x, contrast=7.0, mid=0.42):
    g = lum(x)
    g = 1 / (1 + np.exp(-(g - mid) * contrast))
    return g


def save(name, x):
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, name), quality=95)
    print("saved", name, flush=True)


def poly_mask(pts):
    im = Image.new("L", (W, H), 0)
    ImageDraw.Draw(im).polygon(pts, fill=255)
    return np.asarray(im, np.float32) / 255


# the receiver and its cable
dark = (lum(img) < 0.2).astype(np.float32)
phone = poly_mask([(598, 255), (692, 255), (700, 500), (604, 500)]) * dark
cable = poly_mask([(628, 0), (705, 0), (690, 262), (636, 262)]) * (lum(img) < 0.33)
line = cv2.GaussianBlur(np.clip(phone + cable, 0, 1), (0, 0), 0.8)


# ---------------------------------------------------------------- 1 hot line
def hot_line():
    """Photocopied black & white, only the receiver and its cable in hot pink."""
    g = curve(xerox(img, 6.0, 0.45), [(0, 0.05), (1, 0.97)])
    out = np.dstack([g] * 3) * hexc("#EFEBE3")
    pink = hexc("#FF2E93")
    shade = np.clip(0.55 + lum(img) * 2.5, 0, 1.2)[..., None]
    out = out * (1 - line[..., None]) + pink * shade * line[..., None]
    out = speckle(grain(out, 0.05), 700)
    save("01-hot-line.jpg", out)


# ---------------------------------------------------------------- 2 hung up
def hung_up():
    """Flat paper room; tiny copies of him dangle on cables like the receivers."""
    out = paper("#E9E4DA")
    # real cables and blocks from the top, drawn as clean lines
    lay = Image.new("RGBA", (W * 2, H * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    ink = (22, 20, 18, 255)
    for x, L in [(60, 560), (1015, 470)]:
        d.line([(x * 2, 0), (x * 2, L * 2)], fill=ink, width=4)
        d.rectangle([(x - 24) * 2, L * 2, (x + 24) * 2, (L + 70) * 2], fill=ink)
    # cable from his receiver straight up
    d.line([(660 * 2, 0), (660 * 2, 265 * 2)], fill=ink, width=5)
    lay = np.asarray(lay.resize((W, H), Image.LANCZOS), np.float32) / 255
    # tiny hims hanging by the head
    ys_, xs_ = np.where(m > 0.5)
    top = 91
    cut, a = img, m
    for x, L, s in [(190, 150, 0.15), (865, 230, 0.12)]:
        mini = cv2.resize(cut, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        ma = cv2.resize(a, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        cx = int(np.mean(xs_) * s)
        ty = int(top * s)
        ox, oy = x - cx, L - ty
        h, w = ma.shape
        y1, x1 = min(H, oy + h), min(W, ox + w)
        reg = (slice(oy, y1), slice(max(0, ox), x1))
        sub = (slice(0, y1 - oy), slice(max(0, ox) - ox, x1 - ox))
        sh = cv2.GaussianBlur(ma, (0, 0), 5)[sub] * 0.3
        out[reg] = out[reg] * (1 - sh[..., None])
        out[reg] = out[reg] * (1 - ma[sub][..., None]) + mini[sub] * ma[sub][..., None]
        cl = np.zeros((H, W), np.float32)
        cv2.line(cl, (x, 0), (x, L + 4), 1.0, 2, cv2.LINE_AA)
        out = out * (1 - cl[..., None]) + np.array([0.086, 0.078, 0.07]) * cl[..., None]
    out = out * (1 - lay[..., 3:]) + lay[..., :3] * lay[..., 3:]
    # him, with a soft contact shadow
    sh = cv2.GaussianBlur(m, (0, 0), 18)
    sh = np.roll(np.roll(sh, 18, 0), 22, 1) * 0.35
    sh[:18] = 0
    sh[:, :22] = 0
    out = out * (1 - sh[..., None])
    subj = curve(img, [(0, 0.03), (0.5, 0.5), (1, 0.97)])
    out = out * (1 - m[..., None]) + subj * m[..., None]
    save("02-hung-up.jpg", speckle(grain(out, 0.03), 350))


# ---------------------------------------------------------------- 3 four calls
def four_calls():
    """2x2 photocopy tiles, each a different loud colour."""
    cw, ch = W // 2, H // 2
    colors = [("#FF2E93", "#1B1A1A"), ("#D6F03C", "#1B1A1A"), ("#2F55D4", "#F2EEE6"), ("#FF6A1A", "#1B1A1A")]
    g = xerox(img, 8.0, 0.36)
    out = np.zeros((H, W, 3), np.float32)
    for i, (bg, ink) in enumerate(colors):
        small = cv2.resize(g, (cw, ch), interpolation=cv2.INTER_AREA)
        sm = cv2.resize(m, (cw, ch), interpolation=cv2.INTER_AREA)
        tone = small[..., None] * hexc(bg) + (1 - small[..., None]) * hexc(ink)
        tile = hexc(bg) * (1 - sm[..., None]) + tone * sm[..., None]
        if i == 2:  # inverted tile
            tile = hexc(bg) * (1 - sm[..., None]) + (small[..., None] * hexc(ink) + (1 - small[..., None]) * np.array([0.08, 0.1, 0.25])) * sm[..., None]
        out[(i // 2) * ch:(i // 2 + 1) * ch, (i % 2) * cw:(i % 2 + 1) * cw] = tile
    save("03-four-calls.jpg", speckle(grain(out, 0.05), 600))


# ---------------------------------------------------------------- 4 bad signal
def bad_signal():
    """He breaks up into shifted strips on flat red, like a dropped call."""
    bg = paper("#E2342B", 0.04)
    cuts = [0, 230, 300, 470, 520, 760, 830, 1040, 1100, H]
    shifts = [0, 38, -22, 60, -46, 18, -70, 30, -12]
    out = bg.copy()
    subj = curve(img, [(0, 0.02), (0.5, 0.48), (1, 0.98)])
    for (y0, y1), s in zip(zip(cuts[:-1], cuts[1:]), shifts):
        band_m = np.zeros_like(m)
        band_m[y0:y1] = m[y0:y1]
        band_m = np.roll(band_m, s, axis=1)
        band_i = np.roll(subj, s, axis=1)
        out = out * (1 - band_m[..., None]) + band_i * band_m[..., None]
    save("04-bad-signal.jpg", speckle(grain(out, 0.035), 400))


# ---------------------------------------------------------------- 5 long distance
def long_distance():
    """Grunge B&W, the cable from his receiver becomes one endless curly cord."""
    # paint out the straight cable first, then photocopy
    straight = (cv2.dilate(cable, np.ones((7, 7), np.uint8)) > 0.2).astype(np.uint8) * 255
    clean = cv2.inpaint((img * 255).astype(np.uint8), straight, 5, cv2.INPAINT_TELEA).astype(np.float32) / 255
    g = curve(xerox(clean, 5.5, 0.45), [(0, 0.06), (1, 0.95)])
    out = np.dstack([g] * 3) * hexc("#EEE9DF")
    lay = Image.new("L", (W * 2, H * 2), 0)
    d = ImageDraw.Draw(lay)
    pts = []
    t = np.linspace(0, 1, 2600)
    # spine: from receiver top, up and around the right side, off the top-left
    # cubic bezier from the receiver top, a lazy loop, off the top-right corner
    P0, P1, P2, P3 = np.array([660, 262]), np.array([1000, 300]), np.array([620, -60]), np.array([1180, 40])
    sx, sy = ((1 - t) ** 3)[:, None] * P0 + (3 * (1 - t) ** 2 * t)[:, None] * P1 + (3 * (1 - t) * t ** 2)[:, None] * P2 + (t ** 3)[:, None] * P3, None
    sx, sy = sx[:, 0], sx[:, 1]
    coil = 20
    ang = t * 2 * np.pi * 34
    px = sx + coil * np.cos(ang)
    py = sy + coil * 0.55 * np.sin(ang)
    pts = [(float(a) * 2, float(b) * 2) for a, b in zip(px, py)]
    d.line(pts, fill=255, width=6, joint="curve")
    cord = np.asarray(lay.resize((W, H), Image.LANCZOS), np.float32) / 255
    pink = hexc("#FF2E93")
    out = out * (1 - cord[..., None]) + pink * cord[..., None]
    shade = np.clip(0.55 + lum(img) * 2.5, 0, 1.2)[..., None]
    out = out * (1 - phone[..., None]) + pink * shade * phone[..., None]
    save("05-long-distance.jpg", speckle(grain(out, 0.05), 700))


for fn in (hot_line, hung_up, four_calls, bad_signal, long_distance):
    fn()
