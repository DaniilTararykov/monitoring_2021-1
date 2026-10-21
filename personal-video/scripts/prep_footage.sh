#!/usr/bin/env bash
# Natural-look 1080x1920 H.264 working copy of the CapCut rough cut.
# usage: scripts/prep_footage.sh <source.mov>
set -euo pipefail
ffmpeg -v error -y -i "$1" -an -vf "scale=1080:-2:flags=lanczos,crop=1080:1920,\
eq=contrast=1.04:saturation=1.06:brightness=0.015:gamma=1.03,\
colorbalance=bs=0.01:bm=0.01,format=yuv420p" \
  -c:v libx264 -preset fast -crf 17 -g 15 -r 30 "$(dirname "$0")/../public/footage.mp4"
