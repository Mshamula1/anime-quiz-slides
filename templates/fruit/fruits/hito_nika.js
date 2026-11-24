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

  const S = [];
  // 0 intro: the fruit + its name
  S.push(() => {
    const P = pen(1);
    P.text('Hito Hito no Mi', 480, 380, { size: 118, speed: 3 });
    P.stamp('MODEL: NIKA', 480, 485, { size: 74, color: 'red', rot: -0.05 });
    rays(P, 480, 790, 280, 380, 16, 'gold');
    fruit(P, 480, 790, 225);
    P.text('the Human-Human Fruit', 480, 1150, { size: 70, color: 'blue', speed: 3.2 });
    return P;
  });
  // 1 800 years: hourglass + the fruit escaping
  S.push(() => {
    const P = pen(2), cx = 300, cy = 780;
    const top = [[cx - 160, cy - 300], [cx + 160, cy - 300], [cx + 160, cy - 260], [cx - 160, cy - 260]], bot = [[cx - 160, cy + 260], [cx + 160, cy + 260], [cx + 160, cy + 300], [cx - 160, cy + 300]];
    P.path([...top, top[0]], { w: 6.5, overshoot: false }); P.path([...bot, bot[0]], { w: 6.5, overshoot: false });
    P.line(cx - 135, cy - 260, cx - 135, cy + 260, { w: 7 }); P.line(cx + 135, cy - 260, cx + 135, cy + 260, { w: 7 });
    const glassL = [[cx - 100, cy - 255], [cx - 95, cy - 120], [cx - 14, cy - 16], [cx - 14, cy + 16], [cx - 95, cy + 120], [cx - 100, cy + 255]];
    const glassR = glassL.map(([x, y]) => [2 * cx - x, y]);
    P.curve(glassL, { w: 6 }); P.curve(glassR, { w: 6 });
    P.fill(top, { color: 'gold' }); P.fill(bot, { color: 'gold' });
    P.fill([[cx - 92, cy + 250], [cx - 70, cy + 160], [cx, cy + 105], [cx + 70, cy + 160], [cx + 92, cy + 250]], { color: 'yellow' });
    P.fill([[cx - 70, cy - 150], [cx + 70, cy - 150], [cx + 12, cy - 30], [cx - 12, cy - 30]], { color: 'yellow' });
    P.line(cx, cy - 25, cx, cy + 110, { w: 4, color: 'orange' });
    P.stamp('800', 700, 470, { size: 210, color: 'red', rot: -0.06 });
    P.stamp('YEARS!', 700, 620, { size: 100, color: 'graphite', rot: -0.03 });
    fruit(P, 760, 930, 95, { sparkles: false });
    speedLines(P, 650, 930, 4, 200);
    for (const [x, y, r] of [[600, 1040, 28], [560, 1010, 20], [640, 1060, 18]]) { P.fill(ellPoly(x, y, r, r * 0.8), { color: 'rgba(120,110,100,0.35)', speed: 6 }); P.circle(x, y, r, { w: 3.5 }); }
    P.stamp('GOT AWAY!', 700, 1150, { size: 66, color: 'orange', rot: 0.05 });
    return P;
  });
  // 2 will of its own: sly fruit under a spotlight
  S.push(() => {
    const P = pen(3);
    const cone = [[440, 300], [520, 300], [800, 1050], [160, 1050]];
    P.fill(cone, { color: 'rgba(255,220,90,0.45)', speed: 4 });
    P.line(440, 300, 160, 1050, { w: 3.5, alpha: 0.6 }); P.line(520, 300, 800, 1050, { w: 3.5, alpha: 0.6 });
    fruit(P, 480, 790, 200, { face: true });
    for (const [x, y, s, r] of [[170, 500, 110, -0.2], [810, 560, 90, 0.2], [820, 980, 70, 0.3]]) P.stamp('?', x, y, { size: s, color: 'red', rot: r });
    P.stamp('A MIND OF ITS OWN?!', 480, 1150, { size: 68, color: 'purple', rot: -0.03 });
    return P;
  });
  // 3 renamed: classified record book
  S.push(() => {
    const P = pen(4), cx = 480, cy = 780;
    const L = [[cx - 400, cy - 230], [cx, cy - 200], [cx, cy + 250], [cx - 400, cy + 220]], R = [[cx, cy - 200], [cx + 400, cy - 230], [cx + 400, cy + 220], [cx, cy + 250]];
    P.path([...L, L[0]], { w: 6.5, overshoot: false }); P.path([...R, R[0]], { w: 6.5, overshoot: false });
    P.fill(L, { color: 'cream' }); P.fill(R, { color: 'cream' });
    P.fill([[cx - 420, cy + 220], [cx, cy + 250], [cx + 420, cy + 220], [cx + 420, cy + 250], [cx, cy + 285], [cx - 420, cy + 250]], { color: 'brown', speed: 4 });
    for (let i = 0; i < 7; i++) P.curve([[cx - 360, cy - 140 + i * 52], [cx - 220, cy - 148 + i * 52], [cx - 110, cy - 136 + i * 52], [cx - 40, cy - 142 + i * 52]], { w: 3, alpha: 0.45, speed: 4 });
    P.text('Hito Hito no Mi', cx + 200, cy - 110, { size: 64, speed: 2.5 });
    for (let i = 0; i < 3; i++) P.line(cx + 40, cy - 125 + i * 14, cx + 365, cy - 108 + i * 12, { w: 7, color: 'red', speed: 2.5 });
    P.stamp('Gomu Gomu no Mi', cx + 200, cy + 40, { size: 56, color: 'blue', rot: -0.04, outline: null });
    // padlock
    const lx = cx + 200, ly = cy + 170;
    P.ellipse(lx, ly - 40, 40, 46, { a0: Math.PI, sweep: Math.PI, w: 8 });
    P.path([[lx - 58, ly - 40], [lx + 58, ly - 40], [lx + 58, ly + 40], [lx - 58, ly + 40], [lx - 58, ly - 40]], { w: 6, overshoot: false });
    P.fill([[lx - 58, ly - 40], [lx + 58, ly - 40], [lx + 58, ly + 40], [lx - 58, ly + 40]], { color: 'gold' });
    P.stamp('CLASSIFIED', cx - 200, cy + 380, { size: 84, color: 'red', rot: -0.1 });
    return P;
  });
  // 4 stolen from a government ship
  S.push(() => {
    const P = pen(5), cx = 420, cy = 860;
    const hull = [[cx - 300, cy - 30], [cx + 320, cy - 40], [cx + 220, cy + 90], [cx - 230, cy + 90]];
    P.path([...hull, hull[0]], { w: 7, overshoot: false }); P.fill(hull, { color: 'brown' });
    for (let i = 0; i < 5; i++) { P.fill(ellPoly(cx - 200 + i * 95, cy + 30, 16, 16), { color: 'gold', speed: 6 }); P.circle(cx - 200 + i * 95, cy + 30, 16, { w: 4 }); }
    P.line(cx - 40, cy - 30, cx - 40, cy - 470, { w: 8 }); P.line(cx + 160, cy - 35, cx + 160, cy - 360, { w: 7 });
    const s1 = [[cx - 34, cy - 450], [cx + 110, cy - 360], [cx + 120, cy - 230], [cx - 34, cy - 140]], s2 = [[cx + 166, cy - 340], [cx + 270, cy - 270], [cx + 275, cy - 180], [cx + 166, cy - 110]];
    P.curve(s1, { w: 6 }); P.curve(s2, { w: 6 }); P.fill(s1, { color: 'white' }); P.fill(s2, { color: 'white' });
    P.path([[cx - 40, cy - 470], [cx + 40, cy - 455], [cx - 40, cy - 430]], { w: 5, overshoot: false }); P.fill([[cx - 40, cy - 470], [cx + 40, cy - 455], [cx - 40, cy - 430]], { color: 'sky' });
    chest(P, cx + 210, cy - 115, 80, 70);
    const sea = []; for (let i = 0; i <= 18; i++) sea.push([30 + i * 52, cy + 100 + Math.sin(i * 1.3) * 18]);
    P.curve(sea, { w: 6, color: 'navy' }); P.fill([...sea, [960, 1260], [30, 1260]], { color: 'sky', alpha: 0.85 });
    for (let k = 0; k < 3; k++) P.curve([[80 + k * 260, cy + 190 + k * 30], [140 + k * 260, cy + 170 + k * 30], [200 + k * 260, cy + 190 + k * 30]], { w: 5, color: 'white', speed: 3 });
    const b = burstPoly(770, 520, 140, 12, 0.6, 1.25);
    P.fill(b, { color: 'orange' }); P.fill(burstPoly(770, 520, 90, 10, 0.55, 1.25), { color: 'yellow' }); P.path(b, { w: 6, overshoot: false });
    P.stamp('STOLEN!', 770, 525, { size: 80, color: 'red', rot: -0.08 });
    return P;
  });
  // 5 a little chest, a boy, dessert
  S.push(() => {
    const P = pen(6);
    const table = [[40, 1000], [950, 980], [950, 1080], [40, 1100]];
    P.path([[40, 1000], [950, 980]], { w: 7 }); P.fill(table, { color: '#c98a4e' });
    chest(P, 110, 760, 260, 220, true);
    for (const [x, y] of [[170, 640], [300, 600], [380, 700]]) sparkle(P, x, y, 22);
    P.fill(ellPoly(660, 965, 250, 56), { color: 'white' }); P.ellipse(660, 965, 250, 56, { w: 6 }); P.ellipse(660, 962, 185, 36, { w: 3, alpha: 0.5 });
    fruit(P, 640, 820, 120, { bite: true, sparkles: false });
    P.path([[860, 900], [900, 760]], { w: 7, color: 'gray' }); for (const dx of [-14, 0, 14]) P.line(900 + dx, 760, 912 + dx, 715, { w: 5, color: 'gray' });
    P.stamp('CHOMP!', 760, 640, { size: 96, color: 'orange', rot: 0.08 });
    P.stamp('DESSERT?!', 480, 420, { size: 110, color: 'red', rot: -0.05 });
    return P;
  });
  // 6 rubber: stretch, bounce, bullet bounce
  S.push(() => {
    const P = pen(7);
    for (const x of [140, 830]) { P.fill(ellPoly(x, 480, 22, 22), { color: 'red', speed: 6 }); P.circle(x, 480, 22, { w: 5 }); }
    const band = []; for (let i = 0; i <= 20; i++) { const x = 140 + i * 34.5, y = 480 + Math.sin(i / 20 * Math.PI) * 170; band.push([x, y - 14]); }
    const band2 = band.map(([x, y]) => [x, y + 34]).reverse();
    P.curve(band, { w: 6 }); P.curve(band2, { w: 6 }); P.fill([...band, ...band2], { color: 'orange' });
    P.stamp('STRETCH!', 485, 380, { size: 84, color: 'purple', rot: -0.04 });
    // bouncing ball with arcs
    P.fill(ellPoly(250, 1000, 78, 78), { color: 'red' }); P.circle(250, 1000, 78, { w: 6.5 }); P.fill(ellPoly(225, 970, 24, 18), { color: 'white', speed: 6 });
    P.curve([[250, 900], [300, 760], [380, 720], [450, 790], [490, 990]], { w: 4, alpha: 0.6 });
    P.curve([[490, 990], [530, 880], [580, 990]], { w: 4, alpha: 0.6 });
    P.stamp('BOING!', 380, 650, { size: 80, color: 'red', rot: -0.1 });
    // bullet pinging off
    const bul = [[640, 960], [740, 960], [785, 985], [740, 1010], [640, 1010]];
    P.path([...bul, bul[0]], { w: 5.5, overshoot: false }); P.fill(bul, { color: 'gray' });
    arrow(P, [[800, 970], [860, 880], [920, 860]], { w: 6, color: 'graphite' });
    P.stamp('PING!', 820, 790, { size: 70, color: 'orange', rot: 0.1 });
    P.stamp('BULLETPROOF', 720, 1130, { size: 58, color: 'blue', rot: -0.04 });
    return P;
  });
  // 7 heartbeat: drum + pounding heart
  S.push(() => {
    const P = pen(8), cx = 330, cy = 870;
    const side = [[cx - 210, cy - 150], [cx + 210, cy - 150], [cx + 210, cy + 130], [cx - 210, cy + 130]];
    P.ellipse(cx, cy - 150, 210, 58, { w: 6.5 }); P.line(cx - 210, cy - 150, cx - 210, cy + 130, { w: 6.5 }); P.line(cx + 210, cy - 150, cx + 210, cy + 130, { w: 6.5 });
    P.ellipse(cx, cy + 130, 210, 58, { a0: 0, sweep: Math.PI, w: 6.5 });
    P.fill(side, { color: 'red' }); P.fill(ellPoly(cx, cy - 150, 205, 54), { color: 'cream' });
    const zz = []; for (let i = 0; i <= 10; i++) zz.push([cx - 200 + i * 40, cy - 90 + (i % 2) * 200]); P.path(zz, { w: 6, color: 'gold' });
    P.line(cx + 120, cy - 360, cx + 30, cy - 180, { w: 8, color: 'brown' }); P.fill(ellPoly(cx + 128, cy - 375, 22, 22), { color: 'cream' }); P.circle(cx + 128, cy - 375, 22, { w: 5 });
    const hx = 730, hy = 560;
    const heart = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2, x = 16 * Math.pow(Math.sin(a), 3), y = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)); heart.push([hx + x * 9, hy + y * 9]); }
    P.path(heart, { w: 7, overshoot: false }); P.fill(heart, { color: 'red' }); P.fill(ellPoly(hx - 60, hy - 50, 32, 22), { color: 'pink', speed: 6 });
    for (const r of [190, 235]) P.ellipse(hx, hy, r, r * 0.9, { a0: -0.6, sweep: 1.2, w: 6, color: 'red', alpha: 0.8 });
    P.stamp('BA-DUM!', 730, 820, { size: 110, color: 'red', rot: -0.06 });
    P.stamp('BA-DUM!', 760, 960, { size: 84, color: 'orange', rot: 0.05 });
    for (const [x, y] of [[600, 1100], [880, 1080]]) { P.fill(ellPoly(x, y, 22, 16), { color: 'graphite', speed: 6 }); P.line(x + 20, y, x + 20, y - 80, { w: 5 }); P.line(x + 20, y - 80, x + 55, y - 60, { w: 5 }); }
    return P;
  });
  // 8 sun god + broken chains
  S.push(() => {
    const P = pen(9), cx = 480, cy = 820;
    P.fill([[40, 330], [940, 330], [940, cy + 60], [40, cy + 60]], { color: 'rgba(255,190,120,0.45)', speed: 4 });
    rays(P, cx, cy + 60, 250, 430, 13, 'orange', Math.PI, Math.PI * 2);
    const sun = ellPoly(cx, cy + 60, 220, 220, Math.PI, Math.PI * 2);
    P.path(sun, { w: 7, overshoot: false }); P.fill(sun, { color: 'gold' }); P.fill(ellPoly(cx - 70, cy - 60, 70, 40), { color: 'yellow', speed: 5 });
    P.line(40, cy + 60, 940, cy + 60, { w: 7 });
    P.fill([[40, cy + 60], [940, cy + 60], [940, 1260], [40, 1260]], { color: 'rgba(120,180,255,0.35)', speed: 4 });
    for (const [x, rot] of [[230, -0.2], [360, 0.2], [600, -0.2], [730, 0.2]]) { P.ellipse(x, 1080, 70, 36, { rot, w: 9, color: 'gray' }); P.ellipse(x, 1080, 70, 36, { rot, w: 3.5 }); }
    for (const [a, b, c, d] of [[460, 1040, 500, 1000], [500, 1110, 540, 1150], [470, 1110, 440, 1150]]) P.line(a, b, c, d, { w: 6, color: 'red' });
    P.stamp('FREE!', 480, 1190, { size: 100, color: 'red', rot: -0.05 });
    P.stamp('SUN GOD', 480, 420, { size: 96, color: 'orange', rot: 0.03 });
    return P;
  });
  // 9 rubber world: wobbly ground, bouncing boulder, lightbulb
  S.push(() => {
    const P = pen(10);
    const g = []; for (let i = 0; i <= 18; i++) g.push([40 + i * 51, 1010 + Math.sin(i * 0.9) * 55]);
    P.curve(g, { w: 7 }); P.fill([...g, [958, 1260], [40, 1260]], { color: 'green', alpha: 0.85 });
    for (let k = 1; k <= 2; k++) P.curve(g.map(([x, y]) => [x, y + k * 55]), { w: 4, alpha: 0.5, speed: 3 });
    const rock = lumpPoly(300, 620, 120, 90, 0.08, 5);
    P.path(rock, { w: 7, overshoot: false }); P.fill(rock, { color: 'gray' }); P.fill(ellPoly(270, 590, 45, 26), { color: '#c8c8cf', speed: 5 });
    P.curve([[320, 990], [290, 850], [300, 730]], { w: 4, alpha: 0.55 });
    P.stamp('BOING!', 300, 430, { size: 100, color: 'red', rot: -0.1 });
    const bx = 720, by = 590;
    const bulb = []; for (let i = 0; i <= 40; i++) { const a = Math.PI * 0.75 + i / 40 * Math.PI * 1.5; bulb.push([bx + Math.cos(a) * 110, by - 20 + Math.sin(a) * 120]); }
    bulb.push([bx + 60, by + 110], [bx - 60, by + 110]);
    P.path([...bulb, bulb[0]], { w: 7, overshoot: false }); P.fill(bulb, { color: 'yellow' });
    P.path([[bx - 60, by + 110], [bx + 60, by + 110], [bx + 55, by + 180], [bx - 55, by + 180], [bx - 60, by + 110]], { w: 6, overshoot: false });
    P.fill([[bx - 60, by + 110], [bx + 60, by + 110], [bx + 55, by + 180], [bx - 55, by + 180]], { color: 'gray' });
    rays(P, bx, by - 20, 150, 220, 9, 'orange', -Math.PI * 1.0, 0.0);
    P.stamp('IMAGINATION!', 690, 870, { size: 68, color: 'blue', rot: -0.04 });
    return P;
  });
  // 10 outro
  S.push(() => {
    const P = pen(11);
    fruit(P, 360, 720, 170);
    P.stamp('?', 770, 650, { size: 380, color: 'red', rot: 0.12 });
    P.stamp('WHICH FRUIT NEXT?', 480, 1030, { size: 80, color: 'purple', rot: -0.03 });
    P.stamp('COMMENT!', 480, 1160, { size: 76, color: 'red', rot: 0.04 });
    return P;
  });

  globalThis.FRUIT_SCENES = S;
})();
