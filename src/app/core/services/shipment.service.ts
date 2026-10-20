import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiClient } from '../api/api-client.service';
import { Shipment } from '../models';

/** Tracking microservice: /api/shipments */
@Injectable({ providedIn: 'root' })
export class ShipmentService {
  private readonly api = inject(ApiClient);

  getShipments(): Observable<Shipment[]> {
    return this.api.list<Shipment>('shipments');
  }
}
