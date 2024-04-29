import { login } from './auth';
import { setupWorker } from 'msw/browser';

export const handlers = [login];
console.log(login);
export const worker = setupWorker(...handlers);
