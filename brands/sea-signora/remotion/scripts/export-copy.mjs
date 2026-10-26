// Export on-screen texts + post captions for every story to ../stories-week.md
// usage: node --experimental-strip-types scripts/export-copy.mjs [out.md] [src module] [export name]
//   e.g. scripts/export-copy.mjs ../stories-week4.md src/week4.ts week4
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const stories = (await import(path.join(root, process.argv[3] ?? 'src/stories.ts')))[process.argv[4] ?? 'stories'];
const txt = (b) =>
  b.t === 'headline' ? b.text.replace(/\n/g, ' ').toUpperCase()
  : b.t === 'wordmark' ? (b.text ?? 'Sea, Signora')
  : b.t === 'sub' ? b.text.replace(/\n/g, ' ').toUpperCase()
  : b.t === 'note' ? b.text
  : b.t === 'review' ? `«${b.text.replace(/\n+/g, ' ')}»${b.author ? ' — ' + b.author : ''}`
  : b.t === 'list' ? b.items.map((i) => '— ' + i.toUpperCase()).join(' / ')
  : b.t === 'hours' ? '[часы работы]'
  : b.t === 'giant' || b.t === 'kicker' ? b.text.toUpperCase()
  : b.t === 'stars' ? '★★★★★' : null;
const lines = ['# Sea, Signora — сторис на неделю', ''];
let day = '';
for (const s of stories) {
  if (s.day !== day) { day = s.day; lines.push(`## ${day}`, ''); }
  const frames = s.chat ? 30 + s.chat.length * 66 + 75 : s.scenes.reduce((a, x) => a + x.frames, 0);
  lines.push(`### ${s.id} · ${s.rubric} · ${(frames / 30).toFixed(1)} с`);
  const screen = [];
  if (s.overlay) screen.push(s.overlay.blocks.map(txt).filter(Boolean).join(' / '));
  s.scenes.forEach((sc, i) => sc.overlay && screen.push(`кадр ${i + 1}: ` + sc.overlay.blocks.map(txt).filter(Boolean).join(' / ')));
  if (s.chat) screen.push('Your problem / Our solution: ' + s.chat.map((c) => c.problem).join(' · '));
  lines.push(`- **На экране:** ${screen.join(' | ')}`);
  if (s.cta) lines.push(`- **Стикер-ссылка:** «${s.cta.label}» (поставь настоящий link-стикер на место плашки)`);
  lines.push(`- **Фото:** ${s.chat ? s.chat.map((c) => c.solution).join(', ') : s.scenes.map((x) => x.src).join(', ')} · музыка: ${s.music}`);
  lines.push('', '```', `${s.caption}`, '', s.hashtags.join(' '), '```');
  lines.push(`- **Варианты призыва:** ${s.ctaVariants.join(' · ')}`, '');
}
const out = process.argv[2] ?? path.join(root, '..', 'stories-week.md');
fs.writeFileSync(out, lines.join('\n'));
console.log('wrote', out);
