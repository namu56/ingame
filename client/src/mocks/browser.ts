import { login, logout } from './handlers/auth';
import { setupWorker } from 'msw/browser';
import { signup } from './handlers/users';
import { getRanking } from './handlers/ranking';

export const handlers = [login, logout, signup, getRanking];

export const worker = setupWorker(...handlers);
