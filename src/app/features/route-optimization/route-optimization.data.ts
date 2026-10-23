import { OptRoute, RouteSummary, Stop } from '../../core/models';

const depot: Stop = {
  name: 'Main Depot · Dallas, TX',
  lng: -96.7970,
  lat: 32.7767,
  eta: '06:00',
  type: 'depot',
};

export const ROUTES: OptRoute[] = [
  {
    id: 'R-01',
    name: 'North Corridor',
    color: '#3b82f6',
    vehicle: 'TRK-104 · 53ft Dry Van',
    driver: 'Mike Johnson',
    distanceKm: 412,
    durationMin: 395,
    cost: 1240,
    loadPct: 92,
    stops: [
      depot,
      { name: 'Denton, TX', lng: -97.1331, lat: 33.2148, eta: '07:05', type: 'pickup' },
      { name: 'Ardmore, OK', lng: -97.1436, lat: 34.1743, eta: '08:40', type: 'delivery' },
      { name: 'Oklahoma City, OK', lng: -97.5164, lat: 35.4676, eta: '10:15', type: 'delivery' },
      { name: 'Tulsa, OK', lng: -95.9928, lat: 36.1540, eta: '12:05', type: 'delivery' },
    ],
  },
  {
    id: 'R-02',
    name: 'East Loop',
    color: '#22c55e',
    vehicle: 'TRK-118 · Reefer',
    driver: 'Sarah Lee',
    distanceKm: 356,
    durationMin: 340,
    cost: 1085,
    loadPct: 87,
    stops: [
      depot,
      { name: 'Tyler, TX', lng: -95.3011, lat: 32.3513, eta: '07:45', type: 'delivery' },
      { name: 'Longview, TX', lng: -94.7405, lat: 32.5007, eta: '08:35', type: 'pickup' },
      { name: 'Shreveport, LA', lng: -93.7502, lat: 32.5252, eta: '09:50', type: 'delivery' },
    ],
  },
  {
    id: 'R-03',
    name: 'South Run',
    color: '#a855f7',
    vehicle: 'TRK-097 · Flatbed',
    driver: 'Carlos Ruiz',
    distanceKm: 468,
    durationMin: 430,
    cost: 1390,
    loadPct: 95,
    stops: [
      depot,
      { name: 'Waco, TX', lng: -97.1467, lat: 31.5493, eta: '07:30', type: 'delivery' },
      { name: 'Austin, TX', lng: -97.7431, lat: 30.2672, eta: '09:10', type: 'delivery' },
      { name: 'San Antonio, TX', lng: -98.4936, lat: 29.4241, eta: '10:45', type: 'delivery' },
    ],
  },
  {
    id: 'R-04',
    name: 'West Express',
    color: '#f59e0b',
    vehicle: 'TRK-131 · 26ft Box',
    driver: 'Emily Chen',
    distanceKm: 298,
    durationMin: 285,
    cost: 905,
    loadPct: 78,
    stops: [
      depot,
      { name: 'Fort Worth, TX', lng: -97.3308, lat: 32.7555, eta: '06:50', type: 'pickup' },
      { name: 'Abilene, TX', lng: -99.7331, lat: 32.4487, eta: '09:20', type: 'delivery' },
      { name: 'Midland, TX', lng: -102.0779, lat: 31.9973, eta: '11:30', type: 'delivery' },
    ],
  },
];

export const SUMMARY: RouteSummary = {
  before: { km: 1874, cost: 5720, hours: 27.6, vehicles: 5 },
  after: { km: 1534, cost: 4620, hours: 24.2, vehicles: 4 },
  co2SavedKg: 289,
  lastRun: '2025-05-21T10:24',
};
