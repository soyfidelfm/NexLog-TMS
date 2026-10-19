import { TranslatePipe } from '@ngx-translate/core';
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { LanguageService } from '../../core/language.service';
import { camelKey } from '../../shared/i18n-keys';
import { CommonModule } from '@angular/common';
import { FreightAuditService } from '../../core/services/freight-audit.service';
import { FreightInvoice, AuditStatus, InvoiceLine } from '../../core/models';

@Component({
  selector: 'app-freight-audit',
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  templateUrl: './freight-audit.component.html',
  styleUrl: './freight-audit.component.scss',
})
export class FreightAuditComponent implements OnInit {
  private freightAuditService = inject(FreightAuditService);
  readonly lang = inject(LanguageService);
  /** 'Fuel Surcharge' -> 'fuelSurcharge' (translation key suffix). */
  lineKey(description: string): string { return camelKey(description); }
  invoices = signal<FreightInvoice[]>([]);

  selectedId = signal<string>('INV-78421');

  ngOnInit(): void {
    this.freightAuditService.getInvoices().subscribe(data => {
      this.invoices.set(data);
    });
  }

  selectedInvoice = computed(() =>
    this.invoices().find(inv => inv.id === this.selectedId()) ?? this.invoices()[0]
  );

  expectedTotal(invoice: FreightInvoice): number {
    return invoice.lines.reduce((sum, line) => sum + line.expected, 0);
  }

  billedTotal(invoice: FreightInvoice): number {
    return invoice.lines.reduce((sum, line) => sum + line.billed, 0);
  }

  variance(invoice: FreightInvoice): number {
    return this.billedTotal(invoice) - this.expectedTotal(invoice);
  }

  variancePercent(invoice: FreightInvoice): number {
    const exp = this.expectedTotal(invoice);
    if (exp === 0) return 0;
    return Math.round((this.variance(invoice) / exp) * 100);
  }

  hasDiscrepancy(line: InvoiceLine): boolean {
    return Math.abs(line.billed - line.expected) > 0.01;
  }

  selectInvoice(id: string) {
    this.selectedId.set(id);
  }

  updateStatus(status: AuditStatus) {
    const id = this.selectedId();
    this.freightAuditService.updateStatus(id, status).subscribe();
    this.invoices.update(list =>
      list.map(inv => inv.id === id ? { ...inv, status } : inv)
    );
  }

  approve() { this.updateStatus('Approved'); }
  adjust() { this.updateStatus('Adjusted'); }
  dispute() { this.updateStatus('Disputed'); }

  get pendingCount(): number {
    return this.invoices().filter(i => i.status === 'Pending').length;
  }

  get totalVariance(): number {
    return this.invoices()
      .filter(i => i.status === 'Pending' || i.status === 'Disputed')
      .reduce((sum, inv) => sum + Math.max(0, this.variance(inv)), 0);
  }
}
