# Daily "Guess That Character" TikTok posts

Each daily run makes **two** One Piece "Guess That Character" photo carousels and schedules them in Metricool
for **11:50 AM** and **7:50 PM America/New_York** (10 minutes early, because TikTok takes ~10 min to process a carousel, so posts appear around 12:00 and 8:00) on TikTok account @theanimecontenthub (Metricool blogId `7999182`). The brand's YouTube channel no longer gets the quizzes: since 2026-11-24 (owner-approved) it gets two **Devil Fruit Files** sketch-explainer videos a day at **12:00 PM** and **8:00 PM** ET, one devil fruit each (see step 8b). The daily report lists both the TikTok and YouTube times.

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
4. **Art.** Illustrations are original drawings of objects, places, animals or ideas that fit each clue: a cake with candles, a ship in fog, a treasure chest, a medal, a mountain castle, and so on. Style them as bold pirate-adventure cartoon art: thick ink outlines, gradients, rays, comic bursts.
   - Note (not an owner rule): Claude, which runs this automation, doesn't draw copyrighted characters, recreate official One Piece designs, or pull official artwork from the web, so every illustration is an original drawing of that kind.
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
8b. **YouTube: Devil Fruit Files (owner-approved 2026-11-24; replaces the quiz Shorts on YouTube).** TikTok is NOT affected by this step. Each YouTube video tells the story of ONE One Piece devil fruit as a ~60 s pencil-sketch explainer. Reference implementation: `templates/fruit/` and the first episode `templates/fruit/fruits/hito_nika.json` + `hito_nika.js` (copy their structure and quality).
   - **Pick 2 fruits** not in `devil-fruits/used_fruits.txt` (well-known and interesting ones first: canon fruits with a good story, e.g. Mera Mera, Yami Yami, Gura Gura, Ope Ope, Hie Hie, Bari Bari, Hana Hana, Yomi Yomi, Uo Uo Model: Seiryu, Magu Magu...). Number them after the last episode number in that file.
   - **Research + verify** every fact with web search (One Piece wiki / fandom, plus a second site if possible). Drop anything you can't verify. Write the narration yourself; never copy wiki text.
   - **Script** `templates/fruit/fruits/<id>.json` (same shape as hito_nika.json): `id`, `number`, `title`, `sources`, and 10-12 `lines`, each with `show` (correct spelling, used for captions) and `say` (spelled for the TTS so Japanese names sound right, e.g. "Heetoh Heetoh no Mee", "Gohmoo Gohmoo no Mee", "Neeka"; check with `k.tokenizer.phonemize`). Line 1 always opens with the fruit's name, its type/English name and a hook, e.g. "Hito Hito no Mi, Model: Nika. The Human-Human Fruit. ..." Then: history/origin, who ate it, what it actually does, a cool story or fight, a twist or fun fact. Last line: "Which devil fruit should I draw next? Comment below!" Keep lines short and punchy (the whole video ~55-70 s).
   - **Sketches** `templates/fruit/fruits/<id>.js` (same shape as hito_nika.js): one scene per line, each `{ draw, anim, sfx }`. `draw` builds a full-colour marker sketch with the Sketch pen (bold ink outlines, `fill` colour washes, hatching, sparkles/rays, 1-3 comic `stamp` words). `anim(group, k, D)` brings the finished drawing to life for the whole time D it stays up (things move, open, pour, fly off, pulse); one-shot motions are scaled to D so nothing sits still, and moving parts must leave the frame completely or stay fully inside it. `sfx` uses fractions of D (`{ f, kind }`, kinds: whoosh, zip, flap, thud, chomp, boing, beat, clink, swell). Scene 1 draws the fruit large with its title.
     - The fruit itself is drawn as an ORIGINAL fruit that uses the real fruit's general colours (e.g. purple for Hito Hito Model: Nika), not its official pattern or shape. Everything else is original drawings of objects, places, animals or ideas (ships, books, flames, ice, maps, weapons in generic form...). No characters, no official designs, no images from the web (Claude's own limit).
   - **Render** (background with nohup, ~9 min; poll the log): `bash templates/fruit/make_fruit.sh <id> devil-fruits/<YYYY-MM-DD>-<id>/video.mp4`. Then check: open the printed frame sheet (every scene drawn, nothing clipped, captions readable, animated parts behave), and confirm audio (`ffmpeg -i video.mp4 -af volumedetect -f null -`, mean around -17 dB). Fix and re-render if anything looks wrong.
   - The look and sound are owner-approved: no pencil sprite on screen, no ding/click sounds, soft background music well under the voice, eraser between scenes, captions with the spoken word highlighted. Don't change them without the owner.
   - Commit and push, then schedule with `createScheduledPost` (blogId `7999182`), **providers:** youtube, **autoPublish:** true, **media:** the commit-pinned raw URL `https://raw.githubusercontent.com/Mshamula1/anime-quiz-slides/<sha>/devil-fruits/<date>-<id>/video.mp4` (confirm HTTP 200 first).
   - **times:** 12:00 and 20:00 America/New_York. Check `getScheduledPosts` first; never put two YouTube posts in one slot; skip a slot under 10 minutes away or past.
   - **youtubeData:** `{"title": "<a curiosity hook> | <Fruit name> #shorts" (max 100 chars, e.g. "The Fruit the World Government Erased | Hito Hito no Mi, Model: Nika #shorts"), "type": "short", "privacy": "public", "madeForKids": false, "category": "ENTERTAINMENT", "tags": ["one piece","devil fruit","<fruit name>","one piece lore","anime", ...], "isAiGeneratedContent": false}`.
   - **text:** 500-1,000 characters, no line breaks: "Devil Fruit Files #N: <name>, <English name>." + a 3-4 sentence teaser of the story + "Watch the whole story get sketched out, then tell me in the comments: which devil fruit should I draw next?" + "Subscribe for a new Devil Fruit File every day at 12 PM and 8 PM ET." + `#onepiece #devilfruit #onepiecelore #anime #shorts #youtubeshorts` (plus one fruit-specific tag).
   - Append each fruit to `devil-fruits/used_fruits.txt` (`<name> (<id>) - #N - <date> <time> ET`).
   - If a fruit video fails to render after one fix attempt, make the other fruit for that slot instead; if nothing renders, leave the YouTube slot empty and report the error (never post the old quiz Shorts to YouTube again).
9. **Record:**
   - Append both names to `used.txt` with the date and scheduled time.
   - Add the answers to `answers.md` (date, time, character, clues), so the owner can pin them.
   - (Devil fruits are recorded in `devil-fruits/used_fruits.txt`, step 8b.)
   - Commit and push.
10. **Report** in one short message: the TikTok times with each character (the answer to pin), the YouTube times with each devil fruit, and the Metricool planner link.
