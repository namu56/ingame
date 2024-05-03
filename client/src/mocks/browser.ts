import { login } from './auth';
import { setupWorker } from 'msw/browser';
import { signup } from './users';

export const handlers = [login, signup];
export const worker = setupWorker(...handlers);
