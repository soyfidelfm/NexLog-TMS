#!/bin/bash

# Script para generar la pantalla Rate Tables Configuration
# Formulario de configuración de tabla de tarifas + tabla de roles y permisos
# Mismo diseño dark theme, Tailwind CSS 4 + SCSS
# Ejecutar desde la raíz del frontend Angular (donde está src/)
# Uso: bash generate-rate-tables.sh

set -e

COMPONENT_DIR="src/app/features/rate-tables"
mkdir -p "$COMPONENT_DIR"

echo "Generando componente Rate Tables..."

# ==================== component.ts ====================
cat > "$COMPONENT_DIR/rate-tables.component.ts" << 'EOF'
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

interface RateTable {
  id: string;
  name: string;
  carrier: string;
  originZone: string;
  destinationZone: string;
  mode: string;
  rateType: string;
  baseRate: number;
  minCharge: number;
  fuelSurcharge: number;
  effectiveFrom: string;
  effectiveTo: string;
  status: 'Active' | 'Draft' | 'Expired';
}

interface RolePermission {
  role: string;
  description: string;
  view: boolean;
  createEdit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
  managePermissions: boolean;
}

@Component({
  selector: 'app-rate-tables',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './rate-tables.component.html',
  styleUrl: './rate-tables.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateTablesComponent {
  private readonly fb = inject(FormBuilder);

  rateForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    carrier: ['', Validators.required],
    originZone: ['', Validators.required],
    destinationZone: ['', Validators.required],
    mode: ['TL', Validators.required],
    rateType: ['Per Mile', Validators.required],
    baseRate: [0, [Validators.required, Validators.min(0)]],
    minCharge: [0, Validators.min(0)],
    fuelSurcharge: [0, [Validators.min(0), Validators.max(100)]],
    effectiveFrom: [new Date().toISOString().split('T')[0], Validators.required],
    effectiveTo: [''],
    status: ['Draft', Validators.required],
  });

  rateTables = signal<RateTable[]>([
    {
      id: 'RT-001',
      name: 'West Coast TL Standard',
      carrier: 'Swift Transportation',
      originZone: 'CA, NV, AZ',
      destinationZone: 'All US',
      mode: 'TL',
      rateType: 'Per Mile',
      baseRate: 2.45,
      minCharge: 850,
      fuelSurcharge: 18.5,
      effectiveFrom: '2026-01-01',
      effectiveTo: '2026-12-31',
      status: 'Active',
    },
    {
      id: 'RT-002',
      name: 'LTL Regional East',
      carrier: 'FedEx Freight',
      originZone: 'NY, NJ, PA',
      destinationZone: 'Northeast',
      mode: 'LTL',
      rateType: 'Per CWT',
      baseRate: 18.75,
      minCharge: 125,
      fuelSurcharge: 22.0,
      effectiveFrom: '2026-03-01',
      effectiveTo: '2026-09-30',
      status: 'Active',
    },
    {
      id: 'RT-003',
      name: 'Intermodal Flat Rate',
      carrier: 'JB Hunt',
      originZone: 'Midwest',
      destinationZone: 'West Coast',
      mode: 'Intermodal',
      rateType: 'Flat',
      baseRate: 1850,
      minCharge: 1850,
      fuelSurcharge: 12.0,
      effectiveFrom: '2026-06-01',
      effectiveTo: '',
      status: 'Draft',
    },
  ]);

  roles = signal<RolePermission[]>([
    {
      role: 'Admin',
      description: 'Full system access',
      view: true,
      createEdit: true,
      delete: true,
      approve: true,
      export: true,
      managePermissions: true,
    },
    {
      role: 'Dispatcher',
      description: 'Operations & load planning',
      view: true,
      createEdit: true,
      delete: false,
      approve: false,
      export: true,
      managePermissions: false,
    },
    {
      role: 'Carrier Manager',
      description: 'Carrier relations & scoring',
      view: true,
      createEdit: true,
      delete: false,
      approve: true,
      export: true,
      managePermissions: false,
    },
    {
      role: 'Billing',
      description: 'Invoices & freight audit',
      view: true,
      createEdit: false,
      delete: false,
      approve: true,
      export: true,
      managePermissions: false,
    },
    {
      role: 'Read Only',
      description: 'View-only access',
      view: true,
      createEdit: false,
      delete: false,
      approve: false,
      export: false,
      managePermissions: false,
    },
  ]);

  isSaving = signal(false);
  selectedRateId = signal<string | null>(null);

  saveRateTable(): void {
    if (this.rateForm.invalid) {
      this.rateForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);

    const value = this.rateForm.getRawValue();
    const newRate: RateTable = {
      id: this.selectedRateId() || `RT-${String(this.rateTables().length + 1).padStart(3, '0')}`,
      name: value.name,
      carrier: value.carrier,
      originZone: value.originZone,
      destinationZone: value.destinationZone,
      mode: value.mode,
      rateType: value.rateType,
      baseRate: Number(value.baseRate),
      minCharge: Number(value.minCharge),
      fuelSurcharge: Number(value.fuelSurcharge),
      effectiveFrom: value.effectiveFrom,
      effectiveTo: value.effectiveTo || '',
      status: value.status,
    };

    setTimeout(() => {
      if (this.selectedRateId()) {
        this.rateTables.update(list =>
          list.map(r => (r.id === this.selectedRateId() ? newRate : r))
        );
      } else {
        this.rateTables.update(list => [...list, newRate]);
      }
      this.isSaving.set(false);
      this.resetForm();
    }, 600);
  }

  editRate(rate: RateTable): void {
    this.selectedRateId.set(rate.id);
    this.rateForm.patchValue({
      name: rate.name,
      carrier: rate.carrier,
      originZone: rate.originZone,
      destinationZone: rate.destinationZone,
      mode: rate.mode,
      rateType: rate.rateType,
      baseRate: rate.baseRate,
      minCharge: rate.minCharge,
      fuelSurcharge: rate.fuelSurcharge,
      effectiveFrom: rate.effectiveFrom,
      effectiveTo: rate.effectiveTo,
      status: rate.status,
    });
  }

  resetForm(): void {
    this.selectedRateId.set(null);
    this.rateForm.reset({
      mode: 'TL',
      rateType: 'Per Mile',
      status: 'Draft',
      baseRate: 0,
      minCharge: 0,
      fuelSurcharge: 0,
      effectiveFrom: new Date().toISOString().split('T')[0],
    });
  }

  togglePermission(roleIndex: number, permission: keyof Omit<RolePermission, 'role' | 'description'>): void {
    this.roles.update(list => {
      const updated = [...list];
      const role = { ...updated[roleIndex] };
      role[permission] = !role[permission];
      updated[roleIndex] = role;
      return updated;
    });
  }

  savePermissions(): void {
    // In real app: call API to persist roles/permissions
    console.log('Permissions saved:', this.roles());
    alert('Roles and permissions updated successfully.');
  }
}
EOF

# ==================== component.html ====================
cat > "$COMPONENT_DIR/rate-tables.component.html" << 'EOF'
<div class="rate-tables-container h-full flex flex-col bg-gray-900 text-gray-100">
  <!-- Header -->
  <header class="flex items-center justify-between px-6 py-4 border-b border-gray-700/80 bg-gray-900/95">
    <div>
      <h1 class="text-xl font-semibold tracking-tight">Rate Tables</h1>
      <p class="text-xs text-gray-400 mt-0.5">Configure rate tables and manage role permissions</p>
    </div>
    <div class="flex items-center gap-3">
      <button
        type="button"
        (click)="resetForm()"
        class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
      >
        New Rate
      </button>
      <button
        type="button"
        (click)="savePermissions()"
        class="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
      >
        Save Permissions
      </button>
    </div>
  </header>

  <div class="flex-1 flex overflow-hidden">
    <!-- Left: Rate Table Form -->
    <aside class="w-[440px] min-w-[400px] border-r border-gray-700/80 overflow-y-auto p-5 bg-gray-900/50">
      <h2 class="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        @if (selectedRateId()) { Edit Rate Table } @else { Configure Rate Table }
      </h2>

      <form [formGroup]="rateForm" (ngSubmit)="saveRateTable()" class="space-y-4">
        <div>
          <label class="label">Rate Table Name</label>
          <input formControlName="name" class="input" placeholder="e.g. West Coast TL Standard" />
        </div>

        <div>
          <label class="label">Carrier</label>
          <select formControlName="carrier" class="input">
            <option value="">Select carrier</option>
            <option>Swift Transportation</option>
            <option>FedEx Freight</option>
            <option>JB Hunt</option>
            <option>Schneider</option>
            <option>XPO Logistics</option>
            <option>Old Dominion</option>
            <option>Any Carrier</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Origin Zone</label>
            <input formControlName="originZone" class="input" placeholder="CA, NV, AZ" />
          </div>
          <div>
            <label class="label">Destination Zone</label>
            <input formControlName="destinationZone" class="input" placeholder="All US / Northeast" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Mode</label>
            <select formControlName="mode" class="input">
              <option>TL</option>
              <option>LTL</option>
              <option>Intermodal</option>
              <option>Expedited</option>
              <option>Partial</option>
            </select>
          </div>
          <div>
            <label class="label">Rate Type</label>
            <select formControlName="rateType" class="input">
              <option>Per Mile</option>
              <option>Per CWT</option>
              <option>Flat</option>
              <option>Per Piece</option>
              <option>Per Hour</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="label">Base Rate</label>
            <input type="number" step="0.01" formControlName="baseRate" class="input" placeholder="0.00" />
          </div>
          <div>
            <label class="label">Min Charge</label>
            <input type="number" step="0.01" formControlName="minCharge" class="input" placeholder="0.00" />
          </div>
          <div>
            <label class="label">Fuel %</label>
            <input type="number" step="0.1" formControlName="fuelSurcharge" class="input" placeholder="0" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Effective From</label>
            <input type="date" formControlName="effectiveFrom" class="input" />
          </div>
          <div>
            <label class="label">Effective To</label>
            <input type="date" formControlName="effectiveTo" class="input" />
          </div>
        </div>

        <div>
          <label class="label">Status</label>
          <select formControlName="status" class="input">
            <option>Draft</option>
            <option>Active</option>
            <option>Expired</option>
          </select>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            class="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            [disabled]="isSaving()"
          >
            @if (isSaving()) { Saving... } @else { @if (selectedRateId()) { Update Rate } @else { Save Rate Table } }
          </button>
          <button
            type="button"
            (click)="resetForm()"
            class="px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      <!-- Existing Rate Tables mini list -->
      <div class="mt-8 pt-5 border-t border-gray-700/60">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Existing Rate Tables</h3>
        <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
          @for (rate of rateTables(); track rate.id) {
            <button
              type="button"
              (click)="editRate(rate)"
              class="w-full text-left p-3 rounded-lg border border-gray-700/70 bg-gray-800/50 hover:bg-gray-800 hover:border-gray-600 transition-all"
              [class.ring-1]="selectedRateId() === rate.id"
              [class.ring-blue-500]="selectedRateId() === rate.id"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-100">{{ rate.name }}</span>
                <span
                  class="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  [class.bg-emerald-500/20]="rate.status === 'Active'"
                  [class.text-emerald-300]="rate.status === 'Active'"
                  [class.bg-amber-500/20]="rate.status === 'Draft'"
                  [class.text-amber-300]="rate.status === 'Draft'"
                  [class.bg-gray-500/20]="rate.status === 'Expired'"
                  [class.text-gray-400]="rate.status === 'Expired'"
                >
                  {{ rate.status }}
                </span>
              </div>
              <div class="text-xs text-gray-400 mt-1">
                {{ rate.carrier }} · {{ rate.mode }} · {{ rate.rateType }}
              </div>
            </button>
          }
        </div>
      </div>
    </aside>

    <!-- Main: Roles & Permissions Table -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-700/60 flex items-center justify-between">
        <div>
          <h2 class="text-sm font-semibold text-gray-200">Roles and Permissions</h2>
          <p class="text-xs text-gray-400">Control access to rate tables and related actions</p>
        </div>
      </div>

      <div class="flex-1 overflow-auto p-6">
        <div class="bg-gray-800/40 border border-gray-700/80 rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-700 bg-gray-800/80">
                <th class="text-left px-4 py-3 font-medium text-gray-300">Role</th>
                <th class="text-center px-3 py-3 font-medium text-gray-300 text-xs">View</th>
                <th class="text-center px-3 py-3 font-medium text-gray-300 text-xs">Create / Edit</th>
                <th class="text-center px-3 py-3 font-medium text-gray-300 text-xs">Delete</th>
                <th class="text-center px-3 py-3 font-medium text-gray-300 text-xs">Approve</th>
                <th class="text-center px-3 py-3 font-medium text-gray-300 text-xs">Export</th>
                <th class="text-center px-3 py-3 font-medium text-gray-300 text-xs">Manage Perms</th>
              </tr>
            </thead>
            <tbody>
              @for (role of roles(); track role.role; let i = $index) {
                <tr class="border-b border-gray-700/50 hover:bg-gray-800/40 transition-colors">
                  <td class="px-4 py-3.5">
                    <div class="font-medium text-gray-100">{{ role.role }}</div>
                    <div class="text-xs text-gray-500">{{ role.description }}</div>
                  </td>
                  <td class="text-center px-3 py-3">
                    <input
                      type="checkbox"
                      [checked]="role.view"
                      (change)="togglePermission(i, 'view')"
                      class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/40 focus:ring-2"
                    />
                  </td>
                  <td class="text-center px-3 py-3">
                    <input
                      type="checkbox"
                      [checked]="role.createEdit"
                      (change)="togglePermission(i, 'createEdit')"
                      class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/40 focus:ring-2"
                    />
                  </td>
                  <td class="text-center px-3 py-3">
                    <input
                      type="checkbox"
                      [checked]="role.delete"
                      (change)="togglePermission(i, 'delete')"
                      class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/40 focus:ring-2"
                    />
                  </td>
                  <td class="text-center px-3 py-3">
                    <input
                      type="checkbox"
                      [checked]="role.approve"
                      (change)="togglePermission(i, 'approve')"
                      class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/40 focus:ring-2"
                    />
                  </td>
                  <td class="text-center px-3 py-3">
                    <input
                      type="checkbox"
                      [checked]="role.export"
                      (change)="togglePermission(i, 'export')"
                      class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/40 focus:ring-2"
                    />
                  </td>
                  <td class="text-center px-3 py-3">
                    <input
                      type="checkbox"
                      [checked]="role.managePermissions"
                      (change)="togglePermission(i, 'managePermissions')"
                      class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/40 focus:ring-2"
                    />
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="mt-6 p-4 bg-gray-800/30 border border-gray-700/60 rounded-lg text-xs text-gray-400">
          <p class="font-medium text-gray-300 mb-1">Permission notes</p>
          <ul class="list-disc list-inside space-y-1">
            <li><strong class="text-gray-200">View</strong> — Can see rate tables and quotes</li>
            <li><strong class="text-gray-200">Create / Edit</strong> — Can add or modify rate entries</li>
            <li><strong class="text-gray-200">Approve</strong> — Can activate rates and approve changes</li>
            <li><strong class="text-gray-200">Manage Perms</strong> — Can edit this permissions matrix</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</div>
EOF

# ==================== component.scss ====================
cat > "$COMPONENT_DIR/rate-tables.component.scss" << 'EOF'
:host {
  display: block;
  height: 100%;
}

.rate-tables-container {
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

/* Scrollbar polish for dark theme */
.rate-tables-container ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.rate-tables-container ::-webkit-scrollbar-track {
  background: transparent;
}

.rate-tables-container ::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

.rate-tables-container ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Checkbox accent */
input[type="checkbox"] {
  accent-color: #3b82f6;
}
EOF

echo ""
echo "============================================================"
echo "Pantalla Rate Tables generada correctamente."
echo "Archivos creados en: $COMPONENT_DIR"
echo ""
echo "Agrega la siguiente ruta en src/app/app.routes.ts:"
echo ""
echo "import { RateTablesComponent } from './features/rate-tables/rate-tables.component';"
echo ""
echo "{ path: 'rate-tables', component: RateTablesComponent, title: 'Rate Tables' },"
echo ""
echo "============================================================"
