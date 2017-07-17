/* tslint:disable:no-expression-statement */
/* tslint:disable:no-unused-expression */

import { assert, expect, use } from 'chai';
import { stub } from 'sinon';
import * as sinonChai from 'sinon-chai';

import * as moment from 'moment';

import { UserStore } from '../db/userStore';
import { HapiServer } from '../server';
import { AuthProvider } from './authProvider';
import { TokenProvider } from './tokenProvider';

const configuration = {
    auth: {
        secret: 'TestSecret'
    },
    server: {
        port: 9998,
        staticContentPath: ''
    },
    database: {
        url: '',
        maxConnections: 0,
        ssl: true
    }
};

const secret = 'TestSecret';

function mockStore(user: any) {
    return {
        getUserById: stub().returns(Promise.resolve(user))
    };
}

function generateToken(user: any, timestamp: Date) {
    return new TokenProvider(configuration).generateToken(user, timestamp);
}

test('should register on server', async () => {
    const store = mockStore({ id: 8 }) as any as UserStore;
    const auth = new AuthProvider(store, configuration);
    const server = new HapiServer(configuration).enableAuth(auth);
});

test('should not brake request without auth', async () => {
    const store = mockStore({ id: 8 }) as any as UserStore;
    const auth = new AuthProvider(store, configuration);
    const testHandler: any = {
        method: 'GET',
        url: '/test',
        handler: (request: any, reply: any) => { reply('test'); },
        metaData: {
            description: 'Test',
            notes: 'Test',
            tags: ['test', 'should not brake request without auth'],
            auth: false
        }
    };
    const result = await new HapiServer(configuration).enableLogging()
        .then(serv => serv.enableAuth(auth))
        .then(serv => serv.registerHandler(testHandler))
        .then(serv => serv.inject({ url: '/test', method: 'GET' }));
    expect(result.payload).equals('test');
});

test('should not authorize requests without token', async () => {
    const store = mockStore({ id: 8 }) as any as UserStore;
    const auth = new AuthProvider(store, configuration);
    const testHandler: any = {
        method: 'GET',
        url: '/test',
        handler: (request: any, reply: any) => { reply('test'); },
        metaData: {
            description: 'Test',
            notes: 'Test',
            tags: ['test', 'should not authorize requests without token'],
            auth: 'token'
        }
    };
    const server = new HapiServer(configuration);
    const result = await server.enableLogging()
        .then(serv => server.enableAuth(auth))
        .then(serv => server.registerHandler(testHandler))
        .then(serv => serv.inject({ url: '/test', method: 'GET' }));
    expect(result.statusCode).equals(401);
});

test('should authorize requests with token', async () => {
    const user = { id: 8 };
    const store = mockStore(user) as any as UserStore;
    const auth = new AuthProvider(store, configuration);
    const timestamp = moment();
    const token = generateToken(user as any, timestamp.toDate());
    const testHandler: any = {
        method: 'GET',
        url: '/test',
        handler: (request: any, reply: any) => { reply(request.auth.credentials.id); },
        metaData: {
            description: 'Test',
            notes: 'Test',
            tags: ['test', 'should authorize requests with token'],
            auth: 'token'
        }
    };
    const server = new HapiServer(configuration);
    const result = await server.enableLogging()
        .then(serv => server.enableAuth(auth))
        .then(serv => server.registerHandler(testHandler))
        .then(serv => serv.inject({ url: '/test', headers: { authorization: token }, method: 'GET' }));
    expect(result.statusCode).equals(200);
    expect(result.payload).equals('8');
});

test('should not authorize requests with expired token', async () => {
    const user = { id: 8 };
    const store = mockStore(user) as any as UserStore;
    const auth = new AuthProvider(store, configuration);
    const timestamp = moment().subtract(1, 'day');
    const token = generateToken(user as any, timestamp.toDate());
    const testHandler: any = {
        method: 'GET',
        url: '/test',
        handler: (request: any, reply: any) => { reply(request.auth.credentials.id); },
        metaData: {
            description: 'Test',
            notes: 'Test',
            tags: ['test', 'should not authorize requests with expired token'],
            auth: 'token'
        }
    };
    const server = new HapiServer(configuration);
    const result = await server.enableLogging()
        .then(serv => server.enableAuth(auth))
        .then(serv => server.registerHandler(testHandler))
        .then(serv => serv.inject({ url: '/test', headers: { authorization: token }, method: 'GET' }));
    expect(result.statusCode).equals(401);
});
