# Builds edit timelines for the student-interview videos: snaps chosen source
# ranges to words, lays them out back to back with cards, and remaps captions.
# Usage: python3 build.py TRANSCRIPTS_DIR OUT_DIR
import json, sys, pathlib

FPS = 30
PAD_IN, PAD_OUT = 0.06, 0.14  # breathing room around kept words

# "face": approximate face centre in the 1080×1920 proxy (camera origin, avatars).
STUDENTS = {
    "AI": {"face": [475, 1000], "file": "IMG_8993", "name": "Айка", "age": "23", "from": "Кыргызстан", "uni": "IULM", "program": "Fashion Communication & Luxury Strategies", "city": "Милан"},
    "EM": {"face": [475, 960], "file": "IMG_8994", "name": "Эмиль", "age": "23", "from": "Москва", "uni": "Università Cattolica", "program": "Global Business Management", "city": "Пьяченца"},
    "SE": {"face": [510, 985], "file": "IMG_8995", "name": "Семён", "age": "24", "from": "Санкт-Петербург", "uni": "UNIMI", "program": "Law and Sustainable Development", "city": "Милан"},
    "DA": {"face": [535, 775], "file": "IMG_8997", "name": "Данил", "age": "25", "from": "Екатеринбург", "uni": "UNIBO", "program": "Архитектурная инженерия", "city": "Болонья"},
    "PO": {"face": [500, 865], "file": "IMG_9001", "name": "Полина", "age": "25", "from": "Пермь", "uni": "Bocconi", "program": "Global Law", "city": "Милан"},
    "NA": {"face": [615, 690], "file": "IMG_9002", "name": "Настя", "age": "22", "from": "Москва", "uni": "Università Cattolica", "program": "Management in Art", "city": "Милан"},
    "MA": {"face": [525, 820], "file": "IMG_9003", "name": "Маргарита", "age": "24", "from": "Алматы", "uni": "Università Cattolica", "program": "Art Management", "city": "Милан"},
    "LI": {"face": [585, 865], "file": "IMG_9005", "name": "Лия", "age": "24", "from": "Набережные Челны", "uni": "Politecnico di Torino", "program": "Architecture Construction City", "city": "Турин"},
    "EV": {"face": [500, 805], "file": "IMG_9014", "name": "Евдокия", "age": "21", "from": "Королёв", "uni": "IULM", "program": "Corporate Communication & PR", "city": "Милан"},
}

# Recognition fixes: whole-word replacements, then per-word overrides keyed by
# (file, word start time).
WORD_FIX = {"ИЮМ": "IULM", "Королев,": "Королёв,", "Вперед!": "Вперёд!", "Капитальяно,": "Capitaliano,"}
WORD_AT = {
    ("IMG_9002", 79.64): "", ("IMG_9002", 79.72): "впопыхах.", ("IMG_9002", 78.06): "всё",
    ("IMG_9003", 129.94): "всё", ("IMG_9003", 128.58): "«визу", ("IMG_9003", 130.60): "сложно».",
    ("IMG_9003", 131.18): "Но", ("IMG_9003", 125.04): "Очень",
    ("IMG_9014", 195.88): "Можно", ("IMG_9014", 17.60): "Меня", ("IMG_9014", 25.50): "Я",
    ("IMG_9014", 42.90): "Это", ("IMG_9014", 205.44): "Я", ("IMG_9014", 213.22): "То",
    ("IMG_9014", 89.22): "У", ("IMG_9014", 99.46): "где-нибудь", ("IMG_9014", 99.54): "",
    ("IMG_9014", 101.20): "Слава", ("IMG_9014", 95.76): "",
    ("IMG_8993", 212.20): "«О,", ("IMG_8993", 214.88): "газ!»", ("IMG_8993", 215.38): "",
    ("IMG_9005", 230.38): "пришли", ("IMG_9005", 227.62): "Подключились",
    ("IMG_9001", 187.42): "Они", ("IMG_9001", 187.80): "осознали,", ("IMG_9001", 195.22): "с самого", ("IMG_9001", 194.28): "Я",
    ("IMG_9002", 76.34): "Я", ("IMG_9002", 84.88): "Но", ("IMG_9002", 87.48): "лучше",
    ("IMG_9002", 144.58): "Потом", ("IMG_9002", 143.92): "",
    ("IMG_8994", 136.30): "Когда", ("IMG_8994", 141.68): "радости.",
    ("IMG_9003", 139.42): "Не", ("IMG_9003", 139.62): "удивились.",
    ("IMG_8997", 104.60): "поддержали.",
    ("IMG_9003", 127.62): "говорят:", ("IMG_9003", 132.56): "так.",
    ("IMG_9001", 184.14): "надолго.", ("IMG_9001", 189.26): "мечта.", ("IMG_9001", 195.52): "детства.",
    ("IMG_9002", 148.78): "моё", ("IMG_9002", 148.94): "решение.", ("IMG_9002", 85.44): "всё",
    ("IMG_9014", 25.06): "Я", ("IMG_9014", 21.42): "область.", ("IMG_9014", 100.24): "",
    ("IMG_9005", 231.22): "первые.", ("IMG_9005", 229.24): "когда",
    ("IMG_9014", 99.82): "вокзале.", ("IMG_9003", 125.48): "многие —", ("IMG_9003", 129.46): "получить,",
    ("IMG_8994", 138.82): "оффер,", ("IMG_8994", 140.38): "мамы:", ("IMG_8994", 140.72): "объятия,", ("IMG_8994", 141.20): "слёзы", ("IMG_9002", 84.52): "этого.",
}

VIDEOS = {
    "S1": {"format": "story", "title": "Евдокия: без IELTS в IULM", "items": [
        {"student": "EV", "ranges": [(195.88, 200.48)], "hook": True},
        {"student": "EV", "ranges": [(17.60, 21.86)], "passport": True},
        {"student": "EV", "ranges": [(25.40, 30.50)], "bubble": "Куда ты поступила?"},
        {"student": "EV", "ranges": [(42.90, 51.42)], "bubble": "Почему именно этот вуз?"},
        {"student": "EV", "ranges": [(205.44, 212.36), (213.22, 214.90)], "bubble": "А языковые экзамены?"},
        {"student": "EV", "ranges": [(89.22, 93.62), (94.86, 95.76), (99.46, 100.24), (101.20, 104.54)], "bubble": "Как работалось с Capitaliano?"},
        {"student": "EV", "ranges": [(229.94, 230.42)], "bubble": "Что сказали родители?", "bubbleLead": 1.6},
        {"end": "Хотите так же? Начните с консультации", "dur": 3.2},
    ]},
    "Q1": {"format": "question", "title": "Что сказали родители?", "question": "Что сказали родители, когда узнали про Италию?", "items": [
        {"student": "EV", "ranges": [(229.94, 230.42)], "hook": True},
        {"title": "Что сказали родители, когда узнали про Италию?", "dur": 2.0},
        {"student": "AI", "ranges": [(210.98, 215.24)]},
        {"student": "SE", "ranges": [(109.52, 111.56)]},
        {"student": "DA", "ranges": [(101.34, 105.28)]},
        {"student": "NA", "ranges": [(139.94, 143.12), (144.58, 149.34)]},
        {"student": "PO", "ranges": [(178.78, 185.26), (187.42, 189.76), (194.28, 196.00)]},
        {"student": "LI", "ranges": [(217.50, 220.58), (227.62, 229.44), (230.38, 231.70)]},
        {"student": "MA", "ranges": [(138.90, 140.24)]},
        {"student": "EM", "ranges": [(136.30, 142.00)]},
        {"end": "А что сказали ваши родители? Пишите в комментариях", "dur": 3.2},
    ]},
    "M1": {"format": "myths", "title": "Мифы о поступлении", "items": [
        {"title": "3 мифа о поступлении в Италию", "dur": 2.0},
        {"myth": "Без IELTS не поступить", "dur": 1.9},
        {"student": "EV", "ranges": [(205.44, 207.60), (208.00, 212.36), (213.22, 214.90)], "truth": "Можно поступить по внутренним экзаменам вуза"},
        {"myth": "Визу невозможно получить", "dur": 1.9},
        {"student": "MA", "ranges": [(125.04, 125.92), (126.32, 127.88), (128.58, 132.82)], "truth": "Визу дают, если готовиться заранее"},
        {"myth": "Если начал в феврале — уже поздно", "dur": 1.9},
        {"student": "NA", "ranges": [(76.34, 80.16), (80.44, 84.88), (84.88, 86.94), (87.48, 89.50)], "truth": "Можно, но спокойнее начинать осенью"},
        {"end": "Разберём ваш случай — пишите @capitaliano.info", "dur": 3.2},
    ]},
}

def load_words(tdir, file):
    d = json.load(open(tdir / f"{file}.json"))
    return [w for s in d["segments"] for w in s["words"]], d["duration"]

def build(vid, spec, tdir):
    t = 0.0
    segments, captions, overlays, items_out = [], [], [], []
    prev_student = None
    for idx, it in enumerate(spec["items"]):
        if "student" in it:
            st = STUDENTS[it["student"]]
            words, dur = load_words(tdir, st["file"])
            item_start = t
            lead = it.get("bubbleLead", 0.0)
            for ri, (a, b) in enumerate(it["ranges"]):
                src_from = max(0.0, a - PAD_IN)
                src_to = min(dur, b + PAD_OUT)
                # Never pull in a neighbouring word that the edit leaves out.
                before = [w for w in words if w["e"] <= a + 0.01]
                after = [w for w in words if w["s"] >= b - 0.01]
                if before:
                    src_from = max(src_from, before[-1]["e"])
                if after:
                    src_to = min(src_to, after[0]["s"])
                mute_until = None
                if ri == 0 and lead:
                    # Hold on the speaker, muted, while the question is read.
                    mute_until = src_from
                    src_from = max(0.0, src_from - lead)
                length = src_to - src_from
                cut = "start" if not segments else ("jump" if prev_student == it["student"] else "switch")
                segments.append({"src": st["file"] + ".mp4", "from": round(src_from, 3), "to": round(src_to, 3),
                                 "at": round(t, 3), "student": it["student"], "item": idx, "cut": cut,
                                 **({"muteUntil": round(mute_until, 3)} if mute_until is not None else {})})
                for w in words:
                    # A word belongs to the range when most of it is inside.
                    inside = min(w["e"], b) - max(w["s"], a)
                    if inside < 0.5 * (w["e"] - w["s"]):
                        continue
                    text = WORD_AT.get((st["file"], round(w["s"], 2)), WORD_FIX.get(w["w"].strip(), w["w"].strip()))
                    if not text:
                        continue
                    s_ms = round((t + max(w["s"], src_from) - src_from) * 1000)
                    e_ms = round((t + min(w["e"], src_to) - src_from) * 1000)
                    if text.startswith("-") and captions:
                        # Whisper splits hyphenated words ("как -то"); glue them back.
                        captions[-1]["text"] += text
                        captions[-1]["endMs"] = e_ms
                        continue
                    captions.append({"text": " " + text, "startMs": s_ms, "endMs": e_ms, "timestampMs": (s_ms + e_ms) // 2, "confidence": w["p"]})
                t += length
                prev_student = it["student"]
            if captions:
                captions[-1]["pageBreakAfter"] = True
            item = {"kind": "clip", "student": it["student"], "start": round(item_start, 3), "end": round(t, 3)}
            for k in ("hook", "passport", "bubble", "bubbleLead", "truth"):
                if k in it:
                    item[k] = it[k]
            items_out.append(item)
        else:
            kind = "end" if "end" in it else ("myth" if "myth" in it else "title")
            items_out.append({"kind": kind, "text": it.get("end") or it.get("myth") or it.get("title"),
                              "start": round(t, 3), "end": round(t + it["dur"], 3)})
            t += it["dur"]
            prev_student = None
    students = []
    for it in spec["items"]:
        if "student" in it and it["student"] not in students:
            students.append(it["student"])
    return {"id": vid, "format": spec["format"], "title": spec["title"], "question": spec.get("question"),
            "durationSec": round(t, 3), "durationInFrames": int(round(t * FPS)),
            "students": {s: STUDENTS[s] for s in students}, "order": students,
            "segments": segments, "items": items_out, "captions": captions}

if __name__ == "__main__":
    tdir, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    for vid, spec in VIDEOS.items():
        data = build(vid, spec, tdir)
        (out / f"{vid}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1))
        print(vid, data["durationSec"], "s", len(data["segments"]), "segments", len(data["captions"]), "words")
        print("   ", "".join(c["text"] for c in data["captions"])[:400])
