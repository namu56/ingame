import { login } from './handlers/auth';
import { setupWorker } from 'msw/browser';

export const handlers = [login];
export const worker = setupWorker(...handlers);
