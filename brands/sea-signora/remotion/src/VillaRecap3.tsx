import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';
import {Clip} from './VillaRecap';

loadBrandFonts();

// Villa Prato, the two creative cuts made faster and with one headline only (client 19.11: «более креативно»,
// «и динамичнее, и один заголовок»). Every cut lands on the beat of our own track; each shot punches in on the cut.
// D · «Four hands»: four panels open on four beats, the four change together on every beat (prep, plate, finish, the
//     bar, the guests, the villa), then the grid breaks into one-beat full-frame cuts. One headline: FOUR HANDS.
// E · «Full circle»: match cuts on circles (painted medallions, the dome, the slicer wheel, a pot, plates, the choux),
//     every round thing landing on the same spinning ring, first on the beat, then twice as fast. One headline.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory;
const ip = (f: number, a: number, b: number, c = 0, d = 1, e: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const io = Easing.inOut(Easing.cubic);
const mono = (s: number, c: string): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: s, letterSpacing: 6, textTransform: 'uppercase', color: c});
const music = (file: string, frames: number) => (
  <Audio src={staticFile(`music/${file}`)} volume={(fr) => interpolate(fr, [0, 4, frames - 30, frames], [0, 0.9, 0.9, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
);
// a shot that punches in on the cut and keeps drifting
const Punch: React.FC<{n: string; at: number; len: number; amt?: number; fx?: number; fy?: number}> = ({n, at, len, amt = 0.14, fx = 50, fy = 50}) => {
  const f = useCurrentFrame();
  const s = 1 + amt * (1 - ip(f, 0, 7)) + f * 0.002;
  return <AbsoluteFill style={{overflow: 'hidden', transform: `scale(${s})`, transformOrigin: `${fx}% ${fy}%`}}><Clip n={n} at={at} len={len} z={[1.0, 1.0]} /></AbsoluteFill>;
};
const Headline: React.FC<{text: string; at: number; top: number; size?: number; kicker?: string}> = ({text, at, top, size = 200, kicker}) => {
  const f = useCurrentFrame();
  const a = ip(f, at, at + 6);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center'}}>
      {kicker && <div style={{...mono(22, I), opacity: ip(f, at + 6, at + 12), marginBottom: 18, textShadow: '0 2px 14px rgba(0,0,0,0.6)'}}>{kicker}</div>}
      <div style={{fontFamily: fonts.display, fontSize: size, lineHeight: 0.9, color: I, opacity: a, transform: `scale(${1.25 - 0.25 * a})`,
        textShadow: '0 6px 40px rgba(0,0,0,0.55)', whiteSpace: 'pre-line'}}>{text}</div>
    </div>
  );
};

// ───────── D · four hands ─────────
const BD = (60 / 122) * FPS; // one beat of brera-house in frames
const bd = (b: number) => Math.round(b * BD);
type P = {n: string; at: number};
const SETS: P[][] = [
  [{n: '6090', at: 5.6}, {n: '6085', at: 2.3}, {n: '6096', at: 3.5}, {n: '6086', at: 4.8}],
  [{n: '6162', at: 1.5}, {n: '6157', at: 5.7}, {n: '6177', at: 26.2}, {n: '6178', at: 6.7}],
  [{n: '6164', at: 3.7}, {n: '6165', at: 8.9}, {n: '6138', at: 9.6}, {n: '6043', at: 4.8}],
  [{n: '6042', at: 4.4}, {n: '6097', at: 0}, {n: '6047', at: 0}, {n: '6044', at: 15.4}],
  [{n: '6100', at: 1.8}, {n: '6124', at: 5.3}, {n: '6125', at: 3.5}, {n: '6182', at: 1.7}],
  [{n: '6013', at: 0.5}, {n: '5962', at: 0}, {n: '6060', at: 0}, {n: '6022', at: 0}],
];
const Cell: React.FC<{i: number; p: P; open: number; out: number}> = ({i, p, open, out}) => {
  const f = useCurrentFrame();
  const c = i % 2, r = Math.floor(i / 2);
  const s = ip(f, open, open + 5, 0, 1, io);
  return (
    <div style={{position: 'absolute', left: c * 543, top: r * 963, width: 537, height: 957, overflow: 'hidden',
      clipPath: `inset(${(1 - s) * 50}% ${(1 - s) * 50}%)`, transform: `translate(${(c ? 1 : -1) * out * 560}px, ${(r ? 1 : -1) * out * 1000}px)`}}>
      <div style={{position: 'absolute', left: -270, top: -480, width: 1080, height: 1920, transform: 'scale(0.62)'}}><Punch n={p.n} at={p.at} len={3} amt={0.08} /></div>
    </div>
  );
};
const GridD: React.FC = () => {
  const f = useCurrentFrame();
  // beats 0–3: the four panels open one per beat; beats 4–11: the four change together on every beat; beat 12: apart
  const k = f < bd(4) ? 0 : Math.min(SETS.length - 1, 1 + Math.floor((f - bd(4)) / BD) % (SETS.length - 1));
  const setStart = f < bd(4) ? 0 : bd(4 + Math.floor((f - bd(4)) / BD));
  const out = ip(f, bd(11.5), bd(12), 0, 1, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill style={{background: colors.night}}>
      {SETS[k].map((p, i) => (
        <Sequence key={`${setStart}-${i}`} from={setStart}><Cell i={i} p={p} open={k === 0 ? bd(i) - setStart : -10} out={out} /></Sequence>
      ))}
      <div style={{opacity: 1 - out}}><Headline text={'FOUR\nHANDS'} at={bd(4)} top={760} size={230} kicker="sea, signora × villa prato" /></div>
    </AbsoluteFill>
  );
};
const D_FULL: [string, number, number][] = [ // clip, start, beats
  ['6169', 15.6, 1], ['5965', 1, 1], ['6013', 0.5, 1], ['6051', 0.2, 1], ['6042', 4.4, 1], ['6090', 5.6, 1], ['6086', 4.8, 1], ['6163', 11.8, 1],
  ['6177', 26.2, 1], ['6138', 9.6, 1], ['6174', 2.4, 1], ['6182', 1.7, 1], ['6226', 1.7, 1], ['6124', 5.3, 1], ['6227', 4.5, 2], ['6239', 2.0, 2],
];
const D_GRID = 12, D_END = 6;
export const D_FRAMES = bd(D_GRID + D_FULL.reduce((s, x) => s + x[2], 0) + D_END);
const HalvesD: React.FC = () => {
  const f = useCurrentFrame();
  const s = ip(f, 0, bd(1), 1, 0, io);
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <Clip n="6239" at={3.0} len={2} z={[1.03, 1.05]} />
      <div style={{position: 'absolute', left: -540 * s, top: 0, width: 540, height: 1920, background: G, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 30}}>
        <div style={{fontFamily: fonts.display, fontSize: 96, color: I, textAlign: 'right', lineHeight: 1}}><div>Sea,</div><div>Signora</div></div>
      </div>
      <div style={{position: 'absolute', left: 540 + 540 * s, top: 0, width: 540, height: 1920, background: SA, display: 'flex', alignItems: 'center', paddingLeft: 30}}>
        <div style={{fontFamily: fonts.display, fontSize: 96, color: G, lineHeight: 1}}><div>Villa</div><div>Prato</div></div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1260, textAlign: 'center', ...mono(20, I), opacity: ip(f, bd(1.5), bd(2))}}>13 · 11</div>
    </AbsoluteFill>
  );
};
export const VillaQuad: React.FC = () => {
  let b = D_GRID;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {music('villa-hands.mp3', D_FRAMES)}
      <Sequence durationInFrames={bd(D_GRID)}><GridD /></Sequence>
      {D_FULL.map(([n, at, beats], i) => {
        const from = bd(b); b += beats;
        return <Sequence key={i} from={from} durationInFrames={bd(b) - from}><Punch n={n} at={at} len={beats * 0.5} /></Sequence>;
      })}
      <Sequence from={bd(b)}><HalvesD /></Sequence>
    </AbsoluteFill>
  );
};

// ───────── E · full circle ─────────
const BE = (60 / 116) * FPS; // one beat of italo-arp in frames
const be = (b: number) => Math.round(b * BE);
type C = {n: string; at: number; cx: number; cy: number; r: number};
const R = 380, CX = 540, CY = 900;
const CC: Record<string, C> = {
  med: {n: '5965', at: 1, cx: 470, cy: 732, r: 372},
  med2: {n: '5964', at: 1, cx: 624, cy: 930, r: 348},
  dome: {n: '6013', at: 1, cx: 553, cy: 897, r: 240},
  wheel: {n: '5953', at: 1, cx: 508, cy: 947, r: 348},
  pot: {n: '6086', at: 4.8, cx: 544, cy: 890, r: 430},
  plate: {n: '6162', at: 1.5, cx: 524, cy: 948, r: 420},
  plate2: {n: '6138', at: 15.0, cx: 588, cy: 984, r: 440},
  table: {n: '6122', at: 1, cx: 475, cy: 981, r: 500},
  choux: {n: '6227', at: 5.0, cx: 530, cy: 993, r: 240},
};
// first pass one beat each, second pass half a beat each (the same shapes, later in the shot), then the choux holds
const E_CUTS: [keyof typeof CC, number, number][] = [
  ['med', 0, 1], ['med2', 0, 1], ['dome', 0, 1], ['wheel', 0, 1], ['pot', 0, 1], ['plate', 0, 1], ['plate2', 0, 1], ['table', 0, 1],
  ['med', 1.2, 0.5], ['dome', 0.8, 0.5], ['wheel', 0.8, 0.5], ['pot', 1.0, 0.5], ['plate', 1.0, 0.5], ['plate2', 0.8, 0.5], ['table', 0.8, 0.5], ['med2', 0.8, 0.5],
  ['choux', 0, 4],
];
const E_END = 6;
const E_MONT = E_CUTS.reduce((s, x) => s + x[2], 0);
export const E_FRAMES = be(E_MONT + E_END);
const Matched: React.FC<{c: C; off: number; len: number}> = ({c, off, len}) => {
  const f = useCurrentFrame();
  const k = Math.max(Math.min(1.6, Math.max(1, R / c.r)), CX / c.cx, (1080 - CX) / (1080 - c.cx), CY / c.cy, (1920 - CY) / (1920 - c.cy));
  const punch = 1 + 0.1 * (1 - ip(f, 0, 6)) + f * 0.002;
  const tx = CX - c.cx * k, ty = CY - c.cy * k;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0',
        transform: `translate(${CX}px, ${CY}px) scale(${punch}) translate(${-CX}px, ${-CY}px) translate(${tx}px, ${ty}px) scale(${k})`}}>
        <Clip n={c.n} at={c.at + off} len={len} z={[1, 1]} />
      </div>
    </AbsoluteFill>
  );
};
const RingE: React.FC = () => {
  const f = useCurrentFrame();
  const beat = (f % BE) / BE;
  const pulse = 1 + 0.035 * (1 - Math.min(1, beat * 4));
  const fast = f > be(8) ? 2.2 : 1;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <g transform={`translate(${CX} ${CY}) scale(${pulse}) rotate(${f * 1.2 * fast}) translate(${-CX} ${-CY})`}>
        <circle cx={CX} cy={CY} r={R + 26} fill="none" stroke={I} strokeWidth={5} strokeDasharray="4 16" strokeLinecap="round" opacity={0.95} />
      </g>
    </svg>
  );
};
const EndE: React.FC = () => {
  const f = useCurrentFrame();
  const d = ip(f, 0, be(1.5), 0, 1, io);
  const a = (x: number) => ip(f, x, x + 8);
  return (
    <AbsoluteFill style={{background: G}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <circle cx={CX} cy={CY} r={R + 26} fill="none" stroke={O} strokeWidth={5} strokeDasharray={`${2 * Math.PI * (R + 26) * d} 9999`} transform={`rotate(-90 ${CX} ${CY})`} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: CY - 120, textAlign: 'center'}}>
        <div style={{fontFamily: fonts.display, fontSize: 84, color: I, lineHeight: 1, opacity: a(be(1))}}>Sea, Signora</div>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 56, color: O, margin: '8px 0', opacity: a(be(1.5))}}>×</div>
        <div style={{fontFamily: fonts.display, fontSize: 84, color: I, lineHeight: 1, opacity: a(be(2))}}>Villa Prato</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: CY + R + 90, textAlign: 'center', ...mono(20, SA), opacity: a(be(2.5))}}>four hands · 13.11</div>
    </AbsoluteFill>
  );
};
export const VillaCircle: React.FC = () => {
  let b = 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {music('villa-circle.mp3', E_FRAMES)}
      {E_CUTS.map(([key, off, beats], i) => {
        const from = be(b); b += beats;
        return <Sequence key={i} from={from} durationInFrames={be(b) - from}><Matched c={CC[key]} off={off} len={beats * 0.55} /></Sequence>;
      })}
      <Sequence durationInFrames={be(E_MONT)}><RingE /></Sequence>
      <Sequence from={be(E_MONT - 4)} durationInFrames={be(4)}><Headline text={'FULL\nCIRCLE'} at={2} top={1330} size={150} /></Sequence>
      <Sequence from={be(E_MONT)}><EndE /></Sequence>
    </AbsoluteFill>
  );
};
