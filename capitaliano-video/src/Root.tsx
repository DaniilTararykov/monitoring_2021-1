import { Composition } from "remotion";
import { Capitaliano, calculateCapitalianoMetadata } from "./Capitaliano";

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
          videoOffsetY: 200,
          cards: [
            {
              text: "Вам 30+ и хотите учиться в Италии?",
              fromSec: 0.2,
              durationSec: 6,
              variant: "green",
            },
            {
              text: "Часть 2: студенческие визы",
              fromSec: 6.3,
              durationSec: 2.9,
              variant: "white",
            },
            {
              text: "Артём, старший куратор Capitaliano",
              fromSec: 9.3,
              durationSec: 6.6,
              variant: "white",
              note: "5 лет и 100+ подач",
            },
            {
              text: "Только личный профессиональный опыт",
              fromSec: 16,
              durationSec: 4.7,
              variant: "white",
            },
            {
              text: "Университету всё равно, сколько вам лет",
              fromSec: 20.8,
              durationSec: 3.8,
              variant: "green",
            },
            {
              text: "А консульству — нет",
              fromSec: 24.7,
              durationSec: 9.2,
              variant: "white",
              note: "видит желание эмигрировать",
            },
            {
              text: "Возраст — не причина отказа",
              fromSec: 34,
              durationSec: 7,
              variant: "green",
              note: "но риски растут",
            },
            {
              text: "3 вопроса к себе",
              fromSec: 41.1,
              durationSec: 2.4,
              variant: "white",
            },
            {
              text: "1. Программа логично продолжает образование?",
              fromSec: 43.6,
              durationSec: 7.6,
              variant: "green",
            },
            {
              text: "Резкая смена специальности",
              fromSec: 51.3,
              durationSec: 9.7,
              variant: "white",
              note: "консулу сложнее увидеть логику",
            },
            {
              text: "2. Сколько лет прошло с последней учёбы?",
              fromSec: 61.1,
              durationSec: 4.8,
              variant: "green",
            },
            {
              text: "«Длительный период после окончания обучения»",
              fromSec: 66,
              durationSec: 3.6,
              variant: "white",
              note: "так и пишут в отказах",
            },
            {
              text: "3. Чем вы занимались всё это время?",
              fromSec: 69.7,
              durationSec: 3.8,
              variant: "green",
            },
            {
              text: "Опыт — всегда плюс",
              fromSec: 73.6,
              durationSec: 7.5,
              variant: "white",
              note: "не всегда!",
              strike: true,
            },
            {
              text: "Нет логики — есть риск отказа",
              fromSec: 81.2,
              durationSec: 9.6,
              variant: "white",
              note: "к сожалению",
            },
            {
              text: "Визы дают и в 35, и в 40 лет",
              fromSec: 90.9,
              durationSec: 4,
              variant: "green",
            },
            {
              text: "К визе готовьтесь тщательнее, чем к поступлению",
              fromSec: 95,
              durationSec: 9.5,
              variant: "white",
            },
            {
              text: "Сохраните видео, чтобы проверить себя",
              fromSec: 104.6,
              durationSec: 2.4,
              variant: "green",
            },
            {
              text: "Подавались в 30+? Расскажите в комментариях",
              fromSec: 107.1,
              durationSec: 6.8,
              variant: "white",
            },
            {
              text: "Дальше: волна отказов этого года",
              fromSec: 114,
              durationSec: 11.4,
              variant: "white",
              note: "и что с этим делать",
            },
          ],
        }}
      />
    </>
  );
};
