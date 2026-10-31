
import React, { useState } from "react";

const rounds = [
  {
    title: "Un reno navideño",
    emoji: "🦌",
    description: "Dibujad el reno más bonito de Navidad.",
    challenge: "¡Tiene que tener una nariz roja!",
  },
  {
    title: "¡Dibújanos el uno al otro!",
    emoji: "👩‍❤️‍👨",
    description: "Margo tiene que dibujar a Joris y Joris tiene que dibujar a Margo.",
    challenge: "¡Intentad captar todos los detalles del otro!",
  },
  {
    title: "Un muñeco de nieve",
    emoji: "⛄",
    description: "Dibujad el muñeco de nieve más original.",
    challenge: "¡Tiene que llevar un accesorio muy extraño!",
  },
{
  title: "Un pingüino",
  emoji: "🐧",
  description: "Dibujad un pingüino.",
  challenge: "¡Que tenga un accesorio original!",
},
{
  title: "Papá Noel",
  emoji: "🎅",
  description: "Dibujad a Papá Noel.",
  challenge: "¡Que tenga una expresión muy divertida!",
},
];

export default function ChristmasDrawingGame() {
  const [phase, setPhase] = useState("intro");
  const [round, setRound] = useState(0);
  const [mariaScore, setMariaScore] = useState("");
  const [myScore, setMyScore] = useState("");
  const [scores, setScores] = useState([]);

  const current = rounds[round];
  const isLast = round === rounds.length - 1;

  const totalMaria = scores.reduce((sum, s) => sum + Number(s.maria), 0);
  const totalMe = scores.reduce((sum, s) => sum + Number(s.me), 0);

  const saveScores = () => {
    const updated = [
      ...scores,
      { maria: mariaScore, me: myScore },
    ];

    setScores(updated);
    setMariaScore("");
    setMyScore("");

    if (isLast) {
      setPhase("finished");
    } else {
      setRound((r) => r + 1);
      setPhase("draw");
    }
  };

  const restart = () => {
    setRound(0);
    setScores([]);
    setMariaScore("");
    setMyScore("");
    setPhase("intro");
  };

  const validScore = (value) =>
    value !== "" &&
    Number.isFinite(Number(value)) &&
    Number(value) >= 0 &&
    Number(value) <= 10;

  const winner =
    totalMe > totalMaria
      ? "Joris"
      : totalMaria > totalMe
      ? "Margo"
      : null;

  const scoreInput = (value, setter, color) => (
    <input
      type="number"
      min="0"
      max="10"
      step="1"
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "" || (/^\d{1,2}$/.test(v) && Number(v) <= 10)) {
          setter(v);
        }
      }}
      placeholder="?"
      className={`w-full min-w-0 bg-white/10 border ${color} rounded-lg p-2 text-center text-xl text-white outline-none focus:border-amber-300`}
    />
  );

  return (
    <div className="relative h-screen w-screen max-w-screen overflow-hidden bg-[#07140f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#244b37_0%,#102a20_42%,#07140f_100%)]" />
      <div className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* Luces navideñas */}
      <div className="absolute top-0 left-0 w-full flex justify-around pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="h-5 w-px bg-amber-100/30" />
            <div className={`w-2 h-2 rounded-full ${
              i % 3 === 0
                ? "bg-red-400 shadow-[0_0_12px_#f87171]"
                : i % 3 === 1
                ? "bg-amber-300 shadow-[0_0_12px_#fcd34d]"
                : "bg-emerald-300 shadow-[0_0_12px_#6ee7b7]"
            }`} />
          </div>
        ))}
      </div>

      <main className="relative z-10 h-full w-full max-w-screen-xl mx-auto flex flex-col items-center justify-center px-4 py-5 sm:px-8">

        {/* Cabecera */}
        <header className="text-center shrink-0 mb-3">
          <div className="text-2xl mb-1">🎨</div>
          <p className="text-amber-300/70 text-[9px] tracking-[0.4em] uppercase">
            Christmas Special · Actividad para dos
          </p>
          <h1 className="text-2xl sm:text-4xl font-serif text-amber-100 mt-1">
            El duelo de artistas
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-px w-10 bg-amber-400/40" />
            <span className="text-amber-300">✦</span>
            <div className="h-px w-10 bg-amber-400/40" />
          </div>
        </header>

        {/* Progreso */}
        {phase !== "intro" && phase !== "finished" && (
          <div className="flex gap-2 mb-3 shrink-0">
            {rounds.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i <= round ? "w-8 bg-amber-300" : "w-5 bg-white/15"
                }`}
              />
            ))}
          </div>
        )}

        {/* Tarjeta */}
        <section className="w-full max-w-2xl min-h-0 rounded-3xl border border-amber-300/20 bg-[#10291f]/90 p-4 sm:p-7 shadow-2xl">

          {/* INTRO */}
          {phase === "intro" && (
            <div className="text-center">
              <div className="text-4xl mb-2">🖍️</div>
              <h2 className="text-2xl font-serif text-amber-100">
                ¡Que empiece la diversión!
              </h2>
              <p className="text-white/55 text-xs mt-1">
                Dos artistas, cinco desafíos y muchas risas.
              </p>

              <div className="grid gap-2.5 text-left mt-5">
                {[
                  ["01", "Descubrid el tema", "Tendréis que dibujar lo mismo en cada ronda."],
                  ["02", "Preparad vuestro material", "Cada uno tendrá su propia hoja y sus lápices."],
                  ["03", "¡Que nadie mire!", "Dibujad juntos, pero sin mirar el dibujo del otro."],
                  ["04", "Tres minutos", "Tenéis 3 minutos para completar vuestra obra."],
                  ["05", "La gran revelación", "Enseñaos los dibujos cara a cara al mismo tiempo."],
                  ["06", "Poned una nota", "Cada uno puntuará el dibujo del otro sobre 10."],
                ].map(([n, title, desc]) => (
                  <div key={n} className="flex gap-3 items-start">
                    <span className="text-amber-400 font-serif text-sm">{n}</span>
                    <div>
                      <h3 className="text-amber-100 text-xs font-semibold">{title}</h3>
                      <p className="text-white/45 text-[10px] mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-amber-300/10 border border-amber-300/20">
                <p className="text-amber-200 text-xs font-semibold">
                  ⭐ ¡El objetivo!
                </p>
                <p className="text-white/55 text-[10px] mt-1">
                  Conseguir la mejor puntuación de las cinco rondas.
                  ¡Pero lo importante es divertirse!
                </p>
              </div>

              <button
                onClick={() => setPhase("draw")}
                className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-500 text-[#17251b] font-bold"
              >
                ¡Empezar el juego! ✨
              </button>
            </div>
          )}

          {/* DIBUJO */}
          {phase === "draw" && (
            <div className="text-center">
              <p className="text-amber-300/70 text-[10px] tracking-[0.3em] uppercase">
                Ronda {round + 1} / 5
              </p>

              <div className="text-5xl my-3">{current.emoji}</div>

              <p className="text-emerald-200/60 text-[10px] uppercase tracking-widest">
                Vuestro desafío
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif text-amber-100 mt-2">
                {current.title}
              </h2>
              <p className="text-white/60 text-xs sm:text-sm mt-2">
                {current.description}
              </p>

              {/* <div className="mt-4 p-3 rounded-xl bg-amber-300/10 border border-amber-300/20">
                <p className="text-amber-200 text-xs">
                  ⭐ {current.challenge}
                </p>
              </div> */}

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="rounded-xl bg-pink-300/5 border border-pink-300/20 p-3">
                  <span className="text-2xl">👩‍🎨</span>
                  <p className="text-pink-200 text-xs mt-1">Margo</p>
                  <p className="text-white/35 text-[10px]">¡A dibujar!</p>
                </div>
                <div className="rounded-xl bg-sky-300/5 border border-sky-300/20 p-3">
                  <span className="text-2xl">👨‍🎨</span>
                  <p className="text-sky-200 text-xs mt-1">Joris</p>
                  <p className="text-white/35 text-[10px]">¡A dibujar!</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-amber-200 font-semibold text-sm">
                  ⏱️ ¡Tenéis 3 minutos!
                </p>
                <p className="text-white/40 text-[10px] mt-1">
                  Preparad vuestras hojas y no miréis al otro.
                </p>
              </div>

              <button
                onClick={() => setPhase("reveal")}
                className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-500 text-[#17251b] font-bold"
              >
                ¡Hemos terminado! 🎉
              </button>
            </div>
          )}

          {/* REVELACIÓN Y NOTAS */}
          {phase === "reveal" && (
            <div className="text-center">
              <div className="text-4xl mb-2">🎁</div>
              <p className="text-amber-300/70 text-[10px] tracking-[0.3em] uppercase">
                Ronda {round + 1} · La gran revelación
              </p>
              <h2 className="text-2xl font-serif text-amber-100 mt-2">
                ¡Enseñad vuestras obras!
              </h2>
              <p className="text-white/55 text-xs mt-2">
                Ahora sí, cara a cara. ¡Mostrad vuestros dibujos al mismo tiempo!
              </p>

              <div className="my-4 rounded-2xl bg-amber-300/10 border border-amber-300/20 p-3">
                <p className="text-2xl">🖼️ ❤️ 🖼️</p>
                <p className="text-amber-100 text-xs font-semibold mt-1">
                  ¡El momento de comparar!
                </p>
                <p className="text-white/45 text-[10px] mt-1">
                  Reíd, explicad vuestras ideas y admirad vuestras obras.
                </p>
              </div>

              <p className="text-amber-200 text-xs font-semibold mb-3">
                🏆 ¡Hora de poner las notas!
              </p>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-sky-300/5 border border-sky-300/20 p-3">
                  <p className="text-sky-200 text-xs font-semibold">Dibujo de Joris</p>
                  <p className="text-white/40 text-[10px] mt-1">Nota de Margo</p>
                  <div className="flex items-center gap-2 mt-2">
                    {scoreInput(myScore, setMyScore, "border-sky-200/20")}
                    <span className="text-sky-200 text-sm">/10</span>
                  </div>
                </div>

                <div className="rounded-xl bg-pink-300/5 border border-pink-300/20 p-3">
                  <p className="text-pink-200 text-xs font-semibold">Dibujo de Margo</p>
                  <p className="text-white/40 text-[10px] mt-1">Nota de Joris</p>
                  <div className="flex items-center gap-2 mt-2">
                    {scoreInput(mariaScore, setMariaScore, "border-pink-200/20")}
                    <span className="text-pink-200 text-sm">/10</span>
                  </div>
                </div>
              </div>

              <p className="text-white/35 text-[10px] mt-3">
                ¡Sed sinceros, pero no demasiado crueles! 😂
              </p>

              <button
                disabled={!validScore(myScore) || !validScore(mariaScore)}
                onClick={saveScores}
                className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-500 text-[#17251b] font-bold disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isLast ? "Ver el resultado final ❤️" : "Siguiente ronda →"}
              </button>
            </div>
          )}

          {/* RESULTADO FINAL */}
          {phase === "finished" && (
            <div className="text-center">
              <div className="text-5xl mb-2">
                {winner ? "🏆" : "🤝"}
              </div>
              <p className="text-amber-300/70 text-[10px] tracking-[0.3em] uppercase">
                Christmas Art Awards 2026
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif text-amber-100 mt-2">
                {winner ? `¡${winner} ha ganado!` : "¡Tenemos un empate!"}
              </h2>

              <p className="text-white/50 text-xs mt-2">
                {winner
                  ? `¡${winner} se lleva la victoria del duelo artístico!`
                  : "¡Los dos sois auténticos artistas!"}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="rounded-2xl bg-sky-300/5 border border-sky-300/20 p-4">
                  <span className="text-2xl">👨‍🎨</span>
                  <p className="text-sky-200 text-xs mt-2">Joris</p>
                  <p className="text-3xl font-serif text-white mt-1">
                    {totalMe}<span className="text-sm text-white/40">/50</span>
                  </p>
                </div>
                <div className="rounded-2xl bg-pink-300/5 border border-pink-300/20 p-4">
                  <span className="text-2xl">👩‍🎨</span>
                  <p className="text-pink-200 text-xs mt-2">Margo</p>
                  <p className="text-3xl font-serif text-white mt-1">
                    {totalMaria}<span className="text-sm text-white/40">/50</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-white/5">
                <p className="text-amber-200 text-xs font-semibold">
                  Resultados de las 5 rondas
                </p>
                <div className="grid grid-cols-5 gap-1 mt-3">
                  {scores.map((s, i) => (
                    <div key={i} className="text-center">
                      <p className="text-lg">{rounds[i].emoji}</p>
                      <p className="text-sky-200 text-[10px]">{s.me}</p>
                      <p className="text-pink-200 text-[10px]">{s.maria}</p>
                    </div>
                  ))}
                </div>
                <p className="text-white/30 text-[9px] mt-2">
                  Azul: Joris · Rosa: Margo
                </p>
              </div>

              <p className="text-amber-100 text-xs mt-4">
                ¡El verdadero premio es haber creado estos recuerdos juntos! ❤️
              </p>

              <button
                onClick={restart}
                className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-500 text-[#17251b] font-bold"
              >
                ¡Volver a jugar! ❤️
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
