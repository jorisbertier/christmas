import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { C, Dust, damp, useGlowTexture, useReducedMotion } from "./clay.jsx";

/* ------------------------------------------------------------------ */
/*  Puffy "clay" Christmas tree: scalloped tiers, cream garland, red   */
/*  and gold baubles with details, fairy lights, gold star, brown pot. */
/* ------------------------------------------------------------------ */

const TIERS = [
  { r: 1.78, h: 1.62, y: 0.5 },
  { r: 1.4, h: 1.42, y: 1.45 },
  { r: 1.02, h: 1.28, y: 2.4 },
];

// Lathe profile: tip → slope → rounded thick lip → underside
function buildTier({ r, h }) {
  const lipR = r * 0.17;
  const cx = r - lipR;
  const a0 = (70 * Math.PI) / 180;
  const endX = cx + lipR * Math.cos(a0);
  const endY = lipR + lipR * Math.sin(a0);
  const pts = [new THREE.Vector2(0.0005, h)];
  for (let i = 1; i <= 8; i++) {
    const t = i / 8;
    pts.push(new THREE.Vector2(THREE.MathUtils.lerp(0.0005, endX, Math.pow(t, 0.92)), THREE.MathUtils.lerp(h, endY, t)));
  }
  for (let a = 56; a >= -90; a -= 14) {
    const rad = (a * Math.PI) / 180;
    pts.push(new THREE.Vector2(cx + lipR * Math.cos(rad), lipR + lipR * Math.sin(rad)));
  }
  pts.push(new THREE.Vector2(cx * 0.55, 0.01));
  pts.push(new THREE.Vector2(0.0005, 0));
  const geo = new THREE.LatheGeometry(pts, 64);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i); const y = pos.getY(i); const z = pos.getZ(i);
    const th = Math.atan2(z, x);
    const w = 1 - THREE.MathUtils.smoothstep(y, 0, h * 0.7);
    const k = 1 + 0.07 * Math.cos(8 * th) * w; // scalloped lobes at the bottom
    pos.setXYZ(i, x * k, y, z * k);
  }
  geo.computeVertexNormals();
  return { geo, endX, endY, h, r };
}

const surf = (t, theta, f, push = 0) => {
  const rad = THREE.MathUtils.lerp(t.endX, 0, f) + push;
  return [Math.cos(theta) * rad, TIERS[t.i].y + THREE.MathUtils.lerp(t.endY, t.h, f) + push * 0.35, Math.sin(theta) * rad];
};

// [tier, angle, height along slope, colour, radius, detail]
const BAUBLES = [
  [0, 0.4, 0.22, C.red, 0.2, "band"], [0, 1.5, 0.3, C.gold, 0.19, "dots"], [0, 2.7, 0.2, C.red, 0.21, "plain"],
  [0, 3.9, 0.32, C.gold, 0.18, "band"], [0, 5.1, 0.24, C.red, 0.2, "dots"],
  [1, 0.9, 0.3, C.gold, 0.17, "plain"], [1, 2.2, 0.26, C.red, 0.19, "band"], [1, 3.6, 0.34, C.gold, 0.17, "dots"], [1, 5.0, 0.28, C.red, 0.18, "plain"],
  [2, 0.2, 0.34, C.red, 0.16, "band"], [2, 1.9, 0.3, C.gold, 0.15, "plain"], [2, 3.4, 0.36, C.red, 0.16, "dots"], [2, 4.9, 0.32, C.gold, 0.15, "band"],
];

function Ornament({ position, color, r, detail }) {
  const dots = useMemo(() => Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2), []);
  return (
    <group position={position}>
      <mesh castShadow><sphereGeometry args={[r, 24, 18]} /><meshStandardMaterial color={color} roughness={0.34} metalness={0.05} emissive={color} emissiveIntensity={0.1} /></mesh>
      <mesh position={[0.0, r * 0.45, r * 0.62]} scale={[1, 0.6, 0.4]}><sphereGeometry args={[r * 0.22, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.65} /></mesh>
      <mesh position={[0, r * 1.02, 0]}><cylinderGeometry args={[r * 0.28, r * 0.34, r * 0.3, 12]} /><meshStandardMaterial color={C.gold} roughness={0.4} emissive={C.gold} emissiveIntensity={0.2} /></mesh>
      <mesh position={[0, r * 1.36, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r * 0.17, r * 0.045, 8, 14]} /><meshStandardMaterial color={C.gold} roughness={0.4} /></mesh>
      {detail === "band" && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -r * 0.05, 0]}><torusGeometry args={[r * 0.985, r * 0.075, 8, 32]} /><meshStandardMaterial color={C.cream} roughness={0.5} /></mesh>
      )}
      {detail === "dots" && dots.map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * r * 0.99, -r * 0.05, Math.sin(a) * r * 0.99]}><sphereGeometry args={[r * 0.1, 8, 6]} /><meshStandardMaterial color={C.cream} roughness={0.5} /></mesh>
      ))}
    </group>
  );
}

function makeStarGeometry() {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 + Math.PI / 2;
    const rr = i % 2 ? 0.21 : 0.5;
    const x = Math.cos(a) * rr; const y = Math.sin(a) * rr;
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 5, curveSegments: 6 });
  g.center();
  return g;
}

export default function ChristmasTree3D({ position = [0, 0, 0], interactive = false, hovered = false, lit = 0.35, onPointerOver, onPointerOut, onClick, magic = false }) {
  const group = useRef();
  const lightsMat = useRef();
  const ring = useRef();
  const star = useRef();
  const pLight = useRef();
  const reduce = useReducedMotion();
  const gl = useThree((s) => s.gl);
  const glow = useGlowTexture();
  const hoverRef = useRef(0);
  const litRef = useRef(0.35);

  const tiers = useMemo(() => TIERS.map((t, i) => ({ ...buildTier(t), i, y: t.y })), []);
  useEffect(() => () => tiers.forEach((t) => t.geo.dispose()), [tiers]);

  // garland (cream, puffy) wrapped around the cone
  const garland = useMemo(() => {
    const pts = [];
    const N = 120;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const y = THREE.MathUtils.lerp(0.75, 3.35, t);
      const radius = THREE.MathUtils.lerp(1.78, 0.28, t) * 0.97 + 0.07 + Math.sin(t * Math.PI * 12) * 0.05;
      const ang = t * Math.PI * 2 * 3.4;
      pts.push(new THREE.Vector3(Math.cos(ang) * radius, y - Math.abs(Math.sin(t * Math.PI * 17)) * 0.1, Math.sin(ang) * radius));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 220, 0.06, 8, false);
  }, []);
  useEffect(() => () => garland.dispose(), [garland]);

  // fairy lights (instanced)
  const lightPts = useMemo(() => {
    const pts = [];
    const N = 38;
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const y = THREE.MathUtils.lerp(0.9, 3.15, t);
      const radius = THREE.MathUtils.lerp(1.78, 0.35, t) * 0.96 + 0.12;
      const ang = t * Math.PI * 2 * 4.1 + 1.1;
      pts.push([Math.cos(ang) * radius, y, Math.sin(ang) * radius]);
    }
    return pts;
  }, []);
  const instRef = useRef();
  useEffect(() => {
    const m = instRef.current;
    if (!m) return;
    const d = new THREE.Object3D();
    const col = new THREE.Color();
    const palette = ["#fff0b0", "#ffd36b", "#ffb8a0", "#bfe6ff", "#fff0b0"];
    lightPts.forEach((p, i) => {
      d.position.set(p[0], p[1], p[2]); d.scale.setScalar(1); d.updateMatrix(); m.setMatrixAt(i, d.matrix);
      m.setColorAt(i, col.set(palette[i % palette.length]));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [lightPts]);

  const starGeo = useMemo(makeStarGeometry, []);
  useEffect(() => () => starGeo.dispose(), [starGeo]);

  const placed = useMemo(
    () => BAUBLES.map(([ti, th, f, color, r, detail], i) => ({ key: i, color, r, detail, pos: surf(tiers[ti], th, f, r * 0.62) })),
    [tiers]
  );

  useEffect(() => {
    gl.domElement.style.cursor = hovered && interactive ? "pointer" : "auto";
    return () => { gl.domElement.style.cursor = "auto"; };
  }, [hovered, interactive, gl]);

  useFrame((st, dt) => {
    const t = st.clock.elapsedTime;
    hoverRef.current = damp(hoverRef.current, hovered && interactive ? 1 : 0, 8, dt);
    litRef.current = damp(litRef.current, lit, 2.2, dt);
    const h = hoverRef.current;
    if (group.current) {
      const s = 1 + h * 0.035 + (reduce ? 0 : Math.sin(t * 1.4) * 0.004);
      group.current.scale.setScalar(s);
      group.current.rotation.z = reduce ? 0 : Math.sin(t * 0.8) * 0.006;
    }
    if (lightsMat.current) lightsMat.current.color.setScalar(0.8 + litRef.current * 0.7 + h * 0.35 + (reduce ? 0 : Math.sin(t * 1.6) * 0.06));
    if (pLight.current) pLight.current.intensity = 6 + litRef.current * 26 + h * 10;
    if (star.current) { star.current.rotation.y = reduce ? 0 : Math.sin(t * 0.9) * 0.5; star.current.position.y = 3.98 + (reduce ? 0 : Math.sin(t * 1.3) * 0.03); }
    if (ring.current) {
      const base = interactive ? 0.16 + (reduce ? 0 : Math.sin(t * 2.2) * 0.07) : 0;
      ring.current.material.opacity = damp(ring.current.material.opacity, base + h * 0.4, 6, dt);
      const sc = 1 + (reduce ? 0 : Math.sin(t * 2.2) * 0.025) + h * 0.05;
      ring.current.scale.set(sc, sc, 1);
    }
  });

  return (
    <group position={position}>
      <group ref={group}>
        {/* pot + trunk */}
        <mesh castShadow receiveShadow position={[0, 0.27, 0]}><cylinderGeometry args={[0.62, 0.5, 0.55, 28]} /><meshStandardMaterial color="#8a4a22" roughness={0.65} /></mesh>
        <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.62, 0.09, 12, 32]} /><meshStandardMaterial color="#a05a2a" roughness={0.6} /></mesh>
        {tiers.map((t, i) => (
          <mesh key={i} geometry={t.geo} position={[0, t.y, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={i === 1 ? C.fir : i === 0 ? C.firDark : "#35a85a"} roughness={0.7} metalness={0} emissive="#0a3a1a" emissiveIntensity={0.18} />
          </mesh>
        ))}
        <mesh geometry={garland} castShadow><meshStandardMaterial color={C.cream} roughness={0.55} /></mesh>
        {placed.map((p) => <Ornament key={p.key} position={p.pos} color={p.color} r={p.r} detail={p.detail} />)}

        {/* fairy lights */}
        <instancedMesh ref={instRef} args={[null, null, lightPts.length]} frustumCulled={false}>
          <sphereGeometry args={[0.055, 10, 8]} />
          <meshBasicMaterial ref={lightsMat} toneMapped={false} />
        </instancedMesh>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[new Float32Array(lightPts.flat()), 3]} />
          </bufferGeometry>
          <pointsMaterial map={glow} size={0.36} color="#ffd98a" transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
        </points>

        {/* star */}
        <mesh ref={star} geometry={starGeo} position={[0, 3.98, 0]} castShadow>
          <meshStandardMaterial color={C.gold} roughness={0.38} emissive="#ffb300" emissiveIntensity={0.55} />
        </mesh>
        <sprite position={[0, 3.98, 0.1]} scale={[1.7, 1.7, 1]}><spriteMaterial map={glow} color="#ffd36b" transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
        <pointLight ref={pLight} position={[0, 2.2, 1.4]} color="#ffd9a0" intensity={8} distance={11} decay={2} />
      </group>

      {/* "I am clickable" ring on the floor */}
      <mesh ref={ring} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.05, 2.3, 64]} />
        <meshBasicMaterial color="#ffd36b" transparent opacity={0} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      <Dust count={26} center={[0, 0.2, 0]} box={[3.8, 4.6, 3.8]} color="#ffd98a" size={0.11} speed={0.35} opacity={0.95} active={(hovered && interactive) || magic} sway={0.25} />

      {/* generous invisible hit area (easy to touch on mobile) */}
      <mesh position={[0, 2.1, 0]} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick}>
        <cylinderGeometry args={[2.1, 2.1, 4.6, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
