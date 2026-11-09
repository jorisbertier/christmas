import React from "react";

/* ------------------------------------------------------------------ */
/*  Crèche de Noël — élément SVG SANS FOND, à poser dans le village    */
/*                                                                     */
/*  Utilisation (comme IceSkating) :                                   */
/*    <Creche x={500} y={540} scale={0.8} />                           */
/*                                                                     */
/*  - (x, y)  = centre de la base au sol (comme la patinoire)          */
/*  - scale   = taille (1 = environ 270 unités de large, 180 de haut)  */
/*  - idPrefix = à changer seulement si tu en mets plusieurs           */
/*  - showKings / showShepherds / showAngel : pour alléger la scène    */
/* ------------------------------------------------------------------ */

function Base({ p }) {
  const straw = [
    [-96, 2, 11], [-70, 9, 9], [-40, 12, 12], [-8, 14, 10], [26, 12, 11], [58, 10, 10], [88, 4, 11], [104, -4, 8],
    [-110, -3, 8], [-20, 5, 9], [40, 4, 9], [-60, -4, 8], [70, -5, 9],
  ];
  return (
    <g>
      <ellipse cx="0" cy="5" rx="134" ry="25" fill="#5b0a17" opacity=".3" />
      <ellipse cx="0" cy="1" rx="130" ry="23" fill="#7a5a30" />
      <ellipse cx="0" cy="-1" rx="124" ry="20" fill={`url(#${p}Ground)`} />
      <ellipse cx="-18" cy="-8" rx="84" ry="9" fill="#fff" opacity=".12" />
      {straw.map(([x, y, l], i) => <path key={i} d={`M${x} ${y}l${l} ${i % 2 ? -1.6 : 1.4}`} stroke="#f6dd8e" strokeWidth="1.2" strokeLinecap="round" opacity=".8" />)}
      {[-118, -92, 98, 120].map((x, i) => <ellipse key={i} cx={x} cy={3 + (i % 2) * 2} rx="4.4" ry="2.4" fill="#8a7a6a" stroke="#5a4a3a" strokeWidth=".6" />)}
    </g>
  );
}

function Rock({ p }) {
  return (
    <g>
      <path d="M-56 -5Q-60 -72 -30 -100Q0 -124 30 -100Q60 -72 56 -5Z" fill={`url(#${p}Rock)`} />
      <path d="M-39 -5Q-41 -62 -19 -84Q0 -97 19 -84Q41 -62 39 -5Z" fill="#150f22" />
      <ellipse cx="0" cy="-44" rx="40" ry="38" fill={`url(#${p}Warm)`} className="cr-tw" />
      {[[-40, -70], [-18, -102], [30, -96], [46, -50]].map(([x, y], i) => <path key={i} d={`M${x} ${y}l8 -3l5 5l-6 6z`} fill="#000" opacity=".16" />)}
    </g>
  );
}

function StableFront({ p }) {
  const thatch = [-60, -48, -36, -24, -12, 0, 12, 24, 36, 48, 60];
  return (
    <g>
      <rect x="-54" y="-98" width="7" height="94" fill={`url(#${p}Wood)`} /><rect x="47" y="-98" width="7" height="94" fill={`url(#${p}Wood)`} />
      <rect x="-60" y="-100" width="120" height="6" rx="2" fill={`url(#${p}Wood)`} />
      <path d="M-47 -94L-34 -100M47 -94L34 -100" stroke="#4a2a14" strokeWidth="4" strokeLinecap="round" />
      {/* toit de chaume */}
      <path d="M-76 -96L0 -144L76 -96Q62 -91 48 -94Q24 -88 0 -93Q-24 -88 -48 -94Q-62 -91 -76 -96Z" fill={`url(#${p}Thatch)`} stroke="#6a4818" strokeWidth="1.2" strokeLinejoin="round" />
      {thatch.map((x, i) => <path key={i} d={`M${x * 0.55} ${-118 + Math.abs(x) * 0.42}l${x * 0.16} ${16 - Math.abs(x) * 0.06}`} stroke="#f2d78a" strokeWidth="1" strokeLinecap="round" opacity=".7" />)}
      {/* petite étoile sur le faîte */}
      <path d="M0 -158L2.2 -151H9.6L3.6 -146.6L5.8 -139.6L0 -143.8L-5.8 -139.6L-3.6 -146.6L-9.6 -151H-2.2Z" fill={`url(#${p}Gold)`} stroke="#fff3bf" strokeWidth=".6" />
      {/* lanterne suspendue */}
      <g className="cr-sway" style={{ transformOrigin: "40px -94px" }}>
        <path d="M40 -94V-86" stroke="#6a4a2a" strokeWidth="1" />
        <circle cx="40" cy="-76" r="15" fill={`url(#${p}Warm)`} className="cr-tw" />
        <rect x="36" y="-87" width="8" height="2.6" rx="1" fill={`url(#${p}Gold)`} />
        <path d="M36.4 -84.6H43.6L42.6 -70H37.4Z" fill="#ffd98a" stroke="#8a5a12" strokeWidth=".9" />
        <ellipse className="cr-flame" cx="40" cy="-77" rx="1.5" ry="3.4" fill="#fff6c8" />
      </g>
      {/* guirlande lumineuse */}
      <path d="M-54 -94Q-28 -84 0 -94T54 -94" fill="none" stroke="#1a4a2a" strokeWidth="2.4" strokeLinecap="round" />
      {[-42, -26, -10, 6, 22, 38].map((x, i) => <circle key={x} className="cr-tw" cx={x} cy={-90 + Math.sin(i * 1.1) * 2} r="1.8" fill={["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc"][i % 4]} style={{ animationDelay: `${i * 0.4}s` }} />)}
    </g>
  );
}

function Hay() {
  return (
    <g>
      <rect x="-48" y="-24" width="22" height="18" rx="2" fill="#c9a04a" stroke="#8a6428" strokeWidth=".8" /><path d="M-46 -17H-28M-46 -11H-28" stroke="#8a6428" strokeWidth=".9" />
      <rect x="28" y="-20" width="20" height="14" rx="2" fill="#c9a04a" stroke="#8a6428" strokeWidth=".8" /><path d="M30 -14H46" stroke="#8a6428" strokeWidth=".9" />
    </g>
  );
}

function Manger({ p, baby }) {
  return (
    <g>
      <ellipse cx="0" cy="8" rx="26" ry="4" fill="#000" opacity=".28" />
      <path d="M-17 -4L-11 8M17 -4L11 8M-11 -4L-17 8M11 -4L17 8" stroke="#4a2a14" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M-22 -10H22L17 2H-17Z" fill={`url(#${p}Wood)`} stroke="#3a1f0e" strokeWidth="1.2" strokeLinejoin="round" />
      <ellipse cx="0" cy="-10" rx="22" ry="4" fill="#e0b84e" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-18 + i * 4.5} -10.5l${i % 2 ? 3.4 : -3} -3.6`} stroke="#f6dd8e" strokeWidth="1" strokeLinecap="round" />)}
      {baby && (
        <g>
          <ellipse cx="-1" cy="-14" rx="13" ry="4.8" fill="#fffdf6" stroke="#e4dcc4" strokeWidth=".8" />
          <circle cx="11" cy="-16" r="4.6" fill="#f6cfae" />
          <path d="M9 -16.8Q10 -15.6 11 -16.8M12.4 -16.8Q13.4 -15.6 14.4 -16.8" stroke="#6a4a3a" strokeWidth=".6" fill="none" strokeLinecap="round" />
          <circle cx="9.4" cy="-14.4" r="1" fill="#f2a0a0" opacity=".6" />
        </g>
      )}
    </g>
  );
}

function Mary() {
  return (
    <g className="cr-breathe">
      <ellipse cx="0" cy="1" rx="16" ry="3" fill="#000" opacity=".28" />
      <path d="M-14 0Q-18 -14 -6 -24L7 -24Q16 -14 14 0Z" fill="#2f5fb0" stroke="#1d3f82" strokeWidth=".9" />
      <path d="M-9 -23Q-7 -36 3 -36Q13 -36 12 -23Q5 -27 -9 -23Z" fill="#f4f0ff" stroke="#d5cff0" strokeWidth=".8" />
      <circle cx="3.4" cy="-29.4" r="5" fill="#f2c9a5" />
      <path d="M0.4 -30.6Q2 -29.6 3.4 -30.6M5.2 -30.6Q6.8 -29.6 8.2 -30.6" stroke="#5a3a2a" strokeWidth=".7" fill="none" strokeLinecap="round" />
      <path d="M-8 -24Q-1 -20 8 -21" fill="none" stroke="#2f5fb0" strokeWidth="5" strokeLinecap="round" />
      <circle cx="9" cy="-21" r="2.4" fill="#f2c9a5" />
      <ellipse cx="3.4" cy="-36" rx="8.4" ry="2.4" fill="none" stroke="#ffe08a" strokeWidth="1.4" style={{ filter: "drop-shadow(0 0 3px #ffd45a)" }} />
    </g>
  );
}

function Joseph() {
  return (
    <g className="cr-breathe">
      <ellipse cx="0" cy="1" rx="12" ry="2.6" fill="#000" opacity=".28" />
      <rect x="-4.6" y="-7" width="3.6" height="7" rx="1.2" fill="#3a2430" /><rect x="1.4" y="-7" width="3.6" height="7" rx="1.2" fill="#3a2430" />
      <path d="M-8.6 -6Q-10 -25 -3.4 -35L5.6 -35Q12 -25 9.6 -6Z" fill="#8a5a2c" stroke="#5a3a1c" strokeWidth=".9" />
      <path d="M-8 -29Q1 -23 11 -30L12 -22Q2 -15 -8 -22Z" fill="#c9862a" opacity=".9" />
      <circle cx="1" cy="-41" r="5.3" fill="#f2c9a5" />
      <path d="M-4.4 -42.4Q-3.4 -48 1 -47.4Q6 -48 6.6 -42.4Q3.4 -45 -4.4 -42.4Z" fill="#4a2a1a" />
      <path d="M-3.4 -38.4Q1 -31.6 6.2 -38.4Q4.6 -35 1 -33.8Q-1.8 -35 -3.4 -38.4Z" fill="#6a4a30" />
      <path d="M-14 0V-47Q-14 -54 -8 -53" fill="none" stroke="#6a4020" strokeWidth="2.2" strokeLinecap="round" />
      <g className="cr-sway" style={{ transformOrigin: "11px -29px" }}>
        <path d="M11 -29V-25" stroke="#6a4a2a" strokeWidth=".9" />
        <circle cx="11" cy="-19" r="11" fill="rgba(255,179,71,.45)" />
        <path d="M8 -25H14L13 -14H9Z" fill="#ffd98a" stroke="#8a5a12" strokeWidth=".8" />
        <ellipse className="cr-flame" cx="11" cy="-19.6" rx="1.2" ry="2.8" fill="#fff6c8" />
      </g>
      <circle cx="9" cy="-28" r="2.3" fill="#f2c9a5" />
    </g>
  );
}

function Ox({ p }) {
  return (
    <g>
      <ellipse cx="0" cy="1" rx="26" ry="3.4" fill="#000" opacity=".26" />
      {[-18, -9, 11, 20].map((x, i) => <rect key={i} x={x - 2.2} y="-13" width="4.4" height="13" rx="1.6" fill="#5a3418" />)}
      <ellipse cx="0" cy="-23" rx="27" ry="14" fill={`url(#${p}Fur)`} className="cr-breathe" />
      <path d="M-9 -35Q0 -27 14 -34Q6 -24 -5 -22Z" fill="#f2ead8" opacity=".85" />
      <path d="M26 -26Q34 -22 32 -14" fill="none" stroke="#5a3418" strokeWidth="2.2" strokeLinecap="round" />
      <g transform="translate(-26 -22)">
        <path d="M0 -2Q-8 -1 -11 6Q-8 13 2 12Z" fill={`url(#${p}Fur)`} />
        <ellipse cx="-12" cy="8" rx="6.6" ry="5.6" fill="#c9a98a" /><circle cx="-14.6" cy="8" r="1" fill="#3a2418" /><circle cx="-11" cy="9" r="1" fill="#3a2418" />
        <circle cx="-4" cy="2.2" r="1.3" fill="#2a1a10" />
        <path d="M-2 -2Q-9 -10 -4 -14Q-4 -8 1 -3Z" fill="#f4ecd4" stroke="#c9b894" strokeWidth=".6" />
        <path d="M3 -1Q9 -8 4 -12Q3 -6 1 -2Z" fill="#f4ecd4" stroke="#c9b894" strokeWidth=".6" />
        <circle className="cr-steam" cx="-17" cy="9" r="2.2" fill="#dfe6ff" opacity=".6" />
        <circle className="cr-steam" cx="-17" cy="9" r="2.2" fill="#dfe6ff" opacity=".6" style={{ animationDelay: "1.4s" }} />
      </g>
    </g>
  );
}

function Donkey({ p }) {
  return (
    <g>
      <ellipse cx="0" cy="1" rx="24" ry="3.4" fill="#000" opacity=".26" />
      {[-14, -7, 10, 17].map((x, i) => <rect key={i} x={x - 1.8} y="-14" width="3.6" height="14" rx="1.6" fill="#6e6e80" />)}
      <ellipse cx="0" cy="-23" rx="24" ry="12" fill={`url(#${p}Gray)`} className="cr-breathe" />
      <ellipse cx="1" cy="-19" rx="16" ry="6" fill="#dcdce6" opacity=".55" />
      <path d="M-22 -27Q-27 -33 -25 -40" fill="none" stroke="#4a4a5a" strokeWidth="4" strokeLinecap="round" />
      <path d="M23 -28Q30 -23 28 -17" fill="none" stroke="#4a4a5a" strokeWidth="2.2" strokeLinecap="round" />
      <g transform="translate(-26 -36)">
        <path d="M0 0Q-11 -1 -14 8Q-11 15 1 13Z" fill={`url(#${p}Gray)`} />
        <ellipse cx="-14" cy="10" rx="5.4" ry="5" fill="#e2e2ec" /><circle cx="-16.4" cy="10" r=".9" fill="#2a2a34" /><circle cx="-12.4" cy="10.6" r=".9" fill="#2a2a34" />
        <circle cx="-5.4" cy="3.4" r="1.3" fill="#22222c" />
        <path className="cr-ear" d="M-2 -1Q-6.6 -14 -1 -19Q0 -9 2 -2Z" fill="#8a8a9c" stroke="#5a5a6a" strokeWidth=".6" />
        <path className="cr-ear" d="M3 -1Q5.6 -14 12 -16Q8 -8 5.4 -1Z" fill="#8a8a9c" stroke="#5a5a6a" strokeWidth=".6" style={{ animationDelay: ".7s" }} />
      </g>
    </g>
  );
}

function Sheep({ graze }) {
  return (
    <g>
      <ellipse cx="0" cy="1" rx="11" ry="2" fill="#000" opacity=".26" />
      {[-5, -1.6, 3, 6.4].map((x, i) => <rect key={i} x={x - 0.8} y="-6.6" width="1.7" height="6.6" rx=".8" fill="#2a2030" />)}
      {[[-6.6, -12, 6], [0, -14.4, 7], [6.6, -12, 6], [-3.4, -8.8, 5.4], [4.4, -8.2, 5.4], [-8, -7.8, 4.4], [9, -7.8, 4.4]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#f8f4ec" stroke="#d5cfc0" strokeWidth=".5" />)}
      <g className={graze ? "cr-graze" : "cr-ear"} style={{ transformOrigin: "-10px -12px" }}>
        <ellipse cx="-13.4" cy="-11" rx="4.4" ry="3.6" fill="#3a2e3e" /><circle cx="-14.6" cy="-12" r=".7" fill="#fff" />
      </g>
    </g>
  );
}

function Shepherd({ cloak, head, kneel }) {
  return (
    <g>
      <ellipse cx="0" cy="1" rx="11" ry="2.4" fill="#000" opacity=".28" />
      {kneel ? (
        <>
          <path d="M-11 0Q-14 -12 -4 -21L5 -21Q13 -12 12 0Z" fill={cloak} stroke="#0003" strokeWidth=".8" />
          <circle cx="1" cy="-26.4" r="4.8" fill="#f2c9a5" />
          <path d="M-4 -27.6Q1 -34 6.6 -27.6Q1 -29.6 -4 -27.6Z" fill={head} />
          <path d="M4 -20Q12 -17 16 -19" fill="none" stroke={cloak} strokeWidth="4" strokeLinecap="round" />
          <g transform="translate(16 -19) scale(.5)">{[[-7, -7, 6], [2, -9, 7], [9, -5, 5], [-2, -3, 6]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fbf7ee" stroke="#d5cfc0" />)}<ellipse cx="13" cy="-7" rx="4.4" ry="3.4" fill="#3a2e3e" /></g>
        </>
      ) : (
        <>
          <rect x="-4" y="-7" width="3.4" height="7" rx="1.2" fill="#3a2430" /><rect x="1.6" y="-7" width="3.4" height="7" rx="1.2" fill="#3a2430" />
          <path d="M-8 -6Q-10 -23 -3.4 -32L5.6 -32Q12 -23 9 -6Z" fill={cloak} stroke="#0003" strokeWidth=".8" />
          <circle cx="1" cy="-37.6" r="4.8" fill="#f2c9a5" />
          <path d="M-4.4 -38.8Q1 -45.6 6.6 -38.8Q1 -41 -4.4 -38.8Z" fill={head} />
          <path d="M3.4 -29L12.4 -42" stroke={cloak} strokeWidth="3.4" strokeLinecap="round" /><circle cx="13" cy="-43.4" r="2" fill="#f2c9a5" />
          <path d="M-12 0V-44Q-12 -51 -6 -49" fill="none" stroke="#6a4020" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

function King({ robe, trim, skin, beard, hair, gift, delay = 0 }) {
  return (
    <g className="cr-bob" style={{ animationDelay: `${delay}s` }}>
      <ellipse cx="0" cy="1" rx="11" ry="2.4" fill="#000" opacity=".28" />
      <rect x="-4" y="-7" width="3.6" height="7" rx="1.2" fill="#3a2430" /><rect x="1.4" y="-7" width="3.6" height="7" rx="1.2" fill="#3a2430" />
      <path d="M-8 -5Q-10 -23 -3.6 -31L5 -31Q12 -23 9 -5Z" fill={robe} stroke="#0003" strokeWidth=".8" />
      <path d="M-8 -5H9" stroke={trim} strokeWidth="1.6" /><path d="M-4.6 -31Q1 -23 5.6 -31" fill="none" stroke={trim} strokeWidth="1.6" />
      <circle cx="1" cy="-36" r="4.7" fill={skin} />
      {hair && <path d="M-4 -37Q-3 -42 1 -41.6Q5.4 -42 5.8 -37Q2.6 -39 -4 -37Z" fill={hair} />}
      {beard && <path d="M-3 -34Q1 -28 5.2 -34Q3.6 -31 1 -30Q-1.6 -31 -3 -34Z" fill={beard} />}
      <path d="M-3.6 -40L-3.6 -45L-1.6 -42.6L1 -46.4L3.6 -42.6L5.6 -45L5.6 -40Z" fill="#ffd45a" stroke="#a8721f" strokeWidth=".6" strokeLinejoin="round" />
      <path d="M4 -26L10.4 -22" stroke={robe} strokeWidth="3.2" strokeLinecap="round" />
      {gift === "gold" && <g transform="translate(11.6 -23.6)"><rect x="-4" y="-3" width="8" height="5.6" rx="1" fill="#e8b84a" stroke="#8a5a12" strokeWidth=".6" /><path d="M-4 -.2H4" stroke="#8a5a12" strokeWidth=".6" /></g>}
      {gift === "incense" && <g transform="translate(11.6 -23.6)"><path d="M-3 -2Q0 2 3 -2Z" fill="#e8b84a" stroke="#8a5a12" strokeWidth=".6" /><circle className="cr-steam" cx="0" cy="-5" r="1.8" fill="#e8e0ff" opacity=".7" /></g>}
      {gift === "myrrh" && <g transform="translate(11.6 -23.6)"><path d="M-2.6 -1Q-4 -5 -1.6 -6H1.6Q4 -5 2.6 -1Q4 2.6 0 3Q-4 2.6 -2.6 -1Z" fill="#c8202e" stroke="#7a0f1a" strokeWidth=".6" /><rect x="-1.2" y="-7.8" width="2.4" height="2" fill="#e8b84a" /></g>}
    </g>
  );
}

function Camel({ p }) {
  return (
    <g>
      <ellipse cx="0" cy="1" rx="26" ry="3" fill="#000" opacity=".26" />
      {[-19, -13, 10, 16].map((x, i) => <rect key={i} x={x - 2} y="-21" width="4" height="21" rx="1.6" fill={i % 2 ? "#a07c52" : "#8a6440"} />)}
      <ellipse cx="0" cy="-28" rx="24" ry="10" fill={`url(#${p}Camel)`} className="cr-breathe" />
      <path d="M-13 -35Q-10 -46 -3 -36Q2 -47 9 -36Z" fill={`url(#${p}Camel)`} />
      <path d="M22 -31Q35 -39 34 -50" fill="none" stroke="#b08a5a" strokeWidth="6.6" strokeLinecap="round" />
      <ellipse cx="36" cy="-52" rx="7" ry="4.4" fill="#c9a070" /><circle cx="34" cy="-53" r=".9" fill="#2a1a10" />
      <path d="M-15 -33Q-3 -38 10 -33L10 -27Q-3 -22 -15 -27Z" fill="#c8202e" opacity=".9" /><path d="M-15 -30Q-3 -26 10 -30" fill="none" stroke="#f2c24a" strokeWidth="1.2" />
    </g>
  );
}

function Angel({ p, music }) {
  return (
    <g className="cr-float">
      <circle r="36" cy="-4" fill={`url(#${p}Glow)`} opacity=".5" />
      <path className="cr-wing-l" d="M-3 -9Q-26 -27 -32 -4Q-24 -11 -20 -4Q-17 -11 -13 -2Q-8 -6 -4 0Z" fill="#fff" stroke="#d8def8" strokeWidth=".8" />
      <path className="cr-wing-r" d="M3 -9Q26 -27 32 -4Q24 -11 20 -4Q17 -11 13 -2Q8 -6 4 0Z" fill="#fff" stroke="#d8def8" strokeWidth=".8" />
      <path d="M-8 20Q-11 -4 -4 -10L4 -10Q11 -4 8 20Q0 24 -8 20Z" fill="#fffdf6" stroke="#e2e6fb" strokeWidth=".8" />
      <path d="M-7 -6L-15 -13M7 -6L15 -13" stroke="#fffdf6" strokeWidth="3" strokeLinecap="round" />
      <circle cx="0" cy="-15" r="5" fill="#f6cfae" />
      <path d="M-5 -16Q-4 -22 1 -21Q6 -22 5 -16Q2 -19 -5 -16Z" fill="#e0b050" />
      <ellipse cx="0" cy="-22.5" rx="6.6" ry="2" fill="none" stroke="#ffe08a" strokeWidth="1.3" style={{ filter: "drop-shadow(0 0 3px #ffd45a)" }} />
      {music && [[-17, -20, "♪"], [17, -23, "♫"], [-24, -5, "♫"]].map(([x, y, g], i) => <text key={i} className="cr-note" x={x} y={y} fontSize="8" fill="#fff3bf" style={{ "--dx": `${x > 0 ? 7 : -7}px`, animationDelay: `${i * 1.3}s` }}>{g}</text>)}
    </g>
  );
}

function BethlehemStar({ p }) {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    const r = i % 4 === 0 ? 17 : i % 2 === 0 ? 9 : 3.4;
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  return (
    <g>
      <circle r="34" fill={`url(#${p}Glow)`} className="cr-pulse" />
      <polygon points={pts.join(" ")} fill={`url(#${p}Gold)`} stroke="#fff6c8" strokeWidth=".7" strokeLinejoin="round" />
      <circle r="2.4" fill="#fff" />
    </g>
  );
}

export default function Creche({
  x = 0,
  y = 0,
  scale = 1,
  idPrefix = "creche",
  baby = true,
  showKings = true,
  showShepherds = true,
  showAngel = true,
}) {
  const p = idPrefix;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <linearGradient id={`${p}Ground`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8cc7e" /><stop offset="1" stopColor="#b8903e" /></linearGradient>
        <linearGradient id={`${p}Rock`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6a6078" /><stop offset="1" stopColor="#2a2236" /></linearGradient>
        <linearGradient id={`${p}Thatch`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dcb85e" /><stop offset="1" stopColor="#8a6428" /></linearGradient>
        <linearGradient id={`${p}Wood`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a2a14" /><stop offset=".5" stopColor="#8a5a34" /><stop offset="1" stopColor="#4a2a14" /></linearGradient>
        <linearGradient id={`${p}Gold`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".5" stopColor="#e8b84a" /><stop offset="1" stopColor="#a8721f" /></linearGradient>
        <linearGradient id={`${p}Fur`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a6a42" /><stop offset="1" stopColor="#6a4026" /></linearGradient>
        <linearGradient id={`${p}Gray`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a6a6b4" /><stop offset="1" stopColor="#6e6e80" /></linearGradient>
        <linearGradient id={`${p}Camel`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9a070" /><stop offset="1" stopColor="#8a6440" /></linearGradient>
        <linearGradient id={`${p}Beam`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3bf" stopOpacity=".5" /><stop offset="1" stopColor="#fff3bf" stopOpacity="0" /></linearGradient>
        <radialGradient id={`${p}Glow`}><stop offset="0" stopColor="#fff6c8" stopOpacity=".95" /><stop offset=".4" stopColor="#ffd45a" stopOpacity=".5" /><stop offset="1" stopColor="#ffd45a" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${p}Warm`}><stop offset="0" stopColor="#ffb347" stopOpacity=".65" /><stop offset="1" stopColor="#ffb347" stopOpacity="0" /></radialGradient>
      </defs>

      <style>{`
        .cr-tw { animation: cr-tw 3s ease-in-out infinite; }
        @keyframes cr-tw { 0%,100% { opacity: 1; } 50% { opacity: .55; } }
        .cr-pulse { transform-box: fill-box; transform-origin: 50% 50%; animation: cr-pulse 3s ease-in-out infinite alternate; }
        @keyframes cr-pulse { from { transform: scale(.9); opacity: .75; } to { transform: scale(1.1); opacity: 1; } }
        .cr-flame { transform-box: fill-box; transform-origin: 50% 100%; animation: cr-flame .24s ease-in-out infinite alternate; }
        @keyframes cr-flame { from { transform: scale(1,1) rotate(-3deg); } to { transform: scale(.85,1.15) rotate(3deg); } }
        .cr-sway { transform-box: fill-box; animation: cr-sway 4s ease-in-out infinite alternate; }
        @keyframes cr-sway { from { transform: rotate(-4deg); } to { transform: rotate(4deg); } }
        .cr-float { animation: cr-float 4s ease-in-out infinite alternate; }
        @keyframes cr-float { from { transform: translateY(0); } to { transform: translateY(-4px); } }
        .cr-wing-l { transform-box: fill-box; transform-origin: 100% 80%; animation: cr-wl 1.8s ease-in-out infinite alternate; }
        .cr-wing-r { transform-box: fill-box; transform-origin: 0% 80%; animation: cr-wr 1.8s ease-in-out infinite alternate; }
        @keyframes cr-wl { from { transform: rotate(8deg); } to { transform: rotate(-14deg); } }
        @keyframes cr-wr { from { transform: rotate(-8deg); } to { transform: rotate(14deg); } }
        .cr-breathe { transform-box: fill-box; transform-origin: 50% 100%; animation: cr-br 3.2s ease-in-out infinite; }
        @keyframes cr-br { 0%,100% { transform: scale(1,1); } 50% { transform: scale(1.015,1.03); } }
        .cr-ear { transform-box: fill-box; transform-origin: 50% 100%; animation: cr-ear 5s ease-in-out infinite; }
        @keyframes cr-ear { 0%,80%,100% { transform: rotate(0); } 85% { transform: rotate(-14deg); } 92% { transform: rotate(6deg); } }
        .cr-graze { transform-box: fill-box; transform-origin: 100% 50%; animation: cr-gz 6s ease-in-out infinite; }
        @keyframes cr-gz { 0%,40%,100% { transform: rotate(0); } 55%,80% { transform: rotate(22deg); } }
        .cr-steam { animation: cr-steam 3s ease-out infinite; }
        @keyframes cr-steam { 0% { transform: translate(0,0) scale(.4); opacity: 0; } 25% { opacity: .6; } 100% { transform: translate(-7px,-11px) scale(1.6); opacity: 0; } }
        .cr-note { animation: cr-note 4s ease-in infinite; }
        @keyframes cr-note { 0% { transform: translate(0,0) scale(.6); opacity: 0; } 15% { opacity: .9; } 100% { transform: translate(var(--dx),-30px) scale(1.2); opacity: 0; } }
        .cr-bob { transform-box: fill-box; transform-origin: 50% 100%; animation: cr-bob 3.4s ease-in-out infinite; }
        @keyframes cr-bob { 0%,100% { transform: rotate(0); } 50% { transform: rotate(7deg); } }
        @media (prefers-reduced-motion: reduce) {
          .cr-tw,.cr-pulse,.cr-flame,.cr-sway,.cr-float,.cr-wing-l,.cr-wing-r,.cr-breathe,.cr-ear,.cr-graze,.cr-steam,.cr-note,.cr-bob { animation: none; }
        }
      `}</style>

      {/* sol de la crèche (la seule chose "de fond" : une petite base qui pose le décor sur la place) */}
      <Base p={p} />

      {/* faisceau de l'étoile */}
      <polygon points="0,-150 -30,-6 30,-6" fill={`url(#${p}Beam)`} opacity=".5" />

      {/* grotte, paille, animaux */}
      <Rock p={p} />
      <ellipse cx="0" cy="-3" rx="56" ry="8" fill="#d9b25a" opacity=".9" />
      <Hay />
      <g transform="translate(-36 -2)"><Ox p={p} /></g>
      <g transform="translate(40 -2) scale(-1 1)"><Donkey p={p} /></g>

      {/* mangeoire + Enfant Jésus */}
      <g transform="translate(0 -1)">
        {baby && <circle cx="0" cy="-12" r="32" fill={`url(#${p}Glow)`} className="cr-pulse" />}
        <Manger p={p} baby={baby} />
      </g>

      {/* Marie et Joseph */}
      <g transform="translate(-22 -1)"><Mary /></g>
      <g transform="translate(26 -1) scale(-1 1)"><Joseph /></g>

      {/* charpente + toit de chaume + lanterne */}
      <StableFront p={p} />

      {/* bergers et moutons (à droite) */}
      {showShepherds && (
        <g>
          <g transform="translate(86 4)"><Shepherd cloak="#a86a3a" head="#d9a336" /></g>
          <g transform="translate(116 6) scale(-1 1)"><Shepherd cloak="#4a7a5a" head="#c8202e" kneel /></g>
          <g transform="translate(96 14)"><Sheep graze /></g>
          <g transform="translate(124 15) scale(-1 1)"><Sheep graze /></g>
        </g>
      )}

      {/* Rois mages et chameau (à gauche) */}
      {showKings && (
        <g>
          <g transform="translate(-118 -6)"><Camel p={p} /></g>
          <g transform="translate(-84 4)"><King robe="#c8202e" trim="#f2c24a" skin="#f2c9a5" beard="#f4f4f0" hair="#f4f4f0" gift="gold" /></g>
          <g transform="translate(-104 9)"><King robe="#2f7a4a" trim="#f6e7c1" skin="#e8b88a" beard="#6a3a20" hair="#6a3a20" gift="incense" delay={0.4} /></g>
          <g transform="translate(-64 12)"><King robe="#6a3a9a" trim="#f2c24a" skin="#7a4a2a" gift="myrrh" delay={0.8} /></g>
        </g>
      )}

      {/* ange et étoile au-dessus */}
      {showAngel && <g transform="translate(62 -134)"><Angel p={p} music /></g>}
      <g transform="translate(0 -168)"><BethlehemStar p={p} /></g>
    </g>
  );
}
