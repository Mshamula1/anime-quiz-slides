// THE SONG: renders the soundtrack (music + SFX + narration) from the score into out/music.wav.
//   node song.js   (STEMS=1 writes stems, LUFS=-14 masters for YouTube)
const path = require('path');
const { SR, Bus, reverb, pingpong } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const sc = require('./score');
const { BEAT, DURATION, m, ev, clock, clues, isThink } = sc;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const drums = bus(), bass = bus(), pad = bus(), keys = bus(), lead = bus(), fx = bus(), hits = bus(), vo = bus();
const verb = bus(), dly = bus();

const BARS = Math.ceil(DURATION / clock.BAR);
const inClue = (t) => clues.some((c) => t >= c.t0 && t < c.think);
const inHook = (t) => t < clues[0].t0;
const inAsk = (t) => t >= ev.ask && t < ev.reveal;
const inParty = (t) => t >= ev.reveal && t < DURATION - BEAT * 2;
const quietBefore = (t) => clues.some((c) => t >= c.t1 - BEAT * 0.5 && t < c.t1) || (t >= ev.reveal - BEAT * 0.5 && t < ev.reveal);

// ---------- drums ----------
const K = I.kick({ punch: 1.2 }), SN = I.snare(), CL = I.clap(), HC = [I.hat(false, 11), I.hat(false, 12)], HO = I.hat(true, 14);
const SH = [I.shaker(1, 15), I.shaker(0, 16)];
const kicks = [];
clock.eachStep(0, BARS, 16, (t, b, s) => {
  if (t >= DURATION - 0.3 || quietBefore(t) || isThink(t) || inAsk(t)) return;
  const party = inParty(t) || inHook(t);
  if (inHook(t) && t < ev.canYou) { // hook: just a heartbeat kick under the voice
    if (s % 8 === 0) { drums.addMono(K, t, 0.7); kicks.push(t); }
    return;
  }
  if (s === 0 || s === 8 || s === 10 || (party && s % 4 === 0)) { drums.addMono(K, t, 0.9); kicks.push(t); }
  if (s === 4 || s === 12) { drums.addMono(CL, t, 0.55); drums.addMono(SN, t, 0.25); verb.addMono(CL, t, 0.2); }
  if (s % 2 === 0) drums.addMono(s % 4 === 2 ? HO : HC[(s / 2) % 2], t, s % 4 === 2 ? 0.1 : 0.16, -0.25);
  else drums.addMono(SH[s % 2], t, 0.09, 0.35);
});

// ---------- bass: bouncing roots ----------
clock.eachStep(0, BARS, 8, (t, b, s) => {
  if (t >= DURATION - 0.3 || quietBefore(t) || inAsk(t) || (inHook(t) && t < ev.canYou)) return;
  const c = sc.chordAt(t); if (!c) return;
  const R = c.bass + 12;
  if (isThink(t)) { if (s % 2 === 0) bass.addMono(I.bass(R - 12, BEAT * 0.9, { sub: 1, bright: 0.1 }), t, 0.45); return; } // low pulse on the beat
  const pat = [R, R, R + 12, R, R + 7, R, R + 12, R + 10];
  bass.addMono(I.bass(pat[s], BEAT / 2 * 0.8, { sub: 0.7, bright: 0.5 }), t, 0.5);
});

// ---------- pads (soft strings) ----------
for (const c of sc.chords) {
  if (c.t0 >= DURATION) break;
  const len = Math.min(c.t1, DURATION) - c.t0;
  for (const n of c.notes) { const { L, R } = I.strings(n, len, { attack: 0.3, release: 0.6, bright: 0.6, seed: n }); pad.addStereo(L, R, c.t0, 0.07); }
}

// ---------- marimba ostinato (the "adventure" bounce) ----------
clock.eachStep(0, BARS, 8, (t, b, s) => {
  if (t >= DURATION - 0.3 || quietBefore(t) || isThink(t) || inAsk(t) || (inHook(t) && t < ev.canYou)) return;
  const c = sc.chordAt(t); if (!c) return;
  const tones = c.notes.map((x) => x + 12);
  const order = [0, 1, 2, 1, 0, 2, 1, 2];
  const x = I.marimba(tones[order[s]], { thock: 0.2 });
  keys.addMono(x, t, s % 2 ? 0.16 : 0.24, s % 2 ? 0.35 : -0.35); verb.addMono(x, t, 0.08);
});

// ---------- lead hook (pizz + brass) for hook, reveal and the end card ----------
const HOOK8 = [['A4', 0, 1], ['C5', 1, 1], ['E5', 2, 2], ['D5', 4, 1], ['C5', 5, 1], ['B4', 6, 1], ['C5', 7, 1],
  ['A4', 8, 1], ['C5', 9, 1], ['E5', 10, 1], ['A5', 11, 3], ['G5', 14, 1], ['E5', 15, 1]];
function playHook(t0, bars) {
  for (let r = 0; r * 2 < bars; r++) for (const [n, s, d] of HOOK8) {
    const t = t0 + r * clock.BAR * 2 + s * BEAT / 2; if (t >= DURATION - 0.4) continue;
    const p = I.pizz(m(n)); lead.addMono(p, t, 0.32, 0.15); verb.addMono(p, t, 0.1); dly.addMono(p, t, 0.05);
    const b = I.brassNote(m(n), d * BEAT / 2 * 0.9, { bright: 0.7, stab: 0.4, seed: s }); lead.addStereo(b.L, b.R, t, 0.12);
  }
}
playHook(ev.canYou, 2);
playHook(ev.reveal, Math.ceil((DURATION - ev.reveal) / clock.BAR));

// ---------- hits: clue slams, stamps, ticks, whooshes ----------
const CR = I.crash(18);
function slam(t, big = 1) {
  hits.addMono(CR, t, 0.32 * big, 0.1); hits.addMono(I.subBoom(1.0), t, 0.6 * big); hits.addMono(I.thud(70, 0.1), t, 0.6 * big);
  const st = I.brassNote(m('A3'), 0.35, { bright: 1, stab: 1, seed: 3 }); hits.addStereo(st.L, st.R, t, 0.35 * big);
  const st2 = I.brassNote(m('E4'), 0.35, { bright: 1, stab: 1, seed: 4 }); hits.addStereo(st2.L, st2.R, t, 0.25 * big);
}
// hook opener
slam(0.0, 1.1);
fx.addMono(I.thwack(), ev.canYou, 0.6); hits.addMono(CR, ev.canYou, 0.25);
fx.addMono(I.noiseSweep(1.2, 300, 6000, { q: 0.9, shape: (x) => x * x, pink: true }), clues[0].t0 - 1.2, 0.3);
for (const c of clues) {
  slam(c.t0, c.k === 5 ? 1.25 : 1);
  const ding = I.bell(1318.5, 0.3, 1.6, 2.0); fx.addMono(ding, c.t0 + 0.04, 0.22); verb.addMono(ding, c.t0 + 0.04, 0.15); // "CLUE n" stamp
  fx.addMono(I.paperFwip(1.0, c.k), c.cardIn - 0.04, 0.3, -0.2); // card slides in
  fx.addMono(I.pop(1500, c.k), c.rankAt, 0.35, 0.3); // rank badge
  c.ticks.forEach((t, j) => { fx.addMono(I.woodTick(j === 2 ? 1.5 : 1.2), t, 0.75); fx.addMono(I.woodTick(0.9), t + BEAT / 2, 0.35); });
  // whoosh into the next clue / the ending
  fx.addMono(I.noiseSweep(0.45, 500, 7000, { q: 1.1, shape: (x) => x * x, pink: true }), c.t1 - 0.45, 0.45);
}
// last-clue warning: a timpani pair before clue 5
const c5 = clues[4];
hits.addMono(I.timpani(m('A2')), c5.t0, 0.5);
// ask -> roll -> reveal
hits.addMono(I.timpani(m('E2')), ev.ask, 0.5);
ev.count.forEach((t, j) => { hits.addMono(I.timpani(m(['A2', 'C3', 'E3'][j])), t, 0.55); fx.addMono(I.woodTick(1.4), t, 0.6); });
const rollStart = ev.roll, rollEnd = ev.reveal - BEAT * 0.5;
for (let t = rollStart, i = 0; t < rollEnd; i++) { const k = (t - rollStart) / (rollEnd - rollStart); drums.addMono(SN, t, 0.06 + 0.22 * k * k, 0.05 * Math.sin(i)); t += BEAT / (4 + 4 * k); }
fx.addMono(I.noiseSweep(rollEnd - rollStart, 200, 9000, { q: 0.8, shape: (x) => x * x * x, pink: true }), rollStart, 0.35);
slam(ev.reveal, 1.3);
fx.addMono(I.fireworkBurst(5, 1.2), ev.reveal + 0.05, 0.4, -0.4); fx.addMono(I.fireworkBurst(9, 1), ev.reveal + 0.35, 0.35, 0.4);
fx.addMono(I.pop(1800, 3), ev.score, 0.3);
slam(ev.cta, 0.6);

// ---------- narration ----------
for (const v of sc.voice) {
  const b = MIX.loadAudio(path.join(__dirname, sc.D.vo[v.key].file), { at: v.at, gain: 1, length: DURATION });
  for (let i = 0; i < Math.min(b.n, N); i++) { vo.L[i] += b.L[i]; vo.R[i] += b.R[i]; }
}

// ---------- mix ----------
MIX.sidechain([pad, bass], kicks, { depth: 0.35 });
MIX.duck([drums, bass, pad, keys, lead], vo, { depth: 0.55, attack: 0.02, release: 0.3, threshold: 0.03 });
const stems = {
  drums, bass, pad, keys, lead, fx, hits, vo,
  verb: reverb(verb, { room: 0.8, damp: 0.35 }),
  dly: pingpong(dly, BEAT * 0.75, 0.3, 3500),
};
const GAIN = { drums: 0.38, bass: 0.5, pad: 1.3, keys: 0.8, lead: 0.9, fx: 0.85, hits: 0.5, vo: 2.8, verb: 0.9, dly: 0.8 };
const out = path.join(__dirname, 'out');
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? out : null });
MIX.highpass(mix, 25);
MIX.fadeOut(mix, DURATION - 0.8, DURATION);
const M = MIX.master(mix, parseFloat(process.env.DRIVE || '0.8'), undefined, { lufs: process.env.LUFS ? parseFloat(process.env.LUFS) : -14 });
MIX.writeWav(path.join(out, 'music.wav'), mix);
console.log(`wrote out/music.wav (${DURATION.toFixed(2)}s${M.lufs !== undefined ? `, ${M.lufs.toFixed(1)} LUFS at drive ${M.drive.toFixed(2)}` : ''})`);
