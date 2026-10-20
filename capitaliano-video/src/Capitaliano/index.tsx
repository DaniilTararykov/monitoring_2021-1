import { Video } from "@remotion/media";
import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Img,
  Interactive,
  staticFile,
} from "remotion";
import { COLORS, FRAME, INTER_TIGHT, TIGHT_TRACKING } from "./brand";
import { Captions } from "./Captions";
import { Card, Cards } from "./Cards";
import { Waveform } from "./Waveform";

export type CapitalianoProps = {
  videoSrc: string;
  audioSrc: string;
  captionsSrc: string;
  cards: Card[];
};

export const calculateCapitalianoMetadata: CalculateMetadataFunction<
  CapitalianoProps
> = async ({ props }) => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(staticFile(props.videoSrc)),
  });
  const durationInSeconds = await input.computeDuration();
  return { durationInFrames: Math.ceil(durationInSeconds * 30) };
};

export const Capitaliano: React.FC<CapitalianoProps> = ({
  videoSrc,
  audioSrc,
  captionsSrc,
  cards,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      {/* Bottom half: speaker video */}
      <Video
        name="Speaker"
        src={staticFile(videoSrc)}
        objectFit="cover"
        style={{
          position: "absolute",
          top: FRAME.videoTop,
          left: 0,
          width: FRAME.width,
          height: FRAME.height - FRAME.videoTop,
        }}
      />

      {/* Fade-blur over the seam between graphic zone and video */}
      <div
        style={{
          position: "absolute",
          top: FRAME.videoTop,
          left: 0,
          width: FRAME.width,
          height: FRAME.seamHeight,
          backdropFilter: "blur(28px)",
          maskImage:
            "linear-gradient(180deg, black 0%, black 35%, transparent 100%)",
          background:
            "linear-gradient(180deg, rgb(255, 252, 249) 0%, rgba(255, 252, 249, 0.6) 40%, rgba(255, 252, 249, 0) 100%)",
        }}
      />

      {/* Top half: graphic zone on cream with a dot grid */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: FRAME.width,
          height: FRAME.videoTop,
          backgroundColor: COLORS.cream,
          backgroundImage: `radial-gradient(${COLORS.dot} 2.5px, transparent 2.5px)`,
          backgroundSize: "36px 36px",
          backgroundPosition: "18px 18px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Img
            name="Logo"
            src={staticFile("logo.svg")}
            style={{ height: 72 }}
          />
          <Interactive.Div
            name="Handle"
            style={{
              padding: "14px 28px",
              borderRadius: 999,
              backgroundColor: "#FFFFFF",
              boxShadow: "0 10px 30px rgba(27, 94, 52, 0.14)",
              color: "#1B5E34",
              fontFamily: INTER_TIGHT,
              fontWeight: 500,
              fontSize: 40,
              letterSpacing: TIGHT_TRACKING,
            }}
          >
            @capitaliano.info
          </Interactive.Div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 220,
            left: 80,
            right: 80,
            height: 420,
          }}
        >
          <Cards cards={cards} />
        </div>

        <div style={{ position: "absolute", top: 650, left: 80, right: 80 }}>
          <Waveform audioSrc={audioSrc} />
        </div>
      </div>

      <Captions captionsSrc={captionsSrc} />
    </AbsoluteFill>
  );
};
