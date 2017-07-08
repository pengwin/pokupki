import { Action } from '../action';
import { setToken } from './actions';
import { AuthState } from './state';
import { initialState } from './state';

export const authReducer = (state: AuthState = initialState, action: any) => {
    if (action.type !== setToken.type) {
        return state;
    }

    const setTokenAction = action as Action<string>;
    return Object.assign({}, state, { token: action.payload });
};
