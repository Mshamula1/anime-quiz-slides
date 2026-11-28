// Devil Fruit Files #9: Hana Hana no Mi. One sketch per narration line (same order as hana_hana.json).
// Original drawings: an original pink petal fruit (colour nod only, no official pattern), generic hands, flowers and objects, no characters.
(function () {
  const { pen, ellPoly } = globalThis.Sketch;
  const lumpPoly = (cx, cy, rx, ry, lump = 0.05, lumps = 6, rot = 0.3) => { const p = []; for (let i = 0; i <= 72; i++) { const a = rot + i / 72 * Math.PI * 2, r = 1 + lump * Math.sin(a * lumps); p.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } return p; };
  const starPoly = (cx, cy, r, n = 5, k = 0.45, rot = -Math.PI / 2) => { const p = []; for (let i = 0; i <= n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? r * k : r; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return p; };
  function sparkle(P, x, y, r, color = 'yellow') { const s = starPoly(x, y, r, 4, 0.3, 0); P.fill(s, { color, alpha: 0.95, speed: 6 }); P.path(s, { w: 3.5, overshoot: false, speed: 3 }); }
  const rotP = (pts, cx, cy, a) => pts.map(([x, y]) => [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)]);
  // a generic open hand pointing up from (x,y) (wrist), size s, rotated by rot
  function hand(P, x, y, s = 1, rot = 0, color = '#ffd9b8') {
    const raw = [[-28, 0], [-32, -60], [-62, -95], [-55, -108], [-26, -84], [-30, -150], [-18, -156], [-10, -100], [-8, -168], [4, -170], [8, -102], [16, -160], [28, -156], [24, -96], [36, -140], [46, -134], [34, -60], [28, 0]];
    const pts = rotP(raw.map(([a, b]) => [x + a * s, y + b * s]), x, y, rot);
    P.fill(pts, { color }); P.path([...pts, pts[0]], { w: 4.5, overshoot: false });
    // a small petal ring at the wrist (where it "blooms" from)
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const pc = rotP([[x + Math.cos(a) * 34 * s, y + 6 * s + Math.sin(a) * 12 * s]], x, y, rot)[0]; P.fill(ellPoly(pc[0], pc[1], 14 * s, 9 * s), { color: 'pink', alpha: 0.9, speed: 6 }); }
  }
  function flower(P, x, y, r, color = 'pink') {
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const p = ellPoly(x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6, r * 0.45, r * 0.28, a); P.fill(p, { color, alpha: 0.95 }); P.path(p, { w: 3.5, overshoot: false }); }
    P.fill(ellPoly(x, y, r * 0.3, r * 0.3), { color: 'yellow' }); P.circle(x, y, r * 0.3, { w: 3.5 });
  }
  function petal(P, x, y, r, a, color = 'pink') { const p = ellPoly(x, y, r, r * 0.55, a); P.fill(p, { color, alpha: 0.95, speed: 6 }); }
  // the original fruit: round, pink, layered petal swirls on its skin, curly stem, leaf
  function fruit(P, cx, cy, r, { sparkles = true } = {}) {
    const body = lumpPoly(cx, cy, r, r * 0.95, 0.07, 8);
    P.path(body, { w: 7, overshoot: false });
    P.curve([[cx - 4, cy - r * 0.88], [cx - 12, cy - r * 1.12], [cx + r * 0.05, cy - r * 1.3], [cx + r * 0.25, cy - r * 1.28]], { w: 8, color: 'brown' });
    const leaf = [[cx - 10, cy - r * 1.0], [cx - r * 0.4, cy - r * 1.35], [cx - r * 0.85, cy - r * 1.22], [cx - r * 0.62, cy - r * 1.0], [cx - 10, cy - r * 1.0]];
    P.curve(leaf, { w: 5.5 });
    P.fill(body, { color: 'pink', alpha: 0.95 });
    for (const [sx, sy] of [[-0.4, -0.15], [0.35, -0.3], [0.1, 0.35], [-0.45, 0.45], [0.55, 0.35]]) P.curve([[cx + (sx - 0.15) * r, cy + sy * r], [cx + sx * r, cy + (sy - 0.15) * r], [cx + (sx + 0.15) * r, cy + sy * r]], { w: 5, color: '#c2306a' });
    P.fill(ellPoly(cx - r * 0.35, cy - r * 0.5, r * 0.25, r * 0.14), { color: 'white', alpha: 0.6 });
    P.fill(leaf.slice(0, 4), { color: 'green', alpha: 0.9 });
    P.fill(ellPoly(cx + r * 0.1, cy + r * 1.04, r * 0.85, r * 0.13), { color: 'rgba(80,20,40,0.22)', alpha: 1, speed: 6 });
    if (sparkles) { sparkle(P, cx - r * 1.15, cy - r * 0.6, 26); sparkle(P, cx + r * 1.2, cy - r * 0.2, 20, 'pink'); sparkle(P, cx + r * 0.95, cy + r * 0.85, 16); }
  }

  const cl = (v) => Math.max(0, Math.min(1, v));
  const eio = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2), eout = (u) => 1 - Math.pow(1 - u, 3);
  const pop = (k, t0, d = 0.35) => eout(cl((k - t0) / d));
  const S = [];

  // 0 intro: the fruit + its name, petals circling
  S.push({ draw: () => {
    const P = pen(121);
    P.text('Hana Hana no Mi', 500, 390, { size: 104, speed: 3 });
    P.group('petals'); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; petal(P, 500 + Math.cos(a) * 320, 800 + Math.sin(a) * 280, 26, a); }
    P.group('fruit'); fruit(P, 500, 800, 200);
    P.group(null); P.stamp('FLOWER-FLOWER!', 500, 1160, { size: 84, color: '#c2306a', rot: -0.04 });
    return P;
  }, anim: (g, k) => g === 'petals' ? { ox: 500, oy: 800, rot: k * 0.35 } : g === 'fruit' ? { ox: 500, oy: 800, y: Math.sin(k * 3) * 16, rot: Math.sin(k * 2.2) * 0.05 } : null, sfx: [{ f: 0.0, kind: 'swell' }] });

  // 1 looks like a pink dahlia: the fruit next to a big dahlia, both swaying
  S.push({ draw: () => {
    const P = pen(122);
    P.group('fruit'); fruit(P, 300, 800, 150, { sparkles: false });
    P.group(null); P.stamp('=', 530, 800, { size: 140, color: 'graphite' });
    P.group('dahlia'); P.line(760, 1100, 760, 860, { w: 9, color: 'green' });
    for (let ring = 0; ring < 3; ring++) { const n = 12 - ring * 3, rr = 150 - ring * 45; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + ring * 0.3; const p = ellPoly(760 + Math.cos(a) * rr * 0.6, 760 + Math.sin(a) * rr * 0.6, rr * 0.38, rr * 0.2, a); P.fill(p, { color: ring === 2 ? '#c2306a' : 'pink' }); P.path(p, { w: 3.5, overshoot: false }); } }
    P.group(null); P.stamp('PARAMECIA', 500, 430, { size: 100, color: 'purple', rot: -0.04 }); P.stamp('PINK DAHLIA', 760, 1170, { size: 64, color: '#c2306a', rot: 0.03 });
    return P;
  }, anim: (g, k) => g === 'dahlia' ? { ox: 760, oy: 1100, rot: Math.sin(k * 2) * 0.06 } : g === 'fruit' ? { ox: 300, oy: 950, rot: Math.sin(k * 2 + 1) * 0.05 } : null, sfx: [{ f: 0.1, kind: 'flap' }] });

  // 2 sprouts from any surface: a brick wall and a floor with hands popping out one by one
  S.push({ draw: () => {
    const P = pen(123);
    P.fill([[90, 480], [910, 480], [910, 900], [90, 900]], { color: '#e0a080', alpha: 0.5 });
    for (let r = 0; r < 6; r++) { P.line(90, 480 + r * 70, 910, 480 + r * 70, { w: 3, color: 'brown', alpha: 0.6 }); for (let c = 0; c < 6; c++) { const x = 90 + c * 150 + (r % 2) * 75; if (x < 900) P.line(x, 480 + r * 70, x, 550 + r * 70, { w: 3, color: 'brown', alpha: 0.6 }); } }
    P.line(70, 900, 930, 900, { w: 6 }); P.fill([[70, 900], [930, 900], [930, 1100], [70, 1100]], { color: '#c9a36a', alpha: 0.5 });
    P.group('_h1'); hand(P, 250, 760, 1.1);
    P.group('_h2'); hand(P, 720, 660, 1.0, 0.3);
    P.group('_h3'); hand(P, 480, 1060, 1.1);
    P.group('_h4'); hand(P, 820, 1060, 0.9, -0.2);
    P.group(null); P.stamp('ANY SURFACE!', 500, 420, { size: 96, color: '#c2306a', rot: -0.04 });
    return P;
  }, anim: (g, k, D) => { const m = { _h1: 0.1, _h2: 0.3, _h3: 0.5, _h4: 0.7 }; if (g in m) { const t0 = D * m[g]; return { alpha: k > t0 ? 1 : 0, sy: pop(k, t0), sx: 0.7 + 0.3 * pop(k, t0) }; } return null; }, sfx: [{ f: 0.1, kind: 'boing' }, { f: 0.3, kind: 'boing' }, { f: 0.5, kind: 'boing' }, { f: 0.7, kind: 'boing' }] });

  // 3 eaten as a child: an open picture book with a flower pressed in it, a small fruit beside
  S.push({ draw: () => {
    const P = pen(124);
    P.group('book'); const L = [[160, 760], [490, 720], [490, 1040], [160, 1080]], R = [[510, 720], [840, 760], [840, 1080], [510, 1040]];
    P.fill(L, { color: 'cream' }); P.fill(R, { color: 'cream' }); P.path([...L, L[0]], { w: 6, overshoot: false }); P.path([...R, R[0]], { w: 6, overshoot: false });
    for (let i = 0; i < 4; i++) P.line(200, 820 + i * 50, 450, 790 + i * 50, { w: 3, color: 'gray' });
    flower(P, 675, 880, 90);
    P.group('fruit'); fruit(P, 760, 560, 80, { sparkles: false });
    P.group(null); P.stamp('JUST A CHILD', 380, 560, { size: 74, color: 'purple', rot: -0.05 });
    return P;
  }, anim: (g, k) => g === 'fruit' ? { ox: 760, oy: 560, y: Math.sin(k * 3) * 14, rot: Math.sin(k * 2) * 0.1 } : g === 'book' ? { ox: 500, oy: 1060, rot: Math.sin(k * 1.8) * 0.02 } : null, sfx: [{ f: 0.1, kind: 'flap' }] });

  // 4 arms crossed in an X: two forearms crossing, petals bursting out
  S.push({ draw: () => {
    const P = pen(125);
    P.group('armA'); const a1 = rotP([[320, 760], [680, 760], [680, 830], [320, 830]], 500, 795, 0.7); P.fill(a1, { color: '#ffd9b8' }); P.path([...a1, a1[0]], { w: 6, overshoot: false });
    P.group('armB'); const a2 = rotP([[320, 760], [680, 760], [680, 830], [320, 830]], 500, 795, -0.7); P.fill(a2, { color: '#f5c9a5' }); P.path([...a2, a2[0]], { w: 6, overshoot: false });
    P.group('_burst'); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; petal(P, 500 + Math.cos(a) * 280, 795 + Math.sin(a) * 260, 30, a); }
    P.group(null); P.stamp('X', 500, 470, { size: 170, color: '#c2306a', rot: 0.05 }); P.stamp('ABOUT TO BLOOM', 500, 1170, { size: 72, color: 'purple', rot: -0.03 });
    return P;
  }, anim: (g, k, D) => { const u = eio(cl(k / (D * 0.3))); if (g === 'armA') return { ox: 500, oy: 795, rot: -0.7 * (1 - u) }; if (g === 'armB') return { ox: 500, oy: 795, rot: 0.7 * (1 - u) }; if (g === '_burst') return { alpha: k > D * 0.3 ? 1 : 0, ox: 500, oy: 795, s: 0.5 + 0.5 * pop(k, D * 0.3, 0.5), rot: k * 0.3 }; return null; }, sfx: [{ f: 0.3, kind: 'swell' }] });

  // 5 Clutch: a training dummy, hands sprouting on it, bending it back
  S.push({ draw: () => {
    const P = pen(126);
    P.line(500, 1120, 500, 1000, { w: 10, color: 'brown' }); P.fill([[400, 1110], [600, 1110], [600, 1140], [400, 1140]], { color: 'brown' });
    P.group('dummy'); const bd = [[420, 1000], [400, 700], [430, 640], [570, 640], [600, 700], [580, 1000]]; P.fill(bd, { color: '#e8c78a' }); P.path([...bd, bd[0]], { w: 6, overshoot: false });
    P.fill(ellPoly(500, 560, 80, 80), { color: '#e8c78a' }); P.circle(500, 560, 80, { w: 6 });
    P.line(420, 820, 580, 820, { w: 4, color: 'brown' }); P.line(430, 900, 570, 900, { w: 4, color: 'brown' });
    hand(P, 420, 700, 0.6, -1.2); hand(P, 580, 700, 0.6, 1.2); hand(P, 500, 860, 0.6, 0);
    P.group(null); P.stamp('CLUTCH!', 500, 420, { size: 130, color: '#c2306a', rot: -0.04 });
    return P;
  }, anim: (g, k, D) => g === 'dummy' ? { ox: 500, oy: 1000, rot: -0.35 * eio(cl((k - D * 0.25) / (D * 0.3))) + (k > D * 0.55 ? Math.sin(k * 10) * 0.02 : 0) } : null, sfx: [{ f: 0.25, kind: 'zip' }, { f: 0.55, kind: 'thud' }] });

  // 6 the catch: a hammer bonks a sprouted hand, a pain bolt zaps to a heart far away
  S.push({ draw: () => {
    const P = pen(127);
    P.line(90, 1000, 500, 1000, { w: 6 });
    P.group('hand'); hand(P, 290, 1000, 1.2);
    P.group('hammer'); P.fill([[200, 480], [380, 480], [380, 580], [200, 580]], { color: 'gray' }); P.path([[200, 480], [380, 480], [380, 580], [200, 580], [200, 480]], { w: 6, overshoot: false });
    P.fill([[380, 515], [600, 515], [600, 545], [380, 545]], { color: 'brown' });
    P.group('_zap'); const z = [[380, 760], [520, 700], [500, 760], [640, 690], [620, 750], [740, 700]]; P.curve(z, { w: 12, color: 'yellow' }); P.curve(z, { w: 4, color: 'orange' });
    P.group('heart'); const h = []; for (let i = 0; i <= 60; i++) { const t = i / 60 * Math.PI * 2; h.push([820 + 16 * Math.pow(Math.sin(t), 3) * 6, 760 - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 6]); }
    P.fill(h, { color: 'red' }); P.path(h, { w: 6, overshoot: false });
    P.group(null); P.stamp('OUCH!', 500, 1150, { size: 120, color: 'red', rot: -0.05 }); P.stamp('THE CATCH', 700, 440, { size: 70, color: 'navy', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => { const ph = (k % 1.6) / 1.6, hit = ph < 0.2 ? eout(ph / 0.2) : 1 - eio((ph - 0.2) / 0.8);
    if (g === 'hammer') return { ox: 600, oy: 530, rot: 0.6 * hit - 0.25, y: 260 * hit };
    if (g === '_zap') return { alpha: hit > 0.85 ? 1 : 0 };
    if (g === 'heart') return { ox: 820, oy: 760, s: 1 + 0.12 * (hit > 0.85 ? 1 : 0) + 0.03 * Math.sin(k * 6) };
    if (g === 'hand') return { ox: 290, oy: 1000, sy: 1 - 0.15 * (hit > 0.85 ? 1 : 0) };
    return null; }, sfx: [{ f: 0.15, kind: 'thud' }, { f: 0.55, kind: 'thud' }] });

  // 7 she has to know where: a target behind a wall, an eye and a map pinpointing it
  S.push({ draw: () => {
    const P = pen(128);
    P.group('eye'); const e = [[130, 760], [260, 680], [390, 760], [260, 840]]; P.fill(e, { color: 'white' }); P.curve([[130, 760], [260, 670], [390, 760]], { w: 6 }); P.curve([[130, 760], [260, 850], [390, 760]], { w: 6 });
    P.group('pupil'); P.fill(ellPoly(260, 760, 40, 40), { color: 'purple' }); P.fill(ellPoly(260, 760, 16, 16), { color: 'navy' });
    P.group(null); P.fill([[470, 520], [540, 520], [540, 1050], [470, 1050]], { color: '#b0b0b8' }); P.path([[470, 520], [540, 520], [540, 1050], [470, 1050], [470, 520]], { w: 6, overshoot: false });
    P.group('target'); for (const [r, c] of [[130, 'red'], [90, 'white'], [50, 'red']]) { P.fill(ellPoly(760, 780, r, r), { color: c }); P.circle(760, 780, r, { w: 5 }); }
    P.group('_pin'); P.fill([[760, 780], [730, 700], [790, 700]], { color: 'purple' }); P.fill(ellPoly(760, 690, 34, 34), { color: 'purple' }); P.circle(760, 690, 34, { w: 5 });
    P.group(null); P.stamp('WHERE IS IT?', 500, 430, { size: 96, color: 'navy', rot: -0.04 }); P.stamp('KNOW YOUR TARGET', 500, 1170, { size: 64, color: '#c2306a', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => g === 'pupil' ? { x: 30 * Math.sin(k * 1.5) } : g === '_pin' ? { alpha: k > D * 0.4 ? 1 : 0, y: -200 * (1 - eout(cl((k - D * 0.4) / (D * 0.15)))) } : g === 'target' ? { ox: 760, oy: 780, s: 1 + 0.03 * Math.sin(k * 5) } : null, sfx: [{ f: 0.4, kind: 'thud' }] });

  // 8 a hundred arms, then a thousand: a counter flipping from 100 to 1,000, a field of hands
  S.push({ draw: () => {
    const P = pen(129);
    P.group('field'); for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) hand(P, 140 + c * 120 + (r % 2) * 60, 1120 - r * 120, 0.55 + r * 0.05, Math.sin(c * 2 + r) * 0.2);
    P.group('_c100'); P.stamp('100', 500, 600, { size: 200, color: 'graphite', rot: -0.04 });
    P.group('_c1000'); P.stamp('1,000!', 500, 600, { size: 200, color: '#c2306a', rot: -0.04 });
    P.group(null); P.stamp('MIL FLEUR!', 500, 400, { size: 100, color: 'purple', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => g === '_c100' ? { alpha: k < D * 0.5 ? 1 : 0 } : g === '_c1000' ? { alpha: k >= D * 0.5 ? 1 : 0, ox: 500, oy: 600, s: 0.8 + 0.2 * pop(k, D * 0.5) } : g === 'field' ? { ox: 500, oy: 1120, sy: 0.9 + 0.1 * Math.sin(k * 6) } : null, sfx: [{ f: 0.5, kind: 'boing' }] });

  // 9 wings made of arms, five seconds of flight: two arm-wings flapping, a 5-second stopwatch
  S.push({ draw: () => {
    const P = pen(130);
    P.group('wingL'); for (let i = 0; i < 6; i++) hand(P, 460, 820, 1.0 + i * 0.12, -0.6 - i * 0.22);
    P.group('wingR'); for (let i = 0; i < 6; i++) hand(P, 540, 820, 1.0 + i * 0.12, 0.6 + i * 0.22);
    P.group('watch'); P.circle(500, 880, 75, { w: 7 }); P.fill(ellPoly(500, 880, 70, 70), { color: 'white' }); P.fill([[485, 790], [515, 790], [515, 805], [485, 805]], { color: 'graphite' }); P.text('5s', 500, 900, { size: 54 });
    P.group(null); P.stamp('CIEN FLEUR: WING', 500, 420, { size: 80, color: 'purple', rot: -0.04 }); P.stamp('FLY!', 500, 1150, { size: 110, color: '#c2306a', rot: 0.05 });
    return P;
  }, anim: (g, k) => { const f = Math.sin(k * 6); if (g === 'wingL') return { ox: 460, oy: 820, rot: 0.2 * f, y: -20 * Math.sin(k * 3) }; if (g === 'wingR') return { ox: 540, oy: 820, rot: -0.2 * f, y: -20 * Math.sin(k * 3) }; if (g === 'watch') return { ox: 500, oy: 880, y: -20 * Math.sin(k * 3) }; return null; }, sfx: [{ f: 0.1, kind: 'flap' }, { f: 0.5, kind: 'flap' }] });

  // 10 range: a ruler of flowers, "200 HANA HANAS", a joke wink
  S.push({ draw: () => {
    const P = pen(131);
    P.line(110, 820, 890, 820, { w: 7 }); for (let i = 0; i <= 10; i++) P.line(110 + i * 78, 800, 110 + i * 78, 840, { w: 5 });
    P.group('flowers'); for (let i = 0; i < 5; i++) flower(P, 150 + i * 175, 720, 55, i % 2 ? 'pink' : '#ff9ec8');
    P.group('_tag'); const t = [[260, 920], [740, 920], [740, 1060], [260, 1060]]; P.fill(t, { color: 'yellow' }); P.path([...t, t[0]], { w: 6, overshoot: false }); P.text('200', 500, 1020, { size: 90 });
    P.group(null); P.stamp('RANGE?', 500, 450, { size: 120, color: 'navy', rot: -0.04 }); P.stamp('HANA HANAS (JOKE!)', 500, 1170, { size: 60, color: '#c2306a', rot: 0.03 });
    return P;
  }, anim: (g, k, D) => g === 'flowers' ? { ox: 500, oy: 720, rot: Math.sin(k * 2) * 0.02, y: Math.sin(k * 3) * 8 } : g === '_tag' ? { alpha: k > D * 0.35 ? 1 : 0, ox: 500, oy: 990, s: 0.6 + 0.4 * pop(k, D * 0.35), rot: Math.sin(k * 4) * 0.04 } : null, sfx: [{ f: 0.35, kind: 'boing' }] });

  // 11 outro
  S.push({ draw: () => {
    const P = pen(132);
    P.group('fruit'); fruit(P, 360, 720, 170);
    P.group('q'); P.stamp('?', 770, 650, { size: 380, color: '#c2306a', rot: 0.12 });
    P.group(null);
    P.stamp('WHICH FRUIT NEXT?', 480, 1030, { size: 80, color: 'purple', rot: -0.03 });
    P.stamp('COMMENT!', 480, 1160, { size: 76, color: 'red', rot: 0.04 });
    return P;
  }, anim: (g, k) => g === 'fruit' ? { ox: 360, oy: 720, y: Math.sin(k * 3) * 14, rot: Math.sin(k * 2) * 0.06 } : g === 'q' ? { ox: 770, oy: 760, rot: Math.sin(k * 5) * 0.12 } : null, sfx: [] });

  globalThis.FRUIT_SCENES = S;
})();
