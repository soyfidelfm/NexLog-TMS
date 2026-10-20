import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiClient } from '../api/api-client.service';
import { Carrier } from '../models';

/** Carriers microservice: /api/carriers */
@Injectable({ providedIn: 'root' })
export class CarrierService {
  private readonly api = inject(ApiClient);

  getCarriers(): Observable<Carrier[]> {
    return this.api.list<Carrier>('carriers');
  }

  getCarrierById(id: string): Observable<Carrier | undefined> {
    return this.api.find<Carrier>(`carriers/${encodeURIComponent(id)}`);
  }

  createCarrier(carrier: Partial<Carrier>): Observable<Carrier> {
    // The API requires every field; fill defaults for the ones the form doesn't collect. id is generated server-side.
    const body: Omit<Carrier, 'id'> = {
      name: '', code: '', status: 'Pending', onTimePercent: 0, claimsRate: 0, rating: 0, totalLoads: 0,
      mcNumber: '', dotNumber: '', contact: '', phone: '', email: '', city: '', state: '', equipment: [], notes: '',
      ...Object.fromEntries(Object.entries(carrier).filter(([, v]) => v !== null && v !== undefined)),
    } as Omit<Carrier, 'id'>;
    return this.api.post<Carrier>('carriers', body);
  }
}
