import React from "react";

// Patinoire
function Rink({ x, y, gradientId }) {
  const marks = [
    "M-70 -4 Q-20 -18 40 -8",
    "M-40 8 Q10 16 70 4",
    "M-84 2 Q-30 -10 20 6",
    "M10 -12 Q55 -6 88 6",
    "M-60 12 Q-10 6 30 14",
    "M-20 -14 Q30 -16 70 -6",
  ];

  const sparkles = [
    [-60, -4], [20, 10], [64, -8],
    [-20, 12], [84, 4], [-84, 6],
  ];

  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="3" rx="114" ry="31" fill="#5b0a17" opacity=".3" />
      <ellipse cx="0" cy="0" rx="112" ry="30" fill="#fff" />
      <ellipse cx="0" cy="1" rx="104" ry="25" fill={`url(#${gradientId})`} />
      <ellipse cx="-24" cy="-8" rx="70" ry="10" fill="#fff" opacity=".35" />

      {marks.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#fff"
          strokeWidth="1"
          opacity=".7"
        />
      ))}

      {sparkles.map(([sx, sy], i) => (
        <path
          key={i}
          className="ice-sparkle"
          d={`M${sx} ${sy - 4}L${sx + 1.2} ${sy - 1}L${sx + 4} ${sy}L${sx + 1.2} ${sy + 1}L${sx} ${sy + 4}L${sx - 1.2} ${sy + 1}L${sx - 4} ${sy}L${sx - 1.2} ${sy - 1}Z`}
          fill="#fff"
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}

      <path
        d="M-112 0 A112 30 0 0 0 112 0"
        fill="none"
        stroke="#e8939a"
        strokeWidth="2"
        opacity=".5"
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  SKATING STRIDE                                                     */
/*  A skater does not walk: one leg PUSHES the blade out to the side/  */
/*  back, the other one GLIDES on a bent knee while the free leg       */
/*  recovers. These 4 poses are blended in a smooth loop.              */
/*  (the skater faces +x; blades stay flat on the ice when gliding)    */
/* ------------------------------------------------------------------ */

const POSES = {
  push:    { k: [-4, -6.2],  a: [-10.5, -1.4] }, // leg extended behind, blade pushing
  recover: { k: [4.5, -6.6], a: [8, -4.8] },     // free leg brought forward, lifted
  glide:   { k: [4.2, -5.4], a: [3, -1.4] },     // blade placed in front, knee bent
  carry:   { k: [2.2, -5.8], a: [-1.5, -1.4] },  // body weight over the gliding blade
};

const legD = (p) => `M0 -10 L${p.k[0]} ${p.k[1]} L${p.a[0]} ${p.a[1]}`;
const bladeD = (p) => {
  const [x, y] = p.a;
  return `M${x - 5.5} ${y + 1.7} L${x + 6.5} ${y + 1.7} Q${x + 9} ${y + 1.7} ${x + 8.4} ${y - 0.5}`;
};
const bootD = (p) => {
  const [x, y] = p.a;
  return `M${x - 3} ${y - 2.6} L${x + 3.6} ${y - 2.6} L${x + 3.6} ${y + 0.9} L${x - 3} ${y + 0.9}Z`;
};

const SPLINES = Array(4).fill("0.45 0 0.55 1").join(";");
const TIMES = "0;0.25;0.5;0.75;1";

function Anim({ attr, values, dur }) {
  return (
    <animate
      attributeName={attr}
      values={values.join(";")}
      keyTimes={TIMES}
      calcMode="spline"
      keySplines={SPLINES}
      dur={`${dur}s`}
      repeatCount="indefinite"
    />
  );
}

// one leg with its boot and its blade
function Leg({ seq, dur }) {
  const poses = seq.map((n) => POSES[n]);
  return (
    <g>
      <path d={legD(poses[0])} stroke="#2a1a22" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <Anim attr="d" values={poses.map(legD)} dur={dur} />
      </path>
      <path d={bootD(poses[0])} fill="#3a2630" stroke="#3a2630" strokeWidth="1" strokeLinejoin="round">
        <Anim attr="d" values={poses.map(bootD)} dur={dur} />
      </path>
      <path d={bladeD(poses[0])} stroke="#eef3fb" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <Anim attr="d" values={poses.map(bladeD)} dur={dur} />
      </path>
    </g>
  );
}

// arm swinging around the shoulder (opposite to the leg on the same side)
function Arm({ coat, phase, dur }) {
  const v = phase === 0 ? "34 0 -22;-34 0 -22;34 0 -22" : "-34 0 -22;34 0 -22;-34 0 -22";
  return (
    <g>
      <path d="M0 -22 L9.5 -17.5" stroke={coat} strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <circle cx="10" cy="-17.2" r="1.9" fill="#f2c9a5" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        values={v}
        keyTimes="0;0.5;1"
        calcMode="spline"
        keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
        dur={`${dur}s`}
        repeatCount="indefinite"
      />
    </g>
  );
}

// Patineur
function Skater({ coat, hat, scarf, stride = 1.5 }) {
  return (
    <g>
      {/* ombre + traces laissées sur la glace */}
      <ellipse cx="0" cy="1.2" rx="11" ry="2.4" fill="#5b0a17" opacity=".2" />
      <path d="M-40 0.8 Q-22 1.8 -8 0.6" stroke="#fff" strokeWidth=".9" strokeLinecap="round" fill="none" opacity=".45" />
      <path d="M-34 2.2 Q-20 2.8 -9 1.8" stroke="#bfe6f7" strokeWidth=".7" strokeLinecap="round" fill="none" opacity=".4" />

      {/* le corps plie légèrement les genoux à chaque poussée */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0;0 1.1;0 0;0 1.1;0 0"
          keyTimes={TIMES}
          calcMode="spline"
          keySplines={SPLINES}
          dur={`${stride}s`}
          repeatCount="indefinite"
        />

        {/* Jambes : poussée / glissade (décalées d'un demi-cycle) */}
        <Leg seq={["push", "recover", "glide", "carry", "push"]} dur={stride} />
        <Leg seq={["glide", "carry", "push", "recover", "glide"]} dur={stride} />

        {/* Buste penché vers l'avant */}
        <g transform="rotate(10 0 -10)">
          <Arm coat={coat} phase={1} dur={stride} />

          {/* Manteau */}
          <path d="M-7 -11 Q-8.4 -23 0 -27 Q8.4 -23 7 -11Z" fill={coat} />
          <path d="M-7 -12.5 H7" stroke="#000" strokeOpacity=".18" strokeWidth="1" />

          <Arm coat={coat} phase={0} dur={stride} />

          {/* Écharpe qui flotte derrière */}
          <path d="M-3 -25 Q-10 -25 -15 -21 Q-19 -19 -23 -21" fill="none" stroke={scarf} strokeWidth="2.6" strokeLinecap="round">
            <animate
              attributeName="d"
              values="M-3 -25 Q-10 -25 -15 -21 Q-19 -19 -23 -21;M-3 -25 Q-10 -23 -15 -24.5 Q-19 -26 -23 -23.5;M-3 -25 Q-10 -25 -15 -21 Q-19 -19 -23 -21"
              dur=".9s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
            />
          </path>
          <path d="M-5 -26 H5 L4 -23 H-4Z" fill={scarf} />

          {/* Tête */}
          <circle cx="1" cy="-31.5" r="5.2" fill="#f2c9a5" />
          <circle cx="3" cy="-31.8" r=".7" fill="#2a1a22" />

          {/* Bonnet */}
          <path d="M-4.6 -33 Q1 -43 6.6 -33Z" fill={hat} />
          <circle cx="1" cy="-42" r="2" fill="#fff">
            <animate attributeName="cy" values="-42;-42.9;-42" dur={`${stride / 2}s`} repeatCount="indefinite" />
          </circle>
        </g>
      </g>
    </g>
  );
}

// Données des patineurs
const SKATERS = [
  { dx: 0, dy: 0, rx: 80, ry: 15, duration: "11.42s", direction: 1, coat: "#2a6fd1", hat: "#c8202e", scarf: "#fff", size: 1, stride: 1.5 },
  { dx: -9, dy: 4, rx: 48, ry: 9, duration: "8.73s", direction: -1, coat: "#c8202e", hat: "#fff", scarf: "#f5c542", size: 0.95, stride: 1.25 },
  { dx: 15, dy: -5, rx: 92, ry: 17, duration: "14.96s", direction: 1, coat: "#f5c542", hat: "#2f8f5b", scarf: "#c8202e", size: 1.05, stride: 1.7 },
];

export default function IceSkating({
  x = 265,
  y = 553,
  gradientId = "ice-gradient",
}) {
  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bdeaff" />
          <stop offset="50%" stopColor="#83c9e8" />
          <stop offset="100%" stopColor="#d8f4ff" />
        </linearGradient>
      </defs>

      <style>{`
        .ice-sparkle {
          animation: ice-twinkle 2s ease-in-out infinite;
        }

        @keyframes ice-twinkle {
          0%, 100% { opacity: .35; }
          50% { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ice-sparkle { animation: none; }
        }
      `}</style>

      <Rink x={x} y={y} gradientId={gradientId} />

      {SKATERS.map((s, i) => {
        const cx = x + s.dx;
        const cy = y + s.dy;

        // Le sens de rotation est inversé pour le deuxième patineur
        const path =
          s.direction === 1
            ? `M ${cx + s.rx} ${cy} A ${s.rx} ${s.ry} 0 1 1 ${cx - s.rx} ${cy} A ${s.rx} ${s.ry} 0 1 1 ${cx + s.rx} ${cy}`
            : `M ${cx + s.rx} ${cy} A ${s.rx} ${s.ry} 0 1 0 ${cx - s.rx} ${cy} A ${s.rx} ${s.ry} 0 1 0 ${cx + s.rx} ${cy}`;

        // Perspective : plus grand quand il passe devant (bas de la piste), plus petit au fond.
        // Départ à droite : sens horaire → devant à 25 %, fond à 75 % ; antihoraire → l'inverse.
        const persp = s.direction === 1 ? "1;1.1;1;0.9;1" : "1;0.9;1;1.1;1";

        return (
          <g key={i}>
            <animateMotion dur={s.duration} repeatCount="indefinite" path={path} />

            <g transform={`scale(${s.size})`}>
              {/* échelle de perspective */}
              <g>
                <animateTransform
                  attributeName="transform"
                  type="scale"
                  values={persp}
                  keyTimes="0;0.25;0.5;0.75;1"
                  dur={s.duration}
                  repeatCount="indefinite"
                />

                {/* le patineur regarde toujours dans le sens où il glisse :
                    sur chaque demi-tour de piste il va d'un bout à l'autre,
                    on le retourne donc exactement aux deux extrémités */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="scale"
                    values="-1 1;1 1"
                    keyTimes="0;0.5"
                    calcMode="discrete"
                    dur={s.duration}
                    repeatCount="indefinite"
                  />
                  <Skater coat={s.coat} hat={s.hat} scarf={s.scarf} stride={s.stride} />
                </g>
              </g>
            </g>
          </g>
        );
      })}
    </g>
  );
}