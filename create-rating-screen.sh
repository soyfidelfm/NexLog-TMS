#!/bin/bash
# create-rating-screen.sh
# Genera la pantalla de Rating / Cotización para NexLog TMS
# Uso: bash create-rating-screen.sh
# Crea los archivos en ./src/app/features/rating/ (ajusta la ruta si es necesario)

set -e

TARGET_DIR="${1:-./src/app/features/rating}"
mkdir -p "$TARGET_DIR"

echo "Creando pantalla Rating / Cotización en: $TARGET_DIR"

# rating.component.ts
cat > "$TARGET_DIR/rating.component.ts" << 'ENDOFFILE'
import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface CarrierQuote {
  id: string;
  carrier: string;
  logo?: string;
  price: number;
  currency: string;
  transitDays: number;
  serviceType: string;
  onTimePercent: number;
  rating: number;
  fuelSurcharge: number;
  total: number;
  notes?: string;
}

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingComponent {
  private readonly fb = inject(FormBuilder);

  quoteForm: FormGroup = this.fb.group({
    originCity: ['', Validators.required],
    originZip: ['', Validators.required],
    destinationCity: ['', Validators.required],
    destinationZip: ['', Validators.required],
    weight: [0, [Validators.required, Validators.min(0.1)]],
    length: [0],
    width: [0],
    height: [0],
    pieces: [1, [Validators.required, Validators.min(1)]],
    commodity: ['General Freight'],
    pickupDate: [new Date().toISOString().split('T')[0], Validators.required],
    serviceLevel: ['Standard']
  });

  isLoading = signal(false);
  quotes = signal<CarrierQuote[]>([]);
  sortBy = signal<'price' | 'transit'>('price');

  sortedQuotes = computed(() => {
    const list = [...this.quotes()];
    if (this.sortBy() === 'price') {
      return list.sort((a, b) => a.total - b.total);
    }
    return list.sort((a, b) => a.transitDays - b.transitDays);
  });

  hasResults = computed(() => this.quotes().length > 0);

  getQuotes(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.quotes.set([]);

    // Simulate API call
    setTimeout(() => {
      const mockQuotes: CarrierQuote[] = [
        {
          id: '1',
          carrier: 'FedEx Freight',
          price: 485.50,
          currency: 'USD',
          transitDays: 3,
          serviceType: 'Priority',
          onTimePercent: 96.2,
          rating: 4.7,
          fuelSurcharge: 42.30,
          total: 527.80,
          notes: 'Best for express'
        },
        {
          id: '2',
          carrier: 'UPS Freight',
          price: 462.00,
          currency: 'USD',
          transitDays: 4,
          serviceType: 'Standard',
          onTimePercent: 94.8,
          rating: 4.5,
          fuelSurcharge: 38.90,
          total: 500.90
        },
        {
          id: '3',
          carrier: 'XPO Logistics',
          price: 439.75,
          currency: 'USD',
          transitDays: 5,
          serviceType: 'Economy',
          onTimePercent: 91.5,
          rating: 4.2,
          fuelSurcharge: 35.20,
          total: 474.95,
          notes: 'Lowest price'
        },
        {
          id: '4',
          carrier: 'Old Dominion',
          price: 451.20,
          currency: 'USD',
          transitDays: 4,
          serviceType: 'Standard',
          onTimePercent: 97.1,
          rating: 4.8,
          fuelSurcharge: 39.50,
          total: 490.70
        },
        {
          id: '5',
          carrier: 'Estes Express',
          price: 478.00,
          currency: 'USD',
          transitDays: 3,
          serviceType: 'Priority',
          onTimePercent: 93.4,
          rating: 4.4,
          fuelSurcharge: 41.00,
          total: 519.00
        }
      ];

      this.quotes.set(mockQuotes);
      this.isLoading.set(false);
    }, 800);
  }

  setSort(sort: 'price' | 'transit'): void {
    this.sortBy.set(sort);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }
}
ENDOFFILE

# rating.component.html
cat > "$TARGET_DIR/rating.component.html" << 'ENDOFFILE'
<div class="rating-container h-full flex bg-gray-900 text-gray-100">
  <!-- Left Panel: Shipment Form -->
  <aside class="w-96 min-w-[380px] border-r border-gray-700/60 bg-gray-900/80 p-6 overflow-y-auto flex flex-col">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold tracking-tight">Rating / Cotización</h1>
      <p class="text-sm text-gray-400 mt-1">Ingresa los datos del envío para obtener cotizaciones</p>
    </div>

    <form [formGroup]="quoteForm" (ngSubmit)="getQuotes()" class="flex-1 flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="label">Ciudad Origen</label>
          <input formControlName="originCity" class="input" placeholder="Los Angeles" />
        </div>
        <div>
          <label class="label">ZIP Origen</label>
          <input formControlName="originZip" class="input" placeholder="90001" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="label">Ciudad Destino</label>
          <input formControlName="destinationCity" class="input" placeholder="New York" />
        </div>
        <div>
          <label class="label">ZIP Destino</label>
          <input formControlName="destinationZip" class="input" placeholder="10001" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="label">Peso (lbs)</label>
          <input type="number" formControlName="weight" class="input" placeholder="0" />
        </div>
        <div>
          <label class="label">Piezas</label>
          <input type="number" formControlName="pieces" class="input" />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="label text-xs">Largo</label>
          <input type="number" formControlName="length" class="input text-sm" placeholder="in" />
        </div>
        <div>
          <label class="label text-xs">Ancho</label>
          <input type="number" formControlName="width" class="input text-sm" placeholder="in" />
        </div>
        <div>
          <label class="label text-xs">Alto</label>
          <input type="number" formControlName="height" class="input text-sm" placeholder="in" />
        </div>
      </div>

      <div>
        <label class="label">Mercancía</label>
        <select formControlName="commodity" class="input">
          <option>General Freight</option>
          <option>Electronics</option>
          <option>Automotive</option>
          <option>Food & Beverage</option>
          <option>Hazardous</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="label">Fecha Recolección</label>
          <input type="date" formControlName="pickupDate" class="input" />
        </div>
        <div>
          <label class="label">Nivel de Servicio</label>
          <select formControlName="serviceLevel" class="input">
            <option>Standard</option>
            <option>Priority</option>
            <option>Economy</option>
            <option>Express</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        class="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
        [disabled]="isLoading()"
      >
        @if (isLoading()) {
          Obteniendo cotizaciones...
        } @else {
          Obtener Cotizaciones
        }
      </button>
    </form>
  </aside>

  <!-- Right Panel: Results -->
  <main class="flex-1 flex flex-col overflow-hidden">
    @if (!hasResults() && !isLoading()) {
      <div class="flex-1 flex items-center justify-center text-gray-500">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-3 text-sm">Ingresa los datos del envío para ver cotizaciones</p>
        </div>
      </div>
    }

    @if (isLoading()) {
      <div class="flex-1 flex items-center justify-center">
        <div class="animate-pulse text-gray-400">Buscando las mejores tarifas...</div>
      </div>
    }

    @if (hasResults()) {
      <div class="p-6 border-b border-gray-700/60 flex items-center justify-between bg-gray-900/50">
        <div>
          <h2 class="text-lg font-medium">Resultados de Carriers</h2>
          <p class="text-sm text-gray-400">{{ sortedQuotes().length }} opciones encontradas</p>
        </div>
        <div class="flex gap-2">
          <button
            class="sort-btn"
            [class.active]="sortBy() === 'price'"
            (click)="setSort('price')"
          >
            Precio
          </button>
          <button
            class="sort-btn"
            [class.active]="sortBy() === 'transit'"
            (click)="setSort('transit')"
          >
            Tiempo de Tránsito
          </button>
        </div>
      </div>

      <!-- Carrier Cards -->
      <div class="flex-1 overflow-y-auto p-6 space-y-3">
        @for (quote of sortedQuotes(); track quote.id) {
          <div class="carrier-card">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-xs font-bold">
                    {{ quote.carrier.substring(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <h3 class="font-semibold">{{ quote.carrier }}</h3>
                    <p class="text-xs text-gray-400">{{ quote.serviceType }} • {{ quote.transitDays }} días</p>
                  </div>
                </div>
                <div class="mt-3 flex gap-4 text-sm">
                  <span class="text-emerald-400">★ {{ quote.rating }}</span>
                  <span class="text-gray-400">On-time {{ quote.onTimePercent }}%</span>
                  @if (quote.notes) {
                    <span class="text-blue-400 text-xs">{{ quote.notes }}</span>
                  }
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-emerald-400">{{ formatCurrency(quote.total) }}</div>
                <div class="text-xs text-gray-500">Base {{ formatCurrency(quote.price) }} + Fuel</div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Comparison Table -->
      <div class="border-t border-gray-700/60 p-6 bg-gray-900/40">
        <h3 class="text-sm font-medium text-gray-300 mb-3">Comparación Detallada</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-gray-400 border-b border-gray-700">
                <th class="pb-2 pr-4">Carrier</th>
                <th class="pb-2 pr-4">Servicio</th>
                <th class="pb-2 pr-4 text-right">Base</th>
                <th class="pb-2 pr-4 text-right">Fuel</th>
                <th class="pb-2 pr-4 text-right">Total</th>
                <th class="pb-2 pr-4 text-center">Días</th>
                <th class="pb-2 text-center">On-Time</th>
              </tr>
            </thead>
            <tbody>
              @for (quote of sortedQuotes(); track quote.id) {
                <tr class="border-b border-gray-800/60 hover:bg-gray-800/40">
                  <td class="py-2.5 pr-4 font-medium">{{ quote.carrier }}</td>
                  <td class="py-2.5 pr-4 text-gray-400">{{ quote.serviceType }}</td>
                  <td class="py-2.5 pr-4 text-right">{{ formatCurrency(quote.price) }}</td>
                  <td class="py-2.5 pr-4 text-right">{{ formatCurrency(quote.fuelSurcharge) }}</td>
                  <td class="py-2.5 pr-4 text-right font-semibold text-emerald-400">{{ formatCurrency(quote.total) }}</td>
                  <td class="py-2.5 pr-4 text-center">{{ quote.transitDays }}</td>
                  <td class="py-2.5 text-center">{{ quote.onTimePercent }}%</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  </main>
</div>
ENDOFFILE

# rating.component.scss
cat > "$TARGET_DIR/rating.component.scss" << 'ENDOFFILE'
/* Rating / Cotización Screen - Same design language as other TMS screens */
/* Dark theme, Tailwind primary, SCSS for component-specific polish */

.rating-container {
  font-family: inherit;
}

.label {
  @apply block text-xs font-medium text-gray-400 mb-1.5;
}

.input {
  @apply w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 
         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
         transition-colors;
}

.carrier-card {
  @apply bg-gray-800/70 border border-gray-700/80 rounded-xl p-4 hover:border-gray-600 hover:bg-gray-800
         transition-all duration-150;
}

.sort-btn {
  @apply px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-700 text-gray-400
         hover:text-gray-200 hover:border-gray-600 transition-colors;

  &.active {
    @apply bg-blue-600/20 border-blue-500/50 text-blue-300;
  }
}

/* Scrollbar polish for dark theme */
.rating-container ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.rating-container ::-webkit-scrollbar-track {
  background: transparent;
}

.rating-container ::-webkit-scrollbar-thumb {
  background: rgb(55 65 81);
  border-radius: 3px;
}

.rating-container ::-webkit-scrollbar-thumb:hover {
  background: rgb(75 85 99);
}
ENDOFFILE

echo ""
echo "✅ Archivos creados:"
echo "   $TARGET_DIR/rating.component.ts"
echo "   $TARGET_DIR/rating.component.html"
echo "   $TARGET_DIR/rating.component.scss"
echo ""
echo "📌 Agrega esta ruta a tu configuración (mismo estilo que Load Planning):"
echo ""
echo "   { path: 'rating', component: RatingComponent, title: 'Rating / Cotización' },"
echo ""
echo "Listo. Ajusta el import del componente según tu estructura de rutas."
