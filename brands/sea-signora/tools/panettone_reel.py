"""Three edits of «Robbie's panettone break» from the locked-off shot (IMG_0769/0770/0771)."""
import os, subprocess, sys
SP = '/tmp/claude-0/-home-user-monitoring-2021-1/3cf1f191-8f98-5570-937d-f9b94f309134/scratchpad/pan'
R = '/home/user/monitoring_2021-1/brands/sea-signora/remotion'
F = R + '/public/fonts'
SK, MONO, SER = F + '/Skanaus-Regular.otf', F + '/JetBrainsMono-Medium.ttf', F + '/Spectral-Italic.otf'
IV, OR = '0xF8F6F5', '0xE57533'
GRADE = 'eq=brightness=0.03:contrast=1.05:saturation=1.06,colorbalance=rm=0.02:bm=-0.01'
# the locked shot is pushed down 200 px (the counter front is cropped) so the titles sit on dark marble, above every head
SHIFT = 'crop=1080:1720:0:0,pad=1080:1920:0:200:color=0x0A0A0A,gblur=sigma=0:steps=1'
MAIN, CLOSE, END = SP + '/p0769.mp4', SP + '/p0770.mp4', SP + '/p0771.mp4'
os.makedirs(SP + '/build/t', exist_ok=True)
n = [0]

def tf(text):
    n[0] += 1; p = f'{SP}/build/t/{n[0]}.txt'; open(p, 'w').write(text); return p

def T(text, font=SK, size=64, color=IV, y=290, t0=0, t1=999, x='(w-text_w)/2'):
    return (f"drawtext=fontfile={font}:textfile={tf(text)}:fontsize={size}:fontcolor={color}:x={x}:y={y}:line_spacing=6"
            f":text_align=center:shadowcolor=black@0.4:shadowx=0:shadowy=2:enable='between(t,{t0},{t1})'")

SHIFT_ON = True

def build(name, segs, music, music_from=0, global_texts=()):
    parts = []
    for i, (src, ss, dur, texts) in enumerate(segs):
        vf = ','.join([GRADE] + ([SHIFT] if (src != CLOSE and SHIFT_ON) else []) + [T(**t) for t in list(texts)])
        out = f'{SP}/build/{name}_{i:02d}.mp4'
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(ss), '-t', str(dur), '-i', src, '-vf', vf, '-an', '-r', '30',
                        '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', out], check=True)
        parts.append(out)
    lst = f'{SP}/build/{name}.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    v = f'{SP}/build/{name}_v.mp4'
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', v], check=True)
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v], capture_output=True, text=True).stdout)
    gvf = ','.join(T(**t) for t in global_texts) or 'null'
    out = f'{R}/out/panettone-{name}.mp4'
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', v, '-ss', str(music_from), '-i', f'{R}/public/music/{music}.mp3', '-vf', gvf,
                    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p',
                    '-af', f'afade=t=in:d=0.3,afade=t=out:st={d - 1.2:.2f}:d=1.2', '-c:a', 'aac', '-b:a', '192k', '-t', f'{d:.2f}', out], check=True)
    print(name, round(d, 1), out)

THIEVES = [(31.2, 32.9), (42.6, 44.3), (55.0, 56.7), (65.6, 67.3), (74.0, 75.7), (84.6, 86.3), (97.4, 99.4)]
K = dict(font=MONO, size=26, color=OR)
LBL = dict(font=MONO, size=30, color=IV)

which = sys.argv[1:] or ['coffee-break', 'whodunit', 'rule-no1']

# 1 · «Robbie's coffee break» — the story told in order, a bite counter, the chef's face at the end
if 'coffee-break' in which:
    segs = [(MAIN, 16.0, 7.8, [dict(text="ROBBIE'S COFFEE BREAK", size=66, y=260), dict(text='panettone · espresso · 5 minutes', y=350, **K),
                               dict(text='"chef, one second?"', font=SER, size=46, y=410, t0=5.6)])]
    for i, (a, b) in enumerate(THIEVES):
        segs.append((MAIN, a, b - a, [dict(text=f'bite n°{i + 1}', y=300, **LBL)]))
        if i == 3:
            segs.append((CLOSE, 2.4, 1.5, [dict(text='+ the crème', y=300, **LBL)]))
    segs.append((END, 21.0, 4.6, [dict(text='5 minutes later', y=300, **K), dict(text='BREAK OVER', size=66, y=345),
                                  dict(text='Panettone season at Sea, Signora', y=1560, t0=2.6, **K)]))
    build('coffee-break', segs, 'bossa-sea')

# 2 · «Who ate the chef's panettone?» — cold open on the empty tray, then the suspects, verdict: everyone
if 'whodunit' in which:
    segs = [(END, 21.6, 3.2, [dict(text="WHO ATE THE CHEF'S PANETTONE?", size=56, y=245)]),
            (MAIN, 16.9, 3.3, [dict(text='10 minutes earlier', y=245, **K), dict(text='the chef takes a break', font=SER, size=46, y=285)])]
    SUSPECTS = [t for j, t in enumerate(THIEVES) if j != 5]  # n°6 and n°7 were the same person: one take only
    for i, (a, b) in enumerate(SUSPECTS):
        last = i == len(SUSPECTS) - 1
        segs.append((MAIN, a + 0.2, (b - a) - 0.2 + (0.8 if last else 0),
                     [dict(text=f'suspect n°{i + 1}', y=245, **K)] + ([dict(text='VERDICT: EVERYONE', size=62, y=290, t0=1.0)] if last else [])))
    segs.append((CLOSE, 0.6, 2.2, [dict(text="CAN YOU\nBLAME THEM?", size=72, y=300), dict(text='Panettone season at Sea, Signora', y=480, **K)]))
    SHIFT_ON = False
    build('whodunit', segs, 'noir-jazz')
    SHIFT_ON = True

# 3 · «Rule n°1» — one locked frame, people pop in on every second beat (122 bpm), the rule stays on screen
if 'rule-no1' in which:
    B2 = 2 * 60 / 122
    segs = [(MAIN, 16.0, B2, []), (MAIN, 19.4, B2, []), (MAIN, 22.6, 1.5 * B2, [])]
    for a, b in THIEVES:
        c = (a + b) / 2; segs.append((MAIN, c - B2 / 2, B2, []))
    segs.append((CLOSE, 2.6, B2, []))
    segs.append((END, 21.2, 4.2, [dict(text='Panettone season at Sea, Signora', y=1560, t0=2.0, **K)]))
    build('rule-no1', segs, 'brera-house', global_texts=[
        dict(text='rule n°1 of our kitchen', y=250, **K), dict(text='NEVER LEAVE YOUR\nPANETTONE UNATTENDED', size=62, y=300)])
