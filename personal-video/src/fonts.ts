import { continueRender, delayRender } from "remotion";
import serifCyrIt from "@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-600-italic.woff2";
import serifLatIt from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-italic.woff2";
import sans6Cyr from "@fontsource/montserrat/files/montserrat-cyrillic-600-normal.woff2";
import sans6Lat from "@fontsource/montserrat/files/montserrat-latin-600-normal.woff2";
import sans7Cyr from "@fontsource/montserrat/files/montserrat-cyrillic-700-normal.woff2";
import sans7Lat from "@fontsource/montserrat/files/montserrat-latin-700-normal.woff2";
import sans8Cyr from "@fontsource/montserrat/files/montserrat-cyrillic-800-normal.woff2";
import sans8Lat from "@fontsource/montserrat/files/montserrat-latin-800-normal.woff2";
import { SANS, SERIF } from "./theme";

const CYR = "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116";
const LAT = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212";

const faces = [
  new FontFace(SERIF, `url(${serifCyrIt})`, { weight: "600", style: "italic", unicodeRange: CYR }),
  new FontFace(SERIF, `url(${serifLatIt})`, { weight: "600", style: "italic", unicodeRange: LAT }),
  new FontFace(SANS, `url(${sans6Cyr})`, { weight: "600", unicodeRange: CYR }),
  new FontFace(SANS, `url(${sans6Lat})`, { weight: "600", unicodeRange: LAT }),
  new FontFace(SANS, `url(${sans7Cyr})`, { weight: "700", unicodeRange: CYR }),
  new FontFace(SANS, `url(${sans7Lat})`, { weight: "700", unicodeRange: LAT }),
  new FontFace(SANS, `url(${sans8Cyr})`, { weight: "800", unicodeRange: CYR }),
  new FontFace(SANS, `url(${sans8Lat})`, { weight: "800", unicodeRange: LAT }),
];

const handle = delayRender("fonts");
Promise.all(faces.map((f) => f.load().then(() => document.fonts.add(f)))).then(() => continueRender(handle));
