export interface OrderOriginDest {
  city: string;
  country: string;
  flag: string;
}

export type OrderListStatus = 'Delivered' | 'In Transit' | 'Picked Up' | 'Booked' | 'Delayed';
export type Priority = 'Low' | 'Medium' | 'High';

export interface Order {
  id: string;
  origin: OrderOriginDest;
  destination: OrderOriginDest;
  weight: number;
  volume: number;
  status: OrderListStatus;
  carrier: string;
  eta: string;
  priority: Priority;
}

export interface OrderDetailOrigin {
  city: string;
  address: string;
  zip: string;
  date: string;
  window: string;
}

export type OrderDetailStatus =
  | 'order-created'
  | 'pending-confirmation'
  | 'confirmed'
  | 'in-transit'
  | 'out-for-delivery'
  | 'delivered';

export interface OrderDetail {
  id: string;
  status: OrderDetailStatus;
  origin: OrderDetailOrigin;
  destination: OrderDetailOrigin;
  weightLbs: number;
  weightKg: number;
  dimensions: {
    lengthFt: number;
    widthFt: number;
    heightFt: number;
    lengthM: number;
    widthM: number;
    heightM: number;
  };
  productType: string;
  specialRequirements: string[];
  routeDistanceMi: number;
  routeDistanceKm: number;
  transitTime: string;
  estimatedArrival: string;
  timeline: {
    label: string;
    date: string;
    completed: boolean;
    current: boolean;
    estimated?: boolean;
  }[];
}

export interface PlanningOrder {
  id: string;
  customer: string;
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  priority: Priority;
}
