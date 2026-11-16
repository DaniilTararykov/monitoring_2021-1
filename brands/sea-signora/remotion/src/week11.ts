import {BRAND, type CreativeSpec, type Media} from './Creative';
import type {Parola} from './Parola';

// Extra stories from the content the client sent on 16.11: the photographer's lifestyle shoot (folder 1ZA_9bXd…:
// wine, oysters, burrata, king crab, pasta, guests sharing, the dog), the new-menu table (IMG_0720), panettone dipped in
// crema with amarene (IMG_0770), the raw bar on ice (IMG_0102), the room (IMG_0109), the kitchen and the room (IMG_2665,
// IMG_2690). Photos already used in earlier stories (ss_*) are skipped. Two kinds, both already liked by the client:
// Vocabolario entries (ParolaView) and the designed layouts (CreativeStory). Not tied to a day: a pool to slot in.

const {G, O, SA, I} = BRAND;
const tags = (...t: string[]) => ['#seasignora', ...t];
const pv = (n: string, at: number, o: object = {}) => ({src: `w11/${n}.mp4`, at, ...o});
const pp = (n: string, o: object = {}) => ({src: `w11/${n}.jpg`, ...o});
const W = (id: string, bg: 'white' | 'green' | 'orange', shape: 'arch' | 'circle' | 'pill' | 'rect' | 'oval', word: string, read: string, pos: string,
  def: string, m: {src: string}, caption: string, hashtags: string[]): Parola =>
  ({k: 'word', id, day: 'pool', sec: 7, bg, shape, word, read, pos, def, m, caption, hashtags});

export const week11words: Parola[] = [
  W('X-01p-ostrica', 'white', 'circle', 'Ostrica', 'o·strì·ca', 'noun', 'with caviar and a red prawn on top. why not.',
    pp('f97', {fy: 50}), 'Ostrica: with caviar and a red prawn on top. Why not.', tags('#oysters', '#caviar', '#vocabolario')),
  W('X-02p-burrata', 'green', 'arch', 'Burrata', 'bur·rà·ta', 'noun', 'with red prawn and bottarga',
    pp('f44', {fy: 55}), 'Burrata with red prawn and bottarga.', tags('#burrata', '#redprawn', '#vocabolario')),
  W('X-03p-granchio', 'orange', 'pill', 'Granchio', 'gràn·chio', 'noun', 'granchio reale. worth the mess.',
    pp('f115', {fy: 50}), 'Granchio reale: worth the mess.', tags('#kingcrab', '#seafood', '#vocabolario')),
  W('X-04p-condividere', 'white', 'rect', 'Condividere', 'con·di·vì·de·re', 'verb', 'the only rule at our table',
    pp('f76', {fx: 45}), 'Condividere: the only rule at our table.', tags('#sharing', '#friends', '#vocabolario')),
  W('X-05p-cane', 'green', 'circle', 'Cane', 'cà·ne', 'noun', "we're pet friendly. obviously.",
    pp('f92', {fx: 40, fy: 45}), "Cane: we're pet friendly. Obviously.", tags('#petfriendly', '#dogsofmilano', '#vocabolario')),
  W('X-06v-inzuppare', 'orange', 'oval', 'Inzuppare', 'in·zup·pà·re', 'verb', 'panettone, crema, amarene. dip without shame.',
    pv('v0770', 0.2, {fy: 55}), 'Inzuppare: panettone, crema and amarene. Dip without shame.', tags('#panettone', '#dessert', '#vocabolario')),
  W('X-07p-risata', 'white', 'arch', 'Risata', 'ri·sà·ta', 'noun', 'the best side dish',
    pp('f79', {fx: 40, fy: 40}), 'Risata: the best side dish.', tags('#friends', '#dinner', '#vocabolario')),
  W('X-08p-calice', 'green', 'pill', 'Calice', 'cà·li·ce', 'noun', 'hold it by the stem, like a regular',
    pp('f10', {fy: 45}), 'Calice: hold it by the stem, like a regular.', tags('#wine', '#vino', '#vocabolario')),
  W('X-09p-fusillone', 'orange', 'circle', 'Fusillone', 'fu·sil·ló·ne', 'noun', 'ai frutti di mare. the sea, in a spiral.',
    pp('f112', {fy: 50}), 'Fusillone ai frutti di mare: the sea, in a spiral.', tags('#pasta', '#fusillone', '#vocabolario')),
  W('X-10p-vino', 'white', 'oval', 'Vino', 'vì·no', 'noun', 'chosen together, poured slowly',
    pp('f7', {fy: 45}), 'Vino: chosen together, poured slowly.', tags('#wine', '#vino', '#vocabolario')),
];

export const week11live: Parola[] = [
  {k: 'live', id: 'X-11v-room', day: 'pool', sec: 10, m: [pv('v0109', 7.3), pv('v0109', 20.0)], title: 'Every table\nhas a story tonight',
    caption: 'Every table has a story tonight.', hashtags: tags('#fullhouse', '#brera', '#milano')},
  {k: 'live', id: 'X-12v-kitchen-room', day: 'pool', sec: 10, m: [pv('2665', 2.5), pv('2690', 8.9)], title: 'The kitchen cooks,\nthe room talks',
    caption: 'The kitchen cooks, the room talks.', hashtags: tags('#openkitchen', '#brera', '#milano'), kicker: 'open kitchen'},
  {k: 'live', id: 'X-13v-on-ice', day: 'pool', sec: 8, m: [pv('v0102', 0.2, {rate: 0.8})], title: "Today's catch,\non ice",
    caption: "Today's catch, on ice at our raw bar.", hashtags: tags('#rawbar', '#seafood', '#brera'), kicker: 'raw bar'},
];

const p = (n: string, o: Partial<Media> = {}): Media => ({src: `w11/${n}.jpg`, ...o});
export const week11designs: CreativeSpec[] = [
  {id: 'X-14p-nuovo-menu', day: 'pool', k: 'full', sec: 7, bg: '#0B0B0B', ink: I, media: [p('k0720', {fy: 55})],
    kicker: 'il nuovo menu', title: 'Four new reasons', sub: 'akami · tagliolini · polpo · capesante', cta: {label: 'book a table', color: 'orange', y: 1380},
    caption: 'Il nuovo menu, four new reasons to come back: akami, tagliolini, polpo, capesante.', hashtags: tags('#newmenu', '#brera', '#milano')},
  {id: 'X-15v-a-tavola', day: 'pool', k: 'polaroid', sec: 8, bg: O, ink: G,
    media: [p('f73', {fx: 40}), p('f80', {fy: 40}), p('f86', {fy: 40})], notes: ['il brindisi', 'la risata', 'il bis'], title: 'Una sera a tavola',
    caption: 'One evening at the table: the toast, the laugh, the second helping.', hashtags: tags('#friends', '#dinner', '#brera')},
  {id: 'X-16p-crudo-cotto', day: 'pool', k: 'thisor', sec: 7, bg: G, ink: I,
    media: [p('f23', {fy: 50}), p('f88', {fy: 50})], labels: ['Crudo', 'Cotto'], title: "tonight's dilemma",
    caption: "Tonight's dilemma: crudo or cotto. Or both.", hashtags: tags('#crudo', '#seafood', '#brera')},
  {id: 'X-17v-tavola', day: 'pool', k: 'grid', sec: 7, bg: SA, ink: G, cols: 2,
    media: [p('f50', {fy: 50}), p('f54', {fy: 50}), p('f62', {fx: 50}), p('f49', {fx: 50})], title: 'Tavola piena', sub: 'order for the table',
    caption: 'Tavola piena: order for the table, share everything.', hashtags: tags('#sharing', '#seafood', '#brera')},
  {id: 'X-18p-cotoletta', day: 'pool', k: 'page', sec: 7, bg: G, ink: I, corners: ['Sea, Signora', 'Milano', 'la cucina', 'milanese'],
    media: [p('f66', {fy: 50})], title: 'Cotoletta', sub: 'crisp outside, milano inside',
    caption: 'Cotoletta: crisp outside, Milano inside.', hashtags: tags('#cotoletta', '#milanese', '#brera')},
];
