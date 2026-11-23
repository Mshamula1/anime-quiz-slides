// THE HOST: an original stick-figure quiz host who walks around and narrates.
// Pure drawing: Host.draw(ctx, state) where state comes from film.js (a function of t).
(function () {
  const U = globalThis.U;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

  // 2-bone IK: joint between a and target b, bend = +1 clockwise / -1 counter-clockwise (canvas coords)
  function ik(ax, ay, bx, by, l1, l2, bend) {
    const dx = bx - ax, dy = by - ay;
    const d = clamp(Math.hypot(dx, dy), 1e-3, l1 + l2 - 1e-3);
    const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
    const base = Math.atan2(dy, dx), ang = base + bend * a;
    const jx = ax + Math.cos(ang) * l1, jy = ay + Math.sin(ang) * l1;
    // re-aim the end so an out-of-reach target is clamped onto the reach circle
    const e = Math.atan2(by - jy, bx - jx);
    return { jx, jy, ex: jx + Math.cos(e) * l2, ey: jy + Math.sin(e) * l2 };
  }

  // hand targets in local space (x forward, y down, relative to the shoulder, in units of s)
  function handTargets(st) {
    const { pose, t = 0, phase = 0 } = st;
    switch (pose) {
      case 'walk': return [[Math.cos(phase) * 50, 146, 1], [-Math.cos(phase) * 50, 146, 1]];
      case 'talk': return [[-22, 146, 1], [72 + Math.sin(t * 5) * 12, 62 + Math.sin(t * 7.3) * 22, 1]];
      case 'point': {
        const [lx, ly] = st.pointAt || [160, -40];
        const k = 168 / Math.max(1, Math.hypot(lx, ly));
        const jig = Math.sin(t * 9) * 4;
        return [[-4, 118, 1], [lx * k, ly * k + jig, 1]];
      }
      case 'think': return [[30, 74, -1], [26, -80, 1]];
      case 'cheer': { const b = Math.sin(t * 12) * 10; return [[-58, -150 + b, -1], [58, -150 - b, 1]]; }
      case 'shrug': return [[-76, 26, -1], [76, 26, 1]];
      case 'nervous': return [[6, -44, 1], [20, -46, 1]];
      case 'wave': return [[-22, 146, 1], [64 + Math.sin(t * 13) * 28, -132, 1]];
      default: return [[-26, 148, 1], [26, 148, 1]];
    }
  }

  function draw(ctx, st) {
    const { x, y, s = 0.85, face = 1, phase = 0, moving = false, mouth = 0, expr = 'smile', t = 0,
      hop = 0, tap = 0, shake = 0, look = 0, lookY = 0, sweat = false, lean = 0 } = st;
    const L1 = 100 * s, L2 = 100 * s, A1 = 84 * s, A2 = 84 * s, TOR = 150 * s, NECK = 22 * s, HR = 58 * s;
    const bob = moving ? Math.abs(Math.sin(phase)) * 9 * s : 0;
    const shx = shake ? U.noise1(t * 30, 7) * shake : 0;

    // shadow on the ground
    const air = clamp(hop / (160 * s));
    ctx.save(); ctx.fillStyle = `rgba(0,0,0,${0.28 * (1 - air * 0.6)})`;
    ctx.beginPath(); ctx.ellipse(x, y + 4 * s, 78 * s * (1 - air * 0.4), 14 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();

    const hipX = x + shx * 0.3, hipY = y - (L1 + L2) * (moving ? 0.95 : 0.985) - hop - bob;
    const neckX = hipX + face * lean * s, neckY = hipY - TOR;
    const headX = neckX + face * lean * 0.4 * s, headY = neckY - NECK - HR;
    const shX = neckX, shY = neckY + 14 * s;

    // legs (knees bend forward)
    const legs = [0, 1].map((i) => {
      const off = i * Math.PI;
      let fx = x + face * (moving ? Math.cos(phase + off) * 44 * s : (i ? 18 : -18) * s);
      let fy = y - hop - (moving ? Math.max(0, Math.sin(phase + off)) * 36 * s : 0);
      if (i === 1 && tap) fy -= tap * 22 * s;
      if (shake) fx += U.noise1(t * 30, 11 + i) * shake * 0.8;
      const hx = hipX + (i ? 4 : -4) * s * face;
      const k = ik(hx, hipY, fx, fy, L1, L2, -face);
      return [[hx, hipY], [k.jx, k.jy], [k.ex, k.ey]];
    });
    // arms
    const arms = handTargets(st).map(([lx, ly, bend]) => {
      const k = ik(shX, shY, shX + face * lx * s, shY + ly * s, A1, A2, bend * face);
      return [[shX, shY], [k.jx, k.jy], [k.ex, k.ey]];
    });
    const limbs = [arms[0], legs[0], [[hipX, hipY], [neckX, neckY]], legs[1], arms[1]];
    const path = (pts) => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); };

    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // white halo pass, then ink pass, so the figure reads on any background
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 26 * s;
    for (const l of limbs) { path(l); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(headX, headY, HR + 9 * s, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.strokeStyle = '#111'; ctx.lineWidth = 13 * s;
    for (const l of limbs) { path(l); ctx.stroke(); }
    // hands and feet
    ctx.fillStyle = '#111';
    for (const a of arms) { ctx.beginPath(); ctx.arc(a[2][0], a[2][1], 11 * s, 0, Math.PI * 2); ctx.fill(); }
    for (const l of legs) { ctx.beginPath(); ctx.ellipse(l[2][0] + face * 10 * s, l[2][1], 20 * s, 9 * s, 0, 0, Math.PI * 2); ctx.fill(); }
    // bow tie
    ctx.save(); ctx.translate(neckX, neckY + 4 * s); ctx.fillStyle = '#e8211b'; ctx.strokeStyle = '#111'; ctx.lineWidth = 4 * s;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-26 * s, -14 * s); ctx.lineTo(-26 * s, 14 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(26 * s, -14 * s); ctx.lineTo(26 * s, 14 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 7 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    // head
    ctx.beginPath(); ctx.arc(headX, headY, HR, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.lineWidth = 10 * s; ctx.strokeStyle = '#111'; ctx.stroke();

    // face (turned toward `face`)
    const fx = headX + face * 14 * s + look * 6 * s, fy = headY + lookY * 5 * s;
    const blink = ((t + 0.37) % 3.3) < 0.11 && expr !== 'happy' && expr !== 'grin';
    ctx.fillStyle = '#111'; ctx.strokeStyle = '#111'; ctx.lineWidth = 6 * s;
    for (const ex of [-17, 17]) {
      const ex0 = fx + ex * s, ey0 = fy - 10 * s;
      if (expr === 'happy' || expr === 'grin') { ctx.beginPath(); ctx.arc(ex0, ey0 + 4 * s, 8 * s, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
      else if (blink) { ctx.beginPath(); ctx.moveTo(ex0 - 7 * s, ey0); ctx.lineTo(ex0 + 7 * s, ey0); ctx.stroke(); }
      else { ctx.beginPath(); ctx.ellipse(ex0, ey0, (expr === 'wide' ? 9 : 7) * s, (expr === 'wide' ? 11 : 9) * s, 0, 0, Math.PI * 2); ctx.fill(); }
      // brows
      if (expr === 'worried' || expr === 'think' || expr === 'wide') {
        ctx.beginPath();
        const tilt = expr === 'worried' ? 1 : expr === 'think' ? (ex < 0 ? -0.6 : 0.9) : 0;
        ctx.moveTo(ex0 - 10 * s, ey0 - 20 * s - (ex < 0 ? -tilt : tilt) * 4 * s - (expr === 'wide' ? 6 * s : 0));
        ctx.lineTo(ex0 + 10 * s, ey0 - 20 * s + (ex < 0 ? -tilt : tilt) * 4 * s - (expr === 'wide' ? 6 * s : 0));
        ctx.stroke();
      }
    }
    // mouth: opens with the voice, otherwise shows the expression
    const mx = fx + face * 2 * s, my = fy + 24 * s;
    if (mouth > 0.06) {
      ctx.beginPath(); ctx.ellipse(mx, my, (11 + mouth * 5) * s, (3 + mouth * 15) * s, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#5a0f12'; ctx.fill(); ctx.lineWidth = 5 * s; ctx.stroke();
    } else if (expr === 'grin') {
      ctx.beginPath(); ctx.moveTo(mx - 20 * s, my - 6 * s); ctx.quadraticCurveTo(mx, my + 26 * s, mx + 20 * s, my - 6 * s); ctx.closePath();
      ctx.fillStyle = '#5a0f12'; ctx.fill(); ctx.lineWidth = 5 * s; ctx.stroke();
    } else if (expr === 'worried') {
      ctx.beginPath(); ctx.moveTo(mx - 14 * s, my + 4 * s);
      for (let i = 1; i <= 4; i++) ctx.lineTo(mx - 14 * s + i * 7 * s, my + (i % 2 ? -2 : 4) * s);
      ctx.lineWidth = 5 * s; ctx.stroke();
    } else if (expr === 'think') {
      ctx.beginPath(); ctx.moveTo(mx - 10 * s, my + 2 * s); ctx.lineTo(mx + 12 * s, my - 2 * s); ctx.lineWidth = 5 * s; ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(mx, my - 6 * s, 14 * s, Math.PI * 0.2, Math.PI * 0.8); ctx.lineWidth = 5 * s; ctx.stroke();
    }
    if (sweat) {
      const sx = headX - face * 48 * s, sy = headY - 30 * s + ((t * 40) % 20) * s;
      ctx.beginPath(); ctx.moveTo(sx, sy - 16 * s); ctx.quadraticCurveTo(sx + 12 * s, sy + 6 * s, sx, sy + 8 * s); ctx.quadraticCurveTo(sx - 12 * s, sy + 6 * s, sx, sy - 16 * s);
      ctx.fillStyle = '#7fd0ff'; ctx.fill(); ctx.lineWidth = 3 * s; ctx.stroke();
    }
    // original pirate tricorn: black felt, gold trim, a red feather (bounces a little with the body)
    {
      const R = HR, hb = Math.sin(t * 9) * (moving ? 2 : 0.6) * s - (hop > 4 ? 6 * s : 0);
      ctx.save(); ctx.translate(headX - face * 4 * s, headY - R * 0.74 + hb); ctx.rotate(-face * 0.1); ctx.scale(face, 1);
      ctx.lineJoin = 'round';
      const crown = () => { ctx.beginPath(); ctx.moveTo(-0.66 * R, 0); ctx.quadraticCurveTo(-0.6 * R, -1.02 * R, 0, -1.04 * R); ctx.quadraticCurveTo(0.6 * R, -1.02 * R, 0.66 * R, 0); ctx.closePath(); };
      const brim = () => { // three-cornered: two upturned side points and a front point
        ctx.beginPath(); ctx.moveTo(-1.38 * R, -0.98 * R);
        ctx.quadraticCurveTo(-1.0 * R, 0.05 * R, 0.12 * R, 0.24 * R); ctx.quadraticCurveTo(1.0 * R, 0.05 * R, 1.38 * R, -0.98 * R);
        ctx.quadraticCurveTo(0.85 * R, -0.5 * R, 0, -0.58 * R); ctx.quadraticCurveTo(-0.85 * R, -0.5 * R, -1.38 * R, -0.98 * R); ctx.closePath();
      };
      // feather behind the crown
      ctx.beginPath(); ctx.moveTo(-0.3 * R, -0.5 * R); ctx.bezierCurveTo(-0.9 * R, -1.3 * R, -0.6 * R, -1.9 * R, -0.05 * R, -1.75 * R);
      ctx.bezierCurveTo(-0.45 * R, -1.45 * R, -0.35 * R, -0.95 * R, -0.1 * R, -0.55 * R); ctx.closePath();
      ctx.fillStyle = '#e23b3b'; ctx.fill(); ctx.lineWidth = 4 * s; ctx.strokeStyle = '#111'; ctx.stroke();
      ctx.lineWidth = 12 * s; ctx.strokeStyle = '#fff'; crown(); ctx.stroke(); brim(); ctx.stroke();
      ctx.fillStyle = '#1d1a1f'; crown(); ctx.fill(); ctx.lineWidth = 5 * s; ctx.strokeStyle = '#111'; ctx.stroke();
      ctx.fillStyle = '#26222a'; brim(); ctx.fill(); ctx.lineWidth = 9 * s; ctx.strokeStyle = '#111'; ctx.stroke(); ctx.lineWidth = 4 * s; ctx.strokeStyle = '#e8b923'; ctx.stroke();
      ctx.restore();
    }
    if (st.bubble) { // thought bubble with a bobbing "?"
      const bx = headX + face * 118 * s, by = headY - 140 * s + Math.sin(t * 5) * 5 * s;
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 5 * s;
      for (const [ox, oy, r] of [[-62, 72, 7], [-40, 44, 11]]) { ctx.beginPath(); ctx.arc(bx + face * ox * s, by + oy * s, r * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(bx, by, 30 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.font = `900 ${42 * s}px Inter, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#c8262c'; ctx.fillText('?', bx, by + 2 * s);
    }
    ctx.restore();
  }

  globalThis.Host = { draw };
})();
