import * as Hapi from 'hapi';
import * as hapiAuthJwt2 from 'hapi-auth-jwt2';

import { injectable } from 'inversify';

import * as moment from 'moment';
import { User } from '../../models/user';
import { Configuration } from '../configuration';
import { UserStore } from '../db/userStore';
import { Request } from '../handlers';

type validateCallback = (err: Error | null, isValid: boolean, creadentials?: any) => void;

@injectable()
export class AuthProvider {
    constructor(private userStore: UserStore, private configuration: Configuration) { }

    public registerAuth(server: Hapi.Server) {
        return server.register({ register: require('hapi-auth-jwt2') }).then(err => {
            if (err) {
                throw err;
            }

            // tslint:disable-next-line:no-expression-statement
            server.auth.strategy('token', 'jwt', this.authSettings);
            // tslint:disable-next-line:no-expression-statement
            server.auth.default('token');
        });
    }

    private get authSettings(): hapiAuthJwt2.Options {
        return {
            key: this.configuration.auth.secret,
            validateFunc: this.validate.bind(this),
            verifyOptions: { algorithms: ['HS256'] },
            headerKey: 'authorization',
            urlKey: false,
            cookieKey: false
        };
    }

    private validate(decoded: any, request: Hapi.Request, callback: hapiAuthJwt2.ValidateCallback) {
        try {
            if (!decoded.timestamp) {
                return callback(null, false);
            }
            const now = moment();
            const timestamp = moment(decoded.timestamp);
            if (now.diff(timestamp, 'day') >= 1) {
                return callback(null, false);
            }
            return this.userStore.getUserById(decoded.id).then(user => {
                if (!user) {
                    return callback(null, false);
                }
                return callback(null, true, user);
            })
            .catch(err => callback(err, false));
        } catch (err) {
            return callback(err, false);
        }
    }
}
