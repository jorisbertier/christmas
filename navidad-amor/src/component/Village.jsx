import React, { useState, useEffect, useId } from 'react';
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
import church from '../assets/house/Church.png';
import SecretNoel from './Day/SecretNoel';

import choice11 from '../assets/choice/11.png';
import choice12 from '../assets/choice/12.jpg';
import Meteors from './Choice/Meteors';
import choice21 from '../assets/choice/21.png';
import choice22 from '../assets/choice/22.png';
import choice41 from '../assets/choice/41.png';
import choice42 from '../assets/choice/42.png';
import IceSkating from "./Choice/IceSkating";
import SantaCrossing from "../component/Choice/SantaCrossing";
import SantaLottie from './Choice/SantaLottie';
import Creche from './Choice/Creche';
import Aurora from './Choice/Aurora';

const AVAILABLE_CHOICES = [
    11, 12, 21, 22, 31, 32, 41, 42, 51, 52
];

const STORAGE_KEYS = [
    "navidad_pueblo_decision_1",
    "navidad_pueblo_decision_2",
    "navidad_pueblo_decision_3",
    "navidad_pueblo_decision_4",
    "navidad_pueblo_decision_5",
];

const getSelectedChoices = () => {
    try {
        return [1, 2, 3, 4, 5]
            .map((i) => {
                const value = localStorage.getItem(
                    `navidad_pueblo_decision_${i}`
                );

                if (value === null || value.trim() === "") return null;

                const number = Number(value);

                return AVAILABLE_CHOICES.includes(number) ? number : null;
            })
            .filter((value) => value !== null);
    } catch {
        return [];
    }
};


export default function Village() {
    const [joursOuverts, setJoursOuverts] = useState({});
    const selectedChoices = getSelectedChoices();

    const isVisible = (number) => selectedChoices.includes(number);

    const houseClass = (number, baseClass) => `
        ${baseClass}
        transition-all duration-700
        ${isVisible(number)
            ? "visible"
            : "hidden"
        }
    `;
    const toggleJour = (id) => {
        setJoursOuverts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const [villageDecisions, setVillageDecisions] = useState({});

    useEffect(() => {
        const result = {};

        for (let i = 1; i <= 5; i++) {
            result[i] = localStorage.getItem(`navidad_pueblo_decision_${i}`);
        }

        setVillageDecisions(result);
    }, []);

    // CHOICE 
    
    const choixCiel = villageDecisions[1];
    const choixArbre = villageDecisions[2];
    const choixPlace = villageDecisions[3];
    const choixDouceurs = villageDecisions[4];
    const choixPereNoel = villageDecisions[5];

    const maisons = [
        { id: 25, src: church, taille: 'w-[17%] h-[41%]', position: '-top-[5%] right-[60%] z-0' },
        { id: 20, src: maison20, taille: 'w-[14%] h-[27%]', position: 'top-[1%] right-[52%] z-0' },
        { id: 24, src: maison24, taille: 'w-[20%] h-[39%]', position: 'top-[2%] right-[34%] z-0' },
        { id: 4, src: maison4, taille: 'w-[16%] h-[31%]', position: 'top-[9%] right-[22%] z-0' },
        { id: 18, src: maison18, taille: 'w-[14%] h-[30%]', position: 'top-[12%] right-[42%] z-0' },
        { id: 16, src: maison16, taille: 'w-[16%] h-[31%]', position: 'top-[12%] right-[15%] z-0' },
        { id: 8, src: maison8, taille: 'w-[15%] h-[29%]', position: 'top-[17%] right-[48%] z-0' },
        { id: 14, src: maison14, taille: 'w-[13%] h-[25%]', position: 'top-[21%] right-[56%] z-0' },
        { id: 15, src: maison15, taille: 'w-[16%] h-[31%]', position: 'top-[47%] right-[49%] z-10' },
        { id: 9, src: maison9, taille: 'w-[13%] h-[26%]', position: 'top-[17%] right-[69%] z-0' },
        { id: 12, src: maison12, taille: 'w-[10%] h-[20%]', position: 'top-[49%] right-[59%] z-10' },
        { id: 13, src: maison13, taille: 'w-[13%] h-[25%]', position: 'top-[47%] right-[38%] z-10' },
        { id: 10, src: maison10, taille: 'w-[16%] h-[31%]', position: 'top-[36%] right-[29%] z-10' },
        { id: 1, src: maison1, taille: 'w-[10%] h-[20%]', position: 'top-[52%] left-1/2 -translate-x-1/2 z-10'},
        { id: 23, src: maison23, taille: 'w-[13%] h-[25%]', position: 'top-[31%] right-[41%] z-0' },
        { id: 3, src: maison3, taille: 'w-[13%] h-[25%]', position: 'top-[25%] right-[63%] z-0' },
        { id: 6, src: maison6, taille: 'w-[13%] h-[25%]', position: 'top-[37%] right-[49%] z-0' },
        { id: 17, src: maison17, taille: 'w-[13%] h-[25%]', position: 'top-[35%] right-[56%] z-0' },
        { id: 21, src: maison21, taille: 'w-[13%] h-[25%]', position: 'top-[15%] right-[31%] z-0' },
        { id: 2, src: maison2, taille: 'w-[13%] h-[25%]', position: 'top-[29%] right-[33%] z-0' },
        { id: 5, src: maison5, taille: 'w-[13%] h-[25%]', position: 'top-[27%] right-[23%] z-0' },
        { id: 11, src: maison11, taille: 'w-[16%] h-[31%]', position: 'top-[35%] right-[13%] z-0' },
        { id: 7, src: maison7, taille: 'w-[18%] h-[34%]', position: 'top-[28%] right-[68%] z-0' },
        { id: 19, src: maison19, taille: 'w-[13%] h-[25%]', position: 'top-[43%] right-[63%] z-0' },
        { id: 22, src: maison22, taille: 'w-[13%] h-[25%]', position: 'top-[41%] right-[23%] z-0' },
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
        <Aurora
          speed={1}
          intensity="medium"
          className={houseClass(11, "absolute inset-0 z-0 pointer-events-none")}
        />
          <Meteors
            count={35}
            speed={1}
            meteorColor="#fff8dc"
            tailColor="rgba(191, 219, 254, 0.55)"
            className={houseClass(12, "absolute inset-0 z-50 pointer-events-none")}
          />
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

          {/** CHOICE */}
        <div className={houseClass(31, "absolute -bottom-[50px] left-1/2 z-30 w-full max-w-[700px] -translate-x-1/2 pointer-events-none")}>
          <svg viewBox="0 0 800 700" className="h-auto w-full">
            <IceSkating x={400} y={553} />
          </svg>
        </div>
          {/** CHOICE */}
        <div className={houseClass(32, "absolute -bottom-[50px] left-1/2 z-30 w-full max-w-[700px] -translate-x-1/2 pointer-events-none")}>
          <svg viewBox="0 0 800 700" className="h-auto w-full">
            <Creche x={500} y={540} scale={0.8} />  
          </svg>
        </div>

        <img src={choice11} alt="" className={houseClass(11, "absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-72")}/>

        <img src={choice21} alt=""   className={houseClass(21, "absolute bottom-[30%] right-[12%] -translate-x-1/2 w-[150px] h-72 z-0")}/>
        <img src={choice22} alt=""   className={houseClass(22, "absolute bottom-[30%] right-[6%] -translate-x-1/2 w-[250px] h-72 z-0")}/>

        <img src={choice41} alt=""   className={houseClass(41, "absolute bottom-[29%] left-[23%] -translate-x-1/2 w-[200px] h-72 z-0")}/>
        <img src={choice42} alt=""   className={houseClass(42, "absolute bottom-[30%] left-[23%] -translate-x-1/2 w-[200px] h-72 z-0")}/>

        <div className={houseClass(51, "absolute top-10 left-[60%] z-0")}>
          <SantaCrossing
            delay={0}
            duration={15000}
            width={180}
            bottom={100}
          />
        </div>
        <div className={houseClass(52, "absolute top-[12%] left-[62%] z-0")}>
          <SantaLottie width={130} />
        </div>

        {/* CLUSTER CENTRAL DU VILLAGE */}
        <div className="relative flex-1 w-[70%] mx-auto h-[80vh] mt-24 mb-12">
        {/* <div className="relative flex-1 w-[100%] mx-auto h-[100vh] bg-red-300"> */}

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



/// ICI NORMALEMENT BON REPSONSIVE A POSSITIONNER

// import React, { useState, useEffect, useId, useRef, useLayoutEffect } from 'react';
// // import { surprises } from "../data/surprises";
// import SurprisePage from "./SurprisePage";

// // IMPORTATION EXPLICITE DE TOUTES LES MAISONS
// import maison1 from '../assets/house/Maison 1.png';
// import maison2 from '../assets/house/Maison 2.png';
// import maison3 from '../assets/house/Maison 3.png';
// import maison4 from '../assets/house/Maison 4.png';
// import maison5 from '../assets/house/Maison 5.png';
// import maison6 from '../assets/house/Maison 6.png';
// import maison7 from '../assets/house/Maison 7.png';
// import maison8 from '../assets/house/Maison 8.png';
// import maison9 from '../assets/house/Maison 9.png';
// import maison10 from '../assets/house/Maison 10.png';
// import maison11 from '../assets/house/Maison 11.png';
// import maison12 from '../assets/house/Maison 12.png';
// import maison13 from '../assets/house/Maison 13.png';
// import maison14 from '../assets/house/Maison 14.png';
// import maison15 from '../assets/house/Maison 15.png';
// import maison16 from '../assets/house/Maison 16.png';
// import maison17 from '../assets/house/Maison 17.png';
// import maison18 from '../assets/house/Maison 18.png';
// import maison19 from '../assets/house/Maison 19.png';
// import maison20 from '../assets/house/Maison 20.png';
// import maison21 from '../assets/house/Maison 21.png';
// import maison22 from '../assets/house/Maison 22.png';
// import maison23 from '../assets/house/Maison 23.png';
// import maison24 from '../assets/house/Maison 24.png';
// import church from '../assets/house/Church.png';
// import SecretNoel from './Day/SecretNoel';

// import choice11 from '../assets/choice/11.png';
// import choice12 from '../assets/choice/12.jpg';
// import choice21 from '../assets/choice/21.png';
// import choice22 from '../assets/choice/22.png';
// import choice41 from '../assets/choice/41.png';
// import choice42 from '../assets/choice/42.png';
// import IceSkating from "./Choice/IceSkating";
// import SantaCrossing from "../component/Choice/SantaCrossing";
// import SantaLottie from './Choice/SantaLottie';


// /**
//  * Keeps a scene IDENTICAL on every screen size.
//  *
//  * You design the scene once, in pixels, on a "design canvas" (for example 1920 × 950).
//  * This hook measures the real container and tells you:
//  *   - scale : how much to zoom the canvas so that it fits
//  *   - offsetX / offsetY : where to put it so that it stays centred
//  *
//  * fit = "contain" → the whole scene is always visible (bars on the sides if the ratio differs)
//  * fit = "cover"   → the scene fills everything (the edges may be cropped)
//  * fit = "width"   → always the full width (aligned on top, may scroll/crop at the bottom)
//  */
// function useDesignScale(ref, design, fit = "contain") {
//   const [box, setBox] = useState({ scale: 1, offsetX: 0, offsetY: 0 });

//   useLayoutEffect(() => {
//     const el = ref.current;
//     if (!el) return undefined;

//     const update = () => {
//       const { width, height } = el.getBoundingClientRect();
//       if (!width || !height) return;
//       const sx = width / design.w;
//       const sy = height / design.h;
//       const scale = fit === "cover" ? Math.max(sx, sy) : fit === "width" ? sx : Math.min(sx, sy);
//       setBox({
//         scale,
//         offsetX: (width - design.w * scale) / 2,
//         offsetY: fit === "width" ? 0 : (height - design.h * scale) / 2,
//       });
//     };

//     update();
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     window.addEventListener("orientationchange", update);
//     return () => { ro.disconnect(); window.removeEventListener("orientationchange", update); };
//   }, [ref, design.w, design.h, fit]);

//   return box;
// }

// export default function Village() {
//     const [joursOuverts, setJoursOuverts] = useState({});

//         const sceneRef = useRef(null);

//           const { scale, offsetX, offsetY } = useDesignScale(
//               sceneRef,
//               { w: 1920, h: 1080 },
//               "contain"
//           );


//     const toggleJour = (id) => {
//         setJoursOuverts(prev => ({ ...prev, [id]: !prev[id] }));
//     };

//     const [villageDecisions, setVillageDecisions] = useState({});

//     useEffect(() => {
//         const result = {};

//         for (let i = 1; i <= 5; i++) {
//             result[i] = localStorage.getItem(`navidad_pueblo_decision_${i}`);
//         }

//         setVillageDecisions(result);
//     }, []);
    
//     const choixCiel = villageDecisions[1];
//     const choixArbre = villageDecisions[2];
//     const choixPlace = villageDecisions[3];
//     const choixDouceurs = villageDecisions[4];
//     const choixPereNoel = villageDecisions[5];

//   // Tableau associant les composants importés aux positions Figma d'origine
//   //w 150px =     180px= 17%  210px = 20%
//   //h 140px = 25%
//     const maisons = [
//         { id: 25, src: church, taille: 'w-[17%] h-[41%]', position: 'top-[5%] right-[60%] z-0' },
//         { id: 20, src: maison20, taille: 'w-[14%] h-[150px]', position: 'top-[10px] right-[560px] z-0' },
//         { id: 24, src: maison24, taille: 'w-[20%] h-[210px]', position: 'top-[10px] right-[365px] z-0' },
//         { id: 4, src: maison4, taille: 'w-[16%] h-[170px]', position: 'top-[50px] right-[240px] z-0' },
//         { id: 18, src: maison18, taille: 'w-[14%] h-[150px]', position: 'top-[70px] right-[450px] z-0' },
//         { id: 16, src: maison16, taille: 'w-[16%] h-[170px]', position: 'top-[70px] right-[160px] z-0' },
//         { id: 8, src: maison8, taille: 'w-[15%] h-[160px]', position: 'top-[95px] right-[520px] z-0' },
//         { id: 14, src: maison14, taille: 'w-[13%] h-[140px]', position: 'top-[116px] right-[600px] z-0' },
//         { id: 15, src: maison15, taille: 'w-[16%] h-[36%]', position: 'top-[53%] right-[47%] z-10' },
//         { id: 9, src: maison9, taille: 'w-[13%] h-[25%]', position: 'top-[28%] right-[70%] z-0' },
//         { id: 12, src: maison12, taille: 'w-[10%] h-[19%]', position: 'top-[59%] right-[57%] z-10' },
//         { id: 13, src: maison13, taille: 'w-[13%] h-[28%]', position: 'top-[51%] right-[34%] z-10' },
//         { id: 10, src: maison10, taille: 'w-[16%] h-[170px]', position: 'top-[200px] right-[310px] z-10' },
//         { id: 1, src: maison1, taille: 'w-[10%] h-[22%]', position: 'top-[57%] right-[42%] z-10'},
//         { id: 23, src: maison23, taille: 'w-[13%] h-[140px]', position: 'top-[174px] right-[440px] z-0' },
//         { id: 3, src: maison3, taille: 'w-[13%] h-[25%]', position: 'top-[36%] right-[63%] z-0' },
//         { id: 6, src: maison6, taille: 'w-[13%] h-[140px]', position: 'top-[210px] right-[525px] z-0' },
//         { id: 17, src: maison17, taille: 'w-[13%] h-[140px]', position: 'top-[195px] right-[600px] z-0' },
//         { id: 21, src: maison21, taille: 'w-[13%] h-[140px]', position: 'top-[80px] right-[330px] z-0' },
//         { id: 2, src: maison2, taille: 'w-[13%] h-[140px]', position: 'top-[160px] right-[350px] z-0' },
//         { id: 5, src: maison5, taille: 'w-[13%] h-[140px]', position: 'top-[146px] right-[250px] z-0' },
//         { id: 11, src: maison11, taille: 'w-[16%] h-[170px]', position: 'top-[190px] right-[140px] z-0' },
//         { id: 7, src: maison7, taille: 'w-[18%] h-[32%]', position: 'top-[39%] right-[70%] z-0' },
//         { id: 19, src: maison19, taille: 'w-[13%] h-[25%]', position: 'top-[52%] right-[63%] z-0' },
//         { id: 22, src: maison22, taille: 'w-[13%] h-[140px]', position: 'top-[232px] right-[245px] z-0' },
//     ];

//     // débloquer les maisons en fonction de la date actuelle
    
//     const [messageInterdit, setMessageInterdit] = useState(null);
//     const [surpriseOuverte, setSurpriseOuverte] = useState(null);
//     const [composantOuvert, setComposantOuvert] = useState(null);

//     const maintenant = new Date();

//     const jourAutorise =
//     maintenant.getFullYear() < 2026
//         ? 0
//         : maintenant.getFullYear() > 2026
//         ? 24
//         : maintenant.getMonth() < 9
//             ? 0
//             : maintenant.getMonth() > 9
//             ? 24
//             : Math.min(maintenant.getDate(), 24);
//     // decembre = 11
//     const cliquerMaison = (id) => {
//         if (id > jourAutorise) {
//             setMessageInterdit(id);
//             return;
//         }

//         setMessageInterdit(null);
//         setJoursOuverts((prev) => ({
//             ...prev,
//             [id]: true,
//         }));

//         // Ouvre la surprise correspondant au jour cliqué
//         setComposantOuvert(id);
//         setSurpriseOuverte(null);
//     };

//     useEffect(() => {
//         if (messageInterdit === null) return;

//         const timer = setTimeout(() => {
//             setMessageInterdit(null);
//         }, 2000);

//         return () => clearTimeout(timer);
//     }, [messageInterdit]);


//     return (
//         <div
//           ref={sceneRef}
//           className="relative w-full h-screen overflow-hidden"
//         >
//                   {/* CANEVAS FIXE DE 1920 × 1080 */}
//         <div
//             className="absolute w-full h-full"
//             style={{
//                 left: `${offsetX}px`,
//                 top: `${offsetY}px`,
//                 transform: `scale(${scale})`,
//                 transformOrigin: "top left"
//             }}
//         >
//         {/* EFFET DE NEIGE TOMBANTE */}
//         <div className="absolute inset-0 pointer-events-none z-50">
//             {[...Array(40)].map((_, i) => (
//             <div
//                 key={i}
//                 className="absolute bg-white rounded-full opacity-80"
//                 style={{
//                 top: `${Math.random() * 100}%`,
//                 left: `${Math.random() * 100}%`,
//                 width: `${Math.random() * 5 + 2}px`,
//                 height: `${Math.random() * 5 + 2}px`,
//                 animation: `fall ${Math.random() * 4 + 4}s linear infinite`,
//                 animationDelay: `${Math.random() * 5}s`,
//                 }}
//             />
//             ))}
//         </div>
//         <style>{`
//             @keyframes fall {
//             0% { transform: translateY(-10px) translateX(0); }
//             50% { transform: translateY(50vh) translateX(10px); }
//             100% { transform: translateY(105vh) translateX(-5px); }
//             }
//         `}</style>

//         {/* DÉCORATION DE FOND (LUNE) */}
//         <div className="absolute top-16 left-32 w-20 h-20 bg-amber-100 rounded-full blur-[1px] opacity-90 shadow-[0_0_40px_#fef08a]">
//             <div className="absolute top-0 right-5 w-16 h-16 bg-[#1b1947] rounded-full"></div>
//         </div>

//         {/** CHOICE */}
//       <div className="absolute -bottom-[50px] left-1/2 z-30 w-full max-w-[700px] -translate-x-1/2 pointer-events-none">
//           <svg viewBox="0 0 800 700" className="h-auto w-full">
//             <IceSkating x={400} y={553} />
//           </svg>
//         </div>

//         <img src={choice11} alt=""   className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-72 hidden"/>
//         <img src={choice12} alt=""   className="absolute -top-0 left-1/2 -translate-x-1/2 w-[100px] h-20 hidden"/>

//         <img src={choice21} alt=""   className="absolute bottom-[30%] right-[12%] -translate-x-1/2 w-[150px] h-72 z-0 hidden"/>
//         <img src={choice22} alt=""   className="absolute bottom-[30%] right-[6%] -translate-x-1/2 w-[250px] h-72 z-0 hidden"/>

//         <img src={choice41} alt=""   className="absolute bottom-[29%] left-[23%] -translate-x-1/2 w-[200px] h-72 z-0 hidden"/>
//         <img src={choice42} alt=""   className="absolute bottom-[30%] left-[23%] -translate-x-1/2 w-[200px] h-72 z-0 hidden"/>

//         <div className="relative z-0 hidden">
//           <SantaCrossing
//             delay={0}
//             duration={15000}
//             width={180}
//             bottom={100}
//           />
//         </div>
//         <div className="absolute top-10 left-[60%] z-0 hidden">
//           <SantaLottie width={180} />
//         </div>

//         {/* CLUSTER CENTRAL DU VILLAGE */}
//         <div
//     className="absolute w-[1344px] h-[864px]"
//     style={{
//         left: "288px",
//         top: "96px"
//     }}
// >

//         {maisons.map((m) => {
//           const ouvert = joursOuverts[m.id];

//           return (
//             <div
//               key={m.id}
//               className={`absolute ${m.position} ${m.taille} pointer-events-none group`}
//             >
//               {/* Maison : animations de survol conservées */}
//               <img
//                 src={m.src}
//                 alt={`Maison ${m.id}`}
//                 onClick={() => cliquerMaison(m.id)}
//                 className="
//                   relative z-10
//                   w-full h-full object-contain
//                   pointer-events-auto cursor-pointer
//                   origin-bottom
//                   transition-all duration-300 ease-out
//                   group-hover:scale-110
//                   group-hover:-translate-y-2
//                   group-hover:brightness-110
//                 "
//               />

//               {/* Médaillon du numéro */}
//               <div
//                 className="
//                   absolute z-20
//                   top-[12%] left-1/2 -translate-x-1/2
//                   pointer-events-none
//                   transition-all duration-300 ease-out
//                   opacity-0 scale-50 -translate-y-2
//                   group-hover:opacity-100
//                   group-hover:scale-100
//                   group-hover:-translate-y-1
//                 "
//               >
//                 <div
//                   className={`
//                     relative flex items-center justify-center
//                     w-10 h-10 rounded-full
//                     border-2 border-amber-200/90
//                     shadow-[0_0_15px_rgba(255,215,100,0.65)]
//                     ${ouvert
//                       ? "bg-amber-300 text-indigo-950"
//                       : "bg-[#202047]/95 text-amber-100"
//                     }
//                   `}
//                 >
//                   <div className="absolute inset-1 rounded-full border border-white/30" />

//                   <span className="relative z-10 font-serif font-bold text-lg drop-shadow-sm">
//                     {m.id}
//                   </span>
//                 </div>

//                 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 bg-amber-300/80 rounded-full blur-sm" />
//               </div>

//               {/* Halo si la case est ouverte */}
//               {ouvert && (
//                 <div
//                   className="
//                     absolute z-0
//                     top-[15%] left-1/2 -translate-x-1/2
//                     w-12 h-12 rounded-full
//                     bg-amber-300/20 blur-xl
//                     pointer-events-none
//                   "
//                 />
//               )}
//             </div>
//           );
//         })}
//         {messageInterdit !== null && (
//           <div className="
//             fixed bottom-8 left-1/2 -translate-x-1/2
//             z-[100] w-max max-w-[90vw]
//             rounded-xl border border-amber-200/50
//             bg-[#202047]/95 px-5 py-3
//             text-center text-amber-100 shadow-xl
//             animate-pulse
//           ">
//             <p className="font-serif text-lg">
//               🔒 Encore un peu de patience...
//             </p>
//             <p className="mt-1 text-sm">
//               Ta surprise du {messageInterdit} décembre
//               n'est pas encore disponible 🎁
//             </p>
//             <button
//               onClick={() => setMessageInterdit(null)}
//               className="mt-2 text-xs text-amber-300 underline pointer-events-auto"
//             >
//               D'accord ❤️
//             </button>
//           </div>
//         )}
//         <SurprisePage
//           jour={composantOuvert}
//           onClose={() => setComposantOuvert(null)}
//         />

//         </div>

//         {/* FINITION OMBRE DE NEIGE SOL */}
//         <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/30 to-transparent z-40 pointer-events-none"></div>
//         </div>
//         </div>
//     );
// }