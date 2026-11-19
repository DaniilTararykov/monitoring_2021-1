import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';
import {Clip, Line, shade} from './VillaRecap';

loadBrandFonts();

// Two more cuts of the Villa Prato four-hands dinner (client 19.11: «дай ещё два варианта»).
// B · «Hands»: fast, on the beat, only hands at work; five chapters in one big word each (prep, pour, plate, serve,
//     share) and a counter of the four hands. C · «Dear Villa Prato»: slow, long takes, a thank-you letter to the villa
//     written line by line, each line about what is in the frame. Same classic look: footage, night gradient, type.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory;
const sec = (s: number) => Math.round(s * FPS);
const ip = (f: number, a: number, b: number, c = 0, d = 1) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

type Cut = {n: string; at: number; len: number; fx?: number; z?: [number, number]};
const music = (file: string, total: number) => (
  <Audio src={staticFile(`music/${file}`)} volume={(fr) => interpolate(fr, [0, 10, sec(total) - 40, sec(total)], [0, 0.85, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
);

// ───────── B · Hands ─────────
const Word: React.FC<{w: string; n: number}> = ({w, n}) => {
  const f = useCurrentFrame();
  const a = ip(f, 0, 8);
  return (
    <>
      {shade('top', 640, 0.72)}
      <div style={{position: 'absolute', left: 90, top: 290, fontFamily: fonts.mono, fontWeight: 500, fontSize: 20, letterSpacing: 6, textTransform: 'uppercase', color: SA}}>
        {`0${n} / 05 · four hands`}</div>
      <div style={{position: 'absolute', left: 84, top: 330, fontFamily: fonts.display, fontSize: 190, lineHeight: 1, color: I, opacity: a,
        transform: `translateY(${(1 - a) * 30}px)`, letterSpacing: 4}}>{w}</div>
    </>
  );
};
const CH: {w: string; cuts: Cut[]}[] = [
  {w: 'PREP', cuts: [{n: '6086', at: 4.8, len: 1.3}, {n: '6085', at: 2.3, len: 1.2}, {n: '6090', at: 5.6, len: 1.3}, {n: '6164', at: 3.7, len: 1.2}]},
  {w: 'POUR', cuts: [{n: '6096', at: 3.5, len: 1.2}, {n: '6043', at: 4.8, len: 1.2}, {n: '6138', at: 9.6, len: 1.3}, {n: '6226', at: 1.7, len: 1.2}]},
  {w: 'PLATE', cuts: [{n: '6162', at: 1.5, len: 1.2}, {n: '6157', at: 5.7, len: 1.2}, {n: '6177', at: 26.2, len: 1.3}, {n: '6178', at: 6.7, len: 1.2}, {n: '6165', at: 8.9, len: 1.3}]},
  {w: 'SERVE', cuts: [{n: '6174', at: 2.4, len: 1.4}, {n: '6125', at: 3.5, len: 1.2}, {n: '6182', at: 1.7, len: 1.3}]},
  {w: 'SHARE', cuts: [{n: '6100', at: 1.8, len: 1.3}, {n: '6124', at: 5.3, len: 1.3}, {n: '6101', at: 1.0, len: 1.3}]},
];
const HANDS_END = 3.0, CHEFS = 2.2;  // the two chefs with the room close the cut, without a word over their faces
export const HANDS_SEC = CH.reduce((s, c) => s + c.cuts.reduce((x, k) => x + k.len, 0), 0) + CHEFS + HANDS_END;

const HandsEnd: React.FC = () => {
  const f = useCurrentFrame();
  const a = (d: number) => ip(f, d, d + 12);
  return (
    <AbsoluteFill style={{background: O, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{fontFamily: fonts.display, fontSize: 210, lineHeight: 0.9, color: G, opacity: a(0)}}>{'FOUR\nHANDS'.split('\n').map((l) => <div key={l}>{l}</div>)}</div>
      <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 52, color: I, marginTop: 40, opacity: a(10)}}>one evening at Villa Prato</div>
      <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 20, letterSpacing: 6, textTransform: 'uppercase', color: G, marginTop: 30, opacity: a(18)}}>sea, signora × villa prato · 13.11</div>
    </AbsoluteFill>
  );
};
export const VillaHands: React.FC = () => {
  let t = 0;
  const seqs: React.ReactNode[] = [];
  CH.forEach((c, ci) => {
    const start = sec(t);
    c.cuts.forEach((k, i) => {
      const from = sec(t); t += k.len;
      seqs.push(<Sequence key={`${ci}-${i}`} from={from} durationInFrames={sec(t) - from}><Clip n={k.n} at={k.at} len={k.len} z={k.z ?? [1.04, 1.1]} /></Sequence>);
    });
    seqs.push(<Sequence key={`w${ci}`} from={start} durationInFrames={sec(t) - start}><Word w={c.w} n={ci + 1} /></Sequence>);
  });
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {music('villa-hands.mp3', HANDS_SEC)}
      {seqs}
      <Sequence from={sec(t)} durationInFrames={sec(CHEFS)}><Clip n="6239" at={2.0} len={CHEFS} z={[1.0, 1.03]} /></Sequence>
      <Sequence from={sec(t + CHEFS)}><HandsEnd /></Sequence>
    </AbsoluteFill>
  );
};

// ───────── C · Dear Villa Prato ─────────
type L = Cut & {line?: string; side: 'top' | 'bottom'; first?: boolean};
const LETTER: L[] = [
  {n: '6013', at: 0.5, len: 3.4, z: [1.0, 1.05], side: 'bottom', first: true, line: 'Dear Villa Prato,'},
  {n: '6022', at: 0, len: 3.2, z: [1.0, 1.05], side: 'bottom', line: 'thank you for the painted ceilings,'},
  {n: '6051', at: 0.2, len: 3.2, side: 'bottom', line: 'for a table long enough\nfor everyone,'},
  {n: '6169', at: 15.6, len: 3.4, side: 'bottom', line: 'for a kitchen with room\nfor four hands,'},
  {n: '6178', at: 6.7, len: 3.2, side: 'top', line: 'for every plate\nwe finished together,'},
  {n: '6182', at: 0.6, len: 3.2, side: 'bottom', line: 'for the wine,'},
  {n: '6124', at: 0.3, len: 3.2, side: 'top', line: 'and for the guests who stayed'},
  {n: '6227', at: 4.0, len: 3.6, z: [1.0, 1.05], side: 'bottom', line: 'until the very last pour.'},
  {n: '6239', at: 2.0, len: 3.6, z: [1.0, 1.03], side: 'bottom', line: 'Until next time.'},
];
const LETTER_END = 4.0;
export const LETTER_SEC = LETTER.reduce((s, c) => s + c.len, 0) + LETTER_END;

const Written: React.FC<{text: string; side: 'top' | 'bottom'; big?: boolean}> = ({text, side, big}) => {
  const f = useCurrentFrame();
  const chars = Math.floor(interpolate(f, [6, 6 + text.length * 1.4], [0, text.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <>
      {shade(side, 720, 0.75)}
      <div style={{position: 'absolute', left: 90, right: 90, top: side === 'top' ? 300 : 1380, fontFamily: fonts.serif, fontStyle: 'italic', fontSize: big ? 78 : 60,
        lineHeight: 1.18, color: I, whiteSpace: 'pre-line'}}>
        {text.slice(0, chars)}<span style={{opacity: chars < text.length ? 1 : 0, color: O}}>|</span>
      </div>
    </>
  );
};
const Signed: React.FC = () => {
  const f = useCurrentFrame();
  const a = (d: number) => ip(f, d, d + 18);
  return (
    <AbsoluteFill style={{background: colors.ivory, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 54, color: G, opacity: a(0)}}>with love,</div>
      <div style={{fontFamily: fonts.display, fontSize: 130, color: G, marginTop: 20, opacity: a(10)}}>Sea, Signora</div>
      <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 20, letterSpacing: 6, textTransform: 'uppercase', color: O, marginTop: 40, opacity: a(22)}}>cena a quattro mani · 13.11</div>
    </AbsoluteFill>
  );
};
export const VillaLetter: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {music('villa-letter.mp3', LETTER_SEC)}
      {LETTER.map((c, i) => {
        const from = sec(t); t += c.len;
        return (
          <Sequence key={i} from={from} durationInFrames={sec(t) - from}>
            <Clip n={c.n} at={c.at} len={c.len} z={c.z ?? [1.0, 1.06]} rate={0.8} />
            {c.line && <Written text={c.line} side={c.side} big={c.first} />}
          </Sequence>
        );
      })}
      <Sequence from={sec(t)}><Signed /></Sequence>
    </AbsoluteFill>
  );
};
