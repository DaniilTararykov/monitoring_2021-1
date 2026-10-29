# Build a smooth cigarette track from OWLv2 detections and blur it.
# usage: blur_track.py video.mov det.json out.mp4 [preview_dir]
import json
import subprocess
import sys

import cv2
import numpy as np

src, det_path, out_path = sys.argv[1:4]
preview = sys.argv[4] if len(sys.argv) > 4 else None
MIN_FRAME = 320  # before ~10.7 s there is no cigarette (food and coffee only)
det = {int(k): v for k, v in json.load(open(det_path)).items() if int(k) >= MIN_FRAME}

# Manual anchors (frame: centre) where the detector is unsure: cigarette held low at the hip, 19.7 s to the end.
MANUAL = {580: (750, 750), 582: (796, 824), 584: (812, 930), 586: (784, 1036), 588: (744, 1100), 590: (700, 1150), 591: (680, 1155), 606: (690, 1130), 624: (681, 1145), 642: (679, 1152), 653: (697, 1145)}
for i, (x, y) in MANUAL.items():
    half = 40 if i < 591 else 30  # the hand swings fast before 19.7 s
    det[i] = [[1.0, [x - half, y - half, x + half, y + half]]]

HI, LO, NEAR = 0.30, 0.10, 90  # confident score, weak score, max jump (px) for weak hits
cap = cv2.VideoCapture(src)
N = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
fps = cap.get(cv2.CAP_PROP_FPS)


def center(b):
    return np.array([(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]), max(b[2] - b[0], b[3] - b[1])


# 1. anchors: confident detections
track = {}
for i, cands in det.items():
    if cands and cands[0][0] >= HI:
        c, size = center(cands[0][1])
        track[i] = (c, size, cands[0][0])

# 2. weak detections are accepted only next to an existing track point
for _ in range(3):
    for i, cands in sorted(det.items()):
        if i in track:
            continue
        nb = [track[j] for j in (i - 1, i + 1, i - 2, i + 2) if j in track]
        if not nb:
            continue
        ref = nb[0][0]
        for s, b in cands:
            c, size = center(b)
            if s >= LO and np.linalg.norm(c - ref) < NEAR:
                track[i] = (c, size, s)
                break

if not track:
    sys.exit("no cigarette found")
first, last = min(track), max(track)
print(f"cigarette frames {first}-{last} ({first / fps:.2f}-{last / fps:.2f}s), anchors {len(track)}")

# 3. every frame between first and last gets a position (linear interpolation over gaps)
keys = sorted(track)
pos, rad = {}, {}
for i in range(first, last + 1):
    if i in track:
        c, size, _ = track[i]
        gap = 0
    else:
        a = max(k for k in keys if k < i)
        b = min(k for k in keys if k > i)
        w = (i - a) / (b - a)
        c = track[a][0] * (1 - w) + track[b][0] * w
        size = max(track[a][1], track[b][1])
        gap = min(i - a, b - i)
    pos[i] = c
    # bigger mask while interpolating through gaps (hand moving fast)
    rad[i] = 0.62 * size + 16 + 4 * min(gap, 6)

# 4. temporal smoothing (3-frame median on position, max on radius)
fr = sorted(pos)
sm_pos = {i: np.median([pos[j] for j in fr if abs(j - i) <= 1], axis=0) for i in fr}
sm_rad = {i: max(rad[j] for j in fr if abs(j - i) <= 1) for i in fr}

# 5. render
ff = subprocess.Popen([
    "ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", "1080x1920", "-r", str(fps), "-i", "-",
    "-i", src, "-map", "0:v", "-map", "1:a?", "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
    "-c:a", "copy", "-movflags", "+faststart", out_path,
], stdin=subprocess.PIPE)
yy, xx = np.mgrid[0:1920, 0:1080]
for i in range(N):
    ok, frame = cap.read()
    if not ok:
        break
    if i in sm_pos:
        cx, cy = sm_pos[i]
        r = sm_rad[i]
        # The top box often covers only the tip of a long cigarette; add nearby weaker boxes
        # (the part between the fingers) as extra circles.
        circles = [(cx, cy, r)]
        for s, b in det.get(i, []):
            c, size = center(b)
            if s >= 0.12 and np.hypot(c[0] - cx, c[1] - cy) < 70:
                circles.append((c[0], c[1], min(50, 0.5 * np.hypot(b[2] - b[0], b[3] - b[1]) + 14)))
        pad = 40
        x0 = int(max(0, min(x - rr for x, _, rr in circles) - pad))
        x1 = int(min(1080, max(x + rr for x, _, rr in circles) + pad))
        y0 = int(max(0, min(y - rr for _, y, rr in circles) - pad))
        y1 = int(min(1920, max(y + rr for _, y, rr in circles) + pad))
        roi = frame[y0:y1, x0:x1]
        blurred = cv2.GaussianBlur(roi, (0, 0), sigmaX=max(9, r / 3.2))
        m = np.zeros(roi.shape[:2])
        for x, y, rr in circles:
            d = np.hypot(xx[y0:y1, x0:x1] - x, yy[y0:y1, x0:x1] - y)
            m = np.maximum(m, np.clip((rr + 8 - d) / 16, 0, 1))  # soft 16 px edge
        m = m[..., None]
        frame[y0:y1, x0:x1] = (blurred * m + roi * (1 - m)).astype(np.uint8)
        if preview and i % 3 == 0:
            p = frame[max(0, int(cy) - 260):int(cy) + 260, max(0, int(cx) - 200):int(cx) + 200].copy()
            cv2.putText(p, f"{i / fps:.2f}", (6, 24), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            cv2.imwrite(f"{preview}/p_{i:04d}.jpg", p)
    ff.stdin.write(frame.tobytes())
ff.stdin.close()
ff.wait()
print("written", out_path)
