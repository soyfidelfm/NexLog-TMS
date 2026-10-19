import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, OnInit } from '@angular/core';
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

  documents: DocumentItem[] = [];
  selectedDocument: DocumentItem | null = null;
  showEpodPreview = true;
  epod: EpodData = {} as EpodData;

  ngOnInit(): void {
    this.documentService.getDocuments(this.shipmentId).subscribe(data => {
      this.documents = data;
    });
    this.documentService.getEpod(this.shipmentId).subscribe(data => {
      this.epod = data;
    });
  }

  selectDocument(doc: DocumentItem): void {
    this.selectedDocument = doc;
    this.showEpodPreview = doc.type === 'POD';
  }

  viewDocument(doc: DocumentItem): void {
    this.selectDocument(doc);
    console.log('Viewing', doc.name);
  }

  downloadDocument(doc: DocumentItem): void {
    console.log('Downloading', doc.name);
  }
}
