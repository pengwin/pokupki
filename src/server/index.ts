/* tslint:disable:no-expression-statement */
import { kernel } from './di';

import { App } from './app';

async function run() {
    const app = kernel.get(App);
    await app.init();
    return app.start();
}

run();
