export interface CarrierQuote {
  id: string;
  carrier: string;
  logo?: string | null;
  price: number;
  currency: string;
  transitDays: number;
  serviceType: string;
  onTimePercent: number;
  rating: number;
  fuelSurcharge: number;
  total: number;
  notes?: string | null;
}

export interface QuoteRequest {
  originCity: string;
  originZip: string;
  destinationCity: string;
  destinationZip: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  pieces: number;
  commodity: string;
  pickupDate: string;
  serviceLevel: string;
}
