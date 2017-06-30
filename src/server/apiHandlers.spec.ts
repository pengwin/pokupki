/* tslint:disable:no-expression-statement */

import { ApiEventHandler } from './apiHandlers';
import { EventStore } from './db/eventStore';

function mockStore(allEvents) {
    return {
        getAll: jest.fn().mockReturnValue(Promise.resolve(allEvents)),
        insert: jest.fn()
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

test('should expose insert handler', async () => {
    const expectedResult: ReadonlyArray<any> = [{a: 2}];
    const store = mockStore(expectedResult) as any as EventStore;
    const handler = new ApiEventHandler(store);
    const replyMock: any = (error) => fail(error);
    replyMock.response = (data) => data;
    const result: any = await handler.allHandler.handler({
        payload: {
            type: 'test',
            version: 'version',
            payload: {q: 1}
        }
    }, replyMock);
    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
    expect(result[0].a).toEqual(2);
});
