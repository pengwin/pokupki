// tslint:disable:no-expression-statement
import * as pg from 'pg';

import { ContainerModule, interfaces } from 'inversify';
import { Configuration } from './configuration';
import { EnvironmentConfiguration } from './environmentConfiguration';

export const diModule = new ContainerModule(
    (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
        bind(Configuration).to(EnvironmentConfiguration);
    }
);
