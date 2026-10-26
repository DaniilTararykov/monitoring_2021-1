#!/bin/bash
# Render a config saved by the «Монтажная» editor (artifact db collection "renders").
# 1) ArtifactData list collection "renders" with out_dir → JSON files (status "requested")
# 2) tools/render_editor.sh <doc.json> [out.mp4]
# 3) ArtifactData update the doc: status "done" (pin if_version)
set -e
doc=$1; out=${2:-remotion/out/editor-$(basename "${doc%.json}").mp4}
here=$(cd "$(dirname "$0")/.." && pwd)
props=$(mktemp --suffix=.json)
python3 -c "import json,sys; d=json.load(open(sys.argv[1])); d=d.get('data', d); json.dump({'config': d}, open(sys.argv[2],'w'))" "$doc" "$props"
cd "$here/remotion" && npx remotion render EditorReel "$here/$out" --props="$props" --codec=h264 --crf=18 --concurrency=3 --timeout=240000
"$here/tools/check_video.sh" "$here/$out"
