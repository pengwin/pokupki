/* tslint:disable:no-expression-statement */

import { ApiEventHandler } from './apiHandlers';
import { Database } from './db/database';
import { EventStore } from './db/eventStore';
import { HapiServer } from './server';

const staticPath = './public';
const port = Number(process.env.PORT) || 3000;

async function createServer() {
    const server = new HapiServer(port);
    await server.enableStaticServing(staticPath);
    await server.enableLogging();
    return server;
}

async function run() {
    const database = new Database(process.env.DATABASE_URL, 20, true);
    const store = new EventStore(database);
    const apiHandler = new ApiEventHandler(store);
    const server = await createServer();
    server.registerHandler(apiHandler.allHandler)
        .registerHandler(apiHandler.insertHandler);
}

run();
