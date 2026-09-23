import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Meal } from './models/meal.model';
import { MealService } from './services/meal.service';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="page inner-page">
      <header class="page-header">
        <a routerLink="/" class="back-button" aria-label="Back to home">‹</a>
        <div><p class="eyebrow">GET INSPIRED</p><h1>Recipes</h1></div>
        <button class="round-button" type="button" aria-label="Add a recipe">+</button>
      </header>
      <p class="muted page-intro">Simple food, made for real life.</p>

      @if (meals().length === 0) {
        <section class="empty-state">
          <span class="empty-icon">✦</span>
          <h2>No recipes yet</h2>
          <p>Add a meal to your Firestore <code>meals</code> collection to see it here.</p>
        </section>
      } @else {
        <div class="recipe-grid">
          @for (meal of meals(); track meal.id ?? meal.name; let index = $index) {
            <article class="recipe-card">
              <div class="recipe-image" [style.background]="cardColors[index % cardColors.length]" aria-hidden="true">{{ cardEmojis[index % cardEmojis.length] }}</div>
              <div class="recipe-copy">
                <span>{{ meal.items?.length ?? 0 }} INGREDIENTS</span>
                <h2>{{ meal.name }}</h2>
                <p>{{ meal.description || 'A delicious meal for your week.' }}</p>
              </div>
            </article>
          }
        </div>
      }
    </main>
    <nav class="bottom-nav" aria-label="Main navigation">
      <a routerLink="/"><span>⌂</span>Home</a>
      <a routerLink="/groceries"><span>✓</span>Groceries</a>
      <a routerLink="/recipes" class="active"><span>✦</span>Recipes</a>
    </nav>
  `
})
export class RecipesComponent {
  private readonly mealService = inject(MealService);
  readonly meals = toSignal(this.mealService.getMeals(), { initialValue: [] as Meal[] });
  readonly cardColors = ['#f2c7b3', '#d6e4ae', '#f4d48b', '#d8c9eb'];
  readonly cardEmojis = ['🍝', '🥗', '🌮', '🍲'];
}
