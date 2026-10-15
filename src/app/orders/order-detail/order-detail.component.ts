import { Component, signal } from '@angular/core';
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
  }[];
}

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  isEditing = signal(false);
  editForm: Partial<Order> = {};

  order = signal<Order>({
    id: 'ORD-240515-0897',
    status: 'in-transit',
    origin: {
      city: 'Los Angeles, CA, US',
      address: '1234 Industrial Way',
      zip: 'Los Angeles, CA 90001, US',
      date: 'May 16, 2024',
      window: '08:00 – 12:00'
    },
    destination: {
      city: 'Dallas, TX, US',
      address: '5678 Distribution Drive',
      zip: 'Dallas, TX 75201, US',
      date: 'May 17, 2024',
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
    estimatedArrival: 'May 17, 2024, 13:45',
    timeline: [
      { label: 'Order Created', date: 'May 15, 09:12', completed: true, current: false },
      { label: 'Pending Confirmation', date: 'May 15, 09:15', completed: true, current: false },
      { label: 'Confirmed', date: 'May 15, 11:47', completed: true, current: false },
      { label: 'In Transit', date: 'May 16, 08:30', completed: false, current: true },
      { label: 'Out for Delivery', date: 'May 17, Est. 14:00', completed: false, current: false },
      { label: 'Delivered', date: 'May 17, Est. 16:30', completed: false, current: false }
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
