"""Venice carousel: a quiet travel-notes look, 1080x1350 slides.

Alternates framed photos on warm paper with full-bleed crops, one soft film
grade for everything, a serif italic caption and tiny mono meta. The two
clips become video slides with the same frame and grade.

usage: python venice_carousel.py <venice_dir> <out_dir>
"""
import os
import subprocess
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SRC, OUT = sys.argv[1:3]
FONTS = os.path.join(os.path.dirname(__file__), "..", "assets", "fonts")
W, H = 1080, 1350
TOTAL = 9
PAPER = (243, 238, 229)
INK = (34, 30, 27)
rng = np.random.default_rng(3)


def serif(size):
    f = ImageFont.truetype(os.path.join(FONTS, "CormorantGaramond-Italic.ttf"), size)
    try:
        f.set_variation_by_axes([500])
    except Exception:
        pass
    return f


def mono(size):
    return ImageFont.truetype(os.path.join(FONTS, "SpaceMono-Regular.ttf"), size)


def load(name):
    return np.asarray(Image.open(os.path.join(SRC, name)).convert("RGB")).astype(np.float32) / 255


def grade(img):
    """Soft film: lifted blacks, rolled-off highlights, a touch warmer and less saturated."""
    img = 0.035 + img * 0.93
    g = img.mean(axis=2, keepdims=True)
    img = g + (img - g) * 0.9
    img = img * np.array([1.02, 1.0, 0.955])
    img = img + (img - 0.5) * 0.04
    return np.clip(img, 0, 1)


def grain(img, amt=0.022):
    n = rng.standard_normal(img.shape[:2]).astype(np.float32)
    n = cv2.GaussianBlur(n, (0, 0), 0.6)
    return np.clip(img + n[..., None] * amt, 0, 1)


def paper():
    img = np.ones((H, W, 3), np.float32) * np.array(PAPER, np.float32) / 255
    n = cv2.resize(rng.standard_normal((H // 90, W // 90)).astype(np.float32), (W, H), interpolation=cv2.INTER_CUBIC)
    return img * (1 + 0.012 * n[..., None])


def cover(img, w, h, cx=0.5, cy=0.5):
    """Scale-and-crop to w x h keeping the point (cx, cy) (fractions) in view."""
    ih, iw = img.shape[:2]
    s = max(w / iw, h / ih)
    r = cv2.resize(img, (round(iw * s), round(ih * s)), interpolation=cv2.INTER_AREA)
    rh, rw = r.shape[:2]
    x0 = int(np.clip(cx * rw - w / 2, 0, rw - w))
    y0 = int(np.clip(cy * rh - h / 2, 0, rh - h))
    return r[y0:y0 + h, x0:x0 + w]


def text(img, draw_fn):
    S = 2
    im = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(im), S)
    im = im.resize((W, H), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255
    return img * (1 - a[..., 3:]) + a[..., :3] * a[..., 3:]


def meta(d, S, n, color):
    d.text((60 * S, 54 * S), "venezia", font=mono(20 * S), fill=color)
    d.text(((W - 60) * S, 54 * S), f"{n:02d}/{TOTAL:02d}", font=mono(20 * S), fill=color, anchor="ra")


FRAME = (60, 300, 960, 720)  # x, y, w, h of a framed landscape photo


def framed(n, img, caption, cxy=(0.5, 0.5), title=None):
    x, y, w, h = FRAME
    out = paper()
    if img is not None:
        out[y:y + h, x:x + w] = grade(cover(img, w, h, *cxy))

    def draw(d, S):
        meta(d, S, n, INK + (255,))
        if title:
            d.text((W / 2 * S, 120 * S), title, font=serif(150 * S), fill=INK + (255,), anchor="ma")
        d.text((60 * S, 1090 * S), caption, font=serif(64 * S), fill=INK + (255,))
    return grain(text(out, draw))


def bleed(n, img, caption, cxy=(0.5, 0.5)):
    out = grade(cover(img, W, H, *cxy))
    # gentle shade under the type only
    yy = np.linspace(0, 1, H)[:, None, None]
    out = out * (1 - 0.35 * np.clip((yy - 0.72) / 0.28, 0, 1)) * (1 - 0.25 * np.clip((0.1 - yy) / 0.1, 0, 1))

    def draw(d, S):
        meta(d, S, n, (255, 255, 255, 235))
        d.text((60 * S, 1180 * S), caption, font=serif(64 * S), fill=(255, 255, 255, 255))
    return grain(text(out, draw))


def save(name, img):
    Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, name), quality=94)
    print("saved", name, flush=True)


def video_slide(n, clip, caption, name, title=None, loops=0):
    """Paper frame as an overlay with a hole; the clip sits under it, graded in ffmpeg."""
    x, y, w, h = FRAME
    bg = framed(n, None, caption, title=title)
    rgba = np.dstack([bg, np.ones((H, W), np.float32)])
    rgba[y:y + h, x:x + w, 3] = 0
    png = os.path.join(OUT, f"_frame{n}.png")
    Image.fromarray((rgba * 255).astype(np.uint8), "RGBA").save(png)
    vf = (
        f"[0:v]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},fps=30,"
        "curves=all='0/0.035 1/0.965',eq=saturation=0.9,colorbalance=rm=0.02:bm=-0.03:rh=0.01:bh=-0.02,"
        "noise=alls=5:allf=t,format=yuv420p[v];"
        f"color=c=0xF3EEE5:s={W}x{H}:r=30[bg];[bg][v]overlay={x}:{y}:shortest=1[b];[b][1:v]overlay=0:0,format=yuv420p[out]"
    )
    cmd = ["ffmpeg", "-v", "error", "-y", "-stream_loop", str(loops), "-i", os.path.join(SRC, clip), "-loop", "1", "-i", png,
           "-filter_complex", vf, "-map", "[out]", "-map", "0:a?", "-c:v", "libx264", "-crf", "18", "-preset", "medium",
           "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", os.path.join(OUT, name)]
    subprocess.run(cmd, check=True)
    os.remove(png)
    print("saved", name, flush=True)


os.makedirs(OUT, exist_ok=True)
save("01-venezia.jpg", framed(1, load("v1.jpg"), "notes from the lagoon", (0.52, 0.5), title="Venezia"))
save("02-ciao.jpg", bleed(2, load("v7.jpg"), "ciao, from here", (0.5, 0.5)))
save("03-the-door.jpg", bleed(3, load("v3.jpg"), "the door was looking back", (0.7, 0.5)))
save("04-lunch-break.jpg", framed(4, load("v4.jpg"), "lunch break, gondolier style", (0.5, 0.55)))
video_slide(5, "canal.mov", "blue hour", "05-blue-hour.mp4", loops=1)
save("06-fritto-misto.jpg", bleed(6, load("v6.jpg"), "fritto misto & a cold glass", (0.55, 0.55)))
save("07-packed.jpg", framed(7, load("v5.jpg"), "packed too much, as always", (0.5, 0.5)))
save("08-museum-hours.jpg", framed(8, load("v2.jpg"), "museum hours", (0.45, 0.4)))
video_slide(9, "gondola.mov", "ciao, venezia", "09-ciao-venezia.mp4", loops=1)
