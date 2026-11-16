import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// «Ask for» (client 16.11 night: «переделать — значит заново: новые формулировки, визуал, дизайн»). A new idea, not a
// tweak of the dish cards: the waiter's tip. Each story is one line said the way a waiter would say it at the table, in
// large Spectral italic, and an orange «ask for …» tag with the dish name, the way you would order it. Photo full-bleed
// where it leaves a clean area for the words; when the dish fills the whole frame, the sharp photo sits in the middle
// over a soft blurred copy of itself and the words get the space above and below. No «new», no repeated label.

const FPS = 30;
const O = brandPalette.orange158, I = colors.ivory;
const ip = (f: number, a: number, b: number, c = 0, d = 1) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

type Tip = {id: string; img: string; fit: 'full' | 'panel'; fx?: number; fy?: number; lineTop: number; line: string; ask: string; askTop: number;
  caption: string; hashtags: string[]};

const Words: React.FC<{t: Tip}> = ({t}) => {
  const f = useCurrentFrame();
  const words = t.line.split(' ');
  return (
    <>
      <div style={{position: 'absolute', left: 90, right: 90, top: t.lineTop, fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 74, lineHeight: 1.18, color: I,
        textShadow: '0 2px 18px rgba(0,0,0,0.45)'}}>
        {words.map((w, i) => <span key={i} style={{opacity: ip(f, 14 + i * 3, 24 + i * 3)}}>{w} </span>)}
      </div>
      <div style={{position: 'absolute', left: 90, top: t.askTop, display: 'flex', alignItems: 'center', gap: 16, opacity: ip(f, 20 + words.length * 3, 34 + words.length * 3),
        transform: `translateY(${(1 - ip(f, 20 + words.length * 3, 34 + words.length * 3)) * 16}px)`}}>
        <span style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 20, letterSpacing: 5, textTransform: 'uppercase', color: I}}>ask for</span>
        <span style={{background: O, color: I, padding: '12px 22px', borderRadius: 40, fontFamily: fonts.display, fontSize: 44, lineHeight: 1}}>{t.ask}</span>
      </div>
      <div style={{position: 'absolute', right: 90, top: 290, fontFamily: fonts.display, fontSize: 40, color: I, opacity: ip(f, 0, 14), textShadow: '0 2px 12px rgba(0,0,0,0.5)'}}>Sea, Signora</div>
    </>
  );
};

export const TipView: React.FC<{t: Tip}> = ({t}) => {
  const f = useCurrentFrame();
  const z = 1.02 + f / 4000;
  const src = staticFile(`photos/w16/${t.img}`);
  return (
    <AbsoluteFill style={{background: colors.night, overflow: 'hidden'}}>
      {t.fit === 'full' ? (
        <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${t.fx ?? 50}% ${t.fy ?? 50}%`, transform: `scale(${z})`}} />
      ) : (
        <>
          <Img src={src} style={{position: 'absolute', inset: -60, width: 1200, height: 2040, objectFit: 'cover', filter: 'blur(40px) brightness(0.45) saturate(1.2)'}} />
          <div style={{position: 'absolute', left: 0, top: 700, width: 1080, height: 720, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.5)'}}>
            <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${t.fx ?? 50}% ${t.fy ?? 50}%`, transform: `scale(${z})`}} />
          </div>
        </>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 760, background: 'linear-gradient(rgba(11,11,11,0.55), rgba(11,11,11,0))'}} />
      <Words t={t} />
    </AbsoluteFill>
  );
};

const tags = (...x: string[]) => ['#seasignora', ...x];
export const TIPS: Tip[] = [
  {id: 'O-01v-akami', img: 'bo120.jpg', fit: 'full', lineTop: 400, line: 'If you order one thing from the raw bar tonight, make it this.', askTop: 680, ask: 'Akami',
    caption: 'If you order one thing from the raw bar tonight, make it the akami.', hashtags: tags('#akami', '#rawbar', '#brera')},
  {id: 'O-02v-tagliolini', img: 'bo104.jpg', fit: 'panel', lineTop: 400, line: 'Twirl it, don’t cut it. We won’t tell.', askTop: 1480, ask: 'Tagliolini',
    caption: 'Twirl it, don’t cut it. Ask for the tagliolini.', hashtags: tags('#tagliolini', '#pasta', '#brera')},
  {id: 'O-03v-red', img: 'bo347.jpg', fit: 'full', lineTop: 1170, line: 'Start with something red. The rest of the night follows.', askTop: 1450, ask: 'the red one',
    caption: 'Start with something red. Ask the bar for the red one.', hashtags: tags('#cocktails', '#bar', '#brera')},
  {id: 'O-04v-capesante', img: 'bo145.jpg', fit: 'panel', lineTop: 400, line: 'Save the last bite for the person you like most.', askTop: 1480, ask: 'Capesante',
    caption: 'Save the last bite for the person you like most. Ask for the capesante.', hashtags: tags('#capesante', '#sharing', '#brera')},
  {id: 'O-05v-caviar', img: 'bo476.jpg', fit: 'full', fy: 30, lineTop: 1250, line: 'Yes, caviar on dessert. Trust us on this one.', askTop: 1470, ask: 'Cream & caviar',
    caption: 'Yes, caviar on dessert. Trust us on this one.', hashtags: tags('#caviar', '#dessert', '#brera')},
  {id: 'O-06v-one-more', img: 'bo419.jpg', fit: 'panel', lineTop: 400, line: 'Someone always says “one more”. Usually it’s us.', askTop: 1480, ask: 'another round',
    caption: 'Someone always says “one more”. Usually it’s us.', hashtags: tags('#cheers', '#friends', '#brera')},
];
