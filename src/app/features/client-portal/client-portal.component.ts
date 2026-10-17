import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/language.service';
import { camelKey } from '../../shared/i18n-keys';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'Pending' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  progress: number;
  eta: string;
  documents: { name: string; type: string }[];
}

@Component({
  selector: 'app-client-portal',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule],
  templateUrl: './client-portal.component.html',
  styleUrl: './client-portal.component.scss'
})
export class ClientPortalComponent {
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  readonly statusKey = camelKey;
  searchTerm = '';

  shipments: Shipment[] = [
    {
      id: 'SHP-10482',
      trackingNumber: 'NL-2026-10482',
      origin: 'Los Angeles, CA',
      destination: 'Dallas, TX',
      status: 'In Transit',
      progress: 65,
      eta: '2026-10-18',
      documents: [
        { name: 'BOL', type: 'pdf' },
        { name: 'Invoice', type: 'pdf' }
      ]
    },
    {
      id: 'SHP-10491',
      trackingNumber: 'NL-2026-10491',
      origin: 'Chicago, IL',
      destination: 'Atlanta, GA',
      status: 'Out for Delivery',
      progress: 88,
      eta: '2026-10-16',
      documents: [
        { name: 'BOL', type: 'pdf' },
        { name: 'POD', type: 'pdf' },
        { name: 'Invoice', type: 'pdf' }
      ]
    },
    {
      id: 'SHP-10503',
      trackingNumber: 'NL-2026-10503',
      origin: 'Houston, TX',
      destination: 'Phoenix, AZ',
      status: 'Delivered',
      progress: 100,
      eta: '2026-10-14',
      documents: [
        { name: 'BOL', type: 'pdf' },
        { name: 'POD', type: 'pdf' },
        { name: 'Invoice', type: 'pdf' }
      ]
    },
    {
      id: 'SHP-10517',
      trackingNumber: 'NL-2026-10517',
      origin: 'Seattle, WA',
      destination: 'Denver, CO',
      status: 'Picked Up',
      progress: 25,
      eta: '2026-10-20',
      documents: [
        { name: 'BOL', type: 'pdf' }
      ]
    },
    {
      id: 'SHP-10528',
      trackingNumber: 'NL-2026-10528',
      origin: 'Miami, FL',
      destination: 'New York, NY',
      status: 'Pending',
      progress: 8,
      eta: '2026-10-22',
      documents: []
    }
  ];

  get filteredShipments(): Shipment[] {
    if (!this.searchTerm.trim()) return this.shipments;
    const term = this.searchTerm.toLowerCase();
    return this.shipments.filter(s =>
      s.trackingNumber.toLowerCase().includes(term) ||
      s.origin.toLowerCase().includes(term) ||
      s.destination.toLowerCase().includes(term) ||
      s.status.toLowerCase().includes(term)
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered': return 'status-delivered';
      case 'Out for Delivery': return 'status-out';
      case 'In Transit': return 'status-transit';
      case 'Picked Up': return 'status-picked';
      default: return 'status-pending';
    }
  }

  downloadDocuments(shipment: Shipment): void {
    if (shipment.documents.length === 0) {
      alert(this.translate.instant('clientPortal.noDocs'));
      return;
    }
    const names = shipment.documents.map(d => this.translate.instant('clientPortal.doc.' + d.name)).join(', ');
    alert(this.translate.instant('clientPortal.downloading', { id: shipment.trackingNumber, names }));
    // TODO: Replace with real download logic (FileService, etc.)
  }
}
