import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order, OrderDetail, PlanningOrder } from '../models';
import { ORDERS, ORDER_DETAILS } from '../../features/orders/orders.data';

/** Orders: currently serves local mock data so the UI works without the backend.
 *  Switch back to ApiClient when the API is ready.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  getOrders(): Observable<Order[]> {
    return of(ORDERS);
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return of(ORDERS.find((o) => o.id === id));
  }

  getOrderDetail(id: string): Observable<OrderDetail> {
    const detail = ORDER_DETAILS[id];
    if (detail) return of(detail);
    // Fallback: synthesize a minimal detail from the list item so the screen always opens
    const list = ORDERS.find((o) => o.id === id);
    return of({
      id,
      status: 'confirmed',
      origin: {
        city: list?.origin.city ?? 'Dallas',
        address: 'Main Depot',
        zip: '75202',
        date: new Date().toISOString(),
        window: '08:00 – 12:00',
      },
      destination: {
        city: list?.destination.city ?? 'Austin',
        address: 'Customer Site',
        zip: '78701',
        date: new Date().toISOString(),
        window: '14:00 – 18:00',
      },
      weightLbs: list?.weight ?? 1000,
      weightKg: Math.round((list?.weight ?? 1000) * 0.453),
      dimensions: { lengthFt: 4, widthFt: 4, heightFt: 4, lengthM: 1.2, widthM: 1.2, heightM: 1.2 },
      productType: 'General Merchandise Class 50',
      specialRequirements: [],
      routeDistanceMi: 200,
      routeDistanceKm: 320,
      transitTime: '1d',
      estimatedArrival: list?.eta ?? new Date().toISOString(),
      timeline: [
        { label: 'orderDetail.timeline.created', date: new Date().toISOString(), completed: true, current: false },
        { label: 'orderDetail.timeline.confirmed', date: new Date().toISOString(), completed: true, current: true },
        { label: 'orderDetail.timeline.inTransit', date: new Date().toISOString(), completed: false, current: false, estimated: true },
        { label: 'orderDetail.timeline.delivered', date: new Date().toISOString(), completed: false, current: false, estimated: true },
      ],
    });
  }

  getUnassignedOrders(): Observable<PlanningOrder[]> {
    return of([]);
  }
}
