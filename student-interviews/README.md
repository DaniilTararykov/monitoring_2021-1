# Голоса студентов Capitaliano

Материалы для серии роликов из 9 интервью со студентами (папка Google Drive, файлы `IMG_*.MOV`, 4K).

- `tools/transcribe.py` — пословная расшифровка (faster-whisper, модель large-v3-turbo, русский) с громкостью каждой реплики.
- `transcripts/` — расшифровки по файлам: реплики с таймкодами, словами и громкостью.
- `plan/plan.py` — контент-план: ролики, фрагменты исходников с таймкодами, покрытие ответов. `python3 plan.py` пишет `plan.json`.
- `plan/render_page.py` — страница контент-плана из `plan.json`.

Исходники и звук в git не хранятся. Подготовка звука для расшифровки:

```bash
ffmpeg -i raw/IMG_8993.MOV -vn -ac 1 -ar 16000 audio/IMG_8993.wav
python -I tools/transcribe.py audio transcripts
```
