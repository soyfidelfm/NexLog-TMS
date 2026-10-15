#!/bin/bash

# Script para generar el componente de detalle/edición de orden
# Angular 22 standalone + Tailwind CSS 4 + SCSS
# Uso: ./generate-order-detail.sh

set -e

COMPONENT_DIR="src/app/orders/order-detail"
ASSETS_DIR="src/assets"

echo "Creando directorio del componente..."
mkdir -p "$COMPONENT_DIR"
mkdir -p "$ASSETS_DIR"

echo "Generando order-detail.component.ts..."
cat > "$COMPONENT_DIR/order-detail.component.ts" << 'EOF'
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Order {
  id: string;
  status: 'order-created' | 'pending-confirmation' | 'confirmed' | 'in-transit' | 'out-for-delivery' | 'delivered';
  origin: {
    city: string;
    address: string;
    zip: string;
    date: string;
    window: string;
  };
  destination: {
    city: string;
    address: string;
    zip: string;
    date: string;
    window: string;
  };
  weightLbs: number;
  weightKg: number;
  dimensions: {
    lengthFt: number;
    widthFt: number;
    heightFt: number;
    lengthM: number;
    widthM: number;
    heightM: number;
  };
  productType: string;
  specialRequirements: string[];
  routeDistanceMi: number;
  routeDistanceKm: number;
  transitTime: string;
  estimatedArrival: string;
  timeline: {
    label: string;
    date: string;
    completed: boolean;
    current: boolean;
  }[];
}

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  isEditing = signal(false);
  editForm: Partial<Order> = {};

  order = signal<Order>({
    id: 'ORD-240515-0897',
    status: 'in-transit',
    origin: {
      city: 'Los Angeles, CA, US',
      address: '1234 Industrial Way',
      zip: 'Los Angeles, CA 90001, US',
      date: 'May 16, 2024',
      window: '08:00 – 12:00'
    },
    destination: {
      city: 'Dallas, TX, US',
      address: '5678 Distribution Drive',
      zip: 'Dallas, TX 75201, US',
      date: 'May 17, 2024',
      window: '10:00 – 14:00'
    },
    weightLbs: 18750,
    weightKg: 8504,
    dimensions: {
      lengthFt: 53,
      widthFt: 8.5,
      heightFt: 9.5,
      lengthM: 16.17,
      widthM: 2.59,
      heightM: 2.90
    },
    productType: 'General Merchandise Class 50',
    specialRequirements: ['Liftgate Required', 'Temperature Sensitive', 'Stackable', 'Residential Delivery'],
    routeDistanceMi: 1438.6,
    routeDistanceKm: 2314.8,
    transitTime: '1d 22h 15m',
    estimatedArrival: 'May 17, 2024, 13:45',
    timeline: [
      { label: 'Order Created', date: 'May 15, 09:12', completed: true, current: false },
      { label: 'Pending Confirmation', date: 'May 15, 09:15', completed: true, current: false },
      { label: 'Confirmed', date: 'May 15, 11:47', completed: true, current: false },
      { label: 'In Transit', date: 'May 16, 08:30', completed: false, current: true },
      { label: 'Out for Delivery', date: 'May 17, Est. 14:00', completed: false, current: false },
      { label: 'Delivered', date: 'May 17, Est. 16:30', completed: false, current: false }
    ]
  });

  toggleEdit() {
    if (this.isEditing()) {
      this.cancelEdit();
    } else {
      this.editForm = structuredClone(this.order());
      this.isEditing.set(true);
    }
  }

  save() {
    if (this.editForm) {
      this.order.update(current => ({ ...current, ...this.editForm }));
    }
    this.isEditing.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editForm = {};
  }

  toggleRequirement(req: string) {
    if (!this.editForm.specialRequirements) this.editForm.specialRequirements = [];
    const index = this.editForm.specialRequirements.indexOf(req);
    if (index > -1) {
      this.editForm.specialRequirements.splice(index, 1);
    } else {
      this.editForm.specialRequirements.push(req);
    }
  }
}
EOF

echo "Generando order-detail.component.html..."
cat > "$COMPONENT_DIR/order-detail.component.html" << 'EOF'
<div class="min-h-screen bg-[#0a0f1c] text-slate-100 flex">
  <!-- Sidebar -->
  <aside class="w-64 bg-[#070b14] border-r border-slate-800 flex flex-col">
    <div class="p-6 flex items-center gap-3">
      <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">TMS</div>
      <span class="font-semibold text-lg">Logistics</span>
    </div>
    <nav class="flex-1 px-3 space-y-1">
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
        <span class="text-lg">🏠</span> Dashboard
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-600/20 text-blue-400 font-medium">
        <span class="text-lg">🚚</span> Orders
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
        <span class="text-lg">📦</span> Shipments
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
        <span class="text-lg">🗺️</span> Routing
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
        <span class="text-lg">🏢</span> Assets
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
        <span class="text-lg">👥</span> Customers
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
        <span class="text-lg">💰</span> Rates
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
        <span class="text-lg">📄</span> Documents
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
        <span class="text-lg">📊</span> Reports
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
        <span class="text-lg">⚙️</span> Settings
      </a>
    </nav>
    <div class="p-4 border-t border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center">AM</div>
        <div>
          <div class="text-sm font-medium">Alex Morgan</div>
          <div class="text-xs text-slate-400">Operations</div>
        </div>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 flex flex-col">
    <!-- Header -->
    <header class="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0a0f1c]">
      <div class="flex items-center gap-4">
        <button class="text-slate-400 hover:text-white">←</button>
        <div>
          <h1 class="text-xl font-semibold">Order Details</h1>
          <span class="text-blue-400 font-mono text-sm">{{ order().id }}</span>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <button class="relative text-slate-400 hover:text-white">
          🔔
          <span class="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[10px] flex items-center justify-center">3</span>
        </button>
        <button class="text-slate-400 hover:text-white">?</button>
        <button class="px-4 py-1.5 border border-slate-700 rounded-lg text-sm hover:bg-slate-800">Actions ▾</button>
      </div>
    </header>

    <!-- Timeline -->
    <div class="px-6 py-4 border-b border-slate-800">
      <div class="flex items-center justify-between max-w-5xl mx-auto">
        @for (step of order().timeline; track step.label; let i = $index) {
          <div class="flex flex-col items-center relative">
            <div class="text-xs text-slate-400 mb-2 text-center max-w-[100px]">{{ step.label }}</div>
            <div class="text-[10px] text-slate-500 mb-1">{{ step.date }}</div>
            <div class="relative">
              @if (step.completed) {
                <div class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">✓</div>
              } @else if (step.current) {
                <div class="w-6 h-6 rounded-full bg-blue-500 ring-4 ring-blue-500/30"></div>
              } @else {
                <div class="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-600"></div>
              }
              @if (i < order().timeline.length - 1) {
                <div class="absolute top-1/2 left-full w-full h-0.5 -translate-y-1/2"
                     [class]="step.completed ? 'bg-emerald-500' : 'bg-slate-700'"
                     style="width: calc(100% + 2rem); margin-left: 1.5rem;"></div>
              }
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Content Grid -->
    <div class="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Order Information -->
      <div class="bg-[#111827] rounded-xl border border-slate-800 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold flex items-center gap-2">
            📋 Order Information
            <span class="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">Confirmed</span>
          </h2>
        </div>

        @if (!isEditing()) {
          <!-- View Mode -->
          <div class="space-y-5">
            <div>
              <div class="text-sm text-slate-400 mb-1">Origin</div>
              <div class="flex items-start gap-2">
                <span class="text-blue-400 mt-0.5">📍</span>
                <div>
                  <div class="font-medium">{{ order().origin.city }}</div>
                  <div class="text-sm text-slate-300">{{ order().origin.address }}</div>
                  <div class="text-sm text-slate-400">{{ order().origin.zip }}</div>
                  <div class="text-xs text-slate-500 mt-1">🕒 {{ order().origin.date }}, {{ order().origin.window }}</div>
                </div>
              </div>
            </div>

            <div>
              <div class="text-sm text-slate-400 mb-1">Destination</div>
              <div class="flex items-start gap-2">
                <span class="text-purple-400 mt-0.5">📍</span>
                <div>
                  <div class="font-medium">{{ order().destination.city }}</div>
                  <div class="text-sm text-slate-300">{{ order().destination.address }}</div>
                  <div class="text-sm text-slate-400">{{ order().destination.zip }}</div>
                  <div class="text-xs text-slate-500 mt-1">🕒 {{ order().destination.date }}, {{ order().destination.window }}</div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4 pt-2">
              <div class="bg-slate-800/50 rounded-lg p-3">
                <div class="text-xs text-slate-400">Weight</div>
                <div class="font-semibold">{{ order().weightLbs | number }} lbs</div>
                <div class="text-xs text-slate-500">{{ order().weightKg | number }} kg</div>
              </div>
              <div class="bg-slate-800/50 rounded-lg p-3">
                <div class="text-xs text-slate-400">Dimensions</div>
                <div class="font-semibold text-sm">{{ order().dimensions.lengthFt }}' L × {{ order().dimensions.widthFt }}' W × {{ order().dimensions.heightFt }}' H</div>
                <div class="text-xs text-slate-500">{{ order().dimensions.lengthM }} m × {{ order().dimensions.widthM }} m × {{ order().dimensions.heightM }} m</div>
              </div>
              <div class="bg-slate-800/50 rounded-lg p-3">
                <div class="text-xs text-slate-400">Product Type</div>
                <div class="font-semibold text-sm">{{ order().productType }}</div>
              </div>
            </div>

            <div>
              <div class="text-sm text-slate-400 mb-2">Special Requirements</div>
              <div class="flex flex-wrap gap-2">
                @for (req of order().specialRequirements; track req) {
                  <span class="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full border border-slate-700">{{ req }}</span>
                }
              </div>
            </div>
          </div>
        } @else {
          <!-- Edit Mode -->
          <div class="space-y-4">
            <div>
              <label class="text-sm text-slate-400">Origin City</label>
              <input [(ngModel)]="editForm.origin!.city" class="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
            </div>
            <div>
              <label class="text-sm text-slate-400">Origin Address</label>
              <input [(ngModel)]="editForm.origin!.address" class="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
            </div>
            <div>
              <label class="text-sm text-slate-400">Destination City</label>
              <input [(ngModel)]="editForm.destination!.city" class="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
            </div>
            <div>
              <label class="text-sm text-slate-400">Destination Address</label>
              <input [(ngModel)]="editForm.destination!.address" class="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-sm text-slate-400">Weight (lbs)</label>
                <input type="number" [(ngModel)]="editForm.weightLbs" class="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
              </div>
              <div>
                <label class="text-sm text-slate-400">Product Type</label>
                <input [(ngModel)]="editForm.productType" class="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
              </div>
            </div>
            <div>
              <label class="text-sm text-slate-400 mb-2 block">Special Requirements</label>
              <div class="flex flex-wrap gap-2">
                @for (req of ['Liftgate Required', 'Temperature Sensitive', 'Stackable', 'Residential Delivery']; track req) {
                  <button type="button"
                          (click)="toggleRequirement(req)"
                          class="px-3 py-1 text-xs rounded-full border transition-colors"
                          [class]="editForm.specialRequirements?.includes(req) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'">
                    {{ req }}
                  </button>
                }
              </div>
            </div>
          </div>
        }

        <div class="flex gap-3 mt-6">
          @if (!isEditing()) {
            <button (click)="toggleEdit()" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2">
              ✏️ Edit Order
            </button>
            <button class="flex-1 border border-slate-700 hover:bg-slate-800 py-2.5 rounded-lg font-medium">
              📄 More Details
            </button>
          } @else {
            <button (click)="save()" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-medium">
              💾 Guardar
            </button>
            <button (click)="cancelEdit()" class="flex-1 border border-slate-700 hover:bg-slate-800 py-2.5 rounded-lg font-medium">
              Cancelar
            </button>
          }
        </div>
      </div>

      <!-- Route Preview -->
      <div class="bg-[#111827] rounded-xl border border-slate-800 p-5 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold flex items-center gap-2">🗺️ Route Preview</h2>
          <div class="flex gap-2">
            <button class="px-3 py-1.5 text-xs border border-slate-700 rounded-lg hover:bg-slate-800">Fit to Route</button>
            <button class="px-3 py-1.5 text-xs border border-slate-700 rounded-lg hover:bg-slate-800">↗</button>
          </div>
        </div>

        <div class="flex-1 relative rounded-lg overflow-hidden bg-slate-900 min-h-[280px]">
          <img src="/assets/route-map.jpg" alt="Route map" class="w-full h-full object-cover">
        </div>

        <div class="mt-4 grid grid-cols-1 gap-3">
          <div class="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3">
            <span class="text-emerald-400">📏</span>
            <div>
              <div class="text-xs text-slate-400">Route Distance</div>
              <div class="font-semibold">{{ order().routeDistanceMi | number:'1.1-1' }} mi</div>
              <div class="text-xs text-slate-500">{{ order().routeDistanceKm | number:'1.1-1' }} km</div>
            </div>
          </div>
          <div class="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3">
            <span class="text-blue-400">⏱️</span>
            <div>
              <div class="text-xs text-slate-400">Transit Time</div>
              <div class="font-semibold">{{ order().transitTime }}</div>
            </div>
          </div>
          <div class="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3">
            <span class="text-emerald-400">🚚</span>
            <div>
              <div class="text-xs text-slate-400">Estimated Arrival</div>
              <div class="font-semibold">{{ order().estimatedArrival }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="text-center text-xs text-slate-500 py-3 border-t border-slate-800">
      © 2024 TMS Logistics
    </footer>
  </main>
</div>
EOF

echo "Generando order-detail.component.scss..."
cat > "$COMPONENT_DIR/order-detail.component.scss" << 'EOF'
:host {
  display: block;
  height: 100%;
}

/* Custom scrollbar for dark theme */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #0a0f1c;
}

::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
EOF

# Copy map image if it exists next to the script
if [ -f "route-map.jpg" ]; then
  echo "Copiando route-map.jpg a assets..."
  cp route-map.jpg "$ASSETS_DIR/route-map.jpg"
else
  echo "⚠️  No se encontró route-map.jpg junto al script."
  echo "   Colócalo manualmente en $ASSETS_DIR/route-map.jpg"
fi

echo ""
echo "✅ Componente generado en: $COMPONENT_DIR"
echo ""
echo "Para usarlo, importa OrderDetailComponent en tu ruta o componente padre:"
echo "  import { OrderDetailComponent } from './orders/order-detail/order-detail.component';"
echo ""
echo "Y agrégalo a los imports y al template:"
echo "  <app-order-detail></app-order-detail>"
