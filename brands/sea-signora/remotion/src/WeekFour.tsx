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
type Spec = {id: string; sec: number; src: string; video?: boolean; at?: number; fy?: number; fx?: number; side: 'top' | 'bottom'; size?: number; textTop?: number; lines?: string[]; cta?: string; ctaTop?: number; kicker?: string; head: string; sub: string;
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
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${s.fx ?? 50}% ${s.fy ?? 50}%`};
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
      {s.cta && <LinkChip label={s.cta} top={s.ctaTop ?? 1500} />}
    </AbsoluteFill>
  );
};

const t = (...x: string[]) => ['#seasignora', ...x];
// 30 stories from all the folders (client 23.11: «30 креативов из всех материалов, разнообразие блюд, учитывай весь контекст»).
// One evening from the door to the last glass; dish names only from the menu on seasignorarest.com; hours once;
// three booking chips with different words; classic look, static type, no chapter marks.
const P = (n: string) => `w24/${n}`;
const SPECS: Spec[] = [
  {id: 'Q2-01p-the-door', sec: 1, src: P('A__-3'), fx: 62, side: 'bottom', head: 'We are open', sub: '',
    lines: ['mon–fri · 19:00–00:00', 'sat–sun · 12:30–15:30 | 19:00–00:00'],
    caption: 'We are open Monday to Friday 19:00–00:00, Saturday and Sunday 12:30–15:30 | 19:00–00:00. Via Fiori Chiari 32, Brera.', hashtags: t('#brera', '#milan', '#restaurant')},
  {id: 'Q2-02p-last-details', sec: 1, src: P('A__-89'), side: 'bottom', head: 'The last details', sub: 'before the doors open',
    caption: 'The last details, before the doors open.', hashtags: t('#brera', '#behindthescenes', '#milan')},
  {id: 'Q2-03p-the-candle', sec: 1, src: P('A__-24'), fx: 55, side: 'top', head: 'Lit for you', sub: 'one candle on every table',
    caption: 'Lit for you: one candle on every table.', hashtags: t('#candlelight', '#brera', '#dinner')},
  {id: 'Q2-04p-menu', sec: 1, src: P('A__-7'), fx: 45, side: 'top', head: 'Holy Shell', sub: 'a little piece of the sea, made to stay',
    caption: 'Holy Shell: a little piece of the sea, made to stay. Waiting at your place.', hashtags: t('#holyshell', '#brera', '#milan')},
  {id: 'Q2-05p-blue-room', sec: 1, src: P('A__-13'), fx: 40, side: 'top', head: 'The blue room', sub: 'tables by the aquarium',
    caption: 'The blue room: tables by the aquarium.', hashtags: t('#aquarium', '#interiors', '#brera')},
  {id: 'Q2-06p-neighbours', sec: 1, src: P('A__-148'), fx: 50, side: 'top', head: 'Candlelight\nand laughter', sub: 'at the long table',
    caption: 'Candlelight and laughter at the long table.', hashtags: t('#friends', '#brera', '#milan')},
  {id: 'Q2-07p-duet', sec: 1, src: P('A__-283'), fx: 50, side: 'top', head: 'In duet', sub: 'two shakers, one rhythm',
    caption: 'Behind the bar, in duet: two shakers, one rhythm.', hashtags: t('#bar', '#cocktails', '#brera')},
  {id: 'Q2-08p-garnish', sec: 1, src: P('A__-285'), side: 'top', head: 'Garnished\nby hand', sub: 'one twist at a time',
    caption: 'Garnished by hand, one twist at a time.', hashtags: t('#cocktails', '#mixology', '#milan')},
  {id: 'Q2-09p-something-red', sec: 1, src: P('A__-347'), side: 'top', head: 'Something red', sub: 'to open the evening',
    caption: 'Something red, to open the evening.', hashtags: t('#cocktails', '#aperitivo', '#brera')},
  {id: 'Q2-10p-knives', sec: 1, src: P('B_Sea_Signora-40'), side: 'bottom', head: 'The knives\nare ready', sub: 'so is the raw bar',
    caption: 'The knives are ready, and so is the raw bar.', hashtags: t('#rawbar', '#openkitchen', '#brera')},
  {id: 'Q2-11p-catch', sec: 1, src: P('B_Sea_Signora-36'), fx: 40, side: 'top', head: 'Today’s catch', sub: 'whole, fresh, on ice',
    caption: 'Today’s catch: whole, fresh, on ice.', hashtags: t('#seafood', '#freshfish', '#milan')},
  {id: 'Q2-12p-tuna-tartare', sec: 1, src: P('B_Sea_Signora-49'), side: 'top', head: 'Tuna tartare', sub: 'with Osetra caviar',
    cta: 'book a table', ctaTop: 1660,
    caption: 'Tuna tartare with Osetra caviar, from our appetizers.', hashtags: t('#tartare', '#caviar', '#brera')},
  {id: 'Q2-13p-greek', sec: 1, src: P('B_Sea_Signora-67'), side: 'top', head: 'Greek salad', sub: 'bright, simple, Mediterranean',
    caption: 'Greek salad: bright, simple, Mediterranean.', hashtags: t('#salad', '#mediterranean', '#milan')},
  {id: 'Q2-14p-fish-fillet', sec: 1, src: P('B_Sea_Signora-73'), fx: 50, side: 'top', head: 'Fish fillet', sub: 'in Mediterranean broth, parsley potatoes',
    caption: 'Fish fillet in Mediterranean broth with parsley potatoes.', hashtags: t('#fish', '#maincourse', '#brera')},
  {id: 'Q2-15p-at-the-pass', sec: 1, src: P('A__-132'), side: 'top', head: 'At the pass', sub: 'every plate, checked twice',
    caption: 'At the pass, every plate is checked twice.', hashtags: t('#openkitchen', '#chef', '#brera')},
  {id: 'Q2-16p-pan', sec: 1, src: P('A__-165'), side: 'top', head: 'In the pan', sub: 'cooked to order, in full view',
    caption: 'In the pan, cooked to order, in full view of the room.', hashtags: t('#openkitchen', '#chef', '#milan')},
  {id: 'Q2-17p-tweezers', sec: 1, src: P('A__-450'), side: 'top', head: 'With tweezers', sub: 'the smallest detail matters',
    caption: 'With tweezers: the smallest detail matters.', hashtags: t('#chef', '#finedining', '#brera')},
  {id: 'Q2-18p-taste', sec: 1, src: P('B_Sea_Signora-169'), side: 'bottom', head: 'Tasted first', sub: 'by the kitchen, always',
    caption: 'Tasted first by the kitchen, always.', hashtags: t('#chef', '#openkitchen', '#brera')},
  {id: 'Q2-19p-two', sec: 1, src: P('A__-205'), fx: 50, side: 'top', head: 'A table for two', sub: 'the evening is yours',
    caption: 'A table for two: the evening is yours.', hashtags: t('#datenight', '#brera', '#milan')},
  {id: 'Q2-20p-between', sec: 1, src: P('A__-363'), side: 'top', head: 'Between courses', sub: 'conversation, and the aquarium glow',
    caption: 'Between courses: conversation, and the aquarium glow.', hashtags: t('#dinner', '#aquarium', '#brera')},
  {id: 'Q2-21p-white', sec: 1, src: P('A__-403'), side: 'top', head: 'A glass of white', sub: 'chosen from our wine list',
    caption: 'A glass of white, chosen from our wine list.', hashtags: t('#wine', '#winelist', '#milan')},
  {id: 'Q2-22p-toast', sec: 1, src: P('A__-210'), fx: 55, side: 'top', head: 'To the table', sub: 'and to the people around it',
    cta: 'reserve your table', ctaTop: 1640,
    caption: 'To the table, and to the people around it.', hashtags: t('#cheers', '#friends', '#brera')},
  {id: 'Q2-23p-round', sec: 1, src: P('A__-459'), side: 'top', head: 'A round\nfor the table', sub: 'one for everyone',
    caption: 'A round for the table.', hashtags: t('#cocktails', '#friends', '#milan')},
  {id: 'Q2-24p-tiramisu', sec: 1, src: P('B_Sea_Signora-183'), side: 'top', head: 'Tiramisu', sub: 'with wild strawberries, served at the table',
    caption: 'Tiramisu with wild strawberries, served at the table.', hashtags: t('#tiramisu', '#dessert', '#brera')},
  {id: 'Q2-25p-tarte', sec: 1, src: P('B_Sea_Signora-186'), side: 'bottom', textTop: 1560, head: 'Peach Tarte Tatin', sub: 'with Bellini sorbet',
    caption: 'Peach Tarte Tatin with Bellini sorbet.', hashtags: t('#dessert', '#tartetatin', '#milan')},
  {id: 'Q2-26p-compliment', sec: 1, src: P('B_Sea_Signora-63'), side: 'top', head: 'The best compliment', sub: 'an empty plate',
    caption: 'The best compliment to the kitchen: an empty plate.', hashtags: t('#finedining', '#brera', '#milan')},
  {id: 'Q2-27p-every-table', sec: 1, src: P('A__-28'), fx: 50, side: 'top', head: 'Every table, lit', sub: 'late in Brera',
    caption: 'Every table lit, late in Brera.', hashtags: t('#candlelight', '#brera', '#nightout')},
  {id: 'Q2-28p-long-table', sec: 1, src: P('A__-72'), side: 'top', head: 'Set for a celebration', sub: 'tell us the occasion',
    caption: 'Set for a celebration: tell us the occasion, we prepare the table.', hashtags: t('#celebration', '#privatedining', '#brera')},
  {id: 'Q2-29p-glass', sec: 1, src: P('A__-231'), side: 'top', head: 'One more glass', sub: 'the aquarium keeps the light',
    caption: 'One more glass, while the aquarium keeps the light.', hashtags: t('#wine', '#aquarium', '#milan')},
  {id: 'Q2-30p-see-you', sec: 1, src: P('A__-95'), side: 'top', head: 'See you tonight', sub: 'via fiori chiari 32',
    cta: 'book your evening', ctaTop: 1660,
    caption: 'See you tonight at Via Fiori Chiari 32.', hashtags: t('#brera', '#milan', '#dinner')},
];
export const WEEK_FOUR = SPECS.map((s) => ({...s, view: () => <StoryView s={s} />}));
