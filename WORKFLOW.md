# Daily "Guess That Character" TikTok posts

Each daily run makes **two** One Piece "Guess That Character" photo carousels and schedules them in Metricool
for **12:00 PM** and **8:00 PM America/New_York** on TikTok account @theanimecontenthub (Metricool blogId `7999182`).

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
   - **media**, in this order: `.../slides/cover.jpg`, then slide_2 … slide_7 of that character
   - **times:** 12:00 and 20:00 America/New_York that day.
     - If a slot is less than 10 minutes away or already past, skip it, and make only as many characters as there are open slots.
     - First call `getScheduledPosts` for that day; if a slot already has a TikTok post, don't add another.
   - **Caption:** 300–600 characters, no line breaks (the TikTok API strips them), ending with
     `#onepiece #guessthecharacter #animequiz #anime #animetiktok #onepiecefan`.
     Use the style of the earlier captions:
     - a mode label ("HARD MODE 💀" / "EXTREME MODE 💀💀")
     - a challenge hook
     - "swipe through all 5 clues"
     - "comment your answer AND which clue you got it on"
     - "I'll pin the answer later"
     - "who should I do next?"
   - **firstCommentText:** leave empty. Don't reveal the answer.
9. **Record:**
   - Append both names to `used.txt` with the date and scheduled time.
   - Add the answers to `answers.md` (date, time, character, clues), so the owner can pin them.
   - Commit and push.
10. **Report** in one short message which characters were scheduled for which times and their answers.
