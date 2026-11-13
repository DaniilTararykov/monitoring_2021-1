"""Talking-head cut: keep the chosen clean phrases, drop pauses inside them.

For every phrase range the script finds speech by loudness, removes silences longer
than ~0.3 s, cuts those pieces from the 4K source (video) and from a 48 kHz wav
(voice, short fades at each joint), and writes src/looks_cut.json for the composition.

usage: python build_looks.py <source.mov> <looks.json> <tmp_dir> <public_dir> <out_json> [name]
"""
import json
import os
import subprocess
import sys

import numpy as np
import soundfile as sf

SRC, CFG, TMP, PUB, OUT = sys.argv[1:6]
NAME = sys.argv[6] if len(sys.argv) > 6 else "looks"
FPS = 30
os.makedirs(TMP, exist_ok=True)
wav = os.path.join(TMP, "full48.wav")
if not os.path.exists(wav):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-vn", "-ac", "1", "-ar", "48000", wav], check=True)
audio, sr = sf.read(wav, dtype="float32")
cfg = json.load(open(CFG))


def speech(a, b):
    """Speech intervals inside [a, b] (seconds), pauses > 0.3 s removed."""
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


pieces, subs, voice, parts = [], [], [], []
frame = 0
for pi, ph in enumerate(cfg["phrases"]):
    f0 = frame
    k = 0
    for a, b in ph["r"]:
        for s, e in ([[a, b]] if ph.get("raw") else speech(a, b)):
            n = max(3, round((e - s) * FPS))
            s = round(s * FPS) / FPS
            part = os.path.join(TMP, f"{NAME}_p{len(parts):03d}.mp4")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.4f}", "-t", f"{n / FPS + 0.5:.3f}", "-i", SRC, "-an",
                            "-vf", f"scale=1080:1920,fps={FPS}", "-frames:v", str(n), "-c:v", "libx264", "-preset", "fast",
                            "-crf", "17", "-g", "10", "-pix_fmt", "yuv420p", part], check=True)
            parts.append(part)
            seg = audio[int(s * sr):int(s * sr) + int(n / FPS * sr)].copy()
            fade = int(0.008 * sr)
            seg[:fade] *= np.linspace(0, 1, fade)
            seg[-fade:] *= np.linspace(1, 0, fade)
            seg *= ph.get("vol", 1.0)
            voice.append(seg)
            pieces.append({"from": frame, "to": frame + n, "phrase": pi, "k": k})
            frame += n
            k += 1
    subs.append({"from": f0, "to": frame, "text": ph["text"], "item": ph.get("item", "")})
    print(pi, round((frame - f0) / FPS, 2), ph["text"], flush=True)

lst = os.path.join(TMP, NAME + "_list.txt")
open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", "-movflags", "+faststart",
                os.path.join(PUB, NAME + "_cut.mp4")], check=True)
v = np.concatenate(voice)
loud = np.concatenate([x for x, ph in zip(voice, [cfg["phrases"][p["phrase"]] for p in pieces]) if not ph.get("raw")] or [v])
v = np.tanh(v / (np.percentile(np.abs(loud), 99.5) + 1e-9) * 1.1) * 0.85
sf.write(os.path.join(PUB, NAME + "_voice.wav"), v, sr)
json.dump({"name": NAME, "frames": frame, "title": cfg.get("title", ""), "pieces": pieces, "subs": subs}, open(OUT, "w"), indent=1)
print("total", round(frame / FPS, 2), "s,", len(parts), "pieces")
