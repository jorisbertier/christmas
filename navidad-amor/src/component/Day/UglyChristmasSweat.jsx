import React, { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const SECRET_CODE = "RENO2026";

const criteria = [
  {
    number: "01",
    emoji: "🤢",
    title: "La fealdad del jersey",
    description:
      "Los colores, los estampados y el conjunto deben ser realmente horribles. Cuanto más hortera, recargado y de mal gusto sea, mejor.",
  },
  {
    number: "02",
    emoji: "🎄",
    title: "El espíritu navideño",
    description:
      "Evaluaremos las decoraciones: renos, árboles, guirnaldas, Papá Noel, luces... ¡Cuanto más espíritu navideño tenga, más puntos!",
  },
  {
    number: "03",
    emoji: "😳",
    title: "La vergüenza de llevarlo",
    description:
      "¡El criterio más importante! ¿Te atreverías a salir con este jersey? ¿Te daría vergüenza que la gente te viera con él?",
  },
];

/* ------------------------------------------------------------------ */
/*  Knitted Fair-Isle band (pixel art built in code, no image file)    */
/* ------------------------------------------------------------------ */

const COL = { c: "#f6e7c1", r: "#d9362f", g: "#35a35c", y: "#f2b632", b: "#8a5a2a", d: "#a8281f" };
const MOTIFS = {
  flake: ["...c...", ".c.c.c.", "..ccc..", "ccccccc", "..ccc..", ".c.c.c.", "...c..."],
  diamond: ["...r...", "..rrr..", ".rrcrr.", "rrcccrr", ".rrcrr.", "..rrr..", "...r..."],
  tree: ["...y...", "...g...", "..ggg..", ".ggggg.", "..ggg..", ".ggggg.", "...b..."],
  heart: [".rr.rr.", "rrrrrrr", "rrrrrrr", ".rrrrr.", "..rrr..", "...r...", "......."],
};

function fairIsleUrl(order = ["flake", "diamond", "tree", "diamond", "heart", "diamond", "tree", "diamond"], px = 4) {
  const rects = [];
  const W = order.length * 9 + 1;
  // zigzag rows above and below
  for (let x = 0; x < W; x++) {
    const col = x % 2 ? COL.r : COL.c;
    rects.push(`<rect x="${x * px}" y="${(x % 2) * px}" width="${px}" height="${px}" fill="${col}"/>`);
    rects.push(`<rect x="${x * px}" y="${(14 - (x % 2)) * px}" width="${px}" height="${px}" fill="${col}"/>`);
  }
  order.forEach((m, k) => {
    MOTIFS[m].forEach((row, y) => [...row].forEach((ch, x) => {
      if (ch !== ".") rects.push(`<rect x="${(k * 9 + 1 + x) * px}" y="${(4 + y) * px}" width="${px}" height="${px}" fill="${COL[ch]}"/>`);
    }));
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * px}" height="${15 * px}" shape-rendering="crispEdges">${rects.join("")}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const STITCH_TEXTURE = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path d="M1 2L6 10L11 2" fill="none" stroke="#ffffff" stroke-opacity=".07" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
)}")`;

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

.ug-stage{position:relative;min-height:100vh;min-height:100svh;width:100%;overflow:hidden;color:#f7ead0;font-family:'Cormorant Garamond',Georgia,serif;
  background:radial-gradient(120% 80% at 50% 0%,#2b5a42 0%,#143528 45%,#08150f 100%)}
.ug-knit{position:absolute;inset:0;pointer-events:none;background-image:var(--stitch);background-size:12px 12px;opacity:1}
.ug-glow{position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(circle at 8% 30%,rgba(255,190,100,.22) 0 5vw,transparent 6vw),
  radial-gradient(circle at 94% 22%,rgba(255,190,100,.2) 0 6vw,transparent 7vw),
  radial-gradient(circle at 90% 88%,rgba(210,60,70,.24) 0 7vw,transparent 8vw),
  radial-gradient(circle at 6% 86%,rgba(255,225,150,.16) 0 6vw,transparent 7vw)}
.ug-flake{position:absolute;top:-3%;border-radius:50%;background:#fff;pointer-events:none;animation:ug-fall linear infinite}
@keyframes ug-fall{0%{transform:translate(0,0)}50%{transform:translate(18px,55vh)}100%{transform:translate(-10px,108vh)}}

/* top: wool garland of pompoms + lights */
.ug-garland{position:absolute;left:0;right:0;top:0;height:92px;pointer-events:none;z-index:2}
.ug-bulb{position:absolute;width:11px;height:14px;border-radius:50% 50% 45% 45%;animation:ug-tw 2.6s ease-in-out infinite}
@keyframes ug-tw{0%,100%{opacity:1}50%{opacity:.4}}
.ug-pom{position:absolute;transform-origin:50% 0;animation:ug-swing 4.8s ease-in-out infinite alternate}
@keyframes ug-swing{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}

.ug-wrap{position:relative;z-index:3;max-width:1180px;margin:0 auto;padding:78px clamp(14px,4vw,36px) 36px}

/* header */
.ug-head{text-align:center;margin-bottom:26px;animation:ug-in .8s cubic-bezier(.2,.9,.3,1) both}
@keyframes ug-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.ug-tag{display:inline-flex;align-items:center;gap:.7em;padding:.4em 1.4em;border-radius:999px;border:2px dashed rgba(246,231,193,.7);background:rgba(168,40,31,.55);
  color:#f6e7c1;font-size:13px;letter-spacing:.3em;text-transform:uppercase;font-weight:700}
.ug-title{margin:.35em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:.95;font-size:clamp(40px,8.4vw,104px);letter-spacing:.01em}
.ug-title .a{display:block;color:#f6e7c1;-webkit-text-stroke:2px #a8281f;paint-order:stroke fill;text-shadow:0 4px 0 #6e1219,0 8px 18px rgba(0,0,0,.5)}
.ug-title .b{display:block;background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 rgba(58,0,12,.7)) drop-shadow(0 0 24px rgba(255,200,90,.3))}
.ug-banner{display:inline-block;position:relative;margin-top:.5em;padding:.15em 1.4em;font-family:'Mountains of Christmas',cursive;font-weight:700;font-size:clamp(20px,3.6vw,40px);color:#fff6e0;
  background:linear-gradient(180deg,#d9362f,#8a1520);clip-path:polygon(0 0,100% 0,96% 50%,100% 100%,0 100%,4% 50%);box-shadow:0 6px 0 rgba(0,0,0,.35);text-shadow:0 2px 0 #5a0b12}
.ug-vs{display:flex;align-items:center;justify-content:center;gap:clamp(8px,3vw,28px);margin-top:18px}
.ug-player{display:flex;flex-direction:column;align-items:center;gap:2px}
.ug-player b{font-size:15px;letter-spacing:.32em;text-transform:uppercase;color:#f1d8a3}
.ug-sweater{width:clamp(92px,15vw,150px);filter:drop-shadow(0 8px 10px rgba(0,0,0,.5));animation:ug-bob 4s ease-in-out infinite alternate}
.ug-player:nth-child(3) .ug-sweater{animation-delay:-2s}
@keyframes ug-bob{from{transform:rotate(-3deg) translateY(0)}to{transform:rotate(3deg) translateY(-6px)}}
.ug-pompom{position:relative;width:clamp(54px,8vw,84px);aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'Mountains of Christmas',cursive;font-weight:700;font-size:clamp(22px,3.4vw,34px);color:#fff;text-shadow:0 2px 0 #7a0f1a;
  background:radial-gradient(circle at 35% 30%,#ff7a7a,#d9362f 55%,#8a1520);
  box-shadow:0 0 0 4px #f6e7c1,0 0 0 7px rgba(217,54,47,.5),0 10px 20px rgba(0,0,0,.5);animation:ug-pulse 2.4s ease-in-out infinite}
@keyframes ug-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}

/* main knitted panel */
.ug-panel{position:relative;border-radius:30px;padding:14px;
  background:repeating-linear-gradient(90deg,#b3202a 0 7px,#8a1520 7px 9px,#d9433a 9px 16px);box-shadow:0 30px 90px rgba(0,0,0,.55),0 0 0 3px #f6e7c1,0 0 0 6px rgba(168,40,31,.6);animation:ug-in 1s cubic-bezier(.2,.9,.3,1) .2s both}
.ug-felt{position:relative;border-radius:20px;overflow:hidden;background:var(--stitch) 0 0/12px 12px,linear-gradient(180deg,#183e2e,#0f2a1f 60%,#0b1f17);box-shadow:inset 0 0 60px rgba(0,0,0,.6)}
.ug-felt::before{content:"";position:absolute;inset:9px;border:2px dashed rgba(246,231,193,.55);border-radius:14px;pointer-events:none;z-index:2}
.ug-band{height:60px;background-repeat:repeat-x;background-position:center;background-size:auto 60px;image-rendering:pixelated;filter:drop-shadow(0 2px 0 rgba(0,0,0,.35))}
.ug-felt-body{position:relative;z-index:1;padding:clamp(18px,3vw,36px) clamp(18px,4vw,44px)}
.ug-intro{text-align:center;max-width:680px;margin:0 auto 26px}
.ug-kicker{margin:0;font-size:13px;letter-spacing:.36em;text-transform:uppercase;color:#e8c878;font-weight:700}
.ug-intro h2{margin:.2em 0 0;font-family:'Mountains of Christmas',cursive;font-weight:700;font-size:clamp(34px,5vw,56px);color:#f6e7c1;text-shadow:0 3px 0 #6e1219}
.ug-intro .it{margin:.2em 0 0;font-style:italic;font-size:clamp(19px,2.4vw,25px);color:#f0a99a}
.ug-intro p.t{margin:.7em auto 0;font-size:clamp(16px,1.8vw,19px);line-height:1.6;color:#dfe6d6}
.ug-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:16px}
.ug-chip{padding:.3em 1.1em;border-radius:999px;border:2px dashed rgba(246,231,193,.7);background:rgba(217,54,47,.35);color:#fff1d6;font-size:13px;letter-spacing:.2em;text-transform:uppercase;font-weight:700}
.ug-cols{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(20px,3vw,40px)}
@media (max-width:880px){.ug-cols{grid-template-columns:1fr}}
.ug-col h3{margin:.15em 0 .5em;font-family:'Mountains of Christmas',cursive;font-weight:700;font-size:clamp(26px,3vw,34px);color:#f6e7c1}

/* steps with wool buttons */
.ug-step{position:relative;padding:0 0 22px 56px}
.ug-step::before{content:"";position:absolute;left:19px;top:38px;bottom:0;border-left:3px dotted rgba(246,231,193,.5)}
.ug-step:last-of-type::before{display:none}
.ug-btn-n{position:absolute;left:0;top:0;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:20px;color:#5a0f19;
  background:radial-gradient(circle at 35% 30%,#fff3bf,#e8b84a 60%,#a8721f);box-shadow:0 0 0 3px #8a1520,0 4px 8px rgba(0,0,0,.45)}
.ug-btn-n::after{content:"";position:absolute;inset:11px;border-radius:50%;background:radial-gradient(circle,#a8721f 0 2px,transparent 2.5px) 0 0/8px 8px}
.ug-step h4{margin:0;font-size:clamp(20px,2.2vw,24px);color:#fff1d6}
.ug-step p{margin:.35em 0 0;font-size:clamp(15px,1.6vw,17px);line-height:1.55;color:#cfdacb}

/* the code tag */
.ug-form{position:relative;margin-top:10px;border-radius:18px;padding:20px 20px 18px;background:linear-gradient(180deg,#f6e7c1,#ead3a0);color:#4a1420;box-shadow:0 12px 30px rgba(0,0,0,.45);transform:rotate(-1deg)}
.ug-form::before{content:"";position:absolute;top:-14px;left:50%;width:26px;height:26px;margin-left:-13px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff3bf,#c98a1e);box-shadow:inset 0 0 0 5px #8a5a12,0 3px 6px rgba(0,0,0,.4)}
.ug-form::after{content:"";position:absolute;inset:7px;border:2px dashed rgba(138,26,46,.5);border-radius:12px;pointer-events:none}
.ug-form-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
.ug-form .k{margin:0;font-size:12px;letter-spacing:.3em;text-transform:uppercase;font-weight:700;color:#8a1a2e}
.ug-form h4{margin:.1em 0 0;font-family:'Mountains of Christmas',cursive;font-size:clamp(24px,2.6vw,30px);color:#4a1420}
.ug-input{width:100%;box-sizing:border-box;border-radius:12px;border:2px solid #8a1a2e;background:#fffaf0;padding:.75em 1em;text-align:center;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:18px;letter-spacing:.3em;color:#4a1420;outline:none;transition:box-shadow .2s ease}
.ug-input::placeholder{font-family:'Cormorant Garamond',serif;font-style:italic;letter-spacing:0;font-size:16px;color:#9a7a6a}
.ug-input:focus{box-shadow:0 0 0 4px rgba(217,54,47,.35)}
.ug-err{margin:.5em 0 0;text-align:center;font-weight:700;color:#b3202a;font-size:15px;animation:ug-shake .4s ease}
@keyframes ug-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
.ug-go{margin-top:12px;width:100%;border:0;cursor:pointer;border-radius:12px;padding:.85em 1em;font-family:inherit;font-weight:700;font-size:clamp(16px,1.8vw,19px);letter-spacing:.14em;text-transform:uppercase;color:#fff6e0;
  background:linear-gradient(180deg,#e0453d,#a3121f);box-shadow:0 5px 0 #6e0c16,0 12px 24px rgba(0,0,0,.4);transition:transform .15s ease,filter .15s ease}
.ug-go:hover{transform:translateY(-2px);filter:brightness(1.08)}.ug-go:active{transform:translateY(3px);box-shadow:0 2px 0 #6e0c16}
.ug-go:focus-visible,.ug-input:focus-visible{outline:3px solid #fff;outline-offset:3px}
.ug-form small{display:block;margin-top:.7em;text-align:center;font-style:italic;font-size:14px;color:#7a5a4a}

/* criteria patches */
.ug-patch{position:relative;display:flex;gap:14px;align-items:flex-start;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--p);color:#fff;box-shadow:0 8px 18px rgba(0,0,0,.35);transition:transform .25s ease}
.ug-patch:hover{transform:translateY(-3px) rotate(-.6deg)}
.ug-patch::before{content:"";position:absolute;inset:5px;border:2px dashed rgba(255,255,255,.6);border-radius:11px;pointer-events:none}
.ug-patch .ic{flex:none;width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;background:rgba(255,246,224,.95);box-shadow:0 0 0 3px rgba(0,0,0,.2)}
.ug-patch .n{font-family:ui-monospace,monospace;font-size:13px;letter-spacing:.2em;color:rgba(255,255,255,.75)}
.ug-patch h4{margin:.05em 0 0;font-size:clamp(20px,2.2vw,24px);font-weight:700;color:#fff6e0}
.ug-patch p{margin:.35em 0 0;font-size:clamp(15px,1.6vw,17px);line-height:1.5;color:rgba(255,255,255,.88)}
.ug-gold{position:relative;margin-top:6px;padding:16px 18px;border-radius:18px;color:#4a1420;background:linear-gradient(135deg,#fff3bf,#e8b84a 45%,#f6d27a 70%,#c98a1e);box-shadow:0 10px 24px rgba(0,0,0,.4)}
.ug-gold::before{content:"";position:absolute;inset:5px;border:2px dashed rgba(138,26,46,.55);border-radius:13px;pointer-events:none}
.ug-gold h4{display:flex;align-items:center;gap:.5em;margin:0;font-family:'Mountains of Christmas',cursive;font-size:clamp(24px,2.6vw,30px);color:#6e1219}
.ug-gold p{margin:.4em 0 0;font-size:clamp(15px,1.6vw,17px);line-height:1.5;font-weight:600}
.ug-foot{position:relative;z-index:1;padding:14px;text-align:center;font-style:italic;font-size:clamp(17px,2vw,22px);color:#e8c878}
.ug-made{margin-top:22px;text-align:center;font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.4)}

/* reveal */
.ug-reveal{text-align:center;display:flex;flex-direction:column;align-items:center;min-height:calc(100svh - 120px);justify-content:center}
.ug-spot{position:absolute;left:50%;top:-10%;width:90vmin;height:130vmin;transform:translateX(-50%);pointer-events:none;background:conic-gradient(from 180deg at 50% 0%,transparent 160deg,rgba(255,230,150,.22) 175deg,transparent 190deg);opacity:.9;animation:ug-sway 7s ease-in-out infinite alternate}
@keyframes ug-sway{from{transform:translateX(-50%) rotate(-5deg)}to{transform:translateX(-50%) rotate(5deg)}}
.ug-confetti{position:absolute;top:-20px;width:9px;height:14px;pointer-events:none;animation:ug-conf linear both}
@keyframes ug-conf{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(105vh) rotate(720deg);opacity:.9}}
.ug-big{margin:.1em 0 0;font-family:'Mountains of Christmas',cursive;font-weight:700;line-height:1;font-size:clamp(54px,12vw,132px);display:flex;justify-content:center;flex-wrap:wrap}
.ug-big span{display:inline-block;background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 4px 0 rgba(58,0,12,.7)) drop-shadow(0 0 26px rgba(255,200,90,.35));animation:ug-letter .9s cubic-bezier(.3,1.6,.5,1) both}
@keyframes ug-letter{from{opacity:0;transform:translateY(-60px) scale(.4) rotate(-12deg)}to{opacity:1;transform:none}}
.ug-lead{margin:.5em 0 0;font-size:clamp(17px,2.2vw,24px);font-style:italic;color:#d6e4d3}
.ug-hang{position:relative;margin-top:30px;width:min(88vw,calc(56vh * .8 + 44px));animation:ug-drop 1.2s cubic-bezier(.25,1.2,.4,1) 1.3s both}
@keyframes ug-drop{from{opacity:0;transform:translateY(-80px) rotate(-6deg)}to{opacity:1;transform:rotate(-1.2deg)}}
.ug-hang::before,.ug-hang::after{content:"";position:absolute;top:-30px;width:2px;height:34px;background:#e8c878}
.ug-hang::before{left:18%;transform:rotate(14deg);transform-origin:top}.ug-hang::after{right:18%;transform:rotate(-14deg);transform-origin:top}
.ug-frame{position:relative;border-radius:18px;padding:14px;background:repeating-linear-gradient(45deg,#c8202e 0 12px,#fff6e8 12px 24px);box-shadow:0 26px 60px rgba(0,0,0,.6),0 0 60px rgba(255,200,110,.3)}
.ug-frame-in{border-radius:11px;padding:7px;background:linear-gradient(135deg,#fff3bf,#d9a336 30%,#8a5a12 50%,#f1cd6a 72%,#a8721f)}
.ug-card{border-radius:7px;background:#f1e6ce;padding:10px 10px 0}
.ug-photo{display:block;width:100%;aspect-ratio:4/5;max-height:56vh;object-fit:cover;border-radius:6px;background:linear-gradient(160deg,#c8202e,#1f7a4d)}
.ug-ph{aspect-ratio:4/5;max-height:56vh;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:72px;background:linear-gradient(160deg,#c8202e,#1f7a4d)}
.ug-cap{padding:14px 6px 16px}
.ug-cap p:first-child{margin:0;font-family:'Mountains of Christmas',cursive;font-weight:700;font-size:clamp(24px,3.4vw,34px);color:#183327}
.ug-cap p:last-child{margin:.2em 0 0;font-size:13px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#936d38}
.ug-sticker{position:absolute;z-index:2;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;background:#fff6e0;box-shadow:0 0 0 3px #d9362f,0 0 0 5px #fff6e0,0 8px 16px rgba(0,0,0,.45);animation:ug-float 3.6s ease-in-out infinite alternate}
@keyframes ug-float{from{transform:translateY(0) rotate(-6deg)}to{transform:translateY(-9px) rotate(6deg)}}
.ug-end{margin:30px 0 0;font-family:'Mountains of Christmas',cursive;font-weight:700;font-size:clamp(26px,4vw,40px);color:#f6e7c1;text-shadow:0 3px 0 #6e1219;animation:ug-in 1s ease 2.6s both}
.ug-end-s{margin:.3em 0 0;font-style:italic;font-size:16px;color:rgba(255,255,255,.6);animation:ug-in 1s ease 2.9s both}

@media (prefers-reduced-motion: reduce){.ug-flake,.ug-bulb,.ug-pom,.ug-sweater,.ug-pompom,.ug-sticker,.ug-spot,.ug-confetti{animation:none !important}.ug-big span,.ug-hang,.ug-head,.ug-panel,.ug-end,.ug-end-s{animation-duration:.01s !important;animation-delay:0s !important}}
`;

/* ------------------------------------------------------------------ */
/*  Decorative SVGs                                                    */
/* ------------------------------------------------------------------ */

function Rib({ x, y, w, h, color, count }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} />
      {Array.from({ length: count }, (_, i) => <rect key={i} x={x + ((i + 0.5) * w) / count - 0.9} y={y} width="1.8" height={h} fill="#000" opacity=".22" />)}
    </g>
  );
}

// A silly knitted sweater (pixel motif on the chest)
function Sweater({ body, band, motif, accent }) {
  const dark = "#000";
  const px = 6;
  const art = MOTIFS[motif];
  return (
    <svg viewBox="0 0 200 180" className="ug-sweater" aria-hidden="true">
      <ellipse cx="100" cy="172" rx="62" ry="6" fill="#000" opacity=".35" />
      {/* sleeves */}
      <path d="M62 44 L18 104 L38 118 L68 80Z" fill={body} stroke={body} strokeWidth="12" strokeLinejoin="round" />
      <path d="M138 44 L182 104 L162 118 L132 80Z" fill={body} stroke={body} strokeWidth="12" strokeLinejoin="round" />
      <g transform="rotate(-36 28 110)"><Rib x="16" y="104" w="24" h="14" color={band} count={6} /></g>
      <g transform="rotate(36 172 110)"><Rib x="160" y="104" w="24" h="14" color={band} count={6} /></g>
      {/* body */}
      <rect x="56" y="38" width="88" height="112" rx="16" fill={body} stroke={body} strokeWidth="8" strokeLinejoin="round" />
      <Rib x="56" y="144" w="88" h="16" color={band} count={14} />
      {/* fair-isle band */}
      <rect x="56" y="72" width="88" height="8" fill={band} />
      <rect x="56" y="124" width="88" height="8" fill={band} />
      {Array.from({ length: 11 }, (_, i) => <rect key={i} x={58 + i * 8} y={i % 2 ? 74 : 78} width="4" height="4" fill="#f6e7c1" />)}
      {Array.from({ length: 11 }, (_, i) => <rect key={i} x={58 + i * 8} y={i % 2 ? 126 : 130} width="4" height="4" fill="#f6e7c1" />)}
      {/* chest motif */}
      <g transform="translate(79 88)">
        {art.map((row, y) => [...row].map((ch, x) => (ch !== "." ? <rect key={`${x}-${y}`} x={x * px * 0.62} y={y * px * 0.62} width={px * 0.62 + 0.4} height={px * 0.62 + 0.4} fill={COL[ch]} /> : null)))}
      </g>
      {/* collar */}
      <path d="M78 34 Q100 58 122 34 L122 46 Q100 70 78 46Z" fill={band} stroke={band} strokeWidth="6" strokeLinejoin="round" />
      <path d="M86 40 Q100 56 114 40" fill="none" stroke={dark} strokeOpacity=".25" strokeWidth="2" strokeDasharray="2 4" />
      {/* silly pompom */}
      <circle cx="100" cy="62" r="7.5" fill={accent} stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeDasharray="2 2.4" />
      <path d="M62 44Q76 40 88 46" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function Padlock() {
  return (
    <svg viewBox="0 0 48 56" width="40" height="46" aria-hidden="true">
      <path d="M12 24V16a12 12 0 0 1 24 0v8" fill="none" stroke="#8a5a12" strokeWidth="6" strokeLinecap="round" />
      <rect x="6" y="22" width="36" height="30" rx="8" fill="#e8b84a" stroke="#a8721f" strokeWidth="3" />
      <circle cx="24" cy="36" r="4.5" fill="#6e1219" /><rect x="22" y="38" width="4" height="9" rx="2" fill="#6e1219" />
    </svg>
  );
}

function Trophy() {
  return (
    <svg viewBox="0 0 48 52" width="36" height="40" aria-hidden="true">
      <path d="M12 6H36Q37 26 24 32Q11 26 12 6Z" fill="#fff3bf" stroke="#a8721f" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M12 10Q2 9 5 20Q8 26 14 26M36 10Q46 9 43 20Q40 26 34 26" fill="none" stroke="#a8721f" strokeWidth="3" strokeLinecap="round" />
      <rect x="21" y="32" width="6" height="9" fill="#e8b84a" /><rect x="14" y="41" width="20" height="7" rx="2.5" fill="#e8b84a" stroke="#a8721f" strokeWidth="2" />
      <path d="M24 11L26 16L31 16L27 19L28.5 24L24 21L19.5 24L21 19L17 16L22 16Z" fill="#d9362f" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function UglyChristmasSweater({ jerseyImage = "/images/pull-joris.jpg" }) {
  const [code, setCode] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const unlock = (e) => {
    e.preventDefault();
    if (code.trim().toUpperCase() === SECRET_CODE) {
      setRevealed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const band = useMemo(() => fairIsleUrl(), []);
  const bandB = useMemo(() => fairIsleUrl(["heart", "diamond", "tree", "flake", "tree", "diamond", "heart", "flake"]), []);
  const flakes = useMemo(() => Array.from({ length: 36 }, (_, i) => { const r = (n) => ((i * n * 9301 + 49297) % 233280) / 233280; return { id: i, left: r(7) * 100, size: r(3) * 4 + 2, dur: r(5) * 7 + 9, delay: -r(11) * 14, o: 0.35 + r(13) * 0.5 }; }), []);
  const bulbs = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ id: i, x: (i + 0.5) * (100 / 22), y: 26 + Math.sin(i * 0.9) * 8, c: ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"][i % 5] })), []);
  const poms = useMemo(() => [[6, 46, "#d9362f"], [13, 56, "#f6e7c1"], [21, 44, "#35a35c"], [79, 44, "#35a35c"], [87, 56, "#f6e7c1"], [94, 46, "#d9362f"]], []);
  const confetti = useMemo(() => Array.from({ length: 46 }, (_, i) => { const r = (n) => ((i * n * 7919 + 1013) % 9973) / 9973; return { id: i, left: r(3) * 100, c: ["#ffd45a", "#d9362f", "#35a35c", "#f6e7c1", "#7dd3fc", "#ff9ad5"][i % 6], dur: 4 + r(5) * 4, delay: r(7) * 2.4, w: 6 + r(2) * 6 }; }), []);

  const styleVars = { "--stitch": STITCH_TEXTURE };

  return (
    <main className="ug-stage relative min-h-screen w-full overflow-hidden" style={styleVars}>
      <style>{CSS}</style>
      <div className="ug-knit" style={{ backgroundImage: STITCH_TEXTURE, backgroundSize: "12px 12px" }} aria-hidden="true" />
      <div className="ug-glow" aria-hidden="true" />
      {flakes.map((f) => <span key={f.id} className="ug-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true" />)}

      {/* wool garland */}
      <div className="ug-garland" aria-hidden="true">
        <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "92px" }}>
          <path d={`M0 2 ${bulbs.map((b) => `L${b.x} ${b.y * 0.2 + 1}`).join(" ")} L100 2`} fill="none" stroke="#e8c878" strokeWidth="1.6" vectorEffect="non-scaling-stroke" opacity=".7" />
        </svg>
        {bulbs.map((b) => <span key={b.id} className="ug-bulb" style={{ left: `${b.x}%`, top: b.y * 0.5 + 6, background: b.c, boxShadow: `0 0 14px 3px ${b.c}`, animationDelay: `${(b.id % 5) * 0.4}s` }} />)}
        {poms.map(([x, h, c], i) => (
          <div key={i} className="ug-pom" style={{ left: `${x}%`, top: 8, animationDelay: `${-i * 0.9}s` }}>
            <div style={{ width: 2, height: h, background: "#f6e7c1", margin: "0 auto", opacity: 0.8 }} />
            <div style={{ width: 30, height: 30, borderRadius: "50%", marginLeft: -14, background: `radial-gradient(circle at 35% 30%,#fff 0,${c} 45%,#00000055 130%)`, boxShadow: `0 0 0 2px ${c}, 0 0 0 4px rgba(255,255,255,.18)`, outline: "2px dashed rgba(255,255,255,.35)", outlineOffset: -4 }} />
          </div>
        ))}
      </div>

      <div className="ug-wrap">
        {!revealed ? (
          <>
            <header className="ug-head">
              <span className="ug-tag">✦ Concurso navideño 2026 ✦</span>
              <h1 className="ug-title">
                <span className="a">THE UGLY</span>
                <span className="b">CHRISTMAS</span>
              </h1>
              <span className="ug-banner">SWEATER CONTEST</span>
              <div className="ug-vs">
                <div className="ug-player"><Sweater body="#c8202e" band="#8a1520" motif="flake" accent="#f6e7c1" /><b>Margo</b></div>
                <div className="ug-pompom">VS</div>
                <div className="ug-player"><Sweater body="#1f8a56" band="#0f5a36" motif="tree" accent="#d9362f" /><b>Joris</b></div>
              </div>
            </header>

            <section className="ug-panel">
              <div className="ug-felt">
                <div className="ug-band" style={{ backgroundImage: band }} aria-hidden="true" />
                <div className="ug-felt-body">
                  <div className="ug-intro">
                    <p className="ug-kicker">✦ Edición especial · Navidad 2026 ✦</p>
                    <h2>¡El gran concurso!</h2>
                    <p className="it">En busca del jersey más horrible</p>
                    <p className="t">Hoy te enfrentas a Joris en un desafío navideño muy especial. Dos jerseys, tres criterios y un único objetivo: encontrar la mayor atrocidad de la Navidad.</p>
                    <div className="ug-chips"><span className="ug-chip">2 participantes</span><span className="ug-chip">3 criterios</span><span className="ug-chip">1 ganador</span></div>
                  </div>

                  <div className="ug-cols">
                    <div className="ug-col">
                      <p className="ug-kicker">01 — El desafío</p>
                      <h3>¿Cómo participar?</h3>
                      <div className="ug-step">
                        <span className="ug-btn-n">1</span>
                        <h4>Encuentra tu jersey</h4>
                        <p>Busca por tu cuenta el jersey navideño más espantoso que puedas encontrar. Colores imposibles, motivos ridículos y combinaciones de mal gusto. ¡No se lo enseñes todavía a Joris! Debe ser una sorpresa.</p>
                      </div>
                      <div className="ug-step">
                        <span className="ug-btn-n">2</span>
                        <h4>Llama a Joris</h4>
                        <p>Una vez que hayas elegido tu jersey, llama a Joris. Él te dará personalmente el código secreto para desbloquear la sorpresa y descubrir el jersey que ha elegido.</p>
                      </div>

                      <form onSubmit={unlock} className="ug-form" aria-label="Acceso secreto">
                        <div className="ug-form-head">
                          <div><p className="k">Zona restringida</p><h4>Acceso secreto</h4></div>
                          <Padlock />
                        </div>
                        <input
                          className="ug-input" value={code} placeholder="Introduce el código" autoComplete="off" aria-label="Código secreto" aria-invalid={error}
                          onChange={(e) => { setCode(e.target.value); setError(false); }}
                        />
                        {error && <p className="ug-err" role="alert">✕ Código incorrecto. ¡Inténtalo de nuevo!</p>}
                        <button type="submit" className="ug-go">Desbloquear la sorpresa →</button>
                        <small>El secreto solo puede revelarse con el código de Joris.</small>
                      </form>
                    </div>

                    <div className="ug-col">
                      <p className="ug-kicker">02 — El veredicto</p>
                      <h3>Las reglas del concurso</h3>
                      <p style={{ margin: "0 0 14px", fontSize: "clamp(16px,1.7vw,18px)", lineHeight: 1.55, color: "#dfe6d6" }}>
                        Cuando ambos tengáis vuestro jersey, llegará el momento de compararlos. Tendréis que debatir los tres criterios y asignar una puntuación de <strong style={{ color: "#f8dd86" }}>0 a 5 puntos</strong> a cada jersey en cada categoría.
                      </p>
                      {criteria.map((item, i) => (
                        <div key={item.number} className="ug-patch" style={{ "--p": ["linear-gradient(135deg,#c8202e,#8a1520)", "linear-gradient(135deg,#2a9a62,#13603c)", "linear-gradient(135deg,#d9822a,#a5481a)"][i] }}>
                          <span className="ic" aria-hidden="true">{item.emoji}</span>
                          <div>
                            <span className="n">{item.number}</span>
                            <h4>{item.title}</h4>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      ))}
                      <div className="ug-gold">
                        <h4><Trophy /> La regla de oro</h4>
                        <p>Tendréis que debatir y justificar cada puntuación. ¡Nada de favorecer vuestro propio jersey! El jurado debe ser honesto e imparcial. Que gane el más feo, no el favorito.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ug-band" style={{ backgroundImage: bandB }} aria-hidden="true" />
                <div className="ug-foot">Que empiece la competición... 🎄</div>
              </div>
            </section>

            <p className="ug-made">Made with love &amp; Christmas spirit · 2026</p>
          </>
        ) : (
          <div className="ug-reveal">
            <div className="ug-spot" aria-hidden="true" />
            {confetti.map((c) => <span key={c.id} className="ug-confetti" style={{ left: `${c.left}%`, width: c.w, height: c.w * 1.5, background: c.c, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} aria-hidden="true" />)}
            <span className="ug-tag" style={{ position: "relative", zIndex: 2 }}>✨ Código aceptado · Sorpresa desbloqueada</span>
            <h1 className="ug-big" aria-label="¡SORPRESA!" style={{ position: "relative", zIndex: 2 }}>
              {[..."¡SORPRESA!"].map((ch, i) => <span key={i} aria-hidden="true" style={{ animationDelay: `${0.2 + i * 0.09}s` }}>{ch}</span>)}
            </h1>
            <p className="ug-lead" style={{ position: "relative", zIndex: 2 }}>Margo, este es el jersey que ha elegido Joris...</p>

            <div className="ug-hang" style={{ zIndex: 2 }}>
              <span className="ug-sticker" style={{ left: -22, top: -20 }}>🎁</span>
              <span className="ug-sticker" style={{ right: -22, top: -20, animationDelay: "-1s" }}>🎅</span>
              <span className="ug-sticker" style={{ left: -20, bottom: 20, animationDelay: "-2s" }}>⭐</span>
              <span className="ug-sticker" style={{ right: -20, bottom: 20, animationDelay: "-.5s" }}>🎄</span>
              <div className="ug-frame">
                <div className="ug-frame-in">
                  <div className="ug-card">
                    {imgFailed
                      ? <div className="ug-ph" role="img" aria-label="El jersey navideño elegido por Joris">🧶</div>
                      : <img className="ug-photo" src={jerseyImage} alt="El jersey navideño elegido por Joris" onError={() => setImgFailed(true)} />}
                    <div className="ug-cap">
                      <p>EL JERSEY DE JORIS</p>
                      <p>¡Menuda elección! 😂</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="ug-end" style={{ position: "relative", zIndex: 2 }}>¡Que empiece el duelo! 😂</p>
            <p className="ug-end-s" style={{ position: "relative", zIndex: 2 }}>Margo vs. Joris · ¿Quién ha elegido el jersey más feo?</p>
          </div>
        )}
      </div>
    </main>
  );
}