import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DocumentItem, EpodData } from '../models';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private mockDocuments: DocumentItem[] = [
    {
      id: 'DOC-001',
      type: 'BOL',
      name: 'Bill of Lading - SHP-0048912.pdf',
      status: 'Uploaded',
      uploadedAt: '2026-10-14 09:15',
      size: '248 KB',
      icon: 'file-text'
    },
    {
      id: 'DOC-002',
      type: 'POD',
      name: 'Electronic Proof of Delivery',
      status: 'Signed',
      uploadedAt: '2026-10-15 14:32',
      size: '1.2 MB',
      icon: 'check-circle'
    },
    {
      id: 'DOC-003',
      type: 'Invoice',
      name: 'Factura Freight - INV-78921.pdf',
      status: 'Approved',
      uploadedAt: '2026-10-15 16:45',
      size: '186 KB',
      icon: 'receipt'
    },
    {
      id: 'DOC-004',
      type: 'Invoice',
      name: 'Factura Accessorial - INV-78922.pdf',
      status: 'Pending',
      uploadedAt: '2026-10-15 17:10',
      size: '92 KB',
      icon: 'receipt'
    }
  ];

  private mockEpod: EpodData = {
    signature: '',
    photoUrl: '',
    gpsLat: 34.0522,
    gpsLng: -118.2437,
    address: '1234 Delivery St, Los Angeles, CA 90001',
    deliveredAt: '2026-10-15 14:28',
    signedBy: 'John Martinez',
    notes: 'Delivered in good condition. Left at front door as requested.'
  };

  getDocuments(shipmentId?: string): Observable<DocumentItem[]> {
    return of(this.mockDocuments);
  }

  getEpod(shipmentId?: string): Observable<EpodData> {
    return of(this.mockEpod);
  }
}
