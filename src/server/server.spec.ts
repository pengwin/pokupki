/* tslint:disable:no-expression-statement */

import { HapiServer } from './server';

test('should handle requests', async () => {
    const server: HapiServer = new HapiServer(9888);
    // tslint:disable-next-line:one-variable-per-declaration
    const testHandler: any = {
        method: 'GET',
        url: '/test',
        handler: (request, reply) => { reply('test'); },
        metaData: {
            description: 'Gets static content from server',
            notes: 'Returns file content',
            tags: ['static']
        }
    };
    server.registerHandler(testHandler);

    const result = await server.inject({url: '/test', method: 'GET'});
    expect(result.payload).toEqual('test');
});

test('should handle static requests', async () => {
    const server: HapiServer = new HapiServer(9888);
    // tslint:disable-next-line:one-variable-per-declaration
    await server.enableLogging();
    await server.enableStaticServing('./src/testData');

    const result = await server.inject({url: '/testFile.html', method: 'GET'});
    expect(result.payload).toEqual('<h1>Test</h1>');
});
