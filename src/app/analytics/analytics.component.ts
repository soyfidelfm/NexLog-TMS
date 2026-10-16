import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface LaneCost {
  lane: string;
  origin: string;
  destination: string;
  avgCost: number;
  totalCost: number;
  volume: number;
  mode: string;
}

export interface CarrierPerformance {
  carrier: string;
  onTimePercent: number;
  avgCost: number;
  totalVolume: number;
  claims: number;
  score: number;
}

export interface OnTimeTrend {
  period: string;
  onTimePercent: number;
  totalDeliveries: number;
}

export interface ModeVolume {
  mode: string;
  volume: number;
  percentage: number;
  cost: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  dateFrom: string = '';
  dateTo: string = '';
  selectedMode: string = 'all';
  selectedCarrier: string = 'all';

  laneCosts: LaneCost[] = [];
  carrierPerformance: CarrierPerformance[] = [];
  onTimeTrends: OnTimeTrend[] = [];
  modeVolumes: ModeVolume[] = [];

  filteredLaneCosts: LaneCost[] = [];
  filteredCarriers: CarrierPerformance[] = [];
  filteredTrends: OnTimeTrend[] = [];
  filteredModes: ModeVolume[] = [];

  modes: string[] = ['Truck', 'Rail', 'Air', 'Ocean', 'Intermodal'];
  carriers: string[] = ['All', 'XPO', 'J.B. Hunt', 'Schneider', 'FedEx Freight', 'UPS Freight'];

  constructor() {}

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadMockData();
    this.applyFilters();
  }

  setDefaultDates(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    this.dateFrom = thirtyDaysAgo.toISOString().split('T')[0];
    this.dateTo = today.toISOString().split('T')[0];
  }

  loadMockData(): void {
    this.laneCosts = [
      { lane: 'LAX-CHI', origin: 'Los Angeles, CA', destination: 'Chicago, IL', avgCost: 1850, totalCost: 92500, volume: 50, mode: 'Truck' },
      { lane: 'NYC-MIA', origin: 'New York, NY', destination: 'Miami, FL', avgCost: 2100, totalCost: 63000, volume: 30, mode: 'Truck' },
      { lane: 'SEA-DEN', origin: 'Seattle, WA', destination: 'Denver, CO', avgCost: 1450, totalCost: 43500, volume: 30, mode: 'Rail' },
      { lane: 'DAL-ATL', origin: 'Dallas, TX', destination: 'Atlanta, GA', avgCost: 1200, totalCost: 48000, volume: 40, mode: 'Truck' },
      { lane: 'ORD-LAX', origin: 'Chicago, IL', destination: 'Los Angeles, CA', avgCost: 1950, totalCost: 78000, volume: 40, mode: 'Air' },
      { lane: 'HOU-PHX', origin: 'Houston, TX', destination: 'Phoenix, AZ', avgCost: 980, totalCost: 29400, volume: 30, mode: 'Intermodal' },
      { lane: 'BOS-DC', origin: 'Boston, MA', destination: 'Washington, DC', avgCost: 750, totalCost: 22500, volume: 30, mode: 'Truck' },
      { lane: 'SFO-PDX', origin: 'San Francisco, CA', destination: 'Portland, OR', avgCost: 620, totalCost: 18600, volume: 30, mode: 'Truck' }
    ];

    this.carrierPerformance = [
      { carrier: 'XPO', onTimePercent: 94.2, avgCost: 1620, totalVolume: 245, claims: 3, score: 92 },
      { carrier: 'J.B. Hunt', onTimePercent: 96.8, avgCost: 1780, totalVolume: 312, claims: 1, score: 97 },
      { carrier: 'Schneider', onTimePercent: 91.5, avgCost: 1550, totalVolume: 198, claims: 5, score: 88 },
      { carrier: 'FedEx Freight', onTimePercent: 93.1, avgCost: 1890, totalVolume: 167, claims: 2, score: 90 },
      { carrier: 'UPS Freight', onTimePercent: 95.4, avgCost: 1720, totalVolume: 223, claims: 2, score: 94 }
    ];

    this.onTimeTrends = [
      { period: 'Week 1', onTimePercent: 91.2, totalDeliveries: 420 },
      { period: 'Week 2', onTimePercent: 92.8, totalDeliveries: 455 },
      { period: 'Week 3', onTimePercent: 94.1, totalDeliveries: 480 },
      { period: 'Week 4', onTimePercent: 93.5, totalDeliveries: 465 },
      { period: 'Week 5', onTimePercent: 95.2, totalDeliveries: 510 },
      { period: 'Week 6', onTimePercent: 94.8, totalDeliveries: 495 },
      { period: 'Week 7', onTimePercent: 96.1, totalDeliveries: 530 },
      { period: 'Week 8', onTimePercent: 95.7, totalDeliveries: 520 }
    ];

    this.modeVolumes = [
      { mode: 'Truck', volume: 1250, percentage: 52.1, cost: 1875000 },
      { mode: 'Rail', volume: 480, percentage: 20.0, cost: 432000 },
      { mode: 'Air', volume: 210, percentage: 8.75, cost: 735000 },
      { mode: 'Ocean', volume: 320, percentage: 13.3, cost: 256000 },
      { mode: 'Intermodal', volume: 140, percentage: 5.85, cost: 168000 }
    ];
  }

  applyFilters(): void {
    this.filteredLaneCosts = [...this.laneCosts];
    this.filteredCarriers = [...this.carrierPerformance];
    this.filteredTrends = [...this.onTimeTrends];
    this.filteredModes = [...this.modeVolumes];

    if (this.selectedMode !== 'all') {
      this.filteredLaneCosts = this.filteredLaneCosts.filter(l => l.mode === this.selectedMode);
    }
    if (this.selectedCarrier !== 'all' && this.selectedCarrier !== 'All') {
      this.filteredCarriers = this.filteredCarriers.filter(c => c.carrier === this.selectedCarrier);
    }
  }

  exportToCSV(type: 'lanes' | 'carriers' | 'trends' | 'modes'): void {
    let data: any[] = [];
    let filename = '';
    let headers: string[] = [];

    switch (type) {
      case 'lanes':
        data = this.filteredLaneCosts;
        filename = 'cost_per_lane.csv';
        headers = ['Lane', 'Origin', 'Destination', 'Avg Cost', 'Total Cost', 'Volume', 'Mode'];
        break;
      case 'carriers':
        data = this.filteredCarriers;
        filename = 'carrier_performance.csv';
        headers = ['Carrier', 'On-Time %', 'Avg Cost', 'Total Volume', 'Claims', 'Score'];
        break;
      case 'trends':
        data = this.filteredTrends;
        filename = 'on_time_trend.csv';
        headers = ['Period', 'On-Time %', 'Total Deliveries'];
        break;
      case 'modes':
        data = this.filteredModes;
        filename = 'volume_by_mode.csv';
        headers = ['Mode', 'Volume', 'Percentage', 'Cost'];
        break;
    }

    const csvContent = [
      headers.join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getScoreClass(score: number): string {
    if (score >= 95) return 'score-excellent';
    if (score >= 90) return 'score-good';
    if (score >= 85) return 'score-average';
    return 'score-poor';
  }

  getOnTimeClass(percent: number): string {
    if (percent >= 95) return 'ot-excellent';
    if (percent >= 92) return 'ot-good';
    if (percent >= 88) return 'ot-average';
    return 'ot-poor';
  }
}
