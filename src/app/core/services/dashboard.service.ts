import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiClient } from '../api/api-client.service';
import { Alert, KPI } from '../models';

/** Dashboard microservice: /api/dashboard/kpis, /api/dashboard/alerts (text stays as i18n keys). */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly api = inject(ApiClient);

  getKpis(): Observable<KPI[]> {
    return this.api.list<KPI>('dashboard/kpis');
  }

  getAlerts(): Observable<Alert[]> {
    return this.api.list<Alert>('dashboard/alerts');
  }
}
