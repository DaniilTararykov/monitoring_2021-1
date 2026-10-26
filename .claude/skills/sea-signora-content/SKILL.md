---
name: sea-signora-content
description: Use for ANY task about Instagram stories, reels, video editing (монтаж), on-screen texts, captions, hashtags, CTAs or visual design for the restaurant brand Sea, Signora (Milano, @seasignora.milano) — e.g. «сделай сторис для Sea, Signora из этих исходников», «смонтируй рилс», «напиши тексты/подписи», «поправь сторис 3 на 5 секунде». Works only in this brand's style from brands/sea-signora/ (BRAND.md, tokens.ts, Remotion templates); never borrows from other brands in the repo.
---

# Sea, Signora — сторис, рилс, тексты

Бренд живёт в `brands/sea-signora/`. Он **не связан** с Capitaliano, Haus of Danik и другими папками репозитория: не бери оттуда стиль, шрифты, цвета и код. Пиши пользователю по-русски и коротко. Тексты на экране и подписи — на английском, как в бренде.

## 0. Перед началом — всегда
1. Прочитай `brands/sea-signora/BRAND.md` целиком и `brands/sea-signora/tokens.ts`. Работай только по ним.
2. Посмотри `brands/sea-signora/remotion/src/stories.ts` (там примеры всех рубрик) и `src/types.ts` (модель данных).
3. Установка (если нет `node_modules`): `cd brands/sea-signora/remotion && npm install`.
   Рендер использует предустановленный Chromium: `/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell` (уже прописан в `remotion.config.ts` и `scripts/render-all.mjs`, переопределяется через `REMOTION_BROWSER`). Если номер версии в `/opt/pw-browsers` другой, поправь путь. Playwright не переустанавливай.

## 1. Исходники → раскадровка и расшифровка
- Ссылка на папку Google Drive → получи список файлов через Google Drive MCP (`search_files`, запрос `parentId = '<ID>'`, листай `pageToken`), сложи в TSV `id<TAB>имя` и скачай:
  `brands/sea-signora/tools/drive_dl.sh list.tsv <scratchpad>/src`
  (качает через `drive.usercontent.google.com/...&confirm=t`). Если вместо файла пришёл HTML со страницей входа, попроси пользователя открыть доступ по ссылке.
- Всё скачанное держи в scratchpad, **не в репозитории**. Zip-архивы распаковывай туда же. Следи за местом (`df -h /`): после прокси удаляй исходники и архивы.
- faster-whisper ставь в отдельный venv: `python3 -m venv <scratchpad>/venv-whisper && <scratchpad>/venv-whisper/bin/pip install faster-whisper`.
- Раскадровка, прокси (короткая сторона 2200 px, чтобы был запас на кроп 9:16), WAV и расшифровка:
  `WHISPER_PY=<scratchpad>/venv-whisper/bin/python brands/sea-signora/tools/prep_sources.sh <src> <scratchpad>/work`
- Просмотри `work/frames/*.jpg` и `work/photos_sheet_*.jpg`. Для каждого файла выпиши: что в кадре, где лица, где продукт, есть ли речь. В старых сторис бренда речи нет, только музыка, поэтому расшифровка обычно пустая, а субтитры нужны только при реальной речи.

## 2. План — и ждать «ок»
Пришли план таблицей и **остановись, пока пользователь не ответит «ок»**:
| # | день | рубрика (из BRAND.md) | исходники | что в кадре | текст на экране (заголовок / подзаголовок) | призыв | длит. |
Правила плана: 3–5 сторис в день, рубрики чередуются, факты (блюда, часы, события) только с сайта или из меню, отзывы — только реальные (дословно), цены на экран не выносим.

## 3. Сборка на шаблонах бренда
- Новые сторис добавляй как объекты `Story` в `brands/sea-signora/remotion/src/stories.ts` (или в отдельный файл недели с тем же типом и импортом в `Root.tsx`). Фото клади в `remotion/public/photos/` (папка в .gitignore). Видео: допиши в `components/Visual.tsx` вариант сцены с `<OffthreadVideo>`, по аналогии с `Photo`.
- Шаблоны/рубрики, которые уже есть:
  - **блюдо-герой**: `overlay.position: 'top'`, `headline` + `sub`, `shift` 280–340, чтобы блюдо не уходило под текст;
  - **серия «шаги»**: `overlay` у каждой сцены;
  - **часы**: `wordmark` + `hours` (`split` | `weekend` | `compact`);
  - **review**: верх `headline 'Sea, Signora'` + `note 'review'`, низ `stars` + `review` (+`author`);
  - **список «On the menu»**: `headline` + `list`, `shift` ≈ 520;
  - **анонс**: `position: 'center'`, кадр затемняется автоматически;
  - **нарезка-атмосфера**: 5–7 сцен по 45–66 кадров, `anim: 'static'`;
  - **Your problem / Our solution**: `chat: [...]`.
- CTA = `cta: {label, color}`. Плашка повторяет вид link-стикера. При публикации поверх неё ставится **настоящий** link-стикер Instagram с тем же текстом.
- Музыка: `public/music/{warm-lounge,brera-night,slow-sunday}.mp3` — собственные сгенерированные подложки без лицензионных ограничений (`scripts/make_music.py` делает новые). Чужие треки, в том числе из старых сторис, не вшивай. Предложи пользователю добавить трек из музыкальной библиотеки Instagram при публикации.
- Озвучки нет. Субтитры делай только при реальной речи: JetBrains Mono, капс, внизу над зоной 340 px, ≤ 2 строк.
- QA-кадры с наложенными зонами 250/340: `node scripts/render-all.mjs --frames <id-префиксы>` → `out/qa/`. Собери их в контакт-лист (`montage`) и посмотри глазами.
- Финал: `node scripts/render-all.mjs <id-префиксы>` → `out/<id>.mp4` (1080×1920, 30 fps, h264 + aac).
- Превью бренда: `npx remotion still BrandSheet ../preview/brand-sheet.png --frame=150`.

### Неделя из большой папки видео (пример: `src/week4.ts`)
- Не качай всё целиком: сначала быстрые раскадровки (8 кадров с ключевых точек на файл, исходник сразу удалять), потом бери **только лучшие** вертикальные клипы и режь из них нужные куски. Горизонтальные и перевёрнутые не берём.
- Кадры — максимально чистые, без визуального шума: блюдо, декор, аквариум, понятная кухня. Тёмные шумные кадры и толпу без фокуса не берём.
- Статика и нарезки: самый резкий кадр окна — `python -I tools/best_still.py <clip> <from> <to> public/photos/w4/<name>.jpg`. Видео: `tools/stabilize.sh` → `public/videos/w4/`.
- Горизонт проверяй по сетке, `rot` (градусы, + по часовой) выравнивает, `scale` подрезает кадр ближе к сюжету (у сцены есть оба поля). Наклонные предметы (зеркало на стене) выравнивай по тому, что в них отражается, и увеличивай.
- План дня (правило клиента 26.10): глава из 4 сторис в порядке публикации — видео → статика → видео → статика (`1v`, `2p`, `3v`, `4p` в id); последняя анонсирует завтра (`tomorrow · …`, оранжевый kicker). Кнопки — только в 3 дня недели, по одной. Видео без музыки (`music: 'none'`, проверка `NOAUDIO=1 tools/check_video.sh`). Темы по неделе разные (график, адрес, вайб, концепт, креатив, ценности: уровень, свежие продукты, сервис); событие — максимум одно касание. Не повторяйся: каждый клип/фото — один раз за неделю, видео — один план, форматы чередуются (окно, текстовая карточка на `night.jpg`, огромное слово, список, смена текста внутри плана, чат Your problem / Our solution, отзыв, адрес с большой цифрой).
- Рендер с облегчённой папкой ресурсов (жёсткие ссылки только на нужные файлы недели, `bundle({publicDir})`), иначе каждая сборка Remotion копирует весь `public/` (3+ ГБ) в /tmp и место кончается.
- Тексты в md: `node --experimental-strip-types scripts/export-copy.mjs ../stories-week4.md src/week4.ts week4`.

## 4. Тексты (голос бренда)
Для каждой сторис дай:
- тексты на экране;
- подпись к публикации (1–2 предложения, на «you», без эмодзи);
- до 5 хештегов (`#seasignora` всегда первым);
- 2–3 варианта призыва из `tokens.ts → ctaLabels`.
`node --experimental-strip-types scripts/export-copy.mjs` соберёт всё это в `brands/sea-signora/stories-week.md`. Запрещённые слова и приёмы — в BRAND.md, раздел Г.

## 5. Проверка перед отправкой (обязательно)
- `brands/sea-signora/tools/check_video.sh remotion/out/*.mp4`: 1080×1920, 30 fps, длительность 6–17 с, аудио есть, средняя громкость −16…−24 dB, нет чёрного хвоста.
- QA-кадры: важный текст и CTA не заходят в верхние 250 px и нижние 340 px; текст не закрывает лица и сам продукт. Если закрывает, меняй `shift`, `fx`, позицию оверлея или фото.
- Опечатки: перечитай `stories-week.md`. Названия блюд сверь с меню на seasignorarest.com/en/ (итальянское написание, «Tiramisù» с акцентом).
- Горизонтальные (16:9) клипы не используем, если их нельзя вписать эстетично; проверяй `ffprobe` ширину×высоту перед монтажом.
- Шрифты только Skanaus / JetBrains Mono / Spectral, текст только ivory.

## 6. Отправка
- mp4 отправляй через `SendUserFile` (status `normal`, по 5–8 файлов за раз, в подписи укажи день).
- Тексты — **отдельным сообщением** простым текстом, по сторис, чтобы было удобно копировать: номер, текст на экране, подпись, хештеги, варианты призыва.
- Код и данные коммить в текущую ветку; mp4, исходники, прокси и `public/photos/` в git не попадают (см. `brands/sea-signora/.gitignore`).

## 7. Правки
Проси правки списком **«сторис, секунда, что поменять»** и вноси их **одним заходом**: правишь `stories.ts`, делаешь QA-кадры только изменённых сторис, рендеришь только их (`render-all.mjs <префиксы>`), прогоняешь `check_video.sh` и присылаешь обновлённые mp4 вместе со списком «что изменено».

## 8. Редактор «Монтажная» (рилсы «Два рецепта одного вечера»)
- Артефакт: https://claude.ai/artifact/WDXKvNLakA838xooPJzbgJ (исходник `brands/sea-signora/editor/template.html`, сборка `editor/build.py`; превью клипов 270×480 лежат в ассетах артефакта).
- Пользователь правит кадры/заголовок/музыку и жмёт «Отправить на рендер» → документ в коллекции `renders` (status `requested`). Когда он пишет «рендер»: `ArtifactData list renders` с `out_dir`, для каждого `requested` — `tools/render_editor.sh <json>`, проверка, отправка mp4, затем `update` status `done` (с `if_version`).
- Композиция `EditorReel` (`remotion/src/EditorReel.tsx`) повторяет логику превью: кадр i начинается на доле i×beatsPerCut, последний держится до конца трека.
- Финальная версия («как финал»): в конфиг добавь `fades:false, drift:0, gradeAmount:1.3, film:true` (без переходов, грейд +30 %, плёночная кривая, виньетка, мягкая тень под заголовком). Горизонт выравнивай `rot` у клипа (градусы, + по часовой), кроп — `zoom`/`fx`/`fy`. Если видео длиннее трека, не используй `loop`: склей трек по 8-тактовым фразам (каждая копия встаёт на 32-ю долю предыдущей), положи в `public/music/final-*.mp3`, а сетку долей передай в `beats` и `audio`. Пример: `editor/saved/two-recipes-final.json`.
- Нужные полноразмерные клипы — в `remotion/public/videos/reel/<id>.mp4` (в .gitignore); если сессия новая — заново скачать папку Content с Drive и сделать прокси 1080p.
