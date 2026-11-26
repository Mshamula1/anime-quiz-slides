// Devil Fruit Files #4: Gura Gura no Mi. One sketch per narration line (same order as gura_gura.json).
// Original drawings: an original pale fruit (colour nod only, no official pattern), generic objects, no characters.
(function () {
  const { pen, ellPoly } = globalThis.Sketch;
  const lumpPoly = (cx, cy, rx, ry, lump = 0.05, lumps = 6, rot = 0.3) => { const p = []; for (let i = 0; i <= 72; i++) { const a = rot + i / 72 * Math.PI * 2, r = 1 + lump * Math.sin(a * lumps); p.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } return p; };
  const starPoly = (cx, cy, r, n = 5, k = 0.45, rot = -Math.PI / 2) => { const p = []; for (let i = 0; i <= n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? r * k : r; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return p; };
  function sparkle(P, x, y, r, color = 'gold') { const s = starPoly(x, y, r, 4, 0.3, 0); P.fill(s, { color, alpha: 0.95, speed: 6 }); P.path(s, { w: 3.5, overshoot: false, speed: 3 }); }
  function rays(P, cx, cy, r0, r1, n, color = 'gold', a0 = 0, a1 = Math.PI * 2) { for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * (i + 0.5) / n, rr = r1 * (i % 2 ? 0.85 : 1); P.line(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, { w: 7, color, speed: 3 }); } }
  // jagged crack lines radiating from a point
  function cracks(P, cx, cy, r, n = 8, seed = 1, o = {}) {
    for (let i = 0; i < n; i++) {
      const a = (i + 0.3 * Math.sin(i * 7 + seed)) / n * Math.PI * 2, pts = [[cx, cy]];
      for (let j = 1; j <= 4; j++) { const rr = r * j / 4, jit = (j % 2 ? 0.18 : -0.18) * Math.cos(i + seed); pts.push([cx + Math.cos(a + jit) * rr, cy + Math.sin(a + jit) * rr]); }
      P.path(pts, { w: o.w ?? 5, color: o.color || 'graphite', overshoot: false, speed: 3 });
    }
    for (const rr of [r * 0.35, r * 0.7]) { const ring = []; for (let i = 0; i <= n; i++) { const a = (i + 0.3 * Math.sin(i * 7 + seed)) / n * Math.PI * 2; ring.push([cx + Math.cos(a) * rr * (1 + 0.06 * Math.sin(i * 3)), cy + Math.sin(a) * rr]); } P.path(ring, { w: (o.w ?? 5) * 0.7, color: o.color || 'graphite', overshoot: false, speed: 3 }); }
  }
  function arcWave(P, cx, cy, r, o) { P.ellipse(cx, cy, r, r * 0.55, { a0: -0.7, sweep: 1.4, ...o }); P.ellipse(cx, cy, r, r * 0.55, { a0: Math.PI - 0.7, sweep: 1.4, ...o }); }
  // the original pale fruit: round lumpy body, cool blue-grey shade, cream light, curly stem, leaf
  function fruit(P, cx, cy, r, { sparkles = true } = {}) {
    const body = lumpPoly(cx, cy, r, r * 0.94, 0.045, 8);
    P.path(body, { w: 7, overshoot: false });
    P.curve([[cx - 4, cy - r * 0.88], [cx - 14, cy - r * 1.12], [cx + r * 0.05, cy - r * 1.3], [cx + r * 0.28, cy - r * 1.24]], { w: 8, color: 'brown' });
    const leaf = [[cx - 10, cy - r * 1.0], [cx - r * 0.4, cy - r * 1.35], [cx - r * 0.85, cy - r * 1.22], [cx - r * 0.62, cy - r * 1.0], [cx - 10, cy - r * 1.0]];
    P.curve(leaf, { w: 5.5 });
    P.fill(body, { color: '#f4f1e6', alpha: 0.98 });
    P.fill(ellPoly(cx + r * 0.25, cy + r * 0.3, r * 0.62, r * 0.5, -0.4, 2.2), { color: '#a9bfd6', alpha: 0.6 });
    P.fill(ellPoly(cx - r * 0.3, cy - r * 0.3, r * 0.42, r * 0.3), { color: 'cream', alpha: 0.9 });
    P.hatch(ellPoly(cx + r * 0.35, cy + r * 0.35, r * 0.45, r * 0.35), { gap: 16, color: '#6f86a3', alpha: 0.4 });
    P.fill(leaf.slice(0, 4), { color: 'green', alpha: 0.9 });
    P.line(cx - 14, cy - r * 1.02, cx - r * 0.62, cy - r * 1.17, { w: 3, alpha: 0.7 });
    for (const [dx, dy, s] of [[-0.45, -0.45, 0.07], [-0.3, -0.56, 0.045]]) P.fill(ellPoly(cx + dx * r, cy + dy * r, s * r, s * r * 0.8), { color: 'white', alpha: 0.95, speed: 6 });
    P.fill(ellPoly(cx + r * 0.1, cy + r * 1.04, r * 0.85, r * 0.13), { color: 'rgba(40,50,70,0.22)', alpha: 1, speed: 6 });
    if (sparkles) { sparkle(P, cx - r * 1.15, cy - r * 0.6, 26, 'sky'); sparkle(P, cx + r * 1.2, cy - r * 0.2, 20); }
  }
  function sea(P, y0, x0 = 70, x1 = 950, color = 'sky') {
    const s = []; for (let i = 0; i <= 17; i++) s.push([x0 + i * (x1 - x0) / 17, y0 + Math.sin(i * 1.3) * 14]);
    P.curve(s, { w: 6, color: 'navy' }); P.fill([...s, [x1, 1245], [x0, 1245]], { color, alpha: 0.85 });
  }
  function ship(P, x, y, s = 1) {
    const h = [[x - 100 * s, y], [x + 100 * s, y], [x + 70 * s, y + 45 * s], [x - 70 * s, y + 45 * s]];
    P.path([...h, h[0]], { w: 5.5, overshoot: false }); P.fill(h, { color: 'brown' });
    P.line(x, y, x, y - 120 * s, { w: 5 }); const sl = [[x + 4, y - 115 * s], [x + 70 * s, y - 60 * s], [x + 4, y - 20 * s]];
    P.fill(sl, { color: 'white' }); P.path(sl, { w: 4, overshoot: false });
  }

  const cl = (v) => Math.max(0, Math.min(1, v));
  const eio = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2), ein = (u) => u * u * u, eout = (u) => 1 - Math.pow(1 - u, 3);
  const shake = (k, a = 6) => ({ x: Math.sin(k * 41) * a, y: Math.cos(k * 37) * a * 0.7 });
  const S = [];

  // 0 intro: the fruit + its name, cracks in the air around it
  S.push({ draw: () => {
    const P = pen(41);
    P.text('Gura Gura no Mi', 500, 390, { size: 112, speed: 3 });
    P.group('cr'); cracks(P, 220, 640, 110, 7, 2, { color: '#6f86a3' }); cracks(P, 800, 980, 120, 7, 5, { color: '#6f86a3' });
    P.group('fruit'); fruit(P, 500, 790, 200);
    P.group(null); P.stamp('TREMOR-TREMOR!', 500, 1160, { size: 66, color: 'blue', rot: -0.04 });
    return P;
  }, anim: (g, k) => g === 'fruit' ? { ox: 500, oy: 790, ...shake(k, 5), rot: Math.sin(k * 2.2) * 0.04 } : g === 'cr' ? { ox: 500, oy: 800, s: 1 + 0.04 * Math.sin(k * 8) } : null, sfx: [{ f: 0.0, kind: 'swell' }, { f: 0.3, kind: 'thud' }] });

  // 1 strongest paramecia: the fruit on the top step of a podium
  S.push({ draw: () => {
    const P = pen(42);
    const step = (x, y, w, h, c, n) => { const r = [[x, y], [x + w, y], [x + w, 1180], [x, 1180]]; P.path([...r, r[0]], { w: 6, overshoot: false }); P.fill(r, { color: c }); P.stamp(n, x + w / 2, y + 90, { size: 90, color: 'white', outline: '#333' }); };
    step(150, 960, 230, 0, '#c9ced8', '2'); step(620, 1020, 230, 0, '#d9a066', '3'); step(385, 860, 240, 0, 'gold', '1');
    P.line(110, 1180, 900, 1180, { w: 7 });
    P.group('rays'); rays(P, 505, 700, 150, 230, 16, 'gold');
    P.group('fruit'); fruit(P, 505, 720, 110, { sparkles: false });
    P.group(null); P.stamp('No.1 PARAMECIA', 500, 440, { size: 88, color: 'red', rot: -0.04 });
    sparkle(P, 230, 620, 26); sparkle(P, 790, 600, 30);
    return P;
  }, anim: (g, k) => g === 'fruit' ? { ox: 505, oy: 720, y: Math.sin(k * 3) * 14, rot: Math.sin(k * 2) * 0.05 } : g === 'rays' ? { ox: 505, oy: 700, rot: k * 0.5 } : null, sfx: [{ f: 0.05, kind: 'swell' }] });

  // 2 strongest man in the world: a huge polearm planted in a cliff, a cape blowing, a world globe
  S.push({ draw: () => {
    const P = pen(43);
    P.group('globe'); P.fill(ellPoly(760, 560, 150, 150), { color: 'sky' }); P.circle(760, 560, 150, { w: 6 });
    P.fill(lumpPoly(720, 520, 60, 45, 0.2, 5), { color: 'green' }); P.fill(lumpPoly(820, 620, 45, 35, 0.2, 4), { color: 'green' });
    P.ellipse(760, 560, 150, 50, { w: 3, alpha: 0.5 }); P.ellipse(760, 560, 60, 150, { w: 3, alpha: 0.5 });
    P.group(null);
    const cliff = [[90, 1200], [160, 980], [300, 930], [470, 960], [560, 1200]]; P.curve(cliff, { w: 7 }); P.fill([...cliff, [90, 1200]], { color: '#b89870' });
    P.hatch([[140, 1190], [200, 1020], [450, 1000], [520, 1190]], { gap: 18, alpha: 0.35 });
    P.line(320, 960, 330, 520, { w: 12, color: 'brown' });
    P.group('blade'); const b = [[330, 530], [300, 460], [340, 360], [395, 430], [360, 530]]; P.fill(b, { color: '#d9dde6' }); P.path([...b, b[0]], { w: 6, overshoot: false }); P.line(318, 540, 372, 540, { w: 10, color: 'gold' });
    P.group('cape'); const cape = [[330, 580], [470, 560], [560, 620], [600, 750], [520, 730], [480, 820], [410, 760], [340, 820]]; P.fill(cape, { color: 'white' }); P.path([...cape, cape[0]], { w: 6, overshoot: false }); P.hatch(cape, { gap: 22, alpha: 0.25 });
    P.group(null); P.stamp('STRONGEST', 700, 900, { size: 92, color: 'red', rot: -0.05 }); P.stamp('MAN IN THE WORLD', 700, 1010, { size: 58, color: 'navy', rot: -0.03 });
    sparkle(P, 440, 400, 26);
    return P;
  }, anim: (g, k) => g === 'cape' ? { ox: 335, oy: 580, sx: 1 + 0.06 * Math.sin(k * 4), rot: Math.sin(k * 3) * 0.05 } : g === 'globe' ? { ox: 760, oy: 560, rot: k * 0.3 } : g === 'blade' ? { ox: 340, oy: 440, s: 1 + 0.04 * Math.sin(k * 6) } : null, sfx: [{ f: 0.05, kind: 'whoosh' }] });

  // 3 cracks the air like glass: a fist hits an invisible pane, cracks spread
  S.push({ draw: () => {
    const P = pen(44);
    P.fill([[200, 420], [820, 420], [820, 1140], [200, 1140]], { color: 'rgba(160,200,240,0.28)', speed: 4 });
    P.path([[200, 420], [820, 420], [820, 1140], [200, 1140], [200, 420]], { w: 4, color: '#7aa0c8', overshoot: false });
    P.line(250, 480, 350, 440, { w: 6, color: 'white' }); P.line(250, 520, 400, 460, { w: 4, color: 'white' });
    P.group('_cr'); cracks(P, 510, 780, 300, 10, 3, { w: 6 }); P.stamp('CRACK!', 640, 520, { size: 110, color: 'red', rot: 0.06 });
    P.group('fist'); const f = [[0, -70], [90, -80], [130, -40], [130, 40], [90, 80], [0, 70], [-40, 40], [-40, -40]].map(([x, y]) => [510 + x - 400, 780 + y]);
    P.fill(f, { color: '#f2c39b' }); P.path([...f, f[0]], { w: 6, overshoot: false });
    for (let i = 0; i < 4; i++) P.line(110 + 90, 780 - 60 + i * 40, 110 + 130, 780 - 60 + i * 40, { w: 4 });
    P.line(110 + 40, 780 - 30, 110 + 70, 780 - 50, { w: 4 }); P.curve([[110 + 100, 780 + 30], [110 + 60, 780 + 45], [110 + 20, 780 + 30]], { w: 4 });
    P.group(null);
    return P;
  }, anim: (g, k, D) => { const u = eio(cl(k / (D * 0.35))); if (g === 'fist') return { x: 270 * u, ...(u >= 1 ? shake(k, 3) : { y: 0 }) }; if (g === '_cr') { const v = cl((k - D * 0.35) / (D * 0.12)); return { ox: 510, oy: 780, s: 0.3 + 0.7 * v, alpha: v }; } return null; }, sfx: [{ f: 0.35, kind: 'thud' }] });

  // 4 cracks become shockwaves, shockwaves become earthquakes: rings over a shaking town
  S.push({ draw: () => {
    const P = pen(45);
    P.group('rings'); for (const r of [90, 170, 250, 330]) arcWave(P, 500, 560, r, { w: 7, color: 'blue' });
    cracks(P, 500, 560, 60, 6, 4, { w: 5 });
    P.group(null); P.line(80, 1000, 940, 1000, { w: 7 }); P.fill([[80, 1000], [940, 1000], [940, 1240], [80, 1240]], { color: '#c9a77a', alpha: 0.8 });
    P.group('fis'); P.path([[500, 1000], [470, 1060], [520, 1110], [480, 1180], [510, 1240]], { w: 9, overshoot: false }); P.path([[480, 1060], [400, 1100], [340, 1090]], { w: 6, overshoot: false }); P.path([[515, 1110], [600, 1150], [680, 1140]], { w: 6, overshoot: false });
    P.group('town'); for (const [x, h, c] of [[140, 150, 'cream'], [280, 200, '#f6c9a6'], [650, 180, 'cream'], [800, 140, '#f6c9a6']]) { const hs = [[x, 1000], [x, 1000 - h], [x + 50, 1000 - h - 60], [x + 100, 1000 - h], [x + 100, 1000]]; P.fill(hs, { color: c }); P.path([...hs, hs[0]], { w: 5, overshoot: false }); P.fill([[x + 30, 1000 - h + 30], [x + 70, 1000 - h + 30], [x + 70, 1000 - h + 70], [x + 30, 1000 - h + 70]], { color: 'sky' }); }
    P.group(null); P.stamp('QUAKE!', 500, 1150, { size: 100, color: 'red', rot: -0.05 });
    return P;
  }, anim: (g, k) => g === 'rings' ? { ox: 500, oy: 560, s: 0.85 + 0.15 * ((k * 0.8) % 1) } : g === 'town' ? { ...shake(k, 7), rot: Math.sin(k * 30) * 0.01 } : g === 'fis' ? shake(k, 3) : null, sfx: [{ f: 0.1, kind: 'thud' }, { f: 0.5, kind: 'thud' }] });

  // 5 hit the sea floor: a quake under the water becomes a towering wave
  S.push({ draw: () => {
    const P = pen(46);
    P.fill([[70, 340], [950, 340], [950, 820], [70, 820]], { color: 'rgba(255,214,150,0.35)', speed: 4 });
    sea(P, 820);
    P.line(70, 1180, 950, 1180, { w: 6 }); P.fill([[70, 1180], [950, 1180], [950, 1245], [70, 1245]], { color: '#b08a5a' });
    P.group('quake'); cracks(P, 300, 1180, 70, 5, 8, { w: 5, color: 'red' }); for (const r of [60, 110]) P.ellipse(300, 1180, r, r * 0.5, { a0: Math.PI, sweep: Math.PI, w: 5, color: 'red' });
    P.group('wave'); const wv = [[420, 1180], [440, 900], [520, 620], [650, 470], [800, 450], [890, 520], [840, 560], [770, 530], [730, 600], [760, 820], [900, 1180]];
    P.fill(wv, { color: 'blue', alpha: 0.85 }); P.curve(wv, { w: 7, color: 'navy' }); P.curve([[650, 470], [800, 450], [890, 520]], { w: 10, color: 'white' });
    P.group('ship'); ship(P, 220, 790, 0.8);
    P.group(null); P.stamp('TSUNAMI!', 280, 470, { size: 100, color: 'red', rot: -0.06 });
    return P;
  }, anim: (g, k, D) => { const u = eio(cl(k / (D * 0.8))); if (g === 'wave') return { ox: 660, oy: 1180, s: 0.55 + 0.45 * u, x: -60 * u }; if (g === 'quake') return { ox: 300, oy: 1180, s: 1 + 0.12 * Math.sin(k * 12) }; if (g === 'ship') return { ox: 220, oy: 810, rot: Math.sin(k * 3) * 0.12, y: Math.sin(k * 3) * 10 }; return null; }, sfx: [{ f: 0.05, kind: 'thud' }, { f: 0.3, kind: 'swell' }] });

  // 6 marineford tilted: a whole fortress island and its sea tilt
  S.push({ draw: () => {
    const P = pen(47);
    P.group('isl');
    const sw = []; for (let i = 0; i <= 14; i++) sw.push([90 + i * 60, 1000 + Math.sin(i * 1.4) * 12]); P.curve(sw, { w: 6, color: 'navy' }); P.fill([...sw, [930, 1180], [90, 1180]], { color: 'sky' });
    const land = [[250, 1000], [290, 900], [710, 900], [750, 1000]]; P.fill(land, { color: '#c9a77a' }); P.path([...land, land[0]], { w: 6, overshoot: false });
    const fort = [[340, 900], [340, 700], [400, 700], [400, 650], [600, 650], [600, 700], [660, 700], [660, 900]]; P.fill(fort, { color: '#e8e4dc' }); P.path([...fort, fort[0]], { w: 6, overshoot: false });
    for (let i = 0; i < 5; i++) P.fill([[360 + i * 60, 760], [390 + i * 60, 760], [390 + i * 60, 800], [360 + i * 60, 800]], { color: 'navy', alpha: 0.8 });
    P.line(500, 650, 500, 540, { w: 5 }); P.fill([[503, 545], [580, 565], [503, 590]], { color: 'blue' });
    ship(P, 180, 990, 0.6); ship(P, 820, 990, 0.6);
    P.group(null); P.stamp('TILTED!', 500, 460, { size: 110, color: 'red', rot: -0.08 });
    P.curve([[150, 560], [110, 650], [150, 740]], { w: 7, color: 'orange' }); P.curve([[850, 560], [890, 650], [850, 740]], { w: 7, color: 'orange' });
    return P;
  }, anim: (g, k, D) => g === 'isl' ? { ox: 500, oy: 950, rot: -0.2 * eio(cl((k - D * 0.15) / (D * 0.5))), ...shake(k, 4) } : null, sfx: [{ f: 0.15, kind: 'thud' }] });

  // 7 died standing, nothing on his back: a tattered coat on a polearm, slashes on the front only
  S.push({ draw: () => {
    const P = pen(48);
    P.line(90, 1150, 930, 1150, { w: 7 }); P.fill([[90, 1150], [930, 1150], [930, 1240], [90, 1240]], { color: '#b89870', alpha: 0.7 });
    P.line(500, 1150, 500, 430, { w: 12, color: 'brown' });
    P.group('coat'); const coat = [[360, 520], [640, 520], [700, 1000], [600, 960], [560, 1040], [500, 980], [440, 1040], [400, 960], [300, 1000]];
    P.fill(coat, { color: 'white' }); P.path([...coat, coat[0]], { w: 6, overshoot: false }); P.line(360, 520, 640, 520, { w: 10, color: 'navy' });
    for (const [x, y, a] of [[420, 640, 0.6], [560, 700, -0.5], [470, 820, 0.4], [600, 860, 0.7], [430, 920, -0.6]]) P.line(x - 40 * Math.cos(a), y - 40 * Math.sin(a), x + 40 * Math.cos(a), y + 40 * Math.sin(a), { w: 6, color: 'red' });
    P.group(null); P.stamp('NEVER RAN', 500, 400, { size: 100, color: 'navy', rot: -0.04 });
    P.stamp('NO SCAR ON THE BACK', 500, 1205, { size: 48, color: 'red', rot: 0.0 });
    sparkle(P, 230, 700, 28); sparkle(P, 790, 640, 24);
    return P;
  }, anim: (g, k) => g === 'coat' ? { ox: 500, oy: 520, sx: 1 + 0.04 * Math.sin(k * 3.5), rot: Math.sin(k * 2.5) * 0.03 } : null, sfx: [{ f: 0.05, kind: 'swell' }] });

  // 8 "The One Piece is real!": a glowing treasure chest opens
  S.push({ draw: () => {
    const P = pen(49);
    P.group('rays'); rays(P, 500, 860, 180, 330, 18, 'gold');
    P.group(null);
    const box = [[330, 860], [670, 860], [670, 1080], [330, 1080]]; P.fill(box, { color: 'brown' }); P.path([...box, box[0]], { w: 7, overshoot: false });
    P.line(330, 940, 670, 940, { w: 10, color: 'gold' }); P.fill([[480, 900], [520, 900], [520, 960], [480, 960]], { color: 'gold' });
    P.fill(ellPoly(500, 860, 160, 30), { color: 'gold' });
    for (const [x, y] of [[420, 850], [500, 840], [580, 852], [460, 830]]) { P.fill(ellPoly(x, y, 26, 26), { color: 'gold' }); P.circle(x, y, 26, { w: 4 }); }
    P.group('lid'); const lid = [[330, 860], [330, 780], [400, 740], [600, 740], [670, 780], [670, 860]]; P.fill(lid, { color: '#b06e36' }); P.path([...lid, lid[0]], { w: 7, overshoot: false }); P.line(330, 820, 670, 820, { w: 8, color: 'gold' });
    P.group(null); P.stamp('"IT\'S REAL!"', 500, 480, { size: 120, color: 'red', rot: -0.05 });
    sparkle(P, 230, 760, 30); sparkle(P, 780, 700, 34); sparkle(P, 760, 1120, 22);
    return P;
  }, anim: (g, k, D) => g === 'lid' ? { ox: 330, oy: 860, rot: -0.9 * eout(cl((k - D * 0.1) / (D * 0.35))) } : g === 'rays' ? { ox: 500, oy: 860, rot: k * 0.4, s: 0.8 + 0.2 * eout(cl(k / (D * 0.5))) } : null, sfx: [{ f: 0.1, kind: 'clink' }, { f: 0.2, kind: 'swell' }] });

  // 9 taken by unknown means: a dark vortex pulls in the quake glow, question marks around
  S.push({ draw: () => {
    const P = pen(50);
    P.group('vortex'); const sw = []; for (let i = 0; i <= 80; i++) { const a = i / 80 * Math.PI * 6, r = 10 + i * 2.6; sw.push([600 + Math.cos(a) * r, 760 + Math.sin(a) * r * 0.8]); }
    P.fill(ellPoly(600, 760, 220, 180), { color: '#2b2238', alpha: 0.9 }); P.curve(sw, { w: 9, color: 'purple' }); P.curve(sw, { w: 3, color: 'graphite' });
    P.group('fruit'); fruit(P, 240, 640, 80, { sparkles: false }); cracks(P, 240, 640, 130, 6, 9, { w: 4, color: '#6f86a3' });
    P.group('q'); P.stamp('?', 180, 1030, { size: 200, color: 'purple', rot: -0.15 }); P.stamp('?', 860, 470, { size: 150, color: 'purple', rot: 0.15 });
    P.group(null); P.stamp('TAKEN?!', 600, 1110, { size: 100, color: 'red', rot: -0.05 });
    return P;
  }, anim: (g, k, D) => { const u = ein(cl((k - D * 0.25) / (D * 0.6))); if (g === 'vortex') return { ox: 600, oy: 760, rot: -k * 1.6 }; if (g === 'fruit') return { ox: 240, oy: 640, x: 360 * u, y: 120 * u, s: Math.max(0.02, 1 - u), rot: u * 4, alpha: 1 - cl((u - 0.85) / 0.15) }; if (g === 'q') return { y: Math.sin(k * 4) * 10 }; return null; }, sfx: [{ f: 0.3, kind: 'whoosh' }] });

  // 10 two fruits in one person: a dark fruit + the pale fruit = 2
  S.push({ draw: () => {
    const P = pen(51);
    P.group('a'); const d = lumpPoly(250, 760, 130, 120, 0.06, 7); P.fill(d, { color: '#3a2a4d' }); P.path(d, { w: 7, overshoot: false }); P.fill(ellPoly(215, 720, 50, 35), { color: 'purple', alpha: 0.7 }); P.curve([[250, 645], [240, 610], [270, 590]], { w: 7, color: 'brown' });
    P.group(null); P.stamp('+', 445, 760, { size: 140, color: 'graphite' });
    P.group('b'); fruit(P, 650, 760, 120, { sparkles: false });
    P.group(null); P.stamp('= 2 POWERS', 500, 1010, { size: 100, color: 'red', rot: -0.04 }); P.stamp('ONLY ONE IN HISTORY', 500, 1130, { size: 60, color: 'navy', rot: 0.02 });
    P.text('???', 860, 560, { size: 70, color: 'purple' });
    sparkle(P, 880, 760, 26); sparkle(P, 120, 560, 22);
    return P;
  }, anim: (g, k) => g === 'a' ? { ox: 250, oy: 760, y: Math.sin(k * 3) * 14, rot: Math.sin(k * 2) * 0.06 } : g === 'b' ? { ox: 650, oy: 760, y: Math.sin(k * 3 + 1.5) * 14, ...shake(k, 2) } : null, sfx: [{ f: 0.05, kind: 'boing' }] });

  // 11 outro
  S.push({ draw: () => {
    const P = pen(52);
    P.group('fruit'); fruit(P, 360, 720, 170);
    P.group('q'); P.stamp('?', 770, 650, { size: 380, color: 'blue', rot: 0.12 });
    P.group(null);
    P.stamp('WHICH FRUIT NEXT?', 480, 1030, { size: 80, color: 'purple', rot: -0.03 });
    P.stamp('COMMENT!', 480, 1160, { size: 76, color: 'red', rot: 0.04 });
    return P;
  }, anim: (g, k) => g === 'fruit' ? { ox: 360, oy: 720, y: Math.sin(k * 3) * 14, rot: Math.sin(k * 2) * 0.06 } : g === 'q' ? { ox: 770, oy: 760, rot: Math.sin(k * 5) * 0.12 } : null, sfx: [] });

  globalThis.FRUIT_SCENES = S;
})();
