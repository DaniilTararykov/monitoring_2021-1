"""Second round of GRWM edit lists (IMG_2769 + intro IMG_2768).

V1 full    : the whole get-ready-with-me, every beat in order, all brands      -> src/grwm2_v1_full.json
V3 coats   : the coat battle, tightened, all brands                           -> src/grwm2_v3_coats.json
V5 rewind  : final look first, a fast rewind back to the robe, then the story  -> src/grwm2_v5_rewind.json
V6 speed   : dressing at double speed under his voice, verdicts in sync        -> src/grwm2_v6_speed.json

Rules: no shot of him silent; every action shot carries his voice (voice-over), talking shots stay in sync;
whole sentences from the cleanest take; brands all or none; no fade at the end.
"""
import json
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "src")


def L(*r, v=None, **kw):  # a spoken line from the main clip, pauses removed, a little air around it
    d = {"a": [list(x) for x in r], "breathe": True, **kw}
    if v:
        d["v"] = v
    return d


def VO(src, dur=0.0, **kw):  # footage laid under the voice
    return {"src": src, "dur": dur, **kw}


def LIP(d=0.0, upto=None):  # back to the synced picture (for d seconds, or until sound range `upto` starts)
    return {"lip": d} if upto is None else {"lip": d, "upto": upto}


def VOU(src, upto, **kw):  # footage under the voice until sound range `upto` starts
    return {"src": src, "dur": 0.0, "upto": upto, **kw}


REVEAL = {"a": [[1115.2, 1117.6]], "raw": True, "vol": 1.0}  # "I think we're ready!" + the turn, arms out

# ---------------------------------------------------------------- the beats, cleanest takes
HELLO = L((6.3, 12.3), file="intro")
NO_IDEA = L((6.75, 8.28), (16.37, 19.32), v=[VO(13.4, 2.3, file="intro"), LIP()])  # walk + robe wipe, then the robe
CASUAL = L((79.36, 81.12))
JEANS = {True: L((83.1, 84.75), (85.72, 87.48), (87.84, 88.37), (88.55, 89.18), v=[LIP(upto=1), VO(93.6)]),
         False: L((83.1, 83.92), (85.72, 87.48), (87.84, 88.37), (88.55, 89.18), v=[LIP(upto=1), VO(93.6)])}
JEANS_BOOTS = L((200.1, 207.5), (207.96, 211.54), v=[VO(107.0, 3.0), LIP()])  # robe off, then "free to me" in sync
TANK = {True: L((306.5, 313.7)), False: L((306.5, 309.06), (310.12, 313.7))}
BELT = L((333.5, 335.8), (340.3, 342.92), (345.95, 351.1))  # "...for decades. You can see ... I have this from my father"
BELT_ON = L((361.45, 363.5))  # threading it, in sync
SEAT_BELT = L((397.45, 400.85))
SIMPLE = L((408.18, 412.95), (414.3, 416.72))
SLEEVE = {True: L((456.1, 460.7)), False: L((456.1, 458.22))}
SLEEVE_ON = L((471.9, 472.7), (472.9, 475.05), (573.2, 577.85), v=[LIP(upto=1), VO(481.6, 4.8), LIP()])  # over the head, then the jeans vibe
COAT_WHY = L((533.7, 537.12), (538.4, 539.92), (546.5, 552.0), (553.0, 556.84), (557.7, 561.55))  # no "have a have a"
HARDEST = L((578.5, 583.94), (585.7, 587.4))
BOOTS = {True: L((658.3, 661.2), (661.25, 662.26), (686.7, 687.72), v=[LIP(upto=1), VO(664.9, 1.3), VO(681.6)]),
         False: L((658.3, 659.6), (661.28, 662.26), (686.7, 687.72), v=[LIP(upto=1), VO(664.9, 1.3), VO(681.6)])}
GREY = L((706.31, 707.97), (714.61, 717.3), v=[LIP(upto=1), LIP(1.2), VO(722.6)])  # putting the grey coat on under the voice
GREY_SEE = L((731.3, 732.4))
GREY_NO = L((747.95, 750.4))
LEATHER = L((767.6, 770.5), (771.5, 773.3), (774.2, 780.35), v=[VO(766.9, 0.6), LIP()])  # jacket wipe in
LEATHER_SLEEVE = L((788.0, 794.6))
LEATHER_OK = L((803.2, 805.65), (806.55, 809.4), v=[VO(796.6, 2.4), LIP()])  # puts it on while he says "actually..."
BROWN = L((890.5, 895.12), (895.52, 899.6), (899.85, 903.06), v=[VO(879.5, 0.5), LIP()])
THIRD = L((912.3, 917.45))
BLACK = L((957.4, 959.05), (960.02, 962.9), (971.0, 977.85), v=[VO(955.5, 0.5), LIP()])  # stripes line stumbles
BAG_LIKE = L((1014.05, 1015.15))
BAG_BRAND = L((1038.45, 1041.3))
BAG_NO = L((1056.3, 1059.3), (1070.95, 1073.33), (1073.36, 1074.86), (1075.0, 1077.45))  # the other take has an "uh" before "coat"  # "...back in one second with my final look"
FINAL = L((1117.65, 1119.56), (1120.7, 1126.75), (1127.36, 1129.0))
RINGS = L((1141.95, 1143.6), v=[VO(1132.1, 1.4), LIP()])
LAST_TOUCH = L((1147.9, 1151.0))
PERFUME_B = L((1191.6, 1196.0), (1199.5, 1201.95), (1204.4, 1207.4))  # Kilian, close up; heavy, leather-ish; suits the look
PERFUME_N = L((1220.3, 1222.65), (1228.08, 1234.5))
DONE = L((1242.38, 1242.9))
ASK = L((1293.28, 1295.55))
BYE = L((1301.55, 1303.9))


def full(b):
    return [HELLO, NO_IDEA, CASUAL, JEANS[b], JEANS_BOOTS, TANK[b], BELT, BELT_ON, SLEEVE[b],
            SLEEVE_ON, COAT_WHY, HARDEST, BOOTS[b], GREY, GREY_SEE, GREY_NO, LEATHER, LEATHER_SLEEVE, LEATHER_OK,
            BROWN, BLACK, BAG_LIKE] + ([BAG_BRAND] if b else []) + [
            BAG_NO, REVEAL, FINAL, RINGS, LAST_TOUCH, PERFUME_B if b else PERFUME_N, ASK, BYE]


# ---------------------------------------------------------------- V3: the coat battle
TANK_SHORT = L((306.5, 310.1))
PERFUME_SHORT = L((1191.6, 1196.0), (1199.5, 1201.95))
COAT_WHY_SHORT = L((533.7, 537.12), (538.4, 539.92), (546.5, 552.0))
LEATHER_SHORT = L((767.6, 770.5), (771.5, 773.3), v=[VO(766.9, 0.6), LIP()])
BROWN_SHORT = L((890.5, 895.12), (899.85, 903.06), v=[VO(879.5, 0.5), LIP()])
BLACK_SHORT = L((957.4, 959.05), (960.02, 962.9), (971.0, 975.2), v=[VO(955.5, 0.5), LIP()])
BELT_FATHER = L((333.5, 335.8), (340.3, 342.92), (349.78, 351.1))
KILIAN = L((1191.6, 1196.0))
LEATHER_IN = L((767.6, 770.5), v=[VO(766.9, 0.6), LIP()])
V3 = [HELLO, NO_IDEA, JEANS[True], TANK_SHORT, BELT_FATHER, SLEEVE[True], SLEEVE_ON, BOOTS[True], COAT_WHY_SHORT,
      HARDEST, GREY, GREY_NO, LEATHER_IN, LEATHER_SLEEVE, LEATHER_OK, BROWN_SHORT, BLACK_SHORT, BAG_LIKE, BAG_BRAND,
      BAG_NO, REVEAL, FINAL, KILIAN, BYE]

# ---------------------------------------------------------------- V5: rewind (no brands)
# the finished look first, then the whole try-on runs backwards at speed under "I don't know what to wear",
# landing on the robe; from there the story runs forward to the look we already saw.
# backwards, newest first: the turn in the final look, bags, black coat, brown, leather on, grey on, boots,
# long sleeve over the head, belt, robe back on, jeans off
REW = [1116.4, 1005.0, 956.0, 880.4, 796.4, 722.5, 681.0, 482.0, 356.5, 106.8, 93.6]
REWIND = L((6.75, 8.28), (16.37, 19.32), v=[VO(t, 0.3, speed=7.0, rev=True) for t in REW] + [LIP()])
FLASH_LINE = L((1117.65, 1119.56), (1120.7, 1124.05))
STILL_OK = L((1124.38, 1126.75), (1127.36, 1129.0))
V5 = [HELLO, REVEAL, FLASH_LINE, REWIND, CASUAL, JEANS[False], TANK[False], BELT_FATHER, SLEEVE[False], SLEEVE_ON,
      BOOTS[False], COAT_WHY_SHORT, HARDEST, GREY, GREY_NO, LEATHER_OK, BROWN, BLACK, BAG_LIKE, BAG_NO,
      STILL_OK, RINGS, PERFUME_N, BYE]

# ---------------------------------------------------------------- V6: speed run (brands)
# every bit of dressing plays at double/triple speed under his voice; whatever he says to camera stays in sync
JEANS_FAST = L((83.1, 84.75), (85.72, 87.48), (87.84, 88.37), (88.55, 89.18), (208.64, 211.54),
               v=[LIP(upto=1), VO(93.6, 2.6, speed=2.5), VO(103.0, 0.0, speed=2.5)])
BELT_FAST = L((361.45, 363.5), (397.45, 400.85), v=[LIP(upto=1), VOU(364.0, 1, speed=1.0), LIP()])
SLEEVE_FAST = L((456.1, 460.7), (471.9, 472.7), (472.9, 475.05), v=[LIP(upto=2), VO(476.0, speed=3.0)])
VIBE = L((573.2, 577.85))
BOOTS_FAST = L((658.3, 661.2), (661.25, 662.26), (578.5, 583.94), (585.7, 587.4), (686.7, 687.72),
               v=[LIP(upto=1), VOU(663.4, 4, speed=3.6), LIP()])
GREY_FAST = L((706.31, 707.97), (714.61, 717.3), (731.3, 732.4), v=[LIP(upto=1), VOU(720.3, 2, speed=2.0), LIP()])
LEATHER_FAST = L((788.0, 794.6), (803.2, 805.65), (806.55, 809.4), v=[LIP(2.0), VOU(795.6, 1, speed=1.6), LIP()])
V6 = [HELLO, NO_IDEA, JEANS_FAST, TANK[True], BELT_FATHER, BELT_FAST, SLEEVE_FAST, BOOTS_FAST,
      GREY_FAST, GREY_NO, LEATHER_SHORT, LEATHER_FAST, BROWN_SHORT, BLACK_SHORT, BAG_BRAND, BAG_NO, REVEAL, FINAL,
      KILIAN, BYE]

# ---------------------------------------------------------------- round three: V3 and V6 fixed
# - "decades" is no longer cut right after the word: the line runs on to "old vintage vibe"
# - the leather jacket keeps "it's a vintage one ... dark brown, blackish color"
# - in order of the shoot: coat talk (still in socks) comes before the boots; no boots-on footage,
#   just "I'm gonna wear these boots ... let's try them on" and then standing in them: "They look nice."
# - the story beats: what he wants (casual), why not the usual coat (worn five days, photos tonight),
#   the leather jacket as "maybe", the bags settle it, the leather-ish perfume to finish
BELT3 = L((333.5, 335.8), (340.3, 345.6), (345.95, 351.1))
LEATHER3 = L((767.6, 771.56), (771.56, 773.3), (774.2, 780.35), v=[VO(766.9, 0.8), LIP()])
BOOTS3 = [L((658.3, 661.2), (661.25, 662.26)), L((686.7, 687.72))]
ENDING3 = [REVEAL, FINAL, PERFUME_B, ASK, BYE]

V3C = ([HELLO, NO_IDEA, CASUAL, JEANS[True], TANK[True], BELT3, SLEEVE[True], SLEEVE_ON, COAT_WHY, HARDEST] + BOOTS3
       + [GREY, GREY_NO, LEATHER3, LEATHER_SLEEVE, LEATHER_OK, BROWN_SHORT, BLACK, BAG_LIKE, BAG_BRAND, BAG_NO]
       + ENDING3)

SLEEVE_FAST3 = L((456.1, 460.7), (472.9, 475.05), v=[LIP(upto=1), VO(476.0, speed=3.0)])  # "...B3. And let's see how it will be."
V6C = ([HELLO, NO_IDEA, CASUAL, JEANS_FAST, TANK[True], BELT3, BELT_ON, SLEEVE_FAST3, VIBE, COAT_WHY, HARDEST] + BOOTS3
       + [GREY_FAST, GREY_NO, LEATHER3, LEATHER_FAST, BROWN_SHORT, BLACK, BAG_LIKE, BAG_BRAND, BAG_NO]
       + ENDING3)

# ---------------------------------------------------------------- round four
# the bags as a real decision: both are Elijah; the big black one he wears too often, so the baggy brown one;
# it does not go with the black coat -> the leather jacket with the bag he wanted
BAGS4 = [L((1009.2, 1010.5), (1014.05, 1015.15)),                       # "So for the bags, I really like this bag."
         L((1038.45, 1041.3)),                                          # "They're both from the same brand, which is Elijah."
         L((1042.31, 1045.71), (1047.21, 1048.17), (1048.17, 1051.6), (1052.5, 1053.85)),
         # "But I don't want to wear this one today because I've been wearing this very often,
         #  so I think I'm gonna have this one, a bit baggy."
         BAG_NO]                                                        # "...with this coat it's not matching ... final look."
WHICH = L((920.2, 921.98))  # "I think I know which one is better."
PHOTOS = L((553.0, 556.84), (557.7, 561.55))  # "And today probably I'm gonna take some videos and photos..."

V3D = ([HELLO, NO_IDEA, CASUAL, JEANS[True], TANK[True], BELT3, SLEEVE[True], SLEEVE_ON, COAT_WHY, HARDEST] + BOOTS3
       + [GREY, GREY_NO, LEATHER3, LEATHER_SLEEVE, LEATHER_OK, BROWN_SHORT, THIRD, WHICH, BLACK_SHORT] + BAGS4 + ENDING3)
V6D = ([HELLO, NO_IDEA, CASUAL, JEANS_FAST, TANK[True], BELT3, BELT_ON, SLEEVE_FAST3, VIBE, COAT_WHY, HARDEST] + BOOTS3
       + [GREY_FAST, GREY_NO, LEATHER3, LEATHER_FAST, BROWN_SHORT, THIRD, WHICH, BLACK_SHORT] + BAGS4 + ENDING3)
# no grey coat: the hardest part is the top, the vintage leather jacket is the first option,
# then the washed brown leather against the black coat, and the bags decide
V7 = ([HELLO, NO_IDEA, CASUAL, JEANS[True], TANK[True], BELT3, SLEEVE[True], SLEEVE_ON, PHOTOS, HARDEST] + BOOTS3
      + [LEATHER3, LEATHER_SLEEVE, LEATHER_OK, BROWN, THIRD, WHICH, BLACK_SHORT] + BAGS4 + ENDING3)

# ---------------------------------------------------------------- round five: the no-grey cut, filled in
# no "it's Friday" in the hello; the belt ends on "decades" (cut before the next word, so it is heard whole)
# and buckles up as an airplane seat belt; hair and rings shown close up before the perfume
HELLO5 = L((6.3, 7.8), (9.25, 12.3), file="intro")  # "Hi everyone! Let's get ready with me for drinks with my friends."
BELT5 = L((333.5, 335.8), (340.3, 343.2), (345.95, 351.1))
FINAL5 = L((1117.65, 1119.56), (1120.7, 1126.75), (1127.36, 1128.2))  # "...kind of okay, it's kind of nice."
HAIR_RINGS = L((1133.5, 1134.9), (1141.95, 1143.6), (1145.9, 1147.1))
V8 = ([HELLO5, NO_IDEA, CASUAL, JEANS[True], TANK[True], BELT5, SEAT_BELT, SLEEVE[True], SLEEVE_ON, PHOTOS, HARDEST]
      + BOOTS3 + [LEATHER3, LEATHER_SLEEVE, LEATHER_OK, BROWN, THIRD, WHICH, BLACK_SHORT] + BAGS4
      + [REVEAL, FINAL5, HAIR_RINGS, PERFUME_B, ASK, BYE])

# ---------------------------------------------------------------- round six: short, one jacket
# follows his own re-edit (no "don't know what to wear", "This is from B3", "...this jacket ... kind of nice"),
# then: only the leather jacket (no other options, no "first option"), no "I'm gonna wear it" before the
# sleeve goes on (it plays under "I really like these sleeves"), no second "you can see I've been wearing it"
BELT9 = L((333.5, 335.8), (340.3, 343.2), (349.78, 351.1))
SLEEVE9 = L((456.1, 458.22), (458.3, 458.75), (460.05, 460.7))  # "And I have this long sleeve ... This is from B3."
SLEEVE_ON9 = L((573.2, 577.85), v=[VO(481.6, 3.0), LIP()])
LEATHER9 = L((769.4, 771.56), (771.56, 773.3), (774.2, 780.35), v=[VO(766.9, 0.8), LIP()])  # "A leather jacket, it's a vintage one..."
LEATHER_ON9 = L((788.0, 789.85), (803.2, 805.65), v=[LIP(upto=1), VO(796.6, 1.4), LIP()])  # not sure -> puts it on -> not bad
FINAL9 = L((1117.65, 1119.6), (1122.0, 1124.7), (1127.36, 1128.2))  # "...with this jacket with this bag that I wanted and I think it's kind of nice"
V9 = ([HELLO5, CASUAL, JEANS[True], TANK[True], BELT9, SEAT_BELT, SLEEVE9, SLEEVE_ON9] + BOOTS3
      + [LEATHER9, LEATHER_ON9, REVEAL, FINAL9, HAIR_RINGS, PERFUME_B, ASK, BYE])

CUTS = {"grwm6_short": V9, "grwm5_nogrey": V8, "grwm2_v1_full": full(True), "grwm2_v3_coats": V3, "grwm2_v5_rewind": V5, "grwm2_v6_speed": V6,
        "grwm3_coats": V3C, "grwm3_speed": V6C, "grwm4_coats": V3D, "grwm4_speed": V6D, "grwm4_nogrey": V7}

if __name__ == "__main__":
    for name, segs in CUTS.items():
        json.dump(segs, open(os.path.join(OUT, name + ".json"), "w"), indent=1)
        print("wrote", name)
