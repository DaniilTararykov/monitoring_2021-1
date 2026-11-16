import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Week of 23.11 (client 16.11: «20 сторис, креативные, разнообразные, лучшие кадры и ровно всё, в айдентике, из последних
// папок»). Best frames of the latest folders: the photographer's shoot, the Pixieset gallery (kitchen fire, the room, the bar,
// the team portraits, the cover shot of the room under the painting), the room / kitchen clips. 20 new formats, none used
// before: contents page, duotone poster, blinds, matchbook, plates landing on the table, team cards, coaster, Venn, Milan
// street plaque, business card, menu scroll, diary, zoom, key tag, ticker bands, tile mosaic, flip book, napkin note,
// 3D cube, a fragrance. Everything on a grid, inside the 250 / 340 px safe zones, no text over faces or dishes.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory, N = '#0B0B0B', MU = brandPalette.mustard605;
type M = {src: string; at?: number; fx?: number; fy?: number; rate?: number};
const Media: React.FC<{m: M; style?: React.CSSProperties}> = ({m, style}) => {
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${m.fx ?? 50}% ${m.fy ?? 50}%`, ...style};
  return m.src.endsWith('.mp4') ? <OffthreadVideo src={staticFile(`videos/${m.src}`)} startFrom={Math.round((m.at ?? 0) * FPS)} playbackRate={m.rate ?? 1} muted style={st} />
    : <Img src={staticFile(`photos/${m.src}`)} style={st} />;
};
const Box: React.FC<{b: React.CSSProperties; m: M; st?: React.CSSProperties}> = ({b, m, st}) => (
  <div style={{position: 'absolute', overflow: 'hidden', ...b}}><Media m={m} style={st} /></div>
);
const p = (n: string, o: Partial<M> = {}): M => ({src: `${n}.jpg`, ...o});
const v = (n: string, at: number, o: Partial<M> = {}): M => ({src: `${n}.mp4`, at, ...o});
const mono = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: size,
  letterSpacing: size >= 28 ? 3 : 5, textTransform: 'uppercase', color, ...x});
const disp = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: size,
  textTransform: 'uppercase', lineHeight: 1, letterSpacing: 1, color, whiteSpace: 'pre-line', ...x});
const mark = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: size, color, lineHeight: 1, whiteSpace: 'pre-line', ...x});
const ital = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.serif, fontStyle: 'italic',
  fontSize: size, lineHeight: 1.25, color, whiteSpace: 'pre-line', ...x});
const serif = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.serif, fontSize: size, lineHeight: 1.2, color, ...x});
const center: React.CSSProperties = {position: 'absolute', left: 0, right: 0, textAlign: 'center'};
const ip = (f: number, a: number, b: number, c = 0, d = 1, e: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const pop = (f: number, at: number) => (f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping: 13, stiffness: 150}}));
const io = Easing.inOut(Easing.cubic);

// 1 · contents page of the evening
const Sommario: React.FC = () => {
  const f = useCurrentFrame();
  const rows: [string, string, string, M][] = [['04', 'Raw bar', 'carpaccio, tartare, red prawns', p('w11/f25', {fy: 50})],
    ['12', 'Pasta', 'fusillone, tagliolini, risotto', p('w11/f109')], ['20', 'The bar', 'drinks at the counter', p('w12/bo287', {fy: 45})],
    ['28', 'The room', 'candles, aquarium, Brera', p('w12/bo16', {fx: 30})]];
  return (
    <AbsoluteFill style={{background: I}}>
      <div style={{position: 'absolute', left: 90, top: 285, ...mono(18, O)}}>sea, signora · tonight's issue</div>
      <div style={{position: 'absolute', left: 84, top: 325, ...disp(120, G, {letterSpacing: 6})}}>CONTENTS</div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 470, height: 4, background: G}} />
      {rows.map(([n, t, s, m], i) => {
        const a = ip(f, 12 + i * 12, 30 + i * 12);
        return (
          <div key={n} style={{position: 'absolute', left: 90, right: 90, top: 500 + i * 250, height: 230, display: 'flex', alignItems: 'center', gap: 34,
            borderBottom: i < 3 ? `2px solid rgba(27,47,28,0.25)` : 'none', opacity: a, transform: `translateX(${(1 - a) * 60}px)`}}>
            <div style={{width: 120, ...serif(96, O)}}>{n}</div>
            <div style={{flex: 1}}>
              <div style={disp(60, G)}>{t}</div>
              <div style={{...ital(36, G), marginTop: 10}}>{s}</div>
            </div>
            <div style={{width: 200, height: 200, overflow: 'hidden', borderRadius: 4}}><Media m={m} /></div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 2 · duotone poster: fire in the open kitchen
const Fuoco: React.FC = () => {
  const f = useCurrentFrame();
  const c1 = [27, 47, 28].map((x) => x / 255), c2 = [239, 120, 24].map((x) => x / 255);
  const row = (k: number) => `${(c2[k] - c1[k]) * 0.2126} ${(c2[k] - c1[k]) * 0.7152} ${(c2[k] - c1[k]) * 0.0722} 0 ${c1[k]}`;
  return (
    <AbsoluteFill style={{background: G}}>
      <svg width={0} height={0} style={{position: 'absolute'}}><filter id="duo" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values={`${row(0)} ${row(1)} ${row(2)} 0 0 0 1 0`} />
        <feComponentTransfer><feFuncR type="gamma" exponent="0.9" /><feFuncG type="gamma" exponent="0.9" /><feFuncB type="gamma" exponent="0.9" /></feComponentTransfer>
      </filter></svg>
      <div style={{position: 'absolute', left: 0, top: 620, width: 1080, height: 1300, overflow: 'hidden'}}>
        <Img src={staticFile('photos/w12/bo165.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', filter: 'url(#duo) contrast(1.15)',
          transform: `scale(${1.05 + f / 2000})`}} />
      </div>
      <div style={{position: 'absolute', left: 80, top: 285, ...mono(20, SA)}}>open kitchen</div>
      <div style={{position: 'absolute', left: 72, top: 320, ...disp(230, O, {letterSpacing: 8}), clipPath: `inset(0 ${100 - ip(f, 6, 40, 0, 100)}% 0 0)`}}>FIRE</div>
      <div style={{position: 'absolute', left: 80, top: 560, width: 920, display: 'flex', justifyContent: 'space-between', ...mono(18, I), opacity: ip(f, 30, 45)}}>
        <span>sea, signora</span><span>via fiori chiari 32</span>
      </div>
    </AbsoluteFill>
  );
};

// 3 · the blinds open on the room
const Persiane: React.FC = () => {
  const f = useCurrentFrame();
  const n = 16, h = 1920 / n;
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('w10/kf0111', 8)} />
      <div style={{position: 'absolute', inset: 0, perspective: 1600}}>
        {Array.from({length: n}, (_, i) => {
          const a = ip(f, 24 + i * 2.5, 52 + i * 2.5, 0, 90, io);
          return <div key={i} style={{position: 'absolute', left: 0, right: 0, top: i * h, height: h, transformOrigin: '50% 50%', transform: `rotateX(${a}deg)`, opacity: 1 - ip(f, 48 + i * 2.5, 56 + i * 2.5),
            background: `linear-gradient(${SA}, #b5ab95)`, borderBottom: '2px solid rgba(0,0,0,0.12)'}} />;
        })}
      </div>
      <div style={{opacity: 1 - ip(f, 18, 28)}}>
        <div style={{...center, top: 820, ...mono(22, G)}}>sea, signora</div>
        <div style={{...center, top: 870, ...disp(130, G, {letterSpacing: 6})}}>GOOD EVENING</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 560, background: 'linear-gradient(rgba(11,11,11,0.7), rgba(11,11,11,0))', opacity: ip(f, 80, 95)}} />
      <div style={{...center, top: 285, ...ital(72, I), opacity: ip(f, 85, 100)}}>open till midnight</div>
      <div style={{...center, top: 390, ...mono(20, I), opacity: ip(f, 95, 110)}}>via fiori chiari 32 · brera</div>
    </AbsoluteFill>
  );
};

// 4 · matchbook: strike for dinner
const Fiammiferi: React.FC = () => {
  const f = useCurrentFrame();
  const t = ip(f, 30, 70, 0, 1, io);
  return (
    <AbsoluteFill style={{background: O}}>
      <div style={{...center, top: 285, ...mono(20, G)}}>light up the evening</div>
      <div style={{...center, top: 325, ...ital(72, I)}}>strike for dinner</div>
      <div style={{position: 'absolute', left: 170, width: 740, top: 560 + t * 0, height: 460 + t * 420, overflow: 'visible'}}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 60 + t * 400, height: 400, background: I, borderRadius: 6, overflow: 'hidden', boxShadow: '0 10px 24px rgba(0,0,0,0.25)'}}>
          <div style={{position: 'absolute', inset: 22, overflow: 'hidden', borderRadius: 4}}><Media m={p('w12/bo161', {fx: 45})} style={{transform: `scale(${1.05 + f / 2500})`}} /></div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 460, background: G, borderRadius: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.3)'}}>
          <div style={{position: 'absolute', inset: 22, border: `2px solid ${SA}`, borderRadius: 6}} />
          <div style={{...center, top: 120, ...mark(104, I)}}>Sea, Signora</div>
          <div style={{...center, top: 260, ...mono(18, SA)}}>seafood restaurant · milan</div>
          <div style={{...center, top: 300, ...mono(18, SA)}}>via fiori chiari 32</div>
          <div style={{position: 'absolute', left: 60, right: 60, bottom: 40, height: 34, borderRadius: 4,
            background: 'repeating-linear-gradient(90deg, #5a3a22 0 6px, #7a5034 6px 12px)'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 5 · plates landing on the table
const Tavolo: React.FC = () => {
  const f = useCurrentFrame();
  const D = 380;
  const pl: [number, number, M, number, number][] = [[80, 440, p('w11/f23'), -1, -1], [620, 470, p('w11/f44', {fy: 52}), 1, -1], [80, 860, p('w11/f109'), -1, 0],
    [620, 890, p('w11/f88', {fy: 55}), 1, 0], [350, 1180, p('w11/f65', {fy: 55}), 0, 1]];
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, #2a4a2b, ${G} 70%)`}}>
      <div style={{...center, top: 285, ...mono(20, SA)}}>the table fills up</div>
      <div style={{...center, top: 322, ...ital(64, I)}}>order for the table</div>
      {pl.map(([x, y, m, dx, dy], i) => {
        const s = pop(f, 14 + i * 14);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: D, height: D, borderRadius: '50%', overflow: 'hidden', border: `14px solid ${I}`, boxSizing: 'border-box',
            boxShadow: '0 18px 36px rgba(0,0,0,0.45)', opacity: f >= 14 + i * 14 ? 1 : 0,
            transform: `translate(${(1 - s) * dx * 700}px, ${(1 - s) * (dy || 0.4) * 700}px) rotate(${(1 - s) * 40}deg)`}}>
            <Media m={m} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 6 · door hanger: do not disturb, dinner in progress
const Cartello: React.FC = () => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 8) * 7 * Math.exp(-f / 60);
  return (
    <AbsoluteFill style={{background: SA}}>
      <div style={{position: 'absolute', left: 540, top: 250, width: 0, height: 0}}>
        <div style={{position: 'absolute', left: -60, top: -10, width: 120, height: 40, background: '#8d7f63', borderRadius: 8}} />
      </div>
      <div style={{position: 'absolute', left: 190, top: 280, width: 700, height: 1260, transformOrigin: '50% 0', transform: `rotate(${sw}deg)`,
        background: G, borderRadius: '350px 350px 40px 40px / 350px 350px 40px 40px', boxShadow: '0 30px 60px rgba(0,0,0,0.3)'}}>
        <div style={{position: 'absolute', left: 230, top: 60, width: 240, height: 240, borderRadius: '50%', background: SA}} />
        <div style={{position: 'absolute', left: 60, top: 300, width: 580, height: 3, background: O}} />
        <div style={{...center, top: 350, ...disp(104, I, {letterSpacing: 4, lineHeight: 1.02})}}>{'DO NOT\nDISTURB'}</div>
        <div style={{...center, top: 580, ...ital(56, SA)}}>dinner in progress</div>
        <div style={{position: 'absolute', left: 60, top: 690, width: 580, height: 400, overflow: 'hidden', borderRadius: 12}}>
          <Media m={p('w11/f62')} style={{transform: `scale(${1.04 + f / 3000})`}} />
        </div>
        <div style={{...center, top: 1150, ...mark(44, I)}}>Sea, Signora</div>
      </div>
    </AbsoluteFill>
  );
};

// 7 · coaster with a turning ring of words
const Sottobicchiere: React.FC = () => {
  const f = useCurrentFrame();
  const R = 352;
  return (
    <AbsoluteFill style={{background: SA}}>
      <div style={{...center, top: 285, ...mono(20, G)}}>the bar</div>
      <div style={{...center, top: 322, ...ital(64, G)}}>drinks at the counter</div>
      <div style={{position: 'absolute', left: 130, top: 500, width: 820, height: 820, borderRadius: '50%', background: I, boxShadow: '0 20px 40px rgba(0,0,0,0.2)'}}>
        <div style={{position: 'absolute', inset: 14, borderRadius: '50%', border: `3px solid ${G}`}} />
        <div style={{position: 'absolute', left: 120, top: 120, width: 580, height: 580, borderRadius: '50%', overflow: 'hidden'}}>
          <Media m={p('w12/bo287', {fy: 45})} style={{transform: `scale(${1.05 + f / 1800})`}} />
        </div>
        <svg width={820} height={820} style={{position: 'absolute', inset: 0, transform: `rotate(${f * 0.8}deg)`}}>
          <defs><path id="ring" d={`M 410 ${410 - R} a ${R} ${R} 0 1 1 -0.1 0`} /></defs>
          <text fontFamily={fonts.mono} fontWeight={500} fontSize={30} letterSpacing={7} fill={G}>
            <textPath href="#ring" textLength={2 * Math.PI * R - 10} lengthAdjust="spacing">DRINKS AT THE COUNTER · SEA, SIGNORA · BRERA · CHEERS · FIORI CHIARI 32 · </textPath>
          </text>
        </svg>
      </div>
      <div style={{...center, top: 1400, ...mono(20, G), opacity: ip(f, 30, 45)}}>via fiori chiari 32 · milan</div>
    </AbsoluteFill>
  );
};

// 8 · Venn: where Milano meets the sea
const Venn: React.FC = () => {
  const f = useCurrentFrame();
  const D = 520;
  const cs: [number, number, string, string, number, number][] = [[400, 830, O, 'Brera', -1, 0], [680, 830, G, 'the sea', 1, 0], [540, 1070, SA, 'good food', 0, 1]];
  const lbl: [number, number, string][] = [[270, 760, 'Brera'], [810, 760, 'the sea'], [540, 1220, 'good food']];
  return (
    <AbsoluteFill style={{background: I}}>
      <div style={{...center, top: 285, ...mono(20, O)}}>sea, signora · a diagram</div>
      <div style={{...center, top: 322, ...ital(64, G)}}>where Milan meets the sea</div>
      {cs.map(([x, y, c, , dx, dy], i) => {
        const s = ip(f, 8 + i * 10, 40 + i * 10, 0, 1, io);
        return <div key={i} style={{position: 'absolute', left: x - D / 2, top: y - D / 2, width: D, height: D, borderRadius: '50%', background: c, opacity: 0.88,
          mixBlendMode: 'multiply', transform: `translate(${(1 - s) * dx * 500}px, ${(1 - s) * dy * 500}px)`}} />;
      })}
      {lbl.map(([x, y, t], i) => <div key={t} style={{position: 'absolute', left: x - 150, width: 300, top: y - 30, textAlign: 'center', ...ital(54, i === 1 ? I : G),
        opacity: ip(f, 50 + i * 6, 62 + i * 6)}}>{t}</div>)}
      <div style={{position: 'absolute', left: 390, width: 300, top: 880, textAlign: 'center', ...mark(44, I), transform: `scale(${pop(f, 75)})`}}>{'Sea,\nSignora'}</div>
      <div style={{...center, top: 1420, ...mono(20, G), opacity: ip(f, 95, 110)}}>via fiori chiari 32 · brera</div>
    </AbsoluteFill>
  );
};

// 9 · Milan street plaque on the façade
const Indicazioni: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <AbsoluteFill style={{background: G}} />
      <Box b={{left: 0, top: 760, width: 1080, height: 1160}} m={p('w10/p0196', {fx: 58, fy: 45})} st={{transform: `scale(${1.03 + f / 3000})`}} />
      <div style={{position: 'absolute', left: 160, width: 760, top: 300, height: 230, background: '#F4F2EE', boxShadow: '0 10px 24px rgba(0,0,0,0.4)',
        transform: `translateY(${(1 - pop(f, 8)) * -500}px)`}}>
        <div style={{position: 'absolute', inset: 14, border: '3px solid #1d1d1b'}} />
        <div style={{...center, top: 42, ...serif(30, '#1d1d1b', {letterSpacing: 6, textTransform: 'uppercase'})}}>Brera</div>
        <div style={{...center, top: 92, ...serif(76, '#1d1d1b', {letterSpacing: 4, textTransform: 'uppercase'})}}>Via Fiori Chiari</div>
      </div>
      <div style={{position: 'absolute', left: 260, width: 560, top: 570, height: 110, background: O, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', boxSizing: 'border-box', boxShadow: '0 10px 24px rgba(0,0,0,0.4)', transform: `translateX(${(1 - pop(f, 26)) * 900}px)`}}>
        <span style={mark(54, I)}>Sea, Signora</span><span style={mono(40, I)}>→ 32</span>
      </div>
      {f >= 60 && <Chip cta={{label: 'book a table', color: 'orange', y: 380}} />}
    </AbsoluteFill>
  );
};

// 10 · business card, front and back
const Biglietto: React.FC = () => {
  const f = useCurrentFrame();
  const r = ip(f, 70, 95, 0, 180, io);
  const face: React.CSSProperties = {position: 'absolute', inset: 0, borderRadius: 18, backfaceVisibility: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)'};
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('w12/bo16')} style={{filter: 'blur(14px) brightness(0.5)', transform: 'scale(1.1)'}} />
      <div style={{...center, top: 285, ...mono(20, SA)}}>sea, signora</div>
      <div style={{...center, top: 322, ...ital(64, I)}}>take our card</div>
      <div style={{position: 'absolute', left: 110, width: 860, top: 720, height: 520, perspective: 2000}}>
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${r}deg) translateY(${(1 - pop(f, 6)) * 200}px)`}}>
          <div style={{...face, background: G}}>
            <div style={{position: 'absolute', inset: 26, border: `2px solid ${SA}`, borderRadius: 8}} />
            <div style={{...center, top: 170, ...mark(120, I)}}>Sea, Signora</div>
            <div style={{...center, top: 330, ...mono(20, SA)}}>seafood restaurant · milan</div>
          </div>
          <div style={{...face, background: I, transform: 'rotateY(180deg)'}}>
            <div style={{position: 'absolute', left: 70, top: 70, ...mark(56, G)}}>Sea, Signora</div>
            <div style={{position: 'absolute', left: 70, top: 170, width: 720, height: 3, background: O}} />
            {['via fiori chiari 32, milan', 'dinner · 19:00 — 00:00', 'raw bar · seafood · wine'].map((t, i) => (
              <div key={t} style={{position: 'absolute', left: 70, top: 220 + i * 70, ...mono(26, G, {letterSpacing: 3})}}>{t}</div>
            ))}
          </div>
        </div>
      </div>
      {f >= 100 && <Chip cta={{label: 'book a table', color: 'orange', y: 380}} />}
    </AbsoluteFill>
  );
};

// 11 · the menu, scrolled
const Scroll: React.FC = () => {
  const f = useCurrentFrame();
  const it: [string, M][] = [['Red prawns from Mazara', p('w10/k0121', {fy: 40})], ['Burrata with red prawn', p('w11/f44', {fy: 52})], ['Red tuna', p('w11/f88', {fy: 55})],
    ['Fusillone with seafood', p('w11/f112')], ['Crispy lamb chop', p('w11/f65', {fy: 55})], ['King crab', p('w11/f116')], ['Panettone', p('w10/pan86', {fy: 60})]];
  const L = 34;
  const pos = interpolate(f, it.flatMap((_, i) => [i * L + 6, i * L + L]), it.flatMap((_, i) => [i, i]).map((x, j) => (j % 2 ? x : Math.max(0, x - 1)) + 0),
    {extrapolateRight: 'clamp', easing: io});
  const k = Math.round(pos);
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{position: 'absolute', left: 70, width: 940, top: 280, height: 560, borderRadius: 24, overflow: 'hidden'}}>
        {it.map(([, m], i) => <div key={i} style={{position: 'absolute', inset: 0, opacity: Math.max(0, 1 - Math.abs(pos - i) * 1.6)}}><Media m={m} /></div>)}
      </div>
      <div style={{position: 'absolute', left: 70, top: 880, ...mono(18, SA)}}>the menu, in short</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 930, height: 620, overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(transparent, black 30%, black 70%, transparent)', maskImage: 'linear-gradient(transparent, black 30%, black 70%, transparent)'}}>
        {it.map(([t], i) => (
          <div key={t} style={{position: 'absolute', left: 70, right: 70, top: 260 + (i - pos) * 110, height: 100, display: 'flex', alignItems: 'center', gap: 26,
            ...ital(60, I), opacity: Math.max(0.25, 1 - Math.abs(pos - i) * 0.75)}}>
            <span style={{width: 70, ...mono(20, i === k ? O : SA)}}>{String(i + 1).padStart(2, '0')}</span>{t}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 12 · a diary page with two photos taped in
const Diario: React.FC = () => {
  const f = useCurrentFrame();
  const lines = ['dear diary,', 'tonight: Sea, Signora.', 'raw bar, wine, laughs.', 'coming back soon.'];
  const tape = (l: number, t: number, r: number) => <div style={{position: 'absolute', left: l, top: t, width: 150, height: 44, background: 'rgba(206,196,175,0.85)', transform: `rotate(${r}deg)`}} />;
  return (
    <AbsoluteFill style={{background: SA}}>
      <div style={{position: 'absolute', left: 90, width: 900, top: 290, height: 1250, background: '#FBFAF6', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        backgroundImage: 'repeating-linear-gradient(transparent 0 88px, rgba(27,47,28,0.15) 88px 90px)', backgroundPosition: '0 820px'}}>
        <div style={{position: 'absolute', left: 60, top: 70, width: 380, height: 500, overflow: 'hidden', transform: `rotate(-3deg) scale(${pop(f, 6)})`,
          border: `12px solid ${I}`, boxShadow: '0 8px 18px rgba(0,0,0,0.2)'}}><Media m={p('w12/bo227', {fy: 30})} /></div>
        <div style={{position: 'absolute', left: 470, top: 150, width: 380, height: 280, overflow: 'hidden', transform: `rotate(3deg) scale(${pop(f, 18)})`,
          border: `12px solid ${I}`, boxShadow: '0 8px 18px rgba(0,0,0,0.2)'}}><Media m={p('w11/f73', {fy: 45})} /></div>
        {f >= 6 && tape(170, 50, -8)}{f >= 18 && tape(590, 130, 6)}
        <div style={{position: 'absolute', left: 470, top: 480, ...mono(16, O), opacity: ip(f, 30, 40)}}>sea, signora · milan</div>
        {lines.map((t, i) => (
          <div key={t} style={{position: 'absolute', left: 70, top: 742 + i * 90, ...ital(60, i === 1 ? O : G), clipPath: `inset(0 ${100 - ip(f, 40 + i * 26, 64 + i * 26, 0, 100, Easing.linear)}% 0 0)`}}>{t}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 13 · zoom from Brera to the plate
const Zoom: React.FC = () => {
  const f = useCurrentFrame();
  const st: [M, number, number][] = [[p('w12/bo28', {fx: 50}), 0, 75], [p('w11/f54'), 70, 145], [p('w11/f44', {fy: 52}), 140, 210]];
  const crumbs = ['brera', 'sea, signora', 'your table', 'the burrata'];
  const k = f < 70 ? 1 : f < 140 ? 2 : 3;
  return (
    <AbsoluteFill style={{background: N}}>
      {st.map(([m, a, b], i) => (
        <div key={i} style={{position: 'absolute', inset: 0, opacity: i === 0 ? 1 - ip(f, 66, 76) : Math.min(ip(f, a - 4, a + 6), i === 2 ? 1 : 1 - ip(f, b - 4, b + 6))}}>
          <Media m={m} style={{transform: `scale(${interpolate(f, [a, b], [1, i === 2 ? 1.25 : 2.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)})})`}} />
        </div>
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 480, background: 'linear-gradient(rgba(11,11,11,0.7), rgba(11,11,11,0))'}} />
      <div style={{position: 'absolute', left: 80, top: 290, display: 'flex', gap: 14, flexWrap: 'wrap', width: 920}}>
        {crumbs.map((c, i) => <span key={c} style={mono(22, i <= k ? (i === k ? O : I) : 'rgba(248,246,245,0.35)')}>{c}{i < 3 ? '  ›' : ''}</span>)}
      </div>
      <div style={{position: 'absolute', left: 80, top: 340, ...ital(64, I)}}>zoom in</div>
    </AbsoluteFill>
  );
};

// 14 · the key to your table
const Chiave: React.FC = () => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 9) * 9 * Math.exp(-f / 70);
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('w12/bo27')} style={{filter: 'blur(12px) brightness(0.45)', transform: 'scale(1.1)'}} />
      <div style={{...center, top: 285, ...mono(20, SA)}}>sea, signora</div>
      <div style={{...center, top: 322, ...ital(64, I)}}>the key to your evening</div>
      <div style={{position: 'absolute', left: 540, top: 470, transformOrigin: '0 0', transform: `rotate(${sw}deg)`}}>
        <div style={{position: 'absolute', left: -40, top: 0, width: 80, height: 80, borderRadius: '50%', border: `10px solid ${MU}`, boxSizing: 'border-box'}} />
        <div style={{position: 'absolute', left: -180, top: 60, width: 360, height: 640, borderRadius: 36, background: G, boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
          <div style={{position: 'absolute', left: 150, top: 26, width: 60, height: 60, borderRadius: '50%', background: '#0f1d10', border: `5px solid ${MU}`, boxSizing: 'border-box'}} />
          <div style={{position: 'absolute', inset: 16, border: `2px solid ${SA}`, borderRadius: 26}} />
          <div style={{...center, top: 140, ...mark(52, I)}}>Sea, Signora</div>
          <div style={{...center, top: 250, ...mono(22, SA)}}>table</div>
          <div style={{...center, top: 290, ...serif(230, O, {lineHeight: 1})}}>7</div>
          <div style={{...center, top: 560, ...mono(16, SA)}}>via fiori chiari 32</div>
        </div>
        <svg width={120} height={420} viewBox="0 0 120 420" style={{position: 'absolute', left: 200, top: 40, transform: 'rotate(-12deg)'}}>
          <circle cx={60} cy={60} r={46} fill="none" stroke={MU} strokeWidth={18} />
          <rect x={50} y={104} width={20} height={290} fill={MU} />
          <rect x={70} y={330} width={36} height={16} fill={MU} /><rect x={70} y={370} width={26} height={16} fill={MU} />
        </svg>
      </div>
      {f >= 60 && <Chip cta={{label: 'book a table', color: 'orange', y: 380}} />}
    </AbsoluteFill>
  );
};

// 15 · ticker bands over the kitchen
const Nastri: React.FC = () => {
  const f = useCurrentFrame();
  const band = (txt: string, top: number, rot: number, bg: string, dir: number) => (
    <div style={{position: 'absolute', left: -100, right: -100, top, height: 120, background: bg, transform: `rotate(${rot}deg)`, overflow: 'hidden',
      display: 'flex', alignItems: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.35)'}}>
      <div style={{...disp(70, I, {letterSpacing: 4, whiteSpace: 'nowrap'}), transform: `translateX(${dir < 0 ? -((f * 6) % 1400) : ((f * 6) % 1400) - 1400}px)`}}>{txt.repeat(8)}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('w10/kf0117', 13)} />
      {band('RAW BAR · PASTA · GRILL · WINE · ', 300, -4, O, -1)}
      {band('SEA, SIGNORA · FIORI CHIARI 32 · BRERA · ', 1420, 3, G, 1)}
    </AbsoluteFill>
  );
};

// 16 · the room under the painting, tile by tile
const Mosaico: React.FC = () => {
  const f = useCurrentFrame();
  const C = 10, R = 7, W = 940, H = 700, tw = W / C, th = H / R;
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{position: 'absolute', left: 70, top: 300, width: W, height: H, perspective: 1400}}>
        {Array.from({length: C * R}, (_, i) => {
          const c = i % C, r = Math.floor(i / C);
          const a = ip(f, 6 + (c + r) * 3, 22 + (c + r) * 3, 180, 0, io);
          return (
            <div key={i} style={{position: 'absolute', left: c * tw, top: r * th, width: tw, height: th, transformStyle: 'preserve-3d', transform: `rotateY(${a}deg)`}}>
              <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', overflow: 'hidden'}}>
                <Img src={staticFile('photos/w12/npcoverfoto.jpg')} style={{position: 'absolute', left: -c * tw, top: -r * th - 0, width: W, height: H, objectFit: 'cover', maxWidth: 'none'}} />
              </div>
              <div style={{position: 'absolute', inset: 1, background: SA, transform: 'rotateY(180deg)', backfaceVisibility: 'hidden'}} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 80, top: 1070, ...mono(20, SA), opacity: ip(f, 60, 75)}}>the room</div>
      <div style={{position: 'absolute', left: 74, top: 1110, ...disp(96, I, {lineHeight: 1.05}), opacity: ip(f, 66, 82)}}>{'A TABLE UNDER\nTHE SIGNORA'}</div>
      <div style={{position: 'absolute', left: 80, top: 1340, ...ital(48, SA), opacity: ip(f, 76, 92)}}>candles, velvet and the lady herself</div>
    </AbsoluteFill>
  );
};

// 17 · a little book, page by page
const Sfoglia: React.FC = () => {
  const f = useCurrentFrame();
  const W = 820, H = 1140;
  const pages: React.ReactNode[] = [
    <div style={{position: 'absolute', inset: 0, background: G}}>
      <div style={{position: 'absolute', inset: 30, border: `2px solid ${SA}`}} />
      <div style={{...center, top: 420, ...mark(110, I)}}>Sea, Signora</div>
      <div style={{...center, top: 560, ...ital(52, SA)}}>stories from the sea</div>
    </div>,
    ...([[p('w12/bo455', {fy: 40}), 'chapter one', 'the kitchen'], [p('w11/f25'), 'chapter two', 'raw bar'], [p('w12/bo234', {fy: 35}), 'chapter three', 'the room']] as [M, string, string][])
      .map(([m, a, b]) => (
        <div style={{position: 'absolute', inset: 0, background: '#FBFAF6'}}>
          <Box b={{left: 50, top: 50, width: W - 100, height: 820}} m={m} />
          <div style={{position: 'absolute', left: 50, top: 910, ...mono(20, O)}}>{a}</div>
          <div style={{position: 'absolute', left: 46, top: 950, ...disp(96, G)}}>{b}</div>
        </div>
      )),
  ];
  const flips = [40, 95, 150];
  return (
    <AbsoluteFill style={{background: O}}>
      <div style={{position: 'absolute', left: 130, top: 330, width: W, height: H, perspective: 2400}}>
        {pages.map((pg, i) => {
          const r = i < flips.length ? ip(f, flips[i], flips[i] + 22, 0, -180, io) : 0;
          return (
            <div key={i} style={{position: 'absolute', inset: 0, transformOrigin: '0 50%', transform: `rotateY(${r}deg)`, zIndex: pages.length - i + (r < -90 ? -20 : 0),
              backfaceVisibility: 'hidden', boxShadow: '0 24px 50px rgba(0,0,0,0.3)'}}>{pg}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 18 · a note on a napkin
const Tovagliolo: React.FC = () => {
  const f = useCurrentFrame();
  const lines = ['tonight?', 'Fiori Chiari 32.', "I'll order for the table."];
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('w11/f43')} style={{filter: 'blur(8px) brightness(0.6)', transform: 'scale(1.1)'}} />
      <div style={{position: 'absolute', left: 150, top: 500, width: 780, height: 780, background: '#FBFAF6', transform: 'rotate(-4deg)', boxShadow: '0 24px 50px rgba(0,0,0,0.45)',
        backgroundImage: 'linear-gradient(135deg, transparent 49.6%, rgba(0,0,0,0.06) 50%, transparent 50.4%)'}}>
        <div style={{position: 'absolute', right: 0, bottom: 0, width: 150, height: 150, background: 'linear-gradient(135deg, #e9e5dc 50%, transparent 50%)',
          boxShadow: '-6px -6px 12px rgba(0,0,0,0.08)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', ...mark(54, O)}}>Sea, Signora</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 135, textAlign: 'center', ...mono(16, O)}}>milan</div>
        {lines.map((t, i) => (
          <div key={t} style={{position: 'absolute', left: 80, top: 260 + i * 110, ...ital(70, G), clipPath: `inset(0 ${100 - ip(f, 20 + i * 30, 46 + i * 30, 0, 100, Easing.linear)}% 0 0)`}}>{t}</div>
        ))}
        <div style={{position: 'absolute', left: 470, top: 560, width: 210, height: 210, borderRadius: '50%', border: '10px solid rgba(140,30,40,0.18)', opacity: ip(f, 110, 130)}} />
      </div>
      <div style={{...center, top: 300, ...mono(20, SA)}}>notes on a napkin</div>
    </AbsoluteFill>
  );
};

// 19 · a turning cube: four sides of the evening
const Cubo: React.FC = () => {
  const f = useCurrentFrame();
  const S = 640;
  const faces: [M, string][] = [[p('w11/f25'), 'raw bar'], [v('w10/nm0681', 1), 'pasta'], [p('w12/bo287', {fy: 45}), 'the bar'], [p('w12/bo16', {fx: 30}), 'the room']];
  const keys = [0, 40, 58, 98, 116, 156, 174, 210], vals = [0, 0, -90, -90, -180, -180, -270, -270];
  const ry = interpolate(f, keys, vals, {extrapolateRight: 'clamp', easing: io});
  const k = Math.round(-ry / 90) % 4;
  return (
    <AbsoluteFill style={{background: N}}>
      <div style={{...center, top: 285, ...mono(20, SA)}}>sea, signora</div>
      <div style={{...center, top: 322, ...ital(64, I)}}>every side of the evening</div>
      <div style={{position: 'absolute', left: (1080 - S) / 2, top: 580, width: S, height: S, perspective: 2200}}>
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `translateZ(${-S / 2}px) rotateY(${ry}deg)`}}>
          {faces.map(([m], i) => (
            <div key={i} style={{position: 'absolute', inset: 0, overflow: 'hidden', backfaceVisibility: 'hidden', transform: `rotateY(${i * 90}deg) translateZ(${S / 2}px)`}}>
              <Media m={m} />
            </div>
          ))}
        </div>
      </div>
      <div style={{...center, top: 1330, ...disp(84, I, {letterSpacing: 4})}}>{faces[k][1]}</div>
      <div style={{...center, top: 1440, ...mono(20, SA)}}>{String(k + 1).padStart(2, '0')} / 04</div>
    </AbsoluteFill>
  );
};

// 20 · a fragrance: eau de mare
const Profumo: React.FC = () => {
  const f = useCurrentFrame();
  const notes: [string, string][] = [['top notes', 'lemon, sea salt'], ['heart notes', 'raw fish, white wine'], ['base notes', 'wood fire, candlelight']];
  const sweep = ip(f, 40, 90, -300, 700, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('w12/bo293')} style={{filter: 'blur(10px) brightness(0.5)', transform: 'scale(1.1)'}} />
      <div style={{...center, top: 285, ...mono(20, SA)}}>a fragrance by sea, signora</div>
      <div style={{...center, top: 322, ...ital(80, I)}}>No. 32</div>
      <div style={{position: 'absolute', left: 330, top: 520, width: 420, height: 640, transform: `translateY(${(1 - pop(f, 6)) * 300}px)`}}>
        <div style={{position: 'absolute', left: 120, top: 0, width: 180, height: 120, background: G, borderRadius: 10}} />
        <div style={{position: 'absolute', left: 160, top: 110, width: 100, height: 40, background: MU}} />
        <div style={{position: 'absolute', left: 0, top: 150, width: 420, height: 490, borderRadius: 40, overflow: 'hidden', background: 'linear-gradient(rgba(248,246,245,0.25), rgba(248,246,245,0.08))',
          border: '3px solid rgba(248,246,245,0.5)', boxSizing: 'border-box'}}>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 330, background: 'linear-gradient(rgba(239,120,24,0.55), rgba(239,120,24,0.85))'}} />
          <div style={{position: 'absolute', left: 60, right: 60, top: 150, height: 200, background: I, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={mark(46, G)}>Sea, Signora</div>
            <div style={{...mono(16, G), marginTop: 14}}>no. 32 · eau de parfum</div>
          </div>
          <div style={{position: 'absolute', top: -50, left: sweep, width: 90, height: 600, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', transform: 'rotate(18deg)'}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 110, width: 860, top: 1220}}>
        {notes.map(([a, b], i) => (
          <div key={a} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderTop: '1px solid rgba(248,246,245,0.3)',
            opacity: ip(f, 60 + i * 14, 74 + i * 14)}}>
            <span style={mono(18, SA)}>{a}</span><span style={ital(42, I)}>{b}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

type Spec = {id: string; day: string; sec: number; view: React.FC; screen: string; caption: string; hashtags: string[]; cta?: string};
const tags = (...t: string[]) => ['#seasignora', ...t];
export const FRESH3: Spec[] = [
  {id: 'H-01v-sommario', day: '1', sec: 7, view: Sommario, screen: "sea, signora · tonight's issue / CONTENTS / 04 Raw bar: carpaccio, tartare, red prawns · 12 Pasta: fusillone, tagliolini, risotto · 20 The bar: drinks at the counter · 28 The room: candles, aquarium, Brera",
    caption: "Tonight's issue: the raw bar, the pasta, the bar and the room. Start reading at the table.", hashtags: tags('#brera', '#milan', '#dinner')},
  {id: 'H-02v-fuoco', day: '1', sec: 7, view: Fuoco, screen: 'open kitchen / FIRE / sea, signora · via fiori chiari 32',
    caption: 'Fire: our open kitchen, in full view of the room.', hashtags: tags('#openkitchen', '#chef', '#brera')},
  {id: 'H-03v-persiane', day: '1', sec: 7, view: Persiane, screen: 'sea, signora / GOOD EVENING → open till midnight / via fiori chiari 32 · brera',
    caption: 'The blinds go up, the room wakes up. Open till midnight in Brera.', hashtags: tags('#brera', '#milan', '#restaurant')},
  {id: 'H-04v-fiammiferi', day: '2', sec: 7, view: Fiammiferi, screen: 'light up the evening / strike for dinner / matchbook: Sea, Signora · seafood restaurant · milan · via fiori chiari 32',
    caption: 'Strike for dinner: the kitchen lights up at Via Fiori Chiari 32.', hashtags: tags('#openkitchen', '#brera', '#milan')},
  {id: 'H-05v-tavolo', day: '2', sec: 7, view: Tavolo, screen: 'the table fills up / order for the table',
    caption: 'The table fills up: raw fish, burrata, pasta, red tuna, lamb chop. Order for the table and share everything.', hashtags: tags('#sharing', '#seafood', '#brera')},
  {id: 'H-06v-do-not-disturb', day: '2', sec: 7, view: Cartello, screen: 'DO NOT DISTURB / dinner in progress / Sea, Signora',
    caption: 'Do not disturb: dinner in progress at Sea, Signora.', hashtags: tags('#dinner', '#brera', '#milan')},
  {id: 'H-07v-sottobicchiere', day: '3', sec: 7, view: Sottobicchiere, screen: 'the bar / drinks at the counter / ring: drinks at the counter · sea, signora · brera · cheers · fiori chiari 32 / via fiori chiari 32 · milan',
    caption: 'Drinks at the counter: our bar, one glass at a time. Cheers.', hashtags: tags('#cocktails', '#bar', '#brera')},
  {id: 'H-08v-venn', day: '3', sec: 7, view: Venn, screen: 'sea, signora · a diagram / where Milan meets the sea / Brera · the sea · good food → Sea, Signora / via fiori chiari 32 · brera',
    caption: 'Where Milan meets the sea: Brera, the sea and good food. Sea, Signora.', hashtags: tags('#brera', '#milan', '#seafood')},
  {id: 'H-09v-indicazioni', day: '3', sec: 7, view: Indicazioni, screen: 'plaque: Brera · Via Fiori Chiari / Sea, Signora → 32', cta: 'book a table',
    caption: 'Directions: Brera, Via Fiori Chiari, number 32. Your table is inside.', hashtags: tags('#brera', '#milan', '#viafiorichiari')},
  {id: 'H-10v-biglietto', day: '4', sec: 7, view: Biglietto, screen: 'take our card / front: Sea, Signora · seafood restaurant · milan / back: via fiori chiari 32, milan · dinner · 19:00 — 00:00 · raw bar · seafood · wine', cta: 'book a table',
    caption: 'Take our card: Via Fiori Chiari 32, dinner from 19:00 to midnight. Raw bar, seafood, wine.', hashtags: tags('#brera', '#dinner', '#milan')},
  {id: 'H-11v-menu', day: '4', sec: 8, view: Scroll, screen: 'the menu, in short / 01 Red prawns from Mazara · 02 Burrata with red prawn · 03 Red tuna · 04 Fusillone with seafood · 05 Crispy lamb chop · 06 King crab · 07 Panettone',
    caption: 'The menu, in short: red prawns from Mazara, burrata, red tuna, fusillone, lamb chop, king crab and panettone to finish.', hashtags: tags('#menu', '#seafood', '#brera')},
  {id: 'H-12v-diario', day: '4', sec: 8, view: Diario, screen: 'sea, signora · milan / dear diary, / tonight: Sea, Signora. / raw bar, wine, laughs. / coming back soon.',
    caption: 'Dear diary: tonight, Sea, Signora. Raw bar, wine, laughs. Coming back soon.', hashtags: tags('#friends', '#dinner', '#brera')},
  {id: 'H-13v-zoom', day: '5', sec: 7, view: Zoom, screen: 'brera › sea, signora › your table › the burrata / zoom in',
    caption: 'Zoom in: Brera, Sea, Signora, your table, the burrata.', hashtags: tags('#burrata', '#brera', '#milan')},
  {id: 'H-14v-chiave', day: '5', sec: 7, view: Chiave, screen: 'sea, signora / the key to your evening / tag: Sea, Signora · table 7 · via fiori chiari 32', cta: 'book a table',
    caption: 'The key to your evening: table 7 is waiting.', hashtags: tags('#brera', '#dinner', '#milan')},
  {id: 'H-15v-nastri', day: '5', sec: 6, view: Nastri, screen: 'RAW BAR · PASTA · GRILL · WINE / SEA, SIGNORA · FIORI CHIARI 32 · BRERA',
    caption: 'Raw bar, pasta, grill, wine. Fiori Chiari 32, Brera.', hashtags: tags('#openkitchen', '#brera', '#milan')},
  {id: 'H-16v-mosaico', day: '6', sec: 7, view: Mosaico, screen: 'the room / A TABLE UNDER THE SIGNORA / candles, velvet and the lady herself',
    caption: 'A table under the Signora: candles, velvet and the lady herself.', hashtags: tags('#interiordesign', '#brera', '#milan')},
  {id: 'H-17v-sfoglia', day: '6', sec: 7, view: Sfoglia, screen: 'Sea, Signora · stories from the sea / chapter one: the kitchen · chapter two: raw bar · chapter three: the room',
    caption: 'Stories from the sea, in three chapters: the kitchen, the raw bar, the room.', hashtags: tags('#rawbar', '#openkitchen', '#brera')},
  {id: 'H-18v-tovagliolo', day: '6', sec: 6, view: Tovagliolo, screen: "notes on a napkin / Sea, Signora · milan / tonight? / Fiori Chiari 32. / I'll order for the table.",
    caption: "Notes on a napkin: tonight? Fiori Chiari 32. I'll order for the table.", hashtags: tags('#dinner', '#brera', '#milan')},
  {id: 'H-19v-cubo', day: '7', sec: 7, view: Cubo, screen: 'sea, signora / every side of the evening / raw bar · pasta · the bar · the room',
    caption: 'Every side of the evening: the raw bar, the pasta, the bar, the room.', hashtags: tags('#brera', '#milan', '#dinner')},
  {id: 'H-20v-no32', day: '7', sec: 7, view: Profumo, screen: 'a fragrance by sea, signora / No. 32 / top notes: lemon, sea salt · heart notes: raw fish, white wine · base notes: wood fire, candlelight',
    caption: 'No. 32, a fragrance by Sea, Signora: lemon and sea salt, raw fish and white wine, wood fire and candlelight. Only available at the table.', hashtags: tags('#brera', '#milan', '#seafood')},
];
