// THE FILM: Devil Fruit Files. A blank sketchbook page; a pencil sketches one picture per narration line,
// an eraser rubs it out, and the next picture is sketched. Pure function of t; all times come from score.js.
(function () {
  const U = globalThis.U, G = globalThis.G, S = globalThis.SCORE, Studio = globalThis.Studio, Sk = globalThis.Sketch;
  const { scenes, D } = S;
  const { clamp, ease } = U;
  const W = G.W, H = G.H;
  const BOX = [70, 330, 950, 1250]; // the drawing area (left of the Shorts buttons, above the captions)
  const sketches = (globalThis.FRUIT_SCENES || []).map((f) => f());
  let OFF = null;

  function paper(ctx) {
    ctx.fillStyle = '#fbf8f1'; ctx.fillRect(0, 0, W, H);
    // faint tooth + a couple of old smudges so it reads as real paper
    ctx.save(); ctx.globalAlpha = 0.045; ctx.fillStyle = '#6b6258';
    for (let i = 0; i < 3; i++) { const x = 200 + U.hash(i, 1) * 700, y = 400 + U.hash(i, 2) * 1100; ctx.beginPath(); ctx.ellipse(x, y, 160, 60, U.hash(i, 3) * 3, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function header(ctx, t) {
    const a = clamp(t / 0.4);
    ctx.save(); ctx.globalAlpha = a; ctx.font = '700 46px "Caveat", sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.fillStyle = '#d2453a'; ctx.fillText(`DEVIL FRUIT FILES  #${D.number || 1}`, 70, 268);
    ctx.strokeStyle = 'rgba(210,69,58,0.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(70, 292); ctx.lineTo(440, 288); ctx.stroke();
    ctx.restore();
  }

  // ---------- captions: short phrases, the spoken word highlighted ----------
  const chunks = scenes.map((s) => {
    const out = []; let cur = [], len = 0;
    s.words.forEach((w) => { if (cur.length && (len + w.w.length > 24 || /[.!?]$/.test(cur[cur.length - 1].w))) { out.push(cur); cur = []; len = 0; } cur.push(w); len += w.w.length + 1; });
    if (cur.length) out.push(cur);
    return out;
  });
  function captions(ctx, t) {
    for (const [si, s] of scenes.entries()) {
      if (t < s.at - 0.05 || t > s.end + 0.25) continue;
      const ch = chunks[si].find((c, k) => t < (chunks[si][k + 1] ? chunks[si][k + 1][0].t : s.end + 0.25));
      if (!ch) return;
      ctx.save(); ctx.font = '400 62px "Patrick Hand", "Noto Color Emoji", sans-serif'; ctx.textBaseline = 'middle';
      const sp = ctx.measureText(' ').width, ws = ch.map((w) => ctx.measureText(w.w).width), total = ws.reduce((a, b) => a + b, 0) + sp * (ch.length - 1);
      const cx = 480, y = 1400; let x = cx - total / 2;
      ctx.fillStyle = 'rgba(255,253,246,0.92)'; ctx.beginPath(); ctx.roundRect(cx - total / 2 - 28, y - 50, total + 56, 100, 18); ctx.fill();
      ctx.strokeStyle = 'rgba(59,59,66,0.25)'; ctx.lineWidth = 3; ctx.stroke();
      ch.forEach((w, i) => {
        const on = t >= w.t && t < w.end + 0.05;
        if (on) { ctx.fillStyle = 'rgba(255,214,77,0.8)'; ctx.beginPath(); ctx.roundRect(x - 6, y - 34, ws[i] + 12, 66, 10); ctx.fill(); }
        ctx.fillStyle = t >= w.t ? '#2b2b30' : 'rgba(43,43,48,0.45)'; ctx.textAlign = 'left'; ctx.fillText(w.w, x, y + 2);
        x += ws[i] + sp;
      });
      ctx.restore();
      return;
    }
  }

  // ---------- eraser crumbs ----------
  function crumbs(ctx, t, s, path) {
    const age = t - s.eraseT0;
    const pts = Sk.pathAt(path, clamp(age / S.ERASE));
    ctx.save();
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], d = Math.hypot(x1 - x0, y1 - y0);
      for (let k = 0; k < d / 34; k++) {
        const f = k * 34 / d, x = x0 + (x1 - x0) * f + (U.hash(i, k, 1) - 0.5) * 120, y = y0 + (y1 - y0) * f + (U.hash(i, k, 2) - 0.5) * 120;
        const fade = 1 - clamp((t - s.eraseT1) / 0.9);
        if (fade <= 0) continue;
        ctx.globalAlpha = 0.75 * fade; ctx.fillStyle = U.hash(i, k, 3) > 0.5 ? '#e8a2ad' : '#9a9aa2';
        ctx.beginPath(); ctx.ellipse(x, y + clamp(t - s.eraseT1) * 40, 3 + U.hash(i, k, 4) * 5, 2 + U.hash(i, k, 5) * 3, U.hash(i, k) * 3, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }

  const PATH = Sk.eraserPath([BOX[0] + 40, BOX[1] + 30, BOX[2] - 40, BOX[3] - 30], 7);
  function drawScene(ctx, t) {
    let si = 0; for (let i = 0; i < scenes.length; i++) if (t >= scenes[i].drawT0 - 0.35) si = i;
    const s = scenes[si], sk = sketches[si];
    const prev = si > 0 ? sketches[si - 1] : null;
    if (!sk) return;
    // the faint ghost of the last erased drawing never fully leaves the paper
    if (prev && t >= scenes[si - 1].eraseT1 - 0.01) Sk.render(ctx, prev, 1, 0.05);
    if (prev && t >= scenes[si - 1].eraseT1) crumbs(ctx, t, scenes[si - 1], PATH);
    // erasing the previous picture (still in the window before this scene's draw)
    if (si > 0 && t < scenes[si - 1].eraseT1) {
      const ps = scenes[si - 1];
      return erase(ctx, t, ps, prev);
    }
    if (t >= s.eraseT0) return erase(ctx, t, s, sk);
    const p = clamp((t - s.drawT0) / (s.drawT1 - s.drawT0));
    const tip = Sk.render(ctx, sk, p);
    // pencil: slides in, follows the line, lifts away when the sketch is done
    const first = sk.items[0].kind === 'stroke' ? sk.items[0].pts[0] : [sk.items[0].x - 200, sk.items[0].y];
    if (t < s.drawT0) { const u = clamp((t - (s.drawT0 - 0.35)) / 0.35); Sk.pencil(ctx, first[0], first[1], t, 1 - ease.outCubic(u)); }
    else if (tip) Sk.pencil(ctx, tip[0], tip[1], t, 0);
    else { const u = clamp((t - s.drawT1) / 0.45); if (u < 1) { const lp = sk._last || [600, 900]; Sk.pencil(ctx, lp[0] + u * 400, lp[1] + u * 600, t, ease.inCubic(u) * 2); } }
    if (tip) sk._last = tip;
  }
  function erase(ctx, t, s, sk) {
    const u = clamp((t - s.eraseT0) / S.ERASE);
    const o = OFF.getContext('2d');
    o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, W, H);
    Sk.render(o, sk, 1);
    o.globalCompositeOperation = 'destination-out'; o.lineCap = 'round'; o.lineJoin = 'round'; o.lineWidth = 260;
    const pts = Sk.pathAt(PATH, ease.inOutQuad(u));
    o.beginPath(); o.moveTo(pts[0][0], pts[0][1]); for (const p of pts) o.lineTo(p[0], p[1]); if (u > 0) o.stroke();
    o.globalCompositeOperation = 'source-over';
    ctx.drawImage(OFF, 0, 0);
    crumbs(ctx, t, s, PATH);
    if (u < 1) { const e = pts[pts.length - 1]; Sk.eraserSprite(ctx, e[0] + Math.sin(t * 50) * 8, e[1] + Math.cos(t * 37) * 6, t); }
  }

  Studio.film({
    async init() { OFF = G.makeCanvas(W, H); },
    draw(ctx, t) {
      paper(ctx);
      header(ctx, t);
      drawScene(ctx, t);
      captions(ctx, t);
    },
    post: { paper: 0.35, vignette: 0.16, grain: 0.035 },
    fadeOut: 0.8,
  });
})();
