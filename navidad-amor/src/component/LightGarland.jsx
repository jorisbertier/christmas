
export default function LightGarland({ className = "", width = 150, numberBulbs = 6, decale = false, }) {
  const ampoules = Array.from({ length: numberBulbs }, (_, i) => ({
    x: 12 + i * 22,
    y: 20 + Math.sin((i / (numberBulbs - 1)) * Math.PI) * 13,
    couleur: i % 2 === 0 ? "#ffffff" : "#FFF55A",
    delay: `${(i % 2 === 0 ? 0 : -0.75) + (decale ? -0.75 : 0)}s`,
  }));

  return (
    <svg
      viewBox="0 0 270 55"
      style={{ width: typeof width === "number" ? `${width}%` : width }}
      className={`absolute h-10 overflow-visible ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fil de la guirlande */}
      {/* <path
        d="M 5 20 Q 135 65 265 20"
        fill="none"
        stroke="#b9a16b"
        strokeWidth="1.8"
        strokeLinecap="round"
      /> */}

      {/* Ampoules lumineuses */}
      {ampoules.map((ampoule, i) => (
        <g key={i}>
          {/* Halo lumineux */}
          <circle
            cx={ampoule.x}
            cy={ampoule.y}
            r="8"
            fill={ampoule.couleur}
            className="ampoule-halo"
            style={{ animationDelay: ampoule.delay }}
          />

          {/* Lumière principale */}
          <circle
            cx={ampoule.x}
            cy={ampoule.y}
            r="4"
            fill={ampoule.couleur}
            className="ampoule"
            style={{
              animationDelay: ampoule.delay,
              filter: `drop-shadow(0 0 4px ${ampoule.couleur})`,
            }}
          />
        </g>
      ))}
    </svg>
  );
}
