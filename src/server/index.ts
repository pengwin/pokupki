/* tslint:disable:no-expression-statement */

import { ApiAuthHandler } from './api/auth';
import { ApiEventHandler } from './api/events';
import { AuthProvider } from './auth/authProvider';
import { TokenProvider } from './auth/tokenProvider';
import { Database } from './db/database';
import { EventStore } from './db/eventStore';
import { UserStore } from './db/userStore';
import { HapiServer } from './server';

const staticPath = './public';
const port = Number(process.env.PORT) || 3000;
const secret = process.env.SECRET || '123456';

async function run() {
    const database = new Database(process.env.DATABASE_URL, 20, true);
    const store = new EventStore(database);
    const userStore = new UserStore(database);
    const apiHandler = new ApiEventHandler(store);
    const authProvider = new AuthProvider(userStore, secret);
    const tokenProvider = new TokenProvider(secret);
    const authHandler = new ApiAuthHandler(userStore, tokenProvider);
    const server = new HapiServer(port)
        .enableLogging()
        .then(serv => serv.enableStaticServing(staticPath))
        .then(serv => serv.enableAuth(authProvider))
        .then(serv => serv.registerHandler(apiHandler.allHandler))
        .then(serv => serv.registerHandler(apiHandler.insertHandler))
        .then(serv => serv.registerHandler(authHandler.loginHandler))
        .then(serv => serv.start());
}

run();
