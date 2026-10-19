import { TranslatePipe } from '@ngx-translate/core';
import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../core/language.service';
import { RatingService } from '../../core/services/rating.service';
import { CarrierQuote, QuoteRequest } from '../../core/models';

@Component({
  host: { class: 'tone-gray' },
  selector: 'app-rating',
  standalone: true,
  imports: [TranslatePipe, CommonModule, ReactiveFormsModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingComponent {
  readonly lang = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private ratingService = inject(RatingService);

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
    if (this.sortBy() === 'price') return list.sort((a, b) => a.total - b.total);
    return list.sort((a, b) => a.transitDays - b.transitDays);
  });

  hasResults = computed(() => this.quotes().length > 0);

  getQuotes(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    const request: QuoteRequest = this.quoteForm.value;
    this.isLoading.set(true);
    this.quotes.set([]);

    this.ratingService.getQuotes(request).subscribe({
      next: data => {
        this.quotes.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        // TODO: show error toast
      }
    });
  }

  setSort(sort: 'price' | 'transit'): void {
    this.sortBy.set(sort);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat(this.lang.locale(), { style: 'currency', currency: 'USD' }).format(value);
  }
}
