#!/bin/bash
# generate-tendering-screen.sh
# Genera la pantalla de Tendering para NexLog TMS
# Uso: bash generate-tendering-screen.sh
# Crea los archivos en ./src/app/features/tendering/ (ajusta la ruta si es necesario)

set -e

TARGET_DIR="${1:-./src/app/features/tendering}"
mkdir -p "$TARGET_DIR"

echo "Creando pantalla Tendering en: $TARGET_DIR"

# ==================== tendering.component.ts ====================
cat > "$TARGET_DIR/tendering.component.ts" << 'ENDOFFILE'
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-tendering',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tendering.component.html',
  styleUrl: './tendering.component.scss',
})
export class TenderingComponent {
  loads = signal<Load[]>([
    {
      id: 'LD-2026-0842',
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      weight: 24500,
      volume: 1280,
      pickupDate: '2026-10-17',
      status: 'Pending',
      selectedCarrier: 'Swift Transportation',
      cascadeCount: 0,
    },
    {
      id: 'LD-2026-0845',
      origin: 'San Diego, CA',
      destination: 'Las Vegas, NV',
      weight: 18200,
      volume: 960,
      pickupDate: '2026-10-16',
      status: 'Accepted',
      selectedCarrier: 'Knight-Swift',
      tenderedAt: '2026-10-15 14:22',
      cascadeCount: 1,
    },
    {
      id: 'LD-2026-0848',
      origin: 'Irvine, CA',
      destination: 'Salt Lake City, UT',
      weight: 31000,
      volume: 1650,
      pickupDate: '2026-10-18',
      status: 'Rejected',
      selectedCarrier: 'Schneider',
      cascadeCount: 2,
    },
    {
      id: 'LD-2026-0851',
      origin: 'Fresno, CA',
      destination: 'Denver, CO',
      weight: 27800,
      volume: 1420,
      pickupDate: '2026-10-17',
      status: 'Pending',
      selectedCarrier: null,
      cascadeCount: 0,
    },
    {
      id: 'LD-2026-0854',
      origin: 'Los Angeles, CA',
      destination: 'Tucson, AZ',
      weight: 19500,
      volume: 1100,
      pickupDate: '2026-10-16',
      status: 'Pending',
      selectedCarrier: 'Werner Enterprises',
      cascadeCount: 0,
    },
    {
      id: 'LD-2026-0857',
      origin: 'San Bernardino, CA',
      destination: 'Albuquerque, NM',
      weight: 33400,
      volume: 1780,
      pickupDate: '2026-10-19',
      status: 'Accepted',
      selectedCarrier: 'J.B. Hunt',
      tenderedAt: '2026-10-15 09:15',
      cascadeCount: 0,
    },
  ]);

  filterStatus = signal<TenderStatus | 'All'>('All');
  searchTerm = signal('');

  filteredLoads = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.filterStatus();
    return this.loads().filter((load) => {
      const matchesStatus = status === 'All' || load.status === status;
      const matchesSearch =
        !term ||
        load.id.toLowerCase().includes(term) ||
        load.origin.toLowerCase().includes(term) ||
        load.destination.toLowerCase().includes(term) ||
        (load.selectedCarrier?.toLowerCase().includes(term) ?? false);
      return matchesStatus && matchesSearch;
    });
  });

  statusCounts = computed(() => {
    const all = this.loads();
    return {
      total: all.length,
      pending: all.filter((l) => l.status === 'Pending').length,
      accepted: all.filter((l) => l.status === 'Accepted').length,
      rejected: all.filter((l) => l.status === 'Rejected').length,
    };
  });

  tender(load: Load): void {
    if (load.status === 'Accepted') return;
    const updated = this.loads().map((l) =>
      l.id === load.id
        ? {
            ...l,
            status: 'Pending' as TenderStatus,
            tenderedAt: new Date().toLocaleString('en-US', { hour12: false }),
            selectedCarrier: l.selectedCarrier || 'Primary Carrier',
          }
        : l
    );
    this.loads.set(updated);
  }

  cascade(load: Load): void {
    const carriers = ['Swift Transportation', 'Knight-Swift', 'Schneider', 'Werner Enterprises', 'J.B. Hunt', 'Prime Inc'];
    const nextIndex = (load.cascadeCount + 1) % carriers.length;
    const updated = this.loads().map((l) =>
      l.id === load.id
        ? {
            ...l,
            status: 'Pending' as TenderStatus,
            selectedCarrier: carriers[nextIndex],
            cascadeCount: l.cascadeCount + 1,
            tenderedAt: new Date().toLocaleString('en-US', { hour12: false }),
          }
        : l
    );
    this.loads.set(updated);
  }

  reassign(load: Load): void {
    const carriers = ['Swift Transportation', 'Knight-Swift', 'Schneider', 'Werner Enterprises', 'J.B. Hunt'];
    const current = load.selectedCarrier;
    const next = carriers[(carriers.indexOf(current || '') + 1) % carriers.length] || carriers[0];
    const updated = this.loads().map((l) =>
      l.id === load.id
        ? {
            ...l,
            selectedCarrier: next,
            status: 'Pending' as TenderStatus,
            cascadeCount: 0,
          }
        : l
    );
    this.loads.set(updated);
  }

  getStatusClass(status: TenderStatus): string {
    switch (status) {
      case 'Accepted':
        return 'status-accepted';
      case 'Rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  }
}
ENDOFFILE

# ==================== tendering.component.html ====================
cat > "$TARGET_DIR/tendering.component.html" << 'ENDOFFILE'
<div class="tendering-container h-full flex flex-col bg-gray-900 text-gray-100">
  <!-- Header -->
  <header class="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-700/60 bg-gray-900/80 backdrop-blur">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Tendering</h1>
      <p class="text-sm text-gray-400 mt-0.5">Cargas listas para asignar · Tender, Cascade y Reassign</p>
    </div>

    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 text-xs">
        <span class="px-2.5 py-1 rounded-full bg-gray-800 text-gray-300">{{ statusCounts().total }} total</span>
        <span class="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300">{{ statusCounts().pending }} pending</span>
        <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300">{{ statusCounts().accepted }} accepted</span>
        <span class="px-2.5 py-1 rounded-full bg-red-500/15 text-red-300">{{ statusCounts().rejected }} rejected</span>
      </div>
    </div>
  </header>

  <!-- Filters -->
  <div class="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-gray-700/40 bg-gray-900/40">
    <div class="relative">
      <input
        type="text"
        placeholder="Buscar load, origen, destino o carrier..."
        class="input w-72 pl-9"
        [ngModel]="searchTerm()"
        (ngModelChange)="searchTerm.set($event)"
      />
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <div class="flex gap-1.5">
      <button
        class="filter-btn"
        [class.active]="filterStatus() === 'All'"
        (click)="filterStatus.set('All')"
      >All</button>
      <button
        class="filter-btn"
        [class.active]="filterStatus() === 'Pending'"
        (click)="filterStatus.set('Pending')"
      >Pending</button>
      <button
        class="filter-btn"
        [class.active]="filterStatus() === 'Accepted'"
        (click)="filterStatus.set('Accepted')"
      >Accepted</button>
      <button
        class="filter-btn"
        [class.active]="filterStatus() === 'Rejected'"
        (click)="filterStatus.set('Rejected')"
      >Rejected</button>
    </div>
  </div>

  <!-- Loads list -->
  <div class="flex-1 overflow-auto p-6">
    <div class="space-y-3">
      @for (load of filteredLoads(); track load.id) {
        <div class="load-card">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <!-- Left: Load info -->
            <div class="flex-1 min-w-[280px]">
              <div class="flex items-center gap-3 mb-1.5">
                <span class="font-semibold text-base">{{ load.id }}</span>
                <span class="status-badge" [ngClass]="getStatusClass(load.status)">
                  {{ load.status }}
                </span>
                @if (load.cascadeCount > 0) {
                  <span class="text-[11px] px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                    Cascade {{ load.cascadeCount }}
                  </span>
                }
              </div>
              <div class="text-sm text-gray-300 flex items-center gap-2">
                <span>{{ load.origin }}</span>
                <span class="text-gray-500">→</span>
                <span>{{ load.destination }}</span>
              </div>
              <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                <span>{{ load.weight | number }} lbs</span>
                <span>{{ load.volume | number }} ft³</span>
                <span>Pickup: {{ load.pickupDate }}</span>
                @if (load.tenderedAt) {
                  <span>Tendered: {{ load.tenderedAt }}</span>
                }
              </div>
            </div>

            <!-- Center: Selected carrier -->
            <div class="min-w-[200px]">
              <div class="text-xs text-gray-500 mb-1">Carrier seleccionado</div>
              <div class="font-medium text-sm">
                {{ load.selectedCarrier || '— Sin asignar —' }}
              </div>
            </div>

            <!-- Right: Actions -->
            <div class="flex items-center gap-2">
              <button
                class="action-btn tender"
                [disabled]="load.status === 'Accepted'"
                (click)="tender(load)"
                title="Tender load to selected carrier"
              >
                Tender
              </button>
              <button
                class="action-btn cascade"
                (click)="cascade(load)"
                title="Cascade to next carrier in sequence"
              >
                Cascade
              </button>
              <button
                class="action-btn reassign"
                (click)="reassign(load)"
                title="Reassign to a different carrier"
              >
                Reassign
              </button>
            </div>
          </div>
        </div>
      } @empty {
        <div class="text-center py-16 text-gray-500">
          <p class="text-lg">No hay cargas que coincidan con los filtros</p>
          <p class="text-sm mt-1">Ajusta la búsqueda o el estado</p>
        </div>
      }
    </div>
  </div>
</div>
ENDOFFILE

# ==================== tendering.component.scss ====================
cat > "$TARGET_DIR/tendering.component.scss" << 'ENDOFFILE'
/* Tendering Screen - Same design language as other TMS screens */
/* Dark theme, Tailwind primary, SCSS for component-specific polish */

.tendering-container {
  font-family: inherit;
}

.input {
  @apply bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100
         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
         transition-colors;
}

.filter-btn {
  @apply px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-700 text-gray-400
         hover:text-gray-200 hover:border-gray-600 transition-colors;

  &.active {
    @apply bg-blue-600/20 border-blue-500/50 text-blue-300;
  }
}

.load-card {
  @apply bg-gray-800/70 border border-gray-700/80 rounded-xl p-4
         hover:border-gray-600 hover:bg-gray-800 transition-all duration-150;
}

.status-badge {
  @apply text-[11px] font-medium px-2.5 py-0.5 rounded-full;

  &.status-pending {
    @apply bg-amber-500/15 text-amber-300;
  }

  &.status-accepted {
    @apply bg-emerald-500/15 text-emerald-300;
  }

  &.status-rejected {
    @apply bg-red-500/15 text-red-300;
  }
}

.action-btn {
  @apply px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors
         disabled:opacity-40 disabled:cursor-not-allowed;

  &.tender {
    @apply bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600/30 hover:border-blue-500/60;
  }

  &.cascade {
    @apply bg-violet-600/15 border-violet-500/40 text-violet-300 hover:bg-violet-600/25 hover:border-violet-500/60;
  }

  &.reassign {
    @apply bg-gray-700/60 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500;
  }
}

/* Scrollbar polish for dark theme */
.tendering-container ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.tendering-container ::-webkit-scrollbar-track {
  background: transparent;
}

.tendering-container ::-webkit-scrollbar-thumb {
  background: rgb(55 65 81);
  border-radius: 3px;
}

.tendering-container ::-webkit-scrollbar-thumb:hover {
  background: rgb(75 85 99);
}
ENDOFFILE

echo ""
echo "✅ Archivos creados:"
echo "   $TARGET_DIR/tendering.component.ts"
echo "   $TARGET_DIR/tendering.component.html"
echo "   $TARGET_DIR/tendering.component.scss"
echo ""
echo "📌 Agrega esta ruta a tu configuración (mismo estilo que Load Planning):"
echo ""
echo "   { path: 'tendering', component: TenderingComponent, title: 'Tendering' },"
echo ""
echo "Listo. Ajusta el import del componente según tu estructura de rutas."
echo "Los botones Tender, Cascade y Reassign ya actualizan el estado en la lista (datos mock)."
