import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Shipment } from '../models';
import { SHIPMENTS } from '../../features/tracking/tracking.data';

/** Tracking: currently serves local mock with real coordinates for MapLibre.
 *  Switch back to ApiClient when the backend is ready.
 */
@Injectable({ providedIn: 'root' })
export class ShipmentService {
  getShipments(): Observable<Shipment[]> {
    return of(SHIPMENTS);
  }
}
