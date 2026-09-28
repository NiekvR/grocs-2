import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Grocery, Meal } from './models/meal.model';
import { GroceryService } from './services/grocery.service';
import { MealService } from './services/meal.service';
import {MenuService} from "./services/home.service";

@Component({
  selector: 'app-groceries',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <main class="page inner-page">
      <header class="page-header">
        <a routerLink="/" class="back-button" aria-label="Back to home">‹</a>
        <div><p class="eyebrow">YOUR SHOPPING</p><h1>Grocery list</h1></div>
        <div class="header-actions">
          <button class="round-button" type="button" aria-label="Add a grocery item" (click)="removeCompleted()">R</button>
          <button class="round-button" type="button" aria-label="Add a grocery item" (click)="openQuickAddModal()">+</button>
          <button class="round-button" type="button" aria-label="Add a meal" (click)="openAddMealModal()">☰</button>
        </div>
      </header>
      <p class="muted page-intro">Everything you need for this week's meals.</p>

      @if (groceries().length > 0) {
        <div class="progress"><span [style.width.%]="progressPercent()"></span></div>
        <p class="progress-label">{{ completedCount() }} of {{ groceries().length }} items picked up</p>
      }

      @if (unfinishedGroceries().length > 0) {
        <section class="grocery-group single-list-group">
          <h2>Shopping list</h2>
          @for (item of unfinishedGroceries(); track item.id) {
            <label class="grocery-item">
              <input type="checkbox" [checked]="item.done" (change)="toggleGrocery(item.id!, $event)" />
              <span class="checkmark"></span>
              <span [class.done]="item.done">{{ item.name }}</span>
            </label>
          }
        </section>
      } @else {
        <section class="empty-state">
          <span class="empty-icon">✓</span>
          <h2>No items yet</h2>
          <p>Add a meal or create a single grocery item to start your shopping list.</p>
        </section>
      }
    </main>

    @if (showQuickAddModal()) {
      <div class="modal-backdrop" (click)="closeQuickAddModal()"></div>
      <div class="modal small-modal">
        <div class="modal-header">
          <h2>Add grocery item</h2>
          <button class="close-button" type="button" aria-label="Close" (click)="closeQuickAddModal()">×</button>
        </div>
        <div class="modal-content">
          <div class="form-group">
            <label for="single-item-name">Item name</label>
            <input id="single-item-name" type="text" [(ngModel)]="singleItemName" placeholder="e.g. Parmesan" />
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="secondary-button" (click)="closeQuickAddModal()">Cancel</button>
          <button type="button" class="primary-button" (click)="addSingleGroceryItem()" [disabled]="!singleItemName.trim() || loadingSingleItem()">
            {{ loadingSingleItem() ? 'Adding...' : 'Add item' }} <span>→</span>
          </button>
        </div>
      </div>
    }

    @if (showAddMealModal()) {
      <div class="modal-backdrop" (click)="closeAddMealModal()"></div>
      <div class="modal">
        <div class="modal-header">
          <h2>Add meal to calendar</h2>
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
  private readonly menuService = inject(MenuService);

  readonly meals = toSignal(this.mealService.getMeals(), { initialValue: [] as Meal[] });

  readonly groceries = toSignal(this.groceryService.getGroceries(), { initialValue: [] as Grocery[] });
    readonly unfinishedGroceries = computed(() =>
        this.groceries().filter(grocery => !grocery.done)
    );

  readonly showAddMealModal = signal(false);
  readonly showQuickAddModal = signal(false);
  readonly mealSearchTerm = signal('');
  readonly selectedMeal = signal<Meal | null>(null);
  readonly selectedDate = signal(this.getTodayDate());
  readonly selectedIngredients = signal<boolean[]>([]);
  readonly loadingAddMeal = signal(false);
  readonly loadingSingleItem = signal(false);

  singleItemName = '';

  readonly filteredMeals = computed(() => {
    const search = this.mealSearchTerm().trim().toLowerCase();
    return this.meals()
      .filter((m) => m.name.toLowerCase().includes(search))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
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
    this.selectedDate.set(this.getTodayDate());
  }

  closeAddMealModal(): void {
    this.showAddMealModal.set(false);
    this.selectedIngredients.set([]);
  }

  openQuickAddModal(): void {
    this.showQuickAddModal.set(true);
    this.singleItemName = '';
  }

  closeQuickAddModal(): void {
    this.showQuickAddModal.set(false);
    this.singleItemName = '';
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

        await this.menuService.createMenuMeal({
            date: new Date(`${this.selectedDate()}T12:00:00`),
            name: meal.name,
            menuId: meal.id!
        });

      for (const item of selectedItems) {
        await this.groceryService.createGrocery({
          name: item.name,
          done: false
        });
      }

      this.closeAddMealModal();
    } catch (error) {
      console.error('Error adding meal to groceries:', error);
    } finally {
      this.loadingAddMeal.set(false);
    }
  }

  async addSingleGroceryItem(): Promise<void> {
    if (!this.singleItemName.trim()) return;

    this.loadingSingleItem.set(true);

    try {
      await this.groceryService.createGrocery({
        name: this.singleItemName.trim(),
        done: false
      });

      this.closeQuickAddModal();
    } catch (error) {
      console.error('Error creating grocery item:', error);
    } finally {
      this.loadingSingleItem.set(false);
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

    async removeCompleted(): Promise<void> {
        await this.groceryService.deleteCompletedGroceries();
    }
}
