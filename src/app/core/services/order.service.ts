import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order, OrderDetail, PlanningOrder } from '../models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private mockOrders: Order[] = [
    {
      id: 'ORD-2025-00125',
      origin: { city: 'Shanghai', country: 'CN', flag: '🇨🇳' },
      destination: { city: 'Rotterdam', country: 'NL', flag: '🇳🇱' },
      weight: 12500,
      volume: 45.2,
      status: 'Delivered',
      carrier: 'Maersk Line',
      eta: 'May 18, 2025 10:30 AM',
      priority: 'Low'
    },
    {
      id: 'ORD-2025-00124',
      origin: { city: 'Hamburg', country: 'DE', flag: '🇩🇪' },
      destination: { city: 'Atlanta', country: 'US', flag: '🇺🇸' },
      weight: 8750,
      volume: 32.1,
      status: 'In Transit',
      carrier: 'Hapag-Lloyd',
      eta: 'May 23, 2025 02:15 PM',
      priority: 'Medium'
    },
    {
      id: 'ORD-2025-00123',
      origin: { city: 'Busan', country: 'KR', flag: '🇰🇷' },
      destination: { city: 'Los Angeles', country: 'US', flag: '🇺🇸' },
      weight: 15300,
      volume: 60.8,
      status: 'Picked Up',
      carrier: 'MSC',
      eta: 'May 22, 2025 08:00 AM',
      priority: 'High'
    },
    {
      id: 'ORD-2025-00122',
      origin: { city: 'Dubai', country: 'AE', flag: '🇦🇪' },
      destination: { city: 'Singapore', country: 'SG', flag: '🇸🇬' },
      weight: 6200,
      volume: 21.7,
      status: 'Booked',
      carrier: 'CMA CGM',
      eta: 'May 27, 2025 11:45 AM',
      priority: 'Medium'
    },
    {
      id: 'ORD-2025-00121',
      origin: { city: 'Rotterdam', country: 'NL', flag: '🇳🇱' },
      destination: { city: 'New York', country: 'US', flag: '🇺🇸' },
      weight: 9100,
      volume: 38.4,
      status: 'Delayed',
      carrier: 'OOCL',
      eta: 'May 20, 2025 04:30 PM',
      priority: 'High'
    },
    {
      id: 'ORD-2025-00120',
      origin: { city: 'Tokyo', country: 'JP', flag: '🇯🇵' },
      destination: { city: 'Sydney', country: 'AU', flag: '🇦🇺' },
      weight: 7400,
      volume: 28.9,
      status: 'In Transit',
      carrier: 'Evergreen',
      eta: 'May 24, 2025 09:20 AM',
      priority: 'Low'
    },
    {
      id: 'ORD-2025-00119',
      origin: { city: 'Ningbo', country: 'CN', flag: '🇨🇳' },
      destination: { city: 'Felixstowe', country: 'GB', flag: '🇬🇧' },
      weight: 11200,
      volume: 47.3,
      status: 'In Transit',
      carrier: 'COSCO Shipping',
      eta: 'May 25, 2025 01:10 PM',
      priority: 'Medium'
    }
  ];

  private mockOrderDetail: OrderDetail = {
    id: 'ORD-240515-0897',
    status: 'in-transit',
    origin: {
      city: 'Los Angeles, CA, US',
      address: '1234 Industrial Way',
      zip: 'Los Angeles, CA 90001, US',
      date: 'May 16, 2024',
      window: '08:00 – 12:00'
    },
    destination: {
      city: 'Dallas, TX, US',
      address: '5678 Distribution Drive',
      zip: 'Dallas, TX 75201, US',
      date: 'May 17, 2024',
      window: '10:00 – 14:00'
    },
    weightLbs: 18750,
    weightKg: 8504,
    dimensions: {
      lengthFt: 53,
      widthFt: 8.5,
      heightFt: 9.5,
      lengthM: 16.17,
      widthM: 2.59,
      heightM: 2.90
    },
    productType: 'General Merchandise Class 50',
    specialRequirements: ['Liftgate Required', 'Temperature Sensitive', 'Stackable', 'Residential Delivery'],
    routeDistanceMi: 1438.6,
    routeDistanceKm: 2314.8,
    transitTime: '1d 22h 15m',
    estimatedArrival: 'May 17, 2024, 13:45',
    timeline: [
      { label: 'Order Created', date: 'May 15, 09:12', completed: true, current: false },
      { label: 'Pending Confirmation', date: 'May 15, 09:15', completed: true, current: false },
      { label: 'Confirmed', date: 'May 15, 11:47', completed: true, current: false },
      { label: 'In Transit', date: 'May 16, 08:30', completed: false, current: true },
      { label: 'Out for Delivery', date: 'May 17, Est. 14:00', completed: false, current: false },
      { label: 'Delivered', date: 'May 17, Est. 16:30', completed: false, current: false }
    ]
  };

  private mockPlanningOrders: PlanningOrder[] = [
    { id: 'ORD-1042', customer: 'Acme Corp', origin: 'Los Angeles, CA', destination: 'Phoenix, AZ', weight: 4200, volume: 180, priority: 'High' },
    { id: 'ORD-1045', customer: 'Global Foods', origin: 'San Diego, CA', destination: 'Las Vegas, NV', weight: 2800, volume: 220, priority: 'Medium' },
    { id: 'ORD-1048', customer: 'TechParts Inc', origin: 'Irvine, CA', destination: 'Salt Lake City, UT', weight: 1500, volume: 90, priority: 'Low' },
    { id: 'ORD-1051', customer: 'BuildRight', origin: 'Los Angeles, CA', destination: 'Denver, CO', weight: 6100, volume: 310, priority: 'High' },
    { id: 'ORD-1053', customer: 'FreshMart', origin: 'Bakersfield, CA', destination: 'Phoenix, AZ', weight: 3400, volume: 260, priority: 'Medium' },
    { id: 'ORD-1057', customer: 'AutoSupply', origin: 'Ontario, CA', destination: 'Albuquerque, NM', weight: 2200, volume: 140, priority: 'Low' },
  ];

  getOrders(): Observable<Order[]> {
    return of(this.mockOrders);
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return of(this.mockOrders.find(o => o.id === id));
  }

  getOrderDetail(id: string): Observable<OrderDetail> {
    return of(this.mockOrderDetail);
  }

  getUnassignedOrders(): Observable<PlanningOrder[]> {
    return of(this.mockPlanningOrders);
  }
}
