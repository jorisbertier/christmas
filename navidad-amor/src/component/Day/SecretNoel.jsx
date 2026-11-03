import React, { useEffect, useMemo, useRef, useState } from "react";

const SECRET_CODE = "2412";

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
const BAUBLES = ["#d9262f", "#f2b632", "#1f9a62", "#2f6fd0"];

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

.sn{container:sn / size;position:relative;isolation:isolate;height:100%;min-height:100svh;width:100%;overflow:hidden;display:flex;align-items:center;justify-content:center;color:#fff0d0;font-family:'Cormorant Garamond',Georgia,serif;
  background:radial-gradient(120% 90% at 50% 0%,#7a2a22 0%,#3a1418 42%,#150709 100%)}
.sn-glow{position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(circle at 8% 24%,rgba(255,190,100,.26) 0 6cqw,transparent 7cqw),
  radial-gradient(circle at 94% 20%,rgba(255,190,100,.2) 0 7cqw,transparent 8cqw),
  radial-gradient(circle at 90% 86%,rgba(217,54,47,.26) 0 8cqw,transparent 9cqw),
  radial-gradient(circle at 6% 88%,rgba(255,225,150,.16) 0 7cqw,transparent 8cqw)}
.sn-flake{position:absolute;top:-4%;border-radius:50%;background:#fff;pointer-events:none;animation:sn-fall linear infinite}
@keyframes sn-fall{0%{transform:translate(0,0)}50%{transform:translate(14px,55cqh)}100%{transform:translate(-8px,110cqh)}}
.sn-star{position:absolute;color:#f1d28a;pointer-events:none;animation:sn-tw 3s ease-in-out infinite}
@keyframes sn-tw{0%,100%{opacity:.9;transform:scale(1)}50%{opacity:.25;transform:scale(.8)}}
.sn-lights{position:absolute;left:0;right:0;top:0;height:42px;pointer-events:none;z-index:2}
.sn-lb{position:absolute;width:9px;height:12px;border-radius:50% 50% 45% 45%;animation:sn-tw 2.6s ease-in-out infinite}

/* card */
.sn-card{position:relative;z-index:3;width:min(94cqw,1020px);max-height:calc(100cqh - clamp(44px,8cqh,80px));margin-top:clamp(20px,4cqh,40px);display:flex;flex-direction:column;border-radius:30px;padding:clamp(6px,1.2cqw,12px);
  background:linear-gradient(135deg,#fff0a8,#d9a336 25%,#7a4f10 50%,#f1cd6a 75%,#a8721f);box-shadow:0 30px 90px rgba(0,0,0,.65),0 0 70px rgba(255,190,100,.2);animation:sn-in .9s cubic-bezier(.2,.9,.3,1) both}
@keyframes sn-in{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:none}}
.sn-inner{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;border-radius:24px;overflow:hidden;background:radial-gradient(circle at 2px 2px,rgba(255,214,120,.12) 1px,transparent 1.6px) 0 0/18px 18px,linear-gradient(180deg,#5a1e22,#33141a 55%,#1c0b10);box-shadow:inset 0 0 70px rgba(0,0,0,.6)}
.sn-inner::before{content:"";position:absolute;inset:8px;border:1.5px dashed rgba(240,200,120,.45);border-radius:18px;pointer-events:none;z-index:3}
.sn-scroll{position:relative;z-index:2;flex:1;min-height:0;overflow-y:auto;padding:clamp(16px,3.2cqh,32px) clamp(16px,3.4cqw,38px) clamp(14px,2.6cqh,26px);scrollbar-width:thin;scrollbar-color:#a8721f transparent}
.sn-corner{position:absolute;z-index:4;width:clamp(36px,6cqw,62px);pointer-events:none}

.sn-head{text-align:center;margin-bottom:clamp(8px,2cqh,18px)}
.sn-kick{margin:0;font-size:clamp(10px,min(1.5cqw,2.2cqh),14px);letter-spacing:.46em;text-transform:uppercase;font-weight:700;color:#f1c978}
.sn-title{margin:.1em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;font-size:clamp(30px,min(6cqw,9cqh),68px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 rgba(58,0,12,.7)) drop-shadow(0 0 22px rgba(255,200,90,.3))}
.sn-orn{display:flex;align-items:center;justify-content:center;gap:.8em;margin-top:.4em;color:#f1c978}
.sn-orn i{display:block;height:1px;width:clamp(30px,8cqw,90px);background:linear-gradient(90deg,transparent,#e8c878)}.sn-orn i:last-child{background:linear-gradient(270deg,transparent,#e8c878)}

.sn-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(14px,3cqw,36px);align-items:start}
@container sn (max-width:760px){.sn-grid{grid-template-columns:1fr}}
.sn-intro{margin:0 auto clamp(8px,1.6cqh,14px);max-width:44ch;text-align:center;font-size:clamp(15px,min(1.9cqw,2.8cqh),19px);line-height:1.55;color:rgba(255,240,208,.82)}

/* riddle parchment */
.sn-paper{position:relative;border-radius:10px;padding:clamp(16px,2.8cqh,26px) clamp(16px,2.6cqw,28px);color:#3b2410;background:radial-gradient(120% 100% at 30% 10%,#fbefd3,#f1dcb0 60%,#e5c98f);box-shadow:inset 0 0 50px rgba(150,100,40,.3),0 16px 34px rgba(0,0,0,.5);transform:rotate(-.8deg)}
.sn-paper::before{content:"";position:absolute;inset:6px;border:1.5px dashed rgba(138,26,46,.4);border-radius:6px;pointer-events:none}
.sn-tape{position:absolute;top:-11px;left:50%;width:84px;height:22px;margin-left:-42px;background:repeating-linear-gradient(45deg,rgba(217,54,47,.85) 0 8px,rgba(255,246,232,.85) 8px 16px);transform:rotate(-2deg);box-shadow:0 2px 6px rgba(0,0,0,.35)}
.sn-pk{margin:0;text-align:center;font-size:clamp(11px,1.7cqw,14px);letter-spacing:.3em;text-transform:uppercase;font-weight:700;color:#a8281f}
.sn-riddle{margin:.6em 0 0;text-align:center;font-style:italic;font-weight:600;font-size:clamp(17px,min(2.3cqw,3.4cqh),24px);line-height:1.5;color:#4a1420}
.sn-rule{width:64px;height:1px;margin:.9em auto;background:rgba(138,26,46,.4)}
.sn-clue{display:flex;gap:12px;align-items:flex-start;margin-top:.7em;text-align:left}
.sn-seal{flex:none;width:clamp(28px,4cqw,36px);aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:clamp(13px,1.9cqw,16px);color:#fff6e4;background:radial-gradient(circle at 35% 30%,#e8584f,#b3202a 60%,#7a0f1a);box-shadow:0 0 0 2px #f6e7c1,0 0 0 3.5px #b3202a,0 3px 6px rgba(0,0,0,.4)}
.sn-clue p{margin:0;font-size:clamp(14px,min(1.9cqw,2.7cqh),18px);line-height:1.45;color:#5a3a26}
.sn-clue b{color:#8a1a2e}

/* lock panel */
.sn-lock{display:flex;flex-direction:column;align-items:center;text-align:center}
.sn-padlock{width:clamp(84px,min(15cqw,20cqh),150px);filter:drop-shadow(0 0 22px rgba(255,200,90,.4)) drop-shadow(0 10px 12px rgba(0,0,0,.5));animation:sn-bob 3.4s ease-in-out infinite alternate}
@keyframes sn-bob{from{transform:translateY(0) rotate(-2deg)}to{transform:translateY(-4px) rotate(2deg)}}
.sn-shackle{transform-box:fill-box;transform-origin:15% 100%;transition:transform .8s cubic-bezier(.3,1.4,.5,1)}
.sn-unlocking .sn-shackle{transform:translateY(-14px) rotate(-38deg)}
.sn-unlocking .sn-padlock{animation:none;filter:drop-shadow(0 0 40px rgba(255,230,140,.95)) drop-shadow(0 10px 12px rgba(0,0,0,.5))}
.sn-mist{margin:.1em 0 0;font-size:clamp(10px,1.5cqw,13px);letter-spacing:.4em;font-weight:700;color:#f1c978}
.sn-ask{margin:.6em 0 .5em;font-family:'Mountains of Christmas',cursive;font-weight:700;font-size:clamp(20px,min(3cqw,4.4cqh),32px);color:#fce7b0;text-shadow:0 2px 0 rgba(58,0,12,.6)}

.sn-slots{display:flex;gap:clamp(8px,1.6cqw,16px);justify-content:center;cursor:text}
.sn-slots.err{animation:sn-shake .45s ease}
@keyframes sn-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-9px)}40%{transform:translateX(9px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
.sn-slot{position:relative;width:clamp(38px,min(7cqw,9.6cqh),64px);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 50% 35%,#1b0a0c,#0a0405);box-shadow:inset 0 3px 8px #000,0 0 0 3px #a8721f,0 0 0 5px rgba(255,214,120,.25);display:flex;align-items:center;justify-content:center}
.sn-slot.cur{box-shadow:inset 0 3px 8px #000,0 0 0 3px #fff3bf,0 0 18px 4px rgba(255,214,120,.65)}
.sn-ball{width:78%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0,var(--c) 32%,#000 135%);box-shadow:inset -3px -4px 6px rgba(0,0,0,.45),0 0 14px color-mix(in srgb,var(--c) 70%,transparent);animation:sn-drop .35s cubic-bezier(.3,1.6,.5,1) both}
.sn-ball::before{content:"";position:absolute;left:41%;top:4%;width:18%;height:10%;border-radius:2px;background:linear-gradient(180deg,#fff3bf,#a8721f)}
@keyframes sn-drop{from{transform:translateY(-30px) scale(.4);opacity:0}to{transform:none;opacity:1}}

.sn-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(6px,1.2cqw,12px);width:min(100%,clamp(210px,30cqw,290px));margin:clamp(8px,1.8cqh,16px) auto 0}
.sn-key{aspect-ratio:1.45;border:0;border-radius:999px;cursor:pointer;font-family:'Mountains of Christmas',cursive;font-weight:700;font-size:clamp(20px,min(3.2cqw,4.6cqh),30px);color:#5a0f19;-webkit-tap-highlight-color:transparent;
  background:radial-gradient(circle at 50% 20%,#fff3bf,#e8b84a 60%,#c98a1e);box-shadow:0 4px 0 #8a5a12,0 8px 14px rgba(0,0,0,.45);transition:transform .1s ease,filter .15s ease}
.sn-key:hover{filter:brightness(1.08)}.sn-key:active{transform:translateY(3px);box-shadow:0 1px 0 #8a5a12}
.sn-key.alt{background:radial-gradient(circle at 50% 20%,#ff9a9a,#d9363e 60%,#9a1522);color:#fff6e4;box-shadow:0 4px 0 #6e0c16,0 8px 14px rgba(0,0,0,.45)}
.sn-key:focus-visible{outline:3px solid #fff;outline-offset:2px}
.sn-hidden{position:absolute;opacity:0;pointer-events:none;width:1px;height:1px}
.sn-err{margin:.7em 0 0;font-weight:700;font-size:clamp(14px,2cqw,17px);color:#ffb4b4;animation:sn-fade .3s ease}
@keyframes sn-fade{from{opacity:0}to{opacity:1}}
.sn-go{margin-top:clamp(8px,1.8cqh,16px);width:min(100%,clamp(210px,30cqw,290px));padding:.7em 1em;border:0;border-radius:14px;cursor:pointer;font-family:inherit;font-weight:700;font-size:clamp(16px,min(2.2cqw,3.2cqh),20px);letter-spacing:.04em;color:#351719;
  background:linear-gradient(180deg,#fff3bf,#e8b84a 55%,#c98a1e);box-shadow:0 5px 0 #8a5a12,0 12px 24px rgba(0,0,0,.4);position:relative;overflow:hidden;transition:transform .15s ease}
.sn-go::after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);animation:sn-sheen 3s ease-in-out infinite}
@keyframes sn-sheen{0%,60%{left:-60%}100%{left:130%}}
.sn-go:hover{transform:translateY(-2px)}.sn-go:active{transform:translateY(3px)}.sn-go:focus-visible{outline:3px solid #fff;outline-offset:3px}

.sn-foot{display:flex;align-items:center;justify-content:center;gap:.8em;margin-top:clamp(10px,2.2cqh,22px);font-size:clamp(9px,1.4cqw,12px);letter-spacing:.35em;color:rgba(241,201,120,.55)}
.sn-foot i{display:block;height:1px;width:clamp(16px,4cqw,40px);background:rgba(241,201,120,.3)}

/* unlocked: the letter */
.sn-open{text-align:center;animation:sn-fade .8s ease both}
.sn-open .kick{margin:0;font-size:clamp(11px,1.8cqw,15px);letter-spacing:.38em;text-transform:uppercase;font-weight:700;color:#f1c978}
.sn-letter{position:relative;margin:clamp(10px,2cqh,18px) auto 0;max-width:640px;border-radius:12px;padding:clamp(18px,3.4cqh,34px) clamp(18px,4cqw,44px);color:#3b2410;
  background:repeating-linear-gradient(180deg,transparent 0 33px,rgba(59,130,180,.13) 33px 34px),radial-gradient(120% 100% at 30% 10%,#fff6ee,#fbe6d8 60%,#f1cfc0);
  box-shadow:inset 0 0 60px rgba(190,100,110,.25),0 22px 50px rgba(0,0,0,.55);transform-origin:50% 0;animation:sn-unfold 1.1s cubic-bezier(.2,.9,.3,1) both}
@keyframes sn-unfold{from{opacity:0;transform:perspective(900px) rotateX(-70deg) scaleY(.4)}to{opacity:1;transform:none}}
.sn-letter::before{content:"";position:absolute;inset:7px;border:1.5px dashed rgba(178,40,90,.45);border-radius:8px;pointer-events:none}
.sn-mail{font-size:clamp(30px,5cqw,46px);line-height:1}
.sn-letter h3{margin:.3em 0 0;font-family:'Mountains of Christmas',cursive;font-weight:700;line-height:1.1;font-size:clamp(24px,min(4.6cqw,7cqh),44px);color:#8a1a2e}
.sn-letter p{margin:.8em 0 0;font-size:clamp(16px,min(2.2cqw,3.4cqh),22px);line-height:1.6;font-style:italic;color:#4a2a2a;animation:sn-fade 1s ease .9s both}
.sn-letter .love{font-family:'Caveat',cursive;font-style:normal;font-weight:700;font-size:clamp(24px,min(3.6cqw,5.4cqh),36px);color:#b2285a;animation-delay:1.5s}
.sn-wax{position:absolute;right:clamp(12px,3cqw,28px);bottom:-18px;width:clamp(44px,7cqw,64px);filter:drop-shadow(0 4px 6px rgba(0,0,0,.4));animation:sn-stamp .6s cubic-bezier(.3,1.6,.5,1) 1.6s both}
@keyframes sn-stamp{from{opacity:0;transform:scale(2) rotate(-30deg)}to{opacity:1;transform:rotate(8deg)}}
.sn-close{margin-top:clamp(18px,3cqh,28px);padding:.3em 1.4em;border-radius:999px;border:1.5px solid rgba(241,201,120,.6);background:rgba(0,0,0,.3);color:#f1c978;font-family:inherit;font-weight:700;font-style:italic;font-size:clamp(14px,2cqw,18px);cursor:pointer;transition:background .2s ease}
.sn-close:hover{background:rgba(241,201,120,.2)}.sn-close:focus-visible{outline:2px solid #fff;outline-offset:3px}
.sn-heart{position:absolute;pointer-events:none;color:#ff8fa3;animation:sn-rise 6s ease-in infinite;z-index:1}
@keyframes sn-rise{0%{transform:translateY(0);opacity:0}15%{opacity:.85}100%{transform:translateY(-100cqh);opacity:0}}
.sn-flash{position:absolute;inset:0;z-index:20;pointer-events:none;background:radial-gradient(circle,rgba(255,240,180,.95),rgba(255,200,90,.4) 50%,transparent 75%);animation:sn-fl 1.1s ease-out both}
@keyframes sn-fl{0%{opacity:0}25%{opacity:1}100%{opacity:0}}

@media (prefers-reduced-motion: reduce){
  .sn-flake,.sn-star,.sn-lb,.sn-padlock,.sn-go::after,.sn-heart,.sn-flash{animation:none !important}
  .sn-card,.sn-letter,.sn-ball,.sn-slots.err,.sn-wax,.sn-letter p,.sn-open{animation-duration:.01s !important;animation-delay:0s !important}
  .sn-shackle{transition-duration:.01s}
}
`;

/* ------------------------------------------------------------------ */
/*  SVG pieces                                                         */
/* ------------------------------------------------------------------ */

function Padlock() {
  return (
    <svg viewBox="0 0 120 150" className="sn-padlock" aria-hidden="true">
      <defs>
        <linearGradient id="snG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".45" stopColor="#e8b84a" /><stop offset="1" stopColor="#8a5a12" /></linearGradient>
        <linearGradient id="snS" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8a5a12" /><stop offset=".4" stopColor="#fff3bf" /><stop offset="1" stopColor="#a8721f" /></linearGradient>
      </defs>
      <path className="sn-shackle" d="M30 70V46C30 22 44 10 60 10C76 10 90 22 90 46V70" fill="none" stroke="url(#snS)" strokeWidth="13" strokeLinecap="round" />
      <rect x="12" y="66" width="96" height="78" rx="18" fill="url(#snG)" stroke="#8a5a12" strokeWidth="2" />
      <rect x="20" y="74" width="80" height="62" rx="12" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="2" />
      <circle cx="60" cy="98" r="11" fill="#5a0f19" /><rect x="56" y="102" width="8" height="22" rx="4" fill="#5a0f19" />
      <path d="M22 80Q40 72 56 76" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="4" strokeLinecap="round" />
      {[[26, 78], [94, 78], [26, 132], [94, 132]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.8" fill="#fff3bf" stroke="#8a5a12" />)}
    </svg>
  );
}

function Holly({ style }) {
  return (
    <svg viewBox="0 0 90 70" style={style} className="sn-corner" aria-hidden="true">
      <defs><linearGradient id="snL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38b06a" /><stop offset="1" stopColor="#0f5a36" /></linearGradient></defs>
      {[-70, -20, 30, 80].map((r, i) => <g key={i} transform={`translate(18 56) rotate(${r})`}><path d="M0 0Q10 -9 26 -2Q34 -16 48 -7Q58 -3 62 5Q54 14 42 12Q34 24 24 16Q10 20 0 0Z" fill="url(#snL)" stroke="#0a3b23" strokeWidth="1.2" /></g>)}
      {[[26, 46], [38, 50], [32, 58]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="6" fill="#d4222f" stroke="#7a0f1a" /><circle cx={x - 2} cy={y - 2} r="1.8" fill="#fff" opacity=".75" /></g>)}
    </svg>
  );
}

function Seal() {
  return (
    <svg viewBox="0 0 60 60" className="sn-wax" aria-hidden="true">
      <path d="M30 3C40 2 46 8 52 14C58 22 57 36 52 44C46 54 36 58 28 57C16 56 6 48 4 36C2 24 8 10 20 5Z" fill="#b2132a" />
      <circle cx="30" cy="30" r="20" fill="none" stroke="#ff6b82" strokeOpacity=".5" strokeWidth="2" />
      <path d="M30 42C18 34 15 26 20 22C24 19 28 21 30 25C32 21 36 19 40 22C45 26 42 34 30 42Z" fill="#ff8fa3" opacity=".9" />
      <path d="M12 18Q20 8 34 7" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SecretNoel() {
  const [code, setCode] = useState("");
  const [ouvert, setOuvert] = useState(false);
  const [erreur, setErreur] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(0);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const verifierCode = (e) => {
    if (e) e.preventDefault();
    if (unlocking) return;

    if (code === SECRET_CODE) {
      setErreur(false);
      setUnlocking(true); // the padlock opens, a flash of light, then the letter
      timerRef.current = setTimeout(() => { setOuvert(true); setUnlocking(false); }, 1300);
    } else {
      setErreur(true);
      setCode("");
    }
  };

  const press = (d) => { if (unlocking) return; setErreur(false); setCode((c) => (c.length < 4 ? c + d : c)); };
  const back = () => { if (unlocking) return; setErreur(false); setCode((c) => c.slice(0, -1)); };

  const flakes = useMemo(() => { const r = rng(5); return Array.from({ length: 30 }, (_, i) => ({ id: i, left: r() * 100, size: r() * 4 + 2, dur: r() * 7 + 9, delay: -r() * 14, o: 0.3 + r() * 0.5 })); }, []);
  const stars = useMemo(() => Array.from({ length: 36 }, (_, i) => ({ id: i, x: (i * 37 + 11) % 100, y: (i * 23 + 7) % 100, d: (i % 6) * 0.7, s: 8 + (i % 4) * 5, g: i % 3 === 0 ? "✦" : "·" })), []);
  const bulbs = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ id: i, x: (i + 0.5) * (100 / 22), y: 8 + Math.abs(Math.sin(i * 0.8)) * 12, c: ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"][i % 5] })), []);
  const hearts = useMemo(() => Array.from({ length: 10 }, (_, i) => ({ id: i, left: 6 + i * 9.5, d: (i * 0.9) % 6, s: 14 + (i % 4) * 5 })), []);

  const digits = code.split("");

  return (
    <div className={`sn relative isolate flex min-h-[700px] w-full items-center justify-center overflow-hidden rounded-3xl ${unlocking ? "sn-unlocking" : ""}`}>
      <style>{CSS}</style>
      <div className="sn-glow" aria-hidden="true" />
      {stars.map((s) => <span key={s.id} className="sn-star" style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: s.s, animationDelay: `${s.d}s` }} aria-hidden="true">{s.g}</span>)}
      {flakes.map((f) => <span key={f.id} className="sn-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true" />)}
      <div className="sn-lights" aria-hidden="true">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}><path d={`M0 2 ${bulbs.map((b) => `L${b.x} ${b.y}`).join(" ")} L100 2`} fill="none" stroke="#e8c878" strokeOpacity=".6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" /></svg>
        {bulbs.map((b) => <span key={b.id} className="sn-lb" style={{ left: `${b.x}%`, top: b.y * 1.2, background: b.c, boxShadow: `0 0 12px 3px ${b.c}`, animationDelay: `${(b.id % 5) * 0.4}s` }} />)}
      </div>
      {ouvert && hearts.map((h) => <span key={h.id} className="sn-heart" style={{ left: `${h.left}%`, bottom: "-4%", fontSize: h.s, animationDelay: `${h.d}s` }} aria-hidden="true">❤</span>)}
      {unlocking && <div className="sn-flash" aria-hidden="true" />}

      <div className="sn-card">
        <Holly style={{ left: -16, top: -16 }} />
        <Holly style={{ right: -16, top: -16, transform: "scaleX(-1)" }} />
        <Holly style={{ left: -16, bottom: -16, transform: "scaleY(-1)" }} />
        <Holly style={{ right: -16, bottom: -16, transform: "scale(-1,-1)" }} />

        <div className="sn-inner">
          <div className="sn-scroll">
            {/* En-tête */}
            <header className="sn-head">
              <p className="sn-kick">Una Navidad mágica</p>
              <h2 className="sn-title">Un regalo para ti</h2>
              <div className="sn-orn"><i /><span>✦</span><i /></div>
            </header>

            {!ouvert ? (
              <>
                <p className="sn-intro">Hay regalos que se abren con las manos... y otros que primero hay que descubrir con el corazón.</p>

                <div className="sn-grid">
                  {/* Carte énigme */}
                  <div className="sn-paper">
                    <span className="sn-tape" aria-hidden="true" />
                    <p className="sn-pk">✧ El enigma de Navidad ✧</p>
                    <p className="sn-riddle">
                      "No soy un regalo, pero traigo muchos.<br />
                      No soy un sueño, pero estoy lleno de magia.<br />
                      Llego una vez al año y todos me esperan con ilusión.<br />
                      ¿Qué día soy?"
                    </p>
                    <div className="sn-rule" />
                    <div className="sn-clue"><span className="sn-seal">1</span><p><b>Primera pista:</b> El número de horas que tiene un día.</p></div>
                    <div className="sn-clue"><span className="sn-seal">2</span><p><b>Segunda pista:</b> El número de meses que tiene un año.</p></div>
                    <div className="sn-clue"><span className="sn-seal">3</span><p><b>Última pista:</b> La fecha en la que celebramos la Nochebuena.</p></div>
                  </div>

                  {/* Cerradura */}
                  <form className="sn-lock" onSubmit={verifierCode}>
                    <Padlock />
                    <p className="sn-mist">MISTERIO</p>
                    <p className="sn-ask">¿Cuál es el código secreto?</p>

                    <div className={`sn-slots ${erreur ? "err" : ""}`} key={erreur ? "e" : "n"} onClick={() => inputRef.current && inputRef.current.focus()}>
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i} className={`sn-slot ${i === digits.length ? "cur" : ""}`}>
                          {digits[i] !== undefined && <span className="sn-ball" style={{ "--c": BAUBLES[i] }} />}
                        </span>
                      ))}
                    </div>

                    {/* real input: keyboard, password managers, screen readers */}
                    <input
                      ref={inputRef}
                      className="sn-hidden"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      autoComplete="off"
                      value={code}
                      onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setErreur(false); }}
                      aria-label="Código secreto"
                    />

                    {erreur && <p role="alert" className="sn-err">¡No es correcto! Inténtalo otra vez, mi amor. ❤️</p>}

                    <div className="sn-pad" role="group" aria-label="Teclado numérico">
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => <button key={d} type="button" className="sn-key" onClick={() => press(d)} aria-label={d}>{d}</button>)}
                      <button type="button" className="sn-key alt" onClick={back} aria-label="Borrar">⌫</button>
                      <button type="button" className="sn-key" onClick={() => press("0")} aria-label="0">0</button>
                      <button type="submit" className="sn-key alt" aria-label="Validar">✓</button>
                    </div>

                    <button type="submit" className="sn-go">Abrir mi regalo ✨</button>
                  </form>
                </div>
              </>
            ) : (
              <div className="sn-open">
                <p className="kick">✦ El secreto ha sido revelado ✦</p>
                <div className="sn-letter">
                  <div className="sn-mail" aria-hidden="true">💌</div>
                  <h3>Mon plus beau cadeau, c'est toi.</h3>
                  <div className="sn-rule" />
                  <p>Si je pouvais demander un seul vœu à Noël, je ne demanderais ni étoile, ni cadeau, ni miracle.</p>
                  <p>Je demanderais simplement encore mille Noëls à tes côtés, mille réveils près de toi, et mille raisons de te faire sourire.</p>
                  <p className="love">Eres mi lugar favorito en el mundo. ❤️</p>
                  <Seal />
                </div>
                <button type="button" className="sn-close" onClick={() => { setOuvert(false); setCode(""); }}>Cerrar el secreto</button>
              </div>
            )}

            <div className="sn-foot"><i /><span>HECHO CON AMOR · NAVIDAD</span><i /></div>
          </div>
        </div>
      </div>
    </div>
  );
}