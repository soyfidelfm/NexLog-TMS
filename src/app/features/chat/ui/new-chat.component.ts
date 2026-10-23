import { ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, inject, output, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ChatUser } from '../../../core/models/chat.model';
import { UserAvatarComponent } from '../../../shared/user-avatar.component';
import { ChatService } from '../services/chat.service';
import { USER_SEARCH_MIN_CHARS, UserSearchState, UserService } from '../services/user.service';

/** "New chat": debounced user search (name / email) to start a conversation. */
@Component({
  selector: 'app-new-chat',
  standalone: true,
  imports: [TranslatePipe, UserAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-0 flex-1 flex-col' },
  template: `
    <header class="flex items-center gap-2 border-b border-line px-2 py-2.5">
      <button type="button" (click)="chat.composing.set(false)" [attr.aria-label]="'chat.back' | translate"
              class="rounded-lg p-1.5 text-muted hover:bg-elevated hover:text-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <h2 class="flex-1 text-sm font-semibold text-strong">{{ 'chat.newChat' | translate }}</h2>
      <button type="button" (click)="closed.emit()" [attr.aria-label]="'chat.close' | translate"
              class="rounded-lg p-1.5 text-muted hover:bg-elevated hover:text-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </header>

    <div class="p-3">
      <label class="sr-only" for="chat-user-search">{{ 'chat.searchUsersLabel' | translate }}</label>
      <input #input id="chat-user-search" type="search" autocomplete="off" role="combobox" aria-autocomplete="list"
             aria-controls="chat-user-results" [attr.aria-expanded]="state().users.length > 0"
             [attr.aria-activedescendant]="active() >= 0 ? 'chat-user-' + active() : null"
             [placeholder]="'chat.searchUsersPlaceholder' | translate"
             (input)="onInput($any($event.target).value)" (keydown)="onKey($event)"
             class="w-full rounded-full border border-line-strong bg-elevated px-4 py-2 text-sm text-primary placeholder:text-subtle focus:border-blue-500 focus:outline-none" />
    </div>

    <div class="flex-1 overflow-y-auto pb-2" aria-live="polite">
      @let s = state();
      @if (s.term.length < minChars) {
        <p class="px-6 py-8 text-center text-sm text-muted">{{ 'chat.searchHint' | translate: { n: minChars } }}</p>
      } @else if (s.loading) {
        <div class="flex items-center justify-center gap-2 py-8 text-sm text-muted" role="status">
          <span class="spinner h-4 w-4 rounded-full border-2 border-line-strong border-t-blue-500"></span>{{ 'chat.searching' | translate }}
        </div>
      } @else if (s.error) {
        <p class="px-6 py-8 text-center text-sm text-red-ink" role="alert">{{ 'chat.errors.search' | translate }}</p>
      } @else if (!s.users.length) {
        <p class="px-6 py-8 text-center text-sm text-muted">{{ 'chat.noUsers' | translate: { term: s.term } }}</p>
      } @else {
        <p class="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-subtle">{{ 'chat.people' | translate }}</p>
        <ul id="chat-user-results" role="listbox" [attr.aria-label]="'chat.people' | translate">
          @for (u of s.users; track u.id; let i = $index) {
            <li [id]="'chat-user-' + i" role="option" [attr.aria-selected]="active() === i"
                (click)="pick(u)" (mouseenter)="active.set(i)"
                class="flex cursor-pointer items-center gap-3 px-4 py-2.5" [class.bg-elevated]="active() === i">
              <app-user-avatar [name]="u.name" [url]="u.avatarUrl" [online]="u.online" size="md" />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-strong">{{ u.name }}</span>
                <span class="block truncate text-xs text-muted">{{ u.title ? u.title + ' · ' : '' }}{{ u.email }}</span>
              </span>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    @keyframes chat-spin { to { transform: rotate(360deg); } }
    .spinner { display: inline-block; animation: chat-spin 0.8s linear infinite; }
    @media (prefers-reduced-motion: reduce) { .spinner { animation-duration: 2.4s; } }
  `],
})
export class NewChatComponent {
  readonly chat = inject(ChatService);
  private readonly users = inject(UserService);
  readonly closed = output<void>();
  readonly input = viewChild<ElementRef<HTMLInputElement>>('input');
  readonly minChars = USER_SEARCH_MIN_CHARS;

  private readonly terms = new Subject<string>();
  readonly state = toSignal(this.users.typeahead(this.terms, () => this.chat.me().id), {
    initialValue: { term: '', loading: false, error: false, users: [] } as UserSearchState,
  });
  readonly active = signal(-1);

  constructor() {
    afterNextRender(() => this.input()?.nativeElement.focus(), { injector: inject(Injector) });
  }

  onInput(value: string): void {
    this.active.set(-1);
    this.terms.next(value);
  }

  onKey(e: KeyboardEvent): void {
    const list = this.state().users;
    if (!list.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.active.update(i => (i + 1) % list.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.active.update(i => (i <= 0 ? list.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this.pick(list[Math.max(0, this.active())]);
    }
  }

  pick(u: ChatUser): void {
    this.chat.startWith(u);
  }
}
