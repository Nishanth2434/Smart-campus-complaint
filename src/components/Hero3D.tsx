import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const STATUS_COLORS = ["#1b7a43", "#a85b00", "#1d4ed8"];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const listener = () => setMatches(mq.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [query]);
  return matches;
}

type PointerRef = React.MutableRefObject<{ x: number; y: number }>;

function IssueMarker({
  radius,
  speed,
  offset,
  color,
  size,
  still,
}: {
  radius: number;
  speed: number;
  offset: number;
  color: string;
  size: number;
  still: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = (still ? offset : clock.getElapsedTime() * speed + offset);
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.6) * 0.55, Math.sin(t) * radius);
  });
  return (
    <Float speed={still ? 0 : 2} rotationIntensity={still ? 0 : 1} floatIntensity={still ? 0 : 0.6}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[size, 0]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
      </mesh>
    </Float>
  );
}

function Scene({ reduced, pointer }: { reduced: boolean; pointer: PointerRef }) {
  const group = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (!group.current) return;
    const targetX = pointer.current.y * 0.22;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.04);

    if (reduced) {
      const targetY = -0.5 + pointer.current.x * 0.3;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.04);
    } else {
      group.current.rotation.y += 0.0022;
    }
  });

  return (
    <group ref={group} rotation={[0.16, -0.42, 0.04]} scale={1.18}>
      <RoundedBox args={[2.6, 1.6, 0.2]} radius={0.15} smoothness={4} position={[0.08, -0.08, -0.08]}>
        <meshStandardMaterial color="#e6420f" roughness={0.5} metalness={0.05} />
      </RoundedBox>
      <RoundedBox args={[2.44, 1.44, 0.2]} radius={0.14} smoothness={4} position={[0, 0, 0.08]}>
        <meshStandardMaterial color="#fffaf0" roughness={0.45} metalness={0} />
      </RoundedBox>
      <RoundedBox args={[2.0, 0.16, 0.02]} radius={0.06} smoothness={2} position={[0, 0.42, 0.19]}>
        <meshStandardMaterial color="#f5efe1" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[1.4, 0.12, 0.02]} radius={0.06} smoothness={2} position={[-0.3, 0.1, 0.19]}>
        <meshStandardMaterial color="#f5efe1" roughness={0.7} />
      </RoundedBox>

      <mesh rotation={[Math.PI / 2.35, 0, 0]}>
        <torusGeometry args={[2.2, 0.022, 16, 100]} />
        <meshStandardMaterial color="#ff5a1f" transparent opacity={0.55} roughness={0.3} />
      </mesh>

      <IssueMarker radius={2.35} speed={0.5} offset={0} color={STATUS_COLORS[0]} size={0.18} still={reduced} />
      <IssueMarker radius={1.9} speed={0.36} offset={2.1} color={STATUS_COLORS[1]} size={0.15} still={reduced} />
      <IssueMarker radius={2.62} speed={0.42} offset={4.2} color={STATUS_COLORS[2]} size={0.16} still={reduced} />

      {!reduced && <Sparkles count={40} scale={4.6} size={2.4} speed={0.25} color="#ff5a1f" opacity={0.4} />}
    </group>
  );
}

class Hero3DErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function StaticFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-64 w-64 rotate-6 rounded-3xl border-4 border-ink-950 bg-card shadow-[10px_10px_0_0_rgba(255,90,31,0.9)] sm:h-80 sm:w-80">
        <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-brand-500/60" />
      </div>
    </div>
  );
}

export default function Hero3D() {
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isSmall = useMediaQuery("(max-width: 639px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      pointer.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      };
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <Hero3DErrorBoundary fallback={<StaticFallback />}>
        <Canvas
          dpr={[1, isSmall ? 1.5 : 2]}
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0.3, 5.0], fov: 38 }}
        >
          <hemisphereLight args={["#fff1e6", "#2a1608", 0.65]} />
          <ambientLight intensity={0.45} color="#fff1e6" />
          <directionalLight position={[3, 4, 3]} intensity={1.3} color="#fff8ef" />
          <directionalLight position={[-2, 1, 4]} intensity={0.5} color="#fff1e6" />
          <pointLight position={[-3, -2, -2]} intensity={0.6} color="#ff5a1f" />
          <Suspense fallback={null}>
            <Scene reduced={prefersReduced} pointer={pointer} />
          </Suspense>
        </Canvas>
      </Hero3DErrorBoundary>
    </div>
  );
}
