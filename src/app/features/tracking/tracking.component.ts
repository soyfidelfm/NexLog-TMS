import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { camelKey } from '../../shared/i18n-keys';
import { CommonModule } from '@angular/common';
import { ShipmentService } from '../../core/services/shipment.service';
import { Shipment } from '../../core/models';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private readonly translate = inject(TranslateService);
  readonly statusKey = camelKey;

  /** 'Today 16:40' / 'Tomorrow 09:30' -> localized text. */
  etaText(eta: string): string {
    const [day, time] = eta.split(' ');
    return this.translate.instant(day === 'Tomorrow' ? 'tracking.tomorrow' : 'tracking.today', { time });
  }
  selected: Shipment | null = null;
  shipments: Shipment[] = [];

  ngOnInit(): void {
    this.shipmentService.getShipments().subscribe(data => {
      this.shipments = data;
      if (data.length > 0) {
        this.selected = data[0];
      }
    });
  }

  select(shipment: Shipment) {
    this.selected = shipment;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'In Transit': return 'bg-blue-500/20 text-blue-ink';
      case 'Out for Delivery': return 'bg-green-500/20 text-green-ink';
      case 'Delayed': return 'bg-orange-500/20 text-orange-ink';
      default: return 'bg-slate-500/20 text-muted';
    }
  }
}
