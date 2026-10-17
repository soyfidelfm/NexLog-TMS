import { DOCUMENT, Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { textKey } from '../shared/i18n-keys';

export type Lang = 'es' | 'en';
export const SUPPORTED_LANGS: Lang[] = ['es', 'en'];
const STORAGE_KEY = 'nexlog.lang';
const DEFAULT_LANG: Lang = 'es';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  /** Current UI language. */
  readonly lang = signal<Lang>(DEFAULT_LANG);
  /** Locale id for Date/Currency/Decimal pipes. */
  locale(): string {
    return this.lang() === 'es' ? 'es-MX' : 'en-US';
  }

  init(): void {
    this.translate.addLangs(SUPPORTED_LANGS);
    this.translate.setFallbackLang(DEFAULT_LANG);
    this.setLang(this.readStored() ?? DEFAULT_LANG);
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
    this.translate.use(lang);
    this.document.documentElement.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* storage unavailable */ }
  }

  /**
   * Translates a free-text mock-data value (e.g. a timeline title) via `<ns>.txt.<key>`.
   * Proper nouns / values without a translation (people, emails, IDs) are returned unchanged.
   * Reads `lang()` so signal-based views re-render on language change.
   */
  text(ns: string, value: string | null | undefined): string {
    if (!value) return '';
    this.lang();
    const key = textKey(ns, value);
    const out = this.translate.instant(key);
    return out === key ? value : out;
  }

  toggle(): void {
    this.setLang(this.lang() === 'es' ? 'en' : 'es');
  }

  private readStored(): Lang | null {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === 'es' || v === 'en' ? v : null;
    } catch {
      return null;
    }
  }
}
