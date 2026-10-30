
import React, { useEffect, useState } from "react";
import { useRive } from "@rive-app/react-canvas";
import GameBoyBG from "../assets/BG/GameBoy.jpg";

export default function ChristmasPaper() {
  const [showIntro, setShowIntro] = useState(true);

  const { rive, RiveComponent } = useRive({
    src: "/christmas.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  useEffect(() => {
    if (!rive) return;

    const inputs = rive.stateMachineInputs("State Machine 1");

    console.log("🎮 INPUTS DU JUEGO:");
    console.table(
      inputs.map((input) => ({
        name: input.name,
        type: input.type,
        value: input.value,
      }))
    );

    const handleStateChange = (event) => {
      console.log("ÉTAT DU JEU :", event.data);
    };

    rive.on("statechange", handleStateChange);
    return () => rive.off("statechange", handleStateChange);
  }, [rive]);

  const choices = [
    {
      emoji: "🪨",
      name: "PIEDRA",
      color: "from-stone-200 to-stone-400",
      description: "Rompe las tijeras",
      shadow: "shadow-[0_5px_0_#77736d]",
    },
    {
      emoji: "📄",
      name: "PAPEL",
      color: "from-amber-50 to-amber-200",
      description: "Envuelve la piedra",
      shadow: "shadow-[0_5px_0_#b99a66]",
    },
    {
      emoji: "✂️",
      name: "TIJERAS",
      color: "from-red-100 to-red-300",
      description: "Cortan el papel",
      shadow: "shadow-[0_5px_0_#a95b55]",
    },
  ];

  return (
    <main
      style={{
        backgroundImage: `url(${GameBoyBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center px-2 py-3 sm:p-5"
    >
      {/* Décor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full flex justify-around text-2xl sm:text-3xl opacity-80">
          {Array.from({ length: 13 }).map((_, i) => (
            <span key={i} className="drop-shadow-[0_0_8px_#e8b75c]">
              {i % 2 === 0 ? "●" : "✦"}
            </span>
          ))}
        </div>
      </div>

      {/* Game Boy */}
      <div className="relative mx-auto w-[50%] -top-[16%] h-[50%] rounded-[20px] sm:rounded-[27px] p-2 sm:p-3">
        <RiveComponent className="absolute inset-0 w-full h-full" />
      </div>

      {/* INTRO POPUP */}
   
{/* INTRO POPUP */}
{showIntro && (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#07150f]/65 backdrop-blur-sm p-3">

    <div className="relative w-full max-w-[440px] rounded-2xl bg-[#17372d] border border-[#c9a66b] shadow-2xl overflow-hidden animate-[popupIn_.4s_ease-out]">

      {/* Bande supérieure */}
      <div className="h-1.5 bg-gradient-to-r from-[#a83232] via-[#e3c17d] to-[#a83232]" />

      <div className="px-5 py-5 sm:px-7 sm:py-6">

        {/* Titre */}
        <div className="text-center">

          <p className="text-[9px] tracking-[0.35em] text-[#d8bd82] font-semibold">
            CHRISTMAS GAME
          </p>

          <h2
            className="text-3xl sm:text-4xl text-[#f8e9c9] mt-2"
            style={{ fontFamily: "'Mountains of Christmas', cursive" }}
          >
            ¡Un desafío especial!
          </h2>

          <p className="text-[#d5d9cb] text-xs sm:text-sm mt-3 leading-relaxed">
            Hoy te espera un adversario muy especial...
            <br />
            ¿Estás preparada para enfrentarte a él?
          </p>
        </div>

        {/* Objets */}
        <div className="grid grid-cols-3 gap-3 mt-6">

          {[
            { emoji: "🪨", name: "PIEDRA" },
            { emoji: "📄", name: "PAPEL" },
            { emoji: "✂️", name: "TIJERAS" },
          ].map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center justify-center rounded-xl bg-[#25483a] border border-[#54715a] py-3"
            >
              <span className="text-4xl sm:text-5xl">
                {item.emoji}
              </span>
              <span className="text-[10px] tracking-widest text-[#ead7ad] font-bold mt-2">
                {item.name}
              </span>
            </div>
          ))}

        </div>

        {/* Règles */}
        <div className="mt-5 space-y-2 text-xs sm:text-sm">

          <p className="flex items-center gap-2 text-[#f1e6cf]">
            <span>🪨</span>
            Piedra vence a tijeras
          </p>

          <p className="flex items-center gap-2 text-[#f1e6cf]">
            <span>📄</span>
            Papel vence a piedra
          </p>

          <p className="flex items-center gap-2 text-[#f1e6cf]">
            <span>✂️</span>
            Tijeras vencen a papel
          </p>

          <p className="text-center text-[#d8bd82] text-[10px] pt-2">
            Mismo símbolo = empate
          </p>

        </div>

        {/* Séparateur */}
        <div className="h-px bg-[#55705a] my-5" />

        {/* Bouton */}
        <button
          onClick={() => setShowIntro(false)}
          className="w-full rounded-xl bg-[#a93636] hover:bg-[#c34843] text-[#fff2dc] py-3 font-bold text-xs tracking-[0.2em] shadow-[0_4px_0_#692323] active:translate-y-1 active:shadow-none transition-all"
        >
          ¡EMPEZAR A JUGAR! ▶
        </button>

      </div>

    </div>
  </div>
)}

<style>{`
  @keyframes popupIn {
    from {
      opacity: 0;
      transform: scale(.92) translateY(15px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`}</style>


      <style>{`
        @keyframes popupIn {
          from {
            opacity: 0;
            transform: translateY(25px) scale(.94);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  );
}
