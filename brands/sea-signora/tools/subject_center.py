"""Vertical centre of the subject (plate, candle, hands) for half-frame split crops.
Uses gradient energy (detail) averaged over a few frames; prints fy% for object-position
so a 1080x960 window of a 1080x1920 clip is centred on the subject.
usage: python -I subject_center.py <dir> clip:start:dur [clip:start:dur ...]"""
import sys, subprocess, numpy as np
d = sys.argv[1]
for spec in sys.argv[2:]:
    name, st, du = spec.split(':')
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', st, '-t', du, '-i', f'{d}/{name}', '-vf', 'fps=4,scale=108:192,format=gray',
                          '-f', 'rawvideo', '-'], capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, 192, 108).astype(np.float32)
    g = np.abs(np.diff(fr, axis=1))[:, :, :].mean(0)[:, :] + 0  # vertical gradient
    h = np.abs(np.diff(fr, axis=2)).mean(0)[:-1, :]
    e = (g[:, :-1] + h).mean(1)  # energy per row (191)
    e = np.convolve(e, np.ones(15) / 15, 'same')
    rows = np.arange(len(e))
    c = (rows * e).sum() / e.sum() * (1920 / 192)  # px in 1920 space
    # best 960 window by energy
    win = 96
    cs = np.convolve(e, np.ones(win), 'valid'); best = cs.argmax() + win / 2
    c2 = best * 10
    cc = 0.5 * c + 0.5 * c2
    fy = min(100, max(0, (cc - 480) / 960 * 100))
    print(f'{name}:{st} fy={fy:.0f}')
