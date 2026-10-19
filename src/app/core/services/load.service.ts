import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Load, Trailer } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoadService {
  private readonly baseUrl = environment.apiUrl;

  private mockLoads: Load[] = [
    {
      id: 'LD-2026-0842',
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      weight: 24500,
      volume: 1280,
      pickupDate: '2026-10-17',
      status: 'Pending',
      selectedCarrier: 'Swift Transportation',
      cascadeCount: 0,
    },
    {
      id: 'LD-2026-0845',
      origin: 'San Diego, CA',
      destination: 'Las Vegas, NV',
      weight: 18200,
      volume: 960,
      pickupDate: '2026-10-16',
      status: 'Accepted',
      selectedCarrier: 'Knight-Swift',
      tenderedAt: '2026-10-15 14:22',
      cascadeCount: 1,
    },
    {
      id: 'LD-2026-0848',
      origin: 'Irvine, CA',
      destination: 'Salt Lake City, UT',
      weight: 31000,
      volume: 1650,
      pickupDate: '2026-10-18',
      status: 'Rejected',
      selectedCarrier: 'Schneider',
      cascadeCount: 2,
    },
    {
      id: 'LD-2026-0851',
      origin: 'Fresno, CA',
      destination: 'Denver, CO',
      weight: 27800,
      volume: 1420,
      pickupDate: '2026-10-17',
      status: 'Pending',
      selectedCarrier: null,
      cascadeCount: 0,
    },
    {
      id: 'LD-2026-0854',
      origin: 'Los Angeles, CA',
      destination: 'Tucson, AZ',
      weight: 19500,
      volume: 1100,
      pickupDate: '2026-10-16',
      status: 'Pending',
      selectedCarrier: 'Werner Enterprises',
      cascadeCount: 0,
    },
    {
      id: 'LD-2026-0857',
      origin: 'San Bernardino, CA',
      destination: 'Albuquerque, NM',
      weight: 33400,
      volume: 1780,
      pickupDate: '2026-10-19',
      status: 'Accepted',
      selectedCarrier: 'J.B. Hunt',
      tenderedAt: '2026-10-15 09:15',
      cascadeCount: 0,
    },
  ];

  private mockTrailers: Trailer[] = [
    {
      id: 'TRL-01',
      name: 'Trailer 01',
      type: 'Dry Van 53\'',
      maxWeight: 45000,
      maxVolume: 3800,
      assigned: [
        { id: 'ORD-1038', customer: 'Pacific Steel', origin: 'Long Beach, CA', destination: 'Phoenix, AZ', weight: 18500, volume: 980, priority: 'High' },
        { id: 'ORD-1040', customer: 'Valley Produce', origin: 'Fresno, CA', destination: 'Tucson, AZ', weight: 9200, volume: 640, priority: 'Medium' },
      ],
    },
    {
      id: 'TRL-02',
      name: 'Trailer 02',
      type: 'Dry Van 53\'',
      maxWeight: 45000,
      maxVolume: 3800,
      assigned: [
        { id: 'ORD-1035', customer: 'WestCoast Logistics', origin: 'Los Angeles, CA', destination: 'Las Vegas, NV', weight: 12400, volume: 720, priority: 'Medium' },
      ],
    },
    {
      id: 'TRL-03',
      name: 'Trailer 03',
      type: 'Reefer 53\'',
      maxWeight: 42000,
      maxVolume: 3400,
      assigned: [],
    },
    {
      id: 'TRL-04',
      name: 'Trailer 04',
      type: 'Dry Van 48\'',
      maxWeight: 40000,
      maxVolume: 3200,
      assigned: [
        { id: 'ORD-1031', customer: 'Mountain Goods', origin: 'San Bernardino, CA', destination: 'Salt Lake City, UT', weight: 7800, volume: 410, priority: 'Low' },
      ],
    },
  ];

  getLoads(): Observable<Load[]> {
    // TODO: return this.http.get<Load[]>(`${this.baseUrl}/loads`);
    return of(this.mockLoads);
  }

  getTrailers(): Observable<Trailer[]> {
    return of(this.mockTrailers);
  }

  updateLoad(updated: Load): Observable<Load> {
    // TODO: return this.http.put<Load>(`${this.baseUrl}/loads/${updated.id}`, updated);
    const idx = this.mockLoads.findIndex(l => l.id === updated.id);
    if (idx >= 0) this.mockLoads[idx] = updated;
    return of(updated);
  }

  tender(loadId: string, carrier?: string): Observable<Load> {
    // TODO: return this.http.post<Load>(`${this.baseUrl}/loads/${loadId}/tender`, { carrier });
    const load = this.mockLoads.find(l => l.id === loadId);
    if (load) {
      load.status = 'Pending';
      load.selectedCarrier = carrier || load.selectedCarrier || 'Prime Inc';
      load.tenderedAt = new Date().toISOString();
    }
    return of(load!);
  }

  cascade(loadId: string): Observable<Load> {
    // TODO: return this.http.post<Load>(`${this.baseUrl}/loads/${loadId}/cascade`, {});
    const carriers = ['Swift Transportation', 'Knight-Swift', 'Schneider', 'Werner Enterprises', 'J.B. Hunt', 'Prime Inc'];
    const load = this.mockLoads.find(l => l.id === loadId);
    if (load) {
      const nextIndex = (load.cascadeCount + 1) % carriers.length;
      load.status = 'Pending';
      load.selectedCarrier = carriers[nextIndex];
      load.cascadeCount++;
      load.tenderedAt = new Date().toISOString();
    }
    return of(load!);
  }

  reassign(loadId: string, carrier: string): Observable<Load> {
    // TODO: return this.http.post<Load>(`${this.baseUrl}/loads/${loadId}/reassign`, { carrier });
    const load = this.mockLoads.find(l => l.id === loadId);
    if (load) {
      load.selectedCarrier = carrier;
      load.status = 'Pending';
      load.cascadeCount = 0;
    }
    return of(load!);
  }
}
