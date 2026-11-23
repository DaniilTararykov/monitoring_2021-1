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


// Brand layout (BRAND.md «Б»: centred, Skanaus caps ≈72 px + mono caps line, upper third by default, lower third as the
// alternative, hours in two blocks, the wordmark now and then, soft night gradient only). The position changes from
// story to story so the feed does not repeat itself (client 23.11: «меняй расположение текста»).
type Lay = 'low' | 'top' | 'bottom' | 'mid' | 'mark' | 'topLeft' | 'bottomRight' | 'hours';
const LAY: Record<string, Lay> = {
  'Q2-01p-the-door': 'hours', 'Q2-02p-last-details': 'bottom', 'Q2-03p-the-candle': 'mark', 'Q2-04p-menu': 'topLeft',
  'Q2-05p-blue-room': 'top', 'Q2-06p-neighbours': 'top', 'Q2-07p-duet': 'top', 'Q2-08p-garnish': 'bottomRight',
  'Q2-09p-something-red': 'top', 'Q2-10p-knives': 'bottom', 'Q2-11p-catch': 'topLeft', 'Q2-12p-tuna-tartare': 'bottom',
  'Q2-13p-greek': 'bottom', 'Q2-14p-fish-fillet': 'top', 'Q2-15p-at-the-pass': 'bottomRight', 'Q2-16p-pan': 'top',
  'Q2-17p-tweezers': 'low', 'Q2-18p-taste': 'topLeft', 'Q2-19p-two': 'top', 'Q2-20p-between': 'bottom',
  'Q2-21p-white': 'top', 'Q2-22p-toast': 'top', 'Q2-23p-round': 'top', 'Q2-24p-tiramisu': 'top',
  'Q2-25p-tarte': 'low', 'Q2-26p-compliment': 'top', 'Q2-27p-every-table': 'mark', 'Q2-28p-long-table': 'bottom',
  'Q2-29p-glass': 'topLeft', 'Q2-30p-see-you': 'mark',
};
const H: React.CSSProperties = {fontFamily: fonts.display, fontSize: 60, lineHeight: 1.05, letterSpacing: 1, textTransform: 'uppercase', color: colors.ivory, textWrap: 'balance'} as React.CSSProperties;
const M: React.CSSProperties = {fontFamily: fonts.mono, fontWeight: 500, fontSize: 30, lineHeight: 1.35, letterSpacing: 1, textTransform: 'uppercase', color: colors.ivory, textWrap: 'balance'} as React.CSSProperties;
const BrandView: React.FC<{s: Spec}> = ({s}) => {
  const lay = LAY[s.id] ?? 'top';
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${s.fx ?? 50}% ${s.fy ?? 50}%`};
  const grad = (side: 'top' | 'bottom', h = 780) => <div style={{position: 'absolute', left: 0, right: 0, [side]: 0, height: h,
    background: `linear-gradient(${side === 'top' ? 'to bottom' : 'to top'}, rgba(11,11,11,0.8) 0%, rgba(11,11,11,0.5) 45%, rgba(11,11,11,0) 100%)`}} />;
  const head = s.head.replace(/\n/g, ' ').replace(/’/g, "'");
  const block = (align: 'center' | 'left' | 'right') => (
    <div style={{textAlign: align}}>
      {head && <div style={H}>{head}</div>}
      {s.sub && <div style={{...M, marginTop: head ? 16 : 0}}>{s.sub}</div>}
    </div>
  );
  let body: React.ReactNode;
  if (lay === 'hours') body = (<>{grad('top', 900)}
    <div style={{position: 'absolute', left: 80, right: 80, top: 290}}>
      <div style={{...H, fontSize: 66, textAlign: 'center'}}>We are open</div>
      <div style={{...M, fontSize: 34, textTransform: 'none', marginTop: 34}}>Monday-Friday<br />19:00-00:00</div>
      <div style={{...M, fontSize: 34, textTransform: 'none', marginTop: 40, textAlign: 'right'}}>Saturday-Sunday<br />12:30-15:30<br />19:00-00:00</div>
    </div></>);
  else if (lay === 'mark') body = (<>{grad('top', 820)}
    <div style={{position: 'absolute', left: 80, right: 80, top: 300, textAlign: 'center'}}>
      <div style={{fontFamily: fonts.display, fontSize: 104, lineHeight: 1, color: colors.ivory}}>Sea, Signora</div>
      {s.sub && <div style={{...M, marginTop: 22}}>{s.sub}</div>}
    </div></>);
  else if (lay === 'mid') body = (<><AbsoluteFill style={{background: 'rgba(11,11,11,0.28)'}} />
    <div style={{position: 'absolute', left: 80, right: 80, top: 840}}>{block('center')}</div></>);
  else if (lay === 'top') body = (<>{grad('top')}<div style={{position: 'absolute', left: 80, right: 80, top: 300}}>{block('center')}</div></>);
  else if (lay === 'topLeft') body = (<>{grad('top')}<div style={{position: 'absolute', left: 80, right: 200, top: 300}}>{block('left')}</div></>);
  else if (lay === 'bottomRight') body = (<>{grad('bottom', 820)}<div style={{position: 'absolute', left: 200, right: 80, bottom: 380}}>{block('right')}</div></>);
  else if (lay === 'low') body = (<>{grad('bottom', 700)}<div style={{position: 'absolute', left: 80, right: 80, bottom: 250}}>{block('center')}</div></>);
  else body = (<>{grad('bottom', 820)}<div style={{position: 'absolute', left: 80, right: 80, bottom: 380}}>{block('center')}</div></>);
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <Img src={staticFile(`photos/${s.src}.jpg`)} style={st} />
      {body}
      {s.cta && <LinkChip label={s.cta} top={lay === 'bottom' || lay === 'bottomRight' ? 1250 : 1540} />}
    </AbsoluteFill>
  );
};

const t = (...x: string[]) => ['#seasignora', ...x];
// 30 stories from all the folders (client 23.11: «30 креативов из всех материалов, разнообразие блюд, учитывай весь контекст»).
// One evening from the door to the last glass; dish names only from the menu on seasignorarest.com; hours once;
// three booking chips with different words; classic look, static type, no chapter marks.
const P = (n: string) => `w24/${n}`;
const SPECS: Spec[] = [
  {id: 'Q2-01p-the-door', sec: 1, src: P('A__-28'), fx: 50, side: 'bottom', head: 'We are open', sub: '',
    lines: ['mon–fri · 19:00–00:00', 'sat–sun · 12:30–15:30 | 19:00–00:00'],
    caption: 'We are open Monday to Friday 19:00–00:00, Saturday and Sunday 12:30–15:30 | 19:00–00:00. Via Fiori Chiari 32, Brera.', hashtags: t('#brera', '#milan', '#restaurant')},
  {id: 'Q2-02p-last-details', sec: 1, src: P('A__-89'), side: 'bottom', head: 'Getting ready for you', sub: '',
    caption: 'The last details, before the doors open.', hashtags: t('#brera', '#behindthescenes', '#milan')},
  {id: 'Q2-03p-the-candle', sec: 1, src: P('A__-24'), fx: 55, side: 'top', head: '', sub: 'lit for the evening',
    caption: 'Lit for you: one candle on every table.', hashtags: t('#candlelight', '#brera', '#dinner')},
  {id: 'Q2-04p-menu', sec: 1, src: P('A__-7'), fx: 45, side: 'top', head: 'Details matter', sub: '',
    caption: 'Holy Shell: a little piece of the sea, made to stay. Waiting at your place.', hashtags: t('#holyshell', '#brera', '#milan')},
  {id: 'Q2-05p-blue-room', sec: 1, src: P('A__-13'), fx: 40, side: 'top', head: 'Blue hour at Sea, Signora', sub: '',
    caption: 'The blue room: tables by the aquarium.', hashtags: t('#aquarium', '#interiors', '#brera')},
  {id: 'Q2-06p-neighbours', sec: 1, src: P('A__-148'), fx: 50, side: 'top', head: 'The good kind of noise', sub: '',
    caption: 'Candlelight and laughter at the long table.', hashtags: t('#friends', '#brera', '#milan')},
  {id: 'Q2-07p-duet', sec: 1, src: P('A__-283'), fx: 50, side: 'top', head: 'Two shakers, one rhythm', sub: '',
    caption: 'Behind the bar, in duet: two shakers, one rhythm.', hashtags: t('#bar', '#cocktails', '#brera')},
  {id: 'Q2-08p-garnish', sec: 1, src: P('A__-285'), side: 'top', head: 'Details, details', sub: '',
    caption: 'Garnished by hand, one twist at a time.', hashtags: t('#cocktails', '#mixology', '#milan')},
  {id: 'Q2-09p-something-red', sec: 1, src: P('A__-347'), side: 'top', head: 'Start with something red', sub: '',
    caption: 'Something red, to open the evening.', hashtags: t('#cocktails', '#aperitivo', '#brera')},
  {id: 'Q2-10p-knives', sec: 1, src: P('B_Sea_Signora-40'), side: 'bottom', head: 'The knives are ready', sub: '',
    caption: 'The knives are ready, and so is the raw bar.', hashtags: t('#rawbar', '#openkitchen', '#brera')},
  {id: 'Q2-11p-catch', sec: 1, src: P('B_Sea_Signora-36'), fx: 40, side: 'top', head: 'Look who just arrived', sub: '',
    caption: 'Today’s catch: whole, fresh, on ice.', hashtags: t('#seafood', '#freshfish', '#milan')},
  {id: 'Q2-12p-tuna-tartare', sec: 1, src: P('B_Sea_Signora-49'), side: 'top', head: '', sub: 'tuna tartare with osetra caviar',
    cta: 'book a table', ctaTop: 1660,
    caption: 'Tuna tartare with Osetra caviar, from our appetizers.', hashtags: t('#tartare', '#caviar', '#brera')},
  {id: 'Q2-13p-greek', sec: 1, src: P('B_Sea_Signora-67'), side: 'top', head: '', sub: 'greek salad',
    caption: 'Greek salad: bright, simple, Mediterranean.', hashtags: t('#salad', '#mediterranean', '#milan')},
  {id: 'Q2-14p-fish-fillet', sec: 1, src: P('B_Sea_Signora-73'), fx: 50, side: 'top', head: '', sub: 'fish fillet in mediterranean broth with parsley potatoes',
    caption: 'Fish fillet in Mediterranean broth with parsley potatoes.', hashtags: t('#fish', '#maincourse', '#brera')},
  {id: 'Q2-15p-at-the-pass', sec: 1, src: P('A__-132'), side: 'top', head: 'Every plate, checked twice', sub: '',
    caption: 'At the pass, every plate is checked twice.', hashtags: t('#openkitchen', '#chef', '#brera')},
  {id: 'Q2-16p-pan', sec: 1, src: P('A__-165'), side: 'top', head: 'Cooked in front of you', sub: '',
    caption: 'In the pan, cooked to order, in full view of the room.', hashtags: t('#openkitchen', '#chef', '#milan')},
  {id: 'Q2-17p-tweezers', sec: 1, src: P('A__-450'), side: 'top', head: 'The smallest detail', sub: '',
    caption: 'With tweezers: the smallest detail matters.', hashtags: t('#chef', '#finedining', '#brera')},
  {id: 'Q2-18p-taste', sec: 1, src: P('B_Sea_Signora-169'), side: 'bottom', head: 'Taste test: passed', sub: '',
    caption: 'Tasted first by the kitchen, always.', hashtags: t('#chef', '#openkitchen', '#brera')},
  {id: 'Q2-19p-two', sec: 1, src: P('A__-205'), fx: 50, side: 'top', head: 'Your table for two', sub: '',
    caption: 'A table for two: the evening is yours.', hashtags: t('#datenight', '#brera', '#milan')},
  {id: 'Q2-20p-between', sec: 1, src: P('A__-363'), side: 'top', head: 'Between courses', sub: '',
    caption: 'Between courses: conversation, and the aquarium glow.', hashtags: t('#dinner', '#aquarium', '#brera')},
  {id: 'Q2-21p-white', sec: 1, src: P('A__-403'), side: 'top', head: 'A glass of white? Why not', sub: '',
    caption: 'A glass of white, chosen from our wine list.', hashtags: t('#wine', '#winelist', '#milan')},
  {id: 'Q2-22p-toast', sec: 1, src: P('A__-210'), fx: 55, side: 'top', head: 'Cheers to us', sub: '',
    cta: 'reserve your table', ctaTop: 1640,
    caption: 'To the table, and to the people around it.', hashtags: t('#cheers', '#friends', '#brera')},
  {id: 'Q2-23p-round', sec: 1, src: P('A__-459'), side: 'top', head: 'One round for the table', sub: '',
    caption: 'A round for the table.', hashtags: t('#cocktails', '#friends', '#milan')},
  {id: 'Q2-24p-tiramisu', sec: 1, src: P('B_Sea_Signora-183'), side: 'top', head: '', sub: 'tiramisu with wild strawberries',
    caption: 'Tiramisu with wild strawberries, served at the table.', hashtags: t('#tiramisu', '#dessert', '#brera')},
  {id: 'Q2-25p-tarte', sec: 1, src: P('B_Sea_Signora-186'), side: 'bottom', textTop: 1560, head: '', sub: 'peach tarte tatin with bellini sorbet',
    caption: 'Peach Tarte Tatin with Bellini sorbet.', hashtags: t('#dessert', '#tartetatin', '#milan')},
  {id: 'Q2-26p-compliment', sec: 1, src: P('B_Sea_Signora-63'), side: 'top', head: 'Clean plate club', sub: '',
    caption: 'The best compliment to the kitchen: an empty plate.', hashtags: t('#finedining', '#brera', '#milan')},
  {id: 'Q2-27p-every-table', sec: 1, src: P('A__-3'), fx: 62, side: 'top', head: '', sub: 'late in brera',
    caption: 'Every table lit, late in Brera.', hashtags: t('#candlelight', '#brera', '#nightout')},
  {id: 'Q2-28p-long-table', sec: 1, src: P('A__-72'), side: 'top', head: 'Tell us the occasion', sub: '',
    caption: 'Set for a celebration: tell us the occasion, we prepare the table.', hashtags: t('#celebration', '#privatedining', '#brera')},
  {id: 'Q2-29p-glass', sec: 1, src: P('A__-231'), side: 'top', head: 'One more glass?', sub: '',
    caption: 'One more glass, while the aquarium keeps the light.', hashtags: t('#wine', '#aquarium', '#milan')},
  {id: 'Q2-30p-see-you', sec: 1, src: P('A__-95'), side: 'top', head: '', sub: 'see you tonight · via fiori chiari, 32',
    cta: 'book your evening', ctaTop: 1660,
    caption: 'See you tonight at Via Fiori Chiari 32.', hashtags: t('#brera', '#milan', '#dinner')},
];
export const WEEK_FOUR = SPECS.map((s) => ({...s, view: () => <BrandView s={s} />}));
