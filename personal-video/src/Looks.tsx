import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import cutA from "./looks_a_cut.json";
import cutB from "./looks_b_cut.json";
import "./fonts";
import { SAFE, SANS } from "./theme";

/** GRWM talking cut: voice only, jump cuts hidden by alternating a slight punch-in, subtitles above his head. */
type Cut = { name: string; frames: number; pieces: { from: number; to: number; phrase: number; k: number }[]; subs: { from: number; to: number; text: string }[] };
export const looksCuts: Record<string, Cut> = { LooksA: cutA as Cut, LooksB: cutB as Cut };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const shadow = "0 2px 6px rgba(0,0,0,0.8), 0 0 22px rgba(0,0,0,0.5)";

export const Looks: React.FC<{ id: string }> = ({ id }) => {
  const cut = looksCuts[id];
  const frame = useCurrentFrame();
  const piece = cut.pieces.find((p) => frame >= p.from && frame < p.to) ?? cut.pieces[cut.pieces.length - 1];
  const zoom = (piece.phrase + piece.k) % 2 ? 1.08 : 1;
  const sub = cut.subs.find((s) => frame >= s.from && frame < s.to);
  const out = interpolate(frame, [cut.frames - 6, cut.frames], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* zoom from a low origin so the head never rises into the subtitle band */}
      <OffthreadVideo src={staticFile(`${cut.name}_cut.mp4`)} muted style={{ width: "100%", height: "100%", transform: `scale(${zoom})`, transformOrigin: "50% 20%" }} />
      {sub ? (
        <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: SAFE.top - 40, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 42, lineHeight: 1.22, color: "#fff", textShadow: shadow }}>
          {sub.text}
        </div>
      ) : null}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: out }} />
      <Audio src={staticFile(`${cut.name}_voice.wav`)} />
    </AbsoluteFill>
  );
};
