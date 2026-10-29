import React from "react";
import { AbsoluteFill, Audio, Easing, Freeze, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import data from "./grwm.json";
import { MONO, SAFE, SANS } from "./theme";

const FPS = 30;
const BEAT = 60 / data.bpm;
const SRC = staticFile(data.source.file);
const SW = data.source.w;
const SH = data.source.h;

type Product = { step: number; label: string; brand: string; name: string; src: number; crop: number[] };
type Seg = { src: number; beats: number; speed?: number; focus: number; caption?: string; product?: string };
type Timed = Seg & { at: number; dur: number; from: number; frames: number; idx: number };

const products = data.products as Record<string, Product>;
const productList = Object.entries(products).sort((a, b) => a[1].step - b[1].step);

export const timeline: Timed[] = (() => {
  let beat = 0;
  return (data.segments as Seg[]).map((s, idx) => {
    const at = beat * BEAT;
    beat += s.beats;
    const from = Math.round(at * FPS);
    return { ...s, at, dur: s.beats * BEAT, from, frames: Math.round(beat * BEAT * FPS) - from, idx };
  });
})();
export const GRWM_FRAMES = Math.round(timeline.reduce((n, s) => n + s.dur, 0) * FPS) + 18;

const fr = (s: number) => Math.round(s * FPS);

/** A rectangular window onto the 1920x1080 source: (cx, cy) centre, cw crop width; aspect follows the box. */
const Window: React.FC<{
  src: number;
  speed?: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  cw: number;
  style?: React.CSSProperties;
  /** Hold the first frame (product "photo"). */
  still?: boolean;
}> = ({
  src,
  speed = 1,
  w,
  h,
  cx,
  cy,
  cw,
  style,
  still,
}) => {
  const ch = (cw * h) / w;
  const x = Math.max(0, Math.min(SW - cw, cx - cw / 2));
  const y = Math.max(0, Math.min(SH - ch, cy - ch / 2));
  const k = w / cw;
  const video = (
    <OffthreadVideo
      src={SRC}
      trimBefore={fr(src)}
      playbackRate={speed}
      muted
      style={{ position: "absolute", width: SW * k, height: SH * k, left: -x * k, top: -y * k, maxWidth: "none" }}
    />
  );
  return (
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden", ...style }}>
      {still ? <Freeze frame={0}>{video}</Freeze> : video}
    </div>
  );
};

/** Plays each segment of the timeline inside the given window geometry. */
const Cuts: React.FC<{ render: (s: Timed) => React.ReactNode }> = ({ render }) => (
  <>
    {timeline.map((s) => (
      <Sequence key={s.idx} from={s.from} durationInFrames={s.frames} layout="none">
        {render(s)}
      </Sequence>
    ))}
  </>
);

const SoundTrack: React.FC<{ clicks?: boolean }> = ({ clicks }) => (
  <>
    <Audio src={staticFile("music_grwm.wav")} volume={0.85} />
    {timeline
      .filter((s) => s.product)
      .map((s) => (
        <Sequence key={s.idx} from={s.from} layout="none">
          <Audio src={staticFile(`sfx/${clicks ? "tick" : "pop"}.wav`)} volume={clicks ? 0.9 : 0.5} />
        </Sequence>
      ))}
  </>
);

const useSegment = () => {
  const frame = useCurrentFrame();
  const seg = [...timeline].reverse().find((s) => frame >= s.from) ?? timeline[0];
  return { frame, seg };
};

/** Last product shown up to now (it stays on screen until the next one). */
const useCurrentProduct = () => {
  const frame = useCurrentFrame();
  const seg = [...timeline].reverse().find((s) => s.product && frame >= s.from);
  return seg ? { key: seg.product!, p: products[seg.product!], since: frame - seg.from, seg } : null;
};

const stepsDone = (frame: number) => timeline.filter((s) => s.product && frame >= s.from).length;

/** Text overlays live until the next one of their kind, at least their own shot, at most `max` seconds. */
const holdSpan = (list: Timed[], s: Timed, max: number) => {
  const next = list.find((c) => c.from > s.from);
  const end = Math.min(next ? next.from : GRWM_FRAMES, s.from + fr(max));
  return Math.max(end, s.from + s.frames) - s.from;
};
const captionSegs = timeline.filter((s) => s.caption);
const productSegs = timeline.filter((s) => s.product);

const useHeld = (list: Timed[], max: number) => {
  const frame = useCurrentFrame();
  const s = [...list].reverse().find((c) => frame >= c.from && frame < c.from + holdSpan(list, c, max));
  return s ? { s, local: frame - s.from, span: holdSpan(list, s, max) } : null;
};

/* ------------------------------------------------------------------ */
/* 1 · macOS desktop                                                   */
/* ------------------------------------------------------------------ */

const MAC = { bg: "#EDEBE6", window: "#FBFAF8", bar: "#ECEAE6", text: "#1D1D1F", sub: "#6E6E73", accent: "#0A84FF" };

const TrafficLights: React.FC = () => (
  <div style={{ display: "flex", gap: 12 }}>
    {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
      <span key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c, display: "inline-block" }} />
    ))}
  </div>
);

const MacWindow: React.FC<{ title: string; x: number; y: number; w: number; children: React.ReactNode; scale?: number; opacity?: number }> = ({
  title,
  x,
  y,
  w,
  children,
  scale = 1,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      background: MAC.window,
      borderRadius: 22,
      overflow: "hidden",
      boxShadow: "0 30px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.08)",
      transform: `scale(${scale})`,
      opacity,
    }}
  >
    <div style={{ height: 56, background: MAC.bar, display: "flex", alignItems: "center", padding: "0 20px", position: "relative" }}>
      <TrafficLights />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 24,
          color: MAC.sub,
        }}
      >
        {title}
      </div>
    </div>
    {children}
  </div>
);

const MenuBar: React.FC = () => {
  const frame = useCurrentFrame();
  const mins = 47 + Math.floor((frame / GRWM_FRAMES) * 23);
  const h = mins >= 60 ? 7 : 6;
  const m = String(mins % 60).padStart(2, "0");
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        padding: "0 34px",
        gap: 34,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 24,
        color: MAC.text,
      }}
    >
      <span style={{ fontWeight: 800 }}>QuickTime Player</span>
      <span>File</span>
      <span>Edit</span>
      <span>View</span>
      <span style={{ marginLeft: "auto" }}>Wed {h}:{m} AM</span>
    </div>
  );
};

const Cursor: React.FC<{ x: number; y: number; pressed: boolean }> = ({ x, y, pressed }) => (
  <svg width={44} height={56} viewBox="0 0 22 28" style={{ position: "absolute", left: x, top: y, transform: `scale(${pressed ? 0.85 : 1})` }}>
    <path d="M2 2 L2 22 L7 17 L10.5 25 L14 23.5 L10.5 15.8 L17.5 15.8 Z" fill="#111" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

const Notification: React.FC<{ app: string; title: string; body: string; dur: number }> = ({ app, title, body, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = spring({ frame, fps, config: { damping: 16 } });
  const out = interpolate(frame, [dur - 8, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top + 10,
        right: SAFE.right - 60,
        width: 560,
        transform: `translateX(${(1 - inP) * 640 + out * 640}px)`,
        background: "rgba(250,250,250,0.92)",
        borderRadius: 26,
        padding: "20px 24px",
        boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
        display: "flex",
        gap: 18,
        alignItems: "center",
      }}
    >
      <div style={{ width: 64, height: 64, borderRadius: 16, background: app === "Calendar" ? "#FF3B30" : MAC.accent, flexShrink: 0 }} />
      <div style={{ fontFamily: SANS, color: MAC.text }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: MAC.sub }}>{app}</div>
        <div style={{ fontSize: 28, fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: 24, fontWeight: 600 }}>{body}</div>
      </div>
    </div>
  );
};

export const GRWMMac: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cur = useCurrentProduct();
  const done = stepsDone(frame);
  // Cursor travels to the checkbox of the step that was just ticked.
  const ticked = cur ? cur.p.step - 1 : 0;
  const checkY = 1090 + ticked * 76;
  const travel = cur ? interpolate(cur.since, [0, 10], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }) : 0;
  const cx = interpolate(travel, [0, 1], [880, 655]);
  const cy = interpolate(travel, [0, 1], [820, checkY]);
  const pressed = cur ? cur.since >= 10 && cur.since < 14 : false;
  const qlScale = cur ? spring({ frame: cur.since, fps, config: { damping: 14 } }) : 0;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #F4D9C8 0%, #E7E3F3 45%, #CFE0EC 100%)" }}>
      <MenuBar />
      <MacWindow title="grwm — gym edition.mov" x={40} y={300} w={1000}>
        <div style={{ position: "relative", width: 1000, height: 562, background: "#000" }}>
          <Cuts render={(s) => <Window src={s.src} speed={s.speed} w={1000} h={562} cx={960} cy={540} cw={1920} />} />
        </div>
      </MacWindow>

      {cur ? (
        <MacWindow title={`${cur.key}.png`} x={40} y={960} w={540} scale={qlScale}>
          <Window src={cur.p.src} w={540} h={540} cx={cur.p.crop[0]} cy={cur.p.crop[1]} cw={cur.p.crop[2]} still />
          <div style={{ padding: "14px 20px 18px", fontFamily: MONO, fontSize: 22, color: MAC.sub }}>
            0{cur.p.step} · {cur.p.label}
          </div>
        </MacWindow>
      ) : null}

      <MacWindow title="Notes" x={600} y={960} w={440}>
        <div style={{ padding: "22px 28px 26px", fontFamily: SANS, color: MAC.text }}>
          <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 14 }}>gym morning</div>
          {productList.map(([k, p], i) => {
            const on = i < done;
            return (
              <div key={k} style={{ display: "flex", alignItems: "flex-start", gap: 16, height: 76 }}>
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    border: `3px solid ${on ? MAC.accent : "#C7C7CC"}`,
                    background: on ? MAC.accent : "transparent",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <div>
                  <div style={{ fontSize: 26, fontWeight: 700, textDecoration: on ? "line-through" : "none", color: on ? MAC.sub : MAC.text }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: 19, fontWeight: 600, color: MAC.sub }}>{p.brand}</div>
                </div>
              </div>
            );
          })}
        </div>
      </MacWindow>

      {/* decorative dock (outside the safe zone) */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 190,
          right: 190,
          height: 110,
          borderRadius: 32,
          background: "rgba(255,255,255,0.45)",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        {["#0A84FF", "#FF9F0A", "#30D158", "#FF375F", "#BF5AF2", "#64D2FF"].map((c) => (
          <span key={c} style={{ width: 76, height: 76, borderRadius: 20, background: c, opacity: 0.85 }} />
        ))}
      </div>

      {timeline
        .filter((s) => s.caption)
        .map((s, i, all) => (
          <Sequence key={s.idx} from={s.from} durationInFrames={i === all.length - 1 ? GRWM_FRAMES - s.from : holdSpan(captionSegs, s, 3)} layout="none">
            <Notification
              app={i === all.length - 1 ? "Calendar" : "Messages"}
              title={i === all.length - 1 ? "Gym" : "me"}
              body={s.caption!}
              dur={i === all.length - 1 ? GRWM_FRAMES - s.from + 30 : holdSpan(captionSegs, s, 3)}
            />
          </Sequence>
        ))}
      <Cursor x={cx} y={cy} pressed={pressed} />
      <SoundTrack clicks />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2 · Product cards                                                   */
/* ------------------------------------------------------------------ */

const VCROP = (SH * 1080) / 1920; // source width that fills a 9:16 frame

export const GRWMCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { seg } = useSegment();
  const local = frame - seg.from;
  const p = seg.product ? products[seg.product] : null;
  const card = p ? spring({ frame: local, fps, config: { damping: 15, mass: 0.8 } }) : 0;
  const intro = frame < timeline[0].frames;

  return (
    <AbsoluteFill style={{ background: "#0E0E0E" }}>
      <Cuts render={(s) => <Window src={s.src} speed={s.speed} w={1080} h={1920} cx={s.focus} cy={540} cw={VCROP} />} />

      {p ? (
        <>
          <AbsoluteFill style={{ background: `rgba(246,243,238,${0.86 * card})` }} />
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 330,
              width: 780,
              background: "#fff",
              padding: 20,
              boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
              transform: `translateY(${(1 - card) * 120}px) rotate(${-2 * card}deg) scale(${0.85 + 0.15 * card})`,
              opacity: card,
            }}
          >
            <Window src={p.src} w={740} h={740} cx={p.crop[0]} cy={p.crop[1]} cw={p.crop[2]} still />
          </div>
          <div style={{ position: "absolute", left: 150, right: SAFE.right, top: 1150, opacity: card, color: "#141414" }}>
            <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: "0.08em" }}>
              0{p.step}/0{productList.length} — {p.label}
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 92, letterSpacing: "-0.05em", lineHeight: 1, marginTop: 12 }}>
              {p.brand.toLowerCase()}
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, marginTop: 10, color: "#555" }}>{p.name.toLowerCase()}</div>
          </div>
        </>
      ) : null}

      {intro ? (
        <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: SAFE.top + 40, color: "#fff", textShadow: "0 2px 14px rgba(0,0,0,0.35)" }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 112, letterSpacing: "-0.06em", lineHeight: 0.95 }}>
            get ready
            <br />
            with me
          </div>
          <div style={{ fontFamily: MONO, fontSize: 32, marginTop: 18, letterSpacing: "0.1em" }}>[ gym edition ]</div>
        </div>
      ) : null}

      {seg.caption && !intro && !p ? (
        <div
          style={{
            position: "absolute",
            left: SAFE.left,
            right: SAFE.right,
            top: 1400,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 50,
            letterSpacing: "-0.02em",
            color: "#fff",
            textShadow: "0 2px 12px rgba(0,0,0,0.45)",
            opacity: interpolate(local, [0, 4], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {seg.caption}
        </div>
      ) : null}
      {intro && timeline[0].caption ? (
        <div
          style={{
            position: "absolute",
            left: SAFE.left,
            right: SAFE.right,
            top: 1400,
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 36,
            color: "#fff",
            textShadow: "0 2px 12px rgba(0,0,0,0.45)",
          }}
        >
          {timeline[0].caption}
        </div>
      ) : null}
      <SoundTrack />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3 · Split screen + HUD                                              */
/* ------------------------------------------------------------------ */

const HUD_TOP = 250 + 608;

export const GRWMSplit: React.FC = () => {
  const frame = useCurrentFrame();
  const { seg } = useSegment();
  const local = frame - seg.from;
  // real-time stopwatch from the source clock
  const srcT = seg.src + (local / FPS) * (seg.speed ?? 1);
  const mm = String(Math.floor(srcT / 60)).padStart(2, "0");
  const ss = String(Math.floor(srcT % 60)).padStart(2, "0");
  const cs = String(Math.floor((srcT % 1) * 100)).padStart(2, "0");
  const progress = Math.min(1, srcT / 406);
  const done = stepsDone(frame);
  const blink = Math.floor(frame / 15) % 2 === 0;
  const cap = useHeld(captionSegs, 3);
  const tag = useHeld(productSegs, 3.5);

  return (
    <AbsoluteFill style={{ background: "#0B0B0B" }}>
      <div style={{ position: "absolute", top: 150, left: 48, right: 48, display: "flex", fontFamily: MONO, fontSize: 30, color: "#F2F2F2", letterSpacing: "0.06em" }}>
        <span>GRWM / GYM EDITION</span>
        <span style={{ marginLeft: "auto", color: "#E8FF47" }}>{done}/{productList.length}</span>
      </div>
      {/* top: the full frame */}
      <div style={{ position: "absolute", top: 250, left: 0 }}>
        <Cuts render={(s) => <Window src={s.src} speed={s.speed} w={1080} h={608} cx={960} cy={540} cw={1920} />} />
      </div>
      {/* bottom: synced detail */}
      <div style={{ position: "absolute", top: HUD_TOP + 130, left: 0 }}>
        <Cuts
          render={(s) => {
            const pr = s.product ? products[s.product] : null;
            return pr ? (
              <Window src={s.src} speed={s.speed} w={1080} h={512} cx={pr.crop[0]} cy={pr.crop[1]} cw={pr.crop[2] * 1.5} />
            ) : (
              <Window src={s.src} speed={s.speed} w={1080} h={512} cx={s.focus} cy={430} cw={860} />
            );
          }}
        />
      </div>

      {/* HUD */}
      <div
        style={{
          position: "absolute",
          top: HUD_TOP,
          left: 0,
          right: 0,
          height: 130,
          padding: "16px 48px",
          fontFamily: MONO,
          color: "#F2F2F2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30 }}>
          <span style={{ width: 16, height: 16, borderRadius: 8, background: "#FF3B30", opacity: blink ? 1 : 0.25 }} />
          <span>
            {mm}:{ss}.{cs}
          </span>
          <span style={{ marginLeft: "auto", color: "#9A9A9A" }}>real time → 24s</span>
        </div>
        <div style={{ position: "relative", height: 6, background: "#333", borderRadius: 3 }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${progress * 100}%`, background: "#E8FF47", borderRadius: 3 }} />
          {productList.map(([k, pr], i) => (
            <span
              key={k}
              style={{
                position: "absolute",
                left: `${(pr.src / 406) * 100}%`,
                top: -7,
                width: 20,
                height: 20,
                marginLeft: -10,
                borderRadius: 10,
                background: i < done ? "#E8FF47" : "#0B0B0B",
                border: "3px solid #E8FF47",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#9A9A9A", gap: 24 }}>
          {productList.map(([k, pr], i) => (
            <span key={k} style={{ color: i < done ? "#E8FF47" : "#6A6A6A" }}>
              0{pr.step} {pr.label}
            </span>
          ))}
        </div>
      </div>

      {/* labels (held so they can be read) */}
      {tag ? (
        <div
          style={{
            position: "absolute",
            left: 40,
            top: HUD_TOP + 130 + 512 - 120,
            background: "#E8FF47",
            color: "#0B0B0B",
            fontFamily: MONO,
            padding: "12px 20px",
            fontSize: 28,
            maxWidth: 900,
            clipPath: `inset(0 ${100 - Math.min(100, tag.local * 8)}% 0 0)`,
            opacity: interpolate(tag.local, [tag.span - 6, tag.span], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {products[tag.s.product!].brand} — {products[tag.s.product!].name}
        </div>
      ) : null}
      {cap ? (
        <div
          style={{
            position: "absolute",
            left: 32,
            top: 268,
            fontFamily: MONO,
            fontSize: 36,
            color: "#fff",
            background: "rgba(11,11,11,0.55)",
            padding: "10px 18px",
            opacity: interpolate(cap.local, [cap.span - 6, cap.span], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {"> "}
          {cap.s.caption!.slice(0, Math.floor(cap.local / 0.8))}
          <span style={{ opacity: blink ? 1 : 0 }}>_</span>
        </div>
      ) : null}
      <SoundTrack clicks />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 4 · Viewfinder scan (Split's sibling)                               */
/* ------------------------------------------------------------------ */

const NEON = "#E8FF47";

const Brackets: React.FC<{ x: number; y: number; w: number; h: number; len?: number; color?: string; thick?: number }> = ({
  x,
  y,
  w,
  h,
  len = 60,
  color = "#fff",
  thick = 5,
}) => {
  const corner = (l: number, t: number, edges: React.CSSProperties) => (
    <div style={{ position: "absolute", left: l, top: t, width: len, height: len, borderColor: color, borderStyle: "solid", borderWidth: 0, ...edges }} />
  );
  return (
    <>
      {corner(x, y, { borderTopWidth: thick, borderLeftWidth: thick })}
      {corner(x + w - len, y, { borderTopWidth: thick, borderRightWidth: thick })}
      {corner(x, y + h - len, { borderBottomWidth: thick, borderLeftWidth: thick })}
      {corner(x + w - len, y + h - len, { borderBottomWidth: thick, borderRightWidth: thick })}
    </>
  );
};

export const GRWMScan: React.FC = () => {
  const frame = useCurrentFrame();
  const { seg } = useSegment();
  const local = frame - seg.from;
  const srcT = seg.src + (local / FPS) * (seg.speed ?? 1);
  const tc = `${String(Math.floor(srcT / 60)).padStart(2, "0")}:${String(Math.floor(srcT % 60)).padStart(2, "0")}:${String(Math.floor((srcT % 1) * 30)).padStart(2, "0")}`;
  const blink = Math.floor(frame / 15) % 2 === 0;
  const done = stepsDone(frame);
  const cap = useHeld(captionSegs, 3);
  const p = seg.product ? products[seg.product] : null;

  // product scan: brackets close in, scan line sweeps, label wipes on
  const BOX = 860;
  const bx = (1080 - BOX) / 2;
  const by = 520;
  const close = p ? interpolate(local, [3, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 0;
  const pad = interpolate(close, [0, 1], [90, 0]);
  const sweep = p ? interpolate(local, [8, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const flash = p ? interpolate(local, [0, 3], [0.9, 0], { extrapolateRight: "clamp" }) : 0;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Cuts render={(s) => <Window src={s.src} speed={s.speed} w={1080} h={1920} cx={s.focus} cy={540} cw={VCROP} />} />

      {p ? (
        <>
          <AbsoluteFill style={{ background: `rgba(0,0,0,${0.62 * close})` }} />
          <div style={{ position: "absolute", left: bx, top: by, opacity: close, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
            <Window src={p.src} w={BOX} h={BOX} cx={p.crop[0]} cy={p.crop[1]} cw={p.crop[2]} still />
            <div style={{ position: "absolute", left: 0, right: 0, top: sweep * BOX, height: 4, background: NEON, opacity: sweep < 1 ? 0.9 : 0, boxShadow: `0 0 18px ${NEON}` }} />
          </div>
          <Brackets x={bx - pad} y={by - pad} w={BOX + pad * 2} h={BOX + pad * 2} len={80} color={NEON} thick={6} />
          <div
            style={{
              position: "absolute",
              left: bx,
              top: by + BOX + 26,
              maxWidth: BOX,
              fontFamily: MONO,
              color: "#0B0B0B",
              background: NEON,
              padding: "12px 20px",
              fontSize: 28,
              clipPath: `inset(0 ${100 - Math.min(100, Math.max(0, local - 10) * 7)}% 0 0)`,
            }}
          >
            OBJECT DETECTED · 0{p.step} {p.label.toUpperCase()}
            <div style={{ fontSize: 30, marginTop: 6 }}>
              {p.brand} — {p.name}
            </div>
          </div>
          <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
        </>
      ) : null}

      {/* viewfinder HUD */}
      <Brackets x={56} y={262} w={968} h={1220} len={70} color="rgba(255,255,255,0.85)" thick={4} />
      <div style={{ position: "absolute", top: 290, left: 90, right: 90, display: "flex", fontFamily: MONO, fontSize: 30, color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 18, height: 18, borderRadius: 9, background: "#FF3B30", opacity: blink ? 1 : 0.25 }} />
          REC {tc}
        </span>
        <span style={{ marginLeft: "auto", color: NEON }}>
          {String(done).padStart(2, "0")}/0{productList.length}
        </span>
      </div>
      <div style={{ position: "absolute", top: 340, left: 90, fontFamily: MONO, fontSize: 24, color: "rgba(255,255,255,0.8)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
        GRWM / GYM EDITION
      </div>

      {cap ? (
        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            top: 410,
            fontFamily: MONO,
            fontSize: 38,
            color: "#fff",
            textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            opacity: interpolate(cap.local, [cap.span - 6, cap.span], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {"> "}
          {cap.s.caption!.slice(0, Math.floor(cap.local / 0.8))}
          <span style={{ opacity: blink ? 1 : 0 }}>_</span>
        </div>
      ) : null}

      {/* step progress */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 1420, height: 4, background: "rgba(255,255,255,0.3)" }}>
        <div style={{ height: 4, width: `${(frame / GRWM_FRAMES) * 100}%`, background: NEON }} />
        {productSegs.map((s, i) => (
          <span
            key={s.idx}
            style={{
              position: "absolute",
              left: `${(s.from / GRWM_FRAMES) * 100}%`,
              top: -8,
              width: 20,
              height: 20,
              marginLeft: -10,
              borderRadius: 10,
              background: i < done ? NEON : "rgba(0,0,0,0.6)",
              border: `3px solid ${NEON}`,
            }}
          />
        ))}
      </div>
      <SoundTrack clicks />
    </AbsoluteFill>
  );
};
