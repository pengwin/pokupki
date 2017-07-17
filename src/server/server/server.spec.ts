/* tslint:disable:no-expression-statement */
import { expect } from 'chai';
import { HapiServer } from './server';

const config: any = {
    server: {
        port: 98888,
        staticContentPath: './src/testData'
    }
};

test('should handle requests', async () => {
    const testHandler: any = {
        method: 'GET',
        url: '/test',
        handler: (request: any, reply: any) => { reply('test'); },
        metaData: {
            description: 'Test',
            notes: 'Test',
            tags: ['test', 'should handle requests']
        }
    };
    const server = await new HapiServer(config).enableLogging();
    await server.registerHandler(testHandler);
    const result = await server.inject({ url: '/test', method: 'GET' });
    expect(result.payload).equals('test');
});

test('should handle static requests', async () => {
    const server = await new HapiServer(config).enableLogging();
    await server.enableStaticServing();
    const result = await server.inject({ url: '/testFile.html', method: 'GET' });
    expect(result.payload).equals('<h1>Test</h1>');
});
