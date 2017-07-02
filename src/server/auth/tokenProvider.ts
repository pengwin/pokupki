import * as Hapi from 'hapi';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import { User } from '../../models/user';

type validateCallback = (err: Error | null, isValid: boolean, creadentials?: any) => void;

export class TokenProvider {
    constructor(private secret: string) { }

    public generateToken(user: User, timestamp: Date): string {
        const obj = { id: user.id, timestamp: moment(timestamp).utc().toISOString() };
        return jwt.sign(obj, this.secret);
    }
}
