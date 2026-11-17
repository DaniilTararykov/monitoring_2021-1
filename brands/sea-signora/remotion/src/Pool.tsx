import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Pool of 50 (client 16.11 night: «другие фото, другие видео, другие концепты, новые сторис, новые дизайны — пул 50
// креативов, разных, не повторяющихся»). Material used nowhere before: the year footage that never made an edit (the
// Signora painting, the lobster tank, tableside service, the Holy Shell candles, fish on ice, the bar, gelato, the wine
// wall, the room, the kitchen) and Pixieset frames never picked (façade, candles, booths, aquarium, the regular fish,
// guests, garnish, wine). Fifty layouts, each used once. English only, no team, no weekdays, no hours, no «new».

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory, N = '#0B0B0B', MU = brandPalette.mustard605;
type M = {src: string; at?: number; rate?: number; fx?: number; fy?: number};
const V = (n: string, at = 0, rate = 1, o: Partial<M> = {}): M => ({src: `y3/${n}.mp4`, at, rate, ...o});
const P = (n: number, o: Partial<M> = {}): M => ({src: `w17/bo${n}.jpg`, ...o});
const Media: React.FC<{m: M; style?: React.CSSProperties}> = ({m, style}) => {
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${m.fx ?? 50}% ${m.fy ?? 50}%`, ...style};
  return m.src.endsWith('.mp4') ? <OffthreadVideo src={staticFile(`videos/${m.src}`)} startFrom={Math.round((m.at ?? 0) * FPS)} playbackRate={m.rate ?? 1} muted style={st} />
    : <Img src={staticFile(`photos/${m.src}`)} style={st} />;
};
const Box: React.FC<{b: React.CSSProperties; m: M; st?: React.CSSProperties}> = ({b, m, st}) => (
  <div style={{position: 'absolute', overflow: 'hidden', ...b}}><Media m={m} style={st} /></div>
);
const ip = (f: number, a: number, b: number, c = 0, d = 1, e: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const io = Easing.inOut(Easing.cubic);
const spr = (f: number, at: number) => (f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping: 15, stiffness: 120}}));
const mono = (s: number, c: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: s, letterSpacing: s >= 28 ? 3 : 6,
  textTransform: 'uppercase', color: c, ...x});
const disp = (s: number, c: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: s, textTransform: 'uppercase', lineHeight: 0.92,
  color: c, whiteSpace: 'pre-line', ...x});
const mark = (s: number, c: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: s, color: c, lineHeight: 1, whiteSpace: 'pre-line', ...x});
const ital = (s: number, c: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.serif, fontStyle: 'italic', fontSize: s, lineHeight: 1.2, color: c,
  whiteSpace: 'pre-line', ...x});
const ab = (x: React.CSSProperties): React.CSSProperties => ({position: 'absolute', ...x});
const shadeTop = (h = 640, a = 0.6) => <div style={ab({left: 0, right: 0, top: 0, height: h, background: `linear-gradient(rgba(11,11,11,${a}), rgba(11,11,11,0))`})} />;
const shadeBot = (h = 760, a = 0.7) => <div style={ab({left: 0, right: 0, bottom: 0, height: h, background: `linear-gradient(rgba(11,11,11,0), rgba(11,11,11,${a}))`})} />;
const In: React.FC<{at?: number; children: React.ReactNode; y?: number}> = ({at = 10, children, y = 24}) => {
  const f = useCurrentFrame();
  const a = ip(f, at, at + 16);
  return <div style={{opacity: a, transform: `translateY(${(1 - a) * y}px)`}}>{children}</div>;
};
const Logo: React.FC<{c?: string; top?: number; right?: boolean}> = ({c = I, top = 286, right}) => (
  <div style={ab({top, ...(right ? {right: 80} : {left: 0, right: 0, textAlign: 'center'}), ...mark(38, c)})}>Sea, Signora</div>
);

// ───────────────────────── videos ─────────────────────────
const S01: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={V('c_r1c14', 0, 0.8)} />{shadeTop(700, 0.65)}
    <div style={ab({left: 0, right: 0, top: 300, textAlign: 'center'})}><In><div style={disp(110, I)}>{'MEET THE\nSIGNORA'}</div></In>
      <In at={26}><div style={{...ital(44, I), marginTop: 26}}>she keeps an eye on every table</div></In></div>
  </AbsoluteFill>
);
const S02: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={V('d0_r10c7', 0, 0.8)} />{shadeBot(820, 0.8)}
    <div style={ab({left: 80, right: 80, top: 1250})}><In><div style={disp(150, I)}>{'GUEST OF\nHONOUR'}</div></In>
      <In at={28}><div style={{...mono(20, SA), marginTop: 24}}>the lobster tank · sea, signora</div></In></div>
  </AbsoluteFill>
);
const S03: React.FC = () => (
  <AbsoluteFill style={{background: G}}>
    <Box b={{left: 220, top: 0, width: 860, height: 1920}} m={V('d2_r6c2', 2.5, 0.85, {fx: 45})} />
    <div style={ab({left: 40, top: 300, height: 1280, width: 140, display: 'flex', alignItems: 'center', justifyContent: 'center'})}>
      <div style={{...disp(118, O), writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap'}}>SERVED TABLESIDE</div>
    </div>
  </AbsoluteFill>
);
const S04: React.FC = () => (
  <AbsoluteFill style={{background: SA}}>
    <Box b={{left: 0, top: 0, width: 1080, height: 1150}} m={V('tcc_IMG2865', 3.7, 0.75)} />
    <div style={ab({left: 90, right: 90, top: 1210})}>
      <In><div style={mono(20, O)}>sea, signora · candle</div></In>
      <In at={18}><div style={{...ital(110, G), marginTop: 10}}>Holy Shell</div></In>
      <In at={30}><div style={{...ital(42, G), marginTop: 18}}>the scent of the room, in a jar</div></In>
    </div>
  </AbsoluteFill>
);
const S05: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={ab({left: 0, right: 0, top: 290, textAlign: 'center'})}><In><div style={disp(96, SA)}>ON ICE</div></In></div>
      <div style={ab({left: 90, top: 470, width: 900, height: 900, borderRadius: '50%', overflow: 'hidden', transform: `scale(${0.85 + 0.15 * spr(f, 4)})`})}>
        <Media m={V('c_r3c12', 0, 0.9)} />
      </div>
      <div style={ab({left: 0, right: 0, top: 1430, textAlign: 'center'})}><In at={30}><div style={ital(46, I)}>whole fish, waiting for the kitchen</div></In></div>
    </AbsoluteFill>
  );
};
const S06: React.FC = () => (
  <AbsoluteFill style={{background: O}}>
    <Box b={{left: 140, top: 300, width: 800, height: 1000, borderRadius: '400px 400px 0 0'}} m={V('c_r9c11', 1.2, 0.85)} />
    <div style={ab({left: 0, right: 0, top: 1350, textAlign: 'center'})}><In at={14}><div style={mark(110, G)}>Foam first.</div></In>
      <In at={30}><div style={{...mono(20, G), marginTop: 22}}>a slow drink from the bar</div></In></div>
  </AbsoluteFill>
);
const S07: React.FC = () => (
  <AbsoluteFill style={{background: G}}>
    <div style={ab({left: 0, right: 0, top: 285, textAlign: 'center'})}><In><div style={disp(76, SA)}>{'THE BAR,\nIN THREE ACTS'}</div></In></div>
    {[V('c_r9c7', 11.4), V('c_r4c16', 20), V('c_r5c1', 0.3)].map((m, i) => (
      <div key={i} style={ab({left: 0, right: 0, top: 480 + i * 370, height: 350, overflow: 'hidden'})}>
        <Sequence from={i * 8} layout="none"><Media m={m} /></Sequence>
        <div style={ab({left: 30, top: 24, ...mono(18, I), textShadow: '0 2px 8px rgba(0,0,0,0.6)'})}>act {['i', 'ii', 'iii'][i]}</div>
      </div>
    ))}
  </AbsoluteFill>
);
const S08: React.FC = () => {
  const f = useCurrentFrame();
  const t = 'two spoons, one coupe.';
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={V('w6_lf', 0, 0.85)} />{shadeTop(620, 0.65)}
      <div style={ab({left: 90, top: 300, ...ital(80, I)})}>{t.slice(0, Math.floor(ip(f, 10, 60, 0, t.length, Easing.linear)))}<span style={{opacity: f % 20 < 10 ? 1 : 0}}>|</span></div>
      <div style={ab({left: 92, top: 410, ...mono(20, SA)})}>dessert · sea, signora</div>
    </AbsoluteFill>
  );
};
const S09: React.FC = () => {
  const f = useCurrentFrame();
  const R = 150;
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={V('w6_v17', 0, 0.9)} />{shadeBot(700, 0.75)}
      <svg width={360} height={360} style={ab({right: 60, top: 280, transform: `rotate(${f * 0.9}deg)`})}>
        <circle cx={180} cy={180} r={170} fill={O} />
        <defs><path id="wl" d={`M 180 ${180 - R} a ${R} ${R} 0 1 1 -0.1 0`} /></defs>
        <text fontFamily={fonts.mono} fontWeight={500} fontSize={26} letterSpacing={6} fill={I}><textPath href="#wl" textLength={2 * Math.PI * R - 8}>THE WINE LIST · ASK US · THE WINE LIST · ASK US · </textPath></text>
      </svg>
      <div style={ab({left: 80, right: 80, top: 1340})}><In><div style={ital(76, I)}>Pick a bottle.{'\n'}We’ll do the rest.</div></In></div>
    </AbsoluteFill>
  );
};
const S10: React.FC = () => (
  <AbsoluteFill style={{background: I}}>
    <Box b={{left: 0, top: 0, width: 1080, height: 950}} m={V('c_r2c11', 2.9)} />
    <Box b={{left: 0, top: 970, width: 1080, height: 950}} m={V('c_r3c8', 3.2)} />
    <div style={ab({left: 60, top: 300, padding: '10px 18px', background: I, ...mono(18, G)})}>the room</div>
    <div style={ab({left: 60, top: 1000, padding: '10px 18px', background: I, ...mono(18, G)})}>the flowers</div>
  </AbsoluteFill>
);
const S11: React.FC = () => {
  const f = useCurrentFrame();
  const c = ip(f, 0, 24, 0, 1, io);
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={V('c_r7c15', 0, 0.75)} />
      <div style={ab({inset: 0, background: O, clipPath: `polygon(0 0, ${100 * c}% 0, 0 ${42 * c}%)`})} />
      <div style={ab({left: 70, top: 300, ...disp(150, G), opacity: ip(f, 20, 34)})}>GOLDEN</div>
      <div style={ab({left: 74, top: 450, ...mono(20, G), opacity: ip(f, 28, 42)})}>sauce, butter, patience</div>
    </AbsoluteFill>
  );
};
const S12: React.FC = () => {
  const f = useCurrentFrame();
  const c = (x: number, y: number, r: number) => <div style={ab({left: x, top: y, width: 70, height: 70, border: `5px solid ${I}`, borderWidth: '0', transform: `rotate(${r}deg)`,
    borderTop: `5px solid ${I}`, borderLeft: `5px solid ${I}`})} />;
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={V('d1_r8c15', 5.1)} />
      {c(80, 290, 0)}{c(930, 290, 90)}{c(80, 1500, -90)}{c(930, 1500, 180)}
      <div style={ab({left: 180, top: 300, display: 'flex', alignItems: 'center', gap: 14, ...mono(22, I)})}>
        <span style={{width: 18, height: 18, borderRadius: '50%', background: '#E5352B', opacity: f % 30 < 18 ? 1 : 0.2}} />kitchen cam · live</div>
      <div style={ab({right: 180, top: 300, ...mono(22, I)})}>00:{String(Math.floor(f / 30)).padStart(2, '0')}</div>
    </AbsoluteFill>
  );
};
const S13: React.FC = () => (
  <AbsoluteFill style={{background: SA}}>
    <Box b={{left: 540, top: 0, width: 540, height: 1920}} m={V('w6_v05', 3.4, 1, {fx: 55})} />
    <div style={ab({left: 60, top: 520, width: 460})}>
      <In><div style={disp(140, G)}>{'BY\nHAND'}</div></In>
      <In at={22}><div style={{...ital(44, G), marginTop: 40}}>{'every fish,\nfilleted in\nour kitchen'}</div></In>
    </div>
  </AbsoluteFill>
);
const S14: React.FC = () => {
  const f = useCurrentFrame();
  const z = ip(f, 6, 40, 1, 14, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={V('c_r4c3', 1.8, 0.9)} />
      <AbsoluteFill style={{background: G, opacity: 1 - ip(f, 30, 42)}}>
        <div style={ab({left: 0, right: 0, top: 820, textAlign: 'center', ...disp(220, I), transform: `scale(${z})`})}>COME IN</div>
      </AbsoluteFill>
      {shadeTop(560, 0.55)}
      <div style={ab({left: 0, right: 0, top: 300, textAlign: 'center', ...ital(56, I), opacity: ip(f, 46, 60)})}>the door is always open</div>
    </AbsoluteFill>
  );
};
const S15: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={V('c_r6c3', 0, 0.85)} />{shadeBot(520, 0.75)}
    <div style={ab({left: 80, top: 1450, display: 'flex', gap: 30, alignItems: 'baseline'})}>
      <span style={mono(18, SA)}>no. 15</span><span style={ital(44, I)}>Service, in motion.</span>
    </div>
    <div style={ab({left: 80, top: 1520, ...mono(16, SA)})}>sea, signora · via fiori chiari 32</div>
  </AbsoluteFill>
);
const S16: React.FC = () => (
  <AbsoluteFill style={{background: I}}>
    <div style={ab({left: 0, right: 0, top: 0, height: 560, background: G})}>
      <div style={ab({left: 80, top: 300})}><In><div style={mono(22, SA)}>today on ice</div></In>
        <In at={16}><div style={{...ital(66, I), marginTop: 14}}>prawns · lemons · crab</div></In></div>
    </div>
    <Box b={{left: 0, top: 560, width: 1080, height: 1360}} m={V('c_r2c13', 0.5)} />
  </AbsoluteFill>
);
const S17: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={V('c_r1c2', 0)} />
    <div style={ab({inset: 50, border: `2px solid ${I}`})} />{shadeTop(560, 0.55)}
    <div style={ab({left: 0, right: 0, top: 300, textAlign: 'center'})}><In><div style={ital(70, I)}>Seen from the bar</div></In></div>
  </AbsoluteFill>
);
const S18: React.FC = () => {
  const f = useCurrentFrame();
  const g = 1 - ip(f, 50, 90, 0, 1, io);
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={V('d1_r9c7', 0, 0.9)} style={{filter: `grayscale(${g})`}} />{shadeTop(600, 0.6)}
      <div style={ab({left: 80, top: 300, ...ital(80, I)})}>{f < 70 ? 'first, the work.' : 'then, the colour.'}</div>
    </AbsoluteFill>
  );
};
const S19: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: SA}}>
      <div style={ab({left: 0, right: 0, top: 290, textAlign: 'center'})}><In><div style={mono(20, G)}>before dinner</div></In>
        <In at={14}><div style={{...ital(68, G), marginTop: 12}}>something yellow</div></In></div>
      <div style={ab({left: 140, top: 520, width: 800, height: 800, overflow: 'hidden', transform: `rotate(${ip(f, 0, 30, -4, 0)}deg)`, boxShadow: '0 30px 60px rgba(0,0,0,0.25)'})}>
        <Media m={V('w6_v12', 0.4, 0.85)} />
      </div>
      <div style={ab({left: 0, right: 0, top: 1400, textAlign: 'center', ...mono(18, G)})}>sea, signora · the bar</div>
    </AbsoluteFill>
  );
};
const S20: React.FC = () => {
  const f = useCurrentFrame();
  const cl: M[] = [V('tcc_IMG28692', 0, 0.8), V('d2_r5c11', 0, 0.8), V('d1_r7c7', 0, 0.7), V('d2_r8c13', 0, 0.8)];
  return (
    <AbsoluteFill style={{background: G}}>
      {cl.map((m, i) => <Box key={i} b={{left: (i % 2) * 545, top: Math.floor(i / 2) * 965, width: 535, height: 955, opacity: ip(f, i * 5, i * 5 + 12)}} m={m} />)}
      <div style={ab({left: 340, top: 760, width: 400, height: 400, borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `scale(${spr(f, 18)})`})}><div style={{...ital(56, SA), textAlign: 'center'}}>{'the little\nthings'}</div></div>
    </AbsoluteFill>
  );
};
const S21: React.FC = () => {
  const f = useCurrentFrame();
  const cl: M[] = [V('d1_r6c6', 0, 0.9), V('d1_r9c5', 0.6, 0.9), V('d2_r5c11', 0.5, 0.9)];
  const y = -ip(f, 0, 210, 0, 1300, Easing.linear);
  return (
    <AbsoluteFill style={{background: N}}>
      <div style={ab({left: 160, width: 760, top: 300 + y})}>
        {cl.concat(cl).map((m, i) => (
          <div key={i} style={{position: 'relative', height: 540, marginBottom: 30, background: '#1a1a1a', padding: '0 60px'}}>
            {Array.from({length: 6}, (_, k) => <div key={k} style={ab({left: 18, top: 30 + k * 85, width: 24, height: 40, borderRadius: 4, background: '#444'})} />)}
            {Array.from({length: 6}, (_, k) => <div key={k} style={ab({right: 18, top: 30 + k * 85, width: 24, height: 40, borderRadius: 4, background: '#444'})} />)}
            <div style={{width: '100%', height: '100%', overflow: 'hidden'}}><Media m={m} /></div>
          </div>
        ))}
      </div>
      <div style={ab({left: 0, right: 0, top: 0, height: 300, background: N})} />
      <div style={ab({left: 0, right: 0, top: 1580, bottom: 0, background: N})} />
      <div style={ab({left: 0, right: 0, top: 300, height: 70, background: N, textAlign: 'center', ...mono(22, SA)})}>reel no. 32 · the kitchen</div>
    </AbsoluteFill>
  );
};
// ───────────────────────── photos ─────────────────────────
const S22: React.FC = () => {
  const f = useCurrentFrame();
  const d = spr(f, 12);
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={P(3, {fx: 40})} style={{transform: `scale(${1.04 + f / 3000})`}} />
      <div style={ab({left: 430, top: 640 - (1 - d) * 400, transform: 'translateX(-50%)'})}>
        <svg width={90} height={120} viewBox="0 0 24 32"><path d="M12 0 C5 0 0 5 0 12 C0 21 12 32 12 32 C12 32 24 21 24 12 C24 5 19 0 12 0 Z" fill={O} /><circle cx={12} cy={12} r={5} fill={I} /></svg>
      </div>
      <div style={ab({left: 480, top: 640, padding: '12px 20px', background: I, ...mono(18, G), opacity: ip(f, 30, 42)})}>you are here (almost)</div>
      {shadeBot(500, 0.6)}
      <div style={ab({left: 80, top: 1480, ...mono(20, I)})}>via fiori chiari 32 · brera</div>
    </AbsoluteFill>
  );
};
const S23: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={V('v0100', 1.6)} />{shadeBot(620, 0.75)}
    <div style={ab({left: 80, top: 1400})}><In at={20}><div style={ital(74, I)}>Lit before you arrive.</div></In></div>
  </AbsoluteFill>
);
const S24: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={ab({left: 90, top: 330, width: 900, height: 900, overflow: 'hidden', borderRadius: 20})}>
        <Media m={V('v7428', 15.2)} style={{transform: `rotate(${ip(f, 0, 210, -6, 4, Easing.linear)}deg) scale(1.3)`}} />
      </div>
      <div style={ab({left: 90, top: 1290})}><In at={14}><div style={ital(70, I)}>{'Read slowly.\nOrder generously.'}</div></In></div>
    </AbsoluteFill>
  );
};
const S25: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Box b={{left: 140, top: 500, width: 800, height: 800, borderRadius: 30}} m={V('ds_IMG_2064', 0, 0.8)} st={{filter: `brightness(${0.95 + 0.08 * Math.sin(f / 7)})`}} />
      <div style={ab({left: 0, right: 0, top: 300, textAlign: 'center'})}><In><div style={mono(20, SA)}>house rule no. 1</div></In></div>
      <div style={ab({left: 0, right: 0, top: 1360, textAlign: 'center'})}><In at={18}><div style={ital(60, I)}>{'one candle per table.\nminimum.'}</div></In></div>
    </AbsoluteFill>
  );
};
const S26: React.FC = () => (
  <AbsoluteFill style={{background: SA}}>
    <Box b={{left: 0, top: 560, width: 1080, height: 800}} m={V('v0133', 5.3)} />
    <div style={ab({left: 80, top: 300})}><In><div style={disp(110, G)}>{'CORNER TABLE'}</div></In></div>
    <div style={ab({left: 80, top: 1420})}><In at={22}><div style={ital(54, G)}>candlelit, for two</div></In></div>
  </AbsoluteFill>
);
const S27: React.FC = () => (
  <AbsoluteFill style={{background: G}}>
    <Box b={{left: 360, top: 0, width: 720, height: 1920}} m={V('ds_IMG_2063', 1.9, 1, {fx: 55})} />
    <div style={ab({left: 50, top: 320, width: 280})}>
      <In><div style={mono(18, SA)}>the red room</div></In>
      <In at={16}><div style={{...ital(52, I), marginTop: 20}}>{'velvet,\nlow light,\nno rush'}</div></In>
    </div>
  </AbsoluteFill>
);
const S28: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={V('ds_IMG_2065', 7.9)} style={{transform: `scale(${ip(f, 0, 210, 1.6, 1.05, io)})`}} />{shadeTop(600, 0.65)}
      <div style={ab({left: 0, right: 0, top: 300, textAlign: 'center'})}><In at={20}><div style={ital(76, I)}>Dinner, under water.</div></In></div>
    </AbsoluteFill>
  );
};
const S29: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: I}}>
      <div style={ab({left: 0, top: 0, width: 1080, height: 1380, overflow: 'hidden'})}>
        <Img src={staticFile('photos/w17/bo72.jpg')} style={ab({left: 0, width: 1080, height: 1380, objectFit: 'cover', objectPosition: `50% ${ip(f, 0, 210, 0, 100, Easing.linear)}%`, transform: 'scale(1.25)'})} />
      </div>
      <div style={ab({left: 80, top: 1440})}><In at={14}><div style={{display: 'flex', gap: 30, alignItems: 'baseline'}}><span style={mono(18, O)}>table for twelve</span><span style={ital(44, G)}>candles included</span></div></In></div>
    </AbsoluteFill>
  );
};
const S30: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={V('ds_IMG_2045', 0, 0.8)} style={{filter: `blur(${ip(f, 0, 50, 22, 0, io)}px)`}} />{shadeBot(600, 0.7)}
      <div style={ab({left: 80, top: 1420})}><In at={50}><div style={ital(64, I)}>Candlelight is our main light.</div></In></div>
    </AbsoluteFill>
  );
};
const S31: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={V('nf_9212', 0)} />{shadeTop(560, 0.6)}
    <div style={ab({left: 80, top: 300})}><In><div style={mono(20, SA)}>the tank</div></In><In at={14}><div style={{...ital(62, I), marginTop: 10}}>two metres of sea, in Brera</div></In></div>
  </AbsoluteFill>
);
const S32: React.FC = () => (
  <AbsoluteFill style={{background: G}}>
    <Box b={{left: 190, top: 440, width: 700, height: 900, borderRadius: '50%'}} m={P(150, {fx: 52})} />
    <div style={ab({left: 0, right: 0, top: 300, textAlign: 'center'})}><In><div style={mono(20, SA)}>portrait of a regular</div></In></div>
    <div style={ab({left: 0, right: 0, top: 1390, textAlign: 'center'})}><In at={16}><div style={ital(64, I)}>here since day one</div></In></div>
  </AbsoluteFill>
);
const S33: React.FC = () => (
  <AbsoluteFill style={{background: I}}>
    <div style={ab({left: 0, right: 0, top: 300, textAlign: 'center', ...disp(68, G, {letterSpacing: 24})})}>BOOTH FOR TWO</div>
    <Box b={{left: 80, top: 440, width: 920, height: 1100, borderRadius: 40}} m={P(153, {fx: 55})} />
  </AbsoluteFill>
);
const S34: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={V('v4240', 11.3, 1, {fy: 70})} />{shadeBot(620, 0.7)}
    <div style={ab({left: 0, right: 0, top: 1300, textAlign: 'center', ...disp(150, 'transparent', {WebkitTextStroke: `3px ${I}`})})}>BEHIND</div>
    <div style={ab({left: 0, right: 0, top: 1450, textAlign: 'center', ...mono(20, I)})}>the bar · sea, signora</div>
  </AbsoluteFill>
);
const S35: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={V('g2691', 2.3)} />{shadeBot(700, 0.8)}
    <div style={ab({left: 80, top: 1340, width: 700})}><In><div style={ital(80, I)}>To the next one.</div></In><In at={20}><div style={{...mono(18, SA), marginTop: 20}}>raised at sea, signora</div></In></div>
  </AbsoluteFill>
);
const S36: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={P(247, {fy: 40})} />{shadeBot(600, 0.75)}
    <div style={ab({left: 0, right: 0, top: 1440, textAlign: 'center'})}><In><div style={ital(64, I)}>Her usual, without asking.</div></In></div>
  </AbsoluteFill>
);
const S37: React.FC = () => (
  <AbsoluteFill style={{background: SA}}>
    <Box b={{left: 60, top: 420, width: 470, height: 760}} m={P(285, {fy: 45})} />
    <Box b={{left: 550, top: 420, width: 470, height: 760}} m={P(286, {fy: 50})} />
    <div style={ab({left: 0, right: 0, top: 300, textAlign: 'center'})}><In><div style={mono(20, G)}>the garnish</div></In></div>
    <div style={ab({left: 0, right: 0, top: 1240, textAlign: 'center'})}><In at={16}><div style={ital(62, G)}>{'placed with tweezers,\nnot by chance'}</div></In></div>
  </AbsoluteFill>
);
const S38: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={V('ds_IMG_2073', 0.6)} />{shadeBot(560, 0.75)}
    <div style={ab({left: 80, right: 80, top: 1440, borderTop: `2px solid ${I}`, paddingTop: 22, display: 'flex', justifyContent: 'space-between'})}>
      <span style={ital(46, I)}>At your service.</span><span style={mono(18, SA)}>sea, signora</span>
    </div>
  </AbsoluteFill>
);
const S39: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={P(358, {fy: 35})} />{shadeBot(560, 0.75)}
    <div style={ab({left: 80, right: 80, top: 1420})}><In><div style={ital(62, I)}>The face you make when it arrives.</div></In></div>
  </AbsoluteFill>
);
const S40: React.FC = () => (
  <AbsoluteFill style={{background: O}}>
    <Box b={{left: 0, top: 600, width: 1080, height: 1320}} m={P(398, {fy: 30})} />
    <div style={ab({left: 80, top: 300})}><In><div style={disp(130, G)}>{'DATE NIGHT,\nSORTED'}</div></In></div>
  </AbsoluteFill>
);
const S41: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Box b={{left: 0, top: 0, width: 1080, height: 1920}} m={P(428, {fy: 40})} />
      <div style={ab({left: 0, top: 1300, width: 1080 * ip(f, 6, 30, 0, 1, io), height: 280, background: G})} />
      <div style={ab({left: 80, top: 1340, width: 920})}><In at={24}><div style={ital(54, I)}>{'Tell us what you like.\nWe’ll find the bottle.'}</div></In></div>
    </AbsoluteFill>
  );
};
// client 17.11: the same frame as a picture, no band, a dark fade at the bottom under the words
const S41P: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Box b={{left: 0, top: 0, width: 1080, height: 1920}} m={P(428, {fx: 0, fy: 40})} />
    <div style={ab({left: 0, right: 0, bottom: 0, height: 900, background: 'linear-gradient(to top, rgba(11,11,11,0.92) 0%, rgba(11,11,11,0.7) 40%, rgba(11,11,11,0))'})} />
    <div style={ab({left: 80, top: 1360, width: 920, ...ital(54, I)})}>{'Tell us what you like.\nWe’ll find the bottle.'}</div>
  </AbsoluteFill>
);
const S42: React.FC = () => (
  <AbsoluteFill style={{background: I}}>
    <Box b={{left: 260, top: 330, width: 560, height: 980}} m={V('v7466', 5.4)} />
    <div style={ab({left: 0, right: 0, top: 1360, textAlign: 'center'})}><In><div style={disp(96, G, {letterSpacing: 6})}>WHITE · COLD · RIGHT</div></In></div>
  </AbsoluteFill>
);
const S43: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(ip(f, 10, 80, 0, 100, Easing.out(Easing.quad)));
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={V('nf_9220', 2)} />{shadeTop(620, 0.7)}
      <div style={ab({left: 80, top: 290, ...disp(200, I)})}>{n}%</div>
      <div style={ab({left: 84, top: 480, ...mono(20, I)})}>full · sea, signora · brera</div>
    </AbsoluteFill>
  );
};
const S44: React.FC = () => (
  <AbsoluteFill style={{background: G}}>
    <Box b={{left: 80, top: 300, width: 920, height: 1000}} m={V('nf_9216', 0, 0.75)} />
    <div style={ab({left: 80, top: 1350})}><In><div style={ital(64, I)}>Everyone gets a fork.</div></In><In at={16}><div style={{...mono(18, SA), marginTop: 16}}>dishes made to share</div></In></div>
  </AbsoluteFill>
);
const S45: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={V('nf_9224', 3.8)} />{shadeTop(600, 0.65)}
    <div style={ab({left: 0, right: 0, top: 300, textAlign: 'center'})}><In><div style={ital(70, I)}>Table of six. No rush.</div></In></div>
  </AbsoluteFill>
);
const S46: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: SA}}>
      {[0, 1, 2].map((i) => <Box key={i} b={{left: 70 + i * 40, top: 420 + i * 40, width: 860, height: 1000, opacity: i === 2 ? 1 : 0.35, boxShadow: '0 20px 40px rgba(0,0,0,0.25)'}}
        m={V('ds_IMG_2053', 11.8, 1, {fx: 40 + i * 10})} st={{transform: `scale(${1 + (2 - i) * 0.08})`}} />)}
      <div style={ab({left: 80, top: 300})}><In><div style={mono(20, G)}>friends, mostly</div></In></div>
      <div style={ab({left: 80, top: 1500, ...ital(48, G), opacity: ip(f, 30, 44)})}>and whoever they brought</div>
    </AbsoluteFill>
  );
};
const S47: React.FC = () => (
  <AbsoluteFill style={{background: G}}>
    <Box b={{left: 0, top: 0, width: 1080, height: 1100}} m={P(21, {fx: 50})} />
    <div style={ab({left: 80, right: 80, top: 1170})}>
      <In><div style={ital(70, I)}>The menu is short.</div></In>
      <In at={20}><div style={ital(70, O)}>The evening isn’t.</div></In>
    </div>
  </AbsoluteFill>
);
const S48: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <div style={ab({left: 0, top: 0, width: 540, height: 1920, overflow: 'hidden'})}><Media m={V('c_r3c8', 3.2)} /></div>
      <div style={ab({left: 540, top: 0, width: 540, height: 1920, overflow: 'hidden'})}><Media m={P(19, {fx: 50})} /></div>
      <div style={ab({left: 537, top: 0, width: 6, height: 1920, background: I})} />
      <div style={ab({left: 0, width: 540, top: 1460, textAlign: 'center', ...mono(20, I), opacity: ip(f, 10, 24)})}>early</div>
      <div style={ab({left: 540, width: 540, top: 1460, textAlign: 'center', ...mono(20, I), opacity: ip(f, 20, 34)})}>later</div>
    </AbsoluteFill>
  );
};
const S49: React.FC = () => {
  const f = useCurrentFrame();
  const words = ['candles', 'glasses', 'music', 'you'];
  const k = Math.min(3, Math.floor(f / 45));
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={P(17)} style={{filter: `brightness(${0.4 + k * 0.18})`}} />
      <div style={ab({left: 0, right: 0, top: 860, textAlign: 'center', ...disp(150, k === 3 ? O : I)})}>{words[k]}</div>
      <div style={ab({left: 0, right: 0, top: 300, textAlign: 'center', ...mono(20, SA)})}>what makes the room</div>
    </AbsoluteFill>
  );
};
const S50: React.FC = () => (
  <AbsoluteFill style={{background: O}}>
    <div style={ab({left: 0, right: 0, top: 300, textAlign: 'center'})}><Logo c={G} top={0} /></div>
    <div style={ab({left: 0, right: 0, top: 640, textAlign: 'center'})}><In><div style={ital(96, G)}>{'see you\nat no. 32'}</div></In></div>
    <Box b={{left: 290, top: 960, width: 500, height: 500, borderRadius: '50%'}} m={P(5)} />
    <div style={ab({left: 0, right: 0, top: 1500, textAlign: 'center', ...mono(18, G)})}>via fiori chiari · brera · milano</div>
  </AbsoluteFill>
);

type Spec = {id: string; sec: number; view: React.FC; screen: string; caption: string; hashtags: string[]};
const t = (...x: string[]) => ['#seasignora', ...x];
const s = (n: number, slug: string, sec: number, view: React.FC, screen: string, caption: string, ...h: string[]): Spec =>
  ({id: `Q-${String(n).padStart(2, '0')}v-${slug}`, sec, view, screen, caption, hashtags: t(...h)});
export const POOL: Spec[] = [
  s(1, 'signora', 6, S01, 'MEET THE SIGNORA / she keeps an eye on every table', 'Meet the Signora. She keeps an eye on every table.', '#art', '#brera'),
  s(2, 'guest-of-honour', 6, S02, 'GUEST OF HONOUR / the lobster tank · sea, signora', 'Our guest of honour lives in the tank.', '#lobster', '#brera'),
  s(3, 'tableside', 7, S03, 'SERVED TABLESIDE (vertical)', 'Some dishes are finished at your table.', '#service', '#brera'),
  s(4, 'holy-shell', 7, S04, 'sea, signora · candle / Holy Shell / the scent of the room, in a jar', 'Holy Shell: the scent of our room, in a jar.', '#candle', '#brera'),
  s(5, 'on-ice', 6, S05, 'ON ICE / whole fish, waiting for the kitchen', 'Whole fish on ice, waiting for the kitchen.', '#fish', '#seafood'),
  s(6, 'foam', 6, S06, 'Foam first. / a slow drink from the bar', 'Foam first. A slow drink from our bar.', '#cocktails', '#bar'),
  s(7, 'three-acts', 7, S07, 'THE BAR, IN THREE ACTS / act i · act ii · act iii', 'The bar, in three acts.', '#cocktails', '#bar'),
  s(8, 'two-spoons', 6, S08, 'two spoons, one coupe. / dessert · sea, signora', 'Two spoons, one coupe.', '#dessert', '#brera'),
  s(9, 'wine-list', 7, S09, 'THE WINE LIST · ASK US (badge) / Pick a bottle. We’ll do the rest.', 'Pick a bottle. We’ll do the rest.', '#wine', '#brera'),
  s(10, 'room-flowers', 7, S10, 'the room / the flowers', 'The room and the flowers, both dressed for dinner.', '#interiors', '#brera'),
  s(11, 'golden', 6, S11, 'GOLDEN / sauce, butter, patience', 'Golden: sauce, butter, patience.', '#chef', '#brera'),
  s(12, 'kitchen-cam', 7, S12, 'kitchen cam · live', 'Kitchen cam: live from the pass.', '#openkitchen', '#brera'),
  s(13, 'by-hand', 7, S13, 'BY HAND / every fish, filleted in our kitchen', 'Every fish, filleted by hand in our kitchen.', '#fish', '#openkitchen'),
  s(14, 'come-in', 7, S14, 'COME IN → the door is always open', 'Come in, the door is always open.', '#brera', '#milan'),
  s(15, 'service', 6, S15, 'no. 15 · Service, in motion. / sea, signora · via fiori chiari 32', 'Service, in motion.', '#service', '#brera'),
  s(16, 'today-on-ice', 7, S16, 'today on ice / prawns · lemons · crab', 'On ice: prawns, lemons, crab.', '#rawbar', '#seafood'),
  s(17, 'from-the-bar', 7, S17, 'Seen from the bar', 'The room, seen from the bar.', '#interiors', '#brera'),
  s(18, 'colour', 7, S18, 'first, the work. → then, the colour.', 'First, the work. Then, the colour.', '#chef', '#openkitchen'),
  s(19, 'yellow', 6, S19, 'before dinner / something yellow / sea, signora · the bar', 'Before dinner, something yellow.', '#aperitivo', '#bar'),
  s(20, 'little-things', 6, S20, 'the little things', 'The little things.', '#details', '#brera'),
  s(21, 'reel-32', 7, S21, 'reel no. 32 · the kitchen', 'Reel no. 32: the kitchen.', '#openkitchen', '#brera'),
  s(22, 'you-are-here', 7, S22, 'you are here (almost) / via fiori chiari 32 · brera', 'You are here, almost: Via Fiori Chiari 32.', '#brera', '#milan'),
  s(23, 'lit', 7, S23, 'Lit before you arrive.', 'Lit before you arrive.', '#candlelight', '#brera'),
  s(24, 'read-slowly', 7, S24, 'Read slowly. Order generously.', 'Read slowly. Order generously.', '#menu', '#brera'),
  s(25, 'house-rule', 6, S25, 'house rule no. 1 / one candle per table. minimum.', 'House rule no. 1: one candle per table, minimum.', '#candlelight', '#brera'),
  s(26, 'corner-table', 7, S26, 'CORNER TABLE / candlelit, for two', 'A corner table, candlelit, for two.', '#interiors', '#brera'),
  s(27, 'red-room', 6, S27, 'the red room / velvet, low light, no rush', 'The red room: velvet, low light, no rush.', '#interiors', '#brera'),
  s(28, 'under-water', 7, S28, 'Dinner, under water.', 'Dinner, under water.', '#aquarium', '#brera'),
  s(29, 'table-for-twelve', 7, S29, 'table for twelve · candles included', 'Table for twelve, candles included.', '#friends', '#brera'),
  s(30, 'main-light', 7, S30, 'Candlelight is our main light.', 'Candlelight is our main light.', '#candlelight', '#brera'),
  s(31, 'the-tank', 7, S31, 'the tank / two metres of sea, in Brera', 'Two metres of sea, in Brera.', '#aquarium', '#brera'),
  s(32, 'regular', 6, S32, 'portrait of a regular / here since day one', 'Portrait of a regular: here since day one.', '#aquarium', '#brera'),
  s(33, 'booth-for-two', 6, S33, 'BOOTH FOR TWO', 'A booth for two.', '#datenight', '#brera'),
  s(34, 'behind', 6, S34, 'BEHIND (outline) / the bar · sea, signora', 'Behind the bar.', '#bar', '#brera'),
  s(35, 'next-one', 6, S35, 'To the next one. / raised at sea, signora', 'To the next one.', '#cheers', '#friends'),
  s(36, 'her-usual', 6, S36, 'Her usual, without asking.', 'Her usual, without asking.', '#cocktails', '#brera'),
  s(37, 'garnish', 6, S37, 'the garnish / placed with tweezers, not by chance', 'The garnish: placed with tweezers, not by chance.', '#cocktails', '#bar'),
  s(38, 'at-your-service', 6, S38, 'At your service. · sea, signora', 'At your service.', '#service', '#brera'),
  s(39, 'the-face', 6, S39, 'The face you make when it arrives.', 'The face you make when it arrives.', '#dinner', '#brera'),
  s(40, 'date-night', 6, S40, 'DATE NIGHT, SORTED', 'Date night, sorted.', '#datenight', '#brera'),
  {...s(41, 'the-bottle', 7, S41P, 'Tell us what you like. We’ll find the bottle.', 'Tell us what you like, we’ll find the bottle.', '#wine', '#brera'), id: 'Q-41p-the-bottle'},
  s(41, 'the-bottle', 7, S41, 'Tell us what you like. We’ll find the bottle.', 'Tell us what you like, we’ll find the bottle.', '#wine', '#brera'),
  s(42, 'white-cold-right', 6, S42, 'WHITE · COLD · RIGHT', 'White, cold, right.', '#wine', '#brera'),
  s(43, 'full', 6, S43, '100% / full · sea, signora · brera', '100% full. Book ahead.', '#brera', '#milan'),
  s(44, 'a-fork', 6, S44, 'Everyone gets a fork. / dishes made to share', 'Everyone gets a fork.', '#sharing', '#brera'),
  s(45, 'table-of-six', 6, S45, 'Table of six. No rush.', 'Table of six. No rush.', '#friends', '#brera'),
  s(46, 'friends-mostly', 6, S46, 'friends, mostly / and whoever they brought', 'Friends, mostly. And whoever they brought.', '#friends', '#brera'),
  s(47, 'short-menu', 6, S47, 'The menu is short. The evening isn’t.', 'The menu is short. The evening isn’t.', '#menu', '#brera'),
  s(48, 'early-later', 6, S48, 'early | later', 'Early, and later.', '#brera', '#milan'),
  s(49, 'the-room-is', 6, S49, 'what makes the room / candles · glasses · music · you', 'What makes the room: candles, glasses, music, you.', '#brera', '#milan'),
  s(50, 'see-you', 6, S50, 'Sea, Signora / see you at no. 32 / via fiori chiari · brera · milano', 'See you at no. 32.', '#brera', '#milan'),
];
