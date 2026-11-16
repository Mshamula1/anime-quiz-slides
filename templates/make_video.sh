#!/bin/bash
# usage: templates/make_video.sh slides/<date>-<name>   -> writes <dir>/short.mp4
# 1080x1920 YouTube Short: cover 2.5s, 5 clues 4.5s each, ending 3s, 0.4s crossfades, silent AAC track.
set -e
D="$1"; C="$(dirname "$0")/../slides/cover.jpg"
durs=(2.5 4.5 4.5 4.5 4.5 4.5 3.5); imgs=("$C" "$D"/slide_{2..7}.jpg)
args=(); for i in "${!imgs[@]}"; do args+=(-loop 1 -t "${durs[$i]}" -i "${imgs[$i]}"); done
f=""; for i in "${!imgs[@]}"; do f+="[$i:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p[v$i];"; done
prev=v0; off=0
for i in 1 2 3 4 5 6; do off=$(echo "$off + ${durs[$((i-1))]} - 0.4" | bc); f+="[$prev][v$i]xfade=transition=slideleft:duration=0.4:offset=$off[x$i];"; prev=x$i; done
ffmpeg -y -loglevel error "${args[@]}" -f lavfi -i anullsrc=r=44100:cl=stereo -filter_complex "${f%;}" -map "[$prev]" -map 7:a -shortest -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$D/short.mp4"
