import { EventStore } from './db/eventStore';
import { Reply, Request, RequestHandler } from './requestHandler';

import { Logger } from '../utils/logger';

import { EventSaveModel } from '../models/event';

export class ApiEventHandler {
    constructor(private store: EventStore) { }

    get allHandler(): RequestHandler {
        return {
            handler: this.getAll.bind(this),
            method: 'GET',
            url: '/api/events',
            metaData: {
                description: 'Gets all events from store',
                notes: 'Returns {id: serial, type: string, payload: object, created: date}',
                tags: ['api', 'event']
            }
        };
    }

    get insertHandler(): RequestHandler {
        return {
            handler: this.insert.bind(this),
            method: 'POST',
            url: '/api/event',
            metaData: {
                description: 'Adds new event to event store',
                notes: 'Handles object with structure {type: string, version: string, payload: object}',
                tags: ['api', 'event']
            }
        };
    }

    private getAll(request: Request, reply: Reply) {
        return this.store.getAll().catch(err => {
            // tslint:disable-next-line:no-expression-statement
            Logger.error(err);
            return reply(err);
        });
    }

    private insert(request: Request, reply: Reply) {
        return this.store.insert(request.payload)
            .catch(err => {
                // tslint:disable-next-line:no-expression-statement
                Logger.error(err);
                return reply(err);
            });
    }
}
