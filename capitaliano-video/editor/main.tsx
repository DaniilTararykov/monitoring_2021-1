import { Player, PlayerRef } from "@remotion/player";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { BEATS } from "../src/beats";
import { Capitaliano } from "../src/Capitaliano";
import type { Beat } from "../src/Capitaliano/Beats";
import type { Graphic } from "../src/Capitaliano/Graphics";
import type { Layout } from "../src/Capitaliano/Layouts";

const FPS = 30;
const DURATION_IN_FRAMES = 3763;
const DOC_PATH = "project/beats";

const LAYOUTS: { value: Layout; label: string }[] = [
  { value: "split-a", label: "Сплит: графика сверху" },
  { value: "split-b", label: "Сплит: субтитры сверху" },
  { value: "circle-top", label: "Кружок сверху" },
  { value: "circle-bottom", label: "Кружок снизу" },
  { value: "full", label: "Артём на весь экран" },
];

const KINDS: { value: Graphic["kind"]; label: string }[] = [
  { value: "card", label: "Плашка" },
  { value: "stat", label: "Большая цифра" },
  { value: "steps", label: "Шаги 1–2–3" },
  { value: "compare", label: "Сравнение ✓ / ✗" },
  { value: "meter", label: "Шкала" },
];

const defaultGraphic = (kind: Graphic["kind"], text: string): Graphic => {
  switch (kind) {
    case "card":
      return { kind, text, variant: "white" };
    case "stat":
      return { kind, valueText: "100+", label: text };
    case "steps":
      return { kind, active: 1, text };
    case "compare":
      return {
        kind,
        good: { title: "Плюс", sub: text },
        bad: { title: "Минус", sub: "" },
        badAtSec: 2,
      };
    case "meter":
      return { kind, label: text, endLabel: "риск ↑" };
  }
};

const mainText = (g: Graphic): string => {
  switch (g.kind) {
    case "card":
      return g.text;
    case "stat":
      return `${g.valueText ?? `${g.value ?? ""}${g.suffix ?? ""}`} ${g.label}`;
    case "steps":
      return `${g.active || ""} ${g.text}`;
    case "compare":
      return `${g.good.title} / ${g.bad.title}`;
    case "meter":
      return g.label;
  }
};

const fmt = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec - m * 60;
  return `${m}:${s.toFixed(1).padStart(4, "0")}`;
};

const round1 = (n: number) => Math.round(n * 10) / 10;

type DbDoc = {
  get(): Promise<{
    exists: boolean;
    data(): Record<string, unknown> | undefined;
  }>;
  set(data: Record<string, unknown>): Promise<void>;
};
type Db = { doc(path: string): DbDoc };

declare global {
  interface Window {
    claude?: { use(name: string): Promise<unknown> };
  }
}

type SaveState =
  | { kind: "loading" }
  | { kind: "clean"; savedAt: string | null }
  | { kind: "dirty" }
  | { kind: "saving" }
  | { kind: "error"; message: string }
  | { kind: "offline" };

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="field">
    <span className="field-label">{label}</span>
    {children}
  </label>
);

const TextInput: React.FC<{
  id: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}> = ({ id, value, onChange, multiline }) =>
  multiline ? (
    <textarea
      id={id}
      rows={2}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ) : (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );

const NumberInput: React.FC<{
  id: string;
  value: number;
  step?: number;
  min?: number;
  onChange: (v: number) => void;
}> = ({ id, value, step = 0.1, min = 0, onChange }) => (
  <div className="stepper">
    <button
      type="button"
      aria-label="Меньше"
      onClick={() => onChange(Math.max(min, round1(value - step)))}
    >
      −
    </button>
    <input
      id={id}
      type="number"
      inputMode="decimal"
      step={step}
      min={min}
      value={value}
      onChange={(e) => {
        const v = parseFloat(e.target.value.replace(",", "."));
        if (!Number.isNaN(v)) onChange(Math.max(min, v));
      }}
    />
    <button
      type="button"
      aria-label="Больше"
      onClick={() => onChange(round1(value + step))}
    >
      +
    </button>
  </div>
);

const GraphicFields: React.FC<{
  id: string;
  g: Graphic;
  onChange: (g: Graphic) => void;
}> = ({ id, g, onChange }) => {
  switch (g.kind) {
    case "card":
      return (
        <>
          <Field label="Текст плашки">
            <TextInput
              id={`${id}-text`}
              multiline
              value={g.text}
              onChange={(text) => onChange({ ...g, text })}
            />
          </Field>
          <Field label="Цвет">
            <select
              id={`${id}-variant`}
              value={g.variant}
              onChange={(e) =>
                onChange({ ...g, variant: e.target.value as "white" | "green" })
              }
            >
              <option value="white">Белая</option>
              <option value="green">Зелёная</option>
            </select>
          </Field>
          <Field label="Красная пометка курсивом (необязательно)">
            <TextInput
              id={`${id}-note`}
              value={g.note ?? ""}
              onChange={(note) => onChange({ ...g, note: note || undefined })}
            />
          </Field>
          <label className="check">
            <input
              id={`${id}-strike`}
              type="checkbox"
              checked={!!g.strike}
              onChange={(e) =>
                onChange({ ...g, strike: e.target.checked || undefined })
              }
            />
            Зачеркнуть красной линией
          </label>
        </>
      );
    case "stat":
      return (
        <>
          <Field label="Число или текст (например 30+, 35 и 40)">
            <TextInput
              id={`${id}-value`}
              value={g.valueText ?? `${g.value ?? ""}${g.suffix ?? ""}`}
              onChange={(v) => {
                const m = v.match(/^(\d+)(\D{0,2})$/);
                onChange(
                  m
                    ? {
                        kind: "stat",
                        label: g.label,
                        value: Number(m[1]),
                        suffix: m[2] || undefined,
                      }
                    : { kind: "stat", label: g.label, valueText: v },
                );
              }}
            />
          </Field>
          <Field label="Подпись">
            <TextInput
              id={`${id}-label`}
              value={g.label}
              onChange={(label) => onChange({ ...g, label })}
            />
          </Field>
        </>
      );
    case "steps":
      return (
        <>
          <Field label="Активный шаг">
            <select
              id={`${id}-active`}
              value={g.active}
              onChange={(e) =>
                onChange({
                  ...g,
                  active: Number(e.target.value) as 0 | 1 | 2 | 3,
                })
              }
            >
              <option value={0}>Ни один</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </Field>
          <Field label="Текст под шагами">
            <TextInput
              id={`${id}-text`}
              multiline
              value={g.text}
              onChange={(text) => onChange({ ...g, text })}
            />
          </Field>
        </>
      );
    case "compare":
      return (
        <>
          <Field label="✓ Заголовок">
            <TextInput
              id={`${id}-good-title`}
              value={g.good.title}
              onChange={(title) =>
                onChange({ ...g, good: { ...g.good, title } })
              }
            />
          </Field>
          <Field label="✓ Подпись">
            <TextInput
              id={`${id}-good-sub`}
              value={g.good.sub}
              onChange={(sub) => onChange({ ...g, good: { ...g.good, sub } })}
            />
          </Field>
          <Field label="✗ Заголовок">
            <TextInput
              id={`${id}-bad-title`}
              value={g.bad.title}
              onChange={(title) => onChange({ ...g, bad: { ...g.bad, title } })}
            />
          </Field>
          <Field label="✗ Подпись">
            <TextInput
              id={`${id}-bad-sub`}
              value={g.bad.sub}
              onChange={(sub) => onChange({ ...g, bad: { ...g.bad, sub } })}
            />
          </Field>
          <Field label="✗ появляется через, сек">
            <NumberInput
              id={`${id}-bad-at`}
              value={g.badAtSec}
              onChange={(badAtSec) => onChange({ ...g, badAtSec })}
            />
          </Field>
        </>
      );
    case "meter":
      return (
        <>
          <Field label="Подпись шкалы">
            <TextInput
              id={`${id}-label`}
              value={g.label}
              onChange={(label) => onChange({ ...g, label })}
            />
          </Field>
          <Field label="Пометка в конце">
            <TextInput
              id={`${id}-end`}
              value={g.endLabel}
              onChange={(endLabel) => onChange({ ...g, endLabel })}
            />
          </Field>
        </>
      );
  }
};

const BeatEditor: React.FC<{
  index: number;
  beat: Beat;
  onChange: (b: Beat) => void;
  onDelete: () => void;
}> = ({ index, beat, onChange, onDelete }) => {
  const id = `beat-${index}`;
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div className="beat-editor">
      <div className="row2">
        <Field label="Начало, сек">
          <NumberInput
            id={`${id}-from`}
            value={beat.fromSec}
            onChange={(fromSec) => onChange({ ...beat, fromSec })}
          />
        </Field>
        <Field label="Длительность, сек">
          <NumberInput
            id={`${id}-dur`}
            value={beat.durationSec}
            min={0.5}
            onChange={(durationSec) => onChange({ ...beat, durationSec })}
          />
        </Field>
      </div>
      <Field label="Раскладка кадра">
        <select
          id={`${id}-layout`}
          value={beat.layout}
          onChange={(e) =>
            onChange({ ...beat, layout: e.target.value as Layout })
          }
        >
          {LAYOUTS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Что показать">
        <select
          id={`${id}-kind`}
          value={beat.graphic.kind}
          onChange={(e) =>
            onChange({
              ...beat,
              graphic: defaultGraphic(
                e.target.value as Graphic["kind"],
                mainText(beat.graphic),
              ),
            })
          }
        >
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </Field>
      {(beat.layout === "split-b" ||
        beat.layout === "circle-top" ||
        beat.layout === "full") &&
      beat.graphic.kind !== "card" ? (
        <p className="hint">
          В этой раскладке мало места: лучше короткая плашка.
        </p>
      ) : null}
      <GraphicFields
        id={id}
        g={beat.graphic}
        onChange={(graphic) => onChange({ ...beat, graphic })}
      />
      <label className="check">
        <input
          id={`${id}-accent`}
          type="checkbox"
          checked={!!beat.accent}
          onChange={(e) =>
            onChange({ ...beat, accent: e.target.checked || undefined })
          }
        />
        Звук-акцент «динь» вместо обычного
      </label>
      {confirmDelete ? (
        <div className="confirm">
          <span>Удалить этот блок?</span>
          <button type="button" className="danger" onClick={onDelete}>
            Удалить
          </button>
          <button type="button" onClick={() => setConfirmDelete(false)}>
            Отмена
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="link-danger"
          onClick={() => setConfirmDelete(true)}
        >
          Удалить блок
        </button>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const playerRef = useRef<PlayerRef>(null);
  const [beats, setBeats] = useState<Beat[]>(BEATS);
  const [open, setOpen] = useState<number | null>(null);
  const [frame, setFrame] = useState(0);
  const [db, setDb] = useState<Db | null>(null);
  const [save, setSave] = useState<SaveState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const handle = (await window.claude?.use("db")) as Db | null | undefined;
      if (cancelled) return;
      if (!handle) {
        setSave({ kind: "offline" });
        return;
      }
      setDb(handle);
      try {
        const snap = await handle.doc(DOC_PATH).get();
        const data = snap.exists ? snap.data() : undefined;
        if (!cancelled && data && Array.isArray(data.beats)) {
          setBeats(data.beats as Beat[]);
        }
        if (!cancelled)
          setSave({
            kind: "clean",
            savedAt: typeof data?.savedAt === "string" ? data.savedAt : null,
          });
      } catch (e) {
        if (!cancelled)
          setSave({ kind: "error", message: (e as Error).message });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    const onFrame = (e: { detail: { frame: number } }) =>
      setFrame(e.detail.frame);
    p.addEventListener("frameupdate", onFrame);
    return () => p.removeEventListener("frameupdate", onFrame);
  }, []);

  const update = useCallback((next: Beat[]) => {
    setBeats(next);
    setSave((s) => (s.kind === "offline" ? s : { kind: "dirty" }));
  }, []);

  const sorted = useMemo(
    () => [...beats].sort((a, b) => a.fromSec - b.fromSec),
    [beats],
  );
  const inputProps = useMemo(
    () => ({
      videoSrc: "speaker.mp4",
      audioSrc: "speaker-audio.wav",
      captionsSrc: "captions.json",
      beats: sorted,
    }),
    [sorted],
  );

  const nowSec = frame / FPS;
  const seek = (sec: number) =>
    playerRef.current?.seekTo(Math.round(sec * FPS));

  const doSave = async () => {
    if (!db) return;
    setSave({ kind: "saving" });
    const savedAt = new Date().toISOString();
    try {
      await db.doc(DOC_PATH).set({ beats: sorted, savedAt });
      setBeats(sorted);
      setSave({ kind: "clean", savedAt });
    } catch (e) {
      setSave({ kind: "error", message: (e as Error).message });
    }
  };

  const addHere = () => {
    const at = round1(nowSec);
    const next = [
      ...sorted,
      {
        fromSec: at,
        durationSec: 3,
        layout: "split-a" as Layout,
        graphic: defaultGraphic("card", "Новая плашка"),
      },
    ].sort((a, b) => a.fromSec - b.fromSec);
    update(next);
    setOpen(next.findIndex((b) => b.fromSec === at));
  };

  const status = (() => {
    switch (save.kind) {
      case "loading":
        return { text: "Загружаю правки…", tone: "muted" };
      case "clean":
        return {
          text: save.savedAt
            ? `Сохранено ${new Date(save.savedAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`
            : "Это версия из ролика",
          tone: "ok",
        };
      case "dirty":
        return { text: "Есть несохранённые правки", tone: "warn" };
      case "saving":
        return { text: "Сохраняю…", tone: "muted" };
      case "error":
        return { text: `Не сохранилось: ${save.message}`, tone: "bad" };
      case "offline":
        return {
          text: "Сохранение недоступно в этом окне — правки видны только здесь",
          tone: "warn",
        };
    }
  })();

  return (
    <div className="app">
      <header className="top">
        <h1>Редактор ролика Capitaliano</h1>
        <span className={`status ${status.tone}`}>{status.text}</span>
      </header>

      <div className="layout">
        <section className="preview" aria-label="Превью">
          <div className="player-wrap">
            <Player
              ref={playerRef}
              component={Capitaliano}
              inputProps={inputProps}
              durationInFrames={DURATION_IN_FRAMES}
              fps={FPS}
              compositionWidth={1080}
              compositionHeight={1920}
              controls
              style={{ width: "100%", aspectRatio: "9 / 16" }}
              acknowledgeRemotionLicense
            />
          </div>
          <div className="now">
            <span className="mono">{fmt(nowSec)}</span>
            <button type="button" onClick={addHere}>
              + Блок с этого места
            </button>
          </div>
        </section>

        <section className="beats" aria-label="Блоки">
          <h2>Блоки ролика</h2>
          <p className="hint">
            Нажмите на блок, чтобы перейти к нему и изменить. Превью обновляется
            сразу.
          </p>
          <ol>
            {sorted.map((beat, i) => {
              const active =
                nowSec >= beat.fromSec &&
                nowSec < beat.fromSec + beat.durationSec;
              return (
                <li
                  key={i}
                  className={`beat ${active ? "active" : ""} ${open === i ? "open" : ""}`}
                >
                  <button
                    type="button"
                    className="beat-head"
                    aria-expanded={open === i}
                    onClick={() => {
                      setOpen(open === i ? null : i);
                      seek(beat.fromSec + 0.7);
                    }}
                  >
                    <span className="mono time">
                      {fmt(beat.fromSec)}–{fmt(beat.fromSec + beat.durationSec)}
                    </span>
                    <span className="chips">
                      <span className="chip">
                        {LAYOUTS.find((l) => l.value === beat.layout)?.label}
                      </span>
                      <span className="chip kind">
                        {
                          KINDS.find((k) => k.value === beat.graphic.kind)
                            ?.label
                        }
                      </span>
                    </span>
                    <span className="summary">{mainText(beat.graphic)}</span>
                  </button>
                  {open === i ? (
                    <BeatEditor
                      index={i}
                      beat={beat}
                      onChange={(b) =>
                        update(sorted.map((x, j) => (j === i ? b : x)))
                      }
                      onDelete={() => {
                        update(sorted.filter((_, j) => j !== i));
                        setOpen(null);
                      }}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <footer className="savebar">
        <button
          type="button"
          className="primary"
          disabled={!db || save.kind === "saving" || save.kind === "clean"}
          onClick={doSave}
        >
          Сохранить правки
        </button>
        <p>
          После сохранения напишите Claude в чате «примени правки» — он
          перерендерит финальное видео.
        </p>
      </footer>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
