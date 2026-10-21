# usage: xtts_synth.py lines.json out_dir ref1.wav [ref2.wav ...]
import sys, json, os, torch, torchaudio, soundfile as sf

def _load(path, *a, **k):
    data, sr = sf.read(path, dtype="float32", always_2d=True)
    return torch.from_numpy(data.T.copy()), sr

def _save(path, wav, sr, *a, **k):
    sf.write(path, wav.squeeze(0).numpy(), sr)

torchaudio.load, torchaudio.save = _load, _save
from TTS.api import TTS
lines_path, out_dir, refs = sys.argv[1], sys.argv[2], sys.argv[3:]
os.makedirs(out_dir, exist_ok=True)
torch.set_num_threads(4)
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2").synthesizer.tts_model
gpt_lat, spk_emb = model.get_conditioning_latents(audio_path=refs, gpt_cond_len=30, max_ref_length=60)
only = os.environ.get("ONLY")
for ln in json.load(open(lines_path)):
    if only and ln["id"] not in only.split(","):
        continue
    for take in range(int(os.environ.get("TAKES", 1))):
        torch.manual_seed(take)
        out = model.inference(ln["text"], "ru", gpt_lat, spk_emb, temperature=0.6,
                              repetition_penalty=5.0, speed=float(ln.get("speed", 1.0)), enable_text_splitting=True)
        wav = torch.tensor(out["wav"]).unsqueeze(0)
        torchaudio.save(f"{out_dir}/{ln['id']}__t{take}.wav", wav, 24000)
        print(ln["id"], take, round(wav.shape[1] / 24000, 2), "s", flush=True)
