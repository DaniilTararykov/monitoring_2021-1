import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Sea, Signora × sėmpre si (27.11–18.12): two collab cocktails served with a crab charm on the glass; with a bill from
// €130 a collab cocktail and a sėmpre si crab charm as a gift. Classic look: footage, night gradient over the marble,
// static type. Brand name always lowercase as the brand writes it.
const H: React.CSSProperties = {fontFamily: fonts.display, fontSize: 62, lineHeight: 1.05, letterSpacing: 1, textTransform: 'uppercase', color: colors.ivory, textWrap: 'balance'} as React.CSSProperties;
const M: React.CSSProperties = {fontFamily: fonts.mono, fontWeight: 500, fontSize: 30, lineHeight: 1.4, letterSpacing: 1, textTransform: 'uppercase', color: colors.ivory, textWrap: 'balance'} as React.CSSProperties;
const Shade = () => <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 900, background: 'linear-gradient(to bottom, rgba(11,11,11,0.82), rgba(11,11,11,0.5) 50%, rgba(11,11,11,0))'}} />;
const Chip: React.FC<{label: string}> = ({label}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 1660, display: 'flex', justifyContent: 'center'}}>
    <div style={{background: brandPalette.orange158, borderRadius: 22, padding: '20px 34px', fontFamily: fonts.mono, fontWeight: 600, fontSize: 36, color: colors.ivory}}>🔗 {label}</div></div>
);
const Lockup = () => (
  <div style={{textAlign: 'center'}}>
    <span style={{fontFamily: fonts.display, fontSize: 84, color: colors.ivory}}>Sea, Signora</span>
    <span style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 64, color: brandPalette.orange158, margin: '0 22px'}}>×</span>
    <span style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 56, color: colors.ivory}}>sėmpre si</span>
  </div>
);
const Announce: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    <OffthreadVideo src={staticFile('videos/collab/charm.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <Shade />
    <div style={{position: 'absolute', left: 60, right: 60, top: 255}}>
      <Lockup />
      <div style={{...M, textAlign: 'center', marginTop: 12}}>27 november — 18 december</div>
    </div>
  </AbsoluteFill>
);
const Served: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    <Img src={staticFile('photos/collab/f7.0.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <Shade />
    <div style={{position: 'absolute', left: 80, right: 80, top: 290, textAlign: 'center'}}>
      <div style={H}>A crab for your glass</div>
      <div style={{...M, marginTop: 18}}>order ephyra or levante, served with a sėmpre si crab charm</div>
    </div>
  </AbsoluteFill>
);
const Gift: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    <Img src={staticFile('photos/collab/f8.6.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 900, background: 'linear-gradient(to top, rgba(11,11,11,0.85), rgba(11,11,11,0.5) 50%, rgba(11,11,11,0))'}} />
    <div style={{position: 'absolute', left: 80, right: 80, top: 1310, textAlign: 'center'}}>
      <div style={H}>On us</div>
      <div style={{...M, marginTop: 18}}>with a bill from €130: ephyra or levante and a sėmpre si crab charm</div>
      <div style={{...M, fontSize: 24, marginTop: 18, opacity: 0.85}}>27.11 — 18.12</div>
    </div>
    <Chip label="book a table" />
  </AbsoluteFill>
);

// client 23.11: the collab shoot (glasses with the sėmpre si crab charms). Same classic look; text kept off faces,
// glasses and charms; two more booking chips with their own wording (three in the set).
type Sp = {src: string; at: 'top' | 'bottom'; top: number; h: string; line: string; date?: boolean; chip?: string; pos?: string};
const Still: React.FC<Sp> = ({src, at, top, h, line, date, chip, pos}) => (
  <AbsoluteFill style={{background: colors.night}}>
    <Img src={staticFile(`photos/collab/${src}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos ?? 'center'}} />
    {at === 'top' ? <Shade /> : <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 900, background: 'linear-gradient(to top, rgba(11,11,11,0.85), rgba(11,11,11,0.5) 50%, rgba(11,11,11,0))'}} />}
    <div style={{position: 'absolute', left: 80, right: 80, top, textAlign: 'center'}}>
      <div style={H}>{h}</div>
      <div style={{...M, marginTop: 18}}>{line}</div>
      {date && <div style={{...M, fontSize: 24, marginTop: 18, opacity: 0.85}}>27.11 — 18.12</div>}
    </div>
    {chip && <Chip label={chip} />}
  </AbsoluteFill>
);
const Toast = () => <Still src="s97" at="top" top={270} h="Ephyra & Levante" line="two cocktails, each with a sėmpre si crab on the stem" />;
const Closer = () => <Still src="s94" at="top" top={300} h="Look closer" line="a little crab by sėmpre si, hanging from your glass" />;
const Marble = () => <Still src="s98" at="bottom" top={1420} h="Cin cin, Brera" line="the crab charms stay on our glasses until 18 december" chip="reserve for two" />;
const Last = () => <Still src="s87" at="bottom" top={1440} h="Until 18 December" line="ephyra or levante, dressed by sėmpre si" chip="save your seat" pos="40% center" />;
export const COLLAB = [
  {id: 'C3-01v-announce', sec: 9.2, view: Announce},
  {id: 'C3-02p-served', sec: 1, view: Served},
  {id: 'C3-03p-gift', sec: 1, view: Gift},
  {id: 'C3-04p-toast', sec: 1, view: Toast},
  {id: 'C3-05p-closer', sec: 1, view: Closer},
  {id: 'C3-06p-marble', sec: 1, view: Marble},
  {id: 'C3-07p-last', sec: 1, view: Last},
];
