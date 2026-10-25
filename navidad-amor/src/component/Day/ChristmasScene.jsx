
import React from "react";

export default function ChristmasScene() {
  const ornaments = [
    ["left-[36%] top-[25%]", "🎄"],
    ["left-[48%] top-[20%]", "🔴"],
    ["left-[58%] top-[30%]", "🟡"],
    ["left-[31%] top-[38%]", "🔵"],
    ["left-[44%] top-[42%]", "🔴"],
    ["left-[63%] top-[42%]", "🟣"],
    ["left-[36%] top-[52%]", "🟡"],
    ["left-[51%] top-[54%]", "🔵"],
    ["left-[67%] top-[53%]", "🔴"],
    ["left-[43%] top-[64%]", "🟣"],
    ["left-[57%] top-[66%]", "🟡"],
    ["left-[31%] top-[67%]", "🔴"],
  ];

  const lights = Array.from({ length: 28 }, (_, i) => ({
    left: `${28 + ((i * 17) % 44)}%`,
    top: `${15 + ((i * 23) % 57)}%`,
    delay: `${(i % 7) * 0.3}s`,
  }));

  const gifts = [
    {
      left: "13%",
      bottom: "8%",
      width: "105px",
      height: "78px",
      color: "#a91f30",
      ribbon: "#f5d58b",
      rotate: "-5deg",
    },
    {
      left: "29%",
      bottom: "5%",
      width: "115px",
      height: "94px",
      color: "#175c3d",
      ribbon: "#d8b56d",
      rotate: "4deg",
    },
    {
      left: "53%",
      bottom: "6%",
      width: "115px",
      height: "83px",
      color: "#c18b45",
      ribbon: "#9d2430",
      rotate: "-3deg",
    },
    {
      left: "72%",
      bottom: "8%",
      width: "100px",
      height: "70px",
      color: "#7e2434",
      ribbon: "#f2d9a2",
      rotate: "6deg",
    },
  ];

  return (
    <section className="relative isolate min-h-[720px] overflow-hidden bg-[#111b19] text-white sm:min-h-[850px]">

      {/* Fond cosy */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#355043_0%,#182b24_48%,#0a1211_100%)]" />

      {/* Mur de chalet */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent 0px,transparent 75px,#a78b63 76px,#a78b63 78px)",
        }}
      />

      {/* Neige décorative */}
      {Array.from({ length: 65 }, (_, i) => (
        <span
          key={i}
          className="absolute z-10 animate-pulse rounded-full bg-white/70"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 19) % 95}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            animationDelay: `${(i % 8) * 0.3}s`,
          }}
        />
      ))}

      {/* Titre */}
      <div className="relative z-20 pt-8 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-amber-200">
          ✦ Christmas Collection ✦
        </p>
        <h1 className="mt-3 font-serif text-3xl text-[#fff1d1] drop-shadow-lg sm:text-5xl">
          Christmas Magic
        </h1>
      </div>

      {/* Étoile du sapin */}
      <div className="absolute left-1/2 top-[14%] z-20 -translate-x-1/2 animate-pulse text-5xl drop-shadow-[0_0_20px_#ffd76a] sm:text-6xl">
        ⭐
      </div>

      {/* SAPIN */}
      <div className="absolute left-1/2 top-[19%] z-10 h-[440px] w-[340px] -translate-x-1/2 sm:top-[17%] sm:h-[520px] sm:w-[420px]">

        {/* Guirlande lumineuse en zigzag */}
        <svg
          viewBox="0 0 400 500"
          className="absolute inset-0 h-full w-full overflow-visible"
          fill="none"
        >
          <defs>
            <linearGradient id="treeGreen" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#43855a" />
              <stop offset="0.5" stopColor="#185538" />
              <stop offset="1" stopColor="#092e22" />
            </linearGradient>
          </defs>

          <path
            d="M200 5 L128 110 L155 105 L85 205 L120 196 L43 310 L115 292 L65 380 L160 360 L160 438 L240 438 L240 360 L335 380 L285 292 L357 310 L280 196 L315 205 L245 105 L272 110 Z"
            fill="url(#treeGreen)"
            stroke="#5e9a65"
            strokeWidth="2"
          />

          <path
            d="M200 48 Q115 92 235 132 T140 214 T250 292 T150 370 T215 425"
            stroke="#e2bd69"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Branches et détails */}
          <path
            d="M200 60 L174 103 L190 97 L147 151 L171 143 L115 218 L153 207 L88 300 L145 281 L104 361 L178 343"
            stroke="#78a66c"
            strokeWidth="3"
            opacity=".65"
          />

          <path
            d="M200 60 L226 103 L210 97 L253 151 L229 143 L285 218 L247 207 L312 300 L255 281 L296 361 L222 343"
            stroke="#78a66c"
            strokeWidth="3"
            opacity=".65"
          />

          <rect x="176" y="412" width="48" height="65" rx="5" fill="#70452d" />
        </svg>

        {/* Boules variées */}
        {ornaments.map(([position, emoji], i) => (
          <div
            key={i}
            className={`absolute ${position} z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/30 text-lg shadow-[0_0_12px_#fff3] sm:h-9 sm:w-9 sm:text-2xl`}
            style={{
              background:
                i % 3 === 0
                  ? "radial-gradient(circle at 30% 25%,#ffb5a6,#a20d25 65%)"
                  : i % 3 === 1
                  ? "radial-gradient(circle at 30% 25%,#fff0a8,#c68a22 65%)"
                  : "radial-gradient(circle at 30% 25%,#b6d9ff,#245c9b 65%)",
            }}
          >
            {i % 4 === 0 ? "✦" : i % 4 === 1 ? "❄" : "✧"}
          </div>
        ))}

        {/* Lumières scintillantes */}
        {lights.map((light, i) => (
          <span
            key={i}
            className="absolute z-10 h-2.5 w-2.5 rounded-full bg-amber-200 shadow-[0_0_12px_4px_#ffdc6b90] animate-pulse"
            style={{
              left: light.left,
              top: light.top,
              animationDelay: light.delay,
            }}
          />
        ))}

        {/* Petits flocons sur les branches */}
        <span className="absolute left-[36%] top-[31%] text-sm text-white">❄</span>
        <span className="absolute left-[61%] top-[46%] text-lg text-white/90">❄</span>
        <span className="absolute left-[28%] top-[61%] text-sm text-white">✧</span>
      </div>

      {/* CHEMINÉE */}
      <div className="absolute right-[4%] top-[28%] z-[5] w-[180px] sm:right-[7%] sm:top-[25%] sm:w-[240px]">

        {/* Conduit */}
        <div className="mx-auto h-24 w-24 border-x-4 border-[#75432f] bg-[#a86743] sm:h-32 sm:w-32" />

        {/* Corniche */}
        <div className="relative z-10 h-5 rounded-sm border-y-2 border-[#d3a477] bg-[#8a5136] shadow-lg sm:h-7" />

        {/* Foyer */}
        <div className="relative h-44 border-x-8 border-b-8 border-[#8b5238] bg-[#38231e] shadow-2xl sm:h-52">
          <div className="absolute inset-x-3 bottom-0 h-28 overflow-hidden rounded-t-full bg-black sm:h-36">
            <div className="absolute bottom-0 left-1/2 h-20 w-12 -translate-x-1/2 animate-pulse rounded-full bg-orange-500 blur-md sm:h-28 sm:w-16" />
            <div className="absolute bottom-0 left-1/2 h-16 w-7 -translate-x-1/2 rounded-full bg-yellow-300 blur-sm sm:h-20 sm:w-10" />
            <div className="absolute bottom-0 left-[25%] h-12 w-4 rotate-[-20deg] rounded-full bg-orange-400 blur-sm" />
            <div className="absolute bottom-0 right-[25%] h-14 w-4 rotate-[20deg] rounded-full bg-yellow-200 blur-sm" />
            <div className="absolute bottom-0 left-2 right-2 h-3 rounded-full bg-[#6e3723]" />
          </div>
        </div>

        {/* Guirlande sur le manteau */}
        <div className="absolute -top-2 left-0 right-0 flex h-6 items-start justify-around">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} className="text-sm drop-shadow-md">
              {i % 2 === 0 ? "🌿" : "🔴"}
            </span>
          ))}
        </div>

        {/* Chaussettes de Noël */}
        <div className="absolute -top-1 left-[12%] flex flex-col items-center">
          <div className="h-2 w-7 rounded-sm bg-white" />
          <div className="h-8 w-6 rounded-b-xl bg-red-600 shadow-md" />
          <div className="h-3 w-5 -translate-x-1 -rotate-12 rounded-b-lg bg-red-600" />
        </div>

        <div className="absolute -top-1 right-[14%] flex flex-col items-center">
          <div className="h-2 w-7 rounded-sm bg-white" />
          <div className="h-8 w-6 rounded-b-xl bg-green-700 shadow-md" />
          <div className="h-3 w-5 translate-x-1 rotate-12 rounded-b-lg bg-green-700" />
        </div>
      </div>

      {/* Houx et bougies à gauche */}
      <div className="absolute left-[4%] top-[38%] z-10 sm:left-[8%]">
        <div className="text-5xl drop-shadow-lg sm:text-7xl">🌿</div>
        <div className="ml-5 -mt-4 text-3xl">🔴</div>
        <div className="mt-2 flex gap-3">
          <span className="text-3xl">🕯️</span>
          <span className="text-2xl">🌿</span>
        </div>
      </div>

      {/* Couronne de Noël */}
      <div className="absolute left-[5%] top-[20%] z-10 text-6xl drop-shadow-lg sm:left-[10%] sm:text-8xl">
        🎀
      </div>

      {/* Cadeaux au pied du sapin */}
      <div className="absolute inset-x-0 bottom-[8%] z-20 mx-auto h-32 max-w-3xl sm:bottom-[7%] sm:h-40">
        {gifts.map((gift, i) => (
          <div
            key={i}
            className="absolute bottom-0 shadow-[0_12px_15px_#0007]"
            style={{
              left: gift.left,
              width: gift.width,
              height: gift.height,
              background: `linear-gradient(110deg,${gift.color},${gift.color}dd)`,
              transform: `rotate(${gift.rotate})`,
              border: "1px solid #ffffff33",
            }}
          >
            {/* Ruban vertical */}
            <div
              className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2"
              style={{ backgroundColor: gift.ribbon }}
            />

            {/* Ruban horizontal */}
            <div
              className="absolute left-0 right-0 top-1/2 h-3 -translate-y-1/2"
              style={{ backgroundColor: gift.ribbon }}
            />

            {/* Nœud */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl drop-shadow-md">
              🎀
            </div>
          </div>
        ))}
      </div>

      {/* Sol enneigé */}
      <div className="absolute inset-x-0 bottom-0 z-[15] h-12 rounded-t-[50%] bg-gradient-to-b from-[#e5e5d9] to-[#9daea5] shadow-[0_-10px_40px_#fff2]" />

      {/* Flocons au premier plan */}
      <div className="pointer-events-none absolute bottom-12 left-[10%] z-20 text-3xl text-white/80">
        ❄
      </div>
      <div className="pointer-events-none absolute bottom-16 right-[12%] z-20 text-2xl text-white/80">
        ❄
      </div>
    </section>
  );
}
