import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, SAFE, SANS } from "../theme";
import { f } from "../edit";

/** Solid native-Reels plate: white bold caps on a flat colour block. */
const plate = (bg: string, color: string, size: number): React.CSSProperties => ({
  background: bg,
  color,
  fontFamily: SANS,
  fontWeight: 700,
  fontSize: size,
  textTransform: "uppercase",
  letterSpacing: "0.01em",
  lineHeight: 1.1,
  padding: `${size * 0.26}px ${size * 0.4}px`,
  display: "inline-flex",
  alignItems: "center",
  gap: size * 0.3,
  whiteSpace: "nowrap",
});

/** Pop in with a slight overshoot, cut out. */
const usePop = (dur: number) => {
  const frame = useCurrentFrame();
  const n = f(dur);
  const s = interpolate(frame, [0, 5], [0.6, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2.2)) });
  const o = interpolate(frame, [0, 2, n - 2, n], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { frame, s, o };
};

export const Chapter: React.FC<{ dur: number; num: string; name: string }> = ({ dur, num, name }) => {
  const { s, o } = usePop(dur);
  return (
    <div style={{ position: "absolute", top: SAFE.top + 30, left: SAFE.left, opacity: o, transform: `scale(${s})`, transformOrigin: "left center" }}>
      <div style={plate(C.plate, C.white, 44)}>
        <span>{Number(num)}. {name}</span>
      </div>
    </div>
  );
};

export const Tag: React.FC<{ dur: number; text: string; rec?: boolean; offset?: number }> = ({ dur, text, rec, offset = 0 }) => {
  const { frame, s, o } = usePop(dur);
  const label = text.replace("◀◀", "⏪").trim();
  const blink = Math.floor(frame / 9) % 2 === 0;
  return (
    <div
      style={{ position: "absolute", top: SAFE.top + 30 + offset * 1.1, left: SAFE.left, opacity: o, transform: `scale(${s})`, transformOrigin: "left center" }}
    >
      <div style={plate(C.white, C.ink, 36)}>
        {rec ? <span style={{ width: 20, height: 20, borderRadius: 10, background: "#E5262A", opacity: blink ? 1 : 0.3 }} /> : null}
        <span>{label.startsWith("⏪") ? label.replace("⏪", "").trim() : label}</span>
      </div>
    </div>
  );
};

/** Hook / outro title: one plate per line, stacked and centred. */
export const Title: React.FC<{ dur: number; lines: string[]; outro?: boolean }> = ({ dur, lines, outro }) => {
  const frame = useCurrentFrame();
  const n = f(dur);
  const o = interpolate(frame, [n - 2, n], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top + (outro ? 60 : 110),
        left: SAFE.left,
        right: SAFE.right,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        opacity: o,
      }}
    >
      {lines.map((line, i) => {
        const s = interpolate(frame, [i * 3, i * 3 + 5], [0.5, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(2.2)),
        });
        return (
          <div key={i} style={{ transform: `scale(${s})`, opacity: frame >= i * 3 ? 1 : 0 }}>
            <div style={plate(i === 1 ? C.white : C.plate, i === 1 ? C.plate : C.white, 76)}>{line}</div>
          </div>
        );
      })}
      {outro ? <Handle start={f(3.2)} /> : null}
    </div>
  );
};

const Handle: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [start, start + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        marginTop: 22,
        opacity: o,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 40,
        color: C.white,
        textShadow: "0 2px 10px rgba(0,0,0,0.6)",
      }}
    >
      @hausofdanik
    </div>
  );
};

/** "+12 часов" drying time-lapse counter. */
export const Counter: React.FC<{ dur: number; to: number }> = ({ dur, to }) => {
  const { frame, s, o } = usePop(dur);
  const n = f(dur);
  const v = Math.round(interpolate(frame, [0, n - 8], [0, to], { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: o }}>
      <div style={{ transform: `scale(${s})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={plate(C.white, C.plate, 44)}>сушка</div>
        <div style={{ ...plate(C.plate, C.white, 110), fontWeight: 800 }}>+{v} ч</div>
      </div>
    </AbsoluteFill>
  );
};
