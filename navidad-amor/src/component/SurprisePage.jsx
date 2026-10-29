import SurpriseModal from "./SurpriseModal";
import SecretNoel from "./Day/SecretNoel";
import SecretCard from "./Day/SecretCard";
import GiftSled from "./Day/GiftSled";
import CadeauTraineau from "./Day/CadeauTraineau";
import ChristmasBall from "./Day/ChristmasBall";
import ChristmasAlbum from "./Day/ChristmasAlbum";
import PhotoGallery from "./Day/PhotoGallery";
import ChristmasVillage from "./Day/ChristmasVillage";
import Christmaschoir from "./Day/Christmaschoir";
import ClockMystery from "./Day/Game/ClockMystery";
import ChristmasLoveLetter from "./Day/ChristmasLoveLetter";
import CinemaIntro from "./Day/CinemaIntro";
// import ChristmasScene from "./Day/ChristmasScene";
import CoupleQuiz from "./Day/CoupleQuiz";
import ChristmasAwards from "./Day/ChristmasAwards";
import ChristmasWheel from "./Day/ChristmasWheel";
import ChristmasVillageDecisions from "./Day/ChristmasVillageDecisions";
import ChristmasScene from "./Day/Gift/ChristmasScene";

const composants = {
  1: SurpriseModal,
  2: SecretNoel,
  3: SecretCard,
  4: GiftSled,
  5: CadeauTraineau,
  6: ChristmasBall,
  7: ChristmasAlbum,
  8: PhotoGallery,
  9: ChristmasVillage,
  10: Christmaschoir,
  11: ClockMystery,
  12: ChristmasLoveLetter,
  13: CinemaIntro,
  // 14: ChristmasScene,
  15: CoupleQuiz,
  16: ChristmasAwards,
  17: ChristmasWheel,
  18: ChristmasVillageDecisions,
  19: ChristmasScene
};

// piano
// judbox
// cadeau infini
// le combat de pierre feuille appier cisceaux contre le pere noel
// village de noel entier (patinage , spain, maison etc) à chaque clique 
// spectacle de danse style moulin rouge ambiance de noel
// chorale qui chantent ( ce soir les habitants de ton village se sont réunis pour chanter des chants de Noël. Tu peux les écouter et même chanter avec eux !)
// jeu style le cluedo de noel (avec des indices et des personnages)
// jeu de devinettes sur noel
// jeu la machine a pince // jeu de memoire (Une séquence de couleurs et de sons apparaît : rouge, bleu, vert, jaune… Elle doit la reproduire dans le bon ordre. Chaque niveau ajoute une couleur et accélère le rythme.Difficulté : elle doit atteindre le niveau 8 avant la fin du temps.)
// la chasse au objets (elle doit trouver des objets cachés dans le village de noel et les ramener à la maison du pere noel avant la fin du temps. Chaque objet trouvé rapporte des points. Difficulté : elle doit trouver au moins 10 objets avant la fin du temps.)
// Une image de Noël remplie de détails apparaît. Elle doit trouver 8 objets précis cachés dans le décor.Difficulté : certains objets sont minuscules ou partiellement dissimulés.
// remise de prix 2026 
// la bombe de noel Un compte à rebours démarre. Elle doit résoudre trois petites énigmes : un code numérique, une suite logique et un mot à déchiffrer.
// constelation de noel
// choix entre 3  cadeaux (dulce, aventura, romantico) et selon le choix elle a une surprise differente
// la proposition du date repas de noel par video conference (avec un petit message d'amour et un lien pour se connecter à la date de noel)
// le musee de couple (avec des photos de nous et des souvenirs)
// cours de francais
// quiz duel amoureux 5 questions poser et a la fin elle regarde le match donc 5 questions pour elle et 5 pour moi
// lettre d amour
// la liste du pere noel
// generateur de compliment absurde
// maison secrete (bonus 25)
// proposer de rendre le village interactif en ajoutant des éléments cliquables dans le village en fond entre 2 choix 
// (aurore boreal ou etoiles filantes choix entre 2 chansons au total 5 choix qui affecte sont village etc( avec un localstorage pour ses choix donc ) (ex: patinoire, sapin, maison) qui déclenchent des animations ou des surprises

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
        onClick={() => {
          window.dispatchEvent(new Event("stop-christmas-choir"));
          onClose();
        }}
        className="fixed right-5 top-5 z-[210] flex h-11 w-11 items-center justify-center rounded-full border border-amber-200/40 bg-slate-900/90 text-2xl text-amber-100 shadow-lg hover:bg-slate-800"
        aria-label="Retour au village"
      >
        ×
      </button>

      <Composant />
    </div>
  );
}