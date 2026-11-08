import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// «Choose your fighter» (client 08.11: new concepts): three new dishes side by side, full height, the account's own look
// (night gradient, ivory Skanaus, orange mono label). One still.
const DISHES = [
  {photo: 'photos/w8/bn125.jpg', name: 'Akami', note: 'culatello e porcini', fx: 45},
  {photo: 'photos/w8/bn139.jpg', name: 'Scampo', note: 'lardo di colonnata', fx: 40},
  {photo: 'photos/w8/bn107.jpg', name: 'Tagliolini', note: 'calamari e finferli', fx: 55},
];

export const Fighter: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    {DISHES.map((d, i) => (
      <div key={i} style={{position: 'absolute', top: 0, bottom: 0, left: i * 360, width: 360, overflow: 'hidden',
        borderLeft: i ? `3px solid ${colors.night}` : 'none'}}>
        <Img src={staticFile(d.photo)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${d.fx}% 55%`}} />
      </div>
    ))}
    <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(11,11,11,0.85) 0%, rgba(11,11,11,0) 30%, rgba(11,11,11,0) 58%, rgba(11,11,11,0.85) 82%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', color: colors.ivory}}>
      <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 24, letterSpacing: 6, textTransform: 'uppercase', color: colors.orange}}>new on the menu</div>
      <div style={{fontFamily: fonts.display, fontSize: 78, textTransform: 'uppercase', letterSpacing: 1, marginTop: 14}}>Choose your fighter</div>
    </div>
    {DISHES.map((d, i) => (
      <div key={i} style={{position: 'absolute', left: i * 360, width: 360, top: 1440, textAlign: 'center', color: colors.ivory}}>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 22, color: colors.orange}}>{`0${i + 1}`}</div>
        <div style={{fontFamily: fonts.display, fontSize: 52, textTransform: 'uppercase', marginTop: 8}}>{d.name}</div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 17, letterSpacing: 2, textTransform: 'uppercase', marginTop: 8, padding: '0 18px'}}>{d.note}</div>
      </div>
    ))}
  </AbsoluteFill>
);
