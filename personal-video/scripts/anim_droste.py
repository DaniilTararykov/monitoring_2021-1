"""Endless zoom: the selfie is inside the window on the red wall, which holds
the selfie again, and so on. Original photo, no filter. Loops seamlessly.

usage: python anim_droste.py <photo> <person_mask> <out_dir>
"""
import os
import subprocess
import sys

import cv2
import numpy as np
from PIL import Image

SRC, MASK, OUT = sys.argv[1:4]
FPS = 30
os.makedirs(OUT, exist_ok=True)
img = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32) / 255
H0, W0 = img.shape[:2]
pm = cv2.resize(cv2.imread(MASK, 0), (W0, H0)).astype(np.float32) / 255
GLASS_X, GLASS_W, GLASS_Y = 1399, 142, 152  # window glass on the red wall (image px)


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def make(name, box, size, dur, levels=4):
    x0, y0, cw, ch = box
    src = img[y0:y0 + ch, x0:x0 + cw]
    per = pm[y0:y0 + ch, x0:x0 + cw]
    zl = cw / GLASS_W
    wpos = np.array([GLASS_X - x0, GLASS_Y - y0], np.float64)
    ww, wh = cw / zl, ch / zl
    hole = np.zeros((ch, cw), np.float32)
    hole[int(wpos[1]):int(wpos[1] + wh), int(wpos[0]):int(wpos[0] + ww)] = 1
    hole = cv2.GaussianBlur(hole, (0, 0), 0.7)
    f = wpos / (1 - 1 / zl)          # fixed point of "frame -> window"
    sc = size[0] / cw
    N = int(FPS * dur)
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{size[0]}x{size[1]}",
                          "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-crf", "17", "-pix_fmt", "yuv420p",
                          "-movflags", "+faststart", os.path.join(OUT, name)], stdin=subprocess.PIPE)
    for i in range(N):
        u = i / N
        z = zl ** u
        out = np.zeros((size[1], size[0], 3), np.float32)
        for k in range(levels - 1, -1, -1):
            # level k sits at S^k(frame); S(p) = wpos + p / zl
            off = wpos * sum(zl ** -j for j in range(k))
            s = z / zl ** k
            if s * cw * sc < 2:
                continue
            A = np.array([[sc * s, 0, sc * (f[0] + (off[0] - f[0]) * z)],
                          [0, sc * s, sc * (f[1] + (off[1] - f[1]) * z)]], np.float32)
            # hair of the outermost level fades out at the end so the loop matches
            hair = 1 - smoothstep(0.55, 0.92, u) if k == 0 else 1.0
            a = 1 - hole * (1 - per * hair)
            lay = cv2.warpAffine(src, A, size, flags=cv2.INTER_LINEAR)
            al = cv2.warpAffine(a, A, size, flags=cv2.INTER_LINEAR, borderValue=0)
            out = out * (1 - al[..., None]) + lay * al[..., None]
        p.stdin.write((np.clip(out, 0, 1) * 255).astype(np.uint8).tobytes())
    p.stdin.close()
    p.wait()
    print("saved", name, flush=True)


# 3:4 vertical: crop around the face, window included
cw = int(H0 * 3 / 4)
x0 = int(np.clip(1314 - cw / 2, 0, W0 - cw))
make("droste-3x4.mp4", (x0, 0, cw, H0), (1080, 1440), dur=4.0)
# 4:3: the full frame (a deeper zoom per loop)
cw = int(H0 * 4 / 3)
make("droste-4x3.mp4", ((W0 - cw) // 2, 0, cw, H0), (1440, 1080), dur=5.0)
