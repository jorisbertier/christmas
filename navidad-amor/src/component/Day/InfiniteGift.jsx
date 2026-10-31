import React, { useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Same game as before: click, click, click… and on the 71st click    */
/*  the real reward appears. Only the look has changed.                */
/* ------------------------------------------------------------------ */

const gifts = ["🎁", "🎀", "🎁", "🎄", "💝", "🎁", "🎁"]; // kept: each index maps to a 3D-ish clay version below
const LAST_CLICK = 71;

const VARIANTS = [
  { kind: "box", body: "#d9262f", ribbon: "#fff6e8", dots: "#ffffff", pattern: "dots" },
  { kind: "bow", body: "#d9262f", ribbon: "#d9262f" },
  { kind: "box", body: "#1f9a62", ribbon: "#f6e7c1", dots: "#f6e7c1", pattern: "stars" },
  { kind: "tree" },
  { kind: "heart" },
  { kind: "box", body: "#efd9a6", ribbon: "#8a1a2e", dots: "#d9b878", pattern: "tone" },
  { kind: "box", body: "#2f6fd0", ribbon: "#f6e7c1", dots: "#ffffff", pattern: "dots" },
];

function mix(hex, to, a) {
  const n = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const x = n(hex); const y = n(to);
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * a).toString(16).padStart(2, "0")).join("")}`;
}
const lighten = (h, a) => mix(h, "#ffffff", a);
const darken = (h, a) => mix(h, "#000000", a);
function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const HEART = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');
.ig{container-type:inline-size;position:relative;overflow:hidden;border-radius:20px;color:#fff6e4;font-family:'Cormorant Garamond',Georgia,serif;user-select:none;
  background:radial-gradient(120% 90% at 50% 20%,#1f4d3a 0%,#122b22 52%,#07130f 100%)}
.ig-glow{position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(circle at 10% 22%,rgba(255,190,100,.26) 0 7cqw,transparent 8cqw),
  radial-gradient(circle at 92% 28%,rgba(255,190,100,.22) 0 8cqw,transparent 9cqw),
  radial-gradient(circle at 86% 88%,rgba(217,54,47,.26) 0 9cqw,transparent 10cqw),
  radial-gradient(60% 45% at 50% 56%,rgba(255,214,140,.2),transparent 70%)}
.ig-flake{position:absolute;top:-4%;border-radius:50%;background:#fff;pointer-events:none;animation:ig-fall linear infinite}
@keyframes ig-fall{0%{transform:translate(0,0)}50%{transform:translate(14px,55%)}100%{transform:translate(-8px,110%)}}
.ig-lights{position:absolute;left:0;right:0;top:0;height:40px;pointer-events:none}
.ig-bulb{position:absolute;width:9px;height:12px;border-radius:50% 50% 45% 45%;animation:ig-tw 2.6s ease-in-out infinite}
@keyframes ig-tw{0%,100%{opacity:1}50%{opacity:.4}}
.ig-floor{position:absolute;left:0;right:0;bottom:0;height:22%;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(255,255,255,.1) 40%,rgba(210,225,255,.35) 100%);border-radius:50% 50% 0 0/30% 30% 0 0}
.ig-stage{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:clamp(14px,3cqw,28px)}

/* the gift */
.ig-hint{margin:0 0 clamp(4px,1.4cqw,12px);font-style:italic;font-size:clamp(15px,3.4cqw,24px);color:#f8dd86;text-shadow:0 2px 10px rgba(0,0,0,.6);animation:ig-pulse 2.4s ease-in-out infinite}
@keyframes ig-pulse{0%,100%{opacity:.7}50%{opacity:1}}
.ig-btn{position:relative;flex:0 1 auto;min-height:0;width:min(68cqw,420px);aspect-ratio:1;max-height:62%;display:flex;align-items:center;justify-content:center;padding:0;border:0;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent;outline:none}
.ig-btn:focus-visible .ig-art{filter:drop-shadow(0 0 24px #fff)}
.ig-aura{position:absolute;inset:6%;border-radius:50%;background:radial-gradient(circle,rgba(255,214,120,.55),rgba(255,214,120,0) 68%);animation:ig-aura 3s ease-in-out infinite}
@keyframes ig-aura{0%,100%{transform:scale(.92);opacity:.7}50%{transform:scale(1.06);opacity:1}}
.ig-art{position:relative;width:100%;height:100%;filter:drop-shadow(0 14px 16px rgba(0,0,0,.5));animation:ig-float 4s ease-in-out infinite;transition:transform .25s cubic-bezier(.3,1.6,.5,1)}
@keyframes ig-float{0%,100%{translate:0 0}50%{translate:0 -2%}}
.ig-btn:hover .ig-art{transform:scale(1.05)}
.ig-btn:active .ig-art{transform:scale(.92)}
.ig-pop{animation:ig-pop .6s cubic-bezier(.3,1.5,.4,1) both}
@keyframes ig-pop{0%{transform:scale(.55) rotate(-10deg)}45%{transform:scale(1.14) rotate(5deg)}70%{transform:scale(.96) rotate(-2deg)}100%{transform:scale(1) rotate(0)}}
.ig-lid{transform-box:fill-box;transform-origin:30% 100%;animation:ig-lid .6s cubic-bezier(.3,1.2,.4,1) both}
@keyframes ig-lid{0%{transform:translate(-8px,-26px) rotate(-12deg)}100%{transform:none}}
.ig-spark{position:absolute;left:50%;top:38%;width:.9em;height:.9em;margin:-.45em;pointer-events:none;background:#fff3bf;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);
  filter:drop-shadow(0 0 6px #ffd45a);animation:ig-spark .9s cubic-bezier(.15,.7,.3,1) both}
@keyframes ig-spark{0%{opacity:1;transform:translate(0,0) scale(.3)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.3) rotate(120deg)}}
.ig-count{margin-top:clamp(6px,1.6cqw,14px);display:flex;align-items:center;gap:.7em;padding:.35em 1.3em;border-radius:999px;border:1.5px dashed rgba(246,210,122,.6);background:rgba(0,0,0,.3);font-size:clamp(14px,3cqw,20px);color:#ffe9c9}
.ig-count b{font-family:'Mountains of Christmas',cursive;font-size:1.6em;line-height:1;color:#f8dd86;text-shadow:0 2px 0 rgba(58,0,12,.6)}
.ig-trail{display:flex;gap:6px;margin-top:8px;height:clamp(18px,4cqw,28px)}
.ig-trail i{display:block;width:clamp(16px,3.6cqw,26px);aspect-ratio:1;border-radius:6px;animation:ig-slide .5s cubic-bezier(.3,1.5,.5,1) both;box-shadow:inset 0 -4px 0 rgba(0,0,0,.25),0 3px 6px rgba(0,0,0,.4)}
@keyframes ig-slide{from{opacity:0;transform:translateY(-14px) scale(.4)}to{opacity:1;transform:none}}

/* reward */
.ig-win{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;max-width:560px;max-height:100%;overflow:auto;animation:ig-in 1s cubic-bezier(.2,.9,.3,1) both}
@keyframes ig-in{from{opacity:0;transform:translateY(18px) scale(.94)}to{opacity:1;transform:none}}
.ig-trophy{width:clamp(76px,20cqw,130px);filter:drop-shadow(0 0 28px rgba(255,200,90,.7));animation:ig-float 3.4s ease-in-out infinite}
.ig-h{margin:.15em 0 0;font-family:'Mountains of Christmas',cursive;font-weight:700;line-height:1;font-size:clamp(34px,9cqw,68px);background:linear-gradient(180deg,#fffbe0,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 rgba(58,0,12,.7)) drop-shadow(0 0 22px rgba(255,200,90,.35))}
.ig-row{display:flex;align-items:center;justify-content:center;gap:clamp(8px,3cqw,22px);margin:.4em 0}
.ig-row svg{width:clamp(44px,12cqw,84px)}
.ig-p{margin:.4em 0 0;font-size:clamp(15px,3.2cqw,20px);line-height:1.5;color:rgba(255,246,228,.8)}
.ig-gold{margin:.7em 0;font-style:italic;font-weight:600;font-size:clamp(20px,5cqw,32px);line-height:1.2;color:#f8dd86;text-shadow:0 2px 12px rgba(0,0,0,.5)}
.ig-card{margin:.5em 0 0;padding:.9em 1.4em;border-radius:14px;border:1.5px dashed rgba(246,210,122,.5);background:rgba(0,0,0,.25)}
.ig-end{margin:.8em 0 0;font-style:italic;font-size:clamp(17px,3.8cqw,24px);color:#ffe9c9}
.ig-conf{position:absolute;top:-20px;pointer-events:none;animation:ig-conf linear infinite}
@keyframes ig-conf{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(110cqh) rotate(720deg);opacity:.9}}
@media (prefers-reduced-motion: reduce){.ig-flake,.ig-bulb,.ig-art,.ig-aura,.ig-hint,.ig-trophy,.ig-conf,.ig-pop,.ig-lid,.ig-spark{animation:none !important}.ig-win{animation-duration:.01s}}
`;

/* ---------------- gift drawings ---------------- */

const P = (u, v) => [32 + 112 * u + 40 * v, 96 - 18 * v];

function Box({ v, id }) {
  const front = v.body; const side = darken(v.body, 0.2); const top = lighten(v.body, 0.14);
  const rib = v.ribbon; const ribSide = darken(rib, 0.16); const ribTop = lighten(rib, 0.06);
  const rim = (c) => ({ stroke: c, strokeWidth: 8, strokeLinejoin: "round" });
  const band = (u0, u1, v0, v1) => [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)].map((p) => p.join(",")).join(" ");
  const star = (x, y, r) => `M${x} ${y - r}L${x + r * 0.3} ${y - r * 0.3}L${x + r} ${y}L${x + r * 0.3} ${y + r * 0.3}L${x} ${y + r}L${x - r * 0.3} ${y + r * 0.3}L${x - r} ${y}L${x - r * 0.3} ${y - r * 0.3}Z`;
  const mark = (x, y, r, sx = 1, k) => (v.pattern === "stars" ? <path key={k} d={star(x, y, r * 1.3)} fill={v.dots} /> : <ellipse key={k} cx={x} cy={y} rx={r * sx} ry={r} fill={v.dots} opacity={v.pattern === "tone" ? 0.7 : 1} />);
  const items = [];
  [138, 164, 190, 214].forEach((y, j) => [50, 68, 110, 128].forEach((x, i) => items.push(mark(x + (j % 2 ? 9 : 0), y, 6.2, 1, `f${i}${j}`))));
  return (
    <g>
      <ellipse cx="110" cy="230" rx="86" ry="13" fill="#000" opacity=".4" />
      <path d="M138 112 L178 94 V198 Q178 208 168 212 L138 222Z" fill={side} {...rim(side)} />
      <rect x="38" y="112" width="100" height="110" rx="16" fill={front} {...rim(front)} />
      <clipPath id={`c-${id}`}><rect x="38" y="112" width="100" height="110" rx="16" /></clipPath>
      <g clipPath={`url(#c-${id})`}>{items}</g>
      <rect x="79" y="112" width="18" height="110" fill={rib} />
      <polygon points="154.8,104.4 161.2,101.6 161.2,211.6 154.8,214.4" fill={ribSide} />
      <rect x="38" y="112" width="100" height="110" rx="16" fill={`url(#sh-${id})`} />
      <g className="ig-lid">
        <path d="M144 96 L184 78 V108 Q184 116 176 119 L144 126Z" fill={side} {...rim(side)} />
        <rect x="32" y="96" width="112" height="30" rx="13" fill={front} {...rim(front)} />
        <polygon points={`${P(0, 0)},${P(1, 0)},${P(1, 1)},${P(0, 1)}`} fill={top} {...rim(top)} />
        <polygon points={band(0, 1, 0.42, 0.58)} fill={ribTop} /><polygon points={band(0.42, 0.58, 0, 1)} fill={ribTop} />
        <rect x="79" y="96" width="18" height="30" fill={rib} /><polygon points="160.8,88.4 167.2,85.6 167.2,115.6 160.8,118.4" fill={ribSide} />
        <rect x="32" y="96" width="112" height="30" rx="13" fill={`url(#sh-${id})`} opacity=".8" />
        <Bow rib={rib} x={108} y={80} />
      </g>
    </g>
  );
}

function Bow({ rib, x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-8 14 Q-24 40 -42 38 Q-30 22 -14 12Z" fill={darken(rib, 0.1)} stroke={darken(rib, 0.1)} strokeWidth="5" strokeLinejoin="round" />
      <path d="M8 14 Q24 40 42 38 Q30 22 14 12Z" fill={darken(rib, 0.1)} stroke={darken(rib, 0.1)} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-4 0 Q-24 -34 -52 -14 Q-60 6 -34 10 Q-14 12 -4 4Z" fill={rib} stroke={rib} strokeWidth="6" strokeLinejoin="round" />
      <path d="M4 0 Q24 -34 52 -14 Q60 6 34 10 Q14 12 4 4Z" fill={rib} stroke={rib} strokeWidth="6" strokeLinejoin="round" />
      <path d="M-8 -2 Q-26 -22 -46 -10" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="0" cy="3" rx="13" ry="11" fill={darken(rib, 0.06)} stroke={darken(rib, 0.06)} strokeWidth="4" />
      <ellipse cx="-3" cy="0" rx="5" ry="3.4" fill="#fff" opacity=".5" />
    </g>
  );
}

function Tree() {
  const tiers = [[96, 60, 150], [66, 46, 112], [40, 34, 78]];
  return (
    <g>
      <ellipse cx="110" cy="230" rx="80" ry="12" fill="#000" opacity=".4" />
      <rect x="92" y="196" width="36" height="30" rx="8" fill="#8a4a22" stroke="#8a4a22" strokeWidth="5" strokeLinejoin="round" />
      {tiers.map(([top, hw, bot], i) => (
        <g key={i}>
          <path d={`M110 ${top} Q${110 + hw * 0.5} ${top + (bot - top) * 0.5} ${110 + hw} ${bot} Q${110 + hw / 2} ${bot + 16} 110 ${bot + 6} Q${110 - hw / 2} ${bot + 16} ${110 - hw} ${bot} Q${110 - hw * 0.5} ${top + (bot - top) * 0.5} 110 ${top}Z`} fill={i === 1 ? "#2f9a52" : "#237a40"} stroke={i === 1 ? "#2f9a52" : "#237a40"} strokeWidth="6" strokeLinejoin="round" />
        </g>
      ))}
      <path d="M44 150Q110 186 176 150" fill="none" stroke="#f6e7c1" strokeWidth="7" strokeLinecap="round" />
      <path d="M62 112Q110 140 158 112" fill="none" stroke="#f6e7c1" strokeWidth="6" strokeLinecap="round" />
      {[[80, 130, "#d9262f"], [140, 134, "#f2b632"], [100, 170, "#f2b632"], [132, 176, "#d9262f"], [74, 188, "#d9262f"], [150, 192, "#f2b632"]].map(([x, y, c], i) => <g key={i}><circle cx={x} cy={y} r="9" fill={c} /><circle cx={x - 3} cy={y - 3} r="2.6" fill="#fff" opacity=".7" /></g>)}
      <path d="M110 70L116 84L132 84L119 93L124 108L110 98L96 108L101 93L88 84L104 84Z" fill="#f2b632" stroke="#f2b632" strokeWidth="5" strokeLinejoin="round" />
    </g>
  );
}

function HeartGift() {
  return (
    <g>
      <ellipse cx="110" cy="230" rx="76" ry="12" fill="#000" opacity=".4" />
      <path d="M110 214C40 170 24 108 66 90C90 80 106 96 110 108C114 96 130 80 154 90C196 108 180 170 110 214Z" fill="#ff5d8f" stroke="#ff5d8f" strokeWidth="10" strokeLinejoin="round" />
      <path d="M60 104Q68 92 84 96" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="6" strokeLinecap="round" />
      <path d="M96 94Q110 140 96 206M124 94Q110 140 124 206" fill="none" stroke="#fff6e8" strokeWidth="14" strokeLinecap="round" opacity=".0" />
      <Bow rib="#f6e7c1" x={110} y={104} s={0.9} />
    </g>
  );
}

function Gift({ v, id }) {
  return (
    <svg viewBox="0 0 220 250" className="ig-art" aria-hidden="true" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`sh-${id}`} cx="35%" cy="25%" r="80%"><stop offset="0" stopColor="#fff" stopOpacity=".42" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".18" /></radialGradient>
      </defs>
      {v.kind === "box" && <Box v={v} id={id} />}
      {v.kind === "bow" && (<g><ellipse cx="110" cy="230" rx="80" ry="12" fill="#000" opacity=".4" /><Bow rib="#d9262f" x={110} y={110} s={1.7} /></g>)}
      {v.kind === "tree" && <Tree />}
      {v.kind === "heart" && <HeartGift />}
    </svg>
  );
}

function Trophy() {
  return (
    <svg viewBox="0 0 120 150" className="ig-trophy" aria-hidden="true">
      <defs><linearGradient id="igG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".5" stopColor="#e8b84a" /><stop offset="1" stopColor="#a8721f" /></linearGradient></defs>
      <ellipse cx="60" cy="144" rx="44" ry="5" fill="#000" opacity=".4" />
      <rect x="30" y="124" width="60" height="14" rx="3" fill="url(#igG)" /><rect x="22" y="134" width="76" height="8" rx="3" fill="#7a4a12" />
      <path d="M38 18H82Q84 70 60 84Q36 70 38 18Z" fill="url(#igG)" stroke="#a8721f" strokeWidth="1.4" />
      <path d="M38 28Q12 24 18 52Q26 66 44 66M82 28Q108 24 102 52Q94 66 76 66" fill="none" stroke="url(#igG)" strokeWidth="6" strokeLinecap="round" />
      <rect x="54" y="84" width="12" height="30" fill="url(#igG)" /><rect x="44" y="112" width="32" height="14" rx="3" fill="url(#igG)" />
      <path d="M60 30L64 42L77 42L67 50L71 62L60 55L49 62L53 50L43 42L56 42Z" fill="#fff3bf" />
      <path d="M44 24Q46 62 56 74" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

const MiniGift = ({ c, r }) => (
  <svg viewBox="0 0 60 60"><rect x="8" y="22" width="44" height="32" rx="7" fill={c} stroke={c} strokeWidth="4" strokeLinejoin="round" /><rect x="26" y="22" width="8" height="32" fill={r} /><path d="M30 22Q16 6 22 18Q26 22 30 22Q34 22 38 18Q44 6 30 22Z" fill={r} stroke={r} strokeWidth="3" strokeLinejoin="round" /></svg>
);

export default function InfiniteGift() {
  const [clicks, setClicks] = useState(0);
  const [gift, setGift] = useState(0);
  const [finished, setFinished] = useState(false);
  const [trail, setTrail] = useState([]);
  const burstRef = useRef(0);

  const openGift = () => {
    const next = clicks + 1;

    if (next === LAST_CLICK) {
      setFinished(true);
      return;
    }

    setClicks(next);
    burstRef.current += 1;

    setGift((prev) => {
      let nextGift;
      do {
        nextGift = Math.floor(Math.random() * gifts.length);
      } while (nextGift === prev);

      return nextGift;
    });
  };

  useEffect(() => {
    if (clicks > 0) setTrail((t) => [...t.slice(-7), { id: clicks, c: VARIANTS[gift].body || (VARIANTS[gift].kind === "heart" ? "#ff5d8f" : "#2f9a52") }]);
  }, [clicks]); // eslint-disable-line react-hooks/exhaustive-deps

  const flakes = useMemo(() => { const r = rng(5); return Array.from({ length: 30 }, (_, i) => ({ id: i, left: r() * 100, size: r() * 4 + 2, dur: r() * 7 + 9, delay: -r() * 14, o: 0.35 + r() * 0.5 })); }, []);
  const bulbs = useMemo(() => Array.from({ length: 20 }, (_, i) => ({ id: i, x: (i + 0.5) * 5, y: 8 + Math.abs(Math.sin(i * 0.8)) * 12, c: ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"][i % 5] })), []);
  const sparks = useMemo(() => { const r = rng(clicks + 3); return Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; const d = 70 + r() * 80; return { id: i, dx: Math.cos(a) * d, dy: Math.sin(a) * d - 30, s: 10 + r() * 14 }; }); }, [clicks]);
  const confetti = useMemo(() => { const r = rng(9); return Array.from({ length: 34 }, (_, i) => ({ id: i, left: r() * 100, c: ["#ffd45a", "#d9362f", "#35a35c", "#f6e7c1", "#7dd3fc", "#ff9ad5"][i % 6], dur: 4 + r() * 4, delay: -r() * 6, w: 6 + r() * 6 })); }, []);

  const v = VARIANTS[gift];

  return (
    <div className="ig relative h-full w-full max-h-full max-w-full overflow-hidden rounded-2xl text-white">
      <style>{CSS}</style>
      <div className="ig-glow" aria-hidden="true" />
      {flakes.map((f) => <span key={f.id} className="ig-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true" />)}
      <div className="ig-lights" aria-hidden="true">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}><path d={`M0 2 ${bulbs.map((b) => `L${b.x} ${b.y}`).join(" ")} L100 2`} fill="none" stroke="#e8c878" strokeOpacity=".6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" /></svg>
        {bulbs.map((b) => <span key={b.id} className="ig-bulb" style={{ left: `${b.x}%`, top: b.y * 1.2, background: b.c, boxShadow: `0 0 12px 3px ${b.c}`, animationDelay: `${(b.id % 5) * 0.4}s` }} />)}
      </div>
      <div className="ig-floor" aria-hidden="true" />

      <div className="ig-stage">
        {!finished ? (
          <>
            <p className="ig-hint">{clicks === 0 ? "Toca el regalo…" : "¡Otro más!"}</p>
            <button type="button" className="ig-btn" onClick={openGift} aria-label="Abrir el regalo">
              <span className="ig-aura" aria-hidden="true" />
              <span key={clicks} className={clicks > 0 ? "ig-pop" : ""} style={{ display: "block", width: "100%", height: "100%", position: "relative" }}>
                <Gift v={v} id={`g${gift}`} />
                {clicks > 0 && sparks.map((s) => <span key={s.id} className="ig-spark" style={{ "--dx": `${s.dx}px`, "--dy": `${s.dy}px`, fontSize: s.s }} aria-hidden="true" />)}
              </span>
            </button>
            <div className="ig-count" aria-live="polite"><span>Regalos abiertos</span><b>{clicks}</b></div>
            <div className="ig-trail" aria-hidden="true">{trail.map((t) => <i key={t.id} style={{ background: t.c }} />)}</div>
          </>
        ) : (
          <>
            {confetti.map((c) => <span key={c.id} className="ig-conf" style={{ left: `${c.left}%`, width: c.w, height: c.w * 1.5, background: c.c, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} aria-hidden="true" />)}
            <div className="ig-win">
              <Trophy />
              <h2 className="ig-h">¡Lo has conseguido!</h2>
              <div className="ig-row" aria-hidden="true">
                <MiniGift c="#d9262f" r="#fff6e8" />
                <svg viewBox="0 0 24 24" style={{ color: "#ff6f9d", filter: "drop-shadow(0 0 16px #ff6f9d)" }}><path d={HEART} fill="currentColor" /></svg>
                <MiniGift c="#1f9a62" r="#f6e7c1" />
              </div>
              <p className="ig-p">Después de tantos regalos, por fin has encontrado tu recompensa.</p>
              <p className="ig-gold">La perseverancia siempre tiene su recompensa.</p>
              <div className="ig-card"><p className="ig-p" style={{ margin: 0 }}>A veces no sabemos cuánto falta para conseguir algo maravilloso. Lo importante es seguir adelante y no rendirse.</p></div>
              <p className="ig-end">Nunca dejes de intentarlo. ❤️</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}