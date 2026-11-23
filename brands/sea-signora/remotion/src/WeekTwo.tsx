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
        : <Img src={staticFile(`photos/w22/${s.src}.jpg`)} style={st} />}
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
// Week of 30.11 (client 23.11: 14 new stories, frames never used before, the best, steady and clean). Unused takes from the
// same folder, stabilised (vidstab); takes with clutter or shake were dropped. Same classic look, static type.
const SPECS: Spec[] = [
  {id: 'Y-01v-whole-truffle', sec: 3, src: 'T_3595', video: true, side: 'top', kicker: 'iii · the truffle', head: 'It arrives whole', sub: 'a white truffle, untouched',
    caption: 'The white truffle arrives whole and untouched.', hashtags: t('#whitetruffle', '#tartufobianco', '#brera')},
  {id: 'Y-02v-ready-for-truffle', sec: 4.5, src: 'T_3605', video: true, side: 'top', kicker: 'iii · the truffle', head: 'Only at\nthe last moment', sub: 'is it shaved over the plate',
    caption: 'Only at the last moment is it shaved over the plate, so none of its perfume is lost.', hashtags: t('#whitetruffle', '#tagliolini', '#milan')},
  {id: 'Y-03v-last-spoonful', sec: 4.5, src: 'T_3607', video: true, side: 'bottom', textTop: 1440, size: 88, kicker: 'iv · the pass', head: 'Precision', sub: 'the chef’s final touch',
    caption: 'Precision at the pass: the chef’s final touch before the plate leaves the kitchen.', hashtags: t('#tagliolini', '#openkitchen', '#brera')},
  {id: 'Y-04v-truffle-season', sec: 3, src: 'T_3622', video: true, side: 'top', kicker: 'iv · the pass', head: 'Served\nwithin a minute', sub: 'white truffle does not wait',
    caption: 'Served within a minute, because white truffle does not wait.', hashtags: t('#whitetruffle', '#tagliolini', '#brera')},
  {id: 'Y-05p-velvet', sec: 1, src: 'IMG_3631', side: 'top', size: 80, textTop: 270, kicker: 'vii · the ending', head: 'Until\nthe next evening', sub: 'the truffle season is short',
    caption: 'Until the next evening. The truffle season is short: book your table at Sea, Signora.', hashtags: t('#whitetruffle', '#pasta', '#milan')},
  {id: 'Y-06v-fired-up', sec: 4.5, src: 'T_3138', video: true, side: 'top', kicker: 'v · the fire', head: 'Forty-five days', sub: 'of ageing meet the open flame',
    caption: 'Scotch beef, dry-aged for forty-five days, meets the open flame. Bavarian style.', hashtags: t('#grill', '#openkitchen', '#brera')},
  {id: 'Y-07v-osetra', sec: 4.5, src: 'T_3146', video: true, side: 'top', size: 80, textTop: 250, kicker: 'v · the fire', head: 'The unexpected', sub: 'Osetra black caviar',
    caption: 'Then, the unexpected: Osetra black caviar, laid generously over the Tomahawk.', hashtags: t('#caviar', '#tomahawk', '#brera')},
  {id: 'Y-08v-ready-to-serve', sec: 4, src: 'T_3148', video: true, side: 'top', kicker: 'vi · to share', head: 'The Tomahawk', sub: 'with a pomegranate demi-glace',
    caption: 'The Tomahawk, finished with a pomegranate demi-glace and carried to the table.', hashtags: t('#tomahawk', '#caviar', '#milan')},
  {id: 'Y-09v-back-bar', sec: 4.5, src: 'T_3580', video: true, side: 'top', kicker: 'ii · the bar', head: 'First,\nthe bar', sub: 'an aperitivo, chosen with care',
    caption: 'First, the bar: an aperitivo, chosen with care from the back shelf.', hashtags: t('#bar', '#cocktails', '#brera')},
  {id: 'Y-10v-ice-cold', sec: 4.5, src: 'T_3588', video: true, side: 'top', kicker: 'ii · the bar', head: 'Strained twice', sub: 'for a texture like silk',
    caption: 'Strained twice, for a texture like silk. The first sip sets the tone.', hashtags: t('#cocktails', '#bar', '#milan')},
  {id: 'Y-11v-table-ready', sec: 4, src: 'T_3586', video: true, side: 'top', kicker: 'i · the table', head: 'We set it\nfor you', sub: 'green marble, crystal, a quiet corner',
    caption: 'Before anyone arrives, the table is set: green marble, crystal, a quiet corner. An evening at Sea, Signora begins here.', hashtags: t('#brera', '#dinner', '#milan')},
  {id: 'Y-12v-night-in-brera', sec: 4.5, src: 'T_3590', video: true, side: 'top', kicker: 'i · the table', head: 'Then Brera\narrives', sub: 'the room fills, the lights go low',
    caption: 'Then Brera arrives. The room fills, the lights go low, the evening finds its pace.', hashtags: t('#brera', '#milan', '#nightout')},
  {id: 'Y-13v-long-table', sec: 4.5, src: 'T_3636', video: true, side: 'top', kicker: 'vi · to share', head: 'Made\nto be shared', sub: 'at the longest table in the room',
    caption: 'Made to be shared, at the longest table in the room.', hashtags: t('#interiors', '#brera', '#friends')},
  {id: 'Y-14p-panettone', sec: 1, src: 'IMG_3225', side: 'top', kicker: 'vii · the ending', head: 'The sweetest\nending', sub: 'panettone, cream, an espresso',
    caption: 'And to close, slowly: panettone, cream and an espresso.', hashtags: t('#panettone', '#espresso', '#brera')},
];
export const WEEK_TWO = SPECS.map((s) => ({...s, view: () => <StoryView s={s} />}));
