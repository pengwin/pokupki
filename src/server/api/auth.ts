import * as moment from 'moment';

import { TokenProvider } from '../auth/tokenProvider';
import { UserStore } from '../db/userStore';
import { Reply, Request, RequestHandler } from '../requestHandler';

import { Logger } from '../../utils/logger';

import { EventSaveModel } from '../../models/event';

export class ApiAuthHandler {
    constructor(private store: UserStore, private tokenProvider: TokenProvider) { }

    get loginHandler(): RequestHandler {
        return {
            handler: this.login.bind(this),
            method: 'POST',
            url: '/api/login',
            metaData: {
                description: 'Authenticate user and returns jwt token.',
                notes: 'Handles object with structure {name: string, password: string}',
                tags: ['api', 'login']
            }
        };
    }

    private login(request: Request, reply: Reply) {
        return this.store.getUser(request.payload.name, request.payload.password)
            .then(user => {
                if (!user) {
                    return reply
                        .response({ error: 'Unknown user' })
                        .code(400);
                }
                const now = new Date();
                const token = this.tokenProvider.generateToken(user, now);
                return reply.response({ token });
            })
            .catch(err => {
                // tslint:disable-next-line:no-expression-statement
                Logger.error(err);
                return reply(err);
            });
    }
}
