import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HubNode {
  id: string;
  name: string;
  pos: [number, number, number];
  color: string;
}

const HUB_NODES: HubNode[] = [
  { id: 'branch-mum', name: 'Mumbai', pos: [-3.8, 0.4, -2.5], color: '#10b981' },
  { id: 'branch-del', name: 'Delhi', pos: [0.2, 2.5, -4.5], color: '#3b82f6' },
  { id: 'branch-blr', name: 'Bangalore', pos: [-1.4, -1.8, -1.8], color: '#10b981' },
  { id: 'branch-chn', name: 'Chennai', pos: [2.5, -1.5, -2.8], color: '#06b6d4' },
  { id: 'branch-hyd', name: 'Hyderabad', pos: [1.2, 0.5, -3.2], color: '#8b5cf6' },
];

const HUB_CONNECTIONS: [number, number][] = [
  [0, 1], // Mum - Del
  [0, 2], // Mum - Blr
  [2, 3], // Blr - Chn
  [3, 4], // Chn - Hyd
  [4, 1], // Hyd - Del
  [0, 4], // Mum - Hyd
];

interface BeaconProps {
  hub: HubNode;
  isActive: boolean;
}

const Beacon: React.FC<BeaconProps> = ({ hub, isActive }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.8;
      const s = 1 + Math.sin(Date.now() * 0.003) * 0.15;
      ringRef.current.scale.set(s, s, s);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.5;
    }
  });

  return (
    <group position={hub.pos}>
      {/* Central Core Glowing Sphere */}
      <mesh>
        <sphereGeometry args={[isActive ? 0.22 : 0.15, 16, 16]} />
        <meshBasicMaterial color={hub.color} />
      </mesh>

      {/* Outer Halo */}
      <mesh>
        <sphereGeometry args={[isActive ? 0.4 : 0.28, 16, 16]} />
        <meshBasicMaterial color={hub.color} transparent opacity={isActive ? 0.35 : 0.18} />
      </mesh>

      {/* Orbiting Tech Ring 1 */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[0.35, 0.42, 32]} />
        <meshBasicMaterial color={hub.color} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Orbiting Tech Ring 2 */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 4, 0, 0]}>
        <ringGeometry args={[0.5, 0.55, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Vertical Data Column */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 2.4, 8]} />
        <meshBasicMaterial color={hub.color} transparent opacity={isActive ? 0.5 : 0.25} />
      </mesh>
    </group>
  );
};

function NetworkLines({ activeId }: { activeId?: string }) {
  const curves = useMemo(() => {
    return HUB_CONNECTIONS.map(([startIdx, endIdx]) => {
      const p1 = new THREE.Vector3(...HUB_NODES[startIdx].pos);
      const p2 = new THREE.Vector3(...HUB_NODES[endIdx].pos);
      const mid = new THREE.Vector3()
        .addVectors(p1, p2)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, 0.4, 0.3));
      return new THREE.QuadraticBezierCurve3(p1, mid, p2);
    });
  }, []);

  const lineGeometries = useMemo(() => {
    return curves.map(curve => {
      const points = curve.getPoints(30);
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, [curves]);

  // Traveling pulses along network lines
  const pulseGroupRef = useRef<THREE.Group>(null);
  const pulseCount = curves.length;
  const pulseSpheres = useRef<THREE.Mesh[]>([]);

  useFrame(() => {
    const t = (Date.now() * 0.0006) % 1;
    pulseSpheres.current.forEach((mesh, idx) => {
      if (mesh && curves[idx]) {
        const offsetT = (t + idx * (1 / pulseCount)) % 1;
        const pt = curves[idx].getPoint(offsetT);
        mesh.position.copy(pt);
      }
    });
  });

  return (
    <group>
      {lineGeometries.map((geom, idx) => (
        <primitive object={new THREE.Line(geom, new THREE.LineBasicMaterial({
          color: '#10b981',
          transparent: true,
          opacity: 0.28,
        }))} key={idx} />
      ))}

      {/* Traveling Data Packets */}
      <group ref={pulseGroupRef}>
        {curves.map((_, idx) => (
          <mesh
            key={idx}
            ref={el => {
              if (el) pulseSpheres.current[idx] = el;
            }}
          >
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#34d399" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function AmbientParticles() {
  const count = 280;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    }
    return pos;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015;
      pointsRef.current.rotation.x += delta * 0.008;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#38bdf8"
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  );
}

function PerspectiveGridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((_, delta) => {
    if (gridRef.current) {
      gridRef.current.position.z = (gridRef.current.position.z + delta * 0.4) % 2;
    }
  });

  return (
    <group position={[0, -4.2, -4]}>
      <gridHelper
        ref={gridRef}
        args={[40, 40, '#047857', '#1e293b']}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

function SceneController({
  activeBranchId,
  mousePos,
}: {
  activeBranchId?: string;
  mousePos: { x: number; y: number };
}) {
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const targetCamPos = useRef(new THREE.Vector3(0, 0, 8));

  useFrame(({ camera }) => {
    // Determine target based on selected branch
    const activeHub = HUB_NODES.find(h => h.id === activeBranchId);
    if (activeHub) {
      targetLook.current.lerp(new THREE.Vector3(...activeHub.pos), 0.04);
      targetCamPos.current.set(
        activeHub.pos[0] * 0.4 + mousePos.x * 0.6,
        activeHub.pos[1] * 0.4 - mousePos.y * 0.6,
        6.5
      );
    } else {
      targetLook.current.lerp(new THREE.Vector3(0, 0, -2), 0.04);
      targetCamPos.current.set(
        mousePos.x * 1.2,
        -mousePos.y * 0.8,
        8.0
      );
    }

    camera.position.lerp(targetCamPos.current, 0.04);
    camera.lookAt(targetLook.current);
  });

  return null;
}

interface Landing3DBackgroundProps {
  activeBranchId?: string;
  mousePos: { x: number; y: number };
}

export const Landing3DBackground: React.FC<Landing3DBackgroundProps> = ({
  activeBranchId,
  mousePos,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-neutral-950">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#09090b']} />
        <fog attach="fog" args={['#09090b', 7, 22]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 5, 5]} intensity={1.5} color="#10b981" />
        <pointLight position={[-6, -2, 2]} intensity={1.0} color="#3b82f6" />

        <SceneController activeBranchId={activeBranchId} mousePos={mousePos} />

        <PerspectiveGridFloor />
        <AmbientParticles />
        <NetworkLines activeId={activeBranchId} />

        {HUB_NODES.map(hub => (
          <Beacon
            key={hub.id}
            hub={hub}
            isActive={hub.id === activeBranchId}
          />
        ))}
      </Canvas>

      {/* Atmospheric radial Vignette Gradient on top of 3D Canvas */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/70"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,0.6)_70%,rgba(9,9,11,0.95)_100%)]"
        aria-hidden="true"
      />
    </div>
  );
};

