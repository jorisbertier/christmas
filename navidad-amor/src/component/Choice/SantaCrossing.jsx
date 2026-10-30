
import React, { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";

export default function SantaCrossing({
  animationData,
  delay = 10000,
  duration = 15000,
  width = 180,
  bottom = 20,
}) {
  const lottieRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleEnd = () => {
    setFinished(true);
    lottieRef.current?.pause();
  };

  if (finished) return null;

  return (
    <div
      className="pointer-events-none absolute left-0 z-50 w-full overflow-visible"
      style={{ bottom }}
    >
      {started && (
        <div
          className="santa-crossing-animation absolute left-0"
          onAnimationEnd={handleEnd}
          style={{
            width,
            height: width,
            animationDuration: `${duration}ms`,
          }}
        >
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            autoplay
            loop
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      )}

      <style>{`
        .santa-crossing-animation {
          animation-name: santa-village-crossing;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }

        @keyframes santa-village-crossing {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(calc(100vw + 100%));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .santa-crossing-animation {
            animation-duration: 1ms !important;
          }
        }
      `}</style>
    </div>
  );
}
