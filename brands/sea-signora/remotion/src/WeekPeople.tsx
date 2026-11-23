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
  'G2-01p-guest': 'top', 'G2-02p-guest': 'top', 'G2-03p-guest': 'top', 'G2-04p-guest': 'top', 'G2-05p-guest': 'top',
  'G2-06p-guest': 'top', 'G2-07p-guest': 'top', 'G2-08p-guest': 'top', 'G2-09p-guest': 'top', 'G2-10p-guest': 'low',
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
// People (client 23.11: «людей возьми и дай 10 сторис»): guests of the candlelight evening, unused frames.
// More variants from the latest folders (client 23.11: «ещё варианты»). Earlier:
// New stories from the latest folders (client 23.11: the reference folder was only for the look; ideas and words are
// ours). Frames never used before; one line each in the brand's small centred type; dish names only from the menu.
const P = (n: string) => `w24/${n}`;
const SPECS: Spec[] = [
  {id: 'G2-01p-guest', sec: 1, src: P('A__-173'), side: 'top', head: 'Saved you the best seat', sub: '', caption: 'Saved you the best seat.', hashtags: t('#brera', '#dinner', '#milan')},
  {id: 'G2-02p-guest', sec: 1, src: P('A__-193'), side: 'top', head: 'The whole gang is here', sub: '', cta: 'book for your group', ctaTop: 1680, caption: 'The whole gang is here. Tell us how many, we set the table.', hashtags: t('#friends', '#groupdinner', '#brera')},
  {id: 'G2-03p-guest', sec: 1, src: P('A__-233'), side: 'top', head: 'To the next course', sub: '', caption: 'To the next course.', hashtags: t('#wine', '#brera', '#milan')},
  {id: 'G2-04p-guest', sec: 1, src: P('A__-300'), side: 'top', head: 'Service, with a smile', sub: '', caption: 'Service, with a smile.', hashtags: t('#hospitality', '#brera', '#milan')},
  {id: 'G2-05p-guest', sec: 1, src: P('A__-307'), side: 'top', head: 'A long table, a longer night', sub: '', caption: 'A long table, a longer night.', hashtags: t('#friends', '#dinner', '#brera')},
  {id: 'G2-06p-guest', sec: 1, src: P('A__-346'), side: 'top', head: 'This one is yours', sub: '', caption: 'This one is yours.', hashtags: t('#cocktails', '#bar', '#brera')},
  {id: 'G2-07p-guest', sec: 1, src: P('A__-365'), side: 'top', head: 'When the plate arrives', sub: '', cta: 'reserve your table', ctaTop: 1680, caption: 'When the plate arrives.', hashtags: t('#dinner', '#aquarium', '#brera')},
  {id: 'G2-08p-guest', sec: 1, src: P('A__-366'), side: 'top', head: 'Smiles are on the house', sub: '', caption: 'Smiles are on the house.', hashtags: t('#hospitality', '#brera', '#milan')},
  {id: 'G2-09p-guest', sec: 1, src: P('A__-368'), side: 'top', head: 'Just one more sip', sub: '', caption: 'Just one more sip.', hashtags: t('#cocktails', '#brera', '#milan')},
  {id: 'G2-10p-guest', sec: 1, src: P('A__-464'), side: 'top', head: 'Red suits everyone', sub: '', cta: 'book a table', ctaTop: 1470, caption: 'Red suits everyone.', hashtags: t('#cocktails', '#aperitivo', '#brera')},
];
export const WEEK_PEOPLE = SPECS.map((s) => ({...s, view: () => <BrandView s={s} />}));
