"""Talking cut with independent picture: voice lines (pauses removed) with either their
own synced picture or other shots laid over them (L-cuts), plus wordless shots.

Each segment of the JSON list:
  {"a": [[s, e], ...], "raw": bool, "vol": float,
   "v": [{"sync": k} | {"src": t, "dur": d}, ...]}
- "a": source ranges for the sound; pauses are removed unless "raw".
- "v": picture for the segment. {"sync": k} shows the picture of the first k sound pieces in sync;
  {"src": t, "dur": d} shows other footage from t (voice-over); {"lip": d} returns to his own synced picture
  for d seconds wherever the voice has got to; the last item stretches to fill the segment.
  Either may end at a sound piece instead: "upto": k runs until the sound of range k starts.
  Footage items may add "speed": k (k times faster) and "rev": true (played backwards).
  Without "v" every sound piece shows its own picture.
- "breathe": keep a little air before the first word and after the last one (up to the range ends).
- "file": "intro" reads the segment from the intro clip (fifth argument).
Set DRY=1 to print the running time without rendering, AUDIO=1 to write only the voice track to <out>.

usage: python build_looks2.py <source.mov> <edit.json> <tmp_dir> <out.mp4> [intro.mov]
"""
import json
import os
import subprocess
import sys

import numpy as np
import soundfile as sf

SRC, CFG, TMP, OUT = sys.argv[1:5]
INTRO = sys.argv[5] if len(sys.argv) > 5 else None  # segments with "file": "intro" read from here
FPS = 30
NAME = os.path.splitext(os.path.basename(OUT))[0]
os.makedirs(TMP, exist_ok=True)
wav = os.path.join(TMP, "full48.wav")
if not os.path.exists(wav):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-vn", "-ac", "1", "-ar", "48000", wav], check=True)
audio, sr = sf.read(wav, dtype="float32")
AUD = {"main": audio}
SRCS = {"main": SRC, "intro": INTRO}
if INTRO:
    iw = os.path.join(TMP, "intro48.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", INTRO, "-vn", "-ac", "1", "-ar", "48000", iw], check=True)
    AUD["intro"] = sf.read(iw, dtype="float32")[0]


def speech(a, b, f="main"):
    audio = AUD[f]
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


shots, sound, loud, timeline = [], [], [], []


def clip(s, n, f="main"):
    audio = AUD[f]
    seg = audio[int(s * sr):int(s * sr) + int(n / FPS * sr)].copy()
    f = int(0.008 * sr)
    seg[:f] *= np.linspace(0, 1, f)
    seg[-f:] *= np.linspace(1, 0, f)
    return seg


for seg in json.load(open(CFG)):
    f = seg.get("file", "main")
    pieces, first = [], []  # first[k]: index of the first piece cut from range k
    for a, b in seg["a"]:
        first.append(len(pieces))
        for s, e in ([[a, b]] if seg.get("raw") else speech(a, b, f)):
            s = round(s * FPS) / FPS
            pieces.append((f, s, max(3, round((e - s) * FPS))))
    if seg.get("breathe") and pieces and not seg.get("raw"):
        # let the sentence land: a little air before the first word and after the last one,
        # never past the range the edit list gives (those ends sit before the next word)
        f0, s0, n0 = pieces[0]
        ns = max(round(seg["a"][0][0] * FPS) / FPS, round((s0 - 0.12) * FPS) / FPS)
        pieces[0] = (f0, ns, n0 + round((s0 - ns) * FPS))
        f1, s1, n1 = pieces[-1]
        ne = min(seg["a"][-1][1], s1 + n1 / FPS + 0.30)
        pieces[-1] = (f1, s1, max(n1, round((ne - s1) * FPS)))
    total = sum(n for _, _, n in pieces)
    timeline.append((sum(x[2] for x in shots) / FPS, total / FPS, seg["a"][0][0], f))
    for _, s, n in pieces:
        c = clip(s, n, f) * seg.get("vol", 1.0)
        sound.append(c)
        if not seg.get("raw"):
            loud.append(c)
    v = seg.get("v")
    if not v:
        shots += pieces
        continue
    offs, o = [], 0
    for _, _, pn in pieces:
        offs.append(o)
        o += pn

    def synced(start, n):  # the pieces' own picture for output frames [start, start + n) of this segment
        out = []
        for (pf, ps, pn), po in zip(pieces, offs):
            a, b = max(start, po), min(start + n, po + pn)
            if b > a:
                out.append((pf, ps + (a - po) / FPS, b - a))
        return out

    used = 0
    for k, item in enumerate(v):
        last = k == len(v) - 1
        if "sync" in item:
            for pf, s, n in pieces[: item["sync"]]:
                shots.append((pf, s, n))
                used += n
        elif "lip" in item:  # back to his own synced picture wherever the voice has got to
            n = total - used if last else min(round(item["lip"] * FPS), total - used)
            if "upto" in item:  # ...until the k-th sound piece starts
                n = offs[first[item["upto"]]] - used
            if n > 0:
                shots += synced(used, n)
                used += n
        else:
            n = total - used if last else min(round(item["dur"] * FPS), total - used)
            if "upto" in item:  # footage until the k-th sound piece starts (that piece is then back in sync)
                n = offs[first[item["upto"]]] - used
            if n > 0:
                shots.append((item.get("file", "main"), item["src"], n, item.get("speed", 1.0), item.get("rev", False)))
                used += n
    assert used == total, (seg, used, total)

if os.environ.get("AUDIO"):  # voice only, to check the words before rendering any picture
    v = np.concatenate(sound)
    sf.write(OUT, v / (np.abs(v).max() + 1e-9) * 0.9, sr)
    print("total", round(len(v) / sr, 2), "s")
    sys.exit()
if os.environ.get("DRY"):
    for t0, d, a0, f in timeline:
        print(f"{t0:7.2f} +{d:5.2f}  {f} {a0}")
    print("total", round(sum(x[2] for x in shots) / FPS, 2), "s,", len(shots), "shots")
    sys.exit()
parts = []
for i, shot in enumerate(shots):
    f, s, n = shot[:3]
    sp, rev = (shot[3], shot[4]) if len(shot) > 3 else (1.0, False)
    part = os.path.join(TMP, f"{NAME}_p{i:03d}.mp4")
    # speed: read sp times as much footage; rev: play it backwards (scaled first, so it fits in memory)
    vf = f"trim=end={n * sp / FPS:.4f},setpts=PTS-STARTPTS,scale=1080:1920" + (",reverse" if rev else "") \
        + (f",setpts=PTS/{sp}" if sp != 1.0 else "") + f",fps={FPS}"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.4f}", "-t", f"{n * sp / FPS + 0.5:.3f}", "-i", SRCS[f], "-an",
                    "-vf", vf, "-frames:v", str(n), "-c:v", "libx264", "-preset", "fast",
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
dur = sum(x[2] for x in shots) / FPS
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", vid, "-i", voice, "-c:v", "libx264", "-preset", "medium", "-crf", "18",
                "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", OUT], check=True)
print("total", round(dur, 2), "s,", len(shots), "shots")
