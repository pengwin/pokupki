import { applyMiddleware, combineReducers, createStore, Middleware, Store } from 'redux';

import { Logger } from '../../utils/logger';
import { RootState } from './rootState';

import * as http from '../http';
import { Action } from './action';

const storeEvent = (event: any, token: string) => http.post('/api/event', event, token);
const mapActionToEvent = (action: any) => {
    return {
        type: action.type,
        version: action.version || '1',
        payload: action.payload
    };
};

const saveEventMiddleWare = (store: Store<RootState>) => (next: any) => (action: Action<any>) => {
    if (action.fromServer || !action.type || !action.type.startsWith('event:')) {
        return next(action);
    }

    const state = store.getState();
    if (!state || !state.auth || !state.auth.token) {
        return next(action);
    }
    const token = state.auth.token;
    return storeEvent(mapActionToEvent(action), token).then(result => {
        // tslint:disable-next-line:no-expression-statement
        Logger.info('Save event:', action);
        return next(action);
    }).catch(error => {
        // tslint:disable-next-line:no-expression-statement
        Logger.error('Unable to save event', error);
        return next(action);
    });
};

export { saveEventMiddleWare };
