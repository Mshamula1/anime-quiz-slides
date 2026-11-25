// Devil Fruit Files #3: Ope Ope no Mi. One sketch per narration line (same order as ope_ope.json).
// Original drawings: an original pink fruit (colour nod only, no official shape or pattern), generic objects, no characters.
(function () {
  const { pen, ellPoly } = globalThis.Sketch;
  const lumpPoly = (cx, cy, rx, ry, lump = 0.05, lumps = 6, rot = 0.3) => { const p = []; for (let i = 0; i <= 72; i++) { const a = rot + i / 72 * Math.PI * 2, r = 1 + lump * Math.sin(a * lumps); p.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } return p; };
  const starPoly = (cx, cy, r, n = 5, k = 0.45, rot = -Math.PI / 2) => { const p = []; for (let i = 0; i <= n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? r * k : r; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return p; };
  const heartPoly = (hx, hy, s) => { const h = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2, x = 16 * Math.pow(Math.sin(a), 3), y = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)); h.push([hx + x * s, hy + y * s]); } return h; };

  function sparkle(P, x, y, r, color = 'gold') { const s = starPoly(x, y, r, 4, 0.3, 0); P.fill(s, { color, alpha: 0.95, speed: 6 }); P.path(s, { w: 3.5, overshoot: false, speed: 3 }); }
  function rays(P, cx, cy, r0, r1, n, color = 'gold', a0 = 0, a1 = Math.PI * 2) { for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * (i + 0.5) / n, rr = r1 * (i % 2 ? 0.85 : 1); P.line(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, { w: 7, color, speed: 3 }); } }
  function arrow(P, pts, o = {}) {
    P.curve(pts, o);
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    P.line(b[0], b[1], b[0] - Math.cos(ang - 0.5) * 34, b[1] - Math.sin(ang - 0.5) * 34, o);
    P.line(b[0], b[1], b[0] - Math.cos(ang + 0.5) * 34, b[1] - Math.sin(ang + 0.5) * 34, o);
  }
  // the original pink fruit: plump oval body, red shade, light spot, short stem, two leaves
  function fruit(P, cx, cy, r, { sparkles = true, bite = false } = {}) {
    const body = lumpPoly(cx, cy, r * 0.95, r, 0.04, 5, 0.9);
    P.path(body, { w: 7, overshoot: false });
    P.line(cx, cy - r * 0.95, cx + r * 0.08, cy - r * 1.22, { w: 8, color: 'brown' });
    const l1 = [[cx + 6, cy - r * 1.1], [cx + r * 0.4, cy - r * 1.4], [cx + r * 0.75, cy - r * 1.2], [cx + 6, cy - r * 1.1]];
    const l2 = [[cx - 4, cy - r * 1.08], [cx - r * 0.35, cy - r * 1.3], [cx - r * 0.6, cy - r * 1.12], [cx - 4, cy - r * 1.08]];
    P.curve(l1, { w: 5 }); P.curve(l2, { w: 5 });
    P.fill(body, { color: 'pink', alpha: 0.95 });
    P.fill(ellPoly(cx + r * 0.25, cy + r * 0.3, r * 0.6, r * 0.5, -0.4, 2.2), { color: 'red', alpha: 0.45 });
    P.fill(ellPoly(cx - r * 0.3, cy - r * 0.32, r * 0.36, r * 0.28), { color: '#ffd0dc', alpha: 0.95 });
    P.fill(l1.slice(0, 3), { color: 'green', alpha: 0.9 }); P.fill(l2.slice(0, 3), { color: 'green', alpha: 0.9 });
    for (const [dx, dy, s] of [[-0.45, -0.45, 0.07], [-0.3, -0.56, 0.045], [-0.52, -0.25, 0.04]]) P.fill(ellPoly(cx + dx * r, cy + dy * r, s * r, s * r * 0.8), { color: 'white', alpha: 0.95, speed: 6 });
    if (bite) { P.fill(ellPoly(cx + r * 0.92, cy - r * 0.1, r * 0.3, r * 0.26), { color: 'cream', alpha: 1 }); P.fill(ellPoly(cx + r * 0.92, cy + r * 0.32, r * 0.28, r * 0.24), { color: 'cream', alpha: 1 }); P.ellipse(cx + r * 0.92, cy - r * 0.1, r * 0.3, r * 0.26, { a0: 1.8, sweep: 2.6, w: 5.5 }); P.ellipse(cx + r * 0.92, cy + r * 0.32, r * 0.28, r * 0.24, { a0: 1.8, sweep: 2.6, w: 5.5 }); }
    P.fill(ellPoly(cx + r * 0.1, cy + r * 1.06, r * 0.8, r * 0.12), { color: 'rgba(60,30,40,0.25)', alpha: 1, speed: 6 });
    if (sparkles) { sparkle(P, cx - r * 1.15, cy - r * 0.6, 26); sparkle(P, cx + r * 1.2, cy - r * 0.2, 20); sparkle(P, cx - r * 0.9, cy + r * 0.85, 16); }
  }
  function chest(P, x, y, w, h) {
    const body = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    P.path([...body, [x, y]], { w: 6.5, overshoot: false });
    const lid = [[x, y], [x + w * 0.1, y - h * 0.45], [x + w * 0.9, y - h * 0.45], [x + w, y]];
    P.path(lid, { w: 6.5, overshoot: false });
    P.fill(body, { color: 'brown', alpha: 0.9 }); P.fill(lid, { color: '#b8733a', alpha: 0.9 });
    P.fill([[x, y + h * 0.3], [x + w, y + h * 0.3], [x + w, y + h * 0.42], [x, y + h * 0.42]], { color: 'gold', alpha: 1, speed: 5 });
    P.fill([[x + w * 0.42, y + h * 0.22], [x + w * 0.58, y + h * 0.22], [x + w * 0.58, y + h * 0.55], [x + w * 0.42, y + h * 0.55]], { color: 'gold', alpha: 1, speed: 5 });
    P.rect(x + w * 0.42, y + h * 0.22, w * 0.16, h * 0.33, { w: 4 });
    for (let i = 1; i < 4; i++) P.line(x + 10, y + h * (0.1 + i * 0.22), x + w - 10, y + h * (0.1 + i * 0.22), { w: 2.5, alpha: 0.5, speed: 4 });
  }
  function bolt(P, x, y, s, color = 'yellow') { const b = [[x, y], [x + 60 * s, y], [x + 25 * s, y + 90 * s], [x + 75 * s, y + 90 * s], [x - 20 * s, y + 240 * s], [x + 10 * s, y + 120 * s], [x - 40 * s, y + 120 * s]]; P.fill(b, { color }); P.path([...b, b[0]], { w: 6, overshoot: false }); }

  const cl = (v) => Math.max(0, Math.min(1, v));
  const eio = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2), ein = (u) => u * u * u, eout = (u) => 1 - Math.pow(1 - u, 3);
  const beat = (k, hz) => Math.exp(-((k * hz) % 1) * 6);
  const S = [];
  // 0 intro
  S.push({ draw: () => {
    const P = pen(41);
    P.text('Ope Ope no Mi', 500, 390, { size: 118, speed: 3 });
    P.group('rays'); rays(P, 500, 800, 280, 380, 16, 'sky');
    P.group('fruit'); fruit(P, 500, 800, 215);
    P.group(null); P.stamp('THE ULTIMATE', 500, 1150, { size: 84, color: 'red', rot: -0.04 });
    return P;
  }, anim: (g, k) => g === 'rays' ? { ox: 500, oy: 800, rot: k * 0.35 } : g === 'fruit' ? { ox: 500, oy: 800, y: Math.sin(k * 3) * 16, rot: Math.sin(k * 2.2) * 0.05 } : null, sfx: [{ f: 0.0, kind: 'swell' }] });
  // 1 the Room: a blue dome over a little harbour
  S.push({ draw: () => {
    const P = pen(42);
    P.group('dome'); const d = ellPoly(500, 1050, 400, 520, Math.PI, Math.PI * 2, 60);
    P.fill(d, { color: 'rgba(110,190,255,0.35)', speed: 4 }); P.path(d, { w: 7, color: 'blue', overshoot: false });
    P.ellipse(500, 1050, 400, 70, { w: 4, color: 'blue', alpha: 0.6 });
    P.group(null); P.line(80, 1050, 940, 1050, { w: 7 }); P.fill([[80, 1050], [940, 1050], [940, 1240], [80, 1240]], { color: '#c9b08a', speed: 4 });
    for (const [x, w, h, c] of [[260, 120, 150, '#e9a46b'], [400, 100, 210, 'cream'], [530, 130, 130, '#9ec7e8'], [680, 110, 180, '#e9a46b']]) { const b = [[x, 1050], [x, 1050 - h], [x + w / 2, 1050 - h - 60], [x + w, 1050 - h], [x + w, 1050]]; P.path(b, { w: 5.5, overshoot: false }); P.fill(b, { color: c }); P.rect(x + w * 0.35, 1050 - h * 0.45, w * 0.3, h * 0.25, { w: 3.5 }); }
    P.group('scalpel'); P.line(760, 470, 880, 360, { w: 10, color: 'gray' }); P.fill([[880, 360], [930, 330], [900, 380]], { color: '#e8ecf2' }); P.path([[880, 360], [930, 330], [900, 380], [880, 360]], { w: 4, overshoot: false });
    P.group(null); P.stamp('ROOM', 500, 700, { size: 150, color: 'blue', rot: -0.04 });
    return P;
  }, anim: (g, k, D) => g === 'dome' ? { ox: 500, oy: 1050, s: 0.15 + 0.85 * eout(cl(k / (D * 0.4))) + 0.02 * Math.sin(k * 4) } : g === 'scalpel' ? { ox: 820, oy: 420, rot: Math.sin(k * 3) * 0.15 } : null, sfx: [{ f: 0.0, kind: 'swell' }] });
  // 2 slice without harm + Shambles swap
  S.push({ draw: () => {
    const P = pen(43);
    const piece = (name, x, y, w, h) => { P.group(name); const b = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; P.path([...b, b[0]], { w: 6, overshoot: false }); P.fill(b, { color: '#d9a066' }); P.line(x + 10, y + h * 0.5, x + w - 10, y + h * 0.5, { w: 3, alpha: 0.5 }); };
    piece('p1', 120, 450, 160, 130); piece('p2', 280, 450, 160, 130); piece('p3', 120, 580, 160, 130); piece('p4', 280, 580, 160, 130);
    P.group(null); for (const [a, b, c, d] of [[100, 580, 460, 580], [280, 430, 280, 730]]) P.line(a, b, c, d, { w: 4, color: 'blue', alpha: 0.8 });
    P.stamp('SLICE!', 700, 560, { size: 100, color: 'blue', rot: 0.05 });
    P.group('barrel'); const br = lumpPoly(260, 1000, 90, 120, 0.02, 2, 0); P.path(br, { w: 6, overshoot: false }); P.fill(br, { color: 'brown' }); for (const dy of [-60, 60]) P.line(175, 1000 + dy, 345, 1000 + dy, { w: 7, color: 'gray' });
    P.group('apple'); fruit(P, 740, 1010, 80, { sparkles: false });
    P.group(null); arrow(P, [[380, 880], [500, 830], [620, 880]], { w: 6, color: 'graphite' }); arrow(P, [[620, 1130], [500, 1180], [380, 1130]], { w: 6, color: 'graphite' });
    P.stamp('SHAMBLES!', 500, 760, { size: 80, color: 'red', rot: -0.04 });
    return P;
  }, anim: (g, k, D) => { const u = eio(cl((k - D * 0.1) / (D * 0.3))), w = eio(cl((k - D * 0.55) / (D * 0.12))); const fl = Math.sin(k * 4) * 6;
    if (g === 'p1') return { x: -30 * u, y: -30 * u + fl }; if (g === 'p2') return { x: 30 * u, y: -30 * u - fl }; if (g === 'p3') return { x: -30 * u, y: 30 * u - fl }; if (g === 'p4') return { x: 30 * u, y: 30 * u + fl };
    if (g === 'barrel') return { x: 480 * w }; if (g === 'apple') return { x: -480 * w }; return null; }, sfx: [{ f: 0.1, kind: 'zip' }, { f: 0.55, kind: 'whoosh' }] });
  // 3 the Perennial Youth Operation: infinity + a heart that fades
  S.push({ draw: () => {
    const P = pen(44);
    P.group('inf'); const inf = []; for (let i = 0; i <= 80; i++) { const t = i / 80 * Math.PI * 2, d = 1 + Math.sin(t) * Math.sin(t); inf.push([500 + 300 * Math.cos(t) / d, 640 + 300 * Math.sin(t) * Math.cos(t) / d]); }
    P.curve(inf, { w: 22, color: 'gold' }); P.curve(inf, { w: 5 });
    sparkle(P, 170, 520, 26); sparkle(P, 840, 760, 22); sparkle(P, 820, 500, 18);
    P.group(null); P.stamp('IMMORTAL', 500, 470, { size: 96, color: 'purple', rot: -0.04 });
    P.group('heart'); const h = heartPoly(500, 960, 8); P.path(h, { w: 7, overshoot: false }); P.fill(h, { color: 'red' }); P.fill(ellPoly(450, 920, 26, 18), { color: 'pink', speed: 6 });
    P.group(null); P.stamp('THE COST:', 500, 1110, { size: 66, color: 'graphite', rot: 0.03 }); P.stamp("THE USER'S LIFE", 500, 1195, { size: 66, color: 'red', rot: -0.02 });
    return P;
  }, anim: (g, k, D) => g === 'inf' ? { ox: 500, oy: 640, s: 1 + 0.05 * Math.sin(k * 4) } : g === 'heart' ? { ox: 500, oy: 960, s: (1 + 0.12 * beat(k, 1.6)) * (1 - 0.35 * eio(cl((k - D * 0.5) / (D * 0.4)))), alpha: 1 - 0.6 * cl((k - D * 0.5) / (D * 0.4)) } : null, sfx: [{ f: 0.0, kind: 'beat' }, { f: 0.3, kind: 'beat' }] });
  // 4 five billion berries: money bags + coins
  S.push({ draw: () => {
    const P = pen(45);
    const bag = (x, y, s) => { const b = lumpPoly(x, y, 130 * s, 120 * s, 0.05, 5); P.path(b, { w: 6.5, overshoot: false }); P.fill(b, { color: '#c9a36a' }); P.path([[x - 40 * s, y - 115 * s], [x - 60 * s, y - 170 * s], [x + 60 * s, y - 170 * s], [x + 40 * s, y - 115 * s]], { w: 6 }); P.line(x - 50 * s, y - 118 * s, x + 50 * s, y - 118 * s, { w: 8, color: 'red' }); P.stamp('$', x, y + 10 * s, { size: 110 * s, color: 'green', rot: 0 }); };
    P.group('bags'); bag(300, 1000, 1.1); bag(620, 1020, 0.95);
    for (let i = 0; i < 6; i++) { const x = 760 + (i % 2) * 6, y = 1130 - i * 26; P.fill(ellPoly(x, y, 60, 18), { color: 'gold', speed: 6 }); P.ellipse(x, y, 60, 18, { w: 4 }); }
    P.group('coins'); for (const [x, y] of [[180, 470], [420, 560], [700, 500], [860, 640], [300, 680]]) { P.fill(ellPoly(x, y, 34, 34), { color: 'gold', speed: 6 }); P.circle(x, y, 34, { w: 4.5 }); P.circle(x, y, 22, { w: 2.5, alpha: 0.6 }); }
    P.group(null); P.stamp('5 BILLION!', 500, 780, { size: 120, color: 'red', rot: -0.05 });
    return P;
  }, anim: (g, k) => g === 'coins' ? { y: Math.sin(k * 3) * 18, rot: 0 } : g === 'bags' ? { ox: 480, oy: 1120, sy: 1 + 0.04 * Math.abs(Math.sin(k * 4)) } : null, sfx: [{ f: 0.2, kind: 'clink' }, { f: 0.5, kind: 'clink' }] });
  // 5 a pirate wants it: a grabbing hand on strings reaches, the fruit dodges
  S.push({ draw: () => {
    const P = pen(46);
    P.group('hand'); const hx = 300, hy = 700;
    const palm = lumpPoly(hx, hy, 110, 95, 0.04, 4); P.path(palm, { w: 6.5, overshoot: false }); P.fill(palm, { color: '#f2c9a0' });
    for (let i = 0; i < 4; i++) { const fx = hx + 70 + i * 6, fy = hy - 75 + i * 50; P.path([[fx, fy - 18], [fx + 120, fy - 22], [fx + 140, fy], [fx + 120, fy + 22], [fx, fy + 18]], { w: 5.5, overshoot: false }); P.fill([[fx, fy - 18], [fx + 120, fy - 22], [fx + 140, fy], [fx + 120, fy + 22], [fx, fy + 18]], { color: '#f2c9a0' }); }
    for (let i = 0; i < 4; i++) P.line(hx - 60 + i * 40, hy - 90, hx - 80 + i * 60, 340, { w: 3, color: 'gray' });
    P.group('fruit'); fruit(P, 760, 760, 95, { sparkles: false });
    P.group(null); P.stamp('MINE!', 330, 1000, { size: 110, color: 'red', rot: -0.07 });
    P.stamp('NOPE!', 760, 1000, { size: 76, color: 'blue', rot: 0.06 });
    return P;
  }, anim: (g, k, D) => { const r = Math.sin(k * 2.6); return g === 'hand' ? { x: 120 + 90 * r } : g === 'fruit' ? { ox: 760, oy: 760, x: 40 * Math.max(0, r), y: -60 * Math.max(0, r), rot: 0.2 * Math.max(0, r) } : null; }, sfx: [] });
  // 6 stolen: the open chest, the fruit zipping away
  S.push({ draw: () => {
    const P = pen(47);
    P.group('chest'); chest(P, 140, 860, 300, 230);
    P.group(null); const lk = [[300, 1150], [370, 1140], [380, 1200], [310, 1210]]; P.fill(lk, { color: 'gold' }); P.path([...lk, lk[0]], { w: 4, overshoot: false }); P.curve([[315, 1145], [320, 1100], [350, 1095], [360, 1120]], { w: 6 });
    P.group('runner'); fruit(P, 560, 640, 85, { sparkles: false }); for (let i = 0; i < 3; i++) P.line(380 + i * 18, 600 + i * 40, 450, 600 + i * 40, { w: 5, alpha: 0.8 });
    P.group(null); P.stamp('STOLEN!', 680, 1000, { size: 110, color: 'red', rot: -0.06 });
    for (const [x, y] of [[480, 870], [560, 830], [640, 800]]) { P.fill(ellPoly(x, y, 16, 22, 0, Math.PI * 2), { color: 'graphite', speed: 6 }); }
    return P;
  }, anim: (g, k, D) => g === 'runner' ? { x: 600 * ein(cl((k - D * 0.3) / (D * 0.55))), y: -Math.abs(Math.sin(k * 12)) * 12 } : g === 'chest' ? { ox: 290, oy: 1090, rot: Math.sin(k * 20) * 0.02 * (k < D * 0.3 ? 1 : 0) } : null, sfx: [{ f: 0.3, kind: 'zip' }] });
  // 7 the white town: pale houses with white patches, a medical cross, the fruit
  S.push({ draw: () => {
    const P = pen(48);
    P.fill([[70, 340], [950, 340], [950, 950], [70, 950]], { color: 'rgba(160,165,180,0.35)', speed: 4 });
    for (const [x, w, h] of [[110, 140, 260], [250, 120, 340], [370, 150, 220], [520, 130, 300], [650, 160, 250], [810, 120, 330]]) { const b = [[x, 950], [x, 950 - h], [x + w / 2, 950 - h - 50], [x + w, 950 - h], [x + w, 950]]; P.path(b, { w: 5, overshoot: false }); P.fill(b, { color: 'white' }); for (let j = 0; j < 2; j++) P.rect(x + w * 0.3, 950 - h * (0.4 + j * 0.3), w * 0.4, h * 0.12, { w: 3 }); }
    P.line(70, 950, 950, 950, { w: 7 });
    P.stamp('WHITE TOWN', 500, 450, { size: 80, color: 'graphite', rot: -0.03 });
    P.group('cross'); P.fill([[230, 1010], [290, 1010], [290, 1060], [340, 1060], [340, 1120], [290, 1120], [290, 1170], [230, 1170], [230, 1120], [180, 1120], [180, 1060], [230, 1060]], { color: 'red' }); P.path([[230, 1010], [290, 1010], [290, 1060], [340, 1060], [340, 1120], [290, 1120], [290, 1170], [230, 1170], [230, 1120], [180, 1120], [180, 1060], [230, 1060], [230, 1010]], { w: 5, overshoot: false });
    P.group('fruit'); fruit(P, 680, 1080, 85, { sparkles: false, bite: true });
    P.group(null); P.stamp('AMBER LEAD', 500, 1210, { size: 64, color: 'red', rot: 0.03 });
    return P;
  }, anim: (g, k) => g === 'cross' ? { ox: 260, oy: 1090, s: 1 + 0.08 * Math.sin(k * 5) } : g === 'fruit' ? { ox: 680, oy: 1080, y: Math.sin(k * 3) * 10, rot: Math.sin(k * 2) * 0.05 } : null, sfx: [] });
  // 8 cured + the hiding chest and a farewell heart
  S.push({ draw: () => {
    const P = pen(49);
    P.group('chest'); chest(P, 300, 870, 360, 260);
    P.group(null); P.stamp('SHHH...', 480, 1210, { size: 76, color: 'graphite', rot: -0.03 });
    P.group('heart'); const h = heartPoly(480, 680, 6); P.path(h, { w: 6, overshoot: false }); P.fill(h, { color: 'red' }); P.fill(ellPoly(445, 650, 20, 14), { color: 'pink', speed: 6 });
    P.group(null); P.stamp('CURED!', 220, 480, { size: 80, color: 'green', rot: -0.08 });
    P.path([[700, 470], [740, 520], [840, 400]], { w: 12, color: 'green' });
    return P;
  }, anim: (g, k, D) => g === 'heart' ? { ox: 480, oy: 680, y: -140 * eio(cl((k - D * 0.3) / (D * 0.6))), alpha: 1 - 0.85 * cl((k - D * 0.5) / (D * 0.45)), s: 1 + 0.08 * Math.sin(k * 5) } : g === 'chest' ? { ox: 480, oy: 1130, sy: 1 + 0.015 * Math.sin(k * 2.5) } : null, sfx: [] });
  // 9 the attacks: a glowing knife, a zap, awakened
  S.push({ draw: () => {
    const P = pen(50);
    P.group('knife'); const bl = [[150, 700], [480, 560], [500, 590], [170, 730]]; P.fill(bl, { color: '#e3e8f0' }); P.path([...bl, bl[0]], { w: 5.5, overshoot: false }); P.line(150, 715, 90, 740, { w: 16, color: 'navy' });
    for (const r of [60, 90]) P.ellipse(330, 645, r * 2.2, r, { rot: -0.4, w: 4, color: 'sky', alpha: 0.8 });
    P.group(null); P.stamp('GAMMA KNIFE', 320, 470, { size: 70, color: 'blue', rot: -0.05 });
    P.group('zap'); bolt(P, 700, 470, 1.1);
    P.group(null); P.stamp('ZAP!', 780, 830, { size: 90, color: 'orange', rot: 0.08 });
    P.group('awake'); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; P.line(500 + Math.cos(a) * 80, 1060 + Math.sin(a) * 50, 500 + Math.cos(a) * 140, 1060 + Math.sin(a) * 90, { w: 6, color: 'purple' }); }
    P.group(null); P.stamp('AWAKENED!', 500, 1070, { size: 92, color: 'purple', rot: -0.03 });
    return P;
  }, anim: (g, k) => g === 'knife' ? { ox: 330, oy: 645, rot: Math.sin(k * 3) * 0.08 } : g === 'zap' ? { ox: 720, oy: 600, s: 1 + 0.1 * beat(k, 2), alpha: 0.6 + 0.4 * Math.abs(Math.sin(k * 11)) } : g === 'awake' ? { ox: 500, oy: 1060, rot: k * 0.6, s: 1 + 0.06 * Math.sin(k * 6) } : null, sfx: [{ f: 0.4, kind: 'zip' }] });
  // 10 outro
  S.push({ draw: () => {
    const P = pen(51);
    P.group('fruit'); fruit(P, 360, 720, 170);
    P.group('q'); P.stamp('?', 770, 650, { size: 380, color: 'red', rot: 0.12 });
    P.group(null);
    P.stamp('WHICH FRUIT NEXT?', 480, 1030, { size: 80, color: 'purple', rot: -0.03 });
    P.stamp('COMMENT!', 480, 1160, { size: 76, color: 'red', rot: 0.04 });
    return P;
  }, anim: (g, k) => g === 'fruit' ? { ox: 360, oy: 720, y: Math.sin(k * 3) * 14, rot: Math.sin(k * 2) * 0.06 } : g === 'q' ? { ox: 770, oy: 760, rot: Math.sin(k * 5) * 0.12 } : null, sfx: [] });

  globalThis.FRUIT_SCENES = S;
})();
