import SurpriseModal from "./SurpriseModal";
import SecretNoel from "./Day/SecretNoel";
import SecretCard from "./Day/SecretCard";

const composants = {
  1: SurpriseModal,
  2: SecretNoel,
  3: SecretCard,
};

export default function SurprisePage({ jour, onClose }) {
  const Composant = composants[jour];

  if (!Composant) return null;

  // Le jour 1 conserve les props attendues par SurpriseModal.
  if (jour === 1) {
    return (
      <Composant
        jour={jour}
        onClose={onClose}
      />
    );
  }

  // Les autres composants dédiés sont affichés en plein écran.
  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-[#071923]">
      <button
        onClick={onClose}
        className="fixed right-5 top-5 z-[210] flex h-11 w-11 items-center justify-center rounded-full border border-amber-200/40 bg-slate-900/90 text-2xl text-amber-100 shadow-lg hover:bg-slate-800"
        aria-label="Retour au village"
      >
        ×
      </button>

      <Composant />
    </div>
  );
}