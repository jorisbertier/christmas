import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ROUTES } from "./clockMysteryRoutes.js";
import { CLOCK_CODE, SOLUTION } from "./clockMysterySolution.js";
import {
  TITLE, INTRO, PHASES, CLOCKS, LOCATIONS, SUSPECTS, EVIDENCE, EVENTS, DEDUCTIONS, FALSE_CONCLUSIONS, PUZZLES,
  SEQUENCE_ITEMS, TRACE_OWNERS, TRACES, METHODS, INTERVALS, EXPLANATIONS, VICTORY,
} from "./clockMysteryStory.js";
import { DIALOGUES } from "./clockMysteryDialogues.js";
import * as G from "./clockMysteryLogic.js";
import {
  Portrait, SceneDefs, Sky, House, Tower, TownHall, Greenhouse, Barn, Plaza, SmallFir, Lamp, Garland, rng,
} from "./clockMysteryArt.jsx";

/* ------------------------------------------------------------------ */
/*  Spanish UI texts                                                   */
/* ------------------------------------------------------------------ */

const T = {
  suspects: "Sospechosos", evidence: "Pruebas", timeline: "Cronología", deductions: "Deducciones", puzzles: "Acertijos",
  hints: "Pistas", accuse: "Acusar", close: "Cerrar", start: "Comenzar la investigación", next: "Continuar",
  phase: "Fase", examine: "Examinar", present: "Presentar una prueba", back: "Volver",
  status: { untouched: "Sin investigar", suspect: "Sospechoso", questioned: "Coartada cuestionada", partial: "Parcialmente exculpado", cleared: "Exculpado con pruebas" },
};
const STATUS_COLOR = { untouched: "#8a97b3", suspect: "#e8b84a", questioned: "#f08a3c", partial: "#6cb4e8", cleared: "#5fd08a" };

const loc = (id) => LOCATIONS.find((l) => l.id === id);
const sus = (id) => SUSPECTS.find((s) => s.id === id);
const ev = (id) => EVIDENCE.find((e) => e.id === id);

/* ------------------------------------------------------------------ */
/*  Styles (same family as the choir scene)                            */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&display=swap');
.mm-stage{container-type:size;position:relative;display:flex;flex-direction:column;overflow:hidden;color:#f3e9d2;user-select:none;
  font-family:'Cormorant Garamond',Georgia,serif;background:linear-gradient(180deg,#070f26 0%,#10234c 55%,#24457d 100%)}
.mm-snow{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:5}
.mm-bar{position:relative;z-index:12;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.5em 1em;padding:1.1cqh 2cqw .4cqh}
.mm-title{margin:0;font-style:italic;font-weight:700;line-height:1;font-size:clamp(17px,min(2.8cqw,4.4cqh),34px);
  background:linear-gradient(180deg,#fffbe0,#f8dd86 40%,#d9a336 70%,#fbe493);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 rgba(10,20,50,.6))}
.mm-phase{display:flex;align-items:center;gap:.5em;font-size:clamp(11px,min(1.5cqw,2.3cqh),15px);color:#d9c9a0}
.mm-candles{display:flex;gap:4px}.mm-candles i{width:9px;height:9px;border-radius:50%;border:1px solid #e8b84a;display:block}
.mm-candles i.on{background:radial-gradient(circle at 35% 30%,#fff,#ffd45a 55%,#c98a1e);box-shadow:0 0 8px #ffd45a}
.mm-nav{display:flex;flex-wrap:wrap;gap:.35em}
@container (max-width:600px){.mm-nav{flex-wrap:nowrap;overflow-x:auto;width:100%;padding-bottom:.2em}.mm-btn{font-size:13px;padding:.3em .7em}.mm-title{font-size:19px}}
.mm-btn{padding:.35em .85em;border-radius:999px;border:1px solid rgba(232,184,74,.55);background:rgba(8,18,40,.78);color:#f3e9d2;cursor:pointer;
  font-family:inherit;font-weight:600;font-size:clamp(13px,min(1.7cqw,2.6cqh),18px);transition:all .15s ease;white-space:nowrap}
.mm-btn:hover{background:rgba(232,184,74,.22);transform:translateY(-1px)}
.mm-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}
.mm-btn.gold{background:linear-gradient(180deg,#fff3bf,#e8b84a 55%,#c98a1e);color:#5a0f19;border-color:#fde68a;box-shadow:0 3px 0 #8a5a12}
.mm-btn.gold:hover{background:linear-gradient(180deg,#fff8d6,#f0c45a 55%,#d99a2e)}
.mm-btn.small{font-size:13px;padding:.25em .7em}
.mm-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
.mm-btn .n{display:inline-block;min-width:1.4em;margin-left:.35em;padding:0 .35em;border-radius:99px;background:#e8b84a;color:#4a0f19;font-size:.8em;text-align:center}
.mm-scene{position:relative;flex:1;min-height:0;z-index:2}
.mm-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.mm-spot{cursor:pointer;outline:none}
.mm-spot:hover .mm-ring,.mm-spot:focus-visible .mm-ring{opacity:1}
.mm-spot:hover .mm-art{filter:brightness(1.18)}
.mm-ring{opacity:0;transition:opacity .2s ease}
.mm-spot.locked .mm-art{filter:saturate(.35) brightness(.7)}
.mm-new{animation:mm-pulse 1.6s ease-in-out infinite}
@keyframes mm-pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.25)}}
.mm-planner{position:absolute;left:1.2cqw;bottom:1.2cqh;z-index:8;background:rgba(8,18,40,.88);border:1px solid rgba(232,184,74,.5);border-radius:14px;padding:.5em .8em;font-size:clamp(12px,min(1.5cqw,2.3cqh),16px);max-width:min(46cqw,380px)}
.mm-planner-btn{position:absolute;left:1.2cqw;bottom:1.2cqh;z-index:8}
.mm-planner select{background:#0c1a38;color:#f3e9d2;border:1px solid #6a7aa8;border-radius:8px;padding:.15em .3em;font-family:inherit;font-size:inherit;max-width:9.5em}
.mm-planner b{color:#ffd45a}
.mm-toast{position:absolute;left:50%;bottom:calc(1.6cqh + 4em);transform:translateX(-50%);z-index:30;max-width:min(92cqw,640px);text-align:center;
  background:rgba(8,18,40,.95);border:1px solid #e8b84a;border-radius:14px;padding:.55em 1.1em;font-size:clamp(14px,min(1.9cqw,2.8cqh),20px);animation:mm-pop .35s cubic-bezier(.3,1.5,.5,1) both;box-shadow:0 8px 30px rgba(0,0,0,.5)}
.mm-toast.evidence{border-color:#fff3bf;box-shadow:0 0 28px rgba(255,214,120,.6),0 8px 30px rgba(0,0,0,.5)}
@keyframes mm-pop{0%{opacity:0;transform:translate(-50%,10px) scale(.85)}100%{opacity:1;transform:translate(-50%,0)}}
.mm-flash{position:absolute;inset:0;z-index:28;pointer-events:none;background:radial-gradient(circle at 50% 55%,rgba(255,230,150,.55),transparent 55%);animation:mm-flash .9s ease-out both}
@keyframes mm-flash{0%{opacity:0}20%{opacity:1}100%{opacity:0}}
.mm-overlay{position:absolute;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:2cqh 2cqw 10cqh;background:rgba(2,6,17,.62);backdrop-filter:blur(2px);animation:mm-fade .2s ease both}
@keyframes mm-fade{from{opacity:0}to{opacity:1}}
.mm-panel{display:flex;flex-direction:column;width:min(100%,980px);max-height:100%;background:linear-gradient(180deg,rgba(14,28,58,.97),rgba(8,16,36,.97));border:1px solid #e8b84a;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 0 3px rgba(232,184,74,.12);animation:mm-rise .3s cubic-bezier(.2,.9,.3,1) both}
.mm-panel.narrow{width:min(100%,640px)}
@keyframes mm-rise{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}
.mm-panel>header{display:flex;align-items:center;justify-content:space-between;gap:1em;padding:.7em 1.1em;border-bottom:1px solid rgba(232,184,74,.3)}
.mm-panel h2{margin:0;font-style:italic;font-size:clamp(20px,min(2.8cqw,4cqh),30px);color:#ffe9b0}
.mm-x{width:2.2em;height:2.2em;border-radius:50%;border:1px solid #e8b84a;background:rgba(8,18,40,.9);color:#ffe9b0;font-size:20px;line-height:1;cursor:pointer}
.mm-x:hover{background:#e8b84a;color:#4a0f19}
.mm-body{padding:1em 1.2em;overflow-y:auto;font-size:clamp(15px,min(1.9cqw,2.7cqh),19px);line-height:1.4;user-select:text}
.mm-body h3{margin:.2em 0 .4em;color:#ffd45a;font-style:italic;font-size:1.15em}
.mm-body p{margin:.35em 0}
.mm-muted{color:#a9b4d0;font-size:.9em}
.mm-grid{display:grid;gap:.7em;grid-template-columns:repeat(auto-fill,minmax(min(100%,190px),1fr))}
.mm-card{display:flex;flex-direction:column;align-items:center;gap:.3em;padding:.6em;border:1px solid rgba(232,184,74,.35);border-radius:14px;background:rgba(16,32,68,.7);text-align:center;cursor:pointer;color:inherit;font-family:inherit;transition:all .15s ease}
.mm-card:hover,.mm-card.sel{border-color:#ffd45a;background:rgba(40,60,110,.8);transform:translateY(-2px)}
.mm-card:focus-visible{outline:2px solid #fff}
.mm-chip{display:inline-block;padding:.05em .6em;border-radius:99px;font-size:.78em;font-weight:700;color:#0c1530}
.mm-row{display:flex;gap:.8em;flex-wrap:wrap;align-items:center}
.mm-two{display:grid;gap:1em;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr)}
@container (max-width:700px){.mm-two{grid-template-columns:1fr}}
.mm-list{display:flex;flex-direction:column;gap:.4em}
.mm-item{display:flex;gap:.6em;align-items:flex-start;padding:.5em .7em;border-radius:10px;border:1px solid rgba(232,184,74,.25);background:rgba(16,32,68,.55);cursor:pointer;color:inherit;font-family:inherit;text-align:left;font-size:inherit}
.mm-item:hover,.mm-item.sel{border-color:#ffd45a;background:rgba(40,60,110,.75)}
.mm-item.done{border-color:#5fd08a}
.mm-item:disabled{opacity:.5;cursor:not-allowed}
.mm-bubble{max-width:92%;padding:.5em .8em;border-radius:14px;margin:.3em 0;animation:mm-pop2 .25s ease both}
@keyframes mm-pop2{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.mm-bubble.npc{background:#f3e9d2;color:#2b1a10;border-bottom-left-radius:4px}
.mm-bubble.you{background:#2c4a8a;color:#fff;margin-left:auto;border-bottom-right-radius:4px}
.mm-bubble.note{background:rgba(232,184,74,.18);border:1px dashed #e8b84a;color:#ffe9b0;font-size:.92em;margin:.3em auto;text-align:center}
.mm-log{display:flex;flex-direction:column;max-height:34cqh;overflow-y:auto;padding:.2em .4em}
.mm-input,.mm-select{background:#0c1a38;color:#f3e9d2;border:1px solid #6a7aa8;border-radius:8px;padding:.3em .5em;font-family:inherit;font-size:inherit}
.mm-paper{background:#f3e9d2;color:#2b1a10;border-radius:6px;padding:.7em .9em;box-shadow:0 4px 14px rgba(0,0,0,.4);font-family:'Caveat','Segoe Script',cursive;font-size:1.25em;line-height:1.25}
.mm-mono{font-family:ui-monospace,Menlo,Consolas,monospace;letter-spacing:.08em;word-break:break-word}
.mm-ok{color:#5fd08a}.mm-bad{color:#ff8a6a}
.mm-hint{margin:.3em 0;padding:.4em .7em;border-left:3px solid #6cb4e8;background:rgba(108,180,232,.12);border-radius:0 8px 8px 0}
.mm-digit{display:inline-flex;align-items:center;justify-content:center;width:1.5em;height:1.9em;margin:0 .1em;border-radius:8px;background:linear-gradient(180deg,#fff3bf,#e8b84a);color:#4a0f19;font-weight:700;font-size:2.4em;box-shadow:0 4px 0 #8a5a12,0 0 24px rgba(255,214,120,.7);animation:mm-digit .7s cubic-bezier(.3,1.5,.5,1) both}
@keyframes mm-digit{from{opacity:0;transform:rotateX(90deg) scale(.6)}to{opacity:1;transform:none}}
.mm-win{position:absolute;inset:0;z-index:40;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.6em;padding:2cqh 4cqw;text-align:center;overflow-y:auto;
  background:radial-gradient(120% 90% at 50% 20%,rgba(30,50,100,.985),rgba(4,8,20,.995))}
.mm-win p{max-width:46em;margin:.2em 0;font-size:clamp(15px,min(2.1cqw,3cqh),22px);animation:mm-pop2 .8s ease both}
.mm-clockface{width:clamp(110px,24cqh,200px);aspect-ratio:1}
.mm-hand{transform-origin:50px 50px}
.mm-hand.min{animation:mm-spin 3.2s cubic-bezier(.3,.8,.3,1) both}
.mm-hand.hour{animation:mm-spin2 3.2s cubic-bezier(.3,.8,.3,1) both}
@keyframes mm-spin{from{transform:rotate(-1080deg)}to{transform:rotate(0)}}
@keyframes mm-spin2{from{transform:rotate(-90deg)}to{transform:rotate(0)}}
.mm-bell{transform-origin:50% 0;animation:mm-ring 1.1s ease-in-out 3.2s 6 alternate}
@keyframes mm-ring{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
.m-tw1{animation:m-tw 1.6s ease-in-out infinite}.m-tw2{animation:m-tw 2.4s ease-in-out infinite}.m-tw3{animation:m-tw 3.2s ease-in-out infinite}
@keyframes m-tw{0%,100%{opacity:1}50%{opacity:.3}}
.m-flick{animation:m-flick 2.4s steps(1) infinite}.m-lit{animation:m-flick 4.4s steps(1) infinite}
@keyframes m-flick{0%{opacity:1}12%{opacity:.86}24%{opacity:.97}41%{opacity:.8}55%{opacity:.95}72%{opacity:.84}88%{opacity:1}}
.m-puff{opacity:0;transform-box:fill-box;transform-origin:center;animation:m-puff 4s ease-out infinite}
@keyframes m-puff{0%{opacity:.5;transform:translate(0,0) scale(.6)}100%{opacity:0;transform:translate(16px,-46px) scale(2.4)}}
.m-star{transform-box:fill-box;transform-origin:center;animation:m-star 3s ease-in-out infinite}
@keyframes m-star{0%,100%{transform:scale(1) rotate(0)}50%{transform:scale(.88) rotate(10deg)}}
.m-flag{transform-box:fill-box;transform-origin:left center;animation:m-flag 2.4s ease-in-out infinite alternate}
@keyframes m-flag{from{transform:skewY(-5deg)}to{transform:skewY(5deg)}}
@media (prefers-reduced-motion: reduce){.m-tw1,.m-tw2,.m-tw3,.m-flick,.m-lit,.m-puff,.m-star,.m-flag,.mm-new,.mm-hand,.mm-bell{animation:none !important}}
`;

/* ------------------------------------------------------------------ */
/*  Persistence + state hook                                           */
/* ------------------------------------------------------------------ */

function loadState() {
  const raw = G.safeGet(G.STORAGE.progress);
  if (raw) {
    try {
      const p = JSON.parse(raw);
      if (p && p.v === 1) return { ...G.initialState(), ...p, offsets: { ...G.initialState().offsets, ...(p.offsets || {}) } };
    } catch (e) { /* corrupted save: start again */ }
  }
  return G.initialState();
}

function useMystery() {
  const [state, setState] = useState(loadState);
  const ref = useRef(state);
  ref.current = state;
  useEffect(() => { G.safeSet(G.STORAGE.progress, JSON.stringify(state)); }, [state]);
  const set = useCallback((fn) => {
    const next = typeof fn === "function" ? fn(ref.current) : fn;
    ref.current = next;
    setState(next);
    return next;
  }, []);
  return [state, set, ref];
}

function useSnow(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, last = performance.now();
    const resize = () => { const r = canvas.getBoundingClientRect(); const d = Math.min(window.devicePixelRatio || 1, 2); W = r.width; H = r.height; canvas.width = Math.round(W * d); canvas.height = Math.round(H * d); ctx.setTransform(d, 0, 0, d, 0, 0); };
    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(canvas);
    const sprite = (soft) => { const n = 32; const s = document.createElement("canvas"); s.width = n; s.height = n; const c = s.getContext("2d"); const g = c.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(soft ? 0.2 : 0.5, `rgba(255,255,255,${soft ? 0.65 : 1})`); g.addColorStop(1, "rgba(255,255,255,0)"); c.fillStyle = g; c.fillRect(0, 0, n, n); return s; };
    const sharp = sprite(false), soft = sprite(true);
    const r = rng(314);
    const flakes = Array.from({ length: reduce ? 50 : 150 }, () => { const depth = Math.pow(r(), 1.6); return { x: r(), y: r(), depth, size: 0.8 + depth * 5, a: 0.3 + (1 - depth) * 0.4, vy: 0.14 + depth * 0.8, ph: r() * 6.28, fr: 0.4 + r() * 1.1, am: 0.1 + r() * 0.35, soft: depth > 0.72 }; });
    const tick = (now) => {
      const dt = Math.min(3, (now - last) / 16.67); last = now; const t = now / 1000;
      const wind = Math.sin(t * 0.17) * 0.35 + 0.15;
      ctx.clearRect(0, 0, W, H);
      for (const f of flakes) {
        f.x += ((Math.sin(t * f.fr + f.ph) * f.am + wind * (0.3 + f.depth)) * dt) / W; f.y += (f.vy * dt) / H;
        if (f.y > 1.04) { f.y = -0.04; f.x = Math.random(); } if (f.x > 1.05) f.x = -0.05; if (f.x < -0.05) f.x = 1.05;
        const s = f.size * (f.soft ? 1.4 : 1.2); ctx.globalAlpha = Math.max(0.1, f.a);
        ctx.drawImage(f.soft ? soft : sharp, f.x * W - s, f.y * H - s, s * 2, s * 2);
      }
      ctx.globalAlpha = 1; raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); if (ro) ro.disconnect(); };
  }, [canvasRef]);
}

/* ------------------------------------------------------------------ */
/*  Small shared UI                                                    */
/* ------------------------------------------------------------------ */

function Panel({ title, onClose, children, narrow }) {
  return (
    <div className="mm-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className={`mm-panel ${narrow ? "narrow" : ""}`} role="dialog" aria-modal="true" aria-label={title}>
        <header><h2>{title}</h2><button className="mm-x" onClick={onClose} aria-label={T.close}>×</button></header>
        <div className="mm-body">{children}</div>
      </section>
    </div>
  );
}

const Chip = ({ status }) => <span className="mm-chip" style={{ background: STATUS_COLOR[status] }}>{T.status[status]}</span>;

function Avatar({ id, size = 54, status }) {
  return (
    <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle,#2c4a8a,#10234c)", border: `3px solid ${STATUS_COLOR[status || "untouched"]}`, flex: "none" }}>
      <span style={{ display: "block", marginTop: size * 0.08, marginLeft: -size * 0.02 }}><Portrait id={id} size={size * 1.04} /></span>
    </span>
  );
}

function Hints({ puzzleId, state, set }) {
  const p = PUZZLES.find((x) => x.id === puzzleId);
  const used = state.hints[puzzleId] || 0;
  const more = () => set((s) => ({ ...s, hints: { ...s.hints, [puzzleId]: Math.min(3, (s.hints[puzzleId] || 0) + 1) } }));
  return (
    <div style={{ marginTop: ".8em" }}>
      {p.hints.slice(0, used).map((h, i) => <div key={i} className="mm-hint"><b>Pista {i + 1}:</b> {h}</div>)}
      {used < 3 && <button className="mm-btn small" onClick={more}>Pedir pista {used + 1} de 3 <span className="mm-muted">(resta puntos)</span></button>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Route planner (shortest path on the village graph)                 */
/* ------------------------------------------------------------------ */

function RoutePlanner({ has, compact }) {
  const [openPlan, setOpenPlan] = useState(!!compact);
  const [from, setFrom] = useState("torre");
  const [via, setVia] = useState("");
  const [to, setTo] = useState("posada");
  const stops = [from, ...(via ? [via] : []), to];
  const r = G.routeVia(ROUTES, stops, has);
  const opts = LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.name.replace(/^(La |El )/, "")}</option>);
  if (!openPlan) return <button className="mm-btn mm-planner-btn" onClick={() => setOpenPlan(true)} aria-label="Abrir el planificador de rutas">🧭 Planificador de rutas</button>;
  return (
    <div className={compact ? "" : "mm-planner"}>
      {!compact && <button className="mm-x" style={{ position: "absolute", right: 6, top: 6, width: "1.8em", height: "1.8em", fontSize: 14 }} onClick={() => setOpenPlan(false)} aria-label="Cerrar planificador">×</button>}
      <div className="mm-row" style={{ gap: ".4em", paddingRight: compact ? 0 : "1.6em" }}>
        <select aria-label="Origen" value={from} onChange={(e) => setFrom(e.target.value)}>{opts}</select>
        <span>→</span>
        <select aria-label="Pasando por" value={via} onChange={(e) => setVia(e.target.value)}><option value="">(directo)</option>{opts}</select>
        <span>→</span>
        <select aria-label="Destino" value={to} onChange={(e) => setTo(e.target.value)}>{opts}</select>
      </div>
      <div style={{ marginTop: ".3em" }}>
        {Number.isFinite(r.minutes) ? <><b>{r.minutes} min</b> como mínimo · <span className="mm-muted">{r.path.map((p) => loc(p).name.replace(/^(La |El )/, "")).join(" → ")}</span></> : "Sin ruta conocida"}
        {has("ev:ev_mapa") && <div className="mm-muted">Incluye el camino del jardín (torre ↔ invernadero, 4 min).</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAP                                                                */
/* ------------------------------------------------------------------ */

const BUILDINGS = {
  torre: (l) => <Tower x={l.x} y={l.y} />,
  plaza: (l) => <Plaza x={l.x} y={l.y} />,
  relojeria: (l) => <House x={l.x} y={l.y} w={84} floors={2} wall="timber" seed={4} />,
  correos: (l) => <House x={l.x} y={l.y} w={100} floors={2} wall="timber" roof="mTile" seed={5}><g transform="translate(62 0)"><rect x="-6" y="-26" width="12" height="26" rx="3" fill="#c8202e" /><rect x="-4" y="-22" width="8" height="3" fill="#15101a" /></g></House>,
  posada: (l) => <House x={l.x} y={l.y} w={140} floors={2} wall="log" seed={6} lantern><g transform="translate(-86 -80)"><path d="M0 -10V8" stroke="#3a1608" strokeWidth="2" /><rect x="-12" y="8" width="24" height="16" rx="3" fill="#7a4a2a" stroke="#d9a936" /><path d="M-6 14H6" stroke="#ffd45a" strokeWidth="2" /></g></House>,
  ayuntamiento: (l) => <TownHall x={l.x} y={l.y} />,
  taller: (l) => <House x={l.x} y={l.y} w={140} floors={2} wall="timber" roof="mTile" seed={7}><g transform="translate(-92 -30)"><rect x="-14" y="-20" width="28" height="20" fill="#a8582a" /><circle cx="-8" cy="2" r="4" fill="#3a1608" /><circle cx="8" cy="2" r="4" fill="#3a1608" /></g></House>,
  almacen: (l) => <Barn x={l.x} y={l.y} />,
  casa_vigilante: (l) => <House x={l.x} y={l.y} w={70} floors={1} wall="log" seed={8} lantern />,
  invernadero: (l) => <Greenhouse x={l.x} y={l.y} />,
};

function MapScene({ state, has, onOpen, onLocked }) {
  const placed = [...LOCATIONS].sort((a, b) => a.y - b.y);
  const roads = ROUTES.filter((r) => !r.requires || has(r.requires));
  return (
    <svg className="mm-svg" viewBox="0 0 1200 730" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Mapa del pueblo">
      <SceneDefs />
      <Sky />
      {/* roads with their walking time */}
      <g>
        {roads.map((r) => {
          const a = loc(r.a), b = loc(r.b);
          const garden = !!r.requires;
          const x1 = a.x, y1 = a.y + 10, x2 = b.x, y2 = b.y + 10;
          return (
            <g key={r.a + r.b}>
              <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={garden ? "#e8b84a" : "#ffffff"} strokeOpacity={garden ? 0.9 : 0.55} strokeWidth={garden ? 5 : 16} strokeLinecap="round" strokeDasharray={garden ? "2 9" : undefined} />
              <g transform={`translate(${(x1 + x2) / 2} ${(y1 + y2) / 2})`}>
                <circle r="12" fill="#10234c" stroke="#e8b84a" strokeWidth="1.5" />
                <text textAnchor="middle" y="4.5" fontSize="13" fontWeight="700" fill="#ffe9b0" fontFamily="Georgia,serif">{r.min}′</text>
              </g>
            </g>
          );
        })}
      </g>
      <Garland x1={405} y1={290} x2={600} y2={190} sag={16} seed={1} />
      <Garland x1={600} y1={190} x2={815} y2={290} sag={16} seed={2} n={10} />
      <SmallFir x={60} y={470} s={0.5} /><SmallFir x={1150} y={450} s={0.5} /><SmallFir x={640} y={700} s={0.36} /><SmallFir x={930} y={690} s={0.42} /><SmallFir x={90} y={390} s={0.45} /><SmallFir x={230} y={690} s={0.38} />
      <Lamp x={470} y={560} s={0.7} /><Lamp x={940} y={600} s={0.7} />
      {placed.map((l) => {
        const unlocked = G.locationUnlocked(state, l);
        const people = l.people;
        return (
          <g key={l.id} className={`mm-spot ${unlocked ? "" : "locked"}`} tabIndex={0} role="button" aria-label={`${l.name}${unlocked ? "" : " (bloqueado)"}`}
            onClick={() => (unlocked ? onOpen(l.id) : onLocked(l))}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), unlocked ? onOpen(l.id) : onLocked(l))}>
            <ellipse className="mm-ring" cx={l.x} cy={l.y + 4} rx="96" ry="18" fill="none" stroke="#ffd45a" strokeWidth="3" />
            <g className="mm-art">{BUILDINGS[l.id](l)}</g>
            <g transform={`translate(${l.x} ${l.y + 22})`}>
              <rect x={-l.name.length * 4.1 - 8} y="-12" width={l.name.length * 8.2 + 16} height="22" rx="11" fill="#0a1630" stroke="#e8b84a" strokeOpacity=".7" />
              <text textAnchor="middle" y="4" fontSize="14" fill="#ffe9b0" fontFamily="'Cormorant Garamond',Georgia,serif" fontWeight="700">{unlocked ? l.name : `🔒 ${l.name}`}</text>
            </g>
            {unlocked && !state.visited[l.id] && <circle className="mm-new" cx={l.x + 70} cy={l.y - 70} r="7" fill="#ffd45a" />}
            {unlocked && people.map((p, i) => (
              <g key={p} transform={`translate(${l.x - 78 - i * 34} ${l.y - 4})`}>
                <circle r="17" fill="#10234c" stroke={STATUS_COLOR[G.statusOf(state, p)]} strokeWidth="3" />
                <svg x="-15" y="-16" width="30" height="32" viewBox="14 18 72 76" overflow="hidden"><Portrait id={p} size={72} /></svg>
              </g>
            ))}
          </g>
        );
      })}
      <rect x="-1500" y="-1200" width="4200" height="2400" fill="url(#mVig)" pointerEvents="none" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  LOCATION                                                           */
/* ------------------------------------------------------------------ */

function LocationPanel({ id, state, onClose, onExamine, onTalk, found }) {
  const l = loc(id);
  return (
    <Panel title={l.name} onClose={onClose}>
      <p>{l.blurb}</p>
      <div className="mm-two">
        <div>
          <h3>Objetos</h3>
          <div className="mm-list">
            {l.objects.map((o) => {
              const done = o.gives && state.evidence.includes(o.gives);
              return (
                <button key={o.id} className={`mm-item ${done ? "done" : ""}`} onClick={() => onExamine(l.id, o.id)}>
                  <span aria-hidden="true">{done ? "✔" : "🔍"}</span><span>{o.name}{done && <span className="mm-muted"> — examinado</span>}</span>
                </button>
              );
            })}
          </div>
          {found && <div className="mm-bubble note" style={{ marginTop: ".7em" }} key={found.k}>{found.text}</div>}
        </div>
        <div>
          <h3>Personas</h3>
          {l.people.length === 0 && <p className="mm-muted">No hay nadie aquí.</p>}
          <div className="mm-list">
            {l.people.map((p) => (
              <button key={p} className="mm-item" onClick={() => onTalk(p)}>
                <Avatar id={p} size={46} status={G.statusOf(state, p)} />
                <span><b>{sus(p).name}</b><br /><span className="mm-muted">{sus(p).role}</span></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  INTERROGATION                                                      */
/* ------------------------------------------------------------------ */

function TalkPanel({ who, state, onClose, doTopic, doPresent, markMet }) {
  const s = sus(who);
  const [log, setLog] = useState([]);
  const [showEv, setShowEv] = useState(false);
  const end = useRef(null);
  useEffect(() => { markMet(who); setLog([{ k: "npc", text: DIALOGUES[who].intro }]); }, [who]); // eslint-disable-line
  useEffect(() => { if (end.current) end.current.scrollTop = end.current.scrollHeight; }, [log]);
  const push = (items) => setLog((l) => [...l, ...items]);
  const topics = G.topicsFor(state, who);
  const asked = (t) => state.asked[`${who}:${t.id}`];
  return (
    <Panel title={`${s.name} · ${s.role}`} onClose={onClose}>
      <div className="mm-two" style={{ gridTemplateColumns: "minmax(0,.7fr) minmax(0,1.6fr)" }}>
        <div style={{ textAlign: "center" }}>
          <Avatar id={who} size={110} status={G.statusOf(state, who)} /><br />
          <Chip status={G.statusOf(state, who)} />
          <p className="mm-muted" style={{ marginTop: ".5em" }}>{s.personality}</p>
          <p className="mm-muted"><i>Declaración inicial:</i> {s.alibi}</p>
        </div>
        <div>
          <div className="mm-log" ref={end} aria-live="polite">
            {log.map((m, i) => <div key={i} className={`mm-bubble ${m.k}`}>{m.text}</div>)}
          </div>
          <h3 style={{ marginTop: ".6em" }}>Preguntar</h3>
          <div className="mm-list">
            {topics.map((t) => (
              <button key={t.id} className={`mm-item ${asked(t) ? "done" : ""}`} onClick={() => push(doTopic(who, t))}>
                <span aria-hidden="true">💬</span><span>{t.q}</span>
              </button>
            ))}
            <button className="mm-item" onClick={() => setShowEv((v) => !v)} disabled={state.evidence.length === 0}><span aria-hidden="true">📎</span><span>{T.present}…</span></button>
          </div>
          {showEv && (
            <div className="mm-list" style={{ marginTop: ".5em", maxHeight: "22cqh", overflowY: "auto" }}>
              {state.evidence.map((id) => (
                <button key={id} className="mm-item" onClick={() => { setShowEv(false); push(doPresent(who, id)); }}>
                  <span aria-hidden="true">🗂</span><span>{ev(id).name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  SUSPECTS / EVIDENCE                                                */
/* ------------------------------------------------------------------ */

function SuspectsPanel({ state, onClose, onGo }) {
  const [sel, setSel] = useState(null);
  const s = sel && sus(sel);
  return (
    <Panel title={T.suspects} onClose={onClose}>
      <p className="mm-muted">Que alguien mienta no significa que sea culpable: distingue mentira, omisión, sospecha y prueba.</p>
      <div className="mm-grid">
        {SUSPECTS.map((x) => {
          const st = G.statusOf(state, x.id);
          return (
            <button key={x.id} className={`mm-card ${sel === x.id ? "sel" : ""}`} onClick={() => setSel(x.id)}>
              <Avatar id={x.id} size={72} status={st} />
              <b>{x.name}</b><span className="mm-muted">{x.role}</span><Chip status={st} />
            </button>
          );
        })}
      </div>
      {s && (
        <div style={{ marginTop: "1em", padding: ".8em", border: "1px solid rgba(232,184,74,.4)", borderRadius: 14, background: "rgba(16,32,68,.6)" }}>
          <h3>{s.name} — {s.role}</h3>
          <p>{s.bio}</p>
          <p><i>Personalidad:</i> {s.personality}</p>
          <p><i>Coartada declarada:</i> {s.alibi}</p>
          <p><i>Pruebas relacionadas descubiertas:</i> {EVIDENCE.filter((e) => e.related.includes(s.id) && state.evidence.includes(e.id)).map((e) => e.name).join(" · ") || "ninguna todavía"}</p>
          {(() => { const l = LOCATIONS.find((q) => q.people.includes(s.id)); return l && G.locationUnlocked(state, l) ? <button className="mm-btn small" onClick={() => onGo(l.id)}>Ir a {l.name}</button> : null; })()}
        </div>
      )}
    </Panel>
  );
}

function EvidencePanel({ state, onClose }) {
  const [sel, setSel] = useState(state.evidence[state.evidence.length - 1] || null);
  const [place, setPlace] = useState("");
  const [cat, setCat] = useState("");
  const [sort, setSort] = useState("found");
  let list = state.evidence.map(ev).filter((e) => (!place || e.place === place) && (!cat || e.category === cat));
  if (sort === "hour") list = [...list].sort((a, b) => (a.time ? G.toMin(a.time) : 9999) - (b.time ? G.toMin(b.time) : 9999));
  const e = sel && ev(sel);
  return (
    <Panel title={`${T.evidence} (${state.evidence.length})`} onClose={onClose}>
      <div className="mm-row" style={{ marginBottom: ".7em" }}>
        <select className="mm-select" value={place} onChange={(x) => setPlace(x.target.value)} aria-label="Filtrar por lugar"><option value="">Todos los lugares</option>{LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
        <select className="mm-select" value={cat} onChange={(x) => setCat(x.target.value)} aria-label="Filtrar por categoría"><option value="">Todas las categorías</option>{["mecanismo", "documento", "rastro", "objeto"].map((c) => <option key={c} value={c}>{c}</option>)}</select>
        <select className="mm-select" value={sort} onChange={(x) => setSort(x.target.value)} aria-label="Ordenar"><option value="found">Por descubrimiento</option><option value="hour">Por hora</option></select>
      </div>
      {state.evidence.length === 0 ? <p className="mm-muted">Todavía no has encontrado ninguna prueba. Explora los lugares del mapa.</p> : (
        <div className="mm-two">
          <div className="mm-list" style={{ maxHeight: "46cqh", overflowY: "auto" }}>
            {list.map((x) => <button key={x.id} className={`mm-item ${sel === x.id ? "sel" : ""}`} onClick={() => setSel(x.id)}><span aria-hidden="true">🗂</span><span><b>{x.name}</b><br /><span className="mm-muted">{loc(x.place).name}{x.time ? ` · ${x.time}` : ""}</span></span></button>)}
          </div>
          {e && (
            <div>
              <h3>{e.name}</h3>
              <p>{G.evidenceDesc(state, e)}</p>
              <p className="mm-muted"><i>Lugar:</i> {loc(e.place).name} · <i>Tipo:</i> {e.category}{e.time ? <> · <i>Hora relacionada:</i> {e.time}</> : null}</p>
              <div className="mm-row">{e.related.map((r) => <span key={r} className="mm-row" style={{ gap: ".3em" }}><Avatar id={r} size={28} />{sus(r).name.split(" ")[0]}</span>)}</div>
              <p className="mm-hint"><b>Cuidado:</b> {e.misreading}</p>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  TIMELINE (the clock puzzle)                                        */
/* ------------------------------------------------------------------ */

function TimelinePanel({ state, set, onClose, notify }) {
  const has = G.makeHas(state);
  const events = G.clocksList(state);
  const routes = ROUTES;
  const v = G.validateTimeline(events, state.offsets, routes, has);
  const solved = !!state.flags.timeline_solved;
  const adj = (id, d) => set((s) => ({ ...s, offsets: { ...s.offsets, [id]: (s.offsets[id] || 0) + d } }));
  const check = () => {
    if (G.clocksSolved(state.offsets, state.events)) {
      const r = G.applyEffects(state, { sets: ["timeline_solved"] });
      set(r.state); notify("¡Relojes ajustados! Ahora las horas son comparables.", "evidence");
    } else notify("Todavía hay horas que no coinciden: compara de nuevo los testigos de los cuartos de las 23:45.");
  };
  const name = (id) => (id ? sus(id)?.name.split(" ")[0] : "");
  return (
    <Panel title={T.timeline} onClose={onClose}>
      <p className="mm-muted">Distingue la <b>hora declarada</b>, la <b>hora registrada</b> y la <b>hora real estimada</b>. Los desajustes de los relojes los ajustas tú; las contradicciones las interpretas tú.</p>
      <h3>Relojes del pueblo</h3>
      <div className="mm-grid">
        {CLOCKS.map((c) => {
          const o = state.offsets[c.id] || 0;
          return (
            <div key={c.id} className="mm-card" style={{ cursor: "default" }}>
              <b>{c.name}</b>
              <span className="mm-row" style={{ gap: ".4em" }}>
                <button className="mm-btn small" onClick={() => adj(c.id, -1)} aria-label={`Atrasar ${c.name}`}>−</button>
                <span style={{ minWidth: "5.5em" }}>{o === 0 ? "en hora" : o > 0 ? `adelanta ${o} min` : `atrasa ${-o} min`}</span>
                <button className="mm-btn small" onClick={() => adj(c.id, 1)} aria-label={`Adelantar ${c.name}`}>+</button>
              </span>
            </div>
          );
        })}
      </div>
      <div className="mm-row" style={{ margin: ".7em 0" }}>
        <button className="mm-btn gold" onClick={check} disabled={solved}>{solved ? "Relojes ajustados ✔" : "Comprobar ajuste"}</button>
        {!solved && <Hints puzzleId="clocks" state={state} set={set} />}
      </div>
      <h3>Testimonios ordenados por hora real estimada</h3>
      {events.length === 0 ? <p className="mm-muted">Aún no tienes testimonios con hora. Interroga y examina.</p> : (
        <div className="mm-list">
          {v.rows.map((r) => (
            <div key={r.id} className="mm-item" style={{ cursor: "default", alignItems: "center" }}>
              <b className="mm-mono" style={{ minWidth: "9.5em" }}>{G.fmt(r.tReal)}{r.t2Real ? `–${G.fmt(r.t2Real)}` : ""}</b>
              <span>{r.text} <span className="mm-muted">[{r.t}{r.t2 ? `–${r.t2}` : ""} · {r.clock === "torre" ? "hora real" : CLOCKS.find((c) => c.id === r.clock)?.name.replace("Reloj de bolsillo del ", "").replace("Reloj de la ", "").replace("Reloj de ", "").replace("Reloj del ", "")}]</span>{r.claim && <span className="mm-chip" style={{ background: "#f08a3c", marginLeft: ".5em" }}>declaración</span>}</span>
            </div>
          ))}
        </div>
      )}
      <h3 style={{ marginTop: ".8em" }}>Comprobaciones</h3>
      <div className="mm-list">
        {v.groups.map((g) => (
          <div key={g.id} className="mm-hint" style={{ borderColor: g.agree ? "#5fd08a" : "#f08a3c" }}>
            {g.id === "bell" ? "Los tres testigos de los cuartos" : "Los dos testigos de la luz en la torre"}: {g.agree ? <span className="mm-ok">coinciden a las {G.fmt(g.at)} ✔</span> : <span className="mm-bad">no coinciden (diferencia de {g.spread} min)</span>}
          </div>
        ))}
        {v.checks.map((c, i) => (
          <div key={i} className="mm-hint" style={{ borderColor: c.ok ? "#5fd08a" : "#ff8a6a" }}>
            <b>{name(c.who)}</b>: de {loc(c.a.place).name.replace(/^(La |El )/, "")} ({G.fmt(c.a.kind === "span" ? c.a.t2Real : c.a.tReal)}) a {loc(c.b.place).name.replace(/^(La |El )/, "")} ({G.fmt(c.b.tReal)}): hay {c.gap} min y se necesitan {c.need} → {c.ok ? <span className="mm-ok">posible (margen {c.gap - c.need} min)</span> : <span className="mm-bad">imposible</span>}
          </div>
        ))}
        {v.contradictions.map((c, i) => (
          <div key={i} className="mm-hint" style={{ borderColor: "#f08a3c" }}>
            <b>Contradicción · {name(c.who)}</b>: {c.why === "elsewhere" ? `afirma estar en ${loc(c.claim.place).name} pero otro testimonio lo sitúa en ${loc(c.other.place).name}` : `afirma no salir de ${loc(c.claim.place).name} pero otro testimonio dice que salió a las ${G.fmt(c.other.tReal)}`}. <span className="mm-muted">Ser contradicho no equivale a ser culpable.</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  DEDUCTIONS                                                         */
/* ------------------------------------------------------------------ */

const CONCLUSIONS = (() => {
  const all = [...DEDUCTIONS.map((d) => d.conclusion), ...FALSE_CONCLUSIONS];
  const r = rng(5);
  return all.map((c) => [r(), c]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
})();

function DeductionsPanel({ state, set, onClose, notify }) {
  const [picked, setPicked] = useState([]);
  const [concl, setConcl] = useState("");
  const [msg, setMsg] = useState("");
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < 3 ? [...p, id] : p));
  const test = () => {
    const r = G.tryDeduction(state, picked, concl);
    if (r.ok) {
      if (state.deductions.includes(r.deduction.id)) return setMsg("Ya habías llegado a esta conclusión.");
      const fx = G.applyEffects(state, { sets: r.deduction.sets });
      set({ ...fx.state, deductions: [...state.deductions, r.deduction.id] });
      setMsg("¡Teoría confirmada! Se desbloquean nuevas lecturas de los hechos.");
      notify("Nueva deducción confirmada.", "evidence");
      setPicked([]); setConcl("");
    } else setMsg({ wrong: "Esa conclusión no se sostiene con lo que sabes.", evidence: "Esas pruebas no bastan para sostener esa conclusión (o te sobra alguna).", early: "La idea es buena, pero todavía te falta resolver algo antes (relojes, cifrado o testimonios)." }[r.reason]);
  };
  return (
    <Panel title={T.deductions} onClose={onClose}>
      <p className="mm-muted">Relaciona pruebas y elige la conclusión que de verdad se desprende de ellas. No todas son ciertas.</p>
      <div className="mm-two">
        <div>
          <h3>1 · Elige 2 o 3 pruebas</h3>
          <div className="mm-list" style={{ maxHeight: "34cqh", overflowY: "auto" }}>
            {state.evidence.map((id) => <button key={id} className={`mm-item ${picked.includes(id) ? "sel" : ""}`} onClick={() => toggle(id)} aria-pressed={picked.includes(id)}><span>{picked.includes(id) ? "☑" : "☐"}</span><span>{ev(id).name}</span></button>)}
            {state.evidence.length === 0 && <p className="mm-muted">Aún no tienes pruebas.</p>}
          </div>
        </div>
        <div>
          <h3>2 · ¿Qué se deduce?</h3>
          <div className="mm-list" style={{ maxHeight: "34cqh", overflowY: "auto" }}>
            {CONCLUSIONS.map((c) => <button key={c} className={`mm-item ${concl === c ? "sel" : ""}`} onClick={() => setConcl(c)} aria-pressed={concl === c}><span>{concl === c ? "◉" : "○"}</span><span>{c}</span></button>)}
          </div>
        </div>
      </div>
      <div className="mm-row" style={{ marginTop: ".8em" }}>
        <button className="mm-btn gold" disabled={picked.length < 2 || !concl} onClick={test}>Probar teoría</button>
        <span aria-live="polite">{msg}</span>
      </div>
      {state.deductions.length > 0 && (
        <>
          <h3 style={{ marginTop: "1em" }}>Tus deducciones</h3>
          <div className="mm-list">{state.deductions.map((id) => <div key={id} className="mm-item done" style={{ cursor: "default" }}><span>✔</span><span>{DEDUCTIONS.find((d) => d.id === id).conclusion}</span></div>)}</div>
        </>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  PUZZLES                                                            */
/* ------------------------------------------------------------------ */

const solvedFlag = (id) => ({ travel: "travel_solved", clocks: "timeline_solved", cipher: "cipher_solved", traces: "traces_solved", cross: "cross_solved", sequence: "sequence_solved" }[id]);

function PuzzleList({ state, onClose, onOpen }) {
  const has = G.makeHas(state);
  return (
    <Panel title={T.puzzles} onClose={onClose}>
      <div className="mm-list">
        {PUZZLES.map((p) => {
          const ok = G.puzzleAvailable(state, p);
          const done = !!state.flags[solvedFlag(p.id)];
          return (
            <button key={p.id} className={`mm-item ${done ? "done" : ""}`} disabled={!ok} onClick={() => onOpen(p.id)}>
              <span aria-hidden="true">{done ? "✔" : ok ? "🧩" : "🔒"}</span>
              <span><b>{p.title}</b><br /><span className="mm-muted">{ok ? p.intro : p.lockedText}</span></span>
            </button>
          );
        })}
      </div>
      <p className="mm-muted" style={{ marginTop: ".8em" }}>{has("flag:sequence_solved") ? "Has reconstruido toda la noche. ¿Lista para acusar?" : "Resolver acertijos te ayuda a entender la noche, pero no hay una única forma de avanzar."}</p>
    </Panel>
  );
}

function PuzzlePanel({ id, state, set, onClose, notify }) {
  const p = PUZZLES.find((x) => x.id === id);
  const done = !!state.flags[solvedFlag(id)];
  const has = G.makeHas(state);
  const win = (extra) => { const r = G.applyEffects(state, { sets: [solvedFlag(id)] }); set(r.state); notify(extra || "¡Acertijo resuelto!", "evidence"); };
  const [msg, setMsg] = useState("");
  // travel
  const [mins, setMins] = useState("");
  const [verdict, setVerdict] = useState("");
  // cipher
  const [shift, setShift] = useState(0);
  // traces
  const [tr, setTr] = useState({ clavos: "", fieltro: "", tacon: "" });
  // cross
  const [cw, setCw] = useState("");
  const [cp, setCp] = useState("");
  // sequence
  const [order, setOrder] = useState(["s_plaza", "s_insp", "s_pasador", "s_posada", "s_stop", "s_foto", "s_torre", "s_relojeria"]);
  const move = (i, d) => setOrder((o) => { const n = [...o]; const j = i + d; if (j < 0 || j >= n.length) return o; [n[i], n[j]] = [n[j], n[i]]; return n; });

  let body = null;
  if (id === "travel") {
    const S = SOLUTION.puzzles.travel;
    body = (<>
      <div className="mm-paper">«23:30 plaza. 23:48 torre cerrada, sin novedad. 23:52 café en la posada.»<br /><small>— Diario de rondas de Casimiro</small></div>
      <p className="mm-muted" style={{ marginTop: ".5em" }}>Berta dice que entró en la cocina a las 23:43 (hora real) y no salió hasta las 23:56.</p>
      <RoutePlanner has={has} compact />
      <div className="mm-row" style={{ margin: ".6em 0" }}>
        <label>Mínimo torre → posada: <input className="mm-input" style={{ width: "4em" }} inputMode="numeric" value={mins} onChange={(e) => setMins(e.target.value)} /> min</label>
        <select className="mm-select" value={verdict} onChange={(e) => setVerdict(e.target.value)} aria-label="Veredicto"><option value="">¿Es posible?</option><option value="posible">Posible</option><option value="imposible">Imposible</option></select>
        <button className="mm-btn gold" disabled={done} onClick={() => (Number(mins) === S.minutes && verdict === S.verdict ? (win("¡Correcto! Una de las dos entradas del diario es falsa."), setMsg("Correcto: entre las 23:48 y las 23:52 solo hay 4 minutos y la ruta más corta cuesta 5. El diario no puede ser verdad entero.")) : setMsg("No cuadra todavía. Usa el planificador con la ruta exacta."))}>Comprobar</button>
      </div>
    </>);
  } else if (id === "cipher") {
    const S = SOLUTION.puzzles.cipher;
    const dec = G.decodeCipher(G.CIPHER_TEXT, shift);
    body = (<>
      <p className="mm-muted">Pista de la carta: «Clave: n.º del mecanismo».</p>
      <div className="mm-paper mm-mono" style={{ fontFamily: "inherit" }}><span className="mm-mono" style={{ fontSize: ".78em" }}>{G.CIPHER_TEXT}</span></div>
      <div className="mm-row" style={{ margin: ".6em 0" }}>
        <button className="mm-btn small" onClick={() => setShift((s) => (s + 26) % 27)} aria-label="Menos">−</button>
        <b>Desplazamiento: {shift}</b>
        <button className="mm-btn small" onClick={() => setShift((s) => (s + 1) % 27)} aria-label="Más">+</button>
        <button className="mm-btn gold" disabled={done} onClick={() => (shift === S.shift ? (win("Carta descifrada: la estrella de la torre se rompió."), setMsg("")) : setMsg("Ese desplazamiento no produce un texto con sentido."))}>Confirmar clave</button>
      </div>
      <div className="mm-paper"><span className="mm-mono" style={{ fontSize: ".75em" }}>{dec}</span></div>
    </>);
  } else if (id === "traces") {
    const S = SOLUTION.puzzles.traces;
    body = (<>
      <p>Tres rastros junto a la puerta de la torre. Asigna cada uno a quien lo dejó.</p>
      {TRACES.map((t) => (
        <div key={t.id} className="mm-row" style={{ margin: ".4em 0" }}>
          <b style={{ minWidth: "14em" }}>{t.label}</b>
          <select className="mm-select" value={tr[t.id]} onChange={(e) => setTr({ ...tr, [t.id]: e.target.value })} aria-label={t.label}><option value="">¿De quién?</option>{TRACE_OWNERS.map((o) => <option key={o} value={o}>{sus(o).name}</option>)}</select>
        </div>
      ))}
      <button className="mm-btn gold" disabled={done} onClick={() => { const n = Object.keys(S).filter((k) => tr[k] === S[k]).length; if (n === 3) { win("¡Los tres rastros identificados!"); setMsg("Los clavos son de Eloy, el fieltro de Pip (entrega de las 17:30) y la muesca del talón coincide con las botas remendadas de la relojería."); } else setMsg(`${n} de 3 correctos. Revisa las botas, el registro y las huellas.`); }}>Comprobar</button>
    </>);
  } else if (id === "cross") {
    const S = SOLUTION.puzzles.cross;
    body = (<>
      <div className="mm-list">
        <div className="mm-paper">Madeleine: «Estuve sola en mi despacho.»</div>
        <div className="mm-paper">Anselmo: «Pip estuvo conmigo en el taller toda la noche.»</div>
        <div className="mm-paper">Pip: «Anselmo salió a las 23:20 a tomar el aire.»</div>
        <div className="mm-paper">Factura de la posada: «Dos chocolates con canela para la alcaldesa y su invitado, 23:31 (reloj de la posada).»</div>
      </div>
      <div className="mm-row" style={{ margin: ".6em 0" }}>
        <span>Con Madeleine estuvo</span>
        <select className="mm-select" value={cw} onChange={(e) => setCw(e.target.value)} aria-label="Persona"><option value="">…</option>{TRACE_OWNERS.concat(["nora"]).map((o) => <option key={o} value={o}>{sus(o).name}</option>)}</select>
        <span>en</span>
        <select className="mm-select" value={cp} onChange={(e) => setCp(e.target.value)} aria-label="Lugar"><option value="">…</option>{LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
        <button className="mm-btn gold" disabled={done} onClick={() => (cw === S.who && cp === S.where ? (win("¡Mentiras que no son sabotaje!"), setMsg("Anselmo y Madeleine se reunieron en secreto en el ayuntamiento: ambos mintieron para proteger su reputación.")) : setMsg("Esa combinación no explica a la vez los cuatro testimonios."))}>Comprobar</button>
      </div>
    </>);
  } else if (id === "sequence") {
    body = (<>
      <p>Ordena los hechos de la noche con sus <b>horas reales</b>, del primero al último.</p>
      <div className="mm-list">
        {order.map((sid, i) => (
          <div key={sid} className="mm-item" style={{ cursor: "default", alignItems: "center" }}>
            <span className="mm-row" style={{ gap: ".2em", flex: "none" }}><button className="mm-btn small" onClick={() => move(i, -1)} aria-label="Subir">▲</button><button className="mm-btn small" onClick={() => move(i, 1)} aria-label="Bajar">▼</button></span>
            <span>{SEQUENCE_ITEMS.find((s) => s.id === sid).text.replace(/^\d\d:\d\d — /, "")}</span>
          </div>
        ))}
      </div>
      <button className="mm-btn gold" style={{ marginTop: ".6em" }} disabled={done} onClick={() => (order.join() === SOLUTION.puzzles.sequence.join() ? (win("¡Has reconstruido el último campanazo!"), setMsg("Orden correcto: de la inspección de las 22:30 a la detención del reloj a las 00:00.")) : setMsg("Algo no encaja en el orden. Revisa las horas reales de la cronología."))}>Comprobar</button>
    </>);
  }
  return (
    <Panel title={p.title} onClose={onClose}>
      <p>{p.intro}</p>
      {body}
      {done && <p className="mm-ok">✔ Resuelto.</p>}
      <p aria-live="polite" style={{ minHeight: "1.4em" }}>{msg}</p>
      {!done && <Hints puzzleId={id} state={state} set={set} />}
    </Panel>
  );
}

function HintsPanel({ state, set, onClose }) {
  const [open, setOpen] = useState(null);
  return (
    <Panel title={T.hints} onClose={onClose} narrow>
      <p><b>Sugerencia:</b> {G.nextSuggestion(state)}</p>
      <p className="mm-muted">Las pistas por acertijo tienen tres niveles. Usarlas resta puntos, pero nunca te impide ganar la llave. Pistas usadas: {G.hintsUsed(state)}.</p>
      <div className="mm-list">{PUZZLES.map((p) => <button key={p.id} className={`mm-item ${open === p.id ? "sel" : ""}`} onClick={() => setOpen(p.id)} disabled={!G.puzzleAvailable(state, p)}><span>🧩</span><span>{p.title}</span></button>)}</div>
      {open && <Hints puzzleId={open} state={state} set={set} />}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  ACCUSATION + VICTORY                                               */
/* ------------------------------------------------------------------ */

function AccusePanel({ state, onClose, onSubmit }) {
  const [sel, setSel] = useState({ culprit: "", method: "", interval: "", explanation: "", evidence: [] });
  const [fb, setFb] = useState("");
  const toggleEv = (id) => setSel((s) => ({ ...s, evidence: s.evidence.includes(id) ? s.evidence.filter((x) => x !== id) : s.evidence.length < 3 ? [...s.evidence, id] : s.evidence }));
  const ready = sel.culprit && sel.method && sel.interval && sel.explanation && sel.evidence.length === 3;
  const Radio = ({ group, items }) => (
    <div className="mm-list">{items.map((i) => <button key={i.id} className={`mm-item ${sel[group] === i.id ? "sel" : ""}`} onClick={() => setSel({ ...sel, [group]: i.id })} aria-pressed={sel[group] === i.id}><span>{sel[group] === i.id ? "◉" : "○"}</span><span>{i.text}</span></button>)}</div>
  );
  return (
    <Panel title="Acusación final" onClose={onClose}>
      <p className="mm-muted">Si te equivocas no pasa nada: podrás seguir investigando. Una buena teoría explica quién, cómo, cuándo y por qué su coartada es imposible.</p>
      <h3>1 · ¿Quién saboteó el reloj?</h3>
      <div className="mm-grid">{SUSPECTS.map((s) => <button key={s.id} className={`mm-card ${sel.culprit === s.id ? "sel" : ""}`} onClick={() => setSel({ ...sel, culprit: s.id })} aria-pressed={sel.culprit === s.id}><Avatar id={s.id} size={56} status={sel.culprit === s.id ? "suspect" : "untouched"} /><b>{s.name}</b></button>)}</div>
      <h3>2 · ¿Cómo lo hizo?</h3><Radio group="method" items={METHODS} />
      <h3>3 · ¿Cuándo?</h3><Radio group="interval" items={INTERVALS} />
      <h3>4 · Tres pruebas que lo respalden ({sel.evidence.length}/3)</h3>
      <div className="mm-list">{state.evidence.map((id) => <button key={id} className={`mm-item ${sel.evidence.includes(id) ? "sel" : ""}`} onClick={() => toggleEv(id)} aria-pressed={sel.evidence.includes(id)}><span>{sel.evidence.includes(id) ? "☑" : "☐"}</span><span>{ev(id).name}</span></button>)}</div>
      <h3>5 · ¿Por qué su coartada es imposible?</h3><Radio group="explanation" items={EXPLANATIONS} />
      <div className="mm-row" style={{ marginTop: "1em" }}>
        <button className="mm-btn gold" disabled={!ready} onClick={() => setFb(onSubmit(sel))}>Formular acusación</button>
        {!ready && <span className="mm-muted">Completa los cinco apartados.</span>}
      </div>
      {fb && <div className="mm-hint" style={{ borderColor: "#f08a3c", marginTop: ".8em" }} aria-live="polite">{fb}</div>}
    </Panel>
  );
}

function Victory({ state, onClose, onContinue }) {
  const digits = CLOCK_CODE.split("");
  return (
    <div className="mm-win" role="dialog" aria-label="Victoria">
      <svg className="mm-clockface" viewBox="0 0 100 130" aria-hidden="true">
        <g className="mm-bell"><path d="M38 2Q50 -4 62 2L70 20H30Z" fill="url(#mGold)" /><circle cx="50" cy="22" r="4" fill="#a8721f" /></g>
        <circle cx="50" cy="75" r="44" fill="#fff8e8" stroke="#a8721f" strokeWidth="4" />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d="M50 35V40" stroke="#3a2410" strokeWidth="2" transform={`rotate(${i * 30} 50 75)`} />)}
        <g transform="translate(0 25)"><path className="mm-hand hour" d="M50 50V30" stroke="#3a2410" strokeWidth="4" strokeLinecap="round" /><path className="mm-hand min" d="M50 50V18" stroke="#3a2410" strokeWidth="3" strokeLinecap="round" /><circle cx="50" cy="50" r="3.5" fill="#a8721f" /></g>
        <defs><linearGradient id="mGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".5" stopColor="#e8b84a" /><stop offset="1" stopColor="#a8721f" /></linearGradient></defs>
      </svg>
      <h2 style={{ margin: 0, fontStyle: "italic", fontSize: "clamp(24px,5cqh,44px)", color: "#ffe9b0" }}>¡Caso resuelto!</h2>
      {VICTORY.map((t, i) => <p key={i} style={{ animationDelay: `${3.2 + i * 1.6}s` }}>{t}</p>)}
      <div style={{ animation: "mm-pop2 .8s ease 8s both" }}>
        <div aria-label="Código de la llave">{digits.map((d, i) => <span key={i} className="mm-digit" style={{ animationDelay: `${8.4 + i * 0.25}s` }}>{d}</span>)}</div>
        <p>🗝️ La llave dorada abre el gran reloj del pueblo en otra sección del sitio. Guarda este código: <b className="mm-mono">{CLOCK_CODE}</b></p>
        <p className="mm-muted">Puntuación: {state.score} · Pistas usadas: {G.hintsUsed(state)}</p>
        <div className="mm-row" style={{ justifyContent: "center" }}>
          <button className="mm-btn" onClick={onClose}>Volver al pueblo</button>
          {onContinue && <button className="mm-btn gold" onClick={onContinue}>Ir al reloj del pueblo</button>}
        </div>
      </div>
    </div>
  );
}

function Intro({ onStart }) {
  const [i, setI] = useState(0);
  return (
    <div className="mm-win" role="dialog" aria-label="Introducción">
      <h1 className="mm-title" style={{ fontSize: "clamp(26px,6cqh,52px)" }}>{TITLE}</h1>
      <p key={i}>{INTRO[i]}</p>
      <div className="mm-candles" aria-hidden="true">{INTRO.map((_, k) => <i key={k} className={k <= i ? "on" : ""} />)}</div>
      {i < INTRO.length - 1 ? <button className="mm-btn gold" onClick={() => setI(i + 1)}>{T.next}</button> : <button className="mm-btn gold" onClick={onStart}>{T.start}</button>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default function ClockMystery({ onComplete }) {
  const [state, set, ref] = useMystery();
  const [panel, setPanel] = useState(null);
  const [toast, setToast] = useState(null);
  const [flash, setFlash] = useState(0);
  const [found, setFound] = useState(null);
  const canvasRef = useRef(null);
  const toastTimer = useRef(0);
  useSnow(canvasRef);
  const has = G.makeHas(state);

  const notify = useCallback((text, kind) => {
    clearTimeout(toastTimer.current);
    setToast({ text, kind, k: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 5200);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const apply = useCallback((fx) => {
    const r = G.applyEffects(ref.current, fx);
    set(r.state);
    if (r.added.evidence.length) {
      setFlash((f) => f + 1);
      notify(`Nueva prueba: ${r.added.evidence.map((id) => ev(id).name).join(" · ")}`, "evidence");
    } else if (r.added.events.length) notify("Cronología actualizada con un nuevo testimonio.");
    return r;
  }, [notify, ref, set]);

  // Esc closes the open panel
  useEffect(() => {
    const k = (e) => { if (e.key === "Escape" && panel && panel.type !== "victory" && panel.type !== "intro") setPanel(null); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [panel]);

  // Gentle nudge when the player is stuck for a while
  useEffect(() => {
    const id = setInterval(() => {
      const s = ref.current;
      if (s.completed || !s.started || panel) return;
      if (Date.now() - s.lastProgress > 5 * 60 * 1000) { notify(`¿Atascada? ${G.nextSuggestion(s)}`); set({ ...s, lastProgress: Date.now() }); }
    }, 30000);
    return () => clearInterval(id);
  }, [panel, notify, ref, set]);

  const open = (id) => { set((s) => ({ ...s, visited: { ...s.visited, [id]: true } })); setFound(null); setPanel({ type: "location", id }); };
  const examine = (locId, objId) => {
    const r = G.examineObject(ref.current, locId, objId);
    if (!r) return;
    setFound({ text: r.text, k: Date.now() });
    if (r.fx.gives && r.fx.gives.length) apply(r.fx);
  };
  const markMet = (who) => { if (!ref.current.flags[`met:${who}`]) apply({ sets: [`met:${who}`] }); };
  const doTopic = (who, t) => {
    const r = G.resolveTopic(ref.current, who, t.id);
    if (!r) return [];
    const res = apply(r.fx);
    set((s) => ({ ...s, asked: { ...s.asked, [`${who}:${t.id}`]: true } }));
    const out = [{ k: "you", text: t.q }, { k: "npc", text: r.text }];
    res.added.evidence.forEach((id) => out.push({ k: "note", text: `🗂 Nueva prueba: ${ev(id).name}` }));
    if (res.added.events.length) out.push({ k: "note", text: "🕰 Testimonio añadido a la cronología" });
    return out;
  };
  const doPresent = (who, evId) => {
    const r = G.resolvePresent(ref.current, who, evId);
    const res = apply(r.fx);
    const out = [{ k: "you", text: `Le muestras: ${ev(evId).name}.` }, { k: "npc", text: r.text }];
    res.added.evidence.forEach((id) => out.push({ k: "note", text: `🗂 Nueva prueba: ${ev(id).name}` }));
    if (res.added.events.length) out.push({ k: "note", text: "🕰 Testimonio añadido a la cronología" });
    return out;
  };

  const accuse = (sel) => {
    const r = G.evaluateAccusation(sel);
    if (r.ok) {
      const done = G.finishVictory({ ...ref.current, flags: { ...ref.current.flags } });
      set(done);
      setPanel({ type: "victory" });
      return "";
    }
    set((s) => ({ ...s, wrong: s.wrong + 1 }));
    return r.feedback;
  };

  const phase = G.phaseOf(state);
  const nav = [
    ["suspects", T.suspects], ["evidence", T.evidence, state.evidence.length], ["timeline", T.timeline], ["deductions", T.deductions],
    ["puzzles", T.puzzles], ["hints", T.hints],
  ];
  const close = () => setPanel(null);

  return (
    <div className="mm-stage relative h-full min-h-[100svh] w-full max-h-full max-w-full overflow-hidden">
      <style>{CSS}</style>

      <header className="mm-bar">
        <div>
          <h1 className="mm-title">{TITLE}</h1>
          <div className="mm-phase"><span className="mm-candles" aria-hidden="true">{PHASES.map((_, i) => <i key={i} className={i < phase ? "on" : ""} />)}</span><span>{T.phase} {phase} · {PHASES[phase - 1]}</span></div>
        </div>
        <nav className="mm-nav" aria-label="Herramientas de investigación">
          {nav.map(([id, label, n]) => <button key={id} className="mm-btn" onClick={() => setPanel({ type: id })}>{label}{n ? <span className="n">{n}</span> : null}</button>)}
          <button className="mm-btn gold right-10" onClick={() => setPanel({ type: "accuse" })}>{T.accuse}</button>
        </nav>
      </header>

      <div className="mm-scene">
        <MapScene state={state} has={has} onOpen={open} onLocked={(l) => notify(`🔒 ${l.unlockText}`)} />
        <RoutePlanner has={has} />
      </div>

      <canvas ref={canvasRef} className="mm-snow" />
      {flash > 0 && <div key={flash} className="mm-flash" />}
      {toast && <div key={toast.k} className={`mm-toast ${toast.kind || ""}`} role="status">{toast.text}</div>}

      {panel?.type === "location" && <LocationPanel id={panel.id} state={state} found={found} onClose={close} onExamine={examine} onTalk={(who) => setPanel({ type: "talk", who, from: panel.id })} />}
      {panel?.type === "talk" && <TalkPanel who={panel.who} state={state} onClose={() => (panel.from ? setPanel({ type: "location", id: panel.from }) : close())} doTopic={doTopic} doPresent={doPresent} markMet={markMet} />}
      {panel?.type === "suspects" && <SuspectsPanel state={state} onClose={close} onGo={open} />}
      {panel?.type === "evidence" && <EvidencePanel state={state} onClose={close} />}
      {panel?.type === "timeline" && <TimelinePanel state={state} set={set} onClose={close} notify={notify} />}
      {panel?.type === "deductions" && <DeductionsPanel state={state} set={set} onClose={close} notify={notify} />}
      {panel?.type === "puzzles" && <PuzzleList state={state} onClose={close} onOpen={(id) => setPanel(id === "clocks" ? { type: "timeline" } : { type: "puzzle", id })} />}
      {panel?.type === "puzzle" && <PuzzlePanel id={panel.id} state={state} set={set} onClose={() => setPanel({ type: "puzzles" })} notify={notify} />}
      {panel?.type === "hints" && <HintsPanel state={state} set={set} onClose={close} />}
      {panel?.type === "accuse" && <AccusePanel state={state} onClose={close} onSubmit={accuse} />}
      {panel?.type === "victory" && <Victory state={state} onClose={close} onContinue={onComplete} />}
      {!state.started && panel?.type !== "victory" && <Intro onStart={() => set((s) => ({ ...s, started: true }))} />}
      {state.completed && !panel && (
        <button className="mm-btn gold" style={{ position: "absolute", right: "2cqw", bottom: "2cqh", zIndex: 12 }} onClick={() => setPanel({ type: "victory" })}>🗝️ Ver la llave</button>
      )}
    </div>
  );
}
