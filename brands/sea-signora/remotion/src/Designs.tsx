import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// New story designs in the Sea, Signora identity (client 16.11: «make more different designs in the identity»).
// Fourteen layouts the account has not had, each borrowing an everyday object and dressing it in the brand: magazine
// cover, newspaper, boarding pass, postage stamp, bottle label, «riservato» table card, tarot card, cinema marquee,
// recipe card, three windows, film strip, tear-off calendar, map, phone notification. Brand colours only (green 5605,
// orange 158, sand 454, ivory), Skanaus / JetBrains Mono / Spectral italic; footage inside wherever it fits.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory, N = '#0B0B0B';
type M = {src: string; at?: number; fx?: number; fy?: number; z?: number};
const isV = (m: M) => m.src.endsWith('.mp4');
const Media: React.FC<{m: M; style?: React.CSSProperties}> = ({m, style}) => {
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${m.fx ?? 50}% ${m.fy ?? 50}%`,
    transform: `scale(${m.z ?? 1})`, transformOrigin: `${m.fx ?? 50}% ${m.fy ?? 50}%`, ...style};
  return isV(m) ? <OffthreadVideo src={staticFile(`videos/${m.src}`)} startFrom={Math.round((m.at ?? 0) * FPS)} muted style={st} />
    : <Img src={staticFile(`photos/${m.src}`)} style={st} />;
};
const Box: React.FC<{b: React.CSSProperties; m: M; children?: React.ReactNode}> = ({b, m, children}) => (
  <div style={{position: 'absolute', overflow: 'hidden', ...b}}><Media m={m} />{children}</div>
);
const mono = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: size,
  letterSpacing: size >= 28 ? 3 : 5, textTransform: 'uppercase', color, ...x});
const disp = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: size,
  textTransform: 'uppercase', lineHeight: 1, letterSpacing: 1, color, whiteSpace: 'pre-line', ...x});
const ital = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.serif, fontStyle: 'italic',
  fontSize: size, lineHeight: 1.3, color, whiteSpace: 'pre-line', ...x});
const center: React.CSSProperties = {position: 'absolute', left: 0, right: 0, textAlign: 'center'};

// ───────────────────────────── the designs
type D = {id: string; sec: number; caption: string; hashtags: string[]; view: React.FC};
const tags = (...t: string[]) => ['#seasignora', ...t];
const p = (n: string, o: Partial<M> = {}): M => ({src: `w10/${n}.jpg`, ...o});
const v = (n: string, at: number, o: Partial<M> = {}): M => ({src: `w10/${n}.mp4`, at, ...o});

// 1 · magazine cover: masthead over the footage, cover lines down the left
const Cover: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={v('kf0111', 19.6)} />
    <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(11,11,11,0.7) 0%, rgba(11,11,11,0) 30%, rgba(11,11,11,0) 55%, rgba(11,11,11,0.75) 85%)'}} />
    <div style={{...center, top: 250, ...mono(22, I)}}>the brera issue · novembre</div>
    <div style={{...center, top: 290, fontFamily: fonts.display, fontSize: 168, color: I, letterSpacing: 2}}>Signora</div>
    <div style={{position: 'absolute', left: 70, top: 1080, width: 560}}>
      {[['Polpo', 'the new obsession'], ['The open kitchen', 'nobody walks in there'], ['Brera after dark', 'a field guide']].map(([h, s], i) => (
        <div key={i} style={{marginBottom: 34}}>
          <div style={disp(54, I)}>{h}</div>
          <div style={{...mono(20, O), marginTop: 8}}>{s}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

// 2 · newspaper front page
const Paper: React.FC = () => (
  <AbsoluteFill style={{background: I}}>
    <div style={{...center, top: 270, ...disp(70, G), textTransform: 'none'}}>Il Corriere di Sea, Signora</div>
    <div style={{position: 'absolute', left: 70, right: 70, top: 370, borderTop: `3px solid ${G}`, borderBottom: `1px solid ${G}`, padding: '10px 0',
      display: 'flex', justifyContent: 'space-between', ...mono(18, G)}}>
      <span>milano · brera</span><span>edizione della sera</span><span>via fiori chiari, 32</span>
    </div>
    <div style={{position: 'absolute', left: 70, right: 70, top: 440, ...ital(72, G), lineHeight: 1.05, fontStyle: 'normal', fontFamily: fonts.serif}}>
      Full house again in Brera: the polpo is to blame
    </div>
    <Box b={{left: 70, top: 640, width: 940, height: 560}} m={p('bo228')} />
    <div style={{position: 'absolute', left: 70, top: 1215, ...mono(16, G)}}>pictured: a wednesday, around nine</div>
    <div style={{position: 'absolute', left: 70, right: 70, top: 1260, display: 'flex', gap: 40}}>
      {['Witnesses report a plate of octopus with pumpkin, hazelnuts and salsify, followed by silence, then a second order.',
        'The kitchen stays open until midnight. Sources close to the bar confirm there is always time for one more.'].map((t, i) => (
        <div key={i} style={{flex: 1, ...ital(28, G), fontStyle: 'normal', lineHeight: 1.35}}>{t}</div>
      ))}
    </div>
  </AbsoluteFill>
);

// 3 · boarding pass
const Pass: React.FC = () => {
  const row = (a: string, b: string) => (<div><div style={mono(16, G)}>{a}</div><div style={{...disp(44, G), marginTop: 6}}>{b}</div></div>);
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{...center, top: 270, ...mono(22, I)}}>boarding pass</div>
      <div style={{position: 'absolute', left: 110, right: 110, top: 340, height: 1180, background: I, borderRadius: 34, overflow: 'hidden'}}>
        <Box b={{left: 0, right: 0, top: 0, height: 470}} m={v('kf0103', 8.9)} />
        <div style={{position: 'absolute', left: 60, right: 60, top: 520, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div><div style={mono(16, G)}>from</div><div style={disp(76, G)}>Your day</div></div>
          <div style={{...disp(60, O)}}>→</div>
          <div style={{textAlign: 'right'}}><div style={mono(16, G)}>to</div><div style={{fontFamily: fonts.display, fontSize: 76, color: G}}>Signora</div></div>
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 720, display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 40}}>
          {row('gate', 'Fiori Chiari 32')}{row('boarding', '19:00')}{row('seat', 'Table for two')}{row('class', 'Crudo first')}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 960, borderTop: `4px dashed ${G}`}} />
        <div style={{position: 'absolute', left: 60, right: 60, top: 1000, display: 'flex', gap: 5, height: 120}}>
          {Array.from({length: 60}, (_, i) => <div key={i} style={{width: [3, 7, 2, 5][i % 4], background: G}} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4 · postage stamp
const Stamp: React.FC = () => (
  <AbsoluteFill style={{background: SA}}>
    <div style={{position: 'absolute', left: 170, top: 380, width: 740, height: 960, background: I, padding: 30}}>
      {Array.from({length: 21}, (_, i) => <React.Fragment key={i}>
        <div style={{position: 'absolute', left: -14 + i * 37, top: -14, width: 28, height: 28, borderRadius: '50%', background: SA}} />
        <div style={{position: 'absolute', left: -14 + i * 37, bottom: -14, width: 28, height: 28, borderRadius: '50%', background: SA}} />
      </React.Fragment>)}
      {Array.from({length: 27}, (_, i) => <React.Fragment key={i}>
        <div style={{position: 'absolute', top: -14 + i * 37, left: -14, width: 28, height: 28, borderRadius: '50%', background: SA}} />
        <div style={{position: 'absolute', top: -14 + i * 37, right: -14, width: 28, height: 28, borderRadius: '50%', background: SA}} />
      </React.Fragment>)}
      <div style={{position: 'absolute', left: 40, right: 40, top: 40, bottom: 160, overflow: 'hidden'}}><Media m={p('bo151', {fx: 40})} /></div>
      <div style={{position: 'absolute', left: 40, bottom: 60, ...disp(56, G)}}>Acquario</div>
      <div style={{position: 'absolute', right: 40, bottom: 66, ...mono(18, G)}}>posta di brera</div>
    </div>
    <div style={{position: 'absolute', left: 640, top: 300, width: 300, height: 300, borderRadius: '50%', border: `4px solid ${O}`, transform: 'rotate(-14deg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={mono(20, O)}>milano</div><div style={{fontFamily: fonts.display, fontSize: 40, color: O, margin: '10px 0'}}>Sea, Signora</div><div style={mono(16, O)}>via fiori chiari</div>
    </div>
    <div style={{...center, top: 1420, ...ital(40, G)}}>{'wish you were here.\nyou could be, tonight.'}</div>
  </AbsoluteFill>
);

// 5 · bottle label
const Label: React.FC = () => (
  <AbsoluteFill style={{background: G}}>
    <Box b={{left: 0, right: 0, top: 0, height: 900}} m={v('nm0656', 4.3, {fy: 60})} />
    <div style={{position: 'absolute', left: 140, right: 140, top: 760, height: 700, background: I, borderRadius: '50% / 40%', border: `6px double ${G}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}>
      <div style={mono(20, O)}>riserva della cucina</div>
      <div style={{width: 160, height: 2, background: G, margin: '22px 0'}} />
      <div style={disp(120, G)}>Polpo</div>
      <div style={{...ital(36, G), marginTop: 16, textAlign: 'center'}}>{'zucca, nocciole\ne scorzanera'}</div>
      <div style={{width: 160, height: 2, background: G, margin: '22px 0'}} />
      <div style={{fontFamily: fonts.display, fontSize: 40, color: G}}>Sea, Signora</div>
      <div style={{...mono(16, G), marginTop: 8}}>imbottigliato a brera</div>
    </div>
  </AbsoluteFill>
);

// 6 · «riservato» table card over the set table
const Riservato: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={p('p0213', {fy: 50})} />
    <AbsoluteFill style={{background: 'rgba(11,11,11,0.25)'}} />
    <div style={{position: 'absolute', left: 230, right: 230, top: 600, height: 520, background: I, boxShadow: '0 30px 60px rgba(0,0,0,0.45)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-3deg)'}}>
      <div style={{fontFamily: fonts.display, fontSize: 38, color: G}}>Sea, Signora</div>
      <div style={{...disp(96, G), marginTop: 36}}>Riservato</div>
      <div style={{...ital(44, O), marginTop: 22}}>per te</div>
      <div style={{...mono(20, G), marginTop: 40}}>stasera · dalle 19:00</div>
    </div>
  </AbsoluteFill>
);

// 7 · tarot card
const Tarot: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <div style={{position: 'absolute', left: 170, top: 330, width: 740, height: 1180, background: G, borderRadius: 30, border: `4px solid ${O}`,
      outline: `2px solid ${O}`, outlineOffset: -24}}>
      <div style={{...center, top: 60, ...mono(22, O)}}>la carta della sera</div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 120, height: 820, overflow: 'hidden', borderRadius: '320px 320px 0 0'}}>
        <Media m={v('kf0093', 3.0)} />
      </div>
      <div style={{...center, top: 980, ...disp(80, I)}}>L'Autunno</div>
      <div style={{...center, top: 1080, ...ital(30, I)}}>long dinners and warm light ahead</div>
    </div>
  </AbsoluteFill>
);

// 8 · cinema marquee
const Marquee: React.FC = () => {
  const bulbs = (n: number, horiz: boolean, at: number) => Array.from({length: n}, (_, i) => (
    <div key={i} style={{position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#FCE7B0', boxShadow: '0 0 14px #FCCE09',
      ...(horiz ? {left: 110 + i * (860 / (n - 1)) - 9, top: at} : {top: 300 + i * (720 / (n - 1)) - 9, left: at})}} />
  ));
  return (
    <AbsoluteFill style={{background: N}}>
      <Box b={{left: 0, right: 0, top: 1060, bottom: 0}} m={v('nm0662', 31.8)} />
      <div style={{position: 'absolute', left: 110, right: 110, top: 300, height: 720, background: O}} />
      {bulbs(14, true, 300)}{bulbs(14, true, 1020)}{bulbs(9, false, 110)}{bulbs(9, false, 970)}
      <div style={{...center, top: 360, ...mono(24, G)}}>stasera in sala</div>
      <div style={{...center, top: 420, ...disp(210, G)}}>Polpo</div>
      <div style={{...center, top: 680, ...mono(22, G)}}>starring zucca · nocciole · scorzanera</div>
      <div style={{...center, top: 740, ...mono(22, G)}}>directed by la cucina</div>
      <div style={{...center, top: 840, ...ital(40, I)}}>every night, until midnight</div>
    </AbsoluteFill>
  );
};

// 9 · recipe card (with what we won't tell)
const Recipe: React.FC = () => (
  <AbsoluteFill style={{background: O}}>
    <div style={{position: 'absolute', left: 120, right: 120, top: 360, height: 1100, background: I, transform: 'rotate(2deg)',
      backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 63px, rgba(27,47,28,0.18) 63px 65px)`, boxShadow: '0 24px 50px rgba(0,0,0,0.3)'}}>
      <div style={{position: 'absolute', left: 90, top: 0, bottom: 0, width: 2, background: O}} />
      <div style={{position: 'absolute', left: 120, top: 40, ...mono(18, O)}}>ricetta della casa</div>
      <div style={{position: 'absolute', left: 120, top: 80, ...ital(68, G)}}>Spaghetti al tonno</div>
      <div style={{position: 'absolute', left: 120, right: 60, top: 220, ...ital(38, G), lineHeight: '65px'}}>
        {'— spaghetti\n— tonno rosso\n— olio buono\n— a secret we keep\n   in the kitchen'}
      </div>
      <Box b={{right: 60, bottom: 70, width: 380, height: 440, transform: 'rotate(-4deg)', border: `14px solid ${I}`, boxShadow: '0 10px 24px rgba(0,0,0,0.3)'}} m={p('p0338', {fy: 55})} />
      <div style={{position: 'absolute', left: 120, bottom: 90, ...ital(34, O)}}>{'or just come\nand order it'}</div>
    </div>
  </AbsoluteFill>
);

// 10 · three windows on an orange wall
const Windows: React.FC = () => (
  <AbsoluteFill style={{background: O}}>
    <div style={{...center, top: 270, ...mono(22, G)}}>tre finestre su brera</div>
    {[v('nm0672', 0.3), v('2698', 4.1), v('nm0741', 1.2)].map((m, i) => (
      <div key={i} style={{position: 'absolute', left: 80 + i * 320, top: 400, width: 280, height: 900, overflow: 'hidden', borderRadius: '140px 140px 0 0',
        outline: `3px solid ${G}`, outlineOffset: 10}}><Media m={m} /></div>
    ))}
    {['la cucina', 'la sala', 'la tavola'].map((t, i) => <div key={i} style={{position: 'absolute', left: 80 + i * 320, width: 280, top: 1340, textAlign: 'center', ...mono(20, G)}}>{t}</div>)}
    <div style={{...center, top: 1420, ...disp(84, G)}}>Every window, a story</div>
  </AbsoluteFill>
);

// 11 · film strip
const Film: React.FC = () => {
  const holes = (x: number) => Array.from({length: 22}, (_, i) => <div key={i} style={{position: 'absolute', left: x, top: 250 + i * 66, width: 34, height: 40, borderRadius: 6, background: SA}} />);
  const clips = [v('nm0676', 8.5), v('2626', 3.4), v('nm0744', 22)];
  return (
    <AbsoluteFill style={{background: SA}}>
      <div style={{position: 'absolute', left: 190, width: 700, top: 220, bottom: 220, background: N}} />
      {holes(212)}{holes(834)}
      {clips.map((m, i) => <Box key={i} b={{left: 270, width: 540, top: 290 + i * 470, height: 430}} m={m} />)}
      <div style={{position: 'absolute', left: 40, top: 900, transform: 'rotate(-90deg)', transformOrigin: 'left top', ...mono(22, G)}}>una sera · in tre scene</div>
      <div style={{position: 'absolute', right: 40, top: 1100, transform: 'rotate(90deg)', transformOrigin: 'right top', ...mono(22, G)}}>sea, signora · milano</div>
    </AbsoluteFill>
  );
};

// 12 · tear-off calendar
const Calendar: React.FC = () => (
  <AbsoluteFill style={{background: G}}>
    <div style={{position: 'absolute', left: 170, right: 170, top: 330, height: 1180, background: I, boxShadow: '0 24px 50px rgba(0,0,0,0.35)'}}>
      <div style={{height: 120, background: O, display: 'flex', alignItems: 'center', justifyContent: 'center', ...disp(56, G)}}>Novembre</div>
      <div style={{...center, top: 150, ...disp(400, G)}}>20</div>
      <div style={{...center, top: 560, ...mono(30, G)}}>venerdì</div>
      <Box b={{left: 70, right: 70, top: 640, height: 400}} m={v('2690', 8.9)} />
      <div style={{...center, top: 1075, ...ital(36, G)}}>da fare: prenotare un tavolo</div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: -14, height: 28, background: `radial-gradient(circle at 14px 0, ${G} 13px, transparent 14px)`, backgroundSize: '28px 28px'}} />
    </div>
  </AbsoluteFill>
);

// 13 · map card
const MapCard: React.FC = () => (
  <AbsoluteFill style={{background: SA}}>
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      <g stroke={G} strokeOpacity={0.35} strokeWidth={22} fill="none" strokeLinecap="round">
        <path d="M -40 760 L 1120 640" /><path d="M 260 200 L 420 1700" /><path d="M 760 260 L 640 1720" /><path d="M -40 1260 L 1120 1180" />
      </g>
      <g stroke={G} strokeWidth={34} fill="none" strokeLinecap="round"><path d="M 140 1010 L 960 920" /></g>
    </svg>
    <div style={{position: 'absolute', left: 260, top: 1000, transform: 'rotate(-6.3deg)', ...mono(24, I)}}>via fiori chiari</div>
    <div style={{position: 'absolute', left: 560, top: 700, width: 70, height: 70, borderRadius: '50% 50% 50% 0', background: O, transform: 'rotate(-45deg)'}} />
    <Box b={{left: 470, top: 420, width: 250, height: 250, borderRadius: '50%', border: `8px solid ${I}`}} m={p('p0195', {fy: 45})} />
    <div style={{...center, top: 280, ...disp(110, G)}}>Brera</div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 1380, textAlign: 'center'}}>
      <div style={{fontFamily: fonts.display, fontSize: 72, color: G}}>Sea, Signora</div>
      <div style={{...mono(24, G), marginTop: 14}}>via fiori chiari, 32 · milano</div>
      <div style={{...ital(36, G), marginTop: 18}}>you are here. or should be.</div>
    </div>
  </AbsoluteFill>
);

// 14 · phone notification over the room
const Notify: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={v('kf0136', 4.1)} style={{filter: 'blur(14px) brightness(0.75)', transform: 'scale(1.08)'}} />
    <div style={{...center, top: 300, fontFamily: fonts.display, fontSize: 210, color: I, letterSpacing: 2}}>19:00</div>
    <div style={{...center, top: 530, ...mono(26, I)}}>venerdì 20 novembre</div>
    {[['Sea, Signora', 'your table is ready. the polpo too.'], ['Sea, Signora', 'reminder: dessert is not optional.']].map(([a, b], i) => (
      <Sequence key={i} from={20 + i * 45} layout="none">
        <div style={{position: 'absolute', left: 70, right: 70, top: 1000 + i * 210, padding: '30px 34px', borderRadius: 40, background: 'rgba(248,246,245,0.82)',
          display: 'flex', gap: 26, alignItems: 'center'}}>
          <div style={{width: 96, height: 96, borderRadius: 22, background: G, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fonts.display, fontSize: 40, color: I}}>S</div>
          <div><div style={{...mono(22, G), letterSpacing: 1}}>{a}</div><div style={{fontFamily: fonts.mono, fontSize: 26, color: N, marginTop: 8}}>{b}</div></div>
        </div>
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const DESIGNS: D[] = [
  {id: 'DZ-01v-cover', sec: 9, view: Cover, caption: 'Signora, the Brera issue: polpo, the open kitchen, and Brera after dark.', hashtags: tags('#brera', '#milano', '#cover')},
  {id: 'DZ-02p-corriere', sec: 7, view: Paper, caption: 'Breaking news from Brera: full house again, and the polpo is to blame.', hashtags: tags('#polpo', '#brera', '#news')},
  {id: 'DZ-03v-boarding', sec: 9, view: Pass, caption: 'Boarding pass: from your day to Sea, Signora. Gate Via Fiori Chiari 32, boarding 19:00.', hashtags: tags('#brera', '#milano', '#dinner')},
  {id: 'DZ-04p-francobollo', sec: 7, view: Stamp, caption: 'Wish you were here. You could be, tonight.', hashtags: tags('#aquarium', '#brera', '#milano')},
  {id: 'DZ-05v-etichetta', sec: 9, view: Label, caption: 'Riserva della cucina: polpo, zucca, nocciole e scorzanera.', hashtags: tags('#polpo', '#octopus', '#brera')},
  {id: 'DZ-06p-riservato', sec: 7, view: Riservato, caption: 'Riservato, per te. Tonight from 19:00.', hashtags: tags('#reserved', '#brera', '#dinner')},
  {id: 'DZ-07v-tarocchi', sec: 9, view: Tarot, caption: "Tonight's card: l'Autunno. Long dinners and warm light ahead.", hashtags: tags('#autumn', '#brera', '#milano')},
  {id: 'DZ-08v-cinema', sec: 9, view: Marquee, caption: 'Now showing: Polpo. Starring zucca, nocciole and scorzanera, directed by our kitchen.', hashtags: tags('#polpo', '#brera', '#nowshowing')},
  {id: 'DZ-09p-ricetta', sec: 7, view: Recipe, caption: 'Spaghetti al tonno: spaghetti, red tuna, good oil, and a secret we keep in the kitchen. Or just come and order it.', hashtags: tags('#spaghetti', '#tuna', '#brera')},
  {id: 'DZ-10v-finestre', sec: 9, view: Windows, caption: 'Three windows on Brera: the kitchen, the room, the table.', hashtags: tags('#brera', '#openkitchen', '#milano')},
  {id: 'DZ-11v-pellicola', sec: 9, view: Film, caption: 'One night in three scenes.', hashtags: tags('#brera', '#dinner', '#milano')},
  {id: 'DZ-12v-calendario', sec: 9, view: Calendar, caption: 'To do on Friday 20 November: book a table.', hashtags: tags('#friday', '#brera', '#milano')},
  {id: 'DZ-13p-mappa', sec: 7, view: MapCard, caption: 'Sea, Signora, Via Fiori Chiari 32, Brera. You are here. Or should be.', hashtags: tags('#brera', '#viafiorichiari', '#milano')},
  {id: 'DZ-14v-notifica', sec: 9, view: Notify, caption: 'Your table is ready. The polpo too.', hashtags: tags('#brera', '#dinner', '#milano')},
];
