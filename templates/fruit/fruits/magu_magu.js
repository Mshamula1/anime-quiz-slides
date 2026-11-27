// Devil Fruit Files #7: Magu Magu no Mi. One sketch per narration line (same order as magu_magu.json).
// Original drawings: an original red-orange lava fruit (colour nod only, no official pattern), generic objects, no characters.
(function () {
  const { pen, ellPoly } = globalThis.Sketch;
  const lumpPoly = (cx, cy, rx, ry, lump = 0.05, lumps = 6, rot = 0.3) => { const p = []; for (let i = 0; i <= 72; i++) { const a = rot + i / 72 * Math.PI * 2, r = 1 + lump * Math.sin(a * lumps); p.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } return p; };
  const starPoly = (cx, cy, r, n = 5, k = 0.45, rot = -Math.PI / 2) => { const p = []; for (let i = 0; i <= n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? r * k : r; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return p; };
  function sparkle(P, x, y, r, color = 'yellow') { const s = starPoly(x, y, r, 4, 0.3, 0); P.fill(s, { color, alpha: 0.95, speed: 6 }); P.path(s, { w: 3.5, overshoot: false, speed: 3 }); }
  function flamePoly(cx, by, w, h, seed = 1) {
    const L = [], R = [];
    for (let i = 0; i <= 30; i++) { const u = i / 30, hw = w / 2 * (u < 0.25 ? Math.sqrt(u / 0.25) : Math.pow((1 - u) / 0.75, 1.25)) * (1 + 0.14 * Math.sin(u * 13 + seed)); const lean = Math.sin(u * 3 + seed) * w * 0.1 * u, y = by - u * h; L.push([cx + lean - hw, y]); R.push([cx + lean + hw, y]); }
    return [...L, ...R.reverse()];
  }
  function flame(P, cx, by, w, h, seed = 1) { const o = flamePoly(cx, by, w, h, seed); P.fill(o, { color: 'red', alpha: 0.9 }); P.fill(flamePoly(cx, by - h * 0.02, w * 0.7, h * 0.72, seed + 1), { color: 'orange' }); P.fill(flamePoly(cx, by - h * 0.04, w * 0.38, h * 0.42, seed + 2), { color: 'yellow' }); P.path(o, { w: 5, overshoot: false }); }
  function shard(P, x, by, w, h, c = '#bfe6ff') { const s = [[x - w / 2, by], [x - w / 2, by - h * 0.7], [x, by - h], [x + w / 2, by - h * 0.7], [x + w / 2, by]]; P.fill(s, { color: c, alpha: 0.9 }); P.path([...s, s[0]], { w: 5, color: 'navy', overshoot: false }); P.line(x, by - h, x, by - h * 0.2, { w: 3, color: 'white' }); }
  // a glowing crack line in dark crust
  function crack(P, pts) { P.curve(pts, { w: 11, color: 'orange' }); P.curve(pts, { w: 4, color: 'yellow' }); }
  // a lump of magma: dark crust, red body, glowing cracks
  function magma(P, cx, cy, rx, ry, seed = 1) {
    const m = lumpPoly(cx, cy, rx, ry, 0.1, 7, seed); P.fill(m, { color: '#7a1d12' }); P.path(m, { w: 7, overshoot: false });
    P.fill(ellPoly(cx - rx * 0.15, cy - ry * 0.15, rx * 0.6, ry * 0.5), { color: '#c4361f', alpha: 0.85 });
    crack(P, [[cx - rx * 0.6, cy - ry * 0.2], [cx - rx * 0.2, cy + ry * 0.1], [cx - rx * 0.3, cy + ry * 0.5]]);
    crack(P, [[cx + rx * 0.1, cy - ry * 0.6], [cx + rx * 0.3, cy - ry * 0.1], [cx + rx * 0.65, cy + ry * 0.05]]);
  }
  // a fist of magma (rounded block with knuckle bumps)
  function fist(P, cx, cy, s = 1) {
    const b = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2, r = 1 + (Math.sin(a) < -0.3 ? 0.08 * Math.abs(Math.sin(a * 8)) : 0); b.push([cx + Math.cos(a) * 80 * s * r, cy + Math.sin(a) * 66 * s * r]); }
    P.fill(b, { color: '#c4361f' }); P.path(b, { w: 6, overshoot: false });
    for (let i = 0; i < 4; i++) P.curve([[cx - 55 * s + i * 36 * s, cy - 50 * s], [cx - 50 * s + i * 36 * s, cy - 10 * s]], { w: 4 });
    crack(P, [[cx - 40 * s, cy + 15 * s], [cx, cy + 30 * s], [cx + 45 * s, cy + 20 * s]]);
    for (let i = 0; i < 3; i++) P.line(cx - 40 * s + i * 40 * s, cy - 80 * s, cx - 50 * s + i * 40 * s, cy - 160 * s, { w: 6, color: 'orange', alpha: 0.8 });
  }
  function volcano(P, cx, by, w, h) {
    const v = [[cx - w / 2, by], [cx - w * 0.12, by - h], [cx + w * 0.12, by - h], [cx + w / 2, by]]; P.fill(v, { color: '#5a3a2e' }); P.path(v, { w: 6, overshoot: false });
    const lava = [[cx - w * 0.12, by - h], [cx + w * 0.12, by - h], [cx + w * 0.05, by - h * 0.6], [cx + w * 0.1, by - h * 0.3], [cx - w * 0.02, by - h * 0.35], [cx - w * 0.06, by - h * 0.7]];
    P.fill(lava, { color: 'orange' }); P.path([...lava, lava[0]], { w: 4, color: 'red', overshoot: false });
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
  function paw(P, x, y, r, color = 'red') {
    P.fill(ellPoly(x, y + r * 0.3, r * 0.75, r * 0.6), { color }); P.path(ellPoly(x, y + r * 0.3, r * 0.75, r * 0.6), { w: 4, overshoot: false });
    for (const [dx, dy] of [[-0.75, -0.45], [-0.27, -0.85], [0.27, -0.85], [0.75, -0.45]]) { const t = ellPoly(x + dx * r, y + dy * r, r * 0.24, r * 0.3); P.fill(t, { color }); P.path(t, { w: 3.5, overshoot: false }); }
  }
  // the original lava fruit: round lumpy body, red-orange, dark crust swirls, glowing cracks, curly stem, leaf
  function fruit(P, cx, cy, r, { sparkles = true } = {}) {
    const body = lumpPoly(cx, cy, r, r * 0.95, 0.06, 6);
    P.path(body, { w: 7, overshoot: false });
    P.curve([[cx - 4, cy - r * 0.88], [cx - 12, cy - r * 1.12], [cx + r * 0.05, cy - r * 1.3], [cx + r * 0.25, cy - r * 1.28]], { w: 8, color: 'brown' });
    const leaf = [[cx - 10, cy - r * 1.0], [cx - r * 0.4, cy - r * 1.35], [cx - r * 0.85, cy - r * 1.22], [cx - r * 0.62, cy - r * 1.0], [cx - 10, cy - r * 1.0]];
    P.curve(leaf, { w: 5.5 });
    P.fill(body, { color: '#e2502a', alpha: 0.95 });
    P.fill(ellPoly(cx + r * 0.25, cy + r * 0.32, r * 0.6, r * 0.48, -0.4, 2.2), { color: '#7a1d12', alpha: 0.55 });
    crack(P, [[cx - r * 0.7, cy + r * 0.1], [cx - r * 0.3, cy + r * 0.25], [cx - r * 0.1, cy + r * 0.6]]);
    crack(P, [[cx + r * 0.05, cy - r * 0.2], [cx + r * 0.4, cy - r * 0.05], [cx + r * 0.75, cy + r * 0.25]]);
    P.fill(ellPoly(cx - r * 0.3, cy - r * 0.35, r * 0.4, r * 0.26), { color: 'yellow', alpha: 0.6 });
    P.fill(leaf.slice(0, 4), { color: 'green', alpha: 0.9 });
    P.line(cx - 14, cy - r * 1.02, cx - r * 0.62, cy - r * 1.17, { w: 3, alpha: 0.7 });
    P.fill(ellPoly(cx + r * 0.1, cy + r * 1.04, r * 0.85, r * 0.13), { color: 'rgba(60,20,10,0.22)', alpha: 1, speed: 6 });
    if (sparkles) { sparkle(P, cx - r * 1.15, cy - r * 0.6, 26); sparkle(P, cx + r * 1.2, cy - r * 0.2, 20, 'orange'); sparkle(P, cx + r * 0.95, cy + r * 0.85, 16); }
  }
  function ember(P, x, y, r) { const e = ellPoly(x, y, r, r * 1.2); P.fill(e, { color: 'orange', speed: 6 }); P.fill(ellPoly(x, y, r * 0.5, r * 0.6), { color: 'yellow', speed: 6 }); }

  const cl = (v) => Math.max(0, Math.min(1, v));
  const eio = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2), ein = (u) => u * u * u, eout = (u) => 1 - Math.pow(1 - u, 3);
  const flick = (k, a = 9, s = 0.06) => 1 + s * Math.sin(k * a) + s * 0.6 * Math.sin(k * a * 2.3 + 1);
  const S = [];

  // 0 intro: the fruit + its name, embers circling
  S.push({ draw: () => {
    const P = pen(81);
    P.text('Magu Magu no Mi', 500, 390, { size: 104, speed: 3 });
    P.group('embers'); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, x = 500 + Math.cos(a) * 320, y = 800 + Math.sin(a) * 290; ember(P, x, y, 18 + (i % 3) * 6); }
    P.group('fruit'); fruit(P, 500, 800, 200);
    P.group(null); P.stamp('MAGMA-MAGMA!', 500, 1160, { size: 84, color: 'red', rot: -0.04 });
    return P;
  }, anim: (g, k) => g === 'embers' ? { ox: 500, oy: 800, rot: k * 0.35 } : g === 'fruit' ? { ox: 500, oy: 800, y: Math.sin(k * 3) * 16, rot: Math.sin(k * 2.2) * 0.05, s: 1 + 0.02 * Math.sin(k * 7) } : null, sfx: [{ f: 0.0, kind: 'swell' }] });

  // 1 logia: make, control, become magma
  S.push({ draw: () => {
    const P = pen(82);
    P.group('blob'); magma(P, 210, 880, 100, 80, 1);
    P.group(null); P.stamp('MAKE', 220, 1110, { size: 56, color: 'red', rot: -0.05 });
    P.group('swirl'); const sw = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 4, r = 20 + i * 1.6; sw.push([520 + Math.cos(a) * r, 860 + Math.sin(a) * r * 0.9]); }
    P.curve(sw, { w: 16, color: 'orange' }); P.curve(sw, { w: 5, color: 'red' });
    P.group(null); P.stamp('CONTROL', 520, 1175, { size: 56, color: 'red', rot: 0.04 });
    P.group('vol'); volcano(P, 800, 1030, 260, 300);
    P.group('_puff'); for (const [x, y, r] of [[800, 690, 40], [770, 630, 30], [830, 600, 26]]) { P.fill(ellPoly(x, y, r, r), { color: 'gray', alpha: 0.6 }); P.circle(x, y, r, { w: 4 }); }
    P.group(null); P.stamp('BECOME!', 800, 1110, { size: 56, color: '#7a1d12', rot: -0.04 });
    P.stamp('MAGMA', 500, 480, { size: 150, color: 'red', rot: -0.03 });
    return P;
  }, anim: (g, k, D) => g === 'blob' ? { ox: 210, oy: 880, sx: 1 + 0.06 * Math.sin(k * 4), sy: 1 - 0.06 * Math.sin(k * 4) } : g === 'swirl' ? { ox: 520, oy: 860, rot: k * 2 } : g === 'vol' ? { ox: 800, oy: 1030, x: Math.sin(k * 25) * 2 } : g === '_puff' ? { ox: 800, oy: 700, alpha: cl((k - D * 0.15) / (D * 0.1)), y: -40 * cl(k / D), s: 0.8 + 0.3 * cl(k / D) } : null, sfx: [{ f: 0.05, kind: 'zip' }] });

  // 2 a marine officer called "Red Dog": an officer's cap with an anchor badge, red paw prints
  S.push({ draw: () => {
    const P = pen(83);
    P.group('cap'); const cap = [[260, 760], [300, 640], [500, 590], [700, 640], [740, 760]]; P.fill(cap, { color: 'white' }); P.path([...cap, cap[0]], { w: 6, overshoot: false });
    const band = [[260, 760], [740, 760], [740, 820], [260, 820]]; P.fill(band, { color: 'navy' }); P.path([...band, band[0]], { w: 6, overshoot: false });
    const peak = [[250, 820], [750, 820], [680, 880], [320, 880]]; P.fill(peak, { color: '#20202a' }); P.path([...peak, peak[0]], { w: 6, overshoot: false });
    P.circle(500, 690, 42, { w: 5, color: 'gold' }); P.line(500, 660, 500, 720, { w: 5, color: 'gold' }); P.curve([[470, 705], [500, 728], [530, 705]], { w: 5, color: 'gold' }); P.line(482, 668, 518, 668, { w: 5, color: 'gold' });
    P.group('paws'); paw(P, 230, 1000, 50); paw(P, 400, 1060, 50); paw(P, 600, 1000, 50); paw(P, 770, 1060, 50);
    P.group(null); P.stamp('RED DOG', 500, 460, { size: 130, color: 'red', rot: -0.04 }); P.stamp('MARINE', 500, 1180, { size: 64, color: 'navy', rot: 0.03 });
    return P;
  }, anim: (g, k) => g === 'cap' ? { ox: 500, oy: 760, rot: Math.sin(k * 2) * 0.04, y: Math.sin(k * 3) * 8 } : g === 'paws' ? { ox: 500, oy: 1030, s: 1 + 0.05 * Math.sin(k * 5) } : null, sfx: [{ f: 0.05, kind: 'beat' }] });

  // 3 three colour-and-animal names: three cards, a red paw, a blue feather, a yellow banana
  S.push({ draw: () => {
    const P = pen(84);
    const card = (x, col) => { const c = [[x - 130, 600], [x + 130, 600], [x + 130, 960], [x - 130, 960]]; P.fill(c, { color: col, alpha: 0.35 }); P.path([...c, c[0]], { w: 6, overshoot: false }); };
    P.group('c1'); card(200, 'red'); paw(P, 200, 780, 70);
    P.group('c2'); card(500, 'blue'); const fe = [[440, 900], [470, 760], [520, 660], [560, 640], [545, 720], [510, 820], [440, 900]]; P.fill(fe, { color: 'blue' }); P.curve(fe, { w: 5 }); P.curve([[430, 920], [480, 800], [550, 650]], { w: 4, color: 'white' });
    P.group('c3'); card(800, 'yellow'); const bn = []; for (let i = 0; i <= 20; i++) { const a = Math.PI * (0.15 + 0.7 * i / 20); bn.push([800 + Math.cos(a) * 110, 700 + Math.sin(a) * 140]); } for (let i = 20; i >= 0; i--) { const a = Math.PI * (0.15 + 0.7 * i / 20); bn.push([800 + Math.cos(a) * 75, 700 + Math.sin(a) * 95]); }
    P.fill(bn, { color: 'yellow' }); P.path([...bn, bn[0]], { w: 5, overshoot: false }); P.line(895, 770, 915, 745, { w: 7, color: 'brown' });
    P.group(null);
    P.stamp('RED', 200, 1030, { size: 60, color: 'red' }); P.stamp('BLUE', 500, 1030, { size: 60, color: 'blue' }); P.stamp('YELLOW', 800, 1030, { size: 60, color: '#d9a400' });
    P.stamp('3 ADMIRALS', 500, 450, { size: 110, color: 'navy', rot: -0.04 });
    return P;
  }, anim: (g, k) => g === 'c1' ? { ox: 200, oy: 960, rot: Math.sin(k * 2.5) * 0.05 } : g === 'c2' ? { ox: 500, oy: 960, rot: Math.sin(k * 2.5 + 2) * 0.05 } : g === 'c3' ? { ox: 800, oy: 960, rot: Math.sin(k * 2.5 + 4) * 0.05 } : null, sfx: [{ f: 0.1, kind: 'flap' }] });

  // 4 absolute justice: a heavy gavel slamming on a block
  S.push({ draw: () => {
    const P = pen(85);
    const blk = [[330, 1000], [670, 1000], [640, 1080], [360, 1080]]; P.fill(blk, { color: 'brown' }); P.path([...blk, blk[0]], { w: 6, overshoot: false });
    P.group('gavel'); const head = [[380, 760], [620, 760], [620, 880], [380, 880]]; P.fill(head, { color: '#8a4a22' }); P.path([...head, head[0]], { w: 6, overshoot: false }); P.line(380, 790, 620, 790, { w: 4, color: 'gold' }); P.line(380, 850, 620, 850, { w: 4, color: 'gold' });
    P.fill([[690, 800], [900, 800], [900, 840], [690, 840]], { color: '#b8733a' }); P.path([[620, 800], [900, 800], [900, 840], [620, 840], [620, 800]], { w: 5, overshoot: false });
    P.group('_boom'); for (let i = 0; i < 8; i++) { const a = Math.PI + i / 7 * Math.PI; P.line(500 + Math.cos(a) * 200, 1010 + Math.sin(a) * 60, 500 + Math.cos(a) * 280, 1010 + Math.sin(a) * 110, { w: 6, color: 'red' }); }
    P.group(null); P.stamp('ABSOLUTE', 500, 420, { size: 100, color: 'red', rot: -0.04 }); P.stamp('JUSTICE', 500, 545, { size: 100, color: 'red', rot: 0.03 }); P.stamp('NO MERCY!', 500, 1180, { size: 72, color: 'navy', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => { const ph = (k % 1.4) / 1.4, hit = ph < 0.25 ? eout(ph / 0.25) : 1 - eio((ph - 0.25) / 0.75); if (g === 'gavel') return { ox: 900, oy: 820, rot: -0.35 * (1 - hit) }; if (g === '_boom') return { alpha: hit > 0.9 ? 1 : 0, ox: 500, oy: 1010, s: 0.9 + 0.2 * hit }; return null; }, sfx: [{ f: 0.12, kind: 'thud' }, { f: 0.6, kind: 'thud' }] });

  // 5 ohara: an island with a huge tree, pages flying, a burning ship going down
  S.push({ draw: () => {
    const P = pen(86);
    P.fill([[70, 340], [950, 340], [950, 900], [70, 900]], { color: 'rgba(240,150,90,0.25)', speed: 4 });
    P.group('tree'); const tr = [[250, 880], [270, 700], [300, 640], [320, 700], [340, 880]]; P.fill(tr, { color: 'brown' }); P.path([...tr, tr[0]], { w: 5, overshoot: false });
    const crown = lumpPoly(295, 560, 190, 130, 0.12, 8); P.fill(crown, { color: 'green' }); P.path(crown, { w: 6, overshoot: false });
    flame(P, 200, 560, 60, 110, 3); flame(P, 380, 540, 50, 90, 6);
    P.group(null); const isl = [[90, 900], [140, 860], [460, 860], [520, 900]]; P.fill(isl, { color: '#c9a36a' }); P.path(isl, { w: 6 });
    sea(P, 900, 70, 950, '#5a7fb8');
    P.group('pages'); for (const [x, y, r] of [[560, 520, 0.3], [660, 600, -0.2], [600, 680, 0.5], [740, 480, -0.4]]) { const pg = [[x - 30, y - 20], [x + 30, y - 25], [x + 32, y + 20], [x - 28, y + 24]].map(([a, b]) => [x + (a - x) * Math.cos(r) - (b - y) * Math.sin(r), y + (a - x) * Math.sin(r) + (b - y) * Math.cos(r)]); P.fill(pg, { color: 'cream' }); P.path([...pg, pg[0]], { w: 4, overshoot: false }); }
    P.group('ship'); ship(P, 740, 960, 0.75); flame(P, 700, 950, 50, 90, 2); flame(P, 790, 950, 40, 70, 7);
    P.group(null); P.stamp('OHARA', 500, 1160, { size: 90, color: 'red', rot: -0.04 }); P.stamp('BUSTER CALL', 500, 420, { size: 70, color: 'graphite', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => g === 'ship' ? { ox: 740, oy: 1000, rot: 0.18 * eio(cl(k / D)), y: 40 * eio(cl(k / D)) + Math.sin(k * 3) * 4 } : g === 'pages' ? { x: Math.sin(k * 1.5) * 20, y: Math.sin(k * 2.2) * 15 } : g === 'tree' ? { ox: 295, oy: 880, rot: Math.sin(k * 2) * 0.015 } : null, sfx: [{ f: 0.1, kind: 'whoosh' }] });

  // 6 meteor volcano: giant magma fists raining down on pirate ships
  S.push({ draw: () => {
    const P = pen(87);
    P.fill([[70, 340], [950, 340], [950, 960], [70, 960]], { color: 'rgba(200,60,30,0.22)', speed: 4 });
    sea(P, 960, 70, 950, '#4a6fa8');
    P.group('ships'); ship(P, 230, 1000, 0.7, '#3a3344'); ship(P, 520, 1040, 0.8, '#3a3344'); ship(P, 800, 1000, 0.7, '#3a3344');
    P.group('_fists'); fist(P, 230, 620, 0.9); fist(P, 520, 520, 1.1); fist(P, 800, 640, 0.9);
    P.group(null); P.stamp('METEOR VOLCANO!', 500, 1180, { size: 78, color: 'red', rot: -0.04 });
    return P;
  }, anim: (g, k, D) => { const u = cl(k / (D * 0.55)); if (g === '_fists') return { alpha: 1, y: -800 * (1 - eout(u)) + (u >= 1 ? Math.sin(k * 6) * 6 : 0) }; if (g === 'ships') return { ox: 500, oy: 1020, rot: u >= 1 ? Math.sin(k * 9) * 0.02 : 0, y: Math.sin(k * 3) * 5 }; return null; }, sfx: [{ f: 0.1, kind: 'whoosh' }, { f: 0.55, kind: 'thud' }] });

  // 7 magma beats fire: a small flame and a big magma lump on a scale, thermometer bursting
  S.push({ draw: () => {
    const P = pen(88);
    P.group('fire'); flame(P, 250, 1000, 150, 300, 4);
    P.group(null); P.stamp('FIRE', 250, 1100, { size: 64, color: 'orange' });
    P.stamp('<', 500, 860, { size: 160, color: 'graphite' });
    P.group('mag'); magma(P, 760, 880, 170, 140, 2);
    P.group(null); P.stamp('MAGMA', 760, 1100, { size: 64, color: '#a32616' });
    P.group('therm'); P.path([[470, 430], [470, 640]], { w: 6 }); P.path([[530, 430], [530, 640]], { w: 6 }); P.curve([[470, 430], [500, 400], [530, 430]], { w: 6 }); P.circle(500, 680, 50, { w: 6 }); P.fill(ellPoly(500, 680, 44, 44), { color: 'red' }); P.fill([[480, 420], [520, 420], [520, 650], [480, 650]], { color: 'red' });
    P.group(null); P.stamp('HOTTER!', 760, 470, { size: 90, color: 'red', rot: 0.06 });
    return P;
  }, anim: (g, k, D) => { const u = eio(cl(k / (D * 0.6))); if (g === 'fire') return { ox: 250, oy: 1000, s: 1 - 0.35 * u, sy: flick(k, 9, 0.05) }; if (g === 'mag') return { ox: 760, oy: 1000, s: 1 + 0.12 * u + 0.03 * Math.sin(k * 5) }; if (g === 'therm') return { ox: 500, oy: 680, x: Math.sin(k * 30) * 3 * u }; return null; }, sfx: [{ f: 0.2, kind: 'swell' }] });

  // 8 magma vs ice, ten days: a volcano pushing against ice shards, a ten-day calendar
  S.push({ draw: () => {
    const P = pen(89);
    P.group('mag'); volcano(P, 240, 1040, 320, 330);
    P.group('ice'); shard(P, 780, 1040, 110, 380); shard(P, 690, 1040, 80, 260, '#d9f1ff'); shard(P, 860, 1040, 70, 220, '#d9f1ff');
    P.group(null); P.stamp('VS', 510, 880, { size: 130, color: 'red', rot: -0.06 });
    P.group('cal'); const c = [[380, 380], [620, 380], [620, 600], [380, 600]]; P.fill(c, { color: 'white' }); P.path([...c, c[0]], { w: 6, overshoot: false }); P.fill([[380, 380], [620, 380], [620, 430], [380, 430]], { color: 'red' }); P.text('10 DAYS', 500, 520, { size: 64 });
    P.group(null); P.stamp('MAGMA', 240, 1140, { size: 70, color: '#a32616' }); P.stamp('ICE', 780, 1140, { size: 70, color: 'blue' });
    return P;
  }, anim: (g, k) => g === 'mag' ? { ox: 240, oy: 1040, x: 20 * Math.sin(k * 3), s: 1 + 0.03 * Math.sin(k * 6) } : g === 'ice' ? { ox: 780, oy: 1040, x: -20 * Math.sin(k * 3) } : g === 'cal' ? { ox: 500, oy: 380, rot: Math.sin(k * 5) * 0.05 } : null, sfx: [{ f: 0.1, kind: 'thud' }, { f: 0.5, kind: 'thud' }] });

  // 9 magma won: an island, the burning half glowing, a trophy
  S.push({ draw: () => {
    const P = pen(90);
    sea(P, 1000);
    const isl = [[150, 1000], [220, 820], [400, 740], [600, 740], [780, 820], [850, 1000]]; P.curve(isl, { w: 7 });
    P.fill([[150, 1000], [220, 820], [400, 740], [500, 740], [500, 1000]], { color: '#d9f1ff' }); P.fill([[500, 740], [600, 740], [780, 820], [850, 1000], [500, 1000]], { color: '#e0754a' });
    P.line(500, 720, 500, 1010, { w: 5, alpha: 0.6 });
    shard(P, 290, 820, 50, 150); shard(P, 380, 770, 40, 110);
    P.group('fire'); flame(P, 600, 790, 90, 180, 2); flame(P, 700, 840, 80, 150, 5); flame(P, 790, 930, 60, 110, 8);
    P.group('smoke'); for (const [x, y, r] of [[620, 560, 40], [700, 520, 50], [780, 580, 36]]) { P.fill(ellPoly(x, y, r, r * 0.8), { color: 'gray', alpha: 0.55 }); P.circle(x, y, r, { w: 4, alpha: 0.7 }); }
    P.group(null); P.stamp('MAGMA WINS!', 480, 440, { size: 100, color: 'red', rot: -0.05 }); P.stamp('STILL BURNING', 500, 1140, { size: 66, color: '#a32616', rot: 0.03 });
    return P;
  }, anim: (g, k) => g === 'fire' ? { ox: 700, oy: 900, sy: flick(k, 8, 0.07) } : g === 'smoke' ? { ox: 700, oy: 560, y: -15 * Math.sin(k * 1.5), s: 1 + 0.06 * Math.sin(k * 2) } : null, sfx: [{ f: 0.05, kind: 'whoosh' }] });

  // 10 fleet admiral: stairs to the top, a big gold star badge on the top step
  S.push({ draw: () => {
    const P = pen(91);
    for (let i = 0; i < 5; i++) { const st = [[180 + i * 130, 1080 - i * 90], [950, 1080 - i * 90], [950, 1080 - i * 90 + 90], [180 + i * 130, 1080 - i * 90 + 90]]; P.fill(st, { color: i === 4 ? 'gold' : 'white', alpha: 0.8 }); P.path([...st, st[0]], { w: 5, overshoot: false }); }
    P.group('star'); const s = starPoly(780, 600, 110); P.fill(s, { color: 'gold' }); P.path(s, { w: 6, overshoot: false }); P.circle(780, 615, 38, { w: 5, color: 'navy' }); P.line(780, 590, 780, 640, { w: 5, color: 'navy' }); P.curve([[758, 628], [780, 645], [802, 628]], { w: 5, color: 'navy' });
    sparkle(P, 620, 450, 26); sparkle(P, 930, 470, 20, 'orange');
    P.group('paw'); paw(P, 260, 640, 70);
    P.group(null); P.stamp('FLEET ADMIRAL', 470, 400, { size: 92, color: 'red', rot: -0.04 }); P.stamp('TOP OF THE MARINES', 500, 1200, { size: 54, color: 'navy', rot: 0.02 });
    return P;
  }, anim: (g, k, D) => g === 'star' ? { ox: 780, oy: 600, y: -20 * eout(cl(k / (D * 0.4))), rot: Math.sin(k * 2) * 0.08, s: 1 + 0.05 * Math.sin(k * 4) } : g === 'paw' ? { ox: 260, oy: 640, s: 1 + 0.06 * Math.sin(k * 5) } : null, sfx: [{ f: 0.1, kind: 'swell' }] });

  // 11 outro
  S.push({ draw: () => {
    const P = pen(92);
    P.group('fruit'); fruit(P, 360, 720, 170);
    P.group('q'); P.stamp('?', 770, 650, { size: 380, color: 'red', rot: 0.12 });
    P.group(null);
    P.stamp('WHICH FRUIT NEXT?', 480, 1030, { size: 80, color: 'purple', rot: -0.03 });
    P.stamp('COMMENT!', 480, 1160, { size: 76, color: 'red', rot: 0.04 });
    return P;
  }, anim: (g, k) => g === 'fruit' ? { ox: 360, oy: 720, y: Math.sin(k * 3) * 14, rot: Math.sin(k * 2) * 0.06 } : g === 'q' ? { ox: 770, oy: 760, rot: Math.sin(k * 5) * 0.12 } : null, sfx: [] });

  globalThis.FRUIT_SCENES = S;
})();
