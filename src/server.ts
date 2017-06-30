import * as Hapi from 'hapi';
import * as path from 'path';
import { Logger } from './logger';

import { getAllHandler, insertHandler } from './apiHandler';

const staticPath = './public';
const port = process.env.PORT || 3000;

const server = new Hapi.Server({
  debug: {
    log: ['error']
  }
});
server.connection({ port });

function registerStaticServing(serverInstance: Hapi.Server) {
  serverInstance.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: staticPath,
        index: true
      }
    },
    config: {
      description: 'Gets static content from server',
      notes: 'Returns file content',
      tags: ['static']
    }
  });
}

function registerInsertEvent(serverInstance: Hapi.Server) {
  serverInstance.route({
    config: insertHandler.config,
    handler: insertHandler,
    method: 'POST',
    path: '/api/event'
  });
}

function registerGetAllEvents(serverInstance: Hapi.Server) {
  serverInstance.route({
    config: getAllHandler.config,
    handler: getAllHandler,
    method: 'GET',
    path: '/api/events'
  });
}

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

server.register([
  { register: require('inert') },
  { register: require('good'), options: loggingOptions }], (err) => {
    if (err) {
      throw err;
    }

    registerStaticServing(server);
    registerGetAllEvents(server);
    registerInsertEvent(server);

    server.start((startErr) => {
      if (startErr) {
        throw startErr;
      }
      if (server.info) {
        Logger.info('Server running at:', server.info.uri);
      }
    });

  });
