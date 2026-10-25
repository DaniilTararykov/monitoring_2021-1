// Render Sea, Signora stories.
//   node scripts/render-all.mjs                 -> all stories to out/*.mp4
//   node scripts/render-all.mjs 02 14           -> only ids starting with these prefixes
//   node scripts/render-all.mjs --frames [ids]  -> QA contact frames with safe-zone guides to out/qa/
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const browserExecutable =
  process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const args = process.argv.slice(2);
const qa = args.includes('--frames');
const filters = args.filter((a) => !a.startsWith('--'));
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'out');
fs.mkdirSync(path.join(out, 'qa'), {recursive: true});

const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts')});

const ids = fs
  .readFileSync(path.join(root, 'src/stories.ts'), 'utf8')
  .match(/id: '([^']+)'/g)
  .map((m) => m.slice(5, -1))
  .filter((id) => !filters.length || filters.some((f) => id.startsWith(f)));

for (const id of ids) {
  const inputProps = {};
  const comp = await selectComposition({serveUrl, id: `S${id}`, inputProps, browserExecutable});
  if (qa) {
    const d = comp.durationInFrames;
    const picks = [...new Set([20, Math.round(d * 0.35), Math.round(d * 0.65), d - 15])];
    for (const f of picks) {
      await renderStill({
        serveUrl, composition: {...comp, props: {...comp.props, guides: true}},
        frame: f, output: path.join(out, 'qa', `${id}_${String(f).padStart(3, '0')}.jpg`),
        imageFormat: 'jpeg', scale: 0.3, browserExecutable,
      });
    }
    console.log('qa', id);
  } else {
    await renderMedia({
      serveUrl, composition: comp, codec: 'h264', crf: 18, audioCodec: 'aac',
      outputLocation: path.join(out, `${id}.mp4`), browserExecutable, concurrency: 4,
    });
    console.log('rendered', id, (comp.durationInFrames / comp.fps).toFixed(1) + 's');
  }
}
