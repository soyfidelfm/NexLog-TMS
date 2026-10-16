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
