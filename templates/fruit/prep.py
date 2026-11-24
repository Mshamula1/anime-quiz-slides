# Prepares the narration for a Devil Fruit Files sketch video.
# usage: python3 prep.py fruits/<id>.json <projdir> [--voice af_heart] [--speed 1.05]
#   -> <projdir>/assets/vo_<i>.wav   (Kokoro narration, one file per line; the "say" text, spelled for pronunciation)
#      <projdir>/data.json / data.js (lines with durations, caption words from the "show" text, mouth/energy envelope)
import sys, os, re, json, argparse
import numpy as np, soundfile as sf

ap = argparse.ArgumentParser()
ap.add_argument('fruit'); ap.add_argument('proj')
ap.add_argument('--voice', default='af_heart'); ap.add_argument('--speed', type=float, default=1.15)
a = ap.parse_args()
proj = os.path.abspath(a.proj); assets = os.path.join(proj, 'assets'); os.makedirs(assets, exist_ok=True)
F = json.load(open(a.fruit))

from kokoro_onnx import Kokoro
TTS = os.path.expanduser('~/tts')
k = Kokoro(os.path.join(TTS, 'kokoro-v1.0.onnx'), os.path.join(TTS, 'voices-v1.0.bin'))

def trim(x, thr=0.01):
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx): return x
    return x[max(0, idx[0] - 240): idx[-1] + 1200]

def syl(w):
    if re.search(r'\d', w): return 1.6 * len(re.findall(r'\d', w))
    w2 = re.sub(r'[^a-z]', '', w.lower()) or 'a'
    n = len(re.findall(r'[aeiouy]+', w2)); n -= 1 if w2.endswith('e') and n > 1 else 0
    return max(1, n) + (0.9 if re.search(r'[.,!?;:]$', w) else 0)

lines = []
for i, L in enumerate(F['lines']):
    aud, sr = k.create(L['say'], voice=a.voice, speed=a.speed, lang='en-us')
    aud = trim(np.asarray(aud, np.float32))
    f = os.path.join(assets, f'vo_{i}.wav'); sf.write(f, aud, sr)
    dur = len(aud) / sr
    words = L['show'].split(); tot = sum(syl(w) for w in words); t = 0.04; ws = []
    for w in words:
        d = (dur - 0.12) * syl(w) / tot; ws.append({'w': w, 't': round(t, 3), 'end': round(t + d, 3)}); t += d
    hop = sr // 60
    rms = np.array([np.sqrt(np.mean(aud[j:j + hop] ** 2)) for j in range(0, len(aud) - hop, hop)] or [0])
    env = np.clip(rms / (np.percentile(rms, 95) + 1e-6), 0, 1)
    lines.append({'file': f'assets/vo_{i}.wav', 'say': L['say'], 'show': L['show'], 'dur': round(dur, 3), 'words': ws,
                  'env': [round(float(e), 2) for e in env]})

data = {'id': F['id'], 'number': F.get('number', 1), 'title': F['title'], 'lines': lines}
json.dump(data, open(os.path.join(proj, 'data.json'), 'w'), indent=1, ensure_ascii=False)
open(os.path.join(proj, 'data.js'), 'w').write('globalThis.DATA = ' + json.dumps(data, ensure_ascii=False) + ';\n')
print('prep ok:', [l['dur'] for l in lines])
