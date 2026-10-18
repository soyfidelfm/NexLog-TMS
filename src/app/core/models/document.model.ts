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
}

export interface EpodData {
  signature: string;
  photoUrl: string;
  gpsLat: number;
  gpsLng: number;
  address: string;
  deliveredAt: string;
  signedBy: string;
  notes?: string;
}
