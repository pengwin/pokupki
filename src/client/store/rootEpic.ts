import { combineEpics } from 'redux-observable';

import { authEpic } from './auth/epics';
import { domainEpic } from './domain/epics';
import { uiEpic } from './ui/epics';

export const rootEpic = combineEpics(authEpic, domainEpic, uiEpic);
