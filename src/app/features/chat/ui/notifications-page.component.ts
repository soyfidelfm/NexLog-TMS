import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/language.service';
import { AppNotification } from '../../../core/models/chat.model';
import { ChatService } from '../services/chat.service';
import { NOTIFICATION_ICONS, NotificationService } from '../services/notification.service';

/** /notifications: full list with All / Unread filter. */
@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-3xl p-4 lg:p-6">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <h1 class="flex-1 text-xl font-semibold text-strong">{{ 'common.notifications' | translate }}</h1>
        <div role="tablist" class="flex overflow-hidden rounded-lg border border-line-strong text-xs font-medium">
          @for (f of filters; track f) {
            <button type="button" role="tab" [attr.aria-selected]="filter() === f" (click)="filter.set(f)" class="px-3 py-1.5"
                    [class]="filter() === f ? 'bg-blue-600 text-white' : 'text-muted hover:bg-elevated hover:text-strong'">
              {{ 'notifications.filter.' + f | translate }}@if (f === 'unread' && notes.unreadCount()) { ({{ notes.unreadCount() }}) }
            </button>
          }
        </div>
        <button type="button" (click)="notes.markAllRead()" [disabled]="!notes.unreadCount()"
                class="rounded-lg border border-line-strong px-3 py-1.5 text-xs font-medium text-primary hover:bg-elevated disabled:opacity-50">
          {{ 'notifications.markAllRead' | translate }}
        </button>
      </div>

      <div class="overflow-hidden rounded-xl border border-line bg-panel">
        @if (notes.loading() && !notes.loaded()) {
          <p class="p-8 text-center text-sm text-muted" role="status">{{ 'common.loading' | translate }}…</p>
        } @else if (notes.error() && !notes.loaded()) {
          <div class="flex flex-col items-center gap-3 p-8 text-sm text-muted" role="alert">
            {{ 'notifications.loadError' | translate }}
            <button type="button" (click)="notes.load()" class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500">{{ 'chat.retry' | translate }}</button>
          </div>
        } @else if (!list().length) {
          <div class="flex flex-col items-center gap-2 p-10 text-center">
            <span class="text-3xl" aria-hidden="true">🔔</span>
            <p class="text-sm text-muted">{{ (filter() === 'unread' ? 'notifications.emptyUnread' : 'notifications.empty') | translate }}</p>
          </div>
        } @else {
          <ul class="divide-y divide-line">
            @for (n of list(); track n.id) {
              <li>
                <button type="button" (click)="chat.openNotification(n)"
                        class="flex w-full items-start gap-4 px-4 py-4 text-left hover:bg-elevated focus:outline-none focus-visible:bg-elevated"
                        [class.bg-blue-500/5]="!n.read">
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-elevated text-lg" aria-hidden="true">{{ icon(n) }}</span>
                  <span class="min-w-0 flex-1">
                    <span class="flex flex-wrap items-baseline gap-x-2">
                      <span class="text-sm" [class]="n.read ? 'text-primary' : 'font-semibold text-strong'">{{ notes.title(n) }}</span>
                      <span class="text-[11px] uppercase tracking-wide text-subtle">{{ 'notifications.types.' + n.type | translate }}</span>
                      <span class="ml-auto text-xs text-subtle">{{ when(n) }}</span>
                    </span>
                    @if (notes.body(n)) { <span class="mt-1 block text-sm text-muted">{{ notes.body(n) }}</span> }
                  </span>
                  @if (!n.read) {
                    <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500"><span class="sr-only">{{ 'notifications.unread' | translate }}</span></span>
                  }
                </button>
              </li>
            }
          </ul>
        }
      </div>
    </div>
  `,
})
export class NotificationsPageComponent {
  readonly notes = inject(NotificationService);
  readonly chat = inject(ChatService);
  private readonly lang = inject(LanguageService);
  readonly filters = ['all', 'unread'] as const;
  readonly filter = signal<'all' | 'unread'>('all');
  readonly list = computed(() => (this.filter() === 'unread' ? this.notes.items().filter(n => !n.read) : this.notes.items()));

  icon(n: AppNotification): string {
    return NOTIFICATION_ICONS[n.type] ?? '🔔';
  }

  when(n: AppNotification): string {
    return new Intl.DateTimeFormat(this.lang.locale(), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(n.createdAt));
  }
}
