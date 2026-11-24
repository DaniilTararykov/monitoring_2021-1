"""Recreate the reference reel: grey-tee close-up lip-sync -> he turns away and leaves the frame while the
pink-hoodie take is already standing at the door behind him (masked transition, one continuous room) -> the
pink take dances to the camera; the reference's own audio; loops seamlessly.

Both takes were shot from the same tripod. The grey take is warped onto the pink take's geometry (ECC, a few px)
so the room never jumps. During the transition each frame is  pink * (1 - m) + grey * m, where m is his
segmentation mask in the grey take; the switch happens on the first frame where the pink figure is fully hidden
behind him, so nobody pops in.

usage: python ref_reel.py <mine.mov> <ref.mp4> <loops.json> <frames_dir> <out.mp4>
       frames_dir holds g/NNN.png and p/NNN.png (both takes from T0 on, 1080x1920, 30 fps) and m/NNN.png (masks)
"""
import json
import os
import subprocess
import sys

import cv2
import numpy as np

MINE, REF, LOOPS, FR, OUT = sys.argv[1:6]
FPS, W, H = 30, 1080, 1920
L = json.load(open(LOOPS))
G, P = L["grey"][6], L["pink"][6]                 # chosen takes: loop start times in the source
DUR = 16.62                                       # one loop of the song (= the reference)
T0 = 4.0                                          # the transition frames were extracted from here (NNN = 000 at T0)
N = int(round(DUR * FPS))
K0 = int(round(T0 * FPS))


def reader(t):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", MINE, "-vf", f"scale={W}:{H},fps={FPS}",
                          "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)
    while True:
        b = p.stdout.read(W * H * 3)
        if len(b) < W * H * 3:
            return
        yield np.frombuffer(b, np.uint8).reshape(H, W, 3)


# grey -> pink geometry, measured on the room only
a = cv2.imread(os.path.join(FR, "g", "060.png"), 0).astype(np.float32)
b = cv2.imread(os.path.join(FR, "p", "060.png"), 0).astype(np.float32)
room = np.ones_like(a, np.uint8)
room[650:1650, 330:760] = 0
Wm = np.eye(2, 3, dtype=np.float32)
_, Wm = cv2.findTransformECC(cv2.GaussianBlur(b, (5, 5), 0), cv2.GaussianBlur(a, (5, 5), 0), Wm, cv2.MOTION_AFFINE,
                             (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-6), room, 5)


def to_pink(img):
    return cv2.warpAffine(img, Wm, (W, H), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP,
                          borderMode=cv2.BORDER_REPLICATE)


PINK_BOX = (300, 600, 800, 1700)                  # x0, y0, x1, y1: the pink figure waiting at the door
mdir = os.path.join(FR, "m")
# the model leaves a faint haze over the empty room: keep only confident values, softly
masks = {int(f[:3]): to_pink(np.clip((cv2.imread(os.path.join(mdir, f), 0).astype(np.float32) / 255 - 0.3) / 0.6, 0, 1))
         for f in sorted(os.listdir(mdir)) if f.endswith(".png")}
x0, y0, x1, y1 = PINK_BOX
start = next(i for i in sorted(masks) if masks[i][y0:y1, x0:x1].mean() > 0.97)
end = next(i for i in sorted(masks) if i > start and (masks[i] > 0.5).mean() < 0.002)
print("switch at", round(T0 + start / FPS, 3), "s; he has left the frame at", round(T0 + end / FPS, 3), "s (real time)")
S, E = K0 + start, K0 + end

enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}",
                        "-r", str(FPS), "-i", "-", "-i", REF, "-map", "0:v", "-map", "1:a", "-t", f"{N / FPS:.3f}",
                        "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
# SPEED: his exit in the grey tee is played this many times faster (a whip), so the pink take, which aims the
# finger guns at the door from 3.6 to 5.5 s, is revealed while he is still shooting
SPEED = float(os.environ.get("SPEED", "1"))
E2 = S + int(np.ceil((E - S) / SPEED))
# FLASH: muzzle flashes on the beat hits while he aims (times on the song, fingertip position in the frame)
SHOTS = [float(x) for x in os.environ.get("SHOTS", "").split(",") if x]
TIPS = [tuple(int(v) for v in xy.split(",")) for xy in os.environ.get("TIPS", "").split(";") if xy]  # one per shot
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def flash(f, age, tip):
    """a muzzle flash pointing at the camera: white core, star rays, orange glow, the room lit for a moment"""
    a = [1.0, 0.35, 0.1][age]
    cx, cy = tip
    r = np.hypot(xx - cx, yy - cy)
    ang = np.arctan2(yy - cy, xx - cx)
    core = np.exp(-(r / 12) ** 2)
    rays = np.exp(-r / 45) * np.clip(np.cos(ang * 4 + 0.4) ** 24 + 0.6 * np.cos(ang * 6 + 1.1) ** 30, 0, 1)
    glow = np.exp(-(r / 55) ** 2)
    light = (core * 1.0 + rays * 0.9)[..., None] * np.array([235, 250, 255], np.float32) \
        + glow[..., None] * np.array([40, 150, 255], np.float32) * 0.9
    room = 1 + 0.18 * a * np.exp(-(r / 900) ** 2)[..., None] * np.array([0.9, 1.0, 1.1], np.float32)
    out = f.astype(np.float32) * room
    out = 255 - (255 - out) * (1 - np.clip(light * a / 255, 0, 1))
    if age == 0:                                    # recoil: the camera jolts for one frame
        out = cv2.warpAffine(out, np.float32([[1.006, 0, -3.2], [0, 1.006, -6.0]]), (W, H), borderMode=cv2.BORDER_REPLICATE)
    return np.clip(out, 0, 255).astype(np.uint8)


# CURTAIN: real speed; when his back covers the frame the most (4.5-5.0 s) it melts away in a few frames,
# and behind it the pink take is already aiming at the door
CURTAIN = int(os.environ.get("CURTAIN", "0"))
if CURTAIN:
    win = [i for i in sorted(masks) if 4.5 <= T0 + i / FPS <= 5.0]
    w0 = max(win, key=lambda i: masks[i].mean())
    C0, C1 = K0 + w0 - CURTAIN // 2, K0 + w0 - CURTAIN // 2 + CURTAIN
    E2 = C1
    print("curtain at", round(T0 + w0 / FPS, 3), "s, back covers", round(float(masks[w0].mean()), 2), "of the frame")

shot_frames = {}
for t, tip in zip(SHOTS, TIPS):
    k0 = int(round(t * FPS))
    for age in range(3):
        shot_frames[k0 + age] = (age, tip)

greys = []
grey, pink = reader(G), reader(P)
for k in range(N):
    p = next(pink)
    need = (S + int(round((k - S) * SPEED)) if k >= S else k) if k < E2 else -1
    while len(greys) <= min(E - 1, need):
        greys.append(next(grey))
    if k < S:
        f = to_pink(greys[k])
    elif k < E2:
        j = k if CURTAIN else min(E - 1, S + int(round((k - S) * SPEED)))
        m = cv2.GaussianBlur(masks[j - K0], (0, 0), 1.2)[..., None]
        if CURTAIN and k >= C0:
            # the back slides off to the right like a curtain: its left edge sweeps across, soft and blurred
            cols = np.nonzero(m[..., 0].max(0) > 0.5)[0]
            lx, rx = (cols.min(), cols.max()) if len(cols) else (0, W)
            prog = (k - C0 + 1) / (CURTAIN + 1)
            edge = lx + (rx - lx + 120) * prog
            sweep = np.clip((xx[0] - edge) / 120 + 0.5, 0, 1)[None, :, None]
            m = m * sweep
            kb = np.ones((1, int(40 + 160 * prog)), np.float32) / int(40 + 160 * prog)
            gw = cv2.filter2D(to_pink(greys[j]), -1, kb, borderType=cv2.BORDER_REPLICATE)
            f = (p * (1 - m) + gw * m).astype(np.uint8)
        if not (CURTAIN and k >= C0):
            f = (p * (1 - m) + to_pink(greys[j]) * m).astype(np.uint8)
    else:
        f = p
    if k in shot_frames and k >= E2:
        f = flash(f, *shot_frames[k])
    enc.stdin.write(np.ascontiguousarray(f).tobytes())
    if k == E2:
        greys = []                                 # he is gone: free the buffered frames
enc.stdin.close()
enc.wait()
print("wrote", OUT, N, "frames")
