import React, { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  1. TEXTS (Spanish)                                                 */
/* ------------------------------------------------------------------ */

const TEXTS = {
    title: "El puebleo en miniuatura",
    empty: "Un pueblo vacío esperando la Navidad…",
    add: "Toca para descubrir",
    again: "Empezar de nuevo",
    newItem: "Nuevo:",
    done: "¡Tu pueblo navideño está completo! Feliz Navidad 🎄",
    counter: (n, total) => `${n} de ${total}`,
};

const TOTAL = 20;
const COLORS = ["#ff4d4d", "#ffd45a", "#4ade80", "#7dd3fc", "#ff8fd0"];

/* ------------------------------------------------------------------ */
/*  2. HELPERS                                                         */
/* ------------------------------------------------------------------ */

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Calls `cb(seconds)` on every animation frame. Draws one static frame if the
// user prefers reduced motion. The callback writes straight to the SVG nodes,
// so React never re-renders while things move.
function useFrame(cb) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const start = performance.now();
    ref.current(0);
    if (!reduce) {
      const loop = (now) => {
        ref.current((now - start) / 1000);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(raf);
  }, []);
}

// Snow falling over the whole stage
function useSnow(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(canvas);

    const sprite = (soft) => {
      const n = 32;
      const s = document.createElement("canvas");
      s.width = n;
      s.height = n;
      const c = s.getContext("2d");
      const g = c.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(soft ? 0.2 : 0.5, `rgba(255,255,255,${soft ? 0.65 : 1})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, n, n);
      return s;
    };
    const sharp = sprite(false);
    const soft = sprite(true);

    const r = rng(99);
    const flakes = Array.from({ length: reduce ? 50 : 150 }, () => {
      const t = r();
      const size = t < 0.62 ? 0.9 + r() * 1.3 : t < 0.92 ? 2 + r() * 1.6 : 4 + r() * 3.5;
      return {
        x: r(), y: r(), size, soft: size > 3.8,
        a: size > 3.8 ? 0.22 + r() * 0.2 : 0.55 + r() * 0.45,
        vy: 0.2 + size * 0.07, ph: r() * 6.28, fr: 0.5 + r() * 1.2, am: 0.12 + r() * 0.35,
      };
    });

    const tick = (now) => {
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);
      for (const f of flakes) {
        f.x += (Math.sin(t * f.fr + f.ph) * f.am * dt) / W;
        f.y += (f.vy * dt) / H;
        if (f.y > 1.03) {
          f.y = -0.03;
          f.x = Math.random();
        }
        const s = f.size * (f.soft ? 1.4 : 1.25);
        ctx.globalAlpha = f.a;
        ctx.drawImage(f.soft ? soft : sharp, f.x * W - s, f.y * H - s, s * 2, s * 2);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
    };
  }, [canvasRef]);
}

// Fir tier: curved sides + scalloped bottom
function tierPath(cx, top, bottom, hw, seed) {
  const r = rng(seed);
  const h = bottom - top;
  const n = Math.max(4, Math.round(hw / 8));
  const step = (2 * hw) / n;
  let d = `M${cx} ${top} C${cx + hw * 0.25} ${top + h * 0.25} ${cx + hw * 0.7} ${top + h * 0.6} ${cx + hw} ${bottom - 4}`;
  for (let i = 0; i < n; i++) {
    const x0 = cx + hw - i * step;
    const x1 = x0 - step;
    d += ` Q${((x0 + x1) / 2).toFixed(1)} ${(bottom + 6 + r() * 10).toFixed(1)} ${x1.toFixed(1)} ${(bottom - 4 + (r() - 0.5) * 5).toFixed(1)}`;
  }
  d += ` C${cx - hw * 0.7} ${top + h * 0.6} ${cx - hw * 0.25} ${top + h * 0.25} ${cx} ${top} Z`;
  return d;
}

const FIR = [[0, 46, 22], [30, 80, 36], [62, 120, 48], [96, 162, 58], [136, 206, 68]].map(
  ([t, b, hw], i) => ({ t, d: tierPath(0, t, b, hw, 11 + i * 7) })
);

const FIR_LIGHTS = (() => {
  const r = rng(5);
  return Array.from({ length: 9 }, (_, i) => {
    const y = 40 + r() * 150;
    const hw = 6 + y * 0.3;
    return [(r() * 2 - 1) * hw * 0.8, y, COLORS[i % COLORS.length], (i % 5) * 0.35];
  });
})();

/* ------------------------------------------------------------------ */
/*  3. STYLES                                                          */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&display=swap');

.vil-stage{container-type:size;position:relative;display:flex;flex-direction:column;overflow:hidden;color:#fef3c7;
  font-family:'Cormorant Garamond',Georgia,serif;user-select:none;
  background:radial-gradient(120% 90% at 50% 38%,#d21616 0%,#a30a0a 45%,#5b0303 100%)}
.vil-bokeh{position:absolute;inset:0;pointer-events:none;opacity:.9;
  background:
   radial-gradient(circle at 9% 18%,rgba(255,120,90,.5) 0 2.4cqw,transparent 2.8cqw),
   radial-gradient(circle at 21% 8%,rgba(255,90,70,.4) 0 1.4cqw,transparent 1.8cqw),
   radial-gradient(circle at 88% 14%,rgba(255,130,100,.45) 0 2.8cqw,transparent 3.2cqw),
   radial-gradient(circle at 95% 40%,rgba(255,90,70,.35) 0 1.8cqw,transparent 2.2cqw),
   radial-gradient(circle at 4% 52%,rgba(255,90,70,.35) 0 2cqw,transparent 2.4cqw),
   radial-gradient(circle at 70% 6%,rgba(255,160,120,.3) 0 1.2cqw,transparent 1.6cqw)}
.vil-snow{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:5}

.vil-head{position:relative;z-index:10;text-align:center;padding:1.8cqh 3cqw 0}
.vil-head h1{margin:0;font-style:italic;font-weight:700;line-height:1.05;font-size:clamp(20px,min(4cqw,6.2cqh),50px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 rgba(58,0,12,.55))}
.vil-scene{position:relative;flex:1;min-height:0;z-index:2}
.vil-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.vil-empty{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:6;pointer-events:none;text-align:center;
  font-family:'Caveat','Segoe Script',cursive;font-size:clamp(20px,min(3.6cqw,5.4cqh),44px);color:rgba(255,240,220,.92);
  text-shadow:0 2px 12px rgba(0,0,0,.5);animation:v-pulse 2.8s ease-in-out infinite}
.vil-foot{position:relative;z-index:10;display:flex;flex-direction:column;align-items:center;gap:.9cqh;padding:0 3cqw 2.4cqh}
.vil-toast{min-height:1.3em;margin:0;text-align:center;font-family:'Caveat','Segoe Script',cursive;font-weight:700;
  font-size:clamp(17px,min(2.8cqw,4cqh),32px);color:#ffe9b0;text-shadow:0 2px 8px rgba(0,0,0,.4);animation:v-toast .45s cubic-bezier(.3,1.5,.5,1) both}
.vil-toast.done{background:linear-gradient(90deg,#fff3bf,#e8b84a,#fff3bf,#e8b84a);background-size:200% 100%;
  -webkit-background-clip:text;background-clip:text;color:transparent;animation:v-toast .45s both,v-shimmer 3s linear infinite}
.vil-row{display:flex;align-items:center;gap:clamp(10px,2cqw,26px);flex-wrap:wrap;justify-content:center}
.vil-dots{display:flex;gap:clamp(3px,.55cqw,8px)}
.vil-dot{width:clamp(7px,1.05cqw,12px);aspect-ratio:1;border-radius:50%;border:1px solid rgba(253,230,138,.5);transition:all .4s ease}
.vil-dot[data-on="true"]{background:radial-gradient(circle at 35% 30%,#fff,#ffd45a 55%,#c98a1e);border-color:#ffe9a0;box-shadow:0 0 9px #ffd45a}
.vil-btn{display:inline-flex;align-items:center;gap:.6em;padding:.55em 1.5em;border:0;border-radius:999px;cursor:pointer;
  font-family:'Cormorant Garamond',Georgia,serif;font-weight:700;font-size:clamp(16px,min(2.4cqw,3.6cqh),28px);color:#6b0f19;
  background:linear-gradient(180deg,#fff3bf,#e8b84a 55%,#c98a1e);
  box-shadow:0 5px 0 #8a5a12,0 10px 24px rgba(0,0,0,.45),0 0 26px rgba(255,214,120,.45);transition:transform .12s ease,box-shadow .12s ease}
.vil-btn:hover{transform:translateY(-2px)}
.vil-btn:active{transform:translateY(3px);box-shadow:0 2px 0 #8a5a12,0 6px 16px rgba(0,0,0,.45)}
.vil-btn:focus-visible{outline:3px solid #fff;outline-offset:3px}
.vil-btn svg{width:1.25em;height:1.25em}

/* appearing */
.v-pop{animation:v-pop .85s cubic-bezier(.2,.9,.3,1) both}
@keyframes v-pop{0%{opacity:0;transform:translateY(-70px) scale(.5,.2)}55%{opacity:1;transform:translateY(0) scale(1.08,.92)}75%{transform:scale(.97,1.04)}100%{opacity:1;transform:none}}
.v-spark{animation:v-spark 1s cubic-bezier(.15,.7,.3,1) both}
@keyframes v-spark{0%{opacity:1;transform:translate(0,0) scale(.3) rotate(0)}70%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.2) rotate(var(--r))}}
@keyframes v-toast{0%{opacity:0;transform:translateY(10px) scale(.85)}100%{opacity:1;transform:none}}
@keyframes v-pulse{0%,100%{opacity:.75}50%{opacity:1}}
@keyframes v-shimmer{0%{background-position:0% 50%}100%{background-position:200% 50%}}

/* ambient motion */
.v-blink{animation:v-blink 1.8s ease-in-out infinite}
@keyframes v-blink{0%,100%{opacity:1}50%{opacity:.25}}
.v-lit{animation:v-flick 3.4s ease-in-out infinite}
@keyframes v-flick{0%,100%{opacity:1}45%{opacity:.82}60%{opacity:.95}}
.v-puff{opacity:0;transform-box:fill-box;transform-origin:center;animation:v-puff 3.6s ease-out infinite}
@keyframes v-puff{0%{opacity:.6;transform:translate(0,0) scale(.6)}100%{opacity:0;transform:translate(14px,-42px) scale(2.3)}}
.v-spin{animation:v-rot 80s linear infinite}
.v-spin-rev{animation:v-rot 80s linear infinite reverse}
.v-fast{animation:v-rot 2.2s linear infinite}
@keyframes v-rot{to{transform:rotate(360deg)}}
.v-twinkle{transform-box:fill-box;transform-origin:center;animation:v-twinkle 2.6s ease-in-out infinite}
@keyframes v-twinkle{0%,100%{transform:scale(1) rotate(0);opacity:1}50%{transform:scale(.82) rotate(12deg);opacity:.75}}
.v-beam{animation:v-beam 3s ease-in-out infinite}
@keyframes v-beam{0%,100%{opacity:.35}50%{opacity:.75}}
.v-sway{animation:v-sway 4.5s ease-in-out infinite alternate}
@keyframes v-sway{0%{transform:rotate(-2.2deg)}100%{transform:rotate(2.2deg)}}
.v-pray{animation:v-pray 3.2s ease-in-out infinite alternate}
@keyframes v-pray{0%{transform:scaleY(1) rotate(0)}100%{transform:scaleY(.975) rotate(1.4deg)}}
.v-graze{animation:v-graze 2.6s ease-in-out infinite}
@keyframes v-graze{0%,100%{transform:rotate(0)}40%,60%{transform:rotate(22deg)}}
.v-bell{animation:v-bell 1.6s ease-in-out infinite alternate}
@keyframes v-bell{0%{transform:rotate(-16deg)}100%{transform:rotate(16deg)}}
.v-leg{animation:v-leg .7s ease-in-out infinite alternate}
.v-leg2{animation-direction:alternate-reverse}
@keyframes v-leg{0%{transform:rotate(-26deg)}100%{transform:rotate(26deg)}}
.v-arm{animation:v-leg .7s ease-in-out infinite alternate-reverse}
.v-sing{animation:v-sing 1.2s ease-in-out infinite alternate}
@keyframes v-sing{0%{transform:rotate(-2deg)}100%{transform:rotate(2deg)}}
.v-mouth{transform-box:fill-box;transform-origin:center;animation:v-mouth .55s ease-in-out infinite alternate}
@keyframes v-mouth{0%{transform:scaleY(.25)}100%{transform:scaleY(1.1)}}
.v-note{opacity:0;animation:v-note 3.2s ease-out infinite}
@keyframes v-note{0%{opacity:0;transform:translate(0,0)}15%{opacity:1}100%{opacity:0;transform:translate(10px,-46px)}}
.v-fly{animation:v-fly 20s linear infinite}
@keyframes v-fly{0%{transform:translate(-260px,0)}55%,100%{transform:translate(1260px,-24px)}}
.v-bob{animation:v-bob 1.1s ease-in-out infinite alternate}
@keyframes v-bob{0%{transform:translateY(-3px) rotate(-1.5deg)}100%{transform:translateY(3px) rotate(1.5deg)}}
.v-ice{transform-box:fill-box;transform-origin:center;animation:v-twinkle 3s ease-in-out infinite}

@media (prefers-reduced-motion: reduce){
  .v-blink,.v-lit,.v-puff,.v-spin,.v-spin-rev,.v-fast,.v-twinkle,.v-beam,.v-sway,.v-pray,.v-graze,.v-bell,.v-leg,.v-arm,
  .v-sing,.v-mouth,.v-note,.v-bob,.v-ice,.vil-empty{animation:none !important}
  .v-fly{display:none}
  .v-pop{animation-duration:.01s}
}
`;

/* ------------------------------------------------------------------ */
/*  4. SHARED SVG DEFINITIONS                                          */
/* ------------------------------------------------------------------ */

function Defs() {
  const lin = (id, stops, x2 = 0, y2 = 1) => (
    <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
      {stops.map(([o, c], i) => (
        <stop key={i} offset={o} stopColor={c} />
      ))}
    </linearGradient>
  );
  return (
    <defs>
      <radialGradient id="vGround" cx="50%" cy="35%" r="75%">
        <stop offset="0" stopColor="#fff8f6" />
        <stop offset=".55" stopColor="#f8d9dc" />
        <stop offset="1" stopColor="#e39ba5" />
      </radialGradient>
      {lin("vPlinth", [[0, "#8a1424"], [1, "#38050c"]])}
      {lin("vFir", [[0, "#b3242f"], [1, "#4b060d"]], 1, 1)}
      {lin("vFirSnow", [[0, "#ffffff"], [0.55, "#ffd9d9"], [1, "#e8939a"]], 1, 1)}
      {lin("vRoofSnow", [[0, "#ffffff"], [0.6, "#ffe3e0"], [1, "#f0a4a8"]])}
      {lin("vLog", [[0, "#a63a24"], [1, "#4a0f0b"]])}
      {lin("vPlaster", [[0, "#fbf0e0"], [1, "#e2c7a4"]])}
      {lin("vStone", [[0, "#efe1cd"], [1, "#cdb392"]])}
      {lin("vSlate", [[0, "#54445e"], [1, "#241a2c"]])}
      {lin("vTile", [[0, "#e47c36"], [1, "#92391a"]])}
      {lin("vThatch", [[0, "#e0b85a"], [1, "#94702a"]])}
      {lin("vWood", [[0, "#a8582a"], [1, "#5a2410"]])}
      {lin("vRed", [[0, "#c8202e"], [1, "#6e0c16"]])}
      {lin("vGold", [[0, "#fff3bf"], [0.5, "#e8b84a"], [1, "#a8721f"]], 1, 1)}
      {lin("vIce", [[0, "#f6fdff"], [1, "#9acde8"]], 1, 1)}
      {lin("vGlass", [[0, "#3b6fd4"], [0.55, "#c8202e"], [1, "#f5c542"]])}
      <radialGradient id="vWin" cx="50%" cy="55%" r="60%">
        <stop offset="0" stopColor="#fff6b0" />
        <stop offset=".45" stopColor="#ffb02e" />
        <stop offset="1" stopColor="#e0481a" />
      </radialGradient>
      <radialGradient id="vGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#ffc24a" stopOpacity=".95" />
        <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="vBall" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#c6d9f0" />
      </radialGradient>
      <radialGradient id="vHalo" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#fff3b0" stopOpacity=".9" />
        <stop offset="1" stopColor="#ffd45a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="vBeam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff3b0" stopOpacity=".85" />
        <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
      </linearGradient>
      <filter id="vFlock" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="3" result="n1" />
        <feDisplacementMap in="SourceGraphic" in2="n1" scale="8" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="8" result="n2" />
        <feColorMatrix in="n2" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 11 -5.9" result="speck" />
        <feComposite in="speck" in2="d" operator="in" result="speckIn" />
        <feMerge>
          <feMergeNode in="d" />
          <feMergeNode in="speckIn" />
        </feMerge>
      </filter>
      <filter id="vBlur3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
      <filter id="vBlur8" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="8" /></filter>
    </defs>
  );
}

/* ------------------------------------------------------------------ */
/*  5. SMALL BUILDING BLOCKS                                           */
/* ------------------------------------------------------------------ */

function Smoke({ x, y, n = 3, color = "#fff" }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} className="v-puff" cx={x} cy={y} r={4 + i} fill={color} style={{ animationDelay: `${i * 1.2}s` }} />
      ))}
    </g>
  );
}

function Win({ x, y, w, h, d = 0, frame = "#2b0a07" }) {
  return (
    <g className="v-lit" style={{ animationDelay: `${d}s` }}>
      <ellipse cx={x + w / 2} cy={y + h / 2} rx={w * 1.25} ry={h * 1} fill="url(#vGlow)" opacity=".75" />
      <rect x={x - 1.6} y={y - 1.6} width={w + 3.2} height={h + 3.2} fill={frame} />
      <rect x={x} y={y} width={w} height={h} fill="url(#vWin)" />
      <path d={`M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}`} stroke={frame} strokeWidth="1.4" opacity=".85" />
    </g>
  );
}

function Shadow({ rx = 40, ry = 7, o = 0.25 }) {
  return <ellipse cx="0" cy="2" rx={rx} ry={ry} fill="#5b0a17" opacity={o} />;
}

/* ------------------------------------------------------------------ */
/*  6. THE 20 ELEMENTS                                                 */
/* ------------------------------------------------------------------ */

// 1 ── snowy firs
function Fir({ x, y, s = 1, lights = true }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(0 -206)`}>
      <ellipse cx="0" cy="206" rx="72" ry="12" fill="#fff" opacity=".92" />
      <g filter="url(#vFlock)">
        {[...FIR].reverse().map((t) => (
          <g key={t.t}>
            <path d={t.d} fill="url(#vFir)" />
            <path d={t.d} fill="url(#vFirSnow)" transform={`translate(0 ${t.t}) scale(.94 .78) translate(0 ${-t.t})`} />
          </g>
        ))}
      </g>
      {lights &&
        FIR_LIGHTS.map(([lx, ly, c, d], i) => (
          <circle key={i} className="v-blink" cx={lx} cy={ly} r="3.6" fill={c} style={{ animationDelay: `${d}s`, filter: `drop-shadow(0 0 4px ${c})` }} />
        ))}
    </g>
  );
}

// 2 ── log cabin (same cabin as the snow globe)
function Cabin({ x, y }) {
  return (
    <g transform={`translate(${x} ${y}) translate(-282 -394)`}>
      <Shadow />
      <g transform="translate(282 394)"><Shadow rx={70} ry={9} o={0.3} /></g>
      <rect x="302" y="266" width="18" height="40" fill="#7a2418" />
      <path d="M298 268 C300 254 322 254 324 268 C320 272 304 272 298 268Z" fill="url(#vRoofSnow)" />
      <rect x="226" y="340" width="112" height="54" fill="url(#vLog)" />
      {[348, 356, 364, 372, 380, 388].map((ly) => (
        <path key={ly} d={`M226 ${ly}H338`} stroke="#2a0805" strokeWidth="1.2" opacity=".55" />
      ))}
      <rect x="226" y="340" width="6" height="54" fill="#3a0c08" opacity=".7" />
      <rect x="332" y="340" width="6" height="54" fill="#3a0c08" opacity=".7" />
      <Win x={238} y={356} w={22} h={24} />
      <Win x={306} y={356} w={22} h={24} d={0.8} />
      <rect x="268" y="358" width="28" height="36" rx="2" fill="#2b0a07" />
      <rect x="270" y="360" width="24" height="34" rx="1.5" fill="url(#vWin)" className="v-lit" />
      <path d="M282 360V394M270 376H294" stroke="#4a1409" strokeWidth="1.4" />
      <path d="M206 344 H360 L356 350 H210Z" fill="#5a1410" />
      <path
        d="M204 342 C214 322 250 300 276 288 C296 280 318 284 338 304 C350 316 358 330 360 342 C352 350 344 344 336 350 C328 354 320 346 310 352 C298 358 286 350 274 354 C260 358 248 350 236 354 C222 356 214 350 204 342Z"
        fill="url(#vRoofSnow)"
      />
      <path d="M214 336 C240 312 268 298 290 292" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".8" />
      <path d="M300 318 C320 312 340 326 352 340" fill="none" stroke="#e48a92" strokeWidth="6" strokeLinecap="round" opacity=".35" />
      <Smoke x={311} y={256} />
    </g>
  );
}

// 3 ── half-timbered house + street lamp
function TimberHouse({ x, y }) {
  const beam = "#4a1d12";
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shadow rx={78} ry={9} o={0.3} />
      <rect x="-52" y="-70" width="104" height="70" fill="url(#vPlaster)" />
      <rect x="-60" y="-128" width="120" height="58" fill="url(#vPlaster)" />
      <g stroke={beam} strokeWidth="4.5" strokeLinecap="square" fill="none">
        <path d="M-52 -70V0M-26 -70V0M0 -70V0M26 -70V0M52 -70V0M-52 -36H52M-52 0H52" />
        <path d="M-52 -36L-26 -70M52 -36L26 -70" strokeWidth="3.4" />
        <path d="M-62 -70H62" strokeWidth="6" />
        <path d="M-60 -128V-70M-30 -128V-70M0 -128V-70M30 -128V-70M60 -128V-70M-60 -100H60" />
        <path d="M-60 -100L-30 -128M60 -100L30 -128M0 -128L-30 -100M0 -128L30 -100" strokeWidth="3" />
      </g>
      <Win x={-44} y={-58} w={18} h={22} />
      <Win x={26} y={-58} w={18} h={22} d={1.1} />
      <path d="M-11 0 V-26 Q0 -40 11 -26 V0Z" fill="#2b0a07" />
      <path d="M-8 0 V-25 Q0 -36 8 -25 V0Z" fill="url(#vWin)" className="v-lit" />
      <Win x={-46} y={-122} w={16} h={20} d={0.4} />
      <Win x={-8} y={-122} w={16} h={20} d={1.6} />
      <Win x={30} y={-122} w={16} h={20} d={0.9} />
      <rect x="40" y="-212" width="14" height="38" fill="#7a2418" />
      <path d="M-70 -126 H70 L0 -208Z" fill="url(#vSlate)" />
      <path
        d="M-52 -132 L0 -204 L52 -132 Q42 -124 32 -132 Q22 -124 12 -132 Q0 -122 -12 -132 Q-22 -124 -32 -132 Q-42 -124 -52 -132Z"
        fill="url(#vRoofSnow)"
      />
      <path d="M-18 -150 H18 L0 -176Z" fill="url(#vSlate)" />
      <rect x="-8" y="-166" width="16" height="16" fill="#2b0a07" />
      <rect x="-6" y="-164" width="12" height="12" fill="url(#vWin)" className="v-lit" />
      <path d="M36 -214 Q47 -222 58 -214 Q47 -208 36 -214Z" fill="#fff" />
      <Smoke x={47} y={-218} />
      {/* street lamp */}
      <g transform="translate(92 0)">
        <ellipse cx="0" cy="-60" rx="30" ry="30" fill="url(#vGlow)" className="v-beam" />
        <ellipse cx="0" cy="2" rx="22" ry="5" fill="#ffc24a" opacity=".4" />
        <rect x="-2" y="-62" width="4" height="62" fill="#1c1218" />
        <rect x="-5" y="-4" width="10" height="4" fill="#1c1218" />
        <path d="M-7 -80 H7 L5 -62 H-5Z" fill="url(#vWin)" stroke="#1c1218" strokeWidth="1.6" />
        <path d="M-9 -80 L0 -88 L9 -80Z" fill="#1c1218" />
        <path d="M-9 -81 L0 -87 L9 -81Q0 -83 -9 -81Z" fill="#fff" />
      </g>
    </g>
  );
}

// 4 ── red-roofed tower house
function TowerHouse({ x, y }) {
  const beam = "#4a1d12";
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shadow rx={52} ry={8} o={0.3} />
      <rect x="-38" y="-118" width="76" height="118" fill="url(#vPlaster)" />
      <g stroke={beam} strokeWidth="4" strokeLinecap="square" fill="none">
        <path d="M-38 -118V0M38 -118V0M0 -118V0M-38 -60H38M-38 -118H38M-38 0H38" />
        <path d="M-38 -60L0 -118M38 -60L0 -118" strokeWidth="3" />
      </g>
      <Win x={-30} y={-104} w={16} h={20} />
      <Win x={14} y={-104} w={16} h={20} d={1.2} />
      <Win x={-30} y={-52} w={16} h={20} d={0.7} />
      <Win x={14} y={-52} w={16} h={20} d={0.2} />
      <path d="M-9 0 V-20 Q0 -32 9 -20 V0Z" fill="#2b0a07" />
      <path d="M-6 0 V-19 Q0 -28 6 -19 V0Z" fill="url(#vWin)" className="v-lit" />
      <path d="M-50 -116 H50 L0 -194Z" fill="url(#vTile)" />
      {[-130, -144, -158, -172].map((ty, i) => (
        <path key={ty} d={`M${-46 + (i + 1) * 12} ${ty} H${46 - (i + 1) * 12}`} stroke="#6e2410" strokeWidth="1.4" opacity=".7" />
      ))}
      <path d="M-44 -118 L-20 -150 L-28 -118Z M44 -118 L20 -150 L28 -118Z" fill="url(#vRoofSnow)" />
      <path d="M-30 -118 Q-22 -111 -14 -118 Q-6 -111 2 -118 Q10 -111 18 -118 Q26 -111 32 -118" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <circle cx="0" cy="-196" r="3.4" fill="url(#vGold)" />
      <rect x="22" y="-186" width="12" height="26" fill="#7a2418" />
      <path d="M20 -186 Q28 -193 36 -186Z" fill="#fff" />
      <Smoke x={28} y={-192} />
    </g>
  );
}

// 5 ── ice rink (flat)
function Rink({ x, y }) {
  const marks = [
    "M-70 -4 Q-20 -18 40 -8", "M-40 8 Q10 16 70 4", "M-84 2 Q-30 -10 20 6", "M10 -12 Q55 -6 88 6",
    "M-60 12 Q-10 6 30 14", "M-20 -14 Q30 -16 70 -6",
  ];
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="3" rx="114" ry="31" fill="#5b0a17" opacity=".3" />
      <ellipse cx="0" cy="0" rx="112" ry="30" fill="#fff" />
      <ellipse cx="0" cy="1" rx="104" ry="25" fill="url(#vIce)" />
      <ellipse cx="-24" cy="-8" rx="70" ry="10" fill="#fff" opacity=".35" />
      {marks.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#fff" strokeWidth="1" opacity=".7" />
      ))}
      {[[-60, -4], [20, 10], [64, -8], [-20, 12], [84, 4], [-84, 6]].map(([sx, sy], i) => (
        <path key={i} className="v-ice" d={`M${sx} ${sy - 4}L${sx + 1.2} ${sy - 1}L${sx + 4} ${sy}L${sx + 1.2} ${sy + 1}L${sx} ${sy + 4}L${sx - 1.2} ${sy + 1}L${sx - 4} ${sy}L${sx - 1.2} ${sy - 1}Z`} fill="#fff" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
      <path d="M-112 0 A112 30 0 0 0 112 0" fill="none" stroke="#e8939a" strokeWidth="2" opacity=".5" />
    </g>
  );
}

// 6 ── skaters (moved by requestAnimationFrame)
const SKATERS = [
  { cx: 265, cy: 553, rx: 80, ry: 15, speed: 0.55, phase: 0, coat: "#2a6fd1", hat: "#c8202e", scarf: "#fff", size: 1 },
  { cx: 256, cy: 557, rx: 48, ry: 9, speed: -0.72, phase: 2, coat: "#c8202e", hat: "#fff", scarf: "#f5c542", size: 0.95 },
  { cx: 280, cy: 548, rx: 92, ry: 17, speed: 0.42, phase: 4, coat: "#f5c542", hat: "#2f8f5b", scarf: "#c8202e", size: 1.05 },
];

function Skater({ coat, hat, scarf }) {
  return (
    <g>
      <ellipse cx="0" cy="1" rx="9" ry="2.4" fill="#5b0a17" opacity=".22" />
      <path d="M-3 -10 L-6 -1M3 -10 L8 -2" stroke="#2a1a22" strokeWidth="3" strokeLinecap="round" />
      <path d="M-9 0H-2M5 0H12" stroke="#e8edf5" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M-4 -25 Q-16 -24 -20 -19" fill="none" stroke={scarf} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M-7 -11 Q-8 -24 0 -27 Q8 -24 7 -11Z" fill={coat} />
      <path d="M-5 -22 L-15 -18M5 -22 L15 -26" stroke={coat} strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="0" cy="-31.5" r="5.2" fill="#f2c9a5" />
      <path d="M-5.6 -33 Q0 -43 5.6 -33Z" fill={hat} />
      <circle cx="0" cy="-42" r="2" fill="#fff" />
      <path d="M-5 -26 H5 L4 -23 H-4Z" fill={scarf} />
    </g>
  );
}

function Skaters() {
  const refs = useRef([]);
  useFrame((t) => {
    SKATERS.forEach((s, i) => {
      const el = refs.current[i];
      if (!el) return;
      const th = s.phase + t * s.speed;
      const px = s.cx + s.rx * Math.cos(th);
      const py = s.cy + s.ry * Math.sin(th);
      const vx = -s.rx * Math.sin(th) * s.speed;
      const vy = s.ry * Math.cos(th) * s.speed;
      const face = clamp(vx / (s.rx * Math.abs(s.speed) * 0.35), -1, 1);
      const sc = s.size * (0.88 + (0.24 * (py - (s.cy - s.ry))) / (2 * s.ry));
      const lean = clamp((Math.atan2(vy, Math.abs(vx)) * 180) / Math.PI, -18, 18);
      el.setAttribute("transform", `translate(${px.toFixed(2)} ${py.toFixed(2)}) scale(${(face * sc).toFixed(3)} ${sc.toFixed(3)}) rotate(${lean.toFixed(1)})`);
    });
  });
  return (
    <g>
      {SKATERS.map((s, i) => (
        <g key={i} ref={(el) => (refs.current[i] = el)} transform="translate(-999 -999)">
          <Skater coat={s.coat} hat={s.hat} scarf={s.scarf} />
        </g>
      ))}
    </g>
  );
}

// 7 ── nativity stable
function Stable({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="2" rx="86" ry="10" fill="#fff" opacity=".9" />
      {/* star + beam */}
      <path d="M-12 -150 L-34 -76 L34 -76 L12 -150Z" fill="url(#vBeam)" className="v-beam" />
      <g transform="translate(0 -158)">
        <circle r="26" fill="url(#vHalo)" className="v-beam" />
        <path className="v-twinkle" d="M0 -17 L4 -4 L17 0 L4 4 L0 17 L-4 4 L-17 0 L-4 -4Z" fill="url(#vGold)" stroke="#fff3bf" strokeWidth="1" />
        <path className="v-twinkle" d="M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2Z" fill="#fff" transform="rotate(45)" />
      </g>
      {/* back wall + warm light */}
      <rect x="-54" y="-76" width="108" height="76" fill="#3b1a10" />
      <ellipse cx="0" cy="-26" rx="52" ry="46" fill="url(#vGlow)" className="v-lit" />
      <g stroke="#2a1008" strokeWidth="1" opacity=".5">
        {[-40, -26, -12, 2, 16, 30, 44].map((px) => (
          <path key={px} d={`M${px} -76V0`} />
        ))}
      </g>
      {/* hay + manger */}
      <ellipse cx="0" cy="-3" rx="52" ry="7" fill="#d4b25a" />
      <path d="M-40 -3 l6 -5 M-20 -2 l-5 -5 M22 -3 l6 -6 M40 -2 l-6 -5" stroke="#b9922e" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M-15 -19 L15 -19 L11 -7 L-11 -7Z" fill="url(#vWood)" stroke="#3a1608" strokeWidth="1" />
      <ellipse cx="0" cy="-19" rx="15" ry="3" fill="#d4b25a" />
      {/* ox + donkey */}
      <g>
        <ellipse cx="-36" cy="-18" rx="14" ry="10" fill="#8a6a55" />
        <path d="M-26 -22 L-20 -30 L-14 -26 L-18 -18Z" fill="#8a6a55" />
        <ellipse cx="-17" cy="-25" rx="6" ry="5" fill="#9a7a65" />
        <path d="M-22 -31 L-26 -37 M-15 -31 L-12 -37" stroke="#e8dcc8" strokeWidth="2" strokeLinecap="round" />
        <circle cx="-16" cy="-26" r="1" fill="#111" />
        <path d="M-44 -9 V0M-30 -9 V0" stroke="#6a4a3a" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g>
        <ellipse cx="38" cy="-18" rx="12" ry="9" fill="#8f8f98" />
        <path d="M29 -22 L22 -28 L19 -21 L24 -17Z" fill="#8f8f98" />
        <ellipse cx="22" cy="-22" rx="5" ry="4.4" fill="#a3a3ac" />
        <path d="M24 -26 L22 -35 L27 -28Z M20 -26 L16 -34 L23 -28Z" fill="#8f8f98" />
        <circle cx="21" cy="-23" r="1" fill="#111" />
        <path d="M32 -9 V0M44 -9 V0" stroke="#6b6b74" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* posts + thatched roof */}
      <rect x="-62" y="-80" width="9" height="80" fill="url(#vWood)" />
      <rect x="53" y="-80" width="9" height="80" fill="url(#vWood)" />
      <rect x="-60" y="-78" width="120" height="6" fill="#3a1608" />
      <path d="M-80 -70 L0 -126 L80 -70Z" fill="url(#vThatch)" />
      <g stroke="#7a5a1e" strokeWidth="1.2" opacity=".7">
        {[-56, -40, -24, -8, 8, 24, 40, 56].map((px) => (
          <path key={px} d={`M${px * 0.45} -118 L${px} -72`} />
        ))}
      </g>
      <path d="M-70 -76 L0 -122 L70 -76 Q56 -69 44 -77 Q32 -69 20 -78 Q8 -70 -4 -78 Q-18 -70 -30 -78 Q-44 -70 -56 -77 Q-64 -72 -70 -76Z" fill="url(#vRoofSnow)" />
    </g>
  );
}

// 8 ── holy family praying (stands in front of the stable)
function HolyFamily({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* baby in the manger */}
      <circle cx="0" cy="-40" r="16" fill="url(#vHalo)" className="v-beam" />
      <ellipse cx="0" cy="-38" rx="9" ry="5" fill="#f7f3ea" />
      <circle cx="0" cy="-43" r="3.6" fill="#f2c9a5" />
      <ellipse cx="0" cy="-47" rx="6" ry="1.8" fill="none" stroke="#ffd45a" strokeWidth="1.4" />
      {/* Mary */}
      <g className="v-pray" style={{ transformOrigin: "-30px 0px" }}>
        <path d="M-42 0 Q-46 -20 -36 -30 Q-31 -34 -27 -30 Q-20 -20 -16 0Z" fill="#2a5fc0" />
        <path d="M-42 0 Q-34 4 -16 0 Q-24 -6 -42 0Z" fill="#1d4590" />
        <circle cx="-31" cy="-37" r="6" fill="#f2c9a5" />
        <path d="M-38 -38 Q-31 -52 -24 -38 Q-22 -28 -26 -25 L-35 -25 Q-39 -30 -38 -38Z" fill="#f7f3ea" />
        <ellipse cx="-31" cy="-45" rx="9" ry="2.6" fill="none" stroke="#ffd45a" strokeWidth="1.5" />
        <circle cx="-23" cy="-26" r="2.6" fill="#f2c9a5" />
        <path d="M-28 -28 L-23 -26" stroke="#2a5fc0" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* Joseph */}
      <g className="v-pray" style={{ transformOrigin: "30px 0px", animationDelay: "-1.4s" }}>
        <path d="M16 0 Q20 -20 28 -30 Q33 -34 38 -30 Q44 -20 44 0Z" fill="#8a5a30" />
        <path d="M16 0 Q30 5 44 0 Q36 -6 16 0Z" fill="#5a3418" />
        <path d="M22 -22 Q30 -12 40 -22 L38 -30 Q30 -26 24 -30Z" fill="#2f8f5b" />
        <circle cx="31" cy="-37" r="6" fill="#f2c9a5" />
        <path d="M25 -39 Q31 -49 37 -39 Q36 -33 31 -30 Q26 -33 25 -39Z" fill="#5a3418" />
        <circle cx="31" cy="-38" r="5" fill="#f2c9a5" />
        <path d="M27 -36 Q31 -30 35 -36" fill="#6b4220" />
        <ellipse cx="31" cy="-45" rx="9" ry="2.6" fill="none" stroke="#ffd45a" strokeWidth="1.5" />
        <circle cx="22" cy="-26" r="2.6" fill="#f2c9a5" />
        <path d="M26 -28 L22 -26" stroke="#8a5a30" strokeWidth="3" strokeLinecap="round" />
        <path d="M48 0 L47 -50" stroke="#6a3f1a" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="47" cy="-51" r="2.4" fill="#6a3f1a" />
      </g>
    </g>
  );
}

// 9 ── shepherds and sheep
function Sheep({ x, y, d = 0, flip = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip} 1)`}>
      <ellipse cx="0" cy="1" rx="9" ry="2" fill="#5b0a17" opacity=".25" />
      <path d="M-3 -4 V0M3 -4 V0" stroke="#3a2a30" strokeWidth="2" strokeLinecap="round" />
      <g fill="#fffaf3" stroke="#e3d6cf" strokeWidth=".6">
        <circle cx="-5" cy="-9" r="5.4" />
        <circle cx="2" cy="-11" r="6" />
        <circle cx="7" cy="-8" r="5" />
        <circle cx="0" cy="-6" r="5.4" />
      </g>
      <g className="v-graze" style={{ transformOrigin: "8px -9px", animationDelay: `${d}s` }}>
        <ellipse cx="12" cy="-6" rx="3.6" ry="3.2" fill="#3a2a30" />
        <path d="M9.5 -10 L8 -13 L11 -11Z" fill="#3a2a30" />
      </g>
    </g>
  );
}

function Shepherds({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shadow rx={56} ry={7} o={0.2} />
      <Sheep x={34} y={0} d={0} />
      <Sheep x={52} y={5} d={0.9} flip={-1} />
      <Sheep x={20} y={8} d={1.7} />
      {/* standing shepherd */}
      <g className="v-sway" style={{ transformOrigin: "-18px 0px" }}>
        <path d="M-26 0 Q-27 -22 -22 -30 H-14 Q-9 -22 -10 0Z" fill="#7a4a2a" />
        <path d="M-24 -28 Q-18 -22 -12 -28 L-14 -34 H-22Z" fill="#a8723e" />
        <circle cx="-18" cy="-37" r="5.6" fill="#f2c9a5" />
        <path d="M-24 -38 Q-18 -50 -12 -38 Q-18 -42 -24 -38Z" fill="#a8723e" />
        <path d="M-6 2 L-6 -48 Q-6 -54 -1 -52" fill="none" stroke="#6a3f1a" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M-14 -22 L-8 -26" stroke="#7a4a2a" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* kneeling shepherd with a lamb */}
      <g className="v-pray" style={{ transformOrigin: "6px 0px" }}>
        <path d="M-2 0 Q-4 -14 2 -22 Q8 -26 12 -20 Q16 -12 14 0Z" fill="#2f8f5b" />
        <circle cx="8" cy="-28" r="5.4" fill="#f2c9a5" />
        <path d="M2 -29 Q8 -40 14 -29 Q8 -33 2 -29Z" fill="#6a3f1a" />
        <ellipse cx="18" cy="-12" rx="6" ry="4.6" fill="#fffaf3" stroke="#e3d6cf" strokeWidth=".6" />
        <circle cx="23" cy="-14" r="2.6" fill="#3a2a30" />
      </g>
    </g>
  );
}

// 10 ── big Ferris wheel
const GONDOLA_COLORS = ["#e0262f", "#f5c542", "#2f8f5b", "#2a6fd1"];

function FerrisWheel({ x, y }) {
  const R = 122;
  const gondolas = Array.from({ length: 8 }, (_, k) => {
    const a = (k * 45 * Math.PI) / 180;
    return { gx: R * Math.cos(a), gy: R * Math.sin(a), c: GONDOLA_COLORS[k % 4] };
  });
  const bulbs = Array.from({ length: 36 }, (_, k) => {
    const a = (k * 10 * Math.PI) / 180;
    return { bx: R * Math.cos(a), by: R * Math.sin(a), c: COLORS[k % 5], d: (k % 6) * 0.25 };
  });
  const inner = Array.from({ length: 24 }, (_, k) => {
    const a = (k * 15 * Math.PI) / 180;
    return { bx: 96 * Math.cos(a), by: 96 * Math.sin(a), c: COLORS[(k + 2) % 5], d: (k % 5) * 0.3 };
  });
  const braces = [0.18, 0.36, 0.54, 0.72, 0.88];
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shadow rx={108} ry={9} o={0.3} />
      {/* A-frame legs */}
      <g strokeLinecap="round" fill="none">
        <path d="M-60 -38 L-6 -172 M60 -38 L6 -172" stroke="#6e1a12" strokeWidth="11" />
        <path d="M-60 -38 L-6 -172 M60 -38 L6 -172" stroke="url(#vGold)" strokeWidth="2.2" opacity=".85" />
        {braces.map((t, i) => {
          const lx = -60 + 54 * t;
          const ly = -38 - 134 * t;
          const nt = braces[i + 1];
          return (
            <g key={t} stroke="#a8321e" strokeWidth="3">
              <path d={`M${lx} ${ly}H${-lx}`} />
              {nt && <path d={`M${lx} ${ly}L${60 - 54 * nt} ${-38 - 134 * nt}M${-lx} ${ly}L${-60 + 54 * nt} ${-38 - 134 * nt}`} strokeWidth="2.2" />}
            </g>
          );
        })}
      </g>
      {/* wheel */}
      <g transform="translate(0 -172)">
        <g className="v-spin">
          <circle r={R} fill="none" stroke="url(#vGold)" strokeWidth="6" />
          <circle r="96" fill="none" stroke="url(#vGold)" strokeWidth="3" />
          <circle r="70" fill="none" stroke="#e8b84a" strokeWidth="1.6" />
          {Array.from({ length: 16 }, (_, k) => {
            const a = (k * 22.5 * Math.PI) / 180;
            return <path key={k} d={`M${22 * Math.cos(a)} ${22 * Math.sin(a)}L${R * Math.cos(a)} ${R * Math.sin(a)}`} stroke="#e8b84a" strokeWidth="2" />;
          })}
          {Array.from({ length: 16 }, (_, k) => {
            const a = ((k * 22.5 + 11.25) * Math.PI) / 180;
            return <circle key={k} cx={83 * Math.cos(a)} cy={83 * Math.sin(a)} r="7.5" fill="none" stroke="#e8b84a" strokeWidth="1.6" />;
          })}
          {bulbs.map((b, i) => (
            <circle key={i} className="v-blink" cx={b.bx} cy={b.by} r="3" fill={b.c} style={{ animationDelay: `${b.d}s`, filter: `drop-shadow(0 0 3px ${b.c})` }} />
          ))}
          {inner.map((b, i) => (
            <circle key={i} className="v-blink" cx={b.bx} cy={b.by} r="2.2" fill={b.c} style={{ animationDelay: `${b.d}s` }} />
          ))}
          {gondolas.map((g, i) => (
            <g key={i} className="v-spin-rev" style={{ transformOrigin: `${g.gx}px ${g.gy}px` }}>
              <path d={`M${g.gx} ${g.gy}V${g.gy + 7}`} stroke="#e8b84a" strokeWidth="1.6" />
              <path d={`M${g.gx - 11} ${g.gy + 10} Q${g.gx} ${g.gy + 2} ${g.gx + 11} ${g.gy + 10}Z`} fill={g.c} stroke="#00000044" />
              <rect x={g.gx - 11} y={g.gy + 10} width="22" height="14" rx="3" fill={g.c} stroke="#00000044" />
              <rect x={g.gx - 8} y={g.gy + 13} width="16" height="7" rx="1.5" fill="#ffe9b0" opacity=".85" />
            </g>
          ))}
        </g>
        {/* hub */}
        <circle r="24" fill="url(#vGold)" stroke="#8a5a12" strokeWidth="1.5" />
        {Array.from({ length: 8 }, (_, k) => (
          <ellipse key={k} cx="0" cy="-12" rx="4.4" ry="9" fill="#c8202e" transform={`rotate(${k * 45})`} />
        ))}
        <circle r="6" fill="#fff3bf" />
      </g>
      {/* base building */}
      <rect x="-100" y="-38" width="200" height="38" fill="url(#vRed)" />
      <rect x="-100" y="-42" width="200" height="6" fill="url(#vGold)" />
      <path d="M-98 -50 H98" stroke="url(#vGold)" strokeWidth="2" />
      {Array.from({ length: 17 }, (_, k) => (
        <path key={k} d={`M${-96 + k * 12} -50V-42`} stroke="#e8b84a" strokeWidth="1.6" />
      ))}
      {Array.from({ length: 7 }, (_, k) => (
        <g key={k} className="v-lit" style={{ animationDelay: `${k * 0.4}s` }}>
          <path d={`M${-84 + k * 28 - 8} -2 V-18 Q${-84 + k * 28} -30 ${-84 + k * 28 + 8} -18 V-2Z`} fill="url(#vWin)" stroke="#e8b84a" strokeWidth="1.4" />
        </g>
      ))}
      {[[-62, "#2a6fd1"], [-20, "#e0262f"], [38, "#2f8f5b"], [76, "#f5c542"]].map(([fx, c]) => (
        <g key={fx} transform={`translate(${fx} -42)`}>
          <rect x="-3" y="-10" width="6" height="10" rx="2" fill={c} />
          <circle cx="0" cy="-13" r="3" fill="#f2c9a5" />
        </g>
      ))}
    </g>
  );
}

// 11 ── track (flat)
const TRACK = { cx: 700, cy: 552, rx: 150, ry: 28 };

function Tracks() {
  const { cx, cy, rx, ry } = TRACK;
  return (
    <g>
      <ellipse cx={cx} cy={cy + 2} rx={rx} ry={ry} fill="none" stroke="#fff" strokeWidth="16" opacity=".85" />
      <ellipse cx={cx} cy={cy + 2} rx={rx} ry={ry} fill="none" stroke="#7a4a2a" strokeWidth="9" strokeDasharray="2.6 5" />
      <ellipse cx={cx} cy={cy} rx={rx + 3.4} ry={ry + 1} fill="none" stroke="#cdd5de" strokeWidth="1.7" />
      <ellipse cx={cx} cy={cy + 3} rx={rx - 3.4} ry={ry - 1} fill="none" stroke="#cdd5de" strokeWidth="1.7" />
    </g>
  );
}

// 12 ── little train (moved by requestAnimationFrame)
function Loco() {
  return (
    <g>
      <ellipse cx="0" cy="2" rx="18" ry="3" fill="#5b0a17" opacity=".25" />
      <Smoke x={10} y={-26} n={3} />
      <rect x="-15" y="-16" width="30" height="12" rx="2" fill="#c8202e" stroke="#7a0f1a" strokeWidth="1" />
      <rect x="4" y="-27" width="11" height="12" rx="1.5" fill="#a3121f" stroke="#7a0f1a" strokeWidth="1" />
      <rect x="6" y="-25" width="7" height="5" fill="#ffe9b0" />
      <rect x="-9" y="-30" width="6" height="14" fill="#1c1218" />
      <rect x="-11" y="-32" width="10" height="3" rx="1" fill="#1c1218" />
      <rect x="-15" y="-6" width="30" height="3" fill="#1c1218" />
      <circle cx="-8" cy="-3" r="4" fill="#2a1a22" stroke="#e8b84a" strokeWidth="1" />
      <circle cx="6" cy="-3" r="4" fill="#2a1a22" stroke="#e8b84a" strokeWidth="1" />
      <circle cx="16" cy="-12" r="9" fill="url(#vGlow)" />
      <circle cx="15" cy="-12" r="2.4" fill="#fff6b0" />
    </g>
  );
}

function Wagon({ color, cargo }) {
    return (
        <g>
        <ellipse cx="0" cy="2" rx="14" ry="2.6" fill="#5b0a17" opacity=".25" />
        <rect x="-13" y="-14" width="26" height="10" rx="1.5" fill={color} stroke="#00000055" strokeWidth="1" />
        <rect x="-13" y="-6" width="26" height="2.5" fill="#1c1218" />
        <circle cx="-7" cy="-3" r="3.4" fill="#2a1a22" stroke="#e8b84a" strokeWidth=".9" />
        <circle cx="7" cy="-3" r="3.4" fill="#2a1a22" stroke="#e8b84a" strokeWidth=".9" />
        {cargo === "gifts" ? (
            <g>
            <rect x="-10" y="-22" width="9" height="8" fill="#2a6fd1" />
            <rect x="-6.5" y="-22" width="2" height="8" fill="#fbe08a" />
            <rect x="1" y="-20" width="9" height="6" fill="#f5c542" />
            <rect x="4.5" y="-20" width="2" height="6" fill="#c8202e" />
            </g>
        ) : (
            <g>
            <path d="M0 -30 L-8 -14 H8Z" fill="#1f7a4d" />
            <path d="M0 -30 L-5 -21 H5Z" fill="#fff" opacity=".85" />
            <circle cx="0" cy="-30" r="1.8" fill="#ffd45a" />
            </g>
        )}
        </g>
    );
}

function Train() {
    const refs = useRef([]);
    const { cx, cy, rx, ry } = TRACK;
    const units = [
        { off: 0, node: <Loco /> },
        { off: -0.27, node: <Wagon color="#2f8f5b" cargo="gifts" /> },
        { off: -0.5, node: <Wagon color="#e8b84a" cargo="tree" /> },
    ];
    useFrame((t) => {
        units.forEach((u, i) => {
        const el = refs.current[i];
        if (!el) return;
        const th = t * 0.42 + 1 + u.off;
        const px = cx + rx * Math.cos(th);
        const py = cy + ry * Math.sin(th);
        const tx = -rx * Math.sin(th);
        const ty = ry * Math.cos(th);
        const sgn = tx >= 0 ? 1 : -1;
        const phi = clamp((Math.atan2(ty, Math.abs(tx)) * 180) / Math.PI, -25, 25);
        const sc = 0.82 + (0.3 * (py - (cy - ry))) / (2 * ry);
        el.setAttribute("transform", `translate(${px.toFixed(2)} ${(py - 1).toFixed(2)}) scale(${(sgn * sc).toFixed(3)} ${sc.toFixed(3)}) rotate(${phi.toFixed(1)})`);
        });
    });
    return (
        <g>
        {units.map((u, i) => (
            <g key={i} ref={(el) => (refs.current[i] = el)} transform="translate(-999 -999)">
            {u.node}
            </g>
        ))}
        </g>
    );
}

// 13 ── mulled-wine stall
function Stall({ x, y }) {
    const n = 8;
    const stripes = Array.from({ length: n }, (_, i) => {
        const t0 = -46 + (92 / n) * i;
        const t1 = -46 + (92 / n) * (i + 1);
        const b0 = -56 + (112 / n) * i;
        const b1 = -56 + (112 / n) * (i + 1);
        return { t0, t1, b0, b1, c: i % 2 ? "#fff8ec" : "#c8202e" };
    });
    return (
        <g transform={`translate(${x} ${y})`}>
        <Shadow rx={64} ry={8} o={0.3} />
        {/* barrel */}
        <g transform="translate(-66 0)">
            <path d="M-9 0 Q-13 -13 -9 -26 H9 Q13 -13 9 0Z" fill="url(#vWood)" stroke="#3a1608" strokeWidth="1" />
            <path d="M-11 -8 H11M-11 -19 H11" stroke="#2a1008" strokeWidth="1.6" />
            <ellipse cx="0" cy="-26" rx="9" ry="2.4" fill="#c98a4a" />
        </g>
        <rect x="-46" y="-46" width="92" height="46" fill="url(#vWood)" />
        <rect x="-38" y="-42" width="76" height="30" fill="#3b1a10" />
        <ellipse cx="0" cy="-26" rx="46" ry="26" fill="url(#vGlow)" className="v-lit" />
        <rect x="-36" y="-40" width="72" height="26" fill="url(#vWin)" opacity=".9" className="v-lit" />
        {/* vendor */}
        <rect x="-6" y="-34" width="12" height="20" rx="3" fill="#c8202e" />
        <circle cx="0" cy="-38" r="5" fill="#f2c9a5" />
        <path d="M-5 -40 Q0 -50 5 -40Z" fill="#fff" />
        <rect x="-46" y="-14" width="92" height="6" fill="#5a2410" />
        {[-24, -8, 10, 26].map((mx) => (
            <g key={mx}>
            <rect x={mx - 3.5} y="-21" width="7" height="7" rx="1.4" fill="#fff8ec" />
            <rect x={mx - 3.5} y="-21" width="7" height="2.4" fill="#8a1424" />
            <circle className="v-puff" cx={mx} cy="-23" r="2" fill="#fff" style={{ animationDelay: `${(mx + 30) / 30}s` }} />
            </g>
        ))}
        {/* striped awning */}
        {stripes.map((s, i) => (
            <g key={i}>
            <path d={`M${s.t0} -74 L${s.t1} -74 L${s.b1} -46 L${s.b0} -46Z`} fill={s.c} />
            <path d={`M${s.b0} -46 Q${(s.b0 + s.b1) / 2} -38 ${s.b1} -46Z`} fill={s.c} />
            </g>
        ))}
        <path d="M-50 -74 Q-36 -86 -22 -75 Q-8 -88 6 -76 Q20 -88 34 -75 Q44 -84 50 -74 L46 -70 H-46Z" fill="url(#vRoofSnow)" />
        {/* sign + string lights */}
        <rect x="-28" y="-96" width="56" height="16" rx="3" fill="#5a2410" stroke="url(#vGold)" strokeWidth="1.6" />
        <text x="0" y="-84.5" textAnchor="middle" fontSize="10" fontStyle="italic" fontWeight="700" fill="#ffe9b0" fontFamily="'Cormorant Garamond',Georgia,serif">
            Vino caliente
        </text>
        <path d="M-28 -80 L-34 -74M28 -80 L34 -74" stroke="#3a1608" strokeWidth="2" />
        {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} className="v-blink" cx={-52 + i * 13} cy={-44 + (i % 2) * 2} r="2.4" fill={COLORS[i % 5]} style={{ animationDelay: `${(i % 4) * 0.35}s`, filter: `drop-shadow(0 0 3px ${COLORS[i % 5]})` }} />
        ))}
        </g>
    );
}

// 14 ── Christmas pyramid with spinning blades
function Pyramid({ x, y }) {
    const tiers = [
        { w: 52, y0: -46, y1: 0 },
        { w: 38, y0: -90, y1: -46 },
        { w: 26, y0: -128, y1: -90 },
    ];
    const figs = ["#e0262f", "#2f8f5b", "#f5c542", "#2a6fd1"];
    return (
        <g transform={`translate(${x} ${y})`}>
        <Shadow rx={62} ry={8} o={0.3} />
        {tiers.map((t, ti) => (
            <g key={ti}>
            <rect x={-t.w} y={t.y0} width={t.w * 2} height={t.y1 - t.y0} fill="url(#vWood)" />
            <rect x={-t.w - 3} y={t.y0 - 2} width={t.w * 2 + 6} height="5" fill="url(#vGold)" />
            {[-1, 0, 1].map((k) => {
                const wx = k * (t.w * 0.62);
                const ww = t.w * 0.3;
                return (
                <g key={k} className="v-lit" style={{ animationDelay: `${ti * 0.5 + k * 0.3}s` }}>
                    <path d={`M${wx - ww} ${t.y1 - 6} V${t.y0 + 16} Q${wx} ${t.y0 + 4} ${wx + ww} ${t.y0 + 16} V${t.y1 - 6}Z`} fill="url(#vWin)" stroke="#e8b84a" strokeWidth="1.2" />
                    <rect x={wx - 3} y={t.y1 - 20} width="6" height="14" rx="2" fill={figs[(ti + k + 1) % 4]} />
                    <circle cx={wx} cy={t.y1 - 23} r="2.8" fill="#f2c9a5" />
                </g>
                );
            })}
            <path d={`M${-t.w} ${t.y1 - 2} Q0 ${t.y1 + 5} ${t.w} ${t.y1 - 2}`} fill="none" stroke="#2f8f5b" strokeWidth="3" strokeDasharray="4 3" />
            </g>
        ))}
        <path d="M-34 -128 L0 -166 L34 -128Z" fill="url(#vRed)" />
        <path d="M-30 -130 L0 -162 L30 -130 Q18 -124 8 -131 Q-4 -124 -14 -131 Q-22 -125 -30 -130Z" fill="url(#vRoofSnow)" />
        <path d="M0 -166 V-184" stroke="url(#vGold)" strokeWidth="3" strokeLinecap="round" />
        <g transform="translate(0 -184)">
            <g className="v-fast">
            {[0, 90, 180, 270].map((a) => (
                <path key={a} d="M0 0 Q9 -3 18 -1 Q9 5 0 0Z" fill="#e8b84a" stroke="#a8721f" strokeWidth=".8" transform={`rotate(${a})`} />
            ))}
            </g>
            <circle r="3" fill="#fff3bf" />
        </g>
        </g>
    );
}

// 15 ── church with swinging bell
function Church({ x, y }) {
    return (
        <g transform={`translate(${x} ${y})`}>
        <Shadow rx={90} ry={9} o={0.3} />
        {/* nave */}
        <rect x="-30" y="-72" width="92" height="72" fill="url(#vStone)" />
        <path d="M-38 -72 L16 -112 L70 -72Z" fill="url(#vSlate)" />
        <path d="M-30 -74 L16 -108 L62 -74 Q50 -68 38 -75 Q26 -68 14 -76 Q2 -68 -10 -75 Q-20 -69 -30 -74Z" fill="url(#vRoofSnow)" />
        {[-6, 38].map((wx, i) => (
            <g key={wx} className="v-lit" style={{ animationDelay: `${i * 0.7}s` }}>
            <ellipse cx={wx} cy="-38" rx="16" ry="30" fill="url(#vGlow)" opacity=".6" />
            <path d={`M${wx - 8} -20 V-48 Q${wx} -62 ${wx + 8} -48 V-20Z`} fill="url(#vGlass)" stroke="#5a3a1a" strokeWidth="1.6" />
            <path d={`M${wx} -58 V-20M${wx - 8} -38 H${wx + 8}`} stroke="#3a2410" strokeWidth="1.2" />
            </g>
        ))}
        <path d="M8 0 V-22 Q16 -34 24 -22 V0Z" fill="#3b1a10" />
        <path d="M11 0 V-21 Q16 -29 21 -21 V0Z" fill="url(#vWin)" className="v-lit" />
        {/* tower */}
        <rect x="-70" y="-122" width="40" height="122" fill="url(#vStone)" />
        <path d="M-70 -122 V0M-30 -122 V0" stroke="#b79b78" strokeWidth="2" />
        {[-96, -52, -30].map((qy) => (
            <path key={qy} d={`M-70 ${qy}H-30`} stroke="#b79b78" strokeWidth="1.2" opacity=".7" />
        ))}
        <path d="M-60 -86 V-110 Q-50 -124 -40 -110 V-86Z" fill="#2a1410" />
        <g className="v-bell" style={{ transformOrigin: "-50px -112px" }}>
            <path d="M-50 -112 V-106" stroke="#3a2410" strokeWidth="1.6" />
            <path d="M-57 -90 Q-56 -104 -50 -106 Q-44 -104 -43 -90Z" fill="url(#vGold)" stroke="#8a5a12" strokeWidth="1" />
            <circle cx="-50" cy="-88" r="2" fill="#a8721f" />
        </g>
        <circle cx="-50" cy="-68" r="9" fill="#fff8ec" stroke="#8a5a12" strokeWidth="1.6" />
        <path d="M-50 -68 V-74M-50 -68 L-45 -66" stroke="#3a2410" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M-74 -122 L-26 -122 L-50 -196Z" fill="url(#vSlate)" />
        <path d="M-66 -124 L-34 -124 L-50 -184 Z" fill="url(#vRoofSnow)" />
        <path d="M-50 -196 V-214M-57 -206 H-43" stroke="url(#vGold)" strokeWidth="3" strokeLinecap="round" />
        <g className="v-lit"><rect x="-52" y="-40" width="4" height="14" rx="2" fill="url(#vWin)" /></g>
        </g>
    );
}

// 16 ── snowman
function Snowman({ x, y }) {
    return (
        <g transform={`translate(${x} ${y}) scale(.62) translate(-50 -136)`}>
        <ellipse cx="50" cy="136" rx="36" ry="5" fill="#5b0a17" opacity=".3" />
        <g className="v-sway" style={{ transformOrigin: "50px 136px" }}>
            <circle cx="50" cy="104" r="30" fill="url(#vBall)" />
            <circle cx="50" cy="64" r="22" fill="url(#vBall)" />
            <circle cx="50" cy="32" r="16" fill="url(#vBall)" />
            <path d="M32 62 L8 48 M8 48 L4 40 M8 48 L2 51 M68 62 L92 48 M92 48 L96 40 M92 48 L98 51" stroke="#5a3a1a" strokeWidth="3" strokeLinecap="round" fill="none" />
            <rect x="35" y="8" width="30" height="13" rx="2" fill="#1d1d1d" />
            <rect x="29" y="19" width="42" height="4" rx="2" fill="#1d1d1d" />
            <rect x="35" y="14" width="30" height="4" fill="#c8202e" />
            <circle cx="44" cy="28" r="2" fill="#111" />
            <circle cx="56" cy="28" r="2" fill="#111" />
            <path d="M50 32 L68 36 L50 38Z" fill="#ff8a2a" />
            {[[42, 40], [46, 42.5], [54, 42.5], [58, 40]].map(([sx, sy]) => (
            <circle key={sx} cx={sx} cy={sy} r="1.2" fill="#111" />
            ))}
            <path d="M34 46 Q50 58 66 46 L68 54 Q50 66 32 54Z" fill="#c8202e" />
            <path d="M58 56 L68 82 L58 80Z" fill="#a3121f" />
            {[66, 84, 100].map((by) => (
            <circle key={by} cx="50" cy={by} r="2.6" fill="#222" />
            ))}
        </g>
        </g>
    );
}

// 17 ── carol singers
function Caroler({ cx, coat, hat, d }) {
    return (
        <g transform={`translate(${cx} 0)`}>
        <ellipse cx="0" cy="1" rx="9" ry="2.4" fill="#5b0a17" opacity=".25" />
        <g className="v-sing" style={{ transformOrigin: "0px 0px", animationDelay: `${d}s` }}>
            <path d="M-8 0 Q-9 -20 -5 -26 H5 Q9 -20 8 0Z" fill={coat} />
            <path d="M-8 -24 L-6 -14M8 -24 L6 -14" stroke={coat} strokeWidth="3" strokeLinecap="round" />
            <circle cx="0" cy="-31" r="6" fill="#f2c9a5" />
            <path d="M-6.4 -33 Q0 -45 6.4 -33Z" fill={hat} />
            <circle cx="0" cy="-44" r="2.2" fill="#fff" />
            <circle cx="-2.2" cy="-32" r=".9" fill="#222" />
            <circle cx="2.2" cy="-32" r=".9" fill="#222" />
            <ellipse className="v-mouth" cx="0" cy="-28" rx="2" ry="2" fill="#6b1019" style={{ animationDelay: `${d}s` }} />
            <rect x="-7" y="-20" width="14" height="9" rx="1" fill="#fff8ec" />
            <path d="M0 -20V-11" stroke="#c9b79a" strokeWidth="1" />
        </g>
        </g>
    );
}

function Carolers({ x, y }) {
    return (
        <g transform={`translate(${x} ${y})`}>
        {[[-6, -52, 0], [14, -58, 1.1], [34, -50, 2.2]].map(([nx, ny, nd], i) => (
            <g key={i} className="v-note" style={{ animationDelay: `${nd}s` }} transform={`translate(${nx} ${ny})`}>
            <circle cx="-2" cy="0" r="2.6" fill="#ffe9b0" />
            <path d="M0 0V-11q5 1 5 5" fill="none" stroke="#ffe9b0" strokeWidth="1.6" strokeLinecap="round" />
            </g>
        ))}
        <Caroler cx={-26} coat="#c8202e" hat="#fff" d={0} />
        <Caroler cx={-6} coat="#2f8f5b" hat="#c8202e" d={0.3} />
        <Caroler cx={14} coat="#2a6fd1" hat="#f5c542" d={0.6} />
        <Caroler cx={34} coat="#f5c542" hat="#2f8f5b" d={0.9} />
        </g>
    );
}

// 18 ── market walkers (moved by requestAnimationFrame)
const WALKERS = [
    { x0: 600, x1: 752, y: 478, w: 0.5, ph: 0, coat: "#c8202e", hat: "#fff", scarf: "#f5c542", size: 1 },
    { x0: 640, x1: 740, y: 488, w: 0.62, ph: 2.4, coat: "#2a6fd1", hat: "#c8202e", scarf: "#fff", size: 0.95 },
    { x0: 612, x1: 700, y: 470, w: 0.78, ph: 4.2, coat: "#f5c542", hat: "#2f8f5b", scarf: "#c8202e", size: 0.7 },
];

function Walker({ coat, hat, scarf }) {
    return (
        <g>
        <ellipse cx="0" cy="1" rx="9" ry="2.4" fill="#5b0a17" opacity=".22" />
        <g className="v-leg" style={{ transformOrigin: "0px -11px" }}>
            <path d="M0 -11V-1" stroke="#2a1a22" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M0 0h4.5" stroke="#1a0f16" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g className="v-leg v-leg2" style={{ transformOrigin: "0px -11px" }}>
            <path d="M0 -11V-1" stroke="#2a1a22" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M0 0h4.5" stroke="#1a0f16" strokeWidth="3" strokeLinecap="round" />
        </g>
        <path d="M-6 -11 Q-8 -24 0 -27 Q8 -24 6 -11Z" fill={coat} />
        <path d="M-5 -26 H5 L4 -22 H-4Z" fill={scarf} />
        <circle cx="1" cy="-32" r="5.2" fill="#f2c9a5" />
        <path d="M-4.5 -34 Q1 -43 6.5 -34Z" fill={hat} />
        <circle cx="1" cy="-42.5" r="2" fill="#fff" />
        <g className="v-arm" style={{ transformOrigin: "0px -24px" }}>
            <path d="M0 -24V-13" stroke={coat} strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="0" cy="-12" r="1.8" fill="#f2c9a5" />
        </g>
        </g>
    );
}

function Walkers() {
    const refs = useRef([]);
    useFrame((t) => {
        WALKERS.forEach((w, i) => {
        const el = refs.current[i];
        if (!el) return;
        const a = w.w * t + w.ph;
        const p = (1 - Math.cos(a)) / 2;
        const px = w.x0 + (w.x1 - w.x0) * p;
        const vx = ((w.x1 - w.x0) / 2) * w.w * Math.sin(a);
        const face = clamp(vx / (Math.abs(w.x1 - w.x0) * 0.5 * w.w * 0.3), -1, 1);
        const bob = Math.abs(Math.sin(t * 6 + w.ph)) * -1.2;
        el.setAttribute("transform", `translate(${px.toFixed(2)} ${(w.y + bob).toFixed(2)}) scale(${(face * w.size).toFixed(3)} ${w.size})`);
        });
    });
    return (
        <g>
        {WALKERS.map((w, i) => (
            <g key={i} ref={(el) => (refs.current[i] = el)} transform="translate(-999 -999)">
            <Walker coat={w.coat} hat={w.hat} scarf={w.scarf} />
            </g>
        ))}
        </g>
    );
}

// 19 ── string of lights around the front rim of the diorama
const RIM = Array.from({ length: 38 }, (_, i) => {
  const th = Math.PI * (0.035 + (0.93 * i) / 37);
  return { x: 500 + 468 * Math.cos(th), y: 455 + 141 * Math.sin(th), c: COLORS[i % 5], d: (i % 7) * 0.28 };
});

function RimLights() {
    const d = RIM.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    return (
        <g>
        <path d={d} fill="none" stroke="#10261c" strokeWidth="2" />
        {RIM.map((p, i) => (
            <g key={i}>
            <circle cx={p.x} cy={p.y + 4} r="9" fill={p.c} opacity=".25" />
            <circle className="v-blink" cx={p.x} cy={p.y + 4} r="4.4" fill={p.c} style={{ animationDelay: `${p.d}s`, filter: `drop-shadow(0 0 5px ${p.c})` }} />
            <rect x={p.x - 1.4} y={p.y - 1} width="2.8" height="3" fill="#c9a24a" />
            </g>
        ))}
        </g>
    );
}

// 20 ── Santa's sleigh crossing the sky
function Santa() {
    return (
        <g transform="translate(0 70)">
        <g className="v-fly">
            <g transform="scale(.46)">
            <g className="v-bob">
                {[[8, 70, 5], [-12, 82, 3.5], [-30, 66, 4], [-52, 76, 3]].map(([sx, sy, r], i) => (
                <path key={i} d={`M${sx} ${sy - r} L${sx + r * 0.3} ${sy - r * 0.3} L${sx + r} ${sy} L${sx + r * 0.3} ${sy + r * 0.3} L${sx} ${sy + r} L${sx - r * 0.3} ${sy + r * 0.3} L${sx - r} ${sy} L${sx - r * 0.3} ${sy - r * 0.3}Z`} fill="#fff3bf" opacity={0.9 - i * 0.2} />
                ))}
                <path d="M255 80 Q215 90 175 92" fill="none" stroke="#d9a336" strokeWidth="2" strokeDasharray="5 3" />
                <g stroke="#5a3320" strokeWidth="5" strokeLinecap="round" fill="none">
                <path d="M270 90 L256 108 L262 111M278 92 L282 112 L289 112M296 90 L312 104 L319 104M304 88 L324 98 L330 97" />
                </g>
                <ellipse cx="285" cy="78" rx="34" ry="15" fill="#7a4a2a" />
                <ellipse cx="285" cy="86" rx="26" ry="7" fill="#c89a6a" />
                <path d="M308 70 L322 52 L332 58 L316 80Z" fill="#7a4a2a" />
                <ellipse cx="334" cy="52" rx="13" ry="10" fill="#8a5632" transform="rotate(-15 334 52)" />
                <ellipse cx="346" cy="57" rx="8" ry="6" fill="#a06a40" />
                <circle cx="353" cy="57" r="9" fill="#ff3030" opacity=".4" />
                <circle cx="353" cy="57" r="4.6" fill="#ff3b30" />
                <circle cx="337" cy="50" r="1.8" fill="#111" />
                <path d="M332 42 L328 24 M328 24 L320 20 M329 30 L336 22 M324 36 L316 33" stroke="#4a2a18" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M36 118 H176 Q196 118 198 100" fill="none" stroke="url(#vGold)" strokeWidth="5" strokeLinecap="round" />
                <path d="M70 118 V104M140 118 V104" stroke="url(#vGold)" strokeWidth="4" strokeLinecap="round" />
                <path d="M54 66 Q44 40 74 38 Q98 40 92 66Z" fill="#8a5a30" stroke="#5a3a1a" strokeWidth="1.5" />
                <rect x="80" y="26" width="15" height="15" rx="2" fill="#2a6fd1" />
                <path d="M44 70 Q40 96 62 104 H150 Q176 102 190 80 Q182 76 176 82 H72 Q60 80 56 66Z" fill="#c8202e" stroke="#7a0f1a" strokeWidth="2" />
                <path d="M52 92 Q100 108 170 92" fill="none" stroke="url(#vGold)" strokeWidth="2.5" />
                <path d="M146 62 Q200 66 256 80" fill="none" stroke="#7a0f1a" strokeWidth="1.6" />
                <ellipse cx="128" cy="64" rx="20" ry="18" fill="#d4222f" />
                <rect x="110" y="68" width="36" height="5" fill="#222" />
                <circle cx="130" cy="40" r="11" fill="#f7cfae" />
                <path d="M120 42 Q130 68 142 42 Q130 50 120 42Z" fill="#fff" />
                <path d="M118 36 Q130 6 150 24 L142 36Z" fill="#d4222f" />
                <ellipse cx="130" cy="36" rx="14" ry="4" fill="#fff" />
                <circle cx="150" cy="25" r="5" fill="#fff" />
            </g>
            </g>
        </g>
        </g>
    );
}

/* ------------------------------------------------------------------ */
/*  7. THE LIST: what each click adds                                  */
/*     z = painting order (back to front), x/y = pop-in origin         */
/* ------------------------------------------------------------------ */

const ITEMS = [
    {
        id: "firs", label: "Abetos nevados", focus: [400, 330],
        parts: [
        { z: 392, x: 395, y: 392, node: <Fir x={395} y={392} s={0.95} /> },
        { z: 402, x: 300, y: 402, node: <Fir x={300} y={402} s={0.72} /> },
        { z: 420, x: 135, y: 420, node: <Fir x={135} y={420} s={0.5} /> },
        { z: 440, x: 905, y: 440, node: <Fir x={905} y={440} s={0.55} /> },
        { z: 432, x: 748, y: 432, node: <Fir x={748} y={432} s={0.5} /> },
        { z: 505, x: 880, y: 505, node: <Fir x={880} y={505} s={0.42} /> },
        { z: 506, x: 100, y: 506, node: <Fir x={100} y={506} s={0.45} /> },
        ],
    },
    { id: "cabin", label: "La cabaña de madera", focus: [265, 430], parts: [{ z: 470, x: 265, y: 470, node: <Cabin x={265} y={470} /> }] },
    { id: "timber", label: "La casa de entramado y su farol", focus: [500, 380], parts: [{ z: 452, x: 500, y: 452, node: <TimberHouse x={500} y={452} /> }] },
    { id: "tower", label: "La casita del tejado rojo", focus: [95, 390], parts: [{ z: 452, x: 95, y: 452, node: <TowerHouse x={95} y={452} /> }] },
    { id: "rink", label: "La pista de hielo", focus: [265, 553], parts: [{ z: 300, x: 265, y: 552, node: <Rink x={265} y={552} /> }] },
    { id: "skaters", label: "Los patinadores", focus: [265, 535], parts: [{ z: 557, x: 265, y: 552, node: <Skaters /> }] },
    { id: "stable", label: "El portal de Belén", focus: [410, 440], parts: [{ z: 498, x: 410, y: 498, node: <Stable x={410} y={498} /> }] },
    { id: "family", label: "La Sagrada Familia rezando", focus: [410, 490], parts: [{ z: 518, x: 410, y: 520, node: <HolyFamily x={410} y={520} /> }] },
    { id: "shepherds", label: "Los pastores y sus ovejas", focus: [505, 505], parts: [{ z: 524, x: 505, y: 524, node: <Shepherds x={505} y={524} /> }] },
    { id: "wheel", label: "La gran noria", focus: [640, 240], parts: [{ z: 410, x: 640, y: 410, node: <FerrisWheel x={640} y={410} /> }] },
    { id: "tracks", label: "Las vías del tren", focus: [700, 552], parts: [{ z: 301, x: 700, y: 552, node: <Tracks /> }] },
    { id: "train", label: "El trenecito", focus: [700, 540], parts: [{ z: 560, x: 700, y: 552, node: <Train /> }] },
    { id: "stall", label: "El puesto de vino caliente", focus: [810, 450], parts: [{ z: 486, x: 810, y: 486, node: <Stall x={810} y={486} /> }] },
    { id: "pyramid", label: "La pirámide de Navidad", focus: [835, 340], parts: [{ z: 416, x: 835, y: 416, node: <Pyramid x={835} y={416} /> }] },
    { id: "church", label: "La iglesia", focus: [190, 320], parts: [{ z: 390, x: 215, y: 390, node: <Church x={215} y={390} /> }] },
    { id: "snowman", label: "El muñeco de nieve", focus: [915, 470], parts: [{ z: 482, x: 915, y: 482, node: <Snowman x={915} y={482} /> }] },
    { id: "carolers", label: "Los villancicos", focus: [480, 545], parts: [{ z: 574, x: 480, y: 574, node: <Carolers x={480} y={574} /> }] },
    { id: "walkers", label: "Los paseantes del mercadillo", focus: [680, 470], parts: [{ z: 489, x: 680, y: 480, node: <Walkers /> }] },
    { id: "lights", label: "Las luces de Navidad", focus: [500, 590], parts: [{ z: 700, x: 500, y: 600, node: <RimLights /> }] },
    { id: "santa", label: "Papá Noel sobrevuela el pueblo", focus: [500, 110], parts: [{ z: 1000, x: 500, y: 100, node: <Santa /> }] },
];

// Painting order is fixed (sorted by z), so adding an item never moves the others
const PARTS = ITEMS.flatMap((item, order) => item.parts.map((p, i) => ({ ...p, order, i, key: `${item.id}-${i}` }))).sort(
    (a, b) => a.z - b.z
);

/* ------------------------------------------------------------------ */
/*  8. DIORAMA BASE (always visible)                                   */
/* ------------------------------------------------------------------ */

const BUMPS = (() => {
    const r = rng(21);
    return Array.from({ length: 46 }, () => {
        const a = r() * Math.PI * 2;
        const d = Math.sqrt(r());
        return { x: 500 + Math.cos(a) * d * 440, y: 455 + Math.sin(a) * d * 128, rx: 8 + r() * 22, ry: 2 + r() * 5, pink: r() > 0.6 };
    });
})();

function Base() {
    return (
        <g>
        <ellipse cx="500" cy="500" rx="480" ry="150" fill="#2a0309" opacity=".45" filter="url(#vBlur8)" />
        <ellipse cx="500" cy="486" rx="485" ry="150" fill="url(#vPlinth)" />
        <rect x="15" y="455" width="970" height="31" fill="url(#vPlinth)" />
        <ellipse cx="500" cy="455" rx="485" ry="150" fill="none" stroke="url(#vGold)" strokeWidth="2.4" opacity=".0" />
        <path d="M15 478 A485 150 0 0 0 985 478" fill="none" stroke="url(#vGold)" strokeWidth="2" opacity=".75" />
        <ellipse cx="500" cy="455" rx="485" ry="150" fill="url(#vGround)" />
        <ellipse cx="500" cy="455" rx="485" ry="150" fill="none" stroke="#fff" strokeWidth="5" opacity=".9" />
        {BUMPS.map((b, i) => (
            <ellipse key={i} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} fill={b.pink ? "#f1b6bb" : "#fff"} opacity={b.pink ? 0.35 : 0.8} />
        ))}
        <path d="M40 520 Q500 640 960 520" fill="none" stroke="#c4505d" strokeWidth="14" opacity=".18" filter="url(#vBlur8)" />
        </g>
    );
}

function Burst({ x, y }) {
    const parts = Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2 + (i % 2 ? 0.2 : 0);
        const dist = 55 + ((i * 23) % 50);
        return { dx: Math.cos(a) * dist, dy: Math.sin(a) * dist * 0.8 - 20, s: 5 + ((i * 5) % 7), r: (i * 47) % 360, c: ["#fff3bf", "#ffd45a", "#ff6b6b", "#ffffff"][i % 4] };
    });
    return (
        <g transform={`translate(${x} ${y})`}>
        {parts.map((p, i) => (
            <path
            key={i}
            className="v-spark"
            d={`M0 ${-p.s} L${p.s * 0.3} ${-p.s * 0.3} L${p.s} 0 L${p.s * 0.3} ${p.s * 0.3} L0 ${p.s} L${-p.s * 0.3} ${p.s * 0.3} L${-p.s} 0 L${-p.s * 0.3} ${-p.s * 0.3}Z`}
            fill={p.c}
            style={{ "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, "--r": `${p.r}deg` }}
            />
        ))}
        </g>
    );
}

/* ------------------------------------------------------------------ */
/*  9. PAGE                                                            */
/* ------------------------------------------------------------------ */

function GiftIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="9" width="18" height="12" rx="1.5" fill="#c8202e" />
        <rect x="2" y="6" width="20" height="5" rx="1.5" fill="#a3121f" />
        <rect x="10.5" y="6" width="3" height="15" fill="#fff3bf" />
        <path d="M12 6 C8 1 4 4 8 6Z M12 6 C16 1 20 4 16 6Z" fill="#fff3bf" />
        </svg>
    );
}

export default function ChristmasVillage() {
    const [count, setCount] = useState(0);
    const [burst, setBurst] = useState(null);
    const canvasRef = useRef(null);
    useSnow(canvasRef);

    const done = count >= TOTAL;
    const last = count > 0 ? ITEMS[count - 1] : null;

    const add = () => {
        if (done) return;
        const item = ITEMS[count];
        setCount(count + 1);
        setBurst({ id: count + 1, x: item.focus[0], y: item.focus[1] });
    };

    const reset = () => {
        setCount(0);
        setBurst(null);
    };

    return (
        <div className="vil-stage relative h-full min-h-[100svh] w-full max-h-full max-w-full overflow-hidden">
        <style>{CSS}</style>
        <div className="vil-bokeh" aria-hidden="true" />

        <header className="vil-head">
            <h1>{TEXTS.title}</h1>
        </header>

        <div className="vil-scene">
            <svg className="vil-svg" viewBox="0 0 1000 650" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <Defs />
            <Base />
            {PARTS.map((p) =>
                count > p.order ? (
                <g key={p.key} className="v-pop" style={{ transformOrigin: `${p.x}px ${p.y}px`, animationDelay: `${p.i * 0.08}s` }}>
                    {p.node}
                </g>
                ) : null
            )}
            {burst && <Burst key={burst.id} x={burst.x} y={burst.y} />}
            </svg>
            {count === 0 && <p className="vil-empty">{TEXTS.empty}</p>}
        </div>

        <canvas ref={canvasRef} className="vil-snow" />

        <footer className="vil-foot">
            <p key={count} className={`vil-toast ${done ? "done" : ""}`} aria-live="polite">
            {done ? TEXTS.done : last ? `${TEXTS.newItem} ${last.label}` : "\u00A0"}
            </p>
            <div className="vil-row">
            {done ? (
                <div></div>
                // <button type="button" className="vil-btn" onClick={reset}>
                // {TEXTS.again}
                // </button>
            ) : (
                <button type="button" className="vil-btn" onClick={add}>
                <GiftIcon />
                {TEXTS.add}
                </button>
            )}
            {/* <div className="vil-dots" role="img" aria-label={TEXTS.counter(count, TOTAL)}>
                {Array.from({ length: TOTAL }, (_, i) => (
                <span key={i} className="vil-dot" data-on={i < count} />
                ))}
            </div> */}
            </div>
        </footer>
        </div>
    );
}