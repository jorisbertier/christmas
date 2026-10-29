import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { C, Dust } from "./clay.jsx";
import { GIFTS } from "./surprises.js";
import ChristmasTree3D from "./ChristmasTree3D.jsx";
import GiftBox3D from "./GiftBox3D.jsx";
import Fireplace3D from "./Fireplace3D.jsx";
import LivingRoom3D from "./LivingRoom3D.jsx";

/* Where things live in the room */
export const TREE_POS = [-0.4, 0, -1.4];
export const GIFT_SLOTS = [[-2.1, 0, 1.05], [-0.4, 0, 1.85], [1.3, 0, 1.05]];
export const CHOSEN_POS = [-0.4, 0, 2.5];

/* Camera views. The distance is computed from the screen ratio so that the
   important part of the room is never cropped (phones included). */
const VIEWS = {
  intro: { look: [0.6, 2.1, -1.0], dir: [0.26, 0.32, 1], w: 13.5, h: 7.6, min: 9, speed: 0.9 },
  focus: { look: [-0.45, 1.5, 0.5], dir: [0.1, 0.28, 1], w: 5.9, h: 4.8, min: 5.2, speed: 1.5 },
  reveal: { look: [-0.4, 2.0, 2.2], dir: [0.04, 0.22, 1], w: 3.8, h: 3.4, min: 4.2, speed: 1.6 },
};
const viewOf = (phase) => (["loading", "intro", "idle"].includes(phase) ? "intro" : ["focus", "choosing"].includes(phase) ? "focus" : "reveal");

function CameraRig({ phase, reduce }) {
  const { camera, size } = useThree();
  const S = useRef({ pos: new THREE.Vector3(1.5, 8.5, 20), look: new THREE.Vector3(0.6, 2, -1), target: new THREE.Vector3(), dir: new THREE.Vector3(), lookT: new THREE.Vector3() });
  useFrame((st, dt) => {
    const name = viewOf(phase);
    const v = VIEWS[name];
    const s = S.current;
    const aspect = size.width / Math.max(1, size.height);
    const fov = aspect < 0.8 ? 54 : aspect < 1.2 ? 46 : 40;
    if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
    const tv = Math.tan((fov * Math.PI) / 360);
    const dist = Math.max(v.min, v.w / 2 / (tv * aspect), v.h / 2 / tv);
    s.dir.set(v.dir[0], v.dir[1], v.dir[2]).normalize();
    s.lookT.set(v.look[0], v.look[1], v.look[2]);
    s.target.copy(s.lookT).addScaledVector(s.dir, dist);
    if (!reduce && name === "intro") s.target.x += Math.sin(st.clock.elapsedTime * 0.2) * 0.4;
    const k = 1 - Math.exp(-dt * (reduce ? 6 : v.speed));
    s.pos.lerp(s.target, k);
    s.look.lerp(s.lookT, k);
    camera.position.copy(s.pos);
    camera.lookAt(s.look);
  });
  return null;
}

function ReadyNotifier({ onReady }) {
  const n = useRef(0);
  useFrame(() => { n.current += 1; if (n.current === 4) onReady && onReady(); });
  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.85} color="#ffe6c8" />
      <hemisphereLight args={["#a9c2ff", "#7a4a2a", 0.9]} />
      <directionalLight
        castShadow position={[6, 10, 7]} intensity={2.1} color="#ffd9aa"
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.03} shadow-radius={6}
        shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-6} shadow-camera-near={1} shadow-camera-far={32}
      />
      <pointLight position={[-3.6, 3.6, -3.4]} color="#9fb8ff" intensity={7} distance={10} decay={2} />
    </>
  );
}

export default function ChristmasScene({
  phase, choice, restored, giftsVisible, armed, treeHovered, reduce,
  onTreeHover, onTreeClick, onPick, onArm, onMissed, onReady,
}) {
  const treeInteractive = phase === "idle" && !choice;
  const choosing = phase === "choosing" && !choice;
  const opened = !!choice && ["opening", "revealed", "done"].includes(phase);
  const treeLit = ["focus", "choosing", "opening", "revealed", "done"].includes(phase) ? 1 : 0.35;

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ fov: 42, near: 0.1, far: 80, position: [1.5, 8.5, 20] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => { gl.toneMappingExposure = 1.15; }}
      onPointerMissed={onMissed}
      style={{ touchAction: "manipulation" }}
    >
      <color attach="background" args={[C.night]} />
      <fog attach="fog" args={[C.night, 26, 52]} />
      <Lights />
      <CameraRig phase={phase} reduce={reduce} />
      <ReadyNotifier onReady={onReady} />

      <LivingRoom3D />
      <Fireplace3D position={[2.9, 0, -4.05]} />

      <ChristmasTree3D
        position={TREE_POS}
        interactive={treeInteractive}
        hovered={treeHovered}
        lit={treeLit}
        magic={phase === "focus"}
        onPointerOver={(e) => { if (!treeInteractive) return; e.stopPropagation(); onTreeHover(true); }}
        onPointerOut={() => onTreeHover(false)}
        onClick={(e) => { if (!treeInteractive) return; e.stopPropagation(); onTreeClick(); }}
      />

      {GIFTS.map((g, i) => (
        <GiftBox3D
          key={g.id}
          spec={g}
          basePos={GIFT_SLOTS[i]}
          chosenPos={CHOSEN_POS}
          visible={giftsVisible > i}
          status={choice ? (choice === g.id ? "chosen" : "dismissed") : "idle"}
          interactive={choosing}
          armed={armed === g.id}
          openRequested={opened}
          instant={restored}
          reduce={reduce}
          onPick={onPick}
          onArm={onArm}
        />
      ))}

      <Dust count={reduce ? 12 : 34} center={[0.5, 0.4, -0.5]} box={[12, 6, 8]} color="#ffe2a0" size={0.07} speed={0.06} opacity={0.55} sway={0.35} />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.42} scale={16} blur={2.4} far={3.5} resolution={512} color="#3a1608" />
    </Canvas>
  );
}
