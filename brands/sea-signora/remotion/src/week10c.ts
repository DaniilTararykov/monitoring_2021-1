import {BRAND, type CreativeSpec, type Media} from './Creative';

// Week 16–22.11 — creative stories in the Sea, Signora identity (client 16.11). 21 stories, 3 a day, every one a
// designed layout on brand colour (see Creative.tsx). Material: the new menu cooked on video (folder 1Uv4yte…),
// Blackout 29.10 pro photos, Pixieset (entrance, table, guests), folder 1KgFz8ZB… (room, kitchen, autumn decor, raw bar),
// team portraits, panettone. Link chips: Tue, Thu, Sat. Headlines avoid «?» (no glyph in Skanaus).

const {G, O, SA, I} = BRAND;
const p = (n: string, o: Partial<Media> = {}): Media => ({src: `w10/${n}.jpg`, ...o});
const v = (n: string, at: number, o: Partial<Media> = {}): Media => ({src: `w10/${n}.mp4`, at, ...o});
const c = (day: string, date: string): [string, string, string, string] => ['Sea, Signora', 'Milano', day, date];
const tags = (...t: string[]) => ['#seasignora', ...t];

export const week10c: CreativeSpec[] = [
  // ───────── Lunedì 16.11
  {id: 'W10-1mon-1v-la-cucina', day: 'Mon 16.11', k: 'page', sec: 9, bg: G, ink: I, corners: c('Lunedì', '16.11'),
    media: [v('nm0632', 4.6), v('nm0672', 0.3)], title: 'La cucina', sub: 'monday—friday · 19:00—00:00',
    caption: 'La cucina: open Monday to Friday, 19:00–00:00.', hashtags: tags('#openkitchen', '#brera', '#milano')},
  {id: 'W10-1mon-2v-trentadue', day: 'Mon 16.11', k: 'mask', sec: 7, bg: O, ink: G,
    media: [p('p0195', {fy: 45})], word: '32', size: 1150, kicker: 'via fiori chiari', sub: 'brera · milano',
    caption: 'Via Fiori Chiari, 32. Brera, Milano.', hashtags: tags('#brera', '#viafiorichiari', '#milano')},
  {id: 'W10-1mon-3p-roberto', day: 'Mon 16.11', k: 'page', sec: 7, bg: SA, ink: G, corners: c('Lunedì', 'la squadra'),
    media: [p('npchefRoberto2', {fy: 35})], title: 'Roberto Godi', sub: 'chef · sea, signora',
    caption: 'La squadra: Roberto Godi, our chef.', hashtags: tags('#chef', '#team', '#brera')},

  // ───────── Martedì 17.11
  {id: 'W10-2tue-1p-akami-anatomy', day: 'Tue 17.11', k: 'anatomy', sec: 7, bg: SA, ink: G,
    media: p('bo113', {fx: 50, fy: 55, z: 1.15}), labels: ['akami', 'culatello', 'porcini', 'sea, signora'], title: 'Akami',
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Akami, culatello e porcini.', hashtags: tags('#akami', '#tuna', '#brera')},
  {id: 'W10-2tue-2v-crudo', day: 'Tue 17.11', k: 'mask', sec: 7, bg: G, ink: I,
    media: [p('k0122', {fy: 50})], word: 'CRUDO', size: 400, stretch: 0.82, kicker: 'raw bar', sub: 'every night',
    caption: 'Crudo, every night at our raw bar.', hashtags: tags('#crudo', '#rawbar', '#gamberorosso', '#brera')},
  {id: 'W10-2tue-3v-padella-tavola', day: 'Tue 17.11', k: 'duo', sec: 9, bg: O, ink: G, corners: c('Martedì', '17.11'),
    media: [v('nm0676', 8.5), v('nm0741', 1.2)], labels: ['Padella', 'Tavola'], title: 'tagliolini',
    caption: 'From the pan to the table: tagliolini, calamari e finferli.', hashtags: tags('#pasta', '#tagliolini', '#brera')},

  // ───────── Mercoledì 18.11
  {id: 'W10-3wed-1v-capesante-strips', day: 'Wed 18.11', k: 'strips', sec: 9, bg: G, ink: I, corners: c('Mercoledì', '18.11'),
    media: [v('nm0701', 3.8), v('nm0703', 0.9), v('nm0708', 0.8)], title: 'Capesante', sub: 'aglio nero e funghi',
    caption: 'Capesante, aglio nero e funghi, in three moves.', hashtags: tags('#capesante', '#scallops', '#chef', '#brera')},
  {id: 'W10-3wed-2v-brera', day: 'Wed 18.11', k: 'mask', sec: 9, bg: SA, ink: G,
    media: [v('kf0103', 8.9)], word: 'BRERA', size: 330, stretch: 0.78, kicker: 'mercoledì sera', sub: 'the room is ready',
    caption: 'Wednesday night in Brera: the room is ready.', hashtags: tags('#brera', '#midweek', '#milano')},
  {id: 'W10-3wed-3p-hospitality', day: 'Wed 18.11', k: 'quote', sec: 7, bg: G, ink: I, corners: c('Mercoledì', '18.11'),
    media: p('bo127', {fx: 35}), quote: 'Hospitality is our\nfavourite course', by: 'sea, signora',
    caption: 'Hospitality is our favourite course.', hashtags: tags('#hospitality', '#brera', '#milano')},

  // ───────── Giovedì 19.11
  {id: 'W10-4thu-1p-stasera', day: 'Thu 19.11', k: 'menu', sec: 7, bg: SA, ink: G,
    title: 'Stasera', items: [['Akami', 'culatello e porcini'], ['Polpo', 'zucca, nocciole e scorzanera'], ['Tagliolini', 'calamari e finferli'],
      ['Capesante', 'aglio nero e funghi'], ['Panettone', 'crema calda']],
    media: p('k0119', {fy: 55}),
    caption: 'Stasera: akami, polpo, tagliolini, capesante, and panettone to finish.', hashtags: tags('#menu', '#tonight', '#brera')},
  {id: 'W10-4thu-2v-bar', day: 'Thu 19.11', k: 'mask', sec: 7, bg: O, ink: G,
    media: [p('bo462', {fy: 55})], word: 'BAR', size: 760, stretch: 0.9, kicker: 'giovedì', sub: 'from 19:00',
    cta: {label: 'reserve', color: 'white'},
    caption: 'Giovedì at the bar, from 19:00.', hashtags: tags('#bar', '#cocktails', '#brera')},
  {id: 'W10-4thu-3p-shaken', day: 'Thu 19.11', k: 'grid', sec: 7, bg: G, ink: I, cols: 2, corners: c('Giovedì', 'il bar'),
    media: [p('bo285', {fy: 45}), p('bo291', {fy: 40}), p('bo295', {fy: 45}), p('bo422', {fy: 45})], title: 'Shaken & stirred', sub: 'the bar, every night',
    caption: 'Shaken and stirred, every night at our bar.', hashtags: tags('#cocktails', '#mixology', '#brera')},

  // ───────── Venerdì 20.11
  {id: 'W10-5fri-1v-polpo', day: 'Fri 20.11', k: 'page', sec: 9, bg: O, ink: G, corners: c('Venerdì', '20.11'),
    media: [v('nm0662', 31.8), v('nm0712', 2.0)], title: 'Polpo', sub: 'zucca, nocciole e scorzanera',
    caption: 'Polpo, zucca, nocciole e scorzanera.', hashtags: tags('#polpo', '#octopus', '#brera')},
  {id: 'W10-5fri-2v-fuoco', day: 'Fri 20.11', k: 'mask', sec: 7, bg: G, ink: I,
    media: [p('bo92', {fx: 50, fy: 55})], word: 'FUOCO', size: 360, stretch: 0.8, kicker: 'venerdì', sub: 'our grill is on',
    caption: 'Venerdì: our grill is on.', hashtags: tags('#grill', '#fire', '#brera')},
  {id: 'W10-5fri-3p-compagnia', day: 'Fri 20.11', k: 'grid', sec: 8, bg: SA, ink: G, cols: 3, corners: c('Venerdì', 'gli ospiti'),
    media: [p('p0287'), p('bo365'), p('p0320'), p('bo205', {fx: 45}), p('p0290'), p('bo403'), p('bo233'), p('bo415'), p('bo228')],
    title: 'La compagnia', sub: 'the best thing on the table',
    caption: 'La compagnia: the best thing on the table.', hashtags: tags('#friday', '#friends', '#brera')},

  // ───────── Sabato 21.11
  {id: 'W10-6sat-1v-orari', day: 'Sat 21.11', k: 'hours', sec: 9, bg: G, ink: I,
    media: [v('kf0136', 4.1), v('kf0113', 7.3)], lines: ['12:30—15:30', '19:00—00:00'], title: 'Sabato & domenica',
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Sabato & domenica: 12:30–15:30 and 19:00–00:00.', hashtags: tags('#weekend', '#brera', '#milano')},
  {id: 'W10-6sat-2v-autunno', day: 'Sat 21.11', k: 'mask', sec: 9, bg: SA, ink: G,
    media: [v('kf0093', 4.2)], word: 'AUTUNNO', size: 270, stretch: 0.74, kicker: 'novembre', sub: 'dressed for the season',
    caption: 'Autunno at Sea, Signora: dressed for the season.', hashtags: tags('#autumn', '#decor', '#brera')},
  {id: 'W10-6sat-3v-prima-dopo', day: 'Sat 21.11', k: 'duo', sec: 9, bg: O, ink: G, corners: c('Sabato', '21.11'),
    media: [p('p0213', {fy: 50}), v('nm0741', 4.0)], labels: ['Prima', 'Dopo'], title: 'sabato sera',
    caption: 'Prima e dopo: Saturday night at the table.', hashtags: tags('#saturday', '#dinner', '#brera')},

  // ───────── Domenica 22.11
  {id: 'W10-7sun-1p-panettone', day: 'Sun 22.11', k: 'page', sec: 7, bg: SA, ink: G, corners: c('Domenica', '22.11'),
    media: [p('pan86', {fy: 55})], title: 'Panettone', sub: 'crema calda · the season is open',
    caption: 'Panettone with crema calda: the season is open.', hashtags: tags('#panettone', '#christmas', '#brera')},
  {id: 'W10-7sun-2v-domenica', day: 'Sun 22.11', k: 'mask', sec: 9, bg: O, ink: G,
    media: [v('kf0110', 7.9)], word: 'DOMENICA', size: 230, stretch: 0.72, kicker: 'today', sub: '12:30—15:30 | 19:00—00:00',
    caption: 'Domenica: open 12:30–15:30 and 19:00–00:00.', hashtags: tags('#sunday', '#brera', '#milano')},
  {id: 'W10-7sun-3p-a-table', day: 'Sun 22.11', k: 'quote', sec: 7, bg: SA, ink: G, corners: c('Domenica', '22.11'),
    media: p('bo158', {fy: 45}), quote: 'A table is always\nwaiting for you', by: 'sea, signora',
    caption: 'A table is always waiting for you.', hashtags: tags('#brera', '#milano', '#seeyousoon')},
];
