import type { Beat } from "./Capitaliano/Beats";

// Meaning blocks of the video: timing, layout and on-screen graphic.
// The web editor writes its edits back here.
export const BEATS: Beat[] = [
  {
    fromSec: 0.2,
    durationSec: 6.0,
    layout: "split-a",
    graphic: {
      kind: "stat",
      value: 30,
      suffix: "+",
      label: "и хотите учиться в Италии?",
    },
  },
  {
    fromSec: 6.3,
    durationSec: 2.9,
    layout: "circle-top",
    graphic: {
      kind: "card",
      text: "Часть 2 · студенческие визы",
      variant: "white",
    },
  },
  {
    fromSec: 9.3,
    durationSec: 4.4,
    layout: "circle-bottom",
    graphic: {
      kind: "card",
      text: "Артём, старший куратор Capitaliano",
      variant: "green",
    },
  },
  {
    fromSec: 13.8,
    durationSec: 2.2,
    layout: "circle-bottom",
    graphic: {
      kind: "stat",
      value: 100,
      suffix: "+",
      label: "подач на визы за 5 лет",
    },
  },
  {
    fromSec: 16.0,
    durationSec: 4.7,
    layout: "full",
    graphic: {
      kind: "card",
      text: "Только личный опыт",
      variant: "white",
    },
  },
  {
    fromSec: 20.7,
    durationSec: 8.1,
    layout: "split-a",
    graphic: {
      kind: "compare",
      good: {
        title: "Университет",
        sub: "возраст не важен",
      },
      bad: {
        title: "Консульство",
        sub: "смотрит на возраст",
      },
      badAtSec: 2.9,
    },
  },
  {
    fromSec: 28.9,
    durationSec: 5.6,
    layout: "circle-bottom",
    graphic: {
      kind: "card",
      text: "Желание иммигрировать?",
      variant: "white",
      note: "проверяют особенно тщательно",
    },
  },
  {
    fromSec: 34.5,
    durationSec: 6.5,
    layout: "split-b",
    graphic: {
      kind: "card",
      text: "Возраст — не причина отказа",
      variant: "green",
    },
  },
  {
    fromSec: 41.0,
    durationSec: 2.5,
    layout: "split-a",
    graphic: {
      kind: "steps",
      active: 0,
      text: "Ответьте на 3 вопроса",
    },
  },
  {
    fromSec: 43.5,
    durationSec: 8.0,
    layout: "split-a",
    graphic: {
      kind: "steps",
      active: 1,
      text: "Программа логично продолжает образование?",
    },
  },
  {
    fromSec: 51.5,
    durationSec: 9.5,
    layout: "full",
    graphic: {
      kind: "card",
      text: "Резкая смена специальности",
      variant: "white",
    },
  },
  {
    fromSec: 61.0,
    durationSec: 3.0,
    layout: "circle-bottom",
    graphic: {
      kind: "steps",
      active: 2,
      text: "Сколько лет прошло с последней учёбы?",
    },
  },
  {
    fromSec: 64.0,
    durationSec: 5.8,
    layout: "circle-bottom",
    graphic: {
      kind: "meter",
      label: "Перерыв в учёбе",
      endLabel: "риск ↑",
    },
  },
  {
    fromSec: 69.8,
    durationSec: 2.5,
    layout: "split-a",
    graphic: {
      kind: "steps",
      active: 3,
      text: "Чем вы занимались всё это время?",
    },
  },
  {
    fromSec: 72.3,
    durationSec: 8.8,
    layout: "split-a",
    graphic: {
      kind: "card",
      text: "Опыт — всегда плюс",
      variant: "white",
      note: "не всегда!",
      strike: true,
    },
  },
  {
    fromSec: 81.1,
    durationSec: 7.6,
    layout: "circle-top",
    graphic: {
      kind: "card",
      text: "Нет логики — риск отказа",
      variant: "white",
    },
  },
  {
    fromSec: 88.7,
    durationSec: 6.3,
    layout: "circle-bottom",
    graphic: {
      kind: "stat",
      valueText: "35 и 40",
      label: "лет — визы всё равно дают",
    },
    accent: true,
  },
  {
    fromSec: 95.0,
    durationSec: 9.5,
    layout: "split-a",
    graphic: {
      kind: "card",
      text: "Готовьтесь к визе тщательнее, чем к поступлению",
      variant: "green",
    },
  },
  {
    fromSec: 104.6,
    durationSec: 2.5,
    layout: "full",
    graphic: {
      kind: "card",
      text: "Сохраните видео",
      variant: "green",
    },
    accent: true,
  },
  {
    fromSec: 107.1,
    durationSec: 6.9,
    layout: "split-b",
    graphic: {
      kind: "card",
      text: "Подавались в 30+? Расскажите в комментариях",
      variant: "white",
    },
  },
  {
    fromSec: 114.0,
    durationSec: 11.4,
    layout: "circle-bottom",
    graphic: {
      kind: "card",
      text: "Дальше: волна отказов этого года",
      variant: "white",
      note: "и что с этим делать",
    },
  },
];
