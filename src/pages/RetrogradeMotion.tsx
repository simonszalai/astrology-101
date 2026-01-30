import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import StarField from '../components/StarField';
import InfoPanel from '../components/InfoPanel';
import { ZODIAC_SIGNS } from '../data/zodiac';

const EARTH_ORBIT = 3;
const MARS_ORBIT = 4.5;
const ZODIAC_RADIUS = 7;
const DEG = Math.PI / 180;

function OrbitRing({ radius, color, opacity = 0.15 }: { radius: number; color: string; opacity?: number }) {
  const points = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  return <Line points={points} color={color} lineWidth={1} transparent opacity={opacity} />;
}

function BackgroundZodiac() {
  return (
    <group>
      {ZODIAC_SIGNS.map((sign) => {
        const midRad = (sign.startDeg + 15) * DEG;
        return (
          <Text
            key={sign.name}
            position={[Math.cos(midRad) * (ZODIAC_RADIUS + 0.3), 0, Math.sin(midRad) * (ZODIAC_RADIUS + 0.3)]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.35}
            color={sign.color}
            anchorX="center"
            anchorY="middle"
            font={undefined}
            fillOpacity={0.4}
          >
            {sign.symbol}
          </Text>
        );
      })}
      <OrbitRing radius={ZODIAC_RADIUS} color="#333340" opacity={0.1} />
    </group>
  );
}

interface SimState {
  earthAngle: number;
  marsAngle: number;
  trail: THREE.Vector3[];
  projectedTrail: Array<{ angle: number; time: number }>;
}

function SolarSystem({ speed, showSightLine }: { speed: number; showSightLine: boolean }) {
  const earthRef = useRef<THREE.Mesh>(null);
  const marsRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.BufferGeometry>(null);
  const projRef = useRef<THREE.Mesh>(null);
  const state = useRef<SimState>({
    earthAngle: 0,
    marsAngle: 0,
    trail: [],
    projectedTrail: [],
  });

  useFrame((_ctx, delta) => {
    const s = state.current;
    const dt = delta * speed;

    // Earth: 1 year period, Mars: 1.881 year period
    s.earthAngle += (dt * Math.PI * 2) / 6; // 6 seconds = 1 year
    s.marsAngle += (dt * Math.PI * 2) / (6 * 1.881);

    const ex = Math.cos(s.earthAngle) * EARTH_ORBIT;
    const ez = Math.sin(s.earthAngle) * EARTH_ORBIT;
    const mx = Math.cos(s.marsAngle) * MARS_ORBIT;
    const mz = Math.sin(s.marsAngle) * MARS_ORBIT;

    if (earthRef.current) earthRef.current.position.set(ex, 0.05, ez);
    if (marsRef.current) marsRef.current.position.set(mx, 0.05, mz);

    // Sight line from Earth through Mars to zodiac
    const dx = mx - ex;
    const dz = mz - ez;
    const angle = Math.atan2(dz, dx);
    const projX = Math.cos(angle) * ZODIAC_RADIUS;
    const projZ = Math.sin(angle) * ZODIAC_RADIUS;

    if (projRef.current) projRef.current.position.set(projX, 0.05, projZ);

    // Trail of projected positions
    s.projectedTrail.push({ angle, time: s.earthAngle });
    if (s.projectedTrail.length > 500) s.projectedTrail.shift();

    // Sight line geometry
    if (lineRef.current && showSightLine) {
      const positions = new Float32Array([ex, 0.03, ez, projX, 0.03, projZ]);
      lineRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      lineRef.current.setDrawRange(0, 2);
    }
  });

  // Mars trail on zodiac
  const trailGeoRef = useRef<THREE.BufferGeometry>(null);
  useFrame(() => {
    const s = state.current;
    if (trailGeoRef.current && s.projectedTrail.length > 2) {
      const pts = new Float32Array(s.projectedTrail.length * 3);
      s.projectedTrail.forEach((p, i) => {
        pts[i * 3] = Math.cos(p.angle) * ZODIAC_RADIUS;
        pts[i * 3 + 1] = 0.02;
        pts[i * 3 + 2] = Math.sin(p.angle) * ZODIAC_RADIUS;
      });
      trailGeoRef.current.setAttribute('position', new THREE.BufferAttribute(pts, 3));
      trailGeoRef.current.setDrawRange(0, s.projectedTrail.length);
    }
  });

  return (
    <group>
      {/* Sun */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" />
        <pointLight color="#fbbf24" intensity={2} distance={12} />
      </mesh>

      {/* Orbits */}
      <OrbitRing radius={EARTH_ORBIT} color="#60a5fa" opacity={0.2} />
      <OrbitRing radius={MARS_ORBIT} color="#ef4444" opacity={0.2} />

      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#60a5fa" />
      </mesh>

      {/* Mars */}
      <mesh ref={marsRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Projected position on zodiac */}
      <mesh ref={projRef}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.7} />
      </mesh>

      {/* Sight line */}
      {showSightLine && (
        <line>
          <bufferGeometry ref={lineRef}>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array(6)}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </line>
      )}

      {/* Projected trail */}
      <line>
        <bufferGeometry ref={trailGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            count={0}
            array={new Float32Array(1500)}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ef4444" transparent opacity={0.5} />
      </line>
    </group>
  );
}

export default function RetrogradeMotion() {
  const [speed, setSpeed] = useState(1);
  const [showSight, setShowSight] = useState(true);

  const cycleSpeed = useCallback(() => {
    setSpeed((s) => (s >= 3 ? 0.5 : s + 0.5));
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 10, 6], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <StarField count={1500} radius={40} />
        <BackgroundZodiac />
        <SolarSystem speed={speed} showSightLine={showSight} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={4}
          maxDistance={25}
          enablePan={false}
        />
      </Canvas>

      <InfoPanel title="Retrograde Motion">
        <p>
          Planets orbit the Sun at different speeds.{' '}
          <span className="text-blue-400 font-medium">Earth</span> (inner, faster) periodically overtakes{' '}
          <span className="text-red-400 font-medium">Mars</span> (outer, slower).
        </p>
        <p>
          The <span className="text-red-400 font-medium">red dot on the zodiac ring</span> shows where Mars{' '}
          <em>appears</em> to be from Earth's perspective — the line-of-sight projection.
        </p>
        <p>
          When Earth overtakes Mars, the projected position reverses direction — this is{' '}
          <span className="text-ecliptic font-medium">apparent retrograde motion</span>. The planet isn't
          actually moving backwards; it's a parallax effect.
        </p>
      </InfoPanel>

      {/* Controls */}
      <div className="absolute bottom-6 left-6 z-10 flex gap-2">
        <button
          onClick={cycleSpeed}
          className="px-3 py-1.5 rounded text-xs font-mono bg-void/80 backdrop-blur border border-nebula text-star-dim hover:text-star hover:border-ecliptic/40 transition-colors"
        >
          Speed: {speed}x
        </button>
        <button
          onClick={() => setShowSight((s) => !s)}
          className="px-3 py-1.5 rounded text-xs font-mono bg-void/80 backdrop-blur border border-nebula text-star-dim hover:text-star hover:border-ecliptic/40 transition-colors"
        >
          Sight line: {showSight ? 'on' : 'off'}
        </button>
      </div>
    </div>
  );
}
