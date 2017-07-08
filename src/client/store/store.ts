import { applyMiddleware, combineReducers, createStore, Middleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

import { rootEpic } from './rootEpic';
import { rootReducer } from './rootReducer';
import { RootState } from './rootState';
import { saveEventMiddleWare } from './saveEventMiddleware';

const epicMiddleware = createEpicMiddleware(rootEpic);

const middlewares: ReadonlyArray<any> = [
    epicMiddleware,
    saveEventMiddleWare
];

const storeFactory = () => createStore<RootState>(rootReducer,
    composeWithDevTools(applyMiddleware(...middlewares)));

export { storeFactory };
