import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Round of 16.11 evening (client: «ещё новый контент и не используй материалы, которые уже использовал»): only material that
// never appeared in any story or reel before — 19 frames of the photographer's shoot that were left out (wine, flowers,
// carpaccio, crudo, burrata, red tuna, pasta, lamb, king crab) and year clips no edit ever used (bottle opening, the grill,
// the pan, plating, the raw bar ice, candles being lit, the busy room). English only, no team. 14 new mechanics: nutrition
// label, VHS rewind, gift box, thermometer, colour swatches, light switch, horoscope, slow-motion dial, jigsaw, thermal
// camera, detective board, pairings, spin the bottle, slide light table.

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
const p = (n: string, o: Partial<M> = {}): M => ({src: `w13/${n}.jpg`, ...o});
const v = (n: string, at: number, o: Partial<M> = {}): M => ({src: `y2/${n}.mp4`, at, ...o});
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

// 1 · dinner facts: a nutrition label
const Facts: React.FC = () => {
  const f = useCurrentFrame();
  const rows: [string, string][] = [['Raw bar', '100%'], ['Pasta', '100%'], ['Wine', 'as needed'], ['Laughter', 'unlimited'], ['Dessert', '0% regret']];
  return (
    <AbsoluteFill style={{background: SA}}>
      <div style={{position: 'absolute', left: 110, width: 860, top: 290, height: 1250, background: I, border: `6px solid ${N}`, boxSizing: 'border-box', padding: '30px 40px'}}>
        <div style={disp(100, N, {letterSpacing: 2})}>DINNER FACTS</div>
        <div style={{height: 3, background: N, margin: '18px 0'}} />
        <div style={ital(38, N)}>Serving size: one long evening</div>
        <div style={{...ital(38, N), marginTop: 6}}>Servings per table: share everything</div>
        <div style={{height: 16, background: N, margin: '20px 0 14px'}} />
        <div style={{display: 'flex', justifyContent: 'space-between', ...mono(18, N)}}><span>amount per evening</span><span>% daily joy</span></div>
        <div style={{height: 3, background: N, margin: '12px 0 0'}} />
        {rows.map(([a, b], i) => (
          <div key={a} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '16px 0', borderBottom: `2px solid ${N}`, opacity: ip(f, 14 + i * 12, 26 + i * 12)}}>
            <span style={serif(44, N)}>{a}</span><span style={mono(28, i < 2 ? O : N, {letterSpacing: 1})}>{b}</span>
          </div>
        ))}
        <Box b={{left: 40, right: 40, top: 920, height: 290}} m={p('f38')} />
      </div>
    </AbsoluteFill>
  );
};

// 2 · VHS: rewind to last night
const Vhs: React.FC = () => {
  const f = useCurrentFrame();
  const rew = f < 48;
  return (
    <AbsoluteFill style={{background: N}}>
      <Sequence durationInFrames={48}><AbsoluteFill><Media m={v('velvet-booth', 5, {rate: 3})} style={{filter: 'saturate(1.4) contrast(1.1)'}} /></AbsoluteFill></Sequence>
      <Sequence from={48}><AbsoluteFill><Media m={v('velvet-booth', 1)} style={{filter: 'saturate(1.25) contrast(1.05)'}} /></AbsoluteFill></Sequence>
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 2px, transparent 2px 5px)'}} />
      {rew && <div style={{position: 'absolute', left: 0, right: 0, top: (f * 53) % 1920, height: 70, background: 'rgba(255,255,255,0.18)', filter: 'blur(6px)'}} />}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 560, background: 'linear-gradient(rgba(11,11,11,0.65), rgba(11,11,11,0))'}} />
      <div style={{position: 'absolute', left: 80, top: 285, ...mono(40, I, {textShadow: '2px 0 0 rgba(255,0,80,0.7), -2px 0 0 rgba(0,200,255,0.7)'})}}>{rew ? '◀◀ REW' : '▶ PLAY'}</div>
      <div style={{position: 'absolute', right: 80, top: 285, ...mono(40, I, {textShadow: '2px 0 0 rgba(255,0,80,0.7), -2px 0 0 rgba(0,200,255,0.7)'})}}>SP</div>
      <div style={{position: 'absolute', left: 80, top: 360, ...ital(70, I), opacity: ip(f, 60, 75)}}>last night at Sea, Signora</div>
      <div style={{position: 'absolute', left: 80, top: 455, ...mono(22, I), opacity: ip(f, 75, 90)}}>tonight: your turn</div>
    </AbsoluteFill>
  );
};

// 3 · a gift from the kitchen
const Regalo: React.FC = () => {
  const f = useCurrentFrame();
  const lid = ip(f, 26, 56, 0, 1, io), rise = ip(f, 50, 85, 0, 1, Easing.out(Easing.back(1.2)));
  return (
    <AbsoluteFill style={{background: O}}>
      <div style={{...center, top: 285, ...mono(20, G)}}>sea, signora</div>
      <div style={{...center, top: 322, ...ital(64, I)}}>a little gift from the kitchen</div>
      <div style={{position: 'absolute', left: 240, top: 1000 - rise * 520, width: 600, height: 600, borderRadius: '50%', overflow: 'hidden', border: `14px solid ${I}`,
        boxSizing: 'border-box', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'}}><Media m={p('f45', {fx: 52})} /></div>
      <div style={{position: 'absolute', left: 190, top: 1020, width: 700, height: 440, background: G, boxShadow: '0 30px 60px rgba(0,0,0,0.3)'}}>
        <div style={{position: 'absolute', left: 310, top: 0, width: 80, height: 440, background: I}} />
      </div>
      <div style={{position: 'absolute', left: 170, top: 900, width: 740, height: 140, background: G, boxShadow: '0 10px 20px rgba(0,0,0,0.25)', transformOrigin: '100% 100%',
        transform: `translate(${lid * 260}px, ${-lid * 420}px) rotate(${lid * 24}deg)`, opacity: 1 - ip(f, 50, 62)}}>
        <div style={{position: 'absolute', left: 330, top: 0, width: 80, height: 140, background: I}} />
      </div>
      <div style={{...center, top: 1490, ...ital(52, G), opacity: ip(f, 85, 100)}}>burrata with red prawn</div>
    </AbsoluteFill>
  );
};

// 4 · thermometer over the raw bar ice
const Gelo: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [10, 120], [18, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: io});
  return (
    <AbsoluteFill style={{background: N}}>
      <Box b={{left: 0, top: 620, width: 1080, height: 1300}} m={v('kf0102', 0, {rate: 0.9, fy: 60})} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, height: 140, background: 'linear-gradient(#0B0B0B, rgba(11,11,11,0))'}} />
      <div style={{position: 'absolute', left: 80, top: 285, ...mono(20, I)}}>the raw bar</div>
      <div style={{position: 'absolute', left: 80, top: 322, ...ital(70, I)}}>served on ice</div>
      <div style={{position: 'absolute', left: 400, top: 470, width: 600, height: 70, borderRadius: 35, background: 'rgba(248,246,245,0.9)'}}>
        <div style={{position: 'absolute', left: 90, top: 22, width: 480, height: 26, borderRadius: 13, background: 'rgba(27,47,28,0.15)'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${8 + (t / 18) * 92}%`, borderRadius: 13, background: O}} />
        </div>
        <div style={{position: 'absolute', left: 10, top: -15, width: 100, height: 100, borderRadius: '50%', background: O}} />
      </div>
      <div style={{position: 'absolute', left: 80, top: 430, ...serif(140, I, {textShadow: '0 4px 20px rgba(0,0,0,0.6)'})}}>{Math.round(t)}°C</div>
    </AbsoluteFill>
  );
};

// 5 · the colours of tonight's pasta
const Palette: React.FC = () => {
  const f = useCurrentFrame();
  const sw: [string, string, string][] = [['#C2381E', 'Tomato', 'SS 32-01'], ['#5B7F35', 'Basil', 'SS 32-02'], ['#E7B9A8', 'Signora pink', 'SS 32-03'], ['#D6A23F', 'Olive oil', 'SS 32-04']];
  return (
    <AbsoluteFill style={{background: I}}>
      <div style={{...center, top: 285, ...mono(20, O)}}>the colours of tonight</div>
      <Box b={{left: 70, top: 340, width: 940, height: 720, borderRadius: 6}} m={p('f107', {fy: 55})} />
      <div style={{position: 'absolute', left: 70, width: 940, top: 1100, display: 'flex', justifyContent: 'space-between'}}>
        {sw.map(([c, n, code], i) => {
          const s = ip(f, 20 + i * 10, 40 + i * 10, 0, 1, Easing.out(Easing.back(1.4)));
          return (
            <div key={n} style={{width: 220, height: 340, background: '#FFFFFF', boxShadow: '0 10px 24px rgba(0,0,0,0.12)', transform: `translateY(${(1 - s) * 200}px)`, opacity: Math.min(1, s * 2)}}>
              <div style={{height: 220, background: c}} />
              <div style={{padding: '18px 16px'}}>
                <div style={mono(14, N, {letterSpacing: 2})}>{code}</div>
                <div style={{...ital(34, N), marginTop: 8}}>{n}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{...center, top: 1470, ...mono(18, G), opacity: ip(f, 70, 85)}}>sea, signora · via fiori chiari 32</div>
    </AbsoluteFill>
  );
};

// 6 · switch on the evening
const Interruttore: React.FC = () => {
  const f = useCurrentFrame();
  const on = ip(f, 40, 48, 0, 1);
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('lighting-candles', 2)} style={{filter: `brightness(${0.12 + on * 0.95})`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 700, background: 'linear-gradient(rgba(11,11,11,0.55), rgba(11,11,11,0))', opacity: on}} />
      <div style={{position: 'absolute', left: 430, top: 300, width: 220, height: 330, borderRadius: 20, background: I, boxShadow: '0 16px 30px rgba(0,0,0,0.5)'}}>
        <div style={{position: 'absolute', left: 70, top: 65, width: 80, height: 200, borderRadius: 14, background: '#e2ded6', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.2)'}}>
          <div style={{position: 'absolute', left: 6, width: 68, height: 92, borderRadius: 10, background: on > 0.5 ? O : '#cfcac0', top: 6 + (1 - on) * 96,
            boxShadow: '0 4px 8px rgba(0,0,0,0.25)'}} />
        </div>
      </div>
      <div style={{...center, top: 680, ...ital(70, I)}}>{on > 0.5 ? 'and the evening begins' : 'switch on the evening'}</div>
    </AbsoluteFill>
  );
};

// 7 · tonight's horoscope
const Oroscopo: React.FC = () => {
  const f = useCurrentFrame();
  const signs: [string, string][] = [['Aries', 'Fire sign. Order something from the grill.'], ['Pisces', 'Obviously, the raw bar.'], ['Taurus', 'Treat yourself to the lamb.'],
    ['Libra', "Can't choose? Share everything."], ['Gemini', 'Two desserts. One for each of you.']];
  return (
    <AbsoluteFill style={{background: G}}>
      <Media m={v('oil-pour', 0, {rate: 0.58})} style={{filter: 'blur(18px) brightness(0.35)', transform: 'scale(1.15)'}} />
      <div style={{...center, top: 285, ...mono(20, SA)}}>sea, signora</div>
      <div style={{...center, top: 322, ...disp(84, I, {letterSpacing: 4})}}>{"TONIGHT'S\nHOROSCOPE"}</div>
      {signs.map(([s, t], i) => (
        <div key={s} style={{position: 'absolute', left: 110, right: 110, top: 560 + i * 190, height: 170, borderTop: '2px solid rgba(206,196,175,0.35)', paddingTop: 22,
          opacity: ip(f, 20 + i * 18, 34 + i * 18), transform: `translateY(${(1 - ip(f, 20 + i * 18, 34 + i * 18)) * 30}px)`}}>
          <div style={mono(22, O)}>{s}</div>
          <div style={{...ital(50, I), marginTop: 10}}>{t}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// 8 · slow motion: the cork
const Lento: React.FC = () => {
  const f = useCurrentFrame();
  const r = ip(f, 30, 60, 1, 0.3, io);
  const ang = -90 + ((r - 0.3) / 0.7) * 180;
  return (
    <AbsoluteFill style={{background: N}}>
      <Sequence durationInFrames={45}><AbsoluteFill><Media m={v('bottle-open', 9)} /></AbsoluteFill></Sequence>
      <Sequence from={45}><AbsoluteFill><Media m={v('bottle-open', 10.5, {rate: 0.3})} /></AbsoluteFill></Sequence>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 700, background: 'linear-gradient(rgba(11,11,11,0.7), rgba(11,11,11,0))'}} />
      <svg width={360} height={200} viewBox="0 0 360 200" style={{position: 'absolute', left: 60, top: 290}}>
        <path d="M 20 180 A 160 160 0 0 1 340 180" fill="none" stroke="rgba(248,246,245,0.35)" strokeWidth={10} />
        <path d="M 20 180 A 160 160 0 0 1 340 180" fill="none" stroke={O} strokeWidth={10} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - (r - 0.3) / 0.7} />
        <line x1={180} y1={180} x2={180 + 130 * Math.cos(((ang - 90) * Math.PI) / 180)} y2={180 + 130 * Math.sin(((ang - 90) * Math.PI) / 180)} stroke={I} strokeWidth={6} strokeLinecap="round" />
        <circle cx={180} cy={180} r={12} fill={I} />
      </svg>
      <div style={{position: 'absolute', left: 60, width: 360, top: 500, textAlign: 'center', ...mono(34, I)}}>{r.toFixed(2)}x</div>
      <div style={{position: 'absolute', left: 80, top: 580, ...ital(74, I), opacity: ip(f, 60, 75)}}>{'slow down.\nit\'s dinner.'}</div>
    </AbsoluteFill>
  );
};

// 9 · jigsaw: every piece in place
const Puzzle: React.FC = () => {
  const f = useCurrentFrame();
  const C = 4, R = 5, W = 900, H = 1125, tw = W / C, th = H / R;
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{...center, top: 285, ...mono(20, SA)}}>sea, signora</div>
      <div style={{...center, top: 322, ...ital(64, I)}}>every piece in place</div>
      <div style={{position: 'absolute', left: 90, top: 430, width: W, height: H}}>
        {Array.from({length: C * R}, (_, i) => {
          const c = i % C, r = Math.floor(i / C);
          const seed = (i * 73) % 17;
          const s = ip(f, 6 + seed * 4, 30 + seed * 4, 0, 1, io);
          const dx = ((seed % 5) - 2) * 260, dy = ((seed % 3) - 1) * 300 + (r < 2 ? -400 : 400);
          return (
            <div key={i} style={{position: 'absolute', left: c * tw, top: r * th, width: tw, height: th, overflow: 'hidden',
              transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy}px) rotate(${(1 - s) * (seed - 8) * 6}deg)`, opacity: Math.min(1, s * 3),
              boxShadow: s < 1 ? '0 10px 20px rgba(0,0,0,0.35)' : 'none'}}>
              <Img src={staticFile('photos/w13/f53.jpg')} style={{position: 'absolute', left: -c * tw, top: -r * th, width: W, height: H, objectFit: 'cover', maxWidth: 'none'}} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 10 · thermal camera on the grill
const Termico: React.FC = () => {
  const f = useCurrentFrame();
  const wipe = ip(f, 80, 120, 0, 100, io);
  return (
    <AbsoluteFill style={{background: N}}>
      <svg width={0} height={0} style={{position: 'absolute'}}><filter id="th" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.05 0.35 0.85 1 1 1" /><feFuncG type="table" tableValues="0 0 0.1 0.45 0.85 1" /><feFuncB type="table" tableValues="0.25 0.55 0.35 0 0.15 0.9" />
        </feComponentTransfer></filter></svg>
      <Media m={v('grill-coals', 0, {rate: 0.7})} />
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(${wipe}% 0 0 0)`}}><Media m={v('grill-coals', 0, {rate: 0.7})} style={{filter: 'url(#th) contrast(1.2)'}} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 520, background: 'linear-gradient(rgba(11,11,11,0.6), rgba(11,11,11,0))'}} />
      <div style={{position: 'absolute', left: 80, top: 285, ...mono(20, I)}}>thermal view</div>
      <div style={{position: 'absolute', left: 80, top: 322, ...ital(70, I)}}>hot from the grill</div>
      <div style={{position: 'absolute', right: 80, top: 300, ...mono(44, I), opacity: 1 - ip(f, 80, 95)}}>{Math.round(interpolate(f, [0, 80], [180, 320], {extrapolateRight: 'clamp'}))}°C</div>
      <svg width={200} height={200} style={{position: 'absolute', left: 440, top: 1000, opacity: 1 - ip(f, 80, 95)}} fill="none" stroke={I} strokeWidth={4}>
        <path d="M 0 40 L 0 0 L 40 0 M 160 0 L 200 0 L 200 40 M 200 160 L 200 200 L 160 200 M 40 200 L 0 200 L 0 160" /><circle cx={100} cy={100} r={6} fill={I} />
      </svg>
    </AbsoluteFill>
  );
};

// 11 · the detective board
const Indagine: React.FC = () => {
  const f = useCurrentFrame();
  const ph: [number, number, number, string, M][] = [[90, 330, -3, 'clue 01: the wine', p('f1', {fy: 45})], [590, 330, 2, 'clue 02: the flowers', p('f12')],
    [90, 1010, 2, 'clue 03: the carpaccio', p('f39')], [590, 1010, -2, 'clue 04: the plate', p('f87')]];
  const noteC = [540, 890];
  const pins = ph.map(([x, y]) => [x + 200, y + 18]);
  return (
    <AbsoluteFill style={{background: '#B7A98C'}}>
      {ph.map(([x, y, r, l, m], i) => (
        <div key={l} style={{position: 'absolute', left: x, top: y, width: 400, height: 460, background: I, padding: 16, boxSizing: 'border-box', transform: `rotate(${r}deg) scale(${pop(f, 6 + i * 8)})`,
          boxShadow: '0 10px 20px rgba(0,0,0,0.3)'}}>
          <div style={{width: 368, height: 360, overflow: 'hidden'}}><Media m={m} /></div>
          <div style={{marginTop: 18, ...mono(16, N, {letterSpacing: 2})}}>{l}</div>
        </div>
      ))}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {pins.map(([x, y], i) => {
          const s = ip(f, 50 + i * 8, 66 + i * 8);
          return <line key={i} x1={noteC[0]} y1={noteC[1]} x2={noteC[0] + (x - noteC[0]) * s} y2={noteC[1] + (y - noteC[1]) * s} stroke="#B3261E" strokeWidth={5} />;
        })}
        {pins.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={14} fill={O} opacity={f >= 6 + i * 8 ? 1 : 0} />)}
      </svg>
      <div style={{position: 'absolute', left: 340, top: 830, width: 400, height: 140, background: '#F6E7A8', boxShadow: '0 8px 16px rgba(0,0,0,0.3)', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(f, 40)})`}}>
        <div style={mono(16, N)}>case</div>
        <div style={{...ital(40, N), marginTop: 4}}>dinner in Brera</div>
      </div>
      <div style={{position: 'absolute', left: 300, top: 1495, width: 480, height: 80, border: `6px solid ${O}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...mono(30, O), transform: `rotate(-4deg) scale(${f >= 110 ? 1.6 - 0.6 * pop(f, 110) : 0})`}}>solved: sea, signora</div>
    </AbsoluteFill>
  );
};

// 12 · pairings
const Abbinamenti: React.FC = () => {
  const f = useCurrentFrame();
  const pr: [M, M, string][] = [[p('f26'), p('f3', {fy: 40}), 'raw bar + white'], [p('f64'), p('f2', {fy: 40}), 'lamb + red'], [p('f119'), p('f6', {fy: 40}), 'king crab + white']];
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{...center, top: 285, ...mono(20, SA)}}>sea, signora</div>
      <div style={{...center, top: 322, ...ital(64, I)}}>perfect pairs</div>
      {pr.map(([a, b, l], i) => {
        const s = ip(f, 12 + i * 22, 34 + i * 22, 0, 1, io);
        return (
          <div key={l} style={{position: 'absolute', left: 0, right: 0, top: 440 + i * 360, height: 340}}>
            <div style={{position: 'absolute', left: 130 - (1 - s) * 500, top: 0, width: 280, height: 280, borderRadius: '50%', overflow: 'hidden', border: `8px solid ${I}`, boxSizing: 'border-box'}}><Media m={a} /></div>
            <div style={{position: 'absolute', left: 670 + (1 - s) * 500, top: 0, width: 280, height: 280, borderRadius: '50%', overflow: 'hidden', border: `8px solid ${I}`, boxSizing: 'border-box'}}><Media m={b} /></div>
            <div style={{position: 'absolute', left: 490, width: 100, top: 90, textAlign: 'center', ...mono(80, O), opacity: s}}>+</div>
            <div style={{...center, top: 296, ...mono(20, I), opacity: s}}>{l}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 13 · spin the bottle
const Bottiglia: React.FC = () => {
  const f = useCurrentFrame();
  const vids: M[] = [v('plated-top', 0, {rate: 0.95}), v('pan-fish', 3), v('lobster-roll-plating', 4), v('squeeze-plating', 0, {rate: 0.9}), v('kf0101', 0, {rate: 0.45})];
  const Rr = 360, D = 230, cx = 540, cy = 960;
  const target = 0;
  const rot = interpolate(f, [10, 120], [0, 360 * 4 + target * 72], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const done = f >= 122;
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{...center, top: 285, ...mono(20, SA)}}>sea, signora</div>
      <div style={{...center, top: 322, ...ital(64, I)}}>spin the bottle</div>
      {vids.map((m, i) => {
        const a = ((-90 + i * 72) * Math.PI) / 180;
        return <div key={i} style={{position: 'absolute', left: cx + Rr * Math.cos(a) - D / 2, top: cy + 40 + Rr * Math.sin(a) - D / 2, width: D, height: D, borderRadius: '50%', overflow: 'hidden',
          border: `8px solid ${done && i === target ? O : I}`, boxSizing: 'border-box', transform: `scale(${done && i === target ? 1.08 : 1})`}}><Media m={m} /></div>;
      })}
      <svg width={120} height={380} viewBox="0 0 120 380" style={{position: 'absolute', left: cx - 60, top: cy + 40 - 190, transform: `rotate(${rot}deg)`, transformOrigin: '50% 50%'}}>
        <rect x={45} y={0} width={30} height={70} rx={6} fill={SA} />
        <path d="M 45 70 L 75 70 L 75 120 Q 110 140 110 190 L 110 360 Q 110 380 90 380 L 30 380 Q 10 380 10 360 L 10 190 Q 10 140 45 120 Z" fill={SA} />
        <rect x={22} y={230} width={76} height={90} fill={O} />
      </svg>
      <div style={{...center, top: 1470, ...ital(54, I), opacity: ip(f, 125, 140)}}>tonight: let the kitchen choose</div>
    </AbsoluteFill>
  );
};

// 14 · slides on the light table
const Diapositive: React.FC = () => {
  const f = useCurrentFrame();
  const sl: [number, number, number, M][] = [[110, 380, -3, p('f42')], [560, 400, 2, p('f89')], [110, 860, 2, p('f110')], [560, 880, -2, p('f118')]];
  return (
    <AbsoluteFill style={{background: N}}>
      <div style={{position: 'absolute', left: 60, width: 960, top: 290, height: 1260, borderRadius: 16, background: '#FBF8F0', boxShadow: '0 0 120px rgba(255,240,200,0.35)'}} />
      {sl.map(([x, y, r, m], i) => (
        <div key={i} style={{position: 'absolute', left: x, top: y, width: 410, height: 410, borderRadius: 18, background: '#EDEAE2', boxShadow: '0 6px 14px rgba(0,0,0,0.18)',
          transform: `rotate(${r}deg) translateY(${(1 - pop(f, 8 + i * 12)) * -900}px)`}}>
          <div style={{position: 'absolute', left: 35, top: 90, width: 340, height: 228, overflow: 'hidden', borderRadius: 4}}><Media m={m} /></div>
          <div style={{position: 'absolute', left: 35, top: 36, ...mono(14, G)}}>sea, signora · {String(i + 1).padStart(2, '0')}</div>
          <div style={{position: 'absolute', left: 35, top: 345, ...mono(14, O)}}>brera · milan</div>
        </div>
      ))}
      <div style={{...center, top: 1350, ...ital(60, G), opacity: ip(f, 70, 85)}}>tonight's slideshow</div>
      <div style={{...center, top: 1440, ...mono(18, G), opacity: ip(f, 80, 95)}}>raw bar · red tuna · pasta · king crab</div>
    </AbsoluteFill>
  );
};

type Spec = {id: string; day: string; sec: number; view: React.FC; screen: string; caption: string; hashtags: string[]; cta?: string};
const tags = (...t: string[]) => ['#seasignora', ...t];
export const FRESH4: Spec[] = [
  {id: 'I-01v-dinner-facts', day: '1', sec: 7, view: Facts, screen: 'DINNER FACTS / Serving size: one long evening / Servings per table: share everything / Raw bar 100% · Pasta 100% · Wine as needed · Laughter unlimited · Dessert 0% regret',
    caption: 'Dinner facts: serving size, one long evening. Raw bar 100%, laughter unlimited.', hashtags: tags('#dinner', '#brera', '#milan')},
  {id: 'I-02v-rewind', day: '1', sec: 7, view: Vhs, screen: '◀◀ REW → ▶ PLAY / last night at Sea, Signora / tonight: your turn',
    caption: 'Rewind to last night at Sea, Signora. Tonight, your turn.', hashtags: tags('#brera', '#milan', '#nightout')},
  {id: 'I-03v-gift', day: '2', sec: 7, view: Regalo, screen: 'sea, signora / a little gift from the kitchen / burrata with red prawn',
    caption: 'A little gift from the kitchen: burrata with red prawn.', hashtags: tags('#burrata', '#redprawn', '#brera')},
  {id: 'I-04v-on-ice', day: '2', sec: 7, view: Gelo, screen: 'the raw bar / served on ice / 18° → 0°',
    caption: 'The raw bar, served on ice: prawns, langoustines and the catch of the day.', hashtags: tags('#rawbar', '#seafood', '#brera')},
  {id: 'I-05v-palette', day: '3', sec: 7, view: Palette, screen: 'the colours of tonight / Tomato · Basil · Signora pink · Olive oil / sea, signora · via fiori chiari 32',
    caption: 'The colours of tonight: tomato, basil, olive oil and our own Signora pink.', hashtags: tags('#pasta', '#colours', '#brera')},
  {id: 'I-06v-switch', day: '3', sec: 7, view: Interruttore, screen: 'switch on the evening → and the evening begins',
    caption: 'Switch on the evening: candles lit, tables set.', hashtags: tags('#candlelight', '#brera', '#milan')},
  {id: 'I-07v-horoscope', day: '4', sec: 8, view: Oroscopo, screen: "TONIGHT'S HOROSCOPE / Aries: fire sign, order something from the grill · Pisces: obviously, the raw bar · Taurus: treat yourself to the lamb · Libra: can't choose? share everything · Gemini: two desserts, one for each of you",
    caption: "Tonight's horoscope: Pisces, obviously the raw bar. Libra, share everything. Find your sign.", hashtags: tags('#horoscope', '#dinner', '#brera')},
  {id: 'I-08v-slow-down', day: '4', sec: 7, view: Lento, screen: "1.00x → 0.30x / slow down. it's dinner.",
    caption: "Slow down. It's dinner.", hashtags: tags('#wine', '#brera', '#milan')},
  {id: 'I-09v-puzzle', day: '5', sec: 7, view: Puzzle, screen: 'sea, signora / every piece in place',
    caption: 'Every piece in place: the table is ready for you.', hashtags: tags('#sharing', '#brera', '#milan')},
  {id: 'I-10v-thermal', day: '5', sec: 6, view: Termico, screen: 'thermal view / hot from the grill / 180→320°C',
    caption: 'Thermal view: hot from the grill, straight to your table.', hashtags: tags('#grill', '#openkitchen', '#brera')},
  {id: 'I-11v-case', day: '6', sec: 7, view: Indagine, screen: 'clue 01: the wine · clue 02: the flowers · clue 03: the carpaccio · clue 04: the plate / case: dinner in Brera / solved: sea, signora',
    caption: 'Case: dinner in Brera. Clues: the wine, the flowers, the carpaccio. Solved: Sea, Signora.', hashtags: tags('#brera', '#milan', '#dinner')},
  {id: 'I-12v-pairs', day: '6', sec: 7, view: Abbinamenti, screen: 'perfect pairs / raw bar + white · lamb + red · king crab + white',
    caption: 'Perfect pairs: raw bar with white, lamb with red, king crab with white. Ask us for the bottle.', hashtags: tags('#wine', '#pairing', '#brera')},
  {id: 'I-13v-spin', day: '7', sec: 7, view: Bottiglia, screen: 'spin the bottle / tonight: let the kitchen choose',
    caption: 'Spin the bottle. Tonight, let the kitchen choose.', hashtags: tags('#openkitchen', '#brera', '#milan')},
  {id: 'I-14v-slides', day: '7', sec: 7, view: Diapositive, screen: "tonight's slideshow / raw bar · red tuna · pasta · king crab",
    caption: "Tonight's slideshow: raw bar, red tuna, pasta, king crab.", hashtags: tags('#seafood', '#brera', '#milan')},
];
