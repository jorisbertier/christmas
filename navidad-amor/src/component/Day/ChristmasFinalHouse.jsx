import { useCallback, useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Texts (all of them are here)                                       */
/* ------------------------------------------------------------------ */

const COVER = {
  kicker: "24 de diciembre · La última casita",
  title: "Feliz Navidad, mi amor",
  open: "Abrir la puerta",
  footer: "CON TODO MI AMOR · NAVIDAD 2026",
};

// Love letter, split in 3 pages so everything fits one screen
const LETTER = [
  [
    { t: "Y así llegamos a la última casita de tu pequeño calendario de Adviento..." },
    { t: "Espero de corazón que hayas disfrutado cada sorpresa, cada pequeño detalle y cada momento que preparé para ti. Detrás de cada casita había un poquito de mi tiempo, de mi imaginación y, sobre todo, muchísimo cariño." },
  ],
  [
    { t: "Aunque la distancia nos impida estar juntos hoy, quiero que sepas que estás muy presente en mis pensamientos. Me habría encantado poder abrazarte, mirarte a los ojos y celebrar esta Navidad a tu lado." },
    { t: "Pero si algo he aprendido contigo, es que no hace falta estar en el mismo lugar para compartir momentos especiales. Lo importante es tener a alguien con quien querer compartirlos." },
  ],
  [
    { t: "Gracias por formar parte de mi vida, por hacerme feliz y por darme tantos motivos para sonreír.", k: "gold" },
    { t: "Te deseo una Navidad preciosa, mi amor. ❤️", k: "big" },
  ],
];
const TEASER = "Pero todavía queda una última sorpresa...";
const REVEAL_BTN = "Descubrir mi último regalo ✨";

const GIFT_KICKER = "Tu último regalo de Navidad";
const GIFT_TITLE = "Una cena romántica, tú y yo ❤️";
const GIFT = [
  [
    { t: "Quiero invitarte a una cena de Navidad muy especial. Esta vez, aunque estemos lejos, vamos a compartir nuestra propia cena romántica." },
    { k: "icons" },
  ],
  [
    { t: "Tú eliges lo que te apetezca comer, yo me encargo de invitarte a tu comida favorita y prepararemos todo para disfrutar de una videollamada juntos." },
    { t: "Nos arreglaremos un poquito, pondremos nuestras cenas en la mesa, encenderemos unas velitas y brindaremos juntos por nosotros, por nuestra historia y por todo lo bonito que todavía nos espera." },
  ],
  [
    { t: "Porque esta Navidad, mi deseo es tener una cita contigo, aunque sea a través de una pantalla.", k: "gold" },
    { t: "Te quiero muchísimo. ❤️", k: "big" },
    { t: "Nuestro pequeño momento de Navidad", k: "small" },
  ],
];

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

.fh{container:fh / size;box-sizing:border-box;position:relative;isolation:isolate;height:100%;min-height:100svh;width:100%;overflow:hidden;display:flex;flex-direction:column;align-items:center;color:#fff5e8;font-family:'Cormorant Garamond',Georgia,serif;
  background:linear-gradient(180deg,#120714 0%,#2b0f1d 45%,#5a1f26 100%)}
.fh-bg{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
.fh-warm{position:absolute;inset:0;z-index:1;pointer-events:none;opacity:0;transition:opacity 1.6s ease;background:radial-gradient(60% 55% at 50% 100%,rgba(255,170,70,.4),transparent 70%),radial-gradient(120% 90% at 50% 40%,transparent 40%,rgba(8,2,6,.7))}
.fh.gift .fh-warm{opacity:1}
.fh-star{animation:fh-tw 3s ease-in-out infinite}
@keyframes fh-tw{0%,100%{opacity:1}50%{opacity:.3}}
.fh-snow{animation:fh-fall linear infinite}
@keyframes fh-fall{0%{transform:translate(0,-20px)}50%{transform:translate(16px,200px)}100%{transform:translate(-10px,420px)}}
.fh-lights{position:absolute;left:0;right:0;top:0;height:34px;pointer-events:none;z-index:3}
.fh-lb{position:absolute;width:9px;height:12px;border-radius:50% 50% 45% 45%;animation:fh-tw 2.6s ease-in-out infinite}
.fh-heart{position:absolute;z-index:2;pointer-events:none;color:#ff8fa3;animation:fh-rise 7s ease-in infinite}
@keyframes fh-rise{0%{transform:translateY(0);opacity:0}15%{opacity:.8}100%{transform:translateY(-100cqh);opacity:0}}

.fh-stage{position:relative;z-index:4;flex:1 1 0;min-height:0;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:clamp(30px,6cqh,56px) clamp(10px,3cqw,28px) clamp(8px,2cqh,20px)}
.fh.gift .fh-stage{padding-bottom:clamp(110px,26cqh,240px)}

/* cover */
.fh-cover{display:flex;flex-direction:column;align-items:center;text-align:center;min-height:0;animation:fh-in 1s cubic-bezier(.2,.9,.3,1) both}
@keyframes fh-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.fh-house{width:min(88cqw,62cqh,520px);height:auto;filter:drop-shadow(0 20px 28px rgba(0,0,0,.55))}
.fh-kick{margin:clamp(2px,.8cqh,8px) 0 0;font-size:clamp(10px,min(1.7cqw,2.1cqh),15px);letter-spacing:.42em;text-transform:uppercase;font-weight:700;color:#f1c978}
.fh-title{margin:.1em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;font-size:clamp(30px,min(8cqw,9.6cqh),76px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 rgba(58,0,12,.75)) drop-shadow(0 0 24px rgba(255,200,90,.35))}
.fh-go{margin-top:clamp(8px,2cqh,18px);padding:.55em 1.8em;border:0;border-radius:999px;cursor:pointer;font-family:inherit;font-weight:700;letter-spacing:.05em;font-size:clamp(16px,min(2.6cqw,3.2cqh),22px);color:#4a1420;position:relative;overflow:hidden;
  background:linear-gradient(180deg,#fff3bf,#e8b84a 55%,#c98a1e);box-shadow:0 5px 0 #8a5a12,0 12px 24px rgba(0,0,0,.45),0 0 32px rgba(255,214,120,.35);transition:transform .15s ease}
.fh-go::after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);animation:fh-sheen 3s ease-in-out infinite}
@keyframes fh-sheen{0%,60%{left:-60%}100%{left:130%}}
.fh-go:hover{transform:translateY(-2px)}.fh-go:active{transform:translateY(3px)}.fh-go:focus-visible{outline:3px solid #fff;outline-offset:3px}
.fh-go.red{color:#fff3df;background:linear-gradient(180deg,#e0453d,#a3121f 60%,#741220);box-shadow:0 5px 0 #4a0710,0 12px 24px rgba(0,0,0,.45),0 0 32px rgba(255,100,80,.35)}
.fh-foot{margin-top:clamp(6px,1.6cqh,16px);font-size:clamp(9px,1.5cqw,12px);letter-spacing:.34em;color:rgba(241,201,120,.55)}

/* the card (letter / menu) */
.fh-card{position:relative;width:min(100%,760px);max-height:100%;min-height:0;display:flex;flex-direction:column;border-radius:22px;padding:clamp(5px,1cqw,10px);
  background:linear-gradient(135deg,#fff0a8,#d9a336 25%,#7a4f10 50%,#f1cd6a 75%,#a8721f);box-shadow:0 30px 80px rgba(0,0,0,.65),0 0 60px rgba(255,190,100,.22);animation:fh-in .9s cubic-bezier(.2,.9,.3,1) both}
.fh-paper{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;border-radius:17px;overflow:hidden;color:#3b2410;
  background:repeating-linear-gradient(180deg,transparent 0 33px,rgba(59,130,180,.12) 33px 34px),radial-gradient(120% 100% at 30% 10%,#fbefd3,#f1dcb0 60%,#e5c98f);box-shadow:inset 0 0 60px rgba(150,100,40,.35)}
.fh.gift .fh-paper{color:#fff0d6;background:radial-gradient(circle at 2px 2px,rgba(255,214,120,.12) 1px,transparent 1.6px) 0 0/18px 18px,linear-gradient(180deg,#5a1823,#35101a 55%,#1d0911);box-shadow:inset 0 0 70px rgba(0,0,0,.6)}
.fh-paper::before{content:"";position:absolute;inset:7px;border:1.5px dashed rgba(138,26,46,.45);border-radius:12px;pointer-events:none;z-index:2}
.fh.gift .fh-paper::before{border-color:rgba(240,200,120,.45)}
.fh-body{position:relative;z-index:1;flex:1;min-height:0;overflow-y:auto;padding:clamp(16px,3.4cqh,34px) clamp(16px,4cqw,46px) clamp(8px,1.6cqh,16px);text-align:center;scrollbar-width:thin;display:flex;flex-direction:column;justify-content:center}
.fh-page{animation:fh-page .6s cubic-bezier(.2,.9,.3,1) both}
@keyframes fh-page{from{opacity:0;transform:translateX(calc(var(--dir,1) * 28px))}to{opacity:1;transform:none}}
.fh-pk{margin:0;font-size:clamp(10px,min(1.6cqw,2cqh),14px);letter-spacing:.38em;text-transform:uppercase;font-weight:700;color:#a8281f}
.fh.gift .fh-pk{color:#f1c978}
.fh-pt{margin:.15em 0 0;font-family:'Mountains of Christmas',cursive;font-weight:700;line-height:1.08;font-size:clamp(24px,min(5cqw,6.6cqh),46px);color:#8a1a2e}
.fh.gift .fh-pt{color:#f8dd86;text-shadow:0 3px 0 rgba(58,0,12,.7),0 0 22px rgba(255,200,90,.3)}
.fh-rule{width:64px;height:1px;margin:clamp(8px,1.6cqh,16px) auto;background:rgba(138,26,46,.45)}
.fh.gift .fh-rule{background:rgba(241,201,120,.6)}
.fh-p{margin:.7em 0 0;font-size:clamp(15px,min(2.3cqw,3cqh),23px);line-height:1.6;font-style:italic;font-weight:600;color:#4a2a1e}
.fh.gift .fh-p{color:#fbe9d2}
.fh-p.gold{color:#8a1a2e}.fh.gift .fh-p.gold{color:#f1c978}
.fh-p.big{font-family:'Mountains of Christmas','Caveat',cursive;font-style:normal;font-weight:700;font-size:clamp(24px,min(4.6cqw,6cqh),42px);line-height:1.15;color:#b2285a}
.fh.gift .fh-p.big{color:#ff9fbb;text-shadow:0 0 18px rgba(255,120,160,.4)}
.fh-p.small{font-style:normal;font-size:clamp(10px,1.6cqw,13px);letter-spacing:.3em;text-transform:uppercase;color:rgba(241,201,120,.7)}
.fh-icons{display:flex;justify-content:center;gap:clamp(8px,2cqw,18px);margin-top:clamp(10px,2.4cqh,22px)}
.fh-icon{width:clamp(44px,min(8cqw,10cqh),70px);aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:clamp(22px,min(4cqw,5cqh),36px);background:radial-gradient(circle at 35% 30%,#7a1826,#3a0a14);box-shadow:0 0 0 2.5px #e8b84a,0 6px 14px rgba(0,0,0,.45);animation:fh-bob 3s ease-in-out infinite alternate}
.fh-icon:nth-child(2){animation-delay:-.7s}.fh-icon:nth-child(3){animation-delay:-1.4s}.fh-icon:nth-child(4){animation-delay:-2.1s}
@keyframes fh-bob{from{transform:translateY(0) rotate(-4deg)}to{transform:translateY(-6px) rotate(4deg)}}
.fh-teaser{margin:clamp(10px,2.2cqh,22px) 0 0;font-size:clamp(11px,min(1.8cqw,2.2cqh),16px);letter-spacing:.26em;text-transform:uppercase;font-weight:700;color:#a8281f}

/* navigation */
.fh-nav{position:relative;z-index:3;flex:none;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:clamp(6px,1.4cqh,14px) clamp(14px,3cqw,32px) clamp(10px,2cqh,20px)}
.fh-arrow{flex:none;width:clamp(36px,min(6cqw,7cqh),52px);aspect-ratio:1;border:0;border-radius:50%;cursor:pointer;font-size:clamp(16px,2.6cqw,22px);font-weight:700;color:#5a0f19;background:radial-gradient(circle at 35% 30%,#fff3bf,#e8b84a 60%,#a8721f);box-shadow:0 4px 0 #8a5a12,0 8px 14px rgba(0,0,0,.35);transition:transform .12s ease,opacity .3s ease}
.fh-arrow:hover:not(:disabled){transform:translateY(-2px)}.fh-arrow:active:not(:disabled){transform:translateY(3px)}
.fh-arrow:disabled{opacity:.0;pointer-events:none}.fh-arrow:focus-visible{outline:3px solid #2f7fd0;outline-offset:3px}
.fh-dots{display:flex;gap:clamp(6px,1.2cqw,10px);align-items:center}
.fh-dot{width:clamp(9px,1.6cqw,13px);aspect-ratio:1;border-radius:50%;border:1.5px solid #a8281f;background:transparent;transition:all .4s cubic-bezier(.3,1.6,.5,1)}
.fh-dot.on{background:radial-gradient(circle at 35% 30%,#ff8a8a,#b3202a);transform:scale(1.35);box-shadow:0 0 10px rgba(217,54,47,.6)}
.fh.gift .fh-dot{border-color:#f1c978}.fh.gift .fh-dot.on{background:radial-gradient(circle at 35% 30%,#fff3bf,#e8b84a);box-shadow:0 0 12px rgba(255,214,120,.7)}
.fh-cta{flex:1;display:flex;justify-content:center}
.fh-again{margin-top:.8em;padding:.25em 1.2em;border-radius:999px;border:1.5px solid rgba(241,201,120,.6);background:rgba(0,0,0,.25);color:#f1c978;font-family:inherit;font-weight:700;font-style:italic;font-size:clamp(13px,2cqw,17px);cursor:pointer}
.fh-again:hover{background:rgba(241,201,120,.2)}.fh-again:focus-visible{outline:2px solid #fff;outline-offset:3px}
.fh-corner{position:absolute;z-index:4;width:clamp(34px,6cqw,58px);pointer-events:none}
.fh-seal{position:absolute;right:clamp(14px,3cqw,30px);bottom:clamp(54px,9cqh,86px);width:clamp(40px,6.4cqw,60px);z-index:3;filter:drop-shadow(0 4px 6px rgba(0,0,0,.4));transform:rotate(8deg);pointer-events:none}

/* table */
.fh-table{position:absolute;left:0;right:0;bottom:0;z-index:3;width:100%;height:clamp(110px,26cqh,240px);pointer-events:none;opacity:0;transform:translateY(40px);transition:opacity 1.2s ease .3s,transform 1.2s cubic-bezier(.2,.9,.3,1) .3s}
.fh.gift .fh-table{opacity:1;transform:none}
.fh-flame{transform-box:fill-box;transform-origin:50% 100%;animation:fh-flame .18s ease-in-out infinite alternate}
.fh-flame.b{animation-duration:.23s;animation-delay:-.1s}.fh-flame.c{animation-duration:.2s;animation-delay:-.05s}
@keyframes fh-flame{from{transform:scale(1,1) rotate(-3deg)}to{transform:scale(.88,1.12) rotate(3deg)}}
.fh-glass{transform-box:fill-box;transform-origin:50% 100%}
.fh-glass.l{animation:fh-clink-l 4s ease-in-out infinite}.fh-glass.r{animation:fh-clink-r 4s ease-in-out infinite}
@keyframes fh-clink-l{0%,60%,100%{transform:rotate(0)}70%{transform:rotate(14deg)}78%{transform:rotate(9deg)}}
@keyframes fh-clink-r{0%,60%,100%{transform:rotate(0)}70%{transform:rotate(-14deg)}78%{transform:rotate(-9deg)}}
.fh-smoke{animation:fh-smoke 5s ease-out infinite}
@keyframes fh-smoke{0%{transform:translate(0,0) scale(.5);opacity:0}20%{opacity:.7}100%{transform:translate(-16px,-70px) scale(1.7);opacity:0}}
.fh-win{animation:fh-glow 3s ease-in-out infinite alternate}
@keyframes fh-glow{from{opacity:.8}to{opacity:1}}

@media (prefers-reduced-motion: reduce){
  .fh-star,.fh-snow,.fh-lb,.fh-heart,.fh-go::after,.fh-icon,.fh-flame,.fh-glass,.fh-smoke,.fh-win{animation:none !important}
  .fh-cover,.fh-card,.fh-page{animation-duration:.01s !important}
  .fh-table,.fh-warm{transition-duration:.01s !important}
}
`;

/* ------------------------------------------------------------------ */
/*  Illustrations                                                      */
/* ------------------------------------------------------------------ */

function Defs() {
  return (
    <defs>
      <linearGradient id="fhSky" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="330"><stop offset="0" stopColor="#120714" /><stop offset=".6" stopColor="#2e1024" /><stop offset="1" stopColor="#6a2530" /></linearGradient>
      <linearGradient id="fhHill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8e4ff" /><stop offset="1" stopColor="#7e94c4" /></linearGradient>
      <linearGradient id="fhGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f8ff" /><stop offset="1" stopColor="#a9b9de" /></linearGradient>
      <linearGradient id="fhWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8323a" /><stop offset="1" stopColor="#6a1a24" /></linearGradient>
      <linearGradient id="fhWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff1b0" /><stop offset="1" stopColor="#ff9f3a" /></linearGradient>
      <linearGradient id="fhGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".5" stopColor="#e8b84a" /><stop offset="1" stopColor="#a8721f" /></linearGradient>
      <radialGradient id="fhHalo"><stop offset="0" stopColor="#ffd45a" stopOpacity=".7" /><stop offset="1" stopColor="#ffd45a" stopOpacity="0" /></radialGradient>
      <radialGradient id="fhMoon"><stop offset="0" stopColor="#fff6dc" stopOpacity=".5" /><stop offset="1" stopColor="#fff6dc" stopOpacity="0" /></radialGradient>
      <linearGradient id="fhPath" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd45a" stopOpacity=".55" /><stop offset="1" stopColor="#ffd45a" stopOpacity="0" /></linearGradient>
      <linearGradient id="fhLeaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f9a52" /><stop offset="1" stopColor="#0f5a36" /></linearGradient>
      <filter id="fhBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" /></filter>
    </defs>
  );
}

function Pine({ x, y, s = 1, c = "#1a1030", lit }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="-4" width="6" height="12" fill="#0e0818" />
      <path d="M0 -62L16 -34H8L22 -12H10L26 8H-26L-10 -12H-22L-8 -34H-16Z" fill={c} />
      <path d="M0 -62L8 -48L0 -45L-8 -48Z" fill="#dfe8ff" opacity=".8" />
      {lit && <circle cx="0" cy="-22" r="2.4" fill="#ffd45a" />}
    </g>
  );
}

function Village({ stars }) {
  return (
    <g>
      <rect x="-600" y="-400" width="1760" height="1100" fill="url(#fhSky)" />
      {stars.map((s, i) => <circle key={i} className="fh-star" cx={s.x} cy={s.y} r={s.r} fill="#fff6d8" style={{ animationDelay: `${s.d}s`, animationDuration: `${2.4 + (i % 4) * 0.7}s` }} />)}
      <circle cx="70" cy="70" r="60" fill="url(#fhMoon)" /><circle cx="70" cy="70" r="24" fill="#fff6dc" /><circle cx="62" cy="64" r="5" fill="#efe0b8" opacity=".7" /><circle cx="78" cy="78" r="3.5" fill="#efe0b8" opacity=".7" />
      <path d="M-60 250L40 180L100 220L180 160L260 225L340 170L420 220L520 175L640 230V320H-60Z" fill="#2a1730" />
      <path d="M-60 270C60 248 160 262 280 254C400 246 480 262 640 250V340H-60Z" fill="#1c1026" />
      {[[-10, 272], [26, 266], [560, 268], [596, 274]].map(([x, y], i) => <Pine key={i} x={x} y={y} s={0.8 + (i % 2) * 0.15} c="#150b22" lit={i % 2 === 0} />)}
      {/* tiny houses far away */}
      {[[40, 262, 0.8], [500, 266, 0.7]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <rect x="-18" y="-18" width="36" height="20" fill="#2a1420" /><path d="M-24 -16L0 -36L24 -16Z" fill="#1a0f22" /><path d="M-24 -16L0 -36L24 -16" fill="none" stroke="#e8f0ff" strokeWidth="3.5" strokeLinejoin="round" opacity=".85" />
          <rect x="-11" y="-12" width="9" height="9" fill="#ffd45a" /><rect x="3" y="-12" width="9" height="9" fill="#ffb347" />
        </g>
      ))}
      <path d="M-60 300C60 282 160 298 280 290C400 282 480 298 640 284V420H-60Z" fill="url(#fhHill)" />
    </g>
  );
}

function House({ lights }) {
  const edge = (x0, y0, x1, y1, n) => Array.from({ length: n }, (_, i) => ({ x: x0 + ((x1 - x0) * (i + 0.5)) / n, y: y0 + ((y1 - y0) * (i + 0.5)) / n }));
  const bulbsL = edge(98, 138, 206, 54, 9); const bulbsR = edge(214, 54, 322, 138, 9);
  const cols = ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"];
  return (
    <svg className="fh-house" viewBox="0 0 420 300" aria-hidden="true">
      <Defs />
      {/* snow ground */}
      <path d="M-30 262C70 240 150 252 210 250C290 248 350 238 450 256V320H-30Z" fill="url(#fhGround)" />
      <path d="M180 252H240L300 300H120Z" fill="url(#fhPath)" />
      {[[152, 276], [172, 268], [250, 270], [268, 280]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="5" ry="2.6" fill="#8aa0cf" opacity=".5" />)}
      <ellipse cx="210" cy="256" rx="130" ry="8" fill="#0a0612" opacity=".35" filter="url(#fhBlur)" />

      {/* walls */}
      <rect x="110" y="128" width="200" height="124" fill="url(#fhWall)" />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${122 + i * 12} 128V252`} stroke="#000" strokeOpacity=".16" strokeWidth="1.4" />)}
      <rect x="108" y="244" width="204" height="10" fill="#4a1018" />
      {/* chimney + smoke */}
      <rect x="262" y="58" width="26" height="52" fill="#7a2a2a" /><path d="M262 70H288M262 84H288M262 98H288" stroke="#000" strokeOpacity=".2" />
      <rect x="258" y="52" width="34" height="10" rx="3" fill="#fff" />
      {[0, 1.6, 3.2].map((d, i) => <circle key={i} className="fh-smoke" cx="275" cy="48" r="8" fill="#dfe6ff" opacity=".6" style={{ animationDelay: `${d}s` }} />)}
      {/* roof */}
      <path d="M94 140L210 48L326 140Z" fill="#4a2020" />
      <path d="M88 142L210 42L332 142L318 146Q302 156 288 146Q272 158 256 147Q240 158 224 147Q208 158 192 147Q176 158 160 147Q144 158 128 147Q112 156 102 146Z" fill="#fff" stroke="#dfe8ff" strokeWidth="2" strokeLinejoin="round" />
      <path d="M120 120L210 50" stroke="#c9d6f5" strokeWidth="3" strokeLinecap="round" opacity=".7" />
      {/* eaves lights */}
      {[...bulbsL, ...bulbsR].map((b, i) => <g key={i}><circle cx={b.x} cy={b.y + 7} r="6" fill={cols[i % 5]} opacity=".3" /><circle className="fh-lb" style={{ position: "static", width: "auto", height: "auto", borderRadius: 0, animationDelay: `${(i % 5) * 0.4}s` }} cx={b.x} cy={b.y + 7} r="2.8" fill={cols[i % 5]} /></g>)}
      {/* windows */}
      {[126, 250].map((x, i) => (
        <g key={x}>
          <circle className="fh-win" cx={x + 22} cy="184" r="46" fill="url(#fhHalo)" style={{ animationDelay: `${i * 0.8}s` }} />
          <rect x={x - 4} y="158" width="52" height="54" rx="4" fill="#3a1a10" />
          <rect x={x} y="162" width="44" height="46" rx="3" fill="url(#fhWin)" />
          <path d={`M${x + 22} 162V208M${x} 185H${x + 44}`} stroke="#3a1a10" strokeWidth="3" />
          <rect x={x - 6} y="210" width="56" height="7" rx="2" fill="#fff" />
        </g>
      ))}
      <path d="M268 176C262 168 257 176 262 181L268 188L274 181C279 176 274 168 268 176Z" fill="#d9262f" opacity=".9" />
      {/* door + wreath */}
      <path d="M186 252V202Q186 178 210 178Q234 178 234 202V252Z" fill="#2a1a12" stroke="#e8b84a" strokeWidth="2" />
      <circle cx="224" cy="222" r="2.8" fill="url(#fhGold)" />
      <g transform="translate(210 200)">
        <circle r="12" fill="none" stroke="url(#fhLeaf)" strokeWidth="7" />
        {[[-10, 2], [8, -8], [10, 7]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" fill="#d9262f" />)}
        <path d="M0 12L-6 20L0 17L6 20Z" fill="#d9262f" />
      </g>
      {/* lamp post */}
      <path d="M78 258V206" stroke="#2a1a22" strokeWidth="4" strokeLinecap="round" />
      <circle cx="78" cy="196" r="22" fill="url(#fhHalo)" /><rect x="71" y="190" width="14" height="18" rx="3" fill="#ffd45a" stroke="#a8721f" strokeWidth="2" />
      {/* little tree */}
      <g transform="translate(352 256)">
        <path d="M0 -92L22 -52H10L28 -22H12L32 6H-32L-12 -22H-28L-10 -52H-22Z" fill="url(#fhLeaf)" stroke="#0a3b23" strokeWidth="1.2" />
        <path d="M0 -102L3 -95L11 -95L5 -90L7 -83L0 -87L-7 -83L-5 -90L-11 -95L-3 -95Z" fill="#ffd45a" />
        {[[-8, -60, "#ff5a5a"], [10, -44, "#ffd45a"], [-14, -22, "#7dd3fc"], [16, -12, "#ff9ad5"], [0, -30, "#ffd45a"]].map(([x, y, c], i) => <circle key={i} className="fh-lb" style={{ position: "static", width: "auto", height: "auto", borderRadius: 0, animationDelay: `${i * 0.3}s` }} cx={x} cy={y} r="3" fill={c} />)}
      </g>
      {lights}
    </svg>
  );
}

function Seal() {
  return (
    <svg viewBox="0 0 60 60" className="fh-seal" aria-hidden="true">
      <path d="M30 3C40 2 46 8 52 14C58 22 57 36 52 44C46 54 36 58 28 57C16 56 6 48 4 36C2 24 8 10 20 5Z" fill="#b2132a" />
      <circle cx="30" cy="30" r="20" fill="none" stroke="#ff6b82" strokeOpacity=".5" strokeWidth="2" />
      <path d="M30 42C18 34 15 26 20 22C24 19 28 21 30 25C32 21 36 19 40 22C45 26 42 34 30 42Z" fill="#ff8fa3" opacity=".9" />
      <path d="M12 18Q20 8 34 7" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Holly({ style }) {
  return (
    <svg viewBox="0 0 90 70" style={style} className="fh-corner" aria-hidden="true">
      {[-70, -20, 30, 80].map((r, i) => <g key={i} transform={`translate(18 56) rotate(${r})`}><path d="M0 0Q10 -9 26 -2Q34 -16 48 -7Q58 -3 62 5Q54 14 42 12Q34 24 24 16Q10 20 0 0Z" fill="url(#fhLeaf)" stroke="#0a3b23" strokeWidth="1.2" /></g>)}
      {[[26, 46], [38, 50], [32, 58]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="6" fill="#d4222f" stroke="#7a0f1a" /><circle cx={x - 2} cy={y - 2} r="1.8" fill="#fff" opacity=".75" /></g>)}
    </svg>
  );
}

function Table() {
  return (
    <svg className="fh-table" viewBox="0 0 800 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="fhCloth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a1220" /><stop offset="1" stopColor="#2a0710" /></linearGradient>
        <radialGradient id="fhCandle" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffd98a" stopOpacity=".9" /><stop offset="1" stopColor="#ff9f3a" stopOpacity="0" /></radialGradient>
        <linearGradient id="fhWax" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d9c9a8" /><stop offset=".5" stopColor="#fff6e4" /><stop offset="1" stopColor="#cdbb98" /></linearGradient>
      </defs>
      <ellipse cx="400" cy="120" rx="360" ry="90" fill="url(#fhCandle)" opacity=".5" />
      <path d="M-20 130Q400 100 820 130V230H-20Z" fill="url(#fhCloth)" />
      <path d="M-20 130Q400 100 820 130" fill="none" stroke="url(#fhGold)" strokeWidth="5" />
      <path d="M-20 134Q400 104 820 134" fill="none" stroke="#fff3bf" strokeOpacity=".35" strokeWidth="1.5" />
      {/* plates */}
      {[200, 600].map((x) => (
        <g key={x}><ellipse cx={x} cy="150" rx="78" ry="16" fill="#000" opacity=".4" /><ellipse cx={x} cy="144" rx="74" ry="15" fill="#fff6e8" stroke="#e8b84a" strokeWidth="3" /><ellipse cx={x} cy="144" rx="48" ry="9" fill="none" stroke="#e8b84a" strokeOpacity=".7" strokeWidth="1.5" /><circle cx={x - 18} cy="143" r="5" fill="#d9262f" /><path d={`M${x + 4} 140Q${x + 22} 134 ${x + 36} 143`} fill="none" stroke="#35a35c" strokeWidth="4" strokeLinecap="round" /></g>
      ))}
      {/* candles */}
      {[[330, 62], [400, 44], [470, 62]].map(([x, h], i) => (
        <g key={x}>
          <ellipse cx={x} cy="150" rx="22" ry="5" fill="#000" opacity=".4" />
          <rect x={x - 3} y="120" width="6" height="28" fill="url(#fhGold)" /><ellipse cx={x} cy="148" rx="14" ry="4" fill="url(#fhGold)" />
          <rect x={x - 9} y={150 - h - 24} width="18" height={h} rx="3" fill="url(#fhWax)" /><ellipse cx={x} cy={150 - h - 24} rx="9" ry="3" fill="#fff6e4" />
          <circle cx={x} cy={150 - h - 38} r="30" fill="url(#fhCandle)" />
          <path className={`fh-flame ${["", "b", "c"][i]}`} d={`M${x} ${150 - h - 46}C${x - 8} ${150 - h - 36} ${x - 6} ${150 - h - 27} ${x} ${150 - h - 25}C${x + 6} ${150 - h - 27} ${x + 8} ${150 - h - 36} ${x} ${150 - h - 46}Z`} fill="#ffb347" />
          <path className={`fh-flame ${["", "b", "c"][i]}`} d={`M${x} ${150 - h - 38}C${x - 4} ${150 - h - 33} ${x - 3} ${150 - h - 28} ${x} ${150 - h - 27}C${x + 3} ${150 - h - 28} ${x + 4} ${150 - h - 33} ${x} ${150 - h - 38}Z`} fill="#fff3bf" />
        </g>
      ))}
      {/* glasses */}
      <g className="fh-glass l" transform="translate(270 0)">
        <path d="M-14 62H14L10 100Q0 110 -10 100Z" fill="#fff" fillOpacity=".22" stroke="#fff6e8" strokeWidth="2" /><path d="M-11 74H11L9.5 98Q0 106 -9.5 98Z" fill="#f6d36b" opacity=".85" />
        <path d="M0 106V138M-14 140H14" stroke="#fff6e8" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="fh-glass r" transform="translate(530 0)">
        <path d="M-14 62H14L10 100Q0 110 -10 100Z" fill="#fff" fillOpacity=".22" stroke="#fff6e8" strokeWidth="2" /><path d="M-11 74H11L9.5 98Q0 106 -9.5 98Z" fill="#f6d36b" opacity=".85" />
        <path d="M0 106V138M-14 140H14" stroke="#fff6e8" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* petals */}
      {[[150, 168], [262, 176], [540, 172], [650, 168], [400, 176]].map(([x, y], i) => <path key={i} d={`M${x} ${y}Q${x + 8} ${y - 8} ${x + 14} ${y}Q${x + 6} ${y + 8} ${x} ${y}Z`} fill="#e0527f" opacity=".85" transform={`rotate(${i * 40} ${x} ${y})`} />)}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ChristmasFinalHouse() {
  const [stage, setStage] = useState("cover"); // cover → letter → gift
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [giftRevealed, setGiftRevealed] = useState(false);

  const pages = stage === "gift" ? GIFT : LETTER;
  const last = pages.length - 1;

  const next = useCallback(() => {
    setDir(1);
    if (stage === "cover") { setStage("letter"); setPage(0); return; }
    if (page < last) { setPage((p) => p + 1); return; }
    if (stage === "letter") { setGiftRevealed(true); setStage("gift"); setPage(0); }
  }, [stage, page, last]);

  const prev = useCallback(() => {
    setDir(-1);
    if (stage === "gift" && page === 0) { setStage("letter"); setPage(LETTER.length - 1); return; }
    if (page > 0) setPage((p) => p - 1);
    else if (stage === "letter") setStage("cover");
  }, [stage, page]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") { if (!(stage === "letter" && page === last)) next(); }
      if (e.key === "ArrowLeft" && stage !== "cover") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, stage, page, last]);

  const stars = useMemo(() => { const r = rng(21); return Array.from({ length: 70 }, () => ({ x: -40 + r() * 640, y: -30 + r() * 230, r: 0.5 + r() * 1.3, d: r() * 3 })); }, []);
  const flakes = useMemo(() => { const r = rng(5); return Array.from({ length: 44 }, () => ({ x: -20 + r() * 600, y: -r() * 380, r: 1 + r() * 2.2, o: 0.4 + r() * 0.5, dur: 7 + r() * 8, delay: -r() * 14 })); }, []);
  const bulbs = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ id: i, x: (i + 0.5) * (100 / 22), y: 8 + Math.abs(Math.sin(i * 0.8)) * 10, c: ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"][i % 5] })), []);
  const hearts = useMemo(() => Array.from({ length: 9 }, (_, i) => ({ id: i, left: 6 + i * 10.5, d: (i * 1.1) % 7, s: 14 + (i % 4) * 5 })), []);

  const isLast = page === last;

  return (
    <div className={`fh relative min-h-screen overflow-hidden ${stage === "gift" ? "gift" : ""}`}>
      <style>{CSS}</style>

      <svg className="fh-bg" viewBox="0 0 560 380" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <Defs />
        <Village stars={stars} />
        {flakes.map((f, i) => <circle key={i} className="fh-snow" cx={f.x} cy={f.y} r={f.r} fill="#fff" opacity={f.o} style={{ animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} />)}
      </svg>
      <div className="fh-warm" aria-hidden="true" />
      <div className="fh-lights" aria-hidden="true">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}><path d={`M0 2 ${bulbs.map((b) => `L${b.x} ${b.y}`).join(" ")} L100 2`} fill="none" stroke="#e8c878" strokeOpacity=".6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" /></svg>
        {bulbs.map((b) => <span key={b.id} className="fh-lb" style={{ left: `${b.x}%`, top: b.y * 1.1, background: b.c, boxShadow: `0 0 12px 3px ${b.c}`, animationDelay: `${(b.id % 5) * 0.4}s` }} />)}
      </div>
      {stage === "gift" && hearts.map((h) => <span key={h.id} className="fh-heart" style={{ left: `${h.left}%`, bottom: "6%", fontSize: h.s, animationDelay: `${h.d}s` }} aria-hidden="true">❤</span>)}

      <main className="fh-stage">
        {stage === "cover" && (
          <div className="fh-cover">
            <House />
            <p className="fh-kick">{COVER.kicker}</p>
            <h1 className="fh-title">{COVER.title}</h1>
            <button type="button" className="fh-go" onClick={next}>{COVER.open}</button>
            <p className="fh-foot">{COVER.footer}</p>
          </div>
        )}

        {stage !== "cover" && (
          <div className="fh-card">
            <div className="fh-paper">
              <Holly style={{ left: -8, top: -8 }} />
              <Holly style={{ right: -8, top: -8, transform: "scaleX(-1)" }} />
              <div className="fh-body" aria-live="polite">
                <div key={`${stage}${page}`} className="fh-page" style={{ "--dir": dir }}>
                  {stage === "letter" ? (
                    <p className="fh-pk">{page === 0 ? "Una carta para ti" : `Carta · ${page + 1} / ${LETTER.length}`}</p>
                  ) : (
                    <>
                      <p className="fh-pk">{GIFT_KICKER}</p>
                      <h2 className="fh-pt">{GIFT_TITLE}</h2>
                    </>
                  )}
                  <div className="fh-rule" />

                  {pages[page].map((b, i) => b.k === "icons" ? (
                    <div key={i} className="fh-icons" aria-hidden="true">{["🍝", "🥂", "🕯️", "🍰"].map((e) => <span key={e} className="fh-icon">{e}</span>)}</div>
                  ) : (
                    <p key={i} className={`fh-p ${b.k || ""}`}>{b.t}</p>
                  ))}

                  {stage === "letter" && isLast && !giftRevealed && <p className="fh-teaser">{TEASER}</p>}
                  {stage === "gift" && isLast && (
                    <>
                      <p className="fh-p small" style={{ marginTop: "1.2em" }}>{COVER.footer}</p>
                      <button type="button" className="fh-again" onClick={() => { setStage("cover"); setPage(0); setDir(-1); }}>Volver al principio</button>
                    </>
                  )}
                </div>
              </div>

              <div className="fh-nav">
                <button type="button" className="fh-arrow" onClick={prev} aria-label="Página anterior">←</button>
                {stage === "letter" && isLast ? (
                  <div className="fh-cta"><button type="button" className="fh-go red" style={{ marginTop: 0 }} onClick={next}>{REVEAL_BTN}</button></div>
                ) : (
                  <div className="fh-dots" aria-label={`Página ${page + 1} de ${pages.length}`}>
                    {pages.map((_, i) => <span key={i} className={`fh-dot ${i === page ? "on" : ""}`} />)}
                  </div>
                )}
                <button type="button" className="fh-arrow" onClick={next} disabled={isLast} aria-label="Página siguiente">→</button>
              </div>
              {stage === "letter" && <Seal />}
            </div>
          </div>
        )}
      </main>

      <Table />
    </div>
  );
}