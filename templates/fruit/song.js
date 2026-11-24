// THE SONG: a soft lo-fi bed (e-piano, music box, brushed drums, vinyl) under the narration,
// plus pencil and eraser foley timed to every sketch and every rub-out.
//   node song.js   (STEMS=1 writes stems, LUFS=-14 masters for YouTube)
const path = require('path');
const { SR, Bus, reverb, pingpong } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const sc = require('./score');
const { BEAT, DURATION, m, clock, scenes, ERASE } = sc;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const drums = bus(), bass = bus(), keys = bus(), box = bus(), pad = bus(), foley = bus(), bed = bus(), vo = bus();
const verb = bus(), dly = bus();
const BARS = Math.ceil(DURATION / clock.BAR);
const grooveIn = scenes[1] ? scenes[1].at - BEAT : 4;
const tail = DURATION - 1.2;

// ---------- drums: soft lo-fi pocket (enters after the intro) ----------
const K = I.kick({ punch: 0.5, tail: 0.5 }), SN = I.rim(1.0, 4), SH = [I.shaker(1, 15), I.shaker(0, 16)], HC = I.hat(false, 12);
const kicks = [];
clock.eachStep(0, BARS, 16, (t, b, s) => {
  if (t < grooveIn || t > tail) return;
  if (s === 0 || s === 7 || s === 10) { drums.addMono(K, t + 0.012, 0.75); kicks.push(t); }
  if (s === 4 || s === 12) drums.addMono(SN, t + 0.02, 0.4, 0.1);
  if (s % 2 === 0) drums.addMono(HC, t + (s % 4 === 2 ? 0.03 : 0), 0.07, -0.25);
  else drums.addMono(SH[s % 2], t, 0.05, 0.3);
});
// ---------- bass + e-piano chords ----------
for (const c of sc.chords) {
  if (c.t0 >= tail) break;
  const len = Math.min(c.t1, tail) - c.t0;
  if (c.t0 >= grooveIn) { bass.addMono(I.bass(c.bass + 12, BEAT * 1.6, { sub: 0.9, bright: 0.2 }), c.t0, 0.5); bass.addMono(I.bass(c.bass + 12, BEAT * 0.8, { sub: 0.9, bright: 0.2 }), c.t0 + BEAT * 2.5, 0.35); }
  for (const [k, n] of c.notes.entries()) { const e = I.epiano(n, len * 0.9, { index: 0.8 }); keys.addMono(e, c.t0 + k * 0.02, 0.09, (k - 1) * 0.3); verb.addMono(e, c.t0, 0.03); }
  for (const n of c.notes) { const p = I.padNote(n - 12, len, { cutoff: 1200, attack: 0.6, release: 0.8 }); pad.addStereo(p.L, p.R, c.t0, 0.035); }
}
// ---------- music-box motif: curious, rising (plays on each new sketch) ----------
const MOTIF = [['E5', 0], ['A5', 1], ['C6', 2], ['B5', 3], ['A5', 4], ['E5', 6]];
function motif(t0, gain = 1) { for (const [n, s] of MOTIF) { const x = I.musicBox(m(n), { decay: 1.2 }); box.addMono(x, t0 + s * BEAT / 2, 0.18 * gain, 0.15); dly.addMono(x, t0 + s * BEAT / 2, 0.06 * gain); verb.addMono(x, t0 + s * BEAT / 2, 0.05 * gain); } }
motif(0.25, 1.1);
scenes.forEach((s, i) => { if (i > 0 && i % 2 === 0) motif(s.drawT0, 0.6); });
motif(scenes[scenes.length - 1].drawT0, 1);

// ---------- foley: pencil scribbling while each sketch is drawn ----------
scenes.forEach((s, i) => {
  let t = s.drawT0, k = 0;
  while (t < s.drawT1 - 0.1) {
    const len = 0.18 + ((k * 7919 + i * 31) % 100) / 100 * 0.35;
    foley.addMono(I.scribble(len, 100 + i * 17 + k), t, 0.16, ((k % 3) - 1) * 0.2);
    t += len + 0.05 + ((k * 104729) % 100) / 100 * 0.1; k++;
  }
  // eraser: one rub per zig-zag row
  if (isFinite(s.eraseT0)) {
    const rows = 8;
    for (let r = 0; r < rows; r++) {
      const t0 = s.eraseT0 + r * ERASE / rows;
      foley.addMono(I.noiseSweep(ERASE / rows * 0.95, 700, 1800, { q: 0.7, shape: (x) => Math.sin(x * Math.PI) * (0.7 + 0.3 * Math.sin(x * 90)), pink: true }), t0, 0.28, r % 2 ? 0.25 : -0.25);
    }
    foley.addMono(I.paperFwip(0.8, i + 3), s.eraseT1 - 0.05, 0.12); // brushing the crumbs away
  }
});
foley.addMono(I.paperFwip(1.0, 1), 0.02, 0.25); // page turned to a blank sheet
bed.addMono(I.vinyl(DURATION, { crackle: 0.6, hiss: 0.5 }), 0, 0.5);

// ---------- narration ----------
for (const s of scenes) {
  const b = MIX.loadAudio(path.join(__dirname, s.file), { at: s.at, gain: 1, length: DURATION });
  for (let i = 0; i < Math.min(b.n, N); i++) { vo.L[i] += b.L[i]; vo.R[i] += b.R[i]; }
}

// ---------- mix ----------
MIX.sidechain([bass, pad], kicks, { depth: 0.2 });
MIX.duck([drums, bass, keys, box, pad], vo, { depth: 0.55, attack: 0.03, release: 0.35, threshold: 0.03 });
const stems = { drums, bass, keys, box, pad, foley, bed, vo, verb: reverb(verb, { room: 0.75, damp: 0.4 }), dly: pingpong(dly, BEAT * 0.75, 0.32, 3500) };
const GAIN = { drums: 0.5, bass: 0.55, keys: 1.0, box: 0.9, pad: 1.0, foley: 0.8, bed: 0.35, vo: 2.8, verb: 0.8, dly: 0.7 };
const out = path.join(__dirname, 'out');
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? out : null });
MIX.highpass(mix, 25);
MIX.fadeOut(mix, DURATION - 1.4, DURATION);
const M = MIX.master(mix, parseFloat(process.env.DRIVE || '0.8'), undefined, { lufs: process.env.LUFS ? parseFloat(process.env.LUFS) : -14 });
MIX.writeWav(path.join(out, 'music.wav'), mix);
console.log(`wrote out/music.wav (${DURATION.toFixed(2)}s${M.lufs !== undefined ? `, ${M.lufs.toFixed(1)} LUFS at drive ${M.drive.toFixed(2)}` : ''})`);
