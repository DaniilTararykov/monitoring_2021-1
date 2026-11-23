import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// People, different ones (client 23.11: «разных отсюда» — folder 1MZyh2Y…): guests in the room, video, windows of the
// clips never used before, stabilised (vidstab). Client 23.11: «3 секунды — нехорошо, минимум 8–10»: each story now
// runs 8–9 s on one long steady take (or two takes cut straight together). One static line in the brand look; position varies.
type S = {id: string; n: string; cuts?: [string, number][]; head: string; pos: 'top' | 'bottom' | 'topLeft'; cta?: string; caption: string; hashtags: string[]};
const H: React.CSSProperties = {fontFamily: fonts.display, fontSize: 60, lineHeight: 1.05, letterSpacing: 1, textTransform: 'uppercase', color: colors.ivory};
const View: React.FC<{s: S}> = ({s}) => {
  const top = s.pos !== 'bottom';
  return (
    <AbsoluteFill style={{background: colors.night}}>
      {(() => { let t = 0; return (s.cuts ?? [[s.n, 0]]).map(([n, len], i) => { const from = Math.round(t * 30); t += len; return (
        <Sequence key={i} from={from} durationInFrames={len ? Math.round(t * 30) - from : undefined}>
          <OffthreadVideo src={staticFile(`videos/st/L_${n}.mp4`)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence>); }); })()}
      <div style={{position: 'absolute', left: 0, right: 0, [top ? 'top' : 'bottom']: 0, height: 760,
        background: `linear-gradient(${top ? 'to bottom' : 'to top'}, rgba(11,11,11,0.8), rgba(11,11,11,0.45) 45%, rgba(11,11,11,0))`}} />
      <div style={{position: 'absolute', left: 80, right: s.pos === 'topLeft' ? 220 : 80, textAlign: s.pos === 'topLeft' ? 'left' : 'center', ...(top ? {top: 300} : {bottom: 380}), ...H}}>{s.head}</div>
      {s.cta && <div style={{position: 'absolute', left: 0, right: 0, top: top ? 1640 : 1250, display: 'flex', justifyContent: 'center'}}>
        <div style={{background: brandPalette.orange158, borderRadius: 22, padding: '20px 34px', fontFamily: fonts.mono, fontWeight: 600, fontSize: 36, color: colors.ivory}}>🔗 {s.cta}</div></div>}
    </AbsoluteFill>
  );
};
const t = (...x: string[]) => ['#seasignora', ...x];
const SPECS: S[] = [
  {id: 'P3-01v-under-the-lamp', n: '3576', cuts: [['3576', 6], ['3634', 3]], head: 'Under the lamp, around the candle', pos: 'top', caption: 'Under the lamp, around the candle.', hashtags: t('#brera', '#dinner', '#milan')},
  {id: 'P3-02v-front-row', n: '3577', head: 'Front row at the open kitchen', pos: 'top', caption: 'Front row at the open kitchen.', hashtags: t('#openkitchen', '#brera', '#milan')},
  {id: 'P3-03v-blue-glow', n: '3578', head: 'Dinner in the blue glow', pos: 'bottom', caption: 'Dinner in the blue glow of the aquarium.', hashtags: t('#aquarium', '#brera', '#dinner')},
  {id: 'P3-04v-full-house', n: '3582', head: 'Full house', pos: 'topLeft', cta: 'book a table', caption: 'Full house tonight. Book ahead.', hashtags: t('#brera', '#milan', '#restaurant')},
  {id: 'P3-05v-between-tables', n: '3585', head: 'Always someone on the way to your table', pos: 'top', caption: 'Always someone on the way to your table.', hashtags: t('#hospitality', '#brera', '#milan')},
  {id: 'P3-06v-chandeliers', n: '3584', head: 'Talk, laugh, repeat', pos: 'bottom', caption: 'Talk, laugh, repeat, under the chandeliers.', hashtags: t('#friends', '#brera', '#dinner')},
  {id: 'P3-07v-long-table', n: '3591', head: 'Pull up a chair', pos: 'top', cta: 'reserve your table', caption: 'Pull up a chair. There is always room at the long table.', hashtags: t('#friends', '#groupdinner', '#brera')},
  {id: 'P3-08v-the-room', n: '3592', head: 'The room at its best', pos: 'top', caption: 'The room at its best: full tables, warm light.', hashtags: t('#interiors', '#dinner', '#milan')},
  {id: 'P3-09v-late', n: '3636', head: 'Nobody checks the time', pos: 'top', caption: 'Nobody checks the time here.', hashtags: t('#nightout', '#brera', '#milan')},
  {id: 'P3-10v-table-talk', n: '3638', head: 'Table talk', pos: 'bottom', cta: 'book your evening', caption: 'Table talk, candles and plates to share.', hashtags: t('#friends', '#candlelight', '#brera')},
];
const DUR: Record<string, number> = {'3576': 9, '3577': 8.5, '3578': 8.5, '3582': 8.5, '3585': 8, '3584': 8, '3591': 8.5, '3592': 8, '3636': 8, '3638': 8};
export const PEOPLE_VID = SPECS.map((s) => ({id: s.id, sec: DUR[s.n], caption: s.caption, hashtags: s.hashtags, view: () => <View s={s} />}));
