
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NorthernLight({
  className = "",
  speed = 0.65,
  intensity = 1,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
      -1, 1, 1, -1, 0, 1
    );

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 1.5)
    );
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(
            container.clientWidth,
            container.clientHeight
          ),
        },
        uSpeed: { value: speed },
        uIntensity: { value: intensity },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        varying vec2 vUv;

        uniform float uTime;
        uniform vec2 uResolution;
        uniform float uSpeed;
        uniform float uIntensity;

        float hash(vec2 p) {
          return fract(
            sin(dot(p, vec2(127.1, 311.7))) * 43758.5453
          );
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);

          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
            mix(
              hash(i + vec2(0.0, 1.0)),
              hash(i + vec2(1.0, 1.0)),
              f.x
            ),
            f.y
          );
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;

          for (int i = 0; i < 5; i++) {
            value += amplitude * noise(p);
            p *= 2.0;
            amplitude *= 0.5;
          }

          return value;
        }

        void main() {
          vec2 uv = vUv;
          float t = uTime * uSpeed;

          // De grandes ondulations irrégulières
          float flow = fbm(
            vec2(uv.x * 3.0 + t * 0.12, uv.y * 2.0 - t * 0.08)
          );

          float waves = sin(
            uv.x * 8.0
            + flow * 5.0
            + sin(uv.x * 3.0 - t * 0.16) * 2.0
            + t * 0.18
          );

          float ribbons = smoothstep(
            0.12,
            0.95,
            waves * 0.5 + 0.5
          );

          float turbulence = fbm(
            vec2(uv.x * 7.0 - t * 0.1, uv.y * 4.0 + t * 0.05)
          );

          // Lignes lumineuses verticales et irrégulières
          float curtains = smoothstep(
            0.25,
            0.85,
            turbulence + ribbons * 0.55
          );

          curtains *= smoothstep(0.02, 0.25, uv.y);
          curtains *= 1.0 - smoothstep(0.48, 0.9, uv.y);

          // Le mouvement de la bordure crée des voiles dansants
          float edge = 0.58
            + 0.12 * sin(uv.x * 5.0 + t * 0.12)
            + 0.10 * (flow - 0.5);

          float heightMask = 1.0 - smoothstep(
            edge - 0.06,
            edge + 0.10,
            uv.y
          );

          float glow = curtains * heightMask;

          // Vert émeraude avec des touches menthe
          vec3 green = vec3(0.02, 1.0, 0.32);
          vec3 mint = vec3(0.28, 1.0, 0.66);

          vec3 color = mix(green, mint, turbulence);
          color *= glow * 0.9;

          // Lumière plus diffuse à la base des voiles
          float haze = exp(-pow((uv.y - 0.36) * 5.0, 2.0));
          haze *= 0.12 + 0.12 * flow;

          color += vec3(0.01, 0.28, 0.08) * haze;

          float alpha = clamp(
            (glow * 0.62 + haze * 0.3) * uIntensity,
            0.0,
            0.85
          );

          gl_FragColor = vec4(color * uIntensity, alpha);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId;
    let active = true;

    const clock = new THREE.Clock();

    const render = () => {
      if (!active) return;

      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    };

    render();

    const resizeObserver = new ResizeObserver(() => {
      if (!container.clientWidth || !container.clientHeight) return;

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      );

      material.uniforms.uResolution.value.set(
        container.clientWidth,
        container.clientHeight
      );
    });

    resizeObserver.observe(container);

    return () => {
      active = false;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [speed, intensity]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-hidden ${className}`}
    />
  );
}
