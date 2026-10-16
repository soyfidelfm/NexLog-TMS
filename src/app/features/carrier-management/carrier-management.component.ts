import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Carrier {
  id: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive' | 'Pending';
  onTimePercent: number;
  claimsRate: number; // %
  rating: number; // 0-5
  totalLoads: number;
  mcNumber: string;
  dotNumber: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  equipment: string[];
  notes: string;
}

@Component({
  selector: 'app-carrier-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrier-management.component.html',
  styleUrl: './carrier-management.component.scss',
})
export class CarrierManagementComponent {
  searchQuery = signal('');
  statusFilter = signal<'All' | 'Active' | 'Inactive' | 'Pending'>('All');
  minRating = signal(0);

  selectedId = signal<string | null>(null);

  carriers: Carrier[] = [
    {
      id: 'CR-001',
      name: 'Swift Transportation',
      code: 'SWFT',
      status: 'Active',
      onTimePercent: 96.4,
      claimsRate: 0.8,
      rating: 4.7,
      totalLoads: 1240,
      mcNumber: 'MC-133655',
      dotNumber: 'DOT-542389',
      contact: 'Dispatch Desk',
      phone: '(800) 555-0142',
      email: 'dispatch@swift.com',
      city: 'Phoenix',
      state: 'AZ',
      equipment: ['Dry Van', 'Reefer', 'Flatbed'],
      notes: 'Preferred partner for West Coast lanes. Excellent communication.',
    },
    {
      id: 'CR-002',
      name: 'Schneider National',
      code: 'SNDR',
      status: 'Active',
      onTimePercent: 94.1,
      claimsRate: 1.2,
      rating: 4.5,
      totalLoads: 980,
      mcNumber: 'MC-133655',
      dotNumber: 'DOT-542390',
      contact: 'Capacity Team',
      phone: '(800) 555-0198',
      email: 'capacity@schneider.com',
      city: 'Green Bay',
      state: 'WI',
      equipment: ['Dry Van', 'Intermodal'],
      notes: 'Strong in Midwest. Request 24h notice for reefer.',
    },
    {
      id: 'CR-003',
      name: 'J.B. Hunt',
      code: 'JBHT',
      status: 'Active',
      onTimePercent: 97.8,
      claimsRate: 0.5,
      rating: 4.9,
      totalLoads: 1560,
      mcNumber: 'MC-135797',
      dotNumber: 'DOT-612455',
      contact: 'Dedicated Ops',
      phone: '(800) 555-0177',
      email: 'ops@jbhunt.com',
      city: 'Lowell',
      state: 'AR',
      equipment: ['Dry Van', 'Intermodal', 'Dedicated'],
      notes: 'Top performer. Priority for high-value loads.',
    },
    {
      id: 'CR-004',
      name: 'Werner Enterprises',
      code: 'WERN',
      status: 'Active',
      onTimePercent: 92.3,
      claimsRate: 1.5,
      rating: 4.2,
      totalLoads: 740,
      mcNumber: 'MC-165372',
      dotNumber: 'DOT-53467',
      contact: 'Fleet Manager',
      phone: '(800) 555-0133',
      email: 'fleet@werner.com',
      city: 'Omaha',
      state: 'NE',
      equipment: ['Dry Van', 'Flatbed'],
      notes: 'Good for long-haul. Occasional delays on weekends.',
    },
    {
      id: 'CR-005',
      name: 'Landstar System',
      code: 'LSTR',
      status: 'Inactive',
      onTimePercent: 89.6,
      claimsRate: 2.1,
      rating: 3.8,
      totalLoads: 310,
      mcNumber: 'MC-166960',
      dotNumber: 'DOT-221578',
      contact: 'Agent Network',
      phone: '(800) 555-0120',
      email: 'agents@landstar.com',
      city: 'Jacksonville',
      state: 'FL',
      equipment: ['Owner Operator', 'Specialized'],
      notes: 'On hold pending insurance renewal.',
    },
    {
      id: 'CR-006',
      name: 'Knight-Swift',
      code: 'KNX',
      status: 'Pending',
      onTimePercent: 95.0,
      claimsRate: 0.9,
      rating: 4.4,
      totalLoads: 0,
      mcNumber: 'MC-227271',
      dotNumber: 'DOT-264184',
      contact: 'Onboarding',
      phone: '(800) 555-0188',
      email: 'onboarding@knights.com',
      city: 'Phoenix',
      state: 'AZ',
      equipment: ['Dry Van'],
      notes: 'New carrier. Awaiting final document verification.',
    },
  ];

  filteredCarriers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();
    const minR = this.minRating();

    return this.carriers.filter(c => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.mcNumber.toLowerCase().includes(q);
      const matchesStatus = status === 'All' || c.status === status;
      const matchesRating = c.rating >= minR;
      return matchesSearch && matchesStatus && matchesRating;
    });
  });

  selected = computed(() => this.carriers.find(c => c.id === this.selectedId()) ?? null);

  select(id: string) {
    this.selectedId.set(this.selectedId() === id ? null : id);
  }

  getRatingStars(rating: number): string {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
  }

  getOnTimeClass(percent: number): string {
    if (percent >= 95) return 'text-emerald-400';
    if (percent >= 90) return 'text-amber-400';
    return 'text-red-400';
  }

  getClaimsClass(rate: number): string {
    if (rate <= 1) return 'text-emerald-400';
    if (rate <= 2) return 'text-amber-400';
    return 'text-red-400';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'bg-emerald-500/15 text-emerald-400';
      case 'Inactive': return 'bg-slate-700 text-slate-400';
      case 'Pending': return 'bg-amber-500/15 text-amber-400';
      default: return 'bg-slate-700 text-slate-300';
    }
  }

  addCarrier() {
    // Placeholder — en producción abriría un modal o navegaría a un formulario
    alert('Add Carrier form (to be implemented)');
  }
}
