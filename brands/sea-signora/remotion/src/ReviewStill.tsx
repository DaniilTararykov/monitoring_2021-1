import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Review story on the aquarium photo, in the layout of the client's caviar-pasta review story (16.11): wordmark +
// «review» at the top, five stars and the Google review verbatim in JetBrains Mono caps at the bottom.
const REVIEW = 'Exceptional restaurant with top quality seafood. Professional knowledgeable service within a beautifully designed atmosphere. Highly recommend, we will be back. Thank you.';

export const ReviewAquarium: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    <Img src={staticFile('photos/w15/aquarium.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <AbsoluteFill style={{background: 'rgba(11,11,11,0.28)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 560, background: 'linear-gradient(rgba(11,11,11,0.55), rgba(11,11,11,0))'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 900, background: 'linear-gradient(rgba(11,11,11,0), rgba(11,11,11,0.78) 45%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 270, display: 'flex', justifyContent: 'center'}}>
      <div>
        <div style={{fontFamily: fonts.display, fontSize: 118, color: colors.ivory, textTransform: 'uppercase', lineHeight: 1, letterSpacing: 1}}>Sea, Signora</div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 58, color: colors.ivory, textAlign: 'right', marginTop: 6}}>review</div>
      </div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1250, display: 'flex', justifyContent: 'center', gap: 22}}>
      {Array.from({length: 5}, (_, i) => (
        <svg key={i} width={92} height={92} viewBox="0 0 24 24"><path d="M12 1.8 L14.9 8.4 L22.1 9.1 L16.7 13.9 L18.3 21 L12 17.3 L5.7 21 L7.3 13.9 L1.9 9.1 L9.1 8.4 Z" fill={colors.star} /></svg>
      ))}
    </div>
    <div style={{position: 'absolute', left: 60, right: 60, top: 1375, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 33, lineHeight: 1.28,
      color: colors.ivory, textTransform: 'uppercase', letterSpacing: 0.5}}>{REVIEW}</div>
  </AbsoluteFill>
);
