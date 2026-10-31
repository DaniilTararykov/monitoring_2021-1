"""Put sound effects exactly on the frame — our own take on the «ReelSFX» idea.

Finds the moments in a video that want a sound (hard cuts by default, or explicit times) and mixes real recordings
(from tools/sfx.py / Openverse) onto them, under the existing soundtrack.

usage:
  python3 tools/place_sfx.py <in.mp4> <out.mp4> --cue "<sfx.wav>@<t>[,<t>...][:<gain dB>]" [--cue ...]
                             [--cuts <sfx.wav>[:<gain dB>]] [--every N] [--duck]
  --cue    one sound at given times (seconds), e.g. --cue "paper.wav@0.0:-6" --cue "pen.wav@0.4,1.1,1.9:-10"
  --cuts   one sound on every detected hard cut (ffmpeg scene score > 0.3); --every N keeps every N-th cut
  --duck   lower the music by 4 dB under each effect

prints the cut list it found, so the times can be reused with --cue.
"""
import re
import subprocess
import sys


def cuts(path, thr=0.3):
    out = subprocess.run(['ffmpeg', '-nostdin', '-i', path, '-filter:v', f"select='gt(scene,{thr})',showinfo", '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    return [float(t) for t in re.findall(r'pts_time:([\d.]+)', out)]


def parse_cue(s):
    m = re.match(r'(.+?)@([\d.,]+)(?::(-?[\d.]+))?$', s)
    if not m:
        sys.exit(f'bad --cue {s}')
    return m.group(1), [float(t) for t in m.group(2).split(',')], float(m.group(3) or 0)


def main():
    a = sys.argv[1:]
    src, out = a[0], a[1]
    cues = [parse_cue(a[i + 1]) for i, x in enumerate(a) if x == '--cue']
    if '--cuts' in a:
        spec = a[a.index('--cuts') + 1]
        wav, _, gain = spec.partition(':')
        every = int(a[a.index('--every') + 1]) if '--every' in a else 1
        found = cuts(src)
        print('cuts:', ', '.join(f'{t:.2f}' for t in found))
        cues.append((wav, found[::every], float(gain or 0)))
    inputs, chains, labels = ['-i', src], [], []
    k = 1
    for wav, times, gain in cues:
        for t in times:
            inputs += ['-i', wav]
            ms = int(round(t * 1000))
            chains.append(f'[{k}:a]volume={gain}dB,adelay={ms}|{ms}[s{k}]')
            labels.append(f'[s{k}]')
            k += 1
    has_audio = bool(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', src],
                                    capture_output=True, text=True).stdout.strip())
    sfx = ''.join(labels)
    if has_audio:
        base = '[0:a]volume=-4dB[m]' if '--duck' in a else '[0:a]anull[m]'
        mix = f"{base};{sfx}amix=inputs={len(labels)}:normalize=0[fx];[m][fx]amix=inputs=2:normalize=0:duration=first[out]"
    else:
        mix = f"{sfx}amix=inputs={len(labels)}:normalize=0[out]"
    graph = ';'.join(chains + [mix])
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', *inputs, '-filter_complex', graph, '-map', '0:v', '-map', '[out]',
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', out], check=True)
    print('wrote', out, f'({len(labels)} effects)')


if __name__ == '__main__':
    main()
