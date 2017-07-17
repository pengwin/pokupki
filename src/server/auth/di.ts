// tslint:disable:no-expression-statement
import * as pg from 'pg';

import { ContainerModule, interfaces } from 'inversify';
import { AuthProvider } from './authProvider';
import { TokenProvider } from './tokenProvider';

export const diModule = new ContainerModule(
    (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
        bind(AuthProvider).toSelf();
        bind(TokenProvider).toSelf();
    }
);
