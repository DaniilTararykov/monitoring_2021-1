"""Sound for the «UNO» birthday reel: Antonio's own voice for the intro over our arranged track, mastered to −14 LUFS.

usage: python birthday_mix.py <muted.mp4> <IMG_2591.mp4> <track.mp3> <out.mp4> [voice_from=1.36] [intro=9.677]
The Remotion render (BirthdayUno) is silent; the track's bar 0 is frame 0, so nothing needs shifting.
"""
import json
import subprocess
import sys


def run(*a):
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', *map(str, a)], check=True)


def main(video, voice, track, out, vfrom=1.36, intro=9.677):
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video],
                               capture_output=True, text=True).stdout)
    af = (f"[1:a]atrim={vfrom}:{vfrom + intro + 0.3},asetpts=PTS-STARTPTS,highpass=f=90,"
          f"acompressor=threshold=-22dB:ratio=3:attack=5:release=120,volume=2.4,afade=t=out:st={intro - 0.05}:d=0.35,apad[v];"
          f"[2:a]atrim=0:{dur},asetpts=PTS-STARTPTS,volume='if(lt(t,{intro - 0.1}),0.7,1)':eval=frame,"
          f"afade=t=out:st={dur - 1.2}:d=1.2[m];"
          f"[v][m]amix=inputs=2:duration=longest:normalize=0,atrim=0:{dur}[a]")
    tmp = out[:-4] + '.mix.mp4'
    run('-i', video, '-i', voice, '-i', track, '-filter_complex', af, '-map', '0:v', '-map', '[a]', '-c:v', 'copy',
        '-c:a', 'aac', '-b:a', '256k', '-ar', 48000, tmp)
    target = 'I=-14:TP=-1.5:LRA=11'
    r = subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-i', tmp, '-af', f'loudnorm={target}:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
    an = (f"loudnorm={target}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    run('-i', tmp, '-c:v', 'copy', '-af', an, '-ar', 48000, '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', out)
    subprocess.run(['rm', '-f', tmp])
    print('ok', out, round(dur, 2), 's')


if __name__ == '__main__':
    a = sys.argv[1:]
    main(*a[:4], *(float(x) for x in a[4:]))
