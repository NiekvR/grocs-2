import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MenuMeal } from './models/meal.model';
import { MenuService } from './services/menu.service';
import { AuthService } from './services/auth.service';

interface MealPlanCard {
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
        <button class="icon-button" type="button" aria-label="Sign out" (click)="logout()">↪</button>
      </header>

      <section class="welcome">
        <p class="eyebrow">{{ greeting }}</p>
        <h1>What are we<br /><em>cooking this week?</em></h1>
        <p class="muted">A little planning makes every meal feel easier.</p>
      </section>

      <section class="section-heading">
        <div>
          <p class="eyebrow">Your plan</p>
          <h2>This week</h2>
        </div>
        <button class="round-button" aria-label="Add a meal">+</button>
      </section>

      <section class="meal-list" aria-label="Meals for this week">
        @for (meal of mealsForNext7Days(); track meal.date + meal.day) {
          <article class="meal-card" [style.--meal-color]="meal.color">
            <div class="meal-date">
              <strong>{{ meal.day }}</strong>
              <span>{{ meal.date }}</span>
            </div>
            <div class="meal-content">
              <div class="meal-emoji">{{ meal.emoji }}</div>
              <div>
                <h3>{{ meal.title }}</h3>
                <p>{{ meal.detail }}</p>
              </div>
            </div>
          </article>
        }
      </section>

      <section class="quick-actions" aria-label="Quick actions">
        <a routerLink="/groceries" class="action-card action-card-dark">
          <span class="action-icon">✓</span>
          <span><strong>Grocery list</strong><small>Shopping list</small></span>
        </a>
        <a routerLink="/recipes" class="action-card">
          <span class="action-icon">★</span>
          <span><strong>Recipes</strong><small>Meal ideas</small></span>
        </a>
      </section>
    </main>

    <nav class="bottom-nav" aria-label="Main navigation">
      <a routerLink="/" class="active"><span>⌂</span>Home</a>
      <a routerLink="/groceries"><span>✓</span>Groceries</a>
      <a routerLink="/recipes"><span>✦</span>Recipes</a>
    </nav>
  `
})
export class HomeComponent {
  private readonly authService = inject(AuthService);
  private readonly menuService = inject(MenuService);

  readonly greeting = 'GOOD MORNING, NIEK';
  readonly menuMeals = toSignal(this.menuService.getMenuMeals(), { initialValue: [] as MenuMeal[] });

  readonly mealsForNext7Days = computed<MealPlanCard[]>(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const iso = this.toIsoDate(date);
      const scheduledMeal = this.menuMeals().find((meal) => this.toIsoDate(new Date(meal.date)) === iso);

      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        title: scheduledMeal?.name ?? 'Open meal',
        detail: scheduledMeal ? 'Dinner · planned' : 'No meal planned',
        emoji: scheduledMeal ? '🍽️' : '＋',
        color: scheduledMeal ? '#f2c7b3' : '#e7eadf'
      };
    });
  });

  async logout(): Promise<void> {
    await this.authService.logout();
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
