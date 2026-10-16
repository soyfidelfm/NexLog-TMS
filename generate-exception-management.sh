#!/bin/bash
# generate-exception-management.sh
# Genera la pantalla de Exception Management para NexLog TMS
# Uso: bash generate-exception-management.sh
# Crea los archivos en ./src/app/features/exception-management/ (ajusta la ruta si es necesario)

set -e

TARGET_DIR="${1:-./src/app/features/exception-management}"
mkdir -p "$TARGET_DIR"

echo "Creando pantalla Exception Management en: $TARGET_DIR"

# ==================== exception-management.component.ts ====================
cat > "$TARGET_DIR/exception-management.component.ts" << 'ENDOFFILE'
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
type ExceptionStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  actor: string;
}

interface ActionTaken {
  id: string;
  action: string;
  by: string;
  at: string;
  notes?: string;
}

interface CommLog {
  id: string;
  channel: 'Email' | 'Phone' | 'SMS' | 'Chat' | 'System';
  from: string;
  to: string;
  message: string;
  at: string;
  direction: 'inbound' | 'outbound';
}

interface ExceptionItem {
  id: string;
  type: string;
  title: string;
  loadId: string;
  orderId?: string;
  carrier: string;
  severity: Severity;
  status: ExceptionStatus;
  openedAt: string;
  lastUpdate: string;
  location: string;
  description: string;
  timeline: TimelineEvent[];
  actions: ActionTaken[];
  communications: CommLog[];
}

@Component({
  selector: 'app-exception-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exception-management.component.html',
  styleUrl: './exception-management.component.scss',
})
export class ExceptionManagementComponent {
  exceptions = signal<ExceptionItem[]>([
    {
      id: 'EXC-2026-0142',
      type: 'Delay',
      title: 'Pickup delay – driver no-show',
      loadId: 'LD-2026-0842',
      orderId: 'ORD-1051',
      carrier: 'Swift Transportation',
      severity: 'Critical',
      status: 'Open',
      openedAt: '2026-10-15 08:42',
      lastUpdate: '2026-10-15 11:15',
      location: 'Los Angeles, CA',
      description: 'Driver failed to arrive for scheduled pickup. Customer is escalating. Window closes in 90 min.',
      timeline: [
        { time: '08:42', title: 'Exception opened', description: 'Auto-detected: no GPS check-in at origin', actor: 'System' },
        { time: '08:55', title: 'Carrier notified', description: 'SMS + email sent to dispatch', actor: 'Ops Bot' },
        { time: '09:30', title: 'Customer alerted', description: 'Proactive notification sent', actor: 'Maria Lopez' },
        { time: '11:15', title: 'Escalated', description: 'No response from carrier. Escalated to supervisor', actor: 'Maria Lopez' },
      ],
      actions: [
        { id: 'A1', action: 'Sent carrier notification', by: 'Ops Bot', at: '08:55', notes: 'SMS + email' },
        { id: 'A2', action: 'Called carrier dispatch', by: 'Maria Lopez', at: '09:18', notes: 'No answer, left voicemail' },
        { id: 'A3', action: 'Escalated to supervisor', by: 'Maria Lopez', at: '11:15' },
      ],
      communications: [
        { id: 'C1', channel: 'SMS', from: 'NexLog', to: 'Swift Dispatch', message: 'Pickup missed for LD-2026-0842. Confirm ETA.', at: '08:55', direction: 'outbound' },
        { id: 'C2', channel: 'Email', from: 'ops@nexlog.com', to: 'dispatch@swift.com', message: 'Urgent: Driver no-show at Acme Corp dock. Please respond.', at: '08:56', direction: 'outbound' },
        { id: 'C3', channel: 'Phone', from: 'Maria Lopez', to: 'Swift Dispatch', message: 'Called, left voicemail requesting immediate callback.', at: '09:18', direction: 'outbound' },
        { id: 'C4', channel: 'Chat', from: 'Customer Portal', to: 'Ops', message: 'When will the truck arrive? Production is waiting.', at: '10:40', direction: 'inbound' },
      ],
    },
    {
      id: 'EXC-2026-0145',
      type: 'Damage',
      title: 'Cargo damage reported at delivery',
      loadId: 'LD-2026-0835',
      orderId: 'ORD-1040',
      carrier: 'Knight-Swift',
      severity: 'High',
      status: 'In Progress',
      openedAt: '2026-10-14 16:20',
      lastUpdate: '2026-10-15 09:05',
      location: 'Phoenix, AZ',
      description: 'Receiver reported 3 pallets crushed. Photos uploaded. Claim process initiated.',
      timeline: [
        { time: '16:20', title: 'Damage reported', description: 'POD notes + photos from driver', actor: 'Driver App' },
        { time: '16:45', title: 'Claim opened', description: 'Auto-claim created in system', actor: 'System' },
        { time: '09:05', title: 'Carrier response', description: 'Carrier acknowledged, requesting survey', actor: 'Claims Team' },
      ],
      actions: [
        { id: 'A1', action: 'Opened claim', by: 'System', at: '16:45' },
        { id: 'A2', action: 'Requested photos review', by: 'Claims Bot', at: '17:10' },
        { id: 'A3', action: 'Contacted carrier claims', by: 'James Park', at: '09:05' },
      ],
      communications: [
        { id: 'C1', channel: 'System', from: 'Driver App', to: 'Claims', message: 'Damage photos uploaded (3 pallets).', at: '16:22', direction: 'inbound' },
        { id: 'C2', channel: 'Email', from: 'claims@nexlog.com', to: 'claims@knightswift.com', message: 'Claim EXC-2026-0145 opened. Please review attached photos.', at: '16:50', direction: 'outbound' },
      ],
    },
    {
      id: 'EXC-2026-0148',
      type: 'Capacity',
      title: 'Trailer overweight risk',
      loadId: 'LD-2026-0848',
      carrier: 'Schneider',
      severity: 'Medium',
      status: 'Open',
      openedAt: '2026-10-15 07:10',
      lastUpdate: '2026-10-15 07:10',
      location: 'Irvine, CA',
      description: 'Projected weight exceeds trailer max by 1,200 lbs after last order assignment.',
      timeline: [
        { time: '07:10', title: 'Alert generated', description: 'Load planning engine detected overweight risk', actor: 'System' },
      ],
      actions: [
        { id: 'A1', action: 'Flagged for planner review', by: 'System', at: '07:10' },
      ],
      communications: [],
    },
    {
      id: 'EXC-2026-0151',
      type: 'Documentation',
      title: 'Missing BOL signature',
      loadId: 'LD-2026-0831',
      orderId: 'ORD-1031',
      carrier: 'Werner Enterprises',
      severity: 'Low',
      status: 'Resolved',
      openedAt: '2026-10-13 14:00',
      lastUpdate: '2026-10-14 10:30',
      location: 'Salt Lake City, UT',
      description: 'BOL not signed by receiver. Follow-up completed.',
      timeline: [
        { time: '14:00', title: 'Exception opened', description: 'POD received without signature', actor: 'System' },
        { time: '10:30', title: 'Resolved', description: 'Signature obtained via e-sign link', actor: 'Ana Ruiz' },
      ],
      actions: [
        { id: 'A1', action: 'Sent e-sign link', by: 'Ana Ruiz', at: '09:15' },
        { id: 'A2', action: 'Closed exception', by: 'Ana Ruiz', at: '10:30' },
      ],
      communications: [
        { id: 'C1', channel: 'Email', from: 'docs@nexlog.com', to: 'receiver@example.com', message: 'Please sign the BOL via the secure link.', at: '09:15', direction: 'outbound' },
      ],
    },
    {
      id: 'EXC-2026-0154',
      type: 'Weather',
      title: 'Route impacted by storm',
      loadId: 'LD-2026-0857',
      carrier: 'J.B. Hunt',
      severity: 'High',
      status: 'In Progress',
      openedAt: '2026-10-15 12:40',
      lastUpdate: '2026-10-15 13:10',
      location: 'Albuquerque, NM',
      description: 'Severe weather delay expected. ETA pushed +6 hours. Customer notified.',
      timeline: [
        { time: '12:40', title: 'Weather alert', description: 'External weather API flagged route', actor: 'System' },
        { time: '13:05', title: 'ETA updated', description: 'New ETA communicated to customer', actor: 'Ops Bot' },
        { time: '13:10', title: 'Driver instructed', description: 'Hold at safe location until storm passes', actor: 'Dispatch' },
      ],
      actions: [
        { id: 'A1', action: 'Updated ETA', by: 'Ops Bot', at: '13:05' },
        { id: 'A2', action: 'Notified customer', by: 'Ops Bot', at: '13:06' },
      ],
      communications: [
        { id: 'C1', channel: 'SMS', from: 'NexLog', to: 'Customer', message: 'Your shipment LD-2026-0857 is delayed due to weather. New ETA +6h.', at: '13:06', direction: 'outbound' },
      ],
    },
  ]);

  selectedId = signal<string | null>('EXC-2026-0142');
  filterSeverity = signal<Severity | 'All'>('All');
  filterStatus = signal<ExceptionStatus | 'All'>('All');
  searchTerm = signal('');

  filteredExceptions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const sev = this.filterSeverity();
    const st = this.filterStatus();
    return this.exceptions().filter((ex) => {
      const matchesSev = sev === 'All' || ex.severity === sev;
      const matchesSt = st === 'All' || ex.status === st;
      const matchesSearch =
        !term ||
        ex.id.toLowerCase().includes(term) ||
        ex.title.toLowerCase().includes(term) ||
        ex.loadId.toLowerCase().includes(term) ||
        ex.carrier.toLowerCase().includes(term) ||
        (ex.orderId?.toLowerCase().includes(term) ?? false);
      return matchesSev && matchesSt && matchesSearch;
    });
  });

  selectedException = computed(() =>
    this.exceptions().find((e) => e.id === this.selectedId()) ?? null
  );

  severityCounts = computed(() => {
    const all = this.exceptions();
    return {
      critical: all.filter((e) => e.severity === 'Critical').length,
      high: all.filter((e) => e.severity === 'High').length,
      medium: all.filter((e) => e.severity === 'Medium').length,
      low: all.filter((e) => e.severity === 'Low').length,
    };
  });

  select(ex: ExceptionItem): void {
    this.selectedId.set(ex.id);
  }

  severityClass(severity: Severity): string {
    switch (severity) {
      case 'Critical': return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'High': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'Medium': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Low': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  }

  statusClass(status: ExceptionStatus): string {
    switch (status) {
      case 'Open': return 'bg-red-500/15 text-red-300';
      case 'In Progress': return 'bg-amber-500/15 text-amber-300';
      case 'Resolved': return 'bg-emerald-500/15 text-emerald-300';
      case 'Closed': return 'bg-gray-600/40 text-gray-400';
    }
  }

  markInProgress(): void {
    const id = this.selectedId();
    if (!id) return;
    this.exceptions.update((list) =>
      list.map((e) => (e.id === id ? { ...e, status: 'In Progress' as ExceptionStatus, lastUpdate: new Date().toLocaleString('en-US', { hour12: false }) } : e))
    );
  }

  resolve(): void {
    const id = this.selectedId();
    if (!id) return;
    this.exceptions.update((list) =>
      list.map((e) => (e.id === id ? { ...e, status: 'Resolved' as ExceptionStatus, lastUpdate: new Date().toLocaleString('en-US', { hour12: false }) } : e))
    );
  }
}
ENDOFFILE

# ==================== exception-management.component.html ====================
cat > "$TARGET_DIR/exception-management.component.html" << 'ENDOFFILE'
<div class="exception-container h-full flex flex-col bg-gray-900 text-gray-100">
  <!-- Header -->
  <header class="border-b border-gray-700/60 px-6 py-4 flex items-center justify-between bg-gray-900/95">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Exception Management</h1>
      <p class="text-sm text-gray-400 mt-0.5">Active exceptions · monitor, act and communicate</p>
    </div>
    <div class="flex items-center gap-3">
      <div class="flex gap-2 text-xs">
        <span class="px-2.5 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/30">Critical {{ severityCounts().critical }}</span>
        <span class="px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30">High {{ severityCounts().high }}</span>
        <span class="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">Medium {{ severityCounts().medium }}</span>
        <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Low {{ severityCounts().low }}</span>
      </div>
    </div>
  </header>

  <div class="flex-1 flex overflow-hidden">
    <!-- Left: List -->
    <aside class="w-[420px] min-w-[380px] border-r border-gray-700/60 flex flex-col bg-gray-900/80">
      <!-- Filters -->
      <div class="p-4 border-b border-gray-700/50 space-y-3">
        <input
          type="text"
          placeholder="Search by ID, load, carrier..."
          class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
          [ngModel]="searchTerm()"
          (ngModelChange)="searchTerm.set($event)"
        />
        <div class="flex gap-2">
          <select
            class="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            [ngModel]="filterSeverity()"
            (ngModelChange)="filterSeverity.set($event)"
          >
            <option value="All">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            class="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            [ngModel]="filterStatus()"
            (ngModelChange)="filterStatus.set($event)"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-y-auto">
        @for (ex of filteredExceptions(); track ex.id) {
          <button
            type="button"
            (click)="select(ex)"
            class="w-full text-left px-4 py-3.5 border-b border-gray-800/80 hover:bg-gray-800/60 transition-colors"
            [class.bg-gray-800/80]="selectedId() === ex.id"
            [class.border-l-2]="selectedId() === ex.id"
            [class.border-l-blue-500]="selectedId() === ex.id"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-mono text-gray-400">{{ ex.id }}</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded border" [ngClass]="severityClass(ex.severity)">{{ ex.severity }}</span>
                </div>
                <p class="text-sm font-medium text-gray-100 truncate">{{ ex.title }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ ex.loadId }} · {{ ex.carrier }}</p>
              </div>
              <span class="text-[10px] px-1.5 py-0.5 rounded shrink-0" [ngClass]="statusClass(ex.status)">{{ ex.status }}</span>
            </div>
            <div class="mt-2 flex items-center justify-between text-[11px] text-gray-500">
              <span>{{ ex.type }}</span>
              <span>{{ ex.lastUpdate }}</span>
            </div>
          </button>
        } @empty {
          <div class="p-8 text-center text-sm text-gray-500">No exceptions match the filters.</div>
        }
      </div>
    </aside>

    <!-- Right: Detail -->
    <main class="flex-1 overflow-y-auto">
      @if (selectedException(); as ex) {
        <div class="p-6 max-w-4xl">
          <!-- Detail header -->
          <div class="flex items-start justify-between gap-4 mb-6">
            <div>
              <div class="flex items-center gap-3 mb-1">
                <h2 class="text-xl font-semibold">{{ ex.title }}</h2>
                <span class="text-xs px-2 py-0.5 rounded border" [ngClass]="severityClass(ex.severity)">{{ ex.severity }}</span>
                <span class="text-xs px-2 py-0.5 rounded" [ngClass]="statusClass(ex.status)">{{ ex.status }}</span>
              </div>
              <p class="text-sm text-gray-400">{{ ex.id }} · {{ ex.loadId }}{{ ex.orderId ? ' · ' + ex.orderId : '' }} · {{ ex.carrier }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ ex.location }} · Opened {{ ex.openedAt }}</p>
            </div>
            <div class="flex gap-2">
              <button type="button" (click)="markInProgress()" class="action-btn progress" [disabled]="ex.status === 'In Progress' || ex.status === 'Resolved'">In Progress</button>
              <button type="button" (click)="resolve()" class="action-btn resolve" [disabled]="ex.status === 'Resolved'">Resolve</button>
            </div>
          </div>

          <p class="text-sm text-gray-300 mb-6 leading-relaxed">{{ ex.description }}</p>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Timeline -->
            <section class="lg:col-span-1">
              <h3 class="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Timeline</h3>
              <div class="relative pl-4 space-y-4">
                <div class="absolute left-[7px] top-1 bottom-1 w-px bg-gray-700"></div>
                @for (ev of ex.timeline; track ev.time) {
                  <div class="relative">
                    <div class="absolute -left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-gray-900"></div>
                    <div class="text-xs text-gray-500">{{ ev.time }}</div>
                    <div class="text-sm font-medium text-gray-200">{{ ev.title }}</div>
                    <div class="text-xs text-gray-400 mt-0.5">{{ ev.description }}</div>
                    <div class="text-[11px] text-gray-500 mt-0.5">{{ ev.actor }}</div>
                  </div>
                }
              </div>
            </section>

            <!-- Actions + Comms -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Actions taken -->
              <section>
                <h3 class="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Actions Taken</h3>
                <div class="space-y-2">
                  @for (act of ex.actions; track act.id) {
                    <div class="bg-gray-800/60 border border-gray-700/70 rounded-lg px-3.5 py-2.5">
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-200">{{ act.action }}</span>
                        <span class="text-[11px] text-gray-500">{{ act.at }}</span>
                      </div>
                      <div class="text-xs text-gray-500 mt-0.5">by {{ act.by }}{{ act.notes ? ' · ' + act.notes : '' }}</div>
                    </div>
                  } @empty {
                    <p class="text-xs text-gray-500">No actions recorded yet.</p>
                  }
                </div>
              </section>

              <!-- Communication log -->
              <section>
                <h3 class="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Communication Log</h3>
                <div class="space-y-2">
                  @for (comm of ex.communications; track comm.id) {
                    <div class="bg-gray-800/50 border border-gray-700/60 rounded-lg px-3.5 py-2.5 text-sm">
                      <div class="flex items-center justify-between mb-1">
                        <div class="flex items-center gap-2">
                          <span class="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">{{ comm.channel }}</span>
                          <span class="text-xs text-gray-400">{{ comm.from }} → {{ comm.to }}</span>
                        </div>
                        <span class="text-[11px] text-gray-500">{{ comm.at }}</span>
                      </div>
                      <p class="text-gray-300 text-xs leading-relaxed">{{ comm.message }}</p>
                    </div>
                  } @empty {
                    <p class="text-xs text-gray-500">No communications yet.</p>
                  }
                </div>
              </section>
            </div>
          </div>
        </div>
      } @else {
        <div class="h-full flex items-center justify-center text-gray-500">
          Select an exception to view details
        </div>
      }
    </main>
  </div>
</div>
ENDOFFILE

# ==================== exception-management.component.scss ====================
cat > "$TARGET_DIR/exception-management.component.scss" << 'ENDOFFILE'
/* Exception Management Screen - Same design language as other TMS screens */
/* Dark theme, Tailwind primary, SCSS for component-specific polish */

.exception-container {
  font-family: inherit;
}

.action-btn {
  @apply px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors
         disabled:opacity-40 disabled:cursor-not-allowed;

  &.progress {
    @apply bg-amber-600/20 border-amber-500/40 text-amber-300 hover:bg-amber-600/30 hover:border-amber-500/60;
  }

  &.resolve {
    @apply bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 hover:border-emerald-500/60;
  }
}

/* Scrollbar polish for dark theme */
.exception-container ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.exception-container ::-webkit-scrollbar-track {
  background: transparent;
}

.exception-container ::-webkit-scrollbar-thumb {
  background: rgb(55 65 81);
  border-radius: 3px;
}

.exception-container ::-webkit-scrollbar-thumb:hover {
  background: rgb(75 85 99);
}
ENDOFFILE

echo ""
echo "✅ Archivos creados:"
echo "   $TARGET_DIR/exception-management.component.ts"
echo "   $TARGET_DIR/exception-management.component.html"
echo "   $TARGET_DIR/exception-management.component.scss"
echo ""
echo "📌 Agrega esta ruta a tu configuración (mismo estilo que Load Planning):"
echo ""
echo "   { path: 'exception-management', component: ExceptionManagementComponent, title: 'Exception Management' },"
echo ""
echo "Listo. Ajusta el import del componente según tu estructura de rutas."
echo "La lista muestra severidad con colores, y el panel de detalle incluye timeline, acciones tomadas y log de comunicación."
