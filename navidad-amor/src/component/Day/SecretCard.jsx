import React, { useEffect, useRef, useState } from "react";

export default function CarteAGratter() {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  const [revelee, setRevelee] = useState(false);

  // Dessiner la couche dorée à gratter
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(ratio, ratio);

    // Fond doré
    const gradient = ctx.createLinearGradient(
      0,
      0,
      rect.width,
      rect.height
    );

    gradient.addColorStop(0, "#f8e7a1");
    gradient.addColorStop(0.5, "#d4a64c");
    gradient.addColorStop(1, "#f5df91");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Petites paillettes
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;

      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 1.8 + 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Instructions sur la surface dorée
    ctx.fillStyle = "#69491b";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 20px Georgia";
    ctx.fillText("✨ GRATTE ICI ✨", rect.width / 2, rect.height / 2 - 12);

    ctx.font = "14px Georgia";
    ctx.fillText(
      "pour découvrir ton message",
      rect.width / 2,
      rect.height / 2 + 18
    );

    ctx.globalCompositeOperation = "source-over";
  }, []);

  // Effacer la couche dorée au passage du doigt ou de la souris
  const gratter = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Effacer la couche dorée pour révéler le texte situé dessous
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 23, 0, Math.PI * 2);
    ctx.fill();

    // Vérifier la proportion de la carte déjà grattée
    const pixels = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;

    let transparents = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 20) {
        transparents++;
      }
    }

    if (transparents / totalPixels > 0.42) {
      setRevelee(true);
    }

    ctx.globalCompositeOperation = "source-over";
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#160e20] via-[#32132f] to-[#160e20] px-4 py-10 text-white sm:px-6">

      <div className="mx-auto flex w-full max-w-xl flex-col items-center">

        {/* Décoration */}
        <div className="mb-5 text-4xl">
          🎄 💖 ✨
        </div>

        <h1 className="text-center text-3xl font-bold text-amber-200 sm:text-4xl">
          Una sorpresa para ti
        </h1>

        <p className="mt-3 text-center text-rose-100/80">
          J’ai caché quelques mots pour toi…
        </p>

        {/* Carte */}
        <div className="mt-8 w-full rounded-3xl border border-amber-200/30 bg-white/5 p-4 shadow-2xl backdrop-blur-sm sm:p-6">

          <div className="mb-5 text-center">
            <span className="text-sm uppercase tracking-[0.25em] text-amber-200/80">
              Un petit secret
            </span>

            <h2 className="mt-2 text-2xl font-semibold text-amber-100">
              Gratte pour découvrir 💌
            </h2>
          </div>

          {/* Message placé SOUS le canvas */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-200/20">

            {/* Ce texte reste derrière la couche dorée */}
            <div className="flex min-h-64 flex-col items-center justify-center bg-gradient-to-br from-rose-950 via-[#632347] to-purple-950 p-6 text-center sm:p-8">

              <div className="mb-4 text-4xl">
                ❤️
              </div>

              <h3 className="mb-5 text-2xl font-bold text-amber-200">
                Mon message secret
              </h3>

              <p className="text-base leading-8 text-rose-50 sm:text-lg">
                Si je pouvais refaire tous les choix de ma vie,
                je choisirais encore de te rencontrer, de t’aimer
                et de construire notre histoire avec toi.
                Tu es mon plus beau cadeau. 💖
              </p>

              <p className="mt-5 font-serif italic text-amber-200">
                Con todo mi amor, para ti. ❤️
              </p>

              <div className="mt-5 text-2xl tracking-widest">
                ✨ 💕 ✨
              </div>
            </div>

            {/* Surface à gratter : toujours présente au-dessus du message */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 z-10 block h-full w-full cursor-crosshair touch-none"
              onPointerDown={(event) => {
                drawingRef.current = true;
                event.currentTarget.setPointerCapture(event.pointerId);
                gratter(event);
              }}
              onPointerMove={(event) => {
                if (drawingRef.current) {
                  gratter(event);
                }
              }}
              onPointerUp={() => {
                drawingRef.current = false;
              }}
              onPointerCancel={() => {
                drawingRef.current = false;
              }}
              aria-label="Gratte la surface dorée pour révéler le message d’amour"
            />

          </div>

          {/* Indication sous la carte */}
          <p className="mt-5 text-center text-sm leading-6 text-amber-100/80">
            {revelee
              ? "💖 Tu peux continuer à gratter pour découvrir le reste du message !"
              : "✨ Gratte doucement la surface dorée avec ton doigt pour révéler mon message, petit à petit…"}
          </p>

        </div>

        {/* Bas de page */}
        <div className="mt-8 text-center">
          <p className="font-serif text-lg italic text-rose-200">
            Cada día, una razón más para amarte. ❤️
          </p>

          <p className="mt-3 text-xs text-rose-100/50">
            Con amor, siempre.
          </p>
        </div>

      </div>
    </main>
  );
}