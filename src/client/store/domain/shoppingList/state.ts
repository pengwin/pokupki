import { ShoppingList } from './shoppingList';

export interface ShoppingListState {
    readonly lists: ReadonlyArray<ShoppingList>;
}

export const initialState: ShoppingListState = { lists: [] };
