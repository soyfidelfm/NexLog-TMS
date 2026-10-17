import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, signal } from '@angular/core';
import { LanguageService } from '../../core/language.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Order {
  id: string;
  status: 'order-created' | 'pending-confirmation' | 'confirmed' | 'in-transit' | 'out-for-delivery' | 'delivered';
  origin: {
    city: string;
    address: string;
    zip: string;
    date: string;
    window: string;
  };
  destination: {
    city: string;
    address: string;
    zip: string;
    date: string;
    window: string;
  };
  weightLbs: number;
  weightKg: number;
  dimensions: {
    lengthFt: number;
    widthFt: number;
    heightFt: number;
    lengthM: number;
    widthM: number;
    heightM: number;
  };
  productType: string;
  specialRequirements: string[];
  routeDistanceMi: number;
  routeDistanceKm: number;
  transitTime: string;
  estimatedArrival: string;
  timeline: {
    label: string;
    date: string;
    completed: boolean;
    current: boolean;
    estimated?: boolean;
  }[];
}

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  readonly lang = inject(LanguageService);
  /** Raw requirement values stay in English (data); display goes through translation keys. */
  readonly allRequirements = ['Liftgate Required', 'Temperature Sensitive', 'Stackable', 'Residential Delivery'];
  readonly reqKey: Record<string, string> = {
    'Liftgate Required': 'orderDetail.req.liftgate',
    'Temperature Sensitive': 'orderDetail.req.temp',
    'Stackable': 'orderDetail.req.stackable',
    'Residential Delivery': 'orderDetail.req.residential',
  };
  private readonly productKeys: Record<string, string> = { 'General Merchandise Class 50': 'orderDetail.product.general50' };
  /** Known product types are translated; user-entered text is shown as-is. */
  productKey(v: string): string { return this.productKeys[v] ?? v; }
  isEditing = signal(false);
  editForm: Partial<Order> = {};

  order = signal<Order>({
    id: 'ORD-240515-0897',
    status: 'in-transit',
    origin: {
      city: 'Los Angeles, CA, US',
      address: '1234 Industrial Way',
      zip: 'Los Angeles, CA 90001, US',
      date: '2024-05-16',
      window: '08:00 – 12:00'
    },
    destination: {
      city: 'Dallas, TX, US',
      address: '5678 Distribution Drive',
      zip: 'Dallas, TX 75201, US',
      date: '2024-05-17',
      window: '10:00 – 14:00'
    },
    weightLbs: 18750,
    weightKg: 8504,
    dimensions: {
      lengthFt: 53,
      widthFt: 8.5,
      heightFt: 9.5,
      lengthM: 16.17,
      widthM: 2.59,
      heightM: 2.90
    },
    productType: 'General Merchandise Class 50',
    specialRequirements: ['Liftgate Required', 'Temperature Sensitive', 'Stackable', 'Residential Delivery'],
    routeDistanceMi: 1438.6,
    routeDistanceKm: 2314.8,
    transitTime: '1d 22h 15m',
    estimatedArrival: '2024-05-17T13:45',
    timeline: [
      { label: 'orderDetail.timeline.created', date: '2024-05-15T09:12', completed: true, current: false },
      { label: 'orderDetail.timeline.pending', date: '2024-05-15T09:15', completed: true, current: false },
      { label: 'orderDetail.timeline.confirmed', date: '2024-05-15T11:47', completed: true, current: false },
      { label: 'orderDetail.timeline.inTransit', date: '2024-05-16T08:30', completed: false, current: true },
      { label: 'orderDetail.timeline.outForDelivery', date: '2024-05-17T14:00', completed: false, current: false, estimated: true },
      { label: 'orderDetail.timeline.delivered', date: '2024-05-17T16:30', completed: false, current: false, estimated: true }
    ]
  });

  toggleEdit() {
    if (this.isEditing()) {
      this.cancelEdit();
    } else {
      this.editForm = structuredClone(this.order());
      this.isEditing.set(true);
    }
  }

  save() {
    if (this.editForm) {
      this.order.update(current => ({ ...current, ...this.editForm }));
    }
    this.isEditing.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editForm = {};
  }

  toggleRequirement(req: string) {
    if (!this.editForm.specialRequirements) this.editForm.specialRequirements = [];
    const index = this.editForm.specialRequirements.indexOf(req);
    if (index > -1) {
      this.editForm.specialRequirements.splice(index, 1);
    } else {
      this.editForm.specialRequirements.push(req);
    }
  }
}
