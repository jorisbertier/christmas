import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { C, Soft, Bulb, useReducedMotion } from "./clay.jsx";

/* ------------------------------------------------------------------ */
/*  Room shell (open diorama: floor + two walls), windows on a snowy   */
/*  night, sofa, rug, coffee table, cushions, light strings, decor.    */
/* ------------------------------------------------------------------ */

function makeFloorTexture() {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 512;
  const g = c.getContext("2d");
  const tones = ["#c98d58", "#bf8350", "#d29a64", "#b97a48"];
  for (let i = 0; i < 6; i++) {
    g.fillStyle = tones[i % tones.length]; g.fillRect(0, i * 86, 512, 86);
    g.fillStyle = "rgba(90,50,20,0.55)"; g.fillRect(0, i * 86, 512, 4);
    for (let k = 0; k < 3; k++) { g.fillStyle = "rgba(90,50,20,0.4)"; g.fillRect(((i * 173 + k * 211) % 480) + 6, i * 86, 4, 86); }
    g.fillStyle = "rgba(255,230,190,0.12)"; g.fillRect(0, i * 86 + 10, 512, 6);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 3);
  return t;
}

function makeNightTexture() {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 384;
  const g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 0, 384);
  gr.addColorStop(0, "#0a1740"); gr.addColorStop(0.6, "#25407f"); gr.addColorStop(1, "#4a6aa8");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 384);
  g.fillStyle = "#fff";
  for (let i = 0; i < 60; i++) { g.globalAlpha = 0.4 + ((i * 37) % 60) / 100; g.beginPath(); g.arc((i * 83) % 256, (i * 47) % 210, 0.8 + (i % 3) * 0.5, 0, 6.3); g.fill(); }
  g.globalAlpha = 1;
  g.fillStyle = "#fff7d8"; g.beginPath(); g.arc(190, 70, 24, 0, 6.3); g.fill();
  g.fillStyle = "#25407f"; g.beginPath(); g.arc(200, 64, 22, 0, 6.3); g.fill();
  g.fillStyle = "#cfdcf5"; g.beginPath(); g.moveTo(0, 300); g.quadraticCurveTo(80, 250, 160, 290); g.quadraticCurveTo(220, 270, 256, 300); g.lineTo(256, 384); g.lineTo(0, 384); g.fill();
  g.fillStyle = "#0e2a3a";
  [[30, 300, 30], [64, 308, 24], [200, 300, 34], [232, 310, 24], [150, 318, 26]].forEach(([x, y, h]) => { g.beginPath(); g.moveTo(x, y - h); g.lineTo(x + h * 0.35, y); g.lineTo(x - h * 0.35, y); g.fill(); });
  g.fillStyle = "#ffffff";
  [[30, 300, 30], [200, 300, 34]].forEach(([x, y, h]) => { g.beginPath(); g.moveTo(x, y - h); g.lineTo(x + h * 0.14, y - h * 0.55); g.lineTo(x - h * 0.14, y - h * 0.55); g.fill(); });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Candle({ position, h = 0.34 }) {
  const f = useRef();
  useFrame((st) => { if (f.current) f.current.scale.y = 1 + Math.sin(st.clock.elapsedTime * 8 + position[0] * 3) * 0.12; });
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow><cylinderGeometry args={[0.07, 0.075, h, 14]} /><meshStandardMaterial color="#fff6e0" roughness={0.7} /></mesh>
      <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.12, 0.14, 0.04, 16]} /><meshStandardMaterial color={C.red} roughness={0.5} /></mesh>
      <group ref={f} position={[0, h + 0.07, 0]}><Bulb position={[0, 0, 0]} color="#ffc15a" r={0.04} halo={0.5} /></group>
      <pointLight position={[0, h + 0.2, 0.1]} color="#ffb860" intensity={1.4} distance={2.6} decay={2} />
    </group>
  );
}

/* Snowy night seen through a window; snow flakes fall in front of the picture. */
function WindowView({ position, rotationY = 0, w = 2.6, h = 3.1, reduce }) {
  const night = useMemo(makeNightTexture, []);
  useEffect(() => () => night.dispose(), [night]);
  const COUNT = reduce ? 36 : 90;
  const data = useMemo(() => {
    const p = new Float32Array(COUNT * 3); const v = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) { p[i * 3] = (Math.random() - 0.5) * w * 0.92; p[i * 3 + 1] = (Math.random() - 0.5) * h * 0.92; p[i * 3 + 2] = Math.random() * 0.22; v[i] = 0.25 + Math.random() * 0.5; }
    return { p, v };
  }, [COUNT, w, h]);
  const geo = useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(data.p.slice(), 3)); return g; }, [data]);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((st, dt) => {
    const a = geo.attributes.position;
    const t = st.clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      let y = a.array[i * 3 + 1] - dt * data.v[i] * 0.6;
      if (y < -h / 2 * 0.95) y = h / 2 * 0.95;
      a.array[i * 3 + 1] = y;
      a.array[i * 3] = data.p[i * 3] + Math.sin(t * 0.7 + i) * 0.08;
    }
    a.needsUpdate = true;
  });
  const bar = "#f6e7c1";
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0, 0.02]}><planeGeometry args={[w, h]} /><meshBasicMaterial map={night} toneMapped={false} /></mesh>
      <points geometry={geo} position={[0, 0, 0.05]} frustumCulled={false}>
        <pointsMaterial color="#ffffff" size={0.07} transparent opacity={0.95} depthWrite={false} sizeAttenuation />
      </points>
      {/* frame + cross bars */}
      <Soft size={[w + 0.34, 0.2, 0.34]} radius={0.08} color={bar} position={[0, h / 2 + 0.08, 0.12]} />
      <Soft size={[w + 0.34, 0.2, 0.34]} radius={0.08} color={bar} position={[0, -h / 2 - 0.08, 0.12]} />
      <Soft size={[0.2, h + 0.36, 0.34]} radius={0.08} color={bar} position={[-w / 2 - 0.08, 0, 0.12]} />
      <Soft size={[0.2, h + 0.36, 0.34]} radius={0.08} color={bar} position={[w / 2 + 0.08, 0, 0.12]} />
      <Soft size={[0.1, h, 0.14]} radius={0.04} color={bar} position={[0, 0, 0.1]} />
      <Soft size={[w, 0.1, 0.14]} radius={0.04} color={bar} position={[0, 0.2, 0.1]} />
      {/* sill with snow */}
      <Soft size={[w + 0.7, 0.14, 0.62]} radius={0.06} color={C.wood} position={[0, -h / 2 - 0.28, 0.3]} />
      <mesh position={[0, -h / 2 - 0.15, 0.3]} scale={[1, 0.3, 0.5]} castShadow><sphereGeometry args={[w * 0.5, 20, 12]} /><meshStandardMaterial color="#ffffff" roughness={0.9} /></mesh>
      {/* curtains */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (w / 2 + 0.55), 0.1, 0.35]}>
          <Soft size={[0.7, h + 0.7, 0.28]} radius={0.12} color={C.red} />
          {[-0.2, 0, 0.2].map((x) => (<mesh key={x} position={[x, 0, 0.15]} scale={[0.5, 1, 0.5]}><cylinderGeometry args={[0.07, 0.07, h + 0.55, 10]} /><meshStandardMaterial color={C.redDeep} roughness={0.8} /></mesh>))}
          <mesh position={[-s * 0.35, -0.2, 0.18]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.07, 0.025, 8, 14]} /><meshStandardMaterial color={C.gold} roughness={0.4} /></mesh>
        </group>
      ))}
      <Soft size={[w + 2.2, 0.1, 0.1]} radius={0.04} color={C.gold} position={[0, h / 2 + 0.5, 0.3]} />
      {/* candles on the sill + warm window glow */}
      <Candle position={[-w / 2 + 0.2, -h / 2 - 0.2, 0.35]} h={0.3} />
      <Candle position={[w / 2 - 0.25, -h / 2 - 0.2, 0.35]} h={0.4} />
      <pointLight position={[0, 0, 1.2]} color="#9fb8ff" intensity={4} distance={6} decay={2} />
    </group>
  );
}

function Cushion({ position, rotation = [0, 0, 0], color, size = [0.7, 0.7, 0.26], dots = false }) {
  const tex = useMemo(() => {
    if (!dots) return null;
    const c = document.createElement("canvas"); c.width = 128; c.height = 128;
    const g = c.getContext("2d"); g.fillStyle = color; g.fillRect(0, 0, 128, 128); g.fillStyle = "#ffffff";
    [[32, 32], [96, 32], [32, 96], [96, 96], [64, 64]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 9, 0, 6.3); g.fill(); });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, [dots, color]);
  useEffect(() => () => tex && tex.dispose(), [tex]);
  return (
    <Soft size={size} radius={0.12} smooth={5} position={position} rotation={rotation}>
      <meshStandardMaterial color={dots ? "#ffffff" : color} map={tex} roughness={0.85} />
    </Soft>
  );
}

function Sofa({ position, rotationY = 0 }) {
  const cream = "#f4e3c4"; const creamDark = "#e7d0a6";
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Soft size={[3.3, 0.42, 1.4]} radius={0.16} color={C.woodDark} position={[0, 0.25, 0]} />
      <Soft size={[3.3, 0.55, 1.35]} radius={0.22} smooth={5} color={creamDark} position={[0, 0.7, 0]} />
      <Soft size={[3.3, 1.3, 0.5]} radius={0.24} smooth={5} color={cream} position={[0, 1.3, -0.5]} />
      {[-0.55, 0.55].map((x) => (<Soft key={x} size={[0.55, 0.4, 0.2]} radius={0.12} color={creamDark} position={[x, 1.55, -0.32]} />))}
      {[-1, 1].map((s) => (<Soft key={s} size={[0.45, 1.0, 1.4]} radius={0.22} smooth={5} color={cream} position={[s * 1.4, 0.95, 0]} />))}
      {[-0.7, 0.7].map((x) => (<Soft key={x} size={[1.2, 0.34, 1.08]} radius={0.16} smooth={5} color="#f9ecd2" position={[x, 1.12, 0.1]} />))}
      <Cushion position={[-1.0, 1.45, 0.08]} rotation={[-0.15, 0.2, 0.1]} color={C.red} dots />
      <Cushion position={[0.95, 1.45, 0.08]} rotation={[-0.15, -0.25, -0.12]} color={C.emerald} />
      <Cushion position={[0, 1.4, 0.0]} rotation={[-0.18, 0.05, 0.4]} color={C.gold} size={[0.55, 0.55, 0.22]} />
      {/* knitted plaid blanket */}
      <Soft size={[1.1, 0.12, 0.8]} radius={0.05} color={C.burgundy} position={[1.2, 1.46, 0.25]} rotation={[0.1, 0.4, 0.15]} />
      {[0.8, 1.0, 1.2, 1.4].map((x) => (<mesh key={x} position={[x, 1.5, 0.3]} rotation={[0.1, 0.4, 0.15]}><boxGeometry args={[0.06, 0.13, 0.82]} /><meshStandardMaterial color={C.cream} roughness={0.9} /></mesh>))}
    </group>
  );
}

function Rug({ position }) {
  const rings = [[2.9, C.cream], [2.55, C.redDeep], [2.2, C.cream], [1.85, C.fir], [1.5, C.cream], [1.15, C.red], [0.8, "#f6d27a"]];
  return (
    <group position={position}>
      {rings.map(([r, color], i) => (
        <mesh key={i} position={[0, 0.02 + i * 0.006, 0]} receiveShadow><cylinderGeometry args={[r, r, 0.04, 56]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
      ))}
      {Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2; return (
        <mesh key={i} position={[Math.cos(a) * 2.95, 0.04, Math.sin(a) * 2.95]} rotation={[Math.PI / 2, 0, a]}><capsuleGeometry args={[0.04, 0.14, 4, 6]} /><meshStandardMaterial color="#fff6e0" roughness={0.9} /></mesh>
      ); })}
    </group>
  );
}

function CoffeeTable({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.62, 0]} castShadow receiveShadow><cylinderGeometry args={[0.95, 0.95, 0.12, 40]} /><meshStandardMaterial color={C.wood} roughness={0.6} /></mesh>
      <mesh position={[0, 0.68, 0]}><torusGeometry args={[0.95, 0.04, 8, 40]} /><meshStandardMaterial color={C.woodDark} roughness={0.6} /></mesh>
      <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.16, 0.3, 0.6, 18]} /><meshStandardMaterial color={C.woodDark} roughness={0.7} /></mesh>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.55, 0.6, 0.1, 28]} /><meshStandardMaterial color={C.woodDark} roughness={0.7} /></mesh>
      {/* tray, mugs, cookies, candles */}
      <mesh position={[0, 0.72, 0]} castShadow><cylinderGeometry args={[0.6, 0.55, 0.06, 28]} /><meshStandardMaterial color={C.cream} roughness={0.5} /></mesh>
      {[[-0.28, 0.2], [0.12, -0.25]].map(([x, z], i) => (
        <group key={i} position={[x, 0.75, z]}>
          <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.1, 0.09, 0.24, 16]} /><meshStandardMaterial color={i ? C.emerald : C.red} roughness={0.4} /></mesh>
          <mesh position={[0, 0.235, 0]}><cylinderGeometry args={[0.085, 0.085, 0.01, 16]} /><meshStandardMaterial color="#6b3a1a" roughness={0.3} /></mesh>
          <mesh position={[0.115, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.06, 0.018, 8, 14, Math.PI]} /><meshStandardMaterial color={i ? C.emerald : C.red} roughness={0.4} /></mesh>
          <mesh position={[0.0, 0.3, 0]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.05, 8, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.18} /></mesh>
        </group>
      ))}
      <group position={[0.3, 0.76, 0.22]}>
        {[0, 1, 2].map((i) => (<mesh key={i} position={[Math.cos(i * 2.1) * 0.09, 0.02 + i * 0.012, Math.sin(i * 2.1) * 0.09]} castShadow><cylinderGeometry args={[0.07, 0.07, 0.025, 14]} /><meshStandardMaterial color="#d8a25e" roughness={0.8} /></mesh>))}
      </group>
      <Candle position={[-0.45, 0.76, -0.35]} h={0.3} />
      <Candle position={[0.5, 0.76, -0.15]} h={0.22} />
    </group>
  );
}

function LightString({ from, to, sag = 0.5, count = 16, seed = 0 }) {
  const mats = useRef([]);
  const reduce = useReducedMotion();
  const pts = useMemo(() => Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count;
    return [THREE.MathUtils.lerp(from[0], to[0], t), THREE.MathUtils.lerp(from[1], to[1], t) - Math.sin(t * Math.PI) * sag, THREE.MathUtils.lerp(from[2], to[2], t)];
  }), [from, to, sag, count]);
  const colors = ["#fff0b0", "#ffb8a0", "#bfe6ff", "#ffd36b"];
  useFrame((st) => {
    const t = st.clock.elapsedTime;
    mats.current.forEach((m, i) => { if (m) m.color.setScalar(0.85 + (reduce ? 0 : Math.sin(t * 1.3 + i * 0.9 + seed) * 0.12)); });
  });
  return (
    <group>
      {pts.map((p, i) => (
        <group key={i} position={p}>
          <mesh><sphereGeometry args={[0.055, 10, 8]} /><meshBasicMaterial ref={(m) => (mats.current[i] = m)} color={colors[(i + seed) % 4]} toneMapped={false} /></mesh>
        </group>
      ))}
    </group>
  );
}

function MiniGift({ position, color, ribbon, size = [0.5, 0.4, 0.5], rot = 0, dots = false }) {
  const [w, h, d] = size;
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <Soft size={size} radius={0.08} color={color} position={[0, h / 2, 0]} />
      <Soft size={[0.1, h + 0.02, d + 0.02]} radius={0.02} color={ribbon} position={[0, h / 2, 0]} />
      <Soft size={[w + 0.02, h + 0.02, 0.1]} radius={0.02} color={ribbon} position={[0, h / 2, 0]} />
      {[-1, 1].map((s) => (<mesh key={s} position={[s * 0.09, h + 0.07, 0]} rotation={[0, 0, s * 0.5]} scale={[1.2, 1, 0.6]}><torusGeometry args={[0.07, 0.03, 8, 14]} /><meshStandardMaterial color={ribbon} roughness={0.5} /></mesh>))}
      {dots && [[-0.15, 0.2], [0.15, 0.1], [0, 0.3]].map(([x, y], i) => (<mesh key={i} position={[x, y, d / 2 + 0.005]} scale={[1, 1, 0.3]}><sphereGeometry args={[0.045, 8, 6]} /><meshStandardMaterial color="#fff" roughness={0.6} /></mesh>))}
    </group>
  );
}

function Frame({ position, rotationY = 0, w = 0.9, h = 1.15, color = "#e8b84a", art = "#2f9a52" }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Soft size={[w, h, 0.1]} radius={0.05} color={color} />
      <mesh position={[0, 0, 0.055]}><planeGeometry args={[w - 0.18, h - 0.18]} /><meshStandardMaterial color="#f6e7c1" roughness={0.9} /></mesh>
      <mesh position={[0, -0.05, 0.065]}><coneGeometry args={[w * 0.22, h * 0.4, 5]} /><meshStandardMaterial color={art} roughness={0.8} /></mesh>
      <mesh position={[0, h * 0.18, 0.07]}><sphereGeometry args={[0.06, 8, 6]} /><meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={0.4} /></mesh>
    </group>
  );
}

function Poinsettia({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.2, 0.15, 0.4, 16]} /><meshStandardMaterial color={C.cream} roughness={0.6} /></mesh>
      {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return (
        <mesh key={i} position={[Math.cos(a) * 0.2, 0.5, Math.sin(a) * 0.2]} rotation={[0.9, -a, 0]} scale={[0.5, 1, 0.2]} castShadow><sphereGeometry args={[0.2, 10, 8]} /><meshStandardMaterial color={i % 2 ? "#d9262f" : "#b81822"} roughness={0.6} /></mesh>
      ); })}
      <mesh position={[0, 0.56, 0]}><sphereGeometry args={[0.07, 10, 8]} /><meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={0.3} /></mesh>
    </group>
  );
}

export default function LivingRoom3D() {
  const reduce = useReducedMotion();
  const floorTex = useMemo(makeFloorTexture, []);
  useEffect(() => () => floorTex.dispose(), [floorTex]);
  return (
    <group>
      {/* floor slab + walls (cutaway diorama) */}
      <mesh position={[0, -0.3, 0]} receiveShadow><boxGeometry args={[14, 0.6, 10.6]} /><meshStandardMaterial map={floorTex} roughness={0.7} /></mesh>
      <Soft size={[14.2, 0.18, 10.8]} radius={0.08} color={C.woodDark} position={[0, -0.62, 0]} />
      <Soft size={[14, 6.4, 0.4]} radius={0.1} color={C.wall} position={[0, 3.2, -4.8]} />
      <Soft size={[0.4, 6.4, 10.6]} radius={0.1} color={C.wall} position={[-7, 3.2, 0]} />
      {/* wainscot + gold trim + baseboards */}
      <Soft size={[13.8, 1.9, 0.16]} radius={0.06} color={C.wainscot} position={[0, 0.96, -4.54]} />
      <Soft size={[13.8, 0.1, 0.2]} radius={0.04} color={C.gold} position={[0, 1.95, -4.52]} />
      <Soft size={[0.16, 1.9, 10.4]} radius={0.06} color={C.wainscot} position={[-6.74, 0.96, 0]} />
      <Soft size={[0.2, 0.1, 10.4]} radius={0.04} color={C.gold} position={[-6.72, 1.95, 0]} />
      <Soft size={[13.8, 0.3, 0.26]} radius={0.06} color={C.cream} position={[0, 0.15, -4.5]} />
      <Soft size={[0.26, 0.3, 10.4]} radius={0.06} color={C.cream} position={[-6.7, 0.15, 0]} />
      {/* ceiling beams hint + crown */}
      <Soft size={[13.8, 0.3, 0.4]} radius={0.08} color={C.woodDark} position={[0, 6.2, -4.55]} />
      <Soft size={[0.4, 0.3, 10.4]} radius={0.08} color={C.woodDark} position={[-6.75, 6.2, 0]} />

      <WindowView position={[-3.7, 3.2, -4.58]} reduce={reduce} />
      <WindowView position={[-6.58, 3.2, -1.2]} rotationY={Math.PI / 2} w={2.2} h={2.9} reduce={reduce} />

      {/* wall decor */}
      <Frame position={[-0.6, 4.1, -4.55]} art={C.fir} />
      <Frame position={[0.55, 3.9, -4.55]} w={0.7} h={0.9} color={C.red} art={C.red} />
      <Frame position={[-6.55, 4.0, 2.2]} rotationY={Math.PI / 2} art="#c4202b" />

      {/* furniture */}
      <Rug position={[1.7, 0, 1.2]} />
      <Sofa position={[5.2, 0, 0.9]} rotationY={-Math.PI / 2} />
      <CoffeeTable position={[2.6, 0, 1.35]} />
      <Poinsettia position={[6.0, 0, 3.1]} scale={1.4} />
      <Poinsettia position={[-6.0, 0, 3.6]} scale={1.2} />

      {/* light strings + hanging stars */}
      <LightString from={[-6.6, 5.55, -4.52]} to={[6.6, 5.55, -4.52]} sag={0.55} count={26} />
      <LightString from={[-6.62, 5.5, -4.4]} to={[-6.62, 5.5, 4.4]} sag={0.5} count={18} seed={2} />

      {/* decorative gifts under the tree (the 3 special gifts come in front) */}
      <MiniGift position={[-2.1, 0, -2.2]} color={C.red} ribbon={C.cream} size={[0.7, 0.55, 0.7]} rot={0.3} dots />
      <MiniGift position={[1.3, 0, -2.0]} color={C.emerald} ribbon={C.gold} size={[0.6, 0.7, 0.6]} rot={-0.4} />
      <MiniGift position={[1.0, 0, -0.5]} color="#f6e7c1" ribbon={C.burgundy} size={[0.55, 0.4, 0.55]} rot={0.6} />
      <MiniGift position={[-2.4, 0, -0.9]} color="#2a6fd1" ribbon="#ffffff" size={[0.5, 0.45, 0.5]} rot={-0.2} dots />
      <MiniGift position={[-1.5, 0, -2.9]} color="#c8202e" ribbon={C.gold} size={[0.8, 0.6, 0.8]} rot={0.15} />
    </group>
  );
}
