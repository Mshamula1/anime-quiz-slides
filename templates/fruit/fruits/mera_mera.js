// Devil Fruit Files #2: Mera Mera no Mi. One sketch per narration line (same order as mera_mera.json).
// Original drawings: an original orange fruit (colour nod only, no official pattern), generic objects, no characters.
(function () {
  const { pen, ellPoly } = globalThis.Sketch;
  const lumpPoly = (cx, cy, rx, ry, lump = 0.05, lumps = 6, rot = 0.3) => { const p = []; for (let i = 0; i <= 72; i++) { const a = rot + i / 72 * Math.PI * 2, r = 1 + lump * Math.sin(a * lumps); p.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } return p; };
  const starPoly = (cx, cy, r, n = 5, k = 0.45, rot = -Math.PI / 2) => { const p = []; for (let i = 0; i <= n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? r * k : r; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return p; };
  const burstPoly = (cx, cy, r, n = 12, k = 0.6, sx = 1.3) => { const p = []; for (let i = 0; i <= n * 2; i++) { const a = i * Math.PI / n, rr = i % 2 ? r * k : r; p.push([cx + Math.cos(a) * rr * sx, cy + Math.sin(a) * rr]); } return p; };
  // a flame: round base at (cx, by), pointed tip h above, wobbly sides
  const flamePoly = (cx, by, w, h, seed = 1) => {
    const L = [], R = [];
    for (let i = 0; i <= 30; i++) {
      const u = i / 30, hw = w / 2 * (u < 0.25 ? Math.sqrt(u / 0.25) : Math.pow((1 - u) / 0.75, 1.25)) * (1 + 0.14 * Math.sin(u * 13 + seed));
      const lean = Math.sin(u * 3 + seed) * w * 0.1 * u, y = by - u * h;
      L.push([cx + lean - hw, y]); R.push([cx + lean + hw, y]);
    }
    return [...L, ...R.reverse()];
  };

  function sparkle(P, x, y, r, color = 'gold') { const s = starPoly(x, y, r, 4, 0.3, 0); P.fill(s, { color, alpha: 0.95, speed: 6 }); P.path(s, { w: 3.5, overshoot: false, speed: 3 }); }
  function rays(P, cx, cy, r0, r1, n, color = 'gold', a0 = 0, a1 = Math.PI * 2) { for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * (i + 0.5) / n, rr = r1 * (i % 2 ? 0.85 : 1); P.line(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, { w: 7, color, speed: 3 }); } }
  function flame(P, cx, by, w, h, seed = 1, ink = true) {
    const o = flamePoly(cx, by, w, h, seed);
    P.fill(o, { color: 'red', alpha: 0.9 });
    P.fill(flamePoly(cx, by - h * 0.02, w * 0.7, h * 0.72, seed + 1), { color: 'orange', alpha: 0.95 });
    P.fill(flamePoly(cx, by - h * 0.04, w * 0.38, h * 0.42, seed + 2), { color: 'yellow', alpha: 1 });
    if (ink) P.path(o, { w: 6, overshoot: false });
  }
  function arrow(P, pts, o = {}) {
    P.curve(pts, o);
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    P.line(b[0], b[1], b[0] - Math.cos(ang - 0.5) * 34, b[1] - Math.sin(ang - 0.5) * 34, o);
    P.line(b[0], b[1], b[0] - Math.cos(ang + 0.5) * 34, b[1] - Math.sin(ang + 0.5) * 34, o);
  }
  // the original orange fruit: round lumpy body, red shade, yellow light, curly stem, leaf
  function fruit(P, cx, cy, r, { sparkles = true } = {}) {
    const body = lumpPoly(cx, cy, r, r * 0.95, 0.05, 7);
    P.path(body, { w: 7, overshoot: false });
    P.curve([[cx - 4, cy - r * 0.88], [cx - 12, cy - r * 1.12], [cx + r * 0.05, cy - r * 1.3], [cx + r * 0.25, cy - r * 1.28]], { w: 8, color: 'brown' });
    const leaf = [[cx - 10, cy - r * 1.0], [cx - r * 0.4, cy - r * 1.35], [cx - r * 0.85, cy - r * 1.22], [cx - r * 0.62, cy - r * 1.0], [cx - 10, cy - r * 1.0]];
    P.curve(leaf, { w: 5.5 });
    P.fill(body, { color: 'orange', alpha: 0.95 });
    P.fill(ellPoly(cx - r * 0.28, cy - r * 0.3, r * 0.45, r * 0.32), { color: 'yellow', alpha: 0.85 });
    P.fill(ellPoly(cx + r * 0.25, cy + r * 0.32, r * 0.6, r * 0.48, -0.4, 2.2), { color: 'red', alpha: 0.5 });
    P.fill(leaf.slice(0, 4), { color: 'green', alpha: 0.9 });
    P.line(cx - 14, cy - r * 1.02, cx - r * 0.62, cy - r * 1.17, { w: 3, alpha: 0.7 });
    for (const [dx, dy, s] of [[-0.45, -0.45, 0.07], [-0.3, -0.56, 0.045], [-0.53, -0.25, 0.04]]) P.fill(ellPoly(cx + dx * r, cy + dy * r, s * r, s * r * 0.8), { color: 'white', alpha: 0.95, speed: 6 });
    P.fill(ellPoly(cx + r * 0.1, cy + r * 1.04, r * 0.85, r * 0.13), { color: 'rgba(60,30,20,0.25)', alpha: 1, speed: 6 });
    if (sparkles) { sparkle(P, cx - r * 1.15, cy - r * 0.6, 26); sparkle(P, cx + r * 1.2, cy - r * 0.2, 20); sparkle(P, cx + r * 0.95, cy + r * 0.85, 16); }
  }
  function sea(P, y0, x0 = 70, x1 = 950) {
    const s = []; for (let i = 0; i <= 17; i++) s.push([x0 + i * (x1 - x0) / 17, y0 + Math.sin(i * 1.3) * 14]);
    P.curve(s, { w: 6, color: 'navy' }); P.fill([...s, [x1, 1250], [x0, 1250]], { color: 'sky', alpha: 0.85 });
  }

  const cl = (v) => Math.max(0, Math.min(1, v));
  const eio = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2), ein = (u) => u * u * u, eout = (u) => 1 - Math.pow(1 - u, 3);
  const flick = (k, a = 9, s = 0.06) => 1 + s * Math.sin(k * a) + s * 0.6 * Math.sin(k * a * 2.3 + 1);
  const S = [];
  // 0 intro: the fruit + its name, flames around it
  S.push({ draw: () => {
    const P = pen(21);
    P.text('Mera Mera no Mi', 500, 390, { size: 112, speed: 3 });
    P.group('flames'); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, x = 500 + Math.cos(a) * 300, y = 800 + Math.sin(a) * 280; flame(P, x, y + 40, 70, 110, i, true); }
    P.group('fruit'); fruit(P, 500, 800, 200);
    P.group(null); P.stamp('FLAME-FLAME!', 500, 1150, { size: 82, color: 'red', rot: -0.04 });
    return P;
  }, anim: (g, k) => g === 'flames' ? { ox: 500, oy: 800, rot: k * 0.4 } : g === 'fruit' ? { ox: 500, oy: 800, y: Math.sin(k * 3) * 16, rot: Math.sin(k * 2.2) * 0.05 } : null, sfx: [{ f: 0.0, kind: 'swell' }] });
  // 1 stranded on a tiny island, finds the fruit
  S.push({ draw: () => {
    const P = pen(22);
    P.group('sun'); P.fill(ellPoly(800, 470, 70, 70), { color: 'yellow' }); P.circle(800, 470, 70, { w: 5 }); rays(P, 800, 470, 90, 130, 10, 'orange');
    P.group(null); sea(P, 930);
    const isl = [[180, 940], [260, 860], [420, 830], [600, 850], [760, 940]];
    P.curve(isl, { w: 7 }); P.fill([...isl, [760, 950], [180, 950]], { color: '#f1d18a' });
    P.group('palm'); P.curve([[330, 860], [320, 750], [345, 640], [380, 560]], { w: 9, color: 'brown' });
    for (const [dx, dy] of [[-170, 20], [-120, -60], [150, -30], [170, 50], [20, -90]]) { const lf = [[380, 560], [380 + dx * 0.5, 560 + dy * 0.5 - 40], [380 + dx, 560 + dy]]; P.curve(lf, { w: 6, color: 'green' }); P.curve([[380, 560], [380 + dx * 0.5, 560 + dy * 0.5 - 10], [380 + dx, 560 + dy]], { w: 4, color: 'green' }); }
    P.group('fruit'); fruit(P, 560, 790, 50, { sparkles: false }); sparkle(P, 500, 720, 20); sparkle(P, 625, 735, 16);
    P.group('boat'); const hull = [[650, 1010], [880, 1010], [850, 1060], [680, 1060]]; P.path([...hull, hull[0]], { w: 6, overshoot: false }); P.fill(hull, { color: 'brown' }); P.line(765, 1010, 765, 900, { w: 6 });
    P.group('waves'); for (let i = 0; i < 3; i++) P.curve([[120 + i * 250, 1130 + i * 20], [180 + i * 250, 1110 + i * 20], [240 + i * 250, 1130 + i * 20]], { w: 5, color: 'white', speed: 3 });
    P.group(null); P.stamp('STRANDED!', 300, 430, { size: 90, color: 'red', rot: -0.08 });
    return P;
  }, anim: (g, k) => g === 'boat' ? { ox: 765, oy: 1030, y: Math.sin(k * 3) * 8, rot: Math.sin(k * 2.5) * 0.06 } : g === 'waves' ? { x: Math.sin(k * 1.5) * 20, y: Math.sin(k * 3) * 6 } : g === 'fruit' ? { ox: 560, oy: 790, s: 1 + 0.08 * Math.sin(k * 6) } : g === 'palm' ? { ox: 330, oy: 860, rot: Math.sin(k * 1.8) * 0.03 } : g === 'sun' ? { ox: 800, oy: 470, rot: k * 0.3 } : null, sfx: [] });
  // 2 make, control, become fire: a match, a swirl, a flame body
  S.push({ draw: () => {
    const P = pen(23);
    P.group('m'); P.line(170, 1000, 260, 760, { w: 9, color: 'brown' }); P.fill(ellPoly(262, 752, 20, 26), { color: 'red' }); flame(P, 268, 740, 70, 120, 3);
    P.group(null); P.stamp('MAKE', 220, 1110, { size: 64, color: 'orange', rot: -0.05 });
    P.group('swirl'); const sw = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 4, r = 20 + i * 1.6; sw.push([500 + Math.cos(a) * r, 840 + Math.sin(a) * r * 0.9]); }
    P.curve(sw, { w: 14, color: 'orange' }); P.curve(sw, { w: 4, color: 'red' });
    P.group(null); P.stamp('CONTROL', 500, 1110, { size: 64, color: 'orange', rot: 0.04 });
    P.group('big'); flame(P, 790, 1010, 230, 420, 5);
    P.group(null); P.stamp('BECOME!', 790, 1110, { size: 64, color: 'red', rot: -0.04 });
    P.stamp('FIRE', 500, 470, { size: 150, color: 'red', rot: -0.03 });
    return P;
  }, anim: (g, k) => g === 'm' ? { ox: 268, oy: 740, s: flick(k, 11, 0.08) } : g === 'swirl' ? { ox: 500, oy: 840, rot: k * 2.2 } : g === 'big' ? { ox: 790, oy: 1010, sy: flick(k, 8, 0.07), sx: flick(k + 2, 7, 0.04) } : null, sfx: [{ f: 0.05, kind: 'whoosh' }] });
  // 3 logia: bullets and a sword pass through a flame
  S.push({ draw: () => {
    const P = pen(24);
    P.group('body'); flame(P, 480, 1150, 330, 700, 7);
    P.group('b1'); const bul = (x, y) => { const b = [[x, y], [x + 90, y], [x + 130, y + 22], [x + 90, y + 44], [x, y + 44]]; P.path([...b, b[0]], { w: 5.5, overshoot: false }); P.fill(b, { color: 'gray' }); P.line(x - 70, y + 22, x - 15, y + 22, { w: 4, alpha: 0.6 }); };
    bul(100, 640);
    P.group('b2'); bul(120, 860);
    P.group('sword'); P.line(720, 520, 900, 380, { w: 4 }); const bl = [[560, 650], [880, 395], [905, 420], [585, 675]]; P.path([...bl, bl[0]], { w: 5, overshoot: false }); P.fill(bl, { color: '#d9dde6' });
    P.line(570, 630, 610, 690, { w: 10, color: 'gold' }); P.line(560, 680, 520, 715, { w: 12, color: 'brown' });
    P.group(null); P.stamp('WHOOSH!', 760, 1030, { size: 74, color: 'orange', rot: 0.06 });
    P.stamp('NO DAMAGE', 300, 450, { size: 74, color: 'blue', rot: -0.05 });
    return P;
  }, anim: (g, k, D) => { if (g === 'body') return { ox: 480, oy: 1150, sy: flick(k, 7, 0.05), sx: flick(k + 1, 9, 0.04) }; if (g === 'b1') return { x: 1000 * ein(cl((k - D * 0.15) / (D * 0.45))) }; if (g === 'b2') return { x: 1000 * ein(cl((k - D * 0.35) / (D * 0.45))) }; if (g === 'sword') { const u = eio(cl((k - D * 0.5) / (D * 0.3))); return { ox: 905, oy: 420, rot: -1.0 * u, alpha: 1 - cl((k - D * 0.85) / (D * 0.1)) }; } return null; }, sfx: [{ f: 0.25, kind: 'zip' }, { f: 0.45, kind: 'zip' }, { f: 0.55, kind: 'whoosh' }] });
  // 4 fire fist: a fist-shaped blast + a faceless poster with the nickname
  S.push({ draw: () => {
    const P = pen(25);
    P.group('poster'); const po = [[110, 380], [430, 370], [440, 800], [120, 810]]; P.path([...po, po[0]], { w: 6, overshoot: false }); P.fill(po, { color: 'cream' });
    P.text('WANTED', 275, 450, { size: 58, speed: 3 }); flame(P, 275, 690, 150, 200, 9); P.text('"FIRE FIST"', 275, 770, { size: 40, color: 'red', speed: 3 });
    P.group('blast'); const bx = 470, by = 1000;
    const cone = [[bx, by - 60], [bx + 300, by - 150], [bx + 460, by - 120], [bx + 460, by + 120], [bx + 300, by + 150], [bx, by + 60]];
    P.fill(cone, { color: 'red', alpha: 0.9 }); P.fill([[bx, by - 35], [bx + 300, by - 95], [bx + 440, by - 70], [bx + 440, by + 70], [bx + 300, by + 95], [bx, by + 35]], { color: 'orange' });
    P.fill([[bx + 40, by - 15], [bx + 380, by - 40], [bx + 380, by + 40], [bx + 40, by + 15]], { color: 'yellow' }); P.path([...cone, cone[0]], { w: 6, overshoot: false });
    const kn = bx + 360; for (let i = 0; i < 4; i++) P.ellipse(kn, by - 90 + i * 60, 46, 30, { w: 5.5 });
    P.group(null); P.stamp('FIRE FIST!', 680, 560, { size: 110, color: 'red', rot: -0.06 });
    return P;
  }, anim: (g, k, D) => g === 'blast' ? { x: 700 * ein(cl((k - D * 0.55) / (D * 0.35))), ox: 700, oy: 1000, s: 1 + 0.05 * Math.sin(k * 16) } : g === 'poster' ? { ox: 275, oy: 380, rot: Math.sin(k * 2) * 0.04 } : null, sfx: [{ f: 0.55, kind: 'whoosh' }] });
  // 5 the second sun: sun vs a huge fireball over the sea
  S.push({ draw: () => {
    const P = pen(26);
    P.fill([[70, 340], [950, 340], [950, 960], [70, 960]], { color: 'rgba(255,180,110,0.4)', speed: 4 });
    P.group('sun'); P.fill(ellPoly(810, 470, 70, 70), { color: 'yellow' }); P.circle(810, 470, 70, { w: 5 }); rays(P, 810, 470, 88, 125, 10, 'orange');
    P.group('ball'); rays(P, 380, 700, 230, 320, 16, 'red'); P.fill(ellPoly(380, 700, 210, 210), { color: 'red' }); P.fill(ellPoly(380, 700, 160, 160), { color: 'orange' }); P.fill(ellPoly(350, 670, 90, 80), { color: 'yellow' }); P.circle(380, 700, 210, { w: 7 });
    P.group(null); sea(P, 960);
    P.group('ship'); const h = [[620, 1050], [820, 1050], [790, 1095], [650, 1095]]; P.path([...h, h[0]], { w: 5.5, overshoot: false }); P.fill(h, { color: 'brown' }); P.line(720, 1050, 720, 940, { w: 5 }); P.fill([[724, 945], [790, 1000], [724, 1030]], { color: 'white' }); P.path([[724, 945], [790, 1000], [724, 1030]], { w: 4, overshoot: false });
    P.group(null); P.stamp('2 SUNS?!', 700, 1180, { size: 86, color: 'red', rot: -0.05 });
    return P;
  }, anim: (g, k, D) => g === 'ball' ? { ox: 380, oy: 700, s: 0.75 + 0.3 * eout(cl(k / (D * 0.7))) + 0.03 * Math.sin(k * 10), y: -40 * eio(cl(k / D)) } : g === 'sun' ? { ox: 810, oy: 470, rot: k * 0.4 } : g === 'ship' ? { ox: 720, oy: 1070, x: 120 * eio(cl(k / D)), rot: Math.sin(k * 3) * 0.05 } : null, sfx: [{ f: 0.0, kind: 'swell' }] });
  // 6 magma beats fire
  S.push({ draw: () => {
    const P = pen(27);
    P.group('fire'); flame(P, 270, 1000, 260, 460, 11);
    P.group('magma'); const m = lumpPoly(700, 820, 200, 190, 0.1, 7);
    P.path(m, { w: 7, overshoot: false }); P.fill(m, { color: '#7a1d12' }); P.fill(ellPoly(670, 790, 120, 100), { color: '#c4361f', alpha: 0.8 });
    for (const pts of [[[600, 760], [650, 800], [630, 860]], [[720, 700], [760, 760], [820, 780]], [[700, 880], [760, 900], [790, 960]]]) { P.curve(pts, { w: 10, color: 'orange' }); P.curve(pts, { w: 4, color: 'yellow' }); }
    for (const [x, y, r] of [[560, 1040, 30], [840, 1060, 24], [720, 1080, 18]]) { P.fill(ellPoly(x, y, r, r * 0.8), { color: '#c4361f' }); P.circle(x, y, r, { w: 4 }); }
    P.group(null); P.stamp('MAGMA', 700, 530, { size: 96, color: '#a32616', rot: 0.04 });
    P.stamp('>', 480, 760, { size: 160, color: 'graphite', rot: 0 });
    P.stamp('FIRE', 270, 1130, { size: 80, color: 'orange', rot: -0.04 });
    return P;
  }, anim: (g, k, D) => { const u = eio(cl((k - D * 0.3) / (D * 0.6))); if (g === 'magma') return { ox: 700, oy: 820, x: -120 * u, s: 1 + 0.05 * Math.sin(k * 5) }; if (g === 'fire') return { ox: 270, oy: 1000, s: Math.max(0.05, 1 - 0.75 * u), sy: flick(k, 9, 0.06) }; return null; }, sfx: [{ f: 0.3, kind: 'thud' }] });
  // 7 the flame went out: a candle, its flame shrinks, smoke rises
  S.push({ draw: () => {
    const P = pen(28);
    P.fill(ellPoly(480, 1110, 260, 50), { color: '#c98a4e' }); P.ellipse(480, 1110, 260, 50, { w: 6 });
    const c = [[400, 1090], [400, 760], [560, 760], [560, 1090]]; P.path([...c, c[0]], { w: 6.5, overshoot: false }); P.fill(c, { color: 'cream' });
    P.fill(ellPoly(480, 760, 80, 22), { color: 'white' }); P.ellipse(480, 760, 80, 22, { w: 5 });
    P.curve([[420, 770], [415, 820], [425, 860]], { w: 5, color: 'cream' }); P.curve([[420, 770], [415, 822], [425, 862]], { w: 3 });
    P.line(480, 760, 482, 720, { w: 5 });
    P.group('fl'); flame(P, 482, 725, 80, 160, 13);
    P.group('_smoke'); P.curve([[482, 715], [460, 640], [505, 570], [470, 490], [500, 420]], { w: 9, color: 'gray', alpha: 0.7 });
    P.group('glow'); for (const r of [150, 200]) P.ellipse(482, 650, r, r * 0.9, { a0: -2.2, sweep: 1.2, w: 5, color: 'orange', alpha: 0.7 });
    P.group(null); P.stamp('PROTECT', 760, 480, { size: 70, color: 'blue', rot: 0.06 }); P.stamp('BROTHER', 760, 570, { size: 70, color: 'blue', rot: 0.06 });
    return P;
  }, anim: (g, k, D) => { const u = eio(cl((k - D * 0.35) / (D * 0.3))); if (g === 'fl') return { ox: 482, oy: 725, s: Math.max(0.001, 1 - u) * flick(k, 10, 0.07), alpha: u < 0.98 ? 1 : 0 }; if (g === 'glow') return { alpha: 1 - u }; if (g === '_smoke') { const v = cl((k - D * 0.6) / (D * 0.4)); return { alpha: v > 0 ? 1 - v * 0.6 : 0, y: -120 * v, x: Math.sin(k * 3) * 12 }; } return null; }, sfx: [] });
  // 8 grand prize of a tournament: arena + fruit on a pedestal
  S.push({ draw: () => {
    const P = pen(29);
    P.path([[90, 760], [90, 540], [930, 540], [930, 760]], { w: 6.5, overshoot: false }); P.fill([[90, 540], [930, 540], [930, 760], [90, 760]], { color: '#e8c995' });
    for (let i = 0; i < 7; i++) { const x = 140 + i * 115; P.path([[x, 760], [x, 660], [x + 35, 620], [x + 70, 660], [x + 70, 760]], { w: 5, overshoot: false }); P.fill([[x, 760], [x, 660], [x + 35, 620], [x + 70, 660], [x + 70, 760]], { color: '#8a5a3a', alpha: 0.8 }); }
    P.line(90, 540, 930, 540, { w: 8 });
    P.group('flags'); for (const x of [140, 520, 880]) { P.line(x, 540, x, 430, { w: 5 }); P.fill([[x, 430], [x + 70, 450], [x, 475]], { color: 'red' }); P.path([[x, 430], [x + 70, 450], [x, 475]], { w: 4, overshoot: false }); }
    P.group(null); P.fill([[70, 760], [950, 760], [950, 1250], [70, 1250]], { color: '#f1d18a', alpha: 0.8, speed: 4 }); P.line(70, 760, 950, 760, { w: 6 });
    const pd = [[400, 1150], [420, 1000], [600, 1000], [620, 1150]]; P.path([...pd, pd[0]], { w: 6.5, overshoot: false }); P.fill(pd, { color: 'gold' });
    P.group('rays'); rays(P, 510, 900, 130, 200, 14, 'gold');
    P.group('fruit'); fruit(P, 510, 900, 85, { sparkles: false });
    P.group(null); P.stamp('GRAND PRIZE!', 510, 1210, { size: 72, color: 'red', rot: -0.04 });
    return P;
  }, anim: (g, k) => g === 'fruit' ? { ox: 510, oy: 900, y: Math.sin(k * 3) * 14, rot: Math.sin(k * 2) * 0.06 } : g === 'rays' ? { ox: 510, oy: 900, rot: k * 0.5 } : g === 'flags' ? { sx: 1, y: Math.sin(k * 6) * 3 } : null, sfx: [{ f: 0.0, kind: 'swell' }] });
  // 9 flame emperor: a crown made of fire over a fiery fist blast
  S.push({ draw: () => {
    const P = pen(30);
    P.group('crown'); const base = [[300, 760], [660, 760], [640, 860], [320, 860]];
    for (let i = 0; i < 5; i++) flame(P, 330 + i * 75, 770, 80, 150 + (i === 2 ? 80 : (i % 2 ? 30 : 0)), 15 + i);
    P.path([...base, base[0]], { w: 7, overshoot: false }); P.fill(base, { color: 'gold' });
    for (let i = 0; i < 3; i++) { P.fill(ellPoly(390 + i * 90, 810, 18, 18), { color: i === 1 ? 'red' : 'blue', speed: 6 }); P.circle(390 + i * 90, 810, 18, { w: 4 }); }
    sparkle(P, 230, 640, 28); sparkle(P, 720, 600, 24);
    P.group(null); P.stamp('FLAME', 480, 1000, { size: 120, color: 'red', rot: -0.05 }); P.stamp('EMPEROR', 480, 1130, { size: 110, color: 'orange', rot: 0.03 });
    P.group('emb'); for (const [x, y] of [[180, 1020], [820, 980], [760, 1180], [200, 1190], [860, 720]]) flame(P, x, y, 36, 60, x, false);
    P.group(null);
    return P;
  }, anim: (g, k) => g === 'crown' ? { ox: 480, oy: 860, s: 1 + 0.05 * Math.sin(k * 5), sy: flick(k, 8, 0.03) } : g === 'emb' ? { y: -((k * 90) % 180), alpha: 1 - ((k * 90) % 180) / 180 } : null, sfx: [{ f: 0.1, kind: 'whoosh' }] });
  // 10 outro
  S.push({ draw: () => {
    const P = pen(31);
    P.group('fruit'); fruit(P, 360, 720, 170);
    P.group('q'); P.stamp('?', 770, 650, { size: 380, color: 'red', rot: 0.12 });
    P.group(null);
    P.stamp('WHICH FRUIT NEXT?', 480, 1030, { size: 80, color: 'purple', rot: -0.03 });
    P.stamp('COMMENT!', 480, 1160, { size: 76, color: 'red', rot: 0.04 });
    return P;
  }, anim: (g, k) => g === 'fruit' ? { ox: 360, oy: 720, y: Math.sin(k * 3) * 14, rot: Math.sin(k * 2) * 0.06 } : g === 'q' ? { ox: 770, oy: 760, rot: Math.sin(k * 5) * 0.12 } : null, sfx: [] });

  globalThis.FRUIT_SCENES = S;
})();
