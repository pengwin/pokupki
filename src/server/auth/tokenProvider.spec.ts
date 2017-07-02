/* tslint:disable:no-expression-statement */

import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import { TokenProvider } from './tokenProvider';

const secret = 'TestSecret';

function mockStore(user) {
    return {
        getUserById: jest.fn().mockReturnValue(Promise.resolve(user))
    };
}

test('should generate jwt token', async () => {
    const user = {id: 8};
    const auth = new TokenProvider(secret);
    const timestamp = moment().subtract(1, 'day').toDate();
    const token = auth.generateToken(user as any, timestamp);
    const result: any = jwt.decode(token, { json: true });
    expect(token).toBeDefined();
    expect(typeof token).toEqual('string');
    expect(result.id).toEqual(8);
});
