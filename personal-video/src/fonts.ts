import { continueRender, delayRender } from "remotion";
import serifCyr from "@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-700-normal.woff2";
import serifLat from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2";
import serifCyrIt from "@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-600-italic.woff2";
import serifLatIt from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-italic.woff2";
import monoCyr from "@fontsource/jetbrains-mono/files/jetbrains-mono-cyrillic-500-normal.woff2";
import monoLat from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2";
import sans7Cyr from "@fontsource/montserrat/files/montserrat-cyrillic-700-normal.woff2";
import sans7Lat from "@fontsource/montserrat/files/montserrat-latin-700-normal.woff2";
import sans8Cyr from "@fontsource/montserrat/files/montserrat-cyrillic-800-normal.woff2";
import sans8Lat from "@fontsource/montserrat/files/montserrat-latin-800-normal.woff2";
import { MONO, SANS, SERIF } from "./theme";

const CYR = "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116";
const LAT = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212";

const faces = [
  new FontFace(SERIF, `url(${serifCyr})`, { weight: "700", unicodeRange: CYR }),
  new FontFace(SERIF, `url(${serifLat})`, { weight: "700", unicodeRange: LAT }),
  new FontFace(SERIF, `url(${serifCyrIt})`, { weight: "600", style: "italic", unicodeRange: CYR }),
  new FontFace(SERIF, `url(${serifLatIt})`, { weight: "600", style: "italic", unicodeRange: LAT }),
  new FontFace(MONO, `url(${monoCyr})`, { weight: "500", unicodeRange: CYR }),
  new FontFace(MONO, `url(${monoLat})`, { weight: "500", unicodeRange: LAT }),
  new FontFace(SANS, `url(${sans7Cyr})`, { weight: "700", unicodeRange: CYR }),
  new FontFace(SANS, `url(${sans7Lat})`, { weight: "700", unicodeRange: LAT }),
  new FontFace(SANS, `url(${sans8Cyr})`, { weight: "800", unicodeRange: CYR }),
  new FontFace(SANS, `url(${sans8Lat})`, { weight: "800", unicodeRange: LAT }),
];

const handle = delayRender("fonts");
Promise.all(faces.map((f) => f.load().then(() => document.fonts.add(f)))).then(() => continueRender(handle));
