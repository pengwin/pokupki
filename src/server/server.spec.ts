/* tslint:disable:no-expression-statement */

import { HapiServer } from './server';

test('should handle requests', async () => {
    const testHandler: any = {
        method: 'GET',
        url: '/test',
        handler: (request, reply) => { reply('test'); },
        metaData: {
            description: 'Test',
            notes: 'Test',
            tags: ['test', 'should handle requests']
        }
    };
    const result = await new HapiServer(9888)
        .enableLogging()
        .then(serv => serv.registerHandler(testHandler))
        .then(serv => serv.inject({ url: '/test', method: 'GET' }));
    expect(result.payload).toEqual('test');
});

test('should handle static requests', async () => {
    const result = await new HapiServer(9888)
        .enableLogging()
        .then(serv => serv.enableStaticServing('./src/testData'))
        .then(serv => serv.inject({ url: '/testFile.html', method: 'GET' }));
    expect(result.payload).toEqual('<h1>Test</h1>');
});
