import { createActionFactory } from '../actionCreatorFactory';

export const showError = createActionFactory<string>('ui:error');
export const setError = createActionFactory<string>('ui:setError');
