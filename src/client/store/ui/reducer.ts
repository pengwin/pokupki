import { setError } from './actions';
import { UIState } from './state';

const uiReducer = (state: UIState = { error: null }, action: any) => {
    if (action.type !== setError.type) {
        return state;
    }

    return Object.assign({}, state, { error: action.error });
};

export { uiReducer };
