import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiClient } from '../api/api-client.service';
import { Order, OrderDetail, PlanningOrder } from '../models';

/** Orders microservice (via gateway): /api/orders, /api/order-details. Planning orders live in Loads: /api/planning-orders. */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = inject(ApiClient);

  getOrders(): Observable<Order[]> {
    return this.api.list<Order>('orders');
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return this.api.find<Order>(`orders/${encodeURIComponent(id)}`);
  }

  getOrderDetail(id: string): Observable<OrderDetail> {
    return this.api.find<OrderDetail>(`order-details/${encodeURIComponent(id)}`) as Observable<OrderDetail>;
  }

  getUnassignedOrders(): Observable<PlanningOrder[]> {
    return this.api.list<PlanningOrder>('planning-orders');
  }
}
