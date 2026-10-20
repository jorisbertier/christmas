import React, { useState } from 'react';

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
        { id: 15, src: maison15, taille: 'w-[170px] h-[170px]', position: 'top-[248px] right-[525px] z-10' },
        { id: 9, src: maison9, taille: 'w-[140px] h-[140px]', position: 'top-[95px] right-[740px] z-0' },
        { id: 12, src: maison12, taille: 'w-[110px] h-[110px]', position: 'top-[272px] right-[630px] z-10' },
        { id: 13, src: maison13, taille: 'w-[140px] h-[140px]', position: 'top-[260px] right-[410px] z-10' },
        { id: 10, src: maison10, taille: 'w-[170px] h-[170px]', position: 'top-[200px] right-[310px] z-10' },
        { id: 1, src: maison1, taille: 'w-[110px] h-[110px]', position: 'top-[288px] left-1/2 -translate-x-1/2 z-10'},
        { id: 23, src: maison23, taille: 'w-[140px] h-[140px]', position: 'top-[174px] right-[440px] z-0' },
        { id: 3, src: maison3, taille: 'w-[140px] h-[140px]', position: 'top-[150px] right-[680px] z-0' },
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

        {/* CLUSTER CENTRAL DU VILLAGE */}
        <div className="relative flex-1 w-full max-w-[1100px] mx-auto min-h-[580px] mt-24 mb-12">
            {maisons.map((m) => {
            const ouvert = joursOuverts[m.id];
            return (
                /* 1. La div conteneur gère la taille/position mais ignore les clics fantômes grâce à pointer-events-none */
                <div
                key={m.id}
                className={`absolute ${m.position} ${m.taille} pointer-events-none`}
                >
                {/* 2. L'image réactive les pointer-events, porte l'interaction et les animations exactes */}
                <img 
                    src={m.src} 
                    alt={`Maison ${m.id}`} 
                    onClick={() => toggleJour(m.id)}
                    className="w-full h-full object-contain pointer-events-auto cursor-pointer
                    transition-all duration-300 ease-out origin-bottom
                    hover:scale-110 hover:-translate-y-3 hover:brightness-110"
                />

                {/* CALQUE DU NUMÉRO SUPERPOSÉ (Ignore aussi les clics pour laisser l'image en dessous les capter) */}
                <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[35%] h-[28%] flex items-center justify-center rounded-t-full pointer-events-none">
                    {/* <span className={`font-bold text-sm md:text-base drop-shadow-md transition-colors duration-300 ${ouvert ? 'text-yellow-400 font-extrabold scale-125 animate-pulse' : 'text-slate-800'}`}>
                    {m.id}
                    </span> */}
                    {ouvert && (
                    <div className="absolute inset-0 bg-yellow-400/30 rounded-t-full blur-md animate-pulse" />
                    )}
                </div>
                </div>
            );
            })}
        </div>

        {/* FINITION OMBRE DE NEIGE SOL */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/30 to-transparent z-40 pointer-events-none"></div>
        </div>
    );
}