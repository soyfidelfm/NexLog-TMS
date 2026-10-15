import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Order {
  id: string;
  origin: { city: string; country: string; flag: string };
  destination: { city: string; country: string; flag: string };
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
  searchQuery = '';
  currentPage = 1;
  rowsPerPage = 10;
  totalOrders = 248;

  orders: Order[] = [
    {
      id: 'ORD-2025-00125',
      origin: { city: 'Shanghai', country: 'CN', flag: '🇨🇳' },
      destination: { city: 'Rotterdam', country: 'NL', flag: '🇳🇱' },
      weight: 12500,
      volume: 45.2,
      status: 'Delivered',
      carrier: 'Maersk Line',
      eta: 'May 18, 2025 10:30 AM',
      priority: 'Low'
    },
    {
      id: 'ORD-2025-00124',
      origin: { city: 'Hamburg', country: 'DE', flag: '🇩🇪' },
      destination: { city: 'Atlanta', country: 'US', flag: '🇺🇸' },
      weight: 8750,
      volume: 32.1,
      status: 'In Transit',
      carrier: 'Hapag-Lloyd',
      eta: 'May 23, 2025 02:15 PM',
      priority: 'Medium'
    },
    {
      id: 'ORD-2025-00123',
      origin: { city: 'Busan', country: 'KR', flag: '🇰🇷' },
      destination: { city: 'Los Angeles', country: 'US', flag: '🇺🇸' },
      weight: 15300,
      volume: 60.8,
      status: 'Picked Up',
      carrier: 'MSC',
      eta: 'May 22, 2025 08:00 AM',
      priority: 'High'
    },
    {
      id: 'ORD-2025-00122',
      origin: { city: 'Dubai', country: 'AE', flag: '🇦🇪' },
      destination: { city: 'Singapore', country: 'SG', flag: '🇸🇬' },
      weight: 6200,
      volume: 21.7,
      status: 'Booked',
      carrier: 'CMA CGM',
      eta: 'May 27, 2025 11:45 AM',
      priority: 'Medium'
    },
    {
      id: 'ORD-2025-00121',
      origin: { city: 'Rotterdam', country: 'NL', flag: '🇳🇱' },
      destination: { city: 'New York', country: 'US', flag: '🇺🇸' },
      weight: 9100,
      volume: 38.4,
      status: 'Delayed',
      carrier: 'OOCL',
      eta: 'May 20, 2025 04:30 PM',
      priority: 'High'
    },
    {
      id: 'ORD-2025-00120',
      origin: { city: 'Tokyo', country: 'JP', flag: '🇯🇵' },
      destination: { city: 'Sydney', country: 'AU', flag: '🇦🇺' },
      weight: 7400,
      volume: 28.9,
      status: 'In Transit',
      carrier: 'Evergreen',
      eta: 'May 24, 2025 09:20 AM',
      priority: 'Low'
    },
    {
      id: 'ORD-2025-00119',
      origin: { city: 'Ningbo', country: 'CN', flag: '🇨🇳' },
      destination: { city: 'Felixstowe', country: 'GB', flag: '🇬🇧' },
      weight: 11200,
      volume: 47.3,
      status: 'In Transit',
      carrier: 'COSCO Shipping',
      eta: 'May 25, 2025 01:10 PM',
      priority: 'Medium'
    }
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
