import { Composition } from "remotion";
import { BEATS } from "./beats";
import { Capitaliano, calculateCapitalianoMetadata } from "./Capitaliano";
import { Voices } from "./Voices/Voices";
import { VOICES_DATA } from "./Voices/data";

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
      {VOICES_DATA.map((data) => (
        <Composition
          key={data.id}
          id={`Voices-${data.id}`}
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
