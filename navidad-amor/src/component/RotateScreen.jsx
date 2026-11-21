import { useMemo } from "react";
import Snow from "./Snow";

export default function RotateScreen() {
  const stars = useMemo(
    () =>
      Array.from({ length: 45 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 2,
      })),
    []
  );

  return (
    <div
    // hidden portrait:max-[800px]:flex
    className="
        hidden max-[600px]:flex
        fixed inset-0 z-200 overflow-hidden
        flex-col items-center justify-center px-8 text-center
        bg-[radial-gradient(ellipse_at_50%_0%,#3b3a8f_0%,#1b1947_45%,#0c0a2b_100%)]
      "
    >
      <style>{`
        @keyframes rs-twinkle { 0%,100% { opacity:.2; transform:scale(.8) } 50% { opacity:1; transform:scale(1.3) } }
        @keyframes rs-rotate  { 0%,15% { transform:rotate(0deg) } 45%,75% { transform:rotate(-90deg) } 100% { transform:rotate(0deg) } }
        @keyframes rs-float   { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-8px) } }
        @keyframes rs-glow    { 0%,100% { opacity:.5 } 50% { opacity:1 } }
      `}</style>

      {/* Étoiles */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-amber-100"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            boxShadow: "0 0 6px #fef3c7",
            animation: `rs-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* Neige */}
      <Snow count={22} />

      {/* Lune */}
      <div className="absolute right-[10%] top-[6%] aspect-square w-16 rounded-full bg-amber-100 opacity-90 shadow-[0_0_40px_#fef08a]">
        <div className="absolute right-[25%] top-0 aspect-square w-[80%] rounded-full bg-[#1b1947]" />
      </div>

      {/* Halo derrière le téléphone */}
      <div
        className="absolute h-64 w-64 rounded-full bg-amber-300/20 blur-3xl"
        style={{ animation: "rs-glow 4s ease-in-out infinite" }}
      />

      {/* Téléphone */}
      <div className="relative mb-10" style={{ animation: "rs-float 4s ease-in-out infinite" }}>
        <div style={{ animation: "rs-rotate 3.5s ease-in-out infinite" }}>
          <svg width="96" height="150" viewBox="0 0 96 150" fill="none">
            <defs>
              <linearGradient id="rs-body" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fde68a" />
                <stop offset="1" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="rs-screen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2d2a6e" />
                <stop offset="1" stopColor="#0c0a2b" />
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="92" height="146" rx="18" fill="url(#rs-body)" />
            <rect x="7" y="7" width="82" height="136" rx="14" fill="url(#rs-screen)" />
            <rect x="36" y="11" width="24" height="5" rx="2.5" fill="#0c0a2b" />
            <text x="48" y="88" fontSize="44" textAnchor="middle">🎄</text>
            <text x="48" y="40" fontSize="14" textAnchor="middle" fill="#fde68a">✦</text>
          </svg>
        </div>
      </div>

      {/* Texte */}

      <h1
        className="mb-4 font-serif text-4xl font-bold leading-tight"
        style={{
          background: "linear-gradient(180deg,#fff7d6 0%,#fde68a 50%,#f59e0b 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 0 14px rgba(254,240,138,.45))",
        }}
      >
        ¡Feliz Navidad!
      </h1>

      <div className="mb-5 flex items-center gap-3 text-amber-300/80">
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-300/70" />
        <span>❄</span>
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-amber-300/70" />
      </div>

      <p className="max-w-xs font-serif text-lg leading-relaxed text-amber-50">
        Gira tu pantalla en horizontal
        <br />
        para descubrir
      </p>

    </div>
  );
}