import { Action } from './action';

interface ActionCreator<T> {
    // tslint:disable-next-line:readonly-array
    (payload: T): Action<T>;
    readonly type: string;
}

export function actionCreatorFactory<T>(type: string, version: string = '1'): ActionCreator<T> {
    const actionCreator: any = (payload: T) => ({ type, payload, version });
    // tslint:disable-next-line:no-expression-statement
    actionCreator.type = type;
    return actionCreator;
}
