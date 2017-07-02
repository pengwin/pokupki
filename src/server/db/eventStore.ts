import { Event, EventSaveModel } from '../../models/event';
import { Database } from './database';

function insertEventQuery(event: EventSaveModel) {
    return {
        text: 'INSERT INTO events(type, version, payload, user_id) VALUES($1, $2, $3, $4);',
        values: [event.type, event.version, event.payload, event.userId]
    };
}

function getAllEventsQuery(userId: string) {
    return {
        name: `get_all_events_${userId}`,
        text: 'SELECT * FROM events WHERE user_id = $1;',
        values: [userId]
    };
}

export class EventStore {
    constructor(private db: Database) { }

    public getAll(userId: string) {
        return this.db.query(getAllEventsQuery(userId)).then(rows => rows.map(row => this.mapRow(row)));
    }

    public insert(event: EventSaveModel) {
        return this.validateEvent(event).then(e => this.insertEventQuery(e));
    }

    private insertEventQuery(event: EventSaveModel) {
        return this.db.query(insertEventQuery(event));
    }

    private validateEvent(event: EventSaveModel) {
        if (!event) {
             return Promise.reject(new Error('Event is empty'));
        }

        if (!event.type) {
            return Promise.reject(new Error('Event type is not defined'));
        }

        if (!event.version) {
            return Promise.reject(new Error('Event version is not defined'));
        }

        if (!event.userId) {
            return Promise.reject(new Error('Event userId is not defined'));
        }

        if (!event.payload) {
            return Promise.reject(new Error('Event payload is not defined'));
        }

        return Promise.resolve(event);
    }

    private mapRow(row: any): Event {
        return {
            id: row.id,
            type: row.type,
            userId: row.user_id,
            payload: row.payload,
            version: row.version,
            created: row.created
        };
    }
}
