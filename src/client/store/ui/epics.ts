import { combineEpics } from 'redux-observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/map';
import { ajax } from 'rxjs/observable/dom/ajax';

import * as actions from './actions';

const redirectToLogin = () => {
    // tslint:disable-next-line:no-expression-statement
    window.location.href = 'login.html';
};

const showErrorEpic = (action$: any) =>
    action$.ofType(actions.showError.type)
        .do((x: any) => alert(x.payload))
        .map((x: any) => actions.setError(x.payload));

export const uiEpic = combineEpics(
  showErrorEpic
);
