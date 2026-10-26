"""Original instrumental beds for Sea, Signora stories (generated, royalty-free).
Fallback when the Abracadabrax AI Background Music Generator plugin is not connected.
usage: python make_music.py <out_dir> [track ...]   (needs numpy; ffmpeg for mp3)"""
import sys, os, subprocess, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def tone(f, dur, harm=(1, .35, .12), decay=.6, attack=.005, trem=0.0):
    n = int(dur * SR); t = np.arange(n) / SR
    w = sum(a * np.sin(2 * np.pi * f * (k + 1) * t) * np.exp(-t * k / max(decay, .05)) for k, a in enumerate(harm))
    if trem: w *= 1 + trem * np.sin(2 * np.pi * 4.5 * t)
    return w * env(n, attack, dur * decay)


INSTR = {
    'epiano': lambda f, d: tone(f, d, (1, .35, .12), .55, .005, .15),
    'piano': lambda f, d: tone(f, d, (1, .5, .25, .1), .45, .002),
    'pluck': lambda f, d: tone(f, d, (1, .6, .3, .15, .08), .18, .001),
    'pad': lambda f, d: tone(f, d, (1, .2, .05), 2.5, .6),
    'vibes': lambda f, d: tone(f, d, (1, 0, .25), .9, .002, .3),
}


def kick(v=.55):
    n = int(.35 * SR); t = np.arange(n) / SR
    f = 50 + 70 * np.exp(-t / .04)
    return v * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .12)


def noise(v, d, n=.12):
    x = rng.standard_normal(int(n * SR)); x = np.diff(np.concatenate([[0], x]))
    return v * x * np.exp(-np.arange(len(x)) / SR / d)


def rim(v=.18):
    n = int(.08 * SR); t = np.arange(n) / SR
    return v * np.sin(2 * np.pi * 1700 * t) * np.exp(-t / .012)


def add(buf, x, i):
    if i >= len(buf) or i < 0: return
    j = min(len(buf), i + len(x)); buf[i:j] += x[:j - i]


def reverb(x, mix=.3):
    y = x.copy()
    for dl, g in [(.031, .5), (.047, .45), (.071, .4), (.113, .35), (.167, .3), (.229, .25)]:
        k = int(dl * SR); z = np.zeros_like(x)
        for r in range(1, 5):
            if k * r < len(x): z[k * r:] += x[:-k * r] * g ** r
        y += z * mix / 2
    return y


# drum grids: (step in 16ths, sound)
DRUMS = {
    'none': [],
    'house': [(s, 'k') for s in (0, 4, 8, 12)] + [(s, 'oh') for s in (2, 6, 10, 14)] + [(s, 'h') for s in range(1, 16, 2)] + [(4, 'c'), (12, 'c')],
    'minimal': [(0, 'k'), (8, 'k'), (6, 'r'), (14, 'r')] + [(s, 'h') for s in (2, 6, 10, 14)],
    'swing': [(0, 'k'), (8, 'k')] + [(s, 'h') for s in (0, 4, 7, 8, 12, 15)] + [(4, 'r'), (12, 'r')],
    'bossa': [(0, 'k'), (6, 'k'), (8, 'k'), (14, 'k')] + [(s, 'r') for s in (0, 3, 6, 10, 12)] + [(s, 'h') for s in range(0, 16, 2)],
}

# name: bpm, instrument, drums, bass style, chord progression [bass, tones...], vibe
TRACKS = {
    'noir-jazz': (84, 'epiano', 'swing', 'walk', [[38, 60, 65, 69, 72], [43, 59, 65, 69, 74], [36, 59, 64, 67, 71], [45, 61, 64, 67, 72]],
                  'late-night Brera jazz bar, brushed swing, Rhodes'),
    'marble-minimal': (100, 'piano', 'minimal', 'pulse', [[45, 64, 69, 72, 76], [41, 64, 69, 72, 77], [43, 62, 67, 71, 74], [40, 64, 67, 71, 76]],
                       'fine-dining minimal piano pulse, sparse and precise'),
    'aquarium-ambient': (64, 'pad', 'none', 'drone', [[38, 62, 66, 69, 76], [43, 62, 67, 71, 74], [40, 64, 67, 71, 78], [45, 61, 64, 69, 76]],
                         'underwater ambient pads for slow motion, no drums'),
    'brera-house': (122, 'epiano', 'house', 'offbeat', [[45, 60, 64, 67, 72], [41, 60, 64, 69, 72], [36, 59, 64, 67, 71], [43, 59, 62, 67, 71]],
                    'deep house, warm and busy Friday night'),
    'italo-arp': (116, 'pluck', 'house', 'octave', [[45, 64, 69, 72, 76], [40, 64, 67, 71, 76], [41, 65, 69, 72, 77], [43, 62, 67, 71, 74]],
                  'italo-disco arpeggio, glamorous, a bit cheeky'),
    'bossa-sea': (128, 'vibes', 'bossa', 'bossa', [[41, 64, 67, 69, 72], [40, 62, 65, 69, 74], [38, 60, 65, 69, 72], [43, 59, 65, 67, 71]],
                  'bossa nova with vibraphone, sunny weekend in the city'),
    'velvet-strings': (90, 'pad', 'minimal', 'drone', [[36, 60, 64, 67, 71], [33, 60, 64, 69, 72], [41, 60, 65, 69, 72], [43, 62, 65, 67, 71]],
                       'cinematic velvet strings, slow build, elegant tension'),
}


def track(name, length=26):
    bpm, inst, drums, bass_style, chords, _ = TRACKS[name]
    beat = 60 / bpm; step = beat / 4; bar = 4 * beat
    n = int(length * SR); keys = np.zeros(n); low = np.zeros(n); dr = np.zeros(n)
    play = INSTR[inst]
    b = 0; t = 0.0
    while t < length:
        ch = chords[b % len(chords)]
        root = ch[0]
        if inst in ('pluck',):  # arpeggio 16ths
            for s in range(16):
                add(keys, .09 * play(hz(ch[1 + s % 4] + (12 if s % 8 >= 4 else 0)), step * 2), int((t + s * step) * SR))
        elif inst == 'pad':
            for m in ch[1:]: add(keys, .07 * play(hz(m), bar * 1.1), int(t * SR))
        elif inst == 'piano':
            for s in (0, 3, 6, 10, 12):
                add(keys, .08 * play(hz(ch[1 + (s // 3) % 4]), beat * 1.5), int((t + s * step) * SR))
        else:  # chord stabs
            for st in ((0, 2.5) if drums != 'bossa' else (0, 1.5, 3)):
                for m in ch[1:]: add(keys, .1 * play(hz(m), beat * 2), int((t + st * beat) * SR))
        bl = INSTR['epiano']
        if bass_style == 'walk':
            for q, iv in enumerate((0, 4, 7, 10)): add(low, .28 * tone(hz(root + iv - 12 + 12), beat * .9, (1, .2), .5), int((t + q * beat) * SR))
        elif bass_style == 'pulse':
            for s in range(0, 16, 2): add(low, .2 * tone(hz(root), step * 1.6, (1, .1), .4), int((t + s * step) * SR))
        elif bass_style == 'drone':
            add(low, .22 * tone(hz(root - 12 + 12), bar * 1.05, (1, .15), 3, .3), int(t * SR))
        elif bass_style == 'offbeat':
            for s in (2, 6, 10, 14): add(low, .3 * tone(hz(root), step * 1.8, (1, .2), .4), int((t + s * step) * SR))
        elif bass_style == 'octave':
            for s in range(0, 16, 2): add(low, .24 * tone(hz(root + (12 if s % 4 else 0)), step * 1.5, (1, .2), .3), int((t + s * step) * SR))
        elif bass_style == 'bossa':
            for s, iv in ((0, 0), (6, 7), (8, 0), (14, 7)): add(low, .28 * tone(hz(root + iv), step * 3, (1, .2), .5), int((t + s * step) * SR))
        for s, kind in DRUMS[drums]:
            i = int((t + s * step + (step * .33 if drums == 'swing' and s % 4 == 3 else 0)) * SR)
            add(dr, {'k': kick(.5), 'h': noise(.04, .015), 'oh': noise(.05, .06), 'c': noise(.12, .05, .2), 'r': rim()}[kind], i)
        t += bar; b += 1
    mix = reverb(keys, .45 if inst == 'pad' else .3) + low + dr
    f = int(.8 * SR); mix[:f] *= np.linspace(0, 1, f); mix[-2 * f:] *= np.linspace(1, 0, 2 * f)
    mix = np.tanh(mix * 1.2)
    return mix * (10 ** (-18 / 20) / np.sqrt(np.mean(mix ** 2)))


if __name__ == '__main__':
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    for name in (sys.argv[2:] or TRACKS):
        x = np.clip(track(name), -.98, .98)
        st = np.stack([x, np.roll(x, 220)], 1)
        wav = os.path.join(out, name + '.wav')
        with wave.open(wav, 'w') as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-b:a', '128k', os.path.join(out, name + '.mp3')], check=True)
        os.remove(wav); print('ok', name, TRACKS[name][0], 'bpm —', TRACKS[name][5])
