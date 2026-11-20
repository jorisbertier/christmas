import { useMemo } from "react";

export default function Snow({ count = 40, className = "" }) {
    const flakes = useMemo(
        () =>
        Array.from({ length: count }, () => {
            const size = Math.random() * 4 + 2;
            return {
            left: Math.random() * 100,
            size,
            duration: Math.random() * 8 + 8,      // plus lent = plus doux
            delay: -Math.random() * 16,            // négatif = déjà en cours au chargement
            drift: (Math.random() - 0.5) * 60,     // dérive gauche/droite en px
            opacity: Math.random() * 0.5 + 0.4,
            blur: size > 4 ? 1 : 0,
            };
        }),
        [count]
    );

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <style>{`
            @keyframes snow-fall {
            from { transform: translate3d(0, -5vh, 0); }
            to   { transform: translate3d(var(--drift), 105vh, 0); }
            }
        `}</style>

        {flakes.map((f, i) => (
            <div
            key={i}
            className="absolute top-0 rounded-full bg-white will-change-transform"
            style={{
                left: `${f.left}%`,
                width: f.size,
                height: f.size,
                opacity: f.opacity,
                filter: f.blur ? "blur(1px)" : undefined,
                "--drift": `${f.drift}px`,
                animation: `snow-fall ${f.duration}s linear ${f.delay}s infinite`,
            }}
            />
        ))}
        </div>
    );
}