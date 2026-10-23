export interface Stop {
  name: string;
  lng: number;
  lat: number;
  eta: string;
  type: 'depot' | 'pickup' | 'delivery';
}

export interface OptRoute {
  id: string;
  name: string;
  color: string;
  vehicle: string;
  driver: string;
  distanceKm: number;
  durationMin: number;
  cost: number;
  loadPct: number;
  stops: Stop[];
}

export interface RouteSummary {
  id?: string;
  before: { km: number; cost: number; hours: number; vehicles: number };
  after: { km: number; cost: number; hours: number; vehicles: number };
  co2SavedKg: number;
  lastRun: string;
}
