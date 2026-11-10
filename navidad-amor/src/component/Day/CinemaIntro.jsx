import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/*   - videoSrc : optional. If you give a video, it plays after the    */
/*                countdown and the ticket appears when it ends.       */
/*                Without it, the ticket is revealed right after "0".  */
/*   - onFinish : called when the ticket is revealed.                  */
/* ------------------------------------------------------------------ */

const START = 10;

const TEXTS = {
  sign: "THE GRAND CINEMA",
  edition: "✦ Edición Navidad ✦",
  title: "Una noche especial",
  soon: "Próximamente",
  soonSub: "Tu película te espera…",
  enter: "▶ ENTRAR A LA SALA",
  preparing: "PREPARANDO TU PELÍCULA",
  surprise: "¡Sorpresa!",
  tonight: "Esta noche tú eliges la película",
  ticketKicker: "✦ INVITACIÓN EXCLUSIVA ✦",
  ticketTitle: "ENTRADA VIP",
  ticketValid: "Válida para una noche de cine",
  ticketMain: "¡Una película de tu elección!",
  ticketDate: "FECHA: CUANDO TÚ QUIERAS",
  ticketSide: "CINE ESPECIAL",
  gift: "Un pequeño regalo para mi persona favorita ❤️",
  replay: "VOLVER A VER ↺",
  footer: "✧ UNA EXPERIENCIA SOLO PARA TI ✧",
};

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
const BULBS = ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"];

const NOISE = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0"/></filter><rect width="160" height="160" filter="url(#n)"/></svg>'
)}")`;

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Cinzel:wght@500;700;900&display=swap');

.ci{container-type:size;height:100%;min-height:100svh;width:100%;position:relative;isolation:isolate;display:flex;flex-direction:column;align-items:center;overflow:hidden;color:#f5ead5;font-family:'Cormorant Garamond',Georgia,serif;
  background:radial-gradient(120% 90% at 50% 38%,#4a1422 0%,#25080f 48%,#0a0305 100%)}
.ci-flake{position:absolute;top:-4%;border-radius:50%;background:#fff;pointer-events:none;animation:ci-fall linear infinite;z-index:1}
@keyframes ci-fall{0%{transform:translate(0,0)}50%{transform:translate(14px,55cqh)}100%{transform:translate(-8px,110cqh)}}

/* drapes + valance */
.ci-drape{position:absolute;top:0;bottom:0;width:clamp(26px,12cqw,150px);z-index:6;pointer-events:none;
  background:repeating-linear-gradient(90deg,#3a060f 0,#8c1424 9%,#5a0a14 15%,#2b040a 22%,#7a101e 30%,#3a060f 38%);box-shadow:0 0 50px #000}
.ci-drape.l{left:0;border-radius:0 0 60% 0/0 0 14% 0;transform-origin:top left}
.ci-drape.r{right:0;border-radius:0 0 0 60%/0 0 0 14%;transform:scaleX(-1)}
.ci-drape::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 50%,rgba(0,0,0,.55));}
.ci-tie{position:absolute;top:56%;width:clamp(30px,14cqw,170px);height:12px;z-index:7;pointer-events:none;background:linear-gradient(180deg,#fff0a8,#d9a336 50%,#8a5a12);border-radius:6px;box-shadow:0 3px 8px #000a}
.ci-tie.l{left:0}.ci-tie.r{right:0}
.ci-valance{position:absolute;left:0;right:0;top:0;width:100%;height:clamp(40px,9cqh,90px);z-index:8;pointer-events:none;filter:drop-shadow(0 8px 10px rgba(0,0,0,.6))}

/* marquee sign */
.ci-head{position:relative;z-index:9;flex:none;text-align:center;padding:clamp(34px,9cqh,86px) 16px 0}
.ci-plate{position:relative;display:inline-block;padding:.35em 1.8em .45em;border-radius:12px;background:linear-gradient(180deg,#2b0a10,#14050a);box-shadow:0 0 0 3px #d9a336,0 0 0 6px #5a3a0c,0 14px 30px rgba(0,0,0,.6),0 0 40px rgba(255,200,110,.25)}
.ci-sign{margin:0;font-family:'Cinzel',serif;font-weight:900;letter-spacing:.32em;line-height:1.1;font-size:clamp(14px,min(3.4cqw,5cqh),34px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 40%,#d9a336 70%,#fbe493);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 12px rgba(255,200,90,.5))}
.ci-ed{margin:.2em 0 0;font-size:clamp(10px,min(1.7cqw,2.4cqh),14px);letter-spacing:.4em;text-transform:uppercase;font-weight:700;color:#f0a99a}
.ci-title{margin:.5em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;font-size:clamp(18px,min(3.6cqw,5.4cqh),38px);color:#f8e8c8;text-shadow:0 3px 0 rgba(0,0,0,.5)}
.ci-pb{position:absolute;width:clamp(6px,1cqw,10px);aspect-ratio:1;border-radius:50%;animation:ci-chase 1.4s steps(1) infinite}
@keyframes ci-chase{0%{background:#fff3bf;box-shadow:0 0 8px 2px #ffd45a}50%{background:#6b4a14;box-shadow:none}100%{background:#fff3bf;box-shadow:0 0 8px 2px #ffd45a}}

/* stage / screen */
.ci-stage{position:relative;z-index:4;flex:1 1 0;min-height:0;width:100%;display:flex;align-items:center;justify-content:center;container-type:size;padding:clamp(4px,1cqh,12px) 0}
.ci-frame{position:relative;container-type:inline-size;width:min(78cqw,calc(94cqh * 16 / 9));aspect-ratio:16/9;border-radius:6px;padding:clamp(5px,1.1cqw,12px);
  background:linear-gradient(135deg,#fff0a8,#d9a336 25%,#7a4f10 50%,#f1cd6a 75%,#a8721f);box-shadow:0 0 50px rgba(255,200,110,.28),0 24px 70px #000}
.ci-frame::before{content:"";position:absolute;inset:clamp(3px,.7cqw,8px);border:2px solid rgba(60,30,0,.55);border-radius:4px;pointer-events:none;z-index:3}
.ci-screen{position:relative;width:100%;height:100%;overflow:hidden;border-radius:3px;background:#050404;box-shadow:inset 0 0 0 2px #000}
.ci-vig{position:absolute;inset:0;z-index:12;pointer-events:none;box-shadow:inset 0 0 80px 18px rgba(0,0,0,.65)}
.ci-bulb{position:absolute;z-index:5;width:clamp(6px,1.3cqw,13px);aspect-ratio:.8;border-radius:50% 50% 45% 45%;animation:ci-tw 2.6s ease-in-out infinite}
@keyframes ci-tw{0%,100%{opacity:1}50%{opacity:.4}}

/* curtains of the screen */
.ci-cur{position:absolute;top:0;bottom:0;width:51%;z-index:10;transition:transform 1.8s cubic-bezier(.6,.05,.3,1);
  background:repeating-linear-gradient(90deg,#4a0710 0,#9a1628 6%,#5e0b16 11%,#2b040a 16%,#7e1220 24%,#4a0710 30%);box-shadow:inset 0 0 40px rgba(0,0,0,.6)}
.ci-cur.l{left:0;transform-origin:left;border-right:3px solid #d9a336}
.ci-cur.r{right:0;border-left:3px solid #d9a336}
.ci-cur::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.45),transparent 30%,transparent 70%,rgba(0,0,0,.55))}
.ci-open .ci-cur.l{transform:translateX(-96%)}.ci-open .ci-cur.r{transform:translateX(96%)}
.ci-plaque{position:absolute;inset:0;z-index:11;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;transition:opacity .8s ease;padding:3cqw}
.ci-open .ci-plaque{opacity:0;pointer-events:none}
.ci-soon{font-family:'Cinzel',serif;font-weight:900;letter-spacing:.3em;text-transform:uppercase;font-size:clamp(14px,4.4cqw,40px);
  background:linear-gradient(180deg,#fffbe0,#f8dd86 40%,#d9a336 70%,#fbe493);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 6px #000)}
.ci-soon-sub{margin:.4em 0 0;font-style:italic;font-size:clamp(12px,2.6cqw,22px);color:#ffe9c9;text-shadow:0 2px 8px #000}
.ci-go{margin-top:clamp(8px,2.4cqw,22px);padding:.65em 1.8em;border:0;border-radius:999px;cursor:pointer;font-family:'Cinzel',serif;font-weight:700;letter-spacing:.18em;font-size:clamp(11px,2cqw,17px);color:#4a1420;
  background:linear-gradient(180deg,#fff3bf,#e8b84a 55%,#c98a1e);box-shadow:0 4px 0 #8a5a12,0 12px 24px rgba(0,0,0,.5),0 0 30px rgba(255,214,120,.4);position:relative;overflow:hidden;transition:transform .15s ease}
.ci-go::after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);animation:ci-sheen 3s ease-in-out infinite}
@keyframes ci-sheen{0%,60%{left:-60%}100%{left:130%}}
.ci-go:hover{transform:translateY(-2px)}.ci-go:active{transform:translateY(3px)}.ci-go:focus-visible{outline:3px solid #fff;outline-offset:3px}

/* countdown leader */
.ci-leader{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,#3a3a38,#1b1b1a 70%);color:#f5f1e8;animation:ci-flick .18s infinite alternate}
@keyframes ci-flick{0%{opacity:1}100%{opacity:.93}}
.ci-grain{position:absolute;inset:-20%;background-image:${NOISE};background-size:160px 160px;opacity:.22;mix-blend-mode:screen;animation:ci-grain .6s steps(6) infinite;pointer-events:none}
@keyframes ci-grain{0%{transform:translate(0,0)}20%{transform:translate(-4%,3%)}40%{transform:translate(3%,-5%)}60%{transform:translate(-6%,-2%)}80%{transform:translate(5%,4%)}100%{transform:translate(0,0)}}
.ci-scratch{position:absolute;top:0;bottom:0;width:1px;background:rgba(255,255,255,.35);animation:ci-scr 1.1s steps(1) infinite}
.ci-ring{position:relative;width:min(56cqh,40cqw);aspect-ratio:1;border-radius:50%;border:max(2px,.5cqw) solid #eee9dc;display:flex;align-items:center;justify-content:center;overflow:hidden}
.ci-ring::before{content:"";position:absolute;inset:7%;border-radius:50%;border:1px solid rgba(238,233,220,.7)}
.ci-ring .h{position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(238,233,220,.7)}
.ci-ring .v{position:absolute;top:0;bottom:0;left:50%;width:1px;background:rgba(238,233,220,.7)}
.ci-sweep{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,rgba(255,255,255,.34),rgba(255,255,255,0) 90%,rgba(255,255,255,.34));animation:ci-spin 1s linear both}
@keyframes ci-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.ci-num{position:relative;z-index:2;font-family:'Cinzel',serif;font-weight:900;line-height:1;font-size:min(46cqh,32cqw);text-shadow:0 0 22px rgba(255,255,255,.55);animation:ci-pop .5s cubic-bezier(.2,1.4,.4,1) both}
@keyframes ci-pop{from{opacity:0;transform:scale(1.5)}to{opacity:1;transform:scale(1)}}
.ci-prep{position:absolute;left:0;right:0;bottom:6cqh;text-align:center;font-size:clamp(8px,1.8cqw,15px);letter-spacing:.5em;color:rgba(245,241,232,.85)}
.ci-corner{position:absolute;font-family:ui-monospace,monospace;font-size:clamp(8px,1.5cqw,13px);letter-spacing:.2em;color:rgba(245,241,232,.7)}
.ci-flash{position:absolute;inset:0;z-index:14;background:#fff;pointer-events:none;animation:ci-fl 1.1s ease-out both}
@keyframes ci-fl{0%{opacity:1}100%{opacity:0}}

/* reveal */
.ci-rev{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2cqw 4cqw;background:radial-gradient(120% 100% at 50% 0%,#5a1626 0%,#2a0912 55%,#0d0307 100%);animation:ci-revin 1.2s ease both}
@keyframes ci-revin{from{opacity:0;filter:brightness(2.4)}to{opacity:1;filter:none}}
.ci-beam{position:absolute;left:50%;top:-10%;width:90%;height:130%;transform:translateX(-50%);pointer-events:none;background:conic-gradient(from 180deg at 50% 0%,transparent 158deg,rgba(255,230,150,.2) 172deg,transparent 190deg,rgba(255,230,150,.16) 205deg,transparent 220deg);animation:ci-sway 7s ease-in-out infinite alternate}
@keyframes ci-sway{from{transform:translateX(-50%) rotate(-4deg)}to{transform:translateX(-50%) rotate(4deg)}}
.ci-wow{margin:0;font-family:'Mountains of Christmas',cursive;font-weight:700;line-height:1;font-size:clamp(20px,6.4cqw,60px);
  background:linear-gradient(180deg,#fffbe0,#f8dd86 40%,#d9a336 70%,#fbe493);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 rgba(58,0,12,.7)) drop-shadow(0 0 22px rgba(255,200,90,.4));animation:ci-pop .8s cubic-bezier(.2,1.4,.4,1) .3s both}
.ci-tonight{margin:.2em 0 0;font-style:italic;font-size:clamp(11px,2.5cqw,22px);color:#ffe9c9;animation:ci-rise .8s ease .7s both}
@keyframes ci-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

/* the ticket */
.ci-ticket{position:relative;display:flex;width:min(78%,640px);margin-top:clamp(6px,1.8cqw,18px);color:#39251a;filter:drop-shadow(0 14px 22px rgba(0,0,0,.6)) drop-shadow(0 0 26px rgba(255,200,110,.3));animation:ci-tk 1.1s cubic-bezier(.2,.9,.3,1) .9s both}
@keyframes ci-tk{from{opacity:0;transform:translateY(-40px) rotate(-6deg) scale(.8)}to{opacity:1;transform:rotate(-1.2deg)}}
.ci-tk-in{position:relative;display:flex;width:100%;border-radius:10px;overflow:hidden;background:linear-gradient(180deg,#f3e2bb,#e4cc9c);
  -webkit-mask:radial-gradient(circle 9px at 0 50%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 9px at 100% 50%,transparent 98%,#000) right/51% 100% no-repeat;mask:radial-gradient(circle 9px at 0 50%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 9px at 100% 50%,transparent 98%,#000) right/51% 100% no-repeat}
.ci-tk-in::before{content:"";position:absolute;inset:5px;border:1.5px dashed rgba(140,103,69,.6);border-radius:7px;pointer-events:none}
.ci-stub{flex:none;width:14%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#d9c298;font-weight:700;letter-spacing:.2em}
.ci-stub.l{border-right:2px dashed rgba(140,103,69,.55)}.ci-stub.r{border-left:2px dashed rgba(140,103,69,.55)}
.ci-stub.l span{transform:rotate(-90deg);white-space:nowrap;font-size:clamp(6px,1.5cqw,12px)}
.ci-stub.r b{font-size:clamp(14px,3.6cqw,30px)}.ci-stub.r i{font-style:normal;font-size:clamp(6px,1.4cqw,11px);margin-top:.2em}
.ci-tk-body{flex:1;min-width:0;padding:clamp(5px,1.6cqw,16px) 6px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.ci-tk-k{margin:0;font-size:clamp(6px,1.4cqw,12px);font-weight:700;letter-spacing:.3em;color:#936d42}
.ci-tk-t{margin:.1em 0 0;font-family:'Cinzel',serif;font-weight:900;line-height:1.05;font-size:clamp(14px,3.8cqw,34px);color:#5a1626}
.ci-tk-rule{width:80%;height:1px;margin:.35em 0;background:rgba(167,137,96,.6)}
.ci-tk-v{margin:0;font-style:italic;font-size:clamp(8px,1.9cqw,17px)}
.ci-tk-m{margin:.3em 0 0;font-weight:700;line-height:1.1;font-size:clamp(11px,2.7cqw,25px);color:#8a1a2e}
.ci-tk-d{margin:.4em 0 0;font-size:clamp(6px,1.3cqw,11px);letter-spacing:.2em;color:#806344;font-weight:700}
.ci-gift{margin:clamp(4px,1.2cqw,12px) 0 0;font-style:italic;font-size:clamp(9px,1.9cqw,17px);color:#ffe0d0;animation:ci-rise .8s ease 1.6s both}
.ci-replay{margin-top:clamp(4px,1cqw,10px);padding:.35em 1.3em;border:1px solid rgba(246,210,122,.7);border-radius:999px;background:rgba(0,0,0,.35);color:#f8dd86;cursor:pointer;font-family:'Cinzel',serif;font-weight:700;letter-spacing:.16em;font-size:clamp(7px,1.4cqw,12px);animation:ci-rise .8s ease 2s both;transition:background .2s ease}
.ci-replay:hover{background:rgba(246,210,122,.25)}.ci-replay:focus-visible{outline:2px solid #fff;outline-offset:3px}
.ci-conf{position:absolute;top:-6%;pointer-events:none;animation:ci-conf linear infinite}
@keyframes ci-conf{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(115cqh) rotate(720deg);opacity:.9}}
.ci-video{position:absolute;inset:0;width:100%;height:100%;background:#000;object-fit:contain;z-index:3;animation:ci-revin 1.2s ease both}

/* projector + audience */
.ci-proj{position:absolute;left:50%;bottom:0;width:46cqw;height:70cqh;transform:translateX(-50%);z-index:2;pointer-events:none;background:linear-gradient(0deg,rgba(255,236,170,.16),transparent 75%);clip-path:polygon(46% 100%,54% 100%,100% 0,0 0);mix-blend-mode:screen}
.ci-mote{position:absolute;border-radius:50%;background:#fff3bf;pointer-events:none;animation:ci-mote linear infinite;z-index:2}
@keyframes ci-mote{0%{transform:translateY(0);opacity:0}20%{opacity:.7}100%{transform:translateY(-40cqh);opacity:0}}
.ci-seats{position:relative;z-index:7;flex:none;width:100%;height:clamp(54px,16cqh,150px);margin-top:-1cqh}
.ci-seats svg{display:block;width:100%;height:100%}
.ci-foot{position:absolute;left:0;right:0;bottom:clamp(2px,.8cqh,8px);z-index:9;text-align:center;font-size:clamp(7px,1.3cqw,12px);letter-spacing:.4em;color:rgba(255,233,201,.5);pointer-events:none}
.ci-snd{position:absolute;right:clamp(34px,13cqw,170px);top:clamp(10px,2.6cqh,24px);z-index:20;width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(246,210,122,.7);background:rgba(0,0,0,.45);color:#f8dd86;cursor:pointer;font-size:16px}
.ci-snd:hover{background:rgba(246,210,122,.25)}.ci-snd:focus-visible{outline:2px solid #fff;outline-offset:2px}

@media (prefers-reduced-motion: reduce){
  .ci-flake,.ci-grain,.ci-scratch,.ci-sweep,.ci-leader,.ci-beam,.ci-conf,.ci-mote,.ci-go::after,.ci-bulb,.ci-pb{animation:none !important}
  .ci-cur{transition-duration:.01s}.ci-rev,.ci-ticket,.ci-wow,.ci-tonight,.ci-gift,.ci-replay,.ci-num{animation-duration:.01s !important;animation-delay:0s !important}
}
`;

/* ------------------------------------------------------------------ */
/*  SVG decorations                                                    */
/* ------------------------------------------------------------------ */

function Valance() {
  const n = 9; const w = 1000 / n;
  let d = "M0 0H1000V26";
  for (let i = n - 1; i >= 0; i--) d += `Q${i * w + w / 2} ${86} ${i * w} 26`;
  d += "Z";
  return (
    <svg className="ci-valance" viewBox="0 0 1000 96" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="ciVel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a1628" /><stop offset=".6" stopColor="#6a0c18" /><stop offset="1" stopColor="#3a060f" /></linearGradient>
        <linearGradient id="ciGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".5" stopColor="#e8b84a" /><stop offset="1" stopColor="#a8721f" /></linearGradient>
      </defs>
      <path d={d} fill="url(#ciVel)" />
      <path d={d} fill="none" stroke="url(#ciGold)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      {Array.from({ length: n + 1 }, (_, i) => <circle key={i} cx={i * w} cy="28" r="4" fill="url(#ciGold)" />)}
      {Array.from({ length: n }, (_, i) => <path key={i} d={`M${i * w + w * 0.2} ${50 + Math.sin(i) * 3}Q${i * w + w / 2} ${76} ${i * w + w * 0.8} ${50 + Math.sin(i) * 3}`} fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="2" vectorEffect="non-scaling-stroke" />)}
    </svg>
  );
}

function Seats() {
  const seats = Array.from({ length: 13 }, (_, i) => i);
  return (
    <div className="ci-seats" aria-hidden="true">
      <svg viewBox="0 0 1000 130" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="ciSeat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8c1424" /><stop offset=".6" stopColor="#5a0a14" /><stop offset="1" stopColor="#2b040a" /></linearGradient>
          <linearGradient id="ciSeat2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a0710" /><stop offset="1" stopColor="#1a0207" /></linearGradient>
        </defs>
        <rect x="0" y="60" width="1000" height="80" fill="#12040a" />
        {seats.map((i) => (
          <g key={i} transform={`translate(${i * 78 - 7} 0)`}>
            <rect x="0" y="46" width="68" height="90" rx="22" fill="url(#ciSeat)" />
            <rect x="6" y="52" width="56" height="30" rx="14" fill="#fff" opacity=".07" />
            <path d="M12 92H56" stroke="#000" strokeOpacity=".35" strokeWidth="3" />
          </g>
        ))}
        {/* the couple, heads close together */}
        <g>
          <path d="M395 100V82C395 62 410 52 427 52C444 52 458 62 458 82V100Z" fill="#06020a" />
          <circle cx="427" cy="40" r="19" fill="#06020a" />
          <path d="M406 34C408 16 446 14 448 34C438 26 418 26 406 34Z" fill="#06020a" />
          <path d="M470 100V84C470 64 484 54 500 54C516 54 530 64 530 84V100Z" fill="#06020a" transform="rotate(-6 500 100)" />
          <circle cx="496" cy="42" r="18" fill="#06020a" transform="rotate(-6 500 100)" />
          <path d="M476 40C470 6 520 4 516 44C512 24 490 26 476 40Z" fill="#06020a" transform="rotate(-6 500 100)" />
          <path d="M462 60Q478 46 490 60" stroke="#f0a0b0" strokeOpacity=".9" strokeWidth="0" />
        </g>
        {/* popcorn bucket */}
        <g transform="translate(560 78)">
          <path d="M0 0L6 44H36L42 0Z" fill="#d9262f" /><path d="M10 0L13 44M21 0V44M32 0L29 44" stroke="#fff6e8" strokeWidth="5" opacity=".9" />
          {[[6, -4], [16, -9], [28, -8], [37, -3], [22, -2]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6.5" fill="#fff3cf" stroke="#f0d79a" />)}
        </g>
      </svg>
    </div>
  );
}

function Tree({ style }) {
  return (
    <svg viewBox="0 0 80 130" style={style} className="ci-tree" aria-hidden="true">
      <rect x="34" y="104" width="12" height="18" fill="#6a3a18" />
      {[[40, 6, 38, 52], [40, 30, 52, 78], [40, 56, 64, 106]].map(([cx, top, hw, bot], i) => <path key={i} d={`M${cx} ${top}L${cx + hw / 2 + 6} ${bot * 0.78}H${cx - hw / 2 - 6}Z`} fill={["#1f7a45", "#237f4a", "#1a6b3d"][i]} stroke="#0a3b23" strokeWidth="1" strokeLinejoin="round" />)}
      {[[30, 40, "#ff5a5a"], [48, 52, "#ffd45a"], [24, 66, "#7dd3fc"], [52, 78, "#ff9ad5"], [36, 90, "#ffd45a"], [58, 98, "#ff5a5a"], [22, 96, "#4ade80"]].map(([x, y, c], i) => <g key={i}><circle cx={x} cy={y} r="5" fill={c} opacity=".35" /><circle className="ci-bulb" style={{ position: "static", width: "auto", aspectRatio: "auto", borderRadius: 0, animationDelay: `${i * 0.3}s` }} cx={x} cy={y} r="2.4" fill={c} /></g>)}
      <path d="M40 -4L43 4L52 4L45 9L48 18L40 12L32 18L35 9L28 4L37 4Z" fill="#ffd45a" transform="translate(0 2)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Audio (Web Audio, optional)                                        */
/* ------------------------------------------------------------------ */

function useCinemaSound() {
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

  const tone = useCallback((freq, dur, type = "sine", vol = 0.18, delay = 0) => {
    const ctx = ctxRef.current;
    if (!ctx || !onRef.current) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + 0.05);
  }, []);

  const tick = useCallback((n) => tone(n <= 3 ? 1046 : 740, 0.12, "square", 0.07), [tone]);
  const chime = useCallback(() => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 1.6, "triangle", 0.16, i * 0.12));
    [1318.5, 1567.98, 2093].forEach((f, i) => tone(f, 1.2, "sine", 0.07, 0.5 + i * 0.1));
  }, [tone]);

  useEffect(() => () => { if (ctxRef.current) ctxRef.current.close().catch(() => {}); }, []);
  return { ensure, tick, chime, on, setOn };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CinemaIntro({ onFinish }) {
  const [phase, setPhase] = useState("idle"); // idle → count → (video) → reveal
  const [count, setCount] = useState(START);
  const videoRef = useRef(null);
  const sound = useCinemaSound();
  const open = phase !== "idle";

  const flakes = useMemo(() => { const r = rng(5); return Array.from({ length: 26 }, (_, i) => ({ id: i, left: r() * 100, size: r() * 3.5 + 1.5, dur: r() * 8 + 10, delay: -r() * 14, o: 0.25 + r() * 0.4 })); }, []);
  const motes = useMemo(() => { const r = rng(17); return Array.from({ length: 16 }, (_, i) => ({ id: i, left: 30 + r() * 40, bottom: r() * 20, s: 1.5 + r() * 2.5, dur: 6 + r() * 6, delay: -r() * 10 })); }, []);
  const confetti = useMemo(() => { const r = rng(9); return Array.from({ length: 30 }, (_, i) => ({ id: i, left: r() * 100, c: ["#ffd45a", "#d9362f", "#35a35c", "#f6e7c1", "#7dd3fc", "#ff9ad5"][i % 6], dur: 4 + r() * 4, delay: -r() * 6, w: 5 + r() * 5 })); }, []);
  const frameBulbs = useMemo(() => {
    const e = (n, f) => Array.from({ length: n }, (_, i) => f((i + 0.5) / n, i));
    return [...e(14, (t, i) => ({ k: `t${i}`, s: { left: `${t * 100}%`, top: "-7px" }, i })), ...e(14, (t, i) => ({ k: `b${i}`, s: { left: `${t * 100}%`, bottom: "-7px" }, i: i + 2 })), ...e(7, (t, i) => ({ k: `l${i}`, s: { top: `${t * 100}%`, left: "-7px" }, i: i + 1 })), ...e(7, (t, i) => ({ k: `r${i}`, s: { top: `${t * 100}%`, right: "-7px" }, i: i + 3 }))];
  }, []);
  const plateBulbs = useMemo(() => [...Array.from({ length: 16 }, (_, i) => ({ k: `t${i}`, s: { left: `${(i + 0.5) * 6.25}%`, top: -4 }, d: (i % 2) * 0.7 })), ...Array.from({ length: 16 }, (_, i) => ({ k: `b${i}`, s: { left: `${(i + 0.5) * 6.25}%`, bottom: -4 }, d: ((i + 1) % 2) * 0.7 }))], []);

  // countdown 10 → 1
  useEffect(() => {
    if (phase !== "count") return undefined;
    const id = setTimeout(() => {
      if (count <= 1) { setPhase(VIDEO_SRC ? "video" : "reveal"); return; }
      const next = count - 1;
      setCount(next);
      sound.tick(next);
    }, 1000);
    return () => clearTimeout(id);
  }, [phase, count]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase === "reveal") { sound.chime(); onFinish?.(); }
    if (phase === "video" && videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.play().catch(() => {}); }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    sound.ensure();
    setCount(START);
    setPhase("count");
    sound.tick(START);
  };
  const replay = () => { setPhase("idle"); setCount(START); };

  const VIDEO_SRC = "/videos/cinema.mp4";

  return (
    <section className={`ci relative isolate flex h-full max-h-full w-full max-w-full items-center justify-center overflow-hidden ${open ? "ci-open" : ""}`}>
      <style>{CSS}</style>

      {flakes.map((f) => <span key={f.id} className="ci-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true" />)}
      <div className="ci-proj" aria-hidden="true" />
      {motes.map((m) => <span key={m.id} className="ci-mote" style={{ left: `${m.left}%`, bottom: `${m.bottom}%`, width: m.s, height: m.s, animationDuration: `${m.dur}s`, animationDelay: `${m.delay}s` }} aria-hidden="true" />)}

      {/* rideaux de la salle */}
      <div className="ci-drape l" aria-hidden="true" /><div className="ci-drape r" aria-hidden="true" />
      <div className="ci-tie l" aria-hidden="true" /><div className="ci-tie r" aria-hidden="true" />
      <Valance />

      <button type="button" className="ci-snd" onClick={() => sound.setOn(!sound.on)} aria-pressed={sound.on} aria-label={sound.on ? "Desactivar el sonido" : "Activar el sonido"}>{sound.on ? "♫" : "♪"}</button>

      {/* Enseigne */}
      <header className="ci-head" style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
        <div className="ci-plate">
          {plateBulbs.map((b) => <span key={b.k} className="ci-pb" style={{ ...b.s, animationDelay: `${b.d}s` }} aria-hidden="true" />)}
          <h1 className="ci-sign">{TEXTS.sign}</h1>
          <p className="ci-ed">{TEXTS.edition}</p>
        </div>
        <p className="ci-title">{TEXTS.title}</p>
      </header>

      {/* Salle : écran + public */}
      <div style={{ position: "relative", zIndex: 4, display: "flex", flexDirection: "column", width: "100%", height: "100%", paddingTop: "clamp(104px,24cqh,200px)", minHeight: 0 }}>
        <div className="ci-stage">
          <Tree style={{ position: "absolute", left: "clamp(34px,13cqw,170px)", bottom: 0, height: "46%", maxHeight: 260, zIndex: 8 }} />
          <Tree style={{ position: "absolute", right: "clamp(34px,13cqw,170px)", bottom: 0, height: "46%", maxHeight: 260, zIndex: 8 }} />

          <div className="ci-frame">
            {frameBulbs.map((b) => <span key={b.k} className="ci-bulb" style={{ ...b.s, background: BULBS[b.i % 5], boxShadow: `0 0 10px 2px ${BULBS[b.i % 5]}`, animationDelay: `${(b.i % 7) * 0.35}s` }} aria-hidden="true" />)}

            <div className="ci-screen">
              {/* fond de l'écran : amorce de film */}
              {phase === "count" && (
                <div className="ci-leader" role="timer" aria-label={`Cuenta atrás ${count}`}>
                  <span className="ci-grain" aria-hidden="true" />
                  {[18, 41, 73, 90].map((x, i) => <span key={x} className="ci-scratch" style={{ left: `${x}%`, animationDelay: `${i * 0.27}s`, opacity: 0.5 }} aria-hidden="true" />)}
                  <div className="ci-ring" key={`r${count}`}>
                    <span className="ci-sweep" aria-hidden="true" />
                    <span className="h" /><span className="v" />
                    <span className="ci-num" key={count}>{count}</span>
                  </div>
                  <span className="ci-corner" style={{ left: "3%", top: "5%" }} aria-hidden="true">REEL 01</span>
                  <span className="ci-corner" style={{ right: "3%", top: "5%" }} aria-hidden="true">NAVIDAD ❄ 2026</span>
                  <p className="ci-prep">{TEXTS.preparing}</p>
                </div>
              )}

              {phase === "video" && VIDEO_SRC && (
                <video ref={videoRef} className="ci-video" src={VIDEO_SRC} playsInline controls autoPlay onEnded={() => setPhase("reveal")} />
              )}

              {phase === "reveal" && (
                <div className="ci-rev">
                  <div className="ci-beam" aria-hidden="true" />
                  {confetti.map((c) => <span key={c.id} className="ci-conf" style={{ left: `${c.left}%`, width: c.w, height: c.w * 1.5, background: c.c, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} aria-hidden="true" />)}
                  <h2 className="ci-wow" style={{ position: "relative" }}>{TEXTS.surprise}</h2>
                  <p className="ci-tonight" style={{ position: "relative" }}>{TEXTS.tonight}</p>

                  {/* <div className="ci-ticket" style={{ position: "relative" }}>
                    <div className="ci-tk-in">
                      <div className="ci-stub l"><span>{TEXTS.ticketSide}</span></div>
                      <div className="ci-tk-body">
                        <p className="ci-tk-k">{TEXTS.ticketKicker}</p>
                        <h3 className="ci-tk-t">{TEXTS.ticketTitle}</h3>
                        <div className="ci-tk-rule" />
                        <p className="ci-tk-v">{TEXTS.ticketValid}</p>
                        <p className="ci-tk-m">{TEXTS.ticketMain}</p>
                        <p className="ci-tk-d">{TEXTS.ticketDate}</p>
                      </div>
                      <div className="ci-stub r"><b aria-hidden="true">🎬</b><i>VIP</i><i>001</i></div>
                    </div>
                  </div> */}
                  <div className="ci-audio-box" style={{ position: "relative" }}>
                  <p>✦ UN MENSAJE ESPECIAL PARA TI ✦</p>
{/* 
                  <audio
                    className="ci-audio"
                    src={AUDIO_SRC}
                    controls
                    preload="metadata"
                  /> */}
                </div>

                  <p className="ci-gift" style={{ position: "relative" }}>{TEXTS.gift}</p>
                  <button type="button" className="ci-replay" style={{ position: "relative" }} onClick={replay}>{TEXTS.replay}</button>
                </div>
              )}

              {phase === "reveal" && <div className="ci-flash" aria-hidden="true" />}

              {/* rideaux de l'écran + plaque d'accueil */}
              <div className="ci-cur l" aria-hidden="true" /><div className="ci-cur r" aria-hidden="true" />
              <div className="ci-plaque">
                <span className="ci-soon">{TEXTS.soon}</span>
                <p className="ci-soon-sub">{TEXTS.soonSub}</p>
                <button type="button" className="ci-go" onClick={start} tabIndex={open ? -1 : 0}>{TEXTS.enter}</button>
              </div>
              <div className="ci-vig" aria-hidden="true" />
            </div>
          </div>
        </div>

        <Seats />
      </div>

      {/* <p className="ci-foot">{TEXTS.footer}</p> */}
    </section>
  );
}