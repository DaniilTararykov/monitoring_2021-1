"""Build the editor artifact page from template.html.
usage: python3 build.py <out.html> <skanaus.b64> <durations.txt> [assets.json]
assets.json: {"clips": {id: url}, "music": {track: url}} (from the Artifact asset upload)."""
import sys, json
tpl = open(__file__.rsplit('/', 1)[0] + '/template.html').read()
out, b64, durs = sys.argv[1:4]
assets = json.load(open(sys.argv[4])) if len(sys.argv) > 4 else {'clips': {}, 'music': {}}
html = (tpl.replace('__SKANAUS__', open(b64).read().strip())
        .replace('__ASSETS__', json.dumps(assets['clips']))
        .replace('__MUSIC__', json.dumps(assets['music']))
        .replace('__DURS__', open(durs).read().strip().rstrip(',')))
open(out, 'w').write(html)
print('ok', out, len(html))
