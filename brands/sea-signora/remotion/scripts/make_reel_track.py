"""Arranged reel tracks for Sea, Signora (generated, royalty-free) — unlike make_music.py beds, these have a structure
that follows the edit: quiet bed under speech, risers, drops, a breakdown, impacts and whooshes on the cuts.

usage: python make_reel_track.py <out.mp3> <arrangement>
Arrangements are lists of (bars, section) at a fixed bpm; bar 0 starts at t = 0, so the edit can cut on exact bars.
"""
import os
import subprocess
import sys
import wave

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from make_music import SR, add, hz, kick, noise, reverb, tone  # noqa: E402

rng = np.random.default_rng(12)

# «UNO» — the birthday reel (124 bpm, 31 bars = 60.0 s): Antonio talks over the bed, drop on «cin cin»,
# a fill under the 19:30 card, breakdown under the 22:00 card and the cake, build as the shell opens, last drop, outro.
ARRANGEMENTS = {
    'uno': (124, [(5, 'intro'), (5, 'dropA'), (1, 'fill'), (7, 'dropB'), (4, 'groove'), (2, 'break'), (1, 'build'),
                  (4, 'dropC'), (2, 'outro')]),
    'finestre': (118, [(5, 'intro'), (6, 'groove'), (1, 'fill'), (6, 'dropB'), (5, 'groove'), (2, 'break'), (1, 'build'),
                       (3, 'dropC'), (2, 'outro')]),
}
CHORDS = [[45, 60, 64, 67, 72], [41, 60, 64, 69, 72], [36, 59, 64, 67, 71], [43, 59, 62, 67, 71]]  # Am F C G, warm


def clap(v=.2):
    x = sum(noise(v / 3, .03, .18) * (np.arange(int(.18 * SR)) > int(k * .011 * SR)) for k in range(3))
    return x


def riser(dur, v=.25):
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    # crude band sweep: mix of differentiated (bright) noise growing over time
    b = np.diff(np.concatenate([[0], x]))
    return v * (t / dur) ** 2 * (0.4 * x + 0.6 * b) * 0.5


def impact(v=.9):
    n = int(1.6 * SR); t = np.arange(n) / SR
    f = 38 + 60 * np.exp(-t / .07)
    return v * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .5)


def whoosh(dur=.35, v=.12):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.diff(np.concatenate([[0], rng.standard_normal(n)]))
    return v * x * np.sin(np.pi * t / dur) ** 2


def lowpass(x, a):
    y = np.zeros_like(x); acc = 0.0
    for i in range(0, len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y


def build(name):
    bpm, arr = ARRANGEMENTS[name]
    beat = 60 / bpm; bar = 4 * beat; step = beat / 4
    total = sum(b for b, _ in arr) * bar + 2.5
    n = int(total * SR)
    keys, low, dr, fx, arp, pad = (np.zeros(n) for _ in range(6))
    pump = np.ones(n)
    b0 = 0
    for bars, sec in arr:
        for k in range(bars):
            t = (b0 + k) * bar; i0 = int(t * SR)
            ch = CHORDS[(b0 + k) % 4]; root = ch[0]
            last = k == bars - 1
            full = sec in ('dropA', 'dropB', 'dropC')
            # pads everywhere except the fill bar
            if sec != 'fill':
                for m in ch[1:]:
                    add(pad, .05 * tone(hz(m), bar * 1.15, (1, .25, .08), 2.6, .35), i0)
            if sec in ('intro', 'break'):
                for s in range(2, 16, 4):
                    add(dr, noise(.025, .02), int((t + s * step) * SR))
            if sec in ('groove', 'dropA', 'dropB', 'dropC', 'outro', 'build', 'fill'):
                kicks = (0, 4, 8, 12) if sec != 'fill' else (0, 4)
                if sec != 'outro' or k == 0:
                    for s in kicks:
                        add(dr, kick(.55), int((t + s * step) * SR))
                        j = int((t + s * step) * SR); m = min(n, j + int(.22 * SR))
                        pump[j:m] = np.minimum(pump[j:m], 1 - .45 * np.exp(-np.arange(m - j) / SR / .09))
                if sec not in ('build', 'fill'):
                    for s in (4, 12):
                        add(dr, clap(.22), int((t + s * step) * SR))
                    for s in (2, 6, 10, 14):
                        add(dr, noise(.06, .07), int((t + s * step) * SR))
                    for s in range(1, 16, 2):
                        add(dr, noise(.035, .015), int((t + s * step) * SR))
                    for s in (2, 6, 10, 14):
                        add(low, .32 * tone(hz(root), step * 1.8, (1, .25), .4), int((t + s * step) * SR))
                for st in (0, 2.5):
                    for m in ch[1:]:
                        add(keys, .085 * tone(hz(m), beat * 1.6, (1, .35, .12), .5, .004, .12), int((t + st * beat) * SR))
            if full:
                hook = [ch[1] + 12, ch[3] + 12, ch[2] + 12, ch[4] + 12]
                for s in range(16):
                    if s % 3 == 2 and sec == 'dropA':
                        continue
                    add(arp, .07 * tone(hz(hook[s % 4] + (12 if sec == 'dropC' and s % 8 >= 4 else 0)), step * 1.6,
                                        (1, .6, .3, .15), .2, .001), int((t + s * step) * SR))
            if sec == 'build' or (sec == 'intro' and last):
                rs = riser(bar if sec == 'build' else bar * .75, .3)
                add(fx, rs, int((t + (0 if sec == 'build' else bar * .25)) * SR))
                for s in range(0, 16, 1 if sec == 'build' else 2):
                    if sec == 'intro' and s < 8:
                        continue
                    add(dr, noise(.05 + .08 * s / 16, .03, .1), int((t + s * step) * SR))
            if sec == 'fill':
                add(fx, riser(bar * .5, .22), int((t + bar * .5) * SR))
                for s in range(8, 16):
                    add(dr, noise(.05 + .06 * (s - 8) / 8, .03, .1), int((t + s * step) * SR))
            if sec == 'break' and last:
                add(fx, riser(bar, .18), i0)
        # impacts at the start of every drop and of the outro chord
        if sec in ('dropA', 'dropB', 'dropC'):
            add(fx, impact(.8), int(b0 * bar * SR))
            add(fx, noise(.18, .5, 1.5), int(b0 * bar * SR))
        if sec == 'outro':
            for m in CHORDS[0][1:]:
                add(keys, .12 * tone(hz(m), bar * 2, (1, .35, .12), 1.2, .004), int(b0 * bar * SR))
            add(fx, impact(.6), int(b0 * bar * SR))
        b0 += bars
    padl = lowpass(pad, .08)
    mix = reverb(keys, .3) * pump + reverb(padl, .5) * (0.6 + 0.4 * pump) + low * pump + dr + reverb(arp, .35) * pump + fx
    f = int(.05 * SR); mix[:f] *= np.linspace(0, 1, f)
    end = int((sum(b for b, _ in arr) * bar + 2.4) * SR); mix[end:] = 0
    mix[end - int(1.5 * SR):end] *= np.linspace(1, 0, int(1.5 * SR))
    mix = np.tanh(mix * 1.3)
    return mix * (10 ** (-16 / 20) / np.sqrt(np.mean(mix[:end] ** 2))), bar


if __name__ == '__main__':
    out, name = sys.argv[1], sys.argv[2]
    x, bar = build(name)
    x = np.clip(x, -.98, .98)
    st = np.stack([x, np.roll(x, 180)], 1)
    wav = out[:-4] + '.wav'
    with wave.open(wav, 'w') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-b:a', '256k', out], check=True)
    os.remove(wav)
    print('ok', name, ARRANGEMENTS[name][0], 'bpm, bar', round(bar, 4), 's')
