import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiClient } from '../api/api-client.service';
import { ExceptionItem } from '../models';

/** Exceptions microservice: /api/exceptions */
@Injectable({ providedIn: 'root' })
export class ExceptionService {
  private readonly api = inject(ApiClient);

  getExceptions(): Observable<ExceptionItem[]> {
    return this.api.list<ExceptionItem>('exceptions');
  }

  updateStatus(id: string, status: ExceptionItem['status']): Observable<ExceptionItem | undefined> {
    const path = `exceptions/${encodeURIComponent(id)}`;
    return this.api.get<ExceptionItem>(path).pipe(
      switchMap(item => this.api.put<ExceptionItem>(path, { ...item, status, lastUpdate: new Date().toISOString() }))
    );
  }
}
