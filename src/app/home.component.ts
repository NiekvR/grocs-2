import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <main class="shell">
      <section class="hero">
        <span class="eyebrow">GROCS 2 · PWA</span>
        <h1>Build something<br /><em>worth returning to.</em></h1>
        <p class="intro">Your Angular 21 progressive web app is ready, with Firebase services wired in from the start.</p>
        <div class="status-row">
          <span class="status-dot"></span>
          <span>Firebase Auth &amp; Firestore connected</span>
        </div>
      </section>
      <section class="card-grid" aria-label="Application capabilities">
        <article class="card"><span class="number">01</span><h2>Installable</h2><p>Fast, reliable and available from your home screen with the Angular service worker.</p></article>
        <article class="card"><span class="number">02</span><h2>Connected</h2><p>AngularFire provides an idiomatic path to authentication and real-time Firestore data.</p></article>
        <article class="card accent"><span class="number">03</span><h2>Ready to grow</h2><p>Replace the Firebase environment placeholders and start building your experience.</p></article>
      </section>
    </main>
  `
})
export class HomeComponent {
  // Injecting these services here verifies that Firebase providers are available app-wide.
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);
}
