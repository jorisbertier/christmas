import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import strawberry from "../../assets/first.jpg";

/* ------------------------------------------------------------------ */
/*  📸 Your pictures (supplied by you)                                 */
/*  1) uncomment the import(s)  2) put the variable in PHOTO / PLUSH   */
/* ------------------------------------------------------------------ */
// import nosotros from "../../assets/day1/nosotros.jpg";
// import peluche from "../../assets/day1/peluche.png";

const PHOTO = null; // → nosotros   (photo of the two of you)
const PLUSH_IMAGE = null; // → peluche   (optional: your own picture of the plush; otherwise a drawn teddy bear is shown)

// The day is "done" when this key is true (it is written when she reaches the final scene)
const STORAGE_KEY = "turnIn";

/* ------------------------------------------------------------------ */
/*  Texts (Spanish) — edit freely                                      */
/* ------------------------------------------------------------------ */

const TEXTS = {
  day: "Día 1",
  openHint: "Toca la caja de música para abrirla",
  dancing: "Una melodía solo para ti…",
  next: "Seguir ♥",
  explainTitle: "Tu calendario de Adviento",
  explain: [
    {
      k: "¿Qué es todo esto?",
      p: [
        "Esto es tu calendario de Adviento, mi amor. Durante 24 días se irá abriendo una casita del pueblo de Navidad, y dentro de cada una encontrarás una sorpresa.",
        "Cada casita se abre solo cuando llega su día, así que tendrás que tener un poquito de paciencia 😉.",
      ],
    },
    {
      k: "¿Por qué lo hice?",
      p: [
        "Porque la distancia no nos deja vivir esta Navidad juntos, y quería que cada día hasta el 24 de diciembre tuvieras algo mío cerca: un motivo para sonreír, una risa, un “estoy pensando en ti”.",
        "Cada casita lleva dentro un poquito de mi tiempo, de mi imaginación y muchísimo cariño. Veinticuatro días para decirte, de veinticuatro maneras distintas, cuánto te quiero.",
      ],
    },
  ],
  light: "Enciende tu pueblo de Navidad",
  lightHint: "Toca las lámparas para devolverle la luz",
  lampsLabel: "Lámparas encendidas",
  allLit: "¡Tu pueblo brilla gracias a ti! ✨",
  cont: "Continuar ›",
  lightBtn: "Encender el pueblo ✨",
  finalKick: "Tu pueblo está encendido",
  finalTitle: "Tu primer reagalo de Adviento",
  finalMsg: [
    "Este pueblo brilla porque tú lo has encendido, igual que iluminas cada día de mi vida.",
    "Gracias por dejarme quererte, incluso a kilómetros de distancia. Eres lo mejor que me ha pasado, mi amor. ❤️",
  ],
  photoCaption: "Tú y yo ❤️",
  photoEmpty: "Aquí irá vuestra foto",
  sign: ["Y esto es solo", "el comienzo...", "Te esperan 23 días", "más de magia."],
  replay: "↺ Volver a vivir la escena",
};

const LAMPS = [135, 245, 355, 445, 555, 665]; // x positions in the village (viewBox 800 × 420)
const HOUSES = [
  { x: 80, w: 92, h: 84, lamp: 0, wall: "#7a2f3a", roof: "#e8eefc" },
  { x: 190, w: 88, h: 100, lamp: 1, wall: "#2f5a46", roof: "#e8eefc" },
  { x: 300, w: 96, h: 90, lamp: 2, wall: "#8a5a2c", roof: "#e8eefc" },
  { x: 500, w: 96, h: 96, lamp: 3, wall: "#5a3a7a", roof: "#e8eefc" },
  { x: 610, w: 88, h: 86, lamp: 4, wall: "#a8553a", roof: "#e8eefc" },
  { x: 720, w: 92, h: 104, lamp: 5, wall: "#2f4f7a", roof: "#e8eefc" },
];

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
function readDone() {
  try { return window.localStorage.getItem(STORAGE_KEY) === "true"; } catch (e) { return false; }
}
function writeDone() {
  try { window.localStorage.setItem(STORAGE_KEY, "true"); } catch (e) { /* storage blocked */ }
}

/* ------------------------------------------------------------------ */
/*  Music: an original music-box waltz made with Web Audio             */
/* ------------------------------------------------------------------ */

const BEAT = 0.8;
const BAR = BEAT * 3;
const BARS = [
  { bass: 130.81, ch: [261.63, 329.63, 392.0], mel: [[0, 659.25, 1], [1, 783.99, 1], [2, 1046.5, 1]] },
  { bass: 110.0, ch: [220.0, 261.63, 329.63], mel: [[0, 987.77, 1.5], [1.5, 880.0, 0.5], [2, 783.99, 1]] },
  { bass: 87.31, ch: [174.61, 220.0, 261.63], mel: [[0, 880.0, 1], [1, 783.99, 1], [2, 698.46, 1]] },
  { bass: 98.0, ch: [196.0, 246.94, 293.66], mel: [[0, 659.25, 1], [1, 587.33, 2]] },
  { bass: 130.81, ch: [261.63, 329.63, 392.0], mel: [[0, 1046.5, 1], [1, 987.77, 1], [2, 1046.5, 1]] },
  { bass: 110.0, ch: [220.0, 261.63, 329.63], mel: [[0, 880.0, 1.5], [1.5, 783.99, 0.5], [2, 659.25, 1]] },
  { bass: 146.83, ch: [146.83, 174.61, 220.0], mel: [[0, 698.46, 1], [1, 880.0, 1], [2, 783.99, 1]] },
  { bass: 98.0, ch: [196.0, 246.94, 293.66], mel: [[0, 659.25, 1.5], [1.5, 587.33, 0.5], [2, 523.25, 1.4]] },
];
const PENTA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

function useMusicBox() {
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const wetRef = useRef(null);
  const timerRef = useRef(0);
  const nextRef = useRef(0);
  const barRef = useRef(0);
  const playingRef = useRef(false);
  const [on, setOn] = useState(true);
  const onRef = useRef(true);
  onRef.current = on;

  const ensure = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = onRef.current ? 0.8 : 0;
      master.connect(ctx.destination);
      // small procedural reverb: it gives the "music box in a big room" shimmer
      const len = Math.floor(ctx.sampleRate * 2.4);
      const buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
      const conv = ctx.createConvolver(); conv.buffer = buf;
      const wet = ctx.createGain(); wet.gain.value = 0.38;
      conv.connect(wet); wet.connect(master);
      ctxRef.current = ctx; masterRef.current = master; wetRef.current = conv;
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume().catch(() => {});
    return ctxRef.current;
  }, []);

  // one music-box note: pure tone + two bright partials, fast "plink" attack, long decay
  const note = useCallback((f, t, dur = 1.8, vol = 0.12) => {
    const ctx = ctxRef.current; if (!ctx) return;
    [[1, 1], [2, 0.3], [3.01, 0.1]].forEach(([m, a]) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f * m;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol * a, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur / (m > 1 ? 1.6 : 1));
      o.connect(g); g.connect(masterRef.current); g.connect(wetRef.current);
      o.start(t); o.stop(t + dur + 0.05);
    });
  }, []);

  const scheduleBar = useCallback((i, t) => {
    const b = BARS[i % BARS.length];
    note(b.bass, t, 2.2, 0.09);
    [1, 2].forEach((beat) => b.ch.forEach((f, k) => note(f, t + beat * BEAT + k * 0.025, 1.3, 0.04)));
    b.mel.forEach(([beat, f, d]) => note(f, t + beat * BEAT, 1.2 + d * 0.5, 0.13));
  }, [note]);

  const pump = useCallback(() => {
    const ctx = ctxRef.current; if (!ctx || !playingRef.current) return;
    while (nextRef.current < ctx.currentTime + 1.4) {
      scheduleBar(barRef.current, nextRef.current);
      nextRef.current += BAR; barRef.current += 1;
    }
  }, [scheduleBar]);

  const start = useCallback(() => {
    const ctx = ensure(); if (!ctx || playingRef.current) return;
    playingRef.current = true;
    nextRef.current = ctx.currentTime + 0.25; barRef.current = 0;
    pump();
    timerRef.current = setInterval(pump, 400);
  }, [ensure, pump]);

  const stop = useCallback(() => { playingRef.current = false; clearInterval(timerRef.current); }, []);

  const chime = useCallback((i) => {
    const ctx = ensure(); if (!ctx) return;
    const t = ctx.currentTime + 0.02;
    note(PENTA[i % PENTA.length] * 2, t, 2.4, 0.16);
    note(PENTA[i % PENTA.length], t + 0.05, 2.0, 0.08);
  }, [ensure, note]);

  const fanfare = useCallback(() => {
    const ctx = ensure(); if (!ctx) return;
    const t = ctx.currentTime + 0.05;
    [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98, 2093].forEach((f, i) => note(f, t + i * 0.11, 2.6, 0.14));
  }, [ensure, note]);

  const toggle = useCallback(() => {
    setOn((v) => {
      const nv = !v; onRef.current = nv;
      const ctx = ctxRef.current; const m = masterRef.current;
      if (ctx && m) m.gain.setTargetAtTime(nv ? 0.8 : 0, ctx.currentTime, 0.05);
      return nv;
    });
  }, []);

  useEffect(() => () => { playingRef.current = false; clearInterval(timerRef.current); if (ctxRef.current) ctxRef.current.close().catch(() => {}); }, []);
  return { ensure, start, stop, chime, fanfare, toggle, on };
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

.d1 {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 30;
  background: radial-gradient(
    120% 90% at 50% 25%,
    #2a1a3a 0%,
    #150d26 52%,
    #07050f 100%
  );
}

.d1-close {
  position: fixed !important;
  top: 20px !important;
  right: 20px !important;
  z-index: 2147483647 !important;
  width: 48px !important;
  height: 48px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  border: 2px solid #f1c978 !important;
  border-radius: 50% !important;
  background: #3b102b !important;
  color: #ffe8b0 !important;
  font-size: 25px !important;
  font-weight: bold !important;
  cursor: pointer !important;
  box-shadow: 0 0 20px rgba(255, 210, 120, .5) !important;
}
.d1-bg{position:absolute;inset:0;z-index:0;pointer-events:none;background:
  radial-gradient(circle at 10% 24%,rgba(255,190,120,.2) 0 6cqw,transparent 7cqw),
  radial-gradient(circle at 92% 18%,rgba(255,160,200,.18) 0 7cqw,transparent 8cqw),
  radial-gradient(circle at 88% 86%,rgba(255,200,120,.16) 0 8cqw,transparent 9cqw),
  radial-gradient(circle at 8% 88%,rgba(255,140,170,.14) 0 7cqw,transparent 8cqw)}
.d1-flake{position:absolute;top:-4%;border-radius:50%;background:#fff;pointer-events:none;animation:d1-fall linear infinite;z-index:1}
@keyframes d1-fall{0%{transform:translate(0,0)}50%{transform:translate(14px,55cqh)}100%{transform:translate(-8px,110cqh)}}
.d1-lights{position:absolute;left:0;right:0;top:0;height:34px;pointer-events:none;z-index:8}
.d1-lb{position:absolute;width:9px;height:12px;border-radius:50% 50% 45% 45%;animation:d1-tw 2.6s ease-in-out infinite}
@keyframes d1-tw{0%,100%{opacity:1}50%{opacity:.35}}
.d1-snd{position:absolute;left:clamp(8px,2cqw,22px);top:clamp(30px,6cqh,52px);z-index:20;width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(246,210,122,.7);background:rgba(0,0,0,.45);color:#f8dd86;cursor:pointer;font-size:16px}
.d1-snd:hover{background:rgba(246,210,122,.25)}.d1-snd:focus-visible{outline:2px solid #fff;outline-offset:2px}

.d1-head{position:relative;z-index:6;flex:none;text-align:center;padding-top:clamp(30px,6cqh,54px);width:100%}
.d1-kick{margin:0;font-size:clamp(10px,min(1.6cqw,2cqh),14px);letter-spacing:.4em;text-transform:uppercase;font-weight:700;color:#f1c978}
.d1-title{margin:.08em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;font-size:clamp(24px,min(5.6cqw,7.2cqh),58px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 rgba(58,0,12,.75)) drop-shadow(0 0 22px rgba(255,200,90,.3))}
.d1-sub{margin:.2em 0 0;min-height:1.3em;font-style:italic;font-weight:600;font-size:clamp(14px,min(2.3cqw,2.9cqh),22px);color:#ffe3ee;text-shadow:0 2px 8px rgba(0,0,0,.6)}
.d1-sub.pulse{animation:d1-pulse 2.4s ease-in-out infinite}
@keyframes d1-pulse{0%,100%{opacity:.65}50%{opacity:1}}

.d1-main{position:relative;z-index:5;flex:1 1 0;min-height:0;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center}
.d1-boxwrap{position:relative;height:100%;max-height:100%;aspect-ratio:400/430;max-width:100%;transition:transform 1.2s cubic-bezier(.3,.9,.3,1),opacity 1s ease,filter 1s ease}
.d1-boxwrap.dim{transform:scale(.7);opacity:.45;filter:blur(2px)}
.d1-svg{display:block;width:100%;height:100%;overflow:visible}
.d1-hit{cursor:pointer;outline:none}
.d1-hit:focus-visible{outline:3px solid #fff;outline-offset:6px;border-radius:14px}
.d1-boxwrap.opened .d1-hit{cursor:default}

/* music box */
.d1-lidclosed{transition:opacity .35s ease .2s}.opened .d1-lidclosed{opacity:0}
.d1-lidopen{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(.04);opacity:0;transition:transform .9s cubic-bezier(.3,1.3,.5,1) .1s,opacity .2s ease .1s}
.opened .d1-lidopen{transform:scaleY(1);opacity:1}
.d1-dome{transform-box:view-box;transform-origin:200px 300px;transform:scale(.05);opacity:0;transition:transform 1.3s cubic-bezier(.3,1.35,.5,1) .8s,opacity .5s ease .8s}
.opened .d1-dome{transform:none;opacity:1}
.d1-tease{animation:d1-tease 2.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
@keyframes d1-tease{0%,70%,100%{transform:translateY(0)}78%{transform:translateY(-3px)}86%{transform:translateY(0)}93%{transform:translateY(-2px)}}
.opened .d1-tease{animation:none}
.d1-key{transform-box:fill-box;transform-origin:50% 50%}
.playing .d1-key{animation:d1-spin 5s linear infinite}
@keyframes d1-spin{to{transform:rotate(360deg)}}
.d1-glint{animation:d1-tw 2.2s ease-in-out infinite}
.d1-couple{transform-box:fill-box;transform-origin:50% 100%;animation:d1-waltz 7s ease-in-out infinite}
@keyframes d1-waltz{0%{transform:translateX(-14px) scaleX(1) rotate(-3deg)}25%{transform:translateX(0) scaleX(.06) rotate(0)}50%{transform:translateX(14px) scaleX(-1) rotate(3deg)}75%{transform:translateX(0) scaleX(-.06) rotate(0)}100%{transform:translateX(-14px) scaleX(1) rotate(-3deg)}}
.d1-dress{transform-box:fill-box;transform-origin:50% 0;animation:d1-flare 1.75s ease-in-out infinite alternate}
@keyframes d1-flare{from{transform:scaleX(.94)}to{transform:scaleX(1.12)}}
.d1-dsnow{animation:d1-dfall linear infinite}
@keyframes d1-dfall{0%{transform:translate(0,-130px)}100%{transform:translate(8px,150px)}}
.d1-heartup{animation:d1-hup 4s ease-in infinite}
@keyframes d1-hup{0%{transform:translateY(0) scale(.6);opacity:0}15%{opacity:.9}100%{transform:translateY(-70px) scale(1.1);opacity:0}}
.d1-next{margin-top:clamp(2px,.8cqh,10px);padding:.5em 1.8em;border:0;border-radius:999px;cursor:pointer;font-family:inherit;font-weight:700;letter-spacing:.04em;font-size:clamp(16px,min(2.5cqw,3.2cqh),22px);color:#4a1420;position:relative;overflow:hidden;
  background:linear-gradient(180deg,#fff3bf,#e8b84a 55%,#c98a1e);box-shadow:0 5px 0 #8a5a12,0 12px 24px rgba(0,0,0,.45),0 0 30px rgba(255,214,120,.35);animation:d1-in .8s cubic-bezier(.2,.9,.3,1) both;transition:transform .15s ease}
.d1-next::after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);animation:d1-sheen 3s ease-in-out infinite}
@keyframes d1-sheen{0%,60%{left:-60%}100%{left:130%}}
@keyframes d1-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.d1-next:hover{transform:translateY(-2px)}.d1-next:active{transform:translateY(3px)}.d1-next:focus-visible{outline:3px solid #fff;outline-offset:3px}

/* letter (explanation) */
.d1-card{position:absolute;z-index:7;left:50%;top:50%;transform:translate(-50%,-50%);width:min(94cqw,720px);max-height:calc(100% - 8px);display:flex;flex-direction:column;border-radius:22px;padding:clamp(5px,1cqw,10px);
  background:linear-gradient(135deg,#fff0a8,#d9a336 25%,#7a4f10 50%,#f1cd6a 75%,#a8721f);box-shadow:0 30px 80px rgba(0,0,0,.65),0 0 60px rgba(255,190,100,.22);animation:d1-card .9s cubic-bezier(.2,.9,.3,1) both}
@keyframes d1-card{from{opacity:0;transform:translate(-50%,-46%) scale(.96)}to{opacity:1;transform:translate(-50%,-50%)}}
.d1-paper{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;border-radius:17px;overflow:hidden;color:#3b2410;
  background:repeating-linear-gradient(180deg,transparent 0 33px,rgba(59,130,180,.12) 33px 34px),radial-gradient(120% 100% at 30% 10%,#fbefd3,#f1dcb0 60%,#e5c98f);box-shadow:inset 0 0 60px rgba(150,100,40,.35)}
.d1-paper::before{content:"";position:absolute;inset:7px;border:1.5px dashed rgba(138,26,46,.45);border-radius:12px;pointer-events:none;z-index:2}
.d1-pbody{position:relative;z-index:1;flex:1;min-height:0;overflow-y:auto;padding:clamp(16px,3.4cqh,32px) clamp(16px,4cqw,44px) clamp(6px,1.4cqh,14px);text-align:center;scrollbar-width:thin;display:flex;flex-direction:column;justify-content:center}
.d1-page{animation:d1-page .6s cubic-bezier(.2,.9,.3,1) both}
@keyframes d1-page{from{opacity:0;transform:translateX(calc(var(--dir,1) * 26px))}to{opacity:1;transform:none}}
.d1-pk{margin:0;font-size:clamp(10px,min(1.6cqw,2cqh),14px);letter-spacing:.36em;text-transform:uppercase;font-weight:700;color:#a8281f}
.d1-pt{margin:.1em 0 0;font-family:'Mountains of Christmas',cursive;font-weight:700;line-height:1.08;font-size:clamp(24px,min(4.8cqw,6.4cqh),44px);color:#8a1a2e}
.d1-rule{width:64px;height:1px;margin:clamp(8px,1.6cqh,14px) auto;background:rgba(138,26,46,.45)}
.d1-p{margin:.7em 0 0;font-size:clamp(15px,min(2.3cqw,3cqh),22px);line-height:1.55;font-style:italic;font-weight:600;color:#4a2a1e}
.d1-nav{position:relative;z-index:3;flex:none;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:clamp(6px,1.4cqh,14px) clamp(14px,3cqw,32px) clamp(10px,2cqh,18px)}
.d1-arrow{flex:none;width:clamp(36px,min(6cqw,7cqh),50px);aspect-ratio:1;border:0;border-radius:50%;cursor:pointer;font-size:clamp(16px,2.6cqw,22px);font-weight:700;color:#5a0f19;background:radial-gradient(circle at 35% 30%,#fff3bf,#e8b84a 60%,#a8721f);box-shadow:0 4px 0 #8a5a12,0 8px 14px rgba(0,0,0,.35)}
.d1-arrow:disabled{opacity:0;pointer-events:none}.d1-arrow:focus-visible{outline:3px solid #2f7fd0;outline-offset:3px}
.d1-dots{display:flex;gap:10px}
.d1-dot{width:12px;aspect-ratio:1;border-radius:50%;border:1.5px solid #a8281f;transition:all .4s cubic-bezier(.3,1.6,.5,1)}
.d1-dot.on{background:radial-gradient(circle at 35% 30%,#ff8a8a,#b3202a);transform:scale(1.35);box-shadow:0 0 10px rgba(217,54,47,.6)}
.d1-cta{flex:1;display:flex;justify-content:center}

/* village */
.d1-vill{position:absolute;left:0;right:0;bottom:0;z-index:3;height:100%;transition:height 1.4s cubic-bezier(.3,.9,.3,1)}
.d1.final .d1-vill{height:34%}
@container d1 (aspect-ratio < 1){.d1.final .d1-vill{height:24%}}
.d1-vsvg{display:block;width:100%;height:100%;overflow:visible}
.d1-wall{transition:fill 1.2s ease}
.d1-win{fill:#14172a;transition:fill 1s ease,filter 1s ease}
.lit .d1-win{fill:#ffd98a;filter:drop-shadow(0 0 6px #ffb347)}
.lit .d1-win.b{fill:#ffb869}
.d1-glow{opacity:0;transition:opacity 1.2s ease}.lit .d1-glow{opacity:1}
.d1-lamp{cursor:pointer;outline:none}
.d1-lamp:focus-visible .d1-lampbody{stroke:#fff;stroke-width:3}
.d1-ring{transform-box:fill-box;transform-origin:50% 50%;animation:d1-ring 2s ease-out infinite}
@keyframes d1-ring{0%{transform:scale(.5);opacity:.9}100%{transform:scale(2.1);opacity:0}}
.d1-lampglass{fill:#4a4a5c;transition:fill .6s ease,filter .6s ease}
.lit .d1-lampglass{fill:#ffe08a;filter:drop-shadow(0 0 8px #ffd45a)}
.d1-smoke{opacity:0;animation:d1-smoke 5s ease-out infinite}
.lit .d1-smoke{opacity:1}
@keyframes d1-smoke{0%{transform:translate(0,0) scale(.5);opacity:0}20%{opacity:.7}100%{transform:translate(-14px,-60px) scale(1.7);opacity:0}}
.d1-tl{fill:#2a2a3a;transition:fill .8s ease,filter .8s ease}
.d1-tl.on{filter:drop-shadow(0 0 5px currentColor)}
.d1-spark{transform-box:fill-box;transform-origin:50% 50%;animation:d1-spk 1.8s cubic-bezier(.15,.7,.3,1) both}
@keyframes d1-spk{0%{opacity:1;transform:translate(0,0) scale(.3)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.4) rotate(120deg)}}
.d1-count{position:relative;z-index:6;display:flex;align-items:center;justify-content:center;gap:.8em;flex-wrap:wrap;margin-top:clamp(6px,1.4cqh,14px);font-weight:700;font-size:clamp(12px,min(1.9cqw,2.4cqh),17px);letter-spacing:.14em;text-transform:uppercase;color:#ffeab1}
.d1-lampicons{display:flex;gap:6px}
.d1-li{width:clamp(14px,2.2cqw,20px);aspect-ratio:.7;border-radius:6px 6px 3px 3px;border:1.5px solid rgba(246,210,122,.6);background:transparent;transition:all .5s cubic-bezier(.3,1.6,.5,1)}
.d1-li.on{background:radial-gradient(circle at 50% 35%,#fff3bf,#ffb347);box-shadow:0 0 12px 3px rgba(255,200,90,.7);transform:scale(1.15)}

/* final */
.d1-final{position:relative;z-index:6;flex:1 1 0;min-height:0;width:min(100%,1100px);display:grid;align-items:center;justify-items:center;gap:clamp(8px,2cqw,28px);padding:clamp(6px,1.4cqh,16px) clamp(10px,3cqw,30px) 0;
  grid-template-columns:minmax(0,.9fr) minmax(0,1.15fr) minmax(0,.9fr);margin-bottom:clamp(60px,31cqh,300px);animation:d1-in 1s ease both}
@container d1 (aspect-ratio < 1){.d1-final{grid-template-columns:1fr 1fr;grid-template-rows:auto auto;margin-bottom:clamp(40px,22cqh,200px)}.d1-msg{grid-column:1 / -1;grid-row:2}.d1-final > :nth-child(1){grid-row:1;grid-column:1}.d1-final > :nth-child(3){grid-row:1;grid-column:2}}
.d1-polaroid{position:relative;width:min(100%,calc(46cqh * .86),300px);padding:clamp(6px,1.2cqw,12px) clamp(6px,1.2cqw,12px) clamp(24px,4.2cqw,40px);background:#fff8ec;border-radius:4px;box-shadow:0 18px 40px rgba(0,0,0,.55);transform:rotate(-3deg);animation:d1-sw 5s ease-in-out infinite alternate}
@keyframes d1-sw{from{transform:rotate(-4deg)}to{transform:rotate(-1.5deg)}}
.d1-polaroid::before{content:"";position:absolute;top:-12px;left:50%;width:84px;height:24px;margin-left:-42px;background:repeating-linear-gradient(45deg,rgba(217,54,47,.85) 0 8px,rgba(255,246,232,.85) 8px 16px);transform:rotate(2deg);box-shadow:0 2px 6px rgba(0,0,0,.35)}
.d1-pic{width:100%;aspect-ratio:1;object-fit:cover;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(160deg,#6a2540,#243b66);color:#ffe9b8;font-style:italic;font-size:clamp(12px,2cqw,16px)}
.d1-pic b{display:block;font-size:2.6em;font-style:normal}
.d1-cap{position:absolute;left:0;right:0;bottom:clamp(4px,1cqw,10px);text-align:center;font-family:'Caveat',cursive;font-weight:700;font-size:clamp(18px,3cqw,28px);color:#8a1a2e}
.d1-msg{position:relative;width:min(100%,520px);border-radius:18px;padding:clamp(12px,2.6cqh,26px) clamp(14px,2.6cqw,28px);text-align:center;color:#3b2410;
  background:radial-gradient(120% 100% at 30% 10%,#fff6ee,#fbe6d8 60%,#f1cfc0);box-shadow:inset 0 0 50px rgba(190,100,110,.25),0 22px 50px rgba(0,0,0,.55),0 0 0 3px #d9a336,0 0 0 6px #7a4f10}
.d1-msg::before{content:"";position:absolute;inset:6px;border:1.5px dashed rgba(178,40,90,.4);border-radius:12px;pointer-events:none}
.d1-msg h2{margin:.1em 0 0;font-family:'Mountains of Christmas',cursive;font-weight:700;line-height:1.05;font-size:clamp(24px,min(3.8cqw,6cqh),42px);color:#8a1a2e}
.d1-msg p{margin:.6em 0 0;font-size:clamp(14px,min(1.9cqw,2.9cqh),21px);line-height:1.5;font-style:italic;font-weight:600;color:#4a2a2a}
.d1-plush{position:relative;width:min(100%,calc(46cqh * .92),340px);animation:d1-bob 4s ease-in-out infinite alternate}
@keyframes d1-bob{from{transform:translateY(0) rotate(-1deg)}to{transform:translateY(-6px) rotate(1deg)}}
.d1-plush svg,.d1-plush img{display:block;width:100%;height:auto;filter:drop-shadow(0 14px 16px rgba(0,0,0,.5))}
.d1-sign{margin:-4px auto 0;width:78%;padding:.5em .6em;border-radius:8px;text-align:center;font-family:'Caveat',cursive;font-weight:700;line-height:1.1;font-size:clamp(14px,2.2cqw,22px);color:#fff6e4;background:#1f4d3a;box-shadow:0 0 0 4px #a86a30,0 8px 14px rgba(0,0,0,.5);transform:rotate(-2deg)}
.d1-replay{position:absolute;z-index:9;left:50%;bottom:clamp(6px,1.6cqh,16px);transform:translateX(-50%);padding:.25em 1.2em;border-radius:999px;border:1.5px solid rgba(241,201,120,.6);background:rgba(0,0,0,.45);color:#f1c978;font-family:inherit;font-weight:700;font-style:italic;font-size:clamp(13px,2cqw,17px);cursor:pointer}
.d1-replay:hover{background:rgba(241,201,120,.2)}.d1-replay:focus-visible{outline:2px solid #fff;outline-offset:3px}
.d1-conf{position:absolute;top:-6%;pointer-events:none;animation:d1-conf linear infinite;z-index:9}
@keyframes d1-conf{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(115cqh) rotate(720deg);opacity:.9}}

@media (prefers-reduced-motion: reduce){
  .d1-flake,.d1-lb,.d1-tease,.playing .d1-key,.d1-glint,.d1-couple,.d1-dress,.d1-dsnow,.d1-heartup,.d1-next::after,.d1-ring,.d1-smoke,.d1-polaroid,.d1-plush,.d1-conf,.d1-spark,.d1-sub.pulse{animation:none !important}
  .d1-boxwrap,.d1-lidopen,.d1-dome,.d1-vill,.d1-lidclosed{transition-duration:.01s !important;transition-delay:0s !important}
  .d1-card,.d1-page,.d1-final,.d1-next{animation-duration:.01s !important}
}
`;

/* ------------------------------------------------------------------ */
/*  Music box + miniature scene                                        */
/* ------------------------------------------------------------------ */

function Figure({ kind }) {
  // origin = feet, y up is negative
  if (kind === "man") {
    return (
      <g>
        <rect x="-10" y="-40" width="8" height="40" rx="3" fill="#1b2340" /><rect x="2" y="-40" width="8" height="40" rx="3" fill="#1b2340" />
        <rect x="-11" y="-3" width="10" height="4" rx="2" fill="#0d1020" /><rect x="1" y="-3" width="10" height="4" rx="2" fill="#0d1020" />
        <path d="M-16 -44L-13 -80Q0 -88 13 -80L16 -44Z" fill="#2f3f78" stroke="#2f3f78" strokeWidth="3" strokeLinejoin="round" />
        <rect x="-4" y="-80" width="8" height="30" fill="#f2f2ee" opacity=".9" />
        <path d="M-9 -82Q0 -74 9 -82L9 -76Q0 -68 -9 -76Z" fill="#c8202e" />
        <path d="M6 -78L26 -66" stroke="#2f3f78" strokeWidth="7" strokeLinecap="round" /><circle cx="27" cy="-66" r="4" fill="#f2c9a0" />
        <circle cx="0" cy="-92" r="9" fill="#f2c9a0" /><path d="M-9.5 -94Q-8 -104 0 -103Q8 -104 9.5 -94Q4 -99 -9.5 -94Z" fill="#3b2417" />
      </g>
    );
  }
  return (
    <g>
      <g className="d1-dress">
        <path d="M-9 -62Q-26 -40 -26 -22L26 -22Q26 -40 9 -62Z" fill="#c8202e" stroke="#c8202e" strokeWidth="3" strokeLinejoin="round" />
        <path d="M-26 -22L26 -22" stroke="#fff6e8" strokeWidth="3.5" /><path d="M-9 -60L9 -60" stroke="#f2c24a" strokeWidth="4" />
        <path d="M-12 -40Q0 -34 12 -40" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
      </g>
      <rect x="-8" y="-22" width="5" height="22" rx="2" fill="#f5e0c8" /><rect x="3" y="-22" width="5" height="22" rx="2" fill="#f5e0c8" />
      <rect x="-9" y="-3" width="8" height="4" rx="2" fill="#7a1220" /><rect x="2" y="-3" width="8" height="4" rx="2" fill="#7a1220" />
      <path d="M-9 -62L-7 -78Q0 -82 7 -78L9 -62Z" fill="#c8202e" />
      <path d="M-7 -66L-26 -66" stroke="#f2c9a0" strokeWidth="6" strokeLinecap="round" /><circle cx="-27" cy="-66" r="4" fill="#f2c9a0" />
      <circle cx="0" cy="-88" r="8.5" fill="#f2c9a0" /><path d="M-9 -90Q-9 -100 0 -99Q9 -100 9 -90Q4 -95 -9 -90Z" fill="#5a2a1a" /><circle cx="-1" cy="-99" r="5" fill="#5a2a1a" />
    </g>
  );
}

function MusicBoxScene({ opened, playing, onOpen, snow }) {
  return (
    <svg className="d1-svg" viewBox="0 0 400 430" role="img" aria-label="Caja de música">
      <defs>
        <linearGradient id="d1Wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a4a22" /><stop offset=".5" stopColor="#6a3416" /><stop offset="1" stopColor="#3f1d0c" /></linearGradient>
        <linearGradient id="d1Gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".5" stopColor="#e8b84a" /><stop offset="1" stopColor="#a8721f" /></linearGradient>
        <linearGradient id="d1Velvet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a3121f" /><stop offset="1" stopColor="#4a0710" /></linearGradient>
        <radialGradient id="d1Glass" cx="35%" cy="25%" r="85%"><stop offset="0" stopColor="#fff" stopOpacity=".5" /><stop offset=".4" stopColor="#bcd6ff" stopOpacity=".12" /><stop offset="1" stopColor="#7aa0ff" stopOpacity=".18" /></radialGradient>
        <radialGradient id="d1Inside" cx="50%" cy="85%" r="95%"><stop offset="0" stopColor="#7a3a6a" /><stop offset=".55" stopColor="#2c2050" /><stop offset="1" stopColor="#120c2a" /></radialGradient>
        <radialGradient id="d1Halo"><stop offset="0" stopColor="#ffd45a" stopOpacity=".9" /><stop offset="1" stopColor="#ffd45a" stopOpacity="0" /></radialGradient>
        <linearGradient id="d1Snowfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#b8c8ec" /></linearGradient>
        <clipPath id="d1Clip"><circle cx="200" cy="185" r="112" /></clipPath>
        <linearGradient id="d1Lg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ffe9a8" stopOpacity=".5" /><stop offset="1" stopColor="#ffe9a8" stopOpacity="0" /></linearGradient>
      </defs>

      {/* soft light on the table */}
      <ellipse cx="200" cy="418" rx="190" ry="16" fill="#000" opacity=".45" />
      {opened && <ellipse cx="200" cy="300" rx="150" ry="40" fill="url(#d1Halo)" opacity=".45" />}

      {/* open lid (behind) */}
      <g className="d1-lidopen" style={{ transformOrigin: "200px 300px" }}>
        <rect x="76" y="188" width="248" height="112" rx="10" fill="url(#d1Wood)" stroke="url(#d1Gold)" strokeWidth="5" />
        <rect x="90" y="200" width="220" height="92" rx="6" fill="url(#d1Velvet)" />
        <rect x="96" y="206" width="208" height="80" rx="4" fill="none" stroke="#e8b84a" strokeWidth="1.5" strokeDasharray="4 4" opacity=".8" />
        <path d="M110 215Q200 195 290 215" fill="none" stroke="#fff" strokeOpacity=".15" strokeWidth="8" strokeLinecap="round" />
      </g>

      {/* miniature scene in a dome, rising from the box */}
      <g className="d1-dome">
        <circle cx="200" cy="185" r="112" fill="url(#d1Inside)" />
        <g clipPath="url(#d1Clip)">
          {[[60, 70], [110, 40], [290, 60], [330, 100], [160, 90], [250, 120]].map(([x, y], i) => <circle key={i} className="d1-glint" cx={x + 20} cy={y + 40} r="1.4" fill="#fff6d8" style={{ animationDelay: `${i * 0.4}s` }} />)}
          <circle cx="278" cy="96" r="15" fill="#fff6dc" opacity=".95" /><circle cx="278" cy="96" r="30" fill="url(#d1Halo)" opacity=".5" />
          {/* snowy floor + tree + lamp */}
          <ellipse cx="200" cy="292" rx="150" ry="52" fill="url(#d1Snowfloor)" />
          <g transform="translate(116 268)">
            <path d="M0 -62L16 -34H8L22 -12H10L26 8H-26L-10 -12H-22L-8 -34H-16Z" fill="#1f7a45" /><path d="M0 -62L8 -48L0 -45L-8 -48Z" fill="#fff" opacity=".85" />
            {[[-6, -34, "#ff5a5a"], [8, -18, "#ffd45a"], [-12, -6, "#7dd3fc"], [4, -46, "#ff9ad5"]].map(([x, y, c], i) => <circle key={i} className="d1-glint" cx={x} cy={y} r="2.4" fill={c} style={{ animationDelay: `${i * 0.3}s` }} />)}
          </g>
          <g transform="translate(290 268)">
            <path d="M0 0V-62" stroke="#2a2438" strokeWidth="4" strokeLinecap="round" /><circle cx="0" cy="-68" r="26" fill="url(#d1Halo)" opacity=".8" /><rect x="-6" y="-78" width="12" height="16" rx="3" fill="#ffd45a" stroke="#a8721f" strokeWidth="1.6" />
          </g>
          {/* warm spot */}
          <ellipse cx="200" cy="268" rx="70" ry="14" fill="#ffd98a" opacity=".28" />
          {/* the couple */}
          <g transform="translate(200 270)"><g className="d1-couple"><g transform="translate(-16 0)"><Figure kind="man" /></g><g transform="translate(16 0)"><Figure kind="woman" /></g></g></g>
          {[0, 1.3, 2.6].map((d, i) => <path key={i} className="d1-heartup" d="M200 196C190 188 188 182 193 179C197 177 200 180 200 183C200 180 203 177 207 179C212 182 210 188 200 196Z" fill="#ff8fa3" style={{ animationDelay: `${d}s`, transformOrigin: "200px 190px" }} />)}
          {snow.map((f, i) => <circle key={i} className="d1-dsnow" cx={f.x} cy={f.y} r={f.r} fill="#fff" opacity={f.o} style={{ animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} />)}
        </g>
        <circle cx="200" cy="185" r="112" fill="url(#d1Glass)" /><circle cx="200" cy="185" r="112" fill="none" stroke="#e8f0ff" strokeOpacity=".5" strokeWidth="2.5" />
        <path d="M130 120Q150 88 190 82" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="200" cy="298" rx="124" ry="14" fill="url(#d1Gold)" stroke="#8a5a12" strokeWidth="2" />
      </g>

      {/* the box (front) */}
      <g className={`d1-hit ${opened ? "" : "d1-tease"}`} role={opened ? undefined : "button"} tabIndex={opened ? -1 : 0} aria-label={opened ? undefined : "Abrir la caja de música"}
        onClick={opened ? undefined : onOpen} onKeyDown={opened ? undefined : (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}>
        <rect x="62" y="296" width="276" height="112" rx="12" fill="url(#d1Wood)" stroke="url(#d1Gold)" strokeWidth="5" />
        <rect x="80" y="312" width="240" height="80" rx="8" fill="none" stroke="#e8b84a" strokeWidth="2" />
        <path d="M96 352Q116 322 140 342Q160 360 184 342M216 342Q240 360 260 342Q284 322 304 352" fill="none" stroke="url(#d1Gold)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="200" cy="344" r="17" fill="#6a0f1c" stroke="url(#d1Gold)" strokeWidth="3.5" />
        <path d="M200 332l3.4 7 7.6 1-5.5 5.4 1.3 7.6-6.8-3.6-6.8 3.6 1.3-7.6-5.5-5.4 7.6-1z" fill="#f8dd86" />
        {[96, 304].map((x) => <circle key={x} cx={x} cy="396" r="3.4" fill="url(#d1Gold)" />)}
        <rect x="58" y="402" width="30" height="12" rx="4" fill="#3f1d0c" /><rect x="312" y="402" width="30" height="12" rx="4" fill="#3f1d0c" />
        {/* wind-up key on the side */}
        <g transform="translate(346 350)"><path d="M0 0H20" stroke="url(#d1Gold)" strokeWidth="5" strokeLinecap="round" /><g className="d1-key" transform="translate(26 0)"><ellipse cx="0" cy="-12" rx="9" ry="12" fill="url(#d1Gold)" /><ellipse cx="0" cy="12" rx="9" ry="12" fill="url(#d1Gold)" /><rect x="-4" y="-4" width="8" height="8" fill="#a8721f" /></g></g>
        {/* closed lid */}
        <g className="d1-lidclosed">
          <path d="M62 296Q62 250 110 250H290Q338 250 338 296Z" fill="url(#d1Wood)" stroke="url(#d1Gold)" strokeWidth="5" strokeLinejoin="round" />
          <path d="M84 290Q84 266 116 266H284Q316 266 316 290" fill="none" stroke="#e8b84a" strokeWidth="2" />
          <circle cx="200" cy="278" r="9" fill="url(#d1Gold)" stroke="#8a5a12" strokeWidth="2" /><path d="M72 262Q130 246 200 246" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="5" strokeLinecap="round" />
          {[110, 290].map((x) => <rect key={x} x={x - 11} y="288" width="22" height="9" rx="3" fill="url(#d1Gold)" stroke="#8a5a12" />)}
        </g>
        {!opened && <rect x="40" y="236" width="320" height="190" fill="transparent" />}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Village (interactive lamps)                                        */
/* ------------------------------------------------------------------ */

function House({ h, lit, i }) {
  const base = 330; const top = base - h.h; const rx = h.x - h.w / 2;
  return (
    <g className={lit ? "lit" : ""}>
      <ellipse className="d1-glow" cx={h.x} cy={base - 20} rx={h.w * 0.95} ry="64" fill="url(#d1Warm)" />
      <rect className="d1-wall" x={rx} y={top} width={h.w} height={h.h} fill={lit ? h.wall : "#1c2340"} />
      {Array.from({ length: Math.floor(h.w / 12) }, (_, k) => <path key={k} d={`M${rx + 8 + k * 12} ${top}V${base}`} stroke="#000" strokeOpacity=".15" />)}
      <path d={`M${rx - 8} ${top + 2}L${h.x} ${top - 38}L${rx + h.w + 8} ${top + 2}Z`} fill={lit ? "#4a2528" : "#14182e"} style={{ transition: "fill 1.2s ease" }} />
      <path d={`M${rx - 12} ${top + 6}L${h.x} ${top - 44}L${rx + h.w + 12} ${top + 6}L${rx + h.w} ${top + 10}Q${rx + h.w * 0.8} ${top + 18} ${rx + h.w * 0.66} ${top + 9}Q${rx + h.w * 0.5} ${top + 19} ${rx + h.w * 0.34} ${top + 9}Q${rx + h.w * 0.2} ${top + 18} ${rx + 6} ${top + 10}Z`} fill={h.roof} stroke="#cfd9f5" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x={rx + h.w * 0.62} y={top - 40} width="12" height="26" fill={lit ? "#7a2a2a" : "#1c2340"} style={{ transition: "fill 1.2s ease" }} />
      {[0, 1.7].map((d, k) => <circle key={k} className="d1-smoke" cx={rx + h.w * 0.62 + 6} cy={top - 44} r="6" fill="#e5ebff" style={{ animationDelay: `${d + i * 0.4}s` }} />)}
      <rect className="d1-win" x={rx + 10} y={top + 20} width="20" height="22" rx="2" />
      <rect className="d1-win b" x={rx + h.w - 30} y={top + 20} width="20" height="22" rx="2" />
      <path d={`M${rx + 20} ${top + 20}V${top + 42}M${rx + 10} ${top + 31}H${rx + 30}M${rx + h.w - 20} ${top + 20}V${top + 42}M${rx + h.w - 30} ${top + 31}H${rx + h.w - 10}`} stroke="#0a0d1c" strokeWidth="1.6" />
      <path d={`M${h.x - 9} ${base}V${base - 28}Q${h.x - 9} ${base - 38} ${h.x} ${base - 38}Q${h.x + 9} ${base - 38} ${h.x + 9} ${base - 28}V${base}Z`} fill={lit ? "#3a1c12" : "#0e1122"} style={{ transition: "fill 1s ease" }} />
      <circle cx={h.x} cy={base - 44} r="7" fill="none" stroke={lit ? "#2f9a52" : "#233044"} strokeWidth="3.5" style={{ transition: "stroke 1s ease" }} />
    </g>
  );
}

function Village({ lit, onLamp, interactive, allLit, sparks, stars }) {
  const litCount = lit.filter(Boolean).length;
  const treeOn = (k) => (lit[2] && k % 2 === 0) || (lit[3] && k % 2 === 1);
  const tcols = ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"];
  const tl = [[-10, -150], [12, -128], [-20, -108], [18, -90], [-28, -70], [24, -52], [-34, -34], [30, -20], [0, -118], [-6, -60]];
  return (
    <svg className="d1-vsvg" viewBox="0 0 800 420" preserveAspectRatio="xMidYMax meet" aria-hidden={interactive ? undefined : true}>
      <defs>
        <linearGradient id="d1VSky" gradientUnits="userSpaceOnUse" x1="0" y1="-1400" x2="0" y2="340"><stop offset="0" stopColor="#07050f" /><stop offset=".7" stopColor="#1a1240" /><stop offset="1" stopColor="#4a2a5a" /></linearGradient>
        <radialGradient id="d1Warm"><stop offset="0" stopColor="#ffb347" stopOpacity=".6" /><stop offset="1" stopColor="#ffb347" stopOpacity="0" /></radialGradient>
        <linearGradient id="d1VGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f8ff" /><stop offset="1" stopColor="#9fb0dc" /></linearGradient>
        <linearGradient id="d1VHill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9d6f5" /><stop offset="1" stopColor="#5f74a8" /></linearGradient>
        <linearGradient id="d1Leaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f9a52" /><stop offset="1" stopColor="#0f5a36" /></linearGradient>
        <filter id="d1VBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>
      {/* sky: extra wide so the letterbox never shows */}
      <rect x="-2400" y="-1400" width="5600" height="1740" fill="url(#d1VSky)" />
      {stars.map((s, i) => <circle key={i} className="d1-glint" cx={s.x} cy={s.y} r={s.r} fill="#fff6d8" style={{ animationDelay: `${s.d}s`, animationDuration: `${2.4 + (i % 4) * 0.7}s` }} />)}
      <circle cx="690" cy="62" r="46" fill="#fff6dc" opacity=".12" /><circle cx="690" cy="62" r="22" fill="#fff6dc" />
      <path d="M-2400 250L-40 190L60 232L150 170L240 236L330 196L420 240L520 180L620 232L720 176L840 236L2400 220V340H-2400Z" fill="#1b1838" />
      <path d="M-2400 300C-300 280 100 292 400 284C600 278 700 292 2400 280V350H-2400Z" fill="url(#d1VHill)" opacity=".7" />
      {/* ground */}
      <rect x="-2400" y="322" width="5600" height="320" fill="url(#d1VGround)" />
      <path d="M-2400 322H3200" stroke="#fff" strokeWidth="3" opacity=".7" />
      <ellipse cx="400" cy="334" rx="380" ry="10" fill="#0a0820" opacity=".3" filter="url(#d1VBlur)" />

      {HOUSES.map((h, i) => <House key={i} h={h} i={i} lit={lit[h.lamp]} />)}

      {/* the Christmas tree in the middle */}
      <g transform="translate(400 330)">
        <rect x="-7" y="-10" width="14" height="14" fill="#5a3418" />
        <path d="M0 -176L26 -134H12L38 -96H18L48 -56H22L58 -14H-58L-22 -56H-48L-18 -96H-38L-12 -134H-26Z" fill="url(#d1Leaf)" stroke="#0a3b23" strokeWidth="1.5" strokeLinejoin="round" opacity={lit[2] || lit[3] ? 1 : 0.55} style={{ transition: "opacity 1s ease" }} />
        {tl.map(([x, y], k) => <circle key={k} className={`d1-tl ${treeOn(k) ? "on" : ""}`} cx={x} cy={y} r="3.6" style={{ fill: treeOn(k) ? tcols[k % 5] : "#2a2a3a", color: tcols[k % 5] }} />)}
        <path d="M0 -196L5 -184L18 -184L8 -176L12 -163L0 -171L-12 -163L-8 -176L-18 -184L-5 -184Z" fill={allLit ? "#ffd45a" : "#3a3a4a"} style={{ transition: "fill 1s ease", filter: allLit ? "drop-shadow(0 0 10px #ffd45a)" : "none" }} />
      </g>

      {/* lamps */}
      {LAMPS.map((x, i) => {
        const on = lit[i];
        return (
          <g key={i} className={`d1-lamp ${on ? "lit" : ""}`} role={interactive ? "button" : undefined} tabIndex={interactive && !on ? 0 : -1}
            aria-label={`Lámpara ${i + 1}${on ? " (encendida)" : ""}`} onClick={() => interactive && !on && onLamp(i)}
            onKeyDown={(e) => { if (interactive && !on && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onLamp(i); } }}>
            <circle className="d1-glow" cx={x} cy="262" r="86" fill="url(#d1Warm)" />
            <rect x={x - 26} y="196" width="52" height="136" fill="transparent" />
            <path className="d1d-pole" d={`M${x} 332V232`} stroke="#2a2438" strokeWidth="6" strokeLinecap="round" />
            <path d={`M${x - 9} 332H${x + 9}`} stroke="#2a2438" strokeWidth="6" strokeLinecap="round" />
            <path d={`M${x - 11} 226H${x + 11}L${x + 7} 214H${x - 7}Z`} fill="#2a2438" />
            <rect className="d1-lampglass d1-lampbody" x={x - 9} y="226" width="18" height="24" rx="4" stroke="#a8721f" strokeWidth="2" />
            <path d={`M${x - 13} 252H${x + 13}L${x + 9} 258H${x - 9}Z`} fill="#2a2438" />
            {on && <ellipse cx={x} cy="238" rx="3.5" ry="6" fill="#fff6c8" />}
            {interactive && !on && <circle className="d1-ring" cx={x} cy="238" r="16" fill="none" stroke="#ffd45a" strokeWidth="2.5" style={{ animationDelay: `${i * 0.3}s` }} />}
          </g>
        );
      })}

      {/* sparks when the village is lit */}
      {sparks.map((s) => (
        <path key={s.id} className="d1-spark" d={`M${s.x} ${s.y - s.s}L${s.x + s.s * 0.3} ${s.y - s.s * 0.3}L${s.x + s.s} ${s.y}L${s.x + s.s * 0.3} ${s.y + s.s * 0.3}L${s.x} ${s.y + s.s}L${s.x - s.s * 0.3} ${s.y + s.s * 0.3}L${s.x - s.s} ${s.y}L${s.x - s.s * 0.3} ${s.y - s.s * 0.3}Z`} fill="#fff0b0" style={{ "--dx": `${s.dx}px`, "--dy": `${s.dy}px`, animationDelay: `${s.d}s`, filter: "drop-shadow(0 0 4px #ffd45a)" }} />
      ))}
      {litCount === 0 && null}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Plush (original teddy bear) holding the sign                       */
/* ------------------------------------------------------------------ */

function Teddy() {
  return (
    <svg viewBox="0 0 300 340" role="img" aria-label="Peluche con una pancarta">
      <defs>
        <radialGradient id="d1Fur" cx="40%" cy="30%" r="80%"><stop offset="0" stopColor="#e8b57a" /><stop offset="1" stopColor="#b9783a" /></radialGradient>
        <linearGradient id="d1Board" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#26604a" /><stop offset="1" stopColor="#143d2e" /></linearGradient>
      </defs>
      <ellipse cx="150" cy="324" rx="108" ry="12" fill="#000" opacity=".4" />
      {/* body + legs */}
      <ellipse cx="150" cy="248" rx="82" ry="78" fill="url(#d1Fur)" />
      <ellipse cx="96" cy="304" rx="40" ry="26" fill="url(#d1Fur)" /><ellipse cx="204" cy="304" rx="40" ry="26" fill="url(#d1Fur)" />
      <ellipse cx="90" cy="306" rx="20" ry="13" fill="#f3d9b1" /><ellipse cx="210" cy="306" rx="20" ry="13" fill="#f3d9b1" />
      {/* head */}
      <circle cx="98" cy="70" r="25" fill="url(#d1Fur)" /><circle cx="202" cy="70" r="25" fill="url(#d1Fur)" />
      <circle cx="98" cy="72" r="13" fill="#f2b3a0" /><circle cx="202" cy="72" r="13" fill="#f2b3a0" />
      <circle cx="150" cy="120" r="66" fill="url(#d1Fur)" />
      <ellipse cx="150" cy="142" rx="31" ry="25" fill="#f3d9b1" />
      <path d="M141 130Q150 124 159 130Q158 140 150 142Q142 140 141 130Z" fill="#4a2a1a" />
      <path d="M150 142V150M150 150Q140 158 132 150M150 150Q160 158 168 150" fill="none" stroke="#4a2a1a" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="124" cy="108" r="8" fill="#2a1710" /><circle cx="176" cy="108" r="8" fill="#2a1710" /><circle cx="121.5" cy="105" r="2.8" fill="#fff" /><circle cx="173.5" cy="105" r="2.8" fill="#fff" />
      <circle cx="102" cy="134" r="10" fill="#f2848f" opacity=".5" /><circle cx="198" cy="134" r="10" fill="#f2848f" opacity=".5" />
      {/* santa hat */}
      <path d="M92 74Q96 24 160 20Q206 20 214 40Q196 38 190 76Z" fill="#d9262f" stroke="#a3121f" strokeWidth="2" strokeLinejoin="round" />
      <path d="M100 66Q112 36 156 30" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="5" strokeLinecap="round" />
      <rect x="84" y="62" width="118" height="22" rx="11" fill="#fff6e8" stroke="#e8dcc4" strokeWidth="2" />
      <circle cx="216" cy="40" r="13" fill="#fff6e8" stroke="#e8dcc4" strokeWidth="2" />
      {/* scarf */}
      <path d="M86 180Q150 206 214 180L210 200Q150 224 90 200Z" fill="#c8202e" />
      {[104, 128, 152, 176, 198].map((x, i) => <path key={x} d={`M${x} ${188 + (i === 2 ? 8 : i % 2 ? 6 : 3)}l6 18`} stroke="#fff6e8" strokeWidth="5" strokeLinecap="round" />)}
      {/* sign */}
      <rect x="58" y="206" width="184" height="104" rx="9" fill="url(#d1Board)" stroke="#a86a30" strokeWidth="7" />
      <rect x="66" y="214" width="168" height="88" rx="5" fill="none" stroke="#fff6e4" strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="4 4" />
      <text textAnchor="middle" fontFamily="'Caveat',cursive" fontWeight="700" fill="#fff6e4">
        {TEXTS.sign.map((l, i) => <tspan key={i} x="150" y={236 + i * 20} fontSize={i < 2 ? 19 : 16.5} fill={i < 2 ? "#ffe08a" : "#fff6e4"}>{l}</tspan>)}
      </text>
      <path d="M74 290l3 5l5 .6l-3.8 3.4l1 5l-4.2-2.6l-4.2 2.6l1-5l-3.8-3.4l5-.6z" fill="#ff8fa3" transform="scale(.7) translate(30 124)" />
      {/* paws holding the sign */}
      <circle cx="62" cy="208" r="19" fill="url(#d1Fur)" /><circle cx="238" cy="208" r="19" fill="url(#d1Fur)" />
      <ellipse cx="62" cy="212" rx="8" ry="6" fill="#f3d9b1" /><ellipse cx="238" cy="212" rx="8" ry="6" fill="#f3d9b1" />
      <path d="M62 190Q46 160 78 150" fill="none" stroke="#b9783a" strokeWidth="0" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function DayOneMusicBox({ onComplete, onClose }) {
  const done = useMemo(readDone, []);
  const [stage, setStage] = useState(done ? "final" : "box"); // box → dance → explain → village → final
  const [opened, setOpened] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [lit, setLit] = useState(() => (done ? LAMPS.map(() => true) : LAMPS.map(() => false)));
  const [sparks, setSparks] = useState([]);
  const music = useMusicBox();
  const timers = useRef([]);
  const after = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); return id; };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const litCount = lit.filter(Boolean).length;
  const allLit = litCount === LAMPS.length;
  const [celebrated, setCelebrated] = useState(done);

  const openBox = () => {
    if (opened) return;
    setOpened(true);
    music.ensure();
    music.start();
    after(() => setStage("dance"), 400);
    after(() => setCanNext(true), 6500);
  };

  const lightLamp = (i) => {
    if (lit[i]) return;
    music.chime(litCount);
    setLit((l) => l.map((v, k) => (k === i ? true : v)));
  };

  // when the last lamp is lit: celebration
  useEffect(() => {
    if (stage !== "village" || !allLit || celebrated) return;
    setCelebrated(true);
    music.fanfare();
    const r = rng(11);
    setSparks(Array.from({ length: 26 }, (_, i) => { const a = -Math.PI / 2 + (r() - 0.5) * Math.PI * 1.7; const d = 60 + r() * 170; return { id: i, x: 150 + r() * 500, y: 150 + r() * 80, dx: Math.cos(a) * d, dy: Math.sin(a) * d, s: 5 + r() * 7, d: r() * 0.6 }; }));
  }, [stage, allLit, celebrated]); // eslint-disable-line react-hooks/exhaustive-deps

  // reaching the final scene = day completed
  useEffect(() => {
    if (stage === "final") { writeDone(); if (!done && onComplete) onComplete(); }
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const goExplain = () => { setStage("explain"); setPage(0); setDir(1); };
  const nextPage = () => { setDir(1); if (page < TEXTS.explain.length - 1) setPage((p) => p + 1); else setStage("village"); };
  const prevPage = () => { setDir(-1); if (page > 0) setPage((p) => p - 1); else setStage("dance"); };

  const replay = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    music.stop();
    setOpened(false); setCanNext(false); setPage(0); setSparks([]); setCelebrated(false);
    setLit(LAMPS.map(() => false)); setStage("box");
  };

  const flakes = useMemo(() => { const r = rng(5); return Array.from({ length: 30 }, (_, i) => ({ id: i, left: r() * 100, size: r() * 4 + 2, dur: r() * 7 + 9, delay: -r() * 14, o: 0.3 + r() * 0.5 })); }, []);
  const bulbs = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ id: i, x: (i + 0.5) * (100 / 22), y: 8 + Math.abs(Math.sin(i * 0.8)) * 10, c: ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"][i % 5] })), []);
  const stars = useMemo(() => { const r = rng(21); return Array.from({ length: 80 }, () => ({ x: -300 + r() * 1400, y: -200 + r() * 420, r: 0.5 + r() * 1.3, d: r() * 3 })); }, []);
  const dsnow = useMemo(() => { const r = rng(3); return Array.from({ length: 34 }, () => ({ x: 90 + r() * 220, y: 70 + r() * 30, r: 1 + r() * 1.8, o: 0.5 + r() * 0.5, dur: 5 + r() * 5, delay: -r() * 10 })); }, []);
  const confetti = useMemo(() => { const r = rng(9); return Array.from({ length: 30 }, (_, i) => ({ id: i, left: r() * 100, c: ["#ffd45a", "#ff6f9d", "#f6e7c1", "#7dd3fc", "#ff9ad5", "#fff3bf"][i % 6], dur: 4 + r() * 4, delay: -r() * 6, w: 6 + r() * 6 })); }, []);

  const showBox = stage === "box" || stage === "dance" || stage === "explain";
  const showVillage = stage === "village" || stage === "final";

  const head = (() => {
    if (stage === "box") return { k: TEXTS.day, t: null, s: TEXTS.openHint, pulse: true };
    if (stage === "dance") return { k: TEXTS.day, t: null, s: TEXTS.dancing };
    if (stage === "explain") return { k: TEXTS.day, t: TEXTS.explainTitle, s: "" };
    if (stage === "village") return { k: "Día 1", t: TEXTS.light, s: allLit ? TEXTS.allLit : TEXTS.lightHint };
    return { k: TEXTS.finalKick, t: null, s: "" };
  })();

  return (
    <section className={`d1 ${stage === "final" ? "final" : ""}`}>
      <style>{CSS}</style>
      <button
        type="button"
        className="d1-close"
        onClick={() => {
          timers.current.forEach(clearTimeout);
          timers.current = [];

          music.stop();
          onClose?.();
        }}
        aria-label="Cerrar"
      >
        ✕
      </button>
      <div className="d1-bg" aria-hidden="true" />
      {flakes.map((f) => <span key={f.id} className="d1-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true" />)}
      <div className="d1-lights" aria-hidden="true">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}><path d={`M0 2 ${bulbs.map((b) => `L${b.x} ${b.y}`).join(" ")} L100 2`} fill="none" stroke="#e8c878" strokeOpacity=".6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" /></svg>
        {bulbs.map((b) => <span key={b.id} className="d1-lb" style={{ left: `${b.x}%`, top: b.y * 1.1, background: b.c, boxShadow: `0 0 12px 3px ${b.c}`, animationDelay: `${(b.id % 5) * 0.4}s` }} />)}
      </div>
      <button type="button" className="d1-snd" onClick={music.toggle} aria-pressed={music.on} aria-label={music.on ? "Silenciar la música" : "Activar la música"}>{music.on ? "♫" : "♪"}</button>

      {/* village (kept behind everything once it appears) */}
      {showVillage && (
        <div className="d1-vill">
          <Village lit={lit} onLamp={lightLamp} interactive={stage === "village"} allLit={allLit} sparks={sparks} stars={stars} />
        </div>
      )}

      {stage !== "final" && (
        <header className="d1-head">
          <p className="d1-kick">{head.k}</p>
          {head.t && <h1 className="d1-title">{head.t}</h1>}
          {head.s !== undefined && <p className={`d1-sub ${head.pulse ? "pulse" : ""}`} aria-live="polite">{head.s}</p>}
          {stage === "village" && (
            <div className="d1-count" aria-live="polite">
              <span>{TEXTS.lampsLabel}</span>
              <span className="d1-lampicons" aria-hidden="true">{LAMPS.map((_, i) => <i key={i} className={`d1-li ${lit[i] ? "on" : ""}`} />)}</span>
              <span>{litCount} / {LAMPS.length}</span>
            </div>
          )}
        </header>
      )}

      {showBox && (
        <main className="d1-main">
          <div className={`d1-boxwrap ${opened ? "opened" : ""} ${opened ? "playing" : ""} ${stage === "explain" ? "dim" : ""}`}>
            <MusicBoxScene opened={opened} playing={opened} onOpen={openBox} snow={dsnow} />
          </div>
          {stage === "dance" && canNext && <button type="button" className="d1-next" onClick={goExplain}>{TEXTS.next}</button>}
        </main>
      )}

      {stage === "explain" && (
        <div className="d1-card">
          <div className="d1-paper">
            <div className="d1-pbody" aria-live="polite">
              <div key={page} className="d1-page" style={{ "--dir": dir }}>
                <p className="d1-pk">{`Carta · ${page + 1} / ${TEXTS.explain.length}`}</p>
                <h2 className="d1-pt">{TEXTS.explain[page].k}</h2>
                <div className="d1-rule" />
                {TEXTS.explain[page].p.map((t, i) => <p key={i} className="d1-p">{t}</p>)}
              </div>
            </div>
            <div className="d1-nav">
              <button type="button" className="d1-arrow" onClick={prevPage} aria-label="Anterior">←</button>
              {page === TEXTS.explain.length - 1 ? (
                <div className="d1-cta"><button type="button" className="d1-next" style={{ marginTop: 0 }} onClick={nextPage}>{TEXTS.lightBtn}</button></div>
              ) : (
                <div className="d1-dots">{TEXTS.explain.map((_, i) => <span key={i} className={`d1-dot ${i === page ? "on" : ""}`} />)}</div>
              )}
              <button type="button" className="d1-arrow" onClick={nextPage} disabled={page === TEXTS.explain.length - 1} aria-label="Siguiente">→</button>
            </div>
          </div>
        </div>
      )}

      {stage === "village" && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "clamp(10px,3cqh,28px)", zIndex: 8, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
          {allLit && <button type="button" className="d1-next" style={{ pointerEvents: "auto" }} onClick={() => setStage("final")}>{TEXTS.cont}</button>}
        </div>
      )}

      {stage === "final" && (
        <>
          {confetti.map((c) => <span key={c.id} className="d1-conf" style={{ left: `${c.left}%`, width: c.w, height: c.w * 1.5, background: c.c, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} aria-hidden="true" />)}
          <div className="d1-head" style={{ paddingTop: "clamp(30px,6cqh,54px)" }}>
            <p className="d1-kick">{TEXTS.finalKick}</p>
          </div>
          <div className="d1-final">
            <div className="d1-polaroid">
              {/* {PHOTO ? <img className="d1-pic" src={PHOTO} alt="Nosotros dos" /> : <div className="d1-pic"><span><b aria-hidden="true">🎄</b>{TEXTS.photoEmpty}</span></div>} */}
              {TEXTS.finalMsg.map((t, i) => <p key={i}>{t}</p>)}
              <span className="d1-cap">{TEXTS.photoCaption}</span>
            </div>

            <div className="d1-msg">
              <img src={strawberry} alt="" aria-hidden="true" />
              <h2>{TEXTS.finalTitle}</h2>
            </div>

            <div className="d1-plush">
              {PLUSH_IMAGE ? (
                <>
                  <img src={PLUSH_IMAGE} alt="Peluche" />
                  <div className="d1-sign">{TEXTS.sign.join(" ")}</div>
                </>
              ) : <Teddy />}
            </div>
          </div>
          <button type="button" className="d1-replay" onClick={replay}>{TEXTS.replay}</button>
        </>
      )}
    </section>
  );
}
