// Devil Fruit Files #5: Hie Hie no Mi. One sketch per narration line (same order as hie_hie.json).
// Original drawings: an original icy-blue fruit (colour nod only, no official pattern), generic objects, no characters.
(function () {
  const { pen, ellPoly } = globalThis.Sketch;
  const lumpPoly = (cx, cy, rx, ry, lump = 0.05, lumps = 6, rot = 0.3) => { const p = []; for (let i = 0; i <= 72; i++) { const a = rot + i / 72 * Math.PI * 2, r = 1 + lump * Math.sin(a * lumps); p.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } return p; };
  const starPoly = (cx, cy, r, n = 5, k = 0.45, rot = -Math.PI / 2) => { const p = []; for (let i = 0; i <= n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? r * k : r; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return p; };
  function sparkle(P, x, y, r, color = 'sky') { const s = starPoly(x, y, r, 4, 0.3, 0); P.fill(s, { color, alpha: 0.95, speed: 6 }); P.path(s, { w: 3.5, overshoot: false, speed: 3 }); }
  function snowflake(P, x, y, r, color = 'blue', w = 4) {
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3, ex = x + Math.cos(a) * r, ey = y + Math.sin(a) * r; P.line(x, y, ex, ey, { w, color, speed: 4 });
      const mx = x + Math.cos(a) * r * 0.6, my = y + Math.sin(a) * r * 0.6; for (const s of [-1, 1]) P.line(mx, my, mx + Math.cos(a + s * 0.7) * r * 0.3, my + Math.sin(a + s * 0.7) * r * 0.3, { w: w * 0.8, color, speed: 4 }); }
  }
  // a crystal shard: tall hexagon-ish spike
  function shard(P, x, by, w, h, c = '#bfe6ff') { const s = [[x - w / 2, by], [x - w / 2, by - h * 0.7], [x, by - h], [x + w / 2, by - h * 0.7], [x + w / 2, by]]; P.fill(s, { color: c, alpha: 0.9 }); P.path([...s, s[0]], { w: 5, color: 'navy', overshoot: false }); P.line(x, by - h, x, by - h * 0.2, { w: 3, color: 'white' }); }
  function flamePoly(cx, by, w, h, seed = 1) {
    const L = [], R = [];
    for (let i = 0; i <= 30; i++) { const u = i / 30, hw = w / 2 * (u < 0.25 ? Math.sqrt(u / 0.25) : Math.pow((1 - u) / 0.75, 1.25)) * (1 + 0.14 * Math.sin(u * 13 + seed)); const lean = Math.sin(u * 3 + seed) * w * 0.1 * u, y = by - u * h; L.push([cx + lean - hw, y]); R.push([cx + lean + hw, y]); }
    return [...L, ...R.reverse()];
  }
  function flame(P, cx, by, w, h, seed = 1) { const o = flamePoly(cx, by, w, h, seed); P.fill(o, { color: 'red', alpha: 0.9 }); P.fill(flamePoly(cx, by - h * 0.02, w * 0.7, h * 0.72, seed + 1), { color: 'orange' }); P.fill(flamePoly(cx, by - h * 0.04, w * 0.38, h * 0.42, seed + 2), { color: 'yellow' }); P.path(o, { w: 5, overshoot: false }); }
  // the original icy fruit: round lumpy body, pale blue, deep blue shade, white frost, curly stem, leaf
  function fruit(P, cx, cy, r, { sparkles = true } = {}) {
    const body = lumpPoly(cx, cy, r, r * 0.95, 0.05, 7);
    P.path(body, { w: 7, overshoot: false });
    P.curve([[cx - 4, cy - r * 0.88], [cx - 12, cy - r * 1.12], [cx + r * 0.05, cy - r * 1.3], [cx + r * 0.25, cy - r * 1.28]], { w: 8, color: 'brown' });
    const leaf = [[cx - 10, cy - r * 1.0], [cx - r * 0.4, cy - r * 1.35], [cx - r * 0.85, cy - r * 1.22], [cx - r * 0.62, cy - r * 1.0], [cx - 10, cy - r * 1.0]];
    P.curve(leaf, { w: 5.5 });
    P.fill(body, { color: '#9fd8ff', alpha: 0.95 });
    P.fill(ellPoly(cx + r * 0.25, cy + r * 0.32, r * 0.6, r * 0.48, -0.4, 2.2), { color: 'blue', alpha: 0.45 });
    P.fill(ellPoly(cx - r * 0.28, cy - r * 0.3, r * 0.45, r * 0.32), { color: 'white', alpha: 0.75 });
    P.fill(leaf.slice(0, 4), { color: 'green', alpha: 0.9 });
    P.line(cx - 14, cy - r * 1.02, cx - r * 0.62, cy - r * 1.17, { w: 3, alpha: 0.7 });
    for (const [dx, dy, s] of [[-0.45, -0.45, 0.07], [-0.3, -0.56, 0.045], [-0.53, -0.25, 0.04]]) P.fill(ellPoly(cx + dx * r, cy + dy * r, s * r, s * r * 0.8), { color: 'white', alpha: 0.95, speed: 6 });
    P.fill(ellPoly(cx + r * 0.1, cy + r * 1.04, r * 0.85, r * 0.13), { color: 'rgba(30,50,90,0.22)', alpha: 1, speed: 6 });
    if (sparkles) { sparkle(P, cx - r * 1.15, cy - r * 0.6, 26); sparkle(P, cx + r * 1.2, cy - r * 0.2, 20, 'white'); sparkle(P, cx + r * 0.95, cy + r * 0.85, 16); }
  }
  function sea(P, y0, x0 = 70, x1 = 950, color = 'sky') {
    const s = []; for (let i = 0; i <= 17; i++) s.push([x0 + i * (x1 - x0) / 17, y0 + Math.sin(i * 1.3) * 14]);
    P.curve(s, { w: 6, color: 'navy' }); P.fill([...s, [x1, 1245], [x0, 1245]], { color, alpha: 0.85 });
  }
  function ship(P, x, y, s = 1, sail = 'white') {
    const h = [[x - 100 * s, y], [x + 100 * s, y], [x + 70 * s, y + 45 * s], [x - 70 * s, y + 45 * s]];
    P.path([...h, h[0]], { w: 5, overshoot: false }); P.fill(h, { color: 'brown' });
    P.line(x, y, x, y - 120 * s, { w: 5 }); const sl = [[x + 4, y - 115 * s], [x + 70 * s, y - 60 * s], [x + 4, y - 20 * s]];
    P.fill(sl, { color: sail }); P.path(sl, { w: 4, overshoot: false });
  }

  const cl = (v) => Math.max(0, Math.min(1, v));
  const eio = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2), ein = (u) => u * u * u, eout = (u) => 1 - Math.pow(1 - u, 3);
  const flick = (k, a = 9, s = 0.06) => 1 + s * Math.sin(k * a) + s * 0.6 * Math.sin(k * a * 2.3 + 1);
  const S = [];

  // 0 intro: the fruit + its name, snowflakes around it
  S.push({ draw: () => {
    const P = pen(61);
    P.text('Hie Hie no Mi', 500, 390, { size: 112, speed: 3 });
    P.group('flakes'); for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, x = 500 + Math.cos(a) * 320, y = 800 + Math.sin(a) * 290; snowflake(P, x, y, 38); }
    P.group('fruit'); fruit(P, 500, 800, 200);
    P.group(null); P.stamp('ICE-ICE!', 500, 1160, { size: 84, color: 'blue', rot: -0.04 });
    return P;
  }, anim: (g, k) => g === 'flakes' ? { ox: 500, oy: 800, rot: k * 0.35 } : g === 'fruit' ? { ox: 500, oy: 800, y: Math.sin(k * 3) * 16, rot: Math.sin(k * 2.2) * 0.05 } : null, sfx: [{ f: 0.0, kind: 'swell' }] });

  // 1 logia: make, control, become ice
  S.push({ draw: () => {
    const P = pen(62);
    P.group('cube'); const c = [[140, 800], [280, 800], [280, 940], [140, 940]]; P.fill(c, { color: '#bfe6ff' }); P.path([...c, c[0]], { w: 6, color: 'navy', overshoot: false });
    P.path([[140, 800], [180, 760], [320, 760], [280, 800]], { w: 5, color: 'navy', overshoot: false }); P.fill([[140, 800], [180, 760], [320, 760], [280, 800]], { color: 'white' }); P.path([[320, 760], [320, 900], [280, 940]], { w: 5, color: 'navy', overshoot: false }); P.line(160, 830, 200, 820, { w: 4, color: 'white' });
    P.group(null); P.stamp('MAKE', 220, 1110, { size: 56, color: 'blue', rot: -0.05 });
    P.group('swirl'); const sw = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 4, r = 20 + i * 1.6; sw.push([520 + Math.cos(a) * r, 840 + Math.sin(a) * r * 0.9]); }
    P.curve(sw, { w: 14, color: 'sky' }); P.curve(sw, { w: 4, color: 'blue' }); snowflake(P, 520, 840, 22, 'navy', 3);
    P.group(null); P.stamp('CONTROL', 520, 1175, { size: 56, color: 'blue', rot: 0.04 });
    P.group('cry'); shard(P, 760, 1030, 90, 420); shard(P, 700, 1030, 60, 260, '#d9f1ff'); shard(P, 830, 1030, 60, 300, '#d9f1ff');
    P.group(null); P.stamp('BECOME!', 790, 1110, { size: 56, color: 'navy', rot: -0.04 });
    P.stamp('ICE', 500, 480, { size: 160, color: 'blue', rot: -0.03 });
    return P;
  }, anim: (g, k) => g === 'cube' ? { ox: 230, oy: 870, y: Math.sin(k * 3) * 10, rot: Math.sin(k * 2) * 0.05 } : g === 'swirl' ? { ox: 520, oy: 840, rot: k * 2 } : g === 'cry' ? { ox: 760, oy: 1030, sy: 1 + 0.04 * Math.sin(k * 4) } : null, sfx: [{ f: 0.05, kind: 'zip' }] });

  // 2 a marine admiral: a cap with an anchor badge, three gold stars, an anchor
  S.push({ draw: () => {
    const P = pen(63);
    P.group('cap'); const cap = [[260, 760], [300, 640], [500, 590], [700, 640], [740, 760]]; P.fill(cap, { color: 'white' }); P.path([...cap, cap[0]], { w: 6, overshoot: false });
    const band = [[260, 760], [740, 760], [740, 820], [260, 820]]; P.fill(band, { color: 'navy' }); P.path([...band, band[0]], { w: 6, overshoot: false });
    const peak = [[250, 820], [750, 820], [680, 880], [320, 880]]; P.fill(peak, { color: '#20202a' }); P.path([...peak, peak[0]], { w: 6, overshoot: false });
    P.circle(500, 690, 42, { w: 5, color: 'gold' }); P.line(500, 660, 500, 720, { w: 5, color: 'gold' }); P.curve([[470, 705], [500, 728], [530, 705]], { w: 5, color: 'gold' }); P.line(482, 668, 518, 668, { w: 5, color: 'gold' });
    P.group('stars'); for (let i = 0; i < 3; i++) { const s = starPoly(350 + i * 150, 1010, 50); P.fill(s, { color: 'gold' }); P.path(s, { w: 5, overshoot: false }); }
    P.group(null); P.stamp('ADMIRAL', 500, 470, { size: 120, color: 'blue', rot: -0.04 }); P.stamp('MARINE', 500, 1160, { size: 70, color: 'navy', rot: 0.03 });
    return P;
  }, anim: (g, k) => g === 'cap' ? { ox: 500, oy: 760, rot: Math.sin(k * 2) * 0.04, y: Math.sin(k * 3) * 8 } : g === 'stars' ? { ox: 500, oy: 1010, s: 1 + 0.06 * Math.sin(k * 5) } : null, sfx: [{ f: 0.05, kind: 'beat' }] });

  // 3 english attack names: an ice sword, ice spears, a frozen clock
  S.push({ draw: () => {
    const P = pen(64);
    P.group('saber'); const bl = [[200, 1000], [230, 520], [260, 470], [290, 520], [320, 1000]]; P.fill(bl, { color: '#bfe6ff' }); P.path([...bl, bl[0]], { w: 5, color: 'navy', overshoot: false }); P.line(260, 500, 260, 960, { w: 3, color: 'white' });
    P.line(180, 1010, 340, 1010, { w: 12, color: 'navy' }); P.line(260, 1015, 260, 1100, { w: 14, color: 'navy' });
    P.group(null); P.text('Ice Saber', 260, 1170, { size: 60, color: 'navy' });
    P.group('sp'); for (let i = 0; i < 3; i++) { const x = 430 + i * 70, y0 = 1000 - i * 30; const t = [[x - 18, y0], [x, y0 - 360], [x + 18, y0]]; P.fill(t, { color: '#d9f1ff' }); P.path([...t, t[0]], { w: 4.5, color: 'navy', overshoot: false }); }
    P.group(null); P.text('Partisan', 500, 1170, { size: 60, color: 'navy' });
    P.group('clock'); P.fill(ellPoly(790, 780, 120, 120), { color: 'cream' }); P.circle(790, 780, 120, { w: 6 }); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; P.line(790 + Math.cos(a) * 100, 780 + Math.sin(a) * 100, 790 + Math.cos(a) * 112, 780 + Math.sin(a) * 112, { w: 4 }); }
    P.line(790, 780, 790, 700, { w: 6 }); P.line(790, 780, 850, 800, { w: 5 });
    P.fill(lumpPoly(790, 780, 150, 145, 0.08, 6), { color: 'rgba(150,210,255,0.45)' }); P.path(lumpPoly(790, 780, 150, 145, 0.08, 6), { w: 4, color: 'blue', overshoot: false });
    P.group(null); P.text('Ice Time', 790, 1000, { size: 60, color: 'navy' });
    P.stamp('ENGLISH NAMES!', 500, 420, { size: 72, color: 'red', rot: -0.04 });
    return P;
  }, anim: (g, k, D) => g === 'saber' ? { ox: 260, oy: 1060, rot: Math.sin(k * 2.5) * 0.12 } : g === 'sp' ? { y: -30 * eout(cl(k / (D * 0.4))) + Math.sin(k * 4) * 6 } : g === 'clock' ? { ox: 790, oy: 780, s: 1 + 0.03 * Math.sin(k * 3) } : null, sfx: [{ f: 0.1, kind: 'zip' }] });

  // 4 frozen solid: a rubber ball frozen in a block of ice
  S.push({ draw: () => {
    const P = pen(65);
    P.group('ball'); P.fill(ellPoly(500, 780, 120, 120), { color: 'red' }); P.circle(500, 780, 120, { w: 6 }); P.fill(ellPoly(460, 740, 40, 30), { color: 'pink', alpha: 0.8 });
    P.curve([[380, 780], [500, 830], [620, 780]], { w: 5, alpha: 0.6 });
    P.group('_ice'); const blk = [[300, 980], [300, 580], [680, 580], [680, 980]]; P.fill(blk, { color: 'rgba(150,210,255,0.6)' }); P.path([...blk, blk[0]], { w: 7, color: 'navy', overshoot: false });
    P.path([[300, 580], [360, 520], [740, 520], [680, 580]], { w: 6, color: 'navy', overshoot: false }); P.fill([[300, 580], [360, 520], [740, 520], [680, 580]], { color: '#e6f6ff' }); P.path([[740, 520], [740, 920], [680, 980]], { w: 6, color: 'navy', overshoot: false });
    P.line(330, 620, 420, 600, { w: 6, color: 'white' }); P.line(330, 660, 380, 650, { w: 5, color: 'white' });
    snowflake(P, 230, 560, 34); snowflake(P, 820, 700, 30); snowflake(P, 790, 1000, 26);
    P.stamp('FROZEN SOLID!', 500, 1120, { size: 76, color: 'blue', rot: -0.04 });
    P.group(null); P.stamp('BRRR', 220, 420, { size: 70, color: 'navy', rot: -0.1 });
    return P;
  }, anim: (g, k, D) => { const v = cl((k - D * 0.3) / (D * 0.12)); if (g === 'ball') return v > 0 ? { ox: 500, oy: 780 } : { ox: 500, oy: 900, y: -Math.abs(Math.sin(k * 6)) * 80, sy: 1 - 0.1 * Math.max(0, Math.cos(k * 6)) }; if (g === '_ice') return { ox: 500, oy: 780, s: 0.6 + 0.4 * eout(v), alpha: v }; return null; }, sfx: [{ f: 0.3, kind: 'zip' }] });

  // 5 marineford: two tidal waves frozen in place, the bay frozen, ships stuck
  S.push({ draw: () => {
    const P = pen(66);
    P.fill([[70, 340], [950, 340], [950, 900], [70, 900]], { color: 'rgba(200,230,255,0.4)', speed: 4 });
    sea(P, 900, 70, 950, '#cfeaff');
    for (let i = 0; i < 8; i++) P.line(100 + i * 110, 960 + (i % 3) * 60, 160 + i * 110, 940 + (i % 3) * 60, { w: 3, color: 'white' });
    P.group('w1'); const w1 = [[90, 900], [110, 700], [180, 520], [300, 440], [380, 470], [330, 520], [300, 600], [330, 900]]; P.fill(w1, { color: '#a8dcff' }); P.curve(w1, { w: 6, color: 'navy' }); shard(P, 200, 900, 40, 120); shard(P, 260, 900, 30, 90);
    P.group('w2'); const w2 = [[930, 900], [910, 700], [840, 520], [720, 440], [640, 470], [690, 520], [720, 600], [690, 900]]; P.fill(w2, { color: '#a8dcff' }); P.curve(w2, { w: 6, color: 'navy' }); shard(P, 820, 900, 40, 120); shard(P, 760, 900, 30, 90);
    P.group('ships'); ship(P, 510, 980, 0.6); ship(P, 400, 1120, 0.5); ship(P, 640, 1110, 0.5);
    P.group(null); P.stamp('ICE AGE!', 510, 700, { size: 110, color: 'blue', rot: -0.05 });
    return P;
  }, anim: (g, k, D) => { const u = eout(cl(k / (D * 0.3))); if (g === 'w1') return { ox: 200, oy: 900, sy: 0.7 + 0.3 * u, rot: 0.08 * (1 - u) }; if (g === 'w2') return { ox: 820, oy: 900, sy: 0.7 + 0.3 * u, rot: -0.08 * (1 - u) }; if (g === 'ships') return { x: Math.sin(k * 30) * 2 * (k > D * 0.3 ? 1 : 0) }; return null; }, sfx: [{ f: 0.3, kind: 'zip' }] });

  // 6 ice vs magma, ten days: a block of ice pushing against a lump of magma, a ten-day calendar
  S.push({ draw: () => {
    const P = pen(67);
    P.group('ice'); shard(P, 220, 1000, 110, 380); shard(P, 310, 1000, 80, 260, '#d9f1ff'); shard(P, 150, 1000, 70, 220, '#d9f1ff');
    P.group('mag'); const m = lumpPoly(730, 870, 170, 150, 0.1, 7); P.fill(m, { color: '#7a1d12' }); P.path(m, { w: 7, overshoot: false }); P.fill(ellPoly(700, 840, 100, 80), { color: '#c4361f', alpha: 0.8 });
    for (const pts of [[[640, 800], [690, 850], [670, 900]], [[760, 760], [800, 820], [860, 840]]]) { P.curve(pts, { w: 10, color: 'orange' }); P.curve(pts, { w: 4, color: 'yellow' }); }
    P.group(null); P.stamp('VS', 480, 880, { size: 130, color: 'red', rot: -0.06 });
    P.group('cal'); const c = [[380, 380], [620, 380], [620, 600], [380, 600]]; P.fill(c, { color: 'white' }); P.path([...c, c[0]], { w: 6, overshoot: false }); P.fill([[380, 380], [620, 380], [620, 430], [380, 430]], { color: 'red' }); P.text('10 DAYS', 500, 520, { size: 64 });
    P.group(null); P.stamp('ICE', 230, 1110, { size: 70, color: 'blue' }); P.stamp('MAGMA', 740, 1110, { size: 70, color: '#a32616' });
    return P;
  }, anim: (g, k) => g === 'ice' ? { ox: 220, oy: 1000, x: 20 * Math.sin(k * 3) } : g === 'mag' ? { ox: 730, oy: 870, x: -20 * Math.sin(k * 3), s: 1 + 0.04 * Math.sin(k * 6) } : g === 'cal' ? { ox: 500, oy: 380, rot: Math.sin(k * 5) * 0.05 } : null, sfx: [{ f: 0.1, kind: 'thud' }, { f: 0.5, kind: 'thud' }] });

  // 7 punk hazard: an island half frozen and half burning
  S.push({ draw: () => {
    const P = pen(68);
    sea(P, 1000);
    const isl = [[150, 1000], [220, 820], [400, 740], [600, 740], [780, 820], [850, 1000]]; P.curve(isl, { w: 7 });
    P.fill([[150, 1000], [220, 820], [400, 740], [500, 740], [500, 1000]], { color: '#d9f1ff' }); P.fill([[500, 740], [600, 740], [780, 820], [850, 1000], [500, 1000]], { color: '#e0754a' });
    P.line(500, 720, 500, 1010, { w: 5, alpha: 0.6 });
    P.group('ice'); shard(P, 290, 820, 50, 170); shard(P, 380, 770, 40, 130); shard(P, 220, 900, 40, 110);
    P.group('fire'); flame(P, 620, 790, 80, 160, 2); flame(P, 720, 850, 70, 130, 5); flame(P, 800, 940, 60, 110, 8);
    P.group('snow'); for (const [x, y] of [[150, 480], [270, 600], [380, 470], [200, 690]]) snowflake(P, x, y, 22);
    P.group(null); P.stamp('HALF ICE', 280, 1130, { size: 64, color: 'blue', rot: -0.04 }); P.stamp('HALF FIRE', 720, 1130, { size: 64, color: 'red', rot: 0.04 });
    P.stamp('PUNK HAZARD', 520, 450, { size: 70, color: 'graphite', rot: 0.04 });
    return P;
  }, anim: (g, k) => g === 'fire' ? { ox: 700, oy: 900, sy: flick(k, 8, 0.06) } : g === 'snow' ? { y: (k * 40) % 80, x: Math.sin(k * 2) * 10 } : g === 'ice' ? { ox: 300, oy: 820, s: 1 + 0.02 * Math.sin(k * 4) } : null, sfx: [{ f: 0.05, kind: 'whoosh' }] });

  // 8 a leg made of ice; he quits: an ice boot, and a resignation letter that flies off
  S.push({ draw: () => {
    const P = pen(69);
    P.group('leg'); const lg = [[250, 520], [350, 520], [350, 960], [450, 1000], [450, 1060], [230, 1060], [250, 960]]; P.fill(lg, { color: '#bfe6ff' }); P.path([...lg, lg[0]], { w: 6, color: 'navy', overshoot: false });
    P.line(280, 560, 280, 940, { w: 4, color: 'white' }); for (const y of [640, 760, 880]) P.line(250, y, 350, y + 10, { w: 3, color: 'blue' }); snowflake(P, 300, 470, 30);
    P.group(null); P.stamp('ICE LEG', 300, 1150, { size: 70, color: 'blue', rot: -0.04 });
    P.group('letter'); const lt = [[560, 640], [860, 610], [880, 860], [580, 890]]; P.fill(lt, { color: 'cream' }); P.path([...lt, lt[0]], { w: 6, overshoot: false });
    P.text('I QUIT', 720, 700, { size: 56, rot: -0.08 }); for (let i = 0; i < 3; i++) P.line(610, 760 + i * 35, 840, 740 + i * 35, { w: 3, alpha: 0.6 });
    P.group(null); P.stamp('GOODBYE, MARINES', 600, 1050, { size: 52, color: 'red', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => { if (g === 'leg') return { ox: 300, oy: 1060, rot: Math.sin(k * 2) * 0.02 }; if (g === 'letter') { const u = ein(cl((k - D * 0.45) / (D * 0.5))); return { ox: 720, oy: 750, x: 600 * u, y: -500 * u + Math.sin(k * 3) * 10, rot: u * 2 }; } return null; }, sfx: [{ f: 0.5, kind: 'flap' }] });

  // 9 bicycle on a road of ice across the ocean
  S.push({ draw: () => {
    const P = pen(70);
    P.group('sun'); P.fill(ellPoly(820, 460, 60, 60), { color: 'yellow' }); P.circle(820, 460, 60, { w: 5 });
    P.group(null); sea(P, 880);
    P.group('road'); const rd = [[70, 960], [950, 960], [950, 1000], [70, 1000]]; P.fill(rd, { color: '#e6f6ff' }); P.path([...rd, rd[0]], { w: 5, color: 'navy', overshoot: false }); for (let i = 0; i < 9; i++) P.line(100 + i * 100, 975, 150 + i * 100, 985, { w: 3, color: 'sky' });
    P.group('bike'); const bx = 330, by = 900;
    P.circle(bx - 110, by, 60, { w: 7 }); P.circle(bx + 110, by, 60, { w: 7 }); P.circle(bx - 110, by, 8, { w: 5 }); P.circle(bx + 110, by, 8, { w: 5 });
    P.path([[bx - 110, by], [bx - 20, by], [bx + 40, by - 90], [bx - 60, by - 90], [bx - 110, by]], { w: 7, color: 'blue', overshoot: false }); P.line(bx - 20, by, bx - 70, by - 110, { w: 7, color: 'blue' }); P.line(bx + 40, by - 90, bx + 110, by, { w: 7, color: 'blue' });
    P.line(bx - 95, by - 115, bx - 45, by - 115, { w: 10 }); P.line(bx + 40, by - 90, bx + 55, by - 140, { w: 6 }); P.line(bx + 35, by - 140, bx + 80, by - 140, { w: 7 });
    P.group(null); P.stamp('ICE ROAD!', 500, 560, { size: 100, color: 'blue', rot: -0.05 });
    snowflake(P, 160, 450, 26); snowflake(P, 600, 420, 22);
    return P;
  }, anim: (g, k, D) => g === 'bike' ? { x: 330 * eio(cl(k / D)), y: Math.sin(k * 10) * 3 } : g === 'sun' ? { ox: 820, oy: 460, s: 1 + 0.05 * Math.sin(k * 3) } : null, sfx: [{ f: 0.1, kind: 'whoosh' }] });

  // 10 ten titanic captains: ten ships in a fleet, one with a frosty blue sail
  S.push({ draw: () => {
    const P = pen(71);
    P.fill([[70, 340], [950, 340], [950, 860], [70, 860]], { color: 'rgba(120,100,160,0.3)', speed: 4 });
    sea(P, 860, 70, 950, '#5a7fb8');
    P.group('back'); for (let i = 0; i < 5; i++) ship(P, 160 + i * 175, 820, 0.55, '#3a3344');
    P.group('front'); for (let i = 0; i < 4; i++) ship(P, 180 + i * 160, 1000, 0.7, '#3a3344'); ship(P, 820, 1010, 0.8, '#bfe6ff');
    P.group(null); snowflake(P, 850, 880, 22, 'navy');
    P.stamp('10', 500, 440, { size: 140, color: 'red', rot: -0.08 }); P.stamp('TITANIC CAPTAINS', 500, 570, { size: 62, color: 'graphite', rot: -0.03 });
    P.stamp('BLACKBEARD PIRATES', 500, 1170, { size: 54, color: 'purple', rot: 0.02 });
    return P;
  }, anim: (g, k) => g === 'back' ? { y: Math.sin(k * 2.5) * 6 } : g === 'front' ? { y: Math.sin(k * 3 + 1) * 9, rot: Math.sin(k * 2) * 0.01, ox: 500, oy: 1000 } : null, sfx: [{ f: 0.05, kind: 'beat' }] });

  // 11 outro
  S.push({ draw: () => {
    const P = pen(72);
    P.group('fruit'); fruit(P, 360, 720, 170);
    P.group('q'); P.stamp('?', 770, 650, { size: 380, color: 'blue', rot: 0.12 });
    P.group(null);
    P.stamp('WHICH FRUIT NEXT?', 480, 1030, { size: 80, color: 'purple', rot: -0.03 });
    P.stamp('COMMENT!', 480, 1160, { size: 76, color: 'red', rot: 0.04 });
    return P;
  }, anim: (g, k) => g === 'fruit' ? { ox: 360, oy: 720, y: Math.sin(k * 3) * 14, rot: Math.sin(k * 2) * 0.06 } : g === 'q' ? { ox: 770, oy: 760, rot: Math.sin(k * 5) * 0.12 } : null, sfx: [] });

  globalThis.FRUIT_SCENES = S;
})();
