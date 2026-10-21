# Prints each answer's caption text per video, for proofreading.
import json, sys, pathlib
for f in sorted(pathlib.Path(sys.argv[1]).glob("*.json")):
    if len(sys.argv) > 2 and f.stem not in sys.argv[2].split(","):
        continue
    d = json.load(open(f))
    print(f"== {d['id']} {d['durationSec']}s")
    for it in d["items"]:
        if it["kind"] != "clip":
            print(f"   [{it['kind']}] {it['text']}")
            continue
        txt = "".join(c["text"] for c in d["captions"] if it["start"] * 1000 - 5 <= c["startMs"] < it["end"] * 1000)
        print(f"   {it['student']} {it['end'] - it['start']:4.1f}s | {txt.strip()}")
