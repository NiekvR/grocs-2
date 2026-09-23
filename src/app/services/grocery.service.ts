import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  query,
  updateDoc,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Grocery } from '../models/meal.model';

@Injectable({ providedIn: 'root' })
export class GroceryService {
  private readonly firestore = inject(Firestore);
  private readonly groceriesCollection = collection(this.firestore, 'groceries');

  getGroceries(): Observable<Grocery[]> {
    return collectionData(this.groceriesCollection, { idField: 'id' }) as Observable<Grocery[]>;
  }

  getGroceriesForMeal(mealId: string): Observable<Grocery[]> {
    const groceriesQuery = query(this.groceriesCollection, where('mealId', '==', mealId));
    return collectionData(groceriesQuery, { idField: 'id' }) as Observable<Grocery[]>;
  }

  getGrocery(id: string): Observable<Grocery | undefined> {
    return docData(doc(this.firestore, 'groceries', id), { idField: 'id' }) as Observable<Grocery | undefined>;
  }

  async createGrocery(grocery: Omit<Grocery, 'id'>): Promise<string> {
    const reference = await addDoc(this.groceriesCollection, grocery);
    return reference.id;
  }

  async updateGrocery(id: string, changes: Partial<Omit<Grocery, 'id'>>): Promise<void> {
    await updateDoc(doc(this.firestore, 'groceries', id), changes);
  }

  async deleteGrocery(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'groceries', id));
  }
}
