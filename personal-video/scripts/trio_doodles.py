"""Hand-drawn doodles over the trio selfie (original photo, original size).
Artyom (left) gets his face covered by a drawing; the other two get doodles around them.

usage: python trio_doodles.py <photo> <out_dir>
"""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC, OUT = sys.argv[1:3]
os.makedirs(OUT, exist_ok=True)
base = Image.open(SRC).convert("RGB")
W, H = base.size
S = 2  # supersampling
rng = np.random.default_rng(2)

ART = (843, 425, 165, 190)    # cx, cy, rx, ry  (left: Artyom)
ME = (1410, 520, 210, 230)    # centre
HER = (1930, 750, 150, 175)   # right
WHITE, PINK, YEL, RED, INK = (255, 255, 255, 255), (255, 46, 147, 255), (255, 214, 10, 255), (232, 40, 40, 255), (20, 18, 17, 255)


def jit(pts, a=3.0):
    return [(x + rng.normal(0, a), y + rng.normal(0, a)) for x, y in pts]


def P(pts):
    return [(x * S, y * S) for x, y in pts]


def wobbly_ellipse(cx, cy, rx, ry, n=90, wob=0.04, turns=1.08, start=0.0):
    out = []
    ph = rng.uniform(0, 6.28)
    for i in range(int(n * turns) + 1):
        t = start + i / n * 2 * math.pi
        k = 1 + wob * math.sin(3 * t + ph) + rng.normal(0, wob / 4)
        out.append((cx + rx * k * math.cos(t), cy + ry * k * math.sin(t)))
    return out


def line(d, pts, col, w):
    d.line(P(pts), fill=col, width=int(w * S), joint="curve")
    r = w * S / 2
    for x, y in (pts[0], pts[-1]):
        d.ellipse([x * S - r, y * S - r, x * S + r, y * S + r], fill=col)


def star(cx, cy, r):
    pts = []
    for i in range(9):
        a = -math.pi / 2 + i * math.pi / 4
        rr = r if i % 2 == 0 else r * 0.28
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return pts


def heart(cx, cy, s):
    pts = []
    for i in range(61):
        t = i / 60 * 2 * math.pi
        x = 16 * math.sin(t) ** 3
        y = -(13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t))
        pts.append((cx + x * s, cy + y * s))
    return pts


def finish(layer, name):
    lay = layer.resize((W, H), Image.LANCZOS)
    a = lay.split()[3]
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow.putalpha(a.filter(ImageFilter.GaussianBlur(6)).point(lambda v: int(v * 0.35)))
    out = base.convert("RGBA")
    out.alpha_composite(shadow, (5, 7))
    out.alpha_composite(lay)
    out.convert("RGB").save(os.path.join(OUT, name), quality=95)
    print("saved", name, flush=True)


def new():
    im = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    return im, ImageDraw.Draw(im)


# ---------------------------------------------------------------- A: smiley sticker, crown, hearts
def variant_a():
    im, d = new()
    cx, cy, rx, ry = ART
    d.ellipse(P([(cx - rx, cy - ry), (cx + rx, cy + ry)]), fill=YEL)
    line(d, wobbly_ellipse(cx, cy, rx, ry, wob=0.02), INK, 9)
    for ex in (-55, 55):
        d.ellipse(P([(cx + ex - 16, cy - 60), (cx + ex + 16, cy - 10)]), fill=INK)
    smile = [(cx - 85 + i * 170 / 20, cy + 45 + 55 * math.sin(i / 20 * math.pi)) for i in range(21)]
    line(d, jit(smile, 1.5), INK, 11)
    # crown on him
    x, y, rx, ry = ME
    top = y - ry - 150
    crown = [(x - 150, top + 150), (x - 165, top + 10), (x - 80, top + 85), (x, top - 20), (x + 80, top + 85), (x + 165, top + 10), (x + 150, top + 150), (x - 150, top + 150)]
    line(d, jit(crown, 3), YEL, 12)
    for px in (-165, 0, 165):
        d.ellipse(P([(x + px - 14, top + (10 if px else -20) - 14 - 8), (x + px + 14, top + (10 if px else -20) + 14 - 8)]), fill=PINK)
    # hearts around her
    x, y, rx, ry = HER
    for hx, hy, s in ((x + 200, y - 210, 5.5), (x + 270, y - 60, 3.6), (x - 150, y - 260, 3.2)):
        line(d, jit(heart(hx, hy, s), 2), PINK, 9)
    for sx, sy, r in ((x + 120, y + 150, 26), (x + 260, y + 120, 18)):
        line(d, star(sx, sy, r * 2), WHITE, 6)
    finish(im, "doodle-a.jpg")


# ---------------------------------------------------------------- B: scribble-out, devil horns, halo
def variant_b():
    im, d = new()
    cx, cy, rx, ry = ART
    pts = []
    for i in range(46):
        t = i / 45
        y = cy - ry + 2 * ry * t
        span = rx * math.sqrt(max(0.0, 1 - ((y - cy) / ry) ** 2)) + 25
        pts.append((cx + (span if i % 2 else -span), y))
    line(d, jit(pts, 6), INK, 30)
    line(d, jit(pts[::-1], 8), INK, 22)
    # horns on him
    x, y, rx, ry = ME
    for sgn in (-1, 1):
        bx = x + sgn * 130
        by = y - ry - 30
        horn = [(bx - sgn * 45, by + 20), (bx + sgn * 30, by - 140), (bx + sgn * 50, by + 10)]
        d.polygon(P(jit(horn, 2)), fill=RED)
        line(d, jit(horn + [horn[0]], 2), INK, 6)
    # halo over her
    x, y, rx, ry = HER
    line(d, wobbly_ellipse(x - 10, y - ry - 70, 150, 38, wob=0.03, turns=1.1), YEL, 13)
    for sx, sy, r in ((x - 190, y - 230, 30), (x + 200, y - 170, 24)):
        line(d, star(sx, sy, r * 2), YEL, 6)
    finish(im, "doodle-b.jpg")


# ---------------------------------------------------------------- C: ghost sheet, flower, lightning
def variant_c():
    im, d = new()
    cx, cy, rx, ry = ART
    ghost = [(cx - rx - 10, cy + ry + 40)]
    for i in range(31):
        t = math.pi + i / 30 * math.pi
        ghost.append((cx + (rx + 10) * math.cos(t), cy - 20 + (ry + 20) * math.sin(t)))
    for i in range(7):  # wavy hem
        x0 = cx + rx + 10 - i * (2 * rx + 20) / 6
        ghost.append((x0, cy + ry + (40 if i % 2 == 0 else 5)))
    d.polygon(P(ghost), fill=WHITE)
    line(d, jit(ghost + [ghost[0]], 2), INK, 8)
    for ex in (-55, 55):
        d.ellipse(P([(cx + ex - 22, cy - 45), (cx + ex + 22, cy + 15)]), fill=INK)
    d.ellipse(P([(cx - 25, cy + 50), (cx + 25, cy + 110)]), fill=INK)
    # lightning bolts beside him
    x, y, rx, ry = ME
    for bx, by, s in ((x + 210, y - 300, 1.0), (x - 330, y - 260, 0.75)):
        bolt = [(bx, by), (bx - 60 * s, by + 120 * s), (bx - 5 * s, by + 115 * s), (bx - 55 * s, by + 240 * s), (bx + 60 * s, by + 90 * s), (bx + 5 * s, by + 95 * s), (bx + 45 * s, by)]
        d.polygon(P(jit(bolt, 2)), fill=YEL)
        line(d, jit(bolt + [bolt[0]], 2), INK, 6)
    # flower in her hair
    x, y, rx, ry = HER
    fx, fy = x - 130, y - 170
    for k in range(6):
        a = k / 6 * 2 * math.pi
        line(d, wobbly_ellipse(fx + 42 * math.cos(a), fy + 42 * math.sin(a), 34, 34, wob=0.05, turns=1.0), WHITE, 9)
        d.ellipse(P([(fx + 42 * math.cos(a) - 28, fy + 42 * math.sin(a) - 28), (fx + 42 * math.cos(a) + 28, fy + 42 * math.sin(a) + 28)]), fill=PINK)
    d.ellipse(P([(fx - 26, fy - 26), (fx + 26, fy + 26)]), fill=YEL)
    for hx, hy, s in ((x + 230, y - 200, 4.0),):
        line(d, jit(heart(hx, hy, s), 2), WHITE, 9)
    finish(im, "doodle-c.jpg")


variant_a()
variant_b()
variant_c()
