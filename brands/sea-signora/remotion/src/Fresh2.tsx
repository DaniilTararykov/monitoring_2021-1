import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// «Fresh» round 2 (client 16.11: «ещё что-то новое и свежее, креативное, из других материалов»): 14 stories built on the
// year footage that never made it into stories (bar, flambé, lobster pan, kitchen pass, hostesses, the open kitchen),
// each on a mechanic not used before: scratch card, multilingual greeting, TV channels, crossword, swipe match, order
// tickets, kaleidoscope, tear-off flyer, bar rhythm cut, keyhole, iris chain, comic strip, stopwatch, song recognition.
// Same rules: no text over faces or dishes, no oysters / polpo, no weekdays, no opening hours from old signage.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory, N = '#0B0B0B';
type M = {src: string; at?: number; fx?: number; fy?: number; rate?: number};
const Vid: React.FC<{m: M; style?: React.CSSProperties}> = ({m, style}) => (
  <OffthreadVideo src={staticFile(`videos/${m.src}`)} startFrom={Math.round((m.at ?? 0) * FPS)} playbackRate={m.rate ?? 1} muted
    style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${m.fx ?? 50}% ${m.fy ?? 50}%`, ...style}} />
);
const Box: React.FC<{b: React.CSSProperties; m: M; st?: React.CSSProperties}> = ({b, m, st}) => (
  <div style={{position: 'absolute', overflow: 'hidden', ...b}}><Vid m={m} style={st} /></div>
);
const y = (n: string, at = 0, o: Partial<M> = {}): M => ({src: `y/${n}.mp4`, at, ...o});
const mono = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: size,
  letterSpacing: size >= 28 ? 3 : 5, textTransform: 'uppercase', color, ...x});
const disp = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: size,
  textTransform: 'uppercase', lineHeight: 1, letterSpacing: 1, color, whiteSpace: 'pre-line', ...x});
const mark = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: size, color, lineHeight: 1, ...x});
const ital = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.serif, fontStyle: 'italic',
  fontSize: size, lineHeight: 1.25, color, whiteSpace: 'pre-line', ...x});
const center: React.CSSProperties = {position: 'absolute', left: 0, right: 0, textAlign: 'center'};
const ip = (f: number, a: number, b: number, c = 0, d = 1, e: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const pop = (f: number, at: number) => (f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping: 11, stiffness: 170}}));

// 1 · gratta e vinci: scratch the silver off, a lobster is underneath
const Gratta: React.FC = () => {
  const f = useCurrentFrame();
  const W = 860, H = 760;
  const sc = ip(f, 24, 120, 0, 1, Easing.inOut(Easing.quad));
  const zig = Array.from({length: 9}, (_, i) => `${i % 2 ? W - 40 : 40} ${60 + i * 82}`).join(' L ');
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{position: 'absolute', left: 70, width: 940, top: 280, height: 1240, background: O, borderRadius: 30}}>
        <div style={{...center, top: 46, ...mono(20, G)}}>sea, signora · lotteria della sera</div>
        <div style={{...center, top: 90, ...disp(104, I, {letterSpacing: 6})}}>GRATTA E VINCI</div>
        <div style={{position: 'absolute', left: 40, top: 230, width: W, height: H, borderRadius: 18, overflow: 'hidden', background: N}}>
          <Vid m={y('lobster-pan', 0, {rate: 0.8})} />
          <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
            <defs>
              <linearGradient id="silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d9d9d4" /><stop offset="0.5" stopColor="#a9a9a3" /><stop offset="1" stopColor="#e6e6e1" /></linearGradient>
              <mask id="scr"><rect width={W} height={H} fill="white" />
                <path d={`M ${zig}`} fill="none" stroke="black" strokeWidth={150} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sc} />
              </mask>
            </defs>
            <g mask="url(#scr)" opacity={1 - ip(f, 120, 130)}>
              <rect width={W} height={H} fill="url(#silver)" />
              <text x={W / 2} y={H / 2 + 20} textAnchor="middle" fontFamily={fonts.mono} fontSize={44} letterSpacing={8} fill="#6f6f69">GRATTA QUI</text>
            </g>
          </svg>
        </div>
        <div style={{...center, top: 1030, ...mono(20, G), opacity: ip(f, 125, 140)}}>hai vinto</div>
        <div style={{...center, top: 1068, ...ital(72, I), opacity: ip(f, 130, 145)}}>a lobster dinner</div>
      </div>
    </AbsoluteFill>
  );
};

// 2 · buonasera in five languages over the welcome at the door
const Buonasera: React.FC = () => {
  const f = useCurrentFrame();
  const w = ['Buonasera', 'Good evening', 'Bonsoir', 'Guten Abend', 'Buenas noches', 'Buonasera'];
  const k = Math.min(w.length - 1, Math.floor(f / 34));
  const t = f - k * 34;
  return (
    <AbsoluteFill style={{background: N}}>
      <Vid m={y('hostesses', 3)} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 620, background: 'linear-gradient(rgba(11,11,11,0.75), rgba(11,11,11,0))'}} />
      <div style={{...center, top: 290, ...mono(22, I)}}>at the door</div>
      <div style={{...center, top: 330, height: 150, overflow: 'hidden'}}>
        <div style={{...ital(118, I), transform: `translateY(${k === w.length - 1 ? 0 : ip(t, 0, 8, 60, 0) + ip(t, 28, 34, 0, -60)}px)`,
          opacity: k === w.length - 1 ? 1 : Math.min(ip(t, 0, 8), 1 - ip(t, 28, 34))}}>{w[k]}</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1360, height: 560, background: 'linear-gradient(rgba(11,11,11,0), rgba(11,11,11,0.75))'}} />
      <div style={{...center, top: 1450, ...mono(22, I), opacity: ip(f, 150, 165)}}>your table is ready · via fiori chiari 32</div>
    </AbsoluteFill>
  );
};

// 3 · Sea, Signora TV: four live channels
const noise = (seed: number) => (
  <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
    <filter id={`n${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width="100%" height="100%" filter={`url(#n${seed})`} />
  </svg>
);
const Tv: React.FC = () => {
  const f = useCurrentFrame();
  const ch: [M, string][] = [[y('chef-stove', 2), 'la cucina'], [y('bartender-shake', 4), 'il bar'], [y('flambe', 0.5), 'il fuoco'], [y('team-room', 6), 'la sala']];
  const L = 52, k = Math.min(3, Math.floor(f / L)), t = f - k * L;
  const st = t < 7 && k > 0;
  return (
    <AbsoluteFill style={{background: SA}}>
      <div style={{...center, top: 285, ...disp(84, G, {letterSpacing: 4})}}>SEA, SIGNORA TV</div>
      <div style={{...center, top: 385, ...mono(18, G)}}>four channels · all live tonight</div>
      <div style={{position: 'absolute', left: 80, width: 920, top: 460, height: 1000, background: '#2a2622', borderRadius: 60, boxShadow: '0 30px 60px rgba(0,0,0,0.3)'}}>
        <div style={{position: 'absolute', left: 50, top: 50, width: 820, height: 800, borderRadius: 50, overflow: 'hidden', background: N}}>
          {ch.map(([m, l], i) => i === k && <Box key={i} b={{inset: 0}} m={{...m, at: (m.at ?? 0)}} />)}
          {st && noise(f)}
          <div style={{position: 'absolute', left: 36, top: 30, ...mono(30, '#9BE58F', {textShadow: '0 0 10px #4CAF50'})}}>ch 0{k + 1}</div>
          <div style={{position: 'absolute', left: 36, bottom: 30, padding: '10px 18px', background: 'rgba(11,11,11,0.6)', ...mono(22, I)}}>{ch[k][1]}</div>
          <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 2px, transparent 2px, transparent 5px)',
            boxShadow: 'inset 0 0 120px rgba(0,0,0,0.6)'}} />
        </div>
        {[0, 1].map((i) => <div key={i} style={{position: 'absolute', left: 620 + i * 130, top: 880, width: 80, height: 80, borderRadius: '50%', background: '#4a443d',
          transform: `rotate(${i === 0 ? k * 60 : 0}deg)`}}><div style={{width: 8, height: 34, background: SA, margin: '6px auto'}} /></div>)}
        <div style={{position: 'absolute', left: 60, top: 905, ...mark(40, SA)}}>Sea, Signora</div>
      </div>
    </AbsoluteFill>
  );
};

// 4 · the evening's crossword
const Cruciverba: React.FC = () => {
  const f = useCurrentFrame();
  const C = 104, X0 = 124, Y0 = 470;
  const words: {w: string; r: number; c: number; d: 'a' | 'd'; n: number; clue: string}[] = [
    {w: 'GRANCHIO', r: 1, c: 0, d: 'a', n: 1, clue: 'reale, and worth the mess'},
    {w: 'PASTA', r: 0, c: 2, d: 'd', n: 2, clue: 'tossed in the pan, to order'},
    {w: 'TONNO', r: 0, c: 7, d: 'd', n: 3, clue: 'red, and best raw'},
    {w: 'VINO', r: 4, c: 4, d: 'a', n: 4, clue: 'bianco or rosso'},
  ];
  const cells = new Map<string, {ch: string; at: number; n?: number}>();
  words.forEach((wd, wi) => [...wd.w].forEach((ch, i) => {
    const r = wd.r + (wd.d === 'd' ? i : 0), c = wd.c + (wd.d === 'a' ? i : 0), key = `${r}-${c}`;
    const at = 20 + wi * 32 + i * 4;
    const prev = cells.get(key);
    cells.set(key, {ch, at: prev ? Math.min(prev.at, at) : at, n: i === 0 ? wd.n : prev?.n});
  }));
  return (
    <AbsoluteFill style={{background: I}}>
      <div style={{...center, top: 285, ...disp(84, G, {letterSpacing: 6})}}>CRUCIVERBA</div>
      <div style={{...center, top: 385, ...mono(18, O)}}>il cruciverba di sea, signora</div>
      {[...cells.entries()].map(([key, v]) => {
        const [r, c] = key.split('-').map(Number);
        return (
          <div key={key} style={{position: 'absolute', left: X0 + c * C, top: Y0 + r * C, width: C - 6, height: C - 6, border: `3px solid ${G}`, boxSizing: 'border-box',
            background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {v.n && <span style={{position: 'absolute', left: 6, top: 2, ...mono(16, G, {letterSpacing: 0})}}>{v.n}</span>}
            <span style={{fontFamily: fonts.display, fontSize: 60, color: G, opacity: ip(f, v.at, v.at + 4), transform: `scale(${0.6 + 0.4 * ip(f, v.at, v.at + 6)})`}}>{v.ch}</span>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 124, width: 830, top: 1040}}>
        {words.map((wd, i) => (
          <div key={wd.w} style={{display: 'flex', gap: 22, alignItems: 'baseline', marginBottom: 18}}>
            <span style={{width: 150, ...mono(18, O, {letterSpacing: 2})}}>{wd.n} {wd.d === 'a' ? 'across' : 'down'}</span>
            <span style={ital(40, G)}>{wd.clue}</span>
            <span style={{marginLeft: 'auto', opacity: ip(f, 20 + i * 32 + wd.w.length * 4, 30 + i * 32 + wd.w.length * 4)}}>
              <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={O} strokeWidth={3} strokeLinecap="round"><path d="M4 12.5 L9.5 18 L20 6" /></svg>
            </span>
          </div>
        ))}
      </div>
      <div style={{...center, top: 1420, ...mono(20, G), opacity: ip(f, 170, 185)}}>all solved at the table</div>
    </AbsoluteFill>
  );
};

// 5 · swipe right on dinner
const Match: React.FC = () => {
  const f = useCurrentFrame();
  const cards: [M, string][] = [[y('pasta-top', 4), 'la pasta'], [y('tuna-crudo', 6), 'il crudo'], [y('lamb-dish', 0, {rate: 0.6}), "l'agnello"], [y('carpaccio-flower', 2), 'il carpaccio']];
  const S = 40;
  const end = cards.length * S;
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{...center, top: 285, ...mono(20, SA)}}>dinner, the app</div>
      <div style={{...center, top: 325, ...ital(64, I)}}>swipe right</div>
      {cards.map(([m, l], i) => {
        const at = i * S, out = ip(f, at + 26, at + 38, 0, 1, Easing.in(Easing.cubic));
        if (f >= at + 38 || i * S > f + S * 2) return null;
        const depth = Math.max(0, i - Math.floor(f / S));
        return (
          <div key={l} style={{position: 'absolute', left: 140, width: 800, top: 470 + depth * 18, height: 950, borderRadius: 34, overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 10 - i, transform: `translateX(${out * 1100}px) rotate(${out * 22}deg) scale(${1 - depth * 0.04})`}}>
            <Vid m={m} />
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: 'linear-gradient(rgba(11,11,11,0), rgba(11,11,11,0.8))'}} />
            <div style={{position: 'absolute', left: 40, bottom: 36, ...ital(54, I)}}>{l}</div>
            <div style={{position: 'absolute', right: 40, top: 40, padding: '8px 22px', border: `5px solid ${O}`, borderRadius: 12, transform: 'rotate(12deg)',
              ...mono(36, O), opacity: ip(f, at + 14, at + 20)}}>yes</div>
          </div>
        );
      })}
      <div style={{opacity: ip(f, end, end + 12)}}>
        <div style={{...center, top: 720, ...disp(120, I, {letterSpacing: 4})}}>{"IT'S A\nMATCH"}</div>
        <div style={{...center, top: 1000, ...ital(52, SA)}}>you and Sea, Signora</div>
      </div>
      {f >= end + 10 && <Chip cta={{label: 'book a table', color: 'orange', y: 380}} />}
    </AbsoluteFill>
  );
};

// 6 · le comande: order tickets on the rail over the pass
const Comande: React.FC = () => {
  const f = useCurrentFrame();
  const tk: [string, string[], number][] = [['tavolo 7', ['1 tuna tartare', '1 fusillone', '1 crispy lamb chop'], -3], ['tavolo 12', ['2 burrata', '2 risotto', '1 bianco'], 2],
    ['tavolo …', ['your order', 'goes here'], -2]];
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{position: 'absolute', left: 80, top: 275, ...mono(20, SA)}}>le comande</div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 330, height: 18, borderRadius: 9, background: 'linear-gradient(#e2e2dc, #8d8d86)'}} />
      {tk.map(([h, ls, r], i) => {
        const s = pop(f, 10 + i * 22);
        return (
          <div key={h} style={{position: 'absolute', left: 80 + i * 320, top: 340, width: 280, height: 500, background: '#FBFAF6', transformOrigin: '50% 0',
            transform: `translateY(${(1 - Math.min(1, s)) * -560}px) rotate(${r * s}deg)`, boxShadow: '0 12px 24px rgba(0,0,0,0.35)', padding: '34px 26px', boxSizing: 'border-box'}}>
            <div style={mono(16, G)}>sea, signora</div>
            <div style={{...mono(26, i === 2 ? O : N, {letterSpacing: 2}), marginTop: 18}}>{h}</div>
            <div style={{borderTop: `2px dashed ${G}`, margin: '18px 0'}} />
            {ls.map((l) => <div key={l} style={{...ital(34, i === 2 ? O : G), marginBottom: 10}}>{l}</div>)}
          </div>
        );
      })}
      <Box b={{left: 0, top: 900, width: 1080, height: 660}} m={y('kitchen-pass', 8, {fy: 88})} />
      <div style={{position: 'absolute', left: 80, top: 1490, padding: '10px 18px', background: 'rgba(11,11,11,0.6)', ...mono(20, I)}}>the pass · right now</div>
    </AbsoluteFill>
  );
};

// 7 · kaleidoscope of tomatoes
const Caleido: React.FC = () => {
  const f = useCurrentFrame();
  const q = (sx: number, sy: number, l: number, t: number) => (
    <div style={{position: 'absolute', left: l, top: t, width: 540, height: 960, overflow: 'hidden'}}>
      <div style={{width: 540, height: 960, transform: `scale(${sx}, ${sy})`}}><Vid m={y('tomatoes', 0, {rate: 0.3, fx: 30, fy: 40})} /></div>
    </div>
  );
  return (
    <AbsoluteFill style={{background: N}}>
      <div style={{position: 'absolute', inset: 0, transform: `rotate(${f * 0.25}deg) scale(1.9)`}}>
        {q(1, 1, 0, 0)}{q(-1, 1, 540, 0)}{q(1, -1, 0, 960)}{q(-1, -1, 540, 960)}
      </div>
      <div style={{position: 'absolute', left: 240, top: 660, width: 600, height: 600, borderRadius: '50%', background: G, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(f, 20)})`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)'}}>
        <div style={mono(20, SA)}>la cucina</div>
        <div style={{...ital(76, I), textAlign: 'center', marginTop: 18}}>{'it all starts\nhere'}</div>
        <div style={{...mono(18, O), marginTop: 22}}>pomodori · erbe · olio</div>
      </div>
    </AbsoluteFill>
  );
};

// 8 · cercasi: a tear-off flyer with one tab left
const Cercasi: React.FC = () => {
  const f = useCurrentFrame();
  const tabs = 7;
  return (
    <AbsoluteFill style={{background: O}}>
      <div style={{position: 'absolute', left: 120, width: 840, top: 300, height: 1220, background: '#FBFAF6', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', transform: 'rotate(-1deg)'}}>
        <div style={{position: 'absolute', left: 360, top: -24, width: 120, height: 48, background: 'rgba(206,196,175,0.85)', transform: 'rotate(3deg)'}} />
        <div style={{...center, top: 70, ...disp(120, G, {letterSpacing: 8})}}>CERCASI</div>
        <div style={{...center, top: 210, ...ital(48, G)}}>{'guests for dinner,\nno experience needed'}</div>
        <Box b={{left: 70, top: 360, width: 700, height: 420}} m={y('dinner-top', 3, {fy: 55})} />
        <div style={{...center, top: 810, ...mono(20, G)}}>requirements: appetite · good company</div>
        <div style={{...center, top: 850, ...mono(20, O)}}>pay: crudo, pasta, vino</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 940, borderTop: `3px dashed ${G}`}} />
        {Array.from({length: tabs}, (_, i) => {
          const at = 30 + i * 18, gone = i < tabs - 1 ? ip(f, at, at + 16, 0, 1, Easing.in(Easing.quad)) : 0;
          return (
            <div key={i} style={{position: 'absolute', left: 20 + i * 114, top: 944, width: 112, height: 270, borderRight: i < tabs - 1 ? `2px dashed ${G}` : 'none',
              background: '#FBFAF6', display: 'flex', alignItems: 'center', justifyContent: 'center', transformOrigin: '50% 0',
              transform: `translateY(${gone * 900}px) rotate(${gone * (i % 2 ? 30 : -30)}deg)`, opacity: 1 - gone * 0.6}}>
              <div style={{transform: 'rotate(-90deg)', whiteSpace: 'nowrap', ...mono(16, i === tabs - 1 ? O : G, {letterSpacing: 2})}}>
                {i === tabs - 1 ? 'this one is yours' : 'sea, signora · fiori chiari 32'}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 9 · the bar, cut to the beat
const Ritmo: React.FC = () => {
  const f = useCurrentFrame();
  const cuts: [M, string][] = [[y('bartender-shake', 6), 'shake'], [y('bartender-pour', 3), 'pour'], [y('coupe-ice', 3), 'strain'], [y('coupe-pour', 0.3), 'serve'],
    [y('green-cocktail', 3), 'green'], [y('martini-orange', 5), 'orange'], [y('sparkling-pour2', 3), 'bubbles'], [y('bartender-cocktail', 8), 'cin cin']];
  const L = 16, k = Math.min(cuts.length - 1, Math.floor(f / L));
  return (
    <AbsoluteFill style={{background: N}}>
      {cuts.map(([m], i) => i === k && <Box key={i} b={{inset: 0}} m={m} />)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 560, background: 'linear-gradient(rgba(11,11,11,0.7), rgba(11,11,11,0))'}} />
      <div style={{position: 'absolute', left: 80, top: 285, ...mono(22, I)}}>il bar · {String(k + 1).padStart(2, '0')}/08</div>
      <div style={{position: 'absolute', left: 74, top: 325, ...disp(150, I, {letterSpacing: 4}), transform: `scale(${1.15 - 0.15 * ip(f - k * L, 0, 6)})`, transformOrigin: '0 50%'}}>
        {cuts[k][1]}</div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 500, height: 6, background: 'rgba(248,246,245,0.25)'}}>
        <div style={{width: `${((k + 1) / cuts.length) * 100}%`, height: 6, background: O}} />
      </div>
    </AbsoluteFill>
  );
};

// 10 · a peek through the keyhole
const Serratura: React.FC = () => {
  const f = useCurrentFrame();
  const s = ip(f, 30, 120, 1, 9, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill style={{background: N}}>
      <Vid m={y('dinner-table', 2)} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs><mask id="kh"><rect width={1080} height={1920} fill="white" />
          <g transform={`translate(540 1000) scale(${s}) translate(-540 -1000)`}>
            <circle cx={540} cy={930} r={110} fill="black" /><path d="M 480 990 L 600 990 L 640 1200 L 440 1200 Z" fill="black" />
          </g></mask></defs>
        <rect width={1080} height={1920} fill={G} mask="url(#kh)" />
      </svg>
      <div style={{opacity: 1 - ip(f, 40, 60)}}>
        <div style={{...center, top: 330, ...mono(22, SA)}}>sea, signora</div>
        <div style={{...center, top: 380, ...ital(80, I)}}>take a peek</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 560, background: 'linear-gradient(rgba(11,11,11,0.65), rgba(11,11,11,0))', opacity: ip(f, 120, 135)}} />
      <div style={{...center, top: 290, ...ital(76, I), opacity: ip(f, 125, 140)}}>now come in</div>
      <div style={{...center, top: 395, ...mono(22, I), opacity: ip(f, 135, 150)}}>your table is set</div>
    </AbsoluteFill>
  );
};

// 11 · iris chain: from the market to the table
const Iride: React.FC = () => {
  const f = useCurrentFrame();
  const sc: [M, string][] = [[y('tomatoes', 0, {rate: 0.5}), 'i pomodori'], [y('herbs-chop', 3), 'le erbe'], [y('chef-pan', 4), 'la padella'], [y('pasta-top', 8), 'la pasta'],
    [y('dinner-top', 6), 'la tavola']];
  const L = 48, k = Math.min(sc.length - 1, Math.floor(f / L)), t = f - k * L;
  const r = k === sc.length - 1 && t > 24 ? 1400 : Math.min(ip(t, 0, 12, 0, 1400, Easing.out(Easing.cubic)), ip(t, 34, 48, 1400, 0, Easing.in(Easing.cubic)));
  return (
    <AbsoluteFill style={{background: N}}>
      <div style={{position: 'absolute', inset: 0, clipPath: `circle(${r}px at 540px 960px)`}}><Vid m={sc[k][0]} /></div>
      <div style={{position: 'absolute', left: 80, top: 285, ...mono(22, I, {textShadow: '0 2px 10px rgba(0,0,0,0.7)'})}}>dal mercato al tavolo · {k + 1}/5</div>
      <div style={{position: 'absolute', left: 80, top: 330, padding: '10px 22px', background: G, ...ital(52, I)}}>{sc[k][1]}</div>
    </AbsoluteFill>
  );
};

// 12 · comic strip of one order
const Fumetto: React.FC = () => {
  const f = useCurrentFrame();
  const pn: [M, string][] = [[y('chef-pass', 3, {fy: 55}), 'meanwhile, in the kitchen…'], [y('plating-hands2', 0, {rate: 0.4}), 'thirty seconds later…'],
    [y('guests-kitchen', 10, {fy: 60}), 'at the table: silence. then, wow.']];
  return (
    <AbsoluteFill style={{background: SA}}>
      {pn.map(([m, c], i) => {
        const s = pop(f, 6 + i * 26);
        return (
          <div key={c} style={{position: 'absolute', left: 70, width: 940, top: 280 + i * 410, height: 390, transform: `scale(${s})`}}>
            <div style={{height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', background: I, border: `5px solid ${N}`, borderBottom: 'none',
              boxSizing: 'border-box', ...ital(38, N)}}>{c}</div>
            <div style={{position: 'relative', height: 326, border: `5px solid ${N}`, boxSizing: 'border-box', overflow: 'hidden'}}>
              <Vid m={m} />
              <div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,0,0,0.18) 1.5px, transparent 1.6px)', backgroundSize: '9px 9px', mixBlendMode: 'multiply'}} />
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', right: 70, top: 1520, ...mono(18, N), opacity: ip(f, 90, 105)}}>to be continued · at your table</div>
    </AbsoluteFill>
  );
};

// 13 · stopwatch: from the flame to the plate
const Cronometro: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / FPS;
  const fmt = (s: number) => `00:${String(Math.floor(s)).padStart(2, '0')}.${Math.floor((s % 1) * 10)}`;
  const laps: [number, string][] = [[3.6, 'la fiamma'], [6.2, 'il piatto']];
  return (
    <AbsoluteFill style={{background: N}}>
      {f < 120 ? <Vid m={y('flambe', 1)} /> : null}
      <Sequence from={120} layout="none"><AbsoluteFill><Vid m={y('lamb-dish', 0, {rate: 0.7})} /></AbsoluteFill></Sequence>
      <div style={{position: 'absolute', left: 70, width: 940, top: 280, height: 300, borderRadius: 34, background: 'rgba(11,11,11,0.78)', padding: '28px 40px', boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={mono(18, SA)}>cronometro</span><span style={mono(18, O)}>● live</span></div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 120, color: I, marginTop: 6, letterSpacing: 2}}>{fmt(Math.min(sec, 6.2))}</div>
        <div style={{display: 'flex', gap: 40, marginTop: 4}}>
          {laps.map(([s, l]) => <span key={l} style={{...mono(18, I, {letterSpacing: 2}), opacity: sec >= s ? 1 : 0.25}}>{fmt(s)} {l}</span>)}
        </div>
      </div>
      <div style={{position: 'absolute', left: 70, top: 610, padding: '12px 22px', background: O, ...ital(48, I), opacity: ip(f, 190, 200)}}>straight to your table</div>
    </AbsoluteFill>
  );
};

// 14 · song recognition: what's that sound
const Ascolto: React.FC = () => {
  const f = useCurrentFrame();
  const found = ip(f, 80, 100);
  return (
    <AbsoluteFill style={{background: N}}>
      <Vid m={y('open-kitchen', 5)} style={{filter: `blur(${18 - found * 18}px) brightness(${0.5 + found * 0.2})`, transform: 'scale(1.1)'}} />
      <div style={{opacity: 1 - found}}>
        <div style={{...center, top: 330, ...mono(22, I)}}>listening…</div>
        {[0, 1, 2].map((i) => {
          const t = ((f + i * 20) % 60) / 60;
          return <div key={i} style={{position: 'absolute', left: 540 - (180 + t * 260), top: 900 - (180 + t * 260), width: 2 * (180 + t * 260), height: 2 * (180 + t * 260),
            borderRadius: '50%', border: `3px solid ${O}`, opacity: 1 - t}} />;
        })}
        <div style={{position: 'absolute', left: 360, top: 720, width: 360, height: 360, borderRadius: '50%', background: O, display: 'flex', alignItems: 'center',
          justifyContent: 'center', transform: `scale(${1 + Math.sin(f / 4) * 0.03})`, ...mark(150, I)}}>S</div>
      </div>
      <div style={{position: 'absolute', left: 70, width: 940, top: 1090, height: 420, borderRadius: 34, background: I, padding: 34, boxSizing: 'border-box', display: 'flex', gap: 34,
        transform: `translateY(${(1 - found) * 700}px)`}}>
        <div style={{width: 260, height: 352, borderRadius: 18, overflow: 'hidden', flex: 'none'}}><Vid m={y('open-kitchen', 5)} /></div>
        <div>
          <div style={mono(16, O)}>found it</div>
          <div style={{...ital(62, G), marginTop: 12}}>La cucina</div>
          <div style={{...mono(20, G), marginTop: 10}}>Sea, Signora</div>
          <div style={{...mono(16, SA), marginTop: 6}}>live in brera</div>
          <div style={{...ital(32, G), marginTop: 30}}>{'sizzle, clink,\nlaugh, repeat'}</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 520, background: 'linear-gradient(rgba(11,11,11,0.6), rgba(11,11,11,0))', opacity: found}} />
      <div style={{...center, top: 290, ...ital(70, I), opacity: ip(f, 100, 115)}}>the sound of dinner</div>
    </AbsoluteFill>
  );
};

type Spec = {id: string; day: string; sec: number; view: React.FC; screen: string; caption: string; hashtags: string[]; cta?: string};
const tags = (...t: string[]) => ['#seasignora', ...t];
export const FRESH2: Spec[] = [
  {id: 'G-01v-gratta', day: '1', sec: 6, view: Gratta, screen: 'sea, signora · lotteria della sera / GRATTA E VINCI / gratta qui → hai vinto: a lobster dinner',
    caption: 'Gratta e vinci: everyone wins at Sea, Signora. Tonight it’s lobster.', hashtags: tags('#lobster', '#seafood', '#brera')},
  {id: 'G-02v-buonasera', day: '1', sec: 7, view: Buonasera, screen: 'at the door / Buonasera · Good evening · Bonsoir · Guten Abend · Buenas noches / your table is ready · via fiori chiari 32',
    caption: 'Buonasera, in every language. Your table is ready at Via Fiori Chiari 32.', hashtags: tags('#brera', '#milano', '#welcome')},
  {id: 'G-03v-tv', day: '2', sec: 7, view: Tv, screen: 'SEA, SIGNORA TV / four channels · all live tonight / ch 01 la cucina · ch 02 il bar · ch 03 il fuoco · ch 04 la sala',
    caption: 'Sea, Signora TV: the kitchen, the bar, the fire and the room. All live tonight.', hashtags: tags('#openkitchen', '#cocktails', '#brera')},
  {id: 'G-04v-cruciverba', day: '2', sec: 7, view: Cruciverba, screen: 'CRUCIVERBA / 1 across GRANCHIO: reale, and worth the mess · 2 down PASTA: tossed in the pan, to order · 3 down TONNO: red, and best raw · 4 across VINO: bianco or rosso / all solved at the table',
    caption: 'Our crossword: granchio, pasta, tonno, vino. All solved at the table.', hashtags: tags('#kingcrab', '#pasta', '#brera')},
  {id: 'G-05v-match', day: '3', sec: 7, view: Match, screen: 'dinner, the app / swipe right / la pasta · il crudo · l’agnello · il carpaccio: yes / IT’S A MATCH / you and Sea, Signora', cta: 'book a table',
    caption: 'Swipe right on pasta, crudo, lamb and carpaccio. It’s a match.', hashtags: tags('#pasta', '#crudo', '#brera')},
  {id: 'G-06v-comande', day: '3', sec: 7, view: Comande, screen: 'le comande / tavolo 7: 1 tuna tartare, 1 fusillone, 1 crispy lamb chop · tavolo 12: 2 burrata, 2 risotto, 1 bianco · tavolo …: your order goes here / the pass · right now',
    caption: 'Le comande: tuna tartare, fusillone, lamb chop, burrata, risotto. One ticket is still blank, and it has your name on it.', hashtags: tags('#openkitchen', '#pasta', '#brera')},
  {id: 'G-07v-caleidoscopio', day: '4', sec: 6, view: Caleido, screen: 'la cucina / it all starts here / pomodori · erbe · olio',
    caption: 'It all starts here: tomatoes, herbs, olive oil.', hashtags: tags('#ingredients', '#italianfood', '#brera')},
  {id: 'G-08v-cercasi', day: '4', sec: 7, view: Cercasi, screen: 'CERCASI / guests for dinner, no experience needed / requirements: appetite · good company / pay: crudo, pasta, vino / tabs: sea, signora · fiori chiari 32 → this one is yours',
    caption: 'Cercasi: guests for dinner, no experience needed. Pay: crudo, pasta and vino. Take the last tab.', hashtags: tags('#brera', '#milano', '#dinner')},
  {id: 'G-09v-ritmo', day: '5', sec: 5, view: Ritmo, screen: 'il bar · 01/08 … 08/08 / shake · pour · strain · serve · green · orange · bubbles · cin cin',
    caption: 'Shake, pour, strain, serve. Cin cin from our bar.', hashtags: tags('#cocktails', '#bar', '#brera')},
  {id: 'G-10v-serratura', day: '5', sec: 6, view: Serratura, screen: 'sea, signora / take a peek → now come in / your table is set', cta: undefined,
    caption: 'Take a peek. Then come in: your table is set.', hashtags: tags('#brera', '#dinner', '#milano')},
  {id: 'G-11v-iride', day: '6', sec: 8, view: Iride, screen: 'dal mercato al tavolo · 1/5…5/5 / i pomodori · le erbe · la padella · la pasta · la tavola',
    caption: 'Dal mercato al tavolo: tomatoes, herbs, the pan, the pasta, your table.', hashtags: tags('#pasta', '#openkitchen', '#brera')},
  {id: 'G-12v-fumetto', day: '6', sec: 7, view: Fumetto, screen: 'meanwhile, in the kitchen… / thirty seconds later… / at the table: silence. then, wow. / to be continued · at your table',
    caption: 'Meanwhile, in the kitchen… Thirty seconds later… At the table: silence. Then, wow.', hashtags: tags('#openkitchen', '#chef', '#brera')},
  {id: 'G-13v-cronometro', day: '7', sec: 7, view: Cronometro, screen: 'cronometro ● live / 00:03.6 la fiamma · 00:06.2 il piatto / straight to your table',
    caption: 'From the flame to the plate in six seconds. Straight to your table.', hashtags: tags('#grill', '#openkitchen', '#brera')},
  {id: 'G-14v-ascolto', day: '7', sec: 7, view: Ascolto, screen: 'listening… / found it: La cucina — Sea, Signora, live in brera / sizzle, clink, laugh, repeat / the sound of dinner',
    caption: 'Found it: “La cucina” by Sea, Signora, live in Brera. Sizzle, clink, laugh, repeat.', hashtags: tags('#openkitchen', '#brera', '#milano')},
];
