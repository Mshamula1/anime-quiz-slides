// THE SONG: an upbeat, mischievous adventure groove (punchy drums, slap-ish bass, marimba + pizzicato hook,
// brass stabs) under the narration, plus pencil, marker, stamp and eraser foley timed to every sketch.
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
const SKETCHES = globalThis.FRUIT_SCENES.map((f) => f());

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const drums = bus(), bass = bus(), keys = bus(), lead = bus(), brass = bus(), foley = bus(), fx = bus(), vo = bus();
const verb = bus(), dly = bus();
const BARS = Math.ceil(DURATION / clock.BAR);
const tail = DURATION - 0.9;
const introEnd = scenes[0].end; // intro: lighter groove under the title

// ---------- drums ----------
const K = I.kick({ punch: 1.1 }), SN = I.snare({ tone: 0.5, snap: 0.9 }), CL = I.clap(), HC = [I.hat(false, 11), I.hat(false, 12)], HO = I.hat(true, 14);
const kicks = [];
clock.eachStep(0, BARS, 16, (t, b, s) => {
  if (t > tail) return;
  const light = t < introEnd;
  if (s === 0 || s === 10 || (!light && (s === 3 || s === 8))) { drums.addMono(K, t, light ? 0.6 : 0.85); kicks.push(t); }
  if (!light && (s === 4 || s === 12)) { drums.addMono(SN, t, 0.4); drums.addMono(CL, t, 0.35, 0.1); verb.addMono(CL, t, 0.12); }
  if (light && (s === 4 || s === 12)) drums.addMono(CL, t, 0.3);
  if (s % 2 === 0) drums.addMono(s % 8 === 6 ? HO : HC[(s / 2) % 2], t, s % 8 === 6 ? 0.08 : 0.12, -0.25);
  else if (!light) drums.addMono(HC[s % 2], t, 0.05, 0.3);
});
// ---------- bass: syncopated, bouncing ----------
clock.eachStep(0, BARS, 16, (t, b, s) => {
  if (t > tail) return;
  const c = sc.chordAt(t); if (!c) return;
  const R = c.bass + 12, pat = { 0: R, 3: R, 6: R + 12, 8: R + 7, 10: R, 11: R + 10, 14: R + 12 };
  if (pat[s] === undefined) return;
  bass.addMono(I.bass(pat[s], BEAT * 0.4, { sub: 0.8, bright: 0.65 }), t, 0.5);
});
// ---------- marimba ostinato + pizzicato hook ----------
clock.eachStep(0, BARS, 8, (t, b, s) => {
  if (t > tail) return;
  const c = sc.chordAt(t); if (!c) return;
  const tones = c.notes.map((x) => x + 12), order = [0, 2, 1, 2, 0, 2, 1, 2];
  const x = I.marimba(tones[order[s]], { thock: 0.3 }); keys.addMono(x, t, s % 2 ? 0.13 : 0.2, s % 2 ? 0.35 : -0.35); verb.addMono(x, t, 0.05);
});
const HOOK = [['A4', 0], ['C5', 1], ['E5', 2], ['A5', 3], ['G5', 5], ['E5', 6], ['D5', 7], ['E5', 8], ['C5', 10], ['A4', 12], ['B4', 13], ['C5', 14]];
function hook(t0, gain = 1) { for (const [n, s] of HOOK) { const t = t0 + s * BEAT / 2; if (t > tail) continue; const p = I.pizz(m(n)); lead.addMono(p, t, 0.3 * gain, 0.15); dly.addMono(p, t, 0.06 * gain); } }
for (let b = 0; b * clock.BAR < DURATION; b += 4) hook(b * clock.BAR, b === 0 ? 1.2 : 0.7);
// ---------- brass stab on every new sketch ----------
function stab(t, g = 1) { for (const n of ['A3', 'E4', 'A4']) { const x = I.brassNote(m(n), 0.28, { bright: 0.9, stab: 1, seed: m(n) }); brass.addStereo(x.L, x.R, t, 0.16 * g); } }

// ---------- foley ----------
scenes.forEach((s, i) => {
  const sk = SKETCHES[i]; if (!sk) return;
  const dd = s.drawT1 - s.drawT0;
  if (i > 0) stab(s.drawT0, 0.8);
  // pencil + marker scratching while it draws (quick, busy)
  let t = s.drawT0, k = 0;
  while (t < s.drawT1 - 0.06) { const len = 0.1 + ((k * 7919 + i * 31) % 100) / 100 * 0.18; foley.addMono(I.scribble(len, 100 + i * 17 + k), t, 0.2, ((k % 3) - 1) * 0.25); t += len + 0.03; k++; }
  // stamps slam on
  for (const c of globalThis.Sketch.cues(sk)) { const tt = s.drawT0 + c.f * dd; foley.addMono(I.thud(110, 0.08), tt, 0.7); fx.addMono(I.pop(1400 + (i % 3) * 200, i), tt + 0.02, 0.3); }
  // a sparkle chime when the sketch is finished
  const ding = I.bell(1760, 0.6, 1.3, 2.0); fx.addMono(ding, s.drawT1, 0.18); verb.addMono(ding, s.drawT1, 0.12);
  // eraser: quick rubs + a whoosh
  if (isFinite(s.eraseT0)) {
    const rows = 6;
    for (let r = 0; r < rows; r++) foley.addMono(I.noiseSweep(ERASE / rows * 0.95, 900, 2200, { q: 0.7, shape: (x) => Math.sin(x * Math.PI), pink: true }), s.eraseT0 + r * ERASE / rows, 0.3, r % 2 ? 0.3 : -0.3);
    fx.addMono(I.noiseSweep(0.35, 400, 6000, { q: 1, shape: (x) => x * x, pink: true }), s.eraseT1 - 0.3, 0.2);
  }
});
fx.addMono(I.paperFwip(1.2, 1), 0.02, 0.3);
stab(0.05, 1.1);

// ---------- narration ----------
for (const s of scenes) {
  const b = MIX.loadAudio(path.join(__dirname, s.file), { at: s.at, gain: 1, length: DURATION });
  for (let i = 0; i < Math.min(b.n, N); i++) { vo.L[i] += b.L[i]; vo.R[i] += b.R[i]; }
}

// ---------- mix ----------
MIX.sidechain([bass, keys], kicks, { depth: 0.25 });
MIX.duck([drums, bass, keys, lead, brass], vo, { depth: 0.5, attack: 0.02, release: 0.25, threshold: 0.03 });
const stems = { drums, bass, keys, lead, brass, foley, fx, vo, verb: reverb(verb, { room: 0.6, damp: 0.4 }), dly: pingpong(dly, BEAT * 0.75, 0.3, 4000) };
const GAIN = { drums: 0.5, bass: 0.55, keys: 0.9, lead: 0.9, brass: 0.9, foley: 0.75, fx: 0.8, vo: 2.8, verb: 0.7, dly: 0.6 };
const out = path.join(__dirname, 'out');
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? out : null });
MIX.highpass(mix, 25);
MIX.fadeOut(mix, DURATION - 0.9, DURATION);
const M = MIX.master(mix, parseFloat(process.env.DRIVE || '0.8'), undefined, { lufs: process.env.LUFS ? parseFloat(process.env.LUFS) : -14 });
MIX.writeWav(path.join(out, 'music.wav'), mix);
console.log(`wrote out/music.wav (${DURATION.toFixed(2)}s${M.lufs !== undefined ? `, ${M.lufs.toFixed(1)} LUFS at drive ${M.drive.toFixed(2)}` : ''})`);
