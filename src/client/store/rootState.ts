import { AuthState } from './auth/state';
import { DomainState } from './domain/state';

export interface RootState {
    readonly auth: AuthState;
    readonly domain: DomainState;
}
