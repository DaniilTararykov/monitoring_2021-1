"""Put APC_0715 on the subway platform so it reads as one photo, not a cut-out:
- perspective: the platform's vanishing point at his eye line, where the street's was
- clean edges: the street colour is removed from his soft outline (colour decontamination), so no bright fringe
- the same lens: background defocus grows with distance, his edge gets the same slight softness as the lens
- the same light: overhead fluorescents (lighter at the top, falling off down the body), warm cast, his blacks
  lifted half way to the platform's black level
- he stands there: a soft ambient shadow on the floor around his legs
- one grain over everything

usage: python beanie_subway.py <person.jpg> <person_mask.png> <bg.jpg> <out.jpg>
"""
import sys

import cv2
import numpy as np
from PIL import Image

P, M, BG, OUT = sys.argv[1:5]
x = np.asarray(Image.open(P).convert("RGB")).astype(np.float32) / 255
a = np.asarray(Image.open(M).convert("L")).astype(np.float32) / 255
H, W = a.shape
bg = np.asarray(Image.open(BG).convert("RGB")).astype(np.float32) / 255
bh, bw = bg.shape[:2]
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

# ---- perspective
VP_P, VP_B, S = (0.52, 0.27), (0.46, 0.385), 1.3
sw, sh = int(W * S), int(W * S * bh / bw)
big = cv2.resize(bg, (sw, sh), interpolation=cv2.INTER_CUBIC)
ox = int(np.clip(VP_B[0] * sw - VP_P[0] * W, 0, sw - W))
oy = int(np.clip(VP_B[1] * sh - VP_P[1] * H, 0, sh - H))
bg = big[oy:oy + H, ox:ox + W]

# ---- defocus that grows towards the far end of the platform
vx, vy = VP_P[0] * W, VP_P[1] * H
far = np.clip(1 - np.hypot((xx - vx) / W, (yy - vy) / H) / 0.55, 0, 1)
b1, b2 = cv2.GaussianBlur(bg, (0, 0), 2.5), cv2.GaussianBlur(bg, (0, 0), 7.0)
bg = b1 * (1 - far[..., None]) + b2 * far[..., None]

# ---- clean his outline: remove the street colour from the soft edge
s = 4
band = cv2.dilate((a > 0.02).astype(np.uint8), np.ones((15, 15), np.uint8))
small = cv2.resize((x * 255).astype(np.uint8), (W // s, H // s), interpolation=cv2.INTER_AREA)
street = cv2.inpaint(small, cv2.resize(band, (W // s, H // s), interpolation=cv2.INTER_NEAREST), 3, cv2.INPAINT_NS)
street = cv2.resize(street, (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255
edge = (a > 0.02) & (a < 0.98)
fg = x.copy()
fg[edge] = np.clip((x[edge] - (1 - a[edge, None]) * street[edge]) / np.maximum(a[edge, None], 0.15), 0, 1)

# ---- his light becomes the platform's
lab_f = cv2.cvtColor((fg * 255).astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)
lab_b = cv2.cvtColor((bg * 255).astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)
sel = a > 0.6
lab_f[..., 2] += (np.median(lab_b[..., 2]) - np.median(lab_f[..., 2][sel])) * 0.35   # warmer only, no green
fg = cv2.cvtColor(np.clip(lab_f, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB).astype(np.float32) / 255
black = float(np.percentile(bg.mean(2), 1.5)) * 0.5            # half way to the platform's black level, warm
black_rgb = black * np.array([1.08, 1.0, 0.88], np.float32)
fg = black_rgb + fg * (1 - black_rgb)
ys = np.nonzero(sel)[0]
top, bot = ys.min(), ys.max()
t = np.clip((yy - top) / (bot - top), 0, 1)
fg = fg * (1.06 - 0.2 * t)[..., None]                            # overhead light, falling off down the body
fg = cv2.GaussianBlur(fg, (0, 0), 0.6) * 0.35 + fg * 0.65       # the same lens, a touch softer

# ---- he stands on the floor: soft ambient shadow below and around the legs
floor = np.clip((yy / H - 0.45) / 0.25, 0, 1)
shadow = cv2.GaussianBlur(cv2.warpAffine(a, np.float32([[1.15, 0, -0.075 * W], [0, 1, 0.04 * H]]), (W, H)),
                          (0, 0), W / 55)
bg = bg * (1 - 0.45 * np.clip(shadow * 1.4, 0, 1) * floor)[..., None]

# ---- composite, light wrap, one grain
am = cv2.GaussianBlur(a, (0, 0), 0.8)[..., None]
out = bg * (1 - am) + fg * am
rim = np.clip(cv2.GaussianBlur(a, (0, 0), 5) - cv2.erode(a, np.ones((11, 11), np.uint8)), 0, 1)[..., None]
out = out * (1 - rim * 0.15) + cv2.GaussianBlur(bg, (0, 0), 10) * rim * 0.15
out = out + np.random.default_rng(1).normal(0, 0.014, (H, W, 1)).astype(np.float32)
Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)).save(OUT, quality=96, subsampling=0)
print(OUT, W, "x", H)
