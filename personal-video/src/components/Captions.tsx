import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, SAFE, SANS, SERIF } from "../theme";
import { edit, FPS } from "../edit";

/** Small native-style captions, 1–3 words, centred; key words in gold. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const page = edit.captions.find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  const local = (t - page.start) * FPS;
  const s = interpolate(local, [0, 4], [0.9, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.8)) });
  const o = interpolate(local, [0, 2], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        right: SAFE.right,
        top: 1080,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 14,
        transform: `scale(${s})`,
        opacity: o,
      }}
    >
      {page.words.map((w, i) => (
        <span
          key={i}
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 60,
            lineHeight: 1.18,
            color: w.emph ? C.gold : C.white,
            opacity: t >= w.s - 0.02 ? 1 : 0,
            textShadow: "0 2px 4px rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.35)",
          }}
        >
          {w.w}
        </span>
      ))}
    </div>
  );
};

/** Opening title: elegant serif italic over the first shots. */
export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { lines, at, dur } = edit.title;
  const local = frame - Math.round(at * FPS);
  const n = Math.round(dur * FPS);
  if (local < 0 || local >= n) return null;
  const o = interpolate(local, [0, 6, n - 6, n], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top + 70,
        left: SAFE.left,
        right: SAFE.right,
        textAlign: "center",
        opacity: o,
      }}
    >
      {lines.map((line, i) => {
        const p = interpolate(local, [i * 4, i * 4 + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div
            key={i}
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 112,
              lineHeight: 1.0,
              color: C.white,
              opacity: p,
              transform: `translateY(${(1 - p) * 24}px)`,
              textShadow: "0 3px 8px rgba(0,0,0,0.6), 0 0 34px rgba(0,0,0,0.45)",
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};
