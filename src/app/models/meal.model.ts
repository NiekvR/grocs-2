export interface Grocery {
  id?: string;
  name: string;
  selected?: boolean;
  done?: boolean;
  date?: string;
  edit?: boolean;
  mealId?: string;
}

export interface Meal {
  id?: string;
  name: string;
  description?: string;
  items?: Grocery[];
}
