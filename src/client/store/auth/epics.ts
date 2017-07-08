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

const login = () => {
    const token = window.sessionStorage.getItem('token');
    return token ? actions.setToken(token) : actions.redirectToLogin(null);
};

const redirectToLoginEpic = (action$: any) =>
    action$.ofType(actions.redirectToLogin.type)
        .do(() => redirectToLogin())
        .ignoreElements();

const loginEpic = (action$: any) =>
    action$.ofType(actions.login.type)
        .map(login);

export const authEpic = combineEpics(
  redirectToLoginEpic,
  loginEpic
);
