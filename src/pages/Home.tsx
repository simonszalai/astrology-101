import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import StarField from '../components/StarField';

const SECTIONS = [
  {
    to: '/observer',
    title: 'The Observer',
    desc: 'Earth as reference frame. Celestial sphere, ecliptic plane, and the 23.4\u00b0 obliquity that defines everything.',
  },
  {
    to: '/zodiac',
    title: 'The Zodiac Belt',
    desc: '12 equal 30\u00b0 segments of the ecliptic. How the Sun traverses them over one year.',
  },
  {
    to: '/retrograde',
    title: 'Retrograde Motion',
    desc: 'Why planets appear to move backwards. The geometry of inner vs outer orbit overtaking.',
  },
  {
    to: '/cycles',
    title: 'Cycles & Periods',
    desc: 'Sidereal vs synodic periods. Planetary returns. The nested periodicities of the solar system.',
  },
];

export default function Home() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <StarField count={1500} radius={30} />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center pointer-events-auto max-w-2xl px-6">
          <h1 className="font-mono text-xs tracking-[0.3em] uppercase text-ecliptic mb-3">
            Astrology 101
          </h1>
          <p className="text-3xl font-light text-star mb-2">
            Celestial Mechanics
          </p>
          <p className="text-sm text-star-dim mb-10 max-w-md mx-auto">
            An interactive 3D exploration of the astronomical reference frames,
            coordinate systems, and orbital mechanics underlying astrology.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SECTIONS.map(({ to, title, desc }) => (
              <Link
                key={to}
                to={to}
                className="group text-left p-4 rounded-lg border border-nebula bg-void/60 backdrop-blur-sm hover:border-ecliptic/40 hover:bg-nebula/40 transition-all"
              >
                <h3 className="text-sm font-medium text-star group-hover:text-ecliptic transition-colors mb-1">
                  {title}
                </h3>
                <p className="text-xs text-star-dim leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
