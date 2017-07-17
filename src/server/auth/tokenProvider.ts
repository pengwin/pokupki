import * as Hapi from 'hapi';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import { injectable } from 'inversify';

import { User } from '../../models/user';
import { Configuration } from '../configuration';

type validateCallback = (err: Error | null, isValid: boolean, creadentials?: any) => void;

@injectable()
export class TokenProvider {
    constructor(private configuration: Configuration) { }

    public generateToken(user: User, timestamp: Date): string {
        const obj = { id: user.id, timestamp: moment(timestamp).utc().toISOString() };
        return jwt.sign(obj, this.configuration.auth.secret);
    }
}
