# Daily "Guess That Character" TikTok posts

Each daily run makes **two** One Piece "Guess That Character" photo carousels and schedules them in Metricool
for **11:50 AM** and **7:50 PM America/New_York** (10 minutes early, because TikTok takes ~10 min to process a carousel, so posts appear around 12:00 and 8:00) on TikTok account @theanimecontenthub (Metricool blogId `7999182`). The same two quizzes also go to the brand's YouTube channel as animated narrated Shorts (v2, with an answer reveal at the end) at **12:00 PM** and **8:00 PM** ET — see step 8b. The daily report lists both the TikTok and YouTube times.

## Fixed pieces (never change these)
- **Slide 1, the cover:** `slides/cover.jpg`. It's the owner's chosen cover image. Use this exact file every time; never re-render or redraw it.
- **Slide 7, the ending:** the "WHO DO YOU THINK IT WAS?" slide. `templates/build.py` produces it identically each run.
- **Layout and style:** `templates/base.html` (CSS, cover, final) and the clue-section shell in `templates/example_clues.html`.

## Steps for each run
1. **Pick 2 characters** from One Piece that are NOT in `used.txt`.
   - Lean niche and hard: side characters and one-arc characters, not the main crew.
   - Make the two posts different difficulty levels: one "HARD MODE" and one "EXTREME MODE".
2. **Write 5 clues per character,** ordered hardest to easiest.
   - Clue 1 is obscure trivia; clue 5 is a near-giveaway (an epithet or iconic moment).
   - **Verify every clue with WebSearch** (One Piece wiki / fandom) before using it. If a fact can't be verified, drop it.
   - Write in first person, 60–90 characters each, and wrap the key phrase in `<em>`.
   - Never use the character's name in a clue.
3. **Write `clues_<name>.html`** with 5 `<section class="slide">` blocks, copying the structure of `templates/example_clues.html`:
   - header tag + "CLUE N/5"
   - `<svg class="art" viewBox="0 0 1080 960">` illustration
   - parchment card with "CLUE #N" ribbon and the clue text
   - rank badge: 🧠 GENIUS / 🔥 TRUE FAN / 😎 SOLID / 👍 NOT BAD / 😅 ...it's ok
   - swipe label: "next clue →" ×3, "last clue →", "answer time →"
   - Give each slide its own color scheme. Shared SVG defs available from build.py: `#parch #roll #gold #cane #steel2 #grille #dropsh #fogblur #stormsea #bluesea #rope`.
   - JS helpers available: `#laurel #candles #snow #chests #xgrid #rows #tally #crowd`.
4. **ART RULE (strict).** Illustrations must be ORIGINAL drawings of generic objects, places, animals or ideas: a cake with candles, a ship in fog, a treasure chest, a medal, a mountain castle, and so on. Style them as bold pirate-adventure cartoon art: thick ink outlines, gradients, rays, comic bursts.
   - **Never** draw any One Piece character: no faces, recognizable silhouettes, outfits or hairstyles.
   - **Never** draw their signature items or designs: no straw hat, named swords, jolly rogers, devil-fruit swirl patterns, official wanted-poster layouts (berry sign, "MARINE"), or the series logo.
   - Use no official artwork or images from the web.
5. **Render:**
   - `cd templates && python3 build.py ../work/clues_<name>.html ../work/<name>.html`
   - `python3 shoot.py ../work/<name>.html ../work/<name>`
6. **Check:** make a side-by-side contact sheet of slides 2–7 and look at it. Look for:
   - text overflowing cards, banners or bubbles
   - elements cut off at the edges
   - badges covering text
   - anything that depicts a character

   Fix and re-render as needed.
7. **Publish the images:**
   - Convert slides 2–7 to JPEG (quality 92). TikTok's API doesn't accept PNG.
   - Save them to `slides/<YYYY-MM-DD>-<name>/slide_2.jpg … slide_7.jpg`.
   - Commit and push to `main`.
   - Confirm each `https://raw.githubusercontent.com/Mshamula1/anime-quiz-slides/main/slides/...` URL returns HTTP 200 before scheduling.
8. **Schedule in Metricool** with `createScheduledPost` (blogId `7999182`):
   - **providers:** tiktok
   - **autoPublish:** true
   - **privacyOption:** PUBLIC_TO_EVERYONE
   - **photoCoverIndex:** 0
   - **autoAddMusic:** true. REQUIRED on every post, so TikTok attaches a trending sound to the carousel; posts without it publish silent. The owner wants sound on every post. (The Metricool API can't pick a specific song for TikTok; only this random-music option is available.)
   - **media**, in this order: `.../slides/cover.jpg`, then slide_2 … slide_7 of that character
   - **times:** 11:50 and 19:50 America/New_York that day (NOT 12:00/20:00; the 10-minute lead covers TikTok processing).
     - If a slot is less than 10 minutes away or already past, skip it, and make only as many characters as there are open slots.
     - First call `getScheduledPosts` for that day; if a slot already has a TikTok post, don't add another.
   - **tiktokData.title (required by Metricool):** `Guess That Character: HARD MODE 💀` or `Guess That Character: EXTREME MODE 💀💀`. Never put the answer in the title.
   - **Caption: always a LONG description,** 1,000–1,800 characters (owner's standing request), no line breaks (the TikTok API strips them), ending with
     `#onepiece #guessthecharacter #animequiz #anime #animetiktok #onepiecefan`.
     Fill the length with engagement copy, not answer hints: a vague teaser about the character type (never names, places, crews or devil fruits that give it away), how the clues get easier, a "no googling" challenge, a "got it on clue 1 = genius" brag prompt, a tag-a-friend line, and "Follow for a new Guess That Character quiz every day at 12 PM and 8 PM ET."
     It must still include the style of the earlier captions:
     - a mode label ("HARD MODE 💀" / "EXTREME MODE 💀💀")
     - a challenge hook
     - "swipe through all 5 clues"
     - "comment your answer AND which clue you got it on"
     - "I'll pin the answer later"
     - "who should I do next?"
   - **firstCommentText:** leave empty. Don't reveal the answer.
8b. **YouTube Short: v2 animated version (owner-approved 2026-11-18; replaces the 2026-11-16 slideshow Short).** TikTok stays a photo carousel and is NOT affected by anything in this step. YouTube gets an animated, narrated, scored video of the same quiz, built from the same clue file and illustrations (never change the TikTok slides for YouTube).
   - Setup (fresh container): `pip install kokoro-onnx soundfile --break-system-packages`. If `~/tts/kokoro-v1.0.onnx` and `~/tts/voices-v1.0.bin` are missing, download them from `https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/` into `~/tts`. Node 22+, ffmpeg, Chrome/Chromium and Python Playwright are preinstalled. The animation engine is vendored in `templates/short2/engine` (from the animation-studio skill); no npm install.
   - After step 7, copy `work/clues_<name>.html` to `slides/<YYYY-MM-DD>-<name>/clues.html`, then run (in the background, ~8 min each; poll the log):
     `bash templates/short2/make_short2.sh slides/<YYYY-MM-DD>-<name> "<Answer Name>" "HARD MODE"` (or `"EXTREME MODE"`)
     → writes `slides/<YYYY-MM-DD>-<name>/short.mp4` (1080×1920, ~50s, H.264/AAC, -14 LUFS) and prints a frame-sheet path. `<Answer Name>` is the character's common name as fans know it (e.g. "Iceburg", "Lola").
   - What it contains (don't change without the owner): voice `af_heart`; hook line "Only real One Piece fans get this on clue one." + "Can you?" over the fixed cover with a mode stamp; per clue: "Clue one!" … "Last clue!" then the clue read aloud, art slam-in + slow push, word-by-word highlighted clue card, WORTH 5-4-3-2-1 PTS ladder, timer bar, 3-2-1 countdown with ticks and "GOT IT YET?"; ending "Who is it? Lock in your answer!" → drum roll 3-2-1 → **answer reveal** ("It's <Answer>!") with confetti → points recap + "COMMENT YOUR SCORE" → "New quiz every day 12 PM & 8 PM ET · SUBSCRIBE". Original synthesized music + SFX, ducked under the voice.
   - Check: open the printed frame sheet and confirm the cover, all 5 clue scenes, the countdowns, the reveal and the end card appear with no clipped text; confirm the script printed `✓ in sync` and that the file has audio (`ffmpeg -i short.mp4 -af volumedetect -f null -` mean volume around -16 dB, not -91).
   - Commit and push. In `media`, use the commit-pinned raw URL `https://raw.githubusercontent.com/Mshamula1/anime-quiz-slides/<commit-sha>/slides/.../short.mp4`. Confirm it returns HTTP 200.
   - Schedule a separate `createScheduledPost` (blogId `7999182`) per character with **providers:** youtube, **autoPublish:** true, **media:** `[<short.mp4 URL>]`.
   - **times:** 12:00 and 20:00 America/New_York. Same skip rule: skip a slot under 10 minutes away or past, and check `getScheduledPosts` so a slot never gets two YouTube posts.
   - **text (YouTube caption):** the same caption as that day's TikTok post (same length, teaser and mode label), reworded for video:
     - "Swipe through all 5 clues" → "Watch all 5 clues".
     - Add "Try to beat the timer on every clue" and "no pausing to google".
     - "I'll pin the answer later, so don't scroll the comments before you guess!" → "The answer drops at the very end, so lock in your guess before the reveal!" (the v2 video reveals the answer).
     - "Comment your answer AND which clue you got it on" stays; add "then comment your score".
     - "Tag a friend" → "Send this to a friend".
     - "Follow for a new Guess That Character quiz every day at 12 PM and 8 PM ET." → "Subscribe for a new Guess That Character Short every day at 12 PM and 8 PM ET."
     - Hashtags: `#onepiece #guessthecharacter #animequiz #anime #onepiecefan #shorts #youtubeshorts` (no #animetiktok).
   - **youtubeData:** `{"title": "<same title as tiktokData.title> #shorts", "type": "short", "privacy": "public", "madeForKids": false, "category": "ENTERTAINMENT", "tags": ["one piece","guess the character","anime quiz","anime","one piece quiz"], "isAiGeneratedContent": false}`. Never put the answer in the title or the caption; it is only revealed at the end of the video.
   - If the v2 build fails, fall back to the old slideshow Short (`python3 templates/make_short.py slides/<...>/clues.html slides/<...>`) and say so in the report.
9. **Record:**
   - Append both names to `used.txt` with the date and scheduled time.
   - Add the answers to `answers.md` (date, time, character, clues), so the owner can pin them.
   - Commit and push.
10. **Report** in one short message which characters were scheduled for which times and their answers.
