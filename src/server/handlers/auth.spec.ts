/* tslint:disable:no-expression-statement */
/* tslint:disable:prefer-const */
/* tslint:disable:no-let */
/* tslint:disable:no-unused-expression */
import { assert, expect, use } from 'chai';
import { stub } from 'sinon';
import * as sinonChai from 'sinon-chai';

import { TokenProvider } from '../auth/tokenProvider';
import { UserStore } from '../db/userStore';
import { ApiAuthHandler } from './auth';

function mockStore(user: any) {
    return {
        getUser: stub().returns(Promise.resolve(user))
    };
}

function mockProvider(token?: string) {
    return {
        generateToken: stub().returns(token)
    };
}

test('should expose login handler', async () => {
    const store = mockStore as any as UserStore;
    const tokenProvider = mockProvider as any as TokenProvider;
    const handler = new ApiAuthHandler(store, tokenProvider);
    expect(handler.loginHandler).to.be;
    expect(handler.loginHandler.metaData).to.be;
    expect(handler.loginHandler.handler).to.be.an.instanceof(Function);
});

test('should return 400 on invalid user', async () => {
    const store = mockStore(null) as any as UserStore;
    const tokenProvider = mockProvider() as any as TokenProvider;
    const handler = new ApiAuthHandler(store, tokenProvider);
    const replyMock: any = (error: any) => assert.fail(error);
    replyMock.response = (data: any) => {
        let response: any = {};
        response.code = (c: any) => {
            response.code = c;
            return response;
        };
        return response;
    };
    replyMock.code = (code: any) => replyMock.code = code;
    const request = {
        payload: {
            userId: 1
        }
    };
    const result: any = await handler.loginHandler.handler(request, replyMock);
    expect(result).to.be;
    expect(result.code).equals(400);
});

test('should return token if user is found', async () => {
    const store = mockStore({id: 8}) as any as UserStore;
    const tokenProvider = mockProvider('token') as any as TokenProvider;
    const handler = new ApiAuthHandler(store, tokenProvider);
    const replyMock: any = (error: any) => assert.fail(error);
    replyMock.response = (data: any) => {
        let response: any = { payload: data };
        response.code = (c: any) => {
            response.code = c;
            return response;
        };
        return response;
    };
    replyMock.code = (code: any) => replyMock.code = code;
    const request = {
        payload: {
            userId: 1
        }
    };
    const result: any = await handler.loginHandler.handler(request, replyMock);
    expect(result.payload).to.be;
    expect(result.payload.token).equals('token');
});
