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
