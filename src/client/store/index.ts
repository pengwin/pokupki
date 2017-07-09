import * as auth from './auth/actions';
import * as domain from './domain/actions';
import * as ui from './ui/actions';

const actions = {
    auth,
    domain,
    ui
};

export { actions };
export { storeFactory } from './store';
