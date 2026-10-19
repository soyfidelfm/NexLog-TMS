export interface PortalDocument {
  name: string;
  type: string;
}

export interface PortalShipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'Pending' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  progress: number;
  eta: string;
  documents: PortalDocument[];
}
