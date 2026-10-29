import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

/* ------------------------------------------------------------------ */
/*  "Clay" look shared by every 3D piece: soft rounded volumes, matte  */
/*  plasticine-like materials, a warm and saturated palette.           */
/* ------------------------------------------------------------------ */

export const C = {
  fir: "#2f9a52", firDark: "#237a40", red: "#d9262f", redDeep: "#a8121c", gold: "#f2b632", goldLight: "#ffd36b",
  cream: "#f6e7c1", ivory: "#f3e6cf", champagne: "#ecd9b0", emerald: "#1f8f5c", burgundy: "#7a1426",
  wood: "#b0703c", woodDark: "#6b3d1e", brick: "#c05a42", stone: "#dccdb6", night: "#0a1230", white: "#ffffff",
  wall: "#f0dcb8", wainscot: "#1f6a45",
};

export const clamp = THREE.MathUtils.clamp;
export const damp = THREE.MathUtils.damp;
export const lerp = THREE.MathUtils.lerp;
export const easeOutBack = (t) => { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOutBounce = (x) => {
  const n1 = 7.5625; const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
};

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!m) return undefined;
    setReduced(m.matches);
    const h = (e) => setReduced(e.matches);
    if (m.addEventListener) m.addEventListener("change", h);
    return () => { if (m.removeEventListener) m.removeEventListener("change", h); };
  }, []);
  return reduced;
}

/* A rounded box with a matte clay material (or a shared material). */
export function Soft({ size = [1, 1, 1], radius = 0.12, color = C.cream, rough = 0.62, smooth = 4, material, children, ...rest }) {
  const r = Math.min(radius, Math.min(size[0], size[1], size[2]) / 2 - 0.002);
  return (
    <RoundedBox args={size} radius={Math.max(0.001, r)} smoothness={smooth} castShadow receiveShadow material={material} {...rest}>
      {!material && <meshStandardMaterial color={color} roughness={rough} metalness={0} />}
      {children}
    </RoundedBox>
  );
}

/* ---------------- procedural textures (no external files) ---------------- */

export function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = 64; c.height = 64;
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.25, "rgba(255,255,255,0.6)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
export function useGlowTexture() {
  const tex = useMemo(makeGlowTexture, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

function starPath(g, x, y, r, rot = 0) {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = rot + (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  g.closePath();
}
function flake(g, x, y, r) {
  g.lineWidth = r * 0.16; g.lineCap = "round";
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI) / 3;
    g.beginPath(); g.moveTo(x - Math.cos(a) * r, y - Math.sin(a) * r); g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); g.stroke();
  }
}
function holly(g, x, y, s, leaf, berry) {
  g.fillStyle = leaf;
  [-0.7, 0.7].forEach((a) => { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.ellipse(s * 0.5, 0, s * 0.62, s * 0.26, 0, 0, Math.PI * 2); g.fill(); g.restore(); });
  g.fillStyle = berry;
  [[-0.1, -0.1], [0.14, 0.02], [0, 0.18]].forEach(([dx, dy]) => { g.beginPath(); g.arc(x + dx * s, y + dy * s, s * 0.18, 0, Math.PI * 2); g.fill(); });
}

/* Wrapping paper: "christmas" (stars, snowflakes, holly), "dots" (polka dots), "soft" (tone-on-tone). */
export function makePaperTexture({ base, kind = "plain", accent = "#ffffff", accent2 = "#f2b632" }) {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const g = c.getContext("2d");
  g.fillStyle = base; g.fillRect(0, 0, S, S);
  if (kind === "dots") {
    g.fillStyle = accent;
    const n = 5;
    for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) {
      const x = ((i + (j % 2 ? 0.5 : 0)) * S) / n; const y = (j * S) / n;
      g.beginPath(); g.arc(x, y, 24, 0, Math.PI * 2); g.fill();
    }
  } else if (kind === "christmas") {
    const n = 4; const cell = S / n;
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = i * cell + cell / 2 + (j % 2 ? cell * 0.0 : 0); const y = j * cell + cell / 2;
      const k = (i + j * 2) % 4;
      if (k === 0) { g.fillStyle = accent2; starPath(g, x, y, 34); g.fill(); }
      else if (k === 1) { g.strokeStyle = accent; flake(g, x, y, 30); }
      else if (k === 2) { holly(g, x - 22, y, 40, "#2f9a52", "#ffffff"); }
      else { g.fillStyle = accent; g.beginPath(); g.arc(x, y, 14, 0, Math.PI * 2); g.fill(); g.fillStyle = accent2; g.beginPath(); g.arc(x, y, 6, 0, Math.PI * 2); g.fill(); }
    }
    g.fillStyle = "rgba(255,255,255,0.55)";
    for (let i = 0; i < 28; i++) { g.beginPath(); g.arc((i * 193) % S, (i * 71 + 37) % S, 3, 0, Math.PI * 2); g.fill(); }
  } else if (kind === "soft") {
    g.strokeStyle = accent; g.globalAlpha = 0.45; g.lineWidth = 10;
    for (let i = -S; i < S * 2; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + S, S); g.stroke(); }
    g.globalAlpha = 1;
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/* ---------------- particles ---------------- */

/* Soft floating light dust. `active` fades it in/out. */
export function Dust({ count = 40, center = [0, 0, 0], box = [1, 1, 1], color = "#ffd98a", size = 0.08, speed = 0.15, opacity = 0.9, active = true, sway = 0.2 }) {
  const tex = useGlowTexture();
  const matRef = useRef();
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * box[0];
      pos[i * 3 + 1] = Math.random() * box[1];
      pos[i * 3 + 2] = (Math.random() - 0.5) * box[2];
      seed[i * 2] = Math.random() * 6.28;
      seed[i * 2 + 1] = 0.5 + Math.random();
    }
    return { pos, seed };
  }, [count, box[0], box[1], box[2]]); // eslint-disable-line react-hooks/exhaustive-deps
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.pos.slice(), 3));
    return g;
  }, [data]);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((s, dt) => {
    const m = matRef.current;
    if (!m) return;
    m.opacity = damp(m.opacity, active ? opacity : 0, 3, dt);
    if (m.opacity < 0.01) return;
    const p = geo.attributes.position;
    const t = s.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      let y = p.array[i * 3 + 1] + dt * speed * data.seed[i * 2 + 1];
      if (y > box[1]) y -= box[1];
      p.array[i * 3 + 1] = y;
      p.array[i * 3] = data.pos[i * 3] + Math.sin(t * 0.6 + data.seed[i * 2]) * sway;
      p.array[i * 3 + 2] = data.pos[i * 3 + 2] + Math.cos(t * 0.5 + data.seed[i * 2]) * sway;
    }
    p.needsUpdate = true;
  });
  return (
    <points geometry={geo} position={center} frustumCulled={false}>
      <pointsMaterial ref={matRef} map={tex} size={size} color={color} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

/* One-shot burst of sparks (gift opening, tree magic). Restarts each time `active` becomes true. */
export function Burst({ active, center = [0, 0, 0], color = "#ffd98a", count = 70, radius = 2, duration = 2.2, size = 0.12 }) {
  const tex = useGlowTexture();
  const matRef = useRef();
  const startRef = useRef(null);
  const dirs = useMemo(() => {
    const d = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2; const u = Math.random() * 0.9 + 0.1;
      d[i * 3] = Math.cos(a) * Math.sqrt(1 - u * u) * (0.4 + Math.random());
      d[i * 3 + 1] = u * (0.6 + Math.random() * 0.8);
      d[i * 3 + 2] = Math.sin(a) * Math.sqrt(1 - u * u) * (0.4 + Math.random());
    }
    return d;
  }, [count]);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return g;
  }, [count]);
  useEffect(() => () => geo.dispose(), [geo]);
  useEffect(() => { startRef.current = active ? null : undefined; }, [active]);
  useFrame((s) => {
    const m = matRef.current;
    if (!m) return;
    if (!active || startRef.current === undefined) { m.opacity = 0; return; }
    if (startRef.current === null) startRef.current = s.clock.elapsedTime;
    const t = (s.clock.elapsedTime - startRef.current) / duration;
    if (t > 1) { m.opacity = 0; return; }
    const e = easeOutCubic(t);
    const p = geo.attributes.position;
    for (let i = 0; i < count; i++) {
      p.array[i * 3] = dirs[i * 3] * radius * e;
      p.array[i * 3 + 1] = dirs[i * 3 + 1] * radius * e - t * t * 0.9;
      p.array[i * 3 + 2] = dirs[i * 3 + 2] * radius * e;
    }
    p.needsUpdate = true;
    m.opacity = (1 - t) * 0.95;
  });
  return (
    <points geometry={geo} position={center} frustumCulled={false}>
      <pointsMaterial ref={matRef} map={tex} size={size} color={color} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

/* Small glowing bulb (fairy light, candle flame) with a soft halo sprite. */
export function Bulb({ position, color = "#ffd98a", r = 0.05, halo = 0.45 }) {
  const tex = useGlowTexture();
  return (
    <group position={position}>
      <mesh><sphereGeometry args={[r, 10, 8]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
      <sprite scale={[halo, halo, halo]}><spriteMaterial map={tex} color={color} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
    </group>
  );
}
