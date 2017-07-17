import { ShoppingList } from './shoppingList';
import { ShoppingListItem } from './shoppingListItem';

export interface ShoppingListState {
    readonly lists: ReadonlyArray<ShoppingList>;
    readonly items: ReadonlyArray<ShoppingListItem>;
}

export const initialState: ShoppingListState = { lists: [], items: [] };
