import React, { useState } from "react";

const compliments = [
  "Eres más brillante que el trasero de un reno con purpurina.",
  "Si fueras un copo de nieve, serías el único que sabe bailar salsa.",
  "Papá Noel te tiene envidia porque tú repartes más alegría que él.",
  "Eres tan increíble que hasta los elfos hacen cola para conocerte.",
  "Tu sonrisa podría derretir un iceberg en pleno invierno.",
  "Si fueras un árbol de Navidad, serías el que tiene todas las luces del universo.",
  "Eres más dulce que un chocolate caliente con veinte cucharadas de azúcar.",
  "Los renos se ponen gafas de sol cuando te ven porque brillas demasiado.",
  "Si la belleza fuera un deporte, ya tendrías tu propio estadio en el Polo Norte.",
  "Hasta el Grinch sonreiría si te viera entrar en una habitación.",
  "Eres la razón por la que las estrellas quieren decorar el cielo.",
  "Tienes más magia que un calcetín navideño lleno de patatas fritas."
];

export default function ChristmasComplimentMachine() {
  const [compliment, setCompliment] = useState(
    "¡Introduce una moneda de amor y pulsa el botón!"
  );
  const [spinning, setSpinning] = useState(false);
  const [count, setCount] = useState(0);

  const generateCompliment = () => {
    if (spinning) return;

    setSpinning(true);
    setCount((prev) => prev + 1);

    const randomIndex = Math.floor(Math.random() * compliments.length);

    setTimeout(() => {
      setCompliment(compliments[randomIndex]);
      setSpinning(false);
    }, 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#102b25] p-5 font-['Mountains_of_Christmas']">
      <div className="relative w-full max-w-[390px] rounded-[35px] border-[8px] border-[#8b2e24] bg-gradient-to-b from-[#f9e8bd] to-[#e8c98f] p-5 shadow-[0_15px_0_#5b211c,0_25px_35px_#0008]">

        {/* Decoración */}
        <div className="absolute -top-3 left-8 h-5 w-5 rounded-full bg-red-500 shadow-md" />
        <div className="absolute -top-3 right-8 h-5 w-5 rounded-full bg-green-500 shadow-md" />

        <div className="text-center">
          <p className="text-sm tracking-[4px] text-[#8b2e24]">
            TALLER DE PAPÁ NOEL
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#8b2e24]">
            Máquina de
          </h1>
          <h2 className="text-4xl font-bold text-[#b52f2f]">
            Cumplidos
          </h2>
          <p className="mt-1 text-sm text-[#76502e]">
            ¡Cumplidos mágicos y totalmente absurdos!
          </p>
        </div>

        {/* Máquina */}
        <div className="mt-6 rounded-2xl border-4 border-[#70412d] bg-[#263c36] p-4 shadow-inner">

          {/* Pantalla */}
          <div className="flex min-h-[145px] items-center justify-center rounded-xl border-4 border-[#a5a17b] bg-[#dce6bd] p-4 text-center shadow-inner">
            {spinning ? (
              <div className="animate-spin text-5xl">🎅</div>
            ) : (
              <p className="text-xl font-bold leading-relaxed text-[#31513b]">
                {compliment}
              </p>
            )}
          </div>

          {/* Indicadores */}
          <div className="mt-4 flex justify-center gap-3">
            <span className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_10px_#f00]" />
            <span className="h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_10px_#ff0]" />
            <span className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_#0f0]" />
          </div>

          {/* Botón */}
          <button
            onClick={generateCompliment}
            disabled={spinning}
            className="mx-auto mt-5 block rounded-full border-b-[8px] border-[#771b1b] bg-gradient-to-b from-[#ff6262] to-[#c62828] px-8 py-4 text-xl font-bold text-white shadow-lg transition active:translate-y-1 active:border-b-4 disabled:opacity-70"
          >
            {spinning ? "¡GIRANDO...!" : "🎁 ¡PULSAR!"}
          </button>
        </div>

        <div className="mt-5 text-center text-[#8b2e24]">
          <p className="text-lg font-bold">
            Cumplidos entregados: {count}
          </p>
          <p className="mt-1 text-sm">
            Fabricado con magia, nieve y mucho amor ❤️
          </p>
        </div>
      </div>
    </div>
  );
}