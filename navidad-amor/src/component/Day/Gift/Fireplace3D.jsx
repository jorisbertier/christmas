import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { C, Soft, Dust, Bulb, useReducedMotion } from "./clay.jsx";

/* ------------------------------------------------------------------ */
/*  Brick fireplace with an animated fire, mantel, christmas stockings, */
/*  holly garland and wreath, candles. Local front = +z.               */
/* ------------------------------------------------------------------ */

function makeBrickTexture() {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#e9d7b8"; g.fillRect(0, 0, 512, 512);
  const rows = 12; const bh = 512 / rows; const bw = 96;
  const tones = ["#c8604a", "#b9523e", "#d06a52", "#c25a44"];
  for (let r = 0; r < rows; r++) {
    for (let x = -(r % 2) * (bw / 2); x < 512; x += bw) {
      g.fillStyle = tones[(r * 3 + Math.floor(x / bw) + 8) % tones.length];
      const rad = 10;
      const px = x + 4; const py = r * bh + 4; const w = bw - 8; const h = bh - 8;
      g.beginPath();
      g.moveTo(px + rad, py); g.arcTo(px + w, py, px + w, py + h, rad); g.arcTo(px + w, py + h, px, py + h, rad);
      g.arcTo(px, py + h, px, py, rad); g.arcTo(px, py, px + w, py, rad); g.closePath(); g.fill();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1.6, 1.4);
  return t;
}

function Stocking({ position, color, cuff = "#ffffff", pattern = "#ffffff", rot = 0 }) {
  return (
    <group position={position} rotation={[0, 0, rot]}>
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.05, 0.012, 8, 14]} /><meshStandardMaterial color={C.gold} roughness={0.4} /></mesh>
      <mesh position={[0, -0.12, 0]} castShadow><cylinderGeometry args={[0.26, 0.24, 0.3, 20]} /><meshStandardMaterial color={cuff} roughness={0.9} /></mesh>
      <mesh position={[0, -0.47, 0]} castShadow><capsuleGeometry args={[0.2, 0.5, 6, 16]} /><meshStandardMaterial color={color} roughness={0.7} /></mesh>
      <mesh position={[0.17, -0.85, 0]} rotation={[0, 0, Math.PI / 2.4]} castShadow><capsuleGeometry args={[0.21, 0.28, 6, 16]} /><meshStandardMaterial color={color} roughness={0.7} /></mesh>
      <mesh position={[0.34, -0.9, 0]} castShadow><sphereGeometry args={[0.2, 16, 12]} /><meshStandardMaterial color={cuff} roughness={0.85} /></mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.0, -0.4 - i * 0.14, 0.19]} scale={[1, 1, 0.5]}><sphereGeometry args={[0.04, 8, 6]} /><meshStandardMaterial color={pattern} roughness={0.7} /></mesh>
      ))}
    </group>
  );
}

function HollyGarland({ width = 4, y = 0, z = 0, sag = 0.18, seed = 1 }) {
  const items = useMemo(() => {
    const out = [];
    const N = 24;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const x = (t - 0.5) * width;
      const yy = y - Math.sin(t * Math.PI) * sag;
      out.push({ x, y: yy, a: ((i * 97 + seed * 13) % 360) * (Math.PI / 180), berry: i % 4 === 1 });
    }
    return out;
  }, [width, y, sag, seed]);
  return (
    <group position={[0, 0, z]}>
      {items.map((it, i) => (
        <group key={i} position={[it.x, it.y, 0]} rotation={[0, 0, it.a]}>
          <mesh scale={[1.5, 0.55, 0.5]} position={[0.1, 0, 0]} castShadow><sphereGeometry args={[0.11, 10, 8]} /><meshStandardMaterial color={i % 2 ? "#238a45" : "#1b6f38"} roughness={0.7} /></mesh>
          <mesh scale={[1.5, 0.55, 0.5]} position={[-0.1, 0.02, 0.02]} rotation={[0, 0, 0.9]} castShadow><sphereGeometry args={[0.11, 10, 8]} /><meshStandardMaterial color="#2c9a50" roughness={0.7} /></mesh>
          {it.berry && [[0, 0.04, 0.08], [0.07, -0.03, 0.08], [-0.06, -0.02, 0.09]].map((p, k) => (
            <mesh key={k} position={p} castShadow><sphereGeometry args={[0.045, 10, 8]} /><meshStandardMaterial color={C.red} roughness={0.35} emissive={C.red} emissiveIntensity={0.15} /></mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function RedBow({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.2, 0.05, 0]} rotation={[0, 0, s * 0.45]} scale={[1.2, 1, 0.6]} castShadow><torusGeometry args={[0.15, 0.065, 10, 22]} /><meshStandardMaterial color={C.red} roughness={0.5} /></mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`t${s}`} position={[s * 0.09, -0.2, 0]} rotation={[0, 0, s * 0.25]} castShadow><boxGeometry args={[0.1, 0.34, 0.03]} /><meshStandardMaterial color={C.redDeep} roughness={0.5} /></mesh>
      ))}
      <mesh castShadow><sphereGeometry args={[0.09, 14, 10]} /><meshStandardMaterial color={C.redDeep} roughness={0.5} /></mesh>
    </group>
  );
}

function Candle({ position, h = 0.38, color = "#fff6e0" }) {
  const flame = useRef();
  useFrame((st) => { if (flame.current) { const t = st.clock.elapsedTime; flame.current.scale.set(1 - Math.sin(t * 7 + position[0]) * 0.06, 1 + Math.sin(t * 9 + position[0]) * 0.1, 1); } });
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow><cylinderGeometry args={[0.07, 0.075, h, 14]} /><meshStandardMaterial color={color} roughness={0.7} /></mesh>
      <mesh position={[0, -0.01, 0]}><cylinderGeometry args={[0.13, 0.15, 0.04, 16]} /><meshStandardMaterial color={C.gold} roughness={0.4} emissive={C.gold} emissiveIntensity={0.2} /></mesh>
      <group ref={flame} position={[0, h + 0.07, 0]}><Bulb position={[0, 0, 0]} color="#ffc15a" r={0.045} halo={0.55} /></group>
      <pointLight position={[0, h + 0.2, 0.1]} color="#ffb860" intensity={1.6} distance={3} decay={2} />
    </group>
  );
}

export default function Fireplace3D({ position = [0, 0, 0] }) {
  const reduce = useReducedMotion();
  const flames = useRef([]);
  const fireLight = useRef();
  const brick = useMemo(makeBrickTexture, []);
  const flameGeo = useMemo(() => {
    const pts = [[0.001, 0], [0.13, 0.05], [0.22, 0.2], [0.22, 0.42], [0.14, 0.68], [0.04, 0.92], [0.001, 1.05]].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 16);
  }, []);
  useEffect(() => () => { brick.dispose(); flameGeo.dispose(); }, [brick, flameGeo]);

  const flameDefs = useMemo(
    () => [
      { x: -0.3, z: 0.02, s: 0.95, c: "#ff7a1a", o: 0.92, p: 0.0 },
      { x: 0.28, z: 0.0, s: 1.05, c: "#ff8a22", o: 0.92, p: 1.7 },
      { x: 0.0, z: 0.08, s: 1.3, c: "#ffb12b", o: 0.95, p: 3.1 },
      { x: -0.12, z: 0.12, s: 0.9, c: "#ffd866", o: 0.95, p: 0.9 },
      { x: 0.14, z: 0.14, s: 0.75, c: "#fff1b0", o: 0.95, p: 2.4 },
    ],
    []
  );

  useFrame((st) => {
    const t = st.clock.elapsedTime;
    flames.current.forEach((m, i) => {
      if (!m) return;
      const d = flameDefs[i];
      const k = reduce ? 0.3 : 1;
      m.scale.set(d.s * (1 + Math.sin(t * 6 + d.p) * 0.08 * k), d.s * (1 + Math.sin(t * 8.5 + d.p * 1.3) * 0.16 * k), d.s * (1 + Math.cos(t * 7 + d.p) * 0.08 * k));
      m.position.x = d.x + Math.sin(t * 3 + d.p) * 0.03 * k;
    });
    if (fireLight.current) fireLight.current.intensity = 26 + (reduce ? 0 : Math.sin(t * 9) * 3.5 + Math.sin(t * 15.3) * 2);
  });

  return (
    <group position={position}>
      {/* brick body */}
      <mesh castShadow receiveShadow position={[0, 1.75, 0]}>
        <boxGeometry args={[3.7, 3.5, 0.9]} />
        <meshStandardMaterial map={brick} roughness={0.8} />
      </mesh>
      <Soft size={[2.7, 2.5, 0.7]} radius={0.12} color={C.brick} position={[0, 4.7, -0.05]} />
      {/* opening */}
      <Soft size={[2.2, 1.75, 0.18]} radius={0.5} color="#1a0b06" position={[0, 1.02, 0.48]} />
      <mesh position={[0, 0.95, 0.58]}><planeGeometry args={[1.9, 1.4]} /><meshBasicMaterial color="#7a2a08" transparent opacity={0.55} toneMapped={false} /></mesh>
      <Soft size={[2.5, 0.2, 0.34]} radius={0.08} color={C.stone} position={[0, 1.95, 0.55]} />
      {/* hearth */}
      <Soft size={[4.4, 0.24, 1.7]} radius={0.12} color={C.stone} position={[0, 0.12, 0.62]} />
      {/* logs + embers */}
      <mesh position={[0, 0.34, 0.72]} rotation={[0, 0.2, Math.PI / 2]} castShadow><capsuleGeometry args={[0.14, 1.1, 6, 12]} /><meshStandardMaterial color="#5a3216" roughness={0.9} /></mesh>
      <mesh position={[0.05, 0.5, 0.72]} rotation={[0, -0.35, Math.PI / 2]} castShadow><capsuleGeometry args={[0.13, 1.0, 6, 12]} /><meshStandardMaterial color="#6b3d1e" roughness={0.9} /></mesh>
      <mesh position={[0, 0.32, 0.8]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.7, 20]} /><meshBasicMaterial color="#ff5a14" transparent opacity={0.65} toneMapped={false} /></mesh>
      {/* flames */}
      <group position={[0, 0.45, 0.75]}>
        {flameDefs.map((d, i) => (
          <mesh key={i} ref={(m) => (flames.current[i] = m)} geometry={flameGeo} position={[d.x, 0, d.z]}>
            <meshBasicMaterial color={d.c} transparent opacity={d.o} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <pointLight ref={fireLight} position={[0, 1.0, 1.7]} color="#ff8a2a" intensity={26} distance={16} decay={2} castShadow={false} />
      <Dust count={16} center={[0, 1.0, 0.8]} box={[0.9, 2.6, 0.5]} color="#ffb15a" size={0.07} speed={0.55} opacity={0.9} sway={0.15} />

      {/* mantel */}
      <Soft size={[4.4, 0.32, 1.3]} radius={0.14} color={C.wood} position={[0, 3.62, 0.5]} />
      <Soft size={[4.5, 0.1, 1.38]} radius={0.05} color={C.woodDark} position={[0, 3.44, 0.5]} />
      <HollyGarland width={4.1} y={3.72} z={1.18} sag={0.0} seed={2} />
      <HollyGarland width={4.0} y={3.45} z={1.2} sag={0.28} seed={5} />
      <RedBow position={[-1.95, 3.55, 1.22]} scale={1.1} />
      <RedBow position={[1.95, 3.55, 1.22]} scale={1.1} />
      {/* stockings hang under the holly */}
      <Stocking position={[-1.25, 3.42, 1.22]} color={C.red} cuff="#ffffff" />
      <Stocking position={[-0.05, 3.42, 1.22]} color={C.emerald} cuff="#f6e7c1" pattern="#f2b632" />
      <Stocking position={[1.15, 3.42, 1.22]} color={C.redDeep} cuff="#ffffff" pattern="#f6e7c1" />
      {/* things on the mantel */}
      <Candle position={[-1.55, 3.8, 0.55]} />
      <Candle position={[1.5, 3.8, 0.55]} h={0.5} color="#f6e7c1" />
      <group position={[0.1, 3.8, 0.5]}>
        {[0.55, 0.38, 0.22].map((s, i) => (<mesh key={i} position={[0, 0.1 + i * 0.22, 0]} castShadow><coneGeometry args={[s * 0.6, 0.3, 14]} /><meshStandardMaterial color={C.fir} roughness={0.75} /></mesh>))}
        <mesh position={[0, 0.78, 0]} castShadow><sphereGeometry args={[0.08, 10, 8]} /><meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={0.4} /></mesh>
      </group>
      {/* wreath above the mantel */}
      <group position={[0, 5.1, 0.35]}>
        <mesh castShadow><torusGeometry args={[0.62, 0.17, 14, 36]} /><meshStandardMaterial color="#217a3f" roughness={0.75} /></mesh>
        {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return (
          <mesh key={i} position={[Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0.13]} scale={[1.3, 0.6, 0.5]} rotation={[0, 0, a + 1.57]} castShadow><sphereGeometry args={[0.12, 8, 6]} /><meshStandardMaterial color={i % 2 ? "#2c9a50" : "#1b6f38"} roughness={0.7} /></mesh>
        ); })}
        {[0.4, 1.4, 2.5, 3.6, 4.8, 5.7].map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0.2]} castShadow><sphereGeometry args={[0.065, 10, 8]} /><meshStandardMaterial color={C.red} roughness={0.35} emissive={C.red} emissiveIntensity={0.15} /></mesh>
        ))}
        <RedBow position={[0, -0.62, 0.22]} scale={1.2} />
      </group>
    </group>
  );
}
