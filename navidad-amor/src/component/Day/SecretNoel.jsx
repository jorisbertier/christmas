
import React, { useState } from "react";

export default function SecretNoel() {
    const [code, setCode] = useState("");
    const [ouvert, setOuvert] = useState(false);
    const [erreur, setErreur] = useState(false);

    const verifierCode = (e) => {
        e.preventDefault();

        if (code === "2412") {
        setOuvert(true);
        setErreur(false);
        } else {
        setErreur(true);
        setCode("");
        }
    };

    return (
        <div className="relative isolate flex min-h-[600px] w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-[#071c2c] via-[#123c4a] to-[#071923] px-4 py-12 text-white">

        {/* Étoiles et flocons */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 35 }).map((_, i) => (
            <span
                key={i}
                className="absolute animate-pulse text-white/70"
                style={{
                left: `${(i * 37 + 11) % 100}%`,
                top: `${(i * 23 + 7) % 100}%`,
                animationDelay: `${(i % 5) * 0.6}s`,
                fontSize: `${8 + (i % 3) * 5}px`,
                }}
            >
                {i % 4 === 0 ? "✦" : "❄"}
            </span>
            ))}
        </div>

        {/* Halo lumineux */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-md text-center">

            <div className="mb-5 text-5xl">🎄</div>

            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-amber-200">
            Un secret de Noël
            </p>

            <h2 className="mb-4 font-serif text-3xl leading-tight text-amber-100 sm:text-4xl">
            Un cadeau rien que pour toi
            </h2>

            {!ouvert ? (
            <>
                <p className="mx-auto mb-8 max-w-sm text-sm leading-7 text-blue-100/80">
                Quelque chose de précieux est caché ici.
                Un petit cadenas protège les mots que
                mon cœur aimerait te révéler…
                </p>

                {/* Carte du cadenas */}
                <div className="mx-auto mb-7 flex h-36 w-36 flex-col items-center justify-center rounded-3xl border border-amber-200/30 bg-white/[0.06] shadow-[0_0_50px_rgba(251,191,36,0.12)] backdrop-blur-sm">
                <div className="text-6xl drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                    🔒
                </div>
                <p className="mt-3 text-xs tracking-[0.25em] text-amber-200">
                    SECRET SCELLÉ
                </p>
                </div>

                <p className="mb-4 text-sm text-blue-100/90">
                Quel est le code magique du réveillon ?
                </p>

                <form
                onSubmit={verifierCode}
                className="mx-auto flex max-w-xs flex-col gap-4"
                >
                <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={code}
                    onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ""));
                    setErreur(false);
                    }}
                    placeholder="✧  ✧  ✧  ✧"
                    aria-label="Code secret à quatre chiffres"
                    className="w-full rounded-xl border border-amber-200/40 bg-slate-950/40 px-4 py-4 text-center text-2xl tracking-[0.7em] text-amber-100 outline-none transition placeholder:text-amber-100/30 focus:border-amber-200 focus:ring-2 focus:ring-amber-200/20"
                />

                {erreur && (
                    <p role="alert" className="text-sm text-rose-300">
                    Ce n'est pas encore le bon code… Réessaie, mon cœur. ❄️
                    </p>
                )}

                <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 px-6 py-4 font-semibold text-slate-900 shadow-lg shadow-amber-300/10 transition duration-300 hover:scale-[1.03] hover:shadow-amber-200/30 active:scale-95"
                >
                    Déverrouiller mon cadeau ✨
                </button>
                </form>

                <p className="mt-6 text-xs italic text-blue-100/50">
                Un indice : la date où la magie de Noël commence…
                </p>
            </>
            ) : (
            <div className="animate-[fadeIn_1s_ease-out]">
                <div className="mb-5 text-7xl drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]">
                🔓
                </div>

                <p className="mb-4 text-sm uppercase tracking-[0.3em] text-amber-200">
                Le secret est révélé
                </p>

                <div className="rounded-3xl border border-amber-200/30 bg-white/[0.07] p-6 shadow-[0_0_60px_rgba(251,191,36,0.12)] backdrop-blur-md sm:p-8">
                <div className="mb-5 text-3xl">💌</div>

                <h3 className="mb-5 font-serif text-2xl leading-snug text-amber-100 sm:text-3xl">
                    Mon plus beau cadeau, c'est toi.
                </h3>

                <div className="mx-auto mb-5 h-px w-16 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

                <p className="text-base leading-8 text-blue-50/90">
                    Si je pouvais demander un seul vœu à Noël,
                    je ne demanderais ni étoile, ni cadeau,
                    ni miracle.
                </p>

                <p className="mt-4 text-base leading-8 text-blue-50/90">
                    Je demanderais simplement encore mille
                    Noëls à tes côtés, mille réveils près de toi,
                    et mille raisons de te faire sourire.
                </p>

                <p className="mt-6 font-serif text-xl italic text-amber-200">
                    Eres mi lugar favorito en el mundo. ❤️
                </p>

                <div className="mt-6 text-2xl tracking-widest">
                    ✨ 🎄 ✨
                </div>
                </div>

                <button
                onClick={() => {
                    setOuvert(false);
                    setCode("");
                }}
                className="mt-6 text-sm text-blue-100/60 underline underline-offset-4 transition hover:text-amber-200"
                >
                Refermer le secret
                </button>
            </div>
            )}

            <p className="mt-10 text-xs tracking-widest text-white/35">
            FABRIQUÉ AVEC AMOUR · NOËL ❤️
            </p>
        </div>

        <style>{`
            @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
            }
        `}</style>
        </div>
    );
}
