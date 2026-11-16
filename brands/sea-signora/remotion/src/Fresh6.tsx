import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// 10 creatives (client 16.11 night: «ещё 10 новых креативов с учётом всего контекста ветки»). What the branch taught:
// she liked the designed objects in the identity (boarding pass, riservato, notifications, the Venn) and her own review
// layout; she disliked gimmicks, weak frames, dull lines, oysters / polpo everywhere, weekdays, the team, Italian copy,
// repeated material, text over faces or dishes. So: quiet printed objects in the brand colours, each on a pro photo that
// was never used before (the photographer's shoot, Pixieset, the aquarium photo she sent), English only, every element
// in its own band inside the 250 / 340 px safe zones.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory, N = '#0B0B0B';
type M = {src: string; fx?: number; fy?: number};
const Pic: React.FC<{m: M; style?: React.CSSProperties}> = ({m, style}) => (
  <Img src={staticFile(`photos/${m.src}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${m.fx ?? 50}% ${m.fy ?? 50}%`, ...style}} />
);
const Box: React.FC<{b: React.CSSProperties; m: M; st?: React.CSSProperties}> = ({b, m, st}) => (
  <div style={{position: 'absolute', overflow: 'hidden', ...b}}><Pic m={m} style={st} /></div>
);
const p = (n: string, o: Partial<M> = {}): M => ({src: `w14/${n}.jpg`, ...o});
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
const rise = (f: number, at: number) => (f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping: 16, stiffness: 120}}));
const io = Easing.inOut(Easing.cubic);
const Kicker: React.FC<{k: string; t: string; kc?: string; tc?: string}> = ({k, t, kc = SA, tc = I}) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{...center, top: 285, ...mono(20, kc), opacity: ip(f, 0, 12)}}>{k}</div>
      <div style={{...center, top: 322, ...ital(64, tc), opacity: ip(f, 4, 18)}}>{t}</div>
    </>
  );
};

// 1 · permanent collection: a dish hung like a painting, with its museum label
const Museo: React.FC = () => {
  const f = useCurrentFrame();
  const light = ip(f, 6, 40);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 34%, rgba(248,246,245,${0.16 * light}), transparent 55%), ${G}`}}>
      <Kicker k="sea, signora · permanent collection" t="on view tonight" />
      <div style={{position: 'absolute', left: 100, top: 470, width: 880, height: 640, background: '#B9A577', boxShadow: '0 30px 60px rgba(0,0,0,0.45), inset 0 0 0 6px #8E7B50',
        padding: 22, boxSizing: 'border-box', opacity: ip(f, 0, 14)}}>
        <div style={{width: '100%', height: '100%', background: I, padding: 46, boxSizing: 'border-box', boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.25)'}}>
          <div style={{width: '100%', height: '100%', overflow: 'hidden'}}><Pic m={p('f41')} style={{filter: `brightness(${0.6 + 0.4 * light})`}} /></div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 520, width: 460, top: 1170, background: I, padding: '30px 34px', boxSizing: 'border-box', boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
        opacity: ip(f, 40, 56), transform: `translateY(${(1 - ip(f, 40, 56)) * 30}px)`}}>
        <div style={mono(15, O)}>room 32</div>
        <div style={{...ital(46, G), marginTop: 12}}>Untitled (Carpaccio)</div>
        <div style={{...serif(28, G), marginTop: 4}}>2025</div>
        <div style={{...serif(26, G, {opacity: 0.8}), marginTop: 16, lineHeight: 1.35}}>Raw fish, citrus and flowers on porcelain</div>
        <div style={{...mono(14, G), marginTop: 20}}>on loan from the kitchen</div>
      </div>
    </AbsoluteFill>
  );
};

// 2 · a postcard from the aquarium, front then back
const Cartolina: React.FC = () => {
  const f = useCurrentFrame();
  const r = ip(f, 95, 125, 0, 180, io);
  const W = 860, H = 1180;
  const face: React.CSSProperties = {position: 'absolute', inset: 0, backfaceVisibility: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.3)'};
  return (
    <AbsoluteFill style={{background: SA}}>
      <div style={{position: 'absolute', left: 110, top: 330, width: W, height: H, perspective: 2600, transform: `rotate(-1.5deg) translateY(${(1 - rise(f, 0)) * 300}px)`}}>
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${r}deg)`}}>
          <div style={{...face, background: I}}>
            <Box b={{left: 28, top: 28, width: W - 56, height: 960}} m={{src: 'w15/aquarium.jpg', fy: 38}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 1010, textAlign: 'center', ...ital(64, G)}}>Greetings from Brera</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 1100, textAlign: 'center', ...mono(16, O)}}>sea, signora · via fiori chiari 32</div>
          </div>
          <div style={{...face, background: '#FBF8F0', transform: 'rotateY(180deg)'}}>
            <div style={{position: 'absolute', left: 60, top: 60, ...mono(16, G)}}>post card · sea, signora</div>
            <div style={{position: 'absolute', right: 60, top: 50, width: 170, height: 210, border: `4px dashed ${O}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: G}}>
              <div style={mark(110, I)}>S</div>
            </div>
            <div style={{position: 'absolute', right: 150, top: 200, width: 210, height: 210, borderRadius: '50%', border: `3px solid rgba(239,120,24,0.75)`, display: 'flex',
              alignItems: 'center', justifyContent: 'center', transform: 'rotate(-14deg)', ...mono(18, 'rgba(239,120,24,0.9)')}}>brera · milano</div>
            <div style={{position: 'absolute', left: 60, width: 560, top: 470, ...ital(50, G, {lineHeight: 1.55})}}>{'Wish you were here.\nThe aquarium says hi,\nthe raw bar too.\nYour table is waiting.'}</div>
            <div style={{position: 'absolute', left: 60, top: 860, ...mark(54, O)}}>Sea, Signora</div>
            {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 60, right: 60, top: 1000 + i * 50, height: 2, background: 'rgba(27,47,28,0.25)'}} />)}
            <div style={{position: 'absolute', left: 60, top: 960, ...mono(18, G)}}>to: you</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3 · telegram
const Telegramma: React.FC = () => {
  const f = useCurrentFrame();
  const lines = ['TABLE READY STOP', 'CANDLES LIT STOP', 'WINE BREATHING STOP', 'COME HUNGRY STOP'];
  const per = 26;
  return (
    <AbsoluteFill style={{background: N}}>
      <Box b={{left: 0, top: 1060, width: 1080, height: 860}} m={p('bo465', {fy: 55})} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1060, height: 160, background: `linear-gradient(${N}, rgba(11,11,11,0))`}} />
      <div style={{position: 'absolute', left: 90, width: 900, top: 290, height: 720, background: '#F3EAD3', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', padding: '40px 50px', boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}><span style={disp(56, G, {letterSpacing: 6})}>TELEGRAM</span><span style={mono(16, O)}>no. 32</span></div>
        <div style={{height: 3, background: G, margin: '18px 0 8px'}} />
        <div style={{display: 'flex', justifyContent: 'space-between', ...mono(15, G)}}><span>from: sea, signora</span><span>to: you</span></div>
        <div style={{height: 1, background: G, margin: '8px 0 34px', opacity: 0.5}} />
        {lines.map((l, i) => {
          const n = Math.floor(interpolate(f, [16 + i * per, 16 + i * per + 20], [0, l.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
          return (
            <div key={l} style={{marginBottom: 22}}>
              <span style={{background: '#FBF7EC', padding: '6px 14px', boxShadow: '0 2px 4px rgba(0,0,0,0.15)', opacity: n > 0 ? 1 : 0,
                fontFamily: fonts.mono, fontWeight: 700, fontSize: 40, letterSpacing: 2, color: G}}>{l.slice(0, n)}</span>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 50, bottom: 40, ...mono(15, O), opacity: ip(f, 130, 145)}}>via fiori chiari 32 · brera</div>
      </div>
    </AbsoluteFill>
  );
};

// 4 · coat check ticket
const Guardaroba: React.FC = () => {
  const f = useCurrentFrame();
  const s = rise(f, 20);
  return (
    <AbsoluteFill style={{background: O}}>
      <Box b={{left: 70, top: 290, width: 940, height: 760}} m={p('bo192', {fy: 35})} />
      <div style={{position: 'absolute', left: 240, width: 600, top: 1110, height: 430, transform: `translateY(${(1 - s) * 500}px) rotate(${(1 - s) * 8 - 2}deg)`}}>
        <div style={{position: 'absolute', inset: 0, background: I, boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          WebkitMaskImage: 'radial-gradient(circle at 0 50%, transparent 28px, black 29px), radial-gradient(circle at 100% 50%, transparent 28px, black 29px)',
          WebkitMaskComposite: 'source-in', maskComposite: 'intersect'} as React.CSSProperties} />
        <div style={{position: 'absolute', left: 270, top: 30, width: 60, height: 60, borderRadius: '50%', background: O}} />
        <div style={{...center, top: 110, ...mono(18, O)}}>coat check · sea, signora</div>
        <div style={{...center, top: 150, ...serif(170, G, {lineHeight: 1})}}>32</div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 340, borderTop: `2px dashed ${G}`}} />
        <div style={{...center, top: 360, ...ital(36, G)}}>your coat stays. so do you.</div>
      </div>
    </AbsoluteFill>
  );
};

// 5 · a contact sheet with the frame of the night circled
const Provino: React.FC = () => {
  const f = useCurrentFrame();
  const fr: M[] = [p('bo169'), p('bo237'), p('f78'), p('bo284'), p('bo239'), p('f82')];
  const W = 440, H = 294;
  const pos = (i: number) => ({x: 90 + (i % 2) * (W + 20), y: 470 + Math.floor(i / 2) * (H + 70)});
  const c = pos(3), draw = ip(f, 70, 100, 0, 1, io);
  return (
    <AbsoluteFill style={{background: '#121212'}}>
      <Kicker k="contact sheet · brera" t="one evening, every frame" kc={O} />
      {fr.map((m, i) => {
        const {x, y} = pos(i);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, opacity: ip(f, 6 + i * 6, 18 + i * 6)}}>
            <div style={{width: W, height: H, overflow: 'hidden'}}><Pic m={m} /></div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, ...mono(14, O, {letterSpacing: 3})}}><span>{`${12 + i}a`}</span><span>sea signora 400</span></div>
          </div>
        );
      })}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}} fill="none" stroke="#E5352B" strokeWidth={9} strokeLinecap="round">
        <path pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}
          d={`M ${c.x - 20} ${c.y + 40} C ${c.x - 30} ${c.y - 40}, ${c.x + W + 40} ${c.y - 40}, ${c.x + W + 20} ${c.y + H / 2} C ${c.x + W + 10} ${c.y + H + 50}, ${c.x - 40} ${c.y + H + 40}, ${c.x - 18} ${c.y + 20}`} />
      </svg>
      <div style={{position: 'absolute', left: 90, top: 1560 - 20, ...ital(44, '#E5352B'), opacity: ip(f, 100, 112)}}>this one: drinks at the counter</div>
    </AbsoluteFill>
  );
};

// 6 · lookbook: Milan dresses for dinner
const Lookbook: React.FC = () => {
  const f = useCurrentFrame();
  const looks: [M, string, string][] = [[p('f90', {fy: 30}), 'look 01', 'white shirt,\nred velvet'], [p('f81', {fy: 40}), 'look 02', 'blue stripes,\nwhite wine']];
  return (
    <AbsoluteFill style={{background: I}}>
      <div style={{...center, top: 285, ...mono(20, O)}}>sea, signora · dinner edit</div>
      <div style={{...center, top: 322, ...disp(110, G, {letterSpacing: 8})}}>LOOKBOOK</div>
      {looks.map(([m, a, b], i) => {
        const s = rise(f, 10 + i * 12);
        return (
          <div key={a} style={{position: 'absolute', left: 80 + i * 480, top: 480, width: 440, transform: `translateY(${(1 - s) * 120}px)`, opacity: Math.min(1, s * 1.5)}}>
            <div style={{width: 440, height: 720, overflow: 'hidden'}}><Pic m={m} /></div>
            <div style={{...mono(16, O), marginTop: 22}}>{a}</div>
            <div style={{...ital(44, G), marginTop: 6}}>{b}</div>
          </div>
        );
      })}
      <div style={{...center, top: 1500, ...mono(18, G), opacity: ip(f, 60, 75)}}>dress code: whatever you like</div>
    </AbsoluteFill>
  );
};

// 7 · seating plan: we saved you a seat
const Pianta: React.FC = () => {
  const f = useCurrentFrame();
  const tables: [number, number, number][] = [[230, 760, 70], [230, 1000, 70], [230, 1240, 70], [850, 1000, 60], [850, 1240, 60], [540, 1340, 70]];
  const you = 3;
  const path = ip(f, 70, 110, 0, 1, io);
  const pulse = 1 + 0.06 * Math.sin(f / 5) * ip(f, 110, 120);
  return (
    <AbsoluteFill style={{background: G}}>
      <Kicker k="sea, signora · seating plan" t="we saved you a seat" />
      <div style={{position: 'absolute', left: 90, top: 480, width: 900, height: 1040, border: `3px solid ${SA}`, boxSizing: 'border-box'}} />
      <div style={{position: 'absolute', left: 90, top: 480, width: 900, height: 90, background: 'rgba(206,196,175,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono(18, SA)}}>open kitchen</div>
      <div style={{position: 'absolute', left: 900, top: 620, width: 90, height: 280, background: 'rgba(206,196,175,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <span style={{...mono(16, SA), transform: 'rotate(90deg)', whiteSpace: 'nowrap'}}>the bar</span>
      </div>
      <div style={{position: 'absolute', left: 430, top: 780, width: 220, height: 220, borderRadius: '50%', border: `3px solid ${SA}`, background: 'rgba(206,196,175,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${rise(f, 6)})`}}><span style={ital(36, SA)}>aquarium</span></div>
      {tables.map(([x, y, r], i) => {
        const s = rise(f, 14 + i * 6), on = i === you;
        return (
          <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, transform: `scale(${s * (on ? pulse : 1)})`}}>
            {Array.from({length: 4}, (_, k) => {
              const a = (k * Math.PI) / 2 + Math.PI / 4;
              return <div key={k} style={{position: 'absolute', left: r + Math.cos(a) * (r + 22) - 14, top: r + Math.sin(a) * (r + 22) - 14, width: 28, height: 28, borderRadius: '50%',
                background: on ? O : 'rgba(206,196,175,0.5)'}} />;
            })}
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: on ? O : SA}} />
          </div>
        );
      })}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}} fill="none" stroke={I} strokeWidth={5} strokeDasharray="4 16" strokeLinecap="round">
        <path d="M 540 1520 C 560 1430, 700 1300, 850 1180" strokeDashoffset={0} opacity={path > 0 ? 1 : 0}
          style={{clipPath: `inset(${(1 - path) * 100}% 0 0 0)`}} />
      </svg>
      <div style={{position: 'absolute', left: 470, top: 1530, ...mono(16, SA)}}>entrance</div>
      <div style={{position: 'absolute', left: 760, top: 900, padding: '8px 18px', background: I, ...mono(18, G), opacity: ip(f, 110, 122)}}>you</div>
      {f >= 125 && <Chip cta={{label: 'book a table', color: 'orange', y: 360}} />}
    </AbsoluteFill>
  );
};

// 8 · luggage tag: destination dinner
const Etichetta: React.FC = () => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 10) * 5 * Math.exp(-f / 70);
  const rows: [string, string][] = [['from', 'wherever you are'], ['to', 'via fiori chiari 32, brera'], ['handle', 'with appetite']];
  return (
    <AbsoluteFill style={{background: SA}}>
      <svg width={1080} height={400} style={{position: 'absolute', left: 0, top: 230}}><path d="M 540 0 C 520 60, 560 100, 540 140" stroke={G} strokeWidth={6} fill="none" /></svg>
      <div style={{position: 'absolute', left: 190, top: 360, width: 700, height: 1160, transformOrigin: '50% 0', transform: `rotate(${sw}deg)`}}>
        <div style={{position: 'absolute', inset: 0, background: G, clipPath: 'polygon(18% 0, 82% 0, 100% 9%, 100% 100%, 0 100%, 0 9%)', boxShadow: '0 30px 60px rgba(0,0,0,0.3)'}} />
        <div style={{position: 'absolute', left: 320, top: 30, width: 60, height: 60, borderRadius: '50%', background: SA, boxShadow: `0 0 0 8px ${O}`}} />
        <Box b={{left: 50, top: 140, width: 600, height: 500}} m={p('f52', {fy: 45})} />
        <div style={{position: 'absolute', left: 50, top: 680, ...mono(16, O)}}>destination</div>
        <div style={{position: 'absolute', left: 50, top: 712, ...disp(96, I)}}>DINNER</div>
        {rows.map(([a, b], i) => (
          <div key={a} style={{position: 'absolute', left: 50, right: 50, top: 850 + i * 92, borderTop: '2px solid rgba(206,196,175,0.4)', paddingTop: 16, display: 'flex', gap: 24,
            opacity: ip(f, 20 + i * 10, 34 + i * 10)}}>
            <span style={{width: 110, ...mono(16, SA)}}>{a}</span><span style={ital(36, I)}>{b}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 9 · library card: borrowed, one evening
const Biblioteca: React.FC = () => {
  const f = useCurrentFrame();
  const rows: [string, string][] = [['table 4', 'after dessert'], ['table 9', 'one more glass'], ['you', 'whenever you like']];
  return (
    <AbsoluteFill style={{background: G}}>
      <Box b={{left: 70, top: 290, width: 940, height: 700}} m={p('bo414', {fy: 30})} />
      <div style={{position: 'absolute', left: 110, width: 860, top: 1040, height: 500, background: '#EAD9B5', boxShadow: '0 20px 40px rgba(0,0,0,0.35)', padding: '30px 40px', boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={mono(16, G)}>sea, signora library</span><span style={mono(16, O)}>no. 32</span></div>
        <div style={{...ital(46, G), marginTop: 12}}>An evening in Brera</div>
        <div style={{display: 'flex', marginTop: 24, borderBottom: `2px solid ${G}`, paddingBottom: 8, ...mono(14, G)}}><span style={{width: 300}}>borrowed by</span><span>return by</span></div>
        {rows.map(([a, b], i) => (
          <div key={a} style={{display: 'flex', height: 70, alignItems: 'center', borderBottom: '1px solid rgba(27,47,28,0.3)', ...ital(36, i === 2 ? O : G),
            opacity: ip(f, 20 + i * 18, 32 + i * 18)}}>
            <span style={{width: 300}}>{a}</span><span>{b}</span>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 660, top: 900, padding: '10px 18px', background: 'rgba(234,217,181,0.92)', border: `5px solid ${O}`, ...mono(22, O), transform: `rotate(-8deg) scale(${f >= 90 ? 1.5 - 0.5 * rise(f, 90) : 0})`}}>overdue? stay.</div>
    </AbsoluteFill>
  );
};

// 10 · gift tag: treat someone
const Regalo: React.FC = () => {
  const f = useCurrentFrame();
  const s = rise(f, 24);
  return (
    <AbsoluteFill style={{background: G}}>
      <Kicker k="sea, signora" t="treat someone" />
      <Box b={{left: 70, top: 440, width: 940, height: 760}} m={p('f83', {fy: 50})} />
      <div style={{position: 'absolute', left: 70, top: 440, width: 940, height: 760, pointerEvents: 'none'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 26, background: O}} />
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 26, background: O}} />
      </div>
      <svg width={260} height={200} viewBox="0 0 260 200" style={{position: 'absolute', left: -20, top: 360}}>
        <path d="M 120 100 C 40 20, 0 80, 40 110 C 70 130, 110 110, 120 100 Z M 130 100 C 210 20, 250 80, 210 110 C 180 130, 140 110, 130 100 Z" fill={O} />
        <circle cx={125} cy={102} r={18} fill="#C9610F" />
      </svg>
      <svg width={300} height={140} style={{position: 'absolute', left: 110, top: 1180}}><path d="M 0 0 C 40 60, 120 80, 210 120" stroke={O} strokeWidth={5} fill="none" opacity={s > 0.05 ? 1 : 0} /></svg>
      <div style={{position: 'absolute', left: 300, width: 600, top: 1240, height: 300, transform: `translateY(${(1 - s) * 300}px) rotate(${-3 + (1 - s) * 10}deg)`}}>
        <div style={{position: 'absolute', inset: 0, background: '#E6D6B4', clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 12% 100%, 0 50%)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'}} />
        <div style={{position: 'absolute', left: 30, top: 135, width: 30, height: 30, borderRadius: '50%', background: G}} />
        <div style={{position: 'absolute', left: 110, top: 46, ...mono(16, G)}}>to</div>
        <div style={{position: 'absolute', left: 110, top: 70, ...ital(48, G)}}>someone you like</div>
        <div style={{position: 'absolute', left: 110, top: 160, ...mono(16, G)}}>from</div>
        <div style={{position: 'absolute', left: 110, top: 184, ...mark(52, O)}}>Sea, Signora</div>
      </div>
    </AbsoluteFill>
  );
};

type Spec = {id: string; day: string; sec: number; view: React.FC; screen: string; caption: string; hashtags: string[]; cta?: string};
const tags = (...t: string[]) => ['#seasignora', ...t];
export const FRESH6: Spec[] = [
  {id: 'L-01v-collection', day: '1', sec: 7, view: Museo, screen: 'sea, signora · permanent collection / on view tonight / room 32 · Untitled (Carpaccio), 2025 · Raw fish, citrus and flowers on porcelain · on loan from the kitchen',
    caption: 'From our permanent collection: Untitled (Carpaccio), 2025. On view tonight, on loan from the kitchen.', hashtags: tags('#carpaccio', '#brera', '#milan')},
  {id: 'L-02v-postcard', day: '1', sec: 8, view: Cartolina, screen: 'Greetings from Brera / back: Wish you were here. The aquarium says hi, the raw bar too. Your table is waiting. — Sea, Signora',
    caption: 'Greetings from Brera. Wish you were here: the aquarium says hi, and your table is waiting.', hashtags: tags('#aquarium', '#brera', '#milan')},
  {id: 'L-03v-telegram', day: '2', sec: 7, view: Telegramma, screen: 'TELEGRAM no. 32 / from: sea, signora · to: you / TABLE READY STOP · CANDLES LIT STOP · WINE BREATHING STOP · COME HUNGRY STOP',
    caption: 'Telegram for you: table ready, candles lit, wine breathing. Come hungry. Stop.', hashtags: tags('#dinner', '#brera', '#milan')},
  {id: 'L-04v-coat-check', day: '2', sec: 6, view: Guardaroba, screen: 'coat check · sea, signora / 32 / your coat stays. so do you.',
    caption: 'Coat check number 32: your coat stays, and so do you.', hashtags: tags('#friends', '#brera', '#milan')},
  {id: 'L-05v-contact-sheet', day: '3', sec: 7, view: Provino, screen: 'contact sheet · brera / one evening, every frame / this one: drinks at the counter',
    caption: 'One evening, every frame. Our pick: drinks at the counter.', hashtags: tags('#cocktails', '#brera', '#milan')},
  {id: 'L-06v-lookbook', day: '3', sec: 7, view: Lookbook, screen: 'sea, signora · dinner edit / LOOKBOOK / look 01: white shirt, red velvet · look 02: blue stripes, white wine / dress code: whatever you like',
    caption: 'The dinner edit: white shirt and red velvet, blue stripes and white wine. Dress code: whatever you like.', hashtags: tags('#milanstyle', '#brera', '#dinner')},
  {id: 'L-07v-seating-plan', day: '4', sec: 7, view: Pianta, screen: 'sea, signora · seating plan / we saved you a seat / open kitchen · the bar · aquarium · entrance → you', cta: 'book a table',
    caption: 'Seating plan: open kitchen, the bar, the aquarium, and one table saved for you.', hashtags: tags('#reservations', '#brera', '#milan')},
  {id: 'L-08v-luggage-tag', day: '4', sec: 7, view: Etichetta, screen: 'destination DINNER / from: wherever you are · to: via fiori chiari 32, brera · handle: with appetite',
    caption: 'Destination: dinner. From wherever you are to Via Fiori Chiari 32. Handle with appetite.', hashtags: tags('#dinner', '#brera', '#milan')},
  {id: 'L-09v-library-card', day: '5', sec: 7, view: Biblioteca, screen: 'sea, signora library no. 32 / An evening in Brera / borrowed by · return by: table 4 · after dessert / table 9 · one more glass / you · whenever you like / overdue? stay.',
    caption: 'Borrowed: an evening in Brera. Return it whenever you like. Overdue? Stay.', hashtags: tags('#cocktails', '#brera', '#milan')},
  {id: 'L-10v-gift-tag', day: '5', sec: 7, view: Regalo, screen: 'sea, signora / treat someone / to: someone you like · from: Sea, Signora',
    caption: 'Treat someone you like: book a table for two at Sea, Signora.', hashtags: tags('#dinnerfortwo', '#brera', '#milan')},
];
