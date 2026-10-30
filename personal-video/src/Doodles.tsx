import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import "./fonts";
import { SERIF } from "./theme";

/* Hand-drawn animated doodles over the Milan photos. 1080x1350, 6 s loops. */

export const DOODLE_FRAMES = 180;
const INK = "#FFFFFF";

/** Deterministic pseudo-random in [0, 1). */
const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Wobbly, slightly overshooting ellipse, like a pen circle. */
const handEllipse = (cx: number, cy: number, rx: number, ry: number, seed: number) => {
  const n = 28;
  const pts: string[] = [];
  for (let i = 0; i <= n + 3; i++) {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2 * 1.08;
    const w = 1 + (rnd(seed + i) - 0.5) * 0.12 + i * 0.004;
    pts.push(`${(cx + Math.cos(a) * rx * w).toFixed(1)},${(cy + Math.sin(a) * ry * w).toFixed(1)}`);
  }
  return `M${pts[0]} L${pts.slice(1).join(" ")}`;
};

/** Every 4 frames the displacement seed changes: the classic "line boil" of hand animation. */
const Boil: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1350} viewBox="0 0 1080 1350" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={Math.floor(frame / 4)} />
          <feDisplacementMap in="SourceGraphic" scale={5} />
        </filter>
        <filter id={`${id}-glow`}>
          <feDropShadow dx={0} dy={2} stdDeviation={3} floodColor="#000" floodOpacity={0.35} />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>
        <g filter={`url(#${id}-glow)`}>{children}</g>
      </g>
    </svg>
  );
};

/** Stroke that draws itself on between frames a and b. */
const Draw: React.FC<{ d: string; a: number; b: number; w?: number; out?: [number, number] }> = ({ d, a, b, w = 6, out }) => {
  const frame = useCurrentFrame();
  let p = interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  // optional retract (tail follows) for speed lines
  let start = 0;
  if (out) start = interpolate(frame, out, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  if (p <= start) p = start;
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={INK}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={`${p - start} 2`}
      strokeDashoffset={-start}
    />
  );
};

const Sparkle: React.FC<{ x: number; y: number; s: number; at: number }> = ({ x, y, s, at }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame - at, [0, 6, 10], [0, 1.25, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tw = 0.8 + 0.2 * Math.sin((frame + at * 7) / 5);
  const k = s * pop * tw;
  return (
    <path
      d={`M${x},${y - k} Q${x + k * 0.15},${y - k * 0.15} ${x + k},${y} Q${x + k * 0.15},${y + k * 0.15} ${x},${y + k} Q${x - k * 0.15},${y + k * 0.15} ${x - k},${y} Q${x - k * 0.15},${y - k * 0.15} ${x},${y - k}Z`}
      fill={INK}
    />
  );
};

/** Handwritten-looking label that writes itself left to right. */
const Script: React.FC<{ x: number; y: number; text: string; a: number; b: number; size?: number; rot?: number }> = ({ x, y, text, a, b, size = 86, rot = -6 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <clipPath id={`clip-${text.replace(/\W/g, "")}`}>
        <rect x={x - 10} y={y - size} width={p * size * text.length * 0.55 + 10} height={size * 1.4} />
      </clipPath>
      <text
        x={x}
        y={y}
        clipPath={`url(#clip-${text.replace(/\W/g, "")})`}
        fill={INK}
        style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: size }}
      >
        {text}
      </text>
    </g>
  );
};

const Arrow: React.FC<{ from: [number, number]; via: [number, number]; to: [number, number]; a: number; b: number }> = ({ from, via, to, a, b }) => {
  const ang = Math.atan2(to[1] - via[1], to[0] - via[0]);
  const head = (d: number) => `${to[0] - Math.cos(ang + d) * 38},${to[1] - Math.sin(ang + d) * 38}`;
  return (
    <>
      <Draw d={`M${from[0]},${from[1]} Q${via[0]},${via[1]} ${to[0]},${to[1]}`} a={a} b={b} />
      <Draw d={`M${head(0.5)} L${to[0]},${to[1]} L${head(-0.5)}`} a={b} b={b + 6} />
    </>
  );
};

const Photo: React.FC<{ k: string }> = ({ k }) => (
  <Img src={staticFile(`photos/${k}.jpg`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
);

/* ------------------------------------------------------------------ */

export const DoodleRose: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Photo k="p2_portrait" />
    <Boil id="b-rose">
      <Draw d={handEllipse(626, 826, 95, 120, 3)} a={6} b={30} />
      <Arrow from={[850, 560]} via={[860, 700]} to={[730, 760]} a={30} b={48} />
      <Script x={700} y={520} text="the rose" a={44} b={70} size={112} />
      <Sparkle x={530} y={170} s={26} at={60} />
      <Sparkle x={300} y={260} s={18} at={70} />
      <Sparkle x={720} y={940} s={20} at={36} />
      <Sparkle x={540} y={700} s={14} at={80} />
    </Boil>
  </AbsoluteFill>
);

export const DoodleMotion: React.FC = () => {
  const frame = useCurrentFrame();
  // speed lines loop every 45 frames
  const cyc = frame % 45;
  const lines = [0, 1, 2, 3, 4].map((i) => {
    const y = 520 + i * 95 + (i % 2) * 20;
    return { d: `M${930 - i * 10},${y} C${980},${y - 6} ${1030},${y - 10} ${1075},${y - 16}`, delay: i * 4 };
  });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Photo k="p1_blur" />
      <Boil id="b-motion">
        {lines.map((l, i) => (
          <g key={i} transform={`translate(${-(frame - cyc)} 0) translate(${frame - cyc} 0)`}>
            <Draw d={l.d} a={frame - cyc + l.delay} b={frame - cyc + l.delay + 10} out={[frame - cyc + l.delay + 14, frame - cyc + l.delay + 26]} w={7} />
          </g>
        ))}
        <Draw d={handEllipse(605, 955, 48, 40, 7)} a={10} b={28} />
        <Draw d={handEllipse(612, 1052, 48, 40, 11)} a={20} b={38} />
        <Script x={270} y={240} text="!!" a={36} b={46} size={130} rot={-10} />
        <Script x={120} y={1220} text="in motion" a={50} b={80} size={92} rot={-4} />
        <Sparkle x={720} y={220} s={22} at={60} />
        <Sparkle x={160} y={420} s={16} at={74} />
      </Boil>
    </AbsoluteFill>
  );
};

export const DoodleWink: React.FC = () => {
  const frame = useCurrentFrame();
  // burst re-pops every 2 s
  const t = frame % 60;
  const rays = Array.from({ length: 7 }, (_, i) => {
    const a = (-150 + i * 22) * (Math.PI / 180);
    const r1 = 70;
    const r2 = 120 + (i % 2) * 20;
    const cx = 690;
    const cy = 362;
    return `M${cx + Math.cos(a) * r1},${cy + Math.sin(a) * r1} L${cx + Math.cos(a) * r2},${cy + Math.sin(a) * r2}`;
  });
  const flash = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2;
    return `M${165 + Math.cos(a) * 40},${275 + Math.sin(a) * 40} L${165 + Math.cos(a) * 78},${275 + Math.sin(a) * 78}`;
  });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Photo k="p3_elevator" />
      <Boil id="b-wink">
        {rays.map((d, i) => (
          <Draw key={i} d={d} a={frame - t + i} b={frame - t + i + 6} out={[frame - t + 34, frame - t + 46]} />
        ))}
        {flash.map((d, i) => (
          <Draw key={i} d={d} a={14 + i} b={20 + i} />
        ))}
        <Script x={760} y={250} text="wink" a={20} b={44} size={110} rot={8} />
        <Draw d={handEllipse(402, 900, 70, 120, 5)} a={50} b={72} />
        <Sparkle x={860} y={560} s={20} at={30} />
        <Sparkle x={300} y={150} s={16} at={56} />
      </Boil>
    </AbsoluteFill>
  );
};

export const DoodleMusic: React.FC = () => {
  const frame = useCurrentFrame();
  const note = (x: number, y: number, s: number) =>
    `M${x},${y} m${-s * 0.55},0 a${s * 0.55},${s * 0.4} -20 1,0 ${s * 1.1},0 a${s * 0.55},${s * 0.4} -20 1,0 ${-s * 1.1},0 M${x + s * 0.5},${y - s * 0.1} L${x + s * 0.5},${y - s * 2.2} Q${x + s * 1.2},${y - s * 1.9} ${x + s * 1.1},${y - s * 1.3}`;
  // three notes drift up-right on a loop, each 90 frames, staggered
  const notes = [0, 30, 60].map((off, i) => {
    const t = ((frame + off) % 90) / 90;
    // drift from the AirPod down-left, over the dark hair and collar, away from the face
    const x = 400 - t * 300 + Math.sin(t * 6 + i) * 22;
    const y = 120 + t * 420 + i * 40 + Math.cos(t * 5 + i) * 18;
    const o = interpolate(t, [0, 0.15, 0.8, 1], [0, 1, 1, 0]);
    return { d: note(x, y, 26 + i * 6), o };
  });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Photo k="p4_close" />
      <Boil id="b-music">
        {[0, 1, 2].map((i) => (
          <Draw key={i} d={`M${490 + i * 34},${60 + i * 6} q18,40 0,80`} a={6 + i * 6} b={18 + i * 6} />
        ))}
        {notes.map((n, i) => (
          <g key={i} opacity={n.o}>
            <path d={n.d} fill={INK} stroke={INK} strokeWidth={6} strokeLinecap="round" />
          </g>
        ))}
        <Draw d={handEllipse(272, 1205, 115, 150, 9)} a={40} b={66} />
        <Script x={560} y={1120} text="on repeat" a={60} b={92} size={96} rot={-5} />
        <Sparkle x={900} y={120} s={22} at={24} />
        <Sparkle x={980} y={260} s={14} at={48} />
      </Boil>
    </AbsoluteFill>
  );
};

export const doodles = [
  { id: "DoodleRose", component: DoodleRose },
  { id: "DoodleMotion", component: DoodleMotion },
  { id: "DoodleWink", component: DoodleWink },
  { id: "DoodleMusic", component: DoodleMusic },
];
