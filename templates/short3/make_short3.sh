#!/usr/bin/env bash
# v3 TEST: v2 animated Short + a stick-figure host who walks around and narrates.
# usage: bash templates/short3/make_short3.sh slides/<date>-<name> "<Answer Name>" "HARD MODE|EXTREME MODE" [out.mp4]
#   reads  slides/<date>-<name>/clues.html  -> writes [out.mp4] (default slides/<date>-<name>/short.mp4) (~50s, 1080x1920, H.264/AAC)
# needs: node 22+, ffmpeg, google-chrome/chromium, python3 + playwright, kokoro-onnx + soundfile (model in ~/tts).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
DIR="$(cd "$1" && pwd)"; ANSWER="$2"; MODE="${3:-HARD MODE}"; OUT="${4:-$DIR/short.mp4}"
P="${KEEP_PROJ:-$(mktemp -d)}/short"; mkdir -p "$P/out"
cp -r "$HERE/engine" "$HERE/score.js" "$HERE/song.js" "$HERE/film.js" "$HERE/host.js" "$HERE/index.html" "$P/"
python3 "$HERE/prep.py" "$DIR/clues.html" "$P" --answer "$ANSWER" --mode "$MODE"
cd "$P"
node song.js
node engine/render.js video
node engine/render.js mux
node engine/render.js verify
ffmpeg -loglevel error -y -i out/short.mp4 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a copy -movflags +faststart "$OUT"
ffmpeg -loglevel error -y -i "$OUT" -vf "fps=1/2.5,scale=216:384,tile=7x3" -frames:v 1 "$P/out/frames.png"
echo "short ok: $OUT ($(du -h "$OUT" | cut -f1)), frame sheet: $P/out/frames.png"
