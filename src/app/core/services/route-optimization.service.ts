import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiClient } from '../api/api-client.service';
import { OptRoute, RouteSummary } from '../models';

/** RouteOptimization microservice: /api/routes, /api/routes/summary */
@Injectable({ providedIn: 'root' })
export class RouteOptimizationService {
  private readonly api = inject(ApiClient);

  getRoutes(): Observable<OptRoute[]> {
    return this.api.list<OptRoute>('routes');
  }

  getSummary(): Observable<RouteSummary> {
    return this.api.get<RouteSummary>('routes/summary');
  }
}
