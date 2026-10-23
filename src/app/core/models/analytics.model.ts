export interface LaneCost {
  id?: string;
  lane: string;
  origin: string;
  destination: string;
  avgCost: number;
  totalCost: number;
  volume: number;
  mode: string;
}

export interface CarrierPerformance {
  id?: string;
  carrier: string;
  onTimePercent: number;
  avgCost: number;
  totalVolume: number;
  claims: number;
  score: number;
}

export interface OnTimeTrend {
  id?: string;
  period: string;
  onTimePercent: number;
  totalDeliveries: number;
}

export interface ModeVolume {
  id?: string;
  mode: string;
  volume: number;
  percentage: number;
  cost: number;
}

export interface AnalyticsData {
  laneCosts: LaneCost[];
  carrierPerformance: CarrierPerformance[];
  onTimeTrends: OnTimeTrend[];
  modeVolumes: ModeVolume[];
}
