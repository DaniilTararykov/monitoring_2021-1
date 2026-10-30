import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "./fonts";
import { MONO, SANS, SERIF } from "./theme";

/* Instagram carousels from the Milan event photos. Slides are 1080x1350 (4:5). */

export const W = 1080;
export const H = 1350;

const AQUA = "#73C6C7";
const CREAM = "#F1ECE4";
const INK = "#111111";
const RED = "#E0352B";

type PhotoKey = "p1_blur" | "p2_portrait" | "p3_elevator" | "p4_close";
const SIZE: Record<PhotoKey, [number, number]> = {
  p1_blur: [2056, 2576],
  p2_portrait: [2056, 2576],
  p3_elevator: [1928, 2576],
  p4_close: [1901, 2542],
};

/** Shows the region of a photo centred on (cx, cy) with width cw (natural px); aspect follows the box. */
const Photo: React.FC<{
  k: PhotoKey;
  w: number;
  h: number;
  cx?: number;
  cy?: number;
  cw?: number;
  filter?: string;
  style?: React.CSSProperties;
}> = ({ k, w, h, cx, cy, cw, filter, style }) => {
  const [iw, ih] = SIZE[k];
  // default: cover the box
  const coverW = Math.min(iw, (ih * w) / h);
  const cropW = cw ?? coverW;
  const cropH = (cropW * h) / w;
  const x = Math.max(0, Math.min(iw - cropW, (cx ?? iw / 2) - cropW / 2));
  const y = Math.max(0, Math.min(ih - cropH, (cy ?? ih / 2) - cropH / 2));
  const s = w / cropW;
  return (
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden", ...style }}>
      <Img
        src={staticFile(`photos/${k}.jpg`)}
        style={{ position: "absolute", left: -x * s, top: -y * s, width: iw * s, height: ih * s, maxWidth: "none", filter }}
      />
    </div>
  );
};

const Grain: React.FC<{ opacity?: number; seed?: number }> = ({ opacity = 0.08, seed = 1 }) => (
  <Img
    src={staticFile(`grain/g${(seed % 8) + 1}.png`)}
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "overlay", opacity }}
  />
);

const Mono: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", fontFamily: MONO, fontSize: 24, letterSpacing: "0.08em", ...style }}>{children}</div>
);

const WARM = "sepia(0.14) contrast(1.05) saturate(0.95)";

/* ------------------------------------------------------------------ */
/* 1 · future memories — editorial                                     */
/* ------------------------------------------------------------------ */

const C1Cover: React.FC = () => (
  <AbsoluteFill style={{ background: INK }}>
    <Photo k="p1_blur" w={W} h={H} filter={WARM} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
    <Mono style={{ top: 56, left: 60, color: "#fff" }}>MILANO — 15/18.10</Mono>
    <Mono style={{ top: 56, right: 60, color: "#fff" }}>01/06</Mono>
    <div style={{ position: "absolute", left: 56, bottom: 120, color: "#fff", fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 168, lineHeight: 0.86 }}>
      future
      <br />
      memories
    </div>
    <Mono style={{ left: 62, bottom: 70, color: "#fff" }}>a night at nss edicola</Mono>
    <Grain />
  </AbsoluteFill>
);

const C1Full: React.FC<{ k: PhotoKey; n: string; label: string; quote?: string; cy?: number }> = ({ k, n, label, quote, cy }) => (
  <AbsoluteFill style={{ background: INK }}>
    <Photo k={k} w={W} h={H} cy={cy} filter={WARM} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.5) 100%)" }} />
    {quote ? (
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 130, color: "#fff", fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 76, lineHeight: 1 }}>
        {quote}
      </div>
    ) : null}
    <Mono style={{ left: 60, bottom: 64, color: "#fff" }}>no. {n} — {label}</Mono>
    <Mono style={{ right: 60, bottom: 64, color: "#fff" }}>{n}/06</Mono>
    <Grain seed={Number(n)} />
  </AbsoluteFill>
);

const C1Details: React.FC = () => (
  <AbsoluteFill style={{ background: CREAM }}>
    <Photo k="p2_portrait" w={460} h={640} cx={1190} cy={1590} cw={520} filter={WARM} style={{ position: "absolute", left: 60, top: 150 }} />
    <Photo k="p1_blur" w={460} h={640} cx={1310} cy={1840} cw={620} filter={WARM} style={{ position: "absolute", right: 60, top: 330 }} />
    <Mono style={{ left: 60, top: 810, color: INK }}>fig. a — silver rose</Mono>
    <Mono style={{ right: 60, top: 990, color: INK }}>fig. b — rings, in motion</Mono>
    <div style={{ position: "absolute", left: 60, bottom: 110, fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 92, color: INK, lineHeight: 0.95 }}>
      the details
    </div>
    <Mono style={{ left: 62, bottom: 64, color: INK }}>no. 03</Mono>
    <Mono style={{ right: 60, bottom: 64, color: INK }}>03/06</Mono>
  </AbsoluteFill>
);

const C1Index: React.FC = () => (
  <AbsoluteFill style={{ background: CREAM, color: INK }}>
    <div style={{ position: "absolute", left: 60, top: 150, fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 140, lineHeight: 0.86 }}>
      future
      <br />
      memories
    </div>
    <div style={{ position: "absolute", left: 64, top: 520, right: 60, fontFamily: MONO, fontSize: 32, lineHeight: 2 }}>
      {["motion", "the rose", "details", "instinct", "after"].map((t, i) => (
        <div key={t} style={{ display: "flex", borderBottom: `2px solid ${INK}` }}>
          <span>0{i + 1}</span>
          <span style={{ marginLeft: 40 }}>{t}</span>
        </div>
      ))}
    </div>
    <Mono style={{ left: 62, bottom: 64 }}>milano, october</Mono>
    <Mono style={{ right: 60, bottom: 64 }}>06/06</Mono>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* 2 · contact sheet — 35 mm                                            */
/* ------------------------------------------------------------------ */

const Sprockets: React.FC<{ vertical?: boolean; length: number; style?: React.CSSProperties }> = ({ vertical, length, style }) => {
  const n = Math.floor(length / 58);
  return (
    <div style={{ position: "absolute", display: "flex", flexDirection: vertical ? "column" : "row", gap: 30, ...style }}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} style={{ width: vertical ? 34 : 28, height: vertical ? 28 : 34, borderRadius: 5, background: "#E9E4DA", display: "inline-block" }} />
      ))}
    </div>
  );
};

const FILM_BG = "#1A1714";
const FILM_TXT = "#E9A23B";

const C2Sheet: React.FC = () => {
  const frames: [PhotoKey, string][] = [
    ["p1_blur", "14"],
    ["p2_portrait", "15"],
    ["p3_elevator", "16"],
    ["p4_close", "17"],
  ];
  return (
    <AbsoluteFill style={{ background: "#ECE8E1" }}>
      {[0, 1].map((row) => (
        <div key={row} style={{ position: "absolute", left: 40, right: 40, top: 110 + row * 560, height: 520, background: FILM_BG }}>
          <Sprockets length={1000} style={{ top: 14, left: 30 }} />
          <Sprockets length={1000} style={{ bottom: 14, left: 30 }} />
          {[0, 1].map((col) => {
            const [k, num] = frames[row * 2 + col];
            return (
              <div key={col} style={{ position: "absolute", top: 66, left: 30 + col * 490 }}>
                <Photo k={k} w={450} h={360} filter="contrast(1.05)" />
                <Mono style={{ top: 364, left: 0, color: FILM_TXT, fontSize: 22 }}>
                  {num} ▸ {num}A
                </Mono>
              </div>
            );
          })}
        </div>
      ))}
      {/* grease-pencil pick */}
      <svg width={520} height={470} style={{ position: "absolute", left: 540, top: 120 }} viewBox="0 0 520 470">
        <path d="M60,240 C40,90 200,20 320,40 C470,65 500,200 470,300 C440,420 260,455 150,420 C60,390 40,300 80,230" fill="none" stroke={RED} strokeWidth={9} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", right: 70, top: 600, fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 64, color: RED, transform: "rotate(-6deg)" }}>this one</div>
      <Mono style={{ left: 46, bottom: 70, color: INK }}>ROLL 07 — MILANO, OCT</Mono>
      <Mono style={{ right: 46, bottom: 70, color: INK }}>SWIPE ▸</Mono>
    </AbsoluteFill>
  );
};

const C2Frame: React.FC<{ k: PhotoKey; num: string; note?: string }> = ({ k, num, note }) => (
  <AbsoluteFill style={{ background: FILM_BG }}>
    <Sprockets vertical length={1300} style={{ left: 22, top: 30 }} />
    <Sprockets vertical length={1300} style={{ right: 22, top: 30 }} />
    <Photo k={k} w={880} h={1150} style={{ position: "absolute", left: 100, top: 100 }} filter="contrast(1.04)" />
    <Mono style={{ left: 100, top: 46, color: FILM_TXT }}>
      {num} ▸ {num}A
    </Mono>
    <Mono style={{ right: 100, top: 46, color: FILM_TXT }}>FILM 400</Mono>
    {note ? (
      <div style={{ position: "absolute", left: 120, bottom: 22, fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 52, color: RED, transform: "rotate(-3deg)" }}>{note}</div>
    ) : null}
    <Grain opacity={0.06} seed={Number(num)} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* 3 · today I choose — seamless 5-slide panorama (5400x1350)          */
/* ------------------------------------------------------------------ */

export const PANO_W = W * 5;

const C3Pano: React.FC = () => {
  // photos straddle the slide seams (1080, 2160, 3240, 4320); the poster lines sit in the gaps between them
  const shots: [PhotoKey, number, number, number][] = [
    ["p1_blur", 700, 440, 640],
    ["p2_portrait", 1900, 470, 620],
    ["p4_close", 2980, 500, 600],
    ["p3_elevator", 4060, 470, 620],
  ];
  const lines: [string, number, number][] = [
    ["to trust\ninstincts", 96, 560],
    ["to get lost\non purpose", 1400, 600],
    ["to stay\nout late", 2570, 640],
    ["to make the\nfirst move", 3630, 600],
    ["to take\nthe risk", 4720, 600],
  ];
  return (
    <AbsoluteFill style={{ background: AQUA }}>
      <div style={{ position: "absolute", top: 40, left: 70, whiteSpace: "nowrap", fontFamily: SANS, fontWeight: 800, fontSize: 300, letterSpacing: "-0.05em", color: "#fff", lineHeight: 1.15 }}>
        today i choose —
      </div>
      {shots.map(([k, x, y, w]) => (
        <Photo key={k} k={k} w={w} h={w * 1.25} style={{ position: "absolute", left: x, top: y, boxShadow: "0 30px 60px rgba(0,0,0,0.25)" }} />
      ))}
      {lines.map(([t, x, y]) => (
        <div
          key={t}
          style={{ position: "absolute", left: x, top: y, fontFamily: SANS, fontWeight: 800, fontSize: 64, letterSpacing: "-0.03em", lineHeight: 1.05, color: INK, whiteSpace: "pre" }}
        >
          {t}
        </div>
      ))}
      <Mono style={{ left: 96, bottom: 70, color: INK, fontSize: 28 }}>MILANO · 15 TO 18 · OCTOBER</Mono>
      <Mono style={{ left: 4720, bottom: 70, color: INK, fontSize: 28 }}>future memories ✳︎</Mono>
      {[1, 2, 3, 4].map((i) => (
        <Mono key={i} style={{ left: W * i - 140, bottom: 70, color: INK, fontSize: 26 }}>
          0{i}/05 ▸
        </Mono>
      ))}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 4 · on / off                                                         */
/* ------------------------------------------------------------------ */

const OnOffCover: React.FC = () => (
  <AbsoluteFill style={{ background: INK }}>
    <Photo k="p2_portrait" w={540} h={H} cx={1100} />
    <Photo k="p3_elevator" w={540} h={H} cx={1100} style={{ position: "absolute", left: 540, top: 0 }} filter="saturate(0.9)" />
    <div style={{ position: "absolute", left: 40, bottom: 60, fontFamily: SANS, fontWeight: 800, fontSize: 150, letterSpacing: "-0.06em", color: "#fff", lineHeight: 0.9 }}>on</div>
    <div style={{ position: "absolute", left: 580, bottom: 60, fontFamily: SANS, fontWeight: 800, fontSize: 150, letterSpacing: "-0.06em", color: "#fff", lineHeight: 0.9 }}>off</div>
    <div style={{ position: "absolute", left: 539, top: 0, bottom: 0, width: 2, background: "#fff" }} />
    <Mono style={{ left: 44, top: 56, color: "#fff" }}>ON CAMERA</Mono>
    <Mono style={{ left: 584, top: 56, color: "#fff" }}>OFF CAMERA</Mono>
  </AbsoluteFill>
);

const OnOffSlide: React.FC<{ k: PhotoKey; mode: "on" | "off"; time: string; n: string }> = ({ k, mode, time, n }) => (
  <AbsoluteFill style={{ background: mode === "on" ? AQUA : "#2A211B" }}>
    <Photo k={k} w={960} h={1150} style={{ position: "absolute", left: 60, top: 60 }} filter={mode === "off" ? "sepia(0.1)" : undefined} />
    <div style={{ position: "absolute", left: 60, bottom: 34, fontFamily: SANS, fontWeight: 800, fontSize: 96, letterSpacing: "-0.06em", color: mode === "on" ? INK : "#F1E6DA", lineHeight: 1 }}>{mode}</div>
    <Mono style={{ right: 60, bottom: 62, color: mode === "on" ? INK : "#F1E6DA", fontSize: 28 }}>
      {time} · {n}/06
    </Mono>
  </AbsoluteFill>
);

const OnOffEnd: React.FC = () => (
  <AbsoluteFill style={{ background: INK, color: "#fff" }}>
    <Photo k="p2_portrait" w={520} h={700} cx={1190} cy={1590} cw={560} style={{ position: "absolute", left: 280, top: 170 }} filter="grayscale(0.2)" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 940, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 84, letterSpacing: "-0.05em", lineHeight: 1 }}>
      on. off.
      <br />
      same rose.
    </div>
    <Mono style={{ left: 0, right: 0, bottom: 64, textAlign: "center", color: "#9A9A9A" }}>06/06</Mono>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* 5 · follow the rose — zoom carousel                                  */
/* ------------------------------------------------------------------ */

const SILVER = "saturate(0.55) contrast(1.08)";

const Zoom: React.FC<{ k: PhotoKey; cx?: number; cy?: number; cw?: number; z: string; text?: string; n: string }> = ({ k, cx, cy, cw, z, text, n }) => (
  <AbsoluteFill style={{ background: "#0C0C0C" }}>
    <Photo k={k} w={W} h={H} cx={cx} cy={cy} cw={cw} filter={SILVER} />
    <Mono style={{ left: 60, top: 60, color: "#EDEDED", fontSize: 30 }}>{z}</Mono>
    <Mono style={{ right: 60, top: 60, color: "#EDEDED" }}>{n}/05</Mono>
    {text ? (
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 90, fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 84, color: "#fff", lineHeight: 0.95, textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
        {text}
      </div>
    ) : null}
    <Grain opacity={0.06} seed={Number(n) + 3} />
  </AbsoluteFill>
);

/** Thin circle marking the brooch on the full portrait (coordinates for the 1080x1350 cover crop of p2). */
const RoseMarker: React.FC = () => {
  // p2 cover crop: width 2056 -> scale 1080/2056; brooch centre ~ (1190, 1590) natural
  const s = W / 2056;
  const x = 1190 * s;
  const y = (1590 - (2576 - 2056 * (H / W)) / 2) * s;
  return (
    <div
      style={{ position: "absolute", left: x - 110, top: y - 150, width: 220, height: 300, borderRadius: "50%", border: "3px solid #fff", boxShadow: "0 0 18px rgba(0,0,0,0.4)" }}
    />
  );
};

/* ------------------------------------------------------------------ */

type Slide = { id: string; el: React.FC; w?: number };

export const slides: Slide[] = [
  { id: "C1-01", el: C1Cover },
  { id: "C1-02", el: () => <C1Full k="p2_portrait" n="02" label="the rose" /> },
  { id: "C1-03", el: C1Details },
  { id: "C1-04", el: () => <C1Full k="p4_close" n="04" label="instinct" quote="today I choose to trust instincts." /> },
  { id: "C1-05", el: () => <C1Full k="p3_elevator" n="05" label="after" /> },
  { id: "C1-06", el: C1Index },

  { id: "C2-01", el: C2Sheet },
  { id: "C2-02", el: () => <C2Frame k="p1_blur" num="14" /> },
  { id: "C2-03", el: () => <C2Frame k="p2_portrait" num="15" note="keeper" /> },
  { id: "C2-04", el: () => <C2Frame k="p4_close" num="17" /> },
  { id: "C2-05", el: () => <C2Frame k="p3_elevator" num="16" note="lol" /> },

  { id: "C3-PANO", el: C3Pano, w: PANO_W },

  { id: "C4-01", el: OnOffCover },
  { id: "C4-02", el: () => <OnOffSlide k="p1_blur" mode="on" time="21:04" n="02" /> },
  { id: "C4-03", el: () => <OnOffSlide k="p3_elevator" mode="off" time="23:58" n="03" /> },
  { id: "C4-04", el: () => <OnOffSlide k="p2_portrait" mode="on" time="21:37" n="04" /> },
  { id: "C4-05", el: () => <OnOffSlide k="p4_close" mode="off" time="00:12" n="05" /> },
  { id: "C4-06", el: OnOffEnd },

  {
    id: "C5-01",
    el: () => (
      <AbsoluteFill>
        <Zoom k="p2_portrait" z="1x" n="01" text="follow the rose" />
        <RoseMarker />
      </AbsoluteFill>
    ),
  },
  { id: "C5-02", el: () => <Zoom k="p2_portrait" cx={1150} cy={1500} cw={1100} z="2x" n="02" /> },
  { id: "C5-03", el: () => <Zoom k="p2_portrait" cx={1190} cy={1590} cw={520} z="4x" n="03" /> },
  { id: "C5-04", el: () => <Zoom k="p4_close" cx={560} cy={2200} cw={720} z="8x" n="04" /> },
  { id: "C5-05", el: () => <Zoom k="p4_close" z="—" n="05" text="kept in silver." /> },
];
