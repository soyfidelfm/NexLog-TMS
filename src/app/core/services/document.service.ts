import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiClient } from '../api/api-client.service';
import { DocumentItem, EpodData } from '../models';

/** Documents microservice: /api/documents, /api/epods */
@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly api = inject(ApiClient);

  getDocuments(shipmentId?: string): Observable<DocumentItem[]> {
    return this.api.list<DocumentItem>('documents');
  }

  getEpod(shipmentId?: string): Observable<EpodData> {
    return this.api.list<EpodData>('epods', { pageSize: 1, search: undefined }).pipe(map(list => list[0]));
  }
}
