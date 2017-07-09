import { Action } from '../../action';
import { createActionFactory } from '../../actionCreatorFactory';

import { ShoppingList } from './shoppingList';
import { ShoppingListItem } from './shoppingListItem';

export interface NewShoppingListItem {
    readonly text: string;
    readonly parentId?: number;
}

export interface NewShoppingListItemEvent {
    readonly id: string;
    readonly text: string;
    readonly parentId: number;
    readonly utcTimestamp: number;
}

export interface DeleteShoppingListItem {
    readonly id: string;
    readonly parentId?: number;
}

export type NewShoppingListItemAction = Action<NewShoppingListItem>;

export const addShoppingListItem = createActionFactory<NewShoppingListItem>('domain:shopping-list-item:add');
export const addShoppingListItemEvent = createActionFactory<NewShoppingListItemEvent>('event:shopping-list-item:add');
