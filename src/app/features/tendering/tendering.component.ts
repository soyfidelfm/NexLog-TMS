import { TranslatePipe } from '@ngx-translate/core';
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/language.service';

type TenderStatus = 'Pending' | 'Accepted' | 'Rejected';

interface Load {
  id: string;
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  pickupDate: string;
  status: TenderStatus;
  selectedCarrier: string | null;
  tenderedAt?: string;
  cascadeCount: number;
}

@Component({
  host: { class: 'tone-gray' },
  selector: 'app-tendering',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule],
  templateUrl: './tendering.component.html',
  styleUrl: './tendering.component.scss',
})
export class TenderingComponent {
  readonly lang = inject(LanguageService);

  loads = signal<Load[]>([
    { id: 'LD-2026-0842', origin: 'Los Angeles, CA', destination: 'Phoenix, AZ', weight: 24500, volume: 1280, pickupDate: '2026-10-17', status: 'Pending', selectedCarrier: 'Swift Transportation', cascadeCount: 0 },
    { id: 'LD-2026-0845', origin: 'San Diego, CA', destination: 'Las Vegas, NV', weight: 18200, volume: 960, pickupDate: '2026-10-16', status: 'Accepted', selectedCarrier: 'Knight-Swift', tenderedAt: '2026-10-15T14:22', cascadeCount: 1 },
    { id: 'LD-2026-0848', origin: 'Irvine, CA', destination: 'Salt Lake City, UT', weight: 31000, volume: 1650, pickupDate: '2026-10-18', status: 'Rejected', selectedCarrier: 'Schneider', cascadeCount: 2 },
    { id: 'LD-2026-0851', origin: 'Fresno, CA', destination: 'Denver, CO', weight: 27800, volume: 1420, pickupDate: '2026-10-17', status: 'Pending', selectedCarrier: null, cascadeCount: 0 },
    { id: 'LD-2026-0854', origin: 'Los Angeles, CA', destination: 'Tucson, AZ', weight: 19500, volume: 1100, pickupDate: '2026-10-16', status: 'Pending', selectedCarrier: 'Werner Enterprises', cascadeCount: 0 },
    { id: 'LD-2026-0857', origin: 'San Bernardino, CA', destination: 'Albuquerque, NM', weight: 33400, volume: 1780, pickupDate: '2026-10-19', status: 'Accepted', selectedCarrier: 'J.B. Hunt', tenderedAt: '2026-10-15T09:15', cascadeCount: 0 }
  ]);

  filterStatus = signal<TenderStatus | 'All'>('All');
  searchTerm = signal('');

  filteredLoads = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.filterStatus();
    return this.loads().filter((load) => {
      const matchesStatus = status === 'All' || load.status === status;
      const matchesSearch = !term || load.id.toLowerCase().includes(term) || load.origin.toLowerCase().includes(term) || load.destination.toLowerCase().includes(term) || (load.selectedCarrier?.toLowerCase().includes(term) ?? false);
      return matchesStatus && matchesSearch;
    });
  });

  statusCounts = computed(() => {
    const all = this.loads();
    return {
      total: all.length,
      pending: all.filter((l) => l.status === 'Pending').length,
      accepted: all.filter((l) => l.status === 'Accepted').length,
      rejected: all.filter((l) => l.status === 'Rejected').length
    };
  });

  tender(load: Load): void {
    if (load.status === 'Accepted') return;
    this.loads.set(this.loads().map((l) => l.id === load.id ? { ...l, status: 'Pending' as TenderStatus, tenderedAt: new Date().toISOString(), selectedCarrier: l.selectedCarrier || 'Prime Inc' } : l));
  }

  cascade(load: Load): void {
    const carriers = ['Swift Transportation', 'Knight-Swift', 'Schneider', 'Werner Enterprises', 'J.B. Hunt', 'Prime Inc'];
    const nextIndex = (load.cascadeCount + 1) % carriers.length;
    this.loads.set(this.loads().map((l) => l.id === load.id ? { ...l, status: 'Pending' as TenderStatus, selectedCarrier: carriers[nextIndex], cascadeCount: l.cascadeCount + 1, tenderedAt: new Date().toISOString() } : l));
  }

  reassign(load: Load): void {
    const carriers = ['Swift Transportation', 'Knight-Swift', 'Schneider', 'Werner Enterprises', 'J.B. Hunt'];
    const next = carriers[(carriers.indexOf(load.selectedCarrier || '') + 1) % carriers.length] || carriers[0];
    this.loads.set(this.loads().map((l) => l.id === load.id ? { ...l, selectedCarrier: next, status: 'Pending' as TenderStatus, cascadeCount: 0 } : l));
  }

  getStatusClass(status: TenderStatus): string {
    switch (status) {
      case 'Accepted': return 'status-accepted';
      case 'Rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  }
}
