
import React, { useEffect, useRef, useState } from "react";

export default function CinemaIntro({
  videoSrc = "/videos/mon-film.mp4",
  onFinish,
}) {
  const [count, setCount] = useState(3);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (started || finished) return;

    const timer = setInterval(() => {
      setCount((n) => {
        if (n <= 1) {
          clearInterval(timer);
          setStarted(true);
          return 0;
        }
        return n - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (started && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [started]);

  const replay = () => {
    setFinished(false);
    setStarted(false);
    setCount(3);
  };

  return (
    <section className="relative isolate flex h-full max-h-full w-full max-w-full items-center justify-center overflow-hidden bg-[#080707] p-2 text-[#f5ead5] sm:p-4">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#49352b_0%,#211510_48%,#070504_100%)]" />
      <div className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* Rideaux */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-2 sm:w-5 bg-[repeating-linear-gradient(90deg,#260509_0px,#680e18_9px,#39070d_18px)] shadow-[8px_0_25px_#000]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-2 sm:w-5 bg-[repeating-linear-gradient(90deg,#39070d_0px,#680e18_9px,#260509_18px)] shadow-[-8px_0_25px_#000]" />

      <div className="relative z-10 flex h-full max-h-full w-full max-w-4xl flex-col items-center justify-center gap-2 sm:gap-3">

        {/* Enseigne */}
        <div className="shrink-0 text-center">
          <p className="font-serif text-[9px] tracking-[0.35em] text-amber-200/70 sm:text-xs sm:tracking-[0.65em]">
            ✦ THE GRAND CINEMA ✦
          </p>
          <h1 className="mt-1 font-serif text-lg tracking-[0.12em] text-[#f8e8c8] sm:text-2xl">
            Una noche especial
          </h1>
        </div>

        {/* TICKET */}
        {!started && (
          <div className="relative z-30 w-full max-w-[420px] shrink-0 animate-[ticketIn_0.8s_ease-out]">
            <div className="relative flex overflow-hidden rounded-lg bg-[#e9d6ae] text-[#39251a] shadow-[0_10px_40px_#0009]">

              {/* Décoration gauche */}
              <div className="flex w-12 shrink-0 flex-col items-center justify-center border-r-2 border-dashed border-[#8c6745]/50 bg-[#d9c298] sm:w-16">
                <span className="rotate-[-90deg] whitespace-nowrap text-[8px] font-bold tracking-[0.3em] sm:text-[10px]">
                  CINE ESPECIAL
                </span>
              </div>

              {/* Contenu ticket */}
              <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-3 py-3 text-center sm:py-4">
                <p className="text-[8px] font-bold tracking-[0.35em] text-[#936d42] sm:text-[10px]">
                  ✦ INVITACIÓN EXCLUSIVA ✦
                </p>

                <h2 className="mt-1 font-serif text-xl font-bold sm:text-3xl">
                  ENTRADA VIP
                </h2>

                <div className="my-2 h-px w-4/5 bg-[#a78960]/50" />

                <p className="font-serif text-xs italic sm:text-sm">
                  Válida para una noche de cine
                </p>

                <p className="mt-2 max-w-[260px] font-serif text-base font-bold leading-tight sm:text-xl">
                  ¡Una película de tu elección!
                </p>

                <p className="mt-2 text-[8px] tracking-widest text-[#806344] sm:text-[9px]">
                  FECHA: CUANDO TÚ QUIERAS
                </p>
              </div>

              {/* Stub droit */}
              <div className="flex w-12 shrink-0 flex-col items-center justify-center border-l-2 border-dashed border-[#8c6745]/50 bg-[#d9c298] sm:w-16">
                <span className="text-lg">🎬</span>
                <span className="mt-1 text-[7px] font-bold tracking-widest sm:text-[9px]">
                  VIP
                </span>
                <span className="mt-2 text-[7px] tracking-widest">
                  001
                </span>
              </div>

              {/* Perforations */}
              <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#211510]" />
              <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#211510]" />
            </div>

            <p className="mt-2 text-center font-serif text-[9px] italic text-amber-100/70 sm:text-xs">
              Un pequeño regalo para mi persona favorita ❤️
            </p>
          </div>
        )}

        {/* ECRAN */}
        <div className="relative w-full min-h-0 flex-1 flex items-center justify-center">

          <div className="w-full rounded-sm bg-gradient-to-br from-[#c3a16a] via-[#49351e] to-[#a17b43] p-1.5 shadow-[0_0_35px_#d4b77a25,0_20px_60px_#000] sm:p-2">

            <div className="relative aspect-video w-full overflow-hidden border-2 border-[#17110a] bg-black">

              {/* COMPTE A REBOURS */}
              {!started && (
                <div
                  key={count}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#151515] text-[#f5f1e8] animate-[flicker_0.15s_infinite_alternate]"
                >
                  <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_3px,#ffffff10_4px,transparent_5px)]" />

                  <div className="relative flex aspect-square w-[35%] max-w-[210px] items-center justify-center rounded-full border-2 border-[#eee9dc]">
                    <div className="absolute inset-2 rounded-full border border-[#eee9dc]/70" />
                    <div className="absolute h-px w-full bg-[#eee9dc]/70" />
                    <div className="absolute h-full w-px bg-[#eee9dc]/70" />

                    <span
                      key={count}
                      className="relative font-black leading-none text-[clamp(65px,13vw,150px)] drop-shadow-[0_0_15px_#fff8] animate-[appear_0.4s_ease-out]"
                    >
                      {count}
                    </span>
                  </div>

                  <p className="relative mt-3 text-[7px] tracking-[0.3em] sm:text-[10px] sm:tracking-[0.5em]">
                    PREPARANDO TU PELÍCULA
                  </p>

                  <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_65px_15px_#000b]" />
                </div>
              )}

              {/* VIDEO */}
              {started && !finished && (
                <video
                  ref={videoRef}
                  src={videoSrc}
                  playsInline
                  controls
                  autoPlay
                  onEnded={() => {
                    setFinished(true);
                    onFinish?.();
                  }}
                  className="absolute inset-0 h-full w-full bg-black object-contain animate-[reveal_1.2s_ease-out]"
                />
              )}

              {/* FIN */}
              {finished && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#101010] px-3 text-center animate-[reveal_1s_ease]">
                  <span className="text-2xl">❤️</span>
                  <p className="mt-2 text-[9px] tracking-[0.6em] text-amber-100/80">
                    THE END
                  </p>
                  <h2 className="mt-3 font-serif text-xl sm:text-4xl">
                    Gracias por estar aquí
                  </h2>
                  <p className="mt-2 text-xs italic text-amber-100/70">
                    Esta noche es solo nuestra.
                  </p>

                  <button
                    onClick={replay}
                    className="mt-4 border border-amber-200/60 px-4 py-2 text-[9px] tracking-widest transition hover:bg-amber-100 hover:text-black sm:text-xs"
                  >
                    VOLVER A VER ↺
                  </button>
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 z-[2] shadow-[inset_0_0_55px_12px_#0009]" />
            </div>
          </div>
        </div>

        {/* Bas de l'écran */}
        <div className="shrink-0 text-center">
          <p className="font-serif text-[8px] tracking-[0.3em] text-amber-100/60 sm:text-xs sm:tracking-[0.5em]">
            ✧ UNA EXPERIENCIA SOLO PARA TI ✧
          </p>
          <div className="mt-2 flex justify-center gap-2 opacity-70">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className="h-4 w-5 rounded-t-lg border border-[#61352c] bg-gradient-to-r from-[#170807] via-[#481915] to-[#1c0908] sm:h-6 sm:w-8"
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes flicker {
          0% { opacity: 1; }
          50% { opacity: .94; }
          100% { opacity: .99; }
        }

        @keyframes appear {
          from { opacity: 0; transform: scale(1.2); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes reveal {
          from { opacity: 0; filter: brightness(2); }
          to { opacity: 1; filter: brightness(1); }
        }

        @keyframes ticketIn {
          from { opacity: 0; transform: translateY(-15px) scale(.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: .01ms !important; }
        }
      `}</style>
    </section>
  );
}
