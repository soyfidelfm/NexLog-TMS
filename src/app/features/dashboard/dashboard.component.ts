import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { LanguageService } from '../../core/language.service';
import { ThemeService } from '../../core/theme.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { KPI, Alert } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  readonly lang = inject(LanguageService);
  private readonly theme = inject(ThemeService);
  private readonly translate = inject(TranslateService);

  kpiData: KPI[] = [];
  alertData: Alert[] = [];

  private readonly weekDays = ['2024-05-20', '2024-05-21', '2024-05-22', '2024-05-23', '2024-05-24', '2024-05-25', '2024-05-26'];
  weeklyVolumeData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      data: [980, 1100, 950, 1200, 1742, 1150, 980],
      label: '',
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointHoverRadius: 6
    }]
  };
  weeklyVolumeOptions: ChartConfiguration['options'] = this.buildChartOptions(true);

  /** Axis/grid colors follow the active theme (dark values are the original ones). */
  private buildChartOptions(dark: boolean): ChartConfiguration['options'] {
    const grid = dark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.06)';
    const ticks = dark ? '#94a3b8' : '#56657a';
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 2000, grid: { color: grid }, ticks: { color: ticks } },
        x: { grid: { display: false }, ticks: { color: ticks } }
      }
    };
  }
  weeklyVolumeType: ChartType = 'line';

  carriers = [
    { name: 'Primary Freight', percentage: 38.4, color: '#3b82f6' },
    { name: 'FastLane Logistics', percentage: 24.7, color: '#22c55e' },
    { name: 'NorthStar Transport', percentage: 16.1, color: '#a855f7' },
    { name: 'Velocity Express', percentage: 12.3, color: '#f97316' },
    { name: 'Other Carriers', nameKey: 'dashboard.otherCarriers', percentage: 8.5, color: '#64748b' }
  ];

  mapMarkers = [
    { x: 20, y: 40, color: 'blue' }, { x: 25, y: 55, color: 'blue' },
    { x: 35, y: 45, color: 'green' }, { x: 45, y: 50, color: 'green' },
    { x: 55, y: 42, color: 'purple' }, { x: 60, y: 48, color: 'purple' },
    { x: 30, y: 60, color: 'orange' }, { x: 50, y: 58, color: 'orange' },
    { x: 40, y: 35, color: 'blue' }, { x: 65, y: 40, color: 'green' }
  ];

  constructor() {
    // Recolor the chart when the theme changes.
    effect(() => {
      this.weeklyVolumeOptions = this.buildChartOptions(this.theme.isDark());
    });
    // Rebuild chart labels whenever the language changes.
    effect(() => {
      const locale = this.lang.locale();
      this.lang.lang();
      this.translate.get('dashboard.shipments').subscribe(label => {
        this.weeklyVolumeData = {
          ...this.weeklyVolumeData,
          labels: this.weekDays.map(d => formatDate(d, 'MMM d', locale)),
          datasets: [{ ...this.weeklyVolumeData.datasets[0], label }]
        };
      });
    });
  }

  ngOnInit(): void {
    this.dashboardService.getKpis().subscribe(data => {
      this.kpiData = data;
    });
    this.dashboardService.getAlerts().subscribe(data => {
      this.alertData = data;
    });
  }
}
