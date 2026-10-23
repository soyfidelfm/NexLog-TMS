import { Injectable, computed, signal } from '@angular/core';

/** A request must stay in flight this long before the overlay appears (fast calls never flash it). */
export const LOADING_SHOW_DELAY_MS = 150;
/** Once shown, the overlay stays at least this long (avoids a blink when a call finishes right after it appears). */
export const LOADING_MIN_VISIBLE_MS = 400;

/**
 * Tracks in-flight API requests for the global loading overlay.
 * `pending` is the raw counter; `visible` is the debounced flag the overlay renders from.
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly _pending = signal(0);
  private readonly _visible = signal(false);

  /** Number of API requests currently in flight (excluding SKIP_LOADING ones). */
  readonly pending = this._pending.asReadonly();
  /** True once requests have been pending > LOADING_SHOW_DELAY_MS, until they finish (min LOADING_MIN_VISIBLE_MS). */
  readonly visible = this._visible.asReadonly();
  readonly busy = computed(() => this._pending() > 0);

  private showTimer?: ReturnType<typeof setTimeout>;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private shownAt = 0;

  /**
   * Registers one in-flight request and returns its release function.
   * The release is idempotent, so completion, error and cancellation can all call it safely.
   */
  begin(): () => void {
    let released = false;
    this._pending.update(n => n + 1);
    if (this._pending() === 1) this.onBusy();
    return () => {
      if (released) return;
      released = true;
      this._pending.update(n => Math.max(0, n - 1));
      if (this._pending() === 0) this.onIdle();
    };
  }

  private onBusy(): void {
    // Requests arrived while the overlay was waiting out its minimum time: keep it up.
    clearTimeout(this.hideTimer);
    this.hideTimer = undefined;
    if (this._visible() || this.showTimer !== undefined) return;
    this.showTimer = setTimeout(() => {
      this.showTimer = undefined;
      if (this._pending() > 0) {
        this.shownAt = Date.now();
        this._visible.set(true);
      }
    }, LOADING_SHOW_DELAY_MS);
  }

  private onIdle(): void {
    clearTimeout(this.showTimer);
    this.showTimer = undefined;
    if (!this._visible()) return;
    const remaining = Math.max(0, LOADING_MIN_VISIBLE_MS - (Date.now() - this.shownAt));
    if (remaining === 0) {
      this._visible.set(false);
      return;
    }
    this.hideTimer = setTimeout(() => {
      this.hideTimer = undefined;
      if (this._pending() === 0) this._visible.set(false);
    }, remaining);
  }
}
