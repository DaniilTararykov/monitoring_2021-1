"""Pro editing helpers for Sea, Signora reels and stories (run with the venv that has opencv, librosa, scenedetect, pyloudnorm).

usage:
  python tools/pro_edit.py scenes  <video>                 hard cuts in a clip (PySceneDetect), one time per line
  python tools/pro_edit.py beats   <audio> [--every 2]     beat grid of a track (librosa): cut points for beat-synced edits
  python tools/pro_edit.py steady  <video> [--win 3]       steadiest, sharpest window of <win> s (camera shake + blur), start time
  python tools/pro_edit.py loud    <in.mp4> <out.mp4>      master audio to −14 LUFS (Instagram, two-pass loudnorm), video copied
  python tools/pro_edit.py grade   <in.mp4> <out.mp4> [warm|clean|night]   brand grade presets (ffmpeg), audio copied
"""
import subprocess
import sys

GRADES = {
    # warm candlelight, a touch of contrast — the default look of the account
    'warm': 'eq=contrast=1.06:saturation=1.08:brightness=0.015,colorbalance=rm=0.03:gm=0.0:bm=-0.02:rh=0.02:bh=-0.02',
    # «clean vibe»: neutral whites, less red from the curtains, light lift
    'clean': 'eq=contrast=1.04:saturation=1.04:brightness=0.02,colorbalance=rs=-0.03:bs=0.01:rh=-0.02',
    # dark room at night: deeper blacks, keep the aquarium blue
    'night': 'eq=contrast=1.1:saturation=1.05:brightness=-0.01:gamma=0.95,colorbalance=bs=0.02:rh=0.02',
}


def arg(name, default):
    a = sys.argv
    return type(default)(a[a.index(name) + 1]) if name in a else default


def scenes(path):
    from scenedetect import ContentDetector, detect
    for start, _ in detect(path, ContentDetector(threshold=27))[1:]:
        print(f'{start.seconds:.2f}')


def beats(path, every=1):
    import librosa
    y, sr = librosa.load(path, sr=None, mono=True)
    tempo, frames = librosa.beat.beat_track(y=y, sr=sr)
    times = librosa.frames_to_time(frames, sr=sr)[::every]
    import numpy as np
    print(f'bpm {float(np.atleast_1d(tempo)[0]):.1f}')
    print(' '.join(f'{t:.2f}' for t in times))


def _frames(path, step):
    import cv2
    cap = cv2.VideoCapture(path); fps = cap.get(cv2.CAP_PROP_FPS) or 30; i = 0
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        if i % max(1, int(fps * step)) == 0:
            yield i / fps, fr
        i += 1


def steady(path, win=3.0):
    import cv2
    import numpy as np
    t, shift, sharp, prev = [], [], [], None
    for ts, fr in _frames(path, 1 / 10):
        g = cv2.cvtColor(cv2.resize(fr, (270, 480)), cv2.COLOR_BGR2GRAY).astype(np.float32)
        sharp.append(cv2.Laplacian(g, cv2.CV_32F).var())
        shift.append(0 if prev is None else sum(v * v for v in cv2.phaseCorrelate(prev, g)[0]) ** 0.5)
        t.append(ts); prev = g
    n = max(1, int(win * 10)); best = None
    for a in range(0, max(1, len(t) - n)):
        score = np.log(np.mean(sharp[a:a + n]) + 1) - 1.2 * np.mean(shift[a:a + n])
        if best is None or score > best[0]:
            best = (score, t[a])
    print(f'{best[1]:.2f}')


def loud(src, out):
    import json
    target = 'I=-14:TP=-1.5:LRA=11'
    r = subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-i', src, '-af', f'loudnorm={target}:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
    af = (f"loudnorm={target}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', src, '-c:v', 'copy', '-af', af, '-ar', '48000',
                    '-c:a', 'aac', '-b:a', '192k', out], check=True)


def grade(src, out, preset='warm'):
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', src, '-vf', GRADES[preset], '-c:v', 'libx264', '-preset', 'medium',
                    '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'copy', out], check=True)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'scenes':
        scenes(sys.argv[2])
    elif cmd == 'beats':
        beats(sys.argv[2], arg('--every', 1))
    elif cmd == 'steady':
        steady(sys.argv[2], arg('--win', 3.0))
    elif cmd == 'loud':
        loud(sys.argv[2], sys.argv[3])
    elif cmd == 'grade':
        grade(sys.argv[2], sys.argv[3], sys.argv[4] if len(sys.argv) > 4 else 'warm')
    else:
        sys.exit(__doc__)
