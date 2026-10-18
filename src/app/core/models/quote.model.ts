export interface CarrierQuote {
  id: string;
  carrier: string;
  logo?: string;
  price: number;
  currency: string;
  transitDays: number;
  serviceType: string;
  onTimePercent: number;
  rating: number;
  fuelSurcharge: number;
  total: number;
  notes?: string;
}
