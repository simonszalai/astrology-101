import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import StarField from '../components/StarField';
import InfoPanel from '../components/InfoPanel';
import { ZODIAC_SIGNS } from '../data/zodiac';

const DEG = Math.PI / 180;

// Scaled orbit radii for visualization
const ORBITS = [
  { name: 'Mercury', color: '#94a3b8', radius: 1.2, period: 0.241, size: 0.06 },
  { name: 'Venus', color: '#fde68a', radius: 1.8, period: 0.615, size: 0.07 },
  { name: 'Earth', color: '#60a5fa', radius: 2.6, period: 1.0, size: 0.08 },
  { name: 'Moon', color: '#d1d5db', radius: 0.35, period: 0.0748, size: 0.03, parent: 'Earth' },
  { name: 'Mars', color: '#ef4444', radius: 3.4, period: 1.881, size: 0.065 },
  { name: 'Jupiter', color: '#d97706', radius: 4.6, period: 11.86, size: 0.1 },
  { name: 'Saturn', color: '#fbbf24', radius: 5.8, period: 29.46, size: 0.09 },
];

function OrbitRing({ radius, color }: { radius: number; color: string }) {
  const points = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  return <Line points={points} color={color} lineWidth={0.5} transparent opacity={0.15} />;
}

function ZodiacBackground() {
  return (
    <group>
      {ZODIAC_SIGNS.map((sign) => {
        const midRad = (sign.startDeg + 15) * DEG;
        const r = 7.5;
        return (
          <Text
            key={sign.name}
            position={[Math.cos(midRad) * r, 0, Math.sin(midRad) * r]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.3}
            color={sign.color}
            anchorX="center"
            anchorY="middle"
            font={undefined}
            fillOpacity={0.25}
          >
            {sign.symbol}
          </Text>
        );
      })}
    </group>
  );
}

function PlanetarySystem({ speed, showLabels }: { speed: number; showLabels: boolean }) {
  const refs = useRef<Record<string, THREE.Group>>({});
  const angles = useRef<Record<string, number>>(
    Object.fromEntries(ORBITS.map((o) => [o.name, Math.random() * Math.PI * 2]))
  );

  useFrame((_ctx, delta) => {
    const dt = delta * speed;
    const earthAngle = angles.current['Earth'] || 0;
    let earthX = 0, earthZ = 0;

    ORBITS.forEach((orbit) => {
      if (orbit.parent) return; // handle separately
      const rate = (Math.PI * 2) / (orbit.period * 8); // 8 seconds = 1 year
      angles.current[orbit.name] = (angles.current[orbit.name] || 0) + dt * rate;
      const a = angles.current[orbit.name];
      const x = Math.cos(a) * orbit.radius;
      const z = Math.sin(a) * orbit.radius;
      if (refs.current[orbit.name]) {
        refs.current[orbit.name].position.set(x, 0, z);
      }
      if (orbit.name === 'Earth') {
        earthX = x;
        earthZ = z;
      }
    });

    // Moon orbits Earth
    const moonOrbit = ORBITS.find((o) => o.name === 'Moon')!;
    const moonRate = (Math.PI * 2) / (moonOrbit.period * 8);
    angles.current['Moon'] = (angles.current['Moon'] || 0) + dt * moonRate;
    const moonA = angles.current['Moon'];
    if (refs.current['Moon']) {
      refs.current['Moon'].position.set(
        earthX + Math.cos(moonA) * moonOrbit.radius,
        0,
        earthZ + Math.sin(moonA) * moonOrbit.radius,
      );
    }

    // Store earth angle for other uses
    angles.current['_earthAngle'] = earthAngle;
  });

  return (
    <group>
      {/* Sun */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" />
        <pointLight color="#fbbf24" intensity={3} distance={15} />
      </mesh>

      {/* Orbit rings */}
      {ORBITS.filter((o) => !o.parent).map((orbit) => (
        <OrbitRing key={orbit.name} radius={orbit.radius} color={orbit.color} />
      ))}

      {/* Planet bodies */}
      {ORBITS.map((orbit) => (
        <group key={orbit.name} ref={(el) => { if (el) refs.current[orbit.name] = el; }}>
          <mesh>
            <sphereGeometry args={[orbit.size, 16, 16]} />
            <meshBasicMaterial color={orbit.color} />
          </mesh>
          {showLabels && (
            <Text
              position={[0, orbit.size + 0.15, 0]}
              fontSize={0.15}
              color={orbit.color}
              anchorX="center"
              anchorY="bottom"
              font={undefined}
              fillOpacity={0.7}
            >
              {orbit.name}
            </Text>
          )}
        </group>
      ))}
    </group>
  );
}

function PeriodTable() {
  const data = [
    { name: 'Moon', sidereal: '27.3 d', synodic: '29.5 d', note: 'Lunar month' },
    { name: 'Mercury', sidereal: '88 d', synodic: '116 d', note: '3 retrogrades/yr' },
    { name: 'Venus', sidereal: '225 d', synodic: '584 d', note: 'Pentagram pattern' },
    { name: 'Mars', sidereal: '687 d', synodic: '780 d', note: 'Retrograde ~2 mo' },
    { name: 'Jupiter', sidereal: '11.9 yr', synodic: '399 d', note: 'Sign change ~1/yr' },
    { name: 'Saturn', sidereal: '29.5 yr', synodic: '378 d', note: 'Return ~29 yr' },
  ];

  return (
    <div className="absolute bottom-6 right-6 z-10">
      <div className="bg-void/80 backdrop-blur-md border border-nebula rounded-lg p-4 max-w-xs">
        <h3 className="font-mono text-[10px] tracking-widest uppercase text-ecliptic mb-2">
          Orbital Periods
        </h3>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-star-dim/60 border-b border-nebula">
              <th className="text-left py-1 font-normal">Body</th>
              <th className="text-right py-1 font-normal">Sidereal</th>
              <th className="text-right py-1 font-normal">Synodic</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.name} className="border-b border-nebula/30">
                <td className="py-1 text-star-dim">{row.name}</td>
                <td className="py-1 text-right font-mono text-star-dim/80">{row.sidereal}</td>
                <td className="py-1 text-right font-mono text-star-dim/80">{row.synodic}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[10px] text-star-dim/40 mt-2">
          Sidereal = true orbital period. Synodic = apparent cycle from Earth.
        </p>
      </div>
    </div>
  );
}

export default function CyclesView() {
  const [speed, setSpeed] = useState(1);
  const [showLabels, setShowLabels] = useState(true);

  const cycleSpeed = useCallback(() => {
    setSpeed((s) => (s >= 4 ? 0.5 : s + 0.5));
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 10, 8], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <StarField count={1500} radius={40} />
        <ZodiacBackground />
        <PlanetarySystem speed={speed} showLabels={showLabels} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={25}
          enablePan={false}
        />
      </Canvas>

      <InfoPanel title="Cycles & Periods">
        <p>
          Every planet has two key periods:{' '}
          <span className="text-ecliptic font-medium">sidereal</span> (actual orbit around the Sun) and{' '}
          <span className="text-equator font-medium">synodic</span> (apparent cycle as seen from Earth).
        </p>
        <p>
          The synodic period is how long between successive alignments of the Sun, Earth, and the planet.
          It differs from the sidereal period because Earth is also moving.
        </p>
        <p>
          Formula: <code className="font-mono text-xs bg-nebula/50 px-1 rounded">1/P_syn = |1/P_earth − 1/P_planet|</code>
        </p>
        <p>
          The <span className="text-gray-300 font-medium">Moon</span> orbits Earth every ~27.3 days (sidereal),
          but the lunar phase cycle is ~29.5 days (synodic) because Earth has moved relative to the Sun.
        </p>
      </InfoPanel>

      <PeriodTable />

      <div className="absolute bottom-6 left-6 z-10 flex gap-2">
        <button
          onClick={cycleSpeed}
          className="px-3 py-1.5 rounded text-xs font-mono bg-void/80 backdrop-blur border border-nebula text-star-dim hover:text-star hover:border-ecliptic/40 transition-colors"
        >
          Speed: {speed}x
        </button>
        <button
          onClick={() => setShowLabels((s) => !s)}
          className="px-3 py-1.5 rounded text-xs font-mono bg-void/80 backdrop-blur border border-nebula text-star-dim hover:text-star hover:border-ecliptic/40 transition-colors"
        >
          Labels: {showLabels ? 'on' : 'off'}
        </button>
      </div>
    </div>
  );
}
