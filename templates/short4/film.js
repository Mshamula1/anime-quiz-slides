// THE FILM (v4 "doodle notebook" quiz show): every scene is a page in a sketchbook, and the
// stick-figure host lives on the pages. Pure function of t; every time comes from score.js.
(function () {
  const U = globalThis.U, G = globalThis.G, S = globalThis.SCORE, Studio = globalThis.Studio, UI = globalThis.UI, Host = globalThis.Host;
  const { BEAT, ev, clues, D, TR } = S;
  const { clamp, lerp, ease } = U;
  const W = G.W, H = G.H;
  const IMG = { art: [], snaps: [] };

  // palette
  const INK = '#2A2320', BLUE = '#1f4fb5', RED = '#e23b3b', HI = '#ffe14d', STICKY = '#ffe680', LINE = 'rgba(70,130,210,0.32)', MARGIN = 'rgba(226,59,59,0.45)';
  const PAGES = ['#fdfaf0', '#fff8dc', '#eef6ff', '#fff0f3', '#effaf0', '#f6f0ff', '#fdfaf0', '#fff8dc'];
  const MARK = (size) => `400 ${size}px "Permanent Marker", "Noto Color Emoji", sans-serif`;
  const HAND = (size) => `400 ${size}px "Gochi Hand", "Noto Color Emoji", sans-serif`;
  const pop = (t, t0, d = 0.3, s = 2.4) => (t < t0 ? 0 : UI.pop(t, t0, d, s));
  const beatPulse = (t) => Math.exp(-((t % BEAT) / BEAT) * 6);
  const H01 = (...a) => U.hash(...a);

  function txt(ctx, str, x, y, { font, color = INK, align = 'center', rot = 0, scale = 1, alpha = 1, halo = 0, haloColor = '#fff' } = {}) {
    if (scale <= 0 || alpha <= 0) return;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(scale, scale);
    ctx.font = font; ctx.textAlign = align; ctx.textBaseline = 'middle';
    if (halo) { ctx.lineJoin = 'round'; ctx.lineWidth = halo; ctx.strokeStyle = haloColor; ctx.strokeText(str, 0, 0); }
    ctx.fillStyle = color; ctx.fillText(str, 0, 0);
    ctx.restore();
  }
  // a marker word that "boils" a little (hand-drawn wobble at 12 fps)
  function boilRot(seed) { return (H01(seed, G.boil) - 0.5) * 0.025; }

  // ---------- the notebook page ----------
  function notebook(ctx, k) {
    ctx.fillStyle = PAGES[k % PAGES.length]; ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = 3; ctx.strokeStyle = LINE;
    for (let y = 300; y < H; y += 78) { ctx.beginPath(); ctx.moveTo(0, y + (H01(k, y) - 0.5) * 2); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.strokeStyle = MARGIN; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(92, 0); ctx.lineTo(92, H); ctx.stroke();
    // spiral binding along the top
    for (let x = 40; x < W; x += 64) {
      ctx.fillStyle = 'rgba(40,30,20,0.18)'; ctx.beginPath(); ctx.arc(x, 72, 13, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#9aa3ad'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(x, 50, 22, Math.PI * 0.15, Math.PI * 1.1); ctx.stroke();
    }
    // margin doodles: stars, spirals, arrows (generic, different on every page)
    for (let i = 0; i < 6; i++) {
      const x = 30 + H01(k, i, 1) * 44, y = 520 + i * 230 + H01(k, i, 2) * 80, kind = Math.floor(H01(k, i, 3) * 3);
      ctx.save(); ctx.globalAlpha = 0.55;
      if (kind === 0) G.star(ctx, x, y, 16, { fill: null, rot: H01(k, i) * 3, seed: k * 10 + i, lw: 3 });
      else if (kind === 1) { const pts = []; for (let a = 0; a < 14; a++) pts.push([x + Math.cos(a * 0.9) * a * 1.6, y + Math.sin(a * 0.9) * a * 1.6]); G.line(ctx, pts, { color: '#5a6b85', lw: 3, seed: k + i }); }
      else G.line(ctx, [[x - 14, y - 14], [x + 14, y], [x - 14, y + 14]], { color: '#5a6b85', lw: 3, seed: k + i });
      ctx.restore();
    }
  }

  // ---------- doodle helpers ----------
  function sticky(ctx, x, y, w, h, rot, color = STICKY, seed = 1) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = 'rgba(40,30,10,0.22)'; ctx.fillRect(-w / 2 + 8, -h / 2 + 12, w, h);
    G.rrect(ctx, -w / 2, -h / 2, w, h, 6, { fill: color, stroke: 'rgba(60,45,10,0.5)', lw: 3, seed, amp: 1.2 });
    ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(-w / 2, -h / 2, w, 26);
    ctx.restore();
  }
  function burst(ctx, x, y, r, fill, seed, spikes = 12, rot = 0) {
    const pts = [];
    for (let i = 0; i < spikes * 2; i++) { const a = rot + (i / (spikes * 2)) * Math.PI * 2, rr = i % 2 ? r * 0.68 : r * (0.95 + H01(seed, i) * 0.12); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
    G.poly(ctx, pts, { fill, stroke: INK, lw: 5, seed, step: 30 });
  }
  function stamp(ctx, str, x, y, rot, sc, { color = RED, size = 64, sub = '' } = {}) {
    if (sc <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
    ctx.font = MARK(size); const w = ctx.measureText(str).width + 50, h = size + (sub ? 70 : 40);
    ctx.fillStyle = 'rgba(255,253,245,0.93)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 14); ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 14); ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-w / 2 + 9, -h / 2 + 9, w - 18, h - 18, 10); ctx.stroke();
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (sub) { ctx.font = HAND(30); ctx.fillText(sub, 0, -h / 2 + 34); ctx.font = MARK(size); ctx.fillText(str, 0, 18); }
    else ctx.fillText(str, 0, 4);
    // ink speckle knock-outs so it reads as a rubber stamp
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 26; i++) { ctx.beginPath(); ctx.arc((H01(i, 3, str.length) - 0.5) * w, (H01(i, 5) - 0.5) * h, 2 + H01(i, 7) * 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function scribbleCircle(ctx, x, y, rx, ry, u, color, seed) {
    if (u <= 0) return;
    const pts = [], n = 60;
    for (let i = 0; i <= n * u * 1.15; i++) { const a = -2.2 + (i / n) * Math.PI * 2.15; const k = 1 + (H01(seed, i >> 3) - 0.5) * 0.08; pts.push([x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k]); }
    if (pts.length > 1) G.line(ctx, pts, { color, lw: 7, seed, step: 30, amp: 1 });
  }
  function underline(ctx, x0, x1, y, u, color, seed) {
    if (u <= 0) return;
    const pts = [], n = 16;
    for (let i = 0; i <= n * u; i++) { const x = lerp(x0, x1, i / n); pts.push([x, y + Math.sin(i * 1.7 + seed) * 5]); }
    if (pts.length > 1) G.line(ctx, pts, { color, lw: 6, seed, step: 30, amp: 0.8 });
  }

  // ---------- the clue page ----------
  const PHOTO = { x: 578, y: 676, w: 560, h: 498 };
  function layoutClue(ctx, c) {
    if (c._lay) return c._lay;
    const size = 76, lh = 88, x0 = 118, maxW = 935 - x0;
    ctx.font = HAND(size);
    const sp = ctx.measureText(' ').width;
    const out = []; let x = 0, line = 0;
    c.tokens.forEach((k, i) => {
      const wd = ctx.measureText(k.w).width;
      if (x > 0 && x + wd > maxW) { x = 0; line++; }
      out.push({ ...k, i, x: x0 + x, wd, line }); x += wd + sp;
    });
    if (c.emoji) { const wd = ctx.measureText(c.emoji).width; if (x + wd > maxW) { x = 0; line++; } out.push({ w: c.emoji, emo: true, i: 999, x: x0 + x, wd, line }); }
    const top = 1072; // baseline of the first line sits on a notebook line
    out.forEach((k) => { k.y = top + k.line * lh; });
    return (c._lay = { toks: out, size, lines: line + 1 });
  }
  function clueWords(ctx, c, t) {
    const lay = layoutClue(ctx, c), words = c.vo.words;
    ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left'; ctx.font = HAND(lay.size);
    // highlighter swipes behind the <em> words first
    for (const k of lay.toks) {
      if (!k.em || k.emo) continue;
      const w = words[k.i]; const u = clamp((t - w.t) / Math.max(0.12, w.end - w.t));
      if (u <= 0) continue;
      ctx.fillStyle = 'rgba(255,225,77,0.75)';
      ctx.beginPath(); ctx.roundRect(k.x - 6, k.y - 58, (k.wd + 14) * u, 72, 8); ctx.fill();
    }
    for (const k of lay.toks) {
      const w = k.emo ? { t: words[words.length - 1].end, end: words[words.length - 1].end + 0.2 } : words[k.i];
      const u = clamp((t - w.t) / Math.max(0.1, (w.end - w.t) * 0.85));
      if (u <= 0) continue;
      ctx.save();
      ctx.beginPath(); ctx.rect(k.x - 10, k.y - 80, (k.wd + 20) * u, 110); ctx.clip(); // the pen writes left to right
      ctx.translate(k.x, k.y + (H01(k.i, 2) - 0.5) * 4); ctx.rotate((H01(k.i, 9) - 0.5) * 0.04);
      ctx.fillStyle = k.em ? RED : BLUE; ctx.fillText(k.w, 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }
  function snap(ctx, c, t) {
    // the clue art as a taped photo: drops onto the page at t0
    const a = clamp((t - c.t0) / 0.36);
    if (a <= 0) return;
    const s = lerp(1.5, 1, ease.outBack(a, 1.7)), rot = (c.k % 2 ? -1 : 1) * 0.035 + (1 - a) * 0.2;
    ctx.save(); ctx.globalAlpha = clamp(a * 3);
    ctx.translate(PHOTO.x, PHOTO.y + Math.sin(t * 1.6) * 3); ctx.scale(s, s);
    G.photo(ctx, IMG.snaps[c.k - 1], 0, 0, PHOTO.w, PHOTO.h, { rot, seed: c.k * 7, border: 18, tape: true });
    ctx.restore();
  }
  function header(ctx, c, t) {
    const p = pop(t, c.t0 + 0.02, 0.32, 3);
    txt(ctx, `CLUE ${c.k}`, 128, 300, { font: MARK(96), align: 'left', rot: -0.04 + boilRot(c.k), scale: p, color: INK });
    txt(ctx, '/5', 128 + 330, 318, { font: MARK(52), align: 'left', rot: -0.04, scale: p, color: '#7b6f66' });
    scribbleCircle(ctx, 300, 304, 230, 74, clamp((t - c.t0 - 0.1) / 0.45), RED, c.k);
    // points sticky with the 5 coins (spent ones crossed out)
    const sp = pop(t, c.t0 + 0.12, 0.34, 3);
    if (sp > 0) {
      ctx.save(); ctx.translate(800, 312); ctx.scale(sp, sp); ctx.rotate(0.06);
      sticky(ctx, 0, 0, 220, 190, 0, STICKY, c.k + 40);
      txt(ctx, 'WORTH', 0, -54, { font: HAND(34), color: '#6b5a2a' });
      txt(ctx, `${c.pts} PTS`, 0, 4, { font: MARK(62), color: RED, scale: 1 + 0.06 * beatPulse(t) * (t < c.think ? 1 : 0) });
      for (let i = 0; i < 5; i++) {
        const x = -76 + i * 38, y = 62, spent = i >= c.pts;
        ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fillStyle = spent ? 'rgba(0,0,0,0.12)' : '#f5b301'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
        if (spent) { ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 12, y + 12); ctx.lineTo(x + 12, y - 12); ctx.stroke(); }
      }
      ctx.restore();
    }
  }
  function cluePage(ctx, c, t) {
    notebook(ctx, c.k);
    header(ctx, c, t);
    snap(ctx, c, t);
    clueWords(ctx, c, t);
    // rank stamp on the photo once the clue has been read
    stamp(ctx, `${c.rankEmoji} ${c.rank}`, PHOTO.x - 120, PHOTO.y - 180, -0.1, pop(t, c.rankAt, 0.3, 3.4), { size: 44, sub: 'get it here =' });
    // last-clue warning
    if (c.k === 5 && t >= c.t0 && t < c.t0 + 1.7) {
      const o = 1 - clamp((t - c.t0 - 1.4) / 0.3);
      ctx.save(); ctx.globalAlpha = o; stamp(ctx, 'LAST CHANCE!', PHOTO.x, PHOTO.y - 180, -0.1, pop(t, c.t0 + 0.1, 0.3, 3), { size: 70 }); ctx.restore();
    }
    // countdown: marker numbers in a doodle burst over the photo
    if (t >= c.think && t < c.t1 - BEAT * 0.55) {
      const j = Math.floor((t - c.think) / BEAT), n = 3 - j;
      if (n >= 1) {
        const p = pop(t, c.ticks[j], 0.26, 3.6);
        ctx.save(); ctx.translate(PHOTO.x, PHOTO.y); ctx.scale(p, p);
        burst(ctx, 0, 0, 170, n === 1 ? '#ff8a7a' : HI, 30 + j, 12, j * 0.3);
        txt(ctx, String(n), 0, 8, { font: MARK(230), color: n === 1 ? RED : INK, rot: boilRot(j) });
        ctx.restore();
        const gp = pop(t, c.think, 0.3, 3);
        txt(ctx, c.k === 1 ? 'got it already?!' : c.k === 5 ? 'final answer?!' : 'got it yet?!', PHOTO.x + 10, PHOTO.y + 225, { font: HAND(84), color: RED, rot: -0.05, scale: gp, halo: 16, haloColor: '#fffdf5' });
      }
    }
  }

  // ---------- intro page ----------
  function introPage(ctx, t) {
    notebook(ctx, 0);
    const words = [['GUESS', 300, 150, -0.05, INK], ['THAT', 430, 120, 0.03, INK], ['CHARACTER', 575, 128, -0.03, RED]];
    words.forEach(([w, y, size, rot, col], i) => {
      const p = pop(t, ev.title[i], 0.28, 3.2);
      txt(ctx, w, 540, y, { font: MARK(size), color: col, rot: rot + boilRot(i), scale: p, halo: 14, haloColor: '#fdfaf0' });
    });
    underline(ctx, 170, 910, 650, clamp((t - ev.title[2] - 0.15) / 0.4), INK, 3);
    txt(ctx, 'one piece edition', 540, 718, { font: HAND(58), color: BLUE, rot: -0.02, alpha: clamp((t - 0.9) / 0.2) });
    // the owner's cover, taped in as a polaroid
    const a = clamp((t - ev.cover) / 0.35);
    if (a > 0) {
      const s = lerp(1.4, 1, ease.outBack(a, 1.6));
      ctx.save(); ctx.globalAlpha = clamp(a * 3); ctx.translate(400, 1080); ctx.scale(s, s);
      G.photo(ctx, IMG.cover, 0, 0, 300, 533, { rot: -0.06 + (1 - a) * 0.2, seed: 5, border: 16, tape: true });
      ctx.restore();
    }
    stamp(ctx, `${D.mode} 💀`, 420, 1215, -0.13, t < ev.canYou ? 0 : lerp(1.8, 1, ease.outCubic(clamp((t - ev.canYou) / 0.16))), { size: 66 }); // slams down on the beat
    txt(ctx, 'can YOU?', 560, 1420, { font: HAND(96), color: RED, rot: -0.04, scale: pop(t, ev.canYou + 0.2, 0.3, 3), halo: 12, haloColor: '#fdfaf0' });
  }

  // ---------- ending page: treasure chest reveal ----------
  const CHEST = { x: 590, y: 820, w: 420, h: 250 };
  function chest(ctx, t) {
    const roll = t >= ev.roll && t < ev.reveal ? clamp((t - ev.roll) / (ev.reveal - ev.roll)) : 0;
    const open = clamp((t - ev.reveal) / 0.3);
    const jig = roll ? (U.noise1(t * 40, 5) * (4 + 14 * roll)) : 0;
    const { x, y, w, h } = CHEST;
    ctx.save(); ctx.translate(x + jig, y + Math.abs(jig) * -0.4);
    if (open > 0) { // light pouring out
      ctx.save(); ctx.globalAlpha = 0.9 * open; G.rays(ctx, 0, -h / 2, { n: 22, r0: 90, r1: 900, color: '#ffcf3a', lw: 22, alpha: 0.6, spin: t * 0.4, seed: 4 }); ctx.restore();
      ctx.save(); const g = ctx.createRadialGradient(0, -h / 2, 10, 0, -h / 2, 300); g.addColorStop(0, `rgba(255,230,120,${0.9 * open})`); g.addColorStop(1, 'rgba(255,230,120,0)'); ctx.fillStyle = g; ctx.fillRect(-400, -h / 2 - 320, 800, 640); ctx.restore();
    }
    // body
    G.rrect(ctx, -w / 2, -h / 2, w, h, 18, { fill: '#a0612b', stroke: INK, lw: 6, seed: 61, hatch: { color: 'rgba(60,30,10,0.25)', gap: 14, angle: 0.2, lw: 2 } });
    G.rrect(ctx, -w / 2, -h / 2 + 30, w, 34, 4, { fill: '#e8b923', stroke: INK, lw: 4, seed: 62 });
    G.rrect(ctx, -w / 2 + 40, -h / 2, 34, h, 4, { fill: '#e8b923', stroke: INK, lw: 4, seed: 63 });
    G.rrect(ctx, w / 2 - 74, -h / 2, 34, h, 4, { fill: '#e8b923', stroke: INK, lw: 4, seed: 64 });
    G.rrect(ctx, -32, -h / 2 + 10, 64, 72, 10, { fill: '#e8b923', stroke: INK, lw: 4, seed: 65 });
    // lid, hinged at the back edge; rattles during the roll, flies open at the reveal
    ctx.save(); ctx.translate(0, -h / 2);
    if (open > 0) {
      const e = ease.outBack(open, 2);
      G.ellipse(ctx, 0, 0, w / 2 - 10, 34, { fill: '#5a3410', stroke: INK, lw: 5, seed: 68 });
      for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(-140 + i * 46, -14 - (i % 2) * 14, 22, 0, Math.PI * 2); ctx.fillStyle = '#f5c518'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); }
      ctx.translate(-30 * e, -150 * e); ctx.rotate(-0.32 * e);
    } else {
      const lidRot = -Math.abs(U.noise1(t * 30, 9)) * 0.12 * roll;
      ctx.translate(w / 2, 0); ctx.rotate(lidRot); ctx.translate(-w / 2, 0);
    }
    G.shape(ctx, [[-w / 2 - 8, 0], [-w / 2 - 8, -70], [-w / 2 + 40, -128], [w / 2 - 40, -128], [w / 2 + 8, -70], [w / 2 + 8, 0]], { fill: '#b8703a', stroke: INK, lw: 6, seed: 66 });
    G.rrect(ctx, -w / 2 - 8, -44, w + 16, 30, 4, { fill: '#e8b923', stroke: INK, lw: 4, seed: 67 });
    ctx.restore();
    ctx.restore();
    if (roll > 0.05) { // motion lines
      for (const sgn of [-1, 1]) G.line(ctx, [[x + sgn * (w / 2 + 30), y - 60], [x + sgn * (w / 2 + 60), y - 80]], { color: INK, lw: 5, seed: 70 + sgn });
    }
  }
  function endPage(ctx, t) {
    const revealed = t >= ev.reveal;
    notebook(ctx, 6);
    chest(ctx, t);
    if (!revealed) {
      txt(ctx, 'WHO IS IT?', 590, 320, { font: MARK(120), color: INK, rot: -0.04 + boilRot(1), scale: pop(t, ev.ask + 0.05, 0.32, 3), halo: 14, haloColor: PAGES[6] });
      txt(ctx, 'lock in your answer! 👇', 590, 430, { font: HAND(62), color: RED, rot: -0.02, scale: pop(t, ev.ask + 0.7, 0.3, 3) });
      ev.count.forEach((tc, j) => {
        if (t < tc || t >= tc + 2 * BEAT) return;
        const p = pop(t, tc, 0.26, 3.6), n = 3 - j;
        ctx.save(); ctx.translate(590, 570); ctx.scale(p, p);
        burst(ctx, 0, 0, 110, n === 1 ? '#ff8a7a' : HI, 80 + j, 10, j);
        txt(ctx, String(n), 0, 6, { font: MARK(150), color: n === 1 ? RED : INK });
        ctx.restore();
      });
    } else {
      txt(ctx, 'the answer is...', 590, 300, { font: HAND(66), color: BLUE, rot: -0.03, scale: pop(t, ev.reveal, 0.25, 3) });
      // name on a paper banner bursting out of the chest
      const p = pop(t, ev.reveal + 0.05, 0.42, 3.2);
      let size = 150; ctx.font = MARK(size); const mw = ctx.measureText(D.answer.toUpperCase()).width;
      if (mw > 640) size = Math.floor(size * 640 / mw);
      ctx.font = MARK(size); const bw = Math.max(420, ctx.measureText(D.answer.toUpperCase()).width + 120);
      ctx.save(); ctx.translate(590, 500 + (1 - p) * 220); ctx.rotate(-0.04 + Math.sin(t * 3) * 0.012); ctx.scale(p, p);
      G.tornPaper(ctx, -bw / 2, -size * 0.75, bw, size * 1.5, { fill: '#fff8dc', seed: 9, tear: 5 });
      txt(ctx, D.answer.toUpperCase(), 0, 6, { font: MARK(size), color: RED, rot: boilRot(5), scale: 1 + 0.03 * beatPulse(t) });
      ctx.restore();
      G.confetti(ctx, t, ev.reveal, { n: 150, seed: 7, spawn: 1.6, x0: 200, x1: 1000 });
      if (t >= ev.score) {
        const sp = clamp((t - ev.score) / 0.4), y = lerp(1700, 1240, ease.outBack(sp, 1.4));
        ctx.save(); ctx.translate(600, y); ctx.rotate(0.025);
        sticky(ctx, 0, 0, 600, 420, 0, STICKY, 91);
        txt(ctx, 'comment your score! 👇', 0, -158, { font: HAND(52), color: RED });
        const rows = [['clue 1', '5 pts', '🧠'], ['clue 2', '4 pts', '🔥'], ['clue 3', '3 pts', '😎'], ['clue 4', '2 pts', '👍'], ['clue 5', '1 pt', '😅']];
        rows.forEach((r, i) => {
          const rp = pop(t, ev.score + 0.25 + i * 0.12, 0.22, 3);
          const yy = -90 + i * 64;
          txt(ctx, `${r[2]} got it on ${r[0]}`, -250, yy, { font: HAND(46), color: BLUE, align: 'left', scale: rp });
          txt(ctx, r[1], 250, yy, { font: MARK(42), color: INK, align: 'right', scale: rp });
        });
        ctx.restore();
      }
    }
  }

  // ---------- CTA page ----------
  const BTN = { x: 680, y: 1070, w: 500, h: 150 };
  function ctaPage(ctx, t) {
    notebook(ctx, 7);
    txt(ctx, 'NEW QUIZ', 540, 390, { font: MARK(130), color: INK, rot: -0.04 + boilRot(2), scale: pop(t, ev.cta + 0.05, 0.3, 3) });
    txt(ctx, 'EVERY DAY!', 540, 525, { font: MARK(130), color: RED, rot: 0.02 + boilRot(3), scale: pop(t, ev.cta + 0.3, 0.3, 3) });
    const q = pop(t, ev.cta + 0.6, 0.3, 3);
    if (q > 0) {
      ctx.save(); ctx.translate(540, 690); ctx.scale(q, q); ctx.rotate(-0.02);
      G.rrect(ctx, -260, -52, 520, 104, 18, { fill: '#e6f0ff', stroke: BLUE, lw: 5, seed: 12 });
      txt(ctx, '12 PM & 8 PM ET', 0, 4, { font: HAND(64), color: BLUE });
      ctx.restore();
    }
    const press = ev.cta + 1.4, down = t >= press && t < press + 0.18;
    const r = pop(t, ev.cta + 0.9, 0.3, 3) * (down ? 0.92 : 1);
    if (r > 0) {
      ctx.save(); ctx.translate(BTN.x, BTN.y); ctx.scale(r, r); ctx.rotate(0.03);
      G.rrect(ctx, -BTN.w / 2 + 8, -BTN.h / 2 + 12, BTN.w, BTN.h, 30, { fill: 'rgba(0,0,0,0.25)', stroke: null, seed: 13 });
      G.rrect(ctx, -BTN.w / 2, -BTN.h / 2, BTN.w, BTN.h, 30, { fill: '#e8211b', stroke: INK, lw: 7, seed: 14 });
      txt(ctx, 'SUBSCRIBE', 40, 6, { font: MARK(62), color: '#fff' });
      // doodled bell that rings after the press
      const ring = t > press ? Math.sin((t - press) * 30) * Math.exp(-(t - press) * 3) * 0.5 : 0;
      ctx.save(); ctx.translate(-185, -4); ctx.rotate(ring);
      G.shape(ctx, [[-22, 22], [-18, -8], [-10, -22], [10, -22], [18, -8], [22, 22]], { fill: '#ffd34d', stroke: INK, lw: 4, seed: 15 });
      ctx.beginPath(); ctx.arc(0, 28, 7, 0, Math.PI * 2); ctx.fillStyle = INK; ctx.fill();
      ctx.restore();
      ctx.restore();
      if (t > press) for (let i = 0; i < 3; i++) { const a = -2.4 + i * 0.5, u = clamp((t - press) / 0.3); G.line(ctx, [[BTN.x - 185 + Math.cos(a) * 50, BTN.y + Math.sin(a) * 50], [BTN.x - 185 + Math.cos(a) * (50 + 40 * u), BTN.y + Math.sin(a) * (50 + 40 * u)]], { color: INK, lw: 5, seed: 20 + i }); }
    }
    txt(ctx, 'hit it! →', 300, 1250, { font: HAND(60), color: BLUE, rot: -0.06, alpha: t > ev.cta + 2.4 ? 0 : clamp((t - ev.cta - 0.9) / 0.2) });
  }

  // ---------- pages + page-tear transitions ----------
  const pages = [{ t0: 0, t1: clues[0].t0, draw: introPage, k: 0 }];
  for (const c of clues) pages.push({ t0: c.t0, t1: c.t1, draw: (ctx, t) => cluePage(ctx, c, t), k: c.k });
  pages.push({ t0: ev.ask, t1: ev.cta, draw: endPage, k: 6 });
  pages.push({ t0: ev.cta, t1: S.DURATION + 1, draw: ctaPage, k: 7 });

  function tornTop(ctx, seed) {
    ctx.beginPath(); ctx.moveTo(0, 96);
    for (let x = 0; x <= W; x += 24) ctx.lineTo(x, 96 + (H01(seed, x) - 0.5) * 22);
    ctx.lineTo(W, H + 400); ctx.lineTo(0, H + 400); ctx.closePath();
  }
  function drawPages(ctx, t) {
    let cur = 0; for (let i = 0; i < pages.length; i++) if (t >= pages[i].t0) cur = i;
    const nx = pages[cur + 1];
    const tearing = nx && t >= nx.t0 - TR;
    const pg = pages[cur];
    if (tearing) {
      nx.draw(ctx, nx.t0); // the next page waits underneath
      const u = ease.inCubic(clamp((t - (nx.t0 - TR)) / TR));
      ctx.save();
      ctx.translate(W * 0.15, -40); ctx.rotate(-u * 0.5); ctx.translate(-W * 0.15, 40 - u * H * 1.05);
      ctx.translate(-u * 220, 0);
      ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20;
      tornTop(ctx, pg.k + 3); ctx.fillStyle = PAGES[pg.k % PAGES.length]; ctx.fill();
      ctx.shadowColor = 'transparent';
      tornTop(ctx, pg.k + 3); ctx.clip();
      pg.draw(ctx, Math.min(t, pg.t1 - 1e-3));
      ctx.restore();
    } else pg.draw(ctx, t);
  }

  // ---------- the host, walking across the pages ----------
  const VOICE = S.voice;
  function mouthAt(t) {
    for (const v of VOICE) if (t >= v.at && t < v.end) { const env = D.vo[v.key].env || [], i = Math.floor((t - v.at) * 60); return clamp(((env[i] || 0) - 0.08) / 0.75); }
    return 0;
  }
  function walk(t, t0, dur, a, b) { // a, b = [x, feetY]
    const u = clamp((t - t0) / dur), e = ease.inOutCubic(u);
    const x = lerp(a[0], b[0], e), y = lerp(a[1], b[1], e);
    return { x, y, phase: Math.hypot(x - a[0], y - a[1]) / 78 * Math.PI, moving: u > 0 && u < 1, face: b[0] >= a[0] ? 1 : -1, pose: 'walk' };
  }
  const lastOf = (arr, t) => arr.filter((x) => x <= t).pop();
  const P_INTRO = [860, 1450], P_CLUE = [150, 1000], P_END = [150, 1150], P_CTA = [330, 1320];
  function hostState(t) {
    // intro
    if (t < clues[0].t0 - TR) {
      if (t < ev.hostIn + 1.0) { const w = walk(t, ev.hostIn, 1.0, [1240, 1450], P_INTRO); return { ...w, expr: 'smile' }; }
      if (t < ev.canYou) return { x: P_INTRO[0], y: P_INTRO[1], face: -1, pose: 'talk', expr: 'smile' };
      return { x: P_INTRO[0], y: P_INTRO[1], face: -1, pose: 'point', pointAt: [200, -40], look: 1, expr: 'grin' };
    }
    if (t < clues[0].t0 + 0.7) { const w = walk(t, clues[0].t0 - TR, 1.1, P_INTRO, P_CLUE); return { ...w, expr: 'grin' }; }
    // clues
    for (const c of clues) {
      if (t >= c.t1 - TR) continue;
      if (t < c.t0 - TR) continue;
      const st = { x: P_CLUE[0], y: P_CLUE[1], face: 1 };
      const worried = c.k === 5;
      if (t < c.t0 + 0.15) { // hop as the old page rips away
        const j = clamp((t - (c.t0 - TR)) / (TR + 0.15));
        return { ...st, pose: 'cheer', hop: Math.sin(j * Math.PI) * 110, expr: 'grin' };
      }
      if (t < c.vo.at) return { ...st, pose: 'talk', expr: worried ? 'worried' : 'smile', sweat: worried };
      if (t < c.think) return { ...st, pose: 'point', pointAt: [170, -60], look: 1, expr: 'smile' };
      const tick = lastOf(c.ticks, t), tap = tick !== undefined ? Math.exp(-(t - tick) * 10) : 0;
      return { ...st, pose: 'think', expr: 'think', look: 0.6, lookY: -1, tap, hop: 6 * tap, bubble: true };
    }
    // ending
    if (t < ev.ask + 0.15) { const j = clamp((t - (ev.ask - TR)) / (TR + 0.15)); return { x: P_CLUE[0], y: P_CLUE[1], face: 1, pose: 'cheer', hop: Math.sin(j * Math.PI) * 110, expr: 'grin' }; }
    if (t < ev.ask + 0.9) { const w = walk(t, ev.ask + 0.15, 0.75, P_CLUE, P_END); return { ...w, expr: 'think' }; }
    if (t < ev.cta - TR) {
      const st = { x: P_END[0], y: P_END[1], face: 1 };
      if (t < ev.roll) return { ...st, pose: 'shrug', expr: 'worried' };
      if (t < ev.reveal) { const k = clamp((t - ev.roll) / (ev.reveal - ev.roll)); return { ...st, pose: 'nervous', expr: 'wide', shake: 4 + 10 * k, sweat: true, look: 1 }; }
      const j = clamp((t - ev.reveal) / 0.55), hop = Math.sin(j * Math.PI) * 190 + (t > ev.reveal + 0.55 ? 16 * beatPulse(t) : 0);
      if (t < ev.score) return { ...st, pose: 'cheer', expr: 'grin', hop };
      return { ...st, pose: 'point', pointAt: [160, 60], look: 1, expr: 'grin', hop: 8 * beatPulse(t) };
    }
    // CTA: walk to the button, press it, wave
    if (t < ev.cta + 0.9) { const w = walk(t, ev.cta - TR, 1.3, P_END, P_CTA); return { ...w, expr: 'grin' }; }
    const st = { x: P_CTA[0], y: P_CTA[1], face: 1 };
    const press = ev.cta + 1.4;
    if (t < press + 0.6) { const push = t >= press - 0.15 && t < press + 0.2 ? 20 : 0; return { ...st, pose: 'point', pointAt: [190 + push, -60], look: 1, expr: 'grin', lean: push * 0.4 }; }
    return { ...st, pose: 'wave', expr: 'happy' };
  }

  Studio.film({
    async init() {
      IMG.cover = await Studio.loadImage('assets/cover.jpg');
      for (let i = 1; i <= 5; i++) IMG.art.push(await Studio.loadImage(`assets/art_${i}.png`));
      // each clue's photo: its own colour wash behind the original illustration
      clues.forEach((c, i) => {
        const cv = G.makeCanvas(1080, 960), d = cv.getContext('2d');
        const g = d.createRadialGradient(540, 360, 40, 540, 480, 900); g.addColorStop(0, c.bg[0] || '#fff'); g.addColorStop(0.55, c.bg[1] || '#ccc'); g.addColorStop(1, c.bg[2] || '#333');
        d.fillStyle = g; d.fillRect(0, 0, 1080, 960);
        d.drawImage(IMG.art[i], 0, 0, 1080, 960);
        IMG.snaps.push(cv);
      });
    },
    draw(ctx, t) {
      drawPages(ctx, t);
      const st = hostState(t);
      Host.draw(ctx, { s: 1.0, t, mouth: mouthAt(t), ...st });
    },
    post: { paper: 0.3, vignette: 0.18, grain: 0.03 },
    fadeOut: 0.4,
  });
})();
