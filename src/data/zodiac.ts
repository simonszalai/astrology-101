export interface ZodiacSign {
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  startDeg: number;
  color: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Aries', symbol: '♈', element: 'fire', startDeg: 0, color: '#ef4444' },
  { name: 'Taurus', symbol: '♉', element: 'earth', startDeg: 30, color: '#a3e635' },
  { name: 'Gemini', symbol: '♊', element: 'air', startDeg: 60, color: '#facc15' },
  { name: 'Cancer', symbol: '♋', element: 'water', startDeg: 90, color: '#94a3b8' },
  { name: 'Leo', symbol: '♌', element: 'fire', startDeg: 120, color: '#f97316' },
  { name: 'Virgo', symbol: '♍', element: 'earth', startDeg: 150, color: '#a78bfa' },
  { name: 'Libra', symbol: '♎', element: 'air', startDeg: 180, color: '#f472b6' },
  { name: 'Scorpio', symbol: '♏', element: 'water', startDeg: 210, color: '#dc2626' },
  { name: 'Sagittarius', symbol: '♐', element: 'fire', startDeg: 240, color: '#818cf8' },
  { name: 'Capricorn', symbol: '♑', element: 'earth', startDeg: 270, color: '#6b7280' },
  { name: 'Aquarius', symbol: '♒', element: 'air', startDeg: 300, color: '#38bdf8' },
  { name: 'Pisces', symbol: '♓', element: 'water', startDeg: 330, color: '#34d399' },
];

export const OBLIQUITY = 23.4; // degrees — Earth's axial tilt
export const OBLIQUITY_RAD = (OBLIQUITY * Math.PI) / 180;
