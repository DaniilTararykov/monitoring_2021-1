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
      <div style={{...M, marginTop: 18}}>order one of our two collab cocktails, served with a sėmpre si crab charm</div>
    </div>
  </AbsoluteFill>
);
const Gift: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    <Img src={staticFile('photos/collab/f8.6.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 900, background: 'linear-gradient(to top, rgba(11,11,11,0.85), rgba(11,11,11,0.5) 50%, rgba(11,11,11,0))'}} />
    <div style={{position: 'absolute', left: 80, right: 80, top: 1310, textAlign: 'center'}}>
      <div style={H}>On us</div>
      <div style={{...M, marginTop: 18}}>with a bill from €130: a collab cocktail and a sėmpre si crab charm</div>
      <div style={{...M, fontSize: 24, marginTop: 18, opacity: 0.85}}>27.11 — 18.12</div>
    </div>
    <Chip label="book a table" />
  </AbsoluteFill>
);
export const COLLAB = [
  {id: 'C3-01v-announce', sec: 9.2, view: Announce},
  {id: 'C3-02p-served', sec: 1, view: Served},
  {id: 'C3-03p-gift', sec: 1, view: Gift},
];
