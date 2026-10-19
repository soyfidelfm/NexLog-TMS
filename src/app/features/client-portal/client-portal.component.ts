import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/language.service';
import { camelKey } from '../../shared/i18n-keys';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientPortalService } from '../../core/services/client-portal.service';
import { PortalShipment } from '../../core/models';

@Component({
  selector: 'app-client-portal',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule],
  templateUrl: './client-portal.component.html',
  styleUrl: './client-portal.component.scss'
})
export class ClientPortalComponent implements OnInit {
  private clientPortalService = inject(ClientPortalService);
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  readonly statusKey = camelKey;
  searchTerm = '';

  shipments: PortalShipment[] = [];

  ngOnInit(): void {
    this.clientPortalService.getShipments().subscribe(data => {
      this.shipments = data;
    });
  }

  get filteredShipments(): PortalShipment[] {
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

  downloadDocuments(shipment: PortalShipment): void {
    if (shipment.documents.length === 0) {
      alert(this.translate.instant('clientPortal.noDocs'));
      return;
    }
    const names = shipment.documents.map(d => this.translate.instant('clientPortal.doc.' + d.name)).join(', ');
    alert(this.translate.instant('clientPortal.downloading', { id: shipment.trackingNumber, names }));
  }
}
