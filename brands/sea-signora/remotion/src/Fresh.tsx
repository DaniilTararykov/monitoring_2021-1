import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// «Fresh» week (client 16.11: «уходить от вокабуляра… свежее, креативное, разное, не повторяющееся на неделе»).
// 21 stories, 21 different mechanics, none of them a vocabulary card or a repeat of an earlier object design:
// neon sign, marker doodle, weather app, arrivals board, photobooth strip, curtain, highlighted menu, cinemascope,
// loading screen, bingo, torn paper, karaoke review, slot machine, before/after wipe, magnifier, sticker pack,
// triptych, reservations book, giant blended type, formula, end credits.
// Rules kept: text never over faces or the dish (each element owns its band of the frame, inside 250 / 340 px),
// no polpo, no weekdays, words about the menu and an invitation to come; dish names as on the real menu.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory, N = '#0B0B0B';
const MU = brandPalette.mustard605;
type M = {src: string; at?: number; fx?: number; fy?: number};
const Media: React.FC<{m: M; style?: React.CSSProperties}> = ({m, style}) => {
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${m.fx ?? 50}% ${m.fy ?? 50}%`, ...style};
  return m.src.endsWith('.mp4') ? <OffthreadVideo src={staticFile(`videos/${m.src}`)} startFrom={Math.round((m.at ?? 0) * FPS)} muted style={st} />
    : <Img src={staticFile(`photos/${m.src}`)} style={st} />;
};
const Box: React.FC<{b: React.CSSProperties; m: M; st?: React.CSSProperties}> = ({b, m, st}) => (
  <div style={{position: 'absolute', overflow: 'hidden', ...b}}><Media m={m} style={st} /></div>
);
const mono = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: size,
  letterSpacing: size >= 28 ? 3 : 5, textTransform: 'uppercase', color, ...x});
const disp = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: size,
  textTransform: 'uppercase', lineHeight: 1, letterSpacing: 1, color, whiteSpace: 'pre-line', ...x});
const mark = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: size, color, lineHeight: 1, ...x});
const ital = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.serif, fontStyle: 'italic',
  fontSize: size, lineHeight: 1.25, color, whiteSpace: 'pre-line', ...x});
const serif = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.serif, fontSize: size, lineHeight: 1.25, color, ...x});
const center: React.CSSProperties = {position: 'absolute', left: 0, right: 0, textAlign: 'center'};
const v = (n: string, at: number, o: Partial<M> = {}): M => ({src: `${n}.mp4`, at, ...o});
const p = (n: string, o: Partial<M> = {}): M => ({src: `${n}.jpg`, ...o});
const ip = (f: number, a: number, b: number, c = 0, d = 1, e: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const pop = (f: number, at: number) => spring({frame: f - at, fps: FPS, config: {damping: 11, stiffness: 170}});
const Check: React.FC<{c: string; s?: number}> = ({c, s = 30}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5 L9.5 18 L20 6" /></svg>
);

// 1 · neon sign switching on over the room
const glow = (c: string) => `0 0 6px ${c}, 0 0 18px ${c}, 0 0 42px ${c}, 0 0 90px ${c}`;
const flick = (f: number, s: number) => {
  const seq = [1, 0, 1, 0, 0, 1, 0.4, 1];
  const i = f - s;
  return i < 0 ? 0 : i >= seq.length * 2 ? 1 : seq[Math.floor(i / 2)];
};
const Neon: React.FC = () => {
  const f = useCurrentFrame();
  const a = flick(f, 8), b = flick(f, 40);
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('w10/kf0105', 2)} style={{filter: `brightness(${0.38 + a * 0.08}) saturate(0.9)`}} />
      <div style={{position: 'absolute', left: 100, right: 100, top: 300, height: 440, borderRadius: 64, border: '6px solid #FFD9B5', opacity: a,
        boxShadow: `0 0 16px ${O}, 0 0 50px ${O}, inset 0 0 18px ${O}, inset 0 0 40px rgba(239,120,24,0.5)`}} />
      <div style={{...center, top: 390, ...mark(140, '#FFF1E2', {textShadow: glow(O)}), opacity: a}}>Sea, Signora</div>
      <div style={{...center, top: 570, ...ital(74, '#FFFFFF', {textShadow: glow('#8FCBFF')}), opacity: b}}>the lights are on</div>
      <div style={{...center, top: 800, ...mono(22, I), opacity: ip(f, 70, 90)}}>via fiori chiari 32 · brera</div>
      {f >= 80 && <Chip cta={{label: 'book a table', color: 'orange', y: 380}} />}
    </AbsoluteFill>
  );
};

// 2 · marker doodle over the chef finishing a carpaccio
const Segno: React.FC = () => {
  const f = useCurrentFrame();
  const c1 = ip(f, 18, 46, 0, 1, Easing.inOut(Easing.quad)), c2 = ip(f, 50, 66, 0, 1, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{position: 'absolute', left: 0, top: -240, width: 1080, height: 1920}}><Media m={v('w10/nm0636', 2.5)} /></div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}} fill="none" stroke={O} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round">
        <path pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c1}
          d="M 210 1170 C 230 980, 1010 950, 1050 1170 C 1080 1370, 330 1490, 200 1290 C 160 1220, 230 1110, 340 1080" />
        <path pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c2} d="M 300 700 C 280 820, 360 900, 470 960 M 470 960 L 418 958 M 470 960 L 452 912" />
      </svg>
      <div style={{position: 'absolute', left: 80, top: 300, ...ital(92, I, {lineHeight: 1.05, textShadow: '0 2px 18px rgba(0,0,0,0.5)'})}}>{'the good part,\nright here.'}</div>
      <div style={{position: 'absolute', left: 84, top: 520, ...mono(22, O), opacity: ip(f, 60, 75)}}>carpaccio · finished by hand</div>
    </AbsoluteFill>
  );
};

// 3 · weather app: the forecast for a night in Brera
const Meteo: React.FC = () => {
  const f = useCurrentFrame();
  const hours: [string, string, M][] = [['19:00', 'aperitivo', p('w11/f10', {fy: 40})], ['20:00', 'ostriche', p('w11/f36')], ['21:00', 'crudo', p('w11/f23')],
    ['22:00', 'pasta', p('w11/f112')], ['23:00', 'dolce', p('w10/pan86', {fy: 60})]];
  return (
    <AbsoluteFill style={{background: G}}>
      <Box b={{left: 0, top: 0, width: 1080, height: 1010}} m={p('w10/p0194', {fy: 52})} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 700, background: 'linear-gradient(rgba(11,11,11,0.6), rgba(11,11,11,0))'}} />
      <div style={{position: 'absolute', left: 80, top: 290, ...mono(22, I)}}>meteo · brera</div>
      <div style={{position: 'absolute', left: 74, top: 330, ...serif(210, I, {lineHeight: 1})}}>100%</div>
      <div style={{position: 'absolute', left: 84, top: 560, ...ital(52, I)}}>chance of oysters</div>
      <div style={{position: 'absolute', left: 60, width: 960, top: 1040, height: 500, borderRadius: 40, background: G, boxSizing: 'border-box', padding: '36px 40px',
        transform: `translateY(${ip(f, 6, 30, 80, 0)}px)`, opacity: ip(f, 6, 24)}}>
        <div style={mono(18, SA)}>hourly forecast</div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 30}}>
          {hours.map(([h, l, m], i) => {
            const s = pop(f, 26 + i * 8);
            return (
              <div key={h} style={{width: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: Math.min(1, s), transform: `scale(${0.6 + 0.4 * s})`}}>
                <div style={mono(20, I, {letterSpacing: 1})}>{h}</div>
                <div style={{width: 124, height: 124, borderRadius: '50%', overflow: 'hidden'}}><Media m={m} /></div>
                <div style={mono(16, SA, {letterSpacing: 2})}>{l}</div>
              </div>
            );
          })}
        </div>
        <div style={{height: 2, background: 'rgba(248,246,245,0.25)', marginTop: 36}} />
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 30, opacity: ip(f, 70, 85)}}>
          {[['sea', 'calm'], ['room', 'warm'], ['feels like', 'brera']].map(([a, b]) => (
            <div key={a}><div style={mono(16, SA)}>{a}</div><div style={{...ital(44, I), marginTop: 4}}>{b}</div></div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4 · split-flap arrivals board
const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const Tabellone: React.FC = () => {
  const f = useCurrentFrame();
  const rows: [string, string, string, M][] = [['OSTRICHE', 'raw bar', 'al tavolo', p('w11/f36')], ['CRUDO', 'raw bar', 'al tavolo', p('w11/f23')],
    ['FUSILLONE', 'cucina', 'in arrivo', p('w11/f112')], ['GRANCHIO', 'cucina', 'in arrivo', p('w11/f115')], ['TONNO', 'cucina', 'in arrivo', p('w11/f88')],
    ['DOLCE', 'pasticceria', 'per ultimo', p('w10/pan86', {fy: 60})]];
  return (
    <AbsoluteFill style={{background: N}}>
      <div style={{position: 'absolute', left: 115, top: 290, ...mono(20, O)}}>arrivi · in sala</div>
      <div style={{position: 'absolute', left: 115, top: 330, ...mark(76, I)}}>Sea, Signora</div>
      {rows.map(([w, from, st, m], r) => {
        const word = w.padEnd(10, ' ');
        const done = 22 + r * 14 + 9 * 2;
        return (
          <div key={w} style={{position: 'absolute', left: 115, top: 470 + r * 162, display: 'flex', gap: 26}}>
            <div>
              <div style={{display: 'flex', gap: 6}}>
                {[...word].map((ch, c) => {
                  const settle = 22 + r * 14 + c * 2;
                  const shown = f >= settle || ch === ' ' ? ch : AZ[(Math.floor(f / 2) + r * 5 + c * 7) % 26];
                  return (
                    <div key={c} style={{position: 'relative', width: 64, height: 92, borderRadius: 6, background: '#22221F', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 54, color: I}}>
                      {shown}
                      <div style={{position: 'absolute', left: 0, right: 0, top: 45, height: 2, background: N}} />
                    </div>
                  );
                })}
              </div>
              <div style={{display: 'flex', gap: 18, marginTop: 10, opacity: ip(f, done, done + 8)}}>
                <span style={mono(18, SA)}>{from}</span><span style={mono(18, O)}>{st}</span>
              </div>
            </div>
            <div style={{width: 130, height: 130, borderRadius: 10, overflow: 'hidden', opacity: ip(f, done, done + 10)}}><Media m={m} /></div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 115, top: 1468, ...mono(22, I), opacity: ip(f, 140, 155)}}>next arrival: <span style={{color: O}}>you</span></div>
    </AbsoluteFill>
  );
};

// 5 · photobooth strip
const Booth: React.FC = () => {
  const f = useCurrentFrame();
  const shots: M[] = [p('w11/f74', {fy: 40}), p('w11/f72', {fy: 30}), p('w11/f92', {fx: 45, fy: 45}), p('w11/f86', {fy: 35})];
  const flashAt = (i: number) => 70 + i * 16;
  const flash = Math.max(...shots.map((_, i) => ip(f, flashAt(i), flashAt(i) + 8, 0.85, 0)));
  return (
    <AbsoluteFill style={{background: O}}>
      <div style={{position: 'absolute', left: 120, width: 440, top: 270, height: 1290, background: I, boxSizing: 'border-box', padding: 24,
        transform: `translateY(${ip(f, 0, 60, -1360, 0)}px) rotate(-1.5deg)`, boxShadow: '0 24px 50px rgba(0,0,0,0.25)'}}>
        {shots.map((m, i) => (
          <div key={i} style={{width: 392, height: 270, marginBottom: 18, background: '#2a2a27', overflow: 'hidden'}}>
            <div style={{width: '100%', height: '100%', opacity: f >= flashAt(i) ? 1 : 0, filter: `brightness(${ip(f, flashAt(i), flashAt(i) + 14, 2, 1)})`}}><Media m={m} /></div>
          </div>
        ))}
        <div style={{textAlign: 'center', marginTop: 4, ...mark(36, G)}}>Sea, Signora</div>
        <div style={{textAlign: 'center', marginTop: 8, ...mono(14, G)}}>milano · brera</div>
      </div>
      <div style={{position: 'absolute', left: 620, width: 400, top: 420}}>
        <div style={mono(20, G)}>photobooth</div>
        <div style={{...disp(118, I), marginTop: 20}}>{'SAY\nCRUDO'}</div>
        <div style={{...ital(46, G), marginTop: 40}}>{'four frames,\none evening'}</div>
        <div style={{...mono(18, G), marginTop: 40}}>via fiori chiari 32</div>
      </div>
      <AbsoluteFill style={{background: '#FFFFFF', opacity: flash}} />
    </AbsoluteFill>
  );
};

// 6 · velvet curtain opening on the room
const Sipario: React.FC = () => {
  const f = useCurrentFrame();
  const o = ip(f, 40, 95, 0, 1, Easing.inOut(Easing.cubic));
  const folds = `repeating-linear-gradient(90deg, #10200f 0px, ${G} 34px, #2d4d2e 60px, ${G} 86px, #10200f 120px)`;
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('w10/kf0110', 4)} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 560, background: 'linear-gradient(rgba(11,11,11,0.7), rgba(11,11,11,0))'}} />
      <div style={{...center, top: 280, ...ital(70, I), opacity: ip(f, 90, 110)}}>the room is ready</div>
      <div style={{...center, top: 380, ...mono(22, I), opacity: ip(f, 100, 118)}}>your seat: front row</div>
      <div style={{position: 'absolute', left: 0, top: 0, width: 560, height: 1920, background: folds, transformOrigin: 'left center', transform: `scaleX(${1 - o * 0.78})`,
        boxShadow: 'inset -30px 0 60px rgba(0,0,0,0.5)'}} />
      <div style={{position: 'absolute', right: 0, top: 0, width: 560, height: 1920, background: folds, transformOrigin: 'right center', transform: `scaleX(${1 - o * 0.78})`,
        boxShadow: 'inset 30px 0 60px rgba(0,0,0,0.5)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 200, background: G, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: -30, height: 60, display: 'flex'}}>
          {Array.from({length: 12}, (_, i) => <div key={i} style={{width: 90, height: 60, borderRadius: '0 0 45px 45px', background: G}} />)}
        </div>
      </div>
      <div style={{opacity: 1 - ip(f, 30, 42)}}>
        <div style={{...center, top: 760, ...mono(22, SA)}}>stasera in sala</div>
        <div style={{...center, top: 810, ...disp(120, I)}}>{'IL SIPARIO\nSI APRE'}</div>
      </div>
    </AbsoluteFill>
  );
};

// 7 · the first-courses page, marked with a highlighter
const Evidenziatore: React.FC = () => {
  const f = useCurrentFrame();
  const items = ['Felicetti monograno spelt linguine with clams, sea urchins and mussels', 'Cicatelli pasta from Puglia with king crab and shellfish sauce',
    'Fusillone with seafood', 'Tagliolini with white lamb ragù and Taggiasca olives', 'Spaghetti with Cantabrian anchovy, butter and Osetra caviar',
    'Paccheri Gerardo di Nola with blue lobster', 'Risotto with aglio, olio, peperoncino, oysters and lime'];
  const hl: Record<number, number> = {2: ip(f, 36, 54, 0, 1, Easing.inOut(Easing.quad)), 4: ip(f, 80, 110, 0, 1, Easing.inOut(Easing.quad))};
  return (
    <AbsoluteFill style={{background: I}}>
      <div style={{...center, top: 290, ...disp(84, O, {letterSpacing: 6})}}>FIRST COURSES</div>
      <div style={{...center, top: 400, ...mono(18, G)}}>il menu · sea, signora</div>
      <div style={{position: 'absolute', left: 100, width: 880, top: 480}}>
        {items.map((t, i) => (
          <div key={i} style={{marginBottom: 24, ...serif(42, G)}}>
            <span style={hl[i] === undefined ? {} : {backgroundImage: 'linear-gradient(rgba(239,120,24,0.5), rgba(239,120,24,0.5))', backgroundRepeat: 'no-repeat',
              backgroundSize: `${hl[i] * 100}% 58%`, backgroundPosition: '0 88%', WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone'}}>{t}</span>
            {i === 2 && <span style={{...ital(40, O), marginLeft: 26, opacity: ip(f, 56, 66)}}>← start here</span>}
          </div>
        ))}
      </div>
      <Box b={{left: 100, width: 880, top: 1300, height: 240, borderRadius: 18}} m={p('w11/f112', {fy: 45})} />
    </AbsoluteFill>
  );
};

// 8 · cinemascope: a short film about pasta, with subtitles
const Cinema: React.FC = () => {
  const f = useCurrentFrame();
  const subs = ['— Pasta for the table?', '— Tossed in the pan, right now.', '— Then we stay for dessert.'];
  const k = Math.min(2, Math.floor(f / 75));
  return (
    <AbsoluteFill style={{background: N}}>
      <div style={{...center, top: 470, ...mono(20, O)}}>sea, signora presents</div>
      <div style={{...center, top: 520, ...ital(44, SA)}}>a short film about pasta</div>
      <Box b={{left: 0, top: 640, width: 1080, height: 452}} m={v('w10/nm0676', 3, {fy: 72})} />
      <div style={{...center, top: 1140, ...serif(48, I)}}>{subs[k]}</div>
      <div style={{opacity: ip(f, 225, 245)}}>
        <div style={{...center, top: 1300, ...mark(64, I)}}>Sea, Signora</div>
        <div style={{...center, top: 1390, ...mono(18, SA)}}>now showing · via fiori chiari 32</div>
      </div>
    </AbsoluteFill>
  );
};

// 9 · loading screen: dinner is almost ready
const Loading: React.FC = () => {
  const f = useCurrentFrame();
  const pr = interpolate(f, [0, 40, 60, 100, 120, 150], [0, 0.35, 0.42, 0.78, 0.85, 1], {extrapolateRight: 'clamp'});
  const list = ['ice, freshly crushed', 'oysters, opened to order', 'wine, breathing', 'table, set'];
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{position: 'absolute', left: 70, width: 940, top: 290, height: 480, borderRadius: 24, overflow: 'hidden'}}>
        <Media m={p('w11/f62')} style={{filter: 'blur(26px)', transform: 'scale(1.1)'}} />
        <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 ${(1 - pr) * 100}% 0)`}}><Media m={p('w11/f62')} /></div>
      </div>
      <div style={{position: 'absolute', left: 70, width: 940, top: 810, display: 'flex', justifyContent: 'space-between'}}>
        <span style={mono(22, SA)}>loading dinner</span><span style={mono(22, I)}>{Math.round(pr * 100)}%</span>
      </div>
      <div style={{position: 'absolute', left: 70, width: 940, top: 860, height: 14, borderRadius: 7, background: 'rgba(248,246,245,0.2)'}}>
        <div style={{width: `${pr * 100}%`, height: 14, borderRadius: 7, background: O}} />
      </div>
      <div style={{position: 'absolute', left: 70, top: 930}}>
        {[...list, 'you'].map((t, i) => {
          const ok = pr >= (i + 1) * 0.2 - 0.001 && i < 4;
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 22, height: 62, opacity: i < 4 ? (ok ? 1 : 0.35) : ip(f, 150, 160)}}>
              {i < 4 ? <Check c={ok ? O : SA} /> : <span style={{width: 30, ...mono(24, O)}}>…</span>}
              <span style={mono(24, i < 4 ? I : O)}>{i < 4 ? t : 'you: still missing'}</span>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 70, top: 1270, ...ital(62, I), opacity: ip(f, 165, 180)}}>ready when you are.</div>
      {f >= 175 && <Chip cta={{label: 'book a table', color: 'orange', y: 380}} />}
    </AbsoluteFill>
  );
};

// 10 · bingo card
const Bingo: React.FC = () => {
  const f = useCurrentFrame();
  const cells: [string, M][] = [['ostriche', p('w11/f36')], ['burrata', p('w11/f44', {fy: 55})], ['vino', p('w11/f10', {fy: 40})],
    ['crudo', p('w11/f23')], ['granchio reale', p('w11/f115')], ['tonno', p('w11/f88')],
    ['fusillone', p('w11/f112')], ['agnello', p('w11/f65')], ['panettone', p('w10/pan86', {fy: 60})]];
  const stamps: Record<number, number> = {1: 28, 0: 52, 4: 76, 8: 100};
  const cx = (i: number) => 70 + (i % 3) * 320 + 150, cy = (i: number) => 470 + Math.floor(i / 3) * 320 + 125;
  const ln = ip(f, 120, 140, 0, 1, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill style={{background: SA}}>
      <div style={{...center, top: 285, ...disp(96, G, {letterSpacing: 8})}}>BINGO</div>
      <div style={{...center, top: 395, ...mono(18, G)}}>sea, signora edition · how many tonight</div>
      {cells.map(([l, m], i) => (
        <div key={l} style={{position: 'absolute', left: 70 + (i % 3) * 320, top: 470 + Math.floor(i / 3) * 320, width: 300, height: 300, background: I, overflow: 'hidden'}}>
          <div style={{width: 300, height: 250}}><Media m={m} /></div>
          <div style={{height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono(16, G)}}>{l}</div>
        </div>
      ))}
      {Object.entries(stamps).map(([i, at]) => {
        const s = pop(f, at), n = Number(i);
        return <div key={i} style={{position: 'absolute', left: cx(n) - 100, top: cy(n) - 100, width: 200, height: 200, borderRadius: '50%', border: `12px solid ${O}`,
          boxSizing: 'border-box', opacity: f >= at ? 1 : 0, transform: `scale(${1.5 - 0.5 * s}) rotate(${n * 9}deg)`}} />;
      })}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={cx(0)} y1={cy(0)} x2={cx(0) + (cx(8) - cx(0)) * ln} y2={cy(0) + (cy(8) - cy(0)) * ln} stroke={O} strokeWidth={14} strokeLinecap="round" opacity={ln > 0 ? 1 : 0} />
      </svg>
      {f >= 145 && <Chip cta={{label: 'book a table', color: 'orange', y: 380}} />}
    </AbsoluteFill>
  );
};

// 11 · torn paper: outside Milano, inside the sea (still)
const tear = (y0: number, d: number) => {
  const pts: string[] = [];
  for (let x = 0, k = 0; x <= 1080; x += 36, k++) pts.push(`${x}px ${y0 + d + ((k * 37) % 7 - 3) * 6 + (k % 2 ? 8 : -6)}px`);
  return `polygon(${pts.join(', ')}, 1080px 1920px, 0px 1920px)`;
};
const Strappo: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Box b={{left: 0, top: 0, width: 1080, height: 1000}} m={p('w10/p0195', {fy: 50})} />
    <div style={{position: 'absolute', inset: 0, background: I, clipPath: tear(960, -14), filter: 'drop-shadow(0 -6px 10px rgba(0,0,0,0.35))'}} />
    <div style={{position: 'absolute', inset: 0, clipPath: tear(960, 8)}}>
      <Box b={{left: 0, top: 940, width: 1080, height: 980}} m={p('w10/bo229', {fy: 40})} />
    </div>
    <div style={{position: 'absolute', left: 80, top: 290, ...mono(22, I)}}>fuori</div>
    <div style={{position: 'absolute', left: 74, top: 330, ...disp(110, I, {textShadow: '0 4px 24px rgba(0,0,0,0.5)'})}}>MILANO</div>
    <div style={{position: 'absolute', left: 80, top: 1050, ...mono(22, I)}}>dentro</div>
    <div style={{position: 'absolute', left: 74, top: 1090, ...disp(110, I, {textShadow: '0 4px 24px rgba(0,0,0,0.5)'})}}>IL MARE</div>
    <div style={{position: 'absolute', left: 80, top: 1250, ...mono(22, I, {textShadow: '0 2px 12px rgba(0,0,0,0.7)'})}}>via fiori chiari 32 · brera</div>
  </AbsoluteFill>
);

// 12 · the Google review, read karaoke-style
const REVIEW = 'Exceptional restaurant with top quality seafood. Professional knowledgeable service within a beautifully designed atmosphere. Highly recommend, we will be back. Thank you.';
const Karaoke: React.FC = () => {
  const f = useCurrentFrame();
  const words = REVIEW.split(' ');
  const k = interpolate(f, [20, 210], [0, words.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{...center, top: 290, display: 'flex', justifyContent: 'center', gap: 12}}>
        {Array.from({length: 5}, (_, i) => (
          <svg key={i} width={46} height={46} viewBox="0 0 24 24"><path d="M12 2 L14.9 8.6 L22 9.3 L16.6 14 L18.2 21 L12 17.3 L5.8 21 L7.4 14 L2 9.3 L9.1 8.6 Z" fill={MU} /></svg>
        ))}
      </div>
      <div style={{...center, top: 360, ...mono(20, SA)}}>google review</div>
      <div style={{position: 'absolute', left: 90, width: 900, top: 440, ...ital(60, I, {lineHeight: 1.3})}}>
        {words.map((w, i) => (
          <span key={i} style={{color: i < k ? I : 'rgba(248,246,245,0.26)', textDecoration: i === Math.floor(k) - 1 ? `underline ${O}` : 'none',
            textDecorationThickness: 5, textUnderlineOffset: 10}}>{(i === 0 ? '“' : '') + w + (i === words.length - 1 ? '”' : '')} </span>
        ))}
      </div>
      <Box b={{left: 90, width: 440, top: 1140, height: 300, borderRadius: 20}} m={p('w11/f54', {fy: 50})} />
      <Box b={{left: 550, width: 440, top: 1140, height: 300, borderRadius: 20}} m={p('w10/p0290', {fy: 30})} />
      <div style={{...center, top: 1480, ...mono(20, I), opacity: ip(f, 215, 230)}}>thank you. see you soon.</div>
    </AbsoluteFill>
  );
};

// 13 · slot machine: every spin wins
const Slot: React.FC = () => {
  const f = useCurrentFrame();
  const pics: M[] = [p('w11/f36'), p('w11/f10', {fy: 40}), p('w11/f23'), p('w11/f112'), p('w11/f115'), p('w11/f44', {fy: 55}), p('w11/f88'), p('w10/pan86', {fy: 60})];
  const labels = ['ostriche', 'vino', 'crudo'];
  const P = 288, W = 268;
  const off = (i: number, fr: number) => (24 + i) * P * ip(fr, 8, 66 + i * 24, 0, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{position: 'absolute', left: 70, width: 940, top: 330, height: 1090, background: O, borderRadius: 44, boxShadow: 'inset 0 -16px 0 rgba(0,0,0,0.15)'}}>
        <div style={{...center, top: 44, ...mark(72, I)}}>Sea, Signora</div>
        <div style={{...center, top: 134, ...mono(18, G)}}>every spin wins</div>
        <div style={{position: 'absolute', left: 40, right: 40, top: 30, display: 'flex', justifyContent: 'space-between'}}>
          {[0, 1].map((s) => <div key={s} style={{width: 20, height: 20, borderRadius: '50%', background: (Math.floor(f / 6) + s) % 2 ? I : SA}} />)}
        </div>
        <div style={{position: 'absolute', left: 40, width: 860, top: 200, height: 420, background: N, borderRadius: 22, display: 'flex', gap: 18, padding: '0 17px',
          boxSizing: 'border-box', overflow: 'hidden'}}>
          {[0, 1, 2].map((i) => {
            const o = off(i, f), vel = off(i, f + 1) - o;
            return (
              <div key={i} style={{position: 'relative', width: W, height: 420, overflow: 'hidden', background: I}}>
                <div style={{position: 'absolute', left: 0, top: 76 - o, filter: `blur(${Math.min(9, vel / 14)}px)`}}>
                  {Array.from({length: 34}, (_, j) => (
                    <div key={j} style={{width: W, height: W, marginBottom: P - W, overflow: 'hidden'}}><Media m={pics[j % 8]} /></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', left: 57, top: 650, display: 'flex', gap: 18}}>
          {labels.map((l, i) => <div key={l} style={{width: W, textAlign: 'center', ...mono(20, G), opacity: ip(f, 66 + i * 24, 76 + i * 24)}}>{l}</div>)}
        </div>
        <div style={{...center, top: 760, ...disp(120, I, {letterSpacing: 8}), transform: `scale(${f >= 125 ? 0.6 + 0.4 * pop(f, 125) : 0})`}}>JACKPOT</div>
        <div style={{...center, top: 910, ...ital(48, G), opacity: ip(f, 140, 155)}}>oysters, wine, crudo.</div>
        <div style={{...center, top: 990, ...mono(18, G), opacity: ip(f, 150, 165)}}>every combination wins at sea, signora</div>
      </div>
    </AbsoluteFill>
  );
};

// 14 · before / after wipe: oysters al naturale or with caviar
const Tendina: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 20, 70, 105, 160, 195, 240], [470, 470, 140, 140, 800, 800, 470], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const W = 940, T = 470, H = 1060;
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{...center, top: 285, ...disp(84, I, {letterSpacing: 6})}}>OSTRICHE</div>
      <div style={{position: 'absolute', left: 70, width: W, top: 400, display: 'flex', justifyContent: 'space-between'}}>
        <span style={mono(20, SA)}>← al naturale</span><span style={mono(20, O)}>con caviale →</span>
      </div>
      <div style={{position: 'absolute', left: 70, width: W, top: T, height: H, borderRadius: 26, overflow: 'hidden'}}>
        <Media m={p('w11/f28', {fy: 45})} />
        <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${x}px)`}}><Media m={p('w11/f97', {fy: 50})} /></div>
        <div style={{position: 'absolute', left: x - 3, top: 0, width: 6, height: H, background: I}} />
        <div style={{position: 'absolute', left: x - 48, top: H / 2 - 48, width: 96, height: 96, borderRadius: '50%', background: I, display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 6px 20px rgba(0,0,0,0.35)'}}>
          <svg width={50} height={30} viewBox="0 0 50 30" fill="none" stroke={G} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"><path d="M14 4 L4 15 L14 26 M36 4 L46 15 L36 26" /></svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 15 · magnifier over the shared table
const Lente: React.FC = () => {
  const f = useCurrentFrame();
  const S = 1080 / 1467, OY = 220, TOP = 430, R = 170;
  const stops: [number, number, string, string][] = [[996, 587, 'Crudo', 'raw bar'], [398, 880, 'Burrata with red prawn', 'appetizers'],
    [356, 1467, 'Ostriche', 'aquarium'], [1090, 1258, 'Wagyu carpaccio', 'appetizers']];
  const keys = [0, 50, 68, 113, 131, 176, 194];
  const vals = [0, 0, 1, 1, 2, 2, 3];
  const t = interpolate(f, keys, vals, {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const a = Math.floor(t), b = Math.min(3, a + 1), u = t - a;
  const px = (stops[a][0] + (stops[b][0] - stops[a][0]) * u) * S, py = (stops[a][1] + (stops[b][1] - stops[a][1]) * u) * S;
  const cur = stops[Math.round(t)];
  const lx = px, ly = py - OY;
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{position: 'absolute', left: 80, top: 285, ...mono(20, SA)}}>look closer · {cur[3]}</div>
      <div style={{position: 'absolute', left: 80, top: 322, ...ital(70, I)}}>{cur[2]}</div>
      <div style={{position: 'absolute', left: 0, top: TOP, width: 1080, height: 1130, overflow: 'hidden'}}>
        <Img src={staticFile('photos/w11/f50.jpg')} style={{position: 'absolute', left: 0, top: -OY, width: 1080, height: 2200 * S, filter: 'brightness(0.62)'}} />
        <div style={{position: 'absolute', left: lx - R, top: ly - R, width: 2 * R, height: 2 * R, borderRadius: '50%', overflow: 'hidden', border: `8px solid ${I}`,
          boxSizing: 'border-box', boxShadow: '0 16px 40px rgba(0,0,0,0.5)'}}>
          <Img src={staticFile('photos/w11/f50.jpg')} style={{position: 'absolute', left: R - px * 2, top: R - py * 2, width: 2160, height: 2200 * S * 2, maxWidth: 'none'}} />
        </div>
        <div style={{position: 'absolute', left: lx + R * 0.62, top: ly + R * 0.62, width: 110, height: 22, borderRadius: 11, background: I, transform: 'rotate(45deg)',
          transformOrigin: '0 50%'}} />
      </div>
    </AbsoluteFill>
  );
};

// 16 · sticker pack
const Adesivi: React.FC = () => {
  const f = useCurrentFrame();
  const st: [number, number, number, M][] = [[90, 600, -6, p('w11/f97', {fy: 45})], [610, 600, 5, p('w11/f44', {fy: 55})],
    [90, 1010, 4, p('w11/f92', {fx: 40, fy: 50})], [610, 1010, -5, p('w11/f10', {fy: 40})]];
  const pills: [string, string, string][] = [['fresh today', O, I], ["chef's pick", G, I], ['pet friendly', I, G]];
  return (
    <AbsoluteFill style={{background: SA}}>
      <div style={{...center, top: 285, ...mono(20, G)}}>sticker pack · sea, signora</div>
      <div style={{...center, top: 330, ...disp(100, G)}}>{'COLLECT\nTHEM ALL'}</div>
      {st.map(([x, y, r, m], i) => {
        const s = pop(f, 14 + i * 14);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: 380, height: 380, borderRadius: '50%', overflow: 'hidden', border: `16px solid ${I}`,
            boxSizing: 'border-box', boxShadow: '0 14px 30px rgba(0,0,0,0.25)', opacity: f >= 14 + i * 14 ? 1 : 0, transform: `scale(${s}) rotate(${r}deg)`}}>
            <Media m={m} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1420, display: 'flex', justifyContent: 'center', gap: 18}}>
        {pills.map(([t, bg, fg], i) => {
          const s = pop(f, 76 + i * 10);
          return <div key={t} style={{padding: '18px 28px', borderRadius: 40, background: bg, ...mono(22, fg, {letterSpacing: 2}), boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
            opacity: f >= 76 + i * 10 ? 1 : 0, transform: `scale(${s}) rotate(${[-3, 2, -2][i]}deg)`}}>{t}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// 17 · triptych: fire, pan, table
const Trittico: React.FC = () => {
  const f = useCurrentFrame();
  const cols: [M, string][] = [[v('w10/kf0113', 20, {fx: 50}), '1 · la cucina'], [v('w10/nm0688', 0.5, {fx: 50}), '2 · la padella'],
    [v('w10/nm0742', 1, {fx: 45}), '3 · la tavola']];
  return (
    <AbsoluteFill style={{background: I}}>
      {cols.map(([m, l], i) => {
        const r = ip(f, i * 10, 26 + i * 10, 100, 0, Easing.out(Easing.cubic));
        return (
          <div key={l} style={{position: 'absolute', left: i * 362, top: 0, width: 356, height: 1920, overflow: 'hidden', clipPath: `inset(${r}% 0 0 0)`}}>
            <Media m={m} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 1450, display: 'flex', justifyContent: 'center'}}>
              <div style={{padding: '14px 22px', borderRadius: 30, background: I, ...mono(18, G, {letterSpacing: 2})}}>{l}</div>
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 440, background: G}}>
        <div style={{...center, top: 285, ...disp(62, I, {lineHeight: 1.1})}}>{'FROM THE FIRE\nTO YOUR TABLE'}</div>
      </div>
    </AbsoluteFill>
  );
};

// 18 · the reservations book, one line left
const Prenota: React.FC = () => {
  const f = useCurrentFrame();
  const rows: [string, string, string][] = [['4', 'a first date', '2'], ['7', 'the whole office', '12'], ['9', 'a birthday', '6'], ['12', 'the regulars', '3'],
    ['bar', 'walk-in', '1'], ['…', 'you', '…']];
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('w10/bo295')} style={{filter: 'blur(10px) brightness(0.55)', transform: 'scale(1.08)'}} />
      <div style={{position: 'absolute', left: 100, width: 880, top: 300, height: 1020, background: I, borderRadius: 8, transform: 'rotate(-1.2deg)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>
        <div style={{position: 'absolute', left: 104, top: 0, bottom: 0, width: 3, background: O, opacity: 0.6}} />
        <div style={{position: 'absolute', left: 140, top: 56, ...ital(72, G)}}>Prenotazioni</div>
        <div style={{position: 'absolute', left: 144, top: 160, ...mono(16, O)}}>sea, signora · via fiori chiari 32</div>
        <div style={{position: 'absolute', left: 140, right: 60, top: 240, display: 'flex', ...mono(15, G)}}>
          <span style={{width: 150}}>tavolo</span><span style={{flex: 1}}>chi</span><span>coperti</span>
        </div>
        {rows.map((r, i) => {
          const at = 14 + i * 20;
          const last = i === rows.length - 1;
          return (
            <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 290 + i * 110, height: 110, borderBottom: '2px solid rgba(27,47,28,0.18)'}}>
              <div style={{position: 'absolute', left: 140, right: 60, top: 30, display: 'flex', ...ital(46, last ? O : G),
                clipPath: `inset(0 ${100 - ip(f, at, at + 18, 0, 100, Easing.linear)}% 0 0)`}}>
                <span style={{width: 150}}>{r[0]}</span><span style={{flex: 1}}>{r[1]}</span><span>{r[2]}</span>
              </div>
            </div>
          );
        })}
        <svg width={880} height={1020} style={{position: 'absolute', inset: 0}} fill="none" stroke={O} strokeWidth={6} strokeLinecap="round">
          <path pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ip(f, 140, 160)} d="M 270 870 C 280 830, 430 828, 440 868 C 448 905, 300 915, 265 885 C 255 875, 262 860, 290 852" />
        </svg>
      </div>
      {f >= 165 && <Chip cta={{label: 'book a table', color: 'orange', y: 380}} />}
    </AbsoluteFill>
  );
};

// 19 · giant type blended over the aquarium
const Mare: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={p('w10/bo149', {fy: 50})} style={{transform: `scale(${1 + f / 2400})`}} />
      <div style={{position: 'absolute', left: 70, top: 300, ...disp(520, I, {letterSpacing: 10, mixBlendMode: 'difference'}), transform: `translateX(${ip(f, 0, 30, -900, 0)}px)`}}>MA</div>
      <div style={{position: 'absolute', right: 70, top: 800, ...disp(520, I, {letterSpacing: 10, mixBlendMode: 'difference'}), transform: `translateX(${ip(f, 6, 36, 900, 0)}px)`}}>RE</div>
      <div style={{position: 'absolute', left: 80, top: 1400, ...mono(22, I), opacity: ip(f, 45, 60)}}>il mare, nel cuore di brera</div>
      <div style={{position: 'absolute', left: 80, top: 1445, ...mark(64, I), opacity: ip(f, 55, 70)}}>Sea, Signora</div>
    </AbsoluteFill>
  );
};

// 20 · the formula
const Formula: React.FC = () => {
  const f = useCurrentFrame();
  const parts: [string, M][] = [['ostriche', p('w11/f36')], ['vino', p('w11/f7', {fy: 40})], ['amici', p('w11/f79', {fx: 40, fy: 35})]];
  const sc = (at: number) => (f >= at ? pop(f, at) : 0);
  return (
    <AbsoluteFill style={{background: I}}>
      <div style={{...center, top: 285, ...disp(96, G, {letterSpacing: 6})}}>LA FORMULA</div>
      <div style={{...center, top: 395, ...mono(18, O)}}>sea, signora · milano</div>
      {parts.map(([l, m], i) => (
        <div key={l} style={{position: 'absolute', left: 70 + i * 340, top: 470, width: 260, transform: `scale(${sc(10 + i * 22)})`}}>
          <div style={{width: 260, height: 260, borderRadius: 24, overflow: 'hidden'}}><Media m={m} /></div>
          <div style={{textAlign: 'center', marginTop: 16, ...mono(18, G)}}>{l}</div>
        </div>
      ))}
      {[0, 1].map((i) => <div key={i} style={{position: 'absolute', left: 330 + i * 340, top: 560, width: 80, textAlign: 'center', ...mono(72, O), transform: `scale(${sc(20 + i * 22)})`}}>+</div>)}
      <div style={{...center, top: 790, ...mono(90, O), transform: `scale(${sc(78)})`}}>=</div>
      <div style={{position: 'absolute', left: 70, top: 920, width: 940, height: 470, borderRadius: 28, overflow: 'hidden', transform: `scale(${sc(92)})`}}>
        <Media m={p('w11/f73', {fy: 45})} />
      </div>
      <div style={{...center, top: 1420, ...ital(56, G), opacity: ip(f, 110, 125)}}>una bella serata</div>
    </AbsoluteFill>
  );
};

// 21 · end credits over the room
const Titoli: React.FC = () => {
  const f = useCurrentFrame();
  const credits: [string, string][] = [['starring', 'Ostriche Gillardeau'], ['', 'Burrata with red prawn'], ['', 'Fusillone with seafood'], ['', 'Toast with king crab'],
    ['brand chef', 'Antonio Fresa'], ['chef', 'Roberto Godi'], ['general manager', 'Vincenzo De Santis'], ['sound', 'the room'], ['filmed at', 'Via Fiori Chiari 32, Milano'],
    ['and', 'you']];
  const y = interpolate(f, [0, 290], [1500, -1500], {extrapolateRight: 'clamp'});
  const end = ip(f, 285, 305);
  return (
    <AbsoluteFill style={{background: N}}>
      <Media m={v('w10/kf0110', 8)} style={{filter: 'blur(16px) brightness(0.38)', transform: 'scale(1.12)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, bottom: 340, overflow: 'hidden', opacity: 1 - end,
        WebkitMaskImage: 'linear-gradient(transparent, black 12%, black 88%, transparent)', maskImage: 'linear-gradient(transparent, black 12%, black 88%, transparent)'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center'}}>
          <div style={mark(80, I)}>Sea, Signora</div>
          <div style={{...mono(20, SA), marginTop: 18}}>presents</div>
          <div style={{...disp(70, I), marginTop: 30, marginBottom: 120}}>A NIGHT IN BRERA</div>
          {credits.map(([r, n], i) => (
            <div key={i} style={{marginBottom: r === '' || credits[i + 1]?.[0] === '' ? 30 : 90}}>
              {r && <div style={{...mono(18, SA), marginBottom: 12}}>{r}</div>}
              <div style={ital(54, n === 'you' ? O : I)}>{n}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{opacity: end}}>
        <div style={{...center, top: 700, ...mono(22, SA)}}>next screening</div>
        <div style={{...center, top: 750, ...ital(110, I)}}>tonight</div>
        <div style={{...center, top: 920, ...mark(64, I)}}>Sea, Signora</div>
      </div>
      {f >= 300 && <Chip cta={{label: 'book a table', color: 'orange', y: 380}} />}
    </AbsoluteFill>
  );
};

type Spec = {id: string; day: string; sec: number; view: React.FC; screen: string; caption: string; hashtags: string[]; cta?: string};
const tags = (...t: string[]) => ['#seasignora', ...t];
export const FRESH: Spec[] = [
  {id: 'F-01v-neon', day: '1', sec: 8, view: Neon, screen: 'Sea, Signora / the lights are on / via fiori chiari 32 · brera', cta: 'book a table',
    caption: 'The sign is on and the room is warm. Come in.', hashtags: tags('#brera', '#milano', '#dinner')},
  {id: 'F-02v-segno', day: '1', sec: 8, view: Segno, screen: 'the good part, right here. / carpaccio · finished by hand',
    caption: 'Every carpaccio is finished by hand, seconds before it reaches your table.', hashtags: tags('#carpaccio', '#crudo', '#openkitchen')},
  {id: 'F-03v-meteo', day: '1', sec: 8, view: Meteo, screen: 'meteo · brera / 100% chance of oysters / hourly: aperitivo, ostriche, crudo, pasta, dolce / sea: calm · room: warm · feels like: brera',
    caption: 'Forecast for Brera: 100% chance of oysters, a calm sea and a warm room.', hashtags: tags('#brera', '#oysters', '#milano')},
  {id: 'F-04v-tabellone', day: '2', sec: 8, view: Tabellone, screen: 'arrivi · in sala / Sea, Signora / OSTRICHE, CRUDO (raw bar · al tavolo) · FUSILLONE, GRANCHIO, TONNO (cucina · in arrivo) · DOLCE (pasticceria · per ultimo) / next arrival: you',
    caption: 'Arrivals: oysters and crudo already at the table, fusillone, king crab and tuna on their way, dessert last. Next arrival: you.', hashtags: tags('#seafood', '#brera', '#milano')},
  {id: 'F-05v-photobooth', day: '2', sec: 7, view: Booth, screen: 'photobooth / SAY CRUDO / four frames, one evening / via fiori chiari 32',
    caption: 'Say crudo. Four frames from one evening at Sea, Signora.', hashtags: tags('#friends', '#dinner', '#brera')},
  {id: 'F-06v-sipario', day: '2', sec: 8, view: Sipario, screen: 'stasera in sala / IL SIPARIO SI APRE → the room is ready / your seat: front row',
    caption: 'Curtain up: the room is ready and the best seat is yours.', hashtags: tags('#brera', '#milano', '#restaurant')},
  {id: 'F-07v-evidenziatore', day: '3', sec: 7, view: Evidenziatore, screen: 'FIRST COURSES / il menu · sea, signora / 7 first courses, two highlighted: Fusillone with seafood (← start here), Spaghetti with Cantabrian anchovy, butter and Osetra caviar',
    caption: 'Our first courses, highlighted: start with the fusillone with seafood, then the spaghetti with Cantabrian anchovy, butter and Osetra caviar.', hashtags: tags('#pasta', '#fusillone', '#caviar')},
  {id: 'F-08v-cinemascope', day: '3', sec: 9, view: Cinema, screen: 'sea, signora presents / a short film about pasta / — Pasta for the table? — Tossed in the pan, right now. — Then we stay for dessert. / Sea, Signora · now showing · via fiori chiari 32',
    caption: 'Now showing: pasta for the table, tossed in the pan, right now. Stay for dessert.', hashtags: tags('#pasta', '#openkitchen', '#brera')},
  {id: 'F-09v-loading', day: '3', sec: 8, view: Loading, screen: 'loading dinner 0→100% / ice, freshly crushed · oysters, opened to order · wine, breathing · table, set / you: still missing / ready when you are.', cta: 'book a table',
    caption: 'Ice crushed, oysters opened, wine breathing, table set. Only you are missing.', hashtags: tags('#oysters', '#dinner', '#brera')},
  {id: 'F-10v-bingo', day: '4', sec: 8, view: Bingo, screen: 'BINGO / sea, signora edition · how many tonight / ostriche, burrata, vino, crudo, granchio reale, tonno, fusillone, agnello, panettone', cta: 'book a table',
    caption: 'Sea, Signora bingo: oysters, burrata, king crab, panettone. How many can you tick tonight?', hashtags: tags('#seafood', '#sharing', '#brera')},
  {id: 'F-11p-strappo', day: '4', sec: 7, view: Strappo, screen: 'fuori MILANO / dentro IL MARE / via fiori chiari 32 · brera',
    caption: 'Outside, Milano. Inside, the sea. Via Fiori Chiari 32, Brera.', hashtags: tags('#brera', '#milano', '#seafood')},
  {id: 'F-12v-recensione', day: '4', sec: 9, view: Karaoke, screen: '★★★★★ google review / “Exceptional restaurant with top quality seafood. Professional knowledgeable service within a beautifully designed atmosphere. Highly recommend, we will be back. Thank you.” / thank you. see you soon.',
    caption: '“Exceptional restaurant with top quality seafood… we will be back.” Thank you, we will be here.', hashtags: tags('#review', '#brera', '#milano')},
  {id: 'F-13v-jackpot', day: '5', sec: 7, view: Slot, screen: 'Sea, Signora / every spin wins / ostriche · vino · crudo / JACKPOT / oysters, wine, crudo. / every combination wins at sea, signora',
    caption: 'Every spin wins: oysters, wine and crudo. Jackpot.', hashtags: tags('#oysters', '#crudo', '#brera')},
  {id: 'F-14v-tendina', day: '5', sec: 8, view: Tendina, screen: 'OSTRICHE / ← al naturale · con caviale →',
    caption: 'Oysters: al naturale, or with caviar and a red prawn on top. How do you take yours?', hashtags: tags('#oysters', '#caviar', '#rawbar')},
  {id: 'F-15v-trittico', day: '5', sec: 8, view: Trittico, screen: 'FROM THE FIRE TO YOUR TABLE / 1 · la cucina · 2 · la padella · 3 · la tavola',
    caption: 'From the fire to your table: the kitchen, the pan, the table.', hashtags: tags('#openkitchen', '#pasta', '#brera')},
  {id: 'F-16v-adesivi', day: '6', sec: 7, view: Adesivi, screen: 'sticker pack · sea, signora / COLLECT THEM ALL / fresh today · chef\'s pick · pet friendly',
    caption: 'Sticker pack: oysters, burrata, a glass of wine and our four-legged regulars. Collect them all at the table.', hashtags: tags('#petfriendly', '#oysters', '#brera')},
  {id: 'F-17v-lente', day: '6', sec: 9, view: Lente, screen: 'look closer / Crudo (raw bar) → Burrata with red prawn (appetizers) → Ostriche (aquarium) → Wagyu carpaccio (appetizers)',
    caption: 'Look closer: crudo, burrata with red prawn, oysters and wagyu carpaccio, all on one table.', hashtags: tags('#sharing', '#seafood', '#brera')},
  {id: 'F-18v-prenotazioni', day: '6', sec: 7, view: Prenota, screen: 'Prenotazioni / tavolo · chi · coperti: a first date, the whole office, a birthday, the regulars, walk-in, you', cta: 'book a table',
    caption: 'The book is filling up: a first date, the whole office, the regulars. One line left, with your name on it.', hashtags: tags('#reservations', '#brera', '#milano')},
  {id: 'F-19v-mare', day: '7', sec: 7, view: Mare, screen: 'MA / RE / il mare, nel cuore di brera / Sea, Signora',
    caption: 'Il mare, nel cuore di Brera.', hashtags: tags('#aquarium', '#brera', '#milano')},
  {id: 'F-20v-formula', day: '7', sec: 7, view: Formula, screen: 'LA FORMULA / ostriche + vino + amici = una bella serata',
    caption: 'The formula: oysters + wine + friends = una bella serata.', hashtags: tags('#friends', '#oysters', '#brera')},
  {id: 'F-21v-titoli', day: '7', sec: 12, view: Titoli, screen: 'Sea, Signora presents A NIGHT IN BRERA / starring Ostriche Gillardeau, Burrata with red prawn, Fusillone with seafood, Toast with king crab / brand chef Antonio Fresa / chef Roberto Godi / general manager Vincenzo De Santis / sound: the room / filmed at Via Fiori Chiari 32, Milano / and you / next screening: tonight', cta: 'book a table',
    caption: 'Starring oysters, burrata and fusillone. Brand chef Antonio Fresa, chef Roberto Godi. Next screening: tonight.', hashtags: tags('#brera', '#milano', '#dinner')},
];
