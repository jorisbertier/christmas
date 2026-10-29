import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Soft, Burst, clamp, damp, easeInOut, easeOutBack, easeOutBounce, easeOutCubic, makePaperTexture } from "./clay.jsx";
import { TEXTS } from "./surprises.js";

/* ------------------------------------------------------------------ */
/*  A puffy "clay" gift box: body, separate hinged lid, crossed        */
/*  ribbons in relief, a bow, and everything the selection needs       */
/*  (bounce-in, float, hover lift, dismiss, move forward, open).       */
/* ------------------------------------------------------------------ */

const W = 1.16; const H = 0.88; const D = 1.16; // body
const LW = 1.25; const LH = 0.27; const LD = 1.25; // lid
const RW = 0.24; // ribbon width

function Bow({ material, scale = 1 }) {
  return (
    <group scale={scale}>
      {[-1, 1].map((s) => (
        <mesh key={s} material={material} position={[s * 0.25, 0.17, 0]} rotation={[0.25, s * 0.35, s * 0.55]} scale={[1.2, 1.08, 0.7]} castShadow>
          <torusGeometry args={[0.2, 0.08, 14, 28]} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`t${s}`} material={material} position={[s * 0.12, 0.05, 0.2]} rotation={[0.55, s * 0.5, s * 0.25]} castShadow>
          <boxGeometry args={[0.13, 0.035, 0.34]} />
        </mesh>
      ))}
      <mesh material={material} position={[0, 0.14, 0]} scale={[1.15, 0.85, 1]} castShadow><sphereGeometry args={[0.12, 20, 14]} /></mesh>
    </group>
  );
}

export default function GiftBox3D({
  spec, basePos, chosenPos, visible, status = "idle", interactive = false, armed = false, openRequested = false,
  instant = false, reduce = false, onPick, onArm, scale = 1,
}) {
  const root = useRef();
  const lidPivot = useRef();
  const beam = useRef();
  const light = useRef();
  const S = useRef({ appearStart: null, hover: 0, dismiss: 0, move: 0, open: 0, phase: Math.random() * 6, burst: false });
  const [hovered, setHovered] = useState(false);
  const [burstOn, setBurstOn] = useState(false);
  const gl = useThree((s) => s.gl);

  const tex = useMemo(() => makePaperTexture({ base: spec.body, kind: spec.pattern, accent: spec.accent, accent2: spec.accent2 }), [spec]);
  const mats = useMemo(
    () => ({
      body: new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.52, clearcoat: 0.28, clearcoatRoughness: 0.5, emissive: new THREE.Color(spec.body), emissiveIntensity: 0 }),
      ribbon: new THREE.MeshPhysicalMaterial({ color: spec.ribbon, roughness: 0.4, clearcoat: 0.45, clearcoatRoughness: 0.35, emissive: new THREE.Color(spec.ribbon), emissiveIntensity: 0.1 }),
      beam: new THREE.MeshBasicMaterial({ color: spec.glow, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }),
      inner: new THREE.MeshStandardMaterial({ color: spec.glow, emissive: new THREE.Color(spec.glow), emissiveIntensity: 0, roughness: 1 }),
    }),
    [spec, tex]
  );
  useEffect(() => () => { Object.values(mats).forEach((m) => m.dispose()); tex.dispose(); }, [mats, tex]);

  useEffect(() => {
    gl.domElement.style.cursor = hovered && interactive ? "pointer" : gl.domElement.style.cursor;
    return () => { if (hovered) gl.domElement.style.cursor = "auto"; };
  }, [hovered, interactive, gl]);
  useEffect(() => { if (!interactive) setHovered(false); }, [interactive]);

  useFrame((st, dt) => {
    const g = root.current;
    if (!g) return;
    const s = S.current;
    const t = st.clock.elapsedTime;

    if (instant && status === "chosen" && s.move < 1) { s.move = 1; s.open = openRequested ? 1 : 0; s.burst = true; }
    if (instant && status === "dismissed") s.dismiss = 1;

    // appear: quick pop + bounce
    if (visible && s.appearStart === null) s.appearStart = t;
    const ap = s.appearStart === null ? 0 : clamp((t - s.appearStart) / (reduce ? 0.2 : 1.0), 0, 1);
    const popScale = s.appearStart === null ? 0 : easeOutBack(clamp(ap * 2.2, 0, 1));
    const dropY = reduce ? 0 : (1 - easeOutBounce(ap)) * 1.7;

    // hover lift
    const wantHover = (hovered || armed) && interactive && status === "idle";
    s.hover = damp(s.hover, wantHover ? 1 : 0, 9, dt);

    // chosen → move to the front
    if (status === "chosen") s.move = clamp(s.move + dt / (reduce ? 0.4 : 1.4), 0, 1);
    const mv = easeInOut(s.move);

    // dismissed → shrink away
    if (status === "dismissed") s.dismiss = clamp(s.dismiss + dt / (reduce ? 0.3 : 0.9), 0, 1);
    const dm = s.dismiss;

    // open the lid once the gift has arrived
    if (status === "chosen" && openRequested && s.move > 0.82) s.open = clamp(s.open + dt / (reduce ? 0.5 : 1.5), 0, 1);
    const op = easeOutCubic(s.open);
    if (s.open > 0.12 && !s.burst) { s.burst = true; setBurstOn(true); }

    const float = status === "idle" && ap >= 1 && !reduce ? Math.sin(t * 1.5 + s.phase) * 0.07 : 0;
    const sway = status === "idle" && !reduce ? Math.sin(t * 1.1 + s.phase) * 0.03 : 0;
    const arc = Math.sin(Math.PI * mv) * 0.9;

    const x = THREE.MathUtils.lerp(basePos[0], chosenPos[0], mv);
    const y = THREE.MathUtils.lerp(basePos[1], chosenPos[1], mv) + dropY + float + s.hover * 0.28 + arc + dm * 0.9;
    const z = THREE.MathUtils.lerp(basePos[2], chosenPos[2], mv);
    g.position.set(x, y, z);
    g.rotation.set(0, THREE.MathUtils.lerp(0.18 * (basePos[0] < chosenPos[0] ? -1 : 1), 0, mv) + dm * 2.2, sway);
    const sc = scale * popScale * (1 + s.hover * 0.07 + mv * 0.28) * (1 - easeInOut(dm));
    g.scale.setScalar(Math.max(0.0001, sc));
    g.visible = sc > 0.002;

    mats.body.emissiveIntensity = s.hover * 0.32;
    mats.ribbon.emissiveIntensity = 0.1 + s.hover * 0.35;
    if (lidPivot.current) {
      lidPivot.current.rotation.x = -op * 1.95;
      lidPivot.current.position.y = H + op * 0.08;
    }
    mats.inner.emissiveIntensity = op * 2.4;
    mats.beam.opacity = op * (reduce ? 0.35 : 0.5 + Math.sin(t * 3) * 0.06);
    if (beam.current) beam.current.scale.set(1 + op * 0.2, 0.2 + op * 0.8, 1 + op * 0.2);
    if (light.current) light.current.intensity = op * 14;
  });

  const handleOver = (e) => { if (!interactive) return; e.stopPropagation(); setHovered(true); };
  const handleOut = () => setHovered(false);
  const handleClick = (e) => {
    if (!interactive) return;
    e.stopPropagation();
    const touch = (e.nativeEvent && e.nativeEvent.pointerType === "touch") || (e.pointerType === "touch");
    if (touch && !armed) onArm && onArm(spec.id);
    else onPick && onPick(spec.id);
  };

  return (
    <group ref={root} position={basePos} visible={false}>
      {/* big invisible hit box (easy to touch) */}
      <mesh position={[0, 0.9, 0]} onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
        <boxGeometry args={[1.7, 1.9, 1.7]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* body + ribbons */}
      <Soft size={[W, H, D]} radius={0.17} smooth={5} material={mats.body} position={[0, H / 2, 0]} />
      <Soft size={[RW, H + 0.03, D + 0.03]} radius={0.04} material={mats.ribbon} position={[0, H / 2, 0]} />
      <Soft size={[W + 0.03, H + 0.03, RW]} radius={0.04} material={mats.ribbon} position={[0, H / 2, 0]} />
      <mesh material={mats.inner} rotation={[-Math.PI / 2, 0, 0]} position={[0, H + 0.004, 0]}><planeGeometry args={[W * 0.82, D * 0.82]} /></mesh>

      {/* hinged lid: the pivot sits on the back top edge */}
      <group ref={lidPivot} position={[0, H, -D / 2]}>
        <group position={[0, LH / 2 - 0.02, LD / 2 - 0.05]}>
          <Soft size={[LW, LH, LD]} radius={0.12} smooth={5} material={mats.body} />
          <Soft size={[RW, LH + 0.03, LD + 0.03]} radius={0.04} material={mats.ribbon} />
          <Soft size={[LW + 0.03, LH + 0.03, RW]} radius={0.04} material={mats.ribbon} />
          <group position={[0, LH / 2 + 0.005, 0]}><Bow material={mats.ribbon} /></group>
        </group>
      </group>

      {/* magic light escaping from the box */}
      <mesh ref={beam} material={mats.beam} position={[0, H + 1.25, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.62, 2.5, 28, 1, true]} />
      </mesh>
      <pointLight ref={light} position={[0, H + 0.5, 0]} color={spec.glow} intensity={0} distance={8} decay={2} />
      <Burst active={burstOn} center={[0, H + 0.3, 0]} color={spec.glow} count={80} radius={2.4} />

      {(hovered || armed) && interactive && status === "idle" && (
        <Html position={[0, H + 1.05, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
          <div className="whitespace-nowrap rounded-full border border-amber-200/70 bg-[#3a0f14]/90 px-4 py-1.5 text-sm font-semibold text-amber-100 shadow-lg backdrop-blur" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 18 }}>
            {armed ? TEXTS.pickTouch : TEXTS.pick}
          </div>
        </Html>
      )}
    </group>
  );
}
