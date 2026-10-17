import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth.service';
import { LanguageSwitcherComponent } from '../../../shared/language-switcher.component';

type Provider = 'google' | 'microsoft' | 'apple' | 'email';

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
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly features: Feature[] = [
    { icon: 'pin', title: 'Real-Time Tracking', description: 'Monitor shipments and assets in real time.' },
    { icon: 'network', title: 'Route Optimization', description: 'AI-powered routing for lower costs and on-time delivery.' },
    { icon: 'truck', title: 'Carrier Management', description: 'Manage carriers, bids, and performance in one place.' },
    { icon: 'audit', title: 'Freight Audit', description: 'Automate audits and ensure invoice accuracy.' }
  ];

  readonly toast = signal<string | null>(null);
  private toastTimer?: ReturnType<typeof setTimeout>;

  private readonly labels: Record<Provider, string> = {
    google: 'Google',
    microsoft: 'Microsoft',
    apple: 'Apple',
    email: 'email'
  };

  signIn(provider: Provider): void {
    // Demo auth: mark as logged in and go to dashboard.
    // Replace with real OAuth / email flow later.
    console.log(`[NexLog] Sign in with ${provider}`);
    this.auth.login();
    this.router.navigateByUrl('/dashboard');
  }

  createAccount(event: Event): void {
    event.preventDefault();
    console.log('[NexLog] Create account clicked');
    this.showToast(this.translate.instant('login.comingSoon'));
  }

  private showToast(message: string): void {
    this.toast.set(message);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 3000);
  }
}
