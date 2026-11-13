"""Tiny phone-friendly editor for the morning-routine reel.

Serves a single page that edits src/routine.json (shots, order, lengths, product
texts), streams the proxy video for scrubbing, and re-renders the reel on demand.

usage: python server.py <source.mov> <music_python> [port]
"""
import json
import os
import subprocess
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SOURCE, MUSIC_PY = sys.argv[1], sys.argv[2]
PORT = int(sys.argv[3]) if len(sys.argv) > 3 else 8765
CFG = os.path.join(ROOT, "src", "routine.json")
FILES = {
    "/": (os.path.join(HERE, "index.html"), "text/html; charset=utf-8"),
    "/strip.mp4": (os.path.join(ROOT, "public", "morning_strip.mp4"), "video/mp4"),
    "/out.mp4": (os.path.join(ROOT, "out", "morning-edit.mp4"), "video/mp4"),
}
state = {"running": False, "step": "", "error": "", "done": 0}


def render():
    steps = [
        ("1/3 нарезка кадров из 4K", ["python3", "scripts/build_morning.py", SOURCE, CFG, "public/morning_routine.mp4", os.path.join(os.path.dirname(SOURCE), "segs_edit")]),
        ("2/3 музыка", [MUSIC_PY, "scripts/make_gym_music.py", CFG, "public/music_routine.wav"]),
        ("3/3 графика и финальный рендер", ["npx", "remotion", "render", "Routine", "out/morning-edit.mp4", "--log=error"]),
    ]
    try:
        for name, cmd in steps:
            state["step"] = name
            r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
            if r.returncode:
                raise RuntimeError((r.stderr or r.stdout)[-600:])
        state["done"] += 1
        state["error"] = ""
    except Exception as e:  # shown to the user in the page
        state["error"] = str(e)
    state["running"] = False
    state["step"] = ""


class H(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *a):
        pass

    def send_json(self, obj, code=200):
        body = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/api/config":
            return self.send_json(json.load(open(CFG)))
        if path == "/api/status":
            return self.send_json(state)
        if path not in FILES or not os.path.exists(FILES[path][0]):
            return self.send_json({"error": "not found"}, 404)
        fn, ctype = FILES[path]
        size = os.path.getsize(fn)
        start, end = 0, size - 1
        rng = self.headers.get("Range")
        if rng and rng.startswith("bytes="):
            a, _, b = rng[6:].partition("-")
            if a:
                start = int(a)
                end = min(int(b), size - 1) if b else size - 1
            elif b:
                start = max(0, size - int(b))
            self.send_response(206)
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        else:
            self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(end - start + 1))
        if path != "/strip.mp4":
            self.send_header("Cache-Control", "no-store")
        self.end_headers()
        try:
            with open(fn, "rb") as f:
                f.seek(start)
                left = end - start + 1
                while left > 0:
                    chunk = f.read(min(1 << 18, left))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    left -= len(chunk)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def do_POST(self):
        n = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(n) if n else b""
        if self.path == "/api/config":
            cfg = json.loads(body)
            assert isinstance(cfg.get("segments"), list) and cfg["segments"], "segments"
            tmp = CFG + ".tmp"
            json.dump(cfg, open(tmp, "w"), indent=1, ensure_ascii=False)
            os.replace(tmp, CFG)
            return self.send_json({"ok": True})
        if self.path == "/api/render":
            if not state["running"]:
                state.update(running=True, step="запуск", error="")
                threading.Thread(target=render, daemon=True).start()
            return self.send_json(state)
        self.send_json({"error": "not found"}, 404)


ThreadingHTTPServer(("0.0.0.0", PORT), H).serve_forever()
