import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Reel «Sea, Signora Milano turns 1» (client, 30–31.10), after the client's reference: a montage of the year with an
// aged paper note in the middle that grows while the words arrive one by one, the reel ending on the full phrase.
// Client 31.10 (2): no Instagram marks, no end card; faster, denser cuts with the room, the guests and the events.
// Client 31.10: brand fonts only (Skanaus words in brand orange, mono handle), words fade/rise in smoothly and the note
// grows continuously — no jumps. Three cuts of the montage (anniversaryCuts.ts): each clip has its own length in frames,
// so a variant can keep an even beat, accelerate, or hold long calm shots with a slow push-in.
// Silent: the music is added in Instagram.

const FPS = 30;

// n = frames on screen; push = slow zoom-in over the shot (0.04 = +4 %)
export type YearCut = {clip: string; start: number; n: number; zoom?: number; fx?: number; fy?: number; push?: number};

// the note, line by line; `at` is a fraction of the montage, so every variant spaces the words over its own length
const WORDS: {text: string; at: number; line: number}[] = [
  {text: 'Sea,', at: 0.06, line: 0},
  {text: 'Signora', at: 0.2, line: 1},
  {text: 'Milano', at: 0.4, line: 2},
  {text: 'turns', at: 0.58, line: 3},
  {text: '1', at: 0.72, line: 3},
];
const IN = 10; // frames for a word to fade and rise in

const Shot: React.FC<{c: YearCut}> = ({c}) => {
  const f = useCurrentFrame();
  const z = (c.zoom ?? 1) * (1 + (c.push ?? 0) * (f / Math.max(1, c.n)));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(`videos/year/${c.clip}.mp4`)} startFrom={Math.round(c.start * FPS)} muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${c.fx ?? 50}% ${c.fy ?? 50}%`,
          transform: `scale(${z})`, transformOrigin: `${c.fx ?? 50}% ${c.fy ?? 50}%`}} />
    </AbsoluteFill>
  );
};

// aged paper: warm off-white, grain, darker worn edges, a dog-eared top-left corner
const Paper: React.FC<{w: number; h: number}> = ({w, h}) => {
  const shape = `M 34 0 L ${w} 0 L ${w} ${h} L 0 ${h} L 0 34 Z`;
  return (
    <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
      <defs>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.24  0 0 0 0.16 0" />
        </filter>
        <filter id="blotch" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="3" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.25  0 0 0 0.22 -0.06" />
        </filter>
        <radialGradient id="edge" cx="50%" cy="48%" r="72%">
          <stop offset="62%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#6B5532" stopOpacity="0.3" />
        </radialGradient>
        <linearGradient id="fold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFDF6" />
          <stop offset="1" stopColor="#D9CAAE" />
        </linearGradient>
      </defs>
      <path d={shape} fill="#F3ECDD" />
      <path d={shape} filter="url(#blotch)" />
      <path d={shape} filter="url(#grain)" />
      <path d={shape} fill="url(#edge)" />
      <path d="M 0 34 L 34 0 L 34 30 Q 34 34 30 34 Z" fill="url(#fold)" stroke="#BFAE8E" strokeWidth={1} />
    </svg>
  );
};

const NW = 640, NH = 800;
const Note: React.FC<{f: number; total: number}> = ({f, total}) => (
  <div style={{position: 'relative', width: NW, height: NH, filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.42))'}}>
    <Paper w={NW} h={NH} />
    <div style={{position: 'absolute', left: 52, right: 30, top: 66, fontFamily: fonts.display, fontSize: 112, lineHeight: 1.06,
      textTransform: 'uppercase', color: brandPalette.orange158, whiteSpace: 'nowrap'}}>
      {[0, 1, 2, 3].map((line) => (
        <div key={line} style={{height: 120}}>
          {WORDS.filter((w) => w.line === line).map((w) => {
            const t = interpolate(f - w.at * total, [0, IN], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
            return (
              <span key={w.text} style={{display: 'inline-block', marginRight: 26, opacity: t,
                transform: `translateY(${(1 - t) * 22}px)`, filter: `blur(${(1 - t) * 8}px)`}}>{w.text}</span>
            );
          })}
        </div>
      ))}
    </div>
  </div>
);

export const montageFrames = (cuts: YearCut[]) => cuts.reduce((s, c) => s + c.n, 0);
// endS: how long the last shot holds with the full phrase on the note
export const yearDuration = (cuts: YearCut[], endS: number) => montageFrames(cuts) + Math.round(endS * FPS);

export const Anniversary: React.FC<{cuts: YearCut[]; endS: number}> = ({cuts, endS}) => {
  const f = useCurrentFrame();
  const montageEnd = montageFrames(cuts);
  // the note grows smoothly the whole reel
  const grow = interpolate(f, [0, montageEnd + endS * FPS], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const scale = 0.42 + 0.34 * grow;
  const starts = cuts.map((_, i) => cuts.slice(0, i).reduce((s, c) => s + c.n, 0));
  const last = cuts[cuts.length - 1];
  return (
    <AbsoluteFill style={{background: brandPalette.green5605}}>
      {cuts.map((c, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={i === cuts.length - 1 ? c.n + Math.round(endS * FPS) : c.n}>
          <Shot c={i === cuts.length - 1 ? {...c, n: c.n + Math.round(endS * FPS)} : c} />
        </Sequence>
      ))}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `scale(${scale})`}}><Note f={f} total={montageEnd} /></div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
