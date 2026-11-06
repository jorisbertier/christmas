import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import photo1 from "../../assets/museum/1.jpg";
import photo2 from "../../assets/museum/2.jpg";
import photo3 from "../../assets/museum/3.jpg";
import photo4 from "../../assets/museum/4.jpg";
import photo5 from "../../assets/museum/5.jpg";
import photo6 from "../../assets/museum/6.jpg";
import photo7 from "../../assets/museum/7.jpg";
import photo8 from "../../assets/museum/8.jpg";
import photo9 from "../../assets/museum/9.jpg";

/* ------------------------------------------------------------------ */
/*  ✏️ The collection — edit the texts / dates / memories freely        */
/*  kind: "photo" (framed picture) or "object" (souvenir in a vitrine) */
/*  frame: "gold" | "wood" | "oval"                                    */
/* ------------------------------------------------------------------ */

const ROOMS = [
  { name: "Los comienzos", sub: "Cuando todavía no sabíamos lo que venía", wall: "green" },
  { name: "Nuestras aventuras", sub: "Risas, viajes y locuras compartidas", wall: "wine" },
  { name: "Nuestra Navidad", sub: "La estación más bonita del año", wall: "navy" },
];

const EXHIBITS = [
  // ---- Sala 1
  { id: "e1", room: 0, kind: "photo", frame: "gold", emoji: "📸", src: photo1,
    title: "El día que nos conocimos", date: "Mayo 2025", technique: "Sonrisas sobre lienzo de destino",
    memory: "Nadie sabía todavía lo que iba a pasar, pero algo ya brillaba. Esta es la primera pieza de la colección, y quizás la más importante." },
  { id: "e2", room: 0, kind: "photo", frame: "wood", emoji: "🌹", src: photo2,
    title: "Nuestra primera cita", date: "Un día que no se olvida", technique: "Técnica peligrosa",
    memory: "En nuestra primera cita fuiste muy peligrosa, no fallaste ni un solo blanco, apuntaste tan bien que ese día te ganaste mi corazón." },
  { id: "e3", room: 0, kind: "object", emoji: "💬", src: photo3,
    title: "Nuestro restaurante favorito", date: "A Bernadette", technique: "Descubrimiento de sabores y culturas",
    memory: "Ese día pudiste conocer un poco más de mi país y, sobre todo, conociste los famosos caracoles; pero hay cosas mucho peores, no te preocupes." },
  // ---- Sala 2
  { id: "e4", room: 1, kind: "photo", frame: "oval", emoji: "🌍", src: photo4,
    title: "Nuestra aventura favorita", date: "Salar de Uyuni", technique: "Al aire libre sobre paisaje inolvidable",
    memory: "Da igual el lugar: contigo cualquier plan se convierte en una aventura que merece estar en un museo." },
  { id: "e5", room: 1, kind: "photo", frame: "gold", emoji: "😴", src: photo5,
    title: "Día random", date: "Obra espontánea, sin retoque", technique: "Doble autorretrato con ojeras",
    memory: "Una foto que no conocías. Y aun así, salió esa obra de arte." },
  { id: "e6", room: 1, kind: "object", emoji: "🎟️", src: photo6,
    title: "Viajes", date: "Septiembre 2026", technique: "Papel, tinta y un poquito de magia",
    memory: "Hay viajes que terminan, pero los recuerdos contigo se quedan para siempre." },
  // ---- Sala 3
  { id: "e7", room: 2, kind: "photo", frame: "gold", emoji: "🎄", src: photo7,
    title: "Nuestra Navidad", date: "Diciembre 2025", technique: "Calidez sobre lienzo de invierno",
    memory: "Aunque este año la distancia nos separa, cada luz de este pueblo lleva tu nombre." },
  { id: "e8", room: 2, kind: "photo", frame: "wood", emoji: "💻", src: photo8,
    title: "Videollamada de domingo", date: "Pantalla pequeña, abrazo gigante", technique: "Píxeles y mucho amor",
    memory: "La cara del domingo que duró, pero qué bonito es encontrarte al otro lado de la pantalla. Cada llamada acorta un poquito la distancia." },
  { id: "e9", room: 2, kind: "object", emoji: "🎄", src: photo9,
    title: "Nuestro hijo imaginario", date: "La obra más imaginaria de la colección", technique: "24 casitas, mucho cariño y algo de magia",
    memory: "Nuestro hijo, quién hubiera imaginado que sería una llama." },
];

const TEXTS = {
  museum: "Museo de Nosotros",
  edition: "Exposición permanente · Edición Navidad",
  gateKick: "Entrada gratuita · Navidad 2026",
  gateTitle: "Museo de Nosotros",
  gateSub: "Una colección de recuerdos, solo para ti",
  enter: "Entrar al museo ✨",
  room: "Sala",
  visited: (n, t) => `Piezas visitadas ${n} / ${t}`,
  tapHint: "Toca una pieza para verla de cerca",
  plaqueTitle: "Ficha de la obra",
  technique: "Técnica",
  curator: "Nota del comisario",
  listen: "🎧 Escuchar la audioguía",
  stop: "⏹ Detener",
  playing: "Reproduciendo…",
  prev: "‹ Anterior",
  next: "Siguiente ›",
  close: "Cerrar",
  placeholder: "Tu foto aquí",
  doneTitle: "¡Has recorrido todo el museo!",
  doneMsg: "Pero la colección no termina aquí: cada día que pasamos juntos, añadimos una obra nueva. ❤️",
  doneBtn: "Seguir paseando",
  seeNote: "Ver la pieza",
  musicOn: "Silenciar la música",
  musicOff: "Activar la música",
};


/* ------------------------------------------------------------------ */
/*  Soft background music (Web Audio, original, no file needed)        */
/*  - starts when she enters the museum                                */
/*  - keeps playing while the audio guide talks, but is silenced       */
/*    (volume → 0) and fades back in when the audio guide stops        */
/* ------------------------------------------------------------------ */

const BAR = 4.8; // seconds per chord (slow, calm)
const CHORDS = [
  { root: 65.41, pad: [261.63, 329.63, 392.0, 493.88], arp: [523.25, 659.25, 783.99, 987.77, 783.99, 659.25] }, // Cmaj7
  { root: 55.0, pad: [220.0, 261.63, 329.63, 392.0], arp: [440.0, 523.25, 659.25, 783.99, 659.25, 523.25] }, // Am7
  { root: 43.65, pad: [174.61, 220.0, 261.63, 329.63], arp: [349.23, 440.0, 523.25, 659.25, 523.25, 440.0] }, // Fmaj7
  { root: 49.0, pad: [196.0, 246.94, 293.66, 329.63], arp: [392.0, 493.88, 587.33, 659.25, 587.33, 493.88] }, // G6
];
const MUSIC_LEVEL = 0.55;

function useAmbient() {
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const verbRef = useRef(null);
  const timerRef = useRef(0);
  const nextRef = useRef(0);
  const barRef = useRef(0);
  const playingRef = useRef(false);
  const duckRef = useRef(false);
  const onRef = useRef(true);
  const [on, setOn] = useState(true);
  onRef.current = on;

  // volume = music level, or 0 when muted / while the audio guide speaks
  const applyGain = useCallback((slow) => {
    const ctx = ctxRef.current; const m = masterRef.current;
    if (!ctx || !m) return;
    const target = onRef.current && !duckRef.current ? MUSIC_LEVEL : 0;
    m.gain.cancelScheduledValues(ctx.currentTime);
    m.gain.setTargetAtTime(target, ctx.currentTime, slow ? 1.2 : 0.35);
  }, []);

  const ensure = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      const len = Math.floor(ctx.sampleRate * 3.2);
      const buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4); }
      const conv = ctx.createConvolver(); conv.buffer = buf;
      const wet = ctx.createGain(); wet.gain.value = 0.55; conv.connect(wet); wet.connect(master);
      ctxRef.current = ctx; masterRef.current = master; verbRef.current = conv;
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume().catch(() => {});
    return ctxRef.current;
  }, []);

  const tone = useCallback((f, t, dur, vol, attack, type = "sine", detune = 0) => {
    const ctx = ctxRef.current; if (!ctx) return;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type; o.frequency.value = f; o.detune.value = detune;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(masterRef.current); g.connect(verbRef.current);
    o.start(t); o.stop(t + dur + 0.1);
  }, []);

  const scheduleBar = useCallback((i, t) => {
    const ch = CHORDS[i % CHORDS.length];
    tone(ch.root, t, BAR + 1.2, 0.07, 0.6);                          // warm bass
    ch.pad.forEach((f, k) => { tone(f, t + k * 0.05, BAR + 1.4, 0.026, 1.5, "sine", k % 2 ? 4 : -4); }); // soft pad
    ch.arp.forEach((f, k) => {                                           // gentle bell arpeggio
      const tt = t + 0.4 + k * 0.72;
      tone(f, tt, 2.4, 0.05, 0.01, "sine");
      tone(f * 2.005, tt, 1.2, 0.016, 0.01, "sine");
    });
  }, [tone]);

  const pump = useCallback(() => {
    const ctx = ctxRef.current; if (!ctx || !playingRef.current) return;
    while (nextRef.current < ctx.currentTime + 2) { scheduleBar(barRef.current, nextRef.current); nextRef.current += BAR; barRef.current += 1; }
  }, [scheduleBar]);

  const start = useCallback(() => {
    const ctx = ensure(); if (!ctx || playingRef.current) return;
    playingRef.current = true;
    nextRef.current = ctx.currentTime + 0.2; barRef.current = 0;
    pump(); timerRef.current = setInterval(pump, 500);
    applyGain(true); // slow fade-in
  }, [ensure, pump, applyGain]);

  const toggle = useCallback(() => { setOn((v) => { onRef.current = !v; return !v; }); }, []);
  useEffect(() => { applyGain(false); }, [on, applyGain]);

  // true while the audio guide is talking: the music keeps running but cannot be heard
  const setDuck = useCallback((d) => { duckRef.current = d; applyGain(false); }, [applyGain]);

  useEffect(() => () => { playingRef.current = false; clearInterval(timerRef.current); if (ctxRef.current) ctxRef.current.close().catch(() => {}); }, []);
  return { start, setDuck, toggle, on };
}

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Cinzel:wght@500;700;900&display=swap');

.mu{container:mu / size;box-sizing:border-box;position:relative;isolation:isolate;height:100%;min-height:100svh;width:100%;max-width:100%;max-height:100%;overflow:hidden;display:flex;flex-direction:column;color:#fff3e0;font-family:'Cormorant Garamond',Georgia,serif;background:#0b0a12}
.mu button{font-family:inherit}

/* header + footer */
.mu-head{position:relative;z-index:12;flex:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:clamp(24px,4.6cqh,40px) clamp(12px,3cqw,32px) clamp(4px,1cqh,10px);background:linear-gradient(180deg,rgba(8,5,12,.94),rgba(8,5,12,.55) 70%,transparent)}
.mu-brand{min-width:0}
.mu-bk{margin:0;font-size:clamp(9px,min(1.4cqw,1.8cqh),12px);letter-spacing:.34em;text-transform:uppercase;font-weight:700;color:#f1c978}
.mu-bt{margin:.05em 0 0;font-family:'Cinzel',serif;font-weight:900;letter-spacing:.14em;line-height:1.05;font-size:clamp(16px,min(3.2cqw,4.4cqh),34px);
  background:linear-gradient(180deg,#fffbe0,#f8dd86 45%,#d9a336 75%,#fbe493);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 rgba(0,0,0,.6))}
.mu-room-t{text-align:right;min-width:0}
.mu-rn{margin:0;font-family:'Mountains of Christmas','Cormorant Garamond',cursive;font-weight:700;line-height:1;font-size:clamp(18px,min(3.4cqw,4.8cqh),38px);color:#fff0c8;text-shadow:0 2px 0 rgba(58,0,12,.7);animation:mu-fade .8s ease both}
.mu-rs{margin:.1em 0 0;font-style:italic;font-weight:600;font-size:clamp(11px,min(1.8cqw,2.4cqh),17px);color:#ffe3c8;animation:mu-fade .8s ease both}
@keyframes mu-fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.mu-foot{position:relative;z-index:12;flex:none;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:clamp(4px,1cqh,10px) clamp(12px,3cqw,32px) clamp(8px,1.6cqh,16px);background:linear-gradient(0deg,rgba(8,5,12,.92),rgba(8,5,12,.5) 75%,transparent)}
.mu-nav{display:flex;align-items:center;gap:.5em;padding:.35em 1em;border:1.5px solid rgba(246,210,122,.6);border-radius:999px;cursor:pointer;background:rgba(0,0,0,.4);color:#f8dd86;font-weight:700;font-size:clamp(12px,min(1.9cqw,2.5cqh),17px);transition:background .2s ease,opacity .3s ease}
.mu-nav:hover:not(:disabled){background:rgba(246,210,122,.22)}.mu-nav:disabled{opacity:.28;cursor:default}.mu-nav:focus-visible{outline:2px solid #fff;outline-offset:2px}
.mu-mid{display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0}
.mu-dots{display:flex;gap:8px}
.mu-dot{width:clamp(9px,1.5cqw,13px);aspect-ratio:1;border-radius:50%;border:1.5px solid #f1c978;transition:all .4s cubic-bezier(.3,1.6,.5,1)}
.mu-dot.on{background:radial-gradient(circle at 35% 30%,#fff3bf,#e8b84a);transform:scale(1.35);box-shadow:0 0 10px rgba(255,214,120,.7)}
.mu-count{margin:0;font-weight:700;font-size:clamp(11px,min(1.7cqw,2.2cqh),15px);letter-spacing:.1em;color:#ffeab1;white-space:nowrap}
.mu-hint{margin:0;font-style:italic;font-size:clamp(10px,1.5cqw,13px);color:rgba(255,233,201,.7)}

.mu-snd{flex:none;margin-left:auto;margin-right:clamp(6px,2cqw,22px);width:38px;height:38px;border-radius:50%;border:1.5px solid rgba(246,210,122,.7);background:rgba(0,0,0,.45);color:#f8dd86;cursor:pointer;font-size:16px;transition:background .2s ease}
.mu-snd:hover{background:rgba(246,210,122,.25)}.mu-snd:focus-visible{outline:2px solid #fff;outline-offset:2px}

/* the rooms */
.mu-view{position:relative;flex:1 1 0;min-height:0;width:100%;overflow:hidden;margin-top:calc(-1 * clamp(10px,2cqh,22px));margin-bottom:calc(-1 * clamp(10px,2cqh,22px))}
.mu-track{display:flex;height:100%;width:300%;transition:transform 1.1s cubic-bezier(.65,0,.25,1)}
.mu-room{container-type:size;position:relative;flex:0 0 33.3333%;height:100%;overflow:hidden}
.mu-wallbg{position:absolute;inset:0 0 17% 0;background:var(--w1);}
.mu-wallbg::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.035) 0 2px,transparent 2px 22px),radial-gradient(120% 90% at 50% 20%,rgba(255,200,120,.14),transparent 70%)}
.mu-wallbg::after{content:"";position:absolute;left:0;right:0;bottom:0;height:20%;background:linear-gradient(180deg,var(--w2),var(--w3));border-top:3px solid #d9a336;box-shadow:0 -2px 0 rgba(255,243,191,.35),inset 0 8px 14px rgba(0,0,0,.25)}
.mu-wallbg::after{background-image:repeating-linear-gradient(90deg,transparent 0 calc(100%/6 - 3px),rgba(0,0,0,.25) calc(100%/6 - 3px) calc(100%/6))}
.mu-rail{position:absolute;left:0;right:0;top:calc(clamp(22px,4cqh,40px));height:6px;background:linear-gradient(180deg,#fff0a8,#d9a336 60%,#8a5a12);box-shadow:0 3px 6px rgba(0,0,0,.5);z-index:2}
.mu-floor{position:absolute;left:0;right:0;bottom:0;height:17%;background:linear-gradient(180deg,#2a140e,#1a0b07);overflow:hidden}
.mu-floor::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 2px,transparent 2px 70px),linear-gradient(180deg,rgba(255,255,255,.1),transparent 40%)}
.mu-carpet{position:absolute;left:8%;right:8%;top:-10%;bottom:0;background:linear-gradient(180deg,#8a111c,#5a0a14);border-left:6px solid #d9a336;border-right:6px solid #d9a336;box-shadow:0 0 24px rgba(0,0,0,.5);transform:perspective(300px) rotateX(18deg);transform-origin:50% 100%}
.mu-carpet::before{content:"";position:absolute;inset:8px;border:2px dashed rgba(255,230,160,.5)}

.mu-wall{position:absolute;left:0;right:0;top:calc(clamp(22px,4cqh,40px) + 6px);bottom:17%;display:grid;grid-template-columns:1fr .55fr 1fr .55fr 1fr;align-items:center;justify-items:center;padding:0 clamp(8px,2cqw,28px);z-index:3}
@container mu (aspect-ratio < 1.15){
  .mu-wall{grid-template-columns:1fr;grid-template-rows:repeat(3,1fr);align-items:center;padding:clamp(6px,1.4cqh,14px) clamp(8px,3cqw,20px)}
  .mu-deco{display:none !important}
}

/* an exhibit */
.mu-ex{position:relative;display:flex;flex-direction:column;align-items:center;gap:clamp(5px,1.1cqh,12px);min-width:0;animation:mu-pop .8s cubic-bezier(.3,1.3,.5,1) both;animation-delay:var(--d,0s)}
@keyframes mu-pop{from{opacity:0;transform:translateY(18px) scale(.94)}to{opacity:1;transform:none}}
@container mu (aspect-ratio < 1.15){.mu-ex{flex-direction:row;gap:clamp(10px,3cqw,22px);width:100%;justify-content:flex-start;padding-left:clamp(4px,3cqw,18px)}}
.mu-spot{position:absolute;left:50%;top:-14%;width:170%;height:118%;transform:translateX(-50%);background:linear-gradient(180deg,rgba(255,226,160,.26),rgba(255,226,160,.04) 80%,transparent);clip-path:polygon(41% 0,59% 0,100% 100%,0 100%);pointer-events:none;mix-blend-mode:screen;z-index:0;animation:mu-glow 5s ease-in-out infinite alternate}
@keyframes mu-glow{from{opacity:.75}to{opacity:1}}
@container mu (aspect-ratio < 1.15){.mu-spot{display:none}}
.mu-lamp{position:absolute;left:50%;top:-5%;width:3.4cqh;height:1.8cqh;min-width:20px;transform:translateX(-50%);border-radius:3px 3px 8px 8px;background:linear-gradient(180deg,#e8b84a,#8a5a12);box-shadow:0 0 14px 3px rgba(255,226,160,.7);z-index:2}
@container mu (aspect-ratio < 1.15){.mu-lamp{display:none}}
.mu-fr{position:relative;z-index:1;display:block;height:var(--fh);aspect-ratio:4/5;padding:0;border:0;background:none;cursor:pointer;transition:transform .35s cubic-bezier(.3,1.4,.5,1);filter:drop-shadow(0 10px 12px rgba(0,0,0,.55));-webkit-tap-highlight-color:transparent;flex:none}
.mu-fr:hover,.mu-fr:focus-visible{transform:translateY(-5px) scale(1.03);outline:none}
.mu-fr:focus-visible .mu-bd{box-shadow:0 0 0 4px #2f7fd0}
.mu-room{--fh:min(52cqh,32cqw)}
@container mu (aspect-ratio < 1.15){.mu-room{--fh:min(25cqh,28cqw)}}
.mu-bd{position:absolute;inset:0;border-radius:3px;background:linear-gradient(135deg,#fff0a8,#d9a336 25%,#7a4f10 50%,#f1cd6a 75%,#a8721f);box-shadow:inset 0 0 0 2px rgba(60,30,0,.5)}
.f-wood .mu-bd{background:linear-gradient(135deg,#9a6a42,#4a2a14 40%,#7a4a28 70%,#3a1d0c);box-shadow:inset 0 0 0 2px rgba(0,0,0,.5),inset 0 0 0 5px rgba(255,255,255,.07)}
.f-oval .mu-bd{border-radius:50%}
.mu-mat{position:absolute;inset:7%;background:#f6ecd6;box-shadow:inset 0 0 8px rgba(0,0,0,.45)}
.f-oval .mu-mat{border-radius:50%;inset:8%}
.mu-photo{position:absolute;inset:9%;overflow:hidden;background:#2a2a3a;box-shadow:inset 0 0 0 1px rgba(0,0,0,.4)}
.f-oval .mu-photo{border-radius:50%;inset:10%}
.mu-photo img{display:block;width:100%;height:100%;object-fit:cover}
.mu-ph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.25em;text-align:center;background:linear-gradient(135deg,#6a1c34,#1d3a5e 60%,#14543a);color:#ffe9b8;font-style:italic;font-size:clamp(9px,1.6cqh,14px);padding:6%}
.mu-ph b{font-size:2.8em;font-style:normal;line-height:1}
.mu-seen{position:absolute;right:-6px;top:-6px;z-index:3;width:clamp(18px,2.8cqh,26px);aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:clamp(10px,1.7cqh,15px);font-weight:700;color:#4a1420;background:radial-gradient(circle at 35% 30%,#fff3bf,#e8b84a 60%,#a8721f);box-shadow:0 0 0 2px #1a0b07,0 3px 8px rgba(0,0,0,.5)}
.mu-orn{position:absolute;pointer-events:none;z-index:3}

/* vitrine (souvenir objects) */
.mu-vit{position:relative;z-index:1;height:var(--fh);aspect-ratio:4/5;display:block;padding:0;border:0;background:none;cursor:pointer;transition:transform .35s cubic-bezier(.3,1.4,.5,1);filter:drop-shadow(0 10px 12px rgba(0,0,0,.55));flex:none}
.mu-vit:hover,.mu-vit:focus-visible{transform:translateY(-5px) scale(1.03);outline:none}
.mu-vit:focus-visible .mu-glass{box-shadow:0 0 0 4px #2f7fd0}
.mu-glass{position:absolute;left:6%;right:6%;top:0;height:72%;border-radius:6px 6px 2px 2px;background:linear-gradient(135deg,rgba(255,255,255,.28),rgba(255,255,255,.06) 40%,rgba(180,210,255,.12));border:2px solid rgba(220,235,255,.55);box-shadow:inset 0 0 20px rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;overflow:hidden;background-color:rgba(20,18,40,.55)}
.mu-glass::after{content:"";position:absolute;left:12%;top:-10%;width:18%;height:130%;background:linear-gradient(90deg,rgba(255,255,255,.35),transparent);transform:skewX(-14deg)}
.mu-obj{font-size:calc(var(--fh) * .34);line-height:1;filter:drop-shadow(0 6px 6px rgba(0,0,0,.55));animation:mu-float 3.6s ease-in-out infinite alternate}
@keyframes mu-float{from{transform:translateY(0) rotate(-4deg)}to{transform:translateY(-6px) rotate(4deg)}}
.mu-obj img{display:block;max-width:100%;max-height:100%;object-fit:contain}
.mu-ped{position:absolute;left:0;right:0;bottom:0;height:30%;border-radius:3px;background:linear-gradient(180deg,#f1ece0,#bfb8a6);box-shadow:inset 0 3px 0 rgba(255,255,255,.7),inset 0 -6px 10px rgba(0,0,0,.25)}
.mu-ped i{position:absolute;left:50%;top:32%;transform:translateX(-50%);width:44%;height:22%;border-radius:2px;background:linear-gradient(180deg,#e8b84a,#8a5a12)}

/* museum label */
.mu-pl{position:relative;z-index:1;max-width:100%;padding:clamp(3px,.8cqh,8px) clamp(8px,1.6cqw,14px);text-align:center;border-radius:3px;background:linear-gradient(180deg,#f6ecd4,#e2cfa2);border:1px solid #b89a5a;box-shadow:0 4px 10px rgba(0,0,0,.45);color:#3b2410;flex:none}
.mu-pl b{display:block;font-family:'Cinzel',serif;font-weight:700;letter-spacing:.04em;line-height:1.15;font-size:clamp(9px,min(1.45cqw,2cqh),14px)}
.mu-pl i{display:block;margin-top:.15em;font-size:clamp(9px,min(1.3cqw,1.8cqh),13px);line-height:1.15;color:#6a4a2a}
@container mu (aspect-ratio < 1.15){
  .mu-pl{text-align:left;padding:clamp(5px,1cqh,10px) clamp(8px,2cqw,14px);flex:1;min-width:0}
  .mu-pl b{font-size:clamp(11px,3.3cqw,15px)}.mu-pl i{font-size:clamp(10px,3cqw,14px)}
}

/* decorations */
.mu-deco{position:relative;display:flex;align-items:flex-end;justify-content:center;width:100%;height:100%;pointer-events:none}
.mu-deco svg{display:block;max-width:100%;max-height:78%;height:auto}
.mu-tw{animation:mu-tw 2.6s ease-in-out infinite}
@keyframes mu-tw{0%,100%{opacity:1}50%{opacity:.3}}
.mu-snowwin{animation:mu-wfall linear infinite}
@keyframes mu-wfall{0%{transform:translate(0,-10px)}100%{transform:translate(6px,150px)}}
.mu-garland{position:absolute;left:0;right:0;top:calc(clamp(22px,4cqh,40px) - 6px);height:clamp(24px,5cqh,44px);width:100%;z-index:2;pointer-events:none}
.mu-post{position:absolute;bottom:2%;z-index:4;pointer-events:none}

/* entrance gate */
.mu-gate{position:absolute;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;transition:visibility 0s linear 1.8s}
.mu-gate.open{visibility:hidden;pointer-events:none}
.mu-cur{position:absolute;top:0;bottom:0;width:51%;background:repeating-linear-gradient(90deg,#4a0710 0,#9a1628 6%,#5e0b16 11%,#2b040a 16%,#7e1220 24%,#4a0710 30%);box-shadow:inset 0 0 50px rgba(0,0,0,.65),0 0 40px #000;transition:transform 1.7s cubic-bezier(.6,.05,.3,1)}
.mu-cur.l{left:0;border-right:4px solid #d9a336}.mu-cur.r{right:0;border-left:4px solid #d9a336}
.mu-cur::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.5),transparent 28%,transparent 72%,rgba(0,0,0,.6))}
.mu-gate.open .mu-cur.l{transform:translateX(-102%)}.mu-gate.open .mu-cur.r{transform:translateX(102%)}
.mu-gsign{position:relative;z-index:3;text-align:center;padding:0 5cqw;transition:opacity .7s ease,transform .7s ease}
.mu-gate.open .mu-gsign{opacity:0;transform:scale(.9)}
.mu-plate{display:inline-block;position:relative;padding:.5em 1.8em .6em;border-radius:12px;background:linear-gradient(180deg,#2b0a10,#14050a);box-shadow:0 0 0 3px #d9a336,0 0 0 6px #5a3a0c,0 14px 30px rgba(0,0,0,.6),0 0 50px rgba(255,200,110,.25)}
.mu-pb{position:absolute;width:clamp(6px,1cqw,10px);aspect-ratio:1;border-radius:50%;animation:mu-chase 1.4s steps(1) infinite}
@keyframes mu-chase{0%,100%{background:#fff3bf;box-shadow:0 0 8px 2px #ffd45a}50%{background:#6b4a14;box-shadow:none}}
.mu-gk{margin:0;font-size:clamp(10px,min(1.6cqw,2cqh),14px);letter-spacing:.36em;text-transform:uppercase;font-weight:700;color:#f0a99a}
.mu-gt{margin:.1em 0 0;font-family:'Cinzel',serif;font-weight:900;letter-spacing:.14em;line-height:1.1;font-size:clamp(22px,min(5.4cqw,8cqh),64px);background:linear-gradient(180deg,#fffbe0,#f8dd86 45%,#d9a336 75%,#fbe493);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 14px rgba(255,200,90,.5))}
.mu-gs{margin:.6em 0 0;font-style:italic;font-weight:600;font-size:clamp(14px,min(2.4cqw,3.2cqh),24px);color:#ffe3c8;text-shadow:0 2px 8px #000}
.mu-go{margin-top:clamp(10px,2.6cqh,24px);padding:.6em 2em;border:0;border-radius:999px;cursor:pointer;font-family:'Cinzel',serif;font-weight:700;letter-spacing:.14em;font-size:clamp(12px,min(2cqw,2.6cqh),18px);color:#4a1420;position:relative;overflow:hidden;
  background:linear-gradient(180deg,#fff3bf,#e8b84a 55%,#c98a1e);box-shadow:0 5px 0 #8a5a12,0 12px 24px rgba(0,0,0,.5),0 0 30px rgba(255,214,120,.4)}
.mu-go::after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);animation:mu-sheen 3s ease-in-out infinite}
@keyframes mu-sheen{0%,60%{left:-60%}100%{left:130%}}
.mu-go:hover{filter:brightness(1.06)}.mu-go:active{transform:translateY(3px)}.mu-go:focus-visible{outline:3px solid #fff;outline-offset:3px}

/* detail overlay */
.mu-det{position:absolute;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:clamp(8px,2.4cqh,26px);background:rgba(6,3,8,.84);backdrop-filter:blur(3px);animation:mu-vfade .4s ease both}
@keyframes mu-vfade{from{opacity:0}to{opacity:1}}
.mu-dc{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr);gap:clamp(14px,3cqw,40px);align-items:center;width:min(100%,960px);max-height:100%;overflow:auto;padding:clamp(10px,2cqh,22px) clamp(14px,3cqw,34px);scrollbar-width:thin;animation:mu-card .8s cubic-bezier(.2,.9,.3,1) both}
@keyframes mu-card{from{opacity:0;transform:translateY(24px) scale(.95)}to{opacity:1;transform:none}}
@container mu (aspect-ratio < 1.15){.mu-dc{grid-template-columns:1fr;justify-items:center;gap:clamp(8px,1.6cqh,16px)}}
.mu-big{position:relative;--fh:min(66cqh,40cqw);height:var(--fh);aspect-ratio:4/5;filter:drop-shadow(0 20px 30px rgba(0,0,0,.7)) drop-shadow(0 0 40px rgba(255,200,110,.25))}
@container mu (aspect-ratio < 1.15){.mu-big{--fh:min(34cqh,62cqw)}}
.mu-card{position:relative;border-radius:16px;padding:clamp(12px,2.4cqh,26px) clamp(14px,2.6cqw,28px);color:#3b2410;background:radial-gradient(120% 100% at 30% 10%,#fbefd3,#f1dcb0 60%,#e5c98f);box-shadow:inset 0 0 50px rgba(150,100,40,.35),0 0 0 3px #d9a336,0 0 0 6px #7a4f10,0 24px 50px rgba(0,0,0,.6)}
.mu-card::before{content:"";position:absolute;inset:6px;border:1.5px dashed rgba(138,26,46,.4);border-radius:11px;pointer-events:none}
.mu-ck{margin:0;font-family:'Cinzel',serif;font-weight:700;letter-spacing:.24em;text-transform:uppercase;font-size:clamp(9px,min(1.4cqw,1.8cqh),12px);color:#a8281f}
.mu-ct{margin:.15em 0 0;font-family:'Mountains of Christmas',cursive;font-weight:700;line-height:1.05;font-size:clamp(22px,min(4.2cqw,6cqh),42px);color:#8a1a2e}
.mu-cd{margin:.25em 0 0;font-style:italic;font-weight:600;font-size:clamp(13px,min(1.9cqw,2.7cqh),18px);color:#6a4a2a}
.mu-cr{height:1px;margin:.7em 0;background:linear-gradient(90deg,rgba(138,26,46,.5),transparent)}
.mu-cl{margin:0;font-family:'Cinzel',serif;font-weight:700;font-size:clamp(9px,1.4cqw,12px);letter-spacing:.16em;text-transform:uppercase;color:#806344}
.mu-cv{margin:.1em 0 .5em;font-style:italic;font-weight:600;font-size:clamp(13px,min(1.9cqw,2.6cqh),18px);color:#4a2a1e}
.mu-cm{margin:.1em 0 0;font-style:italic;font-weight:600;font-size:clamp(14px,min(2.2cqw,3.1cqh),21px);line-height:1.5;color:#3b2410}
.mu-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:clamp(8px,1.6cqh,14px)}
.mu-btn{padding:.35em 1.1em;border:1.5px solid #8a1a2e;border-radius:999px;cursor:pointer;font-weight:700;font-size:clamp(12px,min(1.8cqw,2.4cqh),16px);color:#8a1a2e;background:rgba(255,255,255,.55);transition:background .2s ease}
.mu-btn:hover{background:#fff}.mu-btn:focus-visible{outline:3px solid #2f7fd0;outline-offset:2px}
.mu-btn.pri{background:linear-gradient(180deg,#e0453d,#a3121f);color:#fff6e4;border-color:#7a0f1a}
.mu-btn.pri:hover{filter:brightness(1.08)}
.mu-eq{display:inline-flex;align-items:flex-end;gap:2px;height:12px;margin-left:.4em}
.mu-eq i{display:block;width:3px;background:#a8281f;animation:mu-eq .8s ease-in-out infinite alternate}
.mu-eq i:nth-child(2){animation-delay:-.3s}.mu-eq i:nth-child(3){animation-delay:-.6s}
@keyframes mu-eq{from{height:3px}to{height:12px}}
.mu-x{position:absolute;right:clamp(10px,2cqw,22px);top:clamp(10px,2cqh,22px);z-index:3;width:38px;height:38px;border-radius:50%;border:0;cursor:pointer;font-size:16px;font-weight:700;color:#5a0f19;background:radial-gradient(circle at 35% 30%,#fff3bf,#e8b84a 60%,#a8721f);box-shadow:0 3px 8px rgba(0,0,0,.5)}
.mu-x:focus-visible{outline:3px solid #2f7fd0}

/* completion */
.mu-done{position:absolute;inset:0;z-index:35;display:flex;align-items:center;justify-content:center;padding:clamp(10px,3cqh,30px);background:rgba(8,4,10,.8);backdrop-filter:blur(3px);animation:mu-vfade .5s ease both}
.mu-done .mu-card{width:min(100%,520px);text-align:center;animation:mu-card .9s cubic-bezier(.2,.9,.3,1) both}
.mu-conf{position:absolute;top:-6%;pointer-events:none;animation:mu-conf linear infinite;z-index:36}
@keyframes mu-conf{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(115cqh) rotate(720deg);opacity:.9}}
.mu-flake{position:absolute;top:-4%;border-radius:50%;background:#fff;pointer-events:none;animation:mu-fall linear infinite;z-index:1}
@keyframes mu-fall{0%{transform:translate(0,0)}50%{transform:translate(14px,55cqh)}100%{transform:translate(-8px,110cqh)}}

@media (prefers-reduced-motion: reduce){
  .mu-spot,.mu-obj,.mu-tw,.mu-snowwin,.mu-pb,.mu-go::after,.mu-eq i,.mu-conf,.mu-flake{animation:none !important}
  .mu-track,.mu-cur,.mu-gsign{transition-duration:.01s !important}.mu-ex,.mu-dc,.mu-done .mu-card,.mu-rn,.mu-rs{animation-duration:.01s !important}
}
`;

const WALLS = {
  green: { w1: "linear-gradient(180deg,#163f30,#0e2a20)", w2: "#12392b", w3: "#0a2218" },
  wine: { w1: "linear-gradient(180deg,#5a1626,#34091a)", w2: "#4a1020", w3: "#2a0813" },
  navy: { w1: "linear-gradient(180deg,#1a2a5a,#0e1738)", w2: "#16224a", w3: "#0a1128" },
};

/* ------------------------------------------------------------------ */
/*  Little SVG pieces                                                  */
/* ------------------------------------------------------------------ */

function BowOrn({ style }) {
  return (
    <svg viewBox="0 0 120 70" style={style} className="mu-orn" aria-hidden="true">
      <path d="M52 34Q44 62 26 68Q40 46 48 32Z" fill="#8a111c" stroke="#8a111c" strokeWidth="4" strokeLinejoin="round" />
      <path d="M68 34Q76 62 94 68Q80 46 72 32Z" fill="#8a111c" stroke="#8a111c" strokeWidth="4" strokeLinejoin="round" />
      <path d="M56 30Q34 -4 8 8Q-2 24 22 36Q44 42 58 34Z" fill="#d9262f" stroke="#e0453d" strokeWidth="5" strokeLinejoin="round" />
      <path d="M64 30Q86 -4 112 8Q122 24 98 36Q76 42 62 34Z" fill="#d9262f" stroke="#e0453d" strokeWidth="5" strokeLinejoin="round" />
      <path d="M50 26Q36 12 22 16" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="3.4" strokeLinecap="round" />
      <ellipse cx="60" cy="32" rx="11" ry="10" fill="#b01c2a" stroke="#b01c2a" strokeWidth="3" /><circle cx="60" cy="32" r="4.5" fill="#f8dd86" />
    </svg>
  );
}
function HollyOrn({ style }) {
  return (
    <svg viewBox="0 0 90 70" style={style} className="mu-orn" aria-hidden="true">
      <defs><linearGradient id="muL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38b06a" /><stop offset="1" stopColor="#0f5a36" /></linearGradient></defs>
      {[-70, -20, 30, 80].map((r, i) => <g key={i} transform={`translate(18 56) rotate(${r})`}><path d="M0 0Q10 -9 26 -2Q34 -16 48 -7Q58 -3 62 5Q54 14 42 12Q34 24 24 16Q10 20 0 0Z" fill="url(#muL)" stroke="#0a3b23" strokeWidth="1.2" /></g>)}
      {[[26, 46], [38, 50], [32, 58]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="6" fill="#d4222f" stroke="#7a0f1a" /><circle cx={x - 2} cy={y - 2} r="1.8" fill="#fff" opacity=".75" /></g>)}
    </svg>
  );
}

function WindowDeco({ flakes, tone }) {
  return (
    <svg viewBox="0 0 120 200" aria-hidden="true">
      <defs>
        <linearGradient id={`muSky${tone}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a0d28" /><stop offset="1" stopColor="#3a2a5a" /></linearGradient>
        <linearGradient id="muGoldW" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3bf" /><stop offset=".5" stopColor="#e8b84a" /><stop offset="1" stopColor="#8a5a12" /></linearGradient>
        <clipPath id={`muClip${tone}`}><path d="M18 190V70Q18 20 60 20Q102 20 102 70V190Z" /></clipPath>
      </defs>
      <path d="M12 196V68Q12 12 60 12Q108 12 108 68V196Z" fill="url(#muGoldW)" />
      <path d="M18 190V70Q18 20 60 20Q102 20 102 70V190Z" fill={`url(#muSky${tone})`} />
      <g clipPath={`url(#muClip${tone})`}>
        {[[30, 50], [78, 40], [50, 70], [90, 90], [24, 110]].map(([x, y], i) => <circle key={i} className="mu-tw" cx={x} cy={y} r="1.4" fill="#fff6d8" style={{ animationDelay: `${i * 0.5}s` }} />)}
        <circle cx="86" cy="48" r="9" fill="#fff6dc" />
        {flakes.map((f, i) => <circle key={i} className="mu-snowwin" cx={f.x} cy={f.y} r={f.r} fill="#fff" opacity={f.o} style={{ animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} />)}
        <path d="M18 176Q60 160 102 176V190H18Z" fill="#e8eeff" />
      </g>
      <path d="M60 20V190M18 105H102" stroke="#8a5a12" strokeWidth="4" />
      <rect x="8" y="188" width="104" height="10" rx="3" fill="url(#muGoldW)" />
      {/* wreath */}
      <g transform="translate(60 118)">
        <circle r="17" fill="none" stroke="#1f7a45" strokeWidth="9" /><circle r="17" fill="none" stroke="#38b06a" strokeWidth="2" strokeDasharray="3 5" />
        {[[-13, 6], [12, -9], [10, 12], [-6, -15]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#d9262f" />)}
        <path d="M0 18L-8 30L0 26L8 30Z" fill="#d9262f" /><circle cx="0" cy="17" r="3.4" fill="#b01c2a" />
      </g>
    </svg>
  );
}

function TreeDeco() {
  const cols = ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"];
  const lights = [[-10, 52], [12, 70], [-22, 92], [20, 112], [-30, 134], [28, 150], [0, 98], [-6, 40], [8, 128]];
  return (
    <svg viewBox="-70 0 140 250" aria-hidden="true">
      <defs><linearGradient id="muLeaf2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f9a52" /><stop offset="1" stopColor="#0f5a36" /></linearGradient></defs>
      <rect x="-9" y="196" width="18" height="22" fill="#6a3a18" />
      <path d="M0 14L22 66H10L32 104H14L40 146H18L48 196H-48L-18 146H-40L-14 104H-32L-10 66H-22Z" fill="url(#muLeaf2)" stroke="#0a3b23" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M-40 146Q0 168 40 146M-30 104Q0 122 30 104M-20 66Q0 80 20 66" fill="none" stroke="#f6e7c1" strokeWidth="3" strokeLinecap="round" />
      {lights.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="6" fill={cols[i % 5]} opacity=".3" /><circle className="mu-tw" cx={x} cy={y} r="3" fill={cols[i % 5]} style={{ animationDelay: `${i * 0.27}s` }} /></g>)}
      <path d="M0 -6L5 6L18 6L8 14L12 27L0 19L-12 27L-8 14L-18 6L-5 6Z" fill="#ffd45a" style={{ filter: "drop-shadow(0 0 6px #ffd45a)" }} />
      {/* presents */}
      <rect x="-46" y="206" width="30" height="24" rx="3" fill="#d9262f" /><rect x="-33" y="206" width="6" height="24" fill="#f6e7c1" /><rect x="-46" y="215" width="30" height="5" fill="#f6e7c1" />
      <rect x="14" y="210" width="34" height="20" rx="3" fill="#2f6fd0" /><rect x="29" y="210" width="6" height="20" fill="#f2c24a" /><rect x="14" y="217" width="34" height="5" fill="#f2c24a" />
      <rect x="-12" y="216" width="22" height="14" rx="3" fill="#8a4fd0" /><rect x="-3" y="216" width="5" height="14" fill="#f6e7c1" />
    </svg>
  );
}

function Garland({ n = 18, id }) {
  const pts = Array.from({ length: n }, (_, i) => ({ x: (i + 0.5) * (1000 / n), y: 8 + Math.abs(Math.sin(i * 0.55)) * 14, c: ["#ff5a5a", "#ffd45a", "#4ade80", "#7dd3fc", "#ff9ad5"][i % 5] }));
  return (
    <svg className="mu-garland" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
      <path d={`M0 6 ${pts.map((p) => `Q${p.x - 20} ${p.y + 14} ${p.x} ${p.y + 6}`).join(" ")} L1000 6`} fill="none" stroke="#0f4a2c" strokeWidth="12" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {pts.map((p, i) => (<g key={`${id}${i}`}><circle cx={p.x} cy={p.y + 8} r="9" fill={p.c} opacity=".3" /><circle className="mu-tw" cx={p.x} cy={p.y + 8} r="4.4" fill={p.c} style={{ animationDelay: `${(i % 5) * 0.4}s` }} /></g>))}
      {pts.filter((_, i) => i % 3 === 1).map((p, i) => <circle key={`b${i}`} cx={p.x + 18} cy={p.y + 12} r="5" fill="#d4222f" stroke="#7a0f1a" />)}
    </svg>
  );
}

function RopePost({ style }) {
  return (
    <svg viewBox="0 0 60 110" style={style} className="mu-post" aria-hidden="true">
      <ellipse cx="30" cy="104" rx="22" ry="5" fill="#000" opacity=".4" />
      <rect x="26" y="18" width="8" height="82" fill="url(#muGoldW)" /><ellipse cx="30" cy="100" rx="20" ry="6" fill="#a8721f" />
      <circle cx="30" cy="14" r="9" fill="#e8b84a" stroke="#8a5a12" />
      <path d="M30 24Q60 34 62 50" fill="none" stroke="#a3121f" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Exhibit pieces                                                     */
/* ------------------------------------------------------------------ */

function Media({ ex }) {
  return ex.src ? <img src={ex.src} alt={ex.title} draggable={false} /> : <span className="mu-ph"><b aria-hidden="true">{ex.emoji}</b>{TEXTS.placeholder}</span>;
}

function Piece({ ex, big, seen, onOpen, label }) {
  const content = ex.kind === "photo" ? (
    <>
      <span className="mu-bd" />
      <span className="mu-mat"><span className="mu-photo"><Media ex={ex} /></span></span>
      {ex.frame !== "oval" && ex.frame !== "wood" && <BowOrn style={{ left: "50%", top: "-9%", width: "34%", transform: "translateX(-50%)" }} />}
      {ex.frame === "wood" && <HollyOrn style={{ right: "-8%", bottom: "-6%", width: "34%", transform: "scaleX(-1)" }} />}
      {ex.frame === "oval" && <HollyOrn style={{ left: "-6%", top: "6%", width: "30%", transform: "rotate(-30deg)" }} />}
    </>
  ) : (
    <>
      <span className="mu-glass"><span className="mu-obj">{ex.src ? <img src={ex.src} alt={ex.title} /> : ex.emoji}</span></span>
      <span className="mu-ped"><i /></span>
      <HollyOrn style={{ left: "-8%", bottom: "-4%", width: "34%" }} />
    </>
  );
  if (big) return <div className={`mu-big ${ex.kind === "photo" ? `mu-fr f-${ex.frame}` : "mu-vit"}`} style={{ transform: "none", cursor: "default" }}>{content}</div>;
  return (
    <button type="button" className={ex.kind === "photo" ? `mu-fr f-${ex.frame}` : "mu-vit"} onClick={onOpen} aria-label={`${TEXTS.seeNote}: ${ex.title}`}>
      {content}
      {seen && <span className="mu-seen" aria-hidden="true">✓</span>}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ChristmasMuseum() {
  const [entered, setEntered] = useState(false);
  const [gone, setGone] = useState(false);
  const [room, setRoom] = useState(0);
  const [open, setOpen] = useState(null); // index in EXHIBITS
  const [visited, setVisited] = useState(() => new Set());
  const [speaking, setSpeaking] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const doneShown = useRef(false);
  const timers = useRef([]);
  const ambient = useAmbient();

  const total = EXHIBITS.length;
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

  const stopSpeech = useCallback(() => { if (canSpeak) window.speechSynthesis.cancel(); setSpeaking(false); }, [canSpeak]);
  useEffect(() => () => { timers.current.forEach(clearTimeout); if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);

  const enter = () => { ambient.start(); setEntered(true); timers.current.push(setTimeout(() => setGone(true), 1900)); };
  const openEx = (i) => { stopSpeech(); setOpen(i); setVisited((v) => new Set(v).add(EXHIBITS[i].id)); };
  const closeEx = useCallback(() => { stopSpeech(); setOpen(null); }, [stopSpeech]);
  const step = (d) => { const i = (open + d + total) % total; openEx(i); setRoom(EXHIBITS[i].room); };

  const speak = () => {
    if (!canSpeak || open === null) return;
    if (speaking) { stopSpeech(); return; }
    const ex = EXHIBITS[open];
    const u = new SpeechSynthesisUtterance(`${ex.title}. ${ex.date}. ${ex.memory}`);
    u.lang = "es-ES"; u.rate = 0.95; u.pitch = 1.05;
    u.onend = () => setSpeaking(false); u.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); setSpeaking(true);
  };

  // the music keeps playing but is silenced while the audio guide talks
  useEffect(() => { ambient.setDuck(speaking); }, [speaking]); // eslint-disable-line react-hooks/exhaustive-deps

  // finished the whole collection → little celebration (once)
  useEffect(() => {
    if (open === null && visited.size === total && !doneShown.current) { doneShown.current = true; timers.current.push(setTimeout(() => setShowDone(true), 500)); }
  }, [open, visited, total]);

  useEffect(() => {
    const onKey = (e) => {
      if (!entered) return;
      if (open !== null) {
        if (e.key === "Escape") closeEx();
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      } else if (!showDone) {
        if (e.key === "ArrowRight") setRoom((r) => Math.min(ROOMS.length - 1, r + 1));
        if (e.key === "ArrowLeft") setRoom((r) => Math.max(0, r - 1));
      } else if (e.key === "Escape") setShowDone(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const winFlakes = useMemo(() => { const r = rng(5); return Array.from({ length: 12 }, () => ({ x: 20 + r() * 80, y: 20 + r() * 40, r: 0.8 + r() * 1.4, o: 0.5 + r() * 0.5, dur: 4 + r() * 4, delay: -r() * 8 })); }, []);
  const flakes = useMemo(() => { const r = rng(7); return Array.from({ length: 16 }, (_, i) => ({ id: i, left: r() * 100, size: r() * 3 + 2, dur: r() * 7 + 9, delay: -r() * 14, o: 0.2 + r() * 0.4 })); }, []);
  const plate = useMemo(() => [...Array.from({ length: 16 }, (_, i) => ({ k: `t${i}`, s: { left: `${(i + 0.5) * 6.25}%`, top: -4 }, d: (i % 2) * 0.7 })), ...Array.from({ length: 16 }, (_, i) => ({ k: `b${i}`, s: { left: `${(i + 0.5) * 6.25}%`, bottom: -4 }, d: ((i + 1) % 2) * 0.7 }))], []);
  const confetti = useMemo(() => { const r = rng(9); return Array.from({ length: 30 }, (_, i) => ({ id: i, left: r() * 100, c: ["#ffd45a", "#ff6f9d", "#f6e7c1", "#7dd3fc", "#ff9ad5", "#fff3bf"][i % 6], dur: 4 + r() * 4, delay: -r() * 6, w: 6 + r() * 6 })); }, []);

  const exOpen = open !== null ? EXHIBITS[open] : null;
  const roomOf = (i) => EXHIBITS.filter((e) => e.room === i);

  return (
    <section className="mu max-w-full max-h-full">
      <style>{CSS}</style>
      {flakes.map((f) => <span key={f.id} className="mu-flake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true" />)}

      <header className="mu-head">
        <div className="mu-brand">
          <p className="mu-bk">{TEXTS.edition}</p>
          <h1 className="mu-bt">{TEXTS.museum}</h1>
        </div>
        <button type="button" className="mu-snd" onClick={ambient.toggle} aria-pressed={ambient.on} aria-label={ambient.on ? TEXTS.musicOn : TEXTS.musicOff} title={ambient.on ? TEXTS.musicOn : TEXTS.musicOff}>
          {speaking ? "🎧" : ambient.on ? "♫" : "♪"}
        </button>
        <div className="mu-room-t" key={room}>
          <p className="mu-rn">{TEXTS.room} {room + 1} · {ROOMS[room].name}</p>
          <p className="mu-rs">{ROOMS[room].sub}</p>
        </div>
      </header>

      <div className="mu-view">
        <div className="mu-track" style={{ transform: `translateX(-${room * 33.3333}%)` }}>
          {ROOMS.map((r, ri) => {
            const wc = WALLS[r.wall];
            const list = roomOf(ri);
            return (
              <div key={r.name} className="mu-room" style={{ "--w1": wc.w1, "--w2": wc.w2, "--w3": wc.w3 }}>
                <div className="mu-wallbg" />
                <div className="mu-rail" />
                <Garland id={`g${ri}`} />
                <div className="mu-wall">
                  {list.map((ex, k) => {
                    const gi = EXHIBITS.indexOf(ex);
                    const cells = [];
                    cells.push(
                      <div key={ex.id} className="mu-ex" style={{ "--d": `${0.15 + k * 0.15}s`, gridColumn: undefined }}>
                        <span className="mu-spot" aria-hidden="true" /><span className="mu-lamp" aria-hidden="true" />
                        <Piece ex={ex} seen={visited.has(ex.id)} onOpen={() => openEx(gi)} />
                        <div className="mu-pl"><b>{ex.title}</b><i>{ex.date}</i></div>
                      </div>
                    );
                    if (k < list.length - 1) cells.push(<div key={`d${k}`} className="mu-deco">{k === (ri % 2) ? <WindowDeco tone={`${ri}${k}`} flakes={winFlakes} /> : <TreeDeco />}</div>);
                    return cells;
                  })}
                </div>
                <div className="mu-floor"><div className="mu-carpet" /></div>
                <RopePost style={{ left: "1.5%", height: "16%" }} /><RopePost style={{ right: "1.5%", height: "16%", transform: "scaleX(-1)" }} />
              </div>
            );
          })}
        </div>
      </div>

      <footer className="mu-foot">
        <button type="button" className="mu-nav" onClick={() => setRoom((r) => Math.max(0, r - 1))} disabled={room === 0} aria-label="Sala anterior">‹ {room > 0 ? `${TEXTS.room} ${room}` : ""}</button>
        <div className="mu-mid">
          <div className="mu-dots" aria-hidden="true">{ROOMS.map((_, i) => <span key={i} className={`mu-dot ${i === room ? "on" : ""}`} />)}</div>
          <p className="mu-count" aria-live="polite">{TEXTS.visited(visited.size, total)}</p>
          <p className="mu-hint">{TEXTS.tapHint}</p>
        </div>
        <button type="button" className="mu-nav" onClick={() => setRoom((r) => Math.min(ROOMS.length - 1, r + 1))} disabled={room === ROOMS.length - 1} aria-label="Sala siguiente">{room < ROOMS.length - 1 ? `${TEXTS.room} ${room + 2}` : ""} ›</button>
      </footer>

      {/* detail: the piece up close + its label */}
      {exOpen && (
        <div className="mu-det" role="dialog" aria-modal="true" aria-label={exOpen.title} onClick={closeEx}>
          <div className="mu-dc" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="mu-x" onClick={closeEx} aria-label={TEXTS.close} autoFocus>✕</button>
            <Piece ex={exOpen} big />
            <div className="mu-card">
              <p className="mu-ck">{TEXTS.plaqueTitle} · {TEXTS.room} {exOpen.room + 1}</p>
              <h2 className="mu-ct">{exOpen.title}</h2>
              <p className="mu-cd">{exOpen.date}</p>
              <div className="mu-cr" />
              <p className="mu-cl">{TEXTS.technique}</p>
              <p className="mu-cv">{exOpen.technique}</p>
              <p className="mu-cl">{TEXTS.curator}</p>
              <p className="mu-cm">{exOpen.memory}</p>
              <div className="mu-acts">
                {canSpeak && <button type="button" className="mu-btn pri" onClick={speak}>{speaking ? <>{TEXTS.stop}<span className="mu-eq" aria-hidden="true"><i /><i /><i /></span></> : TEXTS.listen}</button>}
                <button type="button" className="mu-btn" onClick={() => step(-1)}>{TEXTS.prev}</button>
                <button type="button" className="mu-btn" onClick={() => step(1)}>{TEXTS.next}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* the whole collection has been seen */}
      {showDone && (
        <div className="mu-done" role="dialog" aria-modal="true" aria-label={TEXTS.doneTitle}>
          {confetti.map((c) => <span key={c.id} className="mu-conf" style={{ left: `${c.left}%`, width: c.w, height: c.w * 1.5, background: c.c, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} aria-hidden="true" />)}
          <div className="mu-card">
            <p className="mu-ck">✦ {TEXTS.museum} ✦</p>
            <h2 className="mu-ct">{TEXTS.doneTitle}</h2>
            <div className="mu-cr" style={{ margin: ".7em auto", width: "40%" }} />
            <p className="mu-cm">{TEXTS.doneMsg}</p>
            <div className="mu-acts" style={{ justifyContent: "center" }}><button type="button" className="mu-btn pri" autoFocus onClick={() => setShowDone(false)}>{TEXTS.doneBtn}</button></div>
          </div>
        </div>
      )}

      {/* entrance */}
      {!gone && (
        <div className={`mu-gate ${entered ? "open" : ""}`}>
          <div className="mu-cur l" aria-hidden="true" /><div className="mu-cur r" aria-hidden="true" />
          <div className="mu-gsign">
            <div className="mu-plate">
              {plate.map((b) => <span key={b.k} className="mu-pb" style={{ ...b.s, animationDelay: `${b.d}s` }} aria-hidden="true" />)}
              <p className="mu-gk">{TEXTS.gateKick}</p>
              <h2 className="mu-gt">{TEXTS.gateTitle}</h2>
            </div>
            <p className="mu-gs">{TEXTS.gateSub}</p>
            <button type="button" className="mu-go" onClick={enter} tabIndex={entered ? -1 : 0}>{TEXTS.enter}</button>
          </div>
        </div>
      )}
    </section>
  );
}