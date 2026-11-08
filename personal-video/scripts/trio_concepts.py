"""Three concept doodles for the trio lift selfie (original photo, original size).

A "lift panel": the two of them become lift buttons (up / down); Artyom's face
  is the yellow alarm button, drawn after the real one on the panel.
B "face ID": the phone's face detection, hand drawn: two faces found, Artyom's
  face censored in a red box.
C "left the lift": white contour drawn around the group; Artyom's head is
  filled with the lift's own red, as if he dissolved into the wall.

usage: python trio_concepts.py <photo> <people_mask> <out_dir>
"""
import math
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC, MASK, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
base = Image.open(SRC).convert("RGB")
W, H = base.size
arr = np.asarray(base).astype(np.float32) / 255
mask = cv2.resize(cv2.imread(MASK, 0), (W, H))
S = 2
rng = np.random.default_rng(7)

ART = (843, 425, 165, 190)
ME = (1410, 515, 215, 235)
HER = (1930, 745, 160, 185)
WHITE, INK, YEL, RED = (255, 255, 255, 255), (22, 20, 19, 255), (246, 190, 30, 255), (226, 38, 38, 255)


def P(pts):
    return [(x * S, y * S) for x, y in pts]


def jit(pts, a=2.0):
    return [(x + rng.normal(0, a), y + rng.normal(0, a)) for x, y in pts]


def wob_ellipse(cx, cy, rx, ry, turns=1.06, wob=0.025, n=120):
    ph = rng.uniform(0, 6.3)
    return [(cx + rx * (1 + wob * math.sin(3 * t + ph)) * math.cos(t), cy + ry * (1 + wob * math.sin(3 * t + ph)) * math.sin(t))
            for t in (i / n * 2 * math.pi - 1.2 for i in range(int(n * turns) + 1))]


def line(d, pts, col, w):
    d.line(P(pts), fill=col, width=int(w * S), joint="curve")
    r = w * S / 2
    for x, y in (pts[0], pts[-1]):
        d.ellipse([x * S - r, y * S - r, x * S + r, y * S + r], fill=col)


def new():
    im = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    return im, ImageDraw.Draw(im)


def finish(layer, name, under=None, shadow=0.3):
    lay = layer.resize((W, H), Image.LANCZOS)
    out = (under or base).convert("RGBA")
    if shadow:
        sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        sh.putalpha(lay.split()[3].filter(ImageFilter.GaussianBlur(5)).point(lambda v: int(v * shadow)))
        out.alpha_composite(sh, (4, 6))
    out.alpha_composite(lay)
    out.convert("RGB").save(os.path.join(OUT, name), quality=95)
    print("saved", name, flush=True)


def triangle(cx, cy, s, up=True):
    k = -1 if up else 1
    return [(cx - s, cy - k * s * 0.6), (cx, cy + k * s * 0.9), (cx + s, cy - k * s * 0.6), (cx - s, cy - k * s * 0.6)]


# ---------------------------------------------------------------- A lift panel
def lift_panel():
    im, d = new()
    cx, cy, rx, ry = ART
    r = 200
    d.ellipse(P([(cx - r, cy - r), (cx + r, cy + r)]), fill=YEL)
    line(d, wob_ellipse(cx, cy, r, r, wob=0.01), INK, 10)
    line(d, wob_ellipse(cx, cy, r - 30, r - 30, wob=0.01, turns=1.0), INK, 4)
    # bell, as on the alarm button
    bell = []
    for i in range(41):
        t = i / 40
        x = cx - 75 + 150 * t
        y = cy + 55 - 150 * math.sin(math.pi * t) ** 0.7
        bell.append((x, y))
    line(d, jit([(cx - 95, cy + 55)] + bell + [(cx + 95, cy + 55), (cx - 95, cy + 55)], 1), INK, 10)
    d.ellipse(P([(cx - 18, cy + 62), (cx + 18, cy + 98)]), fill=INK)
    line(d, [(cx, cy - 95), (cx, cy - 115)], INK, 10)
    # the other two: round buttons, up and down
    for (x, y, rx, ry), up in ((ME, True), (HER, False)):
        rr = max(rx, ry) * (0.98 if up else 1.05)
        line(d, wob_ellipse(x, y, rr, rr), WHITE, 10)
        line(d, wob_ellipse(x, y, rr + 24, rr + 24, wob=0.015, turns=1.0), WHITE, 4)
        tx, ty = x, y - rr - 90
        tri = triangle(tx, ty, 48, up)
        line(d, jit(tri, 1), WHITE, 8)
    finish(im, "concept-a-lift-panel.jpg")


# ---------------------------------------------------------------- B face ID
def brackets(d, x0, y0, x1, y1, col, w=9, L=70):
    for (px, py, sx, sy) in ((x0, y0, 1, 1), (x1, y0, -1, 1), (x0, y1, 1, -1), (x1, y1, -1, -1)):
        line(d, jit([(px + sx * L, py), (px, py), (px, py + sy * L)], 1.2), col, w)


def face_id():
    under = base.copy()
    cx, cy, rx, ry = ART
    x0, y0, x1, y1 = cx - rx - 30, cy - ry - 40, cx + rx + 30, cy + ry + 30
    face = under.crop((x0, y0, x1, y1))
    face = face.resize((max(1, (x1 - x0) // 34), max(1, (y1 - y0) // 34)), Image.BILINEAR).resize((x1 - x0, y1 - y0), Image.NEAREST)
    under.paste(face, (x0, y0))
    im, d = new()
    brackets(d, x0, y0, x1, y1, RED)
    line(d, jit([(x0 + 40, y0 + 40), (x1 - 40, y1 - 40)], 2), RED, 9)
    line(d, jit([(x1 - 40, y0 + 40), (x0 + 40, y1 - 40)], 2), RED, 9)
    for x, y, rx, ry in (ME, HER):
        brackets(d, x - rx - 40, y - ry - 50, x + rx + 40, y + ry + 30, YEL)
        d.ellipse(P([(x + rx + 40 - 14, y - ry - 50 - 44), (x + rx + 40 + 14, y - ry - 50 - 16)]), fill=YEL)
    finish(im, "concept-b-face-id.jpg", under=under, shadow=0.25)


# ---------------------------------------------------------------- C left the lift
def left_the_lift():
    cx, cy, rx, ry = ART
    wall = arr[250:950, 0:300].reshape(-1, 3).mean(0)
    head = np.zeros((H, W), np.uint8)
    cv2.ellipse(head, (cx, cy - 25), (rx + 45, ry + 70), 0, 0, 360, 255, -1)
    head = cv2.bitwise_and(head, (mask > 128).astype(np.uint8) * 255)
    head = cv2.morphologyEx(head, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    a = cv2.GaussianBlur(head.astype(np.float32) / 255, (0, 0), 1.5)[..., None]
    n = cv2.resize(rng.standard_normal((H // 40, W // 40)).astype(np.float32), (W, H))[..., None]
    fill = np.clip(wall * (1 + 0.06 * n), 0, 1)
    under = Image.fromarray(((arr * (1 - a) + fill * a) * 255).astype(np.uint8))
    im, d = new()
    cs, _ = cv2.findContours(head, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    for c in cs:
        pts = [(float(p[0][0]), float(p[0][1])) for p in c[::6]]
        line(d, jit(pts + pts[:1], 1.5), WHITE, 7)
    # the other two: a loose white contour around their heads
    for x, y, rx, ry in (ME, HER):
        line(d, wob_ellipse(x, y - 30, rx + 70, ry + 90, turns=1.04, wob=0.05), WHITE, 6)
    finish(im, "concept-c-left-the-lift.jpg", under=under, shadow=0.2)


lift_panel()
face_id()
left_the_lift()
