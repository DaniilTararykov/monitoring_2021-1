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
type Lay = 'low' | 'top' | 'bottom' | 'mid' | 'mark' | 'topLeft' | 'bottomRight' | 'hours' | 'list' | 'review' | 'chat';
const LAY: Record<string, Lay> = {
  'K-01p-one': 'top', 'K-02p-two': 'top', 'K-03p-three': 'top',
  'K-04p-fast-food': 'top', 'K-05p-our-way': 'top', 'K-06p-worth-it': 'low',
  'K-07p-make-room': 'low', 'K-08p-plateau': 'list', 'K-09p-share': 'low',
  'K-10p-a-few-drops': 'top', 'K-11p-lift': 'top', 'K-12p-down': 'low',
  'K-13p-forks': 'top', 'K-14p-menu-list': 'list',
  'K-15p-before': 'top', 'K-16p-after': 'top',
  'K-17p-review': 'review', 'K-18p-problem': 'chat',
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
  else if (lay === 'list') body = (<>{grad('top', 1000)}
    <div style={{position: 'absolute', left: 80, right: 80, top: 290, textAlign: 'center'}}>
      <div style={H}>{head}</div>
      <div style={{marginTop: 26}}>{(s.lines ?? []).map((l) => <div key={l} style={{...M, fontSize: 26, marginTop: 8}}>— {l}</div>)}</div>
    </div></>);
  else if (lay === 'review') body = (<>{grad('top', 1100)}
    <div style={{position: 'absolute', left: 90, right: 90, top: 290, textAlign: 'center'}}>
      <div style={{fontFamily: fonts.display, fontSize: 80, color: colors.ivory, lineHeight: 1}}>Sea, Signora</div>
      <div style={{...M, fontSize: 24, textTransform: 'none', marginTop: 6}}>review</div>
      <div style={{fontSize: 46, color: '#FCCE09', letterSpacing: 10, marginTop: 34}}>★★★★★</div>
      <div style={{...M, fontSize: 26, marginTop: 26, lineHeight: 1.5}}>{s.sub}</div>
    </div></>);
  else if (lay === 'chat') body = (<AbsoluteFill style={{background: '#9E9E6A'}}>
    <div style={{position: 'absolute', left: 90, right: 90, top: 300}}>
      <div style={{...M, fontSize: 24, color: '#1B2F1C'}}>your problem</div>
      <div style={{marginTop: 14, display: 'inline-block', background: colors.ivory, color: '#0B0B0B', borderRadius: 34, padding: '22px 30px', fontFamily: fonts.mono, fontSize: 30}}>{head}</div>
      <div style={{...M, fontSize: 24, color: '#1B2F1C', textAlign: 'right', marginTop: 40}}>our solution</div>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 14}}><div style={{background: '#1B2F1C', color: colors.ivory, borderRadius: 34, padding: '22px 30px', fontFamily: fonts.mono, fontSize: 30}}>{s.sub}</div></div>
    </div>
    <div style={{position: 'absolute', left: 140, right: 140, top: 820, height: 760, borderRadius: 40, overflow: 'hidden'}}><Img src={staticFile(`photos/${s.src}.jpg`)} style={st} /></div>
  </AbsoluteFill>);
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
// New concepts in the client's own story language (reference folder 1tqdFn…): numbered series, a three-frame sequence,
// a list over the table, a verbatim review, «your problem / our solution». Photos from the menu shoot not used before.
const P = (n: string) => `w24/${n}`;
const SPECS: Spec[] = [
  {id: 'K-03p-three', sec: 1, src: P('B_Sea_Signora-50'), side: 'top', head: 'Three tartares, one plate', sub: 'fish and shellfish, from the raw bar', caption: 'Three tartares, one plate: our fish and shellfish tartare from the raw bar.', hashtags: t('#tartare', '#rawbar', '#milan')},
  {id: 'K-04p-fast-food', sec: 1, src: P('B_Sea_Signora-124'), side: 'top', head: 'Fast food,', sub: '', caption: 'Fast food,', hashtags: t('#caviar', '#brera', '#milan')},
  {id: 'K-05p-our-way', sec: 1, src: P('B_Sea_Signora-133'), side: 'top', head: 'Sea, Signora way', sub: 'nugget · caviar · sour cream', cta: 'book a table', ctaTop: 1660, caption: 'the Sea, Signora way: nugget, caviar and sour cream. No regrets.', hashtags: t('#caviar', '#nuggets', '#brera')},
  {id: 'K-07p-make-room', sec: 1, src: P('B_Sea_Signora-143'), side: 'top', head: 'Make some room', sub: 'on the table', caption: 'Make some room on the table.', hashtags: t('#rawbar', '#plateau', '#brera')},
  {id: 'K-08p-plateau', sec: 1, src: P('B_Sea_Signora-150'), side: 'top', head: 'The plateau', sub: '', lines: ['oysters', 'langoustines', 'red prawns from mazara', 'scallops'], caption: 'The plateau: oysters, langoustines, red prawns from Mazara and scallops.', hashtags: t('#plateau', '#seafood', '#brera')},
  {id: 'K-09p-share', sec: 1, src: P('B_Sea_Signora-162'), side: 'bottom', head: 'Now share', sub: '', caption: 'Now share.', hashtags: t('#sharing', '#rawbar', '#milan')},
  {id: 'K-10p-a-few-drops', sec: 1, src: P('B_Sea_Signora-160'), side: 'top', head: 'A few drops', sub: '', caption: 'A few drops,', hashtags: t('#oysters', '#rawbar', '#brera')},
  {id: 'K-11p-lift', sec: 1, src: P('B_Sea_Signora-161'), side: 'top', head: 'A little more', sub: '', caption: 'a little more,', hashtags: t('#oysters', '#rawbar', '#brera')},
  {id: 'K-12p-down', sec: 1, src: P('B_Sea_Signora-165'), side: 'bottom', head: 'And down it goes', sub: 'oysters of the day', caption: 'and down it goes. Oysters of the day, opened on the spot.', hashtags: t('#oysters', '#seafood', '#milan')},
  {id: 'K-13p-forks', sec: 1, src: P('B_Sea_Signora-42'), side: 'top', head: 'Everyone gets a fork', sub: '', caption: 'Everyone gets a fork.', hashtags: t('#sharing', '#pasta', '#brera')},
  {id: 'K-14p-menu-list', sec: 1, src: P('B_Sea_Signora-46'), side: 'top', head: 'On the table tonight', sub: '', lines: ['cicatelli with king crab & shellfish sauce', 'wagyu carpaccio, vacche rosse parmesan', 'tartare from the raw bar'], caption: 'On the table tonight: cicatelli with King Crab and shellfish sauce, Wagyu carpaccio, tartare from the raw bar.', hashtags: t('#menu', '#brera', '#milan')},
  {id: 'K-15p-before', sec: 1, src: P('B_Sea_Signora-58'), side: 'top', head: 'Before', sub: '', caption: 'Before,', hashtags: t('#tartare', '#brera', '#milan')},
  {id: 'K-16p-after', sec: 1, src: P('B_Sea_Signora-62'), side: 'top', head: 'After', sub: '', cta: 'reserve your table', ctaTop: 1640, caption: 'and after.', hashtags: t('#tartare', '#brera', '#milan')},
  {id: 'K-17p-review', sec: 1, src: P('A__-231'), side: 'top', head: '', sub: 'Exceptional restaurant with top quality seafood. Professional knowledgeable service within a beautifully designed atmosphere. Highly recommend, we will be back. Thank you.', caption: 'Thank you for the kind words. See you again soon.', hashtags: t('#review', '#brera', '#milan')},
  {id: 'K-18p-problem', sec: 1, src: P('B_Sea_Signora-155'), side: 'top', head: 'I can’t decide what to order', sub: 'the plateau. everyone’s happy', cta: 'book your evening', ctaTop: 1640, caption: 'Can’t decide what to order? The plateau. Everyone’s happy.', hashtags: t('#plateau', '#rawbar', '#brera')},
];
export const WEEK_FIVE = SPECS.map((s) => ({...s, view: () => <BrandView s={s} />}));
