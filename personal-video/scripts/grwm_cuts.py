"""Edit lists for the four 'full story' GRWM cuts (IMG_2769 + intro IMG_2768).

V1 full story, all brands named        -> src/grwm_v1_brands.json
V2 the same story, no brands at all    -> src/grwm_v2_nobrands.json
V3 'the coat battle' (brands)          -> src/grwm_v3_coats.json
V4 'flash-forward' (no brands)         -> src/grwm_v4_flash.json

Rules kept in every cut: open with Friday + the occasion, whole sentences only, talking shots in sync,
no silent shots of his back, no empty room, brands either all or none.
"""
import json
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "src")


def L(*r, **kw):  # a spoken line, pauses removed, with air around it
    return {"a": [list(x) for x in r], "breathe": True, **kw}


def W(s, e, vol=0.25, **kw):  # a wordless action shot with its own room sound
    return {"a": [[s, e]], "raw": True, "vol": vol, **kw}


INTRO = [L((6.3, 12.3), file="intro"), W(12.4, 15.7, 0.3, file="intro")]
OPEN = [L((6.75, 8.28)), L((79.2, 81.12))]
JEANS_B = [L((83.1, 87.48), (87.84, 88.37), (88.55, 89.18))]  # "why not (to) wear": the "to" is cut
JEANS_N = [L((83.1, 83.92), (85.72, 87.48), (87.84, 88.37), (88.55, 89.18))]
JEANS_ON = [W(94.0, 97.5), W(107.3, 110.0)]
TANK_B = [L((306.5, 313.7))]
TANK_N = [L((306.5, 309.06), (310.12, 313.7))]
BELT = [L((333.5, 335.8), (340.3, 342.98)), W(359.2, 361.4), L((361.45, 363.5)), L((397.45, 400.85))]
BASE_DONE = [L((408.18, 412.95), (414.0, 418.9))]
SLEEVE_B = [L((456.1, 460.7))]
SLEEVE_N = [L((456.1, 458.22))]
SLEEVE_ON = [L((471.9, 475.05)), W(480.8, 487.0)]
SLEEVE_VIBE = [L((573.2, 577.95))]
COAT_Q = [L((578.5, 580.85), (581.75, 584.05))]
BOOTS_B = [L((658.3, 662.26))]
BOOTS_N = [L((658.3, 659.6), (661.28, 662.26))]
BOOTS_ON = [W(665.5, 667.0), W(679.6, 681.6), L((686.7, 689.4))]
GREY = [W(720.1, 721.0, 0.12), W(728.3, 730.9, 0.12), L((731.3, 732.4)), L((747.95, 750.45))]
LEATHER = [L((767.6, 770.5), (771.5, 773.3)), L((787.95, 794.6)), W(797.4, 799.2, 0.12), L((803.2, 805.65)),
           L((806.55, 809.4))]
BROWN = [W(879.55, 880.0, 0.0), L((890.5, 895.12), (895.52, 899.6), (900.06, 903.06))]
BLACK = [W(955.5, 956.0, 0.0), L((957.4, 959.05), (960.02, 962.9)), L((971.0, 977.85))]
BAGS_B = [L((1014.05, 1015.15)), L((1038.45, 1041.3)), L((1067.0, 1070.58), (1070.95, 1073.33))]
BAGS_N = [L((1014.05, 1015.15)), L((1067.0, 1070.58), (1070.95, 1073.33))]
REVEAL = [W(1115.2, 1117.6, 1.0)]  # "I think we're ready!" and the turn with arms out, kept whole
READY = REVEAL + [L((1117.65, 1119.56), (1120.7, 1126.75), (1127.36, 1129.0))]
RINGS = [W(1132.1, 1133.5, 0.0), L((1141.95, 1143.6))]
PERF_Q = [L((1147.9, 1151.0))]
PERF_B = [L((1216.4, 1220.05)), L((1220.3, 1222.65), (1228.08, 1234.5))]
PERF_N = [L((1220.3, 1222.65), (1228.08, 1234.5))]
END = [L((1242.38, 1242.9)), L((1293.28, 1295.55)), L((1301.55, 1303.9))]

# V1/V2: the whole morning in order, coats narrowed to the two he weighs up (leather, brown)
LEATHER_S = [L((767.6, 770.5), (771.5, 773.3)), W(797.4, 799.2, 0.12), L((803.2, 805.65))]
BROWN_S = [W(879.55, 880.0, 0.0), L((890.5, 895.12), (900.06, 903.06))]  # no "I really like" next to the bag line
SLEEVE_SHOW = [L((414.08, 416.72))]  # he walks out of frame on "a bit extra"
BELT_S = [L((333.5, 335.8), (340.3, 342.98)), W(359.2, 361.4)]
SLEEVE_ON_S = [W(481.6, 486.6)]
JEANS_ON_S = [W(94.0, 97.0), W(107.8, 110.0)]
BOOTS_ON_S = [W(665.0, 666.5), W(681.5, 685.0), L((686.7, 687.72))]
INTRO_S = [L((6.3, 12.3), file="intro"), W(13.4, 15.7, 0.3, file="intro")]
BAGS_S_B = [L((1014.05, 1015.15)), L((1038.45, 1041.3)), L((1067.0, 1070.58))]
BAGS_S_N = [L((1014.05, 1015.15)), L((1067.0, 1070.58))]
END_S = [L((1293.28, 1295.55)), L((1301.55, 1303.9))]


def story(brands):
    b = (lambda x, y: x) if brands else (lambda x, y: y)
    return (INTRO_S + OPEN + b(JEANS_B, JEANS_N) + JEANS_ON_S + b(TANK_B, TANK_N) + BELT_S
            + b(SLEEVE_B, SLEEVE_N) + SLEEVE_ON_S + b(BOOTS_B, BOOTS_N) + BOOTS_ON_S + COAT_Q + LEATHER_S
            + BROWN_S + b(BAGS_S_B, BAGS_S_N) + READY + RINGS + PERF_Q + b(PERF_B, PERF_N) + END_S)


# V3 'the coat battle': the base outfit goes by fast, one line per piece, then every coat gets its round
BASE_FAST_B = [L((306.5, 310.1)), L((333.5, 335.8)), W(359.2, 361.4)]
BROWN_R = [W(879.55, 880.0, 0.0), L((890.5, 895.12), (895.52, 899.6)), L((912.3, 917.45))]
BAGS_R = [L((1014.05, 1015.15)), L((1038.45, 1041.3)), L((1067.0, 1070.58), (1070.95, 1073.33))]
V3 = (INTRO_S + [OPEN[0]] + JEANS_B + BASE_FAST_B + SLEEVE_B + BOOTS_B + [BOOTS_ON_S[-1]] + COAT_Q + GREY
      + LEATHER + BROWN_R + BLACK + BAGS_R + READY + [L((1216.4, 1220.05))] + END_S)

# V4 'flash-forward': after the hello, a glimpse of the finished look, then straight back to the robe;
# quick, one beat per piece, no brands, ends on the perfume and the goodbye
FLASH = REVEAL
FINAL = [L((1117.65, 1119.56), (1120.7, 1126.75), (1127.36, 1129.0))]
V4 = (INTRO_S + FLASH + OPEN + JEANS_N + JEANS_ON_S + TANK_N + [BELT_S[0], BELT_S[1]] + SLEEVE_SHOW + SLEEVE_ON_S
      + SLEEVE_VIBE + BOOTS_N + BOOTS_ON_S + COAT_Q + [W(797.4, 799.2, 0.12), L((803.2, 805.65))] + FINAL + PERF_N
      + [END_S[-1]])

CUTS = {
    "grwm_v1_brands": story(True),
    "grwm_v2_nobrands": story(False),
    "grwm_v3_coats": V3,
    "grwm_v4_flash": V4,
}

for name, segs in CUTS.items():
    json.dump(segs, open(os.path.join(OUT, name + ".json"), "w"), indent=1)
    print("wrote", name)
