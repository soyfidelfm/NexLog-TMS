import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, OnInit, signal } from '@angular/core';
import { LanguageService } from '../../core/language.service';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { LoadService } from '../../core/services/load.service';
import { OrderService } from '../../core/services/order.service';
import { PlanningOrder, Trailer } from '../../core/models';

@Component({
  selector: 'app-load-planning',
  standalone: true,
  imports: [TranslatePipe, CommonModule, DragDropModule],
  templateUrl: './load-planning.component.html',
  styleUrl: './load-planning.component.scss',
})
export class LoadPlanningComponent implements OnInit {
  private loadService = inject(LoadService);
  private orderService = inject(OrderService);
  readonly lang = inject(LanguageService);
  readonly priorityKey: Record<PlanningOrder['priority'], string> = { High: 'priority.high', Medium: 'priority.medium', Low: 'priority.low' };

  /** 'Dry Van 53\'' -> translation key for the equipment type. */
  trailerTypeKey(type: string): string {
    return type.startsWith('Reefer') ? 'loadPlanning.type.reefer' : 'loadPlanning.type.dryVan';
  }
  trailerLength(type: string): string {
    return type.split(' ').pop() ?? '';
  }
  /** Signal: components are OnPush by default (Angular 22); a plain field assigned in subscribe() never repaints. */
  unassigned = signal<PlanningOrder[]>([]);
  trailers = signal<Trailer[]>([]);

  ngOnInit(): void {
    this.orderService.getUnassignedOrders().subscribe(data => {
      this.unassigned.set(data);
    });
    this.loadService.getTrailers().subscribe(data => {
      this.trailers.set(data);
    });
  }

  // IDs de las listas conectadas para CDK
  get dropListIds(): string[] {
    return ['unassigned', ...this.trailers().map(t => t.id)];
  }

  getUsedWeight(trailer: Trailer): number {
    return trailer.assigned.reduce((sum, o) => sum + o.weight, 0);
  }

  getUsedVolume(trailer: Trailer): number {
    return trailer.assigned.reduce((sum, o) => sum + o.volume, 0);
  }

  getWeightPercent(trailer: Trailer): number {
    return Math.min(100, (this.getUsedWeight(trailer) / trailer.maxWeight) * 100);
  }

  getVolumePercent(trailer: Trailer): number {
    return Math.min(100, (this.getUsedVolume(trailer) / trailer.maxVolume) * 100);
  }

  getCapacityClass(percent: number): string {
    if (percent >= 95) return 'bg-red-500';
    if (percent >= 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  }

  drop(event: CdkDragDrop<PlanningOrder[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  // Opcional: quitar de un tráiler (botón)
  removeFromTrailer(trailer: Trailer, index: number) {
    const [order] = trailer.assigned.splice(index, 1);
    this.unassigned().push(order);
  }
}
