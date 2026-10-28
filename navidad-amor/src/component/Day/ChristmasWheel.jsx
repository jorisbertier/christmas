
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


const COLORS = [
  "#a7192d", "#67bca9", "#a7192d", "#67bca9",
  "#a7192d", "#67bca9", "#a7192d", "#67bca9",
  "#a7192d", "#67bca9", "#a7192d", "#67bca9",
];


function pointOnCircle(cx, cy, r, angle) {
  const rad = (angle * Math.PI) / 180;

  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function WheelSegment({ index, total, label }) {
  const step = 360 / total;
  const start = -90 + index * step;
  const end = start + step;

  const p1 = pointOnCircle(200, 200, 176, start);
  const p2 = pointOnCircle(200, 200, 176, end);
  const mid = start + step / 2;
  const textPoint = pointOnCircle(200, 200, 119, mid);
  const snowPoint = pointOnCircle(200, 200, 153, mid);

  const shortLabel =
    label.length > 17 ? `${label.slice(0, 15)}…` : label;

  return (
    <g>
      <path
        d={`M 200 200 L ${p1.x} ${p1.y} A 176 176 0 0 1 ${p2.x} ${p2.y} Z`}
        fill={COLORS[index % COLORS.length]}
        stroke="#fff8df"
        strokeWidth="2.5"
      />

      {/* Légère brillance des parts */}
      <path
        d={`M 200 200 L ${p1.x} ${p1.y} A 176 176 0 0 1 ${p2.x} ${p2.y} Z`}
        fill="none"
        stroke="#fff8df"
        strokeOpacity=".18"
        strokeWidth="1"
      />

      {/* Nom du cadeau */}
      <text
        x={textPoint.x}
        y={textPoint.y}
        transform={`rotate(${mid + 90}, ${textPoint.x}, ${textPoint.y})`}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff8df"
        fontSize="11"
        fontWeight="900"
        stroke="#6d1520"
        strokeWidth=".35"
        paintOrder="stroke"
      >
        {shortLabel}
      </text>

      {/* Flocon décoratif */}
      <text
        x={snowPoint.x}
        y={snowPoint.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill="#fff8df"
        opacity=".9"
      >
        ❄
      </text>
    </g>
  );
}

function ChristmasWheel({ rotation }) {
  return (
    <div className="relative aspect-square w-full max-w-full">
      {/* Bordure rayée façon sucre d'orge */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "repeating-conic-gradient(#fff8e7 0deg 8deg, #bd2032 8deg 16deg)",
          boxShadow:
            "0 0 0 4px #f9e7b2, 0 8px 0 #751521, 0 14px 25px #0008",
        }}
      />

      {/* Anneau intérieur crème */}
      <div className="absolute inset-[3.5%] rounded-full bg-[#fff6df] shadow-inner" />

      {/* Disque tournant */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-[5%] h-[90%] w-[90%]"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "transform 5.2s cubic-bezier(.12,.72,.08,1)",
          transformOrigin: "center",
          overflow: "visible",
        }}
        role="img"
        aria-label="Ruleta de Navidad"
      >
        <defs>
          <radialGradient id="wheel-face">
            <stop offset="0%" stopColor="#fff8df" />
            <stop offset="100%" stopColor="#e9cc8e" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="180" fill="url(#wheel-face)" />

        {GIFTS.map((gift, i) => (
          <WheelSegment
            key={gift.name}
            index={i}
            total={GIFTS.length}
            label={`${gift.name} ${gift.emoji}`}
          />
        ))}

        {/* Bordure dorée */}
        <circle
          cx="200"
          cy="200"
          r="179"
          fill="none"
          stroke="#fff8df"
          strokeWidth="5"
        />

        <circle
          cx="200"
          cy="200"
          r="174"
          fill="none"
          stroke="#e4bd70"
          strokeWidth="1.5"
        />

        {/* Rivets autour de la roue */}
        {Array.from({ length: 24 }, (_, i) => {
          const p = pointOnCircle(200, 200, 181, i * 15 - 90);

          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="3.2"
                fill={i % 2 ? "#b51f30" : "#fff9e8"}
                stroke="#e6bd70"
                strokeWidth="1"
              />
            </g>
          );
        })}
      </svg>

      {/* Centre décoratif fixe */}
      <div
        className="absolute left-1/2 top-1/2 flex aspect-square w-[23%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-[4px] border-[#f4d99b] text-center"
        style={{
          background:
            "radial-gradient(circle at 35% 25%, #fff5d8, #e8c782 70%, #ad742f)",
          boxShadow: "0 0 0 4px #a7192d, 0 3px 9px #0006",
        }}
      >
        <span className="text-[clamp(8px,2vw,14px)]">🎄</span>

        <span className="font-serif text-[clamp(7px,1.6vw,12px)] font-black leading-tight text-[#a7192d]">
          MERRY
          <br />
          CHRISTMAS
        </span>

        <span className="text-[clamp(8px,2vw,13px)]">🎁</span>
      </div>

      {/* Flèche fixe en haut */}
      <div
        className="absolute left-1/2 top-[-2%] z-20 -translate-x-1/2"
        style={{ filter: "drop-shadow(0 3px 2px #541019)" }}
      >
        <svg viewBox="0 0 48 60" className="h-auto w-[clamp(25px,8%,42px)]">
          <path
            d="M24 58 L3 14 Q0 5 10 5 H38 Q48 5 45 14 Z"
            fill="#b51f30"
            stroke="#ffe6a3"
            strokeWidth="3"
          />

          <path d="M24 48 L12 16 H36 Z" fill="#f7d58c" />

          <circle cx="24" cy="13" r="5" fill="#fff6df" />
        </svg>
      </div>
    </div>
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
              <ChristmasWheel rotation={rotation} />
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

