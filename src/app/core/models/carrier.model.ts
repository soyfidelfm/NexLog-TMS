export type CarrierStatus = 'Active' | 'Inactive' | 'Pending';

export interface Carrier {
  id: string;
  name: string;
  code: string;
  status: CarrierStatus;
  onTimePercent: number;
  claimsRate: number;
  rating: number;
  totalLoads: number;
  mcNumber: string;
  dotNumber: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  equipment: string[];
  notes: string;
}
