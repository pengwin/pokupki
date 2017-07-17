import { injectable } from 'inversify';

import { EventStore } from '../db/eventStore';
import { Reply, Request, RequestHandler } from '../handlers';

import { Logger } from '../../utils/logger';

import { EventSaveModel } from '../../models/event';

@injectable()
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
                tags: ['api', 'event'],
                auth: 'token'
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
                tags: ['api', 'event'],
                auth: 'token'
            }
        };
    }

    private getAll(request: Request, reply: Reply) {
        if (!request.auth || !request.auth.credentials) {
            throw new Error('Undefined credentials');
        }
        return this.store.getAll(request.auth.credentials.id)
            .then(res => reply.response(res))
            .catch(err => {
                // tslint:disable-next-line:no-expression-statement
                Logger.error(err);
                return reply(err);
            });
    }

    private insert(request: Request, reply: Reply) {
        return this.store.insert(this.mapEvent(request))
            .then(res => reply.response(res))
            .catch(err => {
                // tslint:disable-next-line:no-expression-statement
                Logger.error(err);
                return reply(err);
            });
    }

    private mapEvent(request: Request): EventSaveModel {
        if (!request.auth || !request.auth.credentials) {
            throw new Error('Undefined credentials');
        }
        return {
            userId: request.auth.credentials.id,
            type: request.payload.type,
            version: request.payload.version,
            payload: request.payload.payload
        };
    }
}
