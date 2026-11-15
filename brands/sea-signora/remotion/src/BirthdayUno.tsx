import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// «UNO» — Sea, Signora's first birthday (12.11) as a creative reel in the brand identity (client 15.11: «more dynamic,
// more interesting, richer, more creative, in Sea, Signora's identity»). Everything sits on the bar grid of our own
// arranged track (scripts/make_reel_track.py «uno», 124 bpm, 31 bars = 60 s):
//  · Antonio at the aquarium says it himself; his words come up as Skanaus captions above his head (it + en mono);
//  · on «cin cin» the drop: a brand-orange «1» filled with the spritz pour, and we fly through it;
//  · a recap, not an announcement (client 15.11): no programme, no times — two giant Skanaus words carry the night,
//    TONNO and TORTA, with the footage inside the letters; we fly through the word into the moment;
//  · triptychs, a 2×2 table of plates built on the beat, punch-ins and beat pulses, a flash on every drop;
//  · finale: Antonio laughing closes back into the «1» on orange — THE FIRST OF MANY.
// Video only (muted): the voice and the track are mixed afterwards (tools/birthday_mix.py), then mastered to −14 LUFS.

export const FPS = 60;
export const BPM = 124;
const BAR = (240 / BPM) * FPS; // 116.13 frames
const BEAT = BAR / 4;
const fr = (bars: number) => Math.round(bars * BAR);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const GRADE = 'contrast(1.08) saturate(1.2) brightness(1.03)';

type Src = {clip: string; at: number; zoom?: [number, number]; fx?: number; fy?: number; rate?: number};
type Label = {time: string; word: string; bars: number};
type Seg =
  | {k: 'intro'; bars: number; v: Src}
  | {k: 'clip'; bars: number; v: Src; label?: Label; flash?: boolean; pulse?: boolean}
  | {k: 'one'; bars: number; v: Src; label?: Label}
  | {k: 'type'; bars: number; text: string; sub: string; bg: string; ink?: string; v: Src}
  | {k: 'split'; bars: number; vs: Src[]; dir?: 'v' | 'h'; flash?: boolean}
  | {k: 'grid'; bars: number; vs: Src[]; label?: Label}
  | {k: 'finale'; bars: number; v: Src};

// ───────────────────────────── the edit (bars)
export const UNO: Seg[] = [
  {k: 'intro', bars: 5, v: {clip: 'IMG_2591', at: 1.36}},
  // the welcome, spritz and guests (drop A)
  {k: 'one', bars: 0.5, v: {clip: 'IMG_2673', at: 2.2}},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2673', at: 2.2 + 0.5 * 240 / BPM, zoom: [1.06, 1.14], fy: 40}, flash: true},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2568', at: 8.1, zoom: [1.0, 1.18], fx: 45, fy: 55}},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2607', at: 2.9}, pulse: true},
  {k: 'split', bars: 1, vs: [{clip: 'IMG_2624', at: 0.1}, {clip: 'IMG_2647', at: 8.7}, {clip: 'IMG_2633', at: 1.1}]},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2578', at: 2.3, zoom: [1.12, 1.0]}, pulse: true},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2626', at: 3.7}},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2673', at: 6.6, zoom: [1.0, 1.1], fy: 30}},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2619', at: 0.4}, pulse: true},
  // TONNO — the tuna show (fill, then drop B)
  {k: 'type', bars: 1, text: 'Tonno', sub: 'the tuna show', bg: brandPalette.green5605, v: {clip: 'IMG_2583', at: 11.0}},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2583', at: 11.0 + 240 / BPM}, flash: true},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2611', at: 0.2, zoom: [1.0, 1.25], fx: 62, fy: 48}},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2576', at: 3.9}, pulse: true},
  {k: 'clip', bars: 1, v: {clip: 'IMG_2640', at: 29.6, zoom: [1.0, 1.16], fy: 45}},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2671', at: 12.3, zoom: [1.1, 1.0]}},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2642', at: 8.0}, pulse: true},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2663', at: 0.0, zoom: [1.0, 1.12]}},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2689', at: 1.5}, pulse: true},
  {k: 'split', bars: 1, dir: 'h', vs: [{clip: 'IMG_2641', at: 0.3}, {clip: 'IMG_2703', at: 0.2}]},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2674', at: 16.0, zoom: [1.0, 1.1]}},
  {k: 'clip', bars: 1, v: {clip: 'IMG_2674', at: 3.2, zoom: [1.0, 1.08], fy: 35}},
  // a tavola (groove)
  {k: 'grid', bars: 1, vs: [{clip: 'IMG_2699', at: 1.0}, {clip: 'IMG_2705', at: 8.7}, {clip: 'IMG_2703', at: 0.6}, {clip: 'IMG_2674', at: 17.0}]},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2690', at: 9.5, zoom: [1.12, 1.0]}},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2699', at: 8.3}},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2692', at: 0.6}, pulse: true},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2687', at: 0.4}},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2680', at: 7.3, zoom: [1.0, 1.1]}},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2684', at: 0.4}},
  // TORTA — the cake (breakdown, build, drop C)
  {k: 'type', bars: 1, text: 'Torta', sub: 'one pearl, one year', bg: brandPalette.orange158, ink: brandPalette.green5605, v: {clip: 'IMG_2716', at: 2.0}},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2716', at: 2.0 + 240 / BPM}, flash: true},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2713', at: 8.6}},
  {k: 'clip', bars: 1, v: {clip: 'IMG_2719', at: 3.4, zoom: [1.0, 1.12], fy: 55}},
  {k: 'clip', bars: 1, v: {clip: 'IMG_2719', at: 13.5}, flash: true},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2719', at: 16.4}, pulse: true},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2719', at: 10.0}, pulse: true},
  {k: 'clip', bars: 0.5, v: {clip: 'IMG_2714', at: 2.3, zoom: [1.0, 1.1]}},
  {k: 'clip', bars: 1.5, v: {clip: 'IMG_2719', at: 33.3, zoom: [1.0, 1.08], fy: 35}},
  {k: 'finale', bars: 2, v: {clip: 'IMG_2719', at: 33.3 + 1.5 * 240 / BPM}},
];

export const unoFrames = (segs: Seg[]) => fr(segs.reduce((s, x) => s + x.bars, 0)) + 30;

// Antonio's words (clip time, from the transcript) → captions above his head
const CAPS: {a: number; b: number; it: string; en: string}[] = [
  {a: 1.6, b: 3.7, it: 'Finalmente', en: 'finally'},
  {a: 3.7, b: 4.9, it: 'Un anno', en: 'one year'},
  {a: 4.9, b: 6.0, it: 'Il nostro\ncompleanno', en: "it's our birthday"},
  {a: 6.0, b: 7.5, it: 'Sea, Signora', en: 'milano'},
  {a: 7.5, b: 8.75, it: 'Via Fiori Chiari', en: 'brera'},
  {a: 8.75, b: 10.4, it: 'A tutti', en: 'to all of you'},
  {a: 10.4, b: 11.2, it: 'Cin cin!', en: ''},
];

// ───────────────────────────── building blocks
const Clip: React.FC<{v: Src; dur: number; style?: React.CSSProperties}> = ({v, dur, style}) => {
  const f = useCurrentFrame();
  const z = v.zoom ? interpolate(f, [0, dur], v.zoom, {...clamp, easing: Easing.inOut(Easing.quad)}) : 1;
  return (
    <AbsoluteFill style={{overflow: 'hidden', ...style}}>
      <OffthreadVideo src={staticFile(`bd/${v.clip}.mp4`)} startFrom={Math.round(v.at * FPS)} muted playbackRate={v.rate ?? 1}
        style={{width: '100%', height: '100%', objectFit: 'cover', filter: GRADE, transform: `scale(${z})`,
          transformOrigin: `${v.fx ?? 50}% ${v.fy ?? 50}%`}} />
    </AbsoluteFill>
  );
};

const Pulse: React.FC<{children: React.ReactNode; on?: boolean}> = ({children, on}) => {
  const f = useCurrentFrame();
  const k = on ? 1 + 0.035 * Math.exp(-(f % BEAT) / 7) : 1;
  return <AbsoluteFill style={{transform: `scale(${k})`}}>{children}</AbsoluteFill>;
};

const Flash: React.FC<{color?: string}> = ({color = colors.ivory}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: color, opacity: interpolate(f, [0, 7], [0.85, 0], clamp)}} />;
};

// chapter label: orange mono time + a big ivory word, top third, on a soft night gradient
const ChapterLabel: React.FC<{l: Label}> = ({l}) => {
  const f = useCurrentFrame();
  const end = fr(l.bars);
  const up = (d: number) => interpolate(f, [d, d + 12], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const out = interpolate(f, [end - 10, end], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(11,11,11,0.72) 0%, rgba(11,11,11,0) 34%)'}} />
      <div style={{position: 'absolute', left: 72, top: 280, color: colors.ivory}}>
        <div style={{overflow: 'hidden'}}>
          <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 30, letterSpacing: 6, color: brandPalette.orange158,
            textTransform: 'uppercase', transform: `translateY(${up(0) * 110}%)`}}>{l.time}</div>
        </div>
        <div style={{overflow: 'hidden', marginTop: 6}}>
          <div style={{fontFamily: fonts.display, fontSize: 112, lineHeight: 1, textTransform: 'uppercase', letterSpacing: 1,
            transform: `translateY(${up(4) * 110}%)`}}>{l.word}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// video seen through a text shape (SVG clip path in user space); lines = [text, baseline y]
type Lines = [string, number][];
const glyphs = (lines: Lines, size: number, cy: number, scale: number, stretch: number) => (
  lines.map(([t, y], i) => (
    <text key={i} x={540} y={y} textAnchor="middle" fontFamily={fonts.display} fontSize={size}
      transform={`translate(540 ${cy}) scale(${scale * stretch} ${scale}) translate(-540 ${-cy})`}>{t}</text>
  ))
);
const TextMask: React.FC<{id: string; lines: Lines; size: number; cy: number; scale: number; stretch?: number}> = ({id, lines, size, cy, scale, stretch = 1}) => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs><clipPath id={id} clipPathUnits="userSpaceOnUse">{glyphs(lines, size, cy, scale, stretch)}</clipPath></defs>
  </svg>
);
const TextOutline: React.FC<{lines: Lines; size: number; cy: number; scale: number; stretch?: number; color: string; opacity: number}> = ({lines, size, cy, scale, stretch = 1, color, opacity}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity}}>
    <g fill="none" stroke={color} strokeWidth={2.2 / scale}>{glyphs(lines, size, cy, scale, stretch)}</g>
  </svg>
);

const Intro: React.FC<{s: Extract<Seg, {k: 'intro'}>}> = ({s}) => {
  const f = useCurrentFrame();
  const t = s.v.at + f / FPS;
  const cap = CAPS.find((c) => t >= c.a && t < c.b);
  const pop = cap ? interpolate(t, [cap.a, cap.a + 0.12], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))}) : 0;
  return (
    <AbsoluteFill>
      <Clip v={s.v} dur={fr(s.bars)} />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(11,11,11,0.55) 0%, rgba(11,11,11,0) 30%)'}} />
      {cap ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 268, textAlign: 'center', color: colors.ivory,
          transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop}}>
          <div style={{fontFamily: fonts.display, fontSize: cap.it.includes('\n') ? 76 : 96, lineHeight: 0.98, whiteSpace: 'pre-line',
            textTransform: cap.it.startsWith('Sea') ? 'none' : 'uppercase'}}>{cap.it}</div>
          {cap.en ? <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 26, letterSpacing: 5, marginTop: 12, color: brandPalette.orange158,
            textTransform: 'uppercase'}}>{cap.en}</div> : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// a giant «1» (or a time) on a brand colour with the footage inside, then we fly through it into the next shot
const Through: React.FC<{id: string; lines: Lines; size: number; cy: number; stretch?: number; bg: string; v: Src; dur: number;
  hold: number; sub?: string; subY?: number; ink?: string; settle?: boolean; outline?: boolean}> = ({id, lines, size, cy, stretch, bg, v, dur, hold, sub, subY, ink, settle, outline}) => {
  const f = useCurrentFrame();
  const enter = settle ? interpolate(f, [0, 10], [0.82, 1], {...clamp, easing: Easing.out(Easing.back(1.6))}) : 1;
  const drift = 1 + 0.06 * interpolate(f, [0, hold], [0, 1], clamp);
  const fly = 1 + 40 * interpolate(f, [hold, dur], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const sc = enter * drift * fly;
  return (
    <AbsoluteFill style={{background: bg}}>
      <TextMask id={id} lines={lines} size={size} cy={cy} scale={sc} stretch={stretch} />
      <AbsoluteFill style={{clipPath: `url(#${id})`}}><Clip v={v} dur={dur} /></AbsoluteFill>
      {outline ? <TextOutline lines={lines} size={size} cy={cy} scale={sc} stretch={stretch} color={ink ?? colors.ivory}
        opacity={0.7 * interpolate(f, [hold, hold + 6], [1, 0], clamp)} /> : null}
      <AbsoluteFill style={{opacity: interpolate(f, [hold + 10, dur - 3], [0, 1], clamp)}}><Clip v={v} dur={dur} /></AbsoluteFill>
      {sub ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: subY ?? 1460, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500,
          fontSize: 36, letterSpacing: 10, textTransform: 'uppercase', color: ink ?? colors.ivory,
          opacity: interpolate(f, [4, 14], [0, 1], clamp) * interpolate(f, [hold - 4, hold + 2], [1, 0], clamp)}}>{sub}</div>
      ) : null}
    </AbsoluteFill>
  );
};

const Split: React.FC<{s: Extract<Seg, {k: 'split'}>}> = ({s}) => {
  const f = useCurrentFrame();
  const n = s.vs.length; const h = s.dir === 'h';
  return (
    <AbsoluteFill style={{background: colors.night}}>
      {s.vs.map((v, i) => {
        const d = i * Math.round(BEAT);
        const p = interpolate(f, [d, d + 10], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
        const size = (h ? 1920 : 1080) / n;
        const box: React.CSSProperties = h
          ? {left: 0, right: 0, top: i * size + (i ? 4 : 0), height: size - (i ? 4 : 0), transform: `translateX(${(i % 2 ? 1 : -1) * p * 100}%)`}
          : {top: 0, bottom: 0, left: i * size + (i ? 4 : 0), width: size - (i ? 4 : 0), transform: `translateY(${(i % 2 ? -1 : 1) * p * 100}%)`};
        return (
          <div key={i} style={{position: 'absolute', overflow: 'hidden', ...box}}>
            <Sequence from={d} layout="none"><Clip v={v} dur={fr(s.bars)} /></Sequence>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Grid: React.FC<{s: Extract<Seg, {k: 'grid'}>}> = ({s}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: colors.night}}>
      {s.vs.map((v, i) => {
        const d = i * Math.round(BEAT);
        const p = interpolate(f, [d, d + 9], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        return (
          <div key={i} style={{position: 'absolute', overflow: 'hidden', left: (i % 2) * 543, top: Math.floor(i / 2) * 963, width: 537, height: 957,
            opacity: p, transform: `scale(${1.12 - 0.12 * p})`}}>
            <Sequence from={d} layout="none"><Clip v={v} dur={fr(s.bars)} /></Sequence>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Finale: React.FC<{s: Extract<Seg, {k: 'finale'}>}> = ({s}) => {
  const f = useCurrentFrame();
  const CLOSE = 22;
  const z = 0.78 * (1 + 40 * (1 - interpolate(f, [0, CLOSE], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)})));
  const line = (at: number) => interpolate(f, [at, at + 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const tr = (at: number) => ({opacity: line(at), transform: `translateY(${(1 - line(at)) * 18}px)`});
  return (
    <AbsoluteFill style={{background: brandPalette.orange158}}>
      <TextMask id="uno-close" lines={[['1', 1430]]} size={1500} cy={960} scale={z} stretch={1.32} />
      <AbsoluteFill style={{clipPath: 'url(#uno-close)'}}><Clip v={s.v} dur={fr(s.bars)} /></AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center', color: brandPalette.green5605}}>
        <div style={{fontFamily: fonts.display, fontSize: 80, textTransform: 'uppercase', letterSpacing: 2, ...tr(CLOSE - 6)}}>The first of many</div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 24, letterSpacing: 6, textTransform: 'uppercase', marginTop: 24, ...tr(CLOSE + 4)}}>one year of</div>
        <div style={{fontFamily: fonts.display, fontSize: 80, letterSpacing: 1, marginTop: 8, color: colors.ivory, ...tr(CLOSE + 9)}}>Sea, Signora</div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 22, letterSpacing: 6, marginTop: 22, ...tr(CLOSE + 16)}}>GRAZIE A TUTTI</div>
      </div>
    </AbsoluteFill>
  );
};

const Segment: React.FC<{s: Seg; i: number}> = ({s, i}) => {
  const dur = fr(s.bars);
  switch (s.k) {
    case 'intro': return <Intro s={s} />;
    case 'clip': return (
      <AbsoluteFill>
        <Pulse on={s.pulse}><Clip v={s.v} dur={dur} /></Pulse>
        {s.flash ? <Flash /> : null}
      </AbsoluteFill>
    );
    case 'one': return (
      <AbsoluteFill>
        <Through id={`one-${i}`} lines={[['1', 1430]]} size={1500} cy={960} stretch={1.32} bg={brandPalette.orange158} v={s.v} dur={dur} hold={Math.round(dur * 0.55)} settle />
        <Flash color={colors.ivory} />
      </AbsoluteFill>
    );
    case 'type': return <Through id={`type-${i}`} lines={[[s.text.toUpperCase(), 1180]]} size={640} cy={960} stretch={0.5} bg={s.bg} v={s.v} dur={dur} hold={Math.round(dur * 0.7)} sub={s.sub} subY={1280} ink={s.ink} settle outline />;
    case 'split': return <AbsoluteFill><Split s={s} />{s.flash ? <Flash /> : null}</AbsoluteFill>;
    case 'grid': return <Grid s={s} />;
    case 'finale': return <Finale s={s} />;
  }
};

export const BirthdayUno: React.FC<{segs?: Seg[]}> = ({segs = UNO}) => {
  let at = 0;
  const parts: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];
  segs.forEach((s, i) => {
    const a = fr(at), b = fr(at + s.bars);
    parts.push(<Sequence key={i} from={a} durationInFrames={i === segs.length - 1 ? b - a + 30 : b - a}><Segment s={s} i={i} /></Sequence>);
    const l = 'label' in s ? s.label : undefined;
    if (l) labels.push(<Sequence key={`l${i}`} from={a + (s.k === 'one' ? fr(s.bars) : 0)} durationInFrames={fr(l.bars)}><ChapterLabel l={l} /></Sequence>);
    at += s.bars;
  });
  return <AbsoluteFill style={{background: colors.night}}>{parts}{labels}</AbsoluteFill>;
};
