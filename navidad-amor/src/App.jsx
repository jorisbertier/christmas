import React, { useState, useEffect } from 'react';
import Houses from './component/Houses';
import background from './assets/BG/BG.png';

export default function CalendrierAvent() {
  const [joursOuverts, setJoursOuverts] = useState({});

  const toggleJour = (jour) => {
    setJoursOuverts(prev => ({ ...prev, [jour]: !prev[jour] }));
  };
  

  // Liste des 24 maisons stylisées avec leurs couleurs et dispositions spécifiques
  const maisons = [
    { id: 1, couleur: 'bg-rose-400', texteCouleur: 'text-rose-900', taille: 'h-36 w-24', position: 'top-20 left-10 z-10' },
    { id: 2, couleur: 'bg-blue-500', texteCouleur: 'text-blue-900', taille: 'h-40 w-28', position: 'top-14 left-28 z-20' },
    { id: 3, couleur: 'bg-indigo-600', texteCouleur: 'text-indigo-900', taille: 'h-44 w-28', position: 'top-8 left-52 z-10' },
    { id: 4, couleur: 'bg-amber-400', texteCouleur: 'text-amber-900', taille: 'h-36 w-24', position: 'top-24 left-72 z-30' },
    { id: 5, couleur: 'bg-purple-500', texteCouleur: 'text-purple-900', taille: 'h-48 w-26', position: 'top-4 left-96 z-10' },
    { id: 6, couleur: 'bg-slate-400', texteCouleur: 'text-slate-900', taille: 'h-40 w-24', position: 'top-16 right-72 z-20' },
    { id: 7, couleur: 'bg-rose-500', texteCouleur: 'text-rose-950', taille: 'h-36 w-24', position: 'top-24 right-48 z-30' },
    { id: 8, couleur: 'bg-blue-400', texteCouleur: 'text-blue-900', taille: 'h-44 w-28', position: 'top-10 right-20 z-10' },
    { id: 9, couleur: 'bg-amber-500', texteCouleur: 'text-amber-950', taille: 'h-32 w-24', position: 'top-32 left-4 z-40' },
    { id: 10, couleur: 'bg-indigo-500', texteCouleur: 'text-indigo-950', taille: 'h-36 w-26', position: 'top-28 left-24 z-50' },
    { id: 11, couleur: 'bg-rose-300', texteCouleur: 'text-rose-800', taille: 'h-40 w-26', position: 'top-20 left-44 z-40' },
    { id: 12, couleur: 'bg-purple-600', texteCouleur: 'text-purple-950', taille: 'h-44 w-24', position: 'top-16 left-68 z-30' },
    { id: 13, couleur: 'bg-blue-600', texteCouleur: 'text-blue-950', taille: 'h-40 w-28', position: 'top-20 right-64 z-40' },
    { id: 14, couleur: 'bg-amber-300', texteCouleur: 'text-amber-800', taille: 'h-36 w-24', position: 'top-28 right-40 z-50' },
    { id: 15, couleur: 'bg-purple-400', texteCouleur: 'text-purple-900', taille: 'h-40 w-26', position: 'top-24 right-16 z-40' },
    { id: 16, couleur: 'bg-indigo-400', texteCouleur: 'text-indigo-900', taille: 'h-32 w-24', position: 'bottom-16 left-8 z-50' },
    { id: 17, couleur: 'bg-rose-400', texteCouleur: 'text-rose-900', taille: 'h-36 w-26', position: 'bottom-12 left-28 z-60' },
    { id: 18, couleur: 'bg-amber-400', texteCouleur: 'text-amber-900', taille: 'h-32 w-24', position: 'bottom-14 left-52 z-50' },
    { id: 19, couleur: 'bg-blue-500', texteCouleur: 'text-blue-900', taille: 'h-40 w-26', position: 'bottom-8 left-76 z-40' },
    { id: 20, couleur: 'bg-purple-500', texteCouleur: 'text-purple-900', taille: 'h-44 w-28', position: 'bottom-6 right-72 z-50' },
    { id: 21, couleur: 'bg-rose-500', texteCouleur: 'text-rose-950', taille: 'h-36 w-24', position: 'bottom-12 right-48 z-60' },
    { id: 22, couleur: 'bg-amber-500', texteCouleur: 'text-amber-950', taille: 'h-32 w-26', position: 'bottom-14 right-24 z-50' },
    { id: 23, couleur: 'bg-indigo-600', texteCouleur: 'text-indigo-950', taille: 'h-36 w-24', position: 'bottom-16 right-6 z-40' },
    { id: 24, couleur: 'bg-slate-500', texteCouleur: 'text-slate-950', taille: 'h-48 w-24', position: 'top-2 right-96 z-0' },
  ];

return (
  <div
    className="relative w-full h-screen overflow-hidden bg-[#1b1947] bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${background})` }}
  >
    <div className="relative w-full flex-1 min-h-0 mx-auto">
      <Houses />
    </div>
  </div>
);
}
