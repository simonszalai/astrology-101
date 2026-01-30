import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import StarField from '../components/StarField';
import InfoPanel from '../components/InfoPanel';
import { ZODIAC_SIGNS, OBLIQUITY_RAD } from '../data/zodiac';

const ECLIPTIC_RADIUS = 6;
const BELT_WIDTH = 0.8;

function EclipticRing() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * ECLIPTIC_RADIUS, 0, Math.sin(angle) * ECLIPTIC_RADIUS));
    }
    return pts;
  }, []);

  return <Line points={points} color="#d4a056" lineWidth={1.5} transparent opacity={0.6} />;
}

function CelestialEquator() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      const x = Math.cos(angle) * ECLIPTIC_RADIUS;
      const z = Math.sin(angle) * ECLIPTIC_RADIUS;
      // Rotate around X axis by obliquity
      const y = z * Math.sin(-OBLIQUITY_RAD);
      const z2 = z * Math.cos(-OBLIQUITY_RAD);
      pts.push(new THREE.Vector3(x, y, z2));
    }
    return pts;
  }, []);

  return <Line points={points} color="#4a7dff" lineWidth={1.5} transparent opacity={0.4} dashed dashSize={0.3} dashScale={1} gapSize={0.15} />;
}

function ZodiacBand() {
  return (
    <group>
      {ZODIAC_SIGNS.map((sign, i) => {
        const startRad = (sign.startDeg * Math.PI) / 180;
        const endRad = ((sign.startDeg + 30) * Math.PI) / 180;
        const midRad = ((sign.startDeg + 15) * Math.PI) / 180;
        const segments = 16;
        const innerR = ECLIPTIC_RADIUS - BELT_WIDTH / 2;
        const outerR = ECLIPTIC_RADIUS + BELT_WIDTH / 2;

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

        const labelPos = new THREE.Vector3(
          Math.cos(midRad) * (ECLIPTIC_RADIUS + BELT_WIDTH + 0.4),
          0,
          Math.sin(midRad) * (ECLIPTIC_RADIUS + BELT_WIDTH + 0.4),
        );

        return (
          <group key={sign.name}>
            <mesh>
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
              <meshBasicMaterial color={sign.color} transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>
            <Text
              position={labelPos}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.35}
              color={sign.color}
              anchorX="center"
              anchorY="middle"
              font={undefined}
            >
              {sign.symbol}
            </Text>
            {i % 3 === 0 && (
              <Text
                position={[
                  Math.cos(midRad) * (ECLIPTIC_RADIUS + BELT_WIDTH + 1.0),
                  0,
                  Math.sin(midRad) * (ECLIPTIC_RADIUS + BELT_WIDTH + 1.0),
                ]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.18}
                color="#8888a0"
                anchorX="center"
                anchorY="middle"
                font={undefined}
              >
                {sign.name}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.1;
    ref.current.position.set(
      Math.cos(t) * ECLIPTIC_RADIUS,
      0,
      Math.sin(t) * ECLIPTIC_RADIUS,
    );
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color="#fbbf24" />
      <pointLight color="#fbbf24" intensity={2} distance={10} />
    </mesh>
  );
}

function Earth() {
  return (
    <mesh>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshBasicMaterial color="#60a5fa" transparent opacity={0.9} />
    </mesh>
  );
}

function ObliquityArc() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const r = 2;
    for (let i = 0; i <= 20; i++) {
      const angle = (i / 20) * OBLIQUITY_RAD;
      pts.push(new THREE.Vector3(0, Math.sin(angle) * r, Math.cos(angle) * r));
    }
    return pts;
  }, []);

  return (
    <group>
      <Line points={points} color="#ffffff" lineWidth={1} transparent opacity={0.3} />
      <Text
        position={[0.3, Math.sin(OBLIQUITY_RAD / 2) * 2.2, Math.cos(OBLIQUITY_RAD / 2) * 2.2]}
        fontSize={0.18}
        color="#8888a0"
        anchorX="left"
        font={undefined}
      >
        23.4°
      </Text>
    </group>
  );
}

function AxisLine({ from, to, color, opacity = 0.2 }: { from: [number, number, number]; to: [number, number, number]; color: string; opacity?: number }) {
  return (
    <Line
      points={[new THREE.Vector3(...from), new THREE.Vector3(...to)]}
      color={color}
      lineWidth={1}
      transparent
      opacity={opacity}
      dashed
      dashSize={0.2}
      dashScale={1}
      gapSize={0.1}
    />
  );
}

export default function GeocentricView() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [4, 6, 8], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <StarField count={2000} radius={50} />
        <Earth />
        <EclipticRing />
        <CelestialEquator />
        <ZodiacBand />
        <Sun />
        <ObliquityArc />
        {/* Ecliptic north pole axis */}
        <AxisLine from={[0, -8, 0]} to={[0, 8, 0]} color="#d4a056" opacity={0.15} />
        {/* Celestial north pole axis (tilted) */}
        <AxisLine
          from={[0, -8 * Math.cos(OBLIQUITY_RAD), -8 * Math.sin(OBLIQUITY_RAD)]}
          to={[0, 8 * Math.cos(OBLIQUITY_RAD), 8 * Math.sin(OBLIQUITY_RAD)]}
          color="#4a7dff"
          opacity={0.15}
        />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={25}
          enablePan={false}
        />
      </Canvas>
      <InfoPanel title="Geocentric Observer">
        <p>
          <span className="text-ecliptic font-medium">Gold ring</span> — the ecliptic, the Sun's apparent path through the sky over one year. This is the fundamental reference plane of astrology.
        </p>
        <p>
          <span className="text-equator font-medium">Blue dashed ring</span> — the celestial equator, Earth's equator projected onto the sky. Tilted 23.4° from the ecliptic.
        </p>
        <p>
          The colored band shows the 12 zodiac divisions, each exactly 30° of ecliptic longitude. The Sun (yellow sphere) orbits along this plane.
        </p>
        <p className="text-xs text-star-dim/60 mt-2">
          Drag to orbit · Scroll to zoom
        </p>
      </InfoPanel>
    </div>
  );
}
