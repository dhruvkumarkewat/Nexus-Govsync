import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float, Html, Sparkles, Grid } from '@react-three/drei';
import * as THREE from 'three';

const cubes: { name: string; color: string; pos: [number, number, number] }[] = [
  { name: 'Revenue', color: '#38bdf8', pos: [-2.2, 0.8, 0] },
  { name: 'Education', color: '#34d399', pos: [1.2, 1.4, -1.2] },
  { name: 'Municipal', color: '#a78bfa', pos: [2.0, -0.4, 0.8] },
  { name: 'Welfare', color: '#fbbf24', pos: [-0.6, -1.2, 1.4] },
  { name: 'Health', color: '#fb7185', pos: [-2.8, -0.6, -1.0] },
];

function TangledWires({ from, to, color }: { from: THREE.Vector3; to: THREE.Vector3; color: string }) {
  const points = useMemo(() => {
    const p: THREE.Vector3[] = [];
    const steps = 12;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = THREE.MathUtils.lerp(from.x, to.x, t) + (Math.random() - 0.5) * 0.6;
      const y = THREE.MathUtils.lerp(from.y, to.y, t) + (Math.random() - 0.5) * 0.6 + Math.sin(t * Math.PI) * 0.4;
      const z = THREE.MathUtils.lerp(from.z, to.z, t) + (Math.random() - 0.5) * 0.6;
      p.push(new THREE.Vector3(x, y, z));
    }
    return p;
  }, [from, to]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 48, 0.012, 8, false), [curve]);

  const packetRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!packetRef.current) return;
    const t = (clock.elapsedTime * 0.15) % 1;
    const pt = curve.getPointAt(t);
    packetRef.current.position.copy(pt);
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.6} />
      </mesh>
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function SceneContent() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.0012;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseRef.current.y * 0.08, 0.04);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, mouseRef.current.x * 0.04, 0.04);
  });

  const vectors = useMemo(() => cubes.map((c) => new THREE.Vector3(...c.pos)), []);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-4, -3, 2]} intensity={0.6} color="#fbbf24" />
      <pointLight position={[2, -4, -3]} intensity={0.5} color="#38bdf8" />

      {cubes.map((c) => (
        <Float key={c.name} speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
          <group position={c.pos}>
            <RoundedBox args={[1.0, 1.0, 1.0]} radius={0.08} smoothness={4}>
              <meshStandardMaterial color={c.color} roughness={0.3} metalness={0.6} emissive={c.color} emissiveIntensity={0.2} />
            </RoundedBox>
            <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
              <div className="bg-ink/60 backdrop-blur-md border border-white/10 text-paper text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap">
                {c.name} System
              </div>
            </Html>
          </group>
        </Float>
      ))}

      {vectors.map((from, i) =>
        vectors.slice(i + 1).map((to, j) => (
          <TangledWires key={`${i}-${j}`} from={from} to={to} color={cubes[i].color} />
        ))
      )}

      <Grid args={[14, 14]} cellSize={0.4} cellThickness={0.4} cellColor="#ffffff08" sectionSize={2.4} sectionThickness={0.6} sectionColor="#ffffff10" fadeDistance={10} fadeStrength={1.5} infiniteGrid />
      <Sparkles count={60} scale={10} size={1.2} speed={0.3} color="#ffffff" opacity={0.4} />
    </group>
  );
}

export default function ProblemScene() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full h-[420px] md:h-[520px] lg:h-[600px]">
      {inView && (
        <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
          <SceneContent />
        </Canvas>
      )}
    </div>
  );
}
