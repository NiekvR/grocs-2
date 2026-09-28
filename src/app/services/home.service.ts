import { Injectable, inject } from '@angular/core';
import {Firestore, addDoc, collection, collectionData, query, where} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MenuMeal } from '../models/meal.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
    private readonly firestore = inject(Firestore);
    private readonly menuCollection = collection(this.firestore, 'menu');

    getMenuMeals(): Observable<MenuMeal[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const menuQuery = query(this.menuCollection, where('date', '>=', today));
        return collectionData(menuQuery, { idField: 'id' }) as Observable<MenuMeal[]>;
    }

    async createMenuMeal(menuMeal: Omit<MenuMeal, 'id'>): Promise<string> {
        const reference = await addDoc(this.menuCollection, menuMeal);
        return reference.id;
    }
}
