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
type Spec = {id: string; sec: number; src: string; video?: boolean; at?: number; fy?: number; side: 'top' | 'bottom'; size?: number; textTop?: number; lines?: string[]; cta?: string; ctaTop?: number; kicker?: string; head: string; sub: string;
  caption: string; hashtags: string[]};


// Instagram-style link chip (BRAND.md: orange chip, link icon, lowercase). Client 23.11: «не вижу ссылок-плашек».
const LinkChip: React.FC<{label: string; top: number}> = ({label, top}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16, background: brandPalette.orange158, borderRadius: 22, padding: '20px 34px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.35)'}}>
      <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke={colors.ivory} strokeWidth={2.4} strokeLinecap="round">
        <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>
      <span style={{fontFamily: fonts.mono, fontWeight: 600, fontSize: 36, color: colors.ivory, letterSpacing: 1}}>{label}</span>
    </div>
  </div>
);

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
      {s.cta && <LinkChip label={s.cta} top={s.ctaTop ?? 1500} />}
    </AbsoluteFill>
  );
};

const t = (...x: string[]) => ['#seasignora', ...x];
// Week of 30.11 (client 23.11: 14 new stories, frames never used before, the best, steady and clean). Unused takes from the
// same folder, stabilised (vidstab); takes with clutter or shake were dropped. Same classic look, static type.
const SPECS: Spec[] = [
  {id: 'Y-01v-whole-truffle', sec: 3, src: 'T_3595', video: true, side: 'top', head: 'A rare guest', sub: 'white truffle, whole on the linen',
    caption: 'A rare guest this season: white truffle, whole on the linen.', hashtags: t('#whitetruffle', '#tartufobianco', '#brera')},
  {id: 'Y-02v-ready-for-truffle', sec: 4.5, src: 'T_3605', video: true, side: 'top', head: 'Shaved over\nwarm tagliolini', sub: 'never a moment too soon',
    caption: 'Shaved over warm tagliolini, never a moment too soon.', hashtags: t('#whitetruffle', '#tagliolini', '#milan')},
  {id: 'Y-03v-last-spoonful', sec: 4.5, src: 'T_3607', video: true, side: 'bottom', textTop: 1440, size: 88, head: 'A last detail', sub: 'from the hands of our chef',
    caption: 'A last detail, from the hands of our chef.', hashtags: t('#tagliolini', '#openkitchen', '#brera')},
  {id: 'Y-04v-truffle-season', sec: 3, src: 'T_3622', video: true, side: 'top', head: 'The dish\nof the season', sub: 'tagliolini and white truffle',
    caption: 'The dish of the season: tagliolini and white truffle.', hashtags: t('#whitetruffle', '#tagliolini', '#brera')},
  {id: 'Y-05p-velvet', sec: 1, src: 'IMG_3631', side: 'top', size: 80, textTop: 270, head: 'See you\nat the table', sub: 'the white truffle season is short',
    caption: 'See you at the table. The white truffle season is short.', hashtags: t('#whitetruffle', '#pasta', '#milan')},
  {id: 'Y-06v-fired-up', sec: 4.5, src: 'T_3138', video: true, side: 'top', head: 'Aged 45 days', sub: 'Scotch beef meets the open flame',
    caption: 'Scotch beef, aged 45 days, meets the open flame. Bavarian style.', hashtags: t('#grill', '#openkitchen', '#brera')},
  {id: 'Y-07v-osetra', sec: 4.5, src: 'T_3146', video: true, side: 'top', size: 80, textTop: 250, head: 'Osetra caviar', sub: 'laid over the Tomahawk',
    caption: 'Osetra black caviar, laid over the Tomahawk.', hashtags: t('#caviar', '#tomahawk', '#brera')},
  {id: 'Y-08v-ready-to-serve', sec: 4, src: 'T_3148', video: true, side: 'top', head: 'Carried\nto the table', sub: 'Tomahawk, pomegranate demi-glace',
    caption: 'Carried to the table: Tomahawk, Osetra caviar, pomegranate demi-glace.', hashtags: t('#tomahawk', '#caviar', '#milan')},
  {id: 'Y-09v-back-bar', sec: 4.5, src: 'T_3580', video: true, side: 'top', head: 'Aperitivo', sub: 'a quiet ritual at the back bar',
    caption: 'Aperitivo: a quiet ritual at the back bar.', hashtags: t('#bar', '#cocktails', '#brera')},
  {id: 'Y-10v-ice-cold', sec: 4.5, src: 'T_3588', video: true, side: 'top', head: 'Cold, clear,\nprecise', sub: 'the first sip of the evening',
    caption: 'Cold, clear, precise: the first sip of the evening.', hashtags: t('#cocktails', '#bar', '#milan')},
  {id: 'Y-11v-table-ready', sec: 4, src: 'T_3586', video: true, side: 'top', head: 'Before\nthe first guest', sub: 'linen, marble, a single glass',
    caption: 'Before the first guest: linen, green marble, a single glass waiting.', hashtags: t('#brera', '#dinner', '#milan')},
  {id: 'Y-12v-night-in-brera', sec: 4.5, src: 'T_3590', video: true, side: 'top', head: 'Brera,\nafter dark', sub: 'every table finds its own rhythm',
    caption: 'Brera, after dark. Every table finds its own rhythm.', hashtags: t('#brera', '#milan', '#nightout')},
  {id: 'Y-13v-long-table', sec: 4.5, src: 'T_3636', video: true, side: 'top', head: 'Shared, slowly', sub: 'the long table under the chandeliers',
    caption: 'Shared, slowly, at the long table under the chandeliers.', hashtags: t('#interiors', '#brera', '#friends')},
  {id: 'Y-14p-panettone', sec: 1, src: 'IMG_3225', side: 'top', head: 'Something sweet', sub: 'panettone, cream and espresso',
    caption: 'Something sweet to close: panettone, cream and espresso.', hashtags: t('#panettone', '#espresso', '#brera')},
];
export const WEEK_TWO = SPECS.map((s) => ({...s, view: () => <StoryView s={s} />}));
