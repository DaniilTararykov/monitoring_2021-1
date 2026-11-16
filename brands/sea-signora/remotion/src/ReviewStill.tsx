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

// «Dish card» in the client's own review layout (her caviar-pasta story): full-bleed photo, SEA, SIGNORA + a mono label
// at the top, the dish name and one clear line at the bottom. One dish per story, photographed whole, nothing abstract.
type DishCard = {id: string; img: string; fy?: number; textTop?: number; band?: boolean; label: string; name: string; line: string; caption: string; hashtags: string[]};
export const DishCardView: React.FC<{d: DishCard}> = ({d}) => (
  <AbsoluteFill style={{background: colors.night}}>
    <Img src={staticFile(`photos/w16/${d.img}`)} style={{position: 'absolute', left: 0, top: d.band ? 500 : 0, width: '100%', height: d.band ? 760 : '100%', objectFit: 'cover', objectPosition: `50% ${d.fy ?? 50}%`}} />
    {d.band && <div style={{position: 'absolute', left: 0, right: 0, top: 1250, bottom: 0, background: colors.night}} />}
    <AbsoluteFill style={{background: 'rgba(11,11,11,0.18)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 620, background: 'linear-gradient(rgba(11,11,11,0.62), rgba(11,11,11,0))'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 820, background: 'linear-gradient(rgba(11,11,11,0), rgba(11,11,11,0.82) 55%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 270, display: 'flex', justifyContent: 'center'}}>
      <div>
        <div style={{fontFamily: fonts.display, fontSize: 118, color: colors.ivory, textTransform: 'uppercase', lineHeight: 1, letterSpacing: 1}}>Sea, Signora</div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 52, color: colors.ivory, textAlign: 'right', marginTop: 6}}>{d.label}</div>
      </div>
    </div>
    <div style={{position: 'absolute', left: 60, right: 60, top: d.textTop ?? 1290, textAlign: 'center', fontFamily: fonts.display, fontSize: 104, color: colors.ivory, textTransform: 'uppercase',
      lineHeight: 1}}>{d.name}</div>
    <div style={{position: 'absolute', left: 80, right: 80, top: (d.textTop ?? 1290) + 130, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 33, lineHeight: 1.3,
      color: colors.ivory, textTransform: 'uppercase', letterSpacing: 0.5}}>{d.line}</div>
  </AbsoluteFill>
);
const t = (...x: string[]) => ['#seasignora', ...x];
export const DISH_CARDS: DishCard[] = [
  {id: 'R-02p-tagliolini', img: 'bo108.jpg', fy: 55, band: true, textTop: 1320, label: 'pasta', name: 'Tagliolini', line: 'seafood, fresh herbs, made to order',
    caption: 'Tagliolini with seafood and fresh herbs, made to order.', hashtags: t('#tagliolini', '#pasta', '#brera')},
  {id: 'R-03p-akami', img: 'bo120.jpg', fy: 60, textTop: 460, label: 'raw bar', name: 'Akami', line: 'lean red tuna, fennel, mint',
    caption: 'From the raw bar: akami, lean red tuna with fennel and mint.', hashtags: t('#akami', '#tuna', '#brera')},
  {id: 'R-04p-capesante', img: 'bo268.jpg', fy: 45, textTop: 1360, label: "chef's pick", name: 'Capesante', line: 'black mushrooms, hazelnuts',
    caption: "Chef's pick: capesante with black mushrooms and hazelnuts.", hashtags: t('#capesante', '#scallops', '#brera')},
  {id: 'R-05p-caviar', img: 'bo476.jpg', fy: 35, label: 'dessert', name: 'Cream & caviar', line: 'finished with caviar at the pass',
    caption: 'Cream, finished with caviar at the pass.', hashtags: t('#caviar', '#dessert', '#brera')},
  {id: 'R-06p-red', img: 'bo347.jpg', fy: 40, label: 'the bar', name: 'Red', line: 'our red cocktail, served cold',
    caption: 'Our red cocktail, served cold at the bar.', hashtags: t('#cocktails', '#bar', '#brera')},
];
