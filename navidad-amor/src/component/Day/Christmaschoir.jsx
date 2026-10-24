import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  1. TEXTS (Spanish)                                                 */
/* ------------------------------------------------------------------ */

const TEXTS = {
  title: "Noche de villancicos",
  hintOff: "Toca el botón para escuchar a la orquesta",
  hintOn: "♪ Cascabel, cascabel… ♪",
  play: "Activar música",
  stop: "Silenciar",
  tapHint: "Toca la escena para hacer brotar notas doradas",
};

/* ------------------------------------------------------------------ */
/*  2. CONSTANTS & HELPERS                                             */
/* ------------------------------------------------------------------ */

const VIEW = { w: 1200, h: 675 };
const BPM = 120; // every CSS loop below is a multiple of one beat (0.5 s)

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const PAL = {
  red: { coat: "#9b1b2b", trim: "#d9a936" },
  green: { coat: "#1f5a3a", trim: "#d9a936" },
  cream: { coat: "#efe2c7", trim: "#9b1b2b" },
  gold: { coat: "#c9962f", trim: "#1f5a3a" },
};
const SKIN = ["#f2c9a5", "#e0ac86", "#c68a62", "#8d5a3b", "#f6d6bd"];

/* ------------------------------------------------------------------ */
/*  3. MUSIC (Web Audio, no file needed)                               */
/*  Jingle Bells chorus: voices, flute, strings pad, bass, sleigh bells */
/* ------------------------------------------------------------------ */

const N = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const midi = (name, oct) => 12 * (oct + 1) + N[name];
const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);

// [note, startBeat, durationBeats]
const MELODY = (() => {
  const bar = (b, notes) => {
    let t = b * 4;
    return notes.map(([n, d]) => {
      const e = [n, t, d];
      t += d;
      return e;
    });
  };
  return [
    ...bar(0, [["E", 1], ["E", 1], ["E", 2]]),
    ...bar(1, [["E", 1], ["E", 1], ["E", 2]]),
    ...bar(2, [["E", 1], ["G", 1], ["C", 1.5], ["D", 0.5]]),
    ...bar(3, [["E", 4]]),
    ...bar(4, [["F", 1], ["F", 1], ["F", 1.5], ["F", 0.5]]),
    ...bar(5, [["F", 1], ["E", 1], ["E", 1], ["E", 0.5], ["E", 0.5]]),
    ...bar(6, [["E", 1], ["D", 1], ["D", 1], ["E", 1]]),
    ...bar(7, [["D", 2], ["G", 2]]),
    ...bar(8, [["E", 1], ["E", 1], ["E", 2]]),
    ...bar(9, [["E", 1], ["E", 1], ["E", 2]]),
    ...bar(10, [["E", 1], ["G", 1], ["C", 1.5], ["D", 0.5]]),
    ...bar(11, [["E", 4]]),
    ...bar(12, [["F", 1], ["F", 1], ["F", 1.5], ["F", 0.5]]),
    ...bar(13, [["F", 1], ["E", 1], ["E", 1], ["E", 0.5], ["E", 0.5]]),
    ...bar(14, [["G", 1], ["G", 1], ["F", 1], ["D", 1]]),
    ...bar(15, [["C", 4]]),
  ];
})();
// one chord per bar
const CHORDS = ["C", "C", "C", "C", "F", "C", "C", "G", "C", "C", "C", "C", "F", "C", "G", "C"];
const CHORD_NOTES = {
  C: [midi("C", 3), midi("E", 3), midi("G", 3), midi("C", 4)],
  F: [midi("F", 3), midi("A", 3), midi("C", 4), midi("F", 4)],
  G: [midi("G", 2), midi("B", 2), midi("D", 3), midi("G", 3)],
};
const BASS = { C: midi("C", 2), F: midi("F", 2), G: midi("G", 2) };
const LOOP_BEATS = 64;

function createCarolPlayer() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0.0001;
  master.gain.exponentialRampToValueAtTime(0.7, ctx.currentTime + 0.6);
  const comp = ctx.createDynamicsCompressor();
  master.connect(comp);
  comp.connect(ctx.destination);

  // soft "hall" reverb made of a decaying noise impulse
  const verb = ctx.createConvolver();
  const len = ctx.sampleRate * 2.2;
  const imp = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = imp.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
  }
  verb.buffer = imp;
  const verbGain = ctx.createGain();
  verbGain.gain.value = 0.35;
  verb.connect(verbGain);
  verbGain.connect(master);
  const dry = ctx.createGain();
  dry.connect(master);
  dry.connect(verb);

  const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

  const beat = 60 / BPM;
  const loopSec = LOOP_BEATS * beat;

  const tone = (t, f, dur, type, vol, opts = {}) => {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = f;
    if (opts.detune) osc.detune.value = opts.detune;
    const g = ctx.createGain();
    const a = opts.attack ?? 0.02;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + a);
    g.gain.setValueAtTime(vol, t + Math.max(a, dur - 0.08));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + (opts.release ?? 0.12));
    let node = osc;
    if (opts.lp) {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = opts.lp;
      node.connect(lp);
      node = lp;
    }
    if (opts.formants) {
      opts.formants.forEach(([ff, q, gain]) => {
        const bp = ctx.createBiquadFilter();
        bp.type = "peaking";
        bp.frequency.value = ff;
        bp.Q.value = q;
        bp.gain.value = gain;
        node.connect(bp);
        node = bp;
      });
    }
    node.connect(g);
    g.connect(dry);
    if (opts.vibrato) {
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.frequency.value = 5.2;
      lg.gain.value = 7;
      lfo.connect(lg);
      lg.connect(osc.detune);
      lfo.start(t);
      lfo.stop(t + dur + 0.3);
    }
    osc.start(t);
    osc.stop(t + dur + 0.3);
  };

  const bell = (t, vol, hp = 5500) => {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = hp + Math.random() * 2500;
    f.Q.value = 6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    src.connect(f);
    f.connect(g);
    g.connect(dry);
    src.start(t, Math.random() * 0.5, 0.2);
  };

  const scheduleLoop = (t0) => {
    MELODY.forEach(([n, b, d]) => {
      const t = t0 + b * beat;
      const dur = d * beat * 0.92;
      const m = midi(n, 4);
      // choir "ah": detuned saws through vowel formants
      [-7, 7].forEach((dt) =>
        tone(t, freq(m), dur, "sawtooth", 0.05, { detune: dt, lp: 2200, vibrato: true, attack: 0.05, formants: [[750, 4, 8], [1150, 5, 6]] })
      );
      // flute an octave above
      tone(t, freq(m + 12), dur, "triangle", 0.035, { attack: 0.03, vibrato: true });
      // bell-like chime on the attack
      tone(t, freq(m + 24), 0.5, "sine", 0.018, { attack: 0.005, release: 0.4 });
    });
    for (let bar = 0; bar < 16; bar++) {
      const chord = CHORDS[bar];
      const t = t0 + bar * 4 * beat;
      CHORD_NOTES[chord].forEach((m) => tone(t, freq(m), 4 * beat * 0.96, "sawtooth", 0.014, { lp: 900, attack: 0.25, release: 0.3 }));
      [0, 2].forEach((k) => tone(t + k * beat, freq(BASS[chord]), beat * 0.7, "triangle", 0.1, { attack: 0.01, release: 0.1, lp: 500 }));
    }
    for (let e = 0; e < LOOP_BEATS * 2; e++) bell(t0 + e * beat * 0.5, e % 2 === 0 ? (e % 8 === 0 ? 0.16 : 0.1) : 0.06);
  };

  let t0 = ctx.currentTime + 0.2;
  scheduleLoop(t0);
  let timer = setInterval(() => {
    if (t0 + loopSec - ctx.currentTime < 3) {
      t0 += loopSec;
      scheduleLoop(t0);
    }
  }, 500);

  return {
    stop() {
      clearInterval(timer);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.12);
      setTimeout(() => ctx.close && ctx.close(), 700);
    },
  };
}

/* ------------------------------------------------------------------ */
/*  4. SNOW (3 depth layers, drifting with a slow wind)                */
/* ------------------------------------------------------------------ */

function useSnow(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(canvas);

    const sprite = (soft) => {
      const n = 32;
      const s = document.createElement("canvas");
      s.width = n;
      s.height = n;
      const c = s.getContext("2d");
      const g = c.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(soft ? 0.2 : 0.5, `rgba(255,255,255,${soft ? 0.65 : 1})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, n, n);
      return s;
    };
    const sharp = sprite(false);
    const soft = sprite(true);

    const r = rng(314);
    // depth: 0 = far (tiny, slow, dim) … 1 = near (big, blurry, fast)
    const flakes = Array.from({ length: reduce ? 70 : 230 }, () => {
      const depth = Math.pow(r(), 1.6);
      return {
        x: r(), y: r(), depth,
        size: 0.8 + depth * 5.5,
        a: 0.35 + (1 - depth) * 0.4 + (depth > 0.85 ? -0.15 : 0.1),
        vy: 0.14 + depth * 0.9, ph: r() * 6.28, fr: 0.4 + r() * 1.1, am: 0.1 + r() * 0.35,
        soft: depth > 0.72,
      };
    });

    const tick = (now) => {
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      const t = now / 1000;
      const wind = Math.sin(t * 0.17) * 0.35 + 0.15;
      ctx.clearRect(0, 0, W, H);
      for (const f of flakes) {
        f.x += ((Math.sin(t * f.fr + f.ph) * f.am + wind * (0.3 + f.depth)) * dt) / W;
        f.y += (f.vy * dt) / H;
        if (f.y > 1.04) {
          f.y = -0.04;
          f.x = Math.random();
        }
        if (f.x > 1.05) f.x = -0.05;
        if (f.x < -0.05) f.x = 1.05;
        const s = f.size * (f.soft ? 1.4 : 1.2);
        ctx.globalAlpha = Math.max(0.1, f.a);
        ctx.drawImage(f.soft ? soft : sharp, f.x * W - s, f.y * H - s, s * 2, s * 2);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
    };
  }, [canvasRef]);
}

/* ------------------------------------------------------------------ */
/*  5. STYLES                                                          */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&display=swap');

.ch-stage{container-type:size;position:relative;display:flex;flex-direction:column;overflow:hidden;color:#fef3c7;user-select:none;
  font-family:'Cormorant Garamond',Georgia,serif;background:linear-gradient(180deg,#070f26 0%,#10234c 55%,#24457d 100%)}
.ch-snow{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:5}
.ch-head{position:relative;z-index:10;text-align:center;padding:1.6cqh 3cqw 0;pointer-events:none}
.ch-head h1{margin:0;font-style:italic;font-weight:700;line-height:1.05;font-size:clamp(20px,min(4cqw,6.2cqh),50px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 rgba(10,20,50,.6))}
.ch-scene{position:relative;flex:1;min-height:0;z-index:2;cursor:pointer}
.ch-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.ch-foot{position:relative;z-index:10;display:flex;align-items:center;justify-content:center;gap:clamp(10px,2cqw,28px);flex-wrap:wrap;padding:0 3cqw 2cqh}
.ch-hint{margin:0;font-family:'Caveat','Segoe Script',cursive;font-weight:700;font-size:clamp(16px,min(2.6cqw,3.8cqh),30px);color:#ffe9b0;text-shadow:0 2px 8px rgba(0,0,0,.5)}
.ch-btn{display:inline-flex;align-items:center;gap:.6em;padding:.5em 1.4em;border:0;border-radius:999px;cursor:pointer;
  font-family:'Cormorant Garamond',Georgia,serif;font-weight:700;font-size:clamp(16px,min(2.3cqw,3.4cqh),26px);color:#6b0f19;
  background:linear-gradient(180deg,#fff3bf,#e8b84a 55%,#c98a1e);
  box-shadow:0 5px 0 #8a5a12,0 10px 24px rgba(0,0,0,.45),0 0 26px rgba(255,214,120,.4);transition:transform .12s ease,box-shadow .12s ease}
.ch-btn:hover{transform:translateY(-2px)}
.ch-btn:active{transform:translateY(3px);box-shadow:0 2px 0 #8a5a12,0 6px 16px rgba(0,0,0,.45)}
.ch-btn:focus-visible{outline:3px solid #fff;outline-offset:3px}
.ch-btn svg{width:1.2em;height:1.2em}

/* singers: everything is a multiple of one beat (0.5 s) */
.c-sway{animation:c-sway 4s ease-in-out infinite alternate}
@keyframes c-sway{0%{transform:rotate(-2.2deg)}100%{transform:rotate(2.2deg)}}
.c-head{animation:c-head 2s ease-in-out infinite alternate}
@keyframes c-head{0%{transform:rotate(-3.2deg)}100%{transform:rotate(3.2deg)}}
.c-mouth{transform-box:fill-box;transform-origin:center;animation:c-mouth .5s ease-in-out infinite alternate}
@keyframes c-mouth{0%{transform:scale(1,.28)}100%{transform:scale(.88,1.1)}}
.c-book{animation:c-book 1s ease-in-out infinite alternate}
@keyframes c-book{0%{transform:translateY(0)}100%{transform:translateY(-1.3px)}}
.c-breath{opacity:0;transform-box:fill-box;transform-origin:center;animation:c-breath 4s ease-out infinite}
@keyframes c-breath{0%{opacity:0;transform:translate(0,0) scale(.5)}20%{opacity:.55}100%{opacity:0;transform:translate(-9px,-18px) scale(2.4)}}

/* conductor: 4-beat pattern in 2 s */
.c-baton{animation:c-baton 2s ease-in-out infinite}
@keyframes c-baton{0%{transform:rotate(150deg)}25%{transform:rotate(-58deg)}50%{transform:rotate(62deg)}75%{transform:rotate(8deg)}100%{transform:rotate(150deg)}}
.c-lharm{animation:c-lharm 2s ease-in-out infinite}
@keyframes c-lharm{0%{transform:rotate(-150deg)}25%{transform:rotate(-30deg)}50%{transform:rotate(-12deg)}75%{transform:rotate(-34deg)}100%{transform:rotate(-150deg)}}
.c-tails{animation:c-tails 2s ease-in-out infinite alternate}
@keyframes c-tails{0%{transform:rotate(-1.5deg)}100%{transform:rotate(1.5deg)}}

/* instruments */
.c-bowarm{animation:c-bowarm 1s ease-in-out infinite alternate}
@keyframes c-bowarm{0%{transform:rotate(-7deg)}100%{transform:rotate(7deg)}}
.c-bowx{animation:c-bowx 2s ease-in-out infinite alternate}
@keyframes c-bowx{0%{transform:translateX(-11px)}100%{transform:translateX(11px)}}
.c-vib{animation:c-vib .25s ease-in-out infinite alternate}
@keyframes c-vib{0%{transform:translateY(-.8px)}100%{transform:translateY(.8px)}}
.c-finger{animation:c-finger .5s steps(1) infinite}
@keyframes c-finger{0%{opacity:1}50%{opacity:.1}}
.c-piston{animation:c-piston 1s ease-in-out infinite}
@keyframes c-piston{0%,60%,100%{transform:translateY(0)}20%,40%{transform:translateY(2.4px)}}
.c-cheek{transform-box:fill-box;transform-origin:center;animation:c-cheek .5s ease-in-out infinite alternate}
@keyframes c-cheek{0%{transform:scale(.8)}100%{transform:scale(1.2)}}
.c-hb1{transform-box:fill-box;transform-origin:50% 0;animation:c-hb 1s ease-in-out infinite alternate}
.c-hb2{transform-box:fill-box;transform-origin:50% 0;animation:c-hb 1s ease-in-out infinite alternate-reverse}
@keyframes c-hb{0%{transform:translateY(0) rotate(-12deg)}100%{transform:translateY(-8px) rotate(12deg)}}
.c-shake{transform-box:fill-box;transform-origin:50% 0;animation:c-shake .25s ease-in-out infinite alternate}
@keyframes c-shake{0%{transform:rotate(-14deg)}100%{transform:rotate(14deg)}}
.c-keys{animation:c-keys .25s ease-in-out infinite alternate}
@keyframes c-keys{0%{transform:translateY(-1.6px)}100%{transform:translateY(1.2px)}}
.c-keys2{animation:c-keys .5s ease-in-out infinite alternate-reverse}
.c-note{opacity:0;animation:c-note 4s ease-out infinite}
@keyframes c-note{0%{opacity:0;transform:translate(0,0) rotate(-6deg)}12%{opacity:1}100%{opacity:0;transform:translate(22px,-80px) rotate(10deg)}}

/* ambience */
.c-tw1{animation:c-tw 1.6s ease-in-out infinite}
.c-tw2{animation:c-tw 2.4s ease-in-out infinite}
.c-tw3{animation:c-tw 3.2s ease-in-out infinite}
@keyframes c-tw{0%,100%{opacity:1}50%{opacity:.3}}
.c-flick{animation:c-flick 2.4s steps(1) infinite}
@keyframes c-flick{0%{opacity:1}12%{opacity:.86}24%{opacity:.97}41%{opacity:.8}55%{opacity:.95}72%{opacity:.84}88%{opacity:1}}
.c-lit{animation:c-flick 4.4s steps(1) infinite}
.c-puff{opacity:0;transform-box:fill-box;transform-origin:center;animation:c-puff 4s ease-out infinite}
@keyframes c-puff{0%{opacity:.5;transform:translate(0,0) scale(.6)}100%{opacity:0;transform:translate(16px,-46px) scale(2.4)}}
.c-mist{animation:c-mist 16s ease-in-out infinite alternate}
.c-mist2{animation:c-mist 22s ease-in-out infinite alternate-reverse}
@keyframes c-mist{0%{transform:translateX(-60px)}100%{transform:translateX(60px)}}
.c-star{transform-box:fill-box;transform-origin:center;animation:c-star 3s ease-in-out infinite}
@keyframes c-star{0%,100%{transform:scale(1) rotate(0)}50%{transform:scale(.88) rotate(10deg)}}
.c-spark{animation:c-spark 1.4s cubic-bezier(.15,.7,.3,1) both}
@keyframes c-spark{0%{opacity:1;transform:translate(0,0) scale(.4)}70%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.2) rotate(var(--r))}}

@media (prefers-reduced-motion: reduce){
  .c-sway,.c-head,.c-mouth,.c-book,.c-breath,.c-baton,.c-lharm,.c-tails,.c-bowarm,.c-bowx,.c-vib,.c-finger,.c-piston,.c-cheek,
  .c-hb1,.c-hb2,.c-shake,.c-keys,.c-keys2,.c-note,.c-tw1,.c-tw2,.c-tw3,.c-flick,.c-lit,.c-puff,.c-mist,.c-mist2,.c-star{animation:none !important}
}
`;

/* ------------------------------------------------------------------ */
/*  6. SHARED SVG DEFINITIONS                                          */
/* ------------------------------------------------------------------ */

function tierPath(cx, top, bottom, hw, seed) {
  const r = rng(seed);
  const h = bottom - top;
  const n = Math.max(4, Math.round(hw / 8));
  const step = (2 * hw) / n;
  let d = `M${cx} ${top} C${cx + hw * 0.25} ${top + h * 0.25} ${cx + hw * 0.7} ${top + h * 0.6} ${cx + hw} ${bottom - 4}`;
  for (let i = 0; i < n; i++) {
    const x0 = cx + hw - i * step;
    const x1 = x0 - step;
    d += ` Q${((x0 + x1) / 2).toFixed(1)} ${(bottom + 6 + r() * 10).toFixed(1)} ${x1.toFixed(1)} ${(bottom - 4 + (r() - 0.5) * 5).toFixed(1)}`;
  }
  d += ` C${cx - hw * 0.7} ${top + h * 0.6} ${cx - hw * 0.25} ${top + h * 0.25} ${cx} ${top} Z`;
  return d;
}

const FIR = [[0, 46, 22], [30, 80, 36], [62, 120, 48], [96, 162, 58], [136, 206, 68]].map(
  ([t, b, hw], i) => ({ t, d: tierPath(0, t, b, hw, 11 + i * 7) })
);

function Defs() {
  const lin = (id, stops, x2 = 0, y2 = 1) => (
    <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
      {stops.map(([o, c], i) => (
        <stop key={i} offset={o} stopColor={c} />
      ))}
    </linearGradient>
  );
  return (
    <defs>
      <linearGradient id="cSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#060d22" />
        <stop offset=".45" stopColor="#0f224a" />
        <stop offset=".8" stopColor="#22437a" />
        <stop offset="1" stopColor="#3b629a" />
      </linearGradient>
      <linearGradient id="cSnow" gradientUnits="userSpaceOnUse" x1="0" y1="352" x2="0" y2="675">
        <stop offset="0" stopColor="#a9c0e4" />
        <stop offset=".35" stopColor="#d9e6fb" />
        <stop offset="1" stopColor="#8ba6d2" />
      </linearGradient>
      {lin("cFir", [[0, "#1f6140"], [1, "#07261a"]], 1, 1)}
      {lin("cFirSnow", [[0, "#ffffff"], [0.55, "#d6e4f8"], [1, "#93acd8"]], 1, 1)}
      {lin("cRoofSnow", [[0, "#ffffff"], [0.6, "#e2ecfb"], [1, "#a9bfe3"]])}
      {lin("cPlaster", [[0, "#e6d2b0"], [1, "#a98e6a"]])}
      {lin("cLog", [[0, "#93402a"], [1, "#3a1109"]])}
      {lin("cSlate", [[0, "#4a4a6e"], [1, "#1d1d38"]])}
      {lin("cTile", [[0, "#a8402e"], [1, "#5a1a14"]])}
      {lin("cWood", [[0, "#a8582a"], [1, "#5a2410"]])}
      {lin("cGold", [[0, "#fff3bf"], [0.5, "#e8b84a"], [1, "#a8721f"]], 1, 1)}
      {lin("cViolin", [[0, "#c8682e"], [1, "#6a2a10"]], 1, 1)}
      {lin("cBrass", [[0, "#fff0a0"], [0.5, "#e8b030"], [1, "#9a6a14"]], 1, 1)}
      {lin("cPiano", [[0, "#7a2a1a"], [1, "#2e0e08"]])}
      <radialGradient id="cWin" cx="50%" cy="55%" r="60%">
        <stop offset="0" stopColor="#fff6b0" />
        <stop offset=".45" stopColor="#ffb02e" />
        <stop offset="1" stopColor="#e0481a" />
      </radialGradient>
      <radialGradient id="cGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#ffc24a" stopOpacity=".95" />
        <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cPool" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#ffd27a" stopOpacity=".55" />
        <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cMoon" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#fff8d8" stopOpacity=".9" />
        <stop offset=".35" stopColor="#bcd0ff" stopOpacity=".28" />
        <stop offset="1" stopColor="#bcd0ff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cMist" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#dbe8ff" stopOpacity=".42" />
        <stop offset="1" stopColor="#dbe8ff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cVig" cx="50%" cy="50%" r="75%">
        <stop offset=".55" stopColor="#020611" stopOpacity="0" />
        <stop offset="1" stopColor="#020611" stopOpacity=".55" />
      </radialGradient>
      <mask id="cMoonMask">
        <rect x="100" y="30" width="140" height="140" fill="#fff" />
        <circle cx="186" cy="88" r="31" fill="#000" />
      </mask>
      <filter id="cFlock" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="3" result="n1" />
        <feDisplacementMap in="SourceGraphic" in2="n1" scale="8" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="8" result="n2" />
        <feColorMatrix in="n2" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 11 -5.9" result="speck" />
        <feComposite in="speck" in2="d" operator="in" result="speckIn" />
        <feMerge>
          <feMergeNode in="d" />
          <feMergeNode in="speckIn" />
        </feMerge>
      </filter>
      <filter id="cBlur3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
      <filter id="cBlur8" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="8" /></filter>
    </defs>
  );
}

/* ------------------------------------------------------------------ */
/*  7. ENVIRONMENT                                                     */
/* ------------------------------------------------------------------ */

const STARS = (() => {
  const r = rng(8);
  return Array.from({ length: 70 }, (_, i) => ({ x: -200 + r() * 1600, y: -120 + r() * 400, s: 0.8 + r() * 1.8, c: i % 3 }));
})();

const FOREST = (() => {
  const r = rng(12);
  const out = [];
  for (let x = -300; x < 1500; x += 16 + r() * 12) out.push({ x, h: 26 + r() * 38, w: 12 + r() * 10 });
  return out;
})();

function Sky() {
  return (
    <g>
      <rect x="-1500" y="-1200" width="4200" height="1900" fill="url(#cSky)" />
      {STARS.map((s, i) => (
        <circle key={i} className={`c-tw${(s.c % 3) + 1}`} cx={s.x} cy={s.y} r={s.s} fill="#fff" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />
      ))}
      <circle cx="176" cy="96" r="120" fill="url(#cMoon)" />
      <circle cx="176" cy="96" r="34" fill="#fdf6d8" mask="url(#cMoonMask)" />
      {/* distant snowy hills + forest */}
      <path d="M-1500 360 C-1000 300 -700 330 -300 330 C0 300 200 320 420 338 C640 316 900 300 1200 330 C1500 296 2000 320 2700 360 V420 H-1500Z" fill="#17305e" />
      <path d="M-1500 372 C-900 336 -500 352 -100 350 C200 336 520 358 800 346 C1100 332 1500 356 2700 372 V420 H-1500Z" fill="#102650" />
      {FOREST.map((f, i) => (
        <g key={i} transform={`translate(${f.x} 372)`}>
          <path d={`M0 ${-f.h} L${f.w} 0 H${-f.w}Z`} fill="#0a1d3c" />
          <path d={`M0 ${-f.h} L${f.w * 0.35} ${-f.h * 0.55} H${-f.w * 0.35}Z`} fill="#c9daf5" opacity=".55" />
        </g>
      ))}
    </g>
  );
}

function Ground() {
  const r = rng(77);
  const prints = Array.from({ length: 26 }, () => ({ x: 120 + r() * 960, y: 400 + r() * 250, a: r() * 20 - 10 }));
  return (
    <g>
      <rect x="-1500" y="352" width="4200" height="1500" fill="url(#cSnow)" />
      <path d="M-1500 352 C-800 340 -300 360 200 352 C600 344 900 360 1300 350 C1800 340 2400 356 2700 352 V362 H-1500Z" fill="#c8d9f3" opacity=".7" />
      {prints.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.a})`} opacity=".22">
          <ellipse cx="-4" cy="0" rx="3.2" ry="5" fill="#5d79ab" />
          <ellipse cx="5" cy="-3" rx="3.2" ry="5" fill="#5d79ab" />
        </g>
      ))}
      <ellipse cx="600" cy="520" rx="470" ry="130" fill="url(#cPool)" className="c-flick" />
    </g>
  );
}

function Mist({ y, o = 1, cls = "c-mist" }) {
  return (
    <g className={cls} opacity={o}>
      <ellipse cx="260" cy={y} rx="360" ry="26" fill="url(#cMist)" />
      <ellipse cx="760" cy={y + 6} rx="420" ry="30" fill="url(#cMist)" />
      <ellipse cx="1100" cy={y - 4} rx="320" ry="22" fill="url(#cMist)" />
    </g>
  );
}

function Smoke({ x, y }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <circle key={i} className="c-puff" cx={x} cy={y} r={4 + i} fill="#dbe8ff" style={{ animationDelay: `${i * 1.3}s` }} />
      ))}
    </g>
  );
}

function Win({ x, y, w, h, d = 0 }) {
  return (
    <g className="c-lit" style={{ animationDelay: `${d}s` }}>
      <ellipse cx={x + w / 2} cy={y + h / 2} rx={w * 1.3} ry={h * 1.05} fill="url(#cGlow)" opacity=".8" />
      <rect x={x - 1.6} y={y - 1.6} width={w + 3.2} height={h + 3.2} fill="#2b150c" />
      <rect x={x} y={y} width={w} height={h} fill="url(#cWin)" />
      <path d={`M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}`} stroke="#2b150c" strokeWidth="1.4" opacity=".85" />
      <rect x={x - 3} y={y + h + 1.6} width={w + 6} height="3" fill="#fff" opacity=".9" />
    </g>
  );
}

function House({ x, y, w = 100, floors = 2, wall = "timber", roof = "cSlate", seed = 1, lantern = false }) {
  const fh = 46;
  const h = floors * fh;
  const roofH = w * 0.55;
  const cols = w >= 100 ? 3 : 2;
  const beam = "#3a160c";
  const r = rng(seed);
  const wins = [];
  for (let f = 0; f < floors; f++) {
    for (let i = 0; i < cols; i++) {
      const cx = cols === 3 ? (i - 1) * (w / 3) : (i === 0 ? -1 : 1) * (w / 4);
      if (f === 0 && cx === 0) continue;
      wins.push({ cx, y: -(f + 1) * fh + 12, d: r() * 3 });
    }
  }
  const eave = Array.from({ length: 6 }, (_, i) => {
    const t = (i + 0.5) / 6;
    return { x: -w / 2 - 8 + t * (w / 2 + 8), y: -h + 4 - t * roofH };
  });
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="2" rx={w * 0.7} ry="7" fill="#fff" opacity=".7" />
      <rect x={-w / 2} y={-h} width={w} height={h} fill={wall === "log" ? "url(#cLog)" : "url(#cPlaster)"} />
      {wall === "log"
        ? Array.from({ length: Math.floor(h / 7) }, (_, i) => (
            <path key={i} d={`M${-w / 2} ${-h + 7 * (i + 1)}H${w / 2}`} stroke="#220a05" strokeWidth="1.2" opacity=".6" />
          ))
        : (
          <g stroke={beam} strokeWidth="4" strokeLinecap="square" fill="none">
            <path d={`M${-w / 2} ${-h}V0M${w / 2} ${-h}V0M0 ${-h}V0`} />
            {Array.from({ length: floors + 1 }, (_, i) => (
              <path key={i} d={`M${-w / 2 - 3} ${-i * fh}H${w / 2 + 3}`} strokeWidth={i === 0 ? 3 : 4.5} />
            ))}
            <path d={`M${-w / 2} ${-fh}L${-w / 4} ${-h + 4}M${w / 2} ${-fh}L${w / 4} ${-h + 4}`} strokeWidth="3" />
          </g>
        )}
      {wins.map((wn, i) => (
        <Win key={i} x={wn.cx - 8} y={wn.y} w={16} h={21} d={wn.d} />
      ))}
      <path d="M-8 0 V-20 Q0 -32 8 -20 V0Z" fill="#2b150c" />
      <path d="M-5.5 0 V-19 Q0 -28 5.5 -19 V0Z" fill="url(#cWin)" className="c-lit" />
      {lantern && (
        <g transform={`translate(${w / 2 - 12} -26)`}>
          <circle r="16" fill="url(#cGlow)" className="c-flick" />
          <rect x="-3" y="-5" width="6" height="9" rx="1.4" fill="url(#cWin)" stroke="#1c1218" strokeWidth="1" />
        </g>
      )}
      <rect x={w / 2 - 26} y={-h - roofH * 0.7} width="12" height={roofH * 0.7 + 4} fill="#7a2418" />
      <path d={`M${w / 2 - 28} ${-h - roofH * 0.7} Q${w / 2 - 20} ${-h - roofH * 0.7 - 8} ${w / 2 - 12} ${-h - roofH * 0.7}Z`} fill="#fff" />
      <Smoke x={w / 2 - 20} y={-h - roofH * 0.7 - 6} />
      <path d={`M${-w / 2 - 10} ${-h} H${w / 2 + 10} L0 ${-h - roofH}Z`} fill={`url(#${roof})`} />
      <path
        d={`M${-w / 2 - 3} ${-h - 3} L0 ${-h - roofH + 4} L${w / 2 + 3} ${-h - 3} Q${w / 2 - 8} ${-h + 5} ${w / 2 - 18} ${-h - 3} Q${w / 4} ${-h + 6} ${w / 8} ${-h - 3} Q0 ${-h + 6} ${-w / 8} ${-h - 3} Q${-w / 4} ${-h + 6} ${-w / 2 + 18} ${-h - 3} Q${-w / 2 + 8} ${-h + 5} ${-w / 2 - 3} ${-h - 3}Z`}
        fill="url(#cRoofSnow)"
      />
      {eave.map((b, i) => (
        <circle key={i} className={`c-tw${(i % 3) + 1}`} cx={b.x} cy={b.y + 8} r="2.4" fill={["#ffd45a", "#fff0a8", "#ff9a4a"][i % 3]} style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
    </g>
  );
}

function Garland({ x1, y1, x2, y2, sag = 14, n = 9, seed = 1 }) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 + sag * 2;
  const pts = Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    return { x: (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2, y: (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2 };
  });
  return (
    <g>
      <path d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} fill="none" stroke="#10261c" strokeWidth="2" />
      {pts.map((p, i) => {
        const c = ["#ffd45a", "#fff0a8", "#ff9a4a", "#ff6b6b"][(i + seed) % 4];
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y + 4} r="7" fill={c} opacity=".22" />
            <circle className={`c-tw${((i + seed) % 3) + 1}`} cx={p.x} cy={p.y + 4} r="3.3" fill={c} style={{ animationDelay: `${(i % 5) * 0.3}s`, filter: `drop-shadow(0 0 4px ${c})` }} />
          </g>
        );
      })}
    </g>
  );
}

function Lamp({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="3" rx="22" ry="5" fill="#ffc24a" opacity=".28" className="c-flick" />
      <ellipse cx="0" cy="-92" rx="46" ry="46" fill="url(#cGlow)" className="c-flick" />
      <rect x="-2.4" y="-92" width="4.8" height="92" fill="#15101a" />
      <path d="M-7 0 H7 L4 -10 H-4Z" fill="#15101a" />
      <path d="M-11 -112 H11 L8 -92 H-8Z" fill="url(#cWin)" stroke="#15101a" strokeWidth="2" className="c-flick" />
      <path d="M-14 -112 L0 -124 L14 -112Z" fill="#15101a" />
      <path d="M-13 -113 L0 -122 L13 -113Q0 -116 -13 -113Z" fill="#fff" />
      <path d="M-6 -80 Q0 -70 6 -80 Q0 -76 -6 -80Z" fill="#1f7a4d" />
      <circle cx="-3" cy="-76" r="2" fill="#d4222f" />
      <circle cx="3" cy="-76" r="2" fill="#d4222f" />
    </g>
  );
}

// The big decorated tree behind the choir
const TREE_LIGHTS = (() => {
  const r = rng(31);
  return Array.from({ length: 90 }, (_, i) => {
    const y = 16 + r() * 186;
    const hw = 8 + y * 0.31;
    return { x: (r() * 2 - 1) * hw * 0.92, y, c: ["#ffd45a", "#fff0a8", "#ffb347", "#ffffff", "#ff6b4a"][i % 5], d: r() * 3, k: (i % 3) + 1 };
  });
})();
const TREE_BAUBLES = (() => {
  const r = rng(52);
  return Array.from({ length: 22 }, (_, i) => {
    const y = 36 + r() * 160;
    const hw = 8 + y * 0.28;
    return { x: (r() * 2 - 1) * hw * 0.85, y, r: 3.4 + r() * 2.2, c: ["#c8202e", "#e8b84a", "#e8edf5", "#c8202e", "#2a6fd1"][i % 5] };
  });
})();

function BigTree({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(0 -206)`}>
      <ellipse cx="0" cy="206" rx="86" ry="14" fill="#fff" opacity=".9" />
      <ellipse cx="0" cy="206" rx="110" ry="26" fill="url(#cPool)" />
      <g filter="url(#cFlock)">
        {[...FIR].reverse().map((t) => (
          <g key={t.t}>
            <path d={t.d} fill="url(#cFir)" />
            <path d={t.d} fill="url(#cFirSnow)" transform={`translate(0 ${t.t}) scale(.86 .66) translate(0 ${-t.t})`} opacity=".92" />
          </g>
        ))}
      </g>
      {[[62, 28], [112, 40], [158, 52]].map(([gy, gh], i) => (
        <path key={i} d={`M${-gh - 18} ${gy} Q0 ${gy + 22} ${gh + 18} ${gy}`} fill="none" stroke="#e8b84a" strokeWidth="2.6" strokeDasharray="1 5" strokeLinecap="round" opacity=".9" />
      ))}
      {TREE_BAUBLES.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r={b.r} fill={b.c} stroke="#00000033" strokeWidth=".6" />
          <circle cx={b.x - b.r * 0.3} cy={b.y - b.r * 0.35} r={b.r * 0.28} fill="#fff" opacity=".75" />
        </g>
      ))}
      {TREE_LIGHTS.map((l, i) => (
        <g key={i}>
          <circle cx={l.x} cy={l.y} r="5.5" fill={l.c} opacity=".22" />
          <circle className={`c-tw${l.k}`} cx={l.x} cy={l.y} r="2.3" fill={l.c} style={{ animationDelay: `${l.d}s` }} />
        </g>
      ))}
      {/* star */}
      <g transform="translate(0 -6)">
        <circle r="30" fill="url(#cGlow)" className="c-flick" />
        <path className="c-star" d="M0 -17 L4.2 -5 L17 -5 L6.8 3 L10.4 15 L0 8 L-10.4 15 L-6.8 3 L-17 -5 L-4.2 -5Z" fill="url(#cGold)" stroke="#fff3bf" strokeWidth="1" />
      </g>
    </g>
  );
}

function SmallFir({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(0 -206)`}>
      <ellipse cx="0" cy="206" rx="60" ry="10" fill="#fff" opacity=".85" />
      <g filter="url(#cFlock)">
        {[...FIR].reverse().map((t) => (
          <g key={t.t}>
            <path d={t.d} fill="url(#cFir)" />
            <path d={t.d} fill="url(#cFirSnow)" transform={`translate(0 ${t.t}) scale(.92 .74) translate(0 ${-t.t})`} />
          </g>
        ))}
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  8. PEOPLE                                                          */
/* ------------------------------------------------------------------ */

function Hat({ hat, hatColor, hr, trim }) {
  if (hat === "beanie")
    return (
      <g>
        <path d={`M${-hr - 0.8} -1.5 Q${-hr - 1} ${-hr - 9} 0 ${-hr - 10} Q${hr + 1} ${-hr - 9} ${hr + 0.8} -1.5Z`} fill={hatColor} />
        <rect x={-hr - 1} y={-hr * 0.55} width={2 * hr + 2} height="4.2" rx="2" fill={trim || "#fff"} />
        <circle cx="0" cy={-hr - 11} r="3.4" fill="#fff" />
      </g>
    );
  if (hat === "fur")
    return (
      <g>
        <ellipse cx="0" cy={-hr + 1} rx={hr + 3.4} ry="6.6" fill="#efe2c7" />
        <ellipse cx="0" cy={-hr - 3} rx={hr + 1.2} ry="4.8" fill="#e3d3ae" />
        {[-6, -2, 3, 7].map((fx) => (
          <circle key={fx} cx={fx} cy={-hr + 1.5} r="1.2" fill="#c9b78e" />
        ))}
      </g>
    );
  if (hat === "bonnet")
    return (
      <g>
        <path d={`M${-hr - 2} 3 Q${-hr - 3} ${-hr - 9} 0 ${-hr - 9} Q${hr + 3} ${-hr - 9} ${hr + 2} 3 Q${hr} -3 0 -3 Q${-hr} -3 ${-hr - 2} 3Z`} fill={hatColor} />
        <path d={`M${-hr - 1} -2 Q0 ${-hr * 0.45} ${hr + 1} -2`} fill="none" stroke="#9b1b2b" strokeWidth="2.4" />
        <circle cx={hr + 1} cy="-1" r="2.4" fill="#9b1b2b" />
      </g>
    );
  if (hat === "top")
    return (
      <g>
        <rect x={-hr * 0.72} y={-hr - 15} width={hr * 1.44} height="15" rx="1.4" fill="#1d1512" />
        <ellipse cx="0" cy={-hr + 0.6} rx={hr + 3.2} ry="2.8" fill="#1d1512" />
        <rect x={-hr * 0.72} y={-hr - 4.5} width={hr * 1.44} height="3.2" fill="#d9a936" />
      </g>
    );
  return null;
}

function Head({ hr = 9.5, skin, hair, hs = "short", hat, hatColor, trim, glasses, mouth = "sing", mouthDur = 0.5, mouthDelay = 0 }) {
  return (
    <g>
      {hs === "long" && (
        <g fill={hair}>
          <path d={`M${-hr - 1} -2 Q${-hr - 5} ${hr + 4} ${-hr + 0.5} ${hr + 13} L${-hr + 5.5} ${hr + 13} Q${-hr + 3} ${hr + 3} ${-hr + 3} 0Z`} />
          <path d={`M${hr + 1} -2 Q${hr + 5} ${hr + 4} ${hr - 0.5} ${hr + 13} L${hr - 5.5} ${hr + 13} Q${hr - 3} ${hr + 3} ${hr - 3} 0Z`} />
        </g>
      )}
      {hs === "bun" && <circle cx="0" cy={-hr - 3} r={hr * 0.45} fill={hair} />}
      <circle r={hr} fill={skin} />
      <ellipse cx={-hr + 0.4} cy="1" rx="1.8" ry="2.6" fill={skin} />
      <ellipse cx={hr - 0.4} cy="1" rx="1.8" ry="2.6" fill={skin} />
      {hs !== "bald" && (
        <path d={`M${-hr - 0.4} 0 Q${-hr - 1} ${-hr - 3} 0 ${-hr - 3} Q${hr + 1} ${-hr - 3} ${hr + 0.4} 0 Q${hr - 1} ${-hr + 3.4} 0 ${-hr + 3.2} Q${-hr + 1} ${-hr + 3.4} ${-hr - 0.4} 0Z`} fill={hair} />
      )}
      <g stroke="#3a2418" strokeWidth="1.1" fill="none" strokeLinecap="round">
        <path d="M-5.2 -0.6 q2.2 -2.8 4.4 0M0.8 -0.6 q2.2 -2.8 4.4 0" />
        <path d="M-5.4 -4.2 q2.4 -1.6 4.8 -0.4M0.6 -4.6 q2.4 -1.2 4.8 0.4" strokeWidth=".8" opacity=".6" />
      </g>
      {glasses && (
        <g stroke="#3a2418" strokeWidth=".9" fill="none">
          <circle cx="-3" cy="-0.8" r="3.2" />
          <circle cx="3" cy="-0.8" r="3.2" />
          <path d="M0 -0.8h0" />
        </g>
      )}
      <circle cx="-6.2" cy="3.2" r="2.1" fill="#ff8a8a" opacity=".42" />
      <circle cx="6.2" cy="3.2" r="2.1" fill="#ff8a8a" opacity=".42" />
      {mouth === "sing" && (
        <g className="c-mouth" style={{ animationDuration: `${mouthDur}s`, animationDelay: `${mouthDelay}s` }}>
          <ellipse cx="0" cy="5.8" rx="2.9" ry="2.7" fill="#7a1022" />
          <ellipse cx="0" cy="6.8" rx="1.7" ry="1" fill="#e0626e" />
        </g>
      )}
      {mouth === "smile" && <path d="M-3.2 5 Q0 8 3.2 5" fill="none" stroke="#7a1022" strokeWidth="1.3" strokeLinecap="round" />}
      {mouth === "blow" && <circle cx="0" cy="5.6" r="1.6" fill="#7a1022" />}
      <Hat hat={hat} hatColor={hatColor} hr={hr} trim={trim} />
    </g>
  );
}

// Generic person: coat, scarf, animated head, everything swaying together.
function Person({ x, y, s = 1, pal = "red", scarf = "#efe2c7", hr = 9.5, hem = -14, legs, d = 0, breath = true, head, children }) {
  const P = PAL[pal];
  const headY = -62 - hr - 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="22" ry="5" fill="#27407a" opacity=".3" />
      {legs || (
        <g fill="#2a1a14">
          <ellipse cx="-7" cy="-2" rx="6.5" ry="3.6" />
          <ellipse cx="7" cy="-2" rx="6.5" ry="3.6" />
        </g>
      )}
      <g className="c-sway" style={{ transformOrigin: "0px -22px", animationDelay: `${-((d * 1.7) % 4)}s` }}>
        <path d={`M-13 -62 Q-16 -44 -19 ${hem} H19 Q16 -44 13 -62 Q0 -67 -13 -62Z`} fill={P.coat} />
        <rect x="-19" y={hem - 3.2} width="38" height="3.4" fill={P.trim} />
        <path d={`M0 -60 V${hem - 3}`} stroke={P.trim} strokeWidth="1.2" opacity=".7" />
        <path d="M-15 -42 Q0 -38 15 -42" fill="none" stroke={P.trim} strokeWidth="3" />
        {[-54, -46, -34].map((by) => (
          <circle key={by} cx="0" cy={by} r="1.3" fill={P.trim} />
        ))}
        <path d="M-12 -60 Q-6 -66 0 -64" fill="none" stroke="#fff" strokeWidth="2" opacity=".18" />
        <rect x="-3" y="-67" width="6" height="7" fill={head.skin} />
        {children}
        <path d="M-10 -63 Q0 -56 10 -63 L11 -58 Q0 -51 -11 -58Z" fill={scarf} />
        <path d="M5 -58 L9 -42 L2 -44Z" fill={scarf} />
        <g transform={`translate(0 ${headY})`}>
          <g className="c-head" style={{ transformOrigin: `0px ${hr}px`, animationDelay: `${-((d * 1.3) % 2)}s` }}>
            <Head hr={hr} trim={P.trim} {...head} mouthDelay={-d} />
            {breath && head.mouth !== "blow" && (
              <g className="c-breath" style={{ animationDelay: `${(d * 1.9) % 4}s` }}>
                <circle cx="-3" cy="6" r="2.6" fill="#e8f0ff" />
                <circle cx="-7" cy="3" r="1.8" fill="#e8f0ff" />
              </g>
            )}
          </g>
        </g>
      </g>
    </g>
  );
}

function Songbook({ pal }) {
  const P = PAL[pal];
  const staff = (x0, y0, x1, y1, n) =>
    Array.from({ length: n }, (_, i) => `M${x0} ${y0 + i * 2.5}L${x1} ${y1 + i * 2.5}`).join("");
  return (
    <g>
      <path d="M-13 -60 Q-21 -48 -11 -38" fill="none" stroke={P.coat} strokeWidth="7" strokeLinecap="round" />
      <path d="M13 -60 Q21 -48 11 -38" fill="none" stroke={P.coat} strokeWidth="7" strokeLinecap="round" />
      <g className="c-book">
        <path d="M-14 -51 L0 -48 L14 -51 L14 -36 L0 -33 L-14 -36Z" fill="#7a1022" opacity=".9" transform="translate(0 1.5)" />
        <path d="M-13 -51 L0 -48 L0 -35 L-13 -38Z" fill="#fffaf0" stroke="#c9b79a" strokeWidth=".6" />
        <path d="M13 -51 L0 -48 L0 -35 L13 -38Z" fill="#fffaf0" stroke="#c9b79a" strokeWidth=".6" />
        <path d={staff(-11, -47.5, -2, -45.2, 3)} stroke="#8a7a6a" strokeWidth=".5" />
        <path d={staff(11, -47.5, 2, -45.2, 3)} stroke="#8a7a6a" strokeWidth=".5" />
        {[[-9, -45.4], [-6, -44.2], [-3.5, -43.4], [9, -45.4], [6, -44.2], [3.5, -43.4]].map(([nx, ny], i) => (
          <ellipse key={i} cx={nx} cy={ny} rx="1" ry=".75" fill="#2a1a14" />
        ))}
        <path d="M0 -48 V-34" stroke="#b9a584" strokeWidth=".8" />
      </g>
      <circle cx="-11" cy="-38" r="3" fill={P.trim} />
      <circle cx="11" cy="-38" r="3" fill={P.trim} />
      <circle cx="-10.5" cy="-38.5" r="2.4" fill="#f2c9a5" />
      <circle cx="10.5" cy="-38.5" r="2.4" fill="#f2c9a5" />
    </g>
  );
}

function Singer({ x, y, s = 1, pal, scarf, hat, hatColor, hair, hs, skin, kid, glasses, d = 0, dur = 0.5 }) {
  return (
    <Person
      x={x} y={y} s={kid ? s * 0.74 : s} pal={pal} scarf={scarf} hr={kid ? 11.4 : 9.5} d={d}
      head={{ skin, hair, hs, hat, hatColor, glasses, mouth: "sing", mouthDur: dur }}
    >
      <Songbook pal={pal} />
    </Person>
  );
}

// Singers: 4 + 5 + 4 adults + 2 children
const SINGERS = [
  // back row
  { x: 522, y: 436, s: 0.8, pal: "green", scarf: "#efe2c7", hat: "bonnet", hatColor: "#efe2c7", hair: "#5a3a22", hs: "long", skin: SKIN[0], d: 0 },
  { x: 574, y: 436, s: 0.8, pal: "red", scarf: "#d9a936", hat: "top", hatColor: "#1d1512", hair: "#cfcfd6", hs: "short", skin: SKIN[1], glasses: true, d: 0.4 },
  { x: 626, y: 436, s: 0.8, pal: "cream", scarf: "#9b1b2b", hat: "beanie", hatColor: "#9b1b2b", hair: "#d9b36a", hs: "long", skin: SKIN[4], d: 0.9 },
  { x: 678, y: 436, s: 0.8, pal: "gold", scarf: "#1f5a3a", hat: "fur", hatColor: "#efe2c7", hair: "#8a3a1c", hs: "short", skin: SKIN[2], d: 1.3, dur: 0.25 },
  // middle row
  { x: 496, y: 478, s: 0.9, pal: "red", scarf: "#efe2c7", hat: "beanie", hatColor: "#efe2c7", hair: "#1d1512", hs: "long", skin: SKIN[3], d: 0.2 },
  { x: 548, y: 478, s: 0.9, pal: "green", scarf: "#d9a936", hat: "fur", hatColor: "#efe2c7", hair: "#cfcfd6", hs: "short", skin: SKIN[0], d: 0.7, glasses: true },
  { x: 600, y: 478, s: 0.9, pal: "cream", scarf: "#1f5a3a", hat: "bonnet", hatColor: "#9b1b2b", hair: "#5a3a22", hs: "bun", skin: SKIN[1], d: 1.1 },
  { x: 652, y: 478, s: 0.9, pal: "gold", scarf: "#9b1b2b", hat: "top", hatColor: "#1d1512", hair: "#1d1512", hs: "short", skin: SKIN[4], d: 1.6, dur: 0.25 },
  { x: 704, y: 478, s: 0.9, pal: "red", scarf: "#d9a936", hat: "beanie", hatColor: "#1f5a3a", hair: "#8a3a1c", hs: "long", skin: SKIN[2], d: 0.5 },
  // front row
  { x: 478, y: 522, s: 1, pal: "green", scarf: "#efe2c7", hat: "bonnet", hatColor: "#efe2c7", hair: "#cfcfd6", hs: "bun", skin: SKIN[0], d: 0.3 },
  { x: 548, y: 522, s: 1, pal: "cream", scarf: "#9b1b2b", hat: "fur", hatColor: "#efe2c7", hair: "#5a3a22", hs: "short", skin: SKIN[3], d: 0.8, dur: 0.25 },
  { x: 652, y: 522, s: 1, pal: "red", scarf: "#efe2c7", hat: "top", hatColor: "#1d1512", hair: "#cfcfd6", hs: "short", skin: SKIN[1], d: 1.2, glasses: true },
  { x: 722, y: 522, s: 1, pal: "gold", scarf: "#1f5a3a", hat: "beanie", hatColor: "#9b1b2b", hair: "#d9b36a", hs: "long", skin: SKIN[4], d: 1.7 },
  // children
  { x: 513, y: 534, s: 1, kid: true, pal: "red", scarf: "#efe2c7", hat: "beanie", hatColor: "#efe2c7", hair: "#8a3a1c", hs: "short", skin: SKIN[0], d: 0.6, dur: 0.25 },
  { x: 687, y: 534, s: 1, kid: true, pal: "green", scarf: "#d9a936", hat: "beanie", hatColor: "#9b1b2b", hair: "#1d1512", hs: "long", skin: SKIN[2], d: 1.4 },
];

// Conductor seen from behind
function Conductor({ x, y, s = 1.12 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="22" ry="5" fill="#27407a" opacity=".3" />
      <g fill="#15101a">
        <ellipse cx="-7" cy="-2" rx="6.5" ry="3.6" />
        <ellipse cx="7" cy="-2" rx="6.5" ry="3.6" />
      </g>
      <g className="c-sway" style={{ transformOrigin: "0px -22px" }}>
        <g className="c-tails" style={{ transformOrigin: "0px -40px" }}>
          <path d="M-14 -62 Q-18 -40 -20 -10 L-6 -26 L0 -8 L6 -26 L20 -10 Q18 -40 14 -62 Q0 -67 -14 -62Z" fill="#7a1022" />
          <path d="M0 -62 V-26" stroke="#d9a936" strokeWidth="1.2" opacity=".8" />
          <rect x="-14" y="-64" width="28" height="4" fill="#d9a936" />
        </g>
        <rect x="-3.4" y="-70" width="6.8" height="8" fill="#e0ac86" />
        {/* arms: pivot at the shoulders */}
        <g transform="translate(14 -60)">
          <g className="c-baton">
            <path d="M0 0 L0 -26" stroke="#7a1022" strokeWidth="6.4" strokeLinecap="round" />
            <circle cx="0" cy="-27" r="3" fill="#e0ac86" />
            <path d="M0 -27 L1 -48" stroke="#fff8ec" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </g>
        <g transform="translate(-14 -60)">
          <g className="c-lharm">
            <path d="M0 0 L0 -22" stroke="#7a1022" strokeWidth="6.4" strokeLinecap="round" />
            <circle cx="0" cy="-23" r="3" fill="#e0ac86" />
          </g>
        </g>
        <g transform="translate(0 -80)">
          <circle r="10" fill="#e0ac86" />
          <path d="M-10.6 1 Q-11 -11 0 -11.4 Q11 -11 10.6 1 Q8 -4 0 -4 Q-8 -4 -10.6 1Z" fill="#cfcfd6" />
          <path d="M-10 -1 Q0 6 10 -1 L9 5 Q0 11 -9 5Z" fill="#cfcfd6" />
          <ellipse cx="-10" cy="1" rx="2" ry="3" fill="#e0ac86" />
          <ellipse cx="10" cy="1" rx="2" ry="3" fill="#e0ac86" />
          <rect x="-7" y="-20" width="14" height="14" rx="1" fill="#15101a" />
          <ellipse cx="0" cy="-6" rx="13" ry="3" fill="#15101a" />
          <rect x="-7" y="-10" width="14" height="3" fill="#d9a936" />
        </g>
      </g>
    </g>
  );
}

/* ---- orchestra ---- */

function Violinist({ x, y, s = 1.04, pal, hair, skin, d, hat }) {
  return (
    <Person x={x} y={y} s={s} pal={pal} scarf="#efe2c7" d={d} breath={false} head={{ skin, hair, hs: "short", hat, hatColor: "#9b1b2b", mouth: "smile" }}>
      {/* violin under the chin */}
      <g transform="translate(5 -62) rotate(16)">
        <path d="M0 0 C0 -7 8 -8 10 -5 C11 -3 13 -3 14 -5 C16 -8 24 -7 24 0 C24 7 16 8 14 5 C13 3 11 3 10 5 C8 8 0 7 0 0Z" fill="url(#cViolin)" stroke="#3a1608" strokeWidth="1" />
        <rect x="24" y="-1.8" width="24" height="3.6" fill="#1c1210" />
        <circle cx="50" cy="0" r="3" fill="#6a2a10" />
        <path d="M5 -1H46M5 1H46" stroke="#e8d9b0" strokeWidth=".4" />
        <path d="M9 -3 q1.6 3 0 6M15 -3 q-1.6 3 0 6" fill="none" stroke="#2a1008" strokeWidth=".9" />
        <ellipse cx="11" cy="0" rx="3.2" ry="1.4" fill="#2a1008" />
      </g>
      {/* left arm holds the neck */}
      <path d="M13 -60 Q30 -66 46 -58" fill="none" stroke={PAL[pal].coat} strokeWidth="6.4" strokeLinecap="round" />
      <circle cx="47" cy="-58" r="2.6" fill="#f2c9a5" />
      {/* bow arm */}
      <path d="M-13 -60 Q-26 -54 -22 -46" fill="none" stroke={PAL[pal].coat} strokeWidth="6.4" strokeLinecap="round" />
      <g className="c-bowarm" style={{ transformOrigin: "-22px -46px", animationDelay: `${-d}s` }}>
        <path d="M-22 -46 L-32 -42" stroke={PAL[pal].coat} strokeWidth="6" strokeLinecap="round" />
        <circle cx="-33" cy="-41" r="2.6" fill="#f2c9a5" />
        <path d="M-36 -40 L30 -62" stroke="#6a3f1a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M-35 -38 L29 -59" stroke="#fff8ec" strokeWidth=".9" opacity=".9" />
      </g>
    </Person>
  );
}

function Cellist({ x, y, s = 1.04 }) {
  const coat = PAL.cream.coat;
  return (
    <Person
      x={x} y={y} s={s} pal="cream" scarf="#9b1b2b" hem={-30} d={0.6} breath={false}
      head={{ skin: SKIN[1], hair: "#5a3a22", hs: "long", mouth: "smile" }}
      legs={
        <g>
          <path d="M-14 -30 L-17 -10 L-9 -10 L-5 -28Z M14 -30 L17 -10 L9 -10 L5 -28Z" fill="#2a1f1c" />
          <ellipse cx="-14" cy="-3" rx="7" ry="3.8" fill="#15101a" />
          <ellipse cx="14" cy="-3" rx="7" ry="3.8" fill="#15101a" />
        </g>
      }
    >
      {/* cello between the knees */}
      <g transform="translate(2 -4)">
        <path d="M0 -8 C-12 -8 -16 -22 -9 -30 C-6 -33 -7 -37 -11 -41 C-16 -48 -6 -54 0 -54 C6 -54 16 -48 11 -41 C7 -37 6 -33 9 -30 C16 -22 12 -8 0 -8Z" fill="url(#cViolin)" stroke="#3a1608" strokeWidth="1.2" />
        <rect x="-2.2" y="-86" width="4.4" height="36" fill="#1c1210" />
        <path d="M-2.2 -86 q-4 -6 1 -9 q5 -1 4 6" fill="#6a2a10" />
        <path d="M-8 -34 q2 4 0 8M8 -34 q-2 4 0 8" fill="none" stroke="#2a1008" strokeWidth="1.1" />
        <path d="M-1 -80V-14M1 -80V-14" stroke="#e8d9b0" strokeWidth=".5" />
        <path d="M0 -8V4" stroke="#aaa" strokeWidth="1.4" />
      </g>
      {/* left hand on the neck (vibrato) */}
      <path d="M13 -60 Q22 -66 6 -70" fill="none" stroke={coat} strokeWidth="6.4" strokeLinecap="round" />
      <g className="c-vib"><circle cx="5" cy="-70" r="2.6" fill="#f2c9a5" /></g>
      {/* bow arm */}
      <path d="M-13 -60 Q-26 -52 -20 -44" fill="none" stroke={coat} strokeWidth="6.4" strokeLinecap="round" />
      <g className="c-bowx">
        <path d="M-20 -44 L-14 -38" stroke={coat} strokeWidth="6" strokeLinecap="round" />
        <circle cx="-13" cy="-37" r="2.6" fill="#f2c9a5" />
        <path d="M-30 -36 L26 -39" stroke="#6a3f1a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M-29 -34 L25 -37" stroke="#fff8ec" strokeWidth=".9" />
      </g>
    </Person>
  );
}

function Flutist({ x, y, s = 1.04 }) {
  const coat = PAL.gold.coat;
  return (
    <Person x={x} y={y} s={s} pal="gold" scarf="#1f5a3a" d={0.2} breath={false}
      head={{ skin: SKIN[4], hair: "#8a3a1c", hs: "long", hat: "beanie", hatColor: "#1f5a3a", mouth: "blow" }}>
      <path d="M-13 -60 Q-34 -56 -42 -62" fill="none" stroke={coat} strokeWidth="6.4" strokeLinecap="round" />
      <path d="M13 -60 Q-4 -50 -22 -66" fill="none" stroke={coat} strokeWidth="6.4" strokeLinecap="round" />
      <path d="M-3 -75 L-72 -73" stroke="#e8edf5" strokeWidth="3" strokeLinecap="round" />
      <path d="M-3 -75.4 L-72 -73.4" stroke="#fff" strokeWidth=".8" />
      {[-14, -24, -34, -46, -56].map((kx, i) => (
        <circle key={kx} className="c-finger" cx={kx} cy={-74} r="1.5" fill="#9aa4b4" style={{ animationDelay: `${-(i * 0.1)}s` }} />
      ))}
      <circle cx="-42" cy="-63" r="2.6" fill="#f2c9a5" />
      <circle cx="-22" cy="-67" r="2.6" fill="#f2c9a5" />
    </Person>
  );
}

function Trumpeter({ x, y, s = 1.04 }) {
  const coat = PAL.red.coat;
  return (
    <Person x={x} y={y} s={s} pal="red" scarf="#d9a936" d={0.9} breath={false}
      head={{ skin: SKIN[2], hair: "#1d1512", hs: "short", hat: "fur", hatColor: "#efe2c7", mouth: "blow" }}>
      <path d="M13 -60 Q22 -52 8 -52" fill="none" stroke={coat} strokeWidth="6.4" strokeLinecap="round" />
      <path d="M-13 -60 Q-22 -54 -22 -66" fill="none" stroke={coat} strokeWidth="6.4" strokeLinecap="round" />
      {/* trumpet pointing to the left */}
      <g>
        <path d="M-2 -75 L-34 -75 Q-42 -75 -42 -69 Q-42 -63 -34 -63 L-14 -63" fill="none" stroke="url(#cBrass)" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M-34 -75 L-52 -85 L-52 -61 L-34 -69Z" fill="url(#cBrass)" stroke="#9a6a14" strokeWidth="1" />
        <ellipse cx="-52" cy="-73" rx="3.4" ry="12" fill="#fff0a0" stroke="#9a6a14" strokeWidth="1" />
        {[-14, -22, -30].map((px, i) => (
          <g key={px} className="c-piston" style={{ animationDelay: `${-i * 0.3}s` }}>
            <rect x={px - 1.6} y="-84" width="3.2" height="9" rx="1.4" fill="#e8b030" stroke="#9a6a14" strokeWidth=".7" />
            <circle cx={px} cy="-85" r="2" fill="#fff0a0" />
          </g>
        ))}
      </g>
      <circle cx="-22" cy="-66" r="2.6" fill="#f2c9a5" />
      <circle cx="8" cy="-52" r="2.6" fill="#f2c9a5" />
      <g transform="translate(0 -74)">
        <circle className="c-cheek" cx="-8" cy="6" r="2.6" fill="#f2c9a5" />
        <circle className="c-cheek" cx="8" cy="6" r="2.6" fill="#f2c9a5" />
      </g>
    </Person>
  );
}

function HandbellPlayer({ x, y, s = 1.02 }) {
  const coat = PAL.green.coat;
  const Bell = ({ cls }) => (
    <g className={cls}>
      <rect x="-1.6" y="0" width="3.2" height="7" rx="1.4" fill="#6a2a10" />
      <path d="M-7 15 Q-6 7 0 6 Q6 7 7 15Z" fill="url(#cBrass)" stroke="#9a6a14" strokeWidth="1" />
      <circle cx="0" cy="16" r="1.6" fill="#8a5a12" />
    </g>
  );
  return (
    <Person x={x} y={y} s={s} pal="green" scarf="#efe2c7" d={0.4} head={{ skin: SKIN[0], hair: "#5a3a22", hs: "bun", hat: "beanie", hatColor: "#9b1b2b", mouth: "sing", mouthDur: 0.5 }}>
      <path d="M-13 -60 Q-26 -54 -22 -46" fill="none" stroke={coat} strokeWidth="6.4" strokeLinecap="round" />
      <path d="M13 -60 Q26 -54 22 -46" fill="none" stroke={coat} strokeWidth="6.4" strokeLinecap="round" />
      <g transform="translate(-22 -46)"><Bell cls="c-hb1" /></g>
      <g transform="translate(22 -46)"><Bell cls="c-hb2" /></g>
      <circle cx="-22" cy="-46" r="2.6" fill="#f2c9a5" />
      <circle cx="22" cy="-46" r="2.6" fill="#f2c9a5" />
    </Person>
  );
}

function SleighBellsPlayer({ x, y, s = 1.02 }) {
  const coat = PAL.cream.coat;
  return (
    <Person x={x} y={y} s={s} pal="cream" scarf="#9b1b2b" d={1.1} head={{ skin: SKIN[3], hair: "#1d1512", hs: "short", hat: "top", hatColor: "#1d1512", mouth: "sing", mouthDur: 0.25 }}>
      <path d="M13 -60 Q28 -56 26 -44" fill="none" stroke={coat} strokeWidth="6.4" strokeLinecap="round" />
      <path d="M-13 -60 Q-22 -50 -10 -42" fill="none" stroke={coat} strokeWidth="6.4" strokeLinecap="round" />
      <g transform="translate(26 -44)">
        <g className="c-shake">
          <rect x="-1.8" y="-4" width="3.6" height="34" rx="1.6" fill="#7a1022" />
          {[6, 12, 18, 24, 30].map((by, i) => (
            <g key={by}>
              <circle cx={i % 2 ? 5 : -5} cy={by} r="3.4" fill="url(#cBrass)" stroke="#9a6a14" strokeWidth=".8" />
              <path d={`M${i % 2 ? 2 : -2} ${by} H${i % 2 ? 5 : -5}`} stroke="#7a1022" strokeWidth="1.2" />
            </g>
          ))}
        </g>
      </g>
      <circle cx="26" cy="-44" r="2.8" fill="#f2c9a5" />
      <circle cx="-10" cy="-42" r="2.6" fill="#f2c9a5" />
    </Person>
  );
}

// Upright piano + pianist in profile
function Piano({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="3" rx="64" ry="8" fill="#27407a" opacity=".3" />
      {/* pianist (profile, facing the keys on the right) */}
      <g transform="translate(-34 0)">
        <rect x="-12" y="-26" width="24" height="5" rx="2" fill="#2e0e08" />
        <path d="M-8 -26 V0M8 -26 V0" stroke="#2e0e08" strokeWidth="3" />
        <g className="c-sway" style={{ transformOrigin: "0px -26px", animationDuration: "2s" }}>
          <path d="M-9 -28 Q-12 -52 -5 -64 Q4 -68 9 -60 L12 -28Z" fill="#9b1b2b" />
          <rect x="-9" y="-31" width="21" height="3.4" fill="#d9a936" />
          <path d="M-12 -28 H16 L20 -14 H-10Z" fill="#2a1f1c" />
          <path d="M16 -14 L20 -2 H11" fill="none" stroke="#2a1f1c" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="20" cy="-1" rx="7" ry="3.4" fill="#15101a" />
          <path d="M0 -58 Q12 -50 22 -42" fill="none" stroke="#9b1b2b" strokeWidth="6" strokeLinecap="round" />
          <g className="c-keys"><circle cx="24" cy="-41" r="2.8" fill="#f2c9a5" /></g>
          <g transform="translate(2 -76)">
            <g className="c-head" style={{ transformOrigin: "0px 9px" }}>
              <path d="M-9 -2 Q-12 -12 0 -12 Q10 -12 9 -2 Q4 -5 -2 -4 Q-6 -4 -9 -2Z" fill="#5a3a22" />
              <circle r="9" cy="0" fill="#f2c9a5" />
              <path d="M-9 -2 Q-11 -10 -1 -11 Q8 -12 9 -3 Q3 -6 -4 -5 Q-7 -5 -9 -2Z" fill="#5a3a22" />
              <path d="M-9 4 Q-10 14 -3 14 L-2 6Z" fill="#5a3a22" />
              <path d="M6 -1 q2 -2 3 0" fill="none" stroke="#3a2418" strokeWidth="1.1" strokeLinecap="round" />
              <circle cx="5.4" cy="3.2" r="2" fill="#ff8a8a" opacity=".42" />
              <path d="M3.5 5.4 Q6 7 8.6 5.2" fill="none" stroke="#7a1022" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M-9 -4 Q-9 -16 3 -16 Q9 -14 8 -8" fill="none" stroke="#efe2c7" strokeWidth="0" />
            </g>
          </g>
        </g>
      </g>
      {/* piano */}
      <rect x="2" y="-84" width="72" height="84" rx="3" fill="url(#cPiano)" stroke="#1a0804" strokeWidth="1.4" />
      <rect x="2" y="-88" width="72" height="6" rx="2" fill="#4a1a10" />
      <rect x="0" y="-48" width="44" height="8" rx="1.5" fill="#fffaf0" stroke="#8a7a6a" strokeWidth=".8" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${3.4 * (i + 1)} -48V-40`} stroke="#8a7a6a" strokeWidth=".6" />
      ))}
      {[1, 2, 4, 5, 6, 8, 9].map((k) => (
        <rect key={k} x={3.4 * k - 1.2} y="-48" width="2.4" height="5" fill="#15101a" />
      ))}
      <g className="c-keys2"><rect x="30" y="-49.4" width="3.4" height="3" fill="#fff" opacity=".6" /></g>
      <rect x="6" y="-76" width="30" height="22" rx="1.5" fill="#fffaf0" stroke="#c9b79a" strokeWidth=".8" />
      <path d="M9 -70H33M9 -66H33M9 -62H33" stroke="#8a7a6a" strokeWidth=".5" />
      {[[13, -68], [19, -65], [25, -69], [30, -64]].map(([nx, ny], i) => (
        <ellipse key={i} cx={nx} cy={ny} rx="1.3" ry=".9" fill="#2a1a14" />
      ))}
      {/* candle holders */}
      {[48, 66].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="-96" r="18" fill="url(#cGlow)" className="c-flick" />
          <rect x={cx - 2} y="-94" width="4" height="8" fill="#fff8ec" />
          <path d={`M${cx} -101 Q${cx + 3} -96 ${cx} -93 Q${cx - 3} -96 ${cx} -101Z`} fill="#ffd45a" className="c-flick" />
          <rect x={cx - 4} y="-86" width="8" height="3" fill="url(#cGold)" />
        </g>
      ))}
      <path d="M4 0 V-4M70 0 V-4" stroke="#1a0804" strokeWidth="4" />
    </g>
  );
}

/* floating music notes above the choir */
function Notes() {
  const notes = [[470, 392, 0], [530, 380, 1.1], [600, 372, 2.0], [670, 382, 0.6], [730, 392, 1.6], [560, 360, 2.8], [640, 366, 3.3], [500, 410, 2.4]];
  return (
    <g>
      {notes.map(([nx, ny, nd], i) => (
        <g key={i} className="c-note" style={{ animationDelay: `${nd}s` }} transform={`translate(${nx} ${ny})`}>
          <g style={{ filter: "drop-shadow(0 0 5px #ffd45a)" }}>
            <circle cx="-3" cy="0" r="3.6" fill="#ffe9b0" />
            <path d="M0 0V-16q7 1 7 8" fill="none" stroke="#ffe9b0" strokeWidth="2.2" strokeLinecap="round" />
            {i % 2 === 0 && <path d="M0 -12q6 0 7 6" fill="none" stroke="#ffe9b0" strokeWidth="2.2" strokeLinecap="round" />}
          </g>
        </g>
      ))}
    </g>
  );
}

function Snowman({ x, y }) {
  return (
    <g transform={`translate(${x} ${y}) scale(.6) translate(-50 -136)`}>
      <ellipse cx="50" cy="136" rx="36" ry="5" fill="#27407a" opacity=".3" />
      <g className="c-sway" style={{ transformOrigin: "50px 136px" }}>
        <circle cx="50" cy="104" r="30" fill="#f1f6ff" stroke="#c6d9f0" />
        <circle cx="50" cy="64" r="22" fill="#f1f6ff" stroke="#c6d9f0" />
        <circle cx="50" cy="32" r="16" fill="#f1f6ff" stroke="#c6d9f0" />
        <path d="M32 62 L8 48 M8 48 L4 40 M8 48 L2 51 M68 62 L92 48 M92 48 L96 40 M92 48 L98 51" stroke="#5a3a1a" strokeWidth="3" strokeLinecap="round" fill="none" />
        <rect x="35" y="8" width="30" height="13" rx="2" fill="#1d1d1d" />
        <rect x="29" y="19" width="42" height="4" rx="2" fill="#1d1d1d" />
        <rect x="35" y="14" width="30" height="4" fill="#c8202e" />
        <circle cx="44" cy="28" r="2" fill="#111" />
        <circle cx="56" cy="28" r="2" fill="#111" />
        <path d="M50 32 L68 36 L50 38Z" fill="#ff8a2a" />
        <path d="M34 46 Q50 58 66 46 L68 54 Q50 66 32 54Z" fill="#c8202e" />
        <path d="M58 56 L68 82 L58 80Z" fill="#a3121f" />
        {[66, 84, 100].map((by) => (
          <circle key={by} cx="50" cy={by} r="2.6" fill="#222" />
        ))}
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  9. PAGE                                                            */
/* ------------------------------------------------------------------ */

function NoteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="18" r="3.6" fill="#7a1022" />
      <path d="M11.6 18V5l8 2v3.6l-8-2" fill="none" stroke="#7a1022" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function Spark({ x, y, id }) {
  const parts = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 + (i % 2 ? 0.25 : 0);
        const dist = 40 + ((i * 23) % 50);
        return { dx: Math.cos(a) * dist, dy: Math.sin(a) * dist - 30, r: ((i * 47) % 40) - 20, k: i % 3 };
      }),
    []
  );
  return (
    <g transform={`translate(${x} ${y})`} key={id}>
      {parts.map((p, i) => (
        <g key={i} className="c-spark" style={{ "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, "--r": `${p.r}deg` }}>
          {p.k === 0 ? (
            <path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8Z" fill="#fff3bf" />
          ) : (
            <g>
              <circle cx="-2.4" cy="0" r="3" fill={p.k === 1 ? "#ffd45a" : "#ffe9b0"} />
              <path d="M0 0V-12q6 1 6 7" fill="none" stroke={p.k === 1 ? "#ffd45a" : "#ffe9b0"} strokeWidth="1.8" strokeLinecap="round" />
            </g>
          )}
        </g>
      ))}
    </g>
  );
}

export default function ChristmasChoir() {
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const playerRef = useRef(null);
  const timers = useRef([]);
  const sparkId = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [sparks, setSparks] = useState([]);
  // const musique = new Audio("/audio/choir/choir1.mp3");
  useSnow(canvasRef);
  const CHOIR_TRACKS = [
  "/audio/choir/choir1.mp3",
  "/audio/choir/choir2.mp3",
  "/audio/choir/choir3.mp3",
  "/audio/choir/choir4.mp3",
  "/audio/choir/choir5.mp3",
];
const trackIndexRef = useRef(0);

const stopMusic = () => {
  const audio = playerRef.current;

  if (audio) {
    // Invalider le lecteur avant de l'arrêter
    playerRef.current = null;

    audio.pause();
    audio.currentTime = 0;
    audio.removeAttribute("src");
    audio.load();
  }

  setPlaying(false);
};

const startMusic = async () => {
  // Évite de démarrer plusieurs lecteurs simultanément
  if (playerRef.current) return;

  const audio = new Audio(CHOIR_TRACKS[trackIndexRef.current]);
  audio.volume = 0.7;
  audio.loop = false;

  playerRef.current = audio;

  audio.addEventListener("ended", () => {
    // Ne rien relancer si la musique a été arrêtée
    if (playerRef.current !== audio) return;

    // Passer au morceau suivant, puis revenir au premier
    trackIndexRef.current =
      (trackIndexRef.current + 1) % CHOIR_TRACKS.length;

    audio.src = CHOIR_TRACKS[trackIndexRef.current];

    audio.play().catch(() => {
      if (playerRef.current === audio) {
        setPlaying(false);
      }
    });
  });

  try {
    await audio.play();

    if (playerRef.current === audio) {
      setPlaying(true);
    }
  } catch (error) {
    if (playerRef.current === audio) {
      playerRef.current = null;
    }

    setPlaying(false);
  }
};

const toggleMusic = (e) => {
  e.stopPropagation();

  if (playing) {
    stopMusic();
  } else {
    startMusic();
  }
};
  
  // useEffect(
  //   () => () => {
  //     timers.current.forEach(clearTimeout);
  //     if (playerRef.current) playerRef.current.stop();
  //   },
  //   []
  // );
useEffect(() => {
  const handleStopChoir = () => {
    stopMusic();
  };

  window.addEventListener("stop-christmas-choir", handleStopChoir);

  startMusic();

  return () => {
    window.removeEventListener("stop-christmas-choir", handleStopChoir);

    const audio = playerRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
      playerRef.current = null;
    }

    timers.current.forEach(clearTimeout);
  };
}, []);
  // const toggleMusic = (e) => {
  //   e.stopPropagation();
  //   if (playing) {
  //     if (playerRef.current) playerRef.current.stop();
  //     playerRef.current = null;
  //     setPlaying(false);
  //   } else {
  //     try {
  //       playerRef.current = createCarolPlayer();
  //       // musique.play().catch(() => {});
  //       setPlaying(Boolean(playerRef.current));
  //     } catch (err) {
  //       setPlaying(false);
  //     }
  //   }
  // };

  const onScene = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg || !svg.getScreenCTM) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    const id = ++sparkId.current;
    setSparks((prev) => [...prev, { id, x: p.x, y: p.y }]);
    timers.current.push(setTimeout(() => setSparks((prev) => prev.filter((s) => s.id !== id)), 1500));
  }, []);

  return (
    <div className="ch-stage relative h-full min-h-[100svh] w-full max-h-full max-w-full overflow-hidden">
      <style>{CSS}</style>

      <header className="ch-head">
        <h1>{TEXTS.title}</h1>
      </header>

      <div className="ch-scene" onClick={onScene}>
        <svg ref={svgRef} className="ch-svg" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <Defs />
          <Sky />
          <Ground />

          {/* village */}
          <Garland x1={70} y1={296} x2={190} y2={302} sag={12} seed={0} />
          <Garland x1={190} y1={302} x2={300} y2={304} sag={12} seed={1} />
          <Garland x1={300} y1={304} x2={420} y2={296} sag={12} seed={2} />
          <Garland x1={420} y1={296} x2={780} y2={296} sag={34} n={14} seed={3} />
          <Garland x1={780} y1={296} x2={900} y2={302} sag={12} seed={4} />
          <Garland x1={900} y1={302} x2={1010} y2={296} sag={12} seed={5} />
          <Garland x1={1010} y1={296} x2={1125} y2={302} sag={12} seed={6} />
          <SmallFir x={-10} y={372} s={0.5} />
          <SmallFir x={230} y={376} s={0.42} />
          <SmallFir x={372} y={374} s={0.46} />
          <SmallFir x={840} y={376} s={0.44} />
          <SmallFir x={960} y={374} s={0.4} />
          <SmallFir x={1200} y={376} s={0.5} />
          <House x={-50} y={372} w={100} floors={2} wall="timber" seed={3} />
          <House x={70} y={372} w={100} floors={3} wall="timber" seed={4} lantern />
          <House x={190} y={366} w={84} floors={2} wall="log" roof="cTile" seed={5} />
          <House x={300} y={372} w={96} floors={2} wall="timber" seed={6} lantern />
          <House x={425} y={360} w={70} floors={2} wall="log" seed={7} />
          <House x={775} y={360} w={70} floors={2} wall="timber" roof="cTile" seed={8} />
          <House x={900} y={370} w={96} floors={2} wall="log" seed={9} lantern />
          <House x={1010} y={372} w={104} floors={3} wall="timber" roof="cTile" seed={10} />
          <House x={1125} y={366} w={88} floors={2} wall="timber" seed={11} />
          <House x={1250} y={372} w={100} floors={2} wall="log" seed={12} />
          <Lamp x={392} y={436} s={0.9} />
          <Lamp x={808} y={436} s={0.9} />
          <Mist y={404} o={0.8} />

          {/* the tree behind the choir */}
          <BigTree x={600} y={428} s={1.75} />

          {/* choir, back to front */}
          {SINGERS.map((p, i) => (
            <Singer key={i} {...p} />
          ))}
          <Notes />

          {/* orchestra + conductor */}
          <Mist y={548} o={0.7} cls="c-mist2" />
          <Violinist x={110} y={584} pal="red" hair="#5a3a22" skin={SKIN[0]} d={0} hat="beanie" />
          <Violinist x={188} y={592} pal="green" hair="#cfcfd6" skin={SKIN[1]} d={0.5} />
          <Cellist x={274} y={598} />
          <Flutist x={366} y={586} />
          <Conductor x={600} y={620} />
          <Piano x={846} y={566} />
          <Trumpeter x={1002} y={590} />
          <HandbellPlayer x={1070} y={598} />
          <SleighBellsPlayer x={1136} y={588} />
          <Snowman x={30} y={640} />
          <Mist y={640} o={0.55} />

          <rect x="-1500" y="-1200" width="4200" height="2400" fill="url(#cVig)" pointerEvents="none" />
          {sparks.map((sp) => (
            <Spark key={sp.id} id={sp.id} x={sp.x} y={sp.y} />
          ))}
        </svg>
      </div>

      <canvas ref={canvasRef} className="ch-snow" />

      <footer className="ch-foot">
        <p className="ch-hint absolute -top-10" aria-live="polite">{playing ? TEXTS.hintOn : TEXTS.hintOff}</p>
        <div>
          <p className="ch-hint" aria-live="polite">¡Esta noche los habitantes del pueblo de Margo se han reunido para ofrecer una hermosa velada de villancicos bajo la nieve.</p>
          <p className="ch-hint" aria-live="polite">Al caer la noche, las luces del pueblo brillan con más fuerza y las voces de sus habitantes se unen en una dulce melodía navideña</p>
        </div>
        {/* <button type="button" className="ch-btn" onClick={toggleMusic} aria-pressed={playing}>
          <NoteIcon />
          {playing ? TEXTS.stop : TEXTS.play}
        </button> */}
      </footer>
    </div>
  );
}