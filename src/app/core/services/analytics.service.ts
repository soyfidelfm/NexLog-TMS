import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiClient } from '../api/api-client.service';
import { AnalyticsData } from '../models';

/** Analytics microservice: GET /api/analytics (aggregated AnalyticsData). */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly api = inject(ApiClient);

  getAnalytics(): Observable<AnalyticsData> {
    return this.api.get<AnalyticsData>('analytics');
  }
}
