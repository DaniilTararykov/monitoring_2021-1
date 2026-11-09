import type {Block, Overlay, Scene, Story} from './types';

// Week 09–15.11 — the team invites to the birthday (client 09.11: «other variants with the team», Shooting 4).
// Replacements for Tue «See you Thursday»: no dishes (the birthday has its own menu), the people instead.
// No names on screen: who is who on the photos is not confirmed.

const S = 30;
const ph = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w8/${name}.jpg`, frames: Math.round(sec * S), ...o});
const top = (...blocks: Block[]): Overlay => ({position: 'top', anim: 'static', blocks});
const bottom = (...blocks: Block[]): Overlay => ({position: 'bottom', anim: 'static', blocks});
const H = (text: string, size?: number): Block => ({t: 'headline', text, size});
const sub = (text: string): Block => ({t: 'sub', text});
const kick = (text: string): Block => ({t: 'kicker', text, color: 'orange'});
const silent = 'none';
const tags = ['#seasignora', '#birthday', '#oneyear', '#brera'];
const team = (id: string, photo: string, o: Partial<Scene>, overlay: Overlay, caption: string, cta?: boolean): Story => ({
  id, day: 'Tue 10.11', rubric: 'ДР · команда приглашает', music: silent, scenes: [ph(photo, 7, o)], overlay,
  ...(cta ? {cta: {label: 'reserve', color: 'orange' as const, y: 380}} : {}), caption, hashtags: tags, ctaVariants: ['reserve', 'book a table'],
});

export const week7t: Story[] = [
  team('W7T-01p-a-glass', 't130', {fy: 35}, bottom(kick('thursday · 12.11'), H("We'll save you\na glass", 70)),
    "See you Thursday, we'll save you a glass. 12 November, one year of Sea, Signora."),
  team('W7T-02p-ready', 't145', {fy: 40}, bottom(kick('12.11 · one year'), H("We're ready.\nAre you?", 76)),
    "We're ready. Are you? 12 November, one year of Sea, Signora."),
  team('W7T-03p-the-team', 't122', {fy: 40}, bottom(H('See you\nThursday', 80), sub('from all of us · 12.11')),
    'See you Thursday, from all of us. 12 November, one year of Sea, Signora.'),
  team('W7T-04p-shaking', 't133', {fy: 35}, bottom(kick('thursday · 12.11'), H('Shaking things up\nfor our birthday', 64)),
    'Shaking things up for our birthday. Welcome drinks from 19:00, 12 November.'),
  team('W7T-05p-table-waiting', 't137', {fy: 35}, ({position: 'top', y: 1180, anim: 'static', blocks: [H('Your table\nis waiting', 76), sub('thursday 12.11 · from 19:00')]}),
    'Your table is waiting: Thursday 12 November, from 19:00.', true),
  team('W7T-06p-knives-out', 't142', {fy: 45}, top(kick('12.11 · one year'), H('Knives out\nfor the tuna show', 64), sub('thursday · 19:30')),
    'Knives out for the Tuna Show, Thursday 12 November at 19:30.'),
  team('W7T-07p-dress-code', 't150', {fy: 35}, bottom(kick('thursday · 12.11'), H('Dress code:\nhungry', 80)),
    'Dress code for Thursday: hungry. 12 November, one year of Sea, Signora.'),
];
