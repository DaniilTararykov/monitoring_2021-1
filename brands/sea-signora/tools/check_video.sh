#!/bin/bash
# Pre-delivery QA for rendered stories: size, fps, duration, audio present & loudness, black tail.
# usage: check_video.sh out/*.mp4
for f in "$@"; do
  v=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of csv=p=0 "$f")
  v=${v%,}
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  a=$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 "$f")
  vol=$(ffmpeg -i "$f" -af volumedetect -vn -f null - 2>&1 | grep -oE "mean_volume: [-0-9.]+ dB" | cut -d' ' -f2)
  blk=$(ffmpeg -i "$f" -vf "blackdetect=d=0.8:pix_th=0.06" -an -f null - 2>&1 | grep -c black_start)
  ok=OK
  [ "$v" != "1080,1920,30/1" ] && ok=FAIL
  [ -z "$a" ] && ok=FAIL
  awk "BEGIN{exit !($d<3 || $d>60)}" && ok=FAIL
  [ "$blk" -gt 0 ] && ok="$ok(black>0.8s?)"
  printf "%-6s %-44s %s %5.1fs audio=%s mean=%sdB\n" "$ok" "$(basename "$f")" "$v" "$d" "${a:-none}" "${vol:-?}"
done
