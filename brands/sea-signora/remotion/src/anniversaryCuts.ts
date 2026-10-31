import type {YearCut} from './Anniversary';

// The year in 28 half-second moments (order: arrival → room → kitchen → plates → service → bar → guests).
// start = the steadiest, sharpest 0.6 s of each proxy (scratchpad windows.py).
export const YEAR_CUTS: YearCut[] = [
  {clip: 'entrance-door', start: 5.95}, // h 1920, sharpness 2201.3, shift 0.29
  {clip: 'hostesses', start: 5.2}, // h 1920, sharpness 4378.7, shift 0.01
  {clip: 'sign-green', start: 4.97}, // h 1920, sharpness 5862.4, shift 0.09
  {clip: 'aquarium-rocks', start: 0.42}, // h 1920, sharpness 2454.2, shift 0.07
  {clip: 'signora-painting', start: 2.77}, // h 1920, sharpness 946.7, shift 0.04
  {clip: 'flowers-table', start: 2.28}, // h 1920, sharpness 4804.3, shift 0.05
  {clip: 'team-room', start: 13.87}, // h 1920, sharpness 3438.4, shift 0.01
  {clip: 'fish-cut', start: 0.47}, // h 1920, sharpness 1034.6, shift 0.18
  {clip: 'herbs-chop', start: 0.45}, // h 1920, sharpness 1861.2, shift 0.23
  {clip: 'flambe', start: 4.43}, // h 1920, sharpness 3762.2, shift 0.31
  {clip: 'kitchen-pass', start: 2.67}, // h 1920, sharpness 5212.1, shift 0.05
  {clip: 'lobster-pan', start: 4.17}, // h 1920, sharpness 680.5, shift 0.25
  {clip: 'plating-hands', start: 5.18}, // h 1920, sharpness 498.2, shift 0.14
  {clip: 'octopus-dish', start: 14.57}, // h 1920, sharpness 1219.0, shift 0.57
  {clip: 'pasta-top', start: 23.1}, // h 1920, sharpness 1228.1, shift 0.28
  {clip: 'tuna-tartare', start: 2.32}, // h 1920, sharpness 3005.8, shift 0.22
  {clip: 'crab-ice', start: 1.05}, // h 1920, sharpness 1488.6, shift 0.19
  {clip: 'oysters-ice', start: 0.4}, // h 1920, sharpness 1407.2, shift 0.16
  {clip: 'water-pour-ice', start: 3.57}, // h 1920, sharpness 726.8, shift 0.34
  {clip: 'wine-pour-table', start: 9.18}, // h 1920, sharpness 2197.6, shift 0.02
  {clip: 'sparkling-pour', start: 5.86}, // h 1920, sharpness 1293.0, shift 0.28
  {clip: 'bartender-shake', start: 9.63}, // h 1920, sharpness 1704.0, shift 0.11
  {clip: 'bartender-cocktail', start: 14.62}, // h 1920, sharpness 3450.2, shift 0.05
  {clip: 'green-cocktail', start: 2.0}, // h 1920, sharpness 296.8, shift 0.44
  {clip: 'coupe-pour', start: 0.77}, // h 1920, sharpness 290.9, shift 0.31
  {clip: 'guest-candle', start: 0.4}, // h 1920, sharpness 924.5, shift 0.05
  {clip: 'guest-hat-bar', start: 9.13, zoom: 1.4, fy: 90}, // face lifted above the note // h 1920, sharpness 2806.5, shift 0.02
  {clip: 'curtain-hands', start: 9.05}, // h 1920, sharpness 558.9, shift 0.03
];
