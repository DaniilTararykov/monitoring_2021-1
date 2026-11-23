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
  'F2-01p-octopus': 'top', 'F2-02p-catch': 'top', 'F2-03p-regulars': 'bottom', 'F2-04p-finishing': 'top', 'F2-05p-everyone-shares': 'top',
  'F2-06p-pink': 'top', 'F2-07p-laughs': 'top', 'F2-08p-every-seat': 'top', 'F2-09p-cold-finish': 'top', 'F2-10p-pair': 'top',
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
// People (client 23.11: «людей возьми и дай 10 сторис»): guests of the candlelight evening, unused frames.
// More variants from the latest folders (client 23.11: «ещё варианты»). Earlier:
// New stories from the latest folders (client 23.11: the reference folder was only for the look; ideas and words are
// ours). Frames never used before; one line each in the brand's small centred type; dish names only from the menu.
const P = (n: string) => `w24/${n}`;
const SPECS: Spec[] = [
  {id: 'F2-01p-octopus', sec: 1, src: P('A__-133'), side: 'top', head: '', sub: 'grilled octopus with smoked eggplant and chipotle', caption: 'Grilled octopus with smoked eggplant and chipotle.', hashtags: t('#octopus', '#grill', '#brera')},
  {id: 'F2-02p-catch', sec: 1, src: P('B_Sea_Signora-41'), side: 'top', head: 'Pass the plate', sub: '', cta: 'book a table', ctaTop: 1680, caption: 'Pass the plate. At our table, everything is shared.', hashtags: t('#sharing', '#dinner', '#milan')},
  {id: 'F2-03p-regulars', sec: 1, src: P('A__-149'), side: 'top', head: 'Our longest-staying regulars', sub: '', caption: 'Our longest-staying regulars live in the aquarium.', hashtags: t('#aquarium', '#brera', '#milan')},
  {id: 'F2-04p-finishing', sec: 1, src: P('B_Sea_Signora-1'), side: 'top', head: 'Finishing touches', sub: '', caption: 'Finishing touches, right before it leaves the kitchen.', hashtags: t('#chef', '#openkitchen', '#brera')},
  {id: 'F2-05p-everyone-shares', sec: 1, src: P('B_Sea_Signora-93'), side: 'top', head: 'The first forkful is yours', sub: '', caption: 'The first forkful is always yours.', hashtags: t('#prawns', '#dinner', '#brera')},
  {id: 'F2-06p-pink', sec: 1, src: P('A__-413'), side: 'top', head: 'Pink, poured cold', sub: '', caption: 'Pink, poured cold, from our bar.', hashtags: t('#cocktails', '#bar', '#milan')},
  {id: 'F2-07p-laughs', sec: 1, src: P('A__-354'), side: 'top', head: 'The best seat is next to a friend', sub: '', caption: 'The best seat is always next to a friend.', hashtags: t('#friends', '#dinner', '#brera')},
  {id: 'F2-08p-every-seat', sec: 1, src: P('A__-258'), side: 'top', head: 'Every seat taken', sub: '', cta: 'reserve your table', ctaTop: 1680, caption: 'Every seat taken. Reserve yours ahead.', hashtags: t('#brera', '#milan', '#restaurant')},
  {id: 'F2-09p-cold-finish', sec: 1, src: P('A__-454'), side: 'top', head: 'Something cold to finish', sub: '', caption: 'Something cold to finish.', hashtags: t('#dessert', '#brera', '#milan')},
  {id: 'F2-10p-pair', sec: 1, src: P('B_Sea_Signora-35'), side: 'top', head: 'Two of a kind', sub: '', cta: 'book your evening', ctaTop: 1680, caption: 'Two of a kind, fresh from the market.', hashtags: t('#freshfish', '#seafood', '#brera')},
];
export const WEEK_FRESH2 = SPECS.map((s) => ({...s, view: () => <BrandView s={s} />}));
