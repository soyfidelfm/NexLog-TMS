import { TranslatePipe } from '@ngx-translate/core';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/language.service';
import { RouteOptimizationService } from '../../core/services/route-optimization.service';
import { OptRoute, RouteSummary, Stop } from '../../core/models';

@Component({
  selector: 'app-route-optimization',
  standalone: true,
  imports: [TranslatePipe, DecimalPipe, CurrencyPipe, DatePipe],
  templateUrl: './route-optimization.component.html',
  styleUrl: './route-optimization.component.scss',
})
export class RouteOptimizationComponent implements OnInit {
  private routeOptService = inject(RouteOptimizationService);
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  routes = signal<OptRoute[]>([]);
  summary = signal<RouteSummary | null>(null);
  selected = signal<string | null>(null);
  optimizing = signal(false);
  objective = signal<'distance' | 'time' | 'cost'>('cost');

  ngOnInit(): void {
    this.routeOptService.getRoutes().subscribe(data => this.routes.set(data));
    this.routeOptService.getSummary().subscribe(data => this.summary.set(data));
  }

  active = computed<OptRoute | null>(() => this.routes().find(r => r.id === this.selected()) ?? null);
  kmSaved = computed(() => { const s = this.summary(); return s ? s.before.km - s.after.km : 0; });
  costSaved = computed(() => { const s = this.summary(); return s ? s.before.cost - s.after.cost : 0; });
  kmPct = computed(() => { const s = this.summary(); return s && s.before.km ? Math.round((this.kmSaved() / s.before.km) * 100) : 0; });
  costPct = computed(() => { const s = this.summary(); return s && s.before.cost ? Math.round((this.costSaved() / s.before.cost) * 100) : 0; });
  totals = computed(() => this.routes().reduce((a, r) => ({
    km: a.km + r.distanceKm, min: a.min + r.durationMin, cost: a.cost + r.cost, stops: a.stops + r.stops.length - 1,
  }), { km: 0, min: 0, cost: 0, stops: 0 }));

  path(r: OptRoute) { return r.stops.map((s, i) => `${i ? 'L' : 'M'}${s.x},${s.y}`).join(' '); }
  toggle(id: string) { this.selected.set(this.selected() === id ? null : id); }
  dim(r: OptRoute) { return this.selected() !== null && this.selected() !== r.id; }
  hrs(min: number) { return this.translate.instant('common.durationHm', { h: Math.floor(min / 60), m: min % 60 }); }
  /** City names are proper nouns; only the depot label is translated. */
  stopName(s: Stop) { return s.type === 'depot' ? 'routeOpt.mainDepotDallas' : s.name; }
  runOptimize() { this.optimizing.set(true); setTimeout(() => this.optimizing.set(false), 1500); }
}
