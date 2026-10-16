import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="flex h-screen bg-[#0b1220] text-slate-100 overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 flex-shrink-0 bg-slate-900/80 border-r border-slate-800 flex flex-col">
        <div class="h-16 flex items-center px-6 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
              N
            </div>
            <div>
              <div class="font-semibold text-white leading-tight">NexLog</div>
              <div class="text-xs text-slate-400">TMS</div>
            </div>
          </div>
        </div>

        <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-slate-800 text-white"
              [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
            >
              <span class="text-lg w-5 text-center">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="p-4 border-t border-slate-800 text-xs text-slate-500">
          NexLog TMS · Core
        </div>
      </aside>

      <!-- Main -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Header -->
        <header class="h-16 flex-shrink-0 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6">
          <div class="text-sm text-slate-400">
            Transportation Management System
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right text-sm">
              <div class="text-white font-medium">Fidel Filio</div>
              <div class="text-xs text-slate-400">Admin</div>
            </div>
            <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium">
              FF
            </div>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Orders', path: '/orders', icon: '📦' },
    { label: 'Load Planning', path: '/load-planning', icon: '🚛' },
    { label: 'Route Optimization', path: '/route-optimization', icon: '🗺️' },
    { label: 'Carriers', path: '/carrier-management', icon: '🚚' },
    { label: 'Rating', path: '/rating', icon: '💰' },
    { label: 'Tendering', path: '/tendering', icon: '📤' },
    { label: 'Documents', path: '/documents', icon: '📄' },
    { label: 'Freight Audit', path: '/freight-audit', icon: '📋' },
  ];
}
