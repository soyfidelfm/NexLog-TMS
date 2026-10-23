import { TranslatePipe } from '@ngx-translate/core';
import { Component, computed, inject, signal, OnInit, effect } from '@angular/core';
import { LanguageService } from '../../core/language.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { RoutingService } from '../../core/services/routing.service';
import { OrderDetail } from '../../core/models';
import { ThemeService } from '../../core/theme.service';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule, NgxMapLibreGLModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
})
export class OrderDetailComponent implements OnInit {
  private orderService = inject(OrderService);
  private routing = inject(RoutingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly lang = inject(LanguageService);
  readonly theme = inject(ThemeService);

  readonly allRequirements = ['Liftgate Required', 'Temperature Sensitive', 'Stackable', 'Residential Delivery'];
  readonly reqKey: Record<string, string> = {
    'Liftgate Required': 'orderDetail.req.liftgate',
    'Temperature Sensitive': 'orderDetail.req.temp',
    Stackable: 'orderDetail.req.stackable',
    'Residential Delivery': 'orderDetail.req.residential',
  };
  private readonly productKeys: Record<string, string> = { 'General Merchandise Class 50': 'orderDetail.product.general50' };
  productKey(v: string): string {
    return this.productKeys[v] ?? v;
  }

  isEditing = signal(false);
  editForm: Partial<OrderDetail> = {};
  order = signal<OrderDetail | null>(null);
  routeCoords = signal<[number, number][]>([]);

  private mapRef: maplibregl.Map | null = null;

  mapStyle = computed(() =>
    this.theme.isDark()
      ? 'https://tiles.openfreemap.org/styles/dark'
      : 'https://tiles.openfreemap.org/styles/liberty',
  );

  private readonly cityCoords: Record<string, [number, number]> = {
    'Dallas, TX': [-96.797, 32.777],
    Dallas: [-96.797, 32.777],
    'Austin, TX': [-97.743, 30.267],
    Austin: [-97.743, 30.267],
    'Houston, TX': [-95.369, 29.76],
    Houston: [-95.369, 29.76],
    'Oklahoma City, OK': [-97.516, 35.468],
    'Oklahoma City': [-97.516, 35.468],
    'San Antonio, TX': [-98.494, 29.424],
    'San Antonio': [-98.494, 29.424],
    'Fort Worth, TX': [-97.331, 32.756],
    'Fort Worth': [-97.331, 32.756],
    Midland: [-102.078, 31.997],
    'Midland, TX': [-102.078, 31.997],
    Waco: [-97.147, 31.549],
    'Waco, TX': [-97.147, 31.549],
  };

  constructor() {
    // Redraw route when theme changes (style reload wipes layers)
    effect(() => {
      this.theme.isDark();
      // Defer so the new style has loaded
      setTimeout(() => this.redraw(), 120);
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || 'ORD-240515-0897';
    this.orderService.getOrderDetail(id).subscribe((data) => {
      this.order.set(data);
      this.loadRoad();
    });
  }

  private coordsFor(city: string): [number, number] {
    return this.cityCoords[city] ?? this.cityCoords[city.split(',')[0].trim()] ?? [-96.797, 32.777];
  }

  private loadRoad() {
    const o = this.order();
    if (!o) return;
    const pts: [number, number][] = [this.coordsFor(o.origin.city), this.coordsFor(o.destination.city)];
    this.routeCoords.set(pts);
    this.drawRoute(pts);
    this.routing.getRoute(pts).subscribe((geo) => {
      this.routeCoords.set(geo.coordinates);
      this.drawRoute(geo.coordinates);
    });
  }

  private redraw() {
    const coords = this.routeCoords();
    if (coords.length) this.drawRoute(coords);
  }

  private drawRoute(coords: [number, number][]) {
    const map = this.mapRef;
    if (!map || !coords.length) return;

    const data = {
      type: 'Feature' as const,
      properties: {},
      geometry: { type: 'LineString' as const, coordinates: coords },
    };

    // After a style reload the source is gone; re-add if missing
    const src = map.getSource('order-route-src') as maplibregl.GeoJSONSource | undefined;
    if (src) {
      src.setData(data);
      return;
    }

    map.addSource('order-route-src', { type: 'geojson', data });
    map.addLayer({
      id: 'order-route-casing',
      type: 'line',
      source: 'order-route-src',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#1e3a8a', 'line-width': 8, 'line-opacity': 0.9 },
    });
    map.addLayer({
      id: 'order-route-line',
      type: 'line',
      source: 'order-route-src',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#60a5fa', 'line-width': 4.5, 'line-opacity': 1 },
    });
  }

  originLngLat(): [number, number] {
    const o = this.order();
    return o ? this.coordsFor(o.origin.city) : [-96.797, 32.777];
  }

  destLngLat(): [number, number] {
    const o = this.order();
    return o ? this.coordsFor(o.destination.city) : [-97.743, 30.267];
  }

  onMapLoad(map: maplibregl.Map) {
    this.mapRef = map;
    const o = this.order();
    if (!o) return;
    const origin = this.coordsFor(o.origin.city);
    const dest = this.coordsFor(o.destination.city);
    const bounds = new maplibregl.LngLatBounds(origin, origin).extend(dest);
    map.fitBounds(bounds, { padding: 60, duration: 600 });

    // Redraw whenever the style finishes loading (theme switch)
    map.on('style.load', () => this.redraw());

    const existing = this.routeCoords();
    this.drawRoute(existing.length ? existing : [origin, dest]);
  }

  goBack() {
    this.router.navigate(['/orders']);
  }

  toggleEdit() {
    if (this.isEditing()) {
      this.cancelEdit();
    } else {
      this.editForm = structuredClone(this.order() || ({} as OrderDetail));
      this.isEditing.set(true);
    }
  }

  save() {
    if (this.editForm) {
      this.order.update((current) => ({ ...current!, ...this.editForm }));
    }
    this.isEditing.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editForm = {};
  }

  toggleRequirement(req: string) {
    if (!this.editForm.specialRequirements) this.editForm.specialRequirements = [];
    const index = this.editForm.specialRequirements.indexOf(req);
    if (index > -1) {
      this.editForm.specialRequirements.splice(index, 1);
    } else {
      this.editForm.specialRequirements.push(req);
    }
  }
}
