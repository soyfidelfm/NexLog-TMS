import { PlanningOrder } from './order.model';

export type TenderStatus = 'Pending' | 'Accepted' | 'Rejected';

export interface Load {
  id: string;
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  pickupDate: string;
  status: TenderStatus;
  selectedCarrier: string | null;
  tenderedAt?: string;
  cascadeCount: number;
}

export interface Trailer {
  id: string;
  name: string;
  type: string;
  maxWeight: number;
  maxVolume: number;
  assigned: PlanningOrder[];
}
