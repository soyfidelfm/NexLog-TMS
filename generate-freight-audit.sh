#!/bin/bash

# Script para generar la pantalla Freight Audit & Payment
# Vista de matching de factura: tarifa esperada vs factura del carrier
# Ejecutar desde la raíz del frontend Angular (donde está src/)
# Uso: bash generate-freight-audit.sh

set -e

COMPONENT_DIR="src/app/features/freight-audit"
mkdir -p "$COMPONENT_DIR"

echo "Generando componente Freight Audit & Payment..."

# ==================== component.ts ====================
cat > "$COMPONENT_DIR/freight-audit.component.ts" << 'EOF'
import { Component, signal, computed } from '@angular/core';
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
  imports: [CommonModule, RouterLink],
  templateUrl: './freight-audit.component.html',
  styleUrl: './freight-audit.component.scss',
})
export class FreightAuditComponent {
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
EOF

# ==================== component.html ====================
cat > "$COMPONENT_DIR/freight-audit.component.html" << 'EOF'
<div class="flex h-screen bg-[#0b1220] text-slate-100 overflow-hidden">
  <!-- Sidebar -->
  <aside class="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col shrink-0">
    <div class="p-4 flex items-center gap-3 border-b border-slate-800">
      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">NL</div>
      <span class="font-semibold text-lg">NexLog TMS</span>
    </div>
    <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
      <a routerLink="/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        Dashboard
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        Orders
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
        Load Planning
      </a>
      <a routerLink="/route-optimization" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
        Route Optimization
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        Carriers
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
        Rating
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Tendering
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-600 text-white font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        Freight Audit
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
        Documents
      </a>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0f172a]/80">
      <div>
        <h1 class="text-xl font-semibold">Freight Audit & Payment</h1>
        <p class="text-sm text-slate-400">Matching: Expected Rate vs Carrier Invoice</p>
      </div>
      <div class="flex items-center gap-4 text-sm">
        <div class="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
          {{ pendingCount }} Pending
        </div>
        <div class="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30">
          ${{ totalVariance | number:'1.2-2' }} Variance
        </div>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden p-5 gap-5">
      <!-- Invoices List -->
      <div class="w-96 flex flex-col bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-800">
          <h2 class="font-medium text-sm uppercase tracking-wider text-slate-400">Invoices</h2>
        </div>
        <div class="flex-1 overflow-y-auto">
          @for (inv of invoices(); track inv.id) {
            <button
              (click)="selectInvoice(inv.id)"
              class="w-full text-left px-4 py-3.5 border-b border-slate-800 hover:bg-slate-800/50 transition flex items-center justify-between gap-3"
              [class.bg-slate-800/70]="selectedId() === inv.id"
              [class.border-l-4]="selectedId() === inv.id"
              [class.border-l-blue-500]="selectedId() === inv.id"
            >
              <div class="min-w-0">
                <div class="font-medium text-sm truncate">{{ inv.id }}</div>
                <div class="text-xs text-slate-400 truncate">{{ inv.carrier }} • {{ inv.loadId }}</div>
              </div>
              <div class="text-right shrink-0">
                <div class="text-sm font-medium" [class.text-red-400]="variance(inv) > 0" [class.text-emerald-400]="variance(inv) <= 0">
                  {{ variance(inv) > 0 ? '+' : '' }}${{ variance(inv) | number:'1.2-2' }}
                </div>
                <div class="text-[10px] uppercase tracking-wider mt-0.5"
                     [class.text-amber-400]="inv.status === 'Pending'"
                     [class.text-emerald-400]="inv.status === 'Approved'"
                     [class.text-red-400]="inv.status === 'Disputed'"
                     [class.text-blue-400]="inv.status === 'Adjusted'">
                  {{ inv.status }}
                </div>
              </div>
            </button>
          }
        </div>
      </div>

      <!-- Matching Detail -->
      @if (selectedInvoice(); as inv) {
        <div class="flex-1 flex flex-col bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-800 flex items-start justify-between">
            <div>
              <h2 class="text-lg font-semibold">{{ inv.id }}</h2>
              <p class="text-sm text-slate-400">{{ inv.carrier }} • Load {{ inv.loadId }} • {{ inv.invoiceDate }}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-medium uppercase"
                  [class.bg-amber-500/20]="inv.status === 'Pending'" [class.text-amber-400]="inv.status === 'Pending'"
                  [class.bg-emerald-500/20]="inv.status === 'Approved'" [class.text-emerald-400]="inv.status === 'Approved'"
                  [class.bg-red-500/20]="inv.status === 'Disputed'" [class.text-red-400]="inv.status === 'Disputed'"
                  [class.bg-blue-500/20]="inv.status === 'Adjusted'" [class.text-blue-400]="inv.status === 'Adjusted'">
              {{ inv.status }}
            </span>
          </div>

          <div class="flex-1 overflow-y-auto p-5">
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="bg-[#1e293b] rounded-lg p-4 border border-slate-700">
                <div class="text-xs text-slate-400 uppercase tracking-wider">Expected Rate</div>
                <div class="text-2xl font-semibold mt-1">${{ expectedTotal(inv) | number:'1.2-2' }}</div>
              </div>
              <div class="bg-[#1e293b] rounded-lg p-4 border border-slate-700">
                <div class="text-xs text-slate-400 uppercase tracking-wider">Carrier Invoice</div>
                <div class="text-2xl font-semibold mt-1">${{ billedTotal(inv) | number:'1.2-2' }}</div>
              </div>
              <div class="bg-[#1e293b] rounded-lg p-4 border border-slate-700"
                   [class.border-red-500/50]="variance(inv) > 0"
                   [class.border-emerald-500/50]="variance(inv) <= 0">
                <div class="text-xs text-slate-400 uppercase tracking-wider">Variance</div>
                <div class="text-2xl font-semibold mt-1"
                     [class.text-red-400]="variance(inv) > 0"
                     [class.text-emerald-400]="variance(inv) <= 0">
                  {{ variance(inv) > 0 ? '+' : '' }}${{ variance(inv) | number:'1.2-2' }}
                  <span class="text-sm font-normal">({{ variancePercent(inv) > 0 ? '+' : '' }}{{ variancePercent(inv) }}%)</span>
                </div>
              </div>
            </div>

            <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Line Item Matching</h3>
            <div class="space-y-2">
              @for (line of inv.lines; track line.description) {
                <div class="flex items-center justify-between p-3.5 rounded-lg border transition"
                     [class.bg-red-500/10]="hasDiscrepancy(line) && line.billed > line.expected"
                     [class.border-red-500/40]="hasDiscrepancy(line) && line.billed > line.expected"
                     [class.bg-emerald-500/10]="hasDiscrepancy(line) && line.billed < line.expected"
                     [class.border-emerald-500/40]="hasDiscrepancy(line) && line.billed < line.expected"
                     [class.bg-[#1e293b]]="!hasDiscrepancy(line)"
                     [class.border-slate-700]="!hasDiscrepancy(line)">
                  <div class="flex-1">
                    <div class="font-medium text-sm">{{ line.description }}</div>
                    @if (hasDiscrepancy(line)) {
                      <div class="text-xs text-red-400 mt-0.5">
                        Discrepancy: {{ line.billed > line.expected ? 'Overbilled' : 'Underbilled' }}
                        by ${{ (line.billed - line.expected) | number:'1.2-2' }}
                      </div>
                    }
                  </div>
                  <div class="flex items-center gap-6 text-sm tabular-nums">
                    <div class="text-right">
                      <div class="text-xs text-slate-500">Expected</div>
                      <div>${{ line.expected | number:'1.2-2' }}</div>
                    </div>
                    <div class="text-right">
                      <div class="text-xs text-slate-500">Billed</div>
                      <div class="font-medium" [class.text-red-400]="line.billed > line.expected" [class.text-emerald-400]="line.billed < line.expected">
                        ${{ line.billed | number:'1.2-2' }}
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="px-5 py-4 border-t border-slate-800 bg-[#0f172a] flex items-center justify-end gap-3">
            <button (click)="dispute()" class="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-medium transition">
              Dispute
            </button>
            <button (click)="adjust()" class="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-sm font-medium transition">
              Adjust
            </button>
            <button (click)="approve()" class="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-medium transition">
              Approve
            </button>
          </div>
        </div>
      }
    </div>
  </main>
</div>
EOF

# ==================== component.scss ====================
cat > "$COMPONENT_DIR/freight-audit.component.scss" << 'EOF'
:host {
  display: block;
  height: 100%;
}

/* Additional custom styles if needed */
EOF

echo ""
echo "============================================================"
echo "Pantalla Freight Audit & Payment generada correctamente."
echo "Archivos creados en: $COMPONENT_DIR"
echo ""
echo "Agrega la siguiente ruta en src/app/app.routes.ts:"
echo ""
echo "import { FreightAuditComponent } from './features/freight-audit/freight-audit.component';"
echo ""
echo "{ path: 'freight-audit', component: FreightAuditComponent, title: 'Freight Audit & Payment' },"
echo ""
echo "============================================================"
