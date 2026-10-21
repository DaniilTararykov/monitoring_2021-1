# Builds edit timelines for the student-interview videos: snaps chosen source
# ranges to words, lays them out back to back with cards, and remaps captions.
# Usage: python3 build.py TRANSCRIPTS_DIR OUT_DIR PHOTOS_DIR [IDS]
import json, sys, pathlib

FPS = 30
PAD_IN, PAD_OUT = 0.06, 0.14  # breathing room around kept words inside an answer
HEAD, TAIL = 0.30, 0.60  # more room where an answer starts and ends, so no one is cut off

# "face": approximate face centre in the 1080×1920 proxy (camera origin, avatars).
FEMALE = {"AI", "PO", "NA", "MA", "LI", "EV", "EA"}
STUDENTS = {
    "AI": {"face": [475, 1000], "file": "IMG_8993", "name": "Айка", "age": "23", "from": "Кыргызстан", "uni": "IULM", "program": "Fashion Communication & Luxury Strategies", "city": "Милан"},
    "EM": {"face": [475, 960], "file": "IMG_8994", "name": "Эмиль", "age": "23", "from": "Москва", "uni": "Università Cattolica", "program": "Global Business Management", "city": "Пьяченца"},
    "SE": {"face": [510, 985], "file": "IMG_8995", "name": "Семён", "age": "24", "from": "Санкт-Петербург", "uni": "UNIMI", "program": "Law and Sustainable Development", "city": "Милан"},
    "DA": {"face": [535, 775], "file": "IMG_8997", "name": "Данил", "age": "25", "from": "Екатеринбург", "uni": "UNIBO", "program": "Архитектурная инженерия", "city": "Болонья"},
    "PO": {"face": [500, 865], "file": "IMG_9001", "name": "Полина", "age": "25", "from": "Пермь", "uni": "Bocconi", "program": "Global Law", "city": "Милан"},
    "NA": {"face": [615, 690], "file": "IMG_9002", "name": "Настя", "age": "22", "from": "Москва", "uni": "Università Cattolica", "program": "Management in Art", "city": "Милан"},
    "MA": {"face": [525, 820], "file": "IMG_9003", "name": "Маргарита", "age": "24", "from": "Алматы", "uni": "Università Cattolica", "program": "Art Management", "city": "Милан"},
    "LI": {"face": [585, 865], "file": "IMG_9005", "name": "Лия", "age": "24", "from": "Набережные Челны", "uni": "Politecnico di Torino", "program": "Architecture Construction City", "city": "Турин"},
    "EA": {"face": [650, 1085], "file": "IMG_8996", "name": "Ева", "age": "22", "from": "Москва", "uni": "UNIMI", "program": "Law and Sustainable Development", "city": "Милан"},
    "EV": {"face": [470, 975], "file": "IMG_9014", "name": "Евдокия", "age": "21", "from": "Королёв", "uni": "IULM", "program": "Corporate Communication & PR", "city": "Милан"},
}

# Recognition fixes: whole-word replacements, then per-word overrides keyed by
# (file, word start time).
WORD_FIX = {
    "ИЮМ": "IULM", "Аюль": "IULM", "Юль": "IULM", "Королев,": "Королёв,", "Вперед!": "Вперёд!",
    "Капитальяно,": "Capitaliano,", "Капитальяна,": "Capitaliano,", "Капитальяна.": "Capitaliano.",
    "Капитолиана,": "Capitaliano,", "капитальяно,": "Capitaliano,",
    "Бакони": "Bocconi", "Бакони,": "Bocconi,", "баконе,": "Bocconi,",
    "Католика": "Cattolica", "Католика,": "Cattolica,", "католику,": "Cattolica,",
    "Семен,": "Семён,", "Артем,": "Артём,", "ЛЛМ": "LLM", "УНИМИ,": "UNIMI,", "ЮНИМе,": "UNIMI,",
    "Статале,": "Statale,", "бухгалавриат": "бакалавриат", "Пьеченцы.": "Пьяченцы.", "Болонии.": "Болонье.",
    "Талова": "талого", "густят": "грустят.", "Ли,": "Лия,", "набережных": "Набережных",
    "учебы": "учёбы", "учебы.": "учёбы.", "еще": "ещё", "мое": "моё", "своем": "своём",
    "объемное,": "объёмное,", "Российском": "российском",
}
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
    ("IMG_9002", 84.88): "Но", ("IMG_9002", 87.48): "лучше",
    ("IMG_9002", 144.58): "Потом", ("IMG_9002", 143.92): "",
    ("IMG_8994", 136.30): "Когда", ("IMG_8994", 141.68): "радости.",
    ("IMG_9003", 139.42): "Не", ("IMG_9003", 139.62): "удивились,",
    ("IMG_8997", 104.60): "поддержали,",
    ("IMG_9003", 127.62): "говорят:", ("IMG_9003", 132.56): "так.",
    ("IMG_9001", 184.14): "надолго.", ("IMG_9001", 189.26): "мечта.", ("IMG_9001", 195.52): "детства.",
    ("IMG_9002", 148.78): "моё", ("IMG_9002", 148.94): "решение,", ("IMG_9002", 85.44): "всё",
    ("IMG_9014", 25.06): "Я", ("IMG_9014", 21.42): "область.", ("IMG_9014", 100.24): "",
    ("IMG_9005", 231.22): "первые.", ("IMG_9005", 229.24): "когда",
    ("IMG_9014", 99.82): "вокзале.", ("IMG_9003", 125.48): "многие —", ("IMG_9003", 129.46): "получить,",
    ("IMG_8996", 75.86): "всё", ("IMG_8996", 52.82): "опыт,", ("IMG_8996", 59.52): "консультации.",
    ("IMG_8996", 49.96): "Могу", ("IMG_8996", 96.16): "всё", ("IMG_8996", 111.52): "было,",
    ("IMG_9001", 115.28): "её", ("IMG_9002", 14.04): "University",
    ("IMG_9005", 190.46): "всё", ("IMG_9005", 128.20): "поначалу", ("IMG_9005", 128.40): "", ("IMG_9005", 129.68): "всё,",
    ("IMG_9005", 17.94): "Politecnico", ("IMG_9005", 18.68): "di", ("IMG_9005", 19.10): "Torino,",
    ("IMG_9005", 198.80): "всем:", ("IMG_9005", 200.20): "Главное —",
    ("IMG_8994", 10.70): "прожил", ("IMG_8994", 27.68): "работаю", ("IMG_8994", 61.50): "вид на", ("IMG_8994", 67.82): "всё",
    ("IMG_8993", 167.42): "DSU —", ("IMG_8993", 100.42): "всё", ("IMG_8993", 102.02): "всё",
    ("IMG_8995", 95.48): "подождём",
    ("IMG_8997", 77.96): "заняло", ("IMG_8997", 78.08): "",
    ("IMG_9003", 28.54): "работы", ("IMG_9003", 141.40): "сказала.", ("IMG_9003", 138.26): "Они", ("IMG_9003", 139.42): "не",
    ("IMG_9014", 162.70): "пожалуй,", ("IMG_9014", 163.80): "визы.", ("IMG_9014", 167.62): "всё",
    ("IMG_9014", 174.06): "ехала", ("IMG_9014", 177.74): "центр —", ("IMG_9014", 179.32): "ЕГЭ.",
    ("IMG_8994", 77.92): "всё", ("IMG_8994", 78.12): "пройдёт", ("IMG_8994", 81.00): "раза.", ("IMG_8994", 83.80): "людьми.",
    ("IMG_9001", 89.26): "всё", ("IMG_9001", 89.44): "заранее.", ("IMG_9001", 94.58): "стипендию.", ("IMG_9001", 100.62): "волну,",
    ("IMG_9001", 101.00): "максимум",
    ("IMG_9003", 76.76): "пораньше.", ("IMG_9003", 78.20): "Я", ("IMG_9003", 79.46): "поздно,", ("IMG_9003", 84.38): "волнительными.",
    ("IMG_8994", 118.34): "бы:", ("IMG_8994", 118.64): "всё", ("IMG_8993", 201.64): "и",
    ("IMG_9002", 120.82): "всё", ("IMG_9002", 127.40): "чём", ("IMG_9014", 217.62): "нервничать.", ("IMG_9014", 222.88): "",
    ("IMG_8994", 102.76, "нервотрепка"): "нервотрёпка,", ("IMG_8994", 104.16): "всё",
    ("IMG_8993", 132.20): "бояться.", ("IMG_8993", 139.64): "Если", ("IMG_8993", 143.98): "опыт.", ("IMG_8993", 146.24): "В", ("IMG_8993", 150.76): "всё",
    ("IMG_9014", 118.50): "стоят.", ("IMG_9014", 140.88): "Зато", ("IMG_9014", 145.36): "жизнь.", ("IMG_9014", 148.42): "Не", ("IMG_9014", 149.02): "ничего:",
    ("IMG_9002", 54.44): "доступ.", ("IMG_8996", 71.74): "открыт:", ("IMG_9005", 76.10): "Всё",
    ("IMG_9014", 69.06): "агентство,",
    ("IMG_9001", 51.86): "Всё", ("IMG_9001", 53.32): "понравилось,", ("IMG_9001", 55.44): "слишком,", ("IMG_9001", 60.14): "помощь.",
    ("IMG_9001", 64.08): "суперская.", ("IMG_9001", 65.16): "Она", ("IMG_9001", 65.92): "поддерживала,", ("IMG_9001", 67.06): "переживала,",
    ("IMG_9001", 69.86): "этапе.", ("IMG_9001", 70.70): "Она", ("IMG_9001", 71.78): "помогала,", ("IMG_9001", 72.36): "поддерживала,",
    ("IMG_9001", 73.32): "всё", ("IMG_9001", 74.42): "объясняла.", ("IMG_9001", 75.24): "От",
    ("IMG_8995", 43.68): "всё", ("IMG_8995", 44.14): "чётко,", ("IMG_8995", 49.30): "Яна", ("IMG_8995", 49.78): "",
    ("IMG_8995", 49.92): "старалась", ("IMG_8995", 52.34): "отвечала",
    ("IMG_8997", 49.08): "Всё",
    ("IMG_8994", 138.82): "оффер,", ("IMG_8994", 140.38): "мамы:", ("IMG_8994", 140.72): "объятия,", ("IMG_8994", 141.20): "слёзы", ("IMG_9002", 84.52): "этого.",
}

from series import VIDEOS  # noqa: E402

def load_words(tdir, file):
    d = json.load(open(tdir / f"{file}.json"))
    return [w for s in d["segments"] for w in s["words"]], d["duration"]


def word_text(file, w):
    raw = w["w"].strip()
    # (file, start, raw word) wins over (file, start) where two words share a start time.
    key = (file, round(w["s"], 2))
    return WORD_AT.get(key + (raw,), WORD_AT.get(key, WORD_FIX.get(raw, raw)))


def finish_item(caps):
    """First word capitalised, last word closes the sentence."""
    if not caps:
        return
    first = caps[0]["text"].lstrip()
    caps[0]["text"] = " " + first[:1].upper() + first[1:]
    last = caps[-1]["text"].rstrip()
    if last[-1] in ",:;—-":
        last = last[:-1].rstrip()
    if last[-1] not in ".?!…»":
        last += "."
    caps[-1]["text"] = last
    caps[-1]["pageBreakAfter"] = True


def build(vid, spec, tdir, photos):
    t = 0.0
    segments, captions, items_out = [], [], []
    prev_student = None
    items = spec["items"] + [{"end": spec["cta"], "dur": 3.6}]
    for idx, it in enumerate(items):
        if "student" not in it:
            kind = "end" if "end" in it else ("myth" if "myth" in it else "title")
            items_out.append({"kind": kind, "text": it.get("end") or it.get("myth") or it.get("title"),
                              "start": round(t, 3), "end": round(t + it["dur"], 3)})
            t += it["dur"]
            prev_student = None
            continue
        st = STUDENTS[it["student"]]
        words, dur = load_words(tdir, st["file"])
        item_start = t
        item_caps = []
        lead = it.get("bubbleLead", 0.0)
        ranges = it["ranges"]
        for ri, (a0, b0) in enumerate(ranges):
            first, last = ri == 0, ri == len(ranges) - 1
            # A range keeps every word that starts inside it.
            kept = [w for w in words if a0 - 0.05 <= w["s"] < b0]
            a, b = kept[0]["s"], kept[-1]["e"]
            src_from = max(0.0, a - (HEAD if first else PAD_IN))
            src_to = min(dur, b + (TAIL if last else PAD_OUT))
            # Never pull in a neighbouring word that the edit leaves out.
            before = [w for w in words if w["s"] < a0 - 0.05]
            after = [w for w in words if w["s"] >= b0]
            if before:
                src_from = max(src_from, before[-1]["e"])
            if after:
                src_to = min(src_to, after[0]["s"])
            mute_until = None
            if first and lead:
                # Hold on the speaker, muted, while the question is read.
                mute_until = src_from
                src_from = max(0.0, src_from - lead)
            cut = "start" if not segments else ("jump" if prev_student == it["student"] else "switch")
            seg = {"src": st["file"] + ".mp4", "from": round(src_from, 3), "to": round(src_to, 3),
                   "at": round(t, 3), "student": it["student"], "item": idx, "cut": cut}
            if mute_until is not None:
                seg["muteUntil"] = round(mute_until, 3)
            segments.append(seg)
            if item_caps and kept[0]["w"].strip()[:1].isupper() and item_caps[-1]["text"].endswith(","):
                item_caps[-1]["text"] = item_caps[-1]["text"][:-1] + "."
            for w in kept:
                text = word_text(st["file"], w)
                if not text:
                    continue
                s_ms = round((t + max(w["s"], src_from) - src_from) * 1000)
                e_ms = round((t + min(w["e"], src_to) - src_from) * 1000)
                if (text.startswith("-") or text == "%") and item_caps:
                    # Whisper splits hyphenated words ("как -то") and "100 %".
                    item_caps[-1]["text"] += text
                    item_caps[-1]["endMs"] = e_ms
                    continue
                if item_caps and item_caps[-1]["text"].rstrip()[-1:] in ".?!" and text[:1].islower():
                    text = text[:1].upper() + text[1:]
                item_caps.append({"text": " " + text, "startMs": s_ms, "endMs": e_ms,
                                  "timestampMs": (s_ms + e_ms) // 2, "confidence": w["p"]})
            t += src_to - src_from
            prev_student = it["student"]
        finish_item(item_caps)
        captions.extend(item_caps)
        item = {"kind": "clip", "student": it["student"], "start": round(item_start, 3), "end": round(t, 3)}
        for k in ("hook", "passport", "bubble", "bubbleLead", "truth"):
            if k in it:
                item[k] = it[k]
        items_out.append(item)
    order = []
    for it in spec["items"]:
        if "student" in it and it["student"] not in order:
            order.append(it["student"])
    students = {}
    for sid in order:
        st = dict(STUDENTS[sid])
        st["female"] = sid in FEMALE
        st["avatar"] = f"photos/{sid}-avatar.jpg" if (photos / f"{sid}-avatar.jpg").exists() else f"avatars/{sid}.jpg"
        st["photo"] = f"photos/{sid}-passport.jpg" if (photos / f"{sid}-passport.jpg").exists() else None
        students[sid] = st
    return {"id": vid, "format": spec["format"], "title": spec["title"], "question": None,
            "durationSec": round(t, 3), "durationInFrames": int(round(t * FPS)),
            "students": students, "order": order,
            "segments": segments, "items": items_out, "captions": captions}


if __name__ == "__main__":
    tdir, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
    photos = pathlib.Path(sys.argv[3]) if len(sys.argv) > 3 else pathlib.Path("/nonexistent")
    only = sys.argv[4].split(",") if len(sys.argv) > 4 else None
    out.mkdir(parents=True, exist_ok=True)
    for vid, spec in VIDEOS.items():
        if only and vid not in only:
            continue
        data = build(vid, spec, tdir, photos)
        (out / f"{vid}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1))
        print(f"{vid:4} {data['durationSec']:5.1f}s  {spec['title']}")
    ids = [vid for vid in VIDEOS if (out / f"{vid}.json").exists()]
    (out / "index.ts").write_text(
        "// Generated by student-interviews/edit/build.py.\n"
        + "".join(f'import {v} from "./{v}.json";\n' for v in ids)
        + 'import type { VoicesData } from "../types";\n\n'
        + "export const VOICES_DATA: VoicesData[] = [\n"
        + "".join(f"  {v} as VoicesData,\n" for v in ids)
        + "];\n"
    )
