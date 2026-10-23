export type DocumentType = 'BOL' | 'POD' | 'Invoice' | 'Other';
export type DocumentStatus = 'Uploaded' | 'Pending' | 'Signed' | 'Approved';

export interface DocumentItem {
  id: string;
  type: DocumentType;
  name: string;
  status: DocumentStatus;
  uploadedAt: string;
  size: string;
  icon: string;
  /** Linked load / order (API sends null when not linked). */
  loadId?: string | null;
  orderId?: string | null;
}

export interface EpodData {
  id?: string;
  loadId?: string | null;
  signature: string;
  photoUrl: string;
  gpsLat: number;
  gpsLng: number;
  address: string;
  deliveredAt: string;
  signedBy: string;
  notes?: string;
}
