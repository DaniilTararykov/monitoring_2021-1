import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';
import {Clip, shade} from './VillaRecap';

loadBrandFonts();

// Villa Prato, two more creative cuts (client 19.11: «более креативно»). The idea is in the edit itself, not in captions.
// D · «Four hands, live»: the screen splits into four panels, one pair of hands each, opening one by one (1, 2, 3, 4);
//     the four panels change together on the beat (prep → plate → serve), then the grid pulls apart into one frame of
//     both chefs. The end card closes the same way: two halves, Sea, Signora | Villa Prato, slide into one.
// E · «Full circle»: match cuts on circles. A painted medallion on the villa ceiling, the dome, the red wheel of the
//     slicer, a pot from above, plates, the choux: every round thing lands on the same ring in the centre of the frame,
//     so the cut feels like one continuous shape turning through the evening.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory;
const sec = (s: number) => Math.round(s * FPS);
const ip = (f: number, a: number, b: number, c = 0, d = 1, e: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const io = Easing.inOut(Easing.cubic);
const music = (file: string, total: number) => (
  <Audio src={staticFile(`music/${file}`)} volume={(fr) => interpolate(fr, [0, 8, sec(total) - 36, sec(total)], [0, 0.85, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
);
const mono = (s: number, c: string): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: s, letterSpacing: 6, textTransform: 'uppercase', color: c});

// ───────── D · four hands, live ─────────
type P = {n: string; at: number};
const Panel: React.FC<{i: number; p: P; appear: number; num?: boolean; gap: number}> = ({i, p, appear, num, gap}) => {
  const f = useCurrentFrame();
  const c = i % 2, r = Math.floor(i / 2);
  const s = ip(f, appear, appear + 9, 0, 1, io);
  const out = gap; // 0..1: the grid pulls apart
  const dx = (c ? 1 : -1) * out * 600, dy = (r ? 1 : -1) * out * 1050;
  const n = ip(f, appear + 2, appear + 8) * (1 - ip(f, appear + 16, appear + 24));
  return (
    <div style={{position: 'absolute', left: c * 540 + (c ? 3 : 0), top: r * 960 + (r ? 3 : 0), width: 537, height: 957, overflow: 'hidden',
      clipPath: `inset(${(1 - s) * 50}% ${(1 - s) * 50}% round 0)`, transform: `translate(${dx}px, ${dy}px)`}}>
      <div style={{position: 'absolute', left: -270, top: -480, width: 1080, height: 1920, transform: 'scale(0.75)', transformOrigin: '50% 50%'}}>
        <Clip n={p.n} at={p.at} len={6} z={[1.02, 1.06]} />
      </div>
      {num && <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontSize: 260,
        color: I, opacity: n, textShadow: '0 4px 30px rgba(0,0,0,0.5)'}}>{i + 1}</div>}
    </div>
  );
};
const GRIDS: P[][] = [
  [{n: '6090', at: 5.6}, {n: '6085', at: 2.3}, {n: '6096', at: 3.5}, {n: '6086', at: 4.8}],
  [{n: '6162', at: 1.5}, {n: '6157', at: 5.7}, {n: '6177', at: 26.2}, {n: '6178', at: 6.7}],
  [{n: '6164', at: 3.7}, {n: '6165', at: 8.9}, {n: '6138', at: 9.6}, {n: '6043', at: 4.8}],
];
const Grid: React.FC = () => {
  const f = useCurrentFrame();
  // 0–2.4 s panels open one by one with their number, then the four change together every 1.3 s, then pull apart
  const set = f < sec(3.3) ? 0 : f < sec(4.6) ? 1 : 2;
  const gap = ip(f, sec(5.9), sec(6.6), 0, 1, Easing.in(Easing.cubic));
  const lab = ['four hands', 'plate', 'finish'][set];
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <Sequence from={sec(5.9)}><Clip n="6169" at={15.6} len={2.6} z={[1.12, 1.02]} /></Sequence>
      {GRIDS[set].map((p, i) => <Sequence key={`${set}-${i}`} from={set === 0 ? 0 : set === 1 ? sec(3.3) : sec(4.6)}>
        <Panel i={i} p={p} appear={set === 0 ? sec(0.2 + i * 0.6) : -20} num={set === 0} gap={gap} /></Sequence>)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 944, textAlign: 'center', opacity: 1 - gap}}>
        <span style={{background: colors.night, padding: '8px 20px', ...mono(20, SA)}}>{lab}</span>
      </div>
    </AbsoluteFill>
  );
};
const Big: React.FC<{top: number; kicker?: string; text: string; at?: number}> = ({top, kicker, text, at = 4}) => {
  const f = useCurrentFrame();
  const a = ip(f, at, at + 12);
  return (
    <div style={{position: 'absolute', left: 90, right: 90, top}}>
      {kicker && <div style={{...mono(20, SA), opacity: a, marginBottom: 14}}>{kicker}</div>}
      <div style={{fontFamily: fonts.display, fontSize: 112, lineHeight: 0.95, color: I, whiteSpace: 'pre-line', opacity: a, transform: `translateY(${(1 - a) * 22}px)`}}>{text}</div>
    </div>
  );
};
const Halves: React.FC = () => {
  const f = useCurrentFrame();
  const s = ip(f, 0, 16, 1, 0, io);
  const x = ip(f, 16, 26);
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <Clip n="6239" at={4.2} len={3} z={[1.03, 1.05]} />
      <div style={{position: 'absolute', left: -540 * s, top: 0, width: 540, height: 1920, background: G, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 34}}>
        <div style={{fontFamily: fonts.display, fontSize: 92, color: I, textAlign: 'right', lineHeight: 1}}>{'Sea,\nSignora'.split('\n').map((l) => <div key={l}>{l}</div>)}</div>
      </div>
      <div style={{position: 'absolute', left: 540 + 540 * s, top: 0, width: 540, height: 1920, background: SA, display: 'flex', alignItems: 'center', paddingLeft: 34}}>
        <div style={{fontFamily: fonts.display, fontSize: 92, color: G, lineHeight: 1}}>{'Villa\nPrato'.split('\n').map((l) => <div key={l}>{l}</div>)}</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center', fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 90, color: O, opacity: x,
        transform: `scale(${0.6 + 0.4 * x})`}}>×</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', ...mono(20, I), opacity: ip(f, 30, 42)}}>four hands · 13.11</div>
    </AbsoluteFill>
  );
};
const D_SEG: [number, React.ReactNode][] = [
  [8.5, <><Grid /><Sequence from={sec(6.6)}>{shade('bottom', 700)}<Big top={1400} kicker="villa prato · 13.11" text="one kitchen" /></Sequence></>],
  [1.8, <><Clip n="6013" at={0.5} len={1.8} z={[1.0, 1.06]} /></>],
  [1.6, <><Clip n="5962" at={0} len={1.6} /></>],
  [1.6, <><Clip n="6060" at={0} len={1.6} />{shade('bottom', 700)}<Big top={1400} text="one table" at={2} /></>],
  [3.4, <QuadGuests />],
  [2.6, <><Clip n="6227" at={4.5} len={2.6} z={[1.0, 1.05]} />{shade('bottom', 640)}<Big top={1420} text="one last pour" at={2} /></>],
  [2.2, <Clip n="6239" at={2.0} len={2.2} z={[1.0, 1.03]} />],
  [3.0, <Halves />],
];
function QuadGuests() {
  const ps: P[] = [{n: '6100', at: 1.8}, {n: '6124', at: 5.3}, {n: '6125', at: 3.5}, {n: '6182', at: 1.7}];
  return (
    <AbsoluteFill style={{background: colors.night}}>
      {ps.map((p, i) => <Panel key={i} i={i} p={p} appear={i * 4} gap={0} />)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 944, textAlign: 'center'}}><span style={{background: colors.night, padding: '8px 20px', ...mono(20, SA)}}>serve</span></div>
    </AbsoluteFill>
  );
}
export const D_SEC = D_SEG.reduce((s, [l]) => s + l, 0);
export const VillaQuad: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {music('villa-hands.mp3', D_SEC)}
      {D_SEG.map(([l, node], i) => { const from = sec(t); t += l; return <Sequence key={i} from={from} durationInFrames={sec(t) - from}>{node}</Sequence>; })}
    </AbsoluteFill>
  );
};

// ───────── E · full circle ─────────
// circle centre and radius of the round subject in each 1080×1920 frame (measured on stills at the chosen start)
type C = {n: string; at: number; len: number; cx: number; cy: number; r: number; line?: string; top?: boolean};
const R = 380, CX = 540, CY = 900;
const CIRC: C[] = [
  {n: '5965', at: 1, len: 1.5, cx: 470, cy: 732, r: 372},
  {n: '5964', at: 1, len: 0.9, cx: 624, cy: 930, r: 348},
  {n: '6013', at: 1, len: 1.4, cx: 553, cy: 897, r: 240, line: 'under the painted\nceilings of Villa Prato'},
  {n: '5953', at: 1, len: 1.3, cx: 508, cy: 947, r: 348},
  {n: '6086', at: 4.8, len: 1.5, cx: 544, cy: 890, r: 430, line: 'two kitchens'},
  {n: '6162', at: 1.5, len: 1.5, cx: 524, cy: 948, r: 420, line: 'four hands'},
  {n: '6138', at: 15.0, len: 1.5, cx: 588, cy: 984, r: 440},
  {n: '6122', at: 1, len: 1.5, cx: 475, cy: 981, r: 500, line: 'one long table'},
  {n: '6227', at: 5.0, len: 2.4, cx: 530, cy: 993, r: 240, line: 'and it all came\nfull circle'},
];
const Ring: React.FC<{total: number}> = ({total}) => {
  const f = useCurrentFrame();
  const a = ip(f, 4, 20) * (1 - ip(f, sec(total) - 12, sec(total)));
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <circle cx={CX} cy={CY} r={R + 26} fill="none" stroke={I} strokeWidth={5} strokeDasharray="4 16" strokeLinecap="round" opacity={a * 0.95}
        transform={`rotate(${f * 0.6} ${CX} ${CY})`} />
    </svg>
  );
};
const Matched: React.FC<{c: C}> = ({c}) => {
  const f = useCurrentFrame();
  // size the round subject to the ring, but never so small that the frame shows an edge after moving it to the centre
  const k = Math.max(Math.min(1.6, Math.max(1, R / c.r)), CX / c.cx, (1080 - CX) / (1080 - c.cx), CY / c.cy, (1920 - CY) / (1920 - c.cy));
  const drift = 1 + f / 900;  // a slow push so the cut keeps moving
  const tx = CX - c.cx * k, ty = CY - c.cy * k;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0',
        transform: `translate(${CX}px, ${CY}px) scale(${drift}) translate(${-CX}px, ${-CY}px) translate(${tx}px, ${ty}px) scale(${k})`}}>
        <Clip n={c.n} at={c.at} len={c.len} z={[1, 1]} />
      </div>
    </AbsoluteFill>
  );
};
const Caption: React.FC<{text: string; top?: boolean}> = ({text, top}) => {
  const f = useCurrentFrame();
  const a = ip(f, 3, 13);
  return (
    <>
      {shade(top ? 'top' : 'bottom', 560, 0.7)}
      <div style={{position: 'absolute', left: 0, right: 0, top: top ? 300 : 1400, textAlign: 'center', fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 58,
        lineHeight: 1.15, color: I, whiteSpace: 'pre-line', opacity: a}}>{text}</div>
    </>
  );
};
const CircleEnd: React.FC = () => {
  const f = useCurrentFrame();
  const d = ip(f, 0, 24, 0, 1, io);
  const a = (x: number) => ip(f, x, x + 14);
  return (
    <AbsoluteFill style={{background: G}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <circle cx={CX} cy={CY} r={R + 26} fill="none" stroke={O} strokeWidth={4} strokeDasharray={`${2 * Math.PI * (R + 26) * d} 9999`}
          transform={`rotate(-90 ${CX} ${CY})`} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: CY - 150, textAlign: 'center'}}>
        <div style={{fontFamily: fonts.display, fontSize: 96, color: I, lineHeight: 1, opacity: a(10)}}>Sea, Signora</div>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 60, color: O, margin: '10px 0', opacity: a(16)}}>×</div>
        <div style={{fontFamily: fonts.display, fontSize: 96, color: I, lineHeight: 1, opacity: a(22)}}>Villa Prato</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: CY + R + 90, textAlign: 'center', ...mono(20, SA), opacity: a(30)}}>cena a quattro mani · 13.11</div>
    </AbsoluteFill>
  );
};
const E_END = 3.2;
export const E_SEC = CIRC.reduce((s, c) => s + c.len, 0) + E_END;
export const VillaCircle: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {music('villa-letter.mp3', E_SEC)}
      {CIRC.map((c, i) => {
        const from = sec(t); t += c.len;
        return (
          <Sequence key={i} from={from} durationInFrames={sec(t) - from}>
            <Matched c={c} />
            {c.line && <Caption text={c.line} top={c.top} />}
          </Sequence>
        );
      })}
      <Sequence durationInFrames={sec(t)}><Ring total={t} /></Sequence>
      <Sequence from={sec(t)}><CircleEnd /></Sequence>
    </AbsoluteFill>
  );
};
