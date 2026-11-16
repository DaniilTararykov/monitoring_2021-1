import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// New presentation (client 16.11 night: «всё одно и то же — свежий взгляд, новая подача, другие блюда»; «учитывай весь
// наш диалог»). No frames, cards or objects: the dish itself, cut out of its photo, on a flat brand colour with one huge
// word. Dishes that never had their own story: the new menu she named (akami, tagliolini, capesante, polpo — polpo once
// only), the nuggets she allowed, and two drinks from the bar shoot. English only, no team, no weekdays, no hours.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory;
const ip = (f: number, a: number, b: number, c = 0, d = 1, e: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const spr = (f: number, at: number) => (f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping: 14, stiffness: 90}}));
const mono = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: size,
  letterSpacing: 5, textTransform: 'uppercase', color, ...x});
const big = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: size, color, lineHeight: 0.86,
  textTransform: 'uppercase', whiteSpace: 'pre', ...x});
const shadow = 'drop-shadow(0 40px 50px rgba(0,0,0,0.35)) drop-shadow(0 8px 12px rgba(0,0,0,0.25))';

type Mode = 'behind' | 'vertical' | 'pattern' | 'front' | 'split';
type Spec = {id: string; sec: number; bg: string; bg2?: string; ink: string; mode: Mode; word: string; wordSize: number; wordTop: number; img: string; w: number;
  left: number; top: number; rot: number; kicker: string; foot: string; footTop?: number; footInk?: string; cta?: boolean; from?: 'bottom' | 'left' | 'right' | 'top'};

const Dish: React.FC<{s: Spec}> = ({s}) => {
  const f = useCurrentFrame();
  const inn = spr(f, 10);
  const d = s.from ?? 'bottom';
  const dx = d === 'left' ? -1300 : d === 'right' ? 1300 : 0, dy = d === 'bottom' ? 1300 : d === 'top' ? -1300 : 0;
  return <Img src={staticFile(`photos/w15/${s.img}`)} style={{position: 'absolute', left: s.left, top: s.top + Math.sin(f / 22) * 8, width: s.w, filter: shadow,
    transform: `translate(${(1 - inn) * dx}px, ${(1 - inn) * dy}px) rotate(${s.rot + (1 - inn) * 25}deg)`}} />;
};

const View: React.FC<{s: Spec}> = ({s}) => {
  const f = useCurrentFrame();
  const wipe = ip(f, 0, 26, 0, 100);
  let word: React.ReactNode;
  if (s.mode === 'vertical') {
    word = <div style={{position: 'absolute', left: 60, top: s.wordTop, ...big(s.wordSize, s.ink), writingMode: 'vertical-rl', transform: 'rotate(180deg)',
      clipPath: `inset(${100 - wipe}% 0 0 0)`}}>{s.word}</div>;
  } else if (s.mode === 'pattern') {
    word = (
      <div style={{position: 'absolute', left: 0, right: 0, top: s.wordTop}}>
        {Array.from({length: 6}, (_, i) => (
          <div key={i} style={{textAlign: 'center', ...big(s.wordSize, i === 0 ? s.ink : 'transparent', {WebkitTextStroke: i === 0 ? '0px' : `2px ${s.ink}`, lineHeight: 0.92}),
            transform: `translateX(${(i % 2 ? 1 : -1) * (40 - ip(f, 0, 60, 0, 40))}px)`, opacity: ip(f, i * 3, 12 + i * 3)}}>{s.word}</div>
        ))}
      </div>
    );
  } else {
    word = <div style={{position: 'absolute', left: 0, right: 0, top: s.wordTop, textAlign: 'center', ...big(s.wordSize, s.ink), letterSpacing: 2,
      clipPath: `inset(0 ${100 - wipe}% 0 0)`}}>{s.word}</div>;
  }
  return (
    <AbsoluteFill style={{background: s.bg, overflow: 'hidden'}}>
      {s.mode === 'split' && <div style={{position: 'absolute', left: 0, right: 0, top: 960, bottom: 0, background: s.bg2, transform: `scaleY(${ip(f, 0, 24)})`, transformOrigin: '50% 100%'}} />}
      {s.kicker && <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', ...mono(20, s.ink), opacity: ip(f, 30, 44)}}>{s.kicker}</div>}
      {s.mode !== 'front' && word}
      <Dish s={s} />
      {s.mode === 'front' && word}
      {s.foot && <div style={{position: 'absolute', left: s.mode === 'vertical' ? 300 : 0, right: 0, top: s.footTop ?? 1340, textAlign: s.mode === 'vertical' ? 'left' : 'center',
        ...mono(20, s.footInk ?? s.ink), opacity: ip(f, 40, 54)}}>{s.foot}</div>}
      {s.cta && f >= 60 && <Chip cta={{label: 'see the menu', color: s.bg === O ? 'white' : 'orange', y: 380}} />}
    </AbsoluteFill>
  );
};

// the close: every dish of the set floating on one page
const All: React.FC = () => {
  const f = useCurrentFrame();
  const items: [string, number, number, number, number][] = [['cut-akami.png', 40, 490, 500, -8], ['cut-tagliolini.png', 580, 520, 440, 12], ['cut-capesante.png', 90, 870, 420, 6],
    ['cut-polpo.png', 540, 880, 480, -5], ['cut-nuggets.png', 90, 1200, 400, 4], ['cut-green.png', 600, 1210, 170, 0], ['cut-blue.png', 800, 1220, 160, 0]];
  return (
    <AbsoluteFill style={{background: SA}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 285, textAlign: 'center', ...mono(20, G)}}>sea, signora · the new menu</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 325, textAlign: 'center', ...big(110, G)}}>ALL OF IT</div>
      {items.map(([img, x, y, w, r], i) => {
        const s = spr(f, 8 + i * 6);
        return <Img key={img} src={staticFile(`photos/w15/${img}`)} style={{position: 'absolute', left: x, top: y + Math.sin((f + i * 20) / 22) * 6, width: w, filter: shadow,
          transform: `scale(${s}) rotate(${r}deg)`}} />;
      })}
      {f >= 70 && <Chip cta={{label: 'book a table', color: 'orange', y: 360}} />}
    </AbsoluteFill>
  );
};

const tags = (...t: string[]) => ['#seasignora', ...t];
type Full = Spec & {caption: string; hashtags: string[]; screen: string};
const SPECS: Full[] = [
  {id: 'M-01v-akami', sec: 7, bg: O, ink: I, mode: 'behind', word: 'AKAMI', wordSize: 330, wordTop: 420, img: 'cut-akami.png', w: 960, left: 60, top: 640, rot: -6,
    kicker: 'new on the menu', foot: 'red tuna · sea, signora', cta: true,
    screen: 'new on the menu / AKAMI / red tuna · sea, signora', caption: 'New on the menu: akami, the lean cut of red tuna.', hashtags: tags('#akami', '#tuna', '#brera')},
  {id: 'M-02v-tagliolini', sec: 7, bg: G, ink: O, mode: 'vertical', word: 'TAGLIOLINI', wordSize: 250, wordTop: 290, img: 'cut-tagliolini.png', w: 1180, left: 420, top: 600, rot: 200,
    kicker: '', foot: 'new on the menu · sea, signora', footTop: 300, from: 'right',
    screen: 'TAGLIOLINI (vertical) / new on the menu · sea, signora', caption: 'Tagliolini, straight from the pan. New on the menu.', hashtags: tags('#tagliolini', '#pasta', '#brera')},
  {id: 'M-03v-capesante', sec: 7, bg: I, ink: G, mode: 'behind', word: 'CAPE\nSANTE', wordSize: 330, wordTop: 380, img: 'cut-capesante.png', w: 720, left: 180, top: 990, rot: 8,
    kicker: 'sea, signora · the new menu', foot: '', from: 'top',
    screen: 'sea, signora · the new menu / CAPESANTE', caption: 'Capesante, new on our menu.', hashtags: tags('#capesante', '#scallops', '#brera')},
  {id: 'M-04v-polpo', sec: 7, bg: SA, ink: G, mode: 'pattern', word: 'POLPO', wordSize: 190, wordTop: 300, img: 'cut-polpo.png', w: 980, left: 50, top: 760, rot: -4,
    kicker: '', foot: 'new on the menu · sea, signora', footTop: 1470, from: 'left',
    screen: 'POLPO ×6 (top filled, rest outline) / new on the menu · sea, signora', caption: 'Polpo, new on the menu.', hashtags: tags('#polpo', '#octopus', '#brera')},
  {id: 'M-05v-nuggets', sec: 7, bg: G, ink: I, mode: 'front', word: 'NUGGETS', wordSize: 230, wordTop: 1180, img: 'cut-nuggets.png', w: 900, left: 90, top: 420, rot: -10,
    kicker: '', foot: 'crispy · golden · for the table', footTop: 1400, footInk: SA, from: 'top',
    screen: 'NUGGETS / crispy · golden · for the table', caption: 'Nuggets: crispy, golden, made for the table.', hashtags: tags('#nuggets', '#crispy', '#brera')},
  {id: 'M-06v-green', sec: 6, bg: I, bg2: G, ink: G, mode: 'split', word: 'GREEN', wordSize: 300, wordTop: 380, img: 'cut-green.png', w: 560, left: 260, top: 640, rot: 0,
    kicker: 'the bar · sea, signora', foot: 'shaken to order', footTop: 1430, footInk: I,
    screen: 'the bar · sea, signora / GREEN / shaken to order', caption: 'Green, cold and shaken to order at our bar.', hashtags: tags('#cocktails', '#bar', '#brera')},
  {id: 'M-07v-ice', sec: 6, bg: O, ink: G, mode: 'behind', word: 'ICE', wordSize: 420, wordTop: 420, img: 'cut-blue.png', w: 600, left: 240, top: 700, rot: 0, from: 'top',
    kicker: 'the bar · sea, signora', foot: 'served on the rocks', footTop: 1430,
    screen: 'the bar · sea, signora / ICE / served on the rocks', caption: 'Ice first: served on the rocks at the bar.', hashtags: tags('#cocktails', '#bar', '#brera')},
];
export const CUTOUT = [
  ...SPECS.map((s) => ({...s, view: () => <View s={s} />})),
  {id: 'M-08v-all-of-it', sec: 7, view: All, screen: 'sea, signora · the new menu / ALL OF IT', caption: 'Akami, tagliolini, capesante, polpo, nuggets and a drink. All of it, one table.',
    hashtags: tags('#newmenu', '#brera', '#milan')},
];
