import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiClient } from '../api/api-client.service';
import { forkJoin, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { RateTable, RolePermission } from '../models';

type RoleRow = RolePermission & { id?: string };

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

  /** PUT when the rate exists, POST (create) on 404. */
  saveRateTable(rate: RateTable): Observable<RateTable> {
    return this.api.put<RateTable>(`rate-tables/${encodeURIComponent(rate.id)}`, rate).pipe(
      catchError((err: HttpErrorResponse) => err.status === 404 ? this.api.post<RateTable>('rate-tables', rate) : Promise.reject(err))
    );
  }

  savePermissions(roles: RolePermission[]): Observable<RolePermission[]> {
    if (!roles.length) return of([]);
    return forkJoin(roles.map((r: RoleRow) => {
      const id = r.id ?? r.role.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return this.api.put<RolePermission>(`role-permissions/${encodeURIComponent(id)}`, { ...r, id });
    }));
  }
}
