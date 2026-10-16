#!/usr/bin/env bash
set -e
DIR="src/app/features/route-optimization"
mkdir -p "$DIR"

cat > "$DIR/route-optimization.data.ts" <<'EOF'
export interface Stop { name: string; x: number; y: number; eta: string; type: 'depot' | 'pickup' | 'delivery'; }
export interface OptRoute {
  id: string; name: string; color: string; vehicle: string; driver: string;
  distanceKm: number; durationMin: number; cost: number; loadPct: number; stops: Stop[];
}

const depot: Stop = { name: 'Main Depot · Dallas, TX', x: 470, y: 330, eta: '06:00', type: 'depot' };

export const ROUTES: OptRoute[] = [
  { id: 'R-01', name: 'North Corridor', color: '#3b82f6', vehicle: 'TRK-104 · 53ft Dry Van', driver: 'Mike Johnson',
    distanceKm: 412, durationMin: 395, cost: 1240, loadPct: 92,
    stops: [depot,
      { name: 'Denton, TX', x: 455, y: 245, eta: '07:05', type: 'pickup' },
      { name: 'Ardmore, OK', x: 480, y: 165, eta: '08:40', type: 'delivery' },
      { name: 'Oklahoma City, OK', x: 440, y: 85, eta: '10:15', type: 'delivery' },
      { name: 'Tulsa, OK', x: 560, y: 70, eta: '12:05', type: 'delivery' }] },
  { id: 'R-02', name: 'East Loop', color: '#22c55e', vehicle: 'TRK-118 · Reefer', driver: 'Sarah Lee',
    distanceKm: 356, durationMin: 340, cost: 1085, loadPct: 87,
    stops: [depot,
      { name: 'Tyler, TX', x: 640, y: 320, eta: '07:45', type: 'delivery' },
      { name: 'Longview, TX', x: 720, y: 290, eta: '08:35', type: 'pickup' },
      { name: 'Shreveport, LA', x: 810, y: 260, eta: '09:50', type: 'delivery' }] },
  { id: 'R-03', name: 'South Run', color: '#a855f7', vehicle: 'TRK-097 · Flatbed', driver: 'Carlos Ruiz',
    distanceKm: 468, durationMin: 430, cost: 1390, loadPct: 95,
    stops: [depot,
      { name: 'Waco, TX', x: 480, y: 450, eta: '07:30', type: 'delivery' },
      { name: 'Austin, TX', x: 430, y: 560, eta: '09:10', type: 'delivery' },
      { name: 'San Antonio, TX', x: 360, y: 640, eta: '10:45', type: 'delivery' }] },
  { id: 'R-04', name: 'West Express', color: '#f59e0b', vehicle: 'TRK-131 · 26ft Box', driver: 'Emily Chen',
    distanceKm: 298, durationMin: 285, cost: 905, loadPct: 78,
    stops: [depot,
      { name: 'Fort Worth, TX', x: 400, y: 335, eta: '06:50', type: 'pickup' },
      { name: 'Abilene, TX', x: 230, y: 380, eta: '09:20', type: 'delivery' },
      { name: 'Midland, TX', x: 110, y: 440, eta: '11:30', type: 'delivery' }] },
];

export const SUMMARY = {
  before: { km: 1874, cost: 5720, hours: 27.6, vehicles: 5 },
  after:  { km: 1534, cost: 4620, hours: 24.2, vehicles: 4 },
  co2SavedKg: 289,
  lastRun: 'May 21, 2025 10:24 AM',
};
EOF

cat > "$DIR/route-optimization.component.ts" <<'EOF'
import { Component, computed, signal } from '@angular/core';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { ROUTES, SUMMARY, OptRoute } from './route-optimization.data';

@Component({
  selector: 'app-route-optimization',
  standalone: true,
  imports: [DecimalPipe, CurrencyPipe],
  templateUrl: './route-optimization.component.html',
  styleUrl: './route-optimization.component.scss',
})
export class RouteOptimizationComponent {
  routes = ROUTES;
  summary = SUMMARY;
  selected = signal<string | null>(null);
  optimizing = signal(false);
  objective = signal<'distance' | 'time' | 'cost'>('cost');

  active = computed<OptRoute | null>(() => this.routes.find(r => r.id === this.selected()) ?? null);
  kmSaved = computed(() => this.summary.before.km - this.summary.after.km);
  costSaved = computed(() => this.summary.before.cost - this.summary.after.cost);
  kmPct = computed(() => Math.round((this.kmSaved() / this.summary.before.km) * 100));
  costPct = computed(() => Math.round((this.costSaved() / this.summary.before.cost) * 100));
  totals = computed(() => this.routes.reduce((a, r) => ({
    km: a.km + r.distanceKm, min: a.min + r.durationMin, cost: a.cost + r.cost, stops: a.stops + r.stops.length - 1,
  }), { km: 0, min: 0, cost: 0, stops: 0 }));

  path(r: OptRoute) { return r.stops.map((s, i) => `${i ? 'L' : 'M'}${s.x},${s.y}`).join(' '); }
  toggle(id: string) { this.selected.set(this.selected() === id ? null : id); }
  dim(r: OptRoute) { return this.selected() !== null && this.selected() !== r.id; }
  hrs(min: number) { return `${Math.floor(min / 60)}h ${min % 60}m`; }
  runOptimize() { this.optimizing.set(true); setTimeout(() => this.optimizing.set(false), 1500); }
}
EOF

cat > "$DIR/route-optimization.component.html" <<'EOF'
<div class="min-h-full bg-[#0b1220] p-4 text-slate-200 lg:p-8">
  <!-- Header -->
  <header class="mb-6 flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold text-white">Route Optimization</h1>
      <p class="mt-1 text-sm text-slate-400">Optimize multi-stop routes to reduce distance, time and cost</p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <div class="flex rounded-lg border border-slate-800 bg-[#0f172a] p-1 text-sm">
        @for (o of ['distance','time','cost']; track o) {
          <button (click)="objective.set($any(o))" class="rounded-md px-3 py-1.5 capitalize"
            [class]="objective() === o ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'">{{ o }}</button>
        }
      </div>
      <button class="btn-outline">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 21V9m0 0-4 4m4-4 4 4M4 3h16"/></svg>Export
      </button>
      <button (click)="runOptimize()" [disabled]="optimizing()"
        class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 disabled:opacity-60">
        <svg class="h-4 w-4" [class.animate-spin]="optimizing()" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"/></svg>
        {{ optimizing() ? 'Optimizing…' : 'Re-optimize' }}
      </button>
    </div>
  </header>

  <!-- Summary -->
  <section class="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
    <div class="kpi">
      <span class="kpi-label">Distance saved</span>
      <span class="kpi-value text-emerald-400">{{ kmSaved() | number }} km</span>
      <span class="kpi-hint">{{ summary.before.km | number }} → {{ summary.after.km | number }} km · <b class="text-emerald-400">-{{ kmPct() }}%</b></span>
    </div>
    <div class="kpi">
      <span class="kpi-label">Cost saved</span>
      <span class="kpi-value text-emerald-400">{{ costSaved() | currency:'USD':'symbol':'1.0-0' }}</span>
      <span class="kpi-hint">{{ summary.before.cost | currency:'USD':'symbol':'1.0-0' }} → {{ summary.after.cost | currency:'USD':'symbol':'1.0-0' }} · <b class="text-emerald-400">-{{ costPct() }}%</b></span>
    </div>
    <div class="kpi">
      <span class="kpi-label">Drive time</span>
      <span class="kpi-value text-white">{{ summary.after.hours }} h</span>
      <span class="kpi-hint">was {{ summary.before.hours }} h · {{ summary.after.vehicles }} vehicles (was {{ summary.before.vehicles }})</span>
    </div>
    <div class="kpi">
      <span class="kpi-label">CO₂ reduced</span>
      <span class="kpi-value text-blue-400">{{ summary.co2SavedKg }} kg</span>
      <span class="kpi-hint">Last run {{ summary.lastRun }}</span>
    </div>
  </section>

  <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
    <!-- Map -->
    <section class="relative overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a]">
      <div class="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
        @for (r of routes; track r.id) {
          <button (click)="toggle(r.id)" class="flex items-center gap-2 rounded-full border border-slate-700 bg-[#0b1220]/90 px-3 py-1 text-xs backdrop-blur"
            [class.ring-2]="selected() === r.id" [style.--tw-ring-color]="r.color">
            <span class="h-2.5 w-2.5 rounded-full" [style.background]="r.color"></span>{{ r.id }} · {{ r.name }}
          </button>
        }
      </div>
      <svg viewBox="0 0 900 700" class="h-[460px] w-full lg:h-[620px]">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#1e293b" stroke-width="1"/>
          </pattern>
          <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width="900" height="700" fill="url(#grid)"/>
        <path d="M60 120 Q300 40 620 50 T880 160 L870 520 Q700 690 380 680 T40 560 Z" fill="#111c33" stroke="#1e293b"/>
        <path d="M80 340 H860 M470 40 V690 M150 600 L800 120" stroke="#1f2a44" stroke-width="3" stroke-dasharray="2 8" fill="none"/>

        @for (r of routes; track r.id) {
          <g [style.opacity]="dim(r) ? 0.15 : 1" class="cursor-pointer transition-opacity" (click)="toggle(r.id)">
            <path [attr.d]="path(r)" fill="none" [attr.stroke]="r.color" stroke-width="10" stroke-opacity=".18" stroke-linecap="round" stroke-linejoin="round"/>
            <path [attr.d]="path(r)" fill="none" [attr.stroke]="r.color" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="route-dash" filter="url(#glow)"/>
            @for (s of r.stops; track s.name; let i = $index) {
              @if (i > 0) {
                <circle [attr.cx]="s.x" [attr.cy]="s.y" r="11" fill="#0b1220" [attr.stroke]="r.color" stroke-width="2.5"/>
                <text [attr.x]="s.x" [attr.y]="s.y + 4" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">{{ i }}</text>
                <text [attr.x]="s.x + 16" [attr.y]="s.y + 4" font-size="11" fill="#94a3b8">{{ s.name }}</text>
              }
            }
          </g>
        }
        <g>
          <circle cx="470" cy="330" r="20" fill="#2563eb" fill-opacity=".2"/>
          <rect x="458" y="318" width="24" height="24" rx="6" fill="#2563eb"/>
          <text x="470" y="334" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">D</text>
          <text x="496" y="350" font-size="11" fill="#cbd5e1">Main Depot</text>
        </g>
      </svg>
      <div class="absolute bottom-4 left-4 flex gap-4 rounded-lg border border-slate-800 bg-[#0b1220]/90 px-3 py-2 text-xs text-slate-400">
        <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded bg-blue-600"></span>Depot</span>
        <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-full border-2 border-slate-300"></span>Stop</span>
        <span>{{ totals().stops }} stops · {{ totals().km | number }} km</span>
      </div>
    </section>

    <!-- Side panel -->
    <aside class="flex max-h-[720px] flex-col gap-4 overflow-y-auto pr-1">
      @for (r of routes; track r.id) {
        <article (click)="toggle(r.id)" class="cursor-pointer rounded-xl border bg-[#0f172a] p-4 transition-colors"
          [class]="selected() === r.id ? 'border-blue-500/60' : 'border-slate-800 hover:border-slate-700'">
          <div class="mb-3 flex items-start justify-between gap-2">
            <div class="flex items-center gap-3">
              <span class="h-9 w-1.5 rounded-full" [style.background]="r.color"></span>
              <div>
                <div class="font-semibold text-white">{{ r.id }} · {{ r.name }}</div>
                <div class="text-xs text-slate-500">{{ r.vehicle }} · {{ r.driver }}</div>
              </div>
            </div>
            <span class="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">Optimized</span>
          </div>

          <div class="mb-3 grid grid-cols-3 gap-2 text-center">
            <div class="stat"><span class="stat-v">{{ r.distanceKm }} km</span><span class="stat-l">Distance</span></div>
            <div class="stat"><span class="stat-v">{{ hrs(r.durationMin) }}</span><span class="stat-l">Time</span></div>
            <div class="stat"><span class="stat-v">{{ r.cost | currency:'USD':'symbol':'1.0-0' }}</span><span class="stat-l">Cost</span></div>
          </div>

          <div class="mb-3">
            <div class="mb-1 flex justify-between text-xs text-slate-500"><span>Load utilization</span><span>{{ r.loadPct }}%</span></div>
            <div class="h-1.5 rounded-full bg-slate-800"><div class="h-full rounded-full" [style.width.%]="r.loadPct" [style.background]="r.color"></div></div>
          </div>

          <ol class="relative ml-2 space-y-2.5 border-l border-slate-800 pl-4">
            @for (s of r.stops; track s.name; let i = $index) {
              <li class="relative text-sm">
                <span class="absolute -left-[23px] top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full ring-4 ring-[#0f172a]"
                  [style.background]="i === 0 ? '#2563eb' : r.color"></span>
                <div class="flex justify-between gap-2">
                  <span class="text-slate-200">{{ i === 0 ? 'Depot' : i + '. ' + s.name }}</span>
                  <span class="tabular-nums text-slate-500">{{ s.eta }}</span>
                </div>
                @if (i > 0) {
                  <span class="text-xs capitalize" [class]="s.type === 'pickup' ? 'text-amber-400' : 'text-slate-500'">{{ s.type }}</span>
                }
              </li>
            }
          </ol>
        </article>
      }

      <div class="rounded-xl border border-slate-800 bg-[#0f172a] p-4 text-sm">
        <div class="mb-2 font-semibold text-white">Plan totals</div>
        <div class="flex justify-between text-slate-400"><span>Distance</span><span class="text-slate-200">{{ totals().km | number }} km</span></div>
        <div class="flex justify-between text-slate-400"><span>Drive time</span><span class="text-slate-200">{{ hrs(totals().min) }}</span></div>
        <div class="flex justify-between text-slate-400"><span>Cost</span><span class="text-slate-200">{{ totals().cost | currency:'USD':'symbol':'1.0-0' }}</span></div>
        <button class="mt-4 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-500">Dispatch all routes</button>
      </div>
    </aside>
  </div>
</div>
EOF

cat > "$DIR/route-optimization.component.scss" <<'EOF'
@reference "tailwindcss";

:host { display: block; }

.btn-outline {
  @apply flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0f172a] px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800;
}
.kpi { @apply flex flex-col gap-1 rounded-xl border border-slate-800 bg-[#0f172a] p-4; }
.kpi-label { @apply text-xs uppercase tracking-wide text-slate-500; }
.kpi-value { @apply text-2xl font-bold; }
.kpi-hint { @apply text-xs text-slate-400; }
.stat { @apply flex flex-col rounded-lg bg-[#0b1220] py-2; }
.stat-v { @apply text-sm font-semibold text-white; }
.stat-l { @apply text-[11px] text-slate-500; }

.route-dash {
  stroke-dasharray: 10 8;
  animation: dash 1.2s linear infinite;
}
@keyframes dash { to { stroke-dashoffset: -18; } }

aside::-webkit-scrollbar { width: 6px; }
aside::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 999px; }
EOF

echo "✔ Route Optimization creado en $DIR"
echo "Agrega en app.routes.ts:"
echo "  { path: 'route-optimization', loadComponent: () => import('./features/route-optimization/route-optimization.component').then(m => m.RouteOptimizationComponent) },"
