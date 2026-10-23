import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/language.service';
import { AppNotification } from '../../../core/models/chat.model';
import { shortTime } from '../chat-time';
import { ChatService } from '../services/chat.service';
import { DesktopNotifyService } from '../services/desktop-notify.service';
import { NOTIFICATION_ICONS, NotificationService } from '../services/notification.service';

/** Header bell: unread badge + dropdown with the latest notifications. */
@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [TranslatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative', '(document:keydown.escape)': 'open.set(false)' },
  template: `
    <button type="button" (click)="open.set(!open())" [attr.aria-expanded]="open()" aria-haspopup="true" aria-controls="notif-menu"
            [attr.aria-label]="'notifications.bellLabel' | translate: { count: notes.unreadCount() }"
            class="relative rounded-lg p-1.5 text-muted hover:bg-elevated hover:text-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></svg>
      @if (notes.unreadCount() > 0) {
        <span class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-panel">{{ badge() }}</span>
      }
    </button>

    @if (open()) {
      <div class="fixed inset-0 z-40" (click)="open.set(false)" aria-hidden="true"></div>
      <div id="notif-menu" role="dialog" [attr.aria-label]="'common.notifications' | translate"
           class="fixed inset-x-2 top-16 z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-xl border border-line bg-panel shadow-xl ring-1 ring-black/5 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96">
        <div class="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 class="text-sm font-semibold text-strong">{{ 'common.notifications' | translate }}</h2>
          <button type="button" (click)="notes.markAllRead()" [disabled]="!notes.unreadCount()"
                  class="text-xs font-medium text-blue-ink hover:underline disabled:cursor-default disabled:text-faint disabled:no-underline">
            {{ 'notifications.markAllRead' | translate }}
          </button>
        </div>

        <div class="flex-1 overflow-y-auto">
          @if (notes.loading() && !notes.loaded()) {
            <p class="px-4 py-8 text-center text-sm text-muted" role="status">{{ 'common.loading' | translate }}…</p>
          } @else if (!notes.recent().length) {
            <div class="flex flex-col items-center gap-2 px-6 py-10 text-center">
              <span class="text-2xl" aria-hidden="true">🔔</span>
              <p class="text-sm text-muted">{{ 'notifications.empty' | translate }}</p>
            </div>
          } @else {
            <ul>
              @for (n of notes.recent(); track n.id) {
                <li>
                  <button type="button" (click)="activate(n)"
                          class="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-elevated focus:outline-none focus-visible:bg-elevated"
                          [class.bg-blue-500/5]="!n.read">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-elevated text-base" aria-hidden="true">{{ icon(n) }}</span>
                    <span class="min-w-0 flex-1">
                      <span class="flex items-baseline gap-2">
                        <span class="truncate text-sm" [class]="n.read ? 'text-primary' : 'font-semibold text-strong'">{{ notes.title(n) }}</span>
                        <span class="ml-auto shrink-0 text-[11px] text-subtle">{{ time(n) }}</span>
                      </span>
                      @if (notes.body(n)) { <span class="mt-0.5 line-clamp-2 block text-xs text-muted">{{ notes.body(n) }}</span> }
                    </span>
                    @if (!n.read) {
                      <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500"><span class="sr-only">{{ 'notifications.unread' | translate }}</span></span>
                    }
                  </button>
                </li>
              }
            </ul>
          }
        </div>

        <div class="flex items-center justify-between gap-2 border-t border-line px-4 py-2.5">
          <a routerLink="/notifications" (click)="open.set(false)" class="text-xs font-medium text-blue-ink hover:underline">{{ 'notifications.viewAll' | translate }}</a>
          @if (desktop.permission() === 'default') {
            <button type="button" (click)="desktop.request()" class="text-xs text-muted hover:text-strong hover:underline">{{ 'notifications.enableDesktop' | translate }}</button>
          }
        </div>
      </div>
    }
  `,
})
export class NotificationBellComponent {
  readonly notes = inject(NotificationService);
  readonly desktop = inject(DesktopNotifyService);
  private readonly chat = inject(ChatService);
  private readonly lang = inject(LanguageService);
  readonly open = signal(false);

  badge(): string {
    const n = this.notes.unreadCount();
    return n > 99 ? '99+' : String(n);
  }

  icon(n: AppNotification): string {
    return NOTIFICATION_ICONS[n.type] ?? '🔔';
  }

  time(n: AppNotification): string {
    return shortTime(n.createdAt, this.lang.locale());
  }

  activate(n: AppNotification): void {
    this.open.set(false);
    this.chat.openNotification(n);
  }
}
