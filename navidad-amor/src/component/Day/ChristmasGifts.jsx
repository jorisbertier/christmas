import React, { useEffect, useMemo, useRef, useState } from "react";

import germignon from "../../assets/gifts/germignon.gif";
import birdo from "../../assets/gifts/birdo.gif";
import titi from "../../assets/gifts/titi.gif";
import hada from "../../assets/gifts/hada.gif";
import supernana from "../../assets/gifts/supernana.gif";
import rondoudou from "../../assets/gifts/rondoudou.gif";
import lisa from "../../assets/gifts/lisa.gif";
import germignon2 from "../../assets/gifts/germignon2.gif";
import toadette from "../../assets/gifts/toadette.gif";
import togepi from "../../assets/gifts/togepi.gif";
import monsters from "../../assets/gifts/monsters.gif";
import daisy from "../../assets/gifts/daisy.gif";

const FUN_MUSIC = "/music/fun.mp3";
const LOVE_MUSIC = "/music/romantic.mp3";

// Remplace simplement les chemins par tes propres GIFs.
const stages = [
  { type: "fun", text: "Puede ser que seas un poquito dramática...", gif: germignon, caption: "¡Siempre hay una pequeña escena! 😂" },
  { type: "fun", text: "O quizás un poquito testaruda...", gif: supernana, caption: "Cuando tienes una idea, ¡nadie te hace cambiar de opinión!" },
  { type: "fun", text: "También puedes ser bastante impaciente...", gif: titi, caption: "¡Todo tiene que ser ahora mismo!" },
  { type: "fun", text: "A veces, nadie puede llevarte la contraria sino...", gif: rondoudou, caption: "Porque claro… ¡tú siempre tienes razón! 😏" },
  { type: "fun", text: "Y cuando te enfadas… ¡mejor esconderse!", gif: hada, caption: "¡Sálvese quien pueda!" },
  { type: "love", text: "Pero también tienes la sonrisa más bonita del mundo...", gif: germignon2, caption: "Una sonrisa que siempre consigue alegrarme el día." },
  { type: "love", text: "Eres mi pequeña dosis de felicidad...", gif: toadette, caption: "Contigo, hasta los días normales son especiales." },
  { type: "love", text: "Tienes un corazón enorme...", gif: togepi, caption: "Y una forma muy especial de hacerme sentir querido." },
  { type: "love", text: "Eres la persona que más quiero abrazar...", gif: monsters, caption: "Ojalá pudiera hacerlo ahora mismo." },
  { type: "love", text: "Y eres, simplemente, mi persona favorita.", gif: daisy, caption: "Entre millones de personas, siempre te elegiría a ti. ❤️" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
const BULBS = ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"];
const HEART = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

.cg{container-type:inline-size;position:relative;display:flex;flex-direction:column;overflow:hidden;border-radius:26px;color:#fff6e4;font-family:'Cormorant Garamond',Georgia,serif;
  --acc:#f6d27a;--acc2:#fff3bf;--ink:#2a1208;--ring:#d9362f}
.cg[data-theme="love"]{--acc:#ffb3c6;--acc2:#ffe3ea;--ink:#3a1228;--ring:#e0527f}
.cg-bg{position:absolute;inset:0;transition:opacity 1.6s ease}
.cg-bg.fun{background:radial-gradient(120% 90% at 50% 0%,#1f4d3a 0%,#122b22 50%,#07130f 100%)}
.cg-bg.love{background:radial-gradient(120% 90% at 50% 0%,#7a2349 0%,#4a1530 48%,#1f0c1c 100%);opacity:0}
.cg[data-theme="love"] .cg-bg.love{opacity:1}
.cg-bg.glow{background:
  radial-gradient(circle at 8% 24%,rgba(255,190,100,.26) 0 6cqw,transparent 7cqw),
  radial-gradient(circle at 94% 18%,rgba(255,190,100,.2) 0 7cqw,transparent 8cqw),
  radial-gradient(circle at 88% 88%,rgba(217,54,47,.26) 0 8cqw,transparent 9cqw),
  radial-gradient(circle at 8% 86%,rgba(255,225,150,.16) 0 7cqw,transparent 8cqw)}
.cg-bg.glow2{background:
  radial-gradient(circle at 10% 26%,rgba(255,140,180,.3) 0 7cqw,transparent 8cqw),
  radial-gradient(circle at 92% 20%,rgba(255,200,140,.22) 0 7cqw,transparent 8cqw),
  radial-gradient(circle at 86% 88%,rgba(255,110,160,.28) 0 9cqw,transparent 10cqw),
  radial-gradient(circle at 10% 84%,rgba(255,225,200,.18) 0 7cqw,transparent 8cqw);opacity:0}
.cg[data-theme="love"] .cg-bg.glow2{opacity:1}
.cg[data-theme="love"] .cg-bg.glow{opacity:0}

/* particles */
.cg-parts{position:absolute;inset:0;pointer-events:none;transition:opacity 1.4s ease}
.cg-flake{position:absolute;top:-4%;border-radius:50%;background:#fff;animation:cg-fall linear infinite}
@keyframes cg-fall{0%{transform:translate(0,0)}50%{transform:translate(14px,55%)}100%{transform:translate(-8px,110%)}}
.cg-hearts{opacity:0}.cg[data-theme="love"] .cg-hearts{opacity:1}.cg[data-theme="love"] .cg-snow{opacity:0}
.cg-hp{position:absolute;bottom:-8%;animation:cg-rise linear infinite}
@keyframes cg-rise{0%{transform:translate(0,0) scale(.7);opacity:0}12%{opacity:.85}100%{transform:translate(18px,-115cqh) scale(1.1);opacity:0}}

/* lights */
.cg-lights{position:absolute;left:0;right:0;top:0;height:34px;pointer-events:none}
.cg-bulb{position:absolute;width:9px;height:12px;border-radius:50% 50% 45% 45%;animation:cg-tw 2.6s ease-in-out infinite}
@keyframes cg-tw{0%,100%{opacity:1}50%{opacity:.4}}

.cg-in{position:relative;z-index:2;display:flex;flex-direction:column;flex:1 1 0;min-height:0;padding:clamp(14px,2.4cqw,22px) clamp(14px,3.4cqw,34px) clamp(8px,1.6cqw,14px)}

/* header */
.cg-head{flex:none;display:flex;align-items:center;justify-content:space-between;gap:2px;margin-top:clamp(2px,2.4cqw,0px)}
.cg-kick{margin:0;font-size:clamp(9px,1.8cqw,2px);letter-spacing:.34em;text-transform:uppercase;font-weight:700;color:var(--acc);opacity:.85}
.cg-h{margin:.10em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;font-size:clamp(20px,4.4cqw,34px);
  background:linear-gradient(180deg,#fffbe0,#f8dd86 40%,#d9a336 70%,#fbe493);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 rgba(58,0,12,.6))}
.cg[data-theme="love"] .cg-h{background:linear-gradient(180deg,#fff,#ffd6e1 40%,#ff9fbb 75%,#ffd2de);-webkit-background-clip:text;background-clip:text;filter:drop-shadow(0 2px 0 rgba(70,0,35,.6))}
.cg-snd{flex:none;display:flex;align-items:center;gap:.5em;height:38px;padding:0 14px 0 6px;border-radius:999px;border:1.5px solid color-mix(in srgb,var(--acc) 60%,transparent);background:rgba(0,0,0,.28);color:var(--acc2);cursor:pointer;font-family:inherit;font-weight:700;font-size:12px;letter-spacing:.12em;transition:background .2s ease}
.cg-snd:hover{background:rgba(255,255,255,.14)}.cg-snd:focus-visible{outline:2px solid #fff;outline-offset:2px}
.cg-snd i{position:relative;display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff3bf,var(--acc) 60%,#a8721f);color:#5a0f19}
.cg-snd[data-on="true"] i::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid var(--acc);animation:cg-ripple 1.8s ease-out infinite}
@keyframes cg-ripple{0%{transform:scale(1);opacity:.8}100%{transform:scale(1.9);opacity:0}}

/* progress ornaments */
.cg-prog{flex:none;display:flex;justify-content:center;align-items:center;gap:clamp(4px,1.3cqw,10px);margin-top:clamp(8px,1.6cqw,14px)}
.cg-orn{width:clamp(14px,3.2cqw,24px);aspect-ratio:1;transition:transform .5s cubic-bezier(.3,1.6,.5,1),opacity .5s ease,filter .5s ease;opacity:.25;filter:grayscale(.8)}
.cg-orn.on{opacity:1;filter:none}
.cg-orn.now{transform:scale(1.35);animation:cg-beat 1.6s ease-in-out infinite}
@keyframes cg-beat{0%,100%{filter:drop-shadow(0 0 4px currentColor)}50%{filter:drop-shadow(0 0 12px currentColor)}}

/* main */
.cg-main{flex:1 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-top:clamp(4px,1.2cqw,12px)}
.cg-fade{animation:cg-fade .7s cubic-bezier(.2,.9,.3,1) both}
@keyframes cg-fade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}

.cg-tag{flex:none;display:inline-flex;align-items:center;gap:.6em;padding:.3em 1.2em;border-radius:999px;border:1.5px dashed color-mix(in srgb,var(--acc) 70%,transparent);background:rgba(0,0,0,.25);
  color:var(--acc);font-size:clamp(9px,1.8cqw,12px);letter-spacing:.28em;text-transform:uppercase;font-weight:700}
.cg-text{flex:none;margin:.5em 0 .35em;max-width:46ch;text-align:center;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1.08;font-size:clamp(22px,5.4cqw,46px);color:#fff6e4;text-shadow:0 3px 0 rgba(0,0,0,.35),0 0 24px color-mix(in srgb,var(--acc) 35%,transparent)}
.cg[data-theme="love"] .cg-text{font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-weight:600}

/* frames */
.cg-frame{position:relative;flex:1 1 0;min-height:0;width:min(100%,680px);display:flex;margin:clamp(2px,.6cqw,6px) 0}
.cg-ring{position:relative;flex:1;min-height:0;display:flex;border-radius:22px;padding:clamp(6px,1.4cqw,11px);box-shadow:0 22px 50px rgba(0,0,0,.55),0 0 60px color-mix(in srgb,var(--acc) 22%,transparent)}
.cg-frame.fun .cg-ring{background:repeating-linear-gradient(45deg,#c8202e 0 12px,#fff6e8 12px 24px)}
.cg-frame.love .cg-ring{background:linear-gradient(135deg,#fff3d6,#f1b6c6 30%,#c98a6a 50%,#ffe3d0 72%,#d79ab0)}
.cg-gold{flex:1;min-height:0;display:flex;border-radius:15px;padding:clamp(3px,.7cqw,5px);background:linear-gradient(135deg,#fff3bf,#d9a336 28%,#8a5a12 50%,#f1cd6a 72%,#a8721f)}
.cg-mat{position:relative;flex:1;min-height:0;display:flex;align-items:center;justify-content:center;border-radius:11px;padding:clamp(5px,1.2cqw,10px);overflow:hidden}
.cg-frame.fun .cg-mat{background:radial-gradient(120% 100% at 50% 0%,#17382c,#0a1814);box-shadow:inset 0 0 40px rgba(0,0,0,.65)}
.cg-frame.love .cg-mat{background:radial-gradient(120% 100% at 50% 0%,#4b1631,#240c1b);box-shadow:inset 0 0 40px rgba(0,0,0,.65)}
.cg-img{position:relative;z-index:1;width:100%;height:100%;object-fit:contain;border-radius:8px}
.cg-num{position:absolute;left:10px;top:10px;z-index:3;padding:.15em .8em;border-radius:999px;background:rgba(0,0,0,.55);border:1px solid color-mix(in srgb,var(--acc) 60%,transparent);color:var(--acc2);font-size:12px;font-weight:700;letter-spacing:.2em}
.cg-emoji{position:absolute;right:10px;bottom:8px;z-index:3;font-size:clamp(20px,4cqw,30px);animation:cg-bob 2.6s ease-in-out infinite alternate}
@keyframes cg-bob{from{transform:translateY(0) rotate(-6deg)}to{transform:translateY(-6px) rotate(6deg)}}
.cg-fb{position:absolute;z-index:6;pointer-events:none}
.cg-fb svg{display:block}

/* caption ribbon */
.cg-cap{flex:none;position:relative;margin:clamp(10px,2cqw,18px) 0 clamp(6px,1.2cqw,12px);max-width:min(92%,640px);padding:.45em 2em;text-align:center;font-weight:600;font-style:italic;font-size:clamp(14px,3cqw,20px);color:#fff6e4;
  background:linear-gradient(180deg,#d9362f,#9a1522);box-shadow:0 6px 0 rgba(0,0,0,.3),0 10px 22px rgba(0,0,0,.4);text-shadow:0 2px 0 rgba(0,0,0,.35)}
.cg-cap::before,.cg-cap::after{content:"";position:absolute;top:.5em;width:1.4em;height:100%;background:#9a1522;z-index:-1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%,45% 50%)}
.cg-cap::before{left:-1em}.cg-cap::after{right:-1em;transform:scaleX(-1)}
.cg[data-theme="love"] .cg-cap{background:linear-gradient(180deg,#ec5d8b,#b2285a);color:#fff}
.cg[data-theme="love"] .cg-cap::before,.cg[data-theme="love"] .cg-cap::after{background:#b2285a}

/* buttons */
.cg-btn{flex:none;position:relative;overflow:hidden;border:0;cursor:pointer;padding:.7em 2.1em;border-radius:999px;font-family:inherit;font-weight:700;font-size:clamp(13px,2.6cqw,17px);letter-spacing:.2em;color:var(--ink);
  background:linear-gradient(180deg,#fff3bf,#e8b84a 55%,#c98a1e);box-shadow:0 5px 0 #8a5a12,0 12px 26px rgba(0,0,0,.45),0 0 28px rgba(255,214,120,.35);transition:transform .15s ease,filter .15s ease}
.cg[data-theme="love"] .cg-btn{background:linear-gradient(180deg,#ffe3ea,#ff9fbb 55%,#e0527f);box-shadow:0 5px 0 #9a2a55,0 12px 26px rgba(0,0,0,.45),0 0 28px rgba(255,140,180,.4)}
.cg-btn::after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.65),transparent);animation:cg-sheen 3.2s ease-in-out infinite}
@keyframes cg-sheen{0%,60%{left:-60%}100%{left:130%}}
.cg-btn:hover{transform:translateY(-2px);filter:brightness(1.06)}.cg-btn:active{transform:translateY(3px)}
.cg-btn:focus-visible{outline:3px solid #fff;outline-offset:3px}
.cg-btn.ghost{background:rgba(255,255,255,.1);color:#fff6e4;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.35)}
.cg-btn.ghost::after{display:none}

/* intro */
.cg-intro{display:flex;flex-direction:column;align-items:center;text-align:center;max-width:560px}
.cg-mystery{width:clamp(84px,22cqw,150px);transform-origin:50% 0;animation:cg-swing 4.4s ease-in-out infinite alternate;filter:drop-shadow(0 12px 16px rgba(0,0,0,.5))}
@keyframes cg-swing{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
.cg-big{margin:.15em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;font-size:clamp(30px,9cqw,70px);color:#fff6e4;text-shadow:0 4px 0 rgba(0,0,0,.35)}
.cg-big em{display:block;font-style:normal;background:linear-gradient(180deg,#fffbe0,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 rgba(58,0,12,.7)) drop-shadow(0 0 22px rgba(255,200,90,.35))}
.cg-p{margin:.7em 0 0;max-width:34em;font-size:clamp(15px,3.2cqw,20px);line-height:1.5;color:rgba(255,246,228,.82)}
.cg-chip{margin:1em 0 1.1em;padding:.5em 1.4em;border-radius:16px;border:1.5px dashed rgba(246,210,122,.6);background:rgba(0,0,0,.25);font-size:clamp(13px,2.6cqw,17px);color:rgba(255,246,228,.85)}

/* twist overlay (the big turn) */
.cg-twist{position:absolute;inset:0;z-index:30;pointer-events:none;display:flex;align-items:center;justify-content:center;overflow:hidden}
.cg-twist .bh{position:absolute;width:30cqw;color:#ff7aa5;animation:cg-heart 1.7s cubic-bezier(.2,.8,.3,1) both;filter:drop-shadow(0 0 30px #ff7aa5)}
@keyframes cg-heart{0%{transform:scale(.1);opacity:0}25%{opacity:1}100%{transform:scale(9);opacity:0}}
.cg-twist .flash{position:absolute;inset:0;background:radial-gradient(circle,rgba(255,220,230,.9),rgba(255,140,180,.35) 50%,transparent 75%);animation:cg-flash 1.5s ease-out both}
@keyframes cg-flash{0%{opacity:0}15%{opacity:1}100%{opacity:0}}
.cg-twist b{position:relative;font-family:'Mountains of Christmas',cursive;font-size:clamp(34px,10cqw,84px);color:#fff;text-shadow:0 0 24px #ff7aa5,0 4px 0 #9a2a55;animation:cg-pero 1.5s ease both}
@keyframes cg-pero{0%{opacity:0;transform:scale(.6)}30%{opacity:1;transform:scale(1.05)}80%{opacity:1}100%{opacity:0;transform:scale(1.2)}}
.cg-spk{position:absolute;color:#ffe3a0;animation:cg-spk 1.6s ease-out both}
@keyframes cg-spk{0%{opacity:0;transform:translate(0,0) scale(.3)}30%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.4) rotate(120deg)}}

/* finale */
.cg-end{display:flex;flex-direction:column;align-items:center;text-align:center;max-width:640px;min-height:0}
.cg-heart-big{width:clamp(54px,14cqw,96px);color:#ff6f9d;animation:cg-hb 1.4s ease-in-out infinite;filter:drop-shadow(0 0 22px rgba(255,111,157,.8))}
@keyframes cg-hb{0%,100%{transform:scale(1)}14%{transform:scale(1.14)}28%{transform:scale(1)}42%{transform:scale(1.1)}}
.cg-letter{position:relative;margin-top:clamp(8px,1.8cqw,16px);width:100%;border-radius:12px;padding:clamp(14px,3.2cqw,26px) clamp(16px,4cqw,34px);color:#3a1228;text-align:center;
  background:radial-gradient(120% 100% at 30% 10%,#fff6ee,#fde3e6 60%,#f6c9d2);box-shadow:inset 0 0 50px rgba(190,90,110,.28),0 22px 50px rgba(0,0,0,.5)}
.cg-letter::before{content:"";position:absolute;inset:7px;border:1.5px dashed rgba(178,40,90,.5);border-radius:8px;pointer-events:none}
.cg-letter p{margin:0;font-size:clamp(15px,3.4cqw,22px);line-height:1.5;font-style:italic}
.cg-letter b{color:#b2285a;font-weight:700}
.cg-sign{margin-top:.8em;font-weight:700;letter-spacing:.3em;font-size:clamp(11px,2.2cqw,14px);color:rgba(255,214,225,.8)}

.cg-foot{position:relative;z-index:2;flex:none;display:flex;align-items:center;justify-content:center;gap:.8em;padding:0 0 clamp(6px,1.4cqw,12px);font-size:clamp(9px,1.7cqw,11px);letter-spacing:.3em;font-weight:700;color:rgba(255,255,255,.35)}

@media (prefers-reduced-motion: reduce){
  .cg-flake,.cg-hp,.cg-bulb,.cg-mystery,.cg-emoji,.cg-heart-big,.cg-orn.now,.cg-btn::after,.cg-snd[data-on="true"] i::after{animation:none !important}
  .cg-fade{animation-duration:.01s}.cg-bg{transition-duration:.01s}
}
`;

/* ------------------------------------------------------------------ */
/*  Small SVG pieces                                                   */
/* ------------------------------------------------------------------ */

function Defs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="cgGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".5" stopColor="#e8b84a" /><stop offset="1" stopColor="#a8721f" /></linearGradient>
        <linearGradient id="cgLeaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38b06a" /><stop offset="1" stopColor="#0f5a36" /></linearGradient>
        <radialGradient id="cgBall" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset=".3" stopColor="currentColor" /><stop offset="1" stopColor="#000" stopOpacity=".5" /></radialGradient>
        <radialGradient id="cgHeartG" cx="35%" cy="28%" r="80%"><stop offset="0" stopColor="#fff" stopOpacity=".85" /><stop offset=".3" stopColor="currentColor" /><stop offset="1" stopColor="#000" stopOpacity=".45" /></radialGradient>
      </defs>
    </svg>
  );
}

function Orn({ kind, color, on, now }) {
  return (
    <svg viewBox="0 0 24 24" className={`cg-orn ${on ? "on" : ""} ${now ? "now" : ""}`} style={{ color }} aria-hidden="true">
      {kind === "love"
        ? <path d={HEART} fill="url(#cgHeartG)" />
        : <g><rect x="10" y="1" width="4" height="3" rx="1" fill="url(#cgGold)" /><circle cx="12" cy="14" r="9" fill="url(#cgBall)" /><path d="M5 13Q12 17 19 13" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.6" /></g>}
    </svg>
  );
}

function Mystery() {
  return (
    <svg viewBox="0 0 120 190" className="cg-mystery" aria-hidden="true">
      <path d="M60 0V46" stroke="#e8b84a" strokeWidth="2" />
      <rect x="48" y="40" width="24" height="16" rx="4" fill="url(#cgGold)" />
      <g style={{ color: "#c8202e" }}><circle cx="60" cy="118" r="62" fill="url(#cgBall)" /></g>
      <path d="M14 112Q60 150 106 112" fill="none" stroke="#f6e7c1" strokeWidth="9" strokeLinecap="round" opacity=".9" />
      <path d="M20 134Q60 168 100 134" fill="none" stroke="#f2b632" strokeWidth="5" strokeLinecap="round" opacity=".9" />
      <text x="60" y="124" textAnchor="middle" fontSize="64" fontWeight="700" fill="#fff6e4" fontFamily="'Mountains of Christmas',Georgia,serif" stroke="#7a0f1a" strokeWidth="2" paintOrder="stroke">?</text>
      <ellipse cx="38" cy="86" rx="14" ry="8" fill="#fff" opacity=".35" transform="rotate(-30 38 86)" />
    </svg>
  );
}

function Holly({ style }) {
  return (
    <svg viewBox="0 0 90 70" style={style} className="cg-fb" aria-hidden="true">
      {[[-70, 0], [-20, 0], [30, 0], [80, 0]].map(([r], i) => (
        <g key={i} transform={`translate(18 56) rotate(${r})`}><path d="M0 0Q10 -9 26 -2Q34 -16 48 -7Q58 -3 62 5Q54 14 42 12Q34 24 24 16Q10 20 0 0Z" fill="url(#cgLeaf)" stroke="#0a3b23" strokeWidth="1.2" /></g>
      ))}
      {[[26, 46], [38, 50], [32, 58]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="6" fill="#d4222f" stroke="#7a0f1a" /><circle cx={x - 2} cy={y - 2} r="1.8" fill="#fff" opacity=".75" /></g>)}
    </svg>
  );
}

function Rose({ style }) {
  return (
    <svg viewBox="0 0 70 70" style={style} className="cg-fb" aria-hidden="true">
      <path d="M8 62Q22 46 34 52" fill="none" stroke="#2a8a54" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 56Q10 46 20 44Q22 50 16 56Z" fill="#2f9a5a" />
      <circle cx="40" cy="34" r="18" fill="#e0527f" /><circle cx="40" cy="34" r="12" fill="#f27a9d" /><circle cx="40" cy="34" r="6.5" fill="#d9386a" />
      <path d="M32 30Q40 22 48 30Q40 36 32 30Z" fill="#ffb3c6" opacity=".7" />
    </svg>
  );
}

function Corners({ type }) {
  const s = (x) => ({ width: "clamp(34px,8cqw,58px)", ...x });
  if (type === "fun") {
    return (
      <>
        <Holly style={s({ left: -14, top: -16 })} />
        <Holly style={s({ right: -14, top: -16, transform: "scaleX(-1)" })} />
        <Holly style={s({ left: -14, bottom: -16, transform: "scaleY(-1)" })} />
        <Holly style={s({ right: -14, bottom: -16, transform: "scale(-1,-1)" })} />
      </>
    );
  }
  return (
    <>
      <Rose style={s({ left: -14, top: -16 })} />
      <Rose style={s({ right: -14, top: -16, transform: "scaleX(-1)" })} />
      <Rose style={s({ left: -14, bottom: -16, transform: "scaleY(-1)" })} />
      <Rose style={s({ right: -14, bottom: -16, transform: "scale(-1,-1)" })} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ChristmasGifts() {
  const [current, setCurrent] = useState(-1);
  const [finished, setFinished] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [musicStarted, setMusicStarted] = useState(false);
  const [twist, setTwist] = useState(0); // restarts the "big turn" animation

  const audioRef = useRef(null);
  const twistTimer = useRef(0);

  const isLove = current >= 5;
  const stage = stages[current];
  const theme = isLove || finished ? "love" : "fun";

  useEffect(() => () => {
    clearTimeout(twistTimer.current);
    if (audioRef.current) audioRef.current.pause();
  }, []);

  const playMusic = (src) => {
    const audio = audioRef.current;
    if (!audio || !soundOn) return;

    audio.src = src;
    audio.volume = 0.45;
    audio.load();

    audio.play().catch(() => {
      // La lecture peut être bloquée par le navigateur.
    });
  };

  const toggleSound = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (soundOn) {
      audio.pause();
      setSoundOn(false);
    } else {
      setSoundOn(true);

      if (musicStarted) {
        audio.play().catch(() => {});
      }
    }
  };

  const handleNext = () => {
    // Démarrage de l'expérience et de la première musique
    if (current === -1) {
      setCurrent(0);
      setMusicStarted(true);
      playMusic(FUN_MUSIC);
      return;
    }

    // Le grand retournement : passage à la musique romantique
    if (current === 4) {
      setCurrent(5);
      playMusic(LOVE_MUSIC);
      setTwist((t) => t + 1);
      clearTimeout(twistTimer.current);
      twistTimer.current = setTimeout(() => setTwist(0), 1800);
      return;
    }

    // Fin de l'expérience
    if (current === 9) {
      setFinished(true);
      return;
    }

    setCurrent((prev) => prev + 1);
  };

  const restart = () => {
    setCurrent(-1);
    setFinished(false);
    setMusicStarted(false);
    setTwist(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const snow = useMemo(() => { const r = rng(7); return Array.from({ length: 30 }, (_, i) => ({ id: i, left: r() * 100, size: r() * 4 + 2, dur: r() * 7 + 9, delay: -r() * 14, o: 0.35 + r() * 0.5 })); }, []);
  const hearts = useMemo(() => { const r = rng(11); return Array.from({ length: 22 }, (_, i) => ({ id: i, left: r() * 100, size: 10 + r() * 20, dur: 8 + r() * 8, delay: -r() * 14, c: ["#ff7aa5", "#ffb3c6", "#ffd6a0", "#ff9fbb"][i % 4] })); }, []);
  const bulbs = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ id: i, x: (i + 0.5) * (100 / 22), y: 6 + Math.abs(Math.sin(i * 0.8)) * 10, c: BULBS[i % 5] })), []);
  const sparks = useMemo(() => { const r = rng(3); return Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; const d = 120 + r() * 160; return { id: i, dx: Math.cos(a) * d, dy: Math.sin(a) * d, s: 14 + r() * 14, delay: r() * 0.3 }; }); }, []);

  const frameBulbs = useMemo(() => {
    const e = (n, f) => Array.from({ length: n }, (_, i) => f((i + 0.5) / n, i));
    return [...e(12, (t, i) => ({ k: `t${i}`, s: { left: `${t * 100}%`, top: -7 }, i })), ...e(12, (t, i) => ({ k: `b${i}`, s: { left: `${t * 100}%`, bottom: -7 }, i: i + 2 })), ...e(6, (t, i) => ({ k: `l${i}`, s: { top: `${t * 100}%`, left: -7 }, i: i + 1 })), ...e(6, (t, i) => ({ k: `r${i}`, s: { top: `${t * 100}%`, right: -7 }, i: i + 3 }))];
  }, []);

  return (
    <section
      data-theme={theme}
      className="cg relative flex h-full max-h-full w-full max-w-full min-h-0 flex-col overflow-hidden rounded-3xl text-white"
    >
      <style>{CSS}</style>
      <Defs />
      <audio ref={audioRef} loop preload="none" />

      {/* Ambiance : deux décors qui se fondent l'un dans l'autre */}
      <div className="cg-bg fun" aria-hidden="true" />
      <div className="cg-bg love" aria-hidden="true" />
      <div className="cg-bg glow" aria-hidden="true" />
      <div className="cg-bg glow2" aria-hidden="true" />
      <div className="cg-parts cg-snow" aria-hidden="true">
        {snow.map((f) => <span key={f.id} className="cg-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} />)}
      </div>
      <div className="cg-parts cg-hearts" aria-hidden="true">
        {hearts.map((h) => (
          <svg key={h.id} viewBox="0 0 24 24" width={h.size} height={h.size} className="cg-hp" style={{ left: `${h.left}%`, color: h.c, animationDuration: `${h.dur}s`, animationDelay: `${h.delay}s` }}><path d={HEART} fill="currentColor" opacity=".8" /></svg>
        ))}
      </div>
      <div className="cg-lights" aria-hidden="true">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}><path d={`M0 2 ${bulbs.map((b) => `L${b.x} ${b.y * 0.8}`).join(" ")} L100 2`} fill="none" stroke="#e8c878" strokeOpacity=".6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" /></svg>
        {bulbs.map((b) => <span key={b.id} className="cg-bulb" style={{ left: `${b.x}%`, top: b.y * 1.2 + 2, background: theme === "love" ? ["#ff9fbb", "#ffd6a0", "#ffb3c6"][b.id % 3] : b.c, boxShadow: `0 0 12px 3px ${theme === "love" ? "#ff9fbb" : b.c}`, animationDelay: `${(b.id % 5) * 0.4}s` }} />)}
      </div>

      <div className="cg-in">
        {/* En-tête */}
        <header className="cg-head">
          <div>
            <p className="cg-kick">Una pequeña historia sobre ti</p>
            <h2 className="cg-h">{isLove || finished ? "MI PERSONA FAVORITA ♥" : "¿QUIÉN ERES REALMENTE?"}</h2>
          </div>
          <button type="button" className="cg-snd" data-on={soundOn} onClick={toggleSound} aria-label="Activar o desactivar la música" aria-pressed={soundOn}>
            <i aria-hidden="true">{soundOn ? "♫" : "♪"}</i>
            <span>{soundOn ? "SONIDO ON" : "SONIDO OFF"}</span>
          </button>
        </header>

        {/* Progression : boules de Noël puis cœurs */}
        {current >= 0 && !finished && (
          <div className="cg-prog" role="progressbar" aria-valuemin={1} aria-valuemax={stages.length} aria-valuenow={current + 1} aria-label="Progression">
            {stages.map((item, i) => (
              <Orn key={i} kind={item.type} color={item.type === "love" ? "#ff7aa5" : i % 2 ? "#e8b84a" : "#d9362f"} on={i <= current} now={i === current} />
            ))}
          </div>
        )}

        {/* Contenu principal */}
        <main className="cg-main">
          {/* Écran d'introduction */}
          {current === -1 && !finished && (
            <div className="cg-intro cg-fade">
              <Mystery />
              <p className="cg-tag" style={{ marginTop: ".6em" }}>Atención, atención...</p>
              <h1 className="cg-big">¿Quién es<em>mi chica?</em></h1>
              <p className="cg-p">Hoy vamos a descubrir todas tus versiones... Porque creo que te conozco bastante bien.</p>
              <p className="cg-chip">10 revelaciones · Algunas pueden ser peligrosas... 😈</p>
              <button type="button" className="cg-btn" onClick={handleNext}>DESCUBRIR ▶</button>
            </div>
          )}

          {/* Écran des GIFs */}
          {stage && !finished && (
            <div key={current} className="cg-fade" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: "100%", minHeight: 0 }}>
              <div className="cg-tag">
                <span aria-hidden="true">{stage.type === "fun" ? "✦" : "♥"}</span>
                {stage.type === "fun" ? "LAS COSAS QUE ME HACEN REÍR" : "LAS COSAS QUE AMO DE TI"}
                <span aria-hidden="true">{stage.type === "fun" ? "✦" : "♥"}</span>
              </div>

              <h3 className="cg-text">{stage.text}</h3>

              <div className={`cg-frame ${stage.type}`}>
                {stage.type === "fun" && frameBulbs.map((b) => <span key={b.k} className="cg-bulb" style={{ ...b.s, zIndex: 5, background: BULBS[b.i % 5], boxShadow: `0 0 10px 2px ${BULBS[b.i % 5]}`, animationDelay: `${(b.i % 7) * 0.35}s` }} aria-hidden="true" />)}
                <Corners type={stage.type} />
                <div className="cg-ring">
                  <div className="cg-gold">
                    <div className="cg-mat">
                      <span className="cg-num">#{String(current + 1).padStart(2, "0")}</span>
                      <img src={stage.gif} alt="Reacción" className="cg-img max-h-full max-w-full" />
                      <span className="cg-emoji" aria-hidden="true">{stage.type === "fun" ? "" : "❤️"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="cg-cap">{stage.caption}</p>

              <button type="button" className="cg-btn" onClick={handleNext}>
                {current === 9 ? "VER EL FINAL ♥" : "SIGUIENTE →"}
              </button>
            </div>
          )}

          {/* Écran final */}
          {finished && (
            <div className="cg-end cg-fade">
              <svg viewBox="0 0 24 24" className="cg-heart-big" aria-hidden="true"><path d={HEART} fill="url(#cgHeartG)" /></svg>
              <p className="cg-tag" style={{ marginTop: ".8em" }}>Y ahora, la verdad...</p>
              <h1 className="cg-big" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontStyle: "italic" }}>Te quiero tal<em style={{ fontStyle: "italic", background: "linear-gradient(180deg,#fff,#ffd6e1 45%,#ff9fbb 80%)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>como eres.</em></h1>

              <div className="cg-letter">
                <p>
                  No importa si eres dramática, testaruda o un poquito gruñona... Me encantan todas tus versiones.
                  <br /><br />
                  No quiero una versión perfecta de ti.
                  <b> Te quiero a ti, exactamente como eres.</b>
                  <br /><br />
                  Porque entre millones de personas, siempre te elegiría a ti. ❤️
                </p>
              </div>

              <p className="cg-sign">CON TODO MI AMOR ♥</p>

              <button type="button" className="cg-btn ghost" style={{ marginTop: ".9em", fontSize: "clamp(11px,2cqw,13px)" }} onClick={restart}>VOLVER A VER ♥</button>
            </div>
          )}
        </main>
      </div>

      {/* Le grand retournement : explosion de cœurs */}
      {twist > 0 && (
        <div key={twist} className="cg-twist" aria-hidden="true">
          <div className="flash" />
          <svg viewBox="0 0 24 24" className="bh"><path d={HEART} fill="currentColor" /></svg>
          {sparks.map((s) => <span key={s.id} className="cg-spk" style={{ "--dx": `${s.dx}px`, "--dy": `${s.dy}px`, fontSize: s.s, animationDelay: `${s.delay}s` }}>✦</span>)}
          <b>Pero…</b>
        </div>
      )}

      {/* Pied de page */}
      <footer className="cg-foot">
        <span>{" "}</span>
        <span>{" "}</span>
      </footer>
    </section>
  );
}