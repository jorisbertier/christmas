import React, { useState } from "react";
import couponImg from "../../assets/cupon/cupon.png";

const NB_CLICS = 5;

// Position du couvercle selon le nombre de clics (y en cqw = unité relative à la scène)
const LID = [
  { y: 0, rz: 0, rx: 0, o: 1 },
  { y: -0.5, rz: -1.5, rx: 0, o: 1 },
  { y: -1.6, rz: -4, rx: 0, o: 1 },
  { y: -3.4, rz: -9, rx: 0, o: 1 },
  { y: -6, rz: -16, rx: 0, o: 1 },
  { y: -22, rz: -42, rx: 25, o: 0 }, // envol final
];
const HALO = [0, 0, 0.3, 0.55, 0.85, 1];
const RAYOS = [0, 0, 0, 0.35, 0.65, 0.95];
const INDICES = [
  "Touche le cadeau pour l'ouvrir",
  "Le nœud commence à se desserrer…",
  "Le couvercle bouge !",
  "Il y a une lueur là-dedans…",
  "Plus qu'un petit effort…",
];

// Étincelles du final : [dx, dy (en cqw), délai (s)]
const CHISPAS = [
  [-18, -20, 0], [-10, -28, 0.05], [0, -32, 0.1], [11, -27, 0.03], [19, -19, 0.08],
  [-24, -8, 0.12], [24, -9, 0.06], [-14, -14, 0.15], [15, -15, 0.1], [-5, -22, 0.18],
  [6, -24, 0.14], [0, -16, 0.2],
];

const CSS = `
.escena{position:relative;width:100%;aspect-ratio:560/380;container-type:inline-size;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none}
.escena[aria-disabled="true"]{cursor:default}
.escena:focus-visible{outline:2px solid #fcd34d;outline-offset:6px;border-radius:24px}
.capa{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}

/* Origine = centre de la base du cadeau, posé dans le traîneau */
.origen{--s:19cqw;--h:calc(var(--s)*.7);--l:calc(var(--s)*.22);--lw:calc(var(--s)*1.1);
  position:absolute;left:53%;top:65.8%;width:0;height:0;pointer-events:none}
.persp{position:absolute;left:0;top:0;width:0;height:0;perspective:95cqw;perspective-origin:0 calc(var(--h)*-1)}
.sacude,.oscila,.cubo,.cuerpo,.tapa,.lazo,.gpetalo{transform-style:preserve-3d}
.sacude,.cubo,.lazo,.gpetalo{position:absolute;left:0;top:0;width:0;height:0}
.sacude-a{animation:sacA .5s ease-in-out}
.sacude-b{animation:sacB .5s ease-in-out}
@keyframes sacA{0%,100%{transform:none}20%{transform:rotateZ(-4deg) scale(.96)}50%{transform:rotateZ(3deg) scale(1.03)}80%{transform:rotateZ(-1.5deg)}}
@keyframes sacB{0%,100%{transform:none}20%{transform:rotateZ(4deg) scale(.96)}50%{transform:rotateZ(-3deg) scale(1.03)}80%{transform:rotateZ(1.5deg)}}
.oscila{position:absolute;left:0;top:0;width:0;height:0;transform:rotateX(-18deg) rotateY(30deg);animation:oscila 8s ease-in-out infinite}
@keyframes oscila{0%,100%{transform:rotateX(-18deg) rotateY(16deg)}50%{transform:rotateX(-18deg) rotateY(44deg)}}
@keyframes flotte{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.flotte{animation:flotte 4s ease-in-out infinite}

/* Cadeau : papier vert à pois de neige + ruban or */
.cara{position:absolute;border:1px solid rgba(255,255,255,.18);
  background:
   linear-gradient(90deg,transparent 40%,#8a5a12 40%,#e8b84a 43%,#fff3bf 50%,#e8b84a 57%,#8a5a12 60%,transparent 60%),
   radial-gradient(circle at 30% 28%,rgba(255,255,255,.28) 0 .9cqw,transparent 1.2cqw) 0 0/6cqw 6cqw,
   radial-gradient(circle at 80% 78%,rgba(255,220,120,.24) 0 .6cqw,transparent .9cqw) 0 0/6cqw 6cqw,
   linear-gradient(155deg,#36b475,#0c5535)}
.sombra1{box-shadow:inset 0 0 0 40cqw rgba(0,20,10,.36)}
.sombra2{box-shadow:inset 0 0 0 40cqw rgba(0,20,10,.18)}
.f-fr{inset:0;transform:translateZ(calc(var(--s)/2))}
.f-at{inset:0;transform:rotateY(180deg) translateZ(calc(var(--s)/2))}
.f-de{inset:0;transform:rotateY(90deg) translateZ(calc(var(--s)/2))}
.f-iz{inset:0;transform:rotateY(-90deg) translateZ(calc(var(--s)/2))}
.f-luz{left:0;width:var(--s);height:var(--s);top:calc((var(--h) - var(--s))/2);
  transform:rotateX(90deg) translateZ(calc(var(--h)/2 - 3cqw));border:0;
  background:radial-gradient(circle at 50% 50%,#fffbe0 0%,#ffe27a 38%,#d9902a 78%,#8a4f12 100%)}
.cuerpo{position:absolute;left:calc(var(--s)/-2);top:calc(var(--h)*-1);width:var(--s);height:var(--h)}

.tapa{position:absolute;left:calc(var(--lw)/-2);top:calc((var(--h) + var(--l))*-1);width:var(--lw);height:var(--l);
  transform-origin:0 100%;transition:transform .65s cubic-bezier(.3,1.35,.5,1),opacity .6s ease .15s}
.tapa .cara{border-bottom:2px solid rgba(0,0,0,.28)}
.t-fr{inset:0;transform:translateZ(calc(var(--lw)/2))}
.t-at{inset:0;transform:rotateY(180deg) translateZ(calc(var(--lw)/2))}
.t-de{inset:0;transform:rotateY(90deg) translateZ(calc(var(--lw)/2))}
.t-iz{inset:0;transform:rotateY(-90deg) translateZ(calc(var(--lw)/2))}
.t-top{left:0;width:var(--lw);height:var(--lw);top:calc((var(--l) - var(--lw))/2);
  transform:rotateX(90deg) translateZ(calc(var(--l)/2));border:0;
  background:
   linear-gradient(90deg,transparent 40%,#8a5a12 40%,#e8b84a 43%,#fff3bf 50%,#e8b84a 57%,#8a5a12 60%,transparent 60%),
   linear-gradient(0deg,transparent 40%,#8a5a12 40%,#e8b84a 43%,#fff3bf 50%,#e8b84a 57%,#8a5a12 60%,transparent 60%),
   radial-gradient(circle at 30% 28%,rgba(255,255,255,.28) 0 .9cqw,transparent 1.2cqw) 0 0/6cqw 6cqw,
   linear-gradient(135deg,#4fcf90,#13744a)}

/* Nœud 3D : 4 boucles + noyau */
.lazo{left:50%;top:0}
.petalo{position:absolute;left:calc(var(--s)*.01);top:calc(var(--s)*-.3);width:calc(var(--s)*.3);height:calc(var(--s)*.36);
  border-radius:50%;transform-origin:0 100%;transform:rotateZ(30deg);
  background:radial-gradient(ellipse closest-side at 50% 50%,rgba(20,110,70,.55) 0 36%,#9a6a1c 40%,#fbe08a 58%,#e8b84a 80%,#8a5a12 100%)}
.plano{position:absolute;left:calc(var(--s)*.02);top:calc(var(--s)*-.125);width:calc(var(--s)*.3);height:calc(var(--s)*.22);border-radius:50%;transform:rotateX(90deg);
  background:radial-gradient(ellipse closest-side at 50% 50%,rgba(20,110,70,.6) 0 34%,#9a6a1c 38%,#fbe08a 56%,#e8b84a 80%,#8a5a12 100%)}
.nudo{position:absolute;width:calc(var(--s)*.13);height:calc(var(--s)*.13);left:calc(var(--s)*-.065);top:calc(var(--s)*-.09);
  border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff7c8,#e0aa3a 55%,#8a5a12)}

/* Lumière sortant du cadeau */
.halo{position:absolute;left:calc(var(--s)*-1.3);top:calc(var(--h)*-1 - var(--s)*.9);width:calc(var(--s)*2.6);height:calc(var(--s)*1.9);
  background:radial-gradient(closest-side,rgba(255,228,130,.95),rgba(255,200,80,.35) 55%,transparent);transition:opacity .6s ease}
.rayos{position:absolute;left:calc(var(--s)*-2.4);top:calc(var(--h)*-1 - var(--s)*3.1);width:calc(var(--s)*4.8);height:calc(var(--s)*3.2);
  background:conic-gradient(from -52deg at 50% 100%,transparent 0deg,rgba(255,238,160,.55) 9deg,transparent 20deg,rgba(255,238,160,.4) 34deg,transparent 46deg,rgba(255,238,160,.5) 58deg,transparent 70deg,rgba(255,238,160,.4) 82deg,transparent 94deg,rgba(255,238,160,.5) 104deg,transparent 104deg);
  -webkit-mask-image:radial-gradient(circle at 50% 100%,#000 8%,transparent 72%);mask-image:radial-gradient(circle at 50% 100%,#000 8%,transparent 72%);
  transition:opacity .6s ease}
.chispa{position:absolute;left:calc(var(--s)*-.07);top:calc(var(--h)*-1 - var(--s)*.1);width:calc(var(--s)*.14);height:calc(var(--s)*.14);
  background:#fff0b0;clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%);
  filter:drop-shadow(0 0 4px #ffd45a);animation:chispa 1.6s ease-out both;animation-delay:var(--d)}
@keyframes chispa{0%{transform:translate(0,0) scale(0);opacity:1}25%{opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(1.6) rotate(90deg);opacity:0}}

@keyframes coupon{0%{opacity:0;transform:translateY(40px) scale(.85) rotate(-3deg)}70%{transform:translateY(-6px) scale(1.02) rotate(.5deg)}100%{opacity:1;transform:none}}
.coupon-in{animation:coupon .8s cubic-bezier(.2,.8,.2,1) both}
@media (prefers-reduced-motion: reduce){
  .sacude-a,.sacude-b,.oscila,.flotte,.coupon-in,.chispa{animation:none}
  .chispa{display:none}
  .tapa{transition:none}
}
`;

/* ------------------------------------------------------------------ */
/*  TRAÎNEAU (arrière : patins, structure, sac, intérieur)             */
/* ------------------------------------------------------------------ */

const COQUE =
  "M92 168 C70 168 56 188 62 212 C68 252 98 292 160 302 H400 C452 298 494 262 500 226 C502 212 490 204 476 208 C460 212 452 228 436 234 C340 246 220 244 128 228 C112 224 110 180 92 168 Z";

function Defs() {
  return (
    <defs>
      <linearGradient id="oro" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff3bf" />
        <stop offset=".35" stopColor="#e8b84a" />
        <stop offset=".7" stopColor="#fbe08a" />
        <stop offset="1" stopColor="#a8721f" />
      </linearGradient>
      <linearGradient id="oroH" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#b9822a" />
        <stop offset=".3" stopColor="#fff0a8" />
        <stop offset=".55" stopColor="#e8b84a" />
        <stop offset="1" stopColor="#a8721f" />
      </linearGradient>
      <linearGradient id="rojo" gradientUnits="userSpaceOnUse" x1="0" y1="205" x2="0" y2="310">
        <stop offset="0" stopColor="#f2505c" />
        <stop offset=".35" stopColor="#c81f2c" />
        <stop offset=".8" stopColor="#8a111c" />
        <stop offset="1" stopColor="#5a0912" />
      </linearGradient>
      <linearGradient id="saco" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#e6c996" />
        <stop offset="1" stopColor="#a47c4a" />
      </linearGradient>
      <linearGradient id="nieve" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f4f8ff" />
        <stop offset="1" stopColor="#b9c9e6" />
      </linearGradient>
      <linearGradient id="vert" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2b9a63" />
        <stop offset="1" stopColor="#0f5a36" />
      </linearGradient>
      <filter id="flou" x="-20%" y="-50%" width="140%" height="200%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
      <filter id="flou2" x="-20%" y="-50%" width="140%" height="200%">
        <feGaussianBlur stdDeviation="2.2" />
      </filter>
      <clipPath id="coqueClip"><path d={COQUE} /></clipPath>
      <symbol id="hoja" viewBox="0 0 60 20" overflow="visible">
        <path d="M0 10 Q12 -6 24 2 Q30 -8 40 0 Q52 2 58 10 Q52 18 40 20 Q30 28 24 18 Q12 26 0 10Z" fill="url(#vert)" stroke="#0a3b23" strokeWidth="1.2" />
        <path d="M2 10 H52" stroke="#7fdcab" strokeWidth="1.2" opacity=".75" />
      </symbol>
    </defs>
  );
}

function TraineauAtras() {
  return (
    <svg className="capa" viewBox="0 0 560 380" aria-hidden="true">
      <Defs />
      {/* neige au sol + ombre */}
      <path d="M-10 356 Q120 330 262 348 T570 342 V392 H-10Z" fill="url(#nieve)" opacity=".92" />
      <ellipse cx="282" cy="346" rx="236" ry="10" fill="#0a1c34" opacity=".55" filter="url(#flou)" />

      {/* supports */}
      <g stroke="url(#oroH)" strokeWidth="8" strokeLinecap="round" fill="none">
        <path d="M150 340 C150 322 156 308 172 298" />
        <path d="M360 340 C360 322 354 308 338 298" />
        <path d="M255 340 V300" strokeWidth="6" />
      </g>
      {/* patin */}
      <path
        d="M46 312 C42 330 56 340 78 340 H430 C488 340 516 318 516 286 C516 260 494 248 474 256 C462 262 464 280 480 281"
        fill="none" stroke="url(#oro)" strokeWidth="11" strokeLinecap="round"
      />
      <path
        d="M52 312 C50 326 60 335 80 335 H430 C484 335 510 316 511 286"
        fill="none" stroke="#fffbe0" strokeWidth="2.4" strokeLinecap="round" opacity=".7"
      />

      {/* intérieur (paroi lointaine) */}
      <path d="M126 226 C220 238 340 240 436 232 C442 222 442 212 434 208 C340 214 220 212 132 204 C122 210 122 220 126 226Z" fill="#4a0810" />
      <path d="M132 204 C220 212 340 214 434 208" fill="none" stroke="#a8721f" strokeWidth="2.5" opacity=".8" />

      {/* sac de cadeaux */}
      <g transform="translate(-14 0)">
      <path d="M126 240 C104 196 118 156 160 146 C204 156 218 196 196 240Z" fill="url(#saco)" stroke="#6e5230" strokeWidth="1.5" />
      <path d="M134 232 C122 200 128 176 146 162" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".18" />
      <path d="M138 152 C140 132 182 132 184 152 Q161 160 138 152Z" fill="#c9a874" stroke="#6e5230" strokeWidth="1.2" />
      <path d="M140 156 Q161 166 182 156" fill="none" stroke="#9b1523" strokeWidth="6" strokeLinecap="round" />
      <path d="M150 140 V108 C150 92 176 92 176 108" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
      <path d="M150 140 V108 C150 92 176 92 176 108" fill="none" stroke="#d4222f" strokeWidth="9" strokeDasharray="6 7" />
      <rect x="170" y="116" width="28" height="26" rx="3" fill="#2a6fd1" stroke="#16427f" strokeWidth="1.2" />
      <rect x="181" y="116" width="6" height="26" fill="#e8b84a" />
      <rect x="170" y="126" width="28" height="6" fill="#e8b84a" />
      <circle cx="184" cy="114" r="5" fill="#fbe08a" stroke="#a8721f" strokeWidth="1" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  TRAÎNEAU (avant : coque, ornements, neige)                         */
/* ------------------------------------------------------------------ */

function TraineauAvant() {
  return (
    <svg className="capa" viewBox="0 0 560 380" aria-hidden="true">
      {/* coque laquée */}
      <path d={COQUE} fill="url(#rojo)" />
      <g clipPath="url(#coqueClip)">
        <path d="M80 236 C150 272 300 284 440 256" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity=".2" filter="url(#flou2)" />
        <path d="M60 300 H510 V320 H60Z" fill="#2a0208" opacity=".25" filter="url(#flou2)" />
      </g>
      <path d={COQUE} fill="none" stroke="url(#oroH)" strokeWidth="6" strokeLinejoin="round" />
      <path d={COQUE} fill="none" stroke="#fffbe0" strokeWidth="1.2" opacity=".55" strokeLinejoin="round" transform="translate(0 -1.5)" />
      <path d="M76 214 C82 250 108 282 162 291 H400 C446 288 484 258 490 228" fill="none" stroke="url(#oroH)" strokeWidth="3" opacity=".95" />

      {/* volutes dorées */}
      <g fill="none" stroke="url(#oroH)" strokeWidth="3.4" strokeLinecap="round">
        <path d="M178 270 C184 252 210 252 212 268 C214 282 194 284 192 272 C191 264 200 262 202 268" />
        <path d="M352 270 C346 252 320 252 318 268 C316 282 336 284 338 272 C339 264 330 262 328 268" />
        <path d="M120 262 C126 250 142 252 142 262 C142 270 130 270 130 263" strokeWidth="2.6" />
        <path d="M410 262 C404 250 388 252 388 262 C388 270 400 270 400 263" strokeWidth="2.6" />
      </g>
      {/* médaillon */}
      <circle cx="265" cy="272" r="18" fill="#7a0f1a" stroke="url(#oroH)" strokeWidth="4" />
      <circle cx="265" cy="272" r="13" fill="none" stroke="#fbe08a" strokeWidth="1" strokeDasharray="1.5 2.5" />
      <path d="M265 261 l3.2 6.6 7.3 1 -5.3 5.2 1.3 7.3 -6.5 -3.5 -6.5 3.5 1.3 -7.3 -5.3 -5.2 7.3 -1z" fill="#fbe08a" />
      {[[222, 296], [308, 296], [150, 282], [380, 282]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3.4" fill="#fff3bf" stroke="#a8721f" strokeWidth="1" />
      ))}

      {/* neige sur le rebord */}
      <path
        d="M128 228 C220 244 340 246 436 234"
        fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round"
        strokeDasharray="30 8 18 10 26 6 14 9 34 8 20 7 28 8"
      />
      <path
        d="M63 206 C60 186 72 168 92 168 C104 170 108 186 114 204"
        fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeDasharray="22 6 16 8 24 6"
      />
      <path d="M452 226 C462 212 470 208 478 208 C490 206 500 214 498 226" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeDasharray="14 5 18 6" />

      {/* houx & baies sur la volute avant */}
      <g transform="translate(440 226)">
        <g transform="rotate(-168) translate(0 -10) scale(.8)"><use href="#hoja" width="60" height="20" /></g>
        <g transform="rotate(-12) translate(0 -10) scale(.8)"><use href="#hoja" width="60" height="20" /></g>
        <g transform="rotate(-92) translate(0 -10) scale(.65)"><use href="#hoja" width="60" height="20" /></g>
        {[[-8, 4], [8, 4], [0, -5]].map(([x, y]) => (
          <g key={x + "" + y}>
            <circle cx={x} cy={y + 2} r="7.5" fill="#d4222f" stroke="#7a0f1a" strokeWidth="1.2" />
            <circle cx={x - 2.2} cy={y} r="2.2" fill="#fff" opacity=".7" />
          </g>
        ))}
      </g>

      {/* étoiles scintillantes */}
      {[[52, 140, 8], [512, 190, 7], [470, 120, 5], [90, 90, 5]].map(([x, y, r]) => (
        <path
          key={x}
          d={`M${x} ${y - r} Q${x + r * 0.15} ${y - r * 0.15} ${x + r} ${y} Q${x + r * 0.15} ${y + r * 0.15} ${x} ${y + r} Q${x - r * 0.15} ${y + r * 0.15} ${x - r} ${y} Q${x - r * 0.15} ${y - r * 0.15} ${x} ${y - r}Z`}
          fill="#fff0b0" opacity=".9"
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  CADEAU 3D (cube en CSS 3D)                                         */
/* ------------------------------------------------------------------ */

function Cadeau({ etape }) {
  const lid = LID[etape];
  return (
    <div className="cubo">
      <div className="cuerpo">
        <i className="cara f-iz sombra2" />
        <i className="cara f-at sombra1" />
        <i className="cara f-luz" />
        <i className="cara f-de sombra1" />
        <i className="cara f-fr" />
      </div>
      <div
        className="tapa"
        style={{
          transform: `translate3d(0, ${lid.y}cqw, 0) rotateZ(${lid.rz}deg) rotateX(${lid.rx}deg)`,
          opacity: lid.o,
        }}
      >
        <i className="cara t-iz sombra2" />
        <i className="cara t-at sombra1" />
        <i className="cara t-de sombra1" />
        <i className="cara t-fr" />
        <i className="cara t-top" />
        {/* nœud qui se desserre au fil des clics */}
        <div className="lazo" style={{ transform: `scale(${1 - etape * 0.07}) rotateY(${etape * 8}deg)` }}>
          {[0, 90, 180, 270].map((a) => (
            <div key={a} className="gpetalo" style={{ transform: `rotateY(${a}deg)` }}>
              <div className="plano" />
              <div className="petalo" />
            </div>
          ))}
          <div className="nudo" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  COUPON (image PNG)                                                 */
/* ------------------------------------------------------------------ */

function Coupon({ onReset }) {
  return (
    <div className="coupon-in mt-8 w-full max-w-[640px]">
      <img
        src={couponImg}
        alt="Cupón de chocolate : vale por una tableta de chocolate a tu elección"
        className="w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]"
        draggable={false}
      />
      <button
        type="button"
        onClick={onReset}
        className="mx-auto mt-5 block text-sm text-amber-300 underline underline-offset-4 hover:text-amber-200"
      >
        Refermer le cadeau
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  COMPOSANT PRINCIPAL                                                */
/* ------------------------------------------------------------------ */

export default function CadeauTraineau({ clicsInitiaux = 0 }) {
  const [clics, setClics] = useState(clicsInitiaux);
  const ouvert = clics >= NB_CLICS;
  const etape = Math.min(clics, NB_CLICS);

  const cliquer = () => {
    if (!ouvert) setClics((c) => c + 1);
  };

  const touche = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      cliquer();
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 text-amber-50">
      <style>{CSS}</style>

      <h1 className="mb-2 text-center font-serif text-3xl text-amber-100">
        Jour 4 : la livraison du Père Noël
      </h1>
      <p className="mb-4 min-h-[1.5rem] text-center text-amber-200/80" aria-live="polite">
        {ouvert ? "Le cadeau est ouvert !" : INDICES[etape]}
      </p>

      <div className="flotte w-full max-w-[620px]">
        <div
          className="escena"
          role="button"
          tabIndex={ouvert ? -1 : 0}
          aria-disabled={ouvert}
          aria-label={ouvert ? "Cadeau ouvert" : `Ouvrir le cadeau (${clics} sur ${NB_CLICS})`}
          onClick={cliquer}
          onKeyDown={touche}
        >
          <TraineauAtras />

          <div className="origen">
            <div className="halo" style={{ opacity: HALO[etape] }} />
            <div className="rayos" style={{ opacity: RAYOS[etape] }} />

            <div className="persp">
              <div className={`sacude ${clics > 0 ? (clics % 2 ? "sacude-a" : "sacude-b") : ""}`}>
                <div className="oscila">
                  <Cadeau etape={etape} />
                </div>
              </div>
            </div>

            {ouvert &&
              CHISPAS.map(([dx, dy, d], i) => (
                <div
                  key={i}
                  className="chispa"
                  style={{ "--dx": `${dx}cqw`, "--dy": `${dy}cqw`, "--d": `${d}s` }}
                />
              ))}
          </div>

          <TraineauAvant />
        </div>
      </div>

      {!ouvert && (
        <div className="mt-4 flex items-center gap-2" aria-hidden="true">
          {Array.from({ length: NB_CLICS }).map((_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full border border-amber-200/60 transition-colors duration-300 ${
                i < clics ? "bg-amber-300" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      )}

      {ouvert && <Coupon onReset={() => setClics(0)} />}
    </div>
  );
}
