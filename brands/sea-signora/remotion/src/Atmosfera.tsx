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
type A = {id: string; day: string; src: string; at: number; sec: number; fx?: number; fy?: number; caption: string; hashtags: string[]};

const Lockup: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [8, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 282, textAlign: 'center', opacity: o, transform: `translateY(${(1 - o) * 10}px)`}}>
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
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 520, background: 'linear-gradient(rgba(11,11,11,0.45), rgba(11,11,11,0))'}} />
    <Lockup />
  </AbsoluteFill>
);

const tags = (...t: string[]) => ['#seasignora', ...t];
const s = (id: string, day: string, src: string, at: number, sec: number, caption: string, hashtags: string[], o: Partial<A> = {}): A =>
  ({id, day, src, at, sec, caption, hashtags, ...o});
export const ATMOSFERA: A[] = [
  s('K-01v-aquarium-table', '1', 'g2669', 11.3, 8, 'A long table by the aquarium.', tags('#brera', '#milan', '#dinner')),
  s('K-02v-open-kitchen', '1', 'v0106', 3.6, 8, 'Dinner with a view of the open kitchen.', tags('#openkitchen', '#brera', '#milan')),
  s('K-03v-at-the-counter', '1', 'v4255', 4.9, 8, 'One for you, at the counter.', tags('#cocktails', '#bar', '#brera')),
  s('K-04v-full-table', '2', 'g2675', 1.0, 8, 'A full table, the best kind.', tags('#friends', '#dinner', '#brera')),
  s('K-05v-the-pass', '2', 'g2670', 10.1, 8, 'Plated at the pass, minutes from your table.', tags('#openkitchen', '#chef', '#brera')),
  s('K-06v-white-wine', '2', 'v7466', 4.5, 8, 'Three glasses, poured slowly.', tags('#wine', '#brera', '#milan')),
  s('K-07v-busy-room', '3', 'v0137', 1.4, 8, 'The room at its best: full.', tags('#brera', '#milan', '#nightout')),
  s('K-08v-blue-room', '3', 'v0114', 6.3, 8, 'The aquarium, the lights, the room.', tags('#aquarium', '#brera', '#milan')),
  s('K-09v-ice', '3', 'v7423', 9.8, 8, 'Ice, for what comes next.', tags('#bar', '#brera', '#milan')),
  s('K-10v-evening', '4', 'v0109', 7.1, 8, 'An ordinary evening in Brera.', tags('#brera', '#milan', '#dinner')),
  s('K-11v-grill', '4', 'g2679', 1.6, 8, 'At the grill.', tags('#grill', '#openkitchen', '#brera')),
  s('K-12v-golden', '4', 'v4258', 3.1, 8, 'Golden, at the bar.', tags('#cocktails', '#bar', '#brera')),
  s('K-13v-under-blue', '5', 'v0107', 31.3, 8, 'Dinner under the blue.', tags('#aquarium', '#brera', '#milan')),
  s('K-14v-kitchen-night', '5', 'v0112', 9.9, 8, 'The kitchen, mid-service.', tags('#openkitchen', '#brera', '#milan')),
  s('K-15v-pour', '5', 'v7462', 6.1, 8, 'Still or sparkling? Poured at the table.', tags('#brera', '#milan', '#dinner')),
  s('K-16v-candlelight', '6', 'v0100', 0.0, 8, 'Low lights, long dinners.', tags('#candlelight', '#brera', '#milan')),
  s('K-17v-kitchen-line', '6', 'g2606', 0.0, 8, 'The open kitchen at full speed.', tags('#openkitchen', '#brera', '#milan')),
  s('K-18v-caviar', '6', 'v4247', 5.3, 8, 'Caviar service, at the table.', tags('#caviar', '#brera', '#milan')),
  s('K-19v-chandeliers', '7', 'v0138', 0.2, 7, 'Under the chandeliers.', tags('#interiors', '#brera', '#milan')),
  s('K-20v-corner-table', '7', 'v0133', 5.1, 8, 'A corner table, candlelit.', tags('#candlelight', '#brera', '#milan')),
  s('K-21v-the-menu', '7', 'v7426', 0.0, 8, 'First, the menu.', tags('#menu', '#brera', '#milan')),
];
