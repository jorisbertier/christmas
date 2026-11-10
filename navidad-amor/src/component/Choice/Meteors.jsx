
import React from "react";

export default function Meteors({
    count = 35,
    className = "",
    meteorColor = "#fff8dc",
    tailColor = "rgba(191, 219, 254, 0.8)",
    speed = 1,
}) {
    const meteors = Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 13) % 100}%`,
        delay: `${-((i * 1.7) % 10)}s`,
        duration: `${(4 + ((i * 7) % 6)) / speed}s`,
        height: `${60 + ((i * 19) % 80)}px`,
    }));

    return (
        <div
            aria-hidden="true"
            className={`absolute h-[70%] inset-0 overflow-hidden pointer-events-none ${className}`}
            style={{
                zIndex: 0,
                "--meteor-color": meteorColor,
                "--meteor-tail": tailColor,
            }}
        >
            <style>{`
                @keyframes meteor-fall {
                    0% {
                        transform: translate3d(0, 0, 0) rotate(215deg);
                        opacity: 0;
                    }

                    10% {
                        opacity: 1;
                    }

                    70% {
                        opacity: 0.9;
                    }

                    100% {
                        transform: translate3d(-350px, 110vh, 0) rotate(215deg);
                        opacity: 0;
                    }
                }

                .meteor-particle {
                    position: absolute;
                    display: block;
                    top: -180px;
                    width: 2px;
                    border-radius: 999px;
                    background: linear-gradient(
                        to bottom,
                        var(--meteor-color) 0%,
                        var(--meteor-tail) 50%,
                        transparent 100%
                    );
                    opacity: 0;
                    animation-name: meteor-fall;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    will-change: transform, opacity;
                }

                @media (prefers-reduced-motion: reduce) {
                    .meteor-particle {
                        animation: none;
                        display: none;
                    }
                }
            `}</style>

            {meteors.map((meteor) => (
                <span
                    key={meteor.id}
                    className="meteor-particle"
                    style={{
                        left: meteor.left,
                        height: meteor.height,
                        animationDelay: meteor.delay,
                        animationDuration: meteor.duration,
                    }}
                />
            ))}
        </div>
    );
}
