import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import data from "./film.json";
import { SANS } from "./theme";

/**
 * "A short film": the full landscape frame, untouched. Type works like cinema:
 * a title over the first shot, his inner voice as subtitles, the products as end credits.
 */
const FPS = 30;
const BEAT = 60 / data.bpm;
const timeline = (() => {
  let t = 0;
  return data.segments.map((s) => {
    const from = Math.round(t * FPS);
    t += s.beats * BEAT;
    return { from, to: Math.round(t * FPS) };
  });
})();
const CUT_END = timeline[timeline.length - 1].to;
const CREDITS = Math.round(data.creditBeats * BEAT * FPS);
export const FILM_FRAMES = CUT_END + CREDITS;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CREAM = "#F6F1E7";
const subShadow = "0 2px 4px rgba(0,0,0,0.85), 0 0 18px rgba(0,0,0,0.55)";

const Title: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [4, 14, dur - 8, dur], [0, 1, 1, 0], clamp);
  const ls = interpolate(frame, [0, dur], [0.02, 0.06], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 110, opacity: o }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, color: CREAM, letterSpacing: "0.5em", textShadow: subShadow, marginBottom: 14 }}>A SHORT FILM</div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 84, color: CREAM, letterSpacing: `${ls}em`, textShadow: subShadow, lineHeight: 1 }}>My Morning Routine</div>
    </AbsoluteFill>
  );
};

const Sub: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 78 }}>
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: CREAM, textShadow: subShadow, textAlign: "center" }}>{text}</div>
  </AbsoluteFill>
);

const Credits: React.FC = () => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, CREDITS], [1080, -120], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0F0D0B" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, color: "#8F887C", letterSpacing: "0.5em", marginBottom: 20 }}>CAST</div>
        {data.credits.map(([role, name]) => (
          <div key={role} style={{ display: "flex", gap: 34, alignItems: "baseline", width: 1300 }}>
            <div style={{ flex: 1, textAlign: "right", fontFamily: SANS, fontWeight: 600, fontSize: 24, color: "#8F887C", letterSpacing: "0.08em" }}>{role}</div>
            <div style={{ flex: 1.4, fontFamily: SANS, fontWeight: 600, fontSize: 36, color: CREAM }}>{name}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0F0D0B" }}>
    <Sequence durationInFrames={CUT_END}>
      <OffthreadVideo src={staticFile("morning_film.mp4")} muted style={{ width: "100%", height: "100%" }} />
    </Sequence>
    <Sequence durationInFrames={timeline[0].to}><Title dur={timeline[0].to} /></Sequence>
    {data.subs.map((s) => (
      <Sequence key={s.from} from={timeline[s.from].from} durationInFrames={timeline[s.to].to - timeline[s.from].from - 3}>
        <Sub text={s.text} />
      </Sequence>
    ))}
    <Sequence from={CUT_END}><Credits /></Sequence>
    <Audio src={staticFile("music_film.wav")} volume={0.85} />
  </AbsoluteFill>
);
