
import React, { useEffect, useRef, useState } from "react";

const GIFTS = [
  { name: "Un beso mágico", emoji: "💋" },
  { name: "Chocolate navideño", emoji: "🍫" },
  { name: "Un deseo cumplido", emoji: "⭐" },
  { name: "Una cita romántica", emoji: "❤️" },
  { name: "Un abrazo infinito", emoji: "🤗" },
  { name: "Una sorpresa", emoji: "🎁" },
  { name: "Un mensaje de amor", emoji: "💌" },
  { name: "Noche de película", emoji: "🎬" },
  { name: "Un baile juntos", emoji: "💃" },
  { name: "Un recuerdo especial", emoji: "📸" },
  { name: "Un vale de mimos", emoji: "🥰" },
  { name: "El regalo sorpresa", emoji: "🎀" },
];

function ChristmasWheelDisc({ rotation }) {
  const count = GIFTS.length;
  const step = 360 / count;
  const cx = 200;
  const cy = 200;
  const radius = 174;

  const polar = (r, angle) => {
    const a = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
    };
  };

  const segmentPath = (start, end) => {
    const p1 = polar(radius, start);
    const p2 = polar(radius, end);

    return [
      `M ${cx} ${cy}`,
      `L ${p1.x} ${p1.y}`,
      `A ${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 1 ${p2.x} ${p2.y}`,
      "Z",
    ].join(" ");
  };

  return (
    <svg
      viewBox="0 0 400 400"
      className="cw-disc"
      style={{ transform: `rotate(${rotation}deg)` }}
      role="img"
      aria-label="Roue de la fortune de Noël"
    >
      <defs>
        <linearGradient id="cw-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff5bf" />
          <stop offset="35%" stopColor="#f2ce71" />
          <stop offset="65%" stopColor="#bd812b" />
          <stop offset="100%" stopColor="#ffe9a0" />
        </linearGradient>

        <linearGradient id="cw-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e34a4a" />
          <stop offset="48%" stopColor="#b51f30" />
          <stop offset="100%" stopColor="#751020" />
        </linearGradient>

        <linearGradient id="cw-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#43a86a" />
          <stop offset="48%" stopColor="#167044" />
          <stop offset="100%" stopColor="#073c29" />
        </linearGradient>

        <radialGradient id="cw-center">
          <stop offset="0%" stopColor="#d83d3d" />
          <stop offset="100%" stopColor="#791323" />
        </radialGradient>

        <filter id="cw-text-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="1.5"
            stdDeviation="1.4"
            floodColor="#250b0b"
            floodOpacity=".8"
          />
        </filter>
      </defs>

      {/* Base en bois et bordure dorée */}
      <circle cx={cx} cy={cy} r="194" fill="#6f3518" />
      <circle cx={cx} cy={cy} r="190" fill="url(#cw-gold)" />
      <circle cx={cx} cy={cy} r="184" fill="#6e281c" />
      <circle cx={cx} cy={cy} r="179" fill="url(#cw-gold)" />

      {/* Parts de la roue : rouge et vert alternés */}
      {GIFTS.map((gift, i) => {
        const start = -90 + i * step;
        const end = start + step;
        const middle = start + step / 2;
        const labelPoint = polar(118, middle);
        const emojiPoint = polar(151, middle);
        const isRed = i % 2 === 0;

        const label = gift.name.length > 19
          ? `${gift.name.slice(0, 17)}…`
          : gift.name;

        return (
          <g key={`${gift.name}-${i}`}>
            <path
              d={segmentPath(start, end)}
              fill={isRed ? "url(#cw-red)" : "url(#cw-green)"}
              stroke="#f9dfa0"
              strokeWidth="2.2"
            />

            {/* Reflet subtil sur chaque segment */}
            <path
              d={segmentPath(start + 1, end - 1)}
              fill="none"
              stroke="#fff4d2"
              strokeOpacity=".2"
              strokeWidth="1"
            />

            {/* Petit décor étoilé */}
            <text
              x={emojiPoint.x}
              y={emojiPoint.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="16"
              filter="url(#cw-text-shadow)"
            >
              {gift.emoji}
            </text>

            {/* Nom du cadeau */}
            <text
              x={labelPoint.x}
              y={labelPoint.y}
              transform={`rotate(${middle + 90}, ${labelPoint.x}, ${labelPoint.y})`}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff8df"
              fontSize="9.5"
              fontWeight="900"
              letterSpacing=".1"
              stroke="#4c1420"
              strokeWidth=".6"
              paintOrder="stroke"
              filter="url(#cw-text-shadow)"
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* Cercles de finition */}
      <circle
        cx={cx}
        cy={cy}
        r="176"
        fill="none"
        stroke="#fff0b8"
        strokeWidth="3"
      />
      <circle
        cx={cx}
        cy={cy}
        r="169"
        fill="none"
        stroke="#f4cf70"
        strokeWidth="1.5"
      />

      {/* Rivets dorés tout autour */}
      {Array.from({ length: 24 }, (_, i) => {
        const p = polar(182, i * 15);

        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4.4" fill="#754016" />
            <circle cx={p.x - 0.7} cy={p.y - 0.8} r="3.1" fill="#f4ce70" />
            <circle cx={p.x - 1.2} cy={p.y - 1.4} r="1.1" fill="#fff9df" />
          </g>
        );
      })}

      {/* Médaillon central */}
      <circle cx={cx} cy={cy} r="51" fill="#54231b" />
      <circle
        cx={cx}
        cy={cy}
        r="47"
        fill="url(#cw-gold)"
        stroke="#fff4c9"
        strokeWidth="2"
      />
      <circle
        cx={cx}
        cy={cy}
        r="41"
        fill="url(#cw-center)"
        stroke="#7e1b25"
        strokeWidth="2"
      />
      <circle
        cx={cx}
        cy={cy}
        r="35"
        fill="none"
        stroke="#f8dda0"
        strokeWidth="1.3"
        strokeDasharray="3 4"
      />

      <text x={cx} y="190" textAnchor="middle" fontSize="24">
        🎄
      </text>
      <text
        x={cx}
        y="211"
        textAnchor="middle"
        fill="#fff1c3"
        fontSize="10"
        fontWeight="900"
        letterSpacing="1.1"
      >
        NAVIDAD
      </text>
    </svg>
  );
}

function ChristmasSnow() {
  return (
    <div className="cw-snow" aria-hidden="true">
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37 + 11) % 100}%`,
            animationDelay: `${(i % 9) * -1.3}s`,
            animationDuration: `${7 + (i % 6)}s`,
            fontSize: `${8 + (i % 4) * 3}px`,
            opacity: 0.3 + (i % 5) * 0.12,
          }}
        >
          ❄
        </span>
      ))}
    </div>
  );
}

export default function ChristmasFortuneWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [remaining, setRemaining] = useState(3);
  const [results, setResults] = useState([]);
  const [latest, setLatest] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const spin = () => {
    if (spinning || remaining <= 0) return;

    setSpinning(true);
    setLatest(null);

    const count = GIFTS.length;
    const step = 360 / count;
    const index = Math.floor(Math.random() * count);

    // Aligne le centre du cadeau choisi avec la flèche fixe du haut.
    const target = ((360 - (index + 0.5) * step) % 360 + 360) % 360;
    const current = ((rotation % 360) + 360) % 360;
    const delta = (target - current + 360) % 360;
    const nextRotation = rotation + 360 * 7 + delta;

    setRotation(nextRotation);
    setRemaining((value) => value - 1);

    timeoutRef.current = setTimeout(() => {
      const prize = { ...GIFTS[index], id: Date.now() };

      setLatest(prize);
      setResults((previous) => [prize, ...previous]);
      setSpinning(false);
      timeoutRef.current = null;
    }, 5300);
  };

  const restart = () => {
    if (spinning) return;

    setRotation(0);
    setRemaining(3);
    setResults([]);
    setLatest(null);
  };

  return (
    <section className="cw-root max-w-full max-h-full">
      <style>{`
        .cw-root {
          --cw-red: #a91e30;
          --cw-dark-red: #681421;
          --cw-green: #124b32;
          --cw-gold: #f4d17d;
          position: relative;
          isolation: isolate;
          box-sizing: border-box;
          width: 100%;
          max-width: 100%;
          max-height: 100%;
          overflow: hidden;
          padding: clamp(14px, 3vw, 30px);
          border: 1px solid rgba(255, 225, 155, .5);
          border-radius: 28px;
          color: #fff5d9;
          background:
            radial-gradient(ellipse at 50% 15%, rgba(44, 111, 66, .72), transparent 48%),
            radial-gradient(ellipse at 50% 90%, rgba(124, 20, 36, .6), transparent 55%),
            linear-gradient(145deg, #092c20, #061b17 60%, #160d12);
          box-shadow: 0 18px 55px rgba(0, 0, 0, .35);
          font-family: Georgia, "Times New Roman", serif;
        }

        .cw-root *,
        .cw-root *::before,
        .cw-root *::after {
          box-sizing: border-box;
        }

        .cw-snow {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: -1;
        }

        .cw-snow span {
          position: absolute;
          top: -25px;
          color: #fff9e8;
          text-shadow: 0 0 9px rgba(255,255,255,.55);
          animation: cw-snow-fall linear infinite;
        }

        @keyframes cw-snow-fall {
          from { transform: translate3d(0, -20px, 0) rotate(0deg); }
          to { transform: translate3d(24px, 650px, 0) rotate(240deg); }
        }

        .cw-header {
          position: relative;
          text-align: center;
          margin: 0 auto 22px;
          max-width: 600px;
        }

        .cw-eyebrow {
          margin: 0 0 8px;
          color: #f7d98b;
          font: 800 11px/1.4 system-ui, sans-serif;
          letter-spacing: .24em;
          text-transform: uppercase;
        }

        .cw-title {
          margin: 0;
          color: #fff2c8;
          font-size: clamp(26px, 5vw, 43px);
          line-height: 1.08;
          font-weight: 900;
          text-shadow: 0 3px 0 #7a1b25, 0 6px 20px #0008;
        }

        .cw-subtitle {
          margin: 10px 0 0;
          color: #e8d7b3;
          font: 14px/1.6 system-ui, sans-serif;
        }

        .cw-main {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          align-items: center;
          justify-items: center;
          gap: 22px;
          width: 100%;
        }

        .cw-wheel-area {
          width: 100%;
          max-width: 470px;
          min-width: 0;
          margin: 0 auto;
          padding-top: 10px;
        }

        .cw-wheel-frame {
          position: relative;
          width: min(100%, 440px, 70vh);
          aspect-ratio: 1 / 1;
          margin: 0 auto;
          padding: clamp(6px, 1.7vw, 12px);
          border-radius: 50%;
          background: repeating-conic-gradient(
            from 0deg,
            #fff8e8 0deg 7deg,
            #c62c3b 7deg 14deg,
            #8c1628 14deg 17deg
          );
          border: 3px solid #f8dfa0;
          box-shadow:
            0 0 0 3px #7b2028,
            0 0 0 6px #d4a24d,
            0 12px 28px rgba(0, 0, 0, .48),
            inset 0 0 0 2px #fff3c7;
        }

        .cw-wheel-inner {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 50%;
          border: 3px solid #f5d78e;
          background: #a91e30;
          box-shadow: inset 0 0 0 3px #6e351d, inset 0 0 15px #0008;
        }

        .cw-disc {
          display: block;
          width: 100%;
          height: 100%;
          overflow: visible;
          transform-origin: 50% 50%;
          transition: transform 5.2s cubic-bezier(.12, .72, .12, 1);
          will-change: transform;
        }

        .cw-pointer {
          position: absolute;
          z-index: 5;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 19px solid transparent;
          border-right: 19px solid transparent;
          border-top: 39px solid #f8d778;
          filter: drop-shadow(0 3px 2px #0008);
        }

        .cw-pointer::after {
          content: "";
          position: absolute;
          top: -36px;
          left: -10px;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 22px solid #b51f30;
        }

        .cw-hint {
          text-align: center;
          margin: 18px 0 0;
          color: #ead7ac;
          font: 12px/1.5 system-ui, sans-serif;
        }

        .cw-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          gap: 14px;
          text-align: center;
        }

        .cw-chances {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          color: #ffeab1;
          font: 800 12px/1.4 system-ui, sans-serif;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .cw-heart {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 29px;
          height: 29px;
          border-radius: 50%;
          border: 1px solid #f4d17d;
          background: #7e1b2b;
          box-shadow: 0 3px 8px #0003;
          font-size: 14px;
        }

        .cw-heart.used {
          opacity: .35;
          filter: grayscale(1);
          background: #29231e;
        }

        .cw-spin {
          display: block;
          width: min(100%, 320px);
          min-height: 56px;
          margin: 0 auto;
          padding: 14px 22px;
          border: 2px solid #ffe6a0;
          border-radius: 999px;
          color: #fff5d5;
          background: linear-gradient(180deg, #d13a40 0%, #a91e30 55%, #741526 100%);
          box-shadow:
            inset 0 2px 0 rgba(255,255,255,.24),
            0 5px 0 #55121c,
            0 10px 18px rgba(0,0,0,.3);
          font: 900 14px/1.2 system-ui, sans-serif;
          letter-spacing: .09em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform .18s ease, filter .18s ease, opacity .18s ease;
        }

        .cw-spin:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.12);
        }

        .cw-spin:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow: inset 0 2px 0 rgba(255,255,255,.2), 0 2px 0 #55121c;
        }

        .cw-spin:disabled {
          opacity: .55;
          cursor: not-allowed;
          filter: grayscale(.25);
        }

        .cw-message {
          min-height: 26px;
          margin: 0;
          color: #f7e4b7;
          font: 13px/1.6 system-ui, sans-serif;
        }

        .cw-prize {
          width: min(100%, 390px);
          padding: 18px;
          border: 1px solid rgba(248, 219, 147, .72);
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(141, 28, 42, .92), rgba(71, 20, 27, .96));
          box-shadow: 0 10px 28px #0003, inset 0 1px 0 #fff2;
          animation: cw-reveal .45s ease both;
        }

        @keyframes cw-reveal {
          from { opacity: 0; transform: translateY(8px) scale(.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .cw-prize-kicker {
          margin: 0 0 8px;
          color: #f6d785;
          font: 800 10px/1.4 system-ui, sans-serif;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .cw-prize-emoji {
          margin: 0 0 7px;
          font-size: 34px;
        }

        .cw-prize-name {
          margin: 0;
          color: #fff3d0;
          font-size: clamp(20px, 4vw, 27px);
          line-height: 1.2;
          font-weight: 900;
          overflow-wrap: anywhere;
        }

        .cw-prize-note {
          margin: 9px 0 0;
          color: #ead7b1;
          font: 12px/1.6 system-ui, sans-serif;
        }

        .cw-history {
          width: min(100%, 390px);
          margin-top: 2px;
          text-align: left;
        }

        .cw-history-title {
          margin: 0 0 10px;
          color: #f7d98b;
          font: 800 11px/1.4 system-ui, sans-serif;
          letter-spacing: .16em;
          text-align: center;
          text-transform: uppercase;
        }

        .cw-history-list {
          display: grid;
          gap: 7px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .cw-history-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border: 1px solid rgba(244, 209, 125, .2);
          border-radius: 12px;
          background: rgba(255, 255, 255, .055);
          color: #fff0d0;
          font: 13px/1.4 system-ui, sans-serif;
        }

        .cw-history-item span:first-child {
          font-size: 18px;
        }

        .cw-restart {
          padding: 8px 14px;
          border: 1px solid rgba(244, 209, 125, .45);
          border-radius: 999px;
          background: rgba(255,255,255,.05);
          color: #f8e4b4;
          font: 12px/1.4 system-ui, sans-serif;
          cursor: pointer;
        }

        .cw-restart:disabled {
          opacity: .4;
          cursor: not-allowed;
        }

        .cw-footer {
          margin: 24px 0 0;
          color: #d8c49e;
          font: italic 12px/1.6 Georgia, serif;
          text-align: center;
        }

        @media (min-width: 900px) {
          .cw-main {
            grid-template-columns: minmax(0, 1.1fr) minmax(280px, .9fr);
            gap: clamp(22px, 4vw, 44px);
          }

          .cw-wheel-area {
            max-width: 500px;
          }

          .cw-wheel-frame {
            width: min(100%, 440px, 60vh);
          }
        }

        @media (max-width: 420px) {
          .cw-root {
            padding: 15px 10px;
            border-radius: 20px;
          }

          .cw-wheel-frame {
            width: min(100%, 70vh);
            padding: 6px;
          }

          .cw-wheel-inner {
            border-width: 2px;
          }

          .cw-pointer {
            border-left-width: 15px;
            border-right-width: 15px;
            border-top-width: 32px;
          }

          .cw-pointer::after {
            top: -30px;
            left: -8px;
            border-left-width: 8px;
            border-right-width: 8px;
            border-top-width: 19px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cw-snow span {
            animation: none;
          }

          .cw-disc {
            transition-duration: .01ms;
          }

          .cw-prize {
            animation: none;
          }
        }
      `}</style>

      <ChristmasSnow />

      <header className="cw-header">
        <p className="cw-eyebrow">✨ Una pequeña magia navideña ✨</p>
        <h2 className="cw-title">La ruleta de los regalos</h2>
        <p className="cw-subtitle">
          Gira la rueda y descubre tu sorpresa especial.
          <br />
          ¡Tienes tres oportunidades, mi amor! ❤️
        </p>
      </header>

      <div className="cw-main">
        <div className="cw-wheel-area">
          <div className="cw-wheel-frame max-w-full">
            <div className="cw-pointer" aria-hidden="true" />
            <div className="cw-wheel-inner">
              <ChristmasWheelDisc rotation={rotation} />
            </div>
          </div>

          <p className="cw-hint">
            🎄 Que la magia de la Navidad elija tu regalo 🎄
          </p>
        </div>

        <div className="cw-controls">
          <div className="cw-chances" aria-label={`${remaining} chances restantes`}>
            <span>Oportunidades</span>
            {Array.from({ length: 3 }, (_, i) => (
              <span
                key={i}
                className={`cw-heart ${i >= remaining ? "used" : ""}`}
                aria-hidden="true"
              >
                {i >= remaining ? "♡" : "❤️"}
              </span>
            ))}
          </div>

          <button
            type="button"
            className="cw-spin"
            onClick={spin}
            disabled={spinning || remaining <= 0}
          >
            {spinning
              ? "✨ Girando la magia..."
              : remaining > 0
                ? "🎁 Girar la ruleta"
                : "🎄 ¡Has usado tus 3 giros!"}
          </button>

          <p className="cw-message" aria-live="polite">
            {spinning
              ? "Los regalos están dando vueltas... ✨"
              : remaining === 0
                ? "¡Espero que te gusten tus sorpresas, mi amor! ❤️"
                : "Cada giro es una nueva sorpresa. 🍬"}
          </p>

          {latest && !spinning && (
            <div className="cw-prize" aria-live="polite">
              <p className="cw-prize-kicker">✨ Tu regalo navideño ✨</p>
              <p className="cw-prize-emoji">{latest.emoji}</p>
              <h3 className="cw-prize-name">{latest.name}</h3>
              <p className="cw-prize-note">
                Un pequeño regalo elegido con mucho amor para ti. ❤️
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="cw-history">
              <h3 className="cw-history-title">Tus regalos descubiertos</h3>
              <ul className="cw-history-list">
                {results.map((gift, i) => (
                  <li className="cw-history-item" key={gift.id}>
                    <span>{gift.emoji}</span>
                    <span>
                      <strong>Giro {results.length - i}:</strong> {gift.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {remaining === 0 && (
            <button
              type="button"
              className="cw-restart"
              onClick={restart}
              disabled={spinning}
            >
              ↻ Volver a empezar
            </button>
          )}
        </div>
      </div>

      <p className="cw-footer">
        Hecho con amor, un poquito de magia y mucho espíritu navideño. ❤️
      </p>
    </section>
  );
}
