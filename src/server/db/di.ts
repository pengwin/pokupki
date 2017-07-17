// tslint:disable:no-expression-statement
import * as pg from 'pg';

import { ContainerModule, interfaces } from 'inversify';
import { Configuration } from '../configuration';
import { Database } from './database';
import { EventStore } from './eventStore';
import { PoolProvider } from './poolProvider';
import { UserStore } from './userStore';

export const diModule = new ContainerModule(
    (bind: interfaces.Bind) => {
        bind(PoolProvider).toSelf();
        bind(Database).toSelf().inSingletonScope();
        bind(EventStore).toSelf();
        bind(UserStore).toSelf();
    }
);
