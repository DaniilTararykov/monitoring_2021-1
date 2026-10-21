"""Build src/edit.json (frame-level edit) from src/story.json (the storytelling).

Each story line carries its text, the shots that play under it (cut on
spoken words), SFX cues and emphasised words. Word timings come from the
recorded voice-over when available (public/vo/words.json, keyed by line
index), otherwise from a natural speaking-pace model so the cut works as
a captions-only version.

usage: python build_edit.py <story.json> <edit.json> [vo_words.json]
"""
import json
import re
import sys

FPS = 30
# Hard cuts in the source rough cut (s); a shot must not run across one.
SOURCE_CUTS = [4.3, 15.0, 16.3, 18.2, 20.0, 21.8, 24.6, 25.9, 27.5, 29.2, 32.5, 36.5, 38.6, 44.1,
               46.0, 48.9, 52.0, 53.9, 56.0, 61.0, 62.7, 66.3, 68.7, 71.1, 72.1, 73.5, 76.1,
               81.0, 82.5, 85.1, 89.7, 93.1, 97.9, 121.6, 136.9, 151.8, 162.4]

story_path, out_path = sys.argv[1], sys.argv[2]
vo = json.load(open(sys.argv[3])) if len(sys.argv) > 3 else {}
story = json.load(open(story_path))


def tokens(text):
    """Words for captions; a dash sticks to the word before it."""
    out = []
    for t in text.split():
        if t in ("—", "–") and out:
            out[-1] += " —"
        else:
            out.append(t)
    return out


def paced(words, start):
    """Natural speaking pace: ~3 words/s with pauses on punctuation."""
    t, timed = start, []
    for w in words:
        letters = len(re.sub(r"[^\wё]", "", w, flags=re.I))
        d = 0.09 + 0.043 * letters
        timed.append({"w": w, "s": round(t, 3), "e": round(t + d, 3)})
        t += d
        if re.search(r"[.?!…]$", w):
            t += 0.26
        elif re.search(r"[,:;]$|—$", w):
            t += 0.12
        else:
            t += 0.02
    return timed, t


def word_at(timed, word, after=0):
    for i in range(after, len(timed)):
        if timed[i]["w"].rstrip(" —") == word:
            return i
    raise SystemExit(f"word not found: {word!r} in {' '.join(x['w'] for x in timed)}")


edit = {"fps": FPS, "shots": [], "captions": [], "sfx": [], "vo": [], "title": story["title"]}
t = 0.35
line_spans = []
for li, line in enumerate(story["lines"]):
    start = t
    if line.get("reveal"):
        end = start + line["dur"]
        at = start
        for s in line["shots"]:
            edit["shots"].append({"at": round(at, 3), "dur": s["dur"], "src": s["src"], "speed": s.get("speed", 1.0),
                                  "zoom": s["zoom"], "fx": s.get("fx", "cut")})
            at += s["dur"]
        for x in line.get("sfx", []):
            edit["sfx"].append({"id": x["id"], "at": round(start + x["at"], 3), "vol": x["vol"]})
        line_spans.append((start, end, "reveal"))
        t = end
        continue

    words = tokens(line["text"])
    if str(li) in vo:
        timed = [{"w": w, "s": round(start + x["s"], 3), "e": round(start + x["e"], 3)} for w, x in zip(words, vo[str(li)]["words"])]
        end_speech = start + vo[str(li)]["dur"]
        edit["vo"].append({"id": str(li), "at": round(start, 3)})
    else:
        timed, end_speech = paced(words, start)
    end = end_speech + line.get("after", 0.0) + 0.12
    emph = set(line.get("emph", []))
    for w in timed:
        w["emph"] = w["w"].rstrip(" —") in emph

    # shots: first starts with the line, others on their cue word
    cue, starts = 0, []
    for s in line["shots"]:
        if "word" in s:
            cue = word_at(timed, s["word"], cue)
            starts.append(timed[cue]["s"] - 0.04)
        else:
            starts.append(start)
    for i, s in enumerate(line["shots"]):
        edit["shots"].append({"at": round(starts[i], 3), "src": s["src"], "speed": s.get("speed", 1.0),
                              "zoom": s["zoom"], "fx": s.get("fx", "cut"), "_end": end if i == len(starts) - 1 else starts[i + 1]})

    # captions: pages of up to 3 words / 18 chars, broken after punctuation
    pages, cur = [], []
    for w in timed:
        if cur and (len(cur) >= 3 or sum(len(x["w"]) + 1 for x in cur) + len(w["w"]) > 18):
            pages.append(cur)
            cur = []
        cur.append(w)
        if re.search(r"[.,:;?!…]$|—$", w["w"]):
            pages.append(cur)
            cur = []
    if cur:
        pages.append(cur)
    for i, p in enumerate(pages):
        nxt = pages[i + 1][0]["s"] if i + 1 < len(pages) else end
        edit["captions"].append({"start": round(p[0]["s"] - 0.03, 3), "end": round(min(nxt, p[-1]["e"] + 0.5), 3), "words": p})

    for x in line.get("sfx", []):
        at = timed[word_at(timed, x["word"])]["s"] if "word" in x else start + x["at"]
        edit["sfx"].append({"id": x["id"], "at": round(max(0, at), 3), "vol": x["vol"]})
    line_spans.append((start, end, line["text"]))
    t = end

duration = round(t + 0.2, 2)
edit["duration"] = duration

# close shot durations: until the next shot starts (lines without shots hold the previous one)
shots = edit["shots"]
for i, s in enumerate(shots):
    nxt = shots[i + 1]["at"] if i + 1 < len(shots) else duration
    s["dur"] = round(nxt - s["at"], 3)
    s.pop("_end", None)
    used = s["dur"] * (sum(s["speed"]) / 2 if isinstance(s["speed"], list) else s["speed"])
    cut = next((c for c in SOURCE_CUTS if c > s["src"] + 0.05), 999)
    if s["src"] + used > cut + 0.05:
        print(f"WARN shot @{s['at']:.2f}s src {s['src']}+{used:.2f}s crosses source cut {cut}")

reveal = next(sp for sp in line_spans if sp[2] == "reveal")
edit["music"] = {
    "bpm": 96,
    "keysFrom": 0.0,
    "drumsFrom": line_spans[2][0],
    "buildFrom": line_spans[-4][0],
    "silenceFrom": round(reveal[0] + 3.35, 3),
    "silenceTo": round(reveal[1], 3),
    "outroFrom": round(reveal[1], 3),
    "end": duration,
}
json.dump(edit, open(out_path, "w"), ensure_ascii=False, indent=1)
print(f"duration {duration}s, {len(shots)} shots, {len(edit['captions'])} caption pages")
for s, e, txt in line_spans:
    print(f"  {s:6.2f}-{e:6.2f}  {txt}")
