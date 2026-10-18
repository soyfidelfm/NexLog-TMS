import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '../../core/theme.service';

export interface NavItem {
  labelKey: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  /** Mobile drawer state (controlled by the layout). */
  readonly open = input(false);
  readonly navigate = output<void>();
  readonly logoFailed = signal(false);
  readonly theme = inject(ThemeService);

  /** Desktop collapsed state */
  readonly collapsed = signal(false);

  toggleCollapsed() {
    this.collapsed.update(v => !v);
  }

  readonly navItems: NavItem[] = [
    { labelKey: 'nav.dashboard', path: '/dashboard', icon: '📊' },
    { labelKey: 'nav.orders', path: '/orders', icon: '📦' },
    { labelKey: 'nav.loadPlanning', path: '/load-planning', icon: '🚛' },
    { labelKey: 'nav.routeOptimization', path: '/route-optimization', icon: '🗺️' },
    { labelKey: 'nav.carriers', path: '/carrier-management', icon: '🚚' },
    { labelKey: 'nav.rating', path: '/rating', icon: '💰' },
    { labelKey: 'nav.tendering', path: '/tendering', icon: '📤' },
    { labelKey: 'nav.documents', path: '/documents', icon: '📄' },
    { labelKey: 'nav.freightAudit', path: '/freight-audit', icon: '📋' },
    { labelKey: 'nav.tracking', path: '/tracking', icon: '📍' },
    { labelKey: 'nav.exceptions', path: '/exceptions', icon: '⚠️' },
    { labelKey: 'nav.analytics', path: '/analytics', icon: '📈' },
    { labelKey: 'nav.rateTables', path: '/rate-tables', icon: '🧾' },
    { labelKey: 'nav.clientPortal', path: '/client-portal', icon: '🏢' },
  ];
}
