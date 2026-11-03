import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const compliments = [
  "Eres más brillante que el trasero de un reno con purpurina.",
  "Si fueras un copo de nieve, serías el único que sabe bailar salsa.",
  "Papá Noel te tiene envidia porque tú repartes más alegría que él.",
  "Eres tan increíble que hasta los elfos hacen cola para conocerte.",
  "Tu sonrisa podría derretir un iceberg en pleno invierno.",
  "Si fueras un árbol de Navidad, serías el que tiene todas las luces del universo.",
  "Eres más dulce que un chocolate caliente con veinte cucharadas de azúcar.",
  "Los renos se ponen gafas de sol cuando te ven porque brillas demasiado.",
  "Si la belleza fuera un deporte, ya tendrías tu propio estadio en el Polo Norte.",
  "Hasta el Grinch sonreiría si te viera entrar en una habitación.",
  "Eres la razón por la que las estrellas quieren decorar el cielo.",
  "Tienes más magia que un calcetín navideño lleno de patatas fritas.",
];

const IDLE = "¡Introduce una moneda de amor y pulsa el botón!";
const SPIN_MS = 1600;

/* Random draw without repeats: every compliment comes out once
   (in a new random order) before any of them can come out again. */
function makeBag(lastIndex) {
  const bag = compliments.map((_, i) => i);
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  if (bag.length > 1 && bag[bag.length - 1] === lastIndex) {
    [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
  }
  return bag;
}

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=VT323&display=swap');

.cm{container-type:size;position:relative;isolation:isolate;height:100%;min-height:100svh;width:100%;overflow:hidden;display:flex;align-items:center;justify-content:center;color:#fff6e4;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;
  background:radial-gradient(120% 90% at 50% 20%,#1f4d3a 0%,#122b22 52%,#07130f 100%)}
.cm-glow{position:absolute;inset:0;pointer-events:none;z-index:0;background:
  radial-gradient(circle at 8% 24%,rgba(255,190,100,.26) 0 6cqw,transparent 7cqw),
  radial-gradient(circle at 94% 20%,rgba(255,190,100,.22) 0 7cqw,transparent 8cqw),
  radial-gradient(circle at 90% 86%,rgba(217,54,47,.26) 0 8cqw,transparent 9cqw),
  radial-gradient(circle at 6% 88%,rgba(255,225,150,.16) 0 7cqw,transparent 8cqw),
  radial-gradient(40% 50% at 50% 55%,rgba(255,200,120,.16),transparent 70%)}
.cm-flake{position:absolute;top:-4%;border-radius:50%;background:#fff;pointer-events:none;animation:cm-fall linear infinite;z-index:1}
@keyframes cm-fall{0%{transform:translate(0,0)}50%{transform:translate(14px,55cqh)}100%{transform:translate(-8px,110cqh)}}
.cm-lights{position:absolute;left:0;right:0;top:0;height:40px;pointer-events:none;z-index:2}
.cm-lb{position:absolute;width:9px;height:12px;border-radius:50% 50% 45% 45%;animation:cm-tw 2.6s ease-in-out infinite}
@keyframes cm-tw{0%,100%{opacity:1}50%{opacity:.4}}
.cm-floor{position:absolute;left:0;right:0;bottom:0;height:12%;z-index:1;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(255,255,255,.12) 40%,rgba(210,225,255,.4));border-radius:50% 50% 0 0/40% 40% 0 0}

.cm-stage{position:relative;z-index:3;width:100%;height:100%;display:flex;align-items:center;justify-content:center}
.cm-machine{position:relative;container-type:inline-size;width:min(92cqw,58cqh);aspect-ratio:1/1.58;animation:cm-in .9s cubic-bezier(.2,.9,.3,1) both}
@keyframes cm-in{from{opacity:0;transform:translateY(26px) scale(.96)}to{opacity:1;transform:none}}
.cm-machine.shake{animation:cm-shake .35s linear infinite}
@keyframes cm-shake{0%,100%{transform:translate(0,0) rotate(0)}20%{transform:translate(-3px,1px) rotate(-.5deg)}40%{transform:translate(3px,-1px) rotate(.5deg)}60%{transform:translate(-2px,0) rotate(-.3deg)}80%{transform:translate(2px,1px) rotate(.3deg)}}
.cm-hat{position:absolute;z-index:12;left:-4cqw;top:-9cqw;width:25cqw;transform:rotate(-18deg);pointer-events:none;filter:drop-shadow(0 4px 6px rgba(0,0,0,.5))}

/* cabinet */
.cm-frame{position:absolute;inset:0;border-radius:9cqw 9cqw 5cqw 5cqw;padding:1.8cqw;background:linear-gradient(135deg,#fff0a8,#d9a336 25%,#7a4f10 50%,#f1cd6a 75%,#a8721f);box-shadow:0 30px 60px rgba(0,0,0,.6),0 0 70px rgba(255,190,100,.22)}
.cm-cab{position:relative;box-sizing:border-box;height:100%;border-radius:7.6cqw 7.6cqw 3.6cqw 3.6cqw;overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:3.4cqw 9cqw 2.4cqw;gap:1.6cqw;
  background:radial-gradient(circle at 2px 2px,rgba(255,214,120,.16) 1px,transparent 1.6px) 0 0/16px 16px,linear-gradient(180deg,#d62b37,#a3121f 45%,#7a0c17);box-shadow:inset 0 0 6cqw rgba(0,0,0,.5)}
.cm-cane{position:absolute;top:0;bottom:0;width:5.2cqw;z-index:1;background:repeating-linear-gradient(45deg,#c8202e 0 2.2cqw,#fff6e8 2.2cqw 4.4cqw);box-shadow:0 0 12px rgba(0,0,0,.5),inset 0 0 6px rgba(0,0,0,.35)}
.cm-cane.l{left:1.4cqw;border-radius:2.6cqw}.cm-cane.r{right:1.4cqw;border-radius:2.6cqw}
.cm-cane::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(90deg,rgba(255,255,255,.35),transparent 40%,rgba(0,0,0,.25))}

.cm-marq{position:relative;flex:none;width:100%;text-align:center;padding:1cqw 0;border-radius:2cqw;background:linear-gradient(180deg,#2b0a10,#14050a);box-shadow:0 0 0 .5cqw #d9a336,0 1cqw 2cqw rgba(0,0,0,.5);z-index:2}
.cm-marq p{margin:0;font-weight:700;letter-spacing:.3em;font-size:3.1cqw;background:linear-gradient(180deg,#fffbe0,#f8dd86 45%,#d9a336);-webkit-background-clip:text;background-clip:text;color:transparent}
.cm-pb{position:absolute;width:1.4cqw;aspect-ratio:1;border-radius:50%;animation:cm-chase 1.4s steps(1) infinite}
@keyframes cm-chase{0%,100%{background:#fff3bf;box-shadow:0 0 6px 1px #ffd45a}50%{background:#6b4a14;box-shadow:none}}
.cm-title{margin:0;flex:none;text-align:center;line-height:.92;z-index:2}
.cm-title span{display:block;font-weight:700}
.cm-title .a{font-size:7.4cqw;color:#fff1d6;text-shadow:0 .5cqw 0 rgba(90,8,20,.7)}
.cm-title .b{font-size:12cqw;background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 .6cqw 0 rgba(58,0,12,.8)) drop-shadow(0 0 3cqw rgba(255,200,90,.35))}
.cm-sub{margin:0;flex:none;text-align:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;font-size:3.3cqw;color:#ffe9c9;text-shadow:0 1px 4px rgba(0,0,0,.6);z-index:2}

/* dome with baubles */
.cm-domewrap{position:relative;flex:1.25 1 0;min-height:0;display:flex;align-items:center;justify-content:center;z-index:2}
.cm-dome{position:relative;height:100%;aspect-ratio:1;max-width:100%;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 60%,#2b0a14,#0f0308);box-shadow:inset 0 0 4cqw rgba(0,0,0,.8),0 0 0 1cqw #d9a336,0 0 0 1.6cqw #5a3a0c,0 1.5cqw 3cqw rgba(0,0,0,.5)}
.cm-pile{position:absolute;inset:0;animation:cm-sway 5s ease-in-out infinite alternate}
.cm-machine.shake .cm-pile{animation:cm-tumble .45s linear infinite}
@keyframes cm-sway{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}
@keyframes cm-tumble{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.cm-bl{position:absolute;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0,currentColor 30%,#000 130%);box-shadow:inset -.4cqw -.4cqw .8cqw rgba(0,0,0,.4);animation:cm-bob 2.4s ease-in-out infinite alternate}
.cm-bl::before{content:"";position:absolute;left:35%;top:-9%;width:30%;height:14%;border-radius:2px;background:linear-gradient(180deg,#fff3bf,#a8721f)}
@keyframes cm-bob{from{transform:translateY(0) rotate(0)}to{transform:translateY(-5%) rotate(12deg)}}
.cm-glass{position:absolute;inset:0;border-radius:50%;pointer-events:none;background:radial-gradient(ellipse 40% 24% at 32% 20%,rgba(255,255,255,.65),transparent 70%),radial-gradient(circle at 50% 50%,transparent 60%,rgba(255,255,255,.16) 100%)}

/* display */
.cm-display{position:relative;flex:1.5 1 0;min-height:0;width:100%;border-radius:2.4cqw;padding:1.4cqw;background:linear-gradient(135deg,#5a3a1c,#2b1a0c);box-shadow:0 1cqw 2cqw rgba(0,0,0,.5),inset 0 0 0 .4cqw #a8721f;z-index:2}
.cm-screen{position:relative;height:100%;border-radius:1.6cqw;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;padding:1.6cqw 2.4cqw;background:radial-gradient(circle,#1c1305,#0a0603 80%);box-shadow:inset 0 0 4cqw #000}
.cm-screen::after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.32) 0 1px,transparent 1px 3px),radial-gradient(ellipse at 30% 10%,rgba(255,255,255,.1),transparent 50%)}
.cm-text{margin:0;font-family:'VT323','Courier New',monospace;line-height:1.02;color:#ffd36b;text-shadow:0 0 .8cqw rgba(255,190,70,.9),0 0 2.4cqw rgba(255,150,30,.5)}
.cm-caret{display:inline-block;width:.5em;height:.85em;margin-left:.1em;background:#ffd36b;vertical-align:-.1em;animation:cm-blink .8s steps(1) infinite;box-shadow:0 0 .8cqw #ffb347}
@keyframes cm-blink{50%{opacity:0}}
.cm-wait{display:flex;flex-direction:column;align-items:center;gap:.6cqw}
.cm-wait svg{width:9cqw;animation:cm-spin 1.4s linear infinite;filter:drop-shadow(0 0 1cqw rgba(255,190,70,.8))}
@keyframes cm-spin{to{transform:rotate(360deg)}}

/* controls */
.cm-controls{flex:none;width:100%;margin-top:1.4cqw;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:2cqw;z-index:2;height:15.5cqw}
.cm-slotbox{display:flex;flex-direction:column;align-items:center;gap:.8cqw}
.cm-slot{position:relative;width:13cqw;height:5cqw;border-radius:1cqw;background:linear-gradient(180deg,#fff0a8,#d9a336 50%,#8a5a12);box-shadow:0 .5cqw 1cqw rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center}
.cm-slot::before{content:"";width:8cqw;height:1cqw;border-radius:1cqw;background:#120504;box-shadow:inset 0 0 .6cqw #000,0 0 1.6cqw rgba(255,214,120,.55)}
.cm-slot-l{margin:0;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:2.3cqw;letter-spacing:.14em;color:#ffe9c9;text-align:center;line-height:1.1;text-shadow:0 1px 3px #000}
.cm-coin{position:absolute;left:50%;top:-6cqw;width:5.4cqw;margin-left:-2.7cqw;opacity:0;color:#ff5d8f;filter:drop-shadow(0 0 1cqw #ffd45a)}
.cm-coin.drop{animation:cm-coin .75s cubic-bezier(.4,0,.6,1) both}
@keyframes cm-coin{0%{opacity:0;transform:translateY(-3cqw) rotateY(0)}15%{opacity:1}70%{opacity:1;transform:translateY(5.6cqw) rotateY(540deg)}100%{opacity:0;transform:translateY(6.6cqw) rotateY(720deg) scale(.6)}}
.cm-btnwrap{display:flex;flex-direction:column;align-items:center;gap:.8cqw}
.cm-btn{position:relative;width:15cqw;aspect-ratio:1;border:0;padding:0;border-radius:50%;cursor:pointer;-webkit-tap-highlight-color:transparent;background:radial-gradient(circle at 50% 50%,#7a0c17 0 100%);box-shadow:0 0 0 1.2cqw #d9a336,0 0 0 1.8cqw #5a3a0c,0 1.6cqw 3cqw rgba(0,0,0,.6)}
.cm-cap{position:absolute;inset:1cqw;border-radius:50%;background:radial-gradient(circle at 35% 28%,#ff9a9a,#e0303a 45%,#a3121f 85%);box-shadow:0 1.4cqw 0 #6e0c16,0 1.8cqw 2cqw rgba(0,0,0,.5),inset 0 .6cqw 1cqw rgba(255,255,255,.35);transition:transform .12s ease,box-shadow .12s ease}
.cm-btn:not(:disabled) .cm-cap{animation:cm-btnglow 2s ease-in-out infinite}
@keyframes cm-btnglow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.22) drop-shadow(0 0 1.6cqw #ff6b6b)}}
.cm-btn:active:not(:disabled) .cm-cap,.cm-btn:disabled .cm-cap{transform:translateY(1.2cqw);box-shadow:0 .2cqw 0 #6e0c16,0 .6cqw 1cqw rgba(0,0,0,.5),inset 0 .6cqw 1cqw rgba(255,255,255,.2)}
.cm-btn:disabled{cursor:wait}.cm-btn:focus-visible{outline:.6cqw solid #fff;outline-offset:1cqw}
.cm-btn-l{margin:0;font-weight:700;letter-spacing:.12em;font-size:3.4cqw;color:#fff1d6;text-shadow:0 .4cqw 0 rgba(90,8,20,.8)}
.cm-leds{display:flex;flex-direction:column;align-items:center;gap:1.2cqw}
.cm-led{width:3.2cqw;aspect-ratio:1;border-radius:50%;box-shadow:inset 0 -.3cqw .5cqw rgba(0,0,0,.4)}
.cm-led.r{background:#ff3b3b;box-shadow:0 0 1.6cqw #ff3b3b}.cm-led.y{background:#ffd45a;box-shadow:0 0 1.6cqw #ffd45a}.cm-led.g{background:#4ade80;box-shadow:0 0 1.6cqw #4ade80}
.cm-leds.go .cm-led{animation:cm-led .3s steps(1) infinite}
.cm-leds.go .cm-led.y{animation-delay:.1s}.cm-leds.go .cm-led.g{animation-delay:.2s}
@keyframes cm-led{0%,100%{opacity:1}50%{opacity:.15}}

/* tray + counter */
.cm-tray{position:relative;flex:1 1 0;min-height:0;width:100%;border-radius:2cqw;background:linear-gradient(180deg,#0e0305,#2a0a10);box-shadow:inset 0 1.4cqw 2.4cqw #000,0 0 0 .6cqw #d9a336;z-index:2;display:flex;align-items:flex-end;justify-content:center;overflow:hidden}
.cm-tray::before{content:"";position:absolute;left:8%;right:8%;top:0;height:22%;border-radius:0 0 2cqw 2cqw;background:rgba(255,255,255,.07)}
.cm-out{position:absolute;left:0;right:0;top:.8cqw;text-align:center;font-family:'Cormorant Garamond',serif;font-weight:700;letter-spacing:.4em;font-size:2.1cqw;color:rgba(255,233,201,.5)}
.cm-drop{position:relative;height:84%;aspect-ratio:1;margin-bottom:.4cqw;animation:cm-fallin .8s cubic-bezier(.3,1.2,.5,1) both}
@keyframes cm-fallin{0%{transform:translateY(-34cqw);opacity:0}15%{opacity:1}60%{transform:translateY(0)}75%{transform:translateY(-3cqw)}100%{transform:translateY(0)}}
.cm-plate{flex:none;width:100%;display:flex;align-items:center;justify-content:center;gap:2cqw;padding:1cqw 2cqw;border-radius:2cqw;background:linear-gradient(180deg,#fff0a8,#d9a336 55%,#a8721f);color:#4a1420;box-shadow:0 .8cqw 1.6cqw rgba(0,0,0,.45);z-index:2}
.cm-plate b{font-family:'Cormorant Garamond',serif;font-size:2.7cqw;letter-spacing:.1em;font-weight:700;line-height:1.1;text-align:left}
.cm-odo{display:flex;gap:.7cqw}
.cm-odo i{display:block;width:5cqw;height:7cqw;border-radius:1cqw;background:linear-gradient(180deg,#1a1006 0%,#3a2a14 48%,#120a03 52%,#2a1c0c 100%);color:#ffd36b;font:normal 6cqw/7cqw 'VT323',monospace;text-align:center;box-shadow:inset 0 0 1cqw #000,0 .2cqw 0 rgba(255,255,255,.4);overflow:hidden}
.cm-odo i span{display:block;animation:cm-roll .5s cubic-bezier(.3,1.4,.5,1) both}
@keyframes cm-roll{from{transform:translateY(-100%);opacity:0}to{transform:none;opacity:1}}
.cm-made{margin:0;flex:none;text-align:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;font-size:2.7cqw;color:#ffe9c9;z-index:2;text-shadow:0 1px 3px rgba(0,0,0,.6)}
.cm-snd{position:absolute;right:-3cqw;top:2cqw;z-index:14;width:8cqw;height:8cqw;min-width:30px;min-height:30px;border-radius:50%;border:1.5px solid rgba(246,210,122,.7);background:rgba(0,0,0,.5);color:#f8dd86;cursor:pointer;font-size:3.6cqw}
.cm-snd:hover{background:rgba(246,210,122,.25)}.cm-snd:focus-visible{outline:2px solid #fff;outline-offset:2px}
.cm-side{position:absolute;bottom:3%;z-index:3;pointer-events:none}

@media (prefers-reduced-motion: reduce){
  .cm-flake,.cm-lb,.cm-pile,.cm-bl,.cm-pb,.cm-caret,.cm-wait svg,.cm-btn:not(:disabled) .cm-cap,.cm-leds.go .cm-led,.cm-machine.shake,.cm-machine.shake .cm-pile{animation:none !important}
  .cm-machine,.cm-drop,.cm-coin.drop,.cm-odo i span{animation-duration:.01s !important}
}
`;

/* ------------------------------------------------------------------ */
/*  Small SVG pieces                                                   */
/* ------------------------------------------------------------------ */

const HEART = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

function Hat() {
  return (
    <svg className="cm-hat" viewBox="0 0 120 100" aria-hidden="true">
      <path d="M12 82C14 40 52 8 98 22C86 30 80 50 84 82Z" fill="#d9262f" stroke="#a3121f" strokeWidth="3" strokeLinejoin="round" />
      <path d="M30 70C40 40 62 24 84 22" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="5" strokeLinecap="round" />
      <rect x="6" y="74" width="86" height="24" rx="12" fill="#fff6e8" stroke="#e8dcc4" strokeWidth="2" />
      <circle cx="100" cy="24" r="13" fill="#fff6e8" stroke="#e8dcc4" strokeWidth="2" />
      {[[18, 86], [34, 90], [52, 86], [70, 90], [84, 86]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#e8dcc4" />)}
    </svg>
  );
}

function Snowflake() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <g stroke="#ffd36b" strokeWidth="2.6" strokeLinecap="round" fill="none">
        {[0, 60, 120].map((r) => (
          <g key={r} transform={`rotate(${r} 20 20)`}>
            <path d="M20 3V37" /><path d="M20 9L15 5M20 9L25 5M20 31L15 35M20 31L25 35" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function Capsule({ color }) {
  return (
    <svg viewBox="0 0 60 70" style={{ height: "100%" }} aria-hidden="true">
      <defs>
        <radialGradient id={`cmCap${color.slice(1)}`} cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset=".3" stopColor={color} /><stop offset="1" stopColor="#000" stopOpacity=".5" /></radialGradient>
        <linearGradient id="cmCapG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".5" stopColor="#e8b84a" /><stop offset="1" stopColor="#a8721f" /></linearGradient>
      </defs>
      <rect x="24" y="2" width="12" height="10" rx="3" fill="url(#cmCapG)" />
      <path d="M30 2C30 -2 38 -2 38 4" fill="none" stroke="#e8b84a" strokeWidth="2" />
      <circle cx="30" cy="40" r="27" fill={`url(#cmCap${color.slice(1)})`} />
      <path d="M8 38Q30 52 52 38" fill="none" stroke="#fff6e8" strokeWidth="5" strokeLinecap="round" opacity=".9" />
      <path d="M14 26Q22 18 32 17" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Sound (Web Audio, optional)                                        */
/* ------------------------------------------------------------------ */

function useSound() {
  const ctxRef = useRef(null);
  const [on, setOn] = useState(true);
  const onRef = useRef(true);
  onRef.current = on;

  const ensure = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume().catch(() => {});
    return ctxRef.current;
  }, []);

  const tone = useCallback((freq, dur, type = "sine", vol = 0.15, delay = 0) => {
    const ctx = ctxRef.current;
    if (!ctx || !onRef.current) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + 0.05);
  }, []);

  const coin = useCallback(() => { tone(1318.5, 0.12, "square", 0.08); tone(1760, 0.3, "square", 0.08, 0.1); }, [tone]);
  const ratchet = useCallback(() => tone(180 + Math.random() * 60, 0.05, "square", 0.05), [tone]);
  const ding = useCallback(() => { [659.25, 830.6, 987.77, 1318.5].forEach((f, i) => tone(f, 0.9, "triangle", 0.14, i * 0.09)); }, [tone]);

  useEffect(() => () => { if (ctxRef.current) ctxRef.current.close().catch(() => {}); }, []);
  return { ensure, coin, ratchet, ding, on, setOn };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ChristmasComplimentMachine() {
  const [compliment, setCompliment] = useState(IDLE);
  const [shown, setShown] = useState(IDLE.length);
  const [spinning, setSpinning] = useState(false);
  const [count, setCount] = useState(0);
  const [coinKey, setCoinKey] = useState(0);
  const [capColor, setCapColor] = useState("#d9262f");

  const bagRef = useRef([]);
  const lastRef = useRef(-1);
  const lockRef = useRef(false);
  const timerRef = useRef(0);
  const sound = useSound();

  const generateCompliment = () => {
    if (lockRef.current) return; // ignore clicks while the machine is working
    lockRef.current = true;
    setSpinning(true);
    setCount((prev) => prev + 1);
    setCoinKey((k) => k + 1);
    sound.ensure();
    sound.coin();

    // random compliment, never the same one twice in a row, full cycle before any repeat
    if (bagRef.current.length === 0) bagRef.current = makeBag(lastRef.current);
    const randomIndex = bagRef.current.pop();
    lastRef.current = randomIndex;

    timerRef.current = setTimeout(() => {
      setCompliment(compliments[randomIndex]);
      setShown(0);
      setCapColor(["#d9262f", "#1f9a62", "#f2b632", "#2f6fd0", "#e0527f", "#8a3fd0"][Math.floor(Math.random() * 6)]);
      setSpinning(false);
      lockRef.current = false;
      sound.ding();
    }, SPIN_MS);
  };

  // cleanup
  useEffect(() => () => clearTimeout(timerRef.current), []);

  // machine noise while it is "thinking"
  useEffect(() => {
    if (!spinning) return undefined;
    const id = setInterval(() => sound.ratchet(), 110);
    return () => clearInterval(id);
  }, [spinning]); // eslint-disable-line react-hooks/exhaustive-deps

  // typewriter effect on the screen
  useEffect(() => {
    if (spinning || shown >= compliment.length) return undefined;
    const id = setTimeout(() => setShown((n) => n + 1), 24);
    return () => clearTimeout(id);
  }, [spinning, shown, compliment]);

  const flakes = useMemo(() => { const r = rng(5); return Array.from({ length: 30 }, (_, i) => ({ id: i, left: r() * 100, size: r() * 4 + 2, dur: r() * 7 + 9, delay: -r() * 14, o: 0.35 + r() * 0.5 })); }, []);
  const bulbs = useMemo(() => Array.from({ length: 20 }, (_, i) => ({ id: i, x: (i + 0.5) * 5, y: 8 + Math.abs(Math.sin(i * 0.8)) * 12, c: ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"][i % 5] })), []);
  const baubles = useMemo(() => { const r = rng(23); const cols = ["#d9262f", "#1f9a62", "#f2b632", "#2f6fd0", "#e0527f", "#8a3fd0", "#ff8a3d"]; return Array.from({ length: 16 }, (_, i) => { const a = r() * Math.PI * 2; const d = Math.sqrt(r()) * 38; return { id: i, x: 50 + Math.cos(a) * d, y: 52 + Math.sin(a) * d * 0.9, s: 15 + r() * 7, c: cols[i % cols.length], dl: -r() * 3 }; }); }, []);
  const plateBulbs = useMemo(() => [...Array.from({ length: 14 }, (_, i) => ({ k: `t${i}`, s: { left: `${(i + 0.5) * 7.14}%`, top: "-.7cqw" }, d: (i % 2) * 0.7 })), ...Array.from({ length: 14 }, (_, i) => ({ k: `b${i}`, s: { left: `${(i + 0.5) * 7.14}%`, bottom: "-.7cqw" }, d: ((i + 1) % 2) * 0.7 }))], []);

  const digits = String(count).padStart(3, "0").slice(-3).split("");
  const text = compliment.slice(0, shown);
  const size = compliment.length > 70 ? "5cqw" : compliment.length > 50 ? "5.6cqw" : "6.4cqw";

  return (
    <div className="cm relative flex h-full min-h-screen w-full items-center justify-center overflow-hidden">
      <style>{CSS}</style>
      <div className="cm-glow" aria-hidden="true" />
      {flakes.map((f) => <span key={f.id} className="cm-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true" />)}
      <div className="cm-lights" aria-hidden="true">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}><path d={`M0 2 ${bulbs.map((b) => `L${b.x} ${b.y}`).join(" ")} L100 2`} fill="none" stroke="#e8c878" strokeOpacity=".6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" /></svg>
        {bulbs.map((b) => <span key={b.id} className="cm-lb" style={{ left: `${b.x}%`, top: b.y * 1.2, background: b.c, boxShadow: `0 0 12px 3px ${b.c}`, animationDelay: `${(b.id % 5) * 0.4}s` }} />)}
      </div>
      <div className="cm-floor" aria-hidden="true" />

      <div className="cm-stage">
        <div className={`cm-machine ${spinning ? "shake" : ""}`}>
          <Hat />
          <button type="button" className="cm-snd" onClick={() => sound.setOn(!sound.on)} aria-pressed={sound.on} aria-label={sound.on ? "Desactivar el sonido" : "Activar el sonido"}>{sound.on ? "♫" : "♪"}</button>

          <div className="cm-frame">
            <div className="cm-cab">
              <span className="cm-cane l" aria-hidden="true" /><span className="cm-cane r" aria-hidden="true" />

              <div className="cm-marq">
                {plateBulbs.map((b) => <span key={b.k} className="cm-pb" style={{ ...b.s, animationDelay: `${b.d}s` }} aria-hidden="true" />)}
                <p>TALLER DE PAPÁ NOEL</p>
              </div>

              <h1 className="cm-title"><span className="a">Máquina de</span><span className="b">Cumplidos</span></h1>
              <p className="cm-sub">¡Cumplidos mágicos y totalmente absurdos!</p>

              <div className="cm-domewrap" aria-hidden="true">
                <div className="cm-dome">
                  <div className="cm-pile">
                    {baubles.map((b) => <span key={b.id} className="cm-bl" style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.s}%`, aspectRatio: "1", color: b.c, marginLeft: `-${b.s / 2}%`, marginTop: `-${b.s / 2}%`, animationDelay: `${b.dl}s` }} />)}
                  </div>
                  <div className="cm-glass" />
                </div>
              </div>

              {/* Pantalla */}
              <div className="cm-display">
                <div className="cm-screen" aria-live="polite" aria-atomic="true">
                  {spinning ? (
                    <div className="cm-wait"><Snowflake /><p className="cm-text" style={{ fontSize: "5.4cqw" }}>BUSCANDO UN CUMPLIDO…</p></div>
                  ) : (
                    <p className="cm-text" style={{ fontSize: size }}>{text}{shown < compliment.length || compliment === IDLE ? <span className="cm-caret" /> : null}</p>
                  )}
                </div>
              </div>

              {/* Controles */}
              <div className="cm-controls">
                <div className="cm-slotbox">
                  <div className="cm-slot">
                    {coinKey > 0 && <svg key={coinKey} className="cm-coin drop" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#f2b632" stroke="#a8721f" /><path d={HEART} fill="#d9262f" transform="translate(5 5) scale(.58)" /></svg>}
                  </div>
                  <p className="cm-slot-l">MONEDA<br />DE AMOR</p>
                </div>

                <div className="cm-btnwrap">
                  <button type="button" className="cm-btn" onClick={generateCompliment} disabled={spinning} aria-label="Pulsar para recibir un cumplido">
                    <span className="cm-cap" />
                  </button>
                  <p className="cm-btn-l">{spinning ? "¡GIRANDO…!" : "¡PULSAR!"}</p>
                </div>

                <div className={`cm-leds ${spinning ? "go" : ""}`} aria-hidden="true">
                  <span className="cm-led r" /><span className="cm-led y" /><span className="cm-led g" />
                </div>
              </div>

              {/* Bandeja de salida */}
              <div className="cm-tray" aria-hidden="true">
                <span className="cm-out">SALIDA</span>
                {count > 0 && !spinning && <div key={count} className="cm-drop"><Capsule color={capColor} /></div>}
              </div>

              {/* Contador */}
              <div className="cm-plate">
                <b>CUMPLIDOS<br />ENTREGADOS</b>
                <div className="cm-odo" aria-label={`Cumplidos entregados: ${count}`}>
                  {digits.map((d, i) => <i key={`${i}-${d}-${count}`}><span>{d}</span></i>)}
                </div>
              </div>
              <p className="cm-made">Fabricado con magia, nieve y mucho amor ❤️</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}