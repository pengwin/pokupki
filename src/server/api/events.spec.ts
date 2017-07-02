/* tslint:disable:no-expression-statement */

import { EventStore } from '../db/eventStore';
import { ApiEventHandler } from './events';

function mockStore(allEvents) {
    return {
        getAll: jest.fn().mockReturnValue(Promise.resolve(allEvents)),
        insert: jest.fn().mockReturnValue(Promise.resolve([]))
    };
}

test('should expose get all handler', async () => {
    const store = mockStore as any as EventStore;
    const handler = new ApiEventHandler(store);
    expect(handler.allHandler).toBeDefined();
    expect(handler.allHandler.metaData).toBeDefined();
    expect(handler.allHandler.handler).toBeInstanceOf(Function);
});

test('should expose insert handler', async () => {
    const store = mockStore as any as EventStore;
    const handler = new ApiEventHandler(store);
    expect(handler.insertHandler).toBeDefined();
    expect(handler.insertHandler.metaData).toBeDefined();
    expect(handler.insertHandler.handler).toBeInstanceOf(Function);
});

test('should response on insert', async () => {
    const store = mockStore(null) as any as EventStore;
    const handler = new ApiEventHandler(store);
    const replyMock: any = (error) => fail(error);
    replyMock.response = (data) => data;
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
    expect(result).toBeDefined();
});
