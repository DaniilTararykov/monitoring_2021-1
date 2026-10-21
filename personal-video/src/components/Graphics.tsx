import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, MONO, SAFE, SERIF } from "../theme";
import { f } from "../edit";

const plate: React.CSSProperties = {
  background: "rgba(26,20,16,0.82)",
  padding: "14px 22px 14px 20px",
  display: "inline-flex",
  alignItems: "center",
  gap: 16,
  fontFamily: MONO,
  color: C.linen,
  letterSpacing: "0.18em",
  whiteSpace: "nowrap",
};

const useInOut = (dur: number, out = 6) => {
  const frame = useCurrentFrame();
  const n = f(dur);
  const o = interpolate(frame, [0, 4, n - out, n], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame, [n - out, n], [0, -16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { frame, o, y };
};

/** Typed-on mono text. */
const typed = (text: string, frame: number, start: number, perChar = 1.2) =>
  text.slice(0, Math.max(0, Math.floor((frame - start) / perChar)));

export const Chapter: React.FC<{ dur: number; num: string; name: string }> = ({ dur, num, name }) => {
  const { frame, o, y } = useInOut(dur);
  const rule = interpolate(frame, [0, 8], [0, 56], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", top: SAFE.top + 30, left: SAFE.left, opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ ...plate, fontSize: 36 }}>
        <span style={{ color: C.brass }}>{num}</span>
        <span style={{ width: rule, height: 3, background: C.brass, display: "inline-block" }} />
        <span>{typed(name, frame, 4)}</span>
      </div>
    </div>
  );
};

const RewindIcon: React.FC = () => (
  <svg width="40" height="26" viewBox="0 0 40 26">
    <polygon points="20,0 20,26 0,13" fill={C.brass} />
    <polygon points="40,0 40,26 20,13" fill={C.brass} />
  </svg>
);

export const Tag: React.FC<{ dur: number; text: string; rec?: boolean; offset?: number }> = ({ dur, text, rec, offset = 0 }) => {
  const { frame, o, y } = useInOut(dur);
  const rewind = text.startsWith("◀◀");
  const label = rewind ? text.replace("◀◀", "").trim() : text;
  const blink = Math.floor(frame / 9) % 2 === 0;
  return (
    <div style={{ position: "absolute", top: SAFE.top + 30 + offset, left: SAFE.left, opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ ...plate, fontSize: 30 }}>
        {rec ? <span style={{ width: 18, height: 18, borderRadius: 9, background: C.brass, opacity: blink ? 1 : 0.25 }} /> : null}
        {rewind ? <RewindIcon /> : null}
        <span>{typed(label, frame, 2, 1)}</span>
      </div>
    </div>
  );
};

/** Big serif title, top of frame; the second line is italic brass. */
export const Title: React.FC<{ dur: number; lines: string[]; outro?: boolean }> = ({ dur, lines, outro }) => {
  const { frame, o } = useInOut(dur, outro ? 1 : 8);
  return (
    <>
    <AbsoluteFill
      style={{
        opacity: o,
        background: "linear-gradient(180deg, rgba(14,9,5,0.72) 0%, rgba(14,9,5,0.45) 35%, transparent 55%)",
      }}
    />
    <div style={{ position: "absolute", top: SAFE.top + (outro ? 50 : 120), left: SAFE.left, right: SAFE.right, opacity: o }}>
      {lines.map((line, i) => {
        const p = interpolate(frame, [i * 5, i * 5 + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div key={i} style={{ overflow: "hidden", lineHeight: 1.0, paddingBottom: 10 }}>
            <div
              style={{
                transform: `translateY(${(1 - p) * 110}%)`,
                fontFamily: SERIF,
                fontSize: 132,
                fontWeight: i === 1 ? 600 : 700,
                fontStyle: i === 1 ? "italic" : "normal",
                color: i === 1 ? C.brass : C.linen,
                textShadow: "0 4px 24px rgba(0,0,0,0.75), 0 1px 4px rgba(0,0,0,0.6)",
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
      {outro ? <Handle start={f(3.2)} /> : null}
    </div>
    </>
  );
};

const Handle: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ marginTop: 34, opacity: o, fontFamily: MONO, fontSize: 32, letterSpacing: "0.2em", color: C.linen }}>
      <span style={{ color: C.brass }}>—</span> @hausofdanik
    </div>
  );
};

/** "+12 Ч" drying time-lapse counter. */
export const Counter: React.FC<{ dur: number; to: number }> = ({ dur, to }) => {
  const { frame, o } = useInOut(dur, 5);
  const n = f(dur);
  const v = Math.round(interpolate(frame, [0, n - 8], [0, to], { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }));
  const pop = frame > n - 9 ? interpolate(frame, [n - 9, n - 5], [1.15, 1], { extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: o }}>
      <div style={{ ...plate, flexDirection: "column", gap: 4, padding: "26px 44px", transform: `scale(${pop})` }}>
        <span style={{ fontSize: 30, color: C.brass, letterSpacing: "0.3em" }}>СУШКА</span>
        <span style={{ fontSize: 120, letterSpacing: "0.04em" }}>+{String(v).padStart(2, "0")} Ч</span>
      </div>
    </AbsoluteFill>
  );
};
