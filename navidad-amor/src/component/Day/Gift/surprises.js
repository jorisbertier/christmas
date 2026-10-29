/* ------------------------------------------------------------------ */
/*  SINGLE CONFIGURATION FILE: every text and every surprise lives     */
/*  here. Edit this file only to personalise the experience.           */
/* ------------------------------------------------------------------ */

// localStorage key that remembers the (definitive) choice
export const STORAGE_KEY = "christmasSurpriseChoice";

export const TEXTS = {
  loading: "Allumage des guirlandes…",
  welcome: "Bienvenue dans notre petit salon de Noël ❤️",
  instruction: "Clique sur le sapin pour découvrir tes surprises",
  instructionTouch: "Touche le sapin pour découvrir tes surprises",
  focus: "J'ai préparé trois petites surprises pour toi… mais tu ne peux en choisir qu'une ❤️",
  pick: "Choisir ce cadeau",
  pickTouch: "Touche encore pour choisir",
  opening: "Une petite magie opère…",
  closeCard: "Fermer la surprise",
  reopen: "Relire ma surprise",
  chosenInfo: "Tu as fait ton choix ❤️",
  treeLabel: "Sapin de Noël : touche pour découvrir tes surprises",
};

/* The three gifts as they look in 3D (the content is NOT revealed here). */
export const GIFTS = [
  { id: "red", name: "Cadeau rouge", body: "#c4202b", ribbon: "#f2b632", pattern: "christmas", accent: "#ffffff", accent2: "#f2b632", glow: "#ffd98a" },
  { id: "green", name: "Cadeau vert", body: "#1f8f5c", ribbon: "#f6e7c1", pattern: "dots", accent: "#ffffff", accent2: "#ffffff", glow: "#c8ffd8" },
  { id: "champagne", name: "Cadeau champagne", body: "#ecd9b0", ribbon: "#7a1426", pattern: "soft", accent: "#d8bd86", accent2: "#d8bd86", glow: "#fff0c0" },
];

/* The three surprises. `type` selects the card layout in SurpriseModal. */
export const SURPRISES = {
  red: {
    type: "letter",
    title: "Quelques mots pour toi ❤️",
    message:
      "Même lorsque la distance nous sépare, tu gardes une place immense dans mon cœur. Je voulais simplement te rappeler combien tu comptes pour moi et combien je suis heureux de construire notre histoire avec toi.",
    signature: "Avec tout mon amour",
  },
  green: {
    type: "voucher",
    title: "Un cadeau rien que pour toi 🎁",
    message:
      "Ce petit bon cadeau est une promesse de partager un nouveau moment ensemble. Une surprise préparée avec amour, rien que pour toi.",
    voucher: {
      heading: "Bon cadeau",
      activity: "Un moment rien que pour nous deux", // ✏️ replace with a real activity or gift
      details: "À utiliser quand tu veux, où tu veux",
      validity: "Valable toute l'année",
      number: "N° 001",
    },
  },
  champagne: {
    type: "memory",
    title: "Notre petite histoire ✨",
    message:
      "Parmi tous les souvenirs que je pourrais garder, ceux que nous construisons ensemble ont une valeur particulière. Voici une petite attention pour te rappeler que notre histoire est précieuse pour moi.",
    memory: {
      photo: null, // ✏️ import a photo and put it here (e.g. import photo from "../assets/us.jpg")
      date: "Une date qui compte pour nous", // ✏️ e.g. "14 février 2023"
      caption: "Ajoute ici un souvenir, un lieu, une phrase qui n'appartient qu'à vous deux.", // ✏️
    },
  },
};

/* ---------------- storage helpers (always guarded) ---------------- */

export function readChoice() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return GIFTS.some((g) => g.id === v) ? v : null;
  } catch (e) {
    return null;
  }
}

export function saveChoice(id) {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
    return true;
  } catch (e) {
    return false;
  }
}
