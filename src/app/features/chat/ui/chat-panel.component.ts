import { ChangeDetectionStrategy, Component, DOCUMENT, computed, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/language.service';
import { UserAvatarComponent } from '../../../shared/user-avatar.component';
import { shortTime } from '../chat-time';
import { ChatService } from '../services/chat.service';
import { ChatThreadComponent } from './chat-thread.component';
import { NewChatComponent } from './new-chat.component';

/**
 * Messenger panel: a dock in the bottom-right corner on desktop, full screen on mobile.
 * Views: conversation list -> one active thread, or "new chat" (user search). Mounted once in MainLayout.
 */
@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [TranslatePipe, UserAvatarComponent, ChatThreadComponent, NewChatComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './chat-panel.component.scss',
  templateUrl: './chat-panel.component.html',
})
export class ChatPanelComponent {
  readonly chat = inject(ChatService);
  private readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  private readonly doc = inject(DOCUMENT);

  readonly filter = signal('');

  readonly connectionIssue = computed(() => {
    const s = this.chat.realtimeState();
    return this.chat.mode() === 'live' && (s === 'reconnecting' || s === 'disconnected');
  });

  readonly rows = computed(() => {
    const locale = this.lang.locale();
    const me = this.chat.me().id;
    const typing = this.chat.typing();
    const term = this.filter().trim().toLowerCase();
    this.lang.lang();
    const you = this.translate.instant('chat.you');
    return this.chat.conversations()
      .map(c => {
        const peer = this.chat.peerOf(c);
        const last = c.lastMessage;
        let preview = '';
        if (last) preview = (last.senderId === me ? `${you}: ` : '') + last.body;
        return {
          id: c.id,
          peer,
          name: peer?.name ?? '',
          preview,
          failed: last?.status === 'failed',
          time: last ? shortTime(last.createdAt, locale) : '',
          unread: c.unreadCount,
          typing: !!typing[c.id],
        };
      })
      .filter(r => !term || r.name.toLowerCase().includes(term) || (r.peer?.email ?? '').toLowerCase().includes(term));
  });

  badge(n: number): string {
    return n > 99 ? '99+' : String(n);
  }

  close(): void {
    this.chat.closePanel();
    // Give focus back to the header button that opened the panel.
    (this.doc.getElementById('chat-toggle') as HTMLElement | null)?.focus();
  }

  onEscape(e: Event): void {
    e.stopPropagation();
    this.close();
  }
}
