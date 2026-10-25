"""faster-whisper over a folder of 16 kHz mono WAVs (decoded by ffmpeg — avoids PyAV issues).
usage: python -I transcribe.py <wav_dir> <out.json> [model=small]"""
import sys, os, json, wave
import numpy as np
from faster_whisper import WhisperModel

m = WhisperModel(sys.argv[3] if len(sys.argv) > 3 else 'small', device='cpu', compute_type='int8')
res = {}
for f in sorted(os.listdir(sys.argv[1])):
    if not f.endswith('.wav'):
        continue
    with wave.open(os.path.join(sys.argv[1], f)) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    segs, info = m.transcribe(a, vad_filter=True)
    segs = [(round(s.start, 1), round(s.end, 1), s.text.strip()) for s in segs]
    res[f] = {'lang': info.language, 'prob': round(info.language_probability, 2), 'segments': segs}
    print(f, info.language, segs, flush=True)
json.dump(res, open(sys.argv[2], 'w'), ensure_ascii=False, indent=1)
