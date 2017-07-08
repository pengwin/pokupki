import { combineEpics } from 'redux-observable';

import { shoppingListEpic } from './shoppingList/epics';

export const domainEpic = combineEpics(shoppingListEpic);
