
import { surprises } from "../data/surprises.js";

export default function SurpriseModal({ jour, onClose }) {
    const surprise = surprises[jour];

    if (!surprise) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#08091f]/80 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-amber-200/50 bg-gradient-to-b from-[#24234f] to-[#11132e] p-6 sm:p-9 text-amber-50 shadow-2xl">

            <div className="mb-5 text-center text-3xl">
            ✨ 💌 ✨
            </div>

            <p className="text-center text-sm uppercase tracking-[0.25em] text-amber-300">
            {surprise.date}
            </p>

            <h2 className="mt-3 text-center font-serif text-3xl sm:text-4xl text-amber-100">
            {surprise.title}
            </h2>

            <div className="mx-auto my-6 h-px w-24 bg-amber-300/60" />

            <div className="space-y-4 font-serif text-base leading-7 sm:text-lg text-amber-50/90">
            {surprise.contenu.map((paragraphe, index) => (
                <p key={index}>{paragraphe}</p>
            ))}

            {surprise.signature && (
                <p className="pt-3 text-right italic text-amber-200">
                {surprise.signature}
                </p>
            )}
            </div>

            <button
            onClick={onClose}
            className="mt-8 w-full rounded-xl border border-amber-200/40 bg-amber-300/10 px-5 py-3 font-serif text-lg text-amber-100 transition hover:bg-amber-300/20"
            >
            Retour au village ❄️
            </button>
        </div>
        </div>
    );
}
