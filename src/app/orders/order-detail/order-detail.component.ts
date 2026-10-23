import { TranslatePipe } from '@ngx-translate/core';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { LanguageService } from '../../core/language.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
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
  private route = inject(ActivatedRoute);
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

  mapStyle = computed(() =>
    this.theme.isDark()
      ? 'https://tiles.openfreemap.org/styles/dark'
      : 'https://tiles.openfreemap.org/styles/liberty',
  );

  // Simple city → coords lookup for demo (extend as needed)
  private readonly cityCoords: Record<string, [number, number]> = {
    'Dallas, TX': [-96.797, 32.777],
    'Dallas': [-96.797, 32.777],
    'Austin, TX': [-97.743, 30.267],
    'Austin': [-97.743, 30.267],
    'Houston, TX': [-95.369, 29.760],
    'Houston': [-95.369, 29.760],
    'Oklahoma City, OK': [-97.516, 35.468],
    'Oklahoma City': [-97.516, 35.468],
    'San Antonio, TX': [-98.494, 29.424],
    'San Antonio': [-98.494, 29.424],
    'Fort Worth, TX': [-97.331, 32.756],
    'Fort Worth': [-97.331, 32.756],
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || 'ORD-240515-0897';
    this.orderService.getOrderDetail(id).subscribe((data) => {
      this.order.set(data);
    });
  }

  private coordsFor(city: string): [number, number] {
    return this.cityCoords[city] ?? this.cityCoords[city.split(',')[0].trim()] ?? [-96.797, 32.777];
  }

  routeGeoJson() {
    const o = this.order();
    if (!o) return null;
    const origin = this.coordsFor(o.origin.city);
    const dest = this.coordsFor(o.destination.city);
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: { type: 'LineString' as const, coordinates: [origin, dest] },
    };
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
    const o = this.order();
    if (!o) return;
    const origin = this.coordsFor(o.origin.city);
    const dest = this.coordsFor(o.destination.city);
    const bounds = new maplibregl.LngLatBounds(origin, origin).extend(dest);
    map.fitBounds(bounds, { padding: 50, duration: 600 });
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
