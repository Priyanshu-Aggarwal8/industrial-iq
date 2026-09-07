import React, { useRef, useMemo, Component, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const rippleVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Distance from center
    float dCenter = length(uv - vec2(0.5, 0.5));

    // Gentle, slowed harmonic liquid ripples
    float wave1 = sin(dCenter * 14.0 - uTime * 0.75) * 0.09;
    float wave2 = cos((uv.x * 6.0 + uv.y * 7.5) + uTime * 0.5) * 0.05;
    float wave3 = sin(uv.x * 10.0 - uTime * 0.6) * 0.03;

    // Interactive cursor concentric ripples (inspired by landonorris.com)
    float dMouse = length(uv - uMouse);
    float mouseWave = sin(dMouse * 18.0 - uTime * 1.8) * exp(-dMouse * 3.8) * 0.16;

    float elevation = wave1 + wave2 + wave3 + mouseWave;
    pos.z += elevation;
    vElevation = elevation;

    // Normal calculation for subtle, soft specular caustics
    float eps = 0.025;
    float nZ1 = sin(length(uv + vec2(eps, 0.0) - vec2(0.5)) * 14.0 - uTime * 0.75) * 0.09;
    float nZ2 = sin(length(uv + vec2(0.0, eps) - vec2(0.5)) * 14.0 - uTime * 0.75) * 0.09;
    vec3 vA = vec3(eps, 0.0, nZ1 - wave1);
    vec3 vB = vec3(0.0, eps, nZ2 - wave1);
    vNormal = normalize(cross(vA, vB));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const rippleFragmentShader = `
  uniform float uTime;
  uniform float uTheme; // 1.0 = dark, 0.0 = light
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;

  void main() {
    // Soft diffused directional light
    vec3 lightDir = normalize(vec3(0.2, 0.4, 0.9));
    float diff = max(dot(vNormal, lightDir), 0.0);

    // Soft specular liquid reflection
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 36.0);

    // Softened contour ripple lines
    float contour = sin(vElevation * 28.0);
    float contourLine = smoothstep(0.82, 0.99, contour) * 0.12;

    // Normalized elevation
    float tElev = clamp(vElevation * 2.2 + 0.5, 0.0, 1.0);

    // ================= DARK MODE PALETTE =================
    vec3 darkBg = vec3(0.038, 0.042, 0.05);        // #0a0c10
    vec3 darkWaveLow = vec3(0.03, 0.08, 0.06);     // soft muted emerald base
    vec3 darkWaveHigh = vec3(0.06, 0.72, 0.45);    // gentle emerald glow
    vec3 darkSpecColor = vec3(0.25, 0.85, 0.75);   // soft cyan highlight

    vec3 darkColor = mix(darkBg, darkWaveLow, tElev);
    darkColor = mix(darkColor, darkWaveHigh, smoothstep(0.48, 0.82, tElev) * 0.7);
    darkColor += contourLine * vec3(0.12, 0.75, 0.52);
    darkColor += spec * darkSpecColor * 0.38;

    // ================= LIGHT MODE PALETTE (HIGH-CONTRAST LIQUID) =================
    // Eliminate white-on-white washout: use cool slate/mint troughs, emerald crests, and teal contour rings
    vec3 lightBg = vec3(0.965, 0.975, 0.985);        // #f1f5f9 clean canvas
    vec3 lightTrough = vec3(0.80, 0.88, 0.85);      // optical water depth & ambient shadows
    vec3 lightEmeraldWash = vec3(0.88, 0.95, 0.91); // subtle emerald body tint
    vec3 lightCrest = vec3(0.04, 0.60, 0.40);       // rich emerald crest
    vec3 lightSpecColor = vec3(0.05, 0.68, 0.48);   // vibrant emerald sheen (NO washed-out white)

    // Liquid depth gradient: deeper troughs are darker/cooler, mid elevations catch soft tint
    vec3 lightColor = mix(lightTrough, lightBg, smoothstep(0.12, 0.52, tElev));
    lightColor = mix(lightColor, lightEmeraldWash, smoothstep(0.38, 0.72, tElev));
    lightColor = mix(lightColor, lightCrest, smoothstep(0.58, 0.88, tElev) * 0.40);

    // Contrasting emerald contour ripple rings (crisp and visible, no white)
    lightColor = mix(lightColor, vec3(0.02, 0.50, 0.35), contourLine * 0.32);

    // Emerald specular reflection provides clear shine without washing out
    lightColor += spec * lightSpecColor * 0.40;

    // Diffuse directional shading gives clear 3D liquid relief
    lightColor += (diff - 0.65) * 0.16 * vec3(0.03, 0.42, 0.30);

    // Smooth theme interpolation
    vec3 finalColor = mix(lightColor, darkColor, uTheme);

    // Vignette fade towards outer edges
    float distFromCenter = length(vUv - vec2(0.5));
    float vignette = smoothstep(0.85, 0.20, distFromCenter);
    vec3 targetBg = mix(lightBg, darkBg, uTheme);
    finalColor = mix(targetBg, finalColor, vignette * 0.88 + 0.12);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface RippleMeshProps {
  theme: 'light' | 'dark';
  mousePos: { x: number; y: number };
}

function RippleMesh({ theme, mousePos }: RippleMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const smoothedMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const targetThemeVal = theme === 'dark' ? 1.0 : 0.0;
  const currentThemeVal = useRef(targetThemeVal);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTheme: { value: targetThemeVal },
    }),
    []
  );

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta * 0.42;

      const targetUvX = (mousePos.x + 1) * 0.5;
      const targetUvY = (-mousePos.y + 1) * 0.5;
      smoothedMouse.current.lerp(new THREE.Vector2(targetUvX, targetUvY), 0.05);
      materialRef.current.uniforms.uMouse.value.copy(smoothedMouse.current);

      currentThemeVal.current = THREE.MathUtils.lerp(
        currentThemeVal.current,
        targetThemeVal,
        0.08
      );
      materialRef.current.uniforms.uTheme.value = currentThemeVal.current;
    }

    if (meshRef.current) {
      meshRef.current.rotation.x = -Math.PI / 4 + mousePos.y * 0.035;
      meshRef.current.rotation.y = mousePos.x * 0.035;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, -1]}
      rotation={[-Math.PI / 4, 0, 0]}
    >
      <planeGeometry args={[26, 18, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={rippleVertexShader}
        fragmentShader={rippleFragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('WebGL Canvas fallback engaged:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

interface LandingRippleBackgroundProps {
  theme?: 'light' | 'dark';
  mousePos: { x: number; y: number };
}

export const LandingRippleBackground: React.FC<LandingRippleBackgroundProps> = ({
  theme = 'dark',
  mousePos,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-[#0a0c10]' : 'bg-[#f8fafc]'
      }`}
    >
      {/* Three.js Canvas with Crash-Proof Error Boundary */}
      <CanvasErrorBoundary
        fallback={
          <div
            className={`w-full h-full ${
              isDark
                ? 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(10,12,16,0))]'
                : 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.10),rgba(248,250,252,0))]'
            }`}
          />
        }
      >
        <div className="w-full h-full">
          <Canvas
            camera={{ position: [0, -1.5, 7.5], fov: 52 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <RippleMesh theme={theme} mousePos={mousePos} />
          </Canvas>
        </div>
      </CanvasErrorBoundary>

      {/* Atmospheric Overlays with Smooth Backdrop Blur for Silky Liquid Effect */}
      <div
        className={`absolute inset-0 pointer-events-none backdrop-blur-[2px] transition-opacity duration-500 ${
          isDark
            ? 'bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/70'
            : 'bg-gradient-to-t from-neutral-50/50 via-transparent to-neutral-50/30'
        }`}
        aria-hidden="true"
      />
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isDark
            ? 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,12,16,0.5)_65%,rgba(10,12,16,0.95)_100%)]'
            : 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(248,250,252,0.15)_65%,rgba(248,250,252,0.65)_100%)]'
        }`}
        aria-hidden="true"
      />
    </div>
  );
};
