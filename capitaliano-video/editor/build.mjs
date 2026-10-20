// Bundles the web editor (Remotion Player + beat editor) into dist/editor.js.
import { build } from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [path.join(here, "main.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["safari16", "chrome110"],
  outfile: path.join(here, "dist", "editor.js"),
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  alias: { "@remotion/media": path.join(here, "media-shim.tsx") },
  logLevel: "info",
});
