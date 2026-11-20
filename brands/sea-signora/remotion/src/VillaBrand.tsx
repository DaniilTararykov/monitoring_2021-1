import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Villa Prato rebuilt in the Sea, Signora identity (client 20.11: «пресно и скучно, нет креатива и айдентики Си Синьоры,
// пересобери ролики — и кадры, и монтаж»). Same language as the birthday reels the client approved:
//   A «Pagina» — an editorial page on brand colour (green 5605 / sand 454 / orange 158): the shot in a framed box, a
//                mono running header and footer, diptychs (the two chefs side by side: four hands), a triptych that builds
//                on the beat at the bar, a porthole, a contact sheet of plates built on the beat, full-bleed hits.
//   B «Tagli»  — full-bleed cuts on the beat with hard punch-ins, one-word Skanaus cards for the headline, split screens,
//                and at the end the footage inside a giant «4» (quattro mani).
// Headline «Cena a Quattro Mani» (client's choice). Every change happens on a beat; type never animates; a take is
// shown once per reel and the two reels use different takes.

const FPS = 30;
const BEAT = 60 / 122;                      // brera-house
const bf = (k: number) => Math.round(k * BEAT * FPS);
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory;
type V = {c: string; at: number; fx?: number; fy?: number};
type Seg =
  | {k: 'full'; n: number; v: V; punch?: boolean}
  | {k: 'frame' | 'wide' | 'port'; n: number; v: V; bg: string}
  | {k: 'duo'; n: number; vs: [V, V]; bg: string; dir: 'v' | 'h'}
  | {k: 'tri' | 'sheet'; n: number; vs: V[]; bg: string}
  | {k: 'word'; n: number; text: string; bg: string; ink?: string}
  | {k: 'end'; n: number; v: V; bg: string};
const v = (c: string, at: number, fx?: number, fy?: number): V => ({c, at, fx, fy});

const A: Seg[] = [
  {k: 'word', n: 1, text: 'Cena a', bg: G}, {k: 'word', n: 1, text: 'Quattro', bg: O, ink: G}, {k: 'word', n: 2, text: 'Mani', bg: SA, ink: G},
  // the villa, green page
  {k: 'frame', n: 2, v: v('6013', 0.5), bg: G}, {k: 'wide', n: 2, v: v('6022', 0), bg: G}, {k: 'port', n: 2, v: v('5953', 0.8), bg: G},
  {k: 'frame', n: 2, v: v('5983', 5.7), bg: G}, {k: 'full', n: 2, v: v('6050', 2.4)},
  // the bar, orange page: a triptych built on the beat
  {k: 'tri', n: 3, vs: [v('6093', 0.6), v('6096', 2.7), v('6047', 0)], bg: O}, {k: 'full', n: 1, v: v('6044', 6.0)},
  // the kitchen, sand page: the two chefs side by side, then their hands
  {k: 'duo', n: 3, vs: [v('6159', 12.0), v('6165', 8.0)], bg: SA, dir: 'v'},
  {k: 'frame', n: 2, v: v('6086', 4.6), bg: SA}, {k: 'full', n: 2, v: v('6090', 5.6)}, {k: 'frame', n: 2, v: v('6088', 3.0), bg: SA},
  {k: 'full', n: 1, v: v('6162', 0.8)}, {k: 'frame', n: 2, v: v('6177', 24.4), bg: SA},
  {k: 'sheet', n: 9, vs: [v('6178', 9.6), v('6137', 3.0), v('6156', 9.6), v('6172', 5.2), v('6085', 1.2), v('6043', 3.3), v('6094', 1.3), v('6169', 15.4), v('6152', 1.3)], bg: SA},
  // the service, green page
  {k: 'full', n: 2, v: v('6138', 9.6)}, {k: 'frame', n: 2, v: v('6174', 1.5), bg: G}, {k: 'full', n: 2, v: v('6226', 0.6)},
  {k: 'wide', n: 2, v: v('6100', 0.6), bg: G}, {k: 'port', n: 2, v: v('6182', 0.6, 50, 35), bg: G},
  {k: 'full', n: 3, v: v('6227', 5.0)},
  {k: 'end', n: 8, v: v('6239', 2.0), bg: G},
];
const B: Seg[] = [
  {k: 'word', n: 1, text: 'Cena a', bg: G}, {k: 'word', n: 1, text: 'Quattro', bg: O, ink: G}, {k: 'word', n: 1, text: 'Mani', bg: G},
  // the villa
  {k: 'full', n: 2, v: v('6012', 3.0), punch: true}, {k: 'full', n: 2, v: v('5999', 0)}, {k: 'full', n: 1, v: v('6008', 1.1)},
  {k: 'full', n: 2, v: v('6011', 2.6), punch: true}, {k: 'full', n: 2, v: v('5954', 0.4)},
  // the bar
  {k: 'full', n: 2, v: v('6042', 4.2), punch: true}, {k: 'full', n: 1, v: v('6097', 0)}, {k: 'full', n: 2, v: v('6045', 5.8)},
  // the kitchen: two chefs, one above the other
  {k: 'duo', n: 2, vs: [v('6167', 1.0, 50, 40), v('6164', 2.3, 50, 40)], bg: G, dir: 'h'},
  {k: 'full', n: 2, v: v('6091', 3.9), punch: true}, {k: 'full', n: 1, v: v('6092', 7.7)}, {k: 'full', n: 2, v: v('6087', 7.7)},
  {k: 'full', n: 2, v: v('6098', 10.0), punch: true}, {k: 'full', n: 1, v: v('6154', 9.1)}, {k: 'full', n: 2, v: v('6157', 5.7)},
  {k: 'full', n: 2, v: v('6151', 6.6), punch: true}, {k: 'full', n: 2, v: v('6163', 10.5)}, {k: 'full', n: 2, v: v('6173', 4.4)},
  // the table
  {k: 'duo', n: 2, vs: [v('6125', 2.0, 50, 55), v('6099', 0.6, 50, 50)], bg: O, dir: 'h'},
  {k: 'full', n: 2, v: v('6224', 0.7), punch: true}, {k: 'full', n: 1, v: v('6123', 0.9)}, {k: 'full', n: 2, v: v('6122', 0.6)},
  {k: 'full', n: 2, v: v('6095', 1.6)}, {k: 'full', n: 2, v: v('6225', 0.8), punch: true},
  {k: 'full', n: 3, v: v('6240', 4.3)},
  {k: 'end', n: 8, v: v('6102', 35.4), bg: O},
];
export const VILLA_BRAND = {A, B};
export const villaBrandFrames = (segs: Seg[]) => bf(segs.reduce((s, x) => s + x.n, 0));

const Vid: React.FC<{v: V; zoom?: number}> = ({v: s, zoom = 1}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <OffthreadVideo src={staticFile(`videos/villa/RZ4_${s.c}.mp4`)} startFrom={Math.round(s.at * FPS)} muted
      style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${s.fx ?? 50}% ${s.fy ?? 50}%`, transform: `scale(${zoom})`, transformOrigin: `${s.fx ?? 50}% ${s.fy ?? 50}%`}} />
  </AbsoluteFill>
);
const mono: React.CSSProperties = {fontFamily: fonts.mono, fontWeight: 500, fontSize: 24, letterSpacing: 6, textTransform: 'uppercase'};
const Chrome: React.FC<{ink: string}> = ({ink}) => (
  <>
    <div style={{position: 'absolute', left: 80, right: 80, top: 262, display: 'flex', justifyContent: 'space-between', ...mono, color: ink}}><span>Sea, Signora</span><span>× Villa Prato</span></div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 1556, display: 'flex', justifyContent: 'space-between', ...mono, color: ink}}><span>Cena a Quattro Mani</span><span>13.11</span></div>
  </>
);
const inkOn = (bg: string) => (bg === SA || bg === O ? G : I);
const BOX = {left: 80, top: 320, width: 920, height: 1200};
const Framed: React.FC<{v: V; box?: typeof BOX; line: string}> = ({v: s, box = BOX, line}) => (
  <div style={{position: 'absolute', ...box, overflow: 'hidden', outline: `2px solid ${line}`, outlineOffset: 10}}><Vid v={s} /></div>
);
// the end of «Tagli»: the page colour with a thick «4» cut out of it, the footage showing through
const FourCut: React.FC<{id: string; bg: string}> = ({id, bg}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <defs>
      <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
        <rect x={0} y={0} width={1080} height={1920} fill="white" />
        <text x={540} y={1250} textAnchor="middle" fontFamily={fonts.display} fontSize={1250} fill="black" stroke="black" strokeWidth={70} strokeLinejoin="round"
          transform="translate(540 820) scale(1.15 1) translate(-540 -820)">4</text>
      </mask>
    </defs>
    <rect x={0} y={0} width={1080} height={1920} fill={bg} mask={`url(#${id})`} />
  </svg>
);
const SegView: React.FC<{s: Seg; i: number; pagina: boolean}> = ({s, i, pagina}) => {
  const f = useCurrentFrame();
  const beat = BEAT * FPS;
  switch (s.k) {
    case 'full': return <Vid v={s.v} zoom={s.punch && f >= Math.round(beat) ? 1.12 : 1} />;
    case 'frame': case 'wide': case 'port': {
      const ink = inkOn(s.bg);
      return (
        <AbsoluteFill style={{background: s.bg}}>
          {s.k === 'frame' && <Framed v={s.v} line={ink} />}
          {s.k === 'wide' && <Framed v={s.v} box={{left: 80, top: 470, width: 920, height: 800}} line={ink} />}
          {s.k === 'port' && <div style={{position: 'absolute', left: 120, top: 480, width: 840, height: 840, borderRadius: '50%', overflow: 'hidden', outline: `2px solid ${ink}`, outlineOffset: 10}}><Vid v={s.v} /></div>}
          {pagina && <Chrome ink={ink} />}
        </AbsoluteFill>
      );
    }
    case 'duo': {
      const h = s.dir === 'h', ink = inkOn(s.bg);
      const boxes = pagina
        ? (h ? [{left: 80, top: 320, width: 920, height: 590}, {left: 80, top: 930, width: 920, height: 590}] : [{left: 80, top: 320, width: 450, height: 1200}, {left: 550, top: 320, width: 450, height: 1200}])
        : (h ? [{left: 0, top: 0, width: 1080, height: 954}, {left: 0, top: 966, width: 1080, height: 954}] : [{left: 0, top: 0, width: 534, height: 1920}, {left: 546, top: 0, width: 534, height: 1920}]);
      return (
        <AbsoluteFill style={{background: s.bg}}>
          {s.vs.map((x, j) => <div key={j} style={{position: 'absolute', ...boxes[j], overflow: 'hidden'}}><Vid v={x} /></div>)}
          {pagina && <Chrome ink={ink} />}
        </AbsoluteFill>
      );
    }
    case 'tri': case 'sheet': {
      const ink = inkOn(s.bg);
      const shown = Math.min(s.vs.length, 1 + Math.floor(f / beat));
      const tiles = s.k === 'tri'
        ? s.vs.map((_, j) => { const w = (920 - 12) / 3; return {left: 80 + j * (w + 6), top: 320, width: w, height: 1200}; })
        : s.vs.map((_, j) => { const g = 10, w = (920 - 2 * g) / 3, h = (1200 - 2 * g) / 3; return {left: 80 + (j % 3) * (w + g), top: 320 + Math.floor(j / 3) * (h + g), width: w, height: h}; });
      return (
        <AbsoluteFill style={{background: s.bg}}>
          {s.vs.slice(0, shown).map((x, j) => <div key={j} style={{position: 'absolute', ...tiles[j], overflow: 'hidden'}}><Vid v={x} /></div>)}
          <Chrome ink={ink} />
        </AbsoluteFill>
      );
    }
    case 'word': return (
      <AbsoluteFill style={{background: s.bg, justifyContent: 'center', alignItems: 'center'}}>
        <div style={{fontFamily: fonts.display, color: s.ink ?? I, fontSize: s.text.length > 6 ? 200 : 260, lineHeight: 1, textTransform: 'uppercase', letterSpacing: 2, marginTop: -40}}>{s.text}</div>
      </AbsoluteFill>
    );
    case 'end': {
      const ink = inkOn(s.bg);
      return (
        <AbsoluteFill style={{background: s.bg}}>
          {pagina ? <Framed v={s.v} box={{left: 190, top: 330, width: 700, height: 880}} line={ink} />
            : <><Vid v={s.v} /><FourCut id={`vb-four-${i}`} bg={s.bg} /></>}
          <div style={{position: 'absolute', left: 0, right: 0, top: pagina ? 1290 : 1400, textAlign: 'center', color: ink}}>
            <div style={{fontFamily: fonts.display, fontSize: 96, lineHeight: 1}}>Sea, Signora × Villa Prato</div>
            <div style={{...mono, fontSize: 26, letterSpacing: 8, marginTop: 26}}>cena a quattro mani · 13.11</div>
          </div>
        </AbsoluteFill>
      );
    }
  }
};

export const VillaBrand: React.FC<{variant: 'A' | 'B'}> = ({variant}) => {
  const segs = VILLA_BRAND[variant];
  const total = villaBrandFrames(segs);
  let k = 0;
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <Audio src={staticFile('music/villa-hands.mp3')} volume={(fr) => interpolate(fr, [0, 3, total - 30, total], [0, 0.9, 0.9, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      {segs.map((s, i) => {
        const a = bf(k); k += s.n;
        return <Sequence key={i} from={a} durationInFrames={bf(k) - a}><SegView s={s} i={i} pagina={variant === 'A'} /></Sequence>;
      })}
    </AbsoluteFill>
  );
};
