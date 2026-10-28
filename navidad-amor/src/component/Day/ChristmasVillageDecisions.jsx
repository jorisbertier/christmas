
import React, { useEffect, useState } from "react";
import aurora from "../../assets/choice/11.png";
import star from "../../assets/choice/12.png";
import background from "../../assets/BG/bgChristmasDecisions.jpg";
import ball from "../../assets/ball.png";

const KEY = "navidad_pueblo_decision_";

const decisions = [
    {
        title: "El cielo mágico de Navidad",
        subtitle: "Una noche llena de maravillas",
        story:
        "Una extraña magia ilumina el cielo del pueblo. Una aurora boreal comienza a bailar sobre los tejados, mientras cientos de estrellas fugaces atraviesan la noche. Los habitantes solo pueden elegir un espectáculo para la gran celebración navideña. ¿Qué maravilla iluminará su Navidad?",
        options: [
        {
            id: "11",
            icon: "🏠",
            // image : aurora,
            title: "Una aurora boreal",
            text: "Invitar a todos a contemplar un río de luces verdes - azules que cubrirá el cielo del pueblo.",
            result: "El pueblo se llena de colores mágicos. Las luces de la aurora despiertan un sentimiento de paz y unión entre los habitantes.",
            color: "red",
        },
        {
            id: "12",
            icon: "🎄",
            // image: star,
            title: "Una lluvia de estrellas",
            text: "Organizar una noche bajo miles de estrellas fugaces. Cada habitante podrá pedir un deseo para la Navidad.",
            result: "El cielo se llena de estrellas brillantes. Los habitantes comparten sus deseos y nace una nueva tradición navideña llena de esperanza.",
            color: "gold",
        },
        ],
    },
    {
        title: "Los dos árboles de Navidad",
        subtitle: "¿Cuál iluminará la plaza del pueblo?",
        story:
            "La plaza está lista para recibir su gran árbol de Navidad, pero hay dos opciones maravillosas. Uno está cubierto de nieve blanca, como si acabara de llegar de un bosque encantado. El otro luce sus ramas verdes, adornadas con brillantes luces y elegantes decoraciones navideñas. ¡Ha llegado el momento de elegir el árbol que llenará el pueblo de magia!",
        options: [
            {
                id: "21",
                icon: "❄️",
                title: "El árbol nevado",
                text: "Elegir un majestuoso abeto cubierto de nieve, decorado con luces cálidas, bolas brillantes y adornos navideños.",
                result:
                    "La plaza se transforma en un paisaje de cuento de hadas. El árbol nevado brilla bajo las luces y crea una atmósfera mágica de Navidad invernal.",
                color: "blue",
            },
            {
                id: "22",
                icon: "🎄",
                title: "El árbol tradicional",
                text: "Elegir un frondoso abeto verde, adornado con guirnaldas luminosas, bolas rojas y doradas y preciosos ornamentos.",
                result:
                    "La plaza se llena de los colores clásicos de la Navidad. El árbol resplandece con sus adornos y transmite una sensación cálida, alegre y acogedora.",
                color: "red",
            },
        ],
    },
    {
        title: "La magia de la plaza",
        subtitle: "Dos atracciones, un solo deseo",
        story:
            "La plaza del pueblo está llena de luces y decoraciones navideñas. Este año, quieres ofrecer a todos los habitantes una atracción especial para disfrutar de las noches de invierno. Hay dos opciones maravillosas: una pista de hielo donde todos podrán deslizarse bajo las estrellas, o un carrusel mágico que girará entre luces doradas y melodías navideñas. ¡Es hora de elegir!",
        options: [
            {
                id: "31",
                icon: "⛸️",
                title: "La pista de hielo",
                text: "Construir una hermosa pista de hielo en la plaza, decorada con guirnaldas luminosas donde pequeños y mayores podrán patinar juntos.",
                result:
                    "La plaza se llena de risas y alegría. Los habitantes patinan de la mano bajo las luces navideñas, mientras la nieve cae suavemente a su alrededor.",
                color: "gold",
            },
            {
                id: "32",
                icon: "🎠",
                title: "El carrusel mágico",
                text: "Instalar un elegante carrusel navideño con caballos decorados en rojo y dorado, luces brillantes y una dulce melodía festiva.",
                result:
                    "El carrusel comienza a girar entre destellos dorados. Los niños sonríen, la música llena la plaza y el pueblo adquiere el encanto de un cuento de Navidad.",
                color: "red",
            },
        ],
    },
    {
        title: "Los dulces secretos de Navidad",
        subtitle: "Un aroma delicioso invade el pueblo",
        story:
            "En el corazón del pueblo, los duendes de Papá Noel preparan una sorpresa para la Navidad. Han recibido ingredientes mágicos capaces de llenar las calles de aromas irresistibles. Pero solo tienen tiempo para abrir uno de sus talleres especiales: un taller de galletas navideñas donde todos podrán decorar sus propias creaciones, o una fábrica de chocolate donde fuentes de chocolate caliente y dulces mágicos cobrarán vida. ¿Qué delicia elegirá el pueblo?",
        options: [
            {
                id: "41",
                icon: "🍪",
                title: "El taller de galletas",
                text: "Abrir un acogedor taller donde los duendes preparan galletas con forma de estrellas, renos y corazones, decoradas con glaseado de colores.",
                result:
                    "El taller se llena de risas y aromas a canela y vainilla. Grandes y pequeños decoran sus propias galletas navideñas, y las ventanas se iluminan con pequeñas estrellas de azúcar. ¡El pueblo descubre una nueva tradición deliciosa!",
                color: "gold",
            },
            {
                id: "32",
                icon: "🍫",
                title: "La fábrica de chocolate",
                text: "Construir una fantástica chocolatería con fuentes de chocolate caliente, montañas de bombones y caramelos que parecen no acabarse nunca.",
                result:
                    "¡La magia del chocolate se apodera del pueblo! Los duendes trabajan entre fuentes de chocolate brillante y montañas de bombones. Un dulce aroma recorre las calles y todos se reúnen para disfrutar de una Navidad irresistible.",
                color: "red",
            },
        ],
    },

    {
        title: "La noche de Navidad",
        subtitle: "Tu última gran decisión",
        story:
        "Llega Nochebuena. Solo queda presupuesto para una última iniciativa que marcará el futuro de la comunidad.",
        options: [
        {
            id: "51",
            icon: "✨",
            title: "Una fiesta inolvidable",
            text: "Regalar al pueblo una noche de música, luces y alegría.",
            result: "Todos vivirán una celebración extraordinaria que recordarán durante años.",
            color: "red",
        },
        {
            id: "52",
            icon: "🎁",
            title: "Un regalo para el futuro",
            text: "Crear una reserva para ayudar al pueblo durante el próximo invierno.",
            result: "La fiesta será sencilla, pero el futuro de la comunidad será más seguro.",
            color: "gold",
        },
        ],
    },
];

const ornamentPositions = [
    ["0%", "-2%", "rotate-[-18deg]"],
    ["78%", "-2%", "rotate-[18deg]"],
    // ["3%", "77%", "rotate-[14deg]"],
    // ["92%", "72%", "rotate-[-15deg]"],
];

function Bauble({ className = "" }) {
    return (
        // <svg
        // viewBox="0 0 44 62"
        // className={className}
        // fill="none"
        // aria-hidden="true"
        // >
        // <path d="M17 12V7a5 5 0 0 1 10 0v5" stroke="#f8dda0" strokeWidth="2" />
        // <path d="M15 12h14l-2 6H17z" fill="#d8ab54" stroke="#fff0b7" />
        // <circle cx="22" cy="37" r="18" fill="url(#luxRed)" stroke="#f4d28b" />
        // <ellipse cx="15" cy="29" rx="4" ry="7" fill="#fff5db" opacity=".72" />
        // <path d="M8 40q14 17 28-1" stroke="#ffb8a7" strokeWidth="1.2" />
        // <defs>
        //     <radialGradient id="luxRed" cx="28%" cy="20%" r="85%">
        //     <stop stopColor="#ff9b89" />
        //     <stop offset=".3" stopColor="#d72b40" />
        //     <stop offset=".75" stopColor="#870d26" />
        //     <stop offset="1" stopColor="#410817" />
        //     </radialGradient>
        // </defs>
        // </svg>
        <img src={ball}/>
    );
}

function PineBranch({ className = "" }) {
    return (
        <svg
        viewBox="0 0 180 90"
        className={className}
        fill="none"
        aria-hidden="true"
        >
        <path d="M8 77Q70 35 166 9" stroke="#9d6c34" strokeWidth="4" />
        {Array.from({ length: 11 }, (_, i) => {
            const x = 16 + i * 14;
            const y = 73 - i * 5.6;
            return (
            <g key={i} strokeLinecap="round">
                <path
                d={`M${x} ${y} l-13 -18 M${x} ${y} l-19 -8 M${x} ${y} l-5 13`}
                stroke="#0e5739"
                strokeWidth="4"
                />
                <path
                d={`M${x + 2} ${y - 2} l12 -20 M${x + 2} ${y - 2} l21 -8 M${x + 2} ${y - 2} l7 13`}
                stroke="#3c9560"
                strokeWidth="3"
                />
            </g>
            );
        })}
        <circle cx="65" cy="43" r="4" fill="#e5bc69" />
        <circle cx="121" cy="28" r="3" fill="#d93442" />
        </svg>
    );
}

function Decorations() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black/30" >
        <div className="absolute inset-0"/>

        <div className="absolute -top-24 left-1/2 h-56 w-80 -translate-x-1/2 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-amber-300 to-transparent" />

        <PineBranch className="absolute -left-7 -top-3 w-36 -rotate-12 opacity-90 sm:w-48" />
        <PineBranch className="absolute -right-7 -top-3 w-36 -scale-x-100 rotate-[-12deg] opacity-90 sm:w-48" />

        {ornamentPositions.map(([left, top, rotation], i) => (
            <div
            key={i}
            className={`absolute ${i > 1 ? "hidden sm:block" : ""} w-50`}
            style={{ left, top }}
            >
            <Bauble className="w-8 opacity-75 sm:w-11" />
            </div>
        ))}

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
        </div>
    );
}

function Snow() {
    const [flakes, setFlakes] = useState([]);

    useEffect(() => {
        setFlakes(
        Array.from({ length: 22 }, (_, i) => ({
            left: `${(i * 43 + 7) % 100}%`,
            delay: `${-((i * 3) % 14)}s`,
            duration: `${12 + ((i * 7) % 10)}s`,
            size: `${2 + (i % 3)}px`,
        }))
        );
    }, []);

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {flakes.map((f, i) => (
            <span
            key={i}
            className="snow absolute -top-2 rounded-full bg-white/70"
            style={{
                left: f.left,
                animationDelay: f.delay,
                animationDuration: f.duration,
                width: f.size,
                height: f.size,
            }}
            />
        ))}
        </div>
    );
}

function Frame({ children }) {
    return (
            <main
            className="christmas-screen relative isolate flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-[#081711] bg-cover bg-center bg-no-repeat text-white"
            style={{
                backgroundImage: `url("${background}")`,
            }}
            >
        <Decorations />
        <Snow />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col px-3 py-2 sm:px-6 sm:py-3">
            <header className="mx-auto flex w-full max-w-5xl shrink-0 items-center justify-center gap-2 pb-2 pt-1 sm:gap-3 sm:pb-3">
            <span className="text-base text-amber-300 sm:text-xl">✦</span>
            <div className="text-center">
                <p className="text-[9px] uppercase tracking-[.3em] text-amber-200/80 sm:text-[11px]">
                Un cuento de invierno
                </p>
                <h1 className="font-serif text-xl font-bold tracking-wide text-amber-100 sm:text-3xl">
                El destino del pueblo
                </h1>
            </div>
            <span className="text-base text-amber-300 sm:text-xl">✦</span>
            </header>

            <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col">
            {children}
            </div>

            <footer className="shrink-0 pt-1 text-center text-[8px] tracking-[.22em] text-amber-100/45 sm:pt-2 sm:text-[10px]">
            ❄ FELIZ NAVIDAD · QUE LA MAGIA TE ACOMPAÑE ❄
            </footer>
        </div>

        <style>{`
            @keyframes snowfall {
            from { transform: translateY(-5vh) translateX(0); opacity: 0; }
            10% { opacity: .8; }
            90% { opacity: .6; }
            to { transform: translateY(110vh) translateX(22px); opacity: 0; }
            }
            .snow {
            animation: snowfall linear infinite;
            }
            @keyframes appear {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
            }
            .christmas-appear {
            animation: appear .35s ease-out both;
            }
            .luxury-button {
            position: relative;
            overflow: hidden;
            background: linear-gradient(115deg,#9c1429 0%,#df3444 25%,#b5152c 52%,#710d21 100%);
            box-shadow: inset 0 1px 0 #ffc5a0aa, inset 0 -2px 0 #4b0715aa, 0 5px 15px #0005;
            }
            .luxury-button::before {
            content: "";
            position: absolute;
            inset: 1px;
            border: 1px solid #ffdca755;
            border-radius: inherit;
            pointer-events: none;
            }
            .gold-button {
            background: linear-gradient(115deg,#9a6823,#f7df9a 35%,#d8a94c 68%,#8e5b1d);
            box-shadow: inset 0 1px 0 #fff6d9, inset 0 -2px 0 #93601d, 0 5px 16px #0004;
            }
            @media (prefers-reduced-motion: reduce) {
            .snow, .christmas-appear { animation: none; }
            }
        `}</style>
        </main>
    );
    }

    function Intro({ onStart }) {
    return (
        <section className="christmas-appear relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl border border-amber-200/25 bg-[#0d241b]/95 px-4 py-3 text-center shadow-2xl shadow-black/40 sm:rounded-3xl sm:px-10 sm:py-5">
        <div className="absolute left-2 top-1 text-amber-300/70 sm:left-5 sm:top-3">✧</div>
        <div className="absolute right-2 top-1 text-amber-300/70 sm:right-5 sm:top-3">✧</div>

        <div className="relative mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-amber-200/40 bg-gradient-to-br from-amber-200/20 to-transparent text-3xl shadow-[0_0_25px_#e9bb4930] sm:mb-3 sm:h-16 sm:w-16 sm:text-4xl">
            🏰
        </div>

        <p className="text-[9px] uppercase tracking-[.3em] text-amber-300 sm:text-[11px]">
            Una misión extraordinaria
        </p>

        <h2 className="mt-1 max-w-xl font-serif text-2xl font-bold leading-tight text-amber-100 sm:mt-2 sm:text-4xl">
            El pueblo necesita tu sabiduría
        </h2>

        <div className="my-2 flex items-center gap-2 text-amber-300 sm:my-4">
            <span className="h-px w-8 bg-amber-300/40 sm:w-12" />
            <span>❄</span>
            <span className="h-px w-8 bg-amber-300/40 sm:w-12" />
        </div>

        <div className="max-w-2xl space-y-2 text-xs leading-[1.6] text-emerald-50/85 sm:space-y-3 sm:text-base sm:leading-7">
            <p>
            Querida guardiana de la Navidad, el destino de este pequeño pueblo
            está ahora en tus manos.
            </p>
            <p>
            Tendrás que tomar <strong className="text-amber-200">cinco decisiones importantes</strong>.
            Cada una tendrá consecuencias para sus habitantes, sus hogares y su futuro.
            </p>
            <p>
            No existe una respuesta perfecta: cada camino tiene sus ventajas y
            sus sacrificios. Elige según lo que consideres más justo.
            </p>
            <p className="font-semibold text-red-200">
            Atención: cada decisión confirmada será definitiva. No podrás cambiarla.
            </p>
        </div>

        <div className="my-3 grid w-full max-w-lg grid-cols-3 gap-2 sm:my-5 sm:gap-4">
            {[
            ["❄️", "5 decisiones"],
            ["🎁", "2 opciones"],
            ["🔒", "Sin retorno"],
            ].map(([icon, label]) => (
            <div
                key={label}
                className="rounded-xl border border-amber-100/10 bg-white/[.035] px-1 py-2 sm:py-3"
            >
                <div className="text-lg sm:text-2xl">{icon}</div>
                <p className="mt-1 text-[9px] text-amber-100/75 sm:text-xs">{label}</p>
            </div>
            ))}
        </div>

        <button
            onClick={onStart}
            className="gold-button group w-full max-w-md rounded-xl px-4 py-3 text-xs font-black uppercase tracking-[.12em] text-[#35220b] transition hover:brightness-110 active:scale-[.99] sm:py-4 sm:text-sm"
        >
            <span className="mr-2">✦</span>
            Comenzar mi misión
            <span className="ml-2 transition-transform group-hover:translate-x-1">➜</span>
        </button>
        </section>
    );
    }

    function ChoiceCard({ option, onSelect, disabled }) {
        const isGold = option.color === "gold";

        return (
            <button
            onClick={onSelect}
            disabled={disabled}
            className={`group relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-300 sm:rounded-2xl sm:p-5 ${
                isGold
                ? "border-amber-300/35 bg-gradient-to-br from-[#45341b] via-[#251f16] to-[#111d16]"
                : "border-red-300/30 bg-gradient-to-br from-[#581c28] via-[#30151c] to-[#151817]"
            }`}
            >
            <div
                className={`absolute inset-x-0 top-0 h-[3px] ${
                isGold
                    ? "bg-gradient-to-r from-transparent via-amber-200 to-transparent"
                    : "bg-gradient-to-r from-transparent via-red-300 to-transparent"
                }`}
            />


            {option.image && <div className="bg-blue-950 flex justify-center items-center rounded-2xl">
                <img src={option.image} className="w-40 h-40" />
            </div>
            }
            <h3 className="font-serif text-base font-bold leading-tight text-amber-100 sm:text-xl">
                {option.title}
            </h3>

            <p className="mt-1.5 flex-1 text-[11px] leading-[1.5] text-white/75 sm:mt-2 sm:text-sm sm:leading-6">
                {option.text}
            </p>

            <div
                className={`luxury-button mt-3 flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[9px] font-extrabold uppercase tracking-[.08em] text-white sm:mt-4 sm:py-3 sm:text-xs ${
                isGold ? "gold-button !text-[#35220b]" : ""
                }`}
            >
                Elegir este camino
                <span>➜</span>
            </div>
            </button>
        );
    }

    function Confirm({ option, onCancel, onConfirm, busy }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-5">
        <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="christmas-appear relative my-auto w-full max-w-md overflow-hidden rounded-2xl border border-amber-200/40 bg-gradient-to-b from-[#193a2b] to-[#091a13] p-5 shadow-2xl sm:rounded-3xl sm:p-7"
        >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
            <div className="absolute right-2 top-2 opacity-60">
            <Bauble className="w-9" />
            </div>

            <div className="mb-2 text-center text-4xl sm:text-5xl">🔐</div>

            <p className="text-center text-[9px] uppercase tracking-[.25em] text-amber-300 sm:text-[11px]">
            Confirmación definitiva
            </p>

            <h2
            id="confirm-title"
            className="mt-2 text-center font-serif text-2xl font-bold leading-tight text-amber-100 sm:text-3xl"
            >
            ¿Estás segura de esta decisión?
            </h2>

            <div className="my-4 rounded-xl border border-amber-200/25 bg-black/20 p-4 text-center sm:my-5 sm:p-5">
            <div className="text-4xl">{option.icon}</div>
            <h3 className="mt-2 font-serif text-xl font-bold text-amber-200">
                {option.title}
            </h3>
            <p className="mt-2 text-xs leading-5 text-emerald-50/75 sm:text-sm sm:leading-6">
                {option.text}
            </p>
            </div>

            <p className="text-center text-xs leading-5 text-red-200 sm:text-sm sm:leading-6">
            Esta elección cambiará el destino del pueblo. Una vez confirmada,
            no podrás modificarla ni volver atrás.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
            <button
                onClick={onCancel}
                disabled={busy}
                className="rounded-xl border border-white/20 bg-white/[.04] px-2 py-3 text-[10px] font-bold text-white/85 transition hover:bg-white/10 sm:text-xs"
            >
                ← Elegir otra
            </button>

            <button
                onClick={onConfirm}
                disabled={busy}
                className="gold-button rounded-xl px-2 py-3 text-[10px] font-black text-[#35220b] transition hover:brightness-110 disabled:opacity-60 sm:text-xs"
            >
                Sí, confirmar ✓
            </button>
            </div>
        </section>
        </div>
    );
    }

    export default function ChristmasVillageDecisions() {
    const [saved, setSaved] = useState({});
    const [ready, setReady] = useState(false);
    const [started, setStarted] = useState(false);
    const [selected, setSelected] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const result = {};

        decisions.forEach((decision, index) => {
        const value = window.localStorage.getItem(`${KEY}${index + 1}`);
        if (decision.options.some((option) => option.id === value)) {
            result[index + 1] = value;
        }
        });

        setSaved(result);
        setStarted(Object.keys(result).length > 0);
        setReady(true);
    }, []);

    const completed = Object.keys(saved).length;

    const nextIndex = decisions.findIndex(
        (_, index) => !saved[index + 1]
    );

    const current = nextIndex >= 0 ? decisions[nextIndex] : null;

    const selectedOption = current?.options.find(
        (option) => option.id === selected
    );

    function choose(optionId) {
        setSelected(optionId);
        setError("");
        setConfirming(true);
    }

    function cancel() {
        setConfirming(false);
        setSelected(null);
    }

    function confirm() {
        if (!current || !selectedOption || !ready) return;

        const storageKey = `${KEY}${nextIndex + 1}`;

        try {
        // Never overwrite an existing valid choice.
        const existing = window.localStorage.getItem(storageKey);

        if (existing !== null) {
            const valid = current.options.some(
            (option) => option.id === existing
            );

            if (valid) {
            setSaved((previous) => ({
                ...previous,
                [nextIndex + 1]: existing,
            }));
            setConfirming(false);
            setSelected(null);
            return;
            }
        }

        window.localStorage.setItem(storageKey, selectedOption.id);

        setSaved((previous) => ({
            ...previous,
            [nextIndex + 1]: selectedOption.id,
        }));

        setStarted(true);
        setConfirming(false);
        setSelected(null);
        setError("");
        } catch {
        setError(
            "No se ha podido guardar tu decisión. Comprueba el almacenamiento del navegador e inténtalo de nuevo."
        );
        }
    }

    if (!ready) {
        return (
        <div className="flex h-[100dvh] items-center justify-center bg-[#091711] text-amber-100">
            Preparando la magia...
        </div>
        );
    }

    return (
        <Frame>
        {!started && completed === 0 ? (
            <Intro onStart={() => setStarted(true)} />
        ) : current ? (
            <section className="christmas-appear flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-amber-200/25 bg-[#0b2018]/95 shadow-2xl sm:rounded-3xl">
            <div className="shrink-0 border-b border-amber-200/15 px-3 pb-2 pt-3 text-center sm:px-6 sm:pb-3 sm:pt-4">
                <div className="flex items-center justify-center gap-1.5">
                {decisions.map((_, i) => (
                    <div
                    key={i}
                    className={`h-1 w-5 rounded-full transition-all sm:h-1.5 sm:w-9 ${
                        i < completed
                        ? "bg-amber-300"
                        : i === nextIndex
                        ? "bg-red-400"
                        : "bg-white/15"
                    }`}
                    />
                ))}
                <span className="ml-2 text-[9px] uppercase tracking-wider text-amber-200/75 sm:text-[10px]">
                    {completed + 1}/5
                </span>
                </div>

                <p className="mt-2 text-[9px] uppercase tracking-[.22em] text-amber-300 sm:text-[10px]">
                {current.subtitle}
                </p>

                <h2 className="mt-1 font-serif text-xl font-bold leading-tight text-amber-100 sm:text-3xl">
                {current.title}
                </h2>

                <p className="mx-auto mt-1.5 max-w-2xl text-[11px] leading-[1.5] text-emerald-50/75 sm:mt-2 sm:text-sm sm:leading-6">
                {current.story}
                </p>

                <p className="mt-2 font-serif text-sm font-bold text-amber-200 sm:mt-3 sm:text-lg">
                ¿Qué camino elegirás?
                </p>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 p-2 sm:gap-4 sm:p-4">
                {current.options.map((option) => (
                <ChoiceCard
                    key={option.id}
                    option={option}
                    disabled={confirming}
                    onSelect={() => choose(option.id)}
                />
                ))}
            </div>

            {error && (
                <p role="alert" className="shrink-0 px-3 pb-2 text-center text-xs text-red-200">
                {error}
                </p>
            )}

            <div className="shrink-0 border-t border-amber-200/10 px-2 py-1.5 text-center text-[9px] text-amber-100/45 sm:py-2 sm:text-[10px]">
                ✦ Una vez confirmada, tu elección será definitiva ✦
            </div>
            </section>
        ) : (
            <section className="christmas-appear flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-amber-200/25 bg-[#0b2018]/95 p-3 sm:rounded-3xl sm:p-5">
            <div className="shrink-0 text-center">
                <span className="text-3xl sm:text-4xl">🎄</span>
                <h2 className="mt-1 font-serif text-xl font-bold text-amber-100 sm:text-3xl">
                El camino que has elegido
                </h2>
                <p className="mt-1 text-[10px] text-emerald-100/60 sm:text-xs">
                Tus decisiones definitivas para el pueblo
                </p>
            </div>

            <div className="mt-3 grid min-h-0 flex-1 grid-cols-1 gap-1.5 sm:mt-4 sm:grid-cols-2 sm:gap-2">
                {decisions.map((decision, index) => {
                const option = decision.options.find(
                    (item) => item.id === saved[index + 1]
                );

                if (!option) return null;

                return (
                    <div
                    key={option.id}
                    className="flex min-h-0 items-center gap-2 overflow-hidden rounded-xl border border-amber-200/15 bg-white/[.035] px-3 py-2 sm:px-4"
                    >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-300/35 text-[10px] text-amber-200">
                        {index + 1}
                    </span>
                    <span className="text-xl sm:text-2xl">{option.icon}</span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[9px] text-amber-200/60 sm:text-[10px]">
                        {decision.title}
                        </p>
                        <p className="truncate text-xs font-bold text-amber-100 sm:text-sm">
                        {option.title}
                        </p>
                    </div>
                    <span className="shrink-0 text-xs text-emerald-300">✓</span>
                    </div>
                );
                })}
            </div>

            <div className="mt-3 shrink-0 rounded-xl border border-amber-200/20 bg-amber-200/[.04] px-3 py-2 text-center sm:mt-4 sm:py-3">
                <p className="font-serif text-sm text-amber-100 sm:text-lg">
                ✨ La historia del pueblo está escrita ✨
                </p>
            </div>
            </section>
        )}

        {confirming && current && selectedOption && (
            <Confirm
            option={selectedOption}
            onCancel={cancel}
            onConfirm={confirm}
            />
        )}
        </Frame>
    );
}
