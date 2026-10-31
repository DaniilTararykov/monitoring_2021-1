import type {YearCut} from './Anniversary';

// A «Ritmo» — the year in 30 moments, cut every 14 frames like the client's reference: mostly plates from above, cocktails and pours,
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

// B «Crescendo» — the room and the people: tables, guests, the bar; cuts accelerate from 1 s to a quarter second.
export const CUTS_B: YearCut[] = [
  {clip: 'canapes-table', start: 3.03, n: 30},
  {clip: 'table-stand', start: 0.85, n: 29},
  {clip: 'champagne-canapes', start: 0.88, n: 27},
  {clip: 'couple-dinner', start: 1.02, n: 26},
  {clip: 'cocktails-bar', start: 3.28, n: 24},
  {clip: 'bartender-white', start: 1.6, n: 23},
  {clip: 'booth-plates', start: 9.03, n: 22},
  {clip: 'table-guests', start: 1.82, n: 20},
  {clip: 'guests-kitchen', start: 0.83, n: 19},
  {clip: 'booth-dish', start: 6.47, n: 18},
  {clip: 'booth-top', start: 2.17, n: 16},
  {clip: 'booth-dish2', start: 2.87, n: 15},
  {clip: 'dinner-top', start: 15.47, n: 14},
  {clip: 'tuna-plate', start: 0.4, n: 12},
  {clip: 'pink-pasta', start: 5.98, n: 11},
  {clip: 'room-staff', start: 0.4, n: 9},
  {clip: 'dinner-table', start: 8.78, n: 8},
];

// C «Lento» — the kitchen and the hands: long calm shots (1.2 s) with a slow push-in.
export const CUTS_C: YearCut[] = [
  {clip: 'chef-pass', start: 13.15, n: 36, push: 0.05},
  {clip: 'chef-stove', start: 2.4, n: 36, push: 0.05},
  {clip: 'chef-slice', start: 3.22, n: 36, push: 0.05},
  {clip: 'chef-pour', start: 2.97, n: 36, push: 0.05},
  {clip: 'frying', start: 1.02, n: 36, push: 0.05},
  {clip: 'chef-pan', start: 4.35, n: 36, push: 0.05},
  {clip: 'sauce-pour', start: 2.82, n: 36, push: 0.05},
  {clip: 'chef-woman', start: 17.65, n: 36, push: 0.05},
  {clip: 'plating-hands2', start: 0.52, n: 36, push: 0.05},
  {clip: 'chef-plating', start: 4.53, n: 36, push: 0.05},
  {clip: 'lamb-dish', start: 1.17, n: 36, push: 0.05},
];

// D «Festa» (client 31.10: faster, denser, the room, the guests and the events — LIFE CONTENT, La Cena Segreta, Lago,
// Limoncello party, Blackout). Client 31.10 (3): first shot replaced; cuts on the half-beats of brera-house (123 bpm);
// note: where the paper sits so it stays off people.
export const CUTS_D: YearCut[] = [
  {clip: 'e53', start: 0.53, n: 7},
  {clip: 'e07', start: 3.53, n: 8},
  {clip: 'e11', start: 2.87, n: 7},
  {clip: 'e31', start: 1.13, n: 7},
  {clip: 'e03', start: 1.13, n: 8},
  {clip: 'e19', start: 0.57, n: 7},
  {clip: 'e20', start: 2.87, n: 7},
  {clip: 'e21', start: 4.85, n: 8, note: 'bottom'},
  {clip: 'e22', start: 10.91, n: 7},
  {clip: 'e27', start: 2.87, n: 7},
  {clip: 'e24', start: 0.58, n: 7},
  {clip: 'e16', start: 2.6, n: 8},
  {clip: 'e10', start: 0.83, n: 7},
  {clip: 'e05', start: 3.37, n: 7},
  {clip: 'e06', start: 1.02, n: 8},
  {clip: 'e12', start: 4.37, n: 7, note: 'bottom'},
  {clip: 'e17', start: 3.6, n: 7, note: 'bottom'},
  {clip: 'e33', start: 11.07, n: 8},
  {clip: 'e50', start: 1.0, n: 7},
  {clip: 'e01', start: 5.23, n: 7},
  {clip: 'e48', start: 7.53, n: 8},
  {clip: 'e49', start: 0.7, n: 7},
  {clip: 'e61', start: 6.77, n: 7},
  {clip: 'e59', start: 2.0, n: 8},
  {clip: 'e60', start: 0.43, n: 7},
  {clip: 'e62', start: 4.83, n: 7, note: 'bottom'},
  {clip: 'e30', start: 4.3, n: 8},
  {clip: 'e45', start: 5.77, n: 7},
  {clip: 'e43', start: 3.01, n: 7},
  {clip: 'e46', start: 1.5, n: 8},
  {clip: 'e15', start: 3.73, n: 7},
  {clip: 'e08', start: 6.53, n: 7},
  {clip: 'e56', start: 2.63, n: 7},
  {clip: 'e35', start: 2.38, n: 8},
  {clip: 'e41', start: 0.83, n: 7},
  {clip: 'e44', start: 4.27, n: 7},
  {clip: 'e14', start: 11.13, n: 8},
  {clip: 'e23', start: 5.07, n: 7},
  {clip: 'e28', start: 0.73, n: 7},
  {clip: 'e54', start: 3.97, n: 8},
  {clip: 'e40', start: 8.77, n: 7},
  {clip: 'e39', start: 4.77, n: 7},
  {clip: 'e52', start: 0.47, n: 8},
  {clip: 'e58', start: 5.73, n: 7},
  {clip: 'e04', start: 8.87, n: 7},
  {clip: 'e57', start: 11.27, n: 8},
  {clip: 'e34', start: 4.3, n: 7},
  {clip: 'e55', start: 12.8, n: 7},
];
