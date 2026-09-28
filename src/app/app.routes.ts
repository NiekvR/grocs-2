import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { CreateMealComponent } from './create-meal.component';
import { GroceriesComponent } from './groceries.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { RecipeDetailComponent } from './recipe-detail.component';
import { RecipesComponent } from './recipes.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'groceries', component: GroceriesComponent, canActivate: [authGuard] },
  { path: 'recipes', component: RecipesComponent, canActivate: [authGuard] },
  { path: 'recipes/new', component: CreateMealComponent, canActivate: [authGuard] },
  { path: 'recipes/:id', component: RecipeDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
