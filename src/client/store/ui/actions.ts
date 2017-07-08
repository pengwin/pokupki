import { actionCreatorFactory } from '../actionCreatorFactory';

export const showError = actionCreatorFactory<string>('ui:error');
export const setError = actionCreatorFactory<string>('ui:setError');
