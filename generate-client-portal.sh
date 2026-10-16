#!/bin/bash
# =============================================
# NexLog TMS - Client Portal Generator
# =============================================
set -e

echo "Creating Client Portal component..."

BASE_DIR="src/app/features/client-portal"
mkdir -p "$BASE_DIR"

# ---------- client-portal.component.ts ----------
cat > "$BASE_DIR/client-portal.component.ts" << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'Pending' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  progress: number;
  eta: string;
  documents: { name: string; type: string }[];
}

@Component({
  selector: 'app-client-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-portal.component.html',
  styleUrl: './client-portal.component.scss'
})
export class ClientPortalComponent {
  searchTerm = '';

  shipments: Shipment[] = [
    {
      id: 'SHP-10482',
      trackingNumber: 'NL-2026-10482',
      origin: 'Los Angeles, CA',
      destination: 'Dallas, TX',
      status: 'In Transit',
      progress: 65,
      eta: 'Oct 18, 2026',
      documents: [
        { name: 'BOL', type: 'pdf' },
        { name: 'Invoice', type: 'pdf' }
      ]
    },
    {
      id: 'SHP-10491',
      trackingNumber: 'NL-2026-10491',
      origin: 'Chicago, IL',
      destination: 'Atlanta, GA',
      status: 'Out for Delivery',
      progress: 88,
      eta: 'Oct 16, 2026',
      documents: [
        { name: 'BOL', type: 'pdf' },
        { name: 'POD', type: 'pdf' },
        { name: 'Invoice', type: 'pdf' }
      ]
    },
    {
      id: 'SHP-10503',
      trackingNumber: 'NL-2026-10503',
      origin: 'Houston, TX',
      destination: 'Phoenix, AZ',
      status: 'Delivered',
      progress: 100,
      eta: 'Oct 14, 2026',
      documents: [
        { name: 'BOL', type: 'pdf' },
        { name: 'POD', type: 'pdf' },
        { name: 'Invoice', type: 'pdf' }
      ]
    },
    {
      id: 'SHP-10517',
      trackingNumber: 'NL-2026-10517',
      origin: 'Seattle, WA',
      destination: 'Denver, CO',
      status: 'Picked Up',
      progress: 25,
      eta: 'Oct 20, 2026',
      documents: [
        { name: 'BOL', type: 'pdf' }
      ]
    },
    {
      id: 'SHP-10528',
      trackingNumber: 'NL-2026-10528',
      origin: 'Miami, FL',
      destination: 'New York, NY',
      status: 'Pending',
      progress: 8,
      eta: 'Oct 22, 2026',
      documents: []
    }
  ];

  get filteredShipments(): Shipment[] {
    if (!this.searchTerm.trim()) return this.shipments;
    const term = this.searchTerm.toLowerCase();
    return this.shipments.filter(s =>
      s.trackingNumber.toLowerCase().includes(term) ||
      s.origin.toLowerCase().includes(term) ||
      s.destination.toLowerCase().includes(term) ||
      s.status.toLowerCase().includes(term)
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered': return 'status-delivered';
      case 'Out for Delivery': return 'status-out';
      case 'In Transit': return 'status-transit';
      case 'Picked Up': return 'status-picked';
      default: return 'status-pending';
    }
  }

  downloadDocuments(shipment: Shipment): void {
    if (shipment.documents.length === 0) {
      alert('No documents available for this shipment yet.');
      return;
    }
    const names = shipment.documents.map(d => d.name).join(', ');
    alert(`Downloading documents for ${shipment.trackingNumber}:\n${names}`);
    // TODO: Replace with real download logic (FileService, etc.)
  }
}
EOF

# ---------- client-portal.component.html ----------
cat > "$BASE_DIR/client-portal.component.html" << 'EOF'
<div class="client-portal">
  <header class="portal-header">
    <div>
      <h1>Client Portal</h1>
      <p class="subtitle">Track your shipments and download documents</p>
    </div>
    <div class="search-box">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        type="text"
        placeholder="Search by tracking, origin, destination..."
        [(ngModel)]="searchTerm"
      />
    </div>
  </header>

  <div class="shipments-list">
    @for (shipment of filteredShipments; track shipment.id) {
      <div class="shipment-card">
        <div class="card-top">
          <div class="tracking">
            <span class="label">Tracking</span>
            <strong>{{ shipment.trackingNumber }}</strong>
          </div>
          <span class="status-badge" [class]="getStatusClass(shipment.status)">
            {{ shipment.status }}
          </span>
        </div>

        <div class="route">
          <div class="location">
            <span class="label">Origin</span>
            <span>{{ shipment.origin }}</span>
          </div>
          <div class="arrow">→</div>
          <div class="location">
            <span class="label">Destination</span>
            <span>{{ shipment.destination }}</span>
          </div>
        </div>

        <div class="progress-section">
          <div class="progress-header">
            <span>Progress</span>
            <span class="percent">{{ shipment.progress }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="shipment.progress"></div>
          </div>
        </div>

        <div class="card-footer">
          <div class="eta">
            <span class="label">Estimated Delivery</span>
            <strong>{{ shipment.eta }}</strong>
          </div>
          <button
            class="btn-download"
            [disabled]="shipment.documents.length === 0"
            (click)="downloadDocuments(shipment)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Docs
            @if (shipment.documents.length > 0) {
              <span class="doc-count">({{ shipment.documents.length }})</span>
            }
          </button>
        </div>
      </div>
    } @empty {
      <div class="empty-state">
        <p>No shipments found matching your search.</p>
      </div>
    }
  </div>
</div>
EOF

# ---------- client-portal.component.scss ----------
cat > "$BASE_DIR/client-portal.component.scss" << 'EOF'
.client-portal {
  padding: 1.5rem 2rem;
  min-height: 100vh;
  background: #0f172a;
  color: #e2e8f0;
}

.portal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 1.5rem;
  flex-wrap: wrap;

  h1 {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0;
    color: #f8fafc;
  }

  .subtitle {
    margin: 0.25rem 0 0;
    color: #94a3b8;
    font-size: 0.95rem;
  }
}

.search-box {
  display: flex;
  align-items: center;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  min-width: 280px;

  svg {
    color: #64748b;
    flex-shrink: 0;
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    color: #e2e8f0;
    margin-left: 0.5rem;
    width: 100%;
    font-size: 0.9rem;

    &::placeholder {
      color: #64748b;
    }
  }
}

.shipments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shipment-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  transition: border-color 0.2s;

  &:hover {
    border-color: #475569;
  }
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  .tracking {
    .label {
      display: block;
      font-size: 0.75rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    strong {
      font-size: 1.05rem;
      color: #f1f5f9;
    }
  }
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;

  &.status-delivered {
    background: #065f46;
    color: #6ee7b7;
  }

  &.status-out {
    background: #1e3a8a;
    color: #93c5fd;
  }

  &.status-transit {
    background: #7c2d12;
    color: #fdba74;
  }

  &.status-picked {
    background: #3f3f46;
    color: #d4d4d8;
  }

  &.status-pending {
    background: #334155;
    color: #94a3b8;
  }
}

.route {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  font-size: 0.95rem;

  .location {
    .label {
      display: block;
      font-size: 0.7rem;
      color: #64748b;
      text-transform: uppercase;
    }
  }

  .arrow {
    color: #475569;
    font-size: 1.1rem;
  }
}

.progress-section {
  margin-bottom: 1.25rem;

  .progress-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #94a3b8;
    margin-bottom: 0.4rem;
  }

  .progress-bar {
    height: 6px;
    background: #334155;
    border-radius: 9999px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    border-radius: 9999px;
    transition: width 0.4s ease;
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #334155;

  .eta {
    .label {
      display: block;
      font-size: 0.7rem;
      color: #64748b;
      text-transform: uppercase;
    }

    strong {
      color: #f1f5f9;
    }
  }
}

.btn-download {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    background: #334155;
    color: #64748b;
    cursor: not-allowed;
  }

  .doc-count {
    opacity: 0.85;
    font-size: 0.8rem;
  }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

@media (max-width: 640px) {
  .client-portal {
    padding: 1rem;
  }

  .portal-header {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: auto;
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
EOF

echo ""
echo "✅ Client Portal created successfully!"
echo "Location: $BASE_DIR"
echo ""
echo "Add this route to your routes array:"
echo ""
echo "{ path: 'client-portal', component: ClientPortalComponent, title: 'Client Portal' },"
echo ""
echo "Don't forget to import ClientPortalComponent and FormsModule (for ngModel) if needed."
echo ""
echo "Done."
