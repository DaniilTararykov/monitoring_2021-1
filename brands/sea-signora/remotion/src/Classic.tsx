import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Back to the classic look (client 18.11: no bands, no boxes, no arches, no gimmicks): the photo full-bleed, a soft night
// gradient on the side where the frame is empty, and a short line of type on it. Replaces the burrata «vocabolario» arch
// (X-02p) and the puzzle (I-09v).

const SA = brandPalette.sand454, I = colors.ivory;
const ip = (f: number, a: number, b: number, c = 0, d = 1) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

type Spec = {id: string; sec: number; img: string; fx?: number; fy?: number; side: 'top' | 'bottom'; textTop: number; kicker: string; head: string; sub: string;
  still?: boolean; caption: string; hashtags: string[]};

const ClassicView: React.FC<{s: Spec}> = ({s}) => {
  const f = useCurrentFrame();
  const a = (at: number) => (s.still ? 1 : ip(f, at, at + 14));
  const z = s.still ? 1 : 1.0 + f / 1800;
  return (
    <AbsoluteFill style={{background: colors.night, overflow: 'hidden'}}>
      <Img src={staticFile(`photos/${s.img}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${s.fx ?? 50}% ${s.fy ?? 50}%`, transform: `scale(${z})`}} />
      <div style={{position: 'absolute', left: 0, right: 0, [s.side]: 0, height: 860,
        background: `linear-gradient(${s.side === 'top' ? 'to bottom' : 'to top'}, rgba(11,11,11,0.88) 0%, rgba(11,11,11,0.62) 42%, rgba(11,11,11,0) 100%)`}} />
      <div style={{position: 'absolute', left: 90, right: 90, top: s.textTop}}>
        {s.kicker && <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 20, letterSpacing: 6, textTransform: 'uppercase', color: SA, opacity: a(4), marginBottom: 18}}>{s.kicker}</div>}
        <div style={{fontFamily: fonts.display, fontSize: 104, lineHeight: 0.95, color: I, whiteSpace: 'pre-line', opacity: a(10),
          transform: `translateY(${(1 - a(10)) * 20}px)`}}>{s.head}</div>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 50, lineHeight: 1.2, color: I, marginTop: 20, opacity: a(22)}}>{s.sub}</div>
      </div>
    </AbsoluteFill>
  );
};

const tags = (...t: string[]) => ['#seasignora', ...t];
const SPECS: Spec[] = [
  {id: 'C-01p-burrata', sec: 1, img: 'w11/f44.jpg', fy: 40, side: 'bottom', textTop: 1395, still: true, kicker: '', head: 'Burrata',
    sub: 'with red prawn and bottarga', caption: 'Burrata with red prawn and bottarga.', hashtags: tags('#burrata', '#redprawn', '#brera')},
  {id: 'C-02v-the-table', sec: 7, img: 'w13/f53.jpg', fy: 60, side: 'top', textTop: 300, kicker: 'sea, signora · brera', head: 'The table is set',
    sub: 'the rest is up to you', caption: 'The table is set. The rest is up to you.', hashtags: tags('#dinner', '#brera', '#milan')},
];
export const CLASSIC = SPECS.map((s) => ({...s, view: () => <ClassicView s={s} />}));
