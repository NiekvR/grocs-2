import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { GroceriesComponent } from './groceries.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { RecipesComponent } from './recipes.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'groceries', component: GroceriesComponent, canActivate: [authGuard] },
  { path: 'recipes', component: RecipesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
