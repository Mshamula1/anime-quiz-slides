// SKETCH: a tiny pencil-drawing toolkit. A sketch is a list of strokes and words, built once,
// then "drawn" progressively (a pencil follows the line being drawn) and later rubbed out by an eraser.
// Pure functions of t; no randomness except U.hash.
(function () {
  const U = globalThis.U;
  const H = (...a) => U.hash(...a);
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const GRAPHITE = '#26262c';
  const COL = { graphite: GRAPHITE, blue: '#2f6fd6', red: '#e0392f', orange: '#f28a1e', yellow: '#ffcc2e', green: '#3fae4a', brown: '#9a5a2a', pink: '#ff7fa0', gray: '#8a8a92', white: '#ffffff', purple: '#8a4fd0', lilac: '#b892ee', navy: '#1f2f6b', sky: '#7cc4ff', gold: '#f5b800', cream: '#fff3d6' };

  // ---------- builder ----------
  function pen(seed = 1) {
    const items = [];
    let n = 0;
    const humanize = (pts, o = {}) => {
      // low-frequency wobble perpendicular to the line + a small overshoot at the ends, like a real hand
      const rough = o.rough ?? 2.2, s = seed * 97 + (n++) * 13;
      const out = [];
      for (let i = 0; i < pts.length; i++) {
        const [x, y] = pts[i];
        const a = i / Math.max(1, pts.length - 1);
        const nx = U.noise1(a * 3 + s, s) * rough, ny = U.noise1(a * 3 + s + 50, s + 1) * rough;
        out.push([x + nx, y + ny]);
      }
      if (o.overshoot !== false && out.length > 1) {
        const k = 4 + H(s, 9) * 6;
        const [a0, a1] = [out[0], out[1]], [b0, b1] = [out[out.length - 1], out[out.length - 2]];
        const d0 = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]) || 1, d1 = Math.hypot(b0[0] - b1[0], b0[1] - b1[1]) || 1;
        out.unshift([a0[0] - (a1[0] - a0[0]) / d0 * k * 0.4, a0[1] - (a1[1] - a0[1]) / d0 * k * 0.4]);
        out.push([b0[0] + (b0[0] - b1[0]) / d1 * k, b0[1] + (b0[1] - b1[1]) / d1 * k]);
      }
      return out;
    };
    const resample = (pts, step = 7) => {
      const out = [pts[0]];
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        const d = Math.hypot(x1 - x0, y1 - y0), k = Math.max(1, Math.ceil(d / step));
        for (let j = 1; j <= k; j++) out.push([x0 + (x1 - x0) * j / k, y0 + (y1 - y0) * j / k]);
      }
      return out;
    };
    const add = (pts, o = {}) => {
      const p = humanize(resample(pts), o);
      let len = 0; const cum = [0];
      for (let i = 1; i < p.length; i++) { len += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); cum.push(len); }
      items.push({ kind: 'stroke', pts: p, cum, len, w: o.w ?? 6, color: COL[o.color] || o.color || GRAPHITE, alpha: o.alpha ?? 0.9, ghost: o.ghost ?? true, speed: o.speed ?? 1 });
      return api;
    };
    const api = {
      items,
      line(x1, y1, x2, y2, o) { return add([[x1, y1], [x2, y2]], o); },
      path(pts, o) { return add(pts, o); },
      // smooth curve through points (Catmull-Rom)
      curve(pts, o = {}) {
        const out = [];
        const P = [pts[0], ...pts, pts[pts.length - 1]];
        for (let i = 1; i < P.length - 2; i++) for (let t = 0; t < 1; t += 0.1) {
          const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]], t2 = t * t, t3 = t2 * t;
          out.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
        }
        out.push(pts[pts.length - 1]);
        return add(out, o);
      },
      ellipse(cx, cy, rx, ry, o = {}) {
        const a0 = o.a0 ?? (-2.2 + H(seed, n) * 0.6), sweep = o.sweep ?? (Math.PI * 2 + 0.18), rot = o.rot || 0, lump = o.lump || 0, lumps = o.lumps || 5;
        const pts = [];
        for (let i = 0; i <= 64; i++) {
          const a = a0 + sweep * i / 64, r = 1 + lump * Math.sin(a * lumps);
          const x = Math.cos(a) * rx * r, y = Math.sin(a) * ry * r;
          pts.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
        }
        return add(pts, { overshoot: false, ...o });
      },
      circle(cx, cy, r, o) { return api.ellipse(cx, cy, r, r, o); },
      rect(x, y, w, h, o) { api.line(x, y, x + w, y, o); api.line(x + w, y, x + w, y + h, o); api.line(x + w, y + h, x, y + h, o); api.line(x, y + h, x, y, o); return api; },
      // parallel hatching clipped to a polygon (shading or a coloured-pencil wash)
      hatch(poly, o = {}) {
        const ang = o.angle ?? -0.8, gap = o.gap ?? 14, ca = Math.cos(ang), sa = Math.sin(ang);
        // rotate the polygon so hatch lines become horizontal
        const R = poly.map(([x, y]) => [x * ca + y * sa, -x * sa + y * ca]);
        const ys = R.map((p) => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys);
        let k = 0;
        for (let y = y0 + gap * 0.5; y < y1; y += gap) {
          const xs = [];
          for (let i = 0; i < R.length; i++) {
            const [ax, ay] = R[i], [bx, by] = R[(i + 1) % R.length];
            if ((ay <= y && by > y) || (by <= y && ay > y)) xs.push(ax + (y - ay) / (by - ay) * (bx - ax));
          }
          xs.sort((a, b) => a - b);
          for (let j = 0; j + 1 < xs.length; j += 2) {
            const flip = (k++ % 2) && o.zigzag !== false;
            let a = [xs[j] + 3, y], b = [xs[j + 1] - 3, y];
            if (flip) [a, b] = [b, a];
            const back = (p) => [p[0] * ca - p[1] * sa, p[0] * sa + p[1] * ca];
            add([back(a), back(b)], { w: o.w ?? 3, color: o.color || GRAPHITE, alpha: o.alpha ?? 0.55, rough: 1.2, ghost: false, speed: o.speed ?? 2.6 });
          }
        }
        return api;
      },
      // marker colour fill, wiped on left-to-right with streaks (drawn in sketch order)
      fill(poly, o = {}) {
        const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
        const bb = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
        items.push({ kind: 'fill', poly, bb, color: COL[o.color] || o.color || '#ccc', alpha: o.alpha ?? 0.9, len: (bb[2] - bb[0] + bb[3] - bb[1]) * 0.5, speed: o.speed ?? 2.2, angle: o.angle ?? 0.5 });
        return api;
      },
      // a word that slams on (no writing), e.g. sound effects
      stamp(str, x, y, o = {}) {
        const size = o.size || 90;
        items.push({ kind: 'stamp', str, x, y, size, font: o.font || `400 ${size}px "Permanent Marker", "Noto Color Emoji", sans-serif`, color: COL[o.color] || o.color || '#d2453a', rot: o.rot || 0,
          outline: o.outline ?? '#fff', len: 160, speed: 1, alpha: 1 });
        return api;
      },
      text(str, x, y, o = {}) {
        const size = o.size || 72;
        items.push({ kind: 'text', str, x, y, size, font: o.font || `700 ${size}px "Caveat", "Noto Color Emoji", sans-serif`, color: COL[o.color] || o.color || GRAPHITE,
          align: o.align || 'center', rot: o.rot || 0, len: str.length * size * 0.42, speed: o.speed ?? 1.6, alpha: o.alpha ?? 0.95 });
        return api;
      },
    };
    return api;
  }

  // ellipse polygon helper for hatch regions
  const ellPoly = (cx, cy, rx, ry, a0 = 0, a1 = Math.PI * 2, n = 40) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return p; };

  // ---------- drawing ----------
  function strokePrefix(ctx, it, upto) {
    const { pts, cum } = it;
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    let last = pts[0];
    for (let i = 1; i < pts.length; i++) {
      if (cum[i] <= upto) { ctx.lineTo(pts[i][0], pts[i][1]); last = pts[i]; continue; }
      const f = (upto - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]);
      last = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
      ctx.lineTo(last[0], last[1]); break;
    }
    return last;
  }
  // draw a sketch up to progress p (0..1). Returns the pencil tip position (or null when finished).
  function render(ctx, sk, p, mul = 1) {
    const items = sk.items;
    if (!sk.total) sk.total = items.reduce((s, it) => s + it.len / it.speed, 0);
    let budget = clamp(p) * sk.total, tip = null;
    const us = items.map((it) => { const cost = it.len / it.speed, u = budget > 0 ? clamp(budget / cost) : 0; budget -= cost; return u; });
    // colour fills sit under the ink: draw them first, then lines, words and stamps (in sketch order)
    const order = items.map((it, i) => i).sort((a, b) => (items[a].kind === 'fill' ? 0 : 1) - (items[b].kind === 'fill' ? 0 : 1) || a - b);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const idx of order) {
      const it = items[idx], u = us[idx];
      if (u <= 0) continue;
      if (it.kind === 'stroke') {
        ctx.globalAlpha = it.alpha * mul; ctx.strokeStyle = it.color; ctx.lineWidth = it.w;
        const end = strokePrefix(ctx, it, it.len * u); ctx.stroke();
        if (it.ghost) { // a lighter second pass, slightly offset: the hand going over the line again
          ctx.save(); ctx.translate(1.2, 0.9); ctx.globalAlpha = it.alpha * 0.35 * mul; ctx.lineWidth = it.w * 0.5; strokePrefix(ctx, it, it.len * u); ctx.stroke(); ctx.restore();
        }
        if (u < 1) tip = end;
      } else if (it.kind === 'fill') {
        const [x0, y0, x1, y1] = it.bb;
        ctx.save(); ctx.beginPath(); it.poly.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.clip();
        ctx.beginPath(); ctx.rect(x0 - 20, y0 - 20, (x1 - x0 + 40) * u, y1 - y0 + 40); ctx.clip();
        ctx.globalAlpha = it.alpha * mul; ctx.fillStyle = it.color; ctx.fillRect(x0 - 20, y0 - 20, x1 - x0 + 40, y1 - y0 + 40);
        // marker streaks
        ctx.globalAlpha = 0.18 * mul; ctx.strokeStyle = '#000'; ctx.lineWidth = 3;
        for (let k = -40; k < (x1 - x0) + (y1 - y0) + 40; k += 22) { ctx.beginPath(); ctx.moveTo(x0 + k, y0 - 10); ctx.lineTo(x0 + k - (y1 - y0 + 20) * it.angle, y1 + 10); ctx.stroke(); }
        ctx.restore();
        if (u < 1) tip = [x0 + (x1 - x0) * u, (y0 + y1) / 2 + Math.sin(u * 40) * (y1 - y0) * 0.35];
      } else if (it.kind === 'stamp') {
        const k = u < 1 ? 1.6 - 0.6 * u : 1;
        ctx.save(); ctx.globalAlpha = mul * Math.min(1, u * 3); ctx.translate(it.x, it.y); ctx.rotate(it.rot); ctx.scale(k, k);
        ctx.font = it.font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
        if (it.outline) { ctx.lineWidth = it.size * 0.16; ctx.strokeStyle = it.outline; ctx.strokeText(it.str, 0, 0); }
        ctx.lineWidth = it.size * 0.05; ctx.strokeStyle = '#232328'; ctx.strokeText(it.str, 0, 0);
        ctx.fillStyle = it.color; ctx.fillText(it.str, 0, 0); ctx.restore();
      } else {
        ctx.save(); ctx.globalAlpha = it.alpha * mul; ctx.font = it.font; ctx.textAlign = it.align; ctx.textBaseline = 'middle';
        ctx.translate(it.x, it.y); ctx.rotate(it.rot);
        const w = ctx.measureText(it.str).width, x0 = it.align === 'center' ? -w / 2 : it.align === 'right' ? -w : 0;
        ctx.beginPath(); ctx.rect(x0 - 10, -it.size, (w + 20) * u, it.size * 2); ctx.clip();
        ctx.fillStyle = it.color; ctx.fillText(it.str, 0, 0);
        ctx.restore();
        if (u < 1) tip = [it.x + (x0 + w * u) * Math.cos(it.rot), it.y + it.size * 0.25 + (x0 + w * u) * Math.sin(it.rot)];
      }
    }
    ctx.restore();
    return tip;
  }

  // ---------- the pencil and the eraser ----------
  function pencil(ctx, x, y, t, lift = 0) {
    ctx.save(); ctx.translate(x + lift * 60, y - lift * 90); ctx.rotate(-0.95 + Math.sin(t * 7) * 0.03);
    ctx.fillStyle = 'rgba(0,0,0,0.14)'; ctx.beginPath(); ctx.ellipse(40, 18, 200, 14, 0, 0, Math.PI * 2); ctx.fill();
    // tip and sharpened wood
    ctx.fillStyle = '#2b2b30'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(16, -5); ctx.lineTo(16, 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e8c79a'; ctx.beginPath(); ctx.moveTo(16, -5); ctx.lineTo(52, -15); ctx.lineTo(52, 15); ctx.lineTo(16, 5); ctx.closePath(); ctx.fill();
    // painted body with three facets
    ctx.fillStyle = '#f2b62a'; ctx.fillRect(52, -15, 230, 30);
    ctx.fillStyle = '#ffd25a'; ctx.fillRect(52, -15, 230, 9);
    ctx.fillStyle = '#d99a17'; ctx.fillRect(52, 7, 230, 8);
    // ferrule and eraser end
    ctx.fillStyle = '#b9bcc2'; ctx.fillRect(282, -16, 30, 32); ctx.strokeStyle = '#8d9096'; ctx.lineWidth = 2; for (const k of [290, 298, 306]) { ctx.beginPath(); ctx.moveTo(k, -16); ctx.lineTo(k, 16); ctx.stroke(); }
    ctx.fillStyle = '#ef8fa0'; ctx.beginPath(); ctx.roundRect(312, -15, 30, 30, [0, 9, 9, 0]); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 2; ctx.strokeRect(52, -15, 230, 30);
    ctx.restore();
  }
  function eraserSprite(ctx, x, y, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.35 + Math.sin(t * 40) * 0.05);
    ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.beginPath(); ctx.roundRect(-78, -30, 170, 76, 14); ctx.fill();
    ctx.fillStyle = '#f3a0ae'; ctx.beginPath(); ctx.roundRect(-90, -42, 170, 76, 14); ctx.fill();
    ctx.fillStyle = '#2f6fbf'; ctx.fillRect(-30, -44, 112, 80); // paper sleeve
    ctx.fillStyle = '#ffffff'; ctx.fillRect(-30, -12, 112, 14);
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 2; ctx.strokeRect(-30, -44, 112, 80);
    ctx.restore();
  }
  // zig-zag rubbing path over the drawing area; returns points
  function eraserPath(box, rows = 7) {
    const [x0, y0, x1, y1] = box, pts = [];
    for (let r = 0; r <= rows; r++) { const y = y0 + (y1 - y0) * r / rows; pts.push(r % 2 ? [x1, y] : [x0, y]); }
    return pts;
  }
  function pathAt(pts, u) {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    let rem = clamp(u) * L; const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      if (rem >= seg[i - 1]) { out.push(pts[i]); rem -= seg[i - 1]; continue; }
      const f = rem / seg[i - 1]; out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f]); break;
    }
    return out;
  }

  // when each stamp / the end of each sketch happens, as fractions of the drawing time (song.js uses this for SFX)
  function cues(sk) {
    const tot = sk.items.reduce((s, it) => s + it.len / it.speed, 0); let c = 0; const out = [];
    for (const it of sk.items) { if (it.kind === 'stamp') out.push({ kind: 'stamp', f: c / tot }); c += it.len / it.speed; }
    return out;
  }
  globalThis.Sketch = { pen, render, pencil, eraserSprite, eraserPath, pathAt, ellPoly, COL, cues };
})();
