# YouTube Short builder: same slides as the TikTok carousel, as a narrated vertical video.
# usage: python3 templates/make_short.py work/clues_<name>.html slides/<date>-<name> [voice]
#   -> slides/<date>-<name>/short.mp4
# Needs: pip install kokoro-onnx soundfile --break-system-packages ; ffmpeg.
# The Kokoro model files (~350 MB) are downloaded from GitHub into ~/tts on first run.
import sys, os, re, html, subprocess, urllib.request
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
COVER = os.path.join(HERE, '..', 'slides', 'cover.jpg')
TTS = os.path.expanduser('~/tts')
REL = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
VOICE = sys.argv[3] if len(sys.argv) > 3 else 'af_heart'
SPEED = 1.08
SR = 24000
XF = 0.4          # transition length (s)
THINK = 1.6       # silent "think time" after each clue is read
W, H, FPS = 1080, 1920, 30

clues_html, outdir = sys.argv[1], sys.argv[2]
work = os.path.join(outdir, '_short_tmp'); os.makedirs(work, exist_ok=True)

def clean(s):
    s = html.unescape(re.sub(r'<[^>]+>', '', s))
    s = re.sub(r'[\U0001F000-\U0001FFFF☀-➿️‍]', '', s)
    return s.replace('’', "'").replace('“', '"').replace('”', '"').strip()

clues = [clean(c) for c in re.findall(r'<div class="clue">(.*?)</div>', open(clues_html).read(), re.S)]
assert len(clues) == 5, clues
words = ['one', 'two', 'three', 'four', 'five']
lines = ["Guess that character! One Piece edition. Five clues, hardest first. Only real fans get it on clue one."]
lines += [f"Clue {words[i]}. {c}" for i, c in enumerate(clues)]
lines += ["Who do you think it was? Comment your answer, and which clue you got it on!"]
pads = [0.5] + [THINK] * 5 + [1.2]
imgs = [COVER] + [os.path.join(outdir, f'slide_{i}.jpg') for i in range(2, 8)]

# --- narration ---
os.makedirs(TTS, exist_ok=True)
for f in ['kokoro-v1.0.onnx', 'voices-v1.0.bin']:
    p = os.path.join(TTS, f)
    if not os.path.exists(p): urllib.request.urlretrieve(REL + f, p)
from kokoro_onnx import Kokoro
k = Kokoro(os.path.join(TTS, 'kokoro-v1.0.onnx'), os.path.join(TTS, 'voices-v1.0.bin'))
clips = []
for t in lines:
    a, sr = k.create(t, voice=VOICE, speed=SPEED, lang='en-us'); assert sr == SR
    clips.append(np.asarray(a, dtype=np.float32))
lead = 0.25
durs = [round(lead + len(c) / SR + p + XF, 2) for c, p in zip(clips, pads)]

# start time of each slide on the final timeline (xfade overlaps XF)
starts, t = [], 0.0
for d in durs: starts.append(t); t += d - XF
total = t + XF
track = np.zeros(int((total + 0.5) * SR), np.float32)
for c, s in zip(clips, starts):
    i = int((s + lead + (XF if s else 0)) * SR); track[i:i + len(c)] += c
track = track / max(1e-6, np.abs(track).max()) * 0.9
wav = os.path.join(work, 'voice.wav'); sf.write(wav, track, SR)

# --- per-slide segments with a "think timer" bar on clue slides ---
segs = []
for n, (img, d) in enumerate(zip(imgs, durs)):
    seg = os.path.join(work, f'seg{n}.mp4'); segs.append(seg)
    base = f'[0:v]scale={W}:{H},setsar=1,fps={FPS}'
    if 1 <= n <= 5:   # "think timer": yellow bar slides out to the left over the slide's on-screen time
        fc = (base + f",drawbox=x=0:y={H-22}:w={W}:h=22:color=black@0.45:t=fill[b];"
              f"color=c=0xffd34d:s={W}x22:r={FPS}:d={d}[bar];"
              f"[b][bar]overlay=x='-{W}*t/{d}':y={H-22}:shortest=1,format=yuv420p[v]")
    else:
        fc = base + ',format=yuv420p[v]'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-loop', '1', '-t', str(d), '-i', img,
                    '-filter_complex', fc, '-map', '[v]', '-t', str(d),
                    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', seg], check=True)

args, f, prev = [], '', '0:v'
for s in segs: args += ['-i', s]
for i in range(1, len(segs)):
    f += f'[{prev}][{i}:v]xfade=transition=slideleft:duration={XF}:offset={starts[i]:.3f}[x{i}];'
    prev = f'x{i}'
out = os.path.join(outdir, 'short.mp4')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *args, '-i', wav, '-filter_complex', f.rstrip(';'),
                '-map', f'[{prev}]', '-map', f'{len(segs)}:a', '-shortest', '-c:v', 'libx264', '-preset', 'medium',
                '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out], check=True)
subprocess.run(['rm', '-rf', work])
print(out, f'{total:.1f}s', 'voice', VOICE)
