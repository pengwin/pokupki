import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';

import { Logger } from '../utils/logger';
import { App } from './app';
import { actions, storeFactory } from './store';

import * as http from './http';

const getSessionToken = () => {
    const token = window.sessionStorage.getItem('token');
    if (!token) {
        // tslint:disable-next-line:no-expression-statement
        window.location.href = 'login.html';
    }
    return token;
};

const getAllEvents = (token: string) => http.get('/api/events', token);
const getEvent = () => ({ type: 'test', version: '1', payload: { q: 2 } });

const render = (storeInstance: Store<{}>) => (
    <Provider store={storeInstance}>
        <App listName={''} list={[]}/>
    </Provider>
);

const startApp = async () => {
    const token = getSessionToken();
    if (!token) {
        return;
    }

    const store = storeFactory();
    const action = store.dispatch(actions.auth.login(null));
    const events = (await getAllEvents(token)).map((event: any) => store.dispatch({...event, fromServer: true}));
    const app = render(store);

    return ReactDOM.render(app, document.getElementById('root'));
};

const app = startApp();
