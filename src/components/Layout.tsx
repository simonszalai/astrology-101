import { NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/observer', label: 'Observer' },
  { to: '/zodiac', label: 'Zodiac' },
  { to: '/retrograde', label: 'Retrograde' },
  { to: '/cycles', label: 'Cycles' },
];

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-cosmos">
      <nav className="flex-none flex items-center gap-1 px-4 h-14 border-b border-nebula bg-void/60 backdrop-blur-sm z-50">
        <span className="font-mono text-xs font-bold tracking-widest text-ecliptic mr-6 uppercase">
          Astrology 101
        </span>
        {NAV_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded text-xs font-medium tracking-wide transition-colors ${
                isActive
                  ? 'bg-nebula text-star'
                  : 'text-star-dim hover:text-star hover:bg-nebula/50'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="flex-1 relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
