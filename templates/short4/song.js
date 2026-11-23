// THE SONG (v4 "doodle notebook"): a sunny ukulele-and-glockenspiel romp in C major, with
// paper, pencil and stamp foley. Renders music + SFX + narration from the score into out/music.wav.
//   node song.js   (STEMS=1 writes stems, LUFS=-14 masters for YouTube)
const path = require('path');
const { SR, Bus, reverb, pingpong } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const sc = require('./score');
const { BEAT, DURATION, m, ev, clock, clues, isThink, TR } = sc;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const drums = bus(), bass = bus(), uke = bus(), glock = bus(), fx = bus(), foley = bus(), vo = bus();
const verb = bus(), dly = bus();
const BARS = Math.ceil(DURATION / clock.BAR);

const inHookIntro = (t) => t < ev.title[0];
const inAsk = (t) => t >= ev.ask && t < ev.reveal;
const inParty = (t) => t >= ev.reveal;
const tearGap = (t) => clues.some((c) => t >= c.t0 - TR && t < c.t0) || (t >= ev.ask - TR && t < ev.ask) || (t >= ev.cta - TR && t < ev.cta);
const quiet = (t) => t >= DURATION - 0.3 || isThink(t) || inAsk(t) || tearGap(t) || inHookIntro(t);

// ---------- drums: soft kick, finger snaps, brushy shaker ----------
const K = I.kick({ punch: 0.7, tail: 0.6 }), SNAP = I.clap({ decay: 0.05, spread: 0.2 }), RIM = I.rim(1.3, 4);
const SH = [I.shaker(1, 15), I.shaker(0, 16)];
const kicks = [];
clock.eachStep(0, BARS, 16, (t, b, s) => {
  if (quiet(t)) return;
  const party = inParty(t);
  if (s === 0 || s === 8 || (party && (s === 6 || s === 14))) { drums.addMono(K, t, 0.8); kicks.push(t); }
  if (s === 4 || s === 12) { drums.addMono(SNAP, t, 0.45, 0.2); verb.addMono(SNAP, t, 0.12); }
  if (party && s === 12) drums.addMono(RIM, t + BEAT / 4, 0.25, -0.3);
  drums.addMono(SH[s % 2], t, s % 4 === 2 ? 0.13 : 0.07, 0.35);
});

// ---------- bass: bouncy plucked upright (pizz an octave down) ----------
clock.eachStep(0, BARS, 8, (t, b, s) => {
  if (quiet(t)) return;
  const c = sc.chordAt(t); if (!c) return;
  const R = c.bass + 12;
  const pat = [R, null, R + 7, null, R + 12, null, R + 7, R + 4];
  if (pat[s] == null) return;
  bass.addMono(I.pizz(pat[s]), t, 0.55); bass.addMono(I.bass(pat[s] - 12, BEAT * 0.4, { sub: 0.8, bright: 0.2 }), t, 0.25);
});
// think time: tick-tock clock + one low pluck per beat
for (const c of clues) {
  for (let b = 0; b < 4; b++) {
    const t = c.think + b * BEAT; if (t >= c.t1 - 0.05) continue;
    bass.addMono(I.pizz(m('C3') - (b === 3 ? 5 : 0)), t, 0.45);
  }
  for (let e = 0; e < 7; e++) fx.addMono(I.woodTick(e % 2 ? 0.8 : 1.1), c.think + e * BEAT / 2, 0.28, e % 2 ? 0.3 : -0.3);
}

// ---------- ukulele: strummed chords (down, down-up, up-down-up) ----------
const STRUM = [[0, 1], [2, 1], [3, -1], [5, -1], [6, 1], [7, -1]];
clock.eachStep(0, BARS, 8, (t, b, s) => {
  if (quiet(t)) return;
  const st = STRUM.find(([k]) => k === s); if (!st) return;
  const c = sc.chordAt(t); if (!c) return;
  const notes = [...c.notes, c.notes[0] + 12];
  const order = st[1] > 0 ? notes : [...notes].reverse();
  const acc = s === 0 ? 1 : s % 2 ? 0.55 : 0.75;
  order.forEach((n, i) => {
    const g = I.guitar(n, BEAT * 0.9, { bright: 0.75, sustain: 0.35, seed: n + s });
    uke.addMono(g, t + i * 0.012, 1.0 * acc, (i - 1.5) * 0.15);
  });
});

// ---------- glockenspiel hook (intro, reveal, end card) ----------
const glk = (n) => I.bell(440 * Math.pow(2, (m(n) - 69) / 12), 0.9, 1.2, 3.5);
const HOOK8 = [['E5', 0], ['G5', 1], ['C6', 2], ['G5', 3], ['A5', 4], ['G5', 5], ['E5', 6], ['D5', 7],
  ['C5', 8], ['E5', 9], ['G5', 10], ['A5', 11], ['G5', 12], ['E5', 13], ['D5', 14], ['C5', 15]];
function playHook(t0, bars, gain = 1) {
  for (let r = 0; r * 2 < bars; r++) for (const [n, s] of HOOK8) {
    const t = t0 + r * clock.BAR * 2 + s * BEAT / 2; if (t >= DURATION - 0.4 || tearGap(t)) continue;
    const x = glk(n); glock.addMono(x, t, 0.2 * gain, 0.2); verb.addMono(x, t, 0.06 * gain); dly.addMono(x, t, 0.05 * gain);
    const mb = I.musicBox(m(n) - 12, { decay: 0.6 }); glock.addMono(mb, t, 0.1 * gain, -0.2);
  }
}
playHook(ev.title[0], 2, 0.8);
playHook(ev.reveal, Math.ceil((DURATION - ev.reveal) / clock.BAR));
// a quieter answering motif while each clue is read (only on the first bar so it never fights the voice)
for (const c of clues) for (const [n, s] of [['C6', 0], ['G5', 1], ['E5', 2]]) glock.addMono(glk(n), c.t0 + s * BEAT / 2, 0.12, 0.3);

// ---------- foley: pen, paper, tape, stamps ----------
ev.title.forEach((t, i) => { foley.addMono(I.scribble(0.22, 31 + i), t - 0.02, 0.45, (i - 1) * 0.3); foley.addMono(I.thud(180 + i * 40, 0.06), t, 0.5); });
foley.addMono(I.scribble(0.4, 40), ev.title[2] + 0.15, 0.3); // underline
foley.addMono(I.paperFwip(1.2, 5), ev.cover - 0.05, 0.5); foley.addMono(I.thud(120, 0.08), ev.cover + 0.2, 0.6);
function stampHit(t, big = 1) { foley.addMono(I.thud(90, 0.12), t, 0.9 * big); foley.addMono(I.thwack(), t, 0.35 * big); hits(t, big * 0.6); }
function hits(t, g) { const ch = I.brassNote(m('C4'), 0.25, { bright: 0.8, stab: 1, seed: 3 }); fx.addStereo(ch.L, ch.R, t, 0.12 * g); }
stampHit(ev.canYou, 1);
fx.addMono(I.boing(), ev.hostIn + 1.0, 0.18, 0.4);
function rip(t) { // page tear: a ripping noise sweep + paper flutter
  foley.addMono(I.noiseSweep(TR, 900, 5200, { q: 1.4, shape: (x) => Math.sin(x * Math.PI) * (0.6 + 0.4 * Math.sin(x * 70)), pink: false }), t, 0.5, -0.2);
  foley.addMono(I.paperFwip(0.9, 7), t + TR * 0.6, 0.45, 0.2);
}
for (const c of clues) {
  rip(c.t0 - TR);
  fx.addMono(I.boing(), c.t0 - TR + 0.05, 0.14, -0.4); // host hop
  foley.addMono(I.thud(140, 0.09), c.t0, 0.75); foley.addMono(I.paperFwip(1.4, c.k), c.t0 + 0.02, 0.3); // photo slaps down
  foley.addMono(I.scribble(0.45, 50 + c.k), c.t0 + 0.1, 0.25, -0.3); // circle around CLUE n
  foley.addMono(I.pop(1300, c.k), c.t0 + 0.12, 0.3, 0.4); // sticky note
  // the pen writes: a soft scribble under each emphasised word
  c.vo.words.forEach((w, i) => { if (c.tokens[i] && c.tokens[i].em) foley.addMono(I.scribble(Math.min(0.35, w.end - w.t), 60 + i), w.t, 0.06, -0.1); });
  stampHit(c.rankAt, 0.7);
  c.ticks.forEach((t, j) => { fx.addMono(I.pop(900 + j * 300, 9 + j), t, 0.4); });
}
const c5 = clues[4];
fx.addMono(I.bwomp(), c5.t0 + 0.1, 0.4); // uh-oh on the last clue
stampHit(c5.t0 + 0.1, 0.8);
// ending: rip, roll, slide whistle up, ta-da
rip(ev.ask - TR); fx.addMono(I.boing(), ev.ask - TR + 0.05, 0.14);
ev.count.forEach((t, j) => { fx.addMono(I.pop(700 + j * 250, 20 + j), t, 0.45); fx.addMono(I.timpani(m(['C3', 'E3', 'G3'][j])), t, 0.4); });
const SN = I.snare({ tone: 0.3, snap: 0.6, decay: 0.12 });
const rollStart = ev.roll, rollEnd = ev.reveal - BEAT * 0.5;
for (let t = rollStart, i = 0; t < rollEnd; i++) { const k = (t - rollStart) / (rollEnd - rollStart); drums.addMono(SN, t, 0.05 + 0.2 * k * k, 0.05 * Math.sin(i)); t += BEAT / (4 + 4 * k); }
fx.addMono(I.launchWhistle(rollEnd - rollStart), rollStart, 0.18);
// reveal: chest pops, cymbal, brass ta-da chord, confetti crackle
fx.addMono(I.thud(80, 0.2), ev.reveal, 0.9); fx.addMono(I.crash(18), ev.reveal, 0.35);
for (const [n, d] of [['C4', 0], ['E4', 0], ['G4', 0], ['C5', 0]]) { const b = I.brassNote(m(n), 0.9, { bright: 0.8, stab: 0.3, seed: m(n) }); fx.addStereo(b.L, b.R, ev.reveal + d, 0.14); }
fx.addMono(I.fireworkBurst(5, 1), ev.reveal + 0.08, 0.3, -0.4); fx.addMono(I.fireworkBurst(9, 0.8), ev.reveal + 0.3, 0.25, 0.4);
fx.addMono(I.paperFwip(1.1, 3), ev.score, 0.4); fx.addMono(I.pop(1600, 3), ev.score + 0.05, 0.3);
// end card
rip(ev.cta - TR);
const press = ev.cta + 1.4;
fx.addMono(I.tvClick(), press, 0.6); const ding = I.bell(1567.98, 1.2, 1.4, 2.0); fx.addMono(ding, press + 0.05, 0.35); verb.addMono(ding, press + 0.05, 0.2);
fx.addMono(I.bell(2093, 1.0, 1.4, 2.0), press + 0.25, 0.25);

// ---------- narration ----------
for (const v of sc.voice) {
  const b = MIX.loadAudio(path.join(__dirname, sc.D.vo[v.key].file), { at: v.at, gain: 1, length: DURATION });
  for (let i = 0; i < Math.min(b.n, N); i++) { vo.L[i] += b.L[i]; vo.R[i] += b.R[i]; }
}

// ---------- mix ----------
MIX.sidechain([bass, uke], kicks, { depth: 0.2 });
MIX.duck([drums, bass, uke, glock], vo, { depth: 0.6, attack: 0.02, release: 0.3, threshold: 0.03 });
const stems = {
  drums, bass, uke, glock, fx, foley, vo,
  verb: reverb(verb, { room: 0.6, damp: 0.4 }),
  dly: pingpong(dly, BEAT * 0.75, 0.3, 4000),
};
const GAIN = { drums: 0.42, bass: 0.55, uke: 2.6, glock: 0.85, fx: 0.8, foley: 0.75, vo: 2.8, verb: 0.8, dly: 0.7 };
const out = path.join(__dirname, 'out');
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? out : null });
MIX.highpass(mix, 25);
MIX.fadeOut(mix, DURATION - 0.8, DURATION);
const M = MIX.master(mix, parseFloat(process.env.DRIVE || '0.8'), undefined, { lufs: process.env.LUFS ? parseFloat(process.env.LUFS) : -14 });
MIX.writeWav(path.join(out, 'music.wav'), mix);
console.log(`wrote out/music.wav (${DURATION.toFixed(2)}s${M.lufs !== undefined ? `, ${M.lufs.toFixed(1)} LUFS at drive ${M.drive.toFixed(2)}` : ''})`);
