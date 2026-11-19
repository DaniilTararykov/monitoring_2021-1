import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Recap of «Cena a Quattro Mani», Sea, Signora × Villa Prato, 13.11 (photographer's 4K footage, shot vertically).
// Classic look the client asked for: footage full-bleed, a soft night gradient, a short line of type; no bands.
// The idea runs on «four hands»: it opens on a split screen, one chef per half, that closes into a single frame of both
// chefs at the pass. Then the villa, the bar's welcome, the kitchen with the evening's menu read out line by line at the
// top of the frame, the service, the last pour of caramel, the chefs with the room, and the joint end card.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory;
const ip = (f: number, a: number, b: number, c = 0, d = 1, e: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const sec = (s: number) => Math.round(s * FPS);

const Clip: React.FC<{n: string; at: number; len: number; fx?: number; fy?: number; z?: [number, number]; rate?: number}> = ({n, at, len, fx = 50, fy = 50, z = [1.02, 1.08], rate = 1}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, sec(len)], z, {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <OffthreadVideo src={staticFile(`videos/villa/RZ4_${n}.mp4`)} startFrom={sec(at)} playbackRate={rate} muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`, transform: `scale(${s})`, transformOrigin: `${fx}% ${fy}%`}} />
    </AbsoluteFill>
  );
};
const shade = (side: 'top' | 'bottom', h = 760, a = 0.78) => (
  <div style={{position: 'absolute', left: 0, right: 0, [side]: 0, height: h,
    background: `linear-gradient(${side === 'top' ? 'to bottom' : 'to top'}, rgba(11,11,11,${a}) 0%, rgba(11,11,11,${a * 0.6}) 45%, rgba(11,11,11,0) 100%)`}} />
);
const Line: React.FC<{top: number; at?: number; kicker?: string; head?: string; sub?: string; center?: boolean; size?: number}> = ({top, at = 4, kicker, head, sub, center, size = 96}) => {
  const f = useCurrentFrame();
  const a = (d: number) => ip(f, at + d, at + d + 14);
  const al: React.CSSProperties = center ? {left: 0, right: 0, textAlign: 'center'} : {left: 90, right: 90};
  return (
    <div style={{position: 'absolute', top, ...al}}>
      {kicker && <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 20, letterSpacing: 6, textTransform: 'uppercase', color: SA, opacity: a(0), marginBottom: 16}}>{kicker}</div>}
      {head && <div style={{fontFamily: fonts.display, fontSize: size, lineHeight: 0.95, color: I, whiteSpace: 'pre-line', opacity: a(4), transform: `translateY(${(1 - a(4)) * 18}px)`}}>{head}</div>}
      {sub && <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 48, lineHeight: 1.2, color: I, marginTop: 16, whiteSpace: 'pre-line', opacity: a(12)}}>{sub}</div>}
    </div>
  );
};

// 0 · four hands: two halves, one chef each, that slide together into one frame
const Split: React.FC = () => {
  const f = useCurrentFrame();
  const open = ip(f, sec(2.2), sec(2.9), 0, 1, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence from={sec(2.2)}><Clip n="6169" at={15.6} len={2.4} /></Sequence>
      <div style={{position: 'absolute', left: -540 * open, top: 0, width: 540, height: 1920, overflow: 'hidden', borderRight: `3px solid ${I}`}}>
        <div style={{position: 'absolute', left: -270, top: 0, width: 1080, height: 1920}}><Clip n="6165" at={8.3} len={2.9} fx={42} /></div>
      </div>
      <div style={{position: 'absolute', left: 540 + 540 * open, top: 0, width: 540, height: 1920, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: -270, top: 0, width: 1080, height: 1920}}><Clip n="6159" at={12.5} len={2.9} fx={45} /></div>
      </div>
      {shade('bottom', 700)}
      <Sequence durationInFrames={sec(2.3)}><Line top={1390} center kicker="sea, signora × villa prato" head="two chefs" size={110} /></Sequence>
      <Sequence from={sec(2.5)}><Line top={1390} at={6} center kicker="13 november" head="four hands" size={110} /></Sequence>
    </AbsoluteFill>
  );
};

// the menu of the evening, line by line, at the top of the kitchen shots
// what is in each shot, checked against the printed menu: the canapés on spoons are the chefs' welcome, the plate with
// mushrooms is the monkfish carpaccio, the pot is the plin, the plates dotted with raspberry are the rabbit course, the
// pour of caramel is the choux. No shot of the hazelnut gelato, so it is not named.
const MenuLine: React.FC<{t: string; k?: string}> = ({t, k = 'on the menu'}) => (
  <>
    {shade('top', 720)}
    <Line top={290} at={2} kicker={k} sub={t} />
  </>
);
const M = {
  welcome: 'a welcome\nfrom the chefs',
  carpaccio: 'monkfish carpaccio,\nmushrooms three ways, dashi',
  plin: 'red mullet plin\nin its own broth',
  rabbit: 'rabbit, langoustine\nand raspberry',
  choux: 'choux, Chantilly cream,\nbuttermilk caramel',
};

type Cut = {n: string; at: number; len: number; fx?: number; fy?: number; z?: [number, number]; over?: React.ReactNode};
const CUTS: Cut[] = [
  // the villa
  {n: '6013', at: 0.5, len: 2.2, z: [1.0, 1.04], over: <>{shade('bottom', 760)}<Line top={1300} center kicker="villa prato" head={'a dinner\nin four hands'} size={100} /></>},
  {n: '5962', at: 0, len: 1.9},
  {n: '6060', at: 0, len: 1.9},
  {n: '5989', at: 0, len: 1.8, z: [1.0, 1.06]},
  // the bar
  {n: '6042', at: 4.4, len: 1.9, over: <>{shade('bottom', 700)}<Line top={1390} kicker="to begin" sub="a welcome from the bar" /></>},
  {n: '6097', at: 0, len: 1.6},
  {n: '6047', at: 0, len: 1.6},
  // the kitchen, with the menu
  {n: '6090', at: 5.6, len: 2.0, over: <MenuLine t={M.welcome} k="from the kitchen" />},
  {n: '6088', at: 3.3, len: 1.7, over: <MenuLine t={M.welcome} k="from the kitchen" />},
  {n: '6138', at: 15.1, len: 1.9, over: <MenuLine t={M.carpaccio} />},
  {n: '6086', at: 4.7, len: 1.9, over: <MenuLine t={M.plin} />},
  {n: '6162', at: 1.5, len: 2.0, over: <MenuLine t={M.rabbit} />},
  {n: '6163', at: 10.8, len: 1.7, over: <MenuLine t={M.rabbit} />},
  {n: '6177', at: 24.9, len: 1.9, over: <MenuLine t={M.rabbit} />},
  {n: '6178', at: 9.6, len: 1.7, over: <MenuLine t={M.rabbit} />},
  // the service
  {n: '6174', at: 1.5, len: 1.9},
  {n: '6182', at: 0.6, len: 1.8},
  {n: '6226', at: 0.8, len: 1.8},
  {n: '6124', at: 0.3, len: 1.8},
  // the last course
  {n: '6227', at: 4.5, len: 2.8, z: [1.0, 1.05], over: <MenuLine t={M.choux} k="to finish" />},
  // the chefs and the room
  {n: '6239', at: 2.1, len: 3.0, z: [1.0, 1.03], over: <>{shade('bottom', 640)}<Line top={1420} center sub="thank you for coming" /></>},
];
const OPEN = 4.6, END = 3.0;
export const VILLA_RECAP_SEC = OPEN + CUTS.reduce((s, c) => s + c.len, 0) + END;

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const a = (d: number) => ip(f, d, d + 16);
  return (
    <AbsoluteFill style={{background: G, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 22, letterSpacing: 8, textTransform: 'uppercase', color: O, opacity: a(0)}}>13 · 11 · 2026</div>
      <div style={{fontFamily: fonts.display, fontSize: 120, lineHeight: 1, color: I, marginTop: 34, opacity: a(6)}}>Sea, Signora</div>
      <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 64, color: SA, margin: '18px 0', opacity: a(14)}}>×</div>
      <div style={{fontFamily: fonts.display, fontSize: 120, lineHeight: 1, color: I, opacity: a(20)}}>Villa Prato</div>
      <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 50, color: SA, marginTop: 44, opacity: a(32)}}>four hands, one evening</div>
    </AbsoluteFill>
  );
};

export const VillaRecap: React.FC = () => {
  let t = OPEN;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('music/villa.mp3')} volume={(fr) => interpolate(fr, [0, 15, sec(VILLA_RECAP_SEC) - 45, sec(VILLA_RECAP_SEC)], [0, 0.8, 0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      <Sequence durationInFrames={sec(OPEN)}><Split /></Sequence>
      {CUTS.map((c, i) => {
        const from = sec(t); t += c.len;
        return (
          <Sequence key={i} from={from} durationInFrames={sec(t) - from}>
            <Clip n={c.n} at={c.at} len={c.len} fx={c.fx} fy={c.fy} z={c.z} />
            {c.over}
          </Sequence>
        );
      })}
      <Sequence from={sec(t)}><EndCard /></Sequence>
    </AbsoluteFill>
  );
};
