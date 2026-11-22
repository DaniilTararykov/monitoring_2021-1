import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Week of 23.11 (client 22.11: «маст — трюфель, мясо, панеттоне; возвращаемся к прежнему стилю: без плашек и анимаций,
// они не нравятся Антонио»). Classic look only: the footage full-bleed, a soft night gradient on the side of the frame that
// is empty, and the type standing still — no bands, no boxes, no motion on the text. Phone footage from the folder
// 1MZyh2Y…, stabilised (vidstab, two passes); the panettone from the still photos. English only.

const SA = brandPalette.sand454, I = colors.ivory;
type Spec = {id: string; sec: number; src: string; video?: boolean; at?: number; fy?: number; side: 'top' | 'bottom'; size?: number; kicker?: string; head: string; sub: string;
  caption: string; hashtags: string[]};

const StoryView: React.FC<{s: Spec}> = ({s}) => {
  const top = s.side === 'top';
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${s.fy ?? 50}%`};
  return (
    <AbsoluteFill style={{background: colors.night}}>
      {s.video ? <OffthreadVideo src={staticFile(`videos/st/${s.src}.mp4`)} startFrom={Math.round((s.at ?? 0) * 30)} muted style={st} />
        : <Img src={staticFile(`photos/w22/${s.src}.jpg`)} style={st} />}
      <div style={{position: 'absolute', left: 0, right: 0, [s.side]: 0, height: 820,
        background: `linear-gradient(${top ? 'to bottom' : 'to top'}, rgba(11,11,11,0.82) 0%, rgba(11,11,11,0.55) 45%, rgba(11,11,11,0) 100%)`}} />
      <div style={{position: 'absolute', left: 90, right: 90, top: top ? 300 : 1330}}>
        {s.kicker && <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 20, letterSpacing: 6, textTransform: 'uppercase', color: SA, marginBottom: 18}}>{s.kicker}</div>}
        <div style={{fontFamily: fonts.display, fontSize: s.size ?? 104, lineHeight: 0.95, color: I}}>{s.head.split("\n").map((l) => <div key={l}>{l}</div>)}</div>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 50, lineHeight: 1.2, color: I, marginTop: 18}}>{s.sub}</div>
      </div>
    </AbsoluteFill>
  );
};

const t = (...x: string[]) => ['#seasignora', ...x];
const SPECS: Spec[] = [
  // white truffle
  {id: 'W-01v-truffle', sec: 5, src: 'S_3601', video: true, side: 'top', kicker: 'sea, signora · brera', head: 'White truffle', sub: 'in season now',
    caption: 'White truffle is in season at Sea, Signora.', hashtags: t('#whitetruffle', '#tartufobianco', '#brera')},
  {id: 'W-02v-in-the-pan', sec: 7, src: 'S_3603', video: true, side: 'top', head: 'Tagliolini', sub: 'tossed in the pan, butter and parmigiano',
    caption: 'Tagliolini, tossed in the pan with butter and parmigiano. The truffle comes next.', hashtags: t('#tagliolini', '#pasta', '#brera')},
  {id: 'W-03v-shaved', sec: 7, src: 'S_3608', video: true, side: 'top', head: 'Shaved to order', sub: 'straight onto your plate',
    caption: 'White truffle, shaved to order straight onto your plate.', hashtags: t('#whitetruffle', '#tagliolini', '#brera')},
  {id: 'W-04v-tagliolini-truffle', sec: 6, src: 'S_3616', video: true, side: 'top', head: 'Tagliolini\n& white truffle', sub: 'ask for it tonight',
    caption: 'Tagliolini and white truffle. Ask for it tonight.', hashtags: t('#whitetruffle', '#tagliolini', '#milan')},
  // the meat
  {id: 'W-05v-tomahawk', sec: 6, src: 'S_3130', video: true, side: 'top', kicker: 'from the grill', size: 84, head: 'The\ntomahawk', sub: 'a cut for sharing',
    caption: 'The tomahawk: one cut, on the bone, for the table to share.', hashtags: t('#tomahawk', '#steak', '#brera')},
  {id: 'W-06v-over-the-fire', sec: 7, src: 'S_3137', video: true, side: 'top', head: 'Over the fire', sub: 'charcoal and open flame',
    caption: 'Over the fire: charcoal and open flame in our open kitchen.', hashtags: t('#grill', '#openkitchen', '#brera')},
  {id: 'W-07v-carved', sec: 7, src: 'S_3143', video: true, side: 'top', head: 'Rested, then carved', sub: 'sliced at the pass',
    caption: 'Rested, then carved at the pass.', hashtags: t('#tomahawk', '#steak', '#milan')},
  {id: 'W-08v-for-the-table', sec: 7, src: 'S_3145', video: true, side: 'top', head: 'For the table', sub: 'carved, dressed, served to share',
    caption: 'For the table: carved, dressed and served to share.', hashtags: t('#tomahawk', '#sharing', '#brera')},
  // panettone (stills)
  {id: 'W-09p-panettone', sec: 1, src: 'IMG_3194', side: 'top', kicker: 'sea, signora · brera', head: 'Panettone', sub: 'by the slice, with cream',
    caption: 'Panettone by the slice, with cream. The season has started.', hashtags: t('#panettone', '#christmas', '#brera')},
  {id: 'W-10p-coffee-panettone', sec: 1, src: 'IMG_3198', side: 'top', head: 'Coffee & panettone', sub: 'the slow way to end dinner',
    caption: 'Coffee and panettone: the slow way to end dinner.', hashtags: t('#panettone', '#espresso', '#milan')},
];
export const WEEK_TRUFFLE = SPECS.map((s) => ({...s, view: () => <StoryView s={s} />}));
