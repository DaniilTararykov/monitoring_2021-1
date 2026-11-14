"""Talking cut with independent picture: voice lines (pauses removed) with either their
own synced picture or other shots laid over them (L-cuts), plus wordless shots.

Each segment of the JSON list:
  {"a": [[s, e], ...], "raw": bool, "vol": float,
   "v": [{"sync": k} | {"src": t, "dur": d}, ...]}
- "a": source ranges for the sound; pauses are removed unless "raw".
- "v": picture for the segment. {"sync": k} shows the picture of the first k sound pieces in sync;
  {"src": t, "dur": d} shows other footage from t; the last item stretches to fill the segment.
  Without "v" every sound piece shows its own picture.

usage: python build_looks2.py <source.mov> <edit.json> <tmp_dir> <out.mp4>
"""
import json
import os
import subprocess
import sys

import numpy as np
import soundfile as sf

SRC, CFG, TMP, OUT = sys.argv[1:5]
FPS = 30
NAME = os.path.splitext(os.path.basename(OUT))[0]
os.makedirs(TMP, exist_ok=True)
wav = os.path.join(TMP, "full48.wav")
if not os.path.exists(wav):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-vn", "-ac", "1", "-ar", "48000", wav], check=True)
audio, sr = sf.read(wav, dtype="float32")


def speech(a, b):
    x = audio[int(a * sr):int(b * sr)]
    hop = int(0.02 * sr)
    n = len(x) // hop
    rms = np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(1) + 1e-12)
    on = rms > max(0.004, 0.12 * np.percentile(rms, 95))
    iv, start = [], None
    for i, v in enumerate(list(on) + [False]):
        if v and start is None:
            start = i
        if not v and start is not None:
            iv.append([start * 0.02, i * 0.02])
            start = None
    merged = []
    for s, e in iv:
        if merged and s - merged[-1][1] < 0.30:
            merged[-1][1] = e
        else:
            merged.append([s, e])
    merged = [m for m in merged if m[1] - m[0] >= 0.12]
    return [[max(a, a + s - 0.08), min(b, a + e + 0.10)] for s, e in merged]


shots, sound, loud = [], [], []


def clip(s, n):
    seg = audio[int(s * sr):int(s * sr) + int(n / FPS * sr)].copy()
    f = int(0.008 * sr)
    seg[:f] *= np.linspace(0, 1, f)
    seg[-f:] *= np.linspace(1, 0, f)
    return seg


for seg in json.load(open(CFG)):
    pieces = []
    for a, b in seg["a"]:
        for s, e in ([[a, b]] if seg.get("raw") else speech(a, b)):
            s = round(s * FPS) / FPS
            pieces.append((s, max(3, round((e - s) * FPS))))
    total = sum(n for _, n in pieces)
    for s, n in pieces:
        c = clip(s, n) * seg.get("vol", 1.0)
        sound.append(c)
        if not seg.get("raw"):
            loud.append(c)
    v = seg.get("v")
    if not v:
        shots += pieces
        continue
    used = 0
    for k, item in enumerate(v):
        last = k == len(v) - 1
        if "sync" in item:
            for s, n in pieces[: item["sync"]]:
                shots.append((s, n))
                used += n
        else:
            n = total - used if last else min(round(item["dur"] * FPS), total - used)
            if n > 0:
                shots.append((item["src"], n))
                used += n
    assert used == total, (seg, used, total)

parts = []
for i, (s, n) in enumerate(shots):
    part = os.path.join(TMP, f"{NAME}_p{i:03d}.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.4f}", "-t", f"{n / FPS + 0.5:.3f}", "-i", SRC, "-an",
                    "-vf", f"scale=1080:1920,fps={FPS}", "-frames:v", str(n), "-c:v", "libx264", "-preset", "fast",
                    "-crf", "17", "-g", "10", "-pix_fmt", "yuv420p", part], check=True)
    parts.append(part)
lst = os.path.join(TMP, NAME + "_list.txt")
open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
vid = os.path.join(TMP, NAME + "_video.mp4")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", vid], check=True)
v = np.concatenate(sound)
ref = np.concatenate(loud) if loud else v
v = np.tanh(v / (np.percentile(np.abs(ref), 99.5) + 1e-9) * 1.1) * 0.85 if np.abs(ref).max() > 0 else v
voice = os.path.join(TMP, NAME + "_voice.wav")
sf.write(voice, v, sr)
dur = sum(n for _, n in shots) / FPS
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", vid, "-i", voice, "-vf", f"fade=t=out:st={dur - 0.25:.3f}:d=0.25",
                "-af", f"afade=t=out:st={dur - 0.25:.3f}:d=0.25", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
                "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", OUT], check=True)
print("total", round(dur, 2), "s,", len(shots), "shots")
