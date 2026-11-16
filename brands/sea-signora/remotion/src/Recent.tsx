import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Ten from the latest folders only (client 16.11 night: «из последних материалов, не очень старых»). The November
// footage and phone photos the client shared on 16.11 (folders 1Uv4yt…, 1KgFz8…, 1Eshu8…), files never used before:
// the lit Signora painting behind the dried bouquet, the room with the gold lamps and the aquarium, parsley chopped at
// the pass, the risotto from above, red prawns on blue porcelain, the chef plating, the sauce blitzed in a jug, the full
// room, the whole table from above, guests reading the menu by the open kitchen. Ideas come from what is in the frame.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory, N = '#0B0B0B';
const Vid: React.FC<{n: string; at: number; rate?: number; fx?: number; fy?: number; style?: React.CSSProperties}> = ({n, at, rate = 1, fx = 50, fy = 50, style}) => (
  <OffthreadVideo src={staticFile(`videos/r10/${n}.mp4`)} startFrom={Math.round(at * FPS)} playbackRate={rate} muted
    style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`, ...style}} />
);
const Pic: React.FC<{n: string; fx?: number; fy?: number; style?: React.CSSProperties}> = ({n, fx = 50, fy = 50, style}) => (
  <Img src={staticFile(`photos/r10/${n}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`, ...style}} />
);
const ip = (f: number, a: number, b: number, c = 0, d = 1, e: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const io = Easing.inOut(Easing.cubic);
const spr = (f: number, at: number, damping = 13) => (f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping, stiffness: 130}}));
const ab = (x: React.CSSProperties): React.CSSProperties => ({position: 'absolute', ...x});
const mono = (s: number, c: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: s, letterSpacing: s >= 28 ? 3 : 6,
  textTransform: 'uppercase', color: c, ...x});
const disp = (s: number, c: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: s, textTransform: 'uppercase', lineHeight: 0.92,
  color: c, whiteSpace: 'pre-line', ...x});
const mark = (s: number, c: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: s, color: c, lineHeight: 1, ...x});
const ital = (s: number, c: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.serif, fontStyle: 'italic', fontSize: s, lineHeight: 1.2, color: c,
  whiteSpace: 'pre-line', ...x});
const shade = (top: boolean, h = 640, a = 0.65) => <div style={ab({left: 0, right: 0, [top ? 'top' : 'bottom']: 0, height: h,
  background: `linear-gradient(${top ? '' : 'to top, '}rgba(11,11,11,${a}), rgba(11,11,11,0))`})} />;

// 1 · the Signora on the wall speaks
const Bubble: React.FC<{at: number; x: number; y: number; w: number; text: string; tail: 'left' | 'right' | 'up'}> = ({at, x, y, w, text, tail}) => {
  const f = useCurrentFrame();
  const s = spr(f, at, 12);
  return (
    <div style={ab({left: x, top: y, width: w, transform: `scale(${s})`, transformOrigin: tail === 'up' ? '50% 0' : tail === 'left' ? '10% 100%' : '90% 100%'})}>
      {tail === 'up' && <div style={{margin: '0 auto', width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderBottom: `30px solid ${I}`}} />}
      <div style={{background: I, borderRadius: 44, padding: '28px 38px', ...ital(48, G)}}>{text}</div>
      {tail !== 'up' && <div style={ab({[tail]: 60, bottom: -26, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `30px solid ${I}`})} />}
    </div>
  );
};
const R01: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Vid n="v0080" at={10.5} />
    <Bubble at={18} x={200} y={560} w={680} text="Darling, you made it." tail="up" />
    <Bubble at={66} x={200} y={1240} w={680} text="Try the risotto tonight. Trust me." tail="up" />
    <div style={ab({left: 0, right: 0, top: 1530, textAlign: 'center', ...mono(18, I, {textShadow: '0 2px 10px rgba(0,0,0,0.7)'})})}>— the signora, on the wall</div>
  </AbsoluteFill>
);

// 2 · callouts on the room: lamps, aquarium, the lady on the wall
const Callout: React.FC<{at: number; dot: [number, number]; lab: [number, number]; text: string; align?: 'left' | 'right'}> = ({at, dot, lab, text, align = 'left'}) => {
  const f = useCurrentFrame();
  const d = ip(f, at, at + 14, 0, 1, io);
  const ex = align === 'left' ? lab[0] + 40 : lab[0] + 400;
  return (
    <>
      <svg width={1080} height={1920} style={ab({inset: 0})}>
        <line x1={dot[0]} y1={dot[1]} x2={dot[0] + (ex - dot[0]) * d} y2={dot[1] + (lab[1] + 60 - dot[1]) * d} stroke={I} strokeWidth={3} />
        <circle cx={dot[0]} cy={dot[1]} r={13 * Math.min(1, d * 3)} fill={O} stroke={I} strokeWidth={3} />
      </svg>
      <div style={ab({left: lab[0], top: lab[1], width: 440, textAlign: align, opacity: ip(f, at + 10, at + 22)})}>
        <span style={{background: G, padding: '10px 18px', ...ital(42, I)}}>{text}</span>
      </div>
    </>
  );
};
const R02: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Vid n="v0089" at={5} />
    {shade(true, 560, 0.5)}
    <Callout at={12} dot={[300, 560]} lab={[60, 290]} text="not a jellyfish (a lamp)" />
    <Callout at={46} dot={[1010, 640]} lab={[580, 400]} text="the fish are real" align="right" />
    <Callout at={80} dot={[600, 740]} lab={[60, 510]} text="the Signora, watching" />
  </AbsoluteFill>
);

// 3 · the prep list, ticked off as the parsley is chopped
const R03: React.FC = () => {
  const f = useCurrentFrame();
  const items = ['parsley, chopped fine', 'pans, hot', 'bread, warm', 'tables, lit', 'you, on your way'];
  return (
    <AbsoluteFill style={{background: N}}>
      <div style={ab({left: 0, top: 820, width: 1080, height: 1100, overflow: 'hidden'})}><Vid n="v0755" at={5.4} fy={60} /></div>
      <div style={ab({left: 0, right: 0, top: 0, height: 820, background: SA})} />
      <div style={ab({left: 90, top: 290})}>
        <div style={mono(20, O)}>prep list · sea, signora</div>
        {items.map((t, i) => {
          const done = f > 30 + i * 26;
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 20}}>
              <div style={{width: 40, height: 40, border: `3px solid ${G}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? G : 'transparent'}}>
                {done && <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={I} strokeWidth={3.5} strokeLinecap="round"><path d="M4 12.5 L9.5 18 L20 6" /></svg>}
              </div>
              <span style={{...ital(44, i === 4 ? O : G), textDecoration: done && i < 4 ? 'line-through' : 'none'}}>{t}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 4 · risotto all'onda: the word moves like a wave
const R04: React.FC = () => {
  const f = useCurrentFrame();
  const w = "ALL'ONDA";
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={ab({left: 0, right: 0, top: 300, textAlign: 'center', whiteSpace: 'nowrap'})}>
        {[...w].map((c, i) => <span key={i} style={{display: 'inline-block', ...disp(150, SA), transform: `translateY(${Math.sin(f / 7 - i * 0.7) * 22 * ip(f, 0, 20)}px)`}}>{c}</span>)}
      </div>
      <div style={ab({left: 0, right: 0, top: 500, textAlign: 'center', ...ital(46, I), opacity: ip(f, 20, 34)})}>{'risotto, loose enough to make a wave'}</div>
      <div style={ab({left: 90, top: 640, width: 900, height: 900, borderRadius: '50%', overflow: 'hidden', transform: `rotate(${f * 0.08}deg)`})}><Pic n="p0127" fy={52} style={{transform: 'scale(1.25)'}} /></div>
    </AbsoluteFill>
  );
};

// 5 · red prawns, three words in a band above the plate (never on the prawns)
const R05: React.FC = () => {
  const f = useCurrentFrame();
  const w: [string, string][] = [['sweet', I], ['red', O], ['raw', I]];
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={ab({left: 0, top: 820, width: 1080, height: 1100, overflow: 'hidden'})}><Pic n="p0120" fy={55} style={{transform: `scale(${1.03 + f / 3500})`}} /></div>
      <div style={ab({left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', gap: 38})}>
        {w.map(([t, c], i) => <div key={t} style={{...disp(124, c), opacity: ip(f, 10 + i * 18, 22 + i * 18), transform: `translateY(${(1 - ip(f, 10 + i * 18, 26 + i * 18)) * 40}px)`}}>{t}</div>)}
      </div>
      <div style={ab({left: 0, right: 0, top: 540, textAlign: 'center', ...ital(46, SA), opacity: ip(f, 66, 80)})}>red prawns, straight from the raw bar</div>
    </AbsoluteFill>
  );
};

// 6 · take one: a clapperboard opens the plating
const R06: React.FC = () => {
  const f = useCurrentFrame();
  const arm = interpolate(f, [8, 20, 22], [-28, -28, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const out = ip(f, 30, 42, 0, 1, Easing.in(Easing.cubic));
  const stripes = `repeating-linear-gradient(135deg, ${G} 0 60px, ${I} 60px 120px)`;
  return (
    <AbsoluteFill style={{background: N}}>
      <Sequence from={30}><AbsoluteFill><Vid n="v0650" at={13.6} /></AbsoluteFill></Sequence>
      <div style={ab({left: 140, top: 640, width: 800, transform: `translateY(${out * 1500}px)`})}>
        <div style={{height: 110, background: stripes, transformOrigin: '0 100%', transform: `rotate(${arm}deg)`, borderRadius: 8}} />
        <div style={{height: 110, background: stripes, marginTop: 8, borderRadius: 8}} />
        <div style={{background: N, border: `4px solid ${I}`, padding: '30px 40px', marginTop: 8, borderRadius: 8}}>
          {[['production', 'Sea, Signora'], ['scene', 'the pass'], ['take', '1 of many']].map(([a, b]) => (
            <div key={a} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid rgba(248,246,245,0.3)', padding: '16px 0'}}>
              <span style={mono(18, SA)}>{a}</span><span style={ital(46, I)}>{b}</span>
            </div>
          ))}
        </div>
      </div>
      <Sequence from={30}><div style={ab({left: 0, right: 0, top: 300, textAlign: 'center', ...mono(20, I, {textShadow: '0 2px 10px rgba(0,0,0,0.7)'})})}>scene: the pass · take 1</div></Sequence>
    </AbsoluteFill>
  );
};

// 7 · blitzed until silk: a texture scale over the jug
const R07: React.FC = () => {
  const f = useCurrentFrame();
  const p = ip(f, 15, 150, 0, 1, io);
  const st = ['liquid', 'foam', 'silk'];
  return (
    <AbsoluteFill style={{background: N}}>
      <Vid n="v0757" at={5} />
      {shade(true, 640, 0.7)}
      <div style={ab({left: 80, right: 80, top: 300})}>
        <div style={mono(20, SA)}>the sauce · made to order</div>
        <div style={{position: 'relative', height: 8, background: 'rgba(248,246,245,0.3)', marginTop: 40, borderRadius: 4}}>
          <div style={{width: `${p * 100}%`, height: 8, background: O, borderRadius: 4}} />
          <div style={ab({left: `calc(${p * 100}% - 18px)`, top: -14, width: 36, height: 36, borderRadius: '50%', background: I})} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 24}}>
          {st.map((s, i) => <span key={s} style={ital(48, p >= i / 2 - 0.02 ? I : 'rgba(248,246,245,0.35)')}>{s}</span>)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 8 · room volume: just right
const R08: React.FC = () => {
  const f = useCurrentFrame();
  const v = interpolate(f, [10, 50, 80, 110], [0.2, 0.95, 0.6, 0.72], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: io});
  return (
    <AbsoluteFill style={{background: N}}>
      <Vid n="v0095" at={1.2} />
      <div style={ab({left: 80, right: 80, top: 300, padding: '28px 36px', borderRadius: 40, background: 'rgba(248,246,245,0.92)'})}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <svg width={50} height={50} viewBox="0 0 24 24" fill={G}><path d="M3 9 h4 l5 -4 v14 l-5 -4 h-4 z" /><path d="M15 8 q3 4 0 8 M18 5 q5 7 0 14" stroke={G} strokeWidth={2} fill="none" /></svg>
          <div style={{flex: 1, position: 'relative', height: 16, borderRadius: 8, background: 'rgba(27,47,28,0.18)'}}>
            <div style={{width: `${v * 100}%`, height: 16, borderRadius: 8, background: O}} />
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 18}}>
          <span style={mono(16, G)}>room volume</span><span style={ital(36, G)}>{f < 105 ? '…' : 'just right'}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 9 · pass it on: arrows travel plate to plate
const R09: React.FC = () => {
  const f = useCurrentFrame();
  const pts: [number, number][] = [[200, 940], [930, 980], [540, 1270], [840, 1560]];
  const seg = (i: number) => ip(f, 20 + i * 22, 40 + i * 22, 0, 1, io);
  return (
    <AbsoluteFill style={{background: N}}>
      <Pic n="p0738" fy={60} />
      <div style={ab({left: 80, top: 300})}>
        <div style={{...mono(20, SA), opacity: ip(f, 0, 12)}}>house rule</div>
        <div style={{...ital(84, I), marginTop: 10, opacity: ip(f, 6, 20)}}>Pass it on.</div>
        <div style={{...ital(44, SA), marginTop: 12, opacity: ip(f, 14, 28)}}>every plate is for the table</div>
      </div>
      <svg width={1080} height={1920} style={ab({inset: 0})} fill="none" stroke={O} strokeWidth={8} strokeLinecap="round">
        {pts.slice(0, -1).map(([x, y], i) => {
          const [x2, y2] = pts[i + 1];
          const t = seg(i);
          return <line key={i} x1={x} y1={y} x2={x + (x2 - x) * t} y2={y + (y2 - y) * t} strokeDasharray="2 18" />;
        })}
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={16} fill={O} stroke={I} strokeWidth={4} opacity={f > 16 + i * 22 ? 1 : 0} />)}
      </svg>
    </AbsoluteFill>
  );
};

// 10 · decision tree over the guests reading the menu
const R10: React.FC = () => {
  const f = useCurrentFrame();
  const node = (t: string, x: number, y: number, at: number, hi = false) => (
    <div style={ab({left: x, top: y, padding: '12px 22px', borderRadius: 40, background: hi ? O : I, ...ital(38, hi ? I : G), transform: `scale(${spr(f, at)})`, whiteSpace: 'nowrap'})}>{t}</div>
  );
  const ln = (x1: number, y1: number, x2: number, y2: number, at: number) => {
    const t = ip(f, at, at + 10);
    return <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * t} y2={y1 + (y2 - y1) * t} stroke={I} strokeWidth={3} />;
  };
  return (
    <AbsoluteFill style={{background: N}}>
      <Vid n="v0087" at={3.3} />
      {shade(true, 900, 0.7)}
      <div style={ab({left: 80, top: 290, ...mono(20, SA)})}>how to read our menu</div>
      <svg width={1080} height={1920} style={ab({inset: 0})}>
        {ln(250, 395, 250, 470, 14)}{ln(250, 540, 250, 610, 30)}{ln(330, 650, 560, 650, 46)}{ln(700, 690, 700, 750, 62)}
      </svg>
      {node('hungry?', 160, 340, 6)}
      {node('raw bar first', 110, 480, 20)}
      {node('then pasta', 150, 620, 36)}
      {node('dessert?', 600, 615, 52)}
      {node('always.', 610, 750, 68, true)}
    </AbsoluteFill>
  );
};

type Spec = {id: string; sec: number; view: React.FC; frame: string; screen: string; caption: string; hashtags: string[]};
const t = (...x: string[]) => ['#seasignora', ...x];
export const RECENT: Spec[] = [
  {id: 'U-01v-signora-speaks', sec: 7, view: R01, frame: 'the Signora painting lit behind the dried bouquet', screen: '“Darling, you made it.” / “Try the risotto tonight. Trust me.” — the signora, on the wall',
    caption: 'The Signora has a suggestion tonight: the risotto.', hashtags: t('#risotto', '#brera', '#milan')},
  {id: 'U-02v-not-a-jellyfish', sec: 7, view: R02, frame: 'the full room: gold lamps, aquarium, the painting', screen: 'not a jellyfish (a lamp) · the fish are real · the Signora, watching',
    caption: 'For the record: the lamp is not a jellyfish, the fish are real, and the Signora is always watching.', hashtags: t('#interiors', '#aquarium', '#brera')},
  {id: 'U-03v-prep-list', sec: 6, view: R03, frame: 'parsley chopped at the pass', screen: 'prep list · sea, signora / ✓ parsley, chopped fine · ✓ pans, hot · ✓ bread, warm · ✓ tables, lit · you, on your way',
    caption: 'Prep list: parsley chopped, pans hot, bread warm, tables lit. Only you left.', hashtags: t('#openkitchen', '#brera', '#milan')},
  {id: 'U-04v-allonda', sec: 6, view: R04, frame: 'risotto from above', screen: "ALL'ONDA (waving) / risotto, loose enough to make a wave",
    caption: "Risotto all'onda: loose enough to make a wave.", hashtags: t('#risotto', '#brera', '#milan')},
  {id: 'U-05v-sweet-red-raw', sec: 6, view: R05, frame: 'red prawns on blue porcelain', screen: 'SWEET · RED · RAW / red prawns, straight from the raw bar',
    caption: 'Sweet, red, raw: red prawns from the raw bar.', hashtags: t('#redprawns', '#rawbar', '#brera')},
  {id: 'U-06v-take-one', sec: 7, view: R06, frame: 'the chef plating at the pass', screen: 'clapperboard: production Sea, Signora · scene the pass · take 1 of many → scene: the pass · take 1',
    caption: 'Scene: the pass. Take one of many, every evening.', hashtags: t('#openkitchen', '#chef', '#brera')},
  {id: 'U-07v-silk', sec: 6, view: R07, frame: 'sauce blitzed in a jug', screen: 'the sauce · made to order / liquid → foam → silk',
    caption: 'The sauce, made to order: liquid, foam, silk.', hashtags: t('#openkitchen', '#chef', '#brera')},
  {id: 'U-08v-room-volume', sec: 6, view: R08, frame: 'the room, full', screen: 'room volume … just right',
    caption: 'Room volume: just right.', hashtags: t('#friends', '#brera', '#milan')},
  {id: 'U-09v-pass-it-on', sec: 6, view: R09, frame: 'the whole table from above', screen: 'house rule / Pass it on. / every plate is for the table',
    caption: 'House rule: pass it on. Every plate is for the table.', hashtags: t('#sharing', '#brera', '#milan')},
  {id: 'U-10v-read-the-menu', sec: 7, view: R10, frame: 'guests reading the menu by the open kitchen', screen: 'how to read our menu / hungry? → raw bar first → then pasta → dessert? → always.',
    caption: 'How to read our menu: raw bar first, then pasta, dessert always.', hashtags: t('#menu', '#brera', '#milan')},
];
