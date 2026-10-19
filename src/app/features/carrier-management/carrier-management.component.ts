import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/language.service';
import { equipmentKey } from '../../shared/i18n-keys';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CarrierService } from '../../core/services/carrier.service';
import { Carrier } from '../../core/models';

@Component({
  selector: 'app-carrier-management',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './carrier-management.component.html',
  styleUrl: './carrier-management.component.scss',
})
export class CarrierManagementComponent implements OnInit {
  private carrierService = inject(CarrierService);
  private fb = inject(FormBuilder);
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  readonly equipmentKey = equipmentKey;
  readonly statusKey: Record<Carrier['status'], string> = { Active: 'carriers.status.active', Inactive: 'carriers.status.inactive', Pending: 'carriers.status.pending' };

  searchQuery = signal('');
  statusFilter = signal<'All' | 'Active' | 'Inactive' | 'Pending'>('All');
  minRating = signal(0);
  selectedId = signal<string | null>(null);
  showAddForm = signal(false);

  carriers: Carrier[] = [];

  addForm = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    mcNumber: ['', Validators.required],
    contact: [''],
    email: ['', Validators.email],
    phone: [''],
    city: [''],
    state: [''],
  });

  ngOnInit(): void {
    this.loadCarriers();
  }

  private loadCarriers() {
    this.carrierService.getCarriers().subscribe(data => {
      this.carriers = data;
    });
  }

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
    if (percent >= 95) return 'text-emerald-ink';
    if (percent >= 90) return 'text-amber-ink';
    return 'text-red-ink';
  }

  getClaimsClass(rate: number): string {
    if (rate <= 1) return 'text-emerald-ink';
    if (rate <= 2) return 'text-amber-ink';
    return 'text-red-ink';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'bg-emerald-500/15 text-emerald-ink';
      case 'Inactive': return 'bg-elevated-2 text-muted';
      case 'Pending': return 'bg-amber-500/15 text-amber-ink';
      default: return 'bg-elevated-2 text-body';
    }
  }

  openAddForm() {
    this.showAddForm.set(true);
    this.addForm.reset();
  }

  closeAddForm() {
    this.showAddForm.set(false);
  }

  submitAdd() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    this.carrierService.createCarrier(this.addForm.value as Partial<Carrier>).subscribe(() => {
      this.closeAddForm();
      this.loadCarriers();
    });
  }
}
