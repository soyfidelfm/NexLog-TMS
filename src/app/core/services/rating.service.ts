import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { CarrierQuote, QuoteRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private readonly baseUrl = environment.apiUrl;

  getQuotes(request: QuoteRequest): Observable<CarrierQuote[]> {
    // TODO: replace mock with real API call:
    // return this.http.post<CarrierQuote[]>(`${this.baseUrl}/quotes`, request);

    console.log('Quote request ready for API:', request);

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
    return of(mockQuotes).pipe(delay(800));
  }
}
