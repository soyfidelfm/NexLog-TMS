import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiClient } from '../api/api-client.service';
import { forkJoin, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { RateTable, RolePermission } from '../models';


/** RateTables microservice: /api/rate-tables, /api/role-permissions */
@Injectable({ providedIn: 'root' })
export class RateTableService {
  private readonly api = inject(ApiClient);

  getRateTables(): Observable<RateTable[]> {
    return this.api.list<RateTable>('rate-tables');
  }

  getRoles(): Observable<RolePermission[]> {
    return this.api.list<RolePermission>('role-permissions');
  }

  /**
   * New rate (`isNew`): POST without an id so the API assigns one (a client-made id could collide with an
   * existing rate and, with the old PUT-first flow, silently overwrite it).
   * Existing rate: PUT, falling back to POST on 404.
   */
  saveRateTable(rate: RateTable, isNew = false): Observable<RateTable> {
    if (isNew) {
      const { id: _id, ...body } = rate;
      return this.api.post<RateTable>('rate-tables', body);
    }
    return this.api.put<RateTable>(`rate-tables/${encodeURIComponent(rate.id)}`, rate).pipe(
      catchError((err: HttpErrorResponse) => err.status === 404 ? this.api.post<RateTable>('rate-tables', rate) : Promise.reject(err))
    );
  }

  savePermissions(roles: RolePermission[]): Observable<RolePermission[]> {
    if (!roles.length) return of([]);
    return forkJoin(roles.map(r => {
      const id = r.id ?? r.role.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return this.api.put<RolePermission>(`role-permissions/${encodeURIComponent(id)}`, { ...r, id });
    }));
  }
}
