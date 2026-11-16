import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// 30 stories (client 16.11 late: «не повторяй блюда, материалы и контент; хорошие кадры из этих папок; гостей за столом —
// один стабильный кадр секунд на 8»). Only files never used before: guests at table from the birthday folder (one steady
// 8-second take each), the photographer's frames that were left out (people at the table, hands, flowers, fringe), the
// Pixieset frames not used yet (laughing guests, flambé flames, candles, the long table, the aquarium), the caviar
// service, the bar, the menu being read, the wine being poured, autumn decor, the mirror and the room. English only, no
// team, no weekdays, nothing over faces or plates. 30 new mechanics.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory, N = '#0B0B0B';
type M = {src: string; at?: number; fx?: number; fy?: number; rate?: number};
const Media: React.FC<{m: M; style?: React.CSSProperties}> = ({m, style}) => {
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${m.fx ?? 50}% ${m.fy ?? 50}%`, ...style};
  return m.src.endsWith('.mp4') ? <OffthreadVideo src={staticFile(`videos/${m.src}`)} startFrom={Math.round((m.at ?? 0) * FPS)} playbackRate={m.rate ?? 1} muted style={st} />
    : <Img src={staticFile(`photos/${m.src}`)} style={st} />;
};
const Box: React.FC<{b: React.CSSProperties; m: M; st?: React.CSSProperties}> = ({b, m, st}) => (
  <div style={{position: 'absolute', overflow: 'hidden', ...b}}><Media m={m} style={st} /></div>
);
const p = (n: string, o: Partial<M> = {}): M => ({src: `w14/${n}.jpg`, ...o});
const v = (n: string, at: number, o: Partial<M> = {}): M => ({src: `w14/${n}.mp4`, at, ...o});
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
const topShade = (h = 620, a = 0.7) => <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: h, background: `linear-gradient(rgba(11,11,11,${a}), rgba(11,11,11,0))`}} />;
const Head: React.FC<{k: string; t: string; c?: string; kc?: string; f?: number}> = ({k, t, c = I, kc = SA, f = 99}) => (
  <>
    <div style={{...center, top: 285, ...mono(20, kc), opacity: ip(f, 0, 10)}}>{k}</div>
    <div style={{...center, top: 322, ...ital(66, c), opacity: ip(f, 4, 16)}}>{t}</div>
  </>
);

// ── guests at the table: one steady take each ──────────────────────────────────────────────

// 1 · overheard at the aquarium table
const Overheard: React.FC = () => {
  const f = useCurrentFrame();
  const q = ['“Is this the table by the aquarium?”', '“Same again, please.”', '“We are definitely coming back.”'];
  const k = Math.min(2, Math.floor(f / 80)), t = f - k * 80;
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('g2669', 11.3)} />
      {topShade(640, 0.75)}
      <div style={{...center, top: 285, ...mono(20, SA)}}>overheard at the table</div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 330, textAlign: 'center', ...ital(64, I), opacity: k === 2 ? ip(t, 0, 10) : Math.min(ip(t, 0, 10), 1 - ip(t, 70, 80))}}>{q[k]}</div>
    </AbsoluteFill>
  );
};

// 2 · the long table, with a band
const LongTable: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: G}}>
      <Box b={{left: 0, top: 0, width: 1080, height: 1390}} m={v('g2675', 1)} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1390, height: 6, background: O, transform: `scaleX(${ip(f, 6, 30)})`, transformOrigin: '0 50%'}} />
      <div style={{position: 'absolute', left: 80, top: 1420, ...disp(110, I, {letterSpacing: 4}), clipPath: `inset(0 ${100 - ip(f, 14, 44, 0, 100)}% 0 0)`}}>GOOD COMPANY</div>
      <div style={{position: 'absolute', left: 84, top: 1540, ...mono(18, SA), opacity: ip(f, 40, 55)}}>sea, signora · brera</div>
    </AbsoluteFill>
  );
};

// 3 · passe-partout: the menu first
const Matted: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: I}}>
      <div style={{...center, top: 285, ...mono(20, O)}}>table talk</div>
      <div style={{position: 'absolute', left: 110, top: 330, width: 860, height: 1120, boxShadow: 'inset 0 0 0 2px rgba(27,47,28,0.3)', padding: 0}}>
        <Box b={{left: 0, top: 0, width: 860, height: 1120}} m={v('g2686', 0.2)} />
      </div>
      <div style={{position: 'absolute', left: 90, width: 900, top: 310, height: 1160, border: `2px solid ${G}`}} />
      <div style={{...center, top: 1490, ...ital(52, G), opacity: ip(f, 20, 35)}}>menu first, gossip second</div>
    </AbsoluteFill>
  );
};

// 4 · a counter above the long table
const Tally: React.FC = () => {
  const f = useCurrentFrame();
  const c: [string, number | string][] = [['seats', 12], ['glasses', 24], ['stories', '∞']];
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('g2681', 2.1)} />
      {topShade(620, 0.8)}
      <div style={{...center, top: 285, ...mono(20, SA)}}>the long table</div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 340, display: 'flex', justifyContent: 'space-between'}}>
        {c.map(([l, n], i) => (
          <div key={l} style={{width: 280, textAlign: 'center'}}>
            <div style={serif(120, I)}>{typeof n === 'number' ? Math.round(ip(f, 10 + i * 8, 60 + i * 8, 0, n)) : f > 70 ? n : '…'}</div>
            <div style={{...mono(18, O), marginTop: 6}}>{l}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 5 · front-row seats facing the open kitchen
const FrontRow: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('g2685', 6.7)} />
      {topShade(560, 0.75)}
      <div style={{position: 'absolute', left: 80, top: 285, ...ital(70, I)}}>front-row seats</div>
      <div style={{position: 'absolute', left: 84, top: 390, display: 'flex', alignItems: 'center', gap: 16, opacity: ip(f, 20, 34)}}>
        <span style={{padding: '10px 18px', background: O, ...mono(20, I)}}>the open kitchen</span>
        <svg width={60} height={60} viewBox="0 0 24 24" fill="none" stroke={O} strokeWidth={2.5} strokeLinecap="round"><path d="M12 3 L12 20 M5 13 L12 20 L19 13" /></svg>
      </div>
    </AbsoluteFill>
  );
};

// ── people, hands, toasts (the photographer's unused frames) ───────────────────────────────

// 6 · CLINK
const Clink: React.FC = () => {
  const f = useCurrentFrame();
  const s = pop(f, 18);
  const shake = f > 18 && f < 34 ? Math.sin(f * 2.2) * 6 : 0;
  return (
    <AbsoluteFill style={{background: N}}>
      <Box b={{left: 0, top: 560, width: 1080, height: 1360}} m={p('f70', {fy: 40})} st={{transform: `scale(${1.03 + f / 3000})`}} />
      <div style={{position: 'absolute', left: 70, top: 300, transform: `scale(${s}) rotate(${-6 + shake / 3}deg) translateX(${shake}px)`, transformOrigin: '20% 50%'}}>
        <div style={{...disp(230, O, {letterSpacing: 6, WebkitTextStroke: `6px ${I}`, paintOrder: 'stroke fill'})}}>CLINK!</div>
      </div>
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 100 + i * 40, top: 260 - (i % 2) * 20, width: 8, height: 50 * ip(f, 18, 26), background: I,
        transform: `rotate(${-40 + i * 20}deg)`, opacity: 1 - ip(f, 34, 44)}} />)}
    </AbsoluteFill>
  );
};

// 7 · details from one frame
const Details: React.FC = () => {
  const f = useCurrentFrame();
  const det: [number, number, string][] = [[46, 30, 'the glass'], [55, 72, 'the table'], [25, 18, 'the company']];
  return (
    <AbsoluteFill style={{background: G}}>
      <Box b={{left: 0, top: 0, width: 1080, height: 1100}} m={p('f75', {fy: 35})} />
      <div style={{position: 'absolute', left: 80, top: 1140, ...mono(20, SA)}}>in the details</div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 1190, display: 'flex', justifyContent: 'space-between'}}>
        {det.map(([x, y, l], i) => (
          <div key={l} style={{width: 290, transform: `translateY(${(1 - pop(f, 14 + i * 12)) * 80}px)`, opacity: Math.min(1, pop(f, 14 + i * 12))}}>
            <div style={{width: 290, height: 250, overflow: 'hidden', border: `6px solid ${I}`, boxSizing: 'border-box'}}>
              <Img src={staticFile('photos/w14/f75.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${x}% ${y}%`, transform: 'scale(2.6)', transformOrigin: `${x}% ${y}%`}} />
            </div>
            <div style={{marginTop: 10, ...ital(36, I)}}>{l}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 8 · 3, 2, 1, first bite
const FirstBite: React.FC = () => {
  const f = useCurrentFrame();
  const n = f < 30 ? '3' : f < 60 ? '2' : f < 90 ? '1' : '';
  const t = f % 30;
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('f91', {fy: 55})} style={{filter: `brightness(${f < 90 ? 0.45 : 1})`}} />
      {topShade(600, f < 90 ? 0 : 0.6)}
      {n && <div style={{...center, top: 640, ...serif(420, I, {lineHeight: 1}), opacity: 1 - ip(t, 20, 30), transform: `scale(${1.2 - 0.2 * ip(t, 0, 10)})`}}>{n}</div>}
      <div style={{...center, top: 285, ...mono(20, SA), opacity: ip(f, 92, 102)}}>sea, signora</div>
      <div style={{...center, top: 322, ...ital(80, I), opacity: ip(f, 92, 104)}}>first bite</div>
    </AbsoluteFill>
  );
};

// 9 · halftone pop
const Halftone: React.FC = () => {
  const f = useCurrentFrame();
  const a = 1 - ip(f, 60, 110, 0, 1, io);
  return (
    <AbsoluteFill style={{background: I}}>
      <Box b={{left: 70, top: 330, width: 940, height: 1180}} m={p('f60', {fy: 40})} st={{filter: `grayscale(${a}) contrast(${1 + a * 0.4})`}} />
      <div style={{position: 'absolute', left: 70, top: 330, width: 940, height: 1180, background: O, mixBlendMode: 'multiply', opacity: a * 0.85}} />
      <div style={{position: 'absolute', left: 70, top: 330, width: 940, height: 1180, opacity: a, backgroundImage: `radial-gradient(${I} 3px, transparent 3.6px)`, backgroundSize: '12px 12px'}} />
      <div style={{...center, top: 285, ...mono(20, O)}}>the girls' table · sea, signora</div>
      <div style={{position: 'absolute', left: 90, top: 1350, padding: '10px 20px', background: G, ...disp(70, I, {letterSpacing: 4}), transform: `rotate(-3deg) scale(${pop(f, 20)})`}}>POP!</div>
    </AbsoluteFill>
  );
};

// 10 · tilt-shift: the table as a miniature
const Miniature: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('f71')} style={{filter: 'saturate(1.35) contrast(1.05)', transform: `scale(${1.04 + f / 2500})`}} />
      <div style={{position: 'absolute', inset: 0, backdropFilter: 'blur(14px)', WebkitMaskImage: 'linear-gradient(black 0%, transparent 38%, transparent 62%, black 100%)',
        maskImage: 'linear-gradient(black 0%, transparent 38%, transparent 62%, black 100%)'}} />
      {topShade(560, 0.55)}
      <Head k="tilt-shift" t="a little world, big flavours" f={f} />
    </AbsoluteFill>
  );
};

// 11 · tonight's mood, a slider
const Mood: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [10, 50, 80, 120], [0, 0.9, 0.3, 0.62], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: io});
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('f9', {fy: 40})} />
      <div style={{position: 'absolute', left: 90, width: 900, top: 300, height: 260, borderRadius: 30, background: 'rgba(248,246,245,0.92)', padding: '30px 50px', boxSizing: 'border-box'}}>
        <div style={mono(18, G)}>tonight's mood</div>
        <div style={{position: 'relative', height: 10, borderRadius: 5, background: 'rgba(27,47,28,0.15)', marginTop: 60}}>
          <div style={{width: `${x * 100}%`, height: 10, borderRadius: 5, background: O}} />
          <div style={{position: 'absolute', left: `calc(${x * 100}% - 26px)`, top: -21, width: 52, height: 52, borderRadius: '50%', background: I, boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: `4px solid ${O}`, boxSizing: 'border-box'}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 36}}><span style={ital(36, G)}>cozy</span><span style={ital(36, G)}>festive</span></div>
      </div>
      <div style={{position: 'absolute', left: 90, top: 590, padding: '10px 20px', background: G, ...mono(20, I), opacity: ip(f, 120, 132)}}>result: both</div>
    </AbsoluteFill>
  );
};

// ── the room, the light, the details (Pixieset frames not used before) ─────────────────────

// 12 · warning: flambé
const Warning: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p(f < 90 ? 'bo389' : 'bo390')} style={{transform: `scale(${1.05 + f / 2000})`}} />
      <div style={{position: 'absolute', left: 340, top: 300, width: 400, height: 350, transform: `scale(${pop(f, 10)})`}}>
        <svg width={400} height={350} viewBox="0 0 400 350"><path d="M200 18 L384 330 L16 330 Z" fill={O} stroke={I} strokeWidth={14} strokeLinejoin="round" />
          <path d="M200 120 C 240 170, 250 200, 235 245 C 228 270, 210 285, 200 285 C 175 285, 160 265, 165 238 C 170 215, 185 205, 190 185 C 205 205, 200 215, 205 225 C 215 200, 205 160, 200 120 Z" fill={I} /></svg>
      </div>
      <div style={{...center, top: 690, ...disp(84, I, {letterSpacing: 6, textShadow: '0 4px 20px rgba(0,0,0,0.7)'}), opacity: ip(f, 20, 32)}}>CAUTION</div>
      <div style={{...center, top: 790, ...ital(56, I, {textShadow: '0 4px 20px rgba(0,0,0,0.7)'}), opacity: ip(f, 28, 40)}}>flambé in progress</div>
    </AbsoluteFill>
  );
};

// 13 · good pour decisions
const Pour: React.FC = () => {
  const f = useCurrentFrame();
  const lvl = ip(f, 15, 90, 0, 1, io);
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('bo437')} />
      {topShade(700, 0.75)}
      <svg width={180} height={300} viewBox="0 0 180 300" style={{position: 'absolute', left: 80, top: 290}}>
        <defs><clipPath id="bowl"><path d="M 20 10 L 160 10 C 160 110, 130 150, 90 150 C 50 150, 20 110, 20 10 Z" /></clipPath></defs>
        <rect x={0} y={150 - 110 * lvl} width={180} height={150} fill={O} clipPath="url(#bowl)" />
        <path d="M 20 10 L 160 10 C 160 110, 130 150, 90 150 C 50 150, 20 110, 20 10 Z M 90 150 L 90 270 M 45 280 L 135 280" fill="none" stroke={I} strokeWidth={8} strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: 300, top: 320, ...ital(76, I)}}>{'good pour\ndecisions'}</div>
      <div style={{position: 'absolute', left: 304, top: 520, ...mono(18, SA), opacity: ip(f, 60, 75)}}>ask us for the bottle</div>
    </AbsoluteFill>
  );
};

// 14 · a place card with your name
const PlaceCard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('bo8')} style={{filter: 'brightness(0.8)'}} />
      <div style={{position: 'absolute', left: 190, top: 380, width: 700, height: 420, perspective: 1600}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 420, background: '#FBFAF6', boxShadow: '0 30px 50px rgba(0,0,0,0.5)', transformOrigin: '50% 100%',
          transform: `rotateX(${ip(f, 6, 30, 80, 8, Easing.out(Easing.back(1.3)))}deg)`}}>
          <div style={{position: 'absolute', inset: 24, border: `2px solid ${G}`}} />
          <div style={{...center, top: 70, ...mono(18, O)}}>sea, signora · reserved for</div>
          <div style={{...center, top: 140, ...ital(140, G), clipPath: `inset(0 ${100 - ip(f, 34, 70, 0, 100, Easing.linear)}% 0 0)`}}>You</div>
          <div style={{...center, top: 330, ...mono(16, G)}}>via fiori chiari 32</div>
        </div>
      </div>
      {f >= 80 && <Chip cta={{label: 'book a table', color: 'orange', y: 380}} />}
    </AbsoluteFill>
  );
};

// 15 · moon phases over the candles
const Moon: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('bo58', {fy: 60})} style={{transform: `scale(${1.04 + f / 3000})`}} />
      {topShade(700, 0.8)}
      <div style={{position: 'absolute', left: 120, right: 120, top: 300, display: 'flex', justifyContent: 'space-between'}}>
        {[0.15, 0.4, 0.62, 0.82, 1].map((ph, i) => {
          const on = f > 10 + i * 14;
          return (
            <div key={i} style={{width: 110, height: 110, borderRadius: '50%', background: on ? '#F3E6C8' : 'rgba(248,246,245,0.2)', position: 'relative', overflow: 'hidden',
              boxShadow: on && i === 4 ? '0 0 50px rgba(243,230,200,0.8)' : 'none'}}>
              {i < 4 && <div style={{position: 'absolute', top: 0, bottom: 0, left: `${ph * 100}%`, width: '110%', borderRadius: '50%', background: '#1a1a18'}} />}
            </div>
          );
        })}
      </div>
      <div style={{...center, top: 460, ...ital(70, I), opacity: ip(f, 80, 95)}}>a full moon over Brera</div>
      <div style={{...center, top: 560, ...mono(18, SA), opacity: ip(f, 90, 105)}}>and a full table under it</div>
    </AbsoluteFill>
  );
};

// 16 · blueprint lines over the room
const Blueprint: React.FC = () => {
  const f = useCurrentFrame();
  const d = (a: number) => ip(f, a, a + 24, 0, 1, io);
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('bo63', {fx: 50})} style={{filter: 'brightness(0.75)'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}} fill="none" stroke={I} strokeWidth={3}>
        <path pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(10)} d="M 80 700 L 1000 700" />
        <path d="M 80 680 L 80 720 M 1000 680 L 1000 720" opacity={d(10)} />
        <path pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(30)} d="M 80 1500 L 1000 1500" />
        <path d="M 80 1480 L 80 1520 M 1000 1480 L 1000 1520" opacity={d(30)} />
      </svg>
      <div style={{...center, top: 640, ...mono(20, I), opacity: d(20)}}>velvet · candlelight · seats for two</div>
      <div style={{...center, top: 1440, ...mono(20, I), opacity: d(40)}}>designed for long dinners</div>
      {topShade(560, 0.7)}
      <Head k="sea, signora · the plan" t="drawn for staying late" f={f} />
    </AbsoluteFill>
  );
};

// 17 · a ruler along the long table
const Ruler: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('bo70')} />
      {topShade(560, 0.7)}
      <div style={{position: 'absolute', left: 70, top: 600, width: 70, height: 1000 * ip(f, 6, 50, 0, 1, io), background: '#F3E6C8', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.5)'}}>
        {Array.from({length: 50}, (_, i) => <div key={i} style={{position: 'absolute', left: 0, top: i * 20, width: i % 5 ? 20 : 40, height: 3, background: N}} />)}
      </div>
      <Head k="one long table" t="∞ cm of conversation" f={f} />
    </AbsoluteFill>
  );
};

// 18 · bubbles from the aquarium
const Bubbles: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('bo156', {fx: 50})} style={{transform: `scale(${1.08 + f / 2500})`}} />
      {Array.from({length: 26}, (_, i) => {
        const x = (i * 137) % 1040 + 20, sp = 3 + (i % 5), r = 8 + (i * 7) % 22;
        const y = 1960 - ((f * sp + i * 97) % 2100);
        return <div key={i} style={{position: 'absolute', left: x + Math.sin((f + i * 10) / 12) * 14, top: y, width: r * 2, height: r * 2, borderRadius: '50%',
          border: '2px solid rgba(248,246,245,0.7)', background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.5), transparent 60%)'}} />;
      })}
      {topShade(560, 0.6)}
      <Head k="sea, signora" t="under the sea, above Brera" f={f} />
    </AbsoluteFill>
  );
};

// 19 · laugh track: a waveform and four laughs
const LaughTrack: React.FC = () => {
  const f = useCurrentFrame();
  const ph = [p('bo354', {fy: 35}), p('bo363', {fy: 35}), p('bo364', {fy: 35}), p('bo366', {fy: 30})];
  const peaks = [0.2, 0.42, 0.64, 0.86];
  const head = ip(f, 10, 200, 0, 1, Easing.linear);
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{...center, top: 285, ...mono(20, SA)}}>laugh track</div>
      {ph.map((m, i) => {
        const on = head >= peaks[i] - 0.03;
        return <Box key={i} b={{left: 70 + (i % 2) * 480, top: 340 + Math.floor(i / 2) * 470, width: 460, height: 450, opacity: on ? 1 : 0.25, filter: on ? 'none' : 'grayscale(1)'}} m={m} />;
      })}
      <div style={{position: 'absolute', left: 70, width: 940, top: 1300, height: 200, display: 'flex', alignItems: 'center', gap: 4}}>
        {Array.from({length: 94}, (_, i) => {
          const x = i / 93;
          const hgt = 14 + 150 * Math.max(...peaks.map((pk) => Math.exp(-((x - pk) ** 2) / 0.0012))) + ((i * 37) % 11) * 2;
          return <div key={i} style={{width: 6, height: hgt, borderRadius: 3, background: x <= head ? O : 'rgba(248,246,245,0.35)'}} />;
        })}
      </div>
      <div style={{position: 'absolute', left: 70 + head * 940, top: 1290, width: 4, height: 220, background: I}} />
    </AbsoluteFill>
  );
};

// 20 · the table as a clock
const TableClock: React.FC = () => {
  const f = useCurrentFrame();
  const a = ip(f, 10, 200, -90, 270, Easing.inOut(Easing.quad));
  const lab: [number, string][] = [[0, 'aperitivo'], [90, 'raw bar'], [180, 'pasta'], [270, 'dessert']];
  const cx = 540, cy = 980, R = 420;
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{...center, top: 285, ...mono(20, SA)}}>sea, signora</div>
      <div style={{...center, top: 322, ...ital(64, I)}}>what time is dinner</div>
      <div style={{position: 'absolute', left: cx - R + 40, top: cy - R + 40, width: 2 * R - 80, height: 2 * R - 80, borderRadius: '50%', overflow: 'hidden', border: `10px solid ${I}`, boxSizing: 'border-box'}}>
        <Media m={p('f51')} />
      </div>
      {lab.map(([deg, l]) => {
        const r = ((deg - 90) * Math.PI) / 180;
        const x = cx + Math.cos(r) * (R + 10), y = cy + Math.sin(r) * (R + 10);
        const flip = deg === 90 ? 'translate(-100%, -50%)' : deg === 270 ? 'translate(0, -50%)' : 'translate(-50%, -50%)';
        return <div key={l} style={{position: 'absolute', left: deg === 90 ? 1050 : deg === 270 ? 30 : x, top: y, transform: flip, ...mono(20, I), whiteSpace: 'nowrap'}}>{l}</div>;
      })}
      <div style={{position: 'absolute', left: cx - 5, top: cy - 300, width: 10, height: 300, background: O, borderRadius: 5, transformOrigin: '50% 100%', transform: `rotate(${a + 90}deg)`,
        boxShadow: '0 4px 10px rgba(0,0,0,0.4)'}} />
      <div style={{position: 'absolute', left: cx - 20, top: cy - 20, width: 40, height: 40, borderRadius: '50%', background: O}} />
      <div style={{...center, top: 1470, ...ital(48, SA), opacity: ip(f, 190, 205)}}>all evening, obviously</div>
    </AbsoluteFill>
  );
};

// 21 · herbarium sheet: the flowers on our tables
const Herbarium: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: SA}}>
      <div style={{position: 'absolute', left: 90, width: 900, top: 290, height: 1260, background: '#F6F1E4', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'}}>
        <div style={{position: 'absolute', left: 60, top: 60, width: 780, height: 820, overflow: 'hidden', transform: `scale(${0.96 + 0.04 * pop(f, 6)})`}}><Media m={p('f13')} /></div>
        {[[120, 50, -8], [640, 50, 6], [120, 850, 5], [640, 850, -6]].map(([l, t, r], i) => (
          <div key={i} style={{position: 'absolute', left: l, top: t, width: 140, height: 40, background: 'rgba(206,196,175,0.9)', transform: `rotate(${r}deg)`}} />
        ))}
        <div style={{position: 'absolute', right: 60, top: 930, width: 520, border: `2px solid ${G}`, padding: '22px 26px', background: '#FBF8EF', opacity: ip(f, 20, 34)}}>
          <div style={mono(16, O)}>herbarium · sea, signora</div>
          <div style={{...ital(46, G), marginTop: 10}}>Amaranthus</div>
          <div style={{...mono(16, G), marginTop: 12, lineHeight: 1.7}}>{'found: via fiori chiari 32\nuse: centrepiece, conversation'}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 22 · a fabric sample card
const Swatch: React.FC = () => {
  const f = useCurrentFrame();
  const zig = Array.from({length: 31}, (_, i) => `${i * 26} ${i % 2 ? 0 : 18}`).join(' L ');
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{...center, top: 285, ...mono(20, SA)}}>sample book</div>
      <div style={{...center, top: 322, ...ital(64, I)}}>the room, by the metre</div>
      <div style={{position: 'absolute', left: 140, width: 800, top: 470, height: 1050, background: '#F6F1E4', boxShadow: '0 24px 50px rgba(0,0,0,0.4)', transform: `translateY(${(1 - pop(f, 6)) * 400}px)`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 760, overflow: 'hidden'}}>
          <Media m={p('f14')} />
          <svg width={800} height={20} viewBox="0 0 780 18" preserveAspectRatio="none" style={{position: 'absolute', left: 0, bottom: -1}}><path d={`M ${zig} L 780 18 L 0 18 Z`} fill="#F6F1E4" /></svg>
        </div>
        <div style={{position: 'absolute', left: 50, top: 800, ...mono(16, O)}}>ref. 32 · sea, signora</div>
        <div style={{position: 'absolute', left: 46, top: 840, ...ital(56, G)}}>fringe & velvet</div>
        <div style={{position: 'absolute', left: 50, top: 930, ...mono(16, G)}}>best with candlelight</div>
      </div>
    </AbsoluteFill>
  );
};

// 23 · autumn at the door: leaves falling over the pumpkins
const Autumn: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('v0097', 0, {rate: 0.62})} />
      {Array.from({length: 18}, (_, i) => {
        const x = (i * 211) % 1000 + 20, sp = 4 + (i % 4), y = ((f * sp + i * 150) % 2100) - 120;
        return <div key={i} style={{position: 'absolute', left: x + Math.sin((f + i * 20) / 14) * 40, top: y, width: 46, height: 26, borderRadius: '0 100% 0 100%',
          background: [O, SA, '#C9572A', '#D9A441'][i % 4], transform: `rotate(${f * (3 + i % 3) + i * 40}deg)`, opacity: 0.9}} />;
      })}
      {topShade(560, 0.7)}
      <Head k="sea, signora" t="autumn is at the door" f={f} />
    </AbsoluteFill>
  );
};

// ── the bar, the caviar, the menu, the wine ────────────────────────────────────────────────

// 24 · the cocktail, seen through a glass
const Glass: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{...center, top: 285, ...mono(20, SA)}}>the bar</div>
      <div style={{...center, top: 322, ...ital(64, I)}}>golden hour, in a glass</div>
      <svg width={0} height={0} style={{position: 'absolute'}}><defs><clipPath id="martini" clipPathUnits="objectBoundingBox">
        <path d="M 0 0 L 1 0 L 0.56 0.5 L 0.56 0.9 L 0.8 0.97 L 0.8 1 L 0.2 1 L 0.2 0.97 L 0.44 0.9 L 0.44 0.5 Z" /></clipPath></defs></svg>
      <div style={{position: 'absolute', left: 90, top: 450, width: 900, height: 1100, borderRadius: '450px 450px 24px 24px', overflow: 'hidden', transform: `scale(${0.94 + 0.06 * ip(f, 0, 30, 0, 1, io)})`}}>
        <Media m={v('v4255', 4.9)} />
      </div>
    </AbsoluteFill>
  );
};

// 25 · three glasses: you, me and whoever is late
const ThreeGlasses: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('v7464', 5.3)} />
      {topShade(600, 0.7)}
      <Head k="sea, signora" t="three glasses" f={f} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 440, display: 'flex', justifyContent: 'space-between'}}>
        {['you', 'me', 'whoever is late'].map((t, i) => <span key={t} style={{padding: '10px 18px', background: i === 2 ? O : 'rgba(248,246,245,0.9)', ...mono(20, i === 2 ? I : G),
          opacity: ip(f, 30 + i * 20, 40 + i * 20)}}>{t}</span>)}
      </div>
    </AbsoluteFill>
  );
};

// 26 · eye-tracking study of the menu
const Heatmap: React.FC = () => {
  const f = useCurrentFrame();
  const blobs: [number, number, number, number][] = [[330, 900, 220, 20], [720, 1100, 180, 40], [420, 1300, 160, 60], [760, 760, 140, 80]];
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('v7427', 5.3)} style={{filter: 'blur(3px)'}} />
      {blobs.map(([x, y, r, at], i) => (
        <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', mixBlendMode: 'multiply',
          background: 'radial-gradient(circle, rgba(220,30,20,0.85) 0%, rgba(239,120,24,0.7) 35%, rgba(226,196,36,0.45) 60%, transparent 72%)', transform: `scale(${pop(f, at)})`}} />
      ))}
      {topShade(600, 0.8)}
      <div style={{...center, top: 285, ...mono(20, SA)}}>eye-tracking study · the menu</div>
      <div style={{...center, top: 322, ...ital(64, I)}}>where everyone looks first</div>
      <div style={{...center, top: 430, ...mono(22, O), opacity: ip(f, 110, 125)}}>result: everywhere</div>
    </AbsoluteFill>
  );
};

// 27 · the caviar safe
const Safe: React.FC = () => {
  const f = useCurrentFrame();
  const dial = interpolate(f, [0, 30, 50, 70], [0, 220, 90, 300], {extrapolateRight: 'clamp', easing: io});
  const open = ip(f, 80, 110, 0, 1, io);
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('v4242', 7)} />
      <div style={{position: 'absolute', inset: 0, background: '#2b2f2a', transformOrigin: '0 50%', transform: `perspective(2000px) rotateY(${-open * 100}deg)`, opacity: 1 - ip(f, 104, 112)}}>
        <div style={{position: 'absolute', inset: 40, border: '4px solid #4a4f48', borderRadius: 20}} />
        <div style={{...center, top: 300, ...mono(22, SA)}}>sea, signora · caviar service</div>
        <div style={{position: 'absolute', left: 290, top: 700, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #6a6f66, #3a3e38)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          transform: `rotate(${dial}deg)`}}>
          {Array.from({length: 40}, (_, i) => <div key={i} style={{position: 'absolute', left: 248, top: 10, width: 4, height: i % 5 ? 20 : 40, background: I, transformOrigin: '2px 240px', transform: `rotate(${i * 9}deg)`}} />)}
          <div style={{position: 'absolute', left: 200, top: 200, width: 100, height: 100, borderRadius: '50%', background: O}} />
        </div>
        <div style={{position: 'absolute', left: 530, top: 660, width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: `24px solid ${O}`}} />
      </div>
      {topShade(560, 0.6 * open)}
      <div style={{...center, top: 285, ...mono(20, SA), opacity: open}}>caviar service</div>
      <div style={{...center, top: 322, ...ital(66, I), opacity: open}}>handle with care</div>
    </AbsoluteFill>
  );
};

// 28 · popular times: live
const Popular: React.FC = () => {
  const f = useCurrentFrame();
  const bars: [string, number][] = [['19', 0.35], ['20', 0.62], ['21', 0.95], ['22', 0.8], ['23', 0.55]];
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('v0114', 6.3)} />
      <div style={{position: 'absolute', left: 70, width: 940, top: 290, height: 470, borderRadius: 30, background: 'rgba(248,246,245,0.94)', padding: '30px 40px', boxSizing: 'border-box'}}>
        <div style={mono(18, G)}>sea, signora · popular times</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 14}}>
          <div style={{width: 16, height: 16, borderRadius: '50%', background: O, opacity: 0.5 + 0.5 * Math.sin(f / 4)}} /><span style={ital(40, G)}>live: busier than usual</span>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, height: 220, marginTop: 20}}>
          {bars.map(([h, val], i) => (
            <div key={h} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
              <div style={{width: '100%', height: `${val * 85 * ip(f, 6 + i * 6, 30 + i * 6)}%`, borderRadius: 8, background: i === 2 ? O : 'rgba(27,47,28,0.35)'}} />
              <div style={{...mono(16, G), marginTop: 8}}>{h}:00</div>
            </div>
          ))}
        </div>
      </div>
      {f >= 70 && <Chip cta={{label: 'book a table', color: 'orange', y: 380}} />}
    </AbsoluteFill>
  );
};

// 29 · mirror, mirror
const Mirror: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('v0104', 7.1)} />
      {topShade(620, 0.75)}
      <div style={{...center, top: 285, ...ital(70, I)}}>mirror, mirror</div>
      <div style={{...center, top: 385, ...ital(70, I, {transform: 'scaleX(-1)', opacity: 0.35})}}>mirror, mirror</div>
      <div style={{...center, top: 490, ...mono(20, SA), opacity: ip(f, 30, 45)}}>who's having the best dinner in brera</div>
    </AbsoluteFill>
  );
};

// 30 · share everything: plates passing across the table
const Share: React.FC = () => {
  const f = useCurrentFrame();
  const d = (a: number) => ip(f, a, a + 22, 0, 1, io);
  return (
    <AbsoluteFill style={{background: N}}>
      <Box b={{left: 0, top: 600, width: 1080, height: 1320}} m={p('f56', {fx: 50, fy: 40})} />
      <Head k="house rule" t="share everything" f={f} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}} fill="none" stroke={O} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round">
        <path pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(20)} d="M 180 500 C 360 440, 720 440, 900 500 M 900 500 L 850 470 M 900 500 L 848 530" />
      </svg>
    </AbsoluteFill>
  );
};

type Spec = {id: string; day: string; sec: number; view: React.FC; screen: string; caption: string; hashtags: string[]; cta?: string};
const tags = (...t: string[]) => ['#seasignora', ...t];
export const FRESH5: Spec[] = [
  {id: 'J-01v-overheard', day: '1', sec: 8, view: Overheard, screen: 'overheard at the table / “Is this the table by the aquarium?” · “Same again, please.” · “We are definitely coming back.”',
    caption: 'Overheard at the table: “We are definitely coming back.”', hashtags: tags('#brera', '#milan', '#dinner')},
  {id: 'J-02v-pour-decisions', day: '1', sec: 7, view: Pour, screen: 'good pour decisions / ask us for the bottle',
    caption: 'Good pour decisions only. Ask us for the bottle.', hashtags: tags('#wine', '#brera', '#milan')},
  {id: 'J-03v-herbarium', day: '1', sec: 7, view: Herbarium, screen: 'herbarium · sea, signora / Amaranthus / found: via fiori chiari 32 · use: centrepiece, conversation',
    caption: 'From our herbarium: amaranthus, found at Via Fiori Chiari 32. Use: centrepiece, conversation.', hashtags: tags('#flowers', '#interiors', '#brera')},
  {id: 'J-04v-caviar-safe', day: '1', sec: 7, view: Safe, screen: 'sea, signora · caviar service / handle with care',
    caption: 'Caviar service: handle with care.', hashtags: tags('#caviar', '#brera', '#milan')},
  {id: 'J-05v-clink', day: '1', sec: 6, view: Clink, screen: 'CLINK!',
    caption: 'Clink.', hashtags: tags('#cheers', '#friends', '#brera')},
  {id: 'J-06v-good-company', day: '2', sec: 8, view: LongTable, screen: 'GOOD COMPANY / sea, signora · brera',
    caption: 'Good company, long table, Brera.', hashtags: tags('#friends', '#dinner', '#brera')},
  {id: 'J-07v-blueprint', day: '2', sec: 7, view: Blueprint, screen: 'sea, signora · the plan / drawn for staying late / velvet · candlelight · seats for two / designed for long dinners',
    caption: 'Drawn for staying late: velvet, candlelight and seats for two.', hashtags: tags('#interiors', '#brera', '#milan')},
  {id: 'J-08v-heatmap', day: '2', sec: 7, view: Heatmap, screen: 'eye-tracking study · the menu / where everyone looks first / result: everywhere',
    caption: 'Eye-tracking study of our menu: where everyone looks first. Result: everywhere.', hashtags: tags('#menu', '#brera', '#milan')},
  {id: 'J-09v-first-bite', day: '2', sec: 6, view: FirstBite, screen: '3 · 2 · 1 / first bite',
    caption: '3, 2, 1, first bite.', hashtags: tags('#dinner', '#brera', '#milan')},
  {id: 'J-10v-table-talk', day: '3', sec: 8, view: Matted, screen: 'table talk / menu first, gossip second',
    caption: 'Menu first, gossip second.', hashtags: tags('#friends', '#brera', '#milan')},
  {id: 'J-11v-bubbles', day: '3', sec: 7, view: Bubbles, screen: 'sea, signora / under the sea, above Brera',
    caption: 'Under the sea, above Brera.', hashtags: tags('#aquarium', '#brera', '#milan')},
  {id: 'J-12v-golden-hour', day: '3', sec: 7, view: Glass, screen: 'the bar / golden hour, in a glass',
    caption: 'Golden hour, in a glass. At the bar.', hashtags: tags('#cocktails', '#bar', '#brera')},
  {id: 'J-13v-mood', day: '3', sec: 6, view: Mood, screen: "tonight's mood: cozy ↔ festive / result: both",
    caption: "Tonight's mood: cozy or festive? Both.", hashtags: tags('#brera', '#milan', '#nightout')},
  {id: 'J-14v-tally', day: '4', sec: 8, view: Tally, screen: 'the long table / seats 12 · glasses 24 · stories ∞',
    caption: 'The long table: twelve seats, twenty-four glasses, endless stories.', hashtags: tags('#friends', '#dinner', '#brera')},
  {id: 'J-15v-caution', day: '4', sec: 6, view: Warning, screen: 'CAUTION / flambé in progress',
    caption: 'Caution: flambé in progress.', hashtags: tags('#flambe', '#openkitchen', '#brera')},
  {id: 'J-16v-swatch', day: '4', sec: 7, view: Swatch, screen: 'sample book / the room, by the metre / ref. 32 · fringe & velvet · best with candlelight',
    caption: 'The room, by the metre: fringe and velvet, best with candlelight.', hashtags: tags('#interiors', '#brera', '#milan')},
  {id: 'J-17v-details', day: '4', sec: 7, view: Details, screen: 'in the details / the glass · the table · the company',
    caption: 'In the details: the glass, the table, the company.', hashtags: tags('#dinner', '#brera', '#milan')},
  {id: 'J-18v-front-row', day: '5', sec: 8, view: FrontRow, screen: 'front-row seats / ↓ the open kitchen',
    caption: 'Front-row seats, facing the open kitchen.', hashtags: tags('#openkitchen', '#brera', '#milan')},
  {id: 'J-19v-three-glasses', day: '5', sec: 7, view: ThreeGlasses, screen: 'three glasses / you · me · whoever is late',
    caption: 'Three glasses: you, me and whoever is late.', hashtags: tags('#wine', '#friends', '#brera')},
  {id: 'J-20v-full-moon', day: '5', sec: 7, view: Moon, screen: 'a full moon over Brera / and a full table under it',
    caption: 'A full moon over Brera, and a full table under it.', hashtags: tags('#candlelight', '#brera', '#milan')},
  {id: 'J-21v-miniature', day: '5', sec: 6, view: Miniature, screen: 'tilt-shift / a little world, big flavours',
    caption: 'A little world, big flavours.', hashtags: tags('#sharing', '#brera', '#milan')},
  {id: 'J-22v-popular-times', day: '6', sec: 7, view: Popular, screen: 'sea, signora · popular times / live: busier than usual / 19:00–23:00', cta: 'book a table',
    caption: 'Popular times: live, busier than usual. Book your table.', hashtags: tags('#brera', '#milan', '#dinner')},
  {id: 'J-23v-laugh-track', day: '6', sec: 7, view: LaughTrack, screen: 'laugh track',
    caption: 'Laugh track, recorded live at Sea, Signora.', hashtags: tags('#friends', '#brera', '#milan')},
  {id: 'J-24v-clock', day: '6', sec: 7, view: TableClock, screen: 'what time is dinner / aperitivo · raw bar · pasta · dessert / all evening, obviously',
    caption: 'What time is dinner? All evening, obviously.', hashtags: tags('#sharing', '#brera', '#milan')},
  {id: 'J-25v-place-card', day: '6', sec: 6, view: PlaceCard, screen: 'sea, signora · reserved for / You / via fiori chiari 32', cta: 'book a table',
    caption: 'Your place card is ready. Your table too.', hashtags: tags('#brera', '#dinner', '#milan')},
  {id: 'J-26v-mirror', day: '7', sec: 7, view: Mirror, screen: "mirror, mirror / who's having the best dinner in brera",
    caption: "Mirror, mirror: who's having the best dinner in Brera?", hashtags: tags('#brera', '#milan', '#interiors')},
  {id: 'J-27v-autumn', day: '7', sec: 7, view: Autumn, screen: 'sea, signora / autumn is at the door',
    caption: 'Autumn is at the door. Come in, it is warm inside.', hashtags: tags('#autumn', '#brera', '#milan')},
  {id: 'J-28v-pop', day: '7', sec: 6, view: Halftone, screen: "the girls' table · sea, signora / POP!",
    caption: "The girls' table.", hashtags: tags('#friends', '#brera', '#milan')},
  {id: 'J-29v-ruler', day: '7', sec: 6, view: Ruler, screen: 'one long table / ∞ cm of conversation',
    caption: 'One long table, endless conversation.', hashtags: tags('#dinner', '#brera', '#milan')},
  {id: 'J-30v-share', day: '7', sec: 6, view: Share, screen: 'house rule / share everything',
    caption: 'House rule: share everything.', hashtags: tags('#sharing', '#brera', '#milan')},
];
