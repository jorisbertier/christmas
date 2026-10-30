
import React from "react";

// Patinoire
function Rink({ x, y, gradientId }) {
  const marks = [
    "M-70 -4 Q-20 -18 40 -8",
    "M-40 8 Q10 16 70 4",
    "M-84 2 Q-30 -10 20 6",
    "M10 -12 Q55 -6 88 6",
    "M-60 12 Q-10 6 30 14",
    "M-20 -14 Q30 -16 70 -6",
  ];

  const sparkles = [
    [-60, -4], [20, 10], [64, -8],
    [-20, 12], [84, 4], [-84, 6],
  ];

  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="3" rx="114" ry="31" fill="#5b0a17" opacity=".3" />
      <ellipse cx="0" cy="0" rx="112" ry="30" fill="#fff" />
      <ellipse cx="0" cy="1" rx="104" ry="25" fill={`url(#${gradientId})`} />
      <ellipse cx="-24" cy="-8" rx="70" ry="10" fill="#fff" opacity=".35" />

      {marks.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#fff"
          strokeWidth="1"
          opacity=".7"
        />
      ))}

      {sparkles.map(([sx, sy], i) => (
        <path
          key={i}
          className="ice-sparkle"
          d={`M${sx} ${sy - 4}L${sx + 1.2} ${sy - 1}L${sx + 4} ${sy}L${sx + 1.2} ${sy + 1}L${sx} ${sy + 4}L${sx - 1.2} ${sy + 1}L${sx - 4} ${sy}L${sx - 1.2} ${sy - 1}Z`}
          fill="#fff"
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}

      <path
        d="M-112 0 A112 30 0 0 0 112 0"
        fill="none"
        stroke="#e8939a"
        strokeWidth="2"
        opacity=".5"
      />
    </g>
  );
}

// Patineur
function Skater({ coat, hat, scarf }) {
  return (
    <g>
      <ellipse cx="0" cy="1" rx="9" ry="2.4" fill="#5b0a17" opacity=".22" />

      {/* Jambes animées */}
      <g>
        <path
          d="M-3 -10 L-6 -1"
          stroke="#2a1a22"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-20 -3 -10;20 -3 -10;-20 -3 -10"
            dur=".55s"
            repeatCount="indefinite"
          />
        </path>

        <path
          d="M3 -10 L8 -2"
          stroke="#2a1a22"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="20 3 -10;-20 3 -10;20 3 -10"
            dur=".55s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Patins */}
      <path
        d="M-9 0H-2M5 0H12"
        stroke="#e8edf5"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Écharpe */}
      <path
        d="M-4 -25 Q-16 -24 -20 -19"
        fill="none"
        stroke={scarf}
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Manteau */}
      <path d="M-7 -11 Q-8 -24 0 -27 Q8 -24 7 -11Z" fill={coat} />

      {/* Bras */}
      <path
        d="M-5 -22 L-15 -18M5 -22 L15 -26"
        stroke={coat}
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      {/* Tête */}
      <circle cx="0" cy="-31.5" r="5.2" fill="#f2c9a5" />

      {/* Bonnet */}
      <path d="M-5.6 -33 Q0 -43 5.6 -33Z" fill={hat} />
      <circle cx="0" cy="-42" r="2" fill="#fff" />

      {/* Col */}
      <path d="M-5 -26 H5 L4 -23 H-4Z" fill={scarf} />
    </g>
  );
}

// Données des patineurs
const SKATERS = [
  {
    dx: 0,
    dy: 0,
    rx: 80,
    ry: 15,
    duration: "11.42s",
    direction: 1,
    coat: "#2a6fd1",
    hat: "#c8202e",
    scarf: "#fff",
    size: 1,
  },
  {
    dx: -9,
    dy: 4,
    rx: 48,
    ry: 9,
    duration: "8.73s",
    direction: -1,
    coat: "#c8202e",
    hat: "#fff",
    scarf: "#f5c542",
    size: 0.95,
  },
  {
    dx: 15,
    dy: -5,
    rx: 92,
    ry: 17,
    duration: "14.96s",
    direction: 1,
    coat: "#f5c542",
    hat: "#2f8f5b",
    scarf: "#c8202e",
    size: 1.05,
  },
];

export default function IceSkating({
  x = 265,
  y = 553,
  gradientId = "ice-gradient",
}) {
  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bdeaff" />
          <stop offset="50%" stopColor="#83c9e8" />
          <stop offset="100%" stopColor="#d8f4ff" />
        </linearGradient>
      </defs>

      <style>{`
        .ice-sparkle {
          animation: ice-twinkle 2s ease-in-out infinite;
        }

        @keyframes ice-twinkle {
          0%, 100% { opacity: .35; }
          50% { opacity: 1; }
        }
      `}</style>

      <Rink x={x} y={y} gradientId={gradientId} />

      {SKATERS.map((s, i) => {
        const cx = x + s.dx;
        const cy = y + s.dy;

        // Le sens de rotation est inversé pour le deuxième patineur
        const path =
          s.direction === 1
            ? `M ${cx + s.rx} ${cy} A ${s.rx} ${s.ry} 0 1 1 ${cx - s.rx} ${cy} A ${s.rx} ${s.ry} 0 1 1 ${cx + s.rx} ${cy}`
            : `M ${cx + s.rx} ${cy} A ${s.rx} ${s.ry} 0 1 0 ${cx - s.rx} ${cy} A ${s.rx} ${s.ry} 0 1 0 ${cx + s.rx} ${cy}`;

        return (
          <g key={i}>
            <animateMotion
              dur={s.duration}
              repeatCount="indefinite"
              path={path}
            />

            <g transform={`scale(${s.size})`}>
              <Skater
                coat={s.coat}
                hat={s.hat}
                scarf={s.scarf}
              />
            </g>
          </g>
        );
      })}
    </g>
  );
}
