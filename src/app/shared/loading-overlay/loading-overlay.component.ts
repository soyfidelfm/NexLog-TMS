import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LoadingService } from '../../core/loading/loading.service';
import { ThemeService } from '../../core/theme.service';

/**
 * Full-screen "Loading" popup shown while API requests are in flight (see LoadingService for the timing rules).
 * Mounted in MainLayout and the login page; app.html keeps only <router-outlet />.
 */
@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss',
})
export class LoadingOverlayComponent {
  private readonly doc = inject(DOCUMENT);
  readonly loading = inject(LoadingService);
  readonly theme = inject(ThemeService);

  constructor() {
    // Tab / Enter / Space must not reach the dimmed page while the overlay is up (pointer events are blocked by the overlay itself).
    const blockKeys = (e: KeyboardEvent) => {
      if (this.loading.visible() && (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    this.doc.addEventListener('keydown', blockKeys, true);

    // Tell assistive tech the page is busy.
    effect(() => {
      const body = this.doc.body;
      if (this.loading.visible()) body.setAttribute('aria-busy', 'true');
      else body.removeAttribute('aria-busy');
    });

    inject(DestroyRef).onDestroy(() => {
      this.doc.removeEventListener('keydown', blockKeys, true);
      this.doc.body.removeAttribute('aria-busy');
    });
  }
}
