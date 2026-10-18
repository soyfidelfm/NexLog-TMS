import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth.service';
import { LanguageSwitcherComponent } from '../../../shared/language-switcher.component';
import { ThemeService } from '../../../core/theme.service';
import { effect } from '@angular/core';

type Provider = 'google' | 'microsoft' | 'discord' | 'email';

interface Feature {
  icon: 'pin' | 'network' | 'truck' | 'audit';
  title: string;
  description: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  readonly theme = inject(ThemeService);

  readonly features: Feature[] = [
    { icon: 'pin', title: 'Real-Time Tracking', description: 'Monitor shipments and assets in real time.' },
    { icon: 'network', title: 'Route Optimization', description: 'AI-powered routing for lower costs and on-time delivery.' },
    { icon: 'truck', title: 'Carrier Management', description: 'Manage carriers, bids, and performance in one place.' },
    { icon: 'audit', title: 'Freight Audit', description: 'Automate audits and ensure invoice accuracy.' }
  ];

  readonly toast = signal<string | null>(null);
  private toastTimer?: ReturnType<typeof setTimeout>;

  private readonly connectionMap: Record<Provider, string | undefined> = {
    google: 'google-oauth2',
    microsoft: 'windowslive',
    discord: 'discord',
    email: undefined
  };

  constructor() {
    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }

  ngOnInit(): void {}

  signIn(provider: Provider): void {
    const connection = this.connectionMap[provider];
    this.auth.loginWith(connection as any);
  }

  createAccount(event: Event): void {
    event.preventDefault();
    this.showToast(this.translate.instant('login.comingSoon'));
  }

  private showToast(message: string): void {
    this.toast.set(message);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 3000);
  }
}
