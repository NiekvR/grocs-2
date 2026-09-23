import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-groceries',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="page inner-page">
      <header class="page-header"><a routerLink="/" class="back-button">‹</a><div><p class="eyebrow">YOUR SHOPPING</p><h1>Grocery list</h1></div><button class="round-button">+</button></header>
      <p class="muted page-intro">Everything you need for this week's meals.</p>
      <div class="progress"><span></span></div><p class="progress-label">4 of 16 items picked up</p>
      <section class="grocery-group"><h2>Fresh produce <span>6</span></h2>@for (item of produce; track item) { <label class="grocery-item"><input type="checkbox" /><span class="checkmark"></span><span>{{ item }}</span></label> }</section>
      <section class="grocery-group"><h2>Pantry <span>6</span></h2>@for (item of pantry; track item) { <label class="grocery-item"><input type="checkbox" /><span class="checkmark"></span><span>{{ item }}</span></label> }</section>
    </main>
    <nav class="bottom-nav" aria-label="Main navigation"><a routerLink="/"><span>⌂</span>Home</a><a routerLink="/groceries" class="active"><span>✓</span>Groceries</a><a routerLink="/recipes"><span>✦</span>Recipes</a></nav>
  `
})
export class GroceriesComponent { readonly produce = ['Cherry tomatoes', 'Avocados', 'Fresh basil', 'Limes', 'Red onion', 'Mixed greens']; readonly pantry = ['Pasta', 'Coconut milk', 'Taco shells', 'Vegetable stock', 'Parmesan', 'Olive oil']; }
