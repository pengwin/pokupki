import { Moment } from 'moment';

import { ShoppingListItem } from './shoppingListItem';

export interface ShoppingList {
    readonly id: string;
    readonly date: Moment;
    readonly items: ReadonlyArray<ShoppingListItem>;
}
