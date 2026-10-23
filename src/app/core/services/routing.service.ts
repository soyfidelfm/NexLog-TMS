import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/** Free public OSRM demo server (for development). In production use a self-hosted or paid instance. */
const OSRM = 'https://router.project-osrm.org/route/v1/driving';

export interface OsrmRoute {
  coordinates: [number, number][];
  distanceMeters: number;
  durationSeconds: number;
}

@Injectable({ providedIn: 'root' })
export class RoutingService {
  private http = inject(HttpClient);

  /**
   * Get the real driving route between one or more points.
   * Falls back to a straight line if the request fails.
   */
  getRoute(points: [number, number][]): Observable<OsrmRoute> {
    if (points.length < 2) {
      return of({ coordinates: points, distanceMeters: 0, durationSeconds: 0 });
    }
    const coords = points.map((p) => `${p[0]},${p[1]}`).join(';');
    const url = `${OSRM}/${coords}?overview=full&geometries=geojson&steps=false`;
    return this.http.get<any>(url).pipe(
      map((res) => {
        const route = res?.routes?.[0];
        if (!route?.geometry?.coordinates) throw new Error('no geometry');
        return {
          coordinates: route.geometry.coordinates as [number, number][],
          distanceMeters: route.distance ?? 0,
          durationSeconds: route.duration ?? 0,
        };
      }),
      catchError(() =>
        of({
          coordinates: points,
          distanceMeters: 0,
          durationSeconds: 0,
        }),
      ),
    );
  }
}
