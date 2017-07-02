import * as Hapi from 'hapi';
import * as path from 'path';

import { Logger } from '../utils/logger';
import { AuthProvider } from './auth/authProvider';
import { HandlerMetaData, RequestHandler, RequestHandlerFunction } from './requestHandler';

interface Request {
    readonly url: string;
    readonly method: string;
    readonly payload?: any;
    readonly headers?: any;
}

export class HapiServer {
    private server: Hapi.Server;

    constructor(port: number) {
        // tslint:disable-next-line:no-expression-statement
        this.server = new Hapi.Server({
            debug: {
                log: ['error'],
                request: ['error']
            }
        });
        // tslint:disable-next-line:no-expression-statement
        this.server.connection({ port });
    }

    public enableStaticServing(staticPath: string) {
        const staticHandler: RequestHandler = {
            method: 'GET',
            url: '/{param*}',
            handler: {
                directory: {
                    path: staticPath,
                    index: true
                }
            } as any as RequestHandlerFunction,
            metaData: {
                description: 'Gets static content from server',
                notes: 'Returns file content',
                tags: ['static']
            }
        };

        return this.registerPlugin({ register: require('inert') })
            .then(server => server.registerHandler(staticHandler));
    }

    public enableLogging() {
        const loggingOptions = {
            ops: {
                interval: 1000
            },
            reporters: {
                consoleReporter: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ log: '*', response: '*' }]
                }, {
                    module: 'good-console'
                }, 'stdout']
            }
        };

        return this.registerPlugin({ register: require('good'), options: loggingOptions });
    }

    public enableAuth(authProvider: AuthProvider) {
        return authProvider.registerAuth(this.server).then(() => this);
    }

    public registerHandler(handler: RequestHandler) {
        // tslint:disable-next-line:no-expression-statement
        this.server.route({
            config: this.handlerMetaDataToRouteConfig(handler.metaData),
            handler: handler.handler,
            method: handler.method,
            path: handler.url
        });
        return this;
    }

    public inject(request: Request) {
        return this.server.inject(request);
    }

    public start() {
        return this.server.start().then(err => {
            if (err) {
                throw err;
            }

            // tslint:disable-next-line:no-expression-statement
            Logger.info('Server running at:', this.server.info ? this.server.info.uri : 'unknown endpoint');
            return this;
        });
    }

    public shutdown(timeoutMs: number) {
        return this.server.stop({ timeout: timeoutMs }).then(err => {
            if (err) {
                throw err;
            }

            // tslint:disable-next-line:no-expression-statement
            Logger.info('Server stopped');
            return this;
        });
    }

    private handlerMetaDataToRouteConfig(metaData: HandlerMetaData): Hapi.RouteAdditionalConfigurationOptions {
        return {
            tags: metaData.tags.slice(),
            description: metaData.description,
            notes: metaData.notes,
            auth: metaData.auth || false
        };
    }

    private registerPlugin(plugin: any): Promise<this> {
        return this.server.register(plugin).then(err => {
            if (err) {
                throw err;
            }
            return this;
        });
    }
}
