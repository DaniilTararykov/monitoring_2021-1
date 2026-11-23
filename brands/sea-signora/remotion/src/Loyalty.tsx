import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Loyalty card in Apple Wallet (client 23.11): plain text on a photo, classic look, one booking-style link chip.
// Photo: the cocktail tray from the November shoot (s83), text in the dark velvet above it.
const H: React.CSSProperties = {fontFamily: fonts.display, fontSize: 62, lineHeight: 1.05, letterSpacing: 1, textTransform: 'uppercase', color: colors.ivory, textWrap: 'balance'} as React.CSSProperties;
const M: React.CSSProperties = {fontFamily: fonts.mono, fontWeight: 500, fontSize: 30, lineHeight: 1.4, letterSpacing: 1, textTransform: 'uppercase', color: colors.ivory, textWrap: 'balance'} as React.CSSProperties;
const Card: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    <Img src={staticFile('photos/loyalty/s83.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1000, background: 'linear-gradient(to bottom, rgba(11,11,11,0.85), rgba(11,11,11,0.55) 55%, rgba(11,11,11,0))'}} />
    <div style={{position: 'absolute', left: 80, right: 80, top: 300, textAlign: 'center'}}>
      <div style={H}>The Sea, Signora loyalty card, now in your Apple Wallet</div>
      <div style={{...M, marginTop: 26}}>1.5% cashback on every order, to reuse for up to 30% of your bill</div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1660, display: 'flex', justifyContent: 'center'}}>
      <div style={{background: brandPalette.orange158, borderRadius: 22, padding: '20px 34px', fontFamily: fonts.mono, fontWeight: 600, fontSize: 36, color: colors.ivory}}>🔗 add to wallet</div>
    </div>
  </AbsoluteFill>
);

// client 23.11: the same text on their yellow line-drawing background. Ivory would vanish on yellow, so the type goes
// in the brand green; text sits in the clear middle band between the drawings.
const G = brandPalette.green5605;
const Yellow: React.FC = () => (
  <AbsoluteFill style={{background: '#fbf3ab'}}>
    <Img src={staticFile('photos/loyalty/yellow.png')} style={{width: '100%', height: '100%'}} />
    <div style={{position: 'absolute', left: 180, right: 180, top: 640, textAlign: 'center'}}>
      <div style={{...H, color: G}}>The Sea, Signora loyalty card, now in your Apple Wallet</div>
      <div style={{...M, color: G, marginTop: 30}}>1.5% cashback on every order, to reuse for up to 30% of your bill</div>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: 60}}>
        <div style={{background: brandPalette.orange158, borderRadius: 22, padding: '20px 34px', fontFamily: fonts.mono, fontWeight: 600, fontSize: 36, color: colors.ivory}}>🔗 add to wallet</div>
      </div>
    </div>
  </AbsoluteFill>
);
export const LOYALTY = [{id: 'LOY-01p-wallet', view: Card}, {id: 'LOY-02p-yellow', view: Yellow}];
