# usage: tilt.py footage.mp4 t1 t2 ... -> estimated roll (deg) per time, from near-vertical lines
import sys, cv2, numpy as np
cap = cv2.VideoCapture(sys.argv[1])
for t in map(float, sys.argv[2:]):
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
    ok, img = cap.read()
    g = cv2.cvtColor(cv2.resize(img, (540, 960)), cv2.COLOR_BGR2GRAY)
    e = cv2.Canny(cv2.GaussianBlur(g, (5, 5), 0), 50, 150)
    lines = cv2.HoughLinesP(e, 1, np.pi / 360, 80, minLineLength=140, maxLineGap=8)
    devs, ws = [], []
    for x1, y1, x2, y2 in (lines.reshape(-1, 4) if lines is not None else []):
        a = np.degrees(np.arctan2(x2 - x1, y2 - y1))  # 0 = vertical
        a = (a + 90) % 180 - 90
        if abs(a) < 12:
            cx = (x1 + x2) / 2
            w = np.hypot(x2 - x1, y2 - y1) * (1 - abs(cx - 270) / 300)  # trust centre lines more (wide-angle distortion)
            devs.append(a); ws.append(max(w, 1))
    if devs:
        o = np.argsort(devs); d = np.array(devs)[o]; w = np.array(ws)[o]; c = np.cumsum(w)
        med = d[np.searchsorted(c, c[-1] / 2)]
        print(f"{t:6.1f}s  lines={len(devs):3d}  roll={med:+.1f}deg")
    else:
        print(f"{t:6.1f}s  no vertical lines")
