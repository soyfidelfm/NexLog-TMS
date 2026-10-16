import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../core/language.service';

interface NavItem {
  labelKey: keyof ReturnType<LanguageService['t']>;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-main-layout',
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
              <span>{{ lang.t()[item.labelKey] }}</span>
            </a>
          }
        </nav>

        <div class="p-4 border-t border-slate-800 text-xs text-slate-500">
          {{ lang.t().core }}
        </div>
      </aside>

      <!-- Main -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Header -->
        <header class="h-16 flex-shrink-0 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6">
          <div class="text-sm text-slate-400">
            {{ lang.t().tms }}
          </div>
          <div class="flex items-center gap-4">
            <!-- Language switcher -->
            <div class="flex items-center rounded-lg border border-slate-700 bg-slate-800/60 text-xs font-medium overflow-hidden">
              <button
                type="button"
                (click)="lang.setLang('en')"
                class="px-3 py-1.5 transition"
                [class.bg-blue-600]="lang.lang() === 'en'"
                [class.text-white]="lang.lang() === 'en'"
                [class.text-slate-400]="lang.lang() !== 'en'"
                [class.hover:bg-slate-700]="lang.lang() !== 'en'"
              >EN</button>
              <span class="text-slate-600">|</span>
              <button
                type="button"
                (click)="lang.setLang('es')"
                class="px-3 py-1.5 transition"
                [class.bg-blue-600]="lang.lang() === 'es'"
                [class.text-white]="lang.lang() === 'es'"
                [class.text-slate-400]="lang.lang() !== 'es'"
                [class.hover:bg-slate-700]="lang.lang() !== 'es'"
              >ES</button>
            </div>

            <div class="text-right text-sm">
              <div class="text-white font-medium">Fidel Filio</div>
              <div class="text-xs text-slate-400">{{ lang.t().admin }}</div>
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
export class MainLayoutComponent {
  readonly lang = inject(LanguageService);

  navItems: NavItem[] = [
    { labelKey: 'dashboard', path: '/dashboard', icon: '📊' },
    { labelKey: 'orders', path: '/orders', icon: '📦' },
    { labelKey: 'loadPlanning', path: '/load-planning', icon: '🚛' },
    { labelKey: 'routeOptimization', path: '/route-optimization', icon: '🗺️' },
    { labelKey: 'carriers', path: '/carrier-management', icon: '🚚' },
    { labelKey: 'rating', path: '/rating', icon: '💰' },
    { labelKey: 'tendering', path: '/tendering', icon: '📤' },
    { labelKey: 'documents', path: '/documents', icon: '📄' },
    { labelKey: 'freightAudit', path: '/freight-audit', icon: '📋' },
  ];
}
