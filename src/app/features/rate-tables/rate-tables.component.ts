import { TranslatePipe } from '@ngx-translate/core';
import { Component, signal, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/language.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RateTableService } from '../../core/services/rate-table.service';
import { RateTable, RolePermission } from '../../core/models';

@Component({
  host: { class: 'tone-gray' },
  selector: 'app-rate-tables',
  standalone: true,
  imports: [TranslatePipe, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './rate-tables.component.html',
  styleUrl: './rate-tables.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateTablesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private rateTableService = inject(RateTableService);
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

  rateTables = signal<RateTable[]>([]);
  roles = signal<RolePermission[]>([]);

  isSaving = signal(false);
  selectedRateId = signal<string | null>(null);

  ngOnInit(): void {
    this.rateTableService.getRateTables().subscribe(data => this.rateTables.set(data));
    this.rateTableService.getRoles().subscribe(data => this.roles.set(data));
  }

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

    const isNew = !this.selectedRateId();
    this.rateTableService.saveRateTable(newRate, isNew).subscribe({ next: saved => {
      if (!isNew) {
        this.rateTables.update(list =>
          list.map(r => (r.id === this.selectedRateId() ? saved : r))
        );
      } else {
        this.rateTables.update(list => [...list, saved]);
      }
      this.isSaving.set(false);
      this.resetForm();
    }, error: () => this.isSaving.set(false) });
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

  togglePermission(roleIndex: number, permission: keyof Omit<RolePermission, 'id' | 'role' | 'description'>): void {
    this.roles.update(list => {
      const updated = [...list];
      const role = { ...updated[roleIndex] };
      role[permission] = !role[permission];
      updated[roleIndex] = role;
      return updated;
    });
  }

  savePermissions(): void {
    this.rateTableService.savePermissions(this.roles()).subscribe(() => {
      alert(this.translate.instant('rateTables.permsSaved'));
    });
  }
}
