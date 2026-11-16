import {BRAND, type CreativeSpec, type Media} from './Creative';

// Week 16–22.11 — creative stories in the Sea, Signora identity, v2 (client 16.11: «more varied»). 21 stories, 3 a day,
// 15 different formats, none more than twice a week (full-bleed four times, as the account's own base), never two
// alike in a row, background colour alternating. Material: the new menu cooked on video (folder 1Uv4yte…), Blackout
// 29.10 pro photos, Pixieset, folder 1KgFz8ZB…, team portraits, panettone. Link chips: Tue, Thu, Sat.

const {G, O, SA, I} = BRAND;
const p = (n: string, o: Partial<Media> = {}): Media => ({src: `w10/${n}.jpg`, ...o});
const v = (n: string, at: number, o: Partial<Media> = {}): Media => ({src: `w10/${n}.mp4`, at, ...o});
const c = (day: string, date: string): [string, string, string, string] => ['Sea, Signora', 'Milano', day, date];
const tags = (...t: string[]) => ['#seasignora', ...t];
const N = '#0B0B0B';

export const week10c: CreativeSpec[] = [
  // ───────── Lunedì 16.11
  {id: 'W10-1mon-1v-kitchen-open', day: 'Mon 16.11', k: 'full', sec: 9, bg: N, ink: I,
    media: [v('nm0632', 4.6), v('nm0672', 0.3)], kicker: 'lunedì', title: 'The kitchen is open', sub: '19:00—00:00',
    caption: 'Lunedì: the kitchen is open, 19:00–00:00.', hashtags: tags('#openkitchen', '#monday', '#brera')},
  {id: 'W10-1mon-2p-prenota', day: 'Mon 16.11', k: 'type', sec: 7, bg: O, ink: G, corners: c('Lunedì', '16.11'),
    lines: ['Prenota.', 'Arriva.', 'Resta.'], size: 170, kicker: 'the only rules', sub: 'via fiori chiari, 32 · brera',
    caption: 'The only rules: book, arrive, stay. Via Fiori Chiari 32, Brera.', hashtags: tags('#brera', '#milano', '#dinner')},
  {id: 'W10-1mon-3v-lunedi-prints', day: 'Mon 16.11', k: 'polaroid', sec: 8, bg: SA, ink: G,
    media: [p('p0195', {fy: 50}), p('bo228', {fx: 50}), p('npchefRoberto2', {fy: 35})], notes: ['la porta', 'la sala', 'lo chef'],
    title: 'A Monday in Brera',
    caption: 'A Monday in Brera: the door, the room, the chef.', hashtags: tags('#monday', '#brera', '#milano')},

  // ───────── Martedì 17.11
  {id: 'W10-2tue-1p-akami-anatomy', day: 'Tue 17.11', k: 'anatomy', sec: 7, bg: G, ink: I,
    media: p('bo113', {fx: 50, fy: 55, z: 1.15}), labels: ['akami', 'culatello', 'porcini', 'sea, signora'], title: 'Akami',
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Akami, culatello e porcini.', hashtags: tags('#akami', '#tuna', '#brera')},
  {id: 'W10-2tue-2p-gambero', day: 'Tue 17.11', k: 'full', sec: 7, bg: N, ink: I,
    media: [p('k0122', {fy: 50})], kicker: 'raw bar', title: 'Gambero rosso', sub: 'served raw',
    caption: 'Gambero rosso, served raw at our raw bar.', hashtags: tags('#gamberorosso', '#rawbar', '#brera')},
  {id: 'W10-2tue-3p-rosso-bianco', day: 'Tue 17.11', k: 'thisor', sec: 7, bg: SA, ink: G, corners: c('Martedì', '17.11'),
    media: [p('bo415', {fy: 40}), p('bo433', {fy: 45})], labels: ['Rosso', 'Bianco'], title: 'tonight you choose',
    caption: 'Rosso o bianco: tonight you choose.', hashtags: tags('#wine', '#cocktails', '#brera')},

  // ───────── Mercoledì 18.11
  {id: 'W10-3wed-1v-capesante-strips', day: 'Wed 18.11', k: 'strips', sec: 9, bg: O, ink: G, corners: c('Mercoledì', '18.11'),
    media: [v('nm0701', 3.8), v('nm0703', 0.9), v('nm0708', 0.8)], title: 'Capesante', sub: 'aglio nero e funghi',
    caption: 'Capesante, aglio nero e funghi, in three moves.', hashtags: tags('#capesante', '#scallops', '#chef', '#brera')},
  {id: 'W10-3wed-2p-scontrino', day: 'Wed 18.11', k: 'receipt', sec: 7, bg: G, ink: I,
    items: [['1 x akami', '♥'], ['1 x polpo', '♥'], ['1 x tagliolini', '♥'], ['2 x spritz', '♥♥'], ['1 x panettone', '♥']],
    total: 'una bella serata', footer: 'grazie e a presto',
    caption: 'The receipt of a good night: akami, polpo, tagliolini, two spritz, panettone. Total: una bella serata.',
    hashtags: tags('#dinner', '#brera', '#milano')},
  {id: 'W10-3wed-3v-room-ready', day: 'Wed 18.11', k: 'full', sec: 9, bg: N, ink: I,
    media: [v('kf0103', 8.9), v('kf0136', 4.1)], kicker: 'mercoledì sera', title: 'The room is ready',
    caption: 'Mercoledì sera: the room is ready.', hashtags: tags('#midweek', '#brera', '#milano')},

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
  {id: 'W10-4thu-3p-una-sera', day: 'Thu 19.11', k: 'timeline', sec: 7, bg: G, ink: I, corners: c('Giovedì', 'una sera'),
    steps: [['19:00', 'Aperitivo', p('bo422', {fy: 45})], ['20:00', 'Crudo', p('k0121', {fy: 50})], ['21:00', 'Pasta', p('p0338', {fy: 55})],
      ['23:00', 'Ancora uno', p('bo291', {fy: 40})]],
    title: 'Una sera, in quattro',
    caption: 'A night in four: aperitivo, crudo, pasta, and one more.', hashtags: tags('#tonight', '#dinner', '#brera')},

  // ───────── Venerdì 20.11
  {id: 'W10-5fri-1v-polpo', day: 'Fri 20.11', k: 'page', sec: 9, bg: O, ink: G, corners: c('Venerdì', '20.11'),
    media: [v('nm0662', 31.8), v('nm0712', 2.0)], title: 'Polpo', sub: 'zucca, nocciole e scorzanera',
    caption: 'Polpo, zucca, nocciole e scorzanera.', hashtags: tags('#polpo', '#octopus', '#brera')},
  {id: 'W10-5fri-2v-fuoco', day: 'Fri 20.11', k: 'mask', sec: 7, bg: G, ink: I,
    media: [p('bo92', {fx: 50, fy: 55})], word: 'FUOCO', size: 360, stretch: 0.8, kicker: 'venerdì', sub: 'our grill is on',
    caption: 'Venerdì: our grill is on.', hashtags: tags('#grill', '#fire', '#brera')},
  {id: 'W10-5fri-3p-compagnia', day: 'Fri 20.11', k: 'grid', sec: 8, bg: SA, ink: G, cols: 3, corners: c('Venerdì', 'gli ospiti'),
    media: [p('p0287'), p('bo365'), p('p0320'), p('bo205', {fx: 45}), p('p0290'), p('bo403'), p('bo233'), p('bo127', {fx: 35}), p('bo228')],
    title: 'La compagnia', sub: 'the best thing on the table',
    caption: 'La compagnia: the best thing on the table.', hashtags: tags('#friday', '#friends', '#brera')},

  // ───────── Sabato 21.11
  {id: 'W10-6sat-1v-orari', day: 'Sat 21.11', k: 'hours', sec: 9, bg: G, ink: I,
    media: [v('kf0110', 7.9), v('kf0113', 7.3)], lines: ['12:30—15:30', '19:00—00:00'], title: 'Sabato & domenica',
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Sabato & domenica: 12:30–15:30 and 19:00–00:00.', hashtags: tags('#weekend', '#brera', '#milano')},
  {id: 'W10-6sat-2v-autunno', day: 'Sat 21.11', k: 'full', sec: 9, bg: N, ink: I,
    media: [v('kf0093', 4.2), v('kf0094', 6.3)], kicker: 'novembre', title: 'Dressed for autumn',
    caption: 'Novembre at Sea, Signora: dressed for autumn.', hashtags: tags('#autumn', '#decor', '#brera')},
  {id: 'W10-6sat-3v-dettagli', day: 'Sat 21.11', k: 'polaroid', sec: 8, bg: O, ink: G,
    media: [p('bo158', {fy: 45}), p('pan51', {fy: 50}), p('p0213', {fy: 50})], notes: ["l'acquario", 'il panettone', 'il tavolo'],
    title: 'Sabato, nei dettagli',
    caption: 'Sabato, nei dettagli: the aquarium, the panettone, your table.', hashtags: tags('#details', '#saturday', '#brera')},

  // ───────── Domenica 22.11
  {id: 'W10-7sun-1v-prima-dopo', day: 'Sun 22.11', k: 'duo', sec: 9, bg: SA, ink: G, corners: c('Domenica', '22.11'),
    media: [p('p0347', {fy: 55}), v('nm0741', 4.0)], labels: ['Prima', 'Dopo'], title: 'domenica',
    caption: 'Prima e dopo: a Sunday at the table.', hashtags: tags('#sunday', '#dinner', '#brera')},
  {id: 'W10-7sun-2p-panettone', day: 'Sun 22.11', k: 'page', sec: 7, bg: G, ink: I, corners: c('Domenica', '22.11'),
    media: [p('pan86', {fy: 55})], title: 'Panettone', sub: 'crema calda · the season is open',
    caption: 'Panettone with crema calda: the season is open.', hashtags: tags('#panettone', '#christmas', '#brera')},
  {id: 'W10-7sun-3p-domenica-lenta', day: 'Sun 22.11', k: 'type', sec: 7, bg: SA, ink: G, corners: c('Domenica', '22.11'),
    lines: ['Domenica,', 'lenta'], size: 180, kicker: 'oggi', sub: '12:30—15:30 | 19:00—00:00',
    caption: 'Domenica, lenta. Open today 12:30–15:30 and 19:00–00:00.', hashtags: tags('#sunday', '#brera', '#milano')},
];
