# usage: owl_track.py frames_dir out.json crop_x crop_y  (detects on frames listed via env FRAMES="a-b:step,...")
import sys, os, json, torch
from PIL import Image
from transformers import Owlv2Processor, Owlv2ForObjectDetection
torch.set_num_threads(4)
d, out_path, cx, cy = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
name = "google/owlv2-base-patch16-ensemble"
proc = Owlv2Processor.from_pretrained(name); model = Owlv2ForObjectDetection.from_pretrained(name).eval()
q = [["a cigarette", "a lit cigarette in hand", "a cigarette in mouth"]]
idx = []
for part in os.environ["FRAMES"].split(","):
    rng, step = part.split(":"); a, b = map(int, rng.split("-")); idx += list(range(a, b + 1, int(step)))
res = json.load(open(out_path)) if os.path.exists(out_path) else {}
for i in idx:
    if str(i) in res: continue
    im = Image.open(f"{d}/{i:04d}.jpg").convert("RGB")
    W, H = im.size; S = max(W, H)
    inp = proc(text=q, images=im, return_tensors="pt")
    with torch.no_grad(): o = model(**inp)
    r = proc.post_process_grounded_object_detection(o, threshold=0.05, target_sizes=torch.tensor([[S, S]]))[0]
    best = sorted(zip(r["scores"].tolist(), r["boxes"].tolist()), reverse=True)[:4]
    res[str(i)] = [[round(s, 3), [round(b[0] + cx), round(b[1] + cy), round(b[2] + cx), round(b[3] + cy)]] for s, b in best]
    if len(res) % 20 == 0:
        json.dump(res, open(out_path, "w")); print(i, res[str(i)][:1], flush=True)
json.dump(res, open(out_path, "w")); print("done", len(res))
