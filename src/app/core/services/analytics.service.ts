import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AnalyticsData, LaneCost, CarrierPerformance, OnTimeTrend, ModeVolume } from '../models';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private mockData: AnalyticsData = {
    laneCosts: [
      { lane: 'LAX-CHI', origin: 'Los Angeles, CA', destination: 'Chicago, IL', avgCost: 1850, totalCost: 92500, volume: 50, mode: 'Truck' },
      { lane: 'NYC-MIA', origin: 'New York, NY', destination: 'Miami, FL', avgCost: 2100, totalCost: 63000, volume: 30, mode: 'Truck' },
      { lane: 'SEA-DEN', origin: 'Seattle, WA', destination: 'Denver, CO', avgCost: 1450, totalCost: 43500, volume: 30, mode: 'Rail' },
      { lane: 'DAL-ATL', origin: 'Dallas, TX', destination: 'Atlanta, GA', avgCost: 1200, totalCost: 48000, volume: 40, mode: 'Truck' },
      { lane: 'ORD-LAX', origin: 'Chicago, IL', destination: 'Los Angeles, CA', avgCost: 1950, totalCost: 78000, volume: 40, mode: 'Air' },
      { lane: 'HOU-PHX', origin: 'Houston, TX', destination: 'Phoenix, AZ', avgCost: 980, totalCost: 29400, volume: 30, mode: 'Intermodal' },
      { lane: 'BOS-DC', origin: 'Boston, MA', destination: 'Washington, DC', avgCost: 750, totalCost: 22500, volume: 30, mode: 'Truck' },
      { lane: 'SFO-PDX', origin: 'San Francisco, CA', destination: 'Portland, OR', avgCost: 620, totalCost: 18600, volume: 30, mode: 'Truck' }
    ],
    carrierPerformance: [
      { carrier: 'XPO', onTimePercent: 94.2, avgCost: 1620, totalVolume: 245, claims: 3, score: 92 },
      { carrier: 'J.B. Hunt', onTimePercent: 96.8, avgCost: 1780, totalVolume: 312, claims: 1, score: 97 },
      { carrier: 'Schneider', onTimePercent: 91.5, avgCost: 1550, totalVolume: 198, claims: 5, score: 88 },
      { carrier: 'FedEx Freight', onTimePercent: 93.1, avgCost: 1890, totalVolume: 167, claims: 2, score: 90 },
      { carrier: 'UPS Freight', onTimePercent: 95.4, avgCost: 1720, totalVolume: 223, claims: 2, score: 94 }
    ],
    onTimeTrends: [
      { period: 'Week 1', onTimePercent: 91.2, totalDeliveries: 420 },
      { period: 'Week 2', onTimePercent: 92.8, totalDeliveries: 455 },
      { period: 'Week 3', onTimePercent: 94.1, totalDeliveries: 480 },
      { period: 'Week 4', onTimePercent: 93.5, totalDeliveries: 465 },
      { period: 'Week 5', onTimePercent: 95.2, totalDeliveries: 510 },
      { period: 'Week 6', onTimePercent: 94.8, totalDeliveries: 495 },
      { period: 'Week 7', onTimePercent: 96.1, totalDeliveries: 530 },
      { period: 'Week 8', onTimePercent: 95.7, totalDeliveries: 520 }
    ],
    modeVolumes: [
      { mode: 'Truck', volume: 1250, percentage: 52.1, cost: 1875000 },
      { mode: 'Rail', volume: 480, percentage: 20.0, cost: 432000 },
      { mode: 'Air', volume: 210, percentage: 8.75, cost: 735000 },
      { mode: 'Ocean', volume: 320, percentage: 13.3, cost: 256000 },
      { mode: 'Intermodal', volume: 140, percentage: 5.85, cost: 168000 }
    ]
  };

  getAnalytics(): Observable<AnalyticsData> {
    return of(this.mockData);
  }
}
