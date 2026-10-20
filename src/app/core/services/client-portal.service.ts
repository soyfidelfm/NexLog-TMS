import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiClient } from '../api/api-client.service';
import { PortalShipment } from '../models';

/** ClientPortal microservice: /api/portal/shipments */
@Injectable({ providedIn: 'root' })
export class ClientPortalService {
  private readonly api = inject(ApiClient);

  getShipments(): Observable<PortalShipment[]> {
    return this.api.list<PortalShipment>('portal/shipments');
  }
}
