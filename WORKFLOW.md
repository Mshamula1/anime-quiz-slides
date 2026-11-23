# Daily "Guess That Character" TikTok posts

Each daily run makes **two** One Piece "Guess That Character" photo carousels and schedules them in Metricool
for **11:50 AM** and **7:50 PM America/New_York** (10 minutes early, because TikTok takes ~10 min to process a carousel, so posts appear around 12:00 and 8:00) on TikTok account @theanimecontenthub (Metricool blogId `7999182`). The same two quizzes also go to the brand's YouTube channel as animated narrated Shorts (v4 "doodle notebook" style with the stick-figure host, answer reveal at the end) at **12:00 PM** and **8:00 PM** ET — see step 8b. The daily report lists both the TikTok and YouTube times.

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
8b. **YouTube Short: v4 "doodle notebook" version (owner-approved 2026-11-23; replaces the v2 animated Short of 2026-11-18).** TikTok stays a photo carousel and is NOT affected by anything in this step. YouTube gets an animated, narrated, scored video of the same quiz, built from the same clue file and illustrations (never change the TikTok slides for YouTube).
   - Setup (fresh container): `pip install kokoro-onnx soundfile --break-system-packages`. If `~/tts/kokoro-v1.0.onnx` and `~/tts/voices-v1.0.bin` are missing, download them from `https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/` into `~/tts`. Node 22+, ffmpeg, Chrome/Chromium and Python Playwright are preinstalled. The animation engine is vendored in `templates/short4/engine` (from the animation-studio skill); no npm install.
   - After step 7, copy `work/clues_<name>.html` to `slides/<YYYY-MM-DD>-<name>/clues.html`, then run (in the background with nohup, ~8 min each; poll the log):
     `bash templates/short4/make_short4.sh slides/<YYYY-MM-DD>-<name> "<Answer Name>" "HARD MODE"` (or `"EXTREME MODE"`)
     → writes `slides/<YYYY-MM-DD>-<name>/short.mp4` (1080×1920, ~53s, H.264/AAC, -14 LUFS) and prints a frame-sheet path. `<Answer Name>` is the character's common name as fans know it (e.g. "Iceburg", "Lola"). The script stops with an error (and writes no short.mp4) if the sync check fails.
   - What it contains (don't change without the owner): every scene is a hand-drawn spiral-notebook page (paper style, marker + handwriting fonts), and pages rip away between scenes. The host is an original stick figure with a red bow tie and an original black pirate tricorn (gold trim, red feather); he walks between pages, lip-syncs the narration, points at each clue, thinks with a "?" bubble during countdowns, shakes during the drum roll, jumps at the reveal and presses Subscribe at the end. **Never give him a straw hat or anything else from a One Piece character.** Voice `af_heart`; hook line "Only real One Piece fans get this on clue one." + "Can you?" over a title written in marker, the fixed cover taped in as a photo, and a HARD/EXTREME MODE rubber stamp. Per clue: "Clue one!" … "Last clue!" then the clue read aloud; CLUE n/5 circled in red, a points sticky note with spent coins crossed out, the clue art as a taped photo, the clue written in blue pen word by word (key words highlighted), a "get it here" rank stamp, and a 3-2-1 marker countdown with "got it yet?!". Ending: "Who is it? Lock in your answer!" → drum roll + rattling treasure chest → 3-2-1 → chest bursts open and the **answer** pops up on a paper banner ("It's <Answer>!") with confetti → sticky-note points recap "comment your score!" → "NEW QUIZ EVERY DAY! 12 PM & 8 PM ET" + a hand-drawn SUBSCRIBE button. Original synthesized ukulele/glockenspiel music with paper, pen, stamp and cartoon SFX, ducked under the voice.
   - Check: open the printed frame sheet and confirm the cover, all 5 clue scenes, the countdowns, the reveal and the end card appear with no clipped text; confirm the script printed `✓ in sync` and that the file has audio (`ffmpeg -i short.mp4 -af volumedetect -f null -` mean volume around -16 dB, not -91).
   - Commit and push. In `media`, use the commit-pinned raw URL `https://raw.githubusercontent.com/Mshamula1/anime-quiz-slides/<commit-sha>/slides/.../short.mp4`. Confirm it returns HTTP 200.
   - Schedule a separate `createScheduledPost` (blogId `7999182`) per character with **providers:** youtube, **autoPublish:** true, **media:** `[<short.mp4 URL>]`.
   - **times:** 12:00 and 20:00 America/New_York. Same skip rule: skip a slot under 10 minutes away or past, and check `getScheduledPosts` so a slot never gets two YouTube posts.
   - **text (YouTube caption):** the same caption as that day's TikTok post (same length, teaser and mode label), reworded for video:
     - "Swipe through all 5 clues" → "Watch all 5 clues".
     - Add "Try to beat the timer on every clue" and "no pausing to google".
     - "I'll pin the answer later, so don't scroll the comments before you guess!" → "The answer drops at the very end, so lock in your guess before the reveal!" (the video reveals the answer).
     - "Comment your answer AND which clue you got it on" stays; add "then comment your score".
     - "Tag a friend" → "Send this to a friend".
     - "Follow for a new Guess That Character quiz every day at 12 PM and 8 PM ET." → "Subscribe for a new Guess That Character Short every day at 12 PM and 8 PM ET."
     - Hashtags: `#onepiece #guessthecharacter #animequiz #anime #onepiecefan #shorts #youtubeshorts` (no #animetiktok).
   - **youtubeData:** `{"title": "<same title as tiktokData.title> #shorts", "type": "short", "privacy": "public", "madeForKids": false, "category": "ENTERTAINMENT", "tags": ["one piece","guess the character","anime quiz","anime","one piece quiz"], "isAiGeneratedContent": false}`. Never put the answer in the title or the caption; it is only revealed at the end of the video.
   - If the v4 build fails, try the previous v2 animated Short (`bash templates/short2/make_short2.sh slides/<...> "<Answer Name>" "<MODE>"`); if that also fails, fall back to the old slideshow Short (`python3 templates/make_short.py slides/<...>/clues.html slides/<...>`). Say which one was used in the report.
9. **Record:**
   - Append both names to `used.txt` with the date and scheduled time.
   - Add the answers to `answers.md` (date, time, character, clues), so the owner can pin them.
   - Commit and push.
10. **Report** in one short message which characters were scheduled for which times and their answers.
