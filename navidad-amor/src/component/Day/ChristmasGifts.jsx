

import React, { useRef, useState } from "react";

import germignon from "../../assets/gifts/germignon.gif";
import birdo from "../../assets/gifts/birdo.gif";
import titi from "../../assets/gifts/titi.gif";
import hada from "../../assets/gifts/hada.gif";
import supernana from "../../assets/gifts/supernana.gif";
import rondoudou from "../../assets/gifts/rondoudou.gif";
import lisa from "../../assets/gifts/lisa.gif"
import germignon2 from "../../assets/gifts/germignon2.gif";
import toadette from "../../assets/gifts/toadette.gif";
import togepi from "../../assets/gifts/togepi.gif";
import monsters from "../../assets/gifts/monsters.gif";
import daisy from "../../assets/gifts/daisy.gif";

const FUN_MUSIC = "/music/fun.mp3";
const LOVE_MUSIC = "/music/romantic.mp3";

// Remplace simplement les chemins par tes propres GIFs.
const stages = [
  {
    type: "fun",
    text: "Puede ser que seas un poquito dramática...",
    gif: germignon,
    caption: "¡Siempre hay una pequeña escena! 😂",
  },
  {
    type: "fun",
    text: "O quizás un poquito testaruda...",
    gif: supernana,
    caption: "Cuando tienes una idea, ¡nadie te hace cambiar de opinión!",
  },
  {
    type: "fun",
    text: "También puedes ser bastante impaciente...",
    gif: titi,
    caption: "¡Todo tiene que ser ahora mismo!",
  },
  {
    type: "fun",
    text: "A veces, nadie puede llevarte la contraria sino...",
    gif: rondoudou,
    caption: "Porque claro… ¡tú siempre tienes razón! 😏",
  },
  {
    type: "fun",
    text: "Y cuando te enfadas… ¡mejor esconderse!",
    gif: hada,
    caption: "¡Sálvese quien pueda! 😂",
  },
  {
    type: "love",
    text: "Pero también tienes la sonrisa más bonita del mundo...",
    gif: germignon2,
    caption: "Una sonrisa que siempre consigue alegrarme el día.",
  },
  {
    type: "love",
    text: "Eres mi pequeña dosis de felicidad...",
    gif: toadette,
    caption: "Contigo, hasta los días normales son especiales.",
  },
  {
    type: "love",
    text: "Tienes un corazón enorme...",
    gif: togepi,
    caption: "Y una forma muy especial de hacerme sentir querido.",
  },
  {
    type: "love",
    text: "Eres la persona que más quiero abrazar...",
    gif: monsters,
    caption: "Ojalá pudiera hacerlo ahora mismo.",
  },
  {
    type: "love",
    text: "Y eres, simplemente, mi persona favorita.",
    gif: daisy,
    caption: "Entre millones de personas, siempre te elegiría a ti. ❤️",
  },
];

export default function ChristmasGifts() {
  const [current, setCurrent] = useState(-1);
  const [finished, setFinished] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [musicStarted, setMusicStarted] = useState(false);

  const audioRef = useRef(null);

  const isLove = current >= 5;
  const stage = stages[current];

  const playMusic = (src) => {
    const audio = audioRef.current;
    if (!audio || !soundOn) return;

    audio.src = src;
    audio.volume = 0.45;
    audio.load();

    audio.play().catch(() => {
      // La lecture peut être bloquée par le navigateur.
    });
  };

  const toggleSound = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (soundOn) {
      audio.pause();
      setSoundOn(false);
    } else {
      setSoundOn(true);

      if (musicStarted) {
        audio.play().catch(() => {});
      }
    }
  };

  const handleNext = () => {
    // Démarrage de l'expérience et de la première musique
    if (current === -1) {
      setCurrent(0);
      setMusicStarted(true);
      playMusic(FUN_MUSIC);
      return;
    }

    // Le grand retournement : passage à la musique romantique
    if (current === 4) {
      setCurrent(5);
      playMusic(LOVE_MUSIC);
      return;
    }

    // Fin de l'expérience
    if (current === 9) {
      setFinished(true);
      return;
    }

    setCurrent((prev) => prev + 1);
  };

  const restart = () => {
    setCurrent(-1);
    setFinished(false);
    setMusicStarted(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <section
      className={`relative flex h-full max-h-full w-full max-w-full min-h-0
      flex-col overflow-hidden rounded-3xl text-white
      transition-colors duration-1000
      ${isLove || finished
        ? "bg-gradient-to-br from-[#35152c] via-[#54213d] to-[#1b1025]"
        : "bg-gradient-to-br from-[#172d28] via-[#15201f] to-[#080f12]"
      }`}
    >
      <audio ref={audioRef} loop preload="none" />

      {/* Décoration de fond */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute -top-24 -right-20 h-72 w-72 rounded-full blur-[100px]
          transition-colors duration-1000
          ${isLove || finished ? "bg-pink-500/20" : "bg-orange-400/10"}`}
        />
        <div className={`absolute -bottom-24 -left-20 h-72 w-72 rounded-full blur-[100px]
          transition-colors duration-1000
          ${isLove || finished ? "bg-rose-500/20" : "bg-emerald-500/10"}`}
        />
        <div className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      {/* En-tête */}
      <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 px-4 pt-4 sm:px-7 sm:pt-5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-white/40 sm:text-[10px]">
            Una pequeña historia sobre ti
          </p>
          <h2 className="mt-1 text-sm font-black tracking-[0.15em] sm:text-lg">
            {isLove || finished ? "MI PERSONA FAVORITA ♥" : "¿QUIÉN ERES REALMENTE?"}
          </h2>
        </div>

        <button
          onClick={toggleSound}
          className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 text-xs transition hover:bg-white/20"
          aria-label="Activar o desactivar la música"
        >
          <span>{soundOn ? "♫" : "♪"}</span>
          <span>{soundOn ? "SONIDO ON" : "SONIDO OFF"}</span>
        </button>
      </header>

      {/* Barre de progression */}
      {current >= 0 && !finished && (
        <div className="relative z-10 mx-4 mt-4 flex shrink-0 gap-1.5 sm:mx-7">
          {stages.map((item, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500
                ${i <= current
                  ? item.type === "love"
                    ? "bg-pink-400"
                    : "bg-orange-300"
                  : "bg-white/10"
                }`}
            />
          ))}
        </div>
      )}

      {/* Contenu principal */}
      <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-3 sm:px-8 sm:py-5">

        {/* Écran d'introduction */}
        {current === -1 && !finished && (
          <div className="flex w-full max-w-xl flex-col items-center text-center animate-[fadeIn_0.8s_ease-out]">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/5 text-4xl shadow-2xl sm:h-24 sm:w-24 sm:text-5xl">
              🎭
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-200/70">
              Atención, atención...
            </p>

            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
              ¿Quién es
              <span className="block text-orange-200">mi chica?</span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
              Hoy vamos a descubrir todas tus versiones...
              Porque creo que te conozco bastante bien.
            </p>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
              <p className="text-xs text-white/60">
                10 revelaciones · Algunas pueden ser peligrosas... 😈
              </p>
            </div>

            <button
              onClick={handleNext}
              className="mt-7 rounded-full bg-orange-200 px-8 py-3.5 text-xs font-black tracking-[0.2em] text-[#261c19] shadow-xl shadow-orange-300/10 transition hover:scale-105 hover:bg-orange-100 active:scale-95"
            >
              DESCUBRIR ▶
            </button>
          </div>
        )}

        {/* Écran des GIFs */}
        {stage && !finished && (
          <div
            key={current}
            className="flex h-full min-h-0 w-full max-w-3xl flex-col items-center justify-center animate-[fadeIn_0.55s_ease-out]"
          >
            <div className={`mb-3 shrink-0 rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] sm:mb-4
              ${stage.type === "fun"
                ? "border-orange-300/30 bg-orange-300/10 text-orange-200"
                : "border-pink-300/30 bg-pink-300/10 text-pink-200"
              }`}
            >
              {stage.type === "fun" ? "LAS COSAS QUE ME HACEN REÍR" : "LAS COSAS QUE AMO DE TI"}
            </div>

            <h3 className="mb-4 max-w-2xl shrink-0 text-center text-xl font-black leading-tight sm:mb-5 sm:text-3xl">
              {stage.text}
            </h3>

            {/* Cadre GIF */}
            <div className={`relative flex min-h-0 w-full max-w-xl flex-1 items-center justify-center overflow-hidden rounded-2xl border-2 p-2 shadow-2xl sm:rounded-3xl sm:p-3
              ${stage.type === "fun"
                ? "border-orange-200/30 bg-[#0d1717] shadow-orange-900/20"
                : "border-pink-200/30 bg-[#1c1020] shadow-pink-900/20"
              }`}
            >
              <div className="absolute left-3 top-3 z-10 rounded-full bg-black/50 px-3 py-1 text-[9px] font-black tracking-widest text-white/70">
                #{String(current + 1).padStart(2, "0")}
              </div>

              <img
                src={stage.gif}
                alt="Reacción"
                className="h-full w-full rounded-xl object-contain"
              />

              <div className="pointer-events-none absolute bottom-3 right-3 text-2xl opacity-80">
                {stage.type === "fun" ? "😂" : "❤️"}
              </div>
            </div>

            <p className="mt-3 min-h-[36px] shrink-0 text-center text-xs font-medium text-white/60 sm:mt-4 sm:text-sm">
              {stage.caption}
            </p>

            <button
              onClick={handleNext}
              className={`mt-3 shrink-0 rounded-full px-7 py-3 text-[10px] font-black tracking-[0.2em] shadow-xl transition hover:scale-105 active:scale-95 sm:mt-4 sm:px-9 sm:py-3.5
                ${stage.type === "fun"
                  ? "bg-orange-200 text-[#261c19] hover:bg-orange-100"
                  : "bg-pink-200 text-[#32172a] hover:bg-pink-100"
                }`}
            >
              {current === 9 ? "VER EL FINAL ♥" : "SIGUIENTE →"}
            </button>
          </div>
        )}

        {/* Écran final */}
        {finished && (
          <div className="flex w-full max-w-2xl flex-col items-center text-center animate-[fadeIn_1s_ease-out]">
            <div className="mb-4 text-5xl sm:text-6xl animate-pulse">
              ❤️
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-pink-200/70">
              Y ahora, la verdad...
            </p>

            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
              Te quiero tal
              <span className="block text-pink-200">como eres.</span>
            </h1>

            <div className="mt-6 max-w-xl rounded-3xl border border-pink-200/20 bg-white/5 p-5 sm:p-7">
              <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                No importa si eres dramática, testaruda o un poquito gruñona...
                Me encantan todas tus versiones.
                <br /><br />
                No quiero una versión perfecta de ti.
                <span className="font-bold text-pink-200">
                  {" "}Te quiero a ti, exactamente como eres.
                </span>
                <br /><br />
                Porque entre millones de personas, siempre te elegiría a ti. ❤️
              </p>
            </div>

            <p className="mt-5 text-xs font-bold tracking-widest text-pink-200/60">
              CON TODO MI AMOR ♥
            </p>

            <button
              onClick={restart}
              className="mt-6 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-[10px] font-black tracking-[0.2em] transition hover:bg-white/20"
            >
              VOLVER A VER ♥
            </button>
          </div>
        )}
      </main>

      {/* Pied de page */}
      <footer className="relative z-10 flex shrink-0 items-center justify-center gap-3 px-4 pb-3 text-[9px] font-bold tracking-[0.3em] text-white/25 sm:pb-4">
        <span>✦</span>
        HECHO CON AMOR
        <span>✦</span>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
