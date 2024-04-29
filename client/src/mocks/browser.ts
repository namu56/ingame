import { login } from './auth';
import { setupWorker } from 'msw/browser';

export const handlers = [login];
export const worker = setupWorker(...handlers);
