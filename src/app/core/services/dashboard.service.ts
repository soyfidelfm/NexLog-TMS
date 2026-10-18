import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { KPI, Alert } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private mockKpis: KPI[] = [
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

  private mockAlerts: Alert[] = [
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

  getKpis(): Observable<KPI[]> {
    return of(this.mockKpis);
  }

  getAlerts(): Observable<Alert[]> {
    return of(this.mockAlerts);
  }
}
