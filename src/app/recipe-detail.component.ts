import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { Meal } from './models/meal.model';
import { MealService } from './services/meal.service';
import {toSignal} from "@angular/core/rxjs-interop";
import {Location} from "@angular/common";

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [],
  template: `
    @if (meal(); as selectedMeal) {
      <main class="page inner-page">
        <header class="page-header">
          <a (click)="back()" class="back-button" aria-label="Back to recipes">‹</a>
          <div><p class="eyebrow">MEAL DETAIL</p><h1>{{ selectedMeal.name }}</h1></div>
        </header>

        <section class="detail-card">
          <div class="detail-header">
            <span class="detail-tag">{{ selectedMeal.items?.length ?? 0 }} ingredients</span>
          </div>
          @if (selectedMeal.description) {
            <p class="muted detail-description">{{ selectedMeal.description }}</p>
          }

          <div class="ingredients-block">
            <h2>Ingredients</h2>
            @if (selectedMeal.items?.length) {
              <ul class="ingredient-list">
                @for (item of selectedMeal.items; track item.id ?? item.name) {
                  <li>{{ item.name }}</li>
                }
              </ul>
            } @else {
              <p class="muted empty-ingredients">No ingredients added yet.</p>
            }
          </div>
        </section>
      </main>
    } @else {
      <main class="page inner-page">
        <section class="empty-state">
          <span class="empty-icon">✦</span>
          <h2>Meal not found</h2>
          <p>This recipe could not be found.</p>
        </section>
      </main>
    }
  `
})
export class RecipeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly mealService = inject(MealService);
  private readonly location = inject(Location);

    readonly meal = toSignal(
        this.route.paramMap.pipe(
            map((params) => params.get('id')),
            switchMap((id) => (id ? this.mealService.getMeal(id) : [undefined as Meal | undefined]))
        )
    );

    back() {
        this.location.back()
    }
}
