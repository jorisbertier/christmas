import React, { useCallback, useEffect, useRef, useState } from "react";
import houx from '../../assets/Ceremony/houx.png';
import letter from '../../assets/Ceremony/letter.jpg';

/* ------------------------------------------------------------------ */
/*  1. YOUR CONFIGURATION                                              */
/*  Put your photos in src/assets/awards/, uncomment the imports and   */
/*  replace `photo: null` with the imported name.                      */
/* ------------------------------------------------------------------ */

// import photo1 from "../../assets/awards/prize-1.jpg";
// import photo2 from "../../assets/awards/prize-2.jpg";
// import photo3 from "../../assets/awards/prize-3.jpg";

const WINNER = "Mi Amor"; // ✏️ her name, shown in gold when the prize is announced
const YEAR = 2026;

const PRIZES = [
  {
    id: "cabezota",
    title: "La más cabezota",
    tagline: "Premio a la terquedad más adorable del año",
    phrase: "Cuando decides algo, ni un huracán te mueve. Y aun así, es una de las cosas que más me gustan de ti.",
    photo: null, // photo1
    ratio: "4 / 3", // "4 / 3" landscape, "3 / 4" portrait, "1 / 1" square
    trophy: "cup",
  },
  {
    id: "sonrisa",
    title: "La sonrisa más bonita",
    tagline: "Premio a la luz que no se apaga ni en invierno",
    phrase: "Tu sonrisa ilumina más que todas las luces de Navidad juntas.",
    photo: null, // photo2
    ratio: "4 / 3",
    trophy: "star",
  },
  {
    id: "compania",
    title: "La mejor compañera de aventuras",
    tagline: "Premio al hogar que se lleva puesto",
    phrase: "Contigo cualquier plan es una aventura, y cualquier invierno, un hogar.",
    photo: null, // photo3
    ratio: "4 / 3",
    trophy: "heart",
  },
];

const TEXTS = {
  coverKicker: "Gala de entrega de premios",
  coverTitle: `Premios Navideños ${YEAR}`,
  coverSub: "Una ceremonia muy especial, solo para ti",
  open: "Abrir el telón",
  intro: [
    "Bienvenida a la gala más esperada del invierno.",
    `Esta noche entregaremos tres premios navideños ${YEAR}.`,
    "Y tengo la sensación de que ya sabes quién se los va a llevar…",
  ],
  startAwards: "Comenzar la entrega de premios",
  award: (n, total) => `Premio ${n} de ${total}`,
  envelope: "Abrir el sobre",
  drum: (title) => `Y el premio a «${title}» es para…`,
  winnerIs: "¡Y la ganadora es!",
  next: "Siguiente premio",
  finale: "Ver el gran final",
  finaleTitle: "Triple ganadora",
  finalePhrase: `Tres premios, una sola ganadora. Feliz Navidad ${YEAR}, mi amor.`,
  replay: "Volver a ver la ceremonia",
  musicOn: "Música",
  musicOff: "Sin música",
  photoHere: "Tu foto aquí",
};

/* ------------------------------------------------------------------ */
/*  2. HELPERS                                                         */
/* ------------------------------------------------------------------ */

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function useTyped(text, active, speed = 34) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    if (!active) return undefined;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(text.length); return undefined; }
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return text.slice(0, n);
}

/* ------------------------------------------------------------------ */
/*  3. AUDIO — everything is synthesised (no audio files needed)       */
/* ------------------------------------------------------------------ */

const NOTE = (m) => 440 * Math.pow(2, (m - 69) / 12);

function createAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = 0.85;
  const comp = ctx.createDynamicsCompressor();
  master.connect(comp);
  comp.connect(ctx.destination);

  const music = ctx.createGain();
  music.gain.value = 0.0001;
  music.connect(master);
  const fx = ctx.createGain();
  fx.connect(master);

  const len = ctx.sampleRate * 2.4;
  const imp = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = imp.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8);
  }
  const verb = ctx.createConvolver();
  verb.buffer = imp;
  const verbGain = ctx.createGain();
  verbGain.gain.value = 0.32;
  verb.connect(verbGain);
  verbGain.connect(master);
  music.connect(verb);
  fx.connect(verb);

  const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

  const tone = (t, f, dur, type, vol, dest, o = {}) => {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(f, t);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t + dur);
    if (o.detune) osc.detune.value = o.detune;
    const g = ctx.createGain();
    const a = o.attack ?? 0.01;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + a);
    g.gain.setValueAtTime(vol, t + Math.max(a, dur * (o.hold ?? 0.6)));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + (o.release ?? 0.1));
    let n = osc;
    if (o.lp) { const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = o.lp; n.connect(lp); n = lp; }
    n.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + dur + (o.release ?? 0.1) + 0.05);
  };

  const hit = (t, dur, { type = "bandpass", freq = 1800, q = 0.8, vol = 0.3, dest = fx, offset } = {}) => {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(t, offset ?? Math.random() * 1.5, dur + 0.05);
  };

  // Ambient bed: soft chords + glassy bells (original, no known melody)
  const CHORDS = [[48, 52, 55, 59], [45, 52, 55, 60], [41, 48, 52, 57], [43, 50, 55, 59]];
  const BELLS = [72, 74, 76, 79, 81, 84];
  const beat = 60 / 66;
  const loopSec = CHORDS.length * 4 * beat;
  let musicTimer = null;
  let nextLoop = 0;
  const scheduleLoop = (t0) => {
    CHORDS.forEach((ch, ci) => {
      const t = t0 + ci * 4 * beat;
      ch.forEach((m, k) => {
        tone(t, NOTE(m), 4 * beat * 0.98, "triangle", 0.05, music, { attack: 0.5, release: 0.8, lp: 1100, detune: k % 2 ? 6 : -6, hold: 0.8 });
        tone(t, NOTE(m + 12), 4 * beat * 0.98, "sine", 0.018, music, { attack: 0.7, release: 0.9, hold: 0.8 });
      });
      for (let b = 0; b < 8; b++) {
        const m = BELLS[(ci * 3 + b * 5) % BELLS.length];
        const bt = t + b * 0.5 * beat * 2 * 0.5 + (b % 2) * 0.02;
        tone(bt, NOTE(m), 1.6, "sine", 0.05, music, { attack: 0.005, release: 1.2, hold: 0.05 });
        tone(bt, NOTE(m) * 2.76, 0.7, "sine", 0.014, music, { attack: 0.005, release: 0.5, hold: 0.05 });
      }
    });
  };

  return {
    resume: () => ctx.state === "suspended" && ctx.resume(),
    startMusic() {
      if (ctx.state === "suspended") ctx.resume();
      music.gain.cancelScheduledValues(ctx.currentTime);
      music.gain.setTargetAtTime(0.9, ctx.currentTime, 0.4);
      if (musicTimer) return;
      nextLoop = ctx.currentTime + 0.1;
      scheduleLoop(nextLoop);
      musicTimer = setInterval(() => {
        if (nextLoop + loopSec - ctx.currentTime < 2.5) { nextLoop += loopSec; scheduleLoop(nextLoop); }
      }, 500);
    },
    duck(on) {
      music.gain.cancelScheduledValues(ctx.currentTime);
      music.gain.setTargetAtTime(on ? 0.12 : 0.9, ctx.currentTime, 0.25);
    },
    stopMusic() {
      music.gain.cancelScheduledValues(ctx.currentTime);
      music.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2);
    },
    // Snare roll that speeds up and swells, ending with a timpani hit
    drumroll(seconds) {
      const t0 = ctx.currentTime + 0.05;
      let t = 0;
      let i = 0;
      while (t < seconds - 0.1) {
        const p = t / seconds;
        const gap = 0.14 - 0.1 * p;
        hit(t0 + t, 0.09, { freq: 1900 + 700 * Math.sin(i * 1.7), q: 0.7, vol: 0.12 + 0.5 * p * p });
        if (i % 3 === 0) tone(t0 + t, 150 - 40 * p, 0.12, "sine", 0.18 + 0.2 * p, fx, { attack: 0.003, hold: 0.1 });
        t += gap;
        i++;
      }
      const end = t0 + seconds;
      tone(end, 110, 0.9, "sine", 0.7, fx, { slideTo: 45, attack: 0.005, hold: 0.1, release: 0.4 });
      hit(end, 0.4, { type: "lowpass", freq: 600, vol: 0.5 });
    },
    cymbal() {
      const t = ctx.currentTime + 0.02;
      hit(t, 2.4, { type: "highpass", freq: 5200, q: 0.5, vol: 0.28, offset: 0.2 });
      hit(t, 1.2, { type: "bandpass", freq: 9000, q: 0.4, vol: 0.18, offset: 0.7 });
    },
    // Brass-like fanfare in C major
    fanfare() {
      const t = ctx.currentTime + 0.05;
      const seq = [[60, 0, 0.16], [64, 0.16, 0.16], [67, 0.32, 0.16], [72, 0.48, 1.5], [64, 0.48, 1.5], [67, 0.48, 1.5], [76, 0.5, 1.4]];
      seq.forEach(([m, d, dur]) => {
        tone(t + d, NOTE(m), dur, "sawtooth", 0.05, fx, { attack: 0.03, lp: 2600, release: 0.35, hold: 0.85 });
        tone(t + d, NOTE(m), dur, "square", 0.02, fx, { attack: 0.03, lp: 1800, release: 0.35, hold: 0.85, detune: 5 });
      });
      [0.48, 1.3].forEach((d) => tone(t + d, NOTE(48), 0.7, "sine", 0.5, fx, { slideTo: NOTE(40), attack: 0.005, hold: 0.1 }));
    },
    applause(seconds = 3.4) {
      const t = ctx.currentTime;
      const n = Math.floor(seconds * 55);
      for (let i = 0; i < n; i++) {
        const when = t + Math.random() * seconds;
        const env = Math.sin((Math.PI * (when - t)) / seconds);
        hit(when, 0.05 + Math.random() * 0.05, { freq: 1200 + Math.random() * 2600, q: 0.6, vol: 0.05 + 0.1 * env * Math.random() });
      }
    },
    sparkle() {
      const t = ctx.currentTime;
      for (let i = 0; i < 9; i++) tone(t + i * 0.06, NOTE(84 + [0, 4, 7, 12, 7, 16, 12, 19, 24][i]), 0.5, "sine", 0.05, fx, { attack: 0.004, release: 0.5, hold: 0.05 });
    },
    close() {
      if (musicTimer) clearInterval(musicTimer);
      try { ctx.close(); } catch (e) { /* ignore */ }
    },
  };
}

/* ------------------------------------------------------------------ */
/*  4. FX CANVAS: falling snow + confetti                              */
/* ------------------------------------------------------------------ */

const CONFETTI = ["#ffd45a", "#fff3bf", "#e8b84a", "#d4222f", "#1f7a4d", "#ffffff", "#ff8fa3", "#7dd3fc"];

function useFx(canvasRef, apiRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, last = performance.now(), rainUntil = 0;
    const resize = () => { const r = canvas.getBoundingClientRect(); const d = Math.min(window.devicePixelRatio || 1, 2); W = r.width; H = r.height; canvas.width = Math.round(W * d); canvas.height = Math.round(H * d); ctx.setTransform(d, 0, 0, d, 0, 0); };
    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(canvas);
    const sprite = (soft, gold) => {
      const n = 32; const s = document.createElement("canvas"); s.width = n; s.height = n; const c = s.getContext("2d");
      const g = c.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      const col = gold ? "255,225,140" : "255,255,255";
      g.addColorStop(0, `rgba(${col},1)`); g.addColorStop(soft ? 0.2 : 0.5, `rgba(${col},${soft ? 0.65 : 1})`); g.addColorStop(1, `rgba(${col},0)`);
      c.fillStyle = g; c.fillRect(0, 0, n, n); return s;
    };
    const sp = { sharp: sprite(false), soft: sprite(true), gold: sprite(false, true) };
    const r = rng(77);
    const flakes = Array.from({ length: reduce ? 50 : 160 }, () => { const depth = Math.pow(r(), 1.6); return { x: r(), y: r(), depth, size: 0.8 + depth * 5, a: 0.3 + (1 - depth) * 0.45, vy: 0.14 + depth * 0.8, ph: r() * 6.28, fr: 0.4 + r() * 1.1, am: 0.1 + r() * 0.35, soft: depth > 0.72, gold: r() > 0.86 }; });
    let pieces = [];
    const spawn = (x, y, n, spread = 1) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = (3 + Math.random() * 9) * spread;
        pieces.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4, w: 5 + Math.random() * 7, h: 3 + Math.random() * 6, c: CONFETTI[(Math.random() * CONFETTI.length) | 0], life: 1 });
      }
    };
    apiRef.current = {
      burst: (fx, fy, n = 140) => { if (!reduce) spawn(fx * W, fy * H, n); else spawn(fx * W, fy * H, 30, 0.5); },
      rain: (seconds) => { rainUntil = performance.now() + seconds * 1000; },
    };
    const tick = (now) => {
      const dt = Math.min(3, (now - last) / 16.67); last = now; const t = now / 1000;
      const wind = Math.sin(t * 0.17) * 0.35 + 0.15;
      ctx.clearRect(0, 0, W, H);
      for (const f of flakes) {
        f.x += ((Math.sin(t * f.fr + f.ph) * f.am + wind * (0.3 + f.depth)) * dt) / W; f.y += (f.vy * dt) / H;
        if (f.y > 1.04) { f.y = -0.04; f.x = Math.random(); } if (f.x > 1.05) f.x = -0.05; if (f.x < -0.05) f.x = 1.05;
        const s = f.size * (f.soft ? 1.4 : 1.2);
        ctx.globalAlpha = Math.max(0.1, f.a);
        ctx.drawImage(f.gold ? sp.gold : f.soft ? sp.soft : sp.sharp, f.x * W - s, f.y * H - s, s * 2, s * 2);
      }
      if (now < rainUntil && !reduce && Math.random() < 0.9) spawn(Math.random() * W, -10, 3, 0.25);
      ctx.globalAlpha = 1;
      pieces = pieces.filter((p) => p.life > 0 && p.y < H + 30);
      for (const p of pieces) {
        p.vy += 0.22 * dt; p.vx *= 0.992; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.life -= 0.0035 * dt;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.min(1, p.life * 1.6); ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); if (ro) ro.disconnect(); apiRef.current = null; };
  }, [canvasRef, apiRef]);
}

/* ------------------------------------------------------------------ */
/*  5. STYLES                                                          */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&display=swap');

.pr-stage{container-type:size;position:relative;overflow:hidden;user-select:none;color:#fef3c7;font-family:'Cormorant Garamond',Georgia,serif;
  background:radial-gradient(120% 90% at 50% 30%,#1b2f66 0%,#0d1b42 45%,#060c22 100%)}
.pr-layer{position:absolute;inset:0;pointer-events:none}
.pr-wall{background:
  radial-gradient(60% 50% at 50% 38%,rgba(255,214,120,.22),transparent 70%),
  repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0 2px,transparent 2px 48px),
  radial-gradient(circle at 1px 1px,rgba(255,214,120,.18) 1px,transparent 1.6px) 0 0/34px 34px}
.pr-beam{position:absolute;top:-6cqh;width:34cqw;height:112cqh;transform-origin:50% 0;opacity:.34;
  background:linear-gradient(180deg,rgba(255,236,170,.85),rgba(255,236,170,0) 85%);clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);animation:pr-sweep 9s ease-in-out infinite alternate}
.pr-stage[data-drum="true"] .pr-beam{opacity:.62;animation-duration:1.6s}
@keyframes pr-sweep{from{transform:rotate(-16deg)}to{transform:rotate(16deg)}}
.pr-bokeh{opacity:.9;background:
  radial-gradient(circle at 12% 70%,rgba(255,190,90,.35) 0 2.4cqw,transparent 2.9cqw),
  radial-gradient(circle at 88% 64%,rgba(255,190,90,.3) 0 3cqw,transparent 3.5cqw),
  radial-gradient(circle at 26% 22%,rgba(255,225,150,.25) 0 1.4cqw,transparent 1.9cqw),
  radial-gradient(circle at 74% 20%,rgba(255,225,150,.25) 0 1.8cqw,transparent 2.3cqw)}

/* curtains */
.pr-curtain{position:absolute;top:0;bottom:0;width:52cqw;z-index:6;transition:transform 3.2s cubic-bezier(.65,0,.25,1);
  background:
   linear-gradient(180deg,rgba(0,0,0,.35),transparent 18%,transparent 82%,rgba(0,0,0,.45)),
   repeating-linear-gradient(90deg,#6a0a16 0,#b3182c 3.2%,#7a0f1c 6.4%,#4e0711 9.6%,#a3121f 12.8%);
  box-shadow:inset 0 0 40px rgba(0,0,0,.55)}
.pr-curtain.l{left:0;transform-origin:0 50%;border-right:3px solid #d9a936}
.pr-curtain.r{right:0;transform-origin:100% 50%;border-left:3px solid #d9a936}
.pr-curtain::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3.4cqh;
  background:radial-gradient(circle at 50% 0,#e8b84a 0 2px,transparent 2.5px) 0 0/12px 100%,linear-gradient(180deg,#b9822a,#7a4a12)}
.pr-stage[data-open="true"] .pr-curtain{transform:scaleX(.17)}
.pr-valance{position:absolute;left:0;right:0;top:0;height:13cqh;z-index:9;pointer-events:none}
.pr-tie{position:absolute;top:44cqh;z-index:8;width:3cqw;height:11cqh;opacity:0;transition:opacity 1.5s ease 2.2s;pointer-events:none}
.pr-stage[data-open="true"] .pr-tie{opacity:1}

/* floor */
.pr-floor{position:absolute;left:0;right:0;bottom:0;height:15cqh;z-index:5;pointer-events:none;
  background:linear-gradient(180deg,rgba(0,0,0,0) 0,rgba(60,6,14,.9) 18%,#4e0a14 55%,#2a050b 100%);border-top:2px solid rgba(232,184,74,.55)}
.pr-floor::before{content:"";position:absolute;left:8cqw;right:8cqw;top:34%;height:30%;background:repeating-linear-gradient(90deg,rgba(255,214,120,.18) 0 2px,transparent 2px 40px)}

/* content */
.pr-main{position:absolute;left:11cqw;right:11cqw;top:12cqh;bottom:14.5cqh;z-index:7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.2cqh;text-align:center;min-height:0}
.pr-kicker{margin:0;font-style:italic;font-weight:600;color:#fcd34d;letter-spacing:.14em;font-size:clamp(13px,min(2cqw,3.2cqh),24px)}
.pr-gold{background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 32%,#d9a336 58%,#fbe493 82%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 rgba(58,0,12,.6)) drop-shadow(0 0 18px rgba(255,200,90,.35))}
.pr-h1{margin:0;font-style:italic;font-weight:700;line-height:1.02;font-size:clamp(34px,min(8cqw,13cqh),120px)}
.pr-h2{margin:0;font-style:italic;font-weight:700;line-height:1.05;font-size:clamp(26px,min(5.2cqw,9cqh),84px)}
.pr-sub{margin:0;font-style:italic;color:#ffe9c9;font-size:clamp(15px,min(2.4cqw,3.8cqh),30px)}
.pr-hand{margin:0;font-family:'Caveat','Segoe Script',cursive;font-weight:700;color:#ffe9b0;line-height:1.18;font-size:clamp(20px,min(3.2cqw,5cqh),42px);text-shadow:0 2px 10px rgba(0,0,0,.55);max-width:min(100%,46em)}
.pr-slot{flex:1 1 0;min-height:0;width:100%;display:flex;align-items:center;justify-content:center}
.pr-frame{position:relative;height:100%;max-width:100%;aspect-ratio:var(--ratio,4/3);display:flex;align-items:center;justify-content:center;padding:2.6%;box-sizing:border-box;
  background:linear-gradient(135deg,#fff3bf,#d9a336 28%,#8a5a12 50%,#f1cd6a 72%,#a8721f);border-radius:10px;
  box-shadow:0 0 0 3px #4e0a14,0 0 40px rgba(255,200,90,.55),0 18px 50px rgba(0,0,0,.6)}
.pr-frame::before{content:"";position:absolute;inset:2.6%;background:#10152f;border-radius:4px;box-shadow:inset 0 0 20px rgba(0,0,0,.8)}
.pr-frame img,.pr-frame .pr-ph{position:relative;z-index:1;border-radius:3px}
.pr-ph{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4em;font-style:italic;font-size:clamp(14px,2.4cqw,28px);color:#ffe9b0;background:linear-gradient(150deg,#b3202a,#7a0f1a 55%,#14543a)}
.pr-ph b{font-size:3em;font-style:normal}
.pr-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 0.55em 1.7em;

  border: 2px solid #f8d982;
  border-radius: 999px;
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;

  font-family: inherit;
  font-weight: 800;
  font-size: clamp(17px, min(2.5cqw, 3.8cqh), 30px);
  letter-spacing: 0.035em;
  color: #fff3c7;
  text-shadow: 0 2px 3px rgba(65, 0, 8, 0.7);

  background:
    linear-gradient(
      110deg,
      transparent 20%,
      rgba(255, 255, 255, 0.18) 45%,
      transparent 65%
    ),
    linear-gradient(
      180deg,
      #c72d3e 0%,
      #a30e28 48%,
      #70091b 100%
    );

  box-shadow:
    inset 0 2px 1px rgba(255, 235, 173, 0.55),
    inset 0 -4px 7px rgba(50, 0, 8, 0.3),
    0 4px 0 #590817,
    0 7px 0 #d5a13b,
    0 12px 24px rgba(0, 0, 0, 0.35),
    0 0 22px rgba(255, 207, 100, 0.2);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

/* Reflet lumineux */
.pr-btn::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: 2px;
  border-radius: inherit;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.2),
    transparent 45%
  );

  pointer-events: none;
}

/* Petit éclat doré qui traverse le bouton */
.pr-btn::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -70%;
  width: 45%;
  height: 200%;
  transform: rotate(25deg);

  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 247, 205, 0.5),
    transparent
  );

  transition: left 0.55s ease;
  pointer-events: none;
}

.pr-btn:hover {
  transform: translateY(-3px);
  filter: brightness(1.12);

  box-shadow:
    inset 0 2px 1px rgba(255, 245, 195, 0.7),
    0 5px 0 #590817,
    0 8px 0 #f1c75f,
    0 15px 32px rgba(0, 0, 0, 0.4),
    0 0 32px rgba(255, 215, 110, 0.55);
}

.pr-btn:hover::after {
  left: 130%;
}

.pr-btn:active {
  transform: translateY(4px);

  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.25),
    0 1px 0 #590817,
    0 3px 0 #d5a13b,
    0 5px 12px rgba(0, 0, 0, 0.3);
}

.pr-btn:focus-visible {
  outline: 3px solid #fff3c4;
  outline-offset: 5px;
}

/* Animation lumineuse */
.pr-btn.pulse {
  animation: pr-pulse 2.2s ease-in-out infinite;
}

@keyframes pr-pulse {
  0%, 100% {
    box-shadow:
      inset 0 2px 1px rgba(255, 235, 173, 0.55),
      0 4px 0 #590817,
      0 7px 0 #d5a13b,
      0 12px 24px rgba(0, 0, 0, 0.35),
      0 0 15px rgba(255, 207, 100, 0.2);
  }

  50% {
    box-shadow:
      inset 0 2px 1px rgba(255, 245, 195, 0.7),
      0 4px 0 #590817,
      0 7px 0 #f1c75f,
      0 12px 30px rgba(0, 0, 0, 0.35),
      0 0 32px rgba(255, 215, 110, 0.6);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pr-btn,
  .pr-btn.pulse,
  .pr-btn::after {
    animation: none;
    transition: none;
  }
}
@keyframes pr-pulse{0%,100%{box-shadow:0 5px 0 #8a5a12,0 12px 28px rgba(0,0,0,.45),0 0 26px rgba(255,214,120,.4)}50%{box-shadow:0 5px 0 #8a5a12,0 12px 28px rgba(0,0,0,.45),0 0 52px rgba(255,214,120,.9)}}
.pr-mini{position:absolute;right:2.4cqw;bottom:2cqh;z-index:12;padding:.3em .9em;border-radius:999px;border:1px solid rgba(232,184,74,.7);background:rgba(8,14,36,.82);color:#ffe9b0;cursor:pointer;font-family:inherit;font-weight:600;font-size:clamp(13px,min(1.7cqw,2.6cqh),18px)}
.pr-mini:hover{background:rgba(232,184,74,.25)}
.pr-dots{position:absolute;left:2.4cqw;bottom:2.4cqh;z-index:12;display:flex;gap:.6em;align-items:center}
.pr-dots i{width:clamp(10px,1.5cqw,18px);aspect-ratio:1;border-radius:50%;border:2px solid #e8b84a;display:block;transition:all .5s ease}
.pr-dots i.on{background:radial-gradient(circle at 35% 30%,#fff,#ffd45a 55%,#c98a1e);box-shadow:0 0 14px #ffd45a}

.pr-cover{position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.6cqh;text-align:center;padding:14cqh 8cqw 12cqh;transition:opacity 1.2s ease}
.pr-stage[data-open="true"] .pr-cover{opacity:0;pointer-events:none}

.pr-in{animation:pr-in .9s cubic-bezier(.2,.9,.3,1) both}
@keyframes pr-in{from{opacity:0;transform:translateY(18px) scale(.94)}to{opacity:1;transform:none}}
.pr-zoom{animation:pr-zoom 1s cubic-bezier(.2,1.2,.3,1) both}
@keyframes pr-zoom{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:none}}
.pr-flash{position:absolute;inset:0;z-index:30;pointer-events:none;background:radial-gradient(circle at 50% 50%,rgba(255,244,200,.95),rgba(255,214,120,.3) 50%,transparent 75%);animation:pr-flash 1.2s ease-out both}
@keyframes pr-flash{0%{opacity:0}12%{opacity:1}100%{opacity:0}}
.pr-shake{animation:pr-shake .18s linear infinite}
@keyframes pr-shake{0%{transform:translate(0,0) rotate(0)}25%{transform:translate(-2px,1px) rotate(-1.4deg)}75%{transform:translate(2px,-1px) rotate(1.4deg)}100%{transform:translate(0,0) rotate(0)}}
.pr-stick1{transform-box:fill-box;transform-origin:100% 100%;animation:pr-stick .13s ease-in-out infinite alternate}
.pr-stick2{transform-box:fill-box;transform-origin:0% 100%;animation:pr-stick .13s ease-in-out infinite alternate-reverse}
@keyframes pr-stick{from{transform:rotate(-22deg)}to{transform:rotate(12deg)}}
.pr-ring{transform-box:fill-box;transform-origin:center;animation:pr-ring 1.2s ease-out infinite;opacity:0}
@keyframes pr-ring{0%{transform:scale(.5);opacity:.8}100%{transform:scale(2.2);opacity:0}}
.pr-twinkle1{animation:pr-tw 1.6s ease-in-out infinite}.pr-twinkle2{animation:pr-tw 2.4s ease-in-out infinite}.pr-twinkle3{animation:pr-tw 3.2s ease-in-out infinite}
@keyframes pr-tw{0%,100%{opacity:1}50%{opacity:.3}}
.pr-swing{transform-origin:50% 0;animation:pr-swing 4.4s ease-in-out infinite alternate}
@keyframes pr-swing{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
.pr-flame{transform-box:fill-box;transform-origin:50% 100%;animation:pr-flame 1.3s ease-in-out infinite alternate}
@keyframes pr-flame{0%{transform:scale(1,1) rotate(-3deg)}100%{transform:scale(.88,1.12) rotate(3deg)}}
.pr-spin{transform-box:fill-box;transform-origin:center;animation:pr-spin 9s linear infinite}
@keyframes pr-spin{to{transform:rotate(360deg)}}
.pr-shine{animation:pr-shine 3.4s ease-in-out infinite}
@keyframes pr-shine{0%,100%{filter:brightness(1) drop-shadow(0 0 10px rgba(255,214,120,.5))}50%{filter:brightness(1.25) drop-shadow(0 0 26px rgba(255,230,150,.95))}}
.pr-flap{transform-box:fill-box;transform-origin:50% 0;transition:transform .9s ease}
.pr-open .pr-flap{transform:scaleY(-1)}
.pr-cardrise{transition:transform .9s ease .3s}.pr-open .pr-cardrise{transform:translateY(-34px)}

@media (prefers-reduced-motion: reduce){
  .pr-beam,.pr-swing,.pr-flame,.pr-spin,.pr-shine,.pr-shake,.pr-stick1,.pr-stick2,.pr-ring,.pr-twinkle1,.pr-twinkle2,.pr-twinkle3,.pr-btn.pulse{animation:none !important}
  .pr-curtain{transition-duration:.4s}
}

.pr-image-decoration {
  position: absolute;
  height: auto;
  object-fit: contain;
  pointer-events: none;
  z-index: 2;
}
`;

/* ------------------------------------------------------------------ */
/*  6. DECORATIONS                                                     */
/* ------------------------------------------------------------------ */

function SharedDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="prGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".45" stopColor="#e8b84a" /><stop offset="1" stopColor="#a8721f" /></linearGradient>
        <linearGradient id="prGoldV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".5" stopColor="#e8b84a" /><stop offset="1" stopColor="#9a6a1c" /></linearGradient>
        <linearGradient id="prRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8202e" /><stop offset="1" stopColor="#6e0c16" /></linearGradient>
        <linearGradient id="prLeaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b9a63" /><stop offset="1" stopColor="#0f5a36" /></linearGradient>
        <radialGradient id="prBall" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset=".25" stopColor="currentColor" /><stop offset="1" stopColor="#000" stopOpacity=".55" /></radialGradient>
        <radialGradient id="prGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffc24a" stopOpacity=".95" /><stop offset="1" stopColor="#ff7a1a" stopOpacity="0" /></radialGradient>
        <linearGradient id="prSnow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset=".55" stopColor="#d6e4f8" /><stop offset="1" stopColor="#93acd8" /></linearGradient>
        <linearGradient id="prFir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1f6140" /><stop offset="1" stopColor="#07261a" /></linearGradient>
        <linearGradient id="prDrum" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8e121f" /><stop offset=".5" stopColor="#e0303f" /><stop offset="1" stopColor="#7a0f1a" /></linearGradient>
      </defs>
    </svg>
  );
}

function Valance() {
  const n = 10;
  const w = 1200 / n;
  let d = "M0 0H1200V62";
  for (let i = n - 1; i >= 0; i--) d += ` Q${i * w + w / 2} ${62 + 62} ${i * w} 62`;
  d += "Z";
  const trim = [];
  for (let i = 0; i < n; i++) trim.push(`M${i * w} 62 Q${i * w + w / 2} 124 ${(i + 1) * w} 62`);
  return (
    <svg className="pr-valance block w-full" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
      
      <rect width="1200" height="14" fill="url(#prGold)" />
      <path d={d} fill="url(#prRed)" />
      <path d={d} fill="url(#prFold)" opacity="0" />
      {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${i * 50} 14Q${i * 50 + 25} 80 ${i * 50 + 50} 14`} fill="none" stroke="#000" strokeOpacity=".18" strokeWidth="6" />)}
      <path d={trim.join(" ")} fill="none" stroke="url(#prGold)" strokeWidth="5" />
      {Array.from({ length: n }, (_, i) => <g key={i}><circle cx={i * w} cy="66" r="7" fill="url(#prGold)" /><path d={`M${i * w} 70V96`} stroke="#d9a336" strokeWidth="2" /><ellipse cx={i * w} cy="104" rx="6" ry="9" fill="url(#prGold)" /></g>)}
      {Array.from({ length: 80 }, (_, i) => { const x = 8 + i * 15; const y = 62 + 62 * Math.pow(Math.sin((((x % w) / w) * Math.PI)), 1) * 1; return <circle key={i} cx={x} cy={y - 1} r="1.8" fill="#ffe9b0" />; })}
    </svg>
  );
}

function Swag({ top, c1 = "#2b9a63", seed = 1 }) {
  // Pine garland with lights and berries along a curve
  const r = rng(seed);
  const pts = Array.from({ length: 28 }, (_, i) => { const t = i / 27; return { x: t * 1200, y: 40 + Math.sin(t * Math.PI) * 38 }; });
  return (
    <svg className="pr-layer block w-full" style={{ top: `${top}cqh`, height: "10cqh", zIndex: 10 }} viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={`M0 40 Q600 118 1200 40`} fill="none" stroke="#0f4a2c" strokeWidth="16" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${(r() - 0.5) * 80})`}>
          <path d="M0 0Q10 -6 22 0Q10 6 0 0Z" fill={i % 2 ? c1 : "#1f7a4d"} /><path d="M0 0Q-10 -6 -22 0Q-10 6 0 0Z" fill={i % 2 ? "#1f7a4d" : c1} />
        </g>
      ))}
      {pts.filter((_, i) => i % 3 === 1).map((p, i) => (
        <g key={i}><circle cx={p.x} cy={p.y + 3} r="8" fill={["#ffd45a", "#ff6b6b", "#7dd3fc", "#fff3bf"][i % 4]} opacity=".25" /><circle className={`pr-twinkle${(i % 3) + 1}`} cx={p.x} cy={p.y + 3} r="3.6" fill={["#ffd45a", "#ff6b6b", "#7dd3fc", "#fff3bf"][i % 4]} style={{ animationDelay: `${i * 0.2}s` }} /></g>
      ))}
      {pts.filter((_, i) => i % 5 === 2).map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y + 2})`}><circle r="5" fill="#d4222f" stroke="#7a0f1a" /><circle cx="-1.6" cy="-1.6" r="1.4" fill="#fff" opacity=".7" /></g>
      ))}
    </svg>
  );
}

function Bauble({ x, drop, color, size = 3.4, delay = 0 }) {
  return (
    <div className="pr-swing" style={{ position: "absolute", left: `${x}cqw`, top: "7cqh", zIndex: 11, animationDelay: `${delay}s`, color }}>
      <svg width={`${size}cqw`} viewBox="0 0 40 90" style={{ display: "block", overflow: "visible", height: `${drop}cqh` }} preserveAspectRatio="xMidYMin meet" aria-hidden="true">
        <path d="M20 0V40" stroke="#e8b84a" strokeWidth="1.4" />
        <rect x="16" y="36" width="8" height="6" fill="url(#prGold)" />
        <circle cx="20" cy="62" r="19" fill="url(#prBall)" />
        <path d="M8 56Q20 66 32 56" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2.4" />
        <circle cx="20" cy="62" r="19" fill="none" stroke="#fff" strokeOpacity=".2" />
      </svg>
    </div>
  );
}

function HangingStar({ x, len, delay = 0 }) {
  return (
    <div className="pr-swing" style={{ position: "absolute", left: `${x}cqw`, top: "7cqh", zIndex: 11, animationDelay: `${delay}s`, animationDuration: "6s" }}>
      <svg width="3.2cqw" viewBox="0 0 40 120" style={{ display: "block", overflow: "visible", height: `${len}cqh` }} preserveAspectRatio="xMidYMin meet" aria-hidden="true">
        <path d="M20 0V70" stroke="#e8b84a" strokeWidth="1.4" />
        <g transform="translate(20 92)"><circle r="26" fill="url(#prGlow)" opacity=".7" /><path className="pr-spin" d="M0 -18 L5 -6 L18 -6 L8 3 L12 16 L0 8 L-12 16 L-8 3 L-18 -6 L-5 -6Z" fill="url(#prGold)" stroke="#fff3bf" strokeWidth="1" /></g>
      </svg>
    </div>
  );
}

function Mistletoe() {
  return (
    <svg style={{ position: "absolute", left: "50%", top: "8cqh", width: "9cqw", transform: "translateX(-50%)", zIndex: 12, overflow: "visible" }} viewBox="0 0 120 80" aria-hidden="true">
      <g fill="#6bbf59" stroke="#2c6a2a" strokeWidth="1">
        {[-60, -35, -12, 12, 35, 60].map((a, i) => <ellipse key={i} cx="60" cy="14" rx="9" ry="22" transform={`rotate(${a} 60 8)`} />)}
      </g>
      {[[44, 42], [60, 48], [76, 42], [52, 54], [68, 54]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="5" fill="#f7f3e6" stroke="#cfc7a8" /><circle cx={x - 1.4} cy={y - 1.4} r="1.2" fill="#fff" /></g>)}
      <path d="M60 4Q48 -4 38 2Q48 6 60 4Q72 6 82 2Q72 -4 60 4Z" fill="url(#prRed)" stroke="#6e0c16" /><circle cx="60" cy="4" r="4" fill="#d4222f" />
    </svg>
  );
}

function Fir({ x, bottom, h, flip }) {
  const tiers = [[8, 54, 26], [34, 90, 38], [60, 130, 52], [96, 170, 64]];
  return (
    <svg style={{ position: "absolute", left: `${x}cqw`, bottom: `${bottom}cqh`, height: `${h}cqh`, zIndex: 6, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }} viewBox="-70 0 140 190" aria-hidden="true">
      <ellipse cx="0" cy="186" rx="64" ry="9" fill="#fff" opacity=".85" />
      {tiers.reverse().map(([t, b, hw], i) => (
        <g key={i}>
          <path d={`M0 ${t} L${hw} ${b} Q${hw / 2} ${b + 12} 0 ${b + 4} Q${-hw / 2} ${b + 12} ${-hw} ${b}Z`} fill="url(#prFir)" />
          <path d={`M0 ${t} L${hw * 0.8} ${b - 8} Q${hw / 2} ${b + 2} 0 ${b - 6} Q${-hw / 2} ${b + 2} ${-hw * 0.8} ${b - 8}Z`} fill="url(#prSnow)" opacity=".85" />
        </g>
      ))}
      {[[-14, 60], [18, 90], [-30, 124], [26, 140], [0, 160], [-8, 104]].map(([lx, ly], i) => <circle key={i} className={`pr-twinkle${(i % 3) + 1}`} cx={lx} cy={ly} r="3.2" fill={["#ffd45a", "#ff6b6b", "#7dd3fc"][i % 3]} style={{ animationDelay: `${i * 0.3}s` }} />)}
      <path className="pr-spin" d="M0 -4 L4 6 L15 6 L6.5 12 L9.5 22 L0 16 L-9.5 22 L-6.5 12 L-15 6 L-4 6Z" fill="url(#prGold)" transform="translate(0 4)" />
    </svg>
  );
}

function Gifts({ x, flip }) {
  return (
    <svg style={{ position: "absolute", left: `${x}cqw`, bottom: "5cqh", height: "17cqh", zIndex: 8, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }} viewBox="0 0 150 110" aria-hidden="true">
      <ellipse cx="75" cy="104" rx="68" ry="6" fill="#000" opacity=".35" />
      <rect x="8" y="48" width="70" height="56" rx="3" fill="#c8202e" /><rect x="8" y="48" width="70" height="9" fill="#9b1520" /><rect x="36" y="48" width="14" height="56" fill="url(#prGoldV)" />
      <path d="M43 48Q24 22 30 40Q36 48 43 48Q50 48 56 40Q62 22 43 48Z" fill="url(#prGold)" stroke="#a8721f" /><circle cx="43" cy="46" r="4.5" fill="#e8b84a" />
      <rect x="24" y="20" width="40" height="28" rx="2" fill="#1f7a4d" /><rect x="39" y="20" width="10" height="28" fill="#ffe9b0" />
      <path d="M44 20Q34 6 38 16Q42 22 44 20Q46 22 50 16Q54 6 44 20Z" fill="#ffe9b0" stroke="#d9c58a" />
      <rect x="84" y="62" width="58" height="42" rx="3" fill="#2a6fd1" /><rect x="84" y="62" width="58" height="8" fill="#1a4f9a" /><rect x="108" y="62" width="10" height="42" fill="#fff3bf" />
      <path d="M113 62Q98 44 102 56Q108 62 113 62Q118 62 124 56Q128 44 113 62Z" fill="#fff3bf" stroke="#d9c58a" />
    </svg>
  );
}

function Candle({ x }) {
  return (
    <svg style={{ position: "absolute", left: `${x}cqw`, bottom: "11cqh", height: "10cqh", zIndex: 8, overflow: "visible" }} viewBox="0 0 40 90" aria-hidden="true">
      <ellipse cx="20" cy="30" rx="30" ry="30" fill="url(#prGlow)" className="pr-twinkle2" />
      <path className="pr-flame" d="M20 6Q28 20 20 30Q12 20 20 6Z" fill="#ffd45a" stroke="#ff9a1a" strokeWidth="1" />
      <rect x="14" y="32" width="12" height="42" rx="2" fill="#fff8ec" /><rect x="8" y="74" width="24" height="5" rx="2" fill="url(#prGold)" /><path d="M4 79H36L32 86H8Z" fill="url(#prGold)" />
      <g fill="#2b9a63"><path d="M2 74Q10 66 18 74Z" /><path d="M38 74Q30 66 22 74Z" /></g><circle cx="14" cy="72" r="2.4" fill="#d4222f" /><circle cx="26" cy="72" r="2.4" fill="#d4222f" />
    </svg>
  );
}

function Poinsettia({ x, size = 9 }) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg style={{ position: "absolute", left: `${x}cqw`, bottom: "6cqh", width: `${size}cqw`, zIndex: 9, overflow: "visible" }} viewBox="-40 -40 80 80" aria-hidden="true">
      {petals.map((a) => <path key={a} d="M0 0Q-9 -14 0 -36Q9 -14 0 0Z" fill="#c8202e" stroke="#7a0f1a" strokeWidth=".8" transform={`rotate(${a})`} />)}
      {petals.map((a) => <path key={a} d="M0 0Q-5 -10 0 -24Q5 -10 0 0Z" fill="#e63a4a" transform={`rotate(${a + 22})`} />)}
      {[[-4, -3], [4, -3], [0, 4], [-6, 3], [6, 3]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="2.8" fill="#ffd45a" stroke="#c98a1e" strokeWidth=".6" />)}
    </svg>
  );
}

function Footlights() {
  return (
    <div className="pr-layer" style={{ top: "auto", height: "4cqh", bottom: "10.8cqh", zIndex: 8, display: "flex", justifyContent: "space-between", padding: "0 11cqw" }} aria-hidden="true">
      {Array.from({ length: 22 }, (_, i) => <span key={i} className={`pr-twinkle${(i % 3) + 1}`} style={{ width: "1cqw", height: "1.4cqh", borderRadius: "50% 50% 40% 40%", background: ["#ffd45a", "#fff0a8", "#ff9a4a"][i % 3], boxShadow: "0 0 10px 2px rgba(255,200,90,.8)", animationDelay: `${i * 0.12}s` }} />)}
    </div>
  );
}

function TieBack({ side }) {
  return (
    <svg className="pr-tie" style={{ [side]: "9.4cqw" }} viewBox="0 0 30 90" aria-hidden="true">
      <path d={side === "left" ? "M0 20Q16 24 30 18" : "M30 20Q14 24 0 18"} stroke="url(#prGold)" strokeWidth="5" fill="none" />
      <path d="M15 22V50" stroke="#d9a336" strokeWidth="2" /><ellipse cx="15" cy="62" rx="7" ry="12" fill="url(#prGold)" /><path d="M9 70L8 86M15 74V90M21 70L22 86" stroke="#d9a336" strokeWidth="2" />
    </svg>
  );
}

function Backdrop() {
  return (
    <>
      <div className="pr-layer pr-wall" />
      <div className="pr-layer">
        <div className="pr-beam" style={{ left: "6cqw" }} />
        <div className="pr-beam" style={{ right: "6cqw", animationDelay: "-4s" }} />
      </div>
      <div className="pr-layer pr-bokeh" />
      <svg className="pr-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {Array.from({ length: 40 }, (_, i) => { const r = rng(i + 3); return <circle key={i} className={`pr-twinkle${(i % 3) + 1}`} cx={r() * 100} cy={r() * 60} r={0.12 + r() * 0.2} fill="#fff" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />; })}
      </svg>
    </>
  );
}


function ImageDecoration({
  src,
  x = 50,
  bottom = 0,
  width = 10,
  className = "",
  flip = false,
}) {
  function ImageDecoration({
  src,
  x = 50,
  bottom = 0,
  width = 10,
  className = "",
  flip = false,
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`pr-image-decoration ${className}`}
      style={{
        position: "absolute",
        left: `${x}cqw`,
        bottom: `${bottom}cqh`,
        width: `${width}cqw`,
        height: "auto",
        zIndex: 15,
        objectFit: "contain",
        transform: flip
          ? "translateX(-50%) scaleX(-1)"
          : "translateX(-50%)",
      }}
    />
  );
}
}


function Decorations() {
  return (
    <>
      <div className="pr-floor" aria-hidden="true" />
      <Footlights />
      <Fir x={2.4} bottom={13} h={44} />
      <Fir x={91.2} bottom={13} h={38} flip />

      <ImageDecoration
        src={houx}
        x={2.4}
        bottom={13}
        width={12}
        className="pr-bonhomme"
      />

      {/* <Gifts x={5.5} />
      <Gifts x={80.5} flip />
      <Candle x={3} />
      <Candle x={93.4} /> */}
      {/* <Poinsettia x={1.5} size={7.4} />
      <Poinsettia x={88.4} size={8} /> */}
      <Valance />
      {/* <Swag top={7.5} seed={4} />
      <Swag top={11} c1="#4cc07a" seed={9} /> */}
      <Bauble x={9} drop={13} color="#c8202e" size={3.6} />
      <Bauble x={17} drop={9} color="#e8b84a" size={3} delay={-1.2} />
      <HangingStar x={26} len={15} delay={-2} />
      <Bauble x={35} drop={10} color="#1f7a4d" size={3.2} delay={-0.6} />
      <Bauble x={64} drop={10} color="#2a6fd1" size={3.2} delay={-2.4} />
      <HangingStar x={72} len={13} delay={-0.8} />
      <Bauble x={80} drop={9} color="#e8b84a" size={3} delay={-3} />
      <Bauble x={88} drop={13} color="#c8202e" size={3.6} delay={-1.6} />
      {/* <Mistletoe /> */}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  7. TROPHIES, ENVELOPE, DRUM, PHOTO                                 */
/* ------------------------------------------------------------------ */

function Trophy({ kind, className = "" }) {
  return (
    <svg className={`pr-shine ${className}`} viewBox="0 0 120 150" style={{ height: "100%", maxHeight: "100%", overflow: "visible" }} aria-hidden="true">
      <ellipse cx="60" cy="144" rx="42" ry="5" fill="#000" opacity=".4" />
      <rect x="30" y="126" width="60" height="14" rx="3" fill="url(#prGoldV)" /><rect x="22" y="136" width="76" height="8" rx="3" fill="#7a4a12" />
      {kind === "cup" && (<g>
        <path d="M38 18H82Q84 70 60 84Q36 70 38 18Z" fill="url(#prGoldV)" stroke="#a8721f" strokeWidth="1.4" />
        <path d="M38 28Q12 24 18 52Q26 66 44 66M82 28Q108 24 102 52Q94 66 76 66" fill="none" stroke="url(#prGold)" strokeWidth="6" strokeLinecap="round" />
        <rect x="54" y="84" width="12" height="30" fill="url(#prGoldV)" /><rect x="44" y="112" width="32" height="14" rx="3" fill="url(#prGold)" />
        <path d="M60 30L64 42L77 42L67 50L71 62L60 55L49 62L53 50L43 42L56 42Z" fill="#fff3bf" opacity=".95" />
        <path d="M44 24Q46 62 56 74" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />
      </g>)}
      {kind === "star" && (<g>
        <rect x="52" y="96" width="16" height="34" fill="url(#prGoldV)" />
        <path d="M60 6L72 40L108 42L80 64L90 98L60 78L30 98L40 64L12 42L48 40Z" fill="url(#prGold)" stroke="#a8721f" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M60 6L72 40L60 52Z M108 42L80 64L60 52Z M90 98L60 78L60 52Z" fill="#fff" opacity=".28" />
        <circle cx="60" cy="52" r="9" fill="#d4222f" stroke="#fff3bf" strokeWidth="2" />
      </g>)}
      {kind === "heart" && (<g>
        <rect x="52" y="100" width="16" height="30" fill="url(#prGoldV)" />
        <path d="M60 94C20 68 14 30 38 22C50 18 58 28 60 34C62 28 70 18 82 22C106 30 100 68 60 94Z" fill="url(#prRed)" stroke="url(#prGold)" strokeWidth="5" strokeLinejoin="round" />
        <path d="M34 36Q38 28 48 30" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="4" strokeLinecap="round" />
        <path d="M44 6L60 22L76 6L70 26H50Z" fill="url(#prGold)" opacity=".0" />
        <path d="M46 6Q60 22 74 6L68 24H52Z" fill="#e8b84a" />
      </g>)}
      {[[18, 24], [104, 30], [96, 112], [14, 100]].map(([x, y], i) => <path key={i} className={`pr-twinkle${(i % 3) + 1}`} d={`M${x} ${y - 7}L${x + 2} ${y - 2}L${x + 7} ${y}L${x + 2} ${y + 2}L${x} ${y + 7}L${x - 2} ${y + 2}L${x - 7} ${y}L${x - 2} ${y - 2}Z`} fill="#fff3bf" style={{ animationDelay: `${i * 0.5}s` }} />)}
    </svg>
  );
}


function Envelope({ open, shake }) {
  return (
    <svg
      viewBox="0 0 260 190"
      className={`${open ? "pr-open" : ""} ${shake ? "pr-shake" : ""}`}
      style={{
        height: "100%",
        maxHeight: "100%",
        width: "100%",
        overflow: "visible",
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="envRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a91f35" />
          <stop offset="55%" stopColor="#7c1025" />
          <stop offset="100%" stopColor="#4b0918" />
        </linearGradient>

        <linearGradient id="envFlap" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#c83b4d" />
          <stop offset="100%" stopColor="#761023" />
        </linearGradient>

        <linearGradient id="envGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff0b0" />
          <stop offset="45%" stopColor="#d9ad51" />
          <stop offset="100%" stopColor="#a87527" />
        </linearGradient>

        <linearGradient id="envPaper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffdf5" />
          <stop offset="100%" stopColor="#f1dfb9" />
        </linearGradient>

        <linearGradient id="envWax" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3c7a0" />
          <stop offset="35%" stopColor="#b82a40" />
          <stop offset="100%" stopColor="#650c20" />
        </linearGradient>

        <filter id="envShadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="5"
            floodColor="#23030b"
            floodOpacity=".32"
          />
        </filter>
      </defs>

      {/* Ombre portée */}
      <ellipse
        cx="130"
        cy="174"
        rx="88"
        ry="7"
        fill="#17050a"
        opacity=".28"
      />

      <g filter="url(#envShadow)">
        {/* Lettre à l'intérieur */}
        <rect
          className="pr-cardrise"
          x="43"
          y="25"
          width="174"
          height="126"
          rx="5"
          fill="url(#envPaper)"
          stroke="#d5b46c"
          strokeWidth="1.5"
        />

        {/* Bordure décorative de la lettre */}
        <rect
          className="pr-cardrise"
          x="50"
          y="32"
          width="160"
          height="112"
          rx="3"
          fill="none"
          stroke="#d9bd80"
          strokeWidth=".8"
          strokeDasharray="2 3"
        />

        <g className="pr-cardrise">
          <text
            x="130"
            y="65"
            textAnchor="middle"
            fontSize="9"
            letterSpacing="2.5"
            fill="#a27b37"
            fontFamily="Georgia, serif"
          >
            JOYEUX NOËL
          </text>

          <path
            d="M91 74 Q130 68 169 74"
            fill="none"
            stroke="#d4ae62"
            strokeWidth=".8"
          />

          <text
            x="130"
            y="100"
            textAnchor="middle"
            fontSize="15"
            fontStyle="italic"
            fill="#85182c"
            fontFamily="'Cormorant Garamond', Georgia, serif"
          >
            {WINNER}
          </text>

          <path
            d="M122 113 Q130 106 138 113 Q130 121 122 113Z"
            fill="#a52339"
          />
          <path
            d="M130 121 V125"
            stroke="#c6a052"
            strokeWidth="1"
          />
        </g>

        {/* Corps principal de l'enveloppe */}
        <rect
          x="18"
          y="65"
          width="224"
          height="102"
          rx="5"
          fill="url(#envRed)"
          stroke="#d8b15e"
          strokeWidth="2"
        />

        {/* Liseré intérieur doré */}
        <rect
          x="24"
          y="71"
          width="212"
          height="90"
          rx="3"
          fill="none"
          stroke="#e5c77e"
          strokeWidth=".7"
          opacity=".8"
        />

        {/* Coins de l'enveloppe */}
        <path
          d="M27 78 V75 Q27 74 30 74 H36
             M224 74 H230 Q233 74 233 77 V83
             M27 150 V155 Q27 158 31 158 H37
             M223 158 H230 Q233 158 233 154 V149"
          fill="none"
          stroke="url(#envGold)"
          strokeWidth="1.3"
        />

        {/* Pans de l'enveloppe */}
        <path
          d="M19 72 L130 139 L241 72"
          fill="none"
          stroke="#d45b65"
          strokeWidth="1.2"
          opacity=".85"
        />

        <path
          d="M19 165 L93 112 L130 139 L167 112 L241 165"
          fill="#92182e"
          stroke="#d4a74e"
          strokeWidth="1.1"
        />

        {/* Rabat supérieur animé */}
        <path
          className="pr-flap"
          d="M18 66 L130 139 L242 66 Q130 48 18 66Z"
          fill="url(#envFlap)"
          stroke="#d8b15e"
          strokeWidth="1.6"
        />

        <path
          className="pr-flap"
          d="M27 70 L130 132 L233 70"
          fill="none"
          stroke="#edc87a"
          strokeWidth=".8"
          opacity=".65"
        />

        {/* Petit sceau de cire */}
        <g transform="translate(130 125)">
          <circle r="20" fill="#4d0918" opacity=".4" cy="2" />

          <circle
            r="17"
            fill="url(#envGold)"
            stroke="#f7e1a0"
            strokeWidth="1"
          />

          <circle
            r="13.5"
            fill="url(#envWax)"
            stroke="#6d1021"
            strokeWidth="1"
          />

          <path
            d="M0 8
               C-3 5 -10 0 -8 -5
               C-6 -10 -1 -8 0 -4
               C3 -9 8 -9 9 -4
               C10 1 4 5 0 8Z"
            fill="#ffe7bd"
            stroke="#fff0d4"
            strokeWidth=".6"
          />

          <path
            d="M-5 -13 Q0 -16 5 -13"
            fill="none"
            stroke="#fff0c8"
            strokeWidth="1"
            opacity=".8"
          />
        </g>
      </g>

      {/* Petits éclats dorés */}
      <g fill="url(#envGold)">
        <path d="M31 45 L33 51 L39 53 L33 55 L31 61 L29 55 L23 53 L29 51Z" />
        <path d="M222 39 L223.5 43 L228 44.5 L223.5 46 L222 50 L220.5 46 L216 44.5 L220.5 43Z" />
        <circle cx="46" cy="32" r="1.5" />
        <circle cx="211" cy="57" r="1.7" />
        <circle cx="51" cy="166" r="1.3" />
        <circle cx="211" cy="168" r="1.3" />
      </g>

      {/* Petites branches de houx */}
      <g transform="translate(37 139) rotate(-28)">
        <ellipse cx="-5" cy="0" rx="8" ry="3.5" fill="#285b3c" transform="rotate(-30 -5 0)" />
        <ellipse cx="4" cy="-4" rx="8" ry="3.5" fill="#39784b" transform="rotate(30 4 -4)" />
        <ellipse cx="5" cy="5" rx="7" ry="3" fill="#214a32" transform="rotate(-15 5 5)" />
        <circle cx="0" cy="0" r="3" fill="#d63a48" />
        <circle cx="5" cy="2" r="2.5" fill="#a91c30" />
        <circle cx="-3" cy="5" r="2.5" fill="#e54b54" />
      </g>

      <g transform="translate(222 142) rotate(25)">
        <ellipse cx="-5" cy="0" rx="8" ry="3.5" fill="#285b3c" transform="rotate(-30 -5 0)" />
        <ellipse cx="4" cy="-4" rx="8" ry="3.5" fill="#39784b" transform="rotate(30 4 -4)" />
        <ellipse cx="5" cy="5" rx="7" ry="3" fill="#214a32" transform="rotate(-15 5 5)" />
        <circle cx="0" cy="0" r="3" fill="#d63a48" />
        <circle cx="5" cy="2" r="2.5" fill="#a91c30" />
        <circle cx="-3" cy="5" r="2.5" fill="#e54b54" />
      </g>
    </svg>
  );
}



function Drum({ playing }) {
  return (
    <svg
      viewBox="0 0 240 210"
      style={{
        height: "100%",
        maxHeight: "100%",
        width: "100%",
        overflow: "visible",
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="drumBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4c0918" />
          <stop offset="18%" stopColor="#8c142a" />
          <stop offset="42%" stopColor="#c12c42" />
          <stop offset="62%" stopColor="#8b1429" />
          <stop offset="85%" stopColor="#650c20" />
          <stop offset="100%" stopColor="#3e0713" />
        </linearGradient>

        <linearGradient id="drumGold" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#fff2bd" />
          <stop offset="25%" stopColor="#e8c66e" />
          <stop offset="55%" stopColor="#b98734" />
          <stop offset="78%" stopColor="#f4d98d" />
          <stop offset="100%" stopColor="#936020" />
        </linearGradient>

        <linearGradient id="drumSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffdf2" />
          <stop offset="65%" stopColor="#f2e6c9" />
          <stop offset="100%" stopColor="#d9c59d" />
        </linearGradient>

        <linearGradient id="drumStick" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#956126" />
          <stop offset="40%" stopColor="#fff0bc" />
          <stop offset="70%" stopColor="#d6a751" />
          <stop offset="100%" stopColor="#8d5a25" />
        </linearGradient>

        <radialGradient id="drumCenter">
          <stop offset="0%" stopColor="#fff8df" />
          <stop offset="100%" stopColor="#e5d1a5" />
        </radialGradient>

        <filter id="drumShadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="4"
            floodColor="#24030a"
            floodOpacity=".3"
          />
        </filter>
      </defs>

      {/* Ombre au sol */}
      <ellipse
        cx="120"
        cy="190"
        rx="66"
        ry="7"
        fill="#1b050b"
        opacity=".25"
      />

      {/* Ondes musicales festives */}
      {[0, 0.4, 0.8].map((d) => (
        <circle
          key={d}
          className="pr-ring"
          cx="120"
          cy="103"
          r="43"
          fill="none"
          stroke="url(#drumGold)"
          strokeWidth="2.5"
          opacity=".8"
          style={{
            animationDelay: `${d}s`,
            animationPlayState: playing ? "running" : "paused",
          }}
        />
      ))}

      <g filter="url(#drumShadow)">
        {/* Pieds du support */}
        <path
          d="M79 151 L65 184 M120 153 V186 M161 151 L175 184"
          stroke="#633716"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M78 153 L66 181 M120 155 V181 M162 153 L174 181"
          stroke="url(#drumGold)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Traverse du support */}
        <path
          d="M72 181 Q120 193 168 181"
          fill="none"
          stroke="#8a5a2a"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M77 180 Q120 189 163 180"
          fill="none"
          stroke="#e8c66e"
          strokeWidth="1.5"
        />

        {/* Corps du tambour */}
        <path
          d="M60 78
             Q120 99 180 78
             L174 143
             Q120 166 66 143Z"
          fill="url(#drumBody)"
          stroke="#510817"
          strokeWidth="2"
        />

        {/* Reflets laqués */}
        <path
          d="M72 91 Q78 117 77 142"
          fill="none"
          stroke="#f77a79"
          strokeWidth="4"
          strokeLinecap="round"
          opacity=".5"
        />
        <path
          d="M84 96 Q89 121 88 147"
          fill="none"
          stroke="#ffb0a0"
          strokeWidth="1.3"
          opacity=".6"
        />
        <path
          d="M164 94 Q160 120 160 143"
          fill="none"
          stroke="#360610"
          strokeWidth="5"
          opacity=".45"
        />

        {/* Bandes décoratives sur le fût */}
        <path
          d="M62 87 Q120 107 178 87"
          fill="none"
          stroke="url(#drumGold)"
          strokeWidth="3"
        />
        <path
          d="M65 137 Q120 158 175 137"
          fill="none"
          stroke="url(#drumGold)"
          strokeWidth="3"
        />

        <path
          d="M67 95 Q120 113 173 95"
          fill="none"
          stroke="#f7d98b"
          strokeWidth=".8"
          opacity=".8"
        />

        {/* Petits clous dorés */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = 72 + i * 12;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={91 + Math.sin((i / 8) * Math.PI) * 8}
                r="2"
                fill="#fff0b3"
                stroke="#986421"
                strokeWidth=".6"
              />
              <circle
                cx={x}
                cy={139 + Math.sin((i / 8) * Math.PI) * 7}
                r="1.8"
                fill="#ffe8a1"
                stroke="#986421"
                strokeWidth=".5"
              />
            </g>
          );
        })}

        {/* Motif central étoile */}
        <g transform="translate(120 119)">
          <path
            d="M0 -13 L3 -4 L12 -4 L5 2 L8 11 L0 6 L-8 11 L-5 2 L-12 -4 L-3 -4Z"
            fill="url(#drumGold)"
            stroke="#ffe9a5"
            strokeWidth=".8"
          />
          <circle r="2" fill="#fff5cf" />
        </g>

        {/* Petits motifs de flocons */}
        <g
          stroke="#f8df9a"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity=".9"
        >
          <path d="M94 112 V122 M89 117 H99 M90.5 113.5 L97.5 120.5 M97.5 113.5 L90.5 120.5" />
          <path d="M146 112 V122 M141 117 H151 M142.5 113.5 L149.5 120.5 M149.5 113.5 L142.5 120.5" />
        </g>

        {/* Cerclage inférieur */}
        <ellipse
          cx="120"
          cy="143"
          rx="55"
          ry="15"
          fill="none"
          stroke="#57200e"
          strokeWidth="8"
        />
        <ellipse
          cx="120"
          cy="143"
          rx="55"
          ry="15"
          fill="none"
          stroke="url(#drumGold)"
          strokeWidth="4"
        />
        <ellipse
          cx="120"
          cy="143"
          rx="51"
          ry="12"
          fill="none"
          stroke="#fff0b8"
          strokeWidth=".8"
          opacity=".8"
        />

        {/* Peau du tambour */}
        <ellipse
          cx="120"
          cy="78"
          rx="60"
          ry="21"
          fill="#6c3a19"
          stroke="#6c3a19"
          strokeWidth="3"
        />
        <ellipse
          cx="120"
          cy="76"
          rx="60"
          ry="21"
          fill="url(#drumSkin)"
          stroke="url(#drumGold)"
          strokeWidth="4"
        />

        {/* Cercles concentriques sur la peau */}
        <ellipse
          cx="120"
          cy="76"
          rx="52"
          ry="15"
          fill="none"
          stroke="#c9ad72"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <ellipse
          cx="120"
          cy="76"
          rx="39"
          ry="10"
          fill="none"
          stroke="#c9ad72"
          strokeWidth=".7"
          opacity=".7"
        />

        {/* Rosace centrale */}
        <g transform="translate(120 76)">
          <circle r="9" fill="url(#drumCenter)" stroke="#d5b56a" strokeWidth="1" />
          <path
            d="M0 -6 L1.8 -1.8 L6 -1.8 L2.6 1 L3.8 5.5 L0 3 L-3.8 5.5 L-2.6 1 L-6 -1.8 L-1.8 -1.8Z"
            fill="#a51d33"
          />
          <circle r="1.5" fill="#fff1bf" />
        </g>

        {/* Petits rivets du cerclage supérieur */}
        {Array.from({ length: 13 }, (_, i) => {
          const angle = (Math.PI * i) / 12;
          const x = 120 + 54 * Math.cos(angle);
          const y = 76 + 17 * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.5"
              fill="#fff0b1"
              stroke="#9c702b"
              strokeWidth=".5"
            />
          );
        })}

        {/* Baguette gauche animée */}
        <g
          className={playing ? "pr-stick1" : ""}
          style={{ transformBox: "view-box", transformOrigin: "42px 22px" }}
        >
          <path
            d="M39 20 L103 72"
            stroke="#81501e"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M39 18 L103 70"
            stroke="url(#drumStick)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <ellipse
            cx="39"
            cy="19"
            rx="5"
            ry="7"
            transform="rotate(-50 39 19)"
            fill="url(#drumGold)"
            stroke="#a67632"
            strokeWidth="1"
          />
          <path
            d="M48 29 L91 64"
            stroke="#fff3ca"
            strokeWidth="1"
            strokeLinecap="round"
            opacity=".8"
          />
        </g>

        {/* Baguette droite animée */}
        <g
          className={playing ? "pr-stick2" : ""}
          style={{ transformBox: "view-box", transformOrigin: "198px 22px" }}
        >
          <path
            d="M201 20 L137 72"
            stroke="#81501e"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M201 18 L137 70"
            stroke="url(#drumStick)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <ellipse
            cx="201"
            cy="19"
            rx="5"
            ry="7"
            transform="rotate(50 201 19)"
            fill="url(#drumGold)"
            stroke="#a67632"
            strokeWidth="1"
          />
          <path
            d="M192 29 L149 64"
            stroke="#fff3ca"
            strokeWidth="1"
            strokeLinecap="round"
            opacity=".8"
          />
        </g>
      </g>

      {/* Houx décoratif à gauche */}
      <g transform="translate(48 151) rotate(-25)">
        <path
          d="M0 12 Q10 0 22 -5"
          fill="none"
          stroke="#b98b43"
          strokeWidth="1.5"
        />
        <path
          d="M5 7 Q-5 -1 0 -5 Q7 -5 8 3 Q13 -4 18 0 Q18 7 9 8"
          fill="#245b39"
          stroke="#174129"
          strokeWidth=".8"
        />
        <circle cx="8" cy="8" r="3" fill="#d62d43" />
        <circle cx="13" cy="5" r="2.5" fill="#a9152c" />
        <circle cx="4" cy="3" r="2.5" fill="#ed5960" />
      </g>

      {/* Houx décoratif à droite */}
      <g transform="translate(192 151) rotate(25)">
        <path
          d="M0 12 Q-10 0 -22 -5"
          fill="none"
          stroke="#b98b43"
          strokeWidth="1.5"
        />
        <path
          d="M-5 7 Q5 -1 0 -5 Q-7 -5 -8 3 Q-13 -4 -18 0 Q-18 7 -9 8"
          fill="#245b39"
          stroke="#174129"
          strokeWidth=".8"
        />
        <circle cx="-8" cy="8" r="3" fill="#d62d43" />
        <circle cx="-13" cy="5" r="2.5" fill="#a9152c" />
        <circle cx="-4" cy="3" r="2.5" fill="#ed5960" />
      </g>

      {/* Éclats festifs */}
      <g fill="url(#drumGold)">
        <path d="M37 62 L39 68 L45 70 L39 72 L37 78 L35 72 L29 70 L35 68Z" />
        <path d="M205 59 L207 64 L212 66 L207 68 L205 73 L203 68 L198 66 L203 64Z" />
        <path d="M61 34 L62.5 38 L66 39.5 L62.5 41 L61 45 L59.5 41 L56 39.5 L59.5 38Z" />
        <circle cx="183" cy="43" r="2" />
        <circle cx="32" cy="98" r="1.5" />
        <circle cx="209" cy="101" r="1.5" />
      </g>
    </svg>
  );
}


function PhotoFrame({ prize, className = "" }) {
  const lights = Array.from({ length: 16 }, (_, i) => i);
  return (
    <figure className={`pr-frame ${className}`} style={{ "--ratio": prize.ratio || "4 / 3", margin: 0 }}>
      {prize.photo ? (
        <img src={prize.photo} alt={`${WINNER}: ${prize.title}`} className="max-h-full max-w-full object-contain" draggable={false} />
      ) : (
        <div className="pr-ph"><b aria-hidden="true">🎄</b>{TEXTS.photoHere}</div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: "-1.2%", display: "flex", justifyContent: "space-around", padding: "0 6%", pointerEvents: "none", zIndex: 3 }}>
        {lights.map((i) => <span key={i} className={`pr-twinkle${(i % 3) + 1}`} style={{ width: "1.1%", minWidth: 7, aspectRatio: "1", borderRadius: "50%", background: ["#ff4d4d", "#ffd45a", "#4ade80", "#7dd3fc"][i % 4], boxShadow: `0 0 10px 2px ${["#ff4d4d", "#ffd45a", "#4ade80", "#7dd3fc"][i % 4]}`, animationDelay: `${i * 0.13}s` }} />)}
      </div>
      {[[0, 0, 0], [1, 0, 90], [1, 1, 180], [0, 1, 270]].map(([cx, cy, rot], i) => (
        <svg key={i} viewBox="0 0 60 60" style={{ position: "absolute", width: "11%", maxWidth: 74, [cx ? "right" : "left"]: "-3%", [cy ? "bottom" : "top"]: "-4%", transform: `rotate(${rot}deg)`, zIndex: 3, pointerEvents: "none", overflow: "visible" }} aria-hidden="true">
          <path d="M6 6Q26 8 34 22Q18 24 6 6Z" fill="url(#prLeaf)" stroke="#0a3b23" /><path d="M6 6Q10 26 24 34Q26 18 6 6Z" fill="url(#prLeaf)" stroke="#0a3b23" />
          <circle cx="22" cy="22" r="5" fill="#d4222f" stroke="#7a0f1a" /><circle cx="29" cy="15" r="4" fill="#d4222f" stroke="#7a0f1a" /><circle cx="15" cy="29" r="4" fill="#d4222f" stroke="#7a0f1a" /><circle cx="21" cy="20" r="1.4" fill="#fff" opacity=".7" />
        </svg>
      ))}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  8. THE CEREMONY                                                    */
/* ------------------------------------------------------------------ */

const DRUM_SECONDS = 5;

export default function ChristmasAwards() {
  // phase: cover → intro → announce → drum → reveal (× 3) → finale
  const [phase, setPhase] = useState("cover");
  const [index, setIndex] = useState(0);
  const [musicOn, setMusicOn] = useState(true);
  const [flash, setFlash] = useState(0);
  const audioRef = useRef(null);
  const fxRef = useRef(null);
  const canvasRef = useRef(null);
  const timers = useRef([]);
  useFx(canvasRef, fxRef);

  const later = useCallback((fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); }, []);
  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    if (audioRef.current) audioRef.current.close();
  }, []);

  const audio = () => audioRef.current;
  const opened = phase !== "cover";
  const prize = PRIZES[index];

  const openCurtain = () => {
    try {
      if (!audioRef.current) audioRef.current = createAudio();
      if (audioRef.current && musicOn) audioRef.current.startMusic();
      if (audioRef.current) audioRef.current.sparkle();
    } catch (e) { /* audio is a bonus */ }
    setPhase("intro");
  };

  const startAwards = () => { setIndex(0); setPhase("announce"); };

  const startDrum = () => {
    setPhase("drum");
    const a = audio();
    if (a) { a.duck(true); a.drumroll(DRUM_SECONDS); }
    later(() => {
      setFlash((f) => f + 1);
      setPhase("reveal");
      const a2 = audio();
      if (a2) { a2.cymbal(); a2.fanfare(); a2.applause(); a2.duck(false); }
      if (fxRef.current) { fxRef.current.burst(0.5, 0.42, 190); fxRef.current.burst(0.2, 0.5, 90); fxRef.current.burst(0.8, 0.5, 90); fxRef.current.rain(4); }
    }, DRUM_SECONDS * 1000 + 250);
  };

  const nextPrize = () => {
    if (index < PRIZES.length - 1) { setIndex(index + 1); setPhase("announce"); }
    else {
      setPhase("finale");
      const a = audio();
      if (a) { a.fanfare(); a.applause(5); a.sparkle(); }
      if (fxRef.current) { fxRef.current.burst(0.5, 0.4, 220); fxRef.current.rain(9); }
    }
  };

  const replay = () => { setIndex(0); setPhase("intro"); };

  const toggleMusic = () => {
    const next = !musicOn;
    setMusicOn(next);
    const a = audio();
    if (a) next ? a.startMusic() : a.stopMusic();
  };

  const typedTitle = useTyped(TEXTS.intro[0], phase === "intro", 28);
  const introLines = TEXTS.intro;
  const phrase = useTyped(prize.phrase, phase === "reveal", 38);
  const finalPhrase = useTyped(TEXTS.finalePhrase, phase === "finale", 42);
console.log(houx)
  return (
    <div className="pr-stage relative h-full min-h-[100svh] w-full max-h-full max-w-full overflow-hidden" data-open={opened} data-drum={phase === "drum"}>
      <style>{CSS}</style>
      <SharedDefs />
      <Backdrop />
      <Decorations />
      <img src={houx} className="absolute z-10 top-20 left-10 w-96 h-96" alt="" aria-hidden="true" />

      {/* curtains */}
      <div className="pr-curtain l" /><div className="pr-curtain r" />
      <TieBack side="left" /><TieBack side="right" />

      {/* cover (before the curtain opens) */}
      <div className="pr-cover" aria-hidden={opened}>
        <p className="pr-kicker pr-in">{TEXTS.coverKicker}</p>
        <h1 className="pr-h1 pr-gold pr-in" style={{ animationDelay: ".3s" }}>{TEXTS.coverTitle}</h1>
        <div className="pr-in" style={{ height: "17cqh", animationDelay: ".7s" }}><Trophy kind="cup" /></div>
        <p className="pr-sub pr-in" style={{ animationDelay: "1.1s" }}>{TEXTS.coverSub}</p>
        <button className="pr-btn pulse pr-in" style={{ animationDelay: "1.5s" }} onClick={openCurtain} tabIndex={opened ? -1 : 0}>{TEXTS.open}</button>
      </div>

      <main className="pr-main" aria-live="polite">
        {phase === "intro" && (
          <>
            <p className="pr-kicker pr-in" style={{ animationDelay: "2.4s" }}>{TEXTS.coverKicker}</p>
            <h2 className="pr-h2 pr-gold pr-in" style={{ animationDelay: "2.7s" }}>{TEXTS.coverTitle}</h2>
            <p className="pr-hand pr-in" style={{ animationDelay: "3.6s", minHeight: "1.2em" }}>{typedTitle}</p>
            <p className="pr-sub pr-in" style={{ animationDelay: "6.2s" }}>{introLines[1]}</p>
            <p className="pr-sub pr-in" style={{ animationDelay: "8s" }}>{introLines[2]}</p>
            <button className="pr-btn pulse pr-in" style={{ animationDelay: "9.4s" }} onClick={startAwards}>{TEXTS.startAwards}</button>
          </>
        )}

        {phase === "announce" && (
          <>
            <p className="pr-kicker pr-in">{TEXTS.award(index + 1, PRIZES.length)}</p>
            <h2 className="pr-h2 pr-gold pr-in" style={{ animationDelay: ".25s" }}>{prize.title}</h2>
            <p className="pr-sub pr-in" style={{ animationDelay: ".6s" }}>{prize.tagline}</p>
            <div className="pr-slot pr-zoom" style={{ animationDelay: ".9s" }}>
              <div style={{ display: "flex", gap: "5cqw", alignItems: "center", height: "100%", maxHeight: "100%" }}>
                <div style={{ height: "100%", maxHeight: "100%" }}><Trophy kind={prize.trophy} /></div>
                <div style={{ height: "62%" }}><Envelope /></div>
                
              {/* <div style={{ height: "62%", width: "100px" }}><img src={letter} className="w-full h-full" alt="Letter" /></div> */}
              </div>
            </div>
            <button className="pr-btn pulse pr-in" style={{ animationDelay: "1.4s" }} onClick={startDrum}>🥁 {TEXTS.envelope}</button>
          </>
        )}

        {phase === "drum" && (
          <>
            <p className="pr-kicker">{TEXTS.award(index + 1, PRIZES.length)}</p>
            <h2 className="pr-h2 pr-gold">{TEXTS.drum(prize.title)}</h2>
            <div className="pr-slot">
              <div style={{ display: "flex", gap: "6cqw", alignItems: "center", height: "100%", maxHeight: "100%" }}>
                <div style={{ height: "100%", maxHeight: "100%" }}><Drum playing /></div>
                <div style={{ height: "62%" }}><Envelope shake /></div>
              </div>
            </div>
            <p className="pr-hand" aria-hidden="true"><span className="pr-twinkle1">●</span> <span className="pr-twinkle2">●</span> <span className="pr-twinkle3">●</span></p>
          </>
        )}

        {phase === "reveal" && (
          <>
            <p className="pr-kicker pr-in">{prize.title}</p>
            <h2 className="pr-h1 pr-gold pr-zoom" style={{ fontSize: "clamp(30px,min(7.4cqw,11cqh),104px)", animationDelay: ".1s" }}>{WINNER}</h2>
            <div className="pr-slot pr-zoom" style={{ animationDelay: ".6s" }}><PhotoFrame prize={prize} /></div>
            <p className="pr-hand" style={{ minHeight: "2.4em" }}>{phrase}</p>
            <button className="pr-btn pulse pr-in" style={{ animationDelay: "3s" }} onClick={nextPrize}>{index < PRIZES.length - 1 ? TEXTS.next : TEXTS.finale}</button>
          </>
        )}

        {phase === "finale" && (
          <>
            <p className="pr-kicker pr-in">{TEXTS.coverTitle}</p>
            <h2 className="pr-h1 pr-gold pr-zoom" style={{ fontSize: "clamp(30px,min(7cqw,11cqh),100px)" }}>{TEXTS.finaleTitle}</h2>
            <p className="pr-sub pr-in" style={{ animationDelay: ".5s" }}>{WINNER}</p>
            <div className="pr-slot">
              <div style={{ display: "flex", gap: "3cqw", alignItems: "stretch", justifyContent: "center", height: "100%", maxHeight: "100%", width: "100%" }}>
                {PRIZES.map((p, i) => (
                  <div key={p.id} className="pr-zoom" style={{ animationDelay: `${0.5 + i * 0.5}s`, display: "flex", flexDirection: "column", alignItems: "center", gap: ".6cqh", height: "100%", minWidth: 0, flex: "1 1 0", maxWidth: "26cqw" }}>
                    <div style={{ height: "58%", maxHeight: "58%", display: "flex" }}><Trophy kind={p.trophy} /></div>
                    <div style={{ flex: 1, minHeight: 0, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {p.photo
                        ? <img src={p.photo} alt={p.title} className="max-h-full max-w-full object-contain" style={{ border: "3px solid #e8b84a", borderRadius: 6, boxShadow: "0 0 20px rgba(255,200,90,.5)" }} />
                        : <span className="pr-sub pr-gold" style={{ fontSize: "clamp(14px,min(2.2cqw,3.4cqh),28px)", fontWeight: 700 }}>{p.title}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="pr-hand" style={{ minHeight: "2.4em" }}>{finalPhrase}</p>
            <button className="pr-btn pr-in" style={{ animationDelay: "4s", fontSize: "clamp(14px,min(2cqw,3cqh),22px)" }} onClick={replay}>{TEXTS.replay}</button>
          </>
        )}
      </main>

      {flash > 0 && <div key={flash} className="pr-flash" />}
      <canvas ref={canvasRef} className="pr-layer" style={{ width: "100%", height: "100%", zIndex: 25 }} />

      {opened && (
        <>
          <div className="pr-dots" aria-label={TEXTS.award(Math.min(index + 1, PRIZES.length), PRIZES.length)}>
            {PRIZES.map((p, i) => <i key={p.id} className={(phase === "reveal" && i <= index) || (phase === "finale") || i < index ? "on" : ""} />)}
          </div>
          <button className="pr-mini" onClick={toggleMusic} aria-pressed={musicOn}>{musicOn ? "🔊" : "🔇"} {musicOn ? TEXTS.musicOn : TEXTS.musicOff}</button>
        </>
      )}
    </div>
  );
}
