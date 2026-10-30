
import React, { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";

const SANTA_URL =
  "https://lottie.host/05ac8248-0bce-4b7c-a9b2-c7d73a9c2ea3/nzJJ4vOXoC.json";

export default function SantaCrossing({
  delay = 0,
  duration = 15000,
  width = 180,
  bottom = 20,
}) {
  const containerRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started || !containerRef.current) return;

    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: SANTA_URL,
    });

    return () => animation.destroy();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const timer = setTimeout(() => setFinished(true), duration);
    return () => clearTimeout(timer);
  }, [started, duration]);

  if (finished) return null;

  return (
    <div
      className="pointer-events-none top-0 fixed left-0 z-[9999] w-full overflow-visible"
    >
      {started && (
        <div
          className="santa-crossing-animation absolute left-0"
          style={{
            width,
            height: width,
            animationDuration: `${duration}ms`,
          }}
        >
          <div ref={containerRef} className="h-full w-full" />
        </div>
      )}

      <style>{`
        .santa-crossing-animation {
          animation: santa-village-crossing linear forwards;
        }

        @keyframes santa-village-crossing {
          from { transform: translateX(-100%); }
          to { transform: translateX(calc(100vw + 100%)); }
        }
      `}</style>
    </div>
  );
}
