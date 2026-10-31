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
// grade (≈ 40 %, a little darker); music: our own track, cuts on its half-beats.

const FPS = 30;

// n = frames on screen; push = slow zoom-in over the shot (0.04 = +4 %); note = where the paper sits on this shot
export type YearCut = {clip: string; start: number; n: number; zoom?: number; fx?: number; fy?: number; push?: number; note?: 'top' | 'bottom'};
export type AnniversaryProps = {cuts: YearCut[]; endS: number; fast?: boolean; grade?: boolean; audio?: {src: string; from: number}};

// the note, line by line; `at` is a fraction of the montage
const WORDS: {text: string; at: number; fastAt: number; line: number}[] = [
  {text: 'Sea,', at: 0.06, fastAt: 0.03, line: 0},
  {text: 'Signora', at: 0.2, fastAt: 0.09, line: 1},
  {text: 'Milano', at: 0.4, fastAt: 0.16, line: 2},
  {text: 'turns', at: 0.58, fastAt: 0.23, line: 3},
  {text: '1', at: 0.72, fastAt: 0.29, line: 3},
];
const WRITE = 7; // frames to write one word

const Shot: React.FC<{c: YearCut; grade?: boolean}> = ({c, grade}) => {
  const f = useCurrentFrame();
  const z = (c.zoom ?? 1) * (1 + (c.push ?? 0) * (f / Math.max(1, c.n)));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(`videos/year/${c.clip}.mp4`)} startFrom={Math.round(c.start * FPS)} muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${c.fx ?? 50}% ${c.fy ?? 50}%`,
          transform: `scale(${z})`, transformOrigin: `${c.fx ?? 50}% ${c.fy ?? 50}%`,
          // warm, slightly darker «culinary» look at ~40 %: deeper shadows, browner mids, softer colour
          filter: grade ? 'brightness(0.86) contrast(1.1) saturate(0.86) sepia(0.18)' : undefined}} />
      {grade ? <AbsoluteFill style={{background: 'rgba(92, 56, 30, 0.14)', mixBlendMode: 'multiply'}} /> : null}
      {grade ? <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,12,6,0.32) 100%)'}} /> : null}
    </AbsoluteFill>
  );
};

// paper: warm off-white with fibres and grain, soft light from the top left (a slight curl), worn edges, masking tape
const Paper: React.FC<{w: number; h: number}> = ({w, h}) => (
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
    <g transform={`translate(${w / 2 - 95} 18) rotate(-4 95 22)`}>
      <path d="M 4 4 L 190 0 L 186 10 L 191 20 L 187 30 L 192 40 L 6 44 L 0 34 L 5 24 L 0 14 Z" fill="url(#tape)" />
      <path d="M 4 4 L 190 0 L 186 10 L 191 20 L 187 30 L 192 40 L 6 44 L 0 34 L 5 24 L 0 14 Z" filter="url(#grain)" />
    </g>
  </svg>
);

const NW = 640, NH = 800;
const Note: React.FC<{f: number; total: number; fast?: boolean}> = ({f, total, fast}) => (
  <div style={{position: 'relative', width: NW, height: NH,
    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.35)) drop-shadow(0 26px 34px rgba(0,0,0,0.38))'}}>
    <Paper w={NW} h={NH} />
    <div style={{position: 'absolute', left: 56, right: 30, top: 84, fontFamily: fonts.display, fontSize: 112, lineHeight: 1.06,
      textTransform: 'uppercase', color: brandPalette.orange158, whiteSpace: 'nowrap', mixBlendMode: 'multiply'}}>
      {[0, 1, 2, 3].map((line) => (
        <div key={line} style={{height: 120}}>
          {WORDS.filter((w) => w.line === line).map((w) => {
            const t = interpolate(f - (fast ? w.fastAt : w.at) * total, [0, WRITE], [0, 1],
              {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
            // ink: the word is uncovered left to right, with a soft leading edge and a slight bleed that settles
            return (
              <span key={w.text} style={{display: 'inline-block', marginRight: 26, opacity: t > 0 ? 1 : 0,
                WebkitMaskImage: `linear-gradient(90deg, #000 ${t * 120 - 20}%, transparent ${t * 120}%)`,
                maskImage: `linear-gradient(90deg, #000 ${t * 120 - 20}%, transparent ${t * 120}%)`,
                filter: `blur(${(1 - t) * 1.6}px)`}}>{w.text}</span>
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

const NOTE_Y = {top: 600, bottom: 1330}; // centre of the note
const GLIDE = 6; // frames to glide between positions

export const Anniversary: React.FC<AnniversaryProps> = ({cuts, endS, fast, grade, audio}) => {
  const f = useCurrentFrame();
  const montageEnd = montageFrames(cuts);
  const total = montageEnd + Math.round(endS * FPS);
  const starts = cuts.map((_, i) => cuts.slice(0, i).reduce((s, c) => s + c.n, 0));
  // where the note sits now: the current cut's side, glided from the previous one
  const idx = Math.max(0, starts.findIndex((s, i) => f >= s && (i === cuts.length - 1 || f < starts[i + 1])));
  const y = (i: number) => NOTE_Y[cuts[Math.max(0, i)].note ?? 'top'];
  const cy = interpolate(f - starts[idx], [0, GLIDE], [y(idx - 1), y(idx)], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  // the note grows smoothly the whole reel (kept small enough to stay off people)
  const grow = interpolate(f, [0, total], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const scale = fast ? 0.46 + 0.16 * grow : 0.42 + 0.34 * grow;
  const sway = -2.2 + Math.sin(f / 26) * 0.9;
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
      <div style={{position: 'absolute', left: 540 - NW / 2, top: (fast ? cy : 960) - NH / 2, width: NW, height: NH,
        transform: `rotate(${sway}deg) scale(${scale})`}}>
        <Note f={f} total={montageEnd} fast={fast} />
      </div>
      {audio ? (
        <Audio src={staticFile(audio.src)} startFrom={Math.round(audio.from * FPS)}
          volume={(fr) => interpolate(fr, [0, 4, total - 18, total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      ) : null}
    </AbsoluteFill>
  );
};
