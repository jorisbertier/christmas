
import React from "react";

export default function Aurora({
    className = "",
    speed = 1,
    intensity = "medium",
    fade = true,
    colors = [
        "#10b981",
        "#34d399",
        "#a7f3d0",
        "#22d3ee",
        "#0f766e",
    ],
}) {
    const opacity = {
        subtle: 0.25,
        medium: 0.45,
        strong: 0.7,
    }[intensity] ?? 0.45;

    return (
        <div
            aria-hidden="true"
            className={`absolute inset-0 h-[80%] overflow-hidden pointer-events-none ${className}`}
            style={{
                zIndex: 0,
                "--aurora-1": colors[0] || "#10b981",
                "--aurora-2": colors[1] || "#34d399",
                "--aurora-3": colors[2] || "#a7f3d0",
                "--aurora-4": colors[3] || "#22d3ee",
                "--aurora-5": colors[4] || "#0f766e",
                "--aurora-opacity": opacity,
                "--aurora-speed-1": `${18 / speed}s`,
                "--aurora-speed-2": `${27 / speed}s`,
            }}
        >
            <style>{`
                .aurora-light {
                    position: absolute;
                    top: -75%;
                    left: -35%;
                    width: 170%;
                    height: 150%;
                    pointer-events: none;
                    transform-origin: center top;
                    will-change: transform;
                }

                .aurora-light-one {
                    background: repeating-linear-gradient(
                        112deg,
                        transparent 0%,
                        transparent 5%,
                        var(--aurora-1) 7%,
                        var(--aurora-3) 9%,
                        transparent 13%,
                        transparent 17%,
                        var(--aurora-2) 19%,
                        transparent 23%
                    );

                    opacity: var(--aurora-opacity);
                    filter: saturate(1.3);
                    animation: aurora-drift-one var(--aurora-speed-1) ease-in-out infinite alternate;
                }

                .aurora-light-two {
                    top: -85%;
                    left: -45%;
                    width: 190%;
                    height: 160%;

                    background: repeating-linear-gradient(
                        105deg,
                        transparent 0%,
                        transparent 8%,
                        var(--aurora-4) 10%,
                        var(--aurora-2) 12%,
                        transparent 16%,
                        transparent 20%,
                        var(--aurora-5) 22%,
                        transparent 26%
                    );

                    opacity: calc(var(--aurora-opacity) * 0.75);
                    animation: aurora-drift-two var(--aurora-speed-2) ease-in-out infinite alternate;
                }

                .aurora-light-three {
                    position: absolute;
                    top: -15%;
                    left: -10%;
                    width: 120%;
                    height: 65%;

                    background: radial-gradient(
                        ellipse at 50% 0%,
                        var(--aurora-3) 0%,
                        var(--aurora-2) 18%,
                        transparent 70%
                    );

                    opacity: calc(var(--aurora-opacity) * 0.35);
                    filter: blur(35px);
                    animation: aurora-glow 14s ease-in-out infinite alternate;
                }

                .aurora-fade {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        to bottom,
                        transparent 0%,
                        transparent 35%,
                        rgba(27, 25, 71, 0.15) 65%,
                        rgba(27, 25, 71, 0.75) 100%
                    );
                    pointer-events: none;
                }

                @keyframes aurora-drift-one {
                    0% {
                        transform: translateX(-5%) rotate(-8deg) skewY(-8deg);
                    }
                    50% {
                        transform: translateX(3%) rotate(2deg) skewY(5deg);
                    }
                    100% {
                        transform: translateX(8%) rotate(8deg) skewY(-3deg);
                    }
                }

                @keyframes aurora-drift-two {
                    0% {
                        transform: translateX(7%) rotate(10deg) skewY(5deg);
                    }
                    50% {
                        transform: translateX(-4%) rotate(-3deg) skewY(-6deg);
                    }
                    100% {
                        transform: translateX(-9%) rotate(-10deg) skewY(4deg);
                    }
                }

                @keyframes aurora-glow {
                    from {
                        transform: translateX(-8%) scale(0.9);
                        opacity: 0.15;
                    }
                    to {
                        transform: translateX(8%) scale(1.2);
                        opacity: 0.4;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .aurora-light,
                    .aurora-light-three {
                        animation: none;
                    }
                }
            `}</style>

            <div className="aurora-light aurora-light-one" />
            <div className="aurora-light aurora-light-two" />
            <div className="aurora-light-three" />

            {fade && <div className="aurora-fade" />}
        </div>
    );
}
