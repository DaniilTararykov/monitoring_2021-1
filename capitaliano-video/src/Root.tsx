import { Composition } from "remotion";
import { BEATS } from "./beats";
import { Capitaliano, calculateCapitalianoMetadata } from "./Capitaliano";
import { Voices } from "./Voices/Voices";
import M1 from "./Voices/data/M1.json";
import Q1 from "./Voices/data/Q1.json";
import S1 from "./Voices/data/S1.json";
import type { VoicesData } from "./Voices/types";

// Student interview series; timelines come from student-interviews/edit/build.py.
const VOICES: { id: string; data: VoicesData }[] = [
  { id: "Voices-S1", data: S1 as VoicesData },
  { id: "Voices-Q1", data: Q1 as VoicesData },
  { id: "Voices-M1", data: M1 as VoicesData },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Capitaliano"
        component={Capitaliano}
        durationInFrames={3763}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={calculateCapitalianoMetadata}
        defaultProps={{
          videoSrc: "speaker.mp4",
          audioSrc: "speaker-audio.wav",
          captionsSrc: "captions.json",
          beats: BEATS,
        }}
      />
      {VOICES.map(({ id, data }) => (
        <Composition
          key={id}
          id={id}
          component={Voices}
          durationInFrames={data.durationInFrames}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ data, mediaBase: "interviews" }}
        />
      ))}
    </>
  );
};
