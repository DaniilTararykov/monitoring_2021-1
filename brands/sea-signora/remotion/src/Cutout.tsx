import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// New presentation (client 16.11 night: «всё одно и то же — свежий взгляд, новая подача, другие блюда»). No frames,
// cards or objects any more: the dish itself, cut out of its photo, floating on a flat brand colour with one huge word
// that sits partly behind it. Dishes from the new-menu photos never used before (IMG_0723 / 0724 / 0732).

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory;
const ip = (f: number, a: number, b: number, c = 0, d = 1, e: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const spr = (f: number, at: number, damping = 14) => (f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping, stiffness: 90}}));
const mono = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: size,
  letterSpacing: 5, textTransform: 'uppercase', color, ...x});
const big = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: size, color, lineHeight: 0.86,
  textTransform: 'uppercase', whiteSpace: 'pre', ...x});
const shadow = 'drop-shadow(0 40px 50px rgba(0,0,0,0.35)) drop-shadow(0 8px 12px rgba(0,0,0,0.25))';

type Spec = {id: string; sec: number; bg: string; ink: string; word: string; wordSize: number; wordTop: number; img: string; w: number; left: number; top: number;
  rot: number; kicker: string; foot: string; cta?: boolean; vertical?: boolean};

const View: React.FC<{s: Spec}> = ({s}) => {
  const f = useCurrentFrame();
  const inn = spr(f, 10);
  const floatY = Math.sin(f / 22) * 8;
  const word = s.vertical ? (
    <div style={{position: 'absolute', left: 60, top: s.wordTop, ...big(s.wordSize, s.ink), writingMode: 'vertical-rl', transform: 'rotate(180deg)',
      clipPath: `inset(${100 - ip(f, 0, 26, 0, 100)}% 0 0 0)`}}>{s.word}</div>
  ) : (
    <div style={{position: 'absolute', left: 0, right: 0, top: s.wordTop, textAlign: 'center', ...big(s.wordSize, s.ink), letterSpacing: 2,
      clipPath: `inset(0 ${100 - ip(f, 0, 26, 0, 100)}% 0 0)`}}>{s.word}</div>
  );
  return (
    <AbsoluteFill style={{background: s.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', ...mono(20, s.ink), opacity: ip(f, 30, 44)}}>{s.kicker}</div>
      {word}
      <Img src={staticFile(`photos/w15/${s.img}`)} style={{position: 'absolute', left: s.left, top: s.top + floatY, width: s.w, filter: shadow,
        transform: `translateY(${(1 - inn) * 1300}px) rotate(${s.rot + (1 - inn) * 25}deg)`}} />
      <div style={{position: 'absolute', left: s.vertical ? 300 : 0, right: 0, top: s.vertical ? 300 : 1340, textAlign: s.vertical ? 'left' : 'center', ...mono(20, s.ink), opacity: ip(f, 40, 54)}}>{s.foot}</div>
      {s.cta && f >= 60 && <Chip cta={{label: 'see the menu', color: s.bg === O ? 'white' : 'orange', y: 380}} />}
    </AbsoluteFill>
  );
};

const tags = (...t: string[]) => ['#seasignora', ...t];
const SPECS: (Spec & {caption: string; hashtags: string[]; screen: string})[] = [
  {id: 'M-01v-akami', sec: 7, bg: O, ink: I, word: 'AKAMI', wordSize: 330, wordTop: 420, img: 'cut-akami.png', w: 960, left: 60, top: 640, rot: -6,
    kicker: 'new on the menu', foot: 'red tuna · sea, signora', cta: true,
    screen: 'new on the menu / AKAMI / red tuna · sea, signora', caption: 'New on the menu: akami, the lean cut of red tuna.', hashtags: tags('#akami', '#tuna', '#brera')},
  {id: 'M-02v-tagliolini', sec: 7, bg: G, ink: O, word: 'TAGLIOLINI', wordSize: 250, wordTop: 290, img: 'cut-tagliolini.png', w: 1180, left: 420, top: 600, rot: 200, vertical: true,
    kicker: '', foot: 'new on the menu · sea, signora',
    screen: 'TAGLIOLINI (vertical) / new on the menu · sea, signora', caption: 'Tagliolini, straight from the pan. New on the menu.', hashtags: tags('#tagliolini', '#pasta', '#brera')},
  {id: 'M-03v-new', sec: 7, bg: I, ink: G, word: 'NEW\nIN', wordSize: 380, wordTop: 380, img: 'cut-new.png', w: 720, left: 180, top: 990, rot: 8,
    kicker: 'sea, signora · the new menu', foot: '',
    screen: 'sea, signora · the new menu / NEW IN', caption: 'New in: just landed on our menu in Brera.', hashtags: tags('#newmenu', '#brera', '#milan')},
];
export const CUTOUT = SPECS.map((s) => ({...s, view: () => <View s={s} />}));
