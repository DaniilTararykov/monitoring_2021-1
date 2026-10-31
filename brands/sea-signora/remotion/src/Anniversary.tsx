import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Reel «Sea, Signora Milano turns 1» (client, 30–31.10) — built after the client's reference: a fast montage cut every
// ~0.47 s, an aged paper note in the middle that grows while red marker words land on it one by one, a small Instagram
// mark top right, and the end on a dark, blurred frame with the note large and the Instagram logo over it.
// The montage is the restaurant's year (folder «Lisa & Danik»: content shootings, life content, events), each cut on
// the steadiest, sharpest stretch of its clip. Marker font: Permanent Marker (Apache 2.0, public/fonts) — the
// reference's handwritten look, used only here. Silent: the music is added in Instagram.

const FPS = 30;
export const CUT = 14; // frames per cut, as in the reference
const MARKER = 'Permanent Marker';
const RED = '#C8202A';
const HANDLE = '@seasignora.milano';

let markerLoaded = false;
const loadMarker = () => {
  if (markerLoaded || typeof document === 'undefined') return;
  markerLoaded = true;
  const h = delayRender('marker font');
  const face = new FontFace(MARKER, `url(${staticFile('fonts/PermanentMarker-Regular.ttf')})`);
  document.fonts.add(face);
  face.load().then(() => continueRender(h)).catch(() => continueRender(h));
};
loadMarker();

export type YearCut = {clip: string; start: number; zoom?: number; fx?: number; fy?: number; rot?: number};

// the note, line by line; each word lands on its frame
const WORDS: {text: string; at: number; line: number}[] = [
  {text: 'SEA,', at: 27, line: 0},
  {text: 'SIGNORA', at: 57, line: 1},
  {text: 'MILANO', at: 99, line: 2},
  {text: 'TURNS', at: 127, line: 3},
  {text: '1', at: 155, line: 3},
];

const Shot: React.FC<{c: YearCut}> = ({c}) => {
  const z = c.zoom ?? 1;
  const r = Math.abs(c.rot ?? 0) * Math.PI / 180;
  const cover = Math.cos(r) + (1920 / 1080) * Math.sin(r);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(`videos/year/${c.clip}.mp4`)} startFrom={Math.round(c.start * FPS)} muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${c.fx ?? 50}% ${c.fy ?? 50}%`,
          transform: `rotate(${c.rot ?? 0}deg) scale(${z * cover})`, transformOrigin: `${c.fx ?? 50}% ${c.fy ?? 50}%`}} />
    </AbsoluteFill>
  );
};

// aged paper: warm off-white, grain, darker worn edges, a dog-eared top-left corner
const Paper: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
    <defs>
      <filter id="grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="n" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.24  0 0 0 0.16 0" />
      </filter>
      <filter id="blotch" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="3" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.25  0 0 0 0.22 -0.06" />
      </filter>
      <radialGradient id="edge" cx="50%" cy="48%" r="72%">
        <stop offset="62%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#6B5532" stopOpacity="0.32" />
      </radialGradient>
      <linearGradient id="fold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFDF6" />
        <stop offset="1" stopColor="#D9CAAE" />
      </linearGradient>
    </defs>
    <path d={`M 34 0 L ${w} 0 L ${w} ${h} L 0 ${h} L 0 34 Z`} fill="#F1E9D8" />
    <path d={`M 34 0 L ${w} 0 L ${w} ${h} L 0 ${h} L 0 34 Z`} filter="url(#blotch)" />
    <path d={`M 34 0 L ${w} 0 L ${w} ${h} L 0 ${h} L 0 34 Z`} filter="url(#grain)" />
    <path d={`M 34 0 L ${w} 0 L ${w} ${h} L 0 ${h} L 0 34 Z`} fill="url(#edge)" />
    <path d="M 0 34 L 34 0 L 34 30 Q 34 34 30 34 Z" fill="url(#fold)" stroke="#BFAE8E" strokeWidth={1} />
  </svg>
);

const NW = 640, NH = 800;
const Note: React.FC<{f: number}> = ({f}) => {
  const lines: string[][] = [[], [], [], []];
  WORDS.forEach((w) => { if (f >= w.at) lines[w.line].push(w.text); });
  return (
    <div style={{position: 'relative', width: NW, height: NH, filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.45))'}}>
      <Paper w={NW} h={NH} />
      <div style={{position: 'absolute', left: 44, right: 30, top: 54, fontFamily: MARKER, fontSize: 118, lineHeight: 0.98, color: RED,
        whiteSpace: 'nowrap', transform: 'rotate(-2deg)', transformOrigin: '0 0'}}>
        {lines.map((l, i) => <div key={i} style={{minHeight: 116}}>{l.join(' ')}</div>)}
      </div>
    </div>
  );
};

const IgLogo: React.FC<{size: number; color?: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="ig" x1="0.1" y1="1" x2="0.9" y2="0">
        <stop offset="0" stopColor="#FEDA75" />
        <stop offset="0.3" stopColor="#FA7E1E" />
        <stop offset="0.6" stopColor="#D62976" />
        <stop offset="1" stopColor="#4F5BD5" />
      </linearGradient>
    </defs>
    <g stroke={color ?? 'url(#ig)'} strokeWidth={4}>
      <rect x="5" y="5" width="38" height="38" rx="11" />
      <circle cx="24" cy="24" r="9" />
    </g>
    <circle cx="35" cy="13" r="2.2" fill={color ?? 'url(#ig)'} />
  </svg>
);

export const yearDuration = (n: number, endS: number) => n * CUT + Math.round(endS * FPS);

export const Anniversary: React.FC<{cuts: YearCut[]; endS: number}> = ({cuts, endS}) => {
  const f = useCurrentFrame();
  const montageEnd = cuts.length * CUT;
  const ending = f >= montageEnd;
  const ease = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.out(Easing.cubic)};
  // the note grows in steps, like the reference: small → after the second line → once the phrase is complete
  const scale = interpolate(f, [0, 96, 102, 152, 160, montageEnd, montageEnd + 8], [0.4, 0.4, 0.5, 0.5, 0.66, 0.66, 0.84], ease);
  const endIn = interpolate(f, [montageEnd, montageEnd + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lastCut = cuts[cuts.length - 1];
  return (
    <AbsoluteFill style={{background: '#1B2F1C'}}>
      {cuts.map((c, i) => (
        <Sequence key={i} from={i * CUT} durationInFrames={CUT}>
          <Shot c={c} />
        </Sequence>
      ))}
      {ending ? (
        <Sequence from={montageEnd}>
          <AbsoluteFill style={{filter: `blur(${16 * endIn}px) brightness(${1 - 0.55 * endIn})`, transform: 'scale(1.08)'}}>
            <Shot c={{...lastCut, start: lastCut.start + CUT / FPS}} />
          </AbsoluteFill>
        </Sequence>
      ) : null}
      {/* small Instagram mark, top right, during the montage */}
      <div style={{position: 'absolute', top: 270, right: 56, textAlign: 'center', opacity: 1 - endIn, color: colors.ivory,
        filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.5))'}}>
        <div style={{display: 'flex', justifyContent: 'center'}}><IgLogo size={44} color={colors.ivory} /></div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 17, letterSpacing: 2, marginTop: 8, textTransform: 'uppercase'}}>{HANDLE}</div>
      </div>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `scale(${scale})`}}><Note f={f} /></div>
      </AbsoluteFill>
      {/* end: the whole frame dims, note included, as in the reference */}
      <AbsoluteFill style={{background: `rgba(11,11,11,${0.45 * endIn})`}} />
      {/* end: the Instagram logo over the note, the handle under it */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: endIn}}>
        <div style={{textAlign: 'center', transform: `translateY(40px) scale(${0.9 + 0.1 * endIn})`}}>
          <div style={{display: 'flex', justifyContent: 'center'}}><IgLogo size={210} /></div>
          <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, letterSpacing: 3, marginTop: 22, color: colors.ivory, textTransform: 'uppercase',
            textShadow: '0 2px 10px rgba(0,0,0,0.6)'}}>{HANDLE}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
