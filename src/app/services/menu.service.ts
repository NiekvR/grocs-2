import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MenuMeal } from '../models/meal.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly firestore = inject(Firestore);
  private readonly menuCollection = collection(this.firestore, 'menu');

  getMenuMeals(): Observable<MenuMeal[]> {
    return collectionData(this.menuCollection, { idField: 'id' }) as Observable<MenuMeal[]>;
  }

  async createMenuMeal(menuMeal: Omit<MenuMeal, 'id'>): Promise<string> {
    const reference = await addDoc(this.menuCollection, menuMeal);
    return reference.id;
  }
}
