import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'en' | 'es';

const translations = {
  en: {
    dashboard: 'Dashboard',
    orders: 'Orders',
    loadPlanning: 'Load Planning',
    routeOptimization: 'Route Optimization',
    carriers: 'Carriers',
    rating: 'Rating',
    tendering: 'Tendering',
    documents: 'Documents',
    freightAudit: 'Freight Audit',
    tms: 'Transportation Management System',
    admin: 'Admin',
    core: 'NexLog TMS · Core'
  },
  es: {
    dashboard: 'Dashboard',
    orders: 'Pedidos',
    loadPlanning: 'Planificación de Cargas',
    routeOptimization: 'Optimización de Rutas',
    carriers: 'Transportistas',
    rating: 'Cotización',
    tendering: 'Tendering',
    documents: 'Documentos',
    freightAudit: 'Auditoría de Fletes',
    tms: 'Sistema de Gestión de Transporte',
    admin: 'Admin',
    core: 'NexLog TMS · Core'
  }
} as const;

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly lang = signal<Lang>('en');

  readonly t = computed(() => translations[this.lang()]);

  setLang(lang: Lang): void {
    this.lang.set(lang);
  }

  toggle(): void {
    this.lang.update(l => l === 'en' ? 'es' : 'en');
  }
}
