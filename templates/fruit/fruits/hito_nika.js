// Devil Fruit Files #1: Hito Hito no Mi, Model: Nika. One sketch per narration line (same order as hito_nika.json).
// Original drawings of generic things only: no characters, no official fruit design.
(function () {
  const { pen, ellPoly } = globalThis.Sketch;

  // an original, generic fruit: lumpy round body, curly stem, one leaf; shaded with hatching + a warm pencil wash
  function fruit(P, cx, cy, r, { face = false, bite = false } = {}) {
    P.ellipse(cx, cy, r, r * 0.94, { lump: 0.045, lumps: 6, w: 5.5 });
    P.curve([[cx - 4, cy - r * 0.9], [cx + 6, cy - r * 1.12], [cx + r * 0.2, cy - r * 1.28], [cx + r * 0.32, cy - r * 1.26]], { w: 5 });
    P.curve([[cx + 10, cy - r * 1.02], [cx + r * 0.4, cy - r * 1.32], [cx + r * 0.82, cy - r * 1.22], [cx + r * 0.62, cy - r * 1.02], [cx + 10, cy - r * 1.02]], { w: 4.5 });
    P.line(cx + 14, cy - r * 1.04, cx + r * 0.62, cy - r * 1.18, { w: 2.5, alpha: 0.7 });
    if (bite) {
      P.ellipse(cx + r * 0.95, cy - r * 0.2, r * 0.28, r * 0.24, { a0: 1.7, sweep: 2.9, w: 4.5 });
      P.ellipse(cx + r * 0.95, cy + r * 0.25, r * 0.26, r * 0.22, { a0: 1.7, sweep: 2.9, w: 4.5 });
    }
    // shading crescent (bottom right) + highlight left alone
    P.hatch(ellPoly(cx + r * 0.12, cy + r * 0.1, r * 0.86, r * 0.82, -0.6, 2.4), { angle: 0.75, gap: 13 });
    P.hatch(ellPoly(cx, cy, r * 0.93, r * 0.87), { angle: -0.55, gap: 11, color: 'orange', alpha: 0.42, w: 3.4 });
    P.hatch([[cx + 14, cy - r * 1.04], [cx + r * 0.4, cy - r * 1.28], [cx + r * 0.78, cy - r * 1.2], [cx + r * 0.6, cy - r * 1.04]], { angle: 0.4, gap: 8, color: 'green', alpha: 0.6 });
    if (face) {
      P.ellipse(cx - r * 0.3, cy - r * 0.12, r * 0.13, r * 0.18, { w: 4.5 }); P.ellipse(cx + r * 0.22, cy - r * 0.12, r * 0.13, r * 0.18, { w: 4.5 });
      P.hatch(ellPoly(cx - r * 0.24, cy - r * 0.1, r * 0.06, r * 0.08), { angle: 0, gap: 3, alpha: 0.9, w: 3 });
      P.hatch(ellPoly(cx + r * 0.28, cy - r * 0.1, r * 0.06, r * 0.08), { angle: 0, gap: 3, alpha: 0.9, w: 3 });
      P.curve([[cx - r * 0.25, cy + r * 0.3], [cx, cy + r * 0.38], [cx + r * 0.3, cy + r * 0.24]], { w: 4.5 });
    }
    // cast shadow
    P.hatch(ellPoly(cx + r * 0.15, cy + r * 1.02, r * 0.8, r * 0.12), { angle: 0.1, gap: 7, alpha: 0.35, color: 'gray' });
  }
  function arrow(P, pts, o = {}) {
    P.curve(pts, o);
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    P.line(b[0], b[1], b[0] - Math.cos(ang - 0.5) * 30, b[1] - Math.sin(ang - 0.5) * 30, o);
    P.line(b[0], b[1], b[0] - Math.cos(ang + 0.5) * 30, b[1] - Math.sin(ang + 0.5) * 30, o);
  }
  function burst(P, cx, cy, r, o = {}) {
    const pts = []; for (let i = 0; i <= 22; i++) { const a = (i / 22) * Math.PI * 2, rr = i % 2 ? r * 0.62 : r; pts.push([cx + Math.cos(a) * rr * 1.3, cy + Math.sin(a) * rr]); }
    P.path(pts, { overshoot: false, ...o });
  }

  const S = [];

  // 0 intro: the fruit + its name
  S.push(() => {
    const P = pen(1);
    P.text('Hito Hito no Mi', 490, 420, { size: 110, speed: 2.2 });
    P.text('Model: Nika', 490, 520, { size: 74, color: 'red', speed: 2.2 });
    fruit(P, 480, 820, 170);
    P.text('~ the Human-Human Fruit ~', 490, 1110, { size: 60, color: 'blue', speed: 2.4 });
    return P;
  });
  // 1 800 years: hourglass + a fruit zooming away
  S.push(() => {
    const P = pen(2), cx = 330, cy = 800;
    P.line(cx - 150, cy - 260, cx + 150, cy - 260, { w: 7 }); P.line(cx - 150, cy + 260, cx + 150, cy + 260, { w: 7 });
    P.line(cx - 130, cy - 260, cx - 130, cy + 260, { w: 5 }); P.line(cx + 130, cy - 260, cx + 130, cy + 260, { w: 5 });
    P.curve([[cx - 95, cy - 250], [cx - 90, cy - 120], [cx - 12, cy - 18], [cx - 12, cy + 18], [cx - 90, cy + 120], [cx - 95, cy + 250]], { w: 5 });
    P.curve([[cx + 95, cy - 250], [cx + 90, cy - 120], [cx + 12, cy - 18], [cx + 12, cy + 18], [cx + 90, cy + 120], [cx + 95, cy + 250]], { w: 5 });
    P.hatch([[cx - 80, cy + 250], [cx - 70, cy + 170], [cx, cy + 120], [cx + 70, cy + 170], [cx + 80, cy + 250]], { angle: 0.3, gap: 8, color: 'yellow', alpha: 0.75 });
    P.hatch([[cx - 60, cy - 140], [cx + 60, cy - 140], [cx + 10, cy - 30], [cx - 10, cy - 30]], { angle: 0.3, gap: 8, color: 'yellow', alpha: 0.75 });
    P.line(cx, cy - 20, cx, cy + 130, { w: 2.5, color: 'orange' });
    P.text('800', 720, 560, { size: 170, speed: 2 });
    P.text('YEARS', 720, 680, { size: 84, speed: 2 });
    fruit(P, 760, 950, 72);
    for (const [y, l] of [[920, 120], [960, 160], [1000, 110]]) P.line(660 - l, y, 650, y, { w: 4, alpha: 0.7 });
    P.text('...gone!', 770, 1110, { size: 60, color: 'red' });
    return P;
  });
  // 2 a will of its own: the fruit with a sly face, sneaking off
  S.push(() => {
    const P = pen(3);
    P.text('a will of its own?', 490, 420, { size: 96 });
    fruit(P, 470, 790, 190, { face: true });
    // tiny footprints leading off
    for (let i = 0; i < 4; i++) { const x = 690 + i * 60, y = 1060 - (i % 2) * 22; P.ellipse(x, y, 14, 9, { w: 3.5 }); }
    arrow(P, [[700, 1150], [800, 1160], [900, 1120]], { w: 4.5, color: 'red' });
    return P;
  });
  // 3 renamed in the records: open book, old name crossed out
  S.push(() => {
    const P = pen(4), cx = 480, cy = 790;
    P.curve([[cx - 380, cy - 220], [cx - 200, cy - 250], [cx, cy - 210]], { w: 5 }); P.curve([[cx, cy - 210], [cx + 200, cy - 250], [cx + 380, cy - 220]], { w: 5 });
    P.line(cx - 380, cy - 220, cx - 380, cy + 230, { w: 5 }); P.line(cx + 380, cy - 220, cx + 380, cy + 230, { w: 5 });
    P.curve([[cx - 380, cy + 230], [cx - 200, cy + 200], [cx, cy + 240]], { w: 5 }); P.curve([[cx, cy + 240], [cx + 200, cy + 200], [cx + 380, cy + 230]], { w: 5 });
    P.line(cx, cy - 210, cx, cy + 240, { w: 4 });
    for (let i = 0; i < 7; i++) P.curve([[cx - 340, cy - 150 + i * 52], [cx - 220, cy - 158 + i * 52], [cx - 110, cy - 146 + i * 52], [cx - 40, cy - 152 + i * 52]], { w: 3, alpha: 0.5, color: 'gray' });
    P.text('Hito Hito', cx + 190, cy - 130, { size: 62 });
    P.text('no Mi', cx + 190, cy - 75, { size: 62 });
    for (let i = 0; i < 4; i++) P.line(cx + 70, cy - 150 + i * 22, cx + 320, cy - 120 + i * 18, { w: 5, color: 'red' });
    P.text('Gomu Gomu', cx + 190, cy + 40, { size: 64, color: 'blue' });
    P.text('no Mi', cx + 190, cy + 100, { size: 64, color: 'blue' });
    P.rect(cx - 330, cy + 290, 330, 92, { w: 5, color: 'red' });
    P.text('CLASSIFIED', cx - 165, cy + 336, { size: 62, color: 'red' });
    return P;
  });
  // 4 stolen from a government ship
  S.push(() => {
    const P = pen(5), cx = 450, cy = 860;
    P.curve([[cx - 280, cy - 30], [cx - 220, cy + 80], [cx + 200, cy + 80], [cx + 300, cy - 40]], { w: 6 });
    P.line(cx - 280, cy - 30, cx + 300, cy - 40, { w: 5 });
    P.line(cx - 40, cy - 30, cx - 40, cy - 440, { w: 6 }); P.line(cx + 140, cy - 35, cx + 140, cy - 340, { w: 5 });
    P.curve([[cx - 34, cy - 420], [cx + 60, cy - 330], [cx + 70, cy - 230], [cx - 34, cy - 140]], { w: 4.5 });
    P.curve([[cx + 146, cy - 320], [cx + 220, cy - 260], [cx + 225, cy - 180], [cx + 146, cy - 110]], { w: 4.5 });
    for (let i = 0; i < 4; i++) P.circle(cx - 180 + i * 90, cy + 25, 16, { w: 3.5 });
    P.hatch([[cx - 270, cy - 20], [cx + 290, cy - 30], [cx + 200, cy + 72], [cx - 215, cy + 72]], { angle: 0.2, gap: 10, color: 'brown', alpha: 0.5 });
    for (let k = 0; k < 3; k++) P.curve([[60, cy + 110 + k * 50], [180, cy + 90 + k * 50], [300, cy + 120 + k * 50], [420, cy + 95 + k * 50], [560, cy + 120 + k * 50], [700, cy + 95 + k * 50], [880, cy + 115 + k * 50]], { w: 4, color: 'blue', alpha: 0.75 });
    // small chest on deck
    P.rect(cx + 180, cy - 110, 90, 70, { w: 4 }); P.curve([[cx + 180, cy - 110], [cx + 225, cy - 150], [cx + 270, cy - 110]], { w: 4 });
    burst(P, 760, 470, 120, { w: 5, color: 'red' });
    P.text('STOLEN!', 760, 475, { size: 74, color: 'red' });
    return P;
  });
  // 5 a little chest, a boy, dessert
  S.push(() => {
    const P = pen(6);
    P.line(60, 1010, 940, 990, { w: 6 }); P.line(80, 1040, 920, 1025, { w: 3, alpha: 0.6 });
    // open chest
    const x = 140, y = 790;
    P.rect(x, y, 230, 200, { w: 5 }); P.line(x, y + 60, x + 230, y + 60, { w: 4 });
    P.path([[x, y], [x - 20, y - 150], [x + 210, y - 150], [x + 230, y]], { w: 5 });
    P.rect(x + 95, y + 40, 40, 50, { w: 4 });
    P.hatch([[x, y], [x + 230, y], [x + 230, y + 200], [x, y + 200]], { angle: 0.25, gap: 12, color: 'brown', alpha: 0.5 });
    // plate with the bitten fruit
    P.ellipse(640, 960, 230, 52, { w: 5 }); P.ellipse(640, 958, 170, 34, { w: 3, alpha: 0.6 });
    fruit(P, 620, 820, 110, { bite: true });
    P.text('dessert?!', 640, 520, { size: 100, color: 'red' });
    arrow(P, [[560, 580], [500, 640], [520, 690]], { w: 4.5, color: 'red' });
    return P;
  });
  // 6 rubber: a stretched band, a bouncing ball, a bullet bouncing off
  S.push(() => {
    const P = pen(7);
    P.circle(150, 560, 16, { w: 5 }); P.circle(820, 560, 16, { w: 5 });
    P.curve([[150, 545], [480, 610], [820, 545]], { w: 7, color: 'brown' }); P.curve([[150, 575], [480, 680], [820, 575]], { w: 7, color: 'brown' });
    P.text('stretch!', 480, 450, { size: 80 });
    P.circle(300, 980, 70, { w: 5 }); P.hatch(ellPoly(310, 990, 58, 58), { angle: 0.6, gap: 10, color: 'red', alpha: 0.55 });
    for (const [a, b, c] of [[[300, 900], [360, 790], [430, 900]], [[430, 900], [480, 830], [530, 900]]]) P.curve([a, b, c], { w: 3, alpha: 0.6 });
    P.text('BOING!', 330, 790, { size: 64, color: 'red' });
    // bullet bouncing off
    P.path([[620, 930], [720, 930], [750, 950], [720, 970], [620, 970], [620, 930]], { w: 4.5, overshoot: false });
    P.hatch([[622, 932], [718, 932], [746, 950], [718, 968], [622, 968]], { angle: 0, gap: 7, color: 'gray', alpha: 0.6 });
    arrow(P, [[770, 940], [850, 870], [900, 900]], { w: 4.5 });
    P.text('bulletproof', 760, 1090, { size: 62, color: 'blue' });
    return P;
  });
  // 7 the heartbeat: a drum and a pounding heart
  S.push(() => {
    const P = pen(8), cx = 360, cy = 860;
    P.ellipse(cx, cy - 150, 200, 55, { w: 5.5 }); P.line(cx - 200, cy - 150, cx - 200, cy + 130, { w: 5 }); P.line(cx + 200, cy - 150, cx + 200, cy + 130, { w: 5 });
    P.ellipse(cx, cy + 130, 200, 55, { a0: 0, sweep: Math.PI, w: 5 });
    const zz = []; for (let i = 0; i <= 10; i++) zz.push([cx - 190 + i * 38, cy - 90 + (i % 2) * 190]); P.path(zz, { w: 3.5 });
    P.hatch([[cx - 198, cy - 150], [cx + 198, cy - 150], [cx + 198, cy + 130], [cx - 198, cy + 130]], { angle: 0.15, gap: 12, color: 'brown', alpha: 0.4 });
    P.line(cx + 120, cy - 330, cx + 30, cy - 175, { w: 6 }); P.circle(cx + 128, cy - 345, 18, { w: 5 });
    // heart
    const hx = 730, hy = 600;
    P.curve([[hx, hy + 120], [hx - 120, hy + 10], [hx - 110, hy - 70], [hx - 50, hy - 90], [hx, hy - 40]], { w: 6, color: 'red' });
    P.curve([[hx, hy - 40], [hx + 50, hy - 90], [hx + 110, hy - 70], [hx + 120, hy + 10], [hx, hy + 120]], { w: 6, color: 'red' });
    P.hatch([[hx, hy + 110], [hx - 105, hy + 10], [hx - 95, hy - 60], [hx - 45, hy - 78], [hx, hy - 30], [hx + 45, hy - 78], [hx + 95, hy - 60], [hx + 105, hy + 10]], { angle: -0.6, gap: 10, color: 'red', alpha: 0.55 });
    for (const r of [150, 185]) P.ellipse(hx, hy + 10, r, r * 0.9, { a0: -0.5, sweep: 1.0, w: 4, alpha: 0.7 });
    P.text('ba-DUM', 740, 820, { size: 84, color: 'red' });
    P.text('ba-DUM', 740, 920, { size: 70, color: 'red', alpha: 0.7 });
    return P;
  });
  // 8 sun god + broken chains
  S.push(() => {
    const P = pen(9), cx = 480, cy = 780;
    P.line(60, cy + 60, 940, cy + 60, { w: 5 });
    P.ellipse(cx, cy + 60, 190, 190, { a0: Math.PI, sweep: Math.PI, w: 6 });
    for (let i = 0; i < 11; i++) { const a = Math.PI + 0.12 + i * (Math.PI - 0.24) / 10; P.line(cx + Math.cos(a) * 225, cy + 60 + Math.sin(a) * 225, cx + Math.cos(a) * (300 + (i % 2) * 60), cy + 60 + Math.sin(a) * (300 + (i % 2) * 60), { w: 5, color: 'orange' }); }
    P.hatch(ellPoly(cx, cy + 60, 182, 182, Math.PI, Math.PI * 2), { angle: -0.4, gap: 10, color: 'yellow', alpha: 0.85 });
    P.hatch(ellPoly(cx, cy + 60, 182, 182, Math.PI * 1.55, Math.PI * 2), { angle: 0.5, gap: 12, color: 'orange', alpha: 0.5 });
    // broken chain: two links on each side with a gap
    for (const [x, rot] of [[260, -0.2], [380, 0.2], [620, -0.2], [740, 0.2]]) P.ellipse(x, 1060, 64, 32, { rot, w: 5.5 });
    P.line(470, 1030, 500, 1000, { w: 4, color: 'red' }); P.line(510, 1090, 540, 1120, { w: 4, color: 'red' }); P.line(480, 1095, 450, 1125, { w: 4, color: 'red' });
    P.text('free!', 500, 1190, { size: 70, color: 'red' });
    return P;
  });
  // 9 rubber world: wobbly ground, a bouncing rock, a lightbulb of imagination
  S.push(() => {
    const P = pen(10);
    const g = []; for (let i = 0; i <= 18; i++) { const x = 60 + i * 48; g.push([x, 1010 + Math.sin(i * 0.9) * 50]); } P.curve(g, { w: 6 });
    for (let k = 1; k <= 2; k++) { const g2 = g.map(([x, y]) => [x, y + k * 40 + Math.sin(x * 0.02 + k) * 10]); P.curve(g2, { w: 3, alpha: 0.55 }); }
    P.ellipse(320, 640, 110, 80, { lump: 0.08, lumps: 5, w: 5.5 }); P.hatch(ellPoly(330, 650, 96, 68, -0.5, 2.6), { angle: 0.8, gap: 11 });
    for (const [a, b, c] of [[[330, 990], [300, 820], [320, 730]]]) P.curve([a, b, c], { w: 3, alpha: 0.5 });
    P.text('BOING!', 330, 470, { size: 88, color: 'red' });
    // lightbulb
    const bx = 720, by = 600;
    P.curve([[bx - 60, by + 90], [bx - 100, by], [bx - 70, by - 90], [bx, by - 120], [bx + 70, by - 90], [bx + 100, by], [bx + 60, by + 90]], { w: 5.5 });
    P.rect(bx - 55, by + 90, 110, 70, { w: 4.5 }); P.line(bx - 55, by + 115, bx + 55, by + 115, { w: 3 }); P.line(bx - 55, by + 138, bx + 55, by + 138, { w: 3 });
    P.curve([[bx - 30, by + 90], [bx - 20, by - 10], [bx, by + 20], [bx + 20, by - 10], [bx + 30, by + 90]], { w: 3.5, color: 'orange' });
    for (let i = 0; i < 7; i++) { const a = -Math.PI + 0.3 + i * 0.42; P.line(bx + Math.cos(a) * 140, by - 10 + Math.sin(a) * 150, bx + Math.cos(a) * 190, by - 10 + Math.sin(a) * 200, { w: 4.5, color: 'yellow' }); }
    P.hatch(ellPoly(bx, by - 10, 85, 95), { angle: -0.5, gap: 11, color: 'yellow', alpha: 0.6 });
    P.text('imagination!', 720, 860, { size: 66, color: 'blue' });
    return P;
  });
  // 10 outro: the fruit again + which one next?
  S.push(() => {
    const P = pen(11);
    fruit(P, 380, 760, 150);
    P.text('?', 760, 700, { size: 360, color: 'red', speed: 2 });
    P.text('Which fruit next?', 490, 1060, { size: 96, speed: 2 });
    arrow(P, [[490, 1130], [470, 1190], [500, 1250]], { w: 5, color: 'red' });
    return P;
  });

  globalThis.FRUIT_SCENES = S;
})();
