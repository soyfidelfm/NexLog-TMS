import { TranslatePipe } from '@ngx-translate/core';
import { Component, signal, computed, inject } from '@angular/core';
import { LanguageService } from '../../core/language.service';
import { camelKey } from '../../shared/i18n-keys';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

type AuditStatus = 'Pending' | 'Approved' | 'Disputed' | 'Adjusted';

interface InvoiceLine {
  description: string;
  expected: number;
  billed: number;
}

interface FreightInvoice {
  id: string;
  carrier: string;
  loadId: string;
  invoiceDate: string;
  status: AuditStatus;
  lines: InvoiceLine[];
}

@Component({
  selector: 'app-freight-audit',
  standalone: true,
  imports: [TranslatePipe, CommonModule, RouterLink],
  templateUrl: './freight-audit.component.html',
  styleUrl: './freight-audit.component.scss',
})
export class FreightAuditComponent {
  readonly lang = inject(LanguageService);
  /** 'Fuel Surcharge' -> 'fuelSurcharge' (translation key suffix). */
  lineKey(description: string): string { return camelKey(description); }
  invoices = signal<FreightInvoice[]>([
    {
      id: 'INV-78421',
      carrier: 'Swift Transportation',
      loadId: 'LD-2026-0842',
      invoiceDate: '2026-10-14',
      status: 'Pending',
      lines: [
        { description: 'Linehaul / Base Rate', expected: 1850.00, billed: 1850.00 },
        { description: 'Fuel Surcharge', expected: 185.00, billed: 248.50 },
        { description: 'Detention (2h)', expected: 0, billed: 120.00 },
        { description: 'Accessorial - Liftgate', expected: 75.00, billed: 75.00 },
      ],
    },
    {
      id: 'INV-78435',
      carrier: 'Knight-Swift',
      loadId: 'LD-2026-0845',
      invoiceDate: '2026-10-13',
      status: 'Pending',
      lines: [
        { description: 'Linehaul / Base Rate', expected: 1420.00, billed: 1420.00 },
        { description: 'Fuel Surcharge', expected: 142.00, billed: 142.00 },
        { description: 'Toll', expected: 38.50, billed: 38.50 },
      ],
    },
    {
      id: 'INV-78448',
      carrier: 'Schneider',
      loadId: 'LD-2026-0848',
      invoiceDate: '2026-10-12',
      status: 'Disputed',
      lines: [
        { description: 'Linehaul / Base Rate', expected: 2100.00, billed: 2350.00 },
        { description: 'Fuel Surcharge', expected: 210.00, billed: 210.00 },
        { description: 'Stop-off Charge', expected: 0, billed: 85.00 },
      ],
    },
    {
      id: 'INV-78452',
      carrier: 'Werner Enterprises',
      loadId: 'LD-2026-0854',
      invoiceDate: '2026-10-15',
      status: 'Approved',
      lines: [
        { description: 'Linehaul / Base Rate', expected: 1680.00, billed: 1680.00 },
        { description: 'Fuel Surcharge', expected: 168.00, billed: 168.00 },
      ],
    },
  ]);

  selectedId = signal<string>('INV-78421');

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
