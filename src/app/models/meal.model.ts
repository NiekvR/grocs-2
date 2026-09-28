export interface Grocery {
  id?: string;
  name: string;
  selected?: boolean;
  done?: boolean;
  edit?: boolean;
}

export interface Meal {
  id?: string;
  name: string;
  description?: string;
  items?: Grocery[];
}

export interface MenuMeal {
    id?: string;
    date: Date;
    name: string;
    menuId: string;
}
