import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// «Атмосфера» (client 16.11 night: the last 30 failed on frames, design gimmicks and texts → wants live video atmosphere).
// 21 single steady takes (every window picked by measured camera shake, never-used files): guests at the table, the open
// kitchen, the room with the aquarium, the bar, the wine, the ice, the caviar. No graphics apart from a small lockup at the
// top; the words live in the post caption.

const FPS = 30;
type A = {id: string; day: string; src: string; at: number; sec: number; fx?: number; fy?: number; low?: boolean; caption: string; hashtags: string[]};

const Lockup: React.FC<{low?: boolean}> = ({low}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [8, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: low ? 1460 : 282, textAlign: 'center', opacity: o, transform: `translateY(${(1 - o) * 10}px)`}}>
      <div style={{fontFamily: fonts.display, fontSize: 54, color: colors.ivory, lineHeight: 1, textShadow: '0 2px 14px rgba(0,0,0,0.45)'}}>Sea, Signora</div>
      <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 15, letterSpacing: 7, textTransform: 'uppercase', color: colors.ivory, marginTop: 14,
        textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>brera · milano</div>
    </div>
  );
};

export const AtmosferaView: React.FC<{a: A}> = ({a}) => (
  <AbsoluteFill style={{background: colors.night}}>
    <OffthreadVideo src={staticFile(`videos/w14/${a.src}.mp4`)} startFrom={Math.round(a.at * FPS)} muted
      style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${a.fx ?? 50}% ${a.fy ?? 50}%`}} />
    {a.low ? <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 700, background: 'linear-gradient(rgba(11,11,11,0), rgba(11,11,11,0.45))'}} />
      : <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 520, background: 'linear-gradient(rgba(11,11,11,0.45), rgba(11,11,11,0))'}} />}
    <Lockup low={a.low} />
  </AbsoluteFill>
);

const tags = (...t: string[]) => ['#seasignora', ...t];
const s = (id: string, day: string, src: string, at: number, sec: number, caption: string, hashtags: string[], o: Partial<A> = {}): A =>
  ({id, day, src, at, sec, caption, hashtags, ...o});
export const ATMOSFERA: A[] = [
  s('K-01v-for-two', '1', 'pC074', 0.0, 7, 'A table for two, candlelit.', tags('#dinner', '#brera', '#milan')),
  s('K-02v-the-pour', '1', 'pC014', 0.0, 7, 'The first pour of the evening.', tags('#cocktails', '#bar', '#brera'), {low: true}),
  s('K-03v-ice', '2', 'pC028', 5.4, 8, 'Ice first.', tags('#cocktails', '#bar', '#brera')),
  s('K-04v-dinner-for-two', '2', 'pC060', 0.2, 8, 'Dinner for two, everything to share.', tags('#dinner', '#sharing', '#brera')),
  s('K-06v-by-the-kitchen', '3', 'pC071', 9.1, 8, 'A seat by the open kitchen.', tags('#openkitchen', '#brera', '#milan')),
  s('K-07v-strain', '4', 'pC029', 11.6, 8, 'Strained, slowly.', tags('#cocktails', '#bar', '#brera')),
  s('K-09v-the-shaker', '5', 'pC036', 15.8, 8, 'Shaken at the counter.', tags('#cocktails', '#bar', '#brera'), {low: true}),
  s('K-10v-the-coupe', '5', 'pC021', 6.8, 8, 'Served in a coupe.', tags('#cocktails', '#bar', '#brera'), {low: true}),
  s('K-11v-candlelight', '6', 'pC075', 9.0, 7, 'Candlelight, bread and a good bottle.', tags('#candlelight', '#dinner', '#brera')),
  s('K-12v-the-gin', '6', 'pC034', 0.4, 5, 'A measure of gin.', tags('#cocktails', '#bar', '#brera')),
];
