/* tslint:disable:no-expression-statement */
/* tslint:disable:no-unused-expression */

import { assert, expect, use } from 'chai';
import { stub } from 'sinon';
import * as sinonChai from 'sinon-chai';

import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import { TokenProvider } from './tokenProvider';

const secret = 'TestSecret';

function mockStore(user: any) {
    return {
        getUserById: stub().returns(Promise.resolve(user))
    };
}

test('should generate jwt token', async () => {
    const user = {id: 8};
    const auth = new TokenProvider(({ auth: { secret: 'TestSecret' }} as any));
    const timestamp = moment().subtract(1, 'day').toDate();
    const token = auth.generateToken(user as any, timestamp);
    const result: any = jwt.decode(token, { json: true });
    expect(token).to.be;
    expect(typeof token).equals('string');
    expect(result.id).equals(8);
});
