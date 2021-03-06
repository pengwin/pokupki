import * as moment from 'moment';

import { Action } from '../../action';
import { ShoppingList } from './shoppingList';
import { ShoppingListItem } from './shoppingListItem';
import { ShoppingListState } from './state';
import { initialState } from './state';

import * as actions from './actions';

import { Logger } from '../../../../utils/logger';

type Handler<S> = (state: S, action: Action<any>) => S;

interface Handlers<S> {
    readonly [type: string]: Handler<S>;
}

const mapNewShoppingItem = (payload: actions.NewShoppingListItemEvent): ShoppingListItem => ({
    id: payload.id,
    text: payload.text
});

const getListParams = (payload: actions.NewShoppingListItemEvent) => {
    const date = moment(payload.utcTimestamp);
    const listId = `${date.format('DD-MM-YYYY')}_${payload.parentId}`;
    return {
        date,
        listId
    };
};

const getShoppingList = (state: ShoppingListState, payload: actions.NewShoppingListItemEvent) => {
    const params = getListParams(payload);
    const newItem = mapNewShoppingItem(payload);
    const oldList = state.lists.find(x => x.id === params.listId);
    const list = oldList || { items: [], id: params.listId, date: params.date };
    return {
        newItem,
        list: Object.assign({},
            list, {
                items: list.items.concat(newItem)
            }),
        hasOld: !!oldList
    };
};

const handlers: Handlers<ShoppingListState> = {
    [actions.addShoppingListItemEvent.type]: (state: ShoppingListState, action: Action<actions.NewShoppingListItemEvent>) => {
        const newList = getShoppingList(state, action.payload);
        const lists = newList.hasOld ? state.lists.map(shoppingList => {
            if (shoppingList.id === newList.list.id) {
                return newList.list;
            }
            return shoppingList;
        }) : state.lists.concat(newList.list);
        return Object.assign({}, state, { lists, items: state.items.concat([newList.newItem]) });
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
