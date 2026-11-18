// THE FILM: draws frame t of the Guess That Character Short. Pure function of t.
(function () {
  const U = globalThis.U, G = globalThis.G, S = globalThis.SCORE, Studio = globalThis.Studio, UI = globalThis.UI;
  const { BEAT, ev, clues, D } = S;
  const { clamp, lerp, ease } = U;
  const W = G.W, H = G.H;
  const SAFE_R = 930; // keep text left of the Shorts action buttons
  const IMG = { art: [] };
  let DOTS = null;

  const font = (size, weight = 800, fam = 'Inter') => `${weight} ${size}px ${fam}, "Noto Color Emoji", sans-serif`;
  const pop = (t, t0, d = 0.32, s = 2.2) => (t < t0 ? 0 : UI.pop(t, t0, d, s));
  const fade = (t, t0, d) => clamp((t - t0) / d);
  const beatPulse = (t) => Math.exp(-((t % BEAT) / BEAT) * 6);

  function textStroke(ctx, str, x, y, { size = 80, color = '#fff', stroke = '#111', sw = 14, align = 'center', weight = 800, fam = 'Inter', alpha = 1, shadow = true } = {}) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.font = font(size, weight, fam); ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    if (shadow) { ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillText(str, x + size * 0.06, y + size * 0.1); }
    if (sw) { ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.strokeText(str, x, y); }
    ctx.fillStyle = color; ctx.fillText(str, x, y);
    ctx.restore();
  }
  function pill(ctx, str, x, y, { size = 30, bg = '#fff', fg = '#111', border = null, rot = 0, padX = 26, padY = 14, align = 'left', shadow = 'rgba(0,0,0,.4)', hard = false } = {}) {
    ctx.save();
    ctx.font = font(size, 800);
    const w = ctx.measureText(str).width + padX * 2, h = size + padY * 2;
    const x0 = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
    ctx.translate(x0 + w / 2, y); ctx.rotate(rot);
    if (hard) { ctx.fillStyle = '#111'; rr(ctx, -w / 2 + 7, -h / 2 + 7, w, h, 16); ctx.fill(); }
    else if (shadow) { ctx.shadowColor = shadow; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; }
    ctx.fillStyle = bg; rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fill();
    ctx.shadowColor = 'transparent';
    if (border) { ctx.lineWidth = 5; ctx.strokeStyle = border; ctx.stroke(); }
    ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(str, 0, 2);
    ctx.restore();
    return w;
  }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

  // ---------- backgrounds ----------
  function rays(ctx, t, cx, cy, alpha) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.12);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    const n = 28;
    for (let i = 0; i < n; i++) { const a0 = (i / n) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 2600, a0, a0 + Math.PI / n * 0.75); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  function bgGradient(ctx, cols, t) {
    const g = ctx.createRadialGradient(540, 640, 30, 540, 700, 1500);
    g.addColorStop(0, cols[0]); g.addColorStop(0.42, cols[1]); g.addColorStop(1, cols[2]);
    ctx.fillStyle = g; ctx.fillRect(-60, -60, W + 120, H + 120);
    rays(ctx, t, 540, 640, 0.06 + 0.03 * beatPulse(t));
    if (DOTS) { ctx.globalAlpha = 0.5; ctx.drawImage(DOTS, 0, 0); ctx.globalAlpha = 1; }
  }

  // ---------- clue card with karaoke words ----------
  function layoutCard(ctx, c, size, maxW) {
    ctx.font = font(size, 800);
    const sp = ctx.measureText(' ').width;
    const toks = c.tokens.map((k, i) => ({ ...k, i, wd: ctx.measureText(k.w).width }));
    const lines = []; let line = [], x = 0;
    for (const k of toks) {
      if (line.length && x + k.wd > maxW) { lines.push(line); line = []; x = 0; }
      k.x = x; line.push(k); x += k.wd + sp;
    }
    if (c.emoji) { const e = { w: c.emoji, emo: true, wd: ctx.measureText(c.emoji).width, i: 999 }; if (x + e.wd > maxW) { lines.push(line); line = []; x = 0; } e.x = x; line.push(e); }
    lines.push(line);
    return lines;
  }
  function tornRect(ctx, w, h, seed) {
    ctx.beginPath();
    const jag = (n, a, b, fx, fy) => { for (let i = 0; i <= n; i++) { const u = i / n; const j = (U.hash(seed, i, a) - 0.5) * 14; fx(u, j); } };
    ctx.moveTo(0, 8);
    jag(14, 1, 0, (u, j) => ctx.lineTo(u * w, 6 + j * 0.6));
    jag(6, 2, 0, (u, j) => ctx.lineTo(w + j * 0.4 - 4, u * h));
    jag(14, 3, 0, (u, j) => ctx.lineTo(w - u * w, h - 6 + j * 0.6));
    jag(6, 4, 0, (u, j) => ctx.lineTo(4 + j * 0.3, h - u * h));
    ctx.closePath();
  }
  function card(ctx, c, t) {
    const size = 58, lh = 66, padX = 46, padTop = 104, padBot = 48, w = 880, x0 = 50;
    const lines = layoutCard(ctx, c, size, w - padX * 2);
    const h = padTop + lines.length * lh + padBot;
    const y0 = 1062;
    const u = clamp((t - c.cardIn) / 0.38);
    if (u <= 0) return;
    const slide = (1 - ease.outBack(u, 1.6)) * 700;
    ctx.save();
    ctx.translate(x0 + w / 2, y0 + h / 2 + slide); ctx.rotate(-0.021 + (1 - u) * 0.08); ctx.translate(-w / 2, -h / 2);
    ctx.save(); ctx.translate(12, 14); tornRect(ctx, w, h, c.k); ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fill(); ctx.restore();
    tornRect(ctx, w, h, c.k);
    const pg = ctx.createLinearGradient(0, 0, w, h); pg.addColorStop(0, '#fbf0d6'); pg.addColorStop(1, '#ead2a0');
    ctx.fillStyle = pg; ctx.fill();
    // ribbon
    ctx.fillStyle = '#c8262c'; rr(ctx, padX, 34, 190, 48, 8); ctx.fill();
    ctx.font = font(28, 800); ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center'; ctx.fillText(`CLUE #${c.k}`, padX + 95, 59);
    // words
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.font = font(size, 800);
    const words = c.vo.words;
    lines.forEach((line, li) => {
      for (const k of line) {
        const wt = k.emo ? words[words.length - 1].end : words[k.i].t;
        const said = t >= wt;
        const cur = !k.emo && t >= wt && t < words[k.i].end + 0.05;
        const p = pop(t, wt, 0.22, 3);
        ctx.save();
        const bx = padX + k.x, by = padTop + 40 + li * lh;
        ctx.translate(bx + k.wd / 2, by - 20);
        const s = said ? 1 + (cur ? 0.08 * (1 - clamp((t - wt) / 0.25)) : 0) : 1;
        ctx.scale(s, s);
        if (cur) { ctx.fillStyle = k.em ? 'rgba(200,38,44,0.16)' : 'rgba(255,211,77,0.55)'; rr(ctx, -k.wd / 2 - 6, -36, k.wd + 12, 56, 10); ctx.fill(); }
        ctx.globalAlpha = said ? 1 : 0.4;
        ctx.fillStyle = k.em ? '#c8262c' : '#2b1a0e';
        if (k.emo) { ctx.globalAlpha = p; }
        ctx.fillText(k.w, -k.wd / 2, 20);
        ctx.restore();
      }
    });
    // rank badge
    const rp = pop(t, c.rankAt, 0.35, 3);
    if (rp > 0) {
      ctx.save(); ctx.translate(w - 20, h + 6); ctx.rotate(0.07); ctx.scale(rp, rp);
      const str = `get it here = ${c.rankEmoji} ${c.rank}`; ctx.font = font(30, 800);
      const bw = ctx.measureText(str).width + 40;
      ctx.fillStyle = '#111'; rr(ctx, -bw, -28, bw, 56, 14); ctx.fill(); ctx.strokeStyle = '#ffd34d'; ctx.lineWidth = 4; ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(str, -bw / 2, 2);
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- header: clue stamp, points ladder, timer bar ----------
  function header(ctx, c, t) {
    pill(ctx, 'GUESS THAT CHARACTER', 50, 262, { size: 28 });
    const sp = pop(t, c.t0 + 0.02, 0.3, 3);
    ctx.save(); ctx.translate(SAFE_R - 110, 262); ctx.scale(0.4 + 0.6 * sp, 0.4 + 0.6 * sp); ctx.globalAlpha = clamp(sp * 3);
    pill(ctx, `CLUE ${c.k}/5`, 0, 0, { size: 34, bg: '#ffd34d', border: '#111', rot: 0.05, align: 'center', hard: true });
    ctx.restore();
    // ladder
    const y = 340; ctx.font = font(26, 800); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fillText('WORTH', 50, y + 2);
    for (let p = 5; p >= 1; p--) {
      const i = 5 - p, x = 190 + i * 92, k = i + 1;
      const now = k === c.k, gone = k < c.k;
      const s = now ? 1.18 + 0.08 * beatPulse(t) : 0.9;
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.fillStyle = now ? '#ffd34d' : gone ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.22)'; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = now ? '#111' : 'rgba(255,255,255,0.5)'; ctx.stroke();
      ctx.font = font(30, 800); ctx.textAlign = 'center'; ctx.fillStyle = now ? '#111' : gone ? 'rgba(255,255,255,0.4)' : '#fff';
      ctx.fillText(String(p), 0, 2);
      if (gone) { ctx.strokeStyle = '#ff4a4a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-20, 20); ctx.lineTo(20, -20); ctx.stroke(); }
      ctx.restore();
    }
    ctx.font = font(26, 800); ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fillText('PTS', 190 + 4 * 92 + 50, y + 2);
    // timer bar: full while the clue is read, drains over the think time
    const bx = 50, by = 392, bw = SAFE_R - 50, bh = 20;
    const left = t < c.think ? 1 : 1 - clamp((t - c.think) / (3 * BEAT));
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; rr(ctx, bx, by, bw, bh, 10); ctx.fill();
    ctx.fillStyle = left > 0.34 ? '#ffd34d' : '#ff4a4a'; rr(ctx, bx, by, Math.max(bh, bw * left), bh, 10); ctx.fill();
    ctx.strokeStyle = '#111'; ctx.lineWidth = 4; rr(ctx, bx, by, bw, bh, 10); ctx.stroke();
  }

  // ---------- the clue scene ----------
  function clueScene(ctx, c, t) {
    bgGradient(ctx, c.bg, t);
    // art: slam in, then a slow push and a bob on the beat
    const img = IMG.art[c.k - 1];
    const a = clamp((t - c.t0) / 0.38);
    const sIn = lerp(1.45, 1, ease.outBack(a, 1.8));
    const push = 1 + 0.06 * clamp((t - c.t0) / (c.t1 - c.t0));
    const bump = t < c.think ? 0.012 * beatPulse(t) : 0;
    const sc = 0.8 * sIn * push * (1 + bump);
    const cx = 490, cy = 770 + Math.sin(t * 2.2) * 6;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate((1 - ease.outCubic(a)) * -0.12 + Math.sin(t * 1.3) * 0.01); ctx.scale(sc, sc);
    ctx.globalAlpha = clamp(a * 4);
    if (img) ctx.drawImage(img, -540, -480, 1080, 960);
    ctx.restore();
    header(ctx, c, t);
    card(ctx, c, t);
    // countdown over the art during think time
    if (t >= c.think && t < c.t1 - BEAT * 0.6) {
      const j = Math.floor((t - c.think) / BEAT), n = 3 - j;
      if (n >= 1) {
        const p = pop(t, c.ticks[j], 0.25, 3.5);
        const ring = 1 - clamp((t - c.think) / (3 * BEAT));
        ctx.save(); ctx.translate(cx, 700);
        ctx.fillStyle = 'rgba(10,10,20,0.62)'; ctx.beginPath(); ctx.arc(0, 0, 170, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 22; ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.arc(0, 0, 150, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = n === 1 ? '#ff4a4a' : '#ffd34d'; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(0, 0, 150, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ring); ctx.stroke();
        ctx.scale(p, p);
        textStroke(ctx, String(n), 0, 10, { size: 210, color: n === 1 ? '#ff4a4a' : '#fff', sw: 16 });
        ctx.restore();
        const gp = pop(t, c.think, 0.3, 3);
        ctx.save(); ctx.translate(cx, 925); ctx.rotate(-0.04); ctx.scale(gp, gp);
        textStroke(ctx, c.k === 1 ? 'GOT IT ALREADY?' : c.k === 5 ? 'FINAL ANSWER?' : 'GOT IT YET?', 0, 0, { size: 64, color: '#ffd34d', sw: 14 });
        ctx.restore();
      }
    }
    // last clue warning
    if (c.k === 5 && t >= c.t0 && t < c.t0 + 1.6) {
      const p = pop(t, c.t0 + 0.08, 0.3, 3), o = 1 - clamp((t - c.t0 - 1.3) / 0.3);
      ctx.save(); ctx.globalAlpha = o; ctx.translate(490, 560); ctx.rotate(-0.1); ctx.scale(p, p);
      pill(ctx, '⚠️ LAST CHANCE!', 0, 0, { size: 60, bg: '#c8262c', fg: '#fff', border: '#111', align: 'center', hard: true });
      ctx.restore();
    }
  }

  // ---------- hook ----------
  function hookScene(ctx, t) {
    const img = IMG.cover;
    const z = lerp(1.32, 1.16, ease.outCubic(clamp(t / 0.45))) + 0.025 * t;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    if (img) { const w = W * z, h = H * z; ctx.drawImage(img, (W - w) / 2, -h * 0.02 - (z - 1.16) * 300, w, h); }
    // stamp on "Can you?"
    const p = pop(t, ev.canYou, 0.3, 3.2);
    if (p > 0) {
      ctx.save(); ctx.translate(500, 1080); ctx.rotate(-0.08); ctx.scale(p, p);
      pill(ctx, `${D.mode} 💀`, 0, 0, { size: 76, bg: '#c8262c', fg: '#fff', border: '#111', align: 'center', hard: true, padX: 36, padY: 22 });
      ctx.restore();
      const q = pop(t, ev.canYou + 0.22, 0.3, 3);
      ctx.save(); ctx.translate(500, 1250); ctx.rotate(0.04); ctx.scale(q, q);
      textStroke(ctx, 'CAN YOU?', 0, 0, { size: 120, color: '#ffd34d', sw: 18 });
      ctx.restore();
    }
  }

  // ---------- ending ----------
  function endScene(ctx, t) {
    const revealed = t >= ev.reveal;
    bgGradient(ctx, revealed ? ['#fff4c0', '#e0a020', '#3a1a00'] : ['#4a3a9a', '#1e1650', '#07051a'], t);
    if (revealed) rays(ctx, t * 3, 540, 760, 0.1);
    const shake = !revealed && t >= ev.roll ? 6 * clamp((t - ev.roll) / (ev.reveal - ev.roll)) : 0;
    ctx.save(); ctx.translate(U.noise1(t * 40, 1) * shake, U.noise1(t * 40, 2) * shake);
    if (!revealed) {
      const p = pop(t, ev.ask, 0.35, 3);
      ctx.save(); ctx.translate(490, 560 + Math.sin(t * 4) * 12); ctx.rotate(Math.sin(t * 2.5) * 0.06); ctx.scale(p, p);
      textStroke(ctx, '?', 0, 0, { size: 520, color: '#ffd34d', sw: 26 });
      ctx.restore();
      const q = pop(t, ev.ask + 0.15, 0.3, 3);
      ctx.save(); ctx.translate(490, 920); ctx.scale(q, q);
      textStroke(ctx, 'WHO IS IT?', 0, 0, { size: 118, sw: 18 }); ctx.restore();
      const r = pop(t, ev.ask + 0.9, 0.3, 3);
      ctx.save(); ctx.translate(490, 1060); ctx.scale(r, r);
      pill(ctx, 'LOCK IN YOUR ANSWER 👇', 0, 0, { size: 44, bg: '#ffd34d', fg: '#111', border: '#111', align: 'center', hard: true }); ctx.restore();
      // 3-2-1 before the reveal
      ev.count.forEach((tc, j) => {
        if (t < tc || t >= tc + 2 * BEAT) return;
        const pp = pop(t, tc, 0.28, 3.5), n = 3 - j;
        ctx.save(); ctx.translate(490, 1290); ctx.scale(pp, pp);
        textStroke(ctx, String(n), 0, 0, { size: 230, color: n === 1 ? '#ff4a4a' : '#fff', sw: 18 }); ctx.restore();
      });
    } else {
      G.confetti(ctx, t, ev.reveal, { n: 160, seed: 7, spawn: 1.8 });
      const lp = pop(t, ev.reveal + 0.02, 0.25, 3);
      ctx.save(); ctx.translate(490, 520); ctx.scale(lp, lp);
      textStroke(ctx, 'THE ANSWER IS...', 0, 0, { size: 62, sw: 12 }); ctx.restore();
      const p = pop(t, ev.reveal, 0.4, 3.2);
      let size = 190; ctx.font = font(size, 800); const mw = ctx.measureText(D.answer.toUpperCase()).width;
      if (mw > 820) size = Math.floor(size * 820 / mw);
      ctx.save(); ctx.translate(490, 700); ctx.rotate(-0.05 + Math.sin(t * 3) * 0.015); ctx.scale(p * (1 + 0.03 * beatPulse(t)), p * (1 + 0.03 * beatPulse(t)));
      textStroke(ctx, D.answer.toUpperCase(), 0, 0, { size, color: '#ffd34d', sw: 22 }); ctx.restore();
      // score recap
      if (t >= ev.score) {
        const rows = [['🧠', 'CLUE 1', '5 PTS'], ['🔥', 'CLUE 2', '4 PTS'], ['😎', 'CLUE 3', '3 PTS'], ['👍', 'CLUE 4', '2 PTS'], ['😅', 'CLUE 5', '1 PT']];
        rows.forEach((r, i) => {
          const rp = pop(t, ev.score + i * 0.12, 0.25, 3);
          if (rp <= 0) return;
          const y = 880 + i * 84;
          ctx.save(); ctx.translate(490, y); ctx.scale(rp, rp);
          ctx.fillStyle = 'rgba(17,17,17,0.82)'; rr(ctx, -330, -36, 660, 72, 18); ctx.fill();
          ctx.font = font(40, 800); ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillStyle = '#fff';
          ctx.fillText(`${r[0]}  GOT IT ON ${r[1]}`, -300, 2); ctx.textAlign = 'right'; ctx.fillStyle = '#ffd34d'; ctx.fillText(r[2], 300, 2);
          ctx.restore();
        });
        const cp = pop(t, ev.score + 0.8, 0.3, 3);
        ctx.save(); ctx.translate(490, 1340); ctx.rotate(0.03); ctx.scale(cp, cp);
        pill(ctx, 'COMMENT YOUR SCORE 👇', 0, 0, { size: 46, bg: '#c8262c', fg: '#fff', border: '#111', align: 'center', hard: true }); ctx.restore();
      }
    }
    ctx.restore();
  }
  function ctaScene(ctx, t) {
    bgGradient(ctx, ['#2a2a2a', '#111', '#000'], t);
    const p = pop(t, ev.cta, 0.35, 3);
    ctx.save(); ctx.translate(490, 640); ctx.scale(p, p);
    textStroke(ctx, 'NEW QUIZ', 0, -70, { size: 120, color: '#fff', sw: 16 });
    textStroke(ctx, 'EVERY DAY', 0, 60, { size: 120, color: '#ffd34d', sw: 16 });
    ctx.restore();
    const q = pop(t, ev.cta + 0.3, 0.3, 3);
    ctx.save(); ctx.translate(490, 860); ctx.scale(q, q);
    pill(ctx, '12 PM & 8 PM ET', 0, 0, { size: 50, bg: '#fff', fg: '#111', align: 'center' }); ctx.restore();
    const r = pop(t, ev.cta + 0.7, 0.3, 3);
    ctx.save(); ctx.translate(490, 1060); ctx.scale(r * (1 + 0.05 * beatPulse(t)), r * (1 + 0.05 * beatPulse(t)));
    pill(ctx, 'SUBSCRIBE 🔔', 0, 0, { size: 64, bg: '#e8211b', fg: '#fff', align: 'center', padX: 44, padY: 24, border: '#111', hard: true }); ctx.restore();
    if (t > ev.cta + 1.4) UI.tap(ctx, 590, 1070, t, ev.cta + 1.4, { color: '#fff', size: 90 });
  }

  // ---------- scene list + push transitions ----------
  const TR = 0.26;
  const scenes = [{ t0: 0, t1: clues[0].t0, draw: hookScene }];
  for (const c of clues) scenes.push({ t0: c.t0, t1: c.t1, draw: (ctx, t) => clueScene(ctx, c, t) });
  scenes.push({ t0: ev.ask, t1: ev.cta, draw: endScene });
  scenes.push({ t0: ev.cta, t1: S.DURATION + 1, draw: ctaScene });

  function drawScenes(ctx, t) {
    for (let i = 0; i < scenes.length; i++) {
      const s = scenes[i];
      const next = scenes[i + 1];
      if (t < s.t0 - TR || t >= s.t1) continue;
      let dx = 0;
      if (i > 0 && t < s.t0) dx = W * (1 - ease.inOutCubic(clamp((t - (s.t0 - TR)) / TR))); // entering
      else if (next && t >= s.t1 - TR) continue; // the incoming scene covers it
      ctx.save(); ctx.translate(dx, 0);
      if (dx > 0) { const prev = scenes[i - 1]; ctx.save(); ctx.translate(-W, 0); prev.draw(ctx, Math.min(t, prev.t1 - 1e-3)); ctx.restore(); }
      s.draw(ctx, Math.max(t, s.t0));
      ctx.restore();
    }
  }

  Studio.film({
    async init(ctx) {
      IMG.cover = await Studio.loadImage('assets/cover.jpg');
      for (let i = 1; i <= 5; i++) IMG.art.push(await Studio.loadImage(`assets/art_${i}.png`));
      DOTS = G.makeCanvas(W, H); const d = DOTS.getContext('2d');
      d.fillStyle = 'rgba(255,255,255,0.10)';
      for (let y = 0; y < H; y += 24) for (let x = 0; x < W; x += 24) { const k = Math.min(1, Math.abs(y / H - 0.58) * 3.2); if (k > 0.05) { d.globalAlpha = k; d.beginPath(); d.arc(x, y, 2.4, 0, Math.PI * 2); d.fill(); } }
    },
    draw(ctx, t) {
      // impact shake + flash on every slam
      const hitsT = [ev.canYou, ...clues.map((c) => c.t0), ev.reveal];
      const last = hitsT.filter((h) => h <= t).pop();
      const sh = last !== undefined ? 16 * Math.exp(-(t - last) * 9) : 0;
      ctx.save(); ctx.translate(U.noise1(t * 35, 3) * sh, U.noise1(t * 35, 4) * sh);
      drawScenes(ctx, t);
      ctx.restore();
      const fl = last !== undefined ? 0.55 * Math.exp(-(t - last) * 14) : 0;
      if (fl > 0.02) { ctx.fillStyle = `rgba(255,255,240,${fl})`; ctx.fillRect(0, 0, W, H); }
      if (t < 0.12) { ctx.fillStyle = `rgba(255,255,255,${0.8 * (1 - t / 0.12)})`; ctx.fillRect(0, 0, W, H); }
    },
    post: { paper: 0, vignette: 0.25, grain: 0 },
    fadeOut: 0.4,
  });
})();
