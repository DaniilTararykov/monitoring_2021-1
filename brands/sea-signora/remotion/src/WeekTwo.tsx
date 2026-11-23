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
  {id: 'Y-01v-whole-truffle', sec: 3, src: 'T_3595', video: true, side: 'top', head: 'The whole truffle', sub: 'before a single shaving',
    caption: 'The whole white truffle, before a single shaving.', hashtags: t('#whitetruffle', '#tartufobianco', '#brera')},
  {id: 'Y-02v-ready-for-truffle', sec: 4.5, src: 'T_3605', video: true, side: 'top', head: 'Plated,\nthen shaved', sub: 'the truffle goes on last',
    caption: 'Plated, then shaved: the truffle always goes on last.', hashtags: t('#whitetruffle', '#tagliolini', '#milan')},
  {id: 'Y-03v-last-spoonful', sec: 4.5, src: 'T_3607', video: true, side: 'bottom', textTop: 1440, size: 88, head: 'Finished\nat the pass', sub: 'one last spoonful',
    caption: 'Finished at the pass with one last spoonful.', hashtags: t('#tagliolini', '#openkitchen', '#brera')},
  {id: 'Y-04v-truffle-season', sec: 3, src: 'T_3622', video: true, side: 'top', head: 'Truffle season', sub: 'while it lasts',
    caption: 'Truffle season at Sea, Signora, while it lasts.', hashtags: t('#whitetruffle', '#tagliolini', '#brera')},
  {id: 'Y-05p-velvet', sec: 1, src: 'IMG_3631', side: 'top', size: 80, textTop: 270, head: 'Tagliolini,\nwhite truffle', sub: 'one plate, all the season',
    caption: 'Tagliolini and white truffle: one plate, all the season.', hashtags: t('#whitetruffle', '#pasta', '#milan')},
  {id: 'Y-06v-fired-up', sec: 4.5, src: 'T_3138', video: true, side: 'top', head: 'Fired up', sub: 'the grill is ready',
    caption: 'Fired up: the grill is ready for the Tomahawk.', hashtags: t('#grill', '#openkitchen', '#brera')},
  {id: 'Y-07v-osetra', sec: 4.5, src: 'T_3146', video: true, side: 'top', head: 'Osetra, generously', sub: 'spread over the Tomahawk',
    caption: 'Osetra black caviar, spread generously over the Tomahawk.', hashtags: t('#caviar', '#tomahawk', '#brera')},
  {id: 'Y-08v-ready-to-serve', sec: 4, src: 'T_3148', video: true, side: 'top', head: 'Ready to serve', sub: 'Tomahawk, Osetra caviar',
    caption: 'Ready to serve: Tomahawk, Scotch beef dry-aged 45 days, with Osetra black caviar and pomegranate demi-glace.', hashtags: t('#tomahawk', '#caviar', '#milan')},
  {id: 'Y-09v-back-bar', sec: 4.5, src: 'T_3580', video: true, side: 'top', head: 'The back bar', sub: 'whisky, gin and good ideas',
    caption: 'The back bar: whisky, gin and good ideas.', hashtags: t('#bar', '#cocktails', '#brera')},
  {id: 'Y-10v-ice-cold', sec: 4.5, src: 'T_3588', video: true, side: 'top', head: 'Ice cold', sub: 'double-strained into the coupe',
    caption: 'Ice cold, double-strained into the coupe.', hashtags: t('#cocktails', '#bar', '#milan')},
  {id: 'Y-11v-table-ready', sec: 4, src: 'T_3586', video: true, side: 'top', head: 'Your table\nis ready', sub: 'green marble, glasses, a quiet corner',
    caption: 'Your table is ready: green marble, glasses and a quiet corner.', hashtags: t('#brera', '#dinner', '#milan')},
  {id: 'Y-12v-night-in-brera', sec: 4.5, src: 'T_3590', video: true, side: 'top', head: 'A night\nin Brera', sub: '',
    caption: 'A night in Brera at Sea, Signora.', hashtags: t('#brera', '#milan', '#nightout')},
  {id: 'Y-13v-long-table', sec: 4.5, src: 'T_3636', video: true, side: 'top', head: 'The long table', sub: 'under the chandeliers',
    caption: 'The long table, under the chandeliers.', hashtags: t('#interiors', '#brera', '#friends')},
  {id: 'Y-14p-panettone', sec: 1, src: 'IMG_3225', side: 'top', head: 'Panettone,\nto share', sub: 'with cream and an espresso',
    caption: 'Panettone to share, with cream and an espresso.', hashtags: t('#panettone', '#espresso', '#brera')},
];
export const WEEK_TWO = SPECS.map((s) => ({...s, view: () => <StoryView s={s} />}));
