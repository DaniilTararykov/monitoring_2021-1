"""Beanie / silver-rose look: indoor shots matched to the street shots, plus blog layouts.

usage: python beanie_blog.py <src_dir> <out_dir>
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

SRC, OUT = sys.argv[1:3]
# file id -> (name, indoor?, crop centre for 4:5 as a fraction of the width)
SHOTS = {
    "c004ce2e": ("0688-street-full", False, 0.48),
    "81f00ca2": ("0738-street-face", False, 0.50),
    "457afa5b": ("0741-street-rings", False, 0.45),
    "7530d294": ("0740-street-rings-close", False, 0.46),
    "d579a50e": ("0744-street-crosswalk", False, 0.52),
    "33fa0704": ("0723-street-walk", False, 0.50),
    "a381809c": ("0799-beanie-detail", True, 0.42),
    "1f43bd5b": ("0795-rose-detail", True, 0.56),
    "3521692a": ("0788-wall-full", True, 0.525),
    "39365e3f": ("0780-wall-look", True, 0.50),
    "84d96477": ("0775-wall-profile", True, 0.50),
}


def load(fid):
    return np.asarray(Image.open(os.path.join(SRC, fid + "-image.jpg")).convert("RGB"))


def lab(im):
    return cv2.cvtColor(im, cv2.COLOR_RGB2LAB).astype(np.float32)


def rgb(l):
    return cv2.cvtColor(np.clip(l, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)


# the street look: mean colour cast and tone of the street shots
street = [lab(load(f)) for f, (_, ind, _) in SHOTS.items() if not ind]
S_MEAN = np.mean([s.reshape(-1, 3).mean(0) for s in street], 0)
S_P = np.mean([np.percentile(s[..., 0], [2, 50, 98]) for s in street], 0)


def match(im):
    """move an indoor shot onto the street look: same colour cast, same tone range"""
    l = lab(im)
    m = l.reshape(-1, 3).mean(0)
    l[..., 1] += (S_MEAN[1] - m[1]) * 0.9
    l[..., 2] += (S_MEAN[2] - m[2]) * 0.9
    p = np.percentile(l[..., 0], [2, 50, 98])
    # piecewise-linear tone map: shadows, midtones and highlights to the street's (midtone only half way)
    # only ever darken: the blacks of the coat and beanie must stay black
    tgt = [min(S_P[0], p[0]), min(p[1], p[1] + (S_P[1] - p[1]) * 0.5), min(p[2], max(S_P[2], 235.0))]
    l[..., 0] = np.interp(l[..., 0], [0, p[0], p[1], p[2], 255], [0, tgt[0], tgt[1], tgt[2], 255])
    return rgb(l)


def blog_grade(im):
    """one shared look for the feed: soft black point, gentle S, a little less colour"""
    x = im.astype(np.float32) / 255
    x = 0.035 + x * 0.955
    x = x + 0.06 * np.sin(np.pi * (x - 0.5)) * 0.5
    g = x.mean(2, keepdims=True)
    x = g + (x - g) * 0.9
    return (np.clip(x, 0, 1) * 255).astype(np.uint8)


def bw(im, seed):
    """black-and-white editorial: deep blacks, bright silver, fine grain"""
    g = cv2.cvtColor(im, cv2.COLOR_RGB2LAB)[..., 0].astype(np.float32) / 255
    g = np.clip((g - 0.06) / 0.9, 0, 1)
    g = g * g * (3 - 2 * g) * 0.65 + g * 0.35
    g += np.random.default_rng(seed).normal(0, 0.018, g.shape).astype(np.float32)
    return np.dstack([(np.clip(g, 0, 1) * 255).astype(np.uint8)] * 3)


def crop45(im, cx, w=1080, h=1350):
    H, W = im.shape[:2]
    cw = int(H * w / h)
    x0 = int(np.clip(cx * W - cw / 2, 0, W - cw))
    return np.asarray(Image.fromarray(im[:, x0:x0 + cw]).resize((w, h), Image.LANCZOS))


def save(im, *path):
    p = os.path.join(OUT, *path)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    Image.fromarray(im).save(p, quality=95)


graded = {}
for fid, (name, indoor, cx) in SHOTS.items():
    im = load(fid)
    m = match(im) if indoor else im
    save(m, "1-matched", name + ".jpg")                       # full size, indoor matched to street
    graded[fid] = blog_grade(m)

# A: feed carousel 4:5, one look, ordered as a story: the look, the face, the details, the wall, the walk
ORDER = ["c004ce2e", "81f00ca2", "a381809c", "457afa5b", "1f43bd5b", "3521692a", "39365e3f", "84d96477", "33fa0704"]
for i, fid in enumerate(ORDER, 1):
    save(crop45(graded[fid], SHOTS[fid][2]), "2-carousel", f"{i:02d}-{SHOTS[fid][0]}.jpg")

# B: diptychs 4:5, two whole landscape frames stacked (detail over the look), no cropping of the scene
PAIRS = [("a381809c", "d579a50e"), ("1f43bd5b", "3521692a"), ("457afa5b", "81f00ca2"), ("84d96477", "33fa0704")]
for i, (top, bot) in enumerate(PAIRS, 1):
    canvas = np.full((1350, 1080, 3), 14, np.uint8)
    for k, fid in enumerate((top, bot)):
        im = graded[fid]
        H, W = im.shape[:2]
        th = 651
        tw = int(W * th / H)
        tile = np.asarray(Image.fromarray(im).resize((tw, th), Image.LANCZOS))
        x0 = int(np.clip(SHOTS[fid][2] * tw - 1080 / 2, 0, tw - 1080))
        canvas[16 + k * (th + 16): 16 + k * (th + 16) + th, :] = tile[:, x0:x0 + 1080]
    save(canvas, "3-diptych", f"{i:02d}-{SHOTS[top][0]}+{SHOTS[bot][0]}.jpg")

# C: black-and-white editorial: the silver (pins, chain, rose, rings) carries the frame
for i, fid in enumerate(["a381809c", "1f43bd5b", "457afa5b", "84d96477", "c004ce2e", "39365e3f"], 1):
    save(bw(crop45(match(load(fid)) if SHOTS[fid][1] else load(fid), SHOTS[fid][2]), i), "4-bw", f"{i:02d}-{SHOTS[fid][0]}.jpg")

# previews
def sheet(folder, cols, tw=270):
    fs = sorted(os.listdir(os.path.join(OUT, folder)))
    ims = [Image.open(os.path.join(OUT, folder, f)) for f in fs]
    ims = [i.resize((tw, int(i.height * tw / i.width))) for i in ims]
    th = max(i.height for i in ims)
    rows = (len(ims) + cols - 1) // cols
    s = Image.new("RGB", (cols * (tw + 8) + 8, rows * (th + 8) + 8), (20, 20, 20))
    for k, i in enumerate(ims):
        s.paste(i, (8 + (k % cols) * (tw + 8), 8 + (k // cols) * (th + 8)))
    s.save(os.path.join(OUT, f"preview-{folder}.jpg"), quality=90)


for f, c in [("1-matched", 4), ("2-carousel", 5), ("3-diptych", 4), ("4-bw", 6)]:
    sheet(f, c)
print("done")
