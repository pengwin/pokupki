/* tslint:disable:no-expression-statement */

import * as moment from 'moment';

import { UserStore } from '../db/userStore';
import { HapiServer } from '../server';
import { AuthProvider } from './authProvider';
import { TokenProvider } from './tokenProvider';

const secret = 'TestSecret';

function mockStore(user) {
    return {
        getUserById: jest.fn().mockReturnValue(Promise.resolve(user))
    };
}

function generateToken(user, timestamp) {
    return new TokenProvider(secret).generateToken(user, timestamp);
}

test('should register on server', async () => {
    const store = mockStore({id: 8}) as any as UserStore;
    const auth = new AuthProvider(store, secret);
    const server = new HapiServer(9888).enableAuth(auth);
});

test('should not brake request without auth', async () => {
    const store = mockStore({id: 8}) as any as UserStore;
    const auth = new AuthProvider(store, secret);
    const testHandler: any = {
        method: 'GET',
        url: '/test',
        handler: (request, reply) => { reply('test'); },
        metaData: {
            description: 'Test',
            notes: 'Test',
            tags: ['test', 'should not brake request without auth'],
            auth: false
        }
    };
    const result = await new HapiServer(9888).enableLogging()
        .then(serv => serv.enableAuth(auth))
        .then(serv => serv.registerHandler(testHandler))
        .then(serv => serv.inject({url: '/test', method: 'GET'}));
    expect(result.payload).toEqual('test');
});

test('should not authorize requests without token', async () => {
    const store = mockStore({id: 8}) as any as UserStore;
    const auth = new AuthProvider(store, secret);
    const testHandler: any = {
        method: 'GET',
        url: '/test',
        handler: (request, reply) => { reply('test'); },
        metaData: {
            description: 'Test',
            notes: 'Test',
            tags: ['test', 'should not authorize requests without token'],
            auth: 'token'
        }
    };
    const server = new HapiServer(9888);
    const result = await server.enableLogging()
        .then(serv => server.enableAuth(auth))
        .then(serv => server.registerHandler(testHandler))
        .then(serv => serv.inject({url: '/test', method: 'GET'}));
    expect(result.statusCode).toEqual(401);
});

test('should authorize requests with token', async () => {
    const user = {id: 8};
    const store = mockStore(user) as any as UserStore;
    const auth = new AuthProvider(store, secret);
    const timestamp = moment();
    const token = generateToken(user as any, timestamp);
    const testHandler: any = {
        method: 'GET',
        url: '/test',
        handler: (request, reply) => { reply(request.auth.credentials.id); },
        metaData: {
            description: 'Test',
            notes: 'Test',
            tags: ['test', 'should authorize requests with token'],
            auth: 'token'
        }
    };
    const server = new HapiServer(9888);
    const result = await server.enableLogging()
        .then(serv => server.enableAuth(auth))
        .then(serv => server.registerHandler(testHandler))
        .then(serv => serv.inject({url: '/test', headers: { authorization: token }, method: 'GET'}));
    expect(result.statusCode).toEqual(200);
    expect(result.payload).toEqual('8');
});

test('should not authorize requests with expired token', async () => {
    const user = {id: 8};
    const store = mockStore(user) as any as UserStore;
    const auth = new AuthProvider(store, secret);
    const timestamp = moment().subtract(1, 'day');
    const token = generateToken(user as any, timestamp);
    const testHandler: any = {
        method: 'GET',
        url: '/test',
        handler: (request, reply) => { reply(request.auth.credentials.id); },
        metaData: {
            description: 'Test',
            notes: 'Test',
            tags: ['test', 'should not authorize requests with expired token'],
            auth: 'token'
        }
    };
    const server = new HapiServer(9888);
    const result = await server.enableLogging()
        .then(serv => server.enableAuth(auth))
        .then(serv => server.registerHandler(testHandler))
        .then(serv => serv.inject({url: '/test', headers: { authorization: token }, method: 'GET'}));
    expect(result.statusCode).toEqual(401);
});
