import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Meal } from '../models/meal.model';

@Injectable({ providedIn: 'root' })
export class MealService {
  private readonly firestore = inject(Firestore);
  private readonly mealsCollection = collection(this.firestore, 'meals');

  getMeals(): Observable<Meal[]> {
    return collectionData(this.mealsCollection, { idField: 'id' }) as Observable<Meal[]>;
  }

  getMeal(id: string): Observable<Meal | undefined> {
    return docData(doc(this.firestore, 'meals', id), { idField: 'id' }) as Observable<Meal | undefined>;
  }

  async createMeal(meal: Omit<Meal, 'id'>): Promise<string> {
    const reference = await addDoc(this.mealsCollection, meal);
    return reference.id;
  }

  async updateMeal(id: string, changes: Partial<Omit<Meal, 'id'>>): Promise<void> {
    await updateDoc(doc(this.firestore, 'meals', id), changes);
  }

  async deleteMeal(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'meals', id));
  }
}
