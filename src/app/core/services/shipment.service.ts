import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Shipment } from '../models';

@Injectable({ providedIn: 'root' })
export class ShipmentService {
  private mockShipments: Shipment[] = [
    {
      id: 'SHP-48291',
      orderNumber: 'ORD-100234',
      origin: 'Oxnard, CA',
      destination: 'Phoenix, AZ',
      driver: 'Carlos Méndez',
      driverPhone: '+1 (805) 555-0142',
      vehicle: 'Truck 247 • Volvo VNL',
      eta: 'Today 16:40',
      status: 'In Transit',
      progress: 68,
      color: '#3b82f6',
      routePath: 'M 70 280 L 150 220 L 240 190 L 330 150 L 420 130',
      position: { x: 330, y: 150 },
      alerts: [{ type: 'warning', message: 'Traffic congestion near Blythe (+18 min)' }],
      timeline: [
        { label: 'Order Created', time: '08:15', completed: true },
        { label: 'Picked Up', time: '09:40', completed: true },
        { label: 'In Transit', time: '10:05', completed: true, current: true },
        { label: 'Out for Delivery', time: '—', completed: false },
        { label: 'Delivered', time: '—', completed: false }
      ]
    },
    {
      id: 'SHP-48295',
      orderNumber: 'ORD-100241',
      origin: 'Los Angeles, CA',
      destination: 'Las Vegas, NV',
      driver: 'Ana Rodríguez',
      driverPhone: '+1 (213) 555-0198',
      vehicle: 'Truck 112 • Freightliner',
      eta: 'Today 18:15',
      status: 'Out for Delivery',
      progress: 89,
      color: '#22c55e',
      routePath: 'M 90 320 L 170 290 L 260 260 L 350 230 L 440 200',
      position: { x: 350, y: 230 },
      alerts: [],
      timeline: [
        { label: 'Order Created', time: '07:30', completed: true },
        { label: 'Picked Up', time: '08:55', completed: true },
        { label: 'In Transit', time: '09:20', completed: true },
        { label: 'Out for Delivery', time: '15:10', completed: true, current: true },
        { label: 'Delivered', time: '—', completed: false }
      ]
    },
    {
      id: 'SHP-48302',
      orderNumber: 'ORD-100258',
      origin: 'San Diego, CA',
      destination: 'Tucson, AZ',
      driver: 'Miguel Torres',
      driverPhone: '+1 (619) 555-0177',
      vehicle: 'Truck 089 • Kenworth',
      eta: 'Tomorrow 09:30',
      status: 'Delayed',
      progress: 42,
      color: '#f97316',
      routePath: 'M 110 380 L 190 350 L 280 330 L 360 300',
      position: { x: 280, y: 330 },
      alerts: [{ type: 'error', message: 'Mechanical issue reported • ETA delayed +2h' }],
      timeline: [
        { label: 'Order Created', time: '09:10', completed: true },
        { label: 'Picked Up', time: '11:00', completed: true },
        { label: 'In Transit', time: '11:30', completed: true, current: true },
        { label: 'Out for Delivery', time: '—', completed: false },
        { label: 'Delivered', time: '—', completed: false }
      ]
    }
  ];

  getShipments(): Observable<Shipment[]> {
    return of(this.mockShipments);
  }
}
