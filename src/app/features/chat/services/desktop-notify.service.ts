import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

type Permission = NotificationPermission | 'unsupported';

/**
 * Optional native (OS) notifications while the tab is hidden. Permission is only requested from an explicit
 * user action (the "Enable desktop alerts" button). Background push when the app is closed (FCM) is future work.
 */
@Injectable({ providedIn: 'root' })
export class DesktopNotifyService {
  private readonly doc = inject(DOCUMENT);
  private readonly win = this.doc.defaultView;
  readonly permission = signal<Permission>(this.read());

  get supported(): boolean {
    return this.permission() !== 'unsupported';
  }

  async request(): Promise<void> {
    if (!this.win || !('Notification' in this.win)) return;
    try {
      this.permission.set(await this.win.Notification.requestPermission());
    } catch {
      this.permission.set(this.read());
    }
  }

  /** Shows an OS notification only if the tab is hidden and permission was granted. */
  notify(title: string, body: string, tag: string, onClick?: () => void): void {
    if (!this.win || this.permission() !== 'granted' || this.doc.visibilityState !== 'hidden') return;
    try {
      const n = new this.win.Notification(title, { body, tag, icon: '/iconInside.png' });
      n.onclick = () => {
        this.win?.focus();
        onClick?.();
        n.close();
      };
    } catch { /* some browsers only allow notifications from a service worker */ }
  }

  private read(): Permission {
    const w = this.doc.defaultView as (Window & { Notification?: typeof Notification }) | null;
    return w?.Notification ? w.Notification.permission : 'unsupported';
  }
}
