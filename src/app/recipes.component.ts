import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({ selector: 'app-recipes', standalone: true, imports: [RouterLink], template: `
  <main class="page inner-page"><header class="page-header"><a routerLink="/" class="back-button">‹</a><div><p class="eyebrow">GET INSPIRED</p><h1>Recipes</h1></div><button class="round-button">⌕</button></header><p class="muted page-intro">Simple food, made for real life.</p><div class="recipe-grid">@for (recipe of recipes; track recipe.title) {<article class="recipe-card"><div class="recipe-image" [style.background]="recipe.color">{{ recipe.emoji }}</div><div class="recipe-copy"><span>{{ recipe.time }}</span><h2>{{ recipe.title }}</h2><p>{{ recipe.type }}</p></div></article>}</div></main>
  <nav class="bottom-nav" aria-label="Main navigation"><a routerLink="/"><span>⌂</span>Home</a><a routerLink="/groceries"><span>✓</span>Groceries</a><a routerLink="/recipes" class="active"><span>✦</span>Recipes</a></nav>
` })
export class RecipesComponent { readonly recipes = [{ title: 'Creamy tomato pasta', type: 'Comfort food', time: '25 MIN', emoji: '🍝', color: '#f2c7b3' }, { title: 'Green goddess bowl', type: 'Fresh & healthy', time: '20 MIN', emoji: '🥗', color: '#d6e4ae' }, { title: 'Crispy fish tacos', type: 'Weeknight favourite', time: '30 MIN', emoji: '🌮', color: '#f4d48b' }, { title: 'Berry breakfast bowl', type: 'Good morning', time: '10 MIN', emoji: '🫐', color: '#d8c9eb' }]; }
