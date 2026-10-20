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
node scripts/transcribe.mjs          # или: node scripts/transcribe.mjs large-v3
# 3. Логотип: замените public/logo.svg на официальный (сейчас там временный wordmark)
```

Длительность композиции берётся из длины `speaker.mp4` автоматически.

## Карточки

Карточки задаются в `defaultProps.cards` в `src/Root.tsx` (или в панели Props в Studio):

```ts
{ text: "Тезис", fromSec: 3, durationSec: 3, variant: "white" | "green", note?: "важно!", strike?: true }
```

- `variant` — белая (тёмно-зелёный текст `#1B5E34`) или зелёная карточка.
- `note` — красная курсивная пометка под карточкой.
- `strike` — красное вычёркивание текста.

## Превью и рендер

```bash
npx remotion studio
npx remotion render Capitaliano out/capitaliano.mp4
```

Шрифты Inter Tight и Caveat (SIL OFL) лежат в `public/fonts`, рендер работает без доступа к Google Fonts.
