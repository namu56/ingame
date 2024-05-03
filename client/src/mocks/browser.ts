import { login } from './handlers/auth';
import { setupWorker } from 'msw/browser';
import { getRanking } from './handlers/ranking';

export const handlers = [login, getRanking];
export const worker = setupWorker(...handlers);
