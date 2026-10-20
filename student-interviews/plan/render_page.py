# Builds the content-map page (HTML artifact) from plan.json.
import json, html, sys

d = json.load(open(sys.argv[1]))
out_path = sys.argv[2]
S, Q, V, C = d["students"], d["questions"], d["videos"], d["coverage"]
e = html.escape

def tc(sec):
    return f"{int(sec // 60)}:{int(sec % 60):02d}"

def est(v):
    # Filler words and pauses come out in the edit; titles and cards add ~4 s.
    return round(v["speechSec"] * 0.9 + 4)

total_answers = sum(c["answersSec"] for c in C.values())
covered = sum(c["answersSec"] * c["coveredPct"] / 100 for c in C.values())
overall = round(100 * covered / total_answers)

SERIES = [
    ("История студента", "story", "Один студент — 2–4 его лучших ответа целиком. Крючок из самой сильной фразы, «паспорт студента», ответы, финал с реакцией родителей или советом."),
    ("Один вопрос — разные ответы", "question", "Один вопрос из анкеты, ответы разных студентов подряд по 3–10 секунд. Самые «цепкие» фразы, счётчик и лица студентов внизу."),
    ("Отзывы о Capitaliano", "reviews", "Студенты о работе с кураторами: структура в Notion, ответы на любые вопросы, поддержка на каждом этапе. Для доверия и продаж."),
    ("Мифы о поступлении", "myths", "Миф в плашке → красное зачёркивание → студент, который его опроверг. 2–3 мифа на ролик."),
]

def clip_rows(v):
    rows = []
    for sid, s, en, note in v["clips"]:
        st = S[sid]
        rows.append(f'<li><span class="who">{e(st[1].split(" (")[0])}</span>'
                    f'<span class="tc">{st[0][4:]} · {tc(s)}–{tc(en)}</span>'
                    f'<span class="note">{e(note)}</span></li>')
    return "".join(rows)

cards = {}
for v in V:
    cards.setdefault(v["series"], []).append(
        f'<article class="video" id="{v["id"]}"><header><span class="vid">{v["id"]}</span>'
        f'<h4>{e(v["title"])}</h4><span class="dur">≈ {est(v)} с</span></header>'
        f'<ol class="clips">{clip_rows(v)}</ol></article>')

series_html = "".join(
    f'<section class="series" id="{key}"><div class="series-head"><h3>{e(name)}</h3>'
    f'<span class="count">{len(cards.get(name, []))} роликов</span></div><p class="lead">{e(desc)}</p>'
    f'<div class="grid">{"".join(cards.get(name, []))}</div></section>'
    for name, key, desc in SERIES)

students_rows = "".join(
    f'<tr><td><b>{e(st[1])}</b><span class="sub">{e(st[2])}</span></td><td>{e(st[3])}<span class="sub">{e(st[4])}</span></td>'
    f'<td class="num">{C[sid]["coveredPct"]}%</td><td class="file">{st[0]}</td></tr>'
    for sid, st in S.items())

def heat(p):
    return f'<td class="heat h{min(4, p // 25)}" title="{p}%">{p}</td>'

cov_rows = "".join(
    f'<tr><th scope="row">{e(S[sid][1].split(" (")[0])}</th>' + "".join(heat(c["byQuestion"][q]) for q in Q) + f'<td class="num total">{c["coveredPct"]}%</td></tr>'
    for sid, c in C.items())
cov_head = "".join(f'<th scope="col" title="{e(t)}">{e(t)}</th>' for t in Q.values())

page = f'''<title>Голоса студентов Capitaliano</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;700&family=Caveat:wght@700&family=JetBrains+Mono:wght@500&display=swap">
<style>
  /* Layout: single reading column; series as card grids; coverage as a heat table. */
  :root {{
    --bg: #fffcf9; --surface: #ffffff; --fg: #1e1e1e; --muted: #5d665f; --line: #e6e1d8;
    --accent: #2f8d4f; --accent-ink: #1b5e34; --accent-soft: #e6f2ea; --red: #dc2626;
    --h0: #f3efe8; --h1: #dcebe0; --h2: #b9dcc4; --h3: #7fc196; --h4: #2f8d4f; --h4-ink: #ffffff;
    --font-ui: "Inter Tight", system-ui, -apple-system, "Segoe UI", sans-serif;
    --font-hand: "Caveat", "Segoe Print", cursive;
    --font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
  }}
  @media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
    --bg: #141714; --surface: #1c201d; --fg: #eef0ec; --muted: #a3aba4; --line: #2f3530;
    --accent: #45b36a; --accent-ink: #8fd9a6; --accent-soft: #1f3226; --red: #f87171;
    --h0: #222723; --h1: #1f3a28; --h2: #24532f; --h3: #2f7542; --h4: #45b36a; --h4-ink: #0f1a12; color-scheme: dark; }} }}
  :root[data-theme="dark"] {{
    --bg: #141714; --surface: #1c201d; --fg: #eef0ec; --muted: #a3aba4; --line: #2f3530;
    --accent: #45b36a; --accent-ink: #8fd9a6; --accent-soft: #1f3226; --red: #f87171;
    --h0: #222723; --h1: #1f3a28; --h2: #24532f; --h3: #2f7542; --h4: #45b36a; --h4-ink: #0f1a12; color-scheme: dark; }}
  body {{ background: var(--bg); color: var(--fg); font-family: var(--font-ui); font-size: 15.5px; line-height: 1.5; }}
  .page {{ max-width: 1040px; margin: 0 auto; padding-block: 28px 64px;
    padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));
    display: flex; flex-direction: column; gap: 40px; }}
  h1 {{ font-size: clamp(28px, 5vw, 44px); line-height: 1.05; letter-spacing: -0.03em; margin: 0; text-wrap: balance; }}
  h2 {{ font-size: 24px; letter-spacing: -0.02em; margin: 0; }}
  h3 {{ font-size: 20px; letter-spacing: -0.02em; margin: 0; }}
  h4 {{ font-size: 16px; letter-spacing: -0.01em; margin: 0; flex: 1; min-width: 0; }}
  p {{ margin: 0; max-width: 68ch; }}
  .hand {{ font-family: var(--font-hand); color: var(--red); font-size: 26px; transform: skewX(-12deg); display: inline-block; }}
  .intro {{ display: flex; flex-direction: column; gap: 14px; }}
  .stats {{ display: flex; flex-wrap: wrap; gap: 10px 28px; }}
  .stat b {{ display: block; font-size: 30px; letter-spacing: -0.03em; color: var(--accent-ink); font-variant-numeric: tabular-nums; }}
  .stat span {{ color: var(--muted); font-size: 13px; }}
  .muted, .lead {{ color: var(--muted); }}
  nav {{ display: flex; flex-wrap: wrap; gap: 8px; }}
  nav a {{ color: var(--accent-ink); text-decoration: none; font-weight: 500; padding: 6px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); }}
  nav a:focus-visible {{ outline: 2px solid var(--accent); outline-offset: 2px; }}
  section {{ display: flex; flex-direction: column; gap: 14px; }}
  .table-wrap {{ overflow-x: auto; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); }}
  table {{ border-collapse: collapse; width: 100%; font-size: 14px; }}
  th, td {{ padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--line); vertical-align: top; }}
  tr:last-child td, tr:last-child th {{ border-bottom: 0; }}
  thead th {{ font-size: 12px; font-weight: 500; color: var(--muted); }}
  .sub {{ display: block; color: var(--muted); font-size: 13px; }}
  .num {{ font-variant-numeric: tabular-nums; font-weight: 700; color: var(--accent-ink); }}
  .file {{ font-family: var(--font-mono); font-size: 12px; color: var(--muted); white-space: nowrap; }}
  .design {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }}
  .design div {{ background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; }}
  .design b {{ letter-spacing: -0.01em; }}
  .design p {{ color: var(--muted); font-size: 14px; }}
  .series-head {{ display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap;
    border-top: 2px solid var(--accent); padding-top: 12px; }}
  .count {{ color: var(--muted); font-size: 14px; }}
  .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }}
  .video {{ background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; min-width: 0; }}
  .video header {{ display: flex; align-items: baseline; gap: 10px; }}
  .vid {{ font-family: var(--font-mono); font-size: 12px; color: var(--accent-ink); background: var(--accent-soft); border-radius: 6px; padding: 2px 6px; }}
  .dur {{ font-variant-numeric: tabular-nums; font-size: 13px; color: var(--muted); white-space: nowrap; }}
  .clips {{ list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }}
  .clips li {{ display: grid; grid-template-columns: auto 1fr; gap: 0 8px; font-size: 14px; }}
  .who {{ font-weight: 700; }}
  .tc {{ font-family: var(--font-mono); font-size: 11.5px; color: var(--muted); justify-self: end; align-self: center; }}
  .note {{ grid-column: 1 / -1; color: var(--muted); }}
  .heat {{ text-align: center; font-variant-numeric: tabular-nums; font-size: 13px; min-width: 44px; }}
  .h0 {{ background: var(--h0); }} .h1 {{ background: var(--h1); }} .h2 {{ background: var(--h2); }} .h3 {{ background: var(--h3); }}
  .h4 {{ background: var(--h4); color: var(--h4-ink); font-weight: 700; }}
  .cov th[scope="col"] {{ font-size: 11.5px; min-width: 70px; }}
  .total {{ text-align: right; }}
  ul.plain {{ margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; max-width: 72ch; }}
  .next {{ background: var(--accent-soft); border-radius: 14px; padding: 18px 20px; display: flex; flex-direction: column; gap: 10px; }}
</style>
<div class="page">
  <header class="intro">
    <span class="hand">контент-план</span>
    <h1>Голоса студентов Capitaliano</h1>
    <p class="muted">9 интервью со студентами на Навильи в Милане. Каждый ответил на одну и ту же анкету из 8 вопросов — поэтому из материала получаются и личные истории, и сравнения ответов, и отзывы, и разбор мифов. Хронометраж каждого ролика 30–60 секунд.</p>
    <div class="stats">
      <div class="stat"><b>9</b><span>интервью · 27 мин</span></div>
      <div class="stat"><b>{len(V)}</b><span>роликов в 4 сериях</span></div>
      <div class="stat"><b>{overall}%</b><span>ответов студентов в роликах</span></div>
      <div class="stat"><b>30–60 с</b><span>каждый ролик</span></div>
    </div>
    <nav aria-label="Разделы">
      <a href="#students">Студенты</a><a href="#design">Дизайн</a><a href="#story">Истории</a><a href="#question">Вопросы</a>
      <a href="#reviews">Отзывы</a><a href="#myths">Мифы</a><a href="#coverage">Покрытие</a><a href="#next">Дальше</a>
    </nav>
  </header>

  <section id="students">
    <h2>Студенты</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Студент</th><th>Вуз и программа</th><th>В роликах</th><th>Файл</th></tr></thead>
      <tbody>{students_rows}</tbody>
    </table></div>
    <p class="muted">«В роликах» — какая доля ответов студента (без вопросов, пауз и разговоров вокруг) попадает хотя бы в один ролик.</p>
  </section>

  <section id="design">
    <h2>Новый дизайн серии</h2>
    <p class="muted">Стиль Capitaliano сохраняется: кремовый, фирменный зелёный, Inter Tight, красный курсив. Но кадр другой — студент на весь экран, потому что Милан за спиной сам работает на картинку.</p>
    <div class="design">
      <div><b>Вопрос как сообщение</b><p>Вопрос появляется сверху «сообщением» от Capitaliano с лавровым аватаром, текст набирается.</p></div>
      <div><b>Паспорт студента</b><p>Карточка с именем, городом, вузом и программой. В момент про визу — красный штамп «VISTO».</p></div>
      <div><b>Карта Италии</b><p>Мини-карта с точкой города вуза: Милан, Болонья, Турин, Пьяченца. В сериях вопросов загораются города всех студентов.</p></div>
      <div><b>Лица внизу</b><p>В роликах «Один вопрос» — ряд круглых аватаров студентов, активный подсвечен, счётчик «3/9».</p></div>
      <div><b>Переходы между людьми</b><p>Шторка кремового цвета с лавром или быстрый зум — склейки между студентами не режут глаз.</p></div>
      <div><b>Мифы</b><p>Плашка «МИФ», красное зачёркивание, штамп «ПРАВДА» и ответ студента.</p></div>
    </div>
    <p class="muted">Всё внутри безопасной зоны Reels, пословные субтитры с зелёной плашкой на активном слове, вырезаны паузы и оговорки.</p>
  </section>

  {series_html}

  <section id="coverage" class="cov">
    <h2>Покрытие по вопросам</h2>
    <p class="muted">Какая доля ответа на каждый вопрос анкеты вошла в ролики. Зелёный — ответ использован полностью.</p>
    <div class="table-wrap"><table>
      <thead><tr><th>Студент</th>{cov_head}<th>Итого</th></tr></thead>
      <tbody>{cov_rows}</tbody>
    </table></div>
    <h3>Что не вошло и почему</h3>
    <ul class="plain">
      <li>Вопросы интервьюера и разговоры вокруг («в камеру смотреть?», «спасибо», «мы закончили») — в роликах вопрос показывается плашкой.</li>
      <li>Повторы: многие советуют «начинать заранее» — в серии взяты самые ёмкие формулировки, остальные повторы не дублируются.</li>
      <li>Длинные уточнения внутри ответов (например, полная история Полины про родителей) сокращены до сути.</li>
      <li>Короткие ответы, которые повторяют уже сказанное в других роликах того же студента.</li>
    </ul>
  </section>

  <section id="next" class="next">
    <h2>Что нужно от вас</h2>
    <ul class="plain">
      <li>Уточнить имя студентки из IMG_9005: в записи звучит «Ли» — так и писать или полное имя?</li>
      <li>Подтвердить, что все 9 студентов согласны на публикацию.</li>
      <li>Утвердить серии и состав роликов — или написать, что поменять.</li>
    </ul>
    <p><b>Предлагаю начать с пилота из трёх роликов</b> — по одному на основной формат: S1 «Евдокия», Q1 «Что сказали родители?», M1 «Мифы». Утвердим дизайн на них, потом соберу остальные партиями.</p>
  </section>
</div>
'''
open(out_path, "w").write(page)
print("ok", len(page))
