import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../core/language.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../core/services/analytics.service';
import { LaneCost, CarrierPerformance, OnTimeTrend, ModeVolume } from '../core/models';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule, DecimalPipe],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);
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

  ngOnInit(): void {
    this.setDefaultDates();
    this.analyticsService.getAnalytics().subscribe(data => {
      this.laneCosts = data.laneCosts;
      this.carrierPerformance = data.carrierPerformance;
      this.onTimeTrends = data.onTimeTrends;
      this.modeVolumes = data.modeVolumes;
      this.applyFilters();
    });
  }

  setDefaultDates(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    this.dateFrom = thirtyDaysAgo.toISOString().split('T')[0];
    this.dateTo = today.toISOString().split('T')[0];
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
        headers = ['analytics.csv.lane', 'analytics.csv.origin', 'analytics.csv.destination', 'analytics.csv.avgCost', 'analytics.csv.totalCost', 'analytics.csv.volume', 'analytics.csv.mode'].map(k => this.translate.instant(k));
        break;
      case 'carriers':
        data = this.filteredCarriers;
        filename = 'carrier_performance.csv';
        headers = ['analytics.csv.carrier', 'analytics.csv.onTime', 'analytics.csv.avgCost', 'analytics.csv.totalVolume', 'analytics.csv.claims', 'analytics.csv.score'].map(k => this.translate.instant(k));
        break;
      case 'trends':
        data = this.filteredTrends;
        filename = 'on_time_trend.csv';
        headers = ['analytics.csv.period', 'analytics.csv.onTime', 'analytics.csv.totalDeliveries'].map(k => this.translate.instant(k));
        break;
      case 'modes':
        data = this.filteredModes;
        filename = 'volume_by_mode.csv';
        headers = ['analytics.csv.mode', 'analytics.csv.volume', 'analytics.csv.percentage', 'analytics.csv.cost'].map(k => this.translate.instant(k));
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
