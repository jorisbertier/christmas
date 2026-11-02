import React, { useEffect, useMemo, useState } from "react";

const rounds = [
  {
    title: "Un reno navideño",
    emoji: "🦌",
    description: "Dibujad el reno más bonito de Navidad.",
    challenge: "¡Tiene que tener una nariz roja!",
  },
  {
    title: "¡Dibújanos el uno al otro!",
    emoji: "👩‍❤️‍👨",
    description: "Margo tiene que dibujar a Joris y Joris tiene que dibujar a Margo.",
    challenge: "¡Intentad captar todos los detalles del otro!",
  },
  {
    title: "Un muñeco de nieve",
    emoji: "⛄",
    description: "Dibujad el muñeco de nieve más original.",
    challenge: "¡Tiene que llevar un accesorio muy extraño!",
  },
  {
    title: "Un pingüino",
    emoji: "🐧",
    description: "Dibujad un pingüino.",
    challenge: "¡Que tenga un accesorio original!",
  },
  {
    title: "Papá Noel",
    emoji: "🎅",
    description: "Dibujad a Papá Noel.",
    challenge: "¡Que tenga una expresión muy divertida!",
  },
];

const STEPS = [
  ["01", "Descubrid el tema", "Tendréis que dibujar lo mismo en cada ronda."],
  ["02", "Preparad vuestro material", "Cada uno tendrá su propia hoja y sus lápices."],
  ["03", "¡Que nadie mire!", "Dibujad juntos, pero sin mirar el dibujo del otro."],
  ["04", "Tres minutos", "Tenéis 3 minutos para completar vuestra obra."],
  ["05", "La gran revelación", "Enseñaos los dibujos cara a cara al mismo tiempo."],
  ["06", "Poned una nota", "Cada uno puntuará el dibujo del otro sobre 10."],
];

const PENCILS = ["#d9362f", "#f08a2a", "#f2b632", "#35a35c", "#2f7fd0"];
const ROUND_SECONDS = 180;

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

.dg{container-type:size;position:relative;display:flex;flex-direction:column;align-items:center;overflow:hidden;color:#fff6e4;font-family:'Cormorant Garamond',Georgia,serif;
  background:radial-gradient(120% 90% at 50% 15%,#215240 0%,#122b22 52%,#07130f 100%)}
.dg-glow{position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(circle at 8% 24%,rgba(255,190,100,.26) 0 6cqw,transparent 7cqw),
  radial-gradient(circle at 94% 20%,rgba(255,190,100,.22) 0 7cqw,transparent 8cqw),
  radial-gradient(circle at 90% 86%,rgba(217,54,47,.26) 0 8cqw,transparent 9cqw),
  radial-gradient(circle at 6% 88%,rgba(255,225,150,.16) 0 7cqw,transparent 8cqw)}
.dg-flake{position:absolute;top:-4%;border-radius:50%;background:#fff;pointer-events:none;animation:dg-fall linear infinite}
@keyframes dg-fall{0%{transform:translate(0,0)}50%{transform:translate(14px,55cqh)}100%{transform:translate(-8px,110cqh)}}
.dg-lights{position:absolute;left:0;right:0;top:0;height:40px;pointer-events:none}
.dg-bulb{position:absolute;width:9px;height:12px;border-radius:50% 50% 45% 45%;animation:dg-tw 2.6s ease-in-out infinite}
@keyframes dg-tw{0%,100%{opacity:1}50%{opacity:.4}}

.dg-main{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;width:min(100%,860px);height:100%;min-height:0;padding:clamp(14px,3.6cqh,36px) clamp(12px,4cqw,32px) clamp(10px,2.4cqh,24px)}
.dg-head{flex:none;text-align:center;margin-bottom:clamp(4px,1.2cqh,12px)}
.dg-kick{margin:0;font-size:clamp(9px,min(1.6cqw,2.2cqh),13px);letter-spacing:.36em;text-transform:uppercase;font-weight:700;color:#d9bd80}
.dg-title{margin:.05em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;font-size:clamp(28px,min(6.4cqw,9.6cqh),68px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 rgba(58,0,12,.7)) drop-shadow(0 0 22px rgba(255,200,90,.3))}

/* progress: coloured pencils */
.dg-prog{flex:none;display:flex;gap:clamp(6px,2cqw,16px);align-items:flex-end;margin-bottom:clamp(4px,1.2cqh,10px)}
.dg-pencil{width:clamp(14px,2.6cqw,22px);height:clamp(40px,min(8cqw,9cqh),70px);transition:transform .5s cubic-bezier(.3,1.6,.5,1),opacity .5s ease,filter .5s ease;opacity:.35;filter:grayscale(.7)}
.dg-pencil.on{opacity:1;filter:none}
.dg-pencil.now{transform:translateY(-8px) rotate(-4deg)}

/* the sketchbook page */
.dg-page{position:relative;flex:1 1 0;min-height:0;width:100%;display:flex;flex-direction:column;border-radius:10px 22px 22px 10px;background:#fbf1dc;color:#3b2410;
  box-shadow:0 26px 60px rgba(0,0,0,.55),inset 0 0 70px rgba(176,128,60,.22),inset 8px 0 0 rgba(0,0,0,.06);
  background-image:repeating-linear-gradient(180deg,transparent 0 31px,rgba(59,130,180,.16) 31px 32px),linear-gradient(90deg,transparent 0 clamp(38px,8cqw,64px),rgba(217,54,47,.35) clamp(38px,8cqw,64px) calc(clamp(38px,8cqw,64px) + 1.5px),transparent 0);
  animation:dg-in .7s cubic-bezier(.2,.9,.3,1) both}
@keyframes dg-in{from{opacity:0;transform:translateY(16px) rotate(.4deg)}to{opacity:1;transform:none}}
.dg-holes{position:absolute;left:clamp(8px,2cqw,16px);top:8%;bottom:8%;display:flex;flex-direction:column;justify-content:space-around;pointer-events:none}
.dg-holes i{display:block;width:clamp(12px,2.4cqw,18px);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 40% 35%,#0e2219,#07130f);box-shadow:inset 0 2px 4px rgba(0,0,0,.7),0 1px 0 rgba(255,255,255,.4)}
.dg-tape{position:absolute;z-index:4;width:clamp(60px,12cqw,100px);height:clamp(18px,3.2cqw,26px);background:repeating-linear-gradient(45deg,rgba(217,54,47,.85) 0 8px,rgba(255,246,232,.85) 8px 16px);box-shadow:0 2px 6px rgba(0,0,0,.35);opacity:.92}
.dg-tape.l{left:clamp(30px,10cqw,90px);top:-12px;transform:rotate(-5deg)}
.dg-tape.r{right:clamp(20px,8cqw,70px);top:-10px;transform:rotate(4deg);background:repeating-linear-gradient(45deg,rgba(53,163,92,.85) 0 8px,rgba(255,246,232,.85) 8px 16px)}
.dg-scroll{position:relative;flex:1 1 0;min-height:0;overflow-y:auto;padding:clamp(18px,3.4cqh,34px) clamp(16px,4cqw,38px) clamp(14px,2.4cqh,24px) clamp(44px,10cqw,84px);text-align:center;scrollbar-width:thin}
.dg-fade{animation:dg-fade .55s cubic-bezier(.2,.9,.3,1) both}
@keyframes dg-fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}

.dg-k{margin:0;font-size:clamp(10px,min(1.8cqw,2.4cqh),13px);letter-spacing:.3em;text-transform:uppercase;font-weight:700;color:#a8281f}
.dg-h2{margin:.15em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1.02;font-size:clamp(26px,min(5.4cqw,8cqh),52px);color:#8a1a2e}
.dg-p{margin:.4em auto 0;max-width:34em;font-size:clamp(15px,min(2.4cqw,3.2cqh),20px);line-height:1.45;color:#5a3a26}
.dg-hand{font-family:'Caveat',cursive;font-weight:700}

/* intro */
.dg-steps{display:grid;grid-template-columns:1fr 1fr;gap:clamp(8px,1.8cqh,14px) clamp(14px,3cqw,28px);text-align:left;margin-top:clamp(8px,2cqh,18px)}
@container (max-width:560px){.dg-steps{grid-template-columns:1fr}}
.dg-step{display:flex;gap:12px;align-items:flex-start}
.dg-seal{flex:none;width:clamp(30px,5cqw,38px);aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:clamp(13px,2.2cqw,16px);color:#fff6e4;
  background:radial-gradient(circle at 35% 30%,#e8584f,#b3202a 60%,#7a0f1a);box-shadow:0 0 0 2.5px #f6e7c1,0 0 0 4px #b3202a,0 3px 6px rgba(0,0,0,.4)}
.dg-step h3{margin:0;font-size:clamp(16px,min(2.4cqw,3cqh),20px);font-weight:700;color:#8a1a2e}
.dg-step p{margin:.15em 0 0;font-size:clamp(14px,min(2.1cqw,2.8cqh),17px);line-height:1.35;color:#6a4a36}
.dg-sticky{position:relative;margin:clamp(10px,2.4cqh,22px) auto 0;max-width:30em;padding:.8em 1.2em;transform:rotate(-1.2deg);text-align:left;color:#4a3410;
  background:linear-gradient(180deg,#fff3a8,#ffe36e);box-shadow:0 8px 16px rgba(0,0,0,.25)}
.dg-sticky::before{content:"";position:absolute;top:-9px;left:50%;width:44px;height:16px;margin-left:-22px;background:rgba(217,54,47,.75);transform:rotate(3deg)}
.dg-sticky b{display:block;font-family:'Caveat',cursive;font-size:clamp(20px,3.2cqw,26px);color:#a8281f}
.dg-sticky span{font-size:clamp(14px,min(2.1cqw,2.8cqh),17px);line-height:1.35}

/* subject stamp */
.dg-stamp{position:relative;margin:clamp(6px,1.6cqh,14px) auto 0;width:clamp(84px,min(18cqw,22cqh),150px);aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:clamp(46px,min(10cqw,12cqh),84px);
  background:radial-gradient(circle,#fffaf0,#f6e7c1);box-shadow:0 0 0 4px #fbf1dc,0 0 0 7px #b3202a,0 0 0 10px #fbf1dc,0 0 0 12px rgba(179,32,42,.5),0 14px 24px rgba(0,0,0,.3);animation:dg-wob 3.4s ease-in-out infinite alternate}
@keyframes dg-wob{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}
.dg-artists{display:grid;grid-template-columns:1fr 1fr;gap:clamp(8px,2cqw,18px);margin-top:clamp(8px,2cqh,16px)}
.dg-artist{border-radius:16px;padding:clamp(8px,1.6cqh,14px) 10px;border:2.5px solid var(--c);background:color-mix(in srgb,var(--c) 12%,#fffaf0);box-shadow:0 5px 0 color-mix(in srgb,var(--c) 45%,transparent)}
.dg-artist .e{font-size:clamp(24px,min(5cqw,6cqh),40px);line-height:1}
.dg-artist b{display:block;margin-top:.1em;font-family:'Mountains of Christmas',cursive;font-size:clamp(20px,min(3.6cqw,4.4cqh),30px);color:var(--c)}
.dg-artist span{font-family:'Caveat',cursive;font-weight:700;font-size:clamp(17px,min(2.8cqw,3.4cqh),22px);color:#7a5a46}

/* timer */
.dg-timer{display:flex;align-items:center;justify-content:center;gap:clamp(10px,2.4cqw,20px);margin-top:clamp(8px,2cqh,16px)}
.dg-ring{position:relative;width:clamp(64px,min(12cqw,14cqh),96px);aspect-ratio:1;flex:none}
.dg-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.dg-ring b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Mountains of Christmas',cursive;font-size:clamp(18px,min(3.4cqw,4.2cqh),28px);color:#8a1a2e}
.dg-ring.end b{color:#d9362f;animation:dg-pulse .7s ease-in-out infinite alternate}
@keyframes dg-pulse{from{transform:scale(1)}to{transform:scale(1.18)}}
.dg-tinfo{text-align:left}
.dg-tinfo strong{display:block;font-size:clamp(17px,min(2.8cqw,3.6cqh),24px);color:#8a1a2e}
.dg-tinfo small{display:block;font-size:clamp(13px,min(2cqw,2.6cqh),16px);color:#7a5a46;font-style:italic}

/* buttons */
.dg-btn{width:100%;margin-top:clamp(10px,2.4cqh,20px);padding:.7em 1em;border:0;border-radius:14px;cursor:pointer;font-family:inherit;font-weight:700;font-size:clamp(16px,min(2.6cqw,3.4cqh),21px);letter-spacing:.05em;color:#fff6e4;
  background:linear-gradient(180deg,#e0453d,#a3121f);box-shadow:0 5px 0 #6e0c16,0 12px 24px rgba(0,0,0,.3);transition:transform .15s ease,filter .15s ease}
.dg-btn:hover:not(:disabled){transform:translateY(-2px);filter:brightness(1.08)}.dg-btn:active:not(:disabled){transform:translateY(3px);box-shadow:0 2px 0 #6e0c16}
.dg-btn:disabled{opacity:.35;cursor:not-allowed}.dg-btn:focus-visible{outline:3px solid #2f7fd0;outline-offset:3px}
.dg-btn.green{background:linear-gradient(180deg,#3cb06c,#1d7a48);box-shadow:0 5px 0 #0f4f2e,0 12px 24px rgba(0,0,0,.3)}
.dg-btn.small{width:auto;margin:0;padding:.35em 1.1em;font-size:clamp(13px,2.2cqw,16px);border-radius:999px;box-shadow:0 3px 0 #6e0c16}
.dg-btn.ghost{background:#fffaf0;color:#8a1a2e;box-shadow:inset 0 0 0 2px #8a1a2e,0 3px 0 rgba(138,26,46,.4)}

/* reveal + scores */
.dg-frames{display:flex;align-items:center;justify-content:center;gap:clamp(8px,2.4cqw,22px);margin:clamp(6px,1.6cqh,14px) 0}
.dg-frames svg.f{width:clamp(56px,min(11cqw,13cqh),96px)}
.dg-heart{width:clamp(26px,5cqw,40px);color:#e0527f;animation:dg-beat 1.4s ease-in-out infinite}
@keyframes dg-beat{0%,100%{transform:scale(1)}14%{transform:scale(1.2)}28%{transform:scale(1)}42%{transform:scale(1.14)}}
.dg-score{border-radius:16px;padding:clamp(8px,1.6cqh,14px);border:2.5px solid var(--c);background:color-mix(in srgb,var(--c) 10%,#fffaf0);text-align:left}
.dg-score h4{margin:0;font-size:clamp(16px,min(2.4cqw,3cqh),21px);color:var(--c);font-weight:700}
.dg-score small{display:block;font-size:clamp(13px,2cqw,15px);color:#7a5a46;font-style:italic}
.dg-in{display:flex;align-items:center;gap:8px;margin-top:6px}
.dg-input{width:100%;min-width:0;box-sizing:border-box;border:2px solid var(--c);border-radius:12px;background:#fffdf8;padding:.2em .2em;text-align:center;font-family:'Mountains of Christmas',cursive;font-weight:700;font-size:clamp(26px,min(5cqw,6.4cqh),44px);color:#3b2410;outline:none;transition:box-shadow .2s ease}
.dg-input:focus{box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 30%,transparent)}
.dg-input::placeholder{color:#c9b9a0}
.dg-input::-webkit-outer-spin-button,.dg-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.dg-input{-moz-appearance:textfield}
.dg-in span{font-family:'Mountains of Christmas',cursive;font-size:clamp(18px,3cqw,26px);color:var(--c)}

/* final */
.dg-trophy{width:clamp(70px,min(14cqw,17cqh),120px);margin:0 auto;filter:drop-shadow(0 0 20px rgba(255,200,90,.7));animation:dg-wob 3s ease-in-out infinite alternate}
.dg-total{display:grid;grid-template-columns:1fr 1fr;gap:clamp(8px,2cqw,18px);margin-top:clamp(8px,2cqh,16px)}
.dg-tot{position:relative;border-radius:18px;padding:clamp(8px,1.8cqh,16px) 10px;border:2.5px solid var(--c);background:color-mix(in srgb,var(--c) 10%,#fffaf0)}
.dg-tot.win{box-shadow:0 0 0 4px #f2b632,0 0 30px rgba(242,182,50,.6)}
.dg-tot.win::after{content:"👑";position:absolute;right:-6px;top:-18px;font-size:clamp(22px,4cqw,32px);transform:rotate(14deg)}
.dg-tot .e{font-size:clamp(24px,min(5cqw,6cqh),40px);line-height:1}
.dg-tot b{display:block;font-family:'Mountains of Christmas',cursive;font-size:clamp(18px,3cqw,26px);color:var(--c)}
.dg-tot strong{display:block;font-family:'Mountains of Christmas',cursive;font-size:clamp(34px,min(7cqw,9cqh),64px);line-height:1;color:#3b2410}
.dg-tot strong small{font-size:.4em;color:#9a7a66}
.dg-recap{margin-top:clamp(8px,2cqh,16px);padding:clamp(8px,1.6cqh,14px);border-radius:14px;background:rgba(255,255,255,.55);border:2px dashed rgba(138,26,46,.35)}
.dg-recap-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:6px}
.dg-recap-grid div{text-align:center}
.dg-recap-grid .em{font-size:clamp(20px,min(4cqw,5cqh),30px)}
.dg-recap-grid .j{color:#2f7fd0;font-weight:700;font-size:clamp(14px,2.4cqw,18px)}
.dg-recap-grid .m{color:#d9528a;font-weight:700;font-size:clamp(14px,2.4cqw,18px)}
.dg-conf{position:absolute;top:-20px;pointer-events:none;z-index:2;animation:dg-conf linear infinite}
@keyframes dg-conf{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(108cqh) rotate(720deg);opacity:.9}}

@media (prefers-reduced-motion: reduce){.dg-flake,.dg-bulb,.dg-stamp,.dg-heart,.dg-trophy,.dg-conf,.dg-ring.end b{animation:none !important}.dg-page,.dg-fade{animation-duration:.01s}}
`;

/* ------------------------------------------------------------------ */
/*  SVG pieces                                                         */
/* ------------------------------------------------------------------ */

const HEART = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

function Pencil({ color, on, now }) {
  return (
    <svg viewBox="0 0 22 70" className={`dg-pencil ${on ? "on" : ""} ${now ? "now" : ""}`} aria-hidden="true">
      <path d="M11 2L19 18H3Z" fill="#f2d7a8" stroke="#c9a06a" strokeWidth="1" strokeLinejoin="round" />
      <path d="M11 2L14.5 10H7.5Z" fill={color} />
      <rect x="3" y="18" width="16" height="42" fill={color} />
      <rect x="3" y="18" width="5" height="42" fill="#fff" opacity=".22" />
      <rect x="3" y="58" width="16" height="6" rx="2" fill="#c8c8c8" /><rect x="3" y="62" width="16" height="6" rx="3" fill="#f08aa0" />
    </svg>
  );
}

function PictureFrame({ color }) {
  return (
    <svg viewBox="0 0 90 100" className="f" aria-hidden="true">
      <rect x="6" y="6" width="78" height="88" rx="6" fill="#fffaf0" stroke={color} strokeWidth="7" />
      <rect x="6" y="6" width="78" height="88" rx="6" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="2" />
      <path d="M20 70Q30 40 45 56Q55 36 70 70Z" fill={color} opacity=".25" />
      <circle cx="58" cy="30" r="8" fill="#f2b632" opacity=".7" />
      <path d="M45 6V0" stroke={color} strokeWidth="3" />
    </svg>
  );
}

function TrophySvg() {
  return (
    <svg viewBox="0 0 120 130" className="dg-trophy" aria-hidden="true">
      <defs><linearGradient id="dgG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".5" stopColor="#e8b84a" /><stop offset="1" stopColor="#a8721f" /></linearGradient></defs>
      <rect x="30" y="108" width="60" height="14" rx="3" fill="url(#dgG)" /><rect x="22" y="118" width="76" height="8" rx="3" fill="#7a4a12" />
      <path d="M38 8H82Q84 56 60 70Q36 56 38 8Z" fill="url(#dgG)" stroke="#a8721f" strokeWidth="1.4" />
      <path d="M38 18Q12 14 18 42Q26 56 44 56M82 18Q108 14 102 42Q94 56 76 56" fill="none" stroke="url(#dgG)" strokeWidth="6" strokeLinecap="round" />
      <rect x="54" y="70" width="12" height="28" fill="url(#dgG)" /><rect x="44" y="96" width="32" height="14" rx="3" fill="url(#dgG)" />
      <path d="M60 20L64 32L77 32L67 40L71 52L60 45L49 52L53 40L43 32L56 32Z" fill="#fff3bf" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ChristmasDrawingGame() {
  const [phase, setPhase] = useState("intro");
  const [round, setRound] = useState(0);
  const [mariaScore, setMariaScore] = useState("");
  const [myScore, setMyScore] = useState("");
  const [scores, setScores] = useState([]);
  const [seconds, setSeconds] = useState(ROUND_SECONDS);
  const [running, setRunning] = useState(false);

  const current = rounds[round];
  const isLast = round === rounds.length - 1;

  const totalMaria = scores.reduce((sum, s) => sum + Number(s.maria), 0);
  const totalMe = scores.reduce((sum, s) => sum + Number(s.me), 0);

  // Optional 3-minute stopwatch (it never blocks the game)
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { setRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (phase === "draw") { setSeconds(ROUND_SECONDS); setRunning(false); }
    else setRunning(false);
  }, [phase, round]);

  const saveScores = () => {
    const updated = [
      ...scores,
      { maria: mariaScore, me: myScore },
    ];

    setScores(updated);
    setMariaScore("");
    setMyScore("");

    if (isLast) {
      setPhase("finished");
    } else {
      setRound((r) => r + 1);
      setPhase("draw");
    }
  };

  const restart = () => {
    setRound(0);
    setScores([]);
    setMariaScore("");
    setMyScore("");
    setPhase("intro");
  };

  const validScore = (value) =>
    value !== "" &&
    Number.isFinite(Number(value)) &&
    Number(value) >= 0 &&
    Number(value) <= 10;

  const winner =
    totalMe > totalMaria
      ? "Joris"
      : totalMaria > totalMe
      ? "Margo"
      : null;

  const scoreInput = (value, setter, label) => (
    <input
      type="number"
      min="0"
      max="10"
      step="1"
      inputMode="numeric"
      aria-label={label}
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "" || (/^\d{1,2}$/.test(v) && Number(v) <= 10)) {
          setter(v);
        }
      }}
      placeholder="?"
      className="dg-input"
    />
  );

  const flakes = useMemo(() => { const r = rng(5); return Array.from({ length: 28 }, (_, i) => ({ id: i, left: r() * 100, size: r() * 4 + 2, dur: r() * 7 + 9, delay: -r() * 14, o: 0.35 + r() * 0.5 })); }, []);
  const bulbs = useMemo(() => Array.from({ length: 20 }, (_, i) => ({ id: i, x: (i + 0.5) * 5, y: 8 + Math.abs(Math.sin(i * 0.8)) * 12, c: ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"][i % 5] })), []);
  const confetti = useMemo(() => { const r = rng(9); return Array.from({ length: 30 }, (_, i) => ({ id: i, left: r() * 100, c: ["#ffd45a", "#d9362f", "#35a35c", "#f6e7c1", "#7dd3fc", "#ff9ad5"][i % 6], dur: 4 + r() * 4, delay: -r() * 6, w: 6 + r() * 6 })); }, []);

  const R = 42;
  const circ = 2 * Math.PI * R;
  const done = seconds === 0;

  return (
    <div className="dg relative h-full min-h-[100svh] w-full max-h-full max-w-full overflow-hidden text-white">
      <style>{CSS}</style>
      <div className="dg-glow" aria-hidden="true" />
      {flakes.map((f) => <span key={f.id} className="dg-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true" />)}
      <div className="dg-lights" aria-hidden="true">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}><path d={`M0 2 ${bulbs.map((b) => `L${b.x} ${b.y}`).join(" ")} L100 2`} fill="none" stroke="#e8c878" strokeOpacity=".6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" /></svg>
        {bulbs.map((b) => <span key={b.id} className="dg-bulb" style={{ left: `${b.x}%`, top: b.y * 1.2, background: b.c, boxShadow: `0 0 12px 3px ${b.c}`, animationDelay: `${(b.id % 5) * 0.4}s` }} />)}
      </div>
      {phase === "finished" && confetti.map((c) => <span key={c.id} className="dg-conf" style={{ left: `${c.left}%`, width: c.w, height: c.w * 1.5, background: c.c, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} aria-hidden="true" />)}

      <main className="dg-main">
        {/* Cabecera */}
        <header className="dg-head">
          <p className="dg-kick">✦ Christmas Special · Actividad para dos ✦</p>
          <h1 className="dg-title">El duelo de artistas</h1>
        </header>

        {/* Progreso : lápices de colores */}
        {phase !== "intro" && phase !== "finished" && (
          <div className="dg-prog" role="progressbar" aria-valuemin={1} aria-valuemax={rounds.length} aria-valuenow={round + 1} aria-label="Progreso">
            {rounds.map((_, i) => <Pencil key={i} color={PENCILS[i]} on={i <= round} now={i === round} />)}
          </div>
        )}

        {/* Hoja del cuaderno */}
        <section className="dg-page">
          <span className="dg-tape l" aria-hidden="true" /><span className="dg-tape r" aria-hidden="true" />
          <div className="dg-holes" aria-hidden="true"><i /><i /><i /><i /></div>

          <div className="dg-scroll">
            {/* INTRO */}
            {phase === "intro" && (
              <div className="dg-fade">
                <p className="dg-k">🖍️ Dos artistas · cinco desafíos</p>
                <h2 className="dg-h2">¡Que empiece la diversión!</h2>
                <p className="dg-p">Dos artistas, cinco desafíos y muchas risas.</p>

                <div className="dg-steps">
                  {STEPS.map(([n, title, desc]) => (
                    <div key={n} className="dg-step">
                      <span className="dg-seal">{n}</span>
                      <div><h3>{title}</h3><p>{desc}</p></div>
                    </div>
                  ))}
                </div>

                <div className="dg-sticky">
                  <b>⭐ ¡El objetivo!</b>
                  <span>Conseguir la mejor puntuación de las cinco rondas. ¡Pero lo importante es divertirse!</span>
                </div>

                <button type="button" onClick={() => setPhase("draw")} className="dg-btn">¡Empezar el juego! ✨</button>
              </div>
            )}

            {/* DIBUJO */}
            {phase === "draw" && (
              <div key={`d${round}`} className="dg-fade">
                <p className="dg-k">Ronda {round + 1} / 5 · Vuestro desafío</p>
                <div className="dg-stamp" aria-hidden="true">{current.emoji}</div>
                <h2 className="dg-h2" style={{ marginTop: ".3em" }}>{current.title}</h2>
                <p className="dg-p">{current.description}</p>

                <div className="dg-artists">
                  <div className="dg-artist" style={{ "--c": "#d9528a" }}><span className="e" aria-hidden="true">👩‍🎨</span><b>Margo</b><span>¡A dibujar!</span></div>
                  <div className="dg-artist" style={{ "--c": "#2f7fd0" }}><span className="e" aria-hidden="true">👨‍🎨</span><b>Joris</b><span>¡A dibujar!</span></div>
                </div>

                <div className="dg-timer">
                  <div className={`dg-ring ${done ? "end" : ""}`} role="timer" aria-label={`Tiempo restante ${fmt(seconds)}`}>
                    <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r={R} fill="none" stroke="#eadcc0" strokeWidth="9" /><circle cx="50" cy="50" r={R} fill="none" stroke={done ? "#d9362f" : "#35a35c"} strokeWidth="9" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - seconds / ROUND_SECONDS)} style={{ transition: "stroke-dashoffset 1s linear" }} /></svg>
                    <b>{fmt(seconds)}</b>
                  </div>
                  <div className="dg-tinfo">
                    <strong>⏱️ {done ? "¡Se acabó el tiempo!" : "¡Tenéis 3 minutos!"}</strong>
                    <small>Preparad vuestras hojas y no miréis al otro.</small>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <button type="button" className="dg-btn small green" onClick={() => (done ? (setSeconds(ROUND_SECONDS), setRunning(true)) : setRunning((r) => !r))}>{done ? "Reiniciar" : running ? "Pausa" : seconds < ROUND_SECONDS ? "Seguir" : "Cronómetro"}</button>
                      {seconds < ROUND_SECONDS && <button type="button" className="dg-btn small ghost" onClick={() => { setRunning(false); setSeconds(ROUND_SECONDS); }}>0:00</button>}
                    </div>
                  </div>
                </div>

                <button type="button" onClick={() => setPhase("reveal")} className="dg-btn">¡Hemos terminado! 🎉</button>
              </div>
            )}

            {/* REVELACIÓN Y NOTAS */}
            {phase === "reveal" && (
              <div key={`r${round}`} className="dg-fade">
                <p className="dg-k">Ronda {round + 1} · La gran revelación</p>
                <h2 className="dg-h2">¡Enseñad vuestras obras!</h2>
                <p className="dg-p">Ahora sí, cara a cara. ¡Mostrad vuestros dibujos al mismo tiempo!</p>

                <div className="dg-frames" aria-hidden="true">
                  <PictureFrame color="#2f7fd0" />
                  <svg viewBox="0 0 24 24" className="dg-heart"><path d={HEART} fill="currentColor" /></svg>
                  <PictureFrame color="#d9528a" />
                </div>
                <p className="dg-p" style={{ margin: 0 }}><b style={{ color: "#8a1a2e" }}>¡El momento de comparar!</b> Reíd, explicad vuestras ideas y admirad vuestras obras.</p>

                <p className="dg-k" style={{ margin: "clamp(8px,2cqh,16px) 0 6px" }}>🏆 ¡Hora de poner las notas!</p>

                <div className="dg-artists" style={{ marginTop: 0 }}>
                  <div className="dg-score" style={{ "--c": "#2f7fd0" }}>
                    <h4>Dibujo de Joris</h4>
                    <small>Nota de Margo</small>
                    <div className="dg-in">{scoreInput(myScore, setMyScore, "Nota de Margo al dibujo de Joris")}<span>/10</span></div>
                  </div>
                  <div className="dg-score" style={{ "--c": "#d9528a" }}>
                    <h4>Dibujo de Margo</h4>
                    <small>Nota de Joris</small>
                    <div className="dg-in">{scoreInput(mariaScore, setMariaScore, "Nota de Joris al dibujo de Margo")}<span>/10</span></div>
                  </div>
                </div>

                <p className="dg-p dg-hand" style={{ margin: ".4em 0 0", fontSize: "clamp(18px,3cqw,24px)" }}>¡Sed sinceros, pero no demasiado crueles! 😂</p>

                <button
                  type="button"
                  disabled={!validScore(myScore) || !validScore(mariaScore)}
                  onClick={saveScores}
                  className="dg-btn"
                >
                  {isLast ? "Ver el resultado final ❤️" : "Siguiente ronda →"}
                </button>
              </div>
            )}

            {/* RESULTADO FINAL */}
            {phase === "finished" && (
              <div className="dg-fade">
                {winner ? <TrophySvg /> : <div style={{ fontSize: 64 }} aria-hidden="true">🤝</div>}
                <p className="dg-k" style={{ marginTop: ".4em" }}>Christmas Art Awards 2026</p>
                <h2 className="dg-h2">{winner ? `¡${winner} ha ganado!` : "¡Tenemos un empate!"}</h2>
                <p className="dg-p">{winner ? `¡${winner} se lleva la victoria del duelo artístico!` : "¡Los dos sois auténticos artistas!"}</p>

                <div className="dg-total">
                  <div className={`dg-tot ${winner === "Joris" ? "win" : ""}`} style={{ "--c": "#2f7fd0" }}><span className="e" aria-hidden="true">👨‍🎨</span><b>Joris</b><strong>{totalMe}<small>/50</small></strong></div>
                  <div className={`dg-tot ${winner === "Margo" ? "win" : ""}`} style={{ "--c": "#d9528a" }}><span className="e" aria-hidden="true">👩‍🎨</span><b>Margo</b><strong>{totalMaria}<small>/50</small></strong></div>
                </div>

                <div className="dg-recap">
                  <p className="dg-k" style={{ margin: 0 }}>Resultados de las 5 rondas</p>
                  <div className="dg-recap-grid">
                    {scores.map((s, i) => (
                      <div key={i}><div className="em" aria-hidden="true">{rounds[i].emoji}</div><div className="j">{s.me}</div><div className="m">{s.maria}</div></div>
                    ))}
                  </div>
                  <small style={{ display: "block", marginTop: 4, fontStyle: "italic", color: "#7a5a46" }}>Azul: Joris · Rosa: Margo</small>
                </div>

                <p className="dg-p dg-hand" style={{ fontSize: "clamp(20px,3.4cqw,28px)", color: "#8a1a2e" }}>¡El verdadero premio es haber creado estos recuerdos juntos! ❤️</p>

                <button type="button" onClick={restart} className="dg-btn">¡Volver a jugar! ❤️</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}