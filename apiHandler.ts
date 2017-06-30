import * as db from './database';
import * as Hapi from 'hapi';
import * as pg from 'pg';

function insertEventQuery(type: string, payload: any) {
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


function mapQueryResult(queryResult) {
    return queryResult.rows;
}

function sqlQuery(query: pg.QueryConfig, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> {
    return db.query(query)
        .then(res => reply.response(mapQueryResult(res)))
        .catch(err => {
            let error = new Error(`Query ${query.text} error: ${err.message}, ${err.stack}`);
            console.log(error);
            return reply(error);
        });
}

interface Event {
    type: string;
    payload: any;
}

const insertHandler = (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => sqlQuery(insertEventQuery(request.payload.type, request.payload.payload), reply);
const getAllHandler = (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => sqlQuery(getAllEventsQuery(), reply);

export { insertHandler };
export { getAllHandler };