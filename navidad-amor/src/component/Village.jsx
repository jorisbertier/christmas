import React, { useState, useEffect } from 'react';
// import { surprises } from "../data/surprises";
import SurprisePage from "./SurprisePage";

// IMPORTATION EXPLICITE DE TOUTES LES MAISONS
import maison1 from '../assets/house/Maison 1.png';
import maison2 from '../assets/house/Maison 2.png';
import maison3 from '../assets/house/Maison 3.png';
import maison4 from '../assets/house/Maison 4.png';
import maison5 from '../assets/house/Maison 5.png';
import maison6 from '../assets/house/Maison 6.png';
import maison7 from '../assets/house/Maison 7.png';
import maison8 from '../assets/house/Maison 8.png';
import maison9 from '../assets/house/Maison 9.png';
import maison10 from '../assets/house/Maison 10.png';
import maison11 from '../assets/house/Maison 11.png';
import maison12 from '../assets/house/Maison 12.png';
import maison13 from '../assets/house/Maison 13.png';
import maison14 from '../assets/house/Maison 14.png';
import maison15 from '../assets/house/Maison 15.png';
import maison16 from '../assets/house/Maison 16.png';
import maison17 from '../assets/house/Maison 17.png';
import maison18 from '../assets/house/Maison 18.png';
import maison19 from '../assets/house/Maison 19.png';
import maison20 from '../assets/house/Maison 20.png';
import maison21 from '../assets/house/Maison 21.png';
import maison22 from '../assets/house/Maison 22.png';
import maison23 from '../assets/house/Maison 23.png';
import maison24 from '../assets/house/Maison 24.png';
import SecretNoel from './Day/SecretNoel';

// Associe les jours à leurs composants.
// const composants = {
//   2: SecretNoel,
// //   5: LettreAmour,
// //   8: QuizAmour,
// };


function GreenAurora({ className = "", style = {} }) {
  return (
    <svg
      viewBox="0 0 800 420"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{
        display: "block",
        width: "300px",
        height: "100%",
        overflow: "visible",
        pointerEvents: "none",
        ...style,
      }}
    >
      <defs>
        {/* Disparition progressive sur tous les côtés */}
        <radialGradient id="auroraFade" cx="50%" cy="43%" r="55%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="55%" stopColor="white" stopOpacity=".95" />
          <stop offset="78%" stopColor="white" stopOpacity=".55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        <mask id="auroraMask">
          <rect width="800" height="420" fill="url(#auroraFade)" />
        </mask>

        {/* Lumière verte principale */}
        <linearGradient id="auroraEmerald" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#a5ff8f" stopOpacity="0" />
          <stop offset="18%" stopColor="#55ff85" stopOpacity=".55" />
          <stop offset="42%" stopColor="#00f58b" stopOpacity=".95" />
          <stop offset="65%" stopColor="#31ffb4" stopOpacity=".75" />
          <stop offset="100%" stopColor="#80ffe0" stopOpacity="0" />
        </linearGradient>

        {/* Voile turquoise */}
        <linearGradient id="auroraMint" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#72ffba" stopOpacity="0" />
          <stop offset="35%" stopColor="#69ffe1" stopOpacity=".75" />
          <stop offset="60%" stopColor="#29eeb0" stopOpacity=".5" />
          <stop offset="100%" stopColor="#8bffe6" stopOpacity="0" />
        </linearGradient>

        {/* Liseré lumineux */}
        <linearGradient id="auroraEdge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d1ffae" stopOpacity="0" />
          <stop offset="25%" stopColor="#d5ffb0" stopOpacity=".8" />
          <stop offset="50%" stopColor="#a2ffd8" stopOpacity="1" />
          <stop offset="75%" stopColor="#8dffb7" stopOpacity=".8" />
          <stop offset="100%" stopColor="#d1ffae" stopOpacity="0" />
        </linearGradient>

        {/* Reflets violets comme dans l'image de référence */}
        <linearGradient id="auroraViolet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a477ff" stopOpacity="0" />
          <stop offset="45%" stopColor="#9270ff" stopOpacity=".35" />
          <stop offset="75%" stopColor="#6ce8d9" stopOpacity=".2" />
          <stop offset="100%" stopColor="#a477ff" stopOpacity="0" />
        </linearGradient>

        <filter id="auroraBlur">
          <feGaussianBlur stdDeviation="17" />
        </filter>

        <filter id="auroraSoftGlow">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <g mask="url(#auroraMask)">
        {/* Halo doux derrière les voiles */}
        <g filter="url(#auroraBlur)">
          <path
            d="
              M 80 90
              C 155 5, 205 15, 260 100
              S 355 205, 415 105
              S 520 10, 570 95
              S 650 185, 735 65
              L 735 205
              C 655 285, 595 190, 555 155
              S 470 210, 420 230
              S 320 180, 260 155
              S 165 160, 80 200 Z
            "
            fill="#00ff82"
            opacity=".65"
          />
        </g>

        {/* Voile violet diffus sous les lumières */}
        <path
          d="
            M 55 95
            C 150 30, 215 70, 260 135
            S 355 230, 425 135
            S 520 55, 575 115
            S 675 180, 750 90
            L 750 230
            C 655 280, 590 220, 540 200
            S 455 270, 390 255
            S 290 190, 235 190
            S 135 225, 55 230 Z
          "
          fill="url(#auroraViolet)"
          opacity=".85"
        />

        {/* Grand rideau vert ondulé */}
        <path
          d="
            M 40 45
            C 105 20, 145 35, 185 95
            C 220 150, 250 180, 300 150
            C 355 118, 335 48, 385 35
            C 435 22, 450 100, 485 135
            C 530 180, 565 170, 595 120
            C 635 55, 670 30, 725 55
            L 755 105
            C 690 90, 655 115, 620 175
            C 580 245, 520 230, 475 190
            C 430 150, 415 95, 390 100
            C 360 105, 375 175, 330 205
            C 275 245, 215 210, 175 160
            C 130 105, 100 90, 40 120 Z
          "
          fill="url(#auroraEmerald)"
        />

        {/* Deuxième voile, plus léger */}
        <path
          d="
            M 105 30
            C 165 55, 170 125, 220 165
            C 270 205, 320 190, 345 140
            C 375 80, 380 40, 415 50
            C 450 60, 460 135, 510 175
            C 560 215, 605 195, 645 125
            C 675 75, 705 65, 740 85
            C 690 150, 670 225, 610 245
            C 555 265, 510 225, 470 190
            C 425 150, 410 115, 390 145
            C 360 195, 330 245, 275 245
            C 210 245, 165 185, 135 130 Z
          "
          fill="url(#auroraMint)"
          opacity=".75"
        />

        {/* Fines colonnes de lumière */}
        <g
          fill="none"
          strokeLinecap="round"
          filter="url(#auroraSoftGlow)"
          opacity=".65"
        >
          <path
            d="M 180 55 C 205 105, 170 145, 205 205"
            stroke="#9dff9b"
            strokeWidth="18"
          />
          <path
            d="M 300 125 C 330 165, 290 205, 320 245"
            stroke="#3dffad"
            strokeWidth="20"
          />
          <path
            d="M 415 45 C 440 95, 405 150, 445 210"
            stroke="#b0ffd0"
            strokeWidth="20"
          />
          <path
            d="M 555 125 C 585 165, 545 205, 575 240"
            stroke="#7bffc1"
            strokeWidth="18"
          />
          <path
            d="M 665 70 C 685 110, 655 155, 680 190"
            stroke="#4dff91"
            strokeWidth="16"
          />
        </g>

        {/* Lignes lumineuses délicates */}
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="
              M 55 75
              C 130 35, 165 75, 205 130
              S 285 195, 330 150
              S 370 55, 405 65
              S 465 145, 510 165
              S 585 155, 625 100
              S 695 60, 745 85
            "
            stroke="url(#auroraEdge)"
            strokeWidth="3"
            opacity=".9"
          />

          <path
            d="
              M 100 105
              C 165 75, 190 135, 235 175
              S 315 205, 345 165
              S 390 100, 415 115
              S 470 190, 515 205
              S 595 175, 625 135
            "
            stroke="#baffc9"
            strokeWidth="2"
            opacity=".6"
          />

          <path
            d="
              M 135 45
              C 180 90, 180 145, 225 175
              S 290 205, 320 185
            "
            stroke="#c7ffd2"
            strokeWidth="2"
            opacity=".55"
          />
        </g>

        {/* Petits éclats lumineux */}
        {[
          [150, 83, 2],
          [240, 128, 1.5],
          [310, 166, 2],
          [395, 70, 1.8],
          [460, 137, 2],
          [525, 172, 1.5],
          [600, 123, 2],
          [665, 91, 1.5],
        ].map(([x, y, r], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="#edffe6"
            opacity=".8"
          />
        ))}
      </g>
    </svg>
  );
}


export default function Village() {
    const [joursOuverts, setJoursOuverts] = useState({});

    const toggleJour = (id) => {
        setJoursOuverts(prev => ({ ...prev, [id]: !prev[id] }));
    };

  // Tableau associant les composants importés aux positions Figma d'origine
    const maisons = [
        { id: 20, src: maison20, taille: 'w-[150px] h-[150px]', position: 'top-[10px] right-[560px] z-0' },
        { id: 24, src: maison24, taille: 'w-[210px] h-[210px]', position: 'top-[10px] right-[365px] z-0' },
        { id: 4, src: maison4, taille: 'w-[170px] h-[170px]', position: 'top-[50px] right-[240px] z-0' },
        { id: 18, src: maison18, taille: 'w-[150px] h-[150px]', position: 'top-[70px] right-[450px] z-0' },
        { id: 16, src: maison16, taille: 'w-[170px] h-[170px]', position: 'top-[70px] right-[160px] z-0' },
        { id: 8, src: maison8, taille: 'w-[160px] h-[160px]', position: 'top-[95px] right-[520px] z-0' },
        { id: 14, src: maison14, taille: 'w-[140px] h-[140px]', position: 'top-[116px] right-[600px] z-0' },
        { id: 15, src: maison15, taille: 'w-[170px] h-[170px]', position: 'top-[260px] right-[525px] z-10' },
        { id: 9, src: maison9, taille: 'w-[140px] h-[140px]', position: 'top-[95px] right-[740px] z-0' },
        { id: 12, src: maison12, taille: 'w-[110px] h-[110px]', position: 'top-[272px] right-[630px] z-10' },
        { id: 13, src: maison13, taille: 'w-[140px] h-[140px]', position: 'top-[260px] right-[410px] z-10' },
        { id: 10, src: maison10, taille: 'w-[170px] h-[170px]', position: 'top-[200px] right-[310px] z-10' },
        { id: 1, src: maison1, taille: 'w-[110px] h-[110px]', position: 'top-[288px] left-1/2 -translate-x-1/2 z-10'},
        { id: 23, src: maison23, taille: 'w-[140px] h-[140px]', position: 'top-[174px] right-[440px] z-0' },
        { id: 3, src: maison3, taille: 'w-[140px] h-[140px]', position: 'top-[138px] right-[680px] z-0' },
        { id: 6, src: maison6, taille: 'w-[140px] h-[140px]', position: 'top-[210px] right-[525px] z-0' },
        { id: 17, src: maison17, taille: 'w-[140px] h-[140px]', position: 'top-[195px] right-[600px] z-0' },
        { id: 21, src: maison21, taille: 'w-[140px] h-[140px]', position: 'top-[80px] right-[330px] z-0' },
        { id: 2, src: maison2, taille: 'w-[140px] h-[140px]', position: 'top-[160px] right-[350px] z-0' },
        { id: 5, src: maison5, taille: 'w-[140px] h-[140px]', position: 'top-[146px] right-[250px] z-0' },
        { id: 11, src: maison11, taille: 'w-[170px] h-[170px]', position: 'top-[190px] right-[140px] z-0' },
        { id: 7, src: maison7, taille: 'w-[190px] h-[190px]', position: 'top-[155px] right-[740px] z-0' },
        { id: 19, src: maison19, taille: 'w-[140px] h-[140px]', position: 'top-[240px] right-[680px] z-0' },
        { id: 22, src: maison22, taille: 'w-[140px] h-[140px]', position: 'top-[232px] right-[245px] z-0' },
    ];

    // débloquer les maisons en fonction de la date actuelle
    
    const [messageInterdit, setMessageInterdit] = useState(null);
    const [surpriseOuverte, setSurpriseOuverte] = useState(null);
    const [composantOuvert, setComposantOuvert] = useState(null);

    const maintenant = new Date();

    const jourAutorise =
    maintenant.getFullYear() < 2026
        ? 0
        : maintenant.getFullYear() > 2026
        ? 24
        : maintenant.getMonth() < 9
            ? 0
            : maintenant.getMonth() > 9
            ? 24
            : Math.min(maintenant.getDate(), 24);
    // decembre = 11
const cliquerMaison = (id) => {
    if (id > jourAutorise) {
        setMessageInterdit(id);
        return;
    }

    setMessageInterdit(null);
    setJoursOuverts((prev) => ({
        ...prev,
        [id]: true,
    }));

    // Ouvre la surprise correspondant au jour cliqué
    setComposantOuvert(id);
    setSurpriseOuverte(null);
};

    useEffect(() => {
        if (messageInterdit === null) return;

        const timer = setTimeout(() => {
            setMessageInterdit(null);
        }, 2000);

        return () => clearTimeout(timer);
    }, [messageInterdit]);


    return (
        <div className="relative w-full h-full min-h-0 overflow-hidden">
        {/* EFFET DE NEIGE TOMBANTE */}
        <div className="absolute inset-0 pointer-events-none z-50">
            {[...Array(40)].map((_, i) => (
            <div
                key={i}
                className="absolute bg-white rounded-full opacity-80"
                style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 5 + 2}px`,
                height: `${Math.random() * 5 + 2}px`,
                animation: `fall ${Math.random() * 4 + 4}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
                }}
            />
            ))}
        </div>
        <style>{`
            @keyframes fall {
            0% { transform: translateY(-10px) translateX(0); }
            50% { transform: translateY(50vh) translateX(10px); }
            100% { transform: translateY(105vh) translateX(-5px); }
            }
        `}</style>

        {/* DÉCORATION DE FOND (LUNE) */}
        <div className="absolute top-16 left-32 w-20 h-20 bg-amber-100 rounded-full blur-[1px] opacity-90 shadow-[0_0_40px_#fef08a]">
            <div className="absolute top-0 right-5 w-16 h-16 bg-[#1b1947] rounded-full"></div>
        </div>
<div
  className="absolute pointer-events-none"
  style={{
    width: "72%",
    height: "42%",
    left: "14%",
    top: "0%",
    opacity: 0.85,
  }}
>
  <GreenAurora />
</div>
        {/* CLUSTER CENTRAL DU VILLAGE */}
        <div className="relative flex-1 w-[70%] mx-auto h-[80vh] mt-24 mb-12">

{maisons.map((m) => {
  const ouvert = joursOuverts[m.id];

  return (
    <div
      key={m.id}
      className={`absolute ${m.position} ${m.taille} pointer-events-none group`}
    >
      {/* Maison : animations de survol conservées */}
      <img
        src={m.src}
        alt={`Maison ${m.id}`}
        onClick={() => cliquerMaison(m.id)}
        className="
          relative z-10
          w-full h-full object-contain
          pointer-events-auto cursor-pointer
          origin-bottom
          transition-all duration-300 ease-out
          group-hover:scale-110
          group-hover:-translate-y-2
          group-hover:brightness-110
        "
      />

      {/* Médaillon du numéro */}
      <div
        className="
          absolute z-20
          top-[12%] left-1/2 -translate-x-1/2
          pointer-events-none
          transition-all duration-300 ease-out
          opacity-0 scale-50 -translate-y-2
          group-hover:opacity-100
          group-hover:scale-100
          group-hover:-translate-y-1
        "
      >
        <div
          className={`
            relative flex items-center justify-center
            w-10 h-10 rounded-full
            border-2 border-amber-200/90
            shadow-[0_0_15px_rgba(255,215,100,0.65)]
            ${ouvert
              ? "bg-amber-300 text-indigo-950"
              : "bg-[#202047]/95 text-amber-100"
            }
          `}
        >
          <div className="absolute inset-1 rounded-full border border-white/30" />

          <span className="relative z-10 font-serif font-bold text-lg drop-shadow-sm">
            {m.id}
          </span>
        </div>

        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 bg-amber-300/80 rounded-full blur-sm" />
      </div>

      {/* Halo si la case est ouverte */}
      {ouvert && (
        <div
          className="
            absolute z-0
            top-[15%] left-1/2 -translate-x-1/2
            w-12 h-12 rounded-full
            bg-amber-300/20 blur-xl
            pointer-events-none
          "
        />
      )}
    </div>
  );
})}
        {messageInterdit !== null && (
          <div className="
            fixed bottom-8 left-1/2 -translate-x-1/2
            z-[100] w-max max-w-[90vw]
            rounded-xl border border-amber-200/50
            bg-[#202047]/95 px-5 py-3
            text-center text-amber-100 shadow-xl
            animate-pulse
          ">
            <p className="font-serif text-lg">
              🔒 Encore un peu de patience...
            </p>
            <p className="mt-1 text-sm">
              Ta surprise du {messageInterdit} décembre
              n'est pas encore disponible 🎁
            </p>
            <button
              onClick={() => setMessageInterdit(null)}
              className="mt-2 text-xs text-amber-300 underline pointer-events-auto"
            >
              D'accord ❤️
            </button>
          </div>
        )}
        <SurprisePage
          jour={composantOuvert}
          onClose={() => setComposantOuvert(null)}
        />

        </div>

        {/* FINITION OMBRE DE NEIGE SOL */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/30 to-transparent z-40 pointer-events-none"></div>
        </div>
    );
}