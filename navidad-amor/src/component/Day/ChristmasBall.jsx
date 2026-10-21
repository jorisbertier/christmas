import React, { useEffect, useRef, useState } from "react";
import BG from '../../assets/BG/BGChristmasBall.jpg';

/* ------------------------------------------------------------------ */
/*  Géométrie de la boule (viewBox 520 × 560)                          */
/* ------------------------------------------------------------------ */
const CX = 260;
const CY = 250;
const R = 206;

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// Étage de sapin : flanc légèrement bombé + bas festonné
function etage(cx, top, bottom, hw, seed) {
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

const TREE_CX = 200;
const ETAGES = [
  { top: 148, bottom: 194, hw: 22 },
  { top: 178, bottom: 228, hw: 36 },
  { top: 210, bottom: 268, hw: 48 },
  { top: 244, bottom: 310, hw: 58 },
  { top: 284, bottom: 354, hw: 68 },
].map((e, i) => ({ ...e, d: etage(TREE_CX, e.top, e.bottom, e.hw, 11 + i * 7) }));

// Paillettes posées sur l'arbre
const PAILLETTES = (() => {
  const r = rng(77);
  const out = [];
  while (out.length < 90) {
    const y = 152 + r() * 214;
    const e = ETAGES.find((t) => y >= t.top && y <= t.bottom + 8) || ETAGES[4];
    const k = Math.min(1, Math.max(0.1, (y - e.top) / (e.bottom - e.top)));
    const x = TREE_CX + (r() * 2 - 1) * e.hw * k * 0.95;
    out.push([x, y, 0.5 + r() * 1.1, 0.5 + r() * 0.5]);
  }
  return out;
})();

// Étoile-flocon facettée
function etoile(cx, cy, Rr, rr, rot = 0) {
  const pts = [];
  for (let i = 0; i < 12; i++) {
    const a = ((i * 30 + rot - 90) * Math.PI) / 180;
    const rad = i % 2 === 0 ? Rr : rr;
    pts.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)]);
  }
  return pts;
}

function Etoile({ cx, cy, Rr, rr, rot }) {
  const big = etoile(cx, cy, Rr, rr, rot);
  const small = etoile(cx, cy, Rr * 0.66, rr * 0.9, rot + 30);
  const facettes = (pts, clair, sombre) =>
    pts.map((p, i) => {
      const q = pts[(i + 1) % 12];
      return (
        <polygon
          key={i}
          points={`${cx},${cy} ${p[0].toFixed(1)},${p[1].toFixed(1)} ${q[0].toFixed(1)},${q[1].toFixed(1)}`}
          fill={i % 2 ? sombre : clair}
        />
      );
    });
  return (
    <g>
      <circle cx={cx} cy={cy} r={Rr * 1.5} fill="url(#halo)" />
      <g opacity=".95">{facettes(small, "#ffe7e4", "#f2a7ae")}</g>
      <g>{facettes(big, "#ffffff", "#f6c3c7")}</g>
      <circle cx={cx} cy={cy} r={rr * 0.55} fill="#fff" opacity=".9" />
      <path d={`M${cx} ${cy - Rr} L${cx + 2} ${cy} L${cx} ${cy + 2}Z`} fill="#fff" opacity=".5" />
    </g>
  );
}

function Flocon({ cx, cy, s }) {
  const bras = [0, 60, 120].map((a) => (
    <g key={a} transform={`rotate(${a} ${cx} ${cy})`}>
      <path d={`M${cx} ${cy - s}V${cy + s}`} />
      <path d={`M${cx - s * 0.3} ${cy - s * 0.62}L${cx} ${cy - s * 0.3}L${cx + s * 0.3} ${cy - s * 0.62}`} />
      <path d={`M${cx - s * 0.3} ${cy + s * 0.62}L${cx} ${cy + s * 0.3}L${cx + s * 0.3} ${cy + s * 0.62}`} />
    </g>
  ));
  return (
    <g>
      <circle cx={cx} cy={cy} r={s * 1.7} fill="url(#halo)" opacity=".8" />
      <g stroke="#fff6f4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {bras}
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Scène (arrière) : fond, arbre, chalet, neige, socle                */
/* ------------------------------------------------------------------ */
function Defs() {
  return (
    <defs>
      <radialGradient id="fondo" cx="50%" cy="40%" r="65%">
        <stop offset="0" stopColor="#a8101a" />
        <stop offset=".55" stopColor="#6c070f" />
        <stop offset="1" stopColor="#3a0207" />
      </radialGradient>
      <radialGradient id="lumiere" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#ff4a3d" stopOpacity=".55" />
        <stop offset="1" stopColor="#ff4a3d" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="bokeh" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#ff5a4a" stopOpacity=".95" />
        <stop offset=".6" stopColor="#ff3b30" stopOpacity=".55" />
        <stop offset="1" stopColor="#ff3b30" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="halo" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#fff" stopOpacity=".7" />
        <stop offset="1" stopColor="#ffd0d0" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="abeto" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#b3242f" />
        <stop offset="1" stopColor="#4b060d" />
      </linearGradient>
      <linearGradient id="nieve" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".55" stopColor="#ffd9d9" />
        <stop offset="1" stopColor="#e8939a" />
      </linearGradient>
      <linearGradient id="nieveTejado" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".6" stopColor="#ffe3e0" />
        <stop offset="1" stopColor="#f0a4a8" />
      </linearGradient>
      <linearGradient id="muro" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a63a24" />
        <stop offset="1" stopColor="#4a0f0b" />
      </linearGradient>
      <radialGradient id="ventana" cx="50%" cy="55%" r="60%">
        <stop offset="0" stopColor="#fff6b0" />
        <stop offset=".45" stopColor="#ffb02e" />
        <stop offset="1" stopColor="#e0481a" />
      </radialGradient>
      <radialGradient id="resplandor" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#ffc24a" stopOpacity=".95" />
        <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="monte" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff2f0" />
        <stop offset=".45" stopColor="#f7bcbf" />
        <stop offset="1" stopColor="#c4505d" />
      </linearGradient>
      <linearGradient id="montePlus" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6c8cb" />
        <stop offset="1" stopColor="#a8323f" />
      </linearGradient>
      <linearGradient id="peana" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#1c0205" />
        <stop offset=".35" stopColor="#6a1119" />
        <stop offset=".6" stopColor="#3a070c" />
        <stop offset="1" stopColor="#140103" />
      </linearGradient>
      <linearGradient id="oro" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8a5a12" />
        <stop offset=".4" stopColor="#f6d77a" />
        <stop offset="1" stopColor="#8a5a12" />
      </linearGradient>

      <filter id="flocage" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
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
      <filter id="grano" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="5" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 9 -5.2" result="s" />
        <feComposite in="s" in2="SourceGraphic" operator="in" result="si" />
        <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="si" /></feMerge>
      </filter>
      <filter id="f2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" /></filter>
      <filter id="f5" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
      <filter id="f10" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="10" /></filter>
      <clipPath id="bola"><circle cx={CX} cy={CY} r={R} /></clipPath>
    </defs>
  );
}

function Escena() {
  return (
    <g>
      {/* peana (derrière le verre) */}
      <path d="M176 440 Q260 470 344 440 L372 486 Q260 512 148 486Z" fill="url(#peana)" />
      <path d="M118 486 Q260 520 402 486 L416 530 Q260 562 104 530Z" fill="url(#peana)" />
      <path d="M118 486 Q260 520 402 486" fill="none" stroke="url(#oro)" strokeWidth="2.4" />
      <path d="M104 530 Q260 562 416 530" fill="none" stroke="url(#oro)" strokeWidth="1.6" opacity=".7" />
      <path d="M148 486 Q260 512 372 486" fill="none" stroke="#fff" strokeWidth="1" opacity=".18" />

      <g clipPath="url(#bola)">
        {/* fond rouge profond + lumière */}
        <rect x="40" y="30" width="440" height="440" fill="url(#fondo)" />
        <ellipse cx="215" cy="290" rx="170" ry="150" fill="url(#lumiere)" />
        {/* bokeh */}
        <g filter="url(#f2)">
          <circle cx="246" cy="172" r="11" fill="url(#bokeh)" />
          <circle cx="284" cy="138" r="6" fill="url(#bokeh)" opacity=".8" />
          <circle cx="334" cy="188" r="8" fill="url(#bokeh)" opacity=".7" />
          <circle cx="118" cy="262" r="9" fill="url(#bokeh)" opacity=".5" />
          <circle cx="392" cy="300" r="13" fill="url(#bokeh)" opacity=".4" />
          <circle cx="188" cy="112" r="6" fill="url(#bokeh)" opacity=".6" />
          <circle cx="322" cy="96" r="5" fill="url(#bokeh)" opacity=".55" />
          <circle cx="404" cy="214" r="7" fill="url(#bokeh)" opacity=".5" />
          <circle cx="96" cy="196" r="6" fill="url(#bokeh)" opacity=".45" />
        </g>

        {/* petite colline du fond */}
        <path d="M30 394 C90 366 140 382 190 376 C240 368 300 392 360 380 C410 372 450 380 490 392 V480 H30Z" fill="url(#montePlus)" />
        <path d="M60 388 C110 372 150 384 190 380" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".5" filter="url(#f2)" />

        {/* sapin enneigé */}
        <g filter="url(#flocage)">
          {[...ETAGES].reverse().map((e) => (
            <g key={e.top}>
              <path d={e.d} fill="url(#abeto)" />
              <path
                d={e.d}
                fill="url(#nieve)"
                transform={`translate(${TREE_CX * 0.045} ${e.top * -0.02}) scale(.955 .8) translate(${-TREE_CX * 0} ${e.top * 0.25 + 0})`}
                style={{ transformOrigin: `${TREE_CX}px ${e.top}px` }}
              />
            </g>
          ))}
        </g>
        <g>
          {PAILLETTES.map(([x, y, r, o], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={o} />
          ))}
        </g>
        {/* pointe du sapin */}
        <path d="M200 146 C197 152 196 160 197 168 L203 168 C204 160 203 152 200 146Z" fill="#fff" opacity=".9" filter="url(#f2)" />

        {/* étoiles-flocons suspendues */}
        <Etoile cx={306} cy={232} Rr={31} rr={11} rot={-12} />
        <Flocon cx={150} cy={188} s={14} />

        {/* chalet */}
        <g>
          <rect x="302" y="266" width="18" height="40" fill="#7a2418" />
          <path d="M298 268 C300 254 322 254 324 268 C320 272 304 272 298 268Z" fill="url(#nieveTejado)" />
          {/* murs en rondins */}
          <rect x="226" y="340" width="112" height="54" fill="url(#muro)" />
          {[348, 356, 364, 372, 380, 388].map((y) => (
            <path key={y} d={`M226 ${y}H338`} stroke="#2a0805" strokeWidth="1.2" opacity=".55" />
          ))}
          <rect x="226" y="340" width="6" height="54" fill="#3a0c08" opacity=".7" />
          <rect x="332" y="340" width="6" height="54" fill="#3a0c08" opacity=".7" />
          {/* lueur des fenêtres */}
          <g filter="url(#f5)">
            <circle cx="248" cy="368" r="26" fill="url(#resplandor)" />
            <circle cx="316" cy="366" r="24" fill="url(#resplandor)" />
            <circle cx="282" cy="376" r="22" fill="url(#resplandor)" />
          </g>
          {/* fenêtres + porte */}
          {[[238, 356, 22, 24], [306, 356, 22, 24]].map(([x, y, w, h]) => (
            <g key={x}>
              <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} fill="#2b0a07" />
              <rect x={x} y={y} width={w} height={h} fill="url(#ventana)" />
              <path d={`M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}`} stroke="#4a1409" strokeWidth="1.6" />
            </g>
          ))}
          <rect x="268" y="358" width="28" height="36" rx="2" fill="#2b0a07" />
          <rect x="270" y="360" width="24" height="34" rx="1.5" fill="url(#ventana)" />
          <path d="M282 360V394M270 376H294" stroke="#4a1409" strokeWidth="1.4" />
          {/* toit enneigé épais */}
          <path d="M206 344 H360 L356 350 H210Z" fill="#5a1410" />
          <path
            d="M204 342 C214 322 250 300 276 288 C296 280 318 284 338 304 C350 316 358 330 360 342 C352 350 344 344 336 350 C328 354 320 346 310 352 C298 358 286 350 274 354 C260 358 248 350 236 354 C222 356 214 350 204 342Z"
            fill="url(#nieveTejado)"
          />
          <path d="M214 336 C240 312 268 298 290 292" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".8" filter="url(#f2)" />
          <path d="M300 318 C320 312 340 326 352 340" fill="none" stroke="#e48a92" strokeWidth="6" strokeLinecap="round" opacity=".35" filter="url(#f2)" />
        </g>

        {/* monticule de neige au premier plan */}
        <path d="M30 414 C80 392 120 410 160 404 C200 398 230 416 270 410 C320 402 350 418 400 406 C430 400 460 404 490 412 V480 H30Z" fill="url(#monte)" />
        <ellipse cx="276" cy="410" rx="78" ry="12" fill="#ffb03a" opacity=".5" filter="url(#f5)" />
        {/* paquets de neige au pied du sapin et du chalet */}
        <g fill="#fff">
          <ellipse cx="148" cy="372" rx="26" ry="9" opacity=".95" />
          <ellipse cx="206" cy="376" rx="34" ry="10" opacity=".9" />
          <ellipse cx="246" cy="396" rx="28" ry="8" opacity=".95" />
          <ellipse cx="324" cy="396" rx="30" ry="8" opacity=".95" />
          <ellipse cx="388" cy="402" rx="36" ry="9" opacity=".9" />
          <ellipse cx="110" cy="398" rx="30" ry="8" opacity=".9" />
        </g>
        <path d="M40 410 C90 394 130 410 170 404" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".7" filter="url(#f2)" />
        <path d="M30 456 C120 438 400 438 490 456 V490 H30Z" fill="#9a2330" opacity=".45" filter="url(#f10)" />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Verre (devant) : reflets et bords                                  */
/* ------------------------------------------------------------------ */
const pt = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};

function Verre() {
  const a1 = pt(R - 8, 196);
  const a2 = pt(R - 8, 268);
  const b1 = pt(R - 26, 214);
  const b2 = pt(R - 26, 252);
  return (
    <g>
      <defs>
        <linearGradient id="crescent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".85" />
          <stop offset=".6" stopColor="#fff" stopOpacity=".3" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="fresnel" cx="50%" cy="50%" r="50%">
          <stop offset=".72" stopColor="#fff" stopOpacity="0" />
          <stop offset=".93" stopColor="#ffd9dc" stopOpacity=".16" />
          <stop offset="1" stopColor="#fff" stopOpacity=".42" />
        </radialGradient>
        <linearGradient id="borde" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset=".5" stopColor="#ffd7d9" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff" stopOpacity=".7" />
        </linearGradient>
        <radialGradient id="fondoVidrio" cx="50%" cy="100%" r="60%">
          <stop offset="0" stopColor="#ffe9e9" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffe9e9" stopOpacity="0" />
        </radialGradient>
        <clipPath id="bola2"><circle cx={CX} cy={CY} r={R} /></clipPath>
      </defs>

      <g clipPath="url(#bola2)">
        <circle cx={CX} cy={CY} r={R} fill="url(#fresnel)" />
        <ellipse cx={CX} cy={CY + R - 24} rx="170" ry="60" fill="url(#fondoVidrio)" />
        {/* croissant principal */}
        <path
          d={`M${a1[0]} ${a1[1]} A${R - 8} ${R - 8} 0 0 1 ${a2[0]} ${a2[1]} Q${CX - 40} ${CY - 150} ${a1[0] + 8} ${a1[1] + 12}Z`}
          fill="url(#crescent)"
          filter="url(#f2)"
        />
        <path
          d={`M${b1[0]} ${b1[1]} A${R - 26} ${R - 26} 0 0 1 ${b2[0]} ${b2[1]}`}
          fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".55" filter="url(#f2)"
        />
        {/* reflet droit */}
        <path
          d={`M${pt(R - 6, -28)[0]} ${pt(R - 6, -28)[1]} A${R - 6} ${R - 6} 0 0 1 ${pt(R - 6, 30)[0]} ${pt(R - 6, 30)[1]}`}
          fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".32" filter="url(#f2)"
        />
        {/* frange givrée en bas */}
        <path
          d={`M${pt(R - 6, 24)[0]} ${pt(R - 6, 24)[1]} A${R - 6} ${R - 6} 0 0 1 ${pt(R - 6, 150)[0]} ${pt(R - 6, 150)[1]}`}
          fill="none" stroke="#ffeaea" strokeWidth="9" strokeLinecap="round" opacity=".4" filter="url(#f5)"
        />
        <circle cx="124" cy="150" r="4.5" fill="#fff" opacity=".9" filter="url(#f2)" />
        <circle cx="142" cy="132" r="2.2" fill="#fff" opacity=".8" />
      </g>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="url(#borde)" strokeWidth="2.4" />
      <circle cx={CX} cy={CY} r={R - 5} fill="none" stroke="#fff" strokeWidth="1" opacity=".18" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Neige qui tombe dans la boule (canvas)                             */
/* ------------------------------------------------------------------ */
function useNieve(canvasRef, agitarRef) {
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

    const sprite = (doux) => {
      const n = 32;
      const s = document.createElement("canvas");
      s.width = n;
      s.height = n;
      const c = s.getContext("2d");
      const g = c.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(doux ? 0.2 : 0.5, `rgba(255,255,255,${doux ? 0.65 : 1})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, n, n);
      return s;
    };
    const net = sprite(false);
    const flou = sprite(true);

    const N = reduce ? 60 : 170;
    const flakes = Array.from({ length: N }, () => {
      const t = Math.random();
      const size = t < 0.6 ? 0.8 + Math.random() * 1.2 : t < 0.9 ? 2 + Math.random() * 1.6 : 4 + Math.random() * 3.5;
      return {
        x: Math.random(),
        y: Math.random(),
        size,
        flou: size > 3.8,
        a: size > 3.8 ? 0.22 + Math.random() * 0.2 : 0.55 + Math.random() * 0.45,
        vy: 0.16 + size * 0.07,
        ph: Math.random() * 6.28,
        fr: 0.5 + Math.random() * 1.2,
        am: 0.12 + Math.random() * 0.35,
        sol: 0.84 + Math.random() * 0.1,
        ex: 0,
        ey: 0,
      };
    });

    agitarRef.current = () => {
      if (reduce) return;
      flakes.forEach((f) => {
        f.ex = (Math.random() - 0.5) * 8;
        f.ey = -(2.5 + Math.random() * 6.5);
      });
    };

    const tick = (now) => {
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);
      for (const f of flakes) {
        f.x += (Math.sin(t * f.fr + f.ph) * f.am * dt + f.ex * dt) / W;
        f.y += (f.vy * dt + f.ey * dt) / H;
        const k = Math.pow(0.965, dt);
        f.ex *= k;
        f.ey *= k;
        if (f.y > f.sol) {
          f.y = -0.03;
          f.x = Math.random();
        }
        if (f.y < -0.1) f.y = -0.1;
        if (f.x < -0.05) f.x = 1.05;
        if (f.x > 1.05) f.x = -0.05;
        const s = f.size * (f.flou ? 1.4 : 1.25);
        ctx.globalAlpha = f.a * (0.82 + 0.18 * Math.sin(t * 2 + f.ph));
        ctx.drawImage(f.flou ? flou : net, f.x * W - s, f.y * H - s, s * 2, s * 2);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      agitarRef.current = null;
    };
  }, [canvasRef, agitarRef]);
}

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */
const CSS = `
.bola-wrap{position:relative;width:100%;aspect-ratio:520/560;cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;transform-origin:50% 88%}
.bola-wrap:focus-visible{outline:2px solid #fde68a;outline-offset:8px;border-radius:24px}
.bola-capa{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.bola-nieve{position:absolute;left:${((CX - R) / 520) * 100}%;top:${((CY - R) / 560) * 100}%;width:${((2 * R) / 520) * 100}%;height:${((2 * R) / 560) * 100}%;border-radius:50%;pointer-events:none}
@keyframes bolaA{0%,100%{transform:rotate(0)}25%{transform:rotate(-3.2deg)}55%{transform:rotate(2.4deg)}80%{transform:rotate(-1deg)}}
@keyframes bolaB{0%,100%{transform:rotate(0)}25%{transform:rotate(3.2deg)}55%{transform:rotate(-2.4deg)}80%{transform:rotate(1deg)}}
.bola-a{animation:bolaA .7s ease-in-out}
.bola-b{animation:bolaB .7s ease-in-out}
@media (prefers-reduced-motion: reduce){.bola-a,.bola-b{animation:none}}
`;

export default function ChristmasBall() {
  const canvasRef = useRef(null);
  const agitarRef = useRef(null);
  const [secousses, setSecousses] = useState(0);
  const musiqueRef = useRef(null);
  const clochetteRef = useRef(null);
  useNieve(canvasRef, agitarRef);

  const agiter = () => {
    // Démarrer la musique si le navigateur a bloqué
    // la lecture automatique à l'ouverture.
    // if (musiqueRef.current?.paused) {
    //   musiqueRef.current.play().catch(() => {});
    // }

    // Jouer la clochette à chaque secousse
    if (clochetteRef.current) {
      clochetteRef.current.currentTime = 0;
      clochetteRef.current.play().catch(() => {});
    }

    // Conserver l'effet de neige et l'animation existants
    if (agitarRef.current) {
      agitarRef.current();
    }

    setSecousses((n) => n + 1);
  };
    useEffect(() => {
      const musique = new Audio("/audio/musique-noel.mp3");
      musique.loop = true;
      musique.volume = 0.20;

      const clochette = new Audio("/audio/clochette.mp3");
      clochette.volume = 0.65;

      musiqueRef.current = musique;
      clochetteRef.current = clochette;

      // Tentative de lecture automatique.
      // Le navigateur peut la bloquer jusqu'au premier clic.
      musique.play().catch(() => {});

      return () => {
        musique.pause();
        musique.currentTime = 0;
        clochette.pause();

        musiqueRef.current = null;
        clochetteRef.current = null;
      };
    }, []);

  return (
    <div
      className="relative flex max-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10 text-amber-50"
    >
      <div
        className="absolute inset-0 -z-20 scale-105"
        style={{
          backgroundImage: `url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(7px)",
        }}
      />
      <style>{CSS}</style>
      

      <div
        className={`bola-wrap w-full -top-10 max-w-[520px] ${secousses > 0 ? (secousses % 2 ? "bola-a" : "bola-b") : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Boule à neige : touche pour la secouer"
        onPointerDown={agiter}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            agiter();
          }
        }}
      >
        <svg className="bola-capa" viewBox="0 0 520 560" aria-hidden="true">
          <Defs />
          <Escena />
        </svg>
        <canvas ref={canvasRef} className="bola-nieve" />
        <svg className="bola-capa" viewBox="0 0 520 560" aria-hidden="true">
          <Verre />
        </svg>
      </div>
<div className="mt-7 w-full max-w-5xl text-center  text-amber-50 absolute bottom-0 ">

  <h2 className="mb-1 font-serif text-md font-semibold tracking-wide text-amber-100 sm:text-md">
    🎄✨ Hoy es una clase de yoga en modo Christmas
  </h2>

  <div className="mx-auto h-px w-20 bg-amber-200/60" />

  <p className="mb-1 font-serif text-base leading-8 text-amber-50/95 sm:text-md">
    Respira profundamente, deja ir las preocupaciones
    y regálate unos minutos de paz.
  </p>

  <p className="mb-1 font-serif text-base leading-8 text-amber-50/90 sm:text-md">
    He creado esta pequeña bola de nieve para ayudar tu estres.
    Cierra los ojos, agítala suavemente y disfruta de su magia.
    ❄️✨
  </p>

  {/* <p className="mb-1 font-serif text-base italic leading-8 text-amber-100/90 sm:text-md">
    No tienes que resolverlo todo hoy, mi vida. A veces, solo necesitas detenerte, respirar y recordarlo especial que eres para mí. ❤️
  </p> */}

  <div className="mx-auto h-px w-20 bg-amber-200/60" />

  <p className="font-serif text-sm leading-7 tracking-wide text-amber-200 sm:text-base">
    ✨ Pide un deseo tocando a la bola y deja que la magia de la Navidad te regale un poquito de paz. 🎁
  </p>


</div>


      {/* <p className="mt-4 text-center font-serif text-lg text-amber-100/90">
        Touche la boule pour la secouer
      </p> */}
    </div>
  );
}
