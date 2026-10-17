import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
  imports: [CommonModule, BaseChartDirective, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  readonly lang = inject(LanguageService);

  private readonly translate = inject(TranslateService);

  kpiData = [
    { titleKey: 'kpiShipments', value: '1,248', changeKey: 'dashboard.changeVsDate', changeParams: { arrow: '↑', delta: '12.5%', date: '2024-05-19' }, changePositive: true, icon: 'truck', color: 'blue' },
    { titleKey: 'kpiOnTime', value: '92.6%', changeKey: 'dashboard.changeVsDate', changeParams: { arrow: '↑', delta: '3.4%', date: '2024-05-19' }, changePositive: true, icon: 'check', color: 'green' },
    { titleKey: 'kpiCost', value: '$2.45M', changeKey: 'dashboard.changeVsPeriod', changeParams: { arrow: '↓', delta: '5.7%' }, changePositive: false, icon: 'dollar', color: 'purple' },
    { titleKey: 'kpiExceptions', value: '27', changeKey: 'dashboard.changeVsDate', changeParams: { arrow: '↑', delta: '8', date: '2024-05-19' }, changePositive: false, icon: 'alert', color: 'orange' }
  ];

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
    { name: 'Other Carriers', nameKey: 'dashboard.otherCarriers', percentage: 8.5, color: '#64748b' }
  ];

  alertData = [
    { id: '1', titleKey: 'alertDelay', descKey: 'alertDelayDesc', timeKey: 'time.minAgo', n: 10, color: 'red' },
    { id: '2', titleKey: 'alertException', descKey: 'alertExceptionDesc', timeKey: 'time.minAgo', n: 35, color: 'orange' },
    { id: '3', titleKey: 'alertCost', descKey: 'alertCostDesc', timeKey: 'time.hoursAgo', n: 1, color: 'yellow' },
    { id: '4', titleKey: 'alertWeather', descKey: 'alertWeatherDesc', timeKey: 'time.hoursAgo', n: 2, color: 'blue' }
  ];


  mapMarkers = [
    { x: 20, y: 40, color: 'blue' }, { x: 25, y: 55, color: 'blue' },
    { x: 35, y: 45, color: 'green' }, { x: 45, y: 50, color: 'green' },
    { x: 55, y: 42, color: 'purple' }, { x: 60, y: 48, color: 'purple' },
    { x: 30, y: 60, color: 'orange' }, { x: 50, y: 58, color: 'orange' },
    { x: 40, y: 35, color: 'blue' }, { x: 65, y: 40, color: 'green' }
  ];

  constructor() {
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

  ngOnInit(): void {}
}
