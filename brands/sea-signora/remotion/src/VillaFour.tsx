import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Villa Prato, four different versions (client 19.11: «не нравятся перескоки, не нравятся повторные кадры, 4 абсолютно
// разные версии с заголовком Two chefs, four hands, one evening»). Rules for all four: long steady takes (~3 s, the
// steadiest window of each clip), calm transitions, no clip used twice in a video and no clip shared between versions,
// one headline: «Two chefs, four hands, one evening». Each version has its own footage, track, rhythm and type.
// V1 · The evening — the night in order (villa, bar, kitchen, table, chef with the room), soft dissolves; the headline
//      builds line by line over the first three shots. Velvet strings.
// V2 · Behind the pass — only the kitchen, straight cuts on long takes; the headline arrives once, at the end, over both
//      chefs at the pass. Noir jazz.
// V3 · The villa — the rooms, the ceilings, the bottles, the guests; slow dissolves; the headline sits in the middle of
//      the film over the painted ceiling, in italic. Slow Sunday.
// V4 · Side by side — split screen all the way: one pair of hands on each half, doing the same thing at the same time;
//      the halves join for the last shot. Marble minimal.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory;
const sec = (s: number) => Math.round(s * FPS);
const ip = (f: number, a: number, b: number, c = 0, d = 1, e: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const io = Easing.inOut(Easing.cubic);
const mono = (s: number, c: string): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: s, letterSpacing: 6, textTransform: 'uppercase', color: c});
const HEAD = ['Two chefs,', 'four hands,', 'one evening'];

const Shot: React.FC<{n: string; at: number; len: number; z?: [number, number]; fx?: number; fy?: number}> = ({n, at, len, z = [1.0, 1.06], fx = 50, fy = 50}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, sec(len)], z, {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(`videos/villa/RZ4_${n}.mp4`)} startFrom={sec(at)} muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`, transform: `scale(${s})`, transformOrigin: `${fx}% ${fy}%`}} />
    </AbsoluteFill>
  );
};
const shade = (side: 'top' | 'bottom', h = 760, a = 0.78) => (
  <div style={{position: 'absolute', left: 0, right: 0, [side]: 0, height: h,
    background: `linear-gradient(${side === 'top' ? 'to bottom' : 'to top'}, rgba(11,11,11,${a}) 0%, rgba(11,11,11,${a * 0.6}) 45%, rgba(11,11,11,0) 100%)`}} />
);
const track = (file: string, frames: number) => (
  <Audio src={staticFile(`music/${file}`)} volume={(fr) => interpolate(fr, [0, 20, frames - 50, frames], [0, 0.8, 0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
);
type S = {n: string; at: number; len: number; z?: [number, number]; fx?: number};
// shots overlap by `x` seconds and the next one fades in over the overlap (x = 0: straight cut)
const Reel: React.FC<{shots: S[]; x: number}> = ({shots, x}) => {
  let t = 0;
  return (
    <>
      {shots.map((s, i) => {
        const from = sec(t); t += s.len - x;
        return (
          <Sequence key={i} from={from} durationInFrames={sec(s.len)}>
            <Fade on={i > 0 && x > 0} d={sec(x)}><Shot n={s.n} at={s.at} len={s.len} z={s.z} fx={s.fx} /></Fade>
          </Sequence>
        );
      })}
    </>
  );
};
const Fade: React.FC<{on: boolean; d: number; children: React.ReactNode}> = ({on, d, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: on ? ip(f, 0, d, 0, 1, io) : 1}}>{children}</AbsoluteFill>;
};
const reelLen = (shots: S[], x: number) => shots.reduce((s, k) => s + k.len, 0) - x * (shots.length - 1);
const EndLogos: React.FC<{bg: string; ink: string; accent: string}> = ({bg, ink, accent}) => {
  const f = useCurrentFrame();
  const a = (d: number) => ip(f, d, d + 18);
  return (
    <AbsoluteFill style={{background: bg, alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: ip(f, 0, 12)}}>
      <div style={{fontFamily: fonts.display, fontSize: 104, color: ink, lineHeight: 1, opacity: a(6)}}>Sea, Signora</div>
      <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 60, color: accent, margin: '14px 0', opacity: a(12)}}>×</div>
      <div style={{fontFamily: fonts.display, fontSize: 104, color: ink, lineHeight: 1, opacity: a(18)}}>Villa Prato</div>
      <div style={{...mono(20, accent), marginTop: 44, opacity: a(28)}}>13 · 11</div>
    </AbsoluteFill>
  );
};

// ───────── V1 · The evening ─────────
const V1S: S[] = [
  {n: '6022', at: 0, len: 3.2}, {n: '5999', at: 0, len: 3.0}, {n: '6050', at: 2.4, len: 3.0}, {n: '6093', at: 0.6, len: 3.0},
  {n: '6087', at: 7.7, len: 3.0}, {n: '6137', at: 3.0, len: 3.0}, {n: '6100', at: 0.6, len: 3.0}, {n: '6226', at: 0.6, len: 3.0},
  {n: '6102', at: 33.8, len: 3.4, z: [1.0, 1.03]},
];
const V1X = 0.5, V1END = 2.6;
export const V1_FRAMES = sec(reelLen(V1S, V1X) + V1END);
const BuildHead: React.FC = () => {
  const f = useCurrentFrame();
  const out = 1 - ip(f, sec(8.2), sec(8.8));
  return (
    <>
      <div style={{opacity: out}}>{shade('bottom', 820, 0.8)}</div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 1220, opacity: out}}>
        {HEAD.map((l, i) => {
          const a = ip(f, sec(0.4 + i * 2.6), sec(0.4 + i * 2.6) + 18);
          return <div key={l} style={{fontFamily: fonts.display, fontSize: 104, lineHeight: 1.0, color: I, opacity: a, transform: `translateY(${(1 - a) * 18}px)`}}>{l}</div>;
        })}
      </div>
    </>
  );
};
export const VillaV1: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {track('velvet-strings.mp3', V1_FRAMES)}
    <Reel shots={V1S} x={V1X} />
    <Sequence durationInFrames={sec(9)}><BuildHead /></Sequence>
    <Sequence from={sec(reelLen(V1S, V1X) - 0.4)}><EndLogos bg={G} ink={I} accent={O} /></Sequence>
  </AbsoluteFill>
);

// ───────── V2 · Behind the pass ─────────
const V2S: S[] = [
  {n: '6159', at: 12.0, len: 2.8}, {n: '6165', at: 8.0, len: 2.8}, {n: '6164', at: 2.3, len: 2.8}, {n: '6167', at: 1.0, len: 2.8},
  {n: '6157', at: 5.7, len: 2.8}, {n: '6091', at: 3.9, len: 2.8}, {n: '6092', at: 7.7, len: 2.8}, {n: '6098', at: 10.0, len: 2.8},
  {n: '6169', at: 15.4, len: 4.4, z: [1.0, 1.04]},
];
export const V2_FRAMES = sec(reelLen(V2S, 0));
const EndHead: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {shade('bottom', 900, 0.85)}
      <div style={{position: 'absolute', left: 90, right: 90, top: 1180}}>
        <div style={{...mono(20, SA), opacity: ip(f, 6, 20), marginBottom: 20}}>sea, signora × villa prato</div>
        {HEAD.map((l, i) => <div key={l} style={{fontFamily: fonts.display, fontSize: 100, lineHeight: 1.0, color: i === 1 ? O : I,
          opacity: ip(f, 14 + i * 12, 30 + i * 12)}}>{l}</div>)}
      </div>
    </>
  );
};
export const VillaV2: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {track('noir-jazz.mp3', V2_FRAMES)}
    <Reel shots={V2S} x={0} />
    <Sequence from={sec(reelLen(V2S, 0) - 4.4)}><EndHead /></Sequence>
  </AbsoluteFill>
);

// ───────── V3 · The villa ─────────
const V3S: S[] = [
  {n: '5954', at: 0.5, len: 3.4}, {n: '5967', at: 0, len: 3.2}, {n: '6012', at: 1.3, len: 3.2}, {n: '6008', at: 0, len: 3.6, z: [1.0, 1.08]},
  {n: '6011', at: 1.4, len: 3.2}, {n: '5983', at: 5.7, len: 3.0}, {n: '6039', at: 2.4, len: 3.2}, {n: '6099', at: 0.6, len: 3.0},
  {n: '6224', at: 0.7, len: 3.0}, {n: '6240', at: 3.3, len: 3.2, z: [1.0, 1.03]},
];
const V3X = 0.8, V3END = 2.6;
export const V3_FRAMES = sec(reelLen(V3S, V3X) + V3END);
const MidHead: React.FC = () => {
  const f = useCurrentFrame();
  const a = ip(f, 8, 30) * (1 - ip(f, sec(4.2), sec(4.8)));
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(11,11,11,0.38)', opacity: a}} />
      <div style={{opacity: a, transform: `translateY(${(1 - a) * 14}px)`}}>
        {HEAD.map((l) => <div key={l} style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 92, lineHeight: 1.15, color: I, textShadow: '0 4px 30px rgba(0,0,0,0.5)'}}>{l}</div>)}
      </div>
    </AbsoluteFill>
  );
};
export const VillaV3: React.FC = () => {
  const startOf = (i: number) => V3S.slice(0, i).reduce((s, k) => s + k.len - V3X, 0);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {track('slow-sunday.mp3', V3_FRAMES)}
      <Reel shots={V3S} x={V3X} />
      <Sequence from={sec(startOf(3))} durationInFrames={sec(5)}><MidHead /></Sequence>
      <Sequence from={sec(reelLen(V3S, V3X) - 0.6)}><EndLogos bg={I} ink={G} accent={O} /></Sequence>
    </AbsoluteFill>
  );
};

// ───────── V4 · Side by side ─────────
const PAIRS: [S, S][] = [
  [{n: '6151', at: 6.6, len: 3.0}, {n: '6086', at: 4.6, len: 3.0}],
  [{n: '6090', at: 5.6, len: 3.0}, {n: '6088', at: 3.0, len: 3.0}],
  [{n: '6162', at: 0.8, len: 3.0}, {n: '6177', at: 24.4, len: 3.0}],
  [{n: '6096', at: 2.7, len: 3.0}, {n: '6043', at: 3.3, len: 3.0}],
  [{n: '6178', at: 9.6, len: 3.0}, {n: '6163', at: 10.5, len: 3.0}],
  [{n: '6138', at: 3.5, len: 3.0}, {n: '6227', at: 5.0, len: 3.0}],
];
const V4FULL = 4.2, V4END = 2.8;
export const V4_FRAMES = sec(PAIRS.length * 3 + V4FULL + V4END);
const Half: React.FC<{s: S; side: 0 | 1; enter: boolean}> = ({s, side, enter}) => {
  const f = useCurrentFrame();
  const y = enter ? ip(f, 0, 14, side ? 1 : -1, 0, io) * 1920 : 0;
  return (
    <div style={{position: 'absolute', left: side * 543, top: 0, width: 537, height: 1920, overflow: 'hidden', transform: `translateY(${y}px)`}}>
      <div style={{position: 'absolute', left: -270, top: 0, width: 1080, height: 1920}}><Shot n={s.n} at={s.at} len={s.len} z={[1.04, 1.1]} /></div>
    </div>
  );
};
const SplitWord: React.FC<{text: string}> = ({text}) => {
  const f = useCurrentFrame();
  const a = ip(f, 6, 20) * (1 - ip(f, sec(5.4), sec(5.9)));
  return (
    <>
      <div style={{opacity: a}}>{shade('bottom', 640, 0.8)}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center', fontFamily: fonts.display, fontSize: 112, color: I, opacity: a}}>{text}</div>
    </>
  );
};
const Joined: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Shot n="6239" at={2.0} len={V4FULL} z={[1.0, 1.03]} />
      {shade('bottom', 640, 0.8)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center', fontFamily: fonts.display, fontSize: 112, color: I, opacity: ip(f, 8, 24)}}>{HEAD[2]}</div>
    </>
  );
};
export const VillaV4: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    {track('marble-minimal.mp3', V4_FRAMES)}
    {PAIRS.map(([l, r], i) => (
      <Sequence key={i} from={sec(i * 3)} durationInFrames={sec(3)}>
        <Half s={l} side={0} enter={i === 0} /><Half s={r} side={1} enter={i === 0} />
      </Sequence>
    ))}
    <Sequence durationInFrames={sec(6)}><SplitWord text={HEAD[0]} /></Sequence>
    <Sequence from={sec(6)} durationInFrames={sec(6)}><SplitWord text={HEAD[1]} /></Sequence>
    <Sequence from={sec(PAIRS.length * 3)} durationInFrames={sec(V4FULL)}><Joined /></Sequence>
    <Sequence from={sec(PAIRS.length * 3 + V4FULL)}><EndLogos bg={SA} ink={G} accent={O} /></Sequence>
  </AbsoluteFill>
);
