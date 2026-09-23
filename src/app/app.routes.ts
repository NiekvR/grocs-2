import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { GroceriesComponent } from './groceries.component';
import { RecipesComponent } from './recipes.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'groceries', component: GroceriesComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: '**', redirectTo: '' }
];
