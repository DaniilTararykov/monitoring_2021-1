import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import data from "./routine.json";
import "./fonts";
import { SANS } from "./theme";

/**
 * Morning routine, landscape, real time (no speed-ups). Each step opens on the product
 * held to camera; a hand-drawn arrow, sparkles and a two-line name mark it. Everything
 * else is left clean. Five drawn dots at the bottom tick off as the steps pass.
 */
const FPS = 30;
const W = 1920;
const H = 1080;
const BEAT = 60 / data.bpm;
const WHITE = "#FFFFFF";
type Seg = { src: number; beats: number; product?: number; kind?: string; play?: number };
type Product = { step: string; brand: string; name: string; at: number[]; label: number[] };
const products = data.products as Product[];
const timeline = (() => {
  let t = 0;
  return (data.segments as Seg[]).map((s) => {
    const from = Math.round(t * FPS);
    t += s.beats * BEAT;
    return { ...s, from, to: Math.round(t * FPS) };
  });
})();
export const ROUTINE_FRAMES = timeline[timeline.length - 1].to;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const shadow = "0 2px 6px rgba(0,0,0,0.6), 0 0 22px rgba(0,0,0,0.35)";

/** SVG layer whose strokes "boil" like hand-drawn animation. */
const Boil: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={Math.floor(frame / 4)} />
          <feDisplacementMap in="SourceGraphic" scale={6} />
        </filter>
        <filter id={`${id}-s`}>
          <feDropShadow dx={0} dy={2} stdDeviation={4} floodColor="#000" floodOpacity={0.4} />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>
        <g filter={`url(#${id}-s)`}>{children}</g>
      </g>
    </svg>
  );
};

const Draw: React.FC<{ d: string; a: number; b: number; w?: number }> = ({ d, a, b, w = 7 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return <path d={d} pathLength={1} fill="none" stroke={WHITE} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${p} 2`} />;
};

const Sparkle: React.FC<{ x: number; y: number; s: number; at: number }> = ({ x, y, s, at }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame - at, [0, 5, 9], [0, 1.3, 1], clamp);
  const k = s * pop * (0.8 + 0.2 * Math.sin((frame + at * 7) / 4));
  const q = k * 0.14;
  return <path d={`M${x},${y - k} Q${x + q},${y - q} ${x + k},${y} Q${x + q},${y + q} ${x},${y + k} Q${x - q},${y + q} ${x - k},${y} Q${x - q},${y - q} ${x},${y - k}Z`} fill={WHITE} />;
};

/** Curved arrow from the label towards the product, stopping short of it. */
const arrowPath = (from: number[], to: number[]) => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const stop = Math.min(230, len * 0.35);
  const end = [to[0] - ux * stop, to[1] - uy * stop];
  const mid = [(from[0] + end[0]) / 2 - uy * 70, (from[1] + end[1]) / 2 + ux * 70];
  const a = Math.atan2(end[1] - mid[1], end[0] - mid[0]);
  const h = (r: number) => `${(end[0] - Math.cos(a + r) * 38).toFixed(1)},${(end[1] - Math.sin(a + r) * 38).toFixed(1)}`;
  return { shaft: `M${from[0]},${from[1]} Q${mid[0].toFixed(1)},${mid[1].toFixed(1)} ${end[0].toFixed(1)},${end[1].toFixed(1)}`, head: `M${h(0.5)} L${end[0].toFixed(1)},${end[1].toFixed(1)} L${h(-0.5)}` };
};

const ProductMark: React.FC<{ p: Product; i: number; dur: number }> = ({ p, i, dur }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [dur - 6, dur], [1, 0], clamp);
  const t = interpolate(frame, [4, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const [lx, ly] = p.label;
  const right = lx > W / 2;
  const start = [right ? lx - 30 : lx + 380, ly + 40];
  const ar = arrowPath(start, p.at);
  const sp = [0, 1, 2, 3].map((k) => {
    const a = (k / 4) * Math.PI * 2 + i * 0.9 + 0.5;
    const r = 300 + rnd(i * 10 + k) * 90;
    return { x: p.at[0] + Math.cos(a) * r * 1.15, y: p.at[1] + Math.sin(a) * r * 0.8, s: 22 + rnd(i * 7 + k) * 22, at: 8 + k * 5 };
  }).filter((s) => s.y > 60 && s.y < H - 60 && !(s.x > lx - 60 && s.x < lx + 540 && s.y > ly - 60 && s.y < ly + 220));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Boil id={`pm${i}`}>
        <Draw d={ar.shaft} a={8} b={20} />
        <Draw d={ar.head} a={19} b={24} />
        {sp.map((s, k) => <Sparkle key={k} {...s} />)}
      </Boil>
      <div style={{ position: "absolute", left: lx, top: ly, width: 480, opacity: t, transform: `translateY(${(1 - t) * 18}px)`, textShadow: shadow, color: WHITE, fontFamily: SANS }}>
        <div style={{ fontWeight: 600, fontSize: 26, letterSpacing: "0.28em", opacity: 0.9 }}>
          0{i + 1} — {p.step.toUpperCase()}
        </div>
        <div style={{ fontWeight: 800, fontSize: 58, lineHeight: 1.08, marginTop: 8 }}>{p.brand}</div>
        {p.name ? <div style={{ fontWeight: 600, fontSize: 32, lineHeight: 1.2, marginTop: 6 }}>{p.name}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/** Five small drawn circles; each fills when its step starts. */
const Dots: React.FC = () => {
  const frame = useCurrentFrame();
  const starts = timeline.filter((s) => s.product !== undefined).map((s) => s.from);
  return (
    <Boil id="dots">
      {starts.map((f, i) => {
        const x = W / 2 + (i - 2) * 46;
        const fill = interpolate(frame, [f + 4, f + 10], [0, 1], clamp);
        return (
          <g key={i}>
            <circle cx={x} cy={H - 54} r={11} fill="none" stroke={WHITE} strokeWidth={4} />
            <circle cx={x} cy={H - 54} r={11 * fill} fill={WHITE} />
          </g>
        );
      })}
    </Boil>
  );
};

const Title: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [3, 10, dur - 6, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 100, top: 300, fontFamily: SANS, fontWeight: 800, fontSize: 84, lineHeight: 1.08, color: WHITE, textShadow: shadow, letterSpacing: "-0.01em" }}>
        my morning
        <br />
        routine
      </div>
      <Boil id="title">
        <Draw d="M102,506 C190,490 300,516 400,498 S440,494 452,502" a={10} b={24} w={9} />
        <Sparkle x={500} y={420} s={34} at={20} />
        <Sparkle x={70} y={270} s={20} at={25} />
      </Boil>
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const [x, y] = data.end.at;
  const pts = [[-330, -210, 46, 4], [300, -250, 34, 9], [380, 20, 52, 14], [-400, 60, 30, 19], [220, -330, 20, 24], [-250, -330, 24, 29]];
  return (
    <Boil id="end">
      {pts.map(([dx, dy, s, at], k) => <Sparkle key={k} x={x + dx} y={y + dy} s={s} at={at} />)}
    </Boil>
  );
};

export const Routine: React.FC = () => {
  const frame = useCurrentFrame();
  const seg = timeline.find((s) => frame >= s.from && frame < s.to) ?? timeline[timeline.length - 1];
  const punch = interpolate(frame - seg.from, [0, 6], [1.035, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const out = interpolate(frame, [ROUTINE_FRAMES - 8, ROUTINE_FRAMES], [0, 1], clamp);
  const end = timeline[timeline.length - 1];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile("morning_routine.mp4")} muted style={{ width: "100%", height: "100%", transform: `scale(${punch})` }} />
      <Dots />
      <Sequence durationInFrames={timeline[0].to}><Title dur={timeline[0].to} /></Sequence>
      {timeline.map((s) =>
        s.product !== undefined ? (
          <Sequence key={s.from} from={s.from} durationInFrames={s.to - s.from}>
            <ProductMark p={products[s.product]} i={s.product} dur={s.to - s.from} />
          </Sequence>
        ) : null,
      )}
      <Sequence from={end.from + Math.round((end.play ?? 0) * FPS)}><End /></Sequence>
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: out }} />
      <Audio src={staticFile("music_routine.wav")} volume={0.85} />
      {timeline.map((s) => (s.product !== undefined ? <Sequence key={`p${s.from}`} from={s.from + 4} layout="none"><Audio src={staticFile("sfx/pop.wav")} volume={0.55} /></Sequence> : null))}
      <Sequence from={end.from + Math.round((end.play ?? 0) * FPS)} layout="none"><Audio src={staticFile("sfx/shimmer.wav")} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};
