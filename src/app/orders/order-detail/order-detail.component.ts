import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, signal, OnInit } from '@angular/core';
import { LanguageService } from '../../core/language.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { OrderDetail } from '../../core/models';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
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
  editForm: Partial<OrderDetail> = {};

  order = signal<OrderDetail | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || 'ORD-240515-0897';
    this.orderService.getOrderDetail(id).subscribe(data => {
      this.order.set(data);
    });
  }

  toggleEdit() {
    if (this.isEditing()) {
      this.cancelEdit();
    } else {
      this.editForm = structuredClone(this.order() || {} as OrderDetail);
      this.isEditing.set(true);
    }
  }

  save() {
    if (this.editForm) {
      this.order.update(current => ({ ...current!, ...this.editForm }));
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
