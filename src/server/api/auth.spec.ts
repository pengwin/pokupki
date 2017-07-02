/* tslint:disable:no-expression-statement */
/* tslint:disable:prefer-const */
/* tslint:disable:no-let */

import { TokenProvider } from '../auth/tokenProvider';
import { UserStore } from '../db/userStore';
import { ApiAuthHandler } from './auth';

function mockStore(user) {
    return {
        getUser: jest.fn().mockReturnValue(Promise.resolve(user))
    };
}

function mockProvider(token?: string) {
    return {
        generateToken: jest.fn().mockReturnValue(token)
    };
}

test('should expose login handler', async () => {
    const store = mockStore as any as UserStore;
    const tokenProvider = mockProvider as any as TokenProvider;
    const handler = new ApiAuthHandler(store, tokenProvider);
    expect(handler.loginHandler).toBeDefined();
    expect(handler.loginHandler.metaData).toBeDefined();
    expect(handler.loginHandler.handler).toBeInstanceOf(Function);
});

test('should return 400 on invalid user', async () => {
    const store = mockStore(null) as any as UserStore;
    const tokenProvider = mockProvider() as any as TokenProvider;
    const handler = new ApiAuthHandler(store, tokenProvider);
    const replyMock: any = (error) => fail(error);
    replyMock.response = (data) => {
        let response: any = {};
        response.code = (c) => {
            response.code = c;
            return response;
        };
        return response;
    };
    replyMock.code = (code) => replyMock.code = code;
    const request = {
        payload: {
            userId: 1
        }
    };
    const result: any = await handler.loginHandler.handler(request, replyMock);
    expect(result).toBeDefined();
    expect(result.code).toEqual(400);
});

test('should return token if user is found', async () => {
    const store = mockStore({id: 8}) as any as UserStore;
    const tokenProvider = mockProvider('token') as any as TokenProvider;
    const handler = new ApiAuthHandler(store, tokenProvider);
    const replyMock: any = (error) => fail(error);
    replyMock.response = (data) => {
        let response: any = { payload: data };
        response.code = (c) => {
            response.code = c;
            return response;
        };
        return response;
    };
    replyMock.code = (code) => replyMock.code = code;
    const request = {
        payload: {
            userId: 1
        }
    };
    const result: any = await handler.loginHandler.handler(request, replyMock);
    expect(result.payload).toBeDefined();
    expect(result.payload.token).toEqual('token');
});
