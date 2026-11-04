import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Texts (edit here)                                                  */
/* ------------------------------------------------------------------ */

const TEXTS = {
  title: "Una sorpresa para ti",
  subtitle: "J’ai caché quelques mots pour toi…",
  kicker: "Un petit secret",
  scratchTitle: "Gratte pour découvrir 💌",
  foilTitle: "✨ GRATTE ICI ✨",
  foilSub: "pour découvrir ton message",
  msgTitle: "Mon message secret",
  msg: "Si je pouvais refaire tous les choix de ma vie, je choisirais encore de te rencontrer, de t’aimer et de construire notre histoire avec toi. Tu es mon plus beau cadeau. 💖",
  msgSign: "Con todo mi amor, para ti. ❤️",
  hint: "✨ Gratte doucement la surface dorée avec ton doigt pour révéler mon message, petit à petit…",
  hintDone: "💖 Voilà ton message, mon amour !",
  again: "↺ Recouvrir la carte",
  footer1: "Cada día, una razón más para amarte. ❤️",
  footer2: "Con amor, siempre.",
};

const REVEAL_AT = 0.42; // part of the foil to scratch before the rest melts away

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// golden coin used as the mouse cursor
const COIN_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" fill="#e8b84a" stroke="#8a5a12" stroke-width="2.5"/><circle cx="18" cy="18" r="10.5" fill="none" stroke="#fff3bf" stroke-width="1.5" stroke-dasharray="2 3"/><path d="M18 11l2 4.6 5 .5-3.8 3.3 1.2 4.9L18 21.7l-4.4 2.6 1.2-4.9L11 15.1l5-.5z" fill="#fff3bf"/></svg>'
)}") 18 18, crosshair`;

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

.sc{container:sc / size;box-sizing:border-box;position:relative;isolation:isolate;height:100%;min-height:100svh;width:100%;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff0f4;font-family:'Cormorant Garamond',Georgia,serif;
  padding:clamp(34px,6cqh,60px) clamp(10px,3cqw,28px) clamp(8px,1.6cqh,18px);
  background:radial-gradient(120% 90% at 50% 20%,#4a1840 0%,#2a1030 48%,#12081a 100%)}
.sc-glow{position:absolute;inset:0;pointer-events:none;z-index:-1;background:
  radial-gradient(circle at 8% 24%,rgba(255,160,200,.24) 0 7cqw,transparent 8cqw),
  radial-gradient(circle at 94% 20%,rgba(255,200,120,.22) 0 7cqw,transparent 8cqw),
  radial-gradient(circle at 90% 88%,rgba(255,110,160,.26) 0 9cqw,transparent 10cqw),
  radial-gradient(circle at 6% 88%,rgba(255,225,150,.16) 0 7cqw,transparent 8cqw),
  radial-gradient(40% 40% at 50% 50%,rgba(255,150,200,.14),transparent 70%)}
.sc-flake{position:absolute;top:-4%;border-radius:50%;background:#fff;pointer-events:none;animation:sc-fall linear infinite;z-index:-1}
@keyframes sc-fall{0%{transform:translate(0,0)}50%{transform:translate(14px,55cqh)}100%{transform:translate(-8px,110cqh)}}
.sc-star{position:absolute;color:#f6dc9a;pointer-events:none;z-index:-1;animation:sc-tw 3s ease-in-out infinite}
@keyframes sc-tw{0%,100%{opacity:.9;transform:scale(1)}50%{opacity:.25;transform:scale(.8)}}
.sc-lights{position:absolute;left:0;right:0;top:0;height:34px;pointer-events:none;z-index:0}
.sc-lb{position:absolute;width:9px;height:12px;border-radius:50% 50% 45% 45%;animation:sc-tw 2.6s ease-in-out infinite}

.sc-head{flex:none;text-align:center;animation:sc-in .9s cubic-bezier(.2,.9,.3,1) both}
@keyframes sc-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.sc-trio{display:flex;align-items:center;justify-content:center;gap:.7em;height:clamp(18px,3.4cqh,32px)}
.sc-trio svg{height:100%;width:auto;filter:drop-shadow(0 0 8px rgba(255,200,100,.6))}
.sc-title{margin:.1em 0 0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;font-size:clamp(28px,min(7cqw,8.8cqh),64px);
  background:linear-gradient(180deg,#fffbe0 0%,#f8dd86 35%,#d9a336 62%,#fbe493 85%,#b8822a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 rgba(58,0,24,.75)) drop-shadow(0 0 22px rgba(255,200,90,.3))}
.sc-sub{margin:.2em 0 0;font-style:italic;font-weight:600;font-size:clamp(14px,min(2.4cqw,2.9cqh),22px);color:#ffd6e4;text-shadow:0 2px 8px rgba(0,0,0,.6)}

/* the card */
.sc-card{position:relative;flex:none;width:min(94cqw,560px,calc(52cqh * 1.25));margin-top:clamp(14px,3.4cqh,30px);border-radius:22px;padding:clamp(5px,1cqw,9px);
  background:linear-gradient(135deg,#fff0a8,#d9a336 25%,#7a4f10 50%,#f1cd6a 75%,#a8721f);box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 70px rgba(255,150,200,.25);animation:sc-in 1s cubic-bezier(.2,.9,.3,1) .15s both}
.sc-inner{position:relative;border-radius:17px;overflow:hidden;padding:clamp(8px,1.8cqh,16px) clamp(8px,2cqw,16px) clamp(8px,1.4cqh,14px);background:radial-gradient(circle at 2px 2px,rgba(255,214,120,.1) 1px,transparent 1.6px) 0 0/18px 18px,linear-gradient(180deg,#5a1f4a,#3a1238 55%,#240a2a);box-shadow:inset 0 0 60px rgba(0,0,0,.55)}
.sc-inner::before{content:"";position:absolute;inset:6px;border:1.5px dashed rgba(240,200,120,.4);border-radius:12px;pointer-events:none;z-index:4}
.sc-bow{position:absolute;left:50%;top:clamp(-30px,-3.4cqw,-16px);width:clamp(70px,16cqw,110px);transform:translateX(-50%);z-index:6;filter:drop-shadow(0 6px 6px rgba(0,0,0,.5));pointer-events:none}
.sc-holly{position:absolute;z-index:6;width:clamp(34px,7cqw,56px);pointer-events:none}
.sc-ct{text-align:center;padding-top:clamp(4px,1.2cqh,12px)}
.sc-kick{margin:0;font-size:clamp(9px,min(1.6cqw,1.9cqh),13px);letter-spacing:.34em;text-transform:uppercase;font-weight:700;color:#f1c978}
.sc-st{margin:.1em 0 .45em;font-weight:700;font-size:clamp(17px,min(3.2cqw,3.6cqh),28px);color:#ffe9b8}

/* the scratch area */
.sc-win{position:relative;container-type:inline-size;aspect-ratio:5/4;border-radius:12px;overflow:hidden;box-shadow:0 0 0 2px #d9a336,0 0 0 4px rgba(90,40,10,.6),inset 0 0 40px rgba(0,0,0,.5)}
.sc-msg{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4cqw 6cqw;
  background:radial-gradient(60% 50% at 50% 40%,rgba(255,150,190,.22),transparent 70%),linear-gradient(135deg,#4a0f3a,#7a2457 55%,#3a1252)}
.sc-msg .wm{position:absolute;inset:0;margin:auto;width:56%;opacity:.07;pointer-events:none}
.sc-msg .h{font-size:7cqw;line-height:1;animation:sc-beat 1.5s ease-in-out infinite}
@keyframes sc-beat{0%,100%{transform:scale(1)}14%{transform:scale(1.18)}28%{transform:scale(1)}42%{transform:scale(1.12)}}
.sc-msg h3{position:relative;margin:.15em 0 .25em;font-family:'Mountains of Christmas',cursive;font-weight:700;font-size:6cqw;line-height:1.05;color:#ffe08a;text-shadow:0 2px 0 rgba(58,0,24,.7),0 0 16px rgba(255,200,90,.3)}
.sc-msg p{position:relative;margin:0;font-size:3.9cqw;line-height:1.5;font-style:italic;font-weight:600;color:#fff0f4}
.sc-msg .sg{margin-top:.5em;font-size:4.2cqw;color:#ffd27a}
.sc-msg .sp{margin-top:.35em;font-size:4.4cqw;letter-spacing:.3em}
.sc-canvas{position:absolute;inset:0;z-index:2;display:block;width:100%;height:100%;touch-action:none;transition:opacity 1s ease}
.sc-fx{position:absolute;inset:0;z-index:3;width:100%;height:100%;pointer-events:none}

.sc-prog{display:flex;align-items:center;gap:.7em;margin-top:clamp(6px,1.4cqh,12px)}
.sc-bar{position:relative;flex:1;height:clamp(8px,1.4cqh,12px);border-radius:999px;background:rgba(0,0,0,.4);box-shadow:inset 0 2px 4px rgba(0,0,0,.6),0 0 0 1.5px rgba(240,200,120,.5);overflow:hidden}
.sc-fill{position:absolute;left:0;top:0;bottom:0;border-radius:999px;background:linear-gradient(90deg,#d9a336,#fff3bf,#ff9fbb);box-shadow:0 0 12px rgba(255,200,120,.7);transition:width .25s ease}
.sc-pct{flex:none;min-width:3.2em;text-align:right;font-weight:700;font-size:clamp(12px,min(2cqw,2.4cqh),17px);color:#f1c978;font-variant-numeric:tabular-nums}

.sc-hint{flex:none;margin:clamp(8px,1.8cqh,16px) 0 0;max-width:min(94cqw,560px);text-align:center;font-style:italic;font-weight:600;font-size:clamp(13px,min(2.2cqw,2.8cqh),19px);line-height:1.4;color:#ffe4ee}
.sc-again{flex:none;margin-top:.5em;padding:.2em 1.2em;border-radius:999px;border:1.5px solid rgba(241,201,120,.6);background:rgba(0,0,0,.3);color:#f1c978;font-family:inherit;font-weight:700;font-style:italic;font-size:clamp(13px,2cqw,17px);cursor:pointer}
.sc-again:hover{background:rgba(241,201,120,.2)}.sc-again:focus-visible{outline:2px solid #fff;outline-offset:3px}
.sc-foot{flex:none;margin-top:clamp(6px,1.6cqh,16px);text-align:center}
.sc-foot p:first-child{margin:0;font-style:italic;font-weight:600;font-size:clamp(15px,min(2.8cqw,3.4cqh),24px);color:#ffb8cf}
.sc-foot p:last-child{margin:.2em 0 0;font-size:clamp(10px,1.6cqw,13px);letter-spacing:.28em;text-transform:uppercase;color:rgba(255,214,228,.55)}

.sc-conf{position:absolute;top:-6%;pointer-events:none;animation:sc-conf linear infinite;z-index:8}
@keyframes sc-conf{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(115cqh) rotate(720deg);opacity:.9}}
.sc-heart{position:absolute;pointer-events:none;color:#ff8fa3;animation:sc-rise 6s ease-in infinite;z-index:7}
@keyframes sc-rise{0%{transform:translateY(0);opacity:0}15%{opacity:.85}100%{transform:translateY(-100cqh);opacity:0}}

@media (prefers-reduced-motion: reduce){
  .sc-flake,.sc-star,.sc-lb,.sc-msg .h,.sc-conf,.sc-heart{animation:none !important}
  .sc-head,.sc-card{animation-duration:.01s !important}.sc-canvas{transition-duration:.01s}
}
`;

/* ------------------------------------------------------------------ */
/*  Small SVG pieces                                                   */
/* ------------------------------------------------------------------ */

const HEART = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

function Trio() {
  const star = <svg viewBox="0 0 24 24"><path d="M12 1.5L15 9L23 9.5L17 14.5L19 22.5L12 18L5 22.5L7 14.5L1 9.5L9 9Z" fill="#f8dd86" stroke="#b8822a" strokeWidth="1" strokeLinejoin="round" /></svg>;
  return (
    <div className="sc-trio" aria-hidden="true">
      {star}
      <svg viewBox="0 0 24 24"><defs><radialGradient id="scH" cx="35%" cy="28%" r="80%"><stop offset="0" stopColor="#fff" stopOpacity=".85" /><stop offset=".3" stopColor="#ff6f9d" /><stop offset="1" stopColor="#7a1040" /></radialGradient></defs><path d={HEART} fill="url(#scH)" /></svg>
      {star}
    </div>
  );
}

function Bow() {
  return (
    <svg viewBox="0 0 120 70" className="sc-bow" aria-hidden="true">
      <path d="M52 34Q44 62 26 68Q40 46 48 32Z" fill="#8a1040" stroke="#8a1040" strokeWidth="4" strokeLinejoin="round" />
      <path d="M68 34Q76 62 94 68Q80 46 72 32Z" fill="#8a1040" stroke="#8a1040" strokeWidth="4" strokeLinejoin="round" />
      <path d="M56 30Q34 -4 8 8Q-2 24 22 36Q44 42 58 34Z" fill="#d9306e" stroke="#e64a86" strokeWidth="5" strokeLinejoin="round" />
      <path d="M64 30Q86 -4 112 8Q122 24 98 36Q76 42 62 34Z" fill="#d9306e" stroke="#e64a86" strokeWidth="5" strokeLinejoin="round" />
      <path d="M50 26Q36 12 22 16" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="3.4" strokeLinecap="round" />
      <ellipse cx="60" cy="32" rx="11" ry="10" fill="#b01c58" stroke="#b01c58" strokeWidth="3" />
      <circle cx="60" cy="32" r="5" fill="#f8dd86" />
    </svg>
  );
}

function Holly({ style }) {
  return (
    <svg viewBox="0 0 90 70" style={style} className="sc-holly" aria-hidden="true">
      <defs><linearGradient id="scL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38b06a" /><stop offset="1" stopColor="#0f5a36" /></linearGradient></defs>
      {[-70, -20, 30, 80].map((r, i) => <g key={i} transform={`translate(18 56) rotate(${r})`}><path d="M0 0Q10 -9 26 -2Q34 -16 48 -7Q58 -3 62 5Q54 14 42 12Q34 24 24 16Q10 20 0 0Z" fill="url(#scL)" stroke="#0a3b23" strokeWidth="1.2" /></g>)}
      {[[26, 46], [38, 50], [32, 58]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="6" fill="#d4222f" stroke="#7a0f1a" /><circle cx={x - 2} cy={y - 2} r="1.8" fill="#fff" opacity=".75" /></g>)}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Foil painting (embossed gold, motifs, glitter)                     */
/* ------------------------------------------------------------------ */

function starPath(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5; const rr = i % 2 ? r * 0.45 : r;
    ctx[i ? "lineTo" : "moveTo"](x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
}
function heartPath(ctx, x, y, r) {
  ctx.beginPath();
  ctx.moveTo(x, y + r * 0.9);
  ctx.bezierCurveTo(x - r * 1.5, y - r * 0.2, x - r * 0.7, y - r * 1.1, x, y - r * 0.35);
  ctx.bezierCurveTo(x + r * 0.7, y - r * 1.1, x + r * 1.5, y - r * 0.2, x, y + r * 0.9);
  ctx.closePath();
}
function flakePath(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 3; i++) { const a = (i * Math.PI) / 3; ctx.moveTo(x - Math.cos(a) * r, y - Math.sin(a) * r); ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
}

function paintFoil(ctx, w, h) {
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, w, h);

  // base metal
  const g = ctx.createLinearGradient(0, 0, w, h);
  [[0, "#fff3bf"], [0.2, "#e8b84a"], [0.42, "#b8862a"], [0.6, "#f6dc86"], [0.8, "#c99a3a"], [1, "#fff0a8"]].forEach(([o, c]) => g.addColorStop(o, c));
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

  // brushed lines
  for (let i = 0; i < h; i += 2) { ctx.fillStyle = i % 4 ? "rgba(255,255,255,.06)" : "rgba(110,70,10,.06)"; ctx.fillRect(0, i, w, 1); }

  // embossed motifs
  const gap = Math.max(34, w * 0.085); const r0 = gap * 0.2;
  let k = 0;
  for (let y = gap * 0.6; y < h; y += gap) {
    for (let x = gap * ((Math.round(y / gap) % 2) ? 0.5 : 0.05) + gap * 0.3; x < w; x += gap) {
      const kind = k++ % 3;
      [[1.2, 1.2, "rgba(100,62,8,.38)"], [-1, -1, "rgba(255,255,255,.65)"]].forEach(([dx, dy, col]) => {
        ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.lineCap = "round";
        if (kind === 0) { starPath(ctx, x + dx, y + dy, r0); ctx.fill(); }
        else if (kind === 1) { heartPath(ctx, x + dx, y + dy, r0 * 0.85); ctx.fill(); }
        else { flakePath(ctx, x + dx, y + dy, r0); ctx.stroke(); }
      });
    }
  }

  // holographic sheen
  const hg = ctx.createLinearGradient(0, h, w, 0);
  [[0, "rgba(255,110,170,.16)"], [0.35, "rgba(120,210,255,.14)"], [0.65, "rgba(255,240,130,.16)"], [1, "rgba(190,130,255,.14)"]].forEach(([o, c]) => hg.addColorStop(o, c));
  ctx.fillStyle = hg; ctx.fillRect(0, 0, w, h);

  // glitter
  const rnd = rng(7);
  for (let i = 0; i < 220; i++) {
    const x = rnd() * w; const y = rnd() * h; const r = rnd() * 1.6 + 0.4;
    ctx.fillStyle = `rgba(255,255,255,${0.35 + rnd() * 0.4})`; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  for (let i = 0; i < 16; i++) {
    const x = rnd() * w; const y = rnd() * h; const s = 3 + rnd() * 4;
    ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x + s, y); ctx.moveTo(x, y - s); ctx.lineTo(x, y + s); ctx.stroke();
  }

  // frame
  ctx.setLineDash([7, 6]); ctx.strokeStyle = "rgba(105,73,27,.7)"; ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, w - 20, h - 20); ctx.setLineDash([]);
  ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1; ctx.strokeRect(14, 14, w - 28, h - 28);

  // central plate + text
  const pw = w * 0.66; const ph = h * 0.3; const px = (w - pw) / 2; const py = (h - ph) / 2;
  ctx.fillStyle = "rgba(105,60,8,.2)";
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(px, py, pw, ph, 18) : ctx.rect(px, py, pw, ph); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1.5; ctx.stroke();

  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  const t1 = Math.max(15, w * 0.058); const t2 = Math.max(11, w * 0.034);
  [[1.3, 1.3, "rgba(255,255,255,.7)"], [0, 0, "#69491b"]].forEach(([dx, dy, col]) => {
    ctx.fillStyle = col;
    ctx.font = `bold ${t1}px Georgia, serif`; ctx.fillText(TEXTS.foilTitle, w / 2 + dx, h / 2 - t1 * 0.35 + dy);
    ctx.font = `italic ${t2}px Georgia, serif`; ctx.fillText(TEXTS.foilSub, w / 2 + dx, h / 2 + t1 * 0.75 + dy);
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SecretCard() {
  const canvasRef = useRef(null);
  const fxRef = useRef(null);
  const winRef = useRef(null);
  const drawingRef = useRef(false);
  const lastRef = useRef(null);
  const touchedRef = useRef(false);
  const lastMeasureRef = useRef(0);
  const particlesRef = useRef([]);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const [revelee, setRevelee] = useState(false);
  const [progress, setProgress] = useState(0);
  const [burst, setBurst] = useState(0);

  // (re)paint the golden layer to the current size
  const initFoil = useCallback(() => {
    const canvas = canvasRef.current; const fx = fxRef.current; const win = winRef.current;
    if (!canvas || !fx || !win) return;
    const rect = win.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = window.devicePixelRatio || 1;
    [canvas, fx].forEach((c) => { c.width = Math.round(rect.width * ratio); c.height = Math.round(rect.height * ratio); });
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    sizeRef.current = { w: rect.width, h: rect.height };
    paintFoil(ctx, rect.width, rect.height);
  }, []);

  useEffect(() => {
    initFoil();
    const win = winRef.current;
    if (!win || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(() => { if (!touchedRef.current) initFoil(); });
    ro.observe(win);
    return () => ro.disconnect();
  }, [initFoil]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // golden flecks flying off while scratching
  const runFx = useCallback(() => {
    if (rafRef.current) return;
    const tick = () => {
      const fx = fxRef.current;
      const ctx = fx && fx.getContext("2d");
      if (!ctx) { rafRef.current = 0; return; }
      const ratio = window.devicePixelRatio || 1;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);
      const list = particlesRef.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.vy += 0.16; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.022;
        if (p.life <= 0 || p.y > sizeRef.current.h + 12) { list.splice(i, 1); continue; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s, -p.s * 0.6, p.s * 2, p.s * 1.2); ctx.restore();
      }
      if (list.length) rafRef.current = requestAnimationFrame(tick);
      else { rafRef.current = 0; ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h); }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // measure the scratched part on a tiny copy (cheap)
  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const sw = 64; const sh = 52;
    const tmp = document.createElement("canvas"); tmp.width = sw; tmp.height = sh;
    const t = tmp.getContext("2d");
    t.drawImage(canvas, 0, 0, sw, sh);
    const d = t.getImageData(0, 0, sw, sh).data;
    let clear = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] < 40) clear++;
    return clear / (sw * sh);
  }, []);

  const checkProgress = useCallback((force) => {
    const now = performance.now();
    if (!force && now - lastMeasureRef.current < 120) return;
    lastMeasureRef.current = now;
    const p = measure();
    setProgress(Math.min(1, p / REVEAL_AT));

    if (p >= REVEAL_AT) {
      setRevelee((was) => {
        if (!was) setBurst((b) => b + 1);
        return true;
      });
    }
  }, [measure]);

  // erase the golden layer where the finger / mouse passes
  const gratter = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const R = Math.max(16, rect.width * 0.045);
    touchedRef.current = true;

    ctx.globalCompositeOperation = "destination-out";
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#000"; // fully opaque: the brush must erase 100% of the foil
    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = R * 2;
    ctx.beginPath();
    const last = lastRef.current;
    ctx.moveTo(last ? last.x : x, last ? last.y : y);
    ctx.lineTo(x + 0.01, y);
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
    lastRef.current = { x, y };

    // flecks
    const cols = ["#f8dd86", "#e8b84a", "#fff3bf", "#c99a3a"];
    for (let i = 0; i < 4; i++) particlesRef.current.push({ x: x + (Math.random() - 0.5) * R, y: y + (Math.random() - 0.5) * R, vx: (Math.random() - 0.5) * 2.4, vy: -Math.random() * 2.2, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, s: 1.6 + Math.random() * 2.2, life: 1, c: cols[i % 4] });
    if (particlesRef.current.length > 140) particlesRef.current.splice(0, particlesRef.current.length - 140);
    runFx();

    checkProgress(false);
  };

  const recommencer = () => {
    particlesRef.current = [];
    touchedRef.current = false;
    lastRef.current = null;
    setRevelee(false);
    setProgress(0);
    initFoil();
  };

  const stars = useMemo(() => Array.from({ length: 30 }, (_, i) => ({ id: i, x: (i * 37 + 11) % 100, y: (i * 23 + 7) % 100, d: (i % 6) * 0.7, s: 8 + (i % 4) * 5, g: i % 3 === 0 ? "✦" : "·" })), []);
  const flakes = useMemo(() => { const r = rng(5); return Array.from({ length: 26 }, (_, i) => ({ id: i, left: r() * 100, size: r() * 4 + 2, dur: r() * 7 + 9, delay: -r() * 14, o: 0.3 + r() * 0.5 })); }, []);
  const bulbs = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ id: i, x: (i + 0.5) * (100 / 22), y: 8 + Math.abs(Math.sin(i * 0.8)) * 10, c: ["#ff5a5a", "#ffd45a", "#ff9ad5", "#7dd3fc", "#fff3bf"][i % 5] })), []);
  const confetti = useMemo(() => { const r = rng(9); return Array.from({ length: 36 }, (_, i) => ({ id: i, left: r() * 100, c: ["#ffd45a", "#ff6f9d", "#f6e7c1", "#7dd3fc", "#ff9ad5", "#fff3bf"][i % 6], dur: 4 + r() * 4, delay: -r() * 6, w: 6 + r() * 6 })); }, []);
  const hearts = useMemo(() => Array.from({ length: 8 }, (_, i) => ({ id: i, left: 6 + i * 12, d: (i * 0.9) % 6, s: 14 + (i % 4) * 5 })), []);

  const pct = Math.round(progress * 100);

  return (
    <main className="sc relative min-h-screen overflow-hidden">
      <style>{CSS}</style>
      <div className="sc-glow" aria-hidden="true" />
      {stars.map((s) => <span key={s.id} className="sc-star" style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: s.s, animationDelay: `${s.d}s` }} aria-hidden="true">{s.g}</span>)}
      {flakes.map((f) => <span key={f.id} className="sc-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true" />)}
      <div className="sc-lights" aria-hidden="true">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}><path d={`M0 2 ${bulbs.map((b) => `L${b.x} ${b.y}`).join(" ")} L100 2`} fill="none" stroke="#e8c878" strokeOpacity=".6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" /></svg>
        {bulbs.map((b) => <span key={b.id} className="sc-lb" style={{ left: `${b.x}%`, top: b.y * 1.1, background: b.c, boxShadow: `0 0 12px 3px ${b.c}`, animationDelay: `${(b.id % 5) * 0.4}s` }} />)}
      </div>

      {revelee && (
        <div key={burst} aria-hidden="true">
          {confetti.map((c) => <span key={c.id} className="sc-conf" style={{ left: `${c.left}%`, width: c.w, height: c.w * 1.5, background: c.c, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} />)}
          {hearts.map((h) => <span key={h.id} className="sc-heart" style={{ left: `${h.left}%`, bottom: "4%", fontSize: h.s, animationDelay: `${h.d}s` }}>❤</span>)}
        </div>
      )}

      <header className="sc-head">
        <Trio />
        <h1 className="sc-title">{TEXTS.title}</h1>
        <p className="sc-sub">{TEXTS.subtitle}</p>
      </header>

      <section className="sc-card" aria-label="Carte à gratter">
        <Bow />
        <Holly style={{ left: -14, bottom: -14, transform: "scaleY(-1)" }} />
        <Holly style={{ right: -14, bottom: -14, transform: "scale(-1,-1)" }} />

        <div className="sc-inner">
          <div className="sc-ct">
            <p className="sc-kick">{TEXTS.kicker}</p>
            <h2 className="sc-st">{TEXTS.scratchTitle}</h2>
          </div>

          <div className="sc-win" ref={winRef}>
            {/* Message placé SOUS le canvas */}
            <div className="sc-msg">
              <svg className="wm" viewBox="0 0 24 24" aria-hidden="true"><path d={HEART} fill="#fff" /></svg>
              <div className="h" aria-hidden="true">❤️</div>
              <h3>{TEXTS.msgTitle}</h3>
              <p>{TEXTS.msg}</p>
              <p className="sg">{TEXTS.msgSign}</p>
              <div className="sp" aria-hidden="true">✨ 💕 ✨</div>
            </div>

            {/* Surface à gratter : toujours présente au-dessus du message */}
            <canvas
              ref={canvasRef}
              className={`sc-canvas`}
              style={{ cursor: COIN_CURSOR }}
              onPointerDown={(event) => {
                drawingRef.current = true;
                lastRef.current = null;
                event.currentTarget.setPointerCapture(event.pointerId);
                gratter(event);
              }}
              onPointerMove={(event) => {
                if (drawingRef.current) gratter(event);
              }}
              onPointerUp={() => {
                drawingRef.current = false;
                lastRef.current = null;
                checkProgress(true);
              }}
              onPointerCancel={() => {
                drawingRef.current = false;
                lastRef.current = null;
              }}
              aria-label="Gratte la surface dorée pour révéler le message d’amour"
            />
            <canvas ref={fxRef} className="sc-fx" aria-hidden="true" />
          </div>

          <div className="sc-prog" aria-hidden="true">
            <span>🪙</span>
            <div className="sc-bar"><div className="sc-fill" style={{ width: `${revelee ? 100 : pct}%` }} /></div>
            <span className="sc-pct">{revelee ? 100 : pct}%</span>
          </div>
        </div>
      </section>

      <p className="sc-hint" aria-live="polite">{revelee ? TEXTS.hintDone : TEXTS.hint}</p>
      {revelee && <button type="button" className="sc-again" onClick={recommencer}>{TEXTS.again}</button>}

      <footer className="sc-foot">
        <p>{TEXTS.footer1}</p>
        <p>{TEXTS.footer2}</p>
      </footer>
    </main>
  );
}