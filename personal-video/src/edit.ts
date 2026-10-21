import raw from "./edit.json";
import wordsRaw from "../public/vo/words.json";

export type Word = { w: string; s: number; e: number };
export type VoInfo = { dur: number; words: Word[] };

export type Shot = {
  at: number;
  dur: number;
  src: number;
  speed: number | [number, number];
  zoom: [number, number];
  fx: "cut" | "flash" | "whip" | "punch" | "fade";
  // "07_color:Первый" -> the shot starts on that spoken word
  sync?: string;
};

export const FPS = raw.fps;
export const DURATION = raw.duration;
export const words = wordsRaw as unknown as Record<string, VoInfo>;
export const edit = raw;

export const f = (sec: number) => Math.round(sec * FPS);

/** Absolute time (s) a given word of a voice-over line is spoken. */
export const wordTime = (ref: string): number | null => {
  const [id, word] = ref.split(":");
  const vo = raw.vo.find((v) => v.id === id);
  const w = words[id]?.words.find((x) => x.w === word);
  return vo && w ? vo.at + w.s : null;
};

/** Shots with sync points resolved; neighbours are trimmed to stay contiguous. */
export const shots: Shot[] = (() => {
  const list = (raw.shots as Shot[]).map((s) => ({ ...s }));
  list.forEach((s, i) => {
    if (!s.sync) return;
    const t = wordTime(s.sync);
    if (t === null) return;
    const at = t - 0.07;
    const end = s.at + s.dur;
    const prev = list[i - 1];
    if (prev && Math.abs(prev.at + prev.dur - s.at) < 0.01) prev.dur = at - prev.at;
    s.at = at;
    s.dur = end - at;
  });
  return list;
})();
