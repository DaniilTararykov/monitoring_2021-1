# Word-level Russian transcription of every interview with per-segment loudness,
# used later to tell the student (mic in hand) from the off-screen interviewer.
import json, sys, wave, math, array, pathlib, time
import numpy as np
from faster_whisper import WhisperModel

audio_dir, out_dir = map(pathlib.Path, sys.argv[1:3])
model = WhisperModel("turbo", device="cpu", compute_type="int8", cpu_threads=4)

def load(path):
    with wave.open(str(path)) as w:
        return array.array("h", w.readframes(w.getnframes())), w.getframerate()

def rms_db(samples, sr, start, end):
    chunk = samples[int(start * sr):int(end * sr)]
    if not chunk:
        return -99.0
    ms = sum(s * s for s in chunk[::8]) / len(chunk[::8])
    return round(10 * math.log10(ms / 32768**2 + 1e-12), 1)

for wav in sorted(audio_dir.glob("*.wav")):
    out = out_dir / (wav.stem + ".json")
    if out.exists():
        continue
    t0 = time.time()
    samples, sr = load(wav)
    # Pass decoded samples: the bundled PyAV can't open files for this version.
    audio = np.frombuffer(samples.tobytes(), dtype=np.int16).astype(np.float32) / 32768
    segments, info = model.transcribe(
        audio, language="ru", word_timestamps=True, vad_filter=False,
        beam_size=5, condition_on_previous_text=False,
    )
    data = []
    for s in segments:
        data.append({
            "start": round(s.start, 2), "end": round(s.end, 2), "text": s.text.strip(),
            "db": rms_db(samples, sr, s.start, s.end),
            "words": [{"w": w.word, "s": round(w.start, 2), "e": round(w.end, 2), "p": round(w.probability, 2)} for w in s.words],
        })
    out.write_text(json.dumps({"file": wav.stem, "duration": info.duration, "segments": data}, ensure_ascii=False, indent=1))
    print(wav.stem, len(data), "segments", round(time.time() - t0), "s", flush=True)
