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
  'N2-01p-four-hands': 'top', 'N2-02p-leaf': 'topLeft', 'N2-03p-carpaccio': 'top', 'N2-04p-hot-pan': 'bottomRight',
  'N2-05p-seconds': 'top', 'N2-06p-twirl': 'top', 'N2-07p-paper-thin': 'top', 'N2-08p-oysters-twice': 'mark',
  'N2-09p-weekend': 'top', 'N2-10p-measured': 'low', 'N2-11p-ice': 'top', 'N2-12p-first-sip': 'topLeft',
  'N2-13p-slow-pour': 'bottom', 'N2-14p-warm-cold': 'top', 'N2-15p-mid-conversation': 'top', 'N2-16p-funny': 'top',
  'N2-17p-two-glasses': 'top', 'N2-18p-long-night': 'mark',
};
const H: React.CSSProperties = {fontFamily: fonts.display, fontSize: 60, lineHeight: 1.05, letterSpacing: 1, textTransform: 'uppercase', color: colors.ivory};
const M: React.CSSProperties = {fontFamily: fonts.mono, fontWeight: 500, fontSize: 30, lineHeight: 1.35, letterSpacing: 1, textTransform: 'uppercase', color: colors.ivory};
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
// New stories from the latest folders (client 23.11: the reference folder was only for the look; ideas and words are
// ours). Frames never used before; one line each in the brand's small centred type; dish names only from the menu.
const P = (n: string) => `w24/${n}`;
const SPECS: Spec[] = [
  {id: 'N2-01p-four-hands', sec: 1, src: P('A__-455'), side: 'top', head: 'Four hands at the pass', sub: '', caption: 'Four hands at the pass, one plate at a time.', hashtags: t('#openkitchen', '#chef', '#brera')},
  {id: 'N2-02p-leaf', sec: 1, src: P('B_Sea_Signora-4'), side: 'top', head: 'Leaf by leaf', sub: '', caption: 'Leaf by leaf.', hashtags: t('#chef', '#finedining', '#brera')},
  {id: 'N2-03p-carpaccio', sec: 1, src: P('B_Sea_Signora-12'), side: 'top', head: '', sub: 'wagyu carpaccio, vacche rosse parmesan and mixed greens', caption: 'Wagyu carpaccio, Vacche Rosse Parmesan and mixed greens.', hashtags: t('#carpaccio', '#wagyu', '#milan')},
  {id: 'N2-04p-hot-pan', sec: 1, src: P('B_Sea_Signora-15'), side: 'top', head: 'The pan is hot', sub: '', caption: 'The pan is hot. Dinner is close.', hashtags: t('#openkitchen', '#pasta', '#brera')},
  {id: 'N2-05p-seconds', sec: 1, src: P('B_Sea_Signora-16'), side: 'top', head: 'Plated in seconds', sub: '', caption: 'Plated in seconds, eaten slowly.', hashtags: t('#pasta', '#chef', '#milan')},
  {id: 'N2-06p-twirl', sec: 1, src: P('A__-102'), side: 'top', head: 'Twirl, don’t cut', sub: '', caption: 'Twirl, don’t cut.', hashtags: t('#pasta', '#brera', '#milan')},
  {id: 'N2-08p-oysters-twice', sec: 1, src: P('B_Sea_Signora-116'), side: 'top', head: '', sub: 'risotto with aglio, olio, peperoncino, oysters and lime', caption: 'Oysters, twice: risotto with aglio, olio, peperoncino, oysters and lime.', hashtags: t('#risotto', '#oysters', '#milan')},
  {id: 'N2-09p-weekend', sec: 1, src: P('B_Sea_Signora-79'), side: 'top', head: 'Weekends from 12:30', sub: 'saturday & sunday · 12:30–15:30', cta: 'book for the weekend', ctaTop: 1660, caption: 'On weekends we open from 12:30. Saturday and Sunday, 12:30–15:30 and 19:00–00:00.', hashtags: t('#weekend', '#brera', '#milan')},
  {id: 'N2-10p-measured', sec: 1, src: P('A__-292'), side: 'top', head: 'Measured, never rushed', sub: '', caption: 'Measured, never rushed.', hashtags: t('#bar', '#cocktails', '#brera')},
  {id: 'N2-11p-ice', sec: 1, src: P('A__-293'), side: 'top', head: 'Ice first', sub: '', caption: 'Ice first. Everything else after.', hashtags: t('#cocktails', '#bar', '#milan')},
  {id: 'N2-12p-first-sip', sec: 1, src: P('A__-414'), side: 'top', head: 'The first sip', sub: '', caption: 'The first sip.', hashtags: t('#cocktails', '#aperitivo', '#brera')},
  {id: 'N2-13p-slow-pour', sec: 1, src: P('A__-426'), side: 'top', head: 'A slow pour', sub: '', caption: 'A slow pour, for a long evening.', hashtags: t('#wine', '#sommelier', '#brera')},
  {id: 'N2-14p-warm-cold', sec: 1, src: P('A__-436'), side: 'top', head: 'Warm light, cold glass', sub: '', caption: 'Warm light, cold glass.', hashtags: t('#wine', '#candlelight', '#milan')},
  {id: 'N2-15p-mid-conversation', sec: 1, src: P('A__-303'), side: 'top', head: 'Mid-conversation', sub: '', caption: 'Mid-conversation, between two plates.', hashtags: t('#dinner', '#friends', '#brera')},
  {id: 'N2-16p-funny', sec: 1, src: P('A__-364'), side: 'top', head: 'Someone said something funny', sub: '', caption: 'Someone said something funny.', hashtags: t('#friends', '#aquarium', '#brera')},
  {id: 'N2-17p-two-glasses', sec: 1, src: P('A__-401'), side: 'top', head: 'Two glasses, one evening', sub: '', cta: 'reserve for two', ctaTop: 1660, caption: 'Two glasses, one evening.', hashtags: t('#datenight', '#brera', '#milan')},
  {id: 'N2-18p-long-night', sec: 1, src: P('A__-70'), side: 'top', head: '', sub: 'lit for a long night', cta: 'book a table', ctaTop: 1660, caption: 'Lit for a long night. See you at Via Fiori Chiari 32.', hashtags: t('#candlelight', '#brera', '#milan')},
];
export const WEEK_SIX = SPECS.map((s) => ({...s, view: () => <BrandView s={s} />}));
