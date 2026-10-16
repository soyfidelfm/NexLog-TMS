import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

interface Order {
  id: string;
  customer: string;
  origin: string;
  destination: string;
  weight: number;   // lbs
  volume: number;   // cubic ft
  priority: 'High' | 'Medium' | 'Low';
}

interface Trailer {
  id: string;
  name: string;
  type: string;
  maxWeight: number;
  maxVolume: number;
  assigned: Order[];
}

@Component({
  selector: 'app-load-planning',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './load-planning.component.html',
  styleUrl: './load-planning.component.scss',
})
export class LoadPlanningComponent {
  unassigned: Order[] = [
    { id: 'ORD-1042', customer: 'Acme Corp', origin: 'Los Angeles, CA', destination: 'Phoenix, AZ', weight: 4200, volume: 180, priority: 'High' },
    { id: 'ORD-1045', customer: 'Global Foods', origin: 'San Diego, CA', destination: 'Las Vegas, NV', weight: 2800, volume: 220, priority: 'Medium' },
    { id: 'ORD-1048', customer: 'TechParts Inc', origin: 'Irvine, CA', destination: 'Salt Lake City, UT', weight: 1500, volume: 90, priority: 'Low' },
    { id: 'ORD-1051', customer: 'BuildRight', origin: 'Los Angeles, CA', destination: 'Denver, CO', weight: 6100, volume: 310, priority: 'High' },
    { id: 'ORD-1053', customer: 'FreshMart', origin: 'Bakersfield, CA', destination: 'Phoenix, AZ', weight: 3400, volume: 260, priority: 'Medium' },
    { id: 'ORD-1057', customer: 'AutoSupply', origin: 'Ontario, CA', destination: 'Albuquerque, NM', weight: 2200, volume: 140, priority: 'Low' },
  ];

  trailers: Trailer[] = [
    {
      id: 'TRL-01',
      name: 'Trailer 01',
      type: 'Dry Van 53\'',
      maxWeight: 45000,
      maxVolume: 3800,
      assigned: [
        { id: 'ORD-1038', customer: 'Pacific Steel', origin: 'Long Beach, CA', destination: 'Phoenix, AZ', weight: 18500, volume: 980, priority: 'High' },
        { id: 'ORD-1040', customer: 'Valley Produce', origin: 'Fresno, CA', destination: 'Tucson, AZ', weight: 9200, volume: 640, priority: 'Medium' },
      ],
    },
    {
      id: 'TRL-02',
      name: 'Trailer 02',
      type: 'Dry Van 53\'',
      maxWeight: 45000,
      maxVolume: 3800,
      assigned: [
        { id: 'ORD-1035', customer: 'WestCoast Logistics', origin: 'Los Angeles, CA', destination: 'Las Vegas, NV', weight: 12400, volume: 720, priority: 'Medium' },
      ],
    },
    {
      id: 'TRL-03',
      name: 'Trailer 03',
      type: 'Reefer 53\'',
      maxWeight: 42000,
      maxVolume: 3400,
      assigned: [],
    },
    {
      id: 'TRL-04',
      name: 'Trailer 04',
      type: 'Dry Van 48\'',
      maxWeight: 40000,
      maxVolume: 3200,
      assigned: [
        { id: 'ORD-1031', customer: 'Mountain Goods', origin: 'San Bernardino, CA', destination: 'Salt Lake City, UT', weight: 7800, volume: 410, priority: 'Low' },
      ],
    },
  ];

  // IDs de las listas conectadas para CDK
  get dropListIds(): string[] {
    return ['unassigned', ...this.trailers.map(t => t.id)];
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

  drop(event: CdkDragDrop<Order[]>) {
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
    this.unassigned.push(order);
  }
}
