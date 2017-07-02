import { User } from '../../models/user';
import { Database } from './database';

function getUserByIdQuery(userId: string) {
    return {
        text: 'SELECT * FROM users WHERE id = $1;',
        values: [userId]
    };
}

function getUserByUsernamePasswordQuery(username: string, plainPassword: string) {
    return {
        text: 'SELECT * FROM get_user($1, $2)',
        values: [username, plainPassword]
    };
}

export class UserStore {
    constructor(private db: Database) { }

    public getUserById(userId: string): Promise<User | null> {
        return this.db.query(getUserByIdQuery(userId)).then(rows => this.mapUserFromRows(rows));
    }

    public getUser(userName: string, plainPassword: string): Promise<User | null> {
        return this.db.query(getUserByUsernamePasswordQuery(userName, plainPassword))
            .then(rows => this.mapUserFromRows(rows));
    }

    private mapUserFromRows(rows: ReadonlyArray<any>): User | null {
        if (rows.length === 0) {
            return null;
        }
        if (rows.length > 1) {
            throw new Error(`Found ${rows.length} users expected 1`);
        }
        const row = rows[0];
        return {
            id: row.id,
            userName: row.user_name
        };
    }
}
