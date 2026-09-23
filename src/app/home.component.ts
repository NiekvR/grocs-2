import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Meal {
  day: string;
  date: string;
  title: string;
  detail: string;
  emoji: string;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="page home-page">
      <header class="topbar">
        <div class="brand"><span class="brand-mark">g</span><span>grocs</span></div>
        <button class="icon-button" aria-label="Open profile menu">•••</button>
      </header>

      <section class="welcome">
        <p class="eyebrow">{{ greeting }}</p>
        <h1>What are we<br /><em>cooking this week?</em></h1>
        <p class="muted">A little planning makes every meal feel easier.</p>
      </section>

      <section class="section-heading">
        <div><p class="eyebrow">Your plan</p><h2>This week</h2></div>
        <button class="round-button" aria-label="Add a meal">+</button>
      </section>

      <section class="meal-list" aria-label="Meals for this week">
        @for (meal of meals; track meal.day) {
          <article class="meal-card" [style.--meal-color]="meal.color">
            <div class="meal-date"><strong>{{ meal.day }}</strong><span>{{ meal.date }}</span></div>
            <div class="meal-emoji" aria-hidden="true">{{ meal.emoji }}</div>
            <div class="meal-info"><h3>{{ meal.title }}</h3><p>{{ meal.detail }}</p></div>
            <span class="chevron" aria-hidden="true">›</span>
          </article>
        }
      </section>

      <section class="quick-actions" aria-label="Quick actions">
        <a routerLink="/groceries" class="action-card action-card-dark"><span class="action-icon">✓</span><span><strong>Grocery list</strong><small>12 items waiting</small></span><span class="arrow">↗</span></a>
        <a routerLink="/recipes" class="action-card action-card-light"><span class="action-icon">✦</span><span><strong>Recipes</strong><small>Find your next favourite</small></span><span class="arrow">↗</span></a>
      </section>
    </main>
    <nav class="bottom-nav" aria-label="Main navigation"><a routerLink="/" class="active"><span>⌂</span>Home</a><a routerLink="/groceries"><span>✓</span>Groceries</a><a routerLink="/recipes"><span>✦</span>Recipes</a></nav>
  `
})
export class HomeComponent {
  readonly greeting = 'GOOD MORNING, NIEK';
  readonly meals: Meal[] = [
    { day: 'Mon', date: '12 Aug', title: 'Creamy tomato pasta', detail: 'Dinner · 25 min', emoji: '🍝', color: '#f2c7b3' },
    { day: 'Tue', date: '13 Aug', title: 'Green goddess bowl', detail: 'Dinner · 20 min', emoji: '🥗', color: '#d6e4ae' },
    { day: 'Wed', date: '14 Aug', title: 'Crispy fish tacos', detail: 'Dinner · 30 min', emoji: '🌮', color: '#f4d48b' },
    { day: 'Thu', date: '15 Aug', title: 'Roasted veggie soup', detail: 'Dinner · 40 min', emoji: '🍲', color: '#e8c6dd' }
  ];
}
