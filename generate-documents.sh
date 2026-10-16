#!/bin/bash
# Script to create the Documents screen files in the NexLog TMS Angular project
# Run this from the root of your Angular frontend project (e.g. D:\Fidel\Repos\TMS\frontend or wherever src/app is)

set -e

echo "Creating Documents feature folder..."
mkdir -p src/app/features/documents

echo "Writing documents.component.ts..."
cat > src/app/features/documents/documents.component.ts << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface DocumentItem {
  id: string;
  type: 'BOL' | 'POD' | 'Invoice' | 'Other';
  name: string;
  status: 'Uploaded' | 'Pending' | 'Signed' | 'Approved';
  uploadedAt: string;
  size: string;
  icon: string;
}

interface EpodData {
  signature: string;
  photoUrl: string;
  gpsLat: number;
  gpsLng: number;
  address: string;
  deliveredAt: string;
  signedBy: string;
  notes?: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent {
  shipmentId = 'SHP-0048912';
  shipmentStatus = 'Delivered';

  documents: DocumentItem[] = [
    {
      id: 'DOC-001',
      type: 'BOL',
      name: 'Bill of Lading - SHP-0048912.pdf',
      status: 'Uploaded',
      uploadedAt: '2026-10-14 09:15',
      size: '248 KB',
      icon: 'file-text'
    },
    {
      id: 'DOC-002',
      type: 'POD',
      name: 'Electronic Proof of Delivery',
      status: 'Signed',
      uploadedAt: '2026-10-15 14:32',
      size: '1.2 MB',
      icon: 'check-circle'
    },
    {
      id: 'DOC-003',
      type: 'Invoice',
      name: 'Factura Freight - INV-78921.pdf',
      status: 'Approved',
      uploadedAt: '2026-10-15 16:45',
      size: '186 KB',
      icon: 'receipt'
    },
    {
      id: 'DOC-004',
      type: 'Invoice',
      name: 'Factura Accessorial - INV-78922.pdf',
      status: 'Pending',
      uploadedAt: '2026-10-15 17:10',
      size: '92 KB',
      icon: 'receipt'
    }
  ];

  selectedDocument: DocumentItem | null = null;
  showEpodPreview = true;

  epod: EpodData = {
    signature: '',
    photoUrl: '',
    gpsLat: 34.0522,
    gpsLng: -118.2437,
    address: '1234 Delivery St, Los Angeles, CA 90001',
    deliveredAt: '2026-10-15 14:28',
    signedBy: 'John Martinez',
    notes: 'Delivered in good condition. Left at front door as requested.'
  };

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
EOF

echo "Writing documents.component.html..."
cat > src/app/features/documents/documents.component.html << 'EOF'
<div class="flex h-screen bg-[#0b1220] text-slate-100 overflow-hidden">
  <!-- Sidebar -->
  <aside class="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col shrink-0">
    <!-- Logo -->
    <div class="p-4 flex items-center gap-3 border-b border-slate-800">
      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">NL</div>
      <span class="font-semibold text-lg">NexLog TMS</span>
    </div>
    <!-- Navigation -->
    <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
      <a routerLink="/dashboard" routerLinkActive="bg-blue-600 text-white" [routerLinkActiveOptions]="{exact: true}"
         class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        Dashboard
      </a>
      <a routerLink="/route-optimization" routerLinkActive="bg-blue-600 text-white"
         class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
        Route Optimization
      </a>
      <a routerLink="/documents" routerLinkActive="bg-blue-600 text-white"
         class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        Documents
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        Orders
      </a>
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
        Load Planning
      </a>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 flex overflow-hidden p-4 gap-4">
    <!-- Documents List -->
    <div class="w-96 bg-[#0f172a] rounded-xl border border-slate-800 flex flex-col overflow-hidden shrink-0">
      <div class="p-5 border-b border-slate-800">
        <div class="flex items-center justify-between mb-1">
          <h2 class="text-xl font-semibold">Documents</h2>
          <span class="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">{{ shipmentStatus }}</span>
        </div>
        <p class="text-sm text-slate-400">Shipment {{ shipmentId }}</p>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-2">
        <div *ngFor="let doc of documents"
             (click)="selectDocument(doc)"
             [class.border-blue-500]="selectedDocument?.id === doc.id"
             class="bg-[#1e293b] rounded-lg p-4 border border-slate-700 hover:border-slate-600 cursor-pointer transition">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path *ngIf="doc.type === 'BOL'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  <path *ngIf="doc.type === 'POD'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  <path *ngIf="doc.type === 'Invoice'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-medium px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{{ doc.type }}</span>
                  <span class="font-medium truncate">{{ doc.name }}</span>
                </div>
                <div class="text-xs text-slate-400 mt-1">{{ doc.uploadedAt }} • {{ doc.size }}</div>
              </div>
            </div>
            <span class="text-xs px-2 py-1 rounded-full shrink-0"
                  [class.bg-green-500/20]="doc.status === 'Signed' || doc.status === 'Approved' || doc.status === 'Uploaded'"
                  [class.text-green-400]="doc.status === 'Signed' || doc.status === 'Approved' || doc.status === 'Uploaded'"
                  [class.bg-yellow-500/20]="doc.status === 'Pending'"
                  [class.text-yellow-400]="doc.status === 'Pending'">
              {{ doc.status }}
            </span>
          </div>
          <div class="flex gap-2 mt-3">
            <button (click)="viewDocument(doc); $event.stopPropagation()" class="text-xs px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200">View</button>
            <button (click)="downloadDocument(doc); $event.stopPropagation()" class="text-xs px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200">Download</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Panel -->
    <div class="flex-1 bg-[#0f172a] rounded-xl border border-slate-800 flex flex-col overflow-hidden">
      <div class="p-5 border-b border-slate-800 flex items-center justify-between">
        <h2 class="text-xl font-semibold">
          {{ showEpodPreview ? 'Electronic Proof of Delivery' : (selectedDocument?.name || 'Select a document') }}
        </h2>
        <button *ngIf="showEpodPreview" class="text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">
          Download ePOD
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6" *ngIf="showEpodPreview">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-[#1e293b] rounded-xl p-5 border border-slate-700">
            <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Signature</h3>
            <div class="h-40 bg-[#0f172a] rounded-lg border border-dashed border-slate-600 flex items-center justify-center relative">
              <svg class="w-32 h-20 text-slate-300" viewBox="0 0 200 80" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 50 Q 30 20, 50 45 T 90 40 T 130 55 T 170 35" stroke-linecap="round"/>
                <path d="M140 45 Q 155 30, 180 50" stroke-linecap="round"/>
              </svg>
              <div class="absolute bottom-2 right-3 text-xs text-slate-500">Signed</div>
            </div>
            <p class="text-sm text-slate-300 mt-3">Signed by: <span class="font-medium">{{ epod.signedBy }}</span></p>
          </div>

          <div class="bg-[#1e293b] rounded-xl p-5 border border-slate-700">
            <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Delivery Photo</h3>
            <div class="h-40 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
              <div class="text-center">
                <svg class="w-12 h-12 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <p class="text-xs text-slate-400">Package photo</p>
              </div>
            </div>
          </div>

          <div class="bg-[#1e293b] rounded-xl p-5 border border-slate-700 lg:col-span-2">
            <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">GPS Location</h3>
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-medium">{{ epod.address }}</p>
                <p class="text-sm text-slate-400 mt-1">{{ epod.gpsLat.toFixed(4) }}° N, {{ epod.gpsLng.toFixed(4) }}° W</p>
                <p class="text-sm text-slate-400">Delivered: {{ epod.deliveredAt }}</p>
              </div>
            </div>
            <div class="mt-4 h-32 bg-[#0f172a] rounded-lg border border-slate-700 relative overflow-hidden">
              <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 50%);"></div>
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
              <div class="absolute bottom-2 left-3 text-xs text-slate-500">Map preview</div>
            </div>
          </div>

          <div class="bg-[#1e293b] rounded-xl p-5 border border-slate-700 lg:col-span-2" *ngIf="epod.notes">
            <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Notes</h3>
            <p class="text-slate-300">{{ epod.notes }}</p>
          </div>
        </div>
      </div>

      <div class="flex-1 flex items-center justify-center text-slate-400" *ngIf="!showEpodPreview">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p>Select a document from the list to preview</p>
        </div>
      </div>
    </div>
  </main>
</div>
EOF

echo "Writing documents.component.scss..."
cat > src/app/features/documents/documents.component.scss << 'EOF'
:host {
  display: block;
  height: 100%;
}

/* Additional custom styles if needed */
EOF

echo ""
echo "Files created successfully in src/app/features/documents/"
echo ""
echo "Now update src/app/app.routes.ts with this route entry:"
echo ""
echo "  { path: 'documents', component: DocumentsComponent, title: 'Document Management' },"
echo ""
echo "And add the import:"
echo "import { DocumentsComponent } from './features/documents/documents.component';"
echo ""
echo "Done."
