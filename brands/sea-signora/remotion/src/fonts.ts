import {continueRender, delayRender, staticFile} from 'remotion';
import {fontFiles} from '../../tokens';

let loaded = false;

// Loads brand fonts from public/fonts once per tab and blocks rendering until ready.
export const loadBrandFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('brand fonts');
  Promise.all(
    fontFiles.map((f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)})`, {
        weight: f.weight,
        style: f.style,
      });
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
