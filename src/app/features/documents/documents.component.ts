import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, OnInit, signal } from '@angular/core';
import { LanguageService } from '../../core/language.service';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../core/services/document.service';
import { DocumentItem, EpodData } from '../../core/models';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent implements OnInit {
  private documentService = inject(DocumentService);
  readonly lang = inject(LanguageService);
  shipmentId = 'SHP-0048912';
  shipmentStatus = 'Delivered';

  /** Signal: components are OnPush by default (Angular 22); a plain field assigned in subscribe() never repaints. */
  documents = signal<DocumentItem[]>([]);
  selectedDocument = signal<DocumentItem | null>(null);
  showEpodPreview = signal(true);
  epod = signal<EpodData>({} as EpodData);

  ngOnInit(): void {
    this.documentService.getDocuments(this.shipmentId).subscribe(data => {
      this.documents.set(data);
    });
    this.documentService.getEpod(this.shipmentId).subscribe(data => {
      this.epod.set(data ?? ({} as EpodData));
    });
  }

  selectDocument(doc: DocumentItem): void {
    this.selectedDocument.set(doc);
    this.showEpodPreview.set(doc.type === 'POD');
  }

  viewDocument(doc: DocumentItem): void {
    this.selectDocument(doc);
    console.log('Viewing', doc.name);
  }

  downloadDocument(doc: DocumentItem): void {
    console.log('Downloading', doc.name);
  }
}
