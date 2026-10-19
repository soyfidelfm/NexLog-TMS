import { TranslatePipe } from '@ngx-translate/core';
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/language.service';
import { LoadService } from '../../core/services/load.service';
import { Load, TenderStatus } from '../../core/models';

@Component({
  host: { class: 'tone-gray' },
  selector: 'app-tendering',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule],
  templateUrl: './tendering.component.html',
  styleUrl: './tendering.component.scss',
})
export class TenderingComponent implements OnInit {
  private loadService = inject(LoadService);
  readonly lang = inject(LanguageService);

  loads = signal<Load[]>([]);

  filterStatus = signal<TenderStatus | 'All'>('All');
  searchTerm = signal('');

  ngOnInit(): void {
    this.loadService.getLoads().subscribe(data => {
      this.loads.set(data);
    });
  }

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
