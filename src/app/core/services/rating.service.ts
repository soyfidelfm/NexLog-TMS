import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiClient } from '../api/api-client.service';
import { CarrierQuote, QuoteRequest } from '../models';

/** Rating microservice: POST /api/quotes/search */
@Injectable({ providedIn: 'root' })
export class RatingService {
  private readonly api = inject(ApiClient);

  getQuotes(request: QuoteRequest): Observable<CarrierQuote[]> {
    return this.api.post<CarrierQuote[]>('quotes/search', request);
  }
}
