import { Component, OnInit, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/language.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  readonly lang = inject(LanguageService);

  readonly statusKey: Record<Order['status'], string> = {
    'Delivered': 'status.delivered', 'In Transit': 'status.inTransit', 'Picked Up': 'status.pickedUp', 'Booked': 'status.booked', 'Delayed': 'status.delayed'
  };
  readonly priorityKey: Record<Order['priority'], string> = { Low: 'priority.low', Medium: 'priority.medium', High: 'priority.high' };

  searchQuery = '';
  currentPage = 1;
  rowsPerPage = 10;
  totalOrders = 248;

  orders: Order[] = [];

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(data => {
      this.orders = data;
    });
  }

  get filteredOrders() {
    if (!this.searchQuery) return this.orders;
    const q = this.searchQuery.toLowerCase();
    return this.orders.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.origin.city.toLowerCase().includes(q) ||
      o.destination.city.toLowerCase().includes(q) ||
      o.carrier.toLowerCase().includes(q)
    );
  }

  get paginatedOrders() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredOrders.slice(start, start + this.rowsPerPage);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered': return 'bg-green-500/20 text-green-ink border-green-500/30';
      case 'In Transit': return 'bg-blue-500/20 text-blue-ink border-blue-500/30';
      case 'Picked Up': return 'bg-purple-500/20 text-purple-ink border-purple-500/30';
      case 'Booked': return 'bg-yellow-500/20 text-yellow-ink border-yellow-500/30';
      case 'Delayed': return 'bg-red-500/20 text-red-ink border-red-500/30';
      default: return 'bg-slate-500/20 text-muted';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Low': return 'bg-green-500/20 text-green-ink border-green-500/30';
      case 'Medium': return 'bg-blue-500/20 text-blue-ink border-blue-500/30';
      case 'High': return 'bg-purple-500/20 text-purple-ink border-purple-500/30';
      default: return 'bg-slate-500/20 text-muted';
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= Math.ceil(this.totalOrders / this.rowsPerPage)) {
      this.currentPage = page;
    }
  }
}
