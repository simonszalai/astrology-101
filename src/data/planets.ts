export interface PlanetData {
  name: string;
  color: string;
  orbitAU: number; // semi-major axis in AU
  periodYears: number; // orbital period in Earth years
  size: number; // display size (arbitrary scale)
  eccentricity: number;
}

// Simplified circular orbits for visualization
export const PLANETS: PlanetData[] = [
  { name: 'Mercury', color: '#94a3b8', orbitAU: 0.39, periodYears: 0.241, size: 0.015, eccentricity: 0.206 },
  { name: 'Venus', color: '#fde68a', orbitAU: 0.72, periodYears: 0.615, size: 0.025, eccentricity: 0.007 },
  { name: 'Earth', color: '#60a5fa', orbitAU: 1.0, periodYears: 1.0, size: 0.025, eccentricity: 0.017 },
  { name: 'Mars', color: '#ef4444', orbitAU: 1.52, periodYears: 1.881, size: 0.02, eccentricity: 0.093 },
  { name: 'Jupiter', color: '#d97706', orbitAU: 5.2, periodYears: 11.86, size: 0.05, eccentricity: 0.049 },
  { name: 'Saturn', color: '#fbbf24', orbitAU: 9.54, periodYears: 29.46, size: 0.045, eccentricity: 0.057 },
];

export const SUN = { name: 'Sun', color: '#fbbf24', size: 0.06 };

// Synodic periods (apparent cycle as seen from Earth)
export const SYNODIC_PERIODS: Record<string, number> = {
  Mercury: 0.317, // years
  Venus: 1.599,
  Mars: 2.135,
  Jupiter: 1.092,
  Saturn: 1.035,
  Moon: 0.0809, // ~29.5 days
};
