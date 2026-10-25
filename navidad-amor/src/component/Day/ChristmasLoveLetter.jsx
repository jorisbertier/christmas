import { memo, useCallback, useEffect, useRef, useState } from "react";

/**
 * ChristmasLoveLetter — un seul fichier, Tailwind + keyframes embarquées, zéro dépendance.
 *
 * <ChristmasLoveLetter
 *   open={letterOpen}
 *   onClose={() => setLetterOpen(false)}
 *   onComplete={() => {}}
 *   onMusicPause={() => villageMusic.pause()}     // votre gestionnaire audio existant
 *   onMusicResume={() => villageMusic.resume()}
 *   soundEnabled
 *   envelopeTheme="red"        // "red" (rouge profond + ruban vert) | "ivory" (ivoire + ruban rouge)
 *   blur={false}               // true = flou sur le village (plus joli mais plus gourmand)
 *   title="…" paragraphs={[…]} signature="…"
 * />
 */

const DEFAULT_TITLE = "Para mi amor ❤️";
const DEFAULT_PARAGRAPHS = [
  "Mi amor, si pudiera regalarte algo esta Navidad, te regalaría la posibilidad de verte a través de mis ojos, para que pudieras comprender lo especial que eres para mí.",
  "Aunque estemos lejos, quiero que sientas que estoy contigo en cada pequeño momento. La distancia no cambia lo que siento por ti ni las ganas que tengo de construir nuestro futuro juntos.",
  "Gracias por formar parte de mi vida, por tus abrazos, tus sonrisas y todos esos pequeños momentos que hacen que seas tan importante para mí.",
  "Esta Navidad, mi deseo más bonito no está debajo del árbol. Es poder seguir compartiendo mi vida contigo, crear recuerdos juntos y abrazarte muy pronto. Te amo, hoy y siempre. ❤️",
];
const DEFAULT_SIGNATURE = "Con todo mi amor, para siempre. ❤️";

const PHASES = ["envelope", "opening", "extracting", "unfolding", "reading", "finished"];
const SCRIPT = "'Pinyon Script', 'Snell Roundhand', 'Brush Script MT', cursive";
const SERIF = "'Cormorant Garamond', 'Palatino Linotype', Georgia, serif";

const THEMES = {
  red: {
    l: ["#b8182f", "#7d0f20"], r: ["#961227", "#5a0816"], b: ["#c92039", "#8c1226"],
    flap: ["#d52b44", "#a01529"], edge: "#3a040f", gold: "#f2d27a",
    rib: ["#06281a", "#1f7d4e", "#0e4d2d"],
  },
  ivory: {
    l: ["#fffaf0", "#eadfca"], r: ["#f0e5ce", "#d6c8ac"], b: ["#fffdf7", "#efe4cf"],
    flap: ["#fffefa", "#f1e7d3"], edge: "#8a6d3c", gold: "#d1a43a",
    rib: ["#5a0915", "#cc2a44", "#8e1428"],
  },
};

const heartPath = "M12 21 C 5 15.5 2 12 2 8.5 A 5 5 0 0 1 12 6.5 A 5 5 0 0 1 22 8.5 C 22 12 19 15.5 12 21 Z";
const leafPath = "M0 0 C 6 -9 12 -12 16 -10 C 18 -17 25 -18 29 -13 C 33 -20 41 -19 44 -12 C 49 -14 56 -8 60 0 C 56 8 49 14 44 12 C 41 19 33 20 29 13 C 25 18 18 17 16 10 C 12 12 6 9 0 0 Z";
const oldLeaf = "M0 0 C 10 -14 22 -12 30 -22 C 34 -10 48 -8 58 0 C 48 8 50 22 36 22 C 28 14 14 20 0 0 Z";

const KEYFRAMES = `
@keyframes cll-enter{from{opacity:0;transform:translateY(34px) scale(.72)}to{opacity:1;transform:none}}
@keyframes cll-float{0%,100%{transform:translateY(-7px) rotate(-.9deg)}50%{transform:translateY(7px) rotate(.9deg)}}
@keyframes cll-fall{from{transform:translate3d(0,-8vh,0)}to{transform:translate3d(var(--dx),108vh,0)}}
@keyframes cll-rise{0%{opacity:0;transform:translateY(0) scale(.6)}15%{opacity:1}100%{opacity:0;transform:translateY(-70vh) scale(1.1)}}
@keyframes cll-halo{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.95;transform:scale(1.06)}}
@keyframes cll-glow{0%,100%{opacity:.15}50%{opacity:.9}}
@keyframes cll-twinkle{0%,100%{opacity:0;transform:scale(.4) rotate(0)}50%{opacity:1;transform:scale(1.15) rotate(45deg)}}
@keyframes cll-sweep{0%,55%{transform:translateX(-130%) skewX(-18deg)}100%{transform:translateX(130%) skewX(-18deg)}}
@keyframes cll-jingle{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes cll-bowidle{0%,100%{transform:rotate(-1.2deg) scale(1)}50%{transform:rotate(1.2deg) scale(1.025)}}
@keyframes cll-untie{0%{transform:translateY(0) scale(1) rotate(0);opacity:1}18%{transform:translateY(5%) scale(.95) rotate(-2deg);opacity:1}100%{transform:translateY(-95%) scale(1.3) rotate(16deg);opacity:0}}
@keyframes cll-ribbon-out{0%,22%{opacity:1;transform:none}100%{opacity:0;transform:translateY(12%) scaleX(.6)}}
@keyframes cll-crack-l{0%{transform:none;opacity:1}100%{transform:translate(-55%,120%) rotate(-38deg);opacity:0}}
@keyframes cll-crack-r{0%{transform:none;opacity:1}100%{transform:translate(55%,120%) rotate(38deg);opacity:0}}
@keyframes cll-shard{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--sx),var(--sy)) rotate(var(--sr))}}
@keyframes cll-burst{0%{opacity:1;transform:translate(0,0) scale(.4)}100%{opacity:0;transform:translate(var(--bx),var(--by)) scale(1.2) rotate(120deg)}}
@keyframes cll-unfold{0%{opacity:0;transform:perspective(1400px) translateY(18vh) rotateX(-86deg) scale(.5)}45%{opacity:1}100%{opacity:1;transform:perspective(1400px) none}}
@keyframes cll-ink{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes cll-border{from{opacity:0}to{opacity:1}}
@keyframes cll-beat{0%,100%{transform:scale(1)}15%{transform:scale(1.22)}30%{transform:scale(1)}45%{transform:scale(1.14)}}
.cll-bh{animation:cll-beat 1.4s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.cll-anim,.cll-bh{animation:none!important}}
`;

function Heart({ className = "", color = "#c8102e", glow = false }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={glow ? { filter: "drop-shadow(0 0 8px rgba(255,60,80,.9))" } : undefined}>
      <path d={heartPath} fill={color} />
    </svg>
  );
}

function Holly({ className = "" }) {
  return (
    <svg viewBox="0 0 120 90" aria-hidden="true" className={className}>
      {[-150, -95, -35].map((r) => (
        <g key={r} transform={`translate(60 48) rotate(${r})`}>
          <path d={oldLeaf} fill="#2f5d3a" stroke="#1b3a25" strokeWidth="1.2" />
          <path d="M2 0 C 20 -2 36 -2 52 0" stroke="#7fb08a" strokeWidth="1" fill="none" opacity=".7" />
        </g>
      ))}
      {[[52, 50], [66, 46], [60, 60]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="6.5" fill="#b3122a" />
          <circle cx={x - 2} cy={y - 2} r="1.8" fill="#ff8c98" opacity=".8" />
        </g>
      ))}
    </svg>
  );
}

/* ================= illustration de l'enveloppe ================= */

/* définitions partagées (dégradés, motifs, symboles) */
function Defs({ t }) {
  return (
    <svg width="0" height="0" className="pointer-events-none absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="cllPL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={t.l[0]} /><stop offset="1" stopColor={t.l[1]} /></linearGradient>
        <linearGradient id="cllPR" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.r[0]} /><stop offset="1" stopColor={t.r[1]} /></linearGradient>
        <linearGradient id="cllPB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.b[0]} /><stop offset="1" stopColor={t.b[1]} /></linearGradient>
        <linearGradient id="cllFG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.flap[0]} /><stop offset="1" stopColor={t.flap[1]} /></linearGradient>
        <linearGradient id="cllSheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".28" stopColor="#fff" stopOpacity="0" />
          <stop offset=".4" stopColor="#fff" stopOpacity=".16" /><stop offset=".52" stopColor="#fff" stopOpacity="0" />
          <stop offset=".74" stopColor="#fff" stopOpacity=".09" /><stop offset=".84" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cllShadeTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity=".5" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient>
        <linearGradient id="cllRibG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={t.rib[0]} /><stop offset=".25" stopColor={t.rib[2]} /><stop offset=".5" stopColor={t.rib[1]} /><stop offset=".75" stopColor={t.rib[2]} /><stop offset="1" stopColor={t.rib[0]} />
        </linearGradient>
        <linearGradient id="cllBowG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={t.rib[1]} /><stop offset=".55" stopColor={t.rib[2]} /><stop offset="1" stopColor={t.rib[0]} /></linearGradient>
        <linearGradient id="cllGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff4c4" /><stop offset=".45" stopColor="#e9bb4b" /><stop offset="1" stopColor="#a5731a" /></linearGradient>
        <radialGradient id="cllWax" cx=".32" cy=".26" r=".9"><stop offset="0" stopColor="#fff6cc" /><stop offset=".35" stopColor="#f0c95a" /><stop offset=".75" stopColor="#c08a24" /><stop offset="1" stopColor="#7d5110" /></radialGradient>
        <radialGradient id="cllWaxIn" cx=".7" cy=".75" r=".9"><stop offset="0" stopColor="#f6d97a" /><stop offset=".6" stopColor="#cc9a30" /><stop offset="1" stopColor="#97661a" /></radialGradient>
        <linearGradient id="cllLinerBase" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fbf0d2" /><stop offset="1" stopColor="#ecd9a8" /></linearGradient>
        <pattern id="cllLiner" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M15 8 L16.6 13.4 L22 15 L16.6 16.6 L15 22 L13.4 16.6 L8 15 L13.4 13.4Z" fill="#d1a43a" opacity=".6" />
          <circle cx="0" cy="0" r="2" fill="#b8182f" opacity=".5" /><circle cx="30" cy="30" r="2" fill="#b8182f" opacity=".5" />
          <circle cx="30" cy="0" r="1.6" fill="#2f7a49" opacity=".5" /><circle cx="0" cy="30" r="1.6" fill="#2f7a49" opacity=".5" />
        </pattern>
        <symbol id="cllSf" viewBox="-16 -16 32 32" overflow="visible">
          <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none">
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <line x1="0" y1="0" x2="0" y2="-14" />
                <path d="M0 -9 L-4 -13 M0 -9 L4 -13 M0 -4.5 L-2.6 -7.2 M0 -4.5 L2.6 -7.2" />
              </g>
            ))}
          </g>
          <circle r="1.8" fill="currentColor" />
        </symbol>
        <symbol id="cllStar" viewBox="-6 -6 12 12" overflow="visible"><path d="M0 -5 L1.4 -1.4 L5 0 L1.4 1.4 L0 5 L-1.4 1.4 L-5 0 L-1.4 -1.4Z" fill="currentColor" /></symbol>
        <clipPath id="cllRound"><rect width="400" height="270" rx="13" /></clipPath>
        <clipPath id="cllPocketClip"><path d="M0 0 L200 150 L400 0 L400 270 L0 270 Z" /></clipPath>
      </defs>
    </svg>
  );
}

/* pin + houx + baies */
function Sprig() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {[-78, -58, -40, -22, -4, 14, 32, 50, 68].map((a, i) => {
        const r = (a * Math.PI) / 180;
        const L = 38 + (i % 3) * 7;
        const x = Math.sin(r) * L, y = -Math.cos(r) * L;
        return (
          <g key={a}>
            <line x1="0" y1="0" x2={x} y2={y} stroke="#0f2c1b" strokeWidth="6.4" />
            <line x1="0" y1="0" x2={x} y2={y} stroke="#2f6b43" strokeWidth="4" />
            <line x1="0" y1="0" x2={x * 0.82} y2={y * 0.82} stroke="#86cc93" strokeWidth="1.2" />
          </g>
        );
      })}
      {[-128, -90, -52].map((r, i) => (
        <g key={r} transform={`rotate(${r}) scale(${i === 1 ? 0.62 : 0.54})`}>
          <path d={leafPath} fill={i === 1 ? "#2c7a47" : "#256a3d"} stroke="#0f2c1b" strokeWidth="3" />
          <path d="M3 0 L54 0" stroke="#a6e0b0" strokeWidth="1.8" fill="none" />
        </g>
      ))}
      {[[-8, -2], [8, -4], [0, 7]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="6.6" fill="#d9263f" stroke="#5c0a16" strokeWidth="1.8" />
          <circle cx={x - 2.2} cy={y - 2.4} r="1.9" fill="#fff" opacity=".9" />
        </g>
      ))}
    </g>
  );
}

function Bell({ x, y, s = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="cll-anim" style={{ transformBox: "fill-box", transformOrigin: "50% 0%", animation: `cll-jingle 2.4s ease-in-out ${delay}s infinite` }}>
        <circle cy="-1" r="3.6" fill="none" stroke="#a5731a" strokeWidth="1.6" />
        <path d="M-9 15 C -10 3, 10 3, 9 15 L 12 19 H -12 Z" fill="url(#cllGold)" stroke="#7a500f" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M-12 19 H12" stroke="#7a500f" strokeWidth="1.6" />
        <line x1="0" y1="19" x2="0" y2="23" stroke="#7a500f" strokeWidth="1.2" />
        <circle cy="23.5" r="2.6" fill="url(#cllGold)" stroke="#7a500f" strokeWidth="1.1" />
        <path d="M-5 8 C -5 5, -2 4, 0 4" stroke="#fff" strokeOpacity=".8" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* nœud de satin à 4 boucles, finition or, houx, baies, clochettes */
function Bow({ gold }) {
  return (
    <svg viewBox="0 0 260 210" aria-hidden="true" className="block h-auto w-full overflow-visible">
      <defs>
        <g id="cllLoopS" strokeLinejoin="round" strokeLinecap="round">
          <path d="M128 112 C 120 62, 100 26, 82 30 C 66 36, 78 82, 128 112 Z" fill="url(#cllBowG)" stroke="#031a10" strokeWidth="2.6" />
          <path d="M112 84 C 104 62, 94 48, 86 46" stroke="#fff" strokeOpacity=".4" strokeWidth="3" fill="none" />
        </g>
        <g id="cllLoop" strokeLinejoin="round" strokeLinecap="round">
          <path d="M130 118 C 100 40, 16 20, 12 82 C 8 146, 96 158, 130 118 Z" fill="url(#cllBowG)" stroke="#031a10" strokeWidth="3" />
          <path d="M120 114 C 94 70, 46 60, 32 86 C 26 116, 84 128, 120 114 Z" fill="#000" fillOpacity=".28" />
          <path d="M126 114 C 98 52, 28 36, 22 82 C 18 130, 94 142, 126 114" fill="none" stroke={gold} strokeWidth="1.4" opacity=".85" />
          <path d="M108 98 C 86 74, 56 68, 42 82" stroke="#fff" strokeOpacity=".5" strokeWidth="4" fill="none" />
          <path d="M36 42 C 46 34, 62 33, 74 38" stroke="#fff" strokeOpacity=".35" strokeWidth="3" fill="none" />
        </g>
        <g id="cllTail" strokeLinejoin="round" strokeLinecap="round">
          <path d="M124 124 C 110 156, 84 176, 56 202 L 90 192 L 100 206 C 112 178, 132 154, 142 128 Z" fill="url(#cllBowG)" stroke="#031a10" strokeWidth="3" />
          <path d="M122 136 C 108 158, 88 174, 70 192" stroke={gold} strokeWidth="1.3" fill="none" opacity=".85" />
          <path d="M118 130 C 106 150, 92 164, 78 176" stroke="#fff" strokeOpacity=".35" strokeWidth="3" fill="none" />
        </g>
      </defs>
      <use href="#cllTail" />
      <use href="#cllTail" transform="translate(260 0) scale(-1 1)" />
      <use href="#cllLoopS" />
      <use href="#cllLoopS" transform="translate(260 0) scale(-1 1)" />
      <use href="#cllLoop" />
      <use href="#cllLoop" transform="translate(260 0) scale(-1 1)" />
      <ellipse cx="130" cy="118" rx="23" ry="20" fill="url(#cllBowG)" stroke="#031a10" strokeWidth="3" />
      <path d="M115 110 C 122 102, 138 102, 145 110" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" />
      <circle cx="130" cy="121" r="5" fill="url(#cllGold)" stroke="#7a500f" strokeWidth="1.2" />
      <g transform="translate(130 104) scale(1.1)"><Sprig /></g>
      <Bell x={106} y={134} s={1} delay={0} />
      <Bell x={154} y={138} s={0.9} delay={0.6} />
    </svg>
  );
}

/* sceau de cire doré, relief, perles, cœur gaufré, gouttes */
const waxPath = (() => {
  const pts = [];
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    let r = 39 + 2.6 * Math.sin(7 * t + 0.6) + 1.8 * Math.sin(3 * t);
    r += 8 * Math.exp(-((t - 1.15) ** 2) / 0.018) + 6 * Math.exp(-((t - 2.0) ** 2) / 0.014);
    pts.push(`${(50 + r * Math.cos(t)).toFixed(1)} ${(50 + r * Math.sin(t)).toFixed(1)}`);
  }
  return "M" + pts.join("L") + "Z";
})();
const beads = Array.from({ length: 18 }, (_, i) => {
  const a = (i / 18) * Math.PI * 2;
  return [50 + 27.5 * Math.cos(a), 50 + 27.5 * Math.sin(a)];
});

function Seal() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="h-full w-full overflow-visible">
      <path d={waxPath} transform="translate(1.6 3)" fill="#000" opacity=".35" />
      <path d={waxPath} fill="url(#cllWax)" stroke="#6b430c" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#7d5110" strokeWidth="4.5" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#fff0b0" strokeWidth="1.2" opacity=".8" />
      <circle cx="50" cy="50" r="30" fill="url(#cllWaxIn)" stroke="#8a5c14" strokeWidth="1.4" />
      {beads.map(([x, y], i) => (<circle key={i} cx={x} cy={y} r="1.5" fill="#fff0b0" stroke="#8a5c14" strokeWidth=".4" />))}
      <g transform="translate(28.5 29) scale(1.8)">
        <path d={heartPath} transform="translate(.9 .9)" fill="#7a4d0e" />
        <path d={heartPath} transform="translate(-.5 -.5)" fill="#fff0b0" />
        <path d={heartPath} fill="#e5b845" stroke="#9b6a17" strokeWidth=".4" />
        <path d="M6.4 9.4 C 6.8 7.8, 8.4 7.4, 9.5 8.2" stroke="#fff8d6" strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>
      <ellipse cx="32" cy="22" rx="13" ry="6" transform="rotate(-35 32 22)" fill="#fff" opacity=".5" />
      <path d="M72 78 C 78 70, 82 62, 83 54" stroke="#fff0b0" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity=".6" />
    </svg>
  );
}

/* petits décors posés contre l'enveloppe */
function CornerSprigs() {
  return (
    <svg viewBox="0 0 170 130" aria-hidden="true" className="h-full w-full overflow-visible">
      <g transform="translate(66 100) rotate(-52) scale(1.55)"><Sprig /></g>
      <g transform="translate(104 108) rotate(26) scale(1.3)"><Sprig /></g>
      <Bell x={128} y={84} s={1.1} delay={0.3} />
    </svg>
  );
}
function CandyCane() {
  const d = "M50 132 L50 42 C50 8, 12 8, 12 40";
  return (
    <svg viewBox="0 0 64 140" aria-hidden="true" className="h-full w-full overflow-visible" strokeLinecap="round">
      <path d={d} fill="none" stroke="#5c0a16" strokeWidth="17" />
      <path d={d} fill="none" stroke="#fff8f0" strokeWidth="12" />
      <path d={d} fill="none" stroke="#e0283f" strokeWidth="12" strokeDasharray="7 10" strokeLinecap="butt" />
      <path d="M46 120 L46 46" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="2.4" />
    </svg>
  );
}

const burst = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  const r = 80 + ((i * 17) % 60);
  return { bx: Math.cos(a) * r, by: Math.sin(a) * r - 40, s: 10 + ((i * 3) % 9) };
});
const shards = Array.from({ length: 9 }, (_, i) => ({
  sx: (i - 4) * 16 + ((i * 7) % 9), sy: 70 + ((i * 29) % 70), sr: (i % 2 ? 1 : -1) * (120 + i * 25), s: 4 + (i % 3) * 2,
}));
const FLAP = "M0 12 Q0 0 12 0 H388 Q400 0 400 12 L212 138 Q200 148 188 138 Z";
const EASE_FLAP = "cubic-bezier(.3,1.18,.4,1)";

const Envelope = memo(
  function Envelope({ phase, theme, openRef, btnRef, tiltRef }) {
    const t = THEMES[theme] || THEMES.red;
    const idx = PHASES.indexOf(phase);
    const open = idx >= 1;
    const out = idx >= 2;
    const gone = idx >= 3;
    const idle = phase === "envelope";
    const trigger = () => openRef.current();
    const gold = t.gold;

    return (
      <div
        ref={btnRef}
        role="button"
        tabIndex={idle ? 0 : -1}
        aria-label="Abrir la carta de amor"
        aria-disabled={!idle}
        onClick={trigger}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            trigger();
          }
        }}
        className={`group relative select-none rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-[#f3cf6b]/80 focus-visible:ring-offset-8 focus-visible:ring-offset-transparent ${idle ? "cursor-pointer" : "cursor-default"}`}
      >
        <Defs t={t} />

        {/* halo chaleureux derrière l'enveloppe */}
        <div className="cll-anim pointer-events-none absolute -inset-[28%]" style={{ background: "radial-gradient(circle, rgba(255,205,120,.28), transparent 62%)", animation: "cll-halo 4s ease-in-out infinite" }} />

        <div className="cll-anim" style={{ animation: "cll-float 5s ease-in-out infinite", animationPlayState: idle ? "running" : "paused" }}>
          <div
            ref={tiltRef}
            className={`transition-transform duration-300 ease-out ${idle ? "group-hover:[--s:1.06] group-focus-visible:[--s:1.06]" : ""}`}
            style={{ transform: "perspective(1100px) rotateX(calc(7deg + var(--rx,0deg))) rotateY(var(--ry,0deg)) scale(var(--s,1))" }}
          >
            <div className="relative aspect-[40/27] w-[min(84vw,400px)]">
              {/* ombre au sol */}
              <div className="pointer-events-none absolute -bottom-[13%] left-[6%] right-[6%] h-[13%]" style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,.55), transparent 70%)" }} />

              {/* intérieur doublé (visible rabat ouvert) */}
              <svg viewBox="0 0 400 270" className="absolute inset-0 z-[5] h-full w-full" aria-hidden="true">
                <g clipPath="url(#cllRound)">
                  <rect width="400" height="270" fill="url(#cllLinerBase)" />
                  <rect width="400" height="270" fill="url(#cllLiner)" />
                  <rect width="400" height="150" fill="url(#cllShadeTop)" />
                </g>
                <rect width="400" height="270" rx="13" fill="none" stroke={t.edge} strokeWidth="2.4" />
              </svg>

              {/* lumière dorée qui s'échappe */}
              <div className="pointer-events-none absolute inset-x-[6%] top-0 z-[6] h-[60%]" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(255,226,150,.95), rgba(255,200,100,.35) 45%, transparent 72%)", opacity: open && !gone ? 1 : 0, transition: "opacity .7s ease .95s" }} />

              {/* feuille dans l'enveloppe */}
              <div
                className="absolute left-[7%] top-[5%] z-20 h-[84%] w-[86%] rounded-[4px] will-change-transform"
                style={{
                  background: "linear-gradient(170deg,#fffdf4,#f1e3c3)",
                  border: `1.5px solid ${gold}`,
                  boxShadow: "0 -3px 14px rgba(255,214,120,.45)",
                  transform: out ? "translateY(-68%) rotate(-1.5deg)" : "none",
                  opacity: gone ? 0 : 1,
                  transition: "transform 1s cubic-bezier(.25,.8,.25,1), opacity .35s ease",
                }}
              >
                <div className="absolute inset-[5px] rounded-[2px] border" style={{ borderColor: `${gold}88` }} />
                {[26, 40, 54, 68].map((p) => (
                  <span key={p} className="absolute left-[14%] h-px w-[72%] bg-[#b58a4c]/30" style={{ top: `${p}%` }} />
                ))}
              </div>

              {/* poche avant : 3 panneaux, satin, dorures, flocons */}
              <svg viewBox="0 0 400 270" className="absolute inset-0 z-30 h-full w-full" aria-hidden="true" strokeLinejoin="round" strokeLinecap="round">
                <g clipPath="url(#cllRound)">
                  <polygon points="0,0 200,150 0,270" fill="url(#cllPL)" />
                  <polygon points="400,0 200,150 400,270" fill="url(#cllPR)" />
                  <polygon points="0,270 200,150 400,270" fill="url(#cllPB)" />
                  <rect width="400" height="270" fill="url(#cllSheen)" />
                  <g clipPath="url(#cllPocketClip)">
                    <rect x="9" y="9" width="382" height="252" rx="7" fill="none" stroke={gold} strokeWidth="1.7" />
                    <rect x="15" y="15" width="370" height="240" rx="5" fill="none" stroke={gold} strokeWidth=".8" opacity=".6" />
                    <path d="M0 14 L200 164 L400 14" fill="none" stroke={gold} strokeWidth="1.4" strokeDasharray="1 7" opacity=".95" />
                    <use href="#cllSf" x="126" y="224" width="40" height="40" style={{ color: gold }} opacity=".9" transform="translate(-20 -20)" />
                    <use href="#cllSf" x="274" y="224" width="40" height="40" style={{ color: gold }} opacity=".9" transform="translate(-20 -20)" />
                    <use href="#cllSf" x="200" y="214" width="22" height="22" style={{ color: gold }} opacity=".75" transform="translate(-11 -11)" />
                    <use href="#cllSf" x="44" y="138" width="34" height="34" style={{ color: gold }} opacity=".85" transform="translate(-17 -17)" />
                    <use href="#cllSf" x="356" y="138" width="34" height="34" style={{ color: gold }} opacity=".85" transform="translate(-17 -17)" />
                    {[[70, 214], [330, 214], [24, 82], [376, 82], [96, 246], [304, 246], [200, 250], [58, 190], [342, 190]].map(([x, y], i) => (
                      <use key={i} href="#cllStar" x={x} y={y} width={i % 2 ? 9 : 12} height={i % 2 ? 9 : 12} style={{ color: gold }} opacity=".85" transform={`translate(${i % 2 ? -4.5 : -6} ${i % 2 ? -4.5 : -6})`} />
                    ))}
                  </g>
                  <path d="M0 0 L200 150 L400 0" fill="none" stroke="#000" strokeOpacity=".28" strokeWidth="7" transform="translate(0 3)" />
                  <path d="M0 0 L200 150 L400 0 M0 270 L200 150 L400 270" fill="none" stroke={t.edge} strokeWidth="2.2" />
                  <path d="M0 273 L200 153 L400 273" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.4" />
                </g>
                <rect width="400" height="270" rx="13" fill="none" stroke={t.edge} strokeWidth="3" />
                <rect x="1.5" y="1.5" width="397" height="267" rx="12" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="1.2" />
              </svg>

              {/* reflet satiné qui balaie l'enveloppe */}
              {idle && (
                <div className="pointer-events-none absolute inset-0 z-[31] overflow-hidden rounded-[13px]" style={{ clipPath: "polygon(0 0, 50% 55.6%, 100% 0, 100% 100%, 0 100%)" }}>
                  <div className="cll-anim absolute inset-y-0 left-0 w-[60%]" style={{ background: "linear-gradient(100deg, transparent 30%, rgba(255,255,255,.3) 50%, transparent 70%)", animation: "cll-sweep 5.5s ease-in-out infinite" }} />
                </div>
              )}

              {/* rabat 3D : s'ouvre vers l'arrière */}
              <div
                className="absolute left-0 top-0 h-[55.6%] w-full will-change-transform"
                style={{
                  transformOrigin: "50% 0",
                  transformStyle: "preserve-3d",
                  transform: `perspective(1000px) rotateX(${open ? -180 : 0}deg)`,
                  transition: `transform 1.05s ${EASE_FLAP} .55s, z-index 0s 1.05s`,
                  zIndex: open ? 10 : 40,
                }}
              >
                <svg viewBox="0 0 400 150" className="absolute inset-0 h-full w-full overflow-visible" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }} aria-hidden="true" strokeLinejoin="round" strokeLinecap="round">
                  <path d={FLAP} fill="url(#cllFG)" />
                  <path d="M0 0 H400 L200 70 Z" fill="#fff" opacity=".07" />
                  <path d="M22 18 Q22 11 29 11 H371 Q378 11 378 18 L207 128 Q200 133 193 128 Z" fill="none" stroke={gold} strokeWidth="1.6" />
                  <path d="M30 26 L200 120 L370 26" fill="none" stroke={gold} strokeWidth="1.4" strokeDasharray="1 7" opacity=".9" />
                  <use href="#cllSf" x="82" y="48" width="36" height="36" style={{ color: gold }} opacity=".9" transform="translate(-18 -18)" />
                  <use href="#cllSf" x="318" y="48" width="36" height="36" style={{ color: gold }} opacity=".9" transform="translate(-18 -18)" />
                  <use href="#cllSf" x="150" y="28" width="16" height="16" style={{ color: gold }} opacity=".7" transform="translate(-8 -8)" />
                  <use href="#cllSf" x="250" y="28" width="16" height="16" style={{ color: gold }} opacity=".7" transform="translate(-8 -8)" />
                  <path d="M0 0 H400 L212 138 Q200 148 188 138 Z" fill="url(#cllSheen)" />
                  <path d={FLAP} fill="none" stroke={t.edge} strokeWidth="3" />
                  <path d="M12 3 H388" stroke="#fff" strokeOpacity=".35" strokeWidth="1.4" />
                </svg>
                <svg viewBox="0 0 400 150" className="absolute inset-0 h-full w-full overflow-visible" style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }} aria-hidden="true" strokeLinejoin="round">
                  <path d={FLAP} fill="url(#cllLinerBase)" />
                  <path d={FLAP} fill="url(#cllLiner)" />
                  <path d="M22 18 Q22 11 29 11 H371 Q378 11 378 18 L207 128 Q200 133 193 128 Z" fill="none" stroke={gold} strokeWidth="1.4" opacity=".9" />
                  <path d={FLAP} fill="none" stroke={t.edge} strokeWidth="3" />
                </svg>
              </div>

              {/* ruban de satin */}
              <div
                className="cll-anim pointer-events-none absolute inset-0 z-[44]"
                style={{ animation: open ? "cll-ribbon-out .85s ease-in-out forwards" : "none", transformOrigin: "50% 50%" }}
              >
                <svg viewBox="0 0 400 270" className="h-full w-full" aria-hidden="true">
                  <rect x="158" y="0" width="84" height="270" fill="#000" opacity=".16" />
                  <rect x="168" y="0" width="64" height="270" fill="url(#cllRibG)" />
                  <rect x="168" y="0" width="64" height="270" fill="url(#cllSheen)" />
                  <path d="M168 0 V270 M232 0 V270" stroke="#031a10" strokeOpacity=".6" strokeWidth="1.6" />
                  <path d="M173 0 V270 M227 0 V270" stroke={gold} strokeWidth="1.5" />
                  <path d="M179 0 V270 M221 0 V270" stroke={gold} strokeWidth="1" strokeDasharray="3 5" opacity=".8" />
                  <path d="M196 0 V270" stroke="#fff" strokeOpacity=".28" strokeWidth="3" />
                </svg>
              </div>

              {/* sceau à la pointe du rabat */}
              <div className="pointer-events-none absolute inset-x-0 top-[55.6%] z-[45] flex h-0 items-center justify-center" aria-hidden="true">
                <div className="relative aspect-square w-[21%]">
                  <div className="cll-anim absolute -inset-[55%] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,226,150,.95), transparent 62%)", opacity: open ? 1 : 0.12, animation: idle ? "cll-glow 2.4s ease-in-out infinite" : "none", transition: "opacity .3s" }} />
                  {[0, 1].map((h) => (
                    <div key={h} className="cll-anim absolute inset-0" style={{ clipPath: h ? "inset(-30% -30% -30% 50%)" : "inset(-30% 50% -30% -30%)", animation: open ? `${h ? "cll-crack-r" : "cll-crack-l"} .85s cubic-bezier(.5,0,.9,.6) .3s forwards` : "none" }}>
                      <Seal />
                    </div>
                  ))}
                  {open && (
                    <div className="absolute left-1/2 top-1/2 h-0 w-0">
                      {shards.map((s, i) => (
                        <span key={i} className="absolute rounded-[1px]" style={{ width: s.s, height: s.s, background: "linear-gradient(135deg,#fff0b0,#c8932a)", "--sx": `${s.sx}px`, "--sy": `${s.sy}px`, "--sr": `${s.sr}deg`, animation: `cll-shard .95s cubic-bezier(.3,.1,.7,1) ${0.32 + i * 0.015}s both` }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* nœud + houx + clochettes : se défait au clic */}
              <div className="pointer-events-none absolute inset-x-0 top-[29%] z-50 flex h-0 items-center justify-center">
                <div className="cll-anim w-[52%]" style={{ animation: open ? "cll-untie .95s cubic-bezier(.45,0,.2,1) forwards" : "none" }}>
                  <div className="cll-anim transition-transform duration-300 group-hover:-translate-y-1" style={{ animation: idle ? "cll-bowidle 3.6s ease-in-out infinite" : "none", transformOrigin: "50% 60%" }}>
                    <Bow gold={gold} />
                  </div>
                </div>
              </div>

              {/* décors posés contre l'enveloppe */}
              <div className="pointer-events-none absolute -bottom-[14%] -left-[10%] z-[55] w-[38%]"><CornerSprigs /></div>
              <div className="pointer-events-none absolute -bottom-[8%] -right-[3%] z-[55] w-[12%] rotate-[22deg]"><CandyCane /></div>

              {/* scintillements */}
              {[[7, 14, 0], [92, 24, 0.9], [80, 76, 1.7], [24, 62, 0.5], [50, 4, 1.2]].map(([x, y, d], i) => (
                <span key={i} className="cll-anim pointer-events-none absolute z-[60] text-base text-[#ffe08a]" style={{ left: `${x}%`, top: `${y}%`, opacity: 0, animation: `cll-twinkle 2.6s ease-in-out ${d}s infinite` }} aria-hidden="true">✦</span>
              ))}

              {/* gerbe d'étoiles à l'ouverture */}
              {open && (
                <div className="pointer-events-none absolute inset-x-0 top-[55.6%] z-[70] flex h-0 justify-center" aria-hidden="true">
                  <div className="relative h-0 w-0">
                    {burst.map((b, i) => (
                      <span key={i} className="absolute text-[#ffd978]" style={{ fontSize: b.s, "--bx": `${b.bx}px`, "--by": `${b.by}px`, animation: `cll-burst 1.4s ease-out ${0.3 + i * 0.03}s both` }}>✦</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
  (a, b) => a.phase === b.phase && a.theme === b.theme
);

/* ------------------------- neige + particules ------------------------- */
const flakes = Array.from({ length: 14 }, (_, i) => ({ left: (i * 37) % 100, size: 3 + ((i * 7) % 6), d: 8 + ((i * 3) % 8), l: -((i * 1.7) % 9), dx: ((i % 5) - 2) * 40 }));
const sparks = Array.from({ length: 24 }, (_, i) => ({ left: 8 + ((i * 53) % 84), d: 4 + ((i * 5) % 5), l: -((i * 0.9) % 5), s: 6 + ((i * 3) % 7) }));

const Decor = memo(function Decor({ celebrate }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {flakes.map((f, i) => (
        <span key={i} className="cll-anim absolute top-0 rounded-full bg-white/80 will-change-transform" style={{ left: `${f.left}%`, width: f.size, height: f.size, "--dx": `${f.dx}px`, animation: `cll-fall ${f.d}s linear ${f.l}s infinite` }} />
      ))}
      {sparks.slice(0, celebrate ? 24 : 5).map((s, i) => (
        <span key={i} className="cll-anim absolute bottom-0 text-[#f3cf6b]" style={{ left: `${s.left}%`, fontSize: s.s, animation: `cll-rise ${s.d}s ease-out ${s.l}s infinite` }}>✦</span>
      ))}
    </div>
  );
});

/* ------------------------------ composant ------------------------------ */
export default function ChristmasLoveLetter({
  open = true,
  title = DEFAULT_TITLE,
  paragraphs = DEFAULT_PARAGRAPHS,
  signature = DEFAULT_SIGNATURE,
  envelopeTheme = "red",
  blur = false,
  onClose,
  onComplete,
  onMusicPause,
  onMusicResume,
  soundEnabled = true,
}) {
  const [phase, setPhase] = useState("envelope");
  const [shown, setShown] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [pos, setPos] = useState({ p: 0, c: 0 });
  const [paused, setPaused] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const timers = useRef([]);
  const audioRef = useRef(null);
  const btnRef = useRef(null);
  const tiltRef = useRef(null);
  const openRef = useRef(() => {});
  const scrollRef = useRef(null);
  const parRefs = useRef([]);
  const musicPaused = useRef(false);
  const cb = useRef({});
  cb.current = { onClose, onComplete, onMusicPause, onMusicResume };

  const letterVisible = PHASES.indexOf(phase) >= 3;

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => {
    if (document.getElementById("cll-fonts")) return;
    const l = document.createElement("link");
    l.id = "cll-fonts";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,500;1,500;1,600&display=swap";
    document.head.appendChild(l);
  }, []);

  useEffect(() => {
    if (!open) return;
    clearTimers();
    setPhase("envelope");
    setPos({ p: 0, c: 0 });
    setPaused(false);
    setCelebrate(false);
    setLeaving(false);
    setShown(false);
    const raf = requestAnimationFrame(() => setShown(true));
    later(() => btnRef.current?.focus({ preventScroll: true }), 700);
    cb.current.onMusicPause?.();
    musicPaused.current = true;
    return () => {
      cancelAnimationFrame(raf);
      clearTimers();
      if (musicPaused.current) {
        cb.current.onMusicResume?.();
        musicPaused.current = false;
      }
    };
  }, [open, clearTimers, later]);

  useEffect(() => () => { try { audioRef.current?.close(); } catch {} }, []);

  /* sons synthétisés */
  const getCtx = () => {
    if (!soundEnabled) return null;
    try {
      if (!audioRef.current) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        audioRef.current = new AC();
      }
      if (audioRef.current.state === "suspended") audioRef.current.resume();
      return audioRef.current;
    } catch { return null; }
  };
  const playBell = () => {
    const ctx = getCtx();
    if (!ctx) return;
    [1318.5, 1976, 2637].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const t = ctx.currentTime;
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12 / (i + 1), t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 1.9);
    });
  };
  const playPaper = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const len = ctx.sampleRate * 0.7;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.sin((i / len) * Math.PI) * (0.5 + 0.5 * Math.random());
    const s = ctx.createBufferSource();
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    f.type = "bandpass";
    f.frequency.value = 2600;
    g.gain.value = 0.06;
    s.buffer = buf;
    s.connect(f).connect(g).connect(ctx.destination);
    s.start();
  };

  /* séquence : nœud → sceau → rabat → lumière → feuille → lettre */
  openRef.current = () => {
    if (phase !== "envelope" || leaving) return;
    playBell();
    if (tiltRef.current) {
      tiltRef.current.style.setProperty("--rx", "0deg");
      tiltRef.current.style.setProperty("--ry", "0deg");
    }
    setPhase("opening");
    later(playPaper, 900);
    later(() => setPhase("extracting"), 1750);
    later(() => {
      playPaper();
      setPhase("unfolding");
    }, 2650);
    later(() => setPhase("reading"), 3850);
  };

  const close = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    clearTimers();
    later(() => cb.current.onClose?.(), 700);
  }, [leaving, clearTimers, later]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const onPointerMove = (e) => {
    const t = tiltRef.current;
    if (!t || phase !== "envelope") return;
    t.style.setProperty("--ry", `${(e.clientX / window.innerWidth - 0.5) * 2 * 14}deg`);
    t.style.setProperty("--rx", `${-(e.clientY / window.innerHeight - 0.5) * 2 * 9}deg`);
  };

  /* écriture progressive */
  useEffect(() => {
    if (phase !== "reading" || paused) return;
    const { p, c } = pos;
    if (p >= paragraphs.length) {
      setPhase("finished");
      setCelebrate(true);
      later(() => setCelebrate(false), 6000);
      cb.current.onComplete?.();
      return;
    }
    const text = paragraphs[p];
    let delay;
    let next;
    if (c >= text.length) {
      delay = 850;
      next = { p: p + 1, c: 0 };
    } else {
      const prev = text[c - 1];
      delay = c === 0 ? 350 : /[.!?]/.test(prev) ? 340 : /[,;:]/.test(prev) ? 170 : 34;
      next = { p, c: c + 1 };
    }
    const id = setTimeout(() => setPos(next), delay);
    return () => clearTimeout(id);
  }, [phase, paused, pos, paragraphs, later]);

  useEffect(() => {
    if (phase === "reading") parRefs.current[pos.p]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [pos.p, phase]);

  const skip = () => {
    setPaused(false);
    setPos({ p: paragraphs.length, c: 0 });
  };
  const reread = () => {
    setCelebrate(false);
    setPaused(false);
    setPos({ p: 0, c: 0 });
    setPhase("reading");
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!open) return null;

  const isOpened = PHASES.indexOf(phase) >= 1;
  const envTransform = leaving ? "none" : letterVisible ? "translate3d(0,38vh,0) rotate(-8deg) scale(.55)" : isOpened ? "scale(1.12)" : "none";
  const done = (i) => pos.p > i;
  const visibleText = (i, text) => (done(i) ? text : pos.p === i ? text.slice(0, pos.c) : "");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Carta de amor de Navidad"
      onPointerMove={onPointerMove}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${blur ? "backdrop-blur-sm" : ""}`}
      style={{ opacity: shown && !leaving ? 1 : 0, transition: "opacity .6s ease", background: "radial-gradient(ellipse at center, rgba(52,8,18,.8), rgba(8,2,6,.95))" }}
    >
      <style>{KEYFRAMES}</style>
      <Decor celebrate={celebrate} />

      <button
        type="button"
        onClick={close}
        aria-label="Cerrar la carta"
        className="absolute right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-[#d9b44a]/60 bg-black/30 text-xl text-[#f3dc9a] transition hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3cf6b]"
      >
        ×
      </button>

      {/* ENVELOPPE */}
      <div
        className="relative z-10"
        style={{
          transform: envTransform,
          opacity: letterVisible && !leaving ? 0.5 : 1,
          transition: "transform 1s cubic-bezier(.4,0,.2,1), opacity .8s ease",
          pointerEvents: letterVisible ? "none" : "auto",
        }}
      >
        <div className="cll-anim" style={{ animation: "cll-enter .9s cubic-bezier(.2,.8,.2,1) .15s both" }}>
          <Envelope phase={phase} theme={envelopeTheme} openRef={openRef} btnRef={btnRef} tiltRef={tiltRef} />
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-full mt-12 w-[90vw] max-w-md -translate-x-1/2 text-center transition-opacity duration-300"
          style={{ opacity: phase === "envelope" ? 1 : 0, fontFamily: SERIF }}
        >
          <p className="text-xl italic text-[#f6e3b0]" style={{ textShadow: "0 2px 12px rgba(0,0,0,.6)" }}>
            Una carta especial te está esperando…
          </p>
          <p className="mt-2 text-sm italic text-[#f6e3b0]/65">Haz clic para abrir tu carta ❤️</p>
        </div>
      </div>

      {/* LETTRE (inchangée) */}
      {letterVisible && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-3 sm:p-6">
          <div
            className="relative flex max-h-full w-[min(94vw,580px)] flex-col rounded-[4px]"
            style={{
              background:
                "radial-gradient(ellipse at 20% 10%,rgba(255,255,255,.7),transparent 55%), radial-gradient(ellipse at 90% 100%,rgba(190,140,70,.22),transparent 55%), linear-gradient(170deg,#fbf3df,#f1e3c3)",
              boxShadow: "0 30px 70px rgba(0,0,0,.55), inset 0 0 60px rgba(160,110,50,.18)",
              transformOrigin: "50% 0",
              animation: leaving ? undefined : "cll-unfold 1.3s cubic-bezier(.2,.75,.2,1) both",
              opacity: leaving ? 0 : undefined,
              transform: leaving ? "translateY(30px) scale(.9)" : undefined,
              transition: leaving ? "all .6s ease" : undefined,
            }}
          >
            <div className="pointer-events-none absolute inset-2 rounded-[2px] border border-[#c9a13b]/70" style={{ animation: "cll-border 1.4s ease .8s both" }} />
            <div className="pointer-events-none absolute inset-[13px] rounded-[2px] border border-[#c9a13b]/30" style={{ animation: "cll-border 1.4s ease 1.1s both" }} />
            <Holly className="pointer-events-none absolute -left-3 -top-4 z-10 w-24 sm:w-28" />
            <Holly className="pointer-events-none absolute -bottom-4 -right-3 z-10 w-24 rotate-180 sm:w-28" />

            <div ref={scrollRef} className="min-h-0 overflow-y-auto px-8 pb-8 pt-12 sm:px-14 sm:pb-10 sm:pt-14" style={{ scrollbarWidth: "thin" }}>
              <h2
                className="text-center text-5xl leading-tight text-[#8a1226] sm:text-6xl"
                style={{ fontFamily: SCRIPT, animation: "cll-ink 1.2s ease-out .9s both", textShadow: "0 1px 0 rgba(217,180,74,.5)" }}
              >
                {title}
              </h2>
              <div className="mx-auto my-4 flex items-center justify-center gap-3 text-[#c9a13b]" aria-hidden="true">
                <span className="h-px w-16 bg-[#c9a13b]/60" />
                <span>✦</span>
                <span className="h-px w-16 bg-[#c9a13b]/60" />
              </div>

              <div style={{ fontFamily: SERIF }} className="space-y-5 text-[1.22rem] italic leading-[1.75] text-[#3b1a1f] sm:text-[1.32rem]">
                {paragraphs.map((text, i) => {
                  const shownText = visibleText(i, text);
                  return (
                    <p key={i} ref={(el) => (parRefs.current[i] = el)}>
                      <span className="sr-only">{text}</span>
                      <span aria-hidden="true">
                        {shownText}
                        <span className="opacity-0">{text.slice(shownText.length)}</span>
                      </span>
                      {done(i) && <Heart className="ml-1.5 inline-block h-4 w-4 align-[-2px]" />}
                    </p>
                  );
                })}
              </div>

              <div className="mt-8 text-center transition-opacity duration-[1800ms]" style={{ opacity: phase === "finished" ? 1 : 0 }}>
                <p className="text-3xl text-[#8a1226] sm:text-4xl" style={{ fontFamily: SCRIPT }}>{signature}</p>
                <Heart className={`mx-auto mt-3 h-10 w-10 ${phase === "finished" ? "cll-bh" : ""}`} glow color="#e11d3c" />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3" style={{ fontFamily: SERIF }}>
                {phase === "reading" && (
                  <>
                    <button type="button" onClick={() => setPaused((v) => !v)} className={btn}>{paused ? "Continuar" : "Pausar"}</button>
                    <button type="button" onClick={skip} className={btn}>Leer la carta completa</button>
                  </>
                )}
                {phase === "finished" && (
                  <>
                    <button type="button" onClick={reread} className={btn}>Volver a leer</button>
                    <button type="button" onClick={close} className={`${btn} !bg-[#8a1226] !text-[#fbeec7] hover:!bg-[#a3182c]`}>Cerrar la carta</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btn =
  "rounded-full border border-[#c9a13b] bg-transparent px-5 py-2 text-lg italic text-[#6b0f1d] transition hover:bg-[#c9a13b]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a1226]";
