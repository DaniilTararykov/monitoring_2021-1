import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  COLORS,
  CURSIVE,
  INTER_TIGHT,
  TELEGRAM_BLUE,
  TIGHT_TRACKING,
} from "../Capitaliano/brand";
import { CITY_POINTS, ITALY_PATH, ITALY_VIEWBOX } from "./italy";
import type { StudentInfo } from "./types";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const TelegramIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx={12} cy={12} r={12} fill={TELEGRAM_BLUE} />
    <path
      d="M5.4 11.8l11.2-4.3c.5-.2 1 .1.8.9l-1.9 8.9c-.1.6-.5.8-1 .5l-2.9-2.1-1.4 1.3c-.2.2-.3.3-.6.3l.2-2.9 5.4-4.9c.2-.2 0-.3-.4-.1l-6.6 4.2-2.9-.9c-.6-.2-.6-.6.1-.9z"
      fill="#FFFFFF"
    />
  </svg>
);

// Logo over a soft cream fade, so it reads over sky and street. The Telegram
// handle only appears on the end card.
export const Header: React.FC<{ fadeIn: boolean }> = ({ fadeIn }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        opacity: fadeIn ? interpolate(frame, [0, 0.6 * fps], [0, 1], clamp) : 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 430,
          background:
            "linear-gradient(180deg, rgba(255, 252, 249, 0.92) 0%, rgba(255, 252, 249, 0.7) 55%, rgba(255, 252, 249, 0) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 262,
          left: 70,
          right: 55,
          height: 76,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Img src={staticFile("logo.png")} style={{ height: 70 }} />
      </div>
    </AbsoluteFill>
  );
};

// The interviewer's question as a chat message: typing dots, then the text.
export const QuestionBubble: React.FC<{ text: string; top?: number }> = ({
  text,
  top = 372,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typing = frame < 0.45 * fps;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        right: 55,
        display: "flex",
        alignItems: "flex-end",
        gap: 16,
        opacity: interpolate(frame, [0, 6], [0, 1], clamp),
        translate: `0px ${interpolate(frame, [0, 0.4 * fps], [40, 0], { ...clamp, easing: ease })}px`,
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          flexShrink: 0,
          borderRadius: 42,
          backgroundColor: COLORS.white,
          boxShadow: "0 8px 24px rgba(27, 94, 52, 0.18)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Img src={staticFile("laurel.png")} style={{ width: 62 }} />
      </div>
      <div
        style={{
          maxWidth: 820,
          padding: "20px 30px 22px",
          borderRadius: "34px 34px 34px 8px",
          backgroundColor: COLORS.white,
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.16)",
          fontFamily: INTER_TIGHT,
          letterSpacing: TIGHT_TRACKING,
        }}
      >
        {typing ? (
          <div style={{ display: "flex", gap: 10, padding: "18px 4px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: COLORS.darkGreen,
                  opacity:
                    0.3 + 0.7 * Math.abs(Math.sin((frame / fps) * 8 - i * 0.9)),
                }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.12,
              color: COLORS.darkGray,
            }}
          >
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

const ItalyMap: React.FC<{ city: string; width: number }> = ({
  city,
  width,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [cx, cy] = CITY_POINTS[city] ?? [0, 0];
  const pulse = (frame / fps) % 1.4;
  return (
    <svg
      width={width}
      height={(width * ITALY_VIEWBOX.height) / ITALY_VIEWBOX.width}
      viewBox={`0 0 ${ITALY_VIEWBOX.width} ${ITALY_VIEWBOX.height}`}
    >
      <path
        d={ITALY_PATH}
        fill="rgba(47, 141, 79, 0.12)"
        stroke={COLORS.green}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <circle
        cx={cx}
        cy={cy}
        r={6 + pulse * 18}
        fill="none"
        stroke={COLORS.red}
        strokeWidth={3}
        opacity={1 - pulse / 1.4}
      />
      <circle cx={cx} cy={cy} r={8} fill={COLORS.red} />
    </svg>
  );
};

// Student "passport": photo, name, age and home, university and programme,
// the university city on a map of Italy, and a VISTO stamp.
export const Passport: React.FC<{
  student: StudentInfo;
  mediaBase: string;
}> = ({ student, mediaBase }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = 0.9 * fps;
  return (
    <div
      style={{
        position: "absolute",
        top: 1170,
        left: 70,
        right: 193,
        padding: 24,
        borderRadius: 36,
        backgroundColor: COLORS.cream,
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.22)",
        display: "flex",
        gap: 24,
        alignItems: "stretch",
        fontFamily: INTER_TIGHT,
        letterSpacing: TIGHT_TRACKING,
        opacity: interpolate(frame, [0, 6], [0, 1], clamp),
        translate: `0px ${interpolate(frame, [0, 0.5 * fps], [120, 0], { ...clamp, easing: ease })}px`,
      }}
    >
      {student.photo ? (
        <div style={{ position: "relative", flexShrink: 0 }}>
          <Img
            src={staticFile(`${mediaBase}/${student.photo}`)}
            style={{
              width: 200,
              height: 266,
              objectFit: "cover",
              borderRadius: 20,
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: -26,
              bottom: 14,
              padding: "6px 14px",
              border: `4px solid ${COLORS.red}`,
              borderRadius: 12,
              color: COLORS.red,
              backgroundColor: "rgba(255, 252, 249, 0.85)",
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: "0.12em",
              rotate: "-14deg",
              opacity: interpolate(
                frame,
                [stampAt, stampAt + 3],
                [0, 0.95],
                clamp,
              ),
              scale: interpolate(
                frame,
                [stampAt, stampAt + 0.25 * fps],
                [1.8, 1],
                { ...clamp, easing: Easing.bezier(0.3, 1.4, 0.6, 1) },
              ),
            }}
          >
            VISTO
          </div>
        </div>
      ) : null}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: COLORS.green,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {student.female ? "Студентка" : "Студент"}
        </div>
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            color: COLORS.darkGreen,
            lineHeight: 1.02,
          }}
        >
          {student.name}
        </div>
        <div style={{ fontSize: 28, fontWeight: 500, color: COLORS.darkGray }}>
          {student.age} · {student.from}
        </div>
        <div
          style={{
            height: 2,
            backgroundColor: "rgba(27, 94, 52, 0.15)",
            margin: "8px 0",
          }}
        />
        <div style={{ fontSize: 30, fontWeight: 700, color: COLORS.darkGray }}>
          {student.uni}
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: COLORS.darkGray,
            opacity: 0.8,
          }}
        >
          {student.program}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ItalyMap city={student.city} width={118} />
        <div
          style={{
            fontFamily: CURSIVE,
            fontWeight: 700,
            fontSize: 34,
            color: COLORS.red,
            transform: "skewX(-15deg)",
            marginTop: -4,
          }}
        >
          {student.city}
        </div>
      </div>
    </div>
  );
};

// Round avatars of everyone in a question or review video, the current
// speaker raised.
export const FacesStrip: React.FC<{
  order: string[];
  active: string | null;
  students: Record<string, StudentInfo>;
  mediaBase: string;
}> = ({ order, active, students, mediaBase }) => {
  const index = active ? order.indexOf(active) : -1;
  return (
    <div
      style={{
        position: "absolute",
        top: 372,
        left: 70,
        right: 55,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        fontFamily: INTER_TIGHT,
      }}
    >
      {order.map((sid) => {
        const on = sid === active;
        return (
          <div
            key={sid}
            style={{
              width: on ? 86 : 62,
              height: on ? 86 : 62,
              borderRadius: "50%",
              overflow: "hidden",
              border: `${on ? 5 : 3}px solid ${on ? COLORS.green : COLORS.white}`,
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
              opacity: on || !active ? 1 : 0.75,
              flexShrink: 0,
            }}
          >
            <Img
              src={staticFile(`${mediaBase}/${students[sid].avatar}`)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        );
      })}
      {active ? (
        <div
          style={{
            marginLeft: 10,
            padding: "8px 16px",
            borderRadius: 999,
            backgroundColor: COLORS.green,
            color: COLORS.white,
            fontWeight: 700,
            fontSize: 30,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {index + 1}/{order.length}
        </div>
      ) : null}
      {active ? (
        <div
          style={{
            position: "absolute",
            top: 112,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Name and university on the left, degree on the right. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 28,
              minWidth: 640,
              padding: "8px 8px 8px 26px",
              borderRadius: 999,
              backgroundColor: COLORS.white,
              boxShadow: "0 8px 22px rgba(0, 0, 0, 0.18)",
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 34,
                color: COLORS.darkGreen,
              }}
            >
              {students[active].name}
              <span style={{ fontWeight: 600, color: COLORS.darkGray }}>
                {" "}
                · {students[active].uni}
              </span>
            </div>
            <div
              style={{
                padding: "6px 18px",
                borderRadius: 999,
                backgroundColor: COLORS.green,
                color: COLORS.white,
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: "0.02em",
              }}
            >
              {students[active].level}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

// Small "Правда" chip shown while a student answers a myth.
export const TruthChip: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 380,
        left: 70,
        right: 55,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(frame, [0.3 * fps, 0.3 * fps + 5], [0, 1], clamp),
        scale: interpolate(frame, [0.3 * fps, 0.6 * fps], [1.25, 1], {
          ...clamp,
          easing: ease,
        }),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 28px 16px 16px",
          borderRadius: 999,
          backgroundColor: COLORS.white,
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.18)",
          fontFamily: INTER_TIGHT,
          letterSpacing: TIGHT_TRACKING,
        }}
      >
        <div
          style={{
            padding: "8px 18px",
            borderRadius: 999,
            backgroundColor: COLORS.green,
            color: COLORS.white,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "0.08em",
          }}
        >
          ПРАВДА
        </div>
        <div style={{ fontWeight: 700, fontSize: 38, color: COLORS.darkGreen }}>
          {text}
        </div>
      </div>
    </div>
  );
};

// Who is speaking, for videos without the faces strip.
export const NameTag: React.FC<{ student: StudentInfo; top: number }> = ({
  student,
  top,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 70,
      right: 55,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        padding: "6px 22px",
        borderRadius: 999,
        backgroundColor: COLORS.white,
        boxShadow: "0 8px 22px rgba(0, 0, 0, 0.18)",
        fontFamily: INTER_TIGHT,
        fontWeight: 700,
        fontSize: 34,
        color: COLORS.darkGreen,
      }}
    >
      {student.name} · {student.uni}
    </div>
  </div>
);
