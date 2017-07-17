// tslint:disable:no-expression-statement

import { ContainerModule, interfaces } from 'inversify';
import { HapiServer } from './server';

export const diModule = new ContainerModule(
    (bind: interfaces.Bind) => {
        bind(HapiServer).toSelf();
    }
);
