import { actionCreatorFactory } from '../actionCreatorFactory';

export const setToken = actionCreatorFactory<string>('app:setToken');
export const redirectToLogin = actionCreatorFactory<null>('app:redirectToLogin');
export const login = actionCreatorFactory<null>('app:login');
