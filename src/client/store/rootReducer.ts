import { combineReducers } from 'redux';
import { authReducer } from './auth/reducer';
import { domainReducer } from './domain/reducer';
import { uiReducer } from './ui/reducer';

import { RootState } from './rootState';

const rootReducer = combineReducers<RootState>({
    auth: authReducer,
    domain: domainReducer,
    ui: uiReducer
});

export { rootReducer };
