import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Week 02–08.11 «Opere da mangiare» — the week as an exhibition in seven rooms. Sea, Signora sits in Brera,
// the quarter of the Accademia and the Pinacoteca, so every day is a «sala»: dishes from the photographer's
// shootings (7, 8) hang as works with wall labels, the videos are an audio guide, a performance, an
// installation, a vernissage. Every video text describes what is actually happening in that shot.
// 2 a day (video + still), link chips on Wed, Fri, Sat only; videos are silent (music is added in Instagram).

const FPS = 30;
const ph = (n: string) => staticFile(`photos/w5/${n}.jpg`);
const vid = (n: string) => staticFile(`videos/w5/${n}.mp4`);

const mono = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: fonts.mono, fontWeight: 500, fontSize: size, letterSpacing: 4, textTransform: 'uppercase', color: colors.ivory, ...extra,
});
const display = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: fonts.display, fontSize: size, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.05, color: colors.ivory, ...extra,
});
const serif = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: fonts.serif, fontStyle: 'italic', fontSize: size, color: colors.ivory, lineHeight: 1.25, ...extra,
});
const fade = (f: number, at: number, len = 10) => interpolate(f, [at, at + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const Cover: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) => (
  <Img src={src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style}} />
);
const Shade: React.FC<{from: 'top' | 'bottom'; h: number; o: number}> = ({from, h, o}) => (
  <div style={{position: 'absolute', left: 0, right: 0, [from]: 0, height: h,
    background: `linear-gradient(to ${from === 'top' ? 'bottom' : 'top'}, rgba(11,11,11,${o}) 0%, rgba(11,11,11,${o * 0.6}) 50%, rgba(11,11,11,0) 100%)`}} />
);

// the running thread of the week: «opere da mangiare · sala III · piatto»
const Sala: React.FC<{n: string; name: string; top?: number}> = ({n, name, top = 266}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center', ...mono(19, {letterSpacing: 5})}}>
    opere da mangiare <span style={{color: colors.orange}}>· sala {n} ·</span> {name}
  </div>
);

// museum wall label: title, medium in italics, small catalogue line
const Label: React.FC<{title: string; medium?: string; meta?: string; x?: number; y: number; w?: number; o?: number}> = ({title, medium, meta, x = 80, y, w = 920, o = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, opacity: o, padding: '26px 30px 24px', boxSizing: 'border-box',
    background: 'rgba(11,11,11,0.78)', borderLeft: `3px solid ${colors.orange}`}}>
    <div style={display(40)}>{title}</div>
    {medium ? <div style={serif(30, {marginTop: 10})}>{medium}</div> : null}
    {meta ? <div style={mono(17, {marginTop: 14, opacity: 0.8})}>{meta}</div> : null}
  </div>
);

// a framed work on the gallery wall
const Framed: React.FC<{src: string; x: number; y: number; w: number; h: number; pos?: string; mat?: number}> = ({src, x, y, w, h, pos = '50% 50%', mat = 14}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, padding: mat, boxSizing: 'border-box',
    border: '1.5px solid rgba(248,246,245,0.55)', boxShadow: '0 24px 50px rgba(0,0,0,0.55)'}}>
    <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>
      <Img src={src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} />
    </div>
  </div>
);
const Wall: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 42%, #22201f 0%, ${colors.night} 70%)`}}>{children}</AbsoluteFill>
);

// ───────────────────────── Sala I · mare (Mon 02.11)
// IMG_0079: the round painting of the signora with an octopus, lit in a dark corner of the room
export const Muse: React.FC = () => {
  const f = useCurrentFrame();
  const total = 189;
  return (
    <AbsoluteFill style={{background: colors.night}}>
      {/* the painting brought to the middle of the frame (also crops the restroom sign out) */}
      <AbsoluteFill style={{transform: 'translate(-224px, 172px) scale(2.1)', transformOrigin: '764px 728px'}}>
        <OffthreadVideo src={vid('muse')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 540px 900px, rgba(11,11,11,0) 0px, rgba(11,11,11,0) 300px, rgba(11,11,11,0.82) 330px)'}} />
      <div style={{position: 'absolute', left: 540 - 318, top: 900 - 318, width: 636, height: 636, borderRadius: '50%', border: '1.5px solid rgba(248,246,245,0.6)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center'}}>
        <div style={mono(20, {color: colors.orange, letterSpacing: 5})}>brera · 02—08.11</div>
        <div style={display(66, {marginTop: 18})}>Opere da mangiare</div>
        <div style={serif(32, {marginTop: 12})}>an exhibition in seven rooms</div>
      </div>
      {/* audio guide */}
      <div style={{position: 'absolute', left: 80, right: 80, top: 1300, opacity: fade(f, 12)}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 22}}>
          <span style={mono(40, {color: colors.orange, letterSpacing: 0})}>01</span>
          <span style={display(40)}>The muse</span>
          <span style={{flex: 1}} />
          <span style={mono(17, {opacity: 0.7})}>audio guide · sala I</span>
        </div>
        <div style={{height: 2, background: 'rgba(248,246,245,0.25)', marginTop: 18}}>
          <div style={{height: 2, width: `${(f / total) * 100}%`, background: colors.ivory}} />
        </div>
        <div style={serif(32, {marginTop: 22})}>she watches every table in the room</div>
      </div>
    </AbsoluteFill>
  );
};

export const StudiesOfTheSea: React.FC = () => {
  const w = 440, h = 560, gx = 40, x0 = (1080 - 2 * w - gx) / 2, y0 = 470, gy = 120;
  const works = [
    {src: ph('s8_037'), t: 'study i · sea bass', pos: '50% 60%'},
    {src: ph('s8_048'), t: 'study ii · scallops', pos: '50% 50%'},
    {src: ph('s8_043'), t: 'study iii · red prawns', pos: '50% 45%'},
    {src: ph('s7_001'), t: 'study iv · tuna', pos: '50% 50%'},
  ];
  return (
    <Wall>
      <Sala n="I" name="mare" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 322, textAlign: 'center'}}>
        <div style={display(60)}>Studies of the sea</div>
      </div>
      {works.map((wk, i) => {
        const x = x0 + (i % 2) * (w + gx), y = y0 + Math.floor(i / 2) * (h + gy);
        return (
          <React.Fragment key={wk.t}>
            <Framed src={wk.src} x={x} y={y} w={w} h={h} pos={wk.pos} />
            <div style={{position: 'absolute', left: x, top: y + h + 18, width: w, ...mono(17, {letterSpacing: 3, opacity: 0.85})}}>{wk.t}</div>
          </React.Fragment>
        );
      })}
    </Wall>
  );
};

// ───────────────────────── Sala II · mani (Tue 03.11)
// IMG_9232: the chef in a cap at the open-kitchen range, pans on the fire
export const Performance: React.FC = () => {
  const f = useCurrentFrame();
  const top = 560, bandH = 900;
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <div style={{position: 'absolute', left: 0, right: 0, top, height: bandH, overflow: 'hidden'}}>
        <OffthreadVideo src={vid('kitchen-performance')} muted
          style={{position: 'absolute', left: 0, width: 1080, height: 1920, top: -880}} />
      </div>
      <Sala n="II" name="mani" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center'}}>
        <div style={mono(22, {color: colors.orange, letterSpacing: 6})}>● live</div>
        <div style={display(64, {marginTop: 16})}>Performance</div>
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: top + bandH + 40, opacity: fade(f, 15)}}>
        <div style={serif(34)}>fire, copper and two hands</div>
        <div style={mono(18, {marginTop: 16, opacity: 0.85})}>open kitchen · nightly 19:00—00:00</div>
      </div>
    </AbsoluteFill>
  );
};

export const Restoration: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 958, overflow: 'hidden'}}>
      <Cover src={ph('s7_001')} style={{objectPosition: '50% 40%'}} />
      <Shade from="top" h={520} o={0.75} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 962, height: 958, overflow: 'hidden'}}>
      <Cover src={ph('s7_045')} style={{objectPosition: '50% 45%'}} />
      <Shade from="bottom" h={560} o={0.85} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 958, height: 4, background: colors.ivory, opacity: 0.85}} />
    <Sala n="II" name="mani" />
    <div style={{position: 'absolute', left: 80, top: 340}}>
      <div style={mono(20, {color: colors.orange})}>before</div>
      <div style={display(56, {marginTop: 10})}>Restoration</div>
    </div>
    <div style={{position: 'absolute', left: 80, top: 1010}}>
      <div style={mono(20, {color: colors.orange})}>after</div>
    </div>
    <div style={{position: 'absolute', left: 80, top: 1490}}>
      <div style={serif(32, {background: 'rgba(11,11,11,0.72)', padding: '12px 22px', display: 'inline-block'})}>the kitchen restores the sea every night</div>
    </div>
  </AbsoluteFill>
);

// ───────────────────────── Sala III · piatto (Wed 04.11)
export const CuratorsDilemma: React.FC = () => {
  const w = 440, h = 620, y = 480;
  return (
    <Wall>
      <Sala n="III" name="piatto" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 322, textAlign: 'center'}}>
        <div style={display(58)}>The curator's dilemma</div>
      </div>
      <Framed src={ph('s8_120')} x={80} y={y} w={w} h={h} />
      <Framed src={ph('s7_004')} x={560} y={y} w={w} h={h} />
      <div style={{position: 'absolute', left: 80, top: y + h + 20, width: w}}>
        <div style={mono(17, {color: colors.orange})}>no. 1</div>
        <div style={serif(28, {marginTop: 6})}>nocturne in caviar</div>
      </div>
      <div style={{position: 'absolute', left: 560, top: y + h + 20, width: w}}>
        <div style={mono(17, {color: colors.orange})}>no. 2</div>
        <div style={serif(28, {marginTop: 6})}>study in lobster orange</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center'}}>
        <div style={mono(20, {letterSpacing: 4, opacity: 0.9})}>which one goes home with you</div>
      </div>
      {/* room left for the Instagram poll sticker: 1360–1560 */}
    </Wall>
  );
};

// IMG_9221: a waiter sets plates down for a guest at a table by the aquarium
export const Installation: React.FC = () => {
  const f = useCurrentFrame();
  const line = 'complete only when served';
  const typed = line.slice(0, Math.max(0, Math.floor((f - 30) / 2.4)));
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <OffthreadVideo src={vid('served')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <Shade from="top" h={760} o={0.85} />
      <Sala n="III" name="piatto" />
      <div style={{position: 'absolute', left: 80, right: 80, top: 330}}>
        <div style={display(62)}>Installation</div>
        <div style={mono(24, {marginTop: 20, letterSpacing: 3, minHeight: 30})}>
          {typed}<span style={{opacity: f % 20 < 10 ? 1 : 0, color: colors.orange}}>▍</span>
        </div>
      </div>
      <Chip cta={{label: 'book a table', color: 'orange'}} />
    </AbsoluteFill>
  );
};

// ───────────────────────── Sala IV · movimento (Thu 05.11)
export const MotionStudy: React.FC = () => {
  const w = 300, gap = 20, x0 = (1080 - 3 * w - 2 * gap) / 2, y = 480, h = 860;
  const frames = [
    {src: ph('s7_091'), pos: '62% 30%'},
    {src: ph('s7_093'), pos: '50% 40%'},
    {src: ph('s7_094'), pos: '55% 35%'},
  ];
  return (
    <Wall>
      <Sala n="IV" name="movimento" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 322, textAlign: 'center'}}>
        <div style={display(60)}>Motion study</div>
      </div>
      {frames.map((fr, i) => (
        <React.Fragment key={i}>
          <div style={{position: 'absolute', left: x0 + i * (w + gap), top: y, width: w, height: h, overflow: 'hidden'}}>
            <Img src={fr.src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: fr.pos}} />
          </div>
          <div style={{position: 'absolute', left: x0 + i * (w + gap), top: y + h + 16, width: w, ...mono(18, {color: colors.orange, letterSpacing: 2})}}>{`0${i + 1}`}</div>
        </React.Fragment>
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: y + h + 80, textAlign: 'center'}}>
        <div style={serif(32)}>a pour in three frames · after muybridge</div>
      </div>
    </Wall>
  );
};

// IMG_9226: a waiter in a white shirt with a red lobster printed on it, carrying plates past the aquarium
export const WearableArt: React.FC = () => {
  const f = useCurrentFrame();
  const play = 96; // 3.2 s of motion, then the frame holds
  const z = interpolate(f, [play, play + 24], [1, 1.12], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '42% 52%'}}>
        <Sequence durationInFrames={play}>
          <OffthreadVideo src={vid('lobster-shirt')} startFrom={Math.round(3.8 * FPS)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </Sequence>
        <Sequence from={play}>
          <OffthreadVideo src={vid('lobster-shirt')} startFrom={Math.round(7.0 * FPS)} playbackRate={0.01} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </Sequence>
      </AbsoluteFill>
      {/* freeze: the flash of a gallery camera, then the label */}
      <AbsoluteFill style={{background: colors.ivory, opacity: interpolate(f, [play, play + 2, play + 8], [0, 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Shade from="top" h={620} o={0.75} />
      <Sala n="IV" name="movimento" />
      <Label y={1440} title="Wearable art" medium="lobster on cotton · worn nightly by the team" meta="sala IV · on loan from the dining room" o={fade(f, play + 6, 8)} />
    </AbsoluteFill>
  );
};

// ───────────────────────── Sala V · ritratto (Fri 06.11)
// IMG_9227: a framed mirror above the room reflects the tables; below, a guest studies the menu
export const PortraitChoosing: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <OffthreadVideo src={vid('mirror-menu')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <Shade from="top" h={520} o={0.7} />
      <Sala n="V" name="ritratto" />
      <Label y={1250} title="Portrait of a man choosing" medium="oil on evening · menu in hand · mirror above" meta="sala V · friday from 19:00" o={fade(f, 10)} />
    </AbsoluteFill>
  );
};

export const MuseumShop: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #1d2a24 0%, ${colors.night} 75%)`}}>
    <Sala n="V" name="ritratto" />
    <div style={{position: 'absolute', left: 0, right: 0, top: 322, textAlign: 'center'}}>
      <div style={mono(19, {color: colors.orange})}>from the museum shop</div>
      <div style={display(58, {marginTop: 14})}>Wish you were here</div>
    </div>
    {/* the postcard */}
    <div style={{position: 'absolute', left: 140, top: 520, width: 800, height: 920, background: colors.ivory, padding: 26, boxSizing: 'border-box',
      transform: 'rotate(2.5deg)', boxShadow: '0 34px 70px rgba(0,0,0,0.6)'}}>
      <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>
        <Img src={ph('s7_116')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 55%'}} />
        <div style={{position: 'absolute', left: 30, bottom: 30, ...display(34, {textShadow: '0 2px 14px rgba(0,0,0,0.6)'})}}>Greetings from Brera</div>
      </div>
      {/* stamp + postmark */}
      <div style={{position: 'absolute', right: 40, top: 40, width: 150, height: 180, background: colors.orange, outline: `6px dashed ${colors.ivory}`, outlineOffset: -3,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={display(30)}>Sea</div>
        <div style={display(30)}>Signora</div>
        <div style={mono(13, {marginTop: 8, letterSpacing: 2})}>milano</div>
      </div>
      <div style={{position: 'absolute', right: 150, top: 150, width: 170, height: 170, borderRadius: '50%', border: `3px solid ${colors.ivory}`, opacity: 0.85,
        display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-14deg)'}}>
        <div style={{textAlign: 'center', ...mono(15, {letterSpacing: 2})}}>brera<br />06 · 11<br />bar</div>
      </div>
    </div>
    <Chip cta={{label: 'reserve', color: 'orange'}} />
  </AbsoluteFill>
);

// ───────────────────────── Sala VI · vernissage (Sat 07.11)
// IMG_0085: a set table — dried flowers in a painted vase, the big round flower mural behind, glasses waiting
export const Vernissage: React.FC = () => {
  const f = useCurrentFrame();
  const ticker = 'via fiori chiari 32 · brera · saturday 12:30—15:30 & 19:00—00:00 · ';
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <OffthreadVideo src={vid('table-set')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <Shade from="top" h={620} o={0.8} />
      <Shade from="bottom" h={760} o={0.75} />
      <Sala n="VI" name="vernissage" />
      <div style={{position: 'absolute', left: 80, right: 80, top: 330}}>
        <div style={display(62)}>Vernissage tonight</div>
        <div style={serif(32, {marginTop: 12})}>the table is set · the flowers are in place</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1250, height: 64, borderTop: '1px solid rgba(248,246,245,0.45)', borderBottom: '1px solid rgba(248,246,245,0.45)',
        overflow: 'hidden', display: 'flex', alignItems: 'center'}}>
        <div style={{whiteSpace: 'nowrap', transform: `translateX(${-f * 4}px)`, ...mono(22, {letterSpacing: 4})}}>{ticker.repeat(4)}</div>
      </div>
      <Chip cta={{label: 'make a reservation', color: 'olive'}} />
    </AbsoluteFill>
  );
};

export const Poster: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    <Cover src={ph('s8_073')} style={{objectPosition: '50% 55%'}} />
    <Shade from="top" h={900} o={0.55} />
    <Shade from="bottom" h={600} o={0.75} />
    <div style={{position: 'absolute', left: 70, top: 280}}>
      <div style={mono(20, {color: colors.orange})}>exhibition · 02—08.11</div>
      <div style={display(124, {marginTop: 20, lineHeight: 0.92})}>Opere<br />da<br />mangiare</div>
    </div>
    <div style={{position: 'absolute', left: 70, right: 70, top: 1420}}>
      <div style={serif(34)}>works to be eaten · nightly unveiling</div>
      <div style={mono(18, {marginTop: 18, opacity: 0.85})}>sea, signora · via fiori chiari 32 · brera</div>
    </div>
  </AbsoluteFill>
);

// ───────────────────────── Sala VII · natura morta (Sun 08.11)
// IMG_0077: a still life of dried flowers and a seed head on green marble
export const NaturaMorta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <OffthreadVideo src={vid('natura-morta')} playbackRate={0.6} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <Shade from="top" h={600} o={0.7} />
      <Sala n="VII" name="natura morta" />
      <Label y={1240} title="Natura morta" medium="dried flowers and a seed head on green marble" meta="sala VII · sunday 12:30—15:30 & 19:00—00:00" o={fade(f, 10)} />
    </AbsoluteFill>
  );
};

const swatches = [
  {c: '#C3122B', n: 'signora red'},
  {c: '#1E3A2F', n: 'brera green'},
  {c: '#151515', n: 'caviar black'},
  {c: '#7C8FD0', n: 'porcelain blue'},
  {c: '#E2702A', n: 'lobster orange'},
];
export const Palette: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1080, overflow: 'hidden'}}>
      <Cover src={ph('s7_107')} style={{objectPosition: '50% 50%'}} />
      <Shade from="top" h={560} o={0.8} />
    </div>
    <Sala n="VII" name="natura morta" />
    <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
      <div style={display(60)}>The palette of the week</div>
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 1120, display: 'flex', gap: 14}}>
      {swatches.map((s) => (
        <div key={s.n} style={{flex: 1}}>
          <div style={{height: 210, background: s.c, border: '1px solid rgba(248,246,245,0.25)'}} />
          <div style={mono(15, {marginTop: 12, letterSpacing: 2, lineHeight: 1.4})}>{s.n}</div>
        </div>
      ))}
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1460, textAlign: 'center'}}>
      <div style={serif(34)}>fine della mostra</div>
      <div style={mono(18, {marginTop: 14, color: colors.orange})}>the collection changes every night</div>
    </div>
  </AbsoluteFill>
);

const s = (sec: number) => Math.round(sec * FPS);
export const OPERE: {id: string; component: React.FC; frames: number}[] = [
  {id: 'W5-1mon-1v-the-muse', component: Muse, frames: 189},
  {id: 'W5-1mon-2p-studies-of-the-sea', component: StudiesOfTheSea, frames: 1},
  {id: 'W5-2tue-1v-performance', component: Performance, frames: s(7)},
  {id: 'W5-2tue-2p-restoration', component: Restoration, frames: 1},
  {id: 'W5-3wed-1p-curators-dilemma', component: CuratorsDilemma, frames: 1},
  {id: 'W5-3wed-2v-installation', component: Installation, frames: s(7)},
  {id: 'W5-4thu-1p-motion-study', component: MotionStudy, frames: 1},
  {id: 'W5-4thu-2v-wearable-art', component: WearableArt, frames: s(6.6)},
  {id: 'W5-5fri-1v-portrait-of-a-man-choosing', component: PortraitChoosing, frames: s(7.5)},
  {id: 'W5-5fri-2p-wish-you-were-here', component: MuseumShop, frames: 1},
  {id: 'W5-6sat-1v-vernissage-tonight', component: Vernissage, frames: s(7)},
  {id: 'W5-6sat-2p-poster', component: Poster, frames: 1},
  {id: 'W5-7sun-1v-natura-morta', component: NaturaMorta, frames: s(6)},
  {id: 'W5-7sun-2p-palette', component: Palette, frames: 1},
];
