import type {Block, Overlay, Scene, Story} from './types';

// White truffle from Alba (client 09.11): three dishes on the menu + the client's truffle photos.
// Dish names exactly as the client sent them.

const S = 30;
const ph = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w8/${name}.jpg`, frames: Math.round(sec * S), ...o});
const top = (...blocks: Block[]): Overlay => ({position: 'top', anim: 'static', blocks});
const bottom = (...blocks: Block[]): Overlay => ({position: 'bottom', anim: 'static', blocks});
const H = (text: string, size?: number): Block => ({t: 'headline', text, size});
const sub = (text: string): Block => ({t: 'sub', text});
const kick = (text: string): Block => ({t: 'kicker', text, color: 'orange'});
const silent = 'none';
const tags = ['#seasignora', '#tartufobianco', '#whitetruffle', '#alba', '#brera'];
const DISHES = [
  'tartare di tonno con tartufo bianco d\'alba',
  'tagliolini con gamberi viola di gallipoli\n  e tartufo bianco d\'alba',
  'scampi, royale di foie gras\n  e tartufo bianco d\'alba',
];
const CAPTION = "White truffle from Alba is on the menu:\n— Tartare di tonno con tartufo bianco d'Alba\n— Tagliolini con gamberi viola di Gallipoli e tartufo bianco d'Alba\n— Scampi, royale di foie gras e tartufo bianco d'Alba";

export const week7w: Story[] = [
  {
    id: 'W7W-01p-on-the-menu', day: 'pool', rubric: 'Белый трюфель · список блюд', music: silent,
    scenes: [ph('truf_top', 8, {fy: 50, shift: 360})],
    overlay: top(kick("tartufo bianco d'alba"), H('On the menu'), {t: 'rule'}, {t: 'list', items: DISHES}),
    cta: {label: 'book a table', color: 'orange'},
    caption: CAPTION, hashtags: tags, ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W7W-02p-white-gold', day: 'pool', rubric: 'Белый трюфель · герой', music: silent,
    scenes: [ph('truf_dark', 7, {fx: 60, fy: 55})],
    overlay: top(kick('the season is here'), H('White gold', 110), sub("tartufo bianco d'alba")),
    caption: "The season is here: tartufo bianco d'Alba, shaved over three dishes on our menu.", hashtags: tags, ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W7W-03p-from-alba', day: 'pool', rubric: 'Белый трюфель · откуда', music: silent,
    scenes: [ph('truf_lace', 7, {fy: 45})],
    overlay: bottom(H('From Alba\nto Brera', 86), sub("white truffle season at sea, signora")),
    caption: "From Alba to Brera: white truffle season at Sea, Signora.", hashtags: tags, ctaVariants: ['book a table', 'reserve'],
  },
];
