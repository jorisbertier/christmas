
import React, { useEffect, useState } from "react";
import card1 from "../../assets/choice/card1.png";
import card2 from "../../assets/choice/card2.png";
import card3 from "../../assets/choice/card3.png";
import card4 from "../../assets/choice/card4.png";
import card5 from "../../assets/choice/card5.png";
import card6 from "../../assets/choice/card10.png";
import card7 from "../../assets/choice/card7.png";
import card8 from "../../assets/choice/card8.png";
import card9 from "../../assets/choice/card9.png";
import card10 from "../../assets/choice/card6.png";
import star from "../../assets/choice/12.png";
import background from "../../assets/BG/bgChristmasDecisions.jpg";
import ball from "../../assets/ball.png";
import snowflake from "../../assets/choice/snowflake.png";
import giftboxes from "../../assets/choice/gift-boxes.png";
import christmasday from "../../assets/choice/christmas-day.png";


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
            image : card1,
            widthimage: "450px",
            heightimage: "200px",
            title: "Una aurora boreal",
            text: "Invitar a todos a contemplar un río de luces verdes - azules que cubrirá el cielo del pueblo.",
            result: "El pueblo se llena de colores mágicos. Las luces de la aurora despiertan un sentimiento de paz y unión entre los habitantes.",
            color: "red",
        },
        {
            id: "12",
            icon: "🎄",
            image: card6,
            widthimage: "450px",
            heightimage: "160px",
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
                image : card2,
                widthimage: "450px",
                heightimage: "162px",
                title: "El árbol nevado",
                text: "Elegir un majestuoso abeto cubierto de nieve, decorado con luces cálidas, bolas brillantes y adornos navideños.",
                result:
                    "La plaza se transforma en un paisaje de cuento de hadas. El árbol nevado brilla bajo las luces y crea una atmósfera mágica de Navidad invernal.",
                color: "blue",
            },
            {
                id: "22",
                icon: "🎄",
                image : card7,
                widthimage: "650px",
                heightimage: "220px",
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
                image : card3,
                widthimage: "450px",
                heightimage: "160px",
                title: "La pista de hielo",
                text: "Construir una hermosa pista de hielo en la plaza, decorada con guirnaldas luminosas donde pequeños y mayores podrán patinar juntos.",
                result:
                    "La plaza se llena de risas y alegría. Los habitantes patinan de la mano bajo las luces navideñas, mientras la nieve cae suavemente a su alrededor.",
                color: "gold",
            },
            {
                id: "32",
                icon: "🎠",
                image : card9   ,
                widthimage: "450px",
                heightimage: "170px",
                title: "El carrusel mágico",
                text: "Instalar un elegante carrusel navideño con caballos decorados en rojo y dorado, luces brillantes y una dulce melodía festiva.",
                result:
                    "El carrusel comienza a girar entre destellos dorados. Los niños sonríen, la música llena la plaza y el pueblo adquiere el encanto de un cuento de Navidad.",
                color: "red",
            },
        ],
    },
    {
        title: "La calle de los dulces",
        subtitle: "Un rincón de ensueño lleno de golosinas",
        story:
            "En una pequeña calle del pueblo, ha aparecido un espacio mágico que podría convertirse en la atracción más dulce de la Navidad. Los duendes quieren construir algo extraordinario para sorprender a todos los habitantes. Puedes elegir una encantadora casa de jengibre, con paredes de galleta y un techo cubierto de dulces, o una colorida tienda de caramelos repleta de golosinas mágicas. ¡El pueblo espera tu elección!",
        options: [
            {
                id: "41",
                icon: "🍪",
                image : card4,
                widthimage: "450px",
                heightimage: "170px",
                title: "La casa de jengibre",
                text: "Construir una adorable casita hecha de galletas, con un techo de chocolate, ventanas de caramelo y decoraciones de glaseado blanco.",
                result:
                    "¡La casita parece sacada de un cuento! Su techo de galleta está cubierto de nieve blanca de azúcar, las ventanas brillan con tonos dorados y un delicioso aroma a canela llena la calle. Los habitantes se detienen maravillados ante esta pequeña obra maestra navideña.",
                color: "gold",
            },
            {
                id: "42",
                icon: "🍬",
                image : card8,
                widthimage: "450px",
                heightimage: "170px",
                title: "La tienda de caramelos",
                text: "Abrir una encantadora confitería con bastones de caramelo, piruletas gigantes, frascos de golosinas de colores y una fachada llena de luces.",
                result:
                    "¡La calle se convierte en un paraíso de dulces! Las vitrinas se llenan de caramelos de todos los colores, los bastones de azúcar decoran la entrada y las luces iluminan cada rincón. Los niños miran fascinados esta tienda que parece esconder dulces mágicos en cada estante.",
                color: "red",
            },
        ],
    },

    {
        title: "El último hechizo de Papá Noel",
        subtitle: "Solo queda magia para un último deseo",
        story:
            "Los duendes han descubierto que Papá Noel puede utilizar una última magia antes de Navidad. Pero solo queda energía para un hechizo. Una magia puede iluminar el cielo y guiar su trineo entre las estrellas. La otra puede envolverlo en un sueño mágico para que entregue los regalos sin despertar a nadie. ¿Qué magia debería elegir?",
        options: [
            {
                id: "51",
                icon: "⭐",
                image : card5   ,
                widthimage: "450px",
                heightimage: "170px",
                title: "La magia de las estrellas",
                text:
                    "Invocar el poder de las estrellas para iluminar el camino de Papá Noel y llenar la noche de destellos mágicos.",
                result:
                    "¡El cielo se llena de luz! Papá Noel sube a su trineo y los renos emprenden el vuelo. Una hermosa estela dorada atraviesa el cielo estrellado mientras el trineo sobrevuela el pueblo, llevando la magia de la Navidad a cada hogar.",
                color: "gold",
            },
            {
                id: "52",
                icon: "🌙",
                image : card10,
                widthimage: "450px",
                heightimage: "310px",
                title: "La magia de los sueños",
                text:
                    "Utilizar un hechizo silencioso que permita a Papá Noel visitar cada hogar sin despertar a sus habitantes.",
                result:
                    "¡La magia de los sueños envuelve a Papá Noel! Con pasos silenciosos y una sonrisa, recorre las calles nevadas y entra cuidadosamente en cada hogar para dejar los regalos bajo el árbol sin despertar a nadie. Solo quedan pequeñas chispas mágicas brillando a su paso.",
                color: "red",
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

        {/* <PineBranch className="absolute -left-7 -top-3 w-36 -rotate-12 opacity-90 sm:w-48" />
        <PineBranch className="absolute -right-7 -top-3 w-36 -scale-x-100 rotate-[-12deg] opacity-90 sm:w-48" /> */}

        {ornamentPositions.map(([left, top, rotation], i) => (
            <div
            key={i}
            className={`absolute ${i > 1 ? "hidden sm:block" : ""} w-50`}
            style={{ left, top }}
            >
            {/* <Bauble className="w-8 opacity-75 sm:w-11" /> */}
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
                    <p style={{ fontFamily: "'Mountains of Christmas', cursive", fontSize: "42px", fontWeight: "bold" }} className="text-[9px] uppercase tracking-[.3em] text-amber-200/80 sm:text-[11px]">
                    Un cuento de invierno
                    </p>
                    <h1 style={{ fontFamily: "'Mountains of Christmas', cursive", fontSize: "36px", fontWeight: "300" }} className="font-serif text-xl font-bold tracking-wide text-amber-100 sm:text-3xl">
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
        <section className="
            christmas-appear relative isolate flex min-h-0 flex-1
            flex-col items-center justify-center overflow-hidden
            rounded-2xl sm:rounded-3xl
            border border-[#d6bd91]
            bg-[#f5ead8]
            px-5 py-5 sm:px-12 sm:py-8
            text-center
            shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        ">

            {/* Fond décoratif */}
            <div className="pointer-events-none absolute inset-2 rounded-xl border border-[#c6a878]/40 sm:inset-3 sm:rounded-2xl" />

            <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-[#d5b77d]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[#8b3030]/10 blur-3xl" />

            {/* Petites décorations */}
            <span className="absolute left-6 top-6 font-serif text-2xl text-[#b28b4c]/60 sm:left-10 sm:top-8">✧</span>
            <span className="absolute right-6 top-6 font-serif text-2xl text-[#b28b4c]/60 sm:right-10 sm:top-8">✧</span>
            <span className="absolute bottom-6 left-6 text-xl text-[#b28b4c]/50 sm:bottom-10 sm:left-10">❄</span>
            <span className="absolute bottom-6 right-6 text-xl text-[#b28b4c]/50 sm:bottom-10 sm:right-10">❄</span>

            {/* En-tête */}
            <div className="relative z-10 flex items-center gap-3">
                <span className="h-px w-8 bg-[#b18a50] sm:w-14" />
                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#997440] sm:text-[11px]">
                    Un cuento de Navidad
                </p>
                <span className="h-px w-8 bg-[#b18a50] sm:w-14" />
            </div>

            {/* Titre */}
            <h2
                style={{ fontFamily: "'Mountains of Christmas', cursive" }}
                className="
                    relative z-10 mt-3 max-w-4xl
                    text-4xl font-bold leading-[1.05]
                    text-[#762b2b]
                    sm:mt-4 sm:text-6xl
                "
            >
                El pueblo necesita{" "}
                <span className="text-[#24543b]">
                    tu sabiduría
                </span>
            </h2>
            {/* Texte d'introduction */}
            <div className="
                relative z-10 max-w-2xl
                space-y-2 sm:space-y-3
                font-serif text-xs
                text-[#514337]
                sm:text-base sm:leading-4
            ">
                <p className="text-sm font-semibold text-[#31533e] sm:text-lg">
                    Querida guardiana de la Navidad...
                </p>

                <p>
                    El destino de este pequeño pueblo está ahora en tus manos.
                </p>

                <p>
                    Tendrás que tomar
                    <strong className="text-[#852e31]"> cinco decisiones importantes</strong>.
                    Cada una tendrá consecuencias para sus habitantes,
                    sus hogares y su futuro.
                </p>

                <p>
                    No existe una respuesta perfecta: cada camino tiene sus
                    ventajas y sus sacrificios. Elige según lo que consideres más justo.
                </p>
            </div>

            {/* Les trois caractéristiques */}
            <div className="
                relative z-10 mt-4 grid w-full max-w-xl
                grid-cols-3 gap-2 sm:mt-6 sm:gap-5
            ">
                {[
                    [snowflake, "5 decisiones"],
                    [giftboxes, "2 opciones"],
                    [christmasday, "Sin retorno"],
                ].map(([icon, label]) => (
                    <div
                        key={label}
                        className="
                            flex flex-col items-center justify-center
                            rounded-xl sm:rounded-2xl
                            px-1 py-1 sm:py-1
                        "
                    >
                        <img
                            src={icon}
                            alt=""
                            className="h-9 w-9 object-contain sm:h-14 sm:w-14"
                        />
                        <p className="
                            mt-1 font-serif text-[9px]
                            font-bold text-[#66503a]
                            sm:mt-2 sm:text-xs
                        ">
                            {label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Avertissement */}
            <p className="
                relative z-10 mt-3 max-w-lg
                text-[9px] font-semibold
                text-[#a13b36]
                sm:mt-4 sm:text-xs
            ">
                ✦ Atención: cada decisión confirmada será definitiva. No podrás cambiarla. ✦
            </p>

            {/* Bouton */}
            <button
                onClick={onStart}
                className="
                    group relative z-10 mt-4 w-full max-w-sm
                    overflow-hidden rounded-full cursor-pointer
                    border border-[#e8c98d]
                    bg-gradient-to-b from-[#a83b3e] via-[#8c252e] to-[#681923]
                    px-5 py-3.5
                    shadow-[0_6px_0_#4e1520,0_10px_20px_rgba(70,20,20,0.2)]
                    transition duration-300
                    hover:-translate-y-1
                    hover:brightness-110
                    hover:shadow-[0_8px_0_#4e1520,0_14px_24px_rgba(70,20,20,0.25)]
                    active:translate-y-1 active:shadow-none
                    sm:mt-5 sm:py-4
                "
            >
                <span className="absolute inset-x-5 top-0 h-px bg-white/40" />

                <span className="
                    relative flex items-center justify-center gap-3
                    font-serif text-sm font-bold
                    uppercase tracking-[0.12em] text-[#fff5dc]
                    sm:text-base
                ">
                    <span className="text-amber-200">✧</span>
                    Comenzar mi misión
                    <span className="text-amber-200">✧</span>
                </span>
            </button>

        </section>
    );
}


    const backgroundStyles = {
        red: {
        backgroundColor: "#8C2222", // Rouge foncé de base
        backgroundImage: `repeating-linear-gradient(
            135deg,
            #8C2222,
            #8C2222 14px,
            #A63232 14px,
            #A63232 28px
        )`, // Crée des bandes alternées nettes et lumineuses comme sur l'image
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
        },
        gold: {
            background: "linear-gradient(145deg, #806024, #d6b66a 48%, #71501b)",
            border: "1px solid rgba(255, 231, 170, 0.75)",
            boxShadow: "inset 0 1px 0 rgba(255, 248, 220, 0.5), 0 5px 14px rgba(0, 0, 0, 0.25)",
        },
        green: {
            background: "linear-gradient(145deg, #18563b, #0d3024 75%, #071d16)",
            border: "1px solid rgba(170, 220, 170, 0.4)",
        },
        blue: {
            background: "linear-gradient(145deg, #244f78, #163451 75%, #0b1b2b)",
            border: "1px solid rgba(160, 210, 255, 0.5)",
        },
    };


function ChoiceCard({ option, onSelect, disabled }) {
    return (
        <div className="min-w-0 min-h-0 flex flex-col items-center">

            {/* Image */}
            <button
                onClick={onSelect}
                disabled={disabled}
                className="
                    group relative w-full
                    flex flex-1 min-h-0
                    items-center justify-center
                    rounded-xl p-3
                    transition duration-300
                    hover:scale-[1.02]
                    active:scale-[0.98]
                    overflow-visible
                    disabled:cursor-not-allowed
                "
            >
                {option.image && (
                    <div className="w-full min-h-0 flex items-center justify-center overflow-visible mb-4 cursor-pointer">
                        <img
                            src={option.image}
                            alt={option.title}
                            style={{
                                width: option.widthimage || "100%",
                                height: option.heightimage || "auto",
                                maxWidth: "none",
                                maxHeight: "none",
                            }}
                            className="block shrink-0 drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)]"
                        />
                    </div>
                )}
            </button>

            {/* Texte */}
            <div className="
                relative w-full shrink-0
                mt-2 sm:mt-3
                rounded-xl sm:rounded-2xl
                border border-[#d6b66a]/60
                bg-gradient-to-b from-[#fffaf0] to-[#f3e5d0]
                px-3 py-3 sm:px-5 sm:py-4
                text-center
                shadow-[0_4px_12px_rgba(0,0,0,0.18)]
            ">
                {/* Petit ornement supérieur */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2
                    rounded-full border border-[#d6b66a]
                    bg-[#fff8e9] px-2 py-0.5
                    text-[10px] text-[#a77b32]">
                    ✦ ❄ ✦
                </div>

                <h3 className="
                    mt-1
                    font-serif font-bold
                    text-base sm:text-xl
                    leading-tight
                    text-[#79252b]
                    drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]
                ">
                    {option.title}
                </h3>

                <div className="mx-auto my-2 flex items-center justify-center gap-2">
                    <span className="h-px w-8 bg-[#c9a45c]/70" />
                    <span className="text-[10px] text-[#b18a43]">✧</span>
                    <span className="h-px w-8 bg-[#c9a45c]/70" />
                </div>

                <p className="
                    font-serif
                    text-[11px] sm:text-sm
                    leading-relaxed
                    text-[#49372d]
                ">
                    {option.text}
                </p>
            </div>
        </div>
    );
}


function Confirm({ option, onCancel, onConfirm, busy }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#07130e]/75 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="christmas-appear relative my-auto w-full max-w-md overflow-hidden rounded-[24px] border border-[#d8c49c] bg-[#f7efdf] px-6 py-7 shadow-[0_25px_80px_rgba(0,0,0,0.4)] sm:px-8 sm:py-9"
      >
        {/* Décoration */}
        <div className="pointer-events-none absolute inset-[7px] rounded-[18px] border border-[#d8c49c]/60" />

        <div className="relative z-10">
          {/* Icône */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#c6a66e] bg-[#efe2c8] text-3xl shadow-inner">
            🎄
          </div>
          <h2
            id="confirm-title"
            style={{ fontFamily: "'Mountains of Christmas', cursive" }}
            className="mt-3 text-center text-3xl font-bold leading-tight text-[#762b2b] sm:text-4xl"
          >
            ¿Estás segura de esta decisión?
          </h2>

          <p className="mx-auto mt-3 max-w-xs text-center font-serif text-sm leading-6 text-[#776b58]">
            El destino del pueblo está en tus manos...
          </p>

          {/* Choix */}
          <div className="mt-6 rounded-2xl border border-[#ddcba9] bg-[#fffaf0] p-5 text-center shadow-sm">
            <h3
              style={{ fontFamily: "'Mountains of Christmas', cursive" }}
              className="mt-2 text-2xl font-bold text-[#24543b]"
            >
              {option.title}
            </h3>

            <div className="mx-auto my-3 h-px w-12 bg-[#c6a66e]" />

            <p className="text-sm leading-6 text-[#756b5b]">
              {option.text}
            </p>
          </div>

          {/* Avertissement */}
          <p className="mt-5 text-center text-xs leading-5 text-[#8b4941]">
            Una vez confirmada, esta elección será definitiva.
            No podrás modificarla ni volver atrás.
          </p>

          {/* Boutons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={onCancel}
              disabled={busy}
              className="rounded-xl border border-[#cbb995] bg-transparent px-3 py-3 text-xs font-bold text-[#655b4b] transition hover:bg-[#eee3d0] disabled:opacity-50"
            >
              ← Elegir otra
            </button>

            <button
              onClick={onConfirm}
              disabled={busy}
              className="rounded-xl bg-[#762b2b] px-3 py-3 text-xs font-bold text-[#fff6e8] shadow-md transition hover:bg-[#5e2020] disabled:opacity-50"
            >
              {busy ? "Confirmando..." : "Confirmar ✓"}
            </button>
          </div>
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
            <section className="
                christmas-appear relative flex min-h-0 flex-1 flex-col
                overflow-hidden rounded-2xl sm:rounded-3xl
                border border-[#d9bd83]
                bg-gradient-to-br from-[#fffaf1] via-[#f9efe3] to-[#eee0cd]
                shadow-[0_15px_45px_rgba(0,0,0,0.35)]
            ">

                {/* Décoration supérieure */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#c49a4c] to-transparent" />
                <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-amber-200/20 blur-3xl" />
                <div className="pointer-events-none absolute -right-16 top-20 h-40 w-40 rounded-full bg-red-200/20 blur-3xl" />

                {/* En-tête */}
                <div className="
                    relative shrink-0
                    
                    px-3 pb-3 pt-3
                    text-center sm:px-8 sm:pb-5 sm:pt-5
                ">

                    {/* Progression */}
                    <div className="mx-auto flex max-w-md items-center justify-center gap-2">
                        <span className="text-[#b18a43]">✦</span>

                        {decisions.map((_, i) => (
                            <div
                                key={i}
                                className={`
                                    h-1.5 flex-1 rounded-full transition-all duration-500
                                    ${i < completed
                                        ? "bg-gradient-to-r from-[#b68a3c] to-[#e5c77e]"
                                        : i === nextIndex
                                            ? "bg-[#a52a35] shadow-[0_0_8px_rgba(165,42,53,0.35)]"
                                            : "bg-[#d9cbb6]"
                                    }
                                `}
                            />
                        ))}

                        <span className="text-[#b18a43]">✦</span>
                    </div>

                    <p className="mt-2 text-[9px] font-bold uppercase tracking-[.25em] text-[#a17a3d] sm:mt-3 sm:text-[10px]">
                        Capítulo {completed + 1} · Cinco decisiones mágicas
                    </p>

                    {/* Titre */}
                    <h2 className="
                        mt-1 font-serif font-bold
                        text-xl leading-tight sm:text-3xl
                        text-[#76232b]
                    ">
                        {current.title}
                    </h2>

                    {/* Histoire */}
                    <p className="
                        mx-auto mt-2 max-w-3xl
                        text-[11px] leading-[1.6] sm:mt-3
                        sm:text-sm sm:leading-6
                        text-[#514237]
                    ">
                        {current.story}
                    </p>

                    {/* Question */}
                    {/* <div className="
                        mx-auto mt-3 inline-flex items-center gap-2
                        rounded-full border border-[#d7b96f]/60
                        bg-white/60 px-4 py-1.5
                        shadow-sm sm:mt-4 sm:px-5 sm:py-2
                    ">
                        <span className="text-[#b68a3c]">✧</span>
                        <p className="font-serif text-xs font-bold text-[#842b32] sm:text-base">
                            ¿Qué camino elegirás?
                        </p>
                        <span className="text-[#b68a3c]">✧</span>
                    </div> */}
                </div>

                {/* Cartes de choix */}
                <div className="
                    relative grid min-h-0 flex-1
                    grid-cols-2 items-stretch
                    gap-2 p-2 sm:gap-5 sm:p-5
                ">
                    {current.options.map((option, index) => (
                        <ChoiceCard
                            key={option.id}
                            option={option}
                            disabled={confirming}
                            onSelect={() => choose(option.id)}
                        />
                    ))}
                </div>

                {/* Erreur */}
                {error && (
                    <p
                        role="alert"
                        className="shrink-0 px-3 pb-2 text-center text-xs font-medium text-red-700"
                    >
                        {error}
                    </p>
                )}

            </section>
        ) : (
        <section className="
            christmas-appear relative flex min-h-0 flex-1 flex-col
            overflow-hidden rounded-[24px]
            border border-[#d9c49b]
            bg-[#f5ead6]
            p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)]
            sm:rounded-[30px] sm:p-7
        ">
            {/* Cadre intérieur */}
            <div className="pointer-events-none absolute inset-[8px] rounded-[18px] border border-[#d8c49b]/70 sm:inset-[12px] sm:rounded-[22px]" />

            <div className="relative z-10 flex min-h-0 flex-1 flex-col">

                {/* En-tête */}
                <header className="shrink-0 text-center">
                    <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.35em] text-[#9b7544] sm:text-[11px]">
                        El final de nuestro cuento
                    </p>

                    <h2
                        style={{ fontFamily: "'Mountains of Christmas', cursive" }}
                        className="mt-1 text-3xl font-bold leading-tight text-[#762b2b] sm:text-5xl"
                    >
                        El destino del pueblo
                    </h2>

                    <p className="mx-auto mt-2 max-w-md font-serif text-xs leading-5 text-[#766a57] sm:text-sm">
                        Cinco decisiones, cinco momentos especiales y una historia que solo tú podías escribir.
                    </p>

                    <div className="mx-auto flex items-center justify-center gap-3">
                        <span className="h-px w-12 bg-[#c6a66e]" />
                        <span className="text-lg text-[#b38b4f]">✧</span>
                        <span className="h-px w-12 bg-[#c6a66e]" />
                    </div>
                </header>

                {/* Les décisions */}
                <div className="mx-auto mt-4 grid min-h-0 w-full max-w-2xl flex-1 grid-cols-1 content-center gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-3">
                    {decisions.map((decision, index) => {
                        const option = decision.options.find(
                            (item) => item.id === saved[index + 1]
                        );

                        if (!option) return null;

                        return (
                            <div
                                key={option.id}
                                className="
                                    relative flex min-w-0 items-center gap-3
                                    border-b border-[#d8c49b]
                                    px-2 py-2.5
                                    sm:py-3
                                "
                            >
                                <span
                                    className="
                                        flex h-8 w-8 shrink-0 items-center justify-center
                                        rounded-full bg-[#24543b]
                                        font-serif text-sm font-bold text-[#f8edda]
                                    "
                                >
                                    {index + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-[#9b7544] sm:text-[10px]">
                                        {decision.title}
                                    </p>
                                    <p className="truncate font-serif text-sm font-bold text-[#24543b] sm:text-base">
                                        {option.title}
                                    </p>
                                </div>

                                <span className="shrink-0 text-[#b38b4f]">✦</span>
                            </div>
                        );
                    })}
                </div>

                {/* Conclusion */}
                <footer className="mt-4 shrink-0 text-center sm:mt-5">
                    <div className="mx-auto max-w-xl rounded-2xl bg-[#24543b] px-4 py-4 shadow-lg sm:px-6 sm:py-5">
                        <p
                            style={{ fontFamily: "'Mountains of Christmas', cursive" }}
                            className="text-xl font-bold text-[#f7e9cc] sm:text-3xl"
                        >
                            La historia del pueblo está escrita
                        </p>
                    </div>
                </footer>
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
