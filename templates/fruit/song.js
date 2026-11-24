// THE SONG: a light, laid-back groove (soft kick, rim and shaker, round bass, gentle marimba) kept well under
// the narration, plus pencil, marker, stamp and eraser foley timed to every sketch.
//   node song.js   (STEMS=1 writes stems, LUFS=-14 masters for YouTube)
const path = require('path');
const { SR, Bus, reverb, pingpong } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const sc = require('./score');
const { BEAT, DURATION, m, clock, scenes, ERASE } = sc;
// load the sketches in node so the stamp sounds land exactly when each stamp pops on screen
globalThis.U = require('./engine/util');
require('./sketch.js'); require('./fruit_scenes.js');
const DEFS = globalThis.FRUIT_SCENES.map((d) => (typeof d === 'function' ? { draw: d } : d));
const SKETCHES = DEFS.map((d) => d.draw());

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const drums = bus(), bass = bus(), keys = bus(), lead = bus(), brass = bus(), foley = bus(), fx = bus(), vo = bus();
const verb = bus(), dly = bus();
const BARS = Math.ceil(DURATION / clock.BAR);
const tail = DURATION - 0.9;
const introEnd = scenes[0].end; // intro: lighter groove under the title

// ---------- drums ----------
const K = I.kick({ punch: 0.4, tail: 0.5 }), RIM = I.rim(1.0, 4), SHK = [I.shaker(1, 15), I.shaker(0, 16)];
const kicks = [];
clock.eachStep(0, BARS, 16, (t, b, s) => {
  if (t > tail) return;
  const light = t < introEnd;
  if (s === 0 || (!light && s === 10)) { drums.addMono(K, t, 0.45); kicks.push(t); }
  if (!light && (s === 4 || s === 12)) drums.addMono(RIM, t, 0.22, 0.1);
  if (s % 2 === 0) drums.addMono(SHK[(s / 2) % 2], t, 0.06, 0.25);
});
// ---------- bass: syncopated, bouncing ----------
clock.eachStep(0, BARS, 16, (t, b, s) => {
  if (t > tail) return;
  const c = sc.chordAt(t); if (!c) return;
  const R = c.bass + 12, pat = { 0: R, 6: R + 7, 8: R, 14: R + 12 };
  if (pat[s] === undefined) return;
  bass.addMono(I.bass(pat[s], BEAT * 0.7, { sub: 0.9, bright: 0.15 }), t, 0.4);
});
// ---------- marimba ostinato + pizzicato hook ----------
clock.eachStep(0, BARS, 8, (t, b, s) => {
  if (t > tail) return;
  const c = sc.chordAt(t); if (!c) return;
  const tones = c.notes.map((x) => x + 12), order = [0, 2, 1, 2, 0, 2, 1, 2];
  const x = I.marimba(tones[order[s]], { thock: 0.3 }); keys.addMono(x, t, s % 2 ? 0.07 : 0.11, s % 2 ? 0.35 : -0.35); verb.addMono(x, t, 0.05);
});
const HOOK = [['A4', 0], ['C5', 1], ['E5', 2], ['A5', 3], ['G5', 5], ['E5', 6], ['D5', 7], ['E5', 8], ['C5', 10], ['A4', 12], ['B4', 13], ['C5', 14]];
function hook(t0, gain = 1) { for (const [n, s] of HOOK) { const t = t0 + s * BEAT / 2; if (t > tail) continue; const p = I.pizz(m(n)); lead.addMono(p, t, 0.3 * gain, 0.15); dly.addMono(p, t, 0.06 * gain); } }
hook(0, 0.6); hook(scenes[scenes.length - 1].drawT0, 0.5);
// ---------- brass stab on every new sketch ----------
function stab(t, g = 1) { for (const n of ['A3', 'E4', 'A4']) { const x = I.brassNote(m(n), 0.28, { bright: 0.9, stab: 1, seed: m(n) }); brass.addStereo(x.L, x.R, t, 0.16 * g); } }

// ---------- foley ----------
scenes.forEach((s, i) => {
  const sk = SKETCHES[i]; if (!sk) return;
  const dd = s.drawT1 - s.drawT0;
  // pencil + marker scratching while it draws (quick, busy)
  let t = s.drawT0, k = 0;
  while (t < s.drawT1 - 0.06) { const len = 0.1 + ((k * 7919 + i * 31) % 100) / 100 * 0.18; foley.addMono(I.scribble(len, 100 + i * 17 + k), t, 0.1, ((k % 3) - 1) * 0.25); t += len + 0.03; k++; }
  // stamps slam on
  for (const c of globalThis.Sketch.cues(sk)) { const tt = s.drawT0 + c.f * dd; foley.addMono(I.thud(95, 0.1), tt, 0.35); }
  // a sparkle chime when the sketch is finished
  // sounds for the little animation after each sketch
  const ACT = {
    whoosh: () => I.noiseSweep(0.45, 300, 2500, { q: 0.9, shape: (x) => Math.sin(x * Math.PI), pink: true }),
    zip: () => I.noiseSweep(0.25, 1200, 4000, { q: 1.2, shape: (x) => Math.sin(x * Math.PI), pink: true }),
    flap: () => I.paperFwip(0.9, i + 9), thud: () => I.thud(80, 0.14), chomp: () => I.thwack(),
    boing: () => I.boing(), beat: () => I.kick({ punch: 0.5, tail: 0.4 }), clink: () => I.woodTick(1.6),
    swell: () => I.noiseSweep(1.0, 200, 1500, { q: 0.6, shape: (x) => x, pink: true }),
  };
  const GAINS = { whoosh: 0.22, zip: 0.14, flap: 0.3, thud: 0.45, chomp: 0.3, boing: 0.16, beat: 0.35, clink: 0.25, swell: 0.12 };
  const Dw = Math.max(0.6, Math.min(s.eraseT0, DURATION) - s.drawT1);
  for (const e of (DEFS[i].sfx || [])) { const tt = s.drawT1 + (e.f !== undefined ? e.f * Dw : e.at); if (tt < s.eraseT0 && ACT[e.kind]) fx.addMono(ACT[e.kind](), tt, GAINS[e.kind]); }
  // eraser: quick rubs + a whoosh
  if (isFinite(s.eraseT0)) {
    const rows = 6;
    for (let r = 0; r < rows; r++) foley.addMono(I.noiseSweep(ERASE / rows * 0.95, 900, 2200, { q: 0.7, shape: (x) => Math.sin(x * Math.PI), pink: true }), s.eraseT0 + r * ERASE / rows, 0.16, r % 2 ? 0.3 : -0.3);
    fx.addMono(I.noiseSweep(0.35, 400, 3000, { q: 0.8, shape: (x) => x * x, pink: true }), s.eraseT1 - 0.3, 0.08);
  }
});
fx.addMono(I.paperFwip(1.2, 1), 0.02, 0.3);

// ---------- narration ----------
for (const s of scenes) {
  const b = MIX.loadAudio(path.join(__dirname, s.file), { at: s.at, gain: 1, length: DURATION });
  for (let i = 0; i < Math.min(b.n, N); i++) { vo.L[i] += b.L[i]; vo.R[i] += b.R[i]; }
}

// ---------- mix ----------
MIX.sidechain([bass, keys], kicks, { depth: 0.25 });
MIX.duck([drums, bass, keys, lead], vo, { depth: 0.6, attack: 0.02, release: 0.25, threshold: 0.03 });
const stems = { drums, bass, keys, lead, brass, foley, fx, vo, verb: reverb(verb, { room: 0.6, damp: 0.4 }), dly: pingpong(dly, BEAT * 0.75, 0.3, 4000) };
const GAIN = { drums: 0.3, bass: 0.35, keys: 0.6, lead: 0.5, brass: 0, foley: 0.6, fx: 0.6, vo: 3.0, verb: 0.5, dly: 0.4 };
const out = path.join(__dirname, 'out');
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? out : null });
MIX.highpass(mix, 25);
MIX.fadeOut(mix, DURATION - 0.9, DURATION);
const M = MIX.master(mix, parseFloat(process.env.DRIVE || '0.8'), undefined, { lufs: process.env.LUFS ? parseFloat(process.env.LUFS) : -14 });
MIX.writeWav(path.join(out, 'music.wav'), mix);
console.log(`wrote out/music.wav (${DURATION.toFixed(2)}s${M.lufs !== undefined ? `, ${M.lufs.toFixed(1)} LUFS at drive ${M.drive.toFixed(2)}` : ''})`);
