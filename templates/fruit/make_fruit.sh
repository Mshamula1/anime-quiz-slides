#!/usr/bin/env bash
# Devil Fruit Files: a pencil-sketch explainer Short for one devil fruit (YouTube, owner-approved 2026-11-24).
# usage: bash templates/fruit/make_fruit.sh <fruit-id> <out.mp4>
#   reads templates/fruit/fruits/<fruit-id>.json (narration lines) + <fruit-id>.js (one sketch per line)
# needs: node 22+, ffmpeg, chromium, kokoro-onnx + soundfile (model in ~/tts).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ID="$1"; mkdir -p "$(dirname "$2")"; OUT="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"
P="${KEEP_PROJ:-$(mktemp -d)}/proj"; mkdir -p "$P/out"
cp -r "$HERE/engine" "$HERE/score.js" "$HERE/song.js" "$HERE/film.js" "$HERE/sketch.js" "$HERE/index.html" "$P/"
cp "$HERE/fruits/$ID.js" "$P/fruit_scenes.js"
python3 "$HERE/prep.py" "$HERE/fruits/$ID.json" "$P"
cd "$P"
node song.js
node engine/render.js video
node engine/render.js mux
ffmpeg -loglevel error -y -i out/proj.mp4 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a copy -movflags +faststart "$OUT"
ffmpeg -loglevel error -y -i "$OUT" -vf "fps=1/4,scale=216:384,tile=8x3" -frames:v 1 "$P/out/frames.png"
echo "fruit ok: $OUT ($(du -h "$OUT" | cut -f1)), frame sheet: $P/out/frames.png"
