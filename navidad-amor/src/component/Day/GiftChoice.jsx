import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  1. CONFIGURATION — the only part you need to edit                  */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "giftChoiceFinal"; // the choice is final, even after a reload

const TEXTS = {
  title: "Choisis ton cadeau",
  subtitle: "J'en ai préparé trois… mais tu ne peux en choisir qu'un ❤️",
  pick: "Choisir ce cadeau",
  pickTouch: "Touche encore pour choisir",
  opening: "Une petite magie opère…",
  close: "Fermer la surprise",
  reopen: "Relire ma surprise",
  chosen: "Tu as fait ton choix ❤️",
};

// ✏️ colours + the surprise hidden inside each gift
const GIFTS = [
  {
    id: "red", name: "Cadeau rouge", pattern: "dots",
    body: "#d9262f", ribbon: "#ffffff", dots: "#ffffff",
    surprise: { title: "Quelques mots pour toi ❤️", message: "Même lorsque la distance nous sépare, tu gardes une place immense dans mon cœur.", signature: "Avec tout mon amour" },
  },
  {
    id: "green", name: "Cadeau vert", pattern: "stars",
    body: "#1f9a62", ribbon: "#f6e7c1", dots: "#f6e7c1",
    surprise: { title: "Un cadeau rien que pour toi 🎁", message: "Ce petit bon est une promesse : un nouveau moment ensemble, préparé avec amour.", signature: "Valable toute l'année" },
  },
  {
    id: "champagne", name: "Cadeau champagne", pattern: "tone",
    body: "#efd9a6", ribbon: "#8a1a2e", dots: "#d9b878",
    surprise: { title: "Notre petite histoire ✨", message: "Parmi tous les souvenirs que je pourrais garder, ceux que nous construisons ensemble sont les plus précieux.", signature: "À nous deux" },
  },
];

/* ------------------------------------------------------------------ */
/*  2. HELPERS                                                         */
/* ------------------------------------------------------------------ */

function mix(hex, to, amt) {
  const n = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const a = n(hex); const b = n(to);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * amt));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
const lighten = (h, a) => mix(h, "#ffffff", a);
const darken = (h, a) => mix(h, "#000000", a);

function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

function readChoice() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return GIFTS.some((g) => g.id === v) ? v : null;
  } catch (e) { return null; }
}
function saveChoice(id) {
  try { window.localStorage.setItem(STORAGE_KEY, id); } catch (e) { /* storage may be blocked */ }
}

/* ------------------------------------------------------------------ */
/*  3. STYLES                                                          */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&display=swap');

.gc-stage{container-type:size;position:relative;overflow:hidden;user-select:none;color:#fef3c7;font-family:'Cormorant Garamond',Georgia,serif;
  background:radial-gradient(120% 90% at 50% 35%,#7d1522 0%,#4a0b18 45%,#1b0710 100%)}
.gc-bokeh{position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(circle at 10% 24%,rgba(255,190,100,.32) 0 3cqw,transparent 3.6cqw),
  radial-gradient(circle at 90% 30%,rgba(255,190,100,.28) 0 4cqw,transparent 4.6cqw),
  radial-gradient(circle at 22% 78%,rgba(255,225,150,.22) 0 2cqw,transparent 2.6cqw),
  radial-gradient(circle at 80% 82%,rgba(255,225,150,.22) 0 2.6cqw,transparent 3.2cqw),
  radial-gradient(60% 45% at 50% 62%,rgba(255,200,120,.2),transparent 70%)}
.gc-floor{position:absolute;left:0;right:0;bottom:0;height:24cqh;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(20,4,10,.65) 60%,rgba(10,2,6,.9))}
.gc-flake{position:absolute;top:-4%;border-radius:50%;background:rgba(255,255,255,.85);pointer-events:none;animation:gc-fall linear infinite}
@keyframes gc-fall{0%{transform:translate(0,0)}50%{transform:translate(14px,55cqh)}100%{transform:translate(-8px,108cqh)}}
.gc-lights{position:absolute;left:0;right:0;top:0;height:7cqh;pointer-events:none}
.gc-bulb{position:absolute;width:1.2cqw;min-width:9px;aspect-ratio:.75;border-radius:50% 50% 45% 45%;animation:gc-tw 2.4s ease-in-out infinite}
@keyframes gc-tw{0%,100%{opacity:1}50%{opacity:.4}}

.gc-head{position:absolute;left:0;right:0;top:9cqh;z-index:5;text-align:center;padding:0 5cqw;pointer-events:none}
.gc-title{margin:0;font-style:italic;font-weight:700;line-height:1.05;font-size:clamp(30px,min(6.4cqw,10cqh),82px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 2px 0 rgba(58,0,12,.6)) drop-shadow(0 0 18px rgba(255,200,90,.3));animation:gc-rise 1s cubic-bezier(.2,.9,.3,1) both}
.gc-sub{margin:.4em 0 0;font-style:italic;color:#ffe9c9;font-size:clamp(16px,min(2.6cqw,4cqh),32px);text-shadow:0 2px 10px rgba(0,0,0,.6);animation:gc-rise 1s cubic-bezier(.2,.9,.3,1) .3s both}
@keyframes gc-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}

/* the three slots */
.gc-row{position:absolute;left:50%;bottom:9cqh;transform:translateX(-50%);width:min(94cqw,1080px);display:grid;grid-template-columns:repeat(3,1fr);align-items:end;z-index:4;--W:min(94cqw,1080px)}
.gc-slot{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:0;border:0;background:none;cursor:pointer;color:inherit;font:inherit;
  -webkit-tap-highlight-color:transparent;outline:none;transition:transform 1.2s cubic-bezier(.3,.9,.3,1),opacity .9s ease,filter .6s ease}
.gc-slot:focus-visible .gc-art{filter:drop-shadow(0 0 22px #fff)}
.gc-pop{animation:gc-pop 1s cubic-bezier(.25,1.3,.4,1) both;animation-delay:var(--d,0s)}
@keyframes gc-pop{0%{opacity:0;transform:translateY(-70cqh) scale(.6)}55%{opacity:1;transform:translateY(0) scale(1.06,.92)}75%{transform:scale(.98,1.04)}100%{opacity:1;transform:none}}
.gc-art{position:relative;height:clamp(130px,min(46cqh,30cqw * 1.14),460px);aspect-ratio:220/250;transition:transform .5s cubic-bezier(.3,1.4,.4,1),filter .5s ease;
  animation:gc-float 4.2s ease-in-out infinite;animation-delay:var(--f,0s);filter:drop-shadow(0 10px 14px rgba(0,0,0,.45))}
@keyframes gc-float{0%,100%{translate:0 0}50%{translate:0 -1.4cqh}}
.gc-slot[data-active="true"] .gc-art{transform:translateY(-2.2cqh) scale(1.07);filter:drop-shadow(0 14px 20px rgba(0,0,0,.45)) drop-shadow(0 0 26px rgba(255,214,120,.8))}
.gc-label{position:absolute;top:-1.5cqh;left:50%;translate:-50% 0;white-space:nowrap;padding:.3em 1.1em;border-radius:999px;border:1px solid rgba(253,230,138,.8);background:rgba(58,10,18,.92);
  color:#ffe9b0;font-weight:700;font-style:italic;font-size:clamp(14px,min(2cqw,3.2cqh),24px);opacity:0;transform:translateY(8px);transition:all .3s ease;pointer-events:none;box-shadow:0 6px 18px rgba(0,0,0,.5)}
.gc-slot[data-active="true"] .gc-label{opacity:1;transform:none}

/* selection: the chosen one comes to the middle, the others melt away */
.gc-row[data-choice]{pointer-events:none}
.gc-slot.is-other{opacity:0;transform:scale(.55) translateY(4cqh);filter:blur(3px)}
.gc-slot.is-chosen[data-i="0"]{transform:translateX(calc(var(--W) / 3)) scale(1.28)}
.gc-slot.is-chosen[data-i="2"]{transform:translateX(calc(var(--W) / -3)) scale(1.28)}
.gc-slot.is-chosen[data-i="1"]{transform:scale(1.28)}
.gc-slot.is-chosen .gc-art{animation:none}
.gc-row[data-instant] .gc-slot,.gc-row[data-instant] .gc-lid{transition-duration:.01s}

/* lid + light */
.gc-lid{transform-box:fill-box;transform-origin:30% 100%;transition:transform 1.4s cubic-bezier(.3,.9,.3,1) 1.1s}
.is-open .gc-lid{transform:translate(-26px,-72px) rotate(-17deg)}
.gc-inner,.gc-beam{opacity:0;transition:opacity 1.2s ease 1.4s}
.is-open .gc-inner{opacity:1}
.is-open .gc-beam{opacity:.85;animation:gc-beam 3s ease-in-out 2.4s infinite}
@keyframes gc-beam{0%,100%{opacity:.7}50%{opacity:1}}
.gc-spark{position:absolute;left:50%;top:30%;width:.9em;height:.9em;margin:-.45em;pointer-events:none;opacity:0;
  background:#fff3bf;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);filter:drop-shadow(0 0 6px #ffd45a)}
.is-open .gc-spark{animation:gc-spark 2.2s cubic-bezier(.15,.7,.3,1) forwards;animation-delay:calc(1.7s + var(--sd,0s))}
@keyframes gc-spark{0%{opacity:1;transform:translate(0,0) scale(.3)}70%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.2) rotate(120deg)}}

/* card */
.gc-veil{position:absolute;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:3cqh 4cqw;background:rgba(10,2,8,.55);backdrop-filter:blur(2px);animation:gc-fade .6s ease both}
@keyframes gc-fade{from{opacity:0}to{opacity:1}}
.gc-card{position:relative;width:min(100%,560px);max-height:100%;overflow:auto;text-align:center;border-radius:14px;padding:clamp(18px,4cqh,40px) clamp(18px,4cqw,44px);color:#3b2410;
  background:radial-gradient(120% 100% at 30% 10%,#fbefd3,#f1dcb0 60%,#e5c98f);box-shadow:inset 0 0 60px rgba(150,100,40,.35),0 24px 60px rgba(0,0,0,.6);animation:gc-card .9s cubic-bezier(.2,.9,.3,1) both}
@keyframes gc-card{from{opacity:0;transform:translateY(26px) scale(.93)}to{opacity:1;transform:none}}
.gc-card h2{margin:0;font-style:italic;font-weight:700;color:#7a1426;font-size:clamp(24px,min(4.4cqw,7cqh),44px)}
.gc-card p{margin:.7em 0 0;font-style:italic;line-height:1.45;font-size:clamp(17px,min(2.6cqw,4cqh),28px)}
.gc-card .sig{font-family:'Caveat',cursive;font-weight:700;font-style:normal;color:#7a1426;font-size:clamp(22px,min(3.2cqw,5cqh),36px);text-align:right}
.gc-btn{margin-top:1.1em;padding:.45em 1.6em;border:0;border-radius:999px;cursor:pointer;font-family:inherit;font-weight:700;color:#5a0f19;font-size:clamp(16px,min(2.2cqw,3.4cqh),26px);
  background:linear-gradient(180deg,#fff3bf,#e8b84a 55%,#c98a1e);box-shadow:0 4px 0 #8a5a12,0 10px 24px rgba(0,0,0,.4)}
.gc-btn:hover{filter:brightness(1.06)}.gc-btn:focus-visible{outline:3px solid #fff;outline-offset:3px}
.gc-foot{position:absolute;left:0;right:0;bottom:2.4cqh;z-index:6;display:flex;flex-direction:column;align-items:center;gap:.5em;text-align:center;padding:0 4cqw;animation:gc-rise 1s ease both}
.gc-foot p{margin:0;font-style:italic;font-size:clamp(16px,min(2.4cqw,3.8cqh),30px);text-shadow:0 2px 10px rgba(0,0,0,.7)}
.gc-heart{position:absolute;pointer-events:none;color:#ff8fa3;animation:gc-heart 6s ease-in infinite}
@keyframes gc-heart{0%{transform:translateY(0);opacity:0}15%{opacity:.8}100%{transform:translateY(-90px);opacity:0}}

@media (prefers-reduced-motion: reduce){
  .gc-flake,.gc-bulb,.gc-art,.gc-pop,.gc-heart,.is-open .gc-beam{animation:none !important}
  .gc-slot,.gc-lid,.gc-inner,.gc-beam{transition-duration:.01s !important;transition-delay:0s !important}
}
`;

/* ------------------------------------------------------------------ */
/*  4. THE GIFT (SVG, clay style: soft shapes, puffy bow)              */
/* ------------------------------------------------------------------ */

// point on the top face: A(32,96) front-left, B(144,96) front-right, D(72,78) back-left
const P = (u, v) => [32 + 112 * u + 40 * v, 96 - 18 * v];

function Pattern({ g, base }) {
  const items = [];
  const col = g.dots;
  // front face grid, side face and lid top
  const xs = [50, 68, 110, 128];
  const ys = [138, 164, 190, 214];
  const star = (x, y, r) => `M${x} ${y - r}L${x + r * 0.3} ${y - r * 0.3}L${x + r} ${y}L${x + r * 0.3} ${y + r * 0.3}L${x} ${y + r}L${x - r * 0.3} ${y + r * 0.3}L${x - r} ${y}L${x - r * 0.3} ${y - r * 0.3}Z`;
  const mark = (x, y, r, sx = 1, key) =>
    g.pattern === "stars" ? <path key={key} d={star(x, y, r * 1.3)} fill={col} opacity=".95" transform={sx !== 1 ? `translate(${x} ${y}) scale(${sx} 1) translate(${-x} ${-y})` : undefined} />
      : <ellipse key={key} cx={x} cy={y} rx={r * sx} ry={r} fill={col} opacity={g.pattern === "tone" ? 0.7 : 1} />;
  ys.forEach((y, j) => xs.forEach((x, i) => items.push(mark(x + (j % 2 ? 9 : 0), y, 6.2, 1, `f${i}${j}`))));
  [0.2, 0.5, 0.8].forEach((u, i) => [0.3, 0.62, 0.92].forEach((v, j) => {
    const x = 138 + 40 * u; const y = 112 + 110 * v - 18 * u;
    if (!(u === 0.5)) items.push(mark(x, y, 5, 0.65, `s${i}${j}`));
  }));
  return <g>{items}</g>;
}

function GiftSvg({ g, uid }) {
  const body = g.body;
  const front = body; const side = darken(body, 0.2); const top = lighten(body, 0.14); const inner = "#ffe9a8";
  const rib = g.ribbon; const ribSide = darken(rib, 0.16); const ribTop = lighten(rib, 0.06);
  const band = (u0, u1, v0, v1) => [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)].map((p) => p.join(",")).join(" ");
  const clip = `gc-clip-${uid}`;
  const rimStroke = (c) => ({ stroke: c, strokeWidth: 8, strokeLinejoin: "round" });
  return (
    <svg viewBox="0 0 220 250" className="gc-art" role="img" aria-hidden="true" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`sh-${uid}`} cx="35%" cy="25%" r="80%"><stop offset="0" stopColor="#fff" stopOpacity=".42" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".18" /></radialGradient>
        <linearGradient id={`beam-${uid}`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fff3bf" stopOpacity=".95" /><stop offset="1" stopColor="#fff3bf" stopOpacity="0" /></linearGradient>
        <radialGradient id={`in-${uid}`} cx="50%" cy="50%" r="60%"><stop offset="0" stopColor="#fff" /><stop offset=".5" stopColor={inner} /><stop offset="1" stopColor="#e8a83a" /></radialGradient>
        <clipPath id={clip}><rect x="38" y="112" width="100" height="110" rx="14" /></clipPath>
      </defs>
      <ellipse cx="110" cy="230" rx="86" ry="13" fill="#000" opacity=".4" />

      {/* light escaping */}
      <polygon className="gc-beam" points="84,96 160,86 214,-70 24,-70" fill={`url(#beam-${uid})`} style={{ mixBlendMode: "screen" }} />

      {/* body: front + side */}
      <path d="M138 112 L178 94 V198 Q178 208 168 212 L138 222Z" fill={side} {...rimStroke(side)} />
      <rect x="38" y="112" width="100" height="110" rx="16" fill={front} {...rimStroke(front)} />
      <g clipPath={`url(#${clip})`}><Pattern g={g} base={body} /></g>
      <Pattern g={{ ...g, pattern: g.pattern }} base={body} />
      <rect x="79" y="112" width="18" height="110" fill={rib} />
      <polygon points={`${P(0, 0)[0] + 0},0`} fill="none" />
      <polygon points="154.8,104.4 161.2,101.6 161.2,211.6 154.8,214.4" fill={ribSide} />
      <rect x="38" y="112" width="100" height="110" rx="16" fill={`url(#sh-${uid})`} />
      {/* inside of the box (visible once the lid is gone) */}
      <polygon className="gc-inner" points="42,112 138,112 178,94 80,94" fill={`url(#in-${uid})`} />

      {/* lid group */}
      <g className="gc-lid">
        <path d="M144 96 L184 78 V108 Q184 116 176 119 L144 126Z" fill={side} {...rimStroke(side)} />
        <rect x="32" y="96" width="112" height="30" rx="13" fill={front} {...rimStroke(front)} />
        <polygon points={`${P(0, 0)},${P(1, 0)},${P(1, 1)},${P(0, 1)}`} fill={top} {...rimStroke(top)} />
        {g.pattern !== "tone" && [[0.2, 0.3], [0.8, 0.3], [0.2, 0.75], [0.8, 0.75]].map(([u, v], i) => (g.pattern === "stars"
          ? <path key={i} d={`M${P(u, v)[0]} ${P(u, v)[1] - 5}L${P(u, v)[0] + 1.6} ${P(u, v)[1] - 1.6}L${P(u, v)[0] + 5} ${P(u, v)[1]}L${P(u, v)[0] + 1.6} ${P(u, v)[1] + 1.6}L${P(u, v)[0]} ${P(u, v)[1] + 5}L${P(u, v)[0] - 1.6} ${P(u, v)[1] + 1.6}L${P(u, v)[0] - 5} ${P(u, v)[1]}L${P(u, v)[0] - 1.6} ${P(u, v)[1] - 1.6}Z`} fill={g.dots} />
          : <ellipse key={i} cx={P(u, v)[0]} cy={P(u, v)[1]} rx="6" ry="3" fill={g.dots} />))}
        {[40, 54, 108, 122].map((x) => <ellipse key={x} cx={x} cy="111" rx="5.4" ry="5.4" fill={g.dots} opacity={g.pattern === "tone" ? 0.7 : 1} />)}
        {/* ribbons on the lid */}
        <polygon points={band(0, 1, 0.42, 0.58)} fill={ribTop} />
        <polygon points={band(0.42, 0.58, 0, 1)} fill={ribTop} />
        <rect x="79" y="96" width="18" height="30" fill={rib} />
        <polygon points="160.8,88.4 167.2,85.6 167.2,115.6 160.8,118.4" fill={ribSide} />
        <rect x="32" y="96" width="112" height="30" rx="13" fill={`url(#sh-${uid})`} opacity=".8" />
        {/* puffy bow */}
        <g transform="translate(108 80)">
          <path d="M-8 14 Q-24 40 -42 38 Q-30 22 -14 12Z" fill={darken(rib, 0.1)} stroke={darken(rib, 0.1)} strokeWidth="5" strokeLinejoin="round" />
          <path d="M8 14 Q24 40 42 38 Q30 22 14 12Z" fill={darken(rib, 0.1)} stroke={darken(rib, 0.1)} strokeWidth="5" strokeLinejoin="round" />
          <path d="M-4 0 Q-24 -34 -52 -14 Q-60 6 -34 10 Q-14 12 -4 4Z" fill={rib} stroke={rib} strokeWidth="6" strokeLinejoin="round" />
          <path d="M4 0 Q24 -34 52 -14 Q60 6 34 10 Q14 12 4 4Z" fill={rib} stroke={rib} strokeWidth="6" strokeLinejoin="round" />
          <path d="M-8 -2 Q-26 -22 -46 -10" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />
          <path d="M8 -2 Q26 -22 46 -10" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="0" cy="3" rx="13" ry="11" fill={darken(rib, 0.06)} stroke={darken(rib, 0.06)} strokeWidth="4" />
          <ellipse cx="-3" cy="0" rx="5" ry="3.4" fill="#fff" opacity=".5" />
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  5. THE COMPONENT                                                   */
/* ------------------------------------------------------------------ */

export default function GiftChoice({ className = "" }) {
  const [choice, setChoice] = useState(readChoice);
  const restored = useRef(!!choice).current;
  const [stage, setStage] = useState(restored ? "done" : "choosing"); // choosing → opening → revealed → done
  const [armed, setArmed] = useState(null);
  const [hover, setHover] = useState(null);
  const lock = useRef(restored);
  const touch = useRef(false);

  const flakes = useMemo(() => { const r = rng(9); return Array.from({ length: 34 }, (_, i) => ({ id: i, left: r() * 100, size: r() * 4 + 2, dur: r() * 7 + 9, delay: -r() * 14, o: 0.4 + r() * 0.5 })); }, []);
  const bulbs = useMemo(() => Array.from({ length: 24 }, (_, i) => ({ id: i, x: (i + 0.5) * (100 / 24), c: ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc"][i % 4], y: 20 + Math.sin((i / 23) * Math.PI * 6) * 14 })), []);
  const sparks = useMemo(() => { const r = rng(4); return Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; const d = 90 + r() * 90; return { id: i, dx: Math.cos(a) * d, dy: Math.sin(a) * d - 60, sd: r() * 0.4 }; }); }, []);

  // opening → card after the lid has lifted
  useEffect(() => {
    if (stage !== "opening") return undefined;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setTimeout(() => setStage("revealed"), reduce ? 600 : 3900);
    return () => clearTimeout(id);
  }, [stage]);

  const pick = useCallback((id) => {
    if (lock.current) return; // final: ignores fast double clicks, other gifts, everything
    lock.current = true;
    saveChoice(id);
    setChoice(id);
    setArmed(null);
    setHover(null);
    setStage("opening");
  }, []);

  const onClick = (g) => {
    if (lock.current) return;
    // touch screens: first tap highlights, second tap confirms
    if (touch.current && armed !== g.id) { setArmed(g.id); return; }
    pick(g.id);
  };

  const chosen = GIFTS.find((g) => g.id === choice);
  const opened = !!choice && stage !== "choosing";

  return (
    <div className={`gc-stage relative h-full min-h-[100svh] w-full max-h-full max-w-full overflow-hidden ${className}`} onClick={(e) => { if (e.target === e.currentTarget) setArmed(null); }}>
      <style>{CSS}</style>
      <div className="gc-bokeh" aria-hidden="true" />
      {flakes.map((f) => <span key={f.id} className="gc-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true" />)}
      <div className="gc-lights" aria-hidden="true">
        <svg viewBox="0 0 100 7" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}><path d={`M0 1.4 ${bulbs.map((b) => `L${b.x} ${b.y * 0.15}`).join(" ")} L100 1.4`} fill="none" stroke="#1a2a14" strokeWidth="0.5" vectorEffect="non-scaling-stroke" /></svg>
        {bulbs.map((b) => <span key={b.id} className="gc-bulb" style={{ left: `${b.x}%`, top: `${b.y * 0.2}cqh`, background: b.c, boxShadow: `0 0 12px 3px ${b.c}`, animationDelay: `${(b.id % 5) * 0.4}s` }} />)}
      </div>

      <header className="gc-head" aria-live="polite">
        <h1 className="gc-title">{TEXTS.title}</h1>
        <p className="gc-sub">{choice ? (stage === "opening" ? TEXTS.opening : TEXTS.chosen) : TEXTS.subtitle}</p>
      </header>

      <div className="gc-floor" aria-hidden="true" />

      <div className="gc-row" data-choice={choice || undefined} data-instant={restored ? "" : undefined} role="group" aria-label={TEXTS.title}>
        {GIFTS.map((g, i) => {
          const isChosen = choice === g.id;
          const isOther = !!choice && !isChosen;
          const active = !choice && (hover === g.id || armed === g.id);
          return (
            <button
              key={g.id} type="button" data-i={i} data-active={active}
              className={`gc-slot gc-pop ${isChosen ? "is-chosen" : ""} ${isOther ? "is-other" : ""} ${isChosen && opened ? "is-open" : ""}`}
              style={{ "--d": `${0.3 + i * 0.28}s`, "--f": `${i * 0.7}s`, zIndex: isChosen ? 3 : 1 }}
              aria-label={`${g.name} : ${TEXTS.pick}`} aria-disabled={!!choice} tabIndex={choice ? -1 : 0}
              onPointerDown={(e) => { touch.current = e.pointerType === "touch"; }}
              onPointerEnter={(e) => { if (e.pointerType !== "touch" && !lock.current) setHover(g.id); }}
              onPointerLeave={() => setHover((h) => (h === g.id ? null : h))}
              onFocus={() => !lock.current && setHover(g.id)} onBlur={() => setHover((h) => (h === g.id ? null : h))}
              onClick={() => onClick(g)}
            >
              <span className="gc-label">{armed === g.id ? TEXTS.pickTouch : TEXTS.pick}</span>
              <GiftSvg g={g} uid={g.id} />
              {isChosen && sparks.map((s) => <span key={s.id} className="gc-spark" style={{ "--dx": `${s.dx}px`, "--dy": `${s.dy}px`, "--sd": `${s.sd}s` }} aria-hidden="true" />)}
            </button>
          );
        })}
      </div>

      {stage === "revealed" && chosen && (
        <div className="gc-veil" role="dialog" aria-modal="true" aria-label={chosen.surprise.title}>
          <div className="gc-card">
            {["❤", "✦", "❄", "❤"].map((h, i) => <span key={i} className="gc-heart" style={{ left: `${10 + i * 26}%`, bottom: `${8 + (i % 2) * 12}%`, animationDelay: `${i * 1.3}s`, fontSize: 16 + i * 2 }} aria-hidden="true">{h}</span>)}
            <h2>{chosen.surprise.title}</h2>
            <p>{chosen.surprise.message}</p>
            <p className="sig">{chosen.surprise.signature}</p>
            <button type="button" className="gc-btn" autoFocus onClick={() => setStage("done")}>{TEXTS.close}</button>
          </div>
        </div>
      )}

      {stage === "done" && chosen && (
        <div className="gc-foot">
          <p>{TEXTS.chosen}</p>
          <button type="button" className="gc-btn" style={{ marginTop: 0 }} onClick={() => setStage("revealed")}>{TEXTS.reopen}</button>
        </div>
      )}
    </div>
  );
}
