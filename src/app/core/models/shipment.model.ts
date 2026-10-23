export type ShipmentStatus = 'In Transit' | 'Out for Delivery' | 'Delayed' | 'At Pickup';

export interface ShipmentAlert {
  type: 'warning' | 'info' | 'error';
  message: string;
}

export interface ShipmentTimelineItem {
  label: string;
  time: string;
  completed: boolean;
  current?: boolean | null;
}

export interface Shipment {
  id: string;
  orderNumber: string;
  origin: string;
  destination: string;
  driver: string;
  driverPhone: string;
  vehicle: string;
  eta: string;
  status: ShipmentStatus;
  progress: number;
  color: string;
  /** Real coordinates for the live position marker */
  lng: number;
  lat: number;
  /** Polyline of the route (lng, lat pairs) */
  route: [number, number][];
  alerts: ShipmentAlert[];
  timeline: ShipmentTimelineItem[];
}
