import { Component, computed, inject, signal } from '@angular/core';
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

      <label class="search-field" for="recipe-search">
        <span aria-hidden="true">⌕</span>
        <input id="recipe-search" type="search" placeholder="Search recipes" [value]="searchTerm()" (input)="setSearchTerm($event)" />
        @if (searchTerm()) {
          <button type="button" class="clear-search" aria-label="Clear recipe search" (click)="clearSearch()">×</button>
        }
      </label>

      @if (meals().length === 0) {
        <section class="empty-state">
          <span class="empty-icon">✦</span>
          <h2>No recipes yet</h2>
          <p>Add a meal to your Firestore <code>meals</code> collection to see it here.</p>
        </section>
      } @else if (filteredMeals().length === 0) {
        <section class="empty-state">
          <span class="empty-icon">⌕</span>
          <h2>No recipes found</h2>
          <p>Try searching for a different meal name.</p>
        </section>
      } @else {
        <div class="recipe-grid">
          @for (meal of filteredMeals(); track meal.id ?? meal.name; let index = $index) {
            <article class="recipe-card">
              <div class="recipe-copy">
                <span>{{ meal.items?.length ?? 0 }} INGREDIENTS</span>
                <h2>{{ meal.name }}</h2>
                @if (meal.description) { <p>{{ meal.description }}</p> }
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
  readonly searchTerm = signal('');
  readonly filteredMeals = computed(() => {
    const search = this.searchTerm().trim().toLocaleLowerCase();

    return [...this.meals()]
      .filter((meal) => meal.name.toLocaleLowerCase().includes(search))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  });

  setSearchTerm(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }
}
