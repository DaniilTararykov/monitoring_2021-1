# Crops a round-avatar source square around each student's face from the proxy.
# Usage: python3 avatars.py PROXY_DIR OUT_DIR
import subprocess, sys, pathlib
from build import STUDENTS

proxy, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
SIZE = 420
for sid, st in STUDENTS.items():
    x, y = st["face"]
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", "20", "-i", str(proxy / f"{st['file']}.mp4"),
                    "-frames:v", "1", "-vf", f"crop={SIZE}:{SIZE}:{x - SIZE // 2}:{y - SIZE // 2},scale=200:200",
                    str(out / f"{sid}.jpg")], check=True)
    print(sid)
