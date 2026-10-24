/* ------------------------------------------------------------------ */
/*  Routes of the village (minutes on foot through the snow).          */
/*  An edge with `requires` only exists for the player once the       */
/*  matching token ("ev:<evidenceId>" or "flag:<flag>") is unlocked.   */
/* ------------------------------------------------------------------ */

export const ROUTES = [
  { a: "torre", b: "plaza", min: 2 },
  { a: "torre", b: "relojeria", min: 2 },
  { a: "torre", b: "ayuntamiento", min: 3 },
  { a: "plaza", b: "relojeria", min: 3 },
  { a: "plaza", b: "ayuntamiento", min: 3 },
  { a: "plaza", b: "correos", min: 3 },
  { a: "plaza", b: "posada", min: 3 },
  { a: "plaza", b: "taller", min: 4 },
  { a: "plaza", b: "almacen", min: 5 },
  { a: "plaza", b: "casa_vigilante", min: 4 },
  { a: "taller", b: "almacen", min: 2 },
  { a: "casa_vigilante", b: "almacen", min: 3 },
  { a: "casa_vigilante", b: "invernadero", min: 2 },
  { a: "ayuntamiento", b: "correos", min: 2 },
  { a: "correos", b: "invernadero", min: 3 },
  // Garden path cleared by Eloy this afternoon: shown once the player finds his plan.
  { a: "torre", b: "invernadero", min: 4, requires: "ev:ev_mapa", label: "Camino del jardín" },
];
