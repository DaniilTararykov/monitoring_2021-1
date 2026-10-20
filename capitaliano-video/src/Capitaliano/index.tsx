import { Video } from "@remotion/media";
import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Img,
  interpolate,
  Interactive,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  COLORS,
  FRAME,
  INTER_TIGHT,
  SAFE,
  SLOTS,
  TELEGRAM_BLUE,
  TIGHT_TRACKING,
} from "./brand";
import { Beat, Beats, cameraAt, VIDEO_BOX_HEIGHT } from "./Beats";
import { Captions } from "./Captions";
import { Waveform } from "./Waveform";

export type CapitalianoProps = {
  videoSrc: string;
  audioSrc: string;
  captionsSrc: string;
  // How many px of the 9:16 speaker video to crop off the top.
  videoOffsetY: number;
  beats: Beat[];
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

const TelegramIcon: React.FC = () => (
  <svg width={44} height={44} viewBox="0 0 24 24">
    <circle cx={12} cy={12} r={12} fill={TELEGRAM_BLUE} />
    <path
      d="M5.4 11.8l11.2-4.3c.5-.2 1 .1.8.9l-1.9 8.9c-.1.6-.5.8-1 .5l-2.9-2.1-1.4 1.3c-.2.2-.3.3-.6.3l.2-2.9 5.4-4.9c.2-.2 0-.3-.4-.1l-6.6 4.2-2.9-.9c-.6-.2-.6-.6.1-.9z"
      fill="#FFFFFF"
    />
  </svg>
);

export const Capitaliano: React.FC<CapitalianoProps> = ({
  videoSrc,
  audioSrc,
  captionsSrc,
  videoOffsetY,
  beats,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const camera = cameraAt(beats, frame / fps);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      {/* Bottom half: speaker video with slow alternating camera moves */}
      <div
        style={{
          position: "absolute",
          top: FRAME.videoTop,
          left: 0,
          width: FRAME.width,
          height: VIDEO_BOX_HEIGHT,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 45%",
            scale: camera.scale,
            translate: `${camera.x}px 0px`,
          }}
        >
          <Video
            name="Speaker"
            src={staticFile(videoSrc)}
            objectFit="cover"
            style={{
              position: "absolute",
              top: -videoOffsetY,
              left: 0,
              width: FRAME.width,
              height: FRAME.width * (16 / 9),
            }}
          />
        </div>
      </div>

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
      />

      {/* Header: fades in only */}
      <div
        style={{
          position: "absolute",
          top: SLOTS.header.top,
          height: SLOTS.header.height,
          left: SAFE.left,
          right: SAFE.right,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: interpolate(frame, [0, 0.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Img name="Logo" src={staticFile("logo.png")} style={{ height: 78 }} />
        <Interactive.Div
          name="Handle"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 26px 10px 12px",
            borderRadius: 999,
            backgroundColor: "#FFFFFF",
            boxShadow: "0 10px 30px rgba(27, 94, 52, 0.12)",
            color: "#1B5E34",
            fontFamily: INTER_TIGHT,
            fontWeight: 500,
            fontSize: 38,
            letterSpacing: TIGHT_TRACKING,
          }}
        >
          <TelegramIcon />
          @capitaliano.info
        </Interactive.Div>
      </div>

      <div
        style={{
          position: "absolute",
          top: SLOTS.equalizer.top,
          height: SLOTS.equalizer.height,
          left: SAFE.left,
          right: SAFE.right,
          opacity: interpolate(frame, [0, 0.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Waveform audioSrc={audioSrc} />
      </div>

      <Beats beats={beats} />
      <Captions captionsSrc={captionsSrc} beats={beats} />
    </AbsoluteFill>
  );
};
