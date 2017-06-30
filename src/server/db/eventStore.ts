import { Event, EventSaveModel } from '../../models/event';
import { Database } from './database';

function insertEventQuery(event: EventSaveModel) {
    return {
        text: 'INSERT INTO event(type, version, payload) VALUES($1, $2, $3);',
        values: [event.type, event.version, event.payload]
    };
}

function getAllEventsQuery() {
    return {
        name: 'get_all_events',
        text: 'SELECT * FROM event;'
    };
}

export class EventStore {
    constructor(private db: Database) { }

    public getAll() {
        return this.db.query(getAllEventsQuery()).then(rows => rows.map(row => this.mapRow(row)));
    }

    public insert(event: EventSaveModel) {
        return this.validateEvent(event).then(e => this.insertEventQuery(e));
    }

    private insertEventQuery(event: EventSaveModel) {
        return this.db.query(insertEventQuery(event));
    }

    private validateEvent(event: EventSaveModel) {
        if (!event) {
            throw new Error('Event is empty');
        }

        if (!event.type) {
            throw new Error('Event type is not defined');
        }

        if (!event.version) {
            throw new Error('Event version is not defined');
        }

        if (!event.payload) {
            throw new Error('Event payload is not defined');
        }

        return Promise.resolve(event);
    }

    private mapRow(row: any): Event {
        return {
            id: row.id,
            type: row.type,
            payload: row.payload,
            version: row.version,
            created: row.created
        };
    }
}
