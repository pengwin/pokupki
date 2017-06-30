import * as Hapi from 'hapi';
import * as pg from 'pg';
import * as db from './database';

import { Logger } from './logger';

interface Event {
    type: string;
    payload: any;
}

type RequestHandlerFunction = (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => Promise<Hapi.Response>;

interface HandlerConfig {
    description: string;
    notes: string;
    tags: string[];
}

interface RequestHandler extends RequestHandlerFunction {
    config: Hapi.RouteAdditionalConfigurationOptions;
}

function insertEventQuery(type: string, version: string, payload: any) {
    return {
        text: 'INSERT INTO event(type, version, payload) VALUES($1, $2, $3);',
        values: [type, version, payload]
    };
}

function getAllEventsQuery() {
    return {
        name: 'get_all_events',
        text: 'SELECT * FROM event;'
    };
}

function mapQueryResult(queryResult: pg.QueryResult) {
    return queryResult.rows;
}

function sqlQuery(query: pg.QueryConfig, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> {
    return db.query(query)
        .then(res => reply.response(mapQueryResult(res)))
        .catch(err => {
            const error = new Error(`Query ${query.text} error: ${err.message}, ${err.stack}`);
            Logger.error(error);
            return reply(error);
        });
}

function createHandler(handlerFn: RequestHandlerFunction, config: HandlerConfig): RequestHandler {
    const handler = handlerFn as any;
    handler.config = config;
    return handler;
}

function insertHandlerFunction(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    const event = request.payload;
    if (!event || !event.version || !event.type || !event.payload) {
        Logger.error('Event is not valid', event);
        return Promise.resolve(reply(new Error('Event is not valid')));
    }
    const query = insertEventQuery(request.payload.type, request.payload.version, request.payload.payload);
    return sqlQuery(query, reply);
}

function getAllHandlerFunction(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    return sqlQuery(getAllEventsQuery(), reply);
}

const insertHandler = createHandler(insertHandlerFunction, {
    description: 'Adds new event to event store',
    notes: 'Handles object with structure {type: string, version: string, payload: object}',
    tags: ['api', 'event']
});

const getAllHandler = createHandler(getAllHandlerFunction, {
    description: 'Gets all events from store',
    notes: 'Returns {id: serial, type: string, payload: object, created: date}',
    tags: ['api', 'event']
});

export { insertHandler };
export { getAllHandler };
