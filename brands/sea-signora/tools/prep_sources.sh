#!/bin/bash
# Storyboard + transcript prep for a folder of downloaded sources.
# usage: prep_sources.sh <sources_dir> <work_dir>
# Produces: work/frames/*.jpg (8 frames per video, tiled), work/photos_sheet_*.jpg,
#           work/proxy/*.jpg (short side 2200 px, for 9:16 crops), work/wav/*.wav,
#           work/transcript.json (faster-whisper, needs $WHISPER_PY = python of a venv with faster-whisper)
set -eu
SRC=$1; W=$2; HERE=$(cd "$(dirname "$0")" && pwd)
mkdir -p "$W/frames" "$W/proxy" "$W/wav" "$W/thumbs"
shopt -s nullglob nocaseglob
for f in "$SRC"/*.{mov,mp4,m4v}; do
  b=$(basename "${f%.*}"); d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  ffmpeg -v error -y -i "$f" -vf "fps=8/$d,scale=270:-2,drawtext=text='$b %{pts\:hms}':fontcolor=white:fontsize=14:box=1:boxcolor=black@0.6:x=4:y=4,tile=8x1" -frames:v 1 "$W/frames/$b.jpg"
  ffmpeg -v error -y -i "$f" -ac 1 -ar 16000 "$W/wav/$b.wav" || true
done
for f in "$SRC"/*.{jpg,jpeg,png,heic}; do
  b=$(basename "${f%.*}")
  convert "$f" -auto-orient -resize "2200x2200^" -quality 88 "$W/proxy/$b.jpg" 2>/dev/null || continue
  convert "$W/proxy/$b.jpg" -resize 300x300 "$W/thumbs/$b.jpg"
done
(cd "$W/thumbs" && ls | sort -V | split -l 28 - grp_ && for g in grp_*; do montage -label '%t' $(cat $g) -tile 7x4 -geometry 250x250+3+3 -pointsize 18 "../photos_sheet_$g.jpg"; rm $g; done) || true
if [ -n "${WHISPER_PY:-}" ] && ls "$W/wav"/*.wav >/dev/null 2>&1; then
  "$WHISPER_PY" -I "$HERE/transcribe.py" "$W/wav" "$W/transcript.json"
fi
echo "done: $W"
