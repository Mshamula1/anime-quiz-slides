#!/usr/bin/env bash
# v2 animated YouTube Short (owner-approved 2026-11-18).
# usage: bash templates/short2/make_short2.sh slides/<date>-<name> "<Answer Name>" "HARD MODE|EXTREME MODE"
#   reads  slides/<date>-<name>/clues.html  -> writes slides/<date>-<name>/short.mp4 (~50s, 1080x1920, H.264/AAC)
# needs: node 22+, ffmpeg, google-chrome/chromium, python3 + playwright, kokoro-onnx + soundfile (model in ~/tts).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
DIR="$(cd "$1" && pwd)"; ANSWER="$2"; MODE="${3:-HARD MODE}"
P="$(mktemp -d)/short"; mkdir -p "$P/out"
cp -r "$HERE/engine" "$HERE/score.js" "$HERE/song.js" "$HERE/film.js" "$HERE/index.html" "$P/"
python3 "$HERE/prep.py" "$DIR/clues.html" "$P" --answer "$ANSWER" --mode "$MODE"
cd "$P"
node song.js
node engine/render.js video
node engine/render.js mux
node engine/render.js verify
ffmpeg -loglevel error -y -i out/short.mp4 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a copy -movflags +faststart "$DIR/short.mp4"
ffmpeg -loglevel error -y -i "$DIR/short.mp4" -vf "fps=1/2.5,scale=216:384,tile=7x3" -frames:v 1 "$P/out/frames.png"
echo "short ok: $DIR/short.mp4 ($(du -h "$DIR/short.mp4" | cut -f1)), frame sheet: $P/out/frames.png"
