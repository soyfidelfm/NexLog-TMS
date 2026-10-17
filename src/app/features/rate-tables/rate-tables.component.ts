import { TranslatePipe } from '@ngx-translate/core';
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/language.service';
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
  imports: [TranslatePipe, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './rate-tables.component.html',
  styleUrl: './rate-tables.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateTablesComponent {
  private readonly fb = inject(FormBuilder);
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);

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
    alert(this.translate.instant('rateTables.permsSaved'));
  }
}
