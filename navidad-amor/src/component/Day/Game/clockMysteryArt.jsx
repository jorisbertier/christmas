import React from "react";

/* ------------------------------------------------------------------ */
/*  Visual language shared with the choir scene: night blue, flocked   */
/*  snow, warm windows, gold details.                                  */
/* ------------------------------------------------------------------ */

export function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/* ---------------- portraits (bust, viewBox 0 0 100 120) ---------------- */

const LOOKS = {
  anselmo: { skin: "#e0ac86", coat: "#6b3a1f", trim: "#d9a936", hair: "#cfcfd6", hs: "sides", stache: "#cfcfd6", brow: "thick", apron: true },
  lucien: { skin: "#f2c9a5", coat: "#3a3f5a", trim: "#d9a936", hair: "#cfcfd6", hs: "slick", monocle: true, brow: "sharp", mouth: "flat" },
  madeleine: { skin: "#f6d6bd", coat: "#9b1b2b", trim: "#efe2c7", hair: "#5a3a22", hs: "updo", earrings: true, brow: "arched" },
  nora: { skin: "#f2c9a5", coat: "#2a5aa0", trim: "#d9a936", hair: "#c05a1c", hs: "braid", hat: "cap", freckles: true },
  pip: { skin: "#f6d6bd", coat: "#1f7a4d", trim: "#c8202e", hair: "#c05a1c", hs: "none", hat: "elf", pointy: true, bigEyes: true },
  berta: { skin: "#f2c9a5", coat: "#7a4a2a", trim: "#efe2c7", hair: "#cfcfd6", hs: "none", hat: "bonnet", cheeks: true },
  eloy: { skin: "#c68a62", coat: "#1f5a3a", trim: "#8a6a3a", hair: "#5a3a22", hs: "short", beard: "#5a3a22", hat: "straw" },
  casimiro: { skin: "#e0ac86", coat: "#1e2f4a", trim: "#d9a936", hair: "#8a8a90", hs: "short", stache: "#8a8a90", hat: "guard", brow: "thick" },
  santa: { skin: "#f6d6bd", coat: "#c8202e", trim: "#ffffff", hair: "#ffffff", hs: "none", beard: "#ffffff", hat: "santa", cheeks: true },
  grinch: { skin: "#7cb04a", coat: "#4a4a52", trim: "#d9a936", hair: "#5d8a32", hs: "spiky", brow: "sly", mouth: "smirk", pointy: true },
  clara: { skin: "#f2c9a5", coat: "#9b1b2b", trim: "#efe2c7", hair: "#5a3a22", hs: "long", hat: "bonnet", bonnetColor: "#efe2c7" },
};

const Brow = ({ type }) => {
  const p = { stroke: "#2a1a14", strokeWidth: 2.4, strokeLinecap: "round", fill: "none" };
  if (type === "thick") return <g {...p} strokeWidth="3.4"><path d="M36 41H47M53 41H64" /></g>;
  if (type === "sharp") return <g {...p}><path d="M36 42L47 39M53 39L64 42" /></g>;
  if (type === "sly") return <g {...p} strokeWidth="3"><path d="M36 38L47 43M53 43L64 38" /></g>;
  if (type === "arched") return <g {...p}><path d="M36 42Q42 36 47 40M53 40Q58 36 64 42" /></g>;
  return <g {...p} strokeWidth="1.8"><path d="M37 41Q42 39 47 41M53 41Q58 39 63 41" /></g>;
};

export function Portrait({ id, size = 100, ring, className = "" }) {
  const k = LOOKS[id];
  if (!k) return null;
  const hairFront = {
    slick: <path d="M31 46Q30 22 50 22Q70 22 69 46Q64 33 50 33Q36 33 31 46Z" fill={k.hair} />,
    short: <path d="M31 46Q29 23 50 23Q71 23 69 46Q63 34 50 34Q37 34 31 46Z" fill={k.hair} />,
    long: <path d="M30 50Q28 22 50 22Q72 22 70 50Q64 34 50 34Q36 34 30 50Z" fill={k.hair} />,
    updo: <g fill={k.hair}><path d="M31 46Q30 24 50 24Q70 24 69 46Q64 34 50 34Q36 34 31 46Z" /><circle cx="50" cy="19" r="9" /></g>,
    braid: <path d="M31 46Q30 24 50 24Q70 24 69 46Q64 34 50 34Q36 34 31 46Z" fill={k.hair} />,
    sides: <g fill={k.hair}><path d="M31 54Q27 40 33 32Q35 42 35 54Z" /><path d="M69 54Q73 40 67 32Q65 42 65 54Z" /></g>,
    spiky: <g fill={k.hair}><path d="M32 40L28 18L40 30L46 10L52 28L62 12L64 32L74 20L68 42Q50 28 32 40Z" /></g>,
    none: null,
  }[k.hs];
  const hairBack = k.hs === "long" ? <path d="M29 48Q24 80 34 94L44 90L40 56Z M71 48Q76 80 66 94L56 90L60 56Z" fill={k.hair} /> : k.hs === "braid" ? <path d="M64 70Q76 80 70 100Q66 108 62 100Q68 88 60 76Z" fill={k.hair} /> : null;
  const hat = {
    bonnet: <g><path d="M27 48Q26 20 50 20Q74 20 73 48Q68 38 50 38Q32 38 27 48Z" fill={k.bonnetColor || "#efe2c7"} /><path d="M29 44Q50 34 71 44" fill="none" stroke="#9b1b2b" strokeWidth="3" /><circle cx="71" cy="45" r="4" fill="#9b1b2b" /></g>,
    cap: <g><path d="M30 38Q50 16 70 38Z" fill="#2a5aa0" /><rect x="28" y="36" width="44" height="5" rx="2" fill="#1c3f78" /><rect x="34" y="40" width="32" height="3" fill="#d9a936" /><path d="M30 41L22 44L34 44Z" fill="#1c3f78" /></g>,
    elf: <g><path d="M30 36Q50 30 70 36L62 8Q58 -2 50 6Z" fill="#c8202e" /><rect x="29" y="32" width="42" height="6" rx="3" fill="#fff" /><circle cx="52" cy="6" r="4" fill="#e8b84a" /></g>,
    straw: <g><ellipse cx="50" cy="34" rx="32" ry="6" fill="#d9b36a" /><path d="M36 34Q50 8 64 34Z" fill="#e6c27a" /><rect x="36" y="28" width="28" height="4" fill="#7a4a2a" /></g>,
    guard: <g><path d="M30 38Q50 14 70 38Z" fill="#1e2f4a" /><rect x="29" y="35" width="42" height="6" rx="2" fill="#15203a" /><circle cx="50" cy="30" r="4" fill="#d9a936" /><path d="M30 40Q50 46 70 40L68 44Q50 50 32 44Z" fill="#0f1830" /></g>,
    santa: <g><path d="M28 40Q36 4 72 16Q70 28 72 40Z" fill="#c8202e" /><rect x="26" y="34" width="48" height="9" rx="4" fill="#fff" /><circle cx="72" cy="16" r="6" fill="#fff" /></g>,
  }[k.hat];
  const mouth = k.mouth === "flat" ? "M44 62H56" : k.mouth === "smirk" ? "M43 63Q52 66 58 59" : "M43 61Q50 67 57 61";
  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2} className={className} aria-hidden="true">
      {hairBack}
      <path d="M8 120Q10 88 34 82L50 92L66 82Q90 88 92 120Z" fill={k.coat} />
      <path d="M34 82L50 98L66 82L62 80L50 90L38 80Z" fill={k.trim} />
      {k.apron && <path d="M36 100H64V120H36Z" fill="#efe2c7" opacity=".9" />}
      {id === "santa" && <path d="M8 120Q10 88 34 82L50 92L66 82Q90 88 92 120Z" fill="#c8202e" stroke="#fff" strokeWidth="3" />}
      <rect x="44" y="68" width="12" height="16" fill={k.skin} />
      {k.pointy ? <g fill={k.skin}><path d="M31 50L14 38L32 58Z" /><path d="M69 50L86 38L68 58Z" /></g> : <g fill={k.skin}><ellipse cx="31" cy="52" rx="4" ry="6" /><ellipse cx="69" cy="52" rx="4" ry="6" /></g>}
      <ellipse cx="50" cy="50" rx="19" ry="22" fill={k.skin} />
      {k.beard && <path d="M31 54Q35 86 50 88Q65 86 69 54Q58 68 50 66Q42 68 31 54Z" fill={k.beard} />}
      {hairFront}
      <Brow type={k.brow} />
      <g>
        <ellipse cx="42" cy="49" rx={k.bigEyes ? 4.6 : 3.4} ry={k.bigEyes ? 5 : 3.6} fill="#fff" />
        <ellipse cx="58" cy="49" rx={k.bigEyes ? 4.6 : 3.4} ry={k.bigEyes ? 5 : 3.6} fill="#fff" />
        <circle cx="42.6" cy="49.4" r={k.bigEyes ? 2.6 : 2} fill="#2a1a14" />
        <circle cx="58.6" cy="49.4" r={k.bigEyes ? 2.6 : 2} fill="#2a1a14" />
      </g>
      {k.monocle && <g fill="none" stroke="#d9a936" strokeWidth="1.8"><circle cx="58" cy="49" r="6.4" /><path d="M64 52Q70 66 66 78" /></g>}
      {k.freckles && <g fill="#b2603a" opacity=".6">{[[38, 55], [42, 57], [58, 57], [62, 55], [46, 56], [54, 56]].map(([x, y]) => <circle key={x} cx={x} cy={y} r=".9" />)}</g>}
      {k.cheeks && <g fill="#ff8a8a" opacity=".5"><circle cx="37" cy="58" r="4" /><circle cx="63" cy="58" r="4" /></g>}
      <path d="M50 52Q48 57 51 58" fill="none" stroke="#a8683a" strokeWidth="1.4" strokeLinecap="round" opacity=".8" />
      {k.stache && <path d="M38 61Q50 54 62 61Q56 67 50 62Q44 67 38 61Z" fill={k.stache} />}
      {k.beard && <path d="M40 62Q50 56 60 62Q54 68 50 63Q46 68 40 62Z" fill={k.beard} />}
      <path d={mouth} fill="none" stroke="#7a1022" strokeWidth="2" strokeLinecap="round" />
      {k.earrings && <g fill="#d9a936"><circle cx="31" cy="60" r="2.4" /><circle cx="69" cy="60" r="2.4" /></g>}
      {hat}
      {ring && <circle cx="50" cy="60" r="56" fill="none" stroke={ring} strokeWidth="3" opacity=".0" />}
    </svg>
  );
}

/* ---------------- shared SVG definitions ---------------- */

function tierPath(cx, top, bottom, hw, seed) {
  const r = rng(seed);
  const h = bottom - top;
  const n = Math.max(4, Math.round(hw / 8));
  const step = (2 * hw) / n;
  let d = `M${cx} ${top} C${cx + hw * 0.25} ${top + h * 0.25} ${cx + hw * 0.7} ${top + h * 0.6} ${cx + hw} ${bottom - 4}`;
  for (let i = 0; i < n; i++) {
    const x0 = cx + hw - i * step;
    const x1 = x0 - step;
    d += ` Q${((x0 + x1) / 2).toFixed(1)} ${(bottom + 6 + r() * 10).toFixed(1)} ${x1.toFixed(1)} ${(bottom - 4 + (r() - 0.5) * 5).toFixed(1)}`;
  }
  d += ` C${cx - hw * 0.7} ${top + h * 0.6} ${cx - hw * 0.25} ${top + h * 0.25} ${cx} ${top} Z`;
  return d;
}
const FIR = [[0, 46, 22], [30, 80, 36], [62, 120, 48], [96, 162, 58], [136, 206, 68]].map(([t, b, hw], i) => ({ t, d: tierPath(0, t, b, hw, 11 + i * 7) }));

export function SceneDefs() {
  const lin = (id, stops, x2 = 0, y2 = 1) => (
    <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>{stops.map(([o, c], i) => <stop key={i} offset={o} stopColor={c} />)}</linearGradient>
  );
  return (
    <defs>
      {lin("mSky", [[0, "#060d22"], [0.45, "#0f224a"], [0.8, "#22437a"], [1, "#3b629a"]])}
      <linearGradient id="mSnow" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="0" y2="700">
        <stop offset="0" stopColor="#a9c0e4" /><stop offset=".35" stopColor="#d9e6fb" /><stop offset="1" stopColor="#8ba6d2" />
      </linearGradient>
      {lin("mFir", [[0, "#1f6140"], [1, "#07261a"]], 1, 1)}
      {lin("mFirSnow", [[0, "#ffffff"], [0.55, "#d6e4f8"], [1, "#93acd8"]], 1, 1)}
      {lin("mRoofSnow", [[0, "#ffffff"], [0.6, "#e2ecfb"], [1, "#a9bfe3"]])}
      {lin("mPlaster", [[0, "#e6d2b0"], [1, "#a98e6a"]])}
      {lin("mLog", [[0, "#93402a"], [1, "#3a1109"]])}
      {lin("mSlate", [[0, "#4a4a6e"], [1, "#1d1d38"]])}
      {lin("mTile", [[0, "#a8402e"], [1, "#5a1a14"]])}
      {lin("mStone", [[0, "#d9d0c0"], [1, "#9d927e"]])}
      {lin("mBarn", [[0, "#b3262a"], [1, "#5a0f14"]])}
      {lin("mGold", [[0, "#fff3bf"], [0.5, "#e8b84a"], [1, "#a8721f"]], 1, 1)}
      <radialGradient id="mWin" cx="50%" cy="55%" r="60%"><stop offset="0" stopColor="#fff6b0" /><stop offset=".45" stopColor="#ffb02e" /><stop offset="1" stopColor="#e0481a" /></radialGradient>
      <radialGradient id="mGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffc24a" stopOpacity=".95" /><stop offset="1" stopColor="#ff7a1a" stopOpacity="0" /></radialGradient>
      <radialGradient id="mMoon" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff8d8" stopOpacity=".9" /><stop offset=".35" stopColor="#bcd0ff" stopOpacity=".28" /><stop offset="1" stopColor="#bcd0ff" stopOpacity="0" /></radialGradient>
      <radialGradient id="mGreen" cx="50%" cy="60%" r="60%"><stop offset="0" stopColor="#c8ffb0" stopOpacity=".9" /><stop offset="1" stopColor="#3aa05a" stopOpacity=".15" /></radialGradient>
      <radialGradient id="mVig" cx="50%" cy="50%" r="75%"><stop offset=".55" stopColor="#020611" stopOpacity="0" /><stop offset="1" stopColor="#020611" stopOpacity=".55" /></radialGradient>
      <mask id="mMoonMask"><rect x="100" y="30" width="140" height="140" fill="#fff" /><circle cx="186" cy="88" r="31" fill="#000" /></mask>
      <filter id="mFlock" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="3" result="n1" />
        <feDisplacementMap in="SourceGraphic" in2="n1" scale="8" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="8" result="n2" />
        <feColorMatrix in="n2" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 11 -5.9" result="speck" />
        <feComposite in="speck" in2="d" operator="in" result="speckIn" />
        <feMerge><feMergeNode in="d" /><feMergeNode in="speckIn" /></feMerge>
      </filter>
    </defs>
  );
}

const STARS = (() => { const r = rng(8); return Array.from({ length: 60 }, (_, i) => ({ x: -200 + r() * 1600, y: -120 + r() * 360, s: 0.8 + r() * 1.7, c: i % 3 })); })();
const FOREST = (() => { const r = rng(12); const o = []; for (let x = -300; x < 1500; x += 16 + r() * 12) o.push({ x, h: 26 + r() * 38, w: 12 + r() * 10 }); return o; })();

export function Sky() {
  return (
    <g>
      <rect x="-1500" y="-1200" width="4200" height="1900" fill="url(#mSky)" />
      {STARS.map((s, i) => <circle key={i} className={`m-tw${(s.c % 3) + 1}`} cx={s.x} cy={s.y} r={s.s} fill="#fff" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />)}
      <circle cx="170" cy="96" r="120" fill="url(#mMoon)" />
      <circle cx="170" cy="96" r="34" fill="#fdf6d8" mask="url(#mMoonMask)" transform="translate(-16 0)" />
      <path d="M-1500 250 C-1000 190 -700 220 -300 220 C0 190 200 210 420 228 C640 206 900 190 1200 220 C1500 186 2000 210 2700 250 V300 H-1500Z" fill="#17305e" />
      {FOREST.map((f, i) => (
        <g key={i} transform={`translate(${f.x} 262)`}>
          <path d={`M0 ${-f.h} L${f.w} 0 H${-f.w}Z`} fill="#0a1d3c" />
          <path d={`M0 ${-f.h} L${f.w * 0.35} ${-f.h * 0.55} H${-f.w * 0.35}Z`} fill="#c9daf5" opacity=".5" />
        </g>
      ))}
      <rect x="-1500" y="262" width="4200" height="1500" fill="url(#mSnow)" />
      <path d="M-1500 262 C-800 250 -300 270 200 262 C600 254 900 270 1300 260 C1800 250 2400 266 2700 262 V272 H-1500Z" fill="#c8d9f3" opacity=".7" />
    </g>
  );
}

export function Smoke({ x, y }) {
  return <g>{[0, 1, 2].map((i) => <circle key={i} className="m-puff" cx={x} cy={y} r={4 + i} fill="#dbe8ff" style={{ animationDelay: `${i * 1.3}s` }} />)}</g>;
}

export function Win({ x, y, w, h, d = 0 }) {
  return (
    <g className="m-lit" style={{ animationDelay: `${d}s` }}>
      <ellipse cx={x + w / 2} cy={y + h / 2} rx={w * 1.3} ry={h * 1.05} fill="url(#mGlow)" opacity=".8" />
      <rect x={x - 1.6} y={y - 1.6} width={w + 3.2} height={h + 3.2} fill="#2b150c" />
      <rect x={x} y={y} width={w} height={h} fill="url(#mWin)" />
      <path d={`M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}`} stroke="#2b150c" strokeWidth="1.4" opacity=".85" />
      <rect x={x - 3} y={y + h + 1.6} width={w + 6} height="3" fill="#fff" opacity=".9" />
    </g>
  );
}

export function House({ x, y, w = 100, floors = 2, wall = "timber", roof = "mSlate", seed = 1, lantern = false, children }) {
  const fh = 46;
  const h = floors * fh;
  const roofH = w * 0.5;
  const cols = w >= 100 ? 3 : 2;
  const r = rng(seed);
  const wins = [];
  for (let f = 0; f < floors; f++) for (let i = 0; i < cols; i++) {
    const cx = cols === 3 ? (i - 1) * (w / 3) : (i === 0 ? -1 : 1) * (w / 4);
    if (f === 0 && cx === 0) continue;
    wins.push({ cx, y: -(f + 1) * fh + 12, d: r() * 3 });
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="2" rx={w * 0.7} ry="7" fill="#fff" opacity=".7" />
      <rect x={-w / 2} y={-h} width={w} height={h} fill={wall === "log" ? "url(#mLog)" : wall === "stone" ? "url(#mStone)" : "url(#mPlaster)"} />
      {wall === "log" ? Array.from({ length: Math.floor(h / 7) }, (_, i) => <path key={i} d={`M${-w / 2} ${-h + 7 * (i + 1)}H${w / 2}`} stroke="#220a05" strokeWidth="1.2" opacity=".6" />) : (
        <g stroke="#3a160c" strokeWidth="4" strokeLinecap="square" fill="none">
          <path d={`M${-w / 2} ${-h}V0M${w / 2} ${-h}V0M0 ${-h}V0`} />
          {Array.from({ length: floors + 1 }, (_, i) => <path key={i} d={`M${-w / 2 - 3} ${-i * fh}H${w / 2 + 3}`} strokeWidth="4" />)}
        </g>
      )}
      {wins.map((wn, i) => <Win key={i} x={wn.cx - 8} y={wn.y} w={16} h={21} d={wn.d} />)}
      <path d="M-8 0 V-20 Q0 -32 8 -20 V0Z" fill="#2b150c" />
      <path d="M-5.5 0 V-19 Q0 -28 5.5 -19 V0Z" fill="url(#mWin)" className="m-lit" />
      {lantern && <g transform={`translate(${w / 2 - 12} -26)`}><circle r="16" fill="url(#mGlow)" className="m-flick" /><rect x="-3" y="-5" width="6" height="9" rx="1.4" fill="url(#mWin)" stroke="#1c1218" /></g>}
      <rect x={w / 2 - 26} y={-h - roofH * 0.7} width="12" height={roofH * 0.7 + 4} fill="#7a2418" />
      <Smoke x={w / 2 - 20} y={-h - roofH * 0.7 - 6} />
      <path d={`M${-w / 2 - 10} ${-h} H${w / 2 + 10} L0 ${-h - roofH}Z`} fill={`url(#${roof})`} />
      <path d={`M${-w / 2 - 3} ${-h - 3} L0 ${-h - roofH + 4} L${w / 2 + 3} ${-h - 3} Q${w / 2 - 8} ${-h + 5} ${w / 2 - 18} ${-h - 3} Q${w / 4} ${-h + 6} ${w / 8} ${-h - 3} Q0 ${-h + 6} ${-w / 8} ${-h - 3} Q${-w / 4} ${-h + 6} ${-w / 2 + 18} ${-h - 3} Q${-w / 2 + 8} ${-h + 5} ${-w / 2 - 3} ${-h - 3}Z`} fill="url(#mRoofSnow)" />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} className={`m-tw${(i % 3) + 1}`} cx={-w / 2 - 8 + ((i + 0.5) / 5) * (w / 2 + 8)} cy={-h + 8 - ((i + 0.5) / 5) * roofH} r="2.3" fill={["#ffd45a", "#fff0a8", "#ff9a4a"][i % 3]} style={{ animationDelay: `${i * 0.3}s` }} />)}
      {children}
    </g>
  );
}

export function SmallFir({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(0 -206)`}>
      <ellipse cx="0" cy="206" rx="60" ry="10" fill="#fff" opacity=".85" />
      <g filter="url(#mFlock)">{[...FIR].reverse().map((t) => <g key={t.t}><path d={t.d} fill="url(#mFir)" /><path d={t.d} fill="url(#mFirSnow)" transform={`translate(0 ${t.t}) scale(.92 .74) translate(0 ${-t.t})`} /></g>)}</g>
    </g>
  );
}

const TREE_LIGHTS = (() => { const r = rng(31); return Array.from({ length: 44 }, (_, i) => { const y = 16 + r() * 186; const hw = 8 + y * 0.31; return { x: (r() * 2 - 1) * hw * 0.92, y, c: ["#ffd45a", "#fff0a8", "#ffb347", "#ffffff", "#ff6b4a"][i % 5], d: r() * 3, k: (i % 3) + 1 }; }); })();
export function BigTree({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(0 -206)`}>
      <ellipse cx="0" cy="206" rx="86" ry="14" fill="#fff" opacity=".9" />
      <g filter="url(#mFlock)">{[...FIR].reverse().map((t) => <g key={t.t}><path d={t.d} fill="url(#mFir)" /><path d={t.d} fill="url(#mFirSnow)" transform={`translate(0 ${t.t}) scale(.86 .66) translate(0 ${-t.t})`} opacity=".92" /></g>)}</g>
      {TREE_LIGHTS.map((l, i) => <g key={i}><circle cx={l.x} cy={l.y} r="5.5" fill={l.c} opacity=".22" /><circle className={`m-tw${l.k}`} cx={l.x} cy={l.y} r="2.3" fill={l.c} style={{ animationDelay: `${l.d}s` }} /></g>)}
      <g transform="translate(0 -6)"><circle r="26" fill="url(#mGlow)" className="m-flick" /><path className="m-star" d="M0 -17 L4.2 -5 L17 -5 L6.8 3 L10.4 15 L0 8 L-10.4 15 L-6.8 3 L-17 -5 L-4.2 -5Z" fill="url(#mGold)" stroke="#fff3bf" /></g>
    </g>
  );
}

export function Lamp({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="3" rx="22" ry="5" fill="#ffc24a" opacity=".28" className="m-flick" />
      <ellipse cx="0" cy="-92" rx="44" ry="44" fill="url(#mGlow)" className="m-flick" />
      <rect x="-2.4" y="-92" width="4.8" height="92" fill="#15101a" />
      <path d="M-11 -112 H11 L8 -92 H-8Z" fill="url(#mWin)" stroke="#15101a" strokeWidth="2" className="m-flick" />
      <path d="M-14 -112 L0 -124 L14 -112Z" fill="#15101a" />
      <path d="M-13 -113 L0 -122 L13 -113Q0 -116 -13 -113Z" fill="#fff" />
    </g>
  );
}

export function Garland({ x1, y1, x2, y2, sag = 14, n = 9, seed = 1 }) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 + sag * 2;
  return (
    <g>
      <path d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} fill="none" stroke="#10261c" strokeWidth="2" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n;
        const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
        const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
        const c = ["#ffd45a", "#fff0a8", "#ff9a4a", "#ff6b6b"][(i + seed) % 4];
        return <g key={i}><circle cx={px} cy={py + 4} r="7" fill={c} opacity=".22" /><circle className={`m-tw${((i + seed) % 3) + 1}`} cx={px} cy={py + 4} r="3.3" fill={c} style={{ animationDelay: `${(i % 5) * 0.3}s` }} /></g>;
      })}
    </g>
  );
}

/* ---------------- special buildings ---------------- */

export function Tower({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="3" rx="64" ry="9" fill="#fff" opacity=".7" />
      {/* scaffold used by the Grinch */}
      <g stroke="#8a6a3a" strokeWidth="2.4" opacity=".85"><path d="M40 0V-150M56 0V-150M40 -50H56M40 -100H56M40 -50L56 -100M40 -100L56 -150" /></g>
      <rect x="-36" y="-180" width="72" height="180" fill="url(#mStone)" />
      <path d="M-36 -180V0M36 -180V0" stroke="#7d725e" strokeWidth="3" />
      {[-30, -60, -90, -120, -150].map((qy) => <path key={qy} d={`M-36 ${qy}H36`} stroke="#8b806c" strokeWidth="1" opacity=".5" />)}
      <circle cx="0" cy="-130" r="30" fill="#fff8e8" stroke="#8a5a12" strokeWidth="3" />
      <circle cx="0" cy="-130" r="38" fill="url(#mGlow)" className="m-flick" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d="M0 -27V-24" stroke="#3a2410" strokeWidth="2" transform={`translate(0 -130) rotate(${i * 30})`} />)}
      <path d="M0 -130V-156M0 -130H0" stroke="#3a2410" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M0 -130L1 -154" stroke="#3a2410" strokeWidth="3" strokeLinecap="round" />
      <rect x="-9" y="-92" width="18" height="24" rx="8" fill="#15101a" />
      <path d="M-8 0 V-26 Q0 -40 8 -26 V0Z" fill="#2b150c" />
      <path d="M-46 -180 H46 L0 -250Z" fill="url(#mSlate)" />
      <path d="M-38 -182 L0 -244 L38 -182 Q26 -176 14 -183 Q0 -175 -14 -183 Q-26 -176 -38 -182Z" fill="url(#mRoofSnow)" />
      <path d="M0 -250V-272M-6 -264H6" stroke="url(#mGold)" strokeWidth="3" strokeLinecap="round" />
      <path d="M-14 -178 V-168 H14 V-178Z" fill="#15101a" />
      <path d="M-16 -4 H16" stroke="#e0b030" strokeWidth="3" strokeDasharray="4 4" opacity=".8" />
    </g>
  );
}

export function TownHall({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="3" rx="100" ry="9" fill="#fff" opacity=".7" />
      <rect x="-76" y="-90" width="152" height="90" fill="url(#mStone)" />
      <path d="M-86 -90 L0 -138 L86 -90Z" fill="url(#mSlate)" />
      <path d="M-76 -92 L0 -134 L76 -92 Q60 -86 44 -93 Q22 -85 0 -93 Q-22 -85 -44 -93 Q-60 -86 -76 -92Z" fill="url(#mRoofSnow)" />
      <circle cx="0" cy="-108" r="9" fill="#fff8e8" stroke="#8a5a12" strokeWidth="2" />
      <path d="M0 -108V-114M0 -108L4 -106" stroke="#3a2410" strokeWidth="1.6" strokeLinecap="round" />
      {[-56, -28, 28, 56].map((cx, i) => <Win key={cx} x={cx - 9} y={-66} w={18} h={26} d={i * 0.6} />)}
      {[-14, 14].map((cx) => <rect key={cx} x={cx - 3} y="-88" width="6" height="88" fill="#efe6d4" stroke="#b9a98a" />)}
      <path d="M-12 0 V-30 Q0 -44 12 -30 V0Z" fill="#2b150c" /><path d="M-9 0 V-29 Q0 -39 9 -29 V0Z" fill="url(#mWin)" className="m-lit" />
      <path d="M62 -138V-170" stroke="#3a2410" strokeWidth="2" /><path className="m-flag" d="M62 -170 L88 -164 L62 -156Z" fill="#c8202e" />
    </g>
  );
}

export function Greenhouse({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="3" rx="84" ry="9" fill="#fff" opacity=".7" />
      <path d="M-70 0 V-50 Q-70 -92 0 -96 Q70 -92 70 -50 V0Z" fill="url(#mGreen)" stroke="#cfe9ff" strokeWidth="2.4" />
      <g stroke="#cfe9ff" strokeWidth="1.4" opacity=".8"><path d="M-35 0 V-92M0 0 V-96M35 0 V-92M-70 -48H70" /></g>
      {[-48, -20, 14, 44].map((px, i) => <g key={px} fill="#2f8f4b"><path d={`M${px} -2 Q${px - 10} -26 ${px - 3} -34 Q${px + 4} -22 ${px} -2Z`} /><circle cx={px + 6} cy={-24 - (i % 2) * 8} r="4" fill={["#ff6b8a", "#ffd45a", "#ff9a4a", "#f5f5ff"][i]} /></g>)}
      <path d="M-70 -50 Q-70 -92 0 -96 Q70 -92 70 -50 Q60 -80 0 -84 Q-60 -80 -70 -50Z" fill="url(#mRoofSnow)" opacity=".95" />
    </g>
  );
}

export function Barn({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="3" rx="94" ry="9" fill="#fff" opacity=".7" />
      <rect x="-70" y="-76" width="140" height="76" fill="url(#mBarn)" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-66 + i * 12} -76V0`} stroke="#3a080c" strokeWidth="1" opacity=".5" />)}
      <path d="M-82 -76 L0 -122 L82 -76Z" fill="#4a0a10" />
      <path d="M-72 -78 L0 -118 L72 -78 Q50 -72 30 -79 Q10 -71 -10 -79 Q-30 -72 -50 -79 Q-62 -73 -72 -78Z" fill="url(#mRoofSnow)" />
      <g className="m-star"><path d="M0 -92 L5 -82 L16 -82 L7 -75 L10 -64 L0 -70 L-10 -64 L-7 -75 L-16 -82 L-5 -82Z" fill="url(#mGold)" /></g>
      <circle cx="0" cy="-80" r="28" fill="url(#mGlow)" className="m-flick" />
      <rect x="-24" y="-52" width="48" height="52" fill="#2b0a0a" /><rect x="-21" y="-49" width="42" height="49" fill="url(#mWin)" className="m-lit" />
      <path d="M-21 -49 L21 0M21 -49 L-21 0M0 -49V0" stroke="#4a0a10" strokeWidth="3" />
    </g>
  );
}

export function Plaza({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="0" rx="150" ry="36" fill="#eef4ff" opacity=".8" />
      <ellipse cx="0" cy="0" rx="120" ry="27" fill="none" stroke="#b9cbe8" strokeWidth="2" strokeDasharray="6 6" />
      <BigTree x={0} y={6} s={0.62} />
      <Lamp x={-96} y={4} s={0.5} />
      <Lamp x={96} y={4} s={0.5} />
      {[[-46, 20], [-30, 24], [-14, 26], [14, 26], [30, 24], [46, 20]].map(([px, py], i) => (
        <g key={i} transform={`translate(${px} ${py})`}><path d="M-3 0Q-4 -10 0 -12Q4 -10 3 0Z" fill={["#9b1b2b", "#1f5a3a", "#efe2c7"][i % 3]} /><circle cy="-15" r="3.4" fill="#f2c9a5" /></g>
      ))}
    </g>
  );
}

/* ---------------- icons ---------------- */

export const Icon = {
  key: (p) => <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><circle cx="8" cy="12" r="4" /><path d="M12 12h9M18 12v4M21 12v3" /></svg>,
  lock: (p) => <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" /></svg>,
};
