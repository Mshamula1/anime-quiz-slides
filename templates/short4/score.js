// THE SCORE: one timeline for music, voice and picture.
// Built from data.json (written by prep.py): every clue start, voice line, tick and hit lives here.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const D = node ? require('./data.json') : globalThis.DATA;
  const { m, makeClock, makeChords } = MU;

  const FPS = 30;
  const FORMAT = U.pickFormat('9:16');
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  const STYLE = 'paper';
  const BPM = 120;
  const clock = makeClock({ bpm: BPM, offset: 0 });
  const { BEAT } = clock;
  const up = (t) => Math.ceil(t / BEAT - 1e-6) * BEAT; // snap forward to the beat grid
  const VO = D.vo;
  const voice = []; // [{key, at, dur, words}] placed on the timeline
  const say = (key, at) => { const v = VO[key]; voice.push({ key, at, dur: v.dur, end: at + v.dur, text: v.text, words: v.words.map((w) => ({ w: w.w, t: at + w.t, end: at + w.end })) }); return at + v.dur; };

  // ---------- hook ----------
  const ev = { hookHit: 0.0, title: [0.25, 0.5, 0.75], cover: 1.25, hostIn: 0.3 };
  const TR = 0.4; // page-tear transition length (the old page rips away before each new page)
  let t = say('hook', 0.12);
  ev.canYou = up(t + 0.05); // "Can you?" + HARD MODE stamp on a beat
  t = say('hook2', ev.canYou);

  // ---------- clues ----------
  const THINK_BEATS = 4; // count 3-2-1 on beats 0..2, whoosh on beat 3, next clue on beat 4
  const clues = [];
  let start = up(t + 0.35);
  D.clues.forEach((c, i) => {
    const k = i + 1;
    const T0 = start;
    const nEnd = say('n' + k, T0 + 0.06);
    const cAt = nEnd + 0.22;
    const cEnd = say('c' + k, cAt);
    const think = up(cEnd + 0.25);
    const next = think + THINK_BEATS * BEAT;
    const ticks = [0, 1, 2].map((b) => think + b * BEAT);
    clues.push({ ...c, k, t0: T0, cardIn: T0 + 0.18, vo: voice[voice.length - 1], rankAt: cEnd + 0.05, think, ticks, whoosh: next - 0.3, t1: next, pts: 6 - k });
    start = next;
  });

  // ---------- ending: ask -> 3-2-1 -> reveal -> score -> CTA ----------
  ev.ask = start;
  t = say('ask', ev.ask + 0.1);
  ev.roll = up(t + 0.1);
  ev.count = [0, 1, 2].map((b) => ev.roll + b * BEAT * 2); // slower 3..2..1 over a snare roll
  ev.reveal = ev.roll + 6 * BEAT;
  t = say('reveal', ev.reveal + 0.12);
  ev.score = up(t + 0.35);
  t = say('score', ev.score + 0.05);
  ev.cta = up(t + 0.3);
  const DURATION = ev.cta + 8 * BEAT;

  const S = { hook: [0, clues[0].t0] };
  clues.forEach((c) => { S['clue' + c.k] = [c.t0, c.think]; S['think' + c.k] = [c.think, c.t1]; });
  S.ask = [ev.ask, ev.reveal]; S.reveal = [ev.reveal, ev.cta]; S.cta = [ev.cta, DURATION];

  const isThink = (x) => clues.some((c) => x >= c.think && x < c.t1);

  // ---------- harmony: sunny C major (I - vi - IV - V) ----------
  const prog = ['C', 'Am', 'F', 'G'];
  const rows = [];
  for (let b = 0; b * clock.BAR < DURATION + 2; b++) rows.push([b, 0, 4, prog[b % 4]]);
  const { chords, chordAt } = makeChords(clock, {
    C: { notes: ['C4', 'E4', 'G4'], bass: 'C2' },
    Am: { notes: ['C4', 'E4', 'A4'], bass: 'A1' },
    F: { notes: ['C4', 'F4', 'A4'], bass: 'F1' },
    G: { notes: ['B3', 'D4', 'G4'], bass: 'G1' },
  }, rows);

  const markers = { canYou: { t: ev.canYou, sync: 'av' }, reveal: { t: ev.reveal, sync: 'av' } };
  clues.forEach((c) => { markers['clue' + c.k] = { t: c.t0, sync: 'a' }; // the page rip moves the picture before t0, so only the sound is measured here
    markers['think' + c.k] = c.think; });
  markers.ask = ev.ask; markers.cta = ev.cta;

  const subtitles = [];

  const SCORE = { TR, FPS, FORMAT, W, H, SAFE, STYLE, DURATION, clock, BEAT, BPM, S, m, chords, chordAt, ev, clues, voice, markers, isThink, D, subtitles };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
