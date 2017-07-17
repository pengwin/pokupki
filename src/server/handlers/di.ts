// tslint:disable:no-expression-statement
import * as pg from 'pg';

import { ContainerModule, interfaces } from 'inversify';

import { ApiAuthHandler } from './auth';
import { ApiEventHandler } from './events';
import { RequestHandler } from './requestHandler';

export const diModule = new ContainerModule(
    (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
        bind(ApiAuthHandler).toSelf();
        bind(ApiEventHandler).toSelf();
        bind(RequestHandler).toDynamicValue((context: interfaces.Context) => {
            return context.container.get(ApiAuthHandler).loginHandler;
        });
        bind(RequestHandler).toDynamicValue((context: interfaces.Context) => {
            return context.container.get(ApiEventHandler).allHandler;
        });
        bind(RequestHandler).toDynamicValue((context: interfaces.Context) => {
            return context.container.get(ApiEventHandler).insertHandler;
        });
    }
);
