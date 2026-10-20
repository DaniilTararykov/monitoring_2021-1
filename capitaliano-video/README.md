# Capitaliano — вертикальное видео (Remotion)

Шаблон 9:16 (1080×1920, 30 fps) по стайлгайду **Capitaliano**:

- **Верхняя половина** — кремовый фон `rgb(255, 252, 249)` с точечной сеткой, логотип, плашка `@capitaliano.info`, всплывающие снизу белые/зелёные карточки, эквалайзер с зелёным свечением, синхронный с голосом.
- **Нижняя половина** — видео спикера, на стыке — градиентное размытие (fade-blur).
- **Субтитры** — пословно, `Inter Tight`, активное слово на зелёной плашке `rgb(47, 141, 79)`.
- **Акценты** — красный каллиграфический курсив (Caveat, наклон ~18°) для заметок и красное вычёркивание.

## Подготовка

```bash
npm i
# 1. Исходник (.mov из Google Drive) → public/speaker.mp4 + public/speaker-audio.wav
scripts/prepare.sh /path/to/source.mov
# 2. Пословные субтитры (Whisper, русский) → public/captions.json
#    Для текущего ролика они уже готовы и вычитаны вручную.
node scripts/transcribe.mjs          # или: node scripts/transcribe.mjs large-v3
```

Длительность композиции берётся из длины `speaker.mp4` автоматически.
`videoOffsetY` — сколько пикселей срезать сверху у видео спикера, чтобы лицо оказалось под стыком.

## Безопасная зона Instagram Reels

Весь текст и графика лежат внутри safe zone 1080×1920: отступы 250 px сверху, 420 px снизу,
70 px слева, 55 px справа (193 px справа ниже y=1110). Слоты заданы в `src/Capitaliano/brand.ts` (`SLOTS`).

## Смысловые блоки (beats)

Ролик размечен блоками в `defaultProps.beats` (`src/Root.tsx`):

```ts
{ fromSec: 20.7, durationSec: 8.1, layout: "split-a", graphic: {...}, accent?: true }
```

`layout` — раскладка сцены (`src/Capitaliano/Layouts.ts`), между ними видео плавно перетекает:

| layout          | что в кадре                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `split-a`       | видео внизу, графика сверху, субтитры над головой, эквалайзер               |
| `split-b`       | то же, но графика и субтитры поменялись местами                             |
| `circle-top`    | Артём в кружке сверху, кольцо и круговая аура звука, компактная плашка ниже |
| `circle-bottom` | кружок снизу, крупная графика сверху                                        |
| `full`          | Артём на весь экран, фейд под шапкой, облако внизу под плашкой и субтитрами |

`graphic.kind`: `card` (белая/зелёная плашка, красная курсивная `note`, `strike`), `stat` (большая цифра
со счётчиком), `steps` (1–2–3), `compare` (✓ / ✗), `meter` (шкала риска). В компактных местах
(`split-b`, `circle-top`, `full`) лучше использовать короткие `card`.

- Эффекты появления чередуются: выезд снизу → всплытие с масштабом → выезд сбоку с размытием,
  у каждого свой звук (whoosh / switch / page-turn); `accent` даёт «ding».
- Камера на видео спикера чередуется по блокам: наезд → сдвиг → отъезд.
- Субтитры: каждое предложение отдельно, фраза гаснет до начала следующей, место субтитров
  следует за раскладкой.

## Веб-редактор

`editor/` — страница с живым превью (Remotion Player) и формами для блоков, опубликована как
артефакт claude.ai. Сохранённые там правки лежат в его базе (`project/beats`); перенос в код:

```bash
node scripts/apply-edits.mjs beats.json   # JSON из базы редактора → src/beats.ts
npm run editor                            # пересобрать editor/dist/editor.js
```

Превью берёт облегчённое видео (лимит артефакта — 15 МБ на файл) и звук из `editor/dist/`:

```bash
ffmpeg -i public/speaker.mp4 -vf scale=540:-2 -c:v libx264 -b:v 750k -maxrate 900k -bufsize 1500k \
  -c:a aac -b:a 64k -ac 1 -movflags +faststart editor/dist/speaker.mp4
cp public/speaker-audio.wav editor/dist/
```

## Превью и рендер

```bash
npx remotion studio
npx remotion render Capitaliano out/capitaliano.mp4
```

Шрифты Inter Tight и Caveat (SIL OFL) лежат в `public/fonts`, рендер работает без доступа к Google Fonts.
