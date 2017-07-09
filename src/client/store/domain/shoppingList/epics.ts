import { combineEpics } from 'redux-observable';
import { ajax } from 'rxjs/observable/dom/ajax';

import { uuidv4 } from '../../../../utils/guid';
import { Logger } from '../../../../utils/logger';

import { RootState } from '../../rootState';

import * as actions from './actions';

import { Store } from 'redux';

const addShoppingListItem = (action: actions.NewShoppingListItemAction, store: Store<RootState>) =>
    actions.addShoppingListItemEvent({
        id: uuidv4(),
        text: action.payload.text,
        parentId: action.payload.parentId || 0,
        utcTimestamp: Date.now()
    });

const createShoppingListItemEpic = (action$: any, store: Store<RootState>) =>
    action$.ofType(actions.addShoppingListItem.type)
        .map((a: actions.NewShoppingListItemAction) => addShoppingListItem(a, store));

export const shoppingListEpic = combineEpics(
    createShoppingListItemEpic
);
