export interface Stop { name: string; x: number; y: number; eta: string; type: 'depot' | 'pickup' | 'delivery'; }
export interface OptRoute {
  id: string; name: string; color: string; vehicle: string; driver: string;
  distanceKm: number; durationMin: number; cost: number; loadPct: number; stops: Stop[];
}

const depot: Stop = { name: 'Main Depot · Dallas, TX', x: 470, y: 330, eta: '06:00', type: 'depot' };

export const ROUTES: OptRoute[] = [
  { id: 'R-01', name: 'North Corridor', color: '#3b82f6', vehicle: 'TRK-104 · 53ft Dry Van', driver: 'Mike Johnson',
    distanceKm: 412, durationMin: 395, cost: 1240, loadPct: 92,
    stops: [depot,
      { name: 'Denton, TX', x: 455, y: 245, eta: '07:05', type: 'pickup' },
      { name: 'Ardmore, OK', x: 480, y: 165, eta: '08:40', type: 'delivery' },
      { name: 'Oklahoma City, OK', x: 440, y: 85, eta: '10:15', type: 'delivery' },
      { name: 'Tulsa, OK', x: 560, y: 70, eta: '12:05', type: 'delivery' }] },
  { id: 'R-02', name: 'East Loop', color: '#22c55e', vehicle: 'TRK-118 · Reefer', driver: 'Sarah Lee',
    distanceKm: 356, durationMin: 340, cost: 1085, loadPct: 87,
    stops: [depot,
      { name: 'Tyler, TX', x: 640, y: 320, eta: '07:45', type: 'delivery' },
      { name: 'Longview, TX', x: 720, y: 290, eta: '08:35', type: 'pickup' },
      { name: 'Shreveport, LA', x: 810, y: 260, eta: '09:50', type: 'delivery' }] },
  { id: 'R-03', name: 'South Run', color: '#a855f7', vehicle: 'TRK-097 · Flatbed', driver: 'Carlos Ruiz',
    distanceKm: 468, durationMin: 430, cost: 1390, loadPct: 95,
    stops: [depot,
      { name: 'Waco, TX', x: 480, y: 450, eta: '07:30', type: 'delivery' },
      { name: 'Austin, TX', x: 430, y: 560, eta: '09:10', type: 'delivery' },
      { name: 'San Antonio, TX', x: 360, y: 640, eta: '10:45', type: 'delivery' }] },
  { id: 'R-04', name: 'West Express', color: '#f59e0b', vehicle: 'TRK-131 · 26ft Box', driver: 'Emily Chen',
    distanceKm: 298, durationMin: 285, cost: 905, loadPct: 78,
    stops: [depot,
      { name: 'Fort Worth, TX', x: 400, y: 335, eta: '06:50', type: 'pickup' },
      { name: 'Abilene, TX', x: 230, y: 380, eta: '09:20', type: 'delivery' },
      { name: 'Midland, TX', x: 110, y: 440, eta: '11:30', type: 'delivery' }] },
];

export const SUMMARY = {
  before: { km: 1874, cost: 5720, hours: 27.6, vehicles: 5 },
  after:  { km: 1534, cost: 4620, hours: 24.2, vehicles: 4 },
  co2SavedKg: 289,
  lastRun: 'May 21, 2025 10:24 AM',
};
