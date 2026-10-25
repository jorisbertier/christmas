
import React, { useState } from "react";

const questions = [
  {
    question: "¿Cuál es mi color favorito?",
    emoji: "🎨",
    mine: "Azul",
  },
  {
    question: "¿Cuál es mi comida favorita?",
    emoji: "🍝",
    mine: "La pasta",
  },
  {
    question: "¿Cuál es mi mayor sueño?",
    emoji: "✨",
    mine: "Formar una familia contigo",
  },
  {
    question: "¿Qué es lo que más me gusta de ti?",
    emoji: "❤️",
    mine: "Tu personalidad",
  },
  {
    question: "¿Cuál sería mi cita perfecta contigo?",
    emoji: "🌙",
    mine: "Viajar juntos",
  },
  {
    question: "¿Qué regalo me haría más ilusión?",
    emoji: "🎁",
    mine: "Una carta de amor",
  },
];

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 1 &&
        !["el", "la", "los", "las", "un", "una", "de", "del",
          "mi", "mis", "tu", "tus", "me", "es", "y", "en",
          "the", "a", "an", "my", "is", "and", "to"].includes(word)
    );
}

function similarity(a, b) {
  const wordsA = new Set(normalize(a));
  const wordsB = new Set(normalize(b));

  if (!wordsA.size || !wordsB.size) return 0;

  const intersection = [...wordsA].filter((word) =>
    wordsB.has(word)
  ).length;

  // Similarité de Jaccard : mots communs / mots distincts
  return intersection / new Set([...wordsA, ...wordsB]).size;
}

function calculateScore(userAnswers) {
  const scores = questions.map((question, i) =>
    similarity(question.mine, userAnswers[i] || "")
  );

  const percentage = Math.round(
    (scores.reduce((sum, value) => sum + value, 0) /
      questions.length) *
      100
  );

  return { scores, percentage };
}

export default function CoupleQuiz({ onFinish }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("guess");
  const [guessAnswers, setGuessAnswers] = useState(
    questions.map(() => "")
  );
  const [ownAnswers, setOwnAnswers] = useState(
    questions.map(() => "")
  );
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const answers = phase === "guess" ? guessAnswers : ownAnswers;
  const setAnswers =
    phase === "guess" ? setGuessAnswers : setOwnAnswers;

  const canContinue = answers[index].trim().length > 0;

  const handleNext = () => {
    if (!canContinue) return;

    if (phase === "guess") {
      if (index < questions.length - 1) {
        setIndex(index + 1);
      } else {
        setPhase("own");
        setIndex(0);
      }
      return;
    }

    if (index < questions.length - 1) {
      setIndex(index + 1);
      return;
    }

    setFinished(true);

    const guessResult = calculateScore(guessAnswers);
    const ownResult = calculateScore(ownAnswers);

    onFinish?.({
      guessPercentage: guessResult.percentage,
      ownPercentage: ownResult.percentage,
      guessAnswers,
      ownAnswers,
      guessResult,
      ownResult,
    });
  };

  const restart = () => {
    setIndex(0);
    setPhase("guess");
    setGuessAnswers(questions.map(() => ""));
    setOwnAnswers(questions.map(() => ""));
    setFinished(false);
  };

  const guessResult = calculateScore(guessAnswers);
  const ownResult = calculateScore(ownAnswers);

  const progress = finished
    ? 100
    : phase === "guess"
      ? ((index + 1) / (questions.length * 2)) * 100
      : ((questions.length + index + 1) /
          (questions.length * 2)) *
        100;

  return (
    <main className="relative isolate flex w-full max-w-full items-center justify-center overflow-hidden bg-[#0b2118] px-4 py-8 text-white sm:px-8">

      {/* Fond et lumières */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#28553a_0%,#102c20_48%,#07130e_100%)]" />

      <div className="pointer-events-none absolute -left-20 top-20 text-8xl opacity-20">
        🎄
      </div>
      <div className="pointer-events-none absolute -right-16 bottom-12 text-8xl opacity-20">
        🎄
      </div>

      {Array.from({ length: 45 }, (_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute animate-pulse text-white/60"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 23) % 100}%`,
            animationDelay: `${(i % 8) * 0.3}s`,
            fontSize: `${6 + (i % 8)}px`,
          }}
        >
          ❄
        </span>
      ))}

      <div className="relative z-10 w-full max-w-2xl">

        {/* En-tête */}
        <header className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300">
            ✦ Navidad de nuestro amor ✦
          </p>
          <h1 className="mt-3 font-serif text-3xl text-amber-50 sm:text-5xl">
            ¿Cuánto nos conocemos?
          </h1>
          <p className="mt-3 text-sm text-white/70">
            Seis preguntas, dos corazones y muchas respuestas.
          </p>
        </header>

        {/* Guirlande décorative */}
        <div className="mb-5 flex justify-center gap-3 text-lg">
          {["🔴", "✨", "🟡", "✨", "🔴", "✨", "🟢"].map(
            (item, i) => (
              <span
                key={i}
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {item}
              </span>
            )
          )}
        </div>

        <section className="overflow-hidden rounded-3xl border border-amber-200/30 bg-[#14281f]/95 shadow-[0_20px_80px_#0008] backdrop-blur-md">

          {!finished ? (
            <div className="p-5 sm:p-8">

              {/* Étapes */}
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-amber-300">
                    {phase === "guess"
                      ? "Primera ronda"
                      : "Segunda ronda"}
                  </p>
                  <p className="mt-1 font-serif text-lg">
                    {phase === "guess"
                      ? "Adivina mi respuesta 💌"
                      : "Ahora responde por ti 💚"}
                  </p>
                </div>
                <div className="shrink-0 rounded-full border border-amber-300/30 px-3 py-2 text-sm text-amber-100">
                  {index + 1}/{questions.length}
                </div>
              </div>

              <div className="mb-7 h-2 overflow-hidden rounded-full bg-black/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-300 to-green-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Question */}
              <div
                key={`${phase}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-7"
              >
                <div className="mb-4 text-center text-5xl">
                  {current.emoji}
                </div>

                <h2 className="text-center font-serif text-xl leading-relaxed text-amber-50 sm:text-2xl">
                  {phase === "guess"
                    ? current.question.replace("mi ", "mi ")
                    : current.question.replace("mi ", "mi ")}
                </h2>

                <p className="mt-3 text-center text-sm leading-relaxed text-white/60">
                  {phase === "guess"
                    ? "Escribe lo que crees que yo respondería."
                    : "Escribe tu propia respuesta a esta pregunta."}
                </p>

                <label
                  htmlFor="answer"
                  className="mb-2 mt-7 block text-sm font-medium text-amber-100"
                >
                  {phase === "guess"
                    ? "Mi predicción"
                    : "Mi respuesta personal"}
                </label>

                <textarea
                  id="answer"
                  value={answers[index]}
                  onChange={(e) =>
                    setAnswers((previous) =>
                      previous.map((answer, i) =>
                        i === index ? e.target.value : answer
                      )
                    )
                  }
                  placeholder={
                    phase === "guess"
                      ? "Creo que su color favorito es..."
                      : "Mi respuesta es..."
                  }
                  rows={3}
                  maxLength={300}
                  className="w-full max-w-full resize-y rounded-xl border border-amber-100/20 bg-black/25 p-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                />

                <p className="mt-2 text-right text-xs text-white/40">
                  {answers[index].length}/300
                </p>
              </div>

              <button
                onClick={handleNext}
                disabled={!canContinue}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-5 py-4 font-semibold text-white shadow-lg shadow-red-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {phase === "guess" && index === questions.length - 1
                  ? "Pasar a mis respuestas →"
                  : phase === "own" && index === questions.length - 1
                    ? "Descubrir nuestros resultados 🎁"
                    : "Siguiente pregunta →"}
              </button>

              <p className="mt-4 text-center text-xs text-white/40">
                🎄 No hay respuestas perfectas, solo ganas de conocernos.
              </p>
            </div>
          ) : (
            <div className="p-5 sm:p-8">
              <div className="text-center">
                <div className="text-6xl">🎁</div>
                <p className="mt-4 text-xs uppercase tracking-[0.35em] text-amber-300">
                  Nuestro resultado
                </p>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                  ¡La magia está en conocernos!
                </h2>
                <p className="mt-3 text-sm text-white/60">
                  Comparamos tus predicciones y tus propias respuestas con
                  las respuestas que yo había dado antes.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-red-300/20 bg-red-950/30 p-5 text-center">
                  <div className="text-3xl">🔮</div>
                  <p className="mt-2 text-sm text-red-200">
                    ¿Cuánto me conoces?
                  </p>
                  <p className="mt-3 text-4xl font-bold text-amber-100">
                    {guessResult.percentage}%
                  </p>
                  <p className="mt-2 text-xs text-white/50">
                    Similitud de tus predicciones
                  </p>
                </div>

                <div className="rounded-2xl border border-green-300/20 bg-green-950/30 p-5 text-center">
                  <div className="text-3xl">💚</div>
                  <p className="mt-2 text-sm text-green-200">
                    ¿Cuánto nos parecemos?
                  </p>
                  <p className="mt-3 text-4xl font-bold text-amber-100">
                    {ownResult.percentage}%
                  </p>
                  <p className="mt-2 text-xs text-white/50">
                    Similitud entre nuestras respuestas
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-amber-200/20 bg-black/20 p-5">
                <h3 className="mb-4 font-serif text-xl text-amber-100">
                  🎄 Nuestras respuestas
                </h3>

                <div className="space-y-5">
                  {questions.map((question, i) => (
                    <div
                      key={question.question}
                      className="border-b border-white/10 pb-4 last:border-0 last:pb-0"
                    >
                      <p className="font-medium text-white">
                        {question.emoji} {question.question}
                      </p>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg bg-red-950/30 p-3">
                          <p className="text-xs text-red-200">
                            Tu predicción
                          </p>
                          <p className="mt-1 break-words text-sm">
                            {guessAnswers[i]}
                          </p>
                          <p className="mt-2 text-xs text-white/40">
                            Mi respuesta: {question.mine}
                          </p>
                        </div>

                        <div className="rounded-lg bg-green-950/30 p-3">
                          <p className="text-xs text-green-200">
                            Tu propia respuesta
                          </p>
                          <p className="mt-1 break-words text-sm">
                            {ownAnswers[i]}
                          </p>
                          <p className="mt-2 text-xs text-white/40">
                            Mi respuesta: {question.mine}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-6 text-center font-serif text-lg text-amber-100">
                Lo más bonito no es pensar igual, sino seguir descubriéndonos. ❤️
              </p>

              <button
                onClick={restart}
                className="mt-6 w-full rounded-xl border border-amber-200/30 bg-white/5 px-5 py-4 font-semibold transition hover:bg-white/10"
              >
                ↻ Volver a jugar
              </button>
            </div>
          )}
        </section>

        <footer className="mt-6 text-center text-xs tracking-widest text-amber-100/50">
          ❄ HECHO CON AMOR · NAVIDAD ❄
        </footer>
      </div>
    </main>
  );
}
