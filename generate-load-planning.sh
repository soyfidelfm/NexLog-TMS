#!/bin/bash

# Script para generar la pantalla Load Planning / Load Building
# Ejecutar desde la raíz del frontend Angular (donde está src/)

set -e

COMPONENT_DIR="src/app/features/load-planning"
mkdir -p "$COMPONENT_DIR"

echo "Generando componente Load Planning..."

# ==================== component.ts ====================
cat > "$COMPONENT_DIR/load-planning.component.ts" << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

interface Order {
  id: string;
  customer: string;
  origin: string;
  destination: string;
  weight: number;   // lbs
  volume: number;   // cubic ft
  priority: 'High' | 'Medium' | 'Low';
}

interface Trailer {
  id: string;
  name: string;
  type: string;
  maxWeight: number;
  maxVolume: number;
  assigned: Order[];
}

@Component({
  selector: 'app-load-planning',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './load-planning.component.html',
  styleUrl: './load-planning.component.scss',
})
export class LoadPlanningComponent {
  unassigned: Order[] = [
    { id: 'ORD-1042', customer: 'Acme Corp', origin: 'Los Angeles, CA', destination: 'Phoenix, AZ', weight: 4200, volume: 180, priority: 'High' },
    { id: 'ORD-1045', customer: 'Global Foods', origin: 'San Diego, CA', destination: 'Las Vegas, NV', weight: 2800, volume: 220, priority: 'Medium' },
    { id: 'ORD-1048', customer: 'TechParts Inc', origin: 'Irvine, CA', destination: 'Salt Lake City, UT', weight: 1500, volume: 90, priority: 'Low' },
    { id: 'ORD-1051', customer: 'BuildRight', origin: 'Los Angeles, CA', destination: 'Denver, CO', weight: 6100, volume: 310, priority: 'High' },
    { id: 'ORD-1053', customer: 'FreshMart', origin: 'Bakersfield, CA', destination: 'Phoenix, AZ', weight: 3400, volume: 260, priority: 'Medium' },
    { id: 'ORD-1057', customer: 'AutoSupply', origin: 'Ontario, CA', destination: 'Albuquerque, NM', weight: 2200, volume: 140, priority: 'Low' },
  ];

  trailers: Trailer[] = [
    {
      id: 'TRL-01',
      name: 'Trailer 01',
      type: 'Dry Van 53\'',
      maxWeight: 45000,
      maxVolume: 3800,
      assigned: [
        { id: 'ORD-1038', customer: 'Pacific Steel', origin: 'Long Beach, CA', destination: 'Phoenix, AZ', weight: 18500, volume: 980, priority: 'High' },
        { id: 'ORD-1040', customer: 'Valley Produce', origin: 'Fresno, CA', destination: 'Tucson, AZ', weight: 9200, volume: 640, priority: 'Medium' },
      ],
    },
    {
      id: 'TRL-02',
      name: 'Trailer 02',
      type: 'Dry Van 53\'',
      maxWeight: 45000,
      maxVolume: 3800,
      assigned: [
        { id: 'ORD-1035', customer: 'WestCoast Logistics', origin: 'Los Angeles, CA', destination: 'Las Vegas, NV', weight: 12400, volume: 720, priority: 'Medium' },
      ],
    },
    {
      id: 'TRL-03',
      name: 'Trailer 03',
      type: 'Reefer 53\'',
      maxWeight: 42000,
      maxVolume: 3400,
      assigned: [],
    },
    {
      id: 'TRL-04',
      name: 'Trailer 04',
      type: 'Dry Van 48\'',
      maxWeight: 40000,
      maxVolume: 3200,
      assigned: [
        { id: 'ORD-1031', customer: 'Mountain Goods', origin: 'San Bernardino, CA', destination: 'Salt Lake City, UT', weight: 7800, volume: 410, priority: 'Low' },
      ],
    },
  ];

  // IDs de las listas conectadas para CDK
  get dropListIds(): string[] {
    return ['unassigned', ...this.trailers.map(t => t.id)];
  }

  getUsedWeight(trailer: Trailer): number {
    return trailer.assigned.reduce((sum, o) => sum + o.weight, 0);
  }

  getUsedVolume(trailer: Trailer): number {
    return trailer.assigned.reduce((sum, o) => sum + o.volume, 0);
  }

  getWeightPercent(trailer: Trailer): number {
    return Math.min(100, (this.getUsedWeight(trailer) / trailer.maxWeight) * 100);
  }

  getVolumePercent(trailer: Trailer): number {
    return Math.min(100, (this.getUsedVolume(trailer) / trailer.maxVolume) * 100);
  }

  getCapacityClass(percent: number): string {
    if (percent >= 95) return 'bg-red-500';
    if (percent >= 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  }

  drop(event: CdkDragDrop<Order[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  // Opcional: quitar de un tráiler (botón)
  removeFromTrailer(trailer: Trailer, index: number) {
    const [order] = trailer.assigned.splice(index, 1);
    this.unassigned.push(order);
  }
}
EOF

# ==================== component.html ====================
cat > "$COMPONENT_DIR/load-planning.component.html" << 'EOF'
<div class="load-planning h-full flex flex-col bg-slate-950 text-slate-100">
  <!-- Header -->
  <header class="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
    <div>
      <h1 class="text-xl font-semibold tracking-tight">Load Planning</h1>
      <p class="text-sm text-slate-400">Drag orders onto trailers • Capacity shown in real time</p>
    </div>
    <div class="flex items-center gap-3 text-sm">
      <span class="px-3 py-1 rounded-full bg-slate-800 text-slate-300">
        {{ unassigned.length }} unassigned
      </span>
      <button class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition">
        Optimize Loads
      </button>
    </div>
  </header>

  <div class="flex flex-1 overflow-hidden">
    <!-- Left: Unassigned Orders -->
    <aside class="w-80 shrink-0 border-r border-slate-800 flex flex-col bg-slate-900/50">
      <div class="px-4 py-3 border-b border-slate-800">
        <h2 class="font-medium text-sm uppercase tracking-wider text-slate-400">Unassigned Orders</h2>
      </div>

      <div
        id="unassigned"
        cdkDropList
        [cdkDropListData]="unassigned"
        [cdkDropListConnectedTo]="dropListIds"
        (cdkDropListDropped)="drop($event)"
        class="flex-1 overflow-y-auto p-3 space-y-2"
      >
        @for (order of unassigned; track order.id) {
          <div
            cdkDrag
            class="order-card bg-slate-800/80 border border-slate-700 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-slate-500 transition"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="font-medium text-sm">{{ order.id }}</div>
                <div class="text-xs text-slate-400 mt-0.5">{{ order.customer }}</div>
              </div>
              <span
                class="text-[10px] px-1.5 py-0.5 rounded font-medium uppercase"
                [class]="order.priority === 'High' ? 'bg-red-500/20 text-red-400' : order.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-600 text-slate-300'"
              >
                {{ order.priority }}
              </span>
            </div>
            <div class="mt-2 text-xs text-slate-400 flex items-center gap-1">
              <span>{{ order.origin.split(',')[0] }}</span>
              <span>→</span>
              <span>{{ order.destination.split(',')[0] }}</span>
            </div>
            <div class="mt-2 flex items-center justify-between text-xs">
              <span class="text-slate-300">{{ order.weight | number }} lbs</span>
              <span class="text-slate-300">{{ order.volume | number }} ft³</span>
            </div>

            <!-- Placeholder while dragging -->
            <div *cdkDragPlaceholder class="order-placeholder h-[88px] rounded-lg border-2 border-dashed border-blue-500/50 bg-blue-500/10"></div>
          </div>
        } @empty {
          <div class="text-center text-slate-500 text-sm py-8">All orders assigned</div>
        }
      </div>
    </aside>

    <!-- Center: Trailers Board -->
    <main class="flex-1 overflow-x-auto p-5">
      <div class="flex gap-4 h-full min-w-max">
        @for (trailer of trailers; track trailer.id) {
          <div class="trailer-card w-[340px] shrink-0 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <!-- Trailer header -->
            <div class="px-4 py-3 border-b border-slate-800 bg-slate-800/40">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold">{{ trailer.name }}</h3>
                  <p class="text-xs text-slate-400">{{ trailer.type }}</p>
                </div>
                <span class="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
                  {{ trailer.assigned.length }} loads
                </span>
              </div>

              <!-- Capacity indicators -->
              <div class="mt-3 space-y-2">
                <!-- Weight -->
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-slate-400">Weight</span>
                    <span>
                      {{ getUsedWeight(trailer) | number }} / {{ trailer.maxWeight | number }} lbs
                      <span class="text-slate-500">({{ getWeightPercent(trailer) | number:'1.0-0' }}%)</span>
                    </span>
                  </div>
                  <div class="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-300"
                      [class]="getCapacityClass(getWeightPercent(trailer))"
                      [style.width.%]="getWeightPercent(trailer)"
                    ></div>
                  </div>
                </div>

                <!-- Volume -->
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-slate-400">Volume</span>
                    <span>
                      {{ getUsedVolume(trailer) | number }} / {{ trailer.maxVolume | number }} ft³
                      <span class="text-slate-500">({{ getVolumePercent(trailer) | number:'1.0-0' }}%)</span>
                    </span>
                  </div>
                  <div class="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-300"
                      [class]="getCapacityClass(getVolumePercent(trailer))"
                      [style.width.%]="getVolumePercent(trailer)"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Drop zone -->
            <div
              [id]="trailer.id"
              cdkDropList
              [cdkDropListData]="trailer.assigned"
              [cdkDropListConnectedTo]="dropListIds"
              (cdkDropListDropped)="drop($event)"
              class="flex-1 p-3 space-y-2 min-h-[280px] overflow-y-auto"
              [class.empty]="trailer.assigned.length === 0"
            >
              @for (order of trailer.assigned; track order.id; let i = $index) {
                <div
                  cdkDrag
                  class="order-card bg-slate-800 border border-slate-700 rounded-lg p-3 cursor-grab active:cursor-grabbing group"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <div class="font-medium text-sm">{{ order.id }}</div>
                      <div class="text-xs text-slate-400">{{ order.customer }}</div>
                    </div>
                    <button
                      (click)="removeFromTrailer(trailer, i)"
                      class="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 text-xs transition"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                  <div class="mt-1.5 text-xs text-slate-400">
                    {{ order.origin.split(',')[0] }} → {{ order.destination.split(',')[0] }}
                  </div>
                  <div class="mt-1.5 flex justify-between text-xs text-slate-300">
                    <span>{{ order.weight | number }} lbs</span>
                    <span>{{ order.volume | number }} ft³</span>
                  </div>
                </div>
              } @empty {
                <div class="h-full flex items-center justify-center text-slate-600 text-sm border-2 border-dashed border-slate-700 rounded-lg">
                  Drop orders here
                </div>
              }
            </div>
          </div>
        }
      </div>
    </main>
  </div>
</div>
EOF

# ==================== component.scss ====================
cat > "$COMPONENT_DIR/load-planning.component.scss" << 'EOF'
:host {
  display: block;
  height: 100%;
}

.load-planning {
  height: 100%;
}

.order-card {
  user-select: none;

  &.cdk-drag-preview {
    box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.4);
    border-color: rgb(59 130 246 / 0.5);
  }

  &.cdk-drag-animating {
    transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
  }
}

.cdk-drop-list-dragging .order-card:not(.cdk-drag-placeholder) {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}

.order-placeholder {
  opacity: 0.6;
}

.trailer-card {
  .empty {
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgb(30 41 59 / 0.3) 10px,
      rgb(30 41 59 / 0.3) 20px
    );
  }
}

/* Scrollbar discreto */
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
EOF

echo ""
echo "✅ Componente generado en: $COMPONENT_DIR"
echo ""
echo "Siguientes pasos:"
echo "1. Asegúrate de tener @angular/cdk instalado:"
echo "   npm install @angular/cdk"
echo ""
echo "2. Agrega la ruta en app.routes.ts (o tu routing):"
echo "   { path: 'load-planning', component: LoadPlanningComponent, title: 'Load Planning' }"
echo ""
echo "3. Importa el componente donde lo necesites (es standalone)."
echo ""
echo "Listo. El drag-and-drop ya funciona entre la lista y los tráilers."
