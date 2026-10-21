"""Procedural sound effects for the chest Reels.

All sounds are synthesized from noise and oscillators, so there are no
third-party samples or licenses involved.

usage: python make_sfx.py <out_dir>
"""
import os
import sys
import wave

import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def t_axis(dur):
    return np.arange(int(SR * dur)) / SR


def noise(dur):
    return rng.standard_normal(int(SR * dur))


def onepole_lp(x, cutoff):
    """One-pole low-pass; cutoff may be a scalar or a per-sample array."""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def bandpass(x, lo, hi):
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    spec[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(spec, len(x))


def env_ad(n, attack, decay_tau):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-np.maximum(t - attack, 0) / decay_tau)


def fade(x, fin=0.005, fout=0.02):
    n_in, n_out = int(SR * fin), int(SR * fout)
    x = x.copy()
    if n_in:
        x[:n_in] *= np.linspace(0, 1, n_in)
    if n_out:
        x[-n_out:] *= np.linspace(1, 0, n_out)
    return x


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1
    return x / m * peak


def stereo(x, pan=None):
    """pan: scalar or per-sample array in [-1, 1]."""
    if pan is None:
        return np.stack([x, x], 1)
    pan = np.broadcast_to(pan, x.shape)
    left = x * np.cos((pan + 1) * np.pi / 4)
    right = x * np.sin((pan + 1) * np.pi / 4)
    return np.stack([left, right], 1) * np.sqrt(2)


def write(path, x):
    if x.ndim == 1:
        x = stereo(x)
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# --- effects -----------------------------------------------------------------

def whoosh(dur=0.55):
    t = t_axis(dur)
    p = t / dur
    bell = np.sin(np.pi * p) ** 2.2
    cutoff = 300 + 5200 * np.sin(np.pi * p) ** 1.5
    x = onepole_lp(noise(dur), cutoff) * bell
    x += 0.15 * np.sin(2 * np.pi * (90 + 120 * p) * t) * bell
    return stereo(fade(norm(x, 0.8)), pan=np.linspace(-0.7, 0.7, len(t)))


def lock_click():
    dur = 0.45
    t = t_axis(dur)
    out = np.zeros_like(t)

    def clack(at, gain):
        n = len(t) - int(at * SR)
        tt = np.arange(n) / SR
        body = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt / d)
                   for f, d in [(2150, 0.035), (3420, 0.022), (5230, 0.012), (1380, 0.05)])
        hit = rng.standard_normal(n) * np.exp(-tt / 0.003)
        thump = np.sin(2 * np.pi * 140 * tt) * np.exp(-tt / 0.03)
        out[int(at * SR):] += gain * (0.5 * body + 0.8 * hit + 0.6 * thump)

    clack(0.0, 0.55)
    clack(0.075, 1.0)
    return fade(norm(out, 0.95), 0.0005, 0.05)


def rewind(dur=0.85):
    t = t_axis(dur)
    p = t / dur
    freq = 260 + 2600 * p ** 1.6
    flutter = 1 + 0.04 * np.sin(2 * np.pi * 23 * t)
    phase = 2 * np.cumsum(np.pi * freq * flutter / SR)
    saw = 2 * ((phase / (2 * np.pi)) % 1) - 1
    tone = onepole_lp(saw, 3500) * 0.5
    hiss = bandpass(noise(dur), 1500, 9000) * 0.35
    chop = 0.65 + 0.35 * np.sign(np.sin(2 * np.pi * (14 + 30 * p) * t))
    x = (tone + hiss) * chop * np.minimum(1, p * 8) * (1 - p ** 6)
    return fade(norm(x, 0.7))


def pop():
    dur = 0.12
    t = t_axis(dur)
    f = 900 * np.exp(-t / 0.02) + 260
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(t), 0.001, 0.03)
    x += 0.3 * rng.standard_normal(len(t)) * np.exp(-t / 0.002)
    return fade(norm(x, 0.75), 0.0005)


def sanding(dur=2.5, rate=2.6):
    t = t_axis(dur)
    x = bandpass(noise(dur), 1200, 7500)
    grit = bandpass(noise(dur), 300, 1400) * 0.4
    stroke = np.abs(np.sin(np.pi * rate * t + 0.3 * np.sin(2 * np.pi * 0.7 * t))) ** 0.6
    jitter = onepole_lp(np.abs(noise(dur)), 30) * 2
    x = (x + grit) * stroke * (0.7 + 0.3 * np.clip(jitter, 0, 1))
    return fade(norm(x, 0.8), 0.05, 0.15)


def spray(dur=1.3):
    t = t_axis(dur)
    x = bandpass(noise(dur), 2500, 14000)
    e = np.minimum(1, t / 0.04) * np.minimum(1, (dur - t) / 0.18)
    x *= e * (0.9 + 0.1 * np.sin(2 * np.pi * 9 * t))
    hiss_start = rng.standard_normal(len(t)) * np.exp(-t / 0.01) * 0.6
    return fade(norm(x + bandpass(hiss_start, 800, 6000), 0.7))


def tape_rip(dur=0.7):
    t = t_axis(dur)
    p = t / dur
    density = 400 + 2600 * np.sin(np.pi * p) ** 0.8
    impulses = (rng.random(len(t)) < density / SR) * rng.uniform(0.3, 1, len(t))
    crackle = np.convolve(impulses, np.exp(-np.arange(80) / 12), mode="same")
    body = bandpass(noise(dur), 900, 6000) * 0.25
    x = (crackle + body) * np.sin(np.pi * p) ** 0.5
    return stereo(fade(norm(x, 0.85)), pan=np.linspace(0.4, -0.4, len(t)))


def roller(dur=1.6):
    t = t_axis(dur)
    x = bandpass(noise(dur), 180, 1600)
    squish = 0.6 + 0.4 * np.sin(2 * np.pi * 3.2 * t) ** 2
    sticky = (rng.random(len(t)) < 120 / SR).astype(float)
    sticky = np.convolve(sticky, np.exp(-np.arange(300) / 60), mode="same")
    x = x * squish + bandpass(sticky, 400, 3000) * 2
    return fade(norm(x, 0.6), 0.08, 0.2)


def tick():
    dur = 0.06
    t = t_axis(dur)
    x = (np.sin(2 * np.pi * 3100 * t) + 0.5 * np.sin(2 * np.pi * 5200 * t)) * np.exp(-t / 0.006)
    return fade(norm(x, 0.6), 0.0003)


def riser(dur=4.0):
    t = t_axis(dur)
    p = t / dur
    x = onepole_lp(noise(dur), 400 + 9000 * p ** 2) * p ** 2
    f = 110 * 2 ** (3 * p)
    x += 0.35 * np.sin(2 * np.pi * np.cumsum(f) / SR) * p ** 1.5
    return fade(norm(x, 0.7), 0.1, 0.004)


def impact():
    dur = 1.6
    t = t_axis(dur)
    f = 70 * np.exp(-t / 0.4) + 38
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.45)
    air = onepole_lp(noise(dur), 900) * np.exp(-t / 0.15)
    return fade(norm(boom + 0.6 * air, 0.85), 0.001, 0.2)


def shimmer(dur=1.4):
    t = t_axis(dur)
    x = np.zeros_like(t)
    for _ in range(26):
        at = rng.uniform(0, dur * 0.6)
        f = rng.uniform(2400, 7200)
        tt = np.clip(t - at, 0, None)
        x += np.sin(2 * np.pi * f * tt) * np.exp(-tt / rng.uniform(0.08, 0.3)) * (t >= at)
    return stereo(fade(norm(x, 0.45)), pan=np.sin(2 * np.pi * 0.8 * t) * 0.6)


def rec_beep():
    dur = 0.14
    t = t_axis(dur)
    x = np.sin(2 * np.pi * 1000 * t) * np.minimum(1, t / 0.004)
    return fade(norm(x, 0.45), 0.002, 0.02)


def brush(dur=1.5):
    t = t_axis(dur)
    x = bandpass(noise(dur), 2000, 9000)
    stroke = np.abs(np.sin(np.pi * 1.6 * t)) ** 1.5
    return fade(norm(x * stroke, 0.45), 0.05, 0.15)


def swell(dur=1.8):
    """Reverse-cymbal style swell for the before/after wipe."""
    t = t_axis(dur)
    p = t / dur
    x = bandpass(noise(dur), 3000, 15000) * p ** 3
    return fade(norm(x, 0.6), 0.05, 0.003)


SFX = {
    "whoosh": whoosh,
    "lock_click": lock_click,
    "rewind": rewind,
    "pop": pop,
    "sanding": sanding,
    "spray": spray,
    "tape_rip": tape_rip,
    "roller": roller,
    "tick": tick,
    "riser": riser,
    "impact": impact,
    "shimmer": shimmer,
    "rec_beep": rec_beep,
    "brush": brush,
    "swell": swell,
}

if __name__ == "__main__":
    out_dir = sys.argv[1]
    os.makedirs(out_dir, exist_ok=True)
    for name, fn in SFX.items():
        write(os.path.join(out_dir, f"{name}.wav"), fn())
        print(name)
