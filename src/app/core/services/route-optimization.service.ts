import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OptRoute, RouteSummary } from '../models';
import { ROUTES, SUMMARY } from '../../features/route-optimization/route-optimization.data';

/** RouteOptimization: currently serves local mock with real coordinates for MapLibre demo.
 *  Switch back to ApiClient when the backend is ready.
 */
@Injectable({ providedIn: 'root' })
export class RouteOptimizationService {
  getRoutes(): Observable<OptRoute[]> {
    return of(ROUTES);
  }

  getSummary(): Observable<RouteSummary> {
    return of(SUMMARY);
  }
}
