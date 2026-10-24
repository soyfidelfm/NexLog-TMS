import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

const GRADIENTS = [
  'from-blue-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-rose-600',
  'from-violet-500 to-fuchsia-600',
  'from-sky-500 to-indigo-600',
  'from-amber-500 to-orange-600',
];

export function initialsOf(name: string | null | undefined): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** Round avatar: image (no-referrer, so Google/Auth0 pictures load) with an initials-on-gradient fallback. */
@Component({
  selector: 'app-user-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="relative inline-flex flex-shrink-0" [class]="box()">
      @if (url() && failedUrl() !== url()) {
        <img [src]="url()!" [alt]="''" referrerpolicy="no-referrer" (error)="failedUrl.set(url() ?? null)"
             class="h-full w-full rounded-full object-cover ring-1 ring-line-strong" />
      } @else {
        <span class="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white"
              [class]="gradient() + ' ' + text()" aria-hidden="true">{{ initials() }}</span>
      }
      @if (online() === true) {
        <span class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-panel"></span>
      }
    </span>
  `,
})
export class UserAvatarComponent {
  readonly name = input<string | null | undefined>('');
  readonly url = input<string | null | undefined>(null);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly online = input<boolean | null | undefined>(null);

  /** The url that failed to load (so a new url gets a fresh attempt). */
  readonly failedUrl = signal<string | null>(null);
  readonly initials = computed(() => initialsOf(this.name()));
  readonly gradient = computed(() => {
    let h = 0;
    for (const ch of this.name() ?? '') h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return GRADIENTS[h % GRADIENTS.length];
  });
  readonly box = computed(() => ({ sm: 'h-7 w-7', md: 'h-9 w-9', lg: 'h-11 w-11' })[this.size()]);
  readonly text = computed(() => ({ sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' })[this.size()]);
}
