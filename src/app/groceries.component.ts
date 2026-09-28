import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Grocery, Meal } from './models/meal.model';
import { GroceryService } from './services/grocery.service';
import { MealService } from './services/meal.service';

@Component({
  selector: 'app-groceries',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <main class="page inner-page">
      <header class="page-header">
        <a routerLink="/" class="back-button" aria-label="Back to home">‹</a>
        <div><p class="eyebrow">YOUR SHOPPING</p><h1>Grocery list</h1></div>
        <button class="round-button" type="button" aria-label="Add a meal" (click)="openAddMealModal()" [disabled]="showAddMealModal()" >+</button>
      </header>
      <p class="muted page-intro">Everything you need for this week's meals.</p>

      @if (groceries().length > 0) {
        <div class="progress"><span [style.width.%]="progressPercent()"></span></div>
        <p class="progress-label">{{ completedCount() }} of {{ groceries().length }} items picked up</p>
      }

      @if (groceryGroups().length > 0) {
        @for (group of groceryGroups(); track group.date) {
          <section class="grocery-group">
            <h2>{{ group.date }} <span>{{ group.items.length }}</span></h2>
            @for (item of group.items; track item.id) {
              <label class="grocery-item">
                <input type="checkbox" [checked]="item.done" (change)="toggleGrocery(item.id!, $event)" />
                <span class="checkmark"></span>
                <span [class.done]="item.done">{{ item.name }}</span>
              </label>
            }
          </section>
        }
      } @else {
        <section class="empty-state">
          <span class="empty-icon">✓</span>
          <h2>No items yet</h2>
          <p>Add a meal to start your shopping list.</p>
        </section>
      }
    </main>

    @if (showAddMealModal()) {
      <div class="modal-backdrop" (click)="closeAddMealModal()"></div>
      <div class="modal">
        <div class="modal-header">
          <h2>Add meal to grocery list</h2>
          <button class="close-button" type="button" aria-label="Close" (click)="closeAddMealModal()">×</button>
        </div>
        <div class="modal-content">
          <div class="form-group">
            <label for="meal-search">Search for a meal</label>
            <input id="meal-search" type="search" placeholder="Find a recipe..." [value]="mealSearchTerm()" (input)="setMealSearchTerm($event)" />
          </div>

          @if (filteredMeals().length > 0) {
            <div class="meal-list">
              @for (meal of filteredMeals(); track meal.id) {
                <button type="button" class="meal-option" (click)="selectMeal(meal)" [class.selected]="selectedMeal()?.id === meal.id">
                  <span class="meal-name">{{ meal.name }}</span>
                  <span class="meal-ingredients">{{ meal.items?.length ?? 0 }} ingredients</span>
                </button>
              }
            </div>
          }

          @if (selectedMeal(); as meal) {
            <div class="form-group">
              <label for="meal-date">Add to date</label>
              <input id="meal-date" type="date" [(ngModel)]="selectedDate" />
            </div>

            <div class="form-group">
              <label>Select ingredients to add</label>
              @if (meal.items?.length) {
                <div class="ingredient-selector">
                  @for (item of meal.items; track item.name; let idx = $index) {
                    <label class="ingredient-checkbox">
                      <input type="checkbox" [checked]="selectedIngredients()[idx]" (change)="toggleIngredient(idx, $event)" />
                      <span class="checkmark-small"></span>
                      <span>{{ item.name }}</span>
                    </label>
                  }
                </div>
              }
            </div>
          }
        </div>

        <div class="modal-actions">
          <button type="button" class="secondary-button" (click)="closeAddMealModal()" [disabled]="loadingAddMeal()">Cancel</button>
          <button type="button" class="primary-button" (click)="confirmAddMeal()" [disabled]="!selectedMeal() || loadingAddMeal() || selectedIngredientsCount() === 0">
            {{ loadingAddMeal() ? 'Adding...' : 'Add to list' }} <span>→</span>
          </button>
        </div>
      </div>
    }

    <nav class="bottom-nav" aria-label="Main navigation">
      <a routerLink="/"><span>⌂</span>Home</a>
      <a routerLink="/groceries" class="active"><span>✓</span>Groceries</a>
      <a routerLink="/recipes"><span>✦</span>Recipes</a>
    </nav>
  `
})
export class GroceriesComponent {
  private readonly mealService = inject(MealService);
  private readonly groceryService = inject(GroceryService);

  readonly meals = toSignal(this.mealService.getMeals(), { initialValue: [] as Meal[] });
  readonly groceries = toSignal(this.groceryService.getGroceries(), { initialValue: [] as Grocery[] });

  readonly showAddMealModal = signal(false);
  readonly mealSearchTerm = signal('');
  readonly selectedMeal = signal<Meal | null>(null);
  readonly selectedDate = signal(this.getTodayDate());
  readonly selectedIngredients = signal<boolean[]>([]);
  readonly loadingAddMeal = signal(false);

  readonly filteredMeals = computed(() => {
    const search = this.mealSearchTerm().trim().toLowerCase();
    return this.meals()
      .filter((m) => m.name.toLowerCase().includes(search))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  });

  readonly groceryGroups = computed(() => {
    const grouped = new Map<string, Grocery[]>();
    for (const item of this.groceries()) {
      const date = item.date || 'No date';
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(item);
    }
    return Array.from(grouped.entries())
      .map(([date, items]) => ({ date, items }))
      .sort((a, b) => (a.date === 'No date' ? 1 : b.date === 'No date' ? -1 : a.date.localeCompare(b.date)));
  });

  readonly completedCount = computed(() => this.groceries().filter((g) => g.done).length);
  readonly progressPercent = computed(() => {
    const total = this.groceries().length;
    return total > 0 ? (this.completedCount() / total) * 100 : 0;
  });

  readonly selectedIngredientsCount = computed(() => this.selectedIngredients().filter((v) => v).length);

  openAddMealModal(): void {
    this.showAddMealModal.set(true);
    this.mealSearchTerm.set('');
    this.selectedMeal.set(null);
  }

  closeAddMealModal(): void {
    this.showAddMealModal.set(false);
    this.selectedIngredients.set([]);
  }

  setMealSearchTerm(event: Event): void {
    this.mealSearchTerm.set((event.target as HTMLInputElement).value);
  }

  selectMeal(meal: Meal): void {
    this.selectedMeal.set(meal);
    this.selectedIngredients.set(new Array(meal.items?.length ?? 0).fill(false));
  }

  toggleIngredient(index: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current = this.selectedIngredients();
    current[index] = checked;
    this.selectedIngredients.set([...current]);
  }

  async confirmAddMeal(): Promise<void> {
    const meal = this.selectedMeal();
    if (!meal?.items) return;

    this.loadingAddMeal.set(true);

    try {
      const selectedItems = meal.items.filter((_, idx) => this.selectedIngredients()[idx]);

      for (const item of selectedItems) {
        await this.groceryService.createGrocery({
          name: item.name,
          done: false,
          date: this.selectedDate(),
          mealId: meal.id
        });
      }

      this.closeAddMealModal();
    } catch (error) {
      console.error('Error adding meal to groceries:', error);
    } finally {
      this.loadingAddMeal.set(false);
    }
  }

  async toggleGrocery(id: string, event: Event): Promise<void> {
    const checked = (event.target as HTMLInputElement).checked;
    try {
      await this.groceryService.updateGrocery(id, { done: checked });
    } catch (error) {
      console.error('Error updating grocery:', error);
    }
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
