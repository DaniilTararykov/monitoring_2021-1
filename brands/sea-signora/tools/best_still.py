"""Sharpest frame of a clip window as a 1080x1920 JPG (for static creatives and photo slideshows).
Samples the window every 0.1 s, scores each frame by Laplacian variance (focus/motion blur) and
saves the best one at full size.
usage: python -I best_still.py <clip.mp4> <from_s> <to_s> <out.jpg>   (needs numpy, opencv)"""
import sys, subprocess
import cv2
import numpy as np

clip, a, b, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
W, H = 270, 480
raw = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-ss', str(a), '-t', str(b - a), '-i', clip,
                      '-vf', f'fps=10,scale={W}:{H},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W)
score = [cv2.Laplacian(f, cv2.CV_64F).var() for f in fr]
best = int(np.argmax(score))
t = a + best / 10
subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', clip, '-frames:v', '1',
                '-vf', 'scale=1080:1920:flags=lanczos', '-q:v', '2', out], check=True)
print(f'{out.split("/")[-1]}\tt={t:.2f}\tsharp={score[best]:.0f}\tmedian={np.median(score):.0f}')
