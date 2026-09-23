import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <main class="auth-page">
      <div class="auth-brand"><span class="brand-mark">g</span><span>grocs</span></div>
      <section class="auth-card">
        <p class="eyebrow">WELCOME BACK</p>
        <h1>Let’s get<br /><em>cooking.</em></h1>
        <p class="muted">Sign in to manage your meals and grocery list.</p>

        <form (ngSubmit)="submit()" #loginForm="ngForm" novalidate>
          <label for="email">Email address</label>
          <input id="email" name="email" type="email" [(ngModel)]="email" required email autocomplete="email" placeholder="you@example.com" />
          <label for="password">Password</label>
          <input id="password" name="password" type="password" [(ngModel)]="password" required minlength="6" autocomplete="current-password" placeholder="Your password" />
          @if (errorMessage) { <p class="form-error" role="alert">{{ errorMessage }}</p> }
          <button class="primary-button" type="submit" [disabled]="loginForm.invalid || loading">{{ loading ? 'Signing in…' : 'Sign in' }} <span>→</span></button>
        </form>
      </section>
      <p class="auth-note">Your meals are securely stored with Firebase.</p>
    </main>
  `
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  async submit(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      await this.authService.login(this.email.trim(), this.password);
      await this.router.navigateByUrl('/');
    } catch {
      this.errorMessage = 'The email or password is incorrect. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
