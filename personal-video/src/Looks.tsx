import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import cut from "./looks_cut.json";
import "./fonts";
import { SAFE, SANS } from "./theme";

/** GRWM talking cut: jump cuts hidden by alternating a slight punch-in, plain subtitles, quiet music bed. */
export const LOOKS_FRAMES = cut.frames;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const shadow = "0 2px 6px rgba(0,0,0,0.75), 0 0 20px rgba(0,0,0,0.45)";

export const Looks: React.FC = () => {
  const frame = useCurrentFrame();
  const piece = cut.pieces.find((p) => frame >= p.from && frame < p.to) ?? cut.pieces[cut.pieces.length - 1];
  const zoom = (piece.phrase + piece.k) % 2 ? 1.1 : 1;
  const sub = cut.subs.find((s) => frame >= s.from && frame < s.to);
  const titleO = interpolate(frame, [4, 12, cut.subs[0].to - 8, cut.subs[0].to], [0, 1, 1, 0], clamp);
  const out = interpolate(frame, [cut.frames - 6, cut.frames], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile("looks_cut.mp4")} muted style={{ width: "100%", height: "100%", transform: `scale(${zoom})`, transformOrigin: "50% 42%" }} />
      <div style={{ position: "absolute", top: SAFE.top, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 64, color: "#fff", textShadow: shadow, opacity: titleO }}>
        {cut.title}
      </div>
      {sub ? (
        <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, bottom: SAFE.bottom + 20, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 46, lineHeight: 1.25, color: "#fff", textShadow: shadow }}>
          {sub.text}
        </div>
      ) : null}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: out }} />
      <Audio src={staticFile("looks_voice.wav")} />
      <Audio src={staticFile("music_looks.wav")} volume={0.1} />
    </AbsoluteFill>
  );
};
