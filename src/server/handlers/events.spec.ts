/* tslint:disable:no-expression-statement */
/* tslint:disable:no-unused-expression */
import { assert, expect, use } from 'chai';
import { stub } from 'sinon';
import * as sinonChai from 'sinon-chai';

import { EventStore } from '../db/eventStore';
import { ApiEventHandler } from './events';

use(sinonChai);

function mockStore(allEvents: any) {
    return {
        getAll: stub().returns(Promise.resolve(allEvents)),
        insert: stub().returns(Promise.resolve([]))
    };
}

test('should expose get all handler', async () => {
    const store = mockStore as any as EventStore;
    const handler = new ApiEventHandler(store);

    expect(handler.allHandler).to.be;
    expect(handler.allHandler.metaData).to.be;
    expect(handler.allHandler.handler).to.be.an.instanceof(Function);
});

test('should expose insert handler', async () => {
    const store = mockStore as any as EventStore;
    const handler = new ApiEventHandler(store);
    expect(handler.insertHandler).to.be;
    expect(handler.insertHandler.metaData).to.be;
    expect(handler.insertHandler.handler).to.be.an.instanceof(Function);
});

test('should response on insert', async () => {
    const store = mockStore(null) as any as EventStore;
    const handler = new ApiEventHandler(store);
    const replyMock: any = (error: any) => assert.fail(error);
    replyMock.response = (data: any) => data;
    const result: any = await handler.insertHandler.handler({
        auth: {
            credentials: {
                id: '1'
            }
        },
        payload: {
            type: 'test',
            version: 'version',
            payload: { q: 1 }
        }
    }, replyMock);
    expect(result).to.be;
});
