export type ShipmentStatus = 'In Transit' | 'Out for Delivery' | 'Delayed' | 'At Pickup';

export interface ShipmentAlert {
  type: 'warning' | 'info' | 'error';
  message: string;
}

export interface ShipmentTimelineItem {
  label: string;
  time: string;
  completed: boolean;
  current?: boolean;
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
  routePath: string;
  position: { x: number; y: number };
  alerts: ShipmentAlert[];
  timeline: ShipmentTimelineItem[];
}
