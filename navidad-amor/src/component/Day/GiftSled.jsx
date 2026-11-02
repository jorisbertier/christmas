import React, { useMemo, useState } from "react";
import couponImg from "../../assets/cupon/cupon.png";

const NB_CLICS = 5;

// Position du couvercle selon le nombre de clics (unités du cadeau : x, y en px SVG, r en degrés)
const LID = [
  { x: 0, y: 0, r: 0, o: 1 },
  { x: -1, y: -3, r: -1.5, o: 1 },
  { x: -3, y: -11, r: -5, o: 1 },
  { x: -7, y: -24, r: -11, o: 1 },
  { x: -12, y: -42, r: -20, o: 1 },
  { x: -50, y: -230, r: -60, o: 0 }, // envol final
];
const HALO = [0, 0, 0.3, 0.55, 0.85, 1];
const RAYOS = [0, 0, 0, 0.35, 0.65, 0.95];
const BRILLO = [0, 0, 0.35, 0.65, 0.9, 1];
const INDICES = [
  "Toca el regalo para abrirlo",
  "El lazo empieza a aflojarse…",
  "¡La tapa se mueve!",
  "Hay un resplandor ahí dentro…",
  "Un último esfuerzo…",
];

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
const lighten = (h, a) => mix(h, "#ffffff", a);
const darken = (h, a) => mix(h, "#000000", a);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

.cs{container-type:inline-size;height:100%;min-height:100svh;width:100%;position:relative;display:flex;flex-direction:column;align-items:center;overflow:hidden;color:#fff6e4;font-family:'Cormorant Garamond',Georgia,serif;
  background:#0b1a33}
.cs-bg{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
.cs-head{position:relative;z-index:5;flex:none;text-align:center;padding:clamp(12px,3cqw,26px) 16px 0}
.cs-title{margin:0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;font-size:clamp(24px,5.6cqw,52px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 rgba(58,0,12,.7)) drop-shadow(0 0 22px rgba(255,200,90,.3))}
.cs-hint{display:inline-block;margin:.5em 0 0;padding:.25em 1.2em;min-height:1.6em;border-radius:999px;border:1.5px dashed rgba(246,210,122,.55);background:rgba(0,0,0,.28);font-style:italic;font-size:clamp(14px,2.8cqw,21px);color:#ffe9c9}
.cs-hint span{display:inline-block;animation:cs-in .5s cubic-bezier(.2,.9,.3,1) both}
@keyframes cs-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.cs-prog{display:flex;justify-content:center;gap:clamp(8px,2cqw,14px);margin-top:.6em}
.cs-orn{width:clamp(14px,2.6cqw,22px);aspect-ratio:1;border-radius:50%;border:2px solid rgba(246,210,122,.5);background:transparent;transition:all .45s cubic-bezier(.3,1.6,.5,1)}
.cs-orn.on{background:radial-gradient(circle at 35% 30%,#fff3bf,#e8b84a 60%,#a8721f);border-color:#fff3bf;box-shadow:0 0 14px 3px rgba(255,214,120,.7);transform:scale(1.15)}

/* scene */
.cs-stage{position:relative;z-index:2;width:100%;min-height:0;display:flex;align-items:stretch;justify-content:center;flex:1 1 0}
.cs.open .cs-stage{flex:0 0 46%}
.cs-scene{position:relative;flex:1 1 auto;width:100%;min-height:0;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none}
.cs-scene[aria-disabled="true"]{cursor:default}
.cs-scene:focus-visible{outline:2px solid #fcd34d;outline-offset:-4px;border-radius:24px}
.cs-svg{position:absolute;inset:0;display:block;width:100%;height:100%;overflow:visible}

.cs-star{animation:cs-tw 3s ease-in-out infinite}
@keyframes cs-tw{0%,100%{opacity:1}50%{opacity:.3}}
.cs-aur{animation:cs-aur 14s ease-in-out infinite alternate}
@keyframes cs-aur{from{transform:translateX(-30px)}to{transform:translateX(30px)}}
.cs-snow{animation:cs-fall linear infinite}
@keyframes cs-fall{0%{transform:translate(0,-20px)}50%{transform:translate(16px,200px)}100%{transform:translate(-10px,420px)}}
.cs-float{animation:cs-float 4s ease-in-out infinite}
@keyframes cs-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
.cs-swing{transform-box:fill-box;transform-origin:50% 0;animation:cs-sw 3.6s ease-in-out infinite alternate}
@keyframes cs-sw{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}
.cs-bulb{animation:cs-tw 2.4s ease-in-out infinite}

.cs-gift{transform-box:fill-box;transform-origin:50% 100%}
.cs-sac-a{animation:cs-sa .5s ease-in-out}
.cs-sac-b{animation:cs-sb .5s ease-in-out}
@keyframes cs-sa{0%,100%{transform:none}20%{transform:rotate(-4deg) scale(.96)}50%{transform:rotate(3deg) scale(1.04)}80%{transform:rotate(-1.5deg)}}
@keyframes cs-sb{0%,100%{transform:none}20%{transform:rotate(4deg) scale(.96)}50%{transform:rotate(-3deg) scale(1.04)}80%{transform:rotate(1.5deg)}}
.cs-lid{transition:transform .7s cubic-bezier(.3,1.35,.5,1),opacity .6s ease .15s}
.cs-fade{transition:opacity .7s ease}
.cs-beam{animation:cs-beam 3s ease-in-out infinite}
@keyframes cs-beam{0%,100%{filter:brightness(1)}50%{filter:brightness(1.3)}}
.cs-spark{transform-box:fill-box;transform-origin:50% 50%;animation:cs-spk 1.8s cubic-bezier(.15,.7,.3,1) both;animation-delay:var(--d)}
@keyframes cs-spk{0%{opacity:1;transform:translate(0,0) scale(.2)}70%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.5) rotate(120deg)}}
.cs-conf{animation:cs-cf linear infinite}
@keyframes cs-cf{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(330px) rotate(540deg);opacity:.9}}

/* coupon */
.cs-coupon{position:relative;z-index:3;flex:0 0 0;min-height:0;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:opacity .6s ease .3s;padding:0 4cqw}
.cs.open .cs-coupon{flex:1 1 0;opacity:1}
.cs-ticket{position:relative;flex:1 1 0;min-height:0;display:flex;align-items:center;justify-content:center;width:100%;animation:cs-pop .9s cubic-bezier(.2,.8,.2,1) both}
@keyframes cs-pop{0%{opacity:0;transform:translateY(40px) scale(.85) rotate(-3deg)}70%{transform:translateY(-6px) scale(1.02) rotate(.5deg)}100%{opacity:1;transform:none}}
.cs-ticket img{max-height:100%;max-width:min(100%,680px);object-fit:contain;filter:drop-shadow(0 18px 28px rgba(0,0,0,.6)) drop-shadow(0 0 34px rgba(255,200,110,.28))}
.cs-reset{flex:none;margin:clamp(6px,1.4cqw,14px) 0 clamp(8px,2cqw,16px);padding:.35em 1.4em;border-radius:999px;border:1.5px solid rgba(246,210,122,.85);background:rgba(58,10,24,.92);color:#f8dd86;font-family:inherit;font-weight:700;font-style:italic;font-size:clamp(14px,2.6cqw,19px);cursor:pointer;box-shadow:0 6px 16px rgba(0,0,0,.4);transition:background .2s ease}
.cs-reset:hover{background:rgba(110,18,40,.95)}.cs-reset:focus-visible{outline:2px solid #fff;outline-offset:3px}

@media (prefers-reduced-motion: reduce){
  .cs-star,.cs-aur,.cs-snow,.cs-float,.cs-swing,.cs-bulb,.cs-sac-a,.cs-sac-b,.cs-beam,.cs-spark,.cs-conf,.cs-ticket{animation:none !important}
  .cs-lid,.cs-stage,.cs-coupon{transition-duration:.01s !important}
}
`;

/* ------------------------------------------------------------------ */
/*  Landscape                                                          */
/* ------------------------------------------------------------------ */

function Pine({ x, y, s = 1, c = "#0a2133", snow = "#cfe0f5", lit }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="-4" width="6" height="12" fill="#07131f" />
      <path d="M0 -62L16 -34H8L22 -12H10L26 8H-26L-10 -12H-22L-8 -34H-16Z" fill={c} />
      <path d="M0 -62L8 -48L0 -45L-8 -48Z" fill={snow} opacity=".85" />
      <path d="M-8 -34L-3 -30L3 -32L8 -34Z" fill={snow} opacity=".55" />
      {lit && <circle cx="0" cy="-20" r="2.4" fill="#ffd45a" opacity=".9" />}
    </g>
  );
}

function Cabin({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-22" y="-20" width="44" height="22" fill="#2a1a16" />
      <path d="M-28 -18L0 -42L28 -18Z" fill="#183049" /><path d="M-28 -18L0 -42L28 -18" fill="none" stroke="#e8f0ff" strokeWidth="4" strokeLinejoin="round" opacity=".9" />
      <rect x="-14" y="-14" width="10" height="10" rx="1.5" fill="#ffd45a" /><rect x="4" y="-14" width="10" height="10" rx="1.5" fill="#ffb347" />
      <rect x="-14" y="-14" width="10" height="10" rx="1.5" fill="#ffd45a" opacity=".6" filter="url(#csGlow)" />
      <rect x="10" y="-44" width="7" height="14" fill="#2a1a16" /><rect x="9" y="-46" width="9" height="4" fill="#e8f0ff" />
    </g>
  );
}

function Sky({ stars }) {
  return (
    <g>
      <rect x="-500" y="-400" width="1560" height="1100" fill="url(#csSky)" />
      {/* aurore */}
      <g className="cs-aur" style={{ mixBlendMode: "screen" }} opacity=".55">
        <path d="M-60 120C60 40 140 150 260 70C380 -10 460 100 620 30V0H-60Z" fill="url(#csAur1)" filter="url(#csBlur)" />
        <path d="M-40 150C100 90 190 170 320 110C440 60 520 150 640 100V70C520 100 440 20 320 60C190 120 100 40 -40 100Z" fill="url(#csAur2)" filter="url(#csBlur)" opacity=".7" />
      </g>
      {stars.map((s, i) => <circle key={i} className="cs-star" cx={s.x} cy={s.y} r={s.r} fill="#fff6d8" style={{ animationDelay: `${s.d}s`, animationDuration: `${2.4 + (i % 4) * 0.7}s` }} />)}
      {/* lune */}
      <circle cx="486" cy="112" r="64" fill="url(#csMoonGlow)" />
      <circle cx="486" cy="112" r="28" fill="#fff6dc" />
      <circle cx="476" cy="104" r="6" fill="#efe0b8" opacity=".7" /><circle cx="496" cy="121" r="4.5" fill="#efe0b8" opacity=".7" /><circle cx="494" cy="99" r="3" fill="#efe0b8" opacity=".6" />
      {/* montagnes */}
      <path d="M-60 250L40 160L90 205L170 130L250 215L330 150L400 210L470 140L560 220L640 170V300H-60Z" fill="#17304e" />
      <path d="M170 130L150 150L168 146L180 158L196 146L212 158Z" fill="#cfe0f5" opacity=".8" /><path d="M470 140L452 158L468 152L480 164L496 152L510 162Z" fill="#cfe0f5" opacity=".75" />
      <path d="M40 160L22 180L38 174L52 188L64 176L78 184Z" fill="#cfe0f5" opacity=".7" /><path d="M330 150L312 170L328 164L342 176L356 164L370 172Z" fill="#cfe0f5" opacity=".7" />
      {/* forêt lointaine */}
      <path d="M-60 262C60 240 160 252 280 244C400 236 480 252 640 240V330H-60Z" fill="#0f2a3e" />
      {[[10, 262], [38, 258], [70, 262], [104, 256], [500, 258], [530, 262], [560, 256], [592, 262]].map(([x, y], i) => <Pine key={i} x={x} y={y} s={0.66 + (i % 3) * 0.1} c="#0b2234" lit={i % 3 === 0} />)}
      <Cabin x={54} y={272} s={0.9} /><Cabin x={530} y={276} s={0.74} />
      {/* collines enneigées */}
      <path d="M-60 300C60 282 160 298 280 290C400 282 480 298 640 284V400H-60Z" fill="url(#csHill1)" />
      <path d="M-60 330C90 312 210 332 330 322C440 313 520 330 640 318V420H-60Z" fill="url(#csHill2)" />
      {[[22, 306], [96, 312], [470, 308], [548, 312]].map(([x, y], i) => <Pine key={i} x={x} y={y} s={0.95 + (i % 2) * 0.2} c="#0d2f33" lit />)}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Sleigh                                                             */
/* ------------------------------------------------------------------ */

const COQUE = "M92 168C70 168 56 188 62 212C68 252 98 292 160 302H400C452 298 494 262 500 226C502 212 490 204 476 208C460 212 452 228 436 234C340 246 220 244 128 228C112 224 110 180 92 168Z";

function SleighBack() {
  return (
    <g>
      {/* ombre sur la neige */}
      <ellipse cx="280" cy="352" rx="250" ry="12" fill="#0a1c34" opacity=".55" filter="url(#csBlur)" />
      {/* sac de cadeaux */}
      <g transform="translate(-6 -6)">
        <path d="M114 244C92 200 106 158 148 148C192 158 206 200 184 244Z" fill="url(#csBag)" stroke="#6e5230" strokeWidth="1.5" />
        <path d="M122 236C110 204 116 178 134 164" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".2" />
        <path d="M126 154C128 134 170 134 172 154Q149 162 126 154Z" fill="#c9a874" stroke="#6e5230" strokeWidth="1.2" />
        <path d="M128 158Q149 168 170 158" fill="none" stroke="#9b1523" strokeWidth="6" strokeLinecap="round" />
        <rect x="156" y="116" width="30" height="28" rx="4" fill="#2a6fd1" stroke="#16427f" strokeWidth="1.2" /><rect x="168" y="116" width="6" height="28" fill="#e8b84a" /><rect x="156" y="126" width="30" height="6" fill="#e8b84a" />
        <path d="M171 116Q160 100 164 110Q168 116 171 116Q174 116 178 110Q182 100 171 116Z" fill="#e8b84a" stroke="#e8b84a" strokeWidth="2.4" strokeLinejoin="round" />
        <rect x="104" y="130" width="26" height="24" rx="4" fill="#d9262f" stroke="#8a111c" strokeWidth="1.2" /><rect x="114" y="130" width="6" height="24" fill="#fff6e8" />
      </g>
      {/* supports + patin */}
      <g stroke="url(#csGoldH)" strokeWidth="8" strokeLinecap="round" fill="none">
        <path d="M150 342C150 324 156 310 172 300" /><path d="M360 342C360 324 354 310 338 300" /><path d="M255 342V302" strokeWidth="6" />
      </g>
      <path d="M46 314C42 332 56 342 78 342H430C488 342 516 320 516 288C516 262 494 250 474 258C462 264 464 282 480 283" fill="none" stroke="url(#csGold)" strokeWidth="11" strokeLinecap="round" />
      <path d="M52 314C50 328 60 337 80 337H430C484 337 510 318 511 288" fill="none" stroke="#fffbe0" strokeWidth="2.4" strokeLinecap="round" opacity=".7" />
      {/* paroi intérieure */}
      <path d="M126 228C220 240 340 242 436 234C442 224 442 214 434 210C340 216 220 214 132 206C122 212 122 222 126 228Z" fill="#4a0810" />
      <path d="M132 206C220 214 340 216 434 210" fill="none" stroke="#a8721f" strokeWidth="2.5" opacity=".8" />
    </g>
  );
}

function SleighFront({ bulbs }) {
  return (
    <g>
      <path d={COQUE} fill="url(#csRed)" />
      <g clipPath="url(#csCoque)">
        <path d="M70 238C150 276 300 286 450 258" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity=".22" filter="url(#csBlur2)" />
        <path d="M60 300H510V322H60Z" fill="#2a0208" opacity=".28" filter="url(#csBlur2)" />
      </g>
      <path d={COQUE} fill="none" stroke="url(#csGoldH)" strokeWidth="6" strokeLinejoin="round" />
      <path d={COQUE} fill="none" stroke="#fffbe0" strokeWidth="1.2" opacity=".55" strokeLinejoin="round" transform="translate(0 -1.5)" />
      <path d="M76 216C82 252 108 284 162 293H400C446 290 484 260 490 230" fill="none" stroke="url(#csGoldH)" strokeWidth="3" />
      {/* volutes */}
      <g fill="none" stroke="url(#csGoldH)" strokeWidth="3.4" strokeLinecap="round">
        <path d="M178 272C184 254 210 254 212 270C214 284 194 286 192 274C191 266 200 264 202 270" />
        <path d="M352 272C346 254 320 254 318 270C316 284 336 286 338 274C339 266 330 264 328 270" />
        <path d="M120 264C126 252 142 254 142 264C142 272 130 272 130 265" strokeWidth="2.6" />
        <path d="M410 264C404 252 388 254 388 264C388 272 400 272 400 265" strokeWidth="2.6" />
      </g>
      {/* médaillon */}
      <circle cx="265" cy="274" r="19" fill="#7a0f1a" stroke="url(#csGoldH)" strokeWidth="4" />
      <circle cx="265" cy="274" r="13.5" fill="none" stroke="#fbe08a" strokeWidth="1" strokeDasharray="1.5 2.5" />
      <path d="M265 263l3.2 6.6 7.3 1-5.3 5.2 1.3 7.3-6.5-3.5-6.5 3.5 1.3-7.3-5.3-5.2 7.3-1z" fill="#fbe08a" />
      {[[222, 298], [308, 298], [150, 284], [380, 284]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3.4" fill="#fff3bf" stroke="#a8721f" strokeWidth="1" />)}
      {/* neige sur le rebord */}
      <path d="M128 230C220 246 340 248 436 236" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeDasharray="30 8 18 10 26 6 14 9 34 8 20 7 28 8" />
      <path d="M63 208C60 188 72 170 92 170C104 172 108 188 114 206" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeDasharray="22 6 16 8 24 6" />
      <path d="M452 228C462 214 470 210 478 210C490 208 500 216 498 228" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeDasharray="14 5 18 6" />
      {/* guirlande lumineuse sur le rebord */}
      <path d="M134 236C220 252 340 254 432 242" fill="none" stroke="#14301f" strokeWidth="1.6" />
      {bulbs.map((b, i) => <g key={i}><circle cx={b.x} cy={b.y} r="7" fill={b.c} opacity=".28" /><circle className="cs-bulb" cx={b.x} cy={b.y} r="3.4" fill={b.c} style={{ animationDelay: `${(i % 5) * 0.35}s` }} /></g>)}
      {/* lanterne suspendue à la volute */}
      <g className="cs-swing">
        <path d="M492 214V232" stroke="#a8721f" strokeWidth="2" />
        <rect x="483" y="230" width="18" height="6" rx="2" fill="url(#csGold)" />
        <path d="M485 236H499L497 256H487Z" fill="#ffd45a" opacity=".9" /><path d="M485 236H499L497 256H487Z" fill="none" stroke="#a8721f" strokeWidth="1.6" />
        <rect x="484" y="256" width="16" height="4" rx="2" fill="url(#csGold)" />
        <circle cx="492" cy="246" r="16" fill="url(#csLamp)" />
      </g>
      {/* houx */}
      <g transform="translate(440 232)">
        {[-168, -12, -92].map((r, i) => <g key={r} transform={`rotate(${r}) translate(0 -10) scale(${i === 2 ? 0.65 : 0.8})`}><use href="#csLeaf" width="60" height="20" /></g>)}
        {[[-8, 4], [8, 4], [0, -5]].map(([x, y]) => <g key={`${x}${y}`}><circle cx={x} cy={y + 2} r="7.5" fill="#d4222f" stroke="#7a0f1a" strokeWidth="1.2" /><circle cx={x - 2.2} cy={y} r="2.2" fill="#fff" opacity=".7" /></g>)}
      </g>
      {/* rênes vers les rennes (hors cadre) */}
      <path d="M500 232C530 226 548 236 572 232" fill="none" stroke="#7a0f1a" strokeWidth="4" strokeLinecap="round" />
      {[522, 546].map((x) => <g key={x}><circle cx={x} cy={x === 522 ? 230 : 236} r="5" fill="url(#csGold)" stroke="#a8721f" /><path d={`M${x - 3} ${x === 522 ? 232 : 238}h6`} stroke="#7a4a12" strokeWidth="1.2" /></g>)}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  The gift (clay style) with a lid that opens in steps               */
/* ------------------------------------------------------------------ */

const P = (u, v) => [32 + 112 * u + 40 * v, 96 - 18 * v];

function Bow({ rib, loose }) {
  const dark = darken(rib, 0.1);
  return (
    <g transform={`translate(108 80) scale(${1 - loose * 0.06}) rotate(${loose * 3})`}>
      <path d="M-8 14Q-24 40-42 38Q-30 22-14 12Z" fill={dark} stroke={dark} strokeWidth="5" strokeLinejoin="round" />
      <path d="M8 14Q24 40 42 38Q30 22 14 12Z" fill={dark} stroke={dark} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-4 0Q-24-34-52-14Q-60 6-34 10Q-14 12-4 4Z" fill={rib} stroke={rib} strokeWidth="6" strokeLinejoin="round" />
      <path d="M4 0Q24-34 52-14Q60 6 34 10Q14 12 4 4Z" fill={rib} stroke={rib} strokeWidth="6" strokeLinejoin="round" />
      <path d="M-8-2Q-26-22-46-10" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />
      <path d="M8-2Q26-22 46-10" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="0" cy="3" rx="13" ry="11" fill={darken(rib, 0.06)} stroke={darken(rib, 0.06)} strokeWidth="4" />
      <ellipse cx="-3" cy="0" rx="5" ry="3.4" fill="#fff" opacity=".5" />
    </g>
  );
}

function Gift({ etape }) {
  const body = "#1f9a62"; const rib = "#f2c24a"; const dots = "#f6e7c1";
  const front = body; const side = darken(body, 0.2); const top = lighten(body, 0.14);
  const ribSide = darken(rib, 0.16); const ribTop = lighten(rib, 0.08);
  const rim = (c) => ({ stroke: c, strokeWidth: 8, strokeLinejoin: "round" });
  const band = (u0, u1, v0, v1) => [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)].map((p) => p.join(",")).join(" ");
  const star = (x, y, r) => `M${x} ${y - r}L${x + r * 0.3} ${y - r * 0.3}L${x + r} ${y}L${x + r * 0.3} ${y + r * 0.3}L${x} ${y + r}L${x - r * 0.3} ${y + r * 0.3}L${x - r} ${y}L${x - r * 0.3} ${y - r * 0.3}Z`;
  const pattern = [];
  [138, 164, 190, 214].forEach((y, j) => [50, 68, 110, 128].forEach((x, i) => pattern.push(<path key={`f${i}${j}`} d={star(x + (j % 2 ? 9 : 0), y, 8)} fill={dots} />)));
  const lid = LID[etape];
  return (
    <g>
      {/* côté + face avant */}
      <path d="M138 112L178 94V198Q178 208 168 212L138 222Z" fill={side} {...rim(side)} />
      <rect x="38" y="112" width="100" height="110" rx="16" fill={front} {...rim(front)} />
      <clipPath id="csGiftClip"><rect x="38" y="112" width="100" height="110" rx="16" /></clipPath>
      <g clipPath="url(#csGiftClip)">{pattern}</g>
      <rect x="79" y="112" width="18" height="110" fill={rib} />
      <polygon points="154.8,104.4 161.2,101.6 161.2,211.6 154.8,214.4" fill={ribSide} />
      <rect x="38" y="112" width="100" height="110" rx="16" fill="url(#csShade)" />
      {/* intérieur lumineux */}
      <polygon className="cs-fade" points="42,112 138,112 178,94 80,94" fill="url(#csInner)" opacity={BRILLO[etape]} />
      {/* couvercle */}
      <g className="cs-lid" style={{ transform: `translate(${lid.x}px,${lid.y}px) rotate(${lid.r}deg)`, transformBox: "fill-box", transformOrigin: "30% 100%", opacity: lid.o }}>
        <path d="M144 96L184 78V108Q184 116 176 119L144 126Z" fill={side} {...rim(side)} />
        <rect x="32" y="96" width="112" height="30" rx="13" fill={front} {...rim(front)} />
        <polygon points={`${P(0, 0)} ${P(1, 0)} ${P(1, 1)} ${P(0, 1)}`} fill={top} {...rim(top)} />
        {[[0.2, 0.3], [0.8, 0.3], [0.2, 0.75], [0.8, 0.75]].map(([u, v], i) => <path key={i} d={star(P(u, v)[0], P(u, v)[1], 5)} fill={dots} />)}
        {[40, 54, 108, 122].map((x) => <path key={x} d={star(x, 111, 6)} fill={dots} />)}
        <polygon points={band(0, 1, 0.42, 0.58)} fill={ribTop} /><polygon points={band(0.42, 0.58, 0, 1)} fill={ribTop} />
        <rect x="79" y="96" width="18" height="30" fill={rib} /><polygon points="160.8,88.4 167.2,85.6 167.2,115.6 160.8,118.4" fill={ribSide} />
        <rect x="32" y="96" width="112" height="30" rx="13" fill="url(#csShade)" opacity=".8" />
        <Bow rib={rib} loose={etape} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Defs                                                               */
/* ------------------------------------------------------------------ */

function Defs() {
  return (
    <defs>
      <linearGradient id="csSky" gradientUnits="userSpaceOnUse" x1="0" y1="-400" x2="0" y2="330"><stop offset="0" stopColor="#050b1d" /><stop offset=".55" stopColor="#12294f" /><stop offset="1" stopColor="#2b5a86" /></linearGradient>
      <linearGradient id="csAur1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4ade80" stopOpacity=".7" /><stop offset="1" stopColor="#4ade80" stopOpacity="0" /></linearGradient>
      <linearGradient id="csAur2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c084fc" stopOpacity=".6" /><stop offset="1" stopColor="#7dd3fc" stopOpacity="0" /></linearGradient>
      <radialGradient id="csMoonGlow"><stop offset="0" stopColor="#fff6dc" stopOpacity=".55" /><stop offset="1" stopColor="#fff6dc" stopOpacity="0" /></radialGradient>
      <linearGradient id="csHill1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dfeaff" /><stop offset="1" stopColor="#7e9ccb" /></linearGradient>
      <linearGradient id="csHill2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f8ff" /><stop offset="1" stopColor="#aebfe0" /></linearGradient>
      <linearGradient id="csGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".35" stopColor="#e8b84a" /><stop offset=".7" stopColor="#fbe08a" /><stop offset="1" stopColor="#a8721f" /></linearGradient>
      <linearGradient id="csGoldH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b9822a" /><stop offset=".3" stopColor="#fff0a8" /><stop offset=".55" stopColor="#e8b84a" /><stop offset="1" stopColor="#a8721f" /></linearGradient>
      <linearGradient id="csRed" gradientUnits="userSpaceOnUse" x1="0" y1="205" x2="0" y2="310"><stop offset="0" stopColor="#f2505c" /><stop offset=".35" stopColor="#c81f2c" /><stop offset=".8" stopColor="#8a111c" /><stop offset="1" stopColor="#5a0912" /></linearGradient>
      <linearGradient id="csBag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e6c996" /><stop offset="1" stopColor="#a47c4a" /></linearGradient>
      <linearGradient id="csLeafG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b9a63" /><stop offset="1" stopColor="#0f5a36" /></linearGradient>
      <radialGradient id="csShade" cx="35%" cy="25%" r="80%"><stop offset="0" stopColor="#fff" stopOpacity=".42" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".18" /></radialGradient>
      <radialGradient id="csInner" cx="50%" cy="50%" r="60%"><stop offset="0" stopColor="#fff" /><stop offset=".5" stopColor="#ffe9a8" /><stop offset="1" stopColor="#e8a83a" /></radialGradient>
      <radialGradient id="csLamp"><stop offset="0" stopColor="#ffd45a" stopOpacity=".7" /><stop offset="1" stopColor="#ffd45a" stopOpacity="0" /></radialGradient>
      <radialGradient id="csHalo"><stop offset="0" stopColor="#ffe48a" stopOpacity=".95" /><stop offset=".55" stopColor="#ffc850" stopOpacity=".35" /><stop offset="1" stopColor="#ffc850" stopOpacity="0" /></radialGradient>
      <linearGradient id="csRay" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fff3bf" stopOpacity=".95" /><stop offset="1" stopColor="#fff3bf" stopOpacity="0" /></linearGradient>
      <filter id="csBlur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
      <filter id="csBlur2" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.4" /></filter>
      <filter id="csGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" /></filter>
      <clipPath id="csCoque"><path d={COQUE} /></clipPath>
      <symbol id="csLeaf" viewBox="0 0 60 20" overflow="visible">
        <path d="M0 10Q12-6 24 2Q30-8 40 0Q52 2 58 10Q52 18 40 20Q30 28 24 18Q12 26 0 10Z" fill="url(#csLeafG)" stroke="#0a3b23" strokeWidth="1.2" />
        <path d="M2 10H52" stroke="#7fdcab" strokeWidth="1.2" opacity=".75" />
      </symbol>
    </defs>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function CadeauTraineau({ clicsInitiaux = 0 }) {
  const [clics, setClics] = useState(clicsInitiaux);
  const ouvert = clics >= NB_CLICS;
  const etape = Math.min(clics, NB_CLICS);

  const cliquer = () => {
    if (!ouvert) setClics((c) => c + 1);
  };

  const touche = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      cliquer();
    }
  };

  const stars = useMemo(() => { const r = rng(21); return Array.from({ length: 70 }, () => ({ x: -40 + r() * 640, y: -30 + r() * 230, r: 0.5 + r() * 1.3, d: r() * 3 })); }, []);
  const flakes = useMemo(() => { const r = rng(5); return Array.from({ length: 44 }, () => ({ x: -20 + r() * 600, y: -r() * 380, r: 1 + r() * 2.2, o: 0.45 + r() * 0.5, dur: 7 + r() * 8, delay: -r() * 14 })); }, []);
  const bulbs = useMemo(() => Array.from({ length: 13 }, (_, i) => { const t = i / 12; return { x: 138 + t * 290, y: 238 + Math.sin(t * Math.PI) * 6 + t * 4, c: ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"][i % 5] }; }), []);
  const sparks = useMemo(() => { const r = rng(7); return Array.from({ length: 18 }, (_, i) => { const a = -Math.PI / 2 + (r() - 0.5) * Math.PI * 1.4; const d = 90 + r() * 150; return { id: i, dx: Math.cos(a) * d, dy: Math.sin(a) * d, s: 5 + r() * 6, d: r() * 0.3 }; }); }, []);
  const confetti = useMemo(() => { const r = rng(13); return Array.from({ length: 26 }, (_, i) => ({ id: i, x: 150 + r() * 260, y: 40 - r() * 80, c: ["#ffd45a", "#d9362f", "#35a35c", "#f6e7c1", "#7dd3fc", "#ff9ad5"][i % 6], dur: 2.8 + r() * 2.6, delay: -r() * 4, w: 4 + r() * 4 })); }, []);

  const shake = clics > 0 && !ouvert ? (clics % 2 ? "cs-sac-a" : "cs-sac-b") : "";

  // gift placement: bottom-centre of the box (110,222) lands inside the sleigh at (280,262)
  const S = 0.72;
  const gx = 280 - 110 * S; const gy = 262 - 222 * S;
  // centre of the opening in scene coords
  const ox = gx + 108 * S; const oy = gy + 100 * S;

  return (
    <div className={`cs relative h-full min-h-[100svh] w-full max-h-full max-w-full overflow-hidden ${ouvert ? "open" : ""}`}>
      <style>{CSS}</style>

      {/* décor plein cadre : ciel, aurore, montagnes, forêt, neige qui tombe */}
      <svg className="cs-bg" viewBox="0 0 560 380" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <Defs />
        <Sky stars={stars} />
        {flakes.map((f, i) => <circle key={i} className="cs-snow" cx={f.x} cy={f.y} r={f.r} fill="#fff" opacity={f.o} style={{ animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} />)}
      </svg>

      <header className="cs-head">
        <h1 className="cs-title">Día 4: la entrega de Papá Noel</h1>
        <p className="cs-hint" aria-live="polite"><span key={etape}>{ouvert ? "El regalo está abierto !" : INDICES[etape]}</span></p>
        {/* {!ouvert && (
          <div className="cs-prog" aria-hidden="true">
            {Array.from({ length: NB_CLICS }).map((_, i) => <span key={i} className={`cs-orn ${i < clics ? "on" : ""}`} />)}
          </div>
        )} */}
      </header>

      <div className="cs-stage">
        <div
          className="cs-scene"
          role="button"
          tabIndex={ouvert ? -1 : 0}
          aria-disabled={ouvert}
          aria-label={ouvert ? "Cadeau ouvert" : `Ouvrir le cadeau (${clics} sur ${NB_CLICS})`}
          onClick={cliquer}
          onKeyDown={touche}
        >
          <svg className="cs-svg" viewBox="0 0 560 380" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {/* congère sous le traîneau */}
            <path d="M-1400 372C-1000 340 -300 352 40 346C200 342 330 352 470 344C700 332 1200 350 1900 340V520H-1400Z" fill="url(#csHill2)" />
            <path d="M-1400 372C-1000 340 -300 352 40 346C200 342 330 352 470 344C700 332 1200 350 1900 340" fill="none" stroke="#fff" strokeWidth="3" opacity=".7" />

            <g className="cs-float">
              <SleighBack />

              {/* lumière qui sort du cadeau */}
              <g style={{ mixBlendMode: "screen" }}>
                <ellipse className="cs-fade" cx={ox} cy={oy + 8} rx="130" ry="84" fill="url(#csHalo)" opacity={HALO[etape]} />
                <polygon className="cs-fade cs-beam" points={`${ox - 34},${oy + 10} ${ox + 34},${oy + 10} ${ox + 190},${oy - 330} ${ox - 190},${oy - 330}`} fill="url(#csRay)" opacity={RAYOS[etape]} />
                <polygon className="cs-fade" points={`${ox - 18},${oy + 10} ${ox + 18},${oy + 10} ${ox + 70},${oy - 330} ${ox - 70},${oy - 330}`} fill="url(#csRay)" opacity={RAYOS[etape] * 0.8} />
              </g>

              <g transform={`translate(${gx} ${gy}) scale(${S})`}>
                <g className={`cs-gift ${shake}`} key={`g${clics}`}>
                  <Gift etape={etape} />
                </g>
              </g>

              <SleighFront bulbs={bulbs} />
            </g>

            {/* étincelles + confettis du final */}
            {ouvert && (
              <g>
                {sparks.map((s) => (
                  <path key={s.id} className="cs-spark" d={`M${ox} ${oy - s.s}L${ox + s.s * 0.3} ${oy - s.s * 0.3}L${ox + s.s} ${oy}L${ox + s.s * 0.3} ${oy + s.s * 0.3}L${ox} ${oy + s.s}L${ox - s.s * 0.3} ${oy + s.s * 0.3}L${ox - s.s} ${oy}L${ox - s.s * 0.3} ${oy - s.s * 0.3}Z`} fill="#fff0b0" style={{ "--dx": `${s.dx}px`, "--dy": `${s.dy}px`, "--d": `${s.d}s`, filter: "drop-shadow(0 0 4px #ffd45a)" }} />
                ))}
                {confetti.map((c) => <rect key={c.id} className="cs-conf" x={c.x} y={c.y} width={c.w} height={c.w * 1.5} fill={c.c} style={{ animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} />)}
              </g>
            )}

          </svg>
        </div>
      </div>

      <div className="cs-coupon" aria-hidden={!ouvert}>
        {ouvert && (
          <>
            <div className="cs-ticket">
              <img
                src={couponImg}
                alt="Cupón de chocolate : vale por una tableta de chocolate a tu elección"
                draggable={false}
              />
            </div>
            <button type="button" className="cs-reset" onClick={() => setClics(0)}>Refermer le cadeau</button>
          </>
        )}
      </div>
    </div>
  );
}