import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Reel «Sea, Signora Milano turns 1» (client, 30–31.10), after the client's reference: a montage of the year with a
// paper note that grows while the words arrive one by one, the reel ending on the full phrase.
// Client 31.10: brand fonts only (Skanaus in brand orange); no Instagram marks, no end card; faster, denser cuts with the
// room, the guests and the events. Client 31.10 (3): a more real, aesthetic note — fibrous paper with soft light, a strip
// of masking tape, a contact shadow and a slow sway; each word is «written» left to right like ink, fast; the note never
// covers people: every cut says where it sits (top / bottom) and it glides between the two; a light warm «culinary»
// grade — client 31.10 (4): livelier: more contrast and colour, warm soft-light highlights, a light vignette; music: our own track, cuts on its half-beats.

const FPS = 30;

// n = frames on screen; push = slow zoom-in over the shot (0.04 = +4 %); note = where the paper sits on this shot
export type YearCut = {clip: string; start: number; n: number; zoom?: number; fx?: number; fy?: number; push?: number; note?: 'top' | 'bottom'};
export type AnniversaryProps = {cuts: YearCut[]; endS: number; fast?: boolean; grade?: boolean; audio?: {src: string; from: number}; chalk?: 'ivory' | 'orange' | 'cycle' | 'swap'};

const Shot: React.FC<{c: YearCut; grade?: boolean}> = ({c, grade}) => {
  const f = useCurrentFrame();
  const z = (c.zoom ?? 1) * (1 + (c.push ?? 0) * (f / Math.max(1, c.n)));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(`videos/year/${c.clip}.mp4`)} startFrom={Math.round(c.start * FPS)} muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${c.fx ?? 50}% ${c.fy ?? 50}%`,
          transform: `scale(${z})`, transformOrigin: `${c.fx ?? 50}% ${c.fy ?? 50}%`,
          // warm, slightly darker «culinary» look at ~40 %: deeper shadows, browner mids, softer colour
          filter: grade ? 'brightness(1.0) contrast(1.12) saturate(1.22)' : undefined}} />
      {grade ? <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,170,90,0.16), rgba(255,120,60,0.10))', mixBlendMode: 'soft-light'}} /> : null}
      {grade ? <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,12,6,0.22) 100%)'}} /> : null}
    </AbsoluteFill>
  );
};

// paper: warm off-white with fibres and grain, soft light from the top left (a slight curl), worn edges, masking tape
const Paper: React.FC<{w: number; h: number; tape?: boolean}> = ({w, h, tape = true}) => (
  <svg width={w} height={h + 40} style={{position: 'absolute', left: 0, top: -40, overflow: 'visible'}}>
    <defs>
      <filter id="grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.34  0 0 0 0 0.24  0 0 0 0.13 0" />
      </filter>
      <filter id="fibres" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.004 0.09" numOctaves="2" seed="11" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.42  0 0 0 0 0.3  0 0 0 0.16 -0.04" />
      </filter>
      <linearGradient id="light" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
        <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="1" stopColor="#5C4426" stopOpacity="0.16" />
      </linearGradient>
      <radialGradient id="edge" cx="50%" cy="50%" r="75%">
        <stop offset="70%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#6B5532" stopOpacity="0.22" />
      </radialGradient>
      <linearGradient id="tape" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#EFE6CF" stopOpacity="0.92" />
        <stop offset="1" stopColor="#DCCFAF" stopOpacity="0.88" />
      </linearGradient>
    </defs>
    <g transform="translate(0 40)">
      <rect width={w} height={h} rx={3} fill="#F4EEE2" />
      <rect width={w} height={h} rx={3} filter="url(#fibres)" />
      <rect width={w} height={h} rx={3} filter="url(#grain)" />
      <rect width={w} height={h} rx={3} fill="url(#light)" />
      <rect width={w} height={h} rx={3} fill="url(#edge)" />
    </g>
    {/* masking tape, a little crooked, with torn ends */}
    {tape ? <g transform={`translate(${w / 2 - 95} 18) rotate(-4 95 22)`}>
      <path d="M 4 4 L 190 0 L 186 10 L 191 20 L 187 30 L 192 40 L 6 44 L 0 34 L 5 24 L 0 14 Z" fill="url(#tape)" />
      <path d="M 4 4 L 190 0 L 186 10 L 191 20 L 187 30 L 192 40 L 6 44 L 0 34 L 5 24 L 0 14 Z" filter="url(#grain)" />
    </g> : null}
  </svg>
);

const NW = 640, NH = 800;

// a crumpled sheet that opens up: the paper is cut into facets that start folded into a small ball (each tilted in 3D,
// shaded, pulled to the centre) and flatten out; the creases stay on the sheet afterwards
const COLS = 4, ROWS = 5, UNFOLD = 16;
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

const Creases: React.FC = () => {
  const lines: string[] = [];
  for (let c = 1; c < COLS; c++) {
    const x = (NW / COLS) * c;
    lines.push(Array.from({length: 6}, (_, k) => `${x + (rnd(c, k) - 0.5) * 14},${(NH / 5) * k}`).join(' '));
  }
  for (let r = 1; r < ROWS; r++) {
    const y = (NH / ROWS) * r;
    lines.push(Array.from({length: 5}, (_, k) => `${(NW / 4) * k},${y + (rnd(r + 9, k) - 0.5) * 14}`).join(' '));
  }
  lines.push(`0,${NH * 0.18} ${NW * 0.42},${NH * 0.52} ${NW},${NH * 0.6}`, `${NW * 0.15},${NH} ${NW * 0.55},${NH * 0.62} ${NW * 0.9},0`);
  return (
    <svg width={NW} height={NH} style={{position: 'absolute', inset: 0}}>
      {lines.map((pts, i) => (
        <g key={i} fill="none" strokeLinejoin="round">
          <polyline points={pts} stroke="rgba(255,255,255,0.55)" strokeWidth={2} transform="translate(1.2 1.2)" />
          <polyline points={pts} stroke="rgba(92,70,40,0.2)" strokeWidth={1.3} />
        </g>
      ))}
    </svg>
  );
};

const Crumple: React.FC<{t: number}> = ({t}) => {
  const tw = NW / COLS, th = NH / ROWS, k = 1 - t;
  return (
    <div style={{position: 'absolute', inset: 0, perspective: 900}}>
      {Array.from({length: COLS * ROWS}, (_, i) => {
        const c = i % COLS, r = Math.floor(i / COLS);
        const dx = (NW / 2 - (c + 0.5) * tw) * 0.82 * k, dy = (NH / 2 - (r + 0.5) * th) * 0.82 * k;
        const ax = (rnd(i, 1) - 0.5) * 220 * k, ay = (rnd(i, 2) - 0.5) * 220 * k, az = (rnd(i, 3) - 0.5) * 120 * k;
        return (
          <div key={i} style={{position: 'absolute', left: c * tw - 1.5, top: r * th - 1.5, width: tw + 3, height: th + 3, overflow: 'hidden',
            transform: `translate3d(${dx}px, ${dy}px, ${(rnd(i, 4) - 0.3) * 120 * k}px) rotateX(${ax}deg) rotateY(${ay}deg) rotateZ(${az}deg)`,
            filter: `brightness(${1 - (rnd(i, 5) * 0.55) * k})`, backfaceVisibility: 'visible'}}>
            <div style={{position: 'absolute', left: -c * tw + 1.5, top: -r * th + 1.5, width: NW, height: NH}}><Paper w={NW} h={NH} tape={false} /></div>
          </div>
        );
      })}
    </div>
  );
};

// text: «one year of» in Spectral italic, then SEA, / SIGNORA in Skanaus; letters rise in one by one from a soft blur
const LINES: {text: string; at: number; style: React.CSSProperties}[] = [
  {text: 'one year of', at: UNFOLD + 2, style: {fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 100, color: brandPalette.green5605, height: 140}},
  {text: 'SEA,', at: UNFOLD + 16, style: {fontFamily: fonts.display, fontSize: 150, color: brandPalette.orange158, height: 160, letterSpacing: 1, whiteSpace: 'nowrap'}},
  {text: 'SIGNORA', at: UNFOLD + 22, style: {fontFamily: fonts.display, fontSize: 150, color: brandPalette.orange158, height: 160, letterSpacing: 1, whiteSpace: 'nowrap'}},
];
const STAGGER = 1.1, LETTER = 9;

const Letters: React.FC<{f: number; text: string; at: number}> = ({f, text, at}) => (
  <>
    {text.split('').map((ch, i) => {
      const t = interpolate(f - at - i * STAGGER, [0, LETTER], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
      return (
        <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: t, transform: `translateY(${(1 - t) * 26}px) rotate(${(1 - t) * -6}deg)`,
          filter: `blur(${(1 - t) * 5}px)`}}>{ch}</span>
      );
    })}
  </>
);

const Note: React.FC<{f: number}> = ({f}) => {
  const t = interpolate(f, [0, UNFOLD], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const flat = f >= UNFOLD;
  return (
    <div style={{position: 'relative', width: NW, height: NH,
      filter: `drop-shadow(0 2px 2px rgba(0,0,0,0.35)) drop-shadow(0 26px 34px rgba(0,0,0,${0.38 * Math.min(1, t * 1.5)}))`}}>
      {flat ? (
        <>
          <Paper w={NW} h={NH} tape />
          <Creases />
          <div style={{position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', lineHeight: 1.05, mixBlendMode: 'multiply'}}>
            {LINES.map((l) => <div key={l.text} style={l.style}><Letters f={f} text={l.text} at={l.at} /></div>)}
          </div>
        </>
      ) : <Crumple t={Math.max(0, t)} />}
    </div>
  );
};


// chalk / crayon: the frame is coloured in with loose diagonal strokes (rough edges, grain, a second lighter pass),
// then the text arrives on it. tone: 'ivory' (green + orange text) or 'orange' (ivory + green text)
const CW = 860, CH = 600, STROKES = 10, FILL = 14;
const zigzag = (seed: number, inset: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= STROKES; i++) {
    const x0 = inset + ((CW - 2 * inset - 90) / STROKES) * i, j = (rnd(i, seed) - 0.5) * 40, e = (rnd(i, seed + 5) - 0.5) * 50;
    pts.push(i % 2 === 0 ? `${x0 + j},${CH - inset - 40 + e}` : `${x0 + 90 + j},${inset + 40 + e}`);
  }
  return 'M ' + pts.join(' L ');
};
const Chalk: React.FC<{f: number; tone: 'ivory' | 'orange'}> = ({f, tone}) => {
  const col = tone === 'ivory' ? '#F2EADB' : brandPalette.orange158;
  const t = interpolate(f, [0, FILL], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const t2 = interpolate(f, [5, FILL + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const L = 9000;
  const ink = tone === 'ivory' ? {a: brandPalette.green5605, b: brandPalette.orange158} : {a: '#FFF8EC', b: brandPalette.green5605};
  return (
    <div style={{position: 'relative', width: CW, height: CH}}>
      <svg width={CW} height={CH} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <filter id="crayon" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="4" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="34" xChannelSelector="R" yChannelSelector="G" result="rough" />
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" result="grain" />
            <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -7 4.9" result="holes" />
            <feComposite in="rough" in2="holes" operator="in" result="pitted" />
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.35" numOctaves="2" seed="5" result="streak" />
            <feColorMatrix in="streak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0.62" result="streaks" />
            <feComposite in="pitted" in2="streaks" operator="in" />
          </filter>
        </defs>
        <g filter="url(#crayon)">
          <g>
            <path d={zigzag(1, 30)} fill="none" stroke={col} strokeWidth={160} strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={L} strokeDashoffset={L * (1 - t)} />
            <path d={zigzag(2, 60)} fill="none" stroke={col} strokeOpacity={0.85} strokeWidth={130} strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={L} strokeDashoffset={L * (1 - t2)} transform={`translate(${CW} 0) scale(-1 1)`} />
          </g>
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', lineHeight: 1.05, transform: 'scale(0.86)'}}>
        {LINES.map((l, i) => (
          <div key={l.text} style={{...l.style, color: i === 0 ? ink.a : ink.b, height: (l.style.height as number) * 0.95}}>
            <Letters f={f} text={l.text} at={l.at} />
          </div>
        ))}
      </div>
    </div>
  );
};

// the cycling version (client 31.10, 4): every segment (2 beats) the crayon repaints the patch in the next brand colour
// and the big words roll to the next brand font like the drum of a counter; the last segment lands on Skanaus.
const PALETTES = [
  {bg: '#F2EADB', a: brandPalette.green5605, b: brandPalette.orange158},
  {bg: brandPalette.orange158, a: '#FFF8EC', b: brandPalette.green5605},
  {bg: brandPalette.green5605, a: brandPalette.mustard605, b: '#FFF8EC'},
  {bg: brandPalette.mustard605, a: brandPalette.green5605, b: brandPalette.green5605},
  {bg: brandPalette.olive5845, a: '#FFF8EC', b: brandPalette.green5605},
];
const FACES: {text: [string, string]; style: React.CSSProperties}[] = [
  {text: ['SEA,', 'SIGNORA'], style: {fontFamily: fonts.display, fontSize: 150, letterSpacing: 1}},
  {text: ['Sea,', 'Signora'], style: {fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 158}},
  {text: ['SEA,', 'SIGNORA'], style: {fontFamily: fonts.mono, fontWeight: 700, fontSize: 112, letterSpacing: -2}},
];
const REPAINT = 7, ROLL = 6, BLOCK = 330;

const Layer: React.FC<{color: string; t: number; seed: number; flip: boolean}> = ({color, t, seed, flip}) => {
  const L = 9000;
  return (
    <g transform={flip ? `translate(${CW} 0) scale(-1 1)` : undefined}>
      <path d={zigzag(seed, 30)} fill="none" stroke={color} strokeWidth={160} strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={L} strokeDashoffset={L * (1 - t)} />
      <path d={zigzag(seed + 1, 60)} fill="none" stroke={color} strokeWidth={130} strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={L} strokeDashoffset={L * (1 - Math.max(0, t * 1.25 - 0.25))} transform={`translate(${CW} 0) scale(-1 1)`} />
    </g>
  );
};

const Face: React.FC<{k: number; color: string; f?: number; letters?: boolean; last?: boolean}> = ({k, color, f = 0, letters, last}) => {
  const face = FACES[last ? 0 : k % FACES.length];
  return (
    <div style={{height: BLOCK, color, lineHeight: 1.05, whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', justifyContent: 'center', ...face.style}}>
      {face.text.map((w, i) => <div key={i}>{letters ? <Letters f={f} text={w} at={LINES[i + 1].at} /> : w}</div>)}
    </div>
  );
};

// swap: the patch is painted once and keeps its shape; its colour changes with every cut (client 31.10: no font counter)
export const ChalkCycle: React.FC<{f: number; segs: number[]; swap?: boolean}> = ({f, segs, swap}) => {
  const k = Math.max(0, segs.filter((s) => f >= s).length - 1);
  const last = k === segs.length - 1;
  const pal = (i: number) => PALETTES[i % PALETTES.length];
  const tCur = interpolate(f - segs[k], [0, k === 0 ? FILL : REPAINT], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const tFill = interpolate(f, [0, FILL], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const roll = k === 0 || swap ? 1 : interpolate(f - segs[k], [0, ROLL], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const textColor = (i: number) => (swap || tCur > 0.45 || k === 0 ? pal(i) : pal(Math.max(0, i - 1)));
  return (
    <div style={{position: 'relative', width: CW, height: CH}}>
      <svg width={CW} height={CH} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <filter id="crayon2" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="4" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="34" xChannelSelector="R" yChannelSelector="G" result="rough" />
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" result="grain" />
            <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -7 4.9" result="holes" />
            <feComposite in="rough" in2="holes" operator="in" result="pitted" />
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.35" numOctaves="2" seed="5" result="streak" />
            <feColorMatrix in="streak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0.62" result="streaks" />
            <feComposite in="pitted" in2="streaks" operator="in" />
          </filter>
          {/* denser crayon for the small one-shape patch: rough edge, soft streaks, only a few pinholes */}
          <filter id="crayon3" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="4" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="30" xChannelSelector="R" yChannelSelector="G" result="rough" />
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="9" result="grain" />
            <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -12 9.4" result="holes" />
            <feComposite in="rough" in2="holes" operator="in" result="pitted" />
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.3" numOctaves="2" seed="5" result="streak" />
            <feColorMatrix in="streak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0.8" result="streaks" />
            <feComposite in="pitted" in2="streaks" operator="in" />
          </filter>
        </defs>
        <g filter={swap ? 'url(#crayon3)' : 'url(#crayon2)'}>
          {swap ? (
            <>
              <Layer color={pal(Math.max(0, k - 1)).bg} t={tFill} seed={7} flip={false} />
              <Layer color={pal(Math.max(0, k - 1)).bg} t={tFill} seed={21} flip />
              {k > 0 ? <g opacity={interpolate(f - segs[k], [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}>
                <Layer color={pal(k).bg} t={tFill} seed={7} flip={false} /><Layer color={pal(k).bg} t={tFill} seed={21} flip /></g> : null}
            </>
          ) : (
            <>
              {k > 0 ? <Layer color={pal(k - 1).bg} t={1} seed={k * 7} flip={(k - 1) % 2 === 1} /> : null}
              <Layer color={pal(k).bg} t={tCur} seed={k * 7 + 7} flip={k % 2 === 1} />
            </>
          )}
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', transform: 'scale(0.86)'}}>
        <div style={{...LINES[0].style, color: textColor(k).a, height: 120}}><Letters f={f} text={LINES[0].text} at={LINES[0].at} /></div>
        {/* the counter: the previous face rolls up and out, the next one rolls in from below */}
        <div style={{position: 'relative', height: BLOCK, overflow: 'hidden'}}>
          {k > 0 && roll < 1 ? (
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, transform: `translateY(${-roll * BLOCK}px)`, filter: `blur(${roll * 6}px)`}}>
              <Face k={k - 1} color={pal(k - 1).b} />
            </div>
          ) : null}
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, transform: `translateY(${(1 - roll) * BLOCK}px)`, filter: `blur(${(1 - roll) * 6}px)`}}>
            <Face k={k} color={textColor(k).b} f={f} letters={k === 0 || swap} last={last || swap} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const montageFrames = (cuts: YearCut[]) => cuts.reduce((s, c) => s + c.n, 0);
// endS: how long the last shot holds with the full phrase on the note
export const yearDuration = (cuts: YearCut[], endS: number) => montageFrames(cuts) + Math.round(endS * FPS);


export const Anniversary: React.FC<AnniversaryProps> = ({cuts, endS, fast, grade, audio, chalk}) => {
  const f = useCurrentFrame();
  const montageEnd = montageFrames(cuts);
  const total = montageEnd + Math.round(endS * FPS);
  const starts = cuts.map((_, i) => cuts.slice(0, i).reduce((s, c) => s + c.n, 0));
  // the note grows smoothly the whole reel (kept small enough to stay off people)
  const grow = interpolate(f, [0, total], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const scale = fast ? 0.7 + 0.12 * grow : 0.42 + 0.34 * grow;
  const sway = -1.6 + Math.sin(f / 26) * 0.7;
  return (
    <AbsoluteFill style={{background: brandPalette.green5605}}>
      {cuts.map((c, i) => {
        const last = i === cuts.length - 1;
        const n = last ? c.n + Math.round(endS * FPS) : c.n;
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={n}>
            <Shot c={{...c, n}} grade={grade} />
          </Sequence>
        );
      })}
      {chalk ? (
        <div style={{position: 'absolute', left: 540 - CW / 2, top: 960 - CH / 2, width: CW, height: CH, transform: 'rotate(-2deg)'}}>
          {chalk === 'cycle' || chalk === 'swap'
            ? <div style={{transform: chalk === 'swap' ? 'scale(0.74)' : undefined}}><ChalkCycle f={f} segs={chalk === 'swap' ? starts : starts.filter((_, i) => i % 4 === 0)} swap={chalk === 'swap'} /></div>
            : <Chalk f={f} tone={chalk} />}
        </div>
      ) : (
        <div style={{position: 'absolute', left: 540 - NW / 2, top: 960 - NH / 2, width: NW, height: NH,
          transform: `rotate(${sway}deg) scale(${scale})`}}>
          <Note f={f} />
        </div>
      )}
      {audio ? (
        <Audio src={staticFile(audio.src)} startFrom={Math.round(audio.from * FPS)}
          volume={(fr) => interpolate(fr, [0, 4, total - 18, total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      ) : null}
    </AbsoluteFill>
  );
};
