/* ------------------------------------------------------------------ */
/*  SECRET SOLUTION (kept apart from the narrative data).              */
/*  Everything here is shipped to the browser: it is a game, not a     */
/*  security system. A technical user can read it in the bundle.       */
/* ------------------------------------------------------------------ */

// ✏️ The 5-digit code that opens the clock door in the other section.
// Keep it as a STRING so leading zeros are preserved ("00247").
export const CLOCK_CODE = "12240";

export const SABOTAGE_WINDOW = { from: "23:45", to: "23:57", minStay: 4 };

export const SOLUTION = {
  culprit: "lucien",
  method: "llave_pasador",
  interval: "23:45-23:57",
  alibi: "salida_relojeria",
  // one proof of each kind is required
  evidence: {
    presencia: ["ev_huellas", "ev_botas", "ev_registro_entregas", "ev_libro_posada"],
    medio: ["ev_pasador", "ev_paquete"],
    motivo: ["ev_engranaje", "ev_carta_cifrada", "ev_registro_mant"],
  },
  // How much each clock of the village is ahead (+) or behind (-) of real time
  clockOffsets: { posada: 3, correos: -2, ayuntamiento: 0, vigilante: 0 },
  puzzles: {
    travel: { minutes: 5, verdict: "imposible" },
    cipher: { shift: 7, plain: "LA ESTRELLA DE LA TORRE SE ROMPIO EN OCTUBRE. LA COPIA DE LATON NO AGUANTARA LA CAMPANADA DE MEDIANOCHE. SI SE ROMPE ANTE TODOS, EL PUEBLO SABRA LA VERDAD. NADIE DEBE SABERLO." },
    traces: { clavos: "eloy", fieltro: "pip", tacon: "lucien" },
    cross: { who: "anselmo", where: "ayuntamiento" },
    sequence: ["s_insp", "s_foto", "s_posada", "s_relojeria", "s_torre", "s_pasador", "s_plaza", "s_stop"],
  },
};

// Verified positions of each person (real time, place, from, to): used by the
// automatic checks and by the unit tests to prove the solution is unique.
export const ANCHORS = {
  lucien: [["posada", "23:00", "23:41"], ["relojeria", "23:47", "23:48"], ["plaza", "23:58", "00:00"]],
  casimiro: [["plaza", "23:30", "23:31"], ["posada", "23:43", "23:56"]],
  pip: [["taller", "23:00", "23:36"], ["almacen", "23:38", "23:50"]],
  anselmo: [["taller", "23:00", "23:20"], ["ayuntamiento", "23:25", "23:52"]],
  madeleine: [["ayuntamiento", "23:25", "23:52"], ["plaza", "23:55", "00:00"]],
  nora: [["correos", "23:30", "23:48"], ["plaza", "23:53", "00:00"]],
  eloy: [["plaza", "23:43", "00:10"]],
  berta: [["posada", "23:00", "00:00"]],
  santa: [["almacen", "23:38", "23:50"], ["plaza", "23:55", "00:00"]],
  grinch: [["posada", "23:05", "00:00"]],
  clara: [["plaza", "23:00", "00:00"]],
};
