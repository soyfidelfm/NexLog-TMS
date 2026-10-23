import {
  ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, computed, effect, inject, output, untracked, viewChild,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/language.service';
import { ChatUser, Message } from '../../../core/models/chat.model';
import { UserAvatarComponent } from '../../../shared/user-avatar.component';
import { clockTime, daysAgo, longDate } from '../chat-time';
import { ChatService, MAX_MESSAGE_LENGTH } from '../services/chat.service';

/** Consecutive messages from the same sender within this window share one group (one avatar / timestamp). */
const GROUP_WINDOW_MS = 5 * 60_000;
const NEAR_BOTTOM_PX = 120;
const LOAD_OLDER_PX = 60;

interface DayItem { kind: 'day'; key: string; label: string }
interface GroupItem {
  kind: 'group'; key: string; senderId: string; mine: boolean; sender: ChatUser | null;
  messages: Message[]; lastAt: number; time: string; sending: boolean;
}
type ThreadItem = DayItem | GroupItem;

@Component({
  selector: 'app-chat-thread',
  standalone: true,
  imports: [TranslatePipe, UserAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './chat-thread.component.scss',
  templateUrl: './chat-thread.component.html',
})
export class ChatThreadComponent {
  readonly chat = inject(ChatService);
  private readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  private readonly injector = inject(Injector);
  readonly closed = output<void>();

  readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  readonly box = viewChild<ElementRef<HTMLTextAreaElement>>('box');
  readonly maxLength = MAX_MESSAGE_LENGTH;

  readonly conv = this.chat.activeConversation;
  readonly peer = computed(() => this.chat.peerOf(this.conv()));
  readonly typing = computed(() => {
    const id = this.chat.activeId();
    return id ? this.chat.typing()[id] ?? null : null;
  });
  readonly loading = computed(() => this.chat.loadingThread() === this.chat.activeId());
  readonly failedLoad = computed(() => this.chat.threadError() === this.chat.activeId());
  readonly loadingOlder = computed(() => this.chat.loadingOlder() === this.chat.activeId());

  readonly items = computed<ThreadItem[]>(() => {
    const locale = this.lang.locale();
    this.lang.lang();
    const me = this.chat.me().id;
    const conv = this.conv();
    const out: ThreadItem[] = [];
    let day = '';
    let group: GroupItem | null = null;
    for (const m of this.chat.activeMessages()) {
      const d = new Date(m.createdAt);
      const dayKey = d.toDateString();
      if (dayKey !== day) {
        day = dayKey;
        group = null;
        out.push({ kind: 'day', key: `d-${dayKey}`, label: this.dayLabel(m.createdAt, locale) });
      }
      const at = d.getTime();
      if (group && group.senderId === m.senderId && at - group.lastAt < GROUP_WINDOW_MS) {
        group.messages.push(m);
        group.lastAt = at;
        group.time = clockTime(m.createdAt, locale);
        group.sending = m.status === 'sending';
      } else {
        group = {
          kind: 'group', key: `g-${m.clientId ?? m.id}`, senderId: m.senderId, mine: m.senderId === me,
          sender: conv?.participants.find(p => p.id === m.senderId) ?? null, messages: [m], lastAt: at,
          time: clockTime(m.createdAt, locale), sending: m.status === 'sending',
        };
        out.push(group);
      }
    }
    return out;
  });

  private lastId: string | null = null;
  private lastFirst: string | undefined;
  private lastCount = 0;

  constructor() {
    // Scroll management, measured before the DOM updates and applied after render:
    // new thread -> jump to bottom; older page prepended -> keep the reading position; new message -> follow if near bottom.
    effect(() => {
      const msgs = this.chat.activeMessages();
      const id = this.chat.activeId();
      this.typing();
      untracked(() => this.onMessagesChanged(id, msgs));
    });

    afterNextRender(() => this.focusInput(), { injector: this.injector });
  }

  private onMessagesChanged(id: string | null, msgs: Message[]): void {
    const el = this.scroller()?.nativeElement;
    const first = msgs[0]?.clientId ?? msgs[0]?.id;
    const switched = id !== this.lastId;
    const prepended = !switched && !!this.lastFirst && first !== this.lastFirst && msgs.length > this.lastCount;
    const lastMine = msgs.length > this.lastCount && msgs[msgs.length - 1]?.senderId === this.chat.me().id;
    const prevHeight = el?.scrollHeight ?? 0;
    const prevTop = el?.scrollTop ?? 0;
    const nearBottom = !el || el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
    this.lastId = id;
    this.lastFirst = first;
    this.lastCount = msgs.length;

    afterNextRender(() => {
      const box = this.scroller()?.nativeElement;
      if (!box) return;
      if (prepended) box.scrollTop = box.scrollHeight - prevHeight + prevTop;
      else if (switched || nearBottom || lastMine) this.scrollToBottom(box, !switched);
    }, { injector: this.injector });
  }

  private scrollToBottom(el: HTMLElement, smooth: boolean): void {
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof el.scrollTo === 'function') el.scrollTo({ top: el.scrollHeight, behavior: smooth && !reduce ? 'smooth' : 'auto' });
    else el.scrollTop = el.scrollHeight;
  }

  onScroll(): void {
    const el = this.scroller()?.nativeElement;
    const id = this.chat.activeId();
    if (el && id && el.scrollTop < LOAD_OLDER_PX && this.chat.activeHasMore()) this.chat.loadOlder(id);
  }

  loadOlder(): void {
    const id = this.chat.activeId();
    if (id) this.chat.loadOlder(id);
  }

  reload(): void {
    const id = this.chat.activeId();
    if (id) this.chat.loadThread(id);
  }

  draft(): string {
    const id = this.chat.activeId();
    return id ? this.chat.draftFor(id) : '';
  }

  onInput(e: Event): void {
    const ta = e.target as HTMLTextAreaElement;
    const id = this.chat.activeId();
    if (!id) return;
    this.chat.setDraft(id, ta.value);
    this.autoGrow(ta);
    if (ta.value.trim()) this.chat.notifyTyping(id);
  }

  onEnter(e: Event): void {
    const ke = e as KeyboardEvent;
    if (ke.shiftKey || ke.isComposing) return;
    e.preventDefault();
    this.send();
  }

  send(): void {
    const id = this.chat.activeId();
    const ta = this.box()?.nativeElement;
    if (!id || !ta || !ta.value.trim()) return;
    this.chat.send(id, ta.value);
    this.chat.setDraft(id, '');
    ta.value = '';
    this.autoGrow(ta);
    ta.focus();
  }

  bubble(g: GroupItem, m: Message, first: boolean, last: boolean): string {
    const base = g.mine ? 'bg-blue-600 text-white' : 'bg-elevated text-primary';
    const corners = g.mine
      ? `${first ? '' : 'rounded-tr-md'} ${last ? '' : 'rounded-br-md'}`
      : `${first ? '' : 'rounded-tl-md'} ${last ? '' : 'rounded-bl-md'}`;
    const state = m.status === 'sending' ? 'opacity-70' : m.status === 'failed' ? 'ring-2 ring-red-ink/70' : '';
    return `${base} ${corners} ${state}`;
  }

  clock(iso: string): string {
    return clockTime(iso, this.lang.locale());
  }

  private dayLabel(iso: string, locale: string): string {
    const n = daysAgo(iso);
    if (n === 0) return this.translate.instant('chat.today');
    if (n === 1) return this.translate.instant('chat.yesterday');
    return longDate(iso, locale);
  }

  private autoGrow(ta: HTMLTextAreaElement): void {
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 112)}px`;
  }

  private focusInput(): void {
    // Avoid popping the on-screen keyboard on touch devices.
    const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
    if (!coarse) this.box()?.nativeElement.focus();
  }
}
