import { createActionFactory } from '../actionCreatorFactory';

export const setToken = createActionFactory<string>('app:setToken');
export const redirectToLogin = createActionFactory<null>('app:redirectToLogin');
export const login = createActionFactory<null>('app:login');
