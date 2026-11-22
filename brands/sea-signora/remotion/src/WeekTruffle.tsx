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
type Spec = {id: string; sec: number; src: string; video?: boolean; at?: number; fy?: number; side: 'top' | 'bottom'; size?: number; textTop?: number; kicker?: string; head: string; sub: string;
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
      <div style={{position: 'absolute', left: 90, right: 90, top: s.textTop ?? (top ? 300 : 1330)}}>
        {s.kicker && <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 20, letterSpacing: 6, textTransform: 'uppercase', color: SA, marginBottom: 18}}>{s.kicker}</div>}
        <div style={{fontFamily: fonts.display, fontSize: s.size ?? 104, lineHeight: 0.95, color: I}}>{s.head.split("\n").map((l) => <div key={l}>{l}</div>)}</div>
        {s.sub && <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 50, lineHeight: 1.2, color: I, marginTop: 18}}>{s.sub}</div>}
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
  // client 22.11 (2nd note): 30 stories, varied, with Sea, Signora lifestyle as well
  // more truffle
  {id: 'W-11v-pan-to-plate', sec: 6, src: 'S_3606', video: true, side: 'top', head: 'From pan to plate', sub: 'tagliolini, twirled by hand',
    caption: 'From pan to plate: tagliolini, twirled by hand before the truffle.', hashtags: t('#tagliolini', '#whitetruffle', '#brera')},
  {id: 'W-12p-the-truffle', sec: 1, src: 'IMG_3597', side: 'bottom', head: 'Ready to shave', sub: 'white truffle, on its way to your plate',
    caption: 'White truffle, ready to shave and on its way to your plate.', hashtags: t('#whitetruffle', '#tartufobianco', '#milan')},
  {id: 'W-13p-autumn-plate', sec: 1, src: 'IMG_3629', side: 'top', head: 'Autumn, on a plate', sub: 'tagliolini and white truffle',
    caption: 'Autumn, on a plate: tagliolini and white truffle.', hashtags: t('#whitetruffle', '#tagliolini', '#brera')},
  {id: 'W-14v-open-kitchen', sec: 6, src: 'S_3599', video: true, side: 'bottom', head: 'The open kitchen', sub: 'in full view of the room',
    caption: 'The open kitchen, in full view of the room.', hashtags: t('#openkitchen', '#chef', '#brera')},
  // more meat
  {id: 'W-15v-off-the-bone', sec: 7, src: 'S_3141', video: true, side: 'top', head: 'Off the bone', sub: 'carved one slice at a time',
    caption: 'Off the bone: the tomahawk, carved one slice at a time.', hashtags: t('#tomahawk', '#steak', '#brera')},
  {id: 'W-16v-cut-in-house', sec: 6, src: 'S_3129', video: true, side: 'top', head: 'Cut in our kitchen', sub: 'one rib at a time',
    caption: 'Cut in our kitchen, one rib at a time.', hashtags: t('#tomahawk', '#openkitchen', '#milan')},
  {id: 'W-17v-patience', sec: 6, src: 'S_3135', video: true, side: 'bottom', head: 'Patience', sub: 'it takes its time over the coals',
    caption: 'Patience: the tomahawk takes its time over the coals.', hashtags: t('#grill', '#tomahawk', '#brera')},
  {id: 'W-18p-dinner-for-the-table', sec: 1, src: 'IMG_3177', side: 'top', head: 'Dinner for the table', sub: 'the tomahawk, carved to share',
    caption: 'Dinner for the table: the tomahawk, carved to share.', hashtags: t('#tomahawk', '#sharing', '#milan')},
  // more panettone
  {id: 'W-19p-panettone-season', sec: 1, src: 'IMG_3224', side: 'top', head: 'Panettone season', sub: 'slow evenings, sweet endings',
    caption: 'Panettone season: slow evenings, sweet endings.', hashtags: t('#panettone', '#christmas', '#brera')},
  {id: 'W-20p-first-slice', sec: 1, src: 'IMG_3203', side: 'top', head: 'Who gets\nthe first slice?', sub: 'panettone, for the table',
    caption: 'Who gets the first slice? Panettone, for the table.', hashtags: t('#panettone', '#sharing', '#milan')},
  // Sea, Signora lifestyle
  {id: 'W-21v-tonight-in-brera', sec: 6, src: 'S_3576', video: true, side: 'top', kicker: 'via fiori chiari 32', head: 'Tonight in Brera', sub: 'under the jellyfish lamp',
    caption: 'Tonight in Brera, under the jellyfish lamp.', hashtags: t('#brera', '#milan', '#dinner')},
  {id: 'W-22v-aquarium', sec: 6, src: 'S_3578', video: true, side: 'top', head: 'Dinner by\nthe aquarium', sub: 'the bluest corner of Brera',
    caption: 'Dinner by the aquarium, the bluest corner of Brera.', hashtags: t('#aquarium', '#brera', '#milan')},
  {id: 'W-23v-the-room', sec: 6, src: 'S_3582', video: true, side: 'top', head: 'The room', sub: 'every table, its own evening',
    caption: 'The room: every table, its own evening.', hashtags: t('#interiors', '#brera', '#dinner')},
  {id: 'W-24v-chandeliers', sec: 6, src: 'S_3584', video: true, side: 'top', head: 'Under\nthe chandeliers', sub: 'a Friday kind of glow',
    caption: 'Under the chandeliers: a Friday kind of glow.', hashtags: t('#interiors', '#brera', '#milan')},
  {id: 'W-25v-behind-the-bar', sec: 6, src: 'S_3587', video: true, side: 'bottom', head: 'Behind the bar', sub: 'shaken to order',
    caption: 'Behind the bar: every cocktail shaken to order.', hashtags: t('#cocktails', '#bar', '#brera')},
  {id: 'W-26v-sparkling', sec: 6, src: 'S_3589', video: true, side: 'top', head: 'Something sparkling', sub: 'poured at the bar',
    caption: 'Something sparkling, poured at the bar.', hashtags: t('#cocktails', '#bubbles', '#brera')},
  {id: 'W-27v-the-strain', sec: 6, src: 'S_3637', video: true, side: 'bottom', head: 'The last strain', sub: 'before it reaches your table',
    caption: 'The last strain, before it reaches your table.', hashtags: t('#cocktails', '#bar', '#milan')},
  {id: 'W-28v-service', sec: 4.6, src: 'S_3633', video: true, side: 'top', head: 'Service,\nwith a view', sub: 'tables by the aquarium',
    caption: 'Service, with a view: the tables by the aquarium.', hashtags: t('#aquarium', '#dinner', '#brera')},
  {id: 'W-29v-wine', sec: 3.5, src: 'S_3632', video: true, side: 'bottom', head: 'Chilled\nand waiting', sub: 'from our wine list',
    caption: 'Chilled and waiting, from our wine list.', hashtags: t('#wine', '#winelist', '#brera')},
  {id: 'W-30v-good-company', sec: 6, src: 'S_3638', video: true, side: 'top', head: 'Good company', sub: 'a long table, candles, plates to share',
    caption: 'Good company: a long table, candles and plates to share.', hashtags: t('#friends', '#sharing', '#brera')},
];
export const WEEK_TRUFFLE = SPECS.map((s) => ({...s, view: () => <StoryView s={s} />}));
