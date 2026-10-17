import { Injectable, effect, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'nexlog.theme';

/**
 * App theme (dark | light). Dark is the default.
 * The choice is persisted in localStorage ('nexlog.theme') and applied as
 * <html data-theme="..."> so the CSS tokens in styles.css switch globally.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.readStored());

  constructor() {
    effect(() => {
      const t = this.theme();
      document.documentElement.setAttribute('data-theme', t);
      try {
        localStorage.setItem(STORAGE_KEY, t);
      } catch {
        /* storage unavailable: keep the in-memory value */
      }
    });
  }

  isDark(): boolean {
    return this.theme() === 'dark';
  }

  toggle(): void {
    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  private readStored(): Theme {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  }
}
