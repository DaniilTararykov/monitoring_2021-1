# Haus of Danik · сундук: с помойки — в гостиную

Reels 9:16 (1080×1920, 30 fps, ~56 s) about restoring a street-found trunk.

The story lives in `src/story.json`: every line has its text, the shots that
play under it (cut on spoken words), SFX cues and emphasised words.
`scripts/build_edit.py` turns it into the frame-level `src/edit.json` that
Remotion renders.

## Pipeline

```bash
# 1. Natural-look 1080x1920 working copy of the source (CapCut rough cut)
scripts/prep_footage.sh path/to/copy_A9A2F14B-….mov

# 2. Edit from the story. Without a voice-over, word timings follow a
#    natural speaking pace (captions-only cut). With a recording, pass the
#    per-line word timings: {"<line index>": {"dur": s, "words": [{s, e}, …]}}
#    and put the line audio in public/vo/line_<index>.wav.
python scripts/build_edit.py src/story.json src/edit.json [public/vo/words.json]

# 3. Sound: procedural SFX + music bed that follows the edit
python scripts/make_sfx.py public/sfx
python scripts/make_music.py src/edit.json public/vo/words.json public/music.wav

# 4. Render
npm run render   # -> out/chest-reel.mp4
```

Python deps: `numpy` (SFX/music), `faster-whisper soundfile` (voice timing).
`scripts/xtts_synth.py` / `pick_takes.py` are the earlier voice-clone
experiment (pilot v1), kept for reference.

## Look

- natural colour, no grain or vignette — native Reels feel
- captions: Montserrat ExtraBold, white, 1–3 words, centred; key words in gold `#F2C75C`
- opening title: Cormorant Garamond italic
- Reels safe zone: top 250 px, bottom 420 px, right 120 px
