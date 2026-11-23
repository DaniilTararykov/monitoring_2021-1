import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Holiday hours (client 23.11): closed 24 & 25 December, 31 December & 1 January. Classic look: photo, night gradient,
// Skanaus caps + mono lines, static.
const H: React.CSSProperties = {fontFamily: fonts.display, fontSize: 66, lineHeight: 1.05, letterSpacing: 1, textTransform: 'uppercase', color: colors.ivory};
const M: React.CSSProperties = {fontFamily: fonts.mono, fontWeight: 500, fontSize: 32, lineHeight: 1.4, letterSpacing: 1, color: colors.ivory};
const HolidayHours: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    <Img src={staticFile('photos/w24/A__-58.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 60%'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1000,
      background: 'linear-gradient(to bottom, rgba(11,11,11,0.85) 0%, rgba(11,11,11,0.6) 50%, rgba(11,11,11,0) 100%)'}} />
    <div style={{position: 'absolute', left: 80, right: 80, top: 300, textAlign: 'center'}}>
      <div style={H}>Holiday hours</div>
      <div style={{...M, marginTop: 44}}>24 & 25 December</div>
      <div style={{...M, textTransform: 'uppercase', fontSize: 28, opacity: 0.85}}>closed</div>
      <div style={{...M, marginTop: 30}}>31 December & 1 January</div>
      <div style={{...M, textTransform: 'uppercase', fontSize: 28, opacity: 0.85}}>closed</div>
    </div>
  </AbsoluteFill>
);
export const HOLIDAY = [{id: 'HOL-01p-holiday-hours', view: HolidayHours}];
