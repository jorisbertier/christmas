
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
    <section className="relative isolate flex min-h-[650px] w-full items-center justify-center overflow-hidden bg-[#080707] px-3 py-12 text-[#f5ead5] sm:px-8">

      {/* Ambiance lumineuse */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,#39302a_0%,#171211_45%,#050505_100%)]" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[70%] -translate-x-1/2 bg-amber-100/[0.035] blur-3xl" />

      {/* Rideaux de velours */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-[repeating-linear-gradient(90deg,#260509_0px,#680e18_9px,#39070d_18px)] shadow-[8px_0_25px_#000] sm:w-12 md:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-[repeating-linear-gradient(90deg,#39070d_0px,#680e18_9px,#260509_18px)] shadow-[-8px_0_25px_#000] sm:w-12 md:w-20" />

      <div className="relative z-[1] w-full max-w-5xl">

        {/* Enseigne */}
        <div className="mb-6 text-center">
          <p className="font-serif text-[10px] tracking-[0.4em] text-amber-200/70 sm:text-xs sm:tracking-[0.65em]">
            ✦ &nbsp; THE GRAND CINEMA &nbsp; ✦
          </p>
        </div>

        {/* Écran et cadre doré */}
        <div className="rounded-sm bg-gradient-to-br from-[#b69b65] via-[#302417] to-[#8e7045] p-1.5 shadow-[0_0_35px_#d4b77a18,0_25px_80px_#000] sm:p-3">
          <div className="relative aspect-video w-full overflow-hidden border-2 border-[#15110d] bg-black">

            {/* Compte à rebours */}
            {!started && (
              <div
                key={count}
                className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#171717] text-[#f5f1e8] animate-[flicker_0.15s_infinite_alternate]"
              >
                {/* Grain de pellicule */}
                <div
                  className="pointer-events-none absolute -inset-1/2 animate-[grain_0.2s_steps(3)_infinite] opacity-20"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E\")",
                  }}
                />

                {/* Traits du viseur */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_3px,#ffffff10_4px,transparent_5px)]" />

                <div className="relative flex aspect-square w-[42%] max-w-[250px] items-center justify-center rounded-full border-2 border-[#eee9dc]">
                  <div className="absolute inset-2 rounded-full border border-[#eee9dc]/80" />

                  <div className="absolute h-px w-full bg-[#eee9dc]/80" />
                  <div className="absolute h-full w-px bg-[#eee9dc]/80" />

                  <span
                    key={`number-${count}`}
                    className="relative z-[1] font-sans text-[clamp(90px,18vw,190px)] font-black leading-none drop-shadow-[0_0_12px_#ffffff55] animate-[appear_0.35s_ease-out]"
                  >
                    {count}
                  </span>
                </div>

                <p className="relative mt-4 text-center font-sans text-[7px] tracking-[0.35em] sm:text-[10px] sm:tracking-[0.5em]">
                  PLEASE TAKE YOUR SEATS
                </p>

                {/* Poussières et vignettage */}
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_65px_15px_#000b]" />
              </div>
            )}

            {/* Vidéo */}
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
                className="absolute inset-0 h-full w-full bg-black object-contain grayscale contrast-110 animate-[reveal_1.2s_ease-out]"
              />
            )}

            {/* Fin du film */}
            {finished && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#101010] px-4 text-center animate-[reveal_1s_ease]">
                <p className="text-xs tracking-[0.7em] text-amber-100/80">
                  THE END
                </p>

                <h2 className="mt-4 font-serif text-xl sm:text-4xl">
                  Merci d'être là ♥
                </h2>

                <button
                  onClick={replay}
                  className="mt-6 border border-amber-200/60 px-5 py-2 text-xs tracking-widest transition hover:bg-amber-100 hover:text-black"
                >
                  REVOIR LE FILM ↺
                </button>
              </div>
            )}

            {/* Vignettage cinéma */}
            <div className="pointer-events-none absolute inset-0 z-[2] shadow-[inset_0_0_55px_12px_#0009]" />
          </div>
        </div>

        {/* Signature */}
        <p className="mt-5 text-center font-serif text-[9px] tracking-[0.3em] text-amber-100/60 sm:text-xs sm:tracking-[0.5em]">
          ✧ &nbsp; A SPECIAL PRESENTATION &nbsp; ✧
        </p>

        {/* Rangée de fauteuils */}
        <div className="mt-10 flex h-16 justify-center gap-1.5 overflow-hidden opacity-75 sm:gap-3">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className="h-20 min-w-0 flex-1 max-w-[75px] rounded-t-[18px] border border-[#61352c] bg-gradient-to-r from-[#170807] via-[#481915] to-[#1c0908] shadow-[inset_0_0_12px_#000]"
            />
          ))}
        </div>
      </div>

      {/* Animations CSS directement dans le composant */}
      <style>{`
        @keyframes flicker {
          0% { opacity: 1; }
          50% { opacity: 0.94; }
          100% { opacity: 0.99; }
        }

        @keyframes appear {
          from { opacity: 0; transform: scale(1.2); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes grain {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-2%, 1%); }
          50% { transform: translate(1%, -2%); }
          75% { transform: translate(2%, 2%); }
          100% { transform: translate(-1%, -1%); }
        }

        @keyframes reveal {
          from { opacity: 0; filter: grayscale(100%) brightness(2); }
          to { opacity: 1; filter: grayscale(100%) brightness(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[flicker_0\\.15s_infinite_alternate\\],
          .animate-\\[grain_0\\.2s_steps\\(3\\)_infinite\\] {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
