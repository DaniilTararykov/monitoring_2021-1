"""Sea, Signora — first birthday reel (12.11), three cuts from the event footage.

Every cut opens on Antonio at the aquarium («…è il nostro compleanno… cin cin»), his own voice over a low music bed;
the track comes up on «cin cin» and the montage runs cut-on-the-bar to the end. 1080×1920, 60 fps, h264 + aac −14 LUFS.

usage: python birthday_reel.py <px-dir> <music-dir> <out-dir> [story|flow|cinema]...
  px-dir: 1080×1920 proxies IMG_XXXX.mp4 (30 fps sources re-timed to 60), music-dir: brera-house / italo-arp / velvet-strings
Per shot: (clip, start s, bars, options) — options: slow (0.5× with motion interpolation), zoom (punch-in), fx/fy (zoom
centre, %), stab (vidstab for hand-held shots). Shots never include plates being handed round (client 15.11), empty tables,
blurred or unhappy moments.
"""
import json
import os
import subprocess
import sys
import tempfile

W, H, FPS = 1080, 1920, 60
INTRO = ('IMG_2591', 1.50, 9.80)          # Antonio: «è finalmente passato un anno… cin cin» (ends 11.02 in the clip)
INTRO_LEN = 9.6                            # music comes up here (on the bar)

GRADE = {
    'warm': 'eq=contrast=1.05:saturation=1.06:brightness=0.012,colorbalance=rm=0.025:bm=-0.02:rh=0.015:bh=-0.015',
    'clean': 'eq=contrast=1.04:saturation=1.03:brightness=0.018,colorbalance=rs=-0.025:bs=0.01:rh=-0.015',
    'film': "eq=contrast=1.07:saturation=0.96:brightness=0.005,curves=all='0/0.03 0.5/0.5 1/0.97',"
            'colorbalance=rs=0.01:bs=0.02:rh=0.02:bh=-0.02,vignette=angle=PI/5',
}

# ───────────────────────────────────────── the three cuts
CUTS = {
    # 1 · chronological story, house, 123 bpm — aperitivo → tuna show → dinner → cake
    'story': dict(music='brera-house.mp3', bar0=11.09, grade='warm', shots=[
        ('IMG_2673', 2.30, 2, {}),                         # spritz poured down the bar, right on «cin cin»
        ('IMG_2568', 8.00, 1, {'stab': 1}),                # the birthday menu on the plate
        ('IMG_2607', 2.90, 1, {}),                         # guests arriving
        ('IMG_2619', 0.40, 1, {}),                         # the room fills, aquarium
        ('IMG_2578', 2.30, 1, {}),                         # dj
        ('IMG_2611', 0.20, 1, {'stab': 1}),                # the bluefin's eye
        ('IMG_2576', 3.90, 1, {}),                         # first cut
        ('IMG_2583', 13.0, 1, {}),                         # the team at the fish
        ('IMG_2640', 29.6, 2, {}),                         # the loin lifted for the room
        ('IMG_2671', 12.3, 1, {}),                         # everyone filming the show
        ('IMG_2642', 8.00, 1, {}),                         # slicing the loin
        ('IMG_2663', 0.00, 1, {'stab': 1}),                # portions
        ('IMG_2690', 9.50, 1, {}),                         # full house
        ('IMG_2699', 1.00, 1, {'stab': 1}),                # tagliolini with tuna tartare
        ('IMG_2699', 8.30, 1, {'stab': 1}),                # …and the first forkful
        ('IMG_2674', 16.0, 1, {'stab': 1}),                # the tuna platter by the aquarium
        ('IMG_2674', 3.20, 1, {'stab': 1}),                # Antonio tastes
        ('IMG_2713', 8.50, 1, {'stab': 1}),                # the cake rolls in
        ('IMG_2719', 2.00, 2, {}),                         # Antonio opens the shell
        ('IMG_2719', 13.5, 1, {}),                         # gives the first shell
        ('IMG_2719', 16.4, 1, {}),                         # …held up high
        ('IMG_2719', 10.0, 1, {}),                         # the team cheers
        ('IMG_2713', 22.4, 1.6, {'stab': 1, 'end': 1}),    # Sea, Signora on the cake
    ]),
    # 2 · grouped by theme, italo, 115 bpm — one bar a shot, never faster: drinks & guests → kitchen → plates → cake
    'flow': dict(music='italo-arp.mp3', bar0=11.13, grade='clean', shots=[
        ('IMG_2673', 5.40, 1, {}),                         # pouring, the bartender smiles
        ('IMG_2647', 8.70, 1, {}),                         # friends with spritz
        ('IMG_2633', 1.10, 1, {}),
        ('IMG_2624', 0.00, 1, {}),                         # two guests, glasses up
        ('IMG_2626', 3.70, 1, {}),                         # a table already laughing
        ('IMG_2612', 0.00, 1, {}),                         # the tuna on the counter
        ('IMG_2604', 3.60, 1, {}),
        ('IMG_2640', 30.0, 1, {}),                         # the loin up
        ('IMG_2641', 0.20, 1, {'stab': 1}),                # hands on the loin
        ('IMG_2689', 1.50, 1, {'stab': 1}),                # tartare by knife
        ('IMG_2666', 16.3, 1, {}),                         # open kitchen
        ('IMG_2693', 22.4, 1, {'stab': 1}),                # the grill
        ('IMG_2705', 8.70, 1, {}),                         # tuna, greens, glaze
        ('IMG_2699', 8.30, 1, {'stab': 1}),                # the first forkful
        ('IMG_2680', 7.30, 1, {}),                         # full house
        ('IMG_2692', 0.60, 1, {'stab': 1}),                # laughter at the banquette
        ('IMG_2684', 0.40, 1, {}),                         # the long table
        ('IMG_2716', 3.70, 1, {'stab': 1}),                # the cake
        ('IMG_2709', 3.00, 1, {'stab': 1}),                # Antonio with the silver shell
        ('IMG_2719', 3.40, 1, {}),                         # the shell opens
        ('IMG_2719', 13.5, 1, {}),                         # the first shell
        ('IMG_2719', 33.6, 1, {}),                         # Antonio laughing
        ('IMG_2678', 3.00, 1.6, {'end': 1}),               # the whole room, Antonio in the middle
    ]),
    # 3 · cinematic, strings, 91 bpm — longer shots, slow motion on the big moments, film grade
    'cinema': dict(music='velvet-strings.mp3', bar0=11.68, grade='film', shots=[
        ('IMG_2673', 2.40, 1, {'slow': 1}),                # the pour, slowed
        ('IMG_2575', 1.00, 1, {'stab': 1}),                # menu, glass, spoon
        ('IMG_2643', 2.00, 1, {}),                         # the room under the shell lamp
        ('IMG_2624', 0.00, 1, {}),                         # two guests, glasses up
        ('IMG_2583', 13.0, 1, {}),                         # the bluefin
        ('IMG_2640', 29.2, 1, {'slow': 1}),                # the loin lifted, slowed
        ('IMG_2642', 27.0, 1, {}),                         # slicing
        ('IMG_2699', 1.00, 1, {'slow': 1, 'stab': 1}),     # the plate, slowed
        ('IMG_2705', 8.70, 1, {}),                         # tuna, greens, glaze
        ('IMG_2674', 16.0, 1, {'stab': 1}),                # the platter by the aquarium
        ('IMG_2690', 9.50, 1, {}),                         # full house
        ('IMG_2687', 0.40, 1, {}),                         # friends at the table
        ('IMG_2713', 8.60, 1, {'stab': 1}),                # the cake arrives
        ('IMG_2719', 3.00, 1, {'slow': 1}),                # the shell lifted, slowed
        ('IMG_2719', 13.5, 1, {}),                         # the first shell
        ('IMG_2719', 33.6, 1, {}),                         # Antonio laughing
        ('IMG_2595', 0.50, 1, {}),                         # the aquarium, breathing out
        ('IMG_2713', 22.4, 1.5, {'stab': 1, 'end': 1}),    # Sea, Signora
    ]),
}
BPM = {'brera-house.mp3': 123.0, 'italo-arp.mp3': 114.8, 'velvet-strings.mp3': 90.7}


def run(*a):
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', *map(str, a)], check=True)


def shot(px, clip, start, dur, o, grade, out, tmp):
    """One shot → exactly round(dur·60) frames at 1080×1920/60, graded, silent."""
    n = round(dur * FPS)
    slow = 0.5 if o.get('slow') else 1.0
    src_len = dur * slow + 0.3
    pre = []
    if o.get('stab'):
        trf = os.path.join(tmp, f'{os.path.basename(out)}.trf')
        run('-ss', start, '-t', src_len, '-i', f'{px}/{clip}.mp4', '-vf', f'fps=30,vidstabdetect=shakiness=6:accuracy=12:result={trf}', '-f', 'null', '-')
        pre.append(f'vidstabtransform=input={trf}:smoothing=18:zoom=4:optzoom=0:interpol=bicubic')
    z = o.get('zoom', 1.0)
    vf = ['fps=30', *pre]
    if slow != 1.0:
        vf += [f'setpts={1 / slow}*PTS', "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"]
    if z != 1.0:
        fx, fy = o.get('fx', 50) / 100, o.get('fy', 50) / 100
        vf.append(f'crop=iw/{z}:ih/{z}:(iw-iw/{z})*{fx}:(ih-ih/{z})*{fy}')
    vf += [f'scale={W}:{H}:flags=lanczos', f'fps={FPS}', GRADE[grade], 'format=yuv420p']
    run('-ss', start, '-t', src_len, '-i', f'{px}/{clip}.mp4', '-vf', ','.join(vf), '-an', '-frames:v', n,
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-r', FPS, out)
    return n


def build(name, px, mus, outdir):
    c = CUTS[name]
    bar = 4 * 60 / BPM[c['music']]
    tmp = tempfile.mkdtemp(prefix=f'bd-{name}-')
    segs, plan, t = [], [], 0.0
    # intro: Antonio, his own sound
    a, ln = INTRO[1], INTRO_LEN
    intro = os.path.join(tmp, '00.mp4')
    shot(px, INTRO[0], a, ln, {}, c['grade'], intro, tmp)
    segs.append(intro); t = ln
    edge = ln
    for i, (clip, st, bars, o) in enumerate(c['shots'], 1):
        edge += bars * bar
        n_end = round(edge * FPS); n0 = round(t * FPS)
        d = (n_end - n0) / FPS
        f = os.path.join(tmp, f'{i:02d}.mp4')
        shot(px, clip, st, d, o, c['grade'], f, tmp)
        segs.append(f); plan.append((round(t, 2), clip, st, round(d, 2), o)); t = n_end / FPS
    total = t
    lst = os.path.join(tmp, 'list.txt')
    open(lst, 'w').write(''.join(f"file '{s}'\n" for s in segs))
    video = os.path.join(tmp, 'video.mp4')
    run('-f', 'concat', '-safe', 0, '-i', lst, '-c', 'copy', video)
    # audio: voice for the intro (with a soft tail), music under it, up on «cin cin», fade out at the end
    off = c['bar0'] - INTRO_LEN
    fade = 1.2
    af = (f"[1:a]atrim={off}:{off + total},asetpts=PTS-STARTPTS,"
          f"volume='if(lt(t,{INTRO_LEN - 0.35}),0.16,if(lt(t,{INTRO_LEN}),0.16+(t-{INTRO_LEN - 0.35})/0.35*0.84,1))':eval=frame,"
          f"afade=t=out:st={total - fade}:d={fade}[m];"
          f"[0:a]atrim={a}:{a + ln + 0.25},asetpts=PTS-STARTPTS,highpass=f=90,acompressor=threshold=-20dB:ratio=3,volume=2.2,"
          f"afade=t=out:st={ln - 0.15}:d=0.4,apad[v];"
          f"[v][m]amix=inputs=2:duration=longest:normalize=0,atrim=0:{total}[a]")
    mixed = os.path.join(tmp, 'mixed.mp4')
    vfade = f'fade=t=out:st={total - 0.8}:d=0.8'
    run('-i', f'{px}/{INTRO[0]}.mp4', '-i', f'{mus}/{c["music"]}', '-i', video, '-filter_complex', af + f';[2:v]{vfade}[vo]',
        '-map', '[vo]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-r', FPS, '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', mixed)
    out = os.path.join(outdir, f'signora-birthday-{name}.mp4')
    loud(mixed, out)
    json.dump({'cut': name, 'total': round(total, 2), 'plan': plan}, open(out[:-4] + '.json', 'w'), indent=1)
    print(name, round(total, 2), 's', out)


def loud(src, out):
    target = 'I=-14:TP=-1.5:LRA=11'
    r = subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-i', src, '-af', f'loudnorm={target}:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
    af = (f"loudnorm={target}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    run('-i', src, '-c:v', 'copy', '-af', af, '-ar', 48000, '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', out)


if __name__ == '__main__':
    px, mus, outdir = sys.argv[1:4]
    os.makedirs(outdir, exist_ok=True)
    for name in sys.argv[4:] or list(CUTS):
        build(name, px, mus, outdir)
