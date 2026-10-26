"""Rank the steadiest windows in clips (handheld shake = high frame-to-frame difference).
usage: python -I motion_scan.py <window_s> clip1.mp4 [clip2.mp4 ...]
prints: clip  best_start  score  (lower score = steadier); and overall clip score."""
import sys, subprocess, numpy as np

win = float(sys.argv[1]); W, H, FPS = 48, 85, 10
for clip in sys.argv[2:]:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', clip, '-vf', f'fps={FPS},scale={W}:{H},format=gray', '-f', 'rawvideo', '-'],
                         capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
    if len(fr) < 3: continue
    d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))  # per-step motion
    n = int(win * FPS)
    if len(d) <= n:
        print(f'{clip.split("/")[-1]}\tstart=0.0\tscore={d.mean():.2f}\tclip={d.mean():.2f}\tlen={len(fr)/FPS:.1f}s'); continue
    cs = np.convolve(d, np.ones(n) / n, 'valid')
    i = int(cs.argmin())
    print(f'{clip.split("/")[-1]}\tstart={i/FPS:.1f}\tscore={cs[i]:.2f}\tclip={d.mean():.2f}\tlen={len(fr)/FPS:.1f}s')
