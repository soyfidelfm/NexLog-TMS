import { Component, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../shared/language-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly toggleMenu = output<void>();
}
