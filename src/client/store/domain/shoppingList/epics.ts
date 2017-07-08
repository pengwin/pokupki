import { combineEpics } from 'redux-observable';
import { ajax } from 'rxjs/observable/dom/ajax';

import { uuidv4 } from '../../../../utils/guid';
import { Logger } from '../../../../utils/logger';

import { RootState } from '../../rootState';

import * as actions from './actions';

import { Store } from 'redux';

const createShoppingList = (action: actions.NewShoppingListAction, store: Store<RootState>) => {
    const state = store.getState();
    if (state.domain.shoppingLists.lists.find(x => x.name === action.payload.name.toUpperCase())) {
        return { type: 'ui:error', payload: `Shopping list with name ${action.payload.name} already exist` };
    }
    return actions.addShoppingList({
        id: action.payload.id || uuidv4(),
        name: action.payload.name.toUpperCase(),
        items: []
    });
};

const createShoppingListItem = (action: actions.NewShoppingListItemAction, store: Store<RootState>) => {
    const state = store.getState();
    const parentList = state.domain.shoppingLists.lists.find(x => x.id === action.payload.parentId);
    if (!parentList) {
        return { type: 'ui:error', payload: `Shopping list with id ${action.payload.parentId} does not exist` };
    }
    if (parentList.items.find(x => x.text === action.payload.text)) {
        // tslint:disable-next-line:max-line-length
        const message = `Shopping list item with text '${action.payload.text}' on parent ${action.payload.parentId} already exists`;
        return {
            type: 'ui:error',
            payload: message
        };
    }
    return actions.addShoppingListItem({ ...action.payload, id: action.payload.id || uuidv4() });
};

const createShoppingListEpic = (action$: any, store: Store<RootState>) =>
    action$.ofType(actions.createShoppingList.type)
        .map((a: actions.NewShoppingListAction) => createShoppingList(a, store));

const createShoppingListItemEpic = (action$: any, store: Store<RootState>) =>
    action$.ofType(actions.createShoppingListItem.type)
        .map((a: actions.NewShoppingListItemAction) => createShoppingListItem(a, store));

export const shoppingListEpic = combineEpics(
    createShoppingListEpic,
    createShoppingListItemEpic
);
