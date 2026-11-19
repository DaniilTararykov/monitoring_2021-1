import React from 'react';
import {Composition} from 'remotion';
import {video} from '../../tokens';
import {BrandSheet} from './BrandSheet';
import {SEQ_S, SPLIT_S, TwoRecipesSeq, TwoRecipesSplit} from './TwoRecipes';
import {RECIPE_CARD_S, RecipeCard} from './RecipeCard';
import {TOMAHAWK} from './Tomahawk';
import {VOCABOLARIO} from './Vocabolario';
import {PosterChip} from './PosterChip';
import {WEEK6_COMPONENTS} from './Countdown';
import {NEWWEEK_COMPONENTS} from './NewWeek';
import {OneYear, oneYearDuration} from './OneYear';
import {Anniversary, yearDuration} from './Anniversary';
import {CUTS_A, CUTS_B, CUTS_C, CUTS_D, CUTS_INVITE, INVITE_AT} from './anniversaryCuts';
import {EditorReel, editorDuration, type EditorConfig} from './EditorReel';
import {BlackoutReel, DURATION_S, FPS} from './BlackoutReel';
import {StoryVideo, storyFrames} from './Story';
import {stories} from './stories';
import {pack2} from './pack2';
import {pack3} from './pack3';
import {week4} from './week4';
import {week4b} from './week4b';
import {week6c} from './week6c';
import {week7} from './week7';
import {week8} from './week8';
import {week9} from './week9';
import {week9x} from './week9x';
import {CreativeStory, FPS as CR_FPS} from './Creative';
import {week10c} from './week10c';
import {PAROLE, ParolaView} from './Parola';
import {DESIGNS} from './Designs';
import {DESIGNS2} from './Designs2';
import {FRESH} from './Fresh';
import {FRESH2} from './Fresh2';
import {FRESH3} from './Fresh3';
import {FRESH4} from './Fresh4';
import {FRESH5} from './Fresh5';
import {ATMOSFERA, AtmosferaView} from './Atmosfera';
import {DISH_CARDS, DishCardView, ReviewAquarium} from './ReviewStill';
import {FRESH6} from './Fresh6';
import {CUTOUT} from './Cutout';
import {FILM, FILM_V1, FilmView} from './Film';
import {TIPS, TipView} from './OrderThis';
import {POOL} from './Pool';
import {TEN} from './Ten';
import {RECENT} from './Recent';
import {CLASSIC} from './Classic';
import {VillaRecap, VILLA_RECAP_SEC} from './VillaRecap';
import {VillaHands, HANDS_SEC, VillaLetter, LETTER_SEC} from './VillaRecap2';
import {week11designs, week11live, week11words} from './week11';
import {week7x} from './week7x';
import {week7y} from './week7y';
import {week7z} from './week7z';
import {week7t} from './week7t';
import {week7w} from './week7w';
import {Fighter} from './Fighter';
import {Recap, recapFrames, FPS as RC_FPS} from './Recap';
import {BirthdayUno, FPS as UNO_FPS, UNO, unoFrames} from './BirthdayUno';
import type {Story} from './types';

const Story: React.FC<{story: Story; guides?: boolean}> = (p) => <StoryVideo {...p} />;

export const RemotionRoot: React.FC = () => (
  <>
    {week10c.map((s) => <Composition key={s.id} id={s.id} component={CreativeStory} durationInFrames={Math.round(s.sec * CR_FPS)} fps={CR_FPS} width={1080} height={1920} defaultProps={{s}} />)}
    {PAROLE.map((p) => <Composition key={p.id} id={p.id} component={ParolaView} durationInFrames={Math.round(p.sec * 30)} fps={30} width={1080} height={1920} defaultProps={{p}} />)}
    {DESIGNS.map((d) => <Composition key={d.id} id={d.id} component={d.view} durationInFrames={Math.round(d.sec * 30)} fps={30} width={1080} height={1920} />)}
    {[...week11words, ...week11live].map((p) => <Composition key={p.id} id={p.id} component={ParolaView} durationInFrames={Math.round(p.sec * 30)} fps={30} width={1080} height={1920} defaultProps={{p}} />)}
    {week11designs.map((s) => <Composition key={s.id} id={s.id} component={CreativeStory} durationInFrames={Math.round(s.sec * 30)} fps={30} width={1080} height={1920} defaultProps={{s}} />)}
    <Composition id="V-villa-prato-hands" component={VillaHands} durationInFrames={Math.round(HANDS_SEC * 30)} fps={30} width={1080} height={1920} />
    <Composition id="V-villa-prato-letter" component={VillaLetter} durationInFrames={Math.round(LETTER_SEC * 30)} fps={30} width={1080} height={1920} />
    <Composition id="V-villa-prato-recap" component={VillaRecap} durationInFrames={Math.round(VILLA_RECAP_SEC * 30)} fps={30} width={1080} height={1920} />
    {CLASSIC.map((d) => <Composition key={d.id} id={d.id} component={d.view} durationInFrames={Math.round(d.sec * 30)} fps={30} width={1080} height={1920} />)}
    {RECENT.map((d) => <Composition key={d.id} id={d.id} component={d.view} durationInFrames={Math.round(d.sec * 30)} fps={30} width={1080} height={1920} />)}
    {TEN.map((d) => <Composition key={d.id} id={d.id} component={d.view} durationInFrames={Math.round(d.sec * 30)} fps={30} width={1080} height={1920} />)}
    {POOL.map((d) => <Composition key={d.id} id={d.id} component={d.view} durationInFrames={Math.round(d.sec * 30)} fps={30} width={1080} height={1920} />)}
    {TIPS.map((t) => <Composition key={t.id} id={t.id} component={TipView} durationInFrames={210} fps={30} width={1080} height={1920} defaultProps={{t}} />)}
    {[...FILM_V1, ...FILM].map((s) => <Composition key={s.id} id={s.id} component={FilmView} durationInFrames={240} fps={30} width={1080} height={1920} defaultProps={{s}} />)}
    {CUTOUT.map((d) => <Composition key={d.id} id={d.id} component={d.view} durationInFrames={Math.round(d.sec * 30)} fps={30} width={1080} height={1920} />)}
    {FRESH6.map((d) => <Composition key={d.id} id={d.id} component={d.view} durationInFrames={Math.round(d.sec * 30)} fps={30} width={1080} height={1920} />)}
    {DISH_CARDS.map((d) => <Composition key={d.id} id={d.id} component={DishCardView} durationInFrames={150} fps={30} width={1080} height={1920} defaultProps={{d}} />)}
    <Composition id="R-01p-review-aquarium" component={ReviewAquarium} durationInFrames={150} fps={30} width={1080} height={1920} />
    {ATMOSFERA.map((a) => <Composition key={a.id} id={a.id} component={AtmosferaView} durationInFrames={Math.round(a.sec * 30)} fps={30} width={1080} height={1920} defaultProps={{a}} />)}
    {FRESH5.map((d) => <Composition key={d.id} id={d.id} component={d.view} durationInFrames={Math.round(d.sec * 30)} fps={30} width={1080} height={1920} />)}
    {FRESH4.map((d) => <Composition key={d.id} id={d.id} component={d.view} durationInFrames={Math.round(d.sec * 30)} fps={30} width={1080} height={1920} />)}
    {FRESH3.map((d) => <Composition key={d.id} id={d.id} component={d.view} durationInFrames={Math.round(d.sec * 30)} fps={30} width={1080} height={1920} />)}
    {FRESH2.map((d) => <Composition key={d.id} id={d.id} component={d.view} durationInFrames={Math.round(d.sec * 30)} fps={30} width={1080} height={1920} />)}
    {FRESH.map((d) => <Composition key={d.id} id={d.id} component={d.view} durationInFrames={Math.round(d.sec * 30)} fps={30} width={1080} height={1920} />)}
    {DESIGNS2.map((d) => <Composition key={d.id} id={d.id} component={d.view} durationInFrames={Math.round(d.sec * 30)} fps={30} width={1080} height={1920} />)}
    <Composition id="Recap-A" component={Recap} durationInFrames={recapFrames()} fps={RC_FPS} width={1080} height={1920} defaultProps={{variant: 'A' as const}} />
    <Composition id="Recap-B" component={Recap} durationInFrames={recapFrames()} fps={RC_FPS} width={1080} height={1920} defaultProps={{variant: 'B' as const}} />
    <Composition id="BirthdayUno" component={BirthdayUno} durationInFrames={unoFrames(UNO)} fps={UNO_FPS} width={1080} height={1920} />
    <Composition id="BrandSheet" component={BrandSheet} durationInFrames={300} fps={video.fps} width={2600} height={1500} />
    {['a', 'b', 'c', 'd'].map((v) => (
      <Composition key={v} id={v === 'a' ? 'BlackoutReel' : `BlackoutReel-${v}`} component={BlackoutReel} durationInFrames={Math.round(DURATION_S * FPS)} fps={FPS} width={1080} height={1920} defaultProps={{withAudio: true, variant: v}} />
    ))}
    <Composition
      id="EditorReel"
      component={EditorReel}
      fps={30}
      width={1080}
      height={1920}
      durationInFrames={552}
      defaultProps={{config: {name: 'demo', mode: 'split', title: 'Two recipes of one evening', titleFont: 'display', music: 'ref-art-of-hands', beatsPerCut: 6, grade: true,
        shots: [{a: {clip: 'IMG_0633', start: 3.9, fy: 73}, b: {clip: 'IMG_0763', start: 2.6, fy: 56}}]} as EditorConfig}}
      calculateMetadata={({props}) => ({durationInFrames: editorDuration(props.config)})}
    />
    <Composition id="TwoRecipes-split1" component={TwoRecipesSplit} durationInFrames={Math.round(SPLIT_S * 30)} fps={30} width={1080} height={1920} defaultProps={{variant: 's1'}} />
    <Composition id="TwoRecipes-split2" component={TwoRecipesSplit} durationInFrames={Math.round(SPLIT_S * 30)} fps={30} width={1080} height={1920} defaultProps={{variant: 's2'}} />
    <Composition id="TwoRecipes-sequence" component={TwoRecipesSeq} durationInFrames={Math.round(SEQ_S * 30)} fps={30} width={1080} height={1920} />
    <Composition id="TwoRecipes-card" component={RecipeCard} durationInFrames={Math.round(RECIPE_CARD_S * 30)} fps={30} width={1080} height={1920} />
    <Composition id="OneYear" component={OneYear} durationInFrames={oneYearDuration(CUTS_D.slice(1, 36))} fps={30} width={1080} height={1920}
      defaultProps={{cuts: CUTS_D.slice(1, 36), opening: {clip: 'e58', start: 5.73, n: 40}, finale: {clip: 'e58', start: 7.5, n: 90}, audio: {src: 'music/brera-house.mp3', from: 0.77}}} />
    <Composition id="Anniversary-invite" component={Anniversary} durationInFrames={yearDuration(CUTS_INVITE, 0.6)} fps={30} width={1080} height={1920}
      defaultProps={{cuts: CUTS_INVITE, endS: 0.6, fast: true, grade: true, chalk: 'swap', finale: INVITE_AT, clipAudio: 'toast', audio: {src: 'music/brera-house.mp3', from: 0.77}}} />
    <Composition id="Anniversary-invite-clean" component={Anniversary} durationInFrames={yearDuration(CUTS_INVITE, 0.6)} fps={30} width={1080} height={1920}
      defaultProps={{cuts: CUTS_INVITE, endS: 0.6, fast: true, grade: true, clean: true, finale: INVITE_AT, clipAudio: 'toast', audio: {src: 'music/brera-house.mp3', from: 0.77}}} />
    {(['ivory', 'orange', 'cycle', 'swap'] as const).map((tone) => (
      <Composition key={tone} id={`Anniversary-chalk-${tone}`} component={Anniversary} durationInFrames={yearDuration(CUTS_D, 1)} fps={30} width={1080} height={1920}
        defaultProps={{cuts: CUTS_D, endS: 1, fast: true, grade: true, chalk: tone, audio: {src: 'music/brera-house.mp3', from: 0.77}}} />
    ))}
    {([['A', CUTS_A], ['B', CUTS_B], ['C', CUTS_C], ['D', CUTS_D]] as const).map(([v, cuts]) => (
      <Composition key={v} id={`Anniversary-${v}`} component={Anniversary} durationInFrames={yearDuration([...cuts], v === 'D' ? 1 : 3.5)} fps={30} width={1080} height={1920}
        defaultProps={v === 'D' ? {cuts: [...cuts], endS: 1, fast: true, grade: true, audio: {src: 'music/brera-house.mp3', from: 0.77}} : {cuts: [...cuts], endS: 3.5}} />
    ))}
    <Composition id="PosterChip" component={PosterChip} durationInFrames={1} fps={30} width={1080} height={1920}
      defaultProps={{src: 'photos/w5/dimsum-special-set.jpg', cta: {label: 'book your table', color: 'orange', y: 417}}} />
    <Composition id="SW7Z-06p-choose-your-fighter" component={Fighter} durationInFrames={1} fps={30} width={1080} height={1920} />
    {NEWWEEK_COMPONENTS.map((t) => <Composition key={t.id} id={t.id} component={t.component} durationInFrames={t.frames} fps={30} width={1080} height={1920} />)}
    {WEEK6_COMPONENTS.map((t) => <Composition key={t.id} id={t.id} component={t.component} durationInFrames={t.frames} fps={30} width={1080} height={1920} />)}
    {VOCABOLARIO.map((t) => <Composition key={t.id} id={t.id} component={t.component} durationInFrames={t.frames} fps={30} width={1080} height={1920} />)}
    {TOMAHAWK.map((t) => <Composition key={t.id} id={t.id} component={t.component} durationInFrames={1} fps={30} width={1080} height={1920} />)}
    {[...stories, ...pack2, ...pack3, ...week4, ...week4b, ...week6c, ...week7, ...week7x, ...week7y, ...week7z, ...week7t, ...week7w, ...week8, ...week9, ...week9x].map((s) => (
      <Composition
        key={s.id}
        id={`S${s.id}`}
        component={Story}
        durationInFrames={storyFrames(s)}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={{story: s, guides: false}}
      />
    ))}
  </>
);
