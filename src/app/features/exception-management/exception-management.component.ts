import { TranslatePipe } from '@ngx-translate/core';
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { LanguageService } from '../../core/language.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExceptionService } from '../../core/services/exception.service';
import { ExceptionItem, Severity, ExceptionStatus } from '../../core/models';

@Component({
  host: { class: 'tone-gray' },
  selector: 'app-exception-management',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule],
  templateUrl: './exception-management.component.html',
  styleUrl: './exception-management.component.scss',
})
export class ExceptionManagementComponent implements OnInit {
  private exceptionService = inject(ExceptionService);
  readonly lang = inject(LanguageService);
  exceptions = signal<ExceptionItem[]>([]);

  selectedId = signal<string | null>('EXC-2026-0142');
  filterSeverity = signal<Severity | 'All'>('All');
  filterStatus = signal<ExceptionStatus | 'All'>('All');
  searchTerm = signal('');

  ngOnInit(): void {
    this.exceptionService.getExceptions().subscribe(data => {
      this.exceptions.set(data);
    });
  }

  filteredExceptions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const sev = this.filterSeverity();
    const st = this.filterStatus();
    return this.exceptions().filter((ex) => {
      const matchesSev = sev === 'All' || ex.severity === sev;
      const matchesSt = st === 'All' || ex.status === st;
      const matchesSearch =
        !term ||
        ex.id.toLowerCase().includes(term) ||
        ex.title.toLowerCase().includes(term) ||
        ex.loadId.toLowerCase().includes(term) ||
        ex.carrier.toLowerCase().includes(term) ||
        (ex.orderId?.toLowerCase().includes(term) ?? false);
      return matchesSev && matchesSt && matchesSearch;
    });
  });

  selectedException = computed(() =>
    this.exceptions().find((e) => e.id === this.selectedId()) ?? null
  );

  severityCounts = computed(() => {
    const all = this.exceptions();
    return {
      critical: all.filter((e) => e.severity === 'Critical').length,
      high: all.filter((e) => e.severity === 'High').length,
      medium: all.filter((e) => e.severity === 'Medium').length,
      low: all.filter((e) => e.severity === 'Low').length,
    };
  });

  select(ex: ExceptionItem): void {
    this.selectedId.set(ex.id);
  }

  severityClass(severity: Severity): string {
    switch (severity) {
      case 'Critical': return 'bg-red-500/20 text-red-ink-soft border-red-500/40';
      case 'High': return 'bg-orange-500/20 text-orange-ink-soft border-orange-500/40';
      case 'Medium': return 'bg-amber-500/20 text-amber-ink-soft border-amber-500/40';
      case 'Low': return 'bg-emerald-500/20 text-emerald-ink-soft border-emerald-500/40';
    }
  }

  statusClass(status: ExceptionStatus): string {
    switch (status) {
      case 'Open': return 'bg-red-500/15 text-red-ink-soft';
      case 'In Progress': return 'bg-amber-500/15 text-amber-ink-soft';
      case 'Resolved': return 'bg-emerald-500/15 text-emerald-ink-soft';
      case 'Closed': return 'bg-elevated-3/40 text-muted';
    }
  }

  markInProgress(): void {
    const id = this.selectedId();
    if (!id) return;
    this.exceptionService.updateStatus(id, 'In Progress').subscribe();
    this.exceptions.update((list) =>
      list.map((e) => (e.id === id ? { ...e, status: 'In Progress' as ExceptionStatus, lastUpdate: new Date().toISOString() } : e))
    );
  }

  resolve(): void {
    const id = this.selectedId();
    if (!id) return;
    this.exceptionService.updateStatus(id, 'Resolved').subscribe();
    this.exceptions.update((list) =>
      list.map((e) => (e.id === id ? { ...e, status: 'Resolved' as ExceptionStatus, lastUpdate: new Date().toISOString() } : e))
    );
  }
}
