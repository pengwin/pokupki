// tslint:disable:no-expression-statement
import 'reflect-metadata';

import { Container, inject, injectable } from 'inversify';

import { diModule as authModule } from './auth';
import { diModule as configurationModule } from './configuration';
import { diModule as dbModule } from './db';
import { diModule as handlersModule } from './handlers';
import { diModule as serverModule } from './server';

import { App } from './app';

const container = new Container();
container.load(configurationModule);
container.load(dbModule);
container.load(authModule);
container.load(handlersModule);
container.load(serverModule);

container.bind(App).toSelf();

export { container as kernel };
