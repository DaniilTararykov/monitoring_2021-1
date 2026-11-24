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
print("switch at", round(T0 + start / FPS, 3), "s; he has left the frame at", round(T0 + end / FPS, 3), "s")
S, E = K0 + start, K0 + end

enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}",
                        "-r", str(FPS), "-i", "-", "-i", REF, "-map", "0:v", "-map", "1:a", "-t", f"{N / FPS:.3f}",
                        "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
grey, pink = reader(G), reader(P)
for k in range(N):
    g, p = next(grey), next(pink)
    if k < S:
        f = to_pink(g)
    elif k < E:
        m = cv2.GaussianBlur(masks[k - K0], (0, 0), 1.2)[..., None]
        f = (p * (1 - m) + to_pink(g) * m).astype(np.uint8)
    else:
        f = p
    enc.stdin.write(np.ascontiguousarray(f).tobytes())
enc.stdin.close()
enc.wait()
print("wrote", OUT, N, "frames")
