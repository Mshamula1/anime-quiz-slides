// Devil Fruit Files #1: Hito Hito no Mi, Model: Nika. One sketch per narration line (same order as hito_nika.json).
// Original drawings: an original purple fruit (colour nod only, no official pattern), generic objects, no characters.
(function () {
  const { pen, ellPoly } = globalThis.Sketch;
  const lumpPoly = (cx, cy, rx, ry, lump = 0.05, lumps = 6, rot = 0.3) => { const p = []; for (let i = 0; i <= 72; i++) { const a = rot + i / 72 * Math.PI * 2, r = 1 + lump * Math.sin(a * lumps); p.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } return p; };
  const starPoly = (cx, cy, r, n = 5, k = 0.45, rot = -Math.PI / 2) => { const p = []; for (let i = 0; i <= n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? r * k : r; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return p; };
  const burstPoly = (cx, cy, r, n = 12, k = 0.6, sx = 1.3) => { const p = []; for (let i = 0; i <= n * 2; i++) { const a = i * Math.PI / n, rr = i % 2 ? r * k : r; p.push([cx + Math.cos(a) * rr * sx, cy + Math.sin(a) * rr]); } return p; };

  function sparkle(P, x, y, r, color = 'gold') { const s = starPoly(x, y, r, 4, 0.3, 0); P.fill(s, { color, alpha: 0.95, speed: 6 }); P.path(s, { w: 3.5, overshoot: false, speed: 3 }); }
  function rays(P, cx, cy, r0, r1, n, color = 'gold', a0 = 0, a1 = Math.PI * 2) { for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * (i + 0.5) / n, rr = r1 * (i % 2 ? 0.85 : 1); P.line(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, { w: 7, color, speed: 3 }); } }
  function speedLines(P, x, y, n = 3, len = 140, color = 'graphite') { for (let i = 0; i < n; i++) P.line(x - len + i * 18, y - 30 + i * 30, x - 10, y - 30 + i * 30, { w: 5, color, speed: 3, alpha: 0.8 }); }

  // the original purple fruit: lumpy body, curly brown stem, green leaf, light + shade, glossy dots
  function fruit(P, cx, cy, r, { face = false, bite = false, sparkles = true } = {}) {
    const body = lumpPoly(cx, cy, r, r * 0.94, 0.045, 6);
    P.path(body, { w: 7, overshoot: false });
    P.curve([[cx - 4, cy - r * 0.88], [cx + 8, cy - r * 1.1], [cx + r * 0.2, cy - r * 1.25], [cx + r * 0.36, cy - r * 1.22]], { w: 8, color: 'brown' });
    const leaf = [[cx + 12, cy - r * 1.0], [cx + r * 0.38, cy - r * 1.32], [cx + r * 0.85, cy - r * 1.24], [cx + r * 0.66, cy - r * 1.02], [cx + 12, cy - r * 1.0]];
    P.curve(leaf, { w: 5.5 });
    P.fill(body, { color: 'purple', alpha: 0.92 });
    P.fill(ellPoly(cx - r * 0.3, cy - r * 0.32, r * 0.42, r * 0.3), { color: 'lilac', alpha: 0.9 });
    P.fill(ellPoly(cx + r * 0.25, cy + r * 0.3, r * 0.62, r * 0.5, -0.4, 2.2), { color: '#5a2c94', alpha: 0.55 });
    P.fill(leaf.slice(0, 4), { color: 'green', alpha: 0.9 });
    P.line(cx + 16, cy - r * 1.02, cx + r * 0.66, cy - r * 1.17, { w: 3, alpha: 0.7 });
    for (const [dx, dy, s] of [[-0.45, -0.45, 0.07], [-0.3, -0.55, 0.045], [-0.52, -0.25, 0.04]]) P.fill(ellPoly(cx + dx * r, cy + dy * r, s * r, s * r * 0.8), { color: 'white', alpha: 0.95, speed: 6 });
    if (bite) {
      P.fill(ellPoly(cx + r * 0.95, cy - r * 0.15, r * 0.3, r * 0.26), { color: 'cream', alpha: 1 });
      P.fill(ellPoly(cx + r * 0.95, cy + r * 0.3, r * 0.28, r * 0.24), { color: 'cream', alpha: 1 });
      P.ellipse(cx + r * 0.95, cy - r * 0.15, r * 0.3, r * 0.26, { a0: 1.8, sweep: 2.6, w: 5.5 });
      P.ellipse(cx + r * 0.95, cy + r * 0.3, r * 0.28, r * 0.24, { a0: 1.8, sweep: 2.6, w: 5.5 });
    }
    if (face) {
      for (const ex of [-0.3, 0.22]) { P.fill(ellPoly(cx + ex * r, cy - r * 0.1, r * 0.15, r * 0.2), { color: 'white', alpha: 1, speed: 5 }); P.ellipse(cx + ex * r, cy - r * 0.1, r * 0.15, r * 0.2, { w: 5 }); P.fill(ellPoly(cx + (ex + 0.07) * r, cy - r * 0.08, r * 0.07, r * 0.09), { color: 'graphite', alpha: 1, speed: 5 }); }
      P.line(cx - r * 0.45, cy - r * 0.38, cx - r * 0.15, cy - r * 0.3, { w: 6 }); P.line(cx + r * 0.08, cy - r * 0.3, cx + r * 0.38, cy - r * 0.4, { w: 6 });
      P.curve([[cx - r * 0.22, cy + r * 0.3], [cx + r * 0.05, cy + r * 0.38], [cx + r * 0.35, cy + r * 0.2]], { w: 6 });
    }
    P.fill(ellPoly(cx + r * 0.12, cy + r * 1.04, r * 0.85, r * 0.13), { color: 'rgba(40,30,60,0.25)', alpha: 1, speed: 6 });
    if (sparkles) { sparkle(P, cx - r * 1.15, cy - r * 0.7, 26); sparkle(P, cx + r * 1.2, cy - r * 0.1, 20); sparkle(P, cx - r * 0.9, cy + r * 0.85, 16); }
  }
  function arrow(P, pts, o = {}) {
    P.curve(pts, o);
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    P.line(b[0], b[1], b[0] - Math.cos(ang - 0.5) * 34, b[1] - Math.sin(ang - 0.5) * 34, o);
    P.line(b[0], b[1], b[0] - Math.cos(ang + 0.5) * 34, b[1] - Math.sin(ang + 0.5) * 34, o);
  }
  function chest(P, x, y, w, h, open = false) {
    const body = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    P.path([...body, [x, y]], { w: 6.5, overshoot: false });
    const lid = open ? [[x - 10, y], [x - 30, y - h * 0.8], [x + w - 20, y - h * 0.85], [x + w, y]] : [[x, y], [x + w * 0.1, y - h * 0.45], [x + w * 0.9, y - h * 0.45], [x + w, y]];
    P.path(lid, { w: 6.5, overshoot: false });
    P.fill(body, { color: 'brown', alpha: 0.9 }); P.fill(lid, { color: '#b8733a', alpha: 0.9 });
    P.fill([[x, y + h * 0.3], [x + w, y + h * 0.3], [x + w, y + h * 0.42], [x, y + h * 0.42]], { color: 'gold', alpha: 1, speed: 5 });
    P.fill([[x + w * 0.42, y + h * 0.22], [x + w * 0.58, y + h * 0.22], [x + w * 0.58, y + h * 0.55], [x + w * 0.42, y + h * 0.55]], { color: 'gold', alpha: 1, speed: 5 });
    P.rect(x + w * 0.42, y + h * 0.22, w * 0.16, h * 0.33, { w: 4 });
    for (let i = 1; i < 4; i++) P.line(x + 10, y + h * (0.1 + i * 0.22), x + w - 10, y + h * (0.1 + i * 0.22), { w: 2.5, alpha: 0.5, speed: 4 });
  }

  const cl = (v) => Math.max(0, Math.min(1, v));
  const eio = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2), ein = (u) => u * u * u, eout = (u) => 1 - Math.pow(1 - u, 3);
  const beat = (k, hz) => Math.exp(-((k * hz) % 1) * 6);
  const S = [];
  // 0 intro: the fruit + its name
  S.push({ draw: () => {
    const P = pen(1);
    P.text('Hito Hito no Mi', 480, 380, { size: 118, speed: 3 });
    P.stamp('MODEL: NIKA', 480, 485, { size: 74, color: 'red', rot: -0.05 });
    P.group('rays'); rays(P, 480, 790, 280, 380, 16, 'gold');
    P.group('fruit'); fruit(P, 480, 790, 225);
    P.group(null); P.text('the Human-Human Fruit', 480, 1150, { size: 70, color: 'blue', speed: 3.2 });
    return P;
  }, anim: (g, k) => g === 'rays' ? { ox: 480, oy: 790, rot: k * 0.35 } : g === 'fruit' ? { ox: 480, oy: 790, y: Math.sin(k * 3) * 16, rot: Math.sin(k * 2.2) * 0.05 } : null, sfx: [] });
  // 1 800 years: hourglass + the fruit escaping
  S.push({ draw: () => {
    const P = pen(2), cx = 300, cy = 780;
    const top = [[cx - 160, cy - 300], [cx + 160, cy - 300], [cx + 160, cy - 260], [cx - 160, cy - 260]], bot = [[cx - 160, cy + 260], [cx + 160, cy + 260], [cx + 160, cy + 300], [cx - 160, cy + 300]];
    P.group('glass'); P.path([...top, top[0]], { w: 6.5, overshoot: false }); P.path([...bot, bot[0]], { w: 6.5, overshoot: false });
    P.line(cx - 135, cy - 260, cx - 135, cy + 260, { w: 7 }); P.line(cx + 135, cy - 260, cx + 135, cy + 260, { w: 7 });
    const glassL = [[cx - 100, cy - 255], [cx - 95, cy - 120], [cx - 14, cy - 16], [cx - 14, cy + 16], [cx - 95, cy + 120], [cx - 100, cy + 255]];
    const glassR = glassL.map(([x, y]) => [2 * cx - x, y]);
    P.curve(glassL, { w: 6 }); P.curve(glassR, { w: 6 });
    P.fill(top, { color: 'gold' }); P.fill(bot, { color: 'gold' });
    P.group('sandBot'); P.fill([[cx - 92, cy + 250], [cx - 70, cy + 160], [cx, cy + 105], [cx + 70, cy + 160], [cx + 92, cy + 250]], { color: 'yellow' });
    P.group('sandTop'); P.fill([[cx - 70, cy - 150], [cx + 70, cy - 150], [cx + 12, cy - 30], [cx - 12, cy - 30]], { color: 'yellow' });
    P.group('stream'); P.line(cx, cy - 25, cx, cy + 110, { w: 4, color: 'orange' });
    P.group('glass');
    P.group(null); P.stamp('800', 700, 470, { size: 210, color: 'red', rot: -0.06 });
    P.stamp('YEARS!', 700, 620, { size: 100, color: 'graphite', rot: -0.03 });
    P.group('runner'); fruit(P, 760, 930, 95, { sparkles: false });
    speedLines(P, 650, 930, 4, 200);
    for (const [x, y, r] of [[600, 1040, 28], [560, 1010, 20], [640, 1060, 18]]) { P.fill(ellPoly(x, y, r, r * 0.8), { color: 'rgba(120,110,100,0.35)', speed: 6 }); P.circle(x, y, r, { w: 3.5 }); }
    P.group(null); P.stamp('GOT AWAY!', 700, 1150, { size: 66, color: 'orange', rot: 0.05 });
    return P;
  }, anim: (g, k, D) => { const u = cl(k / (D * 0.9)); if (g === 'sandTop') return { ox: 300, oy: 750, sy: 1 - 0.9 * eio(u) }; if (g === 'sandBot') return { ox: 300, oy: 1030, sy: 0.45 + 0.6 * eio(u) }; if (g === 'stream') return { alpha: u < 1 ? 0.6 + 0.4 * Math.sin(k * 40) : 0 }; if (g === 'runner') return { x: 700 * ein(cl((k - D * 0.3) / (D * 0.6))), y: -Math.abs(Math.sin(k * 14)) * 14 * (k > D * 0.3 ? 1 : 0) }; return null; }, sfx: [{ f: 0.0, kind: 'swell' }, { f: 0.3, kind: 'zip' }] });
  // 2 will of its own: sly fruit under a spotlight
  S.push({ draw: () => {
    const P = pen(3);
    const cone = [[440, 300], [520, 300], [800, 1050], [160, 1050]];
    P.fill(cone, { color: 'rgba(255,220,90,0.45)', speed: 4 });
    P.line(440, 300, 160, 1050, { w: 3.5, alpha: 0.6 }); P.line(520, 300, 800, 1050, { w: 3.5, alpha: 0.6 });
    P.group('fruit'); fruit(P, 480, 790, 200, { face: true });
    P.group('q'); for (const [x, y, s, r] of [[170, 500, 110, -0.2], [810, 560, 90, 0.2], [820, 980, 70, 0.3]]) P.stamp('?', x, y, { size: s, color: 'red', rot: r });
    P.group(null); P.stamp('A MIND OF ITS OWN?!', 480, 1150, { size: 68, color: 'purple', rot: -0.03 });
    return P;
  }, anim: (g, k) => g === 'fruit' ? { ox: 480, oy: 990, x: Math.sin(k * 3.5) * 60, rot: Math.sin(k * 3.5) * 0.12 } : g === 'q' ? { ox: 500, oy: 700, s: 1 + 0.05 * Math.sin(k * 8) } : null, sfx: [] });
  // 3 renamed: classified record book
  S.push({ draw: () => {
    const P = pen(4), cx = 480, cy = 780;
    const L = [[cx - 400, cy - 230], [cx, cy - 200], [cx, cy + 250], [cx - 400, cy + 220]], R = [[cx, cy - 200], [cx + 400, cy - 230], [cx + 400, cy + 220], [cx, cy + 250]];
    P.group('left'); P.path([...L, L[0]], { w: 6.5, overshoot: false }); P.fill(L, { color: 'cream' });
    P.group('right'); P.path([...R, R[0]], { w: 6.5, overshoot: false }); P.fill(R, { color: 'cream' });
    P.group('left');
    P.fill([[cx - 420, cy + 220], [cx, cy + 250], [cx + 420, cy + 220], [cx + 420, cy + 250], [cx, cy + 285], [cx - 420, cy + 250]], { color: 'brown', speed: 4 });
    for (let i = 0; i < 7; i++) P.curve([[cx - 360, cy - 140 + i * 52], [cx - 220, cy - 148 + i * 52], [cx - 110, cy - 136 + i * 52], [cx - 40, cy - 142 + i * 52]], { w: 3, alpha: 0.45, speed: 4 });
    P.group('right'); P.text('Hito Hito no Mi', cx + 200, cy - 110, { size: 64, speed: 2.5 });
    for (let i = 0; i < 3; i++) P.line(cx + 40, cy - 125 + i * 14, cx + 365, cy - 108 + i * 12, { w: 7, color: 'red', speed: 2.5 });
    P.stamp('Gomu Gomu no Mi', cx + 200, cy + 40, { size: 56, color: 'blue', rot: -0.04, outline: null });
    // padlock
    const lx = cx + 200, ly = cy + 170;
    P.ellipse(lx, ly - 40, 40, 46, { a0: Math.PI, sweep: Math.PI, w: 8 });
    P.path([[lx - 58, ly - 40], [lx + 58, ly - 40], [lx + 58, ly + 40], [lx - 58, ly + 40], [lx - 58, ly - 40]], { w: 6, overshoot: false });
    P.fill([[lx - 58, ly - 40], [lx + 58, ly - 40], [lx + 58, ly + 40], [lx - 58, ly + 40]], { color: 'gold' });
    P.group(null); P.stamp('CLASSIFIED', cx - 200, cy + 380, { size: 84, color: 'red', rot: -0.1 });
    // the closed cover (appears once the right page has folded over)
    const C = [[cx - 410, cy - 240], [cx + 10, cy - 210], [cx + 10, cy + 262], [cx - 410, cy + 232]];
    P.group('_cover'); P.fill(C, { color: '#7a3e1c', alpha: 1 }); P.path([...C, C[0]], { w: 7, overshoot: false });
    P.fill([[cx - 360, cy - 40], [cx - 40, cy - 20], [cx - 40, cy + 40], [cx - 360, cy + 20]], { color: 'gold', alpha: 1 });
    P.stamp('TOP SECRET', cx - 200, cy + 10, { size: 58, color: 'red', rot: -0.05 });
    P.group(null);
    return P;
  }, anim: (g, k, D) => { const e = eio(cl((k - D * 0.2) / (D * 0.35))); if (g === 'right') { const sx = 1 - e; return { ox: 480, oy: 780, sx: Math.max(0.001, sx), alpha: sx > 0.03 ? 1 : 0 }; } if (g === '_cover') return { alpha: e >= 1 ? 1 : 0, ox: 280, oy: 780, s: e >= 1 ? 1 + 0.05 * Math.exp(-(k - D * 0.55) * 10) : 1, rot: e >= 1 ? Math.sin(k * 2) * 0.02 : 0 }; return null; }, sfx: [{ f: 0.2, kind: 'flap' }, { f: 0.55, kind: 'thud' }] });
  // 4 stolen from a government ship
  S.push({ draw: () => {
    const P = pen(5), cx = 420, cy = 860;
    const hull = [[cx - 300, cy - 30], [cx + 320, cy - 40], [cx + 220, cy + 90], [cx - 230, cy + 90]];
    P.group('ship'); P.path([...hull, hull[0]], { w: 7, overshoot: false }); P.fill(hull, { color: 'brown' });
    for (let i = 0; i < 5; i++) { P.fill(ellPoly(cx - 200 + i * 95, cy + 30, 16, 16), { color: 'gold', speed: 6 }); P.circle(cx - 200 + i * 95, cy + 30, 16, { w: 4 }); }
    P.line(cx - 40, cy - 30, cx - 40, cy - 470, { w: 8 }); P.line(cx + 160, cy - 35, cx + 160, cy - 360, { w: 7 });
    const s1 = [[cx - 34, cy - 450], [cx + 110, cy - 360], [cx + 120, cy - 230], [cx - 34, cy - 140]], s2 = [[cx + 166, cy - 340], [cx + 270, cy - 270], [cx + 275, cy - 180], [cx + 166, cy - 110]];
    P.curve(s1, { w: 6 }); P.curve(s2, { w: 6 }); P.fill(s1, { color: 'white' }); P.fill(s2, { color: 'white' });
    P.path([[cx - 40, cy - 470], [cx + 40, cy - 455], [cx - 40, cy - 430]], { w: 5, overshoot: false }); P.fill([[cx - 40, cy - 470], [cx + 40, cy - 455], [cx - 40, cy - 430]], { color: 'sky' });
    chest(P, cx + 210, cy - 115, 80, 70);
    P.group('sea'); const sea = []; for (let i = 0; i <= 18; i++) sea.push([30 + i * 52, cy + 100 + Math.sin(i * 1.3) * 18]);
    P.curve(sea, { w: 6, color: 'navy' }); P.fill([...sea, [960, 1260], [30, 1260]], { color: 'sky', alpha: 0.85 });
    P.group('waves'); for (let k = 0; k < 3; k++) P.curve([[80 + k * 260, cy + 190 + k * 30], [140 + k * 260, cy + 170 + k * 30], [200 + k * 260, cy + 190 + k * 30]], { w: 5, color: 'white', speed: 3 });
    P.group('burst'); const b = burstPoly(770, 520, 140, 12, 0.6, 1.25);
    P.fill(b, { color: 'orange' }); P.fill(burstPoly(770, 520, 90, 10, 0.55, 1.25), { color: 'yellow' }); P.path(b, { w: 6, overshoot: false });
    P.stamp('STOLEN!', 770, 525, { size: 80, color: 'red', rot: -0.08 });
    P.group(null);
    return P;
  }, anim: (g, k, D) => g === 'ship' ? { ox: 420, oy: 900, x: 1250 * eio(cl((k - 0.1) / (D - 0.25))), y: Math.sin(k * 3.2) * 10, rot: Math.sin(k * 3.2) * 0.05 } : g === 'waves' ? { y: Math.sin(k * 3) * 8 } : g === 'burst' ? { ox: 770, oy: 520, s: 1 + 0.08 * Math.sin(k * 12) } : null, sfx: [{ f: 0.05, kind: 'whoosh' }] });
  // 5 a little chest, a boy, dessert
  S.push({ draw: () => {
    const P = pen(6);
    const table = [[40, 1000], [950, 980], [950, 1080], [40, 1100]];
    P.path([[40, 1000], [950, 980]], { w: 7 }); P.fill(table, { color: '#c98a4e' });
    P.group('chest'); chest(P, 110, 760, 260, 220, true);
    for (const [x, y] of [[170, 640], [300, 600], [380, 700]]) sparkle(P, x, y, 22);
    P.group(null); P.fill(ellPoly(660, 965, 250, 56), { color: 'white' }); P.ellipse(660, 965, 250, 56, { w: 6 }); P.ellipse(660, 962, 185, 36, { w: 3, alpha: 0.5 });
    P.group('fruit'); fruit(P, 640, 820, 120, { bite: true, sparkles: false });
    P.group(null);
    P.path([[860, 900], [900, 760]], { w: 7, color: 'gray' }); for (const dx of [-14, 0, 14]) P.line(900 + dx, 760, 912 + dx, 715, { w: 5, color: 'gray' });
    P.group('chomp'); P.stamp('CHOMP!', 760, 640, { size: 96, color: 'orange', rot: 0.08 });
    P.group(null); P.stamp('DESSERT?!', 480, 420, { size: 110, color: 'red', rot: -0.05 });
    return P;
  }, anim: (g, k, D) => { const a = D * 0.4; return g === 'fruit' ? { ox: 640, oy: 840, rot: k < a ? Math.sin(k * 40) * 0.08 : 0, s: 1 - eout(cl((k - a) / (D * 0.2))) } : g === 'chest' ? { y: -Math.abs(Math.sin(k * 5)) * 10 } : g === 'chomp' ? { ox: 760, oy: 640, s: 1 + 0.3 * Math.exp(-Math.max(0, k - a) * 6) * (k > a ? 1 : 0) } : null; }, sfx: [{ f: 0.4, kind: 'chomp' }] });
  // 6 rubber: stretch, bounce, bullet bounce
  S.push({ draw: () => {
    const P = pen(7);
    for (const x of [140, 830]) { P.fill(ellPoly(x, 480, 22, 22), { color: 'red', speed: 6 }); P.circle(x, 480, 22, { w: 5 }); }
    const band = []; for (let i = 0; i <= 20; i++) { const x = 140 + i * 34.5, y = 480 + Math.sin(i / 20 * Math.PI) * 170; band.push([x, y - 14]); }
    const band2 = band.map(([x, y]) => [x, y + 34]).reverse();
    P.group('band'); P.curve(band, { w: 6 }); P.curve(band2, { w: 6 }); P.fill([...band, ...band2], { color: 'orange' });
    P.group(null); P.stamp('STRETCH!', 485, 380, { size: 84, color: 'purple', rot: -0.04 });
    // bouncing ball with arcs
    P.group('ball'); P.fill(ellPoly(250, 1000, 78, 78), { color: 'red' }); P.circle(250, 1000, 78, { w: 6.5 }); P.fill(ellPoly(225, 970, 24, 18), { color: 'white', speed: 6 });
    P.group(null); P.curve([[250, 900], [300, 760], [380, 720], [450, 790], [490, 990]], { w: 4, alpha: 0.6 });
    P.curve([[490, 990], [530, 880], [580, 990]], { w: 4, alpha: 0.6 });
    P.stamp('BOING!', 380, 650, { size: 80, color: 'red', rot: -0.1 });
    // bullet pinging off
    const bul = [[640, 960], [740, 960], [785, 985], [740, 1010], [640, 1010]];
    P.group('bullet'); P.path([...bul, bul[0]], { w: 5.5, overshoot: false }); P.fill(bul, { color: 'gray' });
    P.group(null);
    arrow(P, [[800, 970], [860, 880], [920, 860]], { w: 6, color: 'graphite' });
    P.stamp('PING!', 820, 790, { size: 70, color: 'orange', rot: 0.1 });
    P.stamp('BULLETPROOF', 720, 1130, { size: 58, color: 'blue', rot: -0.04 });
    return P;
  }, anim: (g, k, D) => g === 'band' ? { ox: 485, oy: 480, sy: 1 + Math.sin(k * 14) * Math.exp(-k * 1.0) * 0.6 } : g === 'ball' ? { x: k / D * 420, y: -Math.abs(Math.sin(k * 5)) * 230 * Math.exp(-k / D * 1.2) } : g === 'bullet' ? { x: 320 * eout(cl(k / (D * 0.6))), y: -140 * eout(cl(k / (D * 0.6))), alpha: 1 - cl((k - D * 0.55) / (D * 0.3)) } : null, sfx: [{ at: 0.0, kind: 'boing' }, { at: 0.05, kind: 'zip' }] });
  // 7 heartbeat: drum + pounding heart
  S.push({ draw: () => {
    const P = pen(8), cx = 330, cy = 870;
    const side = [[cx - 210, cy - 150], [cx + 210, cy - 150], [cx + 210, cy + 130], [cx - 210, cy + 130]];
    P.ellipse(cx, cy - 150, 210, 58, { w: 6.5 }); P.line(cx - 210, cy - 150, cx - 210, cy + 130, { w: 6.5 }); P.line(cx + 210, cy - 150, cx + 210, cy + 130, { w: 6.5 });
    P.ellipse(cx, cy + 130, 210, 58, { a0: 0, sweep: Math.PI, w: 6.5 });
    P.fill(side, { color: 'red' }); P.fill(ellPoly(cx, cy - 150, 205, 54), { color: 'cream' });
    const zz = []; for (let i = 0; i <= 10; i++) zz.push([cx - 200 + i * 40, cy - 90 + (i % 2) * 200]); P.path(zz, { w: 6, color: 'gold' });
    P.group('stick'); P.line(cx + 120, cy - 360, cx + 30, cy - 180, { w: 8, color: 'brown' }); P.fill(ellPoly(cx + 128, cy - 375, 22, 22), { color: 'cream' }); P.circle(cx + 128, cy - 375, 22, { w: 5 });
    P.group('heart'); const hx = 730, hy = 560;
    const heart = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2, x = 16 * Math.pow(Math.sin(a), 3), y = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)); heart.push([hx + x * 9, hy + y * 9]); }
    P.path(heart, { w: 7, overshoot: false }); P.fill(heart, { color: 'red' }); P.fill(ellPoly(hx - 60, hy - 50, 32, 22), { color: 'pink', speed: 6 });
    for (const r of [190, 235]) P.ellipse(hx, hy, r, r * 0.9, { a0: -0.6, sweep: 1.2, w: 6, color: 'red', alpha: 0.8 });
    P.group(null); P.stamp('BA-DUM!', 730, 820, { size: 110, color: 'red', rot: -0.06 });
    P.stamp('BA-DUM!', 760, 960, { size: 84, color: 'orange', rot: 0.05 });
    P.group('notes'); for (const [x, y] of [[600, 1100], [880, 1080]]) { P.fill(ellPoly(x, y, 22, 16), { color: 'graphite', speed: 6 }); P.line(x + 20, y, x + 20, y - 80, { w: 5 }); P.line(x + 20, y - 80, x + 55, y - 60, { w: 5 }); }
    P.group(null);
    return P;
  }, anim: (g, k) => { const p = beat(k, 2.2); if (g === 'heart') return { ox: 730, oy: 560, s: 1 + 0.14 * p }; if (g === 'stick') return { ox: 360, oy: 690, rot: -0.3 * p }; if (g === 'notes') return { y: -k * 70, x: Math.sin(k * 4) * 10, alpha: 1 - cl(k / 3) }; return null; }, sfx: [{ at: 0.0, kind: 'beat' }, { at: 0.4545, kind: 'beat' }, { at: 0.909, kind: 'beat' }, { at: 1.3636, kind: 'beat' }, { at: 1.818, kind: 'beat' }] });
  // 8 sun god + broken chains
  S.push({ draw: () => {
    const P = pen(9), cx = 480, cy = 820;
    P.fill([[40, 330], [940, 330], [940, cy + 60], [40, cy + 60]], { color: 'rgba(255,190,120,0.45)', speed: 4 });
    P.group('sun'); rays(P, cx, cy + 60, 250, 430, 13, 'orange', Math.PI, Math.PI * 2);
    const sun = ellPoly(cx, cy + 60, 220, 220, Math.PI, Math.PI * 2);
    P.path(sun, { w: 7, overshoot: false }); P.fill(sun, { color: 'gold' }); P.fill(ellPoly(cx - 70, cy - 60, 70, 40), { color: 'yellow', speed: 5 });
    P.group(null); P.line(40, cy + 60, 940, cy + 60, { w: 7 });
    P.fill([[40, cy + 60], [940, cy + 60], [940, 1260], [40, 1260]], { color: 'rgba(120,180,255,0.35)', speed: 4 });
    for (const [x, rot] of [[230, -0.2], [360, 0.2], [600, -0.2], [730, 0.2]]) { P.group(x < 480 ? 'chainL' : 'chainR'); P.ellipse(x, 1080, 70, 36, { rot, w: 9, color: 'gray' }); P.ellipse(x, 1080, 70, 36, { rot, w: 3.5 }); }
    P.group('crack'); for (const [a, b, c, d] of [[460, 1040, 500, 1000], [500, 1110, 540, 1150], [470, 1110, 440, 1150]]) P.line(a, b, c, d, { w: 6, color: 'red' });
    P.group(null); P.stamp('FREE!', 480, 1190, { size: 100, color: 'red', rot: -0.05 });
    P.stamp('SUN GOD', 480, 420, { size: 96, color: 'orange', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => { const e = eio(cl(k / (D * 0.9))); if (g === 'sun') return { y: -150 * e }; if (g === 'chainL') return { x: -110 * e, rot: -0.2 * e, ox: 300, oy: 1080 }; if (g === 'chainR') return { x: 110 * e, rot: 0.2 * e, ox: 660, oy: 1080 }; if (g === 'crack') return { alpha: 1 - e }; return null; }, sfx: [{ f: 0.0, kind: 'swell' }, { f: 0.3, kind: 'clink' }] });
  // 9 rubber world: wobbly ground, bouncing boulder, lightbulb
  S.push({ draw: () => {
    const P = pen(10);
    const g = []; for (let i = 0; i <= 18; i++) g.push([40 + i * 51, 1010 + Math.sin(i * 0.9) * 55]);
    P.group('ground'); P.curve(g, { w: 7 }); P.fill([...g, [958, 1260], [40, 1260]], { color: 'green', alpha: 0.85 });
    for (let k = 1; k <= 2; k++) P.curve(g.map(([x, y]) => [x, y + k * 55]), { w: 4, alpha: 0.5, speed: 3 });
    P.group('rock'); const rock = lumpPoly(300, 620, 120, 90, 0.08, 5);
    P.path(rock, { w: 7, overshoot: false }); P.fill(rock, { color: 'gray' }); P.fill(ellPoly(270, 590, 45, 26), { color: '#c8c8cf', speed: 5 });
    P.group(null); P.curve([[320, 990], [290, 850], [300, 730]], { w: 4, alpha: 0.55 });
    P.stamp('BOING!', 300, 430, { size: 100, color: 'red', rot: -0.1 });
    P.group('bulb'); const bx = 720, by = 590;
    const bulb = []; for (let i = 0; i <= 40; i++) { const a = Math.PI * 0.75 + i / 40 * Math.PI * 1.5; bulb.push([bx + Math.cos(a) * 110, by - 20 + Math.sin(a) * 120]); }
    bulb.push([bx + 60, by + 110], [bx - 60, by + 110]);
    P.path([...bulb, bulb[0]], { w: 7, overshoot: false }); P.fill(bulb, { color: 'yellow' });
    P.path([[bx - 60, by + 110], [bx + 60, by + 110], [bx + 55, by + 180], [bx - 55, by + 180], [bx - 60, by + 110]], { w: 6, overshoot: false });
    P.fill([[bx - 60, by + 110], [bx + 60, by + 110], [bx + 55, by + 180], [bx - 55, by + 180]], { color: 'gray' });
    rays(P, bx, by - 20, 150, 220, 9, 'orange', -Math.PI * 1.0, 0.0);
    P.group(null); P.stamp('IMAGINATION!', 690, 870, { size: 68, color: 'blue', rot: -0.04 });
    return P;
  }, anim: (g, k) => g === 'rock' ? { ox: 300, oy: 620, y: -Math.abs(Math.sin(k * 4.2)) * 170, rot: k * 2.5 } : g === 'ground' ? { ox: 500, oy: 1010, sy: 1 + Math.sin(k * 8.4) * 0.12 } : g === 'bulb' ? { ox: 720, oy: 600, s: 1 + 0.07 * Math.sin(k * 7) } : null, sfx: [{ at: 0.0, kind: 'boing' }, { at: 0.75, kind: 'boing' }] });
  // 10 outro
  S.push({ draw: () => {
    const P = pen(11);
    P.group('fruit'); fruit(P, 360, 720, 170);
    P.group('q'); P.stamp('?', 770, 650, { size: 380, color: 'red', rot: 0.12 });
    P.group(null);
    P.stamp('WHICH FRUIT NEXT?', 480, 1030, { size: 80, color: 'purple', rot: -0.03 });
    P.stamp('COMMENT!', 480, 1160, { size: 76, color: 'red', rot: 0.04 });
    return P;
  }, anim: (g, k) => g === 'fruit' ? { ox: 360, oy: 720, y: Math.sin(k * 3) * 14, rot: Math.sin(k * 2) * 0.06 } : g === 'q' ? { ox: 770, oy: 760, rot: Math.sin(k * 5) * 0.12 } : null, sfx: [] });

  globalThis.FRUIT_SCENES = S;
})();
