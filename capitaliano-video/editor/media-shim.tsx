// The web editor previews on phones, where WebCodecs-based @remotion/media
// is not reliable; fall back to plain HTML5 media elements with the same props.
import { Html5Audio, Html5Video } from "remotion";

type VideoProps = {
  src: string;
  name?: string;
  objectFit?: "cover" | "contain" | "fill";
  style?: React.CSSProperties;
};

export const Video: React.FC<VideoProps> = ({
  src,
  name,
  objectFit,
  style,
}) => (
  <Html5Video
    src={src}
    name={name}
    pauseWhenBuffering
    style={{ ...style, objectFit: objectFit ?? "cover" }}
  />
);

export const Audio: React.FC<{ src: string; volume?: number }> = ({
  src,
  volume,
}) => <Html5Audio src={src} volume={volume} />;
