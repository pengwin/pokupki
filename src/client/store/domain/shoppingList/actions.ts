import { Action } from '../../action';
import { actionCreatorFactory } from '../../actionCreatorFactory';

import { uuidv4 } from '../../../../utils/guid';
import { ShoppingList } from './shoppingList';
import { ShoppingListItem } from './shoppingListItem';

interface NewShoppingList {
    readonly id?: string;
    readonly name: string;
}

interface NewShoppingListItem {
    readonly id?: string;
    readonly parentId: string;
    readonly text: string;
}

export type NewShoppingListAction = Action<NewShoppingList>;
export type NewShoppingListItemAction = Action<NewShoppingListItem>;

export const createShoppingList = actionCreatorFactory<NewShoppingList>('domain:createShoppingList');
export const addShoppingList = actionCreatorFactory<ShoppingList>('internal:domain:addShoppingList');

export const createShoppingListItem = actionCreatorFactory<NewShoppingListItem>('domain:createShoppingListItem');
export const addShoppingListItem = actionCreatorFactory<ShoppingListItem>('internal:domain:addShoppingListItem');
