# Builds the series review page from the rendered edit timelines: every video
# with its answers, call to action and length, plus coverage of each interview.
# Usage: python3 series_page.py DATA_DIR OUT_HTML
import html, json, pathlib, re, sys

from plan import ANSWERS, QUESTIONS, STUDENTS

data_dir, out_path = pathlib.Path(sys.argv[1]), sys.argv[2]
e = html.escape
SERIES = [
    ("story", "История студента", "Один студент, его лучшие ответы целиком: крючок, паспорт студента, ответы на вопросы-сообщения, финал."),
    ("question", "Один вопрос — разные ответы", "Карточка с вопросом и ответы студентов подряд, сверху ряд лиц и счётчик."),
    ("reviews", "Отзывы о Capitaliano", "Студенты о работе с кураторами — для доверия и продаж."),
    ("myths", "Мифы о поступлении", "Миф на карточке, красное зачёркивание, ответ студента и плашка «Правда»."),
]


def key(vid):
    return (vid[0], int(re.sub(r"\D", "", vid)))


videos = sorted((json.load(open(f)) for f in data_dir.glob("*.json")), key=lambda d: key(d["id"]))
sid_by_file = {v[0]: k for k, v in STUDENTS.items()}

# Coverage: share of the words in each answer that some video plays.
# Filler words are cut on purpose and do not count.
FILLER = {"ну", "вот", "вот,", "ну,", "типа,", "типа", "как", "бы", "бы,", "э", "это", "так,", "наверное,", "вообще",
          "в", "целом", "целом,", "соответственно,", "соответственно", "там", "там,", "просто", "как-то", "блин,"}
used = {}
for d in videos:
    for seg in d["segments"]:
        used.setdefault(seg["student"], []).append((seg["from"], seg["to"]))
WORDS = {}
for sid, st in STUDENTS.items():
    tr = json.load(open(pathlib.Path(__file__).parent.parent / "transcripts" / f"{st[0]}.json"))
    WORDS[sid] = [w for s in tr["segments"] for w in s["words"] if w["w"].strip().lower() not in FILLER]


def counts(sid, span):
    a, b = span
    ws = [w for w in WORDS[sid] if a <= w["s"] < b]
    hit = sum(1 for w in ws if any(s <= (w["s"] + w["e"]) / 2 <= t for s, t in used.get(sid, [])))
    return hit, len(ws)


cnt = {sid: {q: counts(sid, span) for q, span in ans.items()} for sid, ans in ANSWERS.items()}
cov = {sid: {q: (h / n if n else 1.0) for q, (h, n) in c.items()} for sid, c in cnt.items()}
cov_total = {sid: sum(h for h, n in c.values()) / sum(n for h, n in c.values()) for sid, c in cnt.items()}
overall = round(100 * sum(h for c in cnt.values() for h, n in c.values()) / sum(n for c in cnt.values() for h, n in c.values()))


def card(d):
    rows = []
    for it in d["items"]:
        if it["kind"] == "clip":
            text = "".join(c["text"] for c in d["captions"] if it["start"] * 1000 - 5 <= c["startMs"] < it["end"] * 1000).strip()
            name = d["students"][it["student"]]["name"]
            label = it.get("bubble") or ("крючок" if it.get("hook") else "паспорт" if it.get("passport") else "")
            rows.append(f'<li><span class="who">{e(name)}</span><span class="tag">{e(label)}</span><span class="say">{e(text)}</span></li>')
        elif it["kind"] in ("title", "myth"):
            rows.append(f'<li class="cardrow"><span class="tag {it["kind"]}">{"Миф" if it["kind"] == "myth" else "Карточка"}</span><span class="say">{e(it["text"])}</span></li>')
        else:
            rows.append(f'<li class="cta"><span class="tag">Призыв</span><span class="say">{e(it["text"])}</span></li>')
    return (f'<details class="video" id="{d["id"]}"><summary><span class="vid">{d["id"]}</span>'
            f'<span class="vt">{e(d["title"])}</span><span class="dur">{round(d["durationSec"])} с</span></summary>'
            f'<ol class="clips">{"".join(rows)}</ol><p class="file">Файл: {d["id"]}.mp4</p></details>')


sections = ""
for fmt, name, desc in SERIES:
    vs = [d for d in videos if d["format"] == fmt]
    sections += (f'<section id="{fmt}"><div class="series-head"><h2>{e(name)}</h2><span class="count">{len(vs)} роликов</span></div>'
                 f'<p class="muted">{e(desc)}</p><div class="list">{"".join(card(d) for d in vs)}</div></section>')

cov_head = "".join(f'<th scope="col">{e(t)}</th>' for t in QUESTIONS.values())
cov_rows = "".join(
    f'<tr><th scope="row">{e(STUDENTS[sid][1])}</th>'
    + "".join(f'<td class="heat h{min(4, int(c[q] * 100) // 25)}">{round(c[q] * 100)}</td>' for q in QUESTIONS)
    + f'<td class="num">{round(cov_total[sid] * 100)}%</td></tr>'
    for sid, c in cov.items())
total_sec = sum(d["durationSec"] for d in videos)

page = f'''<title>Голоса студентов Capitaliano</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;700&family=Caveat:wght@700&family=JetBrains+Mono:wght@500&display=swap">
<style>
  /* Layout: one reading column; each series is a list of expandable videos; coverage as a heat table. */
  :root {{
    --bg: #fffcf9; --surface: #ffffff; --fg: #1e1e1e; --muted: #5d665f; --line: #e6e1d8;
    --accent: #2f8d4f; --accent-ink: #1b5e34; --accent-soft: #e6f2ea; --red: #dc2626; --red-soft: #fde8e8;
    --h0: #f3efe8; --h1: #dcebe0; --h2: #b9dcc4; --h3: #7fc196; --h4: #2f8d4f; --h4-ink: #ffffff;
    --font-ui: "Inter Tight", system-ui, -apple-system, "Segoe UI", sans-serif;
    --font-hand: "Caveat", "Segoe Print", cursive;
    --font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
  }}
  @media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
    --bg: #141714; --surface: #1c201d; --fg: #eef0ec; --muted: #a3aba4; --line: #2f3530;
    --accent: #45b36a; --accent-ink: #8fd9a6; --accent-soft: #1f3226; --red: #f87171; --red-soft: #3a1f1f;
    --h0: #222723; --h1: #1f3a28; --h2: #24532f; --h3: #2f7542; --h4: #45b36a; --h4-ink: #0f1a12; color-scheme: dark; }} }}
  :root[data-theme="dark"] {{
    --bg: #141714; --surface: #1c201d; --fg: #eef0ec; --muted: #a3aba4; --line: #2f3530;
    --accent: #45b36a; --accent-ink: #8fd9a6; --accent-soft: #1f3226; --red: #f87171; --red-soft: #3a1f1f;
    --h0: #222723; --h1: #1f3a28; --h2: #24532f; --h3: #2f7542; --h4: #45b36a; --h4-ink: #0f1a12; color-scheme: dark; }}
  body {{ background: var(--bg); color: var(--fg); font-family: var(--font-ui); font-size: 15.5px; line-height: 1.5; }}
  .page {{ max-width: 980px; margin: 0 auto; padding-block: 28px 64px;
    padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));
    display: flex; flex-direction: column; gap: 36px; }}
  h1 {{ font-size: clamp(28px, 5vw, 42px); line-height: 1.05; letter-spacing: -0.03em; margin: 0; text-wrap: balance; }}
  h2 {{ font-size: 22px; letter-spacing: -0.02em; margin: 0; }}
  p {{ margin: 0; max-width: 70ch; }}
  .hand {{ font-family: var(--font-hand); color: var(--red); font-size: 26px; transform: skewX(-12deg); display: inline-block; }}
  .muted {{ color: var(--muted); }}
  header, section {{ display: flex; flex-direction: column; gap: 12px; }}
  .stats {{ display: flex; flex-wrap: wrap; gap: 10px 28px; }}
  .stat b {{ display: block; font-size: 30px; letter-spacing: -0.03em; color: var(--accent-ink); font-variant-numeric: tabular-nums; }}
  .stat span {{ color: var(--muted); font-size: 13px; }}
  nav {{ display: flex; flex-wrap: wrap; gap: 8px; }}
  nav a {{ color: var(--accent-ink); text-decoration: none; font-weight: 500; padding: 6px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); }}
  .notes {{ background: var(--accent-soft); border-radius: 14px; padding: 16px 18px; }}
  ul.plain {{ margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; }}
  .series-head {{ display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; border-top: 2px solid var(--accent); padding-top: 12px; }}
  .count {{ color: var(--muted); font-size: 14px; }}
  .list {{ display: flex; flex-direction: column; gap: 8px; }}
  details.video {{ background: var(--surface); border: 1px solid var(--line); border-radius: 12px; }}
  summary {{ display: flex; align-items: baseline; gap: 10px; padding: 12px 14px; cursor: pointer; list-style: none; }}
  summary::-webkit-details-marker {{ display: none; }}
  summary:focus-visible {{ outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 12px; }}
  .vid {{ font-family: var(--font-mono); font-size: 12px; color: var(--accent-ink); background: var(--accent-soft); border-radius: 6px; padding: 2px 6px; flex-shrink: 0; }}
  .vt {{ font-weight: 700; flex: 1; min-width: 0; letter-spacing: -0.01em; }}
  .dur {{ font-variant-numeric: tabular-nums; font-size: 13px; color: var(--muted); white-space: nowrap; }}
  .clips {{ list-style: none; margin: 0; padding: 0 14px 6px; display: flex; flex-direction: column; gap: 10px; }}
  .clips li {{ display: grid; grid-template-columns: auto 1fr; gap: 2px 8px; border-top: 1px solid var(--line); padding-top: 10px; font-size: 14.5px; }}
  .who {{ font-weight: 700; }}
  .tag {{ font-size: 12px; color: var(--muted); align-self: center; }}
  .tag.myth {{ color: var(--red); font-weight: 700; }}
  .cardrow .tag, .cta .tag {{ font-weight: 700; color: var(--accent-ink); }}
  .say {{ grid-column: 1 / -1; }}
  .cta .say {{ font-weight: 700; color: var(--accent-ink); }}
  .file {{ font-family: var(--font-mono); font-size: 12px; color: var(--muted); padding: 0 14px 12px; }}
  .table-wrap {{ overflow-x: auto; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); }}
  table {{ border-collapse: collapse; width: 100%; font-size: 13.5px; }}
  th, td {{ padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--line); }}
  tr:last-child th, tr:last-child td {{ border-bottom: 0; }}
  thead th {{ font-size: 11.5px; font-weight: 500; color: var(--muted); min-width: 64px; }}
  .heat {{ text-align: center; font-variant-numeric: tabular-nums; }}
  .h0 {{ background: var(--h0); }} .h1 {{ background: var(--h1); }} .h2 {{ background: var(--h2); }} .h3 {{ background: var(--h3); }}
  .h4 {{ background: var(--h4); color: var(--h4-ink); font-weight: 700; }}
  .num {{ font-variant-numeric: tabular-nums; font-weight: 700; color: var(--accent-ink); text-align: right; }}
</style>
<div class="page">
  <header>
    <span class="hand">на отсмотр</span>
    <h1>Голоса студентов Capitaliano</h1>
    <p class="muted">10 интервью со студентами в Милане, смонтированные в 4 серии. Нажмите на ролик, чтобы увидеть, кто и что в нём говорит, и какой призыв стоит в конце.</p>
    <div class="stats">
      <div class="stat"><b>{len(videos)}</b><span>роликов</span></div>
      <div class="stat"><b>{round(min(d["durationSec"] for d in videos))}–{round(max(d["durationSec"] for d in videos))} с</b><span>хронометраж</span></div>
      <div class="stat"><b>{overall}%</b><span>ответов студентов в роликах</span></div>
      <div class="stat"><b>{round(total_sec / 60)} мин</b><span>всего готового видео</span></div>
    </div>
    <nav aria-label="Серии"><a href="#story">Истории</a><a href="#question">Вопросы</a><a href="#reviews">Отзывы</a><a href="#myths">Мифы</a><a href="#coverage">Покрытие</a></nav>
  </header>
  <div class="notes">
    <ul class="plain">
      <li>После пилота: больше воздуха в начале и конце каждого ответа, шторка больше не съедает последние слова; самые короткие ответы удлинены или убраны.</li>
      <li>Telegram — только на финальной карточке; в шапке один логотип; в сообщениях с вопросами больше нет подписи «Capitaliano».</li>
      <li>Фото студентов стоят в «паспорте» и в ряду лиц. Сопоставление фото и людей сделано по лицам — проверьте, особенно Полину и Настю. У Лии фото не было, взят кадр из видео.</li>
      <li>Добавлена Ева (новое видео): своя история и ответы в шести общих роликах.</li>
    </ul>
  </div>
  {sections}
  <section id="coverage">
    <h2>Покрытие ответов</h2>
    <p class="muted">Какая доля слов из ответа студента на каждый вопрос анкеты звучит хотя бы в одном ролике. Слова-паразиты («ну», «вот», «типа») не считаются. Остаток — в основном повторы одной мысли и места, где речь неразборчива.</p>
    <div class="table-wrap"><table><thead><tr><th>Студент</th>{cov_head}<th>Итого</th></tr></thead><tbody>{cov_rows}</tbody></table></div>
  </section>
</div>
'''
open(out_path, "w").write(page)
print("videos", len(videos), "overall", overall, {sid: round(v * 100) for sid, v in cov_total.items()})
