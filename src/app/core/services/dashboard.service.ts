import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { KPI, Alert } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private mockKpis: KPI[] = [
    { titleKey: 'kpiShipments', value: '1,248', changeKey: 'dashboard.changeVsDate', changeParams: { arrow: '↑', delta: '12.5%', date: '2024-05-19' }, changePositive: true, icon: 'truck', color: 'blue', sparkline: [980, 1050, 1100, 1150, 1200, 1248] },
    { titleKey: 'kpiOnTime', value: '92.6%', changeKey: 'dashboard.changeVsDate', changeParams: { arrow: '↑', delta: '3.4%', date: '2024-05-19' }, changePositive: true, icon: 'check', color: 'green', sparkline: [88, 89, 90, 91, 92, 92.6] },
    { titleKey: 'kpiCost', value: '$2.45M', changeKey: 'dashboard.changeVsPeriod', changeParams: { arrow: '↓', delta: '5.7%' }, changePositive: false, icon: 'dollar', color: 'purple', sparkline: [2.8, 2.7, 2.6, 2.5, 2.48, 2.45] },
    { titleKey: 'kpiExceptions', value: '27', changeKey: 'dashboard.changeVsDate', changeParams: { arrow: '↑', delta: '8', date: '2024-05-19' }, changePositive: false, icon: 'alert', color: 'orange', sparkline: [15, 18, 20, 22, 25, 27] }
  ];

  private mockAlerts: Alert[] = [
    { id: '1', type: 'delay', titleKey: 'alertDelay', descKey: 'alertDelayDesc', timeKey: 'time.minAgo', n: 10, icon: 'alert-triangle', color: 'red' },
    { id: '2', type: 'exception', titleKey: 'alertException', descKey: 'alertExceptionDesc', timeKey: 'time.minAgo', n: 35, icon: 'alert-circle', color: 'orange' },
    { id: '3', type: 'cost', titleKey: 'alertCost', descKey: 'alertCostDesc', timeKey: 'time.hoursAgo', n: 1, icon: 'dollar-sign', color: 'yellow' },
    { id: '4', type: 'weather', titleKey: 'alertWeather', descKey: 'alertWeatherDesc', timeKey: 'time.hoursAgo', n: 2, icon: 'cloud-rain', color: 'blue' }
  ];

  getKpis(): Observable<KPI[]> {
    return of(this.mockKpis);
  }

  getAlerts(): Observable<Alert[]> {
    return of(this.mockAlerts);
  }
}
