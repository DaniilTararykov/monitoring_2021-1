// Writes beats saved by the web editor (a JSON document {beats, savedAt})
// into src/beats.ts. Usage: node scripts/apply-edits.mjs path/to/beats.json
import fs from "fs";

const [file] = process.argv.slice(2);
if (!file) {
  console.error("usage: node scripts/apply-edits.mjs path/to/beats.json");
  process.exit(1);
}
const { beats } = JSON.parse(fs.readFileSync(file, "utf8"));
if (!Array.isArray(beats) || beats.length === 0) {
  console.error("No beats in", file);
  process.exit(1);
}
const sorted = [...beats].sort((a, b) => a.fromSec - b.fromSec);
fs.writeFileSync(
  "src/beats.ts",
  `import type { Beat } from "./Capitaliano/Beats";

// Meaning blocks of the video: timing, layout and on-screen graphic.
// The web editor writes its edits back here.
export const BEATS: Beat[] = ${JSON.stringify(sorted, null, 2)};
`,
);
console.log(`Wrote ${sorted.length} beats to src/beats.ts`);
