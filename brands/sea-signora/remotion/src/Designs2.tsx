import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Everyday-object designs, round 2 (client 16.11, on the boarding pass / riservato / notification she liked): new ideas
// in the same spirit; everything straight, aligned and never overlapping (each element has its own band of the
// frame, inside the 250 / 340 px safe zones); no dish repeated across the set, no weekdays, and the words are about
// the menu and an invitation to come, not only the time.
// Fixes asked for: boarding pass → to Sea, Signora (no «from»), class First; riservato on a new photo; notifications
// with new lines and no polpo.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory, N = '#0B0B0B';
type M = {src: string; at?: number; fx?: number; fy?: number};
const Media: React.FC<{m: M; style?: React.CSSProperties}> = ({m, style}) => {
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${m.fx ?? 50}% ${m.fy ?? 50}%`, ...style};
  return m.src.endsWith('.mp4') ? <OffthreadVideo src={staticFile(`videos/${m.src}`)} startFrom={Math.round((m.at ?? 0) * FPS)} muted style={st} />
    : <Img src={staticFile(`photos/${m.src}`)} style={st} />;
};
const Box: React.FC<{b: React.CSSProperties; m: M}> = ({b, m}) => <div style={{position: 'absolute', overflow: 'hidden', ...b}}><Media m={m} /></div>;
const mono = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: size,
  letterSpacing: size >= 28 ? 3 : 5, textTransform: 'uppercase', color, ...x});
const disp = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: size,
  textTransform: 'uppercase', lineHeight: 1, letterSpacing: 1, color, whiteSpace: 'pre-line', ...x});
const mark = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: size, color, lineHeight: 1, ...x});
const ital = (size: number, color: string, x: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.serif, fontStyle: 'italic',
  fontSize: size, lineHeight: 1.3, color, whiteSpace: 'pre-line', ...x});
const center: React.CSSProperties = {position: 'absolute', left: 0, right: 0, textAlign: 'center'};
const v = (n: string, at: number, o: Partial<M> = {}): M => ({src: `${n}.mp4`, at, ...o});
const p = (n: string, o: Partial<M> = {}): M => ({src: `${n}.jpg`, ...o});

// 1 · boarding pass, to Sea, Signora
const Pass: React.FC = () => {
  const cell = (a: string, b: string) => (<div><div style={mono(16, G)}>{a}</div><div style={{...disp(44, G), marginTop: 8}}>{b}</div></div>);
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{...center, top: 280, ...mono(22, I)}}>boarding pass</div>
      <div style={{position: 'absolute', left: 110, width: 860, top: 340, height: 1180, background: I, borderRadius: 34, overflow: 'hidden'}}>
        <Box b={{left: 0, top: 0, width: 860, height: 440}} m={v('w10/kf0103', 8.9)} />
        <div style={{position: 'absolute', left: 60, right: 60, top: 490}}>
          <div style={mono(16, G)}>destination</div>
          <div style={{...mark(104, G), marginTop: 12}}>Sea, Signora</div>
          <div style={{...mono(18, O), marginTop: 14}}>milano · brera</div>
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 740, display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 44, columnGap: 40}}>
          {cell('gate', 'Fiori Chiari 32')}{cell('boarding', 'From 19:00')}{cell('seat', 'Table for two')}{cell('class', 'First')}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 990, borderTop: `4px dashed ${G}`}} />
        <div style={{position: 'absolute', left: 60, right: 60, top: 1030, height: 110, display: 'flex', gap: 5}}>
          {Array.from({length: 62}, (_, i) => <div key={i} style={{width: [3, 7, 2, 5][i % 4], background: G}} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2 · riservato, on the candlelit glasses
const Riservato: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={p('w10/bo57', {fx: 45})} />
    <AbsoluteFill style={{background: 'rgba(11,11,11,0.2)'}} />
    <div style={{position: 'absolute', left: 240, width: 600, top: 980, height: 480, background: I, boxShadow: '0 30px 60px rgba(0,0,0,0.45)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={mark(38, G)}>Sea, Signora</div>
      <div style={{...disp(92, G), marginTop: 34}}>Riservato</div>
      <div style={{...ital(44, O), marginTop: 18}}>per te</div>
      <div style={{width: 120, height: 2, background: G, marginTop: 30}} />
      <div style={{...mono(18, G), marginTop: 22}}>a table is waiting</div>
    </div>
  </AbsoluteFill>
);

// 3 · notifications, new lines
const Notify: React.FC = () => (
  <AbsoluteFill style={{background: N}}>
    <Media m={v('w10/kf0136', 4.1)} style={{filter: 'blur(16px) brightness(0.7)', transform: 'scale(1.1)'}} />
    <div style={{...center, top: 300, ...mark(200, I)}}>20:30</div>
    <div style={{...center, top: 530, ...mono(24, I)}}>brera · milano</div>
    {[['your table is set. bring someone hungry.'], ['new on the menu: akami, capesante, tagliolini.'], ['reminder: dessert is not optional.']].map(([b], i) => (
      <Sequence key={i} from={15 + i * 40} layout="none">
        <div style={{position: 'absolute', left: 70, width: 940, top: 900 + i * 190, height: 160, padding: '0 34px', borderRadius: 40, background: 'rgba(248,246,245,0.86)',
          display: 'flex', gap: 26, alignItems: 'center', boxSizing: 'border-box'}}>
          <div style={{width: 92, height: 92, flex: 'none', borderRadius: 22, background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mark(40, I)}}>S</div>
          <div><div style={{...mono(20, G), letterSpacing: 1, textTransform: 'none'}}>Sea, Signora</div><div style={{fontFamily: fonts.mono, fontSize: 25, color: N, marginTop: 8}}>{b}</div></div>
        </div>
      </Sequence>
    ))}
  </AbsoluteFill>
);

// 4 · formal invitation
const Invito: React.FC = () => (
  <AbsoluteFill style={{background: SA}}>
    <div style={{position: 'absolute', left: 130, width: 820, top: 330, height: 1020, background: I, boxShadow: '0 24px 50px rgba(0,0,0,0.18)'}}>
      <div style={{position: 'absolute', inset: 28, border: `2px solid ${G}`}} />
      <div style={{position: 'absolute', inset: 40, border: `1px solid ${G}`}} />
      <div style={{...center, top: 130, ...mark(64, G)}}>Sea, Signora</div>
      <div style={{...center, top: 230, ...ital(40, G)}}>{'ha il piacere\ndi invitarvi a cena'}</div>
      <Box b={{left: 230, top: 380, width: 360, height: 360, borderRadius: '50%'}} m={p('w11/f62', {fx: 50})} />
      <div style={{...center, top: 790, ...disp(46, G)}}>Crudo, vino & compagnia</div>
      <div style={{...center, top: 860, ...mono(20, G)}}>via fiori chiari, 32 · brera</div>
      <div style={{...center, top: 910, ...ital(32, O)}}>abito: come preferite</div>
    </div>
    <Chip cta={{label: 'rsvp', color: 'orange'}} />
  </AbsoluteFill>
);

// 5 · a chat between friends
const Chat: React.FC = () => {
  const msgs: [boolean, string][] = [[false, 'dinner tonight?'], [true, 'somewhere with a vibe'], [false, 'sea, signora. brera.'], [true, 'oysters'],
    [false, 'and wine. and dessert.'], [true, 'say less']];
  return (
    <AbsoluteFill style={{background: G}}>
      <div style={{...center, top: 280, ...mono(22, I)}}>the group chat</div>
      {msgs.map(([me, t], i) => (
        <Sequence key={i} from={i * 18} layout="none">
          <div style={{position: 'absolute', top: 360 + i * 130, ...(me ? {right: 90} : {left: 90}), maxWidth: 700, padding: '24px 34px', borderRadius: 40,
            background: me ? O : I, color: me ? I : G, fontFamily: fonts.mono, fontSize: 30}}>{t}</div>
        </Sequence>
      ))}
      <Sequence from={msgs.length * 18} layout="none">
        <Box b={{right: 90, top: 1160, width: 360, height: 300, borderRadius: 34}} m={p('w11/f28', {fy: 50})} />
      </Sequence>
    </AbsoluteFill>
  );
};

// 6 · tonight's playlist
const Playlist: React.FC = () => {
  const tracks = ['Aperitivo al bancone', 'Ostriche, una alla volta', 'Crudo', 'La pasta del giorno', 'Il dolce', 'Ancora un bicchiere'];
  return (
    <AbsoluteFill style={{background: G}}>
      <Box b={{left: 190, top: 300, width: 700, height: 700}} m={p('w11/f7', {fy: 45})} />
      <div style={{position: 'absolute', left: 190, width: 700, top: 1030}}>
        <div style={mono(18, O)}>playlist della sera</div>
        <div style={{...mark(64, I), marginTop: 10}}>Dinner at Sea, Signora</div>
        <div style={{position: 'relative', height: 6, background: 'rgba(248,246,245,0.3)', borderRadius: 3, marginTop: 26}}>
          <div style={{width: '38%', height: 6, background: I, borderRadius: 3}} />
        </div>
        <div style={{marginTop: 24}}>
          {tracks.map((t, i) => (
            <div key={i} style={{display: 'flex', gap: 22, alignItems: 'baseline', marginBottom: 12, ...mono(22, i === 2 ? O : I), letterSpacing: 2}}>
              <span style={{width: 34}}>{String(i + 1).padStart(2, '0')}</span><span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 7 · sticky note under a photo
const Note: React.FC = () => (
  <AbsoluteFill style={{background: G}}>
    <Box b={{left: 110, top: 300, width: 860, height: 700}} m={p('w11/f50', {fy: 50})} />
    <div style={{position: 'absolute', left: 200, width: 680, top: 1060, height: 420, background: SA, boxShadow: '0 16px 34px rgba(0,0,0,0.3)', padding: '44px 56px',
      boxSizing: 'border-box'}}>
      <div style={mono(18, G)}>promemoria</div>
      <div style={{...ital(40, G), marginTop: 18, lineHeight: 1.45}}>{'— prenotare da Sea, Signora\n— ordinare per tutto il tavolo\n— lasciare spazio per il dolce'}</div>
    </div>
  </AbsoluteFill>
);

// 8 · search bar and the result
const Search: React.FC = () => (
  <AbsoluteFill style={{background: I}}>
    <div style={{position: 'absolute', left: 90, width: 900, top: 320, height: 110, borderRadius: 55, border: `3px solid ${G}`, display: 'flex', alignItems: 'center',
      padding: '0 44px', boxSizing: 'border-box', gap: 24}}>
      <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth={2.4}><circle cx="10" cy="10" r="7" /><path d="M15.5 15.5 L22 22" /></svg>
      <span style={{fontFamily: fonts.mono, fontSize: 30, color: G}}>where to eat fish in brera</span>
    </div>
    <div style={{position: 'absolute', left: 90, width: 900, top: 490}}>
      <div style={mono(18, O)}>best result</div>
      <Box b={{position: 'relative', width: 900, height: 600, marginTop: 20, borderRadius: 30}} m={p('w10/bo228')} />
      <div style={{...mark(72, G), marginTop: 30}}>Sea, Signora</div>
      <div style={{...mono(20, G), marginTop: 14}}>ristorante di pesce · via fiori chiari, 32</div>
      <div style={{...ital(34, G), marginTop: 14}}>raw bar, open kitchen, a room that stays late</div>
    </div>
  </AbsoluteFill>
);

// 9 · theatre ticket: the open kitchen as the show
const Ticket: React.FC = () => (
  <AbsoluteFill style={{background: SA}}>
    <div style={{position: 'absolute', left: 140, width: 800, top: 330, height: 1120, background: O, borderRadius: 26}}>
      <Box b={{left: 50, top: 50, width: 700, height: 560, borderRadius: 14}} m={v('w10/nm0672', 0.3)} />
      <div style={{...center, top: 650, ...mono(20, G)}}>biglietto · ingresso</div>
      <div style={{...center, top: 700, ...disp(84, G)}}>La cucina a vista</div>
      <div style={{position: 'absolute', left: 50, right: 50, top: 830, display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 26, columnGap: 30}}>
        {[['ammessi', 'Tu e chi vuoi'], ['posto', 'In prima fila'], ['spettacolo', 'Ogni sera'], ['dove', 'Fiori Chiari 32']].map(([a, b]) => (
          <div key={a}><div style={mono(15, G)}>{a}</div><div style={{...disp(34, G), marginTop: 6}}>{b}</div></div>
        ))}
      </div>
      <div style={{position: 'absolute', left: -22, top: 610, width: 44, height: 44, borderRadius: '50%', background: SA}} />
      <div style={{position: 'absolute', right: -22, top: 610, width: 44, height: 44, borderRadius: '50%', background: SA}} />
    </div>
  </AbsoluteFill>
);

// 10 · calendar invite on the phone
const Calendar: React.FC = () => (
  <AbsoluteFill style={{background: SA}}>
    <div style={{position: 'absolute', left: 120, width: 840, top: 330, height: 1080, background: I, borderRadius: 44, boxShadow: '0 24px 50px rgba(0,0,0,0.18)', overflow: 'hidden'}}>
      <div style={{height: 120, background: G, display: 'flex', alignItems: 'center', padding: '0 50px', ...mono(22, I)}}>nuovo invito</div>
      <div style={{position: 'absolute', left: 50, right: 50, top: 170}}>
        <div style={mark(76, G)}>Cena da Sea, Signora</div>
        {[['quando', 'stasera, da quando vuoi'], ['dove', 'via fiori chiari, 32 · brera'], ['invitati', 'tu + le persone giuste'], ['note', 'arrivare con appetito']].map(([a, b], i) => (
          <div key={a} style={{display: 'flex', gap: 30, marginTop: i ? 26 : 50, alignItems: 'baseline'}}>
            <span style={{width: 170, ...mono(18, O)}}>{a}</span><span style={{fontFamily: fonts.mono, fontSize: 28, color: G}}>{b}</span>
          </div>
        ))}
      </div>
      <Box b={{left: 50, right: 50, top: 640, height: 300, borderRadius: 24}} m={p('w11/f73', {fx: 45})} />
      <div style={{position: 'absolute', left: 50, right: 50, top: 970, display: 'flex', gap: 24}}>
        <div style={{flex: 1, height: 70, borderRadius: 35, background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono(22, I)}}>accetta</div>
        <div style={{flex: 1, height: 70, borderRadius: 35, border: `2px solid ${G}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono(22, G)}}>forse</div>
      </div>
    </div>
  </AbsoluteFill>
);

// 11 · a sealed letter
const Lettera: React.FC = () => (
  <AbsoluteFill style={{background: G}}>
    <div style={{position: 'absolute', left: 160, width: 760, top: 330, height: 520, background: I, boxShadow: '0 10px 24px rgba(0,0,0,0.25)', padding: '70px 70px',
      boxSizing: 'border-box'}}>
      <div style={mono(18, O)}>una lettera per te</div>
      <div style={{...ital(46, G), marginTop: 26, lineHeight: 1.35}}>{'Cara ospite, caro ospite,\nil tuo tavolo ti aspetta.\nPorta appetito.'}</div>
      <div style={{...mark(44, G), marginTop: 40}}>Sea, Signora</div>
    </div>
    <div style={{position: 'absolute', left: 110, width: 860, top: 900, height: 560, background: SA}}>
      <svg width={860} height={560} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M0 0 L430 300 L860 0" fill="none" stroke={G} strokeOpacity={0.35} strokeWidth={3} />
      </svg>
      <div style={{position: 'absolute', left: 350, top: 220, width: 160, height: 160, borderRadius: '50%', background: O, display: 'flex', alignItems: 'center',
        justifyContent: 'center', boxShadow: 'inset 0 0 0 10px rgba(0,0,0,0.12)', ...mark(70, I)}}>S</div>
      <div style={{...center, top: 440, ...mono(18, G)}}>via fiori chiari, 32 · milano</div>
    </div>
  </AbsoluteFill>
);

const tags = (...t: string[]) => ['#seasignora', ...t];
export const DESIGNS2 = [
  {id: 'DY-01v-boarding', sec: 9, view: Pass, caption: 'Boarding pass to Sea, Signora. Gate Via Fiori Chiari 32, class: first.', hashtags: tags('#brera', '#milano', '#dinner')},
  {id: 'DY-02p-riservato', sec: 7, view: Riservato, caption: 'Riservato, per te. A table is waiting.', hashtags: tags('#reserved', '#brera', '#dinner')},
  {id: 'DY-03v-notifiche', sec: 9, view: Notify, caption: 'Your table is set. Bring someone hungry.', hashtags: tags('#newmenu', '#brera', '#milano')},
  {id: 'DY-04p-invito', sec: 7, view: Invito, caption: 'Sea, Signora ha il piacere di invitarvi a cena: crudo, vino e compagnia. Dress code: as you like.', hashtags: tags('#invitation', '#brera', '#milano')},
  {id: 'DY-05v-chat', sec: 8, view: Chat, caption: '"Dinner tonight?" "Sea, Signora." "Say less."', hashtags: tags('#friends', '#brera', '#oysters')},
  {id: 'DY-06p-playlist', sec: 7, view: Playlist, caption: "Tonight's playlist: aperitivo at the bar, oysters, crudo, pasta, dessert, one more glass.", hashtags: tags('#dinner', '#brera', '#milano')},
  {id: 'DY-07p-promemoria', sec: 7, view: Note, caption: 'Note to self: book Sea, Signora, order for the whole table, leave room for dessert.', hashtags: tags('#sharing', '#brera', '#milano')},
  {id: 'DY-08p-search', sec: 7, view: Search, caption: 'Where to eat fish in Brera: Sea, Signora. Raw bar, open kitchen, a room that stays late.', hashtags: tags('#brera', '#seafood', '#milano')},
  {id: 'DY-09v-biglietto', sec: 9, view: Ticket, caption: 'Tonight\'s show: la cucina a vista. Admits you and whoever you like, front row.', hashtags: tags('#openkitchen', '#brera', '#milano')},
  {id: 'DY-10p-invito-cal', sec: 7, view: Calendar, caption: 'New invite: dinner at Sea, Signora. Guests: you and the right people. Notes: arrive hungry.', hashtags: tags('#dinner', '#brera', '#milano')},
  {id: 'DY-11p-lettera', sec: 7, view: Lettera, caption: 'A letter for you: your table is waiting. Bring an appetite.', hashtags: tags('#invitation', '#brera', '#milano')},
];
