"""Cut the morning-routine source into one 1080x1200 file per src/morning.json.

Each segment is taken straight from the 4K source (mirrored selfie flipped back),
cropped 9:10 around `cx`, optionally sped up, and trimmed to whole frames so cuts land on the beat.

usage: python build_morning.py <source.mov> <morning.json> <out.mp4> <tmp_dir>
"""
import json
import os
import subprocess
import sys

SRC, CFG, OUT, TMP = sys.argv[1:5]
cfg = json.load(open(CFG))
FPS = 30
beat = 60 / cfg["bpm"]
W, H = cfg["source"]["w"], cfg["source"]["h"]
cw = int(H * 9 / 10) // 2 * 2  # 9:10 window, the lower part of the reel is a text panel
os.makedirs(TMP, exist_ok=True)
t = 0.0
parts = []
for i, s in enumerate(cfg["segments"]):
    f0, f1 = round(t * FPS), round((t + s["beats"] * beat) * FPS)
    t += s["beats"] * beat
    n = f1 - f0
    sp = s.get("speed", 1)
    x = int(min(max((1 - s["cx"]) * W - cw / 2, 0), W - cw))  # cx is given in flipped coordinates
    part = os.path.join(TMP, f"seg{i:02d}.mp4")
    vf = f"crop={cw}:{H}:{x}:0,hflip,scale=1080:1200,setpts=PTS/{sp},fps={FPS}"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(s["src"]), "-t", str(n / FPS * sp + 0.5), "-i", SRC, "-an",
                    "-vf", vf, "-frames:v", str(n), "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-g", "10",
                    "-pix_fmt", "yuv420p", part], check=True)
    parts.append(part)
    print(i, n, flush=True)
lst = os.path.join(TMP, "list.txt")
open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", "-movflags", "+faststart", OUT], check=True)
