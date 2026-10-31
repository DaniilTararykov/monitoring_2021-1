import React from 'react';
import {Composition} from 'remotion';
import {video} from '../../tokens';
import {BrandSheet} from './BrandSheet';
import {SEQ_S, SPLIT_S, TwoRecipesSeq, TwoRecipesSplit} from './TwoRecipes';
import {RECIPE_CARD_S, RecipeCard} from './RecipeCard';
import {TOMAHAWK} from './Tomahawk';
import {VOCABOLARIO} from './Vocabolario';
import {PosterChip} from './PosterChip';
import {Anniversary, yearDuration} from './Anniversary';
import {CUTS_A, CUTS_B, CUTS_C, CUTS_D} from './anniversaryCuts';
import {EditorReel, editorDuration, type EditorConfig} from './EditorReel';
import {BlackoutReel, DURATION_S, FPS} from './BlackoutReel';
import {StoryVideo, storyFrames} from './Story';
import {stories} from './stories';
import {pack2} from './pack2';
import {pack3} from './pack3';
import {week4} from './week4';
import {week4b} from './week4b';
import type {Story} from './types';

const Story: React.FC<{story: Story; guides?: boolean}> = (p) => <StoryVideo {...p} />;

export const RemotionRoot: React.FC = () => (
  <>
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
    {([['A', CUTS_A], ['B', CUTS_B], ['C', CUTS_C], ['D', CUTS_D]] as const).map(([v, cuts]) => (
      <Composition key={v} id={`Anniversary-${v}`} component={Anniversary} durationInFrames={yearDuration([...cuts], v === 'D' ? 1 : 3.5)} fps={30} width={1080} height={1920}
        defaultProps={{cuts: [...cuts], endS: v === 'D' ? 1 : 3.5}} />
    ))}
    <Composition id="PosterChip" component={PosterChip} durationInFrames={1} fps={30} width={1080} height={1920}
      defaultProps={{src: 'photos/w5/dimsum-special-set.jpg', cta: {label: 'book your table', color: 'orange', y: 417}}} />
    {VOCABOLARIO.map((t) => <Composition key={t.id} id={t.id} component={t.component} durationInFrames={t.frames} fps={30} width={1080} height={1920} />)}
    {TOMAHAWK.map((t) => <Composition key={t.id} id={t.id} component={t.component} durationInFrames={1} fps={30} width={1080} height={1920} />)}
    {[...stories, ...pack2, ...pack3, ...week4, ...week4b].map((s) => (
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
