import { Composition } from "remotion";
import { Capitaliano, calculateCapitalianoMetadata } from "./Capitaliano";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Capitaliano"
        component={Capitaliano}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={calculateCapitalianoMetadata}
        defaultProps={{
          videoSrc: "speaker.mp4",
          audioSrc: "speaker-audio.wav",
          captionsSrc: "captions.json",
          cards: [
            {
              text: "Capitaliano",
              fromSec: 0.3,
              durationSec: 2.5,
              variant: "green",
            },
            {
              text: "Тезис из ролика",
              fromSec: 3,
              durationSec: 3,
              variant: "white",
              note: "важно!",
            },
            {
              text: "Миф из ролика",
              fromSec: 6.2,
              durationSec: 3,
              variant: "white",
              strike: true,
            },
          ],
        }}
      />
    </>
  );
};
