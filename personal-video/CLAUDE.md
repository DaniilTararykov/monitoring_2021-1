# personal-video: how to edit for this client

Personal videos (GRWM, reels, photos). Talk to the client in Russian. Not related to Capitaliano: do not use
`capitaliano-video/`, `student-interviews/` or their style, colours, fonts, logo, laurels or plates.

## Footage
- Source clips live in Google Drive folder `1_ilppj3-Be8J4P_oPmK4nFGuJeSOKIOj`; download with
  `curl -L "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t"`.
- Phone footage is 4K HEVC; ffmpeg auto-rotates it to 1080×1920. Keep the original frame.

## The client's rules (all of them were asked for explicitly)
- No subtitles or on-screen text, no zooms or punch-ins, no reframing, no music unless asked: only his voice.
- Every sentence whole: never cut mid-thought, never leave a stumble, "uh"/"a" filler, false start,
  repeated word or grammar slip. Pick the cleanest take of each line, not the first one.
- No pauses: tighten (build with `TIGHT=1`), but never at the cost of a word: every line starts before its
  first sound and ends after its last one (word endings like "tonight", "decades", "bottom" decay slowly),
  and no fragment of the neighbouring word may leak in. Set line edges from a 20 ms loudness profile, then
  run `DRY=1` and fix every "cut through sound" it reports.
- Talking on screen = picture in sync. Voice-over only over action shots (dressing, putting things on,
  spraying perfume). Never a shot where he is silent and doing nothing, never a shot of his back while
  silent, never an empty room.
- No two similar lines next to each other ("it's giving… it's giving", "I'm gonna wear… I'm gonna wear").
- Keep the shoot's chronology (e.g. no shots in socks after the boots are on).
- Brands: either all of them or none.
- Show actions to the end (not cut off halfway); aesthetic close-ups are welcome.
- No fade at the end.
- Always offer several genuinely different versions unless he asks for one.

## Tools
- `scripts/build_looks2.py`: builds a cut from a JSON edit list (spoken lines with pauses removed, synced
  picture, voice-over footage, `lip`/`upto`, `speed`, `rev`). `DRY=1` prints the timing, `AUDIO=1` writes
  only the voice so the words can be checked before rendering, `TIGHT=1` removes pauses.
- `scripts/grwm_cuts2.py`: the GRWM edit lists; each line names its source take and why.
- Python video tools: `/opt/video-venv` (faster-whisper, scenedetect, librosa, pyloudnorm, mediapipe,
  opencv, auto-editor), installed by the environment's setup script.
- Voice clean-up: `/opt/video-bin/deep-filter -o <out_dir> <in.wav>` (DeepFilterNet 3, 48 kHz mono wav,
  removes room noise; check by ear-level stats before using it on a whole cut).
- Remotion agent skills (official, `npx remotion skills add`): `.agents/skills/remotion-*`, linked from
  `.claude/skills/`. Start with `remotion-best-practices`; `remotion-captions`, `remotion-markup`,
  `remotion-render` for captions, animation and export.
- Colour: ffmpeg `lut3d` takes `.cube` LUTs; `loudnorm` / pyloudnorm for -14 LUFS social loudness.

## Story logic (check before every render)
- Read the final transcript as a story: every reaction needs its setup ("Actually, it's not bad" only after
  "I'm not sure about this"), and "I think we're ready" comes last, after hair, jewellery and perfume.
- A stop consonant (p, t, k, b, d) makes a 50–100 ms silence inside a word ("sim-ple"): never treat a gap
  shorter than 120 ms as the end of a word.

- Find actions by what is seen, not by sound: a hiss can be anything. He holds a round microphone near his
  mouth most of the time, so "hand at the neck" on a wide shot is often just the mic. The perfume spray is
  at 20:36–20:40 of IMG_2769 (bottle to the neck, head back, second spray behind the head).

## Before sending anything
1. Transcribe the finished voice with a filler-aware prompt ("Umm, uh, ah…") and read it: no fillers,
   no repeats, no cut words, every sentence complete.
2. Check for empty frames against an empty-room reference frame.
3. Look at a contact sheet (2–3 fps) for back shots, silent shots, jumps in chronology.
4. Send a phone-size copy (crf 23); keep the full-quality file in `out/`.
