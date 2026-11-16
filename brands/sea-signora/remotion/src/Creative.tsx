import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';
import type {Cta} from './types';

loadBrandFonts();

// Creative stories in the Sea, Signora identity (client 16.11: «creative stories in Sea, Signora's identity»).
// The language the client liked in the birthday recap «Pagina»: flat brand colour (green 5605, orange 158, sand 454),
// Skanaus set huge, JetBrains Mono running heads in the corners, Spectral italic for the voice, footage inside letters
// and frames. Static text, hard cuts only (no animated text — client 15.11); builds appear piece by piece on a beat.
// Italian day names in the corners. Formats: page, word mask, duo, strips, grid, menu card, anatomy, hours, quote, full-bleed, type card, polaroids,
// this-or-that, receipt, timeline — each used once or twice a week (client 16.11: «more varied»).

export const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory;
export const BRAND = {G, O, SA, I};
const BEAT = 16; // frames between build steps

export type Media = {src: string; at?: number; fx?: number; fy?: number; z?: number};
type Base = {id: string; day: string; sec: number; bg: string; ink: string; corners?: [string, string, string, string]; cta?: Cta;
  caption: string; hashtags: string[]};
export type CreativeSpec = Base & (
  | {k: 'page'; media: Media[]; box?: 'tall' | 'wide' | 'square'; title: string; sub?: string}
  | {k: 'mask'; media: Media[]; word: string; size: number; stretch?: number; sub?: string; kicker?: string}
  | {k: 'duo'; media: [Media, Media]; labels: [string, string]; title?: string}
  | {k: 'strips'; media: Media[]; title: string; sub?: string}
  | {k: 'grid'; media: Media[]; cols: number; title: string; sub?: string}
  | {k: 'menu'; title: string; items: [string, string][]; media: Media}
  | {k: 'anatomy'; media: Media; labels: [string, string, string, string]; title: string}
  | {k: 'hours'; media: Media[]; lines: string[]; title: string}
  | {k: 'quote'; media: Media; quote: string; by: string}
  | {k: 'full'; media: Media[]; kicker?: string; title: string; sub?: string; at?: 'top' | 'bottom'}
  | {k: 'type'; lines: string[]; size: number; sub?: string; kicker?: string}
  | {k: 'polaroid'; media: [Media, Media, Media]; notes: [string, string, string]; title: string}
  | {k: 'thisor'; media: [Media, Media]; labels: [string, string]; title: string}
  | {k: 'receipt'; items: [string, string][]; total: string; footer: string}
  | {k: 'timeline'; steps: [string, string, Media][]; title: string}
);

// ───────────────────────────── pieces
const isVideo = (m: Media) => m.src.endsWith('.mp4');
const M: React.FC<{m: Media}> = ({m}) => {
  const style: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${m.fx ?? 50}% ${m.fy ?? 50}%`,
    transform: `scale(${m.z ?? 1})`, transformOrigin: `${m.fx ?? 50}% ${m.fy ?? 50}%`};
  return isVideo(m)
    ? <OffthreadVideo src={staticFile(`videos/${m.src}`)} startFrom={Math.round((m.at ?? 0) * FPS)} muted style={style} />
    : <Img src={staticFile(`photos/${m.src}`)} style={style} />;
};
// several media one after another, equal hard cuts
const Cuts: React.FC<{media: Media[]; frames: number}> = ({media, frames}) => {
  const n = media.length, each = Math.floor(frames / n);
  return (
    <AbsoluteFill>
      {media.map((m, i) => (
        <Sequence key={i} from={i * each} durationInFrames={i === n - 1 ? frames - i * each : each} layout="none">
          <AbsoluteFill><M m={m} /></AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
const box = (b: {left: number; top: number; width: number; height: number}, extra: React.CSSProperties = {}): React.CSSProperties =>
  ({position: 'absolute', overflow: 'hidden', ...b, ...extra});
const mono = (size: number, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500,
  fontSize: size, letterSpacing: size >= 28 ? 4 : 6, textTransform: 'uppercase', color, ...extra});
const display = (size: number, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: size,
  textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.0, color, whiteSpace: 'pre-line', ...extra});
const italic = (size: number, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.serif, fontStyle: 'italic',
  fontSize: size, lineHeight: 1.25, color, whiteSpace: 'pre-line', ...extra});

const Corners: React.FC<{c?: [string, string, string, string]; ink: string}> = ({c, ink}) => c ? (
  <>
    <div style={{position: 'absolute', left: 80, right: 80, top: 262, display: 'flex', justifyContent: 'space-between', ...mono(22, ink)}}>
      <span style={{textTransform: c[0].startsWith('Sea') ? 'none' : 'uppercase'}}>{c[0]}</span><span>{c[1]}</span>
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 1548, display: 'flex', justifyContent: 'space-between', ...mono(22, ink)}}>
      <span>{c[2]}</span><span>{c[3]}</span>
    </div>
  </>
) : null;
const Frame: React.FC<{b: {left: number; top: number; width: number; height: number}; ink: string; round?: boolean; children: React.ReactNode}> = ({b, ink, round, children}) => (
  <div style={box(b, {outline: `2px solid ${ink}`, outlineOffset: 10, borderRadius: round ? '50%' : 0})}>{children}</div>
);

// ── word mask: the footage seen through a giant Skanaus word
const WordMask: React.FC<{id: string; word: string; size: number; stretch: number; y: number}> = ({id, word, size, stretch, y}) => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <clipPath id={id} clipPathUnits="userSpaceOnUse">
        {word.split('\n').map((w, i) => (
          <text key={i} x={540} y={y + i * size * 0.86} textAnchor="middle" fontFamily={fonts.display} fontSize={size}
            transform={`translate(540 0) scale(${stretch} 1) translate(-540 0)`}>{w}</text>
        ))}
      </clipPath>
    </defs>
  </svg>
);

// ───────────────────────────── the story
export const CreativeStory: React.FC<{s: CreativeSpec}> = ({s}) => {
  const f = useCurrentFrame();
  const frames = Math.round(s.sec * FPS);
  const ink = s.ink;
  let body: React.ReactNode = null;
  switch (s.k) {
    case 'page': {
      const b = s.box === 'wide' ? {left: 80, top: 520, width: 920, height: 640} : s.box === 'square' ? {left: 130, top: 360, width: 820, height: 820}
        : {left: 140, top: 340, width: 800, height: 960};
      const ty = b.top + b.height + 50;
      body = (
        <>
          <Frame b={b} ink={ink}><Cuts media={s.media} frames={frames} /></Frame>
          <div style={{position: 'absolute', left: 60, right: 60, top: ty, textAlign: 'center'}}>
            <div style={display(s.title.length > 12 ? 72 : 96, ink)}>{s.title}</div>
            {s.sub ? <div style={{...mono(24, ink), marginTop: 18}}>{s.sub}</div> : null}
          </div>
        </>
      );
      break;
    }
    case 'mask': {
      // two beats: the word holds the footage (a typographic reveal), then a hard cut to the footage itself full-bleed
      const lines = s.word.split('\n').length;
      const y = 1000 + s.size * 0.33 - (lines - 1) * s.size * 0.43;
      const cut = Math.round(frames * 0.45);
      body = f < cut ? (
        <>
          <WordMask id={`cm-${s.id}`} word={s.word} size={s.size} stretch={s.stretch ?? 1} y={y} />
          <AbsoluteFill style={{clipPath: `url(#cm-${s.id})`}}><Cuts media={s.media} frames={frames} /></AbsoluteFill>
          {s.kicker ? <div style={{position: 'absolute', left: 0, right: 0, top: y - s.size * 0.8 - 40, textAlign: 'center', ...mono(26, ink)}}>{s.kicker}</div> : null}
          {s.sub ? <div style={{position: 'absolute', left: 0, right: 0, top: y + (lines - 1) * s.size * 0.86 + 70, textAlign: 'center', ...mono(28, ink)}}>{s.sub}</div> : null}
        </>
      ) : (
        <>
          <Cuts media={s.media} frames={frames} />
          <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(11,11,11,0.75) 0%, rgba(11,11,11,0) 34%)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 270, textAlign: 'center'}}>
            {s.kicker ? <div style={mono(24, O)}>{s.kicker}</div> : null}
            <div style={{...display(96, I), marginTop: 10}}>{s.word.replace('\n', ' ')}</div>
            {s.sub ? <div style={{...mono(24, I), marginTop: 14}}>{s.sub}</div> : null}
          </div>
        </>
      );
      break;
    }
    case 'duo': {
      const a = {left: 140, top: 330, width: 800, height: 520}, c = {left: 140, top: 1010, width: 800, height: 520};
      body = (
        <>
          <Frame b={a} ink={ink}><M m={s.media[0]} /></Frame>
          <Frame b={c} ink={ink}><M m={s.media[1]} /></Frame>
          <div style={{position: 'absolute', left: 140, right: 140, top: 888, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <span style={display(64, ink)}>{s.labels[0]}</span>
            <span style={{...mono(22, ink)}}>{s.title ?? ''}</span>
            <span style={display(64, ink)}>{s.labels[1]}</span>
          </div>
        </>
      );
      break;
    }
    case 'strips': {
      const n = s.media.length, g = 14, W = 920, w = (W - g * (n - 1)) / n;
      const shown = Math.min(n, 1 + Math.floor(f / BEAT));
      body = (
        <>
          {s.media.slice(0, shown).map((m, i) => (
            <div key={i}>
              <div style={box({left: 80 + i * (w + g), top: 330, width: w, height: 1000})}><M m={m} /></div>
              <div style={{position: 'absolute', left: 80 + i * (w + g), width: w, top: 1350, textAlign: 'center', ...mono(24, ink)}}>{`0${i + 1}`}</div>
            </div>
          ))}
          <div style={{position: 'absolute', left: 0, right: 0, top: 1410, textAlign: 'center'}}>
            <div style={display(96, ink)}>{s.title}</div>
            {s.sub ? <div style={{...mono(24, ink), marginTop: 14}}>{s.sub}</div> : null}
          </div>
        </>
      );
      break;
    }
    case 'grid': {
      const cols = s.cols, rows = Math.ceil(s.media.length / cols), g = 10, W = 920;
      const w = (W - g * (cols - 1)) / cols, H = 1060, h = (H - g * (rows - 1)) / rows;
      const shown = Math.min(s.media.length, 1 + Math.floor(f / (BEAT * 0.7)));
      body = (
        <>
          {s.media.slice(0, shown).map((m, i) => (
            <div key={i} style={box({left: 80 + (i % cols) * (w + g), top: 330 + Math.floor(i / cols) * (h + g), width: w, height: h})}><M m={m} /></div>
          ))}
          <div style={{position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center'}}>
            <div style={display(88, ink)}>{s.title}</div>
            {s.sub ? <div style={{...mono(24, ink), marginTop: 14}}>{s.sub}</div> : null}
          </div>
        </>
      );
      break;
    }
    case 'menu': {
      body = (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
            <div style={display(120, ink)}>{s.title}</div>
            <div style={{width: 120, height: 2, background: O, margin: '28px auto 0'}} />
          </div>
          <div style={{position: 'absolute', left: 110, right: 110, top: 560, textAlign: 'center'}}>
            {s.items.map(([name, note], i) => (
              <div key={i} style={{marginBottom: 34}}>
                <div style={display(52, ink)}>{name}</div>
                <div style={{...italic(32, ink), marginTop: 6}}>{note}</div>
              </div>
            ))}
          </div>
          <Frame b={{left: 390, top: 1250, width: 300, height: 300}} ink={ink} round><M m={s.media} /></Frame>
        </>
      );
      break;
    }
    case 'anatomy': {
      const L = s.labels;
      const lab = (t: string, st: React.CSSProperties) => <div style={{position: 'absolute', ...mono(24, ink), ...st}}>{t}</div>;
      body = (
        <>
          <Frame b={{left: 190, top: 560, width: 700, height: 700}} ink={ink} round><M m={s.media} /></Frame>
          <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
            <g stroke={ink} strokeWidth={2}>
              <line x1={300} y1={520} x2={300} y2={470} /><line x1={780} y1={520} x2={780} y2={470} />
              <line x1={300} y1={1300} x2={300} y2={1350} /><line x1={780} y1={1300} x2={780} y2={1350} />
            </g>
          </svg>
          {lab(L[0], {left: 160, top: 430})}{lab(L[1], {right: 160, top: 430, textAlign: 'right'})}
          {lab(L[2], {left: 160, top: 1365})}{lab(L[3], {right: 160, top: 1365, textAlign: 'right'})}
          <div style={{position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center', ...display(72, ink)}}>{s.title}</div>
        </>
      );
      break;
    }
    case 'hours': {
      body = (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', ...display(80, ink)}}>{s.title}</div>
          {s.lines.map((t, i) => (
            <div key={i}>
              <Frame b={{left: 110, top: 440 + i * 510, width: 860, height: 330}} ink={ink}><M m={s.media[i % s.media.length]} /></Frame>
              <div style={{position: 'absolute', left: 0, right: 0, top: 800 + i * 510, textAlign: 'center', ...display(104, ink)}}>{t}</div>
            </div>
          ))}
        </>
      );
      break;
    }
    case 'full': {
      const bottomText = s.at === 'bottom';
      body = (
        <>
          <Cuts media={s.media} frames={frames} />
          <AbsoluteFill style={{background: bottomText
            ? 'linear-gradient(to top, rgba(11,11,11,0.78) 0%, rgba(11,11,11,0) 40%)'
            : 'linear-gradient(to bottom, rgba(11,11,11,0.78) 0%, rgba(11,11,11,0) 36%)'}} />
          <div style={{position: 'absolute', left: 60, right: 60, textAlign: 'center', ...(bottomText ? {bottom: 380} : {top: 270})}}>
            {s.kicker ? <div style={mono(24, O)}>{s.kicker}</div> : null}
            <div style={{...display(s.title.length > 16 ? 70 : 88, I), marginTop: 10}}>{s.title}</div>
            {s.sub ? <div style={{...mono(24, I), marginTop: 14}}>{s.sub}</div> : null}
          </div>
        </>
      );
      break;
    }
    case 'type': {
      body = (
        <div style={{position: 'absolute', left: 60, right: 60, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: -60}}>
          {s.kicker ? <div style={{...mono(26, ink), marginBottom: 36}}>{s.kicker}</div> : null}
          {s.lines.map((l, i) => <div key={i} style={{...display(s.size, ink), lineHeight: 0.98}}>{l}</div>)}
          {s.sub ? <div style={{...mono(26, ink), marginTop: 44}}>{s.sub}</div> : null}
        </div>
      );
      break;
    }
    case 'polaroid': {
      const pos = [{left: 130, top: 340, rot: -7}, {left: 420, top: 520, rot: 5}, {left: 190, top: 770, rot: -2}];
      const shown = Math.min(3, 1 + Math.floor(f / (BEAT * 1.6)));
      body = (
        <>
          {s.media.slice(0, shown).map((m, i) => (
            <div key={i} style={{position: 'absolute', left: pos[i].left, top: pos[i].top, width: 470, padding: '22px 22px 0', background: I,
              transform: `rotate(${pos[i].rot}deg)`, boxShadow: '0 18px 40px rgba(0,0,0,0.35)'}}>
              <div style={{height: 480, overflow: 'hidden'}}><M m={m} /></div>
              <div style={{height: 86, display: 'flex', alignItems: 'center', justifyContent: 'center', ...italic(34, G)}}>{s.notes[i]}</div>
            </div>
          ))}
          <div style={{position: 'absolute', left: 0, right: 0, top: 1470, textAlign: 'center', ...display(64, ink)}}>{s.title}</div>
        </>
      );
      break;
    }
    case 'thisor': {
      const w = 440;
      body = (
        <>
          {s.media.map((m, i) => (
            <div key={i}>
              <Frame b={{left: 80 + i * (w + 40), top: 420, width: w, height: 900}} ink={ink}><M m={m} /></Frame>
              <div style={{position: 'absolute', left: 80 + i * (w + 40), width: w, top: 1360, textAlign: 'center', ...display(80, ink)}}>{s.labels[i]}</div>
            </div>
          ))}
          <div style={{position: 'absolute', left: 470, top: 790, width: 140, height: 140, borderRadius: '50%', background: O, display: 'flex',
            alignItems: 'center', justifyContent: 'center', ...italic(64, I), lineHeight: 1}}>o</div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', ...mono(26, ink)}}>{s.title}</div>
        </>
      );
      break;
    }
    case 'receipt': {
      const zig = Array.from({length: 25}, (_, i) => `${100 - (i * 100) / 24}% ${i % 2 ? 100 : 97.5}%`).join(', ');
      const dash = <div style={{borderTop: `3px dashed ${G}`, margin: '26px 0'}} />;
      body = (
        <div style={{position: 'absolute', left: 150, width: 780, top: 340, padding: '70px 60px 110px', background: I, color: G,
          clipPath: `polygon(0 0, 100% 0, 100% 97.5%, ${zig})`, boxShadow: '0 20px 50px rgba(0,0,0,0.3)'}}>
          <div style={{textAlign: 'center', fontFamily: fonts.display, fontSize: 80}}>Sea, Signora</div>
          <div style={{textAlign: 'center', ...mono(18, G), marginTop: 10}}>via fiori chiari, 32 · milano</div>
          {dash}
          {s.items.map(([a, b], i) => (
            <div key={i} style={{display: 'flex', justifyContent: 'space-between', ...mono(30, G), letterSpacing: 2, marginBottom: 26}}>
              <span>{a}</span><span>{b}</span>
            </div>
          ))}
          {dash}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <span style={mono(30, G)}>totale</span><span style={{...italic(48, O), fontWeight: 600}}>{s.total}</span>
          </div>
          {dash}
          <div style={{textAlign: 'center', ...mono(20, G)}}>{s.footer}</div>
          <div style={{display: 'flex', justifyContent: 'center', gap: 4, marginTop: 30}}>
            {Array.from({length: 44}, (_, i) => <div key={i} style={{width: [3, 6, 2, 4][i % 4], height: 90, background: G}} />)}
          </div>
        </div>
      );
      break;
    }
    case 'timeline': {
      const n = s.steps.length, top = 470, gapY = 270;
      body = (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', ...display(72, ink)}}>{s.title}</div>
          <div style={{position: 'absolute', left: 200, top: top + 20, width: 2, height: (n - 1) * gapY, background: ink}} />
          {s.steps.map(([t, label, m], i) => (
            <div key={i}>
              <div style={{position: 'absolute', left: 189, top: top + i * gapY + 9, width: 24, height: 24, borderRadius: '50%', background: O}} />
              <div style={{position: 'absolute', left: 240, top: top + i * gapY, ...mono(24, ink)}}>{t}</div>
              <div style={{position: 'absolute', left: 240, top: top + i * gapY + 40, ...display(60, ink)}}>{label}</div>
              <div style={box({left: 740, top: top + i * gapY - 20, width: 220, height: 220})}><M m={m} /></div>
            </div>
          ))}
        </>
      );
      break;
    }
    case 'quote': {
      body = (
        <>
          <Frame b={{left: 340, top: 340, width: 400, height: 500}} ink={ink}><M m={s.media} /></Frame>
          <div style={{position: 'absolute', left: 100, right: 100, top: 940, textAlign: 'center', ...italic(66, ink)}}>{`«${s.quote}»`}</div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1440, textAlign: 'center', ...mono(24, ink)}}>{`— ${s.by}`}</div>
        </>
      );
      break;
    }
  }
  return (
    <AbsoluteFill style={{background: s.bg}}>
      {body}
      <Corners c={s.corners} ink={ink} />
      {s.cta ? <Chip cta={s.cta} /> : null}
    </AbsoluteFill>
  );
};

// a story is a still (PNG) when nothing moves: photos only and no build
export const isStill = (s: CreativeSpec) => {
  const media: Media[] = 'media' in s ? (Array.isArray(s.media) ? s.media : [s.media]) : s.k === 'timeline' ? s.steps.map((x) => x[2]) : [];
  return !media.some(isVideo) && s.k !== 'polaroid' && s.k !== 'strips' && s.k !== 'grid' && !(s.k === 'page' && s.media.length > 1) && s.k !== 'mask';
};
