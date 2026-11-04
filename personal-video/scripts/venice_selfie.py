"""Selfie x suitcases, original colours (no filter).

1 "storage": the garage doors behind him open onto rooms stacked with luggage.
2 "carry-on": the selfie sits on the front of the pale trunk in the suitcase wall,
  the trunk's straps and locks over it.

usage: python venice_selfie.py <venice_dir> <masks_dir> <out_dir>
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image

SRC, MASKS, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)


def load(n):
    return np.asarray(Image.open(os.path.join(SRC, n + ".jpg")).convert("RGB")).astype(np.float32) / 255


def save(name, x):
    Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, name), quality=95)
    print("saved", name, flush=True)


def lum(x):
    return x @ np.array([0.3, 0.55, 0.15], np.float32)


por, lug = load("v7"), load("v5")
H0, W0 = por.shape[:2]
pm = cv2.resize(cv2.imread(os.path.join(MASKS, "v7_birefnet-portrait.png"), 0), (W0, H0)).astype(np.float32) / 255

# ---------------------------------------------------------------- 1 storage
# door openings (TL, TR, BR, BL) in selfie pixels, and which part of the wall fills each
DOORS = [
    ([(1645, 682), (1815, 682), (1815, 1142), (1645, 1145)], (0, 260, 640, 1606)),
    ([(1862, 682), (2093, 682), (2093, 1135), (1862, 1135)], (1080, 120, 1880, 1606)),
    ([(2122, 662), (2298, 670), (2298, 1150), (2122, 1140)], (560, 0, 1150, 1500)),
    ([(2318, 655), (2462, 650), (2462, 1190), (2318, 1170)], (1500, 300, 2151, 1606)),
]


def match_light(patch, ref):
    """Bring the luggage into the shade of the courtyard: match mean/contrast per channel."""
    m1, s1 = patch.reshape(-1, 3).mean(0), patch.reshape(-1, 3).std(0)
    m2, s2 = ref.reshape(-1, 3).mean(0), ref.reshape(-1, 3).std(0)
    target_m = m1 * 0.55 + m2 * 0.45
    return np.clip((patch - m1) * (s1 * 0.8 + s2 * 0.2) / (s1 + 1e-6) + target_m * 0.92, 0, 1)


def storage():
    out = por.copy()
    for quad, (x0, y0, x1, y1) in DOORS:
        src = lug[y0:y1, x0:x1]
        q = np.float32(quad)
        Msrc = np.float32([(0, 0), (src.shape[1], 0), (src.shape[1], src.shape[0]), (0, src.shape[0])])
        P = cv2.getPerspectiveTransform(Msrc, q)
        warped = cv2.warpPerspective(src, P, (W0, H0), flags=cv2.INTER_AREA)
        a = cv2.warpPerspective(np.ones(src.shape[:2], np.float32), P, (W0, H0))
        a = cv2.GaussianBlur(a, (0, 0), 1.0)
        bx0, by0 = int(q[:, 0].min()), int(q[:, 1].min())
        bx1, by1 = int(q[:, 0].max()), int(q[:, 1].max())
        warped[by0:by1, bx0:bx1] = match_light(warped[by0:by1, bx0:bx1], por[by0:by1, bx0:bx1])
        # depth: shade under the lintel and along the jambs
        yy, xx = np.mgrid[0:H0, 0:W0]
        depth = np.clip((yy - by0) / 90, 0, 1) * np.clip((xx - bx0) / 40, 0, 1) * np.clip((bx1 - xx) / 40, 0, 1)
        warped = warped * (0.55 + 0.45 * depth[..., None])
        out = out * (1 - a[..., None]) + warped * a[..., None]
    # he stays in front
    out = out * (1 - pm[..., None]) + por * pm[..., None]
    cw = int(H0 * 3 / 4)
    save("storage-3x4.jpg", cv2.resize(out[:, 900:900 + cw], (1080, 1440), interpolation=cv2.INTER_AREA))
    cw = int(H0 * 4 / 3)
    x0 = (W0 - cw) // 2
    save("storage-4x3.jpg", cv2.resize(out[:, x0:x0 + cw], (1440, 1080), interpolation=cv2.INTER_AREA))


# ---------------------------------------------------------------- 2 carry-on
def carry_on():
    k = lug.shape[1] / 2000
    tx0, ty0, tx1, ty1 = [int(v * k) for v in (1104, 958, 1662, 1236)]
    tw, th = tx1 - tx0, ty1 - ty0
    # selfie crop with the trunk's aspect, centred on the face
    ch = int(W0 * th / tw)
    cy = int(np.clip(930 - ch / 2, 0, H0 - ch))
    face = cv2.resize(por[cy:cy + ch], (tw, th), interpolation=cv2.INTER_AREA)
    trunk = lug[ty0:ty1, tx0:tx1]
    L = lum(trunk)
    hardware = cv2.GaussianBlur((L < 0.3).astype(np.float32), (0, 0), 1.0)
    shading = np.clip(L / np.percentile(L, 70), 0.6, 1.1)[..., None]
    printed = face * (0.82 + 0.18 * shading)
    panel = printed * (1 - hardware[..., None]) + trunk * hardware[..., None]
    out = lug.copy()
    edge = np.zeros((th, tw), np.float32)
    edge[6:-6, 6:-6] = 1
    edge = cv2.GaussianBlur(edge, (0, 0), 2)[..., None]
    out[ty0:ty1, tx0:tx1] = panel * edge + trunk * (1 - edge)
    Hh, Ww = out.shape[:2]
    cw = int(Hh * 3 / 4)
    x0 = int(np.clip((tx0 + tx1) / 2 - cw / 2, 0, Ww - cw))
    save("carry-on-3x4.jpg", cv2.resize(out[:, x0:x0 + cw], (1080, 1440), interpolation=cv2.INTER_AREA))
    cw = int(Hh * 4 / 3)
    x0 = (Ww - cw) // 2
    save("carry-on-4x3.jpg", cv2.resize(out[:, x0:x0 + cw], (1440, 1080), interpolation=cv2.INTER_AREA))


storage()
carry_on()
