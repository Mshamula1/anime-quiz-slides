// THE SCORE: one timeline for narration, sketching, erasing, music and SFX.
// Scene i = narration line i + one sketch. Between scenes the old sketch is erased.
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
  const BPM = 104;
  const clock = makeClock({ bpm: BPM, offset: 0 });
  const { BEAT } = clock;

  const ERASE = 0.45; // eraser pass between sketches (quick, snappy)
  const GAP = 0.06;   // tiny breath after the eraser before the next line
  const scenes = [];
  let t = 0.45;       // a blink of blank page first
  D.lines.forEach((L, i) => {
    const at = t, end = at + L.dur;
    const drawT0 = i === 0 ? 0.15 : at - 0.12;
    const drawDur = Math.max(1.6, Math.min(L.dur * (i === 0 ? 0.8 : 0.68), i === 0 ? 4.2 : 3.4));
    const eraseT0 = end + 0.08;
    scenes.push({ i, at, end, dur: L.dur, drawT0, drawT1: drawT0 + drawDur, eraseT0, eraseT1: eraseT0 + ERASE,
      words: L.words.map((w) => ({ w: w.w, t: at + w.t, end: at + w.end })), env: L.env, show: L.show, file: L.file });
    t = eraseT0 + ERASE + GAP;
  });
  const last = scenes[scenes.length - 1];
  last.eraseT0 = last.eraseT1 = Infinity; // the final sketch stays
  const DURATION = last.end + 1.8;

  // ---------- harmony: curious minor that warms up (Am F C G / Dm Am E Am) ----------
  const prog = ['Am', 'F', 'C', 'G', 'Dm', 'Am', 'F', 'E'];
  const rows = [];
  for (let b = 0; b * clock.BAR < DURATION + 4; b++) rows.push([b, 0, 4, prog[b % prog.length]]);
  const { chords, chordAt } = makeChords(clock, {
    Am: { notes: ['A3', 'C4', 'E4'], bass: 'A1' }, F: { notes: ['A3', 'C4', 'F4'], bass: 'F1' },
    C: { notes: ['G3', 'C4', 'E4'], bass: 'C2' }, G: { notes: ['G3', 'B3', 'D4'], bass: 'G1' },
    Dm: { notes: ['A3', 'D4', 'F4'], bass: 'D2' }, E: { notes: ['G#3', 'B3', 'E4'], bass: 'E1' },
  }, rows);

  const markers = {};
  scenes.forEach((s) => { markers['line' + s.i] = s.at; if (s.i) markers['erase' + s.i] = scenes[s.i - 1].eraseT0; });
  const S = { intro: [0, scenes[0].end] };
  const subtitles = [];
  const SCORE = { FPS, FORMAT, W, H, SAFE, STYLE, DURATION, clock, BEAT, BPM, S, m, chords, chordAt, scenes, ERASE, markers, D, subtitles };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
