import { Injectable, signal } from '@angular/core';

export type ToastKind = 'info' | 'success' | 'warning' | 'error' | 'message';

export interface ToastOptions {
  /** Already translated text. */
  title: string;
  message?: string;
  kind?: ToastKind;
  /** Emoji / short glyph shown when there is no avatar. */
  icon?: string;
  /** Shows an avatar (initials fallback) instead of the icon, e.g. the sender of a chat message. */
  avatar?: { name: string; url?: string | null };
  /** Auto-dismiss delay. `0` keeps the toast until it is dismissed. Default 6000. */
  durationMs?: number;
  /** Makes the whole toast clickable; the toast is dismissed after the handler runs. */
  onClick?: () => void;
  /** aria label for the clickable area (already translated). */
  actionLabel?: string;
}

export interface Toast extends ToastOptions {
  id: number;
  kind: ToastKind;
  durationMs: number;
  /** True while the pointer / keyboard focus is on the toast (the timer is frozen). */
  paused: boolean;
}

export const TOAST_DEFAULT_MS = 6000;
export const TOAST_MAX_VISIBLE = 4;

interface Timer {
  handle?: ReturnType<typeof setTimeout>;
  remaining: number;
  startedAt: number;
}

/**
 * Lightweight stacked toasts. Rendering lives in `ToastContainerComponent` (mounted once in MainLayout).
 * Timers are owned by the service so pause-on-hover survives re-renders and is unit-testable.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  /** Newest first. */
  readonly toasts = this._toasts.asReadonly();

  private seq = 0;
  private readonly timers = new Map<number, Timer>();

  show(opts: ToastOptions): number {
    const toast: Toast = {
      ...opts,
      id: ++this.seq,
      kind: opts.kind ?? 'info',
      durationMs: opts.durationMs ?? TOAST_DEFAULT_MS,
      paused: false,
    };
    this._toasts.update(list => [toast, ...list]);
    // Keep the stack bounded: the oldest toasts are evicted first.
    for (const old of this._toasts().slice(TOAST_MAX_VISIBLE)) this.dismiss(old.id);
    if (toast.durationMs > 0) this.arm(toast.id, toast.durationMs);
    return toast.id;
  }

  info(title: string, message?: string): number { return this.show({ title, message, kind: 'info' }); }
  success(title: string, message?: string): number { return this.show({ title, message, kind: 'success' }); }
  warning(title: string, message?: string): number { return this.show({ title, message, kind: 'warning' }); }
  error(title: string, message?: string): number { return this.show({ title, message, kind: 'error', durationMs: 8000 }); }

  dismiss(id: number): void {
    const t = this.timers.get(id);
    if (t) clearTimeout(t.handle);
    this.timers.delete(id);
    this._toasts.update(list => list.filter(x => x.id !== id));
  }

  clear(): void {
    for (const id of [...this.timers.keys()]) this.dismiss(id);
    this._toasts.set([]);
  }

  /** Freezes the countdown (hover / focus). */
  pause(id: number): void {
    const t = this.timers.get(id);
    if (!t || t.handle === undefined) return;
    clearTimeout(t.handle);
    t.handle = undefined;
    t.remaining = Math.max(0, t.remaining - (Date.now() - t.startedAt));
    this.patch(id, { paused: true });
  }

  /** Resumes with the time that was left. */
  resume(id: number): void {
    const t = this.timers.get(id);
    if (!t || t.handle !== undefined) return;
    this.patch(id, { paused: false });
    this.arm(id, t.remaining);
  }

  /** Runs the toast's click handler, then closes it. */
  activate(id: number): void {
    const toast = this._toasts().find(t => t.id === id);
    if (!toast) return;
    this.dismiss(id);
    toast.onClick?.();
  }

  private arm(id: number, ms: number): void {
    const handle = setTimeout(() => this.dismiss(id), ms);
    this.timers.set(id, { handle, remaining: ms, startedAt: Date.now() });
  }

  private patch(id: number, p: Partial<Toast>): void {
    this._toasts.update(list => list.map(t => (t.id === id ? { ...t, ...p } : t)));
  }
}
