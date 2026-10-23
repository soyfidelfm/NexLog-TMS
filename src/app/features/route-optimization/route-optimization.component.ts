import { TranslatePipe } from '@ngx-translate/core';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/language.service';
import { ThemeService } from '../../core/theme.service';
import { RouteOptimizationService } from '../../core/services/route-optimization.service';
import { RoutingService } from '../../core/services/routing.service';
import { OptRoute, RouteSummary, Stop } from '../../core/models';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-route-optimization',
  standalone: true,
  imports: [TranslatePipe, DecimalPipe, CurrencyPipe, DatePipe, NgxMapLibreGLModule],
  templateUrl: './route-optimization.component.html',
  styleUrl: './route-optimization.component.scss',
})
export class RouteOptimizationComponent implements OnInit {
  private routeOptService = inject(RouteOptimizationService);
  private routing = inject(RoutingService);
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  readonly theme = inject(ThemeService);

  routes = signal<OptRoute[]>([]);
  summary = signal<RouteSummary | null>(null);
  selected = signal<string | null>(null);
  optimizing = signal(false);
  objective = signal<'distance' | 'time' | 'cost'>('cost');

  private mapRef: maplibregl.Map | null = null;

  mapStyle = computed(() =>
    this.theme.isDark()
      ? 'https://tiles.openfreemap.org/styles/dark'
      : 'https://tiles.openfreemap.org/styles/liberty',
  );

  ngOnInit(): void {
    this.routeOptService.getRoutes().subscribe((data) => {
      this.routes.set(data);
      this.drawAll(data);
    });
    this.routeOptService.getSummary().subscribe((data) => this.summary.set(data));
  }

  private drawAll(routes: OptRoute[]) {
    for (const r of routes) {
      const pts = r.stops.map((s) => [s.lng, s.lat] as [number, number]);
      this.upsertLine(r.id, pts, r.color);
      this.routing.getRoute(pts).subscribe((geo) => {
        this.upsertLine(r.id, geo.coordinates, r.color);
      });
    }
  }

  private upsertLine(id: string, coords: [number, number][], color: string) {
    const map = this.mapRef;
    if (!map || !coords.length) return;
    const srcId = `ro-src-${id}`;
    const data = {
      type: 'Feature' as const,
      properties: {},
      geometry: { type: 'LineString' as const, coordinates: coords },
    };
    const src = map.getSource(srcId) as maplibregl.GeoJSONSource | undefined;
    if (src) {
      src.setData(data);
      return;
    }
    map.addSource(srcId, { type: 'geojson', data });
    map.addLayer({
      id: `ro-casing-${id}`,
      type: 'line',
      source: srcId,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#0f172a', 'line-width': 7, 'line-opacity': 0.55 },
    });
    map.addLayer({
      id: `ro-line-${id}`,
      type: 'line',
      source: srcId,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': color, 'line-width': 4.5, 'line-opacity': 0.95 },
    });
  }

  active = computed<OptRoute | null>(() => this.routes().find((r) => r.id === this.selected()) ?? null);
  kmSaved = computed(() => {
    const s = this.summary();
    return s ? s.before.km - s.after.km : 0;
  });
  costSaved = computed(() => {
    const s = this.summary();
    return s ? s.before.cost - s.after.cost : 0;
  });
  kmPct = computed(() => {
    const s = this.summary();
    return s && s.before.km ? Math.round((this.kmSaved() / s.before.km) * 100) : 0;
  });
  costPct = computed(() => {
    const s = this.summary();
    return s && s.before.cost ? Math.round((this.costSaved() / s.before.cost) * 100) : 0;
  });
  totals = computed(() =>
    this.routes().reduce(
      (a, r) => ({
        km: a.km + r.distanceKm,
        min: a.min + r.durationMin,
        cost: a.cost + r.cost,
        stops: a.stops + r.stops.length - 1,
      }),
      { km: 0, min: 0, cost: 0, stops: 0 },
    ),
  );

  toggle(id: string) {
    this.selected.set(this.selected() === id ? null : id);
  }
  dim(r: OptRoute) {
    return this.selected() !== null && this.selected() !== r.id;
  }
  hrs(min: number) {
    return this.translate.instant('common.durationHm', { h: Math.floor(min / 60), m: min % 60 });
  }
  stopName(s: Stop) {
    return s.type === 'depot' ? 'routeOpt.mainDepotDallas' : s.name;
  }
  runOptimize() {
    this.optimizing.set(true);
    setTimeout(() => this.optimizing.set(false), 1500);
  }

  onMapLoad(map: maplibregl.Map) {
    this.mapRef = map;
    const routes = this.routes();
    if (!routes.length) return;
    const coords = routes.flatMap((r) => r.stops.map((s) => [s.lng, s.lat] as [number, number]));
    if (coords.length) {
      const bounds = coords.reduce(
        (b, c) => b.extend(c),
        new maplibregl.LngLatBounds(coords[0], coords[0]),
      );
      map.fitBounds(bounds, { padding: 80, duration: 1000 });
    }
    this.drawAll(routes);
  }
}
