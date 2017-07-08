import { ShoppingListState } from './shoppingList/state';

export interface DomainState {
    readonly shoppingLists: ShoppingListState;
}
