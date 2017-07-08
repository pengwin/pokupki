import { login } from './auth/actions';
import { createShoppingList, createShoppingListItem } from './domain/actions';
import { showError } from './ui/actions';

const actions = {
    auth: { login },
    domain: { createShoppingList, createShoppingListItem },
    ui: { showError }
};

export { actions };
export { storeFactory } from './store';
