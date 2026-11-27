// Devil Fruit Files #6: Yami Yami no Mi. One sketch per narration line (same order as yami_yami.json).
// Original drawings: an original dark-purple fruit (colour nod only, no official pattern), generic objects, no characters.
(function () {
  const { pen, ellPoly } = globalThis.Sketch;
  const lumpPoly = (cx, cy, rx, ry, lump = 0.05, lumps = 6, rot = 0.3) => { const p = []; for (let i = 0; i <= 72; i++) { const a = rot + i / 72 * Math.PI * 2, r = 1 + lump * Math.sin(a * lumps); p.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } return p; };
  const starPoly = (cx, cy, r, n = 5, k = 0.45, rot = -Math.PI / 2) => { const p = []; for (let i = 0; i <= n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? r * k : r; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return p; };
  const DARK = '#2a1840', INK = '#141018', VIO = '#5b2d8e';
  function sparkle(P, x, y, r, color = 'lilac') { const s = starPoly(x, y, r, 4, 0.3, 0); P.fill(s, { color, alpha: 0.95, speed: 6 }); P.path(s, { w: 3.5, overshoot: false, speed: 3 }); }
  function spiral(P, cx, cy, r0, r1, turns = 3, o = {}) { const s = []; for (let i = 0; i <= 90; i++) { const u = i / 90, a = u * Math.PI * 2 * turns, r = r0 + (r1 - r0) * u; s.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * (o.squash || 1)]); } P.curve(s, { w: o.w || 6, color: o.color || VIO, speed: 3 }); }
  // dark puddle / vortex
  function vortex(P, cx, cy, rx, ry) { const v = lumpPoly(cx, cy, rx, ry, 0.08, 9); P.fill(v, { color: INK, alpha: 0.92 }); P.path(v, { w: 6, overshoot: false }); spiral(P, cx, cy, 8, rx * 0.85, 2.5, { squash: ry / rx, color: VIO, w: 5 }); spiral(P, cx, cy, 4, rx * 0.5, 2, { squash: ry / rx, color: 'lilac', w: 3 }); }
  function flamePoly(cx, by, w, h, seed = 1) {
    const L = [], R = [];
    for (let i = 0; i <= 30; i++) { const u = i / 30, hw = w / 2 * (u < 0.25 ? Math.sqrt(u / 0.25) : Math.pow((1 - u) / 0.75, 1.25)) * (1 + 0.14 * Math.sin(u * 13 + seed)); const lean = Math.sin(u * 3 + seed) * w * 0.1 * u, y = by - u * h; L.push([cx + lean - hw, y]); R.push([cx + lean + hw, y]); }
    return [...L, ...R.reverse()];
  }
  function flame(P, cx, by, w, h, seed = 1) { const o = flamePoly(cx, by, w, h, seed); P.fill(o, { color: 'red', alpha: 0.9 }); P.fill(flamePoly(cx, by - h * 0.02, w * 0.7, h * 0.72, seed + 1), { color: 'orange' }); P.fill(flamePoly(cx, by - h * 0.04, w * 0.38, h * 0.42, seed + 2), { color: 'yellow' }); P.path(o, { w: 5, overshoot: false }); }
  // the original dark fruit: plump teardrop-ish body, deep purple, black shade, violet sheen, crooked stem, two leaves
  function fruit(P, cx, cy, r, { sparkles = true, body = '#4a2470' } = {}) {
    const b = lumpPoly(cx, cy, r, r * 1.02, 0.06, 5, 0.9);
    P.path(b, { w: 7, overshoot: false });
    P.curve([[cx + 2, cy - r * 0.9], [cx + 10, cy - r * 1.15], [cx - r * 0.08, cy - r * 1.32]], { w: 8, color: 'brown' });
    const leaf = [[cx + 8, cy - r * 1.02], [cx + r * 0.45, cy - r * 1.32], [cx + r * 0.85, cy - r * 1.15], [cx + r * 0.55, cy - r * 0.98], [cx + 8, cy - r * 1.02]];
    P.curve(leaf, { w: 5.5 });
    P.fill(b, { color: body, alpha: 0.97 });
    P.fill(ellPoly(cx + r * 0.25, cy + r * 0.3, r * 0.62, r * 0.5, -0.3, 2.4), { color: INK, alpha: 0.55 });
    P.fill(ellPoly(cx - r * 0.3, cy - r * 0.32, r * 0.36, r * 0.24), { color: 'lilac', alpha: 0.7 });
    P.fill(leaf.slice(0, 4), { color: 'green', alpha: 0.9 });
    P.line(cx + 14, cy - r * 1.03, cx + r * 0.62, cy - r * 1.13, { w: 3, alpha: 0.7 });
    // little curled grooves on the skin
    for (const [dx, dy, s] of [[0.2, -0.35, 0.18], [-0.45, 0.25, 0.15], [0.35, 0.45, 0.14]]) { const c = []; for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI * 1.6; c.push([cx + dx * r + Math.cos(a) * s * r * (1 - i / 30), cy + dy * r + Math.sin(a) * s * r * (1 - i / 30)]); } P.curve(c, { w: 4, color: '#1a0e2a' }); }
    P.fill(ellPoly(cx - r * 0.42, cy - r * 0.45, r * 0.07, r * 0.05), { color: 'white', alpha: 0.95, speed: 6 });
    P.fill(ellPoly(cx + r * 0.1, cy + r * 1.06, r * 0.85, r * 0.13), { color: 'rgba(30,20,50,0.25)', alpha: 1, speed: 6 });
    if (sparkles) { sparkle(P, cx - r * 1.15, cy - r * 0.6, 26); sparkle(P, cx + r * 1.2, cy - r * 0.2, 20, 'purple'); sparkle(P, cx + r * 0.95, cy + r * 0.85, 16); }
  }
  function paleFruit(P, cx, cy, r) {
    const b = lumpPoly(cx, cy, r, r * 0.95, 0.05, 6); P.path(b, { w: 7, overshoot: false }); P.fill(b, { color: '#f4f1e6' });
    for (let k = -1; k <= 1; k++) { const w = []; for (let i = 0; i <= 10; i++) w.push([cx - r * 0.75 + i * r * 0.15, cy + k * r * 0.4 + Math.sin(i * 1.4) * 8]); P.curve(w, { w: 4, color: 'sky' }); }
    P.curve([[cx, cy - r * 0.92], [cx - 8, cy - r * 1.2], [cx + 14, cy - r * 1.3]], { w: 7, color: 'brown' });
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
  function house(P, x, by, w, h, roof = 'red') {
    const b = [[x - w / 2, by], [x - w / 2, by - h], [x + w / 2, by - h], [x + w / 2, by]]; P.fill(b, { color: 'cream' }); P.path([...b, b[0]], { w: 5, overshoot: false });
    const r = [[x - w / 2 - 14, by - h], [x, by - h - w * 0.55], [x + w / 2 + 14, by - h]]; P.fill(r, { color: roof }); P.path([...r, r[0]], { w: 5, overshoot: false });
    P.rect(x - w * 0.15, by - h * 0.5, w * 0.3, h * 0.5, { w: 4 });
  }

  const cl = (v) => Math.max(0, Math.min(1, v));
  const eio = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2), ein = (u) => u * u * u, eout = (u) => 1 - Math.pow(1 - u, 3);
  const flick = (k, a = 9, s = 0.06) => 1 + s * Math.sin(k * a) + s * 0.6 * Math.sin(k * a * 2.3 + 1);
  const S = [];

  // 0 intro: the fruit + its name, dark rings swirling round it
  S.push({ draw: () => {
    const P = pen(81);
    P.text('Yami Yami no Mi', 500, 390, { size: 104, speed: 3 });
    P.group('rings'); spiral(P, 500, 800, 230, 330, 1.2, { color: VIO, w: 7 }); spiral(P, 500, 800, 260, 300, 0.8, { color: 'lilac', w: 4 });
    P.group('fruit'); fruit(P, 500, 800, 190);
    P.group(null); P.stamp('DARK-DARK!', 500, 1165, { size: 84, color: 'purple', rot: -0.04 });
    return P;
  }, anim: (g, k) => g === 'rings' ? { ox: 500, oy: 800, rot: k * 0.6 } : g === 'fruit' ? { ox: 500, oy: 800, y: Math.sin(k * 3) * 16, rot: Math.sin(k * 2.2) * 0.05 } : null, sfx: [{ f: 0.0, kind: 'swell' }] });

  // 1 darkness = endless gravity: a vortex pulling a crate, a barrel, a rock and a star in
  S.push({ draw: () => {
    const P = pen(82);
    P.group('vx'); vortex(P, 500, 800, 190, 190);
    P.group('junk');
    const cr = [[180, 560], [270, 560], [270, 650], [180, 650]]; P.fill(cr, { color: 'brown' }); P.path([...cr, cr[0]], { w: 5, overshoot: false }); P.line(180, 560, 270, 650, { w: 4 }); P.line(270, 560, 180, 650, { w: 4 });
    P.fill(ellPoly(820, 600, 45, 60), { color: '#b8773a' }); P.ellipse(820, 600, 45, 60, { w: 5 }); P.line(776, 580, 864, 580, { w: 4 }); P.line(776, 625, 864, 625, { w: 4 });
    const rk = lumpPoly(200, 1000, 60, 45, 0.1, 5); P.fill(rk, { color: 'gray' }); P.path(rk, { w: 5, overshoot: false });
    const st = starPoly(810, 1010, 55); P.fill(st, { color: 'gold' }); P.path(st, { w: 5, overshoot: false });
    P.group(null); P.stamp('GRAVITY!', 500, 450, { size: 120, color: 'purple', rot: -0.04 }); P.stamp('LOGIA', 500, 1170, { size: 64, color: 'graphite', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => { const u = eio(cl(k / (D * 0.95))); if (g === 'vx') return { ox: 500, oy: 800, rot: -k * 2.2, s: 1 + 0.04 * Math.sin(k * 4) }; if (g === 'junk') return { ox: 500, oy: 800, rot: -u * 2.4, s: 1 - 0.8 * u }; return null; }, sfx: [{ f: 0.05, kind: 'whoosh' }, { f: 0.6, kind: 'swell' }] });

  // 2 blackbeard: a tattered black flag with crossed bones over a dark sea
  S.push({ draw: () => {
    const P = pen(83);
    sea(P, 1020, 70, 950, '#4a5f8f');
    P.line(300, 1060, 300, 480, { w: 10, color: 'brown' }); P.fill(ellPoly(300, 474, 14, 14), { color: 'gold' });
    P.group('flag'); const fl = []; for (let i = 0; i <= 12; i++) fl.push([304 + i * 40, 500 + Math.sin(i * 0.8) * 18]); const fb = []; for (let i = 12; i >= 0; i--) fb.push([304 + i * 40 + (i === 12 ? -20 : 0), 800 + Math.sin(i * 0.8 + 0.5) * 18 + (i % 3 === 2 ? 22 : 0)]);
    const flag = [...fl, ...fb]; P.fill(flag, { color: INK }); P.path([...flag, flag[0]], { w: 6, overshoot: false });
    P.line(450, 580, 650, 730, { w: 22, color: 'white' }); P.line(650, 580, 450, 730, { w: 22, color: 'white' });
    for (const [x, y] of [[450, 580], [650, 580], [450, 730], [650, 730]]) { P.fill(ellPoly(x, y, 20, 20), { color: 'white' }); }
    P.group(null); P.stamp('BLACKBEARD', 520, 920, { size: 96, color: 'graphite', rot: -0.04 });
    return P;
  }, anim: (g, k) => g === 'flag' ? { ox: 304, oy: 650, sx: 1 + 0.04 * Math.sin(k * 4), rot: Math.sin(k * 3) * 0.03 } : null, sfx: [{ f: 0.05, kind: 'flap' }] });

  // 3 waiting for years aboard a big ship: an hourglass, calendar pages flying away
  S.push({ draw: () => {
    const P = pen(84);
    sea(P, 1060);
    P.group('ship'); ship(P, 300, 1000, 1.3, 'white');
    P.group('glass'); const hx = 720, hy = 720;
    P.line(hx - 110, hy - 170, hx + 110, hy - 170, { w: 12, color: 'brown' }); P.line(hx - 110, hy + 170, hx + 110, hy + 170, { w: 12, color: 'brown' });
    const gl = [[hx - 90, hy - 160], [hx + 90, hy - 160], [hx + 10, hy], [hx + 90, hy + 160], [hx - 90, hy + 160], [hx - 10, hy]]; P.fill(gl, { color: 'rgba(200,230,255,0.5)' }); P.path([...gl, gl[0]], { w: 5, overshoot: false });
    P.fill([[hx - 50, hy - 110], [hx + 50, hy - 110], [hx + 6, hy - 10], [hx - 6, hy - 10]], { color: 'gold' }); P.fill([[hx - 80, hy + 158], [hx + 80, hy + 158], [hx, hy + 70]], { color: 'gold' });
    P.group('pages'); for (let i = 0; i < 3; i++) { const x = 160 + i * 120, y = 470 + (i % 2) * 40; const pg = [[x, y], [x + 90, y - 10], [x + 98, y + 90], [x + 8, y + 100]]; P.fill(pg, { color: 'white' }); P.path([...pg, pg[0]], { w: 4, overshoot: false }); P.fill([[x, y], [x + 90, y - 10], [x + 92, y + 15], [x + 2, y + 25]], { color: 'red' }); }
    P.group(null); P.stamp('WAITING...', 520, 1180, { size: 80, color: 'purple', rot: -0.03 });
    return P;
  }, anim: (g, k, D) => g === 'ship' ? { ox: 300, oy: 1020, y: Math.sin(k * 2.5) * 8, rot: Math.sin(k * 2) * 0.02 } : g === 'glass' ? { ox: 720, oy: 720, rot: k > D * 0.5 ? Math.PI * eio(cl((k - D * 0.5) / (D * 0.25))) : 0 } : g === 'pages' ? { y: -Math.min(700, 700 * ein(cl(k / D))) , x: 40 * Math.sin(k * 3), rot: 0.2 * Math.sin(k * 2) } : null, sfx: [{ f: 0.5, kind: 'whoosh' }] });

  // 4 a crewmate finds it, it gets taken: an open chest with the dark fruit, the fruit vanishes off-frame
  S.push({ draw: () => {
    const P = pen(85);
    P.group('chest'); const bx = [[300, 860], [700, 860], [700, 1060], [300, 1060]]; P.fill(bx, { color: 'brown' }); P.path([...bx, bx[0]], { w: 6, overshoot: false });
    const lid = [[300, 860], [330, 700], [670, 700], [700, 860]]; P.fill(lid, { color: '#b8773a' }); P.path([...lid, lid[0]], { w: 6, overshoot: false });
    P.line(300, 930, 700, 930, { w: 8, color: 'gold' }); P.fill(ellPoly(500, 960, 28, 30), { color: 'gold' }); P.ellipse(500, 960, 28, 30, { w: 4 });
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.35; P.line(500 + Math.cos(a) * 200, 760 + Math.sin(a) * 200, 500 + Math.cos(a) * 280, 760 + Math.sin(a) * 280, { w: 5, color: 'gold' }); }
    P.group('fruit'); fruit(P, 500, 700, 100, { sparkles: false });
    P.group(null); P.stamp('FOUND IT!', 260, 470, { size: 72, color: 'gold', rot: -0.1 });
    P.group('_steal'); P.stamp('BETRAYAL!', 560, 1170, { size: 90, color: 'red', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => { const u = ein(cl((k - D * 0.45) / (D * 0.35))); if (g === 'fruit') return { ox: 500, oy: 700, x: 800 * u, y: -200 * u + Math.sin(k * 3) * 10 * (1 - u), rot: u * 2 }; if (g === '_steal') return { alpha: cl((k - D * 0.5) / (D * 0.1)) }; if (g === 'chest') return { ox: 500, oy: 1060, rot: Math.sin(k * 20) * 0.01 * (k > D * 0.45 ? 1 : 0) }; return null; }, sfx: [{ f: 0.45, kind: 'whoosh' }, { f: 0.55, kind: 'thud' }] });

  // 5 black hole + liberation: houses sink into a dark pool, then shoot back out
  S.push({ draw: () => {
    const P = pen(86);
    const gr = [[70, 960], [950, 960], [950, 1080], [70, 1080]]; P.fill(gr, { color: '#8fb36a' }); P.line(70, 960, 950, 960, { w: 6 });
    P.group('pool'); vortex(P, 500, 990, 380, 70);
    P.group('houses'); house(P, 300, 990, 110, 110, 'red'); house(P, 500, 990, 120, 140, 'blue'); house(P, 700, 990, 110, 100, 'orange');
    P.group(null); P.stamp('BLACK HOLE', 500, 470, { size: 104, color: 'purple', rot: -0.04 });
    P.group('_lib'); P.stamp('LIBERATION!', 500, 1175, { size: 80, color: 'red', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => { const s = eio(cl(k / (D * 0.5))), r = eout(cl((k - D * 0.6) / (D * 0.25))); if (g === 'houses') return { ox: 500, oy: 990, sy: Math.max(0.02, 1 - s + r), y: 0 }; if (g === 'pool') return { ox: 500, oy: 990, s: 1 + 0.05 * Math.sin(k * 5) }; if (g === '_lib') return { alpha: cl((k - D * 0.6) / (D * 0.1)) }; return null; }, sfx: [{ f: 0.1, kind: 'swell' }, { f: 0.6, kind: 'boing' }] });

  // 6 one touch cancels powers: a flame, an ice shard and a bolt get touched by a dark wisp and go grey
  S.push({ draw: () => {
    const P = pen(87);
    P.group('pw'); flame(P, 230, 900, 120, 220, 3);
    const sh = [[460, 900], [460, 740], [500, 660], [540, 740], [540, 900]]; P.fill(sh, { color: '#bfe6ff' }); P.path([...sh, sh[0]], { w: 5, color: 'navy', overshoot: false });
    const bolt = [[780, 650], [700, 790], [760, 790], [700, 920], [840, 740], [775, 740], [830, 650]]; P.fill(bolt, { color: 'yellow' }); P.path([...bolt, bolt[0]], { w: 5, overshoot: false });
    P.group('wisp'); const w = []; for (let i = 0; i <= 30; i++) w.push([100 + i * 27, 1010 + Math.sin(i * 0.7) * 30]); P.curve(w, { w: 26, color: INK }); P.curve(w, { w: 8, color: VIO });
    P.group('_x'); P.line(160, 640, 860, 960, { w: 22, color: 'red' }); P.line(860, 640, 160, 960, { w: 22, color: 'red' });
    P.group(null); P.stamp('ONE TOUCH', 500, 470, { size: 96, color: 'purple', rot: -0.04 }); P.stamp('CANCELLED!', 500, 1170, { size: 80, color: 'red', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => { const t = cl((k - D * 0.35) / (D * 0.15)); if (g === 'pw') return { ox: 500, oy: 900, alpha: 1 - 0.7 * t, s: 1 - 0.1 * t, y: Math.sin(k * 4) * 6 * (1 - t) }; if (g === 'wisp') return { ox: 500, oy: 1010, y: -40 * Math.sin(k * 3), sx: 1 + 0.05 * Math.sin(k * 5) }; if (g === '_x') return { ox: 500, oy: 800, alpha: t, s: 0.6 + 0.4 * eout(t) }; return null; }, sfx: [{ f: 0.4, kind: 'thud' }] });

  // 7 the price: a boxing glove smacks a dark blob, pain stars burst
  S.push({ draw: () => {
    const P = pen(88);
    P.group('blob'); const bl = lumpPoly(640, 800, 200, 210, 0.08, 7); P.fill(bl, { color: DARK }); P.path(bl, { w: 7, overshoot: false }); spiral(P, 640, 800, 10, 140, 2, { color: VIO, w: 5 });
    P.group('glove'); const gl = lumpPoly(260, 800, 120, 100, 0.06, 4); P.fill(gl, { color: 'red' }); P.path(gl, { w: 6, overshoot: false }); P.fill(ellPoly(230, 760, 40, 25), { color: 'pink', alpha: 0.8 });
    const cuff = [[80, 740], [150, 730], [150, 870], [80, 860]]; P.fill(cuff, { color: 'white' }); P.path([...cuff, cuff[0]], { w: 5, overshoot: false });
    P.group('_pow'); for (const [x, y, r] of [[470, 650, 50], [520, 980, 40], [780, 600, 36]]) { const s = starPoly(x, y, r, 6, 0.45); P.fill(s, { color: 'yellow' }); P.path(s, { w: 4, overshoot: false }); }
    P.group(null); P.stamp('NO DODGING', 500, 450, { size: 96, color: 'purple', rot: -0.04 }); P.stamp('DOUBLE PAIN!', 500, 1170, { size: 84, color: 'red', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => { const c = (k % (D / 2)) / (D / 2), hit = c < 0.35 ? eio(c / 0.35) : 1 - eio((c - 0.35) / 0.65); if (g === 'glove') return { x: 150 * hit }; if (g === 'blob') return { ox: 640, oy: 800, sx: 1 - 0.1 * (hit > 0.9 ? 1 : 0), x: 20 * (hit > 0.9 ? 1 : 0) }; if (g === '_pow') return { ox: 620, oy: 800, alpha: hit > 0.85 ? 1 : 0, s: 1 + 0.2 * Math.sin(k * 10) }; return null; }, sfx: [{ f: 0.17, kind: 'thud' }, { f: 0.67, kind: 'thud' }] });

  // 8 banaro island: fire streams into a dark vortex; an anchor and chain for the marines
  S.push({ draw: () => {
    const P = pen(89);
    sea(P, 1040);
    const isl = [[110, 1040], [180, 960], [420, 930], [560, 960], [620, 1040]]; P.fill([...isl], { color: '#d8b56a' }); P.curve(isl, { w: 6 });
    P.group('vx'); vortex(P, 720, 680, 150, 150);
    P.group('fire'); flame(P, 220, 900, 110, 220, 2); flame(P, 360, 880, 90, 180, 6);
    P.group('anchor'); const ax = 840, ay = 1000; P.circle(ax, ay - 120, 22, { w: 7, color: 'navy' }); P.line(ax, ay - 98, ax, ay + 40, { w: 10, color: 'navy' }); P.line(ax - 50, ay - 70, ax + 50, ay - 70, { w: 9, color: 'navy' }); P.curve([[ax - 70, ay - 10], [ax - 50, ay + 40], [ax, ay + 50], [ax + 50, ay + 40], [ax + 70, ay - 10]], { w: 9, color: 'navy' });
    P.group(null); P.stamp('BANARO ISLAND', 400, 440, { size: 80, color: 'graphite', rot: -0.04 }); P.stamp('SWALLOWED!', 420, 1170, { size: 80, color: 'purple', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => { const u = eio(cl(k / (D * 0.6))); if (g === 'fire') return { ox: 290, oy: 800, x: 430 * u, y: -120 * u, s: 1 - 0.95 * u, alpha: 1 - u * 0.9 }; if (g === 'vx') return { ox: 720, oy: 680, rot: -k * 2.5, s: 1 + 0.08 * u }; if (g === 'anchor') return { ox: 840, oy: 880, rot: Math.sin(k * 3) * 0.1 }; return null; }, sfx: [{ f: 0.1, kind: 'whoosh' }, { f: 0.6, kind: 'chomp' }] });

  // 9 marineford: cracked ground, a pale quake-wave fruit joins the dark fruit
  S.push({ draw: () => {
    const P = pen(90);
    const gr = [[70, 1000], [950, 1000], [950, 1100], [70, 1100]]; P.fill(gr, { color: '#c9b79a' }); P.line(70, 1000, 950, 1000, { w: 6 });
    P.path([[500, 1000], [470, 1040], [520, 1070], [480, 1100]], { w: 5 }); P.path([[300, 1000], [330, 1050], [290, 1090]], { w: 4 }); P.path([[720, 1000], [690, 1045], [740, 1095]], { w: 4 });
    P.group('dark'); fruit(P, 300, 760, 130, { sparkles: false });
    P.group('pale'); paleFruit(P, 720, 760, 120);
    P.group('cracks'); for (const [x, y] of [[720, 560], [600, 640], [850, 650]]) P.path([[x, y], [x + 20, y + 30], [x - 10, y + 50], [x + 15, y + 80]], { w: 5, color: 'sky' });
    P.group(null); P.stamp('MARINEFORD', 500, 440, { size: 96, color: 'graphite', rot: -0.04 }); P.stamp('STOLEN TOO!', 500, 1180, { size: 84, color: 'red', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => { const u = eio(cl((k - D * 0.3) / (D * 0.5))); if (g === 'pale') return { ox: 720, oy: 760, x: -250 * u + Math.sin(k * 30) * 4 * (1 - u), rot: Math.sin(k * 25) * 0.03 * (1 - u) }; if (g === 'dark') return { ox: 300, oy: 760, x: 120 * u }; if (g === 'cracks') return { ox: 720, oy: 640, alpha: 1 - u, x: Math.sin(k * 30) * 4 }; return null; }, sfx: [{ f: 0.1, kind: 'thud' }, { f: 0.8, kind: 'clink' }] });

  // 10 two fruits, one body: dark + pale fruit, a plus sign, a big question mark
  S.push({ draw: () => {
    const P = pen(91);
    P.group('a'); fruit(P, 250, 760, 120, { sparkles: false });
    P.group(null); P.line(420, 760, 520, 760, { w: 14, color: 'gold' }); P.line(470, 710, 470, 810, { w: 14, color: 'gold' });
    P.group('b'); paleFruit(P, 680, 760, 115);
    P.group('q'); P.stamp('?', 850, 520, { size: 220, color: 'purple', rot: 0.15 });
    P.group(null); P.stamp('TWO POWERS', 450, 460, { size: 96, color: 'graphite', rot: -0.04 }); P.stamp('HOW?!', 500, 1150, { size: 120, color: 'red', rot: 0.04 });
    return P;
  }, anim: (g, k) => g === 'a' ? { ox: 250, oy: 760, y: Math.sin(k * 3) * 14 } : g === 'b' ? { ox: 680, oy: 760, y: Math.sin(k * 3 + 1.5) * 14 } : g === 'q' ? { ox: 850, oy: 560, rot: Math.sin(k * 5) * 0.12 } : null, sfx: [{ f: 0.05, kind: 'beat' }] });

  // 11 outro
  S.push({ draw: () => {
    const P = pen(92);
    P.group('fruit'); fruit(P, 360, 720, 170);
    P.group('q'); P.stamp('?', 770, 650, { size: 380, color: 'purple', rot: 0.12 });
    P.group(null);
    P.stamp('WHICH FRUIT NEXT?', 480, 1030, { size: 80, color: 'purple', rot: -0.03 });
    P.stamp('COMMENT!', 480, 1160, { size: 76, color: 'red', rot: 0.04 });
    return P;
  }, anim: (g, k) => g === 'fruit' ? { ox: 360, oy: 720, y: Math.sin(k * 3) * 14, rot: Math.sin(k * 2) * 0.06 } : g === 'q' ? { ox: 770, oy: 760, rot: Math.sin(k * 5) * 0.12 } : null, sfx: [] });

  globalThis.FRUIT_SCENES = S;
})();
