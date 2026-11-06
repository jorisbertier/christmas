import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  📸 Photos of the REAL pyjamas (supplied by you)                    */
/*  1) uncomment the imports  2) put each name in the `src` below      */
/*  (until then, a drawn pyjama is shown as a placeholder)             */
/* ------------------------------------------------------------------ */
// import pijama1 from "../../assets/pijamas/pijama1.jpg";
// import pijama2 from "../../assets/pijamas/pijama2.jpg";
// import pijama3 from "../../assets/pijamas/pijama3.jpg";
// import pijama4 from "../../assets/pijamas/pijama4.jpg";
// import pijama5 from "../../assets/pijamas/pijama5.jpg";
// import pijama6 from "../../assets/pijamas/pijama6.jpg";

const LOCKED = true; // true = the choice is final (like a starter). false = she can change her mind
const STORAGE_KEY = "pijamaElegido";

/* ------------------------------------------------------------------ */
/*  ✏️ The 6 pyjamas — edit names, descriptions, types and stats        */
/*  stats: from 1 to 5                                                 */
/*  art: only used for the drawn placeholder (until you add the photo) */
/* ------------------------------------------------------------------ */

const PIJAMAS = [
  {
    id: "clasico", src: null /* pijama1 */, name: "El Clásico a Cuadros", tagline: "El favorito de toda la vida",
    types: ["Clásico", "Acogedor"],
    desc: "Franela suavecita de cuadros rojos y verdes. Perfecto para noches de manta, chocolate caliente y película repetida por décima vez.",
    stats: { calidez: 5, suavidad: 4, estilo: 3, ternura: 3, ridiculo: 1, cine: 5 },
    color: "#d9262f", art: { kind: "set", pattern: "tartan", a: "#b3202a", b: "#1f6a4a", trim: "#f6e7c1" },
  },
  {
    id: "renos", src: null /* pijama2 */, name: "Los Renos Traviesos", tagline: "Risas garantizadas",
    types: ["Divertido", "Navideño"],
    desc: "Lleno de renos con la nariz roja. Garantía de carcajadas, incluso en una videollamada a las tres de la madrugada.",
    stats: { calidez: 4, suavidad: 4, estilo: 2, ternura: 4, ridiculo: 5, cine: 4 },
    color: "#e0453d", art: { kind: "set", pattern: "reindeer", a: "#1f6a4a", b: "#0f4a30", trim: "#d9262f" },
  },
  {
    id: "caramelo", src: null /* pijama3 */, name: "Caramelo de Menta", tagline: "Huele a Navidad solo con mirarlo",
    types: ["Dulce", "Navideño"],
    desc: "Rayas rojas y blancas como un bastón de caramelo. Visualmente delicioso, aunque no se come (lo hemos comprobado).",
    stats: { calidez: 3, suavidad: 5, estilo: 4, ternura: 4, ridiculo: 3, cine: 4 },
    color: "#ff6b6b", art: { kind: "set", pattern: "candy", a: "#d9262f", b: "#fff6e8", trim: "#1f9a62" },
  },
  {
    id: "copos", src: null /* pijama4 */, name: "Noche de Copos", tagline: "Como vivir dentro de una bola de nieve",
    types: ["Elegante", "Invernal"],
    desc: "Azul noche con copos de nieve plateados. Sensación de estar dentro de una bola de cristal, pero sin sacudidas.",
    stats: { calidez: 4, suavidad: 4, estilo: 5, ternura: 3, ridiculo: 1, cine: 4 },
    color: "#4a7fe0", art: { kind: "set", pattern: "snow", a: "#1c2f66", b: "#101c44", trim: "#c9d6f5" },
  },
  {
    id: "mono", src: null /* pijama5 */, name: "El Mono Abrazable", tagline: "Prohibido tener frío",
    types: ["Ultra cómodo", "Tierno"],
    desc: "Pijama entero con capucha y orejitas. Prohibido tener frío. Prohibido, también, ir al baño con prisa.",
    stats: { calidez: 5, suavidad: 5, estilo: 2, ternura: 5, ridiculo: 4, cine: 5 },
    color: "#e8a86a", art: { kind: "onesie", pattern: "plain", a: "#e9c9a0", b: "#d9a878", trim: "#f6e7c1" },
  },
  {
    id: "saten", src: null /* pijama6 */, name: "Satén de Nochebuena", tagline: "Para cenas, aunque sean por pantalla",
    types: ["Romántico", "Elegante"],
    desc: "Burdeos con ribetes dorados. Ideal para brindar a medianoche y fingir que somos muy sofisticados.",
    stats: { calidez: 2, suavidad: 5, estilo: 5, ternura: 3, ridiculo: 1, cine: 3 },
    color: "#b01c4a", art: { kind: "set", pattern: "satin", a: "#7a1030", b: "#4a0a1e", trim: "#e8b84a" },
  },
];

const STATS = [
  { k: "calidez", icon: "🔥", label: "Calidez" },
  { k: "suavidad", icon: "☁️", label: "Suavidad" },
  { k: "estilo", icon: "✨", label: "Estilo" },
  { k: "ternura", icon: "🧸", label: "Ternura" },
  { k: "ridiculo", icon: "🤡", label: "Factor ridículo" },
  { k: "cine", icon: "🎬", label: "Noche de peli" },
];

const TYPE_COLORS = { Clásico: "#b3202a", Acogedor: "#c9733a", Divertido: "#f2b632", Navideño: "#1f9a62", Dulce: "#e0527f", Elegante: "#4a7fe0", Invernal: "#1fa3a3", "Ultra cómodo": "#8a4fd0", Tierno: "#ff8fa3", Romántico: "#d9306e" };

const TEXTS = {
  kicker: "Laboratorio navideño del Profesor Noel",
  title: "Elige nuestro futuro pijama",
  intro: "¡Ho, ho, hola! Soy el Profesor Noel. Hoy hay que tomar una decisión importantísima: ¡elegir el futuro pijama de Navidad de los dos! He guardado seis candidatos en estas bolas mágicas.",
  prompt: "Toca una bola para ver el pijama de cerca. Piénsalo bien… ¡solo puede quedarse uno!",
  noPrompt: "Vale, vale… ¡tómate tu tiempo! Toca otra bola cuando quieras.",
  ask: (n) => `¿Quieres elegir ${n}?`,
  yes: "Sí",
  no: "No",
  dex: (n, t) => `Pijadex: ${n} / ${t} vistos`,
  seen: "visto",
  chosenLine: (n) => `¡Excelente elección! ${n} será nuestro pijama de Navidad. ¡Qué ganas de estrenarlo juntos!`,
  certTitle: "Certificado oficial",
  certSub: "Nuestro futuro pijama de Navidad",
  certDate: (d) => `Elegido el ${d}`,
  certNote: "Firmado: el Profesor Noel y un montón de elfos muy emocionados ✨",
  change: "Cambiar de pijama",
  others: "Los otros candidatos",
  sound: "Sonido",
  next: "▼",
  num: (i) => `Nº ${String(i + 1).padStart(2, "0")}`,
  placeholder: "Aquí irá la foto del pijama",
};

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
function mix(hex, to, a) {
  const n = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const x = n(hex); const y = n(to);
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * a).toString(16).padStart(2, "0")).join("")}`;
}
function readChoice() {
  try { const v = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null"); if (v && PIJAMAS.some((p) => p.id === v.id)) return v; } catch (e) { /* ignore */ }
  return null;
}
function saveChoice(v) { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch (e) { /* ignore */ } }
function clearChoice() { try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ } }

/* ------------------------------------------------------------------ */
/*  Sound (Web Audio): menu blips, a little "cry" per pyjama, fanfare   */
/* ------------------------------------------------------------------ */

const CRIES = [[523, 659, 784], [392, 523, 392, 659], [659, 784, 988, 784], [440, 554, 659, 880], [330, 392, 330, 494, 392], [587, 740, 880, 1175]];

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
  const tone = useCallback((f, d, type = "square", v = 0.06, delay = 0) => {
    const ctx = ctxRef.current; if (!ctx || !onRef.current) return;
    const t = ctx.currentTime + delay; const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + d + 0.05);
  }, []);
  const blip = useCallback(() => { ensure(); tone(880, 0.06, "square", 0.04); }, [ensure, tone]);
  const select = useCallback(() => { ensure(); tone(660, 0.08, "square", 0.05); tone(990, 0.1, "square", 0.05, 0.07); }, [ensure, tone]);
  const cry = useCallback((i) => { ensure(); (CRIES[i % CRIES.length]).forEach((f, k) => { tone(f, 0.22, "triangle", 0.13, k * 0.11); tone(f * 2, 0.2, "sine", 0.05, k * 0.11); }); }, [ensure, tone]);
  const fanfare = useCallback(() => { ensure(); [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5].forEach((f, k) => { tone(f, 0.4, "triangle", 0.14, k * 0.13); tone(f / 2, 0.4, "sine", 0.07, k * 0.13); }); [1568, 2093].forEach((f, k) => tone(f, 1.4, "sine", 0.07, 0.95 + k * 0.1)); }, [ensure, tone]);
  const no = useCallback(() => { ensure(); tone(330, 0.12, "square", 0.05); tone(247, 0.16, "square", 0.05, 0.1); }, [ensure, tone]);
  useEffect(() => () => { if (ctxRef.current) ctxRef.current.close().catch(() => {}); }, []);
  return { ensure, blip, select, cry, fanfare, no, on, setOn };
}

// RPG-style typewriter
function useTypewriter(text, speed = 24) {
  const [n, setN] = useState(0);
  useEffect(() => { setN(0); }, [text]);
  useEffect(() => {
    if (n >= text.length) return undefined;
    const id = setTimeout(() => setN((v) => v + 1), speed);
    return () => clearTimeout(id);
  }, [n, text, speed]);
  return { shown: text.slice(0, n), done: n >= text.length, skip: () => setN(text.length) };
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=VT323&family=Cinzel:wght@500;700;900&display=swap');

.pj{container:pj / size;box-sizing:border-box;position:relative;isolation:isolate;height:100%;min-height:100svh;width:100%;max-width:100%;max-height:100%;overflow:hidden;display:flex;flex-direction:column;color:#fff3e0;font-family:'Cormorant Garamond',Georgia,serif;
  background:linear-gradient(180deg,#1b1030 0%,#2c1620 52%,#3a1e14 100%)}
.pj button{font-family:inherit}
.pj-wall{position:absolute;inset:0;z-index:-2;pointer-events:none}
.pj-flake{position:absolute;top:-4%;border-radius:50%;background:#fff;pointer-events:none;animation:pj-fall linear infinite;z-index:-1}
@keyframes pj-fall{0%{transform:translate(0,0)}50%{transform:translate(14px,55cqh)}100%{transform:translate(-8px,110cqh)}}
.pj-lights{position:absolute;left:0;right:0;top:0;height:34px;pointer-events:none;z-index:3}
.pj-lb{position:absolute;width:9px;height:12px;border-radius:50% 50% 45% 45%;animation:pj-tw 2.6s ease-in-out infinite}
@keyframes pj-tw{0%,100%{opacity:1}50%{opacity:.35}}
.pj-snd{position:absolute;right:clamp(8px,2cqw,22px);top:clamp(28px,5.4cqh,48px);z-index:20;width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(246,210,122,.7);background:rgba(0,0,0,.45);color:#f8dd86;cursor:pointer;font-size:16px}
.pj-snd:hover{background:rgba(246,210,122,.25)}.pj-snd:focus-visible{outline:2px solid #fff;outline-offset:2px}

.pj-head{position:relative;z-index:6;flex:none;text-align:center;padding:clamp(28px,5.4cqh,48px) 14px 0}
.pj-kick{margin:0;font-size:clamp(9px,min(1.5cqw,1.9cqh),13px);letter-spacing:.34em;text-transform:uppercase;font-weight:700;color:#f1c978}
.pj-title{margin:.05em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;font-size:clamp(24px,min(5.6cqw,7.4cqh),60px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 rgba(58,0,12,.75)) drop-shadow(0 0 22px rgba(255,200,90,.3))}
.pj-dexchip{display:inline-flex;margin-top:clamp(3px,.8cqh,8px);padding:.15em 1em;border-radius:999px;border:1.5px dashed rgba(246,210,122,.55);background:rgba(0,0,0,.3);font-family:'VT323',monospace;font-size:clamp(14px,min(2.2cqw,2.8cqh),20px);letter-spacing:.06em;color:#ffeab1}

/* the table with the 6 baubles */
.pj-scene{position:relative;z-index:5;flex:1 1 0;min-height:0;display:flex;align-items:center;justify-content:center;padding:0 clamp(8px,2cqw,24px)}
.pj-table{position:relative;width:min(100%,1100px);display:grid;grid-template-columns:repeat(6,1fr);align-items:end;justify-items:center;gap:clamp(4px,1.2cqw,16px);--bw:min(13cqw,26cqh)}
@container pj (aspect-ratio < 1.1){.pj-table{grid-template-columns:repeat(3,1fr);row-gap:clamp(10px,2.4cqh,26px);--bw:min(25cqw,17cqh)}}
.pj-slot{position:relative;display:flex;flex-direction:column;align-items:center;gap:clamp(2px,.6cqh,6px);animation:pj-in .8s cubic-bezier(.3,1.4,.5,1) both;animation-delay:var(--d)}
@keyframes pj-in{from{opacity:0;transform:translateY(-30px) scale(.8)}to{opacity:1;transform:none}}
.pj-bauble{position:relative;display:block;width:var(--bw);aspect-ratio:.86;padding:0;border:0;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .3s cubic-bezier(.3,1.6,.5,1);outline:none}
.pj-bauble svg{display:block;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 12px 12px rgba(0,0,0,.55))}
.pj-slot.sel .pj-bauble,.pj-bauble:hover,.pj-bauble:focus-visible{transform:translateY(-10px) scale(1.08)}
.pj-bauble::after{content:"";position:absolute;inset:-12%;border-radius:50%;background:radial-gradient(circle,rgba(255,226,140,.55),transparent 65%);opacity:0;transition:opacity .3s ease;pointer-events:none}
.pj-slot.sel .pj-bauble::after,.pj-bauble:hover::after,.pj-bauble:focus-visible::after{opacity:1}
.pj-bauble:focus-visible{outline:3px solid #fff;outline-offset:6px;border-radius:50%}
.pj-sway{transform-origin:50% 0;animation:pj-sway 4s ease-in-out infinite alternate}
@keyframes pj-sway{from{transform:rotate(-2.5deg)}to{transform:rotate(2.5deg)}}
.pj-ped{width:calc(var(--bw) * 1.05);height:clamp(10px,2.6cqh,22px);border-radius:50%;background:radial-gradient(ellipse,#6a4020,#2a160a);box-shadow:0 0 0 3px #d9a336,0 8px 14px rgba(0,0,0,.6);margin-top:calc(var(--bw) * -0.1)}
.pj-lbl{font-family:'Cinzel',serif;font-weight:700;font-size:clamp(9px,min(1.4cqw,1.9cqh),13px);letter-spacing:.08em;color:#ffe9c9;text-align:center;line-height:1.1;text-shadow:0 2px 4px #000}
.pj-seen{position:absolute;right:6%;top:2%;z-index:2;font-family:'VT323',monospace;font-size:clamp(11px,1.8cqh,16px);padding:0 .5em;border-radius:999px;background:#1f9a62;color:#fff;box-shadow:0 0 0 2px #0a2a1a}
.pj-woodtable{position:absolute;left:-3%;right:-3%;bottom:calc(clamp(10px,2.6cqh,22px) * -0.9);height:calc(clamp(10px,2.6cqh,22px) * 3);z-index:-1;border-radius:10px;background:linear-gradient(180deg,#8a5a34,#4a2a14);box-shadow:0 14px 30px rgba(0,0,0,.6),inset 0 3px 0 rgba(255,255,255,.2)}
.pj-woodtable::before{content:"";position:absolute;left:8%;right:8%;top:-6px;height:12px;background:linear-gradient(180deg,#d9262f,#8a111c);border-radius:6px 6px 0 0;box-shadow:0 0 0 2px #e8b84a}

/* RPG dialogue box */
.pj-dlg{position:relative;z-index:8;flex:none;margin:0 clamp(8px,2cqw,24px) clamp(8px,1.8cqh,18px);display:flex;gap:clamp(8px,1.6cqw,16px);align-items:center;padding:clamp(8px,1.6cqh,14px) clamp(10px,2cqw,20px);border-radius:12px;min-height:clamp(64px,17cqh,130px);
  background:linear-gradient(180deg,#1d3a2e,#0f241c);box-shadow:0 0 0 3px #f6e7c1,0 0 0 6px #7a1b25,0 0 0 8px #e8b84a,0 14px 30px rgba(0,0,0,.6);cursor:pointer}
.pj-portrait{flex:none;width:clamp(44px,min(9cqw,13cqh),88px);aspect-ratio:1;border-radius:10px;background:radial-gradient(circle at 50% 35%,#ffe9c8,#e8b57a);box-shadow:0 0 0 2px #e8b84a;overflow:hidden}
.pj-dtext{flex:1;min-width:0;margin:0;font-family:'VT323',monospace;font-size:clamp(17px,min(2.8cqw,3.8cqh),30px);line-height:1.12;color:#fff6e4;text-shadow:0 2px 0 rgba(0,0,0,.6)}
.pj-arrow{flex:none;align-self:flex-end;font-family:'VT323',monospace;font-size:1.6em;color:#f8dd86;animation:pj-blink .8s steps(1) infinite}
@keyframes pj-blink{50%{opacity:0}}

/* detail "starter" screen */
.pj-det{position:absolute;inset:0;z-index:30;display:flex;flex-direction:column;background:radial-gradient(90% 70% at 50% 30%,rgba(60,30,50,.96),rgba(12,6,14,.98));animation:pj-fade .35s ease both}
@keyframes pj-fade{from{opacity:0}to{opacity:1}}
.pj-body{position:relative;flex:1 1 0;min-height:0;display:grid;grid-template-columns:auto minmax(0,1fr);gap:clamp(14px,3cqw,44px);align-items:center;justify-content:center;padding:clamp(34px,6cqh,56px) clamp(14px,4cqw,56px) clamp(4px,1cqh,10px)}
@container pj (aspect-ratio < 1.1){.pj-body{grid-template-columns:1fr;grid-template-rows:auto 1fr;justify-items:center;gap:clamp(6px,1.4cqh,14px);padding-top:clamp(30px,5cqh,48px)}}
.pj-card{position:relative;--ch:min(62cqh,52cqw);height:var(--ch);aspect-ratio:3/4;border-radius:16px;padding:clamp(6px,1.1cqh,10px);background:linear-gradient(135deg,#fff0a8,#d9a336 25%,#7a4f10 50%,#f1cd6a 75%,#a8721f);box-shadow:0 24px 60px rgba(0,0,0,.7),0 0 60px rgba(255,200,110,.25);animation:pj-cardin .8s cubic-bezier(.3,1.3,.5,1) both}
@keyframes pj-cardin{from{opacity:0;transform:translateX(-40px) rotate(-6deg) scale(.9)}to{opacity:1;transform:none}}
@container pj (aspect-ratio < 1.1){.pj-card{--ch:min(33cqh,58cqw)}}
.pj-cin{position:relative;height:100%;border-radius:11px;overflow:hidden;display:flex;flex-direction:column;background:linear-gradient(180deg,#3a1630,#1c0a1c)}
.pj-ctop{flex:none;display:flex;align-items:center;justify-content:space-between;gap:6px;padding:.3em .8em;font-family:'Cinzel',serif;font-weight:700;color:#fff6e4;background:linear-gradient(180deg,rgba(0,0,0,.4),rgba(0,0,0,.15));font-size:clamp(10px,min(1.7cqw,2.1cqh),15px)}
.pj-cart{position:relative;flex:1;min-height:0;margin:0 .6em;border-radius:8px;overflow:hidden;background:radial-gradient(circle at 50% 40%,var(--c),#120814 120%);box-shadow:inset 0 0 0 2px rgba(255,255,255,.25)}
.pj-cart img{display:block;width:100%;height:100%;object-fit:cover}
.pj-cart svg.art{position:absolute;inset:6% 6% 2%;width:88%;height:92%;filter:drop-shadow(0 10px 12px rgba(0,0,0,.5))}
.pj-holo{position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.28) 45%,rgba(255,140,200,.18) 50%,rgba(140,220,255,.18) 55%,transparent 70%);background-size:260% 100%;animation:pj-holo 3.6s ease-in-out infinite;mix-blend-mode:screen}
@keyframes pj-holo{0%{background-position:130% 0}100%{background-position:-30% 0}}
.pj-cbot{flex:none;padding:.35em .8em .5em;text-align:center;font-style:italic;font-weight:600;line-height:1.15;color:#ffe9c9;font-size:clamp(11px,min(1.8cqw,2.3cqh),16px)}
.pj-info{min-width:0;max-height:100%;overflow-y:auto;scrollbar-width:thin;animation:pj-infoin .8s cubic-bezier(.2,.9,.3,1) .15s both;padding-right:4px}
@keyframes pj-infoin{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:none}}
.pj-no{margin:0;font-family:'VT323',monospace;font-size:clamp(15px,min(2.4cqw,3cqh),22px);letter-spacing:.1em;color:#f1c978}
.pj-name{margin:.05em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1.02;font-size:clamp(26px,min(5.2cqw,7.4cqh),56px);color:#fff0c8;text-shadow:0 3px 0 rgba(58,0,12,.7),0 0 20px rgba(255,200,90,.25)}
.pj-types{display:flex;flex-wrap:wrap;gap:6px;margin-top:.35em}
.pj-type{padding:.08em .8em;border-radius:999px;font-weight:700;font-size:clamp(11px,min(1.7cqw,2.2cqh),15px);letter-spacing:.06em;color:#fff;background:var(--c);box-shadow:0 2px 0 rgba(0,0,0,.4),inset 0 0 0 1.5px rgba(255,255,255,.35);text-shadow:0 1px 2px rgba(0,0,0,.5)}
.pj-tag{margin:.45em 0 0;font-style:italic;font-weight:700;font-size:clamp(13px,min(2.1cqw,2.8cqh),20px);color:#f4d9a8}
.pj-desc{margin:.3em 0 0;font-weight:600;line-height:1.38;font-size:clamp(13px,min(2cqw,2.7cqh),19px);color:#fbe9d2}
.pj-stats{display:grid;grid-template-columns:1fr 1fr;gap:clamp(3px,.8cqh,8px) clamp(10px,2cqw,26px);margin-top:clamp(6px,1.4cqh,14px)}
@container pj (aspect-ratio < 1.1){.pj-stats{gap:3px 12px}}
.pj-st{display:flex;align-items:center;gap:.5em;min-width:0}
.pj-sl{flex:none;width:clamp(78px,15cqw,150px);font-weight:700;font-size:clamp(11px,min(1.6cqw,2.1cqh),15px);color:#ffe9c9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@container pj (aspect-ratio < 1.1){.pj-sl{width:auto;flex:1}}
.pj-seg{display:flex;gap:2px;flex:none}
.pj-seg i{display:block;width:clamp(8px,1.5cqw,16px);height:clamp(7px,1.2cqh,11px);border-radius:2px;background:rgba(255,255,255,.12);transition:background .3s ease,box-shadow .3s ease}
.pj-seg i.on{background:linear-gradient(180deg,#fff3bf,#e8b84a 60%,#c98a1e);box-shadow:0 0 6px rgba(255,200,90,.7);transition-delay:var(--sd)}
.pj-ask{position:relative;z-index:2;flex:none}
.pj-menu{position:absolute;right:clamp(10px,2.4cqw,28px);bottom:calc(100% + clamp(6px,1.4cqh,14px));display:flex;flex-direction:column;gap:2px;padding:clamp(8px,1.4cqh,14px) clamp(14px,2.6cqw,28px) clamp(8px,1.4cqh,14px) clamp(26px,4cqw,40px);border-radius:10px;background:linear-gradient(180deg,#1d3a2e,#0f241c);box-shadow:0 0 0 3px #f6e7c1,0 0 0 6px #7a1b25,0 0 0 8px #e8b84a,0 12px 24px rgba(0,0,0,.6);z-index:5}
.pj-opt{position:relative;display:block;padding:.05em .8em;border:0;background:none;cursor:pointer;text-align:left;font-family:'VT323',monospace;font-size:clamp(20px,min(3.4cqw,4.6cqh),34px);color:#fff6e4;line-height:1.15;outline:none}
.pj-opt.on::before{content:"▶";position:absolute;left:-.9em;top:50%;transform:translateY(-52%);font-size:.8em;color:#f8dd86;animation:pj-blink .8s steps(1) infinite}
.pj-opt:focus-visible{background:rgba(255,255,255,.12);border-radius:6px}

/* opening of the bauble + final screen */
.pj-open{position:absolute;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;background:radial-gradient(70% 60% at 50% 45%,rgba(60,30,50,.94),rgba(8,4,10,.98));animation:pj-fade .4s ease both;overflow:hidden}
.pj-half{position:absolute;left:50%;top:50%;width:min(46cqw,40cqh);aspect-ratio:.86;margin-left:calc(min(46cqw,40cqh) / -2);margin-top:calc(min(46cqw,40cqh) / -1.72)}
.pj-half svg{display:block;width:100%;height:100%;overflow:visible}
.pj-half.t{clip-path:polygon(0 0,100% 0,100% 52%,0 52%);animation:pj-ht 1.7s ease both}
.pj-half.b{clip-path:polygon(0 52%,100% 52%,100% 100%,0 100%);animation:pj-hb 1.7s ease both}
@keyframes pj-ht{0%,36%{transform:none}46%{transform:translateX(-5px) rotate(-1.5deg)}56%{transform:translateX(5px) rotate(1.5deg)}100%{transform:translate(-26cqw,-30cqh) rotate(-60deg);opacity:0}}
@keyframes pj-hb{0%,36%{transform:none}46%{transform:translateX(5px) rotate(1.5deg)}56%{transform:translateX(-5px) rotate(-1.5deg)}100%{transform:translate(26cqw,26cqh) rotate(60deg);opacity:0}}
.pj-burst{position:absolute;left:50%;top:50%;width:70cqmin;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,226,140,.7) 35%,transparent 70%);animation:pj-bst 1.7s ease-out both}
@keyframes pj-bst{0%,48%{opacity:0;transform:translate(-50%,-50%) scale(.2)}60%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(2.4)}}
.pj-fin{position:absolute;inset:0;z-index:35;display:flex;flex-direction:column;animation:pj-fade .5s ease both}
.pj-fbody{flex:1 1 0;min-height:0;display:flex;align-items:center;justify-content:center;padding:clamp(34px,6cqh,56px) clamp(10px,3cqw,30px) 0}
.pj-cert{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr);gap:clamp(12px,3cqw,36px);align-items:center;width:min(100%,900px);max-height:100%;padding:clamp(12px,2.6cqh,26px) clamp(14px,3cqw,34px);border-radius:16px;color:#3b2410;
  background:radial-gradient(120% 100% at 30% 10%,#fffaf0,#f6e8cc 65%,#ead7ae);box-shadow:inset 0 0 60px rgba(150,100,40,.3),0 0 0 3px #d9a336,0 0 0 7px #7a4f10,0 30px 70px rgba(0,0,0,.7);animation:pj-cert 1s cubic-bezier(.2,.9,.3,1) .1s both}
@keyframes pj-cert{from{opacity:0;transform:translateY(30px) scale(.9)}to{opacity:1;transform:none}}
@container pj (aspect-ratio < 1.1){.pj-cert{grid-template-columns:1fr;justify-items:center;text-align:center}}
.pj-cert::before{content:"";position:absolute;inset:7px;border:1.5px dashed rgba(138,26,46,.4);border-radius:11px;pointer-events:none}
.pj-cert .pj-card{--ch:min(50cqh,38cqw);animation:none}
@container pj (aspect-ratio < 1.1){.pj-cert .pj-card{--ch:min(26cqh,46cqw)}}
.pj-ck{margin:0;font-family:'Cinzel',serif;font-weight:700;letter-spacing:.26em;text-transform:uppercase;font-size:clamp(9px,min(1.5cqw,1.9cqh),13px);color:#a8281f}
.pj-cn{margin:.1em 0 0;font-family:'Mountains of Christmas',cursive;font-weight:700;line-height:1.05;font-size:clamp(26px,min(5cqw,7cqh),52px);color:#8a1a2e}
.pj-cs{margin:.2em 0 0;font-style:italic;font-weight:700;font-size:clamp(14px,min(2.3cqw,3cqh),22px);color:#5a3a26}
.pj-cl{margin:.6em 0 0;font-weight:600;font-style:italic;line-height:1.4;font-size:clamp(13px,min(2cqw,2.7cqh),19px);color:#4a2a1e}
.pj-cd{margin:.5em 0 0;font-family:'Cinzel',serif;font-weight:700;font-size:clamp(10px,1.6cqw,13px);letter-spacing:.1em;color:#806344}
.pj-cf{margin:.3em 0 0;font-family:'Mountains of Christmas',cursive;font-size:clamp(14px,2.2cqw,19px);color:#b2285a}
.pj-stamp{position:absolute;right:clamp(10px,2cqw,24px);top:clamp(10px,2cqh,22px);width:clamp(54px,9cqw,92px);aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;font-family:'Cinzel',serif;font-weight:900;line-height:1.05;font-size:clamp(8px,1.4cqw,13px);letter-spacing:.06em;color:#b3202a;border:3px double #b3202a;transform:rotate(14deg);opacity:.85;animation:pj-stmp .6s cubic-bezier(.3,1.6,.5,1) 1.3s both}
@keyframes pj-stmp{from{opacity:0;transform:rotate(14deg) scale(2.4)}to{opacity:.85;transform:rotate(14deg)}}
.pj-others{flex:none;display:flex;align-items:center;justify-content:center;gap:clamp(6px,1.4cqw,14px);flex-wrap:wrap;margin:clamp(6px,1.2cqh,12px) 0 clamp(4px,1cqh,10px);padding:0 10px}
.pj-ot{font-size:clamp(10px,1.5cqw,13px);letter-spacing:.2em;text-transform:uppercase;font-weight:700;color:#f1c978}
.pj-mini{width:clamp(30px,5.4cqw,52px);aspect-ratio:1;border-radius:50%;overflow:hidden;border:2px solid rgba(246,210,122,.5);background:rgba(0,0,0,.4);opacity:.55;filter:grayscale(.6);padding:0;display:flex;align-items:center;justify-content:center}
.pj-mini img{width:100%;height:100%;object-fit:cover}
.pj-mini svg{width:88%;height:88%}
.pj-change{padding:.25em 1.2em;border-radius:999px;border:1.5px solid rgba(241,201,120,.6);background:rgba(0,0,0,.4);color:#f1c978;font-weight:700;font-style:italic;cursor:pointer;font-size:clamp(12px,1.9cqw,16px)}
.pj-change:hover{background:rgba(241,201,120,.2)}.pj-change:focus-visible{outline:2px solid #fff;outline-offset:3px}
.pj-conf{position:absolute;top:-6%;pointer-events:none;animation:pj-conf linear infinite;z-index:50}
@keyframes pj-conf{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(115cqh) rotate(720deg);opacity:.9}}

@media (prefers-reduced-motion: reduce){
  .pj-flake,.pj-lb,.pj-sway,.pj-arrow,.pj-opt.on::before,.pj-holo,.pj-conf{animation:none !important}
  .pj-slot,.pj-card,.pj-info,.pj-cert,.pj-stamp,.pj-half.t,.pj-half.b,.pj-burst,.pj-det,.pj-open,.pj-fin{animation-duration:.01s !important;animation-delay:0s !important}
}
`;

/* ------------------------------------------------------------------ */
/*  Art: baubles, professor, drawn pyjamas                             */
/* ------------------------------------------------------------------ */

function Bauble({ color, n, half }) {
  const id = `pjb${n}${half || ""}`;
  const dark = mix(color, "#000000", 0.45); const light = mix(color, "#ffffff", 0.7);
  return (
    <svg viewBox="0 0 110 128" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="35%" cy="28%" r="80%"><stop offset="0" stopColor={light} /><stop offset=".3" stopColor={color} /><stop offset="1" stopColor={dark} /></radialGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".5" stopColor="#e8b84a" /><stop offset="1" stopColor="#a8721f" /></linearGradient>
      </defs>
      <path d="M55 0V22" stroke="#e8b84a" strokeWidth="2" />
      <path d="M55 0C55 -8 70 -8 70 2" fill="none" stroke="#e8b84a" strokeWidth="2.4" />
      <rect x="42" y="18" width="26" height="16" rx="4" fill={`url(#${id}g)`} stroke="#8a5a12" />
      <circle cx="55" cy="78" r="48" fill={`url(#${id})`} />
      <path d="M8 74Q55 96 102 74" fill="none" stroke="#fff6e8" strokeWidth="8" strokeLinecap="round" opacity=".92" />
      <path d="M12 86Q55 108 98 86" fill="none" stroke="#e8b84a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="55" cy="90" r="11" fill={`url(#${id}g)`} stroke="#8a5a12" strokeWidth="1.5" />
      <text x="55" y="95" textAnchor="middle" fontFamily="Cinzel,serif" fontWeight="900" fontSize="14" fill="#6a0f1c">{n}</text>
      <path d="M26 52Q34 36 52 32" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function Professor() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" fill="#3a6a5a" />
      <circle cx="50" cy="58" r="26" fill="#f2c9a0" />
      <path d="M22 60Q24 90 50 98Q76 90 78 60Q66 74 50 74Q34 74 22 60Z" fill="#fff" stroke="#e5ebff" strokeWidth="2" />
      <path d="M36 66Q50 80 64 66Q50 70 36 66Z" fill="#fff" />
      <path d="M18 44Q22 10 50 8Q78 10 82 44L70 40Q50 30 30 40Z" fill="#d9262f" stroke="#a3121f" strokeWidth="2" />
      <rect x="20" y="38" width="60" height="12" rx="6" fill="#fff" stroke="#e5ebff" />
      <circle cx="80" cy="14" r="8" fill="#fff" stroke="#e5ebff" />
      <circle cx="41" cy="56" r="3.2" fill="#2a1710" /><circle cx="59" cy="56" r="3.2" fill="#2a1710" />
      <circle cx="40" cy="55" r="1" fill="#fff" /><circle cx="58" cy="55" r="1" fill="#fff" />
      <circle cx="50" cy="62" r="4" fill="#e8998a" /><circle cx="35" cy="63" r="4" fill="#f08a8a" opacity=".6" /><circle cx="65" cy="63" r="4" fill="#f08a8a" opacity=".6" />
      <path d="M37 52Q41 49 45 52M55 52Q59 49 63 52" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <rect x="33" y="50" width="14" height="12" rx="5" fill="none" stroke="#e8b84a" strokeWidth="1.8" /><rect x="53" y="50" width="14" height="12" rx="5" fill="none" stroke="#e8b84a" strokeWidth="1.8" /><path d="M47 55H53" stroke="#e8b84a" strokeWidth="1.8" />
    </svg>
  );
}

function PajamaArt({ art, id }) {
  const { kind, pattern, a, b, trim } = art;
  const pid = `pjp-${id}`;
  const pat = (() => {
    if (pattern === "tartan") return (<pattern id={pid} width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill={a} /><rect x="0" y="9" width="26" height="8" fill={b} opacity=".85" /><rect x="9" y="0" width="8" height="26" fill={b} opacity=".85" /><rect x="0" y="12" width="26" height="2" fill="#f6e7c1" opacity=".85" /><rect x="12" y="0" width="2" height="26" fill="#f6e7c1" opacity=".85" /></pattern>);
    if (pattern === "candy") return (<pattern id={pid} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="22" height="22" fill={b} /><rect width="11" height="22" fill={a} /></pattern>);
    if (pattern === "reindeer") return (<pattern id={pid} width="34" height="34" patternUnits="userSpaceOnUse"><rect width="34" height="34" fill={a} /><g transform="translate(17 19)"><path d="M-8 -6L-11 -14M-11 -14L-15 -12M-11 -14L-10 -19M8 -6L11 -14M11 -14L15 -12M11 -14L10 -19" stroke="#f6e7c1" strokeWidth="1.6" strokeLinecap="round" fill="none" /><ellipse rx="9" ry="8" fill="#c9733a" /><circle cx="-3.5" cy="-1.5" r="1.4" fill="#2a1710" /><circle cx="3.5" cy="-1.5" r="1.4" fill="#2a1710" /><circle cy="3.4" r="2.8" fill="#ff3b3b" /></g><circle cx="4" cy="6" r="1.2" fill="#f6e7c1" /><circle cx="30" cy="4" r="1.2" fill="#f6e7c1" /></pattern>);
    if (pattern === "snow") return (<pattern id={pid} width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill={a} /><g stroke={trim} strokeWidth="1.3" strokeLinecap="round" fill="none"><g transform="translate(9 9)"><path d="M0 -6V6M-5.2 -3L5.2 3M-5.2 3L5.2 -3" /></g><g transform="translate(23 22)"><path d="M0 -4V4M-3.5 -2L3.5 2M-3.5 2L3.5 -2" /></g></g><circle cx="24" cy="6" r="1.2" fill={trim} /><circle cx="5" cy="24" r="1.2" fill={trim} /></pattern>);
    if (pattern === "satin") return (<linearGradient id={pid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={mix(a, "#ffffff", 0.3)} /><stop offset=".35" stopColor={a} /><stop offset=".55" stopColor={mix(a, "#ffffff", 0.22)} /><stop offset="1" stopColor={b} /></linearGradient>);
    return (<linearGradient id={pid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix(a, "#ffffff", 0.25)} /><stop offset="1" stopColor={b} /></linearGradient>);
  })();
  const stroke = mix(a, "#000000", 0.45);
  if (kind === "onesie") {
    return (
      <svg className="art" viewBox="0 0 200 250" aria-hidden="true">
        <defs>{pat}</defs>
        <ellipse cx="100" cy="242" rx="62" ry="6" fill="#000" opacity=".35" />
        {/* ears + hood */}
        <circle cx="62" cy="34" r="20" fill={`url(#${pid})`} stroke={stroke} strokeWidth="2.5" /><circle cx="62" cy="34" r="11" fill="#f2b3a0" />
        <circle cx="138" cy="34" r="20" fill={`url(#${pid})`} stroke={stroke} strokeWidth="2.5" /><circle cx="138" cy="34" r="11" fill="#f2b3a0" />
        <path d="M40 120L24 112L16 168L36 176Z M160 120L176 112L184 168L164 176Z" fill={`url(#${pid})`} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M42 92Q42 126 52 150L50 232L92 232L100 190L108 232L150 232L148 150Q158 126 158 92Z" fill={`url(#${pid})`} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="100" cy="62" r="46" fill={`url(#${pid})`} stroke={stroke} strokeWidth="2.5" />
        <ellipse cx="100" cy="68" rx="32" ry="30" fill="#f6e7d4" /><circle cx="86" cy="62" r="4" fill="#2a1710" /><circle cx="114" cy="62" r="4" fill="#2a1710" /><ellipse cx="100" cy="74" rx="6" ry="4" fill="#7a3a3a" /><path d="M100 78Q94 86 88 82M100 78Q106 86 112 82" fill="none" stroke="#7a3a3a" strokeWidth="2" strokeLinecap="round" />
        <circle cx="78" cy="76" r="5" fill="#f08a8a" opacity=".5" /><circle cx="122" cy="76" r="5" fill="#f08a8a" opacity=".5" />
        <path d="M100 108V196" stroke={trim} strokeWidth="3" strokeDasharray="3 4" /><circle cx="100" cy="106" r="5" fill="#e8b84a" />
        <ellipse cx="100" cy="170" rx="30" ry="18" fill={mix(b, "#000000", 0.08)} opacity=".55" stroke={stroke} strokeWidth="1.5" />
        <ellipse cx="72" cy="238" rx="22" ry="8" fill={trim} stroke={stroke} strokeWidth="1.5" /><ellipse cx="128" cy="238" rx="22" ry="8" fill={trim} stroke={stroke} strokeWidth="1.5" />
        <path d="M58 120Q70 110 84 118" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className="art" viewBox="0 0 200 250" aria-hidden="true">
      <defs>{pat}</defs>
      <ellipse cx="100" cy="242" rx="66" ry="6" fill="#000" opacity=".35" />
      {/* trousers */}
      <path d="M56 134L144 134L150 236L106 236L100 168L94 236L50 236Z" fill={`url(#${pid})`} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M52 222H98M102 222H148" stroke={trim} strokeWidth="9" opacity=".95" /><path d="M56 134H144" stroke={trim} strokeWidth="6" />
      {/* top */}
      <path d="M62 18L90 12Q100 22 110 12L138 18L180 74L162 92L144 74L144 138L56 138L56 74L38 92L20 74Z" fill={`url(#${pid})`} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M90 12Q100 40 110 12" fill="#f2d8c0" stroke={stroke} strokeWidth="2" /><path d="M100 28V138" stroke={trim} strokeWidth="2.5" strokeDasharray="2 3" />
      {[50, 76, 102].map((y) => <circle key={y} cx="100" cy={y} r="3.2" fill={trim} stroke={stroke} />)}
      <path d="M22 76L40 94M178 76L160 94" stroke={trim} strokeWidth="9" />
      <path d="M62 18L90 12M110 12L138 18" stroke={trim} strokeWidth="5" />
      <path d="M70 40Q80 30 92 34M64 100Q74 92 84 98" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function Media({ p, i }) {
  return p.src ? <img src={p.src} alt={p.name} draggable={false} /> : <PajamaArt art={p.art} id={`${p.id}${i}`} />;
}

function TradingCard({ p, i, caption }) {
  return (
    <div className="pj-card" style={{ "--c": p.color }}>
      <div className="pj-cin">
        <div className="pj-ctop"><span>{TEXTS.num(i)}</span><span style={{ opacity: 0.85 }}>{p.types[0]}</span></div>
        <div className="pj-cart"><Media p={p} i={i} /><span className="pj-holo" aria-hidden="true" /></div>
        <div className="pj-cbot">{caption || p.tagline}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dialogue box                                                       */
/* ------------------------------------------------------------------ */

function Dialog({ text, children }) {
  const tw = useTypewriter(text);
  return (
    <div className="pj-dlg" role="status" aria-live="polite" onClick={tw.skip}>
      <div className="pj-portrait"><Professor /></div>
      <p className="pj-dtext">{tw.shown}</p>
      {tw.done && <span className="pj-arrow" aria-hidden="true">{TEXTS.next}</span>}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PyjamaChoice() {
  const saved = useMemo(readChoice, []);
  const [stage, setStage] = useState(saved ? "final" : "table"); // table → detail → opening → final
  const [chosenId, setChosenId] = useState(saved ? saved.id : null);
  const [chosenDate, setChosenDate] = useState(saved ? saved.date : "");
  const [sel, setSel] = useState(null);
  const [focus, setFocus] = useState(0);
  const [seen, setSeen] = useState(() => new Set());
  const [yes, setYes] = useState(true);
  const [msg, setMsg] = useState("intro");
  const [filled, setFilled] = useState(false);
  const timers = useRef([]);
  const sound = useSound();
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };

  const openDetail = (i) => {
    sound.ensure(); sound.cry(i);
    setSel(i); setYes(true); setFilled(false); setStage("detail");
    setSeen((s) => new Set(s).add(PIJAMAS[i].id));
    later(() => setFilled(true), 250);
  };
  const decline = () => { sound.no(); setStage("table"); setMsg("no"); setSel(null); };
  const accept = () => {
    const p = PIJAMAS[sel];
    const date = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    sound.select();
    setChosenId(p.id); setChosenDate(date); saveChoice({ id: p.id, date });
    setStage("opening");
    later(() => sound.fanfare(), 700);
    later(() => { setStage("final"); }, 2300);
  };
  const reset = () => { clearChoice(); setChosenId(null); setSel(null); setMsg("again"); setStage("table"); };

  useEffect(() => {
    const onKey = (e) => {
      if (stage === "table") {
        if (e.key === "ArrowRight") { setFocus((f) => (f + 1) % PIJAMAS.length); sound.blip(); }
        if (e.key === "ArrowLeft") { setFocus((f) => (f + PIJAMAS.length - 1) % PIJAMAS.length); sound.blip(); }
      } else if (stage === "detail") {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") { setYes((v) => !v); sound.blip(); }
        if (e.key === "Escape") decline();
        if (e.key === "Enter" && document.activeElement === document.body) { yes ? accept() : decline(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const flakes = useMemo(() => { const r = rng(5); return Array.from({ length: 26 }, (_, i) => ({ id: i, left: r() * 100, size: r() * 4 + 2, dur: r() * 7 + 9, delay: -r() * 14, o: 0.25 + r() * 0.5 })); }, []);
  const bulbs = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ id: i, x: (i + 0.5) * (100 / 22), y: 8 + Math.abs(Math.sin(i * 0.8)) * 10, c: ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"][i % 5] })), []);
  const confetti = useMemo(() => { const r = rng(9); return Array.from({ length: 38 }, (_, i) => ({ id: i, left: r() * 100, c: ["#ffd45a", "#d9362f", "#35a35c", "#f6e7c1", "#7dd3fc", "#ff9ad5"][i % 6], dur: 4 + r() * 4, delay: -r() * 6, w: 6 + r() * 6 })); }, []);

  const p = sel !== null ? PIJAMAS[sel] : null;
  const chosenIdx = PIJAMAS.findIndex((x) => x.id === chosenId);
  const chosen = chosenIdx >= 0 ? PIJAMAS[chosenIdx] : null;

  const tableText = msg === "no" ? TEXTS.noPrompt : msg === "again" ? TEXTS.prompt : seen.size === 0 ? `${TEXTS.intro} ${TEXTS.prompt}` : TEXTS.prompt;

  return (
    <section className="pj max-w-full max-h-full">
      <style>{CSS}</style>

      {/* Santa's workshop wall */}
      <svg className="pj-wall" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="pjWallG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b1030" /><stop offset=".6" stopColor="#3a1c2a" /><stop offset="1" stopColor="#4a2414" /></linearGradient>
          <radialGradient id="pjWarm"><stop offset="0" stopColor="#ffb347" stopOpacity=".5" /><stop offset="1" stopColor="#ffb347" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="800" height="450" fill="url(#pjWallG)" />
        <rect y="0" width="800" height="450" fill="repeating-linear-gradient(90deg,#000 0 1px,transparent 1px 40px)" opacity="0" />
        {Array.from({ length: 20 }, (_, i) => <rect key={i} x={i * 40 + 4} y="0" width="2" height="360" fill="#000" opacity=".12" />)}
        {/* window */}
        <g transform="translate(60 70)"><rect width="150" height="180" rx="8" fill="#e8b84a" /><rect x="8" y="8" width="134" height="164" rx="4" fill="#0a0d28" />{[[30, 30], [90, 50], [60, 90], [112, 30], [40, 130]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" fill="#fff6d8" />)}<circle cx="112" cy="40" r="12" fill="#fff6dc" /><path d="M8 140Q75 120 142 140V172H8Z" fill="#e8eeff" /><path d="M75 8V172M8 90H142" stroke="#e8b84a" strokeWidth="5" /></g>
        {/* shelves with presents */}
        <g transform="translate(560 60)"><rect x="0" y="120" width="200" height="8" fill="#8a5a34" /><rect x="0" y="40" width="200" height="8" fill="#8a5a34" />
          {[[10, "#d9262f"], [48, "#2f6fd0"], [84, "#1f9a62"], [130, "#8a4fd0"], [162, "#e8b84a"]].map(([x, c], i) => <g key={i}><rect x={x} y={i % 2 ? 2 : 6} width="30" height={i % 2 ? 38 : 34} rx="3" fill={c} /><rect x={x + 12} y={i % 2 ? 2 : 6} width="6" height={i % 2 ? 38 : 34} fill="#f6e7c1" /></g>)}
          {[[14, "#f2b632"], [60, "#d9262f"], [112, "#4a7fe0"], [150, "#e0527f"]].map(([x, c], i) => <g key={i}><rect x={x} y="86" width="34" height="34" rx="3" fill={c} /><rect x={x + 14} y="86" width="6" height="34" fill="#fff6e8" /></g>)}</g>
        <circle cx="400" cy="260" r="260" fill="url(#pjWarm)" opacity=".5" />
        {/* garland across the wall */}
        <path d="M0 40Q100 80 200 40T400 40T600 40T800 40" fill="none" stroke="#0f4a2c" strokeWidth="10" strokeLinecap="round" opacity=".7" />
        <rect x="0" y="360" width="800" height="90" fill="#2a1409" /><rect x="0" y="356" width="800" height="6" fill="#d9a336" opacity=".7" />
      </svg>
      {flakes.map((f) => <span key={f.id} className="pj-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true" />)}
      <div className="pj-lights" aria-hidden="true">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}><path d={`M0 2 ${bulbs.map((b) => `L${b.x} ${b.y}`).join(" ")} L100 2`} fill="none" stroke="#e8c878" strokeOpacity=".6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" /></svg>
        {bulbs.map((b) => <span key={b.id} className="pj-lb" style={{ left: `${b.x}%`, top: b.y * 1.1, background: b.c, boxShadow: `0 0 12px 3px ${b.c}`, animationDelay: `${(b.id % 5) * 0.4}s` }} />)}
      </div>
      <button type="button" className="pj-snd" onClick={() => sound.setOn(!sound.on)} aria-pressed={sound.on} aria-label={TEXTS.sound}>{sound.on ? "♫" : "♪"}</button>

      <header className="pj-head">
        <p className="pj-kick">{TEXTS.kicker}</p>
        <h1 className="pj-title">{TEXTS.title}</h1>
        {stage === "table" && <span className="pj-dexchip">{TEXTS.dex(seen.size, PIJAMAS.length)}</span>}
      </header>

      {/* 1) the table */}
      {(stage === "table" || stage === "detail" || stage === "opening") && (
        <>
          <div className="pj-scene">
            <div className="pj-table">
              <span className="pj-woodtable" aria-hidden="true" />
              {PIJAMAS.map((pj, i) => (
                <div key={pj.id} className={`pj-slot ${sel === i ? "sel" : ""}`} style={{ "--d": `${0.15 + i * 0.1}s` }}>
                  <button type="button" className="pj-bauble" onClick={() => stage === "table" && openDetail(i)} onMouseEnter={() => { setFocus(i); }} onFocus={() => setFocus(i)} aria-label={`${pj.name}. ${seen.has(pj.id) ? TEXTS.seen : ""}`} tabIndex={stage === "table" ? 0 : -1}>
                    <span className="pj-sway" style={{ display: "block", animationDelay: `${-i * 0.7}s` }}><Bauble color={pj.color} n={i + 1} /></span>
                    {seen.has(pj.id) && <span className="pj-seen" aria-hidden="true">✓</span>}
                  </button>
                  <span className="pj-ped" aria-hidden="true" />
                  <span className="pj-lbl" style={{ opacity: focus === i ? 1 : 0.7 }}>{seen.has(pj.id) ? pj.name : `Pijama ${i + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
          <Dialog key={`t${msg}${seen.size === 0}`} text={tableText} />
        </>
      )}

      {/* 2) starter-style detail screen */}
      {stage === "detail" && p && (
        <div className="pj-det" role="dialog" aria-modal="true" aria-label={p.name}>
          <div className="pj-body">
            <TradingCard p={p} i={sel} />
            <div className="pj-info">
              <p className="pj-no">{TEXTS.num(sel)}</p>
              <h2 className="pj-name">{p.name}</h2>
              <div className="pj-types">{p.types.map((t) => <span key={t} className="pj-type" style={{ "--c": TYPE_COLORS[t] || "#8a4fd0" }}>{t}</span>)}</div>
              <p className="pj-desc">{p.desc}</p>
              <div className="pj-stats">
                {STATS.map((s, k) => (
                  <div key={s.k} className="pj-st">
                    <span className="pj-sl"><span aria-hidden="true">{s.icon}</span> {s.label}</span>
                    <span className="pj-seg" role="img" aria-label={`${s.label}: ${p.stats[s.k]} de 5`}>
                      {[1, 2, 3, 4, 5].map((n) => <i key={n} className={filled && n <= p.stats[s.k] ? "on" : ""} style={{ "--sd": `${k * 0.08 + n * 0.05}s` }} />)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pj-ask">
            <div className="pj-menu" role="group" aria-label={TEXTS.ask(p.name)}>
              <button type="button" className={`pj-opt ${yes ? "on" : ""}`} onMouseEnter={() => setYes(true)} onClick={accept} autoFocus>{TEXTS.yes}</button>
              <button type="button" className={`pj-opt ${!yes ? "on" : ""}`} onMouseEnter={() => setYes(false)} onClick={decline}>{TEXTS.no}</button>
            </div>
            <Dialog key={`a${sel}`} text={TEXTS.ask(p.name)} />
          </div>
        </div>
      )}

      {/* 3) the bauble opens */}
      {stage === "opening" && chosen && (
        <div className="pj-open" aria-hidden="true">
          <div className="pj-half b"><Bauble color={chosen.color} n={chosenIdx + 1} half="b" /></div>
          <div className="pj-burst" />
          <div className="pj-half t"><Bauble color={chosen.color} n={chosenIdx + 1} half="t" /></div>
        </div>
      )}

      {/* 4) the chosen pyjama: official certificate */}
      {stage === "final" && chosen && (
        <div className="pj-fin">
          {confetti.map((c) => <span key={c.id} className="pj-conf" style={{ left: `${c.left}%`, width: c.w, height: c.w * 1.5, background: c.c, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} aria-hidden="true" />)}
          <div className="pj-fbody">
            <div className="pj-cert">
              <TradingCard p={chosen} i={chosenIdx} caption={TEXTS.certSub} />
              <div>
                <p className="pj-ck">{TEXTS.certTitle}</p>
                <p className="pj-cs" style={{ marginTop: ".5em" }}>{TEXTS.certSub}</p>
                <h2 className="pj-cn">{chosen.name}</h2>
                <div className="pj-types" style={{ justifyContent: "inherit" }}>{chosen.types.map((t) => <span key={t} className="pj-type" style={{ "--c": TYPE_COLORS[t] || "#8a4fd0" }}>{t}</span>)}</div>
                <p className="pj-cl">{TEXTS.chosenLine(chosen.name)}</p>
                <p className="pj-cd">{TEXTS.certDate(chosenDate)}</p>
                <p className="pj-cf">{TEXTS.certNote}</p>
              </div>
              <span className="pj-stamp" aria-hidden="true">PIJAMA<br />OFICIAL</span>
            </div>
          </div>
          <div className="pj-others">
            <span className="pj-ot">{TEXTS.others}</span>
            {PIJAMAS.map((x, i) => x.id !== chosen.id && <span key={x.id} className="pj-mini" title={x.name}><Media p={x} i={i + 20} /></span>)}
            {!LOCKED && <button type="button" className="pj-change" onClick={reset}>{TEXTS.change}</button>}
          </div>
        </div>
      )}
    </section>
  );
}