"""Openverse sound search and download — free library of 5M+ recordings, no API key.

usage:
  python3 tools/sfx.py find "paper rustle" [--max 3] [--license cc0]   list matches (title, length, licence, id)
  python3 tools/sfx.py get <id> <out.wav> [--trim 1.5]                 download one, convert to 48 kHz stereo wav
  python3 tools/sfx.py pick "pen writing" <out.wav> [--max 3] [--trim]  find + take the first short commercial-safe hit

Only licences that allow commercial use are kept (cc0, by, by-sa; pdm). Every download writes <out>.json with the
title, creator, licence and source URL — CC-BY needs that credit in the post caption or description.
"""
import json
import subprocess
import sys
import urllib.parse
import urllib.request

API = 'https://api.openverse.org/v1/audio/'
SAFE = 'cc0,by,by-sa,pdm'
UA = {'User-Agent': 'sea-signora-content/1.0'}


def get_json(url, tries=4):
    for i in range(tries):  # the API is sometimes slow: retry with a longer wait
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30 + 15 * i) as r:
                return json.load(r)
        except (TimeoutError, OSError):
            if i == tries - 1:
                raise


def find(q, n=5, lic=SAFE, max_s=None):
    params = {'q': q, 'page_size': 20, 'license': lic, 'mature': 'false'}
    res = get_json(API + '?' + urllib.parse.urlencode(params))['results']
    if max_s:
        res = [r for r in res if r.get('duration') and r['duration'] / 1000 <= max_s]
    return res[:n]


def get(item_id, out, trim=None):
    r = get_json(API + item_id + '/')
    raw = out + '.src'
    with urllib.request.urlopen(urllib.request.Request(r['url'], headers=UA), timeout=60) as resp, open(raw, 'wb') as fh:
        fh.write(resp.read())
    cmd = ['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', raw]
    if trim:
        cmd += ['-t', str(trim), '-af', f'afade=t=out:st={max(0, float(trim) - 0.15)}:d=0.15']
    subprocess.run(cmd + ['-ar', '48000', '-ac', '2', out], check=True)
    subprocess.run(['rm', '-f', raw])
    meta = {k: r.get(k) for k in ('id', 'title', 'creator', 'license', 'license_version', 'foreign_landing_url', 'url')}
    meta['credit'] = f"«{r.get('title')}» by {r.get('creator')} ({r.get('license', '').upper()} {r.get('license_version') or ''}) — {r.get('foreign_landing_url')}"
    json.dump(meta, open(out + '.json', 'w'), ensure_ascii=False, indent=1)
    return meta


def arg(name, default=None):
    a = sys.argv
    return a[a.index(name) + 1] if name in a else default


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'find':
        for r in find(sys.argv[2], int(arg('--max', 8)), arg('--license', SAFE)):
            print(f"{r['id']}  {(r.get('duration') or 0) / 1000:5.1f}s  {r['license']:6s} {r['title'][:60]}  — {r.get('creator')}")
    elif cmd == 'get':
        print(get(sys.argv[2], sys.argv[3], arg('--trim'))['credit'])
    elif cmd == 'pick':
        hits = find(sys.argv[2], 5, arg('--license', SAFE), float(arg('--max', 4)))
        if not hits:
            sys.exit(f'nothing short enough for «{sys.argv[2]}»')
        print(get(hits[0]['id'], sys.argv[3], arg('--trim'))['credit'])
    else:
        sys.exit(__doc__)
