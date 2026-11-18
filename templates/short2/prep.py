# Prepares the assets for the animated YouTube Short (v2) of one quiz.
# usage: python3 prep.py <clues.html> <projdir> --answer "Iceburg" --mode "HARD MODE"
#   -> <projdir>/assets/art_1..5.png   (each clue's illustration, transparent, 1080x960)
#      <projdir>/assets/cover.jpg
#      <projdir>/assets/vo_*.wav        (Kokoro af_heart narration, one file per line)
#      <projdir>/data.js / data.json    (clues, colours, ranks, VO durations + word timings)
import sys, os, re, html, json, shutil, subprocess, argparse, asyncio
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
TPL = os.path.dirname(HERE)
ap = argparse.ArgumentParser()
ap.add_argument('clues'); ap.add_argument('proj')
ap.add_argument('--answer', required=True); ap.add_argument('--mode', default='HARD MODE')
ap.add_argument('--voice', default='af_heart'); ap.add_argument('--speed', type=float, default=1.1)
a = ap.parse_args()
proj = os.path.abspath(a.proj); assets = os.path.join(proj, 'assets'); os.makedirs(assets, exist_ok=True)

src = open(a.clues).read()
secs = re.findall(r'<section class="slide" style="([^"]*)">(.*?)</section>', src, re.S)
assert len(secs) == 5, len(secs)

def strip_emoji(s):
    return re.sub(r'[\U0001F000-\U0001FFFF☀-➿️‍]', '', s)
def plain(s):
    s = html.unescape(re.sub(r'<[^>]+>', '', s))
    return strip_emoji(s).replace('’', "'").replace('“', '"').replace('”', '"').strip()

clues = []
for i, (style, body) in enumerate(secs):
    raw = re.search(r'<div class="clue">(.*?)</div>', body, re.S).group(1).strip()
    emo = ''.join(re.findall(r'[\U0001F000-\U0001FFFF☀-➿]', raw))
    # tokens: [{w, em}] for the karaoke card
    toks = []
    for part in re.split(r'(<em>.*?</em>)', strip_emoji(html.unescape(raw)).replace('’', "'")):
        em = part.startswith('<em>')
        for w in re.sub(r'</?em>', '', part).split():
            if toks and re.fullmatch(r'[^\w"]+', w): toks[-1]['w'] += w   # "friend</em>." -> "friend."
            else: toks.append({'w': w, 'em': em})
    cols = re.findall(r'#[0-9a-fA-F]{6}', style)
    rank = plain(re.search(r'<div class="rank">(.*?)</div>', body, re.S).group(1)).replace('get it here = ', '').strip()
    rank_emoji = ''.join(re.findall(r'[\U0001F000-\U0001FFFF]', re.search(r'<div class="rank">(.*?)</div>', body, re.S).group(1)))
    clues.append({'text': plain(raw), 'tokens': toks, 'emoji': emo, 'bg': cols[:3], 'rank': rank, 'rankEmoji': rank_emoji})

# ---- illustration layers (transparent PNG of each clue's svg.art) ----
built = os.path.join(assets, '_built.html')
subprocess.run(['python3', os.path.join(TPL, 'build.py'), os.path.abspath(a.clues), built], check=True, cwd=TPL)
shutil.copy(os.path.join(TPL, '..', 'slides', 'cover.jpg'), os.path.join(assets, 'cover.jpg'))
# build.py references cover.jpg relative to the output file
async def shoot():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1080, 'height': 1920})
        await pg.goto('file://' + built); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(300)
        await pg.add_style_tag(content='body,.slide{background:transparent!important} .rays,.dots,.head,.card,.swipe{display:none!important}')
        sl = await pg.query_selector_all('section.slide')
        for i in range(5):
            art = await sl[i + 1].query_selector('svg.art')
            await art.screenshot(path=os.path.join(assets, f'art_{i+1}.png'), omit_background=True)
        await b.close()
asyncio.run(shoot())

# ---- narration ----
from kokoro_onnx import Kokoro
TTS = os.path.expanduser('~/tts')
k = Kokoro(os.path.join(TTS, 'kokoro-v1.0.onnx'), os.path.join(TTS, 'voices-v1.0.bin'))
nums = ['one', 'two', 'three', 'four', 'five']
lines = {
    'hook': "Only real One Piece fans get this on clue one.",
    'hook2': "Can you?",
}
for i, c in enumerate(clues):
    lines[f'n{i+1}'] = f"Clue {nums[i]}!" if i < 4 else "Last clue!"
    lines[f'c{i+1}'] = c['text']
lines['ask'] = "Who is it? Lock in your answer!"
lines['reveal'] = f"It's {a.answer}!"
lines['score'] = "Comment which clue you got it on!"

def trim(x, thr=0.01):
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx): return x
    return x[max(0, idx[0] - 240): idx[-1] + 1200]

vo = {}
for key, text in lines.items():
    aud, sr = k.create(text, voice=a.voice, speed=a.speed, lang='en-us')
    aud = trim(np.asarray(aud, np.float32))
    f = os.path.join(assets, f'vo_{key}.wav'); sf.write(f, aud, sr)
    dur = len(aud) / sr
    # word timings: energy-based syllable estimate spread over the clip
    words = text.split()
    def syl(w):
        w = re.sub(r'[^a-z]', '', w.lower()) or 'a'
        n = len(re.findall(r'[aeiouy]+', w)); n -= 1 if w.endswith('e') and n > 1 else 0
        return max(1, n) + (0.6 if re.search(r'[.,!?;:]$', w) else 0)
    tot = sum(syl(w) for w in words); t = 0.04; ws = []
    span = dur - 0.12
    for w in words:
        d = span * syl(w) / tot; ws.append({'w': w, 't': round(t, 3), 'end': round(t + d, 3)}); t += d
    vo[key] = {'file': f'assets/vo_{key}.wav', 'text': text, 'dur': round(dur, 3), 'words': ws}

data = {'answer': a.answer, 'mode': a.mode, 'clues': clues, 'vo': vo}
json.dump(data, open(os.path.join(proj, 'data.json'), 'w'), indent=1, ensure_ascii=False)
open(os.path.join(proj, 'data.js'), 'w').write('globalThis.DATA = ' + json.dumps(data, ensure_ascii=False) + ';\n')
os.remove(built)
print('prep ok:', {k2: v['dur'] for k2, v in vo.items()})
