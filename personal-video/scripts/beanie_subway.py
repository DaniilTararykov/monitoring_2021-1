"""Put APC_0715 on the subway platform: same perspective (the platform's vanishing point at his eye line,
where the street's was), the person's light matched to the warm fluorescent platform, the background a little
out of focus as with an open aperture, light wrap on the edges, one grain over everything. Original size.

usage: python beanie_subway.py <person.jpg> <person_mask.png> <bg.jpg> <out.jpg>
"""
import sys

import cv2
import numpy as np
from PIL import Image

P, M, BG, OUT = sys.argv[1:5]
x = np.asarray(Image.open(P).convert("RGB")).astype(np.float32) / 255
m = np.asarray(Image.open(M).convert("L")).astype(np.float32) / 255
H, W = m.shape
bg = np.asarray(Image.open(BG).convert("RGB")).astype(np.float32) / 255
bh, bw = bg.shape[:2]

# perspective: the street vanishes at (0.52 W, 0.27 H) in his photo; the platform vanishes at (0.46, 0.385)
VP_P, VP_B, S = (0.52, 0.27), (0.46, 0.385), 1.3
sw, sh = int(W * S), int(W * S * bh / bw)
big = cv2.resize(bg, (sw, sh), interpolation=cv2.INTER_CUBIC)
ox = int(np.clip(VP_B[0] * sw - VP_P[0] * W, 0, sw - W))
oy = int(np.clip(VP_B[1] * sh - VP_P[1] * H, 0, sh - H))
bg = big[oy:oy + H, ox:ox + W]
bg = cv2.GaussianBlur(bg, (0, 0), 2.2)                    # shallow depth of field

# light: move his colour cast and level part of the way to the platform's
lab_p = cv2.cvtColor((x * 255).astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)
lab_b = cv2.cvtColor((bg * 255).astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)
sel = m > 0.5
for c, k in ((1, 0.45), (2, 0.45)):
    lab_p[..., c] += (np.median(lab_b[..., c]) - np.median(lab_p[..., c][sel])) * k
person = cv2.cvtColor(np.clip(lab_p, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB).astype(np.float32) / 255
person = np.clip(person * 1.03, 0, 1)                     # the platform is brighter than the dusk street

a = cv2.GaussianBlur(m, (0, 0), 1.0)
out = bg * (1 - a[..., None]) + person * a[..., None]
# light wrap: a little of the lit background spills over his outline
edge = np.clip(cv2.GaussianBlur(m, (0, 0), 6) - cv2.erode(m, np.ones((9, 9), np.uint8)), 0, 1)
wrap = cv2.GaussianBlur(bg, (0, 0), 12)
out = out * (1 - edge[..., None] * 0.35) + wrap * edge[..., None] * 0.35
out = out + np.random.default_rng(1).normal(0, 0.012, (H, W, 1)).astype(np.float32)
Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)).save(OUT, quality=96, subsampling=0)
print(OUT, W, "x", H)
