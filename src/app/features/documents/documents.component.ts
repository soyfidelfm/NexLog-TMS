import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface DocumentItem {
  id: string;
  type: 'BOL' | 'POD' | 'Invoice' | 'Other';
  name: string;
  status: 'Uploaded' | 'Pending' | 'Signed' | 'Approved';
  uploadedAt: string;
  size: string;
  icon: string;
}

interface EpodData {
  signature: string;
  photoUrl: string;
  gpsLat: number;
  gpsLng: number;
  address: string;
  deliveredAt: string;
  signedBy: string;
  notes?: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent {
  shipmentId = 'SHP-0048912';
  shipmentStatus = 'Delivered';

  documents: DocumentItem[] = [
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

  selectedDocument: DocumentItem | null = null;
  showEpodPreview = true;

  epod: EpodData = {
    signature: '',
    photoUrl: '',
    gpsLat: 34.0522,
    gpsLng: -118.2437,
    address: '1234 Delivery St, Los Angeles, CA 90001',
    deliveredAt: '2026-10-15 14:28',
    signedBy: 'John Martinez',
    notes: 'Delivered in good condition. Left at front door as requested.'
  };

  selectDocument(doc: DocumentItem): void {
    this.selectedDocument = doc;
    this.showEpodPreview = doc.type === 'POD';
  }

  viewDocument(doc: DocumentItem): void {
    this.selectDocument(doc);
    console.log('Viewing', doc.name);
  }

  downloadDocument(doc: DocumentItem): void {
    console.log('Downloading', doc.name);
  }
}
