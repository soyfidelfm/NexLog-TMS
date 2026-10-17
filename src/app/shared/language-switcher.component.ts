import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService, Lang } from '../core/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div role="group" [attr.aria-label]="'common.language' | translate"
         class="flex items-center overflow-hidden rounded-lg border border-slate-700 bg-slate-800/60 text-xs font-medium">
      @for (l of langs; track l; let last = $last) {
        <button type="button" (click)="lang.setLang(l)" [attr.aria-pressed]="lang.lang() === l"
                [attr.title]="'common.lang.' + l | translate"
                class="px-3 py-1.5 transition"
                [class]="lang.lang() === l ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'">
          {{ l.toUpperCase() }}
        </button>
        @if (!last) { <span class="text-slate-600">|</span> }
      }
    </div>
  `,
})
export class LanguageSwitcherComponent {
  readonly lang = inject(LanguageService);
  readonly langs: Lang[] = ['es', 'en'];
}
