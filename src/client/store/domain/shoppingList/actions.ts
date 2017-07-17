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
}

export interface DeleteShoppingListItemEvent {
    readonly id: string;
}

export interface BuyShoppingListItem {
    readonly itemId: string;
    readonly shop: string;
    readonly productName: string;
    readonly price: number;
    readonly quantity: number;
    readonly unit: string;
}

export interface BuyShoppingListItemEvent {
    readonly itemId: string;
    readonly shop: string;
    readonly productName: string;
    readonly priceTotal: number;
    readonly currency: string;
    readonly quantity: number;
    readonly unit: string;
    readonly utcTimestamp: string;
}

export type NewShoppingListItemAction = Action<NewShoppingListItem>;

export const addShoppingListItem = createActionFactory<NewShoppingListItem>('domain:shopping-list-item:add');
export const addShoppingListItemEvent = createActionFactory<NewShoppingListItemEvent>('event:shopping-list-item:add');

export const buyShoppingListItem = createActionFactory<BuyShoppingListItem>('domain:shopping-list-item:buy');
export const buyShoppingListItemEvent = createActionFactory<BuyShoppingListItemEvent>('event:shopping-list-item:buy');

export const deleteShoppingListItem = createActionFactory<DeleteShoppingListItem>('domain:shopping-list-item:delete');
export const deleteShoppingListItemEvent = createActionFactory<DeleteShoppingListItemEvent>('event:shopping-list-item:delete');
