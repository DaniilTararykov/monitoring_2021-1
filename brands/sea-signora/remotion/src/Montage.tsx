import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Something new from folder 1MZyh2Y… without panettone or steak (client 23.11): short montage stories — three or four
// takes cut straight together (no transitions, no zooms), one static line in the brand look. Phone takes stabilised
// (vidstab) and cut to their steadiest 1.3–2 s windows.
const FPS = 30;
type Cut = {n: string; at: number; len: number};
type M = {id: string; cuts: Cut[]; head?: string; sub?: string; side: 'top' | 'bottom'; cta?: string; caption: string; hashtags: string[]};
const H: React.CSSProperties = {fontFamily: fonts.display, fontSize: 60, lineHeight: 1.05, letterSpacing: 1, textTransform: 'uppercase', color: colors.ivory, textWrap: 'balance'} as React.CSSProperties;
const Mo: React.CSSProperties = {fontFamily: fonts.mono, fontWeight: 500, fontSize: 30, letterSpacing: 1, textTransform: 'uppercase', color: colors.ivory, textWrap: 'balance'} as React.CSSProperties;
const View: React.FC<{m: M}> = ({m}) => {
  let t = 0;
  return (
    <AbsoluteFill style={{background: colors.night}}>
      {m.cuts.map((c, i) => { const from = Math.round(t * FPS); t += c.len; return (
        <Sequence key={i} from={from} durationInFrames={Math.round(t * FPS) - from}>
          <OffthreadVideo src={staticFile(`videos/st/U_${c.n}.mp4`)} startFrom={Math.round(c.at * FPS)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </Sequence>); })}
      <div style={{position: 'absolute', left: 0, right: 0, [m.side]: 0, height: 760,
        background: `linear-gradient(${m.side === 'top' ? 'to bottom' : 'to top'}, rgba(11,11,11,0.8), rgba(11,11,11,0.45) 45%, rgba(11,11,11,0))`}} />
      <div style={{position: 'absolute', left: 80, right: 80, textAlign: 'center', ...(m.side === 'top' ? {top: 300} : {bottom: 380})}}>
        {m.head && <div style={H}>{m.head}</div>}
        {m.sub && <div style={{...Mo, marginTop: m.head ? 16 : 0}}>{m.sub}</div>}
      </div>
      {m.cta && <div style={{position: 'absolute', left: 0, right: 0, top: 1640, display: 'flex', justifyContent: 'center'}}>
        <div style={{background: brandPalette.orange158, borderRadius: 22, padding: '20px 34px', fontFamily: fonts.mono, fontWeight: 600, fontSize: 36, color: colors.ivory}}>🔗 {m.cta}</div></div>}
    </AbsoluteFill>
  );
};
const t = (...x: string[]) => ['#seasignora', ...x];
const SPECS: M[] = [
  {id: 'M3-01v-cut-stir-shave', side: 'top', head: 'Cut. Stir. Shave.', sub: 'tagliolini & white truffle',
    cuts: [{n: '3604', at: 2.0, len: 1.8}, {n: '3602', at: 1.2, len: 1.6}, {n: '3623', at: 0.9, len: 2.0}],
    caption: 'Cut. Stir. Shave. Tagliolini and white truffle, in three moves.', hashtags: t('#whitetruffle', '#tagliolini', '#brera')},
  {id: 'M3-02v-every-mood', side: 'top', head: 'One plate, every mood', sub: '',
    cuts: [{n: '3617', at: 0, len: 1.3}, {n: '3620', at: 0, len: 1.3}, {n: '3623', at: 3.0, len: 1.3}, {n: '3609', at: 0, len: 1.5}],
    caption: 'One plate, every mood: tagliolini and white truffle, while the season lasts.', hashtags: t('#whitetruffle', '#pasta', '#milan')},
  {id: 'M3-03v-meanwhile', side: 'top', head: 'Meanwhile, in the room', sub: '',
    cuts: [{n: '3579', at: 0, len: 1.4}, {n: '3583', at: 0, len: 1.2}, {n: '3634', at: 4.6, len: 1.4}],
    cta: 'book a table',
    caption: 'Meanwhile, in the room: bubbles on tap, chandeliers, the aquarium.', hashtags: t('#brera', '#interiors', '#aquarium')},
];
export const MONTAGE = SPECS.map((m) => ({id: m.id, sec: m.cuts.reduce((s, c) => s + c.len, 0), caption: m.caption, hashtags: m.hashtags, view: () => <View m={m} />}));
