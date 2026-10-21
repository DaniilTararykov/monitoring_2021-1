"""Pick the most intelligible voice-over take per line and export word timings.

Each take is transcribed with faster-whisper and scored against the script
text; the best one is cleaned up with ffmpeg and written to public/vo/.
Word timings for the subtitles keep the script spelling but take their
timing from whisper (proportional fallback when word counts differ).

usage: python pick_takes.py <lines.json> <takes_dir> <out_dir>
"""
import difflib
import glob
import json
import os
import re
import subprocess
import sys

import numpy as np
import soundfile as sf
from faster_whisper import WhisperModel

lines_path, takes_dir, out_dir = sys.argv[1:4]
os.makedirs(out_dir, exist_ok=True)
model = WhisperModel("small", device="cpu", compute_type="int8")


def norm(s):
    return re.sub(r"[^а-я0-9 ]", "", s.lower().replace("ё", "е")).split()


def load16k(path):
    a, sr = sf.read(path, dtype="float32")
    if a.ndim > 1:
        a = a.mean(1)
    idx = np.arange(0, len(a), sr / 16000)
    return np.interp(idx, np.arange(len(a)), a).astype(np.float32)


def transcribe(path):
    segs, _ = model.transcribe(load16k(path), language="ru", word_timestamps=True)
    return [w for s in segs for w in s.words]


def align(script_words, heard, dur):
    if heard and len(heard) == len(script_words):
        return [{"w": w, "s": round(h.start, 3), "e": round(h.end, 3)} for w, h in zip(script_words, heard)]
    start = heard[0].start if heard else 0.05
    end = heard[-1].end if heard else dur - 0.05
    weights = np.array([len(w) + 2 for w in script_words], dtype=float)
    edges = start + np.concatenate([[0], np.cumsum(weights)]) / weights.sum() * (end - start)
    return [{"w": w, "s": round(edges[i], 3), "e": round(edges[i + 1], 3)} for i, w in enumerate(script_words)]


result = {}
for line in json.load(open(lines_path)):
    takes = sorted(glob.glob(os.path.join(takes_dir, f"{line['id']}__t*.wav")))
    if not takes:
        print("missing", line["id"])
        continue
    want = norm(line["text"])
    scored = []
    for t in takes:
        heard = transcribe(t)
        score = difflib.SequenceMatcher(None, want, norm(" ".join(w.word for w in heard))).ratio()
        scored.append((score, t))
    score, best = max(scored)
    out = os.path.join(out_dir, f"{line['id']}.wav")
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-i", best, "-af",
        "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
        "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
        "highpass=f=80,equalizer=f=3500:t=q:w=1.2:g=2,"
        "acompressor=threshold=-20dB:ratio=3:attack=5:release=80,"
        "loudnorm=I=-16:TP=-1.5:LRA=7,apad=pad_dur=0.08",
        "-ar", "44100", "-ac", "2", out,
    ], check=True)
    dur = sf.info(out).duration
    words = align(line["text"].split(), transcribe(out), dur)
    result[line["id"]] = {"dur": round(dur, 3), "take": os.path.basename(best), "score": round(score, 3), "words": words}
    print(f"{line['id']}: {os.path.basename(best)} score={score:.2f} dur={dur:.2f}s", flush=True)

json.dump(result, open(os.path.join(out_dir, "words.json"), "w"), ensure_ascii=False, indent=1)
