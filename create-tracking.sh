#!/bin/bash

mkdir -p src/app/features/tracking

# tracking.component.ts
cat > src/app/features/tracking/tracking.component.ts << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface Shipment {
  id: string;
  orderNumber: string;
  origin: string;
  destination: string;
  driver: string;
  driverPhone: string;
  vehicle: string;
  eta: string;
  status: 'In Transit' | 'Out for Delivery' | 'Delayed' | 'At Pickup';
  progress: number;
  color: string;
  routePath: string;
  position: { x: number; y: number };
  alerts: { type: 'warning' | 'info' | 'error'; message: string }[];
  timeline: { label: string; time: string; completed: boolean; current?: boolean }[];
}

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent {
  selected: Shipment | null = null;

  shipments: Shipment[] = [
    {
      id: 'SHP-48291',
      orderNumber: 'ORD-100234',
      origin: 'Oxnard, CA',
      destination: 'Phoenix, AZ',
      driver: 'Carlos Méndez',
      driverPhone: '+1 (805) 555-0142',
      vehicle: 'Truck 247 • Volvo VNL',
      eta: 'Today 16:40',
      status: 'In Transit',
      progress: 68,
      color: '#3b82f6',
      routePath: 'M 70 280 L 150 220 L 240 190 L 330 150 L 420 130',
      position: { x: 330, y: 150 },
      alerts: [
        { type: 'warning', message: 'Traffic congestion near Blythe (+18 min)' }
      ],
      timeline: [
        { label: 'Order Created', time: '08:15', completed: true },
        { label: 'Picked Up', time: '09:40', completed: true },
        { label: 'In Transit', time: '10:05', completed: true, current: true },
        { label: 'Out for Delivery', time: '—', completed: false },
        { label: 'Delivered', time: '—', completed: false }
      ]
    },
    {
      id: 'SHP-48295',
      orderNumber: 'ORD-100241',
      origin: 'Los Angeles, CA',
      destination: 'Las Vegas, NV',
      driver: 'Ana Rodríguez',
      driverPhone: '+1 (213) 555-0198',
      vehicle: 'Truck 112 • Freightliner',
      eta: 'Today 18:15',
      status: 'Out for Delivery',
      progress: 89,
      color: '#22c55e',
      routePath: 'M 90 320 L 170 290 L 260 260 L 350 230 L 440 200',
      position: { x: 350, y: 230 },
      alerts: [],
      timeline: [
        { label: 'Order Created', time: '07:30', completed: true },
        { label: 'Picked Up', time: '08:55', completed: true },
        { label: 'In Transit', time: '09:20', completed: true },
        { label: 'Out for Delivery', time: '15:10', completed: true, current: true },
        { label: 'Delivered', time: '—', completed: false }
      ]
    },
    {
      id: 'SHP-48302',
      orderNumber: 'ORD-100258',
      origin: 'San Diego, CA',
      destination: 'Tucson, AZ',
      driver: 'Miguel Torres',
      driverPhone: '+1 (619) 555-0177',
      vehicle: 'Truck 089 • Kenworth',
      eta: 'Tomorrow 09:30',
      status: 'Delayed',
      progress: 42,
      color: '#f97316',
      routePath: 'M 110 380 L 190 350 L 280 330 L 360 300',
      position: { x: 280, y: 330 },
      alerts: [
        { type: 'error', message: 'Mechanical issue reported • ETA delayed +2h' }
      ],
      timeline: [
        { label: 'Order Created', time: '09:10', completed: true },
        { label: 'Picked Up', time: '11:00', completed: true },
        { label: 'In Transit', time: '11:30', completed: true, current: true },
        { label: 'Out for Delivery', time: '—', completed: false },
        { label: 'Delivered', time: '—', completed: false }
      ]
    }
  ];

  constructor() {
    this.selected = this.shipments[0];
  }

  select(shipment: Shipment) {
    this.selected = shipment;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'In Transit': return 'bg-blue-500/20 text-blue-400';
      case 'Out for Delivery': return 'bg-green-500/20 text-green-400';
      case 'Delayed': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  }
}
EOF

# tracking.component.html
cat > src/app/features/tracking/tracking.component.html << 'EOF'
<div class="flex h-screen bg-[#0b1220] text-slate-100 overflow-hidden">
  <!-- Sidebar -->
  <aside class="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col shrink-0">
    <div class="p-4 flex items-center gap-3 border-b border-slate-800">
      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">NL</div>
      <span class="font-semibold text-lg">NexLog TMS</span>
    </div>
    <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
      <a routerLink="/dashboard" routerLinkActive="bg-blue-600 text-white" [routerLinkActiveOptions]="{exact: true}"
         class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        Dashboard
      </a>
      <a routerLink="/tracking" routerLinkActive="bg-blue-600 text-white"
         class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        Tracking
      </a>
      <a routerLink="/route-optimization" routerLinkActive="bg-blue-600 text-white"
         class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
        Route Optimization
      </a>
    </nav>
  </aside>

  <!-- Main -->
  <main class="flex-1 flex overflow-hidden p-4 gap-4">
    <!-- Map -->
    <div class="flex-1 relative bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden">
      <div class="absolute inset-0 p-4 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-semibold">Live Tracking</h2>
          <span class="text-xs text-green-400 flex items-center gap-1">
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Live
          </span>
        </div>
        <div class="relative flex-1 bg-[#1e293b] rounded-lg overflow-hidden">
          <svg class="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            <ng-container *ngFor="let s of shipments">
              <path [attr.d]="s.routePath" [attr.stroke]="s.color" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
              <g [attr.transform]="'translate(' + s.position.x + ',' + s.position.y + ')'">
                <circle r="12" [attr.fill]="s.color" class="animate-pulse" opacity="0.3"/>
                <circle r="7" [attr.fill]="s.color" stroke="#0f172a" stroke-width="2"/>
                <text y="-16" text-anchor="middle" fill="#e2e8f0" font-size="11" font-weight="600">{{ s.id.slice(-4) }}</text>
              </g>
            </ng-container>
          </svg>
        </div>
      </div>
    </div>

    <!-- Side Panel -->
    <div class="w-[420px] bg-[#0f172a] rounded-xl border border-slate-800 flex flex-col overflow-hidden">
      <div class="border-b border-slate-800 p-4 max-h-64 overflow-y-auto">
        <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Active Shipments</h3>
        <div *ngFor="let s of shipments" 
             (click)="select(s)"
             class="p-3 rounded-lg mb-2 cursor-pointer transition border"
             [class.bg-slate-800]="selected?.id === s.id"
             [class.border-slate-600]="selected?.id === s.id"
             [class.border-transparent]="selected?.id !== s.id"
             [class.hover:bg-slate-800/50]="selected?.id !== s.id">
          <div class="flex items-center justify-between mb-1">
            <span class="font-medium">{{ s.id }}</span>
            <span class="text-xs px-2 py-0.5 rounded-full" [ngClass]="getStatusColor(s.status)">{{ s.status }}</span>
          </div>
          <div class="text-xs text-slate-400">{{ s.origin }} → {{ s.destination }}</div>
          <div class="text-xs text-slate-500 mt-1">ETA {{ s.eta }}</div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-5" *ngIf="selected">
        <div class="mb-5">
          <div class="flex items-center justify-between mb-1">
            <h2 class="text-xl font-semibold">{{ selected.id }}</h2>
            <span class="text-xs px-2.5 py-1 rounded-full" [ngClass]="getStatusColor(selected.status)">{{ selected.status }}</span>
          </div>
          <p class="text-sm text-slate-400">{{ selected.orderNumber }}</p>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-5">
          <div class="bg-slate-800/50 rounded-lg p-3">
            <div class="text-xs text-slate-400">ETA</div>
            <div class="font-semibold text-green-400">{{ selected.eta }}</div>
          </div>
          <div class="bg-slate-800/50 rounded-lg p-3">
            <div class="text-xs text-slate-400">Progress</div>
            <div class="font-semibold">{{ selected.progress }}%</div>
          </div>
        </div>

        <div class="mb-5">
          <div class="text-xs text-slate-400 mb-1">Driver</div>
          <div class="font-medium">{{ selected.driver }}</div>
          <div class="text-sm text-slate-400">{{ selected.driverPhone }}</div>
          <div class="text-xs text-slate-500 mt-1">{{ selected.vehicle }}</div>
        </div>

        <div class="mb-5">
          <h3 class="text-sm font-semibold text-slate-300 mb-3">Status Timeline</h3>
          <div class="space-y-3">
            <div *ngFor="let step of selected.timeline; let last = last" class="flex gap-3">
              <div class="flex flex-col items-center">
                <div class="w-3 h-3 rounded-full"
                     [class.bg-blue-500]="step.current"
                     [class.bg-green-500]="step.completed && !step.current"
                     [class.bg-slate-600]="!step.completed"></div>
                <div class="w-px flex-1 bg-slate-700 mt-1" *ngIf="!last"></div>
              </div>
              <div class="pb-3">
                <div class="text-sm" [class.font-medium]="step.current">{{ step.label }}</div>
                <div class="text-xs text-slate-500">{{ step.time }}</div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="selected.alerts.length">
          <h3 class="text-sm font-semibold text-slate-300 mb-3">Alerts</h3>
          <div *ngFor="let alert of selected.alerts" 
               class="p-3 rounded-lg mb-2 text-sm"
               [class.bg-orange-500/10]="alert.type === 'warning'"
               [class.bg-red-500/10]="alert.type === 'error'"
               [class.border]="true"
               [class.border-orange-500/30]="alert.type === 'warning'"
               [class.border-red-500/30]="alert.type === 'error'">
            {{ alert.message }}
          </div>
        </div>
        <div *ngIf="!selected.alerts.length" class="text-sm text-slate-500">No active alerts</div>
      </div>
    </div>
  </main>
</div>
EOF

# tracking.component.scss
cat > src/app/features/tracking/tracking.component.scss << 'EOF'
:host {
  display: block;
  height: 100%;
}
EOF

echo "✅ Tracking component created successfully"
echo ""
echo "Add this route to app.routes.ts:"
echo "{ path: 'tracking', component: TrackingComponent, title: 'Tracking' },"
