import { GIFTS } from "./surprises.js";

/* ------------------------------------------------------------------ */
/*  Pure state machine of the room. All guards live here, so no UI     */
/*  trick (fast clicks, going back, clicking elsewhere) can select a   */
/*  second gift.                                                       */
/*                                                                     */
/*  loading → intro → idle → focus → choosing → opening → revealed     */
/*                                                         ↕ done      */
/* ------------------------------------------------------------------ */

export function initialRoomState(storedChoice = null) {
  return {
    phase: "loading",
    choice: storedChoice || null, // set => the choice is final
    restored: !!storedChoice,
    giftsVisible: storedChoice ? GIFTS.length : 0,
    cardOpen: false,
    armed: null, // touch devices: first tap arms a gift, second tap confirms
  };
}

export function roomReducer(s, a) {
  switch (a.type) {
    case "READY":
      return s.phase === "loading" ? { ...s, phase: s.restored ? "done" : "intro" } : s;
    case "INTRO_DONE":
      return s.phase === "intro" ? { ...s, phase: "idle" } : s;
    case "TREE_CLICK":
      return s.phase === "idle" && !s.choice ? { ...s, phase: "focus", giftsVisible: 0 } : s;
    case "GIFT_APPEAR":
      return s.phase === "focus" ? { ...s, giftsVisible: Math.min(GIFTS.length, s.giftsVisible + 1) } : s;
    case "GIFTS_READY":
      return s.phase === "focus" && s.giftsVisible === GIFTS.length ? { ...s, phase: "choosing" } : s;
    case "ARM":
      return s.phase === "choosing" && !s.choice && GIFTS.some((g) => g.id === a.id) ? { ...s, armed: a.id } : s;
    case "DISARM":
      return s.armed ? { ...s, armed: null } : s;
    case "PICK":
      if (s.phase !== "choosing" || s.choice || !GIFTS.some((g) => g.id === a.id)) return s;
      return { ...s, phase: "opening", choice: a.id, armed: null };
    case "OPENED":
      return s.phase === "opening" ? { ...s, phase: "revealed", cardOpen: true } : s;
    case "CLOSE_CARD":
      return s.cardOpen ? { ...s, cardOpen: false, phase: "done" } : s;
    case "OPEN_CARD":
      return s.choice && !s.cardOpen && (s.phase === "done" || s.phase === "revealed") ? { ...s, cardOpen: true, phase: "revealed" } : s;
    default:
      return s;
  }
}
