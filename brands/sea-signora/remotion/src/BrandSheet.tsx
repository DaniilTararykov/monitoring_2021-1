import React from 'react';
import {AbsoluteFill} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';
import {StoryVideo} from './Story';
import {stories} from './stories';

loadBrandFonts();

// Brand preview sheet: palette, fonts, three on-screen text examples.
// Render frame 150 as a still: npx remotion still BrandSheet ../preview/brand-sheet.png --frame=150
const SW: {key: keyof typeof colors; name: string; note: string}[] = [
  {key: 'night', name: 'Night', note: 'gradient behind text'},
  {key: 'ivory', name: 'Ivory', note: 'all on-screen text'},
  {key: 'orange', name: 'Signora Orange', note: 'link chip · brand 158'},
  {key: 'olive', name: 'Olive', note: 'link chip · brand 5845'},
  {key: 'star', name: 'Star', note: 'review stars · brand 605'},
  {key: 'marble', name: 'Marble Green', note: 'tables · brand 5605'},
];

const ink = '#1D1D1B';
const paper = brandPalette.warmGray1;

const Label: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: fonts.mono, fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', color: ink, borderBottom: `3px solid ${brandPalette.mustard605}`, paddingBottom: 8, marginBottom: 26, width: 'fit-content'}}>
    {children}
  </div>
);

const Example: React.FC<{id: string; title: string}> = ({id, title}) => {
  const s = stories.find((x) => x.id === id)!;
  const k = 0.36;
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      <div style={{width: 1080 * k, height: 1920 * k, overflow: 'hidden', borderRadius: 18, position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.25)'}}>
        <div style={{width: 1080, height: 1920, transform: `scale(${k})`, transformOrigin: 'top left', position: 'absolute'}}>
          <StoryVideo story={s} frozen />
        </div>
      </div>
      <div style={{fontFamily: fonts.mono, fontSize: 18, color: ink, textTransform: 'uppercase', letterSpacing: 1}}>{title}</div>
    </div>
  );
};

export const BrandSheet: React.FC = () => (
  <AbsoluteFill style={{background: paper, padding: 80, flexDirection: 'row', gap: 80}}>
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 56}}>
      <div>
        <div style={{fontFamily: fonts.display, fontSize: 150, lineHeight: 0.9, color: brandPalette.green5605}}>
          Sea,<br />SIGNORA
        </div>
        <div style={{fontFamily: fonts.mono, fontSize: 24, letterSpacing: 3, color: ink, marginTop: 18}}>STORIES BRAND SHEET · MILANO · 9:16 · 1080×1920 · 30 FPS</div>
      </div>

      <div>
        <Label>palette — sampled from story frames</Label>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22}}>
          {SW.map((c) => (
            <div key={c.key} style={{display: 'flex', gap: 16, alignItems: 'center'}}>
              <div style={{width: 96, height: 96, borderRadius: 14, background: colors[c.key], border: '1px solid rgba(0,0,0,0.15)'}} />
              <div style={{fontFamily: fonts.mono, color: ink}}>
                <div style={{fontSize: 22, fontWeight: 700}}>{c.name}</div>
                <div style={{fontSize: 22}}>{colors[c.key]}</div>
                <div style={{fontSize: 15, opacity: 0.7}}>{c.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>fonts — from the brandbook</Label>
        <div style={{display: 'flex', flexDirection: 'column', gap: 22, color: ink}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 26}}>
            <span style={{fontFamily: fonts.display, fontSize: 84, lineHeight: 1}}>THE KIND OF NIGHT</span>
            <span style={{fontFamily: fonts.mono, fontSize: 18}}>SKANAUS · HEADLINES, CAPS</span>
          </div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 26}}>
            <span style={{fontFamily: fonts.mono, fontSize: 38, fontWeight: 500, letterSpacing: 2, whiteSpace: 'nowrap'}}>TEQUILA, MANGO & A SPICY KICK</span>
            <span style={{fontFamily: fonts.mono, fontSize: 18}}>JETBRAINS MONO · SUBS, HOURS</span>
          </div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 26}}>
            <span style={{fontFamily: fonts.serif, fontSize: 48, fontStyle: 'italic'}}>Ristorante di Pesce</span>
            <span style={{fontFamily: fonts.mono, fontSize: 18}}>SPECTRAL · RARE ACCENTS</span>
          </div>
        </div>
      </div>
    </div>

    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Label>on-screen text — 3 examples</Label>
      <div style={{display: 'flex', gap: 34}}>
        <Example id="02-mon-cicatelli" title="dish hero + link chip" />
        <Example id="04-tue-review-rocco" title="review" />
        <Example id="11-thu-dimsum-save-the-date" title="announcement" />
      </div>
    </div>
  </AbsoluteFill>
);
