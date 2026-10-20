import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Capitaliano style guide tokens.
export const COLORS = {
  cream: "rgb(255, 252, 249)",
  dot: "rgba(27, 94, 52, 0.14)",
  green: "rgb(47, 141, 79)",
  darkGreen: "#1B5E34",
  darkGray: "#1E1E1E",
  red: "rgb(220, 38, 38)",
  white: "#FFFFFF",
};

// Fonts are bundled in public/fonts (SIL OFL) so renders work offline.
const LATIN_RANGE =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const CYRILLIC_RANGE = "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116";

const loadSubsets = (family: string, file: string, weight: string) => {
  for (const [subset, unicodeRange] of [
    ["latin", LATIN_RANGE],
    ["cyrillic", CYRILLIC_RANGE],
  ]) {
    loadFont({
      family,
      url: staticFile(`fonts/${file}-${subset}-${weight}-normal.woff2`),
      weight,
      unicodeRange,
    });
  }
};

export const INTER_TIGHT = "Inter Tight";
for (const weight of ["400", "500", "700"]) {
  loadSubsets(INTER_TIGHT, "inter-tight", weight);
}

// Red calligraphic cursive for notes, strike-throughs and emotions.
export const CURSIVE = "Caveat";
loadSubsets(CURSIVE, "caveat", "700");

// 9:16 frame skeleton, laid out inside the Instagram Reels safe zone:
// 250px top, 420px bottom, 70px left, 55px right (193px right below y=1110).
export const FRAME = {
  width: 1080,
  height: 1920,
  videoTop: 960,
  seamHeight: 200,
};

export const SAFE = {
  left: 70,
  right: 55,
};

// Vertical slots of the cream graphic zone.
export const SLOTS = {
  header: { top: 260, height: 80 },
  equalizer: { top: 370, height: 80 },
  // Graphics usually live in slot A with captions in slot B; a beat can swap them.
  a: { top: 480, height: 290 },
  b: { top: 790, height: 160 },
};

export const TELEGRAM_BLUE = "#2AABEE";

export const TIGHT_TRACKING = "-0.03em";
