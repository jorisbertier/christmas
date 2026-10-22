import React, { useMemo, useState } from "react";

import maria from '../../assets/album/maria.jpg';
import vikingcholita from '../../assets/album/viking&cholita.jpg';
import simpsons from '../../assets/album/simpson.jpg';
import disney from '../../assets/album/disney.jpg';
import rickmorty from '../../assets/album/rick&morty.jpg';

const BEFORE_PHOTOS = [
  { id: "him-child", src: null /* himChild */, caption: "Yo, de pequeño" },
  { id: "her-child", src: maria /* herChild */, caption: "Tú, de pequeña" },
];

const TODAY_PHOTOS = [
  { id: "him-today", src: null /* himToday */, caption: "Yo, hoy" },
  { id: "her-today", src: null /* herToday */, caption: "Tú, hoy" },
];

// The 4 mystery cards (front = "?", back = the photo)
const FLIP_CARDS = [
  { id: "simpsons", src: simpsons, caption: "Versión Los Simpson" },
  { id: "pixar", src: disney, caption: "Versión Pixar" },
  { id: "lego", src: vikingcholita, caption: "Versión Lego" },
  { id: "anime", src: rickmorty, caption: "Versión anime" },
];

/* ------------------------------------------------------------------ */
/*  2. TEXTS (Spanish)                                                 */
/* ------------------------------------------------------------------ */

const TEXTS = {
    title: "Nuestro álbum de Navidad",
    subtitle: "Un pequeño viaje por nuestra historia",
    before: "Cómo éramos antes",
    today: "Cómo somos hoy",
    mystery: "Y ahora… ¡cuatro sorpresas!",
    hint: "Toca cada regalo para darle la vuelta",
    placeholder: "Tu foto aquí",
    counter: (n, total) => `${n} de ${total} descubiertas`,
    done: "¡Las has descubierto todas! Feliz Navidad 🎄",
};

/* ------------------------------------------------------------------ */
/*  3. STYLES                                                          */
/* ------------------------------------------------------------------ */

const CSS = `
@keyframes album-fall {
    0%   { transform: translateY(-10px) translateX(0); }
    50%  { transform: translateY(50vh) translateX(12px); }
    100% { transform: translateY(105vh) translateX(-6px); }
}
@keyframes album-twinkle {
    0%, 100% { opacity: 1; filter: drop-shadow(0 0 5px currentColor); }
    50%      { opacity: .35; filter: drop-shadow(0 0 1px currentColor); }
}
@keyframes album-tease {
    0%, 86%, 100% { transform: rotate(0) scale(1); }
    90% { transform: rotate(-3deg) scale(1.03); }
    94% { transform: rotate(3deg) scale(1.03); }
    98% { transform: rotate(-1.5deg); }
}
@keyframes album-pop {
    0%   { opacity: 0; transform: translateY(14px) scale(.9); }
    100% { opacity: 1; transform: none; }
}
@keyframes album-shimmer {
    0%   { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
}

.album-flip { perspective: 1100px; }
.album-flip-inner {
    position: relative; width: 100%; height: 100%;
    transform-style: preserve-3d;
    transition: transform .85s cubic-bezier(.2,.8,.2,1);
}
.album-flip[data-flipped="true"] .album-flip-inner { transform: rotateY(180deg); }
.album-face {
    position: absolute; inset: 0;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    border-radius: 14px; overflow: hidden;
}
.album-back { transform: rotateY(180deg); }
.album-tease { animation: album-tease 6s ease-in-out infinite; }
.album-flip[data-flipped="true"] .album-tease { animation: none; }

.album-wrap {
    background-image:
        radial-gradient(circle at 20% 25%, rgba(255,255,255,.2) 0 1.4px, transparent 2.4px),
        radial-gradient(circle at 70% 72%, rgba(253,230,138,.28) 0 1.1px, transparent 2.1px),
        linear-gradient(155deg, #d02432, #7a0f1a);
    background-size: 20px 20px, 20px 20px, 100% 100%;
}

@media (prefers-reduced-motion: reduce) {
    .album-flip-inner { transition-duration: .01s; }
    .album-tease, .album-flake, .album-bulb { animation: none !important; }
}
`;

/* ------------------------------------------------------------------ */
/*  4. SMALL DECORATIVE PIECES                                         */
/* ------------------------------------------------------------------ */

// Deterministic pseudo random so the snow does not jump on every render
function seeded(seed) {
    let s = seed;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
    }

    function Snow() {
    const flakes = useMemo(() => {
        const rand = seeded(42);
        return Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: rand() * 100,
        top: rand() * 100,
        size: rand() * 4 + 2,
        duration: rand() * 6 + 8,
        delay: -rand() * 12,
        }));
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {flakes.map((f) => (
            <span
            key={f.id}
            className="album-flake absolute rounded-full bg-white/80"
            style={{
                left: `${f.left}%`,
                top: `${f.top}%`,
                width: f.size,
                height: f.size,
                animation: `album-fall ${f.duration}s linear ${f.delay}s infinite`,
            }}
            />
        ))}
        </div>
    );
}

const BULB_COLORS = ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc"];

function Garland() {
    const bulbs = useMemo(() => {
        const out = [];
        const arcs = 6; // each arc is 200 units wide
        for (let a = 0; a < arcs; a++) {
        [0.2, 0.5, 0.8].forEach((t) => {
            out.push({
            x: a * 200 + t * 200,
            y: 8 + 72 * t * (1 - t) * 0.5 + 6,
            });
        });
        }
        return out;
    }, []);

    return (
        <svg
        viewBox="0 0 1200 70"
        className="pointer-events-none mx-auto block w-full max-w-[1200px]"
        aria-hidden="true"
        >
        <path
            d="M0 8 Q100 44 200 8 T400 8 T600 8 T800 8 T1000 8 T1200 8"
            fill="none"
            stroke="#1a3a2b"
            strokeWidth="3"
        />
        {bulbs.map((b, i) => (
            <g key={i}>
            <rect x={b.x - 2} y={b.y - 8} width="4" height="7" fill="#c9a24a" />
            <ellipse
                className="album-bulb"
                cx={b.x}
                cy={b.y + 6}
                rx="6"
                ry="8.5"
                fill={BULB_COLORS[i % BULB_COLORS.length]}
                style={{
                color: BULB_COLORS[i % BULB_COLORS.length],
                animation: `album-twinkle ${2 + (i % 4) * 0.6}s ease-in-out ${(i % 5) * 0.4}s infinite`,
                }}
            />
            <ellipse cx={b.x - 2} cy={b.y + 3} rx="1.6" ry="2.6" fill="#fff" opacity=".6" />
            </g>
        ))}
        </svg>
    );
    }

function SectionTitle({ children }) {
    return (
        <div className="mb-8 flex items-center justify-center gap-4">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-300/70 sm:w-24" />
        <h2 className="text-center font-serif text-2xl italic text-amber-100 sm:text-3xl">{children}</h2>
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-300/70 sm:w-24" />
        </div>
    );
}

// Little snow cap drawn on top of a frame
function SnowCap() {
    return (
        <svg
        viewBox="0 0 100 14"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -top-[9px] left-[-2%] z-20 h-[14px] w-[104%]"
        aria-hidden="true"
        >
        <path
            d="M0 14 V8 Q4 0 10 6 Q16 -2 24 6 Q30 0 38 7 Q46 -3 54 6 Q62 0 70 7 Q78 -2 86 6 Q94 0 100 8 V14Z"
            fill="#fff"
        />
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/*  5. POLAROID (before / today)                                       */
/* ------------------------------------------------------------------ */

function Placeholder() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#b3202a] via-[#7a0f1a] to-[#14543a] text-amber-100">
        <span className="text-4xl" aria-hidden="true">🎄</span>
        <span className="font-serif text-sm italic opacity-90">{TEXTS.placeholder}</span>
        </div>
    );
    }

    function Polaroid({ photo, tilt, delay }) {
    return (
        <figure
        className="relative mx-auto w-full max-w-[280px] transition-transform duration-300 hover:z-10 hover:-translate-y-1 hover:rotate-0"
        style={{ transform: `rotate(${tilt}deg)`, animation: `album-pop .7s ease-out ${delay}s both` }}
        >
        <SnowCap />
        {/* gold tape */}
        <span className="absolute -top-2 left-4 z-30 h-5 w-14 -rotate-6 rounded-[2px] bg-amber-300/70 shadow-sm" />
        <span className="absolute -top-2 right-4 z-30 h-5 w-14 rotate-6 rounded-[2px] bg-amber-300/70 shadow-sm" />

        <div className="rounded-[6px] bg-[#fff8ec] p-3 pb-4 shadow-[0_14px_30px_rgba(0,0,0,0.5)]">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-slate-800 ring-1 ring-black/20">
            {photo.src ? (
                <img src={photo.src} alt={photo.caption} className="h-full w-full object-cover" draggable={false} />
            ) : (
                <Placeholder />
            )}
            </div>
            <figcaption className="mt-3 text-center font-serif text-lg italic text-[#7a0f1a]">
            {photo.caption}
            </figcaption>
        </div>
        </figure>
    );
}

function PhotoPair({ title, photos }) {
    return (
        <section className="mx-auto w-full max-w-[640px]">
        <SectionTitle>{title}</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:gap-10">
            {photos.map((p, i) => (
            <Polaroid key={p.id} photo={p} tilt={i % 2 === 0 ? -3 : 2.5} delay={i * 0.15} />
            ))}
        </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  6. FLIP CARD ("?" gift wrap → photo)                               */
/* ------------------------------------------------------------------ */

function FlipCard({ card, index, flipped, onFlip }) {
    return (
        <div
        className="album-flip aspect-[3/4] w-full"
        data-flipped={flipped}
        style={{ animation: `album-pop .7s ease-out ${index * 0.12}s both` }}
        >
        <button
            type="button"
            onClick={() => onFlip(card.id)}
            aria-pressed={flipped}
            aria-label={flipped ? card.caption : `Dar la vuelta a la sorpresa número ${index + 1}`}
            className="album-tease block h-full w-full rounded-[14px] text-left outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-amber-300"
            style={{ animationDelay: `${index * 0.7}s` }}
        >
            <span className="album-flip-inner block shadow-[0_14px_28px_rgba(0,0,0,0.5)]" style={{ borderRadius: 14 }}>
            {/* FRONT: wrapped gift with a "?" */}
            <span className="album-face album-wrap block border border-amber-200/40">
                <span className="absolute inset-y-0 left-1/2 w-[16%] -translate-x-1/2 bg-gradient-to-r from-[#9a6a1c] via-[#fff0a8] to-[#9a6a1c]" />
                <span className="absolute inset-x-0 top-1/2 h-[12%] -translate-y-1/2 bg-gradient-to-b from-[#9a6a1c] via-[#fff0a8] to-[#9a6a1c]" />
                <span className="absolute inset-2 rounded-[10px] border border-dashed border-amber-100/40" />
                <span className="absolute left-1/2 top-1/2 flex h-[34%] w-[45%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#8a5a12] bg-gradient-to-br from-[#fff3bf] via-[#e8b84a] to-[#b9822a] shadow-[0_4px_10px_rgba(0,0,0,0.45)]">
                <span className="font-serif text-4xl font-bold text-[#7a0f1a] sm:text-5xl">?</span>
                </span>
            </span>

            {/* BACK: the photo in a gold frame */}
            <span className="album-face album-back block bg-gradient-to-br from-[#fff3bf] via-[#e8b84a] to-[#b9822a] p-2">
                <span className="flex h-full w-full flex-col overflow-hidden rounded-[8px] bg-[#fff8ec]">
                <span className="relative block flex-1 overflow-hidden">
                    {card.src ? (
                    <img src={card.src} alt={card.caption} className="h-full w-full object-cover" draggable={false} />
                    ) : (
                    <Placeholder />
                    )}
                </span>
                <span className="block px-2 py-2 text-center font-serif text-sm italic text-[#7a0f1a] sm:text-base">
                    {card.caption}
                </span>
                </span>
            </span>
            </span>
        </button>
        </div>
    );
    }

    function MysteryCards() {
    const [flipped, setFlipped] = useState({});
    const count = Object.values(flipped).filter(Boolean).length;
    const allDone = count === FLIP_CARDS.length;

    const toggle = (id) => setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));

    return (
        <section className="mx-auto w-full max-w-[900px]">
        <SectionTitle>{TEXTS.mystery}</SectionTitle>
        <p className="-mt-4 mb-8 text-center font-serif text-base text-amber-200/80">{TEXTS.hint}</p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {FLIP_CARDS.map((card, i) => (
            <FlipCard key={card.id} card={card} index={i} flipped={!!flipped[card.id]} onFlip={toggle} />
            ))}
        </div>

        <p className="mt-6 text-center font-serif text-sm text-amber-200/70" aria-live="polite">
            {TEXTS.counter(count, FLIP_CARDS.length)}
        </p>

        {allDone && (
            <p
            className="mt-4 bg-clip-text text-center font-serif text-2xl italic text-transparent"
            style={{
                backgroundImage: "linear-gradient(90deg,#fff3bf,#e8b84a,#fff3bf,#e8b84a)",
                backgroundSize: "200% 100%",
                animation: "album-pop .7s ease-out both, album-shimmer 3s linear infinite",
            }}
            >
            {TEXTS.done}
            </p>
        )}
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  7. PAGE                                                            */
/* ------------------------------------------------------------------ */

export default function ChristmasAlbum() {
    return (
        <div
        className="relative min-h-screen overflow-hidden pb-24 text-amber-50"
        style={{
            background:
            "radial-gradient(120% 70% at 50% 0%, #12394a 0%, #0a2230 45%, #071923 100%)",
        }}
        >
        <style>{CSS}</style>
        <Snow />

        <div className="relative z-10">
            <Garland />

            <header className="mx-auto mt-4 max-w-[640px] px-4 text-center">
            <h1 className="font-serif text-3xl italic text-amber-100 sm:text-5xl">{TEXTS.title}</h1>
            <p className="mt-2 font-serif text-base text-amber-200/80 sm:text-lg">{TEXTS.subtitle}</p>
            </header>

            <main className="mt-14 flex flex-col gap-20 px-4">
            <PhotoPair title={TEXTS.before} photos={BEFORE_PHOTOS} />
            <PhotoPair title={TEXTS.today} photos={TODAY_PHOTOS} />
            <MysteryCards />
            </main>
        </div>
        </div>
    );
}