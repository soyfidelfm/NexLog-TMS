import { Component, OnInit, inject, effect, signal, computed } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { LanguageService } from '../../core/language.service';
import { ThemeService } from '../../core/theme.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ShipmentService } from '../../core/services/shipment.service';
import { KPI, Alert, Shipment } from '../../core/models';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, TranslatePipe, NgxMapLibreGLModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private shipmentService = inject(ShipmentService);
  readonly lang = inject(LanguageService);
  private readonly theme = inject(ThemeService);
  private readonly translate = inject(TranslateService);

  kpiData = signal<KPI[]>([]);
  alertData = signal<Alert[]>([]);
  liveShipments = signal<Shipment[]>([]);

  mapStyle = computed(() =>
    this.theme.isDark()
      ? 'https://tiles.openfreemap.org/styles/dark'
      : 'https://tiles.openfreemap.org/styles/liberty',
  );

  private readonly weekDays = ['2024-05-20', '2024-05-21', '2024-05-22', '2024-05-23', '2024-05-24', '2024-05-25', '2024-05-26'];
  weeklyVolumeData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [980, 1100, 950, 1200, 1742, 1150, 980],
        label: '',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
    ],
  };
  weeklyVolumeOptions: ChartConfiguration['options'] = this.buildChartOptions(true);

  private buildChartOptions(dark: boolean): ChartConfiguration['options'] {
    const grid = dark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.06)';
    const ticks = dark ? '#94a3b8' : '#56657a';
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 2000, grid: { color: grid }, ticks: { color: ticks } },
        x: { grid: { display: false }, ticks: { color: ticks } },
      },
    };
  }
  weeklyVolumeType: ChartType = 'line';

  carriers = [
    { name: 'Primary Freight', percentage: 38.4, color: '#3b82f6' },
    { name: 'FastLane Logistics', percentage: 24.7, color: '#22c55e' },
    { name: 'NorthStar Transport', percentage: 16.1, color: '#a855f7' },
    { name: 'Velocity Express', percentage: 12.3, color: '#f97316' },
    { name: 'Other Carriers', nameKey: 'dashboard.otherCarriers', percentage: 8.5, color: '#64748b' },
  ];

  constructor() {
    effect(() => {
      this.weeklyVolumeOptions = this.buildChartOptions(this.theme.isDark());
    });
    effect(() => {
      const locale = this.lang.locale();
      this.lang.lang();
      this.translate.get('dashboard.shipments').subscribe((label) => {
        this.weeklyVolumeData = {
          ...this.weeklyVolumeData,
          labels: this.weekDays.map((d) => formatDate(d, 'MMM d', locale)),
          datasets: [{ ...this.weeklyVolumeData.datasets[0], label }],
        };
      });
    });
  }

  ngOnInit(): void {
    this.dashboardService.getKpis().subscribe((data) => this.kpiData.set(data));
    this.dashboardService.getAlerts().subscribe((data) => this.alertData.set(data));
    this.shipmentService.getShipments().subscribe((data) => this.liveShipments.set(data));
  }

  onMapLoad(map: maplibregl.Map) {
    const list = this.liveShipments();
    if (!list.length) return;
    const coords = list.map((s) => [s.lng, s.lat] as [number, number]);
    const bounds = coords.reduce((b, c) => b.extend(c), new maplibregl.LngLatBounds(coords[0], coords[0]));
    map.fitBounds(bounds, { padding: 40, duration: 600 });
  }
}
