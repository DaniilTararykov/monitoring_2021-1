"""Beanie look, "clean boy" grade: every photo keeps its own size and framing.
Neutral whites (no warm indoor cast, no blue street cast), a little brighter, soft contrast,
clean but not crushed blacks, calmer colour, natural skin. Same look for street and indoor shots.

usage: python beanie_clean.py <src_dir> <out_dir>
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image

SRC, OUT = sys.argv[1:3]
os.makedirs(OUT, exist_ok=True)
NAMES = {"c004ce2e": "APC_0688", "81f00ca2": "APC_0738", "457afa5b": "APC_0741", "7530d294": "APC_0740",
         "d579a50e": "APC_0744", "33fa0704": "APC_0723", "a381809c": "APC_0799", "1f43bd5b": "APC_0795",
         "3521692a": "APC_0788", "39365e3f": "APC_0780", "84d96477": "APC_0775"}

for fid, name in NAMES.items():
    src = Image.open(os.path.join(SRC, fid + "-image.jpg"))
    exif = src.info.get("exif")
    im = np.asarray(src.convert("RGB"))
    lab = cv2.cvtColor(im, cv2.COLOR_RGB2LAB).astype(np.float32)
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
    # neutral white balance, measured on the neutral parts only (walls, sky, streets: low chroma)
    neutral = (np.hypot(A - 128, B - 128) < 12) & (L > 60)
    a0, b0 = np.median(A[neutral]), np.median(B[neutral])
    A -= (a0 - 128) * 0.9
    B -= (b0 - 128.5) * 0.9
    # tone: clean blacks, a touch brighter, soft highlight roll-off (no clipping)
    p2, p50, p995 = np.percentile(L, [2, 50, 99.5])
    x = np.clip((L - p2) / (p995 - p2), 0, 1)
    gamma = np.log(0.56) / np.log(max(0.05, min(0.95, (p50 - p2) / (p995 - p2))))
    gamma = float(np.clip(gamma, 0.85, 1.0))  # brighten a little, never darken
    x = x ** gamma
    x = x - 0.06 * x * (1 - x) * (x - 0.5) * 4          # a softer S: less contrast in the mids
    L[:] = 9 + x * (246 - 9)
    # calmer colour, skin kept warm
    A[:] = 128 + (A - 128) * 0.85
    B[:] = 128 + (B - 128) * 0.85
    out = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)
    kw = {"quality": 96, "subsampling": 0}
    if exif:
        kw["exif"] = exif
    Image.fromarray(out).save(os.path.join(OUT, name + ".jpg"), **kw)
    print(name, out.shape[1], "x", out.shape[0], "wb shift", round(float(a0 - 128), 1), round(float(b0 - 128.5), 1),
          "gamma", round(gamma, 2))
