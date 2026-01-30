import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import StarField from '../components/StarField';
import InfoPanel from '../components/InfoPanel';
import { ZODIAC_SIGNS } from '../data/zodiac';

const RING_RADIUS = 5;
const RING_WIDTH = 1.2;
const DEG = Math.PI / 180;

function ZodiacRing({ hoveredSign, onHover }: { hoveredSign: string | null; onHover: (name: string | null) => void }) {
  return (
    <group>
      {ZODIAC_SIGNS.map((sign) => {
        const startRad = sign.startDeg * DEG;
        const endRad = (sign.startDeg + 30) * DEG;
        const midRad = (sign.startDeg + 15) * DEG;
        const isHovered = hoveredSign === sign.name;
        const segments = 24;
        const innerR = RING_RADIUS - RING_WIDTH / 2;
        const outerR = RING_RADIUS + RING_WIDTH / 2;

        const vertices: number[] = [];
        const indices: number[] = [];

        for (let s = 0; s <= segments; s++) {
          const angle = startRad + (s / segments) * (endRad - startRad);
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          vertices.push(cos * innerR, 0, sin * innerR);
          vertices.push(cos * outerR, 0, sin * outerR);
          if (s < segments) {
            const base = s * 2;
            indices.push(base, base + 1, base + 2);
            indices.push(base + 1, base + 3, base + 2);
          }
        }

        // Divider line
        const divStart = new THREE.Vector3(Math.cos(startRad) * innerR, 0.01, Math.sin(startRad) * innerR);
        const divEnd = new THREE.Vector3(Math.cos(startRad) * outerR, 0.01, Math.sin(startRad) * outerR);

        return (
          <group key={sign.name}>
            <mesh
              onPointerEnter={() => onHover(sign.name)}
              onPointerLeave={() => onHover(null)}
            >
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={vertices.length / 3}
                  array={new Float32Array(vertices)}
                  itemSize={3}
                />
                <bufferAttribute
                  attach="index"
                  count={indices.length}
                  array={new Uint16Array(indices)}
                  itemSize={1}
                />
              </bufferGeometry>
              <meshBasicMaterial
                color={sign.color}
                transparent
                opacity={isHovered ? 0.4 : 0.15}
                side={THREE.DoubleSide}
              />
            </mesh>
            <Line points={[divStart, divEnd]} color="#8888a0" lineWidth={0.5} transparent opacity={0.3} />
            <Text
              position={[Math.cos(midRad) * RING_RADIUS, 0.05, Math.sin(midRad) * RING_RADIUS]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.5}
              color={isHovered ? sign.color : '#8888a0'}
              anchorX="center"
              anchorY="middle"
              font={undefined}
            >
              {sign.symbol}
            </Text>
            <Text
              position={[
                Math.cos(midRad) * (RING_RADIUS + RING_WIDTH / 2 + 0.5),
                0,
                Math.sin(midRad) * (RING_RADIUS + RING_WIDTH / 2 + 0.5),
              ]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.16}
              color={isHovered ? sign.color : '#55556a'}
              anchorX="center"
              anchorY="middle"
              font={undefined}
            >
              {sign.name}
            </Text>
            <Text
              position={[
                Math.cos(midRad) * (RING_RADIUS - RING_WIDTH / 2 - 0.4),
                0,
                Math.sin(midRad) * (RING_RADIUS - RING_WIDTH / 2 - 0.4),
              ]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.12}
              color="#55556a"
              anchorX="center"
              anchorY="middle"
              font={undefined}
            >
              {sign.startDeg}°
            </Text>
          </group>
        );
      })}
    </group>
  );
}

function SunMarker() {
  const ref = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Vector3[]>([]);
  const trailLineRef = useRef<THREE.BufferGeometry>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.15;
    const x = Math.cos(t) * RING_RADIUS;
    const z = Math.sin(t) * RING_RADIUS;
    ref.current.position.set(x, 0.1, z);

    // Update trail
    trailRef.current.push(new THREE.Vector3(x, 0.02, z));
    if (trailRef.current.length > 200) trailRef.current.shift();

    if (trailLineRef.current && trailRef.current.length > 2) {
      const positions = new Float32Array(trailRef.current.length * 3);
      trailRef.current.forEach((p, i) => {
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      });
      trailLineRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      trailLineRef.current.setDrawRange(0, trailRef.current.length);
    }
  });

  return (
    <>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
        <pointLight color="#fbbf24" intensity={3} distance={5} />
      </group>
      <line>
        <bufferGeometry ref={trailLineRef}>
          <bufferAttribute
            attach="attributes-position"
            count={0}
            array={new Float32Array(600)}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#fbbf24" transparent opacity={0.3} />
      </line>
    </>
  );
}

function DegreeMarkers() {
  const markers = useMemo(() => {
    const m: { pos: THREE.Vector3; label: string }[] = [];
    for (let deg = 0; deg < 360; deg += 10) {
      if (deg % 30 === 0) continue;
      const rad = deg * DEG;
      const r = RING_RADIUS - RING_WIDTH / 2 - 0.15;
      m.push({
        pos: new THREE.Vector3(Math.cos(rad) * r, 0, Math.sin(rad) * r),
        label: `${deg}°`,
      });
    }
    return m;
  }, []);

  return (
    <>
      {markers.map(({ pos, label }) => (
        <Text
          key={label}
          position={pos}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.08}
          color="#33334a"
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          {label}
        </Text>
      ))}
    </>
  );
}

export default function ZodiacBelt() {
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredSign = ZODIAC_SIGNS.find((s) => s.name === hovered);

  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 8, 4], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <StarField count={1500} radius={40} />
        <ZodiacRing hoveredSign={hovered} onHover={setHovered} />
        <SunMarker />
        <DegreeMarkers />
        {/* Center marker */}
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.1, 16]} />
          <meshBasicMaterial color="#8888a0" transparent opacity={0.3} />
        </mesh>
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={20}
          enablePan={false}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
      <InfoPanel title="The Zodiac Belt">
        <p>
          The ecliptic is divided into <span className="text-ecliptic font-medium">12 equal segments of 30°</span> each.
          These are the zodiac signs — not constellations, but fixed divisions of ecliptic longitude.
        </p>
        <p>
          The Sun (yellow) moves counter-clockwise at ~1°/day, completing the full 360° in one tropical year (~365.25 days).
        </p>
        <p>
          0° Aries is defined by the <span className="text-equator font-medium">vernal equinox point</span> — where the ecliptic crosses the celestial equator heading north.
        </p>
        {hoveredSign && (
          <div className="mt-3 pt-3 border-t border-nebula">
            <span style={{ color: hoveredSign.color }} className="font-medium">
              {hoveredSign.symbol} {hoveredSign.name}
            </span>
            <span className="text-star-dim"> — {hoveredSign.startDeg}°–{hoveredSign.startDeg + 30}° · {hoveredSign.element}</span>
          </div>
        )}
      </InfoPanel>
    </div>
  );
}
