import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { UserAvatarComponent } from '../user-avatar.component';
import { Toast, ToastService } from './toast.service';

/** Stacked, theme-aware toasts (top-right on desktop, full width on mobile). Mount once, in MainLayout. */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgTemplateOutlet, TranslatePipe, UserAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './toast-container.component.scss',
  template: `
    <div class="pointer-events-none fixed inset-x-2 top-[4.5rem] z-[80] flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:w-96"
         role="region" aria-live="polite" aria-relevant="additions" [attr.aria-label]="'toast.region' | translate">
      @for (t of toasts.toasts(); track t.id) {
        <div class="toast pointer-events-auto relative overflow-hidden rounded-xl border bg-panel text-primary shadow-xl ring-1 ring-black/5"
             [class]="border(t)"
             [attr.role]="t.kind === 'error' ? 'alert' : 'status'"
             (mouseenter)="toasts.pause(t.id)" (mouseleave)="toasts.resume(t.id)"
             (focusin)="toasts.pause(t.id)" (focusout)="toasts.resume(t.id)">
          <div class="flex items-start gap-3 p-3 pr-9">
            @if (t.avatar) {
              <app-user-avatar [name]="t.avatar.name" [url]="t.avatar.url" size="md" />
            } @else {
              <span class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-base" [class]="iconBg(t)" aria-hidden="true">{{ t.icon || defaultIcon(t) }}</span>
            }
            @if (t.onClick) {
              <button type="button" (click)="toasts.activate(t.id)"
                      class="min-w-0 flex-1 rounded text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      [attr.aria-label]="t.actionLabel || t.title">
                <ng-container *ngTemplateOutlet="body; context: { $implicit: t }" />
              </button>
            } @else {
              <div class="min-w-0 flex-1"><ng-container *ngTemplateOutlet="body; context: { $implicit: t }" /></div>
            }
          </div>
          <button type="button" (click)="toasts.dismiss(t.id)" [attr.aria-label]="'toast.dismiss' | translate"
                  class="absolute right-2 top-2 rounded p-1 text-muted hover:bg-elevated hover:text-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
          @if (t.durationMs > 0) {
            <div class="toast-progress absolute inset-x-0 bottom-0 h-0.5 origin-left" [class]="bar(t)"
                 [style.animation-duration.ms]="t.durationMs"
                 [style.animation-play-state]="t.paused ? 'paused' : 'running'"></div>
          }
        </div>
      }
    </div>

    <ng-template #body let-t>
      <div class="truncate text-sm font-semibold text-strong">{{ t.title }}</div>
      @if (t.message) { <div class="mt-0.5 line-clamp-2 break-words text-sm text-muted">{{ t.message }}</div> }
    </ng-template>
  `,
})
export class ToastContainerComponent {
  readonly toasts = inject(ToastService);

  border(t: Toast): string {
    switch (t.kind) {
      case 'success': return 'border-emerald-ink/40';
      case 'warning': return 'border-amber-ink/40';
      case 'error': return 'border-red-ink/50';
      default: return 'border-line-strong';
    }
  }

  bar(t: Toast): string {
    switch (t.kind) {
      case 'success': return 'bg-emerald-ink';
      case 'warning': return 'bg-amber-ink';
      case 'error': return 'bg-red-ink';
      default: return 'bg-blue-500';
    }
  }

  iconBg(t: Toast): string {
    switch (t.kind) {
      case 'success': return 'bg-emerald-ink/15';
      case 'warning': return 'bg-amber-ink/15';
      case 'error': return 'bg-red-ink/15';
      default: return 'bg-blue-500/15';
    }
  }

  defaultIcon(t: Toast): string {
    switch (t.kind) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '⛔';
      case 'message': return '💬';
      default: return 'ℹ️';
    }
  }
}
