# Haus of Danik · «Вторая жизнь сундука»

Reels 9:16 (1080×1920, 30 fps, ~73 s) about restoring a street-found trunk.
Remotion project; all timing lives in `src/edit.json` (shots, voice-over,
SFX, chapters, tags, titles, music sections).

## Pipeline

```bash
# 1. Graded working copy of the source (CapCut rough cut from Google Drive)
scripts/prep_footage.sh path/to/copy_A9A2F14B-….mov

# 2. Voice-over with the cloned voice (XTTS-v2, CPU) — 3 takes per line
#    refs: 10–12 s clean chunks of Danik's own speech
COQUI_TOS_AGREED=1 TAKES=3 python scripts/xtts_synth.py voiceover/lines.json takes/ ref1.wav ref2.wav …
#    pick the most intelligible take, clean it, export word timings
python scripts/pick_takes.py voiceover/lines.json takes/ public/vo

# 3. Sound: procedural SFX + music bed that follows edit.json and ducks under the VO
python scripts/make_sfx.py public/sfx
python scripts/make_music.py src/edit.json public/vo/words.json public/music.wav

# 4. Render
npm run render   # -> out/chest-reel.mp4
```

Python deps: `faster-whisper soundfile numpy` (steps 2–3), `coqui-tts torch==2.8 torchaudio==2.8` (XTTS).

When `ELEVENLABS_API_KEY` is available, step 2 can be swapped for an
ElevenLabs voice clone; `pick_takes.py` and everything after stay the same.

## Style

- walnut `#1A1410` plates · linen `#E9DFD0` text · brass `#C8A15A` accent
- Cormorant Garamond (titles, subtitles) · JetBrains Mono (chapter marks, tags)
- warm grade, film grain, soft vignette
- Reels safe zone: top 250 px, bottom 420 px, right 120 px
