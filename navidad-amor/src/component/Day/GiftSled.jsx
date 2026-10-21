import React, { useState } from "react";
import couponImg from "../../assets/cupon/cupon.png";

// ✏️ À personnaliser
const NB_CLICS = 5;


const LID = [
  { y: 0, r: 0 },
  { y: -2, r: -2 },
  { y: -10, r: -5 },
  { y: -24, r: -10 },
  { y: -40, r: -18 },
  { y: -120, r: 40 }, // envol final
];
const GLOW = [0, 0, 0.3, 0.55, 0.85, 1];
const INDICES = [
  "Touche le cadeau pour l'ouvrir",
  "Le nœud commence à se desserrer…",
  "Le couvercle bouge !",
  "Il y a une lueur là-dedans…",
  "Plus qu'un petit effort…",
];

export default function GiftSled() {
  const [clics, setClics] = useState(0);
  const ouvert = clics >= NB_CLICS;
  const etape = Math.min(clics, NB_CLICS);
  const lid = LID[etape];

  const cliquer = () => {
    if (!ouvert) setClics((c) => c + 1);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 text-amber-50">
      <style>{`
        @keyframes secoueA { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-2.5deg) translateY(-3px)} 50%{transform:rotate(2deg)} 80%{transform:rotate(-1deg)} }
        @keyframes secoueB { 0%,100%{transform:rotate(0)} 20%{transform:rotate(2.5deg) translateY(-3px)} 50%{transform:rotate(-2deg)} 80%{transform:rotate(1deg)} }
        @keyframes flotte { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes coupon { 0%{opacity:0;transform:translateY(40px) scale(.85) rotate(-3deg)} 70%{transform:translateY(-6px) scale(1.02) rotate(.5deg)} 100%{opacity:1;transform:none} }
        .secoue-a{animation:secoueA .45s ease-in-out}
        .secoue-b{animation:secoueB .45s ease-in-out}
        .flotte{animation:flotte 3.5s ease-in-out infinite}
        .coupon-in{animation:coupon .8s cubic-bezier(.2,.8,.2,1) both}
        @media (prefers-reduced-motion: reduce){
          .secoue-a,.secoue-b,.flotte,.coupon-in{animation:none}
        }
      `}</style>

      <h1 className="mb-2 text-center font-serif text-3xl text-amber-100">
        Jour 4 : la livraison du Père Noël
      </h1>
      <p className="mb-6 min-h-[1.5rem] text-center text-amber-200/80" aria-live="polite">
        {ouvert ? "Le cadeau est ouvert !" : INDICES[etape]}
      </p>

      {/* Traîneau + cadeau */}
      <div className="flotte w-full max-w-[520px]">
        <div className={clics % 2 === 0 ? "secoue-a" : "secoue-b"}>
          <button
            type="button"
            onClick={cliquer}
            disabled={ouvert}
            aria-label={
              ouvert
                ? "Cadeau ouvert"
                : `Ouvrir le cadeau (${clics} sur ${NB_CLICS})`
            }
            className="block w-full rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-default enabled:cursor-pointer"
          >
            <svg viewBox="0 0 400 270" className="w-full" role="img" aria-hidden="true">
              <defs>
                <linearGradient id="rouge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#d12a35" />
                  <stop offset="1" stopColor="#8e1620" />
                </linearGradient>
                <linearGradient id="or" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fde68a" />
                  <stop offset="1" stopColor="#d49a2a" />
                </linearGradient>
                <linearGradient id="vert" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1f7a4d" />
                  <stop offset="1" stopColor="#0f4f31" />
                </linearGradient>
                <radialGradient id="lueur" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#fff3b0" stopOpacity="1" />
                  <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Lueur derrière le cadeau */}
              <ellipse
                cx="200" cy="80" rx="150" ry="95"
                fill="url(#lueur)"
                style={{ opacity: GLOW[etape], transition: "opacity .6s ease" }}
              />

              {/* Patins du traîneau */}
              <path
                d="M40 238 H318 Q362 238 366 202 Q368 180 348 178"
                fill="none" stroke="url(#or)" strokeWidth="7" strokeLinecap="round"
              />
              <path d="M120 238 V200 M262 238 V200" stroke="url(#or)" strokeWidth="6" strokeLinecap="round" />

              {/* Dossier */}
              <path d="M52 150 Q38 96 84 84 H108 V150 Z" fill="#8e1620" />
              {/* Caisse */}
              <path
                d="M48 148 H336 Q348 148 342 168 Q326 212 272 214 H112 Q62 210 48 172 Q42 152 48 148 Z"
                fill="url(#rouge)"
              />
              <path d="M62 170 Q112 196 190 196 T330 170" fill="none" stroke="url(#or)" strokeWidth="4" strokeLinecap="round" />
              <circle cx="100" cy="186" r="4" fill="#fde68a" />
              <circle cx="190" cy="199" r="4" fill="#fde68a" />
              <circle cx="280" cy="186" r="4" fill="#fde68a" />

              {/* Sacs de cadeaux en arrière-plan */}
              <rect x="266" y="112" width="52" height="38" rx="6" fill="url(#vert)" />
              <rect x="288" y="112" width="8" height="38" fill="#fde68a" />

              {/* Corps du cadeau */}
              <rect x="140" y="76" width="120" height="74" rx="4" fill="url(#vert)" />
              <rect x="190" y="76" width="20" height="74" fill="url(#or)" />

              {/* Couvercle + nœud */}
              <g
                style={{
                  transform: `translateY(${lid.y}px) rotate(${lid.r}deg)`,
                  transformOrigin: "140px 76px",
                  transition: "transform .6s cubic-bezier(.3,1.4,.5,1), opacity .6s ease .2s",
                  opacity: ouvert ? 0 : 1,
                }}
              >
                <rect x="132" y="54" width="136" height="24" rx="4" fill="#27996a" />
                <rect x="190" y="54" width="20" height="24" fill="url(#or)" />
                {/* Nœud : se desserre au fil des clics */}
                <g
                  style={{
                    transform: `rotate(${etape * 6}deg) scale(${1 - etape * 0.06})`,
                    transformOrigin: "200px 54px",
                    transition: "transform .5s ease",
                  }}
                >
                  <path d="M200 54 C170 20 148 40 172 54 Z" fill="url(#or)" />
                  <path d="M200 54 C230 20 252 40 228 54 Z" fill="url(#or)" />
                  <circle cx="200" cy="52" r="7" fill="#d49a2a" />
                </g>
              </g>
            </svg>
          </button>
        </div>
      </div>

      {/* Progression */}
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