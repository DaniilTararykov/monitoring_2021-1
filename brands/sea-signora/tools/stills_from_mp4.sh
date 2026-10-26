#!/bin/bash
# Static story images (no music) from rendered stories: one JPG per scene (0.4 s before
# each hard cut) + the last frame before the end fade. More reliable than renderStill
# when the headless browser is under load.
# usage: stills_from_mp4.sh <out_dir> story1.mp4 [story2.mp4 ...]
out=$1; shift; mkdir -p "$out"
for f in "$@"; do
  id=$(basename "${f%.mp4}"); d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  cuts=$(ffmpeg -i "$f" -vf "select='gt(scene,0.25)',showinfo" -an -f null - 2>&1 | grep -oE "pts_time:[0-9.]+" | cut -d: -f2)
  i=1
  for t in $(for c in $cuts; do echo "$c - 0.4" | bc; done) $(echo "$d - 0.6" | bc); do
    ffmpeg -v error -y -ss "$t" -i "$f" -frames:v 1 -q:v 2 "$out/${id}_$i.jpg"; i=$((i+1))
  done
done
