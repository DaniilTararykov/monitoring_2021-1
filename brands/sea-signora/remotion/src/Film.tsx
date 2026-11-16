import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// «Film» (client 16.11 night: no cut-outs, no frames / cards / objects — fresh look, new presentation, dishes framed
// differently). Each story is edited like a film title sequence: a colour title card with one word, then the photo shown
// three ways in hard cuts (an extreme detail, a closer crop, the whole frame or a slow pan across it), then an end card.
// Type lives only on the cards, never on a dish or a face. Hi-res originals of the shoot and Pixieset, English only.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory;
type Shot = {fx: number; fy: number; z0: number; z1: number; pan?: [number, number]};
type Spec = {id: string; img: string; land?: boolean; bg: string; ink: string; word: string; kicker: string; shots: [Shot, Shot, Shot];
  caption: string; hashtags: string[]};
const ip = (f: number, a: number, b: number, c: number, d: number, e: (t: number) => number = Easing.inOut(Easing.quad)) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

const ShotView: React.FC<{s: Spec; sh: Shot; len: number}> = ({s, sh, len}) => {
  const f = useCurrentFrame();
  const z = ip(f, 0, len, sh.z0, sh.z1);
  const px = sh.pan ? ip(f, 0, len, sh.pan[0], sh.pan[1]) : sh.fx;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Img src={staticFile(`photos/w16/${s.img}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${px}% ${sh.fy}%`,
        transform: `scale(${z})`, transformOrigin: `${sh.fx}% ${sh.fy}%`}} />
    </AbsoluteFill>
  );
};

const Card: React.FC<{s: Spec; end?: boolean}> = ({s, end}) => {
  const f = useCurrentFrame();
  const sc = ip(f, 0, 30, 1.08, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{background: s.bg, alignItems: 'center', justifyContent: 'center'}}>
      {end ? (
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: fonts.display, fontSize: 110, color: s.ink, lineHeight: 1}}>Sea, Signora</div>
          <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 20, letterSpacing: 7, textTransform: 'uppercase', color: s.ink, marginTop: 26}}>{s.kicker} · brera</div>
        </div>
      ) : (
        <div style={{textAlign: 'center', transform: `scale(${sc})`}}>
          <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 22, letterSpacing: 8, textTransform: 'uppercase', color: s.ink, marginBottom: 30}}>{s.kicker}</div>
          <div style={{fontFamily: fonts.display, fontSize: 260, color: s.ink, lineHeight: 0.9, textTransform: 'uppercase'}}>{s.word}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// timeline (frames at 30 fps): title 0–28, detail 28–96, closer 96–156, whole / pan 156–212, end card 212–240
const CUTS = [0, 28, 96, 156, 212, 240];
export const FilmView: React.FC<{s: Spec}> = ({s}) => (
  <AbsoluteFill style={{background: s.bg}}>
    <Sequence from={CUTS[0]} durationInFrames={CUTS[1]}><Card s={s} /></Sequence>
    {s.shots.map((sh, i) => (
      <Sequence key={i} from={CUTS[i + 1]} durationInFrames={CUTS[i + 2] - CUTS[i + 1]}><ShotView s={s} sh={sh} len={CUTS[i + 2] - CUTS[i + 1]} /></Sequence>
    ))}
    <Sequence from={CUTS[4]} durationInFrames={CUTS[5] - CUTS[4]}><Card s={s} end /></Sequence>
  </AbsoluteFill>
);

const tags = (...t: string[]) => ['#seasignora', ...t];
const sh = (fx: number, fy: number, z0: number, z1: number, pan?: [number, number]): Shot => ({fx, fy, z0, z1, pan});
export const FILM: Spec[] = [
  {id: 'N-01v-crab', img: 'f119.jpg', bg: O, ink: I, word: 'Crab', kicker: 'king crab', shots: [sh(55, 32, 3.0, 2.6), sh(50, 40, 1.7, 1.5), sh(50, 50, 1.0, 1.06)],
    caption: 'King crab, shown three ways: up close, closer, all of it.', hashtags: tags('#kingcrab', '#seafood', '#brera')},
  {id: 'N-02v-raw', img: 'f25.jpg', bg: G, ink: SA, word: 'Raw', kicker: 'crudo', shots: [sh(42, 42, 3.2, 2.8), sh(60, 30, 1.8, 1.6), sh(50, 50, 1.0, 1.06)],
    caption: 'Crudo: raw fish, tomato water, red onion. Look closer.', hashtags: tags('#crudo', '#rawfish', '#brera')},
  {id: 'N-03v-glow', img: 'bo465.jpg', land: true, bg: SA, ink: G, word: 'Glow', kicker: 'the table', shots: [sh(42, 40, 2.8, 2.5), sh(70, 50, 1.6, 1.45), sh(50, 50, 1.0, 1.0, [0, 100])],
    caption: 'Candles, glasses, a table that glows.', hashtags: tags('#candlelight', '#brera', '#milan')},
  {id: 'N-04v-crisp', img: 'f66.jpg', bg: G, ink: O, word: 'Crisp', kicker: 'lamb chops', shots: [sh(72, 28, 3.0, 2.7), sh(40, 60, 1.7, 1.5), sh(50, 50, 1.0, 1.06)],
    caption: 'Crisp outside, pink inside: our lamb chops.', hashtags: tags('#lamb', '#brera', '#milan')},
  {id: 'N-05v-soft', img: 'f48.jpg', bg: I, ink: G, word: 'Soft', kicker: 'burrata, red prawn', shots: [sh(38, 52, 3.0, 2.7), sh(65, 35, 1.7, 1.5), sh(50, 50, 1.0, 1.06)],
    caption: 'Soft burrata, sweet red prawn.', hashtags: tags('#burrata', '#redprawn', '#brera')},
  {id: 'N-06v-heat', img: 'bo237.jpg', land: true, bg: O, ink: G, word: 'Heat', kicker: 'the open kitchen', shots: [sh(55, 86, 2.6, 2.3), sh(30, 72, 1.5, 1.4), sh(50, 50, 1.0, 1.0, [100, 0])],
    caption: 'The open kitchen, at full heat.', hashtags: tags('#openkitchen', '#brera', '#milan')},
  {id: 'N-07v-seared', img: 'f89.jpg', land: true, bg: SA, ink: O, word: 'Seared', kicker: 'red tuna', shots: [sh(45, 42, 2.8, 2.5), sh(62, 45, 1.5, 1.4), sh(50, 50, 1.0, 1.0, [10, 90])],
    caption: 'Red tuna, seared on the outside, red at heart.', hashtags: tags('#tuna', '#brera', '#milan')},
  {id: 'N-09v-stay', img: 'bo63.jpg', land: true, bg: G, ink: SA, word: 'Stay', kicker: 'the room', shots: [sh(35, 60, 2.6, 2.3), sh(65, 45, 1.5, 1.4), sh(50, 50, 1.0, 1.0, [0, 100])],
    caption: 'Red velvet, candlelight. Stay a little longer.', hashtags: tags('#interiors', '#brera', '#milan')},
  {id: 'N-10v-more', img: 'f71.jpg', bg: I, ink: O, word: 'More', kicker: 'the table', shots: [sh(55, 30, 3.0, 2.7), sh(45, 70, 1.7, 1.5), sh(50, 50, 1.0, 1.06)],
    caption: 'One more plate for the table. Always.', hashtags: tags('#sharing', '#brera', '#milan')},
];
