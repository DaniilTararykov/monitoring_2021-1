"""Six grunge / collage concepts for the "on the line" gallery photos.

Inputs: photos (public/photos/caller/*.jpg), person masks from rembg BiRefNet
(<masks>/<name>_birefnet-portrait.png) and optional LaMa-cleaned photos with
background people removed (<clean>/<name>.jpg).

usage: python photo_concepts.py <photos> <masks> <clean> <out_dir> [concept ...]
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

PHOTOS, MASKS, CLEAN, OUT = sys.argv[1:5]
ONLY = sys.argv[5:]
FONTS = os.path.join(os.path.dirname(__file__), "..", "assets", "fonts")
W, H = 1080, 1350
rng = np.random.default_rng(7)


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


BLACK = lambda s: font("ArchivoBlack-Regular.ttf", s)
MONO = lambda s: font("SpaceMono-Regular.ttf", s)
HAND = lambda s: font("ReenieBeanie.ttf", s)
MARKER = lambda s: font("PermanentMarker-Regular.ttf", s)
TYPE = lambda s: font("SpecialElite-Regular.ttf", s)


# ---------------------------------------------------------------- inputs
def photo(n, clean=True):
    p = os.path.join(CLEAN, n + ".jpg")
    if not (clean and os.path.exists(p)):
        p = os.path.join(PHOTOS, n + ".jpg")
    return np.asarray(Image.open(p).convert("RGB")).astype(np.float32) / 255


def alpha(n):
    """Soft person mask, main subject only."""
    m = cv2.imread(os.path.join(MASKS, f"{n}_birefnet-portrait.png"), 0).astype(np.float32) / 255
    hh, ww = m.shape
    k = ww / 1126
    if n == "p4_side":  # a visitor touches his elbow in this one
        yy, xx = np.mgrid[0:hh, 0:ww]
        m[((yy < 1060 * k) & (xx > 868 * k)) | ((yy >= 1060 * k) & (yy < 1250 * k) & (xx > 916 * k)) | ((yy >= 1250 * k) & (xx > 868 * k))] = 0
    b = (m > 0.5).astype(np.uint8)
    _, lab, st, _ = cv2.connectedComponentsWithStats(b)
    main = lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
    main = cv2.dilate(main.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    return m * main


# ---------------------------------------------------------------- helpers
def smooth_noise(h, w, scale, seed=None):
    r = np.random.default_rng(seed) if seed is not None else rng
    small = r.standard_normal((max(2, h // scale), max(2, w // scale))).astype(np.float32)
    n = cv2.resize(small, (w, h), interpolation=cv2.INTER_CUBIC)
    return n / (n.std() + 1e-6)


def grain(img, amt=0.05, size=1.0):
    h, w = img.shape[:2]
    n = rng.standard_normal((int(h / size), int(w / size))).astype(np.float32)
    n = cv2.resize(n, (w, h))
    return np.clip(img + n[..., None] * amt, 0, 1)


def vignette(img, strength=0.35):
    h, w = img.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2) / np.sqrt(2)
    return img * (1 - strength * d[..., None] ** 2)


def paper(h, w, color, fibers=True, seed=None, amt=1.0):
    c = np.array(color, np.float32) / 255
    img = np.ones((h, w, 3), np.float32) * c
    img *= 1 + 0.05 * amt * smooth_noise(h, w, 120, seed)[..., None]
    img *= 1 + 0.03 * amt * smooth_noise(h, w, 18, seed)[..., None]
    if fibers:
        layer = Image.new("L", (w, h), 0)
        d = ImageDraw.Draw(layer)
        r = np.random.default_rng(seed)
        for _ in range(int(w * h / 900)):
            x, y = r.uniform(0, w), r.uniform(0, h)
            a = r.uniform(0, np.pi)
            L = r.uniform(4, 18)
            d.line([(x, y), (x + np.cos(a) * L, y + np.sin(a) * L)], fill=int(r.uniform(20, 60)), width=1)
        f = np.asarray(layer.filter(ImageFilter.GaussianBlur(0.6)), np.float32) / 255
        img = img * (1 - 0.25 * f[..., None]) + 0.25 * f[..., None] * np.clip(c * 1.25, 0, 1)
    return np.clip(img, 0, 1)


def over(base, layer, a, x=0, y=0):
    """Alpha-composite float layer (h,w,3) with mask a at (x,y), clipped to base."""
    H_, W_ = base.shape[:2]
    h, w = a.shape
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(W_, x + w), min(H_, y + h)
    if x1 <= x0 or y1 <= y0:
        return base
    sl = (slice(y0 - y, y1 - y), slice(x0 - x, x1 - x))
    aa = a[sl][..., None]
    base[y0:y1, x0:x1] = base[y0:y1, x0:x1] * (1 - aa) + layer[sl] * aa
    return base


def torn_outline(binary, r, rough=0.5, seed=None):
    """Paper margin around a mask with a ragged, hand-torn edge."""
    h, w = binary.shape
    dist = cv2.distanceTransform((1 - binary).astype(np.uint8), cv2.DIST_L2, 5)
    n = smooth_noise(h, w, 40, seed) * r * rough + smooth_noise(h, w, 4, seed) * r * 0.18
    return (dist < r + n).astype(np.float32)


def resize(img, s):
    h, w = img.shape[:2]
    return cv2.resize(img, (int(w * s), int(h * s)), interpolation=cv2.INTER_AREA)


def fit_crop(img, x0, y0, cw):
    """4:5 crop starting at (x0,y0) with width cw, resized to the canvas."""
    ch = int(cw * 5 / 4)
    return cv2.resize(img[y0:y0 + ch, x0:x0 + cw], (W, H), interpolation=cv2.INTER_AREA)


def to_pil(img):
    return Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8))


def from_pil(im):
    return np.asarray(im.convert("RGB")).astype(np.float32) / 255


def text_layer(draw_fn, size=(W, H), scale=2):
    """Draw at 2x on a transparent canvas and return (rgb, alpha) floats."""
    im = Image.new("RGBA", (size[0] * scale, size[1] * scale), (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(im), scale)
    im = im.resize(size, Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255
    return a[..., :3], a[..., 3]


def save(name, img):
    os.makedirs(OUT, exist_ok=True)
    to_pil(img).save(os.path.join(OUT, name + ".jpg"), quality=93)
    print("saved", name, flush=True)


# ---------------------------------------------------------------- 1 torn collage
def torn():
    n = "p3_look"
    img, a = photo(n), alpha(n)
    s = 1240 / img.shape[0]
    img, a = resize(img, s), resize(a, s)
    h, w = a.shape
    k = s * 1.2875  # display px -> scaled px
    cuts = [0, int(800 * k), int(1520 * k), h]
    bg = paper(H, W, (38, 76, 168), seed=3)
    bg = vignette(bg, 0.45)
    xs = np.arange(w)
    offsets = [(-14, -6, -1.6), (10, 6, 0.9), (-4, 16, -0.6)]
    for i in range(3):
        y0, y1 = cuts[i], cuts[i + 1]
        n1 = smooth_noise(1, w, 60, 10 + i)[0] * 8 + smooth_noise(1, w, 6, 20 + i)[0] * 2.5
        n2 = smooth_noise(1, w, 60, 11 + i)[0] * 8 + smooth_noise(1, w, 6, 21 + i)[0] * 2.5
        yy = np.arange(h)[:, None]
        top = (y0 + (n1 if i else np.full(w, -999.0)))[None, :]
        bot = (y1 + (n2 if i < 2 else np.full(w, 999.0)))[None, :]
        band_img = ((yy > top + 9) & (yy < bot - 9)).astype(np.float32)
        band_pap = ((yy > top) & (yy < bot)).astype(np.float32)
        body = (a > 0.5).astype(np.uint8)
        pap = torn_outline(body, 15, seed=30 + i) * band_pap
        pic = a * band_img
        dx, dy, rot = offsets[i]
        M = cv2.getRotationMatrix2D((w / 2, (y0 + y1) / 2), rot, 1)
        warp = lambda z, c=1: cv2.warpAffine(z, M, (w, h), flags=cv2.INTER_LINEAR, borderValue=0)
        pap_r, pic_r = warp(pap), warp(pic)
        img_r = cv2.warpAffine(img, M, (w, h))
        ox, oy = (W - w) // 2 + dx, H - h + 40 + dy
        sh = cv2.GaussianBlur(pap_r, (0, 0), 9) * 0.5
        over(bg, np.zeros((h, w, 3), np.float32), sh, ox + 10, oy + 14)
        pcol = paper(h, w, (246, 243, 236), fibers=False, seed=40 + i)
        over(bg, pcol, pap_r, ox, oy)
        over(bg, img_r * np.array([1.02, 1.0, 0.97]), pic_r, ox, oy)
    bg = grain(bg, 0.04, 1.5)
    rgb, ta = text_layer(lambda d, S: (
        d.text((70 * S, 92 * S), "hello?", font=HAND(150 * S), fill=(246, 243, 236, 255)),
        d.text((W * S - 70 * S, 128 * S), "LINE 07", font=MONO(26 * S), fill=(246, 243, 236, 220), anchor="ra"),
    ))
    save("01-torn-collage", over(bg, rgb, ta))


# ---------------------------------------------------------------- 2 big head
def bighead():
    n = "p2_mirror"
    img, a = photo(n), alpha(n)
    hh, ww = a.shape
    k = ww / 1126
    yy, xx = np.mgrid[0:hh, 0:ww]
    neck_y = 985 * k
    region = a * (yy < neck_y) * (xx > 420 * k) * (xx < 770 * k)
    region = cv2.GaussianBlur(region, (0, 0), 1.5)
    S = 1.85
    ax, ay = 548 * k, neck_y
    M = np.float32([[S, 0, ax - S * ax], [0, S, ay - S * ay]])
    big = cv2.warpAffine(img, M, (ww, hh), flags=cv2.INTER_CUBIC)
    bigm = cv2.warpAffine(region, M, (ww, hh))
    # fade the cut at the neck so the head sits on the collar
    fade = np.clip((neck_y - yy) / (30 * k), 0, 1)
    bigm *= fade
    sh = cv2.GaussianBlur(bigm, (0, 0), 14) * 0.35
    out = img * (1 - sh[..., None] * (yy > ay - 260 * k)[..., None])
    out = out * (1 - bigm[..., None]) + big * bigm[..., None]
    out = fit_crop(out, 0, int(330 * k), ww)
    out = grain(out, 0.025)
    save("02-big-head", out)


# ---------------------------------------------------------------- 3 fax
def fax():
    n = "p4_side"
    img, a = photo(n, clean=False), alpha(n)
    ys, xs = np.where(a > 0.5)
    y0, x0, x1 = ys.min(), xs.min(), xs.max()
    img, a = img[y0:, x0 - 20:x1 + 20], a[y0:, x0 - 20:x1 + 20]
    s = 1010 / img.shape[0]
    img, a = resize(img, s), resize(a, s)
    h, w = a.shape
    g = img @ np.array([0.3, 0.55, 0.15], np.float32)
    g = np.clip((g - 0.06) / 0.5, 0, 1) ** 0.85
    g = g * a + (1 - a)
    # coarse error-diffusion "toner"
    small = to_pil(np.dstack([g] * 3)).convert("L").resize((int(w * 0.42), int(h * 0.42)), Image.LANCZOS)
    dots = np.asarray(small.convert("1").resize((w, h), Image.NEAREST), np.float32)
    ink = 1 - dots
    ink = np.maximum(ink, (g < 0.18).astype(np.float32))
    ink = cv2.GaussianBlur(ink, (0, 0), 0.7)
    bg = paper(H, W, (238, 236, 229), fibers=False, seed=5, amt=0.3)
    # header / title under the figure
    def head(d, S):
        d.text((54 * S, 46 * S), "04 NOV 2026  21:47", font=MONO(24 * S), fill=(30, 28, 27, 255))
        d.text((W * S / 2, 46 * S), "FROM: LINE 07", font=MONO(24 * S), fill=(30, 28, 27, 255), anchor="ma")
        d.text((W * S - 54 * S, 46 * S), "P.01/01", font=MONO(24 * S), fill=(30, 28, 27, 255), anchor="ra")
        d.line([(54 * S, 90 * S), (W * S - 54 * S, 90 * S)], fill=(30, 28, 27, 255), width=2 * S)
        d.text((W * S / 2, 118 * S), "INCOMING", font=BLACK(170 * S), fill=(30, 28, 27, 255), anchor="ma")
        d.text((W * S / 2, 300 * S), "CALL", font=BLACK(170 * S), fill=(30, 28, 27, 255), anchor="ma")
    rgb, ta = text_layer(head)
    ta = ta * (rng.random(ta.shape) > 0.06)
    bg = over(bg, rgb, ta)
    ox = (W - w) // 2 + 20
    tone = np.ones((h, w, 3), np.float32) * np.array([0.11, 0.105, 0.1])
    # white paper knock-out behind the figure, then toner
    bg = over(bg, paper(h, w, (238, 236, 229), False, 6), cv2.GaussianBlur(a, (0, 0), 1) , ox, H - h)
    bg = over(bg, tone, ink * 0.95, ox, H - h)
    def foot(d, S):
        d.rectangle([54 * S, 1240 * S, 420 * S, 1296 * S], fill=(30, 28, 27, 255))
        d.text((70 * S, 1250 * S), "PLEASE HOLD", font=MONO(28 * S), fill=(238, 236, 229, 255))
        d.text((W * S - 54 * S, 1262 * S), "DO NOT HANG UP", font=MONO(22 * S), fill=(30, 28, 27, 255), anchor="ra")
    rgb, ta = text_layer(foot)
    bg = over(bg, rgb, ta)
    # fax faults: shifted scan bands, streaks, edge shading
    for yb, hb, sh in [(430, 6, 26), (712, 3, -14), (1004, 9, 18)]:
        bg[yb:yb + hb] = np.roll(bg[yb:yb + hb], sh, axis=1)
    for xs_ in rng.integers(60, W - 60, 5):
        bg[:, xs_:xs_ + 1] *= 0.93
    bg[:, :, :] *= 1 - 0.08 * np.abs(np.linspace(-1, 1, W))[None, :, None] ** 3
    bg = grain(bg, 0.035, 1.2)
    save("03-fax", bg)


# ---------------------------------------------------------------- 4 badge
def badge():
    pic = photo("p1_close")
    hh, ww = pic.shape[:2]
    face = pic[int(hh * 0.08):int(hh * 0.08) + int(ww * 0.46 * 1.25), int(ww * 0.24):int(ww * 0.24) + int(ww * 0.46)]
    face = np.clip((face - 0.03) * 1.06, 0, 1)
    INK = (24, 22, 20, 255)

    def draw(d, S):
        P = lambda *v: [x * S for x in v]
        # lanyard clip
        d.ellipse(P(500, -60, 580, 60), outline=(150, 150, 150, 255), width=9 * S)
        d.ellipse(P(503, -57, 577, 57), outline=(220, 220, 220, 255), width=3 * S)
        # holder
        d.rounded_rectangle(P(160, 30, 920, 1320), radius=34 * S, fill=(255, 255, 255, 70), outline=(205, 205, 205, 255), width=3 * S)
        d.rectangle(P(160, 70, 920, 160), fill=(255, 255, 255, 60))
        for y in (78, 92, 148):
            d.line(P(170, y, 910, y), fill=(200, 200, 200, 255), width=2 * S)
        d.rounded_rectangle(P(470, 104, 610, 134), radius=15 * S, fill=(232, 232, 230, 255), outline=(185, 185, 185, 255), width=2 * S)
        for cx in (260, 820):
            d.ellipse(P(cx - 18, 101, cx + 18, 137), fill=(232, 232, 230, 255), outline=(185, 185, 185, 255), width=2 * S)
        # card
        d.rectangle(P(205, 210, 875, 1280), fill=(244, 240, 228, 255))
        d.text(P(240, 232), "ON THE", font=BLACK(108 * S), fill=INK)
        d.text(P(240, 336), "LINE", font=BLACK(108 * S), fill=INK)
        d.text(P(840, 250), "LINE:07", font=MONO(22 * S), fill=INK, anchor="ra")
        d.line(P(240, 470, 840, 470), fill=INK, width=2 * S)
        d.text(P(240, 480), "CALLER ID · VOICE ONLY", font=MONO(20 * S), fill=INK)
        d.text(P(840, 476), "hello?", font=MARKER(24 * S), fill=INK, anchor="ra")
        for i, (k, v) in enumerate([("NAME", "Danik"), ("STATUS", "on hold"), ("CALLING", "you")]):
            y = 1000 + i * 70
            d.text(P(240, y + 26), k, font=MONO(18 * S), fill=INK)
            d.text(P(380, y - 14), v, font=HAND(76 * S), fill=(30, 30, 40, 255))
            for x in range(240, 840, 12):
                d.line(P(x, y + 52, x + 5, y + 52), fill=INK, width=2 * S)
        d.text(P(240, 1222), "THE HOLDER OF THIS CARD\nIS ALWAYS ON THE PHONE", font=MONO(13 * S), fill=INK, spacing=2 * S)
        d.text(P(840, 1206), "07-47H", font=BLACK(44 * S), fill=INK, anchor="ra")

    bg = paper(H, W, (226, 226, 223), fibers=False, seed=9, amt=0.25)
    # card shadow
    sh = np.zeros((H, W), np.float32)
    sh[230:1310, 190:900] = 1
    bg = over(bg, np.zeros((H, W, 3), np.float32), cv2.GaussianBlur(sh, (0, 0), 22) * 0.28, 8, 14)
    rgb, ta = text_layer(draw)
    bg = over(bg, rgb, ta)
    fw, fh = 360, 450
    f = cv2.resize(face, (fw, fh), interpolation=cv2.INTER_AREA)
    bg[525:525 + fh, 360:360 + fw] = f
    # plastic sheen
    yy, xx = np.mgrid[0:H, 0:W]
    sheen = np.clip(1 - np.abs((xx + yy * 0.55) - 900) / 160, 0, 1) * 0.10
    inside = ((xx > 162) & (xx < 918) & (yy > 32) & (yy < 1318)).astype(np.float32)
    bg = bg + (sheen * inside)[..., None]
    bg = grain(bg, 0.02)
    save("04-caller-badge", bg)


# ---------------------------------------------------------------- 5 silhouette split
def silhouette():
    LIME = np.array([214, 240, 60], np.float32) / 255
    INK = (26, 24, 22, 255)
    n = "p2_mirror"
    img, a = photo(n), alpha(n)
    hh, ww = a.shape
    k = ww / 1126
    # left: the cleaned photo, person filled flat
    x0, y0, ch = int(318 * k), int(650 * k), hh - int(650 * k)
    cw = int(ch * 540 / 1350)
    left = img[y0:y0 + ch, x0:x0 + cw]
    la = a[y0:y0 + ch, x0:x0 + cw]
    left = left * (1 - la[..., None]) + LIME * la[..., None]
    canvas = np.ones((H, W, 3), np.float32) * LIME
    canvas[:, :540] = cv2.resize(left, (540, H), interpolation=cv2.INTER_AREA)
    # right: the real person, same pose, on flat colour
    cut = img[y0:y0 + ch, x0:x0 + cw]
    canvas_r = canvas[:, 540:].copy()
    over(canvas_r, cv2.resize(cut, (540, H), interpolation=cv2.INTER_AREA), cv2.resize(la, (540, H)), 0, 0)
    canvas[:, 540:] = canvas_r
    labels = [("hello?", 300), ("is anyone there", 470), ("on the line", 640), ("please hold", 810), ("call me back", 980)]

    def draw(d, S):
        for i, (t, y) in enumerate(labels):
            x = 60 + (i % 2) * 30
            d.ellipse([(x - 10) * S, (y - 10) * S, (x + 10) * S, (y + 10) * S], fill=INK)
            d.text(((x + 20) * S, (y - 15) * S), t, font=MONO(22 * S), fill=INK)
        d.line([(540 * S, 0), (540 * S, H * S)], fill=INK, width=2 * S)
        d.text((60 * S, 70 * S), "YOU", font=BLACK(64 * S), fill=INK)
        d.text((600 * S, 70 * S), "ME", font=BLACK(64 * S), fill=INK)
        d.text((W * S - 50 * S, 1300 * S), "LINE 07", font=MONO(20 * S), fill=INK, anchor="rs")
    rgb, ta = text_layer(draw)
    canvas = over(canvas, rgb, ta)
    save("05-silhouette-split", grain(canvas, 0.02))


# ---------------------------------------------------------------- 6 grunge zine
def zine():
    img = photo("p1_close")
    hh, ww = img.shape[:2]
    img = fit_crop(img, 0, 0, ww)
    g = img @ np.array([0.3, 0.55, 0.15], np.float32)
    g = np.clip((g - 0.08) / 0.75, 0, 1)
    g = 1 / (1 + np.exp(-(g - 0.5) * 7))  # crushed photocopy contrast
    paperc = paper(H, W, (232, 226, 212), seed=11)
    ink = np.array([0.07, 0.065, 0.06])
    out = paperc * g[..., None] + ink * (1 - g[..., None])
    # red misregistered ghost of the darks
    RED = np.array([0.89, 0.15, 0.10])
    dark = np.clip(1 - g * 1.6, 0, 1)
    ghost = np.roll(np.roll(dark, 14, 1), -9, 0) * 0.35
    out = out * (1 - ghost[..., None]) + (out * RED) * ghost[..., None]
    # scratches & dust
    sc = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(sc)
    for _ in range(14):
        x = rng.uniform(0, W)
        d.line([(x, 0), (x + rng.uniform(-30, 30), H)], fill=int(rng.uniform(60, 160)), width=1)
    for _ in range(220):
        x, y, r = rng.uniform(0, W), rng.uniform(0, H), rng.uniform(0.5, 2.2)
        d.ellipse([x - r, y - r, x + r, y + r], fill=int(rng.uniform(80, 200)))
    sc = np.asarray(sc, np.float32)[..., None] / 255
    out = out * (1 - sc * 0.6) + paperc * sc * 0.6

    def draw(d, S):
        R = (226, 38, 26, 255)
        # loose double circle around the receiver
        for i, (dx, rr) in enumerate([(0, 0), (8, 14)]):
            box = [(560 + dx) * S, (250 + rr) * S, (830 - dx) * S, (700 - rr) * S]
            d.arc(box, start=-80 + i * 20, end=250 + i * 30, fill=R, width=7 * S)
        # sound lines
        for i in range(3):
            r0 = 60 + i * 45
            d.arc([(820 - r0) * S, (430 - r0) * S, (820 + r0) * S, (430 + r0) * S], start=-50, end=40, fill=R, width=6 * S)
        d.text((800 * S, 110 * S), "hello?", font=MARKER(92 * S), fill=R, anchor="ma")
        d.text((70 * S, 1180 * S), "no signal", font=MARKER(64 * S), fill=R)
        d.line([(70 * S, 1262 * S), (420 * S, 1252 * S)], fill=R, width=6 * S)
        d.text((W * S - 50 * S, 1290 * S), "LINE 07 / ZINE NO.1", font=MONO(20 * S), fill=(20, 18, 16, 255), anchor="rs")
    rgb, ta = text_layer(draw)
    ta *= rng.random(ta.shape) > 0.04  # dry marker
    out = over(out, rgb, ta * 0.95)
    # masking tape at the corners
    for (x, y, rot) in [(-30, 30, -32), (W - 200, H - 120, -30)]:
        tape = np.ones((70, 240, 3), np.float32) * np.array([0.93, 0.89, 0.78])
        ta2 = np.ones((70, 240), np.float32) * 0.78
        ta2[:, :6] = ta2[:, -6:] = 0
        M = cv2.getRotationMatrix2D((120, 35), rot, 1)
        M[:, 2] += [80, 100]
        tape = cv2.warpAffine(tape, M, (400, 270))
        ta2 = cv2.warpAffine(ta2, M, (400, 270))
        out = over(out, tape, ta2, x - 80, y - 100)
    out = grain(vignette(out, 0.3), 0.05, 1.3)
    save("06-grunge-zine", out)


CONCEPTS = dict(torn=torn, bighead=bighead, fax=fax, badge=badge, silhouette=silhouette, zine=zine)
for k, fn in CONCEPTS.items():
    if not ONLY or k in ONLY:
        fn()
