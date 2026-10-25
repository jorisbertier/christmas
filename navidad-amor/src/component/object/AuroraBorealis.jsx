import { memo, useMemo } from "react";

/**
 * AuroraBorealis — aurore boréale verte, en position absolue.
 * Un seul fichier, Tailwind + keyframes embarquées, zéro dépendance.
 *
 * Le parent doit être positionné (relative / fixed / absolute) :
 *
 *   <section className="relative h-screen overflow-hidden">
 *     <AuroraBorealis />
 *     <div className="relative z-10"> ...votre contenu... </div>
 *   </section>
 *
 * Props (toutes optionnelles)
 *   className  : classes Tailwind en plus (ex. "opacity-80", "h-1/2", "-z-10")
 *   intensity  : 0 → 1.5, luminosité globale (défaut 1)
 *   speed      : vitesse des mouvements, 1 = normal, 0.5 = lent, 2 = rapide
 *   stars      : étoiles scintillantes (défaut true)
 *   sky        : fond de ciel nocturne ; mettre false pour superposer l'aurore à votre fond
 *   accent     : true = touche violette en haut des rideaux (défaut false = vert pur)
 *   children   : contenu éventuel, rendu par-dessus l'aurore
 *
 * Performances : uniquement transform / opacity animés, aucun filter ni blur animé.
 * Respecte prefers-reduced-motion.
 */

const KEYFRAMES = `
@keyframes aur-drift{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(var(--dx),0,0)}}
@keyframes aur-sway{0%,100%{transform:skewX(var(--s0)) scaleY(.88)}50%{transform:skewX(var(--s1)) scaleY(1.1)}}
@keyframes aur-rays{0%,100%{transform:translate3d(-4%,0,0)}50%{transform:translate3d(4%,0,0)}}
@keyframes aur-pulse{0%,100%{opacity:.5}50%{opacity:1}}
@keyframes aur-twinkle{0%,100%{opacity:.3}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){.aur-anim{animation:none!important}}
`;

/* Chaque rideau : position, taille, mouvement, teinte, finesse des rayons */
const CURTAINS = [
  { left: -12, top: 4, w: 62, h: 82, dx: "10%", drift: 26, sway: 13, ray: 9, pulse: 7, s0: "-9deg", s1: "6deg", tint: 0, p: 1.0, delay: 0, o: 0.95 },
  { left: 18, top: 0, w: 56, h: 90, dx: "-12%", drift: 31, sway: 17, ray: 11, pulse: 9, s0: "7deg", s1: "-8deg", tint: 1, p: 0.8, delay: -6, o: 0.85 },
  { left: 42, top: 8, w: 64, h: 76, dx: "9%", drift: 24, sway: 15, ray: 8, pulse: 6, s0: "-5deg", s1: "9deg", tint: 0, p: 1.3, delay: -11, o: 0.9 },
  { left: 66, top: 2, w: 54, h: 84, dx: "-10%", drift: 29, sway: 12, ray: 10, pulse: 8, s0: "8deg", s1: "-6deg", tint: 2, p: 0.9, delay: -3, o: 0.8 },
  { left: 28, top: 14, w: 48, h: 64, dx: "14%", drift: 22, sway: 10, ray: 7, pulse: 5, s0: "-7deg", s1: "7deg", tint: 1, p: 1.5, delay: -15, o: 0.6 },
];

function curtainGradient(tint, accent) {
  const top = accent ? "rgba(150,100,255,.2) 90%, rgba(150,100,255,0) 100%" : "rgba(30,150,200,0) 100%";
  const sets = [
    // vert émeraude
    `rgba(110,255,170,0) 0%, rgba(110,255,170,.9) 9%, rgba(52,235,150,.58) 36%, rgba(30,190,170,.3) 64%, rgba(30,150,200,.1) 82%, ${top}`,
    // vert-cyan
    `rgba(90,255,200,0) 0%, rgba(90,255,200,.85) 10%, rgba(40,225,175,.55) 38%, rgba(30,185,190,.28) 66%, rgba(40,140,210,.1) 84%, ${top}`,
    // vert-jaune (les « flammes » basses)
    `rgba(190,255,130,0) 0%, rgba(170,255,130,.8) 8%, rgba(80,240,140,.55) 34%, rgba(40,200,150,.28) 62%, rgba(30,160,190,.1) 82%, ${top}`,
  ];
  return `linear-gradient(to top, ${sets[tint]})`;
}

const EDGE_MASK = "linear-gradient(90deg, transparent 0%, #000 26%, #000 74%, transparent 100%)";
const raysMask = (p) =>
  `repeating-linear-gradient(90deg, rgba(0,0,0,.45) 0%, #000 ${1.2 * p}%, rgba(0,0,0,.7) ${2.4 * p}%, rgba(0,0,0,.3) ${3.4 * p}%, #000 ${4.6 * p}%)`;

/* étoiles déterministes (pas de Math.random : rendu identique serveur/client) */
function makeStars(n, seed) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => ({ x: rnd() * 100, y: rnd() * 78, r: 0.8 + rnd() * 1.6, a: 0.45 + rnd() * 0.55 }));
}
const STARS_A = makeStars(46, 11);
const STARS_B = makeStars(34, 97);

function AuroraBorealis({ className = "", intensity = 1, speed = 1, stars = true, sky = true, accent = false, children }) {
  const sp = Math.max(0.1, speed);
  const curtains = useMemo(() => CURTAINS, []);

  return (
    <div
      aria-hidden={children ? undefined : "true"}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={sky ? { background: "linear-gradient(to bottom, #010409 0%, #03101a 45%, #05221f 100%)" } : undefined}
    >
      <style>{KEYFRAMES}</style>

      {/* étoiles */}
      {stars && (
        <>
          {[STARS_A, STARS_B].map((layer, li) => (
            <div key={li} className="aur-anim absolute inset-0" style={{ animation: `aur-twinkle ${(li ? 5 : 7) / sp}s ease-in-out ${li ? -2 : 0}s infinite` }}>
              {layer.map((st, i) => (
                <span key={i} className="absolute rounded-full bg-white" style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.r, height: st.r, opacity: st.a }} />
              ))}
            </div>
          ))}
        </>
      )}

      {/* aurore */}
      <div className="absolute inset-0" style={{ opacity: Math.min(1.5, Math.max(0, intensity)) }}>
        {/* halo diffus bas */}
        <div
          className="aur-anim absolute inset-x-0 bottom-0 h-3/5"
          style={{ background: "radial-gradient(ellipse 70% 80% at 50% 100%, rgba(70,255,170,.28), rgba(30,200,160,.1) 50%, transparent 75%)", animation: `aur-pulse ${9 / sp}s ease-in-out infinite` }}
        />

        {curtains.map((c, i) => (
          <div
            key={i}
            className="aur-anim absolute mix-blend-screen"
            style={{
              left: `${c.left}%`,
              top: `${c.top}%`,
              width: `${c.w}%`,
              height: `${c.h}%`,
              opacity: c.o,
              "--dx": c.dx,
              WebkitMaskImage: EDGE_MASK,
              maskImage: EDGE_MASK,
              animation: `aur-drift ${c.drift / sp}s ease-in-out ${c.delay}s infinite`,
              willChange: "transform",
            }}
          >
            <div
              className="aur-anim absolute inset-0"
              style={{ transformOrigin: "50% 100%", "--s0": c.s0, "--s1": c.s1, animation: `aur-sway ${c.sway / sp}s ease-in-out ${c.delay}s infinite`, willChange: "transform" }}
            >
              <div
                className="aur-anim absolute inset-y-0"
                style={{
                  left: "-15%",
                  width: "130%",
                  background: curtainGradient(c.tint, accent),
                  WebkitMaskImage: raysMask(c.p),
                  maskImage: raysMask(c.p),
                  animation: `aur-rays ${c.ray / sp}s ease-in-out ${c.delay}s infinite, aur-pulse ${c.pulse / sp}s ease-in-out ${c.delay}s infinite`,
                  willChange: "transform, opacity",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {children}
    </div>
  );
}

export default memo(AuroraBorealis);
