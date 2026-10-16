import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'nexlog-auth';

  readonly isAuthenticated = signal(this.hasToken());

  private hasToken(): boolean {
    return !!localStorage.getItem(this.key);
  }

  login(): void {
    localStorage.setItem(this.key, 'true');
    this.isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem(this.key);
    this.isAuthenticated.set(false);
  }
}
