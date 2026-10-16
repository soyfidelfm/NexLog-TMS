#!/bin/bash
# generate-analytics-dashboard.sh
# Generates the Analytics Dashboard Angular component
# Usage: bash generate-analytics-dashboard.sh [target-directory]
# Default target: ./src/app/analytics

set -e

TARGET_DIR="${1:-./src/app/analytics}"
echo "Generating Analytics Dashboard component in: $TARGET_DIR"
mkdir -p "$TARGET_DIR"

# analytics.component.ts
cat > "$TARGET_DIR/analytics.component.ts" << 'ENDOFFILE'
import { Component, OnInit } from '@angular/core';

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
ENDOFFILE

# analytics.component.html
cat > "$TARGET_DIR/analytics.component.html" << 'ENDOFFILE'
<div class="analytics-dashboard">
  <!-- Header -->
  <div class="dashboard-header">
    <div class="header-left">
      <h1>Analytics Dashboard</h1>
      <p class="subtitle">Transportation performance, costs and volumes</p>
    </div>
    <div class="header-right">
      <button class="btn btn-primary" (click)="exportToCSV('lanes')">
        <span class="icon">↓</span> Export All
      </button>
    </div>
  </div>

  <!-- Filters -->
  <div class="filters-card">
    <div class="filters-row">
      <div class="filter-group">
        <label>Date From</label>
        <input type="date" [(ngModel)]="dateFrom" (change)="applyFilters()" class="form-control">
      </div>
      <div class="filter-group">
        <label>Date To</label>
        <input type="date" [(ngModel)]="dateTo" (change)="applyFilters()" class="form-control">
      </div>
      <div class="filter-group">
        <label>Mode</label>
        <select [(ngModel)]="selectedMode" (change)="applyFilters()" class="form-control">
          <option value="all">All Modes</option>
          <option *ngFor="let mode of modes" [value]="mode">{{ mode }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Carrier</label>
        <select [(ngModel)]="selectedCarrier" (change)="applyFilters()" class="form-control">
          <option value="all">All Carriers</option>
          <option *ngFor="let carrier of carriers" [value]="carrier">{{ carrier }}</option>
        </select>
      </div>
      <div class="filter-group filter-actions">
        <button class="btn btn-secondary" (click)="applyFilters()">Apply</button>
        <button class="btn btn-outline" (click)="setDefaultDates(); applyFilters()">Reset</button>
      </div>
    </div>
  </div>

  <!-- KPI Summary -->
  <div class="kpi-row">
    <div class="kpi-card">
      <div class="kpi-label">Total Spend</div>
      <div class="kpi-value">$3,466,500</div>
      <div class="kpi-trend positive">+4.2% vs prior</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">On-Time %</div>
      <div class="kpi-value">94.8%</div>
      <div class="kpi-trend positive">+1.3 pts</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Total Volume</div>
      <div class="kpi-value">2,400</div>
      <div class="kpi-trend">loads</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Avg Cost / Load</div>
      <div class="kpi-value">$1,444</div>
      <div class="kpi-trend negative">+2.1%</div>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div class="dashboard-grid">
    <!-- Cost per Lane -->
    <div class="card card-full">
      <div class="card-header">
        <h2>Cost per Lane</h2>
        <button class="btn btn-sm btn-outline" (click)="exportToCSV('lanes')">Export</button>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Lane</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Mode</th>
                <th class="text-right">Avg Cost</th>
                <th class="text-right">Total Cost</th>
                <th class="text-right">Volume</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let lane of filteredLaneCosts">
                <td class="lane-code">{{ lane.lane }}</td>
                <td>{{ lane.origin }}</td>
                <td>{{ lane.destination }}</td>
                <td><span class="mode-badge" [attr.data-mode]="lane.mode">{{ lane.mode }}</span></td>
                <td class="text-right">${{ lane.avgCost | number }}</td>
                <td class="text-right">${{ lane.totalCost | number }}</td>
                <td class="text-right">{{ lane.volume }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Carrier Performance -->
    <div class="card">
      <div class="card-header">
        <h2>Carrier Performance</h2>
        <button class="btn btn-sm btn-outline" (click)="exportToCSV('carriers')">Export</button>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Carrier</th>
                <th class="text-right">On-Time %</th>
                <th class="text-right">Avg Cost</th>
                <th class="text-right">Volume</th>
                <th class="text-right">Claims</th>
                <th class="text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let carrier of filteredCarriers">
                <td class="carrier-name">{{ carrier.carrier }}</td>
                <td class="text-right">
                  <span [class]="getOnTimeClass(carrier.onTimePercent)">{{ carrier.onTimePercent }}%</span>
                </td>
                <td class="text-right">${{ carrier.avgCost | number }}</td>
                <td class="text-right">{{ carrier.totalVolume }}</td>
                <td class="text-right">{{ carrier.claims }}</td>
                <td class="text-center">
                  <span class="score-badge" [class]="getScoreClass(carrier.score)">{{ carrier.score }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- On-Time Trend -->
    <div class="card">
      <div class="card-header">
        <h2>On-Time Delivery Trend</h2>
        <button class="btn btn-sm btn-outline" (click)="exportToCSV('trends')">Export</button>
      </div>
      <div class="card-body">
        <div class="trend-chart">
          <div class="trend-bars">
            <div class="trend-item" *ngFor="let trend of filteredTrends">
              <div class="trend-bar-container">
                <div class="trend-bar" [style.height.%]="trend.onTimePercent" [class]="getOnTimeClass(trend.onTimePercent)">
                  <span class="trend-value">{{ trend.onTimePercent }}%</span>
                </div>
              </div>
              <div class="trend-label">{{ trend.period }}</div>
              <div class="trend-deliveries">{{ trend.totalDeliveries }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Volume by Mode -->
    <div class="card">
      <div class="card-header">
        <h2>Volume by Mode</h2>
        <button class="btn btn-sm btn-outline" (click)="exportToCSV('modes')">Export</button>
      </div>
      <div class="card-body">
        <div class="mode-list">
          <div class="mode-item" *ngFor="let mode of filteredModes">
            <div class="mode-info">
              <span class="mode-name">{{ mode.mode }}</span>
              <span class="mode-percent">{{ mode.percentage }}%</span>
            </div>
            <div class="mode-bar-container">
              <div class="mode-bar" [style.width.%]="mode.percentage" [attr.data-mode]="mode.mode"></div>
            </div>
            <div class="mode-stats">
              <span>{{ mode.volume }} loads</span>
              <span>${{ mode.cost | number }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
ENDOFFILE

# analytics.component.scss
cat > "$TARGET_DIR/analytics.component.scss" << 'ENDOFFILE'
// Analytics Dashboard SCSS
// Modern logistics / YMS style

.analytics-dashboard {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #1e293b;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
  }

  .subtitle {
    margin: 4px 0 0;
    color: #64748b;
    font-size: 14px;
  }
}

.filters-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 160px;

  label {
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.filter-actions {
  flex-direction: row;
  gap: 8px;
  align-items: center;
}

.form-control {
  height: 40px;
  padding: 0 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  color: #1e293b;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  &.btn-primary {
    background: #3b82f6;
    color: #fff;

    &:hover {
      background: #2563eb;
    }
  }

  &.btn-secondary {
    background: #64748b;
    color: #fff;

    &:hover {
      background: #475569;
    }
  }

  &.btn-outline {
    background: transparent;
    border: 1px solid #cbd5e1;
    color: #475569;

    &:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
    }
  }

  &.btn-sm {
    height: 32px;
    padding: 0 12px;
    font-size: 12px;
  }

  .icon {
    font-size: 16px;
  }
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.kpi-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;

  .kpi-label {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .kpi-value {
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.2;
  }

  .kpi-trend {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 500;

    &.positive {
      color: #16a34a;
    }

    &.negative {
      color: #dc2626;
    }
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;

  &.card-full {
    grid-column: 1 / -1;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;

  h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
  }
}

.card-body {
  padding: 16px 20px;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    text-align: left;
    padding: 10px 12px;
    background: #f8fafc;
    color: #475569;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    border-bottom: 1px solid #e2e8f0;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }

  tr:hover td {
    background: #f8fafc;
  }

  .text-right {
    text-align: right;
  }

  .text-center {
    text-align: center;
  }
}

.lane-code {
  font-weight: 600;
  color: #3b82f6;
  font-family: 'SF Mono', Consolas, monospace;
}

.carrier-name {
  font-weight: 600;
}

.mode-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: #e0e7ff;
  color: #3730a3;

  &[data-mode="Truck"] { background: #dbeafe; color: #1d4ed8; }
  &[data-mode="Rail"] { background: #fef3c7; color: #b45309; }
  &[data-mode="Air"] { background: #fce7f3; color: #be185d; }
  &[data-mode="Ocean"] { background: #ccfbf1; color: #0f766e; }
  &[data-mode="Intermodal"] { background: #e0e7ff; color: #4338ca; }
}

.score-badge {
  display: inline-block;
  min-width: 36px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 12px;

  &.score-excellent { background: #dcfce7; color: #166534; }
  &.score-good { background: #dbeafe; color: #1e40af; }
  &.score-average { background: #fef9c3; color: #854d0e; }
  &.score-poor { background: #fee2e2; color: #991b1b; }
}

.ot-excellent { color: #16a34a; font-weight: 600; }
.ot-good { color: #2563eb; font-weight: 600; }
.ot-average { color: #d97706; font-weight: 600; }
.ot-poor { color: #dc2626; font-weight: 600; }

// Trend chart
.trend-chart {
  padding: 8px 0;
}

.trend-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 180px;
  gap: 8px;
}

.trend-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.trend-bar-container {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.trend-bar {
  width: 70%;
  min-height: 20px;
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 4px;
  position: relative;
  transition: height 0.3s ease;

  &.ot-excellent { background: #22c55e; }
  &.ot-good { background: #3b82f6; }
  &.ot-average { background: #f59e0b; }
  &.ot-poor { background: #ef4444; }

  .trend-value {
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    white-space: nowrap;
  }
}

.trend-label {
  margin-top: 8px;
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

.trend-deliveries {
  font-size: 10px;
  color: #94a3b8;
}

// Mode volume
.mode-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mode-item {
  .mode-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 500;
  }

  .mode-percent {
    color: #3b82f6;
    font-weight: 600;
  }
}

.mode-bar-container {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 4px;
}

.mode-bar {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;

  &[data-mode="Truck"] { background: #3b82f6; }
  &[data-mode="Rail"] { background: #f59e0b; }
  &[data-mode="Air"] { background: #ec4899; }
  &[data-mode="Ocean"] { background: #14b8a6; }
  &[data-mode="Intermodal"] { background: #8b5cf6; }
}

.mode-stats {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #64748b;
}

// Responsive
@media (max-width: 1200px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .analytics-dashboard {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 12px;
  }

  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }

  .kpi-row {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    flex-direction: column;
  }
}
ENDOFFILE

echo ""
echo "✅ Analytics Dashboard component generated successfully!"
echo ""
echo "Files created in: $TARGET_DIR"
echo "  - analytics.component.ts"
echo "  - analytics.component.html"
echo "  - analytics.component.scss"
echo ""
echo "Next steps:"
echo "1. Declare AnalyticsComponent in your module"
echo "2. Add the route:"
echo "   { path: 'analytics', component: AnalyticsComponent, title: 'Analytics' }"
echo "3. Make sure FormsModule is imported for ngModel"
echo "4. Add a navigation link to /analytics"
echo ""
