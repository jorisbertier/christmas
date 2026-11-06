import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  ✏️ The little papers hidden in the papillotes — edit freely         */
/*  cat: broma | adivinanza | meditar | curioso | reto | amor           */
/*  (adivinanza has an `answer` that she can reveal)                    */
/* ------------------------------------------------------------------ */

const CATS = {
    broma: { icon: "😂", label: "Broma", color: "#f2b632" },
    adivinanza: { icon: "🧩", label: "Adivinanza", color: "#2f6fd0" },
    meditar: { icon: "🧘", label: "Para meditar", color: "#8a4fd0" },
    curioso: { icon: "✨", label: "¿Sabías que…?", color: "#1f9a62" },
    reto: { icon: "🎯", label: "Mini reto", color: "#d9262f" },
    amor: { icon: "💌", label: "Con amor", color: "#e0527f" },
};

const MESSAGES = [
  // ---- bromas
  { cat: "broma", text: "¿Por qué los muñecos de nieve nunca discuten? Porque siempre mantienen la cabeza fría. ⛄" },
  { cat: "broma", text: "—Papá Noel, ¿por qué vas siempre vestido de rojo? —Porque el verde ya lo tiene el árbol." },
  { cat: "broma", text: "¿Cuál es el animal más navideño? El pavo… porque siempre acaba en la mesa. 🦃" },
  { cat: "broma", text: "—¿Me quieres? —Más que a la última pieza de turrón. —¡Madre mía, qué declaración!" },
  { cat: "broma", text: "¿Qué hace un reno cuando se pierde? Pregunta por el camino… ¡a Rudolph, que lleva el GPS en la nariz! 🔴" },
  { cat: "broma", text: "—Mamá, ¿puedo probar el turrón? —Solo un trocito. —(se come la tableta) —¡Te dije un trocito! —Era un trocito muy, muy largo." },
  // ---- adivinanzas
  { cat: "adivinanza", text: "Soy blanco, frío y ligero; caigo del cielo en invierno y a los niños hago felices. ¿Qué soy?", answer: "La nieve ❄️" },
  { cat: "adivinanza", text: "Tengo agujas y no coso; me visto de luces y adornos, y en un rincón de tu casa me quieren. ¿Qué soy?", answer: "El árbol de Navidad 🎄" },
  { cat: "adivinanza", text: "Voy de rojo y barba blanca, con un saco viajo en trineo; todos me esperan la noche más larga. ¿Quién soy?", answer: "Papá Noel 🎅" },
  { cat: "adivinanza", text: "Redonda y brillante cuelgo de una rama, y si me miras, en mí te ves reflejada. ¿Qué soy?", answer: "Una bola de Navidad 🔴" },
  { cat: "adivinanza", text: "Cuanto más vivo, más bajo; con fuego me alumbro y en las mesas de Navidad me enciendes. ¿Qué soy?", answer: "Una vela 🕯️" },
  { cat: "adivinanza", text: "No soy un regalo, pero traigo muchos. Llego una vez al año y todos me esperan con ilusión. ¿Qué día soy?", answer: "La Navidad (¡o la Nochebuena!) 🎁" },
  { cat: "adivinanza", text: "Dulce soy, de almendra y miel; en las mesas de Navidad me ves, y si me parten, me comen. ¿Qué soy?", answer: "El turrón 🍫" },
  { cat: "adivinanza", text: "Cuanto más me das, más tengo; no pesa nada y lo es todo. ¿Qué soy?", answer: "El cariño ❤️" },
  // ---- para meditar
  { cat: "meditar", text: "La Navidad no está en los regalos, sino en las personas con quienes elegimos compartirlos." },
  { cat: "meditar", text: "A veces, la luz más pequeña es la que mejor se ve en la noche más larga." },
  { cat: "meditar", text: "Dar sin esperar nada a cambio es el mejor regalo que existe." },
  { cat: "meditar", text: "Cada copo de nieve es distinto, igual que cada persona que amamos." },
  { cat: "meditar", text: "El tiempo compartido es el único regalo que nunca se agota." },
  { cat: "meditar", text: "Se puede estar lejos con el cuerpo y muy cerca con el corazón." },
  { cat: "meditar", text: "No necesitamos un día para querer; la Navidad solo nos recuerda hacerlo en voz alta." },
  { cat: "meditar", text: "Lo importante no es llegar rápido al 25, sino disfrutar cada día del camino." },
  // ---- curiosidades
  { cat: "curioso", text: "Rudolph, el reno de la nariz roja, nació en 1939 como personaje de un cuento que regalaban unos grandes almacenes. 🔴" },
  { cat: "curioso", text: "En Caracas, muchos vecinos van en patines a la misa de Navidad. ¡Incluso se cierran calles para que puedan hacerlo! 🛼" },
  { cat: "curioso", text: "En Japón, comer pollo frito en Navidad se ha convertido en una tradición muy popular. 🍗" },
  { cat: "curioso", text: "Según la tradición, besarse bajo el muérdago trae buena suerte y larga vida al amor. 🌿" },
  { cat: "curioso", text: "Se cree que el árbol de Navidad decorado nació en Alemania hace más de 500 años. 🎄" },
  // ---- retos
  { cat: "reto", text: "Mándame ahora mismo una foto de lo más navideño que tengas cerca. 📸" },
  { cat: "reto", text: "Cuéntame tu mejor recuerdo de una Navidad. ¡Quiero saberlo todo!" },
  { cat: "reto", text: "En la próxima videollamada: ¡un baile de 30 segundos! Sí, es obligatorio. 💃" },
  { cat: "reto", text: "Dime tres cosas por las que estás agradecida hoy." },
  { cat: "reto", text: "Escribe “te quiero” con el dedo en un cristal empañado y mándame la foto. 🪟" },
  // ---- amor
  { cat: "amor", text: "Eres mi regalo favorito, mi amor. 🎁" },
  { cat: "amor", text: "Cada día contigo es mejor que cualquier Navidad." },
  { cat: "amor", text: "Te mando un abrazo envuelto en papel de oro. Ábrelo cuando lo necesites. 🤗" },
  { cat: "amor", text: "Eres la razón de mis sonrisas en diciembre… y en todos los demás meses." },
  { cat: "amor", text: "Si pudiera pedirle algo a Papá Noel, le pediría más tiempo contigo." },
  { cat: "amor", text: "Tu risa es mi villancico favorito. 🎶" },
  { cat: "amor", text: "Aunque haya kilómetros entre los dos, mi corazón vive en tu código postal. 💕" },
  { cat: "amor", text: "Me encanta cómo conviertes lo normal en algo especial." },
  { cat: "amor", text: "Gracias por ser mi hogar, estemos donde estemos." },
  { cat: "amor", text: "Esta papillote no tiene truco: solo te quiero muchísimo. ❤️" },
];

const TEXTS = {
  kicker: "Una dulce sorpresa",
  title: "Las papillotes de Navidad",
  subtitle: "Cada papillote esconde un papelito: una broma, una adivinanza, algo para pensar…",
  hint: "Toca una papillote para abrirla",
  count: (n, t) => `Papillotes abiertas ${n} / ${t}`,
  unwrap: "Desenvolviendo…",
  showAnswer: "Ver la respuesta",
  answer: "Respuesta",
  another: "Abrir otra 🍬",
  close: "Cerrar",
  reread: "Releer",
  doneTitle: "¡Las has abierto todas!",
  doneMsg: "Eres la persona más golosa… y la más querida. Gracias por jugar conmigo. 🍫❤️",
  doneBtn: "Seguir mirando",
  again: "Volver a llenar el cesto",
  choc: "¡Y un chocolatito para ti! 🍫",
};

const STORAGE_KEY = "papillotesAbiertas";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
function mix(hex, to, a) {
  const n = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const x = n(hex); const y = n(to);
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * a).toString(16).padStart(2, "0")).join("")}`;
}
const FOILS = {
  oro: "#e8b84a", rojo: "#d9262f", verde: "#1f9a62", plata: "#c4ccd8", azul: "#2f6fd0", violeta: "#8a4fd0", rosa: "#e0527f", cobre: "#c9733a", turquesa: "#1fa3a3",
};
const FOIL_KEYS = Object.keys(FOILS);

function readOpened() {
  try { const v = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return []; }
}
function writeOpened(list) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { /* storage blocked */ }
}

// pile layouts, in % of the "stage" (a box with a fixed aspect ratio)
const WIDE = { ar: 2, counts: [9, 9, 8, 7, 5, 3, 1], baseW: 0.88, shrink: 0.05, w: 0.135, step: 0.58, baseY: 68 };
const TALL = { ar: 0.95, counts: [6, 6, 6, 5, 5, 5, 4, 3, 2], baseW: 0.9, shrink: 0.03, w: 0.215, step: 0.58, baseY: 68 };

function buildPile(cfg, total) {
  const r = rng(77);
  const items = [];
  let k = 0;
  cfg.counts.forEach((c, row) => {
    const rowW = cfg.baseW - row * cfg.shrink * (cfg.counts.length > 7 ? 0.6 : 1) * 1;
    const hPct = cfg.w * (50 / 120) * cfg.ar * 100; // height of an item, in % of the stage height
    for (let i = 0; i < c && k < total; i++, k++) {
      items.push({
        k, row,
        x: 50 + ((i + 0.5) / c - 0.5) * rowW * 100 + (r() - 0.5) * 1.6,
        y: cfg.baseY - row * hPct * cfg.step + (r() - 0.5) * 1.2,
        rot: (r() - 0.5) * 34 + (i % 2 ? 6 : -6),
        w: cfg.w * 100 * (0.92 + r() * 0.16),
        foil: FOIL_KEYS[Math.floor(r() * FOIL_KEYS.length)],
        variant: Math.floor(r() * 3),
        z: 100 - row * 10 + Math.floor(r() * 8),
      });
    }
  });
  return items;
}

/* ------------------------------------------------------------------ */
/*  Sound (optional, Web Audio)                                        */
/* ------------------------------------------------------------------ */

function useSound() {
  const ctxRef = useRef(null);
  const [on, setOn] = useState(true);
  const onRef = useRef(true);
  onRef.current = on;
  const ensure = useCallback(() => {
    if (!ctxRef.current) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ctxRef.current = new AC(); }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume().catch(() => {});
    return ctxRef.current;
  }, []);
  // foil crinkle = bursts of filtered noise
  const crinkle = useCallback((dur = 0.9) => {
    const ctx = ensure(); if (!ctx || !onRef.current) return;
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate); const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) { const burst = Math.random() < 0.012 ? 1 : 0; d[i] = (Math.random() * 2 - 1) * (0.25 + burst * 0.75) * (Math.sin((i / n) * Math.PI) ** 0.6); }
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 4200; bp.Q.value = 0.8;
    const g = ctx.createGain(); g.gain.value = 0.22;
    src.connect(bp); bp.connect(g); g.connect(ctx.destination); src.start();
  }, [ensure]);
  const tone = useCallback((f, d, v = 0.12, delay = 0, type = "triangle") => {
    const ctx = ctxRef.current; if (!ctx || !onRef.current) return;
    const t = ctx.currentTime + delay; const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + d + 0.05);
  }, []);
  const pop = useCallback(() => { ensure(); tone(520, 0.12, 0.14, 0, "sine"); tone(780, 0.16, 0.1, 0.05, "sine"); }, [ensure, tone]);
  const reveal = useCallback(() => { ensure(); [783.99, 987.77, 1318.5].forEach((f, i) => tone(f, 1.1, 0.1, i * 0.09)); }, [ensure, tone]);
  const win = useCallback(() => { ensure(); [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98].forEach((f, i) => tone(f, 1.6, 0.12, i * 0.1)); }, [ensure, tone]);
  useEffect(() => () => { if (ctxRef.current) ctxRef.current.close().catch(() => {}); }, []);
  return { crinkle, pop, reveal, win, on, setOn };
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

.pp{container:pp / size;box-sizing:border-box;position:relative;isolation:isolate;height:100%;min-height:100svh;width:100%;max-width:100%;max-height:100%;overflow:hidden;display:flex;flex-direction:column;align-items:center;color:#fff3e0;font-family:'Cormorant Garamond',Georgia,serif;
  background:radial-gradient(120% 90% at 50% 25%,#3a1a2a 0%,#1d1020 50%,#0a0710 100%)}
.pp-bg{position:absolute;inset:0;pointer-events:none;z-index:-1;background:
  radial-gradient(circle at 8% 26%,rgba(255,190,120,.24) 0 6cqw,transparent 7cqw),
  radial-gradient(circle at 94% 20%,rgba(255,160,200,.2) 0 7cqw,transparent 8cqw),
  radial-gradient(circle at 90% 88%,rgba(217,54,47,.26) 0 9cqw,transparent 10cqw),
  radial-gradient(circle at 6% 88%,rgba(255,225,150,.18) 0 7cqw,transparent 8cqw),
  radial-gradient(50% 40% at 50% 70%,rgba(255,190,110,.16),transparent 70%)}
.pp-flake{position:absolute;top:-4%;border-radius:50%;background:#fff;pointer-events:none;animation:pp-fall linear infinite;z-index:-1}
@keyframes pp-fall{0%{transform:translate(0,0)}50%{transform:translate(14px,55cqh)}100%{transform:translate(-8px,110cqh)}}
.pp-lights{position:absolute;left:0;right:0;top:0;height:34px;pointer-events:none;z-index:2}
.pp-lb{position:absolute;width:9px;height:12px;border-radius:50% 50% 45% 45%;animation:pp-tw 2.6s ease-in-out infinite}
@keyframes pp-tw{0%,100%{opacity:1}50%{opacity:.35}}
.pp-snd{position:absolute;right:clamp(8px,2cqw,22px);top:clamp(30px,6cqh,52px);z-index:20;width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(246,210,122,.7);background:rgba(0,0,0,.45);color:#f8dd86;cursor:pointer;font-size:16px}
.pp-snd:hover{background:rgba(246,210,122,.25)}.pp-snd:focus-visible{outline:2px solid #fff;outline-offset:2px}

.pp-head{position:relative;z-index:6;flex:none;text-align:center;padding:clamp(30px,6cqh,54px) 14px 0}
.pp-kick{margin:0;font-size:clamp(9px,min(1.5cqw,1.9cqh),13px);letter-spacing:.4em;text-transform:uppercase;font-weight:700;color:#f1c978}
.pp-title{margin:.05em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;font-size:clamp(26px,min(6cqw,8cqh),64px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 rgba(58,0,12,.75)) drop-shadow(0 0 22px rgba(255,200,90,.3))}
.pp-sub{margin:.2em auto 0;max-width:46ch;font-style:italic;font-weight:600;font-size:clamp(12px,min(2cqw,2.6cqh),19px);color:#ffe3c8;text-shadow:0 2px 8px rgba(0,0,0,.6)}
.pp-count{display:inline-flex;align-items:center;gap:.6em;margin-top:clamp(4px,1cqh,10px);padding:.2em 1.1em;border-radius:999px;border:1.5px dashed rgba(246,210,122,.55);background:rgba(0,0,0,.3);font-weight:700;font-size:clamp(11px,min(1.8cqw,2.3cqh),16px);letter-spacing:.08em;color:#ffeab1}
.pp-bar{width:clamp(50px,10cqw,110px);height:7px;border-radius:99px;background:rgba(0,0,0,.45);box-shadow:inset 0 1px 3px #000,0 0 0 1px rgba(240,200,120,.5);overflow:hidden}
.pp-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#d9a336,#fff3bf,#ff9fbb);transition:width .6s ease}

.pp-main{position:relative;z-index:5;flex:1 1 0;min-height:0;width:100%;container-type:size;display:flex;align-items:flex-end;justify-content:center;padding-bottom:clamp(6px,1.6cqh,16px)}
.pp-stage{position:relative;width:min(100cqw,calc(var(--ar) * 96cqh));aspect-ratio:var(--ar);max-height:100%}
.pp-hint{position:absolute;left:0;right:0;top:-1%;z-index:200;text-align:center;margin:0;font-style:italic;font-weight:600;font-size:clamp(12px,min(2.3cqw,2.8cqh),19px);color:#f8dd86;text-shadow:0 2px 10px rgba(0,0,0,.7);animation:pp-pulse 2.6s ease-in-out infinite;pointer-events:none}
@keyframes pp-pulse{0%,100%{opacity:.6}50%{opacity:1}}

/* basket */
.pp-bkback{position:absolute;left:5%;right:5%;bottom:25%;height:16%;border-radius:50%;background:radial-gradient(ellipse,#1a0a06,#3a1a0c);box-shadow:0 0 0 .8cqmin #7a4a22,0 0 0 1.4cqmin #5a3416,inset 0 6px 14px #000;z-index:1}
.pp-bkfront{position:absolute;left:3.5%;right:3.5%;bottom:0;height:34%;z-index:150;border-radius:2% 2% 18% 18% / 2% 2% 40% 40%;overflow:hidden;
  background:repeating-linear-gradient(45deg,#c58a48 0 .9cqmin,#8a5a28 .9cqmin 1.8cqmin),#8a5a28;box-shadow:0 14px 28px rgba(0,0,0,.55),inset 0 -14px 24px rgba(0,0,0,.4)}
.pp-bkfront::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(-45deg,rgba(0,0,0,.28) 0 .9cqmin,transparent .9cqmin 1.8cqmin)}
.pp-bkrim{position:absolute;left:0;right:0;top:0;height:20%;background:linear-gradient(180deg,#e0a860,#8a5a28 60%,#5a3416);box-shadow:0 3px 6px rgba(0,0,0,.5)}
.pp-bkrim::after{content:"";position:absolute;left:0;right:0;top:35%;height:30%;background:repeating-linear-gradient(90deg,rgba(255,255,255,.18) 0 1.4cqmin,transparent 1.4cqmin 2.8cqmin)}
.pp-bow{position:absolute;left:50%;bottom:6%;width:22%;transform:translateX(-50%);z-index:160;filter:drop-shadow(0 4px 6px rgba(0,0,0,.5))}
.pp-holly{position:absolute;z-index:160;pointer-events:none}

/* papillotes */
.pp-item{position:absolute;display:block;padding:0;border:0;background:none;cursor:pointer;transform:translate(-50%,-50%) rotate(var(--r));aspect-ratio:120/50;transition:transform .25s cubic-bezier(.3,1.5,.5,1),filter .25s ease;-webkit-tap-highlight-color:transparent;animation:pp-drop .7s cubic-bezier(.3,1.4,.5,1) both;animation-delay:var(--d)}
@keyframes pp-drop{from{opacity:0;transform:translate(-50%,-260%) rotate(calc(var(--r) + 40deg))}to{opacity:1;transform:translate(-50%,-50%) rotate(var(--r))}}
.pp-item svg{display:block;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 3px 3px rgba(0,0,0,.45))}
.pp-item:hover,.pp-item:focus-visible{transform:translate(-50%,-62%) rotate(0deg) scale(1.28);z-index:300 !important;outline:none}
.pp-item:focus-visible svg{filter:drop-shadow(0 0 6px #fff) drop-shadow(0 3px 3px rgba(0,0,0,.45))}
.pp-item.empty{cursor:pointer}
.pp-item.empty svg{opacity:.42;filter:saturate(.35) drop-shadow(0 1px 2px rgba(0,0,0,.4))}
.pp-glint{position:absolute;pointer-events:none;z-index:210;color:#fff6c8;animation:pp-gl 3s ease-in-out infinite}
@keyframes pp-gl{0%,100%{opacity:0;transform:scale(.4) rotate(0)}50%{opacity:1;transform:scale(1) rotate(45deg)}}

/* opening scene */
.pp-veil{position:absolute;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;padding:clamp(8px,2.4cqh,24px);background:radial-gradient(70% 60% at 50% 45%,rgba(40,16,30,.82),rgba(6,3,8,.92));backdrop-filter:blur(3px);animation:pp-vf .4s ease both}
@keyframes pp-vf{from{opacity:0}to{opacity:1}}
.pp-sc{position:relative;width:min(100%,520px);height:100%;max-height:640px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.pp-big{position:absolute;left:50%;top:42%;width:min(70cqw,360px);transform:translate(-50%,-50%);animation:pp-bigin .6s cubic-bezier(.3,1.4,.5,1) both}
.pp-big.shake{animation:pp-bigin .6s cubic-bezier(.3,1.4,.5,1) both,pp-shake .12s linear .6s 6}
.pp-big.burst{animation:pp-burst .5s ease-out both}
.pp-big svg{display:block;width:100%;height:auto;overflow:visible;filter:drop-shadow(0 16px 20px rgba(0,0,0,.6))}
@keyframes pp-bigin{from{opacity:0;transform:translate(-50%,-30%) scale(.3) rotate(-40deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(-6deg)}}
@keyframes pp-shake{0%,100%{rotate:-6deg}25%{rotate:2deg;translate:-6px 0}75%{rotate:-12deg;translate:6px 0}}
@keyframes pp-burst{0%{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(-6deg)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.5) rotate(10deg)}}
.pp-shard{position:absolute;left:50%;top:42%;width:14cqmin;aspect-ratio:1;pointer-events:none;animation:pp-sh 1s cubic-bezier(.2,.8,.3,1) both;clip-path:polygon(0 30%,60% 0,100% 55%,40% 100%)}
@keyframes pp-sh{0%{opacity:1;transform:translate(-50%,-50%) scale(.4) rotate(0)}100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1.2) rotate(var(--rot))}}
.pp-spk{position:absolute;left:50%;top:42%;width:.9em;height:.9em;pointer-events:none;background:#fff3bf;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);filter:drop-shadow(0 0 6px #ffd45a);animation:pp-sp 1.2s cubic-bezier(.15,.7,.3,1) both}
@keyframes pp-sp{0%{opacity:1;transform:translate(-50%,-50%) scale(.3)}100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1.5) rotate(120deg)}}
.pp-choc{position:absolute;left:50%;top:14%;width:min(34cqw,170px);transform:translateX(-50%);animation:pp-choc .7s cubic-bezier(.3,1.6,.5,1) both;z-index:3;filter:drop-shadow(0 8px 10px rgba(0,0,0,.6))}
@keyframes pp-choc{from{opacity:0;transform:translateX(-50%) scale(.2) rotate(-30deg)}to{opacity:1;transform:translateX(-50%) scale(1) rotate(-4deg)}}
.pp-slip{position:relative;z-index:2;width:min(100%,460px);margin-top:clamp(70px,17cqh,150px);padding:clamp(14px,2.8cqh,26px) clamp(16px,3.4cqw,30px) clamp(12px,2.4cqh,22px);text-align:center;color:#3b2410;
  background:radial-gradient(120% 100% at 30% 10%,#fffaf0,#f6e8cc 70%,#ead7ae);box-shadow:inset 0 0 40px rgba(150,100,40,.28),0 24px 50px rgba(0,0,0,.6);transform-origin:50% 0;animation:pp-unroll .9s cubic-bezier(.2,.9,.3,1) both;
  clip-path:polygon(0 3%,3% 0,7% 3%,11% 0,15% 3%,19% 0,23% 3%,27% 0,31% 3%,35% 0,39% 3%,43% 0,47% 3%,51% 0,55% 3%,59% 0,63% 3%,67% 0,71% 3%,75% 0,79% 3%,83% 0,87% 3%,91% 0,95% 3%,100% 0,100% 97%,97% 100%,93% 97%,89% 100%,85% 97%,81% 100%,77% 97%,73% 100%,69% 97%,65% 100%,61% 97%,57% 100%,53% 97%,49% 100%,45% 97%,41% 100%,37% 97%,33% 100%,29% 97%,25% 100%,21% 97%,17% 100%,13% 97%,9% 100%,5% 97%,0 100%)}
@keyframes pp-unroll{from{opacity:0;transform:translateY(-24px) scaleY(.15)}to{opacity:1;transform:none}}
.pp-badge{display:inline-flex;align-items:center;gap:.5em;padding:.18em 1em;border-radius:999px;color:#fff;font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:clamp(10px,min(1.7cqw,2.1cqh),14px);background:var(--c);box-shadow:0 3px 8px rgba(0,0,0,.35)}
.pp-badge b{font-size:1.4em;line-height:1}
.pp-text{margin:.7em 0 0;font-style:italic;font-weight:600;line-height:1.42;font-size:clamp(16px,min(2.9cqw,3.6cqh),26px);color:#3b2410}
.pp-ans{margin:.7em auto 0;padding:.5em 1em;border-radius:10px;background:rgba(138,26,46,.1);border:1.5px dashed rgba(138,26,46,.5);animation:pp-vf .5s ease both}
.pp-ans small{display:block;font-weight:700;font-size:.62em;letter-spacing:.24em;text-transform:uppercase;color:#a8281f}
.pp-ans b{display:block;font-family:'Caveat',cursive;font-size:clamp(22px,min(3.8cqw,4.8cqh),34px);color:#8a1a2e;line-height:1.1}
.pp-acts{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:clamp(10px,2cqh,18px)}
.pp-btn{padding:.4em 1.2em;border-radius:999px;cursor:pointer;font-weight:700;font-family:inherit;font-size:clamp(13px,min(2cqw,2.6cqh),17px);border:1.5px solid #8a1a2e;color:#8a1a2e;background:rgba(255,255,255,.6)}
.pp-btn:hover{background:#fff}.pp-btn.pri{border-color:#7a0f1a;color:#fff6e4;background:linear-gradient(180deg,#e0453d,#a3121f);box-shadow:0 3px 0 #6e0c16}
.pp-btn.pri:hover{filter:brightness(1.08)}.pp-btn:focus-visible{outline:3px solid #2f7fd0;outline-offset:2px}
.pp-wait{position:absolute;left:0;right:0;bottom:6%;text-align:center;margin:0;font-style:italic;font-weight:600;font-size:clamp(13px,2.2cqw,18px);color:#f8dd86;animation:pp-pulse 1s ease-in-out infinite}
.pp-conf{position:absolute;top:-6%;pointer-events:none;animation:pp-conf linear infinite;z-index:50}
@keyframes pp-conf{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(115cqh) rotate(720deg);opacity:.9}}
.pp-done{position:absolute;inset:0;z-index:45;display:flex;align-items:center;justify-content:center;padding:clamp(10px,3cqh,30px);background:rgba(8,4,10,.82);backdrop-filter:blur(3px);animation:pp-vf .5s ease both}
.pp-done .pp-slip{margin-top:0;width:min(100%,460px)}
.pp-done h2{margin:.1em 0 0;font-family:'Mountains of Christmas',cursive;font-weight:700;line-height:1.05;font-size:clamp(26px,min(5cqw,6.6cqh),44px);color:#8a1a2e}

@media (prefers-reduced-motion: reduce){
  .pp-flake,.pp-lb,.pp-hint,.pp-glint,.pp-wait,.pp-conf{animation:none !important}
  .pp-item,.pp-big,.pp-big.shake,.pp-big.burst,.pp-slip,.pp-choc,.pp-veil,.pp-shard,.pp-spk{animation-duration:.01s !important;animation-delay:0s !important}
}
`;

/* ------------------------------------------------------------------ */
/*  Art                                                                */
/* ------------------------------------------------------------------ */

function FoilDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        {FOIL_KEYS.map((k) => {
          const c = FOILS[k];
          return (
            <linearGradient key={k} id={`pf-${k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={mix(c, "#ffffff", 0.72)} /><stop offset=".22" stopColor={mix(c, "#ffffff", 0.25)} /><stop offset=".5" stopColor={c} /><stop offset=".78" stopColor={mix(c, "#000000", 0.28)} /><stop offset="1" stopColor={mix(c, "#000000", 0.5)} />
            </linearGradient>
          );
        })}
        <linearGradient id="ppChoc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a5a3a" /><stop offset=".4" stopColor="#5a3220" /><stop offset="1" stopColor="#2e170d" /></linearGradient>
      </defs>
    </svg>
  );
}

// a papillote: foil-wrapped sweet with two twisted, fringed ends
function Papillote({ foil, variant, ends = 0 }) {
  const c = FOILS[foil];
  const dark = mix(c, "#000000", 0.4);
  const light = mix(c, "#ffffff", 0.6);
  const fan = (side) => {
    const s = side === "l" ? -1 : 1; const x0 = 60 + s * 30;
    return (
      <g transform={`rotate(${ends * s} ${x0} 25)`}>
        <path d={`M${x0} 21L${60 + s * 36} 20L${60 + s * 36} 30L${x0} 29Z`} fill={`url(#pf-${foil})`} stroke={dark} strokeWidth=".8" />
        <path d={`M${60 + s * 36} 25L${60 + s * 56} 4Q${60 + s * 58} 12 ${60 + s * 54} 16Q${60 + s * 60} 20 ${60 + s * 54} 25Q${60 + s * 60} 30 ${60 + s * 54} 34Q${60 + s * 58} 38 ${60 + s * 56} 46Z`} fill={`url(#pf-${foil})`} stroke={dark} strokeWidth=".8" strokeLinejoin="round" />
        {[-14, -7, 0, 7, 14].map((d) => <path key={d} d={`M${60 + s * 38} 25L${60 + s * 55} ${25 + d}`} stroke={dark} strokeOpacity=".55" strokeWidth=".9" />)}
        <path d={`M${60 + s * 38} 23L${60 + s * 54} 12`} stroke={light} strokeOpacity=".8" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    );
  };
  return (
    <svg viewBox="0 0 120 50" aria-hidden="true">
      {fan("l")}{fan("r")}
      <ellipse cx="60" cy="25" rx="31" ry="17" fill={`url(#pf-${foil})`} stroke={dark} strokeWidth="1" />
      {variant === 1 && <path d="M46 10Q43 25 46 40L74 40Q77 25 74 10Z" fill="#fff6e8" opacity=".93" stroke={dark} strokeWidth=".6" />}
      {variant === 1 && <path d="M60 17l2.2 4.6 5 .6-3.7 3.4 1 5-4.5-2.5-4.5 2.5 1-5-3.7-3.4 5-.6z" fill={c} />}
      {variant === 2 && [[44, 20], [52, 30], [60, 18], [68, 30], [76, 21], [60, 33]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill={light} opacity=".85" />)}
      <path d="M36 17Q48 9 66 11" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M40 30L45 26L48 32M70 20L74 27L79 22M54 36L58 31L63 36" fill="none" stroke={dark} strokeOpacity=".45" strokeWidth=".9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Choc() {
  return (
    <svg viewBox="0 0 120 80" className="pp-choc" aria-hidden="true">
      <rect x="10" y="12" width="100" height="58" rx="12" fill="url(#ppChoc)" stroke="#1d0e07" strokeWidth="2" />
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={18 + c * 23} y={19 + r * 17} width="19" height="13" rx="3" fill="#6a3d28" stroke="#2e170d" strokeWidth="1" />))}
      <path d="M18 20Q60 14 100 20" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="3" strokeLinecap="round" />
      <path d="M92 70L110 60L110 70Z" fill="#e8b84a" />
    </svg>
  );
}

function Bow() {
  return (
    <svg viewBox="0 0 120 70" className="pp-bow" aria-hidden="true">
      <path d="M52 34Q44 62 26 68Q40 46 48 32Z" fill="#8a111c" stroke="#8a111c" strokeWidth="4" strokeLinejoin="round" />
      <path d="M68 34Q76 62 94 68Q80 46 72 32Z" fill="#8a111c" stroke="#8a111c" strokeWidth="4" strokeLinejoin="round" />
      <path d="M56 30Q34 -4 8 8Q-2 24 22 36Q44 42 58 34Z" fill="#d9262f" stroke="#e0453d" strokeWidth="5" strokeLinejoin="round" />
      <path d="M64 30Q86 -4 112 8Q122 24 98 36Q76 42 62 34Z" fill="#d9262f" stroke="#e0453d" strokeWidth="5" strokeLinejoin="round" />
      <path d="M50 26Q36 12 22 16" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="3.4" strokeLinecap="round" />
      <ellipse cx="60" cy="32" rx="11" ry="10" fill="#b01c2a" stroke="#b01c2a" strokeWidth="3" /><circle cx="60" cy="32" r="4.5" fill="#f8dd86" />
    </svg>
  );
}

function Holly({ style }) {
  return (
    <svg viewBox="0 0 90 70" style={style} className="pp-holly" aria-hidden="true">
      <defs><linearGradient id="ppL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38b06a" /><stop offset="1" stopColor="#0f5a36" /></linearGradient></defs>
      {[-70, -20, 30, 80].map((r, i) => <g key={i} transform={`translate(18 56) rotate(${r})`}><path d="M0 0Q10 -9 26 -2Q34 -16 48 -7Q58 -3 62 5Q54 14 42 12Q34 24 24 16Q10 20 0 0Z" fill="url(#ppL)" stroke="#0a3b23" strokeWidth="1.2" /></g>)}
      {[[26, 46], [38, 50], [32, 58]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="6" fill="#d4222f" stroke="#7a0f1a" /><circle cx={x - 2} cy={y - 2} r="1.8" fill="#fff" opacity=".75" /></g>)}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ChristmasPapillotes() {
  const total = MESSAGES.length;
  const sound = useSound();
  const stageRef = useRef(null);
  const timers = useRef([]);
  const [tall, setTall] = useState(false);
  const [opened, setOpened] = useState(() => new Set(readOpened()));
  const [cur, setCur] = useState(null); // { k, reread }
  const [phase, setPhase] = useState("idle"); // shake → burst → slip
  const [showAns, setShowAns] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const doneShown = useRef(false);

  // each papillote gets one message (random but stable order for this visit)
  const order = useMemo(() => {
    const r = rng(2026);
    const idx = MESSAGES.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    return idx;
  }, []);

  // pick the layout from the shape of the available space
  useLayoutEffect(() => {
    const el = stageRef.current && stageRef.current.parentElement;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(([e]) => { const { width, height } = e.contentRect; setTall(width / Math.max(1, height) < 1.15); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };

  const cfg = tall ? TALL : WIDE;
  const pile = useMemo(() => buildPile(cfg, total), [cfg, total]);

  const openItem = (k) => {
    timers.current.forEach(clearTimeout); timers.current = [];
    const already = opened.has(k);
    setShowAns(false);
    if (already) { setCur({ k, reread: true }); setPhase("slip"); sound.reveal(); return; }
    setCur({ k, reread: false });
    setPhase("shake");
    sound.crinkle(1.0);
    later(() => { setPhase("burst"); sound.pop(); }, 1350);
    later(() => { setPhase("slip"); sound.reveal(); }, 1850);
    setOpened((s) => { const n = new Set(s); n.add(k); writeOpened([...n]); return n; });
  };

  const close = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setCur(null); setPhase("idle"); setShowAns(false);
  };

  const openAnother = () => {
    const left = pile.filter((p) => !opened.has(p.k)).map((p) => p.k);
    if (!left.length) { close(); return; }
    openItem(left[Math.floor(Math.random() * left.length)]);
  };

  // all opened → little celebration, once
  useEffect(() => {
    if (cur === null && opened.size === total && !doneShown.current) { doneShown.current = true; later(() => { setShowDone(true); sound.win(); }, 500); }
  }, [cur, opened, total]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { if (cur) close(); else setShowDone(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const refill = () => { writeOpened([]); setOpened(new Set()); doneShown.current = false; setShowDone(false); };

  const flakes = useMemo(() => { const r = rng(5); return Array.from({ length: 28 }, (_, i) => ({ id: i, left: r() * 100, size: r() * 4 + 2, dur: r() * 7 + 9, delay: -r() * 14, o: 0.3 + r() * 0.5 })); }, []);
  const bulbs = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ id: i, x: (i + 0.5) * (100 / 22), y: 8 + Math.abs(Math.sin(i * 0.8)) * 10, c: ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"][i % 5] })), []);
  const confetti = useMemo(() => { const r = rng(9); return Array.from({ length: 34 }, (_, i) => ({ id: i, left: r() * 100, c: ["#ffd45a", "#d9362f", "#35a35c", "#f6e7c1", "#7dd3fc", "#ff9ad5"][i % 6], dur: 4 + r() * 4, delay: -r() * 6, w: 6 + r() * 6 })); }, []);
  const sparks = useMemo(() => { const r = rng(3); return Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; const d = 90 + r() * 120; return { id: i, dx: Math.cos(a) * d, dy: Math.sin(a) * d, s: 10 + r() * 14 }; }); }, []);
  const shards = useMemo(() => { const r = rng(8); return Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * Math.PI * 2 + r(); const d = 110 + r() * 110; return { id: i, dx: Math.cos(a) * d, dy: Math.sin(a) * d - 30, rot: (r() - 0.5) * 540 }; }); }, []);
  const glints = useMemo(() => pile.filter((_, i) => i % 5 === 2).slice(0, 7), [pile]);

  const curItem = cur ? pile.find((p) => p.k === cur.k) : null;
  const msg = cur ? MESSAGES[order[cur.k]] : null;
  const cat = msg ? CATS[msg.cat] : null;

  return (
    <section className="pp max-w-full max-h-full">
      <style>{CSS}</style>
      <FoilDefs />
      <div className="pp-bg" aria-hidden="true" />
      {flakes.map((f) => <span key={f.id} className="pp-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true" />)}
      <div className="pp-lights" aria-hidden="true">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}><path d={`M0 2 ${bulbs.map((b) => `L${b.x} ${b.y}`).join(" ")} L100 2`} fill="none" stroke="#e8c878" strokeOpacity=".6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" /></svg>
        {bulbs.map((b) => <span key={b.id} className="pp-lb" style={{ left: `${b.x}%`, top: b.y * 1.1, background: b.c, boxShadow: `0 0 12px 3px ${b.c}`, animationDelay: `${(b.id % 5) * 0.4}s` }} />)}
      </div>
      <button type="button" className="pp-snd" onClick={() => sound.setOn(!sound.on)} aria-pressed={sound.on} aria-label={sound.on ? "Silenciar" : "Activar el sonido"}>{sound.on ? "♫" : "♪"}</button>

      <header className="pp-head">
        <p className="pp-kick">{TEXTS.kicker}</p>
        <h1 className="pp-title">{TEXTS.title}</h1>
        <p className="pp-sub">{TEXTS.subtitle}</p>
        <div className="pp-count" aria-live="polite"><span>{TEXTS.count(opened.size, total)}</span><span className="pp-bar" aria-hidden="true"><i style={{ width: `${(opened.size / total) * 100}%` }} /></span></div>
      </header>

      <main className="pp-main">
        <div className="pp-stage" ref={stageRef} style={{ "--ar": cfg.ar }}>
          <p className="pp-hint">{TEXTS.hint}</p>
          <div className="pp-bkback" aria-hidden="true" />
          {pile.map((p) => {
            const isOpen = opened.has(p.k);
            return (
              <button
                key={`${tall ? "t" : "w"}${p.k}`}
                type="button"
                className={`pp-item ${isOpen ? "empty" : ""}`}
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, zIndex: p.z, "--r": `${p.rot}deg`, "--d": `${0.1 + (p.row * 0.09) + (p.k % 5) * 0.03}s` }}
                onClick={() => openItem(p.k)}
                aria-label={isOpen ? `Papillote ${p.k + 1} (ya abierta). ${TEXTS.reread}` : `Abrir la papillote ${p.k + 1}`}
              >
                <Papillote foil={p.foil} variant={p.variant} ends={isOpen ? 22 : 0} />
              </button>
            );
          })}
          {glints.map((g, i) => <span key={g.k} className="pp-glint" style={{ left: `${g.x}%`, top: `${g.y - 3}%`, fontSize: 14 + (i % 3) * 5, animationDelay: `${i * 0.6}s` }} aria-hidden="true">✦</span>)}
          <div className="pp-bkfront" aria-hidden="true"><div className="pp-bkrim" /></div>
          <Bow />
          <Holly style={{ left: "1%", bottom: "26%", width: "14%", zIndex: 160 }} />
          <Holly style={{ right: "1%", bottom: "26%", width: "14%", transform: "scaleX(-1)", zIndex: 160 }} />
        </div>
      </main>

      {/* an opened papillote */}
      {cur && msg && (
        <div className="pp-veil" role="dialog" aria-modal="true" aria-label={cat.label} onClick={() => { if (phase === "slip") close(); }}>
          <div className="pp-sc" onClick={(e) => e.stopPropagation()}>
            {phase === "shake" && (
              <>
                <div className="pp-big shake"><Papillote foil={curItem.foil} variant={curItem.variant} /></div>
                <p className="pp-wait">{TEXTS.unwrap}</p>
              </>
            )}
            {phase === "burst" && (
              <>
                <div className="pp-big burst"><Papillote foil={curItem.foil} variant={curItem.variant} ends={30} /></div>
                {shards.map((s) => <span key={s.id} className="pp-shard" style={{ background: FOILS[curItem.foil], "--dx": `${s.dx}px`, "--dy": `${s.dy}px`, "--rot": `${s.rot}deg` }} aria-hidden="true" />)}
                {sparks.map((s) => <span key={s.id} className="pp-spk" style={{ "--dx": `${s.dx}px`, "--dy": `${s.dy}px`, fontSize: s.s }} aria-hidden="true" />)}
              </>
            )}
            {phase === "slip" && (
              <>
                {!cur.reread && <Choc />}
                <div className="pp-slip" style={{ "--c": cat.color }} aria-live="polite">
                  <span className="pp-badge"><b aria-hidden="true">{cat.icon}</b>{cat.label}</span>
                  <p className="pp-text">{msg.text}</p>
                  {msg.answer && (showAns
                    ? <div className="pp-ans"><small>{TEXTS.answer}</small><b>{msg.answer}</b></div>
                    : <div className="pp-acts"><button type="button" className="pp-btn pri" onClick={() => { setShowAns(true); sound.pop(); }}>{TEXTS.showAnswer}</button></div>)}
                  <div className="pp-acts">
                    {opened.size < total && <button type="button" className="pp-btn pri" onClick={openAnother}>{TEXTS.another}</button>}
                    <button type="button" className="pp-btn" onClick={close} autoFocus>{TEXTS.close}</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* all of them opened */}
      {showDone && (
        <div className="pp-done" role="dialog" aria-modal="true" aria-label={TEXTS.doneTitle}>
          {confetti.map((c) => <span key={c.id} className="pp-conf" style={{ left: `${c.left}%`, width: c.w, height: c.w * 1.5, background: c.c, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} aria-hidden="true" />)}
          <div className="pp-slip" style={{ "--c": "#e0527f" }}>
            <span className="pp-badge"><b aria-hidden="true">🎉</b>{TEXTS.kicker}</span>
            <h2>{TEXTS.doneTitle}</h2>
            <p className="pp-text">{TEXTS.doneMsg}</p>
            <div className="pp-acts"><button type="button" className="pp-btn pri" autoFocus onClick={() => setShowDone(false)}>{TEXTS.doneBtn}</button><button type="button" className="pp-btn" onClick={refill}>{TEXTS.again}</button></div>
          </div>
        </div>
      )}
    </section>
  );
}