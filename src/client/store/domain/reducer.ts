import { combineReducers } from 'redux';
import { shoppingListReducer } from './shoppingList/reducer';

import { DomainState } from './state';

const domainReducer = combineReducers<DomainState>({
    shoppingLists: shoppingListReducer
});

export { domainReducer };
