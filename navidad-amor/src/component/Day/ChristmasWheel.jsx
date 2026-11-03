import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const GIFTS = [
  { name: "Un beso mágico", wheelLines: ["Beso", "mágico"], emoji: "💋" },
  { name: "Chocolate navideño", wheelLines: ["Chocolate", "navideño"], emoji: "🍫" },
  { name: "Un deseo cumplido", wheelLines: ["Un deseo", "cumplido"], emoji: "⭐" },
  { name: "Una cita romántica", wheelLines: ["Cita", "romántica"], emoji: "❤️" },
  { name: "Un abrazo infinito", wheelLines: ["Abrazo", "infinito"], emoji: "🤗" },
  { name: "Una sorpresa", wheelLines: ["Una", "sorpresa"], emoji: "🎁" },
  { name: "Un mensaje de amor", wheelLines: ["Mensaje", "de amor"], emoji: "💌" },
  { name: "Noche de película", wheelLines: ["Noche de", "película"], emoji: "🎬" },
  { name: "Un baile juntos", wheelLines: ["Un baile", "juntos"], emoji: "💃" },
  { name: "Un recuerdo especial", wheelLines: ["Un recuerdo", "especial"], emoji: "📸" },
  { name: "Un vale de mimos", wheelLines: ["Vale de", "mimos"], emoji: "🥰" },
  { name: "El regalo sorpresa", wheelLines: ["Regalo", "sorpresa"], emoji: "🎀" },
];

const STORAGE_KEY = "navidad_ruleta_giros_2026";
const MAX_SPINS = 3;
const SPIN_MS = 5300;

/* ------------------------------------------------------------------ */
/*  Storage helpers (safe if storage is blocked)                       */
/* ------------------------------------------------------------------ */

function readUsed() {
  try { return Number(window.localStorage.getItem(STORAGE_KEY) || 0) || 0; } catch (e) { return 0; }
}
function writeUsed(n) {
  try { window.localStorage.setItem(STORAGE_KEY, String(n)); } catch (e) { /* ignore */ }
}
function readResults() {
  try { const v = JSON.parse(window.localStorage.getItem(`${STORAGE_KEY}_results`) || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return []; }
}
function writeResults(list) {
  try { window.localStorage.setItem(`${STORAGE_KEY}_results`, JSON.stringify(list)); } catch (e) { /* ignore */ }
}

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
function pt(cx, cy, r, deg) {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

.sw{container:sw / size;box-sizing:border-box;position:relative;isolation:isolate;display:flex;flex-direction:column;height:100%;min-height:100svh;width:100%;max-width:100%;max-height:100%;overflow:hidden;color:#fff6e4;font-family:'Cormorant Garamond',Georgia,serif;
  padding:clamp(8px,1.6cqh,20px) clamp(10px,3cqw,32px) clamp(8px,1.6cqh,18px);
  background:radial-gradient(120% 90% at 50% 18%,#1f4d3a 0%,#122b22 50%,#07130f 100%)}
.sw-glow{position:absolute;inset:0;pointer-events:none;z-index:-1;background:
  radial-gradient(circle at 8% 24%,rgba(255,190,100,.24) 0 6cqw,transparent 7cqw),
  radial-gradient(circle at 94% 20%,rgba(255,190,100,.2) 0 7cqw,transparent 8cqw),
  radial-gradient(circle at 92% 88%,rgba(217,54,47,.28) 0 9cqw,transparent 10cqw),
  radial-gradient(circle at 6% 88%,rgba(255,225,150,.16) 0 7cqw,transparent 8cqw),
  radial-gradient(40% 50% at 30% 55%,rgba(255,200,120,.12),transparent 70%)}
.sw-flake{position:absolute;top:-4%;border-radius:50%;background:#fff;pointer-events:none;animation:sw-fall linear infinite;z-index:-1}
@keyframes sw-fall{0%{transform:translate(0,0)}50%{transform:translate(14px,55cqh)}100%{transform:translate(-8px,110cqh)}}
.sw-lights{position:absolute;left:0;right:0;top:0;height:34px;pointer-events:none;z-index:0}
.sw-lb{position:absolute;width:9px;height:12px;border-radius:50% 50% 45% 45%;animation:sw-tw 2.6s ease-in-out infinite}
@keyframes sw-tw{0%,100%{opacity:1}50%{opacity:.4}}

/* header */
.sw-head{flex:none;position:relative;z-index:2;text-align:center;padding-top:clamp(16px,3.6cqh,34px)}
.sw-eyebrow{margin:0;font-size:clamp(9px,min(1.6cqw,2cqh),13px);letter-spacing:.34em;text-transform:uppercase;font-weight:700;color:#f1c978}
.sw-title{margin:.05em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;font-size:clamp(24px,min(5.6cqw,7.4cqh),60px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 rgba(58,0,12,.7)) drop-shadow(0 0 20px rgba(255,200,90,.3))}
.sw-sub{margin:.15em 0 0;font-style:italic;font-weight:600;font-size:clamp(13px,min(2cqw,2.8cqh),21px);color:#ffe9c9;text-shadow:0 2px 8px rgba(0,0,0,.6)}

/* layout */
.sw-main{flex:1 1 0;min-height:0;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(6px,1.4cqh,16px);--wd:min(80cqw,33cqh)}
.sw-wheelbox{flex:none;position:relative;width:var(--wd);aspect-ratio:1/1.03;animation:sw-in .9s cubic-bezier(.2,.9,.3,1) both}
@keyframes sw-in{from{opacity:0;transform:scale(.92) rotate(-8deg)}to{opacity:1;transform:none}}
.sw-svg{display:block;width:100%;height:100%;overflow:visible}
.sw-panel{flex:0 1 auto;min-height:0;width:min(100%,480px);display:flex;flex-direction:column;align-items:center;gap:clamp(5px,1.1cqh,12px)}
@container sw (aspect-ratio > 1.2){
  .sw-main{flex-direction:row;gap:clamp(18px,4cqw,56px);--wd:min(48cqw,72cqh)}
  .sw-panel{width:min(42cqw,520px)}
}

/* wheel */
.sw-spin{transition:transform 5.2s cubic-bezier(.12,.72,.08,1)}
.sw-bulb{animation:sw-chase 1.6s steps(1) infinite}
.sw-going .sw-bulb{animation-duration:.35s}
@keyframes sw-chase{0%{opacity:1}50%{opacity:.25}100%{opacity:1}}
.sw-pointer{transform-box:fill-box;transform-origin:50% 12%}
.sw-going .sw-pointer{animation:sw-flick .14s ease-in-out infinite alternate}
@keyframes sw-flick{from{transform:rotate(-9deg)}to{transform:rotate(7deg)}}
.sw-hubpulse{animation:sw-hub 2.4s ease-in-out infinite}
@keyframes sw-hub{0%,100%{filter:brightness(1)}50%{filter:brightness(1.18)}}

/* info card: rules + the 12 gifts (always visible) */
.sw-info{width:100%;border-radius:16px;padding:clamp(7px,1.4cqh,14px) clamp(8px,1.6cqw,16px);background:linear-gradient(145deg,rgba(255,255,255,.1),rgba(255,255,255,.04));border:1.5px solid rgba(246,210,122,.4);box-shadow:inset 0 0 30px rgba(0,0,0,.25)}
.sw-h{margin:0 0 .4em;display:flex;align-items:center;gap:.6em;font-weight:700;font-size:clamp(10px,min(1.5cqw,1.9cqh),14px);letter-spacing:.24em;text-transform:uppercase;color:#f1c978;white-space:nowrap}
.sw-h::before,.sw-h::after{content:"";height:1px;flex:1;background:linear-gradient(90deg,transparent,rgba(241,201,120,.6))}
.sw-h::after{background:linear-gradient(270deg,transparent,rgba(241,201,120,.6))}
.sw-rules{display:grid;grid-template-columns:1fr 1fr;gap:clamp(4px,.9cqh,9px) clamp(8px,1.4cqw,14px)}
.sw-rule{display:flex;gap:.55em;align-items:flex-start;min-width:0}
.sw-ri{flex:none;width:clamp(22px,min(3.2cqw,3.8cqh),32px);aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:clamp(11px,1.8cqh,16px);background:radial-gradient(circle at 35% 30%,#8a111c,#4a0710);box-shadow:0 0 0 2px #e8b84a,0 3px 6px rgba(0,0,0,.4)}
.sw-rt{margin:0;font-weight:700;line-height:1.12;font-size:clamp(11px,min(1.55cqw,2cqh),15.5px);color:#ffe4a0}
.sw-rd{margin:.12em 0 0;line-height:1.2;font-size:clamp(10px,min(1.3cqw,1.7cqh),13.5px);color:#e8d7b3}
.sw-warn{margin:.45em 0 0;padding-top:.35em;border-top:1px dashed rgba(241,201,120,.3);text-align:center;font-weight:700;font-size:clamp(10px,min(1.35cqw,1.7cqh),13px);color:#f5d58c}
.sw-sep{height:1px;margin:clamp(5px,1cqh,10px) 0 clamp(4px,.8cqh,8px);background:linear-gradient(90deg,transparent,rgba(241,201,120,.5),transparent)}
.sw-plist{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(3px,.6cqh,6px) clamp(4px,.7cqw,8px);margin:0;padding:0;list-style:none}
.sw-pz{position:relative;display:flex;align-items:center;gap:.4em;min-width:0;padding:.22em .45em;border-radius:9px;border:1px solid rgba(244,209,125,.18);background:rgba(255,255,255,.06);color:#ead9b8;font-weight:600;line-height:1.1;font-size:clamp(10px,min(1.4cqw,1.8cqh),14px);transition:all .5s ease}
.sw-pz i{font-style:normal;font-size:1.25em;flex:none}
.sw-pz span{min-width:0;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.sw-pz.won{border-color:#f4d17d;background:linear-gradient(180deg,#fbefd3,#efd9a6);color:#4a1420;box-shadow:0 0 14px rgba(255,214,120,.6);animation:sw-won .8s cubic-bezier(.3,1.5,.5,1) both}
@keyframes sw-won{from{transform:scale(.7);opacity:.4}to{transform:none;opacity:1}}
.sw-pz b{position:absolute;right:-5px;top:-8px;min-width:1.7em;height:1.7em;padding:0 .3em;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:.88em;color:#fff6e4;background:radial-gradient(circle at 35% 30%,#e8584f,#b3202a);box-shadow:0 0 0 1.5px #f6e7c1}
@container sw (aspect-ratio < 1.2) and (max-height: 900px){.sw-rd,.sw-warn{display:none}}
@container sw (aspect-ratio >= 1.2) and (max-height: 640px){.sw-rd,.sw-warn{display:none}}
/* very short phones: keep everything on one screen */
@container sw (aspect-ratio < 1.2) and (max-height: 700px){
  .sw-sub,.sw-msg,.sw-eyebrow{display:none}
  .sw-head{padding-top:clamp(14px,3cqh,26px)}
  .sw-main{--wd:min(70cqw,27cqh);gap:6px}
  .sw-info{padding:6px 8px}.sw-sep{margin:4px 0}
  .sw-pz{padding:.1em .35em}
  .sw-panel{gap:6px}
}

/* remaining chances: three baubles on a gold-edged plate */
.sw-ch{display:flex;align-items:center;justify-content:center;gap:clamp(8px,1.6cqw,16px);padding:.3em clamp(12px,2cqw,20px);border-radius:999px;background:linear-gradient(180deg,#5a0f1e,#2b0710);box-shadow:inset 0 0 0 2px #d9a336,inset 0 0 0 4px #4a0b17,0 8px 18px rgba(0,0,0,.4)}
.sw-ch-t{margin:0;text-align:right;line-height:1.05;font-style:italic;font-weight:600;font-size:clamp(13px,min(2cqw,2.6cqh),20px);color:#ffe9c9}
.sw-ch-t small{display:block;font-style:normal;font-weight:700;font-size:.62em;letter-spacing:.3em;text-transform:uppercase;color:#f1c978}
.sw-ch-row{display:flex;gap:clamp(4px,.9cqw,10px)}
.sw-bl{width:clamp(24px,min(3.6cqw,5cqh),40px);height:auto;transform-origin:50% 0;transition:transform .7s cubic-bezier(.3,1.4,.5,1),opacity .6s ease,filter .6s ease;animation:sw-swing 3.6s ease-in-out infinite alternate}
.sw-bl:nth-child(2){animation-delay:-1.2s}.sw-bl:nth-child(3){animation-delay:-2.4s}
@keyframes sw-swing{from{rotate:-5deg}to{rotate:5deg}}
.sw-bl.used{animation:none;transform:translateY(7px) rotate(24deg);opacity:.38;filter:grayscale(1)}

/* the button */
.sw-btn{position:relative;width:min(100%,390px);padding:clamp(3px,.6cqh,5px);border:0;border-radius:999px;cursor:pointer;background:repeating-linear-gradient(45deg,#c8202e 0 9px,#fff6e8 9px 18px);
  box-shadow:0 5px 0 #6e0c16,0 14px 26px rgba(0,0,0,.45),0 0 36px rgba(255,120,100,.3);transition:transform .15s ease,filter .15s ease,box-shadow .15s ease;-webkit-tap-highlight-color:transparent}
.sw-btn-in{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:.55em;padding:.42em 1.1em;border-radius:999px;
  box-shadow:inset 0 0 0 3px #e8b84a,inset 0 0 0 5px #7a4f10,inset 0 8px 14px rgba(255,255,255,.22);background:radial-gradient(120% 170% at 50% 0%,#ef5650,#b3202a 55%,#6e0c16)}
.sw-btn:not(:disabled) .sw-btn-in::after{content:"";position:absolute;top:0;bottom:0;width:36%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);animation:sw-sheen 3s ease-in-out infinite}
@keyframes sw-sheen{0%,60%{left:-60%}100%{left:130%}}
.sw-btn-t{position:relative;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;white-space:nowrap;font-size:clamp(19px,min(3.2cqw,4.2cqh),32px);
  background:linear-gradient(180deg,#fffbe0,#f8dd86 50%,#d9a336);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 rgba(58,0,12,.85))}
.sw-btn svg{position:relative;flex:none;width:clamp(22px,min(3.4cqw,4.6cqh),36px);height:auto;filter:drop-shadow(0 2px 2px rgba(0,0,0,.5))}
.sw-btn:not(:disabled) svg.gift{animation:sw-wob 2.2s ease-in-out infinite}
@keyframes sw-wob{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg) translateY(-2px)}}
.sw-btn svg.snow{animation:sw-rot 1.4s linear infinite}
@keyframes sw-rot{to{transform:rotate(360deg)}}
.sw-btn:hover:not(:disabled){transform:translateY(-3px);filter:brightness(1.08)}
.sw-btn:active:not(:disabled){transform:translateY(4px);box-shadow:0 1px 0 #6e0c16,0 6px 12px rgba(0,0,0,.4)}
.sw-btn:disabled{cursor:not-allowed}
.sw-btn:disabled:not(.busy){filter:grayscale(.85) brightness(.75)}
.sw-btn:focus-visible{outline:3px solid #fff;outline-offset:4px}
.sw-msg{margin:0;min-height:1.3em;text-align:center;font-style:italic;font-weight:600;font-size:clamp(12px,min(1.9cqw,2.6cqh),18px);color:#ffe9c9}

/* overlays */
.sw-veil{position:absolute;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:clamp(10px,3cqh,30px);background:rgba(8,3,6,.68);backdrop-filter:blur(3px);animation:sw-fade .4s ease both}
@keyframes sw-fade{from{opacity:0}to{opacity:1}}
.sw-card{position:relative;width:min(100%,430px);max-height:100%;overflow:auto;text-align:center;border-radius:22px;padding:clamp(16px,3.4cqh,30px) clamp(16px,3.6cqw,32px);color:#3b2410;
  background:radial-gradient(120% 100% at 30% 10%,#fbefd3,#f1dcb0 60%,#e5c98f);box-shadow:inset 0 0 60px rgba(150,100,40,.35),0 0 0 4px #d9a336,0 0 0 8px #7a4f10,0 30px 70px rgba(0,0,0,.6);animation:sw-card .8s cubic-bezier(.2,.9,.3,1) both;scrollbar-width:thin}
@keyframes sw-card{from{opacity:0;transform:translateY(26px) scale(.9)}to{opacity:1;transform:none}}
.sw-card::before{content:"";position:absolute;inset:7px;border:1.5px dashed rgba(138,26,46,.45);border-radius:16px;pointer-events:none}
.sw-ck{margin:0;font-size:clamp(10px,1.8cqw,13px);letter-spacing:.3em;text-transform:uppercase;font-weight:700;color:#a8281f}
.sw-bigemoji{margin:.1em 0 0;font-size:clamp(54px,12cqh,92px);line-height:1;filter:drop-shadow(0 8px 10px rgba(0,0,0,.35));animation:sw-bob 2.4s ease-in-out infinite alternate}
@keyframes sw-bob{from{transform:translateY(0) rotate(-5deg) scale(1)}to{transform:translateY(-8px) rotate(5deg) scale(1.06)}}
.sw-cname{margin:.1em 0 0;font-family:'Mountains of Christmas',cursive;font-weight:700;line-height:1.05;font-size:clamp(26px,min(5cqw,7cqh),44px);color:#8a1a2e}
.sw-cnote{margin:.5em 0 0;font-style:italic;font-weight:600;font-size:clamp(15px,min(2.2cqw,3cqh),20px);line-height:1.4;color:#5a3a26}
.sw-cleft{margin:.6em 0 0;font-size:clamp(11px,1.7cqw,14px);letter-spacing:.2em;text-transform:uppercase;font-weight:700;color:#806344}
.sw-ok{margin-top:.9em;padding:.5em 1.8em;border:0;border-radius:999px;cursor:pointer;font-family:inherit;font-weight:700;letter-spacing:.06em;font-size:clamp(15px,2.2cqw,19px);color:#fff6e4;background:linear-gradient(180deg,#e0453d,#a3121f);box-shadow:0 4px 0 #6e0c16,0 10px 20px rgba(0,0,0,.35)}
.sw-ok:hover{filter:brightness(1.08)}.sw-ok:focus-visible{outline:3px solid #2f7fd0;outline-offset:3px}
.sw-conf{position:absolute;top:-6%;pointer-events:none;animation:sw-conf linear infinite;z-index:31}
@keyframes sw-conf{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(115cqh) rotate(720deg);opacity:.9}}
.sw-snd{position:absolute;right:clamp(8px,2cqw,22px);top:clamp(30px,6cqh,56px);z-index:10;width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(246,210,122,.7);background:rgba(0,0,0,.45);color:#f8dd86;cursor:pointer;font-size:15px}
.sw-snd:hover{background:rgba(246,210,122,.25)}.sw-snd:focus-visible{outline:2px solid #fff;outline-offset:2px}

@media (prefers-reduced-motion: reduce){
  .sw-flake,.sw-lb,.sw-bulb,.sw-going .sw-pointer,.sw-hubpulse,.sw-btn-in::after,.sw-btn svg,.sw-bl,.sw-bigemoji,.sw-conf{animation:none !important}
  .sw-wheelbox,.sw-card,.sw-pz.won,.sw-veil{animation-duration:.01s !important}
  .sw-spin{transition-duration:.6s !important}
}
`;

/* ------------------------------------------------------------------ */
/*  The wheel (one SVG: static rim + rotating disc + hub + pointer)    */
/* ------------------------------------------------------------------ */

const CX = 230; const CY = 236; const R = 188;

function Wheel({ rotation, spinning }) {
  const n = GIFTS.length; const step = 360 / n;
  const bulbs = useMemo(() => Array.from({ length: 28 }, (_, i) => ({ i, p: pt(CX, CY, 213, (i * 360) / 28 - 90), c: ["#fff3bf", "#ff8f8f", "#fff3bf", "#9ae6b4"][i % 4] })), []);
  return (
    <svg viewBox="0 -8 460 478" className={`sw-svg ${spinning ? "sw-going" : ""}`} role="img" aria-label="Ruleta de Navidad">
      <defs>
        <linearGradient id="swGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".3" stopColor="#e8b84a" /><stop offset=".55" stopColor="#8a5a12" /><stop offset=".8" stopColor="#f1cd6a" /><stop offset="1" stopColor="#a8721f" /></linearGradient>
        <radialGradient id="swRed" cx="50%" cy="50%" r="55%"><stop offset="0" stopColor="#8a111c" /><stop offset=".6" stopColor="#c8202e" /><stop offset="1" stopColor="#e0453d" /></radialGradient>
        <radialGradient id="swGreen" cx="50%" cy="50%" r="55%"><stop offset="0" stopColor="#0f5a36" /><stop offset=".6" stopColor="#1f8a56" /><stop offset="1" stopColor="#2fae72" /></radialGradient>
        <radialGradient id="swHub" cx="35%" cy="28%" r="80%"><stop offset="0" stopColor="#fff9d8" /><stop offset=".45" stopColor="#e8b84a" /><stop offset="1" stopColor="#8a5a12" /></radialGradient>
        <radialGradient id="swShine" cx="35%" cy="25%" r="75%"><stop offset="0" stopColor="#fff" stopOpacity=".32" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".28" /></radialGradient>
        <filter id="swBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>

      {/* shadow + rim */}
      <ellipse cx={CX} cy={CY + 232} rx="170" ry="14" fill="#000" opacity=".5" filter="url(#swBlur)" />
      <circle cx={CX} cy={CY} r="228" fill="#4a0b17" />
      <circle cx={CX} cy={CY} r="226" fill="none" stroke="url(#swGold)" strokeWidth="10" />
      <circle cx={CX} cy={CY} r="213" fill="none" stroke="#fff6e8" strokeWidth="14" strokeDasharray="11 11" />
      <circle cx={CX} cy={CY} r="213" fill="none" stroke="#c8202e" strokeWidth="14" strokeDasharray="11 11" strokeDashoffset="11" />
      <circle cx={CX} cy={CY} r="200" fill="none" stroke="url(#swGold)" strokeWidth="7" />
      {bulbs.map((b) => <g key={b.i}><circle cx={b.p[0]} cy={b.p[1]} r="7.5" fill={b.c} opacity=".25" /><circle className="sw-bulb" cx={b.p[0]} cy={b.p[1]} r="3.8" fill={b.c} style={{ animationDelay: `${(b.i % 4) * 0.4}s` }} /></g>)}

      {/* rotating disc */}
      <g className="sw-spin" style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${CX}px ${CY}px` }}>
        <circle cx={CX} cy={CY} r={R + 4} fill="#fff6e8" />
        {GIFTS.map((g, i) => {
          const a0 = -90 + i * step; const a1 = a0 + step; const mid = a0 + step / 2;
          const [x0, y0] = pt(CX, CY, R, a0); const [x1, y1] = pt(CX, CY, R, a1);
          const [ex, ey] = pt(CX, CY, 158, mid);
          return (
            <g key={g.name}>
              <path d={`M${CX} ${CY}L${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}Z`} fill={i % 2 ? "url(#swGreen)" : "url(#swRed)"} stroke="#f6e7c1" strokeWidth="2.5" />
              <g transform={`rotate(${mid} ${CX} ${CY})`}>
                <text x={CX + 108} y={CY} textAnchor="middle" dominantBaseline="middle" fill="#fff6e4" stroke="#3a0a14" strokeWidth="2.6" paintOrder="stroke" strokeLinejoin="round" fontFamily="'Cormorant Garamond',Georgia,serif" fontWeight="700" fontSize="15.5">
                  {g.wheelLines.map((l, k) => <tspan key={k} x={CX + 108} dy={k === 0 ? "-7.5" : "17"}>{l}</tspan>)}
                </text>
              </g>
              <text x={ex} y={ey} textAnchor="middle" dominantBaseline="central" fontSize="25" transform={`rotate(${mid + 90} ${ex} ${ey})`}>{g.emoji}</text>
            </g>
          );
        })}
        {GIFTS.map((_, i) => { const [px, py] = pt(CX, CY, R + 1, -90 + i * step); return <circle key={i} cx={px} cy={py} r="5" fill="url(#swGold)" stroke="#6e4a10" strokeWidth="1" />; })}
        <circle cx={CX} cy={CY} r={R} fill="url(#swShine)" />
      </g>

      {/* hub */}
      <g className="sw-hubpulse">
        <circle cx={CX} cy={CY} r="46" fill="#7a0f1a" />
        <circle cx={CX} cy={CY} r="42" fill="url(#swHub)" stroke="#8a5a12" strokeWidth="2" />
        <circle cx={CX} cy={CY} r="31" fill="none" stroke="#a3121f" strokeWidth="2.5" strokeDasharray="3 5" />
        <path d={`M${CX} ${CY - 22}L${CX + 6.5} ${CY - 7}L${CX + 22} ${CY - 6}L${CX + 10} ${CY + 4}L${CX + 14} ${CY + 20}L${CX} ${CY + 11}L${CX - 14} ${CY + 20}L${CX - 10} ${CY + 4}L${CX - 22} ${CY - 6}L${CX - 6.5} ${CY - 7}Z`} fill="#c8202e" stroke="#7a0f1a" strokeWidth="1.5" strokeLinejoin="round" />
      </g>

      {/* pointer */}
      <g className="sw-pointer" style={{ filter: "drop-shadow(0 5px 4px rgba(0,0,0,.55))" }}>
        <path d={`M${CX} ${CY - R + 32}C${CX - 24} ${CY - R + 8} ${CX - 22} ${CY - R - 26} ${CX} ${CY - R - 30}C${CX + 22} ${CY - R - 26} ${CX + 24} ${CY - R + 8} ${CX} ${CY - R + 32}Z`} fill="url(#swGold)" stroke="#6e4a10" strokeWidth="2" />
        <circle cx={CX} cy={CY - R - 8} r="8.5" fill="#d9262f" stroke="#7a0f1a" strokeWidth="2" />
        <circle cx={CX - 2.6} cy={CY - R - 10.5} r="2.6" fill="#fff" opacity=".8" />
      </g>
    </svg>
  );
}


/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

function GiftIcon() {
  return (
    <svg className="gift" viewBox="0 0 40 40" aria-hidden="true">
      <rect x="6" y="17" width="28" height="19" rx="4" fill="#fff6e8" stroke="#fff6e8" strokeWidth="3" strokeLinejoin="round" />
      <rect x="4" y="12" width="32" height="9" rx="3" fill="#fff6e8" stroke="#fff6e8" strokeWidth="3" strokeLinejoin="round" />
      <rect x="17" y="12" width="6" height="24" fill="#d9a336" /><rect x="4" y="14.5" width="32" height="4" fill="#d9a336" opacity=".0" />
      <path d="M20 12C14 2 7 6 11 11C13 13 18 12 20 12ZM20 12C26 2 33 6 29 11C27 13 22 12 20 12Z" fill="#f2c24a" stroke="#a8721f" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3L25 15L38 16L28 25L31 38L20 31L9 38L12 25L2 16L15 15Z" fill="#f2c24a" stroke="#a8721f" strokeWidth="2" strokeLinejoin="round" /></svg>
  );
}
function SnowIcon() {
  return (
    <svg className="snow" viewBox="0 0 40 40" aria-hidden="true">
      <g stroke="#fff3bf" strokeWidth="3" strokeLinecap="round" fill="none">{[0, 60, 120].map((r) => <g key={r} transform={`rotate(${r} 20 20)`}><path d="M20 4V36" /><path d="M20 9L15 5M20 9L25 5M20 31L15 35M20 31L25 35" /></g>)}</g>
    </svg>
  );
}
function LockIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M12 18V13C12 8 15.5 5 20 5C24.5 5 28 8 28 13V18" fill="none" stroke="#d9a336" strokeWidth="4" strokeLinecap="round" /><rect x="7" y="17" width="26" height="19" rx="5" fill="#f2c24a" stroke="#a8721f" strokeWidth="2" /><circle cx="20" cy="26" r="3" fill="#5a0f19" /></svg>
  );
}

const BAUBLE_COLORS = ["#d9262f", "#1f9a62", "#f2b632"];
function Bauble({ i, used }) {
  const c = BAUBLE_COLORS[i % 3];
  const id = `swB${i}`;
  return (
    <svg viewBox="0 0 40 54" className={`sw-bl ${used ? "used" : ""}`} aria-hidden="true" style={{ overflow: "visible" }}>
      <defs><radialGradient id={id} cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset=".32" stopColor={c} /><stop offset="1" stopColor="#000" stopOpacity=".55" /></radialGradient></defs>
      <path d="M20 0V9" stroke="#e8b84a" strokeWidth="1.6" />
      <rect x="14" y="7" width="12" height="8" rx="2.5" fill="#e8b84a" stroke="#a8721f" />
      <circle cx="20" cy="34" r="19" fill={`url(#${id})`} />
      <path d="M7 32Q20 41 33 32" fill="none" stroke="#fff6e8" strokeWidth="3.4" strokeLinecap="round" opacity=".85" />
      <path d="M10 25Q14 18 22 17" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Sound (optional)                                                   */
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
  const tone = useCallback((f, d, type = "sine", v = 0.14, delay = 0) => {
    const c = ctxRef.current; if (!c || !onRef.current) return;
    const t = c.currentTime + delay; const o = c.createOscillator(); const g = c.createGain();
    o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.05);
  }, []);
  const whoosh = useCallback(() => { [220, 277, 330, 392, 494, 587].forEach((f, i) => tone(f, 0.5, "triangle", 0.05, i * 0.22)); }, [tone]);
  const win = useCallback(() => { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 1.4, "triangle", 0.15, i * 0.12)); [1318.5, 1567.98, 2093].forEach((f, i) => tone(f, 1, "sine", 0.07, 0.5 + i * 0.1)); }, [tone]);
  useEffect(() => () => { if (ctxRef.current) ctxRef.current.close().catch(() => {}); }, []);
  return { ensure, whoosh, win, on, setOn };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ChristmasFortuneWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [remaining, setRemaining] = useState(() => Math.max(0, MAX_SPINS - readUsed()));
  const [results, setResults] = useState(readResults);
  const [latest, setLatest] = useState(null);
  const [showPrize, setShowPrize] = useState(false);

  const timeoutRef = useRef(null);
  const spinLockRef = useRef(false);
  const sound = useSound();

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  // Escape closes the dialogs
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setShowPrize(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const spin = () => {
    if (spinLockRef.current || remaining <= 0) return;

    spinLockRef.current = true;
    setSpinning(true);
    setLatest(null);
    setShowPrize(false);
    sound.ensure();
    sound.whoosh();

    const used = readUsed();

    if (used >= MAX_SPINS) {
      setRemaining(0);
      setSpinning(false);
      spinLockRef.current = false;
      return;
    }

    const newUsed = used + 1;

    writeUsed(newUsed);
    setRemaining(MAX_SPINS - newUsed);

    const count = GIFTS.length;
    const step = 360 / count;
    const index = Math.floor(Math.random() * count);

    const target = ((360 - (index + 0.5) * step) % 360 + 360) % 360;

    const current = ((rotation % 360) + 360) % 360;
    const delta = (target - current + 360) % 360;

    const nextRotation = rotation + 360 * 7 + delta;

    setRotation(nextRotation);

    timeoutRef.current = setTimeout(() => {
      const prize = { ...GIFTS[index], id: Date.now() };

      setLatest(prize);
      setShowPrize(true);
      sound.win();

      setResults((previous) => {
        const updated = [prize, ...previous];
        writeResults(updated);
        return updated;
      });

      setSpinning(false);
      spinLockRef.current = false;
      timeoutRef.current = null;
    }, SPIN_MS);
  };

  const flakes = useMemo(() => { const r = rng(5); return Array.from({ length: 28 }, (_, i) => ({ id: i, left: r() * 100, size: r() * 4 + 2, dur: r() * 7 + 9, delay: -r() * 14, o: 0.3 + r() * 0.5 })); }, []);
  const bulbs = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ id: i, x: (i + 0.5) * (100 / 22), y: 8 + Math.abs(Math.sin(i * 0.8)) * 10, c: ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"][i % 5] })), []);
  const confetti = useMemo(() => { const r = rng(9); return Array.from({ length: 34 }, (_, i) => ({ id: i, left: r() * 100, c: ["#ffd45a", "#d9362f", "#35a35c", "#f6e7c1", "#7dd3fc", "#ff9ad5"][i % 6], dur: 4 + r() * 4, delay: -r() * 6, w: 6 + r() * 6 })); }, []);

  // which gifts she already won, and in which order (a gift can come out twice)
  const won = {};
  [...results].reverse().forEach((g, i) => { (won[g.name] = won[g.name] || []).push(i + 1); });

  return (
    <section className="sw max-w-full max-h-full">
      <style>{CSS}</style>
      <div className="sw-glow" aria-hidden="true" />
      {flakes.map((f) => <span key={f.id} className="sw-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true" />)}
      <div className="sw-lights" aria-hidden="true">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}><path d={`M0 2 ${bulbs.map((b) => `L${b.x} ${b.y}`).join(" ")} L100 2`} fill="none" stroke="#e8c878" strokeOpacity=".6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" /></svg>
        {bulbs.map((b) => <span key={b.id} className="sw-lb" style={{ left: `${b.x}%`, top: b.y * 1.1, background: b.c, boxShadow: `0 0 12px 3px ${b.c}`, animationDelay: `${(b.id % 5) * 0.4}s` }} />)}
      </div>
      <button type="button" className="sw-snd" onClick={() => sound.setOn(!sound.on)} aria-pressed={sound.on} aria-label={sound.on ? "Desactivar el sonido" : "Activar el sonido"}>{sound.on ? "♫" : "♪"}</button>

      <header className="sw-head">
        <p className="sw-eyebrow">✨ Una pequeña magia navideña ✨</p>
        <h2 className="sw-title">La ruleta de los regalos</h2>
        <p className="sw-sub">¡Ha llegado el momento de descubrir tus sorpresas, mi amor! ❤️</p>
      </header>

      <div className="sw-main">
        <div className="sw-wheelbox">
          <Wheel rotation={rotation} spinning={spinning} />
        </div>

        <div className="sw-panel">
          {/* Reglas + los 12 regalos, siempre visibles */}
          <section className="sw-info" aria-label="Reglas y regalos">
            <h3 className="sw-h">🎄 Las reglas del juego</h3>
            <div className="sw-rules">
              <div className="sw-rule"><span className="sw-ri" aria-hidden="true">🎁</span><div><p className="sw-rt">Los regalos ya están decididos</p><p className="sw-rd">12 regalos preparados de antemano. No puedes elegir ni cambiar los premios.</p></div></div>
              <div className="sw-rule"><span className="sw-ri" aria-hidden="true">🎡</span><div><p className="sw-rt">La ruleta decide por ti</p><p className="sw-rd">Cada regalo se selecciona al azar cuando giras la ruleta.</p></div></div>
              <div className="sw-rule"><span className="sw-ri" aria-hidden="true">❤️</span><div><p className="sw-rt">¡Tienes exactamente 3 oportunidades!</p><p className="sw-rd">Tres giros como máximo. No tendrás una cuarta oportunidad.</p></div></div>
              <div className="sw-rule"><span className="sw-ri" aria-hidden="true">✨</span><div><p className="sw-rt">Cada giro cuenta</p><p className="sw-rd">Cada vez que pulses el botón, gastarás una de tus oportunidades.</p></div></div>
            </div>
            <p className="sw-warn">🔒 Cuando uses tus tres giros, el juego terminará.</p>

            <div className="sw-sep" aria-hidden="true" />
            <h3 className="sw-h">🎁 Los 12 regalos posibles</h3>
            <ul className="sw-plist">
              {GIFTS.map((g) => (
                <li key={g.name} className={`sw-pz ${won[g.name] ? "won" : ""}`}>
                  <i aria-hidden="true">{g.emoji}</i><span>{g.name}</span>
                  {won[g.name] && <b aria-label={`Ganado en el giro ${won[g.name].join(" y ")}`}>{won[g.name].join("·")}</b>}
                </li>
              ))}
            </ul>
          </section>

          <div className="sw-ch" role="img" aria-label={`Oportunidades restantes: ${remaining} de ${MAX_SPINS}`}>
            <p className="sw-ch-t"><small>Oportunidades</small>restantes</p>
            <div className="sw-ch-row">
              {Array.from({ length: MAX_SPINS }, (_, i) => <Bauble key={i} i={i} used={i >= remaining} />)}
            </div>
          </div>

          <button type="button" className={`sw-btn ${spinning ? "busy" : ""}`} onClick={spin} disabled={spinning || remaining <= 0}>
            <span className="sw-btn-in">
              {spinning ? <SnowIcon /> : remaining > 0 ? <GiftIcon /> : <LockIcon />}
              <span className="sw-btn-t">{spinning ? "¡Girando…!" : remaining > 0 ? "¡Girar la ruleta!" : "Sin más oportunidades"}</span>
              {spinning ? <SnowIcon /> : remaining > 0 ? <StarIcon /> : <LockIcon />}
            </span>
          </button>

          <p className="sw-msg" aria-live="polite">
            {spinning ? "¡Qué emoción! Tu regalo está a punto de aparecer... ✨" : remaining === 0 ? "¡Espero que hayas disfrutado de tus tres sorpresas, mi amor! ❤️" : "¡Que la suerte esté de tu lado! 🍀"}
          </p>
        </div>
      </div>

      {/* Prize pop-up */}
      {latest && showPrize && !spinning && (
        <div className="sw-veil" role="dialog" aria-modal="true" aria-label="Regalo descubierto">
          {confetti.map((c) => <span key={c.id} className="sw-conf" style={{ left: `${c.left}%`, width: c.w, height: c.w * 1.5, background: c.c, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} aria-hidden="true" />)}
          <div className="sw-card" aria-live="polite">
            <p className="sw-ck">✨ ¡Has descubierto un regalo! ✨</p>
            <p className="sw-bigemoji" aria-hidden="true">{latest.emoji}</p>
            <h3 className="sw-cname">{latest.name}</h3>
            <p className="sw-cnote">¡Una pequeña sorpresa preparada especialmente para ti, con muchísimo amor! ❤️</p>
            <p className="sw-cleft">{remaining > 0 ? `Te quedan ${remaining} ${remaining === 1 ? "oportunidad" : "oportunidades"}` : "Has usado tus tres oportunidades"}</p>
            <button type="button" className="sw-ok" autoFocus onClick={() => setShowPrize(false)}>{remaining > 0 ? "¡Genial! ✨" : "¡Gracias! ❤️"}</button>
          </div>
        </div>
      )}

    </section>
  );
}