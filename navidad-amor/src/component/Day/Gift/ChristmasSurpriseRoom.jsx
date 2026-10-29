import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import ChristmasScene from "./ChristmasScene.jsx";
import SurpriseModal from "./SurpriseModal.jsx";
import { TEXTS, readChoice, saveChoice } from "./surprises.js";
import { initialRoomState, roomReducer } from "./roomMachine.js";

/* ------------------------------------------------------------------ */
/*  Main component: owns the state machine, the timers and the HTML    */
/*  overlays. The 3D scene only receives props and calls handlers.     */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&display=swap');
@keyframes csr-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes csr-pulse{0%,100%{opacity:.75}50%{opacity:1}}
@keyframes csr-spin{to{transform:rotate(360deg)}}
.csr-rise{animation:csr-rise 1.4s cubic-bezier(.2,.8,.2,1) both}
.csr-pulse{animation:csr-pulse 2.6s ease-in-out infinite}
.csr-spin{animation:csr-spin 1.6s linear infinite}
@media (prefers-reduced-motion: reduce){.csr-rise,.csr-pulse,.csr-spin{animation:none}}
`;

class Boundary extends React.Component {
  constructor(p) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { /* 3D could not start (WebGL disabled…): show the fallback */ }
  render() {
    if (this.state.failed) {
      return <div className="flex h-full w-full items-center justify-center px-6 text-center text-xl italic text-amber-100" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif" }}>Ton navigateur n'arrive pas à afficher la 3D. Essaie avec un autre navigateur ❤️</div>;
    }
    return this.props.children;
  }
}

function useReducedMotionDom() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!m) return undefined;
    setR(m.matches);
    const h = (e) => setR(e.matches);
    if (m.addEventListener) m.addEventListener("change", h);
    return () => { if (m.removeEventListener) m.removeEventListener("change", h); };
  }, []);
  return r;
}

export default function ChristmasSurpriseRoom({ className = "" }) {
  const [state, dispatch] = useReducer(roomReducer, undefined, () => initialRoomState(readChoice()));
  const [sceneReady, setSceneReady] = useState(false);
  const [treeHovered, setTreeHovered] = useState(false);
  const [coarse] = useState(() => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(pointer: coarse)").matches : false));
  const reduce = useReducedMotionDom();
  const lock = useRef(false); // synchronous guard against double clicks
  const { phase, choice } = state;

  // scene ready → short pause → start the show
  useEffect(() => {
    if (!sceneReady || phase !== "loading") return undefined;
    const id = setTimeout(() => dispatch({ type: "READY" }), 500);
    return () => clearTimeout(id);
  }, [sceneReady, phase]);
  useEffect(() => {
    if (phase !== "intro") return undefined;
    const id = setTimeout(() => dispatch({ type: "INTRO_DONE" }), reduce ? 1500 : 4200);
    return () => clearTimeout(id);
  }, [phase, reduce]);
  useEffect(() => {
    if (phase !== "focus") return undefined;
    const ids = [1500, 2300, 3100].map((ms) => setTimeout(() => dispatch({ type: "GIFT_APPEAR" }), reduce ? ms / 3 : ms));
    ids.push(setTimeout(() => dispatch({ type: "GIFTS_READY" }), reduce ? 1500 : 4100));
    return () => ids.forEach(clearTimeout);
  }, [phase, reduce]);
  useEffect(() => {
    if (phase !== "opening") return undefined;
    const id = setTimeout(() => dispatch({ type: "OPENED" }), reduce ? 1800 : 4200);
    return () => clearTimeout(id);
  }, [phase, reduce]);

  const onReady = useCallback(() => setSceneReady(true), []);
  const onTreeClick = useCallback(() => dispatch({ type: "TREE_CLICK" }), []);
  const onArm = useCallback((id) => dispatch({ type: "ARM", id }), []);
  const onMissed = useCallback(() => dispatch({ type: "DISARM" }), []);

  // The pick is final: persisted immediately, locked synchronously.
  const onPick = useCallback((id) => {
    if (lock.current) return;
    lock.current = true;
    saveChoice(id);
    dispatch({ type: "PICK", id });
  }, []);
  useEffect(() => { if (choice) lock.current = true; }, [choice]);

  const showWelcome = phase === "intro" || phase === "idle";
  const showFocusText = phase === "focus" || phase === "choosing";

  return (
    <div className={`relative h-full min-h-[100svh] w-full max-h-full max-w-full overflow-hidden bg-[#0a1230] ${className}`} style={{ fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
      <style>{CSS}</style>

      <div className="absolute inset-0">
        <Boundary>
          <ChristmasScene
            phase={phase} choice={choice} restored={state.restored} giftsVisible={state.giftsVisible} armed={state.armed}
            treeHovered={treeHovered} reduce={reduce}
            onTreeHover={setTreeHovered} onTreeClick={onTreeClick} onPick={onPick} onArm={onArm} onMissed={onMissed} onReady={onReady}
          />
        </Boundary>
      </div>

      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 45%,transparent 55%,rgba(5,8,25,.55))" }} />

      {/* loading veil: fades away when the scene is ready */}
      <div className={`pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-[#0a1230] transition-opacity duration-[1800ms] ${phase === "loading" ? "opacity-100" : "opacity-0"}`} aria-hidden={phase !== "loading"}>
        <div className="csr-spin h-10 w-10 rounded-full border-2 border-amber-200/30 border-t-amber-200" />
        <p className="text-lg italic text-amber-100/90">{TEXTS.loading}</p>
      </div>

      {/* texts */}
      <div className="pointer-events-none absolute inset-x-0 top-[5%] z-10 flex flex-col items-center gap-2 px-5 text-center" aria-live="polite">
        {showWelcome && <h1 key="w" className="csr-rise text-2xl font-bold italic text-amber-100 drop-shadow-[0_2px_12px_rgba(0,0,0,.7)] sm:text-4xl">{TEXTS.welcome}</h1>}
        {showFocusText && <p key="f" className="csr-rise max-w-2xl text-xl italic text-amber-100 drop-shadow-[0_2px_12px_rgba(0,0,0,.8)] sm:text-3xl">{TEXTS.focus}</p>}
        {phase === "opening" && <p key="o" className="csr-rise text-xl italic text-amber-100 drop-shadow-[0_2px_12px_rgba(0,0,0,.8)] sm:text-3xl">{TEXTS.opening}</p>}
      </div>
      {phase === "idle" && (
        <p key="i" className="csr-rise csr-pulse pointer-events-none absolute inset-x-0 bottom-[7%] z-10 px-5 text-center text-lg italic text-amber-200 drop-shadow-[0_2px_10px_rgba(0,0,0,.8)] sm:text-2xl">
          {coarse ? TEXTS.instructionTouch : TEXTS.instruction}
        </p>
      )}

      {/* darken the room while the card is open */}
      <div className={`pointer-events-none absolute inset-0 z-20 bg-black/35 transition-opacity duration-1000 ${state.cardOpen ? "opacity-100" : "opacity-0"}`} />

      {state.cardOpen && choice && <SurpriseModal giftId={choice} onClose={() => dispatch({ type: "CLOSE_CARD" })} />}

      {/* after the card is closed: the choice stays final, no restart button */}
      {phase === "done" && !state.cardOpen && choice && (
        <div className="csr-rise absolute inset-x-0 bottom-[5%] z-10 flex flex-col items-center gap-3 px-5 text-center">
          <p className="text-xl italic text-amber-100 drop-shadow-[0_2px_10px_rgba(0,0,0,.8)] sm:text-2xl">{TEXTS.chosenInfo}</p>
          <button type="button" onClick={() => dispatch({ type: "OPEN_CARD" })} className="rounded-full border border-amber-200/70 bg-[#5a0f19]/90 px-6 py-2 text-lg font-semibold text-amber-100 shadow-lg transition hover:bg-[#7a1426] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200">
            {TEXTS.reopen}
          </button>
        </div>
      )}
    </div>
  );
}
