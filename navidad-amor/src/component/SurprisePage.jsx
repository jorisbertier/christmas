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
import GiftChoice from "./Day/GiftChoice";
import ChristmasPaper from '../component/ChristmasPaper';
import ChristmasComplimentMachine from "./Day/ChristmasMachine";
import UglyChristmasSweater from "./Day/UglyChristmasSweat";
import ChristmasGifts from "./Day/ChristmasGifts";

const composants = {
  1: SurpriseModal,
  2: SecretNoel,
  3: SecretCard,
  4: GiftSled,
  // 5: CadeauTraineau,
  6: ChristmasBall,
  7: ChristmasAlbum,
  8: PhotoGallery,
  9: ChristmasVillage,
  10: Christmaschoir,
  11: ClockMystery,
  12: ChristmasLoveLetter,
  13: CinemaIntro,
  // 14: ChristmasScene,
  // 15: CoupleQuiz,
  16: ChristmasAwards,
  17: ChristmasWheel,
  18: ChristmasVillageDecisions,
  19: GiftChoice,
  20: ChristmasPaper,
  21: ChristmasComplimentMachine,
  22: UglyChristmasSweater,
  23: ChristmasGifts
};

// piano
// judbox
//Partiiton
// Concept : elle découvre une partition ancienne intitulée « Nuestra Navidad ».

// Au début, seules quelques notes sont visibles. Elle doit cliquer sur les symboles musicaux pour dévoiler progressivement la partition.

// À la fin :
// - La partition s'illumine.
// - La musique se lance.
// - Un message apparaît avec une photo de vous deux.
// Message final : « Si nuestra historia fuera una canción, sería mi favorita. »

// cadeau infini
//papilote ( devinette )
// creer 3 stickers pour son whastapp en mode elle pour noel (tu regalo soy yo elle en mode noel avec des guirlandes electriques au tour d elle comme un sapin)
// (elle avec un cadeau mi regalo, te estoy vigilando, necesito dinero,te amo, estoy enojada )
// bon pour voir un film de noel ensemble de son choix
// les dessins ( on a chacun un truc a dessiner, on le dessine et ensuite on revele ce qu'on a dessiner)
// dernier jour feliciter + inviter a diner

// spectacle de danse style moulin rouge ambiance de noel
// jeu la machine a pince // jeu de memoire (Une séquence de couleurs et de sons apparaît : rouge, bleu, vert, jaune… Elle doit la reproduire dans le bon ordre. Chaque niveau ajoute une couleur et accélère le rythme.Difficulté : elle doit atteindre le niveau 8 avant la fin du temps.)
// la chasse au objets (elle doit trouver des objets cachés dans le village de noel et les ramener à la maison du pere noel avant la fin du temps. Chaque objet trouvé rapporte des points. Difficulté : elle doit trouver au moins 10 objets avant la fin du temps.)
// Une image de Noël remplie de détails apparaît. Elle doit trouver 8 objets précis cachés dans le décor.Difficulté : certains objets sont minuscules ou partiellement dissimulés.
// la bombe de noel Un compte à rebours démarre. Elle doit résoudre trois petites énigmes : un code numérique, une suite logique et un mot à déchiffrer.
// constelation de noel
// choix entre 3  cadeaux (dulce, aventura, romantico) et selon le choix elle a une surprise differente
// la proposition du date repas de noel par video conference (avec un petit message d'amour et un lien pour se connecter à la date de noel)
// le musee de couple (avec des photos de nous et des souvenirs)
// cours de francais
// quiz duel amoureux 5 questions poser et a la fin elle regarde le match donc 5 questions pour elle et 5 pour moi
// generateur de compliment absurde surprises

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