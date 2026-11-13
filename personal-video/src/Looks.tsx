import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import cutA from "./looks_a_cut.json";
import cutB from "./looks_b_cut.json";
import cutC from "./looks_c_cut.json";
import "./fonts";
import { MONO, SAFE, SANS } from "./theme";

/** GRWM talking cut: voice only, jump cuts hidden by alternating a slight punch-in, subtitles above his head. */
type Cut = { name: string; frames: number; pieces: { from: number; to: number; phrase: number; k: number }[]; subs: { from: number; to: number; text: string; item?: string }[]; title?: string };
export const looksCuts: Record<string, Cut> = { LooksA: cutA as Cut, LooksB: cutB as Cut, LooksC: cutC as Cut };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const shadow = "0 2px 6px rgba(0,0,0,0.8), 0 0 22px rgba(0,0,0,0.5)";

export const Looks: React.FC<{ id: string }> = ({ id }) => {
  const cut = looksCuts[id];
  const frame = useCurrentFrame();
  const list = id === "LooksC";
  const items = cut.subs.filter((s) => s.item);
  const sub = cut.subs.find((s) => frame >= s.from && frame < s.to);
  const out = interpolate(frame, [cut.frames - 6, cut.frames], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile(`${cut.name}_cut.mp4`)} muted style={{ width: "100%", height: "100%" }} />
      {list ? (
        <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top - 30, color: "#fff", textShadow: shadow }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, marginBottom: 14, opacity: interpolate(frame, [6, 16], [0, 1], clamp) }}>{cut.title}</div>
          {items.map((it, i) => {
            const p = interpolate(frame, [it.from + 6, it.from + 14], [0, 1], clamp);
            return (
              <div key={i} style={{ fontFamily: MONO, fontSize: 27, lineHeight: 1.5, opacity: p, transform: `translateX(${(1 - p) * -14}px)` }}>
                <span style={{ opacity: 0.7 }}>0{i + 1}</span> {it.item}
              </div>
            );
          })}
        </div>
      ) : sub ? (
        <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: SAFE.top - 40, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 42, lineHeight: 1.22, color: "#fff", textShadow: shadow }}>
          {sub.text}
        </div>
      ) : null}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: out }} />
      <Audio src={staticFile(`${cut.name}_voice.wav`)} />
    </AbsoluteFill>
  );
};
