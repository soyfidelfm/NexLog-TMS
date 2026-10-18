import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrierService } from '../../core/services/carrier.service';
import { Carrier } from '../../core/models';

@Component({
  selector: 'app-carrier-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrier-management.component.html',
  styleUrl: './carrier-management.component.scss',
})
export class CarrierManagementComponent implements OnInit {
  private carrierService = inject(CarrierService);

  searchQuery = signal('');
  statusFilter = signal<'All' | 'Active' | 'Inactive' | 'Pending'>('All');
  minRating = signal(0);
  selectedId = signal<string | null>(null);

  carriers: Carrier[] = [];

  ngOnInit(): void {
    this.carrierService.getCarriers().subscribe(data => {
      this.carriers = data;
    });
  }

  filteredCarriers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();
    const minR = this.minRating();

    return this.carriers.filter(c => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.mcNumber.toLowerCase().includes(q);
      const matchesStatus = status === 'All' || c.status === status;
      const matchesRating = c.rating >= minR;
      return matchesSearch && matchesStatus && matchesRating;
    });
  });

  selected = computed(() => this.carriers.find(c => c.id === this.selectedId()) ?? null);

  select(id: string) {
    this.selectedId.set(this.selectedId() === id ? null : id);
  }

  getRatingStars(rating: number): string {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
  }

  getOnTimeClass(percent: number): string {
    if (percent >= 95) return 'text-emerald-400';
    if (percent >= 90) return 'text-amber-400';
    return 'text-red-400';
  }

  getClaimsClass(rate: number): string {
    if (rate <= 1) return 'text-emerald-400';
    if (rate <= 2) return 'text-amber-400';
    return 'text-red-400';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'bg-emerald-500/15 text-emerald-400';
      case 'Inactive': return 'bg-slate-700 text-slate-400';
      case 'Pending': return 'bg-amber-500/15 text-amber-400';
      default: return 'bg-slate-700 text-slate-300';
    }
  }

  addCarrier() {
    alert('Add Carrier form (to be implemented)');
  }
}
