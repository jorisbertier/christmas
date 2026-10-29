import React, { useEffect, useRef, useState } from "react";
import { SURPRISES, TEXTS } from "./surprises.js";

/* ------------------------------------------------------------------ */
/*  The card shown after the gift opens. Only the chosen surprise is   */
/*  ever rendered. Layout depends on `surprise.type`.                  */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&display=swap');
@keyframes srp-card{from{opacity:0;transform:translateY(24px) scale(.94)}to{opacity:1;transform:none}}
@keyframes srp-float{0%{transform:translateY(0) rotate(0);opacity:0}15%{opacity:.9}100%{transform:translateY(-110px) rotate(14deg);opacity:0}}
@keyframes srp-twinkle{0%,100%{opacity:.9;transform:scale(1)}50%{opacity:.35;transform:scale(.8)}}
.srp-card{animation:srp-card .8s cubic-bezier(.2,.9,.3,1) both}
.srp-ornament{position:absolute;pointer-events:none;animation:srp-float 6s ease-in infinite}
.srp-star{position:absolute;pointer-events:none;animation:srp-twinkle 3s ease-in-out infinite}
@media (prefers-reduced-motion: reduce){.srp-card{animation:none}.srp-ornament,.srp-star{animation:none;opacity:.5}}
`;

function useTyped(text, speed = 22) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(text.length); return undefined; }
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return text.slice(0, n);
}

function Ornaments({ glyphs = ["❤", "✦", "❄"] }) {
  const items = [[8, 78, 0], [86, 70, 1.4], [20, 40, 2.6], [76, 30, 3.8], [50, 88, 5], [92, 14, 0.8]];
  return (
    <>
      {items.map(([x, y, d], i) => (
        <span key={i} className="srp-ornament text-rose-400/70" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s`, fontSize: 14 + (i % 3) * 4 }} aria-hidden="true">{glyphs[i % glyphs.length]}</span>
      ))}
      {[[6, 10], [93, 40], [14, 92]].map(([x, y], i) => (
        <span key={`s${i}`} className="srp-star text-amber-300" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.9}s`, fontSize: 16 }} aria-hidden="true">✦</span>
      ))}
    </>
  );
}

function Letter({ s }) {
  const typed = useTyped(s.message, 26);
  return (
    <div className="relative overflow-hidden rounded-[10px] px-6 py-7 sm:px-10 sm:py-9 text-[#3b2410]" style={{ background: "radial-gradient(120% 100% at 30% 10%,#fbefd3,#f1dcb0 60%,#e5c98f)", boxShadow: "inset 0 0 60px rgba(150,100,40,.35), 0 20px 50px rgba(0,0,0,.55)", fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
      <Ornaments />
      <h2 className="text-center text-2xl sm:text-3xl font-bold italic text-[#7a1426]">{s.title}</h2>
      <div className="mx-auto my-3 h-px w-24 bg-gradient-to-r from-transparent via-[#b9822a] to-transparent" />
      <p className="relative min-h-[8.5em] text-lg sm:text-2xl italic leading-relaxed">{typed}<span className="opacity-40">{typed.length < s.message.length ? "▍" : ""}</span></p>
      <p className="mt-4 text-right text-2xl text-[#7a1426]" style={{ fontFamily: "'Caveat',cursive", opacity: typed.length >= s.message.length ? 1 : 0, transition: "opacity 1s" }}>{s.signature} ❤</p>
    </div>
  );
}

function Voucher({ s }) {
  const v = s.voucher;
  return (
    <div className="relative overflow-hidden rounded-xl p-2 shadow-2xl" style={{ background: "linear-gradient(135deg,#fff3bf,#d9a336 40%,#8a5a12 55%,#f1cd6a)" }}>
      <div className="relative rounded-lg border-2 border-dashed border-[#b9822a] px-5 py-6 text-center sm:px-8" style={{ background: "linear-gradient(180deg,#fffaf0,#f6ead0)", color: "#4a1420", fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
        <Ornaments glyphs={["🎁", "✦", "❄"]} />
        <div className="mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-[#7a1426] text-3xl shadow-lg" aria-hidden="true">🎁</div>
        <h2 className="text-lg font-semibold italic text-[#8a5a12]">{s.title}</h2>
        <p className="mt-1 text-4xl font-bold italic text-[#7a1426] sm:text-5xl">{v.heading}</p>
        <div className="mx-auto my-3 h-px w-40 bg-gradient-to-r from-transparent via-[#b9822a] to-transparent" />
        <p className="text-2xl font-bold italic sm:text-3xl">{v.activity}</p>
        <p className="mt-1 text-lg italic opacity-80">{v.details}</p>
        <p className="mx-auto mt-3 max-w-md text-base italic leading-snug sm:text-lg">{s.message}</p>
        <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#b9822a] pt-2 text-sm italic opacity-80">
          <span>{v.validity}</span><span style={{ fontFamily: "ui-monospace,monospace" }}>{v.number}</span>
        </div>
      </div>
    </div>
  );
}

function Memory({ s }) {
  const m = s.memory;
  return (
    <div className="relative overflow-hidden rounded-xl p-5 text-center shadow-2xl" style={{ background: "linear-gradient(160deg,#fff8e8,#f3e2bd)", color: "#3b2410", fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
      <Ornaments glyphs={["✦", "❤", "❄"]} />
      <h2 className="text-2xl font-bold italic text-[#7a1426] sm:text-3xl">{s.title}</h2>
      <div className="relative mx-auto my-3 w-full max-w-sm rounded bg-white p-3 pb-6 shadow-lg" style={{ transform: "rotate(-1.5deg)" }}>
        <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[#f1e6cf]">
          {m.photo
            ? <img src={m.photo} alt="" className="max-h-full max-w-full object-contain" />
            : <div className="flex flex-col items-center gap-1 text-[#9a7a4a]"><span className="text-4xl" aria-hidden="true">📷</span><span className="text-sm italic">Ta photo ici</span></div>}
        </div>
        <p className="mt-3 text-2xl text-[#7a1426]" style={{ fontFamily: "'Caveat',cursive" }}>{m.date}</p>
      </div>
      <p className="text-lg italic leading-relaxed sm:text-xl">{s.message}</p>
      <p className="mt-2 text-base italic opacity-75">{m.caption}</p>
    </div>
  );
}

export default function SurpriseModal({ giftId, onClose }) {
  const s = SURPRISES[giftId];
  const closeRef = useRef(null);
  useEffect(() => {
    if (closeRef.current) closeRef.current.focus();
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  if (!s) return null;
  const Body = s.type === "voucher" ? Voucher : s.type === "memory" ? Memory : Letter;
  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center overflow-y-auto bg-black/45 px-3 py-4 backdrop-blur-[2px] sm:items-center sm:py-8" role="dialog" aria-modal="true" aria-label={s.title}>
      <style>{CSS}</style>
      <div className="srp-card relative my-auto w-full max-w-xl">
        <Body s={s} />
        <div className="mt-4 flex justify-center">
          <button ref={closeRef} type="button" onClick={onClose} className="rounded-full border border-amber-200/70 bg-[#5a0f19]/95 px-6 py-2 text-lg font-semibold text-amber-100 shadow-lg transition hover:bg-[#7a1426] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
            {TEXTS.closeCard}
          </button>
        </div>
      </div>
    </div>
  );
}
