import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Ten (client 16.11 night: «учитывай контекст кадра и всё, о чём мы говорили — 10 новых сторис, абсолютно креативных,
// в айдентике»). Each idea is born from what is actually in the frame: the painted Signora speaks, the gold lamp that
// looks like a jellyfish, the caviar box that says what it says, the bartender sliding a drink across the counter, ice
// dropping into a glass, the copper trolley crossing the room, a couple at dinner by the open kitchen, the chef plating,
// the bartender with an orange coupe, the long table at full volume. Footage used nowhere before, steady windows
// measured. Brand fonts and colours only, English only, no team names, no weekdays, no hours, nothing over faces or food.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory, N = '#0B0B0B';
const Vid: React.FC<{n: string; at: number; rate?: number; fx?: number; fy?: number; style?: React.CSSProperties}> = ({n, at, rate = 1, fx = 50, fy = 50, style}) => (
  <OffthreadVideo src={staticFile(`videos/t10/${n}.mp4`)} startFrom={Math.round(at * FPS)} playbackRate={rate} muted
    style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`, ...style}} />
);
const ip = (f: number, a: number, b: number, c = 0, d = 1, e: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const io = Easing.inOut(Easing.cubic);
const spr = (f: number, at: number, damping = 14) => (f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping, stiffness: 130}}));
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

// 1 · the painted Signora speaks
const Bubble: React.FC<{at: number; x: number; y: number; w: number; text: string; tail: 'left' | 'right'}> = ({at, x, y, w, text, tail}) => {
  const f = useCurrentFrame();
  const s = spr(f, at, 12);
  return (
    <div style={ab({left: x, top: y, width: w, transform: `scale(${s})`, transformOrigin: tail === 'left' ? '10% 100%' : '90% 100%'})}>
      <div style={{background: I, borderRadius: 44, padding: '30px 38px', ...ital(50, G)}}>{text}</div>
      <div style={ab({[tail]: 60, bottom: -26, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `30px solid ${I}`})} />
    </div>
  );
};
const T01: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Vid n="c_r1c15" at={2.3} rate={0.85} fx={48} />
    <Bubble at={20} x={90} y={300} w={620} text="Darling, you made it." tail="right" />
    <Bubble at={70} x={320} y={1200} w={680} text="Sit by the aquarium. Order the crab." tail="left" />
    <div style={ab({left: 90, top: 1520, ...mono(18, SA)})}>— the signora, on the wall</div>
  </AbsoluteFill>
);

// 2 · not a jellyfish: callouts on the room
const Callout: React.FC<{at: number; dot: [number, number]; lab: [number, number]; text: string; align?: 'left' | 'right'}> = ({at, dot, lab, text, align = 'left'}) => {
  const f = useCurrentFrame();
  const d = ip(f, at, at + 14, 0, 1, io);
  const ex = align === 'left' ? lab[0] : lab[0] + 420;
  return (
    <>
      <svg width={1080} height={1920} style={ab({inset: 0})}>
        <line x1={dot[0]} y1={dot[1]} x2={dot[0] + (ex - dot[0]) * d} y2={dot[1] + (lab[1] + 30 - dot[1]) * d} stroke={I} strokeWidth={3} />
        <circle cx={dot[0]} cy={dot[1]} r={12 * Math.min(1, d * 3)} fill={O} stroke={I} strokeWidth={3} />
      </svg>
      <div style={ab({left: lab[0], top: lab[1], width: 420, textAlign: align, opacity: ip(f, at + 10, at + 22)})}>
        <span style={{background: G, padding: '10px 18px', ...ital(42, I)}}>{text}</span>
      </div>
    </>
  );
};
const T02: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Vid n="c_r7c4" at={0.8} rate={0.9} />
    <Callout at={14} dot={[470, 790]} lab={[560, 560]} text="not a jellyfish (a lamp)" align="right" />
    <Callout at={50} dot={[230, 980]} lab={[80, 300]} text="the fish are real" />
    <Callout at={86} dot={[560, 1300]} lab={[80, 1470]} text="the table is yours" />
  </AbsoluteFill>
);

// 3 · the caviar box says it
const T03: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Vid n="v4247" at={62.4} fy={60} />
      {shade(true, 700, 0.75)}
      <div style={ab({left: 80, right: 80, top: 300})}>
        <div style={{...mono(20, SA), opacity: ip(f, 6, 18)}}>caviar service · sea, signora</div>
        <div style={{...ital(96, I), marginTop: 16, opacity: ip(f, 18, 32)}}>Even the box agrees.</div>
      </div>
    </AbsoluteFill>
  );
};

// 4 · slid across the counter
const T04: React.FC = () => {
  const f = useCurrentFrame();
  const x = ip(f, 30, 60, -1100, 0, Easing.out(Easing.quad));
  return (
    <AbsoluteFill style={{background: N}}>
      <Vid n="v7458" at={1.2} />
      {shade(false, 700, 0.75)}
      <div style={ab({left: 80, top: 1360, transform: `translateX(${x}px)`, display: 'flex', alignItems: 'center', gap: 24})}>
        <div style={disp(150, I)}>SLIDING</div>
        <svg width={120} height={60} viewBox="0 0 120 60"><path d="M 0 30 L 100 30 M 76 8 L 104 30 L 76 52" stroke={O} strokeWidth={10} fill="none" strokeLinecap="round" /></svg>
      </div>
      <div style={ab({left: 84, top: 1510, ...mono(20, SA), opacity: ip(f, 60, 74)})}>your way · the bar at sea, signora</div>
    </AbsoluteFill>
  );
};

// 5 · breaking the ice: the word cracks as the ice drops
const T05: React.FC = () => {
  const f = useCurrentFrame();
  const c = ip(f, 46, 70, 0, 1, Easing.out(Easing.cubic));
  const shard = (clip: string, dx: number, dy: number, r: number) => (
    <div style={ab({left: 0, right: 0, top: 300, textAlign: 'center', ...disp(380, I), clipPath: clip, transform: `translate(${dx * c}px, ${dy * c}px) rotate(${r * c}deg)`})}>ICE</div>
  );
  return (
    <AbsoluteFill style={{background: N}}>
      <div style={ab({left: 0, top: 640, width: 1080, height: 1280, overflow: 'hidden'})}><Vid n="v7423" at={11.8} rate={0.8} fy={60} /></div>
      {shard('polygon(0 0, 46% 0, 38% 55%, 0 70%)', -40, 20, -6)}
      {shard('polygon(46% 0, 100% 0, 100% 40%, 58% 62%, 38% 55%)', 30, -10, 5)}
      {shard('polygon(0 70%, 38% 55%, 58% 62%, 100% 40%, 100% 100%, 0 100%)', 10, 40, 3)}
      <div style={ab({left: 0, right: 0, top: 1450, textAlign: 'center', ...ital(54, I), opacity: ip(f, 66, 80)})}>the easiest way to break the ice</div>
    </AbsoluteFill>
  );
};

// 6 · dinner on wheels: a tag follows the copper trolley
const T06: React.FC = () => {
  const f = useCurrentFrame();
  const d = ip(f, 30, 90, 0, 1, io);
  return (
    <AbsoluteFill style={{background: N}}>
      <Vid n="d2_r5c12" at={3.9} rate={0.9} />
      {shade(true, 620, 0.65)}
      <div style={ab({left: 80, top: 300})}>
        <div style={{...mono(20, SA), opacity: ip(f, 4, 16)}}>tableside · sea, signora</div>
        <div style={{...ital(80, I), marginTop: 10, opacity: ip(f, 12, 26)}}>{'Some dishes\ncome to you.'}</div>
      </div>
      <svg width={1080} height={1920} style={ab({inset: 0})} fill="none">
        <path d="M 300 1150 C 420 1350, 700 1420, 940 1300" stroke={I} strokeWidth={5} strokeDasharray="6 16" strokeLinecap="round" pathLength={1}
          style={{strokeDasharray: `${d} 1`}} />
      </svg>
      <div style={ab({left: 760, top: 1320, padding: '12px 20px', background: O, ...mono(20, I), opacity: ip(f, 80, 92)})}>→ your table</div>
    </AbsoluteFill>
  );
};

// 7 · live activity: dinner in progress
const T07: React.FC = () => {
  const f = useCurrentFrame();
  const steps = ['raw bar', 'pasta', 'dessert'];
  const p = ip(f, 30, 150, 0.12, 0.62, io);
  return (
    <AbsoluteFill style={{background: N}}>
      <Vid n="pC072" at={3.7} rate={0.9} fy={55} />
      <div style={ab({left: 50, right: 50, top: 290, padding: '30px 36px', borderRadius: 48, background: 'rgba(11,11,11,0.82)', transform: `translateY(${(1 - spr(f, 6)) * -400}px)`})}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{width: 84, height: 84, borderRadius: 22, background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mark(42, I)}}>S</div>
          <div style={{flex: 1}}>
            <div style={{...mono(16, SA)}}>sea, signora · live</div>
            <div style={{...ital(46, I), marginTop: 4}}>Dinner for two, in progress</div>
          </div>
        </div>
        <div style={{position: 'relative', height: 12, borderRadius: 6, background: 'rgba(248,246,245,0.2)', marginTop: 30}}>
          <div style={{width: `${p * 100}%`, height: 12, borderRadius: 6, background: O}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16}}>
          {steps.map((s, i) => <span key={s} style={mono(16, p >= [0.1, 0.5, 0.95][i] ? I : 'rgba(248,246,245,0.4)')}>{['✓ ', '• ', ''][i] + s}</span>)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 8 · director's cut: a clapperboard opens the plating scene
const T08: React.FC = () => {
  const f = useCurrentFrame();
  const arm = interpolate(f, [8, 20, 22], [-28, -28, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const out = ip(f, 30, 42, 0, 1, Easing.in(Easing.cubic));
  const stripes = `repeating-linear-gradient(135deg, ${G} 0 60px, ${I} 60px 120px)`;
  return (
    <AbsoluteFill style={{background: N}}>
      <Sequence from={30}><AbsoluteFill><Vid n="d1_r8c16" at={7.2} /></AbsoluteFill></Sequence>
      <Sequence from={30}>{shade(true, 560, 0.6)}<div style={ab({left: 80, top: 300, ...mono(20, I)})}>scene 32 · the pass · take 1</div></Sequence>
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
    </AbsoluteFill>
  );
};

// 9 · the house recipe, written over the bar counter
const T09: React.FC = () => {
  const f = useCurrentFrame();
  const lines = ['2 parts good company', '1 part candlelight', 'a splash of something cold', 'stir. stay.'];
  return (
    <AbsoluteFill style={{background: N}}>
      <Vid n="v4253" at={4.2} />
      <div style={ab({left: 60, right: 300, top: 1300, padding: '22px 32px', background: 'rgba(206,196,175,0.94)'})}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={mono(18, G)}>the house recipe</span><span style={mono(18, O)}>no. 32</span></div>
        <div style={{height: 2, background: G, margin: '10px 0 10px', opacity: 0.5}} />
        {lines.map((l, i) => <div key={l} style={{...ital(36, i === 3 ? O : G), marginBottom: 2, opacity: ip(f, 14 + i * 14, 26 + i * 14)}}>{l}</div>)}
      </div>
    </AbsoluteFill>
  );
};

// 10 · room volume: just right
const T10: React.FC = () => {
  const f = useCurrentFrame();
  const v = interpolate(f, [10, 50, 80, 110], [0.2, 0.95, 0.6, 0.72], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: io});
  return (
    <AbsoluteFill style={{background: N}}>
      <Vid n="v0137" at={1.4} />
      <div style={ab({left: 80, right: 80, top: 300, padding: '28px 36px', borderRadius: 40, background: 'rgba(248,246,245,0.9)'})}>
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

type Spec = {id: string; sec: number; view: React.FC; frame: string; screen: string; caption: string; hashtags: string[]};
const t = (...x: string[]) => ['#seasignora', ...x];
export const TEN: Spec[] = [
  {id: 'T-01v-signora-speaks', sec: 7, view: T01, frame: 'the Signora painting lit on the wall', screen: '“Darling, you made it.” / “Sit by the aquarium. Order the crab.” — the signora, on the wall',
    caption: 'The Signora has opinions. Mostly about where you sit and what you order.', hashtags: t('#art', '#brera', '#milan')},
  {id: 'T-02v-not-a-jellyfish', sec: 7, view: T02, frame: 'the room: gold lamp, aquarium, tables', screen: 'not a jellyfish (a lamp) · the fish are real · the table is yours',
    caption: 'For the record: the lamp is not a jellyfish, the fish are real, and the table is yours.', hashtags: t('#interiors', '#aquarium', '#brera')},
  {id: 'T-03v-box-agrees', sec: 6, view: T03, frame: 'caviar tins, the printed box, a glass of white', screen: 'caviar service · sea, signora / Even the box agrees.',
    caption: 'Caviar service. Even the box agrees.', hashtags: t('#caviar', '#brera', '#milan')},
  {id: 'T-04v-sliding', sec: 6, view: T04, frame: 'the bartender slides a drink across the counter', screen: 'SLIDING → / your way · the bar at sea, signora',
    caption: 'Sliding your way, from our bar.', hashtags: t('#cocktails', '#bar', '#brera')},
  {id: 'T-05v-break-the-ice', sec: 6, view: T05, frame: 'ice dropping into a glass on black', screen: 'ICE (cracks) / the easiest way to break the ice',
    caption: 'The easiest way to break the ice.', hashtags: t('#cocktails', '#bar', '#brera')},
  {id: 'T-06v-come-to-you', sec: 7, view: T06, frame: 'the copper trolley served at the table', screen: 'tableside · sea, signora / Some dishes come to you. / → your table',
    caption: 'Some dishes come to you: finished tableside, from the copper trolley.', hashtags: t('#service', '#brera', '#milan')},
  {id: 'T-07v-live', sec: 7, view: T07, frame: 'a couple at dinner, the open kitchen behind', screen: 'sea, signora · live / Dinner for two, in progress / ✓ raw bar · • pasta · dessert',
    caption: 'Live: dinner for two, in progress. Next up, pasta.', hashtags: t('#datenight', '#brera', '#milan')},
  {id: 'T-08v-take-one', sec: 7, view: T08, frame: 'the chef plating at the pass', screen: 'clapperboard: production Sea, Signora · scene the pass · take 1 of many → scene 32 · the pass · take 1',
    caption: 'Scene: the pass. Take one of many, every evening.', hashtags: t('#openkitchen', '#chef', '#brera')},
  {id: 'T-09v-house-recipe', sec: 7, view: T09, frame: 'the bartender with an orange coupe', screen: 'the house recipe no. 32 / 2 parts good company · 1 part candlelight · a splash of something cold · stir. stay.',
    caption: 'The house recipe: two parts good company, one part candlelight, a splash of something cold. Stir. Stay.', hashtags: t('#cocktails', '#bar', '#brera')},
  {id: 'T-10v-room-volume', sec: 6, view: T10, frame: 'the long table at full volume', screen: 'room volume … just right',
    caption: 'Room volume: just right.', hashtags: t('#friends', '#brera', '#milan')},
];
