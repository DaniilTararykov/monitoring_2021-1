#!/usr/bin/env bash
# Converts the raw speaker recording (e.g. the .mov from Google Drive) into the
# files the Capitaliano composition expects in public/.
# Usage: scripts/prepare.sh /path/to/source.mov
set -euo pipefail
SRC="${1:?usage: scripts/prepare.sh /path/to/source.mov}"
cd "$(dirname "$0")/.."

ffmpeg -y -i "$SRC" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p \
  -vf "scale=1080:-2" -r 30 -c:a aac -b:a 192k -movflags +faststart public/speaker.mp4
# 16 kHz mono WAV: used by the equalizer and by Whisper.
ffmpeg -y -i "$SRC" -vn -ac 1 -ar 16000 public/speaker-audio.wav
