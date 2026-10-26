#!/bin/bash
# Stabilize a segment of a clip with vidstab (2 passes), output 60fps h264 without audio.
# usage: stabilize.sh <in.mp4> <start_s> <dur_s> <out.mp4>
set -e
in=$1; ss=$2; t=$3; out=$4; trf=$(mktemp --suffix=.trf)
ffmpeg -v error -y -ss "$ss" -t "$t" -i "$in" -vf "vidstabdetect=shakiness=8:accuracy=15:result=$trf" -f null -
ffmpeg -v error -y -ss "$ss" -t "$t" -i "$in" -vf "vidstabtransform=input=$trf:smoothing=40:optzoom=1:zoomspeed=0.2:interpol=bicubic,unsharp=5:5:0.6" \
  -an -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p "$out"
rm -f "$trf"
