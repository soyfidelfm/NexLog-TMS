import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { LanguageService } from '../../core/language.service';

interface KPI {
  titleKey: string;
  value: string;
  changeKey: string;
  changePositive: boolean;
  icon: string;
  color: string;
}

interface Alert {
  id: string;
  titleKey: string;
  descKey: string;
  time: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  readonly lang = inject(LanguageService);

  kpiData = [
    { titleKey: 'kpiShipments', value: '1,248', change: '↑ 12.5% vs May 19, 2024', changePositive: true, icon: 'truck', color: 'blue' },
    { titleKey: 'kpiOnTime', value: '92.6%', change: '↑ 3.4% vs May 19, 2024', changePositive: true, icon: 'check', color: 'green' },
    { titleKey: 'kpiCost', value: '$2.45M', change: '↓ 5.7% vs Apr 20 – May 19', changePositive: false, icon: 'dollar', color: 'purple' },
    { titleKey: 'kpiExceptions', value: '27', change: '↑ 8 vs May 19, 2024', changePositive: false, icon: 'alert', color: 'orange' }
  ];

  kpis = computed(() => this.kpiData.map(k => ({
    ...k,
    title: (this.lang.t() as any)[k.titleKey]
  })));

  weeklyVolumeLabels = ['May 20', 'May 21', 'May 22', 'May 23', 'May 24', 'May 25', 'May 26'];
  weeklyVolumeData: ChartData<'line'> = {
    labels: this.weeklyVolumeLabels,
    datasets: [{
      data: [980, 1100, 950, 1200, 1742, 1150, 980],
      label: 'Shipments',
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointHoverRadius: 6
    }]
  };
  weeklyVolumeOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 2000, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    }
  };
  weeklyVolumeType: ChartType = 'line';

  carriers = [
    { name: 'Primary Freight', percentage: 38.4, color: '#3b82f6' },
    { name: 'FastLane Logistics', percentage: 24.7, color: '#22c55e' },
    { name: 'NorthStar Transport', percentage: 16.1, color: '#a855f7' },
    { name: 'Velocity Express', percentage: 12.3, color: '#f97316' },
    { name: 'Other Carriers', percentage: 8.5, color: '#64748b' }
  ];

  alertData = [
    { id: '1', titleKey: 'alertDelay', descKey: 'alertDelayDesc', time: '10 min ago', color: 'red' },
    { id: '2', titleKey: 'alertException', descKey: 'alertExceptionDesc', time: '35 min ago', color: 'orange' },
    { id: '3', titleKey: 'alertCost', descKey: 'alertCostDesc', time: '1h ago', color: 'yellow' },
    { id: '4', titleKey: 'alertWeather', descKey: 'alertWeatherDesc', time: '2h ago', color: 'blue' }
  ];

  alerts = computed(() => this.alertData.map(a => ({
    ...a,
    title: (this.lang.t() as any)[a.titleKey],
    description: (this.lang.t() as any)[a.descKey]
  })));

  mapMarkers = [
    { x: 20, y: 40, color: 'blue' }, { x: 25, y: 55, color: 'blue' },
    { x: 35, y: 45, color: 'green' }, { x: 45, y: 50, color: 'green' },
    { x: 55, y: 42, color: 'purple' }, { x: 60, y: 48, color: 'purple' },
    { x: 30, y: 60, color: 'orange' }, { x: 50, y: 58, color: 'orange' },
    { x: 40, y: 35, color: 'blue' }, { x: 65, y: 40, color: 'green' }
  ];

  ngOnInit(): void {}
}
