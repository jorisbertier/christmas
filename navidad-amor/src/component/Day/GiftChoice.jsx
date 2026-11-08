import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  1. CONFIGURATION — the only part you need to edit                  */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "giftChoiceFinal"; // the choice is final, even after a reload

const TEXTS = {
  title: "Elige tu regalo",
  subtitle: "He preparado tres… pero solo puedes elegir uno ❤️",
  pick: "Elegir este regalo",
  pickTouch: "Toca otra vez para elegir",
  opening: "Un poquito de magia está ocurriendo…",
  close: "Cerrar la sorpresa",
  reopen: "Volver a leer mi sorpresa",
  chosen: "Has hecho tu elección ❤️",
  musicOn: "Silenciar la música",
  musicOff: "Activar la música",
  listen: "♫ Escuchar la música",
};

// ✏️ colours + the surprise hidden inside each gift
// (the music and the look of each gift depend on its `id`: red = romantic, green = adventure, champagne = wellness)
const GIFTS = [
  {
    id: "red", name: "Romántico", pattern: "dots",
    body: "#d9262f", ribbon: "#ffffff", dots: "#ffffff",
    surprise: { title: "Un ramo de flores para ti! 💐", message: "Porque mereces recibir flores y ver una sonrisa en tu rostro. Quiero regalarte este hermoso ramo para recordarte lo especial que eres para mí.", signature: "Con todo mi amor ❤️" },
  },
  {
    id: "green", name: "Aventura", pattern: "stars",
    body: "#1f9a62", ribbon: "#f6e7c1", dots: "#f6e7c1",
    surprise: { title: "Prepárate para volar! 🎁", message: "Tu regalo es un salto ! Una experiencia llena de adrenalina, emociones y recuerdos inolvidables. Atrévete a dar el salto y disfruta de esta aventura única.", signature: "Que comience la aventura! 🎢" },
  },
  {
    id: "champagne", name: "Bienestar", pattern: "tone",
    body: "#efd9a6", ribbon: "#8a1a2e", dots: "#d9b878",
    surprise: { title: "Un masaje para ti! 💆‍♀️", message: "Te espera un masaje en un instituto para que puedas relajarte, desconectar y disfrutar de un momento dedicado únicamente a ti. Porque mereces que te cuiden y te mimen.", signature: "À nous deux" },
  },
];

// look + feel of each theme
const VIS = {
  red: { accent: "#ff7a9a", glow: "rgba(255,120,160,.7)", icon: "💐", motif: "hearts", cls: "t-red" },
  green: { accent: "#4fe0a0", glow: "rgba(80,230,160,.65)", icon: "🪂", motif: "stars", cls: "t-green" },
  champagne: { accent: "#f6d27a", glow: "rgba(255,214,120,.65)", icon: "🌸", motif: "petals", cls: "t-champagne" },
};
const FALLBACK = ["red", "green", "champagne"];
const visOf = (g, i) => VIS[g.id] || VIS[FALLBACK[i % 3]];
const themeOf = (g, i) => (VIS[g.id] ? g.id : FALLBACK[i % 3]);

/* ------------------------------------------------------------------ */
/*  2. HELPERS                                                         */
/* ------------------------------------------------------------------ */

function mix(hex, to, amt) {
  const n = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const a = n(hex); const b = n(to);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * amt));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
const lighten = (h, a) => mix(h, "#ffffff", a);
const darken = (h, a) => mix(h, "#000000", a);
function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

function readChoice() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return GIFTS.some((g) => g.id === v) ? v : null;
  } catch (e) { return null; }
}
function saveChoice(id) {
  try { window.localStorage.setItem(STORAGE_KEY, id); } catch (e) { /* storage may be blocked */ }
}

/* ------------------------------------------------------------------ */
/*  3. MUSIC — one original theme per type of gift (Web Audio)         */
/*     red       → a romantic waltz (3/4, music-box piano)             */
/*     green     → an upbeat adventure groove (4/4, drums + bass)      */
/*     champagne → a calm spa ambience (slow pads, bowl, breeze)       */
/* ------------------------------------------------------------------ */

const NF = { A2: 110, C3: 130.81, D3: 146.83, E3: 164.81, F2: 87.31, G2: 98, B2: 123.47, F3: 174.61, G3: 196, A3: 220, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, Fs4: 369.99, G4: 392, A4: 440, B4: 493.88, Cs5: 554.37, C5: 523.25, D5: 587.33, E5: 659.25, Fs5: 739.99, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5, E6: 1318.5 };

const THEMES = {
  // ---------------- romantic waltz ----------------
  red: {
    barLen: 3 * 0.86, level: 0.7,
    bar(i, t, h) {
      const B = 0.86;
      const bars = [
        { r: NF.C3, c: [NF.C4, NF.E4, NF.G4], m: [[0, NF.E5, 1.5], [1.5, NF.D5, 0.5], [2, NF.C5, 1]] },
        { r: NF.A2, c: [NF.A3, NF.C4, NF.E4], m: [[0, NF.C5, 1], [1, NF.E5, 1], [2, NF.A5, 1]] },
        { r: NF.F2, c: [NF.F3, NF.A3, NF.C4], m: [[0, NF.A5, 1.5], [1.5, NF.G5, 0.5], [2, 698.46, 1]] },
        { r: NF.G2, c: [NF.G3, NF.B3, NF.D4], m: [[0, NF.G5, 2], [2, NF.D5, 1]] },
        { r: NF.C3, c: [NF.C4, NF.E4, NF.G4], m: [[0, NF.E5, 1], [1, NF.G5, 1], [2, NF.C6, 1]] },
        { r: NF.E3, c: [NF.G3, NF.B3, NF.E4], m: [[0, NF.B5, 1.5], [1.5, NF.A5, 0.5], [2, NF.G5, 1]] },
        { r: NF.F2, c: [NF.F3, NF.A3, NF.C4], m: [[0, NF.A5, 1], [1, NF.G5, 1], [2, 698.46, 1]] },
        { r: NF.G2, c: [NF.G3, NF.B3, NF.D4], m: [[0, NF.D5, 1.5], [1.5, NF.E5, 0.5], [2, NF.C5, 1.4]] },
      ][i % 8];
      h.tone(b => b, t, 2.4, 0.1, { f: bars.r, attack: 0.02 });
      [1, 2].forEach((k) => bars.c.forEach((f, n) => h.tone(null, t + k * B + n * 0.02, 1.4, 0.045, { f })));
      bars.m.forEach(([beat, f, d]) => { h.tone(null, t + beat * B, 1.5 + d * 0.5, 0.15, { f, partials: [[1, 1], [2, 0.3], [3.01, 0.1]] }); });
    },
    preview(h, t) { [NF.E5, NF.G5, NF.C6].forEach((f, k) => h.tone(null, t + k * 0.22, 1.4, 0.16, { f, partials: [[1, 1], [2, 0.3]] })); },
  },
  // ---------------- adventure groove ----------------
  green: {
    barLen: 4 * 0.4545, level: 0.62,
    bar(i, t, h) {
      const B = 0.4545;
      const chords = [
        { r: NF.D3, c: [NF.D4, NF.Fs4, NF.A4, NF.D5], lead: [[0, NF.A5], [1.5, NF.Fs5], [2, NF.A5], [3, NF.B5], [3.5, NF.A5]] },
        { r: NF.A2, c: [NF.Cs5 / 2, NF.E4, NF.A4, NF.Cs5], lead: [[0, NF.Cs5 * 2], [1, NF.A5], [2, NF.E5 * 1], [2.5, NF.A5], [3.5, NF.Cs5 * 2]] },
        { r: NF.B2, c: [NF.D4, NF.Fs4, NF.B4, NF.D5], lead: [[0, NF.B5], [1, NF.Fs5], [2, NF.D5 * 1], [3, NF.Fs5], [3.5, NF.B5]] },
        { r: NF.G2, c: [NF.D4, NF.G4, NF.B4, NF.D5], lead: [[0, NF.G5], [1.5, NF.D5], [2, NF.G5], [3, NF.A5], [3.5, NF.B5]] },
      ][i % 4];
      // drums: kick on 1 & 3, snare on 2 & 4, hats on 8ths
      [0, 2].forEach((b) => h.kick(t + b * B, 0.5));
      [1, 3].forEach((b) => h.snare(t + b * B, 0.22));
      for (let k = 0; k < 8; k++) h.hat(t + k * B / 2, k % 2 ? 0.05 : 0.08);
      // driving bass (root / octave)
      for (let k = 0; k < 8; k++) h.tone(null, t + k * B / 2, 0.32, 0.11, { f: k % 2 ? chords.r * 2 : chords.r, type: "triangle", attack: 0.005 });
      // bright plucked arpeggio
      for (let k = 0; k < 8; k++) h.tone(null, t + k * B / 2 + 0.02, 0.5, 0.05, { f: chords.c[k % 4] * (k > 3 ? 2 : 1), type: "triangle", attack: 0.005 });
      // lead
      chords.lead.forEach(([b, f]) => h.tone(null, t + b * B, 0.55, 0.075, { f, type: "square", attack: 0.01, lp: 2600 }));
    },
    preview(h, t) { [NF.D5, NF.Fs5, NF.A5, NF.D5 * 2].forEach((f, k) => h.tone(null, t + k * 0.11, 0.4, 0.1, { f, type: "triangle" })); h.kick(t, 0.5); },
  },
  // ---------------- spa ambience ----------------
  champagne: {
    barLen: 8, level: 0.8,
    bar(i, t, h) {
      const chords = [
        { pad: [NF.D3, NF.A3, NF.E4, NF.Fs4, NF.Cs5], bowl: NF.D4 + 0 },
        { pad: [NF.G2 * 2, NF.D3 * 2 / 2 * 1, NF.B3, NF.Fs4, NF.D4], bowl: NF.G3 },
      ][i % 2];
      chords.pad.forEach((f, k) => { h.tone(null, t + k * 0.35, 11, 0.04, { f, attack: 3.2, detune: k % 2 ? 5 : -5 }); });
      // singing bowl: three slightly inharmonic partials
      [[1, 0.1], [2.76, 0.045], [5.4, 0.02]].forEach(([m, v]) => h.tone(null, t + 0.2, 7.5, v, { f: chords.bowl * m, attack: 0.02, detune: 0 }));
      // sparse chimes (pentatonic)
      [[1.8, NF.A5], [3.4, NF.E5], [4.7, NF.Fs5], [6.1, NF.D5 * 2 / 1.0]].forEach(([d, f], k) => h.tone(null, t + d, 3.2, 0.04, { f: f * (k % 2 ? 1 : 1), attack: 0.01, partials: [[1, 1], [2.01, 0.2]] }));
    },
    breeze: true,
    preview(h, t) { [[1, 0.12], [2.76, 0.05]].forEach(([m, v]) => h.tone(null, t, 4, v, { f: NF.D4 * m, attack: 0.02 })); },
  },
};

function useThemeMusic() {
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const verbRef = useRef(null);
  const noiseRef = useRef(null);
  const sessRef = useRef(null);
  const [on, setOn] = useState(true);
  const onRef = useRef(true);
  onRef.current = on;
  const [playing, setPlaying] = useState(null);

  const ensure = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const master = ctx.createGain(); master.gain.value = onRef.current ? 1 : 0; master.connect(ctx.destination);
      const len = Math.floor(ctx.sampleRate * 2.8);
      const buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5); }
      const conv = ctx.createConvolver(); conv.buffer = buf;
      const wet = ctx.createGain(); wet.gain.value = 0.5; conv.connect(wet); wet.connect(master);
      const nbuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const nd = nbuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
      ctxRef.current = ctx; masterRef.current = master; verbRef.current = conv; noiseRef.current = nbuf;
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume().catch(() => {});
    return ctxRef.current;
  }, []);

  // helpers handed to each theme: they write into the current session (dry + reverb send)
  const makeHelpers = useCallback((out, send) => {
    const ctx = ctxRef.current;
    const tone = (_u, t, dur, vol, o = {}) => {
      const f = o.f; const parts = o.partials || [[1, 1]];
      parts.forEach(([m, a]) => {
        const osc = ctx.createOscillator(); const g = ctx.createGain();
        osc.type = o.type || "sine"; osc.frequency.value = f * m; if (o.detune) osc.detune.value = o.detune;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(vol * a, t + (o.attack || 0.01));
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur / (m > 1 ? 1.5 : 1));
        let node = osc;
        if (o.lp) { const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = o.lp; osc.connect(lp); node = lp; }
        node.connect(g); g.connect(out); g.connect(send);
        osc.start(t); osc.stop(t + dur + 0.1);
      });
    };
    const noise = (t, dur, vol, type, freq) => {
      const src = ctx.createBufferSource(); src.buffer = noiseRef.current;
      const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq;
      const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(g); g.connect(out); src.start(t, Math.random()); src.stop(t + dur + 0.05);
    };
    return {
      tone,
      kick: (t, v) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12); g.gain.setValueAtTime(v * 0.9, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2); o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.25); },
      snare: (t, v) => noise(t, 0.14, v, "bandpass", 1900),
      hat: (t, v) => noise(t, 0.04, v, "highpass", 7000),
    };
  }, []);

  const stopSession = useCallback((fade = 0.9) => {
    const s = sessRef.current; const ctx = ctxRef.current;
    if (!s || !ctx) return;
    clearInterval(s.timer); s.alive = false;
    [s.out, s.send].forEach((g) => { g.gain.cancelScheduledValues(ctx.currentTime); g.gain.setTargetAtTime(0, ctx.currentTime, fade / 3); });
    if (s.breeze) setTimeout(() => { try { s.breeze.stop(); } catch (e) { /* already stopped */ } }, fade * 1000 + 300);
    sessRef.current = null; setPlaying(null);
  }, []);

  const start = useCallback((id, level = 1) => {
    const ctx = ensure(); const th = THEMES[id];
    if (!ctx || !th) return;
    if (sessRef.current && sessRef.current.id === id) return;
    stopSession(0.8);
    const out = ctx.createGain(); out.gain.value = 0; out.connect(masterRef.current);
    const send = ctx.createGain(); send.gain.value = 0; send.connect(verbRef.current);
    const lvl = th.level * level;
    out.gain.setTargetAtTime(lvl, ctx.currentTime, 0.9); send.gain.setTargetAtTime(lvl, ctx.currentTime, 0.9);
    const sess = { id, out, send, lvl: th.level, alive: true, bar: 0, next: ctx.currentTime + 0.25, timer: 0, breeze: null };
    if (th.breeze) { // slow "ocean / breeze" noise
      const src = ctx.createBufferSource(); src.buffer = noiseRef.current; src.loop = true;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 520;
      const g = ctx.createGain(); g.gain.value = 0.02;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.09; const lg = ctx.createGain(); lg.gain.value = 0.014; lfo.connect(lg); lg.connect(g.gain); lfo.start();
      src.connect(lp); lp.connect(g); g.connect(out); src.start(); sess.breeze = { stop() { src.stop(); lfo.stop(); } };
    }
    const h = makeHelpers(out, send);
    const pump = () => { if (!sess.alive) return; while (sess.next < ctx.currentTime + 1.6) { th.bar(sess.bar, sess.next, h); sess.next += th.barLen; sess.bar += 1; } };
    pump(); sess.timer = setInterval(pump, 400);
    sessRef.current = sess; setPlaying(id);
  }, [ensure, makeHelpers, stopSession]);

  // quieter while the card is closed
  const setLevel = useCallback((mult) => {
    const s = sessRef.current; const ctx = ctxRef.current; if (!s || !ctx) return;
    [s.out, s.send].forEach((g) => g.gain.setTargetAtTime(s.lvl * mult, ctx.currentTime, 0.6));
  }, []);

  // tiny motif when she hovers a gift (only once audio is unlocked)
  const preview = useCallback((id) => {
    const ctx = ctxRef.current; const th = THEMES[id];
    if (!ctx || ctx.state !== "running" || !th || sessRef.current) return;
    const out = ctx.createGain(); out.gain.value = 0.7; out.connect(masterRef.current);
    const send = ctx.createGain(); send.gain.value = 0.5; send.connect(verbRef.current);
    th.preview(makeHelpers(out, send), ctx.currentTime + 0.02);
    setTimeout(() => { try { out.disconnect(); send.disconnect(); } catch (e) { /* ignore */ } }, 5000);
  }, [makeHelpers]);

  const mute = useCallback((v) => { const ctx = ctxRef.current; if (masterRef.current && ctx) masterRef.current.gain.setTargetAtTime(v ? 1 : 0, ctx.currentTime, 0.1); }, []);
  const toggle = useCallback(() => { setOn((v) => { onRef.current = !v; mute(!v); return !v; }); }, [mute]);

  useEffect(() => () => { const s = sessRef.current; if (s) { clearInterval(s.timer); s.alive = false; } if (ctxRef.current) ctxRef.current.close().catch(() => {}); }, []);
  return { ensure, start, stop: stopSession, setLevel, preview, toggle, on, playing };
}

/* ------------------------------------------------------------------ */
/*  4. STYLES                                                          */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&display=swap');

.gc-stage{container-type:size;position:relative;overflow:hidden;user-select:none;color:#fef3c7;font-family:'Cormorant Garamond',Georgia,serif;background:#1b0710;--acc:#f6d27a;--glow:rgba(255,214,120,.65)}
.gc-bg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.gc-vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(100% 80% at 50% 55%,transparent 45%,rgba(8,1,6,.75))}
.gc-spot{position:absolute;left:50%;top:18%;width:min(120cqw,1300px);height:90%;transform:translateX(-50%);pointer-events:none;background:radial-gradient(50% 60% at 50% 70%,rgba(255,214,150,.28),transparent 70%)}
.gc-flake{position:absolute;top:-4%;border-radius:50%;background:rgba(255,255,255,.85);pointer-events:none;animation:gc-fall linear infinite}
@keyframes gc-fall{0%{transform:translate(0,0)}50%{transform:translate(14px,55cqh)}100%{transform:translate(-8px,108cqh)}}
.gc-lights{position:absolute;left:0;right:0;top:0;height:7cqh;pointer-events:none;z-index:3}
.gc-bulb{position:absolute;width:1.2cqw;min-width:9px;aspect-ratio:.75;border-radius:50% 50% 45% 45%;animation:gc-tw 2.4s ease-in-out infinite}
@keyframes gc-tw{0%,100%{opacity:1}50%{opacity:.4}}
.gc-tw{animation:gc-tw 2.6s ease-in-out infinite}
.gc-flame{transform-box:fill-box;transform-origin:50% 100%;animation:gc-flame .22s ease-in-out infinite alternate}
.gc-flame.b{animation-duration:.3s;animation-delay:-.1s}.gc-flame.c{animation-duration:.26s;animation-delay:-.05s}
@keyframes gc-flame{from{transform:scale(1,1) rotate(-2deg)}to{transform:scale(.88,1.14) rotate(2deg)}}
.gc-glowfire{animation:gc-gf 2.4s ease-in-out infinite alternate}
@keyframes gc-gf{from{opacity:.7}to{opacity:1}}

.gc-snd{position:absolute;right:clamp(8px,2cqw,22px);top:clamp(30px,8cqh,60px);z-index:25;width:40px;height:40px;border-radius:50%;border:1.5px solid rgba(246,210,122,.7);background:rgba(0,0,0,.5);color:#f8dd86;cursor:pointer;font-size:17px;transition:background .2s ease}
.gc-snd:hover{background:rgba(246,210,122,.25)}.gc-snd:focus-visible{outline:2px solid #fff;outline-offset:2px}
.gc-snd.on::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid var(--acc);animation:gc-ripple 2s ease-out infinite}
@keyframes gc-ripple{0%{transform:scale(1);opacity:.8}100%{transform:scale(1.8);opacity:0}}

.gc-head{position:absolute;left:0;right:0;top:8.5cqh;z-index:6;text-align:center;padding:0 5cqw;pointer-events:none}
.gc-kick{margin:0;font-size:clamp(10px,min(1.6cqw,2cqh),14px);letter-spacing:.4em;text-transform:uppercase;font-weight:700;color:#f1c978;animation:gc-rise 1s cubic-bezier(.2,.9,.3,1) both}
.gc-title{margin:.05em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;font-size:clamp(34px,min(7.4cqw,11cqh),88px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 3px 0 rgba(58,0,12,.75)) drop-shadow(0 0 24px rgba(255,200,90,.32));animation:gc-rise 1s cubic-bezier(.2,.9,.3,1) .1s both}
.gc-sub{margin:.3em 0 0;font-style:italic;font-weight:600;color:#ffe9c9;font-size:clamp(15px,min(2.6cqw,3.8cqh),30px);text-shadow:0 2px 10px rgba(0,0,0,.7);animation:gc-rise 1s cubic-bezier(.2,.9,.3,1) .35s both}
@keyframes gc-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}

/* rug */
.gc-rug{position:absolute;left:50%;bottom:1.5cqh;width:min(104cqw,1240px);height:25cqh;transform:translateX(-50%);border-radius:50%;z-index:2;pointer-events:none;
  background:radial-gradient(ellipse at 50% 40%,#8a111c 0 55%,#6a0c18 56% 62%,#e8b84a 63% 64%,#8a111c 65% 76%,#4a0710 77% 100%);box-shadow:0 14px 40px rgba(0,0,0,.6);opacity:.95}
.gc-rug::before{content:"";position:absolute;inset:7%;border-radius:50%;border:2px dashed rgba(255,226,150,.45)}

/* the three slots */
.gc-row{position:absolute;left:50%;bottom:10cqh;transform:translateX(-50%);width:min(94cqw,1080px);display:grid;grid-template-columns:repeat(3,1fr);align-items:end;z-index:4;--W:min(94cqw,1080px)}
.gc-slot{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:0;border:0;background:none;cursor:pointer;color:inherit;font:inherit;
  -webkit-tap-highlight-color:transparent;outline:none;transition:transform 1.2s cubic-bezier(.3,.9,.3,1),opacity .9s ease,filter .6s ease}
.gc-slot:focus-visible .gc-art{filter:drop-shadow(0 0 22px #fff)}
.gc-pop{animation:gc-pop 1s cubic-bezier(.25,1.3,.4,1) both;animation-delay:var(--d,0s)}
@keyframes gc-pop{0%{opacity:0;transform:translateY(-70cqh) scale(.6)}55%{opacity:1;transform:translateY(0) scale(1.06,.92)}75%{transform:scale(.98,1.04)}100%{opacity:1;transform:none}}
.gc-aura{position:absolute;left:50%;bottom:3%;width:130%;aspect-ratio:1;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,var(--glow),transparent 62%);opacity:0;transition:opacity .45s ease;pointer-events:none}
.gc-slot[data-active="true"] .gc-aura{opacity:.95}
.gc-art{position:relative;height:clamp(120px,min(40cqh,29cqw * 1.14),420px);aspect-ratio:220/250;transition:transform .5s cubic-bezier(.3,1.4,.4,1),filter .5s ease;
  animation:gc-float 4.2s ease-in-out infinite;animation-delay:var(--f,0s);filter:drop-shadow(0 10px 14px rgba(0,0,0,.5))}
@keyframes gc-float{0%,100%{translate:0 0}50%{translate:0 -1.4cqh}}
.gc-slot[data-active="true"] .gc-art{transform:translateY(-2.2cqh) scale(1.07);filter:drop-shadow(0 14px 20px rgba(0,0,0,.5)) drop-shadow(0 0 26px var(--glow))}
.gc-cushion{width:92%;height:2.4cqh;min-height:12px;margin-top:-1.6cqh;border-radius:50%;background:radial-gradient(ellipse,#e8b84a,#7a4f10);box-shadow:0 8px 14px rgba(0,0,0,.6),0 0 0 3px rgba(255,243,191,.25);z-index:-1}
.gc-tag{position:relative;margin-top:clamp(5px,1.2cqh,12px);display:flex;align-items:center;gap:.45em;padding:.18em 1em .22em .55em;border-radius:6px 999px 999px 6px;background:linear-gradient(180deg,#fff3d6,#f1dcb0);color:#5a1426;font-weight:700;letter-spacing:.04em;font-size:clamp(13px,min(2cqw,2.8cqh),22px);box-shadow:0 5px 12px rgba(0,0,0,.5);transition:opacity .8s ease,transform .4s ease}
.gc-tag::before{content:"";position:absolute;left:.5em;top:50%;width:.45em;height:.45em;margin-top:-.22em;border-radius:50%;background:#2b0a10;display:none}
.gc-tag span{font-size:1.25em;line-height:1}
.gc-slot[data-active="true"] .gc-tag{transform:translateY(-3px) scale(1.05)}
.gc-label{position:absolute;top:-2cqh;left:50%;translate:-50% 0;white-space:nowrap;padding:.3em 1.1em;border-radius:999px;border:1px solid rgba(253,230,138,.8);background:rgba(58,10,18,.94);
  color:#ffe9b0;font-weight:700;font-style:italic;font-size:clamp(14px,min(2cqw,3.2cqh),24px);opacity:0;transform:translateY(8px);transition:all .3s ease;pointer-events:none;box-shadow:0 6px 18px rgba(0,0,0,.5);z-index:3}
.gc-slot[data-active="true"] .gc-label{opacity:1;transform:none}

/* selection: the chosen one comes to the middle, the others melt away */
.gc-row[data-choice]{pointer-events:none}
.gc-slot.is-other{opacity:0;transform:scale(.55) translateY(4cqh);filter:blur(3px)}
.gc-slot.is-chosen[data-i="0"]{transform:translateX(calc(var(--W) / 3)) scale(1.28)}
.gc-slot.is-chosen[data-i="2"]{transform:translateX(calc(var(--W) / -3)) scale(1.28)}
.gc-slot.is-chosen[data-i="1"]{transform:scale(1.28)}
.gc-slot.is-chosen .gc-art{animation:none}
.gc-slot.is-chosen .gc-tag{opacity:0}
.gc-row[data-instant] .gc-slot,.gc-row[data-instant] .gc-lid{transition-duration:.01s}

/* lid + light */
.gc-lid{transform-box:fill-box;transform-origin:30% 100%;transition:transform 1.4s cubic-bezier(.3,.9,.3,1) 1.1s}
.is-open .gc-lid{transform:translate(-26px,-72px) rotate(-17deg)}
.gc-inner,.gc-beam{opacity:0;transition:opacity 1.2s ease 1.4s}
.is-open .gc-inner{opacity:1}
.is-open .gc-beam{opacity:.85;animation:gc-beam 3s ease-in-out 2.4s infinite}
@keyframes gc-beam{0%,100%{opacity:.7}50%{opacity:1}}
.gc-spark{position:absolute;left:50%;top:30%;width:.9em;height:.9em;margin:-.45em;pointer-events:none;opacity:0;
  background:#fff3bf;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);filter:drop-shadow(0 0 6px #ffd45a)}
.is-open .gc-spark{animation:gc-spark 2.2s cubic-bezier(.15,.7,.3,1) forwards;animation-delay:calc(1.7s + var(--sd,0s))}
@keyframes gc-spark{0%{opacity:1;transform:translate(0,0) scale(.3)}70%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.2) rotate(120deg)}}

/* themed particles around the chosen gift */
.gc-fx{position:absolute;inset:0;z-index:7;pointer-events:none;overflow:hidden}
.gc-p{position:absolute;bottom:-6%;animation:gc-up linear infinite;opacity:0}
@keyframes gc-up{0%{transform:translate(0,0) rotate(0) scale(.6);opacity:0}12%{opacity:.9}100%{transform:translate(var(--dx),-112cqh) rotate(var(--rot)) scale(1.1);opacity:0}}

/* card */
.gc-veil{position:absolute;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:3cqh 4cqw;background:radial-gradient(70% 60% at 50% 45%,rgba(20,4,12,.55),rgba(8,1,6,.82));backdrop-filter:blur(3px);animation:gc-fade .6s ease both}
@keyframes gc-fade{from{opacity:0}to{opacity:1}}
.gc-card{position:relative;width:min(100%,580px);max-height:100%;overflow:auto;text-align:center;border-radius:18px;padding:clamp(18px,4cqh,40px) clamp(18px,4cqw,44px);color:#3b2410;
  box-shadow:0 0 0 3px var(--c1),0 0 0 7px rgba(0,0,0,.35),0 30px 70px rgba(0,0,0,.65),0 0 60px var(--glow);animation:gc-card .9s cubic-bezier(.2,.9,.3,1) both;scrollbar-width:thin}
@keyframes gc-card{from{opacity:0;transform:translateY(26px) scale(.93)}to{opacity:1;transform:none}}
.gc-card::before{content:"";position:absolute;inset:7px;border-radius:12px;border:1.5px dashed var(--c2);pointer-events:none}
.t-red{--c1:#e0527f;--c2:rgba(178,40,90,.5);background:radial-gradient(120% 100% at 30% 10%,#fff4f0,#fbdde0 60%,#f4c4cd)}
.t-green{--c1:#1f9a62;--c2:rgba(20,100,60,.5);background:radial-gradient(120% 100% at 30% 10%,#fdf3d8,#f1e0b0 60%,#e0c98c)}
.t-champagne{--c1:#d9b878;--c2:rgba(140,100,40,.45);background:radial-gradient(120% 100% at 30% 10%,#fffdf6,#f4ecd8 60%,#e8dcbc)}
.gc-card .ico{display:block;width:clamp(60px,min(13cqw,16cqh),110px);height:auto;margin:0 auto .2em;filter:drop-shadow(0 6px 6px rgba(0,0,0,.25));animation:gc-bob 3s ease-in-out infinite alternate}
@keyframes gc-bob{from{transform:translateY(0) rotate(-3deg)}to{transform:translateY(-5px) rotate(3deg)}}
.gc-card h2{margin:0;font-style:italic;font-weight:700;color:var(--ink,#7a1426);font-size:clamp(24px,min(4.4cqw,7cqh),44px)}
.t-red h2,.t-red .sig{--ink:#a3123a}.t-green h2,.t-green .sig{--ink:#0f5a36}.t-champagne h2,.t-champagne .sig{--ink:#8a1a2e}
.gc-card p{margin:.7em 0 0;font-style:italic;font-weight:600;line-height:1.45;font-size:clamp(17px,min(2.6cqw,4cqh),27px)}
.gc-card .sig{font-family:'Caveat',cursive;font-weight:700;font-style:normal;color:var(--ink,#7a1426);font-size:clamp(22px,min(3.2cqw,5cqh),36px);text-align:right}
.gc-btn{margin-top:1.1em;padding:.45em 1.6em;border:0;border-radius:999px;cursor:pointer;font-family:inherit;font-weight:700;color:#5a0f19;font-size:clamp(16px,min(2.2cqw,3.4cqh),26px);
  background:linear-gradient(180deg,#fff3bf,#e8b84a 55%,#c98a1e);box-shadow:0 4px 0 #8a5a12,0 10px 24px rgba(0,0,0,.4)}
.gc-btn:hover{filter:brightness(1.06)}.gc-btn:focus-visible{outline:3px solid #fff;outline-offset:3px}
.gc-btn.ghost{background:rgba(0,0,0,.45);color:#f8dd86;box-shadow:inset 0 0 0 1.5px rgba(246,210,122,.7)}
.gc-foot{position:absolute;left:0;right:0;bottom:2.2cqh;z-index:8;display:flex;flex-direction:column;align-items:center;gap:.5em;text-align:center;padding:0 4cqw;animation:gc-rise 1s ease both}
.gc-foot p{margin:0;font-style:italic;font-weight:600;font-size:clamp(16px,min(2.4cqw,3.6cqh),28px);text-shadow:0 2px 10px rgba(0,0,0,.8)}
.gc-foot .row{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}

@media (prefers-reduced-motion: reduce){
  .gc-flake,.gc-bulb,.gc-tw,.gc-flame,.gc-glowfire,.gc-art,.gc-pop,.gc-p,.gc-card .ico,.gc-snd.on::after,.is-open .gc-beam{animation:none !important}
  .gc-slot,.gc-lid,.gc-inner,.gc-beam{transition-duration:.01s !important;transition-delay:0s !important}
}
`;

/* ------------------------------------------------------------------ */
/*  5. THE LIVING ROOM (background)                                    */
/* ------------------------------------------------------------------ */

function Room({ bulbs }) {
  const cols = ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"];
  const treeLights = [[-22, 250], [20, 290], [-46, 330], [40, 372], [-68, 412], [60, 450], [0, 330], [-12, 210], [24, 420]];
  return (
    <svg className="gc-bg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="gcWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a0d1c" /><stop offset="1" stopColor="#5a1626" /></linearGradient>
        <linearGradient id="gcWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6a3a1c" /><stop offset="1" stopColor="#2a140a" /></linearGradient>
        <linearGradient id="gcGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".5" stopColor="#e8b84a" /><stop offset="1" stopColor="#8a5a12" /></linearGradient>
        <linearGradient id="gcLeaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f9a52" /><stop offset="1" stopColor="#0f5a36" /></linearGradient>
        <linearGradient id="gcStone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a6a60" /><stop offset="1" stopColor="#3a302c" /></linearGradient>
        <radialGradient id="gcFire"><stop offset="0" stopColor="#ffd98a" stopOpacity=".9" /><stop offset="1" stopColor="#ff7a2a" stopOpacity="0" /></radialGradient>
        <pattern id="gcDamask" width="46" height="46" patternUnits="userSpaceOnUse"><circle cx="23" cy="23" r="2.4" fill="#ffffff" opacity=".05" /><path d="M23 6Q30 14 23 22Q16 14 23 6ZM23 40Q30 32 23 24Q16 32 23 40Z" fill="#ffffff" opacity=".04" /></pattern>
      </defs>
      <rect width="1000" height="600" fill="url(#gcWall)" />
      <rect width="1000" height="600" fill="url(#gcDamask)" />
      {/* wainscot */}
      <rect x="0" y="360" width="1000" height="150" fill="#4a1020" /><rect x="0" y="356" width="1000" height="8" fill="url(#gcGold)" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={20 + i * 124} y="378" width="104" height="112" rx="4" fill="none" stroke="#e8b84a" strokeOpacity=".35" strokeWidth="2" />)}
      {/* floor */}
      <rect x="0" y="500" width="1000" height="100" fill="url(#gcWood)" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 90} 500L${i * 90 - 70 + 140 * (i % 2)} 600`} stroke="#000" strokeOpacity=".25" />)}
      <rect x="0" y="498" width="1000" height="6" fill="#d9a336" opacity=".6" />

      {/* garland across the top */}
      <path d="M-20 14Q120 70 250 24T500 24T750 24T1020 14" fill="none" stroke="#0f4a2c" strokeWidth="14" strokeLinecap="round" />
      {Array.from({ length: 20 }, (_, i) => { const x = i * 52 + 14; const y = 30 + Math.sin(i * 1.3) * 6 + (i % 5 === 0 ? 8 : 0); return <g key={i}><circle cx={x} cy={y + 8} r="9" fill={cols[i % 5]} opacity=".3" /><circle className="gc-tw" cx={x} cy={y + 8} r="4.4" fill={cols[i % 5]} style={{ animationDelay: `${(i % 5) * 0.4}s` }} /></g>; })}

      {/* Christmas tree (left) */}
      <g transform="translate(120 0)">
        <rect x="-12" y="470" width="24" height="34" fill="#6a3a18" />
        <path d="M0 150L38 232H18L58 310H24L74 392H28L92 480H-92L-28 392H-74L-24 310H-58L-18 232H-38Z" fill="url(#gcLeaf)" stroke="#0a3b23" strokeWidth="2" strokeLinejoin="round" />
        <path d="M-58 310Q0 340 58 310M-74 392Q0 428 74 392M-38 232Q0 258 38 232" fill="none" stroke="#f6e7c1" strokeWidth="4" strokeLinecap="round" />
        {treeLights.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="9" fill={cols[i % 5]} opacity=".3" /><circle className="gc-tw" cx={x} cy={y} r="4.4" fill={cols[i % 5]} style={{ animationDelay: `${i * 0.3}s` }} /></g>)}
        {[[-30, 280, "#d9262f"], [32, 350, "#f2b632"], [-50, 420, "#2f6fd0"], [10, 440, "#d9262f"], [-8, 250, "#f2b632"]].map(([x, y, c], i) => <g key={i}><circle cx={x} cy={y} r="9" fill={c} /><circle cx={x - 3} cy={y - 3} r="2.6" fill="#fff" opacity=".7" /></g>)}
        <path d="M0 118L8 142L34 142L13 157L21 182L0 167L-21 182L-13 157L-34 142L-8 142Z" fill="#ffd45a" style={{ filter: "drop-shadow(0 0 10px #ffd45a)" }} />
        <g><rect x="-92" y="470" width="44" height="34" rx="4" fill="#d9262f" /><rect x="-74" y="470" width="8" height="34" fill="#f6e7c1" /><rect x="-92" y="484" width="44" height="7" fill="#f6e7c1" /><rect x="50" y="476" width="40" height="28" rx="4" fill="#1f9a62" /><rect x="66" y="476" width="8" height="28" fill="#f2c24a" /><rect x="20" y="486" width="30" height="18" rx="3" fill="#8a4fd0" /></g>
      </g>

      {/* fireplace (right) */}
      <g transform="translate(860 0)">
        <ellipse cx="0" cy="400" rx="210" ry="160" fill="url(#gcFire)" className="gc-glowfire" />
        <rect x="-110" y="250" width="220" height="250" rx="6" fill="url(#gcStone)" />
        {Array.from({ length: 6 }, (_, r) => Array.from({ length: 5 }, (_, c) => <rect key={`${r}${c}`} x={-106 + c * 44 + (r % 2 ? 22 : 0)} y={254 + r * 40} width="40" height="36" rx="3" fill="#000" opacity={0.07 + (r + c) % 3 * 0.03} />))}
        <rect x="-130" y="232" width="260" height="22" rx="4" fill="url(#gcWood)" /><rect x="-130" y="232" width="260" height="4" fill="#d9a336" />
        <path d="M-70 500V348Q-70 312 0 312Q70 312 70 348V500Z" fill="#120806" />
        <path d="M-60 500V352Q-60 322 0 322Q60 322 60 352V500Z" fill="#241008" />
        <rect x="-50" y="476" width="100" height="14" rx="6" fill="#4a2a14" /><rect x="-40" y="466" width="80" height="12" rx="5" fill="#5a3418" />
        <path className="gc-flame" d="M-30 470C-44 440 -26 420 -30 396C-8 410 -2 430 -8 448C4 438 8 424 4 410C26 426 34 452 22 470Z" fill="#ff7a2a" />
        <path className="gc-flame b" d="M-14 470C-24 450 -10 436 -12 420C4 430 8 446 4 470Z" fill="#ffb347" />
        <path className="gc-flame c" d="M6 470C-2 458 8 450 6 438C16 446 20 460 16 470Z" fill="#fff3bf" />
        {/* mantel garland + candles + stockings */}
        <path d="M-130 238Q0 268 130 238" fill="none" stroke="#0f4a2c" strokeWidth="10" strokeLinecap="round" />
        {[-100, -60, -20, 20, 60, 100].map((x, i) => <circle key={x} className="gc-tw" cx={x} cy={252 + Math.sin((i / 5) * Math.PI) * 8} r="3.6" fill={cols[i % 5]} style={{ animationDelay: `${i * 0.35}s` }} />)}
        {[-96, 96].map((x) => <g key={x}><rect x={x - 6} y="200" width="12" height="32" fill="#fff6e4" /><path className="gc-flame" d={`M${x} 178C${x - 6} 188 ${x - 4} 194 ${x} 198C${x + 4} 194 ${x + 6} 188 ${x} 178Z`} fill="#ffb347" /></g>)}
        {[[-64, "#d9262f"], [0, "#1f9a62"], [64, "#2f6fd0"]].map(([x, c], i) => <g key={i} transform={`translate(${x} 258)`}><path d="M-12 0H12V34Q12 52 -2 56Q-18 60 -16 44L-12 36Z" fill={c} stroke="#00000055" /><rect x="-14" y="-4" width="28" height="12" rx="4" fill="#fff6e4" /></g>)}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  6. THE GIFT (SVG, clay style)                                      */
/* ------------------------------------------------------------------ */

// point on the top face: A(32,96) front-left, B(144,96) front-right, D(72,78) back-left
const P = (u, v) => [32 + 112 * u + 40 * v, 96 - 18 * v];
const star = (x, y, r) => `M${x} ${y - r}L${x + r * 0.3} ${y - r * 0.3}L${x + r} ${y}L${x + r * 0.3} ${y + r * 0.3}L${x} ${y + r}L${x - r * 0.3} ${y + r * 0.3}L${x - r} ${y}L${x - r * 0.3} ${y - r * 0.3}Z`;
const heart = (x, y, r) => `M${x} ${y + r * 0.9}C${x - r * 1.5} ${y - r * 0.1} ${x - r * 0.7} ${y - r * 1.1} ${x} ${y - r * 0.35}C${x + r * 0.7} ${y - r * 1.1} ${x + r * 1.5} ${y - r * 0.1} ${x} ${y + r * 0.9}Z`;
const petal = (x, y, r) => `M${x} ${y - r}Q${x + r * 0.9} ${y} ${x} ${y + r}Q${x - r * 0.9} ${y} ${x} ${y - r}Z`;

function mark(motif, x, y, r, col, op, key) {
  if (motif === "hearts") return <path key={key} d={heart(x, y, r)} fill={col} opacity={op} />;
  if (motif === "stars") return <path key={key} d={star(x, y, r * 1.3)} fill={col} opacity={op} />;
  return <path key={key} d={petal(x, y, r * 1.2)} fill={col} opacity={op * 0.8} transform={`rotate(${(key.length * 37) % 60 - 30} ${x} ${y})`} />;
}

function GiftSvg({ g, uid, vis }) {
  const body = g.body;
  const front = body; const side = darken(body, 0.2); const top = lighten(body, 0.14); const inner = "#ffe9a8";
  const rib = g.ribbon; const ribSide = darken(rib, 0.16); const ribTop = lighten(rib, 0.06);
  const band = (u0, u1, v0, v1) => [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)].map((p) => p.join(",")).join(" ");
  const clip = `gc-clip-${uid}`;
  const rimStroke = (c) => ({ stroke: c, strokeWidth: 8, strokeLinejoin: "round" });
  const col = g.dots; const motif = vis.motif;
  const items = [];
  [138, 164, 190, 214].forEach((y, j) => [50, 68, 110, 128].forEach((x, i) => items.push(mark(motif, x + (j % 2 ? 9 : 0), y, 6.2, col, 0.95, `f${i}${j}`))));
  const sideItems = [];
  [0.2, 0.8].forEach((u, i) => [0.3, 0.62, 0.92].forEach((v, j) => sideItems.push(mark(motif, 138 + 40 * u, 112 + 110 * v - 18 * u, 4.4, col, 0.9, `s${i}${j}`))));
  return (
    <svg viewBox="0 0 220 250" className="gc-art" role="img" aria-hidden="true" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`sh-${uid}`} cx="35%" cy="25%" r="80%"><stop offset="0" stopColor="#fff" stopOpacity=".42" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".18" /></radialGradient>
        <linearGradient id={`beam-${uid}`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fff3bf" stopOpacity=".95" /><stop offset="1" stopColor="#fff3bf" stopOpacity="0" /></linearGradient>
        <radialGradient id={`in-${uid}`} cx="50%" cy="50%" r="60%"><stop offset="0" stopColor="#fff" /><stop offset=".5" stopColor={inner} /><stop offset="1" stopColor="#e8a83a" /></radialGradient>
        <clipPath id={clip}><rect x="38" y="112" width="100" height="110" rx="14" /></clipPath>
      </defs>
      <ellipse cx="110" cy="230" rx="86" ry="13" fill="#000" opacity=".4" />
      <polygon className="gc-beam" points="84,96 160,86 214,-70 24,-70" fill={`url(#beam-${uid})`} style={{ mixBlendMode: "screen" }} />

      <path d="M138 112 L178 94 V198 Q178 208 168 212 L138 222Z" fill={side} {...rimStroke(side)} />
      <rect x="38" y="112" width="100" height="110" rx="16" fill={front} {...rimStroke(front)} />
      <g clipPath={`url(#${clip})`}>{items}</g>
      <g>{sideItems}</g>
      <rect x="79" y="112" width="18" height="110" fill={rib} />
      <polygon points="154.8,104.4 161.2,101.6 161.2,211.6 154.8,214.4" fill={ribSide} />
      <rect x="38" y="112" width="100" height="110" rx="16" fill={`url(#sh-${uid})`} />
      <polygon className="gc-inner" points="42,112 138,112 178,94 80,94" fill={`url(#in-${uid})`} />

      <g className="gc-lid">
        <path d="M144 96 L184 78 V108 Q184 116 176 119 L144 126Z" fill={side} {...rimStroke(side)} />
        <rect x="32" y="96" width="112" height="30" rx="13" fill={front} {...rimStroke(front)} />
        <polygon points={`${P(0, 0)},${P(1, 0)},${P(1, 1)},${P(0, 1)}`} fill={top} {...rimStroke(top)} />
        {[[0.2, 0.3], [0.8, 0.3], [0.2, 0.75], [0.8, 0.75]].map(([u, v], i) => mark(motif, P(u, v)[0], P(u, v)[1], 4.2, col, 0.95, `l${i}`))}
        {[40, 54, 108, 122].map((x) => mark(motif, x, 111, 4.6, col, 0.95, `b${x}`))}
        <polygon points={band(0, 1, 0.42, 0.58)} fill={ribTop} />
        <polygon points={band(0.42, 0.58, 0, 1)} fill={ribTop} />
        <rect x="79" y="96" width="18" height="30" fill={rib} />
        <polygon points="160.8,88.4 167.2,85.6 167.2,115.6 160.8,118.4" fill={ribSide} />
        <rect x="32" y="96" width="112" height="30" rx="13" fill={`url(#sh-${uid})`} opacity=".8" />
        {/* puffy bow */}
        <g transform="translate(108 80)">
          <path d="M-8 14 Q-24 40 -42 38 Q-30 22 -14 12Z" fill={darken(rib, 0.1)} stroke={darken(rib, 0.1)} strokeWidth="5" strokeLinejoin="round" />
          <path d="M8 14 Q24 40 42 38 Q30 22 14 12Z" fill={darken(rib, 0.1)} stroke={darken(rib, 0.1)} strokeWidth="5" strokeLinejoin="round" />
          <path d="M-4 0 Q-24 -34 -52 -14 Q-60 6 -34 10 Q-14 12 -4 4Z" fill={rib} stroke={rib} strokeWidth="6" strokeLinejoin="round" />
          <path d="M4 0 Q24 -34 52 -14 Q60 6 34 10 Q14 12 4 4Z" fill={rib} stroke={rib} strokeWidth="6" strokeLinejoin="round" />
          <path d="M-8 -2 Q-26 -22 -46 -10" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />
          <path d="M8 -2 Q26 -22 46 -10" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="0" cy="3" rx="13" ry="11" fill={darken(rib, 0.06)} stroke={darken(rib, 0.06)} strokeWidth="4" />
          <ellipse cx="-3" cy="0" rx="5" ry="3.4" fill="#fff" opacity=".5" />
        </g>
      </g>
    </svg>
  );
}

/* little themed illustrations for the cards */
function Icon({ theme }) {
  if (theme === "red") {
    return (
      <svg className="ico" viewBox="0 0 120 120" aria-hidden="true">
        <path d="M60 118C58 90 56 76 60 56M60 118C64 92 70 78 80 60M60 118C54 94 46 80 36 64" fill="none" stroke="#2f9a52" strokeWidth="4" strokeLinecap="round" />
        <path d="M44 100Q36 84 50 80Q56 92 52 100Z M76 100Q86 84 72 80Q66 92 70 100Z" fill="#2f9a52" />
        {[[60, 44, "#e0527f"], [36, 56, "#ff9fbb"], [84, 56, "#d9262f"], [48, 30, "#ffd1dc"], [72, 30, "#ff7a9a"]].map(([x, y, c], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>{[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx="0" cy="-9" rx="6.5" ry="9" fill={c} transform={`rotate(${r})`} />)}<circle r="5" fill="#f8dd86" /></g>
        ))}
        <path d="M44 100L76 100L70 116L50 116Z" fill="#fff6e8" stroke="#e8b84a" strokeWidth="2" /><path d="M60 100V116" stroke="#d9262f" strokeWidth="5" />
      </svg>
    );
  }
  if (theme === "green") {
    return (
      <svg className="ico" viewBox="0 0 120 120" aria-hidden="true">
        <path d="M10 56C10 24 34 8 60 8C86 8 110 24 110 56Z" fill="#d9262f" stroke="#a3121f" strokeWidth="2" strokeLinejoin="round" />
        <path d="M60 8C46 14 36 32 36 56M60 8C74 14 84 32 84 56M60 8V56" fill="none" stroke="#fff6e8" strokeWidth="5" />
        <path d="M10 56Q22 64 36 56Q48 64 60 56Q72 64 84 56Q98 64 110 56" fill="none" stroke="#a3121f" strokeWidth="2" />
        <path d="M14 58L56 100M36 58L58 98M84 58L62 98M106 58L64 100" stroke="#6a4a2a" strokeWidth="1.6" />
        <circle cx="60" cy="104" r="6" fill="#f2c9a0" /><rect x="54" y="108" width="12" height="10" rx="3" fill="#1f6a4a" />
        <path d="M30 20L34 12L38 20" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className="ico" viewBox="0 0 120 120" aria-hidden="true">
      <ellipse cx="60" cy="106" rx="42" ry="8" fill="#000" opacity=".15" />
      <ellipse cx="38" cy="100" rx="14" ry="7" fill="#9a8a78" /><ellipse cx="38" cy="94" rx="10" ry="5" fill="#b8a890" /><ellipse cx="86" cy="101" rx="12" ry="6" fill="#a89888" />
      {[-62, -34, 0, 34, 62].map((r, i) => <path key={i} d="M60 92C46 76 46 54 60 40C74 54 74 76 60 92Z" fill={i % 2 ? "#ffb3c6" : "#ff8fb0"} stroke="#e0527f" strokeWidth="1.4" transform={`rotate(${r} 60 92)`} />)}
      <rect x="54" y="26" width="12" height="18" rx="3" fill="#fff6e8" stroke="#e8dcc4" /><path d="M60 8C54 16 55 22 60 25C65 22 66 16 60 8Z" fill="#ffb347" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  7. THE COMPONENT                                                   */
/* ------------------------------------------------------------------ */

export default function GiftChoice({ className = "" }) {
  const [choice, setChoice] = useState(readChoice);
  const restored = useRef(!!choice).current;
  const [stage, setStage] = useState(restored ? "done" : "choosing"); // choosing → opening → revealed → done
  const [armed, setArmed] = useState(null);
  const [hover, setHover] = useState(null);
  const lock = useRef(restored);
  const touch = useRef(false);
  const music = useThemeMusic();

  const flakes = useMemo(() => { const r = rng(9); return Array.from({ length: 30 }, (_, i) => ({ id: i, left: r() * 100, size: r() * 4 + 2, dur: r() * 7 + 9, delay: -r() * 14, o: 0.35 + r() * 0.5 })); }, []);
  const bulbs = useMemo(() => Array.from({ length: 24 }, (_, i) => ({ id: i, x: (i + 0.5) * (100 / 24), c: ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc"][i % 4], y: 20 + Math.sin((i / 23) * Math.PI * 6) * 14 })), []);
  const sparks = useMemo(() => { const r = rng(4); return Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; const d = 90 + r() * 90; return { id: i, dx: Math.cos(a) * d, dy: Math.sin(a) * d - 60, sd: r() * 0.4 }; }); }, []);
  const particles = useMemo(() => { const r = rng(21); return Array.from({ length: 26 }, (_, i) => ({ id: i, left: 4 + r() * 92, size: 14 + r() * 22, dur: 7 + r() * 7, delay: -r() * 12, dx: (r() - 0.5) * 120, rot: (r() - 0.5) * 360, c: i })); }, []);

  const chosen = GIFTS.find((g) => g.id === choice);
  const chosenIdx = GIFTS.findIndex((g) => g.id === choice);
  const cTheme = chosen ? themeOf(chosen, chosenIdx) : null;
  const cVis = chosen ? visOf(chosen, chosenIdx) : null;
  const opened = !!choice && stage !== "choosing";

  // opening → card after the lid has lifted
  useEffect(() => {
    if (stage !== "opening") return undefined;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setTimeout(() => setStage("revealed"), reduce ? 600 : 3900);
    return () => clearTimeout(id);
  }, [stage]);

  // the music follows the card: full volume while she reads, softer behind the closed card
  useEffect(() => { music.setLevel(stage === "done" ? 0.45 : 1); }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = useCallback((id) => {
    if (lock.current) return; // final: ignores fast double clicks, other gifts, everything
    lock.current = true;
    saveChoice(id);
    setChoice(id);
    setArmed(null);
    setHover(null);
    setStage("opening");
    const idx = GIFTS.findIndex((g) => g.id === id);
    music.ensure();
    music.start(themeOf(GIFTS[idx], idx)); // ← the music of THIS gift
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onClick = (g) => {
    if (lock.current) return;
    music.ensure(); // unlocks audio on the first touch/click
    // touch screens: first tap highlights, second tap confirms
    if (touch.current && armed !== g.id) { setArmed(g.id); music.preview(themeOf(g, GIFTS.indexOf(g))); return; }
    pick(g.id);
  };

  // sound button: mute/unmute, or start the theme if she came back after a reload
  const onSound = () => {
    music.ensure();
    if (restored && choice && !music.playing) { music.start(cTheme, 0.45); return; }
    music.toggle();
  };

  const stageVars = cVis ? { "--acc": cVis.accent, "--glow": cVis.glow } : {};

  return (
    <div className={`gc-stage relative h-full min-h-[100svh] w-full max-h-full max-w-full overflow-hidden ${className}`} style={stageVars} onClick={(e) => { if (e.target === e.currentTarget) setArmed(null); }}>
      <style>{CSS}</style>
      <Room bulbs={bulbs} />
      <div className="gc-spot" aria-hidden="true" />
      {flakes.map((f) => <span key={f.id} className="gc-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true" />)}
      <div className="gc-vig" aria-hidden="true" />
      <div className="gc-lights" aria-hidden="true">
        {bulbs.map((b) => <span key={b.id} className="gc-bulb" style={{ left: `${b.x}%`, top: `${b.y * 0.2}cqh`, background: b.c, boxShadow: `0 0 12px 3px ${b.c}`, animationDelay: `${(b.id % 5) * 0.4}s` }} />)}
      </div>

      <button type="button" className={`gc-snd ${music.playing && music.on ? "on" : ""}`} onClick={onSound} aria-pressed={music.on} aria-label={music.on ? TEXTS.musicOn : TEXTS.musicOff} title={music.on ? TEXTS.musicOn : TEXTS.musicOff}>{music.on ? "♫" : "♪"}</button>

      <header className="gc-head" aria-live="polite">
        <p className="gc-kick">✦ Una sorpresa para ti ✦</p>
        <h1 className="gc-title">{TEXTS.title}</h1>
        <p className="gc-sub">{choice ? (stage === "opening" ? TEXTS.opening : TEXTS.chosen) : TEXTS.subtitle}</p>
      </header>

      <div className="gc-rug" aria-hidden="true" />

      {/* themed particles once a gift is chosen: hearts / stars / bubbles */}
      {opened && cTheme && (
        <div className="gc-fx" aria-hidden="true">
          {particles.map((p) => (
            <span key={p.id} className="gc-p" style={{ left: `${p.left}%`, fontSize: p.size, color: cTheme === "red" ? ["#ff7a9a", "#ff9fbb", "#e0527f"][p.c % 3] : cTheme === "green" ? ["#ffd45a", "#4fe0a0", "#fff3bf"][p.c % 3] : "#fff3d6", animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, "--dx": `${p.dx}px`, "--rot": `${p.rot}deg` }}>
              {cTheme === "red" ? "❤" : cTheme === "green" ? (p.c % 2 ? "✦" : "★") : "○"}
            </span>
          ))}
        </div>
      )}

      <div className="gc-row" data-choice={choice || undefined} data-instant={restored ? "" : undefined} role="group" aria-label={TEXTS.title}>
        {GIFTS.map((g, i) => {
          const isChosen = choice === g.id;
          const isOther = !!choice && !isChosen;
          const active = !choice && (hover === g.id || armed === g.id);
          const vis = visOf(g, i);
          return (
            <button
              key={g.id} type="button" data-i={i} data-active={active}
              className={`gc-slot gc-pop ${isChosen ? "is-chosen" : ""} ${isOther ? "is-other" : ""} ${isChosen && opened ? "is-open" : ""}`}
              style={{ "--d": `${0.3 + i * 0.28}s`, "--f": `${i * 0.7}s`, "--glow": vis.glow, zIndex: isChosen ? 3 : 1 }}
              aria-label={`${g.name} : ${TEXTS.pick}`} aria-disabled={!!choice} tabIndex={choice ? -1 : 0}
              onPointerDown={(e) => { touch.current = e.pointerType === "touch"; }}
              onPointerEnter={(e) => { if (e.pointerType !== "touch" && !lock.current) { setHover(g.id); music.preview(themeOf(g, i)); } }}
              onPointerLeave={() => setHover((h) => (h === g.id ? null : h))}
              onFocus={() => !lock.current && setHover(g.id)} onBlur={() => setHover((h) => (h === g.id ? null : h))}
              onClick={() => onClick(g)}
            >
              <span className="gc-aura" aria-hidden="true" />
              <span className="gc-label">{armed === g.id ? TEXTS.pickTouch : TEXTS.pick}</span>
              <GiftSvg g={g} uid={g.id} vis={vis} />
              <span className="gc-cushion" aria-hidden="true" />
              <span className="gc-tag"><span aria-hidden="true">{vis.icon}</span>{g.name}</span>
              {isChosen && sparks.map((s) => <span key={s.id} className="gc-spark" style={{ "--dx": `${s.dx}px`, "--dy": `${s.dy}px`, "--sd": `${s.sd}s` }} aria-hidden="true" />)}
            </button>
          );
        })}
      </div>

      {stage === "revealed" && chosen && (
        <div className="gc-veil" role="dialog" aria-modal="true" aria-label={chosen.surprise.title}>
          <div className={`gc-card ${cVis.cls}`}>
            <Icon theme={cTheme} />
            <h2>{chosen.surprise.title}</h2>
            <p>{chosen.surprise.message}</p>
            <p className="sig">{chosen.surprise.signature}</p>
            <button type="button" className="gc-btn" autoFocus onClick={() => setStage("done")}>{TEXTS.close}</button>
          </div>
        </div>
      )}

      {stage === "done" && chosen && (
        <div className="gc-foot">
          <p>{TEXTS.chosen}</p>
          <div className="row">
            <button type="button" className="gc-btn" style={{ marginTop: 0 }} onClick={() => setStage("revealed")}>{TEXTS.reopen}</button>
            {restored && !music.playing && <button type="button" className="gc-btn ghost" style={{ marginTop: 0 }} onClick={onSound}>{TEXTS.listen}</button>}
          </div>
        </div>
      )}
    </div>
  );
}