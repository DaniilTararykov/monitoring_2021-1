import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Week of 23.11 (client 22.11: «маст — трюфель, мясо, панеттоне; возвращаемся к прежнему стилю: без плашек и анимаций,
// они не нравятся Антонио»). Classic look only: the footage full-bleed, a soft night gradient on the side of the frame that
// is empty, and the type standing still — no bands, no boxes, no motion on the text. Phone footage from the folder
// 1MZyh2Y…, stabilised (vidstab, two passes); the panettone from the still photos. English only.

const SA = brandPalette.sand454, I = colors.ivory;
type Spec = {id: string; sec: number; src: string; video?: boolean; at?: number; fy?: number; side: 'top' | 'bottom'; size?: number; textTop?: number; lines?: string[]; kicker?: string; head: string; sub: string;
  caption: string; hashtags: string[]};

const StoryView: React.FC<{s: Spec}> = ({s}) => {
  const top = s.side === 'top';
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${s.fy ?? 50}%`};
  return (
    <AbsoluteFill style={{background: colors.night}}>
      {s.video ? <OffthreadVideo src={staticFile(`videos/st/${s.src}.mp4`)} startFrom={Math.round((s.at ?? 0) * 30)} muted style={st} />
        : <Img src={staticFile(`photos/${s.src}.jpg`)} style={st} />}
      <div style={{position: 'absolute', left: 0, right: 0, [s.side]: 0, height: 820,
        background: `linear-gradient(${top ? 'to bottom' : 'to top'}, rgba(11,11,11,0.82) 0%, rgba(11,11,11,0.55) 45%, rgba(11,11,11,0) 100%)`}} />
      <div style={{position: 'absolute', left: 90, right: 90, top: s.textTop ?? (top ? 300 : 1330)}}>
        {s.kicker && <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 20, letterSpacing: 6, textTransform: 'uppercase', color: SA, marginBottom: 18}}>{s.kicker}</div>}
        <div style={{fontFamily: fonts.display, fontSize: s.size ?? 104, lineHeight: 0.95, color: I}}>{s.head.split("\n").map((l) => <div key={l}>{l}</div>)}</div>
        {s.sub && <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 50, lineHeight: 1.2, color: I, marginTop: 18}}>{s.sub}</div>}
        {s.lines && <div style={{marginTop: 30}}>{s.lines.map((l) => <div key={l} style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 28, letterSpacing: 4,
          textTransform: 'uppercase', color: I, lineHeight: 1.6}}>{l}</div>)}</div>}
      </div>
    </AbsoluteFill>
  );
};

const t = (...x: string[]) => ['#seasignora', ...x];
// Week after 30.11 (client 23.11: 20 stories from two new folders — the candlelight evening and the menu shoot). One
// evening told in pairs, fine-dining voice, no chapter marks, static type, photos only.
const P = (n: string) => `w24/${n}`;
const SPECS: Spec[] = [
  {id: 'Z-01p-after-dark', sec: 1, src: P('A__'), side: 'top', head: 'Via Fiori Chiari,\nafter dark', sub: 'the door is open',
    caption: 'Via Fiori Chiari, after dark. The door is open.', hashtags: t('#brera', '#milan', '#dinner')},
  {id: 'Z-02p-one-flame', sec: 1, src: P('A__-98'), side: 'top', head: 'One flame\nat a time', sub: 'the room is lit by hand',
    caption: 'One flame at a time: the room is lit by hand before the first guest.', hashtags: t('#candlelight', '#brera', '#milan')},
  {id: 'Z-03p-candlelight', sec: 1, src: P('A__-73'), side: 'top', head: 'Candlelight', sub: 'and a first glass of bubbles',
    caption: 'Candlelight, and a first glass of bubbles.', hashtags: t('#candlelight', '#bubbles', '#brera')},
  {id: 'Z-04p-poured', sec: 1, src: P('A__-87'), side: 'bottom', head: 'Poured for you', sub: 'a wine chosen for the evening',
    caption: 'Poured for you: a wine chosen for the evening.', hashtags: t('#wine', '#sommelier', '#brera')},
  {id: 'Z-05p-a-few-drops', sec: 1, src: P('B_Sea_Signora-163'), side: 'bottom', textTop: 1500, head: 'A few drops', sub: 'on a freshly opened oyster',
    caption: 'A few drops, nothing more, on a freshly opened oyster.', hashtags: t('#oysters', '#rawbar', '#brera')},
  {id: 'Z-06p-raw-bar', sec: 1, src: P('B_Sea_Signora-148'), side: 'top', head: 'From the raw bar', sub: 'oysters, langoustines, red prawns',
    caption: 'From the raw bar: oysters, langoustines and red prawns.', hashtags: t('#rawbar', '#seafood', '#milan')},
  {id: 'Z-07p-by-hand', sec: 1, src: P('B_Sea_Signora-57'), side: 'bottom', textTop: 1500, head: 'Three, cut by hand', sub: 'a trio of tartare, to begin',
    caption: 'Three, cut by hand: a trio of tartare to begin.', hashtags: t('#tartare', '#crudo', '#brera')},
  {id: 'Z-08p-thinly-sliced', sec: 1, src: P('B_Sea_Signora-8'), side: 'top', head: 'Thinly sliced', sub: 'under a garden of herbs',
    caption: 'Thinly sliced, under a garden of herbs.', hashtags: t('#carpaccio', '#crudo', '#milan')},
  {id: 'Z-09p-clings', sec: 1, src: P('B_Sea_Signora-20'), side: 'top', head: 'A sauce that clings', sub: 'shellfish, pasta, a little heat',
    caption: 'A sauce that clings: shellfish, pasta and a little heat.', hashtags: t('#pasta', '#seafood', '#brera')},
  {id: 'Z-10p-first-forkful', sec: 1, src: P('B_Sea_Signora-32'), side: 'top', head: 'The first forkful', sub: 'always the best one',
    caption: 'The first forkful is always the best one.', hashtags: t('#pasta', '#sharing', '#milan')},
  {id: 'Z-11p-last-second', sec: 1, src: P('A__-167'), side: 'bottom', head: 'At the last second', sub: 'the sauce, spooned at the pass',
    caption: 'At the last second, the sauce is spooned at the pass.', hashtags: t('#openkitchen', '#chef', '#brera')},
  {id: 'Z-12p-theatre', sec: 1, src: P('A__-389'), side: 'bottom', head: 'A little theatre', sub: 'flames in the middle of the room',
    caption: 'A little theatre: flames in the middle of the room.', hashtags: t('#flambe', '#brera', '#milan')},
  {id: 'Z-13p-made-for-sharing', sec: 1, src: P('B_Sea_Signora-84'), side: 'top', head: 'Made for sharing', sub: 'prawns on crisp leaves',
    caption: 'Made for sharing: prawns on crisp leaves.', hashtags: t('#prawns', '#sharing', '#brera')},
  {id: 'Z-14p-risotto', sec: 1, src: P('B_Sea_Signora-104'), side: 'top', head: 'Risotto, slowly', sub: 'stirred until it shines',
    caption: 'Risotto, slowly, stirred until it shines.', hashtags: t('#risotto', '#seafood', '#milan')},
  {id: 'Z-15p-little-box', sec: 1, src: P('B_Sea_Signora-119'), side: 'top', head: 'A little box', sub: 'golden bites and a tin of caviar',
    caption: 'A little box: golden bites and a tin of caviar.', hashtags: t('#caviar', '#brera', '#milan')},
  {id: 'Z-16p-caviar-sweet', sec: 1, src: P('A__-475'), side: 'top', head: 'Caviar,\nunexpectedly', sub: 'on something sweet',
    caption: 'Caviar, unexpectedly, on something sweet.', hashtags: t('#caviar', '#dessert', '#brera')},
  {id: 'Z-17p-the-company', sec: 1, src: P('A__-227'), side: 'top', head: 'The best part', sub: 'is always the company',
    caption: 'The best part of the evening is always the company.', hashtags: t('#friends', '#dinner', '#brera')},
  {id: 'Z-18p-cin-cin', sec: 1, src: P('A__-422'), side: 'bottom', head: 'Cin cin', sub: 'to the evening',
    caption: 'Cin cin, to the evening.', hashtags: t('#cheers', '#cocktails', '#milan')},
  {id: 'Z-19p-something-sweet', sec: 1, src: P('B_Sea_Signora-176'), side: 'top', textTop: 250, size: 88, head: 'A drizzle of gold', sub: 'over dark chocolate',
    caption: 'To end on: a drizzle of gold over dark chocolate.', hashtags: t('#dessert', '#brera', '#milan')},
  {id: 'Z-20p-by-candlelight', sec: 1, src: P('A__-158'), side: 'top', head: 'See you\nby candlelight', sub: 'via fiori chiari 32',
    caption: 'See you by candlelight at Via Fiori Chiari 32.', hashtags: t('#candlelight', '#brera', '#milan')},
];
export const WEEK_THREE = SPECS.map((s) => ({...s, view: () => <StoryView s={s} />}));
