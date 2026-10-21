import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, SAFE, SANS } from "../theme";
import { f, FPS } from "../edit";

const FOOTAGE = staticFile("footage.mp4");

const Still: React.FC<{ src: number; rate?: number; style?: React.CSSProperties }> = ({ src, rate = 1, style }) => (
  <OffthreadVideo
    src={FOOTAGE}
    trimBefore={Math.round(src * FPS)}
    playbackRate={rate}
    muted
    style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
  />
);

/** Tape-rewind scrub from the finished chest back to the street. */
export const Rewind: React.FC<{ dur: number; from: number; to: number }> = ({ dur, from, to }) => {
  const frame = useCurrentFrame();
  const n = f(dur);
  const frames = Array.from({ length: n }, (_, i) => {
    const p = Easing.inOut(Easing.quad)(i / (n - 1));
    return from + (to - from) * p;
  });
  const jitter = ((frame * 37) % 11) - 5;
  return (
    <AbsoluteFill style={{ backgroundColor: C.walnut }}>
      {frames.map((src, i) => (
        <Sequence key={i} from={i} durationInFrames={1} layout="none">
          <AbsoluteFill style={{ transform: `translateX(${jitter * 3}px) scale(1.08)`, filter: "contrast(1.15) saturate(0.8) blur(1.5px)" }}>
            <Still src={src} />
          </AbsoluteFill>
        </Sequence>
      ))}
      <AbsoluteFill
        style={{
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 3px, transparent 3px 7px)",
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill
        style={{
          top: `${(frame * 13) % 100}%`,
          height: 60,
          background: "linear-gradient(transparent, rgba(233,223,208,0.25), transparent)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Before/after wipe with a brass divider. */
export const BeforeAfter: React.FC<{ dur: number; before: number; after: number }> = ({ dur, before, after }) => {
  const frame = useCurrentFrame();
  const n = f(dur);
  const pos = interpolate(frame, [4, n - 6], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const labelO = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const label = (text: string, side: "left" | "right", o: number) => (
    <div
      style={{
        position: "absolute",
        top: SAFE.top + 40,
        [side]: side === "left" ? SAFE.left : SAFE.right + 20,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 44,
        textTransform: "uppercase",
        color: text === "ДО" ? C.ink : C.white,
        background: text === "ДО" ? C.white : C.plate,
        padding: "12px 18px",
        opacity: o * labelO,
      }}
    >
      {text}
    </div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: C.walnut }}>
      <AbsoluteFill style={{ transform: `scale(${1.05 + frame * 0.001})` }}>
        <Still src={before} rate={0.6} />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <AbsoluteFill style={{ transform: `scale(${1.1 - frame * 0.001})` }}>
          <Still src={after} rate={0.6} />
        </AbsoluteFill>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${pos}%`,
          width: 6,
          marginLeft: -3,
          background: C.white,
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}
      />
      {label("ДО", "left", pos > 30 ? 1 : pos / 30)}
      {label("ПОСЛЕ", "right", pos < 70 ? 1 : (100 - pos) / 30)}
    </AbsoluteFill>
  );
};

/** v1 film look (grain + vignette) was dropped for the native Reels style. */
export const FilmLook: React.FC = () => null;
