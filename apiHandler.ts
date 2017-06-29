import * as db from './database';

function insertEventQuery(type, payload) {
    return {
        text: 'INSERT INTO event(type, payload) VALUES($1, $2);',
        values: [type, payload]
    };
};

function getAllEventsQuery() {
    return {
        name: 'get_all_events',
        text: 'SELECT * FROM event;',
    };
};

function insertEvent(type, payload) {
    let query = insertEventQuery(type, payload);
    return db.query(query);
}

class HandlerResult {
    get content() { return this._content; }
    get status() { return this._status; }

    constructor(private _content: string, private _status?: number) { }
}

function sqlQuery(query): Promise<HandlerResult> {
    return db.query(query)
        .then(res => new HandlerResult(JSON.stringify({ results: res.rows })))
        .catch(err => new HandlerResult(`Query error: ${err.message}, ${err.stack}`, 500));
}

const handlers = {
    '/api/insert': () => sqlQuery(insertEvent('test', { q: 1 })),
    '/api/getall': () => sqlQuery(getAllEventsQuery())
};

function handleApiRequest(url: string): Promise<HandlerResult> {
    let handler = handlers[url];
    if (!handler) {
        return Promise.resolve(new HandlerResult(`Not found ${url}`, 404))
    }

    return handler();
}

export {handleApiRequest};