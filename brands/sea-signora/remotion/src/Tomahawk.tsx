import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// New dish «Tomahawk» (client, 26.10): four stills, each a device not used in earlier packs —
// polaroid snapshot, a 45-day calendar, an annotated anatomy of the plate, a magnifier loupe.
// Read in order: the team tasted it first → 45 days of patience → what's on the plate → look closer.
// Facts only from the client's menu line: Scotch beef, dry-aged 45 days, Bavarian style,
// Osetra Black Caviar, Pomegranate Demi-Glace.

const DISH = 'photos/tomahawk/dish.jpg'; // 960×1280
const BRIEF = 'photos/tomahawk/briefing.jpg';

const mono = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: fonts.mono, fontWeight: 500, fontSize: size, letterSpacing: 4, textTransform: 'uppercase', color: colors.ivory, ...extra,
});
const display = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: fonts.display, fontSize: size, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.05, color: colors.ivory, ...extra,
});
const Cover: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) => (
  <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style}} />
);
const Shade: React.FC<{from: 'top' | 'bottom'; h: number; o: number}> = ({from, h, o}) => (
  <div style={{position: 'absolute', left: 0, right: 0, [from]: 0, height: h,
    background: `linear-gradient(to ${from === 'top' ? 'bottom' : 'top'}, rgba(11,11,11,${o}) 0%, rgba(11,11,11,${o * 0.6}) 50%, rgba(11,11,11,0) 100%)`}} />
);

// 1 · polaroid: the chef's briefing, as a snapshot pinned on a dark wall
export const TomahawkTeam: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    <Cover src={BRIEF} style={{filter: 'blur(28px) brightness(0.35)', transform: 'scale(1.15)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center'}}>
      <div style={mono(24, {color: colors.orange})}>new on the menu</div>
      <div style={display(60, {marginTop: 18})}>The team tasted it first</div>
    </div>
    <div style={{position: 'absolute', left: 180, top: 490, width: 720, padding: '28px 28px 100px', background: colors.ivory,
      transform: 'rotate(-3deg)', boxShadow: '0 30px 60px rgba(0,0,0,0.55)'}}>
      <div style={{width: 664, height: 820, overflow: 'hidden', position: 'relative'}}>
        <Img src={staticFile(BRIEF)} style={{position: 'absolute', width: 664, height: 1180, top: -290, left: 0}} />
      </div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 400, textAlign: 'center'}}>
      <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 38, color: colors.ivory}}>the chef's briefing before the first tomahawk</div>
    </div>
  </AbsoluteFill>
);

// 2 · a calendar of 45 days, 44 crossed out, the last one is the day it goes on the grill
export const TomahawkDays: React.FC = () => {
  const cell = 76, gap = 14, cols = 9;
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <Cover src={DISH} style={{top: 760, height: 1160, objectPosition: '50% 70%', filter: 'brightness(0.8)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 700, height: 420, background: `linear-gradient(to bottom, ${colors.night} 0%, rgba(11,11,11,0.7) 45%, rgba(11,11,11,0) 100%)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 285, textAlign: 'center'}}>
        <div style={mono(24, {color: colors.orange})}>dry-aged</div>
      </div>
      <div style={{position: 'absolute', left: (1080 - (cols * cell + (cols - 1) * gap)) / 2, top: 350, width: cols * cell + (cols - 1) * gap,
        display: 'flex', flexWrap: 'wrap', gap}}>
        {Array.from({length: 45}, (_, i) => {
          const last = i === 44;
          return (
            <div key={i} style={{width: cell, height: cell, position: 'relative', boxSizing: 'border-box',
              border: last ? 'none' : '1.5px solid rgba(248,246,245,0.45)', background: last ? colors.orange : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {last ? <span style={mono(26, {letterSpacing: 0})}>45</span> : (
                <>
                  <span style={{position: 'absolute', left: 6, top: 4, ...mono(13, {letterSpacing: 0, opacity: 0.55})}}>{i + 1}</span>
                  <svg width={cell} height={cell} style={{position: 'absolute', inset: 0}}>
                    <line x1={14} y1={cell - 14} x2={cell - 14} y2={14} stroke="rgba(248,246,245,0.7)" strokeWidth={1.5} />
                  </svg>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 870, textAlign: 'center'}}>
        <div style={display(62)}>45 days of patience</div>
        <div style={mono(22, {marginTop: 16, opacity: 0.92})}>scotch beef · bavarian style</div>
      </div>
    </AbsoluteFill>
  );
};

// 3 · anatomy: the plate annotated like a diagram
// p: point on the plate (display px); label: top-left of the text; a: where the leader line meets the label
const callouts: {n: string; p: [number, number]; label: [number, number]; a: [number, number]; text: string[]}[] = [
  {n: '02', p: [840, 1090], label: [640, 640], a: [660, 772], text: ['osetra', 'black caviar']},
  {n: '01', p: [600, 975], label: [80, 640], a: [300, 772], text: ['scotch beef', 'dry-aged 45 days']},
  {n: '04', p: [230, 930], label: [80, 1130], a: [100, 1122], text: ['the bone', 'bavarian style']},
  {n: '03', p: [820, 1410], label: [640, 1520], a: [660, 1512], text: ['pomegranate', 'demi-glace']},
];
export const TomahawkAnatomy: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    <Cover src={DISH} style={{filter: 'brightness(0.9)'}} />
    <Shade from="top" h={620} o={0.8} />
    <Shade from="bottom" h={520} o={0.7} />
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {callouts.map((c) => {
        const [px, py] = c.p;
        const [lx, ly] = c.a;
        return (
          <g key={c.n}>
            <polyline points={`${px},${py} ${lx},${ly}`} fill="none" stroke={colors.ivory} strokeWidth={1.6} opacity={0.85} />
            <circle cx={px} cy={py} r={7} fill={colors.ivory} />
            <circle cx={px} cy={py} r={16} fill="none" stroke={colors.ivory} strokeWidth={1.4} opacity={0.7} />
          </g>
        );
      })}
    </svg>
    {callouts.map((c) => (
      <div key={c.n} style={{position: 'absolute', left: c.label[0], top: c.label[1], textShadow: '0 1px 12px rgba(0,0,0,0.8)'}}>
        <div style={mono(26, {color: colors.orange, letterSpacing: 2})}>{c.n}</div>
        {c.text.map((t) => <div key={t} style={mono(24, {letterSpacing: 3, marginTop: 6})}>{t}</div>)}
      </div>
    ))}
    <div style={{position: 'absolute', left: 0, right: 0, top: 285, textAlign: 'center'}}>
      <div style={display(64)}>Tomahawk</div>
      <div style={mono(22, {marginTop: 14, opacity: 0.9})}>anatomy of the new signature</div>
    </div>
  </AbsoluteFill>
);

// 4 · loupe: the caviar under a magnifier
export const TomahawkLoupe: React.FC = () => {
  const d = 660, z = 3.2, cx = 540, cy = 1000;
  const fx = 690, fy = 735; // caviar in dish.jpg
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <Cover src={DISH} style={{filter: 'brightness(0.4) blur(2px)'}} />
      <div style={{position: 'absolute', left: cx - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: '50%', overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)', border: `3px solid ${colors.ivory}`}}>
        <Img src={staticFile(DISH)} style={{position: 'absolute', width: 960 * z, height: 1280 * z, left: d / 2 - fx * z, top: d / 2 - fy * z, maxWidth: 'none'}} />
      </div>
      <div style={{position: 'absolute', left: cx + d * 0.33, top: cy + d * 0.33, width: 190, height: 26, borderRadius: 13, background: colors.ivory,
        transformOrigin: '0 50%', transform: 'rotate(45deg)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center'}}>
        <div style={mono(24, {color: colors.orange})}>look closer</div>
        <div style={display(62, {marginTop: 18})}>Osetra black caviar</div>
        <div style={mono(22, {marginTop: 16, opacity: 0.92})}>on 45-day scotch beef</div>
      </div>
      <Chip cta={{label: 'book a table', color: 'orange'}} />
    </AbsoluteFill>
  );
};

export const TOMAHAWK = [
  {id: 'TMH-1-team-tasted-it-first', component: TomahawkTeam},
  {id: 'TMH-2-45-days', component: TomahawkDays},
  {id: 'TMH-3-anatomy', component: TomahawkAnatomy},
  {id: 'TMH-4-look-closer', component: TomahawkLoupe},
];
