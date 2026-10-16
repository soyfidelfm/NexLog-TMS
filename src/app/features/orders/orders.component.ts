import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/language.service';

interface Order {
  id: string;
  origin: { city: string; country: string };
  destination: { city: string; country: string };
  weight: number;
  volume: number;
  status: 'Delivered' | 'In Transit' | 'Picked Up' | 'Booked' | 'Delayed';
  carrier: string;
  eta: string;
  priority: 'Low' | 'Medium' | 'High';
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  readonly lang = inject(LanguageService);

  searchQuery = '';
  currentPage = 1;
  rowsPerPage = 10;
  totalOrders = 248;

  orders: Order[] = [
    { id: 'ORD-2025-00125', origin: { city: 'Shanghai', country: 'CN' }, destination: { city: 'Rotterdam', country: 'NL' }, weight: 12500, volume: 45.2, status: 'Delivered', carrier: 'Maersk Line', eta: 'May 18, 2025', priority: 'Low' },
    { id: 'ORD-2025-00124', origin: { city: 'Hamburg', country: 'DE' }, destination: { city: 'Atlanta', country: 'US' }, weight: 8750, volume: 32.1, status: 'In Transit', carrier: 'Hapag-Lloyd', eta: 'May 23, 2025', priority: 'Medium' },
    { id: 'ORD-2025-00123', origin: { city: 'Busan', country: 'KR' }, destination: { city: 'Los Angeles', country: 'US' }, weight: 15300, volume: 60.8, status: 'Picked Up', carrier: 'MSC', eta: 'May 22, 2025', priority: 'High' },
    { id: 'ORD-2025-00122', origin: { city: 'Dubai', country: 'AE' }, destination: { city: 'Singapore', country: 'SG' }, weight: 6200, volume: 21.7, status: 'Booked', carrier: 'CMA CGM', eta: 'May 27, 2025', priority: 'Medium' },
    { id: 'ORD-2025-00121', origin: { city: 'Rotterdam', country: 'NL' }, destination: { city: 'New York', country: 'US' }, weight: 9100, volume: 38.4, status: 'Delayed', carrier: 'OOCL', eta: 'May 20, 2025', priority: 'High' },
    { id: 'ORD-2025-00120', origin: { city: 'Tokyo', country: 'JP' }, destination: { city: 'Sydney', country: 'AU' }, weight: 7400, volume: 28.9, status: 'In Transit', carrier: 'Evergreen', eta: 'May 24, 2025', priority: 'Low' },
    { id: 'ORD-2025-00119', origin: { city: 'Ningbo', country: 'CN' }, destination: { city: 'Felixstowe', country: 'GB' }, weight: 11200, volume: 47.3, status: 'In Transit', carrier: 'COSCO Shipping', eta: 'May 25, 2025', priority: 'Medium' }
  ];

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
      case 'Delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'In Transit': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Picked Up': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Booked': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Delayed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'High': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= Math.ceil(this.totalOrders / this.rowsPerPage)) {
      this.currentPage = page;
    }
  }
}
