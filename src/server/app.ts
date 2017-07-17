// tslint:disable:no-expression-statement
import { injectable, multiInject } from 'inversify';

import { AuthProvider } from './auth';
import { RequestHandler } from './handlers';
import { HapiServer } from './server';

@injectable()
export class App {
    constructor(private server: HapiServer,
                private authProvider: AuthProvider,
                @multiInject(RequestHandler) private handlers: ReadonlyArray<RequestHandler>) {
    }

    public async init() {
        await this.server.enableLogging();
        await this.server.enableStaticServing();
        await this.server.enableAuth(this.authProvider);
        return this.registerHandlers();
    }

    public start() {
        return this.server.start();
    }

    private async registerHandlers() {
        return Promise.all(this.handlers.map(h => this.server.registerHandler(h)));
    }
}
