"""Original lounge beds for Sea, Signora stories (royalty-free, generated).
usage: python make_music.py <out_dir>   (needs numpy; ffmpeg for mp3)"""
import sys, os, subprocess, wave
import numpy as np

SR = 44100

def note(n):  # midi -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)

def env(n, a, d):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
    return e

def epiano(f, dur, vel=0.25):
    n = int(dur * SR); t = np.arange(n) / SR
    w = (np.sin(2*np.pi*f*t) + 0.35*np.sin(2*np.pi*2*f*t)*np.exp(-t/0.4)
         + 0.12*np.sin(2*np.pi*3*f*t)*np.exp(-t/0.2))
    w *= 1 + 0.15*np.sin(2*np.pi*4.5*t)  # tremolo
    return vel * w * env(n, 0.005, dur*0.55)

def bass(f, dur, vel=0.35):
    n = int(dur * SR); t = np.arange(n) / SR
    w = np.sin(2*np.pi*f*t) + 0.2*np.sin(2*np.pi*2*f*t)
    return vel * w * env(n, 0.01, dur*0.6)

def kick(vel=0.6):
    n = int(0.35*SR); t = np.arange(n)/SR
    f = 50 + 70*np.exp(-t/0.04)
    return vel*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.12)

def hat(vel=0.05, d=0.03):
    n = int(0.12*SR); x = np.random.randn(n)
    x = np.diff(np.concatenate([[0], x]))  # crude high-pass
    return vel*x*np.exp(-np.arange(n)/SR/d)

def add(buf, x, i):
    if i >= len(buf): return
    j = min(len(buf), i+len(x)); buf[i:j] += x[:j-i]

def reverb(x, mix=0.25):
    y = x.copy()
    for dl, g in [(0.031, .5), (0.047, .45), (0.071, .4), (0.113, .35), (0.167, .3)]:
        k = int(dl*SR); z = np.zeros_like(x)
        for r in range(1, 5):
            if k*r < len(x): z[k*r:] += x[:-k*r] * g**r
        y += z*mix/2
    return y

def track(bpm, chords, length=24, kick_pattern=(0, 2), hats=True, seed=1):
    np.random.seed(seed)
    beat = 60/bpm; bar = 4*beat
    n = int(length*SR); keys = np.zeros(n); low = np.zeros(n); drums = np.zeros(n)
    b = 0; t = 0.0
    while t < length:
        ch = chords[b % len(chords)]
        for st in (0, 2.5):  # chord stabs: on 1 and on the "and" of 3
            i = int((t + st*beat)*SR)
            for m in ch[1:]:
                add(keys, epiano(note(m), beat*2.2, 0.11), i)
        for st in (0, 1.5, 2, 3.5):
            add(low, bass(note(ch[0]), beat*0.9, 0.3 if st in (0, 2) else 0.18), int((t+st*beat)*SR))
        for q in range(4):
            if q in kick_pattern: add(drums, kick(0.5), int((t+q*beat)*SR))
            if hats: add(drums, hat(0.045), int((t+(q+0.5)*beat)*SR))
            if hats: add(drums, hat(0.015, 0.015), int((t+(q+0.25)*beat)*SR))
        t += bar; b += 1
    mix = reverb(keys, 0.35) + low + drums
    fade = int(0.8*SR); mix[:fade] *= np.linspace(0, 1, fade); mix[-fade*2:] *= np.linspace(1, 0, fade*2)
    mix = np.tanh(mix*1.2)
    rms = np.sqrt(np.mean(mix**2)); mix *= 10**(-18/20)/rms  # ~ -18 dBFS RMS
    return np.clip(mix, -0.98, 0.98)

TRACKS = {
    # name: bpm, chords [bass, chord tones...]
    'warm-lounge': (112, [[41, 64, 69, 72, 76], [40, 62, 67, 71, 74], [38, 60, 65, 69, 72], [36, 59, 64, 67, 71]]),
    'brera-night': (122, [[45, 60, 64, 67, 72], [41, 60, 64, 69, 72], [36, 59, 64, 67, 71], [43, 59, 62, 67, 71]]),
    'slow-sunday': (78, [[38, 61, 66, 69, 73], [35, 62, 66, 69, 74], [43, 62, 66, 71, 74], [45, 61, 64, 66, 69]]),
}

if __name__ == '__main__':
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    for i, (name, (bpm, ch)) in enumerate(TRACKS.items()):
        x = track(bpm, ch, kick_pattern=(0, 2) if bpm < 100 else (0, 1, 2, 3), hats=bpm > 90, seed=i+1)
        st = np.stack([x, np.roll(x, 220)], 1)  # light stereo widening
        pcm = (st*32767).astype(np.int16)
        wav = os.path.join(out, name + '.wav')
        with wave.open(wav, 'w') as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-b:a', '128k', os.path.join(out, name + '.mp3')], check=True)
        os.remove(wav); print('ok', name, bpm)
