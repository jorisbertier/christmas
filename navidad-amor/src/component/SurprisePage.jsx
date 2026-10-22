import SurpriseModal from "./SurpriseModal";
import SecretNoel from "./Day/SecretNoel";
import SecretCard from "./Day/SecretCard";
import GiftSled from "./Day/GiftSled";
import CadeauTraineau from "./Day/CadeauTraineau";
import ChristmasBall from "./Day/ChristmasBall";
import ChristmasAlbum from "./Day/ChristmasAlbum";
import PhotoGallery from "./Day/PhotoGallery";

const composants = {
  1: SurpriseModal,
  2: SecretNoel,
  3: SecretCard,
  4: GiftSled,
  5: CadeauTraineau,
  6: ChristmasBall,
  7: ChristmasAlbum,
  8: PhotoGallery
};

// piano
// judbox
// village de noel entier (patinage , spain, maison etc) à chaque clique 
// spectacle de danse style moulin rouge ambiance de noel
// chorale qui chantent 
// jeu style le cluedo
// proposer de rendre le village interactif en ajoutant des éléments cliquables dans le village en fond entre 2 choix aurore boreal etc( avec un localstorage pour ses choix donc ) (ex: patinoire, sapin, maison) qui déclenchent des animations ou des surprises

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