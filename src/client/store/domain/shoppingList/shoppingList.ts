import { ShoppingListItem } from './shoppingListItem';

export interface ShoppingList {
    readonly id: string;
    readonly name: string;
    readonly items: ReadonlyArray<ShoppingListItem>;
}
