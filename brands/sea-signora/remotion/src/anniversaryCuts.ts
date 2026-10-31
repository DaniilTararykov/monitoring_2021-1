import type {YearCut} from './Anniversary';

// The year in 30 moments, cut every 14 frames like the client's reference: mostly plates from above, cocktails and pours,
// a few hands at work (client 31.10: «кадры все не оч» → only the cleanest content-shooting footage, one look).
// start = the steadiest, sharpest 0.5 s of each proxy (scratchpad windows.py); the last one is the blurred end frame.
export const CUTS_A: YearCut[] = [
  {clip: 'entrance-door2', start: 5.99, n: 14}, // sharpness 2197.0, shift 0.24
  {clip: 'pasta-pink', start: 5.87, n: 14}, // sharpness 1993.0, shift 0.12
  {clip: 'octopus-top', start: 1.37, n: 14}, // sharpness 1592.7, shift 0.11
  {clip: 'coupe-roe', start: 15.2, n: 14}, // sharpness 1944.3, shift 0.38
  {clip: 'oyster-caviar', start: 2.58, n: 14}, // sharpness 514.4, shift 0.06
  {clip: 'carpaccio-flower', start: 0.68, n: 14}, // sharpness 1470.6, shift 0.27
  {clip: 'martini-orange', start: 4.92, n: 14}, // sharpness 2019.4, shift 0.19
  {clip: 'tuna-crudo', start: 2.15, n: 14}, // sharpness 725.2, shift 0.13
  {clip: 'risotto-pink', start: 8.78, n: 14}, // sharpness 1278.7, shift 0.02
  {clip: 'sparkling-pour2', start: 6.01, n: 14}, // sharpness 1300.5, shift 0.28
  {clip: 'pasta-marble', start: 0.67, n: 14}, // sharpness 751.7, shift 0.27
  {clip: 'booth-stand', start: 0.73, n: 14}, // sharpness 591.0, shift 0.22
  {clip: 'herbs-chop2', start: 0.57, n: 14}, // sharpness 1839.6, shift 0.24
  {clip: 'oysters-spread', start: 3.33, n: 14}, // sharpness 2188.5, shift 0.05
  {clip: 'porcini', start: 10.15, n: 14}, // sharpness 738.3, shift 0.01
  {clip: 'copper-pot', start: 12.82, n: 14}, // sharpness 4183.3, shift 0.06
  {clip: 'green-cocktail2', start: 2.07, n: 14}, // sharpness 300.0, shift 0.44
  {clip: 'salad-top', start: 0.42, n: 14}, // sharpness 1591.9, shift 0.23
  {clip: 'oysters-two', start: 0.98, n: 14}, // sharpness 571.7, shift 0.14
  {clip: 'strong-breeze', start: 8.8, n: 14}, // sharpness 2324.2, shift 0.13
  {clip: 'plating-white', start: 5.32, n: 14}, // sharpness 497.1, shift 0.13
  {clip: 'canapes-wine', start: 3.88, n: 14}, // sharpness 1253.0, shift 0.04
  {clip: 'coupe-ice', start: 7.43, n: 14}, // sharpness 2182.8, shift 0.32
  {clip: 'tomatoes', start: 1.37, n: 14}, // sharpness 472.8, shift 0.11
  {clip: 'water-glasses', start: 9.28, n: 14}, // sharpness 2198.6, shift 0.02
  {clip: 'pasta-close', start: 8.53, n: 14}, // sharpness 1478.7, shift 0.15
  {clip: 'sauce-pot', start: 17.28, n: 14}, // sharpness 757.2, shift 0.07
  {clip: 'pasta-fork', start: 18.02, n: 14}, // sharpness 2669.5, shift 0.01
  {clip: 'oysters-lemon', start: 0.42, n: 14}, // sharpness 1409.8, shift 0.15
  {clip: 'booth-table', start: 3.37, n: 14}, // sharpness 1384.6, shift 0.04
];
