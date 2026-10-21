import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, SAFE, SERIF } from "../theme";
import { edit, FPS, Word, words } from "../edit";

type Page = { words: Word[]; start: number; end: number };

const MAX_WORDS = 3;
const MAX_CHARS = 17;

/** Split each voice-over line into short pages, breaking after punctuation. */
const pages: Page[] = edit.vo.flatMap((vo) => {
  const ws = (words[vo.id]?.words ?? []).map((w) => ({ ...w, s: w.s + vo.at, e: w.e + vo.at }));
  const out: Word[][] = [];
  let cur: Word[] = [];
  ws.forEach((w) => {
    const chars = cur.reduce((n, x) => n + x.w.length + 1, 0) + w.w.length;
    if (cur.length && (cur.length >= MAX_WORDS || chars > MAX_CHARS)) {
      out.push(cur);
      cur = [];
    }
    cur.push(w);
    if (/[.,:;?!…]$/.test(w.w)) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out.map((p, i) => ({
    words: p,
    start: p[0].s - 0.05,
    end: Math.min(out[i + 1]?.[0].s ?? Infinity, p[p.length - 1].e + 0.35),
  }));
});

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const page = pages.find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  const local = (t - page.start) * FPS;
  const pop = interpolate(local, [0, 5], [0.94, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  const o = interpolate(local, [0, 3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        right: SAFE.right,
        bottom: SAFE.bottom + 70,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 24,
        rowGap: 0,
        transform: `scale(${pop})`,
        opacity: o,
      }}
    >
      {page.words.map((w, i) => {
        const next = page.words[i + 1];
        const active = t >= w.s && t < (next ? next.s : page.end);
        const spoken = t >= w.s;
        const bar = active
          ? interpolate((t - w.s) * FPS, [0, 4], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
          : 0;
        return (
          <span
            key={i}
            style={{
              position: "relative",
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 96,
              lineHeight: 1.12,
              color: C.linen,
              opacity: spoken ? 1 : 0.6,
              textShadow: "0 4px 22px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.7)",
            }}
          >
            {w.w}
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 4,
                height: 7,
                background: C.brass,
                transform: `scaleX(${bar})`,
                transformOrigin: "left",
                boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            />
          </span>
        );
      })}
    </div>
  );
};
