import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Meal } from './models/meal.model';
import { MealService } from './services/meal.service';

@Component({
  selector: 'app-create-meal',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <main class="page inner-page">
      <header class="page-header">
        <a routerLink="/recipes" class="back-button" aria-label="Back to recipes">‹</a>
        <div><p class="eyebrow">NEW RECIPE</p><h1>Create a meal</h1></div>
      </header>
      <p class="muted page-intro">Add a new recipe to your collection.</p>

      <form (ngSubmit)="submit()" #mealForm="ngForm" novalidate class="meal-form">
        <div class="form-group">
          <label for="meal-name">Meal name</label>
          <input id="meal-name" name="name" type="text" [(ngModel)]="form.name" required placeholder="e.g., Creamy tomato pasta" />
          @if (form.name && !form.name.trim()) { <span class="form-hint">Please enter a meal name</span> }
        </div>

        <div class="form-group">
          <label for="meal-description">Description</label>
          <textarea id="meal-description" name="description" [(ngModel)]="form.description" placeholder="What makes this meal special?" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label for="meal-ingredients">Ingredients (one per line)</label>
          <textarea id="meal-ingredients" name="ingredients" [(ngModel)]="ingredientText" placeholder="Tomatoes&#10;Pasta&#10;Garlic&#10;Olive oil" rows="4"></textarea>
        </div>

        @if (errorMessage()) {
          <p class="form-error" role="alert">{{ errorMessage() }}</p>
        }

        <div class="form-actions">
          <button type="button" class="secondary-button" (click)="cancel()" [disabled]="loading()">Cancel</button>
          <button type="submit" class="primary-button" [disabled]="mealForm.invalid || loading() || !form.name.trim()">
            {{ loading() ? 'Creating...' : 'Create meal' }} <span>→</span>
          </button>
        </div>
      </form>
    </main>
  `
})
export class CreateMealComponent {
  private readonly mealService = inject(MealService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  form = {
    name: '',
    description: ''
  };
  ingredientText = '';

  async submit(): Promise<void> {
    if (!this.form.name.trim()) {
      this.errorMessage.set('Please enter a meal name');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const ingredients = this.ingredientText
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .map((name) => ({ name, selected: false, done: false }));

      const newMeal: Omit<Meal, 'id'> = {
        name: this.form.name.trim(),
        description: this.form.description.trim() || undefined,
        items: ingredients.length > 0 ? ingredients : undefined
      };

      await this.mealService.createMeal(newMeal);
      await this.router.navigateByUrl('/recipes');
    } catch (error) {
      this.errorMessage.set('Failed to create meal. Please try again.');
      console.error('Error creating meal:', error);
    } finally {
      this.loading.set(false);
    }
  }

  cancel(): void {
    this.router.navigateByUrl('/recipes');
  }
}
