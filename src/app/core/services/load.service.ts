import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiClient } from '../api/api-client.service';
import { Load, Trailer } from '../models';

const CASCADE_CARRIERS = ['Swift Transportation', 'Knight-Swift', 'Schneider', 'Werner Enterprises', 'J.B. Hunt', 'Prime Inc'];

/** Loads microservice: /api/loads, /api/trailers (tender actions are applied with GET + PUT on the load). */
@Injectable({ providedIn: 'root' })
export class LoadService {
  private readonly api = inject(ApiClient);

  getLoads(): Observable<Load[]> {
    return this.api.list<Load>('loads');
  }

  getTrailers(): Observable<Trailer[]> {
    return this.api.list<Trailer>('trailers');
  }

  updateLoad(updated: Load): Observable<Load> {
    return this.api.put<Load>(`loads/${encodeURIComponent(updated.id)}`, updated);
  }

  tender(loadId: string, carrier?: string): Observable<Load> {
    return this.patch(loadId, l => ({
      ...l, status: 'Pending', selectedCarrier: carrier || l.selectedCarrier || 'Prime Inc', tenderedAt: new Date().toISOString(),
    }));
  }

  cascade(loadId: string): Observable<Load> {
    return this.patch(loadId, l => ({
      ...l, status: 'Pending', selectedCarrier: CASCADE_CARRIERS[(l.cascadeCount + 1) % CASCADE_CARRIERS.length],
      cascadeCount: l.cascadeCount + 1, tenderedAt: new Date().toISOString(),
    }));
  }

  reassign(loadId: string, carrier: string): Observable<Load> {
    return this.patch(loadId, l => ({ ...l, selectedCarrier: carrier, status: 'Pending', cascadeCount: 0 }));
  }

  private patch(id: string, change: (l: Load) => Load): Observable<Load> {
    return this.api.get<Load>(`loads/${encodeURIComponent(id)}`).pipe(switchMap(l => this.updateLoad(change(l))));
  }
}
