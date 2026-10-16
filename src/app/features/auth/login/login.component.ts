import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type Provider = 'google' | 'microsoft' | 'apple' | 'email';

interface Feature {
  icon: 'pin' | 'network' | 'truck' | 'audit';
  title: string;
  description: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
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
    // Placeholder: real authentication not implemented yet.
    console.log(`[NexLog] Sign in with ${provider} clicked`);
    this.showToast(`Sign in with ${this.labels[provider]} is coming soon.`);
  }

  createAccount(event: Event): void {
    event.preventDefault();
    console.log('[NexLog] Create account clicked');
    this.showToast('Account registration is coming soon.');
  }

  private showToast(message: string): void {
    this.toast.set(message);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 3000);
  }
}
