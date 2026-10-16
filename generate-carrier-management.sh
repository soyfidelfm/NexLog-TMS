#!/usr/bin/env bash
set -e

# Script para generar la pantalla Carrier Management
# Ejecutar desde la raíz del frontend Angular (donde está src/)

COMPONENT_DIR="src/app/features/carrier-management"
mkdir -p "$COMPONENT_DIR"

echo "Generando componente Carrier Management..."

# ==================== component.ts ====================
cat > "$COMPONENT_DIR/carrier-management.component.ts" << 'EOF'
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Carrier {
  id: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive' | 'Pending';
  onTimePercent: number;
  claimsRate: number; // %
  rating: number; // 0-5
  totalLoads: number;
  mcNumber: string;
  dotNumber: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  equipment: string[];
  notes: string;
}

@Component({
  selector: 'app-carrier-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrier-management.component.html',
  styleUrl: './carrier-management.component.scss',
})
export class CarrierManagementComponent {
  searchQuery = signal('');
  statusFilter = signal<'All' | 'Active' | 'Inactive' | 'Pending'>('All');
  minRating = signal(0);

  selectedId = signal<string | null>(null);

  carriers: Carrier[] = [
    {
      id: 'CR-001',
      name: 'Swift Transportation',
      code: 'SWFT',
      status: 'Active',
      onTimePercent: 96.4,
      claimsRate: 0.8,
      rating: 4.7,
      totalLoads: 1240,
      mcNumber: 'MC-133655',
      dotNumber: 'DOT-542389',
      contact: 'Dispatch Desk',
      phone: '(800) 555-0142',
      email: 'dispatch@swift.com',
      city: 'Phoenix',
      state: 'AZ',
      equipment: ['Dry Van', 'Reefer', 'Flatbed'],
      notes: 'Preferred partner for West Coast lanes. Excellent communication.',
    },
    {
      id: 'CR-002',
      name: 'Schneider National',
      code: 'SNDR',
      status: 'Active',
      onTimePercent: 94.1,
      claimsRate: 1.2,
      rating: 4.5,
      totalLoads: 980,
      mcNumber: 'MC-133655',
      dotNumber: 'DOT-542390',
      contact: 'Capacity Team',
      phone: '(800) 555-0198',
      email: 'capacity@schneider.com',
      city: 'Green Bay',
      state: 'WI',
      equipment: ['Dry Van', 'Intermodal'],
      notes: 'Strong in Midwest. Request 24h notice for reefer.',
    },
    {
      id: 'CR-003',
      name: 'J.B. Hunt',
      code: 'JBHT',
      status: 'Active',
      onTimePercent: 97.8,
      claimsRate: 0.5,
      rating: 4.9,
      totalLoads: 1560,
      mcNumber: 'MC-135797',
      dotNumber: 'DOT-612455',
      contact: 'Dedicated Ops',
      phone: '(800) 555-0177',
      email: 'ops@jbhunt.com',
      city: 'Lowell',
      state: 'AR',
      equipment: ['Dry Van', 'Intermodal', 'Dedicated'],
      notes: 'Top performer. Priority for high-value loads.',
    },
    {
      id: 'CR-004',
      name: 'Werner Enterprises',
      code: 'WERN',
      status: 'Active',
      onTimePercent: 92.3,
      claimsRate: 1.5,
      rating: 4.2,
      totalLoads: 740,
      mcNumber: 'MC-165372',
      dotNumber: 'DOT-53467',
      contact: 'Fleet Manager',
      phone: '(800) 555-0133',
      email: 'fleet@werner.com',
      city: 'Omaha',
      state: 'NE',
      equipment: ['Dry Van', 'Flatbed'],
      notes: 'Good for long-haul. Occasional delays on weekends.',
    },
    {
      id: 'CR-005',
      name: 'Landstar System',
      code: 'LSTR',
      status: 'Inactive',
      onTimePercent: 89.6,
      claimsRate: 2.1,
      rating: 3.8,
      totalLoads: 310,
      mcNumber: 'MC-166960',
      dotNumber: 'DOT-221578',
      contact: 'Agent Network',
      phone: '(800) 555-0120',
      email: 'agents@landstar.com',
      city: 'Jacksonville',
      state: 'FL',
      equipment: ['Owner Operator', 'Specialized'],
      notes: 'On hold pending insurance renewal.',
    },
    {
      id: 'CR-006',
      name: 'Knight-Swift',
      code: 'KNX',
      status: 'Pending',
      onTimePercent: 95.0,
      claimsRate: 0.9,
      rating: 4.4,
      totalLoads: 0,
      mcNumber: 'MC-227271',
      dotNumber: 'DOT-264184',
      contact: 'Onboarding',
      phone: '(800) 555-0188',
      email: 'onboarding@knights.com',
      city: 'Phoenix',
      state: 'AZ',
      equipment: ['Dry Van'],
      notes: 'New carrier. Awaiting final document verification.',
    },
  ];

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
    // Placeholder — en producción abriría un modal o navegaría a un formulario
    alert('Add Carrier form (to be implemented)');
  }
}
EOF

# ==================== component.html ====================
cat > "$COMPONENT_DIR/carrier-management.component.html" << 'EOF'
<div class="min-h-full bg-[#0b1220] p-4 text-slate-200 lg:p-6">
  <!-- Header -->
  <header class="mb-6 flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold text-white">Carrier Management</h1>
      <p class="mt-1 text-sm text-slate-400">Performance scorecards, contacts and compliance for your carrier network</p>
    </div>
    <button
      (click)="addCarrier()"
      class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
      </svg>
      Add Carrier
    </button>
  </header>

  <!-- Filters -->
  <section class="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-[#0f172a] p-3">
    <div class="relative flex-1 min-w-[220px]">
      <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input
        type="text"
        [ngModel]="searchQuery()"
        (ngModelChange)="searchQuery.set($event)"
        placeholder="Search by name, code or MC#..."
        class="w-full rounded-lg border border-slate-700 bg-[#0b1220] py-2 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
      />
    </div>

    <select
      [ngModel]="statusFilter()"
      (ngModelChange)="statusFilter.set($event)"
      class="rounded-lg border border-slate-700 bg-[#0b1220] px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
    >
      <option value="All">All statuses</option>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
      <option value="Pending">Pending</option>
    </select>

    <div class="flex items-center gap-2 text-sm">
      <span class="text-slate-400 whitespace-nowrap">Min rating</span>
      <input
        type="range"
        min="0"
        max="5"
        step="0.5"
        [ngModel]="minRating()"
        (ngModelChange)="minRating.set(+$event)"
        class="w-24 accent-blue-500"
      />
      <span class="w-8 text-right text-slate-300">{{ minRating() }}</span>
    </div>

    <span class="ml-auto text-xs text-slate-500">
      {{ filteredCarriers().length }} carriers
    </span>
  </section>

  <!-- Main content: list + detail -->
  <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
    <!-- Carrier list -->
    <section class="space-y-3 overflow-y-auto pr-1 max-h-[calc(100vh-280px)]">
      @for (c of filteredCarriers(); track c.id) {
        <article
          (click)="select(c.id)"
          class="cursor-pointer rounded-xl border bg-[#0f172a] p-4 transition-colors"
          [class]="selectedId() === c.id ? 'border-blue-500/60 ring-1 ring-blue-500/30' : 'border-slate-800 hover:border-slate-700'"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-blue-400">
                {{ c.code }}
              </div>
              <div>
                <div class="font-semibold text-white">{{ c.name }}</div>
                <div class="text-xs text-slate-500">{{ c.city }}, {{ c.state }} · {{ c.mcNumber }}</div>
              </div>
            </div>
            <span class="rounded-md px-2 py-0.5 text-xs font-medium" [class]="getStatusClass(c.status)">
              {{ c.status }}
            </span>
          </div>

          <!-- Scorecard -->
          <div class="mt-4 grid grid-cols-3 gap-3 text-center">
            <div class="rounded-lg bg-[#0b1220] py-2">
              <div class="text-lg font-bold" [class]="getOnTimeClass(c.onTimePercent)">
                {{ c.onTimePercent | number:'1.1-1' }}%
              </div>
              <div class="text-[11px] text-slate-500">On-time</div>
            </div>
            <div class="rounded-lg bg-[#0b1220] py-2">
              <div class="text-lg font-bold" [class]="getClaimsClass(c.claimsRate)">
                {{ c.claimsRate | number:'1.1-1' }}%
              </div>
              <div class="text-[11px] text-slate-500">Claims</div>
            </div>
            <div class="rounded-lg bg-[#0b1220] py-2">
              <div class="text-lg font-bold text-amber-400">{{ c.rating | number:'1.1-1' }}</div>
              <div class="text-[11px] text-slate-500">Rating</div>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>{{ c.totalLoads | number }} loads</span>
            <span class="text-amber-400/80">{{ getRatingStars(c.rating) }}</span>
          </div>
        </article>
      } @empty {
        <div class="rounded-xl border border-dashed border-slate-700 py-12 text-center text-slate-500">
          No carriers match the current filters
        </div>
      }
    </section>

    <!-- Detail panel -->
    <aside class="rounded-xl border border-slate-800 bg-[#0f172a] p-5 max-h-[calc(100vh-280px)] overflow-y-auto">
      @if (selected(); as c) {
        <div class="mb-4 flex items-start justify-between">
          <div>
            <h2 class="text-xl font-bold text-white">{{ c.name }}</h2>
            <p class="text-sm text-slate-400">{{ c.code }} · {{ c.city }}, {{ c.state }}</p>
          </div>
          <span class="rounded-md px-2.5 py-1 text-xs font-medium" [class]="getStatusClass(c.status)">
            {{ c.status }}
          </span>
        </div>

        <!-- Scorecard big -->
        <div class="mb-5 grid grid-cols-3 gap-2">
          <div class="rounded-lg border border-slate-800 bg-[#0b1220] p-3 text-center">
            <div class="text-2xl font-bold" [class]="getOnTimeClass(c.onTimePercent)">{{ c.onTimePercent | number:'1.1-1' }}%</div>
            <div class="text-xs text-slate-500">On-time</div>
          </div>
          <div class="rounded-lg border border-slate-800 bg-[#0b1220] p-3 text-center">
            <div class="text-2xl font-bold" [class]="getClaimsClass(c.claimsRate)">{{ c.claimsRate | number:'1.1-1' }}%</div>
            <div class="text-xs text-slate-500">Claims rate</div>
          </div>
          <div class="rounded-lg border border-slate-800 bg-[#0b1220] p-3 text-center">
            <div class="text-2xl font-bold text-amber-400">{{ c.rating | number:'1.1-1' }}</div>
            <div class="text-xs text-slate-500">Rating</div>
          </div>
        </div>

        <div class="space-y-4 text-sm">
          <div>
            <div class="mb-1 text-xs uppercase tracking-wide text-slate-500">Contact</div>
            <div class="text-slate-200">{{ c.contact }}</div>
            <div class="text-slate-400">{{ c.phone }}</div>
            <div class="text-slate-400">{{ c.email }}</div>
          </div>

          <div>
            <div class="mb-1 text-xs uppercase tracking-wide text-slate-500">Authority</div>
            <div class="flex justify-between text-slate-300"><span>MC</span><span>{{ c.mcNumber }}</span></div>
            <div class="flex justify-between text-slate-300"><span>DOT</span><span>{{ c.dotNumber }}</span></div>
          </div>

          <div>
            <div class="mb-1 text-xs uppercase tracking-wide text-slate-500">Equipment</div>
            <div class="flex flex-wrap gap-1.5">
              @for (eq of c.equipment; track eq) {
                <span class="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{{ eq }}</span>
              }
            </div>
          </div>

          <div>
            <div class="mb-1 text-xs uppercase tracking-wide text-slate-500">Notes</div>
            <p class="text-slate-300 leading-relaxed">{{ c.notes }}</p>
          </div>

          <div class="pt-2 border-t border-slate-800">
            <div class="text-xs text-slate-500">Total loads handled: <span class="text-slate-200 font-medium">{{ c.totalLoads | number }}</span></div>
          </div>
        </div>

        <div class="mt-6 flex gap-2">
          <button class="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800">
            Edit
          </button>
          <button class="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-500">
            View History
          </button>
        </div>
      } @else {
        <div class="flex h-full min-h-[320px] flex-col items-center justify-center text-center text-slate-500">
          <svg class="mb-3 h-12 w-12 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <p class="text-sm">Select a carrier to view details</p>
        </div>
      }
    </aside>
  </div>
</div>
EOF

# ==================== component.scss ====================
cat > "$COMPONENT_DIR/carrier-management.component.scss" << 'EOF'
:host {
  display: block;
  height: 100%;
}

/* Scrollbar discreto (mismo estilo que el resto del TMS) */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgb(51 65 85);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgb(71 85 105);
}

input[type="range"] {
  accent-color: #2563eb;
}
EOF

echo ""
echo "✅ Componente generado en: $COMPONENT_DIR"
echo ""
echo "Siguientes pasos:"
echo "1. Agrega la ruta en app.routes.ts (y el import correspondiente):"
echo "   { path: 'carrier-management', component: CarrierManagementComponent, title: 'Carrier Management' },"
echo ""
echo "2. El componente es standalone. Solo importa CarrierManagementComponent donde lo necesites."
echo ""
echo "Listo. Filtros, scorecard y panel de detalle ya funcionan."
