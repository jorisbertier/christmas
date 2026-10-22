import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  1. YOUR PHOTOS                                                     */
/*  Put your 3 favorite photos in src/assets/day13/, uncomment the     */
/*  imports and replace `src: null` with the imported name.            */
/* ------------------------------------------------------------------ */

// import photo1 from "../../assets/day13/photo-1.jpg";
// import photo2 from "../../assets/day13/photo-2.jpg";
// import photo3 from "../../assets/day13/photo-3.jpg";

const PHOTOS = [
  {
    id: "lights",
    src: null /* photo1 */,
    title: "Entre mil luces",
    caption: "Entre tantas luces, la que más brilla eres tú.",
  },
  {
    id: "home",
    src: null /* photo2 */,
    title: "Mi lugar favorito",
    caption: "Cualquier sitio contigo se siente como estar en casa.",
  },
  {
    id: "together",
    src: null /* photo3 */,
    title: "Siempre juntos",
    caption: "A tu lado, todos los días son Navidad.",
  },
];

/* ------------------------------------------------------------------ */
/*  2. TEXTS (Spanish)                                                 */
/* ------------------------------------------------------------------ */

const TEXTS = {
  date: "13 de diciembre",
  title: "Galería de nuestras fotos",
  subtitle: "Un pequeño álbum con tres de nuestros momentos favoritos",
  hint: "Toca una foto para verla de cerca",
  hintBack: "Toca de nuevo para volver al álbum",
  allSeen: "Las has visto todas ✨ ¿Ya probaste la estrella y las luces?",
  placeholder: "Tu foto aquí",
  starLabel: "Estrella de Navidad",
  bulbLabel: "Bombilla de Navidad",
  snowmanLabel: "Muñeco de nieve",
  santaSays: "¡Jo, jo, jo!",
  snowmanPhrases: [
    "¡Feliz Navidad!",
    "¡Qué frío hace aquí!",
    "¿Me das un abrazo?",
    "¡Cuántos regalos!",
    "Te quiero mucho ❤️",
    "¡Jo, jo, jo!",
  ],
};

/* ------------------------------------------------------------------ */
/*  3. LAYOUT CONSTANTS (everything is expressed in % of the stage)    */
/* ------------------------------------------------------------------ */

// The wire is a parabola: y(x) = y0 + 4 * sag * (x/100) * (1 - x/100)
const WIRE = { y0: 5, sag: 7 };
const wireY = (x) => WIRE.y0 + 4 * WIRE.sag * (x / 100) * (1 - x / 100);

const PHOTO_X = [22, 50, 78];
const TILTS = [-2.5, 1.8, -1.6];
const BULB_X = [6, 12, 18, 30, 36, 42, 58, 64, 70, 82, 88, 94];
const BULB_COLORS = ["#ff4d4d", "#ffd45a", "#4ade80", "#7dd3fc", "#ff8fd0"];
// C major pentatonic: each bulb rings a little bell
const BELL_NOTES = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
const SPARK_COLORS = ["#fff3bf", "#ffd45a", "#ff6b6b", "#ffffff"];

/* ------------------------------------------------------------------ */
/*  4. STYLES                                                          */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&display=swap');

.album-stage{container-type:size;position:relative;overflow:hidden;user-select:none;
  font-family:'Cormorant Garamond',Georgia,serif;color:#fef3c7;
  background:radial-gradient(120% 80% at 50% 0%,#15485a 0%,#0b2533 48%,#061520 100%)}
.album-inner{position:absolute;inset:0;--w:clamp(104px,min(27cqw,29cqh),330px);--zoom:1.42}
@container (max-width:560px){
  .album-inner{--w:clamp(90px,29cqw,200px);--zoom:2.3}
  .album-title{bottom:31cqh}
  .album-gifts{width:24cqw}
  .album-snowman{width:19cqw}
  .album-bubble{bottom:calc(6.5cqh + 19cqw * 1.4 + 6px)}
}

/* wire + bulbs */
.album-wire{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.album-bulb{position:absolute;width:clamp(12px,2cqw,22px);aspect-ratio:.68;padding:0;border:0;background:none;cursor:pointer;
  transform:translate(-50%,-1px);z-index:6;-webkit-tap-highlight-color:transparent}
.album-bulb::before{content:"";position:absolute;left:50%;top:-4px;width:46%;height:6px;transform:translateX(-50%);border-radius:1px;background:linear-gradient(90deg,#8a5a12,#f6d77a,#8a5a12)}
.album-bulb i{position:absolute;inset:0;border-radius:50% 50% 50% 50%/58% 58% 42% 42%;
  background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.95) 0 7%,transparent 24%),linear-gradient(180deg,transparent 55%,rgba(0,0,0,.28)),var(--c);
  box-shadow:0 0 12px 2px var(--c);animation:album-glow var(--t,2.6s) ease-in-out var(--d,0s) infinite}
.album-bulb:hover i,.album-bulb:focus-visible i{filter:brightness(1.3)}
.album-bulb:focus-visible{outline:2px solid #fde68a;outline-offset:3px;border-radius:6px}
.album-bulb[data-pop="true"] i{animation:album-bulb-pop .45s ease-out}
@keyframes album-glow{0%,100%{filter:brightness(1.2)}50%{filter:brightness(.62)}}
@keyframes album-bulb-pop{0%{transform:scale(1)}40%{transform:scale(1.7);filter:brightness(1.8)}100%{transform:scale(1)}}

/* hanging polaroids */
.album-hang{position:absolute;width:var(--w);margin-left:calc(var(--w) / -2)}
.album-swing{--amp:2.2deg;transform-origin:50% 0;animation:album-swing var(--dur,5s) ease-in-out var(--delay,0s) infinite alternate}
.album-swing[data-focused="true"]{--amp:.3deg}
@keyframes album-swing{0%{transform:rotate(calc(var(--amp) * -1))}100%{transform:rotate(var(--amp))}}

.album-card{position:relative;display:block;width:var(--w);padding:0;border:0;background:none;cursor:pointer;text-align:center;outline:none;
  transform-origin:50% 0;transform:rotate(var(--tilt));
  transition:transform .75s cubic-bezier(.2,.8,.2,1),opacity .5s ease,filter .5s ease;-webkit-tap-highlight-color:transparent}
.album-card:hover:not([data-focused="true"]){transform:rotate(0deg) translateY(-1.2cqh)}
.album-card[data-focused="true"]{transform:translate(calc(var(--dx) * 1cqw),calc(var(--dy) * 1cqh)) scale(var(--zoom)) rotate(0deg);cursor:zoom-out}
.album-card[data-dimmed="true"]{opacity:.38;filter:saturate(.6) blur(.8px)}
.album-card:focus-visible .album-paper{box-shadow:0 0 0 3px #fde68a,0 1.6cqh 3cqh rgba(0,0,0,.5)}

.album-peg{position:absolute;left:50%;top:calc(var(--w) * -.13);width:calc(var(--w) * .085);transform:translateX(-50%);z-index:3;filter:drop-shadow(0 2px 2px rgba(0,0,0,.45))}
.album-paper{display:block;position:relative;background:#fff8ec;padding:5% 5% 0;border-radius:4px;box-shadow:0 1.6cqh 3cqh rgba(0,0,0,.5)}
.album-photo{display:block;position:relative;aspect-ratio:4/5;overflow:hidden;border-radius:2px;background:#16262e;box-shadow:inset 0 0 0 1px rgba(0,0,0,.3)}
.album-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.album-sheen{position:absolute;inset:0;pointer-events:none;background:linear-gradient(125deg,rgba(255,255,255,.24),transparent 36%),radial-gradient(120% 90% at 50% 40%,transparent 60%,rgba(0,0,0,.28))}
.album-ph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6%;
  background:linear-gradient(150deg,#b3202a,#7a0f1a 55%,#14543a);color:#ffe9b0;font-style:italic;font-size:calc(var(--w) * .075)}
.album-ph b{font-size:calc(var(--w) * .22);font-style:normal}

.album-caption{display:block;position:relative;padding:7% 3% 8%;font-family:'Caveat','Segoe Script','Bradley Hand',cursive;line-height:1.12;
  font-size:clamp(11px,calc(var(--w) * .082),22px);color:#2f5d46}
.album-caption strong{display:block;font-weight:700;font-size:1.22em;color:#a3121f;margin-bottom:.12em}
.album-caption::before{content:"";position:absolute;left:5%;right:5%;top:0;border-top:2px dotted rgba(163,18,31,.45)}
.album-holly{position:absolute;right:3%;top:-.55em;width:2.6em}
@container (max-width:560px){.album-card:not([data-focused="true"]) .album-text{display:none}}

/* sparkles */
.album-burst{position:absolute;width:0;height:0;pointer-events:none;z-index:70}
.album-burst i{position:absolute;left:0;top:0;opacity:0;animation:album-fly .95s cubic-bezier(.15,.7,.3,1) forwards}
.album-burst i.star{clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)}
.album-burst i.dot{border-radius:50%}
@keyframes album-fly{0%{opacity:1;transform:translate(0,0) scale(.3) rotate(0)}70%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1) rotate(var(--r))}}

/* star topper */
.album-star{position:absolute;left:50%;top:.6cqh;width:clamp(28px,5.2cqw,58px);aspect-ratio:1;transform:translateX(-50%);padding:0;border:0;background:none;cursor:pointer;z-index:8;-webkit-tap-highlight-color:transparent}
.album-star svg{width:100%;height:100%;overflow:visible;animation:album-twinkle 2.8s ease-in-out infinite;filter:drop-shadow(0 0 10px #ffd45a)}
.album-star:hover svg{transform:scale(1.15) rotate(8deg)}
.album-star:focus-visible{outline:2px solid #fde68a;outline-offset:4px;border-radius:50%}
@keyframes album-twinkle{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.72;transform:scale(.92)}}

/* Santa's sleigh (easter egg) */
.album-santa{position:absolute;left:0;top:9cqh;width:clamp(180px,27cqw,380px);z-index:80;pointer-events:none;animation:album-cross 7s linear forwards}
.album-santa-bob{animation:album-bob 1.1s ease-in-out infinite alternate}
.album-santa-says{position:absolute;left:34%;top:-26%;padding:.25em .7em;border-radius:999px;background:#fff8ec;color:#a3121f;font-family:'Caveat',cursive;font-weight:700;font-size:clamp(16px,2.4cqw,30px);white-space:nowrap;box-shadow:0 4px 10px rgba(0,0,0,.35)}
@keyframes album-cross{0%{transform:translateX(-125%)}100%{transform:translateX(calc(100cqw + 25%))}}
@keyframes album-bob{0%{transform:translateY(-1.2cqh) rotate(-2deg)}100%{transform:translateY(1.2cqh) rotate(2deg)}}

/* ground + props */
.album-ground{position:absolute;left:0;right:0;bottom:0;width:100%;height:15cqh;pointer-events:none}
.album-gifts{position:absolute;left:3%;bottom:7cqh;width:clamp(70px,14cqw,170px);pointer-events:none}
.album-snowman{position:absolute;right:4%;bottom:6.5cqh;width:clamp(64px,10.5cqw,150px);padding:0;border:0;background:none;cursor:pointer;z-index:9;transform-origin:50% 100%;-webkit-tap-highlight-color:transparent}
.album-snowman:focus-visible{outline:2px solid #fde68a;outline-offset:4px;border-radius:12px}
.album-hop-a{animation:album-hop .6s ease-out}
.album-hop-b{animation:album-hop2 .6s ease-out}
@keyframes album-hop{0%,100%{transform:translateY(0) scale(1,1)}30%{transform:translateY(0) scale(1.08,.9)}60%{transform:translateY(-3cqh) scale(.96,1.06)}}
@keyframes album-hop2{0%,100%{transform:translateY(0) scale(1,1)}30%{transform:translateY(0) scale(1.08,.9)}60%{transform:translateY(-3cqh) scale(.96,1.06)}}
.album-bubble{position:absolute;right:calc(4% + 1cqw);bottom:calc(6.5cqh + clamp(64px,10.5cqw,150px) * 1.4 + 6px);z-index:10;pointer-events:none;
  padding:.3em .8em;border-radius:14px;background:#fff8ec;color:#a3121f;font-family:'Caveat',cursive;font-weight:700;font-size:clamp(16px,2.2cqw,28px);white-space:nowrap;
  box-shadow:0 4px 10px rgba(0,0,0,.35);animation:album-pop .35s cubic-bezier(.3,1.5,.5,1) both}
.album-bubble::after{content:"";position:absolute;right:22%;bottom:-8px;border:8px solid transparent;border-top-color:#fff8ec;border-bottom:0}
@keyframes album-pop{0%{opacity:0;transform:translateY(8px) scale(.7)}100%{opacity:1;transform:none}}

/* title */
.album-title{position:absolute;left:50%;bottom:17cqh;transform:translateX(-50%);width:min(92cqw,780px);text-align:center;pointer-events:none;z-index:4}
.album-date{display:block;font-style:italic;font-weight:600;color:#fcd34d;font-size:clamp(13px,min(2cqw,3cqh),24px);letter-spacing:.06em}
.album-title h1{margin:.05em 0 0;font-style:italic;font-weight:700;line-height:1.05;font-size:clamp(22px,min(4.8cqw,7cqh),58px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 2px 0 rgba(58,0,12,.55))}
.album-sub{margin:.25em 0 0;font-size:clamp(12px,min(1.9cqw,2.8cqh),22px);color:rgba(254,243,199,.88);font-style:italic}
.album-hint{display:block;margin-top:.45em;font-size:clamp(11px,min(1.6cqw,2.4cqh),18px);color:rgba(253,230,138,.7)}

/* snow */
.album-flake{position:absolute;border-radius:50%;background:rgba(255,255,255,.85);pointer-events:none;animation:album-fall linear infinite}
@keyframes album-fall{0%{transform:translate(0,-10px)}50%{transform:translate(12px,55cqh)}100%{transform:translate(-6px,108cqh)}}

@media (prefers-reduced-motion: reduce){
  .album-swing,.album-flake,.album-bulb i,.album-star svg,.album-santa-bob{animation:none !important}
  .album-card{transition-duration:.01s}
  .album-santa{display:none}
}
`;

/* ------------------------------------------------------------------ */
/*  5. HELPERS                                                         */
/* ------------------------------------------------------------------ */

// Deterministic pseudo random, so the layout never jumps between renders
function seeded(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// Tiny bell synthesised with the Web Audio API (no audio file needed)
function useBell() {
  const ctxRef = useRef(null);

  useEffect(
    () => () => {
      if (ctxRef.current && ctxRef.current.close) ctxRef.current.close();
    },
    []
  );

  return useCallback((freq) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!ctxRef.current) ctxRef.current = new AudioCtx();
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const t = ctx.currentTime;
      [[1, 0.22], [2.76, 0.08], [5.4, 0.03]].forEach(([mult, vol]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq * mult;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 1.5);
      });
    } catch (e) {
      /* audio is a bonus: ignore any failure */
    }
  }, []);
}

/* ------------------------------------------------------------------ */
/*  6. SMALL SVG PIECES                                                */
/* ------------------------------------------------------------------ */

function SharedDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="albumWood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b97a3c" />
          <stop offset=".5" stopColor="#e3b074" />
          <stop offset="1" stopColor="#a36a33" />
        </linearGradient>
        <linearGradient id="albumSnow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#b9d0ec" />
        </linearGradient>
        <radialGradient id="albumBall" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c6d9f0" />
        </radialGradient>
        <linearGradient id="albumLeaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b9a63" />
          <stop offset="1" stopColor="#0f5a36" />
        </linearGradient>
        <linearGradient id="albumGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3bf" />
          <stop offset=".5" stopColor="#e8b84a" />
          <stop offset="1" stopColor="#b9822a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Peg() {
  return (
    <svg className="album-peg" viewBox="0 0 24 58" aria-hidden="true">
      <rect x="3" y="0" width="8.5" height="56" rx="4" fill="url(#albumWood)" stroke="#7a4a1e" strokeWidth="1" />
      <rect x="12.5" y="0" width="8.5" height="56" rx="4" fill="url(#albumWood)" stroke="#7a4a1e" strokeWidth="1" />
      <rect x="1.5" y="20" width="21" height="6" rx="3" fill="#c9ccd1" stroke="#7b8088" strokeWidth="1" />
      <path d="M12 30 V50" stroke="#7a4a1e" strokeWidth="1" opacity=".7" />
    </svg>
  );
}

function Holly() {
  return (
    <svg className="album-holly" viewBox="0 0 44 26" aria-hidden="true">
      <path d="M22 16 Q10 -2 2 10 Q10 12 14 20Z" fill="url(#albumLeaf)" stroke="#0a3b23" strokeWidth="1" />
      <path d="M22 16 Q34 -2 42 10 Q34 12 30 20Z" fill="url(#albumLeaf)" stroke="#0a3b23" strokeWidth="1" />
      <circle cx="19" cy="18" r="4.2" fill="#d4222f" stroke="#7a0f1a" strokeWidth=".8" />
      <circle cx="26" cy="18" r="4.2" fill="#d4222f" stroke="#7a0f1a" strokeWidth=".8" />
      <circle cx="22.5" cy="13" r="4.2" fill="#e02a38" stroke="#7a0f1a" strokeWidth=".8" />
      <circle cx="21" cy="11.6" r="1.2" fill="#fff" opacity=".7" />
    </svg>
  );
}

function StarTopper() {
  return (
    <svg viewBox="-30 -30 60 60" aria-hidden="true">
      <path
        d="M0 -26 L7 -8 L26 -8 L11 4 L17 23 L0 12 L-17 23 L-11 4 L-26 -8 L-7 -8Z"
        fill="url(#albumGold)"
        stroke="#9a6a1c"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M0 -26 L7 -8 L0 0Z M26 -8 L11 4 L0 0Z M17 23 L0 12 L0 0Z" fill="#fff" opacity=".28" />
    </svg>
  );
}

function SantaSleigh() {
  return (
    <svg viewBox="0 0 380 130" aria-hidden="true" style={{ display: "block", width: "100%", overflow: "visible" }}>
      {/* sparkle trail */}
      {[[8, 70, 5], [-12, 82, 3.5], [-30, 66, 4]].map(([x, y, r], i) => (
        <path
          key={i}
          d={`M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3}Z`}
          fill="#fff3bf"
          opacity={0.9 - i * 0.25}
        />
      ))}
      {/* reindeer */}
      <g>
        <path d="M255 80 Q215 90 175 92" fill="none" stroke="#d9a336" strokeWidth="2" strokeDasharray="5 3" />
        <g stroke="#5a3320" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M270 90 L256 108 L262 111" />
          <path d="M278 92 L282 112 L289 112" />
          <path d="M296 90 L312 104 L319 104" />
          <path d="M304 88 L324 98 L330 97" />
        </g>
        <ellipse cx="285" cy="78" rx="34" ry="15" fill="#7a4a2a" />
        <ellipse cx="285" cy="86" rx="26" ry="7" fill="#c89a6a" />
        <path d="M308 70 L322 52 L332 58 L316 80Z" fill="#7a4a2a" />
        <ellipse cx="334" cy="52" rx="13" ry="10" fill="#8a5632" transform="rotate(-15 334 52)" />
        <ellipse cx="346" cy="57" rx="8" ry="6" fill="#a06a40" />
        <circle cx="353" cy="57" r="8" fill="#ff3030" opacity=".35" />
        <circle cx="353" cy="57" r="4.6" fill="#ff3b30" />
        <circle cx="337" cy="50" r="1.8" fill="#111" />
        <path d="M327 44 L320 35 L332 42Z" fill="#7a4a2a" />
        <path d="M332 42 L328 24 M328 24 L320 20 M329 30 L336 22 M324 36 L316 33" stroke="#4a2a18" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="252" cy="72" r="5" fill="#f3e6d3" />
        <circle cx="300" cy="64" r="3" fill="#e8b84a" />
      </g>
      {/* sleigh */}
      <path d="M36 118 H176 Q196 118 198 100" fill="none" stroke="url(#albumGold)" strokeWidth="5" strokeLinecap="round" />
      <path d="M70 118 V104 M140 118 V104" stroke="url(#albumGold)" strokeWidth="4" strokeLinecap="round" />
      <path d="M54 66 Q44 40 74 38 Q98 40 92 66Z" fill="#8a5a30" stroke="#5a3a1a" strokeWidth="1.5" />
      <rect x="80" y="26" width="15" height="15" rx="2" fill="#2a6fd1" />
      <path d="M87.5 26 V41 M80 33.5 H95" stroke="#e8b84a" strokeWidth="2" />
      <path d="M44 70 Q40 96 62 104 H150 Q176 102 190 80 Q182 76 176 82 H72 Q60 80 56 66Z" fill="#c8202e" stroke="#7a0f1a" strokeWidth="2" />
      <path d="M52 92 Q100 108 170 92" fill="none" stroke="url(#albumGold)" strokeWidth="2.5" />
      {/* Santa */}
      <path d="M146 62 Q200 66 256 80" fill="none" stroke="#7a0f1a" strokeWidth="1.6" />
      <ellipse cx="128" cy="64" rx="20" ry="18" fill="#d4222f" />
      <rect x="110" y="68" width="36" height="5" fill="#222" />
      <rect x="123" y="66.5" width="9" height="8" rx="1" fill="url(#albumGold)" />
      <circle cx="130" cy="40" r="11" fill="#f7cfae" />
      <path d="M120 42 Q130 68 142 42 Q130 50 120 42Z" fill="#fff" />
      <circle cx="126" cy="38" r="1.3" fill="#222" />
      <circle cx="134" cy="38" r="1.3" fill="#222" />
      <path d="M118 36 Q130 6 150 24 L142 36Z" fill="#d4222f" />
      <ellipse cx="130" cy="36" rx="14" ry="4" fill="#fff" />
      <circle cx="150" cy="25" r="5" fill="#fff" />
    </svg>
  );
}

function Snowman() {
  return (
    <svg viewBox="0 0 100 140" aria-hidden="true" style={{ display: "block", width: "100%" }}>
      <ellipse cx="50" cy="136" rx="36" ry="4" fill="#0a1c34" opacity=".35" />
      <circle cx="50" cy="104" r="30" fill="url(#albumBall)" />
      <circle cx="50" cy="64" r="22" fill="url(#albumBall)" />
      <circle cx="50" cy="32" r="16" fill="url(#albumBall)" />
      <path d="M32 62 L8 48 M8 48 L4 40 M8 48 L2 51 M68 62 L92 48 M92 48 L96 40 M92 48 L98 51" stroke="#5a3a1a" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="35" y="8" width="30" height="13" rx="2" fill="#1d1d1d" />
      <rect x="29" y="19" width="42" height="4" rx="2" fill="#1d1d1d" />
      <rect x="35" y="14" width="30" height="4" fill="#c8202e" />
      <circle cx="44" cy="28" r="2" fill="#111" />
      <circle cx="56" cy="28" r="2" fill="#111" />
      <path d="M50 32 L68 36 L50 38Z" fill="#ff8a2a" />
      {[[42, 40], [46, 42.5], [54, 42.5], [58, 40]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="1.2" fill="#111" />
      ))}
      <path d="M34 46 Q50 58 66 46 L68 54 Q50 66 32 54Z" fill="#c8202e" />
      <path d="M58 56 L68 82 L58 80Z" fill="#a3121f" />
      {[66, 84, 100].map((y) => (
        <circle key={y} cx="50" cy={y} r="2.6" fill="#222" />
      ))}
    </svg>
  );
}

function Bow({ x, y, fill }) {
  return (
    <g>
      <ellipse cx={x - 7} cy={y} rx="8" ry="5" fill={fill} stroke="#00000033" />
      <ellipse cx={x + 7} cy={y} rx="8" ry="5" fill={fill} stroke="#00000033" />
      <circle cx={x} cy={y + 1} r="3.5" fill={fill} stroke="#00000044" />
    </g>
  );
}

function Gifts() {
  return (
    <svg viewBox="0 0 160 110" aria-hidden="true" style={{ display: "block", width: "100%" }}>
      <ellipse cx="80" cy="106" rx="72" ry="5" fill="#0a1c34" opacity=".3" />
      {/* big red box */}
      <rect x="10" y="50" width="72" height="56" rx="3" fill="#c8202e" />
      <rect x="10" y="50" width="72" height="9" fill="#a3121f" />
      <rect x="40" y="50" width="12" height="56" fill="url(#albumGold)" />
      <Bow x={46} y={48} fill="#e8b84a" />
      {/* small blue box on top */}
      <rect x="26" y="22" width="40" height="28" rx="2" fill="#2a6fd1" />
      <rect x="42" y="22" width="8" height="28" fill="url(#albumGold)" />
      <Bow x={46} y={20} fill="#e8b84a" />
      {/* green box */}
      <rect x="88" y="64" width="58" height="42" rx="3" fill="#1f7a4d" />
      <rect x="88" y="64" width="58" height="8" fill="#0f5a36" />
      <rect x="110" y="64" width="10" height="42" fill="#d4222f" />
      <Bow x={115} y={62} fill="#d4222f" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  7. SCENE PIECES                                                    */
/* ------------------------------------------------------------------ */

function Snow() {
  const flakes = useMemo(() => {
    const rand = seeded(7);
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: rand() * 4 + 2,
      duration: rand() * 7 + 9,
      delay: -rand() * 14,
    }));
  }, []);
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="album-flake"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: f.size,
            height: f.size,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function Wire() {
  const d = `M0 ${WIRE.y0} Q50 ${WIRE.y0 + 2 * WIRE.sag} 100 ${WIRE.y0}`;
  return (
    <svg className="album-wire" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill="none" stroke="#10261c" strokeWidth="4" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke="#d9b36a" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Ground() {
  return (
    <svg className="album-ground" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 8 Q12 2 26 6 T52 5 T78 7 T100 4 V20 H0Z" fill="#e6f0fb" opacity=".7" />
      <path d="M0 11 Q14 6 30 10 T58 9 T84 11 T100 8 V20 H0Z" fill="url(#albumSnow)" />
    </svg>
  );
}

function Burst({ x, y, kind }) {
  const parts = useMemo(() => {
    const count = kind === "bulb" ? 7 : 14;
    const reach = kind === "bulb" ? 38 : 76;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + (i % 2 ? 0.25 : 0);
      const dist = reach + ((i * 17) % 34);
      return {
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 18,
        size: 7 + ((i * 5) % 9),
        color: SPARK_COLORS[i % SPARK_COLORS.length],
        rot: (i * 47) % 360,
        shape: i % 3 === 0 ? "dot" : "star",
      };
    });
  }, [kind]);

  return (
    <span className="album-burst" style={{ left: `${x}%`, top: `${y}%` }}>
      {parts.map((p, i) => (
        <i
          key={i}
          className={p.shape}
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`,
            "--r": `${p.rot}deg`,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
          }}
        />
      ))}
    </span>
  );
}

function Polaroid({ photo, index, focused, dimmed, onToggle }) {
  const x = PHOTO_X[index];
  return (
    <div className="album-hang" style={{ left: `${x}%`, top: `${wireY(x)}%`, zIndex: focused ? 40 : 10 }}>
      <div
        className="album-swing"
        data-focused={focused}
        style={{ "--dur": `${5.2 + index * 0.8}s`, "--delay": `${-index * 1.4}s` }}
      >
        <button
          type="button"
          className="album-card"
          data-focused={focused}
          data-dimmed={dimmed}
          aria-pressed={focused}
          aria-label={`${photo.title}. ${photo.caption}`}
          style={{
            "--tilt": `${TILTS[index]}deg`,
            "--dx": 50 - x,
            "--dy": wireY(50) - wireY(x),
          }}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(photo.id, e);
          }}
        >
          <Peg />
          <span className="album-paper">
            <span className="album-photo">
              {photo.src ? (
                <img src={photo.src} alt="" draggable={false} />
              ) : (
                <span className="album-ph">
                  <b aria-hidden="true">🎄</b>
                  {TEXTS.placeholder}
                </span>
              )}
              <span className="album-sheen" />
            </span>
            <span className="album-caption">
              <Holly />
              <strong>{photo.title}</strong>
              <span className="album-text">{photo.caption}</span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  8. PAGE                                                            */
/* ------------------------------------------------------------------ */

export default function PhotoGallery() {
  const [focusedId, setFocusedId] = useState(null);
  const [viewed, setViewed] = useState([]);
  const [bursts, setBursts] = useState([]);
  const [poppedBulb, setPoppedBulb] = useState(null);
  const [santaOn, setSantaOn] = useState(false);
  const [phrase, setPhrase] = useState(null);
  const [hop, setHop] = useState(0);

  const stageRef = useRef(null);
  const timers = useRef([]);
  const burstId = useRef(0);
  const phraseIndex = useRef(0);
  const rewarded = useRef(false);
  const ringBell = useBell();

  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Esc closes the zoomed photo
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setFocusedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const spawnBurst = useCallback(
    (x, y, kind) => {
      const id = ++burstId.current;
      setBursts((prev) => [...prev, { id, x, y, kind }]);
      later(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 1000);
    },
    [later]
  );

  // Convert a pointer event into % of the stage
  const toStagePercent = (e) => {
    const rect = stageRef.current.getBoundingClientRect();
    return [((e.clientX - rect.left) / rect.width) * 100, ((e.clientY - rect.top) / rect.height) * 100];
  };

  const launchSanta = useCallback(() => {
    setSantaOn((on) => {
      if (on) return on;
      later(() => setSantaOn(false), 7300);
      return true;
    });
  }, [later]);

  const togglePhoto = (id, e) => {
    const [x, y] = toStagePercent(e);
    if (focusedId === id) {
      setFocusedId(null);
      return;
    }
    setFocusedId(id);
    spawnBurst(x, y, "photo");
    setViewed((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Reward: once every photo has been opened, Santa flies by
  useEffect(() => {
    if (!rewarded.current && viewed.length === PHOTOS.length) {
      rewarded.current = true;
      later(launchSanta, 900);
    }
  }, [viewed, later, launchSanta]);

  const ringBulb = (e, index) => {
    e.stopPropagation();
    ringBell(BELL_NOTES[index % BELL_NOTES.length]);
    setPoppedBulb(index);
    later(() => setPoppedBulb(null), 450);
    const x = BULB_X[index];
    spawnBurst(x, wireY(x) + 2, "bulb");
  };

  const talkSnowman = (e) => {
    e.stopPropagation();
    const list = TEXTS.snowmanPhrases;
    setPhrase(list[phraseIndex.current % list.length]);
    phraseIndex.current += 1;
    setHop((h) => h + 1);
    later(() => setPhrase(null), 2400);
  };

  const allSeen = viewed.length === PHOTOS.length;
  const hint = allSeen ? TEXTS.allSeen : focusedId ? TEXTS.hintBack : TEXTS.hint;

  return (
    <div
      ref={stageRef}
      className="album-stage relative h-full min-h-[100svh] w-full max-h-full max-w-full overflow-hidden"
      onClick={() => setFocusedId(null)}
    >
      <style>{CSS}</style>
      <SharedDefs />

      <div className="album-inner">
        <Snow />
        <Ground />
        <div className="album-gifts"><Gifts /></div>

        <Wire />

        {BULB_X.map((x, i) => (
          <button
            key={x}
            type="button"
            className="album-bulb"
            data-pop={poppedBulb === i}
            aria-label={TEXTS.bulbLabel}
            style={{
              left: `${x}%`,
              top: `${wireY(x)}%`,
              "--c": BULB_COLORS[i % BULB_COLORS.length],
              "--t": `${2.2 + (i % 4) * 0.5}s`,
              "--d": `${(i % 5) * -0.5}s`,
            }}
            onClick={(e) => ringBulb(e, i)}
          >
            <i />
          </button>
        ))}

        <button
          type="button"
          className="album-star"
          aria-label={TEXTS.starLabel}
          onClick={(e) => {
            e.stopPropagation();
            launchSanta();
          }}
        >
          <StarTopper />
        </button>

        <header className="album-title">
          <span className="album-date">{TEXTS.date}</span>
          <h1>{TEXTS.title}</h1>
          <p className="album-sub">{TEXTS.subtitle}</p>
          <span className="album-hint" aria-live="polite">{hint}</span>
        </header>

        {PHOTOS.map((photo, i) => (
          <Polaroid
            key={photo.id}
            photo={photo}
            index={i}
            focused={focusedId === photo.id}
            dimmed={focusedId !== null && focusedId !== photo.id}
            onToggle={togglePhoto}
          />
        ))}

        <button
          type="button"
          className={`album-snowman ${hop % 2 ? "album-hop-a" : hop > 0 ? "album-hop-b" : ""}`}
          aria-label={TEXTS.snowmanLabel}
          onClick={talkSnowman}
        >
          <Snowman />
        </button>
        {phrase && <div className="album-bubble">{phrase}</div>}

        {bursts.map((b) => (
          <Burst key={b.id} x={b.x} y={b.y} kind={b.kind} />
        ))}

        {santaOn && (
          <div className="album-santa" aria-hidden="true">
            <div className="album-santa-bob">
              <span className="album-santa-says">{TEXTS.santaSays}</span>
              <SantaSleigh />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
