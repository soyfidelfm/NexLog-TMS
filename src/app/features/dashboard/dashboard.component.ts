import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ThemeService } from '../../core/services/theme.service';

interface KPI {
  title: string;
  value: string;
  change: string;
  changePositive: boolean;
  icon: string;
  color: string;
  sparkline?: number[];
}

interface Alert {
  id: string;
  type: 'delay' | 'exception' | 'cost' | 'weather';
  title: string;
  description: string;
  time: string;
  icon: string;
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
  themeService = inject(ThemeService);

  kpis: KPI[] = [
    {
      title: 'Total Shipments Today',
      value: '1,248',
      change: '↑ 12.5% vs May 19, 2024',
      changePositive: true,
      icon: 'truck',
      color: 'blue',
      sparkline: [980, 1050, 1100, 1150, 1200, 1248]
    },
    {
      title: 'On-Time Delivery %',
      value: '92.6%',
      change: '↑ 3.4% vs May 19, 2024',
      changePositive: true,
      icon: 'check',
      color: 'green',
      sparkline: [88, 89, 90, 91, 92, 92.6]
    },
    {
      title: 'Freight Cost This Month',
      value: '$2.45M',
      change: '↓ 5.7% vs Apr 20 – May 19',
      changePositive: false,
      icon: 'dollar',
      color: 'purple',
      sparkline: [2.8, 2.7, 2.6, 2.5, 2.48, 2.45]
    },
    {
      title: 'Active Exceptions',
      value: '27',
      change: '↑ 8 vs May 19, 2024',
      changePositive: false,
      icon: 'alert',
      color: 'orange',
      sparkline: [15, 18, 20, 22, 25, 27]
    }
  ];

  weeklyVolumeLabels = ['May 20', 'May 21', 'May 22', 'May 23', 'May 24', 'May 25', 'May 26'];
  weeklyVolumeData: ChartData<'line'> = {
    labels: this.weeklyVolumeLabels,
    datasets: [
      {
        data: [980, 1100, 950, 1200, 1742, 1150, 980],
        label: 'Shipments',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverRadius: 6
      }
    ]
  };
  weeklyVolumeOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y?.toLocaleString() ?? 0} Shipments`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 2000,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
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

  alerts: Alert[] = [
    {
      id: '1',
      type: 'delay',
      title: 'Delay: Shipment #SHP0048912',
      description: 'Houston, TX → Phoenix, AZ • 2h 15m delay',
      time: '10 min ago',
      icon: 'alert-triangle',
      color: 'red'
    },
    {
      id: '2',
      type: 'exception',
      title: 'Carrier Exception: SHP0048876',
      description: 'Equipment issue reported',
      time: '35 min ago',
      icon: 'alert-circle',
      color: 'orange'
    },
    {
      id: '3',
      type: 'cost',
      title: 'High Freight Cost Alert',
      description: 'Route #RT-2093 above budget by 18%',
      time: '1h ago',
      icon: 'dollar-sign',
      color: 'yellow'
    },
    {
      id: '4',
      type: 'weather',
      title: 'Weather Advisory: Southeast',
      description: 'Storms expected to impact delivery',
      time: '2h ago',
      icon: 'cloud-rain',
      color: 'blue'
    }
  ];

  mapMarkers = [
    { x: 20, y: 40, color: 'blue', status: 'In Transit' },
    { x: 25, y: 55, color: 'blue', status: 'In Transit' },
    { x: 35, y: 45, color: 'green', status: 'Out for Delivery' },
    { x: 45, y: 50, color: 'green', status: 'Out for Delivery' },
    { x: 55, y: 42, color: 'purple', status: 'Delayed' },
    { x: 60, y: 48, color: 'purple', status: 'Delayed' },
    { x: 30, y: 60, color: 'orange', status: 'At Origin' },
    { x: 50, y: 58, color: 'orange', status: 'At Origin' },
    { x: 40, y: 35, color: 'blue', status: 'In Transit' },
    { x: 65, y: 40, color: 'green', status: 'Out for Delivery' }
  ];

  ngOnInit(): void {}
}
