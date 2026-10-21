#!/usr/bin/env bash
# Graded 1080x1920 H.264 working copy of the CapCut rough cut.
# usage: scripts/prep_footage.sh <source.mov>
set -euo pipefail
ffmpeg -v error -y -i "$1" -an -vf "scale=1080:-2:flags=lanczos,crop=1080:1920,\
colorbalance=rs=0.04:bs=-0.05:rm=0.05:gm=0.01:bm=-0.06:rh=0.02:bh=-0.03,\
curves=all='0/0.03 0.25/0.23 0.5/0.5 0.75/0.78 1/0.97',eq=saturation=0.92:contrast=1.03,format=yuv420p" \
  -c:v libx264 -preset fast -crf 17 -g 15 -r 30 "$(dirname "$0")/../public/footage.mp4"
