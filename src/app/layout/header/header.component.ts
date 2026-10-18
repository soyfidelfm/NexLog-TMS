import { Component, inject, output, signal } from '@angular/core';
import { ThemeService } from '../../core/theme.service';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../shared/language-switcher.component';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslatePipe, LanguageSwitcherComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly toggleMenu = output<void>();
  readonly theme = inject(ThemeService);
  readonly auth = inject(AuthService);

  readonly menuOpen = signal(false);
  readonly avatarFailed = signal(false);

  toggleUserMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  logout() {
    this.auth.logout();
  }
}
