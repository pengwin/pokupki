import { Action } from '../../action';
import { addShoppingList, addShoppingListItem } from './actions';
import { ShoppingList } from './shoppingList';
import { ShoppingListItem } from './shoppingListItem';
import { ShoppingListState } from './state';
import { initialState } from './state';

type Handler<S> = (state: S, action: Action<any>) => S;

interface Handlers<S> {
    readonly [type: string]: Handler<S>;
}

const handlers: Handlers<ShoppingListState> = {
    [addShoppingList.type]: (state: ShoppingListState, action: Action<ShoppingList>) =>
        Object.assign({}, state, { lists: state.lists.concat([action.payload]) }),

    [addShoppingListItem.type]: (state: ShoppingListState, action: Action<ShoppingListItem>) => {
        const oldShoppingList = state.lists.find(x => x.id === action.payload.parentId);
        if (!oldShoppingList) {
            throw Error('Shopping list is not found');
        }

        const newItemsList =  oldShoppingList.items.concat([action.payload]);
        const newShoppingList = Object.assign({}, oldShoppingList, { items: newItemsList});
        return Object.assign({}, state, { lists: state.lists.concat([newShoppingList]) });
    }
};

const shoppingListReducer = (state: ShoppingListState = initialState, action: any) => {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action as any);
};

export { shoppingListReducer };
