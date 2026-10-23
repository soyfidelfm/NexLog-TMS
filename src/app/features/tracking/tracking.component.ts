import { TranslatePipe } from '@ngx-translate/core';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { camelKey } from '../../shared/i18n-keys';
import { CommonModule } from '@angular/common';
import { ShipmentService } from '../../core/services/shipment.service';
import { RoutingService } from '../../core/services/routing.service';
import { Shipment } from '../../core/models';
import { ThemeService } from '../../core/theme.service';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [TranslatePipe, CommonModule, NgxMapLibreGLModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss',
})
export class TrackingComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private routing = inject(RoutingService);
  private readonly translate = inject(TranslateService);
  readonly theme = inject(ThemeService);
  readonly statusKey = camelKey;

  selected = signal<Shipment | null>(null);
  shipments = signal<Shipment[]>([]);
  private mapRef: maplibregl.Map | null = null;
  private drawn = new Set<string>();

  mapStyle = computed(() =>
    this.theme.isDark()
      ? 'https://tiles.openfreemap.org/styles/dark'
      : 'https://tiles.openfreemap.org/styles/liberty',
  );

  etaText(eta: string): string {
    const [day, time] = eta.split(' ');
    return this.translate.instant(day === 'Tomorrow' ? 'tracking.tomorrow' : 'tracking.today', { time });
  }

  ngOnInit(): void {
    this.shipmentService.getShipments().subscribe((data) => {
      this.shipments.set(data);
      if (data.length > 0) this.selected.set(data[0]);
      this.drawAll(data);
    });
  }

  private drawAll(list: Shipment[]) {
    for (const s of list) {
      // Immediate straight line so something shows
      this.upsertLine(s.id, s.route, s.color);
      this.routing.getRoute(s.route).subscribe((geo) => {
        this.upsertLine(s.id, geo.coordinates, s.color);
      });
    }
  }

  private upsertLine(id: string, coords: [number, number][], color: string) {
    const map = this.mapRef;
    if (!map || !coords.length) return;
    const srcId = `trk-src-${id}`;
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
      id: `trk-line-${id}`,
      type: 'line',
      source: srcId,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': color, 'line-width': 4, 'line-opacity': 0.9 },
    });
    this.drawn.add(id);
  }

  select(shipment: Shipment) {
    this.selected.set(shipment);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'In Transit':
        return 'bg-blue-500/20 text-blue-ink';
      case 'Out for Delivery':
        return 'bg-green-500/20 text-green-ink';
      case 'Delayed':
        return 'bg-orange-500/20 text-orange-ink';
      default:
        return 'bg-slate-500/20 text-muted';
    }
  }

  onMapLoad(map: maplibregl.Map) {
    this.mapRef = map;
    const list = this.shipments();
    if (list.length) {
      const coords = list.flatMap((s) => s.route);
      if (coords.length) {
        const bounds = coords.reduce(
          (b, c) => b.extend(c as [number, number]),
          new maplibregl.LngLatBounds(coords[0], coords[0]),
        );
        map.fitBounds(bounds, { padding: 60, duration: 800 });
      }
      this.drawAll(list);
    }
  }
}
