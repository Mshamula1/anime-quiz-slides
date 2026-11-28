// Devil Fruit Files #8: Yomi Yomi no Mi. One sketch per narration line (same order as yomi_yomi.json).
// Original drawings: an original lilac swirl fruit (colour nod only, no official pattern), generic objects, no characters.
(function () {
  const { pen, ellPoly } = globalThis.Sketch;
  const lumpPoly = (cx, cy, rx, ry, lump = 0.05, lumps = 6, rot = 0.3) => { const p = []; for (let i = 0; i <= 72; i++) { const a = rot + i / 72 * Math.PI * 2, r = 1 + lump * Math.sin(a * lumps); p.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } return p; };
  const starPoly = (cx, cy, r, n = 5, k = 0.45, rot = -Math.PI / 2) => { const p = []; for (let i = 0; i <= n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? r * k : r; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return p; };
  function sparkle(P, x, y, r, color = 'yellow') { const s = starPoly(x, y, r, 4, 0.3, 0); P.fill(s, { color, alpha: 0.95, speed: 6 }); P.path(s, { w: 3.5, overshoot: false, speed: 3 }); }
  function sea(P, y0, x0 = 70, x1 = 950, color = 'sky') {
    const s = []; for (let i = 0; i <= 17; i++) s.push([x0 + i * (x1 - x0) / 17, y0 + Math.sin(i * 1.3) * 14]);
    P.curve(s, { w: 6, color: 'navy' }); P.fill([...s, [x1, 1245], [x0, 1245]], { color, alpha: 0.85 });
  }
  function ship(P, x, y, s = 1, sail = 'white', torn = false) {
    const h = [[x - 100 * s, y], [x + 100 * s, y], [x + 70 * s, y + 45 * s], [x - 70 * s, y + 45 * s]];
    P.path([...h, h[0]], { w: 5, overshoot: false }); P.fill(h, { color: 'brown' });
    P.line(x, y, x, y - 120 * s, { w: 5 });
    const sl = torn ? [[x + 4, y - 115 * s], [x + 70 * s, y - 75 * s], [x + 40 * s, y - 60 * s], [x + 62 * s, y - 40 * s], [x + 4, y - 20 * s]] : [[x + 4, y - 115 * s], [x + 70 * s, y - 60 * s], [x + 4, y - 20 * s]];
    P.fill(sl, { color: sail }); P.path([...sl, sl[0]], { w: 4, overshoot: false });
  }
  // a soul wisp: teardrop ghost-flame with two dot eyes
  function wisp(P, cx, cy, r, color = 'lilac') {
    const w = []; for (let i = 0; i <= 40; i++) { const u = i / 40, a = u * Math.PI * 2; const rr = r * (1 + 0.15 * Math.sin(a * 3)); w.push([cx + Math.cos(a) * rr * 0.8, cy + Math.sin(a) * rr * (Math.sin(a) < 0 ? 1.5 : 0.8)]); }
    P.fill(w, { color, alpha: 0.75 }); P.path(w, { w: 5, color: 'purple', overshoot: false });
    P.fill(ellPoly(cx - r * 0.28, cy - r * 0.05, r * 0.1, r * 0.16), { color: 'navy' }); P.fill(ellPoly(cx + r * 0.28, cy - r * 0.05, r * 0.1, r * 0.16), { color: 'navy' });
  }
  function bone(P, x1, y1, x2, y2, r = 18) {
    P.line(x1, y1, x2, y2, { w: r * 1.1, color: 'cream' }); P.line(x1, y1, x2, y2, { w: 4 });
    for (const [x, y] of [[x1, y1], [x2, y2]]) { const dx = (y2 - y1), dy = -(x2 - x1), L = Math.hypot(dx, dy); const ox = dx / L * r * 0.7, oy = dy / L * r * 0.7;
      for (const sgn of [1, -1]) { const k = ellPoly(x + ox * sgn, y + oy * sgn, r * 0.75, r * 0.75); P.fill(k, { color: 'cream' }); P.path(k, { w: 4, overshoot: false }); } }
  }
  function fog(P, cx, cy, rx, ry, seed = 1) { const f = lumpPoly(cx, cy, rx, ry, 0.12, 7, seed); P.fill(f, { color: 'rgba(200,205,220,0.75)', alpha: 1 }); P.path(f, { w: 4, color: 'gray', overshoot: false }); }
  // the original fruit: round, lilac, spiral swirls, curly stem, leaf
  function fruit(P, cx, cy, r, { sparkles = true } = {}) {
    const body = lumpPoly(cx, cy, r, r * 0.95, 0.05, 5);
    P.path(body, { w: 7, overshoot: false });
    P.curve([[cx - 4, cy - r * 0.88], [cx - 12, cy - r * 1.12], [cx + r * 0.05, cy - r * 1.3], [cx + r * 0.25, cy - r * 1.28]], { w: 8, color: 'brown' });
    const leaf = [[cx + 10, cy - r * 1.0], [cx + r * 0.4, cy - r * 1.35], [cx + r * 0.85, cy - r * 1.22], [cx + r * 0.62, cy - r * 1.0], [cx + 10, cy - r * 1.0]];
    P.curve(leaf, { w: 5.5 });
    P.fill(body, { color: 'lilac', alpha: 0.95 });
    for (const [sx, sy, sr] of [[-0.35, -0.2, 0.32], [0.35, 0.15, 0.3], [-0.1, 0.5, 0.22]]) { const sp = []; for (let i = 0; i <= 30; i++) { const a = i / 30 * Math.PI * 3.2, rr = r * sr * i / 30; sp.push([cx + sx * r + Math.cos(a) * rr, cy + sy * r + Math.sin(a) * rr]); } P.curve(sp, { w: 5, color: 'purple' }); }
    P.fill(ellPoly(cx - r * 0.35, cy - r * 0.5, r * 0.25, r * 0.14), { color: 'white', alpha: 0.6 });
    P.fill(leaf.slice(0, 4), { color: 'green', alpha: 0.9 });
    P.fill(ellPoly(cx + r * 0.1, cy + r * 1.04, r * 0.85, r * 0.13), { color: 'rgba(40,20,60,0.22)', alpha: 1, speed: 6 });
    if (sparkles) { sparkle(P, cx - r * 1.15, cy - r * 0.6, 26, 'sky'); sparkle(P, cx + r * 1.2, cy - r * 0.2, 20); sparkle(P, cx + r * 0.95, cy + r * 0.85, 16, 'sky'); }
  }
  function note(P, x, y, s = 1, color = 'navy') { P.fill(ellPoly(x, y, 22 * s, 16 * s, -0.4), { color }); P.line(x + 19 * s, y - 6 * s, x + 19 * s, y - 80 * s, { w: 5, color }); P.curve([[x + 19 * s, y - 80 * s], [x + 45 * s, y - 60 * s], [x + 40 * s, y - 38 * s]], { w: 5, color }); }

  const cl = (v) => Math.max(0, Math.min(1, v));
  const eio = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2), eout = (u) => 1 - Math.pow(1 - u, 3);
  const S = [];

  // 0 intro: the fruit + its name, soul wisps circling
  S.push({ draw: () => {
    const P = pen(101);
    P.text('Yomi Yomi no Mi', 500, 390, { size: 104, speed: 3 });
    P.group('wisps'); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; wisp(P, 500 + Math.cos(a) * 320, 800 + Math.sin(a) * 280, 30); }
    P.group('fruit'); fruit(P, 500, 800, 200);
    P.group(null); P.stamp('REVIVE-REVIVE!', 500, 1160, { size: 84, color: 'purple', rot: -0.04 });
    return P;
  }, anim: (g, k) => g === 'wisps' ? { ox: 500, oy: 800, rot: k * 0.3 } : g === 'fruit' ? { ox: 500, oy: 800, y: Math.sin(k * 3) * 16, rot: Math.sin(k * 2.2) * 0.05 } : null, sfx: [{ f: 0.0, kind: 'swell' }] });

  // 1 no power in life, one comeback: a heart monitor that goes flat, then a heart with "x1"
  S.push({ draw: () => {
    const P = pen(102);
    const scr = [[110, 560], [890, 560], [890, 860], [110, 860]]; P.fill(scr, { color: 'navy', alpha: 0.85 }); P.path([...scr, scr[0]], { w: 6, overshoot: false });
    P.curve([[140, 720], [300, 720], [330, 640], [360, 800], [390, 720], [860, 720]], { w: 6, color: 'green' });
    P.group('heart'); const h = []; for (let i = 0; i <= 60; i++) { const t = i / 60 * Math.PI * 2; h.push([700 + 7 * 16 * Math.pow(Math.sin(t), 3) / 2.2, 1010 - 7 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 2.2]); }
    P.fill(h, { color: 'red' }); P.path(h, { w: 6, overshoot: false }); P.text('x1', 700, 1020, { size: 60 });
    P.group(null); P.stamp('NO POWERS...', 330, 470, { size: 78, color: 'graphite', rot: -0.04 }); P.stamp('ONE MORE LIFE!', 330, 1060, { size: 64, color: 'red', rot: 0.04 });
    return P;
  }, anim: (g, k, D) => g === 'heart' ? { ox: 700, oy: 1000, s: cl((k - D * 0.35) / (D * 0.15)) * (1 + 0.08 * Math.max(0, Math.sin(k * 7))) } : null, sfx: [{ f: 0.35, kind: 'beat' }, { f: 0.6, kind: 'beat' }] });

  // 2 the musician: a violin with notes floating up
  S.push({ draw: () => {
    const P = pen(103);
    P.group('violin');
    const b = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2; const wv = 1 - 0.22 * Math.pow(Math.cos(a), 2) * (Math.abs(Math.sin(a)) < 0.4 ? 1 : 0); b.push([420 + Math.cos(a) * 150 * wv, 880 + Math.sin(a) * 230]); }
    P.fill(b, { color: 'orange' }); P.path(b, { w: 6, overshoot: false });
    P.fill([[405, 470], [435, 470], [435, 820], [405, 820]], { color: '#3a2a1a' }); P.path([[405, 470], [435, 470], [435, 820], [405, 820], [405, 470]], { w: 4, overshoot: false });
    P.circle(420, 450, 26, { w: 5 }); P.curve([[355, 860], [370, 820], [362, 790]], { w: 5 }); P.curve([[485, 860], [470, 820], [478, 790]], { w: 5 });
    for (let i = -1; i <= 2; i++) P.line(412 + i * 6, 480, 412 + i * 6, 1040, { w: 2, color: 'graphite' });
    P.group('bow'); P.line(220, 1060, 760, 760, { w: 6, color: 'brown' }); P.line(230, 1075, 770, 775, { w: 2.5, color: 'cream' });
    P.group('notes'); note(P, 700, 600, 1.1); note(P, 820, 500, 0.9, 'purple'); note(P, 640, 460, 0.8, 'red');
    P.group(null); P.stamp('MUSICIAN', 650, 1170, { size: 90, color: 'purple', rot: -0.04 }); P.stamp('RUMBAR PIRATES', 500, 380, { size: 70, color: 'navy', rot: 0.03 });
    return P;
  }, anim: (g, k) => g === 'bow' ? { x: Math.sin(k * 5) * 60, y: -Math.sin(k * 5) * 33 } : g === 'notes' ? { y: -((k * 60) % 120), alpha: 1 - ((k * 60) % 120) / 160 } : g === 'violin' ? { ox: 420, oy: 1100, rot: Math.sin(k * 2.5) * 0.03 } : null, sfx: [{ f: 0.1, kind: 'swell' }] });

  // 3 the promise at Reverse Mountain: mountain, a lighthouse, a small whale spouting
  S.push({ draw: () => {
    const P = pen(104);
    const m = [[90, 900], [330, 470], [430, 560], [560, 420], [900, 900]]; P.fill(m, { color: '#9aa7b8' }); P.path(m, { w: 6 });
    P.fill([[330, 470], [300, 525], [360, 520]], { color: 'white' }); P.fill([[560, 420], [520, 490], [600, 485]], { color: 'white' });
    P.group('light'); const lh = [[760, 900], [780, 660], [830, 660], [850, 900]]; P.fill(lh, { color: 'white' }); P.path([...lh, lh[0]], { w: 5, overshoot: false });
    P.fill([[780, 740], [830, 740], [835, 790], [776, 790]], { color: 'red' }); P.fill([[770, 610], [840, 610], [840, 660], [770, 660]], { color: 'yellow' }); P.path([[770, 610], [840, 610], [840, 660], [770, 660], [770, 610]], { w: 5, overshoot: false });
    P.group('_beam'); P.fill([[840, 620], [960, 560], [960, 700]], { color: 'yellow', alpha: 0.5 });
    P.group(null); sea(P, 900);
    P.group('whale'); const w = [[220, 1040], [260, 980], [380, 970], [450, 1010], [500, 990], [490, 1040], [450, 1040], [380, 1080], [260, 1080]]; P.fill(w, { color: 'blue' }); P.path([...w, w[0]], { w: 5, overshoot: false }); P.fill(ellPoly(280, 1010, 8, 8), { color: 'navy' });
    P.curve([[330, 970], [320, 920], [300, 900]], { w: 5, color: 'sky' }); P.curve([[330, 970], [345, 915], [365, 900]], { w: 5, color: 'sky' });
    P.group(null); P.stamp('PROMISE', 650, 1170, { size: 90, color: 'red', rot: -0.04 }); P.stamp('REVERSE MOUNTAIN', 500, 380, { size: 66, color: 'navy', rot: 0.03 });
    return P;
  }, anim: (g, k) => g === 'whale' ? { ox: 350, oy: 1030, y: Math.sin(k * 2.5) * 12, rot: Math.sin(k * 2.5) * 0.04 } : g === '_beam' ? { alpha: 0.5 + 0.5 * Math.sin(k * 4) } : null, sfx: [{ f: 0.15, kind: 'whoosh' }] });

  // 4 died at sea, the soul sent back: a lone ship, a soul wisp rising from it
  S.push({ draw: () => {
    const P = pen(105);
    sea(P, 1000, 70, 950, '#4a6fa8');
    P.group('ship'); ship(P, 500, 960, 1.3, 'white');
    P.group('_soul'); wisp(P, 500, 700, 60);
    P.group(null); P.stamp('SOUL RETURNS', 500, 420, { size: 88, color: 'purple', rot: -0.04 });
    return P;
  }, anim: (g, k, D) => g === '_soul' ? { alpha: cl((k - D * 0.2) / (D * 0.15)), y: 120 - 160 * eio(cl((k - D * 0.2) / (D * 0.7))), x: Math.sin(k * 3) * 20 } : g === 'ship' ? { ox: 500, oy: 1000, rot: Math.sin(k * 2) * 0.04, y: Math.sin(k * 2.6) * 6 } : null, sfx: [{ f: 0.2, kind: 'swell' }] });

  // 5 lost in the fog: a big triangle of fog, a compass needle spinning
  S.push({ draw: () => {
    const P = pen(106);
    P.path([[500, 470], [880, 1080], [120, 1080], [500, 470]], { w: 6, color: 'navy' });
    P.group('compass'); P.circle(500, 840, 120, { w: 7 }); P.fill(ellPoly(500, 840, 115, 115), { color: 'cream' });
    P.text('N', 500, 755, { size: 40 });
    P.group('needle'); P.fill([[500, 740], [522, 840], [478, 840]], { color: 'red' }); P.fill([[500, 940], [522, 840], [478, 840]], { color: 'white' }); P.path([[500, 740], [522, 840], [500, 940], [478, 840], [500, 740]], { w: 4, overshoot: false });
    P.group('fogL'); fog(P, 250, 720, 170, 80, 1); fog(P, 230, 1000, 160, 70, 2);
    P.group('fogR'); fog(P, 760, 680, 170, 80, 3); fog(P, 780, 980, 160, 70, 4);
    P.group(null); P.stamp('LOST IN FOG', 500, 1180, { size: 86, color: 'graphite', rot: -0.04 }); P.stamp('FLORIAN TRIANGLE', 500, 400, { size: 64, color: 'navy', rot: 0.03 });
    return P;
  }, anim: (g, k) => g === 'needle' ? { ox: 500, oy: 840, rot: k * 4 + Math.sin(k * 7) } : g === 'fogL' ? { x: Math.sin(k * 0.9) * 40 } : g === 'fogR' ? { x: -Math.sin(k * 0.9) * 40 } : null, sfx: [{ f: 0.1, kind: 'whoosh' }] });

  // 6 nothing but bones, but strong roots: a pile of bones, a hardy plant with deep roots
  S.push({ draw: () => {
    const P = pen(107);
    P.group('bones'); bone(P, 140, 1000, 420, 940); bone(P, 180, 900, 400, 1050); bone(P, 260, 860, 300, 1060, 16);
    P.group(null); P.stamp('BONES...', 280, 1160, { size: 70, color: 'graphite', rot: -0.04 });
    P.line(560, 900, 940, 900, { w: 6, color: 'brown' }); P.fill([[560, 900], [940, 900], [940, 1120], [560, 1120]], { color: '#c9a36a', alpha: 0.6 });
    P.group('roots'); for (const [dx, dy] of [[-90, 180], [-30, 210], [40, 200], [100, 170]]) P.curve([[750, 905], [750 + dx * 0.4, 960], [750 + dx * 0.8, 1020], [750 + dx, 900 + dy]], { w: 6, color: 'brown' });
    P.group('plant'); P.line(750, 900, 750, 650, { w: 9, color: 'green' });
    const tuft = lumpPoly(750, 590, 120, 95, 0.18, 9); P.fill(tuft, { color: '#3a2a1a' }); P.path(tuft, { w: 6, overshoot: false });
    P.group(null); P.stamp('STRONG ROOTS!', 750, 450, { size: 76, color: 'green', rot: 0.04 });
    return P;
  }, anim: (g, k, D) => g === 'plant' ? { ox: 750, oy: 900, rot: Math.sin(k * 2.5) * 0.08, s: 0.85 + 0.15 * eout(cl(k / (D * 0.4))) } : g === 'roots' ? { ox: 750, oy: 905, s: 1 + 0.04 * Math.sin(k * 3) } : g === 'bones' ? { ox: 280, oy: 1000, rot: Math.sin(k * 6) * 0.01 } : null, sfx: [{ f: 0.15, kind: 'clink' }] });

  // 7 fifty years alone: a ghost ship with torn sails in fog, a calendar flipping to 50
  S.push({ draw: () => {
    const P = pen(108);
    sea(P, 1020, 70, 950, '#5a6a8a');
    P.group('ship'); ship(P, 360, 990, 1.6, '#c8c8d0', true);
    P.group('fog'); fog(P, 200, 1000, 140, 50, 5); fog(P, 600, 1040, 160, 50, 6);
    P.group('cal'); const c = [[640, 520], [900, 520], [900, 780], [640, 780]]; P.fill(c, { color: 'white' }); P.path([...c, c[0]], { w: 6, overshoot: false }); P.fill([[640, 520], [900, 520], [900, 575], [640, 575]], { color: 'purple' }); P.text('50', 770, 720, { size: 120 });
    P.group(null); P.stamp('50 YEARS ALONE', 500, 410, { size: 84, color: 'purple', rot: -0.04 });
    return P;
  }, anim: (g, k) => g === 'ship' ? { ox: 360, oy: 1030, rot: Math.sin(k * 1.6) * 0.05, x: Math.sin(k * 0.8) * 20 } : g === 'fog' ? { x: Math.sin(k * 1.1) * 50 } : g === 'cal' ? { ox: 770, oy: 520, rot: Math.sin(k * 3) * 0.05 } : null, sfx: [{ f: 0.1, kind: 'whoosh' }] });

  // 8 soul out: a top hat on a chair, a wisp flying loops around the room
  S.push({ draw: () => {
    const P = pen(109);
    const ch = [[300, 1100], [300, 820], [480, 820], [480, 1100]]; P.path([[300, 1100], [300, 640], [330, 640], [330, 840], [480, 840], [480, 1100]], { w: 7, color: 'brown' });
    P.fill([[300, 820], [500, 820], [500, 860], [300, 860]], { color: 'brown' });
    P.line(480, 860, 480, 1100, { w: 7, color: 'brown' });
    P.group('_soul'); wisp(P, 0, 0, 55);
    P.group(null); P.stamp('SOUL OUT!', 500, 420, { size: 110, color: 'purple', rot: -0.04 }); P.stamp('FLOAT AROUND', 680, 1180, { size: 60, color: 'navy', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => g === '_soul' ? { alpha: cl(k / (D * 0.1)), x: 620 + Math.cos(k * 1.4) * 230, y: 800 + Math.sin(k * 2.8) * 140 } : null, sfx: [{ f: 0.1, kind: 'whoosh' }, { f: 0.55, kind: 'whoosh' }] });

  // 9 chill of the underworld: a generic sword frosting over, ice crystals, snowflakes
  S.push({ draw: () => {
    const P = pen(110);
    P.group('sword'); P.fill([[490, 520], [510, 520], [516, 960], [484, 960]], { color: '#d9f1ff' }); P.path([[500, 470], [516, 520], [516, 960], [484, 960], [484, 520], [500, 470]], { w: 5, overshoot: false });
    P.fill([[420, 960], [580, 960], [580, 985], [420, 985]], { color: 'gold' }); P.path([[420, 960], [580, 960], [580, 985], [420, 985], [420, 960]], { w: 5, overshoot: false });
    P.fill([[488, 985], [512, 985], [512, 1100], [488, 1100]], { color: 'navy' });
    for (const [x, y, s] of [[470, 600, 1], [530, 700, 1.2], [470, 820, 0.9]]) { P.fill([[x, y], [x + 30 * s * (x < 500 ? -1 : 1), y - 40 * s], [x + 10 * s * (x < 500 ? -1 : 1), y + 20 * s]], { color: 'sky', alpha: 0.9 }); }
    P.group('flakes'); for (const [x, y, r] of [[230, 600, 50], [790, 640, 60], [260, 960, 40], [770, 1000, 46]]) { for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3; P.line(x - Math.cos(a) * r, y - Math.sin(a) * r, x + Math.cos(a) * r, y + Math.sin(a) * r, { w: 5, color: 'blue' }); } }
    P.group(null); P.stamp('FREEZE!', 500, 1180, { size: 110, color: 'blue', rot: -0.04 }); P.stamp('UNDERWORLD CHILL', 500, 400, { size: 64, color: 'purple', rot: 0.03 });
    return P;
  }, anim: (g, k) => g === 'flakes' ? { y: Math.sin(k * 1.5) * 20, rot: Math.sin(k * 0.8) * 0.03, ox: 500, oy: 800 } : g === 'sword' ? { ox: 500, oy: 1000, rot: Math.sin(k * 2) * 0.03 } : null, sfx: [{ f: 0.1, kind: 'zip' }] });

  // 10 Soul King + the cowboy hat: a crown over a microphone, a cowboy hat bouncing in
  S.push({ draw: () => {
    const P = pen(111);
    P.group('mic'); P.fill(ellPoly(330, 680, 80, 95), { color: 'gray' }); P.path(ellPoly(330, 680, 80, 95), { w: 6, overshoot: false });
    for (let i = -2; i <= 2; i++) P.line(260, 680 + i * 30, 400, 680 + i * 30, { w: 3, color: 'graphite' });
    P.fill([[310, 775], [350, 775], [340, 1050], [320, 1050]], { color: 'navy' });
    const cr = [[230, 560], [250, 460], [290, 520], [330, 430], [370, 520], [410, 460], [430, 560]]; P.fill(cr, { color: 'gold' }); P.path([...cr, cr[0]], { w: 5, overshoot: false });
    P.group(null); P.stamp('SOUL KING', 330, 1150, { size: 80, color: 'purple', rot: -0.04 });
    P.group('hat'); const brim = ellPoly(740, 860, 190, 50); P.fill(brim, { color: '#b8733a' }); P.path(brim, { w: 6, overshoot: false });
    const top = [[620, 850], [640, 700], [700, 680], [740, 720], [780, 680], [840, 700], [860, 850]]; P.fill(top, { color: '#b8733a' }); P.path(top, { w: 6, overshoot: false });
    P.fill([[630, 810], [850, 810], [855, 845], [625, 845]], { color: 'brown' });
    P.group(null); P.stamp('FIRST DRAFT?', 740, 1000, { size: 60, color: 'brown', rot: 0.05 }); P.stamp('ROCK STAR', 500, 380, { size: 80, color: 'red', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => g === 'hat' ? { ox: 740, oy: 860, y: -500 * (1 - eout(cl((k - D * 0.4) / (D * 0.2)))) + (k > D * 0.6 ? Math.abs(Math.sin(k * 4)) * -12 : 0), rot: Math.sin(k * 3) * 0.05 } : g === 'mic' ? { ox: 330, oy: 1050, rot: Math.sin(k * 3) * 0.04 } : null, sfx: [{ f: 0.05, kind: 'beat' }, { f: 0.5, kind: 'boing' }] });

  // 11 outro
  S.push({ draw: () => {
    const P = pen(112);
    P.group('fruit'); fruit(P, 360, 720, 170);
    P.group('q'); P.stamp('?', 770, 650, { size: 380, color: 'purple', rot: 0.12 });
    P.group(null);
    P.stamp('WHICH FRUIT NEXT?', 480, 1030, { size: 80, color: 'purple', rot: -0.03 });
    P.stamp('COMMENT!', 480, 1160, { size: 76, color: 'red', rot: 0.04 });
    return P;
  }, anim: (g, k) => g === 'fruit' ? { ox: 360, oy: 720, y: Math.sin(k * 3) * 14, rot: Math.sin(k * 2) * 0.06 } : g === 'q' ? { ox: 770, oy: 760, rot: Math.sin(k * 5) * 0.12 } : null, sfx: [] });

  globalThis.FRUIT_SCENES = S;
})();
