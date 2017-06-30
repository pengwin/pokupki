import * as Hapi from 'hapi';
import * as path from 'path';

import { insertHandler, getAllHandler } from './apiHandler';

const staticPath = './public';
const port = process.env.PORT || 3000;

const server = new Hapi.Server({
  debug: {
    log: ['error']
  }
});
server.connection({ port: port });

function registerStaticServing(server) {
  server.route({
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

function registerInsertEvent(server: Hapi.Server) {
  server.route({
    method: 'POST',
    path: '/api/event',
    handler: insertHandler,
    config: {
      description: 'Adds new event to event store',
      notes: 'Handles object with structure {type: string, payload: object}',
      tags: ['api', 'event']
    }
  });
}

function registerGetAllEvents(server) {
  server.route({
    method: 'GET',
    path: '/api/events',
    handler: getAllHandler,
    config: {
      description: 'Gets all events from store',
      notes: 'Returns {id: serial, type: string, payload: object, created: date}',
      tags: ['api', 'event']
    }
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

    server.start((err) => {
      if (err) {
        throw err;
      }
      if (server.info) {
        console.log('Server running at:', server.info.uri);
      }
    });

  });

